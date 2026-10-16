import { safe } from 'safe-wrapper';
import type { ConfigType, PaletteType, ThemeModeType, ThemeType } from '../types';

const APPEARANCE_KEY = 'strata-appearance';
const THEME_KEY = 'strata-theme';
const DEFAULT_THEME_KEY = 'strata-default-theme';
const STYLE_ID = 'strata-appearance';
const FONTS_ID = 'strata-fonts';
const PREFERS_LIGHT = '(prefers-color-scheme: light)';

const variables = (palette: PaletteType, accent_alpha: number) =>
  [...Object.entries(palette).map(([key, value]) => `--color-${key.replaceAll('_', '-')}:${value}`), `--color-accent-dim:color-mix(in srgb,${palette.accent} ${accent_alpha}%,transparent)`].join(';');

const family = (stack: string, weights: string) => {
  const name =
    stack
      .split(',')[0]
      ?.trim()
      .replace(/^["']|["']$/g, '') ?? stack;
  return `family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@${weights}`;
};

const appearance_css = ({ colors, fonts }: ConfigType) => `:root{${variables(colors.dark, 12)};--font-sans:${fonts.sans};--font-mono:${fonts.mono}}:root.light{${variables(colors.light, 8)}}`;

const fonts_url = ({ fonts }: ConfigType) => `https://fonts.googleapis.com/css2?${family(fonts.sans, '400;500;600')}&${family(fonts.mono, '400;500')}&display=swap`;

const element = <Tag extends 'style' | 'link'>(tag: Tag, id: string): HTMLElementTagNameMap[Tag] => {
  const existing = document.getElementById(id);
  if (existing instanceof (tag === 'style' ? HTMLStyleElement : HTMLLinkElement)) return existing as HTMLElementTagNameMap[Tag];
  const created = document.createElement(tag);
  created.id = id;
  document.head.appendChild(created);
  return created;
};

const show_theme = (theme: ThemeType) => document.documentElement.classList.toggle('light', theme === 'light');

const choose_theme = (theme: ThemeType) => {
  show_theme(theme);
  safe(() => localStorage.setItem(THEME_KEY, theme))();
};

const apply_theme = (mode: ThemeModeType) => {
  safe(() => localStorage.setItem(DEFAULT_THEME_KEY, mode))();
  const follow = () => {
    const [, chosen] = safe(() => localStorage.getItem(THEME_KEY))();
    if (chosen) return;
    show_theme(mode === 'system' ? (matchMedia(PREFERS_LIGHT).matches ? 'light' : 'dark') : mode);
  };
  follow();
  if (mode === 'system') matchMedia(PREFERS_LIGHT).addEventListener('change', follow);
};

const apply_appearance = (config: ConfigType, icon: string) => {
  const css = appearance_css(config);
  element('style', STYLE_ID).textContent = css;
  safe(() => localStorage.setItem(APPEARANCE_KEY, css))();
  apply_theme(config.theme);

  const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (favicon) favicon.href = icon;

  if (!config.fonts.google) return;
  const fonts = element('link', FONTS_ID);
  fonts.rel = 'stylesheet';
  fonts.href = fonts_url(config);
};

export { appearance_css, apply_appearance, choose_theme };
