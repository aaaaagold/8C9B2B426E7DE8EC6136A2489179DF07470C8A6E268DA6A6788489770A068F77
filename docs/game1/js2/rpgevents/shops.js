"use strict";
// used for edit a shop
// call '*_strt' before open a shopCommand
// call *_ende after the shopCommand
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

list.rf_foodInc=()=>~~(($dataSystem.borrowDays<<1)/3);
list.rf_teasureDec=()=>list.rf_foodInc()>>1;
list.rf_strt=()=>{
	const day=$gameVariables.value(30);
	const foodInc=list.rf_foodInc();
	const teasureDec=foodInc>>1;
	// food
	if(day>=foodInc){
		const s=day-foodInc+1;
		$dataItems.filter(x=>x&&x.meta.food).forEach(x=>{
			if(x.price_bak===undefined) x.price_bak=x.price;
			x.price=x.price_bak<<s;
		});
	}
	// treasure
	if(teasureDec<day){
		const r=Math.max(100-(day-teasureDec)*5,0);
		for(let i=124;i<=128;++i){ const x=$dataItems[i];
			if(x.price_bak===undefined) x.price_bak=x.price;
			x.price=~~(x.price_bak*r/100);
			if(x.price===0 && x.price_bak!==0) x.price=1;
		}
		for(let i=167;i<=169;++i){ const x=$dataItems[i];
			if(x.price_bak===undefined) x.price_bak=x.price;
			x.price=~~(x.price_bak*r/100);
			if(x.price===0 && x.price_bak!==0) x.price=1;
		}
	}
};
list.rf_ende_forEach=x=>{ if(x.price_bak!==undefined) x.price=x.price_bak; };
list.rf_ende=()=>{
	// food
	$dataItems.filter(x=>x&&x.meta.food).forEach(list.rf_ende_forEach);
	// treasure
	for(let i=124;i<=128;++i){ const x=$dataItems[i];
		if(x.price_bak!==undefined) x.price=x.price_bak;
	}
	for(let i=167;i<=169;++i){ const x=$dataItems[i];
		if(x.price_bak!==undefined) x.price=x.price_bak;
	}
};

})();
