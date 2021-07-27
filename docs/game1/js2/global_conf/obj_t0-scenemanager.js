"use strict";

// after rpg_*, before obj-t
// SceneManager

if(!window.objs) window.objs={};

// manager

// - SceneManager
$aaaa$=SceneManager;
$aaaa$._apps=()=>{SceneManager.push(Scene_Apps);};
$aaaa$._usrswitch=()=>{SceneManager.push(Scene_UserSwitch);};
$aaaa$._feedback=()=>{SceneManager.push(Scene_Feedback);};
$aaaa$._savelocal=()=>{SceneManager.push(Scene_SaveLocal);};
$aaaa$._saveopts=()=>{SceneManager.push(Scene_SaveOpts);};
$aaaa$._saveonline=()=>{SceneManager.push(Scene_SaveOnline);};
$rrrr$=$aaaa$.catchException;
$dddd$=$aaaa$.catchException=function f(e){
	//if(objs.isDev) debugger; // not very useful though
	if(objs.isDev) return f.ori.call(this,e);
	Graphics.printError('An error occurred');
	AudioManager.stopAll();
	this.stop();
}; $dddd$.ori=$rrrr$;
$aaaa$._defaultWidth  = _global_conf["default width"]; // @global_conf/obj_h.js
$aaaa$._defaultHeight = _global_conf["default height"]; // @global_conf/obj_h.js
$aaaa$._screenWidth  = SceneManager._defaultWidth; // refer by Graphics // set by plugin
$aaaa$._screenHeight = SceneManager._defaultHeight; // refer by Graphics // set by plugin
$aaaa$._boxWidth     = SceneManager._defaultWidth; // refer by Graphics // no use? // set by plugin
$aaaa$._boxHeight    = SceneManager._defaultHeight; // refer by Graphics // no use? // set by plugin
$dddd$=$aaaa$.preloadMedia=function f(sceneClass){
	f.load(f.list.any);
	f.load(f.list[sceneClass&&sceneClass.name]);
};
$dddd$.list={
	Scene_Map:{
		img:[ ["ani","Fire2"], ["ani","Slash"], ],
		audio:[ ["se","Fire2"], ["se","Slash1"], ],
	},
	Scene_Menu:{
		img:[],
		audio:[ ["se","Equip1"], ],
	},
	any:{
		img:[],
		audio:[ 
			["se","Load"], ["se","Save"], ["se","Item3"], 
			// ["se","Door1"], ["se","Jump1"], ["se","Fall"], ["se","Blow3"], 
		],
	},
};
$dddd$.load=function f(list){
	if(list){
		for(let _=2;_--;){
			for(let x=0,arr=list.img||[];x!==arr.length;++x){
				let ldr=ImageManager[f.tbl[arr[x][0]]];
				if(ldr) ldr.call(ImageManager,arr[x][1],undefined,f.preload);
				else debug.warn("no such loader:",arr[x][0]);
			}
		}
		for(let _=2;_--;){
			for(let x=0,arr=list.audio||[];x!==arr.length;++x)
				AudioManager.createBuffer(arr[x][0],arr[x][1]);
		}
	}
};
$dddd$.load.tbl={
	ani:"reserveAnimation",
	chr:"reserveCharacter",
	face:"reserveFace",
};
$dddd$.load.preload='preload';
$rrrr$=$aaaa$.updateMain;
$dddd$=$aaaa$.updateMain2=function f(){
	let strted=this._sceneStarted;
	f.ori.call(this);
	if(!strted && this._sceneStarted){
		this.updateMain=f.ori;
		if(this.isMap()) this.getTilemap().children.forEach(f.refreshSpriteChr);
	}
}; $dddd$.ori=$rrrr$;
$dddd$.refreshSpriteChr=x=>x.bitmap&&x.bitmap._args&&x._refresh&&x._refresh();
/* test destruct
flatChild=obj=>{
	const rtv=obj.children.map(x=>flatChild(x)).flat();
	if(rtv){ rtv.push(obj); return rtv; }
	else return [obj];
};
window.s=new Set(flatChild(SceneManager._scene));
// @line:1: PIXI.Container.prototype.destructor:
//  window.s&&window.s.delete(this)&&0
*/
$aaaa$.changeScene=function(forced){
	if (forced||this.isSceneChanging() && !this.isCurrentSceneBusy()) {
		if(this._scene){
			//const c=this._scene.children.slice(); // TODO: used when a scene delete child in 'terminate'
			this._scene.terminate();
			this._scene.detachReservation();
			//if(c&&c.length) for(let x=0;x!==c.length;++x) if(c[x].destructor) c[x].destructor();
			this._scene.destructor();
			this._previousClass = this._scene.constructor;
		}
		this._scene = this._nextScene;
		if(this._scene){
			this._scene._needRefreshes=new Set();
			this._scene.attachReservation();
			this._scene.create();
			this._nextScene = null;
			this._sceneStarted = false;
			this.onSceneCreate();
		}
		if (this._exiting) {
			this.terminate();
		}
	}
};
$rrrr$=$aaaa$.renderScene;
$dddd$=$aaaa$.renderScene=function f(){
	{
		const set=this._scene._needRefreshes;
		set.forEach(f.forEach);
		set.clear();
	}
	f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$dddd$.forEach=sp=>sp.parent&&sp.refresh_do();
$aaaa$.addRefresh=function(sp){
	this._scene._needRefreshes.add(sp);
};
$aaaa$.delRefresh=function(sp){
	this._scene._needRefreshes.delete(sp);
};
$rrrr$=$aaaa$.resume;
$dddd$=$aaaa$.resume=function f(){
	if(this._resuming) return;
	this._resuming=true;
	if(this._pauseInfo&&this._pauseInfo.paused){
		if(Date.now()-this._pauseInfo.timestamp<111){
			this._resuming=false;
			return;
		}
		TouchInput.clear();
		this._pauseToResume();
	}
	f.ori.call(this);
	this._resuming=false;
}; $dddd$.ori=$rrrr$;
$dddd$=$aaaa$.pause=function f(){
	if(this._stopped) return;
	this._stopped=true;
	if(!this._pauseInfo) this._pauseInfo={};
	let info=this._pauseInfo;
	info.timestamp=Date.now();
	let bgm=AudioManager.saveBgm(info.bgm); if(!info.bgm) info.bgm=bgm;
	let bgs=AudioManager.saveBgs(info.bgs); if(!info.bgs) info.bgs=bgs;
	if(!info.bgmp) info.bgmp=AudioManager.savePitch_bgm();
	if(!info.bgsp) info.bgsp=AudioManager.savePitch_bgs();
	AudioManager.stopAll();
	//let msg=info.msg;
	if(!info.msg){
		info.msg=d.ce("div")
			.ac(d.ce("div").at("Now paused."))
			.ac(d.ce("div").at("Click the button in the top-left corner of the screen to resume."));
	}
	info.msg.sa("class","msg");
	let btn=info.btn;
	if(!btn){
		btn=info.btn=d.ce("button").ac(d.ce("div").at("resume"));
	}
	btn.sa("class","");
	let sty=btn.style;
	if(!btn.ref){
		btn.ref=this;
		sty.position="absolute";
		sty.zIndex=1023;
		sty.margin="11px";
		d.ge("UpperDiv").ac(info.msg);
		d.body.ac(btn);
	}
	btn.onclick=f.btnResume; // cleared (=undef, will be (auto) converted to null) after resumed
	
	info.paused=true; // done pausing
};
$dddd$.btnResume=function(){ this.ref.resume(); };
$aaaa$._pauseToResume=function(){
	let info=this._pauseInfo;
	info.btn.onclick=undefined;
	info.btn.sa("class","none");
	info.msg.sa("class","none");
	AudioManager.replayBgm(info.bgm); info.bgm=undefined;
	AudioManager.replayBgs(info.bgs); info.bgs=undefined;
	if(info.bgmp){
		AudioManager.playBgm(info.bgmp,info.bgmp.pos);
		info.bgmp=undefined;
	}
	if(info.bgsp){
		AudioManager.playBgs(info.bgsp,info.bgsp.pos);
		info.bgsp=undefined;
	}
	info.paused=false;
};
$rrrr$=$aaaa$.update;
$dddd$=$aaaa$.update=function f(){
	//debug.log('SceneManager.update');
	//if(this._stopped) return;
	//if(0)
	{
		const now=Date.now(),tmp=this._lastTime+f.delayMs;
		if(now<tmp) return this.requestUpdate();
		this._lastTime=tmp||0;
		if(this._lastTime+64<now) this._lastTime=now;
	}
	if(!( _global_conf.halfFps 
		|| !f.tbl.has(this._scene&&this._scene.constructor) 
		|| (this.isMap()&&$dataMap&&$dataMap.meta.halfFps)
	) || (this._half_do^=1)) return f.ori.call(this);
	else{
		++Graphics.frameCount;
		return this.requestUpdate();
	}
}; $dddd$.ori=$rrrr$;
$tttt$=$dddd$.tbl=new Set([Scene_Battle,Scene_Map]); // fullFpsScs
$dddd$.delayMs=(~~(1000/60)); // min delay
$aaaa$.isMap=function(){return this._scene && this._scene.constructor===Scene_Map};
$aaaa$.isBattle=function(){return this._scene && this._scene.constructor===Scene_Battle};
$dddd$=$aaaa$.isBattleOrMap=function f(){return this._scene && f.tbl.has(this._scene.constructor)};
$dddd$.tbl=$tttt$;
$tttt$=undefined;
$aaaa$.getTilemap=function(){
	let sc=this._scene; if(sc&&sc.constructor===Scene_Map) return sc._spriteset._tilemap;
};
$aaaa$._alphas=[];
$aaaa$.pushAlpha=function(a){this._alphas.push(this._scene.alpha);this._scene.alpha=a;};
$aaaa$.popAlpha=function(){this._scene.alpha=this._alphas.pop();};
$rrrr$=$aaaa$.tickStart;
$dddd$=$aaaa$.tickStart=function f(){
	//debug.log2('SceneManager.tickStart');
	this.lastTickTime=Date.now();
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.tickEnd;
$dddd$=$aaaa$.tickEnd=function f(){
	f.ori.call(this);
	if($gameParty && $gameParty._items[78]){
		let color=$dataCustom.textcolor;
		if(this._scene.constructor===Scene_Gameover && !this._scene.popped){
			this._scene.popped=true;
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("那就乖乖看code",{t_remained:1.9e4+x,align:'center'}));
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("什麼?你說你已經學了?",{t_remained:1.6e4+x,align:'center'}));
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("乖乖去學javascript啦",{t_remained:1.3e4+x,align:'center'}));
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("死於\\RGB["+color.item+"]"+$dataItems[78].name+"\\RGB["+color.default+"]的詛咒",{t_remained:1e4+x,align:'center'}));
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("再隨便\\RGB["+color.keyword+"]"+"呼叫\\RGB["+color.default+"]不明函式啊",{t_remained:1e3+x,align:'center'}));
			return;
		}
		else if(this.isMap()){
			$gamePlayer.adjDecRate('hp',0.0001,1);
			$gameMessage.popup("被\\item[78]詛咒了");
			return;
		}
	}
	if($dataMap && $dataMap.gameoverMsgs && this._scene.constructor===Scene_Gameover && !this._scene.popped){
		this._scene.popped=true;
		for(let x=0,arr=$dataMap.gameoverMsgs;x!==arr.length;++x) this._scene.addChild(new Window_CustomPopupMsg(arr[x][0],arr[x][1]));
		return;
	}
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.goto;
$dddd$=$aaaa$.goto=function f(sceneClass){
	//debug.log('SceneManager.goto');
	this.preloadMedia(sceneClass);
	const sc=this._scene;
	if(!window['/tmp/'].clearedWhenNewScene || sc && sc.constructor!==sceneClass) window['/tmp/'].clearedWhenNewScene={};
	f.ori.call(this,sceneClass);
	if(0&& debug.isdebug() && screenShots && sc && sceneClass!==Scene_Base){
		if(sc) debug.log(2,this._scene.constructor);
		screenShots[sc.constructor.name]=d.ge("GameCanvas").toDataURL();
	}
	if(sceneClass===Scene_Gameover && sc.constructor===Scene_Map){
		// Scene_Map -> Scene_Gameover
		let p=$gamePlayer; $dataMap.data[$gameMap.xy2idx(p.x,p.y,3)]=599;
	}
	let foo=window['/tmp/'].nextSceneCallback;
	if(foo&&foo.constructor===Function) foo();
}; $dddd$.ori=$rrrr$;
if(!$aaaa$.refresh) $aaaa$.refresh=function(){
	this.push(Scene_Base); this.pop();
};
$aaaa$.addWindowB=function(w,noblocking,idx){
	if(this.isBattleOrMap()) return $gameMessage.addWindow(w);
	// for Scene_Item , Scene_Skill , etc.
	let wl=this._scene._windowLayer;
	if(!noblocking){
		let arr=[],ws=[].concat(wl.children); arr.length=ws.length;
		let r=w.processHandling;
		w.processHandling=()=>{
			if(this.parent===null) return;
			if(arr[0]===undefined){
				for(let x=0;x!==arr.length;++x) arr[x]=ws[x].active;
				for(let x=0;x!==arr.length;++x) ws[x].active=false;
			}
			else delete w.processHandling;
			//r.apply(w,arguments);
		};
		w.setHandler('cancel',()=>{
			w.parent.removeChild(w);
			for(let x=0;x!==arr.length;++x) if(ws[x].parent) ws[x].active=arr[x];
		});
	}
	if(noblocking || idx) wl.addChildAt(w,idx);
	else wl.addChild(w);
};
$aaaa$.addTextInput=function(obj,key,txtdetail,clearDst){
	txtdetail=txtdetail||{};
	// txtdetail: {title:"",init:(o,k)=>{},apply:(input.value)=>{},valid:(input.value)=>{},final:(o,k)=>{}}
	// valid(input.value) && o[k]=apply(input.value) && final(o,k)
	let self=this;
	if(clearDst) delete obj[key];
// TODO: when pressing 'ok', message will not go next
	let w=new Window_CustomTextInput(obj,key,txtdetail);
	if(this.isBattleOrMap()){
		let mw=this._scene._messageWindow,f=()=>{
			delete w.destructor;
			w.destructor();
			mw.updateInput();
		};
		w.destructor=function(){
			mw.pause=false;
			mw.terminateMessage();
			delete this.destructor;
			this.destructor();
		};
	}
	this.addWindowB(w);
};
$rrrr$=$aaaa$.onKeyDown;
$dddd$=$aaaa$.onKeyDown=function f(event){
	//debug.keydown('SceneManager.onKeyDown');
	//debug.keydown('',event.keyCode,Input._currentState);
	if(debug.iskeydown()){
		let p=$gamePlayer;
		console.log(p.x,p.y);
	}
	if(debug.isdepress() && SceneManager.isMap() && !$gameMessage.isBusy()){ switch(event.keyCode){
		default: break;
		case "Q".charCodeAt(): if($gamePlayer && !$gamePlayer._transferring && $gameMap && SceneManager.isMap()){
			let p=$gamePlayer;
			if(p._x===p._realX && p._y===p._realY ){
				p.moveDiagonally(0,0);
				let dd=p._direction-5,d2=dd*dd;
				p._x+=(d2===1)*dd;
				p._y+=(d2===9)*(1-((0<dd)<<1));
				//p._x=$gameMap.roundX(p._x);
				//p._y=$gameMap.roundY(p._y);
			}
		}break;
		case "R".charCodeAt(): if($gameMap&&$dataMap){
			$gameMap.events().filter(x=>x.event().note==="init").forEach((evt)=>{
				evt.ssStateSet("A",1);
				evt.ssStateSet("B",1);
				evt.ssStateSet("C",1);
				evt.ssStateSet("D",1);
			});
			$gameMessage.popup("init events' switches cleared");
		}break;
		case "C".charCodeAt(): {
			let key='plantId-'+$gameMap._tilesetId,ch=0;
			let evt=$dataMap.events[ch+=$dataMap.templateStrt+($gamePlayer[key]^=0)];
			if(!evt||evt.isChild) break;
			//let lastDir=$gamePlayer._direction;
			//$gamePlayer._direction-=5; $gamePlayer._direction*=-1; $gamePlayer._direction+=5;
			let xy=$gamePlayer.frontPos(); xy={x:$gamePlayer.x,y:$gamePlayer.y};
			//$gamePlayer._direction=lastDir;
			switch($gamePlayer._direction){
			default: break;
			case 2:{
				let oy=Number($dataMap.events[ch].meta.occupiedy);
				if(!isNaN(oy)) xy.y-=oy;
			}break;
			case 4:{
				let ox=Number($dataMap.events[ch].meta.occupiedx);
				if(!isNaN(ox)) xy.x-=ox;
			}break;
			case 6: // bottom-left corner, thus no needs
			break;
			case 8: // bottom-left corner, thus no needs
			break;
			}
			$gameMessage.popup("+"+$gameMap.cpevt(ch,xy.x,xy.y,1,1,1,["B"])+"");
		}break;
		case "V".charCodeAt(): {
			let key='plantId-'+$gameMap._tilesetId;
			$gamePlayer[key]^=0;
			let ch=$dataMap.templateStrt+($gamePlayer[key]^0)+1,evtds=$dataMap.events,len=evtds.length;
			for(let x=len-$dataMap.templateStrt;x--;++ch){
				if(ch===len) ch=ch-len+$dataMap.templateStrt;
				let evt=evtds[ch];
				if(!evt||evt.isChild||evt.note==="init") continue;
				let tmp=ch-$dataMap.templateStrt;
				$gamePlayer[key]=tmp;
				$gameMessage.popup(tmp.toString());
				break;
			}
		}break;
		case "B".charCodeAt(): {
			$gameParty.burnAuth=$gameMap.parents().back;
			if($gameParty.burnLv<11) $gameParty.burnLv=11;
			if(!$gameParty._items[55]) $gameParty.gainItem($dataItems[55],1);
			let tmparr=[];
			for(let x=0,arr=$gameMap._events;x!==arr.length;++x){ let evt=arr[x];
				if(evt&&evt._erased===false&&typeof evt._eventId==='string')
					tmparr.push([evt.dist2($gamePlayer),evt]);
			}
			let h=new Heap((b,a)=>a[0]-b[0],tmparr);
			while(h.length){
				h.top[1].start();
				h.pop();
			}
		}break;
		// print info
		case "T".charCodeAt(): if($gamePlayer && $gameMap){ // tiles
			let p=$gamePlayer,mp=$gameMap,s=$dataTilesets&&$dataTilesets[$dataMap&&$dataMap.tilesetId]||[];
			if(!mp.isValid(p.x,p.y)) return;
			if(s) s=s.flags||[];
			let msgs=[];
			for(let lv=6;lv--;){
				let t=$dataMap.data[mp.xy2idx(p.x,p.y,lv)];
				msgs.push(t+" ("+(s[t]||0).toString(2).padZero(12)+")");
				//$gameMessage.popup(lv+": ");
			}
			let maxLen=msgs.map(x=>x.length).sort().back;
			msgs.forEach( (e,lv_)=>$gameMessage.popup(5-lv_+": "+e.padStart(maxLen)) );
		}break;
		case "I".charCodeAt(): { // player x,y
			let p=$gamePlayer;
			$gameMessage.popup($gameMap._mapId+" : "+"("+p.x+','+p.y+")");
			let q=$gameMap.eventsXyRef();
			$gameMessage.popup("evtqueue.length : "+q.length);
			$gameMessage.popup("first id : "+(q.front&&q.front._eventId));
			window.q=q;
			window.evt=$gameMap._events[(q.front&&q.front._eventId)];
			console.log(q);
		}break;
		case "E".charCodeAt(): if($gameMap){ // _events.length
			let mp=$gameMap;
			$gameMessage.popup("_events.length = "+mp._events.length);
			$gameMessage.popup("templateStrt = "+$dataMap.templateStrt);
			$gameMessage.popup("#stringIdEvts: "+mp._events.filter(x=>x&&typeof x._eventId==='string').length);
		}break;
		case "F".charCodeAt(): if(SceneManager.isMap()){ // _events.length
			const f=window.editMap;
			if(f&&f.constructor===Function){
				f();
				$gameMessage.popup("exec f");
			}
		}break;
	}}
	if(event.keyCode===80){ // "P"
		if(this._stopped){
			if(!document.activeElement.alwaysPause) this.resume();
		}else if(!$gameTemp||!$gameTemp._inputting) this.pause();
	}
	return f.ori.call(this,event);
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;


// --- --- BEG debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---



$rrrr$=$dddd$=$aaaa$=undef;
// --- --- END debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

if(objs.isDev) console.log("obj_t0-scenemanager");
