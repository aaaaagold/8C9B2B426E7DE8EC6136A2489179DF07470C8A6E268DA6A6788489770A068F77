"use strict";
// after rpg_*

if(!window.objs) window.objs={};
if(!objs.confs) objs.confs={};

// core

// - Input
Input.keyMapper[35]="end";
Input.keyMapper[36]="home";
Input.keyMapper[65]="left";
Input.keyMapper[68]="right";
Input.keyMapper[83]="down";
Input.keyMapper[87]="up";
$r$=Input.clear;
$d$=Input.clear=function f(keyOnly){
	//debug.log('Input.clear');
	if(!keyOnly) TouchInput.clear();
	if(this.kstat){ this.kstat.length=0; this.kstat.length=256; }
	else this.kstat=[];
	return f.ori.call(this);
}; $d$.ori=$r$;
Input._skip=0;
Input.skip=function(n){
	if(n>0) this._skip+=n;
	return this._skip;
};
Input.doSkip=function(){ if(this._skip){ --this._skip; return true; } };
Input._onKeyDown=function(event){
	if(this.doSkip()) return;
	this.kstat[event.keyCode]=true;
	if(!document.activeElement.useDefault&&this._shouldPreventDefault(event.keyCode)){
		event.preventDefault();
	}
	let buttonName = this.keyMapper[event.keyCode]||event.keyCode;
	if (ResourceHandler.exists() && buttonName === 'ok') {
		ResourceHandler.retry();
	} else if (buttonName) {
		this._currentState[buttonName] = true;
	}
};
Input.secret=[
	"0xF5CA38F748A1D6EAF726B8A42FB575C3C71F1864A8143301782DE13DA2D9202B",
	"0xF5CA38F748A1D6EAF726B8A42FB575C3C71F1864A8143301782DE13DA2D9202B",
	"0xAEA92132C4CBEB263E6AC2BF6C183B5D81737F179F21EFDC5863739672F0F470",
	"0xAEA92132C4CBEB263E6AC2BF6C183B5D81737F179F21EFDC5863739672F0F470",
	"0xD59ECED1DED07F84C145592F65BDF854358E009C5CD705F5215BF18697FED103",
	"0xD59ECED1DED07F84C145592F65BDF854358E009C5CD705F5215BF18697FED103",
	"0x7A61B53701BEFDAE0EEEFFAECC73F14E20B537BB0F8B91AD7C2936DC63562B25",
	"0x0B918943DF0962BC7A1824C0555A389347B4FEBDC7CF9D1254406D80CE44E3F9",
	"0x7A61B53701BEFDAE0EEEFFAECC73F14E20B537BB0F8B91AD7C2936DC63562B25",
	"0x0B918943DF0962BC7A1824C0555A389347B4FEBDC7CF9D1254406D80CE44E3F9",
	"0x3ADA92F28B4CEDA38562EBF047C6FF05400D4C572352A1142EEDFEF67D21E662",
	"0x108C995B953C8A35561103E2014CF828EB654A99E310F87FAB94C2F4B7D2A04F",
	"0x3FDBA35F04DC8C462986C992BCF875546257113072A909C162F7E470E581E278",
];
Input.secret_it=0;
Input.secret_input=[];
$r$=Input._onKeyUp;
$d$=Input._onKeyUp=function f(e){
	let h=sha256(''+e.keyCode);
	if(h===this.secret[this.secret_input.length]){
		this.secret_input.push(e.keyCode);
	}else this.secret_input.length=(this.secret[0]===h)+(this.secret_input.length===2);
	if(this.secret_input.length===Input.secret.length && Scene_DebugMenu2){
		AudioManager.playMe({name: "Victory1", volume: 90, pitch: 150, pan: 0});
		if(SceneManager._scene!==Scene_Map && SceneManager._stack.indexOf(Scene_Map)===-1){
			$gameMessage.popup("Visit It Mode",1);
			window['/tmp/'].V_I_M=JSON.stringify(this.secret_input);
		}else Scene_DebugMenu2.prototype.createOptionsWindow.debugPack(1);
		this.secret_input.length=0;
	}
	this.kstat[e.keyCode]=false;
	return f.ori.call(this,e);
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;
// - TouchInput
$aaaa$=TouchInput;
$aaaa$.calDeltaToPlayer=function(){ // return true if cond. not sufficient
	if(!$gamePlayer) return true;
	let tm=SceneManager.getTilemap(); if(!tm) return true;
	let rf=tm.player._realFrame;
	this._dx=$gamePlayer.scrolledX_tw()+(rf.width>>1)-this.x;
	this._dy=$gamePlayer.scrolledY_th()+(rf.height>>1)-this.y;
};
$r$=$aaaa$.clear;
$d$=$aaaa$.clear=function f(){
	this._dx=undefined;
	this._dy=undefined;
	f.ori.call(this);
}; $d$.ori=$r$;
$aaaa$._setupEventHandlers=function(){
	const isSupportPassive = Utils.isSupportPassiveEvent();
	const opt=isSupportPassive ? {passive: false} : false;
	document.addEventListener('mousedown', this._onMouseDown.bind(this));
	document.addEventListener('mousemove', this._onMouseMove.bind(this));
	document.addEventListener('mouseup', this._onMouseUp.bind(this));
	document.addEventListener('wheel', this._onWheel.bind(this), opt );
	document.addEventListener('touchstart', this._onTouchStart.bind(this), opt );
	document.addEventListener('touchmove', this._onTouchMove.bind(this), opt );
	document.addEventListener('touchend', this._onTouchEnd.bind(this));
	document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
	document.addEventListener('pointerdown', this._onPointerDown.bind(this));
};
$aaaa$._onWheel = function(event) {
	this._events.wheelX += event.deltaX;
	this._events.wheelY += event.deltaY;
	if(!document.activeElement.canScroll&&!document.activeElement.useDefault) event.preventDefault();
};
$aaaa$._onTouchStart = function(event) {
	let L=event.changedTouches.length,cancel=false,cx=0,cy=0;
	for (let i=0;i<L;++i) {
		let touch=event.changedTouches[i];
		let x=Graphics.pageToCanvasX(touch.pageX);
		let y=Graphics.pageToCanvasY(touch.pageY);
		if(event.touches.length>=2){
			cancel|=true;
			cx+=x; cy+=y;
		}else if(Graphics.isInsideCanvas(x, y)) {
			this._screenPressed = true;
			this._pressedTime = 0;
			this._onTrigger(x, y);
			event.preventDefault();
		}
	}
	if(cancel){
		this._screenPressed = true;
		this._pressedTime = 0;
		cx/=L; cy/=L;
		this._onCancel(cx,cy);
		event.preventDefault();
	}
	if (window.cordova || window.navigator.standalone) {
		event.preventDefault();
	}
};
$k$='_onTouchMove';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function(event) {
	let arr=event.changedTouches,avgx=0,avgy=0;
	for(let i=0;i!==arr.length;++i) {
		let touch = arr[i];
		let x = Graphics.pageToCanvasX(touch.pageX);
		let y = Graphics.pageToCanvasY(touch.pageY);
		avgx+=x;
		avgy+=y;
		this._onMove(x, y);
	}
	avgx/=arr.length;
	avgy/=arr.length;
	if(arr.length===1 && this._lastAvgX!==undefined && this._lastAvgY!==undefined){
		this._events.wheelX -= avgx-this._lastAvgX;
		this._events.wheelY -= avgy-this._lastAvgY;
	}
	this._lastAvgX=avgx;
	this._lastAvgY=avgy;
}; $d$.ori=$r$;
$k$='_onTouchEnd';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(evt){
	f.ori.call(this,evt);
	this._lastAvgX=undef;
	this._lastAvgY=undef;
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;


// sprite

// - Sprite_Base
$aaaa$=Sprite_Base;
$pppp$=$aaaa$.prototype;
$d$=$pppp$.updateAnimationSprites=function f(){
	if(this._animationSprites.length){
		const sprites = this._animationSprites; // 原版是在clone三小
		(this._animationSprites = f.tmp).length=0;
		for(let i=0;i!==sprites.length;++i){
			let sprite = sprites[i];
			if(sprite.isPlaying()) this._animationSprites.push(sprite);
			else sprite.remove();
		}
		(f.tmp = sprites).length=0;
	}
};
$d$.tmp=[];
$pppp$=$aaaa$=undef;
// - Sprite_Character
$aaaa$=Sprite_Character;
$pppp$=$aaaa$.prototype;
$pppp$.getRef=function(){
	return this._character;
};
// - - merge multi-bitmap to one
$pppp$._refresh_updateCf_forEach=(v,k)=>{
	k._character.refresh();
	if(k.isImageChanged()){
		k.updateBitmap_setInfo();
		k.updateTileFrame_frameOri();
	}
};
$pppp$._refresh_updateExtFrm=(self,sp)=>{
	sp._cfMap.forEach(self._refresh_updateCf_forEach);
	sp._cfMap.set(self, self._frameOri);
};
$pppp$._refresh_updateCf_frmOriOk=function(){
	return this._frameOri && this._frameOri.width && !isNaN(this._frameOri.x);
};
$pppp$._refresh_updateCf_child=function(parentId){
	let tevt=$gameMap._events[parentId];
	if(tevt){
		let sp=tevt._tmp._sprite;
		if(sp){
			if(this._refresh_updateCf_frmOriOk()){
				this._skipRender=true;
				this._refresh_updateExtFrm(this,sp);
				sp._extendFrame_recal();
			}
		}
	}
};
$pppp$._refresh_updateCf_parent=function f(sameStatEvts){
	if(!this._refresh_updateCf_frmOriOk()) return;
	this._scnt=sameStatEvts.length+1;
	this._refresh_updateExtFrm(this,this);
	this._extendFrame_recal();
};
$r$=$pppp$._refresh;
$d$=$pppp$._refresh=function f(){
	f.ori.call(this);
	if(this._tileId>0){ let c=this._character; if(c && $gameMap){
		if(c.parentId) this._refresh_updateCf_child(c.parentId);
		else if(c._sameStatEvts) this._refresh_updateCf_parent(c._sameStatEvts);
	} }
}; $d$.ori=$r$;
$pppp$._extendFrame_recal=function(){
	let cfMap=this._cfMap,cf=this._cf,tmp;
	//this._character.imgModded=true; // no needed
	cf.yl=cf.xl=Infinity;
	cf.yh=cf.xh=0;
	cfMap.forEach(v=>{
		if(v.x<cf.xl) cf.xl=v.x;
		if(v.y<cf.yl) cf.yl=v.y;
		let tmp;
		tmp=v.x+v.width;
		if(cf.xh<tmp) cf.xh=tmp;
		tmp=v.y+v.height;
		if(cf.yh<tmp) cf.yh=tmp;
		cf.width=cf.xh-cf.xl;
		cf.height=cf.yh-cf.yl;
	});
	if(cfMap.size===this._scnt){
		tmp=this._frameOri;
		this._refreshFrame=true;
		let orix=(tmp.width>>1)+tmp.x;
		this.anchor.x=(orix-cf.xl)/(cf.width);
	}
};
$pppp$._extendFrame=function(sprite,fr){ // not used
	let cfMap=this._cfMap,cf=this._cf,tmp;
	//if((tmp=cfMap.get(sprite))&&tmp.x===fr.x&&tmp.y===fr.y&&tmp.width===fr.width&&tmp.height===fr.height) return; // TODO: why lead to err
	cfMap.set(sprite,fr);
	this._extendFrame_recal();
};	
$pppp$.setText=function(txt){
	if(this._txt===txt) return;
	this._txt=txt;
	let tmp=this._txtSprite;
	const s=this.scale;
	if(!tmp){
		this.addChild( this._txtSprite = tmp = new Window_TextOnly(0,0,1,1) );
		tmp.scale.x=1/s.x;
		tmp.scale.y=1/s.y;
	}
	if(!txt) return tmp.clearContents();
	const detail={} , txtp = tmp.textPadding();
	tmp.drawTextEx(txt,0,0,undefined,undefined,detail);
	const txth =  txtp     + detail.stat.y+detail.stat.height;
	const txtw = (txtp<<1) + detail.stat.maxX; // -x === -0
	tmp.width=txtw;
	tmp.height=txth;
	tmp.clearContents();
	tmp.drawTextEx(txt,txtp,0);
	//if(objs.isDev) console.log(tmp.children[0]._texture._frame);
};
$k$='setCharacter';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(chr){
	chr.setSprite(this);
	f.ori.call(this,chr);
	this._scnt=~0;
	this._cf={};
	this._cfMap=new Map();
	this._skipRender=undefined;
	this._old_anchor_y=undefined;
	this._balloonSprites=new Set();
	if(chr&&chr.constructor===Game_Event){
		// text
		this.setText(chr.getText());
		// parentId in meta
		let pid=chr.parentId||Number(chr.getData().meta.parentId);
		if(pid){
			chr.parentId=pid;
			let p=$gameMap._events[chr.parentId];
			if(p){
				if(!p._sameStatEvts) p._sameStatEvts=[];
				let id=""+chr._eventId;
				if(p._sameStatEvts.indexOf(id)===-1) p._sameStatEvts.push(id);
			}
		}
	}
}; $d$.ori=$r$;
$pppp$.isInView_inScreen=function(){
	// this.x+24+(1-this.anchor.x)*this._frame.width                >=0 && this.x+24-this.anchor.x*this._frame.width < Graphics._boxWidth
	// this.x-this.anchor.x*this._frame.width+24 +this._frame.width >=0 && this.x-this.anchor.x*this._frame.width+24 < Graphics._boxWidth
	// -this._frame.width<= this.x-this.anchor.x*this._frame.width+24 < Graphics._boxWidth
/*	const frm=this._frame;
	if(!frm.width||!frm.height) return false;
	const t=Game_Map.e>>1;
	const w=Graphics._boxWidth+
	const x=this.x-this.anchor.x*this._frame.width+t;
	const y=this.y-this.anchor.y*this._frame.height+t;
	return parseInt(/)===1 &&
		parseInt(/)===1
// */
	return (~~((this.x+Graphics._boxWidth_pad6)/Graphics._boxWidth_pad4))===1 && (~~((this.y+Graphics._boxHeight_pad5)/Graphics._boxHeight_pad4))===1;
};
$pppp$.isInView=function(){ // can view?
	if($gameScreen.limitedView && !this._character._light){
		const p=this.parent.player; if(!p) return false;
		const frm=this._frame,s=this.scale,a=this.anchor;
		const ws=frm.width*s.x,hs=frm.height*s.y;
		let r=p._character.viewRadius_buf;
		const L=this.x-r-ws*a.x;
		const U=this.y-r-hs*a.y;
		r<<=1;
		const R=(ws+r)+L;
		const D=(hs+r)+U;
		return (L<=p.x&&p.x<=R&&U<=p.y&&p.y<=D);
	}else if(this._skipRender) return false;
	else return this.isInView_inScreen();
};
$r$=$pppp$.update;		
$d$=$pppp$.update=function f(forced){
	if(forced) return f.ori.call(this);
	let c=this._character;
	if(!c) return f.ori.call(this);
	let playing=(c.isAnimationPlaying()||c.isBalloonPlaying());
	if(!playing){
		if(c._erased){
			return this.remove();
		}else if(this.isInView()===false){
			return this.updatePosition(); // give up update if too far
		}
	}
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.updateBitmap_forced=function(){
	this._character._imgModded=true;
	this.updateBitmap();
};
$pppp$.updateBitmap_setInfo=function(){
	this._tilesetId = $gameMap.tilesetId();
	this._tileId = this._character.tileId();
	this._characterName = this._character.characterName();
	this._characterIndex = this._character.characterIndex();
};
$pppp$.updateBitmap=function(){ // rewrite
	if(this.isImageChanged()){
		this.updateBitmap_setInfo();
		if(this._cfMap.size===this._scnt){ this._cfMap.forEach((v,k)=>{
			if(this===k) return;
			k.updateBitmap_setInfo();
			k.updateFrame();
		}); }
		if(0<this._tileId) this.setTileBitmap();
		else this.setCharacterBitmap();
		this._character.imgModded=false;
		this.setText(this._character.getText());
	}
};
$pppp$.isImageChanged=function(){ // rewrite
	return this._character.imgModded || this._tilesetId !== $gameMap.tilesetId();
};
$pppp$.setTileBitmap=function f(){
	this.bitmap = this.tilesetBitmap(this._tileId,this._setBitmap_args());
};
$pppp$.setCharacterBitmap=function(){ // rewrite: edit img according to meta
	this.bitmap = ImageManager.loadCharacter(this._characterName,undefined,this._setBitmap_args());
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};
$pppp$.updateFrame = function() {
	if(this._tileId > 0) this.updateTileFrame();
	else this.updateCharacterFrame();
	this.updateTextFrame();
};
$pppp$.updateTileFrame_frameOri=function(){
	let pw = ~~this.patternWidth();
	let ph = ~~this.patternHeight();
	let sx = ( ((this._tileId>>4)&8) + (this._tileId&7) ) * pw;
	let sy = ( (this._tileId>>3)&15 ) * ph;
	if(!this._frameOri) this._frameOri={};
	this._frameOri.x=sx;
	this._frameOri.y=sy;
	this._frameOri.width  =pw;
	this._frameOri.height =ph;
};
$pppp$.updateTileFrame=function(){ // overwrite: ori use 'Math.floor' , '/' , '%'
	if(this._cfMap.size===this._scnt){
		let cf=this._cf;
		return this.setFrame(cf.xl, cf.yl, cf.width, cf.height);
	}else{
		this.updateTileFrame_frameOri();
		let frm=this._frameOri;
		return this.setFrame(frm.x, frm.y, frm.width, frm.height);
	}
};
$pppp$.updateCharacterFrame_sit=function(){
	if(0<this._bushDepth){
		this.updateCharacterFrame.ori.call(this);
		this._lowerBody.visible=false;
	}else{
		let ph = this.patternHeight();
		let newPh=parseInt(ph*0.9);
		if(this._frame.height!==newPh){
			let pw = this.patternWidth();
			let sx = (this.characterBlockX() + 1) * pw;
			let sy = (this.characterBlockY() + this.characterPatternY()) * ph;
			this._isNormalSit=true;
			this._old_anchor_y=this._anchor.y;
			this._anchor._y=ph/newPh+0.25;
			this.setFrame(sx, sy, pw, newPh);
		}
	}
};
$k$='updateCharacterFrame'
$r$=$pppp$[$k$]; // e.g. walking frames
$d$=$pppp$[$k$]=function f(){ // add on chair facing up
	//debug.log('Sprite_Character.prototype.updateCharacterFrame');
	if(this._characterName){ // not tiles
		let c=this._character;
		if(c===$gamePlayer||c._pageIndex>=0 && c.page().image.hasFaceImg){ // has walking frames
			if(c._direction===8 && $gameMap.isChair(c._realX,c._realY)){
				let lastX=this._last_realX , lastY=this._last_realY;
				this._last_realX=c._realX; this._last_realY=c._realY;
				if(lastX===c._realX && lastY===c._realY){ // state:sit
					this.updateCharacterFrame_sit();
					return;
				}
			}else if(this._isNormalSit){
				this._isNormalSit=false;
				if(this._old_anchor_y!==undefined){
					this._anchor._y=this._old_anchor_y;
					this._old_anchor_y=undef;
				}
			}
		} // else maybe it is a vehicle
	}
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.updateTextFrame=function(){
	if(this._txtSprite){
		const sp=this._txtSprite;
		const sc=this.scale;
		const newx=((this._frame.width>>1)-this.anchor.x*this._frame.width||0)-(sp.width>>1)/sc.x;
		if(sp.x!==newx) sp.x=newx;
		const newy=(-this.anchor.y*this._frame.height||0)-sp.height/sc.y;
		if(sp.y!==newy) sp.y=newy;
	}
};
$pppp$.characterBlockX=function(){ // overwrite: ori use '/' , '%'
	return this._isBigCharacter?0:((this._character.characterIndex()&3)*3);
};
$pppp$.characterBlockY=function(){ // overwrite: ori use '/' , '%'
	return this._isBigCharacter?0:((this._character.characterIndex()|3)^3);
};
$pppp$.characterPatternY=function(){ // overwrite: ori use '/' , '%'
	return (this._character.direction()>>1)-1;
};
$pppp$.patternWidth=function(){
	return this.bitmap._pw;
};
$pppp$.patternHeight=function(){ // overwrite: ori use '/' , '%'
	return this.bitmap._ph;
};
$k$='updatePosition';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this.z2=this._character.screenZ2();
}; $d$.ori=$r$;
$pppp$.tilesetBitmap=function(tileId,args) {
	return ImageManager.loadTileset($gameMap.tileset().tilesetNames[(tileId>>8)+5],undefined,args);
};
$pppp$.updateAnimationSprites=none;
$pppp$.startAnimation=function(animation, mirror, delay){ // rewrite: discard array access
	//let sprite = new Sprite_Animation();
	//sprite.setup(this._effectTarget, animation, mirror, delay);
	//this.parent.addChild(sprite);
	this.parent.addChild( new Sprite_Animation().setup(this._effectTarget, animation, mirror, delay) );
	//this._animationSprites.push(sprite);
};
$pppp$.isAnimationPlaying=none; // no Array.push , no 'Array.length>0'
$k$='startBalloon';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this._balloonSprite.ref=this;
	this._balloonSprite=false;
}; $d$.ori=$r$;
$pppp$.updateBalloon=$pppp$.setupBalloon; // following will not exec
$pppp$.endBalloon=none; // will not exec 'if' block
$pppp$.isBalloonPlaying=none; // always false
if(0)Sprite_Character.prototype._renderCanvas=function f(renderer){
	// note
	const bitmap=this.bitmap;
	if(bitmap){
		const pos=this.getGlobalPosition(),scale=this.scale,anchor=this.anchor;
		const w=bitmap.width*scale.x,h=bitmap.height*scale.y;
		const x=pos.x-w*anchor.x,y=pos.y-w*anchor.y;
		if(x>=SceneManager._boxWidth || y>=SceneManager._boxHeight || x+w<0 || y+h<0) ; else return Sprite.prototype._renderCanvas.call(this,renderer);
	}else return Sprite.prototype._renderCanvas.call(this,renderer);
};
$pppp$=$aaaa$=undef;

// - Sprite_Battler
$aaaa$=Sprite_Battler;
$pppp$=$aaaa$.prototype;
$k$='initMembers';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this._damages=new Queue();
}; $d$.ori=$r$;
$pppp$.setBattler=function(btlr){
	if(this._battler) this._battler.removeSprite(this);
	if(this._battler=btlr) btlr.setSprite(this);
};
$d$=$pppp$.updateDamagePopup=function f(){
	this.setupDamagePopup();
	if(this._damages.length > 0){
		this._damages.forEach(f.forEach);
		if(!this._damages[0].isPlaying()){
			this.parent.removeChild(this._damages[0]);
			this._damages.shift();
		}
	}
};
$d$.forEach=c=>c.update();
$pppp$.setupDamagePopup = function() {
	if(this._battler.isDamagePopupRequested()){
		if(this._battler.isSpriteVisible()){
			const res=this._battler.popActResQ();
			if(res){
				this._battler._result=res;
				let sprite = new Sprite_Damage();
				sprite.x = this.x + this.damageOffsetX();
				sprite.y = this.y + this.damageOffsetY(); 
				if(this._damages.length && this._damages.back.y>=64) sprite.y=this._damages.back.y-23;
				sprite.setup(this._battler);
				this._damages.push(sprite);
				this.parent.addChild(sprite);
			}
		}
		this._battler.clearDamagePopup();
		this._battler.clearResult();
	}
};
$pppp$=$aaaa$=undef;

// - Sprite_Actor
$aaaa$=Sprite_Actor;
$pppp$=$aaaa$.prototype;
$aaaa$.MOTIONS['spaceout']={index:0,loop:true};
$pppp$.getRef=function(){
	return this._actor;
};
$pppp$.initMembers=function f(){
	Sprite_Battler.prototype.initMembers.call(this);
	this._battlerName = '';
	this._motion = null;
	this._motionCount = 0;
	this._pattern = 0;
	this.createShadowSprite();
	this.createWeaponSprite();
	this.createMainSprite();
	this.createWeapon2Sprite(); //
	this.createStateSprite();
	this._breathCnt=0;
};
$pppp$.createWeapon2Sprite=function(){
	const w2 = this._weapon2Sprite = new Sprite_Weapon();
	this.addChild(w2);
	w2.scale.x=-1;
	const pp=w2._perPatternInfo=[];
	w2.x+=25; // new Sprite_Weapon().x === -16
	pp[0]={y:-48,scaley:-1};
	pp[1]={y:0,scaley:1};
	w2.updatePerPatternInfo();
};
$pppp$.setActorHome=function(idx){ // battler position'
	const sx=600,sy=280;
	//const xh=32*4+600,yh=48*4+280;
	const ptLen=$gameParty.allMembers().length;
	const origin=~~(idx*168/(ptLen));
	const offset=idx&3;
	const sh=(idx>>2)&3;
	this.setHome(offset*32+(sh<<2)+origin+sx,(offset-sh)*48-(origin>>1)+280);
};
$k$='setupWeaponAnimation';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	if(this._actor.isWeapon2AnimationRequested()){
		this._weapon2Sprite.setup(this._actor.weapon2ImageId());
		this._actor.clearWeapon2Animation();
	}
}; $d$.ori=$r$;
$pppp$.updateBitmap=function() {
	Sprite_Battler.prototype.updateBitmap.call(this);
	let name = this._actor.battlerName(); // (this._actor instanceof Game_Actor)
	if(this._battlerName !== name){
		const args=this._setBitmap_args();
		this._battlerName = name;
		this._mainSprite.bitmap = ImageManager.loadSvActor(name,undefined,args);
	}else if(name==='' && !this._chr2sv){
		const args=this._setBitmap_args();
		name=this._actor.characterName();
		name+=(name.indexOf("?")===-1?"?":"&")+"chr2sv="+encodeURIComponent(this._actor.characterIndex());
		this._chr2sv = this._mainSprite.bitmap = ImageManager.loadCharacter(name,undefined,args);
	}
};
$pppp$.updateMotionCount=function(){
	if(this._motion && ++this._motionCount >= this.motionSpeed()){
		if(this._motion.loop){
			if(++this._breathCnt>=this.breathSpeed()){
				this._breathCnt=0;
				++this._pattern; this._pattern&=3;
			}
		}else if(this._pattern < 2) ++this._pattern;
		else this.refreshMotion();
		this._motionCount = 0;
	}
};
$pppp$.motionSpeed=()=>1; // it's delay // ori:12
$pppp$.breathSpeed=()=>12; // it's delay // ori:12
$d$=$pppp$.refreshMotion=function f(){ // TODO // 一堆else-if沒救，判斷太多元
	let actor = this._actor;
	if (actor) {
		if (f.tbl.has(this._motion) && !BattleManager.isInputting()) {
			return;
		}
		let stateMotion = actor.stateMotionIndex();
		if(actor.isInputting() || actor.isActing()) {
			this.startMotion('walk');
		} else if (stateMotion === 3) {
			this.startMotion('dead');
		} else if (stateMotion === 2) {
			this.startMotion('sleep');
		} else if (actor.isChanting()) {
			this.startMotion('chant');
		} else if (actor.isGuard() || actor.isGuardWaiting()) {
			this.startMotion('guard');
		} else if (stateMotion === 1) {
			this.startMotion('abnormal');
		} else if (actor.isDying()) {
			this.startMotion('dying');
		} else if (actor.isUndecided()) {
			this.startMotion('walk');
		} else {
			this.startMotion('wait');
		}
	}
};
$d$.tbl=new Set(['guard','spaceout',].map(x=>$aaaa$.MOTIONS[x])); // returns
$pppp$=$aaaa$=undef;
// - Sprite_Enemy
$aaaa$=Sprite_Enemy;
$pppp$=$aaaa$.prototype;
$pppp$.getRef=function(){
	return this._enemy;
};
$pppp$.initMembers = function() {
	Sprite_Battler.prototype.initMembers.call(this);
	this._enemy = null;
	this._appeared = false;
	this._battlerName = '';
	this._battlerHue = 0;
	this._effectType = null;
	this._effectDuration = 0;
	this._shake = 0;
	this.createStateIconSprite();
	this.createHpMpSprite();
};
$pppp$.createStateIconSprite=function(){
	this.addChild( this._stateIconSprite = new Sprite_StateIcon() );
};
$k$='setBattler';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(battler){
	f.ori.call(this,battler);
	this._meta = battler.getData();
	this._meta = this._meta&&this._meta.meta||{};
}; $d$.ori=$r$;
$pppp$.createHpMpSprite=function(){
	let sp;
	this.addChild( sp = this._hpMpSprite = new Sprite() );
	let bm=sp.bitmap=new Bitmap;
	bm.fontSize=16;
	sp.alpha=0.75;
};
$pppp$.refreshMotion=none;
$pppp$.breathSpeed=function(){
	return Sprite_Actor.prototype.breathSpeed.call(this);
};
$pppp$.motionSpeed=function(){
	return Sprite_Actor.prototype.motionSpeed.call(this);
};
$pppp$.update=function(){
	Sprite_Battler.prototype.update.call(this);
	if(this._enemy){
		if(this._enemy._refActor){
			this._motionCount|=0;
			this._pattern|=0;
			this._breathCnt|=0;
			if(!this._motion) this._motion={loop:true,index:0};
			Sprite_Actor.prototype.updateMotionCount.call(this);
		}
		this.updateEffect();
		this.updateStateSprite();
		this.updateHpMpSprite();
	}
};
$pppp$.loadBitmap=function(name, hue){
	const args=this._setBitmap_args();
	if(this._enemy && this._enemy._refActor){
		const src=$dataActors[this._enemy._refActor.toId()];
		let name=src&&src.battlerName;
		if(name){ // TODO: arg: reflect_h
			name+=(name.indexOf("?")===-1?"?":"&")+"reflect_h";
			this.bitmap = ImageManager.loadSvActor(name,hue,args);
		}else{
			name=src.characterName;
			if(name) name+=(name.indexOf("?")===-1?"?":"&")+"chr2sv="+encodeURIComponent(src.characterIndex)+"&reflect_h";
			this.bitmap = ImageManager.loadCharacter(name,hue,args);
		}
	}else if($gameSystem.isSideView()) this.bitmap = ImageManager.loadSvEnemy(name,hue,args);
	else this.bitmap = ImageManager.loadEnemy(name,hue,args);
};
$pppp$.updateFrame=function(){
	if(this._enemy._refActor){
		this._mainSprite=this;
		Sprite_Actor.prototype.updateFrame.call(this);
		this._mainSprite=undefined;
		if(this._effectType === 'bossCollapse'){ // WARNING: setFrame twice within a drawing frame
			const frm=this._frame;
			this.setFrame(frm.x, frm.y, frm.width, this._effectDuration);
		}
	}else{
		Sprite_Battler.prototype.updateFrame.call(this);
		let frameHeight = this.bitmap.height;
		if(this._effectType === 'bossCollapse'){
			frameHeight = this._effectDuration;
		}
		this.setFrame(0, 0, this.bitmap.width, frameHeight);
	}
};
$pppp$.updateStateSprite=function(){
	const hpmp=this._hpMpSprite , icon=this._stateIconSprite;
	if(hpmp){
		icon.y = hpmp.y+hpmp.height + icon.height*icon.anchor.y + 1;
	}else{
		icon.y = -~~((this._frame.height*this.anchor.y + 40) * 0.9);
		if (icon.y < 20 - this.y) {
			icon.y = 20 - this.y;
		}
	}
};
$d$=$pppp$.updateHpMpSprite=function f(forced){
	
	const scale=this.scale,sp=this._hpMpSprite;
	const sx=scale.x,sy=scale.y,bm=sp.bitmap;
	const wl=SceneManager._scene._windowLayer;
	if(wl){
		const obj=this._enemy;
		if( !forced && this._lastHp===obj.hp && this._lastMp===obj.mp ) return;
		this._lastHp=obj.hp; this._lastMp=obj.mp;
		const mhp=obj.mhp , mmp=obj.mmp;
		
		const lh=20;
		{ const s=sp.scale; s.x=1/sx; s.y=1/sy; }
		const w=wl.children[0],width=this._frame.width*scale.x,height=(lh<<1)|1;
		const recreated=bm._reCreateTextureIfNeeded(width,height);
		const bmw=bm.width;
		const hpWidth=~~(bmw*obj.hp/mhp);
		const mpWidth=~~(bmw*obj.mp/mmp);
		const yhp=0,ymp=lh+1;
		bm.clear();
		sp.setFrame(0,0,width,height);
		bm.fillRect        (0, yhp, bmw, lh, w.gaugeBackColor());
		bm.gradientFillRect(0, yhp, hpWidth, lh, w.hpGaugeColor1(), w.hpGaugeColor2());
		bm.fillRect        (0, ymp, bmw, lh, w.gaugeBackColor());
		bm.gradientFillRect(0, ymp, mpWidth, lh, w.mpGaugeColor1(), w.mpGaugeColor2());
		const tw=bm.measureTextWidth("/"),mw=(bmw-tw)>>1;
		bm.drawText("/",   0,yhp,bmw,lh,'center');
		bm.drawText(obj.hp,0,yhp,mw,lh,'right');
		bm.drawText(mhp,(bmw+tw)>>1,yhp,mw,lh);
		bm.drawText("/",   0,ymp,bmw,lh,'center');
		bm.drawText(obj.mp,0,ymp,mw,lh,'right');
		bm.drawText(mmp,(bmw+tw)>>1,ymp,mw,lh);
	}
	
	const frm=this._frame,acr=this._anchor;
	sp.x=-frm.width*acr.x;
	sp.y=-frm.height*acr.y-sp.height/sy;
	sp.y-=this._stateIconSprite.height/sy;
	const y=sp.getGlobalPosition().y;
	if(y<0) sp.y-=y/sy;
	else{
		const my=Graphics.height-sp.height;
		if(y>my) sp.y=my/sy;
	}
};
$d$.tbl=["rgba()"];
$pppp$=$aaaa$=undef;
// - Sprite_Animation
$aaaa$=Sprite_Animation;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.setup;
$d$=$pppp$.setup=function f(){
	// f(target, animation, mirror, delay)
	f.ori.apply(this,arguments);
	// used in 'updateAllCellSprites'
	this._lastCellLen=this._cellSprites.length;
	// set z lower if not 'screen' (default z=8)
	let ani=this._animation,t=arguments[0]; // pos: 0:head 1:center 2:feet 3:screen
	if(ani&&ani.position!==3 && t){
		this.z2=this.z;
		this.z=t.z;
	}
	return this;
}; $d$.ori=$r$;
$r$=$pppp$.remove;
$d$=$pppp$.remove=function f(){
	if(this.parent){
		f.ori.call(this);
		this._target.setBlendColor([0, 0, 0, 0]);
		this._target.show();
	}
}; $d$.ori=$r$;
$pppp$.setupDuration=function(){
	this._durFloor=this._animation.frames.length * this._rate;
	this._duration=this._durFloor+1;
};
$pppp$.updateMain=function(){
	if(this.isPlaying()){
		if(this.isReady())
			if(0<this._delay) --this._delay;
			else{
				this.updatePosition();
				if(this._durFloor===--this._duration){ // 原版是在%三小
					this._durFloor-=this._rate;
					this.updateFrame();
				}
			}
	}else this.remove();
};
$pppp$.updatePosition = function() {
	if (this._animation.position === 3) { // 原版是在/三小，我就不相信直接整數不行
		this.x = this.parent.width>>1;
		this.y = this.parent.height>>1;
	} else {
		let parent=this._target.parent;
		if(!parent) this._target.updatePosition();
		let grandparent=parent?parent.parent:null;
		let x = ~~this._target.x;
		let y = ~~this._target.y;
		if (this.parent === grandparent) {
			x += ~~parent.x;
			y += ~~parent.y;
		}
		if (this._animation.position === 0) {
			y -= ~~this._target.height;
		} else if (this._animation.position === 1) {
			y -= this._target.height>>1;
		}
		this.x=x; this.y=y;
	}
};
$d$=$pppp$.updateFrame=function f(){
	if(this._duration > 0){
		let frameIndex = this.currentFrameIndex();
		this.updateAllCellSprites(this._animation.frames[frameIndex]);
		const arr=this._animation.timings.byFrmIdx.get(frameIndex);
		if(arr) arr.forEach(f.forEach,this);
	}
};
$d$.forEach=function(t){ this.processTimingData(t); };
$pppp$.currentFrameIndex=function(){
	return this._animation.frames.length - ~~((this._duration + this._rate - 1) / this._rate);
};
$pppp$.updateAllCellSprites=function(frame){ // TODO: create cells when needed
	const arr=this._cellSprites;
	{
		let xs=frame.length; if(xs>arr.length) xs=arr.length;
		for(let x=0;x!==xs;++x) this.updateCellSprite(arr[x], frame[x]);
	}
	if(arr.length >= this._lastCellLen && this._lastCellLen > frame.length) for(let x=frame.length;x!==this._lastCellLen;++x) arr[x].visible=false;
	this._lastCellLen = frame.length;
};
$pppp$=$aaaa$=undef;

// - Sprite_Damage
$aaaa$=Sprite_Damage;
$pppp$=$aaaa$.prototype;
$pppp$.setup=function(target){
	const res = target.result();
	if(res.missed || res.evaded) this.createMiss();
	else{
		const ha=!!res.hpAffected;
		if(target.isAlive() && res.mpDamage !== 0) this.createDigits(2, res.mpDamage,-ha,-ha*0.5);
		if(ha) this.createDigits(0, res.hpDamage);
	}
	if (res.critical) {
		this.setupCriticalEffect();
	}
};
$k$='createDigits';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(colorCh,v,shax,shay){
	if(isNaN(shax)) shax=0;
	if(isNaN(shay)) shay=0;
	const w = this.digitWidth() , h = this.digitHeight();
	const s = Math.abs(v).toString();
	const rh=(colorCh+(v<0))*h;
	for (let i=0,iw=-(((s.length-1)*w)>>1); i!==s.length;++i){
		const sprite = this.createChildSprite();
		const n = Number(s[i]);
		sprite.setFrame(n * w, rh, w, h);
		//sprite.x = (i - (s.length - 1) / 2) * w;
		sprite.x = iw; iw+=w;
		sprite.dy = -i;
		const a=sprite.anchor;
		a.x+=shax; a.y+=shay;
	}
	this.__value=v;
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - Sprite_Weapon
$aaaa$=Sprite_Weapon;
$pppp$=$aaaa$.prototype;
$aaaa$.width=96;
$aaaa$.height=64;
$r$=$pppp$.setup;
$d$=$pppp$.setup=function f(wImgId){
	f.ori.call(this,wImgId);
	this._lastPatternWaitCnt=0;
	this._lastPatternWaitMax=4;
}; $d$.ori=$r$;
$pppp$.animationWait=function(){
	return this.parent&&this.parent.motionSpeed?this.parent.motionSpeed():1;
};
$pppp$.updatePerPatternInfo=function(){
	if(this._perPatternInfo){
		const info=this._perPatternInfo[this._pattern];
		if(info){
			if(info.x!==undefined) this.x=info.x;
			if(info.y!==undefined) this.y=info.y;
			if(info.saclex!==undefined) this.scale.x=info.scalex;
			if(info.scaley!==undefined) this.scale.y=info.scaley;
		}
	}
};
$pppp$.updatePattern = function() {
	if(this._weaponImageId){
		if(this._pattern===2){
			if(++this._lastPatternWaitCnt>this._lastPatternWaitMax){
				this._weaponImageId=0;
				this._pattern=0;
			}
		}else{
			++this._pattern;
		}
		this.updatePerPatternInfo();
	}
};
$pppp$=$aaaa$=undef;

// - Sprite_Balloon
$aaaa$=Sprite_Balloon;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	f.ori.call(this);
	if(this._duration===0) this.remove();
	else if(this.ref){
		let ref=this.ref;
		this.x = ref.x;
		this.y = ref.y - ref.height;
	}
}; $d$.ori=$r$;
// - Sprite_Picture
$aaaa$=Sprite_Picture;
$pppp$=$aaaa$.prototype;
$k$='loadBitmap';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if(_global_conf.isDataURI(this._pictureName)) this.bitmap=ImageManager.loadNormalBitmap(this._pictureName);
	else f.ori.call(this);
}; $d$.ori=$r$;
// - Sprite_Timer
$aaaa$=Sprite_Timer;
$pppp$=$aaaa$.prototype;
$pppp$.setTimer=function(timer){
	this._timer=timer;
};
$pppp$.updateBitmap = function() {
	let timer=this._timer||$gameTimer;
	if (this._seconds !== timer.seconds()) {
    		this._seconds = timer.seconds();
	    	this.redraw();
	}
};
$pppp$.updatePosition = function(forced){
	if( forced || this._scale!==$gameTimer._scale && !isNaN($gameTimer._scale) ){
		this._scale=$gameTimer._scale;
		this.scale.y=this.scale.x=Number(this._scale);
		let bm=this.bitmap;
		let w=bm.width*this._scale;
		let h=bm.height*this._scale;
		this.x=Graphics.width-w;
		this.y=0;
		if(this._background){
			this._background.width=w;
			this._background.height=h;
			this._background.x=this.x;
			this._background.y=this.y;
		}
	}
};
$pppp$.updateVisibility=function(){
	this.visible = $gameTimer.isWorking();
	if(this._background) this._background.visible=this.visible;
};
// - Sprite_Destination
$aaaa$=Sprite_Destination
$pppp$=$aaaa$.prototype;
$pppp$.updateAnimation=function(){ // ...
    this._frameCount++;
    this._frameCount &= 15;
    this.opacity = (this._frameCount^0xF)<<3;
    this.scale.x = this._frameCount / 16 + 1;
    this.scale.y = this.scale.x;
};
// - Spriteset_Base
$aaaa$=Spriteset_Base;
$pppp$=$aaaa$.prototype;
$pppp$.updateCanvasToneChanger=function(){
	const t=this._tone;
	if(_global_conf.useCanvasSatur) return this._toneSprite.setTone(t[0], t[1], t[2], t[3]);
	const satur=SceneManager._scene._cssSatur=((255-t[3])/256);
	const c=d.ge("GameCanvas") , css=c&&c.style;
	if(css) css.filter=t[3]>0?"saturate("+ satur +")":"";
	this._toneSprite.setTone(t[0], t[1], t[2], 0);
};
// - Spriteset_Map
$aaaa$=Spriteset_Map;
$pppp$=$aaaa$.prototype;
$k$='createTimer';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	this.addChild(this._timerBackground = new Window_Base(0,0,96,48));
	f.ori.call(this);
	this._timerSprite._background=this._timerBackground;
	this._timerSprite.updatePosition(true);
}; $d$.ori=$r$;
$pppp$.loadTileset=function f(){ // re-write: fix bug: shadertimemap not rendered (not correctly set 'newTilesetFlags' before rendering)
	if(!f.cache) f.cache=new CacheSystem(1);
	if(this._tileset=$gameMap.tileset()){
		let tilesetNames = this._tileset.tilesetNames , isWebGL=Graphics.isWebGL() , tm=this._tilemap;
		for(let i=0,cache=f.cache,texPerChild=isWebGL?tm.lowerLayer.texPerChild:0,len=tilesetNames.length;i!==len;++i){
			let x=i,curr=tm.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
			if(isWebGL && i+len<texPerChild) curr.addLoadListener((bitmap)=>{
				let fname=bitmap._fname; if(!fname){ tm.bitmaps[x+len]=ImageManager.loadEmptyBitmap(); return; }
				let i=x+len,alpha=0.25*(~~(i/len));
				let cacheKey=fname+"-"+alpha;
				let b2=cache.get(cacheKey); if(b2){ tm.bitmaps[i]=b2; return; }
				let newBitmap=tm.bitmaps[i]=ImageManager.loadTileset(tilesetNames[x],undefined,{rnd:alpha,});
				let src=bitmap._baseTexture.source;
				let c=d.ce('canvas'); c.width=src.width; c.height=src.height;
				let ctx=c.getContext('2d'); // ctx.clearRect(0,0,c.width,c.height);
				ctx.globalAlpha=alpha;
				ctx.drawImage(src,0,0);
				newBitmap._image_ori=newBitmap._image_ori||newBitmap._image;
				newBitmap._baseTexture.source=newBitmap._image=c;
			});
		}
		let newTilesetFlags=$gameMap.tilesetFlags();
		if(!tm.flags.equals(newTilesetFlags)){
			tm.flags = newTilesetFlags;
			//this._tilemap.refresh(); // 'ShaderTilemap.refresh' is called when 'initialize' -> '_needsRepaint' is true
		}
		if(isWebGL) tm.refreshTileset(); // 'Tilemap.refreshTileset' is empty
		else tm.refresh();
	}
};
$pppp$.createCharacters=function(){
	if(this._characterSprites) this._characterSprites.length=0;
	else this._characterSprites = [];
	$gameMap.events().forEach(function(event){
		this._characterSprites.push(new Sprite_Character(event));
	}, this);
	$gameMap.vehicles().forEach(function(vehicle){
		this._characterSprites.push(new Sprite_Character(vehicle));
	}, this);
	let cnt=$gameParty.allMembers().length-1; if(cnt===-1) cnt=0;
	// do not reverse, for better knowing last follower's location
	$gamePlayer._followers._data.slice(0,cnt).forEach( flr=>this._characterSprites.push(new Sprite_Character(flr)) );
	this._characterSprites.push(new Sprite_Character($gamePlayer));
	this._tilemap.player=this._characterSprites.back;
	for(let i=0;i!==this._characterSprites.length;++i){
		this._tilemap.addChild(this._characterSprites[i]);
	}
};
$pppp$.updateTilemap = function() {
	this._tilemap.origin.x = $gameMap._displayX_tw;
	this._tilemap.origin.y = $gameMap._displayY_th;
};
$pppp$.updateWeather = function() {
	this._weather.type = $gameScreen.weatherType();
	this._weather.power = $gameScreen.weatherPower();
	this._weather.origin.x = $gameMap._displayX_tw;
	this._weather.origin.y = $gameMap._displayY_th;
};
$pppp$=$aaaa$=undef;

// - Spriteset_Battle
$aaaa$=Spriteset_Battle;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(scene){
	this._scene=scene;
	f.ori.call(this);
}; $d$.ori=$r$;
$d$=$pppp$._sortE=function f(forced){
	const bfc=this._battleField.children;
	if(forced||this._lastBfcLen!==bfc.length){
		this._lastBfcLen=bfc.length;
		bfc.sort(f.cmp);
	}
};
$d$.cmp=function f(a,b){
	const aa=(f.tbl.get(a.constructor)|0)^3,bb=(f.tbl.get(b.constructor)|0)^3;
	return (aa-bb)||(aa===1)&&f.cmp(a,b);
};
$d$.cmp.cmp=$pppp$.compareEnemySprite;
$d$.cmp.tbl=new Map([
	[TilingSprite,3],
	[Sprite_Enemy,2],
	[Sprite_Actor,1],
]);
$k$='updateTransform';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	this._sortE();
	f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.createActors=function(){
	this._actorSprites = [];
	for (let i=0,sz=$gameParty.battleMembers().length;i!==sz;++i) this._battleField.addChild( this._actorSprites[i] = new Sprite_Actor() );
};
$pppp$.updateActors=function(){ // exec every frame
	for(let i=0,arrv=this._actorSprites,arrk=$gameParty.battleMembers();i!==arrv.length;++i){
		arrv[i].setBattler(arrk[i]);
		this._scene._chr2sp.set(arrk[i],arrv[i]);
	}
};
$pppp$.isAnimationPlaying=none;
$pppp$.isEffecting=none;
$pppp$.isAnyoneMoving=none; // step forward and backward
$pppp$.isBusy=none; // '||' above 2
$pppp$=$aaaa$=undef;

// manager

// - ConfigManager
$aaaa$=ConfigManager;
$aaaa$.maxSavefiles=DataManager.maxSavefiles();
$aaaa$.readFlag=function(config,name,defaultVal){
	const rtv=config[name];
	return rtv===undefined?!!defaultVal:rtv;
};
$aaaa$.readVolume=function(config,name){
	const value=config[name];
	if(isNone(value)) return AudioManager._defaultVolume;
	else return value<100?value<0?0:value:100;
};
$aaaa$.ConfigOptionsWithSystem=[
	["_noGainMsg",$aaaa$.readFlag,1],
	["_noGainHint",$aaaa$.readFlag],
	["_noGainSound",$aaaa$.readFlag],
	["_noLeaderHp",$aaaa$.readFlag],
	["_noLeaderMp",$aaaa$.readFlag],
	["_flwingMsg",$aaaa$.readFlag],
	["_lvUpMsg",$aaaa$.readFlag,1],
	["_lvUpHint",$aaaa$.readFlag,1],
	["_noAnimation",$aaaa$.readFlag],
	["_noAutotile",$aaaa$.readFlag],
	["_simpleTouchMove",$aaaa$.readFlag],
	["_useFont"],
];
$aaaa$.ConfigOptions=$aaaa$.ConfigOptionsWithSystem.concat([
	["alwaysDash",$aaaa$.readFlag,1],
	["commandRemember",$aaaa$.readFlag,1],
	["bgmVolume",$aaaa$.readVolume],
	["bgsVolume",$aaaa$.readVolume],
	["meVolume",$aaaa$.readVolume],
	["seVolume",$aaaa$.readVolume],
	["maxSavefiles"],
	["_halfFps",$aaaa$.readFlag],
	["_apps"],
	["_etc"],
]);
$aaaa$.makeData=function() {
	let rtv={};
	for(let arr=this.ConfigOptions,x=0,xs=arr.length;x!==xs;++x){
		let t=arr[x];
		rtv[t[0]]=this[t[0]];
		if(t[1]===this.readFlag) rtv[t[0]]|=0;
	}
	return rtv;
};
$aaaa$.applyData=function(config) {
	for(let arr=this.ConfigOptions,x=0,xs=arr.length;x!==xs;++x)
		if(arr[x][1]) this[arr[x][0]]=arr[x][1].call(this,config,arr[x][0],arr[x][2]);
		else if(arr[x][0] in config) this[arr[x][0]]=config[arr[x][0]];
};
$pppp$=$aaaa$=undef;

// - ImageManager
$aaaa$=ImageManager;
{ const f=function(){ return arguments[2]===""?"":(arguments[1]==="?"?"?":"&"); };
$aaaa$._trimMetaArgs=p=>p.replace(/(\?|&)(color|scale|rnd|reflect_h|reflect_v)(=[^&]*)?(?=(&|$))/g,'$1').replace(/(\?)?[&]+($)?/g,f);
}
$aaaa$.loadEnemy=function(filename,hue,args){
	return this.loadBitmap('img/enemies/', filename, hue, true, args);
};
$aaaa$.loadCharacter=function(filename, hue, args){ // re-write: add args: 'args': edit img
	return this.loadBitmap('img/characters/', filename, hue, false, args);
};
$aaaa$.loadFace=function(filename, hue, args){
	return this.loadBitmap('img/faces/', filename, hue, true, args);
};
$aaaa$.loadSvActor=function(filename,hue,args){
	return this.loadBitmap('img/sv_actors/', filename, hue, false, args);
};
$aaaa$.loadSvEnemy=function(filename,hue,args){
	return this.loadBitmap('img/sv_enemies/', filename, hue, true, args);
};
$aaaa$.loadTileset=function f(filename,hue,args){
	// f(folder,fname,hue,smooth)
	let rtv=this.loadBitmap('img/tilesets/', filename, hue, false, args);
	rtv._fname=filename;
	return rtv;
};
$aaaa$._genPath=(folder,filename,args)=>{
	const search=filename.indexOf("?");
	let path,a="?";
	if(search===-1) path = folder + filename + '.png';
	else{
		a=filename.slice(search);
		path=folder + filename.slice(0,search) + '.png';
	}
	for(let i in args){
		if(a.length!==1) a+="&";
		a+=encodeURIComponent(i);
		if(args[i]!==true){
			a+='=';
			a+=encodeURIComponent(args[i]);
		}
	}
	if(a.length!==1) path+=a;
	return path;
};
$d$=$aaaa$._genType=function f(folder,filename,args){
	let rtv={};
	rtv._patternType=f.tbl[folder]|0;
	if(folder===f.tilesets) rtv._isTile=true;
	else if(ImageManager.isBigCharacter(filename)) rtv._isBigChr=true;
	return rtv;
};
$d$.tbl={
	"img/animations/":192,	//
//	"img/battlebacks1/":0,
//	"img/battlebacks2/":0,
	"img/characters/":12,	//
//	"img/enemies/":0,
	"img/faces/":8, 	//
//	"img/parallaxes/":0,
//	"img/pictures/":0,
	"img/sv_actors/":54,	//
//	"img/sv_enemies/":0,
//	"img/system/":0,
	"img/tilesets/":48,	//
//	"img/titles1/":0,
//	"img/titles2/":0,
};
$d$.tilesets="img/tilesets/";
$aaaa$._putPatternSize=(bm,img)=>{
	if(bm._scaleChanged) return;
	const width  =(img?img:bm).width;
	const height =(img?img:bm).height;
	switch(bm._patternType){
	case 0:{
		bm._pw=width;
		bm._ph=height;
	}break;
	case   8: { // face
		bm._pw=width>>2;
		bm._ph=height>>1;
	}break;
	case  12: { // chr
		bm._pw=width/3;
		bm._ph=height>>2;
		if(!bm._isBigChr){
			bm._pw>>=2;
			bm._ph>>=1;
		}
	}break;
	case  48: { // tile
		bm._pw=Game_Map.prototype.tileWidth ();
		bm._ph=Game_Map.prototype.tileHeight();
	}break;
	case  54: { // sv-a
		bm._pw=width/9;
		bm._ph=height/6;
	}break;
	case 192: { // ani
		bm._ph=bm._pw=192;
	}break;
	}
};
$aaaa$.loadBitmap=function(folder, filename, hue, smooth, args){ // re-write: add args: 'args': edit img
	if(filename){
		let path=this._genPath(folder,filename,args);
		let type=this._genType(folder,filename);
		let bitmap = this.loadNormalBitmap(path, hue || 0, type);
		bitmap.smooth = smooth;
		return bitmap;
	}else return this.loadEmptyBitmap();
};
$d$=$aaaa$.loadNormalBitmap=function f(path, hue, type){
	let key = this._generateCacheKey(path, hue);
	let bitmap=this._imageCache.get(key);
	if (!bitmap) {
		bitmap=Bitmap.load(path,key,type);
		bitmap._hue=hue;
		bitmap.addLoadListener(f.rh);
		this._imageCache.add(key, bitmap);
	}else if(!bitmap.isReady()){
		bitmap.decode();
	}
	bitmap._pw|=0;
	bitmap._ph|=0;
	bitmap.addLoadListener(this._putPatternSize);
	return bitmap;
};
$d$.rh=bm=>{ let hue=bm._hue; delete bm._hue; bm.rotateHue(hue); };
$aaaa$.clear=function(){
	this._imageCache.clear();
};
$aaaa$.reserveFace=function(filename, hue, reservationId, args){
	return this.reserveBitmap('img/faces/', filename, hue, true, reservationId, args);
};
$aaaa$.reserveCharacter=function(filename, hue, reservationId, args){
	return this.reserveBitmap('img/characters/', filename, hue, false, reservationId, args);
};
$aaaa$.reserveSvActor=function(filename, hue, reservationId, args) {
	return this.reserveBitmap('img/sv_actors/', filename, hue, false, reservationId, args);
};
$aaaa$.reserveBitmap=function(folder, filename, hue, smooth, reservationId , args) {
	if(filename){
		let path=this._genPath(folder,filename,args);
		let type=this._genType(folder,filename,args);
		let bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId , type);
		bitmap.smooth = smooth;
		return bitmap;
	}else return this.loadEmptyBitmap();
};
$aaaa$.reserveNormalBitmap = function(path, hue, reservationId , type){
	let bitmap = this.loadNormalBitmap(path, hue , type);
	this._imageCache.reserve(this._generateCacheKey(path, hue), bitmap, reservationId);
	return bitmap;
};
$pppp$=$aaaa$=undef;

// - AudioManager
$aaaa$=AudioManager;
$aaaa$._defaultVolume = _global_conf["default volume"];
$aaaa$._bgmVolume = $aaaa$._defaultVolume;
$aaaa$._bgsVolume = $aaaa$._defaultVolume;
$aaaa$. _meVolume = $aaaa$._defaultVolume;
$aaaa$. _seVolume = $aaaa$._defaultVolume;
$aaaa$.clearPitch_bgm=function(){
	if(this._pitchesBgm_itvl===undefined) return;
	clearInterval(this._pitchesBgm_itvl);
	this._pitchesBgm_data=this._pitchesBgm_itvl=undefined;
	return true;
};
$aaaa$._playPitch_x=function(p,x_play,x_fadeout){
	if(p?p.constructor===Number:(p===0)) x_play.call(this,{name:"hz440",volume:175,pitch:Math.pow(2,p/12)*100});
	else switch(p){
	default: break;
	case '':{
		if(x_fadeout) x_fadeout.call(this,0.5);
	}break;
	}
};
$aaaa$.playPitch_bgm=function(p){
	this._playPitch_x(p,AudioManager.playBgm.ori,AudioManager.fadeOutBgm);
};
$aaaa$.playPitch_bgs=function(p){
	this._playPitch_x(p,AudioManager.playBgs.ori,AudioManager.fadeOutBgs);
};
$r$=$aaaa$.playBgm;
$d$=$aaaa$.playBgm=function f(bgm,pos){
	if(bgm&&bgm.constructor===Array){
		if(this.isCurrentBgm(bgm)) return this._pitchesBgm_pos=pos;
		if(this._pitchesBgm_itvl) this.stopPitch_bgm();
		this._pitchesBgm_data=bgm;
		this._pitchesBgm_pos=pos||0;
		this._pitchesBgm_itvl=setInterval(()=>{
			if(!this._pitchesBgm_data) return this.stopPitch_bgm();
			this._pitchesBgm_pos|=0;
			this._pitchesBgm_pos%=this._pitchesBgm_data.length;
			this.playPitch_bgm(this._pitchesBgm_data[this._pitchesBgm_pos++]);
		},183);
	}else{
		this.stopPitch_bgm();
		f.ori.call(this,bgm,pos);
	}
}; $d$.ori=$r$;
$r$=$aaaa$.playBgs;
$d$=$aaaa$.playBgs=function f(bgs,pos){
	f.ori.call(this,bgs,pos);
}; $d$.ori=$r$;
$k$='isCurrentBgm';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(bgm){
	return (bgm.constructor===Array)?this._pitchesBgm_data===bgm||bgm.equals(this._pitchesBgm_data):f.ori.call(this,bgm);
}; $d$.ori=$r$;
$aaaa$.stopPitch_bgm=function(){
	this.clearPitch_bgm()&&this.stopBgm();
};
$aaaa$.fadeOutPitch_bgm=function(dur){
	if(!(dur>=0)) dur=0;
	this.clearPitch_bgm();
	this.fadeOutBgm(dur);
};
$aaaa$.savePitch_bgm=function(){
	if(this._pitchesBgm_itvl){
		const rtv=this._pitchesBgm_data.slice();
		rtv.pos=this._pitchesBgm_pos;
		return rtv;
	}
};
$aaaa$.savePitch_bgs=function(){
	if(this._pitchesBgs_itvl){
		const rtv=this._pitchesBgs_data.slice();
		rtv.pos=this._pitchesBgs_pos;
		return rtv;
	}
};
$r$=$aaaa$.stopAll;
$d$=$aaaa$.stopAll=function f(){
	this.stopPitch_bgm();
	f.ori.call(this);
}; $d$.ori=$r$;
$aaaa$._saveBgX=function(rtv,curr,buffer,p){
	// rtv must be an object
	if(curr){
		rtv.name=curr.name;
		rtv.volume=curr.volume;
		rtv.pitch=curr.pitch;
		rtv.pan=curr.pan;
		rtv.pos=buffer?buffer.seek() : 0;
	}else{
		rtv.name='';
		rtv.volume=0;
		rtv.pitch=0;
		rtv.pan=0;
		rtv.pos=0;
	}
	return rtv;
};
$r$=$aaaa$.saveBgm;
$d$=$aaaa$.saveBgm=function f(rtv){
	// rtv is obj or "sth that is false"
	if(!rtv) return f.ori.call(this);
	return this._saveBgX(rtv,this._currentBgm,this._bgmBuffer,p);
}; $d$.ori=$r$;
$r$=$aaaa$.saveBgs;
$d$=$aaaa$.saveBgs=function f(rtv){
	// rtv is obj or "sth that is false"
	if(!rtv) return f.ori.call(this);
	return this._saveBgX(rtv,this._currentBgs,this._bgsBuffer,p);
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - BattleManager
$aaaa$=BattleManager;
$r$=$aaaa$. setup ;
$d$=$aaaa$. setup =function f(troopId, canEscape, canLose){
	f.ori.call(this, troopId, canEscape, canLose);
	this._turnCtr=0;
	this.clearTBDCache();
}; $d$.ori=$r$;
$d$=$aaaa$.clearTBDCache=function f(){
	if(this._TBDCache){
		this._TBDCache.forEach(f.forEach);
		this._TBDCache.clear();
	}else this._TBDCache=new Set();
};
$d$.forEach=b=>b.clearCache();
$k$='initMembers';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){
	f.ori.call(this);
	let tmp;
	
	tmp=this._actionBattlers;
	if(tmp && tmp.constructor===Queue) tmp.clear();
	else this._actionBattlers=new Queue();
	
	tmp=this._actionBattlers_obj2id;
	if(tmp) tmp.clear();
	else this._actionBattlers_obj2id=new Map();
	
	tmp=this._isGuardWaiting;
	if(tmp) tmp.clear();
	else this._isGuardWaiting=new Map();
	
	tmp=this._isChanting;
	if(tmp) tmp.clear();
	else this._isChanting=new Map();
	
	this._actionNoEffect=false;
}; $d$.ori=$r$;
$k$='saveBgmAndBgs';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){
	f.ori.call(this);
	if(AudioManager._pitchesBgm_data){
		AudioManager._pitchesBgm_data.pos=AudioManager._pitchesBgm_pos;
		this._mapBgm=AudioManager._pitchesBgm_data;
	}
	if(AudioManager._pitchesBgs_data){
		AudioManager._pitchesBgs_data.pos=AudioManager._pitchesBgs_pos;
		this._mapBgs=AudioManager._pitchesBgs_data;
	}
}; $d$.ori=$r$;
$k$='makeEscapeRatio';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){
	if($gameTroop._trueEscape || $gameParty.mustEscape()) this._escapeRatio = 1;
	else f.ori.call(this);
}; $d$.ori=$r$;
$r$=$aaaa$. update ;
$d$=$aaaa$. update =function f(){ // prepare
	//console.log(' update ',this._actorIndex);
	//return f.ori.call(this);
	do{
		this._actionNoEffect=false;
		f.ori.call(this);
	}while(this._actionNoEffect);
}; $d$.ori=$r$;
$k$='startInput';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){ // prepare
	if(objs.isDev) console.log(' startInput ',this._actorIndex);
	return f.ori.call(this);
}; $d$.ori=$r$;
$aaaa$.inputtingAction=function(){
	const actor=this.actor();
	return actor ? actor.inputtingAction() : null;
};
$r$=$aaaa$.startTurn;
$d$=$aaaa$.startTurn=function f(){
	if(objs.isDev) console.log(' startTurn ',this._actorIndex);
	++this._turnCtr;
	return f.ori.call(this);
}; $d$.ori=$r$;
$k$='updateTurn';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){ // prepare
	//console.log(' updateTurn ',this._actorIndex);
	return f.ori.call(this);
}; $d$.ori=$r$;
$k$='processTurn';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){ // prepare
	//console.log(' processTurn ',this._actorIndex);
	//return f.ori.call(this);
	const subject = this._subject;
	let action = subject.currentAction();
	while(action && !action.isValid()){
		subject.removeCurrentAction();
		action = subject.currentAction();
	}
	if(action){
		action.prepare();
		if (action.isValid()) {
			this.startAction();
		}
		subject.removeCurrentAction();
	} else {
		subject.onAllActionsEnd();
		this.refreshStatus();
		this._logWindow.displayAutoAffectedStatus(subject);
		this._logWindow.displayCurrentState(subject);
		this._logWindow.displayRegeneration(subject);
		this._subject = this.getNextSubject();
	}
}; $d$.ori=$r$;
$r$=$aaaa$. endTurn ;
$d$=$aaaa$. endTurn =function f(){ // prepare
	if(objs.isDev) console.log(' endTurn ',this._actorIndex);
	return f.ori.call(this);
}; $d$.ori=$r$;
$k$='updateTurnEnd';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){ // prepare
	if(objs.isDev) console.log(' updateTurnEnd ',this._actorIndex);
	// only 'this.startInput();'
	return f.ori.call(this);
}; $d$.ori=$r$;
$k$='makeActionOrders';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){
	f.ori.call(this);
	this._actionBattlers_obj2id=new Map(this._actionBattlers.map(f.forEach));
	this._actionBattlers=new Queue(this._actionBattlers);
}; $d$.ori=$r$;
$d$.forEach=(e,i)=>[e,i];
$d$=$aaaa$.updateAction=function f(instPopDmg){
	const target = this._targets.pop(); // reverse order
	if(target){
		//let tmp;
		const st=this._statusWindow,lg=this._logWindow;
		st.noRefresh=true;
		lg.push('pushBaseLine');
		if(this._subject.stp===0){
			if(!this._action.meta) this._action.meta={};
			this._action.meta.stpReduced=true;
		}
		const q=this._subject.reserveActResQ(); if(q) q.clear();
		{ const realTarget=this.invokeAction(this._subject,target,q);
		if(instPopDmg && SceneManager._scene._chr2sp){
			const sp=SceneManager._scene._chr2sp.get(realTarget);
			realTarget.startDamagePopup();
			sp.setupDamagePopup();
		}
		}
		if(this._actionNoEffect=!target._result.used){ // target disappear (action not used), cancel following sub-action via immediately complete them // so subject will gain TP 
			lg._methods.pop_back();
			while(this._targets.back===target){
				this._targets.pop();
				this.invokeAction(this._subject,target,q);
			}
		}else{ // target aimed, try aim more
			f.tmp.clear(); f.tmp.add(target);
			const arr=this._targets;
			while(arr.length){
				let sz=f.tmp.size; f.tmp.add(this._targets.back);
				if(sz===f.tmp.size) break;
				this.invokeAction(this._subject,this._targets.pop(),q);
			}
			lg.push('popBaseLine');
		}
		st.noRefresh=false;
		st.refresh();
		// inst becomes go through 1 turn
		//if(this._actionNoEffect) return this.updateAction(instPopDmg);
	}else{
		if(!this._action.meta) this._action.meta={};
		if(this._subject.stp!==undefined && !this._action.meta.stpReduced && !this._action.isSpaceout(this._subject)){
			this._action.meta.stpReduced=true;
			this._subject.gainStp(-1);
		}
		this.endAction();
	}
};
$d$.tmp=new Set();
$aaaa$.invokeAction=function(s,t,q){ // subject , target , subject_ActionResult_Queue
	let realTarget=t;
	if(Math.random()<this._action.itemCnt(t)) this.invokeCounterAttack(realTarget=s,t);
	else if(Math.random()<this._action.itemMrf(t)) this.invokeMagicReflection(realTarget=s,t);
	else realTarget=this.invokeNormalAction(s,t);
	s.setLastTarget(t);
	if(q&&s!==t){ // already add actRes when subject is in the one of targets
		const res=s._result;
		if(res.hpDamage!==0||res.mpDamage!==0||res.stpDamage!==0) q.push(res.copy());
	}
	this.refreshStatus();
	return realTarget;
};
$aaaa$.invokeNormalAction=function(subject, target){
	const realTarget = this.applySubstitute(target);
	this._action.apply(realTarget);
	this._logWindow.displayActionResults(subject, realTarget, this._action);
	return realTarget;
};
$aaaa$.invokeCounterAttack = function(subject, target){
	const action = new Game_Action(target);
	action.setAttack();
	action.apply(subject);
	this._logWindow.displayCounter(target);
	this._logWindow.displayActionResults(target, subject, action);
};
$aaaa$.applySubstitute=function(target){
	const unit=target.friendsUnit();
	let subst=!this._action.isCertainHit()&&(
		unit.alwaysSubstitute()||target.isDying()&&unit.substituteBattler()
			// this.checkSubstitute
	);
	if(subst && target !== subst){
		this._logWindow.displaySubstitute(subst, target);
		return subst;
	}
	return target;
};
$aaaa$.forceAction=function(battler){
	this._actionForcedBattler = battler;
	let index=this._actionBattlers_obj2id.get(battler);
	if(index) this._actionBattlers._data[index]=Queue.empty;
};
$r$=$aaaa$.endBattle;
$d$=$aaaa$.endBattle=function f(res){
	f.ori.call(this,res);
	// 'meta.leaveAtBattleEnd' actors
	const delList=[],txts=[];
	for(let flag=true,arr=$gameParty.members(),x=arr.length;x--;){ if(arr[x]._meta.leaveAtBattleEnd){
		delList.push([arr[x],x]);
		if(flag){
			flag=false;
			$gameMessage.newPage();
		}
		// btlr name don't accept escape methods
		txts.push(arr[x].name().replace(f.re,"\\\\") + $dataCustom.leaveTheParty);
	} }
	while(txts.length) $gameMessage.add(txts.pop());
	// too early to delete cache, however, need to remove them from party
	delList.forEach(f.forEach,this);
}; $d$.ori=$r$;
$d$.forEach=function(info){
	const actor=info[0] , i=info[1];
	this._TBDCache.add(actor);
	const id=actor._actorId;
	$gameParty.removeActor(id,i);
	$gameActors.destroy(id);
};
$d$.re=/\\/g;
$k$='updateBattleEnd';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){
	return f.ori.call(this);
}; $d$.ori=$r$;
$aaaa$.displayRewards=function(){
	this.displayExp();
	//this.displayGold();
	//this.displayDropItems();
};
$k$='gainRewards';
$r$=$aaaa$[$k$];
$d$=$aaaa$[$k$]=function f(){
	$gameTemp.gainMsgConfigs_push();
	$gameSystem._usr._noGainMsg=0;
	$gameTemp._otherGainMsg=true;
	f.ori.call(this);
	$gameTemp._otherGainMsg=false;
	$gameTemp.gainMsgConfigs_pop();
	$gameMessage.add("\\MINOR");
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// scene

// - base
$aaaa$=Scene_Base;
$pppp$=$aaaa$.prototype;
$pppp$.updateChildren=Sprite.prototype.update;
$k$='detachReservation';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	debug.log('Scene_Base.prototype.detachReservation');
	let wl=this._windowLayer; if(wl) wl.destructor();
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.terminate=function(){
	const t=$gameScreen.tone() , satur=(255-t[3])/256;
	const c=d.ge("GameCanvas") , css=c&&c.style;
	if(css) css.filter=t[3]>0?"saturate("+ satur +")":"";
};
$pppp$.isBlurBorder=()=>false;
$pppp$=$aaaa$=undef;

// - boot
$aaaa$=Scene_Boot;
$pppp$=$aaaa$.prototype;
$pppp$.isGameFontLoaded=function(){
	if(Graphics.isFontLoaded( _global_conf.useFont ) || Graphics.canUseCssFontLoading()) return true;
	else if(Date.now()-this._startDate>=20000) throw new Error('Failed to load font');
};
$pppp$.create=function(){
	Scene_Base.prototype.create.call(this);
	DataManager.loadDatabase();
	ConfigManager.load();
	this.loadSystemWindowImage();
	if(debug.isdepress()){
		Graphics.hideFps();
		Graphics._switchFPSMeter();
		Graphics._switchFPSMeter();
	}
};
$pppp$=$aaaa$=undef;

// - itemBase
$aaaa$=Scene_ItemBase;
$pppp$=$aaaa$.prototype;
$pppp$.createActorWindow=function f(){ // rewrite: actorWindow on top with semi-transparent background to other windows
	// f.ori.call(this); // some binds to window layer cause not showing the window
	this._actorWindow = new Window_MenuActor();
	this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
	this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
	this.addChild(this._actorWindow);
};
$k$='showSubWindow';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(w){
	f.ori.call(this,w);
	w.refresh();
}; $d$.ori=$r$;
$r$=$pppp$.applyItem;
$d$=$pppp$.applyItem=function f(){
	//debug.log('Scene_ItemBase.prototype.applyItem');
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// Scene_Item
$aaaa$=Scene_Item;
$pppp$=$aaaa$.prototype;
$pppp$.onCategoryOk=function(){
	this._itemWindow.selectLast();
	this._itemWindow.activate();
};
$pppp$=$aaaa$=undef; // END Scene_Item

// - Scene_Skill
$aaaa$=Scene_Skill;
$pppp$=$aaaa$.prototype;
$pppp$=$aaaa$=undef; // END Scene_Skill

// - Scene_Equip
$aaaa$=Scene_Equip;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.create;
$d$=$pppp$.create=function f(){
	f.ori.call(this);
/*
	==== help ====
	stat cmd    $dataCustom.itemSlot
	     cmd    list
	     cmd
	     equip
*/
	// prevent (currently) useless '._refreshArrows'
	const arrowWindows=[
		this._itemWindow,
		this._slotWindow,
		this._statusWindow,
	];
	arrowWindows.forEach(w=>w._noRefreshArrows=true);
	// do stuff
	{
		const iw=this._itemWindow,stw=this._statusWindow;
		iw.height=stw.height+=iw.height;
		iw._maxCols=1;
		const cw=this._commandWindow;
		cw._maxCols=1;
		const dh=cw.lineHeight()<<1; // #rows 1 -> 3
		const slw=this._slotWindow;
		slw.height=iw.height-(cw.height+=dh);
		slw.y+=dh;
		const rw=slw.width;
		cw.width=slw.width>>=1;
		const iwh=this._itemWindowHead=new Window_Help(1);
		{ let tmp,w;
			w=this._itemWindowHead;
			tmp=w.standardFontSize();
			w.setFontsize((tmp>>1)+(tmp>>2));
			w.height=w.fittingHeight(1);
		}
		iwh.width=iw.width=rw-slw.width;
		iwh.x=iw.x+=stw.x+stw.width+slw.width;
		this.addWindow(iwh);
		iwh.drawText($dataCustom.itemSlot,0,0,iwh.contentsWidth(),'center');
		const iwhh=iwh.height;
		iw.y=(iwh.y=cw.y)+iwhh;
		iw.height-=iwhh;
	}
	{
		const slotw=this._slotWindow,cmdw=this._commandWindow;
		((cmdw._statusWindow=this._statusWindow)._commandWindow=cmdw)._slotWindow=slotw;
	}
	// font size
	{ let tmp,w;
		w=this._statusWindow;
		tmp=w.standardFontSize();
		w.setFontsize((tmp>>1)+(tmp>>3)); // 28//32 < 1 -> 0
		
		w=this._helpWindow;
//		tmp=w.standardFontSize();
//		w.setFontsize((tmp>>1)+(tmp>>3));
		{
			const oh=w.height;
			w.height=w.fittingHeight(3-!($gameSystem&&$gameSystem._usr._showFullEquipInfo));
			const dh=w.height-oh;
			this._statusWindow.y+=dh;
			this._statusWindow.height-=dh;
			this._commandWindow.y+=dh;
			this._slotWindow.y+=dh;
			this._slotWindow.height-=dh;
			this._itemWindowHead.y+=dh;
			this._itemWindow.y+=dh;
			this._itemWindow.height-=dh;
		}
	}
	// stat gets taller, help rhs
	{
		const sw=this._statusWindow;
		const hw=this._helpWindow;
		let t;
		t=sw.width;
		hw.width-=t;
		hw.x+=t;
		t=hw.height;
		sw.height+=t;
		sw.y-=t;
	}
	// for communicate
	{ const cw=this._commandWindow,slw=this._slotWindow,iw=this._itemWindow;
		slw._commandWindow = iw._commandWindow =  cw;
		slw.   _itemWindow =    cw._itemWindow =  iw;
		 cw.   _slotWindow =    iw._slotWindow = slw;
	}
	// adj arrows
	{ const stw = this._statusWindow , k0 = 'efreshArrows' , k1='_r'+k0 , k2='_noR'+k0;
		stw.adjLrArrows=true;
		arrowWindows.forEach(w=>{ w[k2]=false; w[k1](); w[k2]=true; });
	}
	// refreshes
	{
		this._statusWindow.refresh();
		this._commandWindow.refresh();
		this._slotWindow.refresh();
		this._itemWindow.refresh();
	}
	// put scene
	{
		this._slotWindow._scene=this;
		this._itemWindow._scene=this;
	}
	
	// index log
	this._lastSelMM_item=new Map();
	const iw=this._itemWindow;
	iw._logIdx=this._onItem_logIdx.bind(this);
	iw._putIdx=this._onItem_putIdx.bind(this);
}; $d$.ori=$r$;
$pppp$.refreshActor=function(){
	const actor = this.actor();
	this._statusWindow.setActor(actor);
	this._slotWindow.setActor(actor);
};
$pppp$._clearStatDiff=function(){
	const sw=this._statusWindow;
	if(sw && sw._itemNew!==undefined){
		sw._itemNew=undefined;
		sw.refresh();
	}
};
$pppp$.commandEquip=function f(){
	const sw=this._slotWindow;
	sw.activate();
	sw._scrollY=sw._scrollYM.get(this._actor)|0;
	sw.reselIdx();
	sw.reselect();
	sw.refresh();
};
$pppp$.commandOptimize=function f(){
	SoundManager.playEquip();
	const iw=this._itemWindow;
	const itemEmpty=iw._data&&(iw._data.length===0||iw._data[0]===null);
	this.actor().optimizeEquipments();
	if(!itemEmpty || (iw._data&&(iw._data.length===0||iw._data[0]===null))!==itemEmpty) iw.refresh();
	this._statusWindow.refresh();
	this._slotWindow._setSlotIdTbl();
	this._slotWindow.refresh();
	this._commandWindow.activate();
};
$k$='commandClear';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	const slw=this._slotWindow;
	slw._setSlotIdTbl();
	slw.refresh();
	const iw=this._itemWindow;
	iw._data.s=-1;
	iw.refresh();
}; $d$.ori=$r$;
$pppp$.onSlotOk=function(){
	const iw=this._itemWindow;
	iw._putIdx();
	iw.reselect();
	iw.activate();
};
$pppp$._onItem_logIdx=function(){
	const iw=this._itemWindow;
	if(!(iw._index>=0)) return;
	let lastSelM=this._lastSelMM_item.get(this._actor);
	if(!lastSelM) this._lastSelMM_item.set(this._actor,lastSelM=new Map());
	lastSelM.set(iw._slotId,[iw._scrollY,iw._index,]);
};
$pppp$._onItem_putIdx=function(){
	const iw=this._itemWindow;
	const lastSelM=this._lastSelMM_item.get(this._actor);
	const info=lastSelM&&lastSelM.get(iw._slotId);
	if(info){
		const sy=info[0],idx=info[1];
		iw._scrollY=sy;
		iw._index=(idx>=0?(idx>=iw._data.length?iw._data.length-1:idx):0);
	}else iw._index=iw._scrollY=0;
};
$pppp$._onItem_deSel=function(){
	const iw=this._itemWindow;
	const idx=iw._index;
	iw._index=-1;
	iw.updateCursor();
	iw._index=idx;
};
$pppp$.onSlotCancel=function(){
	this._onItem_deSel();
	this._slotWindow.deselect();
	this._clearStatDiff();
	this._commandWindow.activate();
};
$pppp$.onItemOk=function(){
	SoundManager.playEquip();
	// this.actor().changeEquip(this._slotWindow.index(), this._itemWindow.item());
	const sw=this._slotWindow , iw=this._itemWindow;
	{
		const item=iw.item();
		iw._newUnEquip=this.actor().changeEquip(iw._slotId, item, iw._slotIdExt);
		if(item && !iw._newUnEquip && iw._slotIdExt!==undefined){
			sw._setSlotIdTbl();
			sw.select(sw._index+1);
		}
	}
	//iw.deselect();
	this._onItem_deSel();
	iw.refresh();
	sw._setSlotIdTbl();
	sw.activate();
	sw.refresh();
	this._statusWindow.refresh();
};
$pppp$.onItemCancel=function(){
	this._slotWindow.activate();
	//iw.deselect();
	this._onItem_deSel();
	this._clearStatDiff();
};
$pppp$=$aaaa$=undef;

// - save
$aaaa$=Scene_Save;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this._oriSwitchVal=undefined;
}; $d$.ori=$r$;
$k$='onSavefileOk';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if($gameTemp._switchTrue_if_saved_id){
		this._oriSwitchVal=$gameSwitches.value($gameTemp._switchTrue_if_saved_id,true);
		$gameSwitches.setValue($gameTemp._switchTrue_if_saved_id,true);
	}
	f.ori.call(this);
	if(!$gameTemp._switchTrue_if_saved_preserveId) $gameTemp._switchTrue_if_saved_id=undefined;
}; $d$.ori=$r$;
$k$='onSaveFailure';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	if($gameTemp._switchTrue_if_saved_id) $gameSwitches.setValue($gameTemp._switchTrue_if_saved_id,this._oriSwitchVal);
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - title
$aaaa$=Scene_Title;
$pppp$=$aaaa$.prototype;
$pppp$._edt=function f(){
	if(!f.ori){
		f.ori=deepcopy($dataSystem);
		f.tbl={};
	}
	let tmp=location.pathname.match(/\/([A-Za-z0-9]+)\.html$/);
	const info=tmp&&tmp[1];
	
	const cursorDiv_id='cursorDiv';
	const cursorDiv=d.ge(cursorDiv_id);
	let cursorCss;
	let mouseMvEvtFunc;
	
	let useDefault=false;
	$dataCustom.apps=$dataCustom.apps_ori;
	$dataSystem.currencyUnit=$dataSystem.currencyUnit_ori;
	$dataSystem.titleBgm=deepcopy($dataSystem.titleBgm_ori);
	objs.confs={};
	switch(sha256(info)){
	case "book":{
		$dataSystem. title1Name = "Book";
		$dataSystem. gameTitle  = "☆作者的垃圾話時間☆";
		$dataSystem. partyMembers = [17];
	}break;
	case "0x859FACC5A4C9B80AC2EEF78916C1953BCCCAAB6014BB11B9DE8337430EA34F0C":{
		let ori=f.ori;
		$dataSystem. title1Name = ori.title1Name ;
		$dataSystem. startMapId = ori.startMapId ;
		$dataSystem. gameTitle  = "燒毀" ;
		$dataSystem. partyMembers = [17];
		
		let burnLv = localStorage.getItem("maxBurnLv")|0;
		$dataSystem.title1Name+="?color="+encodeURIComponent("[[4,"+burnLv+",0],["+burnLv+",44,0],[0,0,1]]");
		$dataSystem.currencyUnit="B幣";
	}break;
	default:
		useDefault=true;
	case "0x2A97516C354B68848CDBD8F54A226A0A55B21ED138E207AD6C5CBB9C00AA5AEA":{
		$dataSystem. title1Name = "Fountain";
		$dataSystem. gameTitle  = "做一堆遊戲都用同一份檔案，好省";
		$dataSystem. startMapId = 272 ;
		$dataSystem. partyMembers = [21];
		$dataSystem. titleBgm={name: "03_Lonely_Departure", pan: 0, pitch: 119, volume: 50};
		$dataSystem.currencyUnit="D幣";
	}break;
	case "0x780D88ACF70DF7B68290F99F4E4544C267562B3E8FCFD1D75DAC6842942575CF":{
		$dataSystem. title1Name = "Volcano";
		$dataSystem. gameTitle  = "拉起封鎖線";
		$dataSystem. startMapId = 8 ;
		$dataSystem. partyMembers = [12];
		$dataSystem.currencyUnit="K幣";
	}break;
	case "0x187897CE0AFCF20B50BA2B37DCA84A951B7046F29ED5AB94F010619F69D6E189":{
		$dataSystem. title1Name = "Dragon";
		let maxMember=Number(localStorage.getItem("maxMember"))|0;
		let actorId=16,actorMp=$dataClasses[$dataActors[actorId].classId].params[1][1];
		$dataSystem. partyMembers = [actorId];
	//	let last=~~( actorMp/(~~( actorMp / maxMember )) )||0;
		++maxMember;
		let mpCost=$dataSkills[12].mpCost = ~~( actorMp / maxMember );
		$dataSystem. gameTitle  = maxMember+"個人不夠,你有試過"+(maxMember+1)+"個人嗎?";
	//	let curr=~~(actorMp/mpCost);
	//	$dataSystem. gameTitle  = (last+1)+"個人不夠,你有試過"+(curr+1)+"個人嗎?";
		$dataSystem. startMapId = 101 ;
		$dataSystem.currencyUnit="M幣";
	}break;
	case "0x909CA0096D519DCF94ABA6069FA664842BDF9DE264725A6C543C4926ABE6BDFA":{
		$dataSystem. title1Name = "Sword";
		$dataSystem. gameTitle  = "反射";
		$dataSystem. startMapId = 276 ;
		$dataSystem.currencyUnit="ㄈ幣";
		objs.confs.useStp=true;
		
		if(!f.tbl.cursorImg_rfl){
			const c=d.ce('canvas'),c2=d.ce('canvas');
			const sx=-24,sy=-30;
			const w=c2.width  =c.width  =Sprite_Weapon.width;
			const h=c2.height =c.height =Sprite_Weapon.height;
			c.getContext('2d').drawImage(ImageManager.loadSystem("Weapons1")._image,w*2,0,w,h,sx,sy,w,h);
			const ctx2=c2.getContext('2d');
			ctx2.scale(-1,1);
			ctx2.drawImage(c,-w,0);
			f.tbl.cursorImg_rfl=c.toDataURL();
			f.tbl.cursorImg2=c2.sa('class','abs').sa('style','z-index:-1;top:100%');
			f.tbl.cursorImg2.onmousemove=e=>e.preventDefault();
			f.tbl.mouseMvEvtFunc=function(e){
				const x=e.layerX,y=e.layerY;
				f.tbl.cursorImg2.style.top=y+"px";
				f.tbl.cursorImg2.style.right=x+"px";
			};
		}
		const id='cursorCss_rfl';
		cursorCss=d.ge(id);
		if(!cursorCss) d.head.ac(cursorCss=d.ce('style').sa("id",id).at("div."+id+"{z-index:404;cursor:url("+f.tbl.cursorImg_rfl+") 0 0,auto;}"));
		mouseMvEvtFunc=f.tbl.mouseMvEvtFunc;
	}break;
	case "0x0CF35AB8CF8D2C5A4D14CB9E2E4ED472C72C7D65A5095B0EE095CE92223CF661":{
		$dataSystem. title1Name = "Crystal";
		$dataSystem. gameTitle  = "如果我有一座新冰箱";
		$dataSystem. startMapId = 139 ;
		$dataSystem. partyMembers = [20];
		$dataSystem. titleBgm=objs.rndmusic();
		$dataSystem.borrowDays=30;
		$dataSystem.enemyCnts=[10,15,20,40,50,100];
		$dataCustom.apps="便利功能";
		$dataSystem.currencyUnit="R幣";
		objs.confs.noRestoreHpMp=true;
		objs.confs.useStp=true;
	}break;
	case "0x9BBA5C53A0545E0C80184B946153C9F58387E3BD1D4EE35740F29AC2E718B019":{
		$dataSystem. title1Name = "tester";
		$dataSystem. gameTitle  = "作者在雷吧?遊戲測試員的無奈!";
		$dataSystem. startMapId = 256 ;
		$dataSystem. partyMembers = [23];
		$dataSystem. titleBgm = objs.rndmusic();
		$dataSystem.currencyUnit = "T幣";
	}break;
	}
	
	if(cursorCss){
		if(!cursorDiv) d.ge('div999').ac(f.tbl.cursorDiv||(
			f.tbl.cursorDiv=d.ce('div').sa('id',cursorDiv_id).sa('class','full '+cursorCss.id).ac(
				f.tbl.cursorImg2
			).ac(
				d.ce('div').sa('class','full')
			)
			//d.ce('div').sa('id',cursorDiv_id).sa('class','full '+cursorCss.id).sa('style','touch-action: none; user-select: none;').ac(f.tbl.cursorImg2)
		));
		f.tbl.cursorDiv.onmousemove=mouseMvEvtFunc;
		this._cursorDiv=f.tbl.cursorDiv;
	}else{
		if(cursorDiv) cursorDiv.parentNode.removeChild(cursorDiv);
		this._cursorDiv=null;
	}
	
	if(useDefault) history.replaceState(undefined , document.title=$dataSystem.gameTitle, location.search + "#"+location.hash.slice(1) );
	else history.replaceState(undefined , document.title=$dataSystem.gameTitle, "./"+info+".html" + location.search + "#"+location.hash.slice(1) );
	if($gameTemp) $gameTemp.clearCacheAll();
};
$r$=$pppp$.create;
$d$=$pppp$.create=function f(){
	debug.log('Scene_Title.prototype.create');
	this._edt();
	f.ori.call(this);
	$dataMap=null;
	$gamePlayer=objs.$gamePlayer=null;
	let refreshes=objs._refreshVars;
	for(let i in refreshes) refreshes[i]();
	$gameSystem._usr=0;
}; $d$.ori=$r$;
$pppp$.start=function(){
	Scene_Base.prototype.start.call(this);
	SceneManager.clearStack();
	this.centerSprite(this._backSprite1);
	this.centerSprite(this._backSprite2);
	this.playTitleMusic();
	this.startFadeIn(this.fadeSpeed(), false);
};
$r$=$pppp$.terminate;
$d$=$pppp$.terminate=function f(){
	f.ori.call(this);
	if(this._cursorDiv) this._cursorDiv.parentNode.removeChild(this._cursorDiv);
}; $d$.ori=$r$;
$pppp$.createBackground=function(){
	let t;
	
	this._backSprite1 = new Sprite(ImageManager.loadTitle1(t=$dataSystem.title1Name));
	if(t) this.addChild(this._backSprite1);
	else this._backSprite1.visible=false;
	
	this._backSprite2 = new Sprite(ImageManager.loadTitle2(t=$dataSystem.title2Name));
	if(t) this.addChild(this._backSprite2);
	else this._backSprite2.visible=false;
};
$pppp$.createCommandWindow = function() {
	const cw = this._commandWindow = new Window_TitleCommand();
	cw.setHandler('newGame',  this.commandNewGame.bind(this));
	cw.setHandler('continue', this.commandContinue.bind(this));
	cw.setHandler('options',  this.commandOptions.bind(this));
	if(this.addCustomCommands) this.addCustomCommands();
	cw.y = ((Graphics.boxHeight - cw.height)*7)>>3;
	this.addWindow(cw);
};
$pppp$.addCustomCommands=function(){
	const cw=this._commandWindow;
	if(debug&&debug.isdebug()) cw.setHandler('customTitleCmd',  this.customTitleCommand.bind(this));
	cw.setHandler('CLOSEGAME', ()=>{SceneManager.pause();d.body.rf(0);});
//	cw.setHandler('loadOnlineSave',   ()=>{SceneManager.push(Scene_LoadOnline );});
	cw.setHandler('loadLocalSave',    ()=>{SceneManager.push(Scene_LoadLocal  );});
//	cw.setHandler('saveLocal',        SceneManager._savelocal );
	cw.setHandler('saveOpts',         SceneManager._saveopts  );
	cw.setHandler('usrSwitch_global', SceneManager._usrswitch );
	cw.setHandler('feedback',         SceneManager._feedback  );
};
$pppp$.customTitleCommand=function(){
	// do nothing
	deubug.log("Scene_Title.prototype.customTitleCommand");
	//debugger;
	this._commandWindow.close();
	return SceneManager.push(Scene_Title); // call stack not stacking . amazing !
};
$pppp$.drawGameTitle=function(){
	let fontsize=72;
	let x = 20;
	let y = fontsize*1.25;
	let maxWidth = Graphics.width - x * 2;
	let text = $dataSystem.gameTitle;
	this._gameTitleSprite.bitmap.outlineColor = 'black';
	this._gameTitleSprite.bitmap.outlineWidth = 8;
	this._gameTitleSprite.bitmap.fontSize = fontsize;
	this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
};
$pppp$.centerSprite=function(sprite){
	sprite.x = Graphics.width>>1;
	sprite.y = Graphics.height>>1;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
};
$pppp$=$aaaa$=undef;

// - menu
$aaaa$=Scene_Menu;
$pppp$=$aaaa$.prototype;
$pppp$.create=function(){
	// reset device detection
	Utils._isAndroidChrome=undefined;
	Utils._isMobileDevice=undefined;
	Utils._isMobileSafari=undefined;
	// main
	Scene_MenuBase.prototype.create.call(this);
	// - gold window before command window
	this.createGoldWindow();
	this.createMsgWindow();
	this.createCommandWindow();
	this.createStatusWindow();
};
$d$=$pppp$.createMsgWindow=function f(){
	let msg=this._msgWindow=new f.msgc(0,0, this._goldWindow.width, this._goldWindow.height + f.msgc.prototype.lineHeight() );
	msg.update=f.update;
	msg.flwing=null;
	this.addWindow(msg);
};
$d$.msgc=Window_DummyWithText;
$d$.update=function f(){
	let flwrs=$gamePlayer&&$gamePlayer._followers;
	if(!flwrs) return;
	if(flwrs._flwing!==this.flwing){
		this.flwing=flwrs._flwing;
		f.msgc.prototype.update.call(this);
		let c=this.contents;
		c.clear();
		let txt1=this.flwing?$dataCustom.flwingMsgs.yes:$dataCustom.flwingMsgs.no;
		let txt2="隊伍共"+$gameParty.allMembers().length+"位";
		this.drawText(txt1,0,0,c.width,'center');
		this.drawText(txt2,0,f.msgc.prototype.lineHeight(),c.width,'center');
	}
};
$d$.update.msgc=$d$.msgc;
$pppp$.createCommandWindow=function(){
	const sy = this._msgWindow.height , cmdw = this._commandWindow = new Window_MenuCommand(0, sy ,{maxHeight:this._goldWindow.y-sy});
	cmdw.setHandler('item', 	this.commandItem.bind(this));
	cmdw.setHandler('skill',	this.commandPersonal.bind(this));
	cmdw.setHandler('equip',	this.commandPersonal.bind(this));
	cmdw.setHandler('status',	this.commandPersonal.bind(this));
	cmdw.setHandler('formation',	this.commandFormation.bind(this));
	cmdw.setHandler('options',	this.commandOptions.bind(this));
	cmdw.setHandler('save', 	this.commandSave);
	cmdw.setHandler('gameEnd',	this.commandGameEnd.bind(this));
	cmdw.setHandler('cancel',	this.popScene.bind(this));
	if(this.addCustomCommands) this.addCustomCommands();
	this.addWindow(cmdw);
};
$d$=$pppp$.addCustomCommands=function f(){
	const cmdw=this._commandWindow;
	cmdw.setHandler('debugMenu2', ()=>{SceneManager.push(Scene_DebugMenu2);} );
	if(this.addV_I_M) this.addV_I_M();
	cmdw.setHandler('plan', ()=>{ // cmdw.active=false; // already
		this._windowLayer.visible=false;
		if(this._battlePlan===undefined){
			const plan = this._battlePlan = new Window_BattlePlan , bye=()=>this._windowLayer.visible=cmdw.active=!(plan.visible=plan.active=false);
			SceneManager._scene.addChild(plan);
			plan.setHandler('cancel' ,bye);
			plan.setHandler('ok'     ,bye);
		//	plan.setHandler('cancel', ()=>{
		//		bye();
		//		//$gameMessage.popup($dataCustom.plan.msgOnCancel,true);
		//	});
		//	plan.setHandler('ok', ()=>{
		//		bye();
		//		$gameMessage.popup($dataCustom.plan.msgOnOk,true);
		//	});
			//plan.refresh(); // in init
		}else{
			const plan=this._battlePlan;
			plan.visible=plan.active=true;
			plan.refresh();
		}
	});
	cmdw.setHandler('apps',       SceneManager._apps       );
		//cmdw.setHandler('questMgr', ()=>{SceneManager.push(Scene_Quest);} );
		//cmdw.setHandler('achievement', ()=>{SceneManager.push(Scene_Achievement);} );
	cmdw.setHandler('usrSwitch',  SceneManager._usrswitch  );
	cmdw.setHandler('feedback',   SceneManager._feedback   );
//	cmdw.setHandler('saveLocal',  SceneManager._savelocal  );
	cmdw.setHandler('saveOpts',   SceneManager._saveopts   );
//	cmdw.setHandler('saveOnline', SceneManager._saveonline );
};
$d$.setCancel=(w,f)=>{w.setHandler('cancel');return w;};
// - menu: V_I_M
$pppp$.addV_I_M=function(){
	return this._commandWindow.setHandler('gifts', ()=>{
		let cw=this._commandWindow;
		if(!window['/tmp/']) window['/tmp/']={};
		if(window['/tmp/'].V_I_M){
			delete window['/tmp/'].V_I_M;
			Scene_DebugMenu2.prototype.createOptionsWindow.debugPack(1);
			cw._list=this._commandWindow._list.filter(x=>!x||x.symbol!=="gifts");
			cw.height=cw.windowHeight();
			for(let x=0,arr=cw._list;x!==arr.length;++x) cw.redrawItem(x);
		}else SoundManager.playBuzzer();
		cw.activate();
		//SceneManager.goto(this.constructor);
	});
};
$pppp$=$aaaa$=undef;


// - map

$aaaa$=Scene_Map;
$pppp$=$aaaa$.prototype;
$pppp$.terminate=function(){
	Scene_Base.prototype.terminate.call(this);
	if(!SceneManager.isNextScene(Scene_Battle)){
		this._spriteset.update();
		this._mapNameWindow.hide();
		SceneManager.snapForBackground();
	}else ImageManager.clearRequest();
	
	if(SceneManager.isNextScene(Scene_Map)) ImageManager.clearRequest();
	
	$gameScreen.clearZoom();
};
$d$=$pppp$.create=function f(){
	//debug.log('Scene_Map.prototype.create');
	// release Image reservations
	if($dataMap) ImageManager.releaseReservation(f.preload);
	Scene_Base.prototype.create.call(this);
	const mid=$gameMap._mapId,midn=(this._transfer = $gamePlayer.isTransferring()) ? $gamePlayer.newMapId() : mid;
	const q=$dataMap&&$dataMap.strtEvts;
	if(!q||mid!==midn) DataManager.loadMapData( midn );
};
$d$.preload="preload";
$d$=$pppp$._createPannels=function f(){
	if(!this._pannel){
		this._windowLayer.addChildBefore(this._pannel=new Window_CustomRealtimeMsgs({fontSize:16}),this._messageWindow);
	}
	let p=this._pannel;
	f.burnLv(p);
	f.chr(p);
	f.speedup(p);
	if($gameParty.canplant) f.plant(p);
	else{
		f.burn(p);
		f.slash(p);
	}
	f.flwing(p);
};
$d$.burnLv=function(pannel){
	if($gameParty.burnLv){
		let arr=pannel._windows,bl=$dataMap.burnlv_pannel=pannel.add($gameParty,'burnLv',{head:"燃燒等級",align:'center'});
		if(arr.length!==1){
			let top=arr[0].y;
			let btm=bl.y+bl.height;
			for(let x=0,xs=arr.length-1;x!==xs;++x) arr[x].y+=bl.height;
			bl.y=top;
			let empty=pannel.add(window,'',{updateItvl:"no"});
			empty.y=$dataMap.burnlv_pannel.y;
			empty.visible=false;
		}
	}
};
$d$.chr=function(pannel){
	if(!$gameSystem._usr._noLeaderHp) pannel.hpl=pannel.add($gameParty,(pt)=>{
		const L=pt.leader();
		return L?L.hp:"N/A";
	},{head:($gameParty.allMembers().length>1?"隊長":"")+"HP ",updateItvl:40,align:'left'});
	if(!$gameSystem._usr._noLeaderMp) pannel.mpl=pannel.add($gameParty,(pt)=>{
		const L=pt.leader();
		return L?L.mp:"N/A";
	},{head:($gameParty.allMembers().length>1?"隊長":"")+"MP ",updateItvl:40,align:'left'});
};
$d$.speedup=function(pannel){
	if($gamePlayer.speedup) pannel.add($gamePlayer,'speedup',{head:"疾風Lv",align:'center'});
};
$d$.plant=function(pannel){
	if(!$gameParty.canplant) return;
	let rmc=c=>pannel.del(c);
	if(pannel._slashSet){
		pannel._slashSet.forEach(rmc);
		pannel._slashSet.length=0;
	}
	if(pannel._burnSet){
		pannel._burnSet.forEach(rmc);
		pannel._burnSet.length=0;
	}
	if(!pannel._plantSet) pannel._plantSet=[];
	let arr=pannel._plantSet;
	arr.push(pannel.add($gameParty,(pt)=>{
		if($dataItems[pt.canplant]) return $dataItems[pt.canplant].name;
		else{
			pannel._plantSet.forEach(rmc);
			pannel._plantSet.length=0;
			this.burn(pannel);
			this.slash(pannel);
		}
	},{align:'center'}));
	let ws=pannel._windows;
	let last=ws.back;
	let x=last.x+last.width;
	if(0&&$gameParty.plantrange){
		let w=pannel.add($gameParty,'plantrange',{head:"種樹Lv",align:'center',x:x,y:ws.back.y});
		arr.push(last=w);
		x=last.x+last.width;
	}
	if($gameParty._canburn){
		let w=pannel.add($gameParty,'_canburn',{align:'center',x:x,y:ws.back.y});
		arr.push(last=w);
		last.alpha=0.5;
		x=last.x+last.width;
	}
	if($gameParty._canslash){
		let w=pannel.add($gameParty,'_canslash',{align:'center',x:x,y:ws.back.y});
		arr.push(last=w);
		last.alpha=0.5;
		x=last.x+last.width;
	}
};
$d$.burn=function(pannel){
	if(pannel._burnSet){
		if(pannel._burnSet.length) return;
	}else pannel._burnSet=[];
	let arr=pannel._burnSet;
	if($gameParty.canburn){
		let last=pannel.add($gameParty,'canburn',{align:'center'});
		arr.push(last);
		let x=last.x+last.width;
		if($gameParty.burnrange) arr.push(pannel.add($gameParty,'burnrange',{head:"烈火Lv",align:'center',x:x,y:pannel._windows.back.y}));
	}
};
$d$.slash=function(pannel){
	if(pannel._slashSet){
		if(pannel._slashSet.length) return;
	}else pannel._slashSet=[];
	let arr=pannel._slashSet;
	if($gameParty.canslash){
		let last=pannel.add($gameParty,'canslash',{align:'center'});
		arr.push(last);
		let x=last.x+last.width;
		if($gameParty.slashrange) arr.push(pannel.add($gameParty,'slashrange',{head:"伐木Lv",align:'center',x:x,y:pannel._windows.back.y}));
	}
};
$d$.flwing=function(pannel){
	if($gameSystem._usr._flwingMsg && $dataSystem.gameTitle==="拉起封鎖線"){
		$dataMap.flwing_pannel=pannel.add($gamePlayer._followers,flwrs=>flwrs._following?$dataCustom.flwingMsgs.yes:$dataCustom.flwingMsgs.no,{align:'center',updateItvl:'no'});
	}
};
$k$='checkGameover';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	return !$gameMap._interpreter.isRunning()&&f.ori.call(this);
}; $d$.ori=$r$;
$k$='onMapLoaded';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	//debug.log('Scene_Map.prototype.onMapLoaded');
	//debug.log('!$dataMap',!$dataMap);
	Sprite._counter&=0; // reset Sprite.spriteId counter // sprites will be in 'SceneManager._scene._spriteset._tilemap.children'
	// '$dataMap' is updated ; '$gameMap' will be updated after 'f.ori' if by '$gamePlayer.reserveTransfer'
	if($gameScreen){
		// reset tone and viewRange
		if($gameScreen._tone){
			for(let x=0,arr=$gameScreen._tone;x!==arr.length;++x) arr[x]&=0; // reset tone
			$gameScreen.limitedView=false; // reset viewRange
		}
		// reset weather
		if($gameScreen._weatherPower) $gameScreen.clearWeather();
	}
	const lastMapId=$gameMap&&$gameMap._mapId;
	f.ori.call(this); // update '$gameMap' (and maybe others)
	$gameTemp.poolEvt_newMap($gameMap._mapId);
	Graphics._preCalScreenTileCoord(); // pre-cal. $gameMap.screenTileX(); $gameMap.screenTileY();
	// custom pannels
	this._createPannels();
	f.fastSearchTbl();
	// starting events from saves
	if($gameMap._mapId===lastMapId && $gameMap._strtEvts){
		const src=$gameMap._strtEvts;
		delete $gameMap._strtEvts;
		const strts_nsm=$dataMap.strtEvts_noStopMove,strts=$dataMap.strtEvts;
		src.forEach(x=>{
			const rtv=[$gameMap._events[x[0]],x[1]];
			strts.push(rtv);
			if(rtv[0].event().meta.noStopMove) strts_nsm.push(rtv);
		});
	}
	// - construct <block> released page (cond:{ss:E})
	for(let x=0,arr=$dataMap.eventsByMeta.block||[];x!==arr.length;++x){
		let evtd=$dataMap.events[arr[x]];
		if(evtd&&evtd.pages&&evtd.pages.length){
			let newpage=deepcopy(evtd.pages[0]),conds=newpage.conditions;
			conds.selfSwitchCh="E";
			conds.selfSwitchValid=true;
			newpage.through=true;
			evtd.pages.push(newpage);
		}
	}
	//debug.log('',lastMapId,'->',$gameMap._mapId);
		// from '$gamePlayer.reserveTransfer': different
		// from New Game: 0 -> init_map_id
		// from Continue: same
		// from scenePush and then scenePop (e.g. open menu then close it): same
	if($gameMap._mapId!==lastMapId){ // map changed
		// clear temp:clearedWhenNewMap to '{}'
		$gameTemp.initClearedWhenNewMap();
		// active initialization events: turn on its switch "A"
		for(let x=0,arr=$dataMap.events;x!==arr.length;++x){ let evt=arr[x];
			if(evt&&evt.note==="init") $gameSelfSwitches.setValue([$gameMap._mapId,x,"A"],1);
		}
		// random map
		if($dataMap.meta.random){
			delete $gameParty.mch().randmaze; // clear before maze generation
			f.genRandMaze();
		}
		// workers
		if($gameParty) $gameParty.members().forEach(x=>rpgskills.list.rfl_summonClones_fromActorWorkers(x));
	}
	if(!$gameTemp.clearedWhenNewMap) $gameTemp.initClearedWhenNewMap(); // for load game
	
	// menu disable?
	$gameSystem._menuEnabled=!$dataMap.meta.disableMenu;
	// tone
	if($dataMap.meta.tone){
		let j=$dataMap.meta.tone_cond;
		if(j?objs._getObj(j):true) $gameScreen._tone=JSON.parse($dataMap.meta.tone);
	}
	//else $gameScreen._tone=[0,0,0,0]; // already reset near the begin of this function
	// weather
	if($dataMap.meta.weather){
		let j=$dataMap.meta.weather_cond;
		if(j?objs._getObj(j):true) $gameScreen.changeWeather.apply($gameScreen,JSON.parse($dataMap.meta.weather));
	}
}; $d$.ori=$r$;
$d$.fastSearchTbl=function(){
	// fast search table
	// - $dataMap.coordTbl : (x,y)=>events
	if(!($dataMap.coordTbl&&$dataMap.coordTbl.mapid===$gameMap._mapId)){
		let tbl=$dataMap.coordTbl=[],w=$dataMap.width;
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue(); // .coordTbl
		for(let x=0,evts=$gameMap._events;x!==evts.length;++x){ let evt=evts[x];
			if(!evt || !$gameMap.isValid(evt.x,evt.y)) continue;
			tbl[evt.y*w+evt.x].push(evt);
		}
		tbl.mapid=$gameMap._mapId;
		
		// _Nt ( prevent creation of arrays when eventXyNt )
		tbl=$dataMap.coordTblNt=[];
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue(); // .coordTblNt
		for(let x=0,evts=$gameMap._events;x!==evts.length;++x){ let evt=evts[x];
			if(!evt || !$gameMap.isValid(evt.x,evt.y) || evt.isThrough()) continue;
			tbl[evt.y*w+evt.x].push(evt);
		}
		
		// _NtP1 ( prevent creation of arrays when eventXyNt )
		tbl=$dataMap.coordTblNtP1=[];
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue(); // .coordTblNt
		for(let x=0,evts=$gameMap._events;x!==evts.length;++x){ let evt=evts[x];
			if(!evt || !$gameMap.isValid(evt.x,evt.y) || evt.isThrough() || evt._pri!==1) continue;
			tbl[evt.y*w+evt.x].push(evt);
		}
		
		// _strtByAny
		tbl=$dataMap.coordTbl_strtByAny=[]; // for _pri!==1
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue(); // .coordTblNt
		for(let x=0,evts=$gameMap._events;x!==evts.length;++x){ let evt=evts[x];
			if( !evt || evt._pri===1 || !evt._strtByAny || !$gameMap.isValid(evt.x,evt.y) ) continue;
			tbl[evt.y*w+evt.x].push(evt);
		}
		
		// _strtByAny_P1
		tbl=$dataMap.coordTbl_strtByAny_P1=[]; // for _pri===1
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue(); // .coordTblNt
		for(let x=0,evts=$gameMap._events;x!==evts.length;++x){ let evt=evts[x];
			if( !evt || evt._pri!==1 || !evt._strtByAny || !$gameMap.isValid(evt.x,evt.y) ) continue;
			tbl[evt.y*w+evt.x].push(evt);
		}
	}
	// - $dataMap.strtEvts : a list of starting events ; $dataMap.strtEvts_noStopMove : only for 'meta.noStopMove'
	if(!($dataMap.strtEvts&&$dataMap.strtEvts.mapid===$gameMap._mapId)){
		($dataMap.strtEvts_noStopMove=new Queue()).mapid=($dataMap.strtEvts=new Queue()).mapid=$gameMap._mapId;
	}
	// - indexing events by their meta.something_is_true
	if($dataMap && !$dataMap.eventsByMeta){
		$dataMap.eventsByMeta={};
		let ebm=$dataMap.eventsByMeta;
		for(let x=0,arr=$dataMap.events;x!==arr.length;++x){
			let evt=arr[x]; if(!evt) continue;
			for(let key in evt.meta){ if(evt.meta[key]!==true) continue;
				if(ebm[key]===undefined) ebm[key]=[];
				ebm[key].push(x);
			}
		}
	}
	// - followers
	if($dataMap && !($gameTemp._flrs_coord&&$gameTemp._flrs_coord.mapid===$gameMap._mapId)){
		let tbl=$gameTemp._flrs_coord=[],w=$dataMap.width,flrs=$gamePlayer._followers._data;
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Set();
		let len=$gameParty.battleMembers().length; if(len){ for(let x=0,xs=len-1;x!==xs;++x){ let flr=flrs[x];
			let s=tbl[flr.xy2idx()]; if(s) s.add(flr);
		} }
		tbl.mapid=$gameMap._mapId;
	}
};
$d$.genRandMaze=function f(){
	debug.log('Scene_Map.prototype.onMapLoaded.genRandMaze');
	if(!f.inited){ f.inited=true;
		f.idx2xy=(idx)=>{
			let w=$gameMap.width();
			return {x:idx%w,y:~~(idx/w)};
		};
		f.dirs=[[-1,0],[0,-1],[0,1],[1,0]];
		f.calDist2=(idx1,idx2)=>{
			let xy1=f.idx2xy(idx1);
			let xy2=f.idx2xy(idx2);
			let dx=xy1.x-xy2.x;
			let dy=xy1.y-xy2.y;
			if($gameMap.isLoopHorizontal()) dx=Math.min(dx,$gameMap.width ()-dx);
			if($gameMap.isLoopVertical  ()) dy=Math.min(dy,$gameMap.height()-dy);
			return dx*dx+dy*dy;
		};
		f.isBreakingBlock=(mark,p,idx,dirIdx)=>{ // 'dirIdx' is not used
			let xy=f.idx2xy(idx);
			let w=$gameMap.width ();
			let h=$gameMap.height();
			let loopH=$gameMap.isLoopHorizontal();
			let loopV=$gameMap.isLoopVertical  ();
			return f.dirs.map((dir)=>{
				let newx=xy.x+dir[0],newy=xy.y+dir[1];
				if(loopH) newx=(newx+w)%w;
				if(loopV) newy=(newy+h)%h;
				let newidx=newy*w+newx;
				return (newx>=0&&newx<w&&newy>=0&&newy<h && mark[newidx]===p);
			}).sum()>1;
		};
	}
	let meta=$dataMap.meta;
	if(!meta.tilepass || !meta.tileblock || !meta.tileentry) return;
	let tilepass  = meta.tilepass  .split(',').map(Number);
	let tileblock = meta.tileblock .split(',').map(Number);
	let tileentry = meta.tileentry .split(',').map(Number);
	if((tilepass.length&&tileblock.length&&tileentry.length)===0) return;
	let w=$dataMap.width,h=$dataMap.height,sz=w*h;
	let loopH=$gameMap.isLoopHorizontal(),loopV=$gameMap.isLoopVertical();
	
	let tiles=[undef,tileentry,tileblock,tilepass];
	// 'mch().randmaze' is deleted before calling this function
	let B=0,e=1,b=2,p=3,data=$gameMap.data(),mark=[]; mark.length=sz;
	let entries=[];
	
	// init 'mark'
	for(let y=0;y!==h;++y){ for(let x=0;x!==w;++x){
		let idx=y*w+x;
		mark[idx]=B;
		for(let i=1;i!==tiles.length;++i){
			let marked=false;
			for(let k=0^0;k<tiles[i].length;k+=2){
				if(data[tiles[i][k]*sz+idx]===tiles[i][k|1]){
					mark[idx]=i; marked=true; break;
				}
			}
			if(marked) break;
		}
		if(mark[idx]===e) entries.push(idx);
		else if(mark[idx]===b) mark[idx]=B;
		else if(mark[idx]===p) mark[idx]=b; // prepared for following process
		
	}}
	
	if(entries.length){
		let pidx=$gamePlayer.xy2idx();
		entries.sort( (a,b)=>f.calDist2(a,pidx)-f.calDist2(b,pidx) );
		let mark_bak=deepcopy(mark);
		
		let solvable=0;
		while(!solvable){
			// gen maze
			mark=deepcopy(mark_bak);
			let strt=entries[0],ende=entries[1],goldenRate=(Math.sqrt(5)-1)/2,longerEdge=Math.max(w,h);
			let visited=[],heap=new Heap((a,b)=>a[1]-b[1]);
			visited.length=sz;
			heap.push([strt,sz*sz,-1]);
			while(heap.length){
				//if(Math.random()*64<1) continue; // rand
				let curr=heap.top; heap.pop();
				if(visited[curr[0]]) continue;
				visited[curr[0]]=true;
				if( curr[2]>=0 && f.isBreakingBlock(mark,p,curr[0],curr[2]) ) continue;
				mark[curr[0]]=p;
				let currxy=f.idx2xy(curr[0]);
				let candi=f.dirs.map((dir,idx)=>{
					let newx=currxy.x+dir[0],newy=currxy.y+dir[1]; if(loopH) newx=(newx+w)%w; if(loopV) newy=(newy+h)%h;
					let newidx=newy*w+newx;
					if(newx<0||newx>=w||newy<0||newy>=h || mark[newidx]!==b) return;
					let dist2=0;
					if(entries[1]!==undefined){
						//dist2+=f.calDist2(entries[1],newidx);
						//dist2-=168; dist2*=0<dist2;
						//dist2*=Math.random()+goldenRate;
						//dist2*=Math.random()*0.5+0.5;
						//dist2+=Math.random()*longerEdge;
						//dist2^=0;
					}
					return [newidx,dist2,idx];
				}).filter(x=>x).sort((a,b)=>a[1]-b[1]);
				if(candi.length){
					let tmp=candi.pop(); heap.push(tmp);
					while(candi.length && f.isBreakingBlock(mark,p,tmp[0])){ // guarantee
						// if previous break wall, add next. main while-loop will skip those break walls, but push-to-heap-no-matter-what is some kind of waste.
						tmp=candi.pop(); heap.push(tmp);
					}
					while(candi.length){
						let tmp=candi.pop();
						if(Math.random()*4>=1) heap.push(tmp); // rand
						//heap.push(tmp); // guarantee
					}
				}
			}
			// search test
			if(ende===undefined) break; // no needed testing
			visited.length=0;
			let q=new Queue(mark.length<<1); q.push(strt);
			while(q.length){
				let curr=q.front; q.pop();
				if(visited[curr]) continue;
				visited[curr]=true;
				if(curr===ende){ solvable|=1; break; }
				let currxy=f.idx2xy(curr);
				for(let x=0,arr=f.dirs;x!==arr.length;++x){ let dir=arr[x];
					let newx=currxy.x+dir[0],newy=currxy.y+dir[1]; if(loopH) newx=(newx+w)%w; if(loopV) newy=(newy+h)%h;
					let newidx=newy*w+newx;
					if(newx<0||newx>=w||newy<0||newy>=h || (mark[newidx]!==p && mark[newidx]!==e)) continue;
					q.push(newidx);
				}
			}
		}
		
		let chMapData={};
		for(let idx=0;idx!==mark.length;++idx){ let item=mark[idx];
			switch(item){
				default: break;
				case e: break;
				case b: {
					chMapData[tileblock[0]*sz+idx]=tileblock[1];
				}break;
				case p: break;
			}
		}
		$gameParty.changeMap('randmaze',chMapData);
		//$gameParty.mch().tile.rand=true; // mark it
		return;
	}
};
$r$=$pppp$.start;
$d$=$pppp$.start=function f(){
	//debug.log('Scene_Map.prototype.start');
	
	//f.ori.call(this);
	this._justStarted=false;
	Scene_Base.prototype.start.call(this);
	SceneManager.clearStack();
	if(this._transfer){
		this._justStarted=true;
		this.fadeInForTransfer();
		this._mapNameWindow.open();
		$gameMap.autoplay();
	} else if (this.needsFadeIn()) {
		this._justStarted=true;
		this.startFadeIn(this.fadeSpeed(), false);
	}
	this.menuCalling = false;
	
	this._spriteset._tilemap.refreshTileset();
	return this._mapNameWindow.open();
}; $d$.ori=$r$;
Scene_Map.prototype.updateMain=function(){
	if(!this._justStarted){
		const active = this.isActive();
		$gameMap.update(active);
		$gamePlayer.update(active);
		$gameTimer.update(active);
	}else if(!this._fadeDuration){
		this._justStarted=false;
		this._initEvtExec=false;
	}else{
		if(!this._initEvtExec){
			if(this._initEvtExec=this.isActive()) $gameMap.update(true);
		}
	}
	$gameScreen.update();
};
$pppp$.isBlurBorder=()=>$dataMap&&$dataMap.meta.blurBorder;
$pppp$=$aaaa$=undef;

// - Scene_Load
$aaaa$=Scene_Load;
$pppp$=$aaaa$.prototype;
$pppp$.reloadMapIfUpdated=function() {
	if ($gameSystem.versionId() !== $dataSystem.versionId) {
		//$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y); // this call '$gamePlayer.locate' which sync followers' location to $gameplayer
		$gamePlayer.requestMapReload();
	}
};

// - Scene_Shop
$aaaa$=Scene_Shop;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.create;
$d$=$pppp$.create=function f(){
	f.ori.call(this);
	$gameTemp._scShop_balance=0; // seller gainGold
	$gameTemp._scShop_buySth=false; // player buy
	$gameTemp._scShop_sellSth=false; // player sell
	$gameTemp._scShop_negBalance=false;
	
	let w,tmp;
	// set help fontsize
	w=this._helpWindow;
	tmp=w.standardFontSize();
	w.setFontsize((tmp>>1)+(tmp>>3));
	tmp=w.height;
	w.height=w.fittingHeight(3-!($gameSystem&&$gameSystem._usr._showFullEquipInfo));
	// extend up(-y) following windows
	tmp-=w.height;
	w=this._goldWindow;
	w.updateArrows=none;
	w.y-=tmp;
	w=this._commandWindow;
	w.y-=tmp;
	w=this._numberWindow;
	w.y-=tmp;
	w.height+=tmp;
	w=this._statusWindow;
	w.y-=tmp;
	w.height+=tmp;
	w=this._buyWindow;
	w.y-=tmp;
	w.height+=tmp;
	w=this._categoryWindow;
	w.y-=tmp;
	w=this._sellWindow;
	w.y-=tmp;
	w.height+=tmp;
	w=this._dummyWindow;
	w.y-=tmp;
	w.height+=tmp;
	
	tmp=w.width-this._buyWindow.width;
	(w=this._commandWindow).width-=tmp;
	this._goldWindow.x-=tmp;
	w.updateArrows=none;
	if(!(w._index>=0)) w._index=0;
	w.reselect();
	w.refresh();
	
	w=this._dummyWindow;
	w.x+=w.width-tmp;
	w.width=tmp;
	w.active=false;
	tmp=this._goldWindow.height;
	w.y-=tmp;
	w.height+=tmp;
	this._dummyWindow2=w;
	(w=this._statusWindow).y-=tmp;
	w.height+=tmp;
	tmp=w.width;
	this.createDummyWindow();
	(w=this._dummyWindow).width-=tmp;
	w.active=false;
}; $d$.ori=$r$;
$pppp$.createDummyWindow = function() {
	let wy = this._commandWindow.y + this._commandWindow.height;
	let wh = Graphics.boxHeight - wy;
	this._dummyWindow = new Window_Dummy(0, wy, Graphics.boxWidth, wh);
	this.addWindow(this._dummyWindow);
};
$r$=$pppp$.doBuy;
$d$=$pppp$.doBuy=function f(n){
	$gameTemp._scShop_balance+=$gameParty._gold;
	f.ori.call(this,n);
	$gameTemp._scShop_balance-=$gameParty._gold;
	$gameTemp._scShop_buySth=true;
}; $d$.ori=$r$;
$r$=$pppp$.doSell;
$d$=$pppp$.doSell=function f(n){
	$gameTemp._scShop_balance+=$gameParty._gold;
	f.ori.call(this,n);
	$gameTemp._scShop_balance-=$gameParty._gold;
	$gameTemp._scShop_sellSth=true;
}; $d$.ori=$r$;
$pppp$.maxBuy=function(){
	const max=$gameParty.maxItems(this._item)-$gameParty.unionCnt(this._item);
	const price=this.buyingPrice();
	return price>0 ? Math.min(~~(this.money() / price),max) : max;
};
$pppp$.terminate=function(){ // originally empty
	$gameTemp._scShop_negBalance=$gameTemp._scShop_balance<0;
};
$pppp$=$aaaa$=undef;

// - Scene_Battle
$aaaa$=Scene_Battle;
$pppp$=$aaaa$.prototype;
$pppp$.changeInputWindow=function(){
	if(BattleManager.isInputting()){
		if(BattleManager.actor()) this.startActorCommandSelection();
		else if(!this._logWindow.active) this.startPartyCommandSelection(); // viewLog
	}else this.endCommandSelection();
};
$r$=$pppp$.terminate;
$d$=$pppp$.terminate=function f(){
	f.ori.call(this);
	BattleManager.clearTBDCache();
	$gameTroop.members().forEach(f.forEach);
}; $d$.ori=$r$;
$d$.forEach=b=>b.clearCache();
$pppp$.createSpriteset=function(){
	this._chr2sp=new Map();
	this._chr2actResQ=new Map();
	this.addChild(this._spriteset = new Spriteset_Battle(this));
};
$k$='createAllWindows';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this.createSwapActorWindow();
	// trim
	this._actorWindow.y=0;
}; $d$.ori=$r$;
$k$='createPartyCommandWindow';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	const w=this._partyCommandWindow;
	w.setHandler('swap',    	this.commandSwap.bind(this));
	w.setHandler('usePlan', 	this.commandUsePlan.bind(this));
	w.setHandler('allAtk',  	this.commandAtkAll.bind(this));
	w.setHandler('allGuard',	this.commandGuardAll.bind(this));
	w.setHandler('allSpaceout',	this.commandSpaceoutAll.bind(this));
	w.setHandler('viewLog', 	this.commandViewLog.bind(this));
}; $d$.ori=$r$;
$pppp$.createSwapActorWindow=function(){
	let w;
	//this.addWindow( w = this._swapActorWindow = new Window_BattleStatus() );
	w=this._swapActorWindow=this._actorWindow;
};
$k$='createActorCommandWindow';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this._actorCommandWindow.setHandler('spaceout',   this.commandSpaceout.bind(this));
}; $d$.ori=$r$;
$pppp$.createHelpWindow=function(){
	Scene_MenuBase.prototype.createHelpWindow.call(this);
	this._helpWindow.visible=false;
};
$pppp$.commandSwap=function(){
	const w=this._swapActorWindow;
	w._mode='s';
	w._pendingIndex=-1;
	w.refresh();
	w.show();
	if(!(w._index>=0)) w._index=0;
	w.activate();
};
$pppp$.commandUsePlan=function(){
	this._allSpecific=0;
	this._windowLayer.visible=false;
	const cmdw=this._partyCommandWindow;
	if(this._battlePlan===undefined){
		const plan = this._battlePlan = new Window_BattlePlan , bye=()=>this._windowLayer.visible=cmdw.active=!(plan.visible=plan.active=false);
		SceneManager._scene.addChild(plan);
		plan.setHandler('cancel' ,bye);
		plan.setHandler('ok'     ,()=>{
			bye(); cmdw.active=false;
			let actidx=0,subject; while(true){
				BattleManager.selectNextCommand();
				if(BattleManager.isInputting()){
					const action = BattleManager.inputtingAction();
					const currSubject=action.subject();
					if(currSubject!==subject){ subject=currSubject; actidx=0; }
					const plan=currSubject.getPlan(actidx);
					const obj=currSubject.getPlanObj(actidx);
					++actidx;
					switch(obj&&obj.itemType){
					case 's': {
						action.setSkill(obj.id);
						if(plan[2]>0) action.setTarget(plan[2]-1);
					}break;
					case 'i': {
						action.setItem(obj.id);
						if(plan[2]>0) action.setTarget(plan[2]-1);
					}break;
					}
				}else{ this.endCommandSelection(); break; }
			}
		});
	}else{
		const plan=this._battlePlan;
		plan.visible=plan.active=true;
		plan.refresh();
	}
};
$pppp$.commandAtkAll=function(){
	this._allSpecific=1;
	this.selectEnemySelection();
};
$pppp$.commandGuardAll=function(){
	this._allSpecific=0;
	let subject;
	while(true){
		BattleManager.selectNextCommand();
		if(BattleManager.isInputting()){
			const action = BattleManager.inputtingAction();
			const currSubject=action.subject();
			if(currSubject!==subject){
				subject=currSubject;
				action.setGuard();
			} // else action.setSpaceout();
		}else{
			this.endCommandSelection();
			break;
		}
	}
};
$pppp$.commandSpaceoutAll=function(){
	this._allSpecific=0;
	let subject;
	while(true){
		BattleManager.selectNextCommand();
		if(BattleManager.isInputting()){
			const action = BattleManager.inputtingAction();
			const currSubject=action.subject();
			if(currSubject!==subject){
				subject=currSubject;
				action.setSpaceout();
			}
		}else{
			this.endCommandSelection();
			break;
		}
	}
};
$pppp$.commandViewLog=function(){
	this.clearInstLog();
	const lw=this._logWindow;
	if(lw._scene!==this){
		lw._scene=this;
		lw.setHandler('cancel',()=>{
			lw._mode=undefined;
			lw.deactivate();
			lw.deselect();
			lw.clearContents();
			lw._scrollY=0;
			lw.updateArrows();
			lw.refresh();
			this._partyCommandWindow.activate();
		});
	}
	const len=lw._historyLines.length;
	if(len){
		this._partyCommandWindow.deactivate();
		lw._mode='h';
		lw.select(len-1);
		lw.refresh();
		lw.activate();
		lw._lines.length=0;
	}else $gameMessage.popup("no log",true);
};
$pppp$.commandSpaceout=function(){
	BattleManager.inputtingAction().setSpaceout();
	this.selectNextCommand();
};
$pppp$.selectNextCommand=function(){
	{ const act=BattleManager.inputtingAction();
	if(act){ const item=act.item(); if(item&&item.meta.inst){
		const bm=BattleManager;
		bm._action=act;
		const s=bm._subject=act.subject() , t=bm._targets=act.makeTargets();
		s.useItem(item);
		act.applyGlobal();
		this.refreshStatus();
		this._logWindow.startAction(s, act, t);
		while(t.length) bm.updateAction(true);
		this.changeInputWindow();
		act.meta={};
		bm._subject=null;
		bm._targets.length=0;
		BattleManager.checkBattleEnd();
		return this._instUsed=true;
	} } }
	BattleManager.selectNextCommand();
	this.changeInputWindow();
};
$r$=Scene_Battle.prototype.onActorOk;
$d$=Scene_Battle.prototype.onActorOk=function f(){
	const w=this._swapActorWindow;
	switch(w._mode){
	default: return f.ori.call(this);
	case 's':
		if(!(w._index>=0)) return; // unknown error
		if(w._pendingIndex>=0){
			const arr=$gameParty.members(),w2=this._statusWindow;
			$gameParty.swapOrderByActor(arr[w._pendingIndex],arr[w._index]);
			w2.redrawItem(w._index);
			w.redrawItem(w._index);
			const idx=w._pendingIndex;
			w._pendingIndex=-1;
			w2.redrawItem(idx);
			w.redrawItem(idx);
		}else w.redrawItem(w._pendingIndex=w._index);
		w.activate();
	break;
	}
}; $d$.ori=$r$;
$k$='onActorCancel';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	const w=this._swapActorWindow;
	switch(w._mode){
	default: return f.ori.call(this);
	case 's': { // swap
		if(w._pendingIndex>=0){
			const idx=w._pendingIndex;
			w._pendingIndex=-1;
			w.redrawItem(idx);
		}else{
			w._mode=undefined;
			w.deactivate();
			w.hide();
			this._partyCommandWindow.activate();
		}
	}break;
	}
}; $d$.ori=$r$;
$pppp$.onEnemyOk=function(){
	switch(this._allSpecific){
	default:{
		let action = BattleManager.inputtingAction();
		action.setTarget(this._enemyWindow.enemyIndex());
		this._enemyWindow.hide();
		this._skillWindow.hide();
		this._itemWindow.hide();
		this.selectNextCommand();
	}break;
	case 1:{ // all attack
		this._allSpecific=0;
		this._enemyWindow.hide();
		while(true){
			BattleManager.selectNextCommand();
			if(BattleManager.isInputting()){
				let action = BattleManager.inputtingAction();
				action.setAttack();
				action.setTarget(this._enemyWindow.enemyIndex());
			}else{
				this.endCommandSelection();
				break;
			}
		}
	}break;
	}
};
$k$='onEnemyCancel';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	switch(this._allSpecific){
	default: return f.ori.call(this);
	case 1:{
		this._allSpecific=0;
		this._enemyWindow.hide();
		//this._partyCommandWindow.activate();
	}break;
	}
}; $d$.ori=$r$;
$pppp$.onSelectAction=function(){
	this.clearInstLog();
	const action = BattleManager.inputtingAction();
	this._skillWindow.hide();
	this._itemWindow.hide();
	if(!action.needsSelection()) this.selectNextCommand();
	else if(action.isForOpponent()) this.selectEnemySelection();
	else this.selectActorSelection();
};
$pppp$.endCommandSelection=function(){
	this._partyCommandWindow.close();
	this._actorCommandWindow.close();
	if(this._statusWindow._index!==-1 && !BattleManager._action){
		this._statusWindow.select(0);
		this._statusWindow.deselect();
	}
};
$pppp$.clearInstLog=function(){
	if(this._instUsed){
		this._instUsed=undefined;
		BattleManager._logWindow.popBaseLine();
	}
};
$pppp$=$aaaa$=undef;

// objects

// - temp
$aaaa$=Game_Temp;
$pppp$=$aaaa$.prototype;
$pppp$.clearDestination = function(forced) {
	if(TouchInput.isPressed()&&!forced&&!TouchInput.isTriggered()) return;
	this._destinationX = null;
	this._destinationY = null;
};
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this._data=new Map();
	this._$gameObjs_tmp=new Map(); // take advantage of re-new of game objs are at the same time
	//this._ssSets=[];
}; $d$.ori=$r$;
$pppp$.get=function(key){ return this._data.get(key); };
$pppp$.set=function(key,val){ return this._data.set(key,val); };
$pppp$.getCache=function(obj,key){
	let rtv=this._$gameObjs_tmp.get(obj);
	if(rtv) rtv=rtv.get(key);
	return rtv;
};
$pppp$.updateCache=function(obj,key,val){
	const dct=this._$gameObjs_tmp.get(obj);
	if(dct) dct.set(key,val);
	else this._$gameObjs_tmp.set( obj , new Map([[key,val,]]) );
};
$pppp$.clearCache=function(obj){
	this._$gameObjs_tmp.delete(obj);
};
$pppp$.clearCacheAll=function(){
	this._$gameObjs_tmp.clear();
};
$pppp$.delCache=function(obj,key){
	const tmp=this._$gameObjs_tmp.get(obj);
	if(tmp) tmp.delete(key);
};
$pppp$.initClearedWhenNewMap=function(){
	this.clearedWhenNewMap={};
	// bfs cache
	this.clearedWhenNewMap.bfsCache=new Map(); // xyidx(if multi-number, use string) -> result
	// fast access sprite
	this.clearedWhenNewMap.mySprite=new Map(); // evt / flr -> sprite
};
$pppp$.getSprite=function(obj){
	return this.clearedWhenNewMap && this.clearedWhenNewMap.mySprite.get(obj);
}
$pppp$.poolEvt_newMap=function(lastMapId){
	let tmp;
	if(!(tmp=this.get('pool-evt'))) this.set('pool-evt',tmp=new Queue());
	if(tmp.length===0||$gameMap._mapId!==lastMapId){
		this._mapSerial|=0; ++this._mapSerial; this._mapSerial&=0x7FFF; // maximum must >= 'objs.new_Game_Event_max'
		tmp.push(this._mapSerial);
	}
};
$pppp$.gainMsgConfigs_push=function(){
	if(!this._gainMsgConfigs) this._gainMsgConfigs=[];
	this._gainMsgConfigs.push({
		snd:$gameSystem._usr._noGainSound,
		hnt:$gameSystem._usr._noGainHint,
		msg:$gameSystem._usr._noGainMsg,
	});
};
$pppp$.gainMsgConfigs_mute=function(){
	$gameSystem._usr._noGainSound=1;
	$gameSystem._usr._noGainHint=1;
	$gameSystem._usr._noGainMsg=1;
};
$pppp$.gainMsgConfigs_pushAndMute=function(){
	this.gainMsgConfigs_push();
	this.gainMsgConfigs_mute();
};
$pppp$.gainMsgConfigs_pop=function(){
	if(!this._gainMsgConfigs) return (this._gainMsgConfigs=[])&&undefined;
	if(this._gainMsgConfigs.length===0) return;
	const rtv=this._gainMsgConfigs.pop();
	$gameSystem._usr._noGainMsg=rtv.msg||0;
	$gameSystem._usr._noGainHint=rtv.hnt||0;
	$gameSystem._usr._noGainSound=rtv.snd||0;
	return rtv;
};
$pppp$.lvUpConfigs_push=function(){
	if(!this._lvUpConfigs) this._lvUpConfigs=[];
	this._lvUpConfigs.push({
		lvh:$gameSystem._usr._lvUpHint,
		lvm:$gameSystem._usr._lvUpMsg,
	});
};
$pppp$.lvUpConfigs_mute=function(){
	$gameSystem._usr._lvUpHint=0;
	$gameSystem._usr._lvUpMsg=0;
};
$pppp$.lvUpConfigs_pushAndMute=function(){
	this.lvUpConfigs_push();
	this.lvUpConfigs_mute();
};
$pppp$.lvUpConfigs_pop=function(){
	if(!this._lvUpConfigs) return (this._lvUpConfigs=[])&&undefined;
	if(this._lvUpConfigs.length===0) return;
	const rtv=this._lvUpConfigs.pop();
	$gameSystem._usr._lvUpMsg=rtv.lvm||0;
	$gameSystem._usr._lvUpHint=rtv.lvh||0;
	return rtv;
};
$pppp$.pannelConfigs_push=function(){
	if(!this._pannelConfigs) this._pannelConfigs=[];
	this._pannelConfigs.push({
		hpl:$gameSystem._usr._noLeaderHp,
		mpl:$gameSystem._usr._noLeaderMp,
		flw:$gameSystem._usr._flwingMsg,
	});
};
$pppp$.pannelConfigs_mute=function(){
	$gameSystem._usr._noLeaderHp=1;
	$gameSystem._usr._noLeaderMp=1;
	$gameSystem._usr._flwingMsg=0;
};
$pppp$.pannelConfigs_pushAndMute=function(){
	this.pannelConfigs_push();
	this.pannelConfigs_mute();
};
$pppp$.pannelConfigs_pop=function(){
	if(!this._pannelConfigs) return (this._pannelConfigs=[])&&undefined;
	if(this._pannelConfigs.length===0) return;
	const rtv=this._pannelConfigs.pop();
	$gameSystem._usr._noLeaderHp=rtv.hpl||0;
	$gameSystem._usr._noLeaderMp=rtv.mpl||0;
	$gameSystem._usr._flwingMsg=rtv.flw||0;
	return rtv;
};
$pppp$.gameoverMsg_clear=function(){
	if(this._gameoverMsgs) this._gameoverMsgs.length=0;
	if($dataMap && $dataMap.gameoverMsgs) $dataMap.gameoverMsgs.length=0;
};
$pppp$.gameoverMsg_add=function(txt){
	if(!this._gameoverMsgs) this._gameoverMsgs=[];
	this._gameoverMsgs.push(txt);
};
$pppp$.gameoverMsg_ok=function(){
	if(!this._gameoverMsgs) return;
	for(let arr=this._gameoverMsgs,xs=arr.length,x=xs;x--;) for(let _=8;--_;) $gameMessage.addGameoverMsg(arr[x],{t_remained:2e3*(x+1),align:'center'});
};
$pppp$=$aaaa$=undef;

// - map
$aaaa$=Game_Map;
$pppp$=$aaaa$.prototype;
Object.defineProperties($aaaa$.prototype, {
	size: { get: function() { return $dataMap ? $gameMap.width()*$gameMap.height() : undefined; }, configurable: false },
	w: { get: function(){return this.width();}, configurable: false },
	h: { get: function(){return this.height();}, configurable: false },
	name: { get: function(){return this.displayName();}, configurable: false },
	_displayX: { get: function(){ console.warn('lack of precision'); return this._displayX_tw/this.tileWidth();  }, set:(rhs)=>rhs, configurable: false },
	_displayY: { get: function(){ console.warn('lack of precision'); return this._displayY_th/this.tileHeight(); }, set:(rhs)=>rhs, configurable: false },
	_parallaxX: { set: function(rhs){this._parallaxX_tw=this.tileWidth()*rhs; return rhs;}, configurable: false },
	_parallaxY: { set: function(rhs){this._parallaxY_th=this.tileHeight()*rhs; return rhs;}, configurable: false },
});
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	this._parallaxX_tw^=0;
	this._parallaxY_th^=0;
	this._displayX_tw^=0;
	this._displayY_th^=0;
	this._wtw^=0;
	this._hth^=0;
	f.ori.call(this);
	this._itrpv=undefined; // []; // construct @ 'Game_Map.prototype.updateInterpreter' , @ 'Game_Map.prototype.setupStartingMapEvent'
}; $d$.ori=$r$;
$pppp$.zaWarudo=function(){ return this._zaWarudo; };
$pppp$.zaWarudo_waitToStart=function(evtid){
	if(!this._zaWarudo_waits) this._zaWarudo_waits=[];
	this._zaWarudo_waits.push(evtid);
};
$pppp$.setZaWarudo=function(val){
	let arr=this._zaWarudo_waits;
	this._zaWarudo=val;
	if(arr&&!val){
		arr.forEach( (evtid)=>this._events[evtid].start() );
		delete this._zaWarudo_waits;
	}
};
$pppp$.tileWidth_half=()=>24;
$pppp$.tileHeight_half=()=>24;
$pppp$.deltaX=function(x1, x2){
	let result=x1-x2,w;
	if(this.isLoopHorizontal() && (w=this.width())<(Math.abs(result)<<1)){
		if(result<0) result+=w;
		else result-=w;
	}
	return result;
};
$pppp$.deltaY=function(y1, y2){
	let result=y1-y2,h;
	if (this.isLoopVertical() && (h=this.height())<(Math.abs(result)<<1)) {
		if(result<0) result+=h;
		else result-=h;
	}
	return result;
};
$pppp$._screenTileX=0^0;
$pppp$._screenTileY=0^0;
$pppp$.isLoopHorizontal=function(){return $dataMap.scrollType&2;};
$pppp$.isLoopVertical=function(){return $dataMap.scrollType&1;};
$pppp$.adjustX_tw=function(x) {
	let rtv=x*this.tileWidth()-this._displayX_tw ^0;
	if(this.isLoopHorizontal()&&this._wtw+(rtv<<1)<Graphics.width) rtv+=this._wtw;
	return rtv;
};
$pppp$.adjustX = function(x) {
	return this.adjustX_tw(x)/this.tileWidth();
};
$pppp$.adjustY_th=function(y) {
	let rtv=y*this.tileHeight()-this._displayY_th ^0;
	if(this.isLoopVertical()&&this._hth+(rtv<<1)<Graphics.height) rtv+=this._hth;
	return rtv;
};
$pppp$.adjustY=function(y) {
	return this.adjustY_th(y)/this.tileHeight();
};
$pppp$.scrollDown_th=function(distance_th) {
	distance_th=~~(distance_th+0.5);
	let th=this.tileHeight(),gh=Graphics.height;
	if(this.isLoopVertical()){
		this._displayY_th+=distance_th;
		this._displayY_th%=this._hth;
		if(this._parallaxLoopY) this._parallaxY_th+=distance_th;
	}else if(this._hth >= gh){
		let lastY_th = this._displayY_th;
		this._displayY_th = Math.min(this._displayY_th + distance_th, this._hth - gh);
		this._parallaxY_th+=this._displayY_th-lastY_th;
	}
	this._displayY_th^=0;
};
$pppp$.scrollDown = function(distance) {
	console.warn(distance);
	return this.scrollDown_th(this.tileHeight()*distance);
};

$pppp$.scrollLeft_tw=function(distance_tw) {
	distance_tw=~~(distance_tw+0.5);
	let tw=this.tileWidth(),gw=Graphics.width;
	if(this.isLoopHorizontal()){
		this._displayX_tw+=this._wtw-distance_tw;
		this._displayX_tw%=this._wtw;
		if(this._parallaxLoopX) this._parallaxX_tw-=distance_tw;
	}else if(this._wtw >= gw){
		let lastX_tw = this._displayX_tw;
		this._displayX_tw=Math.max(this._displayX_tw - distance_tw, 0);
		this._parallaxX_tw+=this._displayX_tw-lastX_tw;
	}
	this._displayX_tw^=0;
};
$pppp$.scrollLeft = function(distance) {
	console.warn(distance);
	return this.scrollLeft_tw(this.tileWidth()*distance);
};
$pppp$.scrollRight_tw=function(distance_tw) {
	distance_tw=~~(distance_tw+0.5);
	let tw=this.tileWidth(),gw=Graphics.width;
	if(this.isLoopHorizontal()){
		this._displayX_tw+=distance_tw;
		this._displayX_tw%=this._wtw;
		if(this._parallaxLoopX) this._parallaxX_tw+=distance_tw;
	}else if(this._wtw >= gw){
		let lastX_tw = this._displayX_tw;
		this._displayX_tw=Math.min(this._displayX_tw + distance_tw, this._wtw - gw);
		this._parallaxX_tw+=this._displayX_tw-lastX_tw;
	}
	this._displayX_tw^=0;
};
$pppp$.scrollRight = function(distance) {
	console.warn(distance);
	return this.scrollRight_tw(this.tileWidth()*distance);
};
$pppp$.scrollUp_th=function(distance_th) {
	distance_th=~~(distance_th+0.5);
	let th=this.tileHeight(),gh=Graphics.height;
	if(this.isLoopVertical()){
		this._displayY_th+=this._hth-distance_th;
		this._displayY_th%=this._hth;
		if(this._parallaxLoopY) this._parallaxY_th-=distance_th; 
	}else if(this._hth >= gh){
		let lastY_th=this._displayY_th;
		this._displayY_th=Math.max(this._displayY_th - distance_th, 0);
		this._parallaxY_th+=this._displayY_th-lastY_th;
	}
	this._displayY_th^=0;
};
$pppp$.scrollUp = function(distance) {
	console.warn(distance);
	return this.scrollUp_th(this.tileHeight()*distance);
};
$pppp$.scrollToT=function(tx,ty){
	let lastDispX=this._displayX_tw;
	let lastDispY=this._displayY_th;
	if(lastDispX<tx) this.scrollRight_tw(tx-lastDispX);
	else this.scrollLeft_tw(lastDispX-tx);
	if(lastDispY<ty) this.scrollDown_th(ty-lastDispY);
	else this.scrollUp_th(lastDispY-ty);
	return true;
};
$pppp$.scrollToT_gradually_clear=function(){
	$gameTemp._scrollRest=0;
};
$pppp$.scrollToT_gradually=function(tx,ty,kargs){
	let tmp=$gameTemp;
	tmp._scrollRest^=0;
	if(tmp._scrollRest===0){
		let ctrMax=(2048>>>this._scrollSpeed);
		if(ctrMax===0) return this.scrollToT(tx,ty);
		tmp._scroll_r=Math.PI/ctrMax;
		tmp._scrollRest=ctrMax;
		tmp._scroll_dx=this._displayX_tw-tx;
		tmp._scroll_dy=this._displayY_th-ty;
		if(this.isLoopHorizontal() && this._hth<(Math.abs(tmp._scroll_dx)<<1))
			tmp._scroll_dx+=this._displayX_tw<tx?this._wtw:-this._wtw;
		if(this.isLoopVertical  () && this._hth<(Math.abs(tmp._scroll_dy)<<1))
			tmp._scroll_dy+=this._displayY_th<ty?this._hth:-this._hth;
	}
	if(--tmp._scrollRest===0) return this.scrollToT(tx,ty);
	let r=(1-Math.cos(tmp._scrollRest*tmp._scroll_r))/2.0;
	this.scrollToT(tmp._scroll_dx*r+tx,tmp._scroll_dy*r+ty);
	return;
};
$pppp$.screenTileX=function(){ return this._screenTileX^0; };
$pppp$.screenTileY=function(){ return this._screenTileY^0; };
$pppp$.parallaxOx=function(){
	if (this._parallaxZero) return this._parallaxX_tw;
	else if(this._parallaxLoopX) return this._parallaxX_tw>>1;
	else return 0;
};
$pppp$.parallaxOy=function(){
	if(this._parallaxZero) return this._parallaxY_th;
	else if(this._parallaxLoopY) return this._parallaxY_th>>1;
	else return 0;
};
$pppp$.updateParallax = function() {
	if(this._parallaxLoopX) this._parallaxX_tw+=this._parallaxSx>>1;
	if(this._parallaxLoopY) this._parallaxY_th+=this._parallaxSy>>1;
};
$pppp$.setDisplayPos = function(x, y) {
	// called by Game_Player
{
	let tw=this.tileWidth();
	if (this.isLoopHorizontal()) {
		let xtw=x*tw;
		this._displayX_tw=xtw.mod(this._wtw);
		this._parallaxX_tw=xtw;
	} else {
		let endX_tw=this._wtw - Graphics.width;
		if(endX_tw<0) this._displayX_tw=endX_tw>>1;
		else{
			this._displayX_tw=x*tw;
			if(this._displayX_tw<0) this._displayX_tw=0;
			else if(this._displayX_tw>endX_tw) this._displayX_tw=endX_tw;
		}
		//this._displayX=this._displayX_tw/tw; // use getter
		this._parallaxX_tw=this._displayX_tw;
		//this._parallaxX=this._displayX;
	}
}
{
	let th=this.tileHeight();
	if(this.isLoopVertical()){
		let yth=y*th;
		this._displayY_th=yth.mod(this._hth);
		this._parallaxY_th=yth;
	}else{
		let endY_th=this._hth - Graphics.height;
		if(endY_th<0) this._displayY_th=endY_th>>1;
		else{
			this._displayY_th=y*th;
			if(this._displayY_th<0) this._displayY_th=0;
			else if(this._displayY_th>endY_th) this._displayY_th=endY_th;
		}
		this._parallaxY_th=this._displayY_th;
	}
}
	this._displayX_tw^=0;
	this._displayY_th^=0;
};
$pppp$.canvasToMapX=function(x) {
	let rtv=((this._displayX_tw + x) / this.tileWidth()^0);
	return this.roundX(rtv);
};
$pppp$.canvasToMapY=function(y){
	let rtv=((this._displayY_th + y) / this.tileHeight()^0);
	return this.roundY(rtv);
};
$r$=$pppp$.setup;
$d$=$pppp$.setup=function f(){ // exec when 1. change map ; or 2. $dataMap version updated
	debug.log('Game_Map.prototype.setup');
	// $dataMap is updated
	this._wtw=this.width ()*this.tileWidth ();
	this._hth=this.height()*this.tileHeight();
	Graphics._preCalScreenTileCoord();
	//AudioManager.stopAll();
	AudioManager.stopMe();
	AudioManager.stopBgs();
	AudioManager.stopSe();
	let mapid=this._mapId,evts=this._events;
	f.ori.call(this,arguments[0]);
	// put position and others back if same map
	if(this._mapId===mapid){
		for(let x=0;x!==evts.length;++x){ let src=evts[x],dst=this._events[x]; if(src && dst){
			DataManager.putbackAttrs_chr(dst,src);
			// 
			if(src._queues && src._queues.length){
				let srcq=src._queues,dstq=dst._queues;
				dstq.length=srcq.length;
				for(let q=0;q!==srcq.length;++q) dstq[q]=Object.toType(srcq[q],Queue);
			}
		} }
	}else{ // change to other map
		// clear parallel-once
		if(this._itrpv){ let arr=this._itrpv; while(arr.length) objs.delete_Game_Interpreter(arr.pop()); }
	}
	this.loadDynamicEvents();
	// load 'meta.recordLoc' s
	this.load_recordLoc();
}; $d$.ori=$r$;
$d$=$pppp$.setupEvents=function f(){
	$gameTemp.poolEvt_newMap();
	this._events = [];
	for(let i=0,arr=$dataMap.events;i!==arr.length;++i){
		if(arr[i]) this._events[i] = objs.new_Game_Event(this._mapId, i);
	}
	this._commonEvents = this.parallelCommonEvents().map(f.forEach);
	this.refreshTileEvents();
};
$d$.forEach=commonEvent=>new Game_CommonEvent(commonEvent.id);
$pppp$.save_recordLoc=function(){
	// save 'meta.recordLoc' s
	debug.log('Game_Map.prototype.save_recordLoc');
	let arr=$dataMap.eventsByMeta.recordLoc||[];
	if(arr.length){ let mc=$gameParty.mch();
		let recordLoc=mc.recordLoc={};
		for(let x=0;x!==arr.length;++x){
			let evt=$gameMap._events[arr[x]];
			if(evt && evt._erased===false){
				recordLoc[arr[x]]={d:evt._direction,x:evt._x,y:evt._y,p:evt._pageIndex};
			}
		}
	}
};
$pppp$.load_recordLoc=function(){
	// load 'meta.recordLoc' s
	debug.log('Game_Map.prototype.load_recordLoc');
	let mc=$gameParty.mch(),recordLoc=mc.recordLoc;
	if(recordLoc!==undefined){
		for(let i in recordLoc){
			let evt=this._events[i];
			if(!evt || evt._erased) continue;
			let data=recordLoc[i];
			evt._realX=evt._x=data.x;
			evt._realY=evt._y=data.y;
			if(evt._pageIndex===data.p) evt._direction=data.d;
			// {d:evt._direction,x:evt._x,y:evt._y,p:evt._pageIndex};
		}
		delete mc.recordLoc;
	}
};
$d$=$pppp$.loadDynamicEvents=function f(fromLoadFile,noUpdate){
	debug.log('Game_Map.prototype.loadDynamicEvents');
	debug.log($dataMap,$gameMap&&$gameMap._mapId);
	let childssarr=[];
	
	if(fromLoadFile){
		// placing dynamic events
		for(let x=0,evts=this._events;x!==evts.length;++x){ let evt=evts[x];
			if(evt && evt._erased===false && evt._eventId.constructor!==Number){
				evts[evt._eventId]=f.relatedSelfSwitches(evt);
			}
		}
	}else{
		// from $gamePlayer.reserveTransfer
		//   meta.use
		{
			let metaUses=[];
			for(let x=0,evts=this._events;x!==evts.length;++x) if(evts[x] && evts[x].event().meta.use) metaUses.push(evts[x]);
			for(let x=0;x!==metaUses.length;++x){
				let evt=metaUses[x],use=evt.event().meta.use;
				if(use && $dataTemplateEvtFromMaps.others){
					use=use.split(',');
					let key='templateStrt_'+use[0];
					if(use[0] in $dataTemplateEvtFromMaps.others){ use.pop_front();
						for(let i=0;i!==use.length;++i) $gameMap.cpevt(Number(use[i])+$dataMap[key],evt.x,evt.y,1,1,true);
					}
				}
			}
		}
		//   
		let evts=$gameParty.mapChanges[this._mapId].events;
		if(evts){
			let delList=[],gss=$gameSelfSwitches;
			for(let i in evts){ //debug.log2(i);
				if(i==='0') continue;
				let evt=evts[i];
				if(evt._erased){
					f.relatedSelfSwitches(evt,1);
					for(let x=0,sss=gss.switches;x!==sss.length;++x) gss.setValue([this._mapId,i,sss[x]],0);
					continue;
				}
				let newevt=objs.new_Game_Event(this._mapId,i);
				for(let j in evt) newevt[j]=evt[j]; // attrs
				if(evt._eventId) newevt._eventId=evt._eventId; // ensure old save data are correct
				this._events.push(newevt);
				this._events[i]=newevt;
				// self switches
				f.relatedSelfSwitches(evt);
				// construct children
				let sses=newevt._sameStatEvts;
				let needRebuild=sses?sses.map(x=>evts[x]===undefined).sum()!==0:(newevt.event().meta.child);
				if(needRebuild){
					if(sses){
						delList=delList.concat(sses);
						delete newevt._sameStatEvts;
					}
					newevt._constructChildren();
				}
			}
			for(let x=0,evts=this._events;x!==delList.length;++x){
				for(let x=0,sss=gss.switches;x!==sss.length;++x) gss.setValue([this._mapId,delList[x],sss[x]],0);
				if(evts[delList[x]]) evts[delList[x]]._erased=true;
			}
		}
	}
	if(!noUpdate) $gameSelfSwitches.onChange();
	for(let x=0,evts=this._events;x!==evts.length;++x) evts[x]&&f.trim(evts[x]);
};
$d$.trim=evt=>{ // - - event
	// queues
	if(evt._queues){ for(let qi=0,qs=evt._queues;qi!==qs.length;++qi){ if(qs[qi]){ const data=qs[qi]; if(data&&data.constructor!==Queue){
		qs[qi]=Object.toType(data,Queue);
	} } } }
	// deleteOldDataMember
	{
		let tmp;
		tmp=evt._preventZaWarudo;
		delete evt._preventZaWarudo;
		evt._preventZaWarudo=tmp;
	}
};
$pppp$.loadDynamicEvents.relatedSelfSwitches=(evt,doRemove)=>{
	// evt.constructor === Game_Event
	
	// self switches
	if(evt._sameStatEvts){
		let obj=objs.$gameSelfSwitches._data[objs.$gameMap._mapId];
		let svs=objs.$gameSelfSwitches.switches.map((s)=>[ s , !doRemove && obj[([evt._eventId,s])] ]);
		for(let x=0,arr=evt._sameStatEvts;x!==arr.length;++x){ let evtid=arr[x];
			for(let z=0;z!==svs.length;++z){ let sv=svs[z];
				objs.$gameSelfSwitches.setValue_(obj,[evtid,sv[0]],sv[1]);
			}
		}
	}
	
	return evt;
};
$pppp$.forEachEvtByDist=function(cxy,evts,callback,is_far2near){
	// dist2
	// cxy = {x:Number(...),y:Number(...)};
	let C={_realX:cxy.x,_realY:cxy.y,dist2:1};
	evts=is_far2near?evts.map(x=>[x.dist2_r(C),x,]):evts.map(x=>[-x.dist2_r(C),x,]);
	let h=new Heap((a,b)=>{-(a[0]<b[0]);},evts,1);
	while(h.length){ callback(h.top[1]); h.pop(); }
};
$pppp$.xy2idx=function(x,y,lv=0){
	return $dataMap && this.isValid(x,y) ? x+$gameMap.width()*y+lv*this.size : undefined;
};
$pppp$.getAllTileByRef=function(r){
	return this.getAllTileByPos(r.x,r.y);
};
$pppp$.getAllTileByPos=function(x,y){
	let i=this.xy2idx(x,y); if(i===undefined) return [];
	let rtv=[],arr=$gameMap.data();
	for(let mapsz=this.size;i<arr.length;i+=mapsz) rtv.push(arr[i]);
	return rtv;
};
$pppp$.getAllTileFlagsByPos=function(x,y){
	let i=this.xy2idx(x,y); if(i===undefined) return [];
	let rtv=[],tileIds=$gameMap.data(),tileFlags=this.tilesetFlags();
	for(let mapsz=this.size;i<tileIds.length;i+=mapsz) rtv.push(tileFlags[ tileIds[i] ]);
	return rtv;
};
$pppp$.tilesetFlags=function() {
	let tileset=this.tileset();
	return tileset?tileset.flags:[];
};
$pppp$.isValid_round=function(x,y){
	return this.isValid(this.roundX(x),this.roundY(y));
};
$pppp$.checkPassage=function(x,y,bit){
	let flags=this.tilesetFlags();
	let tiles=this.allTiles(x, y);
	let i,flag;
	for(i=0;i!==tiles.length;++i){ if(tiles[i]>=8176){
		flag=tiles[i];
		if((flag & bit) === 0)   return true;  // [o] Passable
		if((flag & bit) === bit) return false; // [x] Impassable
	}}
	for(i=0;i!==tiles.length;++i){ if(tiles[i]===599) continue;
		flag = flags[tiles[i]];
		if ((flag & 0x10) !== 0)  // [*] No effect on passage
			continue;
		if ((flag & bit) === 0)   // [o] Passable
			return true;
		if ((flag & bit) === bit) // [x] Impassable
			return false;
	}
	//return debug.isdebug();
	return false; // No effect ALL
};
$d$=$pppp$.layeredTiles=function f(x,y){ // rewrite for efficiency
	//let idx=this.width()*y+x;
	//let rtv=$dataMap.data3d[idx];
	//if(rtv.length!==4) DataManager.resetData3d(idx); // for future use: reduce mem usage
	//return rtv;
	return $dataMap.data3d[$dataMap.width*y+x]||f._dummy;
};
$d$._dummy=[];
$pppp$.allTiles=function(x,y){ // rewrite for efficiency
	//return this.tileEventsXy(x, y).map(evt=>evt.tileId()).concat(this.layeredTiles(x, y));
	// discard tileEvents // 'this.tileEvents' is mostly empty
	return this.layeredTiles(x, y);
};
$pppp$.isPassable=function(x,y,d){
	return this.checkPassage(x,y,( 1<<((d>>1)-1) )&15 );
};
$k$='isDamageFloor';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(X,Y){
	let rtv=f.ori.call(this,X,Y);
	if(rtv){
		if(!$dataMap.preventDamageFloor) $dataMap.preventDamageFloor=JSON.parse($dataMap.meta.preventDamageFloor||"[]");
		for(let x=0,arr=$dataMap.preventDamageFloor;x!==arr.length;++x){ switch(arr[x][0]){
			default: break;
			case 'i':{
				let items=$gameParty._items,t=arr[x][1];
				let cost=arr[x][2]===undefined?0:arr[x][2]^0;
				if(items[t]>=cost){
					$gameParty.gainItem_q($dataItems[t],-cost);
					let t3=arr[x][3];
					if(t3!==undefined && t3!=="" && t3!=="-1"){
						let data={}; data[this.xy2idx(X,Y)]=t3;
						$gameParty.changeMap('tile',data,this._mapId,1);
						this.data();
					}
					return false;
				}
			}break;
		} }
	}
	return rtv;
}; $d$.ori=$r$;
$d$=$pppp$.isChair=function f(x,y){
	if(parseInt(x)!==x||parseInt(y)!==y) return false;
	return $dataMap.isChair[y*$dataMap.width+x];
};
$d$.tbl=[];
$k$='displayName';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	//debug.log('Game_Map.prototype.displayName');
	const pt=$gameParty && $gameParty.mapChanges,id=$gameMap._mapId;
	const evalName = $dataMap.evalName===undefined ? ($dataMap.evalName=objs._getObj($dataMap.meta.evalName)) : $dataMap.evalName ;
	return pt && pt[id] && pt[id].name && evalName || f.ori.call(this);
}; $d$.ori=$r$;
$r$=$pppp$.data;
$d$=$pppp$.data=function f(idx){
	//debug.log('Game_Map.prototype.data');
	let tmp=$gameParty.mapChanges,id=$gameMap._mapId;
	let delta=tmp&&tmp[id];
	let rm=delta&&delta.randmaze;
	delta=delta&&delta.tile;
	let rtv=f.ori.call(this);
	if(idx===undefined){
		if($dataMap.dataCustomized) return rtv;
		$dataMap.dataCustomized=true;
		let idxset=new Set(),sz=this.size;
		// reset ori
		if(rm){
			let target=rm;
			let delList=[];
			for(let i in target) if(target[i]===null) delList.push(i);
			for(let x=delList.length;x--;){ let i=delList[x];
				delete target[i];
				$dataMap.data[i]=$dataMap.data_bak[i];
				idxset.add(i%sz);
			}
		}
		// reset ori and set new
		if(delta){
			let target=delta;
			let delList=[];
			for(let i in target){
				idxset.add(i%sz);
				if(target[i]===null) delList.push(i);
				else rtv[i]=target[i];
			}
			for(let x=delList.length;x--;){ let i=delList[x];
				delete target[i];
				$dataMap.data[i]=$dataMap.data_bak[i];
			}
		}
		// set new
		if(rm){ for(let i in rm){
			rtv[i]=rm[i];
			idxset.add(i%sz);
		} }
		idxset.forEach(f.forEach);
		return rtv;
	}else{
		rtv[idx]=$dataMap.data_bak[idx];
		if(delta&&(idx in delta)){
			if(delta[idx]===null) delete delta[idx];
			else rtv[idx]=delta[idx];
		}
		if(rm&&(idx in rm)){
			if(rm[idx]===null) delete rm[idx];
			else rtv[idx]=rm[idx];
		}
		rtv=rtv[idx];
		//rtv=rtv[idx]=(delta && (idx in delta))?((rm&&(idx in rm))?rm[idx]:delta[idx]):rtv[idx];
		DataManager.resetData3d(idx%this.size);
		return rtv;
	}
}; $d$.ori=$r$;
$d$.forEach=v=>DataManager.resetData3d(v);
$pppp$.toBroken=function(permanent){
	let sz=$gameMap.size;
	let brokenLvs=$dataMap.meta.brokenLvs.split(',');
	let brokenChs=[];
	for(let L=0;L!==brokenLvs.length;++L){
		brokenChs.push( JSON.parse($dataMap.meta['broken'+brokenLvs[L]]) );
	} // maybe can be cached or pre-cal.
	brokenLvs=brokenLvs.map(x=>Number(x));
	if(permanent){
		let data={};
		for(let L=0;L!==brokenLvs.length;++L){
			let strt=sz*brokenLvs[L];
			for(let x=0,arr=brokenChs[L];x!==arr.length;++x){
				if(arr[x]<0) continue;
				data[strt+x]=arr[x];
			}
		}
		$gameParty.changeMap('tile',data);
	}else{
		for(let L=0;L!==brokenLvs.length;++L){
			let strt=sz*brokenLvs[L];
			for(let x=0,arr=brokenChs[L];x!==arr.length;++x){
				if(arr[x]<0) continue;
				$dataMap.data[strt+x]=arr[x];
			}
		}
		// refresh
		let sc=SceneManager._scene;
		if(sc.constructor===Scene_Map) sc._spriteset._tilemap.refresh();
	}
};
$pppp$.cpevt=function f(evtid,x,y,w,h,overwrite,ssStates,noUpdate,constraintFunc){ // cp if(constraintFunc(x,y)) else omit
	debug.log('Game_Map.prototype.cpevt');
	// copy an event filling a rectangle range on this map
	// return number of successful copied. no boundary check
	if(constraintFunc&&constraintFunc.constructor!==Function) constraintFunc=undefined;
	ssStates=ssStates||[];
	let evts=this._events;
	if(!evts[evtid]) return -1; // no such event
	let ssobj=evts[evtid].ssState().obj;
	let marker=[]; if(!overwrite){
		marker.length=$gameMap.size;
		for(let i=0;i!==evts.length;++i){ let evt=evts[i];
			if(evt && evt._erased===false && evt._through===false){
				let evtd=evt.event();
				marker[evt.xy2idx()]=(!evtd.isChild||evtd.meta.isOnLand)&&evtd.note!=="tile-block";
			}
		}
	}
	let mapid=this._mapId;
	if(!$gameSelfSwitches._data[mapid]) $gameSelfSwitches._data[mapid]={};
	let strt=evts.length;
	//let tm=(Date.now()-tm2020strt).toHexInt().slice(-4); // int overflow
	let tm=((Date.now()-tm2020strt)%65536).toHexInt().slice(-4);
	for(let ys=y+h;y!==ys;++y){ for(let xs=x+w;x!==xs;++x){
		if((constraintFunc&&!constraintFunc(x,y))||marker[this.xy2idx(x,y)]) continue;
		let newid=evtid+'-'+tm+"_"+evts.length;
		while(newid in evts) newid+="_";
		let obj=objs.new_Game_Event(mapid,newid); // obj._mapId=mapid;
		obj._realX=obj._x=x; obj._realY=obj._y=y;
		evts.push(obj); evts[obj._eventId]=obj;
		for(let i=0;i!==ssStates.length;++i) ssobj[([obj._eventId,ssStates[i]])]=true;
		obj._constructChildren(tm,ssStates);
		let meta=obj.event().meta;
	} x-=w; }
	if(!noUpdate) $gameSelfSwitches.onChange();
	let sc=SceneManager._scene,sp;
	if(sc.constructor===Scene_Map && (sp=sc._spriteset)){ for(let i=strt;i!==evts.length;++i){
		let spc=new Sprite_Character(evts[i]);
		sp._characterSprites.push(spc);
		sp._tilemap.addChild(spc);
	}}
	return evts.length-strt;
};
$pppp$.parents=function f(mapId){
	mapId=mapId||this._mapId;
	let rtv=[]; if(!mapId) return rtv;
	for(let id=$dataMapInfos[mapId].parentId;id;id=$dataMapInfos[id].parentId){
		rtv.push(id);
	}
	return rtv;
};
$pppp$.getRoot=function(mapId){
	mapId=mapId||this._mapId;
	let tmp;
	while((tmp=$dataMapInfos[mapId])&&tmp.name.slice(-5)!=='-root') mapId=tmp.parentId;
	return mapId||undef;
};
$pppp$.adjMtx=function(strtx,strty,canPassOnEvts){
	// return 1d-array
	// use player.x if strtx not defined
	// use player.y if strty not defined
	let w=this.width();
	if(strtx===undefined) strtx=$gamePlayer.x;
	if(strty===undefined) strty=$gamePlayer.y;
	if($dataMap._adjMtx && $dataMap._adjMtx[strtx+strty*w]) return $dataMap._adjMtx;
	let rtv=[]; rtv.length=this.size;
	let q=new Queue(rtv.length<<1); q.push([strtx,strty]); // [[strtx,strty]]; 
	while(q.length){
		let curr=q.front; q.pop();
		let idx=curr[0]+curr[1]*w;
		if(rtv[idx]) continue;
		rtv[idx]=1;
		for(let dir=10;dir-=2;){
			if(!$gamePlayer.canPass(curr[0],curr[1],dir)) continue;
			let newx=this.roundXWithDirection(curr[0],dir);
			let newy=this.roundYWithDirection(curr[1],dir);
			// can overlap on some evts or all evts if 'canPassOnEvts'
			if(canPassOnEvts || $dataMap.coordTbl[this.xy2idx(newx,newy)].map(e=>{let evtd=e.event(); return !evtd.meta.passable&&(!evtd.isChild||evtd.meta.isOnLand)>>>0;}).sum()===0)
				q.push([newx,newy]);
		}
	}
	delete rtv[this.xy2idx($gamePlayer.x,$gamePlayer.y)];
	if($dataMap.eventsByMeta.passable){ for(let x=0,evts=this._events,arr=$dataMap.eventsByMeta.passable;x!==arr.length;++x){ let evt=evts[arr[x]];
		delete rtv[this.xy2idx(evt.x,evt.y)];
	}}
	return $dataMap._adjMtx=rtv;
};
$pppp$.ss=function(evtid,sname){
	let res=this._events[evtid].ssState(sname);
	return res.obj[res.key];
};
$pppp$.events=function(){ // overwrite
	//debug.log('Game_Map.prototype.events');
	let arr=this._events,rtv=[];
	if($dataMap.templateStrt===undefined){
		for(let x=0;x!==arr.length;++x){ let evt=arr[x];
			if(evt) rtv.push(evt);
		}
	}else{
		for(let x=0,xs=$dataMap.templateStrt;x!==xs;++x){ let evt=arr[x];
			if(evt) rtv.push(evt);
		}
		let dL=$dataMap.events.length;
		if(dL<arr.length){ for(let x=dL,xs=arr.length;x!==xs;++x){ let evt=arr[x];
			if(evt && evt._erased===false) rtv.push(evt);
		}}
	}
	return rtv;
};
$pppp$.eventsXy=function(posx,posy){ // overwrite. forEach is slowwwwwwwwww
	if(!this.isValid(posx,posy)) return [];
	let mapd=$dataMap,tbl;
//	if(tbl=mapd&&mapd.coordTbl&&mapd.coordTbl[posx+posy*mapd.width]) return $gameParty.burnrange?tbl.filter(x=>!x.event().meta.burnable):tbl;
	if(tbl=mapd&&mapd.coordTbl&&mapd.coordTbl[posx+posy*mapd.width]) return tbl;
	
	let rtv=[];
	for(let x=0,arr=this._events;x!==arr.length;++x){ let evt=arr[x];
		if(evt && evt.pos(posx,posy)) rtv.push(evt);
	}
	return rtv;
};
$pppp$.eventsXyRef=function(xy){ xy=xy||$gamePlayer; return this.eventsXy(xy.x,xy.y); };
$pppp$.eventsXyNt=function(posx,posy){ // overwrite.
	if(!this.isValid(posx,posy)) return [];
	let mapd=$dataMap,tbl;
	if(tbl=mapd&&mapd.coordTblNt&&mapd.coordTblNt[mapd.width*posy+posx]) return tbl;
	return (mapd&&mapd.coordTbl&&mapd.coordTbl[mapd.width*posy+posx]||this._events).filter(evt=>evt&&evt.posNt(posx,posy));
};
$pppp$.eventsXyRefNt=function(xy){ return this.eventsXyNt(xy.x,xy.y); };
$pppp$.isAnyEventStarting=function(){ // overwrite. Array.some is slowwwwwwwwww
	//debug.log('Game_Map.prototype.isAnyEventStarting'); // this is polling
	if($dataMap.strtEvts) return $dataMap.strtEvts.length!==0;
	for(let x=0,arr=this._events;x!==arr.length;++x){ let evt=arr[x];
		if(evt && evt.isStarting()) return true;
	}
	return false;
};
$pppp$.updateEvents=function(){ // overwrite. forEach is slowwwwwwwwww
	//debug.log('Game_Map.prototype.updateEvents');
	if($dataMap.templateStrt===undefined){
		for(let x=0,arr=this._events;x!==arr.length;++x){ let evt=arr[x];
			if(evt) evt.update();
		}
	}else{ // skip templates
		let arr=this._events,dL=$dataMap.events.length;
		for(let x=0;x!==$dataMap.templateStrt;++x){ let evt=arr[x];
			if(evt) evt.update();
		}
		if(!arr.fastSkip) arr.fastSkip=[];
		for(let x=dL;x<arr.length;){
			arr[x].update();
			let next=arr.fastSkip[x]||x+1;
			if(next<arr.length && arr[next]._erased) arr.fastSkip[x]=arr.fastSkip[next]||next+1;
			x=next;
		}
		while(dL<arr.length){ let evt=arr.back;
			if(evt._erased) delete arr[arr.pop()._eventId];
			else break;
		}
		if(arr.fastSkip.length>=arr.length) arr.fastSkip.length=arr.length-1;
	}
	for(let x=0,arr=this._commonEvents;x!==arr.length;++x) arr[x].update();
};
$d$=$pppp$.updateInterpreter=function f(){
	// parallel map evts which exec only once
	if(!this._itrpv) this._itrpv=[];
	f.tmp.length=0;
	for(let x=0,arr=this._itrpv;x!==arr.length;++x){
		const curr=arr[x];
		curr.update();
		if(curr.isRunning()) f.tmp.push(curr);
		else objs.delete_Game_Interpreter(curr);
	}
	{ const tmp=this._itrpv; this._itrpv=f.tmp; f.tmp=tmp; }
	
	// my evtId can be a string. it cannot use >0
	for(;;){
		this._interpreter.update();
		if(this._interpreter.isRunning()){
			return;
		}
		if(this._interpreter.eventId()){
			this.unlockEvent(this._interpreter.eventId());
			this._interpreter.clear();
		}
		if(!this.setupStartingEvent()){
			return;
		}
	}
};
$d$.tmp=[];
$k$='setupStartingEvent';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	//debug.log('Game_Map.prototype.setupStartingEvent'); // this is polling
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.setupStartingMapEvent=function f(){ // overwrite. looking through everything is slowwwwwwwwww
	//debug.log('Game_Map.prototype.setupStartingMapEvent'); // this is polling
	// 'Game_Map.prototype.setupStartingEvent' is polling => 'Game_Map.prototype.setupStartingMapEvent' becomes polling
	let rtv=false;
	const q=$dataMap.strtEvts,qn=$dataMap.strtEvts_noStopMove;
	// start all 'noStopMove' at once
	if(0){ const qn=$dataMap.strtEvts_noStopMove; if(!this._itrpv) this._itrpv=[]; while(qn.length){
		let evtStrt=qn.front; qn.pop();
		let evt=evtStrt[0],strtMeta=evtStrt[1];
		if(evt._starting){
			evt.clearStartingFlag();
			const itrp=objs.new_Game_Interpreter();
			itrp.setup(evt.list(), evt._eventId,strtMeta);
			this._itrpv.push(itrp);
		}
	} }
	if(this._interpreter.isRunning()&&q.length) return true;
	while(q.length){
		let evtStrt=q.front; q.pop(); if(qn.front===evtStrt) qn.pop();
		let evt=evtStrt[0],strtMeta=evtStrt[1];
		if(evt._starting){
			evt.clearStartingFlag();
			this._interpreter.setup(evt.list(), evt._eventId,strtMeta);
			rtv=true;
			break;
		}
	}
	return rtv;
};
$r$=$pppp$.autoplay;
$d$=$pppp$.autoplay=function f(){
	f.ori.call(this);
	if($dataMap.meta.rndmusic) AudioManager.playBgm(objs.rndmusic());
	else AudioManager.stopPitch_bgm();
}; $d$.ori=$r$;
$r$=$pppp$.refresh;
$d$=$pppp$.refresh=function f(){
	f.ori.call(this);
	let tm=SceneManager.getTilemap();
	if(tm && tm.constructor===ShaderTilemap){
		let sx=$gameMap._displayX_tw/$gameMap.tileWidth(),sy=$gameMap._displayY_th/$gameMap.tileHeight();
		tm._paintAllTiles(sx^0,sy^0);
	}
}; $d$.ori=$r$;
$r$=$pppp$.refresh;
$d$=$pppp$.refresh=function f(){ // reduce refresh calls
	//debug.log('Game_Map.prototype.refresh');
	if(SceneManager._nextScene!==null) return;
	let curr=Date.now();
	if(f.lastTime+f.itvl<curr){
		f.lastTime=curr;
		f.ori.call(this);
	}else{
		let currMapId=$gameMap && $gameMap.mapId;
		if(!currMapId) return;
		if(f.lastTmout){ clearTimeout(f.lastTmout); }
		let tmout=setTimeout(()=>{
			if(tmout===f.lastTmout) f.lastTmout&=0;
			let mapId=$gameMap && $gameMap.mapId;
			if(mapId&&mapId===currMapId&&$dataMap&&f.lastTime+f.itvl<Date.now()&&SceneManager._nextScene===null) f.ori.call(this);
		},f.itvl);
		f.lastTmout=tmout;
	}
}; $d$.ori=$r$;
$d$.itvl=16; $d$.lastTime=0;
$k$='requestRefresh';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	//debug.log('Game_Map.prototype.requestRefresh');
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.requestRefresh=$r$; // not changed
$d$={};
// $d$.ori=$r$;
$aaaa$.e=Math.max($pppp$.tileWidth(),$pppp$.tileHeight());
$pppp$=$aaaa$=undef;

// - interpreter
$aaaa$=Game_Interpreter;
$pppp$=$aaaa$.prototype;
$aaaa$.EMPTY={code:0,indent:0,parameters:[]};
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	this._strtMeta=this._chrParam=null;
	return f.ori.call(this,arguments[0]);
}; $d$.ori=$r$;
$r$=$pppp$.character;
$d$=$pppp$.character=function f(param){
	return f.ori.call(this,this._chrParam=param);
}; $d$.ori=$r$;
Object.defineProperty($pppp$,'_character',{
	get:function(){ return this.character(this._chrParam); },
	set:function(rhs){
		if(!rhs) this._chrParam=null;
		return rhs;
	},
});
$pppp$.makeLabelTbl=function(){
	const arr=this._list,tbl=this._labelTbl={},indents=[],rl=this._rightLe||(this._rightLe=[]),lo=this._loop||(this._loop=[]);
	if(arr){ // reversed order
		const xs=arr.length,rr=[],lastLo=[],lbs=[]; // rightRepeat , lastLoop , lastBreak
		for(let x=xs,c,i;x--;){ c=arr[x];
			// skip tbl: skip@x: find nearest next i which arr[i].indent<=arr[x].indent
			rl[x]=xs;
			for(i=x+1;i!==arr.length;i=rl[i]){
				if(c.indent>=arr[i].indent){
					rl[x]=i;
					break;
				}
			}
			
			indents.push(c.indent);
			switch(c.code){
			default: break;
			case 112: // loop
				if(rr[c.indent]>=0){ const t=rr[c.indent]; lo[t]=x;
					if(lbs.length) for(let lb=lbs.pop();lb.length;) lo[lb.pop()]=t;
					rr[c.indent]=-1;
				}
			break;
			case 113: // loop - break
				lbs.back.push(x);
			break;
			case 413: // loop - repeat above
				rr[c.indent]=x;
				lbs.push([]);
			break;
			case 118: // label
				tbl[c.parameters[0]]=x;
			break;
			}
		}
	}
	if(indents.length){ indents.reverse();
		const t=this._segtree_indent={};
		t.max=new SegmentTree(Math.max,   -1,indents,true);
		t.min=new SegmentTree(Math.min,1<<21,indents,true);
	}else this._segtree_indent=undefined;
};
$r$=$pppp$.setup;
$d$=$pppp$.setup=function f(list,evtId,strtMeta){
	f.ori.call(this,list,evtId);
	this.makeLabelTbl();
	this._strtMeta=strtMeta;
}; $d$.ori=$r$;
$r$=$pppp$.clear;
$d$=$pppp$.clear=function f(){
	// flow: '.terminate' , '.clear'
	this._strtMeta=undefined;
	this._segtree_indent=undefined;
	if(this._rightLe) this._rightLe.length=0;
	else this._rightLe=[];
	if(this._loop) this._loop.length=0;
	else this._loop=[];
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.getStrtMeta=function(key){
	const meta=this._strtMeta;
	return meta&&meta[key];
};
$pppp$.skipBranch=function f(){
	this._index = this._list.length===this._rightLe[this._index] ? this._list.length : this._rightLe[this._index]-1 ; // cmd exec-ed will inc. '._index'
};
$d$=$pppp$.command101=function f(){
	if(!$gameMessage.isBusy()){
		$gameMessage.setFaceImage(this._params[0], this._params[1]);
		$gameMessage.setBackground(this._params[2]);
		$gameMessage.setPositionType(this._params[3]);
		while (this.nextEventCode() === 401) { // Text data
			this._index++;
			let txt=this.currentCommand().parameters[0];
			if(txt[0]==="\\"){ //debug.log(txt);
				if(txt[1]==="F"){
					txt=txt.slice(2); let m=txt.match(f.re_faceExt),evt; 
					if(m){ evt=$gameMap._events[m[2]]; txt=txt.slice(m[2].length+2); }
					else evt=this.getEvt();
					evt.setFace(); $gameMessage._evtName=evt.event().meta.name; // only needed when its face is set.
					if($gameMap.ss(evt._eventId,"knowName")) $gameMessage._nameField=this._nameField||$gameMessage._evtName;
				} // evt face
				else if(txt[1]==="L"){
					txt=txt.slice(2); let m=txt.match(f.re_faceExt_any),idx; 
					if(m){ idx=objs._getObj(m[1]); txt=txt.slice(m[1].length+2); }
					$gameParty.setFace(idx);
				} // partyleader face
			}
			$gameMessage.add(txt);
		}
		switch (this.nextEventCode()) {
		case 102: // Show Choices
			this._index++;
			this.setupChoices(this.currentCommand().parameters);
			break;
		case 103: // Input Number
			this._index++;
			this.setupNumInput(this.currentCommand().parameters);
			break;
		case 104: // Select Item
			this._index++;
			this.setupItemChoice(this.currentCommand().parameters);
			break;
		}
		this._index++;
		this.setWaitMode('message');
	}
	return false;
};
$d$.re_faceExt=/^\[(evt-)?([0-9]+)\]/;
$d$.re_faceExt_any=/^\[([^\]]+)\]/;
$pppp$.ssKey=function(){ // not used ?
	return [this._mapId, this._eventId, this._params[1]];
};
$d$=$pppp$.command111=function f(){ // cond branch
	let result=false;
	switch(this._params[0]){
	case 0:{ // switch
		result = ($gameSwitches.value(this._params[1])===(this._params[2]===0));
	}break;
	case 1:{ // var
		let value1 = $gameVariables.value(this._params[1]);
		let value2;
		if(this._params[2]===0) value2=this._params[3];
		else value2=$gameVariables.value(this._params[3]);
		switch(this._params[4]){
		case 0:{
			result=(value1===value2);
		}break;
		case 1:{
			result=(value1>=value2);
		}break;
		case 2:{
			result=(value1<=value2);
		}break;
		case 3:{
			result=(value1>value2);
		}break;
		case 4:{
			result=(value1<value2);
		}break;
		case 5:{
			result=(value1!==value2);
		}break;
		}
	}break;
	case 2:{ // ss
		if (this._eventId.toId()>0) {
			let key=[this._mapId,this._eventId,this._params[1]];
			result=($gameSelfSwitches.value(key)===(this._params[2]===0));
		}
	}break;
	case 3:{ // timer
		if ($gameTimer.isWorking()){
			if(this._params[2]===0){
				result=($gameTimer.seconds()>=this._params[1]);
			}else{
				result=($gameTimer.seconds()<=this._params[1]);
			}
		}
	}break;
	case 4:{ // actor
		let actor=$gameActors.actor(this._params[1]);
		if(actor){
			let n=this._params[3];
			switch(this._params[2]){
			case 0:{ // In the Party
				result=$gameParty.members().contains(actor);
			}break;
			case 1:{ // Name
				result=(actor.name()===n);
			}break;
			case 2:{ // Class
				result=actor.isClass($dataClasses[n]);
			}break;
			case 3:{ // Skill
				result=actor.hasSkill(n);
			}break;
			case 4:{ // Weapon
				result=actor.hasWeapon($dataWeapons[n]);
			}break;
			case 5:{ // Armor
				result=actor.hasArmor($dataArmors[n]);
			}break;
			case 6:{ // State
				result=actor.isStateAffected(n);
			}break;
			}
		}
	}break;
	case 5:{ // Enemy
		let enemy=$gameTroop.members()[this._params[1]];
		if(enemy){
			switch(this._params[2]){
			case 0:{ // Appeared
				result=enemy.isAlive();
			}break;
			case 1:{ // State
				result=enemy.isStateAffected(this._params[3]);
			}break;
			}
		}
	}break;
	case 6:{ // chr dir
		let character=this.character(this._params[1]);
		if(character) result=(character.direction()===this._params[2]);
	}break;
	case 7:{ // Gold
		switch(this._params[2]){
		case 0:{
			result=($gameParty.gold()>=this._params[1]);
		}break;
		case 1:{
			result=($gameParty.gold()<=this._params[1]);
		}break;
		case 2:{
			result=($gameParty.gold()<this._params[1]);
		}break;
		}
	}break;
	case 8:{ // Item
		result=$gameParty.hasItem($dataItems[this._params[1]]);
	}break;
	case 9:{ // Weapon
		result=$gameParty.hasItem($dataWeapons[this._params[1]], this._params[2]);
	}break;
	case 10:{ // Armor
		result=$gameParty.hasItem($dataArmors[this._params[1]], this._params[2]);
	}break;
	case 11:{ // Button
		result=Input.isPressed(this._params[1]);
	}break;
	case 12:{ // Script
		if(this._params[1][0]===":"&&this._params[1][1]==="!") result=!!f.script.call(this,this._params[1].slice(2));
		else result=!!objs._getObj.call(this,this._params[1]);
	}break;
	case 13:{ // Vehicle
		result=($gamePlayer.vehicle()===$gameMap.vehicle(this._params[1]));
	}break;
	}
	if((this._branch[this._indent]=result)===false) this.skipBranch();
	return true;
};
$d$.script=function(j){
	j=JSON.parse(j);
	let obj=false;
	switch(j[0]){
	case "func":{
		if(j[1] in rpgevts){
			let curr=rpgevts,argv;
			for(let x=1;x!==j.length&&curr;++x){ let next=j[x];
				if(next&&next.constructor===Array){ argv=next; break; }
				else curr=curr[next];
			}
			return curr(this.getEvt(),argv,this);
		}
		return;
	}break;
	case "itrp":
	case "this": obj=this; break;
	case "pt": obj=$gameParty; break;
	case "pl": obj=$gamePlayer; break;
	case "mp": obj=$gameMap; break;
	case "tmp": obj=$gameTemp; break;
	case "evt": obj=this.getEvt(); break;
	case "evtd": obj=this.getEvt().event(); break;
	case "evts": obj=$gameMap._events; break;
	case "dataMp": obj=$dataMap; break;
	case "dataIt": obj=$dataItems; break;
	case "dataAm": obj=$dataArmors; break;
	case "dataSk": obj=$dataSkills; break;
	case "dataWp": obj=$dataWeapons; break;
	}
	if(obj&&j.length){
		for(let x=1,prev=obj;x!==j.length;++x){
			obj=obj[j[x]];
			if(x+1!==j.length&&j[x+1]==="()"){
				++x;
				if(x+1!==j.length && j[x+1].constructor===Array) obj=obj.apply(prev,j[++x]);
				else obj=obj.call(prev);
			}
			prev=obj;
		}
		return obj;
	}
};
$pppp$.command413=function(){ // loop-repeat
	this._index=this._loop[this._index];
	return true;
};
$pppp$.command113=function(){ // loop-break
	this._index=this._loop[this._index];
	return true;
};
$pppp$.command119=function(){ // goto
	const newIdx=this._labelTbl && this._labelTbl[this._params[0]];
	if(newIdx>=0) this.jmp(newIdx|0);
	return true; // cmd exec-ed, '._index' will inc.
};
$d$=$pppp$.jmp=function f(idx){
	// supposed not jmp to [456]XX , so '._indent' will be properly overwritten
	let L=idx,R=this._index;
	if(R<L){ const tmp=L; L=R; R=tmp; }
	++R;
	const tbl=this._segtree_indent; if(!tbl.max.query) f.tbl.forEach(f.forEach,tbl); // === .min
	const M=tbl.max.query(L,R),m=tbl.min.query(L,R);
	for(let x=m;x<=M;++x) this._branch[x]=null;
	this._index=idx;
};
$d$.forEach=function(k){ (this[k]=Object.toType(this[k],SegmentTree))._op=Math[k]; };
$d$.tbl=['max','min',];
$d$=$pppp$.command122=function f(){ // ctrl var
	let value = 0;
	switch (this._params[3]) { // Operand
	case 0:{ // Constant
		value = this._params[4];
	}break;
	case 1:{ // Variable
		value = $gameVariables.value(this._params[4]);
	}break;
	case 2:{ // Random
		value = this._params[5] - this._params[4] + 1;
		for (let i = this._params[0]; i <= this._params[1]; i++) {
			this.operateVariable(i, this._params[2], this._params[4] + Math.randomInt(value));
		}
		return true;
	}break;
	case 3:{ // Game Data
		value = this.gameDataOperand(this._params[4], this._params[5], this._params[6]);
	}break;
	case 4:{ // Script
		if(this._params[4][0]===":"&&this._params[4][1]==="!") value=f.script.call(this,this._params[4].slice(2));
		else value=objs._getObj.call(this,this._params[4]);
	}break;
	}
	for (let i = this._params[0]; i <= this._params[1]; i++) {
		this.operateVariable(i, this._params[2], value);
	}
	return true;
};
$d$.script=$pppp$.command111.script;
$pppp$.command123=function(){ // ctrl ss
	if(this._eventId.toId()>0){
		let key=[this._mapId,this._eventId,this._params[0]];
		$gameSelfSwitches.setValue(key, this._params[1] === 0);
	}
	return true;
};
$pppp$.command214=function(){ // erase evt
	if(this.isOnCurrentMap()&&this._eventId.toId()>0) $gameMap.eraseEvent(this._eventId);
	return true;
};
$d$=$pppp$.command314 = function f(){
	this.iterateActorEx(this._params[0], this._params[1], f.recover);
	return true;
};
$d$.recover=actor=>actor.recoverAll(true);
$d$=$pppp$.command355 = function f() {
	let script = this.currentCommand().parameters[0] + '\n';
	let flag=script[0]===":"&&script[1]==="!"; // ===":!"
	if(flag) script=script.slice(2);
	while (this.nextEventCode() === 655) {
		++this._index;
		script += this.currentCommand().parameters[0] + '\n';
	}
	if(flag) f.script.call(this,script);
	else{
		//eval(script);
		objs._doFlow.call(this,script);
	}
	return true;
};
$d$.script=$pppp$.command111.script;
// - - expose info
$pppp$.getEvt=function(){ return $gameMap._events[this._eventId] };
$pppp$=$aaaa$=undef;

// - Game_BattlerBase
$aaaa$=Game_BattlerBase;
$pppp$=$aaaa$.prototype;
$pppp$.clearCache=function(key){
	// if !key then clear all
	if(key) $gameTemp.delCache(this,key);
	else $gameTemp.clearCache(this);
};
Object.defineProperties($aaaa$.prototype, {
	mtp: { get: function() { return this.maxTp(); }, configurable: false },
	stp: { get: function() { return this._stp; }, configurable: false },
	mstp: { get: function() { return this.maxStp(); }, configurable: false },
	lastPayMp:{ get: function() { return this.lastPay().mp||0; },configurable: false},
	lastPayHp:{ get: function() { return this.lastPay().hp||0; },configurable: false},
	lastPayTp:{ get: function() { return this.lastPay().tp||0; },configurable: false},
});

$d$=$pppp$.updateStateTurns=function f(){
	this._states.forEach(f.forEach, this._stateTurns);
};
$d$.forEach=function(stateId) {
	this[stateId]>0 && --this[stateId];
};
$d$=$pppp$.clearStates=function f(){
	this._states_delCache();
	this._stateTurns={};
	if(this._states){
		let newidx=0;
		for(let x=0,arr=this._states;x!==arr.length;++x){
			if($dataStates[arr[x]].meta.persist){
				arr[newidx++]=arr[x];
			}
		}
		this._states.length=newidx;
	}else this._states=[];
	this._overall_delCache();
};
$pppp$.eraseState=function(stateId){
	const index=this._states.indexOf(stateId);
	const rtv=index>=0;
	if(rtv){
		this._states.splice(index, 1);
		const stat=this._states_getCache();
		if(stat){
			stat.splice(index, 1);
			stat.a.delete(stateId);
			const data=$dataStates[stateId];
			stat.s.byKey2_del_sum(data.tmapS);
			stat.m.byKey2_del_mul(data.tmapP);
		}
		this._overall_delCache();
	}
	delete this._stateTurns[stateId];
	return rtv;
};
$pppp$.isStateAffected=function(stateId){
	return (this._states_getCache()||this._states_updateCache()).a.has(stateId);
};
$d$=$pppp$._states_delCache=function f(){
	$gameTemp.delCache(this,f.key);
};
$d$.key=Game_BattlerBase.CACHEKEY_STATE;
$d$=$pppp$._states_getCache=function f(){
	return $gameTemp.getCache(this,f.key);
};
$d$.key=Game_BattlerBase.CACHEKEY_STATE;
$d$=$pppp$._states_updateCache=function f(){
	let rtv;
	$gameTemp.updateCache(this,f.key,rtv=this._states.map(f.map));
	rtv.a=new Set(this._states);
	const s=rtv.s=new Map() , m=rtv.m=new Map();
	for(let x=0;x!==rtv.length;++x){
		s.byKey2_sum(rtv[x].tmapS);
		m.byKey2_mul(rtv[x].tmapP);
	}
	return rtv;
};
$d$.key=Game_BattlerBase.CACHEKEY_STATE;
$d$.map=id=>$dataStates[id];
$pppp$._addNewState_updateCache=function(stateId){
	this._states.push(stateId);
	const stat=this._states_getCache();
	if(stat){
		stat.a.add(stateId);
		const data=$dataStates[stateId];
		stat.push(data);
		stat.s.byKey2_sum(data.tmapS);
		stat.m.byKey2_mul(data.tmapP);
	}
	this._overall_delCache();
};
$pppp$.addNewState=function(stateId){
	let cancel=false;
	if(stateId === this.deathStateId()){
		//this.die();
		if(this.isAbleToAutoRevive()){
			cancel=true;
			this._hp=1;
		}
	}
	if(!cancel){
		const restricted = this.isRestricted();
		this._addNewState_updateCache(stateId);
		this.sortStates();
		if(!restricted && this.isRestricted()){
			this.onRestrict();
		}
	}
};
$pppp$.states_noSlice=function(){
	return this._states_getCache()||this._states_updateCache();
};
$pppp$.states=function f(){
	return this.states_noSlice().slice();
};
$d$=$pppp$.sortStates=function f(){
	this._states.sort(f.cmp[0]);
	const stat=this._states_getCache();
	if(stat) stat.sort(f.cmp[1]);
};
$d$.cmp=[
	(a, b)=>{
	        const pa=$dataStates[a].priority , pb=$dataStates[b].priority;
		return (pa===pb)?(a - b):(pb - pa);
	},
	(a,b)=>{
	        const pa=a.priority , pb=b.priority;
		return (pa===pb)?(a.id - b.id):(pb - pa);
	},
];
$pppp$.restriction=function(){
	let rtv=0;
	for(let x=0,arr=this.states_noSlice();x!==arr.length;++x)
		if(rtv<arr[x].restriction) rtv=arr[x].restriction;
	return rtv;
};
$pppp$.mostImportantStateText=function(){
	for(let x=0,arr=this.states_noSlice();x!==arr.length;++x)
		if(arr[x].message3) return arr[x].message3;
	return '';
};
$pppp$.stateMotionIndex=function(){
	const states = this.states_noSlice();
	if(states.length) return states[0].motion;
	else return 0;
};
$pppp$.stateOverlayIndex=function(){
	const states = this.states_noSlice();
	if(states.length) return states[0].overlay;
	else return 0;
};
$pppp$.stateIcons=function(rtv){
	const icons=rtv||[] , arr=this.states_noSlice();
	for(let x=0;x!==arr.length;++x) if(arr[x].iconIndex>0) icons.push(arr[x].iconIndex);
	return icons;
};
$pppp$.buffIcons=function(rtv){
	const icons=rtv||[] , arr=this._buffs;
	for(let x=0;x!==arr.length;++x)
		if(arr[x]>0) icons.push(this.buffIconIndex(arr[x],x));
	return icons;
};
$pppp$.allIcons=function(){
	return this.buffIcons(this.stateIcons());
};
$pppp$.getTraits_states_s=function(code,id){
	// return: undefined / Map / value
	const rtv=this.states_noSlice().s.get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.getTraits_states_m=function(code,id){
	// return: undefined / Map / value
	const rtv=this.states_noSlice().m.get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$d$=$pppp$.getTraits_native_s=function f(code,id){
	// return: undefined / Map / value (code and id provided and value got)
	// not assign 'none' due to showing the comment above
};
$pppp$.getTraits_native_m=$d$;
$pppp$.getTraits_equips_s=$d$;
$pppp$.getTraits_equips_m=$d$;
$pppp$.getTraits_custom_s=$d$;
$pppp$.getTraits_custom_m=$d$;
$pppp$._overall_delCache=function(code){
	this._overall_s_delCache(code);
	this._overall_m_delCache(code);
};
$d$=$pppp$._overall_s_delCache=function f(code){
	if(code){
		const c=$gameTemp.getCache(this,f.key);
		if(c) c.delete(code);
	}else $gameTemp.delCache(this,f.key);
};
$tttt$=$d$.key=Game_BattlerBase.CACHEKEY_OVERALL_S;
$d$=$pppp$._overall_s_getCache=function f(code){
	const c=$gameTemp.getCache(this,f.key);
	if(c&&c.mapd!==$dataMap) return this._overall_s_delCache();
	return (c&&code)?c.get(code):c;
};
$d$.key=$tttt$;
$d$=$pppp$._overall_s_updateCache=function f(code){
	if(!code) return; // lazy to do overall and code===0 update
	let rtv,tmp=this._overall_s_getCache();
	if(!tmp) $gameTemp.updateCache(this,f.key,tmp=new Map());
	tmp.mapd=$dataMap;
	if(rtv=tmp.get(code)) rtv.clear();
	else tmp.set(code,rtv=new Map());
	
	tmp=this.getTraits_native_s(code);
	if(tmp) rtv.byKey_sum(tmp,true);
	tmp=this.getTraits_states_s(code);
	if(tmp) rtv.byKey_sum(tmp,true);
	tmp=this.getTraits_equips_s(code);
	if(tmp) rtv.byKey_sum(tmp,true);
	tmp=this.getTraits_custom_s(code);
	if(tmp) rtv.byKey_sum(tmp,true);
	
	// environment
	tmp=$dataMap&&$dataMap.tmapS&&$dataMap.tmapS.get(code);
	if(tmp) rtv.byKey_sum(tmp,true);
	
	return rtv;
};
$d$.key=$tttt$;
$tttt$=undef;
$pppp$.getTraits_overall_s=function(code,id){
	let rtv,tmp;
	if(id===undefined) return this._overall_s_getCache(code)||this._overall_s_updateCache(code);
	else{
		rtv=0;
		tmp=this.getTraits_native_s(code,id);
		if(tmp!==undefined) rtv+=tmp;
		tmp=this.getTraits_states_s(code,id);
		if(tmp!==undefined) rtv+=tmp;
		tmp=this.getTraits_equips_s(code,id);
		if(tmp!==undefined) rtv+=tmp;
		tmp=this.getTraits_custom_s(code,id);
		if(tmp!==undefined) rtv+=tmp;
		
		// environment
		tmp=$dataMap&&$dataMap.tmapS&&$dataMap.tmapS.get(code);
		if(tmp) (tmp=tmp.get(id))&&(rtv+=tmp);
		
		rtv=(~~( rtv*100+(rtv<0?-0.5:0.5) ))/100;
	}
	return rtv;
};
$d$=$pppp$._overall_m_delCache=function f(code){
	if(code){
		const c=$gameTemp.getCache(this,f.key);
		if(c) c.delete(code);
	}else $gameTemp.delCache(this,f.key);
};
$tttt$=$d$.key=Game_BattlerBase.CACHEKEY_OVERALL_M;
$d$=$pppp$._overall_m_getCache=function f(code){
	const c=$gameTemp.getCache(this,f.key);
	if(c&&c.mapd!==$dataMap) return this._overall_m_delCache();
	return (c&&code)?c.get(code):c;
};
$d$.key=$tttt$;
$d$=$pppp$._overall_m_updateCache=function f(code){
	if(!code) return; // lazy to do overall and code===0 update
	let rtv,tmp=this._overall_m_getCache();
	if(!tmp) $gameTemp.updateCache(this,f.key,tmp=new Map());
	tmp.mapd=$dataMap;
	if(rtv=tmp.get(code)) rtv.clear();
	else tmp.set(code,rtv=new Map());
	
	tmp=this.getTraits_native_m(code);
	if(tmp) rtv.byKey_mul(tmp,true);
	tmp=this.getTraits_states_m(code);
	if(tmp) rtv.byKey_mul(tmp,true);
	tmp=this.getTraits_equips_m(code);
	if(tmp) rtv.byKey_mul(tmp,true);
	tmp=this.getTraits_custom_m(code);
	if(tmp) rtv.byKey_mul(tmp,true);
	
	// environment
	tmp=$dataMap&&$dataMap.tmapS&&$dataMap.tmapP.get(code);
	if(tmp) rtv.byKey_mul(tmp,true);
	
	return rtv;
};
$d$.key=$tttt$;
$tttt$=undef;
$pppp$.getTraits_overall_m=function(code,id){
	let rtv,tmp;
	if(id===undefined) return this._overall_m_getCache(code)||this._overall_m_updateCache(code);
	else{
		rtv=1;
		tmp=this.getTraits_native_m(code,id);
		if(tmp!==undefined) rtv*=tmp;
		tmp=this.getTraits_states_m(code,id);
		if(tmp!==undefined) rtv*=tmp;
		tmp=this.getTraits_equips_m(code,id);
		if(tmp!==undefined) rtv*=tmp;
		tmp=this.getTraits_custom_m(code,id);
		if(tmp!==undefined) rtv*=tmp;
		
		// environment
		tmp=$dataMap&&$dataMap.tmapS&&$dataMap.tmapS.get(code);
		if(tmp&&(tmp=tmp.get(id))!==undefined) rtv*=tmp;
	}
	return rtv;
};
$pppp$.traitsPi=function(code, id){
	return this.getTraits_overall_m(code,id);
};
$pppp$.traitsSum=function(code, id){
	return this.getTraits_overall_s(code,id);
};
$pppp$.traitsSumAll=function(code){
	return this.getTraits_overall_s(code).v||0;
};
$pppp$.traitsSet=function(code){
	return this.getTraits_overall_s(code);
};
$pppp$.traitsMaxId=function(code,min){
	const t=this.getTraits_overall_s(code);
	let rtv=min||0;
	if(t) t.forEach((v,k)=>rtv<k&&(rtv=k));
	return rtv;
};
$pppp$.paramBase=function(paramId){
	let rtv=this.currentClass().params[paramId][this._level];
	if(this.stp===0) rtv/=10;
	return rtv||0;
};
$d$=$pppp$.paramMin=function f(paramId){
	switch(paramId){
	case 0: return 1;
	case 1: return 0;
	}
	return f.tbl;
};
$d$.tbl=-Infinity;
$pppp$.paramMax=function(paramId){
	return paramId>1?999999:99999999;
};
$pppp$.param=function(paramId){
	
	// Window_EquipStatus.prototype.drawNewParam use '-', so String(s) are casted to Number
	switch(~~((paramId+12)/10)){
	case 1:
		switch(paramId){
		case -2: return this.sparam(9).toExponential(2);
		case -1: return this.makeActionTimes();
		}
	break;
	default:
	case 2: return this.xparam(paramId-8).toFixed(2);
	break;
	case 3:
		switch(paramId){
		case 26: return this.TPRegenAtBattleEnd(); // page2
		case 27: return this.attackTimesMul().toFixed(3);
		}
		return this.sparam(paramId-18).toExponential(2);
	break;
	case 4:
		switch(paramId){
		case 36: return this.decreaseDamageP();
		case 37: return this.decreaseDamageM();
		}
		return this.paramRate(paramId-28);
	break;
	case 5:
		switch(paramId){
		case 38: return this.MPSubstituteRate().toFixed(3);
		}
		return this.param();
	}
	
	let value = this.paramBase(paramId) + this.paramPlus(paramId);
	value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
	{ let tmp=this.paramMin(paramId);
	if(!(value>=tmp)) value=tmp;
	else{
		tmp=this.paramMax(paramId);
		if(value>tmp) value=tmp;
	} }
	return ~~(value+(value<0?-0.5:0.5));
};
$pppp$.setHp=function(hp){
	if(this._hp === hp) return;
	this._hp = hp;
	this.refresh(true);
};
$pppp$.setMp=function(mp){
	if(this._mp === mp) return;
	this._mp = mp;
	this.refresh(true);
};
$pppp$.setTp=function(tp){
	if(this._tp === tp) return;
	this._tp = tp;
	this.refresh(true);
};
$pppp$.setStp=function(val){
	if(this._stp===val) return;
	this._stp=val;
	this.refresh();
};
$pppp$.maxStp=()=>1000;
$d$=$pppp$.refresh=function f(){
	this.stateResistSet().forEach(f.forEach, this);
	let tmp;
	
	if(this._hp<0) this._hp=0;
	else{
		tmp=this.mhp;
		if(this._hp>tmp) this._hp=tmp;
	}
	
	if(this._mp<0) this._mp=0;
	else{
		tmp=this.mmp;
		if(this._mp>tmp) this._mp=tmp;
	}
	
	if(this._tp<0) this._tp=0;
	else{
		tmp=this.maxTp();
		if(this._tp>tmp) this._tp=tmp;
	}
	
	if(this._stp!==undefined){
		if(this._stp<0) this._stp=0;
		else{
			tmp=this.maxStp();
			if(this._stp>tmp) this._stp=tmp;
		}
	}
};
$d$.forEach=function(stateId){
	this.eraseState(stateId);
};
$k$='recoverAll';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(ignoreBuff){
	if(ignoreBuff){
		let arr=this._states.filter(f.forEach);
		let steps={},turns={};
		for(let x=0;x!==arr.length;++x){
			let id=arr[x];
			steps[id]=this._stateSteps[id];
			turns[id]=this._stateTurns[id];
		}
		f.ori.call(this);
		if(this._stp<=0) this._stp=1;
		for(let x=0;x!==arr.length;++x){
			let id=arr[x];
			this._states.push(id);
			this._stateSteps[id]=steps[id];
			this._stateTurns[id]=turns[id];
		}
	}else return f.ori.call(this);
}; $d$.ori=$r$;
$d$.forEach=x=>{
	const meta=$dataStates[x.toId()].meta;
	return meta.buff||meta.persist;
};
$pppp$.stpRate=function(){
	return this.stp/this.maxStp()||0;
};
$pppp$.isStarving=function(){
	return this.stp===0;
};
$pppp$.isHungry=function(){
	return this.stpRate()<0.1;
};
$pppp$.skillHpCost=function(skill){
	//return skill.hpCost|0; // Math.floor((skill.hpCost|0) * this.hcr);
	return ~~(this.mhp*skill.hpCostMR + this.hp*skill.hpCostCR + skill.hpCost);
};
$pppp$.skillMpCost=function(skill){
	return ~~((~~(this.mmp*skill.mpCostMR + this.mp*skill.mpCostCR + skill.mpCost + 0.5)) * this.mcr);
	(skill.mpCost * this.mcr)
	return skill.mpCost+~~(skill.mpCost * this.mcr);
};
$pppp$.canPaySkillCost=function(skill){
	return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill) && this._hp > this.skillHpCost(skill) ;
};
$d$=$pppp$.paySkillCost=function f(skill){
	const payhp=this.skillHpCost(skill);
	const paymp=this.skillMpCost(skill);
	const paytp=this.skillTpCost(skill);
	$gameTemp.updateCache(this,f.key,{hp:payhp,mp:paymp,tp:paytp});
	this._hp -= payhp;
	this._mp -= paymp;
	this._tp -= paytp;
};
$tttt$=$d$.key=Game_BattlerBase.CACHEKEY_LASTPAY;
$d$=$pppp$.lastPay=function f(){
	return $gameTemp.getCache(this,f.key)||f.tbl;
};
$d$.key=$tttt$;
$tttt$=undef;
$d$.tbl={};
$pppp$.isOccasionOk=function(item){
	return item.occasion === 0 || (!$gameParty.inBattle())+1 === item.occasion;
};
$d$=$pppp$.canUse=function f(dataItem){
	if(!dataItem) return false;
	const meta=dataItem.meta;
	{ const cond=dataItem.cond||(dataItem.cond=(meta.cond=meta.cond)&&objs._getObj(meta.cond));
	if(cond && !cond()) return false;
	}
	// when use an item via press 'ok' without release, 'meta' has chance to become 'undefined'
	if(SceneManager._scene.constructor===Scene_Item && meta && (meta.code||meta.func) && $gameParty.hasItem(dataItem)) return true;
	switch(dataItem.itemType){
	default: break;
	case 's':
		return this.meetsSkillConditions(dataItem);
	break;
	case 'i':
		return this.meetsItemConditions(dataItem);
	break;
	}
	return false;
};
$d$.tbl=[
['rpgskills',],
[], // placeholder
];
$pppp$.canEquip=function(dataItem){
	if(!dataItem) return false;
	switch(dataItem.itemType){
	default: break;
	case 'w':
		return this.canEquipWeapon(dataItem);
	break;
	case 'a':
		return this.canEquipArmor(dataItem);
	break;
	}
	return false;
};
$pppp$.spaceoutSkillId=()=>3;
$pppp$.canSpaceout=function(){
	return this.canUse($dataSkills[this.spaceoutSkillId()]);
};
$pppp$=$aaaa$=undef;

// - battler
$aaaa$=Game_Battler;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this._animations=new Queue();
}; $d$.ori=$r$;
$k$='initMembers';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){ // 'initMembers' then 'Sprite.setBattler(this)'
	f.ori.call(this);
	this._actions=new Queue(2);
	this._weapon2ImageId = 0;
}; $d$.ori=$r$;
$pppp$.setSprite=function(sprite){
	let m=SceneManager._scene._chr2sp;
	if(!m) m=SceneManager._scene._chr2sp=new Map();
	m.set(this,sprite);
};
$pppp$.removeSprite=function(sprite){
	let m=SceneManager._scene._chr2sp;
	if(!m) m=SceneManager._scene._chr2sp=new Map();
	m.delete(this);
};
$pppp$.getActResQ=function(){
	const m=SceneManager._scene._chr2actResQ;
	if(!m) return;
	return m.get(this);
};
$pppp$.reserveActResQ=function(){
	const m=SceneManager._scene._chr2actResQ;
	if(!m) return;
	let q=m.get(this);
	if(!q) m.set(this,q=new Queue());
	return q;
};
$pppp$.pushActResQ=function(actResRef){
	let q=this.reserveActResQ();
	if(q) q.push(actResRef.copy());
};
$pppp$.popActResQ=function(){
	const q=this.reserveActResQ();
	if(q) return q.shift();
};
$pppp$.clearAnimations=function(){
	this._animations.clear();
};
$pppp$.clearWeapon2Animation = function() {
	this._weapon2ImageId = 0;
};
$pppp$.isWeapon2AnimationRequested=function(){
	return this._weapon2ImageId > 0;
};
$pppp$.weapon2ImageId=function(){
	return this._weapon2ImageId;
};
$pppp$.startWeapon2Animation=function(weaponImageId) {
	this._weapon2ImageId = weaponImageId;
};
$pppp$.action=function(idx){
	return this._actions.getnth(idx);
};
$pppp$.setAction=function(idx,act){
	if(BattleManager._isGuardWaiting){ // also 'BattleManager._isChanting'
		const guard=$dataSkills[this.guardSkillId()];
		const pre=this._actions.getnth(idx);
		if(pre){
			const item=pre.item();
			if(item===guard){
				const n=BattleManager._isGuardWaiting.get(this);
				if(n) BattleManager._isGuardWaiting.set(this,n-1);
			}
			
			if(pre.isMagicSkill()){
				const n=BattleManager._isChanting.get(this);
				if(n) BattleManager._isChanting.set(this,n-1);
			}
		}
		this._actions.setnth(index,act);
		if(act){
			if(act.item()===guard){
				const n=BattleManager._isGuardWaiting.get(this)|0;
				BattleManager._isGuardWaiting.set(this,n+1);
			}
			
			if(act.isMagicSkill()){
				const n=BattleManager._isChanting.get(this)|0;
				BattleManager._isChanting.set(this,n+1);
			}
		}
	}else this._actions.setnth(index,act);
};
$pppp$.clearActions=function(){
	this._actions.clear(2);
	BattleManager._isGuardWaiting&&BattleManager._isGuardWaiting.delete(this);
	BattleManager._isChanting&&BattleManager._isChanting.delete(this);
};
$pppp$.removeStatesAuto=function(timing){
	this._states.forEach(stateId=>{
		const state=$dataStates[stateId];
		if(this.isStateExpired(stateId) && state.autoRemovalTiming === timing) {
			this.removeState(stateId);
		}
	});
};
$pppp$.makeActionTimes=function(){ // change logic: rnd each -> rnd remainder(<1)
	const rtv=this.traitsSum(Game_BattlerBase.TRAIT_ACTION_PLUS,0)||0; // id應該是0啦。原本的code用actionPlusSet每個算機率決定是否+1，未指定id
	return (Math.random()<(rtv-~~rtv))+rtv+1;
};
$pppp$.makeActions=function(){
	this.clearActions(); // reset action input index in Game_Actor
	if(this.canMove()){
		const actionTimes = this.makeActionTimes();
		this._actions.clear(actionTimes+2); // init size
		for(let i=0;i!==actionTimes;++i){
			this._actions.push(new Game_Action(this));
		}
	}
};
$d$=$pppp$.makeSpeed=function f(){
    this._speed = Math.min.apply(null, this._actions.map(f.forEach)) || 0;
};
$d$.forEach=act=>act.speed();
$pppp$.removeCurrentAction=function(){
	const a=this._actions.shift();
	if(BattleManager._isGuardWaiting && a&&a.item()===$dataSkills[this.guardSkillId()]){
		const n=BattleManager._isGuardWaiting.get(this);
		if(n) BattleManager._isGuardWaiting.set(this,n-1);
	}
	
	if(BattleManager._isChanting && a&&a.isMagicSkill()){
		const n=BattleManager._isChanting.get(this);
		if(n) BattleManager._isChanting.set(this,n-1);
	}
};
$k$='forceAction';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(skillId, targetIndex){
	f.ori.call(this,skillId, targetIndex);
	if(BattleManager._isGuardWaiting && skillId===this.guardSkillId()){
		const n=BattleManager._isGuardWaiting.get(this)|0;
		BattleManager._isGuardWaiting.set(this,n+1);
	}
	
	if(BattleManager._isChanting && this._actions.back.isMagicSkill()){
		const n=BattleManager._isChanting.get(this)|0;
		BattleManager._isChanting.set(this,n+1);
	}
}; $d$.ori=$r$;
$pppp$.useItem = function(item) {
	switch(item&&item.itemType){
	case 's': this.paySkillCost(item);
	break;
	case 'i': this.consumeItem(item);
	break;
	}
};
$pppp$.gainStp = function(value){
	if(this.stp===undefined) return;
	this._result.stpDamage = -value;
	this.setStp(this.stp + value);
};
$pppp$.onBattleStart = function() {
	this.setActionState('undecided');
	this.clearMotion();
};
$r$=$pppp$.onTurnEnd;
$d$=$pppp$.onTurnEnd=function f(){
	this.noRefresh=true;
	f.ori.call(this);
	this.noRefresh=0;
	if(this._needRefresh){
		delete this._needRefresh;
		this.refresh(true);
	}
}; $d$.ori=$r$;
$k$='onBattleEnd';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this.gainSilentTp(this.TPRegenAtBattleEnd());
}; $d$.ori=$r$;
$pppp$.isChanting=function(){
	return this.isWaiting()&&BattleManager._isChanting&&BattleManager._isChanting.get(this);
};
$pppp$.isGuardWaiting=function(){
	return this.isWaiting()&&BattleManager._isGuardWaiting&&BattleManager._isGuardWaiting.get(this);
};
$pppp$.performActionStart = function(action) {
	if(!action.isGuard(this)&&!action.isSpaceout(this)){
		this.setActionState('acting');
	}
};
$pppp$.performAction=none; // ori:empty
$pppp$._updateFlr=none;
$pppp$=$aaaa$=undef;

// - chrB
$aaaa$=Game_CharacterBase;
$pppp$=$aaaa$.prototype;
$pppp$.jumpHeight=function(){
	const d=this._jumpCount - this._jumpPeak;
	return (this._jumpPeak * this._jumpPeak - d*d)/2.0;
};
$pppp$.scrolledX_tw=function() {
	return $gameMap.adjustX_tw(this._realX);
};
$pppp$.scrolledY_th=function() {
	return $gameMap.adjustY_th(this._realY);
};
$pppp$.isNearTheScreen = function() {
	const gw = Graphics.width , gh = Graphics.height;
	const px = this.scrolledX_tw() + ($gameMap.tileWidth_half ()) - (gw>>1);
	const py = this.scrolledY_th() + ($gameMap.tileHeight_half()) - (gh>>1);
	return px >= -gw && px <= gw && py >= -gh && py <= gh;
};
$pppp$.screenX=function() {
	return this.scrolledX_tw()+($gameMap.tileWidth_half());
};
$pppp$.screenY=function() {
	return (this._sy|0)+this.scrolledY_th()+$gameMap.tileHeight()-this.shiftY()-this.jumpHeight();
};
$pppp$.screenY_deltaToParent=function(){
	let rtv=0;
	if(this._priorityType===2 && this.parentId){
		let p=$gameMap._events[this.parentId];
		if(p===undefined){
			//console.warn("no parent found:",this.parentId);
			if(this.constructor===Game_Event){ // parent is gone
				this.erase();
				let sp=this.getSprite();
				if(sp) sp.remove();
			}
			return false;
		}else if(p._priorityType!==2) rtv+=p.y-this.y;
	}
	return rtv;
};
$pppp$.screenZ=function(){
	if(!isNone(this._z)) return this._z;
	if(this._priorityType===2&&this!==$gamePlayer){
		let rtv=0;
		if($gamePlayer) rtv+=$gamePlayer.screenZ();
		if(!rtv) rtv+=3; // 3, same as Sprite_Chr($gamePlayer)'s z
		return rtv;
	}
	return (this._priorityType<<1)|1;
};
$pppp$.screenZ2=function(){ // z of (x,y sys of gameMapZ), distinguish thing at same x,y
	let rtv=this.z2;
	return isNone(rtv)?3:rtv;
};
$d$=$pppp$.canPassDiagNumpad = function f(x,y,dir){
	return this.canPassDiagonally(x,y,f.h[dir],f.v[dir]);
};
//       [0,1,2,3,4,5,6,7,8,9];
$d$.h=[0,4,0,6,4,0,6,4,0,6];
$d$.v=[0,2,2,2,0,0,0,8,8,8];
$d$=$pppp$.moveDiagonally=function f(horz, vert) {
	let isSucc=this.canPassDiagonally(this._x, this._y, horz, vert);
	this.setMovementSuccess(isSucc);
	if(isSucc){
		this._x=$gameMap.roundXWithDirection(this._x, horz);
		this._y=$gameMap.roundYWithDirection(this._y, vert);
		this._realX=$gameMap.xWithDirection(this._x, this.reverseDir(horz));
		this._realY=$gameMap.yWithDirection(this._y, this.reverseDir(vert));
		this.increaseSteps();
	}else{
		let canx=this.canPass(this._x,this._y,horz),cany=this.canPass(this._x,this._y,vert);
		isSucc=canx|cany;
		let tmp=this._mvSpBuf; this._mvSpBuf=undefined;
		if(this._direction&4){
			if(canx) this.moveStraight(horz);
			else if(cany) this.moveStraight(vert);
		}else{
			if(cany) this.moveStraight(vert);
			else if(canx) this.moveStraight(horz);
		}
		this._mvSpBuf=tmp;
		if(isSucc) return this.setMovementSuccess(isSucc);
	}
	// (this._direction,horz,vert)=>this._direction
	if(!f.dirbit[horz]) horz=0;
	if(!f.dirbit[vert]) vert=0;
	if(horz&&vert){
		if(this._direction===this.reverseDir(horz)){
			return this.setDirection(vert||horz);
		}
		if(this._direction===this.reverseDir(vert)){
			return this.setDirection(horz||vert);
		}
	}else return this.setDirection(horz|vert);
};
//            [0,1,2,3,4,5,6,7,8,9];
$d$.dirbit=[0,0,1,0,2,0,1,0,2,0]; // none:0 +:1 -:2
$k$='moveDiagonally';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(dh,dv){
	f.ori.call(this,dh,dv);
	if(this.isMovementSucceeded()) this.moveSpeedBuff_ctr();
}; $d$.ori=$r$;
$k$='moveStraight';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(dir){
	f.ori.call(this,dir);
	if(this.isMovementSucceeded()) this.moveSpeedBuff_ctr();
}; $d$.ori=$r$;
$d$=$pppp$.d8to4=function f(d){ return f.tbl[d]|0; };
$d$.tbl=[0x00,0x24,0x20,0x26,0x04,0x00,0x06,0x84,0x80,0x86]; /* Y(8,2),X(4,6) numpad */
$pppp$.moveDiagonally_d8=function(d8) {
	let dirxy=this.d8to4(d8);
	let dirx=dirxy&0xF,diry=dirxy>>4;
	return ((dirx===0)|(diry===0))?this.moveStraight(dirx|diry):this.moveDiagonally(dirx,diry);
};
$pppp$.moveSpeedBuff_set=function(buff){ // buff or debuff
	// info: {remain_move,remain_time,delta}
	// take effect after chr stop()
	// one of remain_* reach, buff ends
	//debug.log('Game_Character.prototype.setMoveSpeedBuff');
	if(buff.delta===0) return; // Are you joking?
	if(!this._mvSpBuf){
		this._mvSpBuf={};
		this._mvSpBuf.  buff=[];
		this._mvSpBuf.debuff=[]; // seperate buff/debuff for specified uses like extend buffs time or reduce debuffs time
		this._mvSpBuf.stack=[]; // push order is unrelated
	}
	this._mvSpBuf.stack.push(buff);
};
$pppp$.moveSpeedBuff_cal=function(){
	if(!this._mvSpBuf) return 0;
	let rtv=0;
	let   buff=this._mvSpBuf.  buff;
	let debuff=this._mvSpBuf.debuff;
	for(let x=0,arr=this._mvSpBuf.  buff;x!==arr.length;++x) rtv+=arr[x].delta;
	for(let x=0,arr=this._mvSpBuf.debuff;x!==arr.length;++x) rtv+=arr[x].delta;
	return rtv;
};
$pppp$.moveSpeedBuff_calNext=function(){ // because _ctr is called AFTER chr.move
	if(!this._mvSpBuf) return 0;
	let rtv=0;
	let   buff=this._mvSpBuf.  buff;
	let debuff=this._mvSpBuf.debuff;
	let  stack=this._mvSpBuf.stack;
	for(let x=0,arr=this._mvSpBuf.  buff;x!==arr.length;++x) if(arr[x].remain_move>=2) rtv+=arr[x].delta;
	for(let x=0,arr=this._mvSpBuf.debuff;x!==arr.length;++x) if(arr[x].remain_move>=2) rtv+=arr[x].delta;
	for(let x=0,arr=this._mvSpBuf.stack;x!==arr.length;++x) if(arr[x].remain_move>=1) rtv+=arr[x].delta;
	return rtv;
};
$pppp$.moveSpeedBuff_ctr=function(){ // ctr-=1
	if(!this._mvSpBuf) return;
	for(let x=0,arr=this._mvSpBuf.  buff;x!==arr.length;++x){
		if(--arr[x].remain_move===0){
			arr[x]=arr.back; arr.pop();
			--x;
		}
	}
	for(let x=0,arr=this._mvSpBuf.debuff;x!==arr.length;++x){
		if(--arr[x].remain_move===0){
			arr[x]=arr.back; arr.pop();
			--x;
		}
	}
	let s=this._mvSpBuf.stack;
	while(s.length){
		let buff=s.pop();
		((buff.delta<0)?this._mvSpBuf.debuff:this._mvSpBuf.buff).push(buff);
	}
};
$pppp$.realMoveSpeed=function f(){
	return (this.speedup^0)/2.0+this._moveSpeed+this.moveSpeedBuff_cal()+(this.isDashing()^0);
};
$r$=$pppp$.jump;
$d$=$pppp$.jump=function f(dx,dy){
	return f.ori.call(this,dx|0,dy|0);
}; $d$.ori=$r$;
$pppp$.jumpAbs=function(x,y){
	if(isNaN(x)||isNaN(y)) ; else{
		let dx=Number(x)-this.x,dy=Number(y)-this.y;
		return this.jump(dx,dy);
	}
};
$pppp$.jumpToChr=function(chr){
	return this.jumpAbs(chr.x,chr.y);
};
$pppp$.isCollidedWithEvents=function(posx,posy){ // overwrite. wtf is making a new array and then search
	//debug.log('Game_CharacterBase.prototype.isCollidedWithEvents');
	if(!$gameMap.isValid(posx,posy)) return false;
	let mapd=$dataMap,idx=$gameMap.xy2idx(posx,posy),tbl;
	if(tbl=mapd&&mapd.coordTblNtP1&&mapd.coordTblNtP1[idx]) return tbl.length!==0;
	return (mapd&&mapd.coordTbl&&mapd.coordTbl[idx]||$gameMap._events).some(evt=>evt&&evt.posNt(posx,posy)&&evt.isNormalPriority());
	// note: why normal?
};
$pppp$.setPriorityType=function(p){
	this._priorityType=p;
	return this;
};
$pppp$.setThrough=function(t){
	this._through=t;
	return this;
};
$pppp$.genBlood=function(permanent){ // tile
	if(permanent){
		let data={}; data[$gameMap.xy2idx(this.x,this.y,2)]=599;
		$gameParty.changeMap('tile',data);
	}
	else $dataMap.data[$gameMap.xy2idx(this.x,this.y,2)]=599;
};
$k$='requestAnimation';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(id){
	if(!this._erased) f.ori.call(this,_global_conf.noAnimation?0:id);
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - chr
$aaaa$=Game_Character;
$pppp$=$aaaa$.prototype;
$aaaa$.currMaxEnum=45;
$aaaa$.addEnum=objs._addEnum; // moveroute
// - chr: getData
$d$=$pppp$.getData=function f(){
	return f.obj;
};
$d$.obj={};
Object.defineProperty($d$.obj,'meta',{get:none,set:none,configurable:false});
$pppp$.getActor=none;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this._tmp=[];
}; $d$.ori=$r$;
Object.defineProperties($aaaa$.prototype,{
	// simply shorten
	_moveFrequency:{ get:function(){ return this._mvfreq; },set:function(rhs){
		return this._mvfreq=rhs;
	},configurable:false},
	_moveSpeed:{ get:function(){ return this._mvsp; },set:function(rhs){
		return this._mvsp=rhs;
	},configurable:false},
	_moveType:{ get:function(){ return this._mvtp; },set:function(rhs){
		return this._mvtp=rhs;
	},configurable:false},
	_direction:{ get:function(){ return this._dir; },set:function(rhs){
		return this._dir=rhs;
	},configurable:false},
	_directionFix:{ get:function(){ return this._dirfx; },set:function(rhs){
		return this._dirfx=rhs&&1||0;
	},configurable:false},
	_moveRoute:{ get:function(){ return this._mvr; },set:function(rhs){
		return this._mvr=rhs||0;
	},configurable:false},
	_moveRouteIndex:{ get:function(){ return this._mvridx; },set:function(rhs){
		return this._mvridx=rhs;
	},configurable:false},
	_moveRouteForcing:{ get:function(){ return this._mvrf; },set:function(rhs){
		return this._mvrf=rhs&&1||0;
	},configurable:false},
	_originalMoveRoute:{ get:function(){ return this._omvr; },set:function(rhs){
		return this._omvr=rhs||0;
	},configurable:false},
	_originalMoveRouteIndex:{ get:function(){ return this._omvridx; },set:function(rhs){
		return this._omvridx=rhs;
	},configurable:false},
	_waitCount:{ get:function(){ return this._wc; },set:function(rhs){
		return this._wc=rhs;
	},configurable:false},
	_stepAnime:{ get:function(){ return this._sa; },set:function(rhs){
		return this._sa=rhs&&1||0;
	},configurable:false},
	_walkAnime:{ get:function(){ return this._wa; },set:function(rhs){
		return this._wa=rhs&&1||0;
	},configurable:false},
	// appearance
	_characterIndex:{ get:function(){return this._chrIdx;},set:function(rhs){
		if(this._chrIdx!==rhs) this.imgModded=true;
		return this._chrIdx=rhs;
	},configurable:false},
	_characterName:{ get:function(){return this._chrName;},set:function(rhs){
		if(this._chrName!==rhs) this.imgModded=true;
		return this._chrName=rhs;
	},configurable:false},
	_tileId:{ get:function(){return this._tid;},set:function(rhs){
		if(this._tid!==rhs) this.imgModded=true;
		return this._tid=rhs;
	},configurable:false},
	//  ext
	imgModded:{ get:function(){return this._imgModded;},set:function(rhs){
		if(this._imgModded=rhs) ;//this._imgModded_timestamp=Date.now();
		return rhs;
	},configurable:false},
});
$d$=$pppp$._getColorEdt=function f(){
	let rtv;
	{
		const meta=this.getData().meta;
		if(meta.colors){
			if(!meta.colors_lazyTbl) meta.colors_lazyTbl=JSON.parse(meta.colors).map(f.toJson);
			rtv=meta.colors_lazyTbl[this._pageIndex];
		}else rtv=meta.color;
	}
	if(!rtv) rtv=this._color;
	return rtv;
};
$d$.toJson=x=>x&&JSON.stringify(x)||undefined;
$d$=$pppp$._getScaleEdt=function f(){
	let rtv;
	{
		const meta=this.getData().meta;
		if(meta.scales){
			if(!meta.scales_lazyTbl) meta.scales_lazyTbl=JSON.parse(meta.scales).map(f.toJson);
			rtv=meta.scales_lazyTbl[this._pageIndex];
		}else rtv=meta.scale;
	}
	if(!rtv) rtv=this._scale;
	return rtv;
};
$d$.toJson=$pppp$._getColorEdt.toJson;
$pppp$._getAnchoryEdt=function f(){
	let meta=this.getData().meta;
	if(meta.anchorys){
		if(!meta.anchorys_lazyTbl) meta.anchorys_lazyTbl=JSON.parse(meta.scales);
		return meta.anchorys_lazyTbl[this._pageIndex];
	}else return Number(meta.anchory);
};
// - chr: expose info
$pppp$.dist1=function(chr,real){
	let rtv; if(chr.dist1){
		let dx,dy;
		if(real){
			dx=chr._realX-this._realX;
			dy=chr._realY-this._realY;
		}else{
			dx=chr.x-this.x;
			dy=chr.y-this.y;
		}
		dx*=1-((dx<0)<<1); dy*=1-((dy<0)<<1);
		if($gameMap.isLoopHorizontal()) dx=Math.min($gameMap.width ()-dx,dx);
		if($gameMap.isLoopVertical())   dy=Math.min($gameMap.height()-dy,dy);
		rtv^=0; rtv+=dx+dy;
	} return rtv;
};
$pppp$.dist1_r=function(chr){ return this.dist1(chr,1); };
$pppp$.dist2=function(chr,real){
	let rtv; if(chr.dist2){
		let dx,dy;
		if(real){
			dx=chr._realX-this._realX;
			dy=chr._realY-this._realY;
		}else{
			dx=chr.x-this.x;
			dy=chr.y-this.y;
		}
		dx*=1-((dx<0)<<1); dy*=1-((dy<0)<<1);
		if($gameMap.isLoopHorizontal()) dx=Math.min($gameMap.width ()-dx,dx);
		if($gameMap.isLoopVertical())   dy=Math.min($gameMap.height()-dy,dy);
		rtv^=0; rtv+=dx*dx+dy*dy;
	} return rtv;
};
$pppp$.dist2_r=function(chr){ return this.dist2(chr,1); };
$pppp$.xy2idx=function f(lv){ return $gameMap.xy2idx(this.x,this.y,lv); };
$d$=$pppp$.frontPos=function f(){
	let delta=f.tbl[(this._direction>>1)];
	return {x:this._x+delta.x,y:this._y+delta.y};
};
$d$.tbl=[ {x:0,y:0},
	/*
		2,+y
	4,-x		6,+x
		8,-y
	*/
		{x:0,y:1},
	{x:-1,y:0},	{x:1,y:0},
		{x:0,y:-1},
];
Object.defineProperties($aaaa$.prototype, {
	frontx: { get: function() { return this.frontPos().x; }, configurable: false },
	fronty: { get: function() { return this.frontPos().y; }, configurable: false },
	_dummy:{get:function(){return'';},configurable:false}
});
$pppp$.isInLoc=function(xL,yL,xH,yH){
	// L,H included
	return xL<=this.x&&this.x<=xH&&yL<=this.y&&this.y<=yH;
};
// movecmd
$d$=$pppp$.processMoveCommand=function f(command){
	//debug.log('Game_Character.prototype.processMoveCommand');
	let foo=f.tbl[command.code];
	return foo&&foo.call(this,command.parameters);
};
$d$.tbl=[]; { $d$.tbl.length=46; let gc=$aaaa$;
$d$.tbl[gc.ROUTE_END]=function(params){
	this.processRouteEnd();
};
$d$.tbl[gc.ROUTE_MOVE_DOWN]=function(params){
	this.moveStraight(2);
};
$d$.tbl[gc.ROUTE_MOVE_LEFT]=function(params){
	this.moveStraight(4);
};
$d$.tbl[gc.ROUTE_MOVE_RIGHT]=function(params){
	this.moveStraight(6);
};
$d$.tbl[gc.ROUTE_MOVE_UP]=function(params){
	this.moveStraight(8);
};
$d$.tbl[gc.ROUTE_MOVE_LOWER_L]=function(params){
	this.moveDiagonally(4, 2);
};
$d$.tbl[gc.ROUTE_MOVE_LOWER_R]=function(params){
	this.moveDiagonally(6, 2);
};
$d$.tbl[gc.ROUTE_MOVE_UPPER_L]=function(params){
	this.moveDiagonally(4, 8);
};
$d$.tbl[gc.ROUTE_MOVE_UPPER_R]=function(params){
	this.moveDiagonally(6, 8);
};
$d$.tbl[gc.ROUTE_MOVE_RANDOM]=function(params){
	this.moveRandom();
};
$d$.tbl[gc.ROUTE_MOVE_TOWARD]=function(params){
	this.moveTowardPlayer();
};
$d$.tbl[gc.ROUTE_MOVE_AWAY]=function(params){
	this.moveAwayFromPlayer();
};
$d$.tbl[gc.ROUTE_MOVE_FORWARD]=function(params){
	this.moveForward();
};
$d$.tbl[gc.ROUTE_MOVE_BACKWARD]=function(params){
	this.moveBackward();
};
$d$.tbl[gc.ROUTE_JUMP]=function(params){
	this.jump(params[0], params[1]);
};
$d$.tbl[gc.ROUTE_WAIT]=function(params){
	this._waitCount = params[0] - 1;
};
$d$.tbl[gc.ROUTE_TURN_DOWN]=function(params){
	this.setDirection(2);
};
$d$.tbl[gc.ROUTE_TURN_LEFT]=function(params){
	this.setDirection(4);
};
$d$.tbl[gc.ROUTE_TURN_RIGHT]=function(params){
	this.setDirection(6);
};
$d$.tbl[gc.ROUTE_TURN_UP]=function(params){
	this.setDirection(8);
};
$d$.tbl[gc.ROUTE_TURN_90D_R]=function(params){
	this.turnRight90();
};
$d$.tbl[gc.ROUTE_TURN_90D_L]=function(params){
	this.turnLeft90();
};
$d$.tbl[gc.ROUTE_TURN_180D]=function(params){
	this.turn180();
};
$d$.tbl[gc.ROUTE_TURN_90D_R_L]=function(params){
	this.turnRightOrLeft90();
};
$d$.tbl[gc.ROUTE_TURN_RANDOM]=function(params){
	this.turnRandom();
};
$d$.tbl[gc.ROUTE_TURN_TOWARD]=function(params){
	this.turnTowardPlayer();
};
$d$.tbl[gc.ROUTE_TURN_AWAY]=function(params){
	this.turnAwayFromPlayer();
};
$d$.tbl[gc.ROUTE_SWITCH_ON]=function(params){
	$gameSwitches.setValue(params[0], true);
};
$d$.tbl[gc.ROUTE_SWITCH_OFF]=function(params){
	$gameSwitches.setValue(params[0], false);
};
$d$.tbl[gc.ROUTE_CHANGE_SPEED]=function(params){
	this.setMoveSpeed(params[0]);
};
$d$.tbl[gc.ROUTE_CHANGE_FREQ]=function(params){
	this.setMoveFrequency(params[0]);
};
$d$.tbl[gc.ROUTE_WALK_ANIME_ON]=function(params){
	this.setWalkAnime(true);
};
$d$.tbl[gc.ROUTE_WALK_ANIME_OFF]=function(params){
	this.setWalkAnime(false);
};
$d$.tbl[gc.ROUTE_STEP_ANIME_ON]=function(params){
	this.setStepAnime(true);
};
$d$.tbl[gc.ROUTE_STEP_ANIME_OFF]=function(params){
	this.setStepAnime(false);
};
$d$.tbl[gc.ROUTE_DIR_FIX_ON]=function(params){
	this.setDirectionFix(true);
};
$d$.tbl[gc.ROUTE_DIR_FIX_OFF]=function(params){
	this.setDirectionFix(false);
};
$d$.tbl[gc.ROUTE_THROUGH_ON]=function(params){
	this.setThrough(true);
};
$d$.tbl[gc.ROUTE_THROUGH_OFF]=function(params){
	this.setThrough(false);
};
$d$.tbl[gc.ROUTE_TRANSPARENT_ON]=function(params){
	this.setTransparent(true);
};
$d$.tbl[gc.ROUTE_TRANSPARENT_OFF]=function(params){
	this.setTransparent(false);
};
$d$.tbl[gc.ROUTE_CHANGE_IMAGE]=function(params){
	this.setImage(params[0], params[1]);
};
$d$.tbl[gc.ROUTE_CHANGE_OPACITY]=function(params){
	this.setOpacity(params[0]);
};
$d$.tbl[gc.ROUTE_CHANGE_BLEND_MODE]=function(params){
	this.setBlendMode(params[0]);
};
$d$.tbl[gc.ROUTE_PLAY_SE]=function(params){
	AudioManager.playSe(params[0]);
};
$d$.tbl[gc.ROUTE_SCRIPT]=function f(params){
	//eval(params[0]);
	const p0=params[0];
	if(p0&&p0[0]===":"&&p0[1]==="!"){ // ===":!"
		let strs=JSON.parse(p0.slice(2));
		if(strs[0] in rpgevts){
			let curr=rpgevts,argv;
			for(let x=0;x!==strs.length;++x){ let next=strs[x];
				if(next&&next.constructor===Array){ argv=next; break; }
				else curr=curr[next];
			}
			curr(this,argv);
			return ;
		}else{ switch(strs[0]){
		default:{
			// usage: [ (ss,selfswitch,val) | (jmp,( (abs,xy)|(ref,Cxy)|(rlt,xy) )) ]
		}break;
		case "ani":{
			this.requestAnimation(strs[1]);
		}break;
		case "jmp":{ // jump
			switch(strs[1]){
			case "abs":{ // absolute
				let xy=strs[2];
				if(xy) this.jumpAbs(xy[0],xy[1]);
			}break;
			case "ref":{ // to other's relative location
				if(strs[2]){
					let ref=strs[2][0]==='p'?$gamePlayer:$gameMap._events[strs[2][0]];
					this.jumpAbs(strs[2][1]+ref.x,strs[2][2]+ref.y);
				}
			}break;
			case "rlt":{ // relative
				if(strs[2]) this.jump(strs[2][0],strs[2][1]);
			}break;
			}
		}break;
		case "ss":{
			if(this._eventId) this.ssStateSet(strs[1],!strs[2]);
		}break;
		} }
		return;
	}
	return objs._doFlow.call(this,p0);
};
$aaaa$.addEnum("ROUTE_PLAY_PITCH",$d$.tbl,function(params){
	AudioManager.playPitch_bgs(params[0]);
	//AudioManager.playBgs({name:"hz440",volume:200,pitch:Math.pow(2,params[0]/12)*100});
});
const er=gc.EMPTY_ROUTE={list:[{code:0},],repeat:false,skippable:false,wait:false,};
$pppp$.setEmptyMoveRoute=function(){ this.setMoveRoute(er); };
} //
$d$=$pppp$.playSheet=function f(arr){
	if(!arr||!arr.length) return;
	const list=[];
	{ const enum_wait=Game_Character.ROUTE_WAIT,enum_pitch=Game_Character.ROUTE_PLAY_PITCH;
	for(let x=0;x!==arr.length;++x){
		list.push({code:enum_pitch,indent:null,parameters:[arr[x]]});
		list.push(f.wait);
	} }
	list.push(f.fadeout);
	list.push(f.EMPTY);
	this._moveType=3;
	this.setMoveRoute({list:list,repeat:false,skippable:false,wait:false,});
};
$d$.EMPTY={code:0};
$d$.fadeout={code:Game_Character.ROUTE_PLAY_PITCH,indent:null,parameters:['']};//{code:Game_Character.ROUTE_SCRIPT,indent:null,parameters:['AudioManager.fadeOutBgs(0.5);']};
$d$.wait   ={code:Game_Character.ROUTE_WAIT      ,indent:null,parameters:[11]};
// - chr: move
$pppp$.searchLimit=function(){ // steps
	return _global_conf['default searchLimit']||14;
};
$pppp$.moveTowardCharacter=function(chr){
	let sx=this.deltaXFrom(chr.x);
	let sy=this.deltaYFrom(chr.y);
	if(Math.abs(sy)<Math.abs(sx)){
		this.moveStraight(sx<0?6:4);
		if(sy!==0&&!this.isMovementSucceeded()) this.moveStraight(sy<0?2:8);
	}else if(sy!==0){
		this.moveStraight(sy<0?2:8);
		if(sx!==0&&!this.isMovementSucceeded()) this.moveStraight(sx<0?6:4);
	}
};
$pppp$.moveToChr=$pppp$.moveTowardCharacter;
$pppp$.moveToChr_bfs=function(chr,mvRndIfNotFound){
	let dir=this.findDirectionTo(chr.x,chr.y);
	if(dir) this.moveDiagonally_d8(dir);
	else{
		if(mvRndIfNotFound) this.moveRandom();
		else this.moveToChr(chr);
	}
};
$d$=$pppp$.moveToChrs_bfs=function f(chrs,fullSearch,mvRndIfNotFound){
	let dir=this.findDirTo(chrs.map(f.map),undefined,{fullSearch:fullSearch});
	if(dir) this.moveDiagonally_d8(dir);
	else if(chrs.length){
		if(mvRndIfNotFound) this.moveRandom();
		else this.moveToChr(chrs[~~(Math.random()*chrs.length)]);
	}
};
$d$.map=chr=>[chr.x,chr.y];
if(0)$d$.map=chrs=>{
	let rtv=[];
	for(let x=0;x!==chrs.length;++x){
		let chr=chrs[x];
		if(chr.x>=0&&chr.y>=0) rtv.push([chr.x,chr.y]);
	}
	return rtv;
};
$d$=$pppp$.moveAwayChr_bfs=function f(chr,fullSearch){
	let list=[],disables=[];
	disables.push([$gameMap.roundX(chr.x+1),$gameMap.roundY(chr.y+1)]);
	disables.push([$gameMap.roundX(chr.x+1),$gameMap.roundY(chr.y-1)]);
	disables.push([$gameMap.roundX(chr.x-1),$gameMap.roundY(chr.y+1)]);
	disables.push([$gameMap.roundX(chr.x-1),$gameMap.roundY(chr.y-1)]);
	if(chr.canDiag){
		for(let i=0,
			xb=$gameMap.roundX(chr.x-5),xh=$gameMap.roundX(chr.x+5),
			yb=$gameMap.roundY(chr.y-5),yh=$gameMap.roundY(chr.y+5)
		;i!==11;++i){
			let x=$gameMap.roundX(xb+i),y=$gameMap.roundY(yb+i);
			if($gameMap.isValid(x,yb)) list.push([x,yb]);
			if($gameMap.isValid(xb,y)) list.push([xb,y]);
			if($gameMap.isValid(x,yh)) list.push([x,yh]);
			if($gameMap.isValid(xh,y)) list.push([xh,y]);
		}
	}else{
		for(let i=0,xb=$gameMap.roundX(chr.x-5),xh=$gameMap.roundY(chr.x+5) ; i!==6 ; ++i){
			let x,y;
			x=$gameMap.roundX(xb+i); y=$gameMap.roundY(chr.y-i); if($gameMap.isValid(x,y)) list.push([x,y]);
			x=$gameMap.roundX(xb+i); y=$gameMap.roundY(chr.y+i); if($gameMap.isValid(x,y)) list.push([x,y]);
			x=$gameMap.roundX(xh-i); y=$gameMap.roundY(chr.y-i); if($gameMap.isValid(x,y)) list.push([x,y]);
			x=$gameMap.roundX(xh-i); y=$gameMap.roundY(chr.y+i); if($gameMap.isValid(x,y)) list.push([x,y]);
		}
	}
	let dir=this.findDirTo(list,disables,{fullSearch:fullSearch});
	if(dir) this.moveDiagonally_d8(dir);
	else if(chr) this.moveAwayFromCharacter(chr);
};
$d$.map=$pppp$.moveToChrs_bfs;
$pppp$.moveAwayFromCharacter=function(chr){
	let sx=this.deltaXFrom(chr.x);
	let sy=this.deltaYFrom(chr.y);
	if(Math.abs(sy)<Math.abs(sx)){
		this.moveStraight(0<sx?6:4);
		if(sy!==0&&!this.isMovementSucceeded()) this.moveStraight(0<sy?2:8);
	}else if(sy!==0){
		this.moveStraight(0<sy?2:8);
		if(sx!==0&&!this.isMovementSucceeded()) this.moveStraight(0<sx?6:4);
	}
};
$pppp$.turnTowardCharacter=function(chr){
	let sx=this.deltaXFrom(chr.x);
	let sy=this.deltaYFrom(chr.y);
	if(Math.abs(sy)<Math.abs(sx)) this.setDirection(sx<0?6:4);
	else if(sy!==0) this.setDirection(sy<0?2:8);
};
$pppp$.turnAwayFromCharacter=function(chr){
	let sx=this.deltaXFrom(chr.x);
	let sy=this.deltaYFrom(chr.y);
	if(Math.abs(sy)<Math.abs(sx)) this.setDirection(0<sx?6:4);
	else if(sy!==0) this.setDirection(0<sy?2:8);
};
$d$=$pppp$.findDirTo=function f(goals,disables,kargs){
	// goals = [ [x,y,costAdd] , ... ]
	// kargs:
	// 	tileOnly: check pass only on tiles = '$gameMap.isPassable', not 'chr.canPass'
	//debug.log('Game_Character.prototype.findDirTo');
	if(f.inited===undefined){
		f.inited=1;
		f.chooseX=(self,c_and_deltaX,costs,newIdx,mapWidth,test_passable=0)=>{
			// rtv{} , arr , const , const
			// &&+x
			let newx=$gameMap.roundXWithDirection(self._x,6);
			//console.log(1,goalx,goaly,newx,newx<mapWidth,costs[newIdx-self._x+newx]); // debug
			if((!test_passable||self.canPass(self._x,self._y,6)) && newx<mapWidth && (newc=costs[newIdx-self._x+newx])<c_and_deltaX.c){
				c_and_deltaX.c=newc;
				c_and_deltaX.d=1;
			}
			// &&-x
			newx=$gameMap.roundXWithDirection(self._x,4);
			//console.log(2,goalx,goaly,newx,newx>=0,costs[newIdx-self._x+newx]); // debug
			if((!test_passable||self.canPass(self._x,self._y,4)) && newx>=0 && (newc=costs[newIdx-self._x+newx])<c_and_deltaX.c){
				c_and_deltaX.c=newc;
				c_and_deltaX.d=-1;
			}
		};
	}
	if(!goals||goals.length===0) return 0;
	let mapWidth = $gameMap.width();
	let mapHeight = $gameMap.height();
	let cd=!!this.canDiag; // boolean
	let strtIdx=this._y*mapWidth+this._x;
	disables=disables?new Set(disables.map(p=>p.y*mapWidth+p.x)):new Set();
	kargs=kargs||{};
	const tileOnly=kargs.tileOnly;
	
	// reversed search: goal -> start
	// - bfs: mark costs
	let cacheKey=JSON.stringify({goals:goals,disables:disables})+(tileOnly?"-tileOnly":"");
	let cache=$gameTemp.clearedWhenNewMap.bfsCache.get(cacheKey);
	let costs,queue;
	if(cache&&( tileOnly?(cache.rs===DataManager.resetSerial):(cache.fc===Graphics.frameCount) )){ // suppose not much different
		costs=cache;
		queue=cache.Q;
	}else{
		cache=undefined; // later use 'cache===undefined' to determine wheather to set new cache
		costs=[]; costs.length=mapWidth*mapHeight; for(let x=0;x!==costs.length;++x) costs[x]=costs.length;
		queue=new Queue();
		
		// - init cost near goals
		for(let gid=0;gid!==goals.length;++gid){
			let goal=goals[gid];
			let goalx=goal[0],goaly=goal[1];
			if($gameMap.isValid(goalx,goaly)&&!disables.has(goaly*mapWidth+goalx))
				queue.push({x:goalx,y:goaly,c:(goal[2]^0)+(0^0)});
		}
		// - - surroundings, prevent from 'clicking on events causes no effect'
		for(let gid=0;gid!==goals.length;++gid){
			let goal=goals[gid];
			let goalx=goal[0],goaly=goal[1];
			for(let dir=10;dir-=2;){
				let newx=$gameMap.roundXWithDirection(goalx,dir);
				let newy=$gameMap.roundYWithDirection(goaly,dir);
				if($gameMap.isValid(newx,newy)&&!disables.has(newy*mapWidth+newx))
					queue.push({x:newx,y:newy,c:(goal[2]^0)+(1^0)});
			}
		}
	}
	
	// - strt / resume : log frameCount or resetSerial (tileOnly)
	if(costs[strtIdx]===costs.length){ if(tileOnly) costs.rs=DataManager.resetSerial; else costs.fc=Graphics.frameCount; while(queue.length){
		let curr=queue.front; queue.pop();
		let currIdx=curr.y*mapWidth+curr.x;
		if(curr.c>=costs[currIdx]||disables.has(currIdx)) continue;
		costs[currIdx]=curr.c;	//console.log(curr); // debug
		for(let dir=10;dir-=2;){
			let newx=$gameMap.roundXWithDirection(curr.x,dir);
			let newy=$gameMap.roundYWithDirection(curr.y,dir);
			if( !$gameMap.isValid(newx,newy) || // (newx<0 || newx>=mapWidth || newy<0 || newy>=mapHeight) ||
				!(tileOnly?$gameMap.isPassable(newx,newy,10-dir):this.canPass(newx,newy,10-dir)) ) // reversed search
				continue;
			let newNode={x:newx,y:newy,c:curr.c+1};
			if(newNode.c<costs[newy*mapWidth+newx]) queue.push(newNode);
		}
		if(currIdx===strtIdx&&!kargs.fullSearch) break;
	} }
	
	// costs is not from cache, add: costs , time slot (@bfs_strt) , remained queue
	if(!cache){ 
		costs.Q=queue;
		$gameTemp.clearedWhenNewMap.bfsCache.set(cacheKey,costs);
	}
	
	// tell direction
	let c_and_dir={c:costs[strtIdx],dir:0},newc=0;
	// value of dir : direction on numpad
	// +-x
	{
		let c_and_deltaX={c:costs[strtIdx],d:0};
		f.chooseX(this,c_and_deltaX,costs,strtIdx,mapWidth,costs[strtIdx]>1); c_and_deltaX.d+=5;
		if( (costs[strtIdx]===1||this.canPass(this._x,this._y,c_and_deltaX.d)) && c_and_deltaX.c<c_and_dir.c ){
			c_and_dir.c=c_and_deltaX.c;
			c_and_dir.dir=c_and_deltaX.d;
		}
	}
	// +y
	let newy=$gameMap.roundYWithDirection(this._y,2);
	if(newy<mapHeight){
		let newIdx=strtIdx+(newy-this._y)*mapWidth;
		if( (costs[strtIdx]===1||this.canPass(this._x,this._y,2)) && (newc=costs[newIdx])<c_and_dir.c){
			c_and_dir.c=newc;
			c_and_dir.dir=2;
		}
		if(cd){
			let c_and_deltaX={c:costs[strtIdx],d:0};
			f.chooseX(this,c_and_deltaX,costs,newIdx,mapWidth);
			let newDir=c_and_deltaX.d+2;
			if(c_and_deltaX.c<c_and_dir.c && this.canPassDiagNumpad(this._x,this._y,newDir)){
				c_and_dir.c=c_and_deltaX.c;
				c_and_dir.dir=newDir;
			}
		}
	}
	// -y
	newy=$gameMap.roundYWithDirection(this._y,8);
	if(newy>=0){
		let newIdx=strtIdx+(newy-this._y)*mapWidth;
		if( (costs[strtIdx]===1||this.canPass(this._x,this._y,8)) && (newc=costs[newIdx])<c_and_dir.c){
			c_and_dir.c=newc;
			c_and_dir.dir=8;
		}
		if(cd){
			let c_and_deltaX={c:costs[strtIdx],dir:0};
			f.chooseX(this,c_and_deltaX,costs,newIdx,mapWidth);
			let newDir=c_and_deltaX.d+8;
			if(c_and_deltaX.c<c_and_dir.c && this.canPassDiagNumpad(this._x,this._y,newDir)){
				c_and_dir.c=c_and_deltaX.c;
				c_and_dir.dir=newDir;
			}
		}
	}
	return c_and_dir.dir;
	
};
$d$.forEach=function f(v,k,m){ let a=f.c[v[2]]; v.pop(); if(a) a.push(v); };
$pppp$.findDirectionTo_simple=function(goalx,goaly,preferdx,preferdy){
	// moveDiagonally.dirbit
	let pdx2=preferdx*preferdx;
	let pdy2=preferdy*preferdy;
	let dx=goalx-this.x;
	let dy=goaly-this.y;
	let dirx=((dx>=0)<<(dx!==0))-1;
	let diry=((dy>=0)<<(dy!==0))-1;
	let rtv=5;
	if(dirx===0||diry===0){
		rtv+=diry*-3+dirx;
		return rtv===5?0:rtv;
	}
	if(this.canDiag){
		rtv+=diry*-3+dirx;
		if(this.canPassDiagNumpad(this.x,this.y,rtv)) return rtv;
	}
	if(pdx2<pdy2){
		rtv=diry*-3+5;
		if(this.canPass(this.x,this.y,rtv)) return rtv;
		else{
			let rtv=dirx+5;
			if(this.canPass(this.x,this.y,rtv)) return rtv;
		}
	}else{
		rtv=dirx+5;
		if(this.canPass(this.x,this.y,rtv)) return rtv;
		else{
			let rtv=diry*-3+5;
			if(this.canPass(this.x,this.y,rtv)) return rtv;
		}
	}
	return rtv===5?0:rtv;
};
$k$='findDirectionTo';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(goalx,goaly){
	//debug.log('Game_Character.prototype.findDirectionTo');
	//a; // debug - cracking
		// when called by $gamePlayer
			// Game_Player.prototype.update
				// Game_Player.prototype.moveByInput
	return this.findDirTo([[goalx,goaly]]);
}; $d$.ori=$r$;
//$k$='isCollidedWithCharacters';
//$r$=$pppp$[$k$];
//$d$=$pppp$[$k$]=function(){ // overwrite
//}; $d$.ori=$r$;
$pppp$.mvRefChr=function(chr){ this._x=chr._x; this._y=chr._y; };
$pppp$.mvAbs=function(x,y){ this._x=x; this._y=y; };
$pppp$.mvDiff=function(dx,dy){ this._x+=dx; this._y+=dy; };
$pppp$.moveRandom = function() {
	const d=((Math.random()*4)<<1)+2;
	if(this.canPass(this.x,this.y,d)) this.moveStraight(d);
};
// - chr: sprite
$pppp$.setSprite=function(sp){
	if(!this._tmp) this._tmp=[]; // ver-diff exception
	return this._tmp._sprite=sp;
};
$pppp$.getSprite=function(){
	if(this._tmp._sprite) return this._tmp._sprite;
	let rtv=$gameTemp.getSprite(this);
	if(rtv) return rtv;
if(!objs.test_tilemap){
	let k=this._tilemapKey;
	if(!k) return;
	let tm=SceneManager.getTilemap();
	if(!tm) return;
	let rtv=tm.children.find(k);
	return rtv&&rtv.data;
}
};
$pppp$.getText=none;
$pppp$=$aaaa$=undef;

// - msg
$aaaa$=Game_Message;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.clear;
$d$=$pppp$.clear=function f(){
	f.ori.call(this);
	this._txt2=[];
	this._evtName=undef;
	this._nameField=undef;
	this._lastMsgType=undef;
	this._lastFinish=undef;
	this._lastGain=undef;
}; $d$.ori=$r$;
$pppp$.setFaceImage = function(faceName, faceIndex, faceColor) {
	this._faceName = faceName;
	this._faceIndex = faceIndex;
};
$r$=$pppp$.isBusy;
$d$=$pppp$.isBusy=function f(){
	return this._windowCnt||f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.add=function(txt,toTxt2){
	(toTxt2?this._txt2:this._texts).push(txt);
};
$pppp$.add_finishQuest=function f(qname){
	if(f.prefix===undefined) f.prefix="\\RGB["+$dataCustom.textcolor.finish+"]完成 \\RGB["+$dataCustom.textcolor.quest+"]"; // must be set in runtime due to '$dataCustom'
	let txt=f.prefix+qname;
	if(this._lastMsgType==="qc"&&qname!==undefined && qname!==null&&qname===this._lastFinish){
		++this._lastFinish_cnt;
		this._texts.pop();
		txt+="\\RGB["+$dataCustom.textcolor.default+"] * "+this._lastFinish_cnt;
	}else{
		this._lastFinish=qname;
		this._lastFinish_cnt=1^0;
	}
	this._lastMsgType="qc";
	return this.add(txt);
};
$pppp$.add_gainItem=function f(txt,cnt,dataitem){
	cnt|=0;
	const arr=$gameTemp._otherGainMsg?this._txt2:this._texts;
	if(this._lastGain_toTxt2===$gameTemp._otherGainMsg && this._lastMsgType==="gi" && 0<this._lastGain_cnt*cnt && dataitem && this._lastGain===dataitem){
		this._lastGain_cnt+=cnt;
		arr.splice(this._lastIdx,1); //pop();
	}else{
		this._lastGain=dataitem;
		this._lastGain_cnt=cnt;
		this._lastGain_toTxt2=$gameTemp._otherGainMsg;
	}
	txt+=Math.abs(this._lastGain_cnt);
	this._lastMsgType="gi";
	this._lastIdx=arr.length;
	return this.add(txt,this._lastGain_toTxt2);
};
$pppp$.addWindow=function(w){
	this._windowCnt^=0; ++this._windowCnt;
	w.setHandler('cancel',()=>{ --this._windowCnt; w.destructor(); if(w.parent) w.parent.removeChild(w); });
	SceneManager._scene.addWindow(w);
};
$d$=$pppp$.addGameoverMsg=(txt,kargs)=>{
	if(!$dataMap.gameoverMsgs) $dataMap.gameoverMsgs=[];
	kargs=kargs||{};
	if(!kargs.align) kargs.align='center';
	$dataMap.gameoverMsgs.push([txt,kargs]);
}; $d$.clear=()=>{if(!$dataMap.gameoverMsgs) $dataMap.gameoverMsgs=[];$dataMap.gameoverMsgs.length=0;};
$pppp$.popup=function(txt,top,kargs){
	//debug.log('Game_Message.prototype.popup');
	let wl=SceneManager._scene._windowLayer;
	if(!wl) return;
	if(top){
		if(!wl._popupLayerTop) wl.addChild(wl._popupLayerTop=new Window_CustomPopups({alignV:'top'}));
		wl._popupLayerTop.add(txt,undefined,{t_remained:kargs&&kargs['t_remained']||2000,align:kargs&&kargs.align,});
	}else{
		if(!wl._popupLayer) wl.addChildAt(wl._popupLayer=new Window_CustomPopups(),0);
		wl._popupLayer.add(txt,undefined,{t_remained:kargs&&kargs['t_remained']||2000,align:kargs&&kargs.align,});
	}
};
$pppp$._isBusy_cache=function(){
	if(this._isBusy_n) --this._isBusy_n;
	else this.isBusy=this.constructor.prototype.isBusy;
	return this._isBusy;
};
$pppp$.isBusy_saved=function(useMoreNTimes){
	let rtv=this._isBusy=this.isBusy();
	this._isBusy_n=useMoreNTimes^0;
	this.isBusy=this._isBusy_cache;
	return rtv;
};
$pppp$.setNameField=function(s){ this._nameField=s; };
$pppp$=$aaaa$=undef;

// - player
$aaaa$=Game_Player;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.getData;
$d$=$pppp$.getData=function f(){
	const actor=$gameParty.allMembers()[0];
	return actor?actor.getData():f.ori.call(this);
}; $d$.ori=$r$;
Object.defineProperties($aaaa$.prototype, {
	_moveSpeed:{ get: function(){return this._mvsp;},
		set: function(rhs){
			this._mvsp=rhs;
			if(this._followers) for(let tmp=this.realMoveSpeed(),arr=this._followers._data,x=arr.length;x--;) arr[x].setMoveSpeed(tmp);
			return rhs;
	}, configurable: false },
	_opacity:{ get: function(){return this._opct;},
		set: function(rhs){
			this._opct=rhs;
			if(this._followers) for(let tmp=this.opacity(),arr=this._followers._data,x=arr.length;x--;) arr[x].setOpacity(tmp);
			return rhs;
	}, configurable: false },
	_blendMode:{ get: function(){return this._bm;},
		set: function(rhs){
			this._bm=rhs;
			if(this._followers) for(let tmp=this.blendMode(),arr=this._followers._data,x=arr.length;x--;) arr[x].setBlendMode(tmp);
			return rhs;
	}, configurable: false },
	_walkAnime:{ get: function(){return this._wa;},
		set: function(rhs){
			this._wa=rhs;
			if(this._followers) for(let tmp=this.hasWalkAnime(),arr=this._followers._data,x=arr.length;x--;) arr[x].setWalkAnime(tmp);
			return rhs;
	}, configurable: false },
	_stepAnime:{ get: function(){return this._sa;},
		set: function(rhs){
			this._sa=rhs;
			if(this._followers) for(let tmp=this.hasStepAnime(),arr=this._followers._data,x=arr.length;x--;) arr[x].setStepAnime(tmp);
			return rhs;
	}, configurable: false },
	_directionFix:{ get: function(){return this._dirfx;},
		set: function(rhs){
			this._dirfx=rhs;
			if(this._followers) for(let tmp=this.isDirectionFixed(),arr=this._followers._data,x=arr.length;x--;) arr[x].setDirectionFix(tmp);
			return rhs;
	}, configurable: false },
	_transparent:{ get: function(){return this._trpt;},
		set: function(rhs){
			this._trpt=rhs;
			if(this._followers) for(let tmp=this.isTransparent(),arr=this._followers._data,x=arr.length;x--;) arr[x].setTransparent(tmp);
			return rhs;
	}, configurable: false },
	ItemListMaxCol: { get: function(){
			return Window_ItemList.prototype.maxCols();
		}, set: function(rhs){
			return this._ItemListMaxCol=rhs;
	}, configurable: false },
	name: { get: function(){
			return isNone(this._name)?this.savefilename:this._name;
		}, set: function(rhs){
			return this._name=rhs;
	}, configurable: false },
	dirs: { get: function(){
			return [[0,1],[-1,0],[1,0],[0,-1]];
	}, configurable: false },
	speedup: { get: function(){
			return this._sUp^0;
		}, set: function(rhs){ let n=Number(rhs); if(isNaN(n)) return rhs;
			if(this._sUp!==n){
				this._sUp=n;
				this._moveSpeed=this._moveSpeed; // set followers' speed
				$gameMessage.popup("切換至"+$dataItems[64].name.slice(0,-1)+n,1);
			}
			return n;
	}, configurable: false },
	z2:{
		get:function(){return isNone(this._z2)?3:this._z2;},
	},
	viewRadius:{
		get:function(){ return this._viewRadius; },
		set:function(rhs){
			this._viewRadius_buf=rhs+Game_Map.e;
			return this._viewRadius=rhs;
		},
	},
	viewRadius_buf:{
		get:function(){ return this._viewRadius_buf; },
		set:none,
	},
});
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this.maxSavefiles=DataManager.maxSavefiles();
	this._rndid=Date.now()+''+Math.random();
	if(this.canDiag===undefined) this.canDiag=true;
	this.viewRadius=Game_Map.e*3;
}; $d$.ori=$r$;
$k$='isTransparent';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	return f.ori.call(this) || $dataMap && $dataMap.meta.hidePlayer;
}; $d$.ori=$r$;
$pppp$.maxFollowers=function(){
	return _global_conf["default maxFollowers"]||4040;
};
$pppp$.refresh=function(){
	let actor=$gameParty.leader();
	let characterName=actor?actor.characterName():'';
	let characterIndex=actor?actor.characterIndex():0;
	this.setImage(characterName,characterIndex);
	this._followers.refresh();
};
$d$=$pppp$.moveByInput=function f(){
	if(!this.isMoving() && this.canMove()){
		let direction = this.getInputDirection();
		if(direction > 0){ // keyboard
			$gameTemp.clearDestination();
			this.executeMove(direction);
		}else if($gameTemp.isDestinationValid()){
			let x = $gameTemp.destinationX();
			let y = $gameTemp.destinationY();
			let dont=TouchInput.calDeltaToPlayer();
			direction = $gameSystem._usr._simpleTouchMove?this.findDirectionTo_simple(x,y,TouchInput._dx,TouchInput._dy):this.findDirectionTo(x, y);
			if(direction > 0){
				let wasCanPass=this.canPassDiagNumpad(this.x,this.y,direction);
				this.executeMove(direction);
				if(!wasCanPass){
					$gameTemp.clearDestination();
					this.checkEventTriggerThere(f.tbl);
				}
			}else if( TouchInput.x || TouchInput.y ){
				if(dont) return;
				let dx=TouchInput._dx , dy=TouchInput._dy ;
				let dx2=dx*dx,dy2=dy*dy; // unit:pixel
				if(dx2+dy2>=Game_Map.e*Game_Map.e<<2){ // 48*48*4
					if(dy2<dx2){
						if(dx!==0) this._direction=dx<0?6:4;
					}else{
						if(dy!==0) this._direction=dy<0?2:8;
					}
				}
			}
		}
		//if(direction > 0)this.executeMove(direction);
	}
};
$d$.tbl=[0];
$pppp$.getInputDirection = function() {
	return this.canDiag?Input.dir8:Input.dir4;
};
$pppp$.canMove=function(d){ // discard '$gameMap.isEventRunning()'
	if($gameMessage.isBusy()) return false;
	
	// meta.noStopMove
	{
		let itp=$gameMap._interpreter;
		if(itp.isRunning()){
			let evt=$dataMap.events[itp._eventId.toId()];
			if(evt&&!evt.meta.noStopMove) return false;
		}
	}
	if($dataMap.strtEvts.length-$dataMap.strtEvts_noStopMove.length) return false;
	//if($dataMap.strtEvts.length) return false;
	
	if(this.isMoveRouteForcing() || this.areFollowersGathering()){
		return false;
	}
	if(this._vehicleGettingOn || this._vehicleGettingOff){
		return false;
	}
	if(this.isInVehicle() && !this.vehicle().canMove()){
		return false;
	}
	return true;
};
$pppp$.executeMove=function(direction){ // redraw last and next standing tile
	let last_x=this.x,last_y=this.y;
	this.canDiag?this.moveDiagonally_d8(direction):this.moveStraight(direction);
	let sc=SceneManager._scene;
	if(sc.constructor===Scene_Map){
		if(Graphics.isWebGL()){
			let sx=$gameMap._displayX_tw/$gameMap.tileWidth(),sy=$gameMap._displayY_th/$gameMap.tileHeight();
			sc._spriteset._tilemap._paintAllTiles(sx^0,sy^0); // drawing flow: addRect , sent vertices to webgl => remove rect or totally re-draw
		}else{
			let sx=$gameMap._displayX_tw/$gameMap.tileWidth(),sy=$gameMap._displayY_th/$gameMap.tileHeight();
			let scx=$gamePlayer.scrolledX(),scy=$gamePlayer.scrolledY();
			let dx=$gameMap.roundX(this.x-last_x),dy=$gameMap.roundY(this.y-last_y);
			sc._spriteset._tilemap._paintTiles(sx,sy,scx+dx,scy+dy);
			sc._spriteset._tilemap._paintTiles(sx,sy,scx   ,scy   );
				// display top-left anchor + player offset of display
		}
	}
//		if(sc.constructor===Scene_Map){
//			let x1=Math.floor(this._realX),x2=Math.ceil(this._realX);
//			let y1=Math.floor(this._realY),y2=Math.ceil(this._realY);
//			x,y??sc._spriteset._tilemap._paintTiles($gameMap.roundX(x1),$gameMap.roundY(y1),0,0);
//			x,y??sc._spriteset._tilemap._paintTiles($gameMap.roundX(x2),$gameMap.roundY(y2),0,0);
//		}
	// -> this.update // this.updateNonmoving
};
$pppp$.updateDashing=function(){
	if(this.isMoving()) return;
	if(!this.isInVehicle() && !$gameMap.isDashDisabled()){
		this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
	}else this._dashing=false;
};
$pppp$.update = function(sceneActive) {
	let lastScrolledX_tw = this.scrolledX_tw();
	let lastScrolledY_th = this.scrolledY_th();
	this.updateDashing();
	let wasMoving = this.isMoving();
	if(sceneActive){
		this.moveByInput();
	}
	let wm2=this.isMoving(); // TODO: is it better move 'wasMoving' here?
	Game_Character.prototype.update.call(this); // real_xy ==> xy
	this.updateScroll_t(lastScrolledX_tw, lastScrolledY_th);
	this.updateVehicle();
	if(!this.isMoving()){
		this.updateNonmoving(wasMoving || wm2); // if only 'wasMoving', 1-step to goal cause touch-evt not triggered
		if(wm2){
			this._realX=this._x=$gameMap.roundX(this._x);
			this._realY=this._y=$gameMap.roundY(this._y);
		}
	}
	this._followers.update();
};
$pppp$.updateScroll_t=function(lastScrolledX_tw, lastScrolledY_th) {
	let x1=lastScrolledX_tw,y1=lastScrolledY_th;
	let x2=this.scrolledX_tw(),y2=this.scrolledY_th();
	let cx=this.centerX_tw(),cy=this.centerY_th();
	if (y2 > y1 && y2 > cy) {
		$gameMap.scrollDown_th(y2 - y1);
	}
	if (x2 < x1 && x2 < cx) {
		$gameMap.scrollLeft_tw(x1 - x2);
	}
	if (x2 > x1 && x2 > cx) {
		$gameMap.scrollRight_tw(x2 - x1);
	}
	if (y2 < y1 && y2 < cy) {
		$gameMap.scrollUp_th(y1 - y2);
	}
};
$pppp$.centerX_tw = function() {
	return Graphics.width- $gameMap.tileWidth () >>1;
};
$pppp$.centerY_th=function(){
	return Graphics.height-$gameMap.tileHeight() >>1;
};

$k$='gatherFollowers';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(viaJump=_global_conf["isGatherFollowersViaJump"]){
	return viaJump?this.jump():f.ori.call(this);
}; $d$.ori=$r$;
$k$='areFollowersGathering';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	return this.isJumping()||f.ori.call(this);
}; $d$.ori=$r$;
$k$='areFollowersGathered';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	return !this.isJumping()&&f.ori.call(this);
}; $d$.ori=$r$;
$k$='startMapEvent';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(x,y,trigger,normal){
	//debug.keydown('Game_Player.prototype.startMapEvent');
	// triggered when: move, pressOk @ Scene_Map
	return f.ori.call(this,x,y,trigger,normal);
}; $d$.ori=$r$;
$pppp$.isRangedBurnSwitched=function(){
	return (Input.isPressed('control') || $dataMap && $dataMap.triggerHere0touch) && ($gameParty.burnrange===404||$gameParty.leader().mp>=$gameParty.burnmpcost);
};
$pppp$.isRangedSlashSwitched=function(){
	return (Input.isPressed('control') || $dataMap && $dataMap.triggerHere0touch) && ($gameParty.slashrange===404||$gameParty.leader().hp>$gameParty.slashhpcost);
};
$pppp$.customEvtStrt=function(){
	debug.log('Game_Player.prototype.customEvtStrt');
	// return false if not triggered
	if(!(TouchInput.isTriggered()||Input.isPressed('ok'))){
		debug.log('','customEvtStrt not triggered');
		return false;
	}
	debug.log('','customEvtStrt triggered');
	let rtv=false;
	
	let left1=[[1,0],[0,1],[0,-1],[-1,0]];
	let forward1=this.dirs;
	let dir=(this._direction>>1)-1;
	let nextx=(forward1[dir][0]-left1[dir][0]);
	let nexty=(forward1[dir][1]-left1[dir][1]);
	let actor=$gameParty.leader();
	let tbl=$dataMap&&$dataMap.coordTbl,mp=$gameMap;
	let itrp=mp._interpreter,itrpEvtId=itrp._eventId,itrpList=itrp._list;
	
	let strtList=[];
	let burnList=[];
	let slashList=[];
	// rangedBurn
	if(this.isRangedBurnSwitched() && $gameParty.canburn && this._direction>=2 && tbl){
		//$gameSystem._usr._noGainMsg=true;
		let added=0;
		// author mode
		if($gameParty.burnrange===404){
			let rt=$gameMap.getRoot(); $gameParty.burnAuth=rt;
			for(let y=0,h=mp.height(),w=mp.width();y!==h;++y){ for(let x=0;x!==w;++x){
				for(let z=0,arr=tbl[mp.xy2idx(x,y)];z!==arr.length;++z){ let evt=arr.getnth(z); // .coordTbl
					if(evt && !evt._starting && evt.canBurned()){
						strtList.push([evt.dist2(this),evt]);
						evt.addStrtType('burn');
						++added;
					}
				}
			}}
			if(added) $gamePlayer.requestAnimation(32);
		}else if($gameParty.burnrange<31 && $gameParty.burnrange>=0){ // not overflow an int and is pos
			// normal modes
			let cnt=(1<<$gameParty.burnrange)|1;
			let mpCost=$gameParty.burnmpcost;
			let strtx=this.x+left1[dir][0]*(cnt>>1),endex=strtx+nextx*cnt;
			let strty=this.y+left1[dir][1]*(cnt>>1),endey=strty+nexty*cnt;
			if(cnt===1){ let fx=forward1[dir][0],fy=forward1[dir][1];
				strtx+=fx;
				endex+=fx;
				strty+=fy;
				endey+=fy;
			}
			if(actor.mp>=mpCost){ for(let y=strty;y!==endey;y+=nexty){ for(let x=strtx;x!==endex;x+=nextx){
				let currx=$gameMap.roundX(x);
				let curry=$gameMap.roundY(y);
				if(!$gameMap.isValid(currx,curry)) continue;
				for(let z=0,arr=tbl[$gameMap.xy2idx(currx,curry)];z!==arr.length;++z){ let evt=arr.getnth(z); // .coordTbl
					evt.refresh();
					if( evt && !evt._starting && !(itrpList && itrpEvtId===evt._eventId) && evt.canBurned() ){
						strtList.push([evt.dist2(this),evt]);
						evt.addStrtType('burn');
						++added;
					}
				}
			}}}
			if(added){
				$gamePlayer.requestAnimation(121+($gameParty.burnrange<4?$gameParty.burnrange:4));
				actor.gainMp(-mpCost); // after started. '$gameParty.isRangedBurnSwitched' judge if MP >= cost. if not, '$gameParty.isRangedBurnSwitched()' is false, leading event think it's not triggered by rangedBurn
				// notify 'burnAwarer'
				for(let x=0,arr=$dataMap.eventsByMeta.burnAwarer||[];x!==arr.length;++x) $gameMap._events[arr[x]].ssStateSet("B");
			}
		}
	}
	// rangedSlash
	if(this.isRangedSlashSwitched() && $gameParty.canslash && this._direction>=2 && tbl){
		//$gameSystem._usr._noGainMsg=true;
		let added=0;
		// author mode
		if($gameParty.slashrange===404){
			let rt=$gameMap.getRoot(); $gameParty.burnAuth=rt;
			for(let y=0,h=mp.height(),w=mp.width();y!==h;++y){ for(let x=0;x!==w;++x){
				for(let z=0,arr=tbl[mp.xy2idx(x,y)];z!==arr.length;++z){ let evt=arr.getnth(z); // .coordTbl
					if(evt && !evt._starting && evt.canSlashed()){
						strtList.push([evt.dist2(this),evt]);
						evt.addStrtType('slash');
						++added;
					}
				}
			}}
			if(added) $gamePlayer.requestAnimation(32);
		}else if($gameParty.slashrange<31 && $gameParty.slashrange>=0){ // not overflow an int and is pos
			// normal modes
			let cnt=(1<<$gameParty.slashrange)|1;
			let hpCost=$gameParty.slashhpcost;
			let strtx=this.x+left1[dir][0]*(cnt>>1),endex=strtx+nextx*cnt;
			let strty=this.y+left1[dir][1]*(cnt>>1),endey=strty+nexty*cnt;
			if(cnt===1){ let fx=forward1[dir][0],fy=forward1[dir][1];
				strtx+=fx;
				endex+=fx;
				strty+=fy;
				endey+=fy;
			}
			if(hpCost<actor.hp){ for(let y=strty;y!==endey;y+=nexty){ for(let x=strtx;x!==endex;x+=nextx){
				let currx=$gameMap.roundX(x);
				let curry=$gameMap.roundY(y);
				if(!$gameMap.isValid(currx,curry)) continue;
				for(let z=0,arr=tbl[$gameMap.xy2idx(currx,curry)];z!==arr.length;++z){ let evt=arr.getnth(z); // .coordTbl
					evt.refresh();
					if( evt && !evt._starting && !(itrpList && itrpEvtId===evt._eventId) && evt.canSlashed() ){
						strtList.push([evt.dist2(this),evt]);
						evt.addStrtType('slash');
						++added;
					}
				}
			}}}
			if(added){
				actor.gainHp(-hpCost);
				// notify 'burnAwarer'
				for(let x=0,arr=$dataMap.eventsByMeta.burnAwarer||[];x!==arr.length;++x) $gameMap._events[arr[x]].ssStateSet("B");
			}
		}
	}
	// plant
	if($gameParty.canplant && (Input.isTriggered("ok")||Input.isLongPressed("ok")) ){
		rtv=$gameTemp._pl_customEvtStrt=true;
		const id=$gameParty.canplant;
		if($gameParty._items[id]){
			if($dataMap.templateStrt_tile){
				mp.cpevt($dataMap.templateStrt_tile+25,this.x,this.y,1,1,1,["B"]);
				$gameParty.gainItem_q($dataItems[id],-1);
			}else $gameMessage.popup("這張地圖不能種樹");
		}else{
			$gameMessage.popup("種子用光了，關閉種樹功能");
			$gameParty.canplant=$gameParty.canplant; // 關閉種樹功能
		}
	}
	// other customEvts...
	//   ...
	if(strtList.length){
		rtv=$gameTemp._pl_customEvtStrt=true;
		let h=new Heap((b,a)=>a[0]-b[0],strtList);
		while(h.length){
			let evt=h.top[1];
			if(evt.parentId){
				let strt=evt.strt; delete evt.strt;
				evt=$gameMap._events[evt.parentId];
				evt.strt=strt;
			}
			if(!evt._starting){
				evt.addStrtType('isFromPlayerCustom');
				evt.strt.partyBurnLvOutput=$gameParty.burnLvOutput();
				evt.start(true,evt.strt);
			}
			h.pop();
		}
	}
	// finally no triggered
	return rtv;
};
$d$=$pppp$.updateNonmoving=function f(wasMoving) {
	const noEvtRun=!$gameMap.isEventRunning();
		if(wasMoving){
			if(noEvtRun) $gameParty.onPlayerWalk();
			this.checkEventTriggerHere(f.tbl);
			if($gameMap.setupStartingEvent()) return;
		}
	if(noEvtRun){
		if(this.triggerAction()) return;
		if(wasMoving) this.updateEncounterCount();
		else $gameTemp.clearDestination();
	}else{ // not sure
		if(this.triggerAction()) return;
	}
};
$d$.tbl=[1,2];
$k$='triggerAction';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	//debug.log('Game_Player.prototype.triggerAction'); // this is polling
	let rtv=$gameTemp._pl_customEvtStrt=false;
	// customEvtStrt
	// - do not use repeated: counts only last key
	if( !rtv && Input.isPressed('control') && Input.isPressed('ok') ) rtv=this.customEvtStrt(none);
	rtv=rtv||f.ori.call(this);
	$dataMap.lastPlayerDir=this._direction;
	$dataMap.triggerHere0touch=false;
	return rtv;
}; $d$.ori=$r$;
$k$='checkEventTriggerHere';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(triggers){ // discard so-long-call and '$gameMap._interpreter.isRunning()' check
	//debug.log('Game_Player.prototype.checkEventTriggerHere');
	// check and start
	//debug.log($gamePlayer.x,$gamePlayer.y);
	//debug.log(arguments[0]);
	if(($dataMap.triggerHere0touch=TouchInput.isTriggered()&&triggers[0]===0)&&this.customEvtStrt()) return;
	//return f.ori.call(this,arguments[0]);
	if(this.canStartLocalEvents()){ // not in airship
		$gameMap.eventsXy(this.x, this.y).forEach(function(event) {
			if (event.isTriggerIn(triggers) && !event.isNormalPriority()) {
				event.start();
			}
		});
	}
}; $d$.ori=$r$;
$k$='checkEventTriggerThere';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	debug.log('Game_Player.prototype.checkEventTriggerThere');
	debug.log($gamePlayer.x,$gamePlayer.y);
	debug.log(arguments[0]);
	// triggered when: {press 'ok'} or {click on tile and chr move near it}
	//   triggered before step on the location when using click
	//if(this.customEvtStrt(none)) return;
	if($dataMap.lastPlayerDir===this._direction) f.ori.call(this,arguments[0]);
}; $d$.ori=$r$;
//$pppp$.checkEventTriggerThere=$r$; // currently no needed
$k$='reserveTransfer';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	//debug.log('Game_Player.prototype.reserveTransfer');
	$gameMap.setZaWarudo(0); // clear waits
	f.ori.apply(this,arguments); // it just do preparation for new map
	//debug.log('',$gameMap&&$gameMap._mapId,this._newMapId);
	
	if($gameMap._mapId===0||this._newMapId===$gameMap._mapId) return;
	
	const mc=$gameParty.mch();
	// rand maze (current map, not new map)
	delete mc.randmaze;
	// dynamic evt
	$gameParty.saveDynamicEvents(1);
	// save 'meta.recordLoc' s
	$gameMap.save_recordLoc();
	
}; $d$.ori=$r$;
$pppp$.adjDecRate=function(what,rate,useMax){
	// what: HP,MP,TP
	let act="";
	switch(what){
		case 'hp': act+="gainHp"; break;
		case 'mp': act+="gainMp"; break;
		case 'tp': act+="gainTp"; break;
		default: break;
	}
	if(act==="") return;
	if(useMax) what='m'+what;
	for(let x=0,arr=$gameParty.allMembers();x!==arr.length;++x){
		let actor=arr[x];
		let v=actor[what]*rate,vi=~~v;
		actor[act](-vi-(v!==vi));
	}
	
};
$pppp$.addOnlineSaveId=function(id){
	if(this._onlineSaveIds===undefined){
		this._onlineSaveIds=[];
	}
	let data=[id,Date.now()];
	this._onlineSaveIds.push(data);
	
	let ids=localStorage.getItem('onlineSaveIds');
	if(ids===null){
		localStorage.setItem('onlineSaveIds','');
		ids='';
	}
	if(ids!=='') ids+=',';
	ids+=JSON.stringify(data);
};
$pppp$=$aaaa$=undef; // END player

// - party
$aaaa$=Game_Party; // member , item , gain , complete , others
$pppp$=$aaaa$.prototype;
$aaaa$.currMaxEnum=10; // preserve some
$aaaa$.addEnum=objs._addEnum;
$aaaa$.addEnum('ABILITY_MUST_ESCAPE');
Object.defineProperties($aaaa$.prototype, {
	_actors:{ get: function(){
			debug.warn("get actors");
			return this._acs;
		}, set: function(rhs){
			debug.warn("set actors");
			let tmp=$gameTemp; // for fast change data structure
			tmp._pt_battleMembers=tmp._pt_allMembers=false;
			tmp._pt_allMembers_idSet=new Set(this._acs=rhs);
			this.allMembers(); this.battleMembers();
			return rhs;
	}, configurable: false },
	burnLv: { get: function(){
			return this._bLv^0;
		}, set: function(rhs){
			let sc=SceneManager._scene,lv_o=this._bLv;
			this._bLv=rhs;
			if($dataMap){
				if($dataMap.burnlv_pannel) $dataMap.burnlv_pannel.redrawtxt();
				else if(!lv_o && sc && sc.constructor===Scene_Map && sc._pannel) sc._createPannels.burnLv(sc._pannel);
			}
			let tmp=localStorage.getItem("maxBurnLv")|0; if(tmp<rhs) localStorage.setItem("maxBurnLv",rhs);
			return rhs;
	}, configurable: false },
	burnrange: { get: function(){
			return this._bRng^0;
		}, set: function(rhs){ let n=Number(rhs); if(!(n>=0)) return rhs;
			if(this._bRng!==n){
				this._bRng=n;
				$gameMessage.popup("切換至"+$dataItems[70].name.slice(0,-1)+n,1);
				$gameMessage.popup("請注意每次觸發將消耗"+(n+1)+"倍MP="+this.burnmpcost,1,{t_remained:3e3});
			}
			return this._bRng;
	}, configurable: false },
	burnmpcost: { get: function(){
			return (!(this._items&&this._items[77]))*((this.burnrange^0)+1);
	}, configurable: false },
	_canburn: { get: function(){return this._canB;}, set: function(rhs){return this._canB=rhs;}, configurable: false },
	canburn: { get: function(){
			return this.canplant?undef:this._canB;
		}, set: function(rhs){
			if(this._canB===rhs){
				delete this._canB;
				$gameMessage.popup("切換成無法燃燒\\RGB["+$dataCustom.textcolor.keyword+"]可燃物\\RGB["+$dataCustom.textcolor.default+"]",1);
			}else{
				this._canB=rhs;
				$gameMessage.popup("使用\\RGB["+$dataCustom.textcolor.item+"]"+rhs+"\\RGB["+$dataCustom.textcolor.default+"]燃燒\\RGB["+$dataCustom.textcolor.keyword+"]可燃物\\RGB["+$dataCustom.textcolor.default+"]",1);
			}
			return this._canB;
	}, configurable: false },
	slashrange: { get: function(){
			return this._sRng^0;
		}, set: function(rhs){ let n=Number(rhs); if(!(n>=0)) return rhs;
			if(this._sRng!==n){
				this._sRng=n;
				$gameMessage.popup("切換至"+$dataItems[80].name.slice(0,-1)+n,1);
				$gameMessage.popup("請注意每次觸發將消耗"+(n+1)+"倍HP="+this.slashhpcost,1,{t_remained:3e3});
			}
			return this._sRng;
	}, configurable: false },
	slashhpcost: { get: function(){
			return (!(this._items&&this._items[76]))*((this.slashrange^0)+1)*((this.canslash==="大斧")*9+1);
	}, configurable: false },
	_canslash: { get: function(){return this._canS;}, set: function(rhs){return this._canS=rhs;}, configurable: false },
	canslash: { get: function(){
			return this.canplant?undef:this._canS;
		}, set: function(rhs){
			if(this._canS===rhs){
				delete this._canS;
				$gameMessage.popup("切換成無法砍\\RGB["+$dataCustom.textcolor.keyword+"]可燃物\\RGB["+$dataCustom.textcolor.default+"]",1);
			}else{
				this._canS=rhs;
				$gameMessage.popup("使用\\RGB["+$dataCustom.textcolor.item+"]"+rhs+"\\RGB["+$dataCustom.textcolor.default+"]砍\\RGB["+$dataCustom.textcolor.keyword+"]可燃物\\RGB["+$dataCustom.textcolor.default+"]",1);
			}
			return this._canS;
	}, configurable: false },
	_canplant: { get: function(){return this._canP;}, set: function(rhs){return this._canP=rhs;}, configurable: false },
	canplant: { get: function(){
			return this._canP;
		}, set: function(rhs){
			if(this._canP===rhs){
				delete this._canP;
				$gameMessage.popup("切換成無法\\RGB["+$dataCustom.textcolor.keyword+"]種樹\\RGB["+$dataCustom.textcolor.default+"]",1);
			}else{
				this._canP=rhs;
				$gameMessage.popup("使用\\RGB["+$dataCustom.textcolor.item+"]"+$dataItems[rhs].name+"\\RGB["+$dataCustom.textcolor.default+"]種樹",1);
				let sc=SceneManager._scene;
				if(sc&&sc.constructor===Scene_Map) sc._createPannels.plant(sc._pannel); // will remove itself and re-contruct burn,slash if '$dataItems[$gameParty.canplant]' becomes undefined when updating
			}
			return this._canP;
	}, configurable: false },
	_dummy:{get:function(){return'';},configurable:false}
});
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	//debug.log('Game_Party.prototype.initialize');
	let rtv=f.ori.apply(this,arguments);
	this._extStores=[]; // [[],[{t:type,i:id,a:amount}],[],...]
	this._extStoreMaxs=[];
	this.mapChanges=[];
	this._achievement=[0];
	this._apps=0;
	{
		let cma=ConfigManager._apps;
		if(cma){
			let apps=this._apps={};
			for(let i in cma) apps[i]=cma[i];
		}
	}
	return rtv;
}; $d$.ori=$r$;
$pppp$._tbl_resetValues=function(d,needRefresh){
	// d: container ; needRefresh: refresh values for keys in cache
	
	let rtv=$gameTemp.getCache(this,d);
	if(!rtv){
		$gameTemp.updateCache(this,d,rtv=new Map());
		for(let i in d) rtv.set(Number(i),d[i]); // i is a string
	}else if(needRefresh){
		rtv.forEach((_,i)=>rtv.set(i,d[i])); // for efficiency. if error, use following
		/* /
		const arr=[];
		rtv.forEach((v,i)=>arr.push(i));
		for(let x=0;x!==arr.length;++x) rtv.set(i,d[i]);
		// */
	}
	return rtv;
};
$pppp$._tbl_i=function(){
	const rtv=this._tbl_resetValues(this._items,   $gameTemp._pt_needRefresh_items   );
	$gameTemp._pt_needRefresh_items=undefined;
	return rtv;
};
$pppp$._tbl_w=function(){
	const rtv=this._tbl_resetValues(this._weapons, $gameTemp._pt_needRefresh_weapons );
	$gameTemp._pt_needRefresh_weapons=undefined;
	return rtv;
};
$pppp$._tbl_a=function(){
	const rtv=this._tbl_resetValues(this._armors,  $gameTemp._pt_needRefresh_armors  );
	$gameTemp._pt_needRefresh_armors=undefined;
	return rtv;
};
$pppp$.initAllItems=function(){
	$gameTemp.delCache(this,this._items);
	$gameTemp.delCache(this,this._weapons);
	$gameTemp.delCache(this,this._armors);
	this._items = {};
	this._weapons = {};
	this._armors = {};
	{
		const p=Game_Party.prototype;
		$gameTemp.delCache(this,p.items.key);
		$gameTemp.delCache(this,p.weapons.key);
		$gameTemp.delCache(this,p.armors.key);
	}
	$gameTemp.updateCache(this,this._items,   new Map());
	$gameTemp.updateCache(this,this._weapons, new Map());
	$gameTemp.updateCache(this,this._armors,  new Map());
};
$pppp$.exists=function(){
    return this.allMembers().length !== 0;
};
$pppp$.battleMembers=function f(){
	if($gameActors._data.length===0) return []; // due to '$gameActors.actor' will create new if not exist
	if($gameTemp._pt_battleMembers) return $gameTemp._pt_battleMembers;
	let tmp=$gameTemp,mbm=this.maxBattleMembers();
	let rtv=tmp._pt_battleMembers=this.allMembers().filter((x,i)=>i<mbm&&x.isAppeared());
	tmp._pt_battleMembers_actor2idx=new Map(rtv.map((x,i)=>[x,i]));
	return rtv;
};
$d$=$pppp$.allMembers=function f() {
	if($gameActors._data.length===0) return []; // due to '$gameActors.actor' will create new if not exist
	if($gameTemp._pt_allMembers) return $gameTemp._pt_allMembers;
	return $gameTemp._pt_allMembers=this._acs.map(f.toDataActor);
};
$d$.toDataActor=id=>$gameActors.actor(id);
$pppp$.maxBattleMembers = function() {
	return _global_conf["default maxBattleMembers"]||4;
};
$pppp$.leader=function(){
	if(this._acs) return $gameActors.actor(this._acs[0]);
	this._acs=this._actors;
	return this.leader();
};
$pppp$.itemContainer=function(item){
	let rtv=null;
	switch(item&&item.itemType){
	case 'i':
		rtv=this._items;
	break;
	case 'w':
		rtv=this._weapons;
	break;
	case 'a':
		rtv=this._armors;
	break;
	}
	return rtv;
};
$pppp$.name=function(){
	const numBattleMembers = this.battleMembers().length;
	let rtv;
	if(numBattleMembers === 0) rtv=$dataCustom.battle.you;
	else{
		const lname=this.leader().name();
		if(isNone(lname)) rtv=$dataCustom.battle.you;
		else{
			if(numBattleMembers === 1) rtv=lname;
			else rtv=TextManager.partyName.format(lname);
		}
	}
	return rtv;
};
$pppp$.setupStartingMembers=function(){
	let tmp=[];
	$dataSystem.partyMembers.forEach(x=>objs.$gameActors.actor(x)&&tmp.push(x));
	this._actors=tmp;
	if(tmp.length) for(let x=1;x!==tmp.length;++x) objs.$gamePlayer._followers.addFollower(new Game_Follower(x));
};
$pppp$.targetActor=function(){
	return (objs.$gameTemp._pt_allMembers_idSet.has(this._targetActorId))?
		($gameActors.actor(this._targetActorId)):
		(this._acs.length?$gameActors.actor(this._acs[0]):undefined);
};
$pppp$.setTargetActor=function(actor){
	this._targetActorId = actor?actor.actorId():0;
};
$pppp$.addActors=function(actorId,count){
	if(count>0) while(count--) this.addActor(actorId,true);
};
$pppp$.addActor = function(actorId,bool_genNewIfRepeated) { // neednotice
	//debug.log('Game_Party.prototype.addActor');
	let tmp=$gameTemp,addedActor;
	if(tmp._pt_allMembers_idSet.has(actorId)){
		if(bool_genNewIfRepeated) addedActor=$gameActors.genClone(actorId);
		else return;
	}else addedActor=$gameActors.actor(actorId);
	if(!addedActor) return; // repeated maxout or not found
	let id=addedActor._actorId;
	this._acs.push(id);
	if(tmp._pt_battleMembers.length<this.maxBattleMembers()){
		tmp._pt_battleMembers_actor2idx.set(addedActor,tmp._pt_battleMembers.length);
		tmp._pt_battleMembers.push(addedActor);
	}
	tmp._pt_allMembers_idSet.add(id);
	let flridx=tmp._pt_allMembers.length-1;
	tmp._pt_allMembers.push(addedActor);
	let flrs=$gamePlayer._followers._data;
	if(flrs.length>=$gamePlayer.maxFollowers()) return addedActor;
	if(flridx>=0){
		let flr;
		if(flridx<flrs.length) flr=flrs[flridx];
		else{
			let ref=flrs.length?flrs.back:$gamePlayer;
			$gamePlayer._followers.addFollower(flr=new Game_Follower(flridx+1).locate(ref.x,ref.y));
		}
		let sc=SceneManager._scene;
		let sps=sc&&sc._spriteset;
		if(sc.constructor===Scene_Battle){
			let arr1=sps._battleField,arr2=sps._actorSprites;
			let tmp=new Sprite_Actor;
			arr1.addChild(tmp); arr2.push(tmp);
		}else{
			let tm=sps&&sps._tilemap;
			if(tm){
				let arr=sps._characterSprites;
				arr.push(new Sprite_Character(flr));
				tm.addChild(arr.back);
			}
		}
		$gamePlayer.refresh();
		$gameMap.requestRefresh();
	}
	return addedActor;
};
$pppp$.removeActor=function(actorId,_searchFrom){
	const tmp=$gameTemp;
	const idSet=tmp._pt_allMembers_idSet;
	if(idSet.has(actorId)){
		let idx=this._acs.indexOf(actorId,_searchFrom);
		
		idSet.delete(actorId);
		
		if(idx+1===this._acs.length) this._acs.pop();
		else this._acs.splice(idx, 1);
		
		let obj=tmp._pt_allMembers[idx];
		if(idx+1===tmp._pt_allMembers.length) tmp._pt_allMembers.pop();
		else tmp._pt_allMembers.splice(idx, 1);
		
		if(idx>=1){ for(let x=idx-1,arr=$gamePlayer._followers._data;x<arr.length;++x){
			arr[x].resetWalkAni();
			let sp=arr[x]._tmp._sprite;
			if(sp) sp.updateBitmap_forced();
		} }
		
		idx=tmp._pt_battleMembers_actor2idx?tmp._pt_battleMembers_actor2idx.get(obj):tmp._pt_battleMembers.indexOf(obj);
		if(idx>=0){
			if(idx+1===tmp._pt_battleMembers.length){
				tmp._pt_battleMembers.pop();
				if(tmp._pt_battleMembers_actor2idx) tmp._pt_battleMembers_actor2idx.delete(obj);
			}else{
				tmp._pt_battleMembers.splice(idx,1);
				if(tmp._pt_battleMembers_actor2idx) for(let x=idx,arr=tmp._pt_battleMembers;x!==arr.length;++x) tmp._pt_battleMembers_actor2idx.set(arr[x],x);
			}
			if(!tmp._pt_battleMembers_actor2idx) tmp._pt_battleMembers_actor2idx=new Map(tmp._pt_battleMembers.map((x,i)=>[x,i]));
		}
		
		const last=this.allMembers().length-1,flrs=$gamePlayer._followers;
		if(last>=0){
			if(SceneManager._scene._spriteset){
				const sp=flrs._data[last]._tmp._sprite;
				if(sp) sp.remove();
			}
			flrs.popFollower();
		}
		
		$gamePlayer.refresh();
		if(idx===0) $gamePlayer.imgModded=true;
		if(idx>=0) for(let x=idx;x<last;++x) flrs._data[x].imgModded=true;
		$gameMap.requestRefresh();
	}
};
$d$=$pppp$.onPlayerWalk=function f(){
	//const isStepsForTurn=$gameParty.steps() % Game_Actor.prototype.stepsForTurn();
	this.members().forEach(f.forEach);
};
$d$.forEach=actor=>actor.onPlayerWalk();
$pppp$.swapOrder=function(index1,index2){
	{
		let arr=this._acs;
		let temp = arr[index1]; arr[index1] = arr[index2]; arr[index2] = temp;
	}
	{
		let arr=$gameTemp._pt_allMembers;
		let temp = arr[index1]; arr[index1] = arr[index2]; arr[index2] = temp;
	}
	{
		let flwrs=$gamePlayer._followers._data;
		let flwr1=flwrs[index1-1]; if(flwr1) flwr1.resetWalkAni();
		let flwr2=flwrs[index2-1]; if(flwr2) flwr2.resetWalkAni();
	}
	$gameTemp._pt_battleMembers=false; this.battleMembers(); // when not everyone is able to fight even if they are in the front part of the party
	$gamePlayer.refresh();
	// clear battle plan // I'm lazy
	const btlPlan=SceneManager._scene&&SceneManager._scene._battlePlan;
	if(btlPlan) btlPlan.refresh_plans();
};
$pppp$.swapOrderByActor=function(actor1,actor2){
	{ const s=$gameTemp._pt_allMembers_idSet;
	if(!s.has(actor1.actorId())||!s.has(actor2.actorId())) return;
	}
	{ const arr=$gameTemp._pt_allMembers;
	this.swapOrder(arr.indexOf(actor1),arr.indexOf(actor2));
	}
};
$d$=$pppp$.charactersForSavefile=function f(){
	return this.battleMembers().slice(0,23).map(f.forEach);
};
$d$.forEach=actor=>{
	const ce=actor._getColorEdt();
	return [actor.characterName()+(ce?"?color="+ce:""),actor.characterIndex()];
};
$d$=$pppp$.facesForSavefile=function f(){
	return this.battleMembers().slice(0,23).map(f.forEach);
};
$d$.forEach=actor=>[actor.faceName(), actor.faceIndex()];
$pppp$.maxItems=function f(o){
	return o&&o.maxStack>=0?o.maxStack:(_global_conf["default maxItems"]||404);
};
$pppp$.hasMaxItems=function(o){
	return this.unionCnt(o) >= this.maxItems(o);
};
$pppp$.numItems=function(item,container){ // item in $dataItems / $dataWeapons / $dataArmors
	container=container||this.itemContainer(item);
	return (container && container[item.id])|0;
};
$pppp$.numItems_a=function(id){
	const rtv=this._armors[id]^0;
	return rtv;
};
$pppp$.numItems_i=function(id){
	const rtv=this._items[id]^0;
	return rtv;
};
$pppp$.numItems_w=function(id){
	const rtv=this._weapons[id]^0;
	return rtv;
};
$d$=$pppp$.unionCnt=function f(o){
	const u=f.key;
	if(o.meta && Object.hasOwnProperty.call(o.meta,u)){
		if(!Object.hasOwnProperty.call(o,u)) o[u]=JSON.parse(o.meta[u]);
		let cnt=0;
		for(let x=0,arr=o[u],c;x!==arr.length;++x){
			switch(arr[x][0]){
			default: c=undefined; break;
			case 'a': c=$dataArmors; break;
			case 'i': c=$dataItems; break;
			case 'w': c=$dataWeapons; break;
			}
			if(c) cnt+=this.numItems(c[arr[x][1]]);
		}
		return cnt;
	}else return this.numItems(o);
};
$d$.key='unionCnt';
$pppp$.arrangeMaxDayItems=function(){ // TODO(?)
	const tmp=[];
	for(let x=0,arr=$dataItems.maxDayItems,ptitem=$gameParty._items;x!==arr.length;++x){
		let id=arr[x];
		tmp[$dataItems[id].next]=ptitem[id]|0;
	}
	for(let x=0,arr=$dataItems.maxDayItems,ptitem=$gameParty._items,tbl=this._tbl_i();x!==arr.length;++x){
		let id=arr[x];
		if(tmp[id]) tbl.set(id,ptitem[id]=tmp[id]);
		else{
			delete ptitem[id];
			tbl.delete(id);
		}
	}
	$gameTemp.delCache($gameParty,Game_Party.prototype.items.key);
};
$pppp$.gainAllItems=function(cnt){
	cnt=~~cnt||1; if(0<cnt);else cnt=1;
	$dataWeapons.filter(x=>x&&x.name).map(x=>$gameParty.gainItem(x,cnt));
	$dataArmors.filter(x=>x&&x.name).map(x=>$gameParty.gainItem(x,cnt));
	$dataItems.filter(x=>x&&x.name).map(x=>$gameParty.gainItem(x,cnt));
};
$pppp$.__gainAllItems=$pppp$.gainAllItems;
$d$=$pppp$.items=function f(){
	let rtv;
	if( !(rtv=$gameTemp.getCache(this,f.key)) ){
		rtv=[];
		this._tbl_i().forEach((v,k)=>$dataItems[k]&&rtv.push($dataItems[k]));
		$gameTemp.updateCache(this,f.key,rtv);
	}
	return rtv.sort(DataManager.sortCmp);
}; $d$.ori=$r$;
$d$.key='item';
$d$=$pppp$.weapons=function f(includeEquip){
	let rtv;
	if( !(rtv=$gameTemp.getCache(this,f.key)) ){
		rtv=[];
		this._tbl_w().forEach((v,k)=>$dataWeapons[k]&&rtv.push($dataWeapons[k]));
		$gameTemp.updateCache(this,f.key,rtv);
	}
	if(includeEquip) rtv=Array.fastConcat(this.members().map(x=>x.weapons()).flat(),rtv);
	return rtv.sort(DataManager.sortCmp);
};
$d$.key='weapon';
$d$=$pppp$.armors=function f(includeEquip){
	let rtv;
	if( !(rtv=$gameTemp.getCache(this,f.key)) ){
		rtv=[];
		this._tbl_a().forEach((v,k)=>$dataArmors[k]&&rtv.push($dataArmors[k]));
		$gameTemp.updateCache(this,f.key,rtv);
	}
	if(includeEquip) rtv=Array.fastConcat(this.members().map(x=>x.armors()).flat(),rtv);
	return rtv.sort(DataManager.sortCmp);
}; $d$.ori=$r$;
$d$.key='armor';
$pppp$.menuActor = function() {
	let actor=$gameActors.actor(this._menuActorId);
	if(!this.members().contains(actor)) actor=this.members()[0];
	return actor;
};
$pppp$.makeMenuActorNext=function(){
	const members=this.members();
	let index = members.indexOf(this.menuActor());
	this.setMenuActor(members[index = this._menuActorIdx = index>=0 ? (index+1) % members.length : 0]);
	return index;
};
$pppp$.makeMenuActorPrevious = function() {
	const members=this.members();
	let index = members.indexOf(this.menuActor());
	this.setMenuActor(members[index = this._menuActorIdx = index>=0 ? (index+members.length-1) % members.length : 0]);
	return index;
};
$pppp$.LName=function(n){
	return $gameActors._data[$gameParty._acs[n||0]].name();
};
$pppp$.setFace=function(n){
	//debug.log('Game_Party.prototype.setFace');
	n=n||0;
	let chr=$gameActors.actor($gameParty._acs[n]);
	let ce=chr._getColorEdt();
	$gameMessage.setFaceImage(chr._faceName+(ce?"?color="+encodeURIComponent(ce):""),chr._faceIndex);
	$gameMessage._nameField=chr.name();
};
$pppp$.speak=function(txt,n,kargs){
	this.setFace(n);
	return $gameMessage.add(txt);
};
$pppp$.extStore_searchTbl_make=function(id){
	if(!$gameTemp._pt_extStores) $gameTemp._pt_extStores=[];
	if(!$gameTemp._pt_extStores[id]) $gameTemp._pt_extStores[id]={a:[],i:[],s:[],w:[],cnt:0};
	const tbl=$gameTemp._pt_extStores[id]; tbl.cnt=0;
	this.extStore_get(id).forEach(curr=>{
		if(tbl[curr.t]) tbl[curr.t][curr.i]=curr;
		tbl.cnt+=curr.a;
	});
	return tbl;
};
$pppp$.extStore_searchTbl_get=function(id){
	let tmp=$gameTemp._pt_extStores;
	return tmp&&tmp[id]||this.extStore_searchTbl_make(id);
};
$pppp$.extStore_get=function(id){
	if(!this._extStores) this._extStores=[];
	if(!this._extStores[id]) this._extStores[id]=[];
	return this._extStores[id];
};
$pppp$.extStore_getMax=function(id){
	if(!this._extStoreMaxs) this._extStoreMaxs=[];
	return this._extStoreMaxs[id];
};
$pppp$.extStore_setMax=function(id,val){
	if(!this._extStoreMaxs) this._extStoreMaxs=[];
	this._extStoreMaxs[id]=val;
	return this;
};
$pppp$.extStore_open=function(id,disables,title){
	$gameTemp.storeId=id;
	$gameTemp.disables=disables;
	$gameTemp.storeTitle=title||"";
	SceneManager.push(Scene_ExtStore);
	return this;
};
$pppp$.extStore_add1=function(storeId,dataitem){
	if(!dataitem) return;
	const tbls=this.extStore_searchTbl_get(storeId);
	if(tbls.cnt>=this.extStore_getMax(storeId)) return;
	const tbl=tbls[dataitem.itemType];
	if(!tbl) return;
	++tbls.cnt;
	const itemId=dataitem.id;
	if(tbl[itemId]) ++tbl[itemId].a;
	else{
		const arr=this.extStore_get(storeId);
		arr.push({t:dataitem.itemType,i:itemId,a:1});
		tbl[itemId]=arr.back;
	}
	return true;
};
$pppp$.extStore_rm1=function(storeId,dataitem){
	if(!dataitem) return;
	const itemId=dataitem.id;
	const tbls=this.extStore_searchTbl_get(storeId);
	--tbls.cnt;
	const tbl=tbls[dataitem.itemType];
	if(!tbl) return;
	if(tbl[itemId]){ if(--tbl[itemId].a===0){
		const arr=this.extStore_get(storeId);
		const idx=arr.indexOf(tbl[itemId]);
		if(idx!==-1) arr.splice(idx,1);
		tbl[itemId]=undefined;
	} return true; }
};
$pppp$.extStore_mvIn1=function(storeId,dataitem){
	const arr=this.itemContainer(dataitem);
	if(!arr||!(arr[dataitem.id]>0)) return;
	if(this.extStore_add1(storeId,dataitem)){
		$gameParty.gainItem_q(dataitem,-1);
		return true;
	}
};
$pppp$.extStore_mvOut1=function(storeId,dataitem){
	if(this.extStore_rm1(storeId,dataitem)){
		const arr=this.itemContainer(dataitem);
		$gameParty.gainItem_q(dataitem,1);
		return true;
	}
};
$pppp$.mch=function(mapid){
	let mchs=this.mapChanges;
	if(mapid===undefined) mapid=$gameMap._mapId;
	if(mchs[mapid]===undefined) mchs[mapid]={};
	return mchs[mapid];
};
$d$=$pppp$.changeMap=function f(type,data,mapid,noupdate){
	debug.log('$gameParty.prototype.changeMap');
	let target=this.mch(mapid);
	switch(type){
		default: break;
		case 'name': {
			if(!noupdate) target.name=data;
		}break;
		case 'randmaze':
		case 'tile': {
			$dataMap.dataCustomized=false;
			if(target[type]===undefined) target[type]={};
			let tdata=target[type];
			let idxset=new Set(),sz=$gameMap.size;
			for(let i in data){
				idxset.add(i%sz);
				if(data[i]===undefined) tdata[i]=null;
				else tdata[i]=data[i];
			}
			$gameMap.data();
			idxset.forEach(f.forEach);
		}break;
	}
};
$d$.forEach=v=>DataManager.resetData3d(v);
$pppp$.saveDynamicEvents=function(fromTransfer){
	let evts=$gameMap._events;
	let mc=this.mapChanges[$gameMap._mapId]; // should be inited to {} when map loaded if it is undef
	mc.events={};
	for(let x=0;x!==evts.length;++x){ let evt=evts[x];
		if(evt && evt._erased===false && evt._eventId.constructor!==Number)
			mc.events[evt._eventId]=evt;
	}
	// some events will not be saved
	{
		let delList=[];
		for(let i in mc.events){
			if(fromTransfer){ let evt=mc.events[i],evtd=evt.event();
				// not saving child events, remove child evt && SelfSwitches
				if(evt._sameStatEvts && 0<evt._sameStatEvts.length){
					for(let x=0,arr=evt._sameStatEvts;x!==arr.length;++x) delList.push(arr[x]);
					delete evt._sameStatEvts;
				}
				// remove must-regen-able from $gameParty.mch().events && SelfSwitches
				if(evtd&&(evtd.meta.regen||evtd.note==="regen")) delList.push(i);
			}
		}
		
		// do removal: evt && SelfSwitches
		for(let x=0,ss=$gameSelfSwitches._data[$gameMap._mapId];x!==delList.length;++x){ let evtid=delList[x];
			if(ss) for(let s=0,sss=$gameSelfSwitches.switches;s!==sss.length;++s) delete ss[([evtid,sss[s]])];
			delete mc.events[evtid];
		}
	}
	mc.events=deepcopy(mc.events); // remain only json data ; take advantage of: '[].attrs' will be discarded
	let arr=DataManager._delAttrs_dynamicEvt;
	for(let i in mc.events){ // remove un-used||unchanged attrs
		let evt=mc.events[i];
		for(let x=0;x!==arr.length;++x) delete evt[arr[x]];
	}
};
$pppp$.gainAchievement=function(id){
	id^=0;
	if(this._achievement===undefined) this._achievement=[0];
	if(id===0 || this._achievement[id]) return;
	this._achievement[id]=1;
	let ac=$dataCustom.achievement[id],color=$dataCustom.textcolor;
	if(ac===undefined||ac.constructor!==Array) return;
	if($dataSystem.gameTitle==="燒毀"){ this.burnLv^=0; ++this.burnLv; }
	if($gameMessage._texts.length) $gameMessage.add("\f"); // 0xC
	$gameMessage.add("獲得成就：\\RGB["+color.achievement+"]"+ac[0]+"\\RGB["+color.default+"]");
	if(ac[1]!==undefined) $gameMessage.add(ac[1]);
	if(ac[2]!==undefined) $gameMessage.add(ac[2]);
	let last=this._achievement_lastMaxId;
	if(last===undefined){
		$gameMessage.popup($dataCustom.gainApps.achievementMgr,1,{t_remained:5000});
		if(!this._apps) this._apps={};
		this._apps.achievement=1;
	}
	last^=0;
	if(last<id){
		for(let x=last+1^0;x!==id;++x) this._achievement[x]=0; // reduce save file size
		this._achievement_lastMaxId=id;
	}
};
$pppp$.gain_amountHead=function(amount,noSound){
	let rtv="",color=$dataCustom.textcolor;
	if(amount<0){ amount*=-1;
		if(!$gameSystem._usr._noGainSound && !noSound) SoundManager.playMiss();
		if(rtv===""&&$gameTemp.____byConsume) rtv+="\\RGB["+color.use+"]使用";
		if(rtv===""&&$gameTemp.____byChEqu) rtv+="\\RGB["+color.use+"]穿上";
		if(rtv==="") rtv+="\\RGB["+color.lose+"]失去";
		
	}else{
		if(!$gameSystem._usr._noGainSound && !noSound) SoundManager.playUseItem();
		if(rtv===""&&$gameTemp.____byChEqu) rtv+="\\RGB["+color.use+"]脫下";
		if(rtv==="") rtv+="\\RGB["+color.gain+"]獲得";
	}
	return rtv+" \\RGB["+color.default+"]";
};
$pppp$.gainGold=function f(amount,noSound){
	if(this._gold){
		let h=sha256(this._gold+'/'+this._hashn_gold),g=0;
		while(h.slice(-3)!=="000") h=sha256(g+++'/'+this._hashn_gold);
		if(g){
			--g;
			if(this._gold!==g) $gameParty.gainAchievement(8);
			this._gold=g;
		}
	}
	let prevg=this._gold;
	//f.ori.call(this,amount); //this._gold = (this._gold + amount).clamp(0, this.maxGold());
	this._gold+=amount;
	if(prevg!==this._gold){ for(let x=0;;++x){
		let h=sha256(this._gold+'/'+x);
		if(h.slice(-3)==="000"){
			this._hashn_gold=x;
			break;
		}
	} }
	let cnt=arguments[0]; if(!cnt) return;
	let head=this.gain_amountHead(cnt,noSound);
	let txt=head+Math.abs(cnt)+" \\G";
	if(!$gameSystem._usr._noGainMsg) $gameMessage.add(txt,$gameTemp._otherGainMsg);
	if(!$gameSystem._usr._noGainHint) $gameMessage.popup(txt,1);
	return txt;
};
$pppp$.maxGold=()=>99999999;
$k$='consumeItem';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(item,forced){
	debug.log('Game_Party.prototype.consumeItem');
	$gameTemp.gainMsgConfigs_push();
	$gameTemp.gainMsgConfigs_mute();
	$gameTemp.____byConsume=true;
	if(item && forced){
		if(DataManager.isItem(item)) this.loseItem(item, 1);
	}else if(DataManager.isItem(item) && item.consumable) this.loseItem(item, 1);
	$gameTemp.____byConsume=false;
	$gameTemp.gainMsgConfigs_pop();
}; $d$.ori=$r$;
$pppp$.hasItem=function(item,includeEquip){
	return this.numItems(item)>0 || (includeEquip && this.isAnyMemberEquipped(item)) || false;
};
$pppp$.isAnyMemberEquipped=function(item){
	return this.members().some(actor=>actor.isEquipped(item));
};
$pppp$.gainItem_q=function(item, amount, includeEquip, noSound){
	$gameTemp.gainMsgConfigs_push();
	$gameTemp.gainMsgConfigs_mute();
	const rtv=this.gainItem(item, amount, includeEquip, noSound);
	$gameTemp.gainMsgConfigs_pop();
	return rtv;
};
$pppp$._gainItem_container=function(item, amount, includeEquip, container, tbl){
	if(container){
		let tmp;
		let lastNumber = this.numItems(item,container);
		let newNumber = lastNumber + amount;
		tmp=this.maxItems(item);
		const finalNumber = container[item.id] = newNumber<0?0:(newNumber<tmp?newNumber:tmp);
		if(finalNumber > 0){
			if(tbl) tbl.set(item.id,finalNumber);
		}
		if(finalNumber === 0){
			delete container[item.id];
			if(tbl) tbl.delete(item.id);
		}
		if (includeEquip && newNumber < 0) {
			this.discardMembersEquip(item, -newNumber);
		}
		$gameMap.requestRefresh();
	}
};
$pppp$._gainItem_data=function(item, amount, includeEquip, noSound){
	const item_=(!item.maxDayRef && item.meta.maxDay)?item._arr[item.days.back]:item,p=Game_Party.prototype;
	let container,cacheKey,tbl;
	switch(item_.itemType){ // this.itemContainer(item);
	default: return;
	case 'i':
		container=this._items;
		cacheKey=p.items.key;
		tbl=this._tbl_i();
	break;
	case 'w':
		container=this._weapons;
		cacheKey=p.weapons.key;
		tbl=this._tbl_w();
	break;
	case 'a':
		container=this._armors;
		cacheKey=p.armors.key;
		tbl=this._tbl_a();
	break;
	}
	const pre=container[item_.id];
	this._gainItem_container(item_, amount, includeEquip, container, tbl);
	const nxt=container[item_.id];
	//if(pre===nxt) return;
	// edit cache
	if(cacheKey&&(!nxt)!==(!pre)){ // addNew or removeAll
		const cache=$gameTemp.getCache(this,cacheKey);
		if(cache){
			if(pre){ // pre!==0 -> removeAll
				const idx=cache.indexOf(item_);
				if(idx!==-1){
					const tmp=cache.pop();
					if(idx!==cache.length) cache[idx]=tmp;
				}
			}else{ // pre===0 -> addNew
				const idx=cache.indexOf(item_);
				if(idx===-1) cache.push(item_);
			}
		}
	}
	return true;
};
$pppp$._gainItem_msg=function(item, cnt, includeEquip, noSound){
	if(!cnt) return '';
	let head=this.gain_amountHead(cnt,noSound),color=$dataCustom.textcolor;
	if(item.meta){
		let meta=item.meta;
		if(meta.quest) head+="\\RGB["+color.quest+"]任務 \\RGB["+color.default+"]";
		else{
			let c=DataManager.class;
			let i=c(item); //debug.log(i);
			if(i!==-1) head+="\\RGB["+color[c.attr[i]]+"]"+c.text[i]+"\\RGB["+color.default+"] ";
		}
	}
	let txt=head+(arguments[0].name.replace(/\\/g,"\\\\"))+"\\RGB["+color.default+"] * ";
	//if(!$gameSystem._usr._noGainMsg) $gameMessage.add(txt+Math.abs(cnt));
	if(!$gameSystem._usr._noGainMsg&&!$gameTemp.____byChEqu) $gameMessage.add_gainItem(txt,cnt,item);
	if(!$gameSystem._usr._noGainHint) $gameMessage.popup(txt+Math.abs(cnt),1);
	if(0&&debug.isdebug()){
		let re=Window_Base.prototype.processEscapeCharacter.re.toString();
		re=new RegExp("(^|[^\\\\\])((\\\\\\\\)+|[^\\\\]+)*\\\\RGBA?("+re.slice(2,-1)+")","g");
			// \RGB[#000000] -> _RGB[#000000]
				// \\\\ in str -> \\ 
				// RegExp get \\ -> match \ 
				//   =>  \\\\ -> \ 
		if(!window['/tmp/']['debug']) window['/tmp/']['debug']="";
		//debug.log(window['/tmp/']['debug']+=txt.replace(re,"$1$2_$4")+"\n");
	}
	return txt;
};
$pppp$.gainItem=function(item, amount, includeEquip, noSound){
	//debug.log('Game_Party.prototype.gainItem');
	if(!item || !amount) return '';
	if(!this._gainItem_data(item, amount, includeEquip, noSound)) return '';
	return this._gainItem_msg(item, amount, includeEquip, noSound);
};
$pppp$.loseItemAll=function(item, includeEquip, noSound){
	return this.gainItem(item,-this.numItems(item));
};
$pppp$.upgradeItem=function f(itemFrom,itemTo, amount, includeEquip, noSound){
	let txt="升級道具：";
	if(!$gameSystem._usr._noGainMsg) $gameMessage.add(txt);
	if(!$gameSystem._usr._noGainHint) $gameMessage.popup(txt,1);
	this.gainItem(itemFrom,-amount,includeEquip, 1);
	this.gainItem(itemTo,amount,includeEquip, 1);
	txt="道具升級了。";
	if(!$gameSystem._usr._noGainMsg) $gameMessage.add(txt);
	if(!$gameSystem._usr._noGainHint) $gameMessage.popup(txt,1);
	if(!$gameSystem._usr._noGainSound&&!noSound) SoundManager.playUseItem();
};
$pppp$.gainApp=function(appName_or_argv){
	if(isNone(appName_or_argv)) return;
	const flag=appName_or_argv.constructor===Array;
	const appName=flag?appName_or_argv[0]:appName_or_argv;
	let mgr=appName+"Mgr";
	if(!$dataCustom.gainApps[mgr]) return;
	if(!$gameParty._apps) $gameParty._apps={};
	const apps=$gameParty._apps;
	if(flag){
		const s="_"+appName_or_argv.join('_');
		if(apps[s] || !$dataCustom.gainApps[s]) return;
		apps[s]=1;
		$gameMessage.popup($dataCustom.gainApps[s],true,{t_remained:6000});
	}
	if(apps[appName]) return;
	apps[appName]=1;
	let key="_"+appName; if(!$gameParty[key]) $gameParty[key]=[];
	$gameMessage.popup($dataCustom.gainApps[mgr],true,{t_remained:5000});
	return true;
};
$pppp$.quests=function(rankMin,rankMax,reserveNan){
	rankMin=rankMin===0?0:(rankMin||-inf);
	rankMax=rankMax===0?0:(rankMax|| inf);
	let list=rpgquests.list;
	return this.items().filter(x=>{ return x.meta.quest && list[x.meta.ref]
		&& ( (rankMin<=list[x.meta.ref].rank && list[x.meta.ref].rank<=rankMax)
		|| (reserveNan && isNaN(list[x.meta.ref].rank)) );
	});
};
$pppp$.questsNeeded=function(rank){
	return rank[2]-this.completedQuestsCnt(rank[0],rank[1]);
};
$pppp$.questRemainedCnt=function(itemId){
	let list=rpgquests.list;
	let lim=rpgquests.list[$dataItems[itemId].meta.ref].limit;
	if(isNaN(lim)) return inf;
	return lim-(this._completedQuests[itemId]^0)-(this._items[itemId]^0);
};
$pppp$.completedQuestsCnt=function(rankMin,rankMax,reserveNan){
	if(!this._completedQuests) this._completedQuests={};
	let obj=this._completedQuests,list=rpgquests.list,rtv=0;
	for(let i in obj){
		let rank=list[$dataItems[i].meta.ref].rank;
		rtv+=obj[i]*( (rankMin<=rank && rank<=rankMax) || (reserveNan && isNaN(rank))^0 );
	}
	return rtv;
};
$pppp$.completeQuest=function(itemId,q){
	let self=this;
	if(!this._completedQuests) this._completedQuests={};
	let item=$dataItems[itemId];
	q=q||item.meta.ref&&rpgquests.list[item.meta.ref];
	if(!q||!q.isSat(this._completedQuests[itemId])) return -1;
	
	let noGainMsg=$gameSystem._usr._noGainMsg; $gameSystem._usr._noGainMsg=1;
	let obj=this._completedQuests,canComplete=((self,item,q,obj)=>{
		if(isNaN(q.limit) || obj[item.id]<q.limit) return true;
		$gameMessage.add("\f\\RGB["+$dataCustom.textcolor.default+"]已達 \\RGB["+$dataCustom.textcolor.quest+"]"+item.name+"\\RGB["+$dataCustom.textcolor.default+"] 之最大可完成數，回收任務單");
		self.gainItem(item,-self.numItems(item),undef,1);
		return false;
	});
	obj[item.id]^=0;
	if(canComplete(this,item,q,obj)){
		++obj[item.id];
		SoundManager.playUseItem();
			q.finish();
			rpgquests.func.reward(q);
			$gameMessage.add_finishQuest(item.name);
		canComplete(this,item,q,obj);
	}
	$gameSystem._usr._noGainMsg=noGainMsg;
};
$d$=$pppp$.genQuestReportWindow=function f(rankMin,rankMax,reserveNan){
	let self=this;
	let list=rpgquests.list,func=rpgquests.func,w;
	let map=function(x){
		let q=list[x.meta.ref];
		return [x.name,"($gameParty._items["+x.id+"]||0)+' 張';;func;list",1,function(){
			if(!$gameParty._items[x.id]) return [["沒有任務單",";;func",0]];
			let giveupNext={
				init:(obj,key)=>{obj[key]='';},
				valid:(val)=>{if(val.match(/^[0-9]*$/)===null)return 0;val=Number(val)||0;if(val<0||val>$gameParty._items[x.id])return 0;return 1;},
				apply:Number,
				final:(obj,key)=>{ let tmp=$gameSystem._usr._noGainMsg; $gameSystem._usr._noGainMsg=1; $gameParty.gainItem($dataItems[x.id],-obj[key]); $gameSystem._usr._noGainMsg=tmp;
					obj[key]=''; if(!$gameParty._items[x.id]) w.processCancel();
				}
			};
			Object.defineProperty(giveupNext,'title',{get:()=>{return "要丟棄幾個? (0~"+$gameParty._items[x.id]+")";},configurable: false});
			return [
				[$dataCustom.questMgr_complete,";;func;call",((self._items[x.id])^0) && q.isSat(self._completedQuests&&self._completedQuests[x.id]),function(){
					if(self.completeQuest(x.id,q)<0){ SoundManager.playBuzzer(); this.parent.processCancel(1); return; }
					//let p=this.parent; p.processCancel.ori.call(p,1);
				}],
				[$dataCustom.questMgr_view,";;func;call",($gameParty._items[x.id])^0,function(){this.parent.addWindow({},func.showBoard(q,1));}],
				[$dataCustom.questMgr_giveup,"this;"+x.id+";text;要丟棄幾個? (0~"+$gameParty._items[x.id]+")",($gameParty._items[x.id])^0,giveupNext],
			];
		}];
	};
	let quests=this.quests(rankMin,rankMax,reserveNan).map(map);
	if(quests.length===0) quests.push([$dataCustom.questViewAvail_none,";;func",0]);
	w=new Window_CustomMenu_main(0,0,[
		[$dataCustom.questViewAvail,";doQuests;func",1,quests],
		[$dataCustom.questHadDone,";doneQuests;func;list",1,f.genDoneQList],
	]);
	return w;
	//SceneManager.addWindowB(w);
};
$d$.genDoneQList=function f(){
	let cq=$gameParty._completedQuests;
	let rtv=cq?Object.getOwnPropertyNames(cq).map(f.map):[];
	if(rtv.length===0) rtv.push([$dataCustom.questHadDone_none,";;func",0]);
	return rtv;
};
$d$.genDoneQList.map=function f(qid){
	let q=$dataItems[qid];
	let ref=q.meta.ref;
	return [q.name,";;func;call",!!ref,function(){
		this.parent.addWindow({},rpgquests.func.showBoard(rpgquests.list[ref],1));
	}];
};
$d$=undef;
$pppp$.openQuestReportWindow=function(rankMin,rankMax,reserveNan){
	return SceneManager.addWindowB(this.genQuestReportWindow(rankMin,rankMax,reserveNan));
};
$pppp$.logLoc_list=function(){
	let t=this._locLog;
	if(!t||t.constructor!==Array) t=this._locLog=[];
	return t;
};
$pppp$.logLoc_save=function(){
	let p=$gamePlayer,m=$gameMap;
	this.logLoc_list().push([m.name,m._mapId,p.x,p.y,p._direction]);
};
$pppp$.logLoc_load=function(id){
	let t=this.logLoc_list()[id];
	if(!t) return -1;
	$gamePlayer.reserveTransfer(t[1],t[2],t[3],t[4],1);
};
$pppp$.noteApp_list=function(){
	let t=this._noteApp;
	if(!t||t.constructor!==Array) t=this._noteApp=[];
	return t;
};
$pppp$.noteApp_save=function(fname,txt){
	this.noteApp_list().push([fname,txt]);
};
$pppp$.noteApp_load=function(id){
	let t=this.noteApp_list()[id];
	if(!t) return -1;
	return t;
};
$pppp$.noteApp_del=function(id){
	let list=this.noteApp_list();
	let t=list[id];
	if(!t) return -1;
	list.splice(id,1);
};
$pppp$.burnLvOutput=function(parents){
	parents=parents||$gameMap.parents();
	// 燃燒棒、木亥村莊專用燃燒棒
	if($gameParty._items[55] || ($gameParty._items[56]&&parents.indexOf(Number($dataItems[56].meta.map))!==-1)) return this.burnLv;
	return 0;
};
$pppp$.mustEscape=function(){
	return this.partyAbility(Game_Party.ABILITY_MUST_ESCAPE);
};
$pppp$=$aaaa$=undef;

// - follower
$aaaa$=Game_Follower;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.getData;
$d$=$pppp$.getData=function f(){
	const actor=this.actor();
	return actor?actor.getData():f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.getActor=function(){ return this.actor(); };
$pppp$.resetWalkAni=function(){
	this._stopCount=0;
	if(!this._tmp) this._tmp=[];
	this._tmp.wa=true; // walkAnime
	let id=objs.$gameParty._actors[this._memberIndex];
	if(id){
		let meta=$dataActors[id.toId()].meta;
		this._tmp.wa=!meta.noWalk;
	}
};
$pppp$.updateAppearance=function(){
	// not doing them in 'this.update'
	if(!$gamePlayer) return;
	this.setMoveSpeed($gamePlayer.realMoveSpeed()); 
	this.setOpacity($gamePlayer.opacity());
	this.setBlendMode($gamePlayer.blendMode());
	this.setWalkAnime($gamePlayer.hasWalkAnime());
	this.setStepAnime($gamePlayer.hasStepAnime());
	this.setDirectionFix($gamePlayer.isDirectionFixed());
	// this.setTransparent(_objs.$gamePlayer.isTransparent()); // not really needed
};
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(idx){
	f.ori.call(this,idx);
	//if(!this._tmp) this._tmp=[]; // Game_Character
	// special settings:
	//this.resetWalkAni();
	//this.updateAppearance(); // done @setFollowers
	this._dir2=0; // propergate dir when dirfx
}; $d$.ori=$r$;
$pppp$.refresh=function(){
	if(this.isVisible()){
		const a=this.actor();
		let dead;
		if(this._tmp&&(
			this._tmp._lastActor!==a||
			((dead=a.isDeathStateAffected())!==this._tmp._lastActorDead)
		)){
			this._tmp._lastActor=a;
			if(!dead && this._tmp._lastActorDead!==dead && this._dir2) this._direction=this._dir2;
			this._tmp._lastActorDead=dead;
			let dmgimg;
			if(dead && (dmgimg=a.getData().dmgimg)){
				this._dirfx=1;
				this.setImage(dmgimg[0],dmgimg[1]);
				this._direction=(dmgimg[2]+1)<<1;
			}else{
				this._dirfx=0;
				this.setImage(a.characterName(), a.characterIndex());
			}
		}
	}else{
		this._dirfx=0;
		this.setImage('', 0);
	}
};
$pppp$.setWalkAnime=function(wa){ // ori: chrB
	this._walkAnime = this._tmp.wa&&wa;
};
$pppp$.actor=function(){ // btlr -> all
	return $gameParty.allMembers()[this._memberIndex];
};
$pppp$.setFollowers=function(flrs,fromLoad){
	if(!this._tmp) this._tmp=[];
	if(this._tmp._followers=flrs){
		this.resetWalkAni();
		if(!fromLoad) this.updateAppearance();
	}
};
$r$=$pppp$.locate;
$d$=$pppp$.locate=function f(x,y){
	f.ori.call(this,x,y);
	if(this._tmp&&this._tmp._followers&&!$gamePlayer._newMapId) this._tmp._followers.updateTbl(this);
	return this;
}; $d$.ori=$r$;
$d$=$pppp$.chaseCharacter=function f(character){
	let sx=this.deltaXFrom(character.x); // int
	let sy=this.deltaYFrom(character.y); // int
	if(sx!==0) sx=sx<0?6:4;
	if(sy!==0) sy=sy<0?2:8;
	this.moveDiagonally(sx,sy);
	if(this._tmp&&this._tmp._followers) this._tmp._followers.updateTbl(this);
	return this.setMoveSpeed($gamePlayer.realMoveSpeed());
};
$d$.h1=[6,0,4];
$d$.v1=[2,0,8];
$pppp$.update = function() {
	Game_Character.prototype.update.call(this);
	if(this._tmp&&this._tmp._lastActor&&this._tmp._lastActor.isDeathStateAffected()!==this._tmp._lastActorDead){
		// change actor will be refreshed from $gameParty's function
		this.refresh();
	}
};
$pppp$=$aaaa$=undef;

// - followers
$aaaa$=Game_Followers;
$pppp$=$aaaa$.prototype;
Object.defineProperties($aaaa$.prototype,{
	length:{
		get:function(){return this._data.length;},
	},
	_following:{
		get:function(){return this._flwing&&true||false;},
		set:function(rhs){
			let newval=rhs&&1||0;
			if(this._flwing!==newval){
				this._flwing=newval;
				let tmp=$dataMap&&$dataMap.flwing_pannel;
				if(tmp) tmp.redrawtxt();
			}
			return rhs;
		},
	},
});
$pppp$.initialize = function() {
	this._visible = $dataSystem.optFollowers;
	this._gathering = false;
	this._following = true;
	this._data = [];
	//this.clearTbl();
	//for(let i=1,ie=objs.$gameParty.maxBattleMembers();i<ie;++i) this.addFollower(new Game_Follower(i));
};
$pppp$.addFollower=function(fo,fromLoad){
	fo.setFollowers(this,fromLoad);
	this._data.push(fo);
	this.updateTbl(fo);
};
$pppp$.clearFollowerFromTbl=function(fo){
	if(!$gameTemp._flrs_coord) return;
	let tmp;
	if(tmp=$gameTemp._flrs_coord[fo._lastIdx]) tmp.delete(fo);
};
$pppp$.popFollower=function(){
	if(this._data.length){
		const flr=this._data.pop();
		flr.setFollowers(undefined);
		this.clearFollowerFromTbl(flr);
	}
};
$pppp$.clearTbl=function(){
	//$gameTemp._flrs_coord=[]; // created @ Scene_Map.prototype.onMapLoaded
};
$pppp$.updateTbl=function(fo){
	if(!(fo._memberIndex<objs.$gameParty.battleMembers().length) || !$gameTemp._flrs_coord) return;
	let tmp;
	if(tmp=$gameTemp._flrs_coord[fo._lastIdx]) tmp.delete(fo);
	if(tmp=$gameTemp._flrs_coord[fo._lastIdx=fo.xy2idx()]) tmp.add(fo);
};
$d$=$pppp$.refresh=function f(){
	this.forEach(f.forEach, this);
};
$d$.forEach=flwr=>flwr.refresh();
$pppp$.getFlrAtTblIdx=function(idx){
	if(!$gameMap||!$gameTemp._flrs_coord) return [];
	return $gameTemp._flrs_coord[idx];
};
$pppp$.getFlrAt=function(x,y){
	return this.getFlrAtTblIdx($gameMap.xy2idx(x,y));
};
$pppp$.updateMove_1=function(c,t){
	let sx,sy;
	if($gameTemp.LH){
		if(c._x<t.x){
			if($gameTemp.W_2<t.x-c._x) sx=c._x+$gameTemp.W;
			else sx=c._x;
		}else{
			if($gameTemp.W_2<c.x-t._x) sx=c._x-$gameTemp.W;
			else sx=c._x;
		}
	}else sx=c._x;
	if($gameTemp.LV){
		if(c._y<t.y){
			if($gameTemp.H_2<t.y-c._y) sy=c._y+$gameTemp.H;
			else sy=c._y;
		}else{
			if($gameTemp.H_2<c.y-t._y) sy=c._y-$gameTemp.H;
			else sy=c._y;
		}
	}else sy=c._y;
	c.setPosition(sx,sy); // used for looped map
	c._x=t.x;
	c._y=t.y;
	{ const dir=t._dirfx?t._dir2:t._direction;
	if(!c._dirfx) c._direction=dir;
	c._dir2=dir;
	}
	this.updateTbl(c);
	c.increaseSteps();
};
$pppp$.updateMove=function(){
	if(this._following&&this._data.length){
		$gameTemp.LH=$gameMap.isLoopHorizontal();
		$gameTemp.LV=$gameMap.isLoopVertical();
		const W=$gameTemp.W=$gameMap.width();
		const H=$gameTemp.H=$gameMap.height();
		$gameTemp.W_2=W>>1;
		$gameTemp.H_2=H>>1;
		for(let arr=this._data,x=arr.length;--x;){ let c=arr[x],t=arr[x-1];
			this.updateMove_1(c,t);
		}
		let c=this._data[0],t=$gamePlayer;
			this.updateMove_1(c,t);
	}
};
$pppp$.visibleFollowers=function f(){
	if(this.isVisible()&&$gameParty._acs.length) return this._data; //this._data.slice(0,$gameParty._acs.length-1);
	return f._dummy_arr;
};
$pppp$.isSomeoneCollided=function(x,y){
	return $gameTemp._flrs_coord[$dataMap.width*y+x].size!==0;
};
$pppp$=$aaaa$=undef;

// - selfswitches
$aaaa$=Game_SelfSwitches;
$pppp$=$aaaa$.prototype;
//$pppp$.clear=function(){ this._data = []; };
$pppp$.initialize = function() {
	this._data=[0];
};
$pppp$.switches=["A","B","C","D"];
$pppp$.value=function(k){
	let t=this._data[k.shift()];
	return !!(t&&t[k]);
};
$pppp$.setValue_=function(t,k,v,m){
	if(v){
		t[k] = true;
		//$gameTemp._ssSets[m].set(k.join()); // 改天
	}else{
		delete t[k];
		//$gameTemp._ssSets[m].delete(k.join()); // 改天
	}
	let evt=$gameMap._events[k[0]];
	if(this._data[$gameMap._mapId]===t){ // the switch is @ current map
		let self=this;
		if(evt&&evt._sameStatEvts){ for(let x=0,arr=evt._sameStatEvts;x!==arr.length;++x){ // let evtid=arr[x];
			this.setValue_(t,[arr[x],k[1]],v,$gameMap._mapId);
		} }
	}
	if(evt&&!evt.noUpdate) return this.onChange();
};
$pppp$.setValue=function(k,v){
	let mapid=k.shift();
	let t=this._data[mapid];
	if(!t) t=this._data[mapid]={};
	return this.setValue_(t,k,v,mapid);
};
$pppp$.clear = function(mapid) {
	if(mapid>0) this._data[n]={};
	else this._data = [];
};
$pppp$=$aaaa$=undef;

// - event

$aaaa$=Game_Event;
$pppp$=$aaaa$.prototype;
$pppp$.getData=function(){
	return this.event();
};
$pppp$.getAvatarActor=function(){
	if(this._actorAvatar) return $gameActors.actor(this._actorAvatar);
};
$pppp$.getPartyActor=function(){
	const id=$gameParty._acs[this._player];
	return id && $gameActors.actor(id);
};
$pppp$.getRefActor=function(){
	const id=this.getData().meta.refActor;
	return id && $gameActors.actor(id);
};
$pppp$.getActor=function(){
	return this.getAvatarActor()||this.getPartyActor(); // others can use 'pages' to do dmg
};
Object.defineProperties($aaaa$.prototype,{
	z2:{
		get:function(){
			return isNone(this._z2)?this._priorityType:this._z2; // type=above => default z2=2
		},set:function(rhs){
			this._z2=rhs;
		},
	}
});
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(mapId,evtId){
	//debug.log2('Game_Event.prototype.initialize');
	this.imgModded=true;
this.refresh=none;
	
	// init $dataMap // $dataMap must exist because 'f.ori' calls 'this.event()'
	let mapd=$dataMap;
	
	// - $dataMap.coordTbl
	if(!mapd.coordTbl){
		let tbl=mapd.coordTbl=[]; tbl.length=mapd.height*mapd.width;
		for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue();
		
		// _Nt
		tbl=mapd.coordTblNt=[];  tbl.length=mapd.coordTbl.length;
		for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue();
		
		// _NtP1
		tbl=mapd.coordTblNtP1=[];  tbl.length=mapd.coordTbl.length;
		for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue();
		
		// _strtByAny
		tbl=mapd.coordTbl_strtByAny=[];  tbl.length=mapd.coordTbl.length;
		for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue();
		
		// _strtByAny_P1
		tbl=mapd.coordTbl_strtByAny_P1=[];  tbl.length=mapd.coordTbl.length;
		for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue();
	}
	
	let rtv=f.ori.apply(this,arguments);
	
	let evtd=this.event();
	let meta=evtd.meta;
	
	// display
	this._z=undefined;
	if(meta.z){
		let tmp=Number(meta.z);
		if(!isNaN(tmp)) this._z=tmp;
	}
	this._sy=0;
	if(meta.sy){
		let tmp=Number(meta.sy);
		if(!isNaN(tmp)) this._sy=tmp;
	}
	this._z2=undefined;
	if(meta.z2){
		let tmp=Number(meta.z2);
		if(!isNaN(tmp)) this._z2=tmp;
	}
	this._light=0;
	if(meta.light){
		let tmp=Number(meta.light);
		if(0<tmp) this._light=tmp; // is light src if > 0
	}
	this._opacity=255;
	if(meta.seenless) this._opacity=0;
	if(meta.animationCount){
		let tmp=Number(meta.animationCount);
		if(0<tmp) this._animationCount=tmp; // is light src if > 0
	}
	this._asPlayer=0; // as player collision others
	// style
	this._dmg=(meta.damaged)?1:0;
	this._plyr=-1;
	if(meta.player){
		this._plyr=(meta.player===true)?0:Number(meta.player);
		if(!(this._plyr>=0)) this._plyr=-1;
		else this._asPlayer=1;
	}
	// interact
	this._strtByAny=!!meta.strtByAny;
	this._nu=(meta.noUpdate)?1:0;
	this._ps=(meta.passSelf)?1:0;
	this._tf=(meta.triggerFollower)?1:0;
	this._itrpQ=0;
	this._itrp2=0;
	// moving
	if(meta.stopCount){
		let tmp=Number(meta.stopCount);
		if(!isNaN(tmp)) this._stopCount=tmp;
	}
	this._lld=0;
	if(meta.longDistDetection){
		this.longDistDetection=meta.longDistDetection===true?true:Number(meta.longDistDetection);
	}
	this._preventZaWarudo=evtd.note==="init"||evtd.note==="achievement"||meta.preventZaWarudo||meta.init||meta.achievement||meta.block||meta.txt;
	// as
	this._aa=undefined;
	this._ref_mvr=0;
	
	let x=this._x,y=this._y; // will be used later
	
	// put coordTbl
	if($gameMap.isValid(x,y)){
		let idx=mapd.width*y+x;
		mapd.coordTbl[idx].push(this);
		if(!this._through){
			mapd.coordTblNt[idx].push(this);
			if(this._priorityType===1) mapd.coordTblNtP1[idx].push(this);
		}
	}
	// - $dataMap.strtEvts , $dataMap.strtEvts_noStopMove
	if(!mapd.strtEvts){
		mapd.strtEvts=new Queue();
		mapd.strtEvts_noStopMove=new Queue();
	}
	this._addedCnt_strtEvts=0;
	
delete this.refresh;
	//debug.log2(this.refresh);
	this.refresh();
	if(this._trigger === 3) this._starting=false;
	
	this._queues=[];
	//this._tmp=[]; // Game_Character
	
	// delete those added @ runtime
	delete this._sameStatEvts;
	delete this.parentId;
	return rtv;
}; $d$.ori=$r$;
$pppp$._rmFromCoordTbl=function(){
	if(this._rmFromCoordTbl_1()!==undefined){ // valid rm
		if(!this._through){
			this._rmFromCoordTbl_1($dataMap.coordTblNt);
			if(this._priorityType===1) this._rmFromCoordTbl_1($dataMap.coordTblNtP1);
		}
		if(this._strtByAny){
			if(this._pri===1) this._rmFromCoordTbl_1($dataMap.coordTbl_strtByAny_P1);
			else this._rmFromCoordTbl_1($dataMap.coordTbl_strtByAny);
		}
	}
};
$pppp$._rmFromCoordTbl_1=function(tbl){
	//debug.log2('Game_Event.prototype._rmFromCoordTbl');
	let mapd=$dataMap;
	// x,y may be out of bound
	if(tbl){ if(!(tbl=tbl[this.xy2idx()])) return; }
	else if(!(tbl = $gameMap.isValid(this.x,this.y) && mapd && mapd.coordTbl && mapd.coordTbl[this.xy2idx()])) return;
	let idx=tbl.indexOf(this); // .coordTbl
	if(idx===-1) return;
	if((idx<<1)<tbl.length){
		tbl.setnth(idx,tbl.front);
		return tbl.pop_front();
	}else{
		tbl.setnth(idx,tbl.back);
		return tbl.pop_back();
	}
};
$pppp$._addToCoordTbl=function(){
	if(this._addToCoordTbl_1()!==undefined){ // valid add
		if(!this._through){
			this._addToCoordTbl_1($dataMap.coordTblNt);
			if(this._priorityType===1) this._addToCoordTbl_1($dataMap.coordTblNtP1);
		}
		if(this._strtByAny){
			if(this._pri===1) this._addToCoordTbl_1($dataMap.coordTbl_strtByAny_P1);
			else this._addToCoordTbl_1($dataMap.coordTbl_strtByAny);
		}
	}
};
$pppp$._addToCoordTbl_1=function(tbl){
	//debug.log2('Game_Event.prototype._addToCoordTbl');
	if(this.refresh===none) return; // is constructing
	let mapd=$dataMap;
	// x,y may be out of bound
	if(tbl){ if(!(tbl=tbl[this.xy2idx()])) return; }
	else if(!(tbl = $gameMap.isValid(this.x,this.y) && mapd && mapd.coordTbl && mapd.coordTbl[this.xy2idx()])) return;
	return tbl.push(this);
};
$k$='isCollidedWithEvents';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(posx,posy){
	if(this._asPlayer) return Game_Player.prototype.isCollidedWithEvents.call(this,posx,posy);
	let rtv=f.ori.call(this,posx,posy);
	if(rtv&&this._passSelf){
		const id=this._eventId.toId();
		rtv=$dataMap.coordTblNt[$gameMap.xy2idx(posx,posy)].some(evt=>evt._eventId.toId()!==id);
	}
	return rtv;
}; $d$.ori=$r$;
$pppp$.turnTowardStartee=function(){
	const m=this._tmp&&this._tmp._strtMeta;
	if(m){
		let c;
		if(m.btlr) c=$gamePlayer._followers.follower(m.flrIdx);
		else if(m.startBy) c=$gameMap._events[m.startBy];
		this._tmp._strtMeta=undefined;
		if(c) return this.turnTowardCharacter(c);
	}
	this.turnTowardPlayer();
};
$pppp$.lock=function(){
	if(!this._locked){
		this._prelockDirection = this.direction();
		this.turnTowardStartee();
		this._locked = true;
	}
};
$pppp$._deleteOldDataMember=function(){
	if(this._evtid===undefined){
		const evtid=this._eventId;
		delete this._eventId;
		this._eventId=evtid;
	}
	if(this._sba===undefined){
		const sba=this._strtByAny;
		delete this._strtByAny;
		this._strtByAny=sba;
	}
}
Object.defineProperties($aaaa$.prototype,{
	_eventId:{ get:function(){return this._evtid;},set:function(rhs){
		this._idd=(this._evtid=rhs).toId();
		return rhs;
	},configurable:false},
	_x:{ get:function(){return this.__x;},set:function(rhs){
		this._rmFromCoordTbl();
		this.__x=rhs;
		this._addToCoordTbl();
		return rhs;
	},configurable:false},
	_y:{ get:function(){return this.__y;},set:function(rhs){
		this._rmFromCoordTbl();
		this.__y=rhs;
		this._addToCoordTbl();
		return rhs;
	},configurable:false},
	_trigger:{ get:function(){return this._trg;},set:function(rhs){
		return this._trg=rhs;
	},configurable:false},
	_through:{ get:function(){return this._thru;},set:function(rhs){
		let tblNt=$dataMap.coordTblNt;
		if(tblNt && this._thru^rhs){
			if(rhs){
				if(this._rmFromCoordTbl_1(tblNt) && this._priorityType===1){
					this._rmFromCoordTbl_1($dataMap.coordTblNtP1);
				}
			}else{
				// Queue.push returns index of _data
				if(this._addToCoordTbl_1(tblNt)+1 && this._priorityType===1){
					this._addToCoordTbl_1($dataMap.coordTblNtP1);
				}
			}
		}
		return this._thru=rhs;
	},configurable:false},
	_priorityType:{ get:function(){return this._pri},set:function(rhs){
		let tblNtP1=$dataMap.coordTblNtP1;
		if(tblNtP1 && !this._through && this._pri!==rhs && (this._pri===1 || rhs===1)){
			if(rhs!==1) this._rmFromCoordTbl_1(tblNtP1);
			else this._addToCoordTbl_1(tblNtP1);
		}
		return this._pri=rhs;
	},configurable:false},
	_strtByAny:{ get:function(){return this._sba},set:function(rhs){
			if(this._sba=rhs&&1||0){
				if($dataMap){
					if(this._pri===1){
						if($dataMap.coordTbl_strtByAny_P1) this._addToCoordTbl_1($dataMap.coordTbl_strtByAny_P1);
					}else{
						if($dataMap.coordTbl_strtByAny) this._addToCoordTbl_1($dataMap.coordTbl_strtByAny);
					}
				}
			}else{
				if($dataMap){
					if(this._pri===1){
						if($dataMap.coordTbl_strtByAny_P1) this._rmFromCoordTbl_1($dataMap.coordTbl_strtByAny_P1);
					}else{
						if($dataMap.coordTbl_strtByAny) this._rmFromCoordTbl_1($dataMap.coordTbl_strtByAny);
					}
				}
			}
		return rhs;
	},configurable:false},
	strtByAny_skips:{
		get:function(){ return this._strtByAny_skips||(
			this._strtByAny_skips=new Set(JSON.parse(this.getData().meta.strtByAny_skips||'[]'))
		);},
		set:function(rhs){ return rhs; },
	configurable:false},
	_preventZaWarudo:{
		get:function(){ this._pz; },
		set:function(rhs){ return this._pz=rhs; },
	configurable:false},
	_color:{
		get:function(){ return this._clr; },
		set:function(rhs){
			if(this._clr===rhs) return rhs;
			this.imgModded=true;
			return this._clr=rhs;
		},
	configurable:false},
	_scale:{
		get:function(){ return this._scl; },
		set:function(rhs){
			if(this._scl===rhs) return rhs;
			this.imgModded=true;
			return this._scl=rhs;
		},
	configurable:false},
	_player:{
		get:function(){ return this._plyr; },
		set:function(rhs){
			if(this._plyr===rhs) return rhs;
			this.imgModded=true;
			return this._plyr=rhs;
		},
	configurable:false},
	// simply shorten (default members)
	_originalDirection:{ get:function(){ return this._odir||2; },set:function(rhs){
		return this._odir=rhs;
	},configurable:false},
	// simply shorten (custom members)
	longDistDetection:{
		get:function(){ return this._lld; },
		set:function(rhs){ return this._lld=rhs; },
	configurable:false},
	_noUpdate:{
		get:function(){ return this._nu; },
		set:function(rhs){ return this._nu=rhs; },
	configurable:false},
	_passSelf:{
		get:function(){ return this._ps; },
		set:function(rhs){ return this._ps=rhs; },
	configurable:false},
	_asPlayer:{
		get:function(){ return this._asp; },
		set:function(rhs){ return this._asp=rhs; },
	configurable:false},
	_actorAvatar:{
		get:function(){ return this._aa; },
		set:function(rhs){ return this._aa=rhs; },
	configurable:false},
	_triggerFollower:{
		get:function(){ return this._tf; },
		set:function(rhs){ return this._tf=rhs; },
	configurable:false},
});
$pppp$.queuePush=function(qidx,data){ qidx^=0;
	if(!this._queues[qidx]) this._queues[qidx]=new Queue();
	return this._queues[qidx].push(data);
};
$pppp$.queuePop=function(qidx){ qidx^=0;
	return this._queues[qidx]&&this._queues[qidx].pop();
};
$pppp$.queueLen=function(qidx){
	return (this._queues[qidx]&&this._queues[qidx].length)^0;
};
$pppp$.queueGetnth=function(qidx,n){ qidx^=0;
	return this._queues[qidx]&&this._queues[qidx].getnth(n);
};
$pppp$.pushXyToQueue=function(qidx,obj){
	return this.queuePush(qidx,[obj.x,obj.y]);
};
$pppp$.findDirFromQueue=function(qidx,disables,kargs){ // try from newest to oldest
	let q=this._queues[qidx^0]; // 'this.pushXyToQueue' // [ ... , [x,y], ... ] 
	if(!q) return 0;
	let goals=[];
	for(let nth=q.length;nth--;) goals.push(q.getnth(nth));
	return this.findDirTo(goals,disables,kargs);
};
$pppp$.isInitPos=function(){
	let evtd=this.event();
	return this.x===evtd.x && this.y==evtd.y;
};
$pppp$.resetDir=function(alsoSetupPage){
	let p=this.findProperPageIndex();
	if(p<0) return;
	let img=this.event().pages[p].image;
	this._direction=img.direction;
	if(alsoSetupPage){
		this._pageIndex=p;
		this.setupPage();
	}
};
$k$='moveStraight';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(d){ // .strtByAny
	f.ori.call(this,d);
	if(!this.isMovementSucceeded()) return; // handled by this.checkEventTriggerTouch
	const idx=this.xy2idx();
	let strtMeta={startBy:this._eventId},strtByAny=$dataMap.coordTbl_strtByAny[idx];
	if(strtByAny) strtByAny.forEach(evt=>!evt._starting&&!evt.strtByAny_skips.has(this._eventId)&&evt.start(undefined,strtMeta)); // 'if' for preventing myself moving an evt out of the map
	if( this._triggerFollower && this._trigger === 2 && $gamePlayer.xy2idx()!==idx ){
		const flr=$gamePlayer._followers.getFlrAtTblIdx(idx)[0];
		if( flr && !this.isJumping() && this.isNormalPriority() ) return this.start(undefined,{btlr:flr.actor()._actorId,flrIdx:flr._memberIndex-1});
	}
}; $d$.ori=$r$;
$k$='checkEventTriggerTouch';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(x,y){ // .strtByAny
	// see also Game_Event.prototype.moveStraight
	//debug.log('Game_Event.prototype.checkEventTriggerTouch');
	let strtByAny;
	if(this.x===x&&this.y===y) strtByAny=$dataMap.coordTbl_strtByAny[$gameMap.xy2idx(x,y)]; // for _pri===0
	else if($gameMap.isValid(x,y)) strtByAny=$dataMap.coordTbl_strtByAny_P1[$gameMap.xy2idx(x,y)]; // for _pri===1
	if(strtByAny && strtByAny.length){ // evt triggers front @ border -> out of map -> undef
		let strtMeta={startBy:this._eventId};
		strtByAny.forEach(evt=>!evt._starting&&!evt.strtByAny_skips.has(this._eventId)&&evt.start(undefined,strtMeta));
		return;
	}
	if( this._triggerFollower && this._trigger === 2 ){
		const flr=$gamePlayer._followers.getFlrAt(x,y)[0];
		if( flr && !this.isJumping() && this.isNormalPriority() ) return this.start(undefined,{btlr:flr.actor()._actorId,flrIdx:flr._memberIndex-1});
	}
	f.ori.call(this,x,y);
}; $d$.ori=$r$;
$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	//if(this._player>=0)
	{
		const a=this.getActor();
		//const a=$gameActors.actor($gameParty._acs[this._player]);
		if(a&&(this._tmp&&(
			this._tmp._lastActor!==a ||
			this._tmp._lastActorDead!==this._dmg
		))){
			this._tmp._lastActor=a;
			this._color=a._getColorEdt();
			this._scale=a._getScaleEdt();
			let dmgimg;
			if((this._tmp._lastActorDead=this._dmg) && (dmgimg=a.getData().dmgimg)){
				if(this._dirfx_bak===undefined) this._dirfx_bak=this._dirfx;
				this._ref_chrIdx=a._characterIndex;
				this._ref_chrName=a._characterName;
				this._characterName  =dmgimg[0];
				this._characterIndex =dmgimg[1];
				this._direction=(dmgimg[2]+1)<<1;
				this._dirfx=1;
			}else{
				this._characterName  =a.characterName ();
				this._characterIndex =a.characterIndex();
				if(this._dirfx_bak!==undefined){
					this._dirfx=this._dirfx_bak;
					delete this._dirfx_bak;
				}
			}
		}//else this._characterName='';
	}
	if(this.canUpdate()) return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$._initItrpQIfNeeded=function(){
	if(!this._itrpQ) this._itrpQ=new Queue();
	else if(this._itrpQ.constructor!==Queue) this._itrpQ=Object.toType(this._itrpQ,Queue);
};
$pppp$.updateParallel=function(){
	if(this._trigger===4){ // parallel
		if(!this._interpreter) this._interpreter=objs.new_Game_Interpreter();
		if(!this._interpreter.isRunning()) this._interpreter.setup(this.list(), this._eventId);
		this._interpreter.update();
	}
	if(this.event().meta.parallel_1){ // exec @ an independent interpreter
		if(!this._itrp2) this._itrp2=objs.new_Game_Interpreter();
		if(!this._itrp2.isRunning()){
			this._initItrpQIfNeeded();
			if(this._itrpQ.length){
				const evtStrt=this._itrpQ.front; this._itrpQ.pop();
				const evt=$gameMap._events[evtStrt[0]],strtMeta=evtStrt[1];
				if(this===evt) this._itrp2.setup(this.list(), this._eventId,strtMeta);
			}
		}
		this._itrp2.update();
	}
};
$pppp$.canUpdate=function(){
	return !this._noUpdate && (!$gameMap.zaWarudo()||this.preventZaWarudo());
};
$pppp$.preventZaWarudo=function(){
	return this._preventZaWarudo; // ||this._trigger===1; // player touch
};
$pppp$.setPreventZaWarudo=function(val){
	this._preventZaWarudo=val;
};
$pppp$.event=function(){ return $dataMap.events[this._idd]; };
//$pppp$.event=function(){ return $dataMap.events[this._eventId.toId()]; };
$d$=$pppp$.stopCountThreshold=function f(){
	// return 30 * (5 - this.moveFrequency());
	return f.tbl[this.moveFrequency()]|0;
};
$d$.tbl=[]; for(let x=0,arr=$d$.tbl;x!==5;++x) arr[x]=30*(5-x); for(let x=5,arr=$d$.tbl;x!==11;++x) arr[x]=0; for(let x=-10,arr=$d$.tbl;x!==0;++x) arr[x]=30*(5-x);
$pppp$.isNearThePlayer=function(p,dist){
	p=p||$gamePlayer;
	dist=dist===undefined?20:dist; dist^=0;
	return Math.abs(this.deltaXFrom(p.x)) + Math.abs(this.deltaYFrom(p.y)) < dist;
};
$pppp$.hasStrtType=function(key){
	// strtType will be clear when 'this.start'
	return this.strt && this.strt[key];
};
$pppp$.addStrtType=function(key){
	// strtType will be clear when 'this.start'
	if(!this.strt) this.strt={};
	this.strt[key]=1;
};
$r$=$pppp$.start;
$d$=$pppp$.start=function f(isFromPlayerCustom,strtMeta){ // fit $dataMap.strtEvts
	// isFromPlayerCustom: no condition checks (in this func.) if true
	// * 'strtMeta' and 'this.strt' have chance to be edited if ''!isFromPlayerCustom'
	//debug.log2('Game_Event.prototype.start');
	{ let page=this.page(); if(!page||page.list.length<2) return; } // empty evt should not start // list.back==={code:0,...}
	if($gameMap.zaWarudo()&&!this.preventZaWarudo()){
		$gameMap.zaWarudo_waitToStart(this._eventId);
		return;
	}
	if(this._erased) return;
	let evtd=this.event(),meta=evtd.meta;
	if(this.parentId && (meta.canAct||meta.burnable)){
		let evt=$gameMap._events[this.parentId];
		if(evt && !evt._starting){
			evt.strt=this.strt; this.strt=undefined;
			return evt.start(isFromPlayerCustom,strtMeta);
		}
		return;
	}
	
	if(!isFromPlayerCustom){
		if(strtMeta){
			let m2={},s=this.strt;
			for(let i in s) m2[i]=s[i];
			for(let i in strtMeta) m2[i]=strtMeta[i];
			strtMeta=m2;
		}else strtMeta=this.strt;
		this.strt=undefined;
		if(meta.burnable){
			if(!strtMeta) strtMeta={};
			strtMeta.burn=!!$gameParty.canburn;
			strtMeta.slash=!!$gameParty.canslash;
			strtMeta.partyBurnLvOutput=$gameParty.burnLvOutput();
		}
		let leader=$gameParty.leader();
		let canBurned=this.canBurned()
		let canSlashed=this.canSlashed();
		if(canSlashed&&strtMeta&&strtMeta.slash){
			let srng=$gameParty._sRng; $gameParty._sRng=0;
			let hpCost=$gameParty.slashhpcost;
			if(hpCost>=leader.hp){
				delete strtMeta.slash;
				$gameMessage.popup("伐木所需HP不足");
			}else leader.gainHp(-hpCost);
			$gameParty._sRng=srng;
		}
		if(canBurned&&strtMeta&&strtMeta.burn){
			let brng=$gameParty._bRng; $gameParty._bRng=0;
			let mpCost=$gameParty.burnmpcost;
			if(leader.mp<mpCost){
				delete strtMeta.burn;
				$gameMessage.popup("焚木所需MP不足");
			}else leader.gainMp(-mpCost);
			$gameParty._bRng=brng;
		}
	}
	let notStrt=!this._starting;
	if(this._tmp) this._tmp._strtMeta=strtMeta;
	f.ori.call(this);
	if(!this._starting ^notStrt){
		++this._addedCnt_strtEvts;
		let arg=[this,strtMeta];
		if(meta.parallel_1){
			this.clearStartingFlag(); // parallel ignores whether it is starting
			arg[0]=this._eventId;
			this._initItrpQIfNeeded();
			this._itrpQ.push(arg);
		}else{
			if(meta.noStopMove) $dataMap.strtEvts_noStopMove.push(arg);
			$dataMap.strtEvts.push(arg);
		}
		return;
	}
}; $d$.ori=$r$;
$k$='clearStartingFlag';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){ // overwrite to fit $dataMap.strtEvts
	//debug.log2('Game_Event.prototype.clearStartingFlag'); // annoying
	//debug.log2('',this._eventId);
	//debug.log2('',this._trigger);
	//if(debug.islog2()) console.log('',deepcopy($dataMap.strtEvts));
	let strt=this._starting;
	f.ori.call(this);
	this._addedCnt_strtEvts-=0<this._addedCnt_strtEvts;
	delete this.strt;
}; $d$.ori=$r$;
$pppp$.erase_inv=function(){
	let arr=this._sameStatEvts;
	if(arr&&0<arr.length){
		for(let x=0,dict={};x!==arr.length;++x){ let evtid=arr[x];
			if(dict[evtid]) continue; // check cycle
			dict[evtid]=1;
			$gameMap._events[evtid].erase_inv();
		}
	}
	let rtv=this._erased;
	rtv^=(this._erased=false);
	this._addToCoordTbl();
	if(rtv){
		let meta=this.event().meta;
		let vars=$gameParty.mch().vars;
		if(vars.tree) vars.tree+=meta.dectree^0;
	}
	return rtv;
};
$r$=$pppp$.erase;
$d$=$pppp$.erase=function f(by){
	//debug.log('Game_Event.prototype.erase');
	let arr=this._sameStatEvts;
	if(arr&&0<arr.length){
		for(let x=0,dict={};x!==arr.length;++x){ let evtid=arr[x];
			if(dict[evtid]) continue; // check cycle
			dict[evtid]=1;
			$gameMap._events[evtid].erase();
		}
	}
	this._rmFromCoordTbl();
	let rtv=this._erased;
	f.ori.call(this);
	rtv^=this._erased;
	if(rtv){
		let meta=this.event().meta;
		let vars=$gameParty.mch().vars;
		if(vars.tree) vars.tree-=meta.dectree^0;
		if(meta.erasedBy){ // erased by 'by' then start event with id='meta.erasedBy[by]'
			let next=JSON.parse(meta.erasedBy||"{}"),nevtid=next&&next[by];
			if(nevtid) $gameMap._events[nevtid].start();
		}
	}
	return rtv;
}; $d$.ori=$r$;
// <erasedBy:{"key":evtid}> ; when 'by' provided to 'Game_Event.erase(by)' exists in 'erasedBy', corresponding event will start
$pppp$.parent=function(){
	return (this.parentId)?$gameMap._events[this.parentId]:this;
};
$pppp$._constructChildren=function(tm,ssStates){
	//debug.log('Game_Event.prototype._constructChildren');
	let meta=this.event().meta;
	//debug.log('',meta.child && !this._sameStatEvts);
	if(meta.child && !this._sameStatEvts){ this._sameStatEvts=[];
		let self=this,ssobj=this.ssState().obj;
		tm=tm||Date.now();
		ssStates=ssStates||$gameSelfSwitches.switches.filter(x=>ssobj[([self._eventId,x])]);
		let mapid=this._mapId,evts=$gameMap._events,obj=this,obj_ori=this,meta_ori=meta,dict={};
		while(meta.child){
			if(dict[meta.child]) break; else dict[meta.child]=1; // check cycle
			let x=obj.x,y=obj.y,dx=meta.dx?Number(meta.dx):0,dy=meta.dy?Number(meta.dy):0;
			obj=objs.new_Game_Event(mapid,meta.child+'-'+tm+"8"+evts.length.toString(8));
			obj._realX=obj._x=x+dx; obj._realY=obj._y=y+dy;
			obj.parentId=this._eventId;
			evts.push(obj); evts[obj._eventId]=obj;
			this._sameStatEvts.push(obj._eventId);
			for(let i=0;i!==ssStates.length;++i) ssobj[([obj._eventId,ssStates[i]])]=true;
			meta=obj.event().meta;
		}
	}
};
$pppp$.ssState=function(ssname){
	// 'ss' for "self switch"
	return {obj:$gameSelfSwitches._data[this._mapId],key:[this._eventId,ssname]};
};
$pppp$.ssStateInv=function(ssname){
	let res=this.ssState(ssname);
	let v=!res.obj[res.key];
	$gameSelfSwitches.setValue_(res.obj,res.key,v);
	return v;
};
$pppp$.ssStateSet=function(ssname,toFalse){
	let res=this.ssState(ssname);
	//if(!toFalse && !res.obj[res.key]) setTrue
	//if(toFalse && res.obj[res.key]) setFalse
	//if(toFalse^1^res.obj[res.key]) set
	toFalse^=1;
	if(toFalse^res.obj[res.key]) $gameSelfSwitches.setValue_(res.obj,res.key,toFalse);
	return toFalse;
};
$pppp$.findProperPageIndex=function f(){
	let pages=this.event().pages;
	for(let x=pages.length;x--;){
		let c=pages[x].conditions,ss=$gameSelfSwitches._data[this._mapId];
		if(
		 (!c.switch1Valid || $gameSwitches.value(c.switch1Id))
		 && (!c.switch2Valid || $gameSwitches.value(c.switch2Id))
		 && (!c.variableValid || $gameVariables.value(c.variableId)>=c.variableValue)
		 && (!c.selfSwitchValid || ( ss && ss[([this._eventId,c.selfSwitchCh])] ) )
		 && (!c.itemValid || 0<$gameParty.numItems_i(c.itemId)) // maybe neg? debt?
		 //&& (!c.actorValid || $gameParty._actors.indexOf(c.actorId)!==-1)
		 && ( !c.actorValid || $gameTemp._pt_allMembers_idSet.has(c.actorId) )
		)
			return x;
	}
	return -1;
};
$k$='clearPageSettings';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	this._light=undefined;
	this.imgModded=true;
	return f.ori.call(this);
}; $d$.ori=$r$;
$k$='setupPageSettings';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	let evtd=this.event();
	const sp=this.getSprite();
	sp && sp.setText(this.getText());
	if(evtd.meta.colors || evtd.meta.scales) this.imgModded=true;
	if(evtd.light && evtd.light.constructor===Array) this._light=evtd.light[this._pageIndex]^0;
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.refresh=function(forced){
	//if(this.imgModded===undefined) return; // constructing...
	let newPageIndex=this._erased?-1:this.findProperPageIndex();
	if(forced || this._pageIndex!==newPageIndex){
		this._pageIndex=newPageIndex;
		this.setupPage();
	}
	return this;
};
$r$=$pppp$.list;
$d$=$pppp$.list=function f(){
	let olist=f.ori.call(this),rtv=[];
	for(let x=0;x!==olist.length;++x){
		let curr=olist[x];
		if(curr.code===108 && curr.parameters[0]==="<meta>"){ // comments with starting line="<meta>" is not presented in list
			let c=x+1,cmt="";
			for(;c!==olist.length;++c){
				if(olist[c].code===408){
					cmt+="\n";
					cmt+=olist[c].parameters[0];
				}else break;
			}
			let tmp={note:cmt};
			DataManager.extractMetadata(tmp);
			tmp=tmp.meta;
			if(tmp.addCmd!==undefined){ switch(tmp.addCmd){
				default: break;
				case "scrollTo":{ if(tmp.scrollx!==undefined && tmp.scrolly!==undefined){
					let isT_x=tmp.scrollx&&tmp.scrollx[0]==='t',isT_y=tmp.scrolly&&tmp.scrolly[0]==='t';
					let scrollx=Number(isT_x?tmp.scrollx.slice(1):tmp.scrollx),scrolly=Number(isT_y?tmp.scrolly.slice(1):tmp.scrolly);
					if(isNaN(scrollx)||isNaN(scrolly)) break;
					if(!isT_x) scrollx*=$gameMap.tileWidth  ();
					if(!isT_y) scrolly*=$gameMap.tileHeight ();
					// 355 script ; 112 loop ; 111 if script ; 113 break ; 0 empty ; end ; 355 script : scrollToT_gradually ; 230 wait 1 ; 0 empty ; 413 repeat above ; set switch 
					let emptyArr=[];
					rtv.push({code:355,indent:2,parameters:["this._wait_scrollTo_done=false;"]}); // script
					rtv.push({code:112,indent:2,parameters:emptyArr}); // loop
					rtv.push({code:111,indent:3,parameters:[12,"this._wait_scrollTo_done"]}); // if-script
					rtv.push({code:113,indent:4,parameters:emptyArr}); // break
					rtv.push({code:0,indent:4,parameters:emptyArr}); // empty
					rtv.push({code:412,indent:3,parameters:emptyArr}); // end-if
					rtv.push({code:355,indent:3,parameters:["this._wait_scrollTo_done=$gameMap.scrollToT_gradually("+scrollx+","+scrolly+")"]}); // script
					rtv.push({code:230,indent:3,parameters:[1]}); // wait
					rtv.push({code:0,indent:3,parameters:emptyArr}); // empty
					rtv.push({code:413,indent:2,parameters:emptyArr}); // repeat above
					rtv.push({code:355,indent:2,parameters:["delete this._wait_scrollTo_done;"]}); // script
				} }break;
			} }
			if(tmp.cond!==undefined){
				//let cond=eval(tmp.cond);
				let cond=objs._getObj.call(this,tmp.cond);
				if(!cond && tmp.elseSkipN){
					//let skipN=eval(tmp.elseSkipN);
					let skipN=objs._getObj.call(this,tmp.elseSkipN);
					let line=(skipN && skipN.constructor===Function)?skipN(olist,c,rtv):skipN;
					c+=line; if(c>=olist.length) c=olist.length;
				}
			}
			x=c-1; // for-loop: ++x
		}else rtv.push(olist[x]);
	}
	let tmp=rtv.back;
	rtv.push(Game_Interpreter.EMPTY);
	return rtv;
}; $d$.ori=$r$;
$pppp$._genFaceData=function(c){
	// 0<this._tileId (i.e. 0<$dataEvent.page.image.tileId) or ImageManager.isObjectCharacter
	// Sprite_Character.prototype.patternWidth
	// Sprite_Character.prototype.patternHeight
	c=c||this.getSprite&&this.getSprite();
	if(!c) return;
	let frm=c._realFrame; // c._isBigCharacter; this._isObjectCharacter;
	// let r=Math.min(Window_Base._faceWidth/frm.width,Window_Base._faceHeight/frm.height);
	let sz=frm.width*frm.height,r=Math.min(Window_Base._faceWidth*frm.height,Window_Base._faceHeight*frm.width);
	let w=~~(frm.width*r/sz),h=~~(frm.height*r/sz); // for precision
	let rtv=[
		c._bitmap,
		frm.x,frm.y,frm.width,frm.height,
		(Window_Base._faceWidth-w)>>1,(Window_Base._faceHeight-h)>>1,w,h,
	]; rtv.ref=c;
	return rtv;
};
$d$=$pppp$.setFace=function f(idx){
	//debug.log('Game_Event.prototype.setFace');
	if(this._isObjectCharacter){
		$gameMessage.setFaceImage(this._genFaceData(),"data");
	}else if(this._characterName){
		let s=this.getSprite();
		if(s&&s._isBigCharacter) $gameMessage.setFaceImage(this._genFaceData(s),"data");
		else{
			const ce=this._getColorEdt();
			if(this._dmg){
				if(idx===undefined) idx=this._ref_chrIdx;
				const n=this._ref_chrName;
				if(n) $gameMessage.setFaceImage(n+(ce?"?color="+encodeURIComponent(ce):""),idx);
			}else{
				if(idx===undefined) idx=this._characterIndex;
				$gameMessage.setFaceImage(this._characterName+(ce?"?color="+encodeURIComponent(ce):""),idx);
			}
		}
	}
};
$pppp$.speak=function(txt,kargs){
	this.setFace();
	//$gameMap._interpreter.clear();
	return $gameMessage.add(txt);
};
$pppp$.choices=function(txt,chTxtArr,defaultType,cancelType,chCallback,kargs){
	if(txt) this.speak(txt,kargs);
	$gameMessage.setChoiceCallback(chCallback);
	return $gameMessage.setChoices(chTxtArr,defaultType,cancelType);
};
$pppp$.playerJumpToMy=function(dx,dy){
	dx+=this.x-$gamePlayer.x;
	dy+=this.y-$gamePlayer.y;
	return $gamePlayer.jump(dx,dy);
};
$d$=$pppp$.canEdited_auth=function f(parents){
	if(this.getData().meta.noAuth) return true;
	parents=new Set(parents||$gameMap.parents());
	return parents.has($gameParty.burnAuth) || parents.intersect(f.tbl).size!==0;
	//return !(parents.indexOf(13)===-1 && parents.indexOf(90)===-1 && parents.indexOf($gameParty.burnAuth)===-1);
};
$d$.tbl=new Set([13,157,159,173,55]); // 13:forest 157:sky 159:noob 173:zone1 176:拉起封鎖線-遊樂場
$pppp$.canBurned_auth=function(parents){
	if($gameParty.burnrange===404) return true;
	return this.canEdited_auth(parents);
};
$pppp$.canBurned=function(){
	// 活著嗎
	if(this._erased) return false;
	let evtd=this.event(),meta=evtd.meta;
	// 是可燒物件/部位
	if(!meta.burnable) return false;
	// by parent
	if(meta.isOnLand&&evtd.isChild&&$gameMap._events[this.parentId]) return $gameMap._events[this.parentId].canBurned();
	// 開掛
	if($gameParty.burnrange===404) return true; // 404
	let parents=$gameMap.parents();
	// 火力
	if($gameParty.burnLvOutput(parents)<Number(meta.burnlv)) return false; // Number<String => Number<Number(String)
	// 權限
	return this.canBurned_auth(parents);
};
$pppp$.canSlashed_auth=function(parents){
	if($gameParty.slashrange===404) return true;
	return this.canEdited_auth(parents);
};
$pppp$.canSlashed=function(){
	// 活著嗎
	if(this._erased) return false;
	let evtd=this.event(),meta=evtd.meta;
	// 是可燒物件/部位
	if(!meta.burnable) return false;
	// by parent
	if(meta.isOnLand&&evtd.isChild&&$gameMap._events[this.parentId]) return $gameMap._events[this.parentId].canSlashed();
	// 開掛
	if($gameParty.slashrange===404) return true; // 404
	let parents=$gameMap.parents();
	// 權限
	return this.canSlashed_auth(parents);
};
$pppp$.updateSelfMovement_cond=function(forced){
	return (forced || 
		!this._locked && 
		(this.longDistDetection||this.isNearTheScreen()) &&
		this.checkStop(this.stopCountThreshold())
	);
};
$pppp$.updateSelfMovement=function(forced){
	switch(this._moveType){
	case 1:
		if(this.updateSelfMovement_cond(forced)) this.moveTypeRandom();
		break;
	case 2:
		if(this.updateSelfMovement_cond(forced)) this.moveTypeTowardPlayer();
		break;
	case 3:
		if(this.updateSelfMovement_cond(forced)) this.moveTypeCustom();
		break;
	}
};
$pppp$.getText=function(){
	const data=this.getData();
	return data&&data.txts[this._pageIndex];
};
$pppp$.setActorAvatar=function(actorId_or_actor,opt){
	if(!actorId_or_actor) return;
	const a=actorId_or_actor.constructor===Game_Actor?actorId_or_actor:$gameActors.actor(actorId_or_actor);
	if(!a) return;
	const color=opt.color||a._getColorEdt();
	const scale=opt.scale||a._getScaleEdt();
	
	this._tileId=0;
	this._characterName  =a._characterName;
	this._characterIndex =a._characterIndex;
	this._color=color;
	this._scale=scale;
	this._actorAvatar=a._actorId;
	if(a.isDeathStateAffected()){
		this._dmg=1;
		if(!this._ref_mvr){
			this._ref_mvr=this._moveRoute;
			this._ref_mvi=this._moveRouteIndex;
			this._moveRoute=0;
			this._moveRouteIndex=0;
		}
	}else{
		this._dmg=0;
		if(this._ref_mvr){
			this._moveRoute=this._ref_mvr;
			this._moveRouteIndex=this._ref_mvi;
			this._ref_mvr=0;
		}
	}
};
$pppp$=$aaaa$=undef; // END Game_Event

// - switches
$aaaa$=Game_Switches;
$pppp$=$aaaa$.prototype;
$pppp$.setValue=function f(switchId,value,noUpdate){
	if(switchId>=0 && switchId<$dataSystem.switches.length){
		this._data[switchId]=(!value)^1;
		if(!noUpdate) this.onChange();
	}
};

// - vars
$aaaa$=Game_Variables;
$pppp$=$aaaa$.prototype;
$pppp$.setValue=function f(varId,val){
	let strt=$gameTemp.gameVarTrimStrt^=0;
	if(strt<varId){
		for(;strt!==varId;++strt) if(!this._data[strt] && this._data[strt]!=='') this._data[strt]^=0;
		$gameTemp.gameVarTrimStrt=varId;
	}
	if(0<varId){
		if(typeof val === 'number') val^=0;
		this._data[varId] = val;
		this.onChange();
	}
};
$pppp$=$aaaa$=undef;

// - item
$aaaa$=Game_Item;
$pppp$=$aaaa$.prototype;
Object.defineProperties($aaaa$.prototype,{
	_dataClass:{get:function(){ return this._dc; },set:function(rhs){
		return this._dc=rhs;
	},configurable:false},
	_itemId:{get:function(){ return this._id; },set:function(rhs){
		return this._id=rhs;
	},configurable:false},
});
$pppp$._deleteOldDataMember=function(){
	if(this._id===undefined){
		const dc=this._dataClass,id=this._itemId;
		delete this._dataClass;
		delete this._itemId;
		this._dc=dc;
		this._id=id;
	}
};
$pppp$.object=function(){
	switch(this._dataClass){
	default: return null;
	case 'skill':
		return $dataSkills[this._itemId];
	break;
	case 'item':
		return $dataItems[this._itemId];
	break;
	case 'weapon':
		return $dataWeapons[this._itemId];
	break;
	case 'armor':
		return $dataArmors[this._itemId];
	break;
	}
};
$d$=$pppp$.setObject=function f(item){
	if(!item) this._itemId=0;
	else{
		this._dataClass=f.tbl[item.itemType]||'';
		this._itemId=item.id;
	}
};
$d$.tbl={a:'armor',i:'item',s:'skill',w:'weapon',};
$pppp$=$aaaa$=undef;

// - action
$aaaa$=Game_Action;
$pppp$=$aaaa$.prototype;
$aaaa$.currMaxEnum=50;
$aaaa$.addEnum=objs._addEnum;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(subject,forcing){
	f.ori.call(this,subject,forcing);
	this.meta={};
}; $d$.ori=$r$;
$d$=$pppp$.toMotion=function f(){
	const item=this._item;
	switch(item._dataClass){
	case 'skill':{
		let rtv=f.tbl.get(item._itemId);
		if(!rtv){
			let tmp=$dataSkills[item._itemId];
			if(tmp) rtv=($dataSystem.magicSkills.contains(tmp.stypeId))?'spell':'skill';
		}
		return rtv;
	}
	case 'item': return $dataItems[item._itemId]&&'item';
	}
	return undefined;
};
$d$.tbl=new Map([
	[2,'guard'],
	[3,'spaceout'],
]);
$pppp$.setSpaceout=function(){
	this.setSkill(this.subject().spaceoutSkillId());
};
$pppp$.setSkill=function(skillId){
	let subject;
	if(BattleManager._isGuardWaiting){
		const now=this.item(); subject=this.subject();
		const guardId=subject&&subject.guardSkillId();
		if(subject){
			const guardId=subject.guardSkillId();
			if(now){
				if(now===$dataSkills[skillId]){
					const n=BattleManager._isGuardWaiting.get(subject);
					if(n) BattleManager._isGuardWaiting.set(subject,n-1);
				}
				
				if(this.isMagicSkill()){
					const n=BattleManager._isChanting.get(subject);
					if(n) BattleManager._isChanting.set(subject,n-1);
				}
			}
		
			if(guardId===skillId){
				const n=BattleManager._isGuardWaiting.get(subject)|0;
				BattleManager._isGuardWaiting.set(subject,n+1);
			}
		}
	}
	this._item.setObject($dataSkills[skillId]);
	
	if(subject && this.isMagicSkill()){
		const n=BattleManager._isChanting.get(subject)|0;
		BattleManager._isChanting.set(subject,n+1);
	}
};
$d$=$pppp$.needsSelection=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([1,7,9]);
$pppp$.isGuard=function(subject){
	return this.item() === $dataSkills[(subject||this.subject()).guardSkillId()];
};
$pppp$.isSpaceout=function(subject){
	return this.item() === $dataSkills[(subject||this.subject()).spaceoutSkillId()];
};
$pppp$.decideRandomTarget=function(){
	let target;
	switch(this.item().scope){
	case 9:
	case 10: // this.isForDeadFriend
		target = this.friendsUnit().randomDeadTarget();
	break;
	case 7:
	case 8:
	case 11: // this.isForFriend
		target = this.friendsUnit().randomTarget();
	break;
	case 12: // this.isForAllFriend
		target = this.friendsUnit().members().rnd();
	break;
	default: // otherwise
		target = this.opponentsUnit().randomTarget();
	}
	if(target) this._targetIndex = target.index();
	else this.clear();
};
$pppp$.speed=function(){
	//let agi=this.subject().agi;
	let speed=this.subject().agi; // + Math.randomInt(Math.floor(5 + agi / 4)); // edit: fixed speed
	if(this.item()){
		speed+=this.item().speed;
	}else speed=Infinity; // empty action does not count
	if(this.isAttack()){
		speed+=this.subject().attackSpeed();
	}
	return speed;
};
$d$=$pppp$.isKindOfAttack=function f(){ // is a type of normal attack. show weapon animation
	// and add repeat times
	if(this.isAttack()) return true;
	else{
		const item=this.item();
		return item&&item.effects.some(f.forEach);
	}
};
$d$.forEach=e=>e.code===Game_Action.EFFECT_ADD_STATE&&e.dataId===0; // state 0 === attack state
$pppp$.numRepeats=function f(){
	const item=this.item(),subject=this.subject();
	let repeats=item.repeats;
	// (this.isAttack())
	if(this.isKindOfAttack()) repeats += subject.attackTimesAdd();
	if(item.itemType!=='i') repeats*=subject.attackTimesMul();
	return ~~repeats;
};
$pppp$.repeatTargets=function(targets){ // reverse order
	const repeatedTargets = [];
	let j=this.numRepeats(); if(j>1e15){
		let cnt=0,nv=[j%1e15];
		for(let t=j;t>=1e15;++cnt){
			t=Math.floow(t/1e15);
			nv.push(t%1e15);
		}
		let rtv=[];
		while(nv.length){
			const curr=rtv.slice();
			for(let x=1e15;x-->0;) rtv=rtv.concat(curr);
			for(let x=nv.pop();x-->0;) rtv=rtv.concat(curr);
		}
		return rtv;
	}else for(let szi=targets.length;j-->0;) for(let i=szi;i--;) targets[i]&&repeatedTargets.push(targets[i]);
	return repeatedTargets;
};
$pppp$.makeTargets=function(dontTestConfused,toWrongTarget){
	let targets,s=this.item().scope;
	if(!dontTestConfused && !this._forcing && s!==1 && this.subject().isConfused()) targets = [this.confusionTarget()];
	else switch(s){
	case 1:
	case 2:
	case 3:
	case 4:
	case 5:
	case 6: // this.isForOpponent
		targets = toWrongTarget ? this.targetsForFriends() : this.targetsForOpponents();
	break;
	case 7:
	case 8:
	case 9:
	case 10:
	case 11:
	case 12: { // this.isForFriend
		const s=this.subject();
		targets = toWrongTarget ? this.targetsForOpponents() : this.targetsForFriends();
	}break;
	case 13: { // forBattler:alive
		const s=this.subject();
		const o=this.opponentsUnit().aliveMembers();
		const f=this.friendsUnit().aliveMembers().filter(x=>x!==s);
		const i=s.isAlive();
		if(i && this.item().subjectFirst) targets=[s].concat(o).concat(f);
		else{
			targets=o.concat(f);
			if(i) targets.push(s);
		}
	}break;
	case 14: { // forBattler:dead
		const s=this.subject();
		const o=this.opponentsUnit().deadMembers();
		const f=this.friendsUnit().deadMembers().filter(x=>x!==s);
		const i=s.isDead();
		if(i && this.item().subjectFirst) targets=[s].concat(o).concat(f);
		else{
			targets=o.concat(f);
			if(i) targets.push(s);
		}
	}break;
	case 15: { // forBattler:all
		const s=this.subject();
		const o=this.opponentsUnit().members();
		const f=this.friendsUnit().members().filter(x=>x!==s);
		if(this.item().subjectFirst) targets=[s].concat(o).concat(f);
		else{
			targets=o.concat(f);
			targets.push(s);
		}
	}break;
	}
	return this.repeatTargets(targets||[]);
};
$pppp$.confusionTarget=function(){
	switch (this.subject().confusionLevel()) {
	// case 1: return this.opponentsUnit().randomTarget(); // remain same , but not user input
	case 2: // opposite with chance 1/2
		return this.makeTargets(true,Math.random()<0.5);
	default: // 3: attack ally ; 4: cannot move
		return this.makeTargets(true,true);
	}
};
$pppp$.targetsForOpponents=function(){ // scope: [1..6]
	const unit = this.opponentsUnit();
	switch(this.item().scope){
	case 1: return [ this._targetIndex<0 ? unit.randomTarget() : unit.smoothTarget(this._targetIndex) ] ; // this.isForOne
	case 2: return unit.aliveMembers();
	case 3:
	case 4:
	case 5:
	case 6:{ // this.isForRandom
		const rtv=[];
		for(let i=0,sz=this.numTargets();i!==sz;++i) rtv.push(unit.randomTarget());
		return rtv;
	}break;
	}
	return [];
};
$pppp$.targetsForFriends=function(){ // scope: [7..12]
	const unit = this.friendsUnit();
	switch(this.item().scope){
	case  7: return [ (this._targetIndex < 0) ? unit.randomTarget() : unit.smoothTarget(this._targetIndex) ]; // isForFriend (1)
	case  8: return unit.aliveMembers(); // isForFriend (all)
	case  9: return [unit.smoothDeadTarget(this._targetIndex)]; // this.isForDeadFriend (1)
	case 10: return unit.deadMembers(); // this.isForDeadFriend (all)
	case 11: return [this.subject()]; // this.isForUser
	case 12: return unit.members(); // this.isForAllFriends
	}
	return [];
};
$pppp$.targetsForBattler=function(){ // scope: [13..15]
	const s=this.subject(),t=x=>s!==x;
	const ou=this.opponentsUnit();
	const fu=this.friendsUnit();
	switch(this.item().scope){
	case 13: { // alive
		const o=ou.aliveMembers();
		const f=fu.aliveMembers().filter(t);
		const i=s.isAlive();
		if(i && this.item().subjectFirst) return [s].concat(o).concat(f);
		else{
			const rtv=o.concat(f);
			if(i) rtv.push(s);
			return rtv;
		}
	}break;
	case 14: { // dead
		const o=ou.deadMembers();
		const f=fu.deadMembers().filter(t);
		const i=s.isDead();
		if(i && this.item().subjectFirst) return [s].concat(o).concat(f);
		else{
			const rtv=o.concat(f);
			if(i) rtv.push(s);
			return rtv;
		}
	}break;
	case 15: { // all
		const s=this.subject();
		const o=ou.members();
		const f=fu.members().filter(t);
		if(this.item().subjectFirst) return [s].concat(o).concat(f);
		else{
			const rtv=o.concat(f);
			rtv.push(s);
			return rtv;
		}
	}break;
	}
	return [];
};
$pppp$.itemTargetCandidates = function() {
	if(!this.isValid()) return [];
	switch(this.item().scope){
	case 1:
	case 2:
	case 3:
	case 4:
	case 5:
	case 6: // this.isForOpponent
		return this.opponentsUnit().aliveMembers();
	break;
	case 9:
	case 10:
		return this.friendsUnit().deadMembers();
	break;
	case 11: // this.isForUser
		return [this.subject()];
	break;
	case 12: // this.isForAllFriends
		return this.friendsUnit().members();
	break;
	default:
		return this.friendsUnit().aliveMembers();
	break;
	}
};
$r$=$pppp$.testApply;
$d$=$pppp$.testApply=function f(target){
	if(!target) return false;
	const item=this.item();
	if(!item) return false;
	const meta=item.meta;
	const filter=item.filter||(item.filter=(meta.filter=meta.filter)&&objs._getObj(meta.filter));
	//const filter=item.filter||(item.filter=(meta.filter=meta.filter)&&eval('objs.'+meta.filter));
	if(filter) return filter(target,this.subject());
	return (
		( this.isForAllFriend() || this.isForDeadFriend() === target.isDead() ) &&
		(
			(meta.stomach && target.stp!==undefined && target.stp<target.mstp) || // inline stp cond.
			$gameParty.inBattle() || this.isForOpponent() ||
			(this.isHpRecover() && target.hp < target.mhp) ||
			(this.isMpRecover() && target.mp < target.mmp) ||
			this.hasItemAnyValidEffects(target)
		)
	);
}; $d$.ori=$r$;
$d$=$pppp$.testItemEffect=function f(target,effect){
	const func=f.tbl[effect.code];
	return !func||func.call(this,target,effect); // default true
};
$d$.tbl=[]; { $d$.tbl.length=52; const act=$aaaa$;
$d$.tbl[act.EFFECT_RECOVER_HP]=function(target,effect){
        return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
};
$d$.tbl[act.EFFECT_RECOVER_MP]=function(target,effect){
        return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
};
$d$.tbl[act.EFFECT_ADD_STATE]=function(target,effect){
        return !(!effect.isSwitch&&target.isStateAffected(effect.dataId));
};
$d$.tbl[act.EFFECT_REMOVE_STATE]=function(target,effect){
        return target.isStateAffected(effect.dataId);
};
$d$.tbl[act.EFFECT_ADD_BUFF]=function(target,effect){
        return !target.isMaxBuffAffected(effect.dataId);
};
$d$.tbl[act.EFFECT_ADD_DEBUFF]=function(target,effect){
        return !target.isMaxDebuffAffected(effect.dataId);
};
$d$.tbl[act.EFFECT_REMOVE_BUFF]=function(target,effect){
        return target.isBuffAffected(effect.dataId);
};
$d$.tbl[act.EFFECT_REMOVE_DEBUFF]=function(target,effect){
        return target.isDebuffAffected(effect.dataId);
};
$d$.tbl[act.EFFECT_LEARN_SKILL]=function(target,effect){
        return target.isActor() && !target.isLearnedSkill(effect.dataId);
};
} // Game_Action.prototype.testItemEffect.tbl
$pppp$.getSelfItemObj=function(obj){
	const l=(obj||this.item()).meta.self;
	if(l){ const s=l.split(','); switch(s[0]){
	case 'i': return $dataItems  [s[1]];
	case 's': return $dataSkills [s[1]];
	} return; }
	return false;
};
$pppp$.canForSelf=obj=>!!obj;
$d$=$pppp$.apply=function f(target){
	const result = target.result() , subject = this.subject();
	let tmp=this; if(subject===target){
		const slf=this.getSelfItemObj();
		if(slf!==false){
			if(!this.canForSelf(slf)){
				subject.clearResult();
				result.clear();
				return;
			}
			tmp=new Game_Action(subject);
			tmp.setItemObject(slf);
		}
	}
	const act=tmp;
	subject.clearResult();
	result.clear();
	result.used = act.testApply(target);
	result.physical = act.isPhysical();
	result.drain = act.isDrain();
	if( result.missed = (result.used && Math.random() >= act.itemHit(target)) ) return f.toQ(result,target); // if(result.isHit())
	if( result.evaded = (!result.missed && Math.random() < act.itemEva(target)) ) return f.toQ(result,target); // if(result.isHit())
	// if(result.isHit())
	{
		const item=act.item();
		if(item.damage.type>0){
			result.critical = (Math.random() < act.itemCri(target));
			const value = act.makeDamageValue(target, result.critical);
			act.executeDamage(target, value);
		}
		item.effects.forEach(eff=>act.applyItemEffect(target, eff));
		act.applyItemUserEffect(target);
	}
	
	f.toQ(result,target);
};
$d$.toQ=(res,trgt)=>{
	if(!res.used) return;
	// prepare for displaying this info
	trgt.pushActResQ(res);
};
$pppp$.makeDamageValue=function(target,isCri){
	const item = this.item() , baseValue = this.evalDamageFormula(target);
	// calc. value based on target's ele. def. and what item's elements are
	let value = baseValue * this.calcElementRate(target) , decDmg=0;
	switch(item.hitType){
	default:
	case Game_Action.HITTYPE_CERTAIN:
	break;
	case Game_Action.HITTYPE_PHYSICAL: {
		value *= target.pdr;
		decDmg+=target.decreaseDamageP();
	}break;
	case Game_Action.HITTYPE_MAGICAL: {
		value *= target.mdr;
		decDmg+=target.decreaseDamageM();
	}break;
	}
	if(baseValue < 0){
		value *= target.rec;
	}
	if(isCri){
		value = this.applyCritical(value);
	}
	value = this.applyVariance(value, item.damage.variance);
	value = this.applyGuard(value, target);
	value-=decDmg;
	return ~~value;
};
$d$=$pppp$.evalDamageFormula=function f(target){
	try{
		const item = this.item(); if(!item) return 0;
		const dmg=item.damage;
		if(!dmg.formula) return 0;
		//let a = this.subject() , b = target;
		
		if(dmg.formula.constructor!==Function){
			f.tbl[0][3]="return "+(dmg.formula_txt=dmg.formula);
			dmg.formula=Function.apply(null,f.tbl[0]);
		}
		let value = dmg.formula.call(none,undefined,this.subject(),target);
		value*=value>0;
		if(f.tbl[1].has(dmg.type)) value=-value;
		return value||0;
	}catch(e){ return 0; } // only handling function creation failure
};
$d$.tbl=[
	['window','a','b',], // def func args
	new Set([3,4,]), // recover type
];
$pppp$.elementsMaxRate=function(target,map_ele){
	if(map_ele.size){
		let rtv=0;
		map_ele.forEach((v,k)=>{
			const r=target.elementRate(k);
			if(rtv<r) rtv=r;
		});
		return rtv;
	}else return 1;
};
$pppp$.applyGuard=function(damage,target){
	const r=damage>0 && target.isGuard() && 2*target.grd;
	return r>1?damage/r:damage;
};
$pppp$.executeHpDamage = function(target, value) {
	if(this.isDrain() && target.hp<value) value=target.hp;
	this.makeSuccess(target);
	target.noRefresh=true;
	const mpsubst=value>0 && target.MPSubstituteRate();
	if(mpsubst){
		let mpDmg=~~(value*mpsubst); if(!(mpDmg<=target.mp)) mpDmg=target.mp;
		const hpDmg=value-mpDmg;
		if(mpDmg) this.executeMpDamage(target,mpDmg);
		target.gainHp(-hpDmg);
	}else target.gainHp(-value);
	if(value > 0){
		target.onDamage(value);
	}
	target.noRefresh=0;
	if(value) target.refresh();
	this.gainDrainedHp(value);
};
$d$=$pppp$.applyItemEffect=function f(target,effect){
	const func=f.tbl[effect.code];
	if(func) func.call(this,target,effect);
};
$d$.tbl=[]; { $d$.tbl.length=52; const act=$aaaa$;
$d$.tbl[act.EFFECT_RECOVER_HP]=function(target,effect){
	this.itemEffectRecoverHp(target, effect);
};
$d$.tbl[act.EFFECT_RECOVER_MP]=function(target,effect){
	this.itemEffectRecoverMp(target, effect);
};
$d$.tbl[act.EFFECT_GAIN_TP]=function(target,effect){
	this.itemEffectGainTp(target, effect);
};
$d$.tbl[act.EFFECT_ADD_STATE]=function(target,effect){
	this.itemEffectAddState(target, effect);
};
$d$.tbl[act.EFFECT_REMOVE_STATE]=function(target,effect){
	this.itemEffectRemoveState(target, effect);
};
$d$.tbl[act.EFFECT_ADD_BUFF]=function(target,effect){
	this.itemEffectAddBuff(target, effect);
};
$d$.tbl[act.EFFECT_ADD_DEBUFF]=function(target,effect){
	this.itemEffectAddDebuff(target, effect);
};
$d$.tbl[act.EFFECT_REMOVE_BUFF]=function(target,effect){
	this.itemEffectRemoveBuff(target, effect);
};
$d$.tbl[act.EFFECT_REMOVE_DEBUFF]=function(target,effect){
	this.itemEffectRemoveDebuff(target, effect);
};
$d$.tbl[act.EFFECT_SPECIAL]=function(target,effect){
	this.itemEffectSpecial(target, effect);
};
$d$.tbl[act.EFFECT_GROW]=function(target,effect){
	this.itemEffectGrow(target, effect);
};
$d$.tbl[act.EFFECT_LEARN_SKILL]=function(target,effect){
	this.itemEffectLearnSkill(target, effect);
};
$d$.tbl[act.EFFECT_COMMON_EVENT]=function(target,effect){
	this.itemEffectCommonEvent(target, effect);
};
$aaaa$.addEnum("CUSTOM_EFFECT_GAIN_STP",$d$.tbl,function(target,effect){
	if(effect.stomach){
		target.gainStp(effect.stomach);
		this.makeSuccess(target);
	}
});
} // Game_Action.prototype.applyItemEffect.tbl
$pppp$.itemEffectAddNormalState=function(target, effect){
	let chance = effect.value1;
	if(!this.isCertainHit()){
		chance *= target.stateRate(effect.dataId);
		chance *= this.lukEffectRate(target);
	}
	if(Math.random() < chance){
		if(effect.isSwitch){
			if(!this.meta) this.meta={};
			if(!this.meta._switchApplied){
				this.meta._switchApplied=true;
				if( target.isStateAffected(effect.dataId) ) target.removeState(effect.dataId);
				else target.addState(effect.dataId);
			}
		}else target.addState(effect.dataId);
		this.makeSuccess(target);
	}
};
$k$='applyGlobal';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	//debug.log('Game_Action.prototype.applyGlobal');
	const dataItem=this.item();
	if(dataItem.effects) dataItem.effects.forEach(ef=>ef.code===Game_Action.EFFECT_COMMON_EVENT&&$gameTemp.reserveCommonEvent(ef.dataId)); // f.ori.call(this);
	const item=this._item,id=item._itemId.toId(),meta=dataItem.meta;
	switch(item._dataClass){
		default: break;
		case 'armor': {
		}break;
		case 'item': { let qlist=rpgquests.list; //meta=$dataItems[id].meta;
			if(meta.quest&&qlist[meta.ref]) rpgquests.func.showBoard(qlist[meta.ref]);
		}break;
		case 'skill': { let list=rpgskills.list; //meta=$dataSkills[id].meta;
			if(list[meta.ref]) list[meta.ref](this);
		}break;
		case 'weapon': {
		}break;
	}
	{
	//if(meta&&meta.func) eval(meta.func.replace(/\(|\)/g,''))(this);
	//if(meta&&meta.func) objs._getObj.call(none,meta.func.replace(/\(|\)/g,''))(this);
	const func=dataItem.func||( dataItem.func=meta&&(meta.func=meta.func) && objs._getObj.call(none,meta.func.replace(/\(|\)/g,'')) );
	//const func=dataItem.func||( dataItem.func=meta&&(meta.func=meta.func) && eval('objs.'+meta.func.replace(/\(|\)/g,'')) );
	if(func) func(this);
	//if(meta&&meta.code) objs._doFlow.call(this,meta.code);
	const code=dataItem.code||( dataItem.code=meta&&(meta.code=meta.code) && objs._doFlow.call(this,meta.code) );
	if(code) code(this);
	}
}; $d$.ori=$r$;
$pppp$.itemEffectAddAttackState=function(target, effect){
	this.subject().attackStates().forEach((_,stateId)=>{
		let chance = effect.value1;
		chance *= target.stateRate(stateId);
		chance *= this.subject().attackStatesRate(stateId);
		chance *= this.lukEffectRate(target);
		if(Math.random() < chance){
			target.addState(stateId);
			this.makeSuccess(target);
		}
	});
};
$pppp$.subject=function(){
	if(this._subjectActorId.toId() > 0) return $gameActors.actor(this._subjectActorId);
	else return $gameTroop.members()[this._subjectEnemyIndex];
};
$pppp$=$aaaa$=undef;

// - actres
$aaaa$=Game_ActionResult;
$pppp$=$aaaa$.prototype;
$pppp$.initialize = function() {
	this.addedStates = [];
	this.removedStates = [];
	this.addedBuffs = [];
	this.addedDebuffs = [];
	this.removedBuffs = [];
	this.clear();
};
$pppp$.clear=function(){
	this.used = false;
	this.missed = false;
	this.evaded = false;
	this.physical = false;
	this.drain = false;
	this.critical = false;
	this.success = false;
	this.hpAffected = false;
	this.stpDamage = this.tpDamage = this.mpDamage = this.hpDamage = 0;
	this.removedBuffs.length = this.addedDebuffs.length = this.addedBuffs.length = this.removedStates.length = this.addedStates.length = 0;
};
$d$=$pppp$.copy=function f(){
	const rtv=new this.constructor();
	for(let x=0,arr=f.tbl.arr;x!==arr.length;++x) rtv[arr[x]] = this[arr[x]].slice();
	for(let x=0,arr=f.tbl.val;x!==arr.length;++x) rtv[arr[x]] = this[arr[x]];
	return rtv;
};
$d$.tbl={
	arr:['addedStates','removedStates','addedBuffs','addedDebuffs','removedBuffs',],
	val:['used','missed','evaded','physical','drain','critical','success','hpAffected','hpDamage','mpDamage','tpDamage','stpDamage',],
};
Object.defineProperties($aaaa$.prototype,{
	addedBuffs:{ get:function(){return this.addBuf;},
		set:function(rhs){return this.addBuf=rhs;},
	configurable:false},
	addedDebuffs:{ get:function(){return this.addDebuf;},
		set:function(rhs){return this.addDebuf=rhs;},
	configurable:false},
	addedStates:{ get:function(){return this.addStat;},
		set:function(rhs){return this.addStat=rhs;},
	configurable:false},
	critical:{ get:function(){return this.cri;},
		set:function(rhs){return this.cri=rhs&&1||0;},
	configurable:false},
	hpDamage:{ get:function(){return this.hpDmg;},
		set:function(rhs){return this.hpDmg=rhs;},
	configurable:false},
	mpDamage:{ get:function(){return this.mpDmg;},
		set:function(rhs){return this.mpDmg=rhs;},
	configurable:false},
	physical:{ get:function(){return this.phy;},
		set:function(rhs){return this.phy=rhs&&1||0;}, // whatif half?
	configurable:false},
	removedBuffs:{ get:function(){return this.rmBuf;},
		set:function(rhs){return this.rmBuf=rhs;},
	configurable:false},
	removedStates:{ get:function(){return this.rmStat;},
		set:function(rhs){return this.rmStat=rhs;},
	configurable:false},
	stpDamage:{ get:function(){return this.stpDmg;},
		set:function(rhs){return this.stpDmg=rhs;},
	configurable:false},
	success:{ get:function(){return this.succ;},
		set:function(rhs){return this.succ=rhs&&1||0;},
	configurable:false},
	tpDamage:{ get:function(){return this.tpDmg;},
		set:function(rhs){return this.tpDmg=rhs;},
	configurable:false},
});
$pppp$._deleteOldDataMember=function(){
	if(this.cri===undefined){
		[
			['','addedBuffs'],
			['','addedDebuffs'],
			['','addedStates'],
			['','critical'],
			['','hpDamage'],
			['','mpDamage'],
			['','physical'],
			['','removedBuffs'],
			['','removedStates'],
			['','tpDamage'],
			['','success'],
			['','stpDamage'],
		].forEach(x=>{
			const tmp=this[x[1]];
			delete this[x[1]];
			this[x[1]]=tmp;
		});
	}
};
$pppp$=$aaaa$=undef;

// - actor
$aaaa$=Game_Actor;
$pppp$=$aaaa$.prototype;
$pppp$.getData=function(){
	return this.actor();
};
$r$=Game_Character.prototype;
$pppp$._getColorEdt=$r$._getColorEdt;
$pppp$._getScaleEdt=$r$._getScaleEdt;
$pppp$._getAnchoryEdt=$r$._getAnchoryEdt;
Object.defineProperties($aaaa$.prototype,{
	_actionInputIndex:{ get:function(){return this._actInIdx;},
		set:function(rhs){return this._actInIdx=rhs;},
	configurable:false},
	_actionState:{ get:function(){return this._actStat;},
		set:function(rhs){return this._actStat=rhs;},
	configurable:false},
	_actions:{ get:function(){return this._acts;},
		set:function(rhs){return this._acts=rhs;},
	configurable:false},
	_animations:{ get:function(){return this._anis;},
		set:function(rhs){return this._anis=rhs;},
	configurable:false},
	_battlerName:{ get:function(){return this._btlrN;},
		set:function(rhs){return this._btlrN=rhs;},
	configurable:false},
	_buffTurns:{ get:function(){return this._bufTn;},
		set:function(rhs){return this._bufTn=rhs;},
	configurable:false},
	_characterIndex:{ get:function(){return this._chrIdx;},
		set:function(rhs){return this._chrIdx=rhs;},
	configurable:false},
	_characterName:{ get:function(){return this._chrN;},
		set:function(rhs){return this._chrN=rhs;},
	configurable:false},
	_classId:{ get:function(){return this._cid;},
		set:function(rhs){return this._cid=rhs;},
	configurable:false},
	_damagePopup:{ get:function(){return this._dmgPop;},
		set:function(rhs){return this._dmgPop=rhs||0;},
	configurable:false},
	_effectType:{ get:function(){return this._effT;},
		set:function(rhs){return this._effT=rhs;},
	configurable:false},
	_faceIndex:{ get:function(){return this._fIdx;},
		set:function(rhs){return this._fIdx=rhs;},
	configurable:false},
	_faceName:{ get:function(){return this._fN;},
		set:function(rhs){return this._fN=rhs;},
	configurable:false},
	_hidden:{ get:function(){return this._hid;},
		set:function(rhs){return this._hid=rhs||0;},
	configurable:false},
	_lastBattleSkill:{ get:function(){return this._lstBtlSk;},
		set:function(rhs){return this._lstBtlSk=rhs;},
	configurable:false},
	_lastCommandSymbol:{ get:function(){return this._lstCmdSym;},
		set:function(rhs){return this._lstCmdSym=rhs;},
	configurable:false},
	_lastMenuSkill:{ get:function(){return this._lstMnSk;},
		set:function(rhs){return this._lstMnSk=rhs;},
	configurable:false},
	_lastTargetIndex:{ get:function(){return this._lstTrgIdx;},
		set:function(rhs){return this._lstTrgIdx=rhs;},
	configurable:false},
	_motionRefresh:{ get:function(){return this._motRfr;},
		set:function(rhs){return this._motRfr=rhs||0;},
	configurable:false},
	_motionType:{ get:function(){return this._motT;},
		set:function(rhs){return this._motT=rhs;},
	configurable:false},
	_nickname:{ get:function(){return this._nick;},
		set:function(rhs){return this._nick=rhs;},
	configurable:false},
	_paramPlus:{ get:function(){return this._pp;},
		set:function(rhs){return this._pp=rhs;},
	configurable:false},
	_result:{ get:function(){return this._res;},
		set:function(rhs){return this._res=rhs;},
	configurable:false},
	_stateSteps:{ get:function(){return this._statSt;},
		set:function(rhs){return this._statSt=rhs;},
	configurable:false},
	_stateTurns:{ get:function(){return this._statTn;},
		set:function(rhs){return this._statTn=rhs;},
	configurable:false},
	_weaponImageId:{ get:function(){return this._wImgId;},
		set:function(rhs){return this._wImgId=rhs;},
	configurable:false},
	_weapon2ImageId:{ get:function(){return this._w2ImgId;},
		set:function(rhs){return this._w2ImgId=rhs;},
	configurable:false},
});
$pppp$._deleteOldDataMember=function(){
	if(this._pp===undefined){
		[ // 'arr[.][0]' are not used
			['_actInIdx','_actionInputIndex'],
			['_actStat','_actionState'],
			['_acts','_actions'],
			['_anis','_animations'],
			['_btlrN','_battlerName'],
			['_bufTn','_buffTurns'],
			['_chrIdx','_characterIndex'],
			['_chrN','_characterName'],
			['_cid','_classId'],
			['_dmgPop','_damagePopup'],
			['_effT','_effectType'],
			['_faceIdx','_faceIndex'],
			['_faceN','_faceName'],
			['_hid','_hidden'],
			['_lstBtlSk','_lastBattleSkill'],
			['_lstCmdSym','_lastCommandSymbol'],
			['_lstMnSk','_lastMenuSkill'],
			['_lstTrgIdx','_lastTargetIndex'],
			['_motRfr','_motionRefresh'],
			['_motT','_motionType'],
			['_nick','_nickname'],
			['_pp','_paramPlus'],
			['_res','_result'],
			['_statSt','_stateSteps'],
			['_statTn','_stateTurns'],
			['_wImgId','_weaponImageId'],
			['_w2ImgId','_weapon2ImageId'],
		].forEach(x=>{
			const tmp=this[x[1]];
			delete this[x[1]];
			this[x[1]]=tmp;
		});
		this._result._deleteOldDataMember();
	}
};
$pppp$._toSaveData=function(){
	[
		'_actions',
		'_animations',
	].forEach(key=>{
		const q=this[key];
		q.map(); if(q.length<2) q._data.length=2;
	});
	delete this.noRefresh;
};

$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(actorId){
	f.ori.call(this,actorId);
	this._plan=[];
	this._meta={};
	if(!this.getData().meta.noHunger&&objs.confs.useStp){
		this._stp=500;
	}
}; $d$.ori=$r$;
$pppp$.actor=function(){
	return $dataActors[this._actorId.toId()];
};
$pppp$.characterName = function() {
	//let ce=this._getColorEdt();
	return this._characterName; //+(ce?"?color="+ce:"");
};
$pppp$.faceName=function() { // seems only 'Game_Actor' has method 'faceName'
	const ce=this._getColorEdt();
	return this._faceName+(ce?"?color="+ce:"");
};
$pppp$._genFaceData=function(){
	const ce=this._getColorEdt();
	let args; if(ce) args={color:ce};
	const bm=ImageManager.loadCharacter(this._characterName,undefined,args);
	return [bm,
		(bm._isBigChr?0:(this._characterIndex&3)*bm._pw*3)+bm._pw,
		(this._characterIndex>>(bm._isBigChr<<2))*bm._ph,
		bm._pw,
		bm._ph,
	];
};
$pppp$.faceIndex=function(){
	return (!this._faceIndex && this.getData().meta.chrAsFace)?this._genFaceData():this._faceIndex;
};
$pppp$.expForLevel=function(level,class_){
	const c=class_||this.currentClass();
	if(!c.expTbl) c.expTbl=[];
	if(c.expTbl[level]!==undefined) return c.expTbl[level];
	const basis=c.expParams[0];
	const extra=c.expParams[1];
	const acc_a=c.expParams[2];
	const acc_b=c.expParams[3];
	
	const lvlv=level*level , lv_1=level-1;
	return c.expTbl[level]=~~(
		basis*(Math.pow(lv_1, 0.9+acc_a/250))*(lvlv+level)
		/(lvlv/50/acc_b+6)
		+lv_1*extra
		+0.5
	);
};
$pppp$.initImages=function(){
	let actor=this.actor();
	this._characterName = actor.characterName;
	this._characterIndex = actor.characterIndex;
	this._faceName = actor.faceName;
	this._faceIndex = actor.faceIndex;
	this._battlerName = actor.battlerName;
};
$pppp$.initEquips=function(equips){
	const slots=this.equipSlots();
	const maxSlots=slots.length,repeats=$dataSystem.equipTypes.meta.repeat;
	this._equips=[]; this._equips.length=maxSlots;
	for(let i=0;i!==maxSlots;++i){
		if(repeats[slots[i]]) this._equips[i]=[new Game_Item()];
		else this._equips[i]=new Game_Item();
	}
	for(let j=0;j!==equips.length;++j){
		if(j<maxSlots){
			if(repeats[slots[j]]){
				this._equips[j][0].setEquip(slots[j]===1,equips[j]);
				if(equips[j]) this._equips[j].push(new Game_Item());
			}else this._equips[j].setEquip(slots[j]===1,equips[j]);
		}
	}
	this._equips_delCache();
	this.releaseUnequippableItems(true);
	this.refresh();
};
$d$=$pppp$.changeExp=function f(exp, show){
	this._exp[this._classId] = Math.max(exp, 0);
	
	// clear last learned skills
	{ const tmp=this._skills_getCache(); if(tmp && tmp.pendLearns) tmp.pendLearns.length=0; }
	
	const lastLevel = this._level;
	while(!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) this.levelUp(objs.confs.noRestoreHpMp,true);
	while(this.currentExp()<this.currentLevelExp()) this.levelDown();
	if(this._level !== lastLevel){ if(this._level > lastLevel){
		if(0&&0)if(this.constructor===Game_Actor && SceneManager.isMap()){
			const id=this.actorId();
			if($gameTemp._pt_allMembers_idSet.has(id)){
				const idx=$gameParty._acs.indexOf(id);
				const c=(idx>0)?$gamePlayer._followers._data[idx-1]:$gamePlayer;
				if(c) c.requestAnimation(51);
			}
			
		} // slow
		const tmp=this._skills_getCache();
		const m=tmp&&tmp.pendLearns;
		if(m && m.length){
			if(show) this.displayLevelUp(m);
			m.length=0;
			this._skills_delCache_added();
			this._skills_updateCache();
		}
	} this.refresh(); }
};
$d$.tbl=[];
$pppp$.levelUp=function f(notRestoreHpMp,arrangeSkillsLater){
	const arr=this.currentClass().learnings.byLv.get(++this._level);
	if(arr){ arr.forEach(learning=>{
		this.learnSkill(learning.skillId,arrangeSkillsLater);
	}); }
	if(!notRestoreHpMp){
		this._hp=this.mhp;
		this._mp=this.mmp;
	}
};
$d$=$pppp$.displayLevelUp=function f(newSkills){
	let text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
	if($gameSystem._usr._lvUpMsg){
		$gameMessage.newPage();
		$gameMessage.add(text);
		newSkills.forEach(f.forEach[0]);
	}
	if($gameSystem._usr._lvUpHint){
		$gameMessage.popup(text,true);
		newSkills.forEach(f.forEach[1]);
	}
};
$d$.forEach=[
	id=>$gameMessage.add(TextManager.obtainSkill.format($dataSkills[id].name)),
	id=>$gameMessage.popup(TextManager.obtainSkill.format($dataSkills[id].name),true),
];
$pppp$.shouldDisplayLevelUp=()=>$gameSystem._usr&&($gameSystem._usr._lvUpMsg||$gameSystem._usr._lvUpHint)||false;
$pppp$.isLearnedSkill=function(skillId){
	return this._skills_getUpdatedCache().has(skillId);
};
$pppp$.hasSkill=function(skillId){
	return this.isLearnedSkill(skillId)||this.traitSet(Game_BattlerBase.TRAIT_SKILL_ADD).has(skillId);
};
$pppp$.changeClass=function(classId, keepExp){
	const oldCid=this._classId;
	if(classId===oldCid) return;
	this.clearCache();
	this.changeExp(this._exp[this._classId=classId] = keepExp&&this._exp[oldCid]||0, false);
	this.refresh();
};
$pppp$.changeLevel=function(level,show){
	if(level<1) level=1;
	else{
		let tmp=this.maxLevel();
		if(level>tmp) level=tmp;
	}
	this.changeExp(this.expForLevel(level), show);
};
$pppp$.setup=function(actorId){
	//debug.log('Game_Actor.prototype.setup');
	let tid=actorId.toId();
	let actor=$dataActors[tid];
	this._actorId=actorId;
	this._name = actor.name;
	this._nickname = actor.nickname;
	this._profile = actor.profile;
	this._classId = actor.classId;
	this._level = actor.initialLevel;
	this.initImages();
	this.initExp();
	this.initSkills();
	this.initEquips(actor.equips);
	this.clearParamPlus();
	this.recoverAll();
};
$pppp$.equipSlots=function f(){
	const rtv=[];
	for (let i=1,sz=Math.max($dataSystem.equipTypes.length,1);i!==sz;++i){
		rtv.push(i);
	}
	if(rtv.length >= 2 && this.isDualWield()){
		rtv[1]=1;
	}
	return rtv;
};
$d$=$pppp$._equips_delCache=function f(){
	$gameTemp.delCache(this,f.key);
};
$d$.key=Game_BattlerBase.CACHEKEY_EQUIP;
$d$=$pppp$._equips_getCache=function f(){
	return $gameTemp.getCache(this,f.key);
};
$d$.key=Game_BattlerBase.CACHEKEY_EQUIP;
$pppp$._equips_updateCache_item=(item,a,s,m)=>{
	const c=a.get(item);
	if(c===undefined) a.set(item,1);
	else a.set(item,c+1);
	s.byKey2_sum(item.tmapS);
	m.byKey2_mul(item.tmapP);
};
$d$=$pppp$._equips_updateCache=function f(){
	const rtv=this._equips.map(f.map);
	$gameTemp.updateCache(this,f.key,rtv);
	const a=rtv.a=new Map();
	const s=rtv.s=new Map() , m=rtv.m=new Map();
	for(let x=0;x!==rtv.length;++x){
		const tmp=rtv[x]; if(!tmp) continue;
		if(tmp.constructor===Array){ for(let z=0;z!==tmp.length;++z){ if(!tmp[z]) continue;
			this._equips_updateCache_item(tmp[z],a,s,m);
		} }else{
			this._equips_updateCache_item(tmp,a,s,m);
		}
	}
	return rtv;
};
$d$.key=Game_BattlerBase.CACHEKEY_EQUIP;
{
	const f=$d$.map=item=>item.constructor===Array?item.map(x=>f(x)):item.object();
}
$pppp$._equips_editCache_del=function(dataobj){
	if(!dataobj) return;
	const equips=this._equips_getCache();
	if(!equips) return;
	let tmp;
	
	// skills-old
	tmp=equips.s.get(Game_BattlerBase.TRAIT_SKILL_ADD);
	const skillAddedCnt=tmp&&tmp.size;
	
	if(dataobj.etypeId===1) equips.w=0;
	else equips.r=0;
	tmp=equips.a.get(dataobj)-1;
	if(tmp) equips.a.set(dataobj,tmp);
	else equips.a.delete(dataobj);
	equips.s.byKey2_del_sum(dataobj.tmapS);
	equips.m.byKey2_del_mul(dataobj.tmapP);
	
	// skills
	if(dataobj.tmapS.has(Game_BattlerBase.TRAIT_SKILL_ADD)){
		const tmp=equips.s.get(Game_BattlerBase.TRAIT_SKILL_ADD);
		if((tmp&&tmp.size)!==skillAddedCnt) this._skills_delCache_added();
	}
	
	// paramPlus
	if(equips.u!==undefined){
		const d=equips.u,s=dataobj.params;
		for(let x=0,xs=s.length;x!==xs;++x) if(d[x]!==undefined) d[x]-=s[x]; // only int
	}
	
	// delete overall
	this._overall_delCache();
};
$pppp$._equips_editCache_add=function(dataobj){
	if(!dataobj) return;
	const equips=this._equips_getCache();
	if(!equips) return;
	let tmp;
	
	// skills-old
	tmp=equips.s.get(Game_BattlerBase.TRAIT_SKILL_ADD);
	const skillAddedCnt=tmp&&tmp.size;
	
	if(dataobj.etypeId===1) equips.w=0;
	else equips.r=0;
	equips.a.set(dataobj,equips.a.get(dataobj)+1||1);
	equips.s.byKey2_sum(dataobj.tmapS);
	equips.m.byKey2_mul(dataobj.tmapP);
	
	// skills
	if(dataobj.tmapS.has(Game_BattlerBase.TRAIT_SKILL_ADD)){
		const tmp=equips.s.get(Game_BattlerBase.TRAIT_SKILL_ADD);
		if((tmp&&tmp.size)!==skillAddedCnt) this._skills_delCache_added();
	}
	
	// paramPlus
	if(equips.u!==undefined){
		const d=equips.u,s=dataobj.params;
		for(let x=0,xs=s.length;x!==xs;++x) if(d[x]!==undefined) d[x]+=s[x]; // only int so it's ok
	}
	
	// delete overall
	this._overall_delCache();
};
$pppp$._equips_slotChanged=function(lastSlots){
	const newSlots=this.equipSlots();
	const xs=lastSlots.length;
	if(xs!==newSlots.length) this._equips_delCache(); // I'm lazy LOL
	else{ for(let x=0;x!==xs;++x){
		if(newSlots[x]===lastSlots[x]) continue;
		const e=this._equips[x];
		if(e&&e.constructor===Array){
			for(let z=e.length;z--;){
				this.changeEquip(x,null,z,false); // addState will refresh
			}
		}else{
			this.changeEquip(x,null,~0,false); // addState will refresh
		}
	} }
	this._overall_delCache(); // clear cache for calling equipSlots
};
$pppp$.equips=function(refresh){ // called every time when a trait info is needed. e.g. 'this.equipSlots'
	return this._equips_getCache()||this._equips_updateCache();
};
$pppp$.weapons=function(n){
	const ref=this.equips();
	if(!ref.w){
		const slots=this.equipSlots(),rtv=ref.w=[];
		for(let z=0;z!==ref.length;++z){ if(slots[z]!==1) continue; let curr=ref[z]; if(!ref[z]) continue;
			if(curr.constructor===Array){
				for(let x=0;x!==curr.length;++x){ let tmp=curr[x];
					if(DataManager.isWeapon(tmp)) rtv.push(tmp);
				}
			}else if(DataManager.isWeapon(curr)) rtv.push(curr);
		}
		return rtv;
	}else return ref.w;
};
$pppp$.armors=function(){
	const ref=this.equips();
	if(!ref.r){
		const slots=this.equipSlots(),rtv=ref.r=[];
		for(let z=0;z!==ref.length;++z){ if(slots[z]===1) continue; let curr=ref[z]; if(!ref[z]) continue;
			if(curr.constructor===Array){
				for(let x=0;x!==curr.length;++x){ let tmp=curr[x];
					if(DataManager.isArmor(tmp)) rtv.push(tmp);
				}
			}else if(DataManager.isArmor(curr)) rtv.push(curr);
		}
		return rtv;
	}else return ref.r;
};
$pppp$.isEquipChangeOk=function(slotId,slotIdExt) {
	const s=this.equipSlots()[slotId];
	return (!this.isEquipTypeLocked(s) &&
		!this.isEquipTypeSealed(s)
	);
};
$pppp$._equipR_ch=function(slotId,slotIdExt,ori,item){
	this._equips_editCache_del(ori);
	const c=this._equips_getCache();
	if(c) c[slotId][slotIdExt]=item;
	const theSlotArr=this._equips[slotId];
	theSlotArr[slotIdExt].setObject(item);
	if(item){
		if(slotIdExt+1===theSlotArr.length){
			if(c) c[slotId].push(null);
			theSlotArr.push(new Game_Item());
		}
	}else if(ori){
		if(slotIdExt+2===theSlotArr.length){
			let tmp;
			if(c){
				tmp=c[slotId].pop();
				c[slotId].back=tmp;
			}
			tmp=theSlotArr.pop();
			theSlotArr.back=tmp;
		}else{
			if(c) c[slotId].splice(slotIdExt,1);
			theSlotArr.splice(slotIdExt,1);
		}
	}
	this._equips_editCache_add(item);
};
$pppp$.changeEquip=function(slotId,item,slotIdExt,noRefresh){
	//debug.log('Game_Actor.prototype.changeEquip');
	if(!(slotId>=0)) return null;
	let ori;
	$gameTemp.____byChEqu=true;
	if(slotIdExt>=0){
		ori=this._equips[slotId][slotIdExt].object();
		if (this.tradeItemWithParty(item, ori) &&
			(!item || this.equipSlots()[slotId] === item.etypeId)) {
			this._equipR_ch(slotId,slotIdExt,ori,item);
			if(!noRefresh) this.refresh();
		}
	}else{
		ori=this._equips[slotId].object();
		if (this.tradeItemWithParty(item, ori) &&
			(!item || this.equipSlots()[slotId] === item.etypeId)) {
			const c=this._equips_getCache(); if(c) c[slotId]=item;
			this._equips_editCache_del(ori);
			this._equips[slotId].setObject(item);
			this._equips_editCache_add(item);
			if(!noRefresh) this.refresh();
		}
	}
	$gameTemp.____byChEqu=false;
	//this._equips_delCache();
	return ori;
};
$pppp$.forceChangeEquip=function(slotId, item, slotIdExt){
	if(!(slotId>=0)) return;
	if(slotIdExt>=0){
		const arr=this._equips[slotId];
		const ori=arr[slotIdExt].object();
		this._equipR_ch(slotId,slotIdExt,ori,item);
	}else{
		const c=this._equips_getCache(); if(c) c[slotId]=item;
		const ori=this._equips[slotId].object();
		this._equips_editCache_del(ori);
		this._equips[slotId].setObject(item);
		this._equips_editCache_add(item);
	}
	//this._equips_delCache();
	this.releaseUnequippableItems(true);
	this.refresh();
};
$pppp$.changeEquipById=function(etypeId, itemId, slotIdExt) {
	const slotId = etypeId - 1;
	if(!(slotId>=0)) return;
	if( (slotIdExt>=0?this.equipSlots()[slotId][slotIdExt]:this.equipSlots()[slotId]) === 1 ){
		this.changeEquip(slotId, $dataWeapons[itemId], slotIdExt);
	} else {
		this.changeEquip(slotId, $dataArmors[itemId], slotIdExt);
	}
};
$d$=$pppp$.isEquipped = function(item){ // $d$ for same func. below
	if(!item) return false; // or true ?
	return this.equips().a.has(item);
};
$pppp$.hasWeapon = $d$; // change logic: search in equipped weapons -> search in all equipments
$pppp$.hasArmor = $d$; // change logic: search in equipped armors -> search in all equipments
$pppp$.discardEquip = function(item){
	if(!item) return;
	if($dataSystem.equipTypes.meta.repeat[item.etypeId]){
		const slots=this.equipSlots();
		const slotId = slots.indexOf(item.etypeId);
		const slotIdExt=this.equips()[slotId].lastIndexOf(item);
		if(slotIdExt!==-1){
			const arr=this._equips[slotId];
			const ori=arr[slotIdExt].object();
			this._equipR_ch(slotId,slotIdExt,ori,null);
			//this._equips_delCache();
		}
	}else{
		const c=this.equips();
		const slotId = c.indexOf(item); // consider dual wield and more fleible methods (edit function 'equipSlots'), not using item.etypeId-1
		if(slotId!==-1){
			c[slotId]=null;
			const ori=this._equips[slotId].object();
			this._equips_editCache_del(ori);
			this._equips[slotId].setObject(null);
		}
	}
};
$pppp$._releaseUnequippableItems_item=function(forcing_i,slots,i,e,ext){
	const item=e.object();
	if(!item) return;
	if(!this.canEquip(item) || item.etypeId !== slots[i]){
		if(forcing_i){
			this.tradeItemWithParty(null, item);
		}
		this._equips_editCache_del(item);
		const c=this._equips_getCache();
		if(c){ if(ext>=0) c[i][ext]=null; else c[i]=null; }
		e.setObject(null);
		return true;
	}
};
$pppp$.releaseUnequippableItems=function(forcing){ // forcing: do not put back equipment to pack
	const forcing_i = !forcing , equips = this._equips;
	for(let changed=true;changed;){
		changed=false;
		const slots = this.equipSlots();
		//const judgingCache=new Map();
		for (let i=0;i!==equips.length;++i){ const curr=equips[i];
			if(curr.constructor===Array){
				for(let x=0,es=equips[i],slot=slots[i];x!==curr.length;++x){
					if(this._releaseUnequippableItems_item(forcing_i,slots,i,es[x],x))
						changed = true;
				}
			}else{
				if(this._releaseUnequippableItems_item(forcing_i,slots,i,curr))
					changed = true;
			}
		}
		//if(changed) this._equips_delCache(); // 'equipSlots' use 'isDualWield'
	}
};
$pppp$.clearEquipments=function(kargs){
	kargs=kargs||{};
	const repeats=$dataSystem.equipTypes.meta.repeat;
	const slots=this.equipSlots();
	for (let i=slots.length;i--;){
		if(this.isEquipChangeOk(i)){
			if(repeats[slots[i]]){ if(kargs.preserveRepeats) continue;
				let arr=this._equips[i];
				while(arr.length>1) this.changeEquip(i, null, arr.length-2, true);
			}else this.changeEquip(i, null, undefined, true);
		}
	}
	this.refresh();
};
$d$=$pppp$.optimizeEquipments=function f(){
	const slots=this.equipSlots();
	const maxSlotTypes = slots.length,repeats=$dataSystem.equipTypes.meta.repeat;
	const recnt=this._equips.map(x=>x&&x.constructor===Array&&x.length);
	this.clearEquipments(f.tbl);
	for(let i=0;i!==maxSlotTypes;++i) if(!repeats[slots[i]]&&this.isEquipChangeOk(i)) this.changeEquip(i, this.bestEquipItem(i));
	for(let i=0,eall=$gameParty.equipItems();i!==maxSlotTypes;++i){
		if(repeats[slots[i]]){
			const etypeId=slots[i];
			const h=new Heap(f.cmp , eall.filter( item => item.etypeId === etypeId && this.canEquip(item) ).map(item=>[item,this.calcEquipItemPerformance(item),$gameParty.numItems(item)]) , true);
			if(f.tbl.preserveRepeats){ // only last slot
				const x=recnt[i]-1;
				if(this.isEquipChangeOk(i,x)){ const top=h.top; if(top){
					this.changeEquip(i,top[0],x);
					if(--top[2]===0) h.pop();
				} }
				continue;
			}
			for(let x=0,xs=recnt[i];x!==xs;++x){ if(this.isEquipChangeOk(i,x)){
				//this.changeEquip(i, this.bestEquipItem(i),x);
				const top=h.top; if(top){
					this.changeEquip(i,top[0],x);
					if(--top[2]===0) h.pop();
				}
			} }
		}
	}
};
$d$.cmp=(a,b)=>a[1]-b[1];
$d$.tbl={preserveRepeats:true};
$pppp$.refresh=function(noReleaseEquips){
	if(this.noRefresh) return this._needRefresh=true;
	if(!noReleaseEquips) this.releaseUnequippableItems(false);
	Game_Battler.prototype.refresh.call(this);
};
$d$=$pppp$._skills_delCache=function f(){
	$gameTemp.delCache(this,f.key);
};
$tttt$=$d$.key=Game_BattlerBase.CACHEKEY_SKILL;
$d$=$pppp$._skills_getCache=function f(){
	return $gameTemp.getCache(this,f.key);
};
$d$.key=$tttt$;
$d$=$pppp$._skills_updateCache=function f(){
	this._skills.sort(f.cmp);
	const rtv=new Set(this._skills);
	$gameTemp.updateCache(this,f.key,rtv);
	const s=rtv.s=new Map();
	const m=rtv.m=new Map();
	for(let x=0,arr=this._skills;x!==arr.length;++x){
		s.byKey2_sum($dataSkills[arr[x]].tmapS);
		m.byKey2_mul($dataSkills[arr[x]].tmapP);
	}
	return rtv;
};
$d$.key=$tttt$;
$tttt$=$d$.cmp=(a,b)=>$dataSkills[a].ord-$dataSkills[b].ord||a-b;
$pppp$._skills_getUpdatedCache=function(){
	return this._skills_getCache()||this._skills_updateCache();
};
$pppp$._skills_delCache_added=function(){
	const c=this._skills_getCache();
	if(c) c.tm=c.ts=c.added=c.all=0;
};
$pppp$.skills_tmap_s=function(){
	const c=this._skills_getUpdatedCache();
	if(c.ts) return c.ts;
	const rtv=new Map(),caled=new Set();
	const added=c.added||(c.added=this.traitSet(Game_BattlerBase.TRAIT_SKILL_ADD));
	rtv.byKey2_sum(c.s);
	added.forEach((v,k)=>!c.has(k)&&!caled.has(k)&&caled.add(k)&&rtv.byKey2_sum($dataSkills[k].tmapS));
	return c.ts=rtv;
};
$pppp$.skills_tmap_m=function(){
	const c=this._skills_getUpdatedCache();
	if(c.tm) return c.tm;
	const rtv=new Map(),caled=new Set();
	const added=c.added||(c.added=this.traitSet(Game_BattlerBase.TRAIT_SKILL_ADD));
	rtv.byKey2_mul(c.m);
	added.forEach((v,k)=>!c.has(k)&&!caled.has(k)&&caled.add(k)&&rtv.byKey2_mul($dataSkills[k].tmapP));
	return c.tm=rtv;
};
$d$=$pppp$.skills=function f(){
	let rtv;
	const added=this.traitSet(Game_BattlerBase.TRAIT_SKILL_ADD);
	let s=this._skills_getCache();
	if(s){
		if(!s.needArrange && s.added===added && s.all) return s.all;
		s.added=added;
		rtv=[];
		s.forEach( v=>rtv.push(f.map(v)) );
	}else{
		s=this._skills_updateCache();
		s.added=added;
		rtv=this._skills.map(f.map);
	}
	s.needArrange=false;
	{
		const arr=[];
		const tmapS=s.added.s=new Map();
		const tmapP=s.added.m=new Map();
		s.added.forEach((v,k)=>arr.push(k));
		arr.sort(f.cmp).forEach(id=>!s.has(id)&&rtv.push($dataSkills[id])); // addeds are already unique
	}
	return s.all=rtv;
};
$d$.key=Game_BattlerBase.CACHEKEY_SKILL;
$d$.cmp=$tttt$;
$tttt$=undef;
$d$.map=id=>$dataSkills[id];
$pppp$.learnSkill=function(skillId,arrangeLater){
	if(!this.isLearnedSkill(skillId)){ // will create cache
		this._skills.push(skillId);
		if(arrangeLater){
			const c=this._skills_getCache();
			c.needArrange=true;
			c.add(skillId);
			const item=$dataSkills[skillId];
			c.s.byKey2_sum(item.tmapS);
			c.m.byKey2_mul(item.tmapP);
			if(!c.pendLearns) c.pendLearns=[];
			c.pendLearns.push(skillId);
			this._overall_delCache();
		}else{
			this._overall_delCache();
			this._skills_updateCache(); // maintain sorted
		}
	}
};
$pppp$.forgetSkill=function(skillId){
	const index = this._skills.indexOf(skillId);
	if(index >= 0){
		this._skills.splice(index, 1);
		const c=this._skills_getCache();
		if(c){
			c.delete(skillId);
			if(c.all && c.all[index] && c.all[index].id===skillId){ // this._skills first then added skills
				c.all.splice(index,1);
			}
			const item=$dataSkills[skillId];
			c.s.byKey2_del_sum(item.tmapS);
			c.m.byKey2_del_mul(item.tmapP);
			if(c.added && !c.added.has(skillId)){
				if(c.ts) c.ts.byKey2_del_sum(item.tmapS);
				if(c.tm) c.tm.byKey2_del_mul(item.tmapP);
			}
		}
		this._overall_delCache();
	}
};
$d$=$pppp$._getTraits_native=function f(){
	const a=this.getData() , c=this.currentClass();
	let rtv=$gameTemp.getCache(this,f.key);
	if(!rtv || rtv.a!==a || rtv.c!==c){
		if(rtv) this.clearCache(); // I'm lazy LOL // change actor or class
		$gameTemp.updateCache(this,f.key,rtv=a.traits.concat(c.traits));
		rtv.a=a;
		rtv.c=c;
		rtv.m=new Map();
		rtv.m.byKey2_mul(a.tmapP);
		rtv.m.byKey2_mul(c.tmapP);
		rtv.s=new Map();
		rtv.s.byKey2_sum(a.tmapS);
		rtv.s.byKey2_sum(c.tmapS);
	}
	return rtv;
};
$d$.key=Game_BattlerBase.CACHEKEY_NATIVE;
$pppp$.getTraits_native_s=function(code,id){
	const rtv=this._getTraits_native().s.get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.getTraits_native_m=function(code,id){
	const rtv=this._getTraits_native().m.get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.getTraits_equips_s=function(code,id){
	// return: undefined / Map / value
	const rtv=this.equips().s.get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.getTraits_equips_m=function(code,id){
	// return: undefined / Map / value
	const rtv=this.equips().m.get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.getTraits_custom_s=function(code,id){
	// return: undefined / Map / value
	const rtv=this.skills_tmap_s().get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.getTraits_custom_m=function(code,id){
	// return: undefined / Map / value
	const rtv=this.skills_tmap_m().get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.traitSet=function(code,id){
	return this.getTraits_overall_s(code,id);
};
$pppp$.traitSetP=function(code,id){
	return this.getTraits_overall_m(code,id);
};
$pppp$.attackElements=function(){
	let rtv=Game_Battler.prototype.attackElements.call(this);
	const bid=this.bareHandsElementId();
	if( !rtv.has(bid) && this.hasNoWeapons() ){
		rtv=new Map(rtv);
		rtv.set(bid,0);
	}
	return rtv;
};
$pppp$.clearStates = function() {
	if(!this._states){ // init, no cache
		Game_Battler.prototype.clearStates.call(this);
		this.clearCache(); // ensure nothing go wrong
	}else{
		const c=this.states_noSlice();
		let slotChanged;
		let lastSlots;
		if(this._states.length){
			slotChanged=c.s.get(Game_BattlerBase.TRAIT_SLOT_TYPE);
			lastSlots=slotChanged&&this.equipSlots(); // this is new Array
		}
		Game_Battler.prototype.clearStates.call(this);
		if(slotChanged) this._equips_slotChanged(lastSlots);
		if(c.s.get(Game_BattlerBase.TRAIT_SKILL_ADD)) this._skills_delCache_added();
	}
	this._stateSteps = {};
};
$pppp$._updateFlr=function(stateId){
	if(stateId===1){ // refresh follower's appearance
		let tmp=$gameTemp._pt_battleMembers_actor2idx;
		if( $gameParty._acs[tmp&&(tmp=tmp.get(this))]===this._actorId && tmp && (tmp=$gamePlayer._followers.follower(tmp-1)) ){
			tmp.refresh();
		}
	}
};
$pppp$.eraseState=function(stateId){
	const stat=$dataStates[stateId];
	const slotChanged=stat.tmapS.get(Game_BattlerBase.TRAIT_SLOT_TYPE);
	const lastSlots=slotChanged&&this.equipSlots(); // this is new Array
	const ori=this._states.length,c=this._equips_getCache();
	Game_Battler.prototype.eraseState.call(this, stateId);
	if(ori!==this._states.length){ // states changed
		if(slotChanged) this._equips_slotChanged(lastSlots);
		if(stat.tmapS.get(Game_BattlerBase.TRAIT_SKILL_ADD)) this._skills_delCache_added();
		this._updateFlr(stateId);
	}
	delete this._stateSteps[stateId];
};
$pppp$._addNewState_updateCache=function(stateId){
	// supposed must add new
	
	const stat=$dataStates[stateId];
	const slotChanged=stat.tmapS.get(Game_BattlerBase.TRAIT_SLOT_TYPE);
	const lastSlots=slotChanged&&this.equipSlots(); // this is new Array
	Game_BattlerBase.prototype._addNewState_updateCache.call(this,stateId);
	// ^ del overall
	if(slotChanged) this._equips_slotChanged(lastSlots);
	if(stat.tmapS.get(Game_BattlerBase.TRAIT_SKILL_ADD)){
		this._skills_delCache_added(); // I'm lazy LOL
	}
	
	this._updateFlr(stateId);
};
$pppp$.paramPlus=function(paramId){
	let rtv = Game_Battler.prototype.paramPlus.call(this, paramId);
	const equips = this.equips();
	if(equips.u===undefined) equips.u=[];
	if(equips.u[paramId]===undefined){
		let value=0;
		for (let i=0;i!==equips.length;++i){
			const item = equips[i];
			if(!item) continue;
			if(item.constructor===Array){
				for(let x=0;x!==item.length;++x) if(item[x]) value += item[x].params[paramId];
			}else value += item.params[paramId];
		}
		rtv+=equips.u[paramId]=value;
	}else rtv+=equips.u[paramId];
	return rtv;
};
$pppp$.performAction=function(action){
	Game_Battler.prototype.performAction.call(this, action);
	if(action.isKindOfAttack()) this.performAttack();
	else{
		let tmp=action.toMotion();
		if(tmp) this.requestMotion(tmp);
	}
};
$pppp$.performAttack=function(){
	const weapons = this.weapons();
	const attackMotion = $dataSystem.attackMotions[weapons[0]&&weapons[0].wtypeId];
	if(attackMotion){
		switch(attackMotion.type){
			case 0: this.requestMotion('thrust');
			break;
			case 1: this.requestMotion('swing');
			break;
			case 2: this.requestMotion('missile');
			break;
		}
		this.startWeaponAnimation(attackMotion.weaponImageId);
		const m2=$dataSystem.attackMotions[weapons[1]&&weapons[1].wtypeId];
		if(m2) this.startWeapon2Animation(m2.weaponImageId);
	}
};
$pppp$.onPlayerWalk=function(){
	this.clearResult();
	this.checkFloorEffect();
	if($gamePlayer.isNormal()){
		this.turnEndOnMap();
		this._states.forEach(this.updateStateSteps, this);
		this.showAddedStates();
		this.showRemovedStates();
	}
};
$pppp$.updateStateSteps = function(stateId){
	if($dataStates[stateId].removeByWalking && !(--this._stateSteps[stateId]>0)){
		this.removeState(stateId);
	}
};
$d$=$pppp$.showAddedStates=function f(){
	this.result().addedStateObjects().forEach(f.forEach, this);
};
$d$.forEach=function(state){
	if(state.message1){
		$gameMessage.popup(this._name + state.message1,true);
	}
};
$d$=$pppp$.showRemovedStates=function f(){
	this.result().removedStateObjects().forEach(f.forEach, this);
};
$d$.forEach=function(state){
	if(state.message4){
		$gameMessage.popup(this._name + state.message4,true);
	}
};
$pppp$.stepsForTurn=()=>3;
$pppp$.setPlan=function(idx,obj,target){ // target is indexed from 1
	if(!this._plan) this._plan=[];
	this._plan[idx]=[obj&&obj.itemType,obj&&obj.id,target];
};
$pppp$.insertPlan=function(idx,obj,target){
	if(!this._plan) this._plan=[];
	const data=[obj&&obj.itemType,obj&&obj.id,target];
	if(idx>=this._plan.length) this._plan[idx]=data;
	else this._plan.splice(idx,0,data);
};
$pppp$.appendPlan=function(idx,obj,target){
	this.insertPlan(++idx,obj,target);
};
$pppp$.getPlan=function(idx){
	if(!this._plan) this._plan=[];
	return this._plan[idx];
};
$pppp$.getPlanObj=function(idx){
	const tmp=this.getPlan(idx);
	let rtv;
	switch(tmp&&tmp[0]){
	case 's':
		rtv=$dataSkills[tmp[1]];
	break;
	case 'i':
		rtv=$dataItems[tmp[1]];
	break;
	}
	return rtv;
};
$pppp$.getPlanObjName=function(idx){
	const tmp=this.getPlan(idx);
	let rtv;
	switch(tmp&&tmp[0]){
	case 's':
		rtv=$dataSkills[tmp[1]].name;
	break;
	case 'i':
		rtv=$dataItems[tmp[1]].name;
	break;
	}
	return rtv;
};
$pppp$.getWorkerEvt=function(){
	const w=this._meta.worker;
	return w && $gameMap._mapId===w[0] && $gameMap._events[w[1]];
};
$pppp$=$aaaa$=undef;

// - actors
$aaaa$=Game_Actors;
$pppp$=$aaaa$.prototype;
$pppp$.initialize=function(){ // its short
	this._data=[];
	this._clones=[]; // [templateId][subId]=actor , clean 'undefined' actor to zero when save
	objs.$gameTemp._acs_holes=[]; // empty hole-segs of this._clones[id]
};
$pppp$.maxRepeat=function(){
	return _global_conf['default allowRepeatedMembers']||404;
};
$pppp$.updateTbl_toQ=function(actor){
	if(!actor) return;
	[
		'_actions',
		'_animations',
	].forEach(key=>{
		const q=actor[key];
		if(q.constructor===Array) actor[key] = new Queue(q);
		else if(q.constructor!==Queue) actor[key] = Object.toType(q,Queue);
	});
};
$d$=$pppp$.updateTbl_deleteOldDataMember=function f(actor){
	if(!actor) return;
	actor._deleteOldDataMember();
	this.updateTbl_toQ(actor);
	// ._meta
	if(!actor._meta) actor._meta={};
	// Game_Item
	actor._actions.forEach(act=>f.forEach(act._item));
	actor._equips.forEach(f.forEach);
	actor._lastMenuSkill._deleteOldDataMember();
	actor._lastBattleSkill._deleteOldDataMember();
};
$d$.forEach=function f(item){
	if(item.constructor===Array) return item.forEach(f);
	item._deleteOldDataMember();
};
$pppp$.updateTbl=function(tid){
	if(!tid) return;
	if(!$gameTemp._acs_holes[tid]) $gameTemp._acs_holes[tid]=new AVLTree(true,true); // sort by left startpoint , [)
	let tbl=$gameTemp._acs_holes[tid];
	let arr=this._clones[tid];
	if(arr&&arr.length){ for(let x=1;x!==arr.length;++x){
		if(!arr[x]){ arr[x]=0;
			let ende=x;
			while(++ende!==arr.length) if(arr[ende]) break;
			if(ende!==arr.length) tbl.add(x,[x,ende]);
			else arr.length=ende=x;
			x=ende-1;
		}
	} }
};
$pppp$.updateTbl_all=function(){
	for(let x=0,arrs=this._clones;x!==arrs.length;++x){ if(arrs[x]){
		for(let z=0,arr=arrs[x];z!==arr.length;++z) this.updateTbl_deleteOldDataMember(arr[z]);
		this.updateTbl(x);
	} }
	for(let arr=this._data,x=arr.length;x--;){
		this.updateTbl_deleteOldDataMember(arr[x]);
	}
};
$pppp$.genClone=function(id){
	if( !id || !(id=id.toId()) ) return; // $dataActors[0] is invalid
	if(!this._clones[id]) this._clones[id]=[0];
	let arr=this._clones[id],tbl=$gameTemp._acs_holes[id];
	if(tbl&&tbl.length){ // hole-seg exists, use first seg's right most element
		let seg=tbl.begin();
		let idx=--seg.data[1];
		let rtv=arr[idx]=new Game_Actor(id);
		rtv._actorId=id+'-'+idx;
		if(seg.data[0]===seg.data[1]) tbl.del(idx);
		return rtv;
	}else if(arr.length>=this.maxRepeat()) return;
	else{
		let idx=arr.length;
		let rtv=arr[idx]=new Game_Actor(id);
		rtv._actorId=id+'-'+idx;
		return rtv;
	}
};
$pppp$.actor=function(actorId) {
	if(!actorId) return; // expected: /[0-9]+-[0-9]+/
	let tid=actorId.toId();
	if(!$dataActors[tid]) return;
	let sid=actorId.subId();
	if(sid){
		if(!(sid<this.maxRepeat())) return;
		if(!this._clones[tid]){ // clean and init
			let arr=this._clones; if(arr.length<tid) for(let x=arr.length;x!==tid;++x) arr[x]=0;
			arr[tid]=[0];
		}
		let arr=this._clones[tid],tbl=$gameTemp._acs_holes[tid];
		if(!arr[sid]){ // not exists yet
			if(arr.length===sid) ;
			else if(arr.length<sid){ // note: init arr.length === 1
				if(!tbl) tbl=$gameTemp._acs_holes[tid]=new AVLTree(true,true);
				tbl.add(arr.length,[arr.length,sid]); // new seg at right // [...,empty,sth],new
			}else{ // tree is constructed
				let seg=new AVLTree.it(); seg.upper_bound(tbl,sid);
				if(seg.now()){ seg.prev(); seg=seg.now(); }
				else seg=tbl.back();
				//if(!seg){debugger;} // debug: record error: '!arr[sid]' but no hole
				let strt=seg.data[0],ende=seg.data[1];
				if(sid+1===ende){
					if(--seg.data[1]===strt) tbl.del(strt);
				}else if(sid<ende){ // sid+1<ende
					if(strt===sid) tbl.del(strt);
					else seg.data[1]=sid;
					let tmp=sid+1;
					tbl.add(tmp,[tmp,ende]);
				}
			}
			arr[sid]=new Game_Actor(actorId);
		}
		return arr[sid];
	}else{
		if(!this._data[tid]){
			let arr=this._data; if(arr.length<tid) for(let x=arr.length;x!==tid;++x) arr[x]=0;
			arr[tid]=new Game_Actor(tid);
		}
		return this._data[tid];
	}
};
$pppp$.destroy=function(actorId){
	if(!actorId) return; // expected: /[0-9]+-[0-9]+/
	let tid=actorId.toId();
	if(!$dataActors[tid]) return;
	let sid=actorId.subId();
	if(sid){
		if(!this._clones[tid]) return;
		let arr=this._clones[tid],tbl=$gameTemp._acs_holes[tid];
		if(!arr[sid]) return;
		arr[sid].clearCache();
		arr[sid]=0;
		if(!tbl||tbl.length===0){
			if(sid+1===arr.length) arr.pop();
			else{
				if(!tbl) tbl=$gameTemp._acs_holes[tid]=new AVLTree(true,true);
				tbl.add(sid,[sid,sid+1]);
			}
			return true;
		}
		let it=new AVLTree.it(),seg,next; it.upper_bound(tbl,sid);
		if(next=it.now()){ it.prev(); seg=it.now();}
		else seg=tbl.back();
		let sid1=sid+1;
		if(seg){
			let strt=seg.data[0],ende=seg.data[1];
			if(sid===ende){ // del @ ende
				if(next&&sid1===next.data[0]){ // also next seg's startpoint-1
					seg.data[1]=next.data[1];
					tbl.del(sid1);
					return true;
				}
				if(++seg.data[1]===arr.length){ // no next seg
					arr.length=strt;
					tbl.del(strt);
				}
				return true;
			}
		}
		if(next&&sid1===next.data[0]){ // del @ next seg's startpoint-1
			let ende=next.data[1];
			tbl.del(sid1);
			tbl.add(sid,[sid,ende]);
			return true;
		}
		if(arr.length===sid1) arr.pop();
		else tbl.add(sid,[sid,sid1]);
		return true;
	}else{
		const t=this._data[tid]; if(t) t.clearCache();
		this._data[tid]=0;
	}
		return true;
};
$pppp$=$aaaa$=undef;

// - Game_Enemy
$aaaa$=Game_Enemy;
$pppp$=$aaaa$.prototype;
$pppp$.getData=function(){
	return this.enemy();
};
$r$=Game_Character.prototype;
$pppp$._getColorEdt=$r$._getColorEdt;
$pppp$._getScaleEdt=$r$._getScaleEdt;
$pppp$._getAnchoryEdt=$r$._getAnchoryEdt;
Object.defineProperties($aaaa$.prototype,{
	_refActor:{
		get:function(){return this._rActr;},
		set:function(rhs){
			if(rhs&&rhs.toId){
				const src=$dataActors[rhs.toId()];
				if(src){
					this._color=src.meta.color;
					this._scale=src.meta.scale;
				}
			}
			return this._rActr=rhs;
		},
	configurable:true},
});
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(eid,x,y){
	f.ori.call(this,eid,x,y);
	delete this._mimic;
	delete this._refActor;
	const data=this.getData();
	if(data){
		let refActor=data.meta.refActor;
		switch(data.meta.mimic){
		default: { const n=Number(data.meta.mimic); if(!isNaN(n)){
			
			break;
		} }
		case true: {
			const ids=$gameParty._acs;
			if(ids.length===0) break;
			const n=this._mimic=refActor=ids.rnd();
			const a=$gameActors.actor(n);
			for(let x=0,arr=this._paramPlus;x!==arr.length;++x){
				arr[x]=a.paramBase(x)+a.paramPlus(x);
			}
			this.recoverAll(true);
		}break;
		case undefined: break;
		}
		this._refActor=refActor;
	}
}; $d$.ori=$r$;
$d$=$pppp$._getTraits_native=function f(){
	const d=this.getData();
	let rtv=$gameTemp.getCache(this,f.key);
	if(!rtv || rtv.d!==d){
		$gameTemp.updateCache(this,f.key,rtv=d.traits.slice());
		rtv.m=new Map();
		rtv.m.byKey2_mul(d.tmapP);
		rtv.s=new Map();
		rtv.s.byKey2_sum(d.tmapS);
		rtv.d=d;
	}
	return rtv;
};
$d$.key=Game_BattlerBase.CACHEKEY_NATIVE;
$pppp$.getTraits_native_s=function f(code,id){
	const rtv=this._getTraits_native().s.get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.getTraits_native_m=function f(code,id){
	const rtv=this._getTraits_native().m.get(code);
	return rtv&&id!==undefined?rtv.get(id):rtv;
};
$pppp$.getTraits_custom_s=function f(code,id){
	if(this._mimic){
		const a=$gameActors.actor(this._mimic);
		if(a) return a.getTraits_overall_s(code,id);
	}
};
$pppp$.getTraits_custom_m=function f(code,id){
	if(this._mimic){
		const a=$gameActors.actor(this._mimic);
		if(a) return a.getTraits_overall_m(code,id);
	}
};
$d$=$pppp$.makeDropItems=function f(){
	const rtv=[]; rtv.self=this;
	return this.enemy().dropItems.reduce(f.reduce,rtv);
};
$d$.reduce=(r,di)=>{ // TODO: merge same item, add amount info
	if (di.kind > 0 && Math.random() * di.denominator < r.self.dropItemRate()) {
		r.push(r.self.itemObject(di.kind, di.dataId));
	}
	return r;
};
$pppp$.itemObject = function(kind, dataId) {
	let rtv=null;
	switch(kind){
	default: break;
	case 1: rtv=$dataItems  [dataId]; break;
	case 2: rtv=$dataWeapons[dataId]; break;
	case 3: rtv=$dataArmors [dataId]; break;
	}
	return rtv;
};
$pppp$.performDamage=function(){
	Game_Battler.prototype.performDamage.call(this);
	SoundManager.playEnemyDamage();
	//this.requestEffect('blink');
};
$pppp$=$aaaa$=undef;

// - Game_Troop
$aaaa$=Game_Troop;
$pppp$=$aaaa$.prototype;
$pppp$.getDate=function(){
	return this.troop();
};
$pppp$.clear = function() {
	this._interpreter.clear();
	this._troopId = 0;
	this._eventFlags = {};
	if(!this._enemies) this._enemies = []; else this._enemies.length=0;
	this._turnCount = 0;
	this._namesCount = {};
	this._trueEscape=false;
};
$r$=$pppp$.setup;
$d$=$pppp$.setup=function f(id){
	f.ori.call(this,id);
	// meta 
}; $d$.ori=$r$;
$pppp$.addEnemy=function(enemyId,x,y,dur,ox,oy){
	if(!$dataEnemies[enemyId]) return;
	if(dur!==0) dur=dur||23;
	if(ox!==0) ox=ox||-64;
	if(oy!==0) oy=oy||Graphics._boxHeight>>1;
	x=x||0; y=y||0;
	const e=new Game_Enemy(enemyId,x,y);
	this._enemies.push(e);
	const sc=SceneManager._scene;
	if(!sc||sc.constructor!==Scene_Battle) return;
	const sps=sc._spriteset,sp=new Sprite_Enemy(e);
	sps._battleField.addChild(sp);
	sps._enemySprites.push(sp);
	sp.startMove(ox-x,oy-y,0);
	sp.startMove(0,0,dur);
	return e;
};
$pppp$=$aaaa$=undef;

if(window.Scenen_Debug) window.Scenen_Debug=undefined;

// window

// - base
$aaaa$=Window_Base;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(x,y,w,h){
	this.fontSize=this.standardFontSize(); // create obj key
	
	const noRefreshArrows=this._noRefreshArrows||undefined;
	this._noRefreshArrows=true;
	
	f.ori.call(this,x,y,w,h);
	
	this._noRefreshArrows=noRefreshArrows;
	this._refreshArrows(); // reduce dup calls
	
	
	this.adjLrArrows=undefined;
	this._iconloop=undefined;
}; $d$.ori=$r$;
$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	if(this._iconloop){
		for(let x=0,arr=this._iconloop;x!==arr.length;++x){
			const info=arr[x]; if(this._index===info[5]) f.forEach.call(this,info,x);
		}
	}
	f.ori.call(this);
}; $d$.ori=$r$;
$d$.forEach=function(info,index){
	const icons=info[0];
	if(!(--info[4]>0)){
		++info[3];
		const idx=(info[3]%=icons.length);
		info[4]=icons[idx][1];
		this.drawLoopIcon(index);
	}
};
$d$=$pppp$.clearLoopIcon=function f(){
	const ws=this.subWindows();
	if(ws) ws.forEach(f.forEach);
	f.forEach(this);
};
$d$.forEach=w=>w._iconloop && (w._iconloop.length=0);
$d$=$pppp$.drawLoopIcon=function f(idx){
	if(this._iconloop && this._iconloop.length){
		if(idx===undefined) this._iconloop.forEach(f.forEach,this);
		else f.forEach.call(this,this._iconloop[idx]);
	}
};
$d$.forEach=function f(info){
	const icons=info[0] , idx=info[3];
	f.tbl.x=info[1];
	f.tbl.y=info[2];
	this.processDrawIcon(icons[idx][0],f.tbl);
};
$d$.forEach.tbl={x:0,y:0};
if(0)$pppp$.refresh=function(){
	//SceneManager.addRefresh(this);
};
$pppp$.drawActorFace = function(actor, x, y, width, height) {
	this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
	const iconw=Window_Base._iconHeight+1;
	x+=Window_Base._faceWidth;
	if(actor._meta&&actor._meta.leaveAtBattleEnd){
		x-=iconw;
		this.drawIcon($dataSkills[44].iconIndex,x,y);
	}
	if(actor._meta&&actor._meta.isClone){
		x-=iconw;
		this.drawIcon($dataSkills[12].iconIndex,x,y);
	}
};
$pppp$.drawActorStp=function(actor, x, y, width){
	width = width || 186;
	const color1 = this.stpGaugeColor1(),color2 = this.stpGaugeColor2();
	this.drawGauge(x, y, width, actor.stpRate(), color1, color2);
	this.changeTextColor(this.systemColor());
	this.drawText($dataCustom.stpA, x, y, 44);
	this.drawCurrentAndMax(actor.stp, actor.mstp, x, y, width, this.stpColor(actor), this.normalColor());
};
$pppp$.drawActorExp=function(actor, x, y, width){
	width = width || 186;
	const color1 = this.expGaugeColor1(),color2 = this.expGaugeColor2();
	const clvexp=actor.currentLevelExp();
	const c=actor.currentExp()-clvexp;
	const m=actor.isMaxLevel()?inf:(actor.nextLevelExp()-clvexp);
	this.drawGauge(x, y, width, c/m, color1, color2);
	this.changeTextColor(this.systemColor());
	this.drawText(TextManager.exp, x, y, 44);
	const color=this.normalColor();
	this.drawCurrentAndMax(c, m, x, y, width, color, color, width>>2);
};
$pppp$.drawActorSimpleStatus=function(actor, x, y, width) {
	const lineHeight = this.lineHeight();
	const c=180;
	const x2 = x + c , width2 = width - c - this.textPadding();
	this.drawActorName(actor, x, y);
	this.drawActorLevel(actor, x,  lineHeight     + y);
	this.drawActorIcons(actor, x, (lineHeight<<1) + y);
	if(actor.stp===undefined){
		const width2_2=width2>>1;
		this.drawActorClass(actor, x2, y, width2_2);
		this.drawActorTp(actor, (width2&1) + width2_2 + x2, y, width2_2);
	}else{
		const width2_4=width2>>2;
		const width2_8=width2>>3;
		this.drawActorClass(actor, x2, y, width2_4);
		this.drawActorStp(actor, x2 + width2_4 + width2_8, y, width2_4);
		this.drawActorTp (actor, x2 + width2   - width2_4, y, width2_4);
	}
	{
		const w=(width2-(width2>>6))>>1;
		this.drawActorHp (actor, x2,              lineHeight     + y, w);
		this.drawActorMp (actor, x2 + width2 - w, lineHeight     + y, w);
		this.drawActorExp(actor, x2,             (lineHeight<<1) + y, width2);
	}
};
$pppp$.textWidth=function f(txt,ende){ // TODO: aligned tab width
	// ende must be int>=0 or undefined
	if(this._tabWidth===undefined) this._tabWidth=4;
	if(!this._textWidthCaches) this._textWidthCaches=textWidthCaches||[];
	const fs=~~this.contents.fontSize;
	let cache=this._textWidthCaches[fs]; if(!cache){ cache=this._textWidthCaches[fs]=[]; cache.length=65536; }
	let rtv=0;
	for(let t=this._tabWidth,x=0,tr=t,xs=isNaN(ende)?txt.length:Math.min(ende,txt.length);x!==xs;++x){
		let cc=txt.charCodeAt(x);
		if(!cache[cc]) cache[cc]=this.contents.measureTextWidth(txt[x]);
		if(cc===9){
			rtv+=cache[cc]*tr;
			tr=1;
		}else rtv+=cache[cc];
		if(--tr===0) tr=t;
	}
	return rtv;
};
$pppp$.drawTextEx=function(text, x, y, _w , _a , rtv){
	if(text){
		let textState = { index: 0, x: x, y: y, left: x };
		textState.text = this.convertEscapeCharacters(text);
		//textState.texts = textState.text.split('\n'); textState.texts.idx = 0;
		textState.height = this.calcTextHeight(textState, false);
		this.resetFontSettings();
		while (textState.index < textState.text.length) {
			this.processCharacter(textState);
		}
		if(rtv) rtv.stat=textState;
		return textState.x - x;
	}else return 0;
};
$d$=$pppp$.convertEscapeCharacters=function f(text) {
	text = text || "";
	text = text.replace(/\\/g, '\x1b');
	text = text.replace(/\x1b\x1b/g, '\\');
	text = text.replace(f.re_utf8, f.f_utf8);
	text = text.replace(f.re_code, f.f_code);
	text = text.replace(f.re_keyword, f.f_keyword);
	text = text.replace(f.re_txtin, f.f_txtin);
	text = text.replace(f.re_txtarea, f.f_txtarea.bind(this));
	text = text.replace(f.re_armor, f.f_armor);
	text = text.replace(f.re_weapon, f.f_weapon);
	text = text.replace(f.re_skill, f.f_skill);
	text = text.replace(f.re_item, f.f_item);
	text = text.replace(f.re_quest, f.f_quest);
	text = text.replace(f.re_vars, f.f_vars);
	text = text.replace(f.re_name, f.f_name.bind(this));
	text = text.replace(f.re_party, f.f_party.bind(this));
	text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
	return text;
};
$d$.re_utf8=/\x1bUTF8\[([^\]]+)\]/g;
$d$.f_utf8=function(){ return String.fromCharCode(arguments[1]); };
$d$.re_code=/\x1bCODE'([^']+)'/g;
$d$.f_code=function(){
	return eval(arguments[1]); // {let s="嘔";for(let x=6;x--;)s+=s;s}
	//return Function('"use strict";return (' + arguments[1] + ')')();
};
$d$.re_keyword=/\x1bkey'([^']+)'/g;
$d$.f_keyword=function f(){
	return "\x1bRGB["+$dataCustom.textcolor.keyword+"]"+
		//eval(arguments[1])+
		objs._getObj.call(this,arguments[1])+
		"\x1bRGB["+$dataCustom.textcolor.default+"]";
};
$d$.re_txtin=/\x1bTXTIN'([^']+)'/g;
$d$.f_txtin=function(){
	SceneManager.addTextInput($gameTemp,"txtin",{
		title:arguments[1],
		//valid:(txt)=>txt!==""&&!isNaN(txt),
		//apply:Number,
		final:$gameTemp.txtin_final,
	},1);
	$gameTemp.txtin_final=undefined;
	{ let sc=SceneManager._scene; if(sc){ let m=sc._messageWindow; if(m){ let nf=m._nameField;
		if(nf&&nf.enabled&&nf._openness===255) m._moveTxtInput();
	} } }
	return "";
};
$d$.re_txtarea=/\x1bTXTAREA'([^']*)'/g;
$d$.f_txtarea=function(){
	if(!$gameTemp.txtareainfo) $gameTemp.txtareainfo={lines:[],curAt:0,scrolledLine:0,}; // should be given first if needed
	const txtobj=$gameTemp.txtareainfo;
	const w=new Window_CustomMenu_main(0,0, [
		["編輯回答",";edit;func;call",1,function(){
			const leave=Scene_NoteApp.prototype.makeLeaveBtn();
			let w=leave.ref=new Window_CustomTextArea(txtobj);
			w.height-=(w.y=leave.height);
			SceneManager._scene.addWindow(leave);
			let r=w.destructor; w.destructor=function f(){
				leave.parent.removeChild(leave);
				leave.ref=undefined;
				let val=this._lines;
				let vxo=this._vxo;
				let ca=this.getCurAt();
				let sline=this._scrolledLine;
				f.ori.call(this);
				if(txtobj.lines.equals(val)){
					txtobj.curAt=ca;
					txtobj.scrolledLine=sline;
					return;
				}
			}; w.destructor.ori=r;
			this.parent.addWindow({},w);
		}],
		["確認送出",";;func;call",1,function(){this.parent.processCancel();}],
	]);
	const back=w._windows.back;
	back._openness=0;
	SceneManager.addWindowB(w);
	back.open();
	return "";
};
$d$.re_armor=/\x1barmor\[(\d+)\]/g;
$d$.f_armor=function(){ return "\x1bRGB["+$dataCustom.textcolor.armor+"]"+$dataArmors[arguments[1]].name+"\x1bRGB["+$dataCustom.textcolor.default+"]"; };
$d$.re_weapon=/\x1bweapon\[(\d+)\]/g;
$d$.f_weapon=function(){ return "\x1bRGB["+$dataCustom.textcolor.weapon+"]"+$dataWeapons[arguments[1]].name+"\x1bRGB["+$dataCustom.textcolor.default+"]"; };
$d$.re_skill=/\x1bskill\[(\d+)\]/g;
$d$.f_skill=function(){ return "\x1bRGB["+$dataCustom.textcolor.skill+"]"+$dataSkills[arguments[1]].name+"\x1bRGB["+$dataCustom.textcolor.default+"]"; };
$d$.re_item=/\x1bitem\[(\d+)\]/g;
$d$.f_item=function(){ return "\x1bRGB["+$dataCustom.textcolor.item+"]"+$dataItems[arguments[1]].name+"\x1bRGB["+$dataCustom.textcolor.default+"]"; };
$d$.re_quest=/\x1bquest\[(\d+)\]/g;
$d$.f_quest=function(){ return "\x1bRGB["+$dataCustom.textcolor.quest+"]"+$dataItems[arguments[1]].name+"\x1bRGB["+$dataCustom.textcolor.default+"]"; };
$d$.re_vars=/\x1bV\[(\d+)\]/gi;
$d$.f_vars=function(){ return $gameVariables.value(arguments[1]); };
$d$.re_name=/\x1bN\[([^\]]+)\]/gi;
$d$.f_name=function(){
	let arg1=arguments[1],h="\x1bRGB["+$dataCustom.textcolor.keyword+"]",t="\x1bRGB["+$dataCustom.textcolor.default+"]";
	if(arg1==="my") return h+this._evtName+t;
	if(arg1.match(/evt-[0-9]+/g)) return h+$gameMap._events[parseInt(arg1.slice(4))].event().meta.name+t;
	let val=parseInt(arg1);
	if(!isNaN(val)) return this.actorName(val);
	return '';
};
$d$.re_party=/\x1bP\[(\d+)\]/gi;
$d$.f_party=function(){ return this.partyMemberName(parseInt(arguments[1])); };
$pppp$.processNormalCharacter = function(textState) {
	const c = textState.text[textState.index++];
	const w = this.textWidth(c);
	if(!this.inaline && this.constructor===Window_Message && textState.x + w > this.contentsWidth()){
		--textState.index;
		this.processNewLine(textState);
	} // auto new line only when: this.constructor===Window_Message
	if(this.constructor===Window_Message && textState.y + textState.height > this.contentsHeight()){
		--textState.index;
		//this.newPage(textState);
		return;
	} // auto new page only when: this.constructor===Window_Message
	if(this.contentsWidth()>textState.x&&textState.x+w>0) this.contents.drawText(c, textState.x, textState.y, w, textState.height);
	textState.x += w;
	if(!(textState.maxX>=textState.x)) textState.maxX=textState.x;
};
$pppp$.processNewLine=function(textState) {
	textState.x = textState.left;
	textState.y += textState.height;
	++textState.index;
	if(textState.texts) ++textState.texts.idx;
	textState.height = this.calcTextHeight(textState, false);
};
$pppp$.processNewPage=function(textState){
	this.clearLoopIcon();
	++textState.index;
};
$d$=$pppp$.obtainEscapeCode=function f(textState){
	++textState.index;
	const arr = f.regExp.exec(textState.text.slice(textState.index));
	if(arr){
		textState.index += arr[0].length;
		return arr[0].toUpperCase();
	}else return '';
};
$d$.regExp=/^[\$\.\|\^!><\{\}\\-]|^[A-Z]+/i;
$d$=$pppp$.processEscapeCharacter=function f(code, textState){
	// upper case str
	switch(code){
	case '-': break; // a break, no function
	case 'MINOR': { // only function in Window_Message
		if(this.constructor!==Window_Message) break;
		this.printMinor=true;
	}break;
	case 'ICONLOOP':{
		let res = f.re_iconloop.exec(textState.text.slice(textState.index));
		if(!res) break;
		textState.index += res[0].length;
		res=JSON.parse(res[0]);
		if(!res.length) break;
		if(res.length>1){
			if(!this._iconloop) this._iconloop=[];
			this._iconloop.push([res,textState.x,textState.y,0,res[0][1],this._drawingIdx]);
		}
		this.processDrawIcon(res[0][0], textState);
	}break;
	case 'RGB':
	case 'RGBA': {
		let res = f.re.exec(textState.text.slice(textState.index));
		if(res){
			textState.index += res[0].length;
			res=res[0].slice(1,-1);
		}
		this.changeTextColor(res||$dataCustom.textcolor.default);
	}break;
	case 'L':
		this.inaline=true;
		break;
	case 'R':
		this.inaline=false;
		break;
	case 'C':
		this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
		break;
	case 'I':
		this.processDrawIcon(this.obtainEscapeParam(textState), textState);
		break;
	case '{':
		this.makeFontBigger();
		break;
	case '}':
		this.makeFontSmaller();
		break;
	}
};
$d$.re=/^\[((rgba\((\d+,){3}[01](\.\d+)?\))|(#[0-9A-Fa-f]{6}))\]/;
$d$.re_iconloop=/^(\[\[-?[0-9]+,[0-9]+\](,\[-?[0-9]+,[0-9]+\])*\])/;
$pppp$.calcTextHeight=function f(textState, all){
	let textHeight = 0; // rtv
	
	const lastFontSize = this.contents.fontSize;
	const idx=!all && textState.text.indexOf('\n',textState.index);
	//const lines = all?( textState.index===0 && textState.texts || textState.text.slice(textState.index).split('\n') ):( [(idx===-1) ? textState.text.slice(textState.index) : textState.text.slice(textState.index,idx)] );
	const lines = all?( textState.text.slice(textState.index).split('\n') ):( [(idx===-1) ? textState.text.slice(textState.index) : textState.text.slice(textState.index,idx)] );
	const maxLines = all ? lines.length : 1;
	
	for(let i=0;i!==maxLines;++i){
		const regExp = /\x1b[\{\}]/g;
		let maxFontSize = this.contents.fontSize;
		for(;;){
			const array = regExp.exec(lines[i]);
			if(array){
				switch(array[0]){
				case '\x1b{': this.makeFontBigger();  break;
				case '\x1b}': this.makeFontSmaller(); break;
				}
				if(maxFontSize < this.contents.fontSize){
					maxFontSize = this.contents.fontSize;
				}
			}else break;
		}
		textHeight += maxFontSize * 1.25 + 1;
	}
	this.contents.fontSize = lastFontSize;
	return textHeight;
};
$pppp$.clearContents=function(){
	if(this.contents){
		if( !this.contents._reCreateTextureIfNeeded(this.contentsWidth(),this.contentsHeight()) ) this.contents.clear();
		return true;
	}
};
$pppp$=$aaaa$=undef;

// - selectable
$aaaa$=Window_Selectable;
$pppp$=$aaaa$.prototype;
$pppp$.lineHeight=function(){
	return this.fontSize&&this._lineHeight||((Utils.isMobileDevice()*6)+36);
};
$pppp$.standardFontSize=function(){ 
	return this.fontSize||((Utils.isMobileDevice()<<2)+28);
};
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(x,y,w,h){
	f.ori.call(this,x,y,w,h);
	// create member
	if(this._maxCols===undefined) this._maxCols=undefined;
	if(this._drawingIdx===undefined) this._drawingIdx=undefined;
}; $d$.ori=$r$;
$pppp$.maxCols=function(){
	return this._maxCols===undefined?1:this._maxCols;
};
$pppp$.deselect=function(){ // rewrite: consist 'this._scrollY'
	if(this._index===-1) return;
	this._stayCount = 0;
	{
		let lastScrollY=this._scrollY;
		this.ensureCursorVisible();
		this._scrollY=lastScrollY;
	}
	this._index = -1;
	this.updateCursor();
	this.callUpdateHelp();
};
$pppp$.update=function() {
	Window_Base.prototype.update.call(this);
	this.updateArrows();
	if(this.isOpenAndActive()){
		this.processCursorMove();
		this.processHandling();
		if(this.downArrowVisible || this.upArrowVisible) this.processWheel();
		this.processTouch();
	}else this._touching = false;
	this._stayCount++;
};
$pppp$.processHandling=function f(){
	if (SceneManager._nextScene===null) {
		if (this.isOkEnabled() && this.isOkTriggered()) {
			this.processOk();
		} else if (this.isCancelEnabled() && this.isCancelTriggered()) {
			this.processCancel();
		} else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
			this.processPagedown();
		} else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
			this.processPageup();
		}
	}
};
$pppp$.processWheel = function() {
	let threshold = 20;
	if (TouchInput.wheelY >= threshold) {
		this.scrollDown();
	}
	if (TouchInput.wheelY <= -threshold) {
		this.scrollUp();
	}
};
$pppp$.processTouch = function() {
	if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
		this._touching = true;
		this.onTouch(true);
	} else if (TouchInput.isCancelled()) {
		if (this.isCancelEnabled()) {
			this.processCancel();
		}
	}
	if (this._touching) {
		if (TouchInput.isPressed()) {
			this.onTouch(false);
		} else {
			this._touching = false;
		}
	}
};
$k$='updateArrows';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	const maxItems=this.maxItems();
	if(this._lastScrollY===this._scrollY && this._lastLineHeight===this._lineHeight && this._lastMaxItems===maxItems) return;
	this._lastScrollY=this._scrollY;
	this._lastLineHeight=this._lineHeight; // ignore case: device changed during the game
	this._lastMaxItems=maxItems;
	f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.processCursorMove=function(){ // overwrite for efficiency
	if (!this._cursorFixed && !this._cursorAll && this.maxItems() > 0) {
		let lastIndex = this.index();
		if (Input.isRepeated('down')) {
			let wrap=Input.isTriggered('down');
			this.cursorDown(wrap);
			if(Input.isPressed('shift')) for(let x=10;--x;) this.cursorDown(wrap);
		}
		if (Input.isRepeated('up')) {
			let wrap=Input.isTriggered('up');
			this.cursorUp(wrap);
			if(Input.isPressed('shift')) for(let x=10;--x;) this.cursorUp(wrap);
		}
		if (Input.isRepeated('right')) {
			let wrap=Input.isTriggered('right');
			this.cursorRight(wrap);
			//if(Input.isPressed('shift')) for(let x=10;--x;) this.cursorRight(wrap);
		}
		if (Input.isRepeated('left')) {
			let wrap=Input.isTriggered('left');
			this.cursorLeft(wrap);
			//if(Input.isPressed('shift')) for(let x=10;--x;) this.cursorLeft(wrap);
		}
		if(Input.isTriggered('home')){
			this.select(0);
			this.cursorPageup();
		}
		if(Input.isTriggered('end')){
			this.select(this.maxItems());
			this.cursorPagedown();
		}
		if (!this.isHandled('pagedown') && Input.isRepeated('pagedown')) {
			this.cursorPagedown();
			if(Input.isPressed('shift')) for(let x=10;--x;) this.cursorPagedown();
		}
		if (!this.isHandled('pageup') && Input.isRepeated('pageup')) {
			this.cursorPageup();
			if(Input.isPressed('shift')) for(let x=10;--x;) this.cursorPageup();
		}
		if (this.index() !== lastIndex) {
			SoundManager.playCursor();
		}
	}
};
$pppp$.cursorPageup=function() { // overwrite because it's wrong
	if(0<this.topRow()) this.setTopRow(this.topRow() - this.maxPageRows());
	this.select(Math.max(this.index() - this.maxPageItems(), 0));
};
$pppp$.cursorPagedown=function() { // overwrite because it's wrong
	let tmp=this.topRow() + this.maxPageRows();
	if(tmp < this.maxRows()) this.setTopRow(tmp);
	let idx=this.index(); idx*=idx>=0;
	this.select(Math.min(idx + this.maxPageItems(), this.maxItems() - 1));
};
$pppp$.trimSel=function(idx){
	if(!idx&&idx!==0) return;
	idx^=0;
	let maxItems=this.maxItems();
	if(idx>=maxItems) idx=maxItems-1;
	if(idx<0) idx=0;
	this.select(idx);
};
$pppp$.processCancel = function(noSound) {
	if(!noSound) SoundManager.playCancel();
	this.updateInputData();
	this.deactivate();
	this.callCancelHandler();
};
$pppp$.touchOutsideFrame=none;
$r$=$pppp$.onTouch;
$d$=$pppp$.onTouch=$pppp$._onTouch_iw=function f(triggered,iw){ // "interact window" is a selectable
	if(!this.parent) return;
	if(!iw) return f.ori.call(this,triggered);
	let lastIndex = this.index();
	let x = this.canvasToLocalX(TouchInput.x);
	let y = this.canvasToLocalY(TouchInput.y);
	let hitIndex = this.hitTest(x, y);
	if(hitIndex >= 0){
		if(hitIndex === this.index()){
			if(triggered && this.isTouchOkEnabled()) this.processOk();
		}else if(this.isCursorMovable()) this.select(hitIndex);
	}else if(!this._touching) this.processTouchOutsideFrame(triggered,x,y,iw); // not click on 'this'
	else if(this._stayCount >= 10){
		if(y < this.padding) this.cursorUp();
		else if(y >= this.height - this.padding) this.cursorDown();
	}
	if(this.index() !== lastIndex) SoundManager.playCursor();
}; $d$.ori=$r$;
$pppp$.processTouchOutsideFrame=none;
$pppp$.refresh_do=function(){
	if(this.clearContents()) this.drawAllItems();
};
$pppp$.refresh=function(){
	SceneManager.addRefresh(this);
};
$pppp$.drawAllItems=function(){
	let i=this.topIndex();
	const ende=Math.min(this.maxItems(),this.maxPageItems()+i);
	if(ende>i) for(;ende!==i;++i){
		this._drawingIdx=i;
		this.drawItem(i);
	}
};
$pppp$=$aaaa$=undef;

// - itemCat
$aaaa$=Window_ItemCategory;
$pppp$=$aaaa$.prototype;
makeDummyWindowProto($aaaa$,true,true);
$r$=$pppp$.processOk;
$d$=$pppp$.processOk=function f(){
	if(this._lastScrollYs) this._itemWindow._scrollY=this._lastScrollYs[this._index]^0;
	if(this._lastIdxs){
		this._itemWindow.trimSel(this._lastIdxs[this._index]^0);
		this._itemWindow.refresh();
	}
	f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.processTouch=function(){
	if(this.isOpenAndActive()){
		if(TouchInput.isTriggered()){
			if(this.isTouchedInsideFrame()) this._touching = true;
			this.onTouch(true);
		}else if(TouchInput.isCancelled()){
			if(this.isCancelEnabled()) this.processCancel();
		}
		if(this._touching){
			if(TouchInput.isPressed()) this.onTouch(false);
			else this._touching = false;
		}
	}else this._touching = false;
};
$pppp$.processTouchOutsideFrame_ws=function(triggered,x,y,iws){
	for(let i=0;i!==iws.length;++i) if(this.processTouchOutsideFrame(triggered,x,y,iws[i])) return true;
};
$pppp$.processTouchOutsideFrame=function(triggered,x,y,iw){
	if(iw.constructor===Array) return this.processTouchOutsideFrame_ws(triggered,x,y,iw);
	if( triggered && this.isTouchOkEnabled() && iw.isTouchedInsideFrame() ){
		//this.processOk();
		if(this.isCurrentItemEnabled()){
			SoundManager.playCursor();
			this.updateInputData();
			this.deactivate();
			let idx=iw.hitTest(x+this.x-iw.x,y+this.y-iw.y);
			if(idx<0 && this._lastIdxs) idx=this._lastIdxs[this._index]^0;
			iw.trimSel(idx);
			//this.callOkHandler();
			iw.activate();
		}else this.playBuzzerSound();
		return true;
	}
};
$pppp$.onTouch=function(triggered){
	return this._onTouch_iw(triggered,this._itemWindow);
};
$pppp$.maxCols=function(){
	return this._maxCols||4;
};
$pppp$=$aaaa$=undef;

// - itemList
$aaaa$=Window_ItemList;
$pppp$=$aaaa$.prototype;
$k$='processCancel';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(noSound){
	if(!f.inited){
		f.recIdxTypes=new Set([Scene_Item,Scene_ExtStore]);
	}
	let lastScrollY=this._scrollY;
	{
		let sc=SceneManager._scene;
		if(sc && sc._itemWindow===this && f.recIdxTypes.has(sc.constructor)){
			let cat=sc._categoryWindow; //this.parent.parent._categoryWindow;
			if(!cat._lastIdxs) cat._lastIdxs=[];
			cat._lastIdxs[cat._index]=this._index;
			if(!cat._lastScrollYs) cat._lastScrollYs=[];
			cat._lastScrollYs[cat._index]=lastScrollY;
		}
	}
	f.ori.call(this,noSound);
	this._scrollY=lastScrollY;
	this.refresh(); // TODO: reduce this 'this.refresh'
}; $d$.ori=$r$;
$pppp$.processTouch=Window_ItemCategory.prototype.processTouch;
$pppp$.processTouchOutsideFrame=function(triggered,x,y,iw){
	if( triggered && this.isTouchOkEnabled() && iw.isTouchedInsideFrame() ){
		this.processCancel(true);
		let idx=iw.hitTest(x+this.x-iw.x,y+this.y-iw.y);
		if(idx>=0) iw.trimSel(idx);
	}
};
$pppp$.onTouch=function(triggered){
	return this._onTouch_iw(triggered,this.parent.parent._categoryWindow);
};
$d$=$pppp$.setCategory=function f(catKey){ // rewrite: return true if updated else false; use last scrollY;
	if (this._category !== catKey){
		this._category = catKey;
		this._scrollY=0;
		{
			let sc=SceneManager._scene;
			if(sc && f.tbl.has(sc.constructor)){
				let cat=sc._categoryWindow,tmp; //this.parent.parent._categoryWindow;
				//if(cat._lastIdxs && (tmp=cat._lastIdxs[cat._index])) this._index=tmp;
				if(cat._lastScrollYs && (tmp=cat._lastScrollYs[cat._index])) this._scrollY=tmp;
			}
		}
		this.refresh();
		//this.resetScroll();
		return true;
	}
	return false;
};
$d$.tbl=new Set([Scene_Item]);
$k$='selectLast';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if(this._index>=0) ; else f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.numberWidth=function(n){
	return this.textWidth('0')*(n===undefined?7:n);
};
$pppp$.maxCols=function(){
	return this._maxCols||$gameSystem._usr._itemListMaxCol||2;
};
$pppp$.drawItemNumber = function(item, x, y, width) {
	if (this.needsNumber()) {
		const w1=this.textWidth('0');
		const wc=width-w1*5;
		this.drawText(': ', x, y, wc, 'right');
		this.drawText($gameParty.numItems(item), x+wc, y, w1*3, 'right');
	}
};
$pppp$=$aaaa$=undef;

// - Window_SkillType
$aaaa$=Window_SkillType;
$pppp$=$aaaa$.prototype;
$pppp$.processTouchOutsideFrame=Window_ItemCategory.prototype.processTouchOutsideFrame;
$pppp$.processTouch=Window_ItemCategory.prototype.processTouch;
$pppp$.onTouch=function(triggered){
	return this._onTouch_iw(triggered,this._skillWindow);
};
$d$=$pppp$.makeCommandList=function f(omits){
	if(this._actor){
		this._actor.addedSkillTypes_arranged(omits).forEach(f.forEach, this); // omit non-battle skill types
		this.addCommand($dataCustom.passiveSkill.txt, 'skill', true, $dataCustom.passiveSkill.id);
	}
};
$d$.forEach=function(stypeId){
	this.addCommand($dataSystem.skillTypes[stypeId], 'skill', true, stypeId);
};
$pppp$=$aaaa$=undef;

// - Window_SkillList
$aaaa$=Window_SkillList;
$pppp$=$aaaa$.prototype;
$pppp$.processTouchOutsideFrame=Window_ItemList.prototype.processTouchOutsideFrame;
$pppp$.processTouch=Window_ItemList.prototype.processTouch;
$pppp$.onTouch=function(triggered){
	return this._onTouch_iw(triggered,this.parent.parent._skillTypeWindow);
};
$pppp$.setHelpWindowItem=function(item){
	if(this._helpWindow){
		if(item && item.skillId) item=$dataSkills[item.skillId];
		this._helpWindow.setItem(item);
	}
};
$pppp$.includes=function(item){
	return item && (item.meta.passive?this._stypeId===$dataCustom.passiveSkill.id:this._stypeId===item.stypeId);
};
$d$=$pppp$.makeItemList=function f(){
	if(this._actor){
		const a=this._actor;
		const c=a._skills_getUpdatedCache(),rtv=this._data=a.skills().filter(f.forEach, this);
		for(let x=0,arr=this._actor.currentClass().learnings;x!==arr.length;++x){
			// maybe not learn skills well, so still iterate all
			const id=arr[x].skillId;
			if(c.has(id)) continue;
			if(this.includes($dataSkills[id])) rtv.push(arr[x]);
		}
	}else if(this._data) this._data.length=0; else this._data=[];
};
$d$.forEach=function(item){ return this.includes(item); };
$pppp$.drawItem=function(index){
	let skill = this._data[index]; if(!skill) return;
	const costWidth = this.costWidth() , rect = this.itemRect(index);
	rect.width -= this.textPadding();
	if(skill.skillId){ // skill-not-learned-yet
		const s=$dataSkills[skill.skillId]; if(!s) return;
		this.contents.paintOpacity=64;
		this.changeTextColor('rgba(0,0,0,0.75)');
		this.drawItemName({iconIndex:s.iconIndex,name:"[Lv. "+skill.level+"] "+s.name}, rect.x, rect.y, rect.width - costWidth);
		skill=s;
	}else{
		this.changePaintOpacity(this.isEnabled(skill));
		this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
	}
	this.drawSkillCost(skill, rect.x, rect.y, rect.width);
	this.changePaintOpacity(true);
};
$pppp$=$aaaa$=undef;

// - evtItem
$aaaa$=Window_EventItem;
$pppp$=$aaaa$.prototype;
$pppp$.updatePlacement=function f(){
	// re-cal. windowHeight
	let sc=SceneManager._scene;
	if(sc){
		let h=Graphics.boxHeight,msg=sc._messageWindow;
		if(msg && msg._openness){
			let nf=msg._nameField;
			if(nf) h-=nf.enabled*nf.height;
			h-=msg.height;
		}
		if(this.height!==h){
			this.height=h;
			// refresh (without 'this.makeItemList')
			this.createContents();
			this.drawAllItems();
		}
	}
	// ori
	if((this._messageWindow.y<<1) >= Graphics.boxHeight) this.y = 0;
	else this.y = Graphics.boxHeight - this.height;
};
$pppp$=$aaaa$=undef;

// - msg
$aaaa$=Window_Message;
$pppp$=$aaaa$.prototype;
$pppp$.subWindows=function f(){
	return this._subWindows;
};
$k$='createSubWindows';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this._msg2=new Window_Message2();
	this._subWindows=[
		this._goldWindow, 
		this._choiceWindow, 
		this._numberWindow, 
		this._itemWindow, 
		this._msg2, 
	];
}; $d$.ori=$r$;
$k$='onEndOfText';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	this.inaline=false;
}; $d$.ori=$r$;
$r$=$pppp$.newPage;
$d$=$pppp$.newPage=function f(txtstat){
	this.clearLoopIcon();
	f.ori.call(this,txtstat);
}; $d$.ori=$r$;
$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	let fr=this.faceRef;
	if(fr && this.faceRef_updateID!==fr.texture._updateID){
		if(fr._character) this._drawFaceFromData(fr._character._genFaceData(fr));
	}
	return f.ori.call(this);
}; $d$.ori=$r$;
$k$='startMessage';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if(!isNone($gameMessage._evtName)) this._evtName=$gameMessage._evtName;
	if(!isNone($gameMessage._nameField)){
		let w=this.textWidth($gameMessage._nameField);
		w+=((this.standardPadding()+this.textPadding())<<1)+1;
		if(w<Window_Base._faceWidth) w=Window_Base._faceWidth;
		if(this.width<w) w=this.width;
		let arg0=[{txt:$gameMessage._nameField,align:"center"}];
		if(this._nameField) this._nameField.updateInfos(arg0,{width:w});
		else{
			this._nameField=new Window_CustomTextBoard(arg0,{noScroll:1,raw:1,y:-80,width:w,height:80});
			this._nameField.alpha=0;
		}
		this._nameField.downArrowVisible=false;
		this._nameField.enabled=1;
		this.addChild(this._nameField);
			// this._nameField will be 'removeChild' from 'this' @terminateMessage
		//this._moveTxtInput(); // not yet added to 'SceneManager._scene._windowLayer'
	}else if(this._nameField) this._nameField.enabled=this._nameField.alpha=0;
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$._moveTxtInput=function(){ // if 'this._nameField' is presented
	let wl=SceneManager._scene._windowLayer;
	if(wl){
		let txtIn=wl.children.back;
		if(txtIn&&txtIn.constructor===Window_CustomTextInput){
			// position of txtIn
			let newy=this.y+this._nameField.y-txtIn.height;
			if(newy<txtIn.y) txtIn.y=newy;
			if(txtIn.y<0){
				txtIn.y=-txtIn.lineHeight();
				txtIn.y-=txtIn.standardPadding();
			}
			return txtIn;
		}
	}
};
$k$='updateOpen';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	let op=this._opening;
	f.ori.call(this);
	if(this._opening===false && this._nameField && this._nameField.enabled){
		this._nameField.alpha=1; // must be run: when it is another person talking in the seq. of msg.
		if(op) this._moveTxtInput();
	}
	return this._opening;
}; $d$.ori=$r$;
$k$='updateClose';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if(this._closing && this._nameField) this._nameField.alpha=0;
	f.ori.call(this);
	return this._closing;
}; $d$.ori=$r$;
$k$='terminateMessage';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if(this._nameField!==undefined){
		//this.removeChild(this._nameField);
		//this._nameField.contents.clear();
		this._nameField.enabled=0;
	}
	return f.ori.call(this);
	//delete Input._currentState['ok'];
}; $d$.ori=$r$;
$pppp$.updateWait=function(){
	if(this._waitCount>0){
		const delta=Graphics.frameCount-this._lastFrameCnt;
		if(delta===0) --this._waitCount;
		else{
			if((this._waitCount-=delta)<0) return false;
			this._lastFrameCnt=Graphics.frameCount;
		}
		return true;
	}else return false;
};
$pppp$.updateInput=function(){
	if(this.isAnySubWindowActive()){
		return true;
	}
	if(this.pause){
		if(this.isTriggered()){
			if(this.printMinor){
				Input.update();
				this.printMinor=false;
				this._msg2._canStart=true;
				this._msg2.startMessage();
			}else{
				this.pause = false;
				if(!this._textState){
					if($gameMessage._windowCnt) this.pause=true;
					else{
						Input.update();
						this.terminateMessage();
					}
				}else Input.update();
			}
		}
		return true;
	}
	return false;
};
$pppp$.isAnySubWindowActive=function(){
	return (
		this._choiceWindow.active ||
		this._numberWindow.active ||
		this._itemWindow.active ||
		!this._msg2.isClosed() ||
		false
	);
};
$pppp$._drawFaceFromData=function(data){
	this.faceRef=data.ref;
	this.faceRef_updateID=data.ref.texture._updateID;
	let c=this.contents,tmp=d.ce('canvas');
	// cut others unrelated, prevents unknown smoothing colors
	tmp.width=data[3]; tmp.height=data[4];
	let ctx=tmp.getContext('2d');
	let img=data[0].constructor===HTMLCanvasElement?data[0]:data[0]._image;
	if(img) ctx.drawImage(img,
		data[1],data[2],data[3],data[4],
		0,0,data[3],data[4]
	);
	// re-arrange data to fit the function
	data[0]=tmp._canvas=tmp; data[2]=data[1]=0;
	c.clearRect(data[5]||data[1],data[6]||data[2],data[7]||data[3],data[8]||data[4]);
	c.blt.apply(c,data);
};
$d$=$pppp$.loadMessageFace=function f(){
	//debug.log('Window_Message.prototype.loadMessageFace');
	this.faceRef=undefined;
	if($gameMessage.faceIndex()==="data"){
		// all data provided, draw!
		let data=$gameMessage.faceName();
		this._drawFaceFromData(data);
	}else this._faceBitmap=ImageManager.reserveFace($gameMessage.faceName(), 0, this._imageReservationId, f.tbl);
};
$r$=$d$.tbl={reflect_h:true};
$d$=$pppp$.loadFace=function f(fn){
	return ImageManager.loadFace(fn,undefined,f.tbl);
};
$d$.tbl=$r$;
$k$='drawMessageFace';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if($gameMessage.faceIndex()==="data") return; // ensurance
	return f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.startWait=function(cnt){
	this._waitCount    = cnt;
	this._lastFrameCnt = Graphics.frameCount;
};
$pppp$=$aaaa$=undef;

// - battleLog
$aaaa$=Window_BattleLog;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	this._historyLines=[];
	this._lines=[];
	f.ori.call(this);
	this._methods=new Queue();
	this._historyNumLines=new Queue();
	this._fc=22;
	this._lastNumLines=undefined;
	this._maxLines=this.maxLines();
	this._mode=undefined;
}; $d$.ori=$r$;
$pppp$.maxLines=function(){
	return this._maxLines===undefined?10:this._maxLines;
};
$pppp$.numLines_arrange=function(curr){
	// **** O(N) CODE WARNING ****
	
	const q=this._historyNumLines;
	if(!q) return curr;
	
	while(q.length && q.front.fc+this._fc<=q.frameCount) q.pop();
	if(q.frameCount===Graphics.frameCount){
		const last=q.back;
		if(last && curr>=last.val) last.val=curr;
	}else{
		q.frameCount=Graphics.frameCount;
		q.push({val:curr,fc:q.frameCount,next:undefined,});
	}
	let rtv=0;
	q.forEach(obj=>(rtv<obj.val)&&(rtv=obj.val));
	return rtv;
};
$pppp$.numLines=function(){
	if(this._mode==='h'){
		const rtv=this._historyLines.length;
		return rtv<this._maxLines?rtv:this._maxLines;
	}else return this.numLines_arrange(this._lines.length);
};
$pppp$.messageSpeed=()=>0; // ori:16
$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	if(this._mode==='h'){
		this._historyNumLines.clear();
		Window_Selectable.prototype.update.call(this);
	}else{
		f.ori.call(this);
		const curr=this.numLines_arrange(this._lines.length);
		if(this._lastNumLines!==curr){
			this._lastNumLines=curr;
			this.refresh();
		}
	}
}; $d$.ori=$r$;
$pppp$.skipMeta=function(){
	let rtv=0;
	for(let q=this._methods;q.length&&q.front.name[0]==="-";q.shift())
		++rtv;
	return rtv;
};
$pppp$.callNextMethod=function(){
	this.skipMeta();
	if(this._methods.length){
		let method = this._methods.shift();
		if(method.name && this[method.name]){
			this[method.name].apply(this, method.params);
		}else throw new Error('Method not found: ' + method.name);
	}
	this.skipMeta();
};
$r$=$pppp$.addText;
$d$=$pppp$.addText=function f(txt){
	this._historyLines.push(txt);
	f.ori.call(this,txt);
}; $d$.ori=$r$;
$pppp$.popBaseLine=function(){
	const baseLine = this._baseLineStack.pop();
	if(this._lines.length>baseLine) this._lines.length=baseLine;
};
// Window_BattleLog.prototype.popupDamage
$k$='showAnimation';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(subject, targets, animationId, item){
	const p=Game_Action.prototype;
	const item2=p.getSelfItemObj(item);
	if(item2!==false){
		this._aniSubject=subject;
		this._aniSelfAniId = p.canForSelf(item2) ? item2.animationId : undefined;
	}else this._aniSubject=undefined;
	f.ori.call(this, subject, targets, animationId);
}; $d$.ori=$r$;
$d$=$pppp$.showNormalAnimation=function f(targets, animationId, mirror) {
	if($dataAnimations[animationId]){
		let delay = this.animationBaseDelay();
		let nextDelay = this.animationNextDelay();
		targets.forEach(target=>{
			if(this._aniSubject===target){
				if(this._aniSelfAniId<0){
					if(target.isActor()){ let aniId;
						f.tbl.forEach(k=>{ aniId=target[k](); if($dataAnimations[aniId]) target.startAnimation( aniId , mirror , delay ); });
					}else{ }
				}else{
					if($dataAnimations[this._aniSelfAniId]) target.startAnimation( this._aniSelfAniId , mirror, delay);
				}
			}else target.startAnimation( animationId , mirror , delay);
			delay += nextDelay;
		});
	}
};
$d$.tbl=[1,2].map(v=>'attackAnimationId'+v);
$pppp$.animationNextDelay=()=>2; // ori:12
$pppp$.clearLine=function(index){
	const rect = this.itemRectForText(index);
	this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};
$pppp$.maxItems=function(){
	return (this._mode==='h'?this._historyLines:this._lines).length;
};
$pppp$.setTopRow=function(row){ // setBottomRow use this function
	if(!(row>=0)) row=0;
	{ const t=this.maxTopRow(); if(row>=t) row=t; }
	const scrollY=(this._scrollIdx=row)* this.itemHeight();
	if(this._scrollY !== scrollY){
		this._scrollY = scrollY;
		this.refresh();
		this.updateCursor();
	}
};
$pppp$.refresh_do=function(){
if(this._mode==="h"){
	this.drawBackground();
	const viewCount=this.numLines() , scrollIdx=(this._scrollIdx|=0) , head=this._historyLines.length+". ";
	const headLen=head.length,headWidth=this.textWidth(head);
	this._scrollY=this.itemHeight()*scrollIdx;
	this.clearContents();
	this.resetTextColor();
	for(let x=0;x!==viewCount;++x) this.drawItem( scrollIdx+x , headLen , headWidth );
}else{
	let drawFrom=0;
	if(this._lastLines){
		drawFrom=this._lastLines.length;
		for(let x=0,last=this._lastLines,curr=this._lines;x!==last.length;++x){
			if(last[x]!==curr[x]){ drawFrom=x; break; }
		}
	}else this._lastLines=[];
	this.drawBackground();
	for(let i=drawFrom,last=this._lastLines,arr=this._lines,sz=Math.max(last.length,arr.length);i!==sz;++i){
		if(last[i]===arr[i]) continue;
		last[i]=arr[i];
		this.drawLineText(i);
	}
	this._lastLines.length=this._lines.length;
}
};
$pppp$.refresh=function(){
	SceneManager.addRefresh(this);
};
$pppp$.isRepeatedAnimationAction=function(action){
	return action.isKindOfAttack() && action.numRepeats()>0;
};
$pppp$.drawItem=function(index,headLength,headWidth){
	const rect=this.itemRect(index) , pad=this.textPadding();
	rect.x+=pad;
	rect.width-=pad<<1;
	if(headLength && headWidth){
		this.drawText((index+1+". ").padStart(headLength,' '), rect.x, rect.y, headWidth);
		rect.x+=headWidth;
		rect.width-=headWidth;
	}
	this.drawTextEx(this._historyLines[index], rect.x, rect.y, rect.width);
};
$pppp$.drawLineText=function(index,txt){
	const rect=this.itemRect(index);
	this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
	const pad=this.textPadding();
	this.drawTextEx(txt===undefined?this._lines[index]:txt, rect.x+pad, rect.y, rect.width-(pad<<1));
};
$pppp$.startAction=function(subject, action, targets){
	const item = action.item();
	this.push('performActionStart', subject, action);
	this.push('waitForMovement');
	this.push('performAction', subject, action);
	{
		const arr=[]; new Set(targets).forEach(x=>arr.push(x));
		if(!this.isRepeatedAnimationAction(action)) this.push('showAnimation', subject, arr.reverse(), item.animationId, item);
	}
	this.displayAction(subject, item);
};
$d$=$pppp$.displayActionResults=function f(subject,target,action){
	if(target.result().used){
		this.push('-actResStrt');
		if(this.isRepeatedAnimationAction(action)) this.push('showAnimation', subject, [target], action.item().animationId);
		this.displayCritical(target);
		if(subject!==target) this.push('popupDamage', target);
		this.push('popupDamage', subject);
		this.displayDamage(target);
		this.displayAffectedStatus(target);
		this.displayFailure(target);
		this.push('-actResEnde');
	}
};
// Window_BattleLog.prototype.displayDamage
$pppp$.displayStpDamage = function(target) {
	if (target.isAlive() && target.result().stpDamage !== 0) {
		if (target.result().stpDamage < 0) {
			this.push('performRecovery', target);
		}
		this.push('addText', this.makeStpDamageText(target));
	}
};
$pppp$.displayAffectedStatus=function(target){
	if (target.result().isStatusAffected()) {
		this.displayChangedStates(target);
		this.displayChangedBuffs(target);
	}
};
$pppp$.displayAddedStates=function(target){
	target.result().addedStateObjects().forEach(state=>{
		let stateMsg = target.isActor() ? state.message1 : state.message2;
		if(state.id === target.deathStateId()){
			this.push('performCollapse', target);
		}
		if(stateMsg){
			this.push('addText', target.name() + stateMsg);
			//this.push('waitForEffect');
		}
	});
};
$pppp$.makeStpDamageText = function(target) {
	let result = target.result();
	let damage = result.tpDamage;
	let isActor = target.isActor();
	let fmt;
	if (damage > 0) {
		fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
		return fmt.format(target.name(), $dataCustom.stp, damage);
	} else if (damage < 0) {
		fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
		return fmt.format(target.name(), $dataCustom.stp, -damage);
	} else {
		return '';
	}
};
$pppp$=$aaaa$=undef;

// - Window_PartyCommand;
$aaaa$=Window_PartyCommand;
$pppp$=$aaaa$.prototype;
$k$='makeCommandList';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	this.addCommand(TextManager.fight,	'fight');
	this.addCommand(TextManager.formation,	'swap');
	this.addCommand($dataCustom.plan.use,	'usePlan');
	this.addCommand($dataCustom.battle.allAtk,	'allAtk');
	this.addCommand($dataCustom.battle.allGuard,	'allGuard');
	this.addCommand($dataCustom.battle.allSpaceout,	'allSpaceout');
	this.addCommand($dataCustom.battle.viewLog,	'viewLog');
	this.addCommand(TextManager.escape,	'escape', BattleManager.canEscape());
}; $d$.ori=$r$;
$pppp$.setup=function(){
	this.clearCommandList();
	this.makeCommandList();
	this.refresh();
	if(this._index>=0) ; else this.select(0);
	this.activate();
	this.open();
};
$pppp$=$aaaa$=undef;

// - Window_ActorCommand
$aaaa$=Window_ActorCommand;
$pppp$=$aaaa$.prototype;
$pppp$.makeCommandList=function(){
	if(this._actor){
		this.addAttackCommand();
		this.addSkillCommands();
		this.addGuardCommand();
		this.addItemCommand();
		this.addSpaceoutCommand();
	}
};
$pppp$.addSkillCommands=function f(omits){
	Window_SkillType.prototype.makeCommandList.call(this,[16,]); // omit non-battle skill types
};
$pppp$.addSpaceoutCommand=function(){
	this.addCommand($dataCustom.spaceout, 'spaceout', this._actor.canSpaceout());
};

// - command
$aaaa$=Window_Command;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(x, y, kargs) {
	for(let i in kargs) this[i]=kargs[i];
	return f.ori.call(this,x,y);
}; $d$.ori=$r$;
$pppp$.windowWidth=function(){
	if(this._windowWidth===undefined){
		let defaultVal=240;
		return Math.min(defaultVal,this.maxWidth||defaultVal);
	}else return this._windowWidth;
};
$pppp$.windowHeight=function() {
	if(this._windowHeight===undefined){
		let defaultVal=this.fittingHeight(this.numVisibleRows());
		return Math.min(defaultVal,this.maxHeight||defaultVal);
	}else return this._windowHeight;
};
$pppp$.clearCommandList=function(){
	if(!this._list) this._list=[];
	this._list.length=0;
};
$pppp$.drawItem=function(index) {
	let rect=this.itemRectForText(index);
	let align = this.itemTextAlign();
	if(this._list[index] && this._list[index].once) this.contents.textColor=$dataCustom.textcolor.keyword;
	else this.resetTextColor();
	this.changePaintOpacity(this.isCommandEnabled(index));
	this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
$pppp$=$aaaa$=undef;

// - Window_HorzCommand
$aaaa$=Window_HorzCommand;
$pppp$=$aaaa$.prototype;
$pppp$.initialize=Window_Command.prototype.initialize;
$pppp$.maxCols=function(){
	return this._maxCols===undefined?4:this._maxCols;
};

// - Window_Help
$aaaa$=Window_Help;
$pppp$=$aaaa$.prototype;
makeDummyWindowProto($aaaa$,true);
$pppp$.refresh_do=function(){
	if(this._lastText===this._text) return;
	if(this.contents){
		this.createContents();
		this.drawTextEx(this._lastText=this._text, this.textPadding(), 0);
	}
};
$pppp$.refresh=function(){
	SceneManager.addRefresh(this);
};
$pppp$=$aaaa$=undef;

// - Window_BattleStatus
$aaaa$=Window_BattleStatus;
$pppp$=$aaaa$.prototype;
$d$=$pppp$.refresh_do=function f(){
	if(this.noRefresh) return;
	if(BattleManager._phase===f.key){
		let idx=$gameTemp._pt_battleMembers_actor2idx.get(BattleManager._subject);
		if(idx!==undefined && this._index!==idx) this.select(idx);
	}
	if(this.clearContents()) this.drawAllItems();
};
$d$.key="action";
$pppp$.refresh=function(){
	SceneManager.addRefresh(this);
};
$k$='drawBasicArea';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(r,a){
	if(a.stp!==undefined){
		const w=r.width>>2;
		r.width-=w;
		this.drawActorStp(a, r.x+r.width, r.y, w);
	}
	f.ori.call(this,r,a);
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

$aaaa$=Window_BattleActor;
$pppp$=$aaaa$.prototype;
$pppp$.numVisibleRows=function(){
	return ~~((Graphics.boxHeight - (this.standardPadding()<<1)) / this.lineHeight());
};
$r$=$pppp$.drawItem;
$d$=$pppp$.drawItem=function f(idx){
	Window_MenuActor.prototype.drawItemBackground.call(this,idx);
	f.ori.call(this,idx);
}; $d$.ori=$r$;
$pppp$.isCurrentItemEnabled=function(){
	if(this._mode!=='s'){ const act=BattleManager.inputtingAction();
	if(act){ const item=act.item(); if(item){
		const filter=item.filter||(item.filter=(item.meta.filter=item.meta.filter)&&objs._getObj(item.meta.filter));
		//const filter=item.filter||(item.filter=(item.meta.filter=item.meta.filter)&&eval('objs.'+item.meta.filter));
		if(filter) return filter(this.actor(),act.subject());
	} }
	} // swap party actors mode
	return true;
};
$pppp$.initialize=function(x,y){
	Window_BattleStatus.prototype.initialize.call(this);
	this._mode=undefined;
	this._pendingIndex=-1;
	this.x = x;
	this.y = y;
	this.openness = 255;
	this.hide();
};
$pppp$=$aaaa$=undef;

// - titleCommand
$aaaa$=Window_TitleCommand;
$pppp$=$aaaa$.prototype;
$pppp$.makeCommandList = function() {
	this.addCommand(TextManager.newGame,   'newGame');
	this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
	this.addCommand(TextManager.options,   'options');
	if(this.addCustomCommands) this.addCustomCommands();
};
$pppp$.addCustomCommands=function(){
	this.addCommand($dataCustom.usrSwitch,         'usrSwitch_global');
	this.addCommand(_global_conf.sep,'sep',false);
//	this.addCommand($dataCustom.saveLocal,         'saveLocal');
	this.addCommand($dataCustom.optSave.name,      'saveOpts');
	this.addCommand($dataCustom.fromLocalSave,     'loadLocalSave');
//	this.addCommand($dataCustom.fromOnlineSave,    'loadOnlineSave');
	this.addCommand(_global_conf.sep,'sep',false);
	this.addCommand($dataCustom.feedback,          'feedback');
	//this.addCommand(TextManager.testObjKey+":D",   'customTitleCmd'); // reserve this line for deleting 'TextManager.testObjKey' in the '.json' file
	//this.addCommand($dataCustom.CLOSEGAME, 'CLOSEGAME');
};

// - menuCommand
$aaaa$=Window_MenuCommand;
$pppp$=$aaaa$.prototype;
delete $pppp$.windowWidth; // use 'Window_Command.prototype.windowWidth'
$pppp$.initialize = function(x, y ,kargs) {
	Window_Command.prototype.initialize.call(this, x, y ,kargs);
	this.selectLast();
};
$pppp$.addCustomCommands=function(){
	this.addCommand($dataCustom.plan.name, 'plan');
	this.addCommand($dataCustom.apps,'apps');
};
$k$='addSaveCommand';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){ // overwrite for efficiency
	if ($dataSystem.menuCommands[5]) {
		let enabled = this.isSaveEnabled();
		this.addCommand(TextManager.save, 'save', enabled);
	//	this.addCommand($dataCustom.saveLocal,    'saveLocal', enabled);
		this.addCommand($dataCustom.optSave.name, 'saveOpts',  enabled);
	//	this.addCommand($dataCustom.saveOnline,   'saveOnline', enabled);
	}
}; $d$.ori=$r$;
$pppp$.addOnceCommand=function(){
	if(sha256(window['/tmp/']&&window['/tmp/'].V_I_M||'')==="0x321B146E4F257B81015ADF9BC4E84852334D134B27470E079838364188864AED"){
		this.addCommand('Visit It', 'gifts');
		this._list.back.once=1;
	}
};
$pppp$.addMainCommands=function(){ // 
	const enabled = this.areMainCommandsEnabled();
	if(this.needsCommand('item')){
		this.addCommand($dataCustom.itemSlot, 'item', enabled);
	}
	if(this.needsCommand('skill')){
		this.addCommand(TextManager.skill, 'skill', enabled);
	}
	if(this.needsCommand('equip')){
		this.addCommand(TextManager.equip, 'equip', enabled);
	}
	//if(this.needsCommand('status')) this.addCommand(TextManager.status, 'status', enabled);
};
$pppp$.makeCommandList = function() {
	this.addOnceCommand();
	if(debug.isdepress()) this.addCommand("debug2",'debugMenu2');
	this.addMainCommands();
	this.addFormationCommand();
	this.addCustomCommands();
	this.addCommand("=".repeat(64),'',0);
	this.addOptionsCommand();
	this.addCommand($dataCustom.usrSwitch,'usrSwitch');
	this.addCommand($dataCustom.feedback,'feedback');
	this.addSaveCommand();
	this.addGameEndCommand();
};
$pppp$=$aaaa$=undef;

// - Window_MenuStatus
$aaaa$=Window_MenuStatus;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.drawItem;
$d$=$pppp$.drawItem=function f(idx){
	const rect = this.itemRect(idx);
	const actor = $gameParty.members()[idx];
//	this.drawItemBackground(idx);
	if(idx===this._pendingIndex){
		let color = this.pendingColor();
		this.changePaintOpacity(false);
		this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
		this.changePaintOpacity(true);
	}
//	this.drawItemImage(idx);
	this.changePaintOpacity(actor.isBattleMember());
	this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
	this.changePaintOpacity(true);
//	this.drawItemStatus(idx);
	const x = rect.x + 162;
	const y = rect.y + (rect.height>>1) - this.lineHeight() * 1.5;
	let width = rect.width - x - this.textPadding();
	this.drawActorSimpleStatus(actor, x, y, width);
	
	this.changeTextColor("rgba(234,234,234,0.5)");
	this.drawText((idx+1)+'.',rect.x,y);
	this.resetTextColor();
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - Window_SkillList
$aaaa$=Window_SkillList;
$pppp$=$aaaa$.prototype;
$d$=$pppp$.drawSkillCost=function f(skill, x, y, width){
	let tmp;
	// width is the width of the skill's item rect
	x+=width;
	width>>=1;
	if((tmp=~~this.textWidth(f.key))<width) width=tmp;
	const w_4=width>>2;
	const d=(width>>3)+w_4;
	x-=w_4;
	let nextPad=0;
	if(tmp=this._actor.skillTpCost(skill)){
		this.changeTextColor(this.tpCostColor());
		this.drawText(tmp, x+nextPad, y, w_4, 'right');
		nextPad-=d;
	}
	if(tmp=this._actor.skillMpCost(skill)){
		this.changeTextColor(this.mpCostColor());
		this.drawText(tmp, x+nextPad, y, w_4, 'right');
		nextPad-=d;
	}
	if(tmp=this._actor.skillHpCost(skill)){
		this.changeTextColor(this.hpCostColor());
		this.drawText(tmp, x+nextPad, y, w_4, 'right');
		nextPad-=d;
	}
	return x-nextPad;
};
$d$.key='000 000 000';
$pppp$=$aaaa$=undef;

// - Window_EquipStatus
$aaaa$=Window_EquipStatus;
$pppp$=$aaaa$.prototype;
$k$='drawActorName';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(actor,x,y,width){
	const cw=this.contentsWidth()-this.textPadding();
	width=width||cw>>1;
	{
		const w2=width>>1;
		f.ori.call(this,actor,x,y,width+w2);
		width=w2;
	}
	this.changeTextColor("rgba(234,234,234,0.5)");
	this.drawText(($gameParty._menuActorIdx||0)+1, cw-width, y-(this.textPadding()>>1), width, 'right');
}; $d$.ori=$r$;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(x,y){
	this._noRefreshArrows=true;
	f.ori.call(this,x,y);
	this._page=0;
	this._rows=28;
	
	if($gameParty.members().length>1){
		this.downArrowVisible = this.upArrowVisible = true;
		//const y=(this.lineHeight()>>1)+this.standardFontSize()*0.375+this.textPadding();
	}
	this.rightArrowVisible = this.leftArrowVisible = true;
	
	this._itemOld=this._itemNew=undefined;
}; $d$.ori=$r$;
$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	f.ori.call(this);
	if(this._commandWindow.active) this._arrowsFloating();
}; $d$.ori=$r$;
$pppp$.drawAllVal=function(x,oy){
	const h=this.lineHeight()-((this.fontSize>>2)+1),txtpad=this.textPadding(),strt=this._page*this._rows-2,sz=Math.min(strt+this._rows,$dataSystem.terms.params.length);
	const x1=x+txtpad,x2=x+140,x3=x+189,x4=x+222,vals=[];
	oy-=h;
	
	for(let i=strt,y=oy;i<sz;++i) this.drawParamName(x1, y+=h, i);
	
	if(this._actor){ this.resetTextColor(); for(let i=strt,y=oy;i<sz;++i){
		this.drawText(vals[i]=this._actor.param(i), x2, y+=h, 48, 'right');
	} }
	
	// → 
	this.changeTextColor(this.systemColor());
	for(let i=strt,y=oy;i<sz;++i) this.drawText('\u2192', x3, y+=h, 32, 'center');
	
	const item=this._itemNew;
	if(item!==undefined && this._actor){
		const ori=this._itemOld;
		// queried above, must have cache
		this._actor._equips_editCache_del(ori);
		this._actor._equips_editCache_add(item);
		for(let i=strt,y=oy;i<sz;++i){
			const val=this._actor.param(i);
			this.changeTextColor(this.paramchangeTextColor(val-vals[i]));
			this.drawText(val, x4, y+=h, 48, 'right');
		}
		this._actor._equips_editCache_del(item);
		this._actor._equips_editCache_add(ori);
	}
};
$pppp$.pageTotal=function(){
	return Math.ceil(($dataSystem.terms.params.length+2)/this._rows);
};
$pppp$.refresh_do=function(){
	if(this.clearContents() && this._actor){
		this.drawActorName(this._actor, this.textPadding(), 0);
		const h=this.lineHeight();
		let y=0;
		{
			const a=this._actor;
			const x1=this.textPadding();
			const cw=this.contentsWidth()-(x1<<1);
			const w=(cw*31)>>6;
			const x2=x1+cw-w;
			
			this.changeTextColor(this.systemColor());
			this.drawText($dataCustom.currExp+' / '+$dataCustom.nextExp,x1,y+=h,w,'left');
			
			{ let tmp=a.currentExp()+' / ';
			tmp+=a.isMaxLevel()?"-".repeat(7):a.nextLevelExp();
			this.resetTextColor();
			this.drawText(tmp,x2,y,w,'right');
			}
			
			this.changeTextColor(this.systemColor());
			{ const pgy=this.contentsHeight()-h+(h>>3);
			this.drawText("page",x1-(h>>3),pgy,w,'left');
			this.resetTextColor();
			this.drawText((this._page+1)+' / '+this.pageTotal(),x2,pgy,w,'right');
			}
		}
		//for(let i=-2,sz=$dataSystem.terms.params.length;i!==sz;++i) this.drawItem(0, y+=h, i);
		this.drawAllVal(0,y+=h);
	}
	
};
$pppp$.refresh=function(){
	SceneManager.addRefresh(this);
};
$pppp$=$aaaa$=undef;

// - Window_EquipCommand
$aaaa$=Window_EquipCommand;
$pppp$=$aaaa$.prototype;
makeDummyWindowProto($aaaa$,true,true);
$pppp$.cursorLeft=function(trig){
	const w=this._statusWindow;
	if(w){
		let ch=false;
		if(ch=w._page>0) --w._page;
		else if(ch=trig) w._page=w.pageTotal()-1;
		if(ch) SoundManager.playCursor();
		w.refresh(); // so that players can refresh themselves
	}
};
$pppp$.cursorRight=function(trig){
	const w=this._statusWindow;
	if(w){
		let ch=false;
		if(ch=++w._page<w.pageTotal()) ;
		else if(ch=trig) w._page=0;
		else --w._page;
		if(ch) SoundManager.playCursor();
		w.refresh(); // so that players can refresh themselves
	}
};
$pppp$.processTouch=Window_ItemCategory.prototype.processTouch;
$pppp$.processTouchOutsideFrame=Window_ItemCategory.prototype.processTouchOutsideFrame;
$pppp$.onTouch=function(triggered){
	this.touchUpDnArrowsPgUpDn(triggered,this._statusWindow) ||
		this.touchLfRhArrowsLfRh(triggered,this._statusWindow) ;
	return this._onTouch_iw(triggered,this._slotWindow);
};
$pppp$.maxCols=()=>1;
$pppp$=$aaaa$=undef;

// - Window_EquipSlot
$aaaa$=Window_EquipSlot;
$pppp$=$aaaa$.prototype;
{ $tttt$=Window_ItemCategory.prototype;
$pppp$.processTouch                = $tttt$.processTouch;
$pppp$.processTouchOutsideFrame    = $tttt$.processTouchOutsideFrame;
$pppp$.processTouchOutsideFrame_ws = $tttt$.processTouchOutsideFrame_ws;
}
$pppp$.onTouch=function(triggered){
	const args=[];
	if(this._itemWindow) args.push(this._itemWindow);
	if(this._commandWindow) args.push(this._commandWindow);
	return this._onTouch_iw(triggered,args);
};
$k$='deactivate';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if(this._scrollYM) this._scrollYM.set(this._actor,this._scrollY);
	f.ori.call(this);
}; $d$.ori=$r$;
$pppp$.reselIdx=function(noUpdate){
	const lastSel=this._lastSelM.get(this._actor);
	let idx;
	if(lastSel){
		const i=lastSel[0]+1;
		const idxB=this._slotIdTbl[i];
		if(lastSel[1]===undefined) idx=idxB; // [-1,0,...]
		else{
			const L=this._slotIdTbl[i+1]-idxB;
			if(!L) idx=idxB;
			else if(L>lastSel[1]) idx=(idxB+lastSel[1]);
			else idx=(idxB+L-1);
		}
	}else idx=0;
	if(!(idx>=0)) idx=0; // prevent some weird error
	if(!noUpdate) this._index=idx;
	return idx;
};
Object.defineProperty($aaaa$.prototype,'_index',{
	get:function(){return this._idx;},
	set:function(rhs){
		if(this._idx===rhs) return rhs;
		this._idx=rhs;
		if(this._actor && this._itemWindow) this.update_slotId();
		return this._idx;
	},
});
$pppp$.initialize = function(x, y, width, height) {
	this._noRefreshArrows=true;
	Window_Selectable.prototype.initialize.call(this, x, y, width, height);
	this._actor = null;
	this._slotId=~0;
	this._slotIdExt=undefined;
	this._slotIdTbl=[-1,0];
	this.__slotIdExt=this.__slotId=undefined; // rtv of 'this._calSlotId'
	this._scrollYM=new Map();
	this._lastSelM=new Map(); // actor -> [slotId , slotIdExt]
	//this._lastIdxM=new Map(); // info not enough, changed to 'this._lastSelM'
	this._lastIdx=undefined; // prevent repeated 'this.setSlotId'
	this.refresh();
};
$pppp$._setSlotIdTbl=function(){
	this._slotIdTbl.length=2;
	for(let x=0,tbl=this._slotIdTbl,es=this._actor._equips;x!==es.length;++x){
		let arr=es[x];
		if(arr&&arr.constructor===Array) tbl.push(tbl.back+arr.length);
		else tbl.push(tbl.back+1);
	}
};
$pppp$._idx2slotId=function(idx){
	return this._slotIdTbl.lower_bound(idx+1)-2; // -1-1
};
$pppp$.setActor=function(actor){
	if(this._actor===actor) return;
	this._actor = actor;
	this._scrollY = this._scrollYM.get(actor)|0;
	this._setSlotIdTbl();
	this.reselIdx();
	const iw=this._itemWindow;
	if(iw){
		this.update_slotId(); // sync info
		this.updateStatus();
		if(this.cursorShown()) this.updateCursor();
		iw.updateStatus();
		if(iw.cursorShown()) iw.updateCursor();
	}
	this.ensureCursorVisible();
	this.refresh();
};
$pppp$._calSlotId=function(idx){ // just cal. prepared to be use. maybe not now
	this.__slotId=this._idx2slotId(idx);
	const tmp=this._actor._equips[this.__slotId];
	this.__slotIdExt=(tmp&&tmp.constructor===Array)?idx-this._slotIdTbl[this.__slotId+1]:undefined;
};
$pppp$.update_slotId=function(){ // actual update
	this._lastIdx=this._index;
	this._calSlotId(this._index);
	this._itemWindow.setInfo(this._actor,this.__slotId,this.__slotIdExt);
	this._slotId=this.__slotId;
	this._slotIdExt=this.__slotIdExt;
	if(this._index>=0) this._lastSelM.set(this._actor,[this._slotId,this._slotIdExt,]);
};
$pppp$.update=function(){
	Window_Selectable.prototype.update.call(this);
	if(this._lastIdx!==this._index&&this._itemWindow){
		this.update_slotId();
	}
};
$pppp$.maxItems=function(){
	return this._actor ? this._slotIdTbl.back : 0;
};
$pppp$.item=function(){
	return this._actor ?( this._slotIdExt===undefined?this._actor.equips()[this._slotId]:this._actor.equips()[this._slotId][this._slotIdExt] ): null;
};
$pppp$.drawItem=function(index){
	if(this._actor){
		this.changeTextColor(this.systemColor());
		this.changePaintOpacity(this.isEnabled(index));
		const rect = this.itemRectForText(index);
		const headerW=87,pad=8;
		this.drawText(this.slotName(index), rect.x, rect.y, headerW-pad, this.lineHeight());
		this._calSlotId(index);
		this.drawItemName(this.__slotIdExt===undefined?this._actor.equips()[this.__slotId]:this._actor.equips()[this.__slotId][this.__slotIdExt], rect.x + headerW , rect.y , rect.width - headerW );
		this.changePaintOpacity(true);
	}
};
$pppp$.slotName=function(index){ // TODO: prevent search (now is binary search)
	const slots = this._actor.equipSlots() , slotId = this._idx2slotId(index);
	return this._actor ? $dataSystem.equipTypes[slots[slotId]] : '';
};
$pppp$.isEnabled=function(idx){
	this._calSlotId(idx);
	return this._actor ? this._actor.isEquipChangeOk(this.__slotId,this.__slotIdExt) : false;
};
$pppp$.updateStatus=function(noRefresh){
	// cursor on slot , update itemOld
	const sw=this._statusWindow;
	if(sw && this._actor){
		let new_itemOld;
		if(this._itemWindow.cursorShown()){
			const eq=this._actor.equips()[this._slotId];
			new_itemOld=eq&&eq.constructor===Array?eq[this._slotIdExt]:eq;
		}else new_itemOld=null;
		if(sw._itemOld!==new_itemOld){
			sw._itemOld=new_itemOld;
			if(!noRefresh) sw.refresh();
			return true;
		}
	}
};
$pppp$.updateHelp=function(){
	Window_Selectable.prototype.updateHelp.call(this);
	this.setHelpWindowItem(this.item());
	
	let needRefresh=false; // this._statusWindow
	// update itemOld
	if(this.updateStatus(true)) needRefresh=true; // don't refresh status in the function
	// update itemNew
	if(this._itemWindow && this._itemWindow.updateStatus()){
		needRefresh=false; // had been refreshed
	}
	if(needRefresh) this._statusWindow.refresh();
};
$pppp$=$aaaa$=undef;

// - Window_EquipItem
$aaaa$=Window_EquipItem;
$pppp$=$aaaa$.prototype;
{ $tttt$=Window_ItemCategory.prototype;
$pppp$.processTouch                = $tttt$.processTouch;
$pppp$.processTouchOutsideFrame    = $tttt$.processTouchOutsideFrame;
$pppp$.processTouchOutsideFrame_ws = $tttt$.processTouchOutsideFrame_ws;
}
$pppp$.onTouch=function(triggered){
	const args=[];
	if(this._slotWindow) args.push(this._slotWindow);
	if(this._commandWindow) args.push(this._commandWindow);
	return this._onTouch_iw(triggered,args);
};
Object.defineProperty($aaaa$.prototype,'_index',{
	get:function(){return this._idx;},
	set:function(rhs){
		if(this._idx===rhs) return rhs;
		this._idx=rhs;
		if(this._logIdx) this._logIdx();
		return this._idx;
	},
});
$pppp$.initialize=function(x, y, w, h){
	this._noRefreshArrows=true;
	Window_ItemList.prototype.initialize.call(this, x, y, w, h);
	this._actor = null;
	this._slotId = ~0;
	this._slotIdExt = undefined;
	this._newUnEquip = null;
	this._putIdx=this._logIdx=undefined;
};
$pppp$.setInfo=function(actor,slotId,slotIdExt){
	if(this._actor===actor && this._slotId===slotId){
		// same actor and slot , only log idx
		if(this._slotIdExt===slotIdExt) return; // exact same , don't waste time
		else{
			this._slotIdExt=slotIdExt;
			if(this._putIdx) this._putIdx();
		}
	}else{
		// refresh
		this._actor=actor;
		this._slotId=slotId;
		this._slotIdExt=slotIdExt;
		this.makeItemList();
		if(this._putIdx) this._putIdx();
		this.refresh();
	}
};
$d$=$pppp$.makeItemList=function f(){
	if(this._data){
		const arr=this._data;
		if( arr.a===this._actor && arr.s===this._slotId ){
			const oldItem=this.item(),newItem=this._newUnEquip; this._newUnEquip=null;
			if(newItem===oldItem) return; // result unchaged
			if(newItem && $gameParty.numItems(newItem)===1){
				if(arr.length && arr.back===null){
					arr.back=newItem;
					if(oldItem && $gameParty.numItems(oldItem)===0){
						const idx=arr.indexOf(oldItem);
						if(idx!==-1) arr[idx]=arr.pop();
					}
					arr.sort(DataManager.sortCmp);
					arr.push(null);
				}else{
					arr.push(newItem);
					if(oldItem && $gameParty.numItems(oldItem)===0){
						const idx=arr.indexOf(oldItem);
						if(idx!==-1) arr[idx]=arr.pop();
					}
					arr.sort(DataManager.sortCmp);
				}
			}else{
				// same (actor,slot) and no new item
				// usually only 1 #(obj) become 0
				for(let x=arr.length;x--;) if(arr[x] && !$gameParty.numItems(arr[x])) arr.splice(x,1);
			}
			return;
		}
	}
	const etype=this._actor.equipSlots()[this._slotId];
	if(this._data && this._data.length) this._data.length=0;
	if(this._slotId>=0){
		if(etype===1) this._data=$gameParty.weapons().filter(this.includes,this);
		else this._data=$gameParty.armors().filter(this.includes,this);
	}
	if(this.includes(null)) this._data.push(null); // for un-equip
	this._data.a=this._actor;
	this._data.s=this._slotId;
};
$pppp$.setSlotId=function(idx,ext){
	this._slotIdExt = ext;
	if(this._slotId !== idx){
		this._slotId = idx;
		this.refresh();
		this.resetScroll();
	}
};
$pppp$.updateStatus=function(noRefresh){
	// set new item , refresh temp status (though original value will be drawn again)
	const sw=this._statusWindow;
	if(sw && this._actor){
		const item=this.cursorShown()?this.item():undefined;
		if(sw._itemNew!==item){ // prevent me writing some ugly that drops FPS
			sw._itemNew=item;
			if(item!==undefined){
				const eq=this._actor.equips()[this._slotId];
				sw._itemOld=eq&&eq.constructor===Array?eq[this._slotIdExt]:eq;
			}// else by slotWindow
			if(!noRefresh) sw.refresh();
			return true;
		}
	}
};
$pppp$.updateHelp=function() {
	Window_ItemList.prototype.updateHelp.call(this);
	this.updateStatus();
};
$pppp$=$aaaa$=undef;
$tttt$={};

// - Window_Status
$aaaa$=Window_Status;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.onTouch;
$d$=$pppp$.onTouch=function f(triggered){
	this.touchUpDnArrowsPgUpDn(triggered,this);
	return f.ori.call(this,triggered);
}; $d$.ori=$r$;
$k$='initialize';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	if(this._arrows_actor = $gameParty.members().length>1){
		this.downArrowVisible = this.upArrowVisible = true;
		const y=this.textPadding(); //(this.lineHeight()>>1)+this.standardFontSize()*0.375+this.textPadding();
		this._downArrowSprite.x = this._upArrowSprite.x = this.width>>1;
		this._downArrowSprite.y = this.height - (this._upArrowSprite.y = y);
		this.addChild(this._downArrowSprite);
		this.addChild(this._upArrowSprite);
	}
}; $d$.ori=$r$;
$pppp$.updateArrows=function(){
	this.downArrowVisible = this.upArrowVisible =  this._arrows_actor;
};
$r$=$pppp$.update;
$d$=$pppp$.update=function f(){
	f.ori.call(this);
	this._arrowsFloating();
}; $d$.ori=$r$;
$k$='drawBlock1';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(y){
	f.ori.call(this,y);
	const cw=this.contentsWidth()-this.textPadding();
	const w=cw>>2;
	const x=cw-w;
	const w_8=w>>3;
	const w3=w_8*3;
	const w4=w>>4;
	this.drawActorStp(this._actor, x, y, w3);
	this.drawActorTp(this._actor, x+w3+w4, y, w3);
	this.changeTextColor("rgba(234,234,234,0.5)");
	this.drawText(''+($gameParty._menuActorIdx||0), cw-w_8, y-this.textPadding(), w_8, 'right');
	this.resetTextColor();
}; $d$.ori=$r$;
$pppp$.drawExpInfo=function(x,y){
	const expTotal = TextManager.expTotal.format(TextManager.exp);
	const expNext = TextManager.expNext.format(TextManager.level);
	this.changeTextColor(this.systemColor());
	const lineHeight = this.lineHeight();
	this.drawText(expTotal, x, y + lineHeight * 0, 270);
	this.drawText(expNext, x, y + lineHeight * 2, 270);
	this.resetTextColor();
	const value1 = this._actor.currentExp();
	const value2 = this._actor.isMaxLevel()?'-------':this._actor.nextRequiredExp();
	this.drawText(value1, x, y + lineHeight * 1, 270, 'right');
	this.drawText(value2, x, y + lineHeight * 3, 270, 'right');
};
$pppp$.drawEquipments=function(x,y){
	const equips = this._actor.equips().flat();
	const count = Math.min( equips.length, this.maxEquipmentLines() );
	for(let i=0;i!==count;++i){
		this.drawItemName(equips[i], x, y + this.lineHeight() * i);
	}
};
$pppp$=$aaaa$=undef;

// - options
$aaaa$=Window_Options;
$pppp$=$aaaa$.prototype;
$pppp$.statusWidth=function(){
	return 89;
};
$pppp$.volumeStatusText=val=>val+"% ";
$pppp$.processOk = function() {
	if(this.leftArrowVisible && this._onTouch_ing){
		let ori=this.getGlobalPosition();
		let rect=this.itemRectForText(this._index);
		let la=this._leftArrowSprite,ra=this._rightArrowSprite;
		let xl=la.getGlobalPosition().x,xu=ra.getGlobalPosition().x;
		let sw=xu-xl;
		rect.y+=ori.y; rect.height+=this.textPadding()<<1;
		let tx=TouchInput.x,ty=TouchInput.y;
		if(ty<rect.y||ty>=rect.y+rect.height) return;
		let x=TouchInput.x-xl;
		if(x<-la.width||x>=sw) return;
		if(x<(sw>>1)) this.cursorLeft();
		else this.cursorRight();
		return;
	}
	let index = this.index();
	let symbol = this.commandSymbol(index);
	let value = this.getConfigValue(symbol);
	if (this.isVolumeSymbol(symbol)) {
//		value -= this.volumeOffset();
//		if (value < 0) value = 100;
//		value = value.clamp(0, 100);
//		this.changeValue(symbol, value);
		SoundManager.playBuzzer();
		return;
	}else this.changeValue(symbol, !value);
};
$pppp$._volumeOffset = _global_conf["default volume offset"] || 10 ;
$pppp$.volumeOffset=function(){
	return this._volumeOffset;
};
$k$='updateArrows';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	let la=this._leftArrowSprite,ra=this._rightArrowSprite;
	if(this._lastIdx!==this._index){
		this._lastIdx=this._index;
		let s="Volume";
		let flag=this._list[this._index].symbol.slice(-s.length)===s;
		this.rightArrowVisible=this.leftArrowVisible=flag;
		if(flag){
			let rect=this.itemRectForText(this._index);
			let xbase=rect.x+rect.width;
			let y=rect.y+this.lineHeight()+((rect.heigh)>>1);
			la.move(xbase-this.statusWidth(),y);
			ra.move(xbase+ra.width,y);
		}
	}
	this.ctr^=0; ++this.ctr;
	if(this.leftArrowVisible){
		let s=Math.sin(this.ctr*f.rad1)/2;
		la.anchor._x=0.5-s;
		ra.anchor._x=0.5+s;
	}
}; $d$.ori=$r$;
$d$.rad1=PI_64;
$k$='processTouch';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
}; $d$.ori=$r$;
$r$=$pppp$.onTouch;
$d$=$pppp$.onTouch=function f(triggered){
	this._onTouch_ing=true;
	f.ori.call(this,triggered);
	this._onTouch_ing=undefined;
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - choicelist
$aaaa$=Window_ChoiceList;
$pppp$=$aaaa$.prototype;
$pppp$._minChoiceWidth = _global_conf["min choicebox width"];
$pppp$.maxChoiceWidth = function() {
	const maxWidth = this._minChoiceWidth;
	let tmp=maxWidth.toString().toUpperCase();
	if(tmp==="MAX") return Graphics.boxWidth;
	if(!(maxWidth>=96)) maxWidth=96; // original setting
	const choices=$gameMessage.choices();
	for(let i=0;i!==choices.length;++i){
		const choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
		//debug("Window_ChoiceList.prototype.maxChoiceWidth",i,choiceWidth);
		if(maxWidth<choiceWidth) maxWidth=choiceWidth;
	}
	return maxWidth;
};
$pppp$._moveTxtInput=function(){
	let wl=SceneManager._scene._windowLayer;
	if(wl){
		let txtIn=wl.children.back;
		if(txtIn&&txtIn.constructor===Window_CustomTextInput){
			// position of txtIn
			let newy=this.y-txtIn.height;
			if(newy<txtIn.y) txtIn.y=newy;
			if(this._opening) txtIn.y+=(this.height>>1)*(1-this.openness/256); // 'WindowLayer.prototype._maskWindow'
			//debug.log(txtIn.y);
			if(txtIn.y<0){
				txtIn.y=-txtIn.lineHeight();
				txtIn.y-=txtIn.standardPadding();
			}
			return txtIn;
		}
	}
};
$k$='updateOpen';
$r$=$pppp$[$k$];
$d$=$pppp$[$k$]=function f(){
	if(this._opening){
		f.ori.call(this); // return undefined
		let txtIn=this._moveTxtInput();
		if(this._opening===false && txtIn && txtIn.y>=0) txtIn.y=this.y-txtIn.height;
	}
}; $d$.ori=$r$;
$pppp$.updatePlacement = function() { // called in 'this.start' ; then no called
	let positionType = $gameMessage.choicePositionType();
	let messageY = this._messageWindow.y;
	this.width = this.windowWidth();
	this.height = this.windowHeight();
	let x=0;
	switch (positionType) {
		default: case 0: {
		}break;
		case 1: {
			x+=(Graphics.boxWidth-this.width)>>1;
		}break;
		case 2: {
			x+=Graphics.boxWidth-this.width;
		}break;
	}
	this.x=x;
	let y=messageY;
	y+=(y<<1)>=Graphics.boxHeight?-this.height:this._messageWindow.height;
	this.y=y;
	
	// window-txtinput
	let txtIn=this._moveTxtInput();
	if(txtIn){
		let rrrr=this.update;
		let dddd=this.update=function f(){
			if(this.isOpening()){ f.ori.call(this); }
		}; dddd.ori=rrrr; // update until is open
		rrrr=txtIn.destructor;
		dddd=txtIn.destructor=function f(){
			f.ch.update=f.ch.update.ori;
			f.ch.active=false;
			f.ch.close();
			delete this.destructor;
			f.ori.call(this);
		}; dddd.ori=rrrr;
		dddd.ch=this;
	}
};
$r$=$pppp$.start;
$d$=$pppp$.start=function f(){
	let rtv=f.ori.call(this),nf=SceneManager._scene._messageWindow._nameField;
	if(nf&&nf.enabled){
		if((this.y-=nf.height)<0){
			this.height+=this.y;
			this.y=0;
		}
	}
	return rtv;
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - savefilelist
$aaaa$=Window_SavefileList;
$pppp$=$aaaa$.prototype;
$pppp$.drawGameTitle=function(info, x, y, width){
	if(info.title){
		if(info.label) this.drawText(DataManager.titleAddName(info)+' - '+info.label, x, y, width);
		else this.drawText(DataManager.titleAddName(info), x, y, width);
	}
};
$pppp$.drawPartyCharacters = function(info, x, y) {
	if (info.characters&&info.characters.length>0) {
		for (let i = 0; i !== info.characters.length; ++i) {
			let data = info.characters[i] , sx=x + i * 48;
			if(this.width<sx) break;
			this.drawCharacter(data[0], data[1], sx, y);
		}
	}
};
$pppp$=$aaaa$=undef;
$pppp$=$aaaa$=undef;

// - Window_ShopNumber
$aaaa$=Window_ShopNumber;
$pppp$=$aaaa$.prototype;
$pppp$.processNumberChange = function() { // rewrite: add: shift*10
	if (this.isOpenAndActive()) {
		let t10=Input.isPressed('shift')*9+1;
		if(Input.isRepeated('right')) this.changeNumber(t10*1);
		if(Input.isRepeated('left')) this.changeNumber(t10*-1);
		if(Input.isRepeated('up')) this.changeNumber(t10*10);
		if(Input.isRepeated('down')) this.changeNumber(t10*-10);
	}
};
$pppp$=$aaaa$=undef;

// - Window_ShopStatus
$aaaa$=Window_ShopStatus;
$pppp$=$aaaa$.prototype;
$d$=$pppp$.drawItemEffect=function f(item){
	// item = $data* items weapons armors
	if(!item) return;
	const ox=this.textPadding(),lh=this.lineHeight(),cw=this.contentsWidth();
	const ox2=(ox<<1);
	const w=cw-ox2 , cw_2=cw>>1;
	const w_2=w>>1;
	const x2=cw_2+ox;
	const w2=cw_2-ox2;
	const w2_4=w2>>2;
	this.changeTextColor(this.systemColor());
	this.drawPossession(x2,0);
	const fontsize=this.standardFontSize();
	//this.setFontsize((fontsize>>1)+(fontsize>>3));
	{ let needDraw=false;
		if(!f.actor){
			const a=f.actor=new Game_Actor(8);
			a.paramMax=f.max;
			a.paramMin=f.min;
		}
		const a=f.actor;
		switch(item.itemType){
		case 'w': {
			a._equips[0].setEquip(true  ,item.id);
			a._equips[1].setEquip(false ,0);
			a.refresh(needDraw=true);
		}break;
		case 'a': {
			a._equips[0].setEquip(true  ,0);
			a._equips[1].setEquip(false ,item.id);
			a.refresh(needDraw=true);
		}break;
		}
		if(needDraw){
			a.clearCache();
			this.changeTextColor(this.systemColor());
			this.drawText($dataCustom.equAbl, ox, 0, w2);
			this.drawText($dataCustom.canEqu, x2, lh, w2);
			for(let x=0,y=lh<<1,arr=$gameParty.allMembers();x!==arr.length;++x){
				if(arr[x].canEquip(item)){
					this.resetTextColor();
					this.drawText(arr[x].name(), x2, y, w2);
					this.changeTextColor("rgba(234,234,234,0.5)");
					this.drawText((x+1)+'.', x2, y, w2, 'right');
					y+=lh;
				}
			}
			let tmp=w2-w2_4;
			for(let i=-2,y=lh<<1,h=this.lineHeight(),ch=this.contentsHeight(),w3=tmp-ox2,x3=tmp+ox,sz=$dataSystem.terms.params.length;i!==sz;++i){
				let p=(0<=i&&i<8)?f.actor.paramPlus(i):Number(f.actor.param(i));
				if(i===-1) --p; // action times
				if(!p || ($dataSystem.terms.isMul[i] && p===1)) continue; // expRate
				this.changeTextColor(this.systemColor());
				this.drawText(TextManager.param(i), ox, y, w3);
				this.changeTextColor(this.paramchangeTextColor(i===-2?p-1:p));
				if($dataSystem.terms.isMul[i]) p="*"+p;
				else if(p>0) p="+"+p;
				this.drawText(p, x3, y, w2_4, 'right');
				y+=h;
				if(y>=ch) break; // out of draw bound
			}
		}
	}
	this.setFontsize(fontsize);
};
$d$.max=()=>Infinity;
$d$.min=()=>-Infinity;
$pppp$.refresh_do=function(){
	if(!this.clearContents()) return;
	this.drawItemEffect(this._item);
};
$pppp$.refresh=function(){
	SceneManager.addRefresh(this);
};
//$pppp$.drawEquipInfo=0;
$pppp$.currentEquippedItem = function(actor, etypeId){
	const equips = actor.equips() , slots = actor.equipSlots() , list = [];
	for(let i=0;i!==slots.length;++i){
		if(slots[i] === etypeId){
			if(equips[i]&&equips[i].constructor===Array){
				for(let x=0,arr=equips[i];x!==arr.length;++x) if(arr[x]) list.push(arr[x]);
			}else if(equips[i]) list.push(equips[i]);
		}
	}
	const paramId = this.paramId();
	let worstParam = Number.MAX_VALUE , worstItem = null;
	for(let j=0;j!==list.length;++j){
		if(list[j].params[paramId] < worstParam){
			worstParam = list[j].params[paramId];
			worstItem = list[j];
		}
	}
	return worstItem;
};
$pppp$=$aaaa$=undef;

// --- --- BEG debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---



$rrrr$=$r$=$dddd$=$d$=$kkkk$=$k$=$pppp$=$aaaa$=$tttt$=$t$=undef; // t
// --- --- END debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

if(objs.isDev) console.log("obj_t");
