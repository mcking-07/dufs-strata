import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { safe } from 'safe-wrapper';
import { location_key, read_route, route_url } from '../common';
import { RequestFailed } from '../errors';
import { clear_credentials, fetch_index, get_credentials, initial_index } from '../services';
import type { IndexDataType, LocationType, NavigateOptionsType, NavigationOptionsType, RouteType } from '../types';

const scroll_key = (route: RouteType) => `${location_key(route)}#${route.view ?? ''}`;

const useNavigation = ({ notify, on_directory_change, on_discard }: NavigationOptionsType) => {
  const [view, set_view] = useState(() => ({ key: location_key(read_route()), data: initial_index }));
  const [route, set_route] = useState(read_route);
  const [loading, set_loading] = useState(false);
  const route_ref = useRef(route);
  const cache = useRef(new Map<string, IndexDataType>([[view.key, initial_index]]));
  const sequence = useRef(0);
  const scrolls = useRef(new Map<string, number>());
  const restore_for = useRef<string | null>(null);
  const dirty = useRef(false);
  const callbacks = useRef({ on_directory_change, on_discard });
  useLayoutEffect(() => {
    callbacks.current = { on_directory_change, on_discard };
  });

  const load = useCallback(
    async (target: LocationType, fresh = false) => {
      const key = location_key(target);
      sequence.current += 1;
      const id = sequence.current;
      const cached = !fresh && cache.current.get(key);
      if (cached) set_view({ key, data: cached });
      set_loading(true);

      const attempt = async (): Promise<void> => {
        const [error, data] = await safe(fetch_index)(target.path, target.q);
        if (data) cache.current.set(key, data);
        if (id !== sequence.current) return;
        if (data) return set_view({ key, data });
        if (error instanceof RequestFailed && error.status === 401 && get_credentials()) {
          clear_credentials();
          cache.current.clear();
          notify('session expired — signed out', 'error');
          return attempt();
        }
        notify(`couldn't load folder: ${error?.message}`, 'error');
      };

      await attempt();
      if (id === sequence.current) set_loading(false);
    },
    [notify],
  );

  const refresh = useCallback(() => {
    cache.current.clear();
    return load(route_ref.current, true);
  }, [load]);

  const apply_route = useCallback(
    (next: RouteType, popped: boolean) => {
      const previous = route_ref.current;
      scrolls.current.set(scroll_key(previous), scrollY);
      route_ref.current = next;
      set_route(next);
      const changed = location_key(previous) !== location_key(next);
      if (changed) {
        callbacks.current.on_directory_change();
        void load(next);
      }
      if (popped) restore_for.current = scroll_key(next);
      else if (changed || next.view) scrollTo(0, 0);
      else restore_for.current = `${location_key(next)}#`;
    },
    [load],
  );

  const set_dirty = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);

  const guard = useCallback((action: () => void) => (dirty.current ? callbacks.current.on_discard(action) : action()), []);

  const discard = useCallback((action: () => void) => {
    dirty.current = false;
    action();
  }, []);

  const navigate = useCallback(
    (url: string, { replace, preview }: NavigateOptionsType = {}) =>
      guard(() => {
        const state = preview ? { preview: true } : null;
        if (replace) history.replaceState(state, '', url);
        else history.pushState(state, '', url);
        apply_route(read_route(), false);
      }),
    [apply_route, guard],
  );

  const replace_index = useCallback((data: IndexDataType) => {
    const key = location_key(route_ref.current);
    cache.current.clear();
    cache.current.set(key, data);
    set_view({ key, data });
  }, []);

  useEffect(() => {
    history.scrollRestoration = 'manual';
    const on_pop = () => {
      if (!dirty.current) return apply_route(read_route(), true);
      const { path, q, view: preview } = route_ref.current;
      history.pushState({ preview: true }, '', route_url(path, { q, view: preview }));
      callbacks.current.on_discard(() => history.back());
    };
    addEventListener('popstate', on_pop);
    return () => removeEventListener('popstate', on_pop);
  }, [apply_route]);

  useLayoutEffect(() => {
    const key = restore_for.current;
    if (!key || view.key !== location_key(route)) return;
    restore_for.current = null;
    scrollTo(0, scrolls.current.get(key) ?? 0);
  }, [view, route]);

  useEffect(() => {
    if (get_credentials() && !initial_index.user) void load(route_ref.current);
  }, [load]);

  return { data: view.data, route, route_ref, loading, navigate, refresh, guard, set_dirty, discard, replace_index };
};

export { useNavigation };
