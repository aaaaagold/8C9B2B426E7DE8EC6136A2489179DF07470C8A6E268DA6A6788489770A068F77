"use strict";
(()=>{ let list=rpgskills.list;

list.devtools=(action)=>{
	$gameParty.gainGold(1e11);
	$gameParty.gainItem($dataItems[55],1);
	$gameParty.gainItem($dataItems[58],1);
	$gameParty.gainItem($dataItems[64],1);
	$gameParty.gainItem($dataItems[66],1);
	$gameParty.gainItem($dataItems[68],1);
	$gameParty.gainItem($dataItems[70],1);
	$gameParty.gainItem($dataItems[74],1);
	$gameParty.gainItem($dataItems[75],1);
	$gameParty.gainItem($dataItems[77],1);
	$gameParty.gainItem($dataItems[79],1);
	$gameParty.gainItem($dataItems[80],1);
	$gameParty.gainItem($dataItems[84],1);
};

})();
