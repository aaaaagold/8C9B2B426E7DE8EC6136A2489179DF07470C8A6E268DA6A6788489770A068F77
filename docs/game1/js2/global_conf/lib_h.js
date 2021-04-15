"use strict";

if(!window.objs) window.objs={};

setShorthand(window);

$dddd$=String.prototype.toId=function f(){
	let tmp=this.match(f.regex);
	return (tmp||undefined)&&Number(tmp[1]);
};
$dddd$.regex=/^([0-9]+)(-[0-9A-Z_a-z]+)?$/;
Number.prototype.toId=function(){ return this.valueOf(); };
$dddd$=String.prototype.subId=function f(){
	let tmp=this.match(f.regex);
	return (tmp||undefined)&&Number(tmp[3]);
};
$dddd$.regex=/^([0-9]+)(-([0-9A-Z_a-z]+))?$/;
Number.prototype.subId=()=>0;
Map.prototype.byKey_sum=function(map2,inplace_self){
	let base,rhs,rtv;
	if(inplace_self){ rtv=this; rhs=map2; }
	else{
		if(this.size<map2.size){ rhs=this; base=map2; }
		else{ rhs=map2; base=this; }
		rtv=new Map(base);
	}
	if(rtv.c===undefined) rtv.c=0;
	if(rtv.v===undefined) rtv.v=0;
	rhs.forEach((v,k)=>{
		let tmp=rtv.get(k);
		if(tmp) rtv.set(k,tmp+v);
		else rtv.set(k,v);
		rtv.v+=v;
		++rtv.c;
	});
	return rtv;
};
Map.prototype.byKey_mul=function(map2,inplace_self){
	let base,rhs,rtv;
	if(inplace_self){ rtv=this; rhs=map2; }
	else{
		if(this.size<map2.size){ rhs=this; base=map2; }
		else{ rhs=map2; base=this; }
		rtv=new Map(base);
	}
	if(rtv.c===undefined) rtv.c=0;
	if(rtv.v===undefined) rtv.v=1;
	rhs.forEach((v,k)=>{
		let tmp=rtv.get(k);
		if(tmp!==undefined) rtv.set(k,tmp*v);
		else rtv.set(k,v);
		rtv.v*=v;
		++rtv.c;
	});
	return rtv;
};
Map.prototype.byKey_del_sum=function(rhs){
	const rtv=this;
	rhs.forEach((v,k)=>{
		const tmp=rtv.get(k);
		if(tmp!==undefined){
			rtv.set(k,tmp-v);
			rtv.v-=v;
			--rtv.c;
		}
	});
	if(rtv.c===0){
		rtv.v=0;
		rtv.clear();
	}
	return rtv;
};
Map.prototype.byKey_del_mul=function(rhs){
	const rtv=this;
	rhs.forEach((v,k)=>{
		const tmp=rtv.get(k);
		if(tmp!==undefined){
			rtv.set(k,tmp/v);
			rtv.v/=v;
			--rtv.c;
		}
	});
	if(rtv.c===0){
		rtv.v=1;
		rtv.clear();
	}
	return rtv;
};
Map.prototype.byKey2_sum=function(rhs){
	const base=this;
	if(base.c===undefined) base.c=0;
	rhs.forEach((v,k)=>{
		let tmp=base.get(k);
		if(!tmp) base.set(k,tmp=new Map());
		const c=tmp.c||0,val=tmp.v||0;
		tmp.byKey_sum(v,true);
		base.c+=tmp.c-c;
		base.v+=tmp.v-val;
	});
	return base;
};
Map.prototype.byKey2_mul=function(rhs){
	const base=this;
	if(base.c===undefined) base.c=0;
	if(base.v===undefined) base.v=1;
	rhs.forEach((v,k)=>{
		let tmp=base.get(k);
		if(!tmp) base.set(k,tmp=new Map());
		const c=tmp.c||0;
		const val=tmp.val===undefined?1:tmp.v;
		tmp.byKey_mul(v,true);
		base.c+=tmp.c-c;
		base.v*=tmp.v/val;
	});
	return base;
};
Map.prototype.byKey2_del_sum=function(rhs){
	const base=this;
	rhs.forEach((v,k)=>{
		const tmp=base.get(k);
		if(tmp){
			const c=tmp.c,val=tmp.v;
			tmp.byKey_del_sum(v);
			base.c+=tmp.c-c;
			base.v+=tmp.v-val;
			if(!tmp.c) base.delete(k);
		}
	});
	return base;
};
Map.prototype.byKey2_del_mul=function(rhs){
	const base=this;
	rhs.forEach((v,k)=>{
		const tmp=base.get(k);
		if(tmp){
			const c=tmp.c,val=tmp.v;
			tmp.byKey_del_mul(v);
			base.c+=tmp.c-c;
			base.v*=tmp.v/val;
			if(!tmp.c) base.delete(k);
		}
	});
	return base;
};

const dialog=window.dialog=(txtarr,windowSetting,clear=true)=>{
	let p=$gameMap._interpreter;
	if(clear||p._list===null) p.clear();
	if(p._list===null) p._list=[];
	let arr=p._list;
	arr.push({code:0,indent:0,parameters:[]});
	for(let x=0;x!==txtarr.length;++x){
		arr.push({code:101,indent:0,parameters:["",0,1,2]}); // TODO: windowSetting
		arr.push({code:401,indent:0,parameters:[txtarr[x]]});
	}
};

const CacheSystem=window.CacheSystem=function CacheSystem() {
    this.initialize.apply(this, arguments);
}
CacheSystem.prototype.initialize = function(){
	let threshold=arguments[0]||1;
	this.__cacheThreshold=threshold;
	this.__caches=new Map();
	this.__addCnt=new Map();
	this.__xhrq={};
};
CacheSystem.prototype.xhrq_regist=function(key,callbacks){
	// XmlHttpRequestQueue: for reducing nearly-same-time request
	// callbacks==={useCache:Function,send:()=>{xhr.send();}};
	// put a function for what to do when using cache in callbacks.useCache
	// put 'xhr.send()' in callbacks.send
	// the first success one will NOT call 'callbacks.useCache'
	if(this.get(key)!==undef){ // already cached
		callbacks.useCache();
		return;
	}
	if(!this.__xhrq[key]) this.__xhrq[key]=[];
	let arr=this.__xhrq[key];
	if(arr.length<this.__cacheThreshold) callbacks.send();
	arr.push(callbacks);
};
CacheSystem.prototype.xhrq_succ=function(key,callbacks){
	// pass exactly same 'callbacks' when 'xhrq_regist'
	
	if(this.get(key)===undef) return; // not to be cached yet
	
	let arr=this.__xhrq[key];
	if(!arr) return; // maybe someone successed befoe
	
	// remove 'callbacks'
	let idx=arr.indexOf(callbacks);
	if(idx===-1) return; // wtf
	arr[idx]=arr.back; arr.pop();
	
	// do others a favor: call their useCache
	while(arr.length) arr.pop().useCache(); // one-line code, I'm so happy
	
	// done, bye
	delete this.__xhrq[key];
};
CacheSystem.prototype.xhrq_fail=function(key,callbacks){
	// pass exactly same 'callbacks' when 'xhrq_regist'
	
	let arr=this.__xhrq[key];
	if(!arr) return; // maybe cleared
	
	let idx=arr.indexOf(callbacks);
	if(idx===-1) return; // wtf
	arr[idx]=arr.back; arr.pop();
	if(arr.length) arr.back.send(); // next one, go!
};
CacheSystem.prototype.add=function(key,val){
	// return 1 if add new
	// return 2 if already exist
	// determine if it should be cached according to 'this.__addCnt[src]' >=? 'this.__cacheThreshold'
	if(this.__caches.has(key)) return 2;
	let cntMap=this.__addCnt;
	let c=(cntMap.get(key)|0)+1;
	if(c>=this.__cacheThreshold){
		cntMap.delete(key);
		this.__caches.set(key,val);
		//console.log(cntMap);
		return 1;
	}else cntMap.set(key,c);
};
CacheSystem.prototype.get=function(key){ return this.__caches.get(key); };
CacheSystem.prototype.del=function(key){ this.__caches.delete(key); };
CacheSystem.prototype.set=function(key,val){ this.__caches.set(key,val); return val; };

const makeDummyWindowProto=$dddd$=function f(c,withContents,withCursor){
	let tmp;
	if(c.constructor===Function){
		tmp=c.prototype;
	}else{
		tmp=c._downArrowSprite;
		if(tmp){
			c._downArrowSprite=undefined;
			tmp.visible=false;
			if(tmp.parent) tmp.parent.removeChild(tmp);
		}
		tmp=c._upArrowSprite;
		if(tmp){
			c._upArrowSprite=undefined;
			tmp.visible=false;
			if(tmp.parent) tmp.parent.removeChild(tmp);
		}
		tmp=c._rightArrowSprite;
		if(tmp){
			c._rightArrowSprite=undefined;
			tmp.visible=false;
			if(tmp.parent) tmp.parent.removeChild(tmp);
		}
		tmp=c._leftArrowSprite;
		if(tmp){
			c._leftArrowSprite=undefined;
			tmp.visible=false;
			if(tmp.parent) tmp.parent.removeChild(tmp);
		}
		tmp=c._windowPauseSignSprite;
		if(tmp){
			c._windowPauseSignSprite=undefined;
			tmp.visible=false;
			if(tmp.parent) tmp.parent.removeChild(tmp);
		}
		tmp=c;
		//tmp._upArrowVisible=tmp._downArrowVisible=false;
	}
	const p=tmp;
	if(!withContents){
		p._refreshContents=none;
		p._updateContents=none;
	}
	if(withCursor){
		p._createAllParts=f._createAllParts_cursor;
	}else{
		p._createAllParts=f._createAllParts;
		p._refreshCursor=none;
		p._updateCursor=none;
	}
	p._refreshArrows=none;
	p._refreshPauseSign=none;
	p._updateArrows=none;
	p._updatePauseSign=none;
};
$dddd$._createAllParts = function(){
	this._windowSpriteContainer = new PIXI.Container();
	this._windowBackSprite = new Sprite();
	//this._windowCursorSprite = new Sprite();
	this._windowFrameSprite = new Sprite();
	this._windowContentsSprite = new Sprite();
	//this._downArrowSprite = new Sprite();
	//this._upArrowSprite = new Sprite();
	//this._windowPauseSignSprite = new Sprite();
	this._windowBackSprite.bitmap = new Bitmap(1, 1);
	this._windowBackSprite.alpha = 192 / 255;
	this.addChild(this._windowSpriteContainer);
	this._windowSpriteContainer.addChild(this._windowBackSprite);
	this._windowSpriteContainer.addChild(this._windowFrameSprite);
	//this.addChild(this._windowCursorSprite);
	this.addChild(this._windowContentsSprite);
	//this.addChild(this._downArrowSprite);
	//this.addChild(this._upArrowSprite);
	//this.addChild(this._windowPauseSignSprite);
};
$dddd$._createAllParts_cursor = function(){
	this._windowSpriteContainer = new PIXI.Container();
	this._windowBackSprite = new Sprite();
	this._windowCursorSprite = new Sprite();
	this._windowFrameSprite = new Sprite();
	this._windowContentsSprite = new Sprite();
	//this._downArrowSprite = new Sprite();
	//this._upArrowSprite = new Sprite();
	//this._windowPauseSignSprite = new Sprite();
	this._windowBackSprite.bitmap = new Bitmap(1, 1);
	this._windowBackSprite.alpha = 192 / 255;
	this.addChild(this._windowSpriteContainer);
	this._windowSpriteContainer.addChild(this._windowBackSprite);
	this._windowSpriteContainer.addChild(this._windowFrameSprite);
	this.addChild(this._windowCursorSprite);
	this.addChild(this._windowContentsSprite);
	//this.addChild(this._downArrowSprite);
	//this.addChild(this._upArrowSprite);
	//this.addChild(this._windowPauseSignSprite);
};

$rrrr$=$dddd$=$aaaa$=undef;
