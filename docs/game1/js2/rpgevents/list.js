"use strict";
// etc.
// form: any
(()=>{ // strt
let list=rpgevts.list;

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

})();
