import type { ChangeEvent } from 'react';
import { anchor_of, base_name, btn, cx, dir_url, is_root, plural } from '../common';
import { Breadcrumbs } from './breadcrumbs';
import { DownloadIcon, ListCheckIcon, PlusIcon, UploadIcon } from './icons';
import type { ToolbarPropsType } from '../types';

const Toolbar = ({ data, route, count, selecting, can_upload, file_input, folder_input, on_navigate, on_toggle_selecting, on_new, on_files }: ToolbarPropsType) => {
  const here = dir_url(data.href);
  const is_search = !!route.q;
  const on_change = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) on_files(event.target.files);
    event.target.value = '';
  };

  return (
    <div className="wrap flex items-center gap-2 min-h-14 py-2 max-sm:flex-wrap sm:sticky sm:top-14 sm:z-10 sm:bg-bg">
      <Breadcrumbs href={data.href} query={route.q} on_navigate={on_navigate} />

      <span className="text-[11px] text-dim font-mono tabular-nums whitespace-nowrap max-sm:mr-auto">{plural(count, is_search ? 'result' : 'item')}</span>

      <div className="flex items-center gap-1.5">
        {!is_root(data.href) && !is_search && data.allow_archive && count > 0 && (
          <a href={`${here}?zip`} download={`${base_name(data.href)}.zip`} className={cx(btn.outline, btn.icon)} aria-label="download folder as zip" title="download folder as zip">
            <DownloadIcon className="w-3.5 h-3.5" />
          </a>
        )}
        {count > 0 && (
          <button
            onClick={on_toggle_selecting}
            className={cx(selecting ? btn.primary : btn.outline, btn.icon, 'sm:hidden')}
            aria-label={selecting ? 'stop selecting' : 'select items'}
            aria-pressed={selecting}
          >
            <ListCheckIcon className="w-4 h-4" />
          </button>
        )}
        {can_upload && !is_search && (
          <>
            <button onClick={() => file_input.current?.click()} className={cx(btn.outline, btn.text, 'max-sm:hidden')}>
              <UploadIcon className="w-3.5 h-3.5" /> upload
            </button>
            <button onClick={event => on_new(...anchor_of(event))} className={cx(btn.primary, btn.icon)} aria-label="new / upload" title="new">
              <PlusIcon className="w-4 h-4" />
            </button>
            <input ref={file_input} type="file" multiple hidden onChange={on_change} />
            <input ref={folder_input} type="file" multiple hidden {...{ webkitdirectory: '' }} onChange={on_change} />
          </>
        )}
      </div>
    </div>
  );
};

export { Toolbar };
