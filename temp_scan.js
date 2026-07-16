const fs = require('fs');
const lines = fs.readFileSync('src/index.css','utf8').split(/\r?\n/);
const selectors = new Map();
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/^\s*([^\{]+)\{/);
  if (!m) continue;
  const sel = m[1].trim().replace(/\s+/g,' ');
  const key = sel + ' @' + lines.slice(0, i).reverse().findIndex(l => l.trim().startsWith('@media'));
  selectors.set(key, selectors.get(key) || []).push(i+1);
}
for (const [key, loc] of Array.from(selectors.entries()).filter(([,loc]) => loc.length > 1).sort((a,b)=>b[1].length-a[1].length)) {
  const sel = key.split(' @')[0];
  console.log(sel, loc.join(', '));
}
