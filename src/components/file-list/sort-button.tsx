import { cx } from '../../common';
import type { SortButtonPropsType } from '../../types';

const SortButton = ({ sort_key, label, sort, on_sort, className }: SortButtonPropsType) => {
  const active = sort.key === sort_key;
  return (
    <button
      onClick={() => on_sort(sort_key)}
      className={cx('tap self-stretch flex items-center gap-1 uppercase tracking-wider cursor-pointer transition-colors hover:text-muted', active && 'text-muted', className)}
    >
      {label}
      <span aria-hidden className={cx('text-accent transition-opacity', active ? 'opacity-100' : 'opacity-0')}>
        {sort.asc ? '↓' : '↑'}
      </span>
      {active && <span className="sr-only">{sort.asc ? '(ascending)' : '(descending)'}</span>}
    </button>
  );
};

export { SortButton };
