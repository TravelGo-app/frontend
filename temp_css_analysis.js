const fs = require('fs');
const text = fs.readFileSync('src/index.css', 'utf8');
const lines = text.split(/\r?\n/);
let i = 0;
const stack = [];
const blocks = [];
const ctxStack = [{type:'root', start:0, selector:'root', children:[]}];
const currentContext = () => ctxStack[ctxStack.length-1];
while(i < lines.length){
  const line = lines[i];
  const open = (line.match(/\{/g) || []).length;
  const close = (line.match(/\}/g) || []).length;
  if(open > 0){
    const sel = line.split('{')[0].trim();
    const ctx = {type:'block', selector:sel, start:i, end:null, parent:currentContext(), children:[], text:[]};
    currentContext().children.push(ctx);
    ctxStack.push(ctx);
  }
  currentContext().text && currentContext().text.push(line);
  if(close > 0){
    for(let j=0;j<close;j++){
      const ctx = ctxStack.pop();
      ctx.end = i;
      blocks.push(ctx);
    }
  }
  i++;
}
const root = ctxStack[0];
const tops = blocks.filter(b=>b.parent && b.parent.selector==='root' && b.selector.startsWith('.'));
const counts = new Map();
tops.forEach(b=>counts.set(b.selector,(counts.get(b.selector)||0)+1));
for(const [sel,cnt] of [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,80)){
  if(cnt>1){
    console.log(cnt, sel);
    tops.filter(b=>b.selector===sel).forEach(b=>console.log('  lines', b.start+1, b.end+1));
  }
}
