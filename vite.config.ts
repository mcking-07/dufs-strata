import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { type Plugin, defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { appearance_css, logo_svg } from './src/common';
import { DEFAULTS, defaults_file } from './src/config';

const PLACEHOLDERS = ['__INDEX_DATA__', '__ASSETS_PREFIX__'];

const escape_html = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const defaults = (): Plugin => ({
  name: 'strata-defaults',
  transformIndexHtml: source => ({
    html: source.replace('__DEFAULT_THEME__', DEFAULTS.theme),
    tags: [
      { tag: 'style', children: appearance_css(DEFAULTS), injectTo: 'head-prepend' },
      { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: `data:image/svg+xml,${encodeURIComponent(logo_svg(DEFAULTS.logo.tones))}` } },
      { tag: 'title', children: escape_html(DEFAULTS.title) },
    ],
  }),
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'config.json', source: `${JSON.stringify(defaults_file(), null, 2)}\n` });
  },
  writeBundle(_, bundle) {
    const output = bundle['index.html'];
    const source = output?.type === 'asset' ? String(output.source) : '';
    const broken = PLACEHOLDERS.filter(placeholder => source.split(placeholder).length !== 2);
    if (broken.length) throw new Error(`index.html must contain ${broken.join(', ')} exactly once`);
  },
});

export default defineConfig({
  plugins: [defaults(), react(), tailwindcss(), viteSingleFile()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: Infinity,
  },
});
