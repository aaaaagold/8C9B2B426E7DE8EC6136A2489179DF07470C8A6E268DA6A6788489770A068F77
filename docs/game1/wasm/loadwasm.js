"use strict";

if(!window.objs) window.objs={};

{ const dir="wasm/",opt={headers:{'Content-Type':'application/wasm',},},inst=resp=>WebAssembly.instantiateStreaming(resp);
const wasm=objs.wasm={}; if(typeof fetch!=='undefined'){

fetch(dir+'puz8.wasm').then(inst).then(result =>{
	wasm.puz8=result.instance.exports;
});

} }