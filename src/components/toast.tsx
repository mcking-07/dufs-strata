import { useEffect } from 'react';
import { cx } from '../common';
import { AlertIcon, CheckIcon } from './icons';
import type { ToastPropsType } from '../types';

const ERROR_MS = 4000;
const INFO_MS = 2400;
const READING_MS_PER_CHARACTER = 60;

const Toast = ({ toast, on_done }: ToastPropsType) => {
  const error = toast.kind === 'error';

  useEffect(() => {
    const timer = setTimeout(on_done, error ? Math.max(ERROR_MS, toast.message.length * READING_MS_PER_CHARACTER) : INFO_MS);
    return () => clearTimeout(timer);
  }, [toast, error, on_done]);

  return (
    <div role="status" aria-live="polite" className="fixed left-1/2 -translate-x-1/2 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[60] pointer-events-none">
      <div
        key={toast.id}
        className={cx(
          'flex gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-mono shadow-lg animate-[rise_200ms_cubic-bezier(0.23,1,0.32,1)] max-w-[90vw]',
          error ? 'items-start w-max bg-surface border-red/50 text-red' : 'items-center bg-elevated border-border text-text',
        )}
      >
        {toast.kind === 'success' && <CheckIcon className="w-3.5 h-3.5 text-green shrink-0" />}
        {error && <AlertIcon className="w-3.5 h-3.5 shrink-0 mt-px" />}
        <span className={error ? 'min-w-0 break-words' : 'truncate'}>{toast.message}</span>
      </div>
    </div>
  );
};

export { Toast };
