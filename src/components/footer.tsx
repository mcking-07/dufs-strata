import { config } from '../config';

const Footer = () => {
  if (!config.footer) return null;
  const { text, label, href } = config.footer;
  return (
    <footer className="wrap py-8 text-center text-[11px] text-dim font-mono">
      {text.split('♥').map((part, index) => (
        <span key={index}>
          {index > 0 && (
            <span className="text-accent" aria-label="love">
              ♥
            </span>
          )}
          {part}
        </span>
      ))}{' '}
      <a href={href} target="_blank" rel="noopener noreferrer" className="tap text-muted underline-offset-4 decoration-dim hover:text-text hover:underline transition-colors">
        {label}
      </a>
    </footer>
  );
};

export { Footer };
