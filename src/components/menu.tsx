import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cx } from '../common';
import { useEscape } from '../hooks';
import type { MenuPropsType } from '../types';

const MARGIN = 8;

const is_narrow = () => window.matchMedia('(max-width: 639px)').matches;

const Menu = ({ menu, on_close }: MenuPropsType) => {
  useEscape(on_close);
  const panel = useRef<HTMLDivElement>(null);
  const [sheet] = useState(is_narrow);
  const [position, set_position] = useState({ left: menu.x, top: menu.y, ready: false });

  useLayoutEffect(() => {
    if (sheet || !panel.current) return;
    const { width, height } = panel.current.getBoundingClientRect();
    const left = Math.max(MARGIN, Math.min(menu.x - (menu.x + width > innerWidth - MARGIN ? width : 0), innerWidth - width - MARGIN));
    const top = menu.y + height > innerHeight - MARGIN ? Math.max(MARGIN, menu.y - height) : menu.y;
    set_position({ left, top, ready: true });
  }, [menu, sheet]);

  useEffect(() => {
    if (sheet) return;
    const close = () => on_close();
    addEventListener('resize', close);
    addEventListener('scroll', close, true);
    return () => {
      removeEventListener('resize', close);
      removeEventListener('scroll', close, true);
    };
  }, [on_close, sheet]);

  const items = menu.items.map((item, index) =>
    item.kind === 'sep' ? (
      <div key={index} className="my-1 h-px bg-border" />
    ) : (
      <button
        key={index}
        role="menuitem"
        onClick={() => {
          on_close();
          item.on_select();
        }}
        className={cx(
          'w-full flex items-center gap-3 rounded-md text-left cursor-pointer transition-colors duration-100',
          sheet ? 'h-12 px-3 text-[15px]' : 'h-8 px-2.5 text-[13px]',
          item.danger ? 'text-red hover:bg-red/10 active:bg-red/10' : 'text-text hover:bg-elevated active:bg-elevated',
        )}
      >
        <span className={cx('shrink-0 flex', item.danger ? 'text-red' : 'text-muted')}>{item.icon}</span>
        <span className="flex-1 truncate">{item.label}</span>
        {item.hint && <span className="text-dim text-[11px] font-mono">{item.hint}</span>}
      </button>
    ),
  );

  if (sheet) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 animate-[fade_150ms_ease-out]" onClick={on_close}>
        <div
          role="menu"
          onClick={event => event.stopPropagation()}
          className="absolute inset-x-0 bottom-0 bg-surface border-t border-border rounded-t-2xl px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-[sheet_260ms_cubic-bezier(0.32,0.72,0,1)]"
        >
          <div className="mx-auto mb-2 h-1 w-9 rounded-full bg-border" />
          {menu.title && (
            <div className="px-3 pb-2 mb-1 border-b border-border">
              <div className="font-mono text-[13px] font-medium truncate">{menu.title}</div>
              {menu.subtitle && <div className="text-xs text-muted mt-0.5">{menu.subtitle}</div>}
            </div>
          )}
          {items}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50"
      onMouseDown={on_close}
      onContextMenu={event => {
        event.preventDefault();
        on_close();
      }}
    >
      <div
        ref={panel}
        role="menu"
        onMouseDown={event => event.stopPropagation()}
        style={{ left: position.left, top: position.top, opacity: position.ready ? 1 : 0 }}
        className="absolute min-w-[200px] max-w-[280px] bg-surface border border-border rounded-xl p-1 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] animate-[pop_140ms_cubic-bezier(0.23,1,0.32,1)]"
      >
        {menu.title && (
          <div className="px-2.5 pt-1.5 pb-2 mb-1 border-b border-border">
            <div className="font-mono text-xs font-medium truncate">{menu.title}</div>
            {menu.subtitle && <div className="text-[11px] text-muted mt-0.5">{menu.subtitle}</div>}
          </div>
        )}
        {items}
      </div>
    </div>
  );
};

export { Menu };
