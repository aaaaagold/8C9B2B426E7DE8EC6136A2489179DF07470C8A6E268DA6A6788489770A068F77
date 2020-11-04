"use strict";
// CustomMenu2

// - Scene_CustomMenu2

function Scene_CustomMenu2(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_CustomMenu2;
$aaaa$.prototype = Object.create(Scene_MenuBase.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=none;
$rrrr$=$aaaa$.prototype.create;
$dddd$=$aaaa$.prototype.create = function f() {
	f.ori.call(this);
	this.createOptionsWindow();
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.logSel=function(w){
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key=this.constructor.name;
	if(mh[key]){
		w._lastSelItem=mh[key];
		let lastSelItem=w.lastSelItem();
		if(lastSelItem!==undefined) w._windows[0].select(lastSelItem);
	}else{
		mh[key]=w._lastSelItem;
	}
};
$dddd$=[-1,0]; $dddd$.length=1000000; for(let x=$dddd$.length;--x;) $dddd$[x]=x.toString().length;
$aaaa$.prototype.log10Floor=$dddd$; 
$aaaa$.prototype.toLocalISO=function(tTick){ return new Date(tTick).toLocalISO().replace(/[ ]+$/,''); };
$aaaa$.prototype.mapStep=function(){
	if(1) return {
		x:"0:"+($gameMap.w-1)+":1"+($gameMap.isLoopHorizontal()?":rot":""),
		y:"0:"+($gameMap.h-1)+":1"+($gameMap.isLoopVertical  ()?":rot":"")
	};
	else return {
		x:"0:"+($gameMap.w-1)+":1",
		y:"0:"+($gameMap.h-1)+":1"
	};
};
$aaaa$.prototype.deleteOn0=function(obj,key){if(obj[key]===0) delete obj[key];};
$aaaa$.prototype.loadFileById=function(id,noSound){
	if(DataManager.loadGame(id)){
		if(!noSound) SoundManager.playLoad();
		SceneManager._scene.fadeOutAll();
		//SceneManager._scene.reloadMapIfUpdated();
		Scene_Load.prototype.reloadMapIfUpdated.call({}); // no 'this' inside
		SceneManager.goto(Scene_Map);
	}else if(!noSound) SoundManager.playBuzzer();
};
let Scene_CustomMenu=$aaaa$;
$dddd$=$rrrr$=$aaaa$=undef;

// - Scene_Black

function Scene_Black(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Black;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.create;
$dddd$=$aaaa$.prototype.create=function f(){
	f.ori.call(this);
	this.setBackgroundOpacity(0);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.start;
$dddd$=$aaaa$.prototype.start=function f(){
	f.ori.call(this);
	let tmp=window['/tmp/'],ls=tmp._laterScenes;
	if(ls && ls.length){
		let sc=ls.pop();  ls.pop();
		SceneManager.goto(sc);
	}
}; $dddd$.ori=$rrrr$;
if(!window['/tmp/']) window['/tmp/']={};
if(!window['/tmp/']._laterScenes) window['/tmp/']._laterScenes=[];
$dddd$=$rrrr$=$aaaa$=undef;

// - Scene_OnlineLoadFail

function Scene_OnlineLoadFail(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_OnlineLoadFail;
$aaaa$.prototype = Object.create(Scene_Black.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.create;
$dddd$=$aaaa$.prototype.create=function f(){
	f.ori.call(this);
	this.addChild(new Window_CustomMenu_main(0,0,[
		["讀取失敗",";;func;call",1,()=>{
			$gameSystem.onAfterLoad();
			if(SceneManager._stack.length){
				if(SceneManager._stack.back===Scene_Map){
					$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
					$gamePlayer.requestMapReload();
				}
				SceneManager.pop();
			}
			else SceneManager.goto(Scene_Map);
		}],
	]));
}; $dddd$.ori=$rrrr$;
$dddd$=$rrrr$=$aaaa$=undef;

// - Scene_DebugMenu2

function Scene_DebugMenu2(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_DebugMenu2;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;

$dddd$=$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_DebugMenu2.prototype.createOptionsWindow');
	let lg10f=this.log10Floor;
	let loct=this.toLocalISO;
	let ms=this.mapStep();
	let del0=this.deleteOn0;
	let lf=this.loadFileById;
	let itemMenu=$dataItems
		.filter(x => x!==null&&x.name&&x.name[0]!=='_')
		.map(x=>[x.id+": "+x.name,"$gameParty._items;"+x.id+";real;0::1",1,{final:del0}]);
	let weaponMenu=$dataWeapons
		.filter(x => x!==null&&x.name&&x.name[0]!=='_')
		.map(x=>[x.id+": "+x.name,"$gameParty._weapons;"+x.id+";real;0::1",1,{final:del0}]);
	let armorMenu=$dataArmors
		.filter(x => x!==null&&x.name&&x.name[0]!=='_')
		.map(x=>[x.id+": "+x.name,"$gameParty._armors;"+x.id+";real;0::1",1,{final:del0}]);
	let mapList_setting=(x)=>{
		return [
			["ok",";;func;call",1,()=>{ $gamePlayer.reserveTransfer(x.id,Number(window['/tmp/'].x)^0,Number(window['/tmp/'].y)^0); }],
			["x","window['/tmp/'];x;real;0::1",1],
			["y","window['/tmp/'];y;real;0::1",1],
		];
	};
	let mapList=$dataMapInfos
		.filter(x=>x!==null)
		.map(x=>[x.id+": "+x.name,";;func;list",1,()=>{return mapList_setting(x);$gamePlayer.reserveTransfer(x.id,0,0);}])
	this._window = new Window_CustomMenu_main(0,0,[
		["debug pack",";;func;call", 1, f.debugPack],
		// functions
		["map", ";map;func", 1, [
			["id", "$gameMap;_mapId;real;::", 0],
			["internal name", "$dataMapInfos[$gameMap._mapId];name;text", 0],
			["map width", "$gameMap;w;real", 0],
			["map height", "$gameMap;h;real", 0],
			["original display name", "$dataMap;displayName;text", 0],
			["custom display name", "$gameParty.mapChanges[$gameMap._mapId];name;text;currently no effect on changes", 1],
			["change to other map", ";chMap;func", 1, mapList],
			["change tile at player's location", ";chTile;func;list", 1, ()=>{
				let rtv=[
					["x", "$gamePlayer;x;real;"+ms.x, 0],
					["y", "$gamePlayer;y;real;"+ms.y, 0],
				],ch=function(obj,key){
					// suppose map size is fixed
					if(!$gameParty.mapChanges[$gameMap._mapId]) $gameParty.mapChanges[$gameMap._mapId]={};
					let target=$gameParty.mapChanges[$gameMap._mapId];
					if(!target.tile) target.tile={};
					target.tile[key]=obj[key];
					return;
				};
				for(let lv=0;lv!==6;++lv){
					rtv.push(["lv"+lv+" tile",
						"$gameMap.data();"+$gamePlayer.xy2idx(lv)+";real;0::", 
					1, {final:ch}]);
				}
				return rtv;
			}],
			["change tile in front of player", ";chTile;func;list", 1, ()=>{
				let rtv=[
					["front x", "$gamePlayer;frontx;real;"+ms.x, 0],
					["front y", "$gamePlayer;fronty;real;"+ms.y, 0],
				],ch=function(obj,key){
					// suppose map size is fixed
					if(!$gameParty.mapChanges[$gameMap._mapId]) $gameParty.mapChanges[$gameMap._mapId]={};
					let target=$gameParty.mapChanges[$gameMap._mapId];
					if(!target.tile) target.tile={};
					target.tile[key]=obj[key];
					return;
				};
				for(let lv=0;lv!==6;++lv){
					rtv.push(["lv"+lv+" tile",
						"$gameMap.data();"+$gameMap.xy2idx($gamePlayer.frontx,$gamePlayer.fronty,lv)+";real;0::", 
					1, {final:ch}]);
				}
				return rtv;
			}],
			["apply serial tiles from N = ", "window['/tmp/'];?;real;0::"+(($gameMap.width()-2)*(($gameMap.height()+1)>>1)), 1, {final:function(obj,key){
				if($gameMap.width()<2||$gameMap.height()<2) return;
				obj[key]=parseInt(obj[key]);
				let tmp={},w=$gameMap.width(),h=($gameMap.height()+1)>>1,xs=(w-2)*h;
				for(let tile=obj[key],xs=w-1,y=0;y!==h;++y) for(let x=1;x!==xs;++x) tmp[(y<<1)*w+x]=tile++;
				debug.log(tmp);
				$gameParty.changeMap('tile',tmp);
			}}],
		],],
		["player", ";player;func", 1, [
			["{menu , window} in the game ", ";menu_and_window;func", 1, [
				["next level list init x+=", "Window_CustomMenu_main.prototype;reservedWidthL;real;0::1"],
				["max item list columns", "$gamePlayer;ItemListMaxCol;real;0::1"],
				["custom font-family", "_global_conf;useFont;text;Input a string for font-family. Empty will reset. Non-exist one takes no effect."],
				["clear font width cache",";;func;call",1,()=>{let arr=textWidthCache; arr.length=0; arr.length=65536; alert("cleared");}],
			],],
			["appearance", ";appearance;func", 1, [
				["opacity", "$gamePlayer;_opacity;real;0:255:1"],
				["blend mode", "$gamePlayer;_blendMode;real;0:16:1:rot"],
				["tile id", "$gamePlayer;_tileId;real;0:512:1:rot"],
				["transparent", "$gamePlayer;_transparent"],
				["name", "$gamePlayer;name;text;change name to"],
				["savefile name", "$gamePlayer;savefilename;text;change savefile name to"],
			],],
			["position , direction , movement", ";pos_and_dir;func", 1, [
				["player x", "$gamePlayer;_x;real;"+ms.x],
				["player y", "$gamePlayer;_y;real;"+ms.y],
				["player direction", "$gamePlayer;_direction;real;2:8:2:rot"],
				["front x", "$gamePlayer;frontx;text", 0],
				["front y", "$gamePlayer;fronty;text", 0],
				["diagonal walk", "$gamePlayer;canDiag;bool"],
				["move speed","$gamePlayer;_moveSpeed;real;::1"],
			],],
		],],
		["party", ";party;func", 1, [
			["gold (type:text)", "$gameParty;_gold;text;change gold to",1 ,{
				valid:(x)=>{return x.match(/^[0-9]*$/)!==null;},
				apply:Number,
			}],
			["gold (type:real,+-1000)", "$gameParty;_gold;real;0::1000"],
			["items", ";items;func", 1, itemMenu,],
			["weapons", ";weapons;func", 1, weaponMenu,],
			["armors", ";armors;func", 1, armorMenu,],
			["total steps", "$gameParty;_steps;real;0::1"],
			["$gameParty.ctr", "$gameParty;ctr;real;::1"],
			["$gameParty.burnLv", "$gameParty;burnLv;real;0::1"],
			["$gameParty.slashLv", "$gameParty;slashLv;real;0::1"],
		],],
		["actors", ";actors;func;list", 1, function(){
			let arr=$gameParty._actors,rtv=[];
			for(let x=0;x!==arr.length;++x){
				let a=$gameActors._data[arr[x]];
				let s="$gameActors._data["+arr[x]+"]",getname=()=>{return a._name;};
				rtv.push([getname,";actor"+s+";func", 1, [
					["actor name", s+";_name;text;change name to"],
					["current HP", s+";_hp;real;::10"],
					["current MP", s+";_mp;real;::10"],
					["current TP", s+";_tp;real;::10"],
					["current level", s+";_level;real;1:"+a.maxLevel()+":1"],
					["param+ - HP",    s+"._paramPlus;0;real;0::1"],
					["param+ - MP",    s+"._paramPlus;1;real;0::1"],
					["param+ - Atk",   s+"._paramPlus;2;real;0::1"],
					["param+ - Def",   s+"._paramPlus;3;real;0::1"],
					["param+ - M.Atk", s+"._paramPlus;4;real;0::1"],
					["param+ - M.Def", s+"._paramPlus;5;real;0::1"],
					["param+ - Agi",   s+"._paramPlus;6;real;0::1"],
					["param+ - Luk",   s+"._paramPlus;7;real;0::1"],
				],]);
			}
			return rtv;
		},],
		["greetings (alert())", ";greetings;func", 1, [
			["Hi", ";;func;call", 1, ()=>{alert("Hi");}],
			["Hello", ";;func;call", 1, ()=>{alert("Hello");}],
		],],
		["screen shots", ";screenShots;func;list", 1, ()=>{
			// need to be test on other browsers and versions
			let rtv=[]; for(let i in screenShots){
				let url=screenShots[i],fname="screenshort-"+i+"-"+new Date().getTime();
				rtv.push([ i,";;func;list",1, function(){
					let htmlele=d.ce("a").sa("target","_blank").sa("href",url).sa().ac(d.ce("img").sa("src",url));
					htmlele.download=fname;
					//let htmlele=d.ce("img").sa("src",url); htmlele.onclick=function(){location.href=this.src.replace(/^data:.+;base64,/,"data:application/octet-stream;base64,");};
					_global_conf['UpperDiv'].ac(htmlele);
					let r=this.parent.removeChild;
					let f=this.parent.removeChild=function f(){
						debug.log('cancel');
						f.ori.apply(this,arguments);
						htmlele.parentNode.removeChild(htmlele);
						delete this.removeChild;
					}; f.ori=r;
					return [["If you see this, the image is tranparent!",";;func;call",1,()=>{htmlele.click();}]];
				}]);
			}
			return rtv;
		},],
		["saves", ";saves;func", 1, [
			["max savefiles", "ConfigManager;maxSavefiles;real;0::1",1,{final:()=>{ConfigManager.save();}}],
			["load", ";;func;list", 1,function(){
				let rtv=[],txt=StorageManager.load(0);
				let info=txt&&JSON.parse(txt)||{};
				StorageManager.lastJson_load0=info;
				for(let x=0,xs=DataManager.maxSavefiles()^0,maxNumLen=xs.toString().length;x++!==xs;){
					let f="File "+' '.repeat(maxNumLen-lg10f[x])+x;
					if(!info[x]){ rtv.push([f,";;func",0]); continue; }
					let id=x; rtv.push([f+" "+loct(info[x].timestamp)+" ",
						"DataManager.titleAddName(StorageManager.lastJson_load0["+id+"]);;func;call",
					1,function(){lf(id);}]);
				}
				return rtv;
			},],
			["save", ";;func;list", 1,function(){
				let rtv=[],txt=StorageManager.load(0);
				let info=txt&&JSON.parse(txt)||{};
				StorageManager.lastJson_load0=info;
				for(let x=0,xs=DataManager.maxSavefiles()^0,maxNumLen=xs.toString().length;x++!==xs;){
					let f="File "+' '.repeat(maxNumLen-lg10f[x])+x,id=x;
					rtv.push([function(){
						return f+(info[id]?" "+loct(info[x].timestamp)+" ":"");
					},"DataManager.titleAddName(StorageManager.lastJson_load0["+id+"]||{title:''});;func;call",1,function(){
						$gameSystem.onBeforeSave();
						if(!DataManager.saveGame(id)){ SoundManager.playBuzzer(); return; }
						StorageManager.cleanBackup(id);
						info[id]=JSON.parse(StorageManager.load(0))[id];
						this._parent._windows.back.redrawDiffs();
						debug.log(this._parent._windows.back===this);
						debug(this);
					}]);
				}
				return rtv;
			},],
			["delete", ";;func;list", 1,function(){
				let rtv=[],txt=StorageManager.load(0);
				let info=txt&&JSON.parse(txt)||{};
				StorageManager.lastJson_load0=info;
				for(let x=0,xs=DataManager.maxSavefiles()^0,maxNumLen=xs.toString().length;x++!==xs;){
					let f="File "+' '.repeat(maxNumLen-lg10f[x])+x;
					if(!info[x]){ rtv.push([f,";;func",0]); continue; }
					let id=x; rtv.push([function(){
						return f+(info[id]?" "+loct(info[x].timestamp)+" ":"");
					},"DataManager.titleAddName(StorageManager.lastJson_load0["+id+"]||{title:''});;func;call",1,function(){
						StorageManager.remove(id);
						info[id]=null; StorageManager.save(0,JSON.stringify(info));
						this._list[this._index].enabled=0;
						this.redrawDiffs();
					}]);
				}
				return rtv;
			},],
			["change name", ";;func;list", 1,()=>{
				let rtv=[],txt=StorageManager.load(0);
				let info=txt&&JSON.parse(txt)||{};
				StorageManager.lastJson_load0=info;
				for(let x=0,xs=DataManager.maxSavefiles()^0,maxNumLen=xs.toString().length;x++!==xs;){
					let f="File "+' '.repeat(maxNumLen-lg10f[x])+x;
					if(!info[x]){ rtv.push([f,";;func",0]); continue; }
					let id=x; rtv.push([function(){
						return f+(info[id]?" "+loct(info[x].timestamp)+" ":"");
					},"(StorageManager.lastJson_load0["+id+"]||{name:''});name;text;change save file's name to",1,{ final:function(){
						StorageManager.save(0,JSON.stringify(info)); // this.redrawDiffs(); // is going to pop the window, no needed
					},}]);
				}
				return rtv;
			},],
			["copy", ";;func", 1,()=>{
				
			},],
			["change slot", ";;func", 1,()=>{
				
			},],
		],],
		["other configs",";config;func", 1, [
			
		],],
		["tests",";tests;func", 1, [
			["change front tile to","window;/dev/null;text", 1,{
				valid:(n)=>{},
				apply:(n)=>{}
			}],
			["javascript",";javascript;func", 1,[
				["nul setter obj as 'real'","window;/dev/null;real;::"],
				["window['/tmp/'].? as 'real'","window['/tmp/'];?;real;::"],
			]],
			["menu scroll speed",";menuspeed-scroll;func", 1, (()=>{
				let rtv=[
					["following with several rows",";;func",0],
					["warning if debug console is running",";;func",0],
				];
				for(let x=2;x!==64;++x) rtv.push(["row "+x,";;func",x&2]);
				return rtv;
			})(),],
		],],
		// real
		["player x", "$gamePlayer;_x;real;"+ms.x, 0],
		["player y", "$gamePlayer;_y;real;"+ms.y, 0],
		["player direction", "$gamePlayer;_direction;real;2:8:2:rot", 0],
		// bool
		["diagonal walk", "$gamePlayer;canDiag;bool", 0],
		// multi-level funcs
		//
		["lv1", ";lv1;func", 1, [
			["lv1-1", ";lv1-1;func", 1,[
				["in lv 1-1",";;func"]
			],],
			["lv1-2", ";lv1-2;func", 1,[
				["in lv 1-2",";;func", 0]
			],],
		],],
		["lv2", ";lv2;func", 1, [
			["lv2-1", ";lv2-1;func", 1,[
				["in lv 2-1",";;func", 0]
			],],
			["lv2-2", ";lv2-2;func", 1,[
				["in lv 2-2",";;func"]
			],],
		],],
		// */
		["pause",";;func;call", 1, ()=>{ SceneManager.pause(); }],
	]);
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key='Scene_DebugMenu2';
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$dddd$.debugPack=(notDev)=>{
	let dev=!notDev;
	let p=$gamePlayer;
	if(dev) p._halfFps=1;
	p._noGainMsg=1;
	p._noGainSound=1;
	let pt=$gameParty,itds=$dataItems,armds=$dataArmors,wpnds=$dataWeapons;
	if(dev && SceneManager._scene.constructor!==Scene_DebugMenu2){
		pt.gainItem(itds[78],1);
		return;
	}
	
	pt.gainGold(1e11);
	if(dev) pt.gainItem(itds[32],1); // nooby card
	if(dev) itds.forEach(evt=>{ // quests
		if(!evt||!evt.meta.quest)return;
		pt.gainItem(evt,1);
	});
	let collects=[34,36,37,39,46,47,51,52,53,54,60,98,99,100];
	for(let x=0,arr=collects;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1e3);
	let switches=[58,64,65,66,67,68,70,74,75,80,81,82,83,84];
	if(dev) switches=switches.concat([44,79,]);
	for(let x=0,arr=switches;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1);
	let addons=[76,77,];
	for(let x=0,arr=addons;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1);
	let returns=[42,93,];
	for(let x=0,arr=returns;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1e3);
	let placing=[96,107,108,109,110,111,];
	for(let x=0,arr=placing;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1e4);
	let consume=[23,103,];
	for(let x=0,arr=consume;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1e4);
	
	let rings=[6,12,];
	for(let x=0,arr=rings;x!==arr.length;++x) pt.gainItem(armds[arr[x]],1e1);
	let necklaces=[15,];
	for(let x=0,arr=necklaces;x!==arr.length;++x) pt.gainItem(armds[arr[x]],1e1);
	
	let ws=[16,];
	for(let x=0,arr=ws;x!==arr.length;++x) pt.gainItem(wpnds[arr[x]],1e1);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_DebugMenu2

// - Scene_LoadLocal

function Scene_LoadLocal(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_LoadLocal;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.loadLocalFile=(_window)=>{
	let w=_window,self=this;
	if(!this.htmlele){
		let htmlele=d.ce("input").sa("type","file");
		htmlele.ref=this;
		htmlele.oninput=function(){
			console.log("input");
		};
		htmlele.onchange=function(){
			let self=this;
			debug.log("DOMInput.onchange");
			if(this.files.length===0){
				return;
			}
			$gameMessage.popup($dataCustom.fromLocalSaveLoading,1);
			let reader=this.ref.fileReader;
			if(reader){
				reader.onabort=null;
				reader.abort();
				delete this.ref.fileReader;
			}
			reader=new FileReader();
			reader.onabort=function(){
				$gameMessage.popup($dataCustom.fromLocalSaveLoadingCancel,1);
				delete self.ref.fileReader;
			};
			reader.onerror=function(){
				$gameMessage.popup($dataCustom.fromLocalSaveLoadingErr,1);
				delete self.ref.fileReader;
			};
			reader.onload=function(e){
				let data=e.target.result,t=";base64,";
				let strt=data.indexOf(t);
				data=strt===-1?"":data.slice(strt+t.length);
				try{
					DataManager.loadGame('callback',0,data);
					delete DataManager.onlineOk;
					delete self.ref.fileReader;
				}catch(e){
					SoundManager.playBuzzer();
					$gameMessage.popup($dataCustom.fromLocalSaveLoadingImproper,1);
				}
				self.value=''; // will NOT goto line: 'this.files.length===0' above.
			};
			this.ref.fileReader=reader;
			reader.readAsDataURL(this.files[0]);
		};
		htmlele.onclick=function(){
			//this.value=''; // clear previous selection when 'FileReader.onload'
			let reader=this.ref.fileReader;
		};
		this.htmlele=htmlele;
	}
	if(this.fileReader){
		this.fileReader.onabort=null;
		this.fileReader.abort();
	}
	this.htmlele.click();
};
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_LoadLocal.prototype.createOptionsWindow');
	let self=this;
	let list=[
		[$dataCustom.fromLocalSaveCh,";;func;call",1,()=>{
			self.loadLocalFile(self._window);
			Input.clear();
		}],
	];
	this._window = new Window_CustomMenu_main(0,0,list);
	this._window.setHandler('cancel',()=>{
		if(self.fileReader){
			self.fileReader.abort();
			delete self.fileReader;
		}
		self.popScene();
	});
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_LoadLocal

// - Scene_LoadOnline

function Scene_LoadOnline(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_LoadOnline;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_LoadOnline.prototype.createOptionsWindow');
	this._window = new Window_CustomMenu_main(0,0,[
		["輸入檔案id讀取紀錄"+(window.gasPropagate===undefined?" (未完成載入google apps script)":""),"window['/tmp/'];fileId;text;輸入檔案id",window.gasPropagate!==undefined,{
			title:"輸入檔案id",
			final:(o,k)=>{
				DataManager.loadGame('online',o[k]);
				delete o[k];
			}
		}],
	],{statusWidth:()=>360});
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key='Scene_LoadOnline';
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_LoadOnline

// - Scene_LotteryList
function Scene_LotteryList(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_LotteryList;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_LotteryList.prototype.createOptionsWindow');
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key=this.constructor.name;
	let list=[],lList=rpgevts.item&&rpgevts.item.lotteryList;
	let idx={
		txt:0,
		i:$dataItems,
		a:$dataArmors,
		w:$dataWeapons,
	};
	
	if(lList){ if(lList.length){ for(let x=0,arr=lList;x!==arr.length;++x){
		let n=arr[x];
		let data=idx[n[0]];
		if(data){
			if(data[n[1]]) list.push([data[n[1]].name,"'"+n[2]+"'.valueOf();"+data[n[1]].name+";func;call",1,none]);
		}else{
			// 0:txt
			if(data===0) list.push([n[1],"atob('"+btoa(n[2])+"');"+n[1]+";func;call",1,none]);
		}
	} } }
	
	if(list.length===0) list.push(["清單是空的",";empty;func",0]);
	else list.unshift(["品項","'權重';empty;func",0]);
	this._window = new Window_CustomMenu_main(0,0,list);
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel', this.popScene.bind(this));
	this._window.statusWidth=()=>{return 240;};
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_LotteryList

// - Scene_Apps

function Scene_Apps(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Apps;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_Apps.prototype.createOptionsWindow');
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key=this.constructor.name;
	let list=[];
	
	if($gameParty._apps){
		// enabled menu functions
		let t=$gameParty._apps;
		if(t.quest) list.push([$dataCustom.questMgr,";questMgr;func;call",1, ()=>{SceneManager.push(Scene_Quest);} ]);
		if(t.achievement) list.push([$dataCustom.achievementMgr,";achievement;func;call",1, ()=>{SceneManager.push(Scene_Achievement);} ]);
		if(t.locLog) list.push([$dataCustom.locLogMgr,";locLog;func;call",1, ()=>{SceneManager.push(Scene_LocLog);} ]);
		//if(t.onlineSaves) list.push([$dataCustom.onlineSaveIdMgr,";onlineSaveId;func;call",1, ()=>{SceneManager.push(Scene_OnlineSaves);} ]);
	}
	
	if(list.length===0) list.push(["目前沒有App",";;func",0]);
	this._window = new Window_CustomMenu_main(0,0,list);
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel', this.popScene.bind(this));
	this._window.statusWidth=()=>{return 240;};
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_Apps

// - Scene_Quest

function Scene_Quest(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Quest;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_Quest.prototype.createOptionsWindow');
	let wt=window['/tmp/'];
	let rnkMin=wt.rnkMin,rnkMax=wt.rnkMax,rnkNan=wt.rnkNan;
	delete wt.rnkMin; delete wt.rnkMax; delete wt.rnkNan; 
	this._window = $gameParty.genQuestReportWindow(rnkMin,rnkMax,rnkNan===undefined?true:rnkNan);
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key='Scene_Quest';
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel', this.popScene.bind(this));
	this._window.statusWidth=()=>{return 240;};
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_Quest

// - Scene_Achievement

function Scene_Achievement(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Achievement;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function(){
	let list=[];
	if($gameParty._achievement){ for(let nl2="\n\n",nl4=nl2+nl2,x=0,arr=$gameParty._achievement;x!==arr.length;++x){
		if(!arr[x]) continue;
		let ac=$dataCustom.achievement[x];
		if(!ac||ac.constructor!==Array) continue;
		let txts=[];
		if(ac[3]) txts=ac[3];
		else{
			let re_dbs2sbs=/(^|[^\\])((\\\\)+)/g,rplc=(txt)=>txt.replace(re_dbs2sbs,function(){return (arguments[1]||"")+"\\".repeat(arguments[2].length>>1);});
			txts.push({txt:rplc(ac[0]),sizeRate:2,align:'center',color:$dataCustom.textcolor.achievement});
			if(ac[1]){ txts.push(nl4); txts.push({txt:"獲得方法",sizeRate:1.5,color:$dataCustom.textcolor.default}); txts.push(nl2); txts.push({txt:rplc(ac[1])}); }
			if(ac[2]){ txts.push(nl4); txts.push({txt:rplc(ac[2]),sizeRate:0.75,align:'right'}); }
		}
		list.push([ac[0],";;func;call",1,function(){ this.parent.addWindow({},new Window_CustomTextBoard(txts)); }]);
	}}else list.push(["尚未獲得成就",";;func",0]);
	this._list=new Window_CustomMenu_main(0,0,list);
	this._list.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._list);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_Achievement

// - Scene_LocLog

function Scene_LocLog(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_LocLog;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function(){
	let list=[
		["記錄地點",";save;func;call",1,()=>{
			$gameParty.logLoc_save(); // create $gameParty._locLog
			if(this._saved){
				let arr=$gameParty._locLog,i=arr.length-1;
				if(arr[i].slice(1).equals(arr[i-1].slice(1))){
					arr.pop();
					$gameMessage.popup("該位置已儲存過了",1);
					return;
				}
			}
			this._saved=1;
			$gameMessage.popup("已新增目前位置",1);
		}],
		["前往地點",";load;func;list",1,()=>{
			let rtv=[];
			for(let x=0,arr=$gameParty._locLog||[];x!==arr.length;++x){
				let t=arr[x],i=x;
				rtv.push([t[0],";;func;call",1,()=>{
					$gameTemp.clearedWhenNewMap.transferViaLogloc=1;
					$gameParty.logLoc_load(i);
					SceneManager.push(Scene_Map);
				}]);
			}
			if(rtv.length===0) rtv.push(["無紀錄",";;func",0]);
			return rtv;
		}],
		["重新命名",";name;func;list",1,()=>{
			let rtv=[];
			for(let x=0,arr=$gameParty._locLog||[];x!==arr.length;++x) rtv.push(["原始名稱: "+arr[x][0],"$gameParty._locLog["+x+"];0;text",1]);
			if(rtv.length===0) rtv.push(["無紀錄",";;func",0]);
			return rtv;
		}],
		["刪除地點",";del;func;list",1,()=>{
			let rtv=[];
			for(let x=0,arr=$gameParty._locLog||[];x!==arr.length;++x){
				let i=x;
				rtv.push([()=>arr[i]&&arr[i][0]||"(已刪除)",";;func;call",1,function(){
					if(!arr[i]) return;
					$gameMessage.popup("刪除位置: "+arr[i][0],1);
					arr[i]=null;
					this.redrawDiffs();
				}]);
			}
			if(rtv.length===0) rtv.push(["無紀錄",";;func",0]);
			return rtv;
		},undef,()=>$gameParty._locLog=($gameParty._locLog||[]).filter(x=>x)],
	];
	this._list=new Window_CustomMenu_main(0,0,list);
	this._list.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._list);
	this.logSel(this._list);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_LocLog

// - Scene_OnlineSaves

function Scene_OnlineSaves(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_OnlineSaves;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function(){
	debug.log('Scene_OnlineSaves.prototype.createOptionsWindow');
	let toClipBoard=s=>{
		let txt;
		d.body.ac(txt=d.ce("input").sa("class","outofscreen"));
		txt.value=""+s;
		txt.select();
		txt.setSelectionRange(0,txt.value.length);
		d.execCommand("copy");
		txt.parentNode.removeChild(txt);
		$gameMessage.popup("已複製:"+s,1);
	},list=[["選擇下列id後按下確認，可複製到剪貼簿",";;func",0]].concat(deepcopy(
		($gamePlayer._onlineSaveIds||[]).sort((a,b)=>a[1]-b[1])
	));
	list.forEach((e,i)=>{
		if(i===0) return;
		let id=e[0];
		e[0]+=" , "+Scene_CustomMenu.prototype.toLocalISO(e[1]);
		e[1]=";;func;call";
		e[2]=1;
		e[3]=()=>{toClipBoard(id);};
	});
	this._window = new Window_CustomMenu_main(0,0,list,{statusWidth:()=>360});
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key='Scene_OnlineSaves';
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_OnlineSaves

// - Scene_UserSwitch

function Scene_UserSwitch(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_UserSwitch;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_UserSwitch.prototype.createOptionsWindow');
	this._window = new Window_CustomMenu_main(0,0,[
		[$dataCustom.noGainMsg,"_global_conf;noGainMsg"],
		[$dataCustom.noGainHint,"_global_conf;noGainHint"],
		[$dataCustom.noGainSound,"_global_conf;noGainSound"],
		[$dataCustom.noLeaderHp,"_global_conf;noLeaderHp"],
		[$dataCustom.noLeaderMp,"_global_conf;noLeaderMp"],
		[$dataCustom.noAnimation,"_global_conf;noAnimation"],
		["FPS減半 (你覺得CPU快燒起來的時候可以用)","_global_conf;halfFps"],
		["字體(電腦中需有該字體，本遊戲不另外提供)","_global_conf;useFont;text;請輸入想用的字體"],
	],{statusWidth:()=>360});
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key='Scene_UserSwitch';
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel',()=>{
		if(window['/tmp/'].chConfig){
			delete window['/tmp/'].chConfig;
			ConfigManager.save();
		}
		this.popScene();
	});
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_UserSwitch

// - Scene_SaveLocal

function Scene_SaveLocal(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_SaveLocal;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.downloadSave=(compressedBase64Data)=>{
	let url="data:application/octet-stream;base64,"+compressedBase64Data,fname="save-"+Date.now();
	let htmlele=d.ce("a").sa("target","_blank").sa("href",url);
	htmlele.download=fname;
	htmlele.click();
	$gameMessage.popup("下載中...",1);
};
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_SaveLocal.prototype.createOptionsWindow');
	let lg10f=this.log10Floor;
	let loct=this.toLocalISO;
	let dlSave=this.downloadSave;
	
	let self=this;
	let lastDlTime=0;
	
	let list=[
		[$dataCustom.saveLocalFromList,";_dlSave;func",1,(()=>{
			console.log("?");
			let rtv=[],txt=StorageManager.load(0);
			let info=txt&&JSON.parse(txt)||{};
			StorageManager.lastJson_load0=info;
			for(let x=0,xs=DataManager.maxSavefiles()^0,maxNumLen=xs.toString().length;x++!==xs;){
				let f="File "+' '.repeat(maxNumLen-lg10f[x])+x;
				if(!info[x]){ rtv.push([f,";;func",0]); continue; }
				let id=x; rtv.push([f+" "+loct(info[x].timestamp)+" ",
					"DataManager.titleAddName(StorageManager.lastJson_load0["+id+"]);;func;call",
				1,()=>{
					let key=StorageManager.webStorageKey(id);
					dlSave(localStorage.getItem(key));
					Input.clear();
				}]);
			}
			return rtv;
		})()],
		[$dataCustom.saveLocalCurrent,";;func;call",1,()=>{
			let tm=Date.now();
			if(tm-lastDlTime<1111){
				$gameMessage.popup("請稍後再試",1);
				$gameMessage.popup("下載過於頻繁，瀏覽器可能會阻擋下載",1);
				return;
			}
			let json=JsonEx.stringify(DataManager.makeSaveContents());
			tm=Date.now();
			dlSave(LZString.compressToBase64(json));
			lastDlTime=tm;
			Input.clear();
		}],
	];
	this._window = new Window_CustomMenu_main(0,0,list);
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key='Scene_LocalOnline';
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_SaveLocal

// - Scene_SaveOnline

function Scene_SaveOnline(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_SaveOnline;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_SaveOnline.prototype.createOptionsWindow');
	if(!f.toClipBoard) f.toClipBoard=s=>{
		let txt;
		d.body.ac(txt=d.ce("input").sa("class","outofscreen"));
		txt.value=""+s;
		txt.select();
		txt.setSelectionRange(0,txt.value.length);
		d.execCommand("copy");
		txt.parentNode.removeChild(txt);
		$gameMessage.popup("已複製:"+s);
	};
	let toClipBoard=f.toClipBoard;
	this._window = new Window_CustomMenu_main(0,0,[
		[$dataCustom.saveOnlineSave,";;func;call",1,()=>{
			let gStat=window.gasStat;
			if(gStat!=='ok'){
				if(gStat==='fail'){
					$gameMessage.popup("google apps script載入失敗",1);
				}else{
					$gameMessage.popup("未完成載入google apps script",1);
				}
				SoundManager.playBuzzer();
				return;
			}
			if(window.gasPropagate===undefined){
				$gameMessage.popup("等待google apps script完成設定",1);
				SoundManager.playBuzzer();
				return;
			}
			$gameSystem.onBeforeSave();
			DataManager.saveGame('online');
			$gameMessage.popup("已送出封包。等待中，玩家可先做其他事",1);
		}],
		[$dataCustom.saveOnlineList,";idList;func;list",1,()=>{
			let arr=[["選擇下列id後按下確認，可複製到剪貼簿",";;func",0]].concat(deepcopy(
				($gamePlayer._onlineSaveIds||[]).concat(JSON.parse('['+(localStorage.getItem('onlineSaveIds')||'')+']') ).sort((a,b)=>a[1]-b[1])
			)),rtv=[arr[0]];
			if(arr.length) for(let x=1;x!==arr.length;++x) if(arr[x][0]!==arr[x-1][0]) rtv.push(arr[x]);
			rtv.forEach((e,i)=>{
				if(i===0) return;
				let id=e[0];
				e[0]+=" , "+Scene_CustomMenu.prototype.toLocalISO(e[1]);
				e[1]=";;func;call";
				e[2]=1;
				e[3]=()=>{toClipBoard(id);};
			});
			return rtv;
		}],
	]);
	if(!$gamePlayer.menuHistory) $gamePlayer.menuHistory={};
	let mh=$gamePlayer.menuHistory,key='Scene_SaveOnline';
	if(mh[key]){
		this._window._lastSelItem=mh[key];
		let lastSelItem=this._window.lastSelItem();
		if(lastSelItem!==undefined) this._window._windows[0].select(lastSelItem);
	}else{
		mh[key]=this._window._lastSelItem;
	}
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_SaveOnline

// - Window_DebugMenu2

// - - Window_CustomBase_main
	// constructor, displayed size and location, input handlers, maintain data, ... ?
/* 
 commandLayer
	original: name, symbol, enabled, ext
	[txt:name , key_with_metadata:symbol , enabled, [next_layer,...], ext]
	[txt:name , key_with_metadata:symbol , enabled, [next_layer,...], ext, cache]

 */

function Window_CustomMenu_main(){
    this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomMenu_main;
$aaaa$.prototype = Object.create(Window_Command.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.destructor = function(){
	debug.log('Window_CustomMenu_main.prototype.destructor');
	for(let x=0,arr=this._windows;x!==arr.length;++x) if(arr[x].parent) this.removeChild(arr[x]);
};
$aaaa$.prototype.makeCommandList=none;
$aaaa$.prototype.processOk=none;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize = function f(x,y,commandLayers,kargs) {
	// source of commandLayers should not be edited
	this._selItem=[-1];
	this._lastSelItem={};
	this._storage=[];
	this._commandLayers=commandLayers; // [[txt:name , key_with_metadata:symbol , enabled, next_layer, ext],...]
	this._windows=[this.newWindow(commandLayers,x,y,kargs)];
	f.ori.call(this,0,0);
	this.width=this.y=this.x=0;
	this.height=Graphics.boxHeight;
	//this.updatePlacement(); // this is a shell
	this.addChild(this._windows[0]);
	//this._windows[0].selFirstEnabled(); // in child.initialize
	debug(this);
}; $dddd$.ori=$rrrr$;

$aaaa$.prototype.reservedWidthL=64;
$aaaa$.prototype.updatePlacement = function() { // preserved for windows
	// calc starting top-left xy
	if(this.nocenter) return;
	if(!this.nocenterx) this.x = (Graphics.boxWidth - this.width) / 2;
	if(!this.nocentery) this.y = (Graphics.boxHeight - this.height) / 2;
	if(this.fshx) this.x+=this.fshx; // final shift x
	if(this.fshy) this.y+=this.fshy; // final shift y
};

$aaaa$.prototype.addWindow=function(kargs,w){
	debug.log('Window_CustomMenu_main.prototype.addWindow');
	debug.log(kargs);
	let last=this._windows.back;
	kargs._width=kargs._width||(last.width-this.reservedWidthL);
	// if kargs._width<??? ????
	kargs.nocenterx=1;
	this._selItem.push(-1);
	w=w||this.newWindow(kargs.cmdL, (last.x+this.reservedWidthL) ,0,kargs);
	w.onGoback=kargs.onGoback;
	last.active=0;
	w.alpha=last.alpha*2;
	this.alpha/=2;
	//debug.log(w.active);
	this.addChild(w);
	this._windows.push(w);
};
if(0&&0)$aaaa$.prototype.newWindow_genNextFunc=function(cmd){
	return function(){
		debug.log('generate function',cmd);
		let kargs={cmdL:cmd[3]};
		this.parent.addWindow(kargs);
	};
};
$aaaa$.prototype.newWindow=function(commandLayers,x,y,kargs){
	debug.log('Window_CustomMenu_main.prototype.newWindow');
	debug.log(arguments);
	let self=this;
	if(!commandLayers || !commandLayers.length) commandLayers=[];
	let cmds=commandLayers;
		// 'makeCommandList' will be called twice
		// and must be called twice: 1st size, 2nd contents
	let rtv=new Window_CustomMenu_child(this,function(){ //debug.log('Window_CustomMenu_child','addCustomOptions');
		let firstCalled=this._storage.length===0;
		this._storage.length=cmds.length;
		for(let x=0;x!==cmds.length;++x) this.addCommand(cmds[x]);
		if(firstCalled){ // generate functions
			//for(let x=0,ss=this._storage;x!==ss.length;++x) if(ss[x].type==='func') this.genNextFunc(x);
		}
	},x,y,kargs);
	this.updatePlacement.call(rtv);
	return rtv;
};

$rrrr$=$aaaa$.prototype.processCancel;
$dddd$=$aaaa$.prototype.processCancel=function f(noSound){
	//debug.log('Window_CustomMenu_main.prototype.processCancel');
	let arr=this._windows;
	if(1>=arr.length){
		f.ori.call(this);
	}else{
		{
			let tmp=arr.back;
			if(tmp.isTyping&&tmp.isTyping()) return;
			if(tmp.onGoback&&tmp.onGoback.constructor===Function) tmp.onGoback();
		}
		this.removeChild(arr.pop());
		this._selItem.pop();
		this.alpha*=2;
		for(let x=0;x!==arr.length;++x) arr[x].redrawDiffs();
		arr.back.active=1;
		if(!noSound) SoundManager.playCancel();
	}
	return;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.selItem=function(idx,symbol){ // exe by child
	let arr=this._selItem;
	arr.pop();
	let key=JSON.stringify(arr);
	arr.push(symbol===undefined?idx:symbol);
	this._lastSelItem[key]=idx;
};
$aaaa$.prototype.lastSelItem=function(){
	let arr=this._selItem;
	let tmp=arr.pop();
	let rtv=this._lastSelItem[JSON.stringify(arr)];
	arr.push(tmp);
	return rtv;
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_CustomMenu_main









// - - Window_CustomMenu_child
	// constructor, displayed size and location, input handlers, maintain data, ... ?

function Window_CustomMenu_child() {
    this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomMenu_child;
$aaaa$.prototype = Object.create(Window_Command.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize = function f(parent,customOptions,x,y,kargs) {
	debug(this);
	this._storage=[];
	this._parent=parent;
	this.addCustomOptions=customOptions; // defined by parent
	let lastSelItem=this._parent.lastSelItem();
	for(let k in kargs) this[k]=kargs[k];
	f.ori.call(this,x,y,kargs);
	this.width  =this.width  ===0?0:Math.min(this.width  ||Graphics.boxWidth  ,Graphics.boxWidth  );
	this.height =this.height ===0?0:Math.min(this.height ||Graphics.boxHeight ,Graphics.boxHeight );
    //this.updatePlacement(); // no auto centrarized
	if(lastSelItem===undefined) this.selFirstEnabled();
	else this.select(lastSelItem);
}; $dddd$.ori=$rrrr$;

$aaaa$.prototype.statusWidth = function() {
	// |option                   | (current)status |
	// |(squeezed if too long)   | <-- statusWidth |
	let p=this._parent;
	if(p.statusWidth) return p.statusWidth.constructor===Function?p.statusWidth():p.statusWidth;
    return 264;
};
$aaaa$.prototype.windowWidth = function() { return this._width||Graphics.boxWidth; };
$aaaa$.prototype.windowHeight = function() { return this._height||this.fittingHeight(Math.min(this.numVisibleRows(), 15)); };
$rrrr$=$aaaa$.prototype.select;
$dddd$=$aaaa$.prototype.select=function f(x){ x=x.clamp(-1,this._list.length-1);
	let key=x===-1?-1:this._list[x].symbol;
	this._parent.selItem(x,key); return f.ori.call(this,x);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.selFirstEnabled=function(){
	debug.log('.selFirstEnabled');
	this.deselect();
	for(let x=0,arr=this._list;x!==arr.length;++x)
		if(arr[x].enabled){ this.select(x); return; }
};
$aaaa$.prototype.redrawDiffs=function(){
	let redrawList=[];
	for(let index=0,arr=this._storage;index!==arr.length;++index)
		if(arr[index].lastTxt!==this.statusInfo(index).txt||this._list[index].name!==arr[index].lastCmdname)
			redrawList.push(index);
	for(let x=0,arr=redrawList;x!==arr.length;++x)
		this.redrawItem(arr[x]);
};
$aaaa$.prototype.drawItem = function(index) {
	debug.log(this.constructor.name,'prototype.drawItem');
    var rect = this.itemRectForText(index);
    var statusWidth = this.statusWidth();
	let stat=this.statusInfo(index);
	let titleWidth = rect.width - statusWidth*(!!stat.txt);
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
	this.drawText(this._storage[index].lastCmdname=this.commandName(index), rect.x, rect.y, titleWidth, 'left');
	// debug.log(index,stat);
	this.drawText(this._storage[index].lastTxt=stat.txt, titleWidth, rect.y, statusWidth, 'right');
	debug.log('','statusWidth',statusWidth,'func',this.statusWidth);
};

$aaaa$.prototype.processOk = function() {
	debug.log('Window_CustomMenu_child.prototype.processOk');
	if(this._index<0) return;
	this.changeValEntry("ok");
};
$aaaa$.prototype.cursorRight =function(wrap) { debug.log('Window_CustomMenu_child.prototype.curR');this.changeValEntry("curR"); return; };
$aaaa$.prototype.cursorLeft  =function(wrap) { debug.log('Window_CustomMenu_child.prototype.curL');this.changeValEntry("curL"); return; };
$rrrr$=$aaaa$.prototype.processHandling;
$dddd$=$aaaa$.prototype.processHandling=function f(){
	if(this.everyTick) this.everyTick();
	f.ori.call(this);
}; $dddd$.ori=$rrrr$;

$aaaa$.prototype.parseStorageInfo=function(symbol){
	// symbol = obj;key;type(default=bool);type_detail
	let m=symbol.match(/^([^;]*);([^;]*)(;([^;]*)(;(.+))?)?/);
	if(m!==null){
		let obj=m[1]; if(obj==='this' && this._parent){
			if(!this._parent.this) this._parent.this={};
			obj+="._parent.this";
		}
		if(m[4]==='func') return {obj:obj,key:m[2]||"_none",type:m[4],tdetail:m[6]};
		obj=(typeof window[obj]==='object')?window[obj]:eval(obj);
		if(obj) return {obj:obj,key:m[2],type:m[4]||"bool",tdetail:m[6]||""};
	}
	return {obj:ConfigManager,key:symbol,type:"bool"};
};
$aaaa$.prototype.getStorageInfo=function(index){
	if(this._storage[index]) return this._storage[index];
	if(this._storage.length<this._list.length) this._storage.length=this._list.length;
	return this._storage[index]=this.parseStorageInfo(this.commandSymbol(index));
};
$aaaa$.prototype.booleanStatusText = function(value) { return value ? 'ON' : 'OFF'; };
$aaaa$.prototype.statusInfo=function(index) {
	let storage=this.getStorageInfo(index);
	let val=storage.obj&&storage.obj[storage.key],txt="";
	switch(storage.type)
	{
		default: break;
		case "text": {
			txt=(val===0?0:(val||"")).toString();
			if(storage.tdetail.match){ // is str
				if(storage.next){
					if(!storage.next.title) storage.next.title=storage.tdetail;
					storage.tdetail=storage.next;
				}else storage.tdetail={title:storage.tdetail};
			}
		}break;
		case "bool": {
			txt=this.booleanStatusText(val);
		}break;
		case "func": { 
			// this.genNextFunc(index); // do when call changeVal_func
			if(storage.obj) txt=eval(storage.obj).toString();
		}break;
		case "real": {
			txt=!val?'0':val.toString();
			if(storage.tdetail.match){
				let m=storage.tdetail.match(/^([0-9]*):([0-9]*):([0-9]+)(:rot)?$/);
				storage.tdetail=(m===null)?{s:-inf,t:inf,st:1}:
					{s:m[1]===""?-inf:Number(m[1]),t:m[2]===""?inf:Number(m[2]),st:Number(m[3]),rot:!!m[4]};
			}
		}break;
	}
	storage.txt=txt;
	return storage;
};
$aaaa$.prototype.genNextFunc=function(storage){
	debug.log('Window_CustomMenu_child.prototype.genNextFunc');
	debug.log(storage,this[storage.key]);
	switch(storage.tdetail){
		default: {
			return this[storage.key]||(this[storage.key]=function(){ this.parent.addWindow({cmdL:storage.next,onGoback:storage.onGoback}); });
		}break;
		case "list": {
			let kargs={cmdL:storage.next.call(this),onGoback:storage.onGoback};
			return function(){ this.parent.addWindow(kargs); };
		}break;
		case "call": {
			return storage.next;
		}break;
	}
};
$rrrr$=$aaaa$.prototype.addCommand;
$dddd$=$aaaa$.prototype.addCommand=function f(cmd){
	// called double per cmd at total
	//debug.log('Window_CustomMenu_child.prototype.addCommand'); // debug
	//debug.log(this._list.length); debugger;
	// debug.log(cmd);
	let txt=cmd[0],key=cmd[1],enabled=cmd[2],next=cmd[3],ext=cmd[4],onGoback=cmd[5];
	// txt: name, if it is a function name will be dynamic
	// key: a string indicate what object to be edited or wheather it is a function call or a list
	// enabled: enabled?
	// next: next menu layer info
	// ext: not used by me ~~
	// onGoback: when back to previous menu layer, do 'onGoback.call(this)'. first menu layer will NOT call
	f.ori.call(this,txt,key,enabled,ext);
	if(txt.constructor===Function) Object.defineProperties(this._list.back,{
		name: { get:function(){return txt();}, configurable: false }
	});
	// debug.log("\t",this._list.back.name);
	let strg=this.getStorageInfo(this._list.length-1);
	strg.next=next;
	strg.onGoback=onGoback;
	if(this._cmdcnt>=this._list.length && this._cmdcnt!==this._storage.length){
		debug.log("this._storage.length = "+this._cmdcnt);
		this._storage.length=this._cmdcnt;
		delete this._cmdcnt;
		for(let ss=this._storage,x=0;x!==ss.length;++x) this.getStorageInfo(x);
	}
	else this._cmdcnt=this._list.length;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.removeCommand=function(index){ // type(index):int
	if(index<0 || index>=this._list.length) return 1;
	let S=this._storage,L=this._list;
	for(let x=index,last=L.length-1;x!==last;++x){
		L[x]=L[x+1];
		S[x]=S[x+1];
	}
	L.pop();
	S.pop();
};
$aaaa$.prototype.removeCommandByTxt=function(txt){
	for(let arr=this._list,x=0,xs=arr.length;x!==xs;++x)
		if(arr[x].txt===txt){
			this.removeCommand(x);
			return;
		}
	return 1;
};
$aaaa$.prototype.isNotEnabled_withSound=function(usrInput,idx){
	let rtv=!this._list[idx||this._index].enabled;
	if(rtv) SoundManager.playBuzzer();
	else SoundManager[usrInput===2?"playOk":"playCursor"]();
	return rtv;
};
$aaaa$.prototype.changeVal_text=function(storage,usrInput){
	this._parent.addWindow({},new Window_CustomTextInput(storage.obj,storage.key,storage.tdetail));
};
$aaaa$.prototype.changeVal_func=function(storage,usrInput){
	debug.log('Window_CustomWindow.prototype.changeVal_func');
	debug(this);
	this.genNextFunc(storage).call(this);
};$aaaa$.prototype._none=none;
$aaaa$.prototype.changeVal_real=function(storage,inc_0__dec_1=0){
	let val=storage.obj[storage.key]^0,td=storage.tdetail;
	//debug.log(val,inc_0__dec_1,td.s,td.t,td.st);
	if(inc_0__dec_1===2){ // no '&&!td.rot'
		// from 'ok' && numbers not rotate
		let next=storage.next||{};
		this._parent.addWindow({},(()=>{let w=new Window_CustomTextInput(storage.obj,storage.key,{
			title:"input number ranging from "+td.s+" to "+td.t,
			valid:next.valid||((t)=>{let n=Number(t);return td.s<=n&&n<=td.t}),
			apply:next.apply||Number,
			final:next.final
		});w.setScrollNum();return w;})());
		return;
	}
	val+=(1-((inc_0__dec_1&1)<<1))*td.st*(Input.isPressed('shift')*9+1);
	if(!td.rot) val=val.clamp(td.s,td.t);
	else if(Math.abs(td.s)+Math.abs(td.t)!==inf){
		let d=(td.t-td.s)+td.st;
		val+=d; val-=td.s; val%=d;
		val*=(1e-23)<(val*val);
		val+=td.s;
	}
	storage.obj[storage.key]=val;
};
$aaaa$.prototype.changeVal_bool=function(storage){
	storage.obj[storage.key]^=1;
	debug.log('Window_CustomWindow.prototype.changeVal_bool',storage,$gamePlayer.canDiag);
};
$aaaa$.prototype.__changeValEntry_mapping={"ok":2,"curL":1,"curR":0,"__dummy":-1};
$aaaa$.prototype.changeValEntry=function(usrInput){
	debug.log(usrInput);
	usrInput=this.__changeValEntry_mapping[usrInput]||0;
	let storage=this.statusInfo(this._index);
	if((storage.type==='func'||storage.type==='text') && usrInput!==2) return;
	if(this.isNotEnabled_withSound(usrInput)) return;
	this["changeVal_"+storage.type](storage,usrInput);
	usrInput!==2&&storage.next&&storage.next.final&&storage.next.final(storage.obj,storage.key);
	debug.log(storage);
	for(let x=0,ss=this._storage;x!==ss.length;++x){
		if(this.statusInfo(x).txt!==ss[x].lastTxt)
			this.redrawItem(x);
	}
};

$aaaa$.prototype.makeCommandList = function() {
	if(this.addCustomOptions) this.addCustomOptions();
	return;
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_CustomMenu_child


// - - Window_CustomTextBase

function Window_CustomTextBase(){
	// do not directly 'new' this class
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomTextBase;
$aaaa$.prototype = Object.create(Window_Selectable.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.destructor=function(){
	debug.log('Window_CustomTextBase.prototype.destructor');
	delete this._lastKeyStat;
	if(!textWidthCache) this._textWidthCache.length=0;
};
//$aaaa$.prototype.update=none; // needed
$aaaa$.prototype.updateArrows=none;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize = function f(x,y,w,h) {
	this._textWidthCache=textWidthCache||[]; this._textWidthCache.length=65536;
	this._lastKeyStat={};
	let rtv=f.ori.call(this,x,y,w,h);
	this.active=true;
	if(!textWidthCache.size) textWidthCache.size=this.contents.fontSize;
	return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.drawlinetext=function(text,line,align){
	// line: 0-base ; align: 'left','center','right'
	align=align||'left';
	let maxWidth=this.contents.width-(this.textPadding()<<1);
	let strtx=0,strty=line*this.lineHeight(),textw=this.textWidth(text);
	switch(align){
		default:
		case 'left':
			strtx+=this.textPadding();
		break;
		case 'center': {
			strtx+=(this.contents.width-textw)>>1;
		}break;
		case 'right': {
			strtx+=this.contents.width-this.textPadding()-textw;
		}break;
	}
	this.drawText(text,strtx,strty,maxWidth);
	return {x:strtx,y:strty,w:Math.min(textw,maxWidth),ow:textw};
};
$rrrr$=$aaaa$.prototype.textWidth;
$dddd$=$aaaa$.prototype.textWidth=function f(txt,ende){
	// ende must be int>=0 or undefined
	if(this.contents.fontSize!==this._textWidthCache.size) return f.ori.call(this,ende!==undefined?txt.slice(0,ende):txt);
	let rtv=0;
	for(let x=0,xs=(ende===undefined)?txt.length:Math.min(ende,txt.length);x!==xs;++x){
		let cc=txt.charCodeAt(x);
		if(!this._textWidthCache[cc]) this._textWidthCache[cc]=f.ori.call(this,txt[x]);
		rtv+=this._textWidthCache[cc];
	}
	return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.redrawtxt=function(){this.contents.clear();};
$aaaa$.prototype.redrawDiffs=function(){
	// only 'ok' will update the value, and when this happens, 
	// '_parent.processCancel' will be executed, 
	// then 'child.redrawDiffs' being executed
	//if(this._parent&&this._parent.redrawDiffs) this._parent.redrawDiffs();
};
$aaaa$.prototype.processKey=function(key){
	let k=Input.isPressed(key);
	let rtv=k&&!this._lastKeyStat[key]
	this._lastKeyStat[key]=k;
	return rtv;
};
$aaaa$.prototype.setScrollNum_processWheel=function(){
	let delta=(TouchInput.wheelY<0)-(TouchInput.wheelY>0);
	return delta;
};
$aaaa$.prototype.setScrollNum=function(){
	debug.log('Window_CustomTextBase.prototype.setScrollNum');
	this.processWheel=this.setScrollNum_processWheel;
	return;
};
$dddd$=$rrrr$=$aaaa$=undef;


// - - Window_CustomTextBoard

function Window_CustomTextBoard(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomTextBoard;
$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.destructor;
$dddd$=$aaaa$.prototype.destructor=function f(){
	//debug.log('Window_CustomTextBoard.prototype.destructor');
	if(this._oribodykeydown!==undefined) d.body.onkeydown=this._oribodykeydown;
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize = function f(txtinfos,kargs) {
	let self=this;
	// txtinfos: [{txt:"msg",color:"rgba(,,,)",bgcolor:"rgba(,,,)" }, "\n",  {}...]
	this.txtinfos=txtinfos; if(!this.txtinfos.length) this.txtinfos=[];
	this.scrolly=0;
	kargs=kargs||{};
	let x=kargs[  'x'  ]||        0        ,y=kargs[   'y'  ]||        0         ;
	let w=kargs['width']||Graphics.boxWidth,h=kargs['height']||Graphics.boxHeight;
	this.raw=kargs.raw; // no parsing
	let rtv=f.ori.call(this,x,y,w,h);
	let scrollable=!(this.noScroll=kargs.noScroll);
 // onkeydown callback
 if(scrollable){
	let onkeydown=function f(e){
		if(!f.ref.active) return;
		switch(e.keyCode){
			case 33: { // PgUp
				if(!f.ref.upArrowVisible) return;
				f.ref.scrolly-=Math.min(f.ref.contents.height,f.ref.scrolly);
				SoundManager.playCursor();
			}break;
			case 34: { // PgDn
				if(!f.ref.downArrowVisible) return;
				f.ref.scrolly+=Math.min(f.ref.contents.height,f.ref._canScroll-f.ref.scrolly);
				SoundManager.playCursor();
			}break;
			case 35: { // end
				if(!f.ref.downArrowVisible) return;
				f.ref.scrolly=f.ref._canScroll;
				SoundManager.playCursor();
			}break;
			case 36: { // home
				if(!f.ref.upArrowVisible) return;
				f.ref.scrolly=0;
				SoundManager.playCursor();
			}break;
			case 38: { // up arrow
				if(!f.ref.upArrowVisible) return;
				f.ref.scrolly-=Math.min(23,f.ref.scrolly);
				SoundManager.playCursor();
			}break;
			case 40: { // down arrow
				if(!f.ref.downArrowVisible) return;
				f.ref.scrolly+=Math.min(23,f.ref._canScroll-f.ref.scrolly);
				SoundManager.playCursor();
			}break;
		}
		f.ref.redrawtxt();
	};
	onkeydown.ref=this;
	this._oribodykeydown=d.body.onkeydown;
	d.body.onkeydown=onkeydown;
 }
	// preserved for dynamic text
	this.redrawtxt(1); // will define 'this._canScroll'
	this.redrawtxt();
	//let itvl=setInterval(()=>{if(this.parent===null)clearInterval(itvl);else this.redrawtxt();debug.log("am i alive?");},30); // there's scroll event, updating when scroll may cause efficiency decreased
	if(debug.isdebug()) window['????']=this;
	return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.lineHeight=Window_Base.prototype.lineHeight;
$aaaa$.prototype.standardFontSize=Window_Base.prototype.standardFontSize;

$aaaa$.prototype.processWheel=function(){
	if(!TouchInput.wheelY) return;
	this.scrolly=(this.scrolly+TouchInput.wheelY).clamp(0,this._canScroll);
	this.redrawtxt();
};

$aaaa$.prototype._redrawtxt_parseColor=function(txt,strt){
	let rtv={txt:"",go:0};
	if(txt[strt^=0]!=="_") return rtv;
	if(strt+1<txt.length && txt[strt+1]==="_") rtv.go+=1;
	else{ let res=this.processEscapeCharacter.re.exec(txt.slice(strt+1));
		if(res){
			rtv.txt=res[0].slice(1,-1);
			rtv.go+=res[0].length;
		}
	}
	return rtv;
};
$aaaa$.prototype.updateInfos=function(txtinfos,kargs){
	// re-cal. this.contents 's size
		// re-create this.contents
	let old=[this.width,this.height];
	for(let i in kargs) this[i]=kargs[i];
	if(old[0]!==this.width || old[1]!==this.height){ // window size changed -> canvas size changed
		this.createContents();
	}else this.contents.clear();
	this.txtinfos=txtinfos; if(!this.txtinfos.length) this.txtinfos=[];
	this.redrawtxt(1); // will define 'this._canScroll'
	this.redrawtxt();
};
$dddd$=$aaaa$.prototype.redrawtxt=function f(measuringHeight){
	if(measuringHeight && this.noScroll) return this._canScroll=0;
	this.contents.clear();
	let pad=this.textPadding(),LH_ori=this.lineHeight(),LH_last=LH_ori,xe=this.contents.width-(pad<<1),ye=this.contents.height+this.scrolly;
	let currx=0,curry=pad,currLine=0;
	let font_ori={
		fontSize:this.contents.fontSize,
		textColor:this.contents.textColor
	};
	for(let s=0,arr=this.txtinfos;s!==arr.length;++s){
		if(arr[s].match){
			let m=arr[s].match(/\n/g);
			if(m.length){
				let r=m.length-1;
				curry+=LH_last;
				curry+=(LH_last=LH_ori)*r;
				currx=0;
			}
			continue;
		}
		if(!measuringHeight && curry>=ye) break; // overflow-y
		let txt=this.raw?arr[s].txt:f.toMyColor(
			f.parsequest(f.parseitem(
				f.parsekeyword(
					f.parseUTF8(
						f.parseCODE(
							arr[s].txt||""
						)
					)
				)
			))
		);
		let size=font_ori.fontSize*(arr[s].sizeRate===0?0:(arr[s].sizeRate||1));
			this.contents.fontSize=size;
			let LH=this.lineHeight();
		let color=arr[s].color||"";
			if(Window_Base.prototype.processEscapeCharacter.re.exec("["+color+"]")) color="_["+color+"]";
			if(!measuringHeight){
				let res=this._redrawtxt_parseColor(color,0);
				if(res.txt) this.contents.textColor=res.txt;
			}
		let bgcolor=arr[s].bgcolor;
		let align=arr[s].align||"";
		switch(align){
		case 'center':
		case 'right': { // I'll hate you if you put "\n" or colors in string in these two cases
			// no auto newline
			this.drawText(txt,pad,curry-this.scrolly,xe,align);
		}break;
		default:
			for(let i=0;i!==txt.length;++i){
				let res=this._redrawtxt_parseColor(txt,i); i+=res.go; if(res.txt){ this.contents.textColor=res.txt; continue; }
				let w=this.textWidth(txt[i]);
				if((currx!==0&&currx+w>=xe)||txt[i]==="\n"){
					curry+=LH_last; LH_last=LH;
					currx=0;
					if(txt[i]==="\n") continue;
				}
				if(!measuringHeight && curry>=ye) break; // overflow-y
				if(!measuringHeight && this.scrolly<curry+LH) this.drawText(txt[i],currx+pad,curry-this.scrolly,xe-currx);
				LH_last=LH;
				currx+=w;
			}
		break;
		}
	}
	let btm=curry+LH_last;
	this.downArrowVisible=(ye<btm); // overflow-y
	this.upArrowVisible=this.scrolly!==0;
	if(measuringHeight) this._canScroll=(btm-ye).clamp(0,inf);
	// restore
	for(let i in font_ori) this.contents[i]=font_ori[i];
	return curry-ye;
};
$dddd$.parseUTF8=function f(txt){return txt.replace(f.re,function(){return (arguments[1]||"")+(arguments[2]||"")+String.fromCharCode(arguments[3]);})};
$dddd$.parseUTF8.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_utf8.toString().slice(5,-2)+
"",'g');
$dddd$.parseCODE=function f(txt){return txt.replace(f.re,function(){return (arguments[1]||"")+(arguments[2]||"")+eval(arguments[3]);})};
$dddd$.parseCODE.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_code.toString().slice(5,-2)+
"",'g');
$dddd$.parsekeyword=function f(txt){
	return txt.replace(f.re,function(){
		return (arguments[1]||"")+(arguments[2]||"")+ "\\RGB["+$dataCustom.textcolor.keyword.replace("$","$$")+"]"+eval(arguments[3])+"\\RGB["+$dataCustom.textcolor.default+"]";
		let item=$dataItems[Number(arguments[1])];
		return "\\RGB["+$dataCustom.textcolor.keyword.replace("$","$$")+"]"+(item&&item.name||"")+"\\RGB["+$dataCustom.textcolor.default+"]";
	});
};
$dddd$.parsekeyword.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_keyword.toString().slice(5,-2)+
"",'g');
$dddd$.parseitem=function f(txt){
	return txt.replace(f.re,function(){
		let item=$dataItems[Number(arguments[3])];
		return (arguments[1]||"")+(arguments[2]||"")+ "\\RGB["+$dataCustom.textcolor.item.replace("$","$$")+"]"+(item&&item.name||"")+"\\RGB["+$dataCustom.textcolor.default+"]";
	});
};
$dddd$.parseitem.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_item.toString().slice(5,-2)+
"",'g');
$dddd$.parsequest=function f(txt){
	return txt.replace(f.re,function(){
		let item=$dataItems[Number(arguments[3])];
		return (arguments[1]||"")+(arguments[2]||"")+ "\\RGB["+$dataCustom.textcolor.quest.replace("$","$$")+"]"+(item&&item.name||"")+"\\RGB["+$dataCustom.textcolor.default+"]";
	});
};
$dddd$.parsequest.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_quest.toString().slice(5,-2)+
"",'g');
$dddd$.toMyColor=function f(txt){ return txt.replace(f.re,"$1$2_$3"); };
$dddd$.toMyColor.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\RGBA?("+
	Window_Base.prototype.processEscapeCharacter.re.toString().slice(2,-1)+
")",'g');
	// \RGB[#000000] -> _RGB[#000000]
		// \\\\ in str -> \\ 
		// RegExp get \\ -> match \ 
		//   =>  \\\\ -> \ 
$dddd$=$rrrr$=$aaaa$=undef; // END Window_CustomTextBoard

// - - Window_CustomTextInput

function Window_CustomTextInput(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomTextInput;
$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.destructor;
$dddd$=$aaaa$.prototype.destructor=function f(){
	// same as C++: do not call this function twice
	debug.log('Window_CustomTextInput.prototype.destructor');
	let t=this.node_input,dmy=this.node_dummy;
	dmy.parentNode.removeChild(dmy);
	d.body.onkeydown=this._oribodykeydown;
	if(this._choice===1){
		this._dstObj[this._dstKey]=this._dstApply?this._dstApply(t.value):(t.value);
		if(this._dstFinal) this._dstFinal(this._dstObj,this._dstKey);
	}
	t.parentNode.removeChild(t);
	let rtv=f.ori.call(this);
	let msg=$gameMessage;
	if(0&&SceneManager.isMap() && msg && msg._windowCnt){
		msg._windowCnt^=0; msg._windowCnt+=1;
	}
	window.inputting=0;
	return rtv;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize = function f(dstObj,dstKey,txtdetail,kargs) {
	let self=this;
	// unify args
	txtdetail=txtdetail||{}; // .title .apply .valid .final
	
	this._cursorRect=[0,0,0,0]; // x,y,w,h
	this._dstObj=dstObj; this._dstKey=dstKey;
		if(txtdetail.init) txtdetail.init(dstObj,dstKey);
	this._dstApply=txtdetail.apply;
	this._dstValid=txtdetail.valid;
	this._dstFinal=txtdetail.final;
	this._title=txtdetail.title===""?"":(txtdetail.title||"input texts by typing");
	this._choice=0; // 0:input block ; 1:ok 2:cancel
	
	kargs=kargs||{};
	let x=kargs[  'x'  ]||        0        ,y=kargs[   'y'  ]||    0              ;
	let w=kargs['width']||Graphics.boxWidth,h=kargs['height']||(this.fittingHeight(4));
	this.cursorBlinkPeriod=kargs['cursorBlinkPeriod']||17;
	f.ori.call(this,x,y,w,h);
	debug.log(this);
	Window_CustomMenu_main.prototype.updatePlacement.call(this);
	
	d.body.ac(this.node_dummy=d.ce("input").sa("class","outofscreen"));
	this.node_dummy.oninput=function(){this.value="";};
	d.body.ac(this.node_input=d.ce("input").sa("class","outofscreen"));
	this.node_input.value=this._dstObj[this._dstKey]||"";
	let node=this.node_input;
	this._oribodykeydown=d.body.onkeydown;
	d.body.onkeydown=function(e){
		if(!node.ref.active) return;
		switch(e.keyCode){
			case 38: { // up arrow
				node.ref._choice-=1-3;
				node.ref._choice%=3;
				node.ref.drawcursor(); SoundManager.playCursor();
			}break;
			case 40: { // down arrow
				node.ref._choice+=1;
				node.ref._choice%=3;
				node.ref.drawcursor(); SoundManager.playCursor();
			}break;
		}
		if(node.ref._choice===0) node.focus();
		else node.ref.node_dummy.focus();
	};
	this.node_input.ref=this;
	this._textCursorAt_s=0;
	this._textCursorAt_e=0;
	this._textCursorAt_d='';
	this._textCursorBlinkCtr=0;
	this.cursorBlinkState=0;
	this.node_dummy.onfocus=function(){window.inputting=0;};
	this.node_input.onfocus=function(){window.inputting=1;this.ref._choice=0;};
	this.node_input.custom_updateCursorInfo=function(e){
		this.ref._textCursorAt_s=e.target.selectionStart;
		this.ref._textCursorAt_e=e.target.selectionEnd;
		this.ref._textCursorAt_d=e.target.selectionDirection;
		//debug.log('',this.ref._textCursorAt_s,this.ref._textCursorAt_e,this.ref._textCursorAt_d);
	};
	this.node_input.custom_setSelRange=function(curAt,posTail){
		let low =curAt>=posTail?posTail:curAt;
		let high=curAt>=posTail?curAt:posTail;
		let dir =curAt>=posTail?"":"backward";
		this.setSelectionRange(
			this.ref._textCursorAt_s=low,
			this.ref._textCursorAt_e=high||low,
			this.ref._textCursorAt_d=dir
		);
	};
	this.node_input.oninput=this.node_input.onkeyup=function(e){ this.custom_updateCursorInfo(e); };
	this.node_input.onkeydown=function(e){
		this.custom_updateCursorInfo(e);
		let pos_s=e.target.selectionStart;
		let pos_e=e.target.selectionEnd;
		let pos_d=e.target.selectionDirection;
		//debug.log("d",pos_s,pos_e,pos_d);
		//debug.log('',"L",Input.isPressed('left')); debug.log('',"R",Input.isPressed('right')); debug.log('',"sh",Input.isPressed('shift'));
		//debug.log('',e.keyCode);
		this.ref._textCursorBlinkCtr=this.ref.cursorBlinkState=0;
		debug.log(e.keyCode);
		let curAt  =pos_d==="backward"?pos_s:pos_e;
		let posTail=pos_d==="backward"?pos_e:pos_s;
		switch(e.keyCode){
			case 8: { // backspace
				pos_s-=pos_s===pos_e; pos_s=pos_s.clamp(0,inf);
				this.value=this.value.slice(0,pos_s)+this.value.slice(pos_e);
				this.custom_setSelRange(pos_s);
			}break;
			case 13: { // enter
				// no effect
				// if press 'enter' and then destruct this window
				// parent will get 'enter' and then go back to here
				this.ref._choice_=this.ref._choice;
				this.ref._choice=1;
				Input.clear();
			}break;
			case 27: { // esc Input.clear(); 
				this.ref.doCancel(1); // Either parent is Window_CustomMenu_main or not
			}break;
			case 35: { // end
				let ende=this.value.length;
				this.custom_setSelRange(ende,Input.isPressed('shift')?posTail:ende);
			}break;
			case 36: { // home
				this.custom_setSelRange(0,Input.isPressed('shift')&&posTail);
			}break;
			case 37: { // left arrow
				let re=/[0-9A-Za-z]+$/;
				if(Input.isPressed('control')){
					let m=this.value.slice(0,curAt).match(re);
					curAt-=m&&m[0].length||1;
				}else --curAt;
				curAt=curAt.clamp(0,this.value.length);
				debug.log('cursor fly to',curAt);
				this.custom_setSelRange(curAt,Input.isPressed('shift')?posTail:curAt);
			}break;
			case 39: { // right arrow
				let re=/^[0-9A-Za-z]+/;
				if(Input.isPressed('control')){
					let m=this.value.slice(curAt).match(re);
					curAt+=m&&m[0].length||1;
				}else ++curAt;
				curAt=curAt.clamp(0,this.value.length);
				this.custom_setSelRange(curAt,Input.isPressed('shift')?posTail:curAt);
			}break;
		}
	};
	this.node_input.focus();
	this._textCursorAt_s=this.node_input.value.length;
	this._textCursorAt_e=this.node_input.value.length;
	//this.redrawtxt();
	this.drawcursor();
	let itvl=setInterval(()=>{ if(self.parent===null) clearInterval(itvl); else self.redrawtxt(); },35);
	let msg=$gameMessage;
//	if(0&&SceneManager.isMap() && msg && msg._windowCnt){
//		msg._windowCnt^=0; msg._windowCnt+=1;
//	}
	if(debug.isdebug()){
		this.node_input.sa("class","");
		window['????']=this;
	}
}; $dddd$.ori=$rrrr$;

$aaaa$.prototype.isTyping=function(){
	return this._choice===0;
};
$aaaa$.prototype.setScrollNum_processWheel=function(){
	let delta=(TouchInput.wheelY<0)-(TouchInput.wheelY>0);
	if(delta===0) return;
	let tmp=this._dstApply(this.node_input.value);
	tmp+=delta;
	if(this._dstValid && !this._dstValid(tmp)){
		SoundManager.playBuzzer();
		return;
	}
	for(let x=Input.isPressed('shift')*9+1,next;--x&&this._dstValid(next=tmp+delta);)
		tmp=next;
	tmp=tmp.toString();
	this.node_input.value=tmp;
	this.node_input.custom_setSelRange(tmp.length);
};
$aaaa$.prototype.setScrollNum=function(){
	debug.log('setScrollNum');
	this.processWheel=this.setScrollNum_processWheel;
	return;
};

$aaaa$.prototype.drawcursor=function(){
	// item cursor
	// draw @line according to this._choice
	this.setCursorRect( 0, (this._choice+1)*this.lineHeight(), this.width, this.lineHeight() );
};
$aaaa$.prototype.redrawtxt=function(){
	this.contents.clear();
	
	// title
	this.drawText(this._title,0,0,this.contentsWidth());
	
	// user's input so far
	let startxy=this.drawlinetext(this.node_input.value,1);
	let startx=startxy.x,r=startxy.w/startxy.ow; if(isNaN(r)) r=1;
	
	// cursor
	let tmp=(++this._textCursorBlinkCtr)<this.cursorBlinkPeriod;
	this._textCursorBlinkCtr*=tmp;
	let cursor=(this.cursorBlinkState^=!tmp)?" ":"|";
	let shx_s=this.textWidth(this.node_input.value,this._textCursorAt_s);
	let shx_e=this.textWidth(this.node_input.value,this._textCursorAt_e);
	// - text selected background
	this.contents._context.fillStyle="rgba(0,0,123,0.25)";
	this.contents._context.fillRect(startx+parseInt(shx_s*r),startxy.y,parseInt((shx_e-shx_s)*r),this.lineHeight());
	// - verticle cursor
	startx+=(this._textCursorAt_d==='backward'?shx_s:shx_e);
	startx-=this.textWidth(cursor)>>1;
	startx=parseInt(startx*r);
	this.drawText(cursor,startx,this.lineHeight());
	
	// btn - ok
	this.drawlinetext(" ok (Enter)",2);
	
	// btn - cancel
	this.drawlinetext(" cancel (ESC)",3);
	
	// horizontal cursor
	//this.drawcursor();
};

$aaaa$.prototype.processKey=function(key){
	let k=Input.isPressed(key);
	let rtv=k&&!this._lastKeyStat[key]
	this._lastKeyStat[key]=k;
	return rtv;
};
$aaaa$.prototype.processTouchAtLine=function(x,y){
	let lineH=this.lineHeight(),pad=this.standardPadding();
	let line=parseInt((y-(this.y+pad)+lineH)/lineH)-1;
	debug.log(this.y,pad,y,lineH);
	return (line>=0&&x>=pad&&x+pad<this.width)?line:-1;
};
$aaaa$.prototype.processTouchAtChoice=function(x,y){
	return this.processTouchAtLine(x,y)-1;
};
$aaaa$.prototype.processTouch2I=function(){
	let OAO=this.drawlinetext(this.node_input.value,-1);
	let x=(TouchInput.x-OAO.x-this.standardPadding()-this.x)/(OAO.w/OAO.ow);
	let i=0; for(let sw=0,s=this.node_input.value;i!==s.length;++i){
		let w=this.textWidth(s[i]);
		if(sw+(w>>1)>x) break;
		sw+=w;
	}
	return i;
};
$aaaa$.prototype.processTouch=function(){
	if(this.active===0) return;
	if(TouchInput.isCancelled()) this.doCancel(1);
	if(TouchInput.isMoved()){
		if(this._lastTouchI!==undefined){
			this.node_input.custom_setSelRange(this.processTouch2I(),this._lastTouchI);
		}else if(Input.isPressed('shift')){
			let tailAt=(this._textCursorAt_d==='backward'?this._textCursorAt_e:this._textCursorAt_s);
			this.node_input.custom_setSelRange(this.processTouch2I(),tailAt);
		}
	}
	if(TouchInput.isReleased()){
		if(this._lastTouchI!==undefined){
			this.node_input.custom_setSelRange(this.processTouch2I(),this._lastTouchI);
		}
	}
	if(TouchInput.isTriggered()){
		//debug.log([TouchInput.x,TouchInput.y]);
		this._lastTouchI=undef;
		let sel=this.processTouchAtChoice(TouchInput.x,TouchInput.y); // handling y
		if(sel>=0 && sel<3){
			if(sel===this._choice){
				this.doChoice();
				// cursor
				if(sel===0){
					let i=this.processTouch2I();
					if(Input.isPressed('shift')){
						let tailAt=(this._textCursorAt_d==='backward'?this._textCursorAt_e:this._textCursorAt_s);
						this.node_input.custom_setSelRange(i,tailAt);
					}else this.node_input.custom_setSelRange(this._lastTouchI=i);
					this.cursorBlinkState=this._textCursorBlinkCtr=0;
				}
			}else{ this._choice=sel; this.drawcursor(); SoundManager.playCursor(); }
		}
	}
};
$rrrr$=$aaaa$.prototype.processHandling;
$dddd$=$aaaa$.prototype.processHandling=function f(){
	//debug.log('Window_CustomTextInput.prototype.processHandling');
	if(this.active===0) return;
	if(this.processKey('ok')) this.doChoice();
	if(!this.isTyping()){
		if(this.isCancelTriggered()) this._choice=2; // parent handles the signal
		f.ori.call(this); // Input.update();
	}
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.doChoice=function(ch){
	//debug.log('Window_CustomTextInput.prototype.doChoice');
	switch(ch===undefined?this._choice:ch){
		case 0:
			// handled by keydown
			this.node_input.focus();
		break;
		case 1:
			this.doOk();
		break;
		case 2:
		default:
			this.doCancel();
		break;
	}
};
$aaaa$.prototype.doOk=function(){
	debug.log('Window_CustomTextInput.prototype.doOk');
	// input text ok: save back to 'this._dstObj[this._dstKey]'
	let lastCh=this._choice_;
	if(lastCh!==undefined) this._choice_=undefined;
	if(this._dstValid&&!this._dstValid(this.node_input.value)){
		SoundManager.playBuzzer();
		this.node_input.focus();
		this._choice=lastCh;
		return;
	}
	if(this.parent.constructor===Window_CustomMenu_main){
		SoundManager.playOk();
		this._choice=1; // ok
		this.parent.processCancel(1); // will call 'this.destructor'
	}else if(this.isOkEnabled()){
		debug.log('','this.isOkEnabled()');
		this.processOk(); this.destructor();
	}else{
		SoundManager.playOk();
		this.processCancel(1);
	}
};
$rrrr$=$aaaa$.prototype.update;
$dddd$=$aaaa$.prototype.update=function f(){
	let closing=this.isClosing();
	f.ori.call(this); // return undefined
	if(closing && !this.isClosing()) this.processCancel(1);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.doCancel=function(noParent){
	// input text cancel: don't save back to 'this._dstObj[this._dstKey]'
	debug.log('Window_CustomTextInput.prototype.doCancel');
		this._choice=2; // cancel
	if(this.isCancelEnabled()){
		//this.processCancel();
		SoundManager.playCancel();
		this.close(); // prevent triggering keydown after cancel
	}else if(this.parent&&this.parent.constructor===Window_CustomMenu_main){
		if(!noParent){ this.parent.processCancel(); } // will call 'this.destructor'
	}
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_CustomTextInput

// - - Window_CustomPopupMsg

function Window_CustomPopupMsg(){
	// design: used @ Scene_Map
	//	fixed string
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomPopupMsg;
$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.destructor=none;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize = function f(txt,kargs) {
	let self=this;
	kargs=kargs||{};
	let updateTimeInterval_ms=kargs['t_updateItvl']||88,remainedTime_ms=kargs['t_remained']||2000;
	this.txt=txt;
	this.align=kargs['align']||'left';
	//this.ctr=64+parseInt(remainedTime_ms/updateTimeInterval_ms).clamp(0,inf);
	let w=kargs['width']              ||(Graphics.boxWidth>>1),h=kargs['height']             ||this.fittingHeight(1);
	let x=kargs['x']===0?0:(kargs['x']|| Graphics.boxWidth-w ),y=kargs['y']===0?0:(kargs['y']||Graphics.boxHeight-h);
	
	let rtv=f.ori.call(this,x,y,w,h);
	// //this.redrawtxt();
	//this._itvl=setInterval(()=>{ if(self.redrawtxt()===0) clearInterval(self._itvl); },updateTimeInterval_ms);
	this.endTime=Date.now()+(kargs['t_remained']||2000);
	this.updateItvl=kargs['t_updateItvl']^0;
	this.ctr=0x7FFFFFFF;
	this._lastUpdateTime=0;
	//this.redrawtxt();
	return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.update=function(){let p=this.parent; if(p&&p.constructor!==Window_CustomPopups) this._update(Date.now());};
$aaaa$.prototype._update=function(t){
	// called by 'Window_CustomPopups'
	if(this.updateItvl==="no") return;
	if(t-this._lastUpdateTime>=this.updateItvl){
		if(t>=this.endTime) this.ctr=64;
		this.redrawtxt();
		this._lastUpdateTime+=this.updateItvl;
	}
};
$aaaa$.prototype.bye=function(){
	this.alpha=0;
	//clearInterval(this._itvl);
	if(this.parent) this.parent.removeChild(this);
	return 0;
};
$aaaa$.prototype.byeIfBye=function(){
	if(this.parent===null) return 0;
	if(this.alpha<0.015625 || 0>=this.y+this.height || this.y>=Graphics.boxHeight){
		return this.bye();
	}
};
$aaaa$.prototype.redrawtxt=function(forced){
	// rtv: 0:done_of_work, not going to do it again
	//if(this.byeIfBye()===0) return 0; // handled by 'Window_CustomPopupMsgs'
	if(--this.ctr<64) this.alpha*=0.875;
	
	//this.contents.clear(); // will measure text width, later clear
	
	//this.drawlinetext(this.txt,0);
	if(forced||this.strt===undefined){ switch(this.align){
		default:
		case 'left':
			this.strt=0;
		break;
		case 'center':{
			this.strt=(this.contents.width-this.drawTextEx(this.txt,0,0))>>1;
		}break;
		case 'right':{
			this.strt=this.contents.width-this.drawTextEx(this.txt,0,0); strtx*=0<strtx;
		}break;
	} this.contents.clear(); this.drawTextEx(this.txt,0,0); }
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_CustomPopupMsg

// - - Window_CustomRealtimeMsg

function Window_CustomRealtimeMsg(){
	// design: used @ Scene_Map
	//	for basic value type, i.e. Number,String,Boolean
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomRealtimeMsg;
$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.destructor;
$dddd$=$aaaa$.prototype.destructor=function f(){
	if(this._itvl!==undefined) clearInterval(this._itvl);
	return f.ori.apply(this,arguments);
}; $dddd$.ori=$rrrr$;
//$aaaa$.prototype.destructor=function(){ if(this._itvl) clearInterval(this._itvl); };
$aaaa$.prototype.processHandling=none;
$aaaa$.prototype.processTouch=none;
$aaaa$.prototype.processKey=none;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize = function f(srcObj,srcKey,kargs) {
	kargs=kargs||{};
	
	this._obj=srcObj;
	this._key=srcKey;
	this._lastVal=Math.random()+' - '+Math.random();
	this._align=kargs.align||'right';
	let w=kargs['width']||       127         ,h=kargs['height']||(this.fittingHeight(1));
	let x=kargs[  'x'  ]||Graphics.boxWidth-w,y=kargs[   'y'  ]||    0              ;
	f.ori.call(this,x,y,w,h);
	for(let i in kargs) this[i]=kargs[i];
	this.updateItvl^=0;
	this.redrawtxt();
	this._lastUpdateTime=Date.now();
	this._lastVal_min=this;
	//if(debug.isdebug()) window['????']=this;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.update=function(){
	if(this.parent.constructor!==Window_CustomRealtimeMsgs) return this._update();
};
$aaaa$.prototype._update=function(){
	// called by 'Window_CustomRealtimeMsgs' which is 'this.parent'
	if(this.updateItvl==="no") return;
	if(Date.now()-this._lastUpdateTime>=this.updateItvl){
		this.redrawtxt();
		this._lastUpdateTime+=this.updateItvl;
	}
};

$aaaa$.prototype.check=function(last,curr){ return last===curr; };
$aaaa$.prototype.getstr_min=function(){
	return (this._key.constructor===Function)?this._key(this._obj):this._obj[this._key];
};
$aaaa$.prototype.getstr=function(val){
	if(val===undefined) val=this.getstr_min()||"";
	return (this.head||"")+val.toString()+(this.tail||"");
};
$aaaa$.prototype.redrawtxt=function(){
	let txt_min=this.getstr_min();
	if(this._lastVal_min===txt_min) return;
	this._lastVal_min=txt_min;
	
	this.contents.clear();
	
	let strtx=0,strty=0*this.lineHeight();
	this.drawText(this._lastVal=this.getstr(this._lastVal_min),strtx,strty,this.contents.width,this._align);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_CustomRealtimeMsg

// - - Window_CustomRealtimeMsgs

function Window_CustomRealtimeMsgs(){
	// design: used @ Scene_Map
	//	for basic value type, i.e. Number,String,Boolean
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomRealtimeMsgs;
$aaaa$.prototype = Object.create(Window_Base.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(kargs){
	let self=this;
	kargs=kargs||{};
	
	let w=kargs['width']|| 127 ,h=kargs['height']||(this.fittingHeight(1));
	let x=kargs[  'x'  ]||  0  ,y=kargs[   'y'  ]|| 23 ;
	
	f.ori.apply(this,arguments);
	this.x=this.y=this.w=0;
	this._windows=[];
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.update=function(){ for(let x=0,arr=this._windows;x!==arr.length;++x) arr[x]._update(); };
$aaaa$.prototype.add=function(obj,key_or_getter,kargs){
	kargs=kargs||{};
	if(kargs.x===undefined) kargs.x=23;
	kargs.updateItvl=kargs.updateItvl||"no"; 
	let child=new Window_CustomRealtimeMsg(obj,key_or_getter,kargs);
	if(this._windows.length){
		let back=this._windows.back;
		if(kargs.y===undefined) child.y=back.y+back.height;
	}else child.y=55;
	this._windows.push(child);
	this.addChild(child);
	return child;
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_CustomRealtimeMsgs



