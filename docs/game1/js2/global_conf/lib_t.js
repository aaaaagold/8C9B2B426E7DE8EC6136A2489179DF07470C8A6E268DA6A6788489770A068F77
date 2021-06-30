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

if(typeof isGame!=='undefined'){
	window.rpgskills=objs.rpgskills={};
	addScript("js2/rpgevents/main.js");
	addScript("js2/rpgquests/main.js");
	addScript("js2/rpgskills/main.js");
}

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
	dmgPopMaxPerBtlr: {
		get:function(){
			let key='_dmgPopMaxPerBtlr';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_dmgPopMaxPerBtlr';
			if($dataMap) return $gameSystem._usr[key]=rhs;
			else{
				window['/tmp/'].chConfig=1;
				return ConfigManager[key]=rhs;
			}
		},
	configurable: false},
	chasePopAfterFrame: {
		get:function(){
			let key='_chasePopAfterFrame';
			return ($gameSystem._usr && $gameSystem._usr[key]!==undef)?$gameSystem._usr[key]:ConfigManager[key];
		},set:function(rhs){
			let key='_chasePopAfterFrame';
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
	configurable: false},
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

objs.addOthScript=(url,callback_onloaded)=>{
	const f=callback_onloaded;
	const scr=d.ce('script');
	scr.onload=function(){
		scr.onload=null;
		if(f&&f.constructor===Function) f();
	};
	scr.onerror=function(e){
		scr.onerror=null;
		if(f&&f.constructor===Function) f({err:e});
	};
	d.body.ac(scr.sa('src',url));
};

{ // TODO
	const sh=objs.firebase={}; // firebase_shell
	Object.defineProperties(sh,{
		id:{
			set:rhs=>rhs,
			get:()=>uid,
		}
	});
	let i=0,isConnected=0,uid,onadded,oninited;
	const c={aes:aes,sha256:sha256},ck='clients',postsPath="posts",jss=[
		"firebase-app.js",
		"firebase-auth.js",
		"firebase-database.js",
	],f=arg=>{
		if(arg){
			if(arg.err){
				--i;
				sh.init=f;
				return;
			}
			if('onadded'  in arg) onadded  =arg.onadded;
			if('oninited' in arg) oninited =arg.oninited;
		}
		if(!(jss.length>=i)) return;
		sh.init=none;
		if(i===jss.length){ ++i;
			sh.init=f;
			sh.ref=firebase; delete window.firebase;
			try{
				const k=c.sha256(objs.origin||location.origin,'words');
				if(k.length>8) k.length=8;
				const src= "23 C1 F8 8B D6 CB 1E 92 4A 80 A8 EF 10 2A 54 A4 91 1D 51 DA 7B BA 41 D3 C1 B1 A8 AF B3 BD D6 CC 85 F4 17 D8 C9 04 DF 38 E6 8B 9E 12 7C DD 13 EE E2 4F 0C 23 E4 A4 B3 4A E2 94 83 84 3D A2 B3 13 46 95 0A C9 B1 15 67 F6 DB F9 20 A6 CC BC 6B 92 F2 3C C3 FE 80 75 20 9F BE 4D 89 FC 6B 43 31 2D B3 84 FB D8 3A B7 6C 62 E9 1E 9C 9B C2 65 B3 0B 8C 3A CC 38 98 3C 3A 7D CE F2 04 59 4F 2F 6A 05 7E 34 51 81 7B 92 5B ED FA B8 1B 50 3E 9D AB 27 CA 81 61 FE 31 14 2A 2B FC 5E 13 79 C5 91 96 CA 03 57 53 15 22 25 7D E2 F0 83 35 E3 C4 95 9A FB 8E 5A 75 C9 80 E0 3B 04 0C 6E 22 99 B0 D2 54 B2 8A E4 7A 24 A9 6D 00 73 DC 2D E2 8C D3 05 B0 00 E1 3C 9B 7A CC 7E 90 E8 2F C8 7B EA 0D BD 2A B3 D4 3B 34 3F 9A 3B BD D4 51 33 5D 74 0F B4 92 9D 36 A6 37 54 BD F1 18 20 7E 0C 3F DB 61 A6 91 A6 C3 57 B7 9A 8D 65 AE E0 17 9F 8E 6E 5B 96 DF D7 84 98 60 50 D5 96 67 BD 67 E7 48 1B 90 E2 81 07 14 5C C3 7C B9 28 B0 E7 19 91 35 40 EC 90 03 B2 94 3D 45 9C 7E C6 FF 61 2F 66 83 4C 8C D1 97 E2" 
					.split(' ').map(x=>parseInt(x,16));
				const conf=JSON.parse(c.aes(src,k,1));
				sh.ref.initializeApp(conf);
				sh.db=sh.ref.database();
				sh.db.ref(postsPath).on('child_added',()=>sh.getMsg(onadded,1));
			}catch(e){
				--i;
			}
			sh.conn(oninited);
		}else objs.addOthScript(firebasejs_base+jss[i++],f);
	};
	sh.init=f;
	sh.conn=f=>{
		if(isConnected || !(i>jss.length)) return;
		isConnected=1;
		if(uid){
			sh.db.goOnline();
			uid=sh.ref.auth().getUid();
			const cr=sh.db.ref(ck+'/'+uid);
			cr.onDisconnect().remove();
			cr.set({t:sh.joinTime});
			if(f&&f.constructor===Function) f();
		}else{ sh.ref.auth().signInAnonymously().then(t=>{
				uid=t.user.uid;
				const p=ck+'/'+uid;
				const cr=sh.db.ref(p);
				cr.onDisconnect().remove();
				cr.set({t:sh.ref.database.ServerValue.TIMESTAMP}).then(()=>sh.db.ref(p).get().then(t=>{
					sh.joinTime=t.toJSON().t;
					if(f&&f.constructor===Function) f();
				}));
		}); }
	};
	sh.dconn=()=>{
		if(!isConnected || !(i>jss.length)) return;
		isConnected=0;
		sh.db.goOffline();
	};
	sh.isconn=()=>isConnected;
	// https://firebase.google.com/docs/database/web/read-and-write#atomic_server-side_increments
	sh.getLoc=f_forEach=>{
		if(!isConnected || !(i>jss.length)) return 1;
		const f=f_forEach;
		if(f&&f.constructor===Function){ sh.db.ref(ck).get().then(t=>{
			t.forEach(f);
		}); }
	};
	sh.postLoc=(f,plyr)=>{
		if(!isConnected || !uid || !(i>jss.length)) return 1;
		const update={
			x: plyr.x,
			y: plyr.y,
			ci: plyr.characterIndex(),
			cn: plyr.characterName(),
			sp: plyr.realMoveSpeed(),
			srl: sh.ref.database.ServerValue.increment(1),
		};
		sh.db.ref(ck+'/'+uid).update(update).then(f);
	};
	sh.getMsg=(f_forEach,n)=>{
		if(!isConnected || !(i>jss.length)) return 1;
		if(n===undefined) n=3;
		const f=f_forEach;
		if(f&&f.constructor===Function){ sh.db.ref(postsPath).orderByChild('t').limitToLast(n).get().then(t=>{
			t.forEach(f);
		}); }
	};
	sh.postMsg=(f,msg,chatName)=>{
		if(!isConnected || !uid || !(i>jss.length)) return 1;
		const update={};
		const list=sh.db.ref(postsPath);
		const c=list.push();
		c.onDisconnect().remove();
		c.set({
			d:msg,
			n:chatName,
			t:sh.ref.database.ServerValue.TIMESTAMP,
		}).then(f);
	};
	if(geturlargs('online')) f();
}
