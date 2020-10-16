"use strict";
(()=>{ let list={},func=rpgquests.func,items=$dataItems,$qqqq$;

// Window_CustomTextBoard
let color=deepcopy($dataCustom.textcolor);
	for(let i in color) color[i]="_["+color[i]+"]";
	color.default="_[#FFFFFF]";

let tmp;

$qqqq$=list.core_notifymeeting={
	title:"告知要開會了",
	limit:1,
	txt:[
		{txt:"通知在村外遊蕩的村民們要開會了"},"\n\n",
		{txt:"你必須\\key'\"完成\"'此任務我才會知道",sizeRate:0.75},
	],
	info:{
		type:"evaltrue",
		codes:[
			["$gameParty.mapChanges[74]&&$gameParty.mapChanges[74].vars.meetingnotified===5","通知所有在"+color.keyword+"林地"+color.default+"的村民"],
		]
	},
	reward:{
		gold:1000
	},
	__dummy:null
};
$qqqq$.info.codes[0].push(()=>{
	let mch=$gameParty.mapChanges[74],cnt=mch&&mch.vars.meetingnotified;
	return "已告知 : "+(cnt^0)+" / "+5;
});

$qqqq$=list.core_collectwoods={
	title:"蒐集大木材",
	limit:1,
	txt:[
		{txt:"在道具欄中使用\\item[79]後對著樹按確認鍵可以將樹砍倒。並可獲得依樹種，數量不等的\\item[61]。"},
		"\n",{txt:"生火用需100個；製作物品用需200個；修補房屋用需100個"},
		"\n",{txt:"與村民一同蒐集\\item[61]400個"},
		"\n",{txt:"附註：請留下至少1棵樹，以利未來可以持續利用森林",sizeRate:0.75},
		"\n\n",{txt:"蒐集後，或完成任務後，回到\\key'\"管理之家\"'找我對話就行了"},
	],
	info:{
		type:"evaltrue",
		codes:[
			["(($gameParty.mapChanges[74]&&$gameParty.mapChanges[74].vars.woods&&$gameParty.mapChanges[74].vars.woods)^0)+$gameParty._items[61]>=400","與村民一同蒐集"+color.item+"大木材"+color.default+"共400個"],
		]
	},
	reward:{
		codes:[
			["$gameParty.gainGold(($gameParty._items[61]^0)*100)","依照個人交回的大木材數量給予該數量*100G"]
		]
	},
	__dummy:null
};
$qqqq$.info.codes[0].push(()=>{
	let mch=$gameParty.mapChanges[74],cnt=mch&&mch.vars.woods;
	return "已蒐集 : "+((cnt^0)+($gameParty._items[61]^0))+" / "+400;
});
$qqqq$.reward.codes[0].push(()=>{
	let mch=$gameParty.mapChanges[74],cnt=mch&&mch.vars.woods;
	return "目前可得 : "+(($gameParty._items[61]^0)*100)+"G";
});


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
