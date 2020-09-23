"use strict";

setShorthand(window);
let zInit=11;
_global_conf["newDiv"]("backDiv",-1);
_global_conf["newDiv"]("LowerDiv",zInit+1);
_global_conf["newDiv"]("LowerDiv-s",zInit+2);
_global_conf["newDiv"]("UpperDiv",zInit+23);

if(Utils.isMobileDevice()) _global_conf.halfFps=1;
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

console.log("strt");
