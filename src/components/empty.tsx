import { FolderIcon } from './icons';
import type { EmptyPropsType } from '../types';

const Empty = ({ title, hint, children }: EmptyPropsType) => (
  <div className="m-auto flex flex-col items-center text-center py-16 px-6">
    <div className="w-14 h-14 rounded-2xl border border-border bg-surface flex items-center justify-center mb-4">
      <FolderIcon className="w-6 h-6 text-dim" />
    </div>
    <p className="text-sm text-muted">{title}</p>
    {hint && <p className="text-xs text-dim mt-1">{hint}</p>}
    {children}
  </div>
);

export { Empty };
