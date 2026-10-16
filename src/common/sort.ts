import { is_dir } from './files';
import type { PathEntryType, SortType } from '../types';

const by_name = (a: PathEntryType, b: PathEntryType) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });

const sort_paths = (paths: PathEntryType[], { key, asc }: SortType) =>
  [...paths].sort((a, b) => {
    const a_dir = is_dir(a);
    const b_dir = is_dir(b);
    if (a_dir !== b_dir) return a_dir ? -1 : 1;
    const order = key === 'name' ? by_name(a, b) : key === 'time' ? a.mtime - b.mtime : a_dir ? a.size - b.size || a.name.localeCompare(b.name) : a.size - b.size;
    return asc ? order : -order;
  });

export { sort_paths };
