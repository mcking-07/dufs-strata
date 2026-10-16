import { is_dir } from './files';
import type { PathEntryType } from '../types';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const TIME_FORMAT = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

const format_bytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1);
  const value = bytes / 1024 ** power;
  return `${power === 0 ? value : value < 10 ? value.toFixed(1) : Math.round(value)} ${UNITS[power]}`;
};

const format_size = (entry: PathEntryType) => (is_dir(entry) ? plural(entry.size, 'item') : format_bytes(entry.size));

const format_date = (ms: number) => {
  if (!ms) return '—';
  const date = new Date(ms);
  const elapsed = Date.now() - ms;
  if (elapsed >= 0 && elapsed < 60_000) return 'just now';
  if (elapsed >= 0 && elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m ago`;
  if (elapsed >= 0 && elapsed < 86_400_000 && date.getDate() === new Date().getDate()) return `today ${TIME_FORMAT.format(date)}`;
  return DATE_FORMAT.format(date);
};

const format_date_full = (ms: number) => (ms ? new Date(ms).toLocaleString() : '');

const format_meta = (entry: PathEntryType) => [entry.size ? format_bytes(entry.size) : null, format_date_full(entry.mtime) || null].filter(Boolean).join(' · ');

const format_eta = (seconds: number) => {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))}s left`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m left`;
  return `${Math.floor(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m left`;
};

export { format_bytes, format_date, format_date_full, format_eta, format_meta, format_size, plural };
