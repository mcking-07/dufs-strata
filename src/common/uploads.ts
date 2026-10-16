import type { DropResultType, UploadItemType, UploadJobType } from '../types';

const JUNK = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);

const is_running = (item: UploadItemType) => item.status === 'queued' || item.status === 'active' || item.status === 'retrying';

const top_level = (path: string) => path.split('/')[0] ?? path;

const jobs_from_input = (list: FileList): UploadJobType[] =>
  Array.from(list)
    .filter(file => !JUNK.has(file.name))
    .map(file => ({ file, path: file.webkitRelativePath || file.name }));

const read_all = (reader: FileSystemDirectoryReader) =>
  new Promise<FileSystemEntry[]>((resolve, reject) => {
    const entries: FileSystemEntry[] = [];
    const step = () =>
      reader.readEntries(batch => {
        if (!batch.length) return resolve(entries);
        entries.push(...batch);
        step();
      }, reject);
    step();
  });

const entry_file = (entry: FileSystemFileEntry) => new Promise<File>((resolve, reject) => entry.file(resolve, reject));

const jobs_from_drop = async (transfer: DataTransfer): Promise<DropResultType> => {
  const roots = Array.from(transfer.items)
    .filter(item => item.kind === 'file')
    .map(item => item.webkitGetAsEntry?.())
    .filter((entry): entry is FileSystemEntry => !!entry);
  if (!roots.length) return { jobs: Array.from(transfer.files).map(file => ({ file, path: file.name })), empty_dirs: [] };

  const result: DropResultType = { jobs: [], empty_dirs: [] };
  const walk = async (entry: FileSystemEntry, prefix: string): Promise<void> => {
    if (JUNK.has(entry.name)) return;
    if (entry.isFile) {
      result.jobs.push({ file: await entry_file(entry as FileSystemFileEntry), path: prefix + entry.name });
      return;
    }
    const children = await read_all((entry as FileSystemDirectoryEntry).createReader());
    if (!children.length) result.empty_dirs.push(prefix + entry.name);
    for (const child of children) await walk(child, `${prefix}${entry.name}/`);
  };

  for (const root of roots) await walk(root, '');
  return result;
};

export { is_running, jobs_from_drop, jobs_from_input, top_level };
