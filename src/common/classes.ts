const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

const BASE =
  'tap inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-xs font-medium cursor-pointer select-none transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2';

const btn = {
  base: BASE,
  outline: `${BASE} h-8 border border-border bg-surface text-muted hover:text-text hover:border-dim`,
  ghost: `${BASE} h-8 text-muted hover:text-text hover:bg-elevated`,
  primary: `${BASE} h-8 border border-accent bg-accent text-on-accent hover:brightness-110`,
  danger: `${BASE} h-8 border border-red/50 bg-red/10 text-red hover:bg-red hover:text-white`,
  icon: 'w-8 max-sm:h-9 max-sm:w-9',
  text: 'px-3',
};

export { btn, cx };
