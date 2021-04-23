"use strict";

if(!window.objs) window.objs={};

setShorthand(window);

$dddd$=String.prototype.toId=function f(){
	let tmp=this.match(f.regex);
	return (tmp||undefined)&&Number(tmp[1]);
};
$dddd$.regex=/^([0-9]+)(-[0-9A-Z_a-z]+)?$/;
Number.prototype.toId=function(){ return this.valueOf(); };
Number.prototype.sum=function(n,p){
	p=p||1;
	return (~~((this.valueOf()+sum)*p+0.5))/p;
};
Number.prototype.subId=()=>0;
$dddd$=String.prototype.subId=function f(){
	let tmp=this.match(f.regex);
	return (tmp||undefined)&&Number(tmp[3]);
};
$dddd$.regex=/^([0-9]+)(-([0-9A-Z_a-z]+))?$/;
$aaaa$=function Number_muls(num,kargs){
	kargs=kargs||{};
	this.setSplit(kargs.split);
	this._data=[num||1];
	this._limB=[];
	this._limS=[];
	this._zero=(num===0)|0;
};
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype.reset=function(num,kargs){
	kargs=kargs||{};
	this.setSplit(kargs.split);
	this._data.length=0;
	this._data.push(num||1);
	this._limB.length=0;
	this._limS.length=0;
	this._zero=(num===0)|0;
};
$aaaa$.prototype.copy=function(){
	const rtv=new this.constructor();
	rtv._split_min=this._split_min;
	rtv._split_max=this._split_max;
	rtv._data=this._data.slice();
	rtv._limB=this._limB.slice();
	rtv._limS=this._limS.slice();
	rtv._zero=this._zero;
	return rtv;
};
$aaaa$.prototype._inv_arr=function(arr){
	for(let x=0;x!==arr.length;++x) arr[x]=1/arr[x];
};
$aaaa$.prototype.inv=function(){
	{ const tmp=this._limB; this._limB=this._limS; this._limS=tmp; }
	this._inv_arr(this._data);
	this._inv_arr(this._limB);
	this._inv_arr(this._limS);
	this._zero=-this._zero;
	this.sortData();
	return this;
};
$aaaa$.prototype.valueOf=function(){
	if(this._zero) return this._zero<0?NaN:0;
	let rtv=1;
	const D=this._data,B=this._limB,S=this._limS;
	let dl=0,dh=D.length;
	let b=0,s=0;
	for(;;){
		let un=true;
		let tmp=rtv<0?-rtv:rtv;
		if(tmp<1){
			if(un && b!==B.length){
				un=false;
				rtv*=B[b++];
			}
			if(un && dl<dh){
				un=false;
				rtv*=D[--dh];
			}
			if(un && s!==S.length){
				un=false;
				rtv*=S[s++];
			}
		}else{
			if(un && s!==S.length){
				un=false;
				rtv*=S[s++];
			}
			if(un && dl<dh){
				un=false;
				rtv*=D[dl++];
			}
			if(un && b!==B.length){
				un=false;
				rtv*=B[b++];
			}
		}
		if(un) break;
	}
	return rtv;
};
$aaaa$.prototype.setSplit=function(split){
	if(isNone(split)){
		this._split_min=1e-123;
		this._split_max=1e123;
		return;
	}
	if(split.constructor===Array){
		switch(split.length){
		case 0: return this.setSplit();
		case 1: return this.setSplit(split[0]);
		}
		split=split.map(x=>Math.abs(x)).sortn();
		this._split_min=split[0];
		this._split_max=split.back;
		return;
	}
	this.setSplit();
	split=Math.abs(split);
	if(split<1) this._split_min=split;
	if(split>1) this._split_max=split;
};
$dddd$=$aaaa$.prototype.sortData=function f(){
	this._data.sort(f.cmp);
};
$dddd$.cmp=(a,b)=>(a<0?-a:a)-(b<0?-b:b);
$aaaa$.prototype.mul=function(num){
	if(!num){ this._zero+=num===0; return; }
	if(num.constructor===this.constructor){
		const D=this._data,B=this._limB,S=this._limS;
		for(let dst=D,arr=num._data,x=0;x!==arr.length;++x) dst.push(arr[x]);
		while(B.length && S.length) D.push(B.pop()*S.pop());
		for(let dst=B,arr=num._limB,x=0;x!==arr.length;++x) dst.push(arr[x]);
		for(let dst=S,arr=num._limS,x=0;x!==arr.length;++x) dst.push(arr[x]);
		this.sortData();
		for(let x=0;x+1<D.length;++x){
			const val=D[x]*D.back;
			const tmp=val<0?-val:val;
			if(tmp<this._split_max && tmp>this._split_min){
				D[x]=val;
				D.pop();
			}
		}
		this.sortData();
		this._zero+=num._zero;
		return;
	}
	const nabs=num<0?-num:num;
	if(nabs<1){
		if(this._limB.length){
			let tmp=this._limB.back*=num;
			if(tmp<0) tmp=-tmp;
			if(tmp<this._split_max){
				if(this._data.length>1){
					this._data.back*=this._data[0];
					this._data[0]=this._limB.pop();
				}else this._data.push(this._limB.pop());
			}
		}else{
			let tmp=this._data.back;
			if(tmp<0) tmp=-tmp;
			if(tmp<this._split_min){
				this._limS.push(this._data.back);
				this._data.back=num;
			}else this._data.back*=num;
		}
	}else{
		if(this._limS.length){
			let tmp=this._limS.back*=num;
			if(tmp<0) tmp=-tmp;
			if(tmp>this._split_min){
				if(this._data.length>1){
					const n=this._data.back*=this._data[0];
					this._data[0]=this._limS.pop();
					if(n<this._split_min) this._limS.push(this._data.pop());
					else if(n>this._split_max) this._limB.push(this._data.pop());
				}else this._data.push(this._limS.pop());
			}
		}else{
			let tmp=this._data[0];
			if(tmp<0) tmp=-tmp;
			if(tmp>this._split_max){
				this._limB.push(this._data[0]);
				this._data[0]=num;
			}else this._data[0]*=num;
		}
	}
	if(this._limB.length && this._limS.length){
		this._data.push(this._limB.pop()*this._limS.pop());
	}
	this.sortData();
};
$aaaa$.prototype.divZero=function(){
	--this._zero;
};
Map.prototype.byKey_sum=function(map2,inplace_self){
	let base,rhs,rtv;
	if(inplace_self){ rtv=this; rhs=map2; }
	else{
		if(this.size<map2.size){ rhs=this; base=map2; }
		else{ rhs=map2; base=this; }
		rtv=new Map(base);
	}
	if(rtv.c===undefined) (rtv.c=new Map()).v=0;
	if(rtv.v===undefined) rtv.v=0;
	rtv.v=~~(rtv.v*100+(rtv.v<0?-0.5:0.5));
	rhs.forEach((v,k)=>{
		const v100=~~(v*100+(v<0?-0.5:0.5)); // data source precision is 0.01
		let tmp=rtv.get(k);
		if(tmp){
			rtv.set(k,((~~(tmp*100+(tmp<0?-0.5:0.5)))+v100)/100);
			rtv.c.set(k,rtv.c.get(k)+1);
		}else{
			rtv.set(k,v);
			rtv.c.set(k,1);
		}
		rtv.v+=v100;
		++rtv.c.v;
	});
	rtv.v/=100;
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
	if(rtv.c===undefined) (rtv.c=new Map()).v=0;
	if(rtv.v===undefined) rtv.v=new Number_muls(1);
	rhs.forEach((v,k)=>{
		let tmp=rtv.get(k);
		if(tmp!==undefined){
			tmp.mul(v);
			rtv.c.set(k,rtv.c.get(k)+1);
		}else{
			rtv.set(k,new Number_muls(v));
			rtv.c.set(k,1);
		}
		rtv.v.mul(v);
		++rtv.c.v;
	});
	return rtv;
};
Map.prototype.byKey_del_sum=function(rhs){
	if(!rhs) return;
	const rtv=this;
	rtv.v=~~(rtv.v*100+(rtv.v<0?-0.5:0.5));
	rhs.forEach((v,k)=>{
		const tmp=rtv.get(k);
		if(tmp!==undefined){
			const v100=~~(v*100+(v<0?-0.5:0.5)); // data source precision is 0.01
			rtv.set(k,((~~(tmp*100+(tmp<0?-0.5:0.5)))-v100)/100);
			rtv.v-=v100;
			const n=rtv.c.get(k)-1;
			if(n) rtv.c.set(k,n);
			else{
				rtv.delete(k);
				rtv.c.delete(k);
			}
			--rtv.c.v;
		}
	});
	if(rtv.c.v===0){
		rtv.v=0;
		rtv.clear();
	}else rtv.v/=100;
	return rtv;
};
Map.prototype.byKey_del_mul=function(rhs){
	if(!rhs) return;
	const rtv=this;
	rhs.forEach((v,k)=>{
		const tmp=rtv.get(k);
		if(tmp!==undefined){
			if(v){
				v=1/v;
				tmp.mul(v);
				rtv.v.mul(v);
			}else{
				tmp.divZero();
				rtv.v.divZero();
			}
			const n=rtv.c.get(k)-1;
			if(n) rtv.c.set(k,n);
			else{
				rtv.delete(k);
				rtv.c.delete(k);
			}
			--rtv.c.v;
		}
	});
	if(rtv.c.v===0){
		rtv.v.reset(1);
		rtv.clear();
	}
	return rtv;
};
Map.prototype.byKey2_sum=function(rhs){
	if(!rhs) return;
	const base=this;
	if(base.c===undefined) base.c=0;
	if(base.v===undefined) base.v=0;
	base.v=~~(base.v*100+(base.v<0?-0.5:0.5));
	rhs.forEach((v,k)=>{
		let tmp=base.get(k);
		if(!tmp) base.set(k,tmp=new Map());
		const c=tmp.c&&tmp.c.v||0,val=tmp.v||0;
		tmp.byKey_sum(v,true);
		base.c+=tmp.c.v-c;
		let d=(tmp.v-val)*100;
		d+=d<0?-0.5:0.5;
		base.v+=~~d; // data source precision is 0.01
	});
	base.v/=100;
	return base;
};
Map.prototype.byKey2_mul=function(rhs){
	if(!rhs) return;
	const base=this;
	if(base.c===undefined) base.c=0;
	if(base.v===undefined) base.v=new Number_muls();
	rhs.forEach((v,k)=>{
		let tmp=base.get(k);
		if(!tmp) base.set(k,tmp=new Map());
		const c=tmp.c&&tmp.c.v||0 , val_i=tmp.v===undefined?new Number_muls(1):tmp.v.copy().inv();
		const z=tmp.z||0;
		tmp.byKey_mul(v,true);
		base.c+=tmp.c.v-c;
		base.v.mul(val_i);
		base.v.mul(tmp.v);
	});
	return base;
};
Map.prototype.byKey2_del_sum=function(rhs){
	if(!rhs) return;
	const base=this;
	base.v=~~(base.v*100+(base.v<0?-0.5:0.5));
	rhs.forEach((v,k)=>{
		const tmp=base.get(k);
		if(tmp){
			const c=tmp.c.v,val=tmp.v;
			tmp.byKey_del_sum(v);
			base.c+=tmp.c.v-c;
			let d=(tmp.v-val)*100;
			d+=d<0?-0.5:0.5;
			base.v+=~~d; // data source precision is 0.01
			if(!tmp.c.v) base.delete(k);
		}
	});
	base.v/=100;
	return base;
};
Map.prototype.byKey2_del_mul=function(rhs){
	if(!rhs) return;
	const base=this;
	rhs.forEach((v,k)=>{
		const tmp=base.get(k);
		if(tmp){
			const c=tmp.c.v,val_i=tmp.v.copy().inv(),z=tmp.z;
			tmp.byKey_del_mul(v);
			base.c+=tmp.c.v-c;
			base.v.mul(val_i);
			base.v.mul(tmp.v);
			if(!tmp.c.v) base.delete(k);
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

//const firebasejs_base='https://www.gstatic.com/firebasejs/8.4.1/';
const firebasejs_base='firebase/8.4.2/';
