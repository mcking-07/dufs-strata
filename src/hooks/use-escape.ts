import { useEffect, useLayoutEffect, useRef } from 'react';

const layers: (() => void)[] = [];
const state = { listening: false };

const on_key = (event: KeyboardEvent) => {
  const top = layers.at(-1);
  if (event.key !== 'Escape' || !top) return;
  event.preventDefault();
  top();
};

const useEscape = (handler: () => void, active = true) => {
  const latest = useRef(handler);
  useLayoutEffect(() => {
    latest.current = handler;
  });
  useEffect(() => {
    if (!active) return;
    const layer = () => latest.current();
    layers.push(layer);
    if (!state.listening) {
      document.addEventListener('keydown', on_key);
      state.listening = true;
    }
    return () => {
      layers.splice(layers.indexOf(layer), 1);
    };
  }, [active]);
};

export { useEscape };
