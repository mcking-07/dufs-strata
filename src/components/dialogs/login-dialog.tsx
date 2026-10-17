import { type FormEvent, useState } from 'react';
import { safe } from 'safe-wrapper';
import { btn, cx } from '../../common';
import { RequestFailed } from '../../errors';
import { Dialog } from './dialog';
import type { LoginDialogPropsType } from '../../types';

const INPUT = 'w-full h-10 px-3 bg-bg border border-border rounded-lg font-mono text-[13px] outline-none focus:border-accent transition-colors';

const LoginDialog = ({ on_close, on_login }: LoginDialogPropsType) => {
  const [user, set_user] = useState('');
  const [pass, set_pass] = useState('');
  const [error, set_error] = useState('');
  const [busy, set_busy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !pass || busy) return;
    set_busy(true);
    set_error('');
    const [failure] = await safe(on_login)(user, pass);
    if (!failure) return;
    set_error(failure instanceof RequestFailed && failure.status === 401 ? 'wrong username or password' : failure.message);
    set_busy(false);
  };

  return (
    <Dialog
      title="sign in"
      on_close={on_close}
      footer={
        <>
          <button type="button" className={cx(btn.outline, btn.text)} onClick={on_close}>
            cancel
          </button>
          <button type="submit" form="login" className={cx(btn.primary, btn.text)} disabled={!user || !pass || busy}>
            {busy ? 'signing in…' : 'sign in'}
          </button>
        </>
      }
    >
      <p className="text-muted text-[13px] -mt-1 mb-4">sign in to upload, rename and delete files.</p>
      <form id="login" onSubmit={event => void submit(event)} className="flex flex-col gap-2.5">
        <input
          autoFocus
          value={user}
          onChange={event => set_user(event.target.value)}
          placeholder="username"
          autoComplete="username"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className={INPUT}
        />
        <input type="password" value={pass} onChange={event => set_pass(event.target.value)} placeholder="password" autoComplete="current-password" className={INPUT} />
        {error && (
          <p role="alert" className="text-red text-xs">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
};

export { LoginDialog };
