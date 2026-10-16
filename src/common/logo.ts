type LabType = [number, number, number];

const SHIELD =
  'M211.2 13.2A84 84 0 0 1 300.8 13.2L457.6 112A48 48 0 0 1 480 152.6L480 358.9A48 48 0 0 1 457.6 399.5L300.8 498.3A84 84 0 0 1 211.2 498.3L54.4 399.5A48 48 0 0 1 32 358.9L32 152.6A48 48 0 0 1 54.4 112Z';

const to_linear = (channel: number) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
const to_gamma = (channel: number) => (channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055);

const to_lab = (hex: string): LabType => {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map(index => to_linear(parseInt(hex.slice(index, index + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};

const to_hex = ([lightness, a, b]: LabType) => {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return `#${rgb
    .map(channel =>
      Math.round(Math.min(1, Math.max(0, to_gamma(channel))) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

const shade = ([lightness, a, b]: LabType, light: number, chroma: number) => to_hex([lightness * light, a * chroma, b * chroma]);
const tint = ([lightness, a, b]: LabType, light: number, chroma: number) => to_hex([lightness + (1 - lightness) * light, a * chroma, b * chroma]);

const logo_tones = (accent: string) => {
  const lab = to_lab(accent);
  return [shade(lab, 0.363, 0.41), shade(lab, 0.538, 0.6), shade(lab, 0.722, 0.87), accent, tint(lab, 0.67, 0.64), tint(lab, 0.835, 0.31)];
};

const band = (y: number) => `M-40 -40L552 -40L552 ${y}L300.8 ${y + 158.3}A84 84 0 0 1 211.2 ${y + 158.3}L-40 ${y}Z`;

const face = (base = '', lower = '', middle = '', top = '') =>
  `<rect width="512" height="512" fill="${base}"/><path fill="${lower}" d="${band(253)}"/><path fill="${middle}" d="${band(166)}"/><path fill="${top}" d="${band(79)}"/>`;

const logo_svg = ([darkest, darker, dark, accent, light, lightest]: string[]) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><clipPath id="strata-s"><path d="${SHIELD}"/></clipPath><clipPath id="strata-r"><rect x="256" width="256" height="512"/></clipPath></defs><g clip-path="url(#strata-s)">${face(darker, dark, accent, lightest)}<g clip-path="url(#strata-r)">${face(darkest, darker, dark, light)}</g></g></svg>`;

export { logo_svg, logo_tones };
