import { anchor_of, base_name, btn, cx, dir_name, format_meta } from '../../common';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, LinkIcon, MoreIcon } from '../icons';
import { PreviewBody } from './preview-body';
import type { PreviewPropsType } from '../../types';

const Preview = ({ entry, url, is_admin, position, on_close, on_prev, on_next, on_copy_link, on_menu, ...edit }: PreviewPropsType) => {
  const name = base_name(entry.name);
  const folder = dir_name(entry.name);
  const meta = format_meta(entry);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="sticky top-14 z-10 border-b border-border bg-bg/85 backdrop-blur-xl">
        <div className="wrap flex items-center gap-2 h-14">
          <button onClick={on_close} className={cx(btn.outline, btn.icon, 'sm:w-auto sm:px-3')} aria-label="back to folder">
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span className="max-sm:hidden">back</span>
          </button>
          <div className="min-w-0 flex-1 px-1.5">
            <div className="font-mono text-[13px] font-medium truncate" title={entry.name}>
              {folder && <span className="text-dim">{folder}/</span>}
              {name}
            </div>
            {meta && <div className="text-[11px] text-dim font-mono truncate">{meta}</div>}
          </div>
          {position.total > 1 && (
            <div className="flex items-center gap-0.5 max-sm:hidden">
              <button onClick={on_prev} disabled={!on_prev} className={cx(btn.ghost, btn.icon)} aria-label="previous file" title="previous (←)">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-dim font-mono tabular-nums w-12 text-center">
                {position.index + 1}/{position.total}
              </span>
              <button onClick={on_next} disabled={!on_next} className={cx(btn.ghost, btn.icon)} aria-label="next file" title="next (→)">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          <button onClick={on_copy_link} className={cx(btn.outline, btn.icon)} aria-label="copy link" title="copy link">
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <a href={url} download={name} className={cx(btn.primary, btn.icon, 'sm:w-auto sm:px-3')} aria-label="download" title="download">
            <DownloadIcon className="w-3.5 h-3.5" />
            <span className="max-sm:hidden">download</span>
          </a>
          <button onClick={event => on_menu(...anchor_of(event))} className={cx(btn.ghost, btn.icon)} aria-label="more actions">
            <MoreIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col wrap py-6 max-sm:py-4">
        <PreviewBody key={url} entry={entry} url={url} is_admin={is_admin} on_copy_link={on_copy_link} {...edit} />
      </div>
      {position.total > 1 && (
        <div className="sm:hidden sticky bottom-0 border-t border-border bg-bg/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between px-3 h-12">
            <button onClick={on_prev} disabled={!on_prev} className={cx(btn.ghost, btn.text, 'h-9')}>
              <ChevronLeftIcon className="w-4 h-4" /> prev
            </button>
            <span className="text-[11px] text-dim font-mono tabular-nums">
              {position.index + 1} / {position.total}
            </span>
            <button onClick={on_next} disabled={!on_next} className={cx(btn.ghost, btn.text, 'h-9')}>
              next <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { Preview };
