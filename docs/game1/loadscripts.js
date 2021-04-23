﻿"use strict";

const ver = "4.2.6.8.9.6.-" ;

var isDev,dev_kkk,dev_kk,jss;
if(window.sha256 && sha256(location.hash)==="0x14DD85360B94DCFB62EC6A5195564BBC48D75D4844786C887011D385AE3B0FCC") debugger;
//jss=undefined;//test:non-local
//isDev=false;//test:non-dev
(()=>{
let w=window,d=document;
const ac=(p,c)=>{p.appendChild(c);return p},ce=t=>d.createElement(t),rc=(p,c)=>{p.removeChild(c);return p},sa=(e,a,v)=>{e.setAttribute(a,v);return e},tn=txt=>d.createTextNode(txt);
let isDev_=isDev,objs={};
//isDev_=false;//test:hideVars
if(window.sha256&&sha256(location.hash)=== "0xF8ABEFA1EBC7FD327D52245A7CA9F67B8FF5EA152B1A455038D16A98880D9269") isDev_=false;
if(isDev)if(isDev_)window.objs=objs;else window._objs=objs;
if(!jss)jss=[
	"test.js",
//plg
	":init",
	":lib_h",
	":obj_h",
	"js/libs/pixi.js",
	"js/libs/pixi-tilemap.js",
	"js/libs/pixi-picture.js",
	"js/libs/fpsmeter.js",
	"js/libs/lz-string.js",
	"js/libs/iphone-inline-video.browser.js",
	":lib_t",
	"js/rpg_core.js",
	"js/rpg_all_h.js",
	"js/rpg_managers.js",
	"js/rpg_objects.js",
	"js/rpg_scenes.js",
	"js/rpg_sprites.js",
	"js/rpg_windows.js",
	":obj_t0",
	":obj_t0-tilemap",
	":obj_t0-data",
	":obj_t0-scene",
	":obj_t",
	":obj_t2",
	":strt",
	":chainWithGAS",
//	"js/main.js",
];

let waits=[],waits_i=0, putWaits=(p,c)=>{
	while(waits_i!==jss.length && waits[waits_i]){
		let scr=waits[waits_i++];
		if(scr!==true){ ac(d.body,scr); rc(d.body,scr); }
	}
},kkk=dev_kkk||"",kk=dev_kk||"",XHR=(url,cb,onerr,txt)=>{
	let xhr=new XMLHttpRequest();
	if(!txt) xhr.responseType='arraybuffer';
	if(onerr&&onerr.constructor===Function) xhr.onerror=function(){ this.onerror=null; onerr(); };
	if(cb&&cb.constructor===Function) xhr.onreadystatechange=function(){
		if (this.readyState === 4){
			let s = this.status.toString();
			if (s.length === 3 && s.slice(0, 1) === '2'){ this.onreadystatechange=null;
				cb(this.response);
			}
		}
	};
	xhr.open("GET",url);
	xhr.send(null);
	return;
},vars=[
"SceneManager",
"DataManager",

"$gameTemp",
"$gameSystem",
"$gameScreen",
"$gameTimer",
"$gameMessage",
"$gameSwitches",
"$gameVariables",
"$gameSelfSwitches",
"$gameActors",

"$gameParty",
"$gameTroop",
"$gameMap",

"$gamePlayer",

//"_sha256",
]; //window._sha256=sha256;
objs.waits=waits; objs._vars=vars; objs._vars_strArg=vars.slice();
objs.testing=0; objs.isDev=isDev;
const confPrefix='rpg conf 2 ',putck=(f,idx,idxcnt,src,c,k)=>{
	let wait={}; wait.src=src; wait.cnt=idxcnt;
	let plain=wait.plain=aes(c.split(' ').map(x=>parseInt(x,16)),k.slice(0,32),1);
	if(isDev_) console.log(plain);
	if(idx+1===f.idx) f.addScriptFromGas(wait);
	else waits[idx]=wait;
},onloadProc=function f(){
	if(f.idx===0){
		if(window.sha256 && sha256(location.hash)==="0x6D7157918916B70CB30E6840E97B8E5BFB0D5CED06E9016CD0F1AE50FD475DD5") objs.testing|=1;
		if(!f.wait_blk){
			f.wait_blk=ce('div');
			ac(d.body,ac(f.wait_blk, ac(sa(ce('div'),"class","msg"),tn("讀取中請耐心等候")) ));
			f.wait_list={};
			for(let x=0;x!==jss.length;++x){
				let div=f.wait_list[jss[x]]=ac(sa(ce('div'),"class","msg"),tn(jss[x]));
				ac(f.wait_blk,div);
			}
		}
	}else for(let x=f._lastIdx;x!==f.idx;++x){ let div=f.wait_list[jss[x]]; rc(div.parentNode,div); }
	if(!isDev_){
		let auth="https://agold404.herokuapp.com/game/game1.png";
		if(kkk===""){ XHR(auth+"?r="+encodeURIComponent(document.referrer)+"&p="+encodeURIComponent(location.pathname),response=>{
			let u8arr=new Uint8Array(response),s=''; for(let x=0;x!==u8arr.length;++x) s+=String.fromCharCode(u8arr[x]);
			let ua=navigator.userAgent; kkk=s; f();
		}); return; }
		if(kk===""){ XHR(auth+"?ip",response=>{
			let u8arr=new Uint8Array(window.____asdfghjkl____=response);
			if(u8arr.length) kk=String.fromCharCode(u8arr[u8arr.length-1]);
			else kk="-";
			f();
		}); return; }
	}
	f._lastIdx=f.idx;
	if(f.idx===jss.length){ const dm=DataManager;
		rc(f.wait_blk.parentNode,f.wait_blk); f.wait_blk=undefined;
		if(!isDev_) delete window.objs;
		let z,a;
		
		// refresh vars
		if(!objs.addScriptViaSrc){
			let rv=()=>objs._vars_objArg=objs._vars.map(x=>window[x]);
			a=dm.createGameObjects; z=dm.createGameObjects=function f(){ f.ori.call(this); rv(); }; z.ori=a;
			a=dm.extractSaveContents; z=dm.extractSaveContents=function f(contents){ f.ori.call(this,contents); rv(); }; z.ori=a;
		}else{
			let rv=()=>{ for(let i in objs._refreshVars) objs._refreshVars[i](); };
			a=z=dm.createGameObjects=function f(){
				objs.$gameTemp         = new Game_Temp();
				objs.$gameSystem       = new Game_System();
				objs.$gameScreen       = new Game_Screen();
				objs.$gameTimer        = new Game_Timer();
				objs.$gameMessage      = new Game_Message();
				objs.$gameSwitches     = new Game_Switches();
				objs.$gameVariables    = new Game_Variables();
				objs.$gameSelfSwitches = new Game_SelfSwitches();
				objs.$gameActors       = new Game_Actors();
				rv();
				objs.$gameParty        = new Game_Party();
				objs.$gameTroop        = new Game_Troop();
				objs.$gameMap          = new Game_Map();
				rv();
				objs.$gamePlayer       = new Game_Player();
				rv();
			};
			a=dm.extractSaveContents; z=dm.extractSaveContents=function f(contents){ f.ori.call(this,contents); rv(); }; z.ori=a;
			rv();
		}
		
	//	a=dm.loadDataFile; z=dm.loadDataFile=function f(){
	//		if(arguments[1]==="System.json"){ this.loadDataFile=f.ori;
	//			return f.ori.call(this,arguments[0],"System.json",()=>{ let strt=Number(location.search.slice(1)); if(strt) $dataSystem.startMapId=strt; });
	//		}else return f.ori.apply(this,arguments);
	//	}; z.ori=a;
		
		// disable some buffers to reduce mem. usage
		//   not very effective (about 10%) (1GB -> 0.9GB)
		a=PIXI.glCore.createContext; z=PIXI.glCore.createContext=function f(canvas,opt){ opt.alpha=true;
			opt.premultipliedAlpha=opt.depth=opt.stencil=opt.antialias=false;
			return f.ori.call(this,canvas,opt);
		}; z.ori=a;
		
		// testing-reserved block
		{}
		
		// handling plugins: ensure they're loaded before 'Scene_Boot'
		z=0; a=PluginManager.loadScript=function o(name){ ++z;
			let scr = d.ce('script');
			scr.onerror = this.onError.bind(this);
			scr.onload = o.o;
			scr._url = scr.src = this._path + name;
			d.body.ac(scr);
		};
		const O_O=()=>{ z=undefined;
			if(localStorage.getItem('forceCanvas')===null && Utils.isMobileDevice()) localStorage.setItem("forceCanvas",1);
			//if(localStorage.getItem('forceCanvas')===null) localStorage.setItem("forceCanvas",1);
			Graphics._forceCanvas=localStorage.getItem("forceCanvas")==='1';
			if(!SceneManager._scene){
				SceneManager.run(Scene_Boot);
				if(objs.isDev){ window._SceneManager=window.SceneManager; window._DataManager=window.DataManager; }
				if(!isDev_) window.DataManager = window.SceneManager = undefined;
			}
		};
		a.o=()=>{ if(--z===0) O_O(); };
		(typeof $plugins!=='undefined')&&PluginManager.setup($plugins);
		if(z===0) O_O(); // no plugins or loading is very fast
		
		return;
	}
	// req. all gas
	if(f.idx===0){ const verStr=ver.toString(); for(let x=0,gas="https://script.google.com/macros/s/AKfycbxKqePNqsycE-Y4FkmZEeCMcILjXaCRoMgUESaEI2iiSzCYmH0G/exec";x!==jss.length;){
		let src=jss[x]; if(src[0]!==":"){ ++x; continue; }
		let idx=x++,files="&file="+encodeURIComponent(src),isBody=onloadProc.isBody(src);
		while(x!==jss.length && jss[x][0]===":") if(onloadProc.isBody(jss[x])===isBody) files+="&file="+encodeURIComponent(jss[x++]); else break;
		if(isDev_) console.log(files);
		let idxcnt=x-idx,k=Date.now()+''+Math.random(),xhr=new XMLHttpRequest();
		{ const lastVer=localStorage.getItem(confPrefix+'v'+src); if(verStr!==lastVer){
			localStorage.removeItem(confPrefix+'s'+src);
			localStorage.removeItem(confPrefix+'k'+src);
		} }
		{ const c=localStorage.getItem(confPrefix+'s'+src) , k=localStorage.getItem(confPrefix+'k'+src); if(c&&k){
			putck(f,idx,idxcnt,src,c,k); continue;
		} }
		xhr.onreadystatechange=function() {
			if (this.readyState === 4) {
				let s = this.status.toString();
				if (s.length === 3 && s.slice(0, 1) === '2') { this.onreadystatechange=null;
					if(isDev_){ console.log(files,k); console.log(this.responseText); }
					const kkkkkk=kkk+kk+k;
					localStorage.setItem(confPrefix+'s'+src,this.responseText);
					localStorage.setItem(confPrefix+'k'+src,kkkkkk);
					putck(f,idx,idxcnt,src,this.responseText,kkkkkk);
					localStorage.setItem(confPrefix+'v'+src,verStr); // last
				}
			}
		}
		let cnt=4,go=()=>{
			if(--cnt===0) return f.giveupMsg();
			xhr.open("POST",gas+"?game=燒毀"+files+"&"+Date.now(),true);
			xhr.send(k);
		};
		xhr.onerror=()=>setTimeout(go,404); go();
	} }
	let idx=f.idx;
	let src=jss[f.idx++];
	if(src[0]===":"){
		if(waits[idx]) onloadProc.addScriptFromGas(waits[idx]);
	}else{
		let scr=ce('script'),oriSrc=src;
		src+=src.indexOf("?")===-1?"?":"&"; if(!objs.testing) src+=Date.now();
		if(isDev_){
			objs.addScriptViaSrc=undefined;
			scr.idx=idx;
			scr.onerror=f.onerr;
			scr.onload=f.onload;
			scr.src=src;
			ac(d.body,scr);
		}else{
			if(window.SceneManager) objs.SceneManager=SceneManager;
			if(window.DataManager) objs.DataManager=DataManager;
			onloadProc.addScriptViaSrc(scr,oriSrc,true);
		}
	}
}; onloadProc.idx=0;
onloadProc.giveupMsg=()=>{
	rc(onloadProc.wait_blk.parentNode,onloadProc.wait_blk); onloadProc.wait_blk=undefined;
	ac(d.body,ac(sa(ce('div'),'class',"msg"),tn("遊戲壞掉了，重新整理或放棄吧。")));
};
onloadProc.onload=function(){ this.onload=null;
	rc(this.parentNode,this);
	onloadProc();
};
onloadProc.onerr=function f(){ this.onerror=null;
	let src=this.src; this.src='';
	this._errCnt^=0; if(++this._errCnt===4){
		return onloadProc.giveupMsg();
	}
	setTimeout(()=>{this.onerror=f; this.src=src;},404);
};
onloadProc.putScript=(scr,txt)=>{
	ac(d.body, ac(scr,tn(txt)) ); if(!objs.isDev) rc(d.body,scr);
};
onloadProc.putScript_isBody=(scr,oriSrc,plain)=>{
	let rndkey=encodeURI(oriSrc)+'/'+Math.random()+'/'+Date.now();
	window[rndkey]=objs;
	let txt=onloadProc.addRefreshVars(plain,oriSrc);
	txt+="(window[\""+rndkey+"\"]);";
	onloadProc.putScript(scr,txt);
	if(isDev_) window[oriSrc]=scr;
	if(!objs.isDev) delete window[rndkey];
};
onloadProc.addRefreshVars=(txt,src)=>{
	let us='"use strict";\n';
	let rtv=us;
	rtv+="((objs)=>{"+us;
	for(let x=0;x!==vars.length;++x) rtv+="var "+ vars[x] +"; if(objs."+ vars[x] +") "+ vars[x] +"=objs."+ vars[x] +";\n";
	rtv+="\n";
	rtv+=txt;
	rtv+="\n";
	rtv+="if(!objs._refreshVars) objs._refreshVars={};\n";
	rtv+="objs._refreshVars['"+encodeURI(src)+"']=()=>{"+us;
	for(let x=0;x!==vars.length;++x) rtv+=vars[x]+"=objs."+vars[x]+"; if(window."+vars[x]+"!==undefined) window."+vars[x]+"="+vars[x]+";\n";
	//rtv+="objs._vars_objArg=objs._vars.map(x=>window[x]||objs[x]);\n";
	rtv+="objs._vars_objArg=objs._vars.map(x=>objs[x]);\n";
	rtv+="};\n";
	rtv+="})";
	return rtv;
};
onloadProc.isBody=src=>true
	&& (objs.isDev || src[0]===":")
	&& src.slice(0,8)!=="js/libs/"
	&& src!=="js/plugins.js"
	&& src!=="js/rpg_core.js"
	&& src.slice(-5)!=="_h.js"
	&& src.slice(-2)!=="_h"
	&& src.indexOf("init")===-1
	&& true;
onloadProc.addScriptFromGas=wait=>{
	let scr=ce('script'),src=wait.src,plain=wait.plain;
	if(onloadProc.isBody(src)){ if(isDev_) console.log("body",src);
		if(isDev_) onloadProc.putScript(scr,plain);
		else onloadProc.putScript_isBody(scr,src,plain);
	}else onloadProc.putScript(scr,plain);
	onloadProc.idx+=wait.cnt-1;
	onloadProc();
};
onloadProc.addScriptViaSrc=(scr,src,doNext)=>{
	let oriSrc=src;
	src+=src.indexOf("?")===-1?"?":"&"; src+=Date.now();
	let isBody=onloadProc.isBody(oriSrc);
	let cnt=4,req=()=>{
		if(isDev_) console.log(oriSrc,isBody);
		if(--cnt===0) return onloadProc.giveupMsg();
		XHR(src,txt=>{
			if(isBody) onloadProc.putScript_isBody(scr,oriSrc,txt);
			else onloadProc.putScript(scr,txt);
			if(doNext) onloadProc();
		},req,1);
	};req();
}; objs.addScriptViaSrc=(scr,src)=>onloadProc.addScriptViaSrc(scr,src);
if(d.body) onloadProc(); else w.onload=()=>{ w.onload=null; onloadProc(); }
})();
