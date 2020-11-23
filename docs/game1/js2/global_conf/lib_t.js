"use strict";

if(!window.objs) window.objs={};

const addScript=window.addScript=(src)=>{
	let t=document.createElement("script");
	if(objs.addScriptViaSrc) return objs.addScriptViaSrc(t,src);
	t.setAttribute("type","text/javascript");
	if(debug.isdebug()){
		let q=src.indexOf("?");
		src+=(q===-1?"?":"&")+new Date().getTime();
	}
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
	noAutotile: {
		get:function(){
			let key='_noAutotile';
			return ($gamePlayer && $gamePlayer[key]!==undef)?$gamePlayer[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_noAutotile';
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
