import { base_name, btn, cx, is_dir, top_level } from '../../common';
import { ConfirmDialog } from './confirm-dialog';
import { LoginDialog } from './login-dialog';
import { PromptDialog } from './prompt-dialog';
import type { ModalsPropsType } from '../../types';

const INVALID_NAME = /[/\\]|^\.\.?$/;

const name_error = (value: string, names: Set<string>, current?: string) => {
  if (INVALID_NAME.test(value)) return 'names cannot contain / or \\';
  return value !== current && names.has(value) ? 'an item with that name already exists' : null;
};

const Modals = ({ modal, names, is_search, on_close, on_login, on_delete, on_rename, on_create, on_discard, on_upload }: ModalsPropsType) => {
  if (!modal) return null;

  if (modal.kind === 'login') return <LoginDialog on_close={on_close} on_login={on_login} />;

  if (modal.kind === 'delete') {
    const [first] = modal.entries;
    const message =
      first && modal.entries.length === 1 ? (
        <>
          permanently delete <span className="font-mono text-text">{base_name(first.name)}</span>
          {is_dir(first) && ' and everything inside it'}? this can't be undone.
        </>
      ) : (
        <>
          permanently delete {modal.entries.length} items{modal.entries.some(is_dir) && ', including folders and their contents'}? this can't be undone.
        </>
      );
    return (
      <ConfirmDialog
        danger
        title={modal.entries.length === 1 ? 'delete item' : `delete ${modal.entries.length} items`}
        message={message}
        confirm_label="delete"
        on_confirm={() => on_delete(modal.entries)}
        on_cancel={on_close}
      />
    );
  }

  if (modal.kind === 'rename') {
    const current = base_name(modal.entry.name);
    return (
      <PromptDialog
        title="rename"
        label="new name"
        initial={current}
        submit_label="rename"
        validate={value => name_error(value, is_search ? new Set() : names, current)}
        on_submit={value => on_rename(modal.entry, value)}
        on_cancel={on_close}
      />
    );
  }

  if (modal.kind === 'new') {
    const folder = modal.type === 'folder';
    return (
      <PromptDialog
        title={folder ? 'new folder' : 'new text file'}
        label={folder ? 'folder name' : 'file name, e.g. notes.txt'}
        submit_label="create"
        validate={value => name_error(value, names)}
        on_submit={value => on_create(modal.type, value)}
        on_cancel={on_close}
      />
    );
  }

  if (modal.kind === 'discard') {
    return (
      <ConfirmDialog
        danger
        title="discard changes?"
        message="your edits haven't been saved. leaving now will lose them."
        confirm_label="discard"
        on_confirm={() => on_discard(modal.action)}
        on_cancel={on_close}
      />
    );
  }

  const { conflicts, jobs, empty_dirs } = modal;
  const message =
    conflicts.length === 1 ? (
      <>
        <span className="font-mono text-text">{conflicts[0]}</span> already exists here.
      </>
    ) : (
      <>
        {conflicts.length} items already exist here:{' '}
        <span className="font-mono text-text">
          {conflicts.slice(0, 3).join(', ')}
          {conflicts.length > 3 && ` +${conflicts.length - 3} more`}
        </span>
      </>
    );
  const skip = () => {
    const existing = new Set(conflicts);
    on_upload(
      jobs.filter(job => !existing.has(top_level(job.path))),
      empty_dirs.filter(dir => !existing.has(top_level(dir))),
    );
  };
  return (
    <ConfirmDialog
      title="replace existing items?"
      message={message}
      confirm_label="replace"
      extra={
        <button className={cx(btn.outline, btn.text)} onClick={skip}>
          skip
        </button>
      }
      on_confirm={() => on_upload(jobs, empty_dirs)}
      on_cancel={on_close}
    />
  );
};

export { Modals };
