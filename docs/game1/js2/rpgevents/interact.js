"use strict";
// used for interacts between two or more events
// form: foo.call(Game_Event,kargs);
(()=>{ // strt
let list=rpgevts.interact;

list.core_cutWoods=function(kargs){ // thisFunction.call(some_evt,kargs);
	let xy=this.frontPos();
	let tevt=$gameMap.eventsXy(xy.x,xy.y).getnth(0);
	if(tevt && tevt.event().meta.burnable){
		tevt=tevt.parent();
		let wood=tevt.event().meta.wood;
		if(wood){
			let vars=$gameParty.mapChanges[74].vars;
			if(wood=parseInt(wood)){
				vars.woods^=0;
				vars.woods+=wood^=0;
				$gameMessage.popup("村民取得 \\item[61] * "+wood,1);
			}
			tevt.requestAnimation(6);
			tevt.erase();
		}
	}
};

})();
