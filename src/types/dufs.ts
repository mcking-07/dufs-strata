type PathKindType = 'Dir' | 'SymlinkDir' | 'File' | 'SymlinkFile';

type PathEntryType = {
  path_type: PathKindType;
  name: string;
  mtime: number;
  size: number;
};

type IndexDataType = {
  href: string;
  kind: string;
  uri_prefix: string;
  allow_upload: boolean;
  allow_delete: boolean;
  allow_search: boolean;
  allow_archive: boolean;
  dir_exists: boolean;
  auth: boolean;
  user: string | null;
  paths: PathEntryType[];
};

export type { IndexDataType, PathEntryType, PathKindType };
