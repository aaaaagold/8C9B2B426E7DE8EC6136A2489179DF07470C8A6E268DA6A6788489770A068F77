"use strict";

if(!window.objs) window.objs={};

(()=>{ const list=objs.rpgskills.list,filter=objs.rpgskills.filter;

list.followingSwitch=action=>{
	$gamePlayer._followers._following^=1;
};
list.followingDiscard=(action,filter)=>{
	const subject=action.subject();
	{ const sc=SceneManager._scene; if(sc && sc.constructor===Scene_Skill){
		return sc.itemTargetActors().forEach(actor=>actor&&(!filter||filter(actor,subject))&&$gameActors.destroy(actor._actorId)&&$gameParty.removeActor(actor._actorId));
	} }
	const aid=$gameParty._acs[action._targetIndex];
	const a=$gameActors.actor(aid);
	if( a && (!filter||filter(a,subject)) ){
		$gameActors.destroy(aid);
		$gameParty.removeActor(aid,action._targetIndex);
	}
};

const newRoadblock_argv=[13,true,true];
list.newRoadblock=action=>{
	const rtv=rpgevts.list.addClone(false,newRoadblock_argv);
	if(rtv){
		$gameMessage.popup("新增了1個\\key'$dataActors[" + newRoadblock_argv[0] + "].name'",true);
		return rtv;
	}
	SoundManager.playBuzzer();
	$gameMessage.popup($dataCustom.chrRepeatMaxMeet,true);
};

const notiSys_stat=id=>{
	const stat=$dataStaets[id];
	if(!stat._base) return;
	
},newMyself_argv=[0];
list.newMyself_actor=(action,leaveAtBattleEnd,equFixed,collar)=>{
	newMyself_argv.length=1; newMyself_argv[0]=action._subjectActorId;
	const rtv=rpgevts.list.addClone(false,newMyself_argv);
	if(rtv){
		const subject=action.subject();
		rtv._states=subject._states.slice();
		rtv._stateTurns=deepcopy(subject._stateTurns);
		rtv._databaseAdd_state_all();
		rtv._states_delCache();
		rtv._overall_delCache();
		if(equFixed) rtv.learnSkill(56);
		rtv._meta.leaveAtBattleEnd=leaveAtBattleEnd&&1||0;
		rtv._meta.isClone=1;
		rtv._exp=deepcopy(subject._exp);
		$gameTemp.lvUpConfigs_pushAndMute();
		rtv._level-=rtv._level>0;
		rtv.gainExp(0);
		$gameTemp.lvUpConfigs_pop();
		$gameTemp.popuptmp=subject.name().replace(/\\/g,"\\\\");
		$gameMessage.popup("新增了1個\\key'$gameTemp.popuptmp'",true);
		if(collar){
			const e=$dataArmors[136];
			rtv.forceChangeEquip(e.etypeId-1,e); // from 1-based to 0-based
		}
		return rtv;
	}
	SoundManager.playBuzzer();
	$gameMessage.popup($dataCustom.chrRepeatMaxMeet,true);
};
list.newMyself_enemy=(action,leaveAtBattleEnd)=>{
	// TODO
};
list.newMyself=(action,leaveAtBattleEnd)=>(action._subjectActorId.toId()>0?list.newMyself_actor:list.newMyself_enemy)(action);
list.newMyself_battle=action=>(action._subjectActorId.toId()>0?list.newMyself_actor:list.newMyself_enemy)(action,true);
list.newMyself_battle_equFixed=action=>(action._subjectActorId.toId()>0?list.newMyself_actor:list.newMyself_enemy)(action,true,true);
list.newMyself_battle_collar=action=>(action._subjectActorId.toId()>0?list.newMyself_actor:list.newMyself_enemy)(action,true,false,true);
list.newMyself_equFixed=action=>(action._subjectActorId.toId()>0?list.newMyself_actor:list.newMyself_enemy)(action,undefined,true);
list.newMyself_equFixed_collar=action=>(action._subjectActorId.toId()>0?list.newMyself_actor:list.newMyself_enemy)(action,undefined,true,true);
list.newMyself_collar=action=>(action._subjectActorId.toId()>0?list.newMyself_actor:list.newMyself_enemy)(action,false,false,true);

list.deleteSummoned=(action,trgt)=>{
	const subject=action.subject();
	if(subject.friendsUnit()!==trgt.friendsUnit()) return;
	{ const sc=SceneManager._scene; if(sc && sc.constructor===Scene_Skill){
		sc.itemTargetActors().forEach(actor=>actor&&$gameActors.destroy(actor._actorId)&&$gameParty.removeActor(actor._actorId));
		return true;
	} }
	if(trgt.constructor===Game_Actor){
		const aid=trgt.actorId();
		const a=$gameActors.actor(aid); if(a){
			const m=$gameTemp._pt_battleMembers_actor2idx;
			$gameParty.removeActor(aid,m&&m.get(a));
			$gameActors.destroy(aid);
		}
	}else trgt.escape();
	return true;
};
const newSummoned=(act,argv)=>{
	const rtv=rpgevts.list.addClone(false,argv);
	if(rtv){ const subject=act.subject();
		rtv._hp=subject._level^0||1;
		rtv._mp=rtv.mmp;
		$gameMessage.popup("新增了1個\\key'$dataActors[" + argv[0] + "].name'",true);
		return rtv;
	}
	SoundManager.playBuzzer();
	$gameMessage.popup($dataCustom.chrRepeatMaxMeet,true);
};
const newSummoned_Skull_argv=[55,true,true];
list.newSummoned_Skull=action=>newSummoned(action,newSummoned_Skull_argv);
const newSummoned_Specter_argv=[56,true,true];
list.newSummoned_Specter=action=>newSummoned(action,newSummoned_Specter_argv);

})();
