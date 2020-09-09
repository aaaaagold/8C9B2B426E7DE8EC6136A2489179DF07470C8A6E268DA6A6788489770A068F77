"use strict";
(()=>{ let list={},func=rpgquests.func,items=$dataItems,$qqqq$;

// Window_CustomTextBoard
let color=deepcopy($dataCustom.textcolor);
	for(let i in color) color[i]="_["+color[i]+"]";
	color.default="_[#FFFFFF]";

let tmp;

$qqqq$=list.more_startTraining={
	title:"封鎖組的訓練資料",
	limit:1,
	txt:[
		{txt:"透過電梯前往訓練房訓練吧"},
	],
	info:{
		type:"evaltrue",
		codes:[
			["$gameVariables.value(22)>=1","完成訓練 1"],
			["$gameVariables.value(22)>=2","完成訓練 2"],
			["$gameVariables.value(22)>=3","完成訓練 3"],
		]
	},
	reward:{
		items:[{id:64,amount:1},{id:65,amount:1},{id:66,amount:1},{id:67,amount:1},{id:68,amount:1},],
		//armors:[{id:6,amount:1}],
		//weapons:[{id:17,amount:5}],
		exp:{type:"all",val:0},
		gold:1000,
		codes:[] // [[code,msgTxt],[],...]
	},
	__dummy:null
};







// set default color
for(let i in list){
	for(let x=0;x!==list[i].txt.length;++x) if(list[i].txt[x].constructor!==String) list[i].txt[x].color=list[i].txt[x].color||color.default;
	list[i].titlecolor=list[i].titlecolor||color.default;
	list[i].__dummy=color;
}

// Object.defineProperties
for(let i in list) func.addStateObj(list[i]);
for(let i in list) func.addRewardObj(list[i]);
for(let x=0,arr=$dataItems;x!==arr.length;++x){ let item=arr[x];
	let tmp=item && item.meta.quest && list[item.meta.ref];
	if(!tmp) continue;
	func.addLimitObj(tmp,item);
}

// clear __dummy
for(let i in list) delete list[i].__dummy;
for(let i in list) rpgquests.list[i]=list[i];
})();
