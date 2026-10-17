import { useEffect, useRef, useState } from 'react';
import { btn, cx } from '../../common';
import { Dialog } from './dialog';
import type { PromptDialogPropsType } from '../../types';

const PromptDialog = ({ title, label, initial = '', submit_label, validate, on_submit, on_cancel }: PromptDialogPropsType) => {
  const [value, set_value] = useState(initial);
  const input = useRef<HTMLInputElement>(null);
  const trimmed = value.trim();
  const error = trimmed ? (validate?.(trimmed) ?? null) : null;
  const disabled = !trimmed || !!error || trimmed === initial;

  useEffect(() => {
    const element = input.current;
    if (!element) return;
    element.focus();
    const dot = initial.lastIndexOf('.');
    element.setSelectionRange(0, dot > 0 ? dot : initial.length);
  }, [initial]);

  const submit = () => {
    if (!disabled) on_submit(trimmed);
  };

  return (
    <Dialog
      title={title}
      on_close={on_cancel}
      footer={
        <>
          <button className={cx(btn.outline, btn.text)} onClick={on_cancel}>
            cancel
          </button>
          <button className={cx(btn.primary, btn.text)} disabled={disabled} onClick={submit}>
            {submit_label}
          </button>
        </>
      }
    >
      <label className="block">
        <span className="sr-only">{label}</span>
        <input
          ref={input}
          value={value}
          onChange={event => set_value(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') submit();
          }}
          placeholder={label}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className={cx('w-full h-10 px-3 bg-bg border rounded-lg font-mono text-[13px] outline-none transition-colors', error ? 'border-red' : 'border-border focus:border-accent')}
        />
      </label>
      {error && <p className="text-red text-xs mt-2">{error}</p>}
    </Dialog>
  );
};

export { PromptDialog };
