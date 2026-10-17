import './styles/index.css';
import { createRoot } from 'react-dom/client';
import { safe } from 'safe-wrapper';
import { App } from './app';
import { apply_appearance, set_prefix } from './common';
import { bootstrap, config } from './config';
import { initial_index, load_overrides, logo_src } from './services';

const start = async () => {
  set_prefix(initial_index.uri_prefix);
  const [load_error, overrides] = await safe(load_overrides)();
  const issues = load_error ? [] : bootstrap(overrides);
  const issue = load_error?.message ?? (issues.length ? `config.json: ignored ${issues.join(', ')}` : undefined);
  apply_appearance(config, logo_src(config.logo));
  const root = document.getElementById('root');
  if (root) createRoot(root).render(<App issue={issue} />);
};

void start();
