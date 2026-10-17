import { btn, cx, format_bytes } from '../common';
import { CheckboxIcon, DownloadIcon, TrashIcon, XIcon } from './icons';
import type { SelectionBarPropsType } from '../types';

const SelectionBar = ({ count, size, all, on_clear, on_toggle_all, on_download, on_delete }: SelectionBarPropsType) => (
  <div className="fixed z-30 inset-x-0 bottom-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3 pointer-events-none">
    <div className="pointer-events-auto mx-auto max-w-xl flex items-center gap-2 rounded-xl border border-border bg-surface/95 backdrop-blur-xl shadow-2xl px-2 py-2 animate-[rise_200ms_cubic-bezier(0.23,1,0.32,1)]">
      <button onClick={on_clear} className={cx(btn.ghost, btn.icon)} aria-label="clear selection">
        <XIcon className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium">{count} selected</div>
        {size > 0 && <div className="text-[11px] text-dim font-mono">{format_bytes(size)}</div>}
      </div>
      <button onClick={on_toggle_all} className={cx(btn.ghost, btn.icon)} aria-label={all ? 'deselect all' : 'select all'} title="select all">
        <CheckboxIcon className="w-4 h-4" checked={all} partial={!all} />
      </button>
      <button onClick={on_download} className={cx(btn.outline, btn.text, 'max-sm:px-2.5')} aria-label="download selected">
        <DownloadIcon className="w-3.5 h-3.5" /> <span className="max-sm:hidden">download</span>
      </button>
      {on_delete && (
        <button onClick={on_delete} className={cx(btn.danger, btn.text, 'max-sm:px-2.5')} aria-label="delete selected">
          <TrashIcon className="w-3.5 h-3.5" /> <span className="max-sm:hidden">delete</span>
        </button>
      )}
    </div>
  </div>
);

export { SelectionBar };
