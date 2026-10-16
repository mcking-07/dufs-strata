import { useEffect, useRef, useState } from 'react';

const has_files = (event: DragEvent) => !!event.dataTransfer?.types.includes('Files');

const useDrop = (enabled: boolean, on_drop: (transfer: DataTransfer) => void) => {
  const [dragging, set_dragging] = useState(false);
  const depth = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const enter = (event: DragEvent) => {
      if (!has_files(event)) return;
      depth.current += 1;
      set_dragging(true);
    };
    const leave = (event: DragEvent) => {
      if (!has_files(event)) return;
      depth.current -= 1;
      if (depth.current > 0) return;
      depth.current = 0;
      set_dragging(false);
    };
    const over = (event: DragEvent) => {
      if (has_files(event)) event.preventDefault();
    };
    const drop = (event: DragEvent) => {
      if (!has_files(event) || !event.dataTransfer) return;
      event.preventDefault();
      depth.current = 0;
      set_dragging(false);
      on_drop(event.dataTransfer);
    };
    addEventListener('dragenter', enter);
    addEventListener('dragleave', leave);
    addEventListener('dragover', over);
    addEventListener('drop', drop);
    return () => {
      removeEventListener('dragenter', enter);
      removeEventListener('dragleave', leave);
      removeEventListener('dragover', over);
      removeEventListener('drop', drop);
    };
  }, [enabled, on_drop]);

  return dragging;
};

export { useDrop };
