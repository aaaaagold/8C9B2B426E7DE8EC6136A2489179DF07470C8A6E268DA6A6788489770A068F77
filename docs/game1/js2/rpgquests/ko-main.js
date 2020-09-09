"use strict";
(()=>{ let list={},func=rpgquests.func,items=$dataItems,$qqqq$;

// Window_CustomTextBoard
let color=deepcopy($dataCustom.textcolor);
	for(let i in color) color[i]="_["+color[i]+"]";
	color.default="_[#FFFFFF]";

let tmp;

$qqqq$=list.ko_startTraining={
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

$qqqq$=list.ko_helping={
	title:"幫助城裡的人",
	limit:1,
	txt:[
		{txt:"幫助城裡的人解決各種疑難雜症"},
		"\n",{sizeRate:0.75,txt:"如果都完成了，就回到\\key'\"助人為樂企業\"'，並使用app完成任務後，告知左邊櫃台小姐吧"},
		// "\n",{sizeRate:0.75,txt:"順便幫作者解決這個遊戲接下來要怎麼發展的問題(選單內\\key'\"其他設定\"'有回饋單)"},
	],
	info:{
		type:"evaltrue",
		codes:[
			["$gameSwitches.value(59)","完成\\key'\"廁所\"'的疑難雜症"],
			["$gameSwitches.value(54)","完成\\key'\"小公園\"'的疑難雜症"],
			["$gameSwitches.value(55)","完成\\key'\"練舞室\"'的疑難雜症"],
			["$gameSwitches.value(56)","完成\\key'\"小貓屋\"'的疑難雜症"],
			["$gameSwitches.value(57)","完成\\key'\"便利商店\"'的疑難雜症"],
			["$gameSwitches.value(60)","完成\\key'\"實驗室\"'的疑難雜症"],
			["$gameSwitches.value(61)","完成\\key'\"餐廳\"'的疑難雜症"],
			["$gameSwitches.value(58)","完成\\key'\"工地旁的家\"'的疑難雜症"],
		]
	},
	reward:{
		//armors:[{id:6,amount:1}],
		//weapons:[{id:17,amount:5}],
		//exp:{type:"all",val:0},
		gold:10000,
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
