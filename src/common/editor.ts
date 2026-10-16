const replace_range = (area: HTMLTextAreaElement, from: number, to: number, text: string) => {
  area.setSelectionRange(from, to);
  if (document.execCommand('insertText', false, text)) return;
  area.setRangeText(text, from, to, 'end');
  area.dispatchEvent(new Event('input', { bubbles: true }));
};

const indent_unit = (value: string) => {
  if (/^\t/m.test(value)) return '\t';
  return /^ {4}\S/m.test(value) && !/^ {2}\S/m.test(value) ? '    ' : '  ';
};

const indent = (area: HTMLTextAreaElement, outdent: boolean) => {
  const { value, selectionStart: start, selectionEnd: end } = area;
  const unit = indent_unit(value);
  if (!outdent && start === end) return replace_range(area, start, end, unit);

  const from = value.lastIndexOf('\n', start - 1) + 1;
  const last = end > start && value[end - 1] === '\n' ? end - 1 : end;
  const newline = value.indexOf('\n', last);
  const to = newline === -1 ? value.length : newline;
  const strip = unit === '\t' ? /^\t/ : new RegExp(`^ {1,${unit.length}}`);
  const block = value.slice(from, to);
  const next = block
    .split('\n')
    .map(line => (outdent ? line.replace(strip, '') : line && unit + line))
    .join('\n');
  if (next === block) return;

  replace_range(area, from, to, next);
  const caret = Math.max(from, start - (block.length - next.length));
  if (start === end) area.setSelectionRange(caret, caret);
  else area.setSelectionRange(from, from + next.length);
};

export { indent };
