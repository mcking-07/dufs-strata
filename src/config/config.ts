import { logo_tones } from '../common';
import type { ConfigType, FooterType, LogoType, OverridesType, PaletteType, ResolvedConfigType, ThemeModeType } from '../types';

const HEX = /^#[0-9a-f]{6}$/i;

const MINIMUM_CHUNK = 1024 * 1024;

const THEME_MODES = new Set<unknown>(['dark', 'light', 'system']);

const AUTO_LOGO = 'auto';

const FOOTER: FooterType = { text: 'made with ♥ by', label: '@mcking-07', href: 'https://github.com/mcking-07' };

const DEFAULTS: ConfigType = {
  title: 'Shared',
  theme: 'system',
  footer: FOOTER,
  fonts: { sans: '"DM Sans", sans-serif', mono: '"JetBrains Mono", monospace', google: true },
  colors: {
    dark: {
      bg: '#111113',
      surface: '#1c1c1f',
      elevated: '#27272a',
      border: '#2e2e32',
      text: '#fafafa',
      muted: '#a1a1aa',
      dim: '#52525b',
      accent: '#f59e0b',
      on_accent: '#000000',
      red: '#ef4444',
      green: '#22c55e',
    },
    light: {
      bg: '#fafafa',
      surface: '#ffffff',
      elevated: '#f4f4f5',
      border: '#e4e4e7',
      text: '#18181b',
      muted: '#71717a',
      dim: '#a1a1aa',
      accent: '#d97706',
      on_accent: '#000000',
      red: '#ef4444',
      green: '#22c55e',
    },
  },
  logo: { tones: ['#451a03', '#78350f', '#b45309', '#f59e0b', '#fde68a', '#fef3c7'], file: null },
  upload: { chunk_size: 64 * 1024 * 1024 },
};

const is_object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const is_text = (value: unknown): value is string => typeof value === 'string' && !!value.trim();
const is_hex = (value: unknown): value is string => typeof value === 'string' && HEX.test(value);
const is_mode = (value: unknown): value is ThemeModeType => THEME_MODES.has(value);
const is_flag = (value: unknown): value is boolean => typeof value === 'boolean';
const is_chunk = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= MINIMUM_CHUNK;

const resolve = (input: unknown): ResolvedConfigType => {
  const issues: string[] = [];

  const section = (value: unknown, shape: object, path: string) => {
    if (value === undefined) return {};
    if (!is_object(value)) {
      issues.push(path ? `${path} (must be an object)` : 'everything (the file must be a json object)');
      return {};
    }
    for (const key of Object.keys(value)) if (!(key in shape)) issues.push(`${path ? `${path}.` : ''}${key} (unknown key)`);
    return value;
  };

  const pick = <Value>(value: unknown, fallback: Value, valid: (candidate: unknown) => candidate is Value, path: string, reason: string): Value => {
    if (value === undefined) return fallback;
    if (valid(value)) return value;
    issues.push(`${path} (${reason})`);
    return fallback;
  };

  const palette = (value: unknown, base: PaletteType, path: string): PaletteType => {
    const entries = section(value, base, path);
    return Object.fromEntries(Object.entries(base).map(([key, fallback]) => [key, pick(entries[key], fallback, is_hex, `${path}.${key}`, 'must be a #rrggbb colour')])) as PaletteType;
  };

  const footer = (value: unknown): FooterType | false => {
    if (value === false) return false;
    const entries = section(value, FOOTER, 'footer');
    return {
      text: pick(entries.text, FOOTER.text, is_text, 'footer.text', 'must be a non-empty string'),
      label: pick(entries.label, FOOTER.label, is_text, 'footer.label', 'must be a non-empty string'),
      href: pick(entries.href, FOOTER.href, is_text, 'footer.href', 'must be a non-empty string'),
    };
  };

  const brand = (value: unknown, accent: string): LogoType => {
    const auto = accent === DEFAULTS.colors.dark.accent ? DEFAULTS.logo : { tones: logo_tones(accent), file: null };
    if (value === undefined || value === AUTO_LOGO) return auto;
    if (is_text(value)) return { tones: auto.tones, file: value };
    if (Array.isArray(value) && value.length === 6 && value.every(is_hex)) return { tones: value, file: null };
    issues.push(`logo (must be "${AUTO_LOGO}", a file name, or six #rrggbb colours)`);
    return auto;
  };

  const root = section(input, DEFAULTS, '');
  const fonts = section(root.fonts, DEFAULTS.fonts, 'fonts');
  const colors = section(root.colors, DEFAULTS.colors, 'colors');
  const upload = section(root.upload, DEFAULTS.upload, 'upload');
  const dark = palette(colors.dark, DEFAULTS.colors.dark, 'colors.dark');

  const config: ConfigType = {
    title: pick(root.title, DEFAULTS.title, is_text, 'title', 'must be a non-empty string'),
    theme: pick(root.theme, DEFAULTS.theme, is_mode, 'theme', 'must be "dark", "light" or "system"'),
    footer: footer(root.footer),
    fonts: {
      sans: pick(fonts.sans, DEFAULTS.fonts.sans, is_text, 'fonts.sans', 'must be a non-empty string'),
      mono: pick(fonts.mono, DEFAULTS.fonts.mono, is_text, 'fonts.mono', 'must be a non-empty string'),
      google: pick(fonts.google, DEFAULTS.fonts.google, is_flag, 'fonts.google', 'must be true or false'),
    },
    colors: { dark, light: palette(colors.light, DEFAULTS.colors.light, 'colors.light') },
    logo: brand(root.logo, dark.accent),
    upload: { chunk_size: pick(upload.chunk_size, DEFAULTS.upload.chunk_size, is_chunk, 'upload.chunk_size', `must be a whole number of bytes, at least ${MINIMUM_CHUNK}`) },
  };

  return { config, issues };
};

const defaults_file = (): OverridesType => ({ ...DEFAULTS, logo: AUTO_LOGO });

const config: ConfigType = structuredClone(DEFAULTS);

const bootstrap = (input: unknown) => {
  const { config: resolved, issues } = resolve(input);
  Object.assign(config, resolved);
  return issues;
};

export { bootstrap, config, DEFAULTS, defaults_file };
