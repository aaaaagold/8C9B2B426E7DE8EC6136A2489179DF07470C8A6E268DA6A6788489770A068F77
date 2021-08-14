"use strict";
// CustomMenu2

// - Scene_CustomMenu2

function Scene_CustomMenu2(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_CustomMenu2;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_MenuBase.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.updateActor=none;
$pppp$.createOptionsWindow=none;
$r$=$pppp$.create;
$d$=$pppp$.create = function f() {
	f.ori.call(this);
	this.createOptionsWindow();
}; $d$.ori=$r$;
$pppp$.logSel=function(w){
	let t=$gamePlayer;
	if(!t) t=ConfigManager;
	if(!t.menuHistory) t.menuHistory={};
	let mh=t.menuHistory,key=this.constructor.name;
	if(mh[key]){
		w._lastSelItem=mh[key];
		let lastSelItem=w.lastSelItem();
		if(lastSelItem!==undefined) w._windows[0].select(lastSelItem);
	}else{
		mh[key]=w._lastSelItem;
	}
};
$d$=[-1,0]; $d$.length=1000000; for(let x=$d$.length;--x;) $d$[x]=x.toString().length;
$pppp$.log10Floor=$d$; 
$pppp$.toLocalISO=function(tTick){ return new Date(tTick).toLocalISO().replace(/[ ]+$/,''); };
$pppp$.mapStep=function(){
	if(1) return {
		x:"0:"+($gameMap.w-1)+":1"+($gameMap.isLoopHorizontal()?":rot":""),
		y:"0:"+($gameMap.h-1)+":1"+($gameMap.isLoopVertical  ()?":rot":"")
	};
	else return {
		x:"0:"+($gameMap.w-1)+":1",
		y:"0:"+($gameMap.h-1)+":1"
	};
};
$d$=$pppp$.showTileExample=function f(){
	let ctx=f.showDOM(),tileset=$dataTilesets[$gameMap._tilesetId];
	if(!tileset) return;
	let names=tileset.tilesetNames;
	if(!window['/tmp/']) return;
	let tid=Number(window['/tmp/'].tileExample)|0;
	if(tid<0||tid>=8192) return;
	if(Tilemap.isAutotile(tid)){
		//console.log("TODO: draw autotile"); return;
	
		// const
		const shape = Tilemap.getAutotileShape(tid);
		const ref=Tilemap.prototype._drawAutotile;
		const obj={tbl:ref.tbl};
		obj.kind = Tilemap.getAutotileKind(tid);
		obj.tx = obj.kind&7;
		obj.ty = obj.kind>>3;
		obj.tid=tid;
		obj.flags=tileset.flags;
		obj.aniFrm=0; //this.animationFrame;
	
		// will be edited
		obj.autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
		obj.bx = 0;
		obj.by = 0;
		obj.isTable = false;
	
		let setNumber=Tilemap.tileAn[tid]^0;
		Tilemap.prototype._drawAutotile.an_ori[setNumber].call(obj);
		setNumber-=setNumber!==0;
		
		let table = obj.autotileTable[shape];
		let source=ImageManager.loadTileset(names[setNumber]);
		source.addLoadListener(bm=>{
			if(!(bm._canvas.width&&bm._canvas.height)) return;
			if(!table) return;
			let w=ctx.canvas.width,h=ctx.canvas.height;
			ctx.clearRect(0,0,w,h);
			let w1=w>>1,h1=h>>1;
			for (let i=0,bx2=obj.bx<<1,by2=obj.by<<1,h1_=h1>>1,isTable=obj.isTable;i!==4;++i) {
				let qsx = table[i][0];
				let qsy = table[i][1];
				let sx1 = (bx2 + qsx) * w1;
				let sy1 = (by2 + qsy) * h1;
				let dx1 = (i&1) * w1;
				let dy1 = (i>>1) * h1;
				if(isTable && (qsy === 1 || qsy === 5)){
					let qsx2 = (qsy === 1)?(4-qsx)&3:qsx; // if qsy===1: qsx2 = [0, 3, 2, 1][qsx];
					let qsy2 = 3;
					let sx2 = (bx2 + qsx2) * w1;
					let sy2 = (by2 + qsy2) * h1;
					//bitmap.blt(source, sx2, sy2, w1, h1,  dx1, dy1, w1, h1);
					ctx.drawImage(bm._canvas , 
						sx2, sy2, w1, h1,  
						dx1, dy1, w1, h1
					);
					dy1+=h1_;
					//bitmap.blt(source, sx1, sy1, w1, h1_, dx1, dy1, w1, h1_);
					ctx.drawImage(bm._canvas , 
						sx1, sy1, w1, h1_, 
						dx1, dy1, w1, h1_
					);
				}else{
					//bitmap.blt(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
					ctx.drawImage(bm._canvas , 
						sx1, sy1, w1, h1, 
						dx1, dy1, w1, h1
					);
				}
			}
		});
	}else{
		let bm=ImageManager.loadTileset(names[Tilemap.tid2bid_normal(tid)]);
		bm.addLoadListener(bm=>{
			if(!(bm._canvas.width&&bm._canvas.height)) return;
			let w=ctx.canvas.width,h=ctx.canvas.height;
			ctx.clearRect(0,0,w,h);
			ctx.drawImage(bm._canvas , 
				( (( tid >>4)&8)+( tid &7) )*w , (( tid >>3)&15)*h, w , h , 
				0,0,w,h
			);
		});
	}
};
$d$.showDOM=()=>{
	let blk=d.ge("tileblk"); if(!blk){
		let closebtn=d.ce('div').at("close");
		closebtn.onclick=function(){this.parentNode.style.display="none";};
		d.body.ac( blk=d.ce('div').sa('id',"tileblk").ac(closebtn).ac(d.ce('canvas')) );
		let s=blk.style; s.position="absolute"; s.bottom=s.left="0px"; s.zIndex=2; s.color="white";
	}
	blk.style.display="block";
	let canvas=blk.childNodes[1]; canvas.width=$gameMap.tileWidth(); canvas.height=$gameMap.tileHeight();
	return canvas.getContext('2d');
};
$pppp$.deleteOn0=function(obj,key){if(obj[key]===0) delete obj[key];};
$pppp$.loadFileById=function(id,noSound){
	if(DataManager.loadGame(id)){
		if(!noSound) SoundManager.playLoad();
		SceneManager._scene.fadeOutAll();
		//SceneManager._scene.reloadMapIfUpdated();
		Scene_Load.prototype.reloadMapIfUpdated.call({}); // no 'this' inside
		SceneManager.goto(Scene_Map);
	}else if(!noSound) SoundManager.playBuzzer();
};
let Scene_CustomMenu=$aaaa$;
$d$=$r$=$aaaa$=undef;

// - Scene_Black

function Scene_Black(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Black;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$r$=$pppp$.create;
$d$=$pppp$.create=function f(){
	f.ori.call(this);
	this.setBackgroundOpacity(0);
}; $d$.ori=$r$;
$r$=$pppp$.start;
$d$=$pppp$.start=function f(){
	f.ori.call(this);
	let tmp=window['/tmp/'],ls=tmp._laterScenes;
	if(ls && ls.length){
		let sc=ls.pop();  ls.pop();
		SceneManager.goto(sc);
	}
}; $d$.ori=$r$;
if(!window['/tmp/']) window['/tmp/']={};
if(!window['/tmp/']._laterScenes) window['/tmp/']._laterScenes=[];
$d$=$r$=$aaaa$=undef;

// - Scene_OnlineLoadFail

function Scene_OnlineLoadFail(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_OnlineLoadFail;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_Black.prototype);
$pppp$.constructor = $aaaa$;
$r$=$pppp$.create;
$d$=$pppp$.create=function f(){
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
}; $d$.ori=$r$;
$d$=$r$=$aaaa$=undef;

// - Scene_DebugMenu2

function Scene_DebugMenu2(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_DebugMenu2;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;

$d$=$pppp$.createOptionsWindow=function f(){
	debug.log('Scene_DebugMenu2.prototype.createOptionsWindow');
	let lg10f=this.log10Floor;
	let loct=this.toLocalISO;
	let ms=this.mapStep();
	const del0=this.deleteOn0;
	const pp=Game_Party.prototype;
	const fin_i=function(obj,key){
		key=Number(key);
		del0.call(this,obj,key);
		$gameTemp.delCache($gameParty,pp.items.key);
		if(obj[key]) $gameParty._tbl_i().set(key,obj[key]);
		else $gameParty._tbl_i().delete(key);
	},fin_w=function(obj,key){
		key=Number(key);
		del0.call(this,obj,key);
		$gameTemp.delCache($gameParty,pp.weapons.key);
		if(obj[key]) $gameParty._tbl_w().set(key,obj[key]);
		else $gameParty._tbl_w().delete(key);
	},fin_a=function(obj,key){
		key=Number(key);
		del0.call(this,obj,key);
		$gameTemp.delCache($gameParty,pp.armors.key);
		if(obj[key]) $gameParty._tbl_a().set(key,obj[key]);
		else $gameParty._tbl_a().delete(key);
	};
	let lf=this.loadFileById;
	let itemMenu=$dataItems
		.filter(x => x!==null&&x.name&&x.name[0]!=='_')
		.map(x=>[x.id+": "+x.name,"$gameParty._items;"+x.id+";real;0::1",1,{final:fin_i}]);
	let weaponMenu=$dataWeapons
		.filter(x => x!==null&&x.name&&x.name[0]!=='_')
		.map(x=>[x.id+": "+x.name,"$gameParty._weapons;"+x.id+";real;0::1",1,{final:fin_w}]);
	let armorMenu=$dataArmors
		.filter(x => x!==null&&x.name&&x.name[0]!=='_')
		.map(x=>[x.id+": "+x.name,"$gameParty._armors;"+x.id+";real;0::1",1,{final:fin_a}]);
	let mapList_setting=(x)=>{
		return [
			["ok",";;func;call",1,()=>{ $gamePlayer.reserveTransfer(x.id,Number(window['/tmp/'].x)^0,Number(window['/tmp/'].y)^0); }],
			["x","window['/tmp/'];x;real;0::1",1],
			["y","window['/tmp/'];y;real;0::1",1],
		];
	};
	let tileExample=["?", "window['/tmp/'];tileExample;real;0:8191:1",1,{final:this.showTileExample}];
	let mapList=$dataMapInfos
		.filter(x=>x!==null)
		.map(x=>[x.id+": "+x.name,";;func;list",1,()=>{return mapList_setting(x);$gamePlayer.reserveTransfer(x.id,0,0);}])
	this._window = new Window_CustomMenu_main(0,0,[
		["debug pack",";;func;call", 1, f.debugPack],
		["DOM sizes",";domszs;func",1,[
			["outerWidth","window;outerWidth;real;::",0],
			["outerHeight","window;outerHeight;real;::",0],
			["innerWidth","window;innerWidth;real;::",0],
			["innerHeight","window;innerHeight;real;::",0],
			
			["body.offsetWidth","document.body;offsetWidth;real;::",0],
			["body.offsetHeight","document.body;offsetHeight;real;::",0],
			["body.clientWidth","document.body;clientWidth;real;::",0],
			["body.clientHeight","document.body;clientHeight;real;::",0],
		],],
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
					tileExample,
					["x", "$gamePlayer;x;real;"+ms.x, 0],
					["y", "$gamePlayer;y;real;"+ms.y, 0],
				],ch=function(obj,key){ // suppose map size is fixed
					const args={}; args[key]=obj[key];
					$gameParty.changeMap('tile',args);
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
					tileExample,
					["front x", "$gamePlayer;frontx;real;"+ms.x, 0],
					["front y", "$gamePlayer;fronty;real;"+ms.y, 0],
				],ch=function(obj,key){ // suppose map size is fixed
					const args={}; args[key]=obj[key];
					$gameParty.changeMap('tile',args);
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
				let a=$gameActors.actor(arr[x]);
				let s="$gameActors.actor("+arr[x]+")",getname=()=>{return a._name;};
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
			[$dataCustom.noteAppMgr,";noteApp;func;call",1, ()=>{SceneManager.push(Scene_NoteApp);} ],
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
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$d$.debugPack=notDev=>{
	let dev=!notDev;
	if(dev){
		$gameTemp.gainMsgConfigs_mute();
		_global_conf._halfFps=1;
		_global_conf.noGainHint=false;
	}
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
	let collects=[34,36,37,39,46,47,51,52,53,54,60,98,99,100,188,];
	for(let x=0,arr=collects;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1e3);
	let switches=[58,64,65,66,67,68,70,74,75,80,81,82,83,84,];
	if(dev) switches=switches.concat([44,79,]);
	for(let x=0,arr=switches;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1);
	let addons=[76,77,];
	for(let x=0,arr=addons;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1);
	let returns=[42,93,];
	for(let x=0,arr=returns;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1e3);
	let placing=[94,96,106,107,108,109,110,111,112,];
	for(let x=0,arr=placing;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1e4);
	let consume=[23,103,129,160,166,170,185,191,];
	for(let x=0,arr=consume;x!==arr.length;++x) pt.gainItem(itds[arr[x]],1e4);
	
	for(let i=5;i!==128;++i) if(i!==17&&i!==31) pt.gainItem(armds[i],1e3);
	
	let ws=[16,19,20,];
	for(let x=0,arr=ws;x!==arr.length;++x) pt.gainItem(wpnds[arr[x]],1e1);
	
	let ss=[12,43,44,];
	for(let x=0,arr=ss,L=$gameParty.leader();x!==arr.length;++x) L.learnSkill(arr[x]);
};
$d$=$r$=$aaaa$=undef; // END Scene_DebugMenu2

// - Scene_LoadLocal

function Scene_LoadLocal(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_LoadLocal;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.loadLocalFile=(_window)=>{
	let w=_window,self=this;
	if(!this.htmlele){
		let htmlele=d.ce("input").sa("type","file");
		htmlele.ref=this;
		//htmlele.oninput=function(){ console.log("input"); };
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
			if(0&&0)reader.onload=function(e){ // reserve it just in case something wrong...
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
			reader.onload=function(e){
				let buf=e.target.result;
				let u8arr=new Uint8Array(buf);
				try{
					DataManager.loadGame('callback',0,u8arr,{u8arr:true});
					delete DataManager.onlineOk;
					delete self.ref.fileReader;
				}catch(e){
					SoundManager.playBuzzer();
					$gameMessage.popup($dataCustom.fromLocalSaveLoadingImproper,1);
				}
				self.value='';
			};
			this.ref.fileReader=reader;
			//reader.readAsDataURL(this.files[0]);
			reader.readAsArrayBuffer(this.files[0]); // testing beta...
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
$pppp$.createOptionsWindow=function f(){
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
$d$=$r$=$aaaa$=undef; // END Scene_LoadLocal

// - Scene_LoadOnline

function Scene_LoadOnline(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_LoadOnline;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function f(){
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
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$d$=$r$=$aaaa$=undef; // END Scene_LoadOnline

// - Scene_LotteryList
function Scene_LotteryList(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_LotteryList;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function f(){
	debug.log('Scene_LotteryList.prototype.createOptionsWindow');
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
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this._window.statusWidth=()=>{return 240;};
	this.addWindow(this._window);
};
$d$=$r$=$aaaa$=undef; // END Scene_LotteryList

// - Scene_Apps

function Scene_Apps(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Apps;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function f(){
	debug.log('Scene_Apps.prototype.createOptionsWindow');
	let list=[];
	
	if($gameParty._apps){
		// enabled menu functions
		let t=$gameParty._apps;
		if(t.quest) list.push([$dataCustom.questMgr,";questMgr;func;call",1, ()=>{SceneManager.push(Scene_Quest);} ]);
		if(t.achievement) list.push([$dataCustom.achievementMgr,";achievement;func;call",1, ()=>{SceneManager.push(Scene_Achievement);} ]);
		if(t.locLog) list.push([$dataCustom.locLogMgr,";locLog;func;call",1, ()=>{SceneManager.push(Scene_LocLog);} ]);
		if(t.changeGame) list.push([$dataCustom.changeGameMgr,";changeGame;func;call",1, ()=>{SceneManager.push(Scene_ChangeGame);} ]);
		if(t.noteApp) list.push([$dataCustom.noteAppMgr,";noteApp;func;call",1, ()=>{SceneManager.push(Scene_NoteApp);} ]);
		//if(t.onlineSaves) list.push([$dataCustom.onlineSaveIdMgr,";onlineSaveId;func;call",1, ()=>{SceneManager.push(Scene_OnlineSaves);} ]);
	}
	
	if(list.length===0) list.push(["目前沒有"+$dataCustom.apps,";;func",0]);
	this._window = new Window_CustomMenu_main(0,0,list);
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this._window.statusWidth=()=>{return 240;};
	this.addWindow(this._window);
};
$d$=$r$=$aaaa$=undef; // END Scene_Apps

// - Scene_NoteApp

function Scene_NoteApp(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_NoteApp;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$d$=$pppp$.makeLeaveBtn=function f(txt){
	const c=Window_Selectable;
	let rtv=new c(0,0,Graphics.width , c.prototype.fittingHeight(1) );
	rtv._scene=this;
	rtv.drawText(txt||"按 ESC 或 點此 離開",0,0,Graphics.width,'center');
	//rtv.refresh=none;
	rtv.select(0);
	rtv.update=rtv.processTouch;
	rtv.maxItems=f.one;
	rtv.onTouch=f.onTouch;
	//rtv.main=this._window;
	return rtv;
};
$d$.onTouch=function(triggered){
	let lastIndex = this.index();
	let x = this.canvasToLocalX(TouchInput.x);
	let y = this.canvasToLocalY(TouchInput.y);
	let hitIndex = this.hitTest(x, y);
	if (triggered && hitIndex >= 0 && this.index() === hitIndex) {
		if(this.ref){
			this.ref.redrawtxt();
			this.ref.doCancel(1);
			this.ref.parent.processCancel();
		}else debug.warn("no ref");
	}
};
$d$.one=()=>1;
$d$=$pppp$.createOptionsWindow=function f(){
	debug.log('Scene_NoteApp.prototype.createOptionsWindow');
	const self=this;
	let list=[];
	
	list.push([$dataCustom.noteApp_new,";new;func;call",1,function(){
		const leave=self.makeLeaveBtn();
		let w=leave.ref=new Window_CustomTextArea();
		w.height-=(w.y=leave.height);
		SceneManager._scene.addWindow(leave);
		let r=w.destructor; w.destructor=function f(){
			leave.parent.removeChild(leave);
			leave.ref=undefined;
			let val=this._lines;
			let vxo=this._vxo;
			let ca=this.getCurAt();
			let sline=this._scrolledLine;
			let parent=this.parent;
			f.ori.call(this);
			$gameTemp.txt="note-"+Date.now();
			parent.addWindow({},new Window_CustomTextInput($gameTemp,'txt',{
				title:"note name",
				final:($,_)=>$gameParty.noteApp_save($[_],{lines:val,curAt:ca,scrolledLine:sline,vxo:vxo}),
			}));
		}; w.destructor.ori=r;
		this.parent.addWindow({},w);
	}]);
	
	list.push([$dataCustom.noteApp_edit,";edit;func;list",1,function(){
		let list=$gameParty.noteApp_list(),rtv=[];
		if(list) list.forEach(x=>{ rtv.push([x[0],";;func;call",1,function(){
			const leave=self.makeLeaveBtn();
			let w=leave.ref=new Window_CustomTextArea(x[1]);
			w.height-=(w.y=leave.height);
			SceneManager._scene.addWindow(leave);
			let r=w.destructor; w.destructor=function f(){
				leave.parent.removeChild(leave);
				leave.ref=undefined;
				let val=this._lines;
				let vxo=this._vxo;
				let ca=this.getCurAt();
				let sline=this._scrolledLine;
				f.ori.call(this);
				if(x[1].lines.equals(val)){
					x[1].curAt=ca;
					x[1].scrolledLine=sline;
					return;
				}
				$gameTemp.txt="note-"+Date.now();
				this.parent.addWindow({},new Window_CustomTextInput($gameTemp,'txt',{
					title:"note changed. input new note name to create new note or cancel to discard changes",
					final:($,_)=>$gameParty.noteApp_save($[_],{lines:val,curAt:ca,scrolledLine:sline,vxo:vxo}),
				}));
			}; w.destructor.ori=r;
			this.parent.addWindow({},w);
		}]); });
		if(rtv.length===0) rtv.push(["no notes",";;func",0]);
		return rtv;
	}]);
	
	list.push([$dataCustom.noteApp_chname,";ch;func;list",1,()=>{
		let list=$gameParty._noteApp,rtv=[];
		if(list) list.forEach((x,i)=> rtv.push(["原始名稱: "+x[0],"$gameParty._noteApp["+i+"];0;text;change note name",1]) );
		if(rtv.length===0) rtv.push(["no notes",";;func",0]);
		return rtv;
	}]);
	
	list.push([$dataCustom.noteApp_swap,";swap;func;list",1,()=>{
		$gameTemp._noteApp_swap=undefined;
		const list=$gameParty._noteApp,rtv=[];
		if(list) list.forEach((_,i)=>{
			const getname=()=>($gameTemp._noteApp_swap===i?' * ':'')+list[i][0];
			rtv.push([getname,";;func;call",1,function(){
				if($gameTemp._noteApp_swap===undefined) $gameTemp._noteApp_swap=i;
				else{
					const tmp=list[i]; list[i]=list[$gameTemp._noteApp_swap]; list[$gameTemp._noteApp_swap]=tmp;
					$gameTemp._noteApp_swap=undefined;
				}
				this.refresh();
			}]);
		});
		if(rtv.length===0) rtv.push(["no notes",";;func",0]);
		return rtv;
	}]);
	
	if($gameParty._apps && $gameParty._apps._noteApp_canExec) list.push([$dataCustom.noteApp_exec,";exec;func;list",1,()=>{
		let list=$gameParty._noteApp,rtv=[];
		if(list) list.forEach((x,i)=>{ rtv.push([x[0],";;func;call",1,function(){
			$gameMessage.popup($dataCustom.noteApp_exec+": \\key'\""+x[0].replace(/\\/g,"\\\\")+"\"'");
			try{
				objs._doFlow(x[1].lines.join('\n'));
				$gameMessage.popup($dataCustom.noteApp_exec_succ);
			}catch(e){
				this.parent.processCancel();
				$gameMessage.popup($dataCustom.noteApp_exec_fail);
				$gameParty.noteApp_save("exec err "+Date.now(),{lines: (e.stack||e).toString().split('\n') });
				$gameMessage.popup($dataCustom.noteApp_exec_fail_addednote);
			}
		}]); });
		if(rtv.length===0) rtv.push(["no notes",";;func",0]);
		return rtv;
	}]);
	
	list.push([$dataCustom.noteApp_delete,";del;func;list",1,()=>{
		let list=$gameParty._noteApp,rtv=[];
		if(list) list.forEach((x,i)=>{ rtv.push([x[0],";;func;call",1,function(){
			list.splice(i,1);
			this.parent.processCancel();
		}]); });
		if(rtv.length===0) rtv.push(["no notes",";;func",0]);
		return rtv;
	}]);
	
	this._window = new Window_CustomMenu_main(0,0,list);
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	//this._window.statusWidth=()=>{return 512;};
	this.addWindow(this._window);
};
$d$=$r$=$aaaa$=undef; // END Scene_NoteApp

// - Scene_Quest

function Scene_Quest(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Quest;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function f(){
	debug.log('Scene_Quest.prototype.createOptionsWindow');
	let wt=window['/tmp/'];
	let rnkMin=wt.rnkMin,rnkMax=wt.rnkMax,rnkNan=wt.rnkNan;
	delete wt.rnkMin; delete wt.rnkMax; delete wt.rnkNan; 
	this._window = $gameParty.genQuestReportWindow(rnkMin,rnkMax,rnkNan===undefined?true:rnkNan);
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this._window.statusWidth=()=>{return 240;};
	this.addWindow(this._window);
};
$d$=$r$=$aaaa$=undef; // END Scene_Quest

// - Scene_Achievement

function Scene_Achievement(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Achievement;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function(){
	let list=[];
	if($gameParty._achievement){ list.push(["已獲得的成就：",";;func",0]); for(let nl2="\n\n",nl4=nl2+nl2,x=0,arr=$gameParty._achievement;x!==arr.length;++x){
		if(!arr[x]) continue;
		let ac=$dataCustom.achievement[x];
		if(!ac||ac.constructor!==Array) continue;
		let txts=[];
		if(ac[3]) txts=ac[3];
		else{
			let re_dbs2sbs=/(^|[^\\])((\\\\)+)/g,rplc=(txt)=>txt.replace(re_dbs2sbs,function(){return (arguments[1]||"")+"\\".repeat(arguments[2].length>>1);});
			txts.push({txt:rplc(ac[0]),sizeRate:2,align:'center',color:$dataCustom.textcolor.achievement});
			if(ac[1]){ txts.push(nl4); txts.push({txt:"獲得方法：",sizeRate:1.5,color:$dataCustom.textcolor.default}); txts.push(nl2); txts.push({txt:rplc(ac[1])}); }
			if(ac[2]){ txts.push(nl4); txts.push({txt:rplc(ac[2]),sizeRate:0.75,align:'right'}); }
		}
		list.push([ac[0],";;func;call",1,function(){ this.parent.addWindow({},new Window_CustomTextBoard(txts)); }]);
	}}else list.push(["尚未獲得成就",";;func",0]);
	this._list=new Window_CustomMenu_main(0,0,list);
	this._list.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._list);
};
$d$=$r$=$aaaa$=undef; // END Scene_Achievement

// - Scene_LocLog

function Scene_LocLog(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_LocLog;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function(){
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
$d$=$r$=$aaaa$=undef; // END Scene_LocLog

// - Scene_ChangeGame

function Scene_ChangeGame(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_ChangeGame;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function(){
	let list=[
		["目前可將遊戲變更為下列遊戲",";;func",0],
	];
	if($gameParty._changeGame){
		let tmp=location.pathname.match(/\/([A-Za-z0-9]+)\.html$/);
		const done=()=>$gameMessage.popup("變更成功，回標題後即可遊玩該遊戲",true);
		const replace=(t)=>history.replaceState(undefined , document.title=$dataSystem.gameTitle, "./"+t+".html" + location.search + "#"+location.hash.slice(1) );
		if(!$gameParty._changeGame) list.push(["無法變更為其他遊戲",";;func",0]);
		else{
			if($gameParty._changeGame.ko){
				list.push(["拉起封鎖線",";ko;func;call",1,()=>{
					replace('keepout');
					done();
				}]);
			}
			if($gameParty._changeGame.mo){
				list.push(["1個人不夠, 你有試過2個人嗎?",";m;func;call",1,()=>{
					replace('more');
					done();
				}]);
			}
			if($gameParty._changeGame.bu){
				list.push(["燒毀",";b;func;call",1,()=>{
					replace('burn');
					done();
				}]);
			}
			if($gameParty._changeGame.rf){
				list.push(["燒毀",";b;func;call",1,()=>{
					replace('refrigerator');
					done();
				}]);
			}
		}
	}
	this._list=new Window_CustomMenu_main(0,0,list);
	this._list.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._list);
	this.logSel(this._list);
};
$d$=$r$=$aaaa$=undef; // END Scene_ChangeGame


// - Scene_OnlineSaves

function Scene_OnlineSaves(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_OnlineSaves;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function(){
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
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$d$=$r$=$aaaa$=undef; // END Scene_OnlineSaves

// - Scene_UserSwitch

function Scene_UserSwitch(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_UserSwitch;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
($pppp$.createOptionsWindow=function f(){
	debug.log('Scene_UserSwitch.prototype.createOptionsWindow');
	// 目前不是使用WebGL
	if(!f.list){ f.p_flw=[$dataCustom.flwingMsg,"_global_conf;flwingMsg"]; f.p=[
			[$dataCustom.noLeaderHp,"_global_conf;noLeaderHp"],
			[$dataCustom.noLeaderMp,"_global_conf;noLeaderMp"],
		]; f.pLen=f.p.length; f.list=[
		[$dataCustom.opts_gainHint,";gainHints;func",1,[
			[$dataCustom.noGainMsg,"_global_conf;noGainMsg"],
			[$dataCustom.noGainHint,"_global_conf;noGainHint"],
			[$dataCustom.noGainSound,"_global_conf;noGainSound"],
			[$dataCustom.lvUpMsg,"_global_conf;lvUpMsg"],
			[$dataCustom.lvUpHint,"_global_conf;lvUpHint"],
		]],
		[$dataCustom.opts_leftPanel,";leftPanel;func",1,f.p],
		[$dataCustom.opts_displayEffect,";displayEffect;func",1,[
			[$dataCustom.noAnimation,"_global_conf;noAnimation"],
			[$dataCustom.noAutotile,"_global_conf;noAutotile"],
			[$dataCustom.dmgPopMaxPerBtlr,"_global_conf;dmgPopMaxPerBtlr;real;0::1"],
			[$dataCustom.chasePopAfterFrame,"_global_conf;chasePopAfterFrame"],
		]],
		[$dataCustom.opt_characterControl,";characterControl;func",1,[
			[$dataCustom.simpleTouchMove,"_global_conf;simpleTouchMove"],
		]],
		["字體(電腦中需有該字體，本遊戲不另外提供)","_global_conf;useFont;text;請輸入想用的字體"],
		[_global_conf.sep,";;func",0],
		["FPS減半 (你覺得CPU快燒起來的時候可以用)","_global_conf;halfFps"],
		["強制不使用WebGL(可減少記憶體使用量,但可能會卡)，需要重開遊戲","localStorage.getItem('forceCanvas')==='1'?'ON':'OFF';;func;call",1,()=>{
			localStorage.setItem('forceCanvas',Number(localStorage.getItem('forceCanvas'))^1);
		}],
		[" - 目前是否使用WebGL","Graphics.isWebGL()?'yes':'no';;func",0],
		["顯示(或關閉)在左上角的FPS(或延遲)資訊",";;func;call",1,()=>{ Graphics._switchFPSMeter(); }],
		["顯示(或關閉)在右上角的暫停按鈕",";;func;call",1,()=>{ Graphics._switchPauseBtn(); }],
		[_global_conf.sep,";;func",0],
		["遊戲暫停(省電)",";;func;call",1,()=>SceneManager.pause()],
		[$dataCustom.clearMapDataCache,";;func;call",1,()=>{
			let f=m=>{
				let delList=[];
				m.forEach((v,k)=>k&&k.constructor===String&&k.slice(0,3)==="Map"&&delList.push(k));
				while(delList.length) m.delete(delList.pop());
			};
			f(DataManager.loadDataFile.cache.__addCnt);
			f(DataManager.loadDataFile.cache.__caches);
			$gameMessage.popup($dataCustom.clearMapDataCacheDone,true);
		}],
		[$dataCustom.clearJSCache,";clearJS;func",1,[
			[$dataCustom.clearJSCacheWarn,";;func",0],
			[$dataCustom.clearJSCacheConfirm,";;func;call",1,()=>{
				const keys=[];
				for(let x=0,xs=localStorage.length;x!==xs;++x){
					const key=localStorage.key(x);
					if(key && key.slice(0,confPrefix.length)===confPrefix) keys.push(key);
				}
				for(let x=0,xs=keys.length;x!==xs;++x) localStorage.removeItem(keys[x]);
				$gameMessage.popup($dataCustom.clearJSCacheDone,true);
			}],
		]],
		[$dataCustom.feedback,";;func;call",1,()=>{SceneManager.push(Scene_Feedback);}],
	]; }
	f.p.length=f.pLen;
	if(DataManager.getTitle()==="拉起封鎖線") f.p.push(f.p_flw);
	this._window = new Window_CustomMenu_main(0,0,f.list,f.mainKargs);
	this.logSel(this._window);
	this._window.setHandler('cancel',()=>{
		if(window['/tmp/'].chConfig){
			delete window['/tmp/'].chConfig;
			ConfigManager.save();
		}
		this.popScene();
	});
	this.addWindow(this._window);
}).mainKargs={
	statusWidth:()=>360,
	windowWidth:()=>this._width||Graphics.boxWidth-64,
};
$d$=$r$=$aaaa$=undef; // END Scene_UserSwitch

// - Scene_SaveLocal

function Scene_SaveLocal(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_SaveLocal;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.downloadSave=(compressedBase64Data)=>{
	let url="data:application/octet-stream;base64,"+compressedBase64Data,fname="save-"+Date.now();
	let htmlele=d.ce("a").sa("target","_blank").sa("href",url);
	htmlele.download=fname;
	htmlele.click();
	$gameMessage.popup("下載中...",1);
};
$pppp$.createOptionsWindow=function f(){
	debug.log('Scene_SaveLocal.prototype.createOptionsWindow');
	let lg10f=this.log10Floor;
	let loct=this.toLocalISO;
	let dlSave=this.downloadSave;
	
	let self=this;
	let lastDlTime=0;
	
	let list=[
		[$dataCustom.saveLocalFromList,";_dlSave;func",1,(()=>{
			let rtv=[],txt=StorageManager.load(0);
			let info=txt&&JSON.parse(txt)||{};
			StorageManager.lastJson_load0=info;
			for(let x=0,xs=DataManager.maxSavefiles()^0,maxNumLen=xs.toString().length;x++!==xs;){
				let f="File "+' '.repeat(maxNumLen-lg10f[x])+x;
				if(!info[x]){ rtv.push([f,";;func",0]); continue; }
				let id=x; rtv.push([f+" "+loct(info[x].timestamp)+" ",
					"DataManager.titleAddName(StorageManager.lastJson_load0["+id+"]);;func;call",
				1,()=>{
					if(Date.now()-lastDlTime<1111){
						$gameMessage.popup("請稍後再試",1);
						$gameMessage.popup("下載過於頻繁，瀏覽器可能會阻擋下載",1);
						return;
					}
					let key=StorageManager.webStorageKey(id);
					dlSave(localStorage.getItem(key));
					lastDlTime=Date.now();
					Input.clear();
				}]);
			}
			return rtv;
		})()],
		[$dataCustom.saveLocalCurrent,";;func;call",1,()=>{
			if(!objs.$gamePlayer) return $gameMessage.popup("錯誤: 沒有當下狀態",true);
			if(Date.now()-lastDlTime<1111){
				$gameMessage.popup("請稍後再試",true);
				$gameMessage.popup("下載過於頻繁，瀏覽器可能會阻擋下載",1);
				return;
			}
			let json=JsonEx.stringify(DataManager.makeSaveContents());
			dlSave(LZString.compressToBase64(json));
			lastDlTime=Date.now();
			Input.clear();
		}],
	];
	this._window = new Window_CustomMenu_main(0,0,list);
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$d$=$r$=$aaaa$=undef; // END Scene_SaveLocal

// - Scene_SaveOnline

function Scene_SaveOnline(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_SaveOnline;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function f(){
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
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$d$=$r$=$aaaa$=undef; // END Scene_SaveOnline

// - Scene_Feedback
function Scene_Feedback(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Feedback;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.createOptionsWindow=function(){
	const link_googleForm="https://docs.google.com/forms/d/e/1FAIpQLSdpwBjZEGg7K0fqFpMWjh3yObUpjQluFmZ2YS-OLu0TvoZkaQ/viewform";
	let list=[
		[$dataCustom.copyTitle,";;func;call",1,()=>{copyToClipboard(DataManager.getTitle());}],
		["使用google表單進行回饋",";;func;call",1,()=>{
			d.ce("a").sa("target","_blank").sa("href",link_googleForm).click();
			Input.clear();
			//debug.log("feedback: google form");
		}],
		["複製google表單的連結(無法從上述直接開新分頁時使用)",";;func;call",1,()=>{
			copyToClipboard(link_googleForm);
		}],
	//	["直接在遊戲內進行回饋(還沒做好)",";;func;call",1,()=>{
	//		let msg="錯誤:還沒做好";
	//		$gameMessage.popup(msg);
	//		$gameMessage.popup(msg,1);
	//	}],
	];
	this._list=new Window_CustomMenu_main(0,0,list);
	this._list.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._list);
};
$d$=$r$=$aaaa$=undef; // END Scene_Feedback

// - Window_TextOnly

function Window_TextOnly(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_TextOnly;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_DummyWithText.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.standardPadding=()=>0;
$pppp$.contentsWidth  = function(){ return this.width;  };
$pppp$.contentsHeight = function(){ return this.height; };
$pppp$.updateTransform = function(){
	this._updateContents();
	PIXI.Container.prototype.updateTransform.call(this);
};
$pppp$._createAllParts = function(){
	this._windowSpriteContainer = new PIXI.Container();
	this._windowBackSprite = new Sprite();
	this._windowContentsSprite = new Sprite();
	this._windowBackSprite.bitmap = new Bitmap(1, 1);
	this._windowBackSprite.alpha = 192 / 255;
	this._windowSpriteContainer.addChild(this._windowBackSprite);
	this.addChild(this._windowContentsSprite);
};
$pppp$._refreshAllParts = function(){
	this._refreshBack();
	this._refreshContents();
};
$pppp$._updateContents = function() {
	const w = this._width , h = this._height;
	if(w > 0 && h > 0){
		this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
		this._windowContentsSprite.visible = this.isOpen();
	}else{
		this._windowContentsSprite.visible = false;
	}
};
$pppp$.initialize=function(x,y,width,height){
	Window.prototype.initialize.call(this);
	this._windowSpriteContainer.visible=false;
	this.loadWindowskin();
	this.move(x, y, width, height);
	this.updatePadding();
	this.updateBackOpacity();
	this.createContents();
	this._opening = false;
	this._closing = false;
	this._dimmerSprite = null;
};
$pppp$.update=function(){
	Window.prototype.update.call(this);
	this._animationCount&=0x3fffffff;
	this.updateOpen();
	this.updateClose();
	this.updateBackgroundDimmer();
};
$d$=$r$=$aaaa$=undef; // END Window_TextOnly

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
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_Command.prototype);
$pppp$.constructor = $aaaa$;
makeDummyWindowProto($aaaa$);
$pppp$.makeCommandList=none;
$pppp$.processOk=none;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize = function f(x,y,commandLayers,kargs) {
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
}; $d$.ori=$r$;

$pppp$.reservedWidthL=64;
$pppp$.updatePlacement = function() { // preserved for windows
	// calc starting top-left xy
	if(this.nocenter) return;
	if(!this.nocenterx) this.x = (Graphics.boxWidth - this.width) / 2;
	if(!this.nocentery) this.y = (Graphics.boxHeight - this.height) / 2;
	if(this.fshx) this.x+=this.fshx; // final shift x
	if(this.fshy) this.y+=this.fshy; // final shift y
};

$pppp$.addWindow=function(kargs,w){
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
if(0&&0)$pppp$.newWindow_genNextFunc=function(cmd){
	return function(){
		debug.log('generate function',cmd);
		let kargs={cmdL:cmd[3]};
		this.parent.addWindow(kargs);
	};
};
$pppp$.newWindow=function(commandLayers,x,y,kargs){
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

$r$=$pppp$.processCancel;
$d$=$pppp$.processCancel=function f(noSound){
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
		const c=arr.pop();
		c.destructor(); if(c.parent) this.removeChild(c);
		this._selItem.pop();
		this.alpha*=2;
		for(let x=0;x!==arr.length;++x) arr[x].redrawDiffs();
		arr.back.active=1;
		if(!noSound) SoundManager.playCancel();
	}
	return;
}; $d$.ori=$r$;
$pppp$.selItem=function(idx,symbol){ // exe by child
	let arr=this._selItem;
	arr.pop();
	let key=JSON.stringify(arr);
	arr.push(symbol===undefined?idx:symbol);
	this._lastSelItem[key]=idx;
};
$pppp$.lastSelItem=function(){
	let arr=this._selItem;
	let tmp=arr.pop();
	let rtv=this._lastSelItem[JSON.stringify(arr)];
	arr.push(tmp);
	return rtv;
};
$d$=$r$=$aaaa$=undef; // END Window_CustomMenu_main









// - - Window_CustomMenu_child
	// constructor, displayed size and location, input handlers, maintain data, ... ?

function Window_CustomMenu_child() {
    this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomMenu_child;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_Command.prototype);
$pppp$.constructor = $aaaa$;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize = function f(parent,customOptions,x,y,kargs) {
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
}; $d$.ori=$r$;

$pppp$.statusWidth = function() {
	// |option                   | (current)status |
	// |(squeezed if too long)   | <-- statusWidth |
	let p=this._parent;
	if(p.statusWidth) return p.statusWidth.constructor===Function?p.statusWidth():p.statusWidth;
    return 264;
};
$pppp$.windowWidth = function() { return this._width||Graphics.boxWidth; };
$pppp$.windowHeight = function() { return this._height||this.fittingHeight(Math.min(this.numVisibleRows(), 15)); };
$r$=$pppp$.select;
$d$=$pppp$.select=function f(x){ x=x.clamp(-1,this._list.length-1);
	let key=x===-1?-1:this._list[x].symbol;
	this._parent.selItem(x,key); return f.ori.call(this,x);
}; $d$.ori=$r$;
$pppp$.selFirstEnabled=function(){
	debug.log('.selFirstEnabled');
	this.deselect();
	for(let x=0,arr=this._list;x!==arr.length;++x)
		if(arr[x].enabled){ this.select(x); return; }
};
$pppp$.redrawDiffs=function(){
	let redrawList=[];
	for(let index=0,arr=this._storage;index!==arr.length;++index)
		if(arr[index].lastTxt!==this.statusInfo(index).txt||this._list[index].name!==arr[index].lastCmdname)
			redrawList.push(index);
	for(let x=0,arr=redrawList;x!==arr.length;++x)
		this.redrawItem(arr[x]);
};
$pppp$.drawItem = function(index) {
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

$pppp$.processOk = function() {
	debug.log('Window_CustomMenu_child.prototype.processOk');
	if(this._index<0) return;
	this.changeValEntry("ok");
};
$pppp$.cursorRight =function(wrap) { debug.log('Window_CustomMenu_child.prototype.curR');this.changeValEntry("curR"); return; };
$pppp$.cursorLeft  =function(wrap) { debug.log('Window_CustomMenu_child.prototype.curL');this.changeValEntry("curL"); return; };
$r$=$pppp$.processHandling;
$d$=$pppp$.processHandling=function f(){
	if(this.everyTick) this.everyTick();
	f.ori.call(this);
}; $d$.ori=$r$;

$pppp$.parseStorageInfo=function(symbol){
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
$pppp$.getStorageInfo=function(index){
	if(this._storage[index]) return this._storage[index];
	if(this._storage.length<this._list.length) this._storage.length=this._list.length;
	return this._storage[index]=this.parseStorageInfo(this.commandSymbol(index));
};
$pppp$.booleanStatusText = function(value) { return value ? 'ON' : 'OFF'; };
$pppp$.statusInfo=function(index) {
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
$pppp$.genNextFunc=function(storage){
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
$r$=$pppp$.addCommand;
$d$=$pppp$.addCommand=function f(cmd){
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
}; $d$.ori=$r$;
$pppp$.removeCommand=function(index){ // type(index):int
	if(index<0 || index>=this._list.length) return 1;
	let S=this._storage,L=this._list;
	for(let x=index,last=L.length-1;x!==last;++x){
		L[x]=L[x+1];
		S[x]=S[x+1];
	}
	L.pop();
	S.pop();
};
$pppp$.removeCommandByTxt=function(txt){
	for(let arr=this._list,x=0,xs=arr.length;x!==xs;++x)
		if(arr[x].txt===txt){
			this.removeCommand(x);
			return;
		}
	return 1;
};
$pppp$.isNotEnabled_withSound=function(usrInput,idx){
	let rtv=!this._list[idx||this._index].enabled;
	if(rtv) SoundManager.playBuzzer();
	else SoundManager[usrInput===2?"playOk":"playCursor"]();
	return rtv;
};
$pppp$.changeVal_text=function(storage,usrInput){
	this._parent.addWindow({},new Window_CustomTextInput(storage.obj,storage.key,storage.tdetail));
};
$pppp$.changeVal_func=function(storage,usrInput){
	debug.log('Window_CustomWindow.prototype.changeVal_func');
	debug(this);
	this.genNextFunc(storage).call(this);
};$pppp$._none=none;
$pppp$.changeVal_real=function(storage,inc_0__dec_1=0){
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
$pppp$.changeVal_bool=function(storage){
	if(storage.obj){
		storage.obj[storage.key]^=1;
		//debug.log('Window_CustomWindow.prototype.changeVal_bool',storage,$gamePlayer.canDiag);
	}
};
$pppp$.__changeValEntry_mapping={"ok":2,"curL":1,"curR":0,"__dummy":-1};
$pppp$.changeValEntry=function(usrInput){
	if(this._index===-1) return;
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

$pppp$.makeCommandList = function() {
	if(this.addCustomOptions) this.addCustomOptions();
	return;
};
$d$=$r$=$aaaa$=undef; // END Window_CustomMenu_child



// - - Window_Message2

function Window_Message2(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_Message2;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_Message.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.processNewLine=function(textState){
	++textState.index;
	this._newLineWarning=true;
};
$pppp$.numVisibleRows=function(){
	return (Graphics.boxHeight - (this._btn_close&&this._btn_close.height||0) - (this.standardPadding()<<1)) / this.lineHeight();
};
$pppp$.subWindows=function f(){return f._dummy_arr;};
$d$=$pppp$.createSubWindows=function f(){
	this._maxTextWidth=0;
	this._scrollMax=0;
	// close btn
	const rtv=this._btn_close=Scene_NoteApp.prototype.makeLeaveBtn.call(this,"CLOSE");
	const h=rtv.height;
	this.y+=h;
	this.height+=rtv.y=-h;
	rtv.ref=this;
	rtv.onTouch=f.onTouch;
	this.addChild(rtv);
	return rtv;
};
$d$.onTouch=function(){
	this.close();
	this.ref.terminateMessage();
};
$pppp$.onTouch=function(triggered){
	this.touchUpDnArrowsPgUpDn(triggered,this) ||
		this.touchLfRhArrowsLfRh(triggered,this) ;
};
$pppp$.cursorLeft=function(){
	this.scrollx -= this._ww;
};
$pppp$.cursorRight=function(){
	this.scrollx += this._ww;
};
$pppp$.processPageup=function(){
	this.scrolly -= this._nvh;
};
$pppp$.processPagedown=function(){
	this.scrolly += this._nvh;
};
$t$=Window_ItemCategory.prototype;
$k$='processTouch';
$pppp$[$k$]=$t$[$k$];
$k$='isOpenAndActive';
$pppp$[$k$]=$t$[$k$];
$k$='isTouchedInsideFrame';
$pppp$[$k$]=$t$[$k$];
$pppp$.isCancelEnabled=none;
$pppp$.updatePlacement=none; // init: x=0;y=0;w=boxW;h=boxH;
$pppp$.canStart=function(){
	return this._canStart;
};
$pppp$.startMessage=function(){
	this._txt=$gameMessage._txt2.slice();
	this._lineCnt=$gameMessage._txt2.length;
	$gameMessage._txt2.length=0;
	this.inaline=true;
	this.scrollx=this.scrolly=0;
	this.scrolly=undefined;
	this._canScrolly=this._lineCnt-this.numVisibleRows();
	this._canScrolly*=this._canScrolly>0;
	this._canScrolly*=this.lineHeight();
	//this._maxTextWidth=0;
	this.rightArrowVisible=true;
	this.adjLrArrows=true;
	this._refreshArrows();
	this.updateBackground();
	this.open();
};
$pppp$.terminateMessage=function(){
	this._canStart=false;
	this.close();
};
$d$=$pppp$.redrawtxt=function f(){
	this.contents.clear();
	const sy=this.scrolly|0,lh=this.lineHeight(),my=this.numVisibleRows()*lh,arr=this._txt;
	const nd=arr.length.toString().length+2; // ". ".length===2
	const sx=this.textWidth(" ".repeat(nd));
	this.leftArrowVisible=this.scrollx>0;
	this.upArrowVisible=sy>0;
	this.downArrowVisible=false;
	const headers=[],mx=sx-this.scrollx; //,len=1+~~((this.contentsWidth()-mx)*nd/sx);
	for(let x=~~(sy/lh),y=x*lh-sy;x<arr.length;++x){
		const header=(x+1)+". ";
		this._newLineWarning=false;
		const dx=this.drawTextEx(arr[x],mx,y);
		//if(this._maxTextWidth<dx) this._maxTextWidth=dx;
		headers.push(header,y);
		if((y+=lh)>my){
			this.downArrowVisible=true;
			break;
		}
	}
	this.contents.fillRect(0,0,sx,my,f.tbl);
	for(let i=0;i!==headers.length;i+=2) this.drawText(" ".repeat(nd-headers[i].length)+headers[i] ,0,headers[i|1]);
};
$d$.tbl='rgba(0,0,0,0.5)';
$pppp$.update=function(){
	if(this.isClosed() && !this.isOpening()) return;
	Window_Base.prototype.update.call(this);
	if(this.isOpening() || this.isClosing()) return;
	if(this.scrolly===undefined){ // first draw
		this.scrollx=0;
		this.scrolly=0;
		this.redrawtxt();
	}
	const lastScrollx=this.scrollx,lastScrolly=this.scrolly;
	
	if(TouchInput.wheelX){
		this.scrollx+=TouchInput.wheelX;
	}
	if(TouchInput.wheelY){
		this.scrolly+=TouchInput.wheelY;
	}
	
	{
		const shift=Input.isTriggered('shift'),r=shift*9+1;
		const lf='left',rt='right',lh=this.lineHeight()*r,up="up",dn="down",pgup="pageup",pgdn="pagedown",home="home",ende="end";
		this._nvh=this.numVisibleRows()*lh*r;
		this._ww=r<<6;
		if(Input.isTriggered(lf) || Input.isRepeated(lf)){
			this.cursorLeft();
		}
		if(Input.isTriggered(rt) || Input.isRepeated(rt)){
			this.cursorRight();
		}
		if(Input.isTriggered(up) || Input.isRepeated(up)){
			this.scrolly -= lh;
		}
		if(Input.isTriggered(dn) || Input.isRepeated(dn)){
			this.scrolly += lh;
		}
		if(Input.isTriggered(pgup) || Input.isRepeated(pgup)){
			this.processPageup();
		}
		if(Input.isTriggered(pgdn) || Input.isRepeated(pgdn)){
			this.processPagedown();
		}
		if(Input.isTriggered(home)){
			this.scrolly = 0;
		}
		if(Input.isTriggered(ende)){
			this.scrolly = this._canScrolly;
		}
	}
	
	this.processTouch();
	
	if(this.scrollx<0) this.scrollx=0;
	this.scrolly=this.scrolly.clamp(0,this._canScrolly);
	if(this.scrollx!==lastScrollx||this.scrolly!==lastScrolly){
		SoundManager.playCursor();
		this.redrawtxt();
	}
	// if(this.isTriggered()) this.terminateMessage();
	if( Input.isRepeated('ok') || Input.isRepeated('cancel') ) this.terminateMessage();
};
$d$=$r$=$aaaa$=undef; // END Window_Message2



// - - Window_CustomTextBase

function Window_CustomTextBase(){
	// do not directly 'new' this class
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomTextBase;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_Selectable.prototype);
$pppp$.constructor = $aaaa$;
$r$=$pppp$.destructor;
$d$=$pppp$.destructor=function f(){
	//debug.log('Window_CustomTextBase.prototype.destructor');
	delete this._lastKeyStat;
	if(!textWidthCache) this._textWidthCache.length=0;
	f.ori.call(this);
}; $d$.ori=$r$;
//$pppp$.update=none; // needed
$pppp$.updateArrows=none;
$pppp$.processHandling=none;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize = function f(x,y,w,h) {
	this._textWidthCache=textWidthCache||[]; this._textWidthCache.length=65536;
	this._lastKeyStat={};
	let rtv=f.ori.call(this,x,y,w,h);
	this.active=true;
	if(!textWidthCache.size) textWidthCache.size=this.contents.fontSize;
	return rtv;
}; $d$.ori=$r$;
$pppp$.drawlinetext=function(text,line,align,startX){
	// line: 0-base ; align: 'left','center','right'
	align=align||'left';
	let strtx=startX||0,strty=line*this.lineHeight(),textw=this.textWidth(this.padTab?this.padTab(text):text);
	let maxWidth=this.contents.width-(this.textPadding()<<1)-strtx;
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
$r$=$pppp$.textWidth;
$d$=$pppp$.textWidth=function f(txt,ende){
	// ende must be int>=0 or undefined
	if(this.contents.fontSize!==this._textWidthCache.size) return f.ori.call(this,isNaN(ende)?txt:txt.slice(0,ende));
	let rtv=0;
	for(let x=0,xs=isNaN(ende)?txt.length:Math.min(ende,txt.length);x!==xs;++x){
		let cc=txt.charCodeAt(x);
		if(!this._textWidthCache[cc]) this._textWidthCache[cc]=f.ori.call(this,txt[x]);
		rtv+=this._textWidthCache[cc];
	}
	return rtv;
}; $d$.ori=$r$;
$pppp$.redrawtxt=function(){this.contents.clear();};
$pppp$.redrawDiffs=function(){
	// only 'ok' will update the value, and when this happens, 
	// '_parent.processCancel' will be executed, 
	// then 'child.redrawDiffs' being executed
	//if(this._parent&&this._parent.redrawDiffs) this._parent.redrawDiffs();
};
$pppp$.processKey=function(key){
	let k=Input.isPressed(key);
	let rtv=k&&!this._lastKeyStat[key]
	this._lastKeyStat[key]=k;
	return rtv;
};
$pppp$.setScrollNum_processWheel=function(){
	let delta=(TouchInput.wheelY<0)-(TouchInput.wheelY>0);
	return delta;
};
$pppp$.setScrollNum=function(){
	debug.log('Window_CustomTextBase.prototype.setScrollNum');
	this.processWheel=this.setScrollNum_processWheel;
	return;
};
$d$=$r$=$aaaa$=undef;


// - - Window_CustomTextBoard

function Window_CustomTextBoard(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomTextBoard;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$pppp$.constructor = $aaaa$;
$r$=$pppp$.destructor;
$d$=$pppp$.destructor=function f(){
	//debug.log('Window_CustomTextBoard.prototype.destructor');
	if(this._oribodykeydown!==undefined) d.body.onkeydown=this._oribodykeydown;
	return f.ori.call(this);
}; $d$.ori=$r$;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize = function f(txtinfos,kargs) {
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
}; $d$.ori=$r$;
$pppp$.lineHeight=Window_Base.prototype.lineHeight;
$pppp$.standardFontSize=Window_Base.prototype.standardFontSize;

$pppp$.processHandling=function(){
	if (SceneManager._nextScene===null && this.isCancelEnabled() && this.isCancelTriggered()) this.processCancel();
};
$pppp$.processWheel=function(){
	if(!TouchInput.wheelY) return;
	this.scrolly=(this.scrolly+TouchInput.wheelY).clamp(0,this._canScroll);
	this.redrawtxt();
};

$pppp$._redrawtxt_parseColor=function(txt,strt){
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
$pppp$.updateInfos=function(txtinfos,kargs){
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
$d$=$pppp$.redrawtxt=function f(measuringHeight){
	if(measuringHeight && this.noScroll) return this._canScroll=0;
	this.contents.clear();
	let pad=this.textPadding(),LH_ori=this.lineHeight(),LH_last=LH_ori,xe=this.contents.width-(pad<<1),ye=this.contents.height+this.scrolly;
	let currx=0,curry=pad,currLine=0;
	let font_ori={
		fontSize:this.contents.fontSize,
		textColor:this.contents.textColor,
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
$d$.parseUTF8=function f(txt){return txt.replace(f.re,function(){return (arguments[1]||"")+(arguments[2]||"")+String.fromCharCode(arguments[3]);})};
$d$.parseUTF8.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_utf8.toString().slice(5,-2)+
"",'g');
$d$.parseCODE=function f(txt){return txt.replace(f.re,function(){
	return (arguments[1]||"")+(arguments[2]||"")+eval(arguments[3]);
})};
$d$.parseCODE.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_code.toString().slice(5,-2)+
"",'g');
$d$.parsekeyword=function f(txt){
	return txt.replace(f.re,function(){
		return (arguments[1]||"")+(arguments[2]||"")+ "\\RGB["+$dataCustom.textcolor.keyword.replace("$","$$")+"]"+
			eval(arguments[3])
		+"\\RGB["+$dataCustom.textcolor.default+"]";
	});
};
$d$.parsekeyword.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_keyword.toString().slice(5,-2)+
"",'g');
$d$.parseitem=function f(txt){
	return txt.replace(f.re,function(){
		let item=$dataItems[Number(arguments[3])];
		return (arguments[1]||"")+(arguments[2]||"")+ "\\RGB["+$dataCustom.textcolor.item.replace("$","$$")+"]"+(item&&item.name||"")+"\\RGB["+$dataCustom.textcolor.default+"]";
	});
};
$d$.parseitem.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_item.toString().slice(5,-2)+
"",'g');
$d$.parsequest=function f(txt){
	return txt.replace(f.re,function(){
		let item=$dataItems[Number(arguments[3])];
		return (arguments[1]||"")+(arguments[2]||"")+ "\\RGB["+$dataCustom.textcolor.quest.replace("$","$$")+"]"+(item&&item.name||"")+"\\RGB["+$dataCustom.textcolor.default+"]";
	});
};
$d$.parsequest.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\"+
	Window_Base.prototype.convertEscapeCharacters.re_quest.toString().slice(5,-2)+
"",'g');
$d$.toMyColor=function f(txt){ return txt.replace(f.re,"$1$2_$3"); };
$d$.toMyColor.re=new RegExp("(^|[^\\\\\])(\\\\\\\\)*\\\\RGBA?("+
	Window_Base.prototype.processEscapeCharacter.re.toString().slice(2,-1)+
")",'g');
	// \RGB[#000000] -> _RGB[#000000]
		// \\\\ in str -> \\ 
		// RegExp get \\ -> match \ 
		//   =>  \\\\ -> \ 
$d$=$r$=$aaaa$=undef; // END Window_CustomTextBoard

// - - Window_CustomTextInput

function Window_CustomTextInput(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomTextInput;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$pppp$.constructor = $aaaa$;
makeDummyWindowProto($aaaa$,true,true);
$r$=$pppp$.destructor;
$d$=$pppp$.destructor=function f(){
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
	$gameTemp._inputting=false;
	return rtv;
}; $d$.ori=$r$;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize = function f(dstObj,dstKey,txtdetail,kargs) {
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
	this.node_dummy.onfocus=function(){$gameTemp._inputting=false;};
	this.node_input.onfocus=function(){$gameTemp._inputting=true ;this.ref._choice=0;};
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
				if(Input.isPressed('control')){
					let str=this.value,tmp=curAt;
					while(curAt>0&&f.tbl[str.charCodeAt(curAt-1)]) --curAt;
					curAt-=curAt===tmp;
					while(curAt>0&&str[curAt-1]===str[curAt]) --curAt;
				}else --curAt;
				curAt=curAt.clamp(0,this.value.length);
				this.custom_setSelRange(curAt,Input.isPressed('shift')?posTail:curAt);
			}break;
			case 39: { // right arrow
				if(Input.isPressed('control')){
					let str=this.value,tmp=curAt,len=str.length;
					while(curAt<len&&f.tbl[str.charCodeAt(curAt)]) ++curAt;
					curAt+=curAt===tmp;
					while(curAt<len&&str[curAt-1]===str[curAt]) ++curAt;
				}else ++curAt;
				curAt=curAt.clamp(0,this.value.length);
				this.custom_setSelRange(curAt,Input.isPressed('shift')?posTail:curAt);
			}break;
		}
	};
	this._textCursorAt_s=this.node_input.value.length;
	this._textCursorAt_e=this.node_input.value.length;
	//this.redrawtxt();
	this.node_input.focus();
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
}; $d$.ori=$r$;
$d$.tbl=[];
for(let x='0'.charCodeAt(),xh='9'.charCodeAt();x<=xh;++x) $d$.tbl[x]=true;
for(let x='A'.charCodeAt(),xh='Z'.charCodeAt();x<=xh;++x) $d$.tbl[x]=true;
for(let x='a'.charCodeAt(),xh='z'.charCodeAt();x<=xh;++x) $d$.tbl[x]=true;

$pppp$.isTyping=function(){
	return this._choice===0;
};
$pppp$.setScrollNum_processWheel=function(){
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
$pppp$.setScrollNum=function(){
	debug.log('setScrollNum');
	this.processWheel=this.setScrollNum_processWheel;
	return;
};

$pppp$.drawcursor=function(){
	// item cursor
	// draw @line according to this._choice
	this.setCursorRect( 0, (this._choice+1)*this.lineHeight(), this.width, this.lineHeight() );
};
$pppp$.redrawtxt=function(){
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

$pppp$.processKey=function(key){
	let k=Input.isPressed(key);
	let rtv=k&&!this._lastKeyStat[key]
	this._lastKeyStat[key]=k;
	return rtv;
};
$pppp$.processTouchAtLine=function(x,y){
	let lineH=this.lineHeight(),pad=this.standardPadding();
	let line=parseInt((y-(this.y+pad)+lineH)/lineH)-1;
	debug.log(this.y,pad,y,lineH);
	return (line>=0&&x>=pad&&x+pad<this.width)?line:-1;
};
$pppp$.processTouchAtChoice=function(x,y){
	return this.processTouchAtLine(x,y)-1;
};
$pppp$.processTouch2I=function(){
	let OAO=this.drawlinetext(this.node_input.value,-1);
	let x=(TouchInput.x-OAO.x-this.standardPadding()-this.x)/(OAO.w/OAO.ow);
	let i=0; for(let sw=0,s=this.node_input.value;i!==s.length;++i){
		let w=this.textWidth(s[i]);
		if(sw+(w>>1)>x) break;
		sw+=w;
	}
	return i;
};
$pppp$.processTouch=function(){
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
$r$=$pppp$.processHandling;
$d$=$pppp$.processHandling=function f(){
	//debug.log('Window_CustomTextInput.prototype.processHandling');
	if(this.active===0) return;
	if(this.processKey('ok')) this.doChoice();
	if(!this.isTyping()){
		if(this.isCancelTriggered()) this._choice=2; // parent handles the signal
		f.ori.call(this); // Input.update();
	}
}; $d$.ori=$r$;
$pppp$.doChoice=function(ch){
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
$pppp$.doOk=function(){
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
$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	let closing=this.isClosing();
	f.ori.call(this); // return undefined
	if(closing && !this.isClosing()) this.processCancel(1);
}; $d$.ori=$r$;
$pppp$.doCancel=function(noParent){
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
$d$=$r$=$aaaa$=undef; // END Window_CustomTextInput

// - - Window_CustomPopupMsg

function Window_CustomPopupMsg(){
	// design: used @ Scene_Map
	//	fixed string
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomPopupMsg;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$pppp$.constructor = $aaaa$;
makeDummyWindowProto($aaaa$,true);
//$pppp$.destructor=none;
$pppp$.initialize_content=function(txt,kargs){
	kargs=kargs||{};
};
$r$=$pppp$.initialize;
$d$=$pppp$.initialize = function f(txt,kargs) {
	kargs=kargs||{};
	let w=kargs['width']              ||(Graphics.boxWidth>>1),h=kargs['height']             ||this.fittingHeight(1);
	let x=kargs['x']===0?0:(kargs['x']|| Graphics.boxWidth-w ),y=kargs['y']===0?0:(kargs['y']||Graphics.boxHeight-h);
	let rtv;
	if(this.parent){
		if(this.width!==w) this.width=w;
		if(this.height!==h) this.height=h;
		this.x=x;  this.y=y;
	}else rtv=f.ori.call(this,x,y,w,h);
	
	//let updateTimeInterval_ms=kargs['t_updateItvl']||88,remainedTime_ms=kargs['t_remained']||2000;
	this.txt=txt;
	this.align=kargs['align']||'left';
	this.endTime=Date.now()+(kargs['t_remained']||2000);
	this.updateItvl=kargs['t_updateItvl']^0;
	this.ctr=0x7FFFFFFF;
	this._lastUpdateTime=0;
	//this.redrawtxt();
	return rtv;
}; $d$.ori=$r$;
$pppp$.update=function(){let p=this.parent; if(p&&p.constructor!==Window_CustomPopups) this._update(Date.now());};
$pppp$._update=function(t){
	// called by 'Window_CustomPopups'
	if(this.updateItvl==="no") return;
	if(t-this._lastUpdateTime>=this.updateItvl){
		if(t>=this.endTime) this.ctr=64;
		this.redrawtxt();
		this._lastUpdateTime+=this.updateItvl;
	}
};
$pppp$.bye=function(){
	this.alpha=0;
	//clearInterval(this._itvl);
	if(this.parent) this.parent.removeChild(this);
	return 0;
};
$pppp$.byeIfBye=function(){
	if(this.parent===null) return 0;
	if(this.alpha<0.015625 || 0>=this.y+this.height || this.y>=Graphics.boxHeight){
		return this.bye();
	}
};
$pppp$.redrawtxt=function(forced){
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
			this.strt=this.contents.width-this.drawTextEx(this.txt,0,0); this.strtx*=0<this.strtx;
		}break;
	} this.contents.clear(); this.drawTextEx(this.txt,this.strt,0); }
};
$d$=$r$=$aaaa$=undef; // END Window_CustomPopupMsg

// - - Window_CustomRealtimeMsg

function Window_CustomRealtimeMsg(){
	// design: used @ Scene_Map
	//	for basic value type, i.e. Number,String,Boolean
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomRealtimeMsg;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$pppp$.constructor = $aaaa$;
makeDummyWindowProto($aaaa$,true,true);
$r$=$pppp$.destructor;
$d$=$pppp$.destructor=function f(){
	if(this._itvl!==undefined) clearInterval(this._itvl);
	return f.ori.apply(this,arguments);
}; $d$.ori=$r$;
$pppp$.processHandling=none;
$pppp$.processTouch=none;
$pppp$.processKey=none;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize = function f(srcObj,srcKey,kargs) {
	kargs=kargs||{};
	
	this._obj=srcObj;
	this._key=srcKey;
	this._lastVal=Math.random()+' - '+Math.random();
	this._align=kargs.align||'right';
	this.fontSize=kargs.fontSize;
	let w=kargs['width']||       127         ,h=kargs['height']||(this.fittingHeight(1));
	let x=kargs[  'x'  ]||Graphics.boxWidth-w,y=kargs[   'y'  ]||    0              ;
	f.ori.call(this,x,y,w,h);
	for(let i in kargs) this[i]=kargs[i];
	this.updateItvl^=0;
	this.redrawtxt();
	this._lastUpdateTime=Date.now();
	this._lastVal_min=this;
	//if(debug.isdebug()) window['????']=this;
}; $d$.ori=$r$;
$pppp$.update=function(){
	if(this.parent.constructor!==Window_CustomRealtimeMsgs) return this._update();
};
$d$=$pppp$._update=function f(){
	// called by 'Window_CustomRealtimeMsgs' which is 'this.parent'
	if(this.updateItvl===f.no) return;
	if(Date.now()-this._lastUpdateTime>=this.updateItvl){
		this.redrawtxt();
		this._lastUpdateTime+=this.updateItvl;
	}
};
$d$.no="no";
$d$=undef;

$pppp$.check=function(last,curr){ return last===curr; };
$pppp$.getstr_min=function(){
	return (this._key.constructor===Function)?this._key(this._obj):this._obj[this._key];
};
$pppp$.getstr=function(val){
	if(val===undefined) val=this.getstr_min()||"";
	return (this.head||"")+val.toString()+(this.tail||"");
};
$pppp$.redrawtxt=function(){
	let txt_min=this.getstr_min();
	if(this._lastVal_min===txt_min) return;
	this._lastVal_min=txt_min;
	
	this.contents.clear();
	
	let strtx=0,strty=0*this.lineHeight();
	this.drawText(this._lastVal=this.getstr(this._lastVal_min),strtx,strty,this.contents.width,this._align);
};
$d$=$r$=$aaaa$=undef; // END Window_CustomRealtimeMsg

// - - Window_CustomRealtimeMsgs

function Window_CustomRealtimeMsgs(){
	// design: used @ Scene_Map
	//	for basic value type, i.e. Number,String,Boolean
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomRealtimeMsgs;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_Base.prototype);
$pppp$.constructor = $aaaa$;
makeDummyWindowProto($aaaa$);
$r$=$pppp$.initialize;
$d$=$pppp$.initialize=function f(kargs){
	let self=this;
	kargs=kargs||{};
	
	let w=kargs['width']|| 127 ,h=kargs['height']||(this.fittingHeight(1));
	let x=kargs[  'x'  ]||  0  ,y=kargs[   'y'  ]|| 23 ;
	
	f.ori.apply(this,arguments);
	this.x=this.y=this.w=0;
	this._windows=[];
	this.fontSize=kargs.fontSize;
}; $d$.ori=$r$;
$pppp$.update=function(){ for(let x=0,arr=this._windows;x!==arr.length;++x) arr[x]._update(); };
$d$=$pppp$.add=function f(obj,key_or_getter,kargs){
	kargs=kargs||{};
	if(kargs.x===undefined) kargs.x=23;
	kargs.updateItvl=kargs.updateItvl||f.no; 
	kargs.fontSize=this.standardFontSize();
	let child=new Window_CustomRealtimeMsg(obj,key_or_getter,kargs);
	if(this._windows.length){
		let back=this._windows.back;
		if(kargs.y===undefined) child.y=back.y+back.height;
	}else child.y=55;
	this._windows.push(child);
	this.addChild(child);
	return child;
};
$d$.no=Window_CustomRealtimeMsg.prototype._update.no;
$pppp$.del=function(c){
	let idx=this._windows.indexOf(c);
	if(idx===-1) return;
	let arr=this._windows;
	for(let x=idx+1;x!==arr.length;++x) arr[x-1]=arr[x];
	arr.pop();
	return this.removeChild(c);
};
$d$=$r$=$aaaa$=undef; // END Window_CustomRealtimeMsgs

// - Scene_Note

function Scene_Note(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_Note;
if(typeof objs!=='undefined') objs[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Scene_MenuBase.prototype);
$pppp$.constructor = $aaaa$;
$r$=$pppp$.create;
$d$=$pppp$.create=function f(){
	f.ori.call(this);
	let wl=new Window_CustomMenu_main(0,0,[]);
	wl.addWindow(none,this._txtarea=new Window_CustomTextArea);
	wl.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(wl);
	//this.addChild(this._txtarea=new Window_CustomTextArea);
}; $d$.ori=$r$;

$d$=$r$=$aaaa$=undef; // END Scene_Note

// - Window_CustomTextArea // TODO: non-compressed-width printing

function Window_CustomTextArea(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomTextArea;
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype = Object.create(Window_CustomTextBase.prototype);
$pppp$.constructor = $aaaa$;
$r$=$pppp$.destructor;
$d$=$pppp$.destructor=function f(){
	[this.node_dummy,this.node_input,this.node_copy].forEach(c=>c.parentNode.removeChild(c));
	f.ori.call(this);
	d.body.onkeydown=this._oribodykeydown;
	$gameTemp._inputting=false;
	//Window_CustomTextInput.prototype.destructor.call(this);
}; $d$.ori=$r$;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize=function f(kargs){
	kargs=kargs||{};
	const self=this;
	
	let x=kargs[  'x'  ]||        0         ,y=kargs[   'y'  ]||    0              ;
	let w=kargs['width']||Graphics.boxWidth ,h=kargs['height']||Graphics.boxHeight ;
	this.cursorBlinkPeriod=kargs['cursorBlinkPeriod']||17;
	f.ori.call(this,x,y,w,h);
	Window_CustomMenu_main.prototype.updatePlacement.call(this);
	
	this._tabWidth=kargs.tabWidth||8;
	this._lines=kargs.lines||[''];
	this._lineNum=kargs.lineNum||0;
	this._lineOffsets=[0,0];
	this._lineXys=[{x:0,y:0}];
	this._reservedLine=!isNaN(kargs.reservedLine)?Number(kargs.reservedLine):1;
		if(this._reservedLine<0) this._reservedLine=0;
	this._scrolledLine=!isNaN(kargs.scrolledLine)?Number(kargs.scrolledLine):this._lineNum-this._reservedLine;
		if(this._scrolledLine<0) this._scrolledLine=0;
	this._vxo=kargs.vxo||0; // view-x-offset
	this._nuPad=this.textWidth("1. ");
	this._mode;
	
	d.body.ac(this.node_dummy=d.ce("input").sa("class","outofscreen").sa("inputmode","none"));
	this.node_dummy.oninput=function(){this.value="";};
	d.body.ac(this.node_input=d.ce("textarea").sa("class","outofscreen txtin"));
	this.node_input.value=this._lines.join('\n');
	d.body.ac(this.node_copy=d.ce("textarea").sa("class","outofscreen none").sa("inputmode","none"));
	
	let node=this.node_input;
	this._oribodykeydown=d.body.onkeydown;
	d.body.onkeydown=function(e){
		if(!node.ref.active) return;
		if(node.ref._choice===0) node.focus();
		else node.ref.node_dummy.focus();
	};
	this.node_input.ref=this;
	this._textCursorAt_s=0;
	this._textCursorAt_e=0;
	this._textCursorAt_d='';
	this._textCursorBlinkCtr=0;
	this.cursorBlinkState=0;
	
	this.node_dummy.onfocus=function(){$gameTemp._inputting=false;};
	this.node_input.onfocus=function(){$gameTemp._inputting=true ;this.ref._choice=0;};
	this.node_input.custom_updateCursorInfo=this.__custom_updateCursorInfo;
	this.node_input.custom_setSelRange=this.__custom_setSelRange;
	this.node_input.custom_setSelRange(kargs.curAt||0);
	
	this.node_input.onkeyup=this.node_input.oninput=function(e){ this.custom_updateCursorInfo(e); };
	this.node_input.onpaste=function(e){
		const txt=e.clipboardData.getData("text/plain");
		this.style.display="none"; // will prevent pasting
		let pos_s=e.target.selectionStart;
		let pos_e=e.target.selectionEnd;
		const pos_d=e.target.selectionDirection;
		const backward=pos_d==="backward";
		this.value=this.value.slice(0,pos_s)+txt+this.value.slice(pos_e);
		this.custom_setSelRange((pos_s)+txt.length);
	};
	this.node_input.onkeydown=function(e){
		this.custom_updateCursorInfo(e);
		let pos_s=e.target.selectionStart;
		let pos_e=e.target.selectionEnd;
		const pos_d=e.target.selectionDirection;
		//debug.log("d",pos_s,pos_e,pos_d);
		//debug.log('',"L",Input.isPressed('left')); debug.log('',"R",Input.isPressed('right')); debug.log('',"sh",Input.isPressed('shift'));
		//debug.log('',e.keyCode);
		this.ref._textCursorBlinkCtr=this.ref.cursorBlinkState=0;
		const backward=pos_d==="backward";
		let curAt  =backward?pos_s:pos_e;
		let posTail=backward?pos_e:pos_s;
		this.ref._lastInputTime=Date.now();
		switch(e.keyCode){
			default: return;
			case 8: { // backspace
				pos_s-=pos_s===pos_e; pos_s=pos_s.clamp(0,inf);
				this.value=this.value.slice(0,pos_s)+this.value.slice(pos_e);
				this.custom_setSelRange(pos_s);
			}break;
			case 9:{ // tab
				if(pos_s===pos_e){
					this.value=this.value.slice(0,pos_s)+'\t'+this.value.slice(pos_s);
					this.custom_setSelRange(++pos_s);
				}else{ // TODO: tab all lines
					const ref=this.ref;
					const nu_s=ref.toLineNum(pos_s);
					const nu_e=ref.toLineNum(pos_e);
					const stab=ref._lineOffsets[nu_s]!==pos_s&&ref._lines[nu_s][0]==='\t'; // (back) squeeze tab
					const shift=Input.isPressed('shift');
					let cnt=0;
					for(let n=nu_s,ns=nu_e+1,arr=ref._lines;n!==ns;++n){
						if(shift){
							if(arr[n][0]==='\t'){
								++cnt;
								arr[n]=arr[n].slice(1);
							}
						}else arr[n]="\t"+arr[n];
					}
					this.value=ref._lines.join('\n');
					let strt,ende,dir='';
					if(shift){pos_s-=stab;pos_e-=cnt;}
					else{pos_s+=1;pos_e+=nu_e-nu_s+1;}
					if(backward){curAt=pos_s;posTail=pos_e;}
					else{curAt=pos_e;posTail=pos_s;}
					this.custom_setSelRange(curAt,posTail);
				}
				setTimeout(()=>this.focus(),0);
				e.preventDefault();
			}break;
			case 13: { // enter
				// no effect
				// if press 'enter' and then destruct this window
				// parent will get 'enter' and then go back to here
				//this.ref._choice_=this.ref._choice;
				//this.ref._choice=1;
				++this.ref._lineNum;
				Input.clear();
			}break;
			case 27: { // esc Input.clear(); 
				this.ref.redrawtxt();
				this.ref.doCancel(1); // Either parent is Window_CustomMenu_main or not
			}return;
			case 35: { // end
			}
			case 36: { // home
				let ref=node.ref;
				if(Input.isPressed('control')){
					if(e.keyCode===36) curAt=0;
					else curAt=this.value.length;
				}else{
					if(e.keyCode===36) curAt=ref._lineOffsets[ref._lineNum];
					else{
						curAt=ref._lineOffsets[ref._lineNum+1]||this.value.length+1;
						--curAt;
					}
				}
				this.custom_setSelRange(curAt,Input.isPressed('shift')?posTail:curAt);
				//ref.redrawtxt();
				e.preventDefault();
			}break;
			case 37: { // left arrow
				if(Input.isPressed('control')){
					let str=this.value,tmp=curAt;
					while(curAt>0&&f.tbl[str.charCodeAt(curAt-1)]) --curAt;
					curAt-=curAt===tmp;
					while(curAt>0&&str[curAt-1]===str[curAt]) --curAt;
				}else --curAt;
				curAt=curAt.clamp(0,this.value.length);
				this.custom_setSelRange(curAt,Input.isPressed('shift')?posTail:curAt);
			}break;
			case 39: { // right arrow
				if(Input.isPressed('control')){
					let str=this.value,tmp=curAt,len=str.length;
					while(curAt<len&&f.tbl[str.charCodeAt(curAt)]) ++curAt;
					curAt+=curAt===tmp;
					while(curAt<len&&str[curAt-1]===str[curAt]) ++curAt;
				}else ++curAt;
				curAt=curAt.clamp(0,this.value.length);
				this.custom_setSelRange(curAt,Input.isPressed('shift')?posTail:curAt);
			}break;
			// TODO: response to tab width
			// TODO: reserve view-x-offset
			case 33:{ // pgup
			}
			case 34:{ // pgdn
			}
			case 38: { // up arrow
			}
			case 40: { // down arrow
				let ref=node.ref;
				let dir=(e.keyCode<36)
					?((e.keyCode<<1)-67)*~~(ref.contentsHeight()/ref.lineHeight())
					:(e.keyCode-39)
					;
				if(ref._lineNum+dir>=0&&ref._lineNum+dir<ref._lines.length){
					if(e.keyCode<36) ref._scrolledLine+=dir;
					let xsh=curAt-ref._lineOffsets[ref._lineNum];
					// cal. curr. view-x-offset
					let vxo=ref._vxo=Math.max(ref.toViewLen(ref._lines[ref._lineNum],xsh),ref._vxo);
					curAt=ref._lineOffsets[ref._lineNum+=dir]; // +xsh
					curAt+=ref.fromViewLenAt(ref._lines[ref._lineNum],vxo);
					this.custom_setSelRange(curAt,Input.isPressed('shift')?posTail:curAt);
				}
			}return;
		}
		// END switch
		this.ref.refreshVxo();
	};
	this.redrawtxt();
	this.node_input.focus();
	//this.drawcursor();
	this._lastInputTime=Date.now();
	let itvl=setInterval(()=>{ if(self.parent===null) clearInterval(itvl); else if(Date.now()-self._lastInputTime<3e3||self.cursorBlinkState) self.redrawtxt(); },41);
}; $d$.ori=$r$;
$d$.tbl=[];
for(let x='0'.charCodeAt(),xh='9'.charCodeAt();x!==xh;++x) $d$.tbl[x]=true;
for(let x='A'.charCodeAt(),xh='Z'.charCodeAt();x!==xh;++x) $d$.tbl[x]=true;
for(let x='a'.charCodeAt(),xh='z'.charCodeAt();x!==xh;++x) $d$.tbl[x]=true;

$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	//this.redrawtxt();
	Window.prototype.update.call(this);
	if(this.isOpenAndActive()){
		this.processHandling();
		this.processWheel();
		this.processTouch();
	}else this._touching = false;
	this._stayCount++;
}; $d$.ori=$r$;
$pppp$.isTyping=Window_CustomTextInput.prototype.isTyping;
$pppp$.getCurAt=function(){
	return this._textCursorAt_d === "backward" ? this._textCursorAt_s : this._textCursorAt_e;
};
$pppp$.refreshVxo=function(txt){
	// vxo
	let ref=this;
	let curAt = ref._textCursorAt_d === "backward" ? ref._textCursorAt_s : ref._textCursorAt_e ;
	let nu=ref.toLineNum(curAt);
	ref._vxo=ref.toViewLen(ref._lines[nu],curAt-ref._lineOffsets[nu]);
};
$pppp$.drawcursor=function(){
	let tmp=this._lineNum-this._scrolledLine;
	if(this._lastSkylineCursorY!==tmp) this.setCursorRect( 0, (this._lastSkylineCursorY=tmp)*this.lineHeight(), this.width, this.lineHeight() );
};
$pppp$.padTab=function(text){ // tab -> spaces , align
	let rtv=''; for(let x=0,t=this._tabWidth,tr=t,xs=text.length;x!==xs;++x){
		if(text[x]==='\t'){
			++tr;
			while(--tr) rtv+=' ';
			tr=t;
		}else{
			rtv+=text[x];
			if(--tr===0) tr=t;
		}
	}
	return rtv;
}
$pppp$.drawText=function(text, x, y, maxWidth, align){
	return this.contents.drawText(this.padTab(text), x, y, maxWidth, this.lineHeight(), align);
//	this.contents.drawText(
//		text.replace(/\t/g,' '.repeat(this._tabWidth))
//	, x, y, maxWidth, this.lineHeight(), align);
};
$pppp$.textWidth=function f(txt,ende){ // TODO: aligned tab width
	// ende must be int>=0 or undefined
	if(this.contents.fontSize!==this._textWidthCache.size) return this.contents.measureTextWidth(ende!==undefined?txt.slice(0,ende):txt);
	let rtv=0;
	for(let t=this._tabWidth,x=0,tr=t,xs=isNaN(ende)?txt.length:Math.min(ende,txt.length);x!==xs;++x){
		let cc=txt.charCodeAt(x);
		if(!this._textWidthCache[cc]) this._textWidthCache[cc]=this.contents.measureTextWidth(txt[x]);
		if(cc===9){
			rtv+=this._textWidthCache[cc]*tr;
			tr=1;
		}else rtv+=this._textWidthCache[cc];
		if(--tr===0) tr=t;
	}
	return rtv;
};
$pppp$.redrawtxt_split=function(){
	let arr=this.node_input.value.split("\n");
	let padstr=arr.length+". ";
	let padp=this._nuPad=this.textWidth(padstr),padn=padstr.length;
	this.contents.clear();
	let offset=0;
	for(let n=0;n!==arr.length;++n){
		let line=arr[n];
		this._lines[n]=line; // let the object ('this._lines') be the same 
		//this.drawlinetext(((n+1)+". ").padStart(padn),n);
		//this._lineXys[n]=this.drawlinetext(line,n,undefined,padp);
		this._lineOffsets[n]=offset;
		offset+=line.length+1;
	}
	this._lineOffsets.length=
	this._lines.length=
	arr.length;
};
$pppp$.toLineNum=function(pos){
	return this._lineOffsets.lower_bound(pos+1)-1;
};
$pppp$.toViewLen=function(txt,ende){
	ende=Number(ende);
	if(isNaN(ende)||txt.length<ende) ende=txt.length;
	if(!(this._tabWidth>=2)) return ende;
	const w=this.textWidth('-');
	let rtv=ende;
	for(let x=0,t=this._tabWidth,tr=t,tmp;x!=ende;++x){
		--tr;
		if(txt[x]==='\t'){
			rtv+=tr;
			tr=t;
		}else if((tmp=this.textWidth(txt[x]))!==w){
			rtv+=tmp/w-1;
			if(--tr<=0) tr+=t;
		}else if(tr===0) tr=t;
	}
	return rtv;
};
$pppp$.fromViewLenAt=function(txt,viewlen){
	let rtv=0;
	if(txt) for(let t=this._tabWidth,tr=t,ts=(t>>1)+(t&1);txt.length!==rtv&&viewlen>0;++rtv){
		if(txt[rtv]==='\t'){
			if(viewlen>tr){
				viewlen-=tr;
				tr=t;
			}else{
				if(viewlen+t-tr>=ts) ++rtv; // ts>=tr-viewlen
				break;
			}
		}else{
			--viewlen;
			if(--tr===0) tr=t;
		}
	}
	return rtv;
};
$pppp$.redrawtxt=function(){ // TODO: rect select
	//debug.log('Window_CustomTextArea.prototype.redrawtxt');
	
	// split by '\n'
	this.redrawtxt_split();
	
	// line number
	const nu_s=this.toLineNum(this._textCursorAt_s);
	const nu_e=this._textCursorAt_s===this._textCursorAt_e?nu_s:this.toLineNum(this._textCursorAt_e);
	const backward = this._textCursorAt_d === 'backward';
	const cursorHead = backward ? this._textCursorAt_s : this._textCursorAt_e ;
	//const cursorTail = backward ? this._textCursorAt_e : this._textCursorAt_s ;
	const nu=this._lineNum=this.toLineNum(cursorHead);
	const lastNu=this._lastNu;
	
	// txt
	// - available lines =
	let al= ~~(this.contentsHeight()/this.lineHeight()) , arr=this._lines;
	if(!al) return; // TODO , currently not happend 
	let padstr=arr.length+". ";
	let padp=this._nuPad=this.textWidth(padstr),padn=padstr.length;
	if(arr.length>al){
		let rsrv=this._reservedLine,strt=this._scrolledLine,ende=strt+al;
		if(lastNu!==nu&&(nu<strt+rsrv||nu+rsrv>=ende)){
			if(nu<strt+rsrv){
				strt=nu-rsrv;
				if(strt<0) strt=0;
				ende=strt+al;
				if(arr.length<ende) strt=(ende=arr.length)-al;
			}else{
				ende=nu+rsrv+1;
				if(arr.length<ende) ende=arr.length;
				strt=ende-al;
				if(strt<0) ende=(strt=0)+al;
			}
			ende=(this._scrolledLine=strt)+al;
		}
		if(arr.length<ende) strt=(ende=arr.length)-al;
		if(strt<0) strt=0;
		for(let n=this._scrolledLine=strt;n!==ende;++n){
			this.drawlinetext(((n+1)+". ").padStart(padn),n-strt);
			this._lineXys[n]=this.drawlinetext(arr[n],n-strt,undefined,padp);
		}
	}else for(let n=this._scrolledLine=0;n!==arr.length;++n){
		this.drawlinetext(((n+1)+". ").padStart(padn),n);
		this._lineXys[n]=this.drawlinetext(arr[n],n,undefined,padp);
	}
	this._lastNu=nu;
	
	// skyline cursor
	this.drawcursor();
	
	// cursor
	const startxy=this._lineXys[nu];
	let startx=startxy.x,r=startxy.w/startxy.ow; if(isNaN(r)) r=1;
	let tmp=(++this._textCursorBlinkCtr)<this.cursorBlinkPeriod;
	this._textCursorBlinkCtr*=tmp;
	const cursor=(this.cursorBlinkState^=!tmp)?" ":"|";
	const shx_s=this.textWidth('-')*this.toViewLen(this._lines[nu_s],this._textCursorAt_s-this._lineOffsets[nu_s]);
	const shx_e=this.textWidth('-')*this.toViewLen(this._lines[nu_e],this._textCursorAt_e-this._lineOffsets[nu_e]);
	// - text selected background
	this.contents._context.fillStyle="rgba(0,0,123,0.25)";
	if(nu_s===nu_e) this.contents._context.fillRect(startx+parseInt(shx_s*r),startxy.y,parseInt((shx_e-shx_s)*r),this.lineHeight());
	else{
		{
			const startxy=this._lineXys[nu_s];
			let r=startxy.w/startxy.ow; if(isNaN(r)) r=1;
			this.contents._context.fillRect(startxy.x+parseInt(shx_s*r),startxy.y,parseInt(this.textWidth('-')*this.toViewLen(this._lines[nu_s])*r)-shx_s,this.lineHeight());
		}
		for(let n=Math.max(nu_s+1,this._scrolledLine),ns=Math.min(this._scrolledLine+al,arr.length,nu_e);n<ns;++n){
			const startxy=this._lineXys[n];
			let r=startxy.w/startxy.ow; if(isNaN(r)) r=1;
			this.contents._context.fillRect(startxy.x,startxy.y,parseInt(this.textWidth('-')*this.toViewLen(this._lines[n])*r),this.lineHeight());
		}
		{
			const startxy=this._lineXys[nu_e];
			let r=startxy.w/startxy.ow; if(isNaN(r)) r=1;
			this.contents._context.fillRect(startxy.x,startxy.y,parseInt(shx_e*r),this.lineHeight());
		}
	}
	// - verticle cursor
	startx+=backward?shx_s:shx_e;
	startx=(startx-padp)*r+padp;
	startx-=this.textWidth(cursor)/2.0;
	this.drawText(cursor,startx,this.lineHeight()*(nu-this._scrolledLine));
	
	{ let t=this.node_input.style; if(t.display!=='') t.display=''; }
};
$pppp$.__custom_updateCursorInfo=function(e){ //  not use by 'this' but by 'this.node_input'
	this.ref._textCursorAt_s=e.target.selectionStart;
	this.ref._textCursorAt_e=e.target.selectionEnd;
	this.ref._textCursorAt_d=e.target.selectionDirection;
	//debug.log('',this.ref._textCursorAt_s,this.ref._textCursorAt_e,this.ref._textCursorAt_d);
};
$pppp$.__custom_setSelRange=function(curAt,posTail){
	let low =curAt>=posTail?posTail:curAt;
	let high=curAt>=posTail?curAt:posTail;
	let dir =curAt<posTail?"backward":"";
	this.setSelectionRange(
		this.ref._textCursorAt_s=low,
		this.ref._textCursorAt_e=high||low,
		this.ref._textCursorAt_d=dir
	);
};
$pppp$.doCancel=Window_CustomTextInput.prototype.doCancel;
$pppp$.localX2LinePos=function(localX,lineNum){ // 0-base
	const line=this._lines[lineNum];
	if(!line) return 0;
	localX-=this.standardPadding()+this.textPadding();
	const xy=this._lineXys[lineNum];
	let x=(localX-this._nuPad)/(xy.w/xy.ow);
	let i=0; for(let sw=0;i!==line.length;++i){
		let w=this.textWidth(line[i]);
		if(sw+(w>>1)>x) break;
		sw+=w;
	}
	return i;
};
$pppp$.localY2CurrLine=function(localY){ // 0-base
	const h=this.lineHeight();
	localY-=this.standardPadding();
	return ((~~(localY/h))+this._scrolledLine).clamp(0,this._lineOffsets.length);
};
$pppp$.localXy2Pos=function(x,y){
	//if(objs.isDev) console.log(x,y);
	const lineNum=this.localY2CurrLine(y);
	return this._lineOffsets[lineNum] + this.localX2LinePos(x,lineNum) ;
};
$pppp$.cursorTail=function(){
	return this._textCursorAt_d==="backward"?this._textCursorAt_e:this._textCursorAt_s;
};
$pppp$.processTouch_touching=function(){
	const x = this.canvasToLocalX(TouchInput.x) , y = this.canvasToLocalY(TouchInput.y); 
	if(this._lastTouchPos===undefined) this.node_input.custom_setSelRange(this.localXy2Pos(x,y),this.cursorTail());
	else this.node_input.custom_setSelRange(this.localXy2Pos(x,y),this._lastTouchPos);
};
$pppp$.processTouch=function(){
	if(TouchInput.isMoved()){
		if(TouchInput.isPressed()) this._lastInputTime=Date.now();
		if(this._touchStarted) this.processTouch_touching();
	}
	if(TouchInput.isReleased()){
		this._lastInputTime=Date.now();
		if(this._touchStarted) this.processTouch_touching();
		this._touchStarted=false;
	}
	if(TouchInput.isTriggered()){ const x = this.canvasToLocalX(TouchInput.x) , y = this.canvasToLocalY(TouchInput.y); if(x >= 0 && y >= 0 && x < this.width && y < this.height){ // this.isTouchedInsideFrame();
		this._touchStarted=true;
		this._lastTouchPos=undefined;
		const pos=this.localXy2Pos(x,y);
		if(objs.isDev) console.log(pos);
		this._lastInputTime=Date.now();
		if(Input.isPressed('shift')) this.node_input.custom_setSelRange(pos,this.cursorTail());
		else this.node_input.custom_setSelRange(this._lastTouchPos=pos);
		this.refreshVxo();
		this.redrawtxt();
	} }
};
$pppp$.scrollDown=function(){
	const al= ~~(this.contentsHeight()/this.lineHeight());
	if(al+this._scrolledLine<this._lines.length){
		++this._scrolledLine;
		this.redrawtxt();
	}
};
$pppp$.scrollUp=function(){
	if(this._scrolledLine>0){
		--this._scrolledLine;
		this.redrawtxt();
	}
};
$pppp$=$aaaa$=undef; // END Window_NoteWrite



(()=>{

const dir="js2/agold404/";
const load=js=>addScript(dir+js);
load( "menu2-store.js" );
load( "menu2-battlePlan.js" );
load( "menu2-chat.js" );
load( "menu2-save.js" );

})();

$k$=$dddd$=$d$=$rrrr$=$r$=$pppp$=$aaaa$=$tttt$=$t$=undef;
