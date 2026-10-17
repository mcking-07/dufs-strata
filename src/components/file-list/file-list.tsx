import { cx, is_plain_click } from '../../common';
import { CheckboxIcon, FolderIcon } from '../icons';
import { FileRow } from './file-row';
import { grid } from './grid';
import { SortButton } from './sort-button';
import type { FileListPropsType } from '../../types';

const FileList = (props: FileListPropsType) => {
  const { paths, parent, sort, selected, selecting, on_sort, on_toggle_all, on_navigate } = props;
  const all = paths.length > 0 && selected.size === paths.length;
  const some = selected.size > 0 && !all;

  return (
    <div role="table" aria-label="files">
      <div role="row" className={cx(grid(selecting), 'h-9 px-3 text-[10.5px] font-medium text-dim select-none sm:sticky sm:top-28 sm:z-[5] sm:bg-bg')}>
        <button
          onClick={on_toggle_all}
          className={cx('flex cursor-pointer text-dim hover:text-muted', !selecting && 'max-sm:hidden', (all || some) && 'text-accent hover:text-accent')}
          aria-label={all ? 'deselect all' : 'select all'}
        >
          <CheckboxIcon className="w-4 h-4" checked={all} partial={some} />
        </button>
        <SortButton sort_key="name" label="name" sort={sort} on_sort={on_sort} />
        <SortButton sort_key="time" label="modified" sort={sort} on_sort={on_sort} className="max-sm:hidden" />
        <SortButton sort_key="size" label="size" sort={sort} on_sort={on_sort} className="justify-self-end sm:justify-self-start" />
        <span className={cx(selecting && 'max-sm:hidden')} />
      </div>

      {parent && (
        <a
          href={parent}
          onClick={event => {
            if (!is_plain_click(event)) return;
            event.preventDefault();
            on_navigate(parent);
          }}
          className={cx(grid(selecting), 'h-12 max-sm:h-14 px-3 rounded-lg border-t border-border/60 text-muted hover:bg-surface hover:text-text transition-colors duration-100')}
        >
          <span className={cx(!selecting && 'max-sm:hidden')} />
          <span className="flex items-center gap-3 min-w-0">
            <FolderIcon className="w-[18px] h-[18px] text-dim shrink-0" />
            <span className="font-mono text-[13px]">..</span>
          </span>
        </a>
      )}

      {paths.map(entry => (
        <FileRow key={entry.name} {...props} entry={entry} is_selected={selected.has(entry.name)} />
      ))}
    </div>
  );
};

export { FileList };
