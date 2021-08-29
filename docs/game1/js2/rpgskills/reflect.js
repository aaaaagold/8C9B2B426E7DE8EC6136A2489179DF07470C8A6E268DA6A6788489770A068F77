"use strict";

if(!window.objs) window.objs={};

(()=>{ let list=objs.rpgskills.list,filter=objs.rpgskills.filter;

const rfl_summonClones_isValidScene_cSet=new Set();
const rfl_summonClones_isValidScene=c=>{
	const s=rfl_summonClones_isValidScene_cSet;
	if(!s.size){
		s.add(Scene_Map);
		s.add(Scene_Menu);
		s.add(Scene_Skill);
	}
	return c&&s.has(c.constructor);
};
const _rfl_summonClones_genRoute=(taskid,cnt)=>{
	const rtv=deepcopy(Game_Character.EMPTY_ROUTE); rtv.repeat=true; // rtt.skippable=true;
	rtv.list[1]=rtv.list[0];
	rtv.list[0]={code:Game_Character.ROUTE_SCRIPT,parameters:[":![\"list\",\"rfl_mv2evts_fortask\",["+ (taskid|0) +","+ (cnt) +"]]",],};
	return rtv;
};
const _rfl_summonClones_setEvt_base=(evt,rsp)=>{
	evt._stepAnime=1;
	evt._through=0;
	evt._priorityType=0;
	evt._moveType=3;
	evt._moveFrequency=5;
	evt._moveSpeed = (rsp===undefined) ? $gamePlayer.realMoveSpeed() : rsp;
	evt._noUpdate=0;
	evt.longDistDetection=1;
	evt._passSelf=1;
	evt._asPlayer=1;
	return evt;
};
list.rfl_summonClones_fromActorWorkers=(actor,cnt)=>{
	const arr=actor._meta.workers;
	if(!arr||!arr.length) return;
	const t=$dataMap.templateStrt_item+11;
	const mp=$gameMap,evts=mp._events;
	const rsp=$gamePlayer.realMoveSpeed();
	const color=actor._getColorEdt();
	const scale=actor._getScaleEdt();
	const anchory=actor._getAnchoryEdt();
	const opt={
		anchory:anchory,
		color:color,
		scale:scale,
	};
	for(let x=0,cnt=0;x!==arr.length;++x){
		const m=$gameActors.actor(arr[x]);
		if(m._meta.worker && m._meta.worker[0]===$gameMap._mapId) continue;
		mp.cpevt(t,$gamePlayer.x,$gamePlayer.y,1,1,true);
		const evt=evts.back;
		m._meta.worker=[mp._mapId,evt._eventId];
		_rfl_summonClones_setEvt_base(evt,rsp);
		evt.setMoveRoute(_rfl_summonClones_genRoute(0,cnt++));
		evt.refresh();
		evt.setActorAvatar(m,opt);
	}
};
list.rfl_summonClones_all=action=>{
	const a=action.subject();
	if(!a||a.constructor!==Game_Actor||!rfl_summonClones_isValidScene(SceneManager._scene)) return;
	if(!a._meta.workers) a._meta.workers=[];
	const tbl=[];
	const t=$dataMap.templateStrt_item+11;
	const mp=$gameMap,evts=mp._events;
	const members=a.friendsUnit().members();
	const ad=a.getData();
	for(let x=0,cnt=0;x!==members.length;++x){
		const m=members[x];
		if(a===m || m._meta.worker || ad===m || ad!==m.getData()) continue;
		a._meta.workers.push(m._actorId);
		tbl.push(x,m._actorId);
	}
	for(let x=tbl.length>>1;x--;) $gameParty.removeActor(tbl[(x<<1)|1],tbl[x<<1]);
	list.rfl_summonClones_fromActorWorkers(a);
};
list.rfl_summonClone=(action,trgt)=>{
	const a=action.subject();
	if(a.friendsUnit()!==trgt.friendsUnit()) return;
	if(!a||a.constructor!==Game_Actor||!rfl_summonClones_isValidScene(SceneManager._scene)) return;
	if(!a._meta.workers) a._meta.workers=[];
	const tbl=[];
	const t=$dataMap.templateStrt_item+11;
	const mp=$gameMap,evts=mp._events;
	const members=a.friendsUnit().members();
	const ad=a.getData();
	{
		const m=trgt;
		if(a===m || m._meta.worker || ad===m || ad!==m.getData()) return;
		a._meta.workers.push(m._actorId);
		$gameParty.removeActor(m._actorId);
	}
	list.rfl_summonClones_fromActorWorkers(a);
};
list.rfl_backClones_all=action=>{
	const a=action.subject();
	if(!a||a.constructor!==Game_Actor||!rfl_summonClones_isValidScene(SceneManager._scene)) return;
	if(!a._meta.workers) return;
	const mp=$gameMap,evts=mp._events;
	const arr=a._meta.workers;
	for(let x=0;x!==arr.length;++x){
		const m=$gameActors.actor(arr[x]);
		const w=m._meta.worker;
		if(w && w[0]===mp._mapId){
			const evt=evts[w[1]];
			if(evt && evt._actorAvatar===arr[x]) evt.erase();
		}
		m._meta.worker=0;
		$gameParty.addActor(arr[x]);
	}
	arr.length=0;
	//const tbl=$dataMap.rfl_moveAnt;
	//if(tbl) for(let x=0;x!==tbl.length;++x) tbl[x]=0;
};

})();
