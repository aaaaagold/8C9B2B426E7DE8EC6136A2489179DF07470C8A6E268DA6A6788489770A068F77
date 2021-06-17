"use strict";
// after rpg_*
// traits && custom traits
// any edit database @ Scene_Boot.prototype.start

// - boot
$aaaa$=Scene_Boot;
$pppp$=$aaaa$.prototype;
$dddd$=$pppp$.arrangeData=function f(){
	
	// not ability
	//  damaged img
	f.doForEach($dataActors,x=>{
		x.dmgimg=x.meta.dmgimg?JSON.parse(x.meta.dmgimg):undefined;
	});
	// comment in first non-runable page as note
	f.doForEach($dataTroops,x=>{
		const pg0=x.pages[0]; if(pg0){
		const cond=pg0.conditions; if(!(cond.actorValid||cond.enemyValid||cond.switchValid||cond.turnEnding||cond.turnValid)){
		const arr=pg0.list;
		if(arr.length){ if(x.note===undefined) x.note=""; for(let i=0;i!==arr.length;++i){
			if(arr[i].code!==108 || arr[i].parameters[0]!=="<meta>") continue;
			for(++i;i!==arr.length && arr[i].code===408;++i){
				x.note+=arr[i].parameters[0]; x.note+="\n";
			}
			--i; // maybe break on code===108
		} }
		}
		}
		DataManager.extractMetadata(x);
	});
	
	// extend texts
	if(!$dataSystem.terms.extended){
		$dataSystem.terms.extended=true;
		const isMul=$dataSystem.terms.isMul=[];
		const arr=$dataSystem.terms.params,texts=$dataCustom.params;
		arr[-2]=texts.exr;
		isMul[-2]=true;
		arr[-1]=texts.act;
		arr.push(texts.cri);
		arr.push(texts.cev);
		arr.push(texts.mev);
		arr.push(texts.mrf);
		arr.push(texts.cnt);
		arr.push(texts.hrg);
		arr.push(texts.mrg);
		arr.push(texts.trg);
		isMul[arr.length]=true; arr.push(texts.tgr);
		isMul[arr.length]=true; arr.push(texts.grd);
		isMul[arr.length]=true; arr.push(texts.rec);
		isMul[arr.length]=true; arr.push(texts.pha);
		isMul[arr.length]=true; arr.push(texts.mcr);
		isMul[arr.length]=true; arr.push(texts.tcr);
		isMul[arr.length]=true; arr.push(texts.pdr);
		isMul[arr.length]=true; arr.push(texts.mdr);
		arr.push(texts.tbe);
		isMul[arr.length]=true; arr.push(texts.akr);
		isMul[arr.length]=true; arr.push(texts.rhp);
		isMul[arr.length]=true; arr.push(texts.rmp);
		isMul[arr.length]=true; arr.push(texts.rap);
		isMul[arr.length]=true; arr.push(texts.rdp);
		isMul[arr.length]=true; arr.push(texts.ram);
		isMul[arr.length]=true; arr.push(texts.rdm);
		isMul[arr.length]=true; arr.push(texts.rag);
		isMul[arr.length]=true; arr.push(texts.rlu);
		arr.push(texts.pdv);
		arr.push(texts.mdv);
		arr.push(texts.mps);
	}
	
	// custom traits // Game_BattlerBase.TRAITS_CUSTOM
{
	const enums = objs.enums.
		addEnum("AUTOREVIVE").
		addEnum("MUST_SUBST").
		addEnum("ATKTIMES_MUL").
		addEnum("DECDMG_P").
		addEnum("DECDMG_M").
		addEnum("MPSubstitute").
		addEnum("TrgBattleEnd").
		addEnum("__DUMMY") , d = x=>{ if(!x) return;
		const meta=x.meta;
		if(meta.escape){ // has, built-in code
			const n=Number(meta.escape);
			x.traits.push({code:Game_BattlerBase.TRAIT_PARTY_ABILITY,dataId:Game_Party.ABILITY_MUST_ESCAPE,value:isNaN(n)?1:n});
		}
		if(meta.revive){ // has
			x.traits.push({code:Game_BattlerBase.TRAITS_CUSTOM,dataId:enums.AUTOREVIVE,value:meta.revive});
		}
		if(meta.mustSubst){ // has
			//x.traits.push({code:Game_BattlerBase.TRAIT_SPECIAL_FLAG.dataId:Game_BattlerBase.FLAG_ID_SUBSTITUTE,value:1});
			x.traits.push({code:Game_BattlerBase.TRAITS_CUSTOM,dataId:enums.MUST_SUBST,value:meta.mustSubst});
		}
		if(meta.atktimes_mul){ // *
			const n=Number(meta.atktimes_mul);
			if(n) x.traits.push({code:Game_BattlerBase.TRAITS_CUSTOM,dataId:enums.ATKTIMES_MUL,value:n});
		}
		if(meta.trg_btlEnd){ // +
			const n=Number(meta.trg_btlEnd);
			if(n) x.traits.push({code:Game_BattlerBase.TRAITS_CUSTOM,dataId:enums.TrgBattleEnd,value:n});
		}
		if(meta.decDmg){ // +
			const ld=JSON.parse(meta.decDmg);
			for(let i=0;i!==ld.length;++i){
				const n=ld[i][1]; if(isNaN(n)) continue;
				switch(ld[i][0]){
				case 'p': {
					x.traits.push({code:Game_BattlerBase.TRAITS_CUSTOM,dataId:enums.DECDMG_P,value:n});
				}break;
				case 'm': {
					x.traits.push({code:Game_BattlerBase.TRAITS_CUSTOM,dataId:enums.DECDMG_M,value:n});
				}break;
				}
			}
		}
		if(meta.MPSubst){ // 1-*
			let n=meta.MPSubst===true?0:(1-meta.MPSubst||1);
			if(n>1) n=1;
			if(n<0) n=0;
			x.traits.push({code:Game_BattlerBase.TRAITS_CUSTOM,dataId:enums.MPSubstitute,value:n});
		}
	};
	f.doForEach($dataActors  ,d);
	f.doForEach($dataArmors  ,d);
	f.doForEach($dataClasses ,d);
	f.doForEach($dataEnemies ,d);
	f.doForEach($dataStates  ,d);
	f.doForEach($dataWeapons ,d);
}
	
	// switch skills // meta.switch -> effect.isSwitch
	f.doForEach($dataSkills,x=>{ if(!x) return;
		if(!x.meta.switch) return;
		x.name=$dataCustom.header.switchSkill+' '+x.name;
		const s=!!(x.meta.switch);
		for(let i=0,arr=x.effects;i!==arr.length;++i) if(Game_Action.EFFECT_ADD_STATE===arr[i].code) arr[i].isSwitch=s;
	});
	
	// instant skill ( add name header )
	f.doForEach($dataSkills,x=>{ if(!x) return;
		if(!x.meta.inst) return;
		x.name=$dataCustom.header.instantSkill+' '+x.name;
	});
	
	// stomach
	f.doForEach($dataItems,x=>{ if(!x) return;
		const meta=x.meta;
		if(meta.stomach){
			const stp=Number(meta.stomach);
			x.effects.push({code:Game_Action.CUSTOM_EFFECT_GAIN_STP,stomach:stp});
			const dscr=x.description.slice(-12);
			if(dscr.indexOf("\n")===-1) x.description+="\n";
			if(stp) x.description+=(stp<0)?("減少 STP "+-stp):("恢復(增加) STP "+stp);
		}
	});
	
	// items with maxDay limit
	if(!$dataItems.maxDayItems){
		const mdi=$dataItems.maxDayItems=[];
		$dataItems.slice($dataItems.arrangeStart||1).forEach(x=>{
			const maxDay=Number(x.meta.maxDay)+1;
			if(isNaN(maxDay)||!maxDay) return;
			const days=[0];
			for(let day=1;day!==maxDay;++day){
				let tmp=deepcopy(x); tmp.maxDayRef=x.id;
				tmp.name="("+(tmp.day=day)+"天內過期) "+tmp.name;
				tmp.next=days.back;
				const pos=tmp.id=$dataItems.length;
				days.push(pos); mdi.push(pos);
				$dataItems.push(tmp);
			}
			x.days=days;
		});
	}
	
	// drops
	f.doForEach($dataEnemies,x=>{ if(!x) return;
		const meta=x.meta;
		if(meta.drop){
			const drops=JSON.parse(meta.drop); // [{"k":kind,"i":id,"d":denominator,"a":amount}]
			drops.forEach(d=>{
				const drop={kind:d.k,dataId:d.i,denominator:d.d,};
				for(let a=Math.max(d.a===undefined?1:d.a,0);a--;) x.dropItems.push(drop);
			});
		}
	});
	
	// terms backup
	if(!$dataSystem.termsBackuped){
		$dataSystem.termsBackuped=true;
		$dataCustom.apps_ori=$dataCustom.apps;
		$dataSystem.currencyUnit_ori=$dataSystem.currencyUnit;
		$dataSystem.titleBgm_ori=deepcopy($dataSystem.titleBgm);
	}
	
	// sorting order
	{ const arr=$dataCustom.skillOrder.flat(),c2=arr.length.ceilPow2();
	f.doForEach($dataSkills,x=>{ if(!x) return;
		const meta=x.meta;
		if(!meta) return x.ord=-1;
		let ord=0;
		ord<<=1; ord|=!!(meta.passive);
		ord<<=1; ord|=!!(meta.switch);
		if(meta.mpCost!==undefined) x.mpCost=Number(meta.mpCost)|0; // overwite
		x.hpCost   =Number(meta.hpCost   ) | 0;
		x.mpCostMR =Number(meta.mpCostMR ) ||0;
		x.hpCostMR =Number(meta.hpCostMR ) ||0;
		x.mpCostCR =Number(meta.mpCostCR ) ||0;
		x.hpCostCR =Number(meta.hpCostCR ) ||0;
		x.ord=ord*c2;
	});
	arr.forEach((x,i)=>$dataSkills[x]&&($dataSkills[x].ord|=i)); }
	f.doForEach($dataItems,x=>{ if(!x) return;
		const meta=x.meta;
		if(!meta) return x.ord=-1;
		let ord=0;
		ord<<=1; ord|=!meta.imitate;
		ord<<=2; ord|=((!meta.hp)<<1)|!meta.mp;
		ord<<=1; ord|=!meta.food;
		ord<<=1; ord|=!meta.switch;
		ord<<=1; ord|=!meta.enhance;
		ord<<=1; ord|=!meta.treasure;
		ord<<=1; ord|=!meta.licence;
		ord<<=1; ord|=!meta.func;
		ord<<=1; ord|=!meta.quest;
		x.ord=ord;
	});
	{ const wtypeLen=$dataSystem.weaponTypes.length.ceilPow2();
	f.doForEach($dataWeapons,x=>{ if(!x) return;
		const meta=x.meta;
		if(!meta) return x.ord=-1;
		let ord=0;
		ord*=wtypeLen; ord|=x.wtypeId;
		x.ord=ord;
	}); }
	{ const etypeLen=$dataSystem.equipTypes.length.ceilPow2() , atypeLen=$dataSystem.armorTypes.length.ceilPow2();
	f.doForEach($dataArmors,x=>{ if(!x) return;
		const meta=x.meta;
		if(!meta) return x.ord=-1;
		let ord=0;
		ord*=etypeLen; ord|=x.etypeId;
		ord<<=1; ord|=!!meta.dupNoEff;
		ord*=atypeLen; ord|=x.atypeId;
		x.ord=ord;
	}); }
	
	// arrange classes.learnings
	f.doForEach($dataClasses,x=>{ if(!x) return;
		const arr=x.learnings,r=new Map();
		arr.sort((a,b)=>a.level-b.level||$dataSkills[a.skillId].ord-$dataSkills[b.skillId].ord).forEach(z=>{ let tmp=r.get(z.level); if(!tmp) r.set(z.level,tmp=[]); tmp.push(z); });
		arr.byLv=r;
	});
	
	// arrange animations.timing
	f.doForEach($dataAnimations,x=>{ if(!x) return;
		const ts=x.timings; if(!ts) return;
		const m=ts.byFrmIdx=new Map();
		ts.forEach(t=>{
			const tmp=m.get(t.frame);
			if(tmp) tmp.push(t);
			else m.set(t.frame,[t]);
		});
	});
	
	// make traits map
	f.doForEach($dataActors,f.makeTraitsMap);
	f.doForEach($dataArmors,f.makeTraitsMap);
	f.doForEach($dataClasses,f.makeTraitsMap);
	f.doForEach($dataEnemies,f.makeTraitsMap);
	f.doForEach($dataSkills,f.makeTraitsMap);
	f.doForEach($dataStates,f.makeTraitsMap);
	f.doForEach($dataWeapons,f.makeTraitsMap);
	
	// make def, spaceout much faster
	if(!$dataSkills.speedUp){
		$dataSkills.speedUp=true;
		$dataSkills[3].speed=$dataSkills[2].speed<<=10;
	}
	
	// link tmap of passiveSkill to ** states **
	f.doForEach($dataSkills,x=>{ if(!x) return;
		const id=x.meta.passive;
		if(!id) return;
		x.tmapS=$dataStates[id].tmapS;
		x.tmapP=$dataStates[id].tmapP;
	});
	
	// maxItem
	f.doForEach($dataArmors,f.makeMaxStack);
	f.doForEach($dataItems,f.makeMaxStack);
	f.doForEach($dataStates,f.makeMaxStack); // TODO
	f.doForEach($dataWeapons,f.makeMaxStack);
	
	// unionCnt
	f.doForEach($dataArmors,f.makeUnionCnt);
	f.doForEach($dataItems,f.makeUnionCnt);
	//f.doForEach($dataStates,f.makeUnionCnt); // TODO
	f.doForEach($dataWeapons,f.makeUnionCnt);
	
	// forAllFriends
	f.doForEach($dataItems,f.makeForAllFriends);
	f.doForEach($dataSkills,f.makeForAllFriends);
	
	// forBattler:[alive|dead|all]
	f.doForEach($dataItems,f.makeForAllBattler);
	f.doForEach($dataSkills,f.makeForAllBattler);
	
	// extend description
	f.doForEach($dataItems,f.extendDescription);
	f.doForEach($dataSkills,f.extendDescription);
	
	// extend repeats
	f.doForEach($dataItems,f.extendRepeats);
	f.doForEach($dataSkills,f.extendRepeats);
	
	// **** recursive def (_*) ****
	f.doForEach($dataSkills,x=>{ if(!x) return;
		x._arr=$dataSkills;
		x.itemType='s';
	});
	f.doForEach($dataItems,x=>{ if(!x) return;
		x._arr=$dataItems;
		x.itemType='i';
	});
	f.doForEach($dataWeapons,x=>{ if(!x) return;
		x._arr=$dataWeapons;
		x.itemType='w';
	});
	f.doForEach($dataArmors,x=>{ if(!x) return;
		x._arr=$dataArmors;
		x.itemType='a';
	});
	
	[$dataActors,$dataArmors,$dataClasses,$dataEnemies,$dataItems,$dataSkills,$dataStates,$dataTroops,$dataWeapons,].forEach(x=>{ if(!x) return; // ????
		x.arrangeStart=x.length;
		//if(!x.tmapS) x.tmapS=new Map(); // ???
		//if(!x.tmapP) x.tmapP=new Map(); // ???
	});
};
$dddd$.doForEach=(c,f)=>c.slice(c.arrangeStart||1).forEach(f);
$dddd$.extendDescription=dataobj=>{
	const ie=$dataCustom.itemEffect;
	let ext='';
	['tpGain',].forEach(k=>{ if(k && k[0]!=="_" && dataobj[k]){
		ext+='['+ie[k].replace(ie._placeholder,dataobj[k])+']';
	} });
	if(ext){
		let tmp=dataobj.description.match(/\n/g); tmp=tmp&&tmp.length;
		while(++tmp<3) dataobj.description+='\n';
		dataobj.description+=ext;
	}
};
$dddd$.extendRepeats=dataobj=>{
	const n=Number(dataobj.meta.repeat_mul);
	if(!isNaN(n)) dataobj.repeats *= n;
};
{ const tbl={
	alive:Game_Action.TARGET_ENUM_forAliveBattler,
	dead:Game_Action.TARGET_ENUM_forDeadBattler,
	all:Game_Action.TARGET_ENUM_forAllBattler,
}; $dddd$.makeForAllBattler=dataobj=>{
	const n=tbl[dataobj.meta.forBattler];
	if(n) dataobj.scope=n;
}; }
$dddd$.makeForAllFriends=dataobj=>dataobj.meta.forAllFriends&&(dataobj.scope=Game_Action.TARGET_ENUM_forAllFriends);
$dddd$.makeMaxStack=dataobj=>{
	const m=Number(dataobj.meta.maxStack);
	dataobj.maxStack=m>=0?m:undefined;
};
$dddd$.makeTraitsMap=dataobj=>{
	const tarr=dataobj.traits;
	if(!tarr) return;
	const tmapS=dataobj.tmapS=new Map();
	const tmapP=dataobj.tmapP=new Map();
	let tmp;
	// same type(code) most likely calculated in the same
	for(let x=0;x!==tarr.length;++x){
		const code=tarr[x].code , id=tarr[x].dataId , val=tarr[x].value;
		tmp=tmapS.get(code);
		if(tmp===undefined){
			const m=new Map();
			m.set(id,tmapS.v=val);
			tmapS.set(code,m);
		}else{
			const v=tmp.get(id);
			if(v===undefined) tmp.set(id,val);
			else tmp.set(id,val+v);
			tmapS.v+=val;
		}
		tmp=tmapP.get(code);
		if(tmp===undefined){
			const m=new Map();
			m.set(id,tmapP.v=val);
			tmapP.set(code,m);
		}else{
			const v=tmp.get(id);
			if(v===undefined) tmp.set(id,val);
			else tmp.set(id,val*v);
			tmapP.v*=val;
		}
	}
	if(dataobj.params){
		// arrange equip performance
		dataobj.params.push(1e6); // base pad
		if(tmp=dataobj.ord) dataobj.params.push(-tmp*1e3);
		if(tmp=tmapS.get(Game_BattlerBase.TRAIT_ACTION_PLUS)) dataobj.params.push(tmp.v*1e6); // +act times
	}
};
$dddd$.makeUnionCnt=dataobj=>{
	const u=dataobj.meta.unionCnt;
	if(u) dataobj.unionCnt=JSON.parse(u);
};
$rrrr$=$pppp$.start;
$dddd$=$pppp$.start=function f(){ // this only exec. once
	this.arrangeData();
	DataManager._itemArrs={s:$dataSkills,i:$dataItems,w:$dataWeapons,a:$dataArmors,};
	f.ori.call(this);
}; $dddd$.ori=$rrrr$;

// - Game_BattlerBase
$aaaa$=Game_BattlerBase;
$pppp$=$aaaa$.prototype;
$aaaa$.currMaxEnum=70;
$aaaa$.addEnum=objs._addEnum;
$aaaa$.addEnum('CACHEKEY_LASTPAY')
	.addEnum('CACHEKEY_EQUIP')
	.addEnum('CACHEKEY_SKILL')
	.addEnum('CACHEKEY_STATE')
	.addEnum('CACHEKEY_NATIVE')
	.addEnum('CACHEKEY_OVERALL_S')
	.addEnum('CACHEKEY_OVERALL_M')
	.addEnum('__DUMMY');
$pppp$.paramRate = function(paramId) {
	return this.getTraits_overall_m(Game_BattlerBase.TRAIT_PARAM, paramId);
};
$pppp$.stateResistSet = function() {
	return this.getTraits_overall_s(Game_BattlerBase.TRAIT_STATE_RESIST);
};
$pppp$.addedSkillTypes = function() {
	const rtv=[];
	this.getTraits_overall_s(Game_BattlerBase.TRAIT_STYPE_ADD).forEach((v,k)=>rtv.push(k));
	return rtv;
};
$pppp$.addedSkillTypes_arranged=function(omits){
	const h=new Heap(undefined,this.addedSkillTypes(),true),s=new Set(omits);
	const rtv=[];
	while(h.length){
		let curr=h.top; h.pop();
		if(s.has(curr)) continue;
		s.add(curr);
		rtv.push(curr);
	}
	return rtv.reverse();
};
// Game_BattlerBase.prototype.addedSkills=function(){ return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD); }; // not used
$pppp$.slotType=function(){
	return this.traitsMaxId(Game_BattlerBase.TRAIT_SLOT_TYPE);
};
$pppp$.actionPlusSet=function() {
	return this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
};
$pppp$.specialFlag=function(flagId) {
	return this.getTraits_overall_s(Game_BattlerBase.TRAIT_SPECIAL_FLAG).has(flagId);
};
$pppp$.collapseType=function(){
	return this.traitsMaxId(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
};
$pppp$.partyAbility=function(abilityId){
	return this.getTraits_overall_s(Game_BattlerBase.TRAIT_PARTY_ABILITY).has(abilityId);
};
// custom traits id
{ const enums=objs.enums.
	addEnum("AUTOREVIVE").
	addEnum("MUST_SUBST").
	addEnum("ATKTIMES_MUL").
	addEnum("DECDMG_P").
	addEnum("DECDMG_M").
	addEnum("MPSubstitute").
	addEnum("TrgBattleEnd").
	addEnum("__DUMMY") , gbb=Game_BattlerBase.addEnum("TRAITS_CUSTOM");
$pppp$.isAbleToAutoRevive=function(){
	return this.traitsSet(gbb.TRAITS_CUSTOM).contains(enums.AUTOREVIVE);
};
$pppp$.isAlwaysSubstitute=function(){
	return this.traitsSet(gbb.TRAITS_CUSTOM).contains(enums.MUST_SUBST) && this.canMove();
};
$pppp$.attackTimesMul=function(){
	return this.traitsPi(gbb.TRAITS_CUSTOM,enums.ATKTIMES_MUL);
};
$pppp$.decreaseDamageP=function(){
	return this.traitsSum(gbb.TRAITS_CUSTOM,enums.DECDMG_P);
};
$pppp$.decreaseDamageM=function(){
	return this.traitsSum(gbb.TRAITS_CUSTOM,enums.DECDMG_M);
};
$pppp$.MPSubstituteRate=function(){
	let rtv=1-this.traitsPi(gbb.TRAITS_CUSTOM,enums.MPSubstitute)||0;
	// though they're checked @ data source
	if(rtv>1) rtv=1;
	if(rtv<0) rtv=0;
	return rtv;
};
$pppp$.TPRegenAtBattleEnd=function(){
	return this.traitsSum(gbb.TRAITS_CUSTOM,enums.TrgBattleEnd);
};
}

$rrrr$=$dddd$=$pppp$=$aaaa$=undef;
// --- --- BEG debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---



$rrrr$=$dddd$=$pppp$=$aaaa$=undef;
// --- --- END debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

if(objs.isDev) console.log("obj_t1-traits");
