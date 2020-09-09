"use strict";
// used for <init> events which are auto run when player enters the map
// form: :! ["func","auto", ... ]
(()=>{ // strt
let list=rpgevts.auto;

// zone1
list.zone1_auto1=()=>{
	let sx=1,sy=5,candi=[];
	for(let y=sy,xe=30,ye=30,w=$gameMap.width(),h=$gameMap.height();y!==ye;++y)
		for(let x=sx;x!==xe;++x)
			if($gameMap.eventsXy(x,y).length===0)
				candi.push([x,y]);
	for(let x=1111;x--;){
		let idx1=~~(Math.random()*candi.length);
		let idx2=~~(Math.random()*candi.length);
		let tmp=candi[idx1]; candi[idx1]=candi[idx2]; candi[idx2]=tmp;
	}
	let n=113,vars=$gameParty.mch().vars;
	if(candi.length<n) n=candi.length;
	else candi.length=n;
	vars.tree=0; for(let x=0;x!==n;++x) vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,candi[x][0],candi[x][1],1,1,0,["C"]);
};
list.zone1_auto2=()=>{
	let vars=$gameParty.mch().vars;
	vars.tree=0;
	
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+22, 9, 5, 1,3,0,["B"])>>2;
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+20,11, 5, 2,3,0,["B"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,13, 5,19,3,0,["B"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19, 8, 9,24,3,0,["B"]);
	
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,42, 5,22,1,0,["B"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,33, 7,31,1,0,["C"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,40, 9,15,1,0,["B"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,33,11,29,1,0,["C"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+22,62,11, 1,1,0,["B"])>>2;
	
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,65, 5,29,2,0,["B"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,65, 8,28,2,0,["C"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+22,65,11, 1,1,0,["B"])>>2;
	
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,95, 5,25,1,0,["B"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,95, 7,24,2,0,["B"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,95,10,24,2,0,["B"]);
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,119,11,2,1,0,["B"]);
};
list.zone1_auto3=()=>{
	let vars=$gameParty.mch().vars;
	vars.tree=0;
	vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,1,3,13,7,0,["B"]);
		vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,14,3,1,3,0,["B"]);
		vars.tree+=$gameMap.cpevt($dataMap.templateStrt+19,14,7,1,3,0,["B"]);
};

})();
