"use strict";
(()=>{ let list=rpgskills.list;

list.devtools=(action)=>{
	const pt=$gameParty;
	pt.gainGold(1e11);
	[
		64,65,66,67,68,
		103,102,96,106,
		111,112,129,
		191,
	].forEach(i=>{
		if(pt._items[i]) return;
		pt.gainItem($dataItems[i],1e4);
	});
	[
		22,50,
		5,7,
		6,16,
		27,
		26,32,
		20,28,29,30,
	].forEach(i=>{
		if(pt._armors[i]) return;
		pt.gainItem($dataArmors[i],1e2);
	});
};

})();
