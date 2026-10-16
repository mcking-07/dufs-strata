import { useCallback, useRef, useState } from 'react';
import type { PathEntryType } from '../types';

const useSelection = (paths: PathEntryType[]) => {
  const [selected, set_selected] = useState<Set<string>>(new Set());
  const [selecting, set_selecting] = useState(false);
  const anchor = useRef(-1);

  const clear_selection = useCallback(() => {
    set_selected(new Set());
    set_selecting(false);
  }, []);

  const toggle = (name: string, range: boolean) => {
    const next = new Set(selected);
    const index = paths.findIndex(entry => entry.name === name);
    if (range && anchor.current >= 0) {
      const names = paths.slice(Math.min(anchor.current, index), Math.max(anchor.current, index) + 1).map(entry => entry.name);
      names.forEach(entry_name => next.add(entry_name));
    } else if (next.has(name)) next.delete(name);
    else next.add(name);
    anchor.current = index;
    set_selected(next);
    set_selecting(next.size > 0);
  };

  const toggle_all = () => {
    if (selected.size === paths.length) return clear_selection();
    set_selected(new Set(paths.map(entry => entry.name)));
    set_selecting(true);
  };

  return { selected, selecting, set_selecting, toggle, toggle_all, clear_selection };
};

export { useSelection };
