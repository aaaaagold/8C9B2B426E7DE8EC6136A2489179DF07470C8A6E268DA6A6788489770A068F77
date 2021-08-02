"use strict";

if(!window.objs) window.objs={};

(()=>{ const list=objs.rpgskills.filter;
const chase=list.chase={}; // chaseCond

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
list.isSummoned_dead=actor=>list.isSummoned(actor)&&actor.isDeathStateAffected();
list.isSummoned_alive=actor=>list.isSummoned(actor)&&!actor.isDeathStateAffected();

chase.subjectIsMe=(b,s,t)=>b===s;
chase.subjectIsMeNotTarget=(b,s,t)=>b===s&&b!==t;
chase.targetIsMe=(b,s,t)=>b===t;
chase.targetIsMeNotSubject=(b,s,t)=>b===t&&b!==s;
chase.subjectIsTarget=(b,s,t)=>s===t;
chase.subjectIsTargetNotMe=(b,s,t)=>b!==s&&s===t;
chase.allSame=(b,s,t)=>b===s&&b===t;

})();
