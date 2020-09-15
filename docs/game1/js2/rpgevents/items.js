"use strict";

(()=>{ // strt
let list=rpgevts.item;
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
	txtarr.push({txt:"遊戲暫停 (FPS=0, 可避免CPU浪費電): P"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"焚木技巧:"});
	txtarr.push("\n");
	if($gameParty&&$gameParty._items[44]) txtarr.push({txt:"將"+$dataCustom.noGainMsg+"及\\item[44]開啟後, 按著Ctrl, 再按著確認, 然後走到可燃物旁面對它, 就能將其燃燒。過程中不需要放開Ctrl與確認。"});
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
let tbl_fireCrystal=[]; tbl_fireCrystal[96]=2; tbl_fireCrystal[102]=3;
list.fireCrystal=(action)=>{
	backToMap();
	let item=action.item();
	$gameParty.gainItem(item,-1);
	$gameMap.cpevt($dataMap.templateStrt_item+tbl_fireCrystal[item.id],$gamePlayer.x,$gamePlayer.y,1,1,1);
};
list.activationFlute=(action)=>{
	backToMap();
	$gameMap._events.filter((evt)=>evt&&$gameMap.isValid(evt.x,evt.y)&&evt.event().meta.name==="火焰水晶").forEach(evt=>evt.ssStateSet("C"));
};
list.lottery=(action)=>{
	let dataitem=action.item();
	$gameParty.gainItem($dataItems[list.lotteryList.rnd()],1);
};
list.lotteryList=[];
{
	let arr=list.lotteryList;
	for(let x=6;x<=16;++x) arr.push(x);
	for(let x=18;x<=27;++x) arr.push(x);
}
list.lottery_printList=(action)=>{
	$gameMessage.popup("作者還沒做好(TODO)",1);
};

// end
})();
