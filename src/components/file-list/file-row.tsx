import { type MouseEvent, type PointerEvent, useRef } from 'react';
import { anchor_of, base_name, cx, dir_name, entry_url, file_type, format_date, format_date_full, format_size, is_dir, is_plain_click } from '../../common';
import { CheckboxIcon, DownloadIcon, FileTypeIcon, LinkIcon, MoreIcon } from '../icons';
import { grid } from './grid';
import type { FileRowPropsType, PressStateType } from '../../types';

const LONG_PRESS_MS = 450;

const FileRow = ({ entry, href, is_selected, selecting, can_archive, on_toggle, on_open, on_menu, on_copy_link, on_long_press }: FileRowPropsType) => {
  const dir = is_dir(entry);
  const url = entry_url(href, entry);
  const folder = dir_name(entry.name);
  const name = base_name(entry.name);
  const press = useRef<PressStateType | null>(null);

  const start_press = (event: PointerEvent) => {
    press.current = null;
    if (event.pointerType !== 'touch') return;
    const timer = window.setTimeout(() => {
      if (press.current) press.current.fired = true;
      navigator.vibrate?.(10);
      on_long_press(entry);
    }, LONG_PRESS_MS);
    press.current = { timer, fired: false };
  };

  const cancel_press = () => {
    if (press.current) clearTimeout(press.current.timer);
  };

  const activate = (event: MouseEvent) => {
    if (press.current?.fired) {
      event.preventDefault();
      press.current = null;
      return;
    }
    if (!is_plain_click(event) && !(selecting && event.shiftKey)) return;
    event.preventDefault();
    if (selecting) on_toggle(entry.name, event.shiftKey);
    else on_open(entry);
  };

  return (
    <div
      role="row"
      aria-selected={is_selected}
      onContextMenu={event => {
        event.preventDefault();
        if (!press.current) on_menu(entry, event.clientX, event.clientY);
      }}
      onPointerDown={start_press}
      onPointerUp={cancel_press}
      onPointerLeave={cancel_press}
      onPointerCancel={cancel_press}
      className={cx(
        grid(selecting),
        'group relative h-12 max-sm:h-14 px-3 rounded-lg border-t border-border/60 transition-colors duration-100 [-webkit-touch-callout:none]',
        is_selected ? 'bg-accent-dim border-transparent' : 'hover:bg-surface',
      )}
    >
      <button
        onClick={event => on_toggle(entry.name, event.shiftKey)}
        className={cx(
          'relative z-[1] flex cursor-pointer transition-opacity duration-100',
          is_selected || selecting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          is_selected ? 'text-accent' : 'text-dim hover:text-muted',
          !selecting && 'max-sm:hidden',
        )}
        aria-label={is_selected ? `deselect ${entry.name}` : `select ${entry.name}`}
      >
        <CheckboxIcon className="w-4 h-4" checked={is_selected} />
      </button>

      <a
        href={url}
        onClick={activate}
        draggable={false}
        className="flex items-center gap-3 min-w-0 after:absolute after:inset-0 after:content-[''] outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-accent"
      >
        <FileTypeIcon type={file_type(entry)} className={cx('w-[18px] h-[18px] shrink-0', dir ? 'text-accent/80' : 'text-dim')} />
        <span className="min-w-0 flex flex-col">
          <span className={cx('font-mono text-[13px] truncate', dir && 'font-medium')} title={entry.name}>
            {name}
          </span>
          {folder && <span className="font-mono text-[11px] text-dim truncate">{folder}/</span>}
          <span className="sm:hidden font-mono text-[11px] text-dim truncate">{format_date(entry.mtime)}</span>
        </span>
      </a>

      <span className="max-sm:hidden text-xs text-dim font-mono tabular-nums truncate" title={format_date_full(entry.mtime)}>
        {format_date(entry.mtime)}
      </span>
      <span className="text-xs text-dim font-mono tabular-nums justify-self-end sm:justify-self-start whitespace-nowrap">{format_size(entry)}</span>

      <div className={cx('relative z-[1] flex items-center justify-end gap-0.5', selecting && 'max-sm:hidden')}>
        <span className="hidden sm:flex [@media(hover:none)]:hidden gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-100">
          <button
            onClick={() => on_copy_link(entry)}
            className="w-7 h-7 inline-flex items-center justify-center rounded-md text-muted hover:text-text hover:bg-elevated cursor-pointer"
            aria-label="copy link"
            title="copy link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          {(!dir || can_archive) && (
            <a
              href={dir ? `${url}?zip` : url}
              download={dir ? `${name}.zip` : name}
              className="w-7 h-7 inline-flex items-center justify-center rounded-md text-muted hover:text-text hover:bg-elevated"
              aria-label={dir ? 'download as zip' : 'download'}
              title={dir ? 'download as zip' : 'download'}
            >
              <DownloadIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </span>
        <button
          onClick={event => on_menu(entry, ...anchor_of(event, 4))}
          className="tap w-8 h-8 max-sm:w-9 max-sm:h-9 inline-flex items-center justify-center rounded-md text-dim hover:text-text hover:bg-elevated cursor-pointer"
          aria-label={`actions for ${entry.name}`}
        >
          <MoreIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export { FileRow };
