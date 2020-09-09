"use strict";
// etc.
// form: any
(()=>{ // strt
let list=rpgevts.achievement;

list.ygr=(self,argv)=>{ const varId=14; // a20
	const ygr=argv[0]; // y,g,r=0,1,2
	const pairId=argv[1]-1; // start from 1
	const pairCount=argv[2]; // max pairCount = 10
	const achievementId=argv[3]||20; // max pairCount = 10
	if($gameParty._achievement[achievementId]) return;
	$gameVariables._data[varId]|=0;
	$gameVariables._data[varId]|=1<<(pairCount*ygr+pairId);
	if($gameVariables._data[varId]===(1<<(pairCount*3))-1) $gameParty.gainAchievement(achievementId);
};

list.ninty_kV=(self,argv)=>{ // a21
	const evtid=argv[0];
	const achievementId=21;
	if($gameParty._achievement[achievementId]) return;
	const tevt=$gameMap._events[evtid];
	if(tevt && tevt.dist1(self)<=2) $gameParty.gainAchievement(achievementId);
};


})();
