"use strict";

String.prototype.toId=function(){
	let tmp=this.match(/^([0-9]+)(-[0-9A-Z_a-z]+)?$/);
	return (tmp||undef)&&Number(tmp[1]);
};

const addScript=(src)=>{
	let t=document.createElement("script");
	t.setAttribute("type","text/javascript");
	if(debug.isdebug()){
		let q=src.indexOf("?");
		src+=(q===-1?"?":"&")+new Date().getTime();
	}
	t.setAttribute("src",src);
	document.head.appendChild(t);
};

const dialog=(txtarr,windowSetting,clear=true)=>{
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

const CacheSystem=function CacheSystem() {
    this.initialize.apply(this, arguments);
}
CacheSystem.prototype.initialize = function(){
	let threshold=arguments[0]||1;
	this.__cacheThreshold=threshold;
	this.__caches={};
	this.__addCnt={};
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
	if(this.__caches[key]!==undefined) return 2;
	let cnt=this.__addCnt; cnt[key]|=0; ++cnt[key];
	if(cnt[key]>=this.__cacheThreshold){
		delete cnt[key];
		this.__caches[key]=val;
		//console.log(cnt);
		return 1;
	}
};
CacheSystem.prototype.get=function(key){ return this.__caches[key]; };
CacheSystem.prototype.del=function(key){ delete this.__caches[key]; };
CacheSystem.prototype.set=function(key,val){ return this.__caches[key]=val; };
