import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { encode_path, is_running } from '../common';
import { upload_file } from '../services';
import type { QueuedUploadType, UploadItemType, UploadJobType } from '../types';

const CONCURRENCY = 3;
const RATE_WINDOW = 6;

const useUploads = (on_batch_done: () => void) => {
  const [items, set_items] = useState<UploadItemType[]>([]);
  const [rate, set_rate] = useState(0);
  const queue = useRef<QueuedUploadType[]>([]);
  const active = useRef(0);
  const controllers = useRef(new Map<number, AbortController>());
  const bytes = useRef(new Map<number, number>());
  const next_id = useRef(1);
  const done = useRef(on_batch_done);
  const latest = useRef(items);
  useLayoutEffect(() => {
    done.current = on_batch_done;
    latest.current = items;
  });

  const running = items.some(is_running);

  useEffect(() => {
    if (!running) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    const samples: [number, number][] = [];
    const timer = setInterval(() => {
      const now = performance.now();
      const sum = [...bytes.current.values()].reduce((total, sent) => total + sent, 0);
      if (sum < (samples.at(-1)?.[1] ?? 0)) samples.length = 0;
      samples.push([now, sum]);
      if (samples.length > RATE_WINDOW) samples.shift();
      const [start = now, sent = sum] = samples[0] ?? [];
      set_rate(now > start ? ((sum - sent) / (now - start)) * 1000 : 0);
    }, 1000);
    addEventListener('beforeunload', warn);
    return () => {
      clearInterval(timer);
      removeEventListener('beforeunload', warn);
      set_rate(0);
    };
  }, [running]);

  const update = useCallback((id: number, patch: Partial<UploadItemType>) => set_items(previous => previous.map(item => (item.id === id ? { ...item, ...patch } : item))), []);

  const pump = useCallback(() => {
    const run = () => {
      while (active.current < CONCURRENCY && queue.current.length) {
        const job = queue.current.shift();
        if (!job) return;
        active.current += 1;
        const controller = new AbortController();
        controllers.current.set(job.id, controller);
        bytes.current.set(job.id, 0);
        update(job.id, { status: 'active' });
        const progress = (loaded: number) => {
          bytes.current.set(job.id, loaded);
          update(job.id, { loaded, status: 'active' });
        };
        upload_file(job.url, job.file, progress, controller.signal, () => update(job.id, { status: 'retrying' }))
          .then(() => {
            bytes.current.set(job.id, job.file.size);
            update(job.id, { status: 'done', loaded: job.file.size });
          })
          .catch((error: Error) => update(job.id, { status: controller.signal.aborted ? 'cancelled' : 'error', error: error.message }))
          .finally(() => {
            active.current -= 1;
            controllers.current.delete(job.id);
            if (!active.current && !queue.current.length) done.current();
            run();
          });
      }
    };
    run();
  }, [update]);

  const add = useCallback(
    (jobs: UploadJobType[], dir_url: string) => {
      const fresh = jobs.map(({ file, path }): UploadItemType => {
        const id = next_id.current;
        next_id.current += 1;
        return { id, path, file, url: dir_url + encode_path(path), size: file.size, loaded: 0, status: 'queued' };
      });
      queue.current.push(...fresh.map(({ id, file, url }) => ({ id, file, url })));
      set_items(previous => [...previous.filter(is_running), ...fresh]);
      pump();
    },
    [pump],
  );

  const retry = useCallback(() => {
    const failed = latest.current.filter(item => item.status === 'error');
    if (!failed.length) return;
    const ids = new Set(failed.map(item => item.id));
    queue.current.push(...failed.map(({ id, file, url }) => ({ id, file, url })));
    set_items(previous => previous.map(item => (ids.has(item.id) ? { ...item, status: 'queued', loaded: 0, error: undefined } : item)));
    pump();
  }, [pump]);

  const cancel_all = useCallback(() => {
    const ids = new Set(queue.current.map(job => job.id));
    queue.current = [];
    set_items(previous => previous.map(item => (ids.has(item.id) ? { ...item, status: 'cancelled' } : item)));
    for (const controller of controllers.current.values()) controller.abort();
    if (!active.current) done.current();
  }, []);

  const dismiss = useCallback(() => {
    bytes.current.clear();
    set_items(previous => previous.filter(is_running));
  }, []);

  return { items, rate, add, cancel_all, retry, dismiss };
};

export { useUploads };
