import type { FileKindType, PathEntryType } from '../types';

const EXTENSIONS: Record<Exclude<FileKindType, 'dir' | 'file'>, string[]> = {
  video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v'],
  audio: ['mp3', 'flac', 'wav', 'aac', 'ogg', 'wma', 'm4a', 'opus'],
  image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'avif'],
  archive: ['zip', 'tar', 'gz', 'bz2', 'xz', '7z', 'rar', 'tgz', 'zst', 'iso', 'dmg'],
  doc: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'srt', 'vtt', 'log', 'nfo'],
  code: [
    'js',
    'mjs',
    'cjs',
    'ts',
    'jsx',
    'tsx',
    'py',
    'rb',
    'go',
    'rs',
    'java',
    'kt',
    'c',
    'cpp',
    'h',
    'hpp',
    'css',
    'scss',
    'html',
    'json',
    'yaml',
    'yml',
    'toml',
    'ini',
    'conf',
    'xml',
    'sh',
    'bash',
    'zsh',
    'sql',
    'md',
    'lua',
    'php',
    'swift',
    'dockerfile',
    'env',
  ],
};

const KIND_BY_EXTENSION = new Map(Object.entries(EXTENSIONS).flatMap(([kind, extensions]) => extensions.map(extension => [extension, kind as FileKindType])));

const TEXT_EXTENSIONS = new Set([...EXTENSIONS.code, 'txt', 'csv', 'srt', 'vtt', 'log', 'nfo']);
const BROWSER_VIDEO = new Set(['mp4', 'webm', 'm4v', 'mov', 'mkv']);
const BROWSER_AUDIO = new Set(['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus']);

const base_name = (name: string) => name.slice(name.lastIndexOf('/') + 1);

const dir_name = (name: string) => (name.includes('/') ? name.slice(0, name.lastIndexOf('/')) : '');

const ext_of = (name: string) => {
  const base = base_name(name);
  const dot = base.lastIndexOf('.');
  if (dot > 0) return base.slice(dot + 1).toLowerCase();
  return base.toLowerCase() === 'dockerfile' ? 'dockerfile' : '';
};

const is_dir = (entry: PathEntryType) => entry.path_type === 'Dir' || entry.path_type === 'SymlinkDir';

const file_type = (entry: PathEntryType): FileKindType => (is_dir(entry) ? 'dir' : (KIND_BY_EXTENSION.get(ext_of(entry.name)) ?? 'file'));

const is_text = (name: string) => TEXT_EXTENSIONS.has(ext_of(name));
const is_markdown = (name: string) => ext_of(name) === 'md';
const is_image = (name: string) => EXTENSIONS.image.includes(ext_of(name));
const is_video = (name: string) => BROWSER_VIDEO.has(ext_of(name));
const is_audio = (name: string) => BROWSER_AUDIO.has(ext_of(name));
const is_pdf = (name: string) => ext_of(name) === 'pdf';

export { base_name, dir_name, ext_of, file_type, is_audio, is_dir, is_image, is_markdown, is_pdf, is_text, is_video };
