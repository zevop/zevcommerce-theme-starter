import { defineTheme } from '@zevcommerce/theme-sdk';
import { settingsSchema } from './settings';
import { starterSectionRegistry, starterBlockRegistry } from './registry';
import preset from './preset.json';

const theme = defineTheme({
  handle: 'starter',
  name: 'Starter',
  version: '1.0.0',
  author: {
    name: 'ZevCommerce',
    url: 'https://zevcommerce.com',
  },
  description: 'A simple, mobile-first theme for ZevCommerce — perfect for getting started quickly.',
  tags: ['simple', 'mobile-first', 'starter', 'minimal', 'responsive'],
  settingsSchema,
  defaultPreset: preset as any,
  registry: {
    sections: starterSectionRegistry,
    blocks: starterBlockRegistry,
  },
});

export default theme;
export { settingsSchema } from './settings';
export { starterSectionRegistry, starterBlockRegistry } from './registry';
