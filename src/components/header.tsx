import { anchor_of, base_name, btn, cx, dir_url, home_url, is_root, route_url } from '../common';
import { LoginIcon, MoonIcon, SearchIcon, SunIcon, UserIcon } from './icons';
import { Logo } from './logo';
import type { HeaderPropsType } from '../types';

const Header = ({ data, route, theme, search_ref, on_navigate, on_toggle_theme, on_account, on_sign_in }: HeaderPropsType) => {
  const here = dir_url(data.href);
  return (
    <header className="sticky top-0 z-20 h-14 bg-bg/80 backdrop-blur-xl border-b border-border">
      <div className="wrap h-full flex items-center gap-3">
        <a
          href={home_url()}
          onClick={event => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
            event.preventDefault();
            on_navigate(home_url());
          }}
          className="tap shrink-0 rounded-md p-0.5 -m-0.5 focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="home"
        >
          <Logo className="w-6 h-6" />
        </a>

        <div className="flex-1 flex justify-center min-w-0">
          {data.allow_search && (
            <form
              role="search"
              className="relative w-full max-w-md"
              onSubmit={event => {
                event.preventDefault();
                const q = search_ref.current?.value.trim() ?? '';
                search_ref.current?.blur();
                on_navigate(route_url(here, { q }));
              }}
            >
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dim pointer-events-none" />
              <input
                ref={search_ref}
                key={route.q}
                type="search"
                enterKeyHint="search"
                defaultValue={route.q}
                placeholder={is_root(data.href) ? 'search everything' : `search in ${base_name(data.href)}`}
                onKeyDown={event => {
                  if (event.key !== 'Escape') return;
                  event.currentTarget.value = '';
                  event.currentTarget.blur();
                }}
                className="peer w-full h-9 pl-9 pr-9 bg-surface border border-border rounded-lg text-[13px] text-text outline-none transition-colors focus:border-accent placeholder:text-dim [&::-webkit-search-cancel-button]:hidden"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-dim border border-border rounded px-1.5 py-px max-sm:hidden peer-focus:hidden pointer-events-none">
                /
              </kbd>
            </form>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={on_toggle_theme} className={cx(btn.ghost, btn.icon)} aria-label={`switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="toggle theme">
            {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </button>
          {data.user ? (
            <button
              onClick={event => on_account(...anchor_of(event))}
              className={cx(btn.base, 'h-8 max-sm:h-9 max-sm:w-9 sm:px-2.5 text-accent bg-accent-dim hover:bg-accent/20')}
              aria-label={`account: ${data.user}`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="max-sm:hidden font-mono">{data.user}</span>
            </button>
          ) : (
            <button onClick={on_sign_in} className={cx(btn.outline, btn.icon, 'sm:w-auto sm:px-3')} aria-label="sign in">
              <LoginIcon className="w-3.5 h-3.5" />
              <span className="max-sm:hidden">sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };
