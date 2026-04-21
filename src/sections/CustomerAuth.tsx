'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import {
  useTheme,
  useCustomerAuth,
  register as apiRegister,
  forgotPassword as apiForgotPassword,
  verifyOtp as apiVerifyOtp,
  resetPassword as apiResetPassword,
  getStorePermalink,
} from '@zevcommerce/storefront-api';

/**
 * Shared auth surface for login / register / forgot-password / reset
 * / account. Which view renders is controlled by `settings.mode` in
 * preset.json so one registered section handles every auth template.
 *
 * Forms are intentionally plain — the starter theme's look is mostly
 * carried by a single primary color (`--color-primary`). Keep the
 * markup simple so merchants who tweak brand colors don't have to
 * reason about block-by-block theming.
 */
type AuthMode = 'login' | 'register' | 'forgot-password' | 'account';

const PRIMARY = 'var(--color-primary, #2563EB)';

export default function CustomerAuth({ settings }: { settings?: { mode?: AuthMode } }) {
  const mode: AuthMode = settings?.mode ?? 'login';
  const { theme } = useTheme();
  const storeConfig = theme?.storeConfig;
  const accountCfg = (storeConfig as any)?.accountConfig ?? {};
  const registrationEnabled = accountCfg.registrationEnabled !== false;
  const loginEnabled = accountCfg.loginEnabled !== false;

  // Merchant disabled customer accounts entirely — render a friendly
  // placeholder instead of a form that would fail on submit.
  if (!loginEnabled) {
    return (
      <section className="max-w-md mx-auto px-5 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Customer accounts are not available</h1>
        <p className="text-sm text-gray-500">
          This store hasn't enabled shopper accounts yet.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto px-5 py-12 md:py-16">
      {mode === 'login' && <LoginView registrationEnabled={registrationEnabled} />}
      {mode === 'register' && <RegisterView requiredFields={accountCfg.requiredFields || ['email']} />}
      {mode === 'forgot-password' && <ForgotPasswordView />}
      {mode === 'account' && <AccountView />}
    </section>
  );
}

// ── Shared form primitives ──────────────────────────────────────────────

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full h-11 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
        style={{
          ['--tw-ring-color' as any]: PRIMARY,
        }}
      />
    </label>
  );
}

function PrimaryButton({
  loading,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className="w-full h-11 rounded-lg font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
      style={{ backgroundColor: PRIMARY }}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
      {message}
    </p>
  );
}

function extractError(err: any, fallback: string): string {
  return err?.response?.data?.message || err?.message || fallback;
}

// ── Login ───────────────────────────────────────────────────────────────

function LoginView({ registrationEnabled }: { registrationEnabled: boolean }) {
  const router = useRouter();
  const params = useParams();
  const domain = (params?.domain as string) || '';
  const { login } = useCustomerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push(getStorePermalink(domain, '/account'));
    } catch (err) {
      setError(extractError(err, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Enter your details below.</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        <ErrorMessage message={error} />
        <PrimaryButton type="submit" loading={loading}>
          Sign in
        </PrimaryButton>
        <Link
          href={getStorePermalink(domain, '/account/forgot-password')}
          className="block text-center text-xs text-gray-500 hover:text-gray-900"
        >
          Forgot your password?
        </Link>
      </form>

      {registrationEnabled && (
        <p className="text-center text-sm text-gray-600 pt-2 border-t border-gray-100">
          New here?{' '}
          <Link
            href={getStorePermalink(domain, '/register')}
            className="font-semibold hover:underline"
            style={{ color: PRIMARY }}
          >
            Create an account
          </Link>
        </p>
      )}
    </div>
  );
}

// ── Register ────────────────────────────────────────────────────────────

function RegisterView({ requiredFields }: { requiredFields: string[] }) {
  const router = useRouter();
  const params = useParams();
  const domain = (params?.domain as string) || '';
  const { theme } = useTheme();
  const storeId = theme?.storeConfig?.id as string | undefined;
  const { login } = useCustomerAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needs = (field: string) => requiredFields.includes(field);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      await apiRegister(domain, storeId, form);
      // Immediately authenticate — the store's backend sets the tokens
      // but useCustomerAuth doesn't know about them until it sees a
      // fresh login call. Re-running login is safe and consistent.
      await login(form.email, form.password);
      router.push(getStorePermalink(domain, '/account'));
    } catch (err) {
      setError(extractError(err, 'Could not create your account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-gray-500 mt-1">Sign up to check out faster next time.</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="First name"
            value={form.firstName}
            onChange={(v) => setForm({ ...form, firstName: v })}
            required={needs('firstName')}
            autoComplete="given-name"
          />
          <FormField
            label="Last name"
            value={form.lastName}
            onChange={(v) => setForm({ ...form, lastName: v })}
            required={needs('lastName')}
            autoComplete="family-name"
          />
        </div>
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          required
          autoComplete="email"
        />
        {needs('phone') && (
          <FormField
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            autoComplete="tel"
          />
        )}
        <FormField
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          required
          autoComplete="new-password"
        />
        <ErrorMessage message={error} />
        <PrimaryButton type="submit" loading={loading}>
          Create account
        </PrimaryButton>
      </form>
      <p className="text-center text-sm text-gray-600 pt-2 border-t border-gray-100">
        Already have an account?{' '}
        <Link
          href={getStorePermalink(domain, '/login')}
          className="font-semibold hover:underline"
          style={{ color: PRIMARY }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

// ── Forgot / Reset Password ─────────────────────────────────────────────

function ForgotPasswordView() {
  const params = useParams();
  const router = useRouter();
  const domain = (params?.domain as string) || '';
  const { theme } = useTheme();
  const storeId = theme?.storeConfig?.id as string | undefined;
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      await apiForgotPassword(domain, storeId, { email });
      setStep('verify');
    } catch (err) {
      setError(extractError(err, 'Could not send reset code'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      await apiVerifyOtp(domain, storeId, { email, code });
      setStep('reset');
    } catch (err) {
      setError(extractError(err, 'Invalid or expired code'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      await apiResetPassword(domain, storeId, { email, code, password });
      router.push(getStorePermalink(domain, '/login'));
    } catch (err) {
      setError(extractError(err, 'Could not reset your password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-sm text-gray-500 mt-1">
          {step === 'request' && "Enter your email and we'll send you a code."}
          {step === 'verify' && `Enter the 6-digit code we sent to ${email}.`}
          {step === 'reset' && 'Pick a new password for your account.'}
        </p>
      </div>

      {step === 'request' && (
        <form onSubmit={handleRequest} className="space-y-4">
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
          />
          <ErrorMessage message={error} />
          <PrimaryButton type="submit" loading={loading}>
            Send reset code
          </PrimaryButton>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerify} className="space-y-4">
          <FormField
            label="Verification code"
            value={code}
            onChange={setCode}
            placeholder="123456"
            required
            autoComplete="one-time-code"
          />
          <ErrorMessage message={error} />
          <PrimaryButton type="submit" loading={loading}>
            Continue
          </PrimaryButton>
          <button
            type="button"
            onClick={() => setStep('request')}
            className="block text-center text-xs text-gray-500 hover:text-gray-900 w-full"
          >
            Use a different email
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="space-y-4">
          <FormField
            label="New password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
          />
          <ErrorMessage message={error} />
          <PrimaryButton type="submit" loading={loading}>
            Reset password
          </PrimaryButton>
        </form>
      )}

      <Link
        href={getStorePermalink(domain, '/login')}
        className="block text-center text-xs text-gray-500 hover:text-gray-900"
      >
        Back to sign in
      </Link>
    </div>
  );
}

// ── Account (logged-in) ─────────────────────────────────────────────────

function AccountView() {
  const params = useParams();
  const router = useRouter();
  const domain = (params?.domain as string) || '';
  const { customer, isAuthenticated, logout } = useCustomerAuth();

  // Kick unauthenticated visitors back to the sign-in page.
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.replace(getStorePermalink(domain, '/login'));
    }
    return null;
  }

  const name =
    [customer?.firstName, customer?.lastName].filter(Boolean).join(' ').trim() ||
    customer?.email ||
    'there';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hi, {name}</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account below.</p>
      </div>

      <div className="grid gap-3">
        <Link
          href={getStorePermalink(domain, '/account/orders')}
          className="block rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition"
        >
          <div className="font-semibold text-sm">Order history</div>
          <div className="text-xs text-gray-500 mt-0.5">Track your past and current orders.</div>
        </Link>
        <Link
          href={getStorePermalink(domain, '/account/profile')}
          className="block rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition"
        >
          <div className="font-semibold text-sm">Profile</div>
          <div className="text-xs text-gray-500 mt-0.5">Update your details and addresses.</div>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => {
          logout();
          router.push(getStorePermalink(domain, '/'));
        }}
        className="text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        Sign out
      </button>
    </div>
  );
}

export const schema = {
  type: 'customer-auth',
  name: 'Customer account',
  limit: 1,
  settings: [],
};
