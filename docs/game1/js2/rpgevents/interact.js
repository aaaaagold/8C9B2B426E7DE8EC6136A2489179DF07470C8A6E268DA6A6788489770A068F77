"use strict";
// used for interacts between two or more events
// form: foo.call(Game_Event,kargs);
(()=>{ // strt
let list=rpgevts.interact;

list.core_cutWoods=function(kargs){ // thisFunction.call(some_evt,kargs);
	let xy=this.frontPos();
	let tevt=$gameMap.eventsXy(xy.x,xy.y).getnth(0),vars=$gameParty.mch().vars;
	if(tevt && tevt.event().meta.burnable && 1<vars.tree){
		tevt=tevt.parent();
		let wood=tevt.event().meta.wood;
		if(wood){
			if(wood=parseInt(wood)){ // parseInt(true)===NaN
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
