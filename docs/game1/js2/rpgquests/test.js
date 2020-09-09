"use strict";
(()=>{ let list={},func=rpgquests.func,items=$dataItems;

// Window_CustomTextBoard
let color=deepcopy($dataCustom.textcolor);
	for(let i in color) color[i]="_["+color[i]+"]";
	color.default="_[#FFFFFF]";

let tmp;

list.test1={
	title:"測1",
	rank:1,
	txt:[
		{txt:"?在浮游城中央下方有座噴水池，噴水池上方有光圈。"},"\n",
		{txt:"從這個光圈前往小樹林，把枯樹都燒光"},"\n\n",
		{txt:"畢竟都枯萎了，就幫忙處理掉吧！"},
	],
	info:{
		type:"evaltrue",
		codes:[
			["$gameSelfSwitches.value([40,7,'D'])","把小樹林的枯樹燒光"],
			["1"],
			["1","OAO"],
		]
	},
	__dummy:null
};

list.test2={
	title:"測2",
	rank:6,
	txt:[
		{txt:"在浮游城中央下方有座噴水池，噴水池上方有光圈。"},"\n",
		{txt:"從這個光圈前往"+color.keyword+"林圍"+color.default+"，每棵樹第1次被燒時可以獲得"+color.keyword+items[34].name},
		"\n\n",{txt:"覺得獲得物品的訊息太惱人的話，可以在"+color.keyword+"選單"+color.default+"->"+color.keyword+"其他設定"+color.default+"把"+color.keyword+$dataCustom.noGainMsg+color.default+"設定為"+color.keyword+"ON"},
	],
	info:{
		type:"collectItems",
		items:[
			{id:34,amount:56},
		]
	},
	reward:{
		items:[{id:2,amount:5}],
		armors:[{id:17,amount:5}],
		weapons:[{id:17,amount:5}],
		exp:{type:"all",val:0},
		gold:100,
		codes:[["1","OAO"],["1"]] // [[code,msgTxt],[],...]
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

// clear __dummy
for(let i in list) delete list[i].__dummy;
for(let i in list) rpgquests.list[i]=list[i];
})();
