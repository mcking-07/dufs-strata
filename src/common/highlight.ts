import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import lua from 'highlight.js/lib/languages/lua';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { ext_of } from './files';

const LANGUAGES = { bash, c, cpp, css, dockerfile, go, ini, java, javascript, json, kotlin, lua, markdown, php, python, ruby, rust, scss, sql, swift, typescript, xml, yaml };

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  kt: 'kotlin',
  h: 'c',
  hpp: 'cpp',
  sh: 'bash',
  zsh: 'bash',
  env: 'bash',
  yml: 'yaml',
  toml: 'ini',
  conf: 'ini',
  html: 'xml',
  svg: 'xml',
  md: 'markdown',
};

const MAX_HIGHLIGHT = 200_000;

for (const [name, language] of Object.entries(LANGUAGES)) hljs.registerLanguage(name, language);

const escape_html = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const highlight = (name: string, code: string) => {
  const extension = ext_of(name);
  const language = LANGUAGE_BY_EXTENSION[extension] ?? extension;
  if (code.length > MAX_HIGHLIGHT || !hljs.getLanguage(language)) return escape_html(code);
  return hljs.highlight(code, { language, ignoreIllegals: true }).value;
};

export { highlight };
