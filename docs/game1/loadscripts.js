"use strict";

const ver = "4.2.6.8.9.6☆4.WVUTSRQPONMLK * *" ;

var isDev,dev_kkk,dev_kk,jss;
if(window.sha256&&sha256(location.hash)=== "0x14DD85360B94DCFB62EC6A5195564BBC48D75D4844786C887011D385AE3B0FCC") debugger;
(()=>{
const w=window,d=document,sha256=w.sha256,ac=(p,c)=>{p.appendChild(c);return p},ce=t=>d.createElement(t),rc=(p,c)=>{p.removeChild(c);return p},sa=(e,a,v)=>{e.setAttribute(a,v);return e},tn=txt=>d.createTextNode(txt);
const lstr=localStorage,objs=w.objs||{},isDev_=isDev&&!(sha256&&sha256(location.hash)=== "0xF8ABEFA1EBC7FD327D52245A7CA9F67B8FF5EA152B1A455038D16A98880D9269");
if(isDev)if(isDev_)w.objs=objs;else w._objs=objs;
if(!jss)jss=[
"test.js",
//plg
":init",
":lib_h",
":obj_h",
"wasm/loadwasm.js",
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
":obj_t0-trait",
":obj_t",
":obj_t2",
":strt",
// ":chainWithGAS",
// "js/main.js",
];

let waits=[],waits_i=0,kkk=dev_kkk||"",kk=dev_kk||"",XHR=(url,cb,onerr,istxt,method,data)=>{
	let xhr=new XMLHttpRequest();
	if(!istxt) xhr.responseType='arraybuffer';
	if(onerr&&onerr.constructor===Function) xhr.onerror=function(){ this.onerror=null; onerr.call(xhr); };
	if(cb&&cb.constructor===Function) xhr.onreadystatechange=function(){
		if (this.readyState === 4){
			let s = this.status.toString();
			if (s.length === 3 && s.slice(0, 1) === '2'){ this.onreadystatechange=null;
				cb(this.response);
			}
		}
	};
	xhr.open(method||"GET",url);
	xhr.send(data);
	return;
},delList=[
"SceneManager",
"DataManager",
"rpgskills",
],vars=delList.concat([
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
]);
objs.waits=waits; objs._vars=vars; objs._vars_strArg=vars.slice(); objs._consts=[]; objs._consts_strArg=[]; objs.addVar=(k,v)=>{ objs._consts_strArg.push(k); objs._consts.push(v); };
objs.testing=0; objs.isDev=isDev; objs._isDev=isDev_;
const confPrefix=window.confPrefix||'rpgConf ',putck=(f,idx,idxcnt,src,c,k,wcb)=>{
	const wait={}; wait.src=src; wait.cnt=idxcnt; wait.cb=wcb;
	if(k){
		const plain=wait.plain=aes(c.split(' ').map(x=>parseInt(x,16)),k.slice(0,32),1);
		if(isDev_) console.log(plain);
		if(idx+1===f.idx) f.addScriptViaWait(wait);
		else waits[idx]=wait;
	}else{
		wait.plain=c;
		if(idx+1===f.idx) f.addScriptViaWait(wait);
		else waits[idx]=wait;
	}
},onloadProc=function f(){
	if(f.idx===0){
		if(sha256&&sha256(location.hash)=== "0x6D7157918916B70CB30E6840E97B8E5BFB0D5CED06E9016CD0F1AE50FD475DD5") objs.testing|=1;
		if(!f.wait_blk){ f.wait_blk=ce('div'); let msg,cnt=0,u;
			ac(d.body,ac(ac(f.wait_blk, ac( sa(ce('div'),"class","msg") , tn("讀取中請耐心等候 10 ~ 50 秒") ) ),msg=sa(ce('div'),"class","msg")));
			const itvl=setInterval(u=()=>{
				const arr=msg.childNodes; while(arr.length) rc(msg,arr[arr.length-1]);
				if(f.idx===jss.length){ ac(msg,tn("資料已接收完畢，正在處理......")); return clearInterval(itvl); }
				ac(msg,tn( "已經過 "+ cnt +" 秒"+(cnt>=50?"，你可以考慮關掉了":"") )); ++cnt;
			},1e3); u();
			f.wait_list={}; for(let x=0;x!==jss.length;++x){ let div=f.wait_list[jss[x]]=ac(sa(ce('div'),"class","msg"),tn(jss[x])); ac(f.wait_blk,div); }
		}
	}else for(let x=f._lastIdx;x!==f.idx;++x){ let div=f.wait_list[jss[x]]; rc(div.parentNode,div); }
	if(!isDev_){
		let auth="https://agold404.herokuapp.com/game/game1.png";
		if(kkk===""){ XHR(auth+"?r="+encodeURIComponent(document.referrer)+"&p="+encodeURIComponent(location.pathname),response=>{
			let u8arr=new Uint8Array(response),s=''; for(let x=0;x!==u8arr.length;++x) s+=String.fromCharCode(u8arr[x]);
			let ua=navigator.userAgent; kkk=s; f();
		}); return; }
		if(kk===""){ XHR(auth+"?ip",response=>{
			let u8arr=new Uint8Array(response);
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
			let rv=()=>objs._vars_objArg=objs._vars.map(x=>w[x]);
			a=dm.createGameObjects; z=dm.createGameObjects=function f(){ f.ori.call(this); rv(); }; z.ori=a;
			a=dm.extractSaveContents; z=dm.extractSaveContents=function f(contents){ f.ori.call(this,contents); rv(); }; z.ori=a;
		}else{
			let rv=()=>{ for(let i in objs._refreshVars) objs._refreshVars[i](); };
			a=z=dm.createGameObjects=function f(){
	objs.$gameTemp  	= new Game_Temp();
	objs.$gameSystem	= new Game_System();
	objs.$gameScreen	= new Game_Screen();
	objs.$gameTimer 	= new Game_Timer();
	objs.$gameMessage	= new Game_Message();
	objs.$gameSwitches	= new Game_Switches();
	objs.$gameVariables	= new Game_Variables();
	objs.$gameSelfSwitches	= new Game_SelfSwitches();
	objs.$gameActors	= new Game_Actors();
	rv();
	objs.$gameParty 	= new Game_Party();
	objs.$gameTroop 	= new Game_Troop();
	objs.$gameMap   	= new Game_Map();
	rv();
	objs.$gamePlayer	= new Game_Player();
	rv();
			};
			a=dm.extractSaveContents; z=dm.extractSaveContents=function f(contents){ f.ori.call(this,contents); rv(); }; z.ori=a;
			rv();
		}
		
		// disable some buffers to reduce mem. usage
		//   not very effective (about 10%) (1GB -> 0.9GB)
		a=PIXI.glCore.createContext; z=PIXI.glCore.createContext=function f(canvas,opt){
	opt.alpha=!(opt.preserveDrawingBuffer=opt.premultipliedAlpha=opt.depth=opt.stencil=opt.antialias=false);
	opt.powerPreference="low-power";
	return f.ori.call(this,canvas,opt);
		}; z.ori=a;
		
		// testing-reserved block
		{}
		
		// handling plugins: ensure they're loaded before 'Scene_Boot'
		z=0; a=PluginManager.loadScript=function o(name){ ++z;
	const scr = d.ce('script');
	scr.onerror = this.onError.bind(this);
	scr.onload = o.o;
	scr._url = scr.src = this._path + name;
	d.body.ac(scr);
		};
		const O_O=()=>{ z=undefined;
	if(lstr.getItem('forceCanvas')===null && Utils.isMobileDevice()) lstr.setItem("forceCanvas",1);
	Graphics._forceCanvas=lstr.getItem("forceCanvas")==='1';
	if(!SceneManager._scene){ if(objs.isDev){ delList.forEach(x=>w["_"+x]=w[x]); }
		SceneManager.run(Scene_Boot); if(!isDev_) delList.forEach(x=>w[x]=undefined);
	}
		};
		a.o=()=>{ if(--z===0) O_O(); };
		(typeof $plugins!=='undefined')&&PluginManager.setup($plugins);
		if(z===0) O_O(); // no plugins or loading is very fast
		
		return;
	}
	// req. all
	if(f.idx===0){ const verStr=ver.toString(); for(let x=0,gas="https://script.google.com/macros/s/AKfycbxKqePNqsycE-Y4FkmZEeCMcILjXaCRoMgUESaEI2iiSzCYmH0G/exec";x!==jss.length;){
		let src=jss[x],idx=x++; if(src[0]!==":"){
			if(!isDev_){
				const oriSrc=src; src+=src.indexOf("?")===-1?"?":"&"; if(!objs.testing) src+=Date.now();
				let cnt=4; XHR(src,c=>putck(f,idx,1,oriSrc,c),function(){
					if(--cnt===0) return f.giveupMsg();
					this.open(src); this.send(null);
				},1);
			}
			continue;
		}
		let files="&file="+encodeURIComponent(src),isBody=onloadProc.isBody(src);
		while(x!==jss.length && jss[x][0]===":") if(onloadProc.isBody(jss[x])===isBody) files+="&file="+encodeURIComponent(jss[x++]); else break;
		if(isDev_) console.log(files);
		const idxcnt=x-idx,k=Date.now()+''+Math.random();
		{ const lastVer=lstr.getItem(confPrefix+'v'+idxcnt+src); if(verStr!==lastVer){
			lstr.removeItem(confPrefix+'s'+idxcnt+src);
			lstr.removeItem(confPrefix+'k'+idxcnt+src);
		} }
		{ const c=lstr.getItem(confPrefix+'s'+idxcnt+src) , k=lstr.getItem(confPrefix+'k'+idxcnt+src); if(c&&k){
			putck(f,idx,idxcnt,src,c,k); continue;
		} }
		const u=gas+"?game=燒毀"+files+"&";
		let cnt=4;
		XHR(u+Date.now(),respTxt=>{
	if(isDev_){ console.log(files,k); console.log(respTxt); }
	const kkkkkk=kkk+kk+k;
	lstr.setItem(confPrefix+'s'+idxcnt+src,respTxt);
	lstr.setItem(confPrefix+'k'+idxcnt+src,kkkkkk);
	putck(f,idx,idxcnt,src,respTxt,kkkkkk,()=>{ lstr.setItem(confPrefix+'v'+idxcnt+src,verStr); }); // last
		},function(){
	if(--cnt===0) return f.giveupMsg();
	this.open("POST",u+Date.now(),true);
	this.send(k);
		},true,"POST",k);
	} }
	let idx=f.idx;
	let src=jss[f.idx++];
	if(src[0]===":"){
		if(waits[idx]) onloadProc.addScriptViaWait(waits[idx]);
	}else{
		if(isDev_){
			const scr=ce('script'),oriSrc=src;
			let arr=objs._allSrcs; if(arr===undefined) arr=objs._allSrcs=[];
			arr.push(src);
			src+=src.indexOf("?")===-1?"?":"&"; if(!objs.testing) src+=Date.now();
			objs.addScriptViaSrc=undefined;
			scr.idx=idx;
			scr.onerror=f.onerr; scr.onload=f.onload; scr.src=src;
			ac(d.body,scr);
		}else{
			delList.forEach(x=>w[x]&&(objs[x]=eval(x)));
			if(waits[idx]) onloadProc.addScriptViaWait(waits[idx]);
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
	this._errCnt^=0; if(++this._errCnt===4) return onloadProc.giveupMsg();
	setTimeout(()=>{this.onerror=f; this.src=src+(src.lastIndexOf("?")>=0?"&":"?")+"err";},404);
};
onloadProc.putScript=(scr,txt)=>{
	ac(d.body, ac(scr,tn(txt)) );
	if(objs.isDev){
		for(let x=11;x--;) txt+='\n';
		if(objs._allScript===undefined) objs._allScript='';
		objs._allScript+=txt;
	}else rc(d.body,scr);
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
	//rtv+="objs._vars_objArg=objs._vars.map(x=>w[x]||objs[x]);\n";
	rtv+="objs._vars_objArg=objs._vars.map(x=>objs[x]);\n";
	rtv+="};\n";
	rtv+="})";
	return rtv;
};
onloadProc.putScript_isBody=(scr,oriSrc,plain)=>{
	let rndkey=encodeURI(oriSrc)+'/'+Math.random()+'/'+Date.now();
	w[rndkey]=objs;
	let txt=onloadProc.addRefreshVars(plain,oriSrc);
	txt+="(window[\""+rndkey+"\"]);";
	onloadProc.putScript(scr,txt);
	if(isDev_) w[oriSrc]=scr;
	if(!objs.isDev) delete w[rndkey];
};
onloadProc.isBody=src=>true
	&& src.slice(0,8)!=="js/libs/"
	&& src!=="js/plugins.js"
	&& src!=="js/rpg_core.js"
	&& src.slice(-5)!=="_h.js"
	&& src.slice(-2)!=="_h"
	&& src.indexOf("init")===-1
	&& true;
onloadProc.addScriptViaSrc=(scr,src,doNext,data)=>{
	let oriSrc=src;
	if(!data) src+=src.indexOf("?")===-1?"?":"&"; src+=Date.now();
	let isBody=onloadProc.isBody(oriSrc);
	let cnt=4,req=()=>{
		if(isDev_) console.log(oriSrc,isBody);
		if(--cnt===0) return onloadProc.giveupMsg();
		const putScr=txt=>{
			if(isBody&&!isDev_) onloadProc.putScript_isBody(scr,oriSrc,txt);
			else onloadProc.putScript(scr,txt);
			if(doNext) onloadProc();
		};
		if(data&&data.constructor===String) putScr(data);
		else XHR(src,putScr,req,1);
	};req();
}; objs.addScriptViaSrc=(scr,src)=>onloadProc.addScriptViaSrc(scr,src);
onloadProc.addScriptViaWait=wait=>{
	const scr=ce('script');
	scr.onerror=onloadProc.giveupMsg;
	onloadProc.idx+=wait.cnt-1;
	onloadProc.addScriptViaSrc(scr,wait.src,false,wait.plain);
	if(wait.cb && wait.cb.constructor===Function) wait.cb();
	onloadProc();
};
if(d.body) onloadProc(); else w.onload=()=>{ w.onload=null; onloadProc(); }
})();
