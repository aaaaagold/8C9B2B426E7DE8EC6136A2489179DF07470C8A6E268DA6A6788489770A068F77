"use strict";
// before any .js files

const INF=Infinity,inf=Infinity,NULL=null,UNDEF=undefined,undef=undefined,none=()=>{};
const blank_1x1='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';
const tm2020strt=new Date("2020-01-01T00:00:00.000Z").getTime();
let deepcopy=(obj)=>{return JSON.parse(JSON.stringify(obj));};
let d=document;
let _global_conf={};
	Object.defineProperties(_global_conf,{ // relative: 'ConfigManager.ConfigOptions'@obj_t
		halfFps: {
			get:function(){
				let key='_halfFps';
				return ($gamePlayer && $gamePlayer[key]!==undef)?$gamePlayer[key]:ConfigManager[key];
			},set:function(rhs){
				let key='_halfFps';
				if($dataMap) return $gamePlayer[key]=rhs;
				else{
					window['/tmp/'].chConfig=1;
					return ConfigManager[key]=rhs;
				}
			},
		configurable: false},
		noGainMsg: {
			get:function(){
				let key='_noGainMsg';
				return ($gamePlayer && $gamePlayer[key]!==undef)?$gamePlayer[key]:ConfigManager[key];
			},set:function(rhs){
				let key='_noGainMsg';
				if($dataMap) return $gamePlayer[key]=rhs;
				else{
					window['/tmp/'].chConfig=1;
					return ConfigManager[key]=rhs;
				}
			},
		configurable: false},
		noGainHint: {
			get:function(){
				let key='_noGainHint';
				return ($gamePlayer && $gamePlayer[key]!==undef)?$gamePlayer[key]:ConfigManager[key];
			},set:function(rhs){
				let key='_noGainHint';
				if($dataMap) return $gamePlayer[key]=rhs;
				else{
					window['/tmp/'].chConfig=1;
					return ConfigManager[key]=rhs;
				}
			},
		configurable: false},
		noGainSound: {
			get:function(){
				let key='_noGainSound';
				return ($gamePlayer && $gamePlayer[key]!==undef)?$gamePlayer[key]:ConfigManager[key];
			},set:function(rhs){
				let key='_noGainSound';
				if($dataMap) return $gamePlayer[key]=rhs;
				else{
					window['/tmp/'].chConfig=1;
					return ConfigManager[key]=rhs;
				}
			},
		configurable: false},
		noLeaderHp: {
			get:function(){
				let key='_noLeaderHp';
				return ($gamePlayer && $gamePlayer[key]!==undef)?$gamePlayer[key]:ConfigManager[key];
			},set:function(rhs){
				let key='_noLeaderHp';
				if($dataMap) return $gamePlayer[key]=rhs;
				else{
					window['/tmp/'].chConfig=1;
					return ConfigManager[key]=rhs;
				}
			},
		configurable: false},
		noLeaderMp: {
			get:function(){
				let key='_noLeaderMp';
				return ($gamePlayer && $gamePlayer[key]!==undef)?$gamePlayer[key]:ConfigManager[key];
			},set:function(rhs){
				let key='_noLeaderMp';
				if($dataMap) return $gamePlayer[key]=rhs;
				else{
					window['/tmp/'].chConfig=1;
					return ConfigManager[key]=rhs;
				}
			},
		configurable: false},
		noAnimation: {
			get:function(){
				let key='_noAnimation';
				return ($gamePlayer && $gamePlayer[key]!==undef)?$gamePlayer[key]:ConfigManager[key];
			},set:function(rhs){
				let key='_noAnimation';
				if($dataMap) return $gamePlayer[key]=rhs;
				else{
					window['/tmp/'].chConfig=1;
					return ConfigManager[key]=rhs;
				}
			},
		configurable: false},
		useFont: {
			get:function(){
				return $gamePlayer && $gamePlayer._useFont || ConfigManager._useFont
					|| "Consolas,monospace,'Courier New',Courier,微軟正黑體,標楷體";
					// "Consolas,monospace,'Courier New',Courier,微軟正黑體,標楷體";
			}, set:function(rhs){
				let key='_useFont';
				if($dataMap) return $gamePlayer[key]=rhs;
				else{
					window['/tmp/'].chConfig=1;
					return ConfigManager[key]=rhs;
				}
			},
		configurable: false}
	});
let textWidthCache=[]; textWidthCache.length=65536; // String.fromCharCode has mask 0xFFFF
let searchTbl={};
let screenShots={};
window['/tmp/']={};
var t={};

let lang=0;

_global_conf._url_parse=(str)=>{
	// str is seperated by '&'
	// str:"?aaa&bbb -> aaa&bbb" before passed to this function
	let rtv={};
	let arr=str.split("&");
	//let arr=str.match(/[^&]*/g);
	if(arr!==null) for(let x=0;x!==arr.length;++x){
		let s=arr[x];
		let sep=s.indexOf('=');
		if(sep===-1) rtv[s]=true;
		else rtv[s.slice(0,sep)]=decodeURIComponent(s.slice(sep+1));
	}
	return rtv;
};
if(window && window.location){
	_global_conf["url querystring"]=(window.location.search)?
		_global_conf._url_parse(window.location.search.slice(1)):
		{};
	if(window.onhashchange!==undef){
		let inited=0;
		let updateUrlHash=()=>{
			if(inited) console.log("urlHash changed");
			else inited|=1;
			_global_conf["url hash"]=(window.location.hash)?
				_global_conf._url_parse(window.location.hash.slice(1)):
				{};
		}
		(window.onhashchange=updateUrlHash)();
	}else Object.defineProperties(_global_conf, {
		"url hash": { get: function() {
			return (window.location.hash)?
				this._url_parse(window.location.hash.slice(1)):
				{};
		},configurable:true}
	});
	window.geturlargs=function(arg){
		let h=_global_conf["url hash"],q=_global_conf["url querystring"];
		if(arg in h) return h[arg];
		else return q[arg];
	};
}
_global_conf["scene strts"]={};

_global_conf["isDataURI"]=s=>s.match(/^data:[^,]*,/)!==null;
_global_conf["jurl"] = (url, method, header, data, resType, callback, callback_all_h, timeout_ms) => {
	resType=resType||'';
	let xhttp=new XMLHttpRequest();
	if(0<timeout_ms) xhttp.timeout=timeout_ms;
	xhttp.onreadystatechange=function(){
		//if(callback_all_h&&callback_all_h.constructor===Function) ; // wtf
		if(typeof (callback_all_h)==="function"){
			callback_all_h(this);
		}
		//if(callback&&callback.constructor===Function) ; // wtf
		if(typeof (callback)==="function"){
			if(this.readyState===4){
				console.log(callback,callback.constructor,callback.constructor===Function);
				let s=this.status.toString();
				if (s.length===3 && s.slice(0, 1)==='2'){
					callback(this.responseText);
				}
			}
		}
	}
	;
	xhttp.open(method, url, true);
	xhttp.responseType=resType;
	if(header) for(let i in header) xhttp.setRequestHeader(i,header[i]);
	xhttp.send(method === "GET" ? undefined : data);
	return xhttp;
};

_global_conf["loop"] = function g(t, d, f, a) {
	setTimeout(function() {
		if (new Date().getTime() < t)
			g(t, d, f, a);
		else if (f && !f(a))
			g(new Date().getTime() + d, d, f, a);
	}, 1);
};

_global_conf["newDiv"] = function f(id,zIndex){
	zIndex=zIndex||0;
	let ele=d.ge(id);
	if(ele===null) d.body.ac(ele=d.ce("div").sa("style","display:none;").sa("id",id));
	else return 1;
	_global_conf["loop"](0,111,()=>{
		let target=d.ge("UpperCanvas");
		if(target!==null){
			let style=target.ga("style").toLowerCase().replace(/z-index[ \t]*:[ \t]*[0-9]+[ \t]*;/,"");
			ele.sa("style","z-index:"+zIndex+";overflow:hidden;"+style);
			return 1;
		}
	});
	f.divs.push(ele);
};
_global_conf["newDiv"].divs=[];

_global_conf["delDiv"] = (id)=>{
	let target=d.ge(id);
	if(target===null) return 1;
	target.parentNode.removeChild(target);
};

_global_conf["id-toTemplate"] = (id)=>{
	if((typeof id).toLowerCase()==="string") id=Number(id.match(/^[0-9]+/));
	return id;
};

_global_conf["id-cntTemplateToCustom"] = (id,idv)=>{
	let f=_global_conf["id-toTemplate"];
	let tid=f(id);
	let cnt=idv.map(f).count(tid);
	return [cnt,""+tid+'-'+cnt];
};

_global_conf["get-customActors"] = ()=>{
	if(!$gameParty["custom-addedActor"]) $gameParty["custom-addedActor"]={};
	return $gameParty["custom-addedActor"];
};

_global_conf["get-customActor"] = (id)=>{ return _global_conf["get-customActors"]()[id]; };

const debug=function f(){
	if(f.inited===undefined){
		f.inited=1;
		f.isdebug=()=>{};
		f.iskeydown=()=>{ return f.isdebug() && geturlargs("keydown"); };
		f.islog2=()=>{ return f.isdebug() && geturlargs("2"); };
		f.isdepress=()=>{ return f.isdebug() || geturlargs("depress"); };
		f.stack=[];
		f.clear=()=>{ f.stack.length=0; };
		f.get=(n)=>{ return f.stack(n); };
		Object.defineProperties(f, {
			log: { get: function() { return f.isdebug()?console.log:none; }, configurable: false },
			warn: { get: function() { return f.isdebug()?console.warn:none; }, configurable: false },
			log2: { get: function() { return f.islog2()?console.log:none; }, configurable: false },
			keydown: { get: function() { return f.iskeydown()?console.log:none; }, configurable: false }
		});
		//f.log=function(){ if(f.isdebug()) console.log.apply(console.log,arguments); };
		debug.func=(obj,key)=>{
			let r=obj[key];
			obj[key]=function f(){
				console.warn(obj.constructor+'.'+key);
				return f.ori.apply(this,arguments);
			};
			obj[key].ori=r;
		};
		if(arguments.length===0) return;
	}
	let stacksize=parseInt(geturlargs("debugsize")||64);
	if(!f.isdebug()||f.stack.length>=stacksize) return;
	console.log.apply(console.log,arguments);
	f.stack.push(arguments);
};debug();debug.clear();

let setShorthand = (w)=>{
	let undef=undefined,d=w.document||{},$rrrr$,$dddd$;
	w.isNone=(a)=>a===undef||a===null;
	w.sum=(a,b)=>{return a+b};
	w.d=d;
	d.ge=function ge(id){return d.getElementById(id)};
	d.ce=function ce(tag){return d.createElement(tag)};
	w.HTMLElement.prototype.ac=function(c){this.appendChild(c);return this;};
	w.HTMLElement.prototype.acarr=function(arr){arr.forEach(c=>this.appendChild(c));return this;};
	w.HTMLElement.prototype.sa=function(a,v){this.setAttribute(a,v);return this;};
	w.HTMLElement.prototype.at=function(t){this.ac(d.createTextNode(t));return this;};
	w.HTMLElement.prototype.si=function(i){this.innerHTML=i;return this;};
	w.HTMLElement.prototype.ga=function(a){return this.getAttribute(a);};
	w.HTMLElement.prototype.range=function(){return this.getBoundingClientRect();};
	w.HTMLElement.prototype.cenPos=function(){
		let rtv={},t=this.getBoundingClientRect();
		rtv['x']=t.left+(t.width/2); rtv['y']=t.top+(t.height/2);
		return rtv;
	};
	w.HTMLElement.prototype.centerize=function(){
		if(this===d.body) return this;
		let prng=this.parentNode.range(),orng=this.range();
		this.sa('style','position:absolute;left:'+((prng.width-orng.width)/2)+'px;top:'+((prng.height-orng.height)/2)+'px;');
		return this;
	};
	w.HTMLElement.prototype.ae=function(e,f){
		if(this.attachEvent) this.attachEvent("on"+e,f);
		else if(this.addEventListener) this.addEventListener(e,f);
		else console.warn("not support");
		return this;
	};
	w.HTMLElement.prototype.rf=function(n){
		let arr=this.childNodes;
		while(arr.length!=0&&arr.length>n)this.removeChild(arr[arr.length-1]);
		return this;
	};
	w.HTMLCanvasElement.prototype.ptcp=function(x,y,w,h,resize){
		// partial copy ; return another canvas
		let rtv=d.ce('canvas');
		let targetW=w,targetH=h;
		if(resize){
			if(resize.w) targetW=resize.w;
			if(resize.h) targetH=resize.h;
		}
		rtv.width =targetW;
		rtv.height=targetH;
		
		let ctx=rtv.getContext('2d');
		ctx.drawImage(
			this,
			x,y,w,h,
			0,0,targetW,targetH
		);
		return rtv;
	};
	w.HTMLImageElement.prototype.ptcp=w.HTMLCanvasElement.prototype.ptcp;
	w.HTMLImageElement.prototype.setLoadSrcWithTimeout=function f(src,ms){
		// this function will overwrite 'onload'
		// note: onloadstart is not working in chrome but standard spec.
		ms^=0;
		this._loaded=false;
		this.onload=f.onload;
		this.src=src;
		if(0<(ms^=0)){ setTimeout(()=>{
			if(!this._loaded){ this.src=""; console.warn("the server is not strong enough to load:",src); }
		},ms); }
		//debug.log("set img  src,timeout =",[src,ms],"ms");
	};
	w.HTMLImageElement.prototype.setLoadSrcWithTimeout.onload=function(){ this._loaded=true; };
	if(!w.NodeList.prototype.forEach){ w.NodeList.prototype.forEach=function(f){
		for(let x=0,xs=this.length;x!==xs;++x) f(this[x],x,this);
	}; }
	
	w.isInt=(obj)=>parseInt(obj)===obj;
	Object.defineProperties(w,{
		"/dev/null": {
			get:function(){return null;},
			set:function(rhs){return rhs;},
		configurable: false}
	});
	w['_/dev/stack']=[];
	Object.defineProperties(w,{
		"/dev/stack": {
			get:function(){ return this['_/dev/stack'].pop(); },
			set:function(rhs){ return this['_/dev/stack'].push(rhs); },
		configurable: false}
	});
	w['_/dev/queue']=[];
	Object.defineProperties(w,{
		"/dev/queue": {
			get:function(){ return this['_/dev/queue'].shift(); },
			set:function(rhs){ return this['_/dev/queue'].push(rhs); },
		configurable: false}
	});
	
	Object.defineProperties(Object.prototype,{
		hasKey: { // it's slow, still need to copy keys to an array (or something like that)
			get:function(){
				debug.warn("Obj.hasKey is slow, still need to copy keys to an array (or something like that). And also 'for(let i in Obj)' is too.");
				for(let i in this){return true;} return false;
			},
		configurable: false}
	});
	
	Object.defineProperties(Array.prototype,{
		back: {
			get:function(){return this[this.length-1];},
			set:function(rhs){return this[this.length-1]=rhs;},
		configurable: false},
		pop_back: {
			get:function(){ return this.pop; },
		configurable: false},
		pop_front: {
			get:function(){
				debug.warn("Array.shift always copies n-1 element and should be prevented");
				return this.shift;
			},
		configurable: false}
	});
	$dddd$=w.Array.prototype.sortn=function f(){
		return this.sort(f.cmp);
	};
	$dddd$.cmp=(a,b)=>a-b;
	w.Array.prototype.sum=function(mapFunc){
		let isFunc = mapFunc && mapFunc.constructor===Function;
		if(this.length===0) return isFunc?undefined:0;
		if(isFunc){
			let rtv=mapFunc(this[0]);
			for(let x=1,xs=this.length;x!==xs;++x) rtv+=this[x];
			return rtv;
		}else{
			let rtv=this[0].constructor===String?'':0;
			for(let x=0,xs=this.length;x!==xs;++x) rtv+=this[x];
			return rtv;
		}
	};
	w.Array.prototype.join=function(sep){
		sep=sep===undef?',':sep;
		let rtv=this.length?this[0].toString():''; for(let x=1,xs=Math.max(1,this.length);x!==xs;++x){ rtv+=sep; rtv+=this[x]; }
		return rtv;
	};
	w.Array.prototype.count=function(x){let rtv=0;this.forEach((v)=>{rtv+=(x===v);});return rtv;};
	w.Array.prototype.getnth=function(n){return this[n];};
	w.Array.prototype.lower_bound=function(val,getval,strt,ende){
		// if found, return idx
		// if not found, return upper bound
		if(!getval||getval.constructor!==Function) getval=_=>_;
		if(ende===undef) ende=this.length;
		strt^=0;
		while(strt<ende){
			let mid=(strt+ende)>>1;
			let tmp=getval(this.getnth(mid));
			if(tmp>=val) ende=mid;
			else if(strt===mid){ strt+=val!==tmp; break; }
			else strt=mid;
		}
		return strt;
	};
	w.Array.prototype.binary_search=function(val,getval,strt,ende){
		if(!getval||getval.constructor!==Function) getval=_=>_;
		let idx=this.lower_bound(val,getval,strt,ende);
		return getval(this.getnth(idx))===val && idx;
	};
	w.Array.prototype.rnd=function(){
		if(this.length===0) return undef;
		return this[parseInt(Math.random()*this.length)];
	};
	
	w.Date.prototype.toLocalISO=function(){
		let delta=this.getTimezoneOffset()*60*1000;
		return new w.Date(this.getTime()-delta).toISOString().replace(/[A-Z]/g,' ');
	};
	
	if(!w.String.prototype.repeat){
		w.String.prototype.repeat=function(n){ 
			let rtv=''; for(let x=0,xs=Math.max(0,n);x!==xs;++x) rtv+=this.toString();
			return rtv;
		};
	}
	if(!w.String.prototype.padStart){
		w.String.prototype.padStart=function(n,s){
			if(s!=='') s=(s||' ').toString();
			let rl=n-this.length;
			let rn=~~(rl/s.length); rn*=rn>=0;
			let rtv=s.repeat(rn);
			rtv+=s.slice(0,rl-rtv.length);
			rtv+=this.valueOf();
			return rtv;
		};
	}
	w.String.prototype.isSpaces=function(){
		let m=this.match(/[ \b\t\n\r]*/);
		return (m&&m[0].length)===this.length;
	};
	w.String.prototype.toId=function(){
		let tmp=this.match(/^([0-9]+)(-[0-9A-Z_a-z]+)?$/);
		return (tmp||undef)&&Number(tmp[1]);
	};
	
	const hexDigits=['0','1','2','3','4','5','6','7','8','9',"A","B","C","D","E","F"];
	w.Number.prototype.toId=function(){ return this.valueOf(); };
	w.Number.prototype.toHexInt=function(unsigned_){
		let rtv="",i=this.valueOf(),arr=[];
		if(i===0) return "0";
		if(!unsigned_ && i<0){ rtv+='-'; i=-parseInt(i); }
		while(i){ arr.push(hexDigits[i&0xF]); i>>=4; i&=0x0FFFFFFF; }
		while(arr.length!==0) rtv+=arr.pop();
		return rtv;
	};
	w.Number.prototype.rot_r=function(n){
		let bitlen=32;
		// n%=bitlen; n+=bitlen; n%=bitlen;
		n&=bitlen-1;
		let v=this.valueOf();
		return (((0xFFFFFFFF<<(bitlen-n))^(~0))&(v>>n)) | (v<<(bitlen-n));
	};
	w.Number.prototype.sh_r=function(n){
		let bitlen=32;
		// n%=bitlen; n+=bitlen; n%=bitlen;
		n&=bitlen-1;
		return n?(( this.valueOf()>>n )&( ( (0xFFFFFFFF<<(bitlen-n))^(~0) ) )):this.valueOf();
	};
	
	w.Queue=function(){ this.initialize.apply(this,arguments); };
	w.Queue.prototype.constructor=w.Queue;
	w.Queue.prototype.initialize=function(init_size,arr){
		this._data=[];
		this.clear(init_size);
	};
	w.Queue.prototype.objcnt=function(){return this._len;};
	w.Queue.prototype.arrsize=function(){return this._data.length;};
	w.Queue.prototype._lastIdx=function(){
		let tmp=this._ende-1;
		return (tmp<0)*this._data.length+tmp;
	};
	w.Queue.prototype.clear=function(init_size){
		if(!(init_size>=32)) init_size=32;
		this._ende=this._strt=0;
		this._len=0;
		this._data.length=init_size;
	};
	Object.defineProperties(w.Queue.prototype,{
		length: {
			get:function(){
				return this._len;
			},
		configurable: false},
		front: {
			get:function(){
				return this._ende===this._strt?undef:this._data[this._strt];
			},
			set:function(rhs){
				return this._ende===this._strt?this._data[this.push(rhs)]:(this._data[this._strt]=rhs);
			},
		configurable: false},
		0: {
			get:function(){ return this.front; },
			set:function(rhs){ return this.front=rhs; },
		configurable: false},
		back: {
			get:function(){
				return this._ende===this._strt?undef:this._data[this._lastIdx()]; },
			set:function(rhs){
				return this._ende===this._strt?this._data[this.push(rhs)]:(this._data[this._lastIdx()]=rhs);
			},
		configurable: false}
	});
	// early preserve (>=50% usage)
	w.Queue.prototype.push=function(obj){
		// return idx of 'obj' in 'this._data'
		if((this._data.length>>1)<this._len){
			let currLen=this._data.length;
			this._data.length<<=1;
			if(this._ende<this._strt){
				// TODO: choose smaller piece(front or back)
				if(currLen-this._strt<this._ende){
					// copy front_data(arr_mid) to new_front_loc(arr_back)
					// this._strt .. currLen
					// (shift=this._data.length-currLen) === currLen
					for(let x=this._strt;x!==currLen;++x) this._data[currLen+x]=this._data[x];
					this._strt+=currLen;
				}else{
					// copy back_data(arr_front) to front_data(arr_mid)
					for(let x=0;x!==this._ende;++x) this._data[currLen+x]=this._data[x];
					this._ende+=currLen;
				}
			}
		}
		++this._len;
		let rtv=0;
		this._data[rtv=this._ende++]=obj;
		this._ende-=(this._ende>=this._data.length)*this._data.length;
		return rtv;
	};
	$rrrr$=w.Queue.prototype.pop=function(){
		if(this._ende===this._strt) return false;
		if(0===--this._len){ this.clear(); return true; }
		++this._strt;
		this._strt-=(this._strt>=this._data.length)*this._data.length;
		return true;
	};
	w.Queue.prototype.pop_front=$rrrr$;
	w.Queue.prototype.pop_back=function(){
		if(this._ende===this._strt) return false;
		if(0===--this._len){ this.clear(); return true; }
		--this._ende;
		this._ende+=(this._ende<0)*this._data.length;
		return true;
	};
	w.Queue.prototype._toValidIdx=function(n){
		n=Number(n); if(isNaN(n)||n>=this._len||this._len<-n) return undef;
		if(n<0){ n+=this._ende; n+=(n<0)*this._data.length; }
		else{ n+=this._strt; n-=(n>=this._data.length)*this._data.length; }
		return n;
	};
	w.Queue.prototype.getnth=function(n){ return this._data[this._toValidIdx(n)]; }; // 0-base
	w.Queue.prototype.setnth=function(n,rhs){
		let idx=this._toValidIdx(n); if(idx===undef) return undef;
		this._data[idx]=rhs;
		return true;
	}; // 0-base
	w.Queue.prototype.indexOf=function(obj){
		for(let cnt=0,x=this._strt,xs=this._ende;x!==xs;++cnt){
			if(this._data[x]===obj) return cnt;
			++x;
			x-=(x>=this._data.length)*this._data.length;
		}
		return -1;
	};
	w.Queue.prototype.lastIndexOf=function(obj){
		for(let cnt=this._len,x=this._ende,xs=this._strt;x!==xs;){
			--x;
			x+=(x<0)*this._data.length;
			--cnt;
			if(this._data[x]===obj) return cnt;
		}
		return -1;
	};
	w.Queue.prototype.forEach=function(callback){
		if(this._ende<this._strt){
			for(let x=this._strt,xs=this._data.length;x!==xs;++x) callback(this._data[x]);
			for(let x=0,xs=this._ende;x!==xs;++x) callback(this._data[x]);
		}else{
			for(let x=this._strt,xs=this._ende;x!==xs;++x) callback(this._data[x]);
		}
	};
	w.Queue.prototype.some=function(callback){
		if(this._ende<this._strt){
			for(let x=this._strt,xs=this._data.length;x!==xs;++x){
				if(callback(this._data[x])) return true;
			}
			for(let x=0,xs=this._ende;x!==xs;++x){
				if(callback(this._data[x])) return true;
			}
		}else{
			for(let x=this._strt,xs=this._ende;x!==xs;++x){
				if(callback(this._data[x])) return true;
			}
		}
		return false;
	};
	w.Queue.prototype.map=function(callback){
		let rtv=[];
		if(this._ende<this._strt){
			for(let x=this._strt,xs=this._data.length;x!==xs;++x){
				rtv.push(callback(this._data[x]));
			}
			for(let x=0,xs=this._ende;x!==xs;++x){
				rtv.push(callback(this._data[x]));
			}
		}else{
			for(let x=this._strt,xs=this._ende;x!==xs;++x){
				rtv.push(callback(this._data[x]));
			}
		}
		return rtv;
	};
	w.Queue.prototype.filter=function(callback){
		let rtv=[];
		if(this._ende<this._strt){
			for(let x=this._strt,xs=this._data.length;x!==xs;++x){
				let item=this._data[x];
				if(callback(this._data[x])) rtv.push(item);
			}
			for(let x=0,xs=this._ende;x!==xs;++x){
				let item=this._data[x];
				if(callback(this._data[x])) rtv.push(item);
			}
		}else{
			for(let x=this._strt,xs=this._ende;x!==xs;++x){
				let item=this._data[x];
				if(callback(this._data[x])) rtv.push(item);
			}
		}
		return rtv;
	};
	w.Queue.prototype.lower_bound=w.Array.prototype.lower_bound;
	w.Queue.prototype.binary_search=w.Array.prototype.binary_search;
	
	w.Heap=function(){ this.initialize.apply(this,arguments); };
	w.Heap.prototype.constructor=w.Heap;
	w.Heap.prototype.initialize=function(func_cmp3,arr,inPlace){
		{
			let lt=func_cmp3;
			this._lt=(lt&&lt.constructor===Function)?(a,b)=>lt(a,b)<0:((a,b)=>a<b);
		}
		this._searchTbl=new Map();
		if(arr&&arr.constructor===Array){
			if(inPlace){
				arr.push(arr[0]);
				arr[0]=undefined;
				this._data=arr;
			}else this._data=[undefined].concat(arr);
			this.makeHeap();
		}else this._data=[undefined];
	};
	w.Heap.prototype.clear=function(){
		this._data.length=1;
		this._searchTbl.clear();
	};
	w.Heap.prototype.remove=function(ele){
		// do not use when 'ele' is basic type: undefined,null,Boolean,Number,String
		let st=this._searchTbl;
		let idx=st.get(ele);
		if(idx===undefined){ debugger; return; }
		st.delete(ele);
		let arr=this._data;
		let rtv=arr[idx];
		arr[idx]=arr.back;
		st.set(arr[idx],idx);
		arr.pop();
		this._sink(idx);
		return rtv;
	};
	Object.defineProperties(w.Heap.prototype,{
		top: {
			get:function(){return this._data[1];},
			set:function(rhs){
				let arr=this._data,st=this._searchTbl;
				st.delete(arr[1]);
				arr[1]=rhs;
				st.set(arr[1],1);
				this._sink();
				return rhs;
			},
		configurable: false},
		length: {
			get:function(){return this._data.length-1;},
		configurable: false}
	});
	w.Heap.prototype._sink=function(strt){
		let arr=this._data;
		if(arr.length===1) return;
		let idx=(strt<<1)||2,lt=this._lt;
		while(idx<arr.length){
			let offset=((idx|1)<arr.length&&lt(arr[idx],arr[idx|1]))^0; // larger
			if(lt(arr[idx>>1],arr[idx|offset])){ // less than larger one
				let idx1=idx>>1,idx2=idx|offset,st=this._searchTbl;
				let tmp=arr[idx1]; arr[idx1]=arr[idx2]; arr[idx2]=tmp;
				st.set(arr[idx1],idx1);
				st.set(arr[idx2],idx2);
			}else break;
			idx|=offset;
			idx<<=1;
		}
		return idx;
	};
	w.Heap.prototype._float=function(strt){
		let arr=this._data;
		if(arr.length===1) return;
		let idx=strt||(arr.length-1),lt=this._lt;
		while(idx!==1 && lt(arr[idx>>1],arr[idx])){
			let st=this._searchTbl,idx0=idx;
			idx>>=1;
			let tmp=arr[idx]; arr[idx]=arr[idx0]; arr[idx0]=tmp;
			st.set(arr[idx0],idx0);
			st.set(arr[idx ],idx );
		}
		return idx;
	};
	w.Heap.prototype.makeHeap=function(){
		let arr=this._data;
		for(let x=arr.length;--x;) this._sink(x);
		for(let x=arr.length;--x;) this._searchTbl.set(arr[x],x);
	};
	w.Heap.prototype.push=function(rhs){
		let arr=this._data;
		arr.push(rhs);
		this._searchTbl.set(arr.back,arr.length-1);
		this._float();
	};
	w.Heap.prototype.pop=function(){
		let arr=this._data;
		if(arr.length===1) return;
		let st=this._searchTbl;
		st.delete(arr[1]);
		arr[1]=arr.back;
		st.set(arr[1],1);
		arr.pop();
		this._sink();
	};
	w.Heap.prototype.toArr=function(){return this._data.slice(1);};
	w.Heap.prototype.rsrvTop=function(){
		let arr=this._data;
		if(arr.length===1) return;
		let st=this._searchTbl;
		st.clear();
		arr.length=2;
		st.set(arr[1],1);
		return this.top;
	};
	
	w.TreeNode=function(){ this.initialize.apply(this,arguments); };
	w.TreeNode.prototype.constructor=w.TreeNode;
	w.TreeNode.prototype.initialize=function(key,data,meta){
		this.meta=meta;
		this.data=data;
		this.key=key;
	};
	
	w.AVLTree=function(){ this.initialize.apply(this,arguments); };
	w.AVLTree.prototype.constructor=w.AVLTree;
	w.AVLTree.prototype.initialize=function(arbKey){
		this._arbKey=arbKey; // (bool) use arbitary keys, no type checking on keys. use at your own risk.
		this._root=undef; // root node
	};
	w.AVLTree._testcode=()=>{
		var sz=1e5,t=new AVLTree(); for(let x=sz^0;x--;){ let n=Math.random(); t.add(n,n); }
		(arr=t.forEach().map(x=>x.data)).forEach((e,i,a)=>{if(i===0)return;if(a[i]<a[i-1])console.log("!");});
		for(let x=sz>>3;x--;) t.del(arr[parseInt(Math.random()*arr.length)]);
		t.forEach().map(x=>x.data).forEach((e,i,a)=>{if(i===0)return;if(a[i]<a[i-1])console.log("!");});
	}
	Object.defineProperties(w.AVLTree.prototype,{
		length: {
			get:function(){
				return (this._root&&this._root.meta.cnt)^0;
			},
		configurable: false}
	});
	w.AVLTree.prototype.sort=none;
	w.AVLTree.prototype._goThrough_iter=function(kargs){
		// for debugging
		kargs=kargs||{};
		let cnt=0,stack=[];
		for(let curr=this._root;curr;curr=curr.meta.L) stack.push(curr);
		while(stack.length){
			let tmp=stack.pop();
			let meta=tmp.meta;
			++cnt;
			if(!kargs.quiet) console.log(tmp.key,tmp.data,meta);
			for(let curr=meta.R;curr;curr=curr.meta.L) stack.push(curr);
		}
		console.log("count",cnt);
	};
	w.AVLTree.prototype._goThrough=function(kargs,strt,lv,cnt){
		// for debugging
		// kargs
		//	quiet: if as true, no each-node outputs
		if(!this._root) return;
		kargs=kargs||{};
		cnt=cnt||[0];
		lv^=0;
		let node=(strt||this._root);
		let meta=node.meta,pad='  '.repeat(lv);
		let nodeL=meta.L,nodeR=meta.R;
		if(nodeL) this._goThrough(kargs,nodeL,lv+1,cnt);
		if(this.getnth(cnt[0]).data!==node.data){
			let msg="getnth dismatch";
			throw new w.Error(msg);
			console.warn(msg);
		}
		++cnt[0];
		if(!kargs.quiet) console.log(pad,"Lv",lv,node.key,node.data,meta);
		if(1+((nodeL&&nodeL.meta.cnt)^0)+((nodeR&&nodeR.meta.cnt)^0)!==meta.cnt){
			let msg="cnt dismatch";
			console.warn(msg,cnt,node.key);
			throw new w.Error(msg);
		}
		if(nodeR) this._goThrough(kargs,nodeR,lv+1,cnt);
		if(!strt) console.log(pad,"count",cnt[0]);
	};
	w.AVLTree.prototype._find_r=function f(key,curr,parent){
		if(!curr || this._keyEqu(curr.key,key)) return [curr,parent];
		else return f.call(this,key,curr.meta[this._keyLt(key,curr.key)?"L":"R"],curr);
	};
	w.AVLTree.prototype.find=function(key){
		// dup keys are allowed, but it'll return any {key,data} of them or undefined
		if(!this.keyOk(key)) throw new w.Error("find: 'key' provided is not a Number or is not an Array of Number: "+(key&&key.toString()));
		if(key.length===undef) key=[key];
		let res=this._find_r(key,this._root)[0];
		return res?{key:res.key,data:res.data}:undef;
	};
	w.AVLTree.prototype._getnth_r=function(n,curr){
		// for debugging, do not check if 'curr' is undefined
		// check validity of 'n' @ entry: 'getnth'
		let meta=curr.meta;
		let L=meta.L;
		let Lcnt=(L&&L.meta.cnt)^0;
		if(n===Lcnt) return curr;
		else if(n<Lcnt) return this._getnth_r(n,L);
		else return this._getnth_r(n-Lcnt-1,meta.R);
	};
	w.AVLTree.prototype.getnth=function(n){
		// 0-based
		// return n-th {key,data} of the node
		if(!(n>=0&&this._root&&n<this._root.meta.cnt)) return undef;
		n=parseInt(n);
		let res=this._getnth_r(n,this._root);
		return {key:res.key,data:res.data};
	};
	// 
	w.AVLTree.prototype._updateCnt=(curr)=>{
		let meta=curr.meta;
		meta.cnt=1;
		if(meta.L) meta.cnt+=meta.L.meta.cnt^0;
		if(meta.R) meta.cnt+=meta.R.meta.cnt^0;
	};
	w.AVLTree.prototype._updateLv=function(node){
		let meta=node.meta;
		let nodeL=meta.L,nodeR=meta.R;
		if(nodeL){
			let metaL=nodeL.meta;
			meta.Llv=Math.max(metaL.Llv,metaL.Rlv)+1;
		}else meta.Llv=0;
		if(nodeR){
			let metaR=nodeR.meta;
			meta.Rlv=Math.max(metaR.Llv,metaR.Rlv)+1;
		}else meta.Rlv=0;
	};
	w.AVLTree.prototype._rot=function(node,parent,dir){
		let meta=node.meta;
		let delta=meta.Llv-meta.Rlv;
		if((delta*delta)<2) return;
		let rnode;
		if(delta<0){
			// L<R
			let tnode=meta.R;
			let tmeta=tnode.meta;
			if(tmeta.Rlv<tmeta.Llv){
				// node
				//  \ 
				//   \ 
				//   tnode
				//   /
				//  rnode
				rnode=tmeta.L;
				let rmeta=rnode.meta; // subtrees(L->R): meta.L, rnode.meta.L, rnode.meta.R, tmeta.R
				if(parent) parent.meta[dir]=rnode;
				else this._root=rnode;
				tmeta.L=rmeta.R;
				rmeta.R=meta.R;
				meta.R=rmeta.L;
				rmeta.L=node;
				
				// update lv for: rnode, rnode.meta.L, rnode.meta.R
				meta.Rlv=rmeta.Llv;
				tmeta.Llv=rmeta.Rlv;
			}else{
				// node
				//  \ 
				//   \ 
				//    .
				rnode=meta.R;
				if(parent) parent.meta[dir]=rnode;
				else this._root=rnode;
				meta.R=tmeta.L;
				tmeta.L=node;
				
				meta.Rlv=tmeta.Llv;
			}
		}else{
			// L>R
			let tnode=meta.L;
			let tmeta=tnode.meta;
			if(tmeta.Llv<tmeta.Rlv){ // TODO: not confirmed
				//   node
				//   /
				//  /
				// tnode
				//  \ 
				//  rnode
				rnode=tmeta.R;
				let rmeta=rnode.meta; // subtrees(L->R): tmeta.L, rnode.meta.L, rnode.meta.R, meta.R
				if(parent) parent.meta[dir]=rnode;
				else this._root=rnode;
				tmeta.R=rmeta.L;
				rmeta.L=meta.L;
				meta.L=rmeta.R;
				rmeta.R=node;
				
				// update lv for: rnode, rnode.meta.L, rnode.meta.R
				meta.Llv=rmeta.Rlv;
				tmeta.Rlv=rmeta.Llv;
			}else{
				//   node
				//   /
				//  /
				// .
				rnode=meta.L;
				if(parent) parent.meta[dir]=rnode;
				else this._root=rnode;
				meta.L=tmeta.R;
				tmeta.R=node; // rnode.meta.R=node;
				
				meta.Llv=tmeta.Rlv;
			}
		}
		if(rnode){
			this._updateLv(rnode);
			let tmp;
			if(tmp=rnode.meta.L) this._updateCnt(tmp);
			if(tmp=rnode.meta.R) this._updateCnt(tmp);
			this._updateCnt(rnode);
		}
		if(parent){
			this._updateLv(parent);
			this._updateCnt(parent);
		}else if(this._root){
			this._updateLv(this._root);
			this._updateCnt(this._root);
		}
	};	
	w.AVLTree.prototype._add_r=function(curr,newNode){
		// return #lv of this subtree (root=curr)
		curr.meta.cnt+=(newNode.meta.cnt)^0;
		//let dir01=this._keyEqu(newNode.key,curr.key)?(curr.meta.Rlv<curr.meta.Llv):this._keyLt(curr.key,newNode.key);
		if(this._keyEqu(newNode.key,curr.key)?(curr.meta.Rlv<curr.meta.Llv):this._keyLt(curr.key,newNode.key)){
			if(curr.meta.R){
				curr.meta.Rlv=this._add_r(curr.meta.R,newNode);
				this._rot(curr.meta.R,curr,"R");
			}else{
				let meta=newNode.meta;
				curr.meta.Rlv=Math.max(meta.Llv,meta.Rlv)+1;
				curr.meta.R=newNode;
			}
		}else{
			if(curr.meta.L){
				curr.meta.Llv=this._add_r(curr.meta.L,newNode);
				this._rot(curr.meta.L,curr,"L");
			}else{
				let meta=newNode.meta;
				curr.meta.Llv=Math.max(meta.Llv,meta.Rlv)+1;
				curr.meta.L=newNode;
			}
		}
		return Math.max(curr.meta.Llv,curr.meta.Rlv)+1;
		// // slow: constructing new string
		//let dir=(this._keyEqu(newNode.key,curr.key)?(curr.meta.Llv<curr.meta.Rlv):this._keyLt(newNode.key,curr.key))?"L":"R";
		//if(curr.meta[dir]){
		//	curr.meta[dir+"lv"]=this._add_r(curr.meta[dir],newNode);
		//	this._rot(curr.meta[dir],curr,dir);
		//	//this._updateCnt(curr.meta[dir]);
		//}else{
		//	let meta=newNode.meta;
		//	curr.meta[dir+"lv"]=Math.max(meta.Llv,meta.Rlv)+1;
		//	curr.meta[dir]=newNode;
		//}
		//return Math.max(curr.meta.Llv,curr.meta.Rlv)+1;
	};
	w.AVLTree.prototype.add=function(key,data){
		// dup keys are allowed
		if(!this.keyOk(key)) throw new w.Error("add: 'key' provided is not a Number or is not an Array of Number: "+(key&&key.toString()));
		if(!(key instanceof Array)) key=[key];
		let newNode=new w.TreeNode(key,data,{L:undef,R:undef,Llv:0,Rlv:0,cnt:1});
		// lv: amount of levels of a subtree
		// Lcnt: amount of nodes of left subtree // TODO
		if(!this._root) return this._root=newNode;
		else{
			this._add_r(this._root,newNode);
			this._rot(this._root); // this._root might be changed
		}
	};
	w.AVLTree.prototype.adds=function(key_data_arr){ for(let x=0,arr=key_data_arr;x!==arr.length;++x) this.add(arr[x].key,arr[x].data); };
	// 
	w.AVLTree.prototype._del_btm_r=function(curr,dir){
		let tmp,rtv;
		if(tmp=curr.meta[dir]){
			--curr.meta.cnt;
			rtv=this._del_btm_r(tmp,dir);
			if(rtv===tmp){
				let meta=curr.meta;
				if(dir==="R"){
					meta.R=rtv.meta.L;
					let meta_=meta.R&&meta.R.meta;
					meta.Rlv=meta_?Math.max(meta_.Llv,meta_.Rlv)+1:0;
				}else{
					meta.L=rtv.meta.R;
					let meta_=meta.L&&meta.L.meta;
					meta.Llv=meta_?Math.max(meta_.Llv,meta_.Rlv)+1:0;
				}
				// // slow: constructing new string
				//let meta=curr.meta;
				//meta[dir]=rtv.meta[dir==="L"?"R":"L"];
				//let meta_=meta[dir]&&meta[dir].meta;
				//meta[dir+"lv"]=meta_?Math.max(meta_.Llv,meta_.Rlv)+1:0;
			}else{
				this._rot(tmp,curr,dir);
			}
		}else rtv=curr;
		return rtv;
	};
	w.AVLTree.prototype._del_r=function(key,curr,parent,dir){
		if(this._keyEqu(key,curr.key)){
			if(parent){
				let cmeta=curr.meta,pmeta=parent.meta;
				let lt=cmeta.Llv<cmeta.Rlv;
				if(lt){
					if(cmeta.R){ let node=this._del_btm_r(cmeta.R,"L"); // node.meta.L is undef
						pmeta[dir]=node;
						node.meta.L=cmeta.L;
						if(cmeta.R!==node) node.meta.R=cmeta.R; // lv>1
					}else pmeta[dir]=cmeta.L;
				}else{
					if(cmeta.L){
						let node=this._del_btm_r(cmeta.L,"R"); // node.meta.R is undef
						pmeta[dir]=node;
						node.meta.R=cmeta.R;
						if(cmeta.L!==node) node.meta.L=cmeta.L; // lv>1
					}else pmeta[dir]=cmeta.R;
				}
				if(dir==="R"){
					let n=pmeta.R;
					if(n){
						this._updateLv(n);
						pmeta.Rlv=Math.max(n.meta.Llv,n.meta.Rlv)+1; // rot pmeta[dir] later
						this._updateCnt(n);
						this._rot(n,parent,dir);
					}else pmeta.Rlv=0;
				}else{
					let n=pmeta.L;
					if(n){
						this._updateLv(n);
						pmeta.Llv=Math.max(n.meta.Llv,n.meta.Rlv)+1; // rot pmeta[dir] later
						this._updateCnt(n);
						this._rot(n,parent,dir);
					}else pmeta.Llv=0;
				}
				// // slow: constructing new string
				//let n=pmeta[dir];
				//if(n){
				//	this._updateLv(n);
				//	pmeta[dir+"lv"]=Math.max(n.meta.Llv,n.meta.Rlv)+1; // rot pmeta[dir] later
				//	this._updateCnt(n);
				//	this._rot(n,parent,dir);
				//}else pmeta[dir+"lv"]=0;
			}else{ // root
				let cmeta=curr.meta;
				let lt=cmeta.Llv<cmeta.Rlv;
				if(lt){
					if(cmeta.R){ let node=this._del_btm_r(cmeta.R,"L"); // node.meta.L is undef
						this._root=node;
						node.meta.L=cmeta.L;
						if(cmeta.R!==node) node.meta.R=cmeta.R; // lv>1
					}else this._root=cmeta.L;
				}else{
					if(cmeta.L){
						let node=this._del_btm_r(cmeta.L,"R"); // node.meta.R is undef
						this._root=node;
						node.meta.R=cmeta.R;
						if(cmeta.L!==node) node.meta.L=cmeta.L; // lv>1
					}else this._root=cmeta.R;
				}
				if(this._root){
					this._updateLv(this._root);
					this._rot(this._root);
				}
			}
			return true;
		}
		dir=this._keyLt(key,curr.key)?"L":"R";
		if(curr.meta[dir]){
			let rtv=this._del_r(key,curr.meta[dir],curr,dir);
			let tmp=curr.meta[dir];
			if(rtv){
				--curr.meta.cnt;
				if(tmp) this._rot(tmp,curr,dir);
			}
			return rtv;
		} // else: END, del fail
	};
	w.AVLTree.prototype.del=function(key){
		// dup keys are allowed, but it'll delete any of them
		// return true if do deletion
		if(!this.keyOk(key)) throw new w.Error("del: 'key' provided is not a Number or is not an Array of Number: "+(key&&key.toString()));
		if(key.length===undef) key=[key];
		let rtv=this._del_r(key,this._root);
		if(this._root){
			this._rot(this._root);
			this._updateCnt(this._root);
		}
		return rtv;
	};
	w.AVLTree.prototype._keyOk_number=key=>((key instanceof Number)||(typeof key==='number'));
	w.AVLTree.prototype._keyOk_arr=function(key){
		return key&&key.constructor===Array&&key.map(x=>!this._keyOk_number(x)).sum()===0;
	};
	w.AVLTree.prototype._keyOk_arr_=key=>key&&key.constructor===Array;
	w.AVLTree.prototype.keyOk=function(key){
		return this._arbKey||this._keyOk_number(key)||this._keyOk_arr(key);
	};
	w.AVLTree.prototype._keyLt=(lhs,rhs)=>{
		let rtv=lhs.length<rhs.length;
		for(let x=0,minLen=rtv?lhs.length:rhs.length;x!==minLen;++x) if(lhs[x]!==rhs[x]) return lhs[x]<rhs[x];
		return rtv;
	};
	w.AVLTree.prototype.keyLt=function(lhs,rhs){
		if(!this._keyOk_arr_(lhs)) lhs=[lhs];
		if(!this._keyOk_arr_(rhs)) rhs=[rhs];
		return this._keyLt(lhs,rhs);
	};
	w.AVLTree.prototype._keyEqu=function(lhs,rhs){
		let Llen=lhs.length;
		if(Llen!==rhs.length) return false;
		for(let x=0;x!==Llen;++x) if(lhs[x]!==rhs[x]) return false;
		return true;
	};
	w.AVLTree.prototype.keyEqu=function(lhs,rhs){
		if(!this._keyOk_arr_(lhs)) lhs=[lhs];
		if(!this._keyOk_arr_(rhs)) rhs=[rhs];
		return this._keyEqu(lhs,rhs);
	};
	w.AVLTree.prototype.forEach=function(callback,noNewArr){
		// callback(data,key,tree,node);
		if(noNewArr){
			let stack=[];
			for(let curr=this._root;curr;curr=curr.meta.L) stack.push(curr);
			while(stack.length){
				let tmp=stack.pop();
				callback(tmp.data,tmp.key,this,tmp);
				let meta=tmp.meta;
				for(let curr=meta.R;curr;curr=curr.meta.L) stack.push(curr);
			}
		}else{
			let cnt=0,arr=[]; arr.length=this.length;
			let stack=[];
			for(let curr=this._root;curr;curr=curr.meta.L) stack.push(curr);
			while(stack.length){
				let tmp=stack.pop();
				arr[cnt++]=tmp;
				let meta=tmp.meta;
				for(let curr=meta.R;curr;curr=curr.meta.L) stack.push(curr);
			}
			if(callback&&callback.constructor===Function){
				for(let x=0;x!==arr.length;++x){
					let tmp=arr[x];
					callback(tmp.data,tmp.key,this,tmp);
				}
			}
			return arr;
		}
	};
	w.AVLTree.prototype.forEach_r=function(callback,noNewArr){
		// callback(data,key,tree,node);
		if(noNewArr){
			let cnt=0;
			let stack=[];
			for(let curr=this._root;curr;curr=curr.meta.R) stack.push(curr);
			while(stack.length){
				let tmp=stack.pop();
				callback(tmp.data,tmp.key,this,tmp);
				let meta=tmp.meta;
				for(let curr=meta.L;curr;curr=curr.meta.R) stack.push(curr);
			}
		}else{
			let cnt=0,arr=[]; arr.length=this.length;
			let stack=[];
			for(let curr=this._root;curr;curr=curr.meta.R) stack.push(curr);
			while(stack.length){
				let tmp=stack.pop();
				arr[cnt++]=tmp;
				let meta=tmp.meta;
				for(let curr=meta.L;curr;curr=curr.meta.R) stack.push(curr);
			}
			if(callback&&callback.constructor===Function){
				for(let x=0;x!==arr.length;++x){
					let tmp=arr[x];
					callback(tmp.data,tmp.key,this,tmp);
				}
			}
			return arr;
		}
		
	};
	w.AVLTree.prototype.lower_bound=function(key){
		let rtv=new this.constructor.it;
		rtv.lower_bound(this,key);
		return rtv;
	};
	w.AVLTree.it=function(){ this.initialize.apply(this,arguments); };
	w.AVLTree.it.prototype.constructor=w.AVLTree.it;
	w.AVLTree.it.prototype.initialize=function(tree){
		this._stack=[];
		if(tree) this._begin(tree._root);
	};
	w.AVLTree.it._testcode=()=>{ // testcode
		var t=new AVLTree(); for(let x=1024;x--;) t.add(x,x); var it=new AVLTree.it(); it.lower_bound(t,0); res=[it.curr.data]; while(tmp=it.next()) res.push(tmp.data);
		var res_=res.map((e,i,a)=>i!==0&&a[i]-a[i-1]).sort((a,b)=>a-b);
		console.log(res_[0],res_.back);
	};
	Object.defineProperties(w.AVLTree.it.prototype,{
		curr: {
			get:function(){
				return this._stack.back;
			},
		configurable: false}
	});
	w.AVLTree.it.prototype.now=function(){
		return this._stack.back;
	};
	w.AVLTree.it.prototype.copy=function(){
		let rtv=new this.constructor;
		rtv._stack=this._stack.slice(0);
		return rtv;
	};
	w.AVLTree.it.prototype.next=function(){
		let arr=this._stack,tmp=this._stack.back;
		if(!tmp) return;
		if(tmp=tmp.meta.R) return this._begin(tmp);
		let curr;
		// to parent R
		do{
			curr=arr.pop();
			if(arr.length===0) return;
			tmp=arr.back.meta.R;
		}while(tmp===curr);
		return arr.back;
	};
	w.AVLTree.it.prototype._begin=function(node){
		for(let curr=node;curr;curr=curr.meta.L) this._stack.push(curr);
		return this._stack.back;
	};
	w.AVLTree.it.prototype.begin=function(tree){
		return this._begin(tree._root);
	};
	w.AVLTree.it.prototype.lower_bound=function(tree,key){
		if(key===null||key===undef) return this.begin(tree);
		if(key.constructor!==Array) key=[key];
		let arr=this._stack,curr; arr.length=0;
		for(curr=tree._root;curr;){
			arr.push(curr);
			if(tree._keyLt(curr.key,key)) curr=curr.meta.R;
			else curr=curr.meta.L;
		}
		if(curr=arr.back) if(tree._keyLt(curr.key,key)) return this.next();
		return curr;
	};
	
	w.Function.prototype._dummy_arr=[];
	
	w.hash=function(input_str){
		// https://en.wikipedia.org/wiki/SHA-2#Pseudocode
		let h0 = 0x6a09e667;
		let h1 = 0xbb67ae85;
		let h2 = 0x3c6ef372;
		let h3 = 0xa54ff53a;
		let h4 = 0x510e527f;
		let h5 = 0x9b05688c;
		let h6 = 0x1f83d9ab;
		let h7 = 0x5be0cd19;
		input_str=input_str||"";
		let arr=[];
		// to byte string
		for(let mask=0x7FFFFFFF,x=0;x!==input_str.length;++x){
			let c=input_str.charCodeAt(x)&mask; // make sure to be unsigned
			if(c>0x7F){ // 2 bytes or more
				let rev_arr=[c&0x3F|0x80],r=(c>>6);
				if(c>0x7FF){ // 3 bytes or more
					rev_arr.push(r&0x3F|0x80); r>>=6;
					if(c>0xFFFF){ // 4 bytes
						rev_arr.push(r&0x3F|0x80); r>>=6;
						if(c>0x10FFFF){ // wtf
							rev_arr.push(r&0x3F); r>>=6;
							rev_arr.push(r|0xF8); // &0x3
						}else rev_arr.push(r|0xF); // &0x7
					}else rev_arr.push(r|0xE0); // &0xF
				}else rev_arr.push(r|0xC0); // &0x1F
				for(let z=rev_arr.length;z--;) arr.push(rev_arr[z]);
			}else arr.push(c);
		}
		// padding K
		let K=(512-((arr.length*8)+1+64)%512)%512; // L +1 +64
		// L +1 +K +64 ===     0 (mod 512)
		//      +K     === -L-65 (mod 512)
		if((K&7)!==7) throw new w.Error("char is not 8bits?");
		K-=7;arr.push(0x80);
		while(K){K-=8;arr.push(0x0);}
		// padding L 64-bit big-endian
		let L64big=arr.length; L64big*=8;
		for(let x=8;x--;){ arr.push(L64big&0xFF); L64big }
		if(arr.length%64) throw new w.Error("I did it wrong");
		for(let base=0;base!==arr.length;base+=64){
			let w=[]; for(let x=0;x!==64;++x) w[x]=0;
			let words=[]; for(let x=0;x!==64;x+=4) words.push((arr[base+x]<<24)|(arr[base+x+1]<<16)|(arr[base+x+2]<<8)|arr[base+x+3]);
			for(let x=0;x!==16;++x) w[x]=words[x];
			for(let i=16;i!==64;++i){
				let s0=w[i-15].rot_r(7)^w[i-15].rot_r(18)^w[i-15].sh_r(3);
				let s1=w[i-2].rot_r(17)^w[i- 2].rot_r(19)^w[i-2].sh_r(10);
				w[i]=(w[i-16]+s0+w[i-7]+s1)|0;
			}
			let a = h0;
			let b = h1;
			let c = h2;
			let d = h3;
			let e = h4;
			let f = h5;
			let g = h6;
			let h = h7;
			for(let i=0;i!==64;++i){
				let S1=e.rot_r(6)^e.rot_r(11)^e.rot_r(25);
				let ch=(e&f)^((~e)&g);
				let temp1=(h+S1+ch+w.sha256.k[i]+w[i])|0;
				let S0=a.rot_r(2)^a.rot_r(13)^a.rot_r(22);
				let maj=(a&b)^(a&c)^(b&c);
				let temp2=(S0+maj)|0;
				h = g;
				g = f;
				f = e;
				e = (d + temp1)|0;
				d = c;
				c = b;
				b = a;
				a = (temp1 + temp2)|0;
			}
			h0 = (h0 + a)|0;
			h1 = (h1 + b)|0;
			h2 = (h2 + c)|0;
			h3 = (h3 + d)|0;
			h4 = (h4 + e)|0;
			h5 = (h5 + f)|0;
			h6 = (h6 + g)|0;
			h7 = (h7 + h)|0;
		}
		let rtvtmp=[h0,h1,h2,h3,h4,h5,h6,h7];
		let rtv="0x";
		for(let x=0;x!==rtvtmp.length;++x){
			for(let h=rtvtmp[x],sh=32;sh;){
				sh-=8;
				let tmp=(h.sh_r(sh)&0xFF).toHexInt();
				if(tmp.length===1) rtv+="0";
				rtv+=tmp;
			}
		}
		return rtv;
	};
	w.sha256=function sha256(input_str_orOthersTreatedAsArrayOfBytes,encode){
		// https://en.wikipedia.org/wiki/SHA-2#Pseudocode
		let h0 = 0x6a09e667;
		let h1 = 0xbb67ae85;
		let h2 = 0x3c6ef372;
		let h3 = 0xa54ff53a;
		let h4 = 0x510e527f;
		let h5 = 0x9b05688c;
		let h6 = 0x1f83d9ab;
		let h7 = 0x5be0cd19;
		let input_str=input_str_orOthersTreatedAsArrayOfBytes;
		input_str=input_str||"";
		let arr=[];
		if(typeof input_str==='string'){
			// to byte string
			for(let mask=0x7FFFFFFF,x=0;x!==input_str.length;++x){
				let c=input_str.charCodeAt(x)&mask; // make sure to be unsigned
				if(c>0x7F){ // 2 bytes or more
					let rev_arr=[c&0x3F|0x80],r=(c>>6);
					if(c>0x7FF){ // 3 bytes or more
						rev_arr.push(r&0x3F|0x80); r>>=6;
						if(c>0xFFFF){ // 4 bytes
							rev_arr.push(r&0x3F|0x80); r>>=6;
							if(c>0x10FFFF){ // wtf
								rev_arr.push(r&0x3F); r>>=6;
								rev_arr.push(r|0xF8); // &0x3
							}else rev_arr.push(r|0xF); // &0x7
						}else rev_arr.push(r|0xE0); // &0xF
					}else rev_arr.push(r|0xC0); // &0x1F
					for(let z=rev_arr.length;z--;) arr.push(rev_arr[z]);
				}else arr.push(c);
			}
		}else for(let x=0;x!==input_str.length;++x) arr.push(input_str[x]&0xFF);
		let trueStrLen=arr.length;
		// padding K
		let K=(512-((arr.length*8)+1+64)%512)%512; // L +1 +64
		// L +1 +K +64 ===     0 (mod 512)
		//      +K     === -L-65 (mod 512)
		if((K&7)!==7) throw new w.Error("char is not 8bits?");
		K-=7;arr.push(0x80);
		while(K){K-=8;arr.push(0x0);}
		// padding L 64-bit big-endian
		let L64big=(trueStrLen*8).toString(16); L64big=("0".repeat(16-L64big.length)+L64big).slice(-16);
		for(let x=0;x!==L64big.length;x+=2) arr.push(Number("0x"+L64big.slice(x,x+2)));
		if(arr.length%64) throw new w.Error("I did it wrong");
		for(let base=0;base!==arr.length;base+=64){
			let w=[]; for(let x=0;x!==64;++x) w[x]=0;
			let words=[]; for(let x=0;x!==64;x+=4) words.push((arr[base+x]<<24)|(arr[base+x+1]<<16)|(arr[base+x+2]<<8)|arr[base+x+3]);
			for(let x=0;x!==16;++x) w[x]=words[x];
			for(let i=16;i!==64;++i){
				let s0=w[i-15].rot_r(7)^w[i-15].rot_r(18)^w[i-15].sh_r(3);
				let s1=w[i-2].rot_r(17)^w[i- 2].rot_r(19)^w[i-2].sh_r(10);
				w[i]=(w[i-16]+s0+w[i-7]+s1)|0;
			}
			let a = h0;
			let b = h1;
			let c = h2;
			let d = h3;
			let e = h4;
			let f = h5;
			let g = h6;
			let h = h7;
			for(let i=0;i!==64;++i){
				let S1=e.rot_r(6)^e.rot_r(11)^e.rot_r(25);
				let ch=(e&f)^((~e)&g);
				let temp1=(h+S1+ch+sha256.k[i]+w[i])|0;
				let S0=a.rot_r(2)^a.rot_r(13)^a.rot_r(22);
				let maj=(a&b)^(a&c)^(b&c);
				let temp2=(S0+maj)|0;
				h = g;
				g = f;
				f = e;
				e = (d + temp1)|0;
				d = c;
				c = b;
				b = a;
				a = (temp1 + temp2)|0;
			}
			h0 = (h0 + a)|0;
			h1 = (h1 + b)|0;
			h2 = (h2 + c)|0;
			h3 = (h3 + d)|0;
			h4 = (h4 + e)|0;
			h5 = (h5 + f)|0;
			h6 = (h6 + g)|0;
			h7 = (h7 + h)|0;
		}
		let rtvtmp=[h0,h1,h2,h3,h4,h5,h6,h7];
		let rtv="";
		if(encode){
			for(let x=0;x!==rtvtmp.length;++x){
				for(let h=rtvtmp[x],sh=32;sh;){
					sh-=8;
					rtv+=String.fromCharCode(h.sh_r(sh)&0xFF);
				}
			}
		}else{
			rtv+="0x";
			for(let x=0;x!==rtvtmp.length;++x){
				for(let h=rtvtmp[x],sh=32;sh;){
					sh-=8;
					let tmp=(h.sh_r(sh)&0xFF).toHexInt();
					if(tmp.length===2) rtv+=tmp;
					else rtv+="0"+tmp;
				}
			}
		}
		return rtv;
	};
	w.sha256.k=[
0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
		];
	
	// v failed
	let rnd01_init="",rnd01_it=-1;
	w.rnd01=function f(cmd,kargs){
		if(!f.inited){
			f.inited=true;
			if(!f.hex2bits) f.hex2bits=s=>(s[1]==='x'?s.slice(2):s).split('')
				.map(x=>parseInt("0x"+x))
				.map(x=>x.toString(2).padStart(4,0)+'');
			if(!f.fromHash) f.fromHash=s=>{
				let rtv='';
				f.hex2bits(sha256(s)).forEach(x=>rtv+=x);
				return rtv;
			};
			if(!f.mix) f.mix=(s1,s2)=>{
				let rtv='',ss=[s1,s2];
				for(let x=0,xs=Math.max(s1.length,s2.length);x!==xs;++x){
					let s=ss[x&1];
					rtv+=s[(x>>1)%s.length];
				}
				return rtv;
			};
			if(!f.inv) f.inv=s=>s.split('').map(x=>x==='0'?'1':'0').join('');
			if(!f.rev) f.rev=s=>s.split('').reverse().join('');
			if(!f.xor) f.xor=(s1,s2)=>{
				let rtv='';
				for(let x=0,xs=Math.max(s1.length,s2.length);x!==xs;++x) rtv+=s1[x]===s2[x]?'0':'1';
				return rtv;
			};
			if(!f.convert) f.convert=s=>{
				s=s||"";
				
				let rtv='',arr=[f.fromHash(s)],t=1;
				s+="$"+btoa(s); s.split('').forEach( c=>arr.push(f.fromHash(c)) );
				arr.push(arr[0]);
				while(t<arr.length) t<<=1;
				while(arr.length<t) arr.push(arr[arr.length-s.length]);
				for(let arr2=[];arr.length!==1;arr=arr2){
					arr2=[];
					for(let x=0;x!==arr.length;x+=2) arr2.push(x&2?arr[x|1]+arr[x]:f.mix(arr[x],arr[x|1]));
				}
				rtv+=arr[0];
				rtv=f.mix(f.inv(rtv),f.rev(rtv));
				rtv=f.mix(f.rev(rtv),rtv);
				return rtv;
			};
			f.s=f.convert("agold404");
			f.i=-1;
		}
		switch(cmd){
		default:
			++f.i;
			return (f.s[f.i%=f.s.length]==='1')^0;
		break;
		case "getStr":
			return f.s;
		break;
		case "getIt":
			return f.i;
		break;
		case "getStrH":
			return f.s.replace(/(....)/g,' $1').slice(1).split(' ').map(s=>{
				let rtv=0;
				for(let x=0;x!==s.length;++x){ rtv<<=1; rtv|=s[x]==='1'; }
				return rtv.toHexInt(16,1);
			}).join('');
		break;
		case "setInit":
			f.s=kargs.s;
			f.i=kargs.i;
		break;
		case "setInitH":
			f.s=f.hex2bits(kargs.s);
			f.i=kargs.i;
		break;
		}
	};
	w.rnd0n=function f(N){ // N not included
		if(!(0<N)) return undef;
		let arr=[]; for(let x=0;x!==N;++x) arr.push(x);
		while(arr.length!==1){
			let tmp=[];
			for(let x=0;x!==arr.length;++x) if(w.rnd01()) tmp.push(arr[x]);
			if(tmp.length!==0) arr=tmp;
		}
		return arr[0];
	};
	// ^ failed
	
	w.rnd65536=function f(seed){
		if(!f.inited){
			f.inited=true;
			f.a=101;f.X=seed^0;f.c=32;f.m=2147483647;
		}
		if(typeof seed==='number') f.X=seed;
		return (f.X=(f.a*f.X+f.c)%f.m)&0xFFFF;
	};
};
