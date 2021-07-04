"use strict";
// CustomMenu2-battlePlan

// - Window_BattlePlan
function Window_BattlePlan(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_BattlePlan;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Window_HorzCommand.prototype); //Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(x,y,kargs){
	kargs=kargs||{};
	if(kargs._windowWidth  === undefined) kargs._windowWidth  = Graphics.boxWidth;
	this._maxCols=3;
	
	f.ori.call(this,x,y,kargs);
	this._lastPlan=undefined;
	this._handlers.edit=this.handler_edit.bind(this);
	
	this.addSubwindow_actors.apply(this,this.subwindLoc_actors(kargs));
	this.addSubwindows_plan.apply(this,this.subwindLoc_plan(kargs));
	this.addSubwindow_topic.apply(this,this.subwindLoc_topic(kargs));
	this._actorWindow._planWindows=this._planWindows;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.refresh;
$dddd$=$aaaa$.prototype.refresh=function f(){
	f.ori.call(this);
	this.refresh_actor();
	this.refresh_plans();
	this.refresh_topic();
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.refresh_actor=function(){
	this._actorWindow && this._actorWindow.refresh();
};
$dddd$=$aaaa$.prototype.refresh_plans=function f(){
	if(this._actorWindow) this._actorWindow.refresh_plans();
	else this._planWindows && this._planWindows.forEach(f.forEach);
};
$dddd$.forEach=x=>x.refresh();
$aaaa$.prototype.refresh_topic=function(){
	this._topicWindow && this._topicWindow.refresh();
};
$aaaa$.prototype.makeCommandList=function(){
	this.addCommand($dataCustom.ok,'ok');
	this.addCommand($dataCustom.edit,'edit');
	const sc=SceneManager._scene;
	this.addCommand(TextManager.cancel,'cancel', sc && sc.constructor===Scene_Battle );
};
$aaaa$.prototype.handler_edit=function(){
	this.deactivate();
	const aw=this._actorWindow;
	aw.select(aw._index<0?0:aw._index);
	aw.activate();
};
$aaaa$.prototype.subwindLoc_actors=function(){
	// x,y,w,h,displayCnt
	return [0,this.height,this.width,Graphics.boxHeight-this.height,this.displayActorCnt];
};
$aaaa$.prototype._getActor=idx=>$gameParty.allMembers()[idx]; // preserve func-call-style in case that one day it becomes an efficiency bottle neck
$aaaa$.prototype.addSubwindow_actors=function(x,y,width,height,displayActorCnt){
	x|=0;
	y|=0;
	const rtv=this._actorWindow=new Window_BattlePlan_Actor(x,y,{
		_maxCols:displayActorCnt||4,
		_windowWidth:width,
	});
	this.addChild(rtv);
	rtv.deactivate();
	rtv.deselect();
	rtv._handlers.ok=this.ok_actors.bind(this);
	rtv._handlers.cancel=this.cancel_actors.bind(this);
	return rtv;
};
$aaaa$.prototype.ok_actors=function(){
	const aw=this._actorWindow;
	const pw=this._lastPlan=this._planWindows[aw._index-aw._scrollIdx];
	aw.deactivate();
	const idx=aw._lastIdx[aw._index];
	if(pw._actor=this._getActor(aw._index)) pw._actorActTimes=pw._actor.makeActionTimes();
	else pw._actorActTimes=0;
	pw.select(idx||0);
	pw.activate();
};
$aaaa$.prototype.cancel_actors=function(){
	{
		const aw=this._actorWindow;
		aw.deactivate();
		let tmp=aw._index;
		aw.deselect();
		aw._index=tmp;
	}
	
	this.activate();
};
$aaaa$.prototype.subwindLoc_plan=function(){
	const y=this.height+this._actorWindow.height;
	return [0,y,this.width,Graphics.boxHeight-y]; // x,y,w,h
};
$aaaa$.prototype._addSubwindow_plan=function(idx,x,y,width,height){
	const rtv=new Window_BattlePlan_Plan1(x,y,{
		_maxCols:undefined,
		_windowWidth:width,
		_windowHeight:height,
		_actor:this._getActor(idx),
	});
	this._planWindows.push(rtv);
	this.addChild(rtv);
	rtv.deactivate();
	rtv.deselect();
	rtv._handlers.ok=this.ok_plan.bind(this);
	rtv._handlers.cancel=this.cancel_plan.bind(this);
	return rtv;
};
$aaaa$.prototype.ok_plan=function f(){
	const pw=this._lastPlan;
	if(!pw||!pw._actor) return;
	pw.deactivate();
	for(let x=0,arr=this._planWindows;x!==arr.length;++x) arr[x].visible=pw===arr[x];
	this._actorWindow.visible=false;
	const tw=this._topicWindow;
	tw._planWindow=pw;
	tw._pidx=pw._index;
	tw._actor=pw._actor;
	tw.refresh_status();
	tw.refresh_list(f._dummy_arr);
	tw.visible=true;
	tw._syl.clear();
	tw.select(0);
	tw.activate();
};
$aaaa$.prototype.cancel_plan=function(){
	const aw=this._actorWindow;
	const pw=this._lastPlan; this._lastPlan=undefined;
	pw.deactivate();
	aw._lastIdx[aw._index]=pw._index;
	pw.deselect();
	aw.activate();
};
$aaaa$.prototype.addSubwindows_plan=function(ox,oy,width,height){
	ox|=0;
	oy|=0;
	if(!this._planWindows) this._planWindows=[];
	else this._planWindows.length=0;
	for(let i=0,x=0,sz=this._actorWindow.maxCols();i!==sz;++i){
		const nextx=(i+1)*width*1.0/sz;
		this._addSubwindow_plan(i,ox+x,oy,nextx-x,height);
		x=nextx;
	}
};
$aaaa$.prototype.subwindLoc_topic=function(){ // TODO
	return [0,0,this.width,Graphics.boxHeight];
//	const y=this.height+this._actorWindow.height;
//	return [0,y,this.width,Graphics.boxHeight-y]; // x,y,w,h
};
$aaaa$.prototype.addSubwindow_topic=function(x,y,width,height){
	x|=0;
	y|=0;
	const aw=this._actorWindow;
	const rtv=this._topicWindow=new Window_BattlePlan_Topic(x,y,{
		_reservedWidth:width,
		_reservedHeight:height,
		maxHeight:Math.max(Window_Selectable.prototype.fittingHeight(3) , aw.y+aw.height),
	});
	rtv.visible=false;
	this.addChild(rtv);
	rtv.deactivate();
	rtv.deselect();
	//rtv._wholePlan=this;
	//rtv._handlers.ok=this.ok_topic.bind(this);
	rtv._handlers.cancel=this.cancel_topic.bind(this);
	return rtv;
};
$aaaa$.prototype.cancel_topic=function(){
	const tw=this._topicWindow;
	tw._actor=undefined;
	tw.visible=false;
	tw.deactivate();
	const pw=this._lastPlan;
	pw.activate();
	for(let x=0,arr=this._planWindows,pw=this._lastPlan;x!==arr.length;++x) arr[x].visible=true;
	this._actorWindow.visible=true;
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_BattlePlan

// - Window_BattlePlan_Actor
function Window_BattlePlan_Actor(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_BattlePlan_Actor;
$aaaa$.prototype = Object.create(Window_HorzCommand.prototype);
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(){
	this._scrollIdx|=0;
	this.downArrowVisible=this.upArrowVisible=false;
	f.ori.apply(this,arguments);
	this._lastIdx=[];
	const la = this._leftArrowSprite , ra = this._rightArrowSprite;
	la.y=ra.y=this.height>>1;
	ra.x=this.width-(la.x=la.width);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.maxItems=()=>$gameParty.allMembers().length; // the list is cached, fast enough
$aaaa$.prototype.topIndex=function(){ return this._scrollIdx; };
$aaaa$.prototype.isCurrentItemEnabled=function(){ return true; };
$aaaa$.prototype.isCursorVisible=function(){
	const loc=this._index-this._scrollIdx;
	return loc>=0||loc<this._maxCols;
};
$aaaa$.prototype.onTouch=function(triggered){
	this.touchLfRhArrowsLfRh(triggered,this);
	return this._onTouch_iw(triggered,this);
};
$aaaa$.prototype.processWheelH=function(){
	const threshold = 20;
	const lastScrollIdx=this._scrollIdx;
	if(TouchInput.wheelX >= threshold){
		const d=this._scrollIdx+this.maxPageItems()<this.maxItems();
		this._scrollIdx+=d;
		this._index+=d;
	}
	if(TouchInput.wheelX <= -threshold){
		const d=this._scrollIdx>0;
		this._scrollIdx-=d;
		this._index-=d;
	}
	if(lastScrollIdx!==this._scrollIdx){
	//	const idx=this._index;
		if(this._index<this._scrollIdx) this._index=this._scrollIdx;
		else{
			const R=this._scrollIdx+this.maxPageItems();
			if(this._index>=R && R>0) this._index=R-1;
		}
		this.refresh();
		//this.updateCursor();
		this.refresh_plans();
	}
};
$aaaa$.prototype.itemRect=function(index){
	const rect = new Rectangle() , maxCols = this.maxCols();
	rect.width = this.itemWidth();
	rect.height = this.itemHeight();
	rect.x = (index-this._scrollIdx) * (rect.width + this.spacing()); // - this._scrollX; // -0
	rect.y = 0; // Math.floor(index / maxCols) * rect.height - this._scrollY; // @ first row
	return rect;
};
$aaaa$.prototype.updateArrows=function(){
	this.rightArrowVisible = this._scrollIdx + this.maxCols() < this.maxItems();
	this.leftArrowVisible = this._scrollIdx !== 0;
};
$aaaa$.prototype._getActor=Window_BattlePlan.prototype._getActor;
$aaaa$.prototype._align_name=()=>'left';
$aaaa$.prototype._align_number=()=>'right';
$aaaa$.prototype.drawItem=function(index){
	const actor=this._getActor(index);
	if(!actor) return;
	
	const rect = this.itemRectForText(index);
	//this.changePaintOpacity(this.isCommandEnabled(index));
	
	const n=$gameTemp._pt_battleMembers_actor2idx.get(actor)+1;
	if(n){
		const txt2=$gameTemp._pt_battleMembers_actor2idx.size+' ';
		const w=this.textWidth(" -> "+txt2)>>1;
		const w1=rect.width-w;
		this.drawText(actor.name(), rect.x, rect.y, w1, this._align_name());
		this.changeTextColor("rgba(234,234,234,0.75)");
		this.drawText(" -> "+(n+' ').padStart(txt2.length,' '), rect.x+w1, rect.y-(this.textPadding()>>1), w, this._align_number());
		this.resetTextColor();
	}else this.drawText(actor.name(), rect.x, rect.y, rect.width, this._align_name());
};
$aaaa$.prototype.drawAllItems=function(){
	for(let i=this._scrollIdx,x=0,xs=this.maxCols();x!==xs;++i,++x) this.drawItem(i);
};
$aaaa$.prototype.select=function(index){ // TODO
	// scroll
	// update planWindows
	this._index = index;
	this._stayCount = 0;
	this.ensureCursorVisible();
	this.updateCursor();
	//this.callUpdateHelp();
};
$aaaa$.prototype.cursorDown=none;
$aaaa$.prototype.cursorUp=none;
$aaaa$.prototype.ensureCursorVisible=function(){
	if(!(this._index>=0)) return;
	const maxCols=this.maxCols() , lastScrollIdx=this._scrollIdx;
	const ende=lastScrollIdx+maxCols;
	if(this._index>=ende) this._scrollIdx=this._index-maxCols+1;
	else if(this._index<lastScrollIdx) this._scrollIdx=this._index;
	if(this._scrollIdx!==lastScrollIdx){
		this.refresh();
		//this.updateCursor();
		this.refresh_plans();
	}
};
$aaaa$.prototype.refresh_plans=function(){
	if(this._planWindows){
		/* // TODO: move windows to reduce the calculation
		const newEnde=this._scrollIdx+this._maxCols;
		if(lastScrollIdx<newEnde){ // TODO
		}else if(this._scrollIdx<ende){ // TODO
		}
		*/
		this._planWindows.forEach((p,i)=>{
			p._actor=this._getActor(this._scrollIdx+i);
			p.refresh();
		});
	}
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_BattlePlan_Actor

// - Window_BattlePlan_Plan1
function Window_BattlePlan_Plan1(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_BattlePlan_Plan1;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Window_Command.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.clearCommandList=none;
$aaaa$.prototype.currentSymbol=none;
$aaaa$.prototype.maxItems=function(){
	const p=this._actor&&this._actor._plan;
	return Math.max(p&&p.length||0,this._actorActTimes||0);
	//return (this._maxItem_1=Math.max(p&&p.length||0,this._actorActTimes||0)) +1; // TBD
};
$aaaa$.prototype.isCurrentItemEnabled=function(){ return true; };
$aaaa$.prototype.drawItem=function(index){
	if(!this._actor) return;
	const rect = this.itemRectForText(index) , align = this.itemTextAlign();
	const isNew=this._maxItem_1===index;
	this.changePaintOpacity(isNew||index<this._actorActTimes);
	if(!isNew) this.drawText( ((index+1)+' ').padStart(this._actTimesRefstr.length,' ') , rect.x, rect.y, this._actTimesWidth);
	const plan=this._actor.getPlan(index);
	const target=plan&&plan[2];
	const pad=target&&this._targetWidth3||0 , targetWidth=target&&this._targetWidth2||0;
	this.drawText(this._actor.getPlanObjName(index)||(isNew?$dataCustom.plan.new:$dataCustom.plan.empty),
		rect.x+this._actTimesWidth, 
		rect.y, 
		rect.width-this._actTimesWidth-pad, 
	align);
	if(target) this.drawText((''+target).padStart(2,' '),rect.x+rect.width-targetWidth,rect.y,targetWidth,'right');
};
$aaaa$.prototype.refreshActor=function(){
	if(this._lastActor!==this._actor){
		this._lastActor=this._actor;
		this._actorActTimes=this._actor&&this._actor.makeActionTimes()||0;
		this._actTimesRefstr=this._actorActTimes+' ';
		this._actTimesWidth=(this.textWidth(this._actTimesRefstr)>>1)|1;
		this._targetWidth1=(this.textWidth('0')>>1)|1;
		this._targetWidth2=this._targetWidth1*3;
		this._targetWidth3=this._targetWidth1*4;
	}
};
$rrrr$=$aaaa$.prototype.refresh;
$dddd$=$aaaa$.prototype.refresh=function f(){
	this.refreshActor();
	f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$dddd$=$rrrr$=$aaaa$=undef; // END Window_BattlePlan_Plan1

// - Window_BattlePlan_Topic
function Window_BattlePlan_Topic(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_BattlePlan_Topic;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Window_Command.prototype);
$aaaa$.prototype.constructor = $aaaa$;
/*
edit this action
insert new here
clear this action
delete this slot

atk
guard
spaceout
skill
item
	choose target
*/
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(x,y,kargs){
	kargs=kargs||{};
	this._planWindow=undefined;
	this._actor=undefined;
	this._pidx=0;
	f.ori.call(this,x,y,kargs);
	if(this._reservedWidth  === undefined) this._reservedWidth  = Grapihcs.boxWidth;
	if(this._reservedHeight === undefined) this._reservedHeight = Grapihcs.boxHeight;
	this._handlers.app=this.cmd_app.bind(this);
	this._handlers.edt=this.cmd_edt.bind(this);
	this._handlers.ins=this.cmd_ins.bind(this);
	this._handlers.clr=this.cmd_clr.bind(this);
	this._handlers.del=this.cmd_del.bind(this);
	
	this.addSubwindow_status.apply(this,this.subwindLoc_status());
	this.addSubwindow_type.apply(this,this.subwindLoc_type());
	this.addSubwindow_list.apply(this,this.subwindLoc_list());
	this.addSubwindow_target.apply(this,this.subwindLoc_target());
	this._syl=new Map(); // scroll y list
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.refresh;
$dddd$=$aaaa$.prototype.refresh=function f(){
	f.ori.call(this);
	this.refresh_status();
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.refresh_status=function(){
	this._statusWindow && this._statusWindow.setActor(this._actor);
};
$aaaa$.prototype.refresh_type=function(){
	this._typeWindow && this._typeWindow.refresh();
};
$aaaa$.prototype.refresh_list=function(arr){
	if(this._listWindow){
		this._listWindow._actor=this._actor;
		arr?this._listWindow.setData(arr):this._listWindow.refresh();
	}
};
$aaaa$.prototype.makeCommandList=function(){
	this.addCommand($dataCustom.plan.appendAfter,'app');
	this.addCommand($dataCustom.plan.editThis,'edt');
	this.addCommand($dataCustom.plan.insertHere,'ins');
	this.addCommand($dataCustom.plan.clearThis,'clr');
	this.addCommand($dataCustom.plan.deleteSlot,'del');
};
$aaaa$.prototype.cmd_app=function(){
	const tw=this._typeWindow;
	if(!tw) return this.activate();
	tw._type='app';
	tw.activate();
	tw.select(0);
	this._targetWindow.mode_enemy();
};
$aaaa$.prototype.cmd_edt=function(){
	const tw=this._typeWindow , lw=this._listWindow;
	if(!tw || !this._actor) return this.activate();
	tw._type='edt';
	tw.activate();
	const obj=this._actor.getPlanObj(this._pidx);
	if(!obj){
		tw.select(0);
		lw.setData();
		this._targetWindow.mode_enemy();
	}else{ switch(obj.itemType){
	default: {
		tw.select(0);
		this._targetWindow.mode_enemy();
	}break;
	case 's': {
		switch(obj.id){
		default:{
			tw.select(3);
			lw.setData(this._actor.skills());
			lw._index=lw._data.indexOf(obj);
			lw._scrollY=this._syl.get(3)|0;
			lw.ensureCursorVisible();
		}break;
		case 1:{
			tw.select(0);
			this._targetWindow.mode_enemy();
		}break;
		case 2:{
			tw.select(1);
		}break;
		case 3:{
			tw.select(2);
		}break;
		}
	}break;
	case 'i': {
		tw.select(4);
		lw.setData($gameParty.items());
		lw._index=lw._data.indexOf(obj);
		lw._scrollY=this._syl.get(4)|0;
		lw.ensureCursorVisible();
	}break;
	} }
	
};
$aaaa$.prototype.cmd_ins=function(){
	const tw=this._typeWindow;
	if(!tw) return this.activate();
	tw._type='ins';
	tw.activate();
	tw.select(0);
	this._targetWindow.mode_enemy();
};
$aaaa$.prototype.cmd_clr=function(){
	//$gameMessage.popup($dataCustom.plan.cleared,true); // not working: this window is not in sc._windowLayer
	const arr=this._actor._plan;
	if(arr && arr[this._pidx]){
		arr[this._pidx]=undefined;
		while(arr.length && !arr.back) arr.pop();
		if(this._planWindow) this._planWindow.refresh();
	}
	this.activate();
	this.callCancelHandler();
};
$aaaa$.prototype.cmd_del=function(){
	//$gameMessage.popup($dataCustom.plan.deleted,true); // not working: this window is not in sc._windowLayer
	const arr=this._actor._plan;
	if(arr){
		arr.splice(this._pidx,1);
		while(arr.length && !arr.back) arr.pop();
		if(this._planWindow) this._planWindow.refresh();
	}
	this.activate();
	//this.callCancelHandler();
};
$aaaa$.prototype._setPlan=function(item,target){
	if(!item || !this._actor) return;
	const pw=this._planWindow;
	switch(this._typeWindow._type){
	case 'app': {
		this._actor.appendPlan(this._pidx,item,target);
		const psy=pw._scrollY;
		pw.select(++this._pidx);
		if(psy===pw._scrollY){ for(let x=this._pidx,xs=~~(pw.maxPageItems()+psy/pw.itemHeight()+0.5);x!==xs;++x){
			pw.clearItem(x);
			pw.drawItem(x);
		} }else pw.drawAllItems();
	}break;
	case 'edt': {
		this._actor.setPlan(this._pidx,item,target);
		pw.clearItem(this._pidx);
		pw.drawItem(this._pidx);
	}break;
	case 'ins': {
		this._actor.insertPlan(this._pidx,item,target);
		for(let x=this._pidx,xs=~~(pw.maxPageItems()+pw._scrollY/pw.itemHeight()+0.5);x!==xs;++x){
			pw.clearItem(x);
			pw.drawItem(x);
		}
	}break;
	}
};
$aaaa$.prototype.subwindLoc_status=function(){
	// x,y,w,h
	return [this.width , this.y , this._reservedWidth-this.width , this.height];
};
$aaaa$.prototype.addSubwindow_status=function(x,y,width,height){
	const rtv=this._statusWindow=new Window_SkillStatus(x,y,width,height);
	rtv.setActor(this._actor);
	rtv.deactivate();
	//rtv.deselect();
	this.addChild(rtv);
	return rtv;
};
$aaaa$.prototype.subwindLoc_type=function(){
	// x,y,w
	return [0 , this.height, this._reservedWidth];
};
$aaaa$.prototype.update_type=function f(){ // bind
	const tw=this._typeWindow,lw=this._listWindow;
	const idx=tw._index;
	Window_HorzCommand.prototype.update.call(tw);
	const newidx=tw._index;
	if(newidx!==idx){ lw._scrollY=this._syl.get(newidx)|0; switch(newidx){
		default: {
			lw.setData(f._dummy_arr);
			this._targetWindow.mode_none();
		}break;
		case 0: { // attack
			lw.setData(f._dummy_arr);
			this._targetWindow.mode_enemy();
		}break;
		case 3: { // skill
			lw.setData(this._actor&&this._actor.skills()||f._dummy_arr);
			this._targetWindow.mode_none();
		}break;
		case 4: { // item
			lw.setData($gameParty.items());
			this._targetWindow.mode_none();
		}break;
	} }
};
$dddd$=$aaaa$.prototype.makeCommandList_type=function f(){
	for(let x=1;x!==4;++x) this.addCommand($dataSkills[x].name,f.tbl[x]);
	this.addCommand(TextManager.skill,'skill');
	this.addCommand(TextManager.item,'item');
};
$tttt$=$dddd$.tbl=[0,'attack','guard','spaceout'];
for(let x=1;x!==4;++x){
	const i=x;
$aaaa$.prototype['cmd_type_'+$tttt$[x]]=function(){ if(!this._actor) return;
	const obj=$dataSkills[i];
	const tw=this._typeWindow;
	if(this._targetWindow.mode_viaObj(obj)){
		this._targetWindow.select(0);
		this._targetWindow._lastWindow=tw;
		this._targetWindow.activate();
	}else{
		this._setPlan(obj,0);
		tw.activate(); // TODO: atk target
	}
};
}
$aaaa$.prototype.cmd_type_skill=$aaaa$.prototype.cmd_type_item=function(){
	const lw=this._listWindow;
	lw._index=lw._data&&lw._data.indexOf(this._actor.getPlanObj(this._pidx));
	if(lw._index>=0) lw.reselect();
	else lw.select(0);
	this._targetWindow.mode_viaObj(lw.currItem());
	lw.activate();
};
$dddd$=$aaaa$.prototype.addSubwindow_type=function f(x,y,width){
	const rtv=this._typeWindow=new Window_HorzCommand(x,y,{
		_maxCols:5,
		_windowWidth:width,
		makeCommandList:this.makeCommandList_type,
		update:this.update_type.bind(this),
		updateArrows:none,
	});
	rtv.deactivate();
	rtv.deselect();
	this.addChild(rtv);
	for(let x=1,arr=f.tbl;x!==4;++x) rtv._handlers[arr[x]]=this['cmd_type_'+arr[x]].bind(this);
	rtv._handlers.skill = this.cmd_type_skill .bind(this);
	rtv._handlers.item  = this.cmd_type_item  .bind(this);
	rtv._handlers.cancel=this.cancel_type.bind(this);
	makeDummyWindowProto(rtv,true,true);
	return rtv;
};
$dddd$.tbl=$tttt$;
$tttt$=undefined;
$aaaa$.prototype.cancel_type=function(){
	this._listWindow.deselect();
	const tw=this._typeWindow;
	tw.deactivate();
	tw.deselect();
	this.activate();
};
$aaaa$.prototype.subwindLoc_list=function(){
	// x,y,w,h
	const strty=this._typeWindow.y+this._typeWindow.height;
	return [0 , strty , this._reservedWidth-this.width , this._reservedHeight-strty , 2];
};
$aaaa$.prototype.addSubwindow_list=function(x,y,width,height,displayActorCnt){
	const help=new Window_Help(2);
	{ help.fontSize=0; const sz=help.standardFontSize();
	help.fontSize=(sz>>1)+(sz>>3);
	help.height=help.fittingHeight(3); // -!($gameSystem&&$gameSystem._usr._showFullEquipInfo)
	}
	help.width=width;
	help.y=y+height-help.height;
	this.addChild(help);
	const rtv=this._listWindow=new Window_BattlePlan_List(x,y,{
		_maxCols:displayActorCnt||2,
		_windowWidth:width,
		_windowHeight:height-help.height,
	});
	rtv._helpWindow=help;
	rtv.deactivate();
	rtv.deselect();
	this.addChild(rtv);
	rtv._handlers.ok=this.ok_list.bind(this);
	rtv._handlers.cancel=this.cancel_list.bind(this);
	return rtv;
};
$aaaa$.prototype.ok_list=function(){
	const lw=this._listWindow,tw=this._targetWindow;
	const item=lw.currItem();
	if(this._targetWindow.mode_viaObj(item)){
		const a=this._actor;
		tw._index = this._typeWindow._type==='edt' && a.getPlanObj(this._pidx)===item && a.getPlan(this._pidx)[2]-1;
		if(!(tw._index>=0)) tw._index=0;
		tw._lastWindow=lw;
		tw.activate();
	}else{
		this._setPlan(item,0);
		lw.activate();
	}
};
$aaaa$.prototype.cancel_list=function(){
	const tw=this._typeWindow,lw=this._listWindow;
	const scrolly=lw._scrollY;
	lw.deselect();
	lw._scrollY=scrolly;
	Window_Base.prototype.deactivate.call(lw);
	this._syl.set(tw._index,scrolly);
	tw.activate();
};
$aaaa$.prototype.subwindLoc_target=function(){
	// x,y,w,h
	const strty=this._typeWindow.y+this._typeWindow.height;
	return [this._reservedWidth-this.width , strty , this.width , this._reservedHeight-strty , 2];
};
$aaaa$.prototype.addSubwindow_target=function(x,y,width,height){
	const rtv=this._targetWindow=new Window_BattlePlan_Target(x,y,{
		_maxCols:undefined,
		_windowWidth:width,
		_windowHeight:height,
	});
	rtv.deactivate();
	rtv.deselect();
	this.addChild(rtv);
	rtv._handlers.ok=this.ok_target.bind(this);
	rtv._handlers.cancel=this.cancel_target.bind(this);
	return rtv;
};
$aaaa$.prototype.ok_target=function(){
	switch(this._typeWindow._index){
	case 0: { // attack
		this._setPlan($dataSkills[1],this._targetWindow._index+1);
	}break;
	case 3:
	case 4: {
		this._setPlan(this._listWindow.currItem(),this._targetWindow._index+1);
	}break;
	}
	this._targetWindow.activate();
};
$aaaa$.prototype.cancel_target=function(){
	this._targetWindow.deactivate();
	this._targetWindow.deselect();
	this._targetWindow._lastWindow.activate();
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_BattlePlan_Topic

// - Window_BattlePlan_List
function Window_BattlePlan_List(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_BattlePlan_List;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Window_Command.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.clearCommandList=none;
$aaaa$.prototype.currentSymbol=none;
$aaaa$.prototype.maxItems=function(){
	return this._data&&this._data.length||0;
};
$aaaa$.prototype.isCurrentItemEnabled=function(){ return true; };
$aaaa$.prototype.currItem=function(){
	return this._data&&this._data[this._index];
};
$dddd$=$aaaa$.prototype.setData=function f(arr){
	if(this._dataRef!==arr){
		if((this._dataRef=arr) && arr.constructor===Array){
			this._data=arr.filter(f.forEach);
			switch(this._data[0] && this._data[0].itemType){
			case 's': {
				const w=~~(this.textWidth('0'))+1;
				this._reservedWidth1=w*3;
				this._reservedWidth3=w*7;
				this._reservedWidth5=w*11;
			}break;
			case 'i': {
				this._reservedWidth1=this.textWidth('0');
				this._reservedWidth3=this._reservedWidth1*3;
				this._reservedWidth5=this._reservedWidth1*5;
			}break;
			}
		}
		this.refresh();
		return true;
	}
};
$dddd$.forEach=x=>(x.occasion&2)===0;
$rrrr$=$aaaa$.prototype.update;
$dddd$=$aaaa$.prototype.update=function f(){
	f.ori.call(this);
	const item=this.currItem();
	this._helpWindow.setText(item&&item.description||f.EMPTY);
}; $dddd$.ori=$rrrr$;
$dddd$.EMPTY='';
$aaaa$.prototype.drawItem=function(index){
	const item=this._data && this._data[index];
	if(item){
		const rect = this.itemRectForText(index) , align = this.itemTextAlign();
		this.changePaintOpacity(true);
	        this.drawIcon(item.iconIndex, rect.x + 2, rect.y + 2);
		const iconBoxWidth = Window_Base._iconWidth + 4; // ref: Window_Base.prototype.drawItemName
		this.resetTextColor();
		this.drawText(item.name, rect.x + iconBoxWidth, rect.y, rect.width - this._reservedWidth5 - iconBoxWidth, align);
		switch(item.itemType){
		case 's': {
			const ende = rect.x + rect.width , actor = this._actor , warr=[this._reservedWidth5,this._reservedWidth3,this._reservedWidth1];
			let tmp;
			if(tmp=actor.skillTpCost(item)){
				this.changeTextColor(this.tpCostColor());
				this.drawText(tmp, ende - warr.pop(), rect.y, this._reservedWidth1, 'right');
			}
			if(tmp=actor.skillMpCost(item)){
				this.changeTextColor(this.mpCostColor());
				this.drawText(tmp, ende - warr.pop(), rect.y, this._reservedWidth1, 'right');
			}
			if(tmp=actor.skillHpCost(item)){
				this.changeTextColor(this.hpCostColor());
				this.drawText(tmp, ende - warr.pop(), rect.y, this._reservedWidth1, 'right');
			}
		}break;
		case 'i': {
			this.drawText(': ', rect.x + rect.width - this._reservedWidth5, rect.y, this._reservedWidth5, 'left');
			this.drawText($gameParty._items[item.id]||0, rect.x + rect.width - this._reservedWidth3, rect.y, this._reservedWidth3, 'right');
		}break;
		}
	}
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_BattlePlan_List

// - Window_BattlePlan_Target
function Window_BattlePlan_Target(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_BattlePlan_Target;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Window_Command.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.clearCommandList=none;
$aaaa$.prototype.currentSymbol=none;
$aaaa$.prototype.maxItems=function(){
	switch(this._mode){
	default: return 0;
	case 'a': return Math.max($gameParty.members().length,64);
	case 'e': return Math.max($gameTroop._enemies.length,64);
	}
};
$aaaa$.prototype.isCurrentItemEnabled=function(){ return true; };
$aaaa$.prototype.drawItem=function(index){
	const rect = this.itemRectForText(index) , align = this.itemTextAlign();
	this.changePaintOpacity(true);
	this.drawText(($dataCustom.plan.target[this._mode]||'')+(index+1) , rect.x, rect.y, rect.width, align);
};
$aaaa$.prototype.mode_none=function(){
	this._mode='';
	this.deselect();
	this.refresh();
};
$aaaa$.prototype.mode_enemy=function(){
	this._mode='e';
	this.refresh();
};
$aaaa$.prototype.mode_ally=function(){
	this._mode='a';
	this.refresh();
};
$aaaa$.prototype.mode_viaObj=function(obj){
	switch(obj&&obj.scope){
	default: {
		this.mode_none();
	}break;
	case 1: {
		this.mode_enemy();
	}break;
	case 7:
	case 9: {
		this.mode_ally();
	}break;
	}
	return this._mode;
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_BattlePlan_Target


