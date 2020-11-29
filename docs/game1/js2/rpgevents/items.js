"use strict";

(()=>{ // strt
let list=rpgevts.item;
let $dddd$,$rrrr$;
const backToMap=()=>{
	if(SceneManager._scene.constructor!==Scene_Map){
		do{
			if(SceneManager._stack.length) SceneManager.pop();
			else{
				SceneManager.push(Scene_Map);
				break;
			}
		}while(SceneManager._nextScene.constructor!==Scene_Map);
	}
};

list.manual=(action)=>{
	let txtarr=[];
	txtarr.push({txt:"移動:"});
	txtarr.push("\n");
	txtarr.push({txt:"方向鍵 / 右側數字鍵盤 / WASD / 點擊遊戲中場景, 若可走過去則會自動尋路"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"確認:"});
	txtarr.push("\n");
	txtarr.push({txt:"Z / Enter / 空白鍵 / 滑鼠左鍵"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"取消 / 返回 / 開啟選單:"});
	txtarr.push("\n");
	txtarr.push({txt:"X / Esc / 右側數字鍵盤的數字0 / 滑鼠右鍵 / 觸控面板一次按兩個點"});
	txtarr.push("\n");
	txtarr.push({txt:"在沒有對話,也沒有看起來像選單的東西時,以上功能為開啟選單",sizeRate:0.75});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"捲動過長的頁面:"});
	txtarr.push("\n");
	txtarr.push({txt:"滑鼠滾輪 / 上下方向鍵 / End/Home/PgDn/PgUp / 觸控面板兩個點的滑動(可在瀏覽器內，遊戲畫面外)"});
	txtarr.push("\n");
	txtarr.push({txt:"請試著捲動本頁以閱覽下方超過螢幕範圍的資訊↓"});
	for(let x=11;x--;){
		txtarr.push("\n");
		txtarr.push({txt:"↓ 剩餘"+x});
	}
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"輸入文字區:"});
	txtarr.push("\n");
	txtarr.push({txt:"稍早應該已經體驗過, 就是輸入名字的部分。除了換行, 應該是所有文字都可以輸入——只要你的瀏覽器有支援。"});
	txtarr.push("\n");
	txtarr.push({txt:"是不是想重新進遊戲了呀?",sizeRate:0.5});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"監視FPS: F2"});
	txtarr.push("\n");
	txtarr.push({txt:"自動調整遊戲畫面大小至看得見整個遊戲畫面的最大大小: F3"});
	//txtarr.push("\n");
	txtarr.push({txt:"  (可能會模糊)",sizeRate:0.75});
	txtarr.push("\n");
	txtarr.push({txt:"遊戲暫停 (不更新遊戲畫面, FPS=0, 可避免CPU浪費電): P"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"焚木技巧:"});
	txtarr.push("\n");
	if($gameParty&&$gameParty._items[44]) txtarr.push({txt:"將\\key'\""+$dataCustom.noGainMsg.replace("\\","\\\\").replace("'","\\'")+"\"'及\\item[44]開啟後, 按著Ctrl, 再按著確認, 然後走到可燃物旁面對它, 就能將其燃燒。過程中不需要放開Ctrl與確認。"});
	else txtarr.push({txt:"先取得\\item[44], 這個技巧才會顯示。\\item[44]在家裡桌上。"});
	
	let w=new Window_CustomTextBoard(txtarr);
	//if(returnWindow) return w;
	SceneManager.addWindowB(w);
};
list.licence=(action)=>{
	let gainFlag=0;
	let id=action._item._itemId;
	if(!$gameParty._apps) $gameParty._apps={};
	if(!$gameParty._apps.quest){
		gainFlag|=1;
		$gameParty._apps.quest=1;
		$gameMessage.popup($dataCustom.gainApps.questMgr,1);
	}
	for(let x=0,arr=[64,65,66];x!==arr.length;++x){
		if(!$gameParty._items[arr[x]]){
			gainFlag|=1;
			$gameParty.gainItem($dataItems[arr[x]],1);
		}
	}
	if(42<id){
		let newApps=0;
		if(!$gameParty._apps.achievement){
			++newApps;
			gainFlag|=1;
			$gameParty._apps.achievement=1;
			$gameMessage.popup($dataCustom.gainApps.achievementMgr,1);
		}
		if(!$gameParty._apps.locLog){
			++newApps;
			gainFlag|=1;
			$gameParty._apps.locLog=1;
			$gameMessage.popup($dataCustom.gainApps.locLogMgr,1);
		}
	}
	if(gainFlag===0){
		$gameMessage.popup("這是一張獵人執...說錯",1,{t_remained:500});
		$gameMessage.popup("這是一張\\item["+id+"]",1);
		return;
	}
};
list.coreAdmin=(action)=>{
	if(!$gameParty._items[93]) $gameParty.gainItem($dataItems[93],1);
	$gameParty.gainItem($dataItems[94],1000);
};
list.fireTrigger=(action)=>{ $gameParty.canburn=$dataItems[action._item._itemId.toId()].name; };
list.slashTrigger=(action)=>{ $gameParty.canslash=action.item().name; };
list.plantTrigger=(action)=>{ $gameParty.canplant=action.item().id; };
list.bombTrigger=(action)=>{ $gameParty.canBomb=action.item().id; };
list.returnFloatCity=(action)=>{
	debug.log('rpgevts.item.returnFloatCity');
	let to=32;
	if($gameMap.getRoot(to)!==$gameMap.getRoot()){ // no decrease for unlimited item
		$gamePlayer.reserveTransfer(to,25,34,8,0);
		backToMap();
	}else{
		let id=action._item._itemId;
		$gameParty._items[id]^=0;
		$gameParty._items[id]+=action.item().consumable;
		//$gameMessage.clear();
		$gameMessage.popup("已在浮游城",1);
	}
};
list.returnCore=(action)=>{
	debug.log('rpgevts.item.returnCore');
	let to=73;
	if($gameMap.getRoot(to)!==$gameMap.getRoot()){ // no decrease for unlimited item
		$gamePlayer.reserveTransfer(to,14,37,8,0);
		backToMap();
	}else{
		let id=action._item._itemId;
		$gameParty._items[id]^=0;
		$gameParty._items[id]+=action.item().consumable;
		//$gameMessage.clear();
		$gameMessage.popup("已在木亥村莊",1);
	}
};
list.formatToHere=(action)=>{
	debug.log('rpgevts.item.formatToHere');
	// also set '$gameParty.burnAuth'
	// $gameParty.burnAuth: can edit / can write
	// $gameParty.format: can enter / can read
	let ps=$gameMap.parents();
	let newFormat=$gameMap.getRoot();
	if(newFormat===undef) $gameMessage.popup("無法偽裝成該地圖的村民",1);
	else if($gameParty.format===newFormat) $gameMessage.popup("已偽裝成該地圖的村民了",1);
	else{
		$gameParty.format=newFormat;
		$gameParty.formatName=action.item().name;
		$gameMessage.popup("成功偽裝成該地圖的村民",1);
		if($gameMap.parents().indexOf($gameParty.burnAuth)===-1) $gameParty.burnAuth=newFormat;
	}
};
list.leafJuice=(action)=>{
	if($gameParty._achievement&&$gameParty._achievement[7]) return;
	$gameParty._leafJuiceCnt^=0;
	++$gameParty._leafJuiceCnt;
	if($gameParty._leafJuiceCnt>=100){
		$gameParty.gainAchievement(7);
		delete $gameParty._leafJuiceCnt;
	}
};
let tbl_fireCrystal=[];
tbl_fireCrystal[96]=2;
tbl_fireCrystal[102]=3;
tbl_fireCrystal[106]=4;
list.fireCrystal=(action)=>{
	backToMap();
	let item=action.item();
	if($dataMap.meta.disableBomb){
		$gameParty.speak("在這裡放\\item["+item.id+"]似乎不太好。");
		return;
	}
	$gameParty.gainItem(item,-1);
	$gameMap.cpevt($dataMap.templateStrt_item+tbl_fireCrystal[item.id],$gamePlayer.x,$gamePlayer.y,1,1,1);
};
list.activationFlute=(action)=>{
	backToMap();
	$gameMap._events.filter((evt)=>evt&&$gameMap.isValid(evt.x,evt.y)&&evt.event().meta.name==="火焰水晶").forEach(evt=>evt.ssStateSet("C"));
	setTimeout(()=>AudioManager.playMe({name:"Musical2",volume:75,pitch:200}),1);
};
list.lottery=(action)=>{
	//let dataitem=action.item();
	let p=list.lotteryList.rnd();
	if(p.special){
		if(p.data[0]==="txt") $gameMessage.popup(p.data[1],1);
	}else $gameParty.gainItem(p.item,p.cnt);
};
list.lotteryList=[ // type,id,weight,cnt(default=1)
	['txt',"(沒東西)",199],
	['txt',"(沒機會)",188],
	['txt',"(是空的)",177],
	['txt',"(機會零)",166],
	['txt',"(機會無)",155],
	['i',6,99],
	['i',7,88],
	['i',8,77],
	['i',9,66],
];
$dddd$=list.lotteryList.rnd=function f(){
	if(this.length===0) return;
	if(this.acc===undefined){
		// suppose 'this.acc' will be deleted if elements change
		let arr=this.acc=this.map(f.getWeight);
		for(let x=1;x!==arr.length;++x) arr[x]+=arr[x-1];
	}
	let r=Math.random()*this.acc.back;
	let idx=this.acc.lower_bound(r);
	idx+=this.acc[idx]===r;
	let p=this[idx];
	let data=f.tbl[p[0]];
	return data?{item:data[p[1]],cnt:(p[3]||1)}:{special:true,data:p};
};
$dddd$.getWeight=x=>x[2];
$dddd$.tbl={a:$dataArmors,i:$dataItems,s:$dataSkills,w:$dataWeapons};
list.lottery_printList=(action)=>{
	SceneManager.push(Scene_LotteryList);
};

let accessory_validMaps={ // .meta.accessory -> array or function
	overworld:()=>$dataMap.tilesetId===1,
	outside:()=>$dataMap.tilesetId===2,
	inside:()=>$dataMap.tilesetId===3,
	dungeon:()=>$dataMap.tilesetId===4,
	sfoutside:()=>$dataMap.tilesetId===5,
	sfinside:()=>$dataMap.tilesetId===6,
	myhouse:[31,],
},accessory_toEvt={ // itemId -> evtTemplateId
	107:2, 108:3, 109:4, 110:5,
};
list.accessory=(action)=>{
	let dataitem=action.item();
	let maps=accessory_validMaps[dataitem.meta.accessory];
	if(maps){
		let isValid=false; // true: can placing this accessory
		if(maps.constructor===Function) isValid=maps();
		else if(maps.constructor===Array) isValid=maps.indexOf($gameMap._mapId)!==-1;
		if(isValid){
			let p=$gamePlayer;
			let evtid=$dataMap.templateStrt+accessory_toEvt[dataitem.id];
			if(isNaN(evtid)) $gameMessage.popup("這不是裝飾品道具",1);
			else{
				let res=$gameMap.cpevt(evtid,p.x,p.y,1,1); // using tileTemplate
				if(res===0) $gameMessage.popup("角色所在位置有其他東西而無法放置",1);
				else{
					$gameParty.loseItem(dataitem,1);
					backToMap();
				}
			}
			return;
		}
	}
	$gameMessage.popup("該道具無法放置在此地圖中",1);
};
list.slowingBead=(action)=>{
	let dataitem=action.item();
	let xy=$gamePlayer.frontPos();
	if(!$gameMap.isValid_round(xy.x,xy.y)){
		$gameMessage.popup("角色前方已超出地圖，無法放置",1);
		return;
	}
	// if 彩蛋 else 一般情況
	if($gameMap._mapId===103 && $gameMap._events[65].pos(xy.x,xy.y) && !$gameSelfSwitches._data[103]['65,B'] ) $gameMap._events[65].ssStateSet("A");
	else $gameMap.cpevt($dataMap.templateStrt_item+5,xy.x,xy.y,1,1,1);
	$gameParty.loseItem(dataitem,1);
	$gameMessage.popup("放置了1顆\\item["+dataitem.id+"]",1);
	//backToMap();
};
list.hasteningBead=(action)=>{
	let dataitem=action.item();
	let xy=$gamePlayer.frontPos();
	if(!$gameMap.isValid_round(xy.x,xy.y)){
		$gameMessage.popup("角色前方已超出地圖，無法放置",1);
		return;
	}
	$gameMap.cpevt($dataMap.templateStrt_item+6,xy.x,xy.y,1,1,1);
	$gameParty.loseItem(dataitem,1);
	$gameMessage.popup("放置了1顆\\item["+dataitem.id+"]",1);
	//backToMap();
};

// end
})();
