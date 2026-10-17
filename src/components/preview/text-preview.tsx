import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import { safe } from 'safe-wrapper';
import { btn, cx, highlight, indent, is_markdown } from '../../common';
import { fetch_text, write_file } from '../../services';
import { EditIcon, SaveIcon } from '../icons';
import type { TextModeType, TextPreviewPropsType, TextStateType } from '../../types';

const TextPreview = ({ entry, url, is_admin, on_saved, on_dirty, guard, on_error }: TextPreviewPropsType) => {
  const [state, set_state] = useState<TextStateType>({ text: null, error: null });
  const [mode, set_mode] = useState<TextModeType>('view');
  const [draft, set_draft] = useState('');
  const [saving, set_saving] = useState(false);
  const markdown = is_markdown(entry.name);
  const dirty = mode === 'edit' && draft !== state.text;

  useEffect(() => {
    const controller = new AbortController();
    void safe(fetch_text)(url, controller.signal).then(([error, text]) => {
      if (controller.signal.aborted) return;
      set_state(error ? { text: null, error: error.message } : { text, error: null });
    });
    return () => controller.abort();
  }, [url]);

  useEffect(() => {
    on_dirty(dirty);
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    addEventListener('beforeunload', warn);
    return () => {
      removeEventListener('beforeunload', warn);
      on_dirty(false);
    };
  }, [dirty, on_dirty]);

  const save = async () => {
    set_saving(true);
    const [error] = await safe(write_file)(url, draft);
    if (error) on_error(`save failed: ${error.message}`);
    else {
      set_state({ text: draft, error: null });
      set_mode('view');
      on_saved();
    }
    set_saving(false);
  };

  if (state.error) return <p className="text-red text-sm text-center mt-10">failed to load: {state.error}</p>;
  if (state.text === null) return <div className="h-64 rounded-xl border border-border bg-surface animate-pulse" />;

  const modes: TextModeType[] = markdown ? ['view', 'source'] : ['view'];
  const tabs = (
    <div className="flex items-center justify-between gap-2 mb-3">
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface border border-border">
        {modes.map(option => (
          <button
            key={option}
            onClick={() => set_mode(option)}
            className={cx('tap h-7 px-2.5 rounded-md text-xs cursor-pointer transition-colors', mode === option ? 'bg-elevated text-text' : 'text-muted hover:text-text')}
          >
            {option === 'view' ? (markdown ? 'preview' : 'code') : option}
          </button>
        ))}
        {mode === 'edit' && <span className="h-7 px-2.5 rounded-md text-xs bg-elevated text-text flex items-center">editing</span>}
      </div>
      {is_admin &&
        (mode === 'edit' ? (
          <div className="flex gap-1.5">
            <button onClick={() => guard(() => set_mode('view'))} className={cx(btn.outline, btn.text)}>
              cancel
            </button>
            <button onClick={() => void save()} disabled={saving || draft === state.text} className={cx(btn.primary, btn.text)}>
              <SaveIcon className="w-3.5 h-3.5" /> {saving ? 'saving…' : 'save'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              set_draft(state.text ?? '');
              set_mode('edit');
            }}
            className={cx(btn.outline, btn.text)}
          >
            <EditIcon className="w-3.5 h-3.5" /> edit
          </button>
        ))}
    </div>
  );

  if (mode === 'edit') {
    return (
      <>
        {tabs}
        <textarea
          value={draft}
          autoFocus
          onChange={event => set_draft(event.target.value)}
          onKeyDown={event => {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
              event.preventDefault();
              void save();
            } else if (event.key === 'Tab' && !event.metaKey && !event.ctrlKey && !event.altKey) {
              event.preventDefault();
              indent(event.currentTarget, event.shiftKey);
            }
          }}
          spellCheck={false}
          className="w-full h-[calc(100dvh-16rem)] min-h-64 p-5 rounded-xl bg-surface border border-border font-mono text-[12.5px] leading-relaxed resize-none outline-none focus:border-accent"
        />
      </>
    );
  }

  if (markdown && mode === 'view') {
    const html = DOMPurify.sanitize(marked.parse(state.text, { async: false }));
    return (
      <>
        {tabs}
        <article className="md-body rounded-xl border border-border bg-surface p-8 max-sm:p-5" dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  }

  return (
    <>
      {tabs}
      <pre className="rounded-xl border border-border bg-surface overflow-auto text-[12.5px] leading-relaxed p-5 max-sm:p-4">
        <code className="hljs font-mono !bg-transparent !p-0" dangerouslySetInnerHTML={{ __html: highlight(markdown ? 'x.md' : entry.name, state.text) }} />
      </pre>
    </>
  );
};

export { TextPreview };
