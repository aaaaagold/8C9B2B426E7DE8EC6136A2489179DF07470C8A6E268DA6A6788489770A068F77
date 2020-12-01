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

list.discardLastNChoices=n=>{
	if(n===undefined) n=1;
	return function(olist,c,rtv){
		let next1=deepcopy(olist[c]);
		next1.parameters[0].length-=n;
		rtv.push(next1);
		return 1;
	};
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

list.getSS=(self,argv)=>{
	if(!argv) return false;
	return $gameMap.ss(argv[0],argv[1]);
};
list.setSS=(self,argv)=>{
	if(!argv) return false;
	return $gameMap._events[argv[0]].ssStateSet(argv[1],!argv[2]);
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

})();
