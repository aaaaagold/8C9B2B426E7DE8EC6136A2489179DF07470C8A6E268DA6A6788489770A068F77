"use strict";

(()=>{ // strt
let list=rpgevts.shop;

list.core_strt=()=>{
	$dataItems.filter((x,i)=>i>=88&&i<91).forEach(x=>{
		x.price_bak=x.price;
		x.price>>=1;
	});
	if($gameSwitches._data[9] && $gameMap.parents().indexOf($gameParty.format)!==-1){ for(let x=13;x!==17;++x){
		let item=$dataItems[x];
		$dataItems[x].price_bak=$dataItems[x].price;
		$dataItems[x].price=0;
	}}
};
list.core_ende=()=>{
	$dataItems.filter((x,i)=>i>=88&&i<91).forEach(x=>{
		x.price=x.price_bak;
	});
	if($gameSwitches._data[9] && $gameMap.parents().indexOf($gameParty.format)!==-1){ for(let x=13;x!==17;++x){
		let item=$dataItems[x];
		$dataItems[x].price=$dataItems[x].price_bak;
	}}
};

list.vendMach_strt=()=>{
	$dataItems.filter((x,i)=>i>=6&&i<17).forEach(x=>{
		x.price_bak=x.price;
		x.price+=5;
	});
};
list.vendMach_ende=()=>{
	$dataItems.filter((x,i)=>i>=6&&i<17).forEach(x=>{
		x.price=x.price_bak;
	});
};

})();
