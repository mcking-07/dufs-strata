import { cx } from '../../common';

const grid = (selecting: boolean) =>
  cx('grid items-center gap-x-3 sm:grid-cols-[22px_minmax(0,1fr)_120px_84px_104px]', selecting ? 'grid-cols-[22px_minmax(0,1fr)_auto]' : 'grid-cols-[minmax(0,1fr)_auto_36px]');

export { grid };
