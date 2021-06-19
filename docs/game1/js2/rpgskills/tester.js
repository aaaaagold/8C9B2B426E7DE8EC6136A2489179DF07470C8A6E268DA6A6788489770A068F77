"use strict";

if(!window.objs) window.objs={};

(()=>{ const list=objs.rpgskills.list,filter=objs.rpgskills.filter;

const toScenes=new Set(),backToMap=()=>{
	if(toScenes.size===0){
		toScenes.add(Scene_Battle);
		toScenes.add(Scene_Map);
	}
	if(!toScenes.has(SceneManager._scene.constructor)){
		do{
			if(SceneManager._stack.length) SceneManager.pop();
			else{
				SceneManager.push(Scene_Map);
				break;
			}
		}while(!toScenes.has(SceneManager._scene.constructor));
	}
};

const retArg0=arg0=>arg0;
const systemCall_genObjs=kargs=>{
	const rtv={};
Object.defineProperties(rtv.player={},{
	x:{
		get:function(){return this._x;},
		set:retArg0,
	},
	_x:{
		get:()=>$gamePlayer.x,
		set:rhs=>$gamePlayer._x=rhs,
	},
	y:{
		get:function(){return this._y;},
		set:retArg0,
	},
	_y:{
		get:()=>$gamePlayer.y,
		set:rhs=>$gamePlayer._y=rhs,
	},
});
Object.defineProperties(rtv.party={},{
	_gold:{
		get:()=>$gameParty._gold,
		set:rhs=>{
			if($gameParty._gold!==rhs) $gameParty.gainAchievement(8);
			$gameParty._gold=rhs;
		},
	},
	_items:{
		get:()=>{
			$gameTemp._pt_needRefresh_items=true;
			return $gameParty._items;
		},
		set:rhs=>{
			$gameMessage.popup("不建議這樣做");
			return rhs;
		},
	},
	_armors:{
		get:()=>{
			$gameTemp._pt_needRefresh_armors=true;
			return $gameParty._armors;
		},
		set:rhs=>{
			$gameMessage.popup("不建議這樣做");
			return rhs;
		},
	},
	_weapons:{
		get:()=>{
			$gameTemp._pt_needRefresh_weapons=true;
			return $gameParty._weapons;
		},
		set:rhs=>{
			$gameMessage.popup("不建議這樣做");
			return rhs;
		},
	},
	_actors:{
		get:()=>{ return $gameParty._actors; },
		set:rhs=>{
			$gameMessage.popup("不建議這樣做");
			return rhs;
		},
	},
	gainAllItems:{
		get:()=>{ return retArg0.bind.call($gameParty.gainAllItems,$gameParty); },
		set:rhs=>{ return $gameParty.gainAllItems=rhs; },
	},
});
Object.defineProperties(rtv.actors={},{
	actor:{
		get:function(){ return retArg0.bind.call($gameActors.actor,$gameActors); },
		set:none,
	},
});
	return rtv;
};
const systemCall=(obj,key)=>{
	const cmd=obj&&obj[key];
	const subject=$gameTemp.txtin_subject;
	const cmdLog=subject&&(subject._cmdLog||(subject._cmdLog=[]));
	if(cmdLog) cmdLog.push([cmd]);
	try{
		const wrap=systemCall_genObjs();
		objs._doFlow.call(null,cmd,[
			'$gamePlayer','$gameParty','$gameActors','$gameTemp','$gameTroop','$gameVariables','$gameSwitches','window'
		],[
			wrap.player,wrap.party,wrap.actors,
		]);
		if(cmdLog) cmdLog.back.push(0);
		if(subject) subject._failCnt=0;
	}catch(e){
		if(subject){
			let fcnt=1;
			if(subject){
				subject._failCnt|=0;
				fcnt=++subject._failCnt;
			}
			$gameTemp.txtin_subject.gainHp(-fcnt);
			$gameMessage.popup("執行失敗,信心受到打擊,hp減少"+fcnt);
		}else{
			$gameMessage.popup("執行失敗");
		}
		if(cmdLog) cmdLog.back.push(1);
	}
	$gameTemp.txtin_subject=undefined;
};
list.systemCall=action=>{
	if(toScenes.size===0){
		toScenes.add(Scene_Map);
		toScenes.add(Scene_Battle);
	}
	$gameTemp.txtin_subject=action.subject();
	$gameTemp.txtin_final=systemCall;
	$gameMessage.add("\\TXTIN'javascript:'SYSTEM CALL");
	backToMap();
};
list.systemCall_logMgr=action=>{
	const subject=action.subject();
	$gameTemp.txtin_subject=subject;
	const log=subject&&subject._cmdLog||[];
	let swapStat;
	const w=new Window_CustomMenu_main(0,0,[
		["查看紀錄",";;func;list",1,()=>{
			const rtv=log.map((x,i)=>[(x[1]?"X: ":"O: ")+x[0],";;func;call",true,()=>copyToClipboard(x[0])]);
			if(rtv.length) rtv.unshift(["在已選的紀錄上再按一次，可以複製到剪貼簿",";;func",false]);
			else rtv.push(["沒有紀錄",";;func",false]);
			return rtv;
		}],
		["再次執行",";;func;list",1,()=>{
			const rtv=log.map((x,i)=>[(x[1]?"X: ":"O: ")+x[0],";;func;call",true,()=>{
				const tmp=$gameTemp.txtin_subject;
				$gameTemp.txtin_subject=undefined;
				systemCall(x,0);
				$gameTemp.txtin_subject=tmp;
			}]);
			if(rtv.length) rtv.unshift(["在已選的紀錄上再按一次，可以再執行一次。再次執行不會再次紀錄",";;func",false]);
			else rtv.push(["沒有紀錄",";;func",false]);
			return rtv;
		}],
		["刪除紀錄",";;func;list",1,()=>{
			const rtv=log.map((x,i)=>[(x[1]?"X: ":"O: ")+x[0],";;func;call",true,function(){
				log.splice(i,1);
				this.parent.processCancel();
			}]);
			if(rtv.length) rtv.unshift(["在已選的紀錄上再按一次，可以刪除該項紀錄",";;func",false]);
			else rtv.push(["沒有紀錄",";;func",false]);
			return rtv;
		}],
		["交換順序",";;func;list",1,()=>{
			swapStat=undefined;
			const rtv=log.map((x,i)=>{
				const getcmd=()=>(swapStat===i?" * ":"")+(log[i]?(log[i][1]?"X: ":"O: ")+log[i][0]:"");
				return [getcmd,";;func;call",true,function(){
					if(swapStat===undefined) swapStat=i;
					else{
						const tmp=log[i]; log[i]=log[swapStat]; log[swapStat]=tmp;
						swapStat=undefined;
					}
					this.refresh();
				}];
			});
			if(rtv.length) rtv.unshift(["選擇兩個，交換順序",";;func",false]);
			else rtv.push(["沒有紀錄",";;func",false]);
			return rtv;
		}],
	]);
	SceneManager.addWindowB(w);
};

list.exportVars=()=>{
	window.$gameTemp=$gameTemp;
	window.$gameSystem=$gameSystem;
	window.$gameScreen=$gameScreen;
	window.$gameTimer=$gameTimer;
	window.$gameMessage=$gameMessage;
	window.$gameSwitches=$gameSwitches;
	window.$gameVariables=$gameVariables;
	window.$gameSelfSwitches=$gameSelfSwitches;
	window.$gameActors=$gameActors;
	window.$gameParty=$gameParty;
	window.$gameTroop=$gameTroop;
	window.$gameMap=$gameMap;
	window.$gamePlayer=$gamePlayer;
	$gameMessage.popup("已匯出變數",true);
};

})();
