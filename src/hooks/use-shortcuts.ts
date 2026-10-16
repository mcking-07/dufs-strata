import { useEffect } from 'react';
import { is_typing } from '../common';
import type { ShortcutsOptionsType } from '../types';

const useShortcuts = ({ blocked, searchable, previewing, search_ref, on_step }: ShortcutsOptionsType) => {
  useEffect(() => {
    const on_key = (event: KeyboardEvent) => {
      if (is_typing(event.target) || event.metaKey || event.ctrlKey || event.altKey || blocked) return;
      if (event.key === '/' && searchable) {
        event.preventDefault();
        search_ref.current?.focus();
        search_ref.current?.select();
      } else if (previewing && event.key === 'ArrowLeft') on_step(-1);
      else if (previewing && event.key === 'ArrowRight') on_step(1);
    };
    addEventListener('keydown', on_key);
    return () => removeEventListener('keydown', on_key);
  }, [blocked, searchable, previewing, search_ref, on_step]);
};

export { useShortcuts };
