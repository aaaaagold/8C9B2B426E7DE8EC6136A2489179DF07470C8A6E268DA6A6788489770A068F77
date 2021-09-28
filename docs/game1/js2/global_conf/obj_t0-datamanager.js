"use strict";

// after rpg_*, before obj-t
// DataManager

if(!window.objs) window.objs={};

// manager

// - DataManager
$aaaa$=DataManager;
$aaaa$._globalId=[97, 103, 111, 108, 100, 52, 48, 52].map(x=>String.fromCharCode(x)).join('');
$aaaa$.getTitle=function(){
	return ( !$gamePlayer || $gamePlayer._currentTitle === undefined ) ? $dataSystem.gameTitle : $gamePlayer._currentTitle ;
};
$aaaa$.sortCmp=(a,b)=>{
	const cmp=a.ord-b.ord; 
	return cmp||a.id-b.id; // '.id' is unique
};
$t$=$aaaa$._databaseFiles;
$t$.reverse();
[
	{ name: '$dataCustom',       src: 'custom.json'       },
	{ name: '$dataTemplateEvtFromMap_overworld', src: 'Map077.json'   },
	{ name: '$dataTemplateEvtFromMap_outside', src: 'Map078.json'   },
	{ name: '$dataTemplateEvtFromMap_dungeon', src: 'Map117.json'   },
	{ name: '$dataTemplateEvtFromMap_inside', src: 'Map123.json'   },
	{ name: '$dataTemplateEvt_move', src: 'Map089.json'   },
	{ name: '$dataTemplateEvt_item', src: 'Map114.json'   },
].reverse().forEach(x=>$t$.push(x));
$t$.reverse();
$t$=undef;
$aaaa$.isThisGameFile=function(savefileId){
	let globalInfo=this.loadGlobalInfo();
	if(globalInfo && globalInfo[savefileId]){
		if(StorageManager.isLocalMode()) return true;
		else{
			let savefile = globalInfo[savefileId];
			return true; // (savefile.globalId === this._globalId && savefile.title === $dataSystem.gameTitle);
		}
	}else return false;
};
$dddd$=$aaaa$.loadDataFile=function f(name, src ,changesCallback,changesKArgs) {
	//debug.log('DataManager.loadDataFile');
	let cache=f.cache.get(src);
	if(cache!==undefined){ f.set(name,cache ,changesCallback,changesKArgs); return; }
	let onSucc=(src,xhr,name,changesCallback,changesKArgs)=>{
		f.cache.add(src,xhr.responseText);
		f.set(name,xhr.responseText ,changesCallback,changesKArgs); // edit: set cache if conditions are matched
	};
	var xhr = new XMLHttpRequest();
	var url = 'data/' + src;
	xhr.open('GET', url);
	xhr.overrideMimeType('application/json');
	xhr.onload = function() {
		if (xhr.status < 400) {
			f.cache.add(src,xhr.responseText);
			f.set(name,xhr.responseText ,changesCallback,changesKArgs); // edit: set cache if conditions are matched
			return;
			window[name] = JSON.parse(xhr.responseText);
			DataManager.onLoad(window[name]);
		}
		else{
			
		}
	};
	xhr.onerror = this._mapLoader || function() {
		DataManager._errorUrl = DataManager._errorUrl || url;
	};
	window[name] = null;
	xhr.send();
};
$dddd$.cache=new CacheSystem(3);
$dddd$.set=function f(name,txt ,changesCallback,changesKArgs){
	window[name] = JSON.parse(txt);
	let prefix=name.slice(0,name.indexOf("_")+1);
	let tuner=f.tuning[prefix];
	const res=tuner&&tuner(name,prefix);
	DataManager.onLoad(window[name]);
	switch(res){
	case 'evtds': {
		DataManager.evtd_faceImg(window[name]);
		DataManager.evtd_addTxt(window[name]);
		DataManager.evtd_addRef(window[name]);
	}break;
	}
	tuner=f.tuning[name];
	if(tuner) tuner(window[name]);
	if(changesCallback&&changesCallback.constructor===Function) changesCallback(changesKArgs);
};
{ const logOriLen=(tname,obj,prefix)=>{
	if(prefix!==undefined) return; // not templates , skip
	if(obj!==window[tname]) return; // not the target
	if(!objs._oriLens) objs._oriLens={};
	objs._oriLens[tname]=obj.length;
}; $dddd$.set.tuning={
	// may be added data in-game
	//  not added data here
	'$dataActors'       :(obj,prefix)=>logOriLen('$dataActors'       ,obj,prefix),
	'$dataAnimations'   :(obj,prefix)=>logOriLen('$dataAnimations'   ,obj,prefix),
	'$dataArmors'       :(obj,prefix)=>logOriLen('$dataArmors'       ,obj,prefix),
	'$dataClasses'      :(obj,prefix)=>logOriLen('$dataClasses'      ,obj,prefix),
	'$dataCommonEvents' :(obj,prefix)=>logOriLen('$dataCommonEvents' ,obj,prefix),
	'$dataEnemies'      :(obj,prefix)=>logOriLen('$dataEnemies'      ,obj,prefix),
	'$dataItems'        :(obj,prefix)=>logOriLen('$dataItems'        ,obj,prefix),
	'$dataMapInfos'     :(obj,prefix)=>logOriLen('$dataMapInfos'     ,obj,prefix),
	'$dataSkills'       :(obj,prefix)=>logOriLen('$dataSkills'       ,obj,prefix),
	'$dataStates'       :(obj,prefix)=>logOriLen('$dataStates'       ,obj,prefix),
	'$dataTilesets'     :(obj,prefix)=>logOriLen('$dataTilesets'     ,obj,prefix),
	'$dataTroops'       :(obj,prefix)=>logOriLen('$dataTroops'       ,obj,prefix),
	'$dataWeapons'      :(obj,prefix)=>logOriLen('$dataWeapons'      ,obj,prefix),
	// templates
	'$dataTemplateEvtFromMap_':(name,prefix)=>{
		let tilesetId=window[name].tilesetId;
		window[name]=window[name].events;
		window[name].tilesetId=tilesetId;
		$dataTemplateEvtFromMaps[tilesetId]=window[name];
		return 'evtds';
	},
	'$dataTemplateEvt_':(name,prefix)=>{
		if(!$dataTemplateEvtFromMaps.others) $dataTemplateEvtFromMaps.others={};
		window[name]=window[name].events;
		$dataTemplateEvtFromMaps.others[name.slice(prefix.length)]=window[name]; // sorted after first map-loading
		return 'evtds';
	},
	// tune fixed database
	'$dataSystem':obj=>{
		if(!obj) return;
		// terms backup
		if(!$dataSystem.termsBackuped){
			$dataSystem.termsBackuped=true;
			$dataCustom.apps_ori=$dataCustom.apps;
			$dataSystem.currencyUnit_ori=$dataSystem.currencyUnit;
			$dataSystem.titleBgm_ori=deepcopy($dataSystem.titleBgm);
		}
	},
};  }
$aaaa$.resetData3d=(idx)=>{ // - to 3d data [[x,y],3-z] // 0<=z<=3, z larger -> higher(or upper)
	//debug.log('DataManager.resetData3d');
	if(!$dataMap) return;
	if(DataManager._lastDataMap!==$dataMap){
		DataManager._lastDataMap=$dataMap;
		DataManager.resetSerial=0;
	}
	++DataManager.resetSerial; DataManager.resetSerial&=0x3FFFFFFF;
	if(idx!==undefined){ idx|=0;
		// supposed 'data3d' is inited before: '$dataMap.data3d[idx]' is an array
		let dst=$dataMap.data3d[idx]=[],sz=$dataMap.width*$dataMap.height,data=$dataMap.data;
		//dst.length=0;
		for(let lv=sz<<2;lv!==0;){
			lv-=sz;
			dst.push(data[idx+lv]);
		}
		DataManager.resetHasA1(idx);
	}else{
		if(!$dataMap.data3d) $dataMap.data3d=[];
		for(let y=0,ys=$dataMap.height,xs=$dataMap.width,sz=$dataMap.height*$dataMap.width,data=$dataMap.data,data3d=$dataMap.data3d ;y!==ys;++y){ for(let x=0;x!==xs;++x){
			let idx=$dataMap.width*y+x;
			let dst=data3d[idx]=[];
			for(let lv=sz<<2;lv;){
				lv-=sz;
				dst.push(data[idx+lv]);
			}
		} }
	}
};
$aaaa$.resetHasA1=(idx)=>{
	//debug.log('DataManager.resetHasA1');
	if(!$dataMap) return;
	if(idx!==undefined){ idx|=0;
		let sz=$dataMap.width*$dataMap.height,data=$dataMap.data,dst;
		
		dst=$dataMap.hasA1;
		dst[idx]=false;
		for(let lv=sz<<2;lv;){
			lv-=sz;
			if(Tilemap.tileAn[ data[idx+lv] ]===1){
				dst[idx]=true;
				break;
			}
		}
		
		dst=$dataMap.hasA1_lower;
		dst[idx]=false;
		for(let x=0,arr=$dataMap.addLower[idx];x!==arr.length;++x) if(Tilemap.tileAn[ arr[x][0] ]===1){ dst[idx]=true; break; }
		
		dst=$dataMap.hasA1_upper;
		dst[idx]=false;
		for(let x=0,arr=$dataMap.addUpper[idx];x!==arr.length;++x) if(Tilemap.tileAn[ arr[x][0] ]===1){ dst[idx]=true; break; }
	}else{
		if(!$dataMap.hasA1) $dataMap.hasA1=[];
		if(!$dataMap.hasA1_lower) $dataMap.hasA1_lower=[];
		if(!$dataMap.hasA1_upper) $dataMap.hasA1_upper=[];
		for(let y=0,ys=$dataMap.height,xs=$dataMap.width,sz=$dataMap.height*$dataMap.width,data=$dataMap.data, hasA1=$dataMap.hasA1, hasA1_lower=$dataMap.hasA1_lower, hasA1_upper=$dataMap.hasA1_upper ;y!==ys;++y){ for(let x=0;x!==xs;++x){
			let idx=$dataMap.width*y+x,dst;
			
			dst=hasA1;
			dst[idx]=false;
			for(let lv=sz<<2;lv;){
				lv-=sz;
				if(Tilemap.tileAn[ data[idx+lv] ]===1){
					dst[idx]=true;
					break;
				}
			}
			
			dst=hasA1_lower;
			dst[idx]=false;
			for(let i=0,arr=$dataMap.addLower[idx];i!==arr.length;++i) if(Tilemap.tileAn[ arr[i][0] ]===1){ dst[idx]=true; break; }
			
			dst=hasA1_upper;
			dst[idx]=false;
			for(let i=0,arr=$dataMap.addUpper[idx];i!==arr.length;++i) if(Tilemap.tileAn[ arr[i][0] ]===1){ dst[idx]=true; break; }
		} }
	}
};
$aaaa$.resetPseudoTile=()=>{
	// <addUpper:[{tid,loc,tp,top?,cond?}]>  <addLower:[{tid,loc,cond?}]>
	// {loc:[x,y]} or {loc:[x,y,xe,ye]}
	//  => dst[idx_loc][tid,tp]
	// cond: visible if true or undefined
	
	if(!$dataMap) return "! $dataMap";
	let w=$dataMap.width,src,dst;
	
	if(!$dataMap.addUpper) $dataMap.addUpper=[];
	else $dataMap.addUpper.length=0;
	dst=$dataMap.addUpper;
	src=$dataMap.meta.addUpper;
	for(let x=0,sz=$dataMap.height*$dataMap.width;x!==sz;++x) dst[x]=[];
	if(src){
		for(let x=0,added=JSON.parse(src);x!==added.length;++x){
			let curr=added[x];
			let loc=curr.loc;
			//let cond=eval(curr.cond);
			let cond=objs._getObj(curr.cond);
			if(loc.length===2) dst[loc[1]*w+loc[0]].push([curr.tid,curr.tp,curr.y,cond]);
			else{ for(let y=loc[1],ys=loc[3],xs=loc[2];y!==ys;++y){ for(let x=loc[0];x!==xs;++x){
				dst[y*w+x].push([curr.tid,curr.tp,curr.y,cond]);
			} } }
		}
	}
	
	if(!$dataMap.addLower) $dataMap.addLower=[];
	else $dataMap.addLower.length=0;
	dst=$dataMap.addLower;
	src=$dataMap.meta.addLower;
	for(let x=0,sz=$dataMap.height*$dataMap.width;x!==sz;++x) dst[x]=[];
	if(src){
		for(let x=0,added=JSON.parse(src);x!==added.length;++x){
			let curr=added[x];
			let loc=curr.loc;
			//let cond=eval(curr.cond);
			let cond=objs._getObj(curr.cond);
			if(loc.length===2) dst[loc[1]*w+loc[0]].push([curr.tid,curr.tp,curr.y,cond]);
			else{ for(let y=loc[1],ys=loc[3],xs=loc[2];y!==ys;++y){ for(let x=loc[0];x!==xs;++x){
				dst[y*w+x].push([curr.tid,curr.tp,curr.y,cond]);
			} } }
		}
	}
};
$aaaa$.evtd_faceImg=function(evtds){
	let faceSet=new Set(),chrSet=new Set();
	for(let x=0,arr=evtds;x!==arr.length;++x){
		let evt=arr[x]; if(!evt) continue;
		for(let p=0,arr=evt.pages;p!==arr.length;++p){
			let img=arr[p].image;
			let cname=img.characterName;
			// face
			if(img.tileId===0&&cname!==''&&
				!ImageManager.isObjectCharacter(cname)&&
				!ImageManager.isBigCharacter(cname)&&
				cname.slice(-6)!=="Damage"&&
				cname.slice(0,6)!=="Damage"
			){
				faceSet.add(cname);
				img.hasFaceImg=true;
			}
			// body
			if(img.tileId===0&&cname!=='') chrSet.add(img.characterName);
		}
	}
	return [faceSet,chrSet];
};
$dddd$=$aaaa$.evtd_addRef=function f(evtds){
	for(let x=0,evtd;x!==evtds.length;++x){
		if(!(evtd=evtds[x]) || !evtd.meta.refActor) continue;
		const dmeta=evtd.meta;
		let tmp=JSON.parse(evtd.meta.refActor);
		if(!tmp) continue; // there's no actor id = 0 , null , false , undefined , ''
		if(tmp.constructor===Array){
			const refs=tmp.map(id=>$dataActors[id]);
			const tmpmeta={};
			for(let p=0,ref,pgs=evtd.pages,sz=Math.min(refs.length,pgs.length);p!==sz;++p){
				if(!(ref=refs[p])) continue;
				const smeta=ref.meta,image=pgs[p].image;
				f.refActor_chr(ref,image);
				for(let i in smeta){
					const key=i+'s';
					if(!tmpmeta[key]) tmpmeta[key]=[];
					if(smeta[i]===true) tmpmeta[key][p]=smeta[i];
					else{ try{
						tmpmeta[key][p]=JSON.parse(smeta[i]);
					}catch(e){
						tmpmeta[key][p]=smeta[i];
					} }
				}
			}
			for(let i in tmpmeta) dmeta[i]=JSON.stringify(tmpmeta[i]);
		}else{
			const ref=$dataActors[tmp]; if(!ref) continue;
			for(let p=0,pgs=evtd.pages,sz=pgs.length;p!==sz;++p) f.refActor_chr(ref,pgs[p].image);
			if(dmeta.name===undefined) dmeta.name=ref.name;
			const smeta=ref.meta;
			for(let i in smeta) dmeta[i]=smeta[i];
		}
	}
};
$dddd$.refActor_chr=(ref,dst)=>{
	dst.characterIndex=ref.characterIndex;
	if(dst.characterName=ref.characterName) dst.pattern=1;
};
$dddd$=$aaaa$.evtd_addTxt=function f(evtds,mapId){
	const tbl=JSON.parse(f.tbl.get(mapId)||'[]');
	const log=[];
	for(let x=0,evtd;x!==evtds.length;++x){ const evtd=evtds[x]; if(!evtd || evtd.txts) continue;
		if(tbl[x]) evtd.txts=tbl[x];
		else{ evtd.txts=[]; for(let p=0,pgs=evtd.pages;p!==pgs.length;++p){ const list=pgs[p].list; if(list.length>2){ for(let c=0;c+2!==list.length;++c){
			if(list[c]  .code!==108 || list[c]  .parameters[0]!=="<meta>"   ) continue;
			if(list[c+1].code!==408 || list[c+1].parameters[0]!=="<showTxt>") continue;
			const strt=c+2; // exec onec per page
			if(list[strt].code!==408) break;
			let cmt=list[strt].parameters[0];
			if(strt!==list.length){ for(let i=c+3;i!==list.length;++i){
				if(list[i].code===408){
					cmt+="\n";
					cmt+=list[i].parameters[0];
				}else break;
			} }
			evtd.txts[p]=cmt;
			break;
		} } } }
		log[x]=evtd.txts;
	}
	if(!tbl && mapId) f.tbl.set(mapId,JSON.stringify(log));
};
$dddd$.tbl=new Map();
$aaaa$.addPreloadsViaCmd=(cmd,addeds,audios,imgs)=>{
	switch(cmd.code){
	case 212: { // ani
		const ani=$dataAnimations[cmd.parameters[1]];
		if(ani){
			ani.imgs.forEach(x=>{
				if(addeds){ if(addeds.aniImg.has(x)) return; addeds.aniImg.add(x); }
				imgs.push(["ani",x]);
			});
			ani.ses.forEach(x=>{
				if(addeds){ if(addeds.se    .has(x)) return; addeds.se    .add(x); }
				audios.push(["se",x]);
			});
		}
	}break;
	case 241: { // bgm
		const x=cmd.parameters[0].name;
		if(addeds){ if(addeds.bgm.has(x)) break; addeds.bgm.add(x); }
		audios.push(["bgm",x]);
	}break;
	case 245: { // bgs
		const x=cmd.parameters[0].name;
		if(addeds){ if(addeds.bgs.has(x)) break; addeds.bgs.add(x); }
		audios.push(["bgs",x]);
	}break;
	case 249: { // me
		const x=cmd.parameters[0].name;
		if(addeds){ if(addeds.me .has(x)) break; addeds.me .add(x); }
		audios.push(["me",x]);
	}break;
	case 250: { // se
		const x=cmd.parameters[0].name;
		if(addeds){ if(addeds.se .has(x)) break; addeds.se .add(x); }
		audios.push(["se",x]);
	}break;
	}
};
$dddd$=$aaaa$.loadMapData = function f(mapId) {
	debug.log('DataManager.loadMapData');
	if(f.playerChanges===undefined) f.playerChanges=(kargs)=>{ let tmp;
		//debug.log('DataManager.loadMapData -> playerChanges');
		//debug.log('$gameMap._mapId',$gameMap._mapId,'kargs.mapid',kargs.mapid);
		// test
		//if(debug.isdebug()){
		//	if(window['/tmp/'].tmpevt){
		//		$dataMap.events[999]=(window['/tmp/'].tmpevt);
		//	}
		//}
		
		// backup
		// - '.data'
		$dataMap.data_bak=$dataMap.data.slice();
		// defaults
		//if($gamePlayer && $gamePlayer.canDiag===undefined) $gamePlayer.canDiag=1; // default can diag walk
		// environment traits (use a state)
		{ const stat=$dataStates[$dataMap.meta.traitRef];
		if(stat){
			$dataMap.traits=stat.traits;
			$dataMap.tmapS=stat.tmapS;
			$dataMap.tmapP=stat.tmapP;
		}else{
			$dataMap.traits=[];
			$dataMap.tmapP=$dataMap.tmapS=new Map();
		} }
		// evt.meta.refActor
		this.evtd_addRef($dataMap.events);
		// texts
		this.evtd_addTxt($dataMap.events); // also used @ cmdRef
		// preload
{
		// - preload face&&body image according to events' character image
		const res=this.evtd_faceImg($dataMap.events);
if(!$dataMap.meta.disablePreload){
		const faceSet=res[0],chrSet=res[1],imgs=[];
		faceSet.forEach(x=>imgs.push(["face",x]));
		chrSet.forEach(x=>imgs.push(["chr",x]));
		// - preload ani,bgm,bgs,se
		const audios=[];
		{
			const addeds={
				aniImg: new Set(),
				bgm: new Set(),
				bgs: new Set(),
				me: new Set(),
				se: new Set(),
			};
			// bgm,bgs
			let dbgm = $dataMap.bgm && $dataMap.bgm.name;
			let dbgs = $dataMap.bgs && $dataMap.bgs.name;
			let abgm = AudioManager._currentBgm && AudioManager._currentBgm.name;
			let abgs = AudioManager._currentBgs && AudioManager._currentBgs.name;
			if(dbgm && dbgm!==abgm) audios.push(["bgm",dbgm]);
			if(dbgs && dbgs!==abgs) audios.push(["bgs",dbgs]);
			// ani,bgm,bgs,se
			for(let e=0,es=$dataMap.events;e!==es.length;++e){ const evtd=es[e]; if(!evtd) continue; for(let p=0,parr=evtd.pages;p!==parr.length;++p){ for(let l=0,larr=parr[p].list;l!==larr.length;++l){
				this.addPreloadsViaCmd(larr[l],addeds,audios,imgs);
			} } }
		}
		// - meta
		{ let p=$dataMap.meta.preload; if(p){
			p=JSON.parse(p);
			if(p.img) p.img.forEach(x=>imgs.push(x));
			if(p.audio) p.audio.forEach(x=>audios.push(x));
		} }
		// - actually request media
		SceneManager.preloadMedia.load({img:imgs,audio:audios});
}
}
		// pre-cal
		// - evtd attrs.
		for(let x=0,evtd,evtds=$dataMap.events;x!==evtds.length;++x){
			if(!(evtd=evtds[x])) continue;
			let meta=evtd.meta;
			evtd.strtByAny=meta.strtByAny;
			evtd.light=undefined; if(meta.light) evtd.light=JSON.parse(meta.light);
			evtd.anchory=undefined; if(meta.anchory) evtd.anchory=Number(meta.anchory);
		}
		// - tile structure
		// - - set markerTiles to nothing
		if($dataMap.meta.markerTiles) for(let s=new Set(JSON.parse($dataMap.meta.markerTiles)),x=0,arr=$dataMap.data;x!==arr.length;++x) if(s.has(arr[x])) arr[x]=0;
		// - - isChair
		$dataMap.isChair=[];
		let chair=$dataTilesets[$dataMap.tilesetId].meta.chair;
		if(chair){ for(let y=0,ys=$dataMap.height,xs=$dataMap.width,sz=$dataMap.height*$dataMap.width,data=$dataMap.data ;y!==ys;++y){ for(let x=0;x!==xs;++x){
			let idx=$dataMap.width*y+x;
			for(let lv=sz<<2;lv;){
				lv-=sz;
				if(chair.has(data[idx+lv])){
					$dataMap.isChair[idx]=true;
					break;
				}
			}
		} } }
		// - - in-note added pseudo-tiles
		this.resetPseudoTile();
		// - - pre-cal. tile
		this.resetData3d();
		this.resetHasA1();
		// ====
		// extended map data (including events)
		// - padding // for test: auto adj evt id
		//for(let x=8;x--;) $dataMap.events.push(null);
		// - tileEvtTemplate
		$dataMap.templateStrt=$dataMap.events.length;
		if(tmp=$dataTemplateEvtFromMaps[$dataMap.tilesetId]){
			tmp=deepcopy(tmp); // need a copy for following use // 'tmp.tilesetId' is gone. it doesn't matter though
			let evts=$dataMap.events,strt=$dataMap.templateStrt_tile=evts.length;
			let childList=[];
			tmp.forEach((evt)=>{ evts.push(evt); if(!evt) return;
				let meta=evt.meta,c=meta.child,p=meta.parent;
				if(c && c.constructor!==Boolean && !isNaN(c)) childList.push(meta.child  = Number(c)+strt);
				if(p && p.constructor!==Boolean && !isNaN(p)) meta.parent = Number(p)+strt;
				evt.id=evts.length-1;
				evt.x=evt.y=-1; // loop map will x,y mod w,h
			});
			for(let x=0;x!==childList.length;++x) if(evts[childList[x]]) evts[childList[x]].isChild=1;
		}
		// - othersEvtTemplate
		if(!$dataTemplateEvtFromMaps.others_sorted){
			if(objs.isDev) console.log('sorted @',mapId);
			$dataTemplateEvtFromMaps.others_sorted=true;
			let src=$dataTemplateEvtFromMaps.others,arr=[];
			for(let i in src) arr.push([i,src[i]]);
			arr.sort((a,b)=>((a[0]<b[0])<<1)-1); // no dup
			src=$dataTemplateEvtFromMaps.others={};
			for(let x=0;x!==arr.length;++x) src[arr[x][0]]=arr[x][1];
		}
		for(let i in $dataTemplateEvtFromMaps.others){
			tmp=deepcopy($dataTemplateEvtFromMaps.others[i]);
			const evts=$dataMap.events;
			$dataMap['templateStrt_'+i]=evts.length;
			tmp.forEach((evt)=>{ evts.push(evt); if(!evt) return;
				evt.meta[i]=evt.meta.regen=true;
				evt.id=evts.length-1;
				evt.x=evt.y=-1; // loop map will x,y mod w,h
			});
		}
		$dataMap.templateStrt_ende=$dataMap.events.length;
		// cmdSameAsPage
		for(let e=0,evtds=$dataMap.events,es=$dataMap.templateStrt;e!==es;++e){
			const evtd=evtds[e]; if(evtd){ for(let p=0,pgs=evtd.pages;p!==pgs.length;++p){
				const list=pgs[p].list;
				if(list[0].code!==108 || list[0].parameters[0]!=="<meta>" ||
					list[1].code!==408 || list[1].parameters[0]!=="<cmdSameAsPage>" ||
					list[2].code!==408 ){
					continue;
				}
				const n=Number(list[2].parameters[0]);
				if(n<=p && pgs[n-1]) pgs[p].list=pgs[n-1].list;
			} }
		}
		// cmdRef
		for(let e=0,evtds=$dataMap.events,es=$dataMap.templateStrt;e!==es;++e){
			const evtd=evtds[e],revtd=evtd&&evtds[evtd.meta.cmdRef]; if(!revtd) continue;
			for(let p=0,pgs=evtd.pages;p!==pgs.length;++p) if(revtd.pages[p]) pgs[p].list=revtd.pages[p].list;
			evtd.txts=revtd.txts;
		}
		// ====
		// $gameParty
		if($gameParty){
			// init $gameParty.mapChanges
			if(!$gameParty.mapChanges) $gameParty.mapChanges=[''];
			let store=$gameParty.mapChanges;
			// init slot
			if(!store[kargs.mapid]) store[kargs.mapid]={};
			// init vars
			if(!store[kargs.mapid].vars) store[kargs.mapid].vars={};
			// put map name
			//if(store[kargs.mapid].name!==undefined) $dataMap.displayName=store[kargs.mapid].name; // change $gameMap.displayName() to achieve same result
			// put events to $gameMap
			// // Game_Map.prototype.setup @ obj_t.js
		}
		// init $gameSelfSwitches
		if($gameSelfSwitches){
			let target=$gameSelfSwitches._data;
			target[kargs.mapid]=target[kargs.mapid]||{};
		}
	};
	if (mapId > 0) {
		let filename = 'Map%1.json'.format(mapId.padZero(3));
		this._mapLoader = ResourceHandler.createLoader('map','data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
		this.loadDataFile('$dataMap', filename ,f.playerChanges, {mapid:mapId});
	} else {
		this.makeEmptyMap();
	}
};
$rrrr$=$aaaa$.onLoad;
$dddd$=$aaaa$.onLoad=function f(obj){
	if($dataSystem===obj){
		const re=/(^|[^\\]+)((\\\\)*)\\\$(.*)/;
		$dataSystem.equipTypes.metas=[];
		$dataSystem.equipTypes.forEach((x,i,a)=>{
			a[i]=x.replace(re,function(){
				let tmp={note:arguments[4]};
				DataManager.extractMetadata(tmp);
				$dataSystem.equipTypes.metas[i]=tmp.meta;
				let rtv=arguments[1];
				rtv+="\\".repeat(arguments[2].length>>1);
				return rtv;
			});
		});
		const keys=new Set();
		$dataSystem.equipTypes.meta={};
		$dataSystem.equipTypes.metas.forEach(meta=>{
			if(!meta) return;
			for(let key in meta){
				if(keys.has(key)) continue;
				keys.add(key);
				const arr=$dataSystem.equipTypes.meta[key]=[];
				$dataSystem.equipTypes.metas.forEach((x,idx)=>x&&(arr[idx]=x[key]));
			}
		});
	}
	return f.ori.call(this,obj);
}; $dddd$.ori=$rrrr$;
$dddd$.replce=function(){
	let rtv=arguments[0];
	rtv+="\\".repeat(arguments[1].length>>1);
	rtv+=arguments[3];
	return rtv;
};
$dddd$=$aaaa$.extractMetadata=function f(data){
	const re = f.re;
	data.meta = {};
	for (;;) {
		let match = re.exec(data.note);
		if (match) {
			if (match[2] === ':') {
				data.meta[match[1]] = match[3];
			} else {
				data.meta[match[1]] = true;
			}
		} else {
			break;
		}
	}
};
$dddd$.re=/<([^<>:]+)(:?)(([^>]|\n)*)>/g;
$aaaa$.isBattleTest=none;
$aaaa$.isEventTest=none;
$aaaa$.isSkill=function(item){
	return item&&$dataSkills[item.id]===item;
};
$aaaa$.isItem=function(item){
	return item&&$dataItems[item.id]===item;
};
$aaaa$.isWeapon=function(item){
	return item&&$dataWeapons[item.id]===item;
};
$aaaa$.isArmor=function(item){
	return item&&$dataArmors[item.id]===item;
};
$aaaa$.titleAddName=function(info){
	return (info.name===undefined?"":(info.name+" @ ")) + info.title;
};
$dddd$=$aaaa$.class=function f(item){
	if(item&&item.constructor===Game_Item) return f.attr.indexOf(item._dataClass);
	let data=[$dataSkills,$dataItems,$dataWeapons,$dataArmors];
	for(let x=0;x!==data.length;++x) if(data[x][item.id]===item) return x;
	return -1;
};
$dddd$.attr=['skill','item','weapon','armor'];
$dddd$.text=["技能","道具","武器","防具"];
$aaaa$.classData=function(item){
	let data=[$dataSkills,$dataItems,$dataWeapons,$dataArmors];
	return data[this.class(item)];
};
$aaaa$.classAttr=function(item){ return this.class.attr[this.class(item)]; };
$aaaa$.classText=function(item){ return this.class.text[this.class(item)]; };
$rrrr$=$aaaa$.saveGame;
$dddd$=$aaaa$.saveGame=function f(sfid){
	debug.log('DataManager.saveGame');
	if(sfid==='online'){
		if(window.gasPropagate===undefined) return false;
		let data_raw=JsonEx.stringify(this.makeSaveContents());
		let data_compressed=LZString.compressToBase64(data_raw);
		debug.log('',"raw size",data_raw.length,"compressed",data_compressed.length);
		gasPropagate.parent.postMessage({cmd:"set",data:data_compressed,fname:$gameParty.leader().name()||"**** default name ****"},"*");
		return true;
	}else return f.ori.call(this,sfid);
}; $dddd$.ori=$rrrr$;
$r$=$aaaa$.loadGame;
($d$=$aaaa$.loadGame=function f(sfid,onlineId,data,kargs){
	// kargs:{u8arr:true-like means data is an Uint8Array object}
	if(f.cache===undefined) f.cache=new CacheSystem();
	if(sfid==='callback'){
		// set data
		this.createGameObjects();
		let data2;
		if(kargs && kargs.u8arr) data2=LZString.decompressFromUint8Array(data);
		else data2=LZString.decompressFromBase64(data);
		this.extractSaveContents(JsonEx.parse(data2));
		this.onlineOk=true;
		Scene_Load.prototype.reloadMapIfUpdated.call({});
		//$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
		//$gamePlayer.requestMapReload();
		if($gamePlayer._currentTitle!==undefined) $dataSystem.gameTitle=$gamePlayer._currentTitle;
		SceneManager.goto(Scene_Map);
		$gameSystem.onAfterLoad();
		return true;
	}else if(sfid==='online'){
		// check gas
		if(window.gasPropagate===undefined) return false;
		// reserve bgm
		$gameSystem.onBeforeSave();
		// display effects
		SceneManager._scene.fadeOutAll();
		// error handling. prevent extra inputs
		SceneManager.push(Scene_Black);
		// find cache
		let tmp;
		if((tmp=f.cache.get(onlineId))!==undefined){
			this.onlineOk=this.loadGame('callback',onlineId,tmp);
			if(this.onlineOk) return true;
			f.cache.del(onlineId);
		}
		// send
		this.onlineOk=false;
		gasPropagate.parent.postMessage({cmd:"get",fname:onlineId},"*");
		
		return this.onlineOk;
	}else if(f.ori.call(this,sfid)){
		if($gameTemp){
			const arr=objs._vars_objArg;
			const caches=arr.map(f.forEach);
			$gameTemp.clearCacheAll();
			for(let x=0;x!==arr.length;++x) if(caches[x]) $gameTemp._$gameObjs_tmp.set(arr[x],caches[x]);
		}
		if($gamePlayer._currentTitle!==undefined) $dataSystem.gameTitle=$gamePlayer._currentTitle;
		return true;
	}else return false;
}).ori=$r$;
$d$.forEach=x=>$gameTemp._$gameObjs_tmp.get(x);
$aaaa$.saveGameWithoutRescue = function(savefileId) {
	let json = JsonEx.stringify(this.makeSaveContents());
	if(json.length >= 262144 && objs.isDev) setTimeout(()=>console.log('Save data too big!',savefileId,json.length),1);
	StorageManager.save(savefileId, json);
	this._lastAccessedId = savefileId;
	let globalInfo = this.loadGlobalInfo() || [];
	globalInfo[savefileId] = this.makeSavefileInfo();
	this.saveGlobalInfo(globalInfo);
	return true;
};
$rrrr$=$aaaa$.makeSaveContents;
$dddd$=$aaaa$.makeSaveContents=function f(){
	debug.log('DataManager.makeSaveContents');
	$gameParty.saveDynamicEvents();
	if($dataMap && $gameMap._mapId){ // clean SS
		const curr=$gameSelfSwitches._data[$gameMap._mapId];
		if(!isNone(curr)){
			curr.tmp=0;
			rpgevts.list.cleanSs();
			delete curr.tmp;
		}
	}
	let rtv=f.ori.call(this);
	let tmp;
	
	// starting events
	if((tmp=$dataMap.strtEvts)&&tmp.length){
		$gameMap._strtEvts=tmp.map(x=>x[1]===undefined?[x[0]._eventId]:[x[0]._eventId,x[1]]);
	}else delete $gameMap._strtEvts;
	
	// party apps to config apps
	if(tmp=rtv.party._apps){
		let apps_dst=ConfigManager._apps;
		if(!apps_dst) apps_dst=ConfigManager._apps={};
		for(let i in tmp) apps_dst[i]=tmp[i];
	}
	ConfigManager.save();
	
	// trim mapChanges to JSON
	if(rtv.party.mapChanges){
		if(this._mapId) f.delAttrs_evts(rtv.party.mapChanges[this._mapId]);
		else{ for(let x=0,mcs=rtv.party.mapChanges;x!==mcs.length;++x){
			if(!mcs[x]){ mcs[x]=0; continue; }
			f.delAttrs_evts(mcs[x]=deepcopy(mcs[x]));
		} }
	}
	
	// trim actors._data
	if(rtv.actors._data){
		let arr=rtv.actors._data;
		for(let x=0;x!==arr.length;++x)
			if(arr[x]) arr[x]._toSaveData();
			else arr[x]=0;
	}
	// trim actors._clones
	if(rtv.actors._clones){
		let arrs=rtv.actors._clones,trees=$gameTemp._acs_holes;
		let len=Math.min(arrs.length,trees.length);
		for(let a=0;a!==len;++a){ if(arrs[a] && trees[a]){
			let arr=arrs[a];
			//trees[a].forEach(seg=>{ if(seg[0]<seg[1]) for(let x=seg[0],xs=seg[1];x!==xs;++x) arr[x]=0; },true);
			for(let x=0;x!==arr.length;++x)
				if(arr[x]) arr[x]._toSaveData();
				else arr[x]=0;
		} }
	}
	
	// trim interpreter: events just erased might only in it: 'this._character'
	{
		let itp=rtv.map._interpreter;
		if(!itp.isRunning()) itp.clear();
	}
	
	// trim online chrs: player,events,vehicles
	f.delAttrs_chr(rtv.player);
	for(let x=0,arr=rtv.player._followers._data;x!==arr.length;++x){
		let fo=arr[x]; if(!fo){ arr[x]=0; continue; }
		f.delAttrs_chr(fo);
	}
	for(let x=0,arr=rtv.map._events;x!==arr.length;++x){
		let evt=arr[x]; if(!evt){ arr[x]=0; continue; }
		f.delAttrs_chr(evt);
	}
	for(let x=0,arr=rtv.map._vehicles;x!==arr.length;++x){
		let v=arr[x]; if(!v){ arr[x]=0; continue; }
		f.delAttrs_chr(v);
	}
	// add info
	rtv.player._currentTitle=$dataSystem.gameTitle;
	// rnd bgm/bgs
	if(AudioManager._pitchesBgm_data){
		const arr=AudioManager._pitchesBgm_data;
		arr.pos=AudioManager._pitchesBgm_pos;
		rtv.system._bgmOnSave=arr;
	}
	if(AudioManager._pitchesBgs_data){
		const arr=AudioManager._pitchesBgs_data;
		arr.pos=AudioManager._pitchesBgs_pos;
		rtv.system._bgsOnSave=arr;
	}
	return rtv;
}; $dddd$.ori=$rrrr$;
$dddd$.delAttrs_chr=function f(chr){
	for(let arr=f.list,x=arr.length;x--;) delete chr[arr[x]];
	let tmp;
	tmp=chr._mvSpBuf; if(tmp && tmp.buff.length===0&&tmp.debuff.length===0&&tmp.stack.length===0) delete chr._mvSpBuf;
};
$dddd$.delAttrs_chr.list=["_movementSuccess","_tilemapKey","_interpreter","_imgModded","_imgModded_timestamp","_sprite","_tmp","_strtByAny_skips",];
$dddd$.delAttrs_evts=function(mc){
	if(!mc) return 0;
	let evts=mc.events,delAttrs=DataManager._delAttrs_dynamicEvt,delKeys=[];
	for(let i in evts){
		let evt=evts[i];
		if(!evt) delKeys.push(i);
		for(let a=0;a!==delAttrs.length;++a) delete evt[delAttrs[a]];
	}
	for(let x=0;x!==delKeys.length;++x) delete evts[delKeys[x]];
	return mc;
};
$aaaa$._delAttrs_dynamicEvt=$dddd$.delAttrs_chr.list.concat(["_moveSpeed","_moveFrequency","_opacity","_blendMode","_pattern","_priorityType","_tileId","_characterName","_characterIndex","_isObjectCharacter","_walkAnime","_stepAnime","_directionFix","_through","_transparent","_bushDepth","_animationId","_balloonId","_animationPlaying","_balloonPlaying","_animationCount","_stopCount","_jumpCount","_jumpPeak","_movementSuccess","_moveRouteForcing","_moveRoute","_moveRouteIndex","_originalMoveRoute","_originalMoveRouteIndex","_waitCount","_moveType","_trigger","_starting","_erased","_pageIndex","_originalPattern","_originalDirection","_prelockDirection","_locked","_mapId", "_addedCnt_strtEvts",]);
$dddd$=$aaaa$.putbackAttrs_chr=function f(dst,src){
	for(let x=0,arr=f.list;x!==arr.length;++x) dst[arr[x]]=src[arr[x]];
};
$dddd$.list=["_x","_y","_realX","_realY","_direction","_directionFix","_moveRoute","_moveRouteIndex","_moveRouteForcing","_originalMoveRoute","_originalMoveRouteIndex","_waitCount",];
$rrrr$=$aaaa$.extractSaveContents;
$dddd$=$aaaa$.extractSaveContents=function f(content){
	debug.log('DataManager.extractSaveContents');
	// $game* are created , $gameActors._data.length===0 , $gameTemp will not changed 
	let tmp;
	
	
	// changes of data structures
	// - system
	tmp=content.system;
	// - - usr
	if(tmp._usr){ // ensure obj type
		const c=Game_System.Usr;
		if(tmp._usr.constructor!==c) tmp._usr=Object.toType(tmp._usr,c);
	}else tmp._usr=new Game_System.Usr();
	// - map
	tmp=content.map;
	// - - evts
	for(let x=0,arr=tmp._events;x!==arr.length;++x){
		if(arr[x]) arr[x]._deleteOldDataMember();
	}
	// - party
	tmp=content.party;
	if(tmp._lastItem){
		tmp._lastItem._deleteOldDataMember();
	}
	// - - _actors
	if(!tmp._acs){ // tmp._actors -> tmp._acs
		tmp._acs=tmp._actors;
		delete tmp._actors;
	}
	// - - mapChanges
	if(tmp.mapChanges){
		for(let x=0,arr=tmp.mapChanges;x!==arr.length;++x) if(arr[x]===0) arr[x]=undefined;
	}
	tmp._actors=tmp._acs; // make search table
	// - player
	$gamePlayer=tmp=content.player; // need by 'addFollowers'
	tmp._deleteOldDataMember();
	// - - followers
	{
		let arr=tmp._followers._data;
		tmp._followers._data=[];
		arr.length=content.party._acs.length-1;
		for(let x=0;x!==arr.length;++x) tmp._followers.addFollower(arr[x],true);
	}
	// - actors
	tmp=content.actors;
	if(!tmp._clones){
		let data=tmp._data;
		tmp.initialize();
		tmp._data=data;
	}
	tmp.updateTbl_all();
	
	f.ori.call(this,content);
	
	// - sys
	tmp=content.system;
	tmp.sysSetting();
	tmp._database_putAll();
	
	// config apps to party apps
	if(tmp=ConfigManager._apps){
		let apps_dst=content.party._apps;
		if(!apps_dst) apps_dst=content.party._apps={};
		for(let i in tmp) apps_dst[i]=tmp[i];
	}
	ConfigManager.save();
	
	content.map.loadDynamicEvents(true);
}; $dddd$.ori=$rrrr$;
$aaaa$.maxSavefiles=function(){
	let rtv=_global_conf["default max savefiles"]||64;
	if(ConfigManager)
		if(ConfigManager.maxSavefiles===0) rtv=0;
		else rtv=ConfigManager.maxSavefiles||rtv;
	return rtv;
};
$rrrr$=$dddd$=$aaaa$=undef;


// --- --- BEG debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---



$rrrr$=$dddd$=$aaaa$=undef;
// --- --- END debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

if(objs.isDev) console.log("obj_t0-datamanager");
