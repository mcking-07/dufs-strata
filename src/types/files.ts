type FileKindType = 'dir' | 'video' | 'audio' | 'image' | 'archive' | 'doc' | 'code' | 'file';

type SortKeyType = 'name' | 'time' | 'size';

type SortType = { key: SortKeyType; asc: boolean };

type CrumbType = { name: string; url: string };

export type { CrumbType, FileKindType, SortKeyType, SortType };
