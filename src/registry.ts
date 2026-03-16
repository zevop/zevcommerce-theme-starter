import Header from './sections/Header';
import { schema as HeaderSchema } from './sections/Header';
import Announcement from './sections/Announcement';
import { schema as AnnouncementSchema } from './sections/Announcement';
import Hero from './sections/Hero';
import { schema as HeroSchema } from './sections/Hero';
import FeaturedProducts from './sections/FeaturedProducts';
import { schema as FeaturedProductsSchema } from './sections/FeaturedProducts';
import ContactInfo from './sections/ContactInfo';
import { schema as ContactInfoSchema } from './sections/ContactInfo';
import Footer from './sections/Footer';
import { schema as FooterSchema } from './sections/Footer';
import ProductDetail from './sections/ProductDetail';
import { schema as ProductDetailSchema } from './sections/ProductDetail';
import ProductList from './sections/ProductList';
import { schema as ProductListSchema } from './sections/ProductList';
import CartSection from './sections/CartSection';
import { schema as CartSectionSchema } from './sections/CartSection';
import CheckoutSection from './sections/CheckoutSection';
import { schema as CheckoutSectionSchema } from './sections/CheckoutSection';

export const starterSectionRegistry: Record<string, { component: any; schema: any }> = {
  'header': { component: Header as any, schema: HeaderSchema },
  'announcement': { component: Announcement as any, schema: AnnouncementSchema },
  'hero': { component: Hero as any, schema: HeroSchema },
  'featured-products': { component: FeaturedProducts as any, schema: FeaturedProductsSchema },
  'contact-info': { component: ContactInfo as any, schema: ContactInfoSchema },
  'footer': { component: Footer as any, schema: FooterSchema },
  'product-detail': { component: ProductDetail as any, schema: ProductDetailSchema },
  'product-list': { component: ProductList as any, schema: ProductListSchema },
  'cart-page': { component: CartSection as any, schema: CartSectionSchema },
  'checkout-page': { component: CheckoutSection as any, schema: CheckoutSectionSchema },
};

export const starterBlockRegistry: Record<string, { component: any; schema: any }> = {};
