import { useEffect, useState } from 'react';
import { base_name, btn, cx, format_bytes, format_eta, is_running, plural } from '../common';
import { AlertIcon, CheckIcon, ChevronDownIcon, UploadIcon, XIcon } from './icons';
import type { UploadPanelPropsType, UploadStatusType } from '../types';

const DISMISS_MS = 3500;

const STATUS_TEXT: Record<UploadStatusType, string> = {
  queued: 'queued',
  active: '',
  retrying: 'reconnecting…',
  done: 'done',
  error: 'failed',
  cancelled: 'cancelled',
};

const UploadPanel = ({ items, rate, raised, on_cancel, on_retry, on_dismiss }: UploadPanelPropsType) => {
  const [open, set_open] = useState(false);
  const total = items.reduce((sum, item) => sum + item.size, 0);
  const loaded = items.reduce((sum, item) => sum + (item.status === 'done' ? item.size : item.loaded), 0);
  const running = items.filter(is_running).length;
  const failed = items.filter(item => item.status === 'error').length;
  const cancelled = items.filter(item => item.status === 'cancelled').length;
  const finished = items.filter(item => item.status === 'done').length;
  const reconnecting = items.some(item => item.status === 'retrying');
  const percent = total ? Math.floor((loaded / total) * 100) : 100;
  const only_cancelled = !running && !failed && !finished && cancelled > 0;

  useEffect(() => {
    if (!items.length || running || failed) return;
    const timer = setTimeout(on_dismiss, DISMISS_MS);
    return () => clearTimeout(timer);
  }, [items.length, running, failed, on_dismiss]);

  const [first] = items;
  if (!first) return null;

  const outcome = [finished && `${finished} uploaded`, failed && `${failed} failed`, cancelled && `${cancelled} cancelled`].filter(Boolean).join(' · ');
  const title = running
    ? items.length === 1
      ? `uploading ${base_name(first.path)}`
      : `uploading · ${finished} of ${items.length} done`
    : failed || cancelled
      ? outcome
      : `uploaded ${plural(finished, 'file')}`;

  const progress =
    loaded >= total
      ? '100% · finishing…'
      : rate > 0
        ? `${percent}% · ${format_bytes(rate)}/s · ${format_eta((total - loaded) / rate)}`
        : `${percent}% · ${format_bytes(loaded)} of ${format_bytes(total)}`;
  const summary = finished === items.length ? format_bytes(total) : `${format_bytes(loaded)} of ${format_bytes(total)}`;
  const detail = !running ? (
    summary
  ) : reconnecting ? (
    <>
      {percent}% · <span className="text-accent">reconnecting…</span>
    </>
  ) : (
    progress
  );

  const tone = running ? 'text-accent' : failed ? 'text-red' : only_cancelled ? 'text-dim' : 'text-green';
  const icon = running ? <UploadIcon className="w-4 h-4" /> : failed ? <AlertIcon className="w-4 h-4" /> : only_cancelled ? <XIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />;
  const bar = running ? 'bg-accent' : failed ? 'bg-red' : only_cancelled ? 'bg-dim' : 'bg-accent';

  return (
    <div
      className={cx(
        'fixed z-40 right-4 max-sm:left-4 sm:w-96 rounded-xl border border-border bg-surface shadow-2xl animate-[rise_200ms_cubic-bezier(0.23,1,0.32,1)] overflow-hidden transition-[bottom] duration-200 ease-out',
        raised ? 'bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4rem)]' : 'bottom-[max(1rem,env(safe-area-inset-bottom))]',
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={cx('shrink-0', tone)}>{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate" title={items.length === 1 ? first.path : undefined}>
            {title}
          </div>
          <div className="text-[11px] text-dim font-mono truncate">{detail}</div>
        </div>
        <button onClick={() => set_open(previous => !previous)} className={cx(btn.ghost, 'w-7 h-7')} aria-label={open ? 'collapse' : 'expand'} aria-expanded={open}>
          <ChevronDownIcon className={cx('w-4 h-4 transition-transform duration-200', open && 'rotate-180')} />
        </button>
        {running ? (
          <button onClick={on_cancel} className={cx(btn.ghost, 'h-7 px-2')}>
            cancel
          </button>
        ) : (
          <>
            {failed > 0 && (
              <button onClick={on_retry} className={cx(btn.base, 'h-7 px-2 text-accent hover:bg-accent-dim')}>
                retry
              </button>
            )}
            <button onClick={on_dismiss} className={cx(btn.ghost, 'w-7 h-7')} aria-label="dismiss">
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
      <div className="h-0.5 bg-elevated">
        <div className={cx('h-full transition-[width] duration-200', bar)} style={{ width: `${percent}%` }} />
      </div>
      {open && (
        <ul className="max-h-64 overflow-auto py-1">
          {items.map(item => (
            <li key={item.id} className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-mono">
              <span className="flex-1 truncate" title={item.path}>
                {item.path}
              </span>
              <span
                className={cx('shrink-0 tabular-nums', item.status === 'error' ? 'text-red' : item.status === 'done' ? 'text-green' : item.status === 'retrying' ? 'text-accent' : 'text-dim')}
                title={item.error}
              >
                {item.status === 'active' ? `${item.size ? Math.round((item.loaded / item.size) * 100) : 0}%` : item.status === 'error' ? (item.error ?? STATUS_TEXT.error) : STATUS_TEXT[item.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { UploadPanel };
