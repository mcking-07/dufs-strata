import type { ReactNode, RefObject } from 'react';
import type { IndexDataType, PathEntryType } from './dufs';
import type { FileKindType, SortKeyType, SortType } from './files';
import type { RouteType } from './route';
import type { CreateKindType, MenuStateType, ModalType, PositionType, ThemeType, ToastType } from './ui';
import type { UploadItemType, UploadJobType } from './uploads';

type AppPropsType = { issue?: string };

type IconPropsType = { className?: string };

type CheckboxIconPropsType = IconPropsType & { checked?: boolean; partial?: boolean };

type FileTypeIconPropsType = IconPropsType & { type: FileKindType };

type LogoPropsType = { className?: string };

type HeaderPropsType = {
  data: IndexDataType;
  route: RouteType;
  theme: ThemeType;
  search_ref: RefObject<HTMLInputElement | null>;
  on_navigate: (url: string) => void;
  on_toggle_theme: () => void;
  on_account: (x: number, y: number) => void;
  on_sign_in: () => void;
};

type CrumbPropsType = { url: string; current: boolean; label?: string; children: ReactNode; on_navigate: (url: string) => void };

type BreadcrumbsPropsType = { href: string; query: string; on_navigate: (url: string) => void };

type ToolbarPropsType = {
  data: IndexDataType;
  route: RouteType;
  count: number;
  selecting: boolean;
  can_upload: boolean;
  file_input: RefObject<HTMLInputElement | null>;
  folder_input: RefObject<HTMLInputElement | null>;
  on_navigate: (url: string) => void;
  on_toggle_selecting: () => void;
  on_new: (x: number, y: number) => void;
  on_files: (files: FileList) => void;
};

type EmptyPropsType = { title: string; hint?: string; children?: ReactNode };

type FileListPropsType = {
  href: string;
  paths: PathEntryType[];
  parent: string | null;
  sort: SortType;
  selected: Set<string>;
  selecting: boolean;
  can_archive: boolean;
  on_sort: (key: SortKeyType) => void;
  on_toggle: (name: string, range: boolean) => void;
  on_toggle_all: () => void;
  on_open: (entry: PathEntryType) => void;
  on_navigate: (url: string) => void;
  on_menu: (entry: PathEntryType, x: number, y: number) => void;
  on_copy_link: (entry: PathEntryType) => void;
  on_long_press: (entry: PathEntryType) => void;
};

type FileRowPropsType = FileListPropsType & { entry: PathEntryType; is_selected: boolean };

type SortButtonPropsType = { sort_key: SortKeyType; label: string; sort: SortType; on_sort: (key: SortKeyType) => void; className?: string };

type SelectionBarPropsType = {
  count: number;
  size: number;
  all: boolean;
  on_clear: () => void;
  on_toggle_all: () => void;
  on_download: () => void;
  on_delete?: () => void;
};

type DropOverlayPropsType = { href: string };

type EditPropsType = {
  on_saved: () => void;
  on_dirty: (dirty: boolean) => void;
  guard: (action: () => void) => void;
  on_error: (message: string) => void;
};

type PreviewPropsType = EditPropsType & {
  entry: PathEntryType;
  url: string;
  is_admin: boolean;
  position: PositionType;
  on_close: () => void;
  on_prev?: () => void;
  on_next?: () => void;
  on_copy_link: () => void;
  on_menu: (x: number, y: number) => void;
};

type PreviewBodyPropsType = EditPropsType & { entry: PathEntryType; url: string; is_admin: boolean; on_copy_link: () => void };

type TextPreviewPropsType = EditPropsType & { entry: PathEntryType; url: string; is_admin: boolean };

type FallbackPropsType = { entry: PathEntryType; url: string; reason: string; on_copy_link: () => void; vlc?: boolean };

type UploadPanelPropsType = {
  items: UploadItemType[];
  rate: number;
  raised: boolean;
  on_cancel: () => void;
  on_retry: () => void;
  on_dismiss: () => void;
};

type DialogPropsType = { title: string; icon?: ReactNode; children?: ReactNode; footer: ReactNode; on_close: () => void };

type ConfirmDialogPropsType = {
  title: string;
  message: ReactNode;
  confirm_label: string;
  danger?: boolean;
  extra?: ReactNode;
  on_confirm: () => void;
  on_cancel: () => void;
};

type PromptDialogPropsType = {
  title: string;
  label: string;
  initial?: string;
  submit_label: string;
  validate?: (value: string) => string | null;
  on_submit: (value: string) => void;
  on_cancel: () => void;
};

type LoginDialogPropsType = { on_close: () => void; on_login: (user: string, pass: string) => Promise<void> };

type ModalsPropsType = {
  modal: ModalType | null;
  names: Set<string>;
  is_search: boolean;
  on_close: () => void;
  on_login: (user: string, pass: string) => Promise<void>;
  on_delete: (entries: PathEntryType[]) => void;
  on_rename: (entry: PathEntryType, name: string) => void;
  on_create: (type: CreateKindType, name: string) => void;
  on_discard: (action: () => void) => void;
  on_upload: (jobs: UploadJobType[], empty_dirs: string[]) => void;
};

type MenuPropsType = { menu: MenuStateType; on_close: () => void };

type ToastPropsType = { toast: ToastType; on_done: () => void };

export type {
  AppPropsType,
  BreadcrumbsPropsType,
  CheckboxIconPropsType,
  ConfirmDialogPropsType,
  CrumbPropsType,
  DialogPropsType,
  DropOverlayPropsType,
  EditPropsType,
  EmptyPropsType,
  FallbackPropsType,
  FileListPropsType,
  FileRowPropsType,
  FileTypeIconPropsType,
  HeaderPropsType,
  IconPropsType,
  LoginDialogPropsType,
  LogoPropsType,
  MenuPropsType,
  ModalsPropsType,
  PreviewBodyPropsType,
  PreviewPropsType,
  PromptDialogPropsType,
  SelectionBarPropsType,
  SortButtonPropsType,
  TextPreviewPropsType,
  ToastPropsType,
  ToolbarPropsType,
  UploadPanelPropsType,
};
