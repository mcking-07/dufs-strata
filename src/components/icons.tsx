import type { ReactElement } from 'react';
import type { CheckboxIconPropsType, FileKindType, FileTypeIconPropsType, IconPropsType } from '../types';

const SVG = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

const FolderIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
  </svg>
);
const VideoIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M10 9l5 3-5 3z" />
  </svg>
);
const AudioIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
const ImageIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);
const ArchiveIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M21 8v13H3V8M1 3h22v5H1z" />
    <path d="M10 12h4" />
  </svg>
);
const DocIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h8" />
  </svg>
);
const CodeIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const FileIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);
const DownloadIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const HashIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);
const SunIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const MoonIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const LoginIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);
const LogOutIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const SearchIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const UploadIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const TrashIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);
const PlusIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const XIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const EditIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z" />
  </svg>
);
const SaveIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const CheckIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const LinkIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
const FolderPlusIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
    <line x1="12" y1="10" x2="12" y2="16" />
    <line x1="9" y1="13" x2="15" y2="13" />
  </svg>
);
const FilePlusIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);
const FolderUpIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
    <polyline points="9 13 12 10 15 13" />
    <line x1="12" y1="10" x2="12" y2="17" />
  </svg>
);
const CheckboxIcon = ({ className, checked, partial }: CheckboxIconPropsType) => (
  <svg {...SVG} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" fill={checked || partial ? 'currentColor' : 'none'} />
    {checked && <polyline points="7.5 12 10.5 15 16.5 9" stroke="var(--color-bg)" strokeWidth={2} />}
    {partial && !checked && <line x1="8" y1="12" x2="16" y2="12" stroke="var(--color-bg)" strokeWidth={2} />}
  </svg>
);
const UserIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const AlertIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const HomeIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ArrowLeftIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const ChevronLeftIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronDownIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MoreIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="19" cy="12" r="1" fill="currentColor" />
    <circle cx="5" cy="12" r="1" fill="currentColor" />
  </svg>
);
const ExternalIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const ListCheckIcon = ({ className }: IconPropsType) => (
  <svg {...SVG} className={className}>
    <path d="M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17" />
    <line x1="11" y1="6" x2="21" y2="6" />
    <line x1="11" y1="12" x2="21" y2="12" />
    <line x1="11" y1="18" x2="21" y2="18" />
  </svg>
);

const ICON_BY_KIND: Record<FileKindType, (props: IconPropsType) => ReactElement> = {
  dir: FolderIcon,
  video: VideoIcon,
  audio: AudioIcon,
  image: ImageIcon,
  archive: ArchiveIcon,
  doc: DocIcon,
  code: CodeIcon,
  file: FileIcon,
};

const FileTypeIcon = ({ type, className }: FileTypeIconPropsType) => {
  const Icon = ICON_BY_KIND[type];
  return <Icon className={className} />;
};

export {
  AlertIcon,
  ArchiveIcon,
  ArrowLeftIcon,
  AudioIcon,
  CheckboxIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  DocIcon,
  DownloadIcon,
  EditIcon,
  ExternalIcon,
  FileIcon,
  FilePlusIcon,
  FolderIcon,
  FolderPlusIcon,
  FolderUpIcon,
  HashIcon,
  HomeIcon,
  ImageIcon,
  LinkIcon,
  ListCheckIcon,
  LoginIcon,
  LogOutIcon,
  MoonIcon,
  MoreIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  SunIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
  VideoIcon,
  XIcon,
  FileTypeIcon,
};
