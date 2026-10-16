import type { MouseEvent } from 'react';

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

const is_typing = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || TYPING_TAGS.has(target.tagName));

const is_plain_click = (event: MouseEvent) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

const anchor_of = (event: MouseEvent<HTMLElement>, offset = 6) => {
  const rect = event.currentTarget.getBoundingClientRect();
  return [rect.right, rect.bottom + offset] as const;
};

export { anchor_of, is_plain_click, is_typing };
