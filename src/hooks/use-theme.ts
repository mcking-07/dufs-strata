import { useEffect, useState } from 'react';
import { choose_theme } from '../common';
import type { ThemeType } from '../types';

const current_theme = (): ThemeType => (document.documentElement.classList.contains('light') ? 'light' : 'dark');

const useTheme = () => {
  const [theme, set_theme] = useState(current_theme);

  useEffect(() => {
    const observer = new MutationObserver(() => set_theme(current_theme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggle_theme = () => choose_theme(theme === 'dark' ? 'light' : 'dark');

  return { theme, toggle_theme };
};

export { useTheme };
