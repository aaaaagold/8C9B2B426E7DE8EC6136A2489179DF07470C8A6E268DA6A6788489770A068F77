"use strict";

if(!window.objs) window.objs={};

(()=>{ let list=objs.rpgskills.filter;

list.isRoadblock=actor=>{
	if(!actor) return false;
	let tmp=actor._actorId.toId();
	return 12<tmp&&tmp<16;
};
list.isMyClone=(actor,subject)=>{ // bind this function to the skill user
	return actor && subject && actor._meta && actor._meta.isClone && subject._actorId && actor._actorId && subject._actorId.toId()===actor._actorId.toId() ;
};
list.isSummoned=actor=>{
	if(!actor) return false;
	const ad=actor.getData();
	return ad && Object.hasOwnProperty.call(ad.meta,'summoned');
};

})();
