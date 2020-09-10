"use strict";
(()=>{ let list=rpgskills.list;

list.devtools=(action)=>{
	$gameParty.gainGold(1e11);
	[
		55,58,
		64,66,68,
		70,74,75,
		76,77,
		79,
		80,84,85,
	].forEach(i=>{
		let pt=$gameParty;
		if(pt._items[i]) return;
		pt.gainItem($dataItems[i],1);
	});
};

})();
