const fs = require('fs');
const path = 'src/index.css';
const text = fs.readFileSync(path, 'utf8');
const lines = text.split(/\r?\n/);
const selectors = new Map();
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^\s*([^\{]+)\{/);
  if (!match) continue;
  let sel = match[1].trim().replace(/\s+/g, ' ');
  selectors.set(sel, selectors.get(sel) || []);
  selectors.get(sel).push(i + 1);
}
for (const [sel, loc] of Array.from(selectors.entries()).filter(([, loc]) => loc.length > 1).sort((a, b) => b[1].length - a[1].length)) {
  if (sel.startsWith('@media')) continue;
  console.log(sel, loc.join(', '));
}
