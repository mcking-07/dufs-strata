import { RequestFailed } from '../errors';
import { auth_fetch, get_credentials } from './auth';
import type { IndexDataType } from '../types';

const status_text = (response: Response) => response.statusText || `http ${response.status}`;

const decode_index = (encoded: string): IndexDataType => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(encoded), character => character.charCodeAt(0))));

const initial_index = decode_index('__INDEX_DATA__');

const fetch_index = async (path: string, q: string, credentials = get_credentials()): Promise<IndexDataType> => {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  params.set('json', '');
  const response = await auth_fetch(`${path}?${params}`, { cache: 'no-store' }, credentials);
  if (!response.ok) throw new RequestFailed(response.status === 401 ? 'invalid credentials' : status_text(response), response.status, { path });
  return response.json();
};

const request = async (url: string, init: RequestInit) => {
  const response = await auth_fetch(url, init);
  if (!response.ok) throw new RequestFailed(response.status === 403 ? 'forbidden' : status_text(response), response.status, { url });
};

const fetch_text = async (url: string, signal: AbortSignal) => {
  const response = await auth_fetch(url, { cache: 'no-store', signal });
  if (!response.ok) throw new RequestFailed(status_text(response), response.status, { url });
  return response.text();
};

const fetch_hash = async (url: string) => {
  const response = await fetch(`${url}?hash`);
  if (!response.ok) throw new RequestFailed('hashing failed', response.status, { url });
  return (await response.text()).trim();
};

const create_folder = (url: string) => request(url, { method: 'MKCOL' });

const write_file = (url: string, body: BodyInit) => request(url, { method: 'PUT', body });

const move_entry = (url: string, destination: string) => request(url, { method: 'MOVE', headers: { Destination: destination } });

const remove_entry = (url: string) => request(url, { method: 'DELETE' });

export { create_folder, fetch_hash, fetch_index, fetch_text, initial_index, move_entry, remove_entry, request, status_text, write_file };
