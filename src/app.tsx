import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { safe } from 'safe-wrapper';
import {
  absolute_url,
  base_name,
  btn,
  copy_text,
  cx,
  dir_name,
  dir_url,
  encode_path,
  entry_url,
  file_url,
  format_bytes,
  home_url,
  is_dir,
  is_root,
  jobs_from_drop,
  jobs_from_input,
  parent_url,
  plural,
  route_url,
  sort_paths,
  top_level,
} from './common';
import {
  DocIcon,
  DownloadIcon,
  DropOverlay,
  EditIcon,
  Empty,
  FileList,
  FilePlusIcon,
  FolderIcon,
  FolderPlusIcon,
  FolderUpIcon,
  Footer,
  HashIcon,
  Header,
  HomeIcon,
  LinkIcon,
  ListCheckIcon,
  LogOutIcon,
  Menu,
  Modals,
  Preview,
  SelectionBar,
  Toast,
  Toolbar,
  TrashIcon,
  UploadIcon,
  UploadPanel,
} from './components';
import { config } from './config';
import { ReadOnlyCredentials } from './errors';
import { useDrop, useEscape, useNavigation, useSelection, useShortcuts, useSort, useTheme, useToast, useUploads } from './hooks';
import { clear_credentials, create_folder, encode_credentials, fetch_hash, fetch_index, move_entry, remove_entry, set_credentials, write_file } from './services';
import type { AppPropsType, CreateKindType, MenuItemType, MenuStateType, ModalType, PathEntryType, UploadJobType } from './types';

const ICON = 'w-4 h-4';
const DOWNLOAD_GAP_MS = 400;

const App = ({ issue }: AppPropsType) => {
  const { toast, notify, dismiss } = useToast();
  const [modal, set_modal] = useState<ModalType | null>(null);
  const [menu, set_menu] = useState<MenuStateType | null>(null);
  const reset_selection = useRef(() => undefined as void);
  const search_ref = useRef<HTMLInputElement>(null);
  const file_input = useRef<HTMLInputElement>(null);
  const folder_input = useRef<HTMLInputElement>(null);

  const on_discard = useCallback((action: () => void) => set_modal({ kind: 'discard', action }), []);
  const on_directory_change = useCallback(() => reset_selection.current(), []);
  const { data, route, route_ref, loading, navigate, refresh, guard, set_dirty, discard, replace_index } = useNavigation({ notify, on_directory_change, on_discard });
  const { theme, toggle_theme } = useTheme();
  const { sort, change_sort } = useSort();
  const paths = useMemo(() => sort_paths(data.paths ?? [], sort), [data.paths, sort]);
  const { selected, selecting, set_selecting, toggle, toggle_all, clear_selection } = useSelection(paths);
  useLayoutEffect(() => {
    reset_selection.current = clear_selection;
  });

  const is_admin = !!data.user;
  const can_upload = is_admin && data.allow_upload;
  const can_delete = is_admin && data.allow_delete;
  const is_search = !!route.q;
  const here = dir_url(data.href);
  const at_root = is_root(data.href);
  const files = useMemo(() => paths.filter(entry => !is_dir(entry)), [paths]);
  const names = useMemo(() => new Set((data.paths ?? []).map(entry => entry.name)), [data.paths]);

  const preview_entry = useMemo<PathEntryType | null>(() => {
    if (!route.view) return null;
    return data.paths?.find(entry => entry.name === route.view) ?? { name: route.view, path_type: 'File', size: 0, mtime: 0 };
  }, [route.view, data.paths]);

  useEffect(() => {
    document.title = preview_entry ? base_name(preview_entry.name) : is_search ? `“${route.q}”` : at_root ? config.title : base_name(data.href);
  }, [preview_entry, is_search, route.q, at_root, data.href]);

  useEffect(() => {
    if (issue) notify(issue, 'error');
  }, [issue, notify]);

  const close_menu = useCallback(() => set_menu(null), []);
  const close_modal = useCallback(() => set_modal(null), []);
  const reload = useCallback(() => void refresh(), [refresh]);
  const uploads = useUploads(reload);

  const open_entry = useCallback(
    (entry: PathEntryType) => {
      if (is_dir(entry)) return navigate(entry_url(data.href, entry));
      const { path, q } = route_ref.current;
      navigate(route_url(path, { q, view: entry.name }), { preview: true });
    },
    [data.href, navigate, route_ref],
  );

  const close_preview = useCallback(
    () =>
      guard(() => {
        if ((history.state as { preview?: boolean } | null)?.preview) return history.back();
        const { path, q } = route_ref.current;
        navigate(route_url(path, { q }), { replace: true });
      }),
    [guard, navigate, route_ref],
  );

  const step_preview = useCallback(
    (delta: number) => {
      const { path, q, view } = route_ref.current;
      const next = files[files.findIndex(file => file.name === view) + delta];
      if (next) navigate(route_url(path, { q, view: next.name }), { replace: true, preview: true });
    },
    [files, navigate, route_ref],
  );

  const copy_link = useCallback(
    async (entry: PathEntryType) => {
      const [error] = await safe(copy_text)(absolute_url(entry_url(data.href, entry)));
      if (error) notify("couldn't copy link", 'error');
      else notify('link copied', 'success');
    },
    [data.href, notify],
  );

  const copy_hash = async (entry: PathEntryType) => {
    const [error] = await safe(async () => copy_text(await fetch_hash(entry_url(data.href, entry))))();
    if (error) notify('hashing failed', 'error');
    else notify('sha-256 copied', 'success');
  };

  const download = (entries: PathEntryType[]) => {
    entries.forEach((entry, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = is_dir(entry) ? `${entry_url(data.href, entry)}?zip` : entry_url(data.href, entry);
        link.download = is_dir(entry) ? `${base_name(entry.name)}.zip` : base_name(entry.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, index * DOWNLOAD_GAP_MS);
    });
    if (entries.length > 1) notify(`downloading ${entries.length} items — allow multiple downloads if asked`);
  };

  const transfer = useCallback(
    (jobs: UploadJobType[], empty_dirs: string[]) => {
      void Promise.all(empty_dirs.map(dir => safe(create_folder)(`${here}${encode_path(dir)}/`))).then(() => (jobs.length ? uploads.add(jobs, here) : refresh()));
    },
    [here, refresh, uploads],
  );

  const start_upload = useCallback(
    (jobs: UploadJobType[], empty_dirs: string[] = []) => {
      if (!jobs.length && !empty_dirs.length) return;
      const conflicts = [...new Set([...jobs.map(job => job.path), ...empty_dirs].map(top_level))].filter(name => names.has(name));
      if (conflicts.length && !is_search) return set_modal({ kind: 'overwrite', jobs, empty_dirs, conflicts });
      transfer(jobs, empty_dirs);
    },
    [names, is_search, transfer],
  );

  const on_drop = useCallback(
    (transfer: DataTransfer) => {
      jobs_from_drop(transfer)
        .then(({ jobs, empty_dirs }) => start_upload(jobs, empty_dirs))
        .catch((error: Error) => notify(`couldn't read dropped files: ${error.message}`, 'error'));
    },
    [start_upload, notify],
  );

  const dragging = useDrop(can_upload, on_drop);

  useEscape(clear_selection, selected.size > 0 && !preview_entry);
  useEscape(close_preview, !!preview_entry);
  useShortcuts({ blocked: !!menu || !!modal, searchable: data.allow_search, previewing: !!preview_entry, search_ref, on_step: step_preview });

  const delete_entries = async (entries: PathEntryType[]) => {
    set_modal(null);
    const results = await Promise.all(entries.map(entry => safe(remove_entry)(entry_url(data.href, entry))));
    const failed = results.filter(([error]) => error).length;
    const deleted = entries.length - failed;
    const [first] = entries;
    if (failed) notify(`${failed} of ${entries.length} couldn't be deleted`, 'error');
    else notify(deleted === 1 && first ? `deleted ${base_name(first.name)}` : `deleted ${deleted} items`, 'success');
    clear_selection();
    if (preview_entry && entries.some(entry => entry.name === preview_entry.name)) close_preview();
    void refresh();
  };

  const rename_entry = async (entry: PathEntryType, name: string) => {
    set_modal(null);
    const parent = dir_name(entry.name);
    const target = { ...entry, name: parent ? `${parent}/${name}` : name };
    const [error] = await safe(move_entry)(entry_url(data.href, entry), absolute_url(entry_url(data.href, target)));
    if (error) return notify(`rename failed: ${error.message}`, 'error');
    notify(`renamed to ${name}`, 'success');
    if (preview_entry?.name === entry.name) navigate(route_url(route.path, { q: route.q, view: target.name }), { replace: true, preview: true });
    void refresh();
  };

  const create_entry = async (type: CreateKindType, name: string) => {
    set_modal(null);
    const url = file_url(data.href, name);
    const [error] = await safe(() => (type === 'folder' ? create_folder(`${url}/`) : write_file(url, '')))();
    if (error) return notify(`create failed: ${error.message}`, 'error');
    notify(`created ${name}`, 'success');
    await refresh();
    if (type === 'file') navigate(route_url(route.path, { q: route.q, view: name }), { preview: true });
  };

  const upload_jobs = (jobs: UploadJobType[], empty_dirs: string[]) => {
    set_modal(null);
    if (jobs.length || empty_dirs.length) transfer(jobs, empty_dirs);
    else notify('nothing new to upload');
  };

  const confirm_discard = (action: () => void) => {
    set_modal(null);
    discard(action);
  };

  const sign_in = async (user: string, pass: string) => {
    const credentials = encode_credentials(user, pass);
    const fresh = await fetch_index(route.path, route.q, credentials);
    if (!fresh.user) throw new ReadOnlyCredentials();
    set_credentials(credentials);
    replace_index(fresh);
    set_modal(null);
    notify(`signed in as ${fresh.user}`, 'success');
  };

  const sign_out = () => {
    clear_credentials();
    clear_selection();
    void refresh();
    notify('signed out');
  };

  const entry_menu = (entry: PathEntryType, x: number, y: number) => {
    const dir = is_dir(entry);
    const items: MenuItemType[] = [
      { label: dir ? 'open folder' : 'open', icon: dir ? <FolderIcon className={ICON} /> : <DocIcon className={ICON} />, on_select: () => open_entry(entry) },
      { label: 'copy link', icon: <LinkIcon className={ICON} />, on_select: () => void copy_link(entry) },
      ...(!dir || data.allow_archive ? [{ label: dir ? 'download as zip' : 'download', icon: <DownloadIcon className={ICON} />, on_select: () => download([entry]) }] : []),
      ...(!dir ? [{ label: 'copy sha-256', icon: <HashIcon className={ICON} />, on_select: () => void copy_hash(entry) }] : []),
      ...(!preview_entry ? [{ label: selected.has(entry.name) ? 'deselect' : 'select', icon: <ListCheckIcon className={ICON} />, on_select: () => toggle(entry.name, false) }] : []),
      ...(is_admin ? [{ kind: 'sep' as const }] : []),
      ...(can_upload ? [{ label: 'rename', icon: <EditIcon className={ICON} />, on_select: () => set_modal({ kind: 'rename', entry }) }] : []),
      ...(can_delete ? [{ label: 'delete', icon: <TrashIcon className={ICON} />, danger: true, on_select: () => set_modal({ kind: 'delete', entries: [entry] }) }] : []),
    ];
    set_menu({ title: base_name(entry.name), subtitle: dir ? plural(entry.size, 'item') : format_bytes(entry.size), items, x, y });
  };

  const new_menu = (x: number, y: number) =>
    set_menu({
      x,
      y,
      items: [
        { label: 'upload files', icon: <UploadIcon className={ICON} />, on_select: () => file_input.current?.click() },
        { label: 'upload folder', icon: <FolderUpIcon className={ICON} />, on_select: () => folder_input.current?.click() },
        { kind: 'sep' },
        { label: 'new folder', icon: <FolderPlusIcon className={ICON} />, on_select: () => set_modal({ kind: 'new', type: 'folder' }) },
        { label: 'new text file', icon: <FilePlusIcon className={ICON} />, on_select: () => set_modal({ kind: 'new', type: 'file' }) },
      ],
    });

  const account_menu = (x: number, y: number) =>
    set_menu({ x, y, title: data.user ?? '', subtitle: 'signed in · can upload & delete', items: [{ label: 'sign out', icon: <LogOutIcon className={ICON} />, on_select: sign_out }] });

  const selected_entries = paths.filter(entry => selected.has(entry.name));
  const selected_size = selected_entries.reduce((sum, entry) => sum + (is_dir(entry) ? 0 : entry.size), 0);
  const preview_index = preview_entry ? files.findIndex(file => file.name === preview_entry.name) : -1;

  const listing = !data.dir_exists ? (
    <Empty title="folder not found" hint="it may have been moved or deleted">
      <button onClick={() => navigate(home_url())} className={cx(btn.outline, btn.text, 'mt-4')}>
        <HomeIcon className="w-3.5 h-3.5" /> go home
      </button>
    </Empty>
  ) : !paths.length ? (
    is_search ? (
      <Empty title={`nothing matches “${route.q}”`} hint={at_root ? 'try a shorter or different term' : `searched inside ${base_name(data.href)} only`} />
    ) : (
      <Empty title="this folder is empty" hint={can_upload ? 'drop files anywhere to upload' : undefined} />
    )
  ) : (
    <FileList
      href={data.href}
      paths={paths}
      parent={!at_root && !is_search ? parent_url(data.href) : null}
      sort={sort}
      selected={selected}
      selecting={selecting}
      can_archive={data.allow_archive}
      on_sort={change_sort}
      on_toggle={toggle}
      on_toggle_all={toggle_all}
      on_open={open_entry}
      on_navigate={navigate}
      on_menu={entry_menu}
      on_copy_link={entry => void copy_link(entry)}
      on_long_press={entry => {
        if (!selected.has(entry.name)) toggle(entry.name, false);
      }}
    />
  );

  return (
    <div className="min-h-dvh flex flex-col">
      <div className={cx('fixed top-0 inset-x-0 z-50 h-0.5 pointer-events-none transition-opacity duration-300', loading ? 'opacity-100' : 'opacity-0')}>
        <div className="h-full w-1/3 bg-accent animate-[load_1s_ease-in-out_infinite]" />
      </div>

      <Header
        data={data}
        route={route}
        theme={theme}
        search_ref={search_ref}
        on_navigate={navigate}
        on_toggle_theme={toggle_theme}
        on_account={account_menu}
        on_sign_in={() => set_modal({ kind: 'login' })}
      />

      {preview_entry ? (
        <Preview
          entry={preview_entry}
          url={file_url(data.href, preview_entry.name)}
          is_admin={can_upload}
          position={{ index: preview_index, total: preview_index >= 0 ? files.length : 1 }}
          on_close={close_preview}
          on_prev={preview_index > 0 ? () => step_preview(-1) : undefined}
          on_next={preview_index >= 0 && preview_index < files.length - 1 ? () => step_preview(1) : undefined}
          on_copy_link={() => void copy_link(preview_entry)}
          on_menu={(x, y) => entry_menu(preview_entry, x, y)}
          on_saved={reload}
          on_dirty={set_dirty}
          guard={guard}
          on_error={message => notify(message, 'error')}
        />
      ) : (
        <main className="flex-1 flex flex-col">
          <Toolbar
            data={data}
            route={route}
            count={paths.length}
            selecting={selecting}
            can_upload={can_upload}
            file_input={file_input}
            folder_input={folder_input}
            on_navigate={navigate}
            on_toggle_selecting={() => (selecting ? clear_selection() : set_selecting(true))}
            on_new={new_menu}
            on_files={list => start_upload(jobs_from_input(list))}
          />
          <div className={cx('wrap flex-1 flex flex-col', paths.length > 0 && 'pb-28')}>{listing}</div>
          <Footer />
        </main>
      )}

      {selected.size > 0 && !preview_entry && (
        <SelectionBar
          count={selected.size}
          size={selected_size}
          all={selected.size === paths.length}
          on_clear={clear_selection}
          on_toggle_all={toggle_all}
          on_download={() => download(selected_entries)}
          on_delete={can_delete ? () => set_modal({ kind: 'delete', entries: selected_entries }) : undefined}
        />
      )}

      {dragging && <DropOverlay href={data.href} />}
      {menu && <Menu menu={menu} on_close={close_menu} />}

      <Modals
        modal={modal}
        names={names}
        is_search={is_search}
        on_close={close_modal}
        on_login={sign_in}
        on_delete={entries => void delete_entries(entries)}
        on_rename={(entry, name) => void rename_entry(entry, name)}
        on_create={(type, name) => void create_entry(type, name)}
        on_discard={confirm_discard}
        on_upload={upload_jobs}
      />

      <UploadPanel items={uploads.items} rate={uploads.rate} raised={selected.size > 0 && !preview_entry} on_cancel={uploads.cancel_all} on_retry={uploads.retry} on_dismiss={uploads.dismiss} />
      {toast && <Toast toast={toast} on_done={dismiss} />}
    </div>
  );
};

export { App };
