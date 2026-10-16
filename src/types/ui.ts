import type { ReactNode } from 'react';
import type { PathEntryType } from './dufs';
import type { UploadJobType } from './uploads';

type ThemeType = 'dark' | 'light';

type ToastKindType = 'info' | 'error' | 'success';

type ToastType = { id: number; message: string; kind: ToastKindType };

type MenuItemType = { kind?: 'item'; label: string; icon?: ReactNode; on_select: () => void; danger?: boolean; hint?: string } | { kind: 'sep' };

type MenuStateType = {
  title?: string;
  subtitle?: string;
  items: MenuItemType[];
  x: number;
  y: number;
};

type CreateKindType = 'folder' | 'file';

type ModalType =
  | { kind: 'login' }
  | { kind: 'delete'; entries: PathEntryType[] }
  | { kind: 'rename'; entry: PathEntryType }
  | { kind: 'new'; type: CreateKindType }
  | { kind: 'overwrite'; jobs: UploadJobType[]; empty_dirs: string[]; conflicts: string[] }
  | { kind: 'discard'; action: () => void };

type PositionType = { index: number; total: number };

type PressStateType = { timer: number; fired: boolean };

type TextModeType = 'view' | 'source' | 'edit';

type TextStateType = { text: string; error: null } | { text: null; error: string | null };

export type { CreateKindType, MenuItemType, MenuStateType, ModalType, PositionType, PressStateType, TextModeType, TextStateType, ThemeType, ToastKindType, ToastType };
