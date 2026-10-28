import test from 'node:test';
import assert from 'node:assert/strict';
test('game boots, renders frames, starts, pulses, pauses and opens archive with DOM/canvas adapters',async()=>{
 const elements=new Map(),events=new Map();let frame;
 const gradient={addColorStop(){}};
 const context=new Proxy({createRadialGradient:()=>gradient},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
 function element(id){if(elements.has(id))return elements.get(id);const e={id,dataset:{},style:{},classList:{add(){},remove(){}},firstElementChild:{},hidden:false,open:false,textContent:'',innerHTML:'',width:900,height:640,append(){},replaceChildren(){},setAttribute(){},focus(){},getContext:()=>context,getBoundingClientRect:()=>({width:900,height:640}),addEventListener:(k,v)=>events.set(id+':'+k,v),showModal(){this.open=true;},close(){this.open=false;events.get(id+':close')?.();}};elements.set(id,e);return e;}
 globalThis.document={getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('temp'+Math.random()),addEventListener(){}};
 globalThis.window={addEventListener:(k,v)=>events.set(k,v)};
 globalThis.localStorage={getItem:()=>null,setItem(){}};
 globalThis.matchMedia=()=>({matches:false});
 globalThis.ResizeObserver=class{observe(){}};
 globalThis.requestAnimationFrame=fn=>{frame=fn;};
 await import('../game.js');
 assert.equal(typeof frame,'function');frame(100);element('start').onclick();assert.equal(element('overlay').hidden,true);element('pulse').onclick();for(let i=1;i<20;i++)frame(100+i*16);assert.match(element('heat').innerHTML,/2[34]/);element('pause').onclick();assert.equal(element('overlay').hidden,false);element('start').onclick();assert.equal(element('overlay').hidden,true);element('archiveButton').onclick();assert.equal(element('archive').open,true);element('closeArchive').onclick();assert.equal(element('overlay').hidden,true);
});
