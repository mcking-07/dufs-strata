import { useEscape } from '../../hooks';
import type { DialogPropsType } from '../../types';

const Dialog = ({ title, icon, children, footer, on_close }: DialogPropsType) => {
  useEscape(on_close);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 animate-[fade_150ms_ease-out]"
      onMouseDown={event => event.target === event.currentTarget && on_close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full sm:max-w-sm bg-surface border border-border sm:rounded-xl rounded-t-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl animate-[rise_200ms_cubic-bezier(0.23,1,0.32,1)]"
      >
        <div className="flex items-center gap-2.5 mb-3">
          {icon}
          <h2 className="font-semibold text-[15px]">{title}</h2>
        </div>
        {children}
        <div className="flex justify-end gap-2 mt-5">{footer}</div>
      </div>
    </div>
  );
};

export { Dialog };
