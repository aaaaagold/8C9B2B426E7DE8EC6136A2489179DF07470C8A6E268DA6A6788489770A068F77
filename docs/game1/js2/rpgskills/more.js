"use strict";
(()=>{ let list=rpgskills.list,filter=rpgskills.filter;

list.followingSwitch=action=>{
	$gamePlayer._followers._following^=1;
};
list.followingDiscard=(action,filter)=>{
	const subject=action.subject();
	SceneManager._scene.itemTargetActors().forEach(actor=>actor&&(!filter||filter(actor,subject))&&$gameActors.destroy(actor._actorId)&&$gameParty.removeActor(actor._actorId));
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

const newMyself_argv=[0];
list.newMyself_actor=(action,leaveAtBattleEnd,equFixed)=>{
	newMyself_argv.length=1; newMyself_argv[0]=action._subjectActorId;
	const rtv=rpgevts.list.addClone(false,newMyself_argv);
	if(rtv){
		const subject=action.subject();
		rtv._states=subject._states.slice(0);
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
		return rtv;
	}
	SoundManager.playBuzzer();
	$gameMessage.popup($dataCustom.chrRepeatMaxMeet,true);
};
list.newMyself_enemy=(action,leaveAtBattleEnd)=>{
	// TODO
};
list.newMyself=(action,leaveAtBattleEnd)=>action._subjectActorId.toId()>0?list.newMyself_actor(action):list.newMyself_enemy(action);
list.newMyself_battle=action=>action._subjectActorId.toId()>0?list.newMyself_actor(action,true):list.newMyself_enemy(action,true);
list.newMyself_battle_equFixed=action=>action._subjectActorId.toId()>0?list.newMyself_actor(action,true,true):list.newMyself_enemy(action,true,true);
list.newMyself_equFixed=action=>action._subjectActorId.toId()>0?list.newMyself_actor(action,undefined,true):list.newMyself_enemy(action,undefined,true);

})();
