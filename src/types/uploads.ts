type UploadJobType = { file: File; path: string };

type UploadStatusType = 'queued' | 'active' | 'retrying' | 'done' | 'error' | 'cancelled';

type UploadItemType = {
  id: number;
  path: string;
  file: File;
  url: string;
  size: number;
  loaded: number;
  status: UploadStatusType;
  error?: string;
};

type QueuedUploadType = Pick<UploadItemType, 'id' | 'file' | 'url'>;

type DropResultType = { jobs: UploadJobType[]; empty_dirs: string[] };

type ProgressHandlerType = (loaded: number) => void;

export type { DropResultType, ProgressHandlerType, QueuedUploadType, UploadItemType, UploadJobType, UploadStatusType };
