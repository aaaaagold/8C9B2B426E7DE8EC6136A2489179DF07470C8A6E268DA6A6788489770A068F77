"use strict";
// etc.
// form: any
(()=>{ // strt
let list=rpgevts.list;

list.discardLastNChoices=n=>{
	if(n>=0) ; else n=1;
	return (olist,c,rtv)=>{
		let next1=deepcopy(olist[c]);
		next1.parameters[0].length-=n;
		rtv.push(next1);
		return 1;
	};
};
list.discardShopItemsFirstN=n=>{
	if(n>=0) ; else n=0;
	return (olist,c,rtv)=>{
		if(olist[c].code!==302) throw new Error('the following command in the event page is not a shop command');
		let shopLen=1;
		for(let cmd=olist[c+shopLen];cmd&&cmd.code===605;cmd=olist[c+shopLen])
			++shopLen;
		if(n>=shopLen){
			n=shopLen;
			let next1=deepcopy(olist[c]);
			next1.parameters[1]=0;
			rtv.push(next1);
		}else{
			let next1=deepcopy(olist[c]);
			for(let x=4,i=c+n;x--;) next1.parameters[x]=olist[i].parameters[x];
			rtv.push(next1);
			++n; // need edit first shop command
		}
		return n;
	};
};
const genChoices_scr_saveChoiceName="this._tmpData.lastChoiceName=this._list[this._index-1].parameters[1];";
const genChoices_putPairs=function f(p,i){
	this.push({code:402,indent:f.indent,parameters:[i,p[0]]});
	this.push({code:355,indent:f.indent+1,parameters:[genChoices_scr_saveChoiceName]});
	this.push({code:119,indent:f.indent+1,parameters:[p[1]]});
	this.push(Game_Interpreter.EMPTY);
};
const genChoices_toChoiceOnly=x=>x[0];
list.genChoices=(windowOpt,defaultChoiceId,label_cancel,choiceLabelPairs)=>{
	windowOpt=windowOpt||{};
	choiceLabelPairs=choiceLabelPairs||[];
	return (olist,c,rtv)=>{
		const indent=olist[c-1].indent;
		rtv.push({code:102,indent:indent,parameters:[
			choiceLabelPairs.map(genChoices_toChoiceOnly),
			label_cancel?-2:-1, // -1: disable cancal
			defaultChoiceId>=0?defaultChoiceId:-1,
			windowOpt.pos===undefined?2:windowOpt.pos, // pos
			windowOpt.bak===undefined?0:windowOpt.bak, // background
		]});
		const f=genChoices_putPairs;
		f.indent=indent;
		choiceLabelPairs.forEach(f,rtv);
		rtv.push({code:403,indent:indent,parameters:[]});
		rtv.push({code:355,indent:indent+1,parameters:[genChoices_scr_saveChoiceName]});
		rtv.push({code:119,indent:indent+1,parameters:[label_cancel]});
		rtv.push(Game_Interpreter.EMPTY);
		return 0;
	};
};
const randSelCmdFromNextIf0_ifTrue_param=[12,"1"];
const randSelCmdFromNextIf0_forEach=function(x){this.push(x);};
list.randSelCmdFromNextIf0=(olist,c,rtv)=>{
	if(!olist.length) return 0; // how would this error happen?
	// use elseSkipN , skip next "if" cmd
	// sel indent = if's + 1
	if(olist[c].code!==111) throw new Error('the following command in the event page is not an if command');
	if(olist.back.code) olist.push(Game_Interpreter.EMPTY);
	const indent=olist[c].indent;
	const indent_=indent+1;
	const cmds=[];
	let i=c+1;
	while(olist[i].indent!==indent){ if(olist[i].indent===indent_){
		if(!olist[i].code){ ++i; break; }
		let j=i;
		while(olist[++j].indent!==indent_)
			;
		while(olist[j].code>=400 && olist[j].indent===indent_) ++j; // seq cmd
		cmds.push(i,j);
		i=j-1;
	} ++i; }
	// now i = endIf
	rtv.push({code:111,indent:indent,parameters:randSelCmdFromNextIf0_ifTrue_param});
	const ch=~~(Math.random()*(cmds.length>>1));
	olist.slice(cmds[ch<<1],cmds[(ch<<1)|1]).forEach(randSelCmdFromNextIf0_forEach,rtv);
	// seems code:0 if not needed
	rtv.push(olist[i]); // endIf
	return ++i-c; // now i = next to endIf
};
list.getSS=(self,argv)=>{
	if(!argv) return false;
	return $gameMap.ss(argv[0],argv[1]);
};
list.setSS=(self,argv)=>{
	if(!argv) return false;
	return $gameMap._events[argv[0]].ssStateSet(argv[1],(!argv[2])|0);
};
list.popupmsg_u=(self,argv)=>$gameMessage.popup(argv[0],1);
list.strtEvt=(self,argv)=>{
	let meta=argv[1]||{}; meta.startBy=self._eventId;
	return $gameMap._events[argv[0]].start(undefined,meta);
}
list.strtEvt_noStartBy=(self,argv)=>$gameMap._events[argv[0]].start(undefined,argv[1]);
let refreshEvtViaId=id=>$gameMap._events[id].refresh(true);
list.refreshEvt=(self,argv)=>argv.forEach(refreshEvtViaId);
list.locate=(self,argv)=>self.locate(argv[0],argv[1]);
list.evtJmp=(self,argv)=>$gameMap._events[argv[0]].jump(argv[1],argv[2]);
let mv2evts_map=id=>$gameMap._events[id];
list.mv2evts=(self,argv)=>self.moveToChrs_bfs(argv.map(mv2evts_map));
list.mv2evtsWithMetaTag=(self,argv)=>{
	let arr=$gameMap._events.filter(evt=>evt&&!evt._erased&&evt.getData().meta[argv[0]]);
	return arr&&self.moveToChrs_bfs(arr);
};
list.cpevtOnTiles=(self,argv)=>{
	let evtid=argv[0];
	let tileLv=argv[1];
	let tileBeg=argv[2];
	let tileEnd=argv[3];
	let rate=argv[4]===undefined?1:argv[3];
	for(let y=0,w=$gameMap.width(),h=$gameMap.height();y!==h;++y){ for(let x=0;x!==w;++x){
		let tile=$gameMap.allTiles(x,y)[3-tileLv];
		if(tileBeg<=tile&&tile<tileEnd&&Math.random()<rate) $gameMap.cpevt(evtid,x,y,1,1);
	} }
};
list.chaseWithHistory=(self,argv)=>{
	const dist=argv&&argv[0]||7;
	const target=argv&&argv[1]||$gamePlayer;
	const kargs=argv&&argv[2];
	while(self.queueLen(0)>=dist) self.queuePop(0);
	if(self.isNearThePlayer(0,dist)) self.moveTypeTowardPlayer();
	else{
		let p=target,dir;
		if(dir=self.findDirTo([[p.x,p.y],],undefined,kargs)){
			self.moveStraight(dir);
			self.pushXyToQueue(0,target);
		}else if(dir=self.findDirFromQueue(0,undefined,kargs)){
			self.moveStraight(dir);
		}else self.moveRandom();
	}
};
const chasePlayerWithHistory_argv=[]; chasePlayerWithHistory_argv.length=3;
list.chasePlayerWithHistory=(self,argv2)=>{
	chasePlayerWithHistory_argv[0]=2;
	chasePlayerWithHistory_argv[1]=$gamePlayer;
	chasePlayerWithHistory_argv[2]=argv2&&argv2[0];
	return list.chaseWithHistory(self,chasePlayerWithHistory_argv);
};

list.core_nearestTree=(xy)=>{
	let evts=$gameMap._events;
	let org={x:xy.x,y:xy.y,dist2:true};
	let h=new Heap((b,a)=>a.dist2(org)-b.dist2(org));
	for(let x=0;x!==evts.length;++x){
		let evt=evts[x];
		if(evt && $gameMap.isValid(evt.x,evt.y) & !evt._erased && evt.event().meta.dectree)
			h.push(evt);
	}
	return h.top;
};
list.core_gotoNearestTree=(chr,minRemain)=>{
	minRemain^=0;
	let srcXY=chr,dstXY=list.core_nearestTree(chr);
	if(!srcXY||!dstXY) return;
	else if(!($gameParty.mapChanges[74].vars.tree>=minRemain)) return chr.moveRandom();
	let dx=((dstXY.x-srcXY.x)^0).clamp(-1,1)^0;
	let dy=((srcXY.y-dstXY.y)^0).clamp(-1,1)^0;
	return chr.moveDiagonally(dx===0?0:dx+5,dy===0?0:dy*3+5);
};

list.crystalcave_dragon_chase=(self)=>{
	//:! ["list","crystalcave_dragon_chase"]
	while(self.queueLen(0)>=7) self.queuePop(0);
	if(self.isNearThePlayer(0,7)) self.moveTypeTowardPlayer();
	else{
		let p=$gamePlayer,dir;
		if(dir=self.findDirectionTo(p.x,p.y)){
			self.moveStraight(dir);
			self.pushXyToQueue(0,$gamePlayer);
		}else if(dir=self.findDirFromQueue(0)){
			self.moveStraight(dir);
		}else self.moveRandom();
	}
};

list.treeRemain=self=>$gameParty.mch().vars.tree;

list.gameoverIfSameLoc=(self)=>{
	//:! ["list","gameoverIfSameLoc"]
	// too frequent cause stuck @ changing scene
	if(self.dist2($gamePlayer)===0) SceneManager.goto(Scene_Gameover);
};
list.playerJumpToMe=(self,argv)=>{
	// argv = dx,dy
	let x=self.x,y=self.y;
	if(argv){
		x+=argv[0]|0;
		y+=argv[1]|0;
	}
	return $gamePlayer.jumpAbs(x,y);
};
list.playerIsInLoc=(self,argv)=>$gamePlayer.isInLoc(argv[0],argv[1],argv[2],argv[3]);

let burnLicenceLv_funcCache;
list.burnLicenceLv=()=>{
	if(!burnLicenceLv_funcCache) burnLicenceLv_funcCache=eval($dataCustom._code.getBurnLicenceLv);
	return burnLicenceLv_funcCache();
};
list.partyBurnLvOutput=(self)=>$gameParty.burnLvOutput();
list.partyBurnLvOutputGe=(self,argv)=>list.partyBurnLvOutput()>=argv[0];
list.gotBurnLvOutput=(self,argv,itrp)=>(itrp._strtMeta&&itrp._strtMeta.partyBurnLvOutput)|0;
list.gotBurnLvOutputGe=(self,argv,itrp)=>list.gotBurnLvOutput(self,argv,itrp)>=argv[0];
list.gotBurnLvOutputGeBurnlv=(self,argv,itrp)=>list.gotBurnLvOutput(self,argv,itrp)>=(Number(self.getData().meta.burnlv)|0);

list.cleanSs=()=>{
	let data=$gameSelfSwitches._data;
	for(let x=0;x!==data.length;++x){
		let d=data[x],hasKey=false,iv=[];
		for(let i in d){
			if(d.hasOwnProperty(i)){
				let hasKeyEvt=false;
				for(let i2 in d[i]){
					if(hasKeyEvt=d[i].hasOwnProperty(i2)){
						break;
					}
				}
				if(hasKeyEvt===false) iv.push(i);
				else hasKey=true;
			}
		}
		if(hasKey===false) data[x]=0;
		else for(let i=0;i!==iv.length;++i) delete d[iv[i]];
	}
	while(data.length&&!data.back) data.pop();
	for(let x=0;x!==data.length;++x) if(!data[x]) data[x]=0;
};

list.clearSsInNoobs=()=>{
	let data=$gameSelfSwitches._data,mcs=$gameParty.mapChanges;
	let maps=[129,131,132,133,134,135,136,];
	for(let x=0;x!==maps.length;++x){
		let idx=maps[x];
		data[idx]=0;
		if(mcs[idx]) mcs[idx].events={};
	}
	list.cleanSs();
};
list.zone1_transChoices=()=>list.discardLastNChoices(4-$gameVariables.value(8));
list.achievement_zone1_urReady=()=>{
	let ac=$gameParty._achievement;
	if(ac[14]&&ac[15]&&ac[16]) $gameParty.gainAchievement(18);
};

list.gainAchievement=(self,id)=>$gameParty.gainAchievement(id);

list.treeGotBurnType=(self,argv,itrp)=>{
	let strtMeta=itrp._strtMeta;
	if(!strtMeta) return 0;
	return (strtMeta.slash<<1)|(strtMeta.burn);
};
list.evtCanBeBurnt=(self,argv,itrp)=>self.canBurned();
list.evtCanBeSlashed=(self,argv,itrp)=>self.canSlashed();

list.ko_lab_genBalls=(self,argv)=>{ // mvr
	if(self._funcMvrIdx===argv[0]) return;
	self._funcMvrIdx|=0;
	if(self.x&1){
		self._funcMvrIdx=0;
		self.jumpAbs(16,15);
	}else switch(self._funcMvrIdx&1){
	default: break;
	case 0:{
		AudioManager.playSe({name:"jump1",volume:90,pitch:100});
		if(self._funcMvrIdx&16) self.jumpAbs((self._funcMvrIdx&15)+2,self.y);
		else self.jumpAbs(16-(self._funcMvrIdx&15),self.y);
	}break;
	case 1:{
		self.setDirection(8);
		if($gameMap.cpevt(4,self.x,self.y-1,1,1)) $gameMap._events.back._exp=(self.x>>1)-1;
		if((self._funcMvrIdx&15)^15) self._wc=12;
		else self._wc=113;
	}break;
	}
	++self._funcMvrIdx;
};
let filterBalls=evt=>evt.getData().meta.ctrBall;
list.ko_lab_checkBalls=(self,argv)=>{
	let w=$gameMap.width(),rtv=0;
	for(let x=2,yw=w*5;x!==18;x+=2){
		let idx=yw+x;
		if($dataMap.coordTbl_strtByAny_P1[idx].some(filterBalls)) rtv|=(x>>1)-1;
	}
	let cnt=0;
	for(let x=w-1,y=0,h=$gameMap.height();y!==h;++y) if($dataMap.coordTbl_strtByAny_P1[y*w+x].some(filterBalls)) ++cnt;
	rtv|=(cnt!==1)<<8;
	return rtv;
};

const rfl_mv2evts_fortask_filter=(evt,taskid)=>{
	if(!evt) return;
	const m=evt.getData().meta.fortask;
	return !taskid?m:m===taskid;
};
const rfl_mv2evts_fortask_map=x=>[x.x,x.y];
const rfl_mv2evts_fortask_sort=(a,b)=>a.y===b.y?a.x===b.x?a._eventId>b.eventId:a.x>b.x:a.y>b.y;
list.rfl_mv2evts_fortask_bfs=(self,argv)=>{
	const p=argv[2]===undefined?0.25:argv[2];
	if(Math.random()<p) return self.moveRandom();
	const taskid=argv[0];
	const part=argv[1]>1?getPrime(1<<(argv[1]&3)):argv[1]+1;
	if(!$dataMap.fortask) $dataMap.fortask={};
	let arr=$dataMap.fortask[taskid]; if(!arr || arr.fc!==Graphics.frameCount){
		arr=$dataMap.fortask[taskid]=$gameMap._events.filter( evt => $gameMap.isValid(evt.x,evt.y) && rfl_mv2evts_fortask_filter(evt,taskid) ).sort(rfl_mv2evts_fortask_sort);
		arr.fc=Graphics.frameCount;
	}
	const tmp=(1<part && part<arr.length)&&arr.filter((evt,i)=>$gameMap.isValid(evt.x,evt.y) && i%part===0);
	if(tmp && tmp.length) arr=tmp;
	else if( !arr.some((evt,i)=>$gameMap.isValid(evt.x,evt.y)) ) arr=0;
	if(1>=part && !arr.length) $dataMap.fortask[taskid].length=0;
	const dir = arr && arr.length && self.findDirTo(arr.map(rfl_mv2evts_fortask_map));
	if(dir) self.moveDiagonally_d8(dir);
	else if(Math.random()<0.5) self.moveRandom();
	else self.moveToChr_bfs($gamePlayer);
};
list.rfl_moveAnt=(self,argv)=>{
	const taskid=argv[0];
	const w=$dataMap.width,h=$dataMap.height,ox=self.x,oy=self.y;
	let tbl=$dataMap.rfl_moveAnt;
	if(!tbl){ tbl=$dataMap.rfl_moveAnt=[]; tbl.length=w*h; for(let x=0;x!==tbl.length;++x) tbl[x]=0; }
	++tbl[oy+w+ox];
	let arr=[],x,y,v=(~0)>>>1;
	
	if(self.canPass(ox,oy,6)){
		x=ox+1; y=oy; if(x===w) x=0;
		if(v>tbl[y*w+x]){ v=tbl[y*w+x]; arr.length=0; }
		arr.push(6);
	}
	if(self.canPass(ox,oy,4)){
		x=ox-1; y=oy; if(x<0) x+=w;
		if(v>tbl[y*w+x]){ v=tbl[y*w+x]; arr.length=0; }
		arr.push(4);
	}
	if(self.canPass(ox,oy,2)){
		x=ox; y=oy+1; if(y===h) y=0;
		if(v>tbl[y*w+x]){ v=tbl[y*w+x]; arr.length=0; }
		arr.push(2);
	}
	if(self.canPass(ox,oy,8)){
		x=ox; y=oy-1; if(y<0) y+=h;
		if(v>tbl[y*w+x]){ v=tbl[y*w+x]; arr.length=0; }
		arr.push(8);
	}
	
	if(arr.length) self.moveDiagonally_d8(arr.rnd());
	else self.moveRandom();
};
list.rfl_mv2evts_fortask=list.rfl_mv2evts_fortask_bfs;
list.rfl_mimicPlayer_init=(evt,dx,dy)=>{
	dx|=0; dy|=0;
	evt._moveSpeed=$gamePlayer.realMoveSpeed();
	evt._color=$gamePlayer._getColorEdt();
	evt._scale=$gamePlayer._getScaleEdt();
	[
		'_characterIndex','_characterName','_pattern',
		'_realX','_realY','_x','_y',
	].forEach(k=>evt[k]=$gamePlayer[k]);
	evt._x+=dx; evt._realX+=dx;
	evt._y+=dy; evt._realY+=dy;
};
list.rfl_mimicPlayer=(evt,dx,dy)=>{
	dx|=0; dy|=0;
	[
		'_pattern',
		'_realX','_realY','_x','_y',
	].forEach(k=>evt[k]=$gamePlayer[k]);
	evt._x+=dx; evt._realX+=dx;
	evt._y+=dy; evt._realY+=dy;
};
list.rfl_mimicPlayer_rflX=(evt,cx)=>{
	list.rfl_mimicPlayer(evt,0,0);
	evt._x-=(~~(evt._x-cx))<<1;
	evt._realX-=(evt._realX-cx)*2;
};
list.rfl_mimicPlayer_rflY=(evt,cy)=>{
	list.rfl_mimicPlayer(evt,0,0);
	evt._y-=(~~(evt._y-cy))<<1;
	evt._realY-=(evt._realY-cy)*2;
};

list.addClone=(self,argv)=>{ // id , use template name , not copy equips , 
	if(!argv) return;
	let actor=$gameParty.addActor(argv[0],true);
	if(!actor) return;
	actor.noRefresh=true;
	const src=$gameActors.actor(argv[0]);
	
	const namePrefix=(argv[1]?actor:src).name();
	const id=actor._actorId;
	// add '-'number if not first
	if(id.toId()!==id) actor.setName(namePrefix+id.slice(id.indexOf('-')));
	
	if(!argv[2]){
		for(let i=0,sarr=src._equips,darr=actor._equips;i!==sarr.length;++i){
			const d=darr[i];
			if(d.constructor!==Array) Object.assign(d,sarr[i]);
			else{ const s=sarr[i]; for(let i2=0;i2!==s.length;++i2){
				if(d[i2]) Object.assign(d[i2],s[i2]);
				else d[i2]=Object.toType(s[i2],s[i2].constructor);
			} d.length=s.length; }
		}
		actor._equips_delCache();
		actor._classId=src._classId;
	}
	
	actor.noRefresh=0;
	if(actor._needRefresh){
		delete actor._needRefresh;
		actor.refresh();
	}
	return actor;
};
list.addCloneLeader=(self,argv)=>list.addClone(self,argv?[$gameParty.leader()._actorId].concat(argv):[$gameParty.leader()._actorId]);
list.addClone_battle=(self,argv)=>{
	// id , use template name , not copy equips , 
	const rtv=list.addClone(self,argv);
	if(rtv){
		rtv._meta.leaveAtBattleEnd=true;
	}
	return rtv;
};

list.rndmazepasses=()=>{
	const rtv=[],meta=$dataMap.meta;
	if(!meta.random) return rtv;
	const tilepass=meta.tilepass.split(',').map(Number); tilepass[0]=3-tilepass[0];
	const tileblock=meta.tileblock.split(',').map(Number); tileblock[0]=3-tileblock[0];
	for(let y=0,w=$gameMap.width(),h=$gameMap.height();y!==h;++y){ for(let x=0;x!==w;++x){ let curr=$gameMap.allTiles(x,y);
		if(curr[tilepass[0]]===tilepass[1]&&curr[tileblock[0]]!==tileblock[1]) rtv.push(y*w+x);
	} }
	return rtv;
};

})();
