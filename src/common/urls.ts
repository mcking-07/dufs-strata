import { is_dir } from './files';
import type { CrumbType, PathEntryType, RouteType } from '../types';

const segments = (path: string) => path.split('/').filter(Boolean);

const encode_segments = (path: string) => segments(path).map(encodeURIComponent);

const encode_path = (path: string) => path.split('/').map(encodeURIComponent).join('/');

const base = { prefix: '/' };

const set_prefix = (prefix: string) => {
  const parts = segments(prefix);
  base.prefix = parts.length ? `/${parts.join('/')}/` : '/';
};

const home_url = () => base.prefix;

const is_root = (href: string) => !segments(href).length;

const dir_url = (href: string) => {
  const parts = encode_segments(href);
  return parts.length ? `${base.prefix}${parts.join('/')}/` : base.prefix;
};

const entry_url = (href: string, entry: PathEntryType) => dir_url(href) + encode_segments(entry.name).join('/') + (is_dir(entry) ? '/' : '');

const file_url = (href: string, name: string) => dir_url(href) + encode_segments(name).join('/');

const absolute_url = (path: string) => location.origin + path;

const crumbs = (href: string): CrumbType[] => {
  const parts = segments(href);
  return parts.map((name, index) => ({ name, url: dir_url(parts.slice(0, index + 1).join('/')) }));
};

const parent_url = (href: string) => dir_url(segments(href).slice(0, -1).join('/'));

const route_url = (path: string, { q, view }: Partial<Pick<RouteType, 'q' | 'view'>>) => {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (view) params.set('view', view);
  const search = params.toString();
  return search ? `${path}?${search}` : path;
};

const read_route = (): RouteType => {
  const params = new URLSearchParams(location.search);
  return { path: location.pathname, q: params.get('q') ?? '', view: params.get('view') };
};

const location_key = ({ path, q }: Pick<RouteType, 'path' | 'q'>) => `${path}?${q}`;

export { absolute_url, crumbs, dir_url, encode_path, entry_url, file_url, home_url, is_root, location_key, parent_url, read_route, route_url, set_prefix };
