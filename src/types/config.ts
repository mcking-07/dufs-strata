type PaletteType = {
  bg: string;
  surface: string;
  elevated: string;
  border: string;
  text: string;
  muted: string;
  dim: string;
  accent: string;
  on_accent: string;
  red: string;
  green: string;
};

type FooterType = { text: string; label: string; href: string };

type FontsType = { sans: string; mono: string; google: boolean };

type UploadConfigType = { chunk_size: number };

type ThemeModeType = 'dark' | 'light' | 'system';

type LogoType = { tones: string[]; file: string | null };

type ConfigType = {
  title: string;
  theme: ThemeModeType;
  footer: FooterType | false;
  fonts: FontsType;
  colors: { dark: PaletteType; light: PaletteType };
  logo: LogoType;
  upload: UploadConfigType;
};

type ResolvedConfigType = { config: ConfigType; issues: string[] };

type OverridesType = {
  title?: string;
  theme?: ThemeModeType;
  footer?: Partial<FooterType> | false;
  fonts?: Partial<FontsType>;
  colors?: { dark?: Partial<PaletteType>; light?: Partial<PaletteType> };
  logo?: string[] | string;
  upload?: Partial<UploadConfigType>;
};

export type { ConfigType, FontsType, FooterType, LogoType, OverridesType, PaletteType, ResolvedConfigType, ThemeModeType, UploadConfigType };
