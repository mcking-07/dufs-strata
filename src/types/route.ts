import type { RefObject } from 'react';
import type { ToastKindType } from './ui';

type RouteType = {
  path: string;
  q: string;
  view: string | null;
};

type LocationType = Pick<RouteType, 'path' | 'q'>;

type NavigateOptionsType = { replace?: boolean; preview?: boolean };

type NavigationOptionsType = {
  notify: (message: string, kind?: ToastKindType) => void;
  on_directory_change: () => void;
  on_discard: (action: () => void) => void;
};

type ShortcutsOptionsType = {
  blocked: boolean;
  searchable: boolean;
  previewing: boolean;
  search_ref: RefObject<HTMLInputElement | null>;
  on_step: (delta: number) => void;
};

export type { LocationType, NavigateOptionsType, NavigationOptionsType, RouteType, ShortcutsOptionsType };
