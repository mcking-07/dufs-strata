import { absolute_url, base_name, btn, cx, file_type, format_meta } from '../../common';
import { DownloadIcon, ExternalIcon, FileTypeIcon, LinkIcon } from '../icons';
import type { FallbackPropsType } from '../../types';

const Fallback = ({ entry, url, reason, on_copy_link, vlc }: FallbackPropsType) => (
  <div className="w-full max-w-md m-auto text-center">
    <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
      <FileTypeIcon type={file_type(entry)} className="w-7 h-7 text-muted" />
    </div>
    <div className="font-mono text-sm font-medium break-all">{base_name(entry.name)}</div>
    <div className="text-xs text-dim font-mono mt-1">{format_meta(entry)}</div>
    <p className="text-muted text-[13px] mt-4">{reason}</p>
    <div className="flex flex-wrap justify-center gap-2 mt-5">
      <a href={url} download={base_name(entry.name)} className={cx(btn.primary, btn.text, 'h-9')}>
        <DownloadIcon className="w-3.5 h-3.5" /> download
      </a>
      <button onClick={on_copy_link} className={cx(btn.outline, btn.text, 'h-9')}>
        <LinkIcon className="w-3.5 h-3.5" /> copy link
      </button>
      {vlc && (
        <a href={`vlc://${absolute_url(url)}`} className={cx(btn.outline, btn.text, 'h-9')}>
          <ExternalIcon className="w-3.5 h-3.5" /> open in vlc
        </a>
      )}
    </div>
  </div>
);

export { Fallback };
