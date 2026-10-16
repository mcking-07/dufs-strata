import { safe } from 'safe-wrapper';
import { logo_svg } from '../common';
import { InvalidConfig, NetworkFailed, RequestFailed } from '../errors';
import type { LogoType } from '../types';

const ASSETS_PREFIX = '__ASSETS_PREFIX__';
const CONFIG_FILE = 'config.json';
const TIMEOUT_MS = 1500;

const asset_url = (name: string) => `${ASSETS_PREFIX}${name}`;

const load_overrides = async (): Promise<unknown> => {
  const [error, response] = await safe(() => fetch(asset_url(CONFIG_FILE), { cache: 'no-cache', signal: AbortSignal.timeout(TIMEOUT_MS) }))();
  if (error || !response) throw new NetworkFailed(`couldn't load ${CONFIG_FILE}, using defaults`, { cause: error?.message });
  if (response.status === 404) return {};
  if (!response.ok) throw new RequestFailed(`couldn't load ${CONFIG_FILE}, using defaults`, response.status);
  const [invalid, overrides] = await safe(() => response.json() as Promise<unknown>)();
  if (invalid) throw new InvalidConfig(`invalid config: ${CONFIG_FILE} is not valid json`);
  return overrides;
};

const logo_src = ({ tones, file }: LogoType) => (file ? asset_url(file) : `data:image/svg+xml,${encodeURIComponent(logo_svg(tones))}`);

export { load_overrides, logo_src };
