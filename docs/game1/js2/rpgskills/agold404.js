"use strict";

if(!window.objs) window.objs={};

(()=>{ let list=objs.rpgskills.list;

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
		5,7,66,67,68,69,
		6,16,
		27,
		26,32,
		20,28,29,30,
		56,57,58,59,60,
		61,
		62,63,
		64,
		70,71,72,73,74,75,76,
		78,79,80,81,82,83,
		84,85,86,87,88,89,
		90,91,92,
		94,95,96,97,
		98,99,
		101,102,103,104,
		106,107,
		125,126,
		127,
	].concat((()=>{
		let arr=[];
		for(let x=101;x!==128;++x) arr.push(x);
		return arr;
	})()).forEach(i=>{
		if(pt._armors[i]) return;
		pt.gainItem($dataArmors[i],1e2);
	});
};

})();
