"use strict";
(()=>{ let list={},func=rpgquests.func,items=$dataItems,$qqqq$;

// Window_CustomTextBoard
let color=deepcopy($dataCustom.textcolor);
	for(let i in color) color[i]="_["+color[i]+"]";
	color.default="_[#FFFFFF]";

const noGainMsg="覺得獲得物品的訊息太惱人的話，可以在\\key'\"選單\"'->\\key'\"其他設定\"'->\\key'\""+$dataCustom.opts_gainHint+"\"'把\\key'$dataCustom.noGainMsg'設定為\\key'\"ON\"'";

let tmp;

list.theeasiest={
	title:"最簡單單的任務",
	rank:1,
	limit:1,
	txt:[
		{txt:"在浮游城中央下方有座噴水池，噴水池上方有光圈。"},"\n",
		{txt:"從這個光圈前往小樹林，把枯樹都燒光"},"\n\n",
		{txt:"畢竟都枯萎了，就幫忙處理掉吧！"},
	],
	info:{
		type:"evaltrue",
		codes:[
			["$gameParty._completedQuests && $gameParty._completedQuests[33] || $gameSelfSwitches.value([40,7,'D'])","把小樹林的枯樹燒光"],
		]
	},
	reward:{
		items:[{id:6,amount:6}],
		armors:[{id:6,amount:1}],
		//weapons:[{id:17,amount:5}],
		exp:{type:"all",val:0},
		gold:19,
		codes:[] // [[code,msgTxt],[],...]
	},
	__dummy:null
};
list.easy_collectLeaves={
	title:"蒐集有點燒焦的樹葉",
	rank:4,
	txt:[
		{txt:"在浮游城中央下方有座噴水池，噴水池上方有光圈。"},"\n",
		{txt:"從這個光圈前往\\key'\"林圍\"'，每棵樹第1次被燒時可以獲得\\item[34]"},
		"\n\n",{txt:noGainMsg},
	],
	info:{
		type:"collectItems",
		items:[
			{id:34,amount:40},
		]
	},
	reward:{
		items:[{id:6,amount:4}],
		gold:89,
		codes:[]
	},
};
list.easy_leavesWater={
	title:"蒐集葉子與水",
	rank:3,
	txt:[
		{txt:"在浮游城中央下方有座噴水池，噴水池上方有光圈。從這個光圈前往\\key'\"步亂\"'。"},"\n\n",
		{txt:"每棵樹第1次被燒時可以獲得\\item[37]；第3次時可以獲得\\item[36]"},"\n",
		{txt:"兩者加在一起再加熱好像不錯喝"},"\n",
		{txt:"各蒐集25個再來"},
		"\n\n",{txt:noGainMsg},
	],
	info:{
		type:"collectItems",
		items:[
			{id:36,amount:25},
			{id:37,amount:25},
		]
	},
	reward:{
		gold:230,
		codes:[]
	},
};
list.easy_tangerine={
	title:"好想吃橘子",
	rank:2,
	txt:[
		{txt:"不管哪裡的冰鎮橘子都好，可以蒐集50個給我嗎？"},
		"\n\n",{txt:noGainMsg},
	],
	info:{
		type:"collectItems",
		items:[
			{id:39,amount:50},
		]
	},
	reward:{
		items:[{id:6,amount:10}],
		exp:{type:"all",val:0},
		gold:230,
		codes:[] // [[code,msgTxt],[],...]
	},
};

$qqqq$=list.normal_finalTest={
	title:"中級焚木工能力測驗",
	limit:1,
	txt:[
		{txt:"完成特定條件。詳見下一欄位。"},
		"\n",{txt:"  p.s. 中級任務可以從\\key'\"新手訓練的大叔\"'旁的任務堆拿",sizeRate:0.75},
		"\n",{txt:"  p.s.2 \\key'\"木亥村莊\"'可由中央噴水池前的傳送點，選擇\\key'\"通道\"'抵達\\key'\"綠意窪地\"'後，往地圖最下方一直走，途中會遇到迷宮，通過迷宮走出窪地，往正前方看就是木亥村莊了。\n想辦法到村莊入口吧。",sizeRate:0.75},
		"\n\n",{txt:"完成任務後可以找NPC升級焚木工證",sizeRate:1},
	],
	info:{
		type:"evaltrue",
		codes:[]
	},
	reward:{
		items:[{id:67,amount:1}],
		codes:[] // [[code,msgTxt],[],...]
	},
};
(()=>{ let tmp={},reqCnt=15;
tmp[0]="$gameParty.completedQuestsCnt(rpgquests.handleRank.easy[0],rpgquests.handleRank.normal[1])>="+reqCnt;
Object.defineProperties(tmp,{ 1: { get:(()=>{
	let rtv="初級任務完成數+中級任務完成數 達"+reqCnt+"個\n  ",currCnt=$gameParty.completedQuestsCnt(rpgquests.handleRank.easy[0],rpgquests.handleRank.normal[1]);
	return rtv+(currCnt>=reqCnt?color.finish:"")+currCnt+" / "+reqCnt;
}), configurable: false } });
$qqqq$.info.codes.push(tmp);
})();
(()=>{ let tmp={},reqCnt=5;
tmp[0]="$gameParty.completedQuestsCnt(rpgquests.handleRank.normal[0],rpgquests.handleRank.normal[1])>="+reqCnt;
Object.defineProperties(tmp,{ 1: { get:(()=>{
	let rtv="中級任務完成數 達"+reqCnt+"個\n  ",currCnt=$gameParty.completedQuestsCnt(rpgquests.handleRank.normal[0],rpgquests.handleRank.normal[1]);
	return rtv+(currCnt>=reqCnt?color.finish:"")+currCnt+" / "+reqCnt;
}), configurable: false } });
$qqqq$.info.codes.push(tmp);
})();
(()=>{ let tmp={},reqCnt=5;
tmp[0]="!!$gameParty.mapChanges[73]";
Object.defineProperties(tmp,{ 1: { get:(()=>{
	let rtv="抵達\\key'\"木亥村莊\"'",currStat=!!$gameParty.mapChanges[73];
	return rtv;
}), configurable: false } });
$qqqq$.info.codes.push(tmp);
})();
$qqqq$=undef;
list.normal_fireflower={
	title:"蒐集火焰花",
	rank:5,
	txt:[
		{txt:"透過\\key'\"通道\"'到達地面，地面有一種紅紅的花，點火後可以摘下，據說可以燒很久。"},"\n\n",
		{txt:"可以蒐集一大堆來嗎？"},
	],
	info:{
		type:"collectItems",
		items:[
			{id:47,amount:10},
		]
	},
	reward:{
		gold:500,
		codes:[]
	},
};
list.normal_branchCrossing={
	title:"猛男撿樹枝",
	titleMinor:"聽說現在這個遊戲很紅",
	rank:7,
	txt:[
		{txt:"透過\\key'\"通道\"'到達地面，地面偶爾可以看到倒塌的大樹幹"},"\n\n",
		{txt:"把它燒一燒後帶回來"},"\n",
		{txt:"  p.s. 燒地面的樹時也可以獲得",sizeRate:0.75},
	],
	info:{
		type:"collectItems",
		items:[
			{id:46,amount:10},
		]
	},
	reward:{
		items:[],
		gold:500,
		codes:[] // [[code,msgTxt],[],...]
	},
};

$qqqq$=list.high_burnCore={
	title:"清光木亥村莊",
	titleMinor:"的樹",
	rank:12,
	limit:1,
	txt:[
		{txt:"展現身為高級焚木工的榮譽吧\n清光木亥村莊"},
		{txt:"的樹",sizeRate:0.5},
		"\n","\n",{txt:"首先完成\\quest[97]取得\\item[101]後，回到\\key'\"焚木工辦事處\"'找我兌換\\item[56]"},
		"\n","\n",{txt:"再到\\key'\"木亥村莊\"'焚木吧！"},
	],
	info:{
		type:"evaltrue",
		codes:[
			['$gameParty.mapChanges[73]&&($gameParty.mapChanges[73].vars.burnPlanted^0)>=($gameParty.mapChanges[73].vars.tree|0)',"清光木亥村莊的樹"],
			['$gameParty.mapChanges[74]&&($gameParty.mapChanges[74].vars.burnPlanted^0)>=($gameParty.mapChanges[74].vars.tree|0)',"清光木亥村莊旁，林地的樹"],
			['$gameParty._items[56]',"持有\\item[56]"],
		]
	},
	reward:{
		items:[{id:55,amount:1},{id:72,amount:1}],
		gold:50000,
		codes:[
			['$gameParty.loseItemAll($dataItems[56])',"自動回收身上的\\item[56]"],
		] // [[code,msgTxt],[],...]
	},
};
$qqqq$.info.codes[0].push(()=>{
	let mch=$gameParty.mapChanges[73],cnt=mch&&mch.vars.tree;
	if(cnt&&mch.vars.burnPlanted){ cnt-=mch.vars.burnPlanted; cnt*=cnt>=0; }
	else if(mch&&mch.vars&&mch.vars.burnPlanted>=1e9) cnt=0;
	return "剩餘樹量 : "+((cnt===undef)?"偵測中":cnt);
});
$qqqq$.info.codes[1].push(()=>{
	let mch=$gameParty.mapChanges[74],cnt=mch&&mch.vars.tree;
	if(cnt&&mch.vars.burnPlanted){ cnt-=mch.vars.burnPlanted; cnt*=cnt>=0; }
	else if(mch&&mch.vars&&mch.vars.burnPlanted>=1e9) cnt=0;
	return "剩餘樹量 : "+((cnt===undef)?"偵測中":cnt);
});
list.high_burnStickMaterial={
	title:"蒐集燃燒棒的材料",
	rank:16,
	txt:[
		{txt:"透過\\key'\"通道\"'到達地面，地圖左下方向前往\\key'\"燃燒地帶\"'，在那裡蒐集一些你沒看過的材料"},
		"\n",{txt:"好熱喔……該任務可無限完成，麻煩你順便蒐集以後要用的份量吧",sizeRate:0.5},
	],
	info:{
		type:"collectItems",
		items:[
			{id:99,amount:22},
			{id:98,amount:64},
			{id:100,amount:89},
		]
	},
	reward:{
		items:[
			{id:101,amount:7},
		],
		codes:[] // [[code,msgTxt],[],...]
	},
};
list.high_coreFruit={
	title:"蒐集木亥蔬果",
	rank:12,
	limit:1,
	txt:[
		{txt:"透過\\key'\"通道\"'到達地面，前往\\key'\"木亥村莊\"'，村莊裡有一些蔬果"},
		"\n",{txt:"每一種都好想吃吃看，可是我在減肥"},
		"\n\n",{txt:"蒐集下列蔬果各1顆/棵/個"},
	],
	info:{
		type:"collectItems",
		items:[
			{id:51,amount:1},
			{id:52,amount:1},
			{id:53,amount:1},
			{id:54,amount:1},
		]
	},
	reward:{
		items:[],
		gold:5000,
		codes:[] // [[code,msgTxt],[],...]
	},
};

list.high_sandcityEconomy={
	title:"調查沙城經濟來源",
	rank:17,
	limit:1,
	txt:[
		{txt:"據說在\\key'\"沙島\"'有一批人專門種耐熱植物。真是太可惡了，二氧化碳濃度都不夠了，竟然還種植物！"},
		"\n",{txt:"越過\\key'\"木亥村莊\"'的森林結界，在\\key'\"The World\"'向左下角走，抵達\\key'\"沙島\"'。\n進入\\key'\"三叉路\"'後往右下角走，前往沙城調查他們的經濟來源吧！"},
	],
	info:{
		type:"evaltrue",
		codes:[
			[1,"調查後自行使用app將任務完成，並向\\key'\"蕾拉\"'說明沙城的特產吧。如果你已經知道了，也可以直接完成任務並作答。"],
		]
	},
	reward:{
		items:[],
		gold:81000,
		codes:[] // [[code,msgTxt],[],...]
	},
};
list.high_sandcityBreakWeather={
	title:"破壞沙城氣候",
	titleMinor:"<<機密任務>>",
	rank:23,
	limit:1,
	txt:[
		{txt:"據調查，要種出超甜的葡萄，水分控制很重要。而沙島尾部似乎有某種可以影響降雨的東西。"},
		"\n",{sizeRate:0.75,txt:"沙島中段的部分有一些雲，利用那個\\key'$gameSwitches.value(36)?$dataItems[121].name:\"某種東西\"'，讓那些雲在抵達沙城前就化為雨水落到地面，導致\\key'\"沙城\"'缺水吧"},
		"\n",{sizeRate:0.75,txt:"完成任務後還請焚木工返回\\key'\"焚木工辦事處\"'"},
	],
	info:{
		type:"evaltrue",
		codes:[
			['$gameSwitches.value(37)',"完成指定降雨"],
		]
	},
	reward:{
		items:[],
		gold:162000,
		codes:[] // [[code,msgTxt],[],...]
	},
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
