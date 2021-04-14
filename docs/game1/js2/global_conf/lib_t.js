"use strict";

if(!window.objs) window.objs={};

const copyToClipboard=window.copyToClipboard=s=>{
	const txtin=d.ce("input").sa("class","outofscreen");
	d.body.ac(txtin);
	txtin.value=""+s;
	txtin.select();
	txtin.setSelectionRange(0,txtin.value.length);
	d.execCommand("copy");
	txtin.parentNode.removeChild(txtin);
	if($gameMessage) $gameMessage.popup("已複製: "+s.replace(/\\/g,"\\\\"),1);
};

const addScript=window.addScript=(src)=>{
	let t=document.createElement("script");
	if(objs.addScriptViaSrc) return objs.addScriptViaSrc(t,src);
	t.setAttribute("type","text/javascript");
	let q=src.indexOf("?"); src+=(q===-1?"?":"&");
	if(!objs.testing) src+=new Date().getTime();
	else console.log("add ",src);
	t.setAttribute("src",src);
	document.head.appendChild(t);
};

addScript("js2/rpgevents/main.js");
addScript("js2/rpgquests/main.js");
addScript("js2/rpgskills/main.js");

Object.defineProperties(_global_conf,{ // relative: 'ConfigManager.ConfigOptions'@obj_t
	halfFps: {
		get:function(){
			let key='_halfFps';
			return ($gameSystem && $gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_halfFps';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	noGainMsg: {
		get:function(){
			let key='_noGainMsg';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_noGainMsg';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	noGainHint: {
		get:function(){
			let key='_noGainHint';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_noGainHint';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	noGainSound: {
		get:function(){
			let key='_noGainSound';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_noGainSound';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	lvUpMsg: {
		get:function(){
			let key='_lvUpMsg';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_lvUpMsg';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	lvUpHint: {
		get:function(){
			let key='_lvUpHint';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_lvUpHint';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	noLeaderHp: {
		get:function(){
			let key='_noLeaderHp';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_noLeaderHp';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	noLeaderMp: {
		get:function(){
			let key='_noLeaderMp';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_noLeaderMp';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	flwingMsg: {
		get:function(){
			let key='_flwingMsg';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_flwingMsg';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	noAnimation: {
		get:function(){
			let key='_noAnimation';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_noAnimation';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	noAutotile: {
		get:function(){
			let key='_noAutotile';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_noAutotile';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	simpleTouchMove: {
		get:function(){
			let key='_simpleTouchMove';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_simpleTouchMove';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	useFont: {
		get:function(){
			return $gameSystem && $gameSystem._usr && $gameSystem._usr._useFont || ConfigManager._useFont
				|| "Consolas,'Courier New',Courier,微軟正黑體,標楷體,monospace"; // monospace in firefox cause 新細明體
				// "Consolas,monospace,'Courier New',Courier,微軟正黑體,標楷體";
		}, set:function(rhs){
			let key='_useFont';
			if(this.useFont!==rhs) textWidthCache.length=textWidthCaches.length=0;
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false}
});

_global_conf["get-customActors"] = ()=>{
	if(!$gameParty["custom-addedActor"]) $gameParty["custom-addedActor"]={};
	return $gameParty["custom-addedActor"];
};

objs._addEnum=function(key,arr,func){
	if(this.currMaxEnum===undefined) this.currMaxEnum=511;
	if(this[key]||this[key]===0) ;
	else this[key]=++this.currMaxEnum;
	if(arr) arr[this[key]]=func;
	return this;
};
objs.enums={addEnum:objs._addEnum,currMaxEnum:1};

