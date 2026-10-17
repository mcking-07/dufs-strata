import { btn, cx } from '../../common';
import { AlertIcon } from '../icons';
import { Dialog } from './dialog';
import type { ConfirmDialogPropsType } from '../../types';

const ConfirmDialog = ({ title, message, confirm_label, danger, extra, on_confirm, on_cancel }: ConfirmDialogPropsType) => (
  <Dialog
    title={title}
    icon={danger ? <AlertIcon className="w-[18px] h-[18px] text-red" /> : undefined}
    on_close={on_cancel}
    footer={
      <>
        <button className={cx(btn.outline, btn.text)} onClick={on_cancel}>
          cancel
        </button>
        {extra}
        <button autoFocus className={cx(danger ? btn.danger : btn.primary, btn.text)} onClick={on_confirm}>
          {confirm_label}
        </button>
      </>
    }
  >
    <div className="text-muted text-[13px] leading-relaxed break-words">{message}</div>
  </Dialog>
);

export { ConfirmDialog };
