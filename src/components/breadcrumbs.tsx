import { crumbs, cx, dir_url, home_url, is_root, route_url } from '../common';
import { ChevronRightIcon, HomeIcon, XIcon } from './icons';
import type { BreadcrumbsPropsType, CrumbPropsType } from '../types';

const Crumb = ({ url, current, label, children, on_navigate }: CrumbPropsType) => (
  <a
    href={url}
    aria-label={label}
    aria-current={current ? 'page' : undefined}
    onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      if (!current) on_navigate(url);
    }}
    className={cx(
      'flex items-center h-7 max-sm:h-10 px-2 rounded-md text-[13px] font-mono transition-colors duration-100 min-w-0',
      current ? 'text-text font-medium' : 'text-muted hover:text-text hover:bg-surface',
    )}
  >
    {children}
  </a>
);

const Breadcrumbs = ({ href, query, on_navigate }: BreadcrumbsPropsType) => {
  const trail = crumbs(href);
  const here = dir_url(href);
  return (
    <nav aria-label="breadcrumb" className="flex-1 min-w-0 max-sm:basis-full">
      <ol
        ref={element => {
          if (element) element.scrollLeft = element.scrollWidth;
        }}
        className="flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-1.5 px-1.5"
      >
        <li className="shrink-0">
          <Crumb url={home_url()} current={is_root(href) && !query} on_navigate={on_navigate} label="home">
            <HomeIcon className="w-4 h-4" />
          </Crumb>
        </li>
        {trail.map((crumb, index) => (
          <li key={crumb.url} className="flex items-center shrink-0 min-w-0">
            <ChevronRightIcon className="w-3.5 h-3.5 text-dim shrink-0" />
            <Crumb url={crumb.url} current={index === trail.length - 1 && !query} on_navigate={on_navigate}>
              <span className="truncate max-w-[40vw] sm:max-w-[240px]">{crumb.name}</span>
            </Crumb>
          </li>
        ))}
        {query && (
          <li className="flex items-center shrink-0">
            <ChevronRightIcon className="w-3.5 h-3.5 text-dim shrink-0" />
            <span className="flex items-center gap-1.5 pl-2 pr-1 h-7 rounded-md bg-accent-dim text-accent text-[13px] font-mono">
              “{query}”
              <button onClick={() => on_navigate(route_url(here, {}))} className="w-5 h-5 inline-flex items-center justify-center rounded hover:bg-accent/20 cursor-pointer" aria-label="clear search">
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export { Breadcrumbs };
