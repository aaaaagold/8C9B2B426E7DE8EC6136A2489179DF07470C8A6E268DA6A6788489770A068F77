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
	txtarr.push({txt:"Z / Enter / 空白鍵 / 滑鼠左鍵 / 觸控面板點擊該選項或位置"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"取消 / 返回 / 開啟選單:"});
	txtarr.push("\n");
	txtarr.push({txt:"X / Esc / 右側數字鍵盤的數字0 / 滑鼠右鍵 / "+$dataCustom.touchPad2p});
	txtarr.push("\n");
	txtarr.push({txt:"在沒有對話,也沒有看起來像選單的東西時,以上功能為開啟選單",sizeRate:0.75});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"捲動過長的頁面:"});
	txtarr.push("\n");
	txtarr.push({txt:"滑鼠滾輪 / 上下方向鍵 / End/Home/PgDn/PgUp / 觸控面板一個點的滑動(可在瀏覽器內，遊戲畫面外)(某些瀏覽器有滑動使用\\key'\"重新整理\"'之功能，請謹慎使用)"});
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
	txtarr.push({txt:"稍早應該已經體驗過, 就是輸入名字的部分。除了換行(不算選字時的enter, 按下enter等同確認), 應該是所有文字都可以輸入——只要你的瀏覽器有支援。支援複製、貼上。"});
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
	txtarr.push({txt:"遊戲暫停 (不更新遊戲畫面, FPS=0, 可避免CPU浪費電): P 或於\\key'$dataCustom.usrSwitch'中使用遊戲暫停"});
	txtarr.push("\n");
	txtarr.push("\n");
	
	switch(DataManager.getTitle()){
	case "燒毀":{
		txtarr.push({txt:"焚木技巧:"});
		txtarr.push("\n");
		if($gameParty&&$gameParty._items[44]) txtarr.push({txt:"將\\key'\""+$dataCustom.noGainMsg.replace("\\","\\\\").replace("'","\\'")+"\"'及\\item[44]開啟後, 按著Ctrl, 再按著確認, 然後走到可燃物旁面對它, 就能將其燃燒。過程中不需要放開Ctrl與確認。"});
		else{
			if($gamePlayer._skipStory) txtarr.push({txt:"先取得\\item[44], 這個技巧才會顯示。\\item[44]在\\key'\"開始\"'地圖左側。"});
			else txtarr.push({txt:"先取得\\item[44], 這個技巧才會顯示。\\item[44]在家裡桌上。"});
		}
	}break;
	case "如果我有一座新冰箱":{
	}break;
	}
	let w=new Window_CustomTextBoard(txtarr);
	//if(returnWindow) return w;
	SceneManager.addWindowB(w);
};
list.defs=action=>{
	const getTxt=k=>$dataCustom.itemEffect[k+"_txt"]+($dataCustom.itemEffect[k]+'').replace(/,$/,''),txtarr=[],ie=$dataCustom.itemEffect,pr=$dataCustom.params;
	txtarr.push({txt:"定義及設定:"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"每移動"+Game_Actor.prototype.stepsForTurn()+"步相當於經過1回合"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"普攻:普通攻擊的簡稱"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:ie.dmgType_txt+"不管是對目標:減少或增加,HP或MP，通通都叫做傷害"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:pr.grd+":"+TextManager.guard+"效果的倍數，將所受傷害除以此值(未滿0.5時以0.5計，代表無效果)，再除以2，即"+TextManager.guard+"時所受傷害的計算值。"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"傷害計算順序:"});
	txtarr.push("\n");
	txtarr.push({txt:"1. 由技能或道具公式算出一個值A"});
	txtarr.push("\n");
	txtarr.push({txt:"2. 由上述A乘上屬性加成，得到B"});
	txtarr.push("\n");
	txtarr.push({txt:"3. 由上述B依據 "+getTxt("hitType")+" 計算倍率再計算增減值(依:"+[pr.pdr,pr.mdr,pr.pdv,pr.mdv]+")，得C"});
	txtarr.push("\n");
	txtarr.push({txt:"4. 由上述C依據 "+getTxt("dmgCrit")+" 計算倍率，得D"});
	txtarr.push("\n");
	txtarr.push({txt:"5. 由上述D依據目標是否 "+TextManager.guard+"及目標的"+pr.grd+"計算傷害倍率，得E"});
	txtarr.push("\n");
	txtarr.push({txt:"6. 由上述E代入 "+[pr.arh,pr.arm]+" 的計算及傷害計算，若是下列之一情形:\""+ie.dmgType_txt+ie.dmgType.slice(5,7)+"\"，則實際吸收量不會超過目標所擁有的HP或MP量。得F，F為計算結果。"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"爆擊:攻擊時依角色能力機率產生爆擊，數字的值會變為"+Game_Action.prototype.applyCritical(1)+"倍。"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:ie.isNormalAtk_txt+"若使用普攻時會機率對目標產生特定狀態，則使用該技能或道具也會機率產生相同的特定狀態"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:pr.basic+": "+$dataSystem.terms.params.slice(0,8)});
	txtarr.push("\n");
	txtarr.push("\n");
	
	if(objs&&objs.confs&&objs.confs.useStp){
		txtarr.push({txt:"STP: STomach Point, 意即肚子點數, 最大值是 "+Game_Actor.prototype.maxStp()});
		txtarr.push("\n");
		txtarr.push({txt:$dataCustom.cstp+" = 0 代表你快餓死了, 該角色HP,MP以外的所有"+pr.basic+"將剩下 10% ，裝備、狀態等加成則不變。"});
		txtarr.push("\n");
		txtarr.push({txt:$dataCustom.cstp+" = 0 時睡覺, "+$dataCustom.cstp+"會變成1"});
		txtarr.push("\n");
		txtarr.push({txt:"使用某些物品會影響 "+$dataCustom.cstp});
		txtarr.push("\n");
		txtarr.push({txt:"戰鬥時除了使用\\key'$dataCustom.spaceout'以外，每次行動會消耗 "+$dataCustom.cstp+" 1"});
		txtarr.push("\n");
		txtarr.push("\n");
	}
	txtarr.push({txt:"HP: Health Point, 意即體力點數, HP為0的角色無法做任何動作。\\key'\"全部隊員HP皆為0則遊戲結束\"'"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"MP: Mana Point, 意即魔力點數, 使用部分技能需要消耗數量不等的MP。"});
	txtarr.push("\n");
	txtarr.push("\n");
	txtarr.push({txt:"TP: Technique Point, 意即技術點數, 使用部分技能需要消耗數量不等的TP。"});
	txtarr.push("\n");
	txtarr.push("\n");
	
	txtarr.push({txt:"本遊戲隨作者心情隨意更新，你可以假設發生更新的機率很低。"});
	txtarr.push("\n");
	txtarr.push({txt:"若該地圖有更新，重進該地圖後可讓新增的事件出現，但更大的機會是你那個存檔會直接不能用。"});
	txtarr.push("\n");
	txtarr.push("\n");
	
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
const returnToSomewhere=(action,mapId,x,y,dir,fade,msg_alreadyAt)=>{
	const to=mapId;
	fade=fade||0;
	if($gameMap.getRoot(to)!==$gameMap.getRoot()){ // no decrease for unlimited item
		$gamePlayer.reserveTransfer(to,x,y,dir,fade);
		backToMap();
	}else{ // cancel
		let id=action._item._itemId;
		const item=action.item();
		if(item.consumable){
			$gameParty.gainItem_q(item,1);
		}
		//$gameMessage.clear();
		$gameMessage.popup(msg_alreadyAt,1);
	}
};
list._genReturnTo=(mapId,x,y,dir,fade,msg_alreadyAt)=>{
	return action=>returnToSomewhere(action,mapId,x,y,dir,fade,msg_alreadyAt);
};
list.returnFloatCity=action=>{
	returnToSomewhere(action,32,25,34,8,0,"已在浮游城");
};
list.returnCore=action=>{
	returnToSomewhere(action,73,14,37,8,0,"已在木亥村莊");
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
	if($gameMap._mapId===103 && $gameMap._events[65].pos(xy.x,xy.y) && !$gameSelfSwitches.value(103,65,B) ) $gameMap._events[65].ssStateSet("A");
	else $gameMap.cpevt($dataMap.templateStrt_item+5,xy.x,xy.y,1,1,1);
	$gameParty.consumeItem(dataitem,true);
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
	$gameParty.consumeItem(dataitem,true);
	$gameMessage.popup("放置了1顆\\item["+dataitem.id+"]",1);
	//backToMap();
};

list.useRainPowder=(action)=>{
	let dataitem=action.item();
	$gameParty.consumeItem(dataitem,1);
	if(SceneManager){
		let scc=SceneManager._scene.constructor;
		if(scc===Scene_Map||scc===Scene_Item){
			let arr=$dataMap.eventsByMeta.rainPowder;
			if(arr){ for(let x=0,evts=$gameMap._events,px=$gamePlayer.x,py=$gamePlayer.y;x!==arr.length;++x){ if(evts[arr[x]].pos(px,py)){
				let flag=0,data={};
				for(let y=160,w=$gameMap.width(),h=$gameMap.height();y!==180;++y){
					for(let x=95;x!==185;++x){
						let idx=$gameMap.layeredTiles(x,y).indexOf(2768);
						if(flag|=idx!==-1) data[((3-idx)*h+y)*w+x]=0;
					}
				}
				$gameParty.changeMap('tile',data);
				if(flag){
					$gameSwitches.setValue(37,1);
					$gameParty.speak("不知道為什麼沒有山的地方可以卡著一堆雲");
				}
				break;
			} } }
			backToMap();
			return $gamePlayer.requestAnimation(84);
		}
	}
	return $gameMessage.popup("使用了\\item["+dataitem.id+"]但沒有任何效果",1);
};

list.rf_ticket=(action)=>{
	//$gameParty.consumeItem(dataitem,1);
	if($gameSwitches.value(89)) return $gameMessage.popup("已購買",true);
	if($gameMap&&$gameMap._mapId===148&&$gameMap._events[5].dist2($gamePlayer)<4){
		if($gameParty._gold>=1e6){
			$gameMap._events[1].ssStateSet("D");
			backToMap();
		}else $gameMessage.popup("\\G不足",true);
	}
};

list.rf_feather=(action)=>{
	let dataitem=action.item();
	const dist=Number(dataitem.meta.dist||5);
	$gameParty.consumeItem(dataitem,true);
	{
		const nextId=Number(dataitem.meta.next);
		if(nextId){
			$gameTemp.gainMsgConfigs_pushAndMute();
			$gameParty.gainItem(dataitem._arr[nextId],1);
			$gameTemp.gainMsgConfigs_pop();
		}
	}
	const dir=$gamePlayer._dir,evtSet=new Set();
	let x=$gamePlayer.x,y=$gamePlayer.y,dx1,dy1,cf,c=0;
	for(let _=dist;_--;++c){
		if(!$gamePlayer.isMapPassable(x,y,dir)) break;
		x=$gameMap.roundXWithDirection(x,dir);
		y=$gameMap.roundYWithDirection(y,dir);
		if(dx1===undefined){
			dx1=$gamePlayer.x-x;
			dy1=$gamePlayer.y-y;
			if(dx1*dx1+dy1*dy1>1) cf=1;
		}else{
			if(($gamePlayer.x-x)*dx1<0 || ($gamePlayer.y-y)*dy1<0) cf=1;
		}
		if(_===0) break;
		$gameMap.eventsXy(x,y).forEach(e=>e._moveType&&evtSet.add(e));
	}
	$gamePlayer.requestAnimation(91);
	if(cf){
		let x=$gamePlayer.x,y=$gamePlayer.y;
		while(c--){
			x=$gameMap.xWithDirection(x,dir);
			y=$gameMap.yWithDirection(y,dir);
		}
		const dst={dist1:true,x:x,y:y};
		evtSet.forEach(evt=>{
			evt._x=x; evt._y=y; evt.requestAnimation(92);
			evt.moveSpeedBuff_set({remain_move:1,delta:7-evt._moveSpeed});
			evt.moveSpeedBuff_ctr();
		});
	}else{
		const dst={dist1:true,x:x,y:y};
		evtSet.forEach(evt=>{
			evt._x=x; evt._y=y; evt.requestAnimation(92);
			evt.moveSpeedBuff_set({remain_move:1,delta:7-evt._moveSpeed});
			evt.moveSpeedBuff_ctr();
		});
	}
	backToMap();
};

list._rf_return_homeId=148;
list._rf_return_cmds=[{code:201,indent:0,parameters:[0,list._rf_return_homeId,9,5,8,0]},Game_Interpreter.EMPTY];
list.rf_return=(action)=>{
	//const dataitem=action.item();
	//$gameParty.consumeItem(dataitem,1);
	if($gameMap._mapId===list._rf_return_homeId){
		const idx=$gameParty._actors.indexOf($dataSystem.partyMembers[0]);
		const prefix=idx<0?"你":"\\P["+(idx+1)+"]";
		return $gameMessage.popup(prefix+" 已在家裡",true);
	}
	$gamePlayer.requestAnimation(117);
	const itpr=$gameMap._interpreter;
	itpr.setup(list._rf_return_cmds);
	itpr._waitCount=55;
	backToMap();
};

list.t_redApple=action=>{
	$gameTemp.gotoEnding=0;
	if($gameMap._mapId===257) $gameMap._events[14].start();
	else $gamePlayer.reserveTransfer(257,7,4,8);
	backToMap();
};
list.t_blueApple=action=>{
	const item=action.item();
	if(!item) return; // ?_?
	if(SceneManager._scene.constructor===Scene_Battle){ return;
		for(let x=0,arr=$gameTroop._enemies;x!==arr.length;++x){
			const newHp=arr[x]._hp>>1;
			// arr[x]._hp-newHp;
			arr[x]._hp=newHp;
		}
		return;
	}
	if($gameSwitches._data[111]){
		if(item.itemType!=='s'){
			$gameTemp.gainMsgConfigs_pushAndMute();
			$gameParty.gainItem(item,1);
			$gameTemp.gainMsgConfigs_pop();
		}
		$gameMessage.popup("別鬧了，誰知道再吃一次還能不能醒來",true);
		return;
	}
	if($gameMap._mapId===258){
		$gameMap._events[2].start(0,{_:true});
		for(let x=0,arr=$gameParty.members();x!==arr.length;++x) arr[x].gainHp(arr[x].hp>>1);
		backToMap();
	}else{
		let s;
		switch(item.itemType){
		default: s="此道具或動作"; break;
		case 's': s="\\skill["+item.id+"]"; break;
		case 'i': s="\\item["+item.id+"]"; break;
		}
		if(item.itemType!=='s'){
			$gameTemp.gainMsgConfigs_pushAndMute();
			$gameParty.gainItem(item,1);
			$gameTemp.gainMsgConfigs_pop();
		}
		$gameMessage.popup("錯誤：無法在這裡使用"+s,true);
	}
};

// end
})();
