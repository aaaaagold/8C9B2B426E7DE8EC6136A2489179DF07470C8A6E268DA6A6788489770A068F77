"use strict";

// 嗨，恭喜你把程式碼撈出來了，去留個數字：這一整行註解(包含註解開頭符號//)加上留言時的時間「時」(補0至2位數，24小時制，沒有使用夏日節約)然後丟sha256並以16進位制表達。可留在以下任一處讓我知道：1.巴哈文章下方的留言區2.遊戲中的回饋單3.我的小屋首頁的匿名留言板，google表單或我用heroku架的網站(verysimple...的那個)。註：這一行不包含換行符號，編碼是使用UTF-8。舉例：假設現在是04:04AM，那就是這整行加上數字04。sha256在遊戲中有提供，打開遊戲直接呼叫sha256就行了，輸出有0x開頭。此一行應該不會變，方便我驗證。

// disables
Input._pollGamepads=none;

// setShorthand(window); // moved to lib-h
let zInit=11;
_global_conf["newDiv"]("backDiv",-1);
_global_conf["newDiv"]("LowerDiv",zInit+1);
_global_conf["newDiv"]("LowerDiv-s",zInit+2);
_global_conf["newDiv"]("UpperDiv",zInit+23);
_global_conf["newDiv"]("div999",999);
d.body.sa('style',(d.body.ga('style')||'')+';touch-action:none;');

if(Utils.isMobileDevice()) _global_conf.halfFps=1;

ConfigManager.alwaysDash=true;

// debug
{
	let h=_global_conf["url hash"],q=_global_conf["url querystring"],tmp;
	let huh=()=>{ // hash urlhash
		let h=_global_conf["url hash"],tmp={};
		for(let i in h) tmp[sha256(i)]=h[i];
		_global_conf["url hash"]=tmp;
	};
	tmp={};
	for(let i in q) tmp[sha256(i)]=q[i];
	_global_conf["url querystring"]=tmp;
	// having 'window.onhashchange' ?
	if(_global_conf["url hash"]===h) huh();
	else Object.defineProperties(_global_conf, {
		"url hash": { get: function() {
			let tmp=(window.location.hash)?
				this._url_parse(window.location.hash.slice(1)):
				{},rtv={};
			for(let i in tmp) rtv[sha256(i)]=tmp[i];
			return rtv;
		},configurable:false}
	});
	let rrrr,dddd;
	rrrr=geturlargs;
	dddd=geturlargs=function f(arg){
		return f.ori.call(this,sha256(arg));
	}; dddd.ori=rrrr;
	debug.isdebug=()=>{
		return geturlargs.ori("0x0B8E9E995D8D77F1E4770F0F79665AEE6F3F70247B3735422DABA73DF4C3096F");
	};
	rrrr=debug.isdepress;
	dddd=debug.isdepress=function f(){
		return f.ori() || geturlargs.ori("0xF7D680F4AA63059CA89D4FF8FF95BBF741C3413F4790034F41586384A7F23690");
	}; dddd.ori=rrrr;
	rrrr=window.onhashchange;
	dddd=window.onhashchange=function f(){
		f.ori();
		huh();
	}; dddd.ori=rrrr;
}

if(typeof objs!=="undefined" && objs.isDev){
	window['/tmp/'].__note=[
		"window['/tmp/'].clearedWhenNewScene -> {}",
		"$gameTemp.clearedWhenNewMap -> {}",
	];
	
	if(0)Graphics._updateRealScale=function(){
		if (this._stretchEnabled) {
			let h = Math.min(window.innerWidth,window.outerWidth) / this._width;
			let v = Math.min(window.innerHeight,window.outerHeight) / this._height;
			if (h >= 1 && h - 0.01 <= 1) h = 1;
			if (v >= 1 && v - 0.01 <= 1) v = 1;
			this._realScale = Math.min(h, v);
		} else this._realScale = this._scale;
	};
}
if(typeof objs!=='undefined' && objs.isDev) console.log("strt");

if(objs.isDev){ const w=window; let k,r;

	// add debug info
{ const p=WebGLRenderingContext.prototype;
k='attachShader';
r=p[k]; (p[k]=function f(prog,shader){
	if(!prog._shaders) prog._shaders=[];
	prog._shaders.push(shader);
	return f.ori.apply(this,arguments);
}).ori=r;
k='drawElements';
r=p[k]; (p[k]=function f(){
	if(window.pauseOnDraw) if(window.pauseOnDraw_skipThis) window.pauseOnDraw_skipThis=0; else debugger;
	return f.ori.apply(this,arguments);
}).ori=r;
k='drawArrays';
r=p[k]; (p[k]=function f(){
	if(window.pauseOnDraw) if(window.pauseOnDraw_skipThis) window.pauseOnDraw_skipThis=0; else debugger;
	return f.ori.apply(this,arguments);
}).ori=r;
k='vertexAttribPointer';
r=p[k]; (p[k]=function f(){
	if(window.pauseOnVap) if(window.pauseOnVap_skipThis) window.pauseOnVap_skipThis=0; else debugger;
	return f.ori.apply(this,arguments);
}).ori=r;
}

{ const p=console;
k='warn';
r=p[k]; (p[k]=function f(){
	if(window.pauseOnWarn) debugger;
	return f.ori.apply(this,arguments);
}).ori=r;
}

	// dev shortcuts
	w.bm=BattleManager;
	w.sm=SceneManager;
	w.loadjson=u=>_global_conf.jurl(u,"GET",0,0,0,t=>w.data=JSON.parse(t));
	w.glenums=[];
	for(let i in WebGLRenderingContext.prototype){
		if(i[0].toUpperCase()===i[0] && typeof WebGLRenderingContext.prototype[i]==='number'){
			w.glenums[WebGLRenderingContext.prototype[i]]=i;
		}
	}
}
