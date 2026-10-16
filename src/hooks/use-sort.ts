import { useState } from 'react';
import { safe } from 'safe-wrapper';
import type { SortKeyType, SortType } from '../types';

const SORT_KEY = 'strata-sort';
const SORT_KEYS = new Set<string>(['name', 'time', 'size']);
const DEFAULT_SORT: SortType = { key: 'name', asc: true };

const load_sort = (): SortType => {
  const [error, saved] = safe(() => JSON.parse(localStorage.getItem(SORT_KEY) ?? '') as Partial<SortType>)();
  if (error || !saved?.key || !SORT_KEYS.has(saved.key)) return DEFAULT_SORT;
  return { key: saved.key, asc: !!saved.asc };
};

const useSort = () => {
  const [sort, set_sort] = useState(load_sort);

  const change_sort = (key: SortKeyType) => {
    const next = { key, asc: sort.key === key ? !sort.asc : key === 'name' };
    set_sort(next);
    localStorage.setItem(SORT_KEY, JSON.stringify(next));
  };

  return { sort, change_sort };
};

export { useSort };
