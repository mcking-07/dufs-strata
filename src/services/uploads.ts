import { safe } from 'safe-wrapper';
import { config } from '../config';
import { NetworkFailed, RequestFailed, UploadCancelled, UploadStalled } from '../errors';
import { auth_fetch, auth_headers } from './auth';
import { move_entry, status_text } from './dufs';
import type { ProgressHandlerType } from '../types';

const VERIFY = 64 * 1024;
const RETRIES = 4;
const STALL_MS = 30_000;

const send = (url: string, method: 'PUT' | 'PATCH', body: Blob, on_progress: ProgressHandlerType, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(new UploadCancelled());
    const xhr = new XMLHttpRequest();
    const watchdog = { timer: 0, stalled: false };
    const arm = () => {
      clearTimeout(watchdog.timer);
      watchdog.timer = window.setTimeout(() => {
        watchdog.stalled = true;
        xhr.abort();
      }, STALL_MS);
    };
    const settle = (action: () => void) => {
      clearTimeout(watchdog.timer);
      action();
    };

    xhr.open(method, url);
    for (const [name, value] of Object.entries(auth_headers())) xhr.setRequestHeader(name, value);
    if (method === 'PATCH') xhr.setRequestHeader('X-Update-Range', 'append');
    xhr.upload.onprogress = event => {
      arm();
      on_progress(event.loaded);
    };
    xhr.upload.onload = arm;
    xhr.onload = () =>
      settle(() => (xhr.status < 300 ? resolve() : reject(new RequestFailed(xhr.status === 413 ? 'file too large for the tunnel' : xhr.statusText || `http ${xhr.status}`, xhr.status, { url }))));
    xhr.onerror = () => settle(() => reject(new NetworkFailed()));
    xhr.onabort = () => settle(() => reject(watchdog.stalled ? new UploadStalled() : new UploadCancelled()));
    signal.addEventListener('abort', () => xhr.abort(), { once: true });
    arm();
    xhr.send(body);
  });

const is_retryable = (error: unknown) => !(error instanceof RequestFailed) || error.status >= 500 || error.status === 408 || error.status === 429;

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new UploadCancelled());
      },
      { once: true },
    );
  });

const same_bytes = (remote: ArrayBuffer, local: ArrayBuffer) => {
  if (remote.byteLength !== local.byteLength) return false;
  const right = new Uint8Array(local);
  return new Uint8Array(remote).every((byte, index) => byte === right[index]);
};

const part_url = (url: string, size: number) => {
  const slash = url.lastIndexOf('/') + 1;
  return `${url.slice(0, slash)}.${url.slice(slash)}.${size}.part`;
};

const resume_offset = async (part: string, file: Blob, signal: AbortSignal) => {
  const head = await auth_fetch(part, { method: 'HEAD', cache: 'no-store', signal });
  if (head.status === 404) return 0;
  if (!head.ok) throw new RequestFailed(status_text(head), head.status, { url: part });

  const size = Number(head.headers.get('content-length'));
  if (!(size > 0 && size <= file.size)) return 0;

  const from = Math.max(0, size - VERIFY);
  const tail = await auth_fetch(part, { headers: { Range: `bytes=${from}-${size - 1}` }, cache: 'no-store', signal });
  if (tail.status >= 500) throw new RequestFailed(status_text(tail), tail.status, { url: part });
  if (tail.status !== 206) return 0;

  const [remote, local] = await Promise.all([tail.arrayBuffer(), file.slice(from, size).arrayBuffer()]);
  return same_bytes(remote, local) ? size : 0;
};

const send_chunk = async (part: string, file: Blob, offset: number, on_progress: ProgressHandlerType, signal: AbortSignal) => {
  const start = offset < 0 ? await resume_offset(part, file, signal) : offset;
  if (start >= file.size) return start;
  const end = Math.min(start + config.upload.chunk_size, file.size);
  await send(part, start ? 'PATCH' : 'PUT', file.slice(start, end), loaded => on_progress(start + loaded), signal);
  return end;
};

const transfer = async (part: string, file: Blob, on_progress: ProgressHandlerType, signal: AbortSignal, on_retry: () => void, offset = -1, failures = 0): Promise<void> => {
  if (offset >= file.size) return;
  const [error, next] = await safe(send_chunk)(part, file, offset, on_progress, signal);
  if (!error) return transfer(part, file, on_progress, signal, on_retry, next, 0);
  if (signal.aborted || !is_retryable(error) || failures >= RETRIES) throw error;
  on_retry();
  await sleep(1000 * 2 ** failures, signal);
  return transfer(part, file, on_progress, signal, on_retry, -1, failures + 1);
};

const upload_file = async (url: string, file: Blob, on_progress: ProgressHandlerType, signal: AbortSignal, on_retry: () => void) => {
  if (file.size <= config.upload.chunk_size) return send(url, 'PUT', file, on_progress, signal);
  const part = part_url(url, file.size);
  const [error] = await safe(async () => {
    await transfer(part, file, on_progress, signal, on_retry);
    await move_entry(part, new URL(url, location.href).href);
  })();
  if (!error) return;
  if (signal.aborted) void auth_fetch(part, { method: 'DELETE' }).catch(() => undefined);
  throw error;
};

export { upload_file };
