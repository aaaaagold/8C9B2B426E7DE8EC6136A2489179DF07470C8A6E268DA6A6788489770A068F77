"use strict";
// CustomMenu2-store

// - Window_StoreList
function Window_StoreList(){
	this.initialize.apply(this, arguments);
};
$aaaa$=Window_StoreList;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Window_ItemList.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype._getItemDataArr=x=>{
	let rtv=null;
	switch(x.t){
	case 's': rtv=$dataSkills;  break;
	case 'i': rtv=$dataItems;   break;
	case 'w': rtv=$dataWeapons; break;
	case 'a': rtv=$dataArmors;  break;
	}
	return rtv;
};
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(x,y,width,height,store){
	f.ori.call(this,x,y,width,height);
	this._store=store;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.isEnabled=()=>true;
$dddd$=$aaaa$.prototype.makeItemList=function f(){
	this._data = this._store.map(f.map,this);
	if(this.includes(null)||this._data.length===0) this._data.push(null);
};
$dddd$.map=function(x){
	const c=this._getItemDataArr(x);
	return c&&({c:c,i:x.i,a:x.a,d:c[x.i]});
};
$rrrr$=$aaaa$.prototype.drawItemName;
$dddd$=$aaaa$.prototype.drawItemName=function f(item, x, y, width){
	return f.ori.call(this,item&&item.d,x,y,width);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.drawItemNumber=function(item, x, y, width) {
	if (this.needsNumber()) {
		this.drawText(':', x, y, width - this.textWidth('000'), 'right');
		this.drawText(item.a, x, y, width, 'right');
	}
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_StoreList

// - Scene_ExtStore
function Scene_ExtStore(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Scene_ExtStore;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Scene_Item.prototype); //Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
Window_ItemList.prototype.setCategory.tbl.add($aaaa$);
$rrrr$=$aaaa$.prototype.popScene;
$dddd$=$aaaa$.prototype.popScene=function f(){
	f.ori.call(this);
	$gameMap.requestRefresh();
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.isItemEnabled=function(item){
	//return !this._disables.has(item.c?item:item.d); // a set of dataitems
	return !this._disables.has(item); // only disable mvIn
};
$aaaa$.prototype.create = function() {
	Scene_ItemBase.prototype.create.call(this);
	this.createHelpWindow();
	this.createCategoryWindow();
	this.createItemWindow();
	//this.createActorWindow();
	this.createStoreWindow();
	this.createCapacityWindow();
	this.createHelp2();
};
$aaaa$.prototype.createStoreWindow=function(){
	let tmp;
	this._store=$gameParty.extStore_get(this._storeId=$gameTemp.storeId||0);
	this._disables=new Set($gameTemp.disables); $gameTemp.disables=undefined;
	this._title=$gameTemp.storeTitle;
	{
		const ref=this._itemWindow,ref2=this._categoryWindow,ow=ref.width;
		ref2.width=ref.width>>=1;
		tmp=this._storeWindow=new Window_StoreList(ref.x+ref.width, ref2.y, ow-ref.width, ref.height+ref2.height , this._store);
		tmp._maxCols = ref._maxCols = 1;
		ref.isEnabled=tmp.isEnabled=this.isItemEnabled.bind(this);
		ref.cursorRight=this.onItmCurRgh.bind(this);
		ref2.select(0);
		ref2.refresh();
		ref.setHandler('cancel', this.onItemCancel.bind(this));
		this.windowActivate(ref);
	}
	const sw=tmp;
	{
		const ref=this._lastWindow=this._categoryWindow;
		ref.onTouch=this.onCatTouch.bind(this);
		ref.cursorDown=this.onCatCurDwn.bind(this);
		this.windowActivate(ref);
	}
	sw.setHelpWindow(this._helpWindow);
	sw.setHandler('ok',     this.onStoreOk.bind(this));
	sw.setHandler('cancel', this.onStoreCancel.bind(this));
	this.addWindow(this._storeWindow);
	sw._lastIdx=0;
	sw.cursorLeft=this.onStrCurLft.bind(this);
//	this._categoryWindow.setItemWindow(this._itemWindow);
	//this._categoryWindow._storeWindow=sw;
	sw.refresh();
	this.windowActivate(sw);
};
$rrrr$=$aaaa$.prototype.onCategoryOk;
$dddd$=$aaaa$.prototype.onCategoryOk=function f(){
	f.ori.call(this);
	this.updateHelp2(this._itemWindow);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.onCatCurDwn=function(){
	Input.update();
	this.updateHelp2(this._storeWindow);
	this._lastWindow=this._categoryWindow;
	this._categoryWindow.deactivate();
	this._storeWindow._index=this._storeWindow._lastIdx|0; //this._storeWindow.selectLast();
	this._storeWindow.activate();
};
$aaaa$.prototype.onCatTouch=function(triggered){
	return this._categoryWindow._onTouch_iw(triggered,[this._itemWindow,this._storeWindow]);
};
$aaaa$.prototype.onItmCurRgh=function(){
	this.updateHelp2(this._storeWindow);
	this._lastWindow=this._itemWindow;
	{
		const cat=this._categoryWindow;
		if(cat._lastIdxs) cat._lastIdxs[cat._index]=this._itemWindow._index;
	}
	this._itemWindow.deactivate();
	this._storeWindow._index=this._storeWindow._lastIdx|0; //this._storeWindow.selectLast();
	this._storeWindow.activate();
};
$aaaa$.prototype.onStrCurLft=function(){
	this.updateHelp2(this._itemWindow);
	this._storeWindow._lastIdx=this._storeWindow._index;
	this._storeWindow._lastScy=this._storeWindow._scrollY;
	//this._storeWindow.deselect();
	this._storeWindow.deactivate();
	this._storeWindow._scrollY=this._storeWindow._lastScy;
	this._storeWindow.refresh();
	{
		const cat=this._categoryWindow;
		if(cat._lastIdxs) this._itemWindow._index=cat._lastIdxs[cat._index];
		this._itemWindow.activate();
		this._itemWindow.selectLast();
	}
};
$aaaa$.prototype.onItemOk=function(){
	if($gameParty.extStore_mvIn1(this._storeId,this.item())){
		this.updateCapacity();
		this._storeWindow.refresh();
		if($gameParty.numItems(this.item())===0) this._itemWindow.refresh();
		else this._itemWindow.redrawCurrentItem();
	}else SoundManager.playBuzzer();
	this._itemWindow.active=true;
};
$aaaa$.prototype.onItemCancel=function f(){
	Scene_Item.prototype.onItemCancel.call(this);
	this.updateHelp2(this._categoryWindow);
};
$aaaa$.prototype._windowActivate=function(scene){
	if(scene._storeWindow!==this) scene._lastWindow=this;
	this.activate_o();
};
$aaaa$.prototype.windowActivate=function(ref){
	ref.activate_o=ref.activate;
	ref.activate=this._windowActivate.bind(ref,this);
};
$aaaa$.prototype.onStoreOk=function(){
	const item=this._storeWindow.item();
	if(item){
		$gameParty.extStore_mvOut1(this._storeId,item.d);
		this.updateCapacity();
		this._storeWindow.refresh();
		this._itemWindow.refresh();
	}
	this._storeWindow.active=true;
};
$aaaa$.prototype.onStoreCancel=function(){
	this._storeWindow._lastIdx=this._storeWindow._index;
	this._storeWindow._lastScy=this._storeWindow._scrollY;
	this._storeWindow.deselect();
	if(this._lastWindow){
		this.updateHelp2();
		this._lastWindow.activate();
		this._lastWindow=undefined;
	}else{
		this._storeWindow.deselect();
		this._categoryWindow.activate();
		//this._categoryWindow.selectLast();
		//this.pop();
	}
};
$aaaa$.prototype.createCapacityWindow=function(){
	this.addWindow(this._capacityWindow = new Window_Help(1));
	const c=this._capacityWindow,s=this._storeWindow;
	c.width=s.width;
	c.x=s.x;
	s.height-=c.height;
	c.y=s.y;
	s.y+=c.height;
	this.updateCapacity();
};
$aaaa$.prototype.updateCapacity=function(){
	const c=this._capacityWindow;
	const cw=c.contentsWidth(),cw_4=cw>>2;
	c.contents.clear();
	c.drawText(this._title,0,0,cw_4,'left');
	c.drawText("now: "+$gameParty.extStore_searchTbl_get(this._storeId).cnt , (cw-cw_4)>>1,0,cw_4,'left');
	const cap=$gameParty.extStore_getMax(this._storeId);
	c.drawText("max: "+(cap===undefined?"inf":cap) , cw-cw_4,0,cw_4,'right');
};
$aaaa$.prototype.createHelp2=function(){
	this.addWindow(this._help2 = new Window_Help(1));
	this._helpMsgMap=new Map([ // current(or will be focus on) window // msgtxt
		[this._categoryWindow,"可按\\key'\"確認\"'選擇左方列表內的道具，或按\\key'\"↓\"'選擇右方列表內的道具"],
		[this._itemWindow,"可按\\key'\"確認\"'放入道具，或按\\key'\"→\"'選擇右方列表內的道具"],
		[this._storeWindow,"可按\\key'\"取消\"'回到先前的選項，或\\key'\"←\"'選擇目前分類的背包內道具"],
	]);
	const hh=this._help2.height;
	this._help2.y=this._itemWindow.y+this._itemWindow.height-hh;
	this._itemWindow.height-=hh;
	this._storeWindow.height-=hh;
	this.updateHelp2(this._categoryWindow);
};
$aaaa$.prototype.updateHelp2=function(w){
	this._help2.setText(this._helpMsgMap.get(w||this._lastWindow)||"");
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_ExtStore


