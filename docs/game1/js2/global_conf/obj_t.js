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
(Input.clear=function f(keyOnly){
	//debug.log('Input.clear');
	if(!keyOnly) TouchInput.clear();
	if(this.kstat){ this.kstat.length=0; this.kstat.length=256; }
	else this.kstat=[];
	return f.ori.call(this);
}).ori=$r$;
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
(Input._onKeyUp=function f(e){
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
}).ori=$r$;
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
($aaaa$.clear=function f(){
	this._dx=undefined;
	this._dy=undefined;
	f.ori.call(this);
}).ori=$r$;
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
($aaaa$[$k$]=function(event) {
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
}).ori=$r$;
$k$='_onTouchEnd';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(evt){
	f.ori.call(this,evt);
	this._lastAvgX=undef;
	this._lastAvgY=undef;
}).ori=$r$;
$pppp$=$aaaa$=undef;


// sprite

// - Sprite_Base
$aaaa$=Sprite_Base;
$pppp$=$aaaa$.prototype;
($pppp$.updateAnimationSprites=function f(){
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
}).tmp=[];
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
($pppp$._refresh=function f(){
	if(!this.parent) return;
	f.ori.call(this);
	if(this._tileId>0){ let c=this._character; if(c && $gameMap){
		if(c.parentId) this._refresh_updateCf_child(c.parentId);
		else if(c._sameStatEvts) this._refresh_updateCf_parent(c._sameStatEvts);
	} }
}).ori=$r$;
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
($pppp$[$k$]=function f(chr){
	chr.setSprite(this);
	f.ori.call(this,chr);
	this._scnt=~0;
	this._cf={};
	this._cfMap=new Map();
	this._skipRender=undefined;
	this._old_anchor_y=undefined;
	this._balloonSprites=new Set();
	if(chr&&chr.constructor===Game_Event){
		this._skipRender=chr._skipRender;
		// text
		this.setText(chr.getText());
		// parentId in meta
		let pid=chr.parentId||Number(chr.getData().meta.parentId);
		if(pid){
			chr.parentId=pid;
			let p=$gameMap._events[chr.parentId];
			if(p){
				if(!p._sameStatEvts) p._sameStatEvts=[];
				const id=chr._eventId;
				if(p._sameStatEvts.indexOf(id)===-1) p._sameStatEvts.push(id);
			}
		}
	}
	this._noUpdatePos=undefined;
}).ori=$r$;
$pppp$.isInView_viewRadius=function(){
	const r=this.viewRadius2()+Graphics._radius;
	return Graphics.screenDist2(this)<r*r;
};
$pppp$.isInView_inScreen=function(){
	return (~~((Graphics._boxWidth_pad6+this.x)/Graphics._boxWidth_pad4))===1 && (~~((Graphics._boxHeight_pad5+this.y)/Graphics._boxHeight_pad4))===1;
//	const bm=this.bitmap; if(!bm||!bm.isReady()) return true; // not inited yet
//	const w=bm._image?this.width:0,h=bm._image?this.height:0;
//	const aw=w*this.anchor.x+Game_Map.e,ah=h*this.anchor.y+Game_Map.e;
//	const xaw=this.x-aw,yah=this.y-ah;
//	return xaw<Graphics._boxWidth && yah<Graphics._boxHeight && xaw+w>=0 && yah+h>=0;
};
$pppp$.isInView=function(){ // can view?
	if(this._skipRender) return false;
	else return ($gameScreen.limitedView&&this.isInView_viewRadius())||this.isInView_inScreen();
/*
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
*/
};
$k$='update_doAll';
$pppp$[$k$]=$pppp$.update;
($pppp$.update=function(forced,arg0AsView){
	if(!arg0AsView&&forced) return this.update_doAll();
	if(this._character._erased){
		return this.remove();
	}else if(arg0AsView?!forced:!this.isInView()){
		return this.updatePosition(); // give up update if too far
	}
	return this.update_doAll();
}).ori=$pppp$[$k$];
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
($pppp$[$k$]=function f(){ // add on chair facing up
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
}).ori=$r$;
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
($pppp$[$k$]=function f(){
	if(this._noUpdatePos) return;
	f.ori.call(this);
	this.z2=this._character.screenZ2();
}).ori=$r$;
$pppp$.tilesetBitmap=function(tileId,args) {
	return ImageManager.loadTileset($gameMap.tileset().tilesetNames[(tileId>>8)+5],undefined,args);
};
$pppp$.updateAnimationSprites=none;
$pppp$.startAnimation=function(animation, mirror, delay){ // rewrite: discard array access
	//let sprite = new Sprite_Animation();
	//sprite.setup(this._effectTarget, animation, mirror, delay);
	//this.parent.addChild(sprite);
	const rtv=new Sprite_Animation().setup(this._effectTarget, animation, mirror, delay);
	this.parent.addChild(rtv);
	//this._animationSprites.push(sprite);
	return rtv;
};
$pppp$.isAnimationPlaying=none; // no Array.push , no 'Array.length>0'
$k$='startBalloon';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this._balloonSprite.ref=this;
	this._balloonSprite=false;
}).ori=$r$;
$k$='setupAnimation';
$r$=$pppp$[$k$]; ($d$=$pppp$[$k$]=function f(){
	f.ori.call(this);
	const actor=this._character.getActor(); if(!actor) return;
	if(!this._loopAnis) this._loopAnis=new Map();
	actor.traitsSet(Game_BattlerBase.TRAIT_LOOP_ANI_M).forEach((v,k)=>{
		const ani=$dataAnimations[k.ani<0?-k.ani:k.ani]; if(!ani) return;
		let oldAni=this._loopAnis.get(k),x,y;
		if(oldAni){
			if(oldAni.isPlaying()){
				if(k.same) oldAni.alpha=this.alpha;
			}else{
				x=oldAni._setx;
				y=oldAni._sety;
				oldAni.remove();
				oldAni=undefined;
			}
		}
		if(!oldAni){
			const sp=this.startAnimation(ani,k.ani<0,0);
			sp.z2=this.z2-1;
			this._loopAnis.set(k,sp);
			if(k.fixed){
				if(x!==undefined){
					sp.x=(sp._setx=x)-$gameMap._displayX_tw;
					sp.y=(sp._sety=y)-$gameMap._displayY_th;
				}else{
					sp.updatePosition();
					sp._setx=sp.x+$gameMap._displayX_tw;
					sp._sety=sp.y+$gameMap._displayY_th;
				}
				sp.updatePosition=f.pos;
			}else sp._sety=sp._setx=undefined;
		}
	});
}).ori=$r$;
$d$.pos=function(){
	this.move(this._setx-$gameMap._displayX_tw,this._sety-$gameMap._displayY_th);
};
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
$pppp$.viewRadius1=function(){
	return this._character._viewRadius1;
};
$pppp$.viewRadius2=function(){
	return this._character._viewRadius2;
};
$pppp$=$aaaa$=undef;

// - Sprite_Battler
$aaaa$=Sprite_Battler;
$pppp$=$aaaa$.prototype;
$k$='initMembers';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this._damages=new Queue();
}).ori=$r$;
$pppp$.setBattler=function(btlr){
	if(this._battler) this._battler.removeSprite(this);
	if(this._battler=btlr) btlr.setSprite(this);
};
($pppp$.updateDamagePopup=function f(){
	this.setupDamagePopup();
	if(this._damages.length > 0){
		this._damages.forEach(f.forEach); // update
		const maxPop=_global_conf.dmgPopMaxPerBtlr,dmgs=this._damages;
		for(let L=dmgs.length;L && (maxPop<L || !dmgs[0].isPlaying());L=dmgs.length){
			this.parent._dmgs.removeChild(dmgs[0]);
			dmgs.shift();
		}
	}
}).forEach=c=>c.update();
$k$='setupAnimation';
$r$=$pppp$[$k$]; ($pppp$[$k$]=function f(){
	f.ori.call(this);
	if(!this._loopAnis) this._loopAnis=new Map();
	this._battler.traitsSet(Game_BattlerBase.TRAIT_LOOP_ANI_B).forEach((v,k)=>{
		const ani=$dataAnimations[k.ani<0?-k.ani:k.ani]; if(!ani) return;
		let oldAni=this._loopAnis.get(k),x,y;
		if(oldAni){
			if(oldAni.isPlaying()){
				oldAni.alpha=k.same?this.alpha:1;
			}else{
				x=oldAni._setx; y=oldAni._sety;
				oldAni.remove();
				oldAni=undefined;
			}
		}
		if(!oldAni){
			this.startAnimation(ani,k.ani<0,0);
			const arr=this._animationSprites;
			const sp=arr.pop();
			sp.z2=this.z2-1; // no use though. sorting order: TilingSprite,Sprite_Enemy,Sprite_Actor, *others*
			this._loopAnis.set(k,sp);
			if(k.fixed){
				if(x!==undefined){
					sp._setx=sp.x=x;
					sp._sety=sp.y=y;
				}else{
					sp.updatePosition();
					sp._setx=sp.x;
					sp._sety=sp.y;
				}
				sp.updatePosition=none;
			}else sp._sety=sp._setx=undefined;
		}
	});
}).ori=$r$;
$pppp$._setupDamagePopup1=function(res){
	const sp = new Sprite_Damage();
	sp.x = this.x + this.damageOffsetX();
	{ const newy=this._damages.length && this._damages.back.y;
	sp.y=(newy<64)?this.y+this.damageOffsetY():(newy-23);
	}
	//this._battler._result=res;
	sp.setup(this._battler,res);
	this._damages.push(sp);
	this.parent._dmgs.addChild(sp);
};
$pppp$.setupDamagePopup = function() {
	if(this._battler.isDamagePopupRequested()){
		if(this._battler.isSpriteVisible()){
			const laters=[],q=this._battler.reserveActResQ();
			let res=q.shift(); while(!res && q.length) res=q.shift();
			if(res){ if(res.later){ for(laters.push(res);;){
				res=q.shift(); if(!res) break;
				if(res.later) laters.push(res);
				else{
					this._setupDamagePopup1(res);
					break;
				}
			} }else this._setupDamagePopup1(res); }
			for(let i=0;i!==laters.length;++i) this._setupDamagePopup1(laters[i]);
			while(q[0] && q[0].merge) this._setupDamagePopup1(q.shift());
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
($pppp$[$k$]=function f(){
	f.ori.call(this);
	if(this._actor.isWeapon2AnimationRequested()){
		this._weapon2Sprite.setup(this._actor.weapon2ImageId());
		this._actor.clearWeapon2Animation();
	}
}).ori=$r$;
$pppp$.updateBitmap=function() {
	Sprite_Battler.prototype.updateBitmap.call(this);
	let name = this._actor.battlerName(); // (this._actor instanceof Game_Actor)
	if(this._battlerName !== name){
		const args=this._setBitmap_args();
		this._battlerName = name;
		this._mainSprite.bitmap = ImageManager.loadSvActor(name,undefined,args);
		this._chr2sv=undefined;
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
($pppp$[$k$]=function f(battler){
	f.ori.call(this,battler);
	this._meta = battler.getData();
	this._meta = this._meta&&this._meta.meta||{};
}).ori=$r$;
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
	{ const ds=icon.scale,ss=this.scale;
	ds.x=1/ss.x; ds.y=1/ss.y;
	}
	if(hpmp){
		icon.y = hpmp.y+hpmp.height*hpmp.scale.y + icon.height*icon.anchor.y*icon.scale.y + 1;
		// hpmp.y will be capped to full-view-top
	}else{
		{ let newy = -~~(this._frame.height*this.anchor.y);
		if(newy < 20 - this.y) newy = 20 - this.y;
		icon.y=newy;
		}
		{ const y=icon.getGlobalPosition().y,maxy=(Window_Base._iconHeight>>1)+1;
		if(y<maxy) icon.y+=(maxy-y)/this.scale.y;
		}
	}
};
($pppp$.updateHpMpSprite=function f(forced){
	
	const scale=this.scale,sp=this._hpMpSprite; if(!sp) return;
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
}).tbl=["rgba()"];
$pppp$=$aaaa$=undef;
// - Sprite_Animation
$aaaa$=Sprite_Animation;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.setup;
($pppp$.setup=function f(){
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
}).ori=$r$;
$r$=$pppp$.remove;
($pppp$.remove=function f(){
	if(this.parent){
		//f.ori.call(this);
		this.parent.removeChild(this);
		this._target.setBlendColor([0, 0, 0, 0]);
		this._target.show();
	}
}).ori=$r$;
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
		let grandparent=parent?parent.parent:false; // !== null
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
($pppp$.updateFrame=function f(){
	if(this._duration){
		const frameIndex = this.currentFrameIndex();
		this.updateAllCellSprites(this._animation.frames[frameIndex]);
		const arr=this._animation.timings.byFrmIdx[frameIndex];
		if(arr) arr.forEach(f.forEach,this);
	}
}).forEach=function(t){ this.processTimingData(t); };
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
$pppp$.setup=function(target,res){
	if(!res) res = target.result();
	if(res.missed || res.evaded) this.createMiss();
	else{
		const ha=!!res.hpAffected;
		if(target.isAlive() && res.mpDamage !== 0){
			this.createDigits(2,res.recover,res.mpDamage,-ha,-ha*0.5);
			this.y-=(ha<<4);
		}
		if(ha) this.createDigits(0,res.recover,res.hpDamage);
	}
	if(res.critical) this.setupCriticalEffect();
};
$pppp$.createDigits=function(colorCh,rcv,v,shax,shay){
	rcv|=0;
	if(isNaN(shax)) shax=0;
	if(isNaN(shay)) shay=0;
	this._updateCtr|=0;
	const w=this.digitWidth() , h=this.digitHeight();
	const rh=(colorCh+(v<0||v===0&&rcv))*h , s=Math.abs(v).toString();
	for (let i=0,iw=-(((s.length-1)*w)>>1);i!==s.length;++i){
		const sp = this.createChildSprite();
		const n = Number(s[i]);
		sp.setFrame(n * w, rh, w, h);
		//sp.x = (i - (s.length - 1) / 2) * w;
		sp.x = iw; iw+=w;
		sp.dy = -(sp._idx=i);
		sp._updateStrt=this._updateCtr;
		const a=sp.anchor;
		a.x+=shax; a.y+=shay;
	}
	this.__value=v;
};
$pppp$.update=function(){
	Sprite.prototype.update.call(this);
	if(this._duration > 0){
		--this._duration;
		this._updateCtr|=0;
		++this._updateCtr;
		//for(let i=0,arr=this.children;i!==arr.length;++i) this.updateChild(arr[i]);
		for(let i=0,arr=this.children;i!==arr.length;++i){
			arr[i].setBlendColor(this._flashColor);
			arr[i].refreshY(); // ensure updateY
		}
	}
	this.updateFlash();
	this.updateOpacity();
};
$pppp$.updateOpacity=function(){
	if(this._duration < 8) this.opacity = this._duration<<5;
};
$pppp$=$aaaa$=undef;

// - Sprite_StateIcon
$aaaa$=Sprite_StateIcon;
$pppp$=$aaaa$.prototype;
$k$='initMembers';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this.createIconTurnSprite();
}).ori=$r$;
$d$=$pppp$.createIconTurnSprite=function f(){
	if(this[f.tbl]) return;
	const sp=this[f.tbl]=new Sprite();
	this.addChild(sp);
	const bm=sp.bitmap=new Bitmap;
	bm.fontSize=16;
	sp.alpha=0.875;
	sp._lastIconTurn=undefined;
};
$t$=$d$.tbl='_iconTurnSprite';
$d$=$pppp$.updateIconTurnSprite=function f(forced){
	const sp=this[f.tbl]; if(!sp) return;
	if(!forced && sp._lastIconTurn===this._iconTurn && sp._lastIconStack===this._iconStack) return;
	const it=sp._lastIconTurn=this._iconTurn;
	const ik=sp._lastIconStack=this._iconStack;
	const frm=this._frame;
	const bm=sp.bitmap,width=frm.width,height=frm.height;
	if(!bm._reCreateTextureIfNeeded(width,height)) bm.clear();
	sp.anchor=this.anchor;
	sp.setFrame(0,0,width,height);
	if(it>=0){
		if(ik) bm.drawText('x'+ik,1,1,width,20,'right');
		bm.drawText(it,1,height-20,width,20);
	}
};
$d$.tbl=$t$;
$pppp$.updateIcon=function f(){
	const b=this._battler;
	const stats=b.states_noSlice(); // [dataobj,...]
	if(this._animationIndex<stats.length){ // state
		const stat=stats[this._animationIndex++];
		this._iconIndex=stat.iconIndex;
		this._iconStack=0;
		this._iconTurn=stat.autoRemovalTiming?b._stateTurns[stat.id]:undefined;
	}else{ // buff
		const arr=b._buffs;
		let i=-1;
		for(let cnt=stats.length,x=0;x!==arr.length;++x){
			if(arr[x]){
				if(this._animationIndex===cnt){
					i=x; break;
				}else ++cnt;
			}
		}
		if(i<0){
			this._animationIndex=0;
			if(stats.length) f.call(this);
			else{
				this._iconIndex=0;
				this._iconStack=0;
				this._iconTurn=undefined;
			}
		}else{
			this._iconIndex=b.buffIconIndex(arr[i],i);
			this._iconStack=arr[i];
			this._iconTurn=b._buffTurns[i];
		}
	}
	this.updateIconTurnSprite();
};
$pppp$=$aaaa$=undef;

// - Sprite_Weapon
$aaaa$=Sprite_Weapon;
$pppp$=$aaaa$.prototype;
$aaaa$.width=96;
$aaaa$.height=64;
$r$=$pppp$.setup;
($pppp$.setup=function f(wImgId){
	f.ori.call(this,wImgId);
	this._lastPatternWaitCnt=0;
	this._lastPatternWaitMax=4;
}).ori=$r$;
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
($pppp$.update=function f(){
	f.ori.call(this);
	if(this._duration===0) this.remove();
	else if(this.ref){
		let ref=this.ref;
		this.x = ref.x;
		this.y = ref.y - ref.height;
	}
}).ori=$r$;
// - Sprite_Picture
$aaaa$=Sprite_Picture;
$pppp$=$aaaa$.prototype;
$k$='loadBitmap';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	if(_global_conf.isDataURI(this._pictureName)) this.bitmap=ImageManager.loadNormalBitmap(this._pictureName);
	else f.ori.call(this);
}).ori=$r$;
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
($pppp$[$k$]=function f(){
	this.addChild(this._timerBackground = new Window_Base(0,0,96,48));
	f.ori.call(this);
	this._timerSprite._background=this._timerBackground;
	this._timerSprite.updatePosition(true);
}).ori=$r$;
$pppp$.loadTileset=function f(){ // re-write: fix bug: shadertimemap not rendered (not correctly set 'newTilesetFlags' before rendering)
	if(!f.cache) f.cache=new CacheSystem(1);
	if(this._tileset=$gameMap.tileset()){
		let tilesetNames = this._tileset.tilesetNames , isWebGL=Graphics.isWebGL() , tm=this._tilemap;
		for(let i=0,cache=f.cache,texPerChild=isWebGL?tm.lowerLayer.texPerChild:0,len=tilesetNames.length;i!==len;++i){
			let x=i,curr=tm.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
			// !objs.test_webglTilemapAlpha
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
($pppp$[$k$]=function f(scene){
	this._scene=scene;
	f.ori.call(this);
}).ori=$r$;
$k$='createBattleField';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	const bf=this._battleField;
	const dmgs=bf._dmgs=new Spriteset_BattleFieldDamages();
	dmgs.y=dmgs.x=0;
	bf.addChild(dmgs);
}).ori=$r$;
($d$=$pppp$._sortE=function f(forced){
	const bfc=this._battleField.children;
	if(forced||this._lastBfcLen!==bfc.length){
		this._lastBfcLen=bfc.length;
		bfc.sort(f.cmp);
	}
}).cmp=function f(a,b){
	let aa=a.constructor!==TilingSprite,bb=b.constructor!==TilingSprite,cmp=aa-bb;
	if(cmp) return cmp;
	aa=f.tbl[0].has(a.constructor)^1;
	bb=f.tbl[0].has(b.constructor)^1;
	cmp=aa-bb||a.z2-b.z2;
	if(cmp) return cmp;
	aa=(f.tbl[1].get(a.constructor)|0)^3;
	bb=(f.tbl[1].get(b.constructor)|0)^3;
	return (aa-bb)||(aa===1)&&f.cmp(a,b);
};
$d$.cmp.cmp=$pppp$.compareEnemySprite;
$d$.cmp.tbl=[
	new Set([
		Sprite_Animation,
		Sprite_Enemy,
		Sprite_Actor,
	]),
	new Map([
		[Sprite_Enemy,2],
		[Sprite_Actor,1],
	])
];
if(0)$d$.cmp.tbl=new Map([
	[TilingSprite,3],
	[Sprite_Enemy,2],
	[Sprite_Actor,1],
]);
$k$='updateTransform';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	this._sortE(true);
	f.ori.call(this);
}).ori=$r$;
//
$t$='terrainBattleback';
$k$=$t$+'1Name';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(type){
	const tset = $dataMap && $dataTilesets[$dataMap.tilesetId] , bgmp = tset && tset.battleBack1 ;
	return bgmp && bgmp.get(type) || f.ori.call(this,type);
}).ori=$r$;
$k$=$t$+'2Name';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(type){
	const tset = $dataMap && $dataTilesets[$dataMap.tilesetId] , bgmp = tset && tset.battleBack2 ;
	return bgmp && bgmp.get(type) || f.ori.call(this,type);
}).ori=$r$;
$t$=undef;
//
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
	["_dmgPopMaxPerBtlr",undefined,0x40],
	["_chasePopAfterFrame",$aaaa$.readFlag,1],
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
		else this[arr[x][0]]=arr[x][2];
};
$pppp$=$aaaa$=undef;

// - ImageManager
$aaaa$=ImageManager;
{ const f=function(){ return arguments[2]===""?"":(arguments[1]==="?"?"?":"&"); };
$aaaa$._trimMetaArgs=p=>p.replace(/(\?|&)(color|scale|rnd|reflect_h|reflect_v)(=[^&]*)?(?=(&|$))/g,'$1').replace(/(\?)?[&]+($)?/g,f).replace(/\?$/,'');
}
$aaaa$.loadEnemy=function(filename,hue,args){
	return this.loadBitmap('img/enemies/', filename, hue, true, args);
};
($aaaa$.loadSystem=function f(filename,hue,args){
	return this.loadBitmap('img/system/', f.tbl[filename]||filename, hue, false, args);
}).tbl={}; // weaponImg
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
$aaaa$.setAllVol=function(vol){
	this._seVolume=this._meVolume=this._bgsVolume=this._bgmVolume=vol;
};
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
($aaaa$.playBgm=function f(bgm,pos){
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
}).ori=$r$;
$r$=$aaaa$.playBgs;
($aaaa$.playBgs=function f(bgs,pos){
	f.ori.call(this,bgs,pos);
}).ori=$r$;
$k$='isCurrentBgm';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(bgm){
	return (bgm.constructor===Array)?this._pitchesBgm_data===bgm||bgm.equals(this._pitchesBgm_data):f.ori.call(this,bgm);
}).ori=$r$;
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
($aaaa$.stopAll=function f(){
	this.stopPitch_bgm();
	f.ori.call(this);
}).ori=$r$;
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
($aaaa$.saveBgm=function f(rtv){
	// rtv is obj or "sth that is false"
	if(!rtv) return f.ori.call(this);
	return this._saveBgX(rtv,this._currentBgm,this._bgmBuffer,p);
}).ori=$r$;
$r$=$aaaa$.saveBgs;
($aaaa$.saveBgs=function f(rtv){
	// rtv is obj or "sth that is false"
	if(!rtv) return f.ori.call(this);
	return this._saveBgX(rtv,this._currentBgs,this._bgsBuffer,p);
}).ori=$r$;
$pppp$=$aaaa$=undef;

// - BattleManager
$aaaa$=BattleManager;
$aaaa$._phase=undefined;
$r$=$aaaa$. setup ;
($aaaa$. setup =function f(troopId, canEscape, canLose){
	f.ori.call(this, troopId, canEscape, canLose);
	this._turnCtr=0;
	this.clearTBDCache();
}).ori=$r$;
($aaaa$.clearTBDCache=function f(){
	if(this._TBDCache){
		this._TBDCache.forEach(f.forEach);
		this._TBDCache.clear();
	}else this._TBDCache=new Set();
}).forEach=b=>b.clearCache();
($aaaa$.initChases=function f(){
	let M=this._chases;
	if(M) M.clear();
	else M=this._chases=new Map();
	let arr=Game_BattlerBase.CHASE_FRIENDS,c; if(!arr.length) arr.length=1;
	M.set($gameParty,c=new Map());	c.byCond=arr.map(f.forEach);
	M.set($gameTroop,c=new Map());	c.byCond=arr.map(f.forEach);
	M.set(this,c=new Map());	c.byCond=arr.map(f.forEach);
	// btlr -> traitCodeSet according to friend or opponent or all
}).forEach=_=>new Set();
$k$='initMembers';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(){
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
	
	// key : subject
	if(this._actLog_turn) this._actLog_turn.clear(); else this._actLog_turn=new Map();
	if(this._actLog_all ) this._actLog_all .clear(); else this._actLog_all =new Map();
	
	// key : subject
	if(this._actResLogS_turn) this._actResLogS_turn.clear(); else this._actResLogS_turn=new Map();
	if(this._actResLogS_all ) this._actResLogS_all .clear(); else this._actResLogS_all =new Map();
	// key : target
	if(this._actResLogT_turn) this._actResLogT_turn.clear(); else this._actResLogT_turn=new Map();
	if(this._actResLogT_all ) this._actResLogT_all .clear(); else this._actResLogT_all =new Map();
	
	// key : subject
	if(this._actDmgLogS_turn) this._actDmgLogS_turn.clear(); else this._actDmgLogS_turn=new Map();
	if(this._actDmgLogS_all ) this._actDmgLogS_all .clear(); else this._actDmgLogS_all =new Map();
	// key : target
	if(this._actDmgLogT_turn) this._actDmgLogT_turn.clear(); else this._actDmgLogT_turn=new Map();
	if(this._actDmgLogT_all ) this._actDmgLogT_all .clear(); else this._actDmgLogT_all =new Map();
	
	this.initChases();
}).ori=$r$;
$k$='saveBgmAndBgs';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(){
	f.ori.call(this);
	if(AudioManager._pitchesBgm_data){
		AudioManager._pitchesBgm_data.pos=AudioManager._pitchesBgm_pos;
		this._mapBgm=AudioManager._pitchesBgm_data;
	}
	if(AudioManager._pitchesBgs_data){
		AudioManager._pitchesBgs_data.pos=AudioManager._pitchesBgs_pos;
		this._mapBgs=AudioManager._pitchesBgs_data;
	}
}).ori=$r$;
$k$='makeEscapeRatio';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(){
	if($gameTroop._trueEscape || $gameParty.mustEscape()) this._escapeRatio = 1;
	else if($gameTroop._escapeRatioFunc_txt){
		if(!$gameTroop._escapeRatioFunc) $gameTroop._escapeRatioFunc=objs._getObj.call(this,$gameTroop._escapeRatioFunc_txt);
		this._escapeRatio=$gameTroop._escapeRatioFunc(this);
	}else f.ori.call(this);
}).ori=$r$;
$aaaa$._logItemUsed=function(container,item,s){
	// s' use
	{
	let m=container.get(s);
	if(!m) container.set(s,m=new Map());
	m.set(item,(m.get(item)|0)+1);
	}
	// overall item used
	if(s) this._logItemUsed(container,item);
};
$aaaa$.logItemUsed=function(item,s){
	this._logItemUsed(this._actLog_turn,item,s);
	this._logItemUsed(this._actLog_all ,item,s);
};
$aaaa$._getItemUsedCount=function(container,item,s){
	let rtv=container.get(s);
	if(!rtv) return 0;
	return rtv.get(item)|0;
};
$aaaa$.getItemUsedCount_turn=function(item,s){
	return this._getItemUsedCount(this._actLog_trun,item,s);
};
$aaaa$.getItemUsedCount_all=function(item,s){
	return this._getItemUsedCount(this._actLog_all ,item,s);
};
$aaaa$._logActRes=function(container,actRes,key){
	if(!container) return; // called by act.apply.toQ
	// key' res
	{
	let arr=container.get(key);
	if(!arr) container.set(key,arr=[]);
	arr.push(actRes);
	}
	// overall res
	if(key) this._logActRes(container,actRes);
};
$aaaa$.logActRes=function(actRes,s,t){
	this._logActRes(this._actResLogS_turn,actRes,s);
	this._logActRes(this._actResLogS_all ,actRes,s);
	this._logActRes(this._actResLogT_turn,actRes,t);
	this._logActRes(this._actResLogT_all ,actRes,t);
};
($aaaa$._logActDmg=function f(container,info,key){
	if(!container) return; // called by act.apply.toQ
	// key' res
	{
	let arr=container.get(key);
	if(!arr) container.set(key,arr=[]);
	arr.push(info);
	if(arr.eles){
		for(let x=0;x!==arr.length;++x) f.tbl[1](arr,info,f.tbl[0](info,arr[x]),arr[x]);
		f.tbl[1](arr,info,1);
	}
	}
	// overall res
	if(key) this._logActDmg(container,info);
}).tbl=[
	(info,ele)=>{
		if(ele===undefined) return 1;
		const arr=info.eles,elesCnt=arr.length;
		let eleCnt=0;
		for(let x=0;x!==arr.length;++x) eleCnt+=arr[x]===ele;
		return eleCnt?eleCnt/arr.length:0;
	},
	(arr,info,r,ele)=>{
		let eleObj=arr.byEle.get(ele);
		if(!eleObj) arr.byEle.set(ele, eleObj={hp:0,mp:0,tp:0,} );
		eleObj.hp+=info.dhp*r;
		eleObj.mp+=info.dmp*r;
		eleObj.tp+=info.dtp*r;
	},
];
$aaaa$.logActDmg=function(info,s,t){
	this._logActDmg(this._actDmgLogS_turn,info,s);
	this._logActDmg(this._actDmgLogS_all ,info,s);
	this._logActDmg(this._actDmgLogT_turn,info,t);
	this._logActDmg(this._actDmgLogT_all ,info,t);
};
($aaaa$._getActDmgSum=function f(t,type,ele,c){
	const arr=c.get(t); if(!arr) return 0;
	let m=arr.byEle; if(!m) arr.byEle=m=new Map();
	let rtv=m.get(ele); if(!rtv){
		if(!arr.eles) arr.eles=[];
		arr.eles.push(ele);
		m.set(ele,rtv={hp:0,mp:0,tp:0,});
		if(ele===undefined){
			for(let x=0,dmgs=arr;x!==dmgs.length;++x){
				rtv.hp+=dmgs[x].dhp;
				rtv.mp+=dmgs[x].dmp;
				rtv.tp+=dmgs[x].dtp;
			}
		}else{
			for(let x=0,dmgs=arr;x!==dmgs.length;++x){
				const r=f.tbl[0](dmgs[x],ele);
				rtv.hp+=dmgs[x].dhp*r;
				rtv.mp+=dmgs[x].dmp*r;
				rtv.tp+=dmgs[x].dtp*r;
			}
		}
	}
	return rtv[type]||0;
}).tbl=$aaaa$._logActDmg.tbl;
$aaaa$.getActDmgSumS_turn=function(t,type,ele){
	return this._getActDmgSum(t,type,ele,this._actDmgLogS_turn);
};
$aaaa$.getActDmgSumS_all=function(t,type,ele){
	return this._getActDmgSum(t,type,ele,this._actDmgLogS_all);
};
$aaaa$.getActDmgSumT_turn=function(t,type,ele){
	return this._getActDmgSum(t,type,ele,this._actDmgLogT_turn);
};
$aaaa$.getActDmgSumT_all=function(t,type,ele){
	return this._getActDmgSum(t,type,ele,this._actDmgLogT_all);
};
$r$=$aaaa$.update;
($aaaa$.update=function f(){ // prepare
	//console.log(' update ',this._actorIndex);
	//return f.ori.call(this);
	do{
		this._actionNoEffect=false;
		f.ori.call(this);
	}while(this._actionNoEffect);
	if(!this.isBattleEnd()) $gameTroop.updateParallel();
}).ori=$r$;
{ const f1=function(){
	if(this.isActionForced()){
		this.processForcedAction();
		return true;
	}else return this.updateEventMain();
},f2=function(){
	$gameTroop.setupBattleEvent();
	$gameTroop.updateInterpreter();
	return $gameTroop.isEventRunning();
};
($aaaa$.updateEvent=function f(){
	const func=f.tbl[this._phase];
	if(func) return func.call(this);
	else return this.checkAbort();
}).tbl={
	null: undefined,
	init: undefined,
	input: undefined,
	aborting: undefined,
	action: undefined,
	
	start: f1,
	turn: f1,
	turnEnd: f1,
	battleEnd: f2,
};
}
$aaaa$.startInput=function f(){ // prepare
	if(objs.isDev) console.log(' startInput ','actor id',this._actorIndex);
	//return f.ori.call(this);
	this._phase = 'input';
	$gameParty.makeActions();
	//$gameTroop.makeActions(); // moved to startTurn
	this.clearActor();
	if( this._surprise || !$gameParty.canInput() ){
		this.startTurn();
	}
};
$aaaa$.inputtingAction=function(){
	const actor=this.actor();
	return actor ? actor.inputtingAction() : null;
};
$r$=$aaaa$.startTurn;
($aaaa$.startTurn=function f(){
	if(objs.isDev) console.log(' startTurn ',this._actorIndex);
	$gameTroop.makeActions();
	this._actLog_turn.clear();
	this._actResLogS_turn.clear();
	this._actResLogT_turn.clear();
	this._actDmgLogS_turn.clear();
	this._actDmgLogT_turn.clear();
	++this._turnCtr;
	return f.ori.call(this);
}).ori=$r$;
$k$='updateTurn';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(){ // prepare
	//if(objs.isDev) console.log('updateTurn',this._actorIndex);
	return f.ori.call(this);
}).ori=$r$;
$k$='processTurn';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(){
	//if(objs.isDev) console.log('processTurn',this._actorIndex);
	//return f.ori.call(this);
	const subject = this._subject;
	let action = subject.currentAction();
	while(action && !action.isValid()){
		subject.removeCurrentAction();
		action = subject.currentAction();
	}
	if(action){
		action.prepare();
		if(action.isValid()) this.startAction();
		subject.removeCurrentAction();
	}else{
		subject.onAllActionsEnd();
		this.refreshStatus();
		this._logWindow.displayAutoAffectedStatus(subject);
		this._logWindow.displayCurrentState(subject);
		this._logWindow.displayRegeneration(subject);
		this._subject = this.getNextSubject();
	}
}).ori=$r$;
$r$=$aaaa$. endTurn ;
($aaaa$. endTurn =function f(){ // prepare
	if(objs.isDev) console.log(' endTurn ',this._actorIndex);
	f.ori.call(this);
	// execd before interpreter
}).ori=$r$;
$k$='updateTurnEnd';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(){ // prepare
	// execed after interpreter
	if(objs.isDev) console.log('updateTurnEnd',this._actorIndex);
	// only 'this.startInput();'
	return f.ori.call(this);
}).ori=$r$;
$k$='makeActionOrders';
$r$=$aaaa$[$k$];
($d$=$aaaa$[$k$]=function f(){
	f.ori.call(this);
	this._actionBattlers_obj2id=new Map(this._actionBattlers.map(f.forEach));
	this._actionBattlers=new Queue(this._actionBattlers);
}).ori=$r$;
$d$.forEach=(e,i)=>[e,i];
$k$='startAction';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(){
	if(objs.isDev) console.log('startAction',this._actorIndex);
	this._subject.reserveActResQ().clear();
	this._dmgSum=0;
	const s=this._subject;
	f.ori.call(this);
	this.logItemUsed(this._action.item(),s);
}).ori=$r$;
($aaaa$.updateAction=function f(instPopDmg){
	const target = this._targets.pop(); // reverse order
	if(target){
		//let tmp;
		const st=this._statusWindow,lg=this._logWindow;
		st.noRefresh=true;
		lg.push('pushBaseLine');
		if(this._subject.stp===0){
			if(!this._action.meta) this._action.initMeta();
			this._action.meta.stpReduced=true;
		}
		//const q=this._subject.reserveActResQ(); // if(q) q.clear(); // cleared @ BattleManager.startAction
		this.invokeAction(this._subject,target);
		if(!this._targets.length && this._action.isForOne()){
			// aim only 1, setLastTarget
			// move setLastTarget from 'invokeAction' to here
			this._subject.setLastTarget(target);
		}
		if(this._actionNoEffect=!this._actUsed){ // target disappear (action not used), cancel following sub-action via immediately complete them // so subject will gain TP 
			lg._methods.pop_back(); // ???
			this._action.setPreloadFlag();
			this._action.setPreload_s();
			while(!this._actUsed && this._targets.back===target){
				this._targets.pop();
				this.invokeAction(this._subject,target);
			}
			this._action.clearPreloadFlag();
		}else{ // target aimed, try aim more
			f.tmp.clear(); f.tmp.add(target);
			const arr=this._targets;
			this._action.setPreloadFlag();
			this._action.setPreload_s();
			while(arr.length){
				let sz=f.tmp.size; f.tmp.add(this._targets.back);
				if(sz===f.tmp.size) break;
				this.invokeAction(this._subject,this._targets.pop());
			}
			this._action.clearPreloadFlag();
			lg.push('popBaseLine');
		}
		st.noRefresh=false;
		st.refresh();
		// inst becomes go through 1 turn
		//if(this._actionNoEffect) return this.updateAction(instPopDmg);
	}else{
		if(!this._action.meta) this._action.initMeta();
		if(this._subject.stp!==undefined && !this._action.meta.stpReduced && !this._action.isSpaceout(this._subject)){
			this._action.meta.stpReduced=true;
			this._subject.gainStp(-1);
		}
		this.endAction();
	}
}).tmp=new Set();
$r$=$aaaa$. endAction ;
($aaaa$. endAction =function f(){
	if(objs.isDev){
		console.log(' endAction ',this._actorIndex);
		console.log('dmg',this._dmgSum,'by',this._subject);
	}
	f.ori.call(this);
}).ori=$r$;
$aaaa$.invokeAction=function(s,t){ // subject , target
	let realTarget=t;
	this._actUsed=this._usedAct_normal=this._usedAct_other=this._usedAct_reflect=undefined;
	{ const rnd=Math.random() , a=this._action;
	if( rnd<a.itemPrf(t) || rnd<a.itemMrf(t) || rnd<a.itemArf(t) ){
		this.invokeReflection(realTarget=s,t);
		this._actUsed=this._usedAct_reflect;
	}else{
		realTarget=this.invokeNormalAction(s,t);
		if( (this._actUsed=this._usedAct_normal) && realTarget && (rnd<a.itemPcnt(realTarget) || rnd<a.itemMcnt(realTarget) || rnd<a.itemAcnt(realTarget)) ){
			this.invokeCounterAttack(s,realTarget);
		}
	}
	s.reserveActResQ().push(undefined); // delimiter
	realTarget.reserveActResQ().push(undefined); // delimiter
	}
	//s.setLastTarget(t); // moved to updateAction
	//this.refreshStatus(); // done in updateAction
	return realTarget;
};
$aaaa$.updateChase=function(btlr,isRemoved){
	if(!this._chases) this.initChases();
	const gbb=Game_BattlerBase;
	{ const fu=this._chases.get(btlr.friendsUnit()) , cf=btlr.getTraits_overall_s(gbb.TRAIT_CHASE_FRIEND); if(fu){
		if(cf && cf.size){
			fu.set(btlr,gbb.CHASE_FRIENDS);
			if(isRemoved) cf.forEach((v,k)=>fu.byCond[k]&&fu.byCond[k].delete(btlr));
			else for(let x=1,arr=fu.byCond;x!==arr.length;++x){
				if(cf.has(x)) arr[x].add(btlr);
				else arr[x].delete(btlr);
			}
		}else{
			fu.delete(btlr);
			fu.byCond.forEach(s=>s.delete(btlr));
		}
	} }
	{ const ou=this._chases.get(btlr.opponentsUnit()) , co=btlr.getTraits_overall_s(gbb.TRAIT_CHASE_OPPONENT); if(ou){
		if(co && co.size){
			ou.set(btlr,gbb.CHASE_OPPONENTS);
			if(isRemoved) co.forEach((v,k)=>ou.byCond[k]&&ou.byCond[k].delete(btlr));
			else for(let x=1,arr=ou.byCond;x!==arr.length;++x){
				if(co.has(x)) arr[x].add(btlr);
				else arr[x].delete(btlr);
			}
		}else{
			ou.delete(btlr);
			ou.byCond.forEach(s=>s.delete(btlr));
		}
	} }
	{ const au=this._chases.get(this) , ca=btlr.getTraits_overall_s(gbb.TRAIT_CHASE_ALLBATTLER); if(au){
		if(ca && ca.size){
			au.set(btlr,gbb.CHASE_ALLBATTLERS);
			if(isRemoved) ca.forEach((v,k)=>au.byCond[k]&&au.byCond[k].delete(btlr));
			else for(let x=1,arr=au.byCond;x!==arr.length;++x){
				if(ca.has(x)) arr[x].add(btlr);
				else arr[x].delete(btlr);
			}
		}else{
			au.delete(btlr);
			au.byCond.forEach(s=>s.delete(btlr));
		}
	} }
};
($d$=$aaaa$.invokeChaseAction=function f(act,s,t){
	if(!s||!t) return;
	const M=this._chases , fu=s.friendsUnit() ;
	const btlrs=M&&M.get(fu);
	if(!btlrs || !btlrs.size) return;
	const item=act.item(),preloads={
		ncpaf:!_global_conf.chasePopAfterFrame,
		s:f.tbl[0],
		t:f.tbl[1], // there're skill that might change party members. DON'T USE ARRAY
		ts:undefined,
		tt:undefined,
		trgt:undefined,
	};
	preloads.s.clear();
	preloads.t.clear();
	if(item.itemType==='i') f.doChase(this,btlrs, 'item' ,s,t,item,preloads);
	else{
		// allow to be same skills, mostly are different though
		if(act.isAttack(s)) f.doChase(this,btlrs, 'attack' ,s,t,item,preloads);
		if(act.isGuard(s)) f.doChase(this,btlrs, 'guard' ,s,t,item,preloads);
		if(act.isSpaceout(s)) f.doChase(this,btlrs, 'spaceout' ,s,t,item,preloads);
	}
	// is dmg/rcvr
	if(item.damage.type){
		if(act.isRecover()) f.doChase(this,btlrs, 'heal' ,s,t,item,preloads);
		else{
			if(act.isPhysical()) f.doChase(this,btlrs, 'atk_physical' ,s,t,item,preloads);
			if(act.isMagical()) f.doChase(this,btlrs, 'atk_magical' ,s,t,item,preloads);
			// anyatk
			f.doChase(this,btlrs, 'anyatk' ,s,t,item,preloads);
		}
		if(item.damage.elementId<0){
			// as normal attack
			s.attackElements().forEach((_,k)=>f.doChase(this,btlrs, k ,s,t,item,preloads));
		}else f.doChase(this,btlrs, item.damage.elementId ,s,t,item,preloads);
	}
	// all
	f.doChase(this,btlrs, 'all' ,s,t,item,preloads);
}).tbl=[new Map(),new Map(),];
($d$.doChase=function f(self,btlrs,cond,s,t,item,preloads){
	const idx=Game_BattlerBase.cond2idx(cond);
	const set=btlrs.byCond[idx];
	if(set && set.size){
		const notExists=[];
		if(cond==='die'){
			set.forEach(btlr=>{
				btlr.isDeathStateAffected()&&f.forEach(self,notExists,btlrs,btlr,idx,s,t,item,preloads);
				notExists.push(btlr);
			});
		}else set.forEach(btlr=>!btlr.isDeathStateAffected()&&f.forEach(self,notExists,btlrs,btlr,idx,s,t,item,preloads));
		for(let x=notExists.length;x--;) set.delete(notExists[x]);
	}
}).forEach=function f(self,notExists,btlrs,btlr,chaseIdx,s,t,item,preloads){
	const codes=btlrs.get(btlr);
	if(!codes) return notExists.push(btlr);
	const code=Game_BattlerBase[codes[chaseIdx]];
	if(!code) return;
	const skills=btlr.traitsSet(code); // map: skillId -> *repeat
	if(skills && skills.size){
		if(f.tbl) f.tbl.setSubject(btlr);
		else f.tbl=new Game_Action(btlr);
		const a=f.tbl;
		a.setPreloadFlag();
		{ let ps=preloads.s.get(btlr);
		if(!ps){ a.refPreload_s(btlr);
			preloads.s.set(btlr,ps=a.copyPreload_s());
			}
		a.refPreload_s(ps);
		}
		const ncpaf=preloads.ncpaf;
		skills.forEach((v,k)=>{ if(!k) return;
			const repeat=f.setAction(item,a,s,t,k,preloads)*~~v; if(!(repeat>0)||!preloads.trgt) return;
			const aitem=a.item();
			{ const chaseCond=aitem.chaseCond||(aitem.chaseCond=aitem.meta.chaseCond&&objs._getObj.call(none,aitem.meta.chaseCond));
			if(chaseCond && !chaseCond(btlr,s,t)) return;
			}
			
			const orit=a.getPreload_t(),trgts=[];
			
			if(!(aitem.chaseApply&1)){
				if(!preloads.t.get(preloads.trgt)) preloads.t.set(preloads.trgt,a.copyPreload_t());
				trgts.push(preloads.trgt);
			}
			if(aitem.chaseApply&2){
				for(let i=0,mem=preloads.trgt.friendsUnit().members();i!==mem.length;++i){
					if(mem[i]===preloads.trgt) continue;
					trgts.push(mem[i]);
					if(preloads.t.get(mem[i])) continue;
					a.refPreload_t(mem[i]);
					preloads.t.set(mem[i],a.copyPreload_t());
				}
			}
			if(aitem.chaseApply&4){
				for(let i=0,mem=preloads.trgt.opponentsUnit().members();i!==mem.length;++i){
					trgts.push(mem[i]);
					if(preloads.t.get(mem[i])) continue;
					a.refPreload_t(mem[i]);
					preloads.t.set(mem[i],a.copyPreload_t());
				}
			}
			for(let x=repeat,m=preloads.t,tmp;x-->0;){
				for(let i=0;i!==trgts.length;++i){
					tmp=m.get(trgts[i]); if(!tmp) continue;
					a.refPreload_t(tmp);
					a.apply(trgts[i],ncpaf);
					self._logWindow.displayActionChaseResults(btlr,trgts[i],a);
				}
			}
			
			a.refPreload_t(orit); // restore
		});
	}
};
$d$.doChase.forEach.tbl=undefined;
($d$.doChase.forEach.setAction=function f(item,act,s,t,k,preloads){
	let rfl,skill,pk,p,repeat=0;
	switch(k){
	case "r-":
		rfl=1; preloads.trgt=s; pk='ts';p=preloads.ts;
		skill=item;
	break;
	case "r+":
		rfl=1; preloads.trgt=t; pk='tt';p=preloads.tt;
		skill=item;
	break;
	default:
		if(k<0){
			preloads.trgt=s; pk='ts';p=preloads.ts;
			k=-k;
		}else{
			preloads.trgt=t; pk='tt';p=preloads.tt;
		}
		skill=$dataSkills[k];
	break;
	}
	if(skill){
		if(!p){
			act.refPreload_t(preloads.trgt);
			p=preloads[pk]=act.copyPreload_t();
		}
		act.refPreload_t(p);
		act.setItemObject(skill);
		repeat=act.numRepeats(rfl);
	}
	return repeat;
}).tbl={
};
$aaaa$.invokeNormalAction=function(subject, target){
	const realTarget = this.applySubstitute(target);
	if(this._action.isUsePreload()) this._action.setPreload_t(realTarget);
	const usedAct=this._usedAct_normal=this._action.apply(realTarget);
	if(this._actUsed) this._dmgSum+=this._action._exeVal;
	this._logWindow.displayActionResults(subject, realTarget, usedAct);
	if(usedAct) this.invokeChaseAction(usedAct,subject,realTarget);
	return realTarget;
};
$r$=$aaaa$.invokeReflection=function(subject, target) {
	//this._action._reflectionTarget = target;
	this._logWindow.displayReflection(target);
	this._action._reflected=true;
	if(this._action.isUsePreload()) this._action.setPreload_t(subject);
	const usedAct=this._usedAct_reflect=this._action.apply(subject);
	this._action._reflected=undefined;
	this._logWindow.displayActionResults(subject, subject, usedAct);
};
$aaaa$.invokeMagicReflection=$r$;
$aaaa$.invokePhysicReflection=$r$;
$aaaa$.invokeOtherAction=function(subject,target,dataobj,isDispCtrMsg,isInstShowMsg){
	if(!dataobj) return;
	const action=new Game_Action(subject);
	action.setItemObject(dataobj);
	const usedAct=this._usedAct_other=action.apply(target,isInstShowMsg);
	if(isDispCtrMsg) this._logWindow.displayCounter(subject,target);
	this._logWindow.displayActionResults(subject, target, action, isInstShowMsg);
	if(usedAct) this.invokeChaseAction(usedAct,subject,target);
};
$aaaa$.invokeCounterAttack=function(oriS,oriT){
	this.invokeOtherAction(oriT,oriS,$dataSkills[oriT.counterAttackSkillId()],true);
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
($aaaa$.checkBattleEnd=function f(){
	if(this._phase){
		
		const dms=$gameParty.deadMembers();
		dms.forEach(f.forEach); // reviveLater
		const isAllDead=!($gameParty.members().length-dms.map(Game_Unit.isDead).sum()); // no alives
		
		if(this.checkAbort()) return true;
		else if(isAllDead){
			this.processDefeat();
			return true;
		}else if($gameTroop.isAllDead()){
			this.processVictory();
			return true;
		}
	}
	return false;
}).forEach=btlr=>btlr.reviveLater();
$r$=$aaaa$.endBattle;
($d$=$aaaa$.endBattle=function f(res){
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
	if(txts.length){
		while(txts.length) $gameMessage.add(txts.pop(),1);
		$gameMessage.add("\\MINOR\\-"+$dataCustom.someLeaveTheParty);
	}
	// too early to delete cache, however, need to remove them from party
	delList.forEach(f.forEach,this);
	
	this._chases=undefined;
}).ori=$r$;
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
($aaaa$[$k$]=function f(){
	return f.ori.call(this);
}).ori=$r$;
$aaaa$.displayRewards=function(){
	this.displayExp();
	//this.displayGold();
	//this.displayDropItems();
};
$k$='gainRewards';
$r$=$aaaa$[$k$];
($aaaa$[$k$]=function f(){
	$gameTemp.gainMsgConfigs_push();
	$gameSystem._usr._noGainMsg=0;
	$gameTemp._otherGainMsg=true;
	f.ori.call(this);
	$gameTemp._otherGainMsg=false;
	$gameTemp.gainMsgConfigs_pop();
	$gameMessage.add("\\MINOR");
}).ori=$r$;
$pppp$=$aaaa$=undef;

// scene

// - base
$aaaa$=Scene_Base;
$pppp$=$aaaa$.prototype;
$pppp$.updateChildren=Sprite.prototype.update;
$k$='detachReservation';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	debug.log('Scene_Base.prototype.detachReservation');
	let wl=this._windowLayer; if(wl) wl.destructor();
	return f.ori.call(this);
}).ori=$r$;
$pppp$.terminate=function(){
	const t=$gameScreen.tone() , satur=(255-t[3])/256;
	const c=d.ge("GameCanvas") , css=c&&c.style;
	if(css) css.filter=t[3]>0?"saturate("+ satur +")":"";
};
($pppp$.checkGameover=function f(){
	const dms=$gameParty.deadMembers();
	dms.forEach(f.forEach); // reviveLater
	const mN=$gameParty.members().length;
	const aliveN=mN-dms.map(Game_Unit.isDead).sum();
	if(($gameParty.inBattle()||mN)&&!aliveN) SceneManager.goto(Scene_Gameover);
//	if($gameParty.isAllDead()){
//		SceneManager.goto(Scene_Gameover);
//	}
}).forEach=btlr=>btlr.reviveLater();
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
	{ const t=window,w=t.innerWidth,h=t.innerHeight,g=Graphics,bw=g.boxWidth,bh=g.boxHeight;
	if((bh<<1)+bh<h && (bw<<1)+bw<w){
		g._stretchEnabled=false;
		g._switchStretchMode();
	}
	}
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
($pppp$[$k$]=function f(w){
	f.ori.call(this,w);
	w.refresh();
}).ori=$r$;
($pppp$.applyItem=function f(){
	const action = new Game_Action(this.user());
	action.setItemObject(this.item());
	this._action=action;
	this.itemTargetActors().forEach(f.forEach,this);
	action.applyGlobal();
}).forEach=function(t){
	const a=this._action;
	if(a)for(let i=0,s=a.subject(),r=a.numRepeats();i<r;++i){
		if(s!==t){ const rnd=Math.random(); if( rnd<a.itemPrf(t) || rnd<a.itemMrf(t) || rnd<a.itemArf(t) ){
			a._reflected=true;
			a.apply(s);
			a._reflected=undefined;
			continue;
		} }
		a.apply(t);
	}
};
$pppp$=$aaaa$=undef;

// Scene_Item
$aaaa$=Scene_Item;
$pppp$=$aaaa$.prototype;
$pppp$.createHelpWindow=function(){
	this.addWindow( this._helpWindow = new Window_Help(3) );
};
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
($pppp$.create=function f(){
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
			//w.height=w.fittingHeight(3-!($gameSystem&&$gameSystem._usr._showFullEquipInfo));
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
}).ori=$r$;
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
	//this.actor().optimizeEquipments();
	this.actor().fillEmptyEquipSlots();
	if(!itemEmpty || (iw._data&&(iw._data.length===0||iw._data[0]===null))!==itemEmpty) iw.refresh();
	this._statusWindow.refresh();
	this._slotWindow._setSlotIdTbl();
	this._slotWindow.refresh();
	this._commandWindow.activate();
};
$k$='commandClear';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	const slw=this._slotWindow;
	slw._setSlotIdTbl();
	slw.refresh();
	const iw=this._itemWindow;
	iw._data.s=-1;
	iw.refresh();
}).ori=$r$;
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
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this._oriSwitchVal=undefined;
}).ori=$r$;
$pppp$.saveSwitch=function(){
	const ss=this._saveSwitch_id;
	if(ss===undefined) return;
	if(ss-0+1) $gameSwitches.setValue(ss,1);
	else{
		const it=this._saveSwitch_interpreter;
		$gameSelfSwitches._setValue(it._mapId,it._eventId,ss,1);
	}
};
$k$='onSavefileOk';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	if($gameTemp._switchTrue_if_saved_id){
		this._oriSwitchVal=$gameSwitches.value($gameTemp._switchTrue_if_saved_id,true);
		$gameSwitches.setValue($gameTemp._switchTrue_if_saved_id,true);
	}
	this.saveSwitch();
	f.ori.call(this);
	if(!$gameTemp._switchTrue_if_saved_preserveId) $gameTemp._switchTrue_if_saved_id=undefined;
}).ori=$r$;
$k$='onSaveSuccess';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	this._saveSwitch_id=undefined;
	return f.ori.apply(this,arguments);
}).ori=$r$;
$k$='onSaveFailure';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	if($gameTemp._switchTrue_if_saved_id) $gameSwitches.setValue($gameTemp._switchTrue_if_saved_id,this._oriSwitchVal);
}).ori=$r$;
$pppp$=$aaaa$=undef;

// - title
$aaaa$=Scene_Title;
$pppp$=$aaaa$.prototype;
Object.defineProperties($pppp$,{
	_edt:{set:none,get:()=>objs.isDev&&console.warn('see objs.funcs.sysSetting')||undefined,
	},
});
$r$=$pppp$.create;
($pppp$.create=function f(){
	debug.log('Scene_Title.prototype.create');
	objs.funcs.sysSetting._.call(this);
	f.ori.call(this);
	$dataMap=null;
	$gamePlayer=objs.$gamePlayer=null;
	let refreshes=objs._refreshVars;
	for(let i in refreshes) refreshes[i]();
	$gameSystem._usr=0;
}).ori=$r$;
$pppp$.start=function(){
	Scene_Base.prototype.start.call(this);
	SceneManager.clearStack();
	this.centerSprite(this._backSprite1);
	this.centerSprite(this._backSprite2);
	this.playTitleMusic();
	this.startFadeIn(this.fadeSpeed(), false);
};
$r$=$pppp$.terminate;
($pppp$.terminate=function f(){
	f.ori.call(this);
	if(this._cursorDiv) this._cursorDiv.parentNode.removeChild(this._cursorDiv);
}).ori=$r$;
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
($pppp$[$k$]=function f(){
	return !$gameMap._interpreter.isRunning()&&f.ori.call(this);
}).ori=$r$;
$k$='onMapLoaded';
$r$=$pppp$[$k$];
($d$=$pppp$[$k$]=function f(){
	//debug.log('Scene_Map.prototype.onMapLoaded');
	//debug.log('!$dataMap',!$dataMap);
	Sprite._counter&=0; // reset Sprite.spriteId counter // sprites will be in 'SceneManager._scene._spriteset._tilemap.children'
	// '$dataMap' is updated ; '$gameMap' will be updated after 'f.ori' if by '$gamePlayer.reserveTransfer'
	if($gameScreen){
		// reset tone and viewRange
		if($gameScreen._tone) for(let x=0,arr=$gameScreen._tone;x!==arr.length;++x) arr[x]&=0; // reset tone
		// reset viewRange
		$gameScreen.limitedView=objs._getObj.call(none,$dataMap.meta.limitedView); // reset viewRange
		// reset weather
		if($gameScreen._weatherPower) $gameScreen.clearWeather();
	}
	const lastMapId=$gameMap&&$gameMap._mapId,regenIds=0&&$gameMap._events.filter(f.tbl[0]).map(f.tbl[1]);
	
	//f.ori.call(this); // update '$gameMap' (and maybe others)
	if(this._transfer) $gamePlayer.performTransfer();
	
	$gameTemp.poolEvt_newMap($gameMap._mapId);
	// custom pannels
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
	// - adjust evt ids
	if($gameMap._mapId===lastMapId) $gameMap.adjEvtIds($gameMap._events);
	//debug.log('',lastMapId,'->',$gameMap._mapId);
		// from '$gamePlayer.reserveTransfer': different
		// from New Game: 0 -> init_map_id
		// from Continue: same
		// from scenePush and then scenePop (e.g. open menu then close it): same
	if($gameMap._mapId!==lastMapId){ // map changed
		// adj evt id, put templates starting points
		{ const mcs=$gameParty.mapChanges,mc=mcs&&mcs[this._mapId];
		$gameMap._templateStrts=mc&&mc.templateStrts;
		$gameMap.adjEvtIds(mc&&mc.events); // $gameMap.updateTemplateStrts();
		}
		// clear temp:clearedWhenNewMap to '{}'
		$gameTemp.initClearedWhenNewMap();
		// active initialization events: turn on its switch "A"
		for(let x=0,arr=$dataMap.events;x!==arr.length;++x){ const evt=arr[x];
			if(evt&&evt.note==="init"){
				$gameMap._events[x]._skipRender=1;
				$gameSelfSwitches._setValue($gameMap._mapId,x,"A",1);
			}
		}
		// random map
		if($dataMap.meta.random){
			delete $gameParty.mch().randmaze; // clear before maze generation
			f.genRandMaze();
		}
		// workers
		if($gameParty) $gameParty.members().forEach(x=>rpgskills.list.rfl_summonClones_fromActorWorkers(x));
		// clearLastRegen's selfswitches
		if(regenIds&&regenIds.length){ const o=$gameSelfSwitches._data[lastMapId]; if(o){
			for(let x=0,xs=regenIds.length,kv=f.tbl[2],ks=kv.length;x!==xs;++x){
				for(let ki=0;ki!==ks;++ki){
					$gameSelfSwitches.setValue_(o,regenIds[x],kv[ki],false,lastMapId);
				}
			}
		} }
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
	
	this.createDisplayObjects();
	Graphics._preCalScreenTileCoord(); // pre-cal. $gameMap.screenTileX(); $gameMap.screenTileY();
	this._createPannels();
}).ori=$r$;
$d$.tbl=[
	x=>x&&x.event().meta.regen,
	x=>x._eventId,
	["A","B","C","D","E","knowName"],
];
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
($pppp$.start=function f(){
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
}).ori=$r$;
$pppp$.updateMain=function(){
	// Scene_Map.prototype.updateMain
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
($pppp$.create=function f(){
	f.ori.call(this);
	$gameTemp._scShop_balance=0; // seller gainGold
	$gameTemp._scShop_buySth=false; // player buy
	$gameTemp._scShop_sellSth=false; // player sell
	$gameTemp._scShop_negBalance=false;
	
	let w,tmp;
	// set help fontsize
	w=this._helpWindow;
	//tmp=w.standardFontSize();
	//w.setFontsize((tmp>>1)+(tmp>>3));
	tmp=w.height;
	//w.height=w.fittingHeight(3-!($gameSystem&&$gameSystem._usr._showFullEquipInfo));
	w.height=w.fittingHeight(3);
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
}).ori=$r$;
$pppp$.createDummyWindow = function() {
	let wy = this._commandWindow.y + this._commandWindow.height;
	let wh = Graphics.boxHeight - wy;
	this._dummyWindow = new Window_Dummy(0, wy, Graphics.boxWidth, wh);
	this.addWindow(this._dummyWindow);
};
$r$=$pppp$.doBuy;
($pppp$.doBuy=function f(n){
	$gameTemp._scShop_balance+=$gameParty._gold;
	f.ori.call(this,n);
	$gameTemp._scShop_balance-=$gameParty._gold;
	$gameTemp._scShop_buySth=true;
}).ori=$r$;
$r$=$pppp$.doSell;
($pppp$.doSell=function f(n){
	$gameTemp._scShop_balance+=$gameParty._gold;
	f.ori.call(this,n);
	$gameTemp._scShop_balance-=$gameParty._gold;
	$gameTemp._scShop_sellSth=true;
}).ori=$r$;
$pppp$.maxBuy=function(){
	const max=$gameParty.maxItems(this._item)-$gameParty.unionCnt(this._item);
	const price=this.buyingPrice();
	return price>0 ? Math.min(Math.floor(this.money() / price),max) : max;
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
		else if(!this._logWindow.active && (!this._battlePlan || !this._battlePlan.visible) && !this.isSwapWindowActive()) this.startPartyCommandSelection(); // viewLog
	}else this.endCommandSelection();
};
$r$=$pppp$.terminate;
($d$=$pppp$.terminate=function f(){
	f.ori.call(this);
	BattleManager.clearTBDCache();
	$gameTroop.members().forEach(f.forEach);
}).ori=$r$;
$d$.forEach=b=>{
	b.clearCache();
	b._databaseDel_state_all();
};
$pppp$.createSpriteset=function(){
	this._chr2sp=new Map();
	this._chr2actResQ=new Map();
	this.addChild(this._spriteset = new Spriteset_Battle(this));
};
$k$='createAllWindows';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this.createSwapActorWindow();
	// trim
	this._actorWindow.y=0;
}).ori=$r$;
$k$='createPartyCommandWindow';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	const w=this._partyCommandWindow;
	w.setHandler('swap',    	this.commandSwap.bind(this));
	w.setHandler('usePlan', 	this.commandUsePlan.bind(this));
	w.setHandler('allAtk',  	this.commandAtkAll.bind(this));
	w.setHandler('allGuard',	this.commandGuardAll.bind(this));
	w.setHandler('allSpaceout',	this.commandSpaceoutAll.bind(this));
	w.setHandler('viewLog', 	this.commandViewLog.bind(this));
}).ori=$r$;
$pppp$.createSwapActorWindow=function(){
	let w;
	//this.addWindow( w = this._swapActorWindow = new Window_BattleStatus() );
	w=this._swapActorWindow=this._actorWindow;
};
$k$='createActorCommandWindow';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this._actorCommandWindow.setHandler('spaceout',   this.commandSpaceout.bind(this));
}).ori=$r$;
$pppp$.createHelpWindow=function(){
	Scene_MenuBase.prototype.createHelpWindow.call(this);
	this._helpWindow.visible=false;
};
$pppp$.isSwapWindowActive=function(){
	return this._swapActorWindow && this._swapActorWindow.active && this._swapActorWindow._mode==='s';
};
$pppp$.commandSwap=function(){
	this._statusWindow.noRefresh=true; // directly draw when needed
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
	const cmdw=this._partyCommandWindow , statw=this._statusWindow , swapw=this._swapActorWindow ;
	swapw.noRefresh=statw.noRefresh=!(cmdw.active=false);
	if(this._battlePlan===undefined){
		const plan = this._battlePlan = new Window_BattlePlan ;
		const bye=()=>this._windowLayer.visible=cmdw.active=!(swapw.noRefresh=statw.noRefresh=plan.visible=plan.active=false) ;
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
		{ const t0=t[0];
		while(t.length) bm.updateAction(true);
		if(act.isForOne()) s.setLastTarget(t0);
		}
		this.changeInputWindow();
		act.initMeta();
		bm._subject=null;
		bm._targets.length=0;
		BattleManager.checkBattleEnd();
		return this._instUsed=true;
	} } }
	BattleManager.selectNextCommand();
	this.changeInputWindow();
};
$r$=$pppp$.onActorOk;
($pppp$.onActorOk=function f(){
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
}).ori=$r$;
$k$='onActorCancel';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	const w=this._swapActorWindow;
	switch(w._mode){
	default: return f.ori.call(this);
	case 's': { // swap
		if(w._pendingIndex>=0){
			const idx=w._pendingIndex;
			w._pendingIndex=-1;
			w.redrawItem(idx);
			w.activate(); // needed
		}else{
			w._mode=undefined;
			w.deactivate();
			w.hide();
			this._statusWindow.noRefresh=false;
			this._partyCommandWindow.activate();
		}
	}break;
	}
}).ori=$r$;
$pppp$.selectEnemySelection=function(){
	this._enemyWindow.refresh();
	this._enemyWindow.show();
	this._enemyWindow.activate();
};
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
($pppp$[$k$]=function f(){
	switch(this._allSpecific){
	default: return f.ori.call(this);
	case 1:{
		this._allSpecific=0;
		this._enemyWindow.hide();
		//this._partyCommandWindow.activate();
	}break;
	}
}).ori=$r$;
$pppp$.onSelectAction=function(){
	this.clearInstLog();
	const action = BattleManager.inputtingAction();
	this._skillWindow.hide();
	this._itemWindow.hide();
	if(!action.needsSelection()) this.selectNextCommand();
	else if(action.isForOpponent()){
		this._enemyWindow._action=action;
		this.selectEnemySelection();
	}
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
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this._data=new Map();
	this._$gameObjs_tmp=new Map(); // take advantage of re-new of game objs are at the same time
	//this._ssSets=[];
}).ori=$r$;
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
Object.defineProperties($pppp$, {
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
($pppp$[$k$]=function f(){
	this._parallaxX_tw^=0;
	this._parallaxY_th^=0;
	this._displayX_tw^=0;
	this._displayY_th^=0;
	this._wtw^=0;
	this._hth^=0;
	f.ori.call(this);
	this._itrpv=undefined; // []; // construct @ 'Game_Map.prototype.updateInterpreter' , @ 'Game_Map.prototype.setupStartingMapEvent'
}).ori=$r$;
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
($pppp$.setup=function f(){ // exec when 1. change map ; or 2. $dataMap version updated
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
}).ori=$r$;
($pppp$.setupEvents=function f(){
	$gameTemp.poolEvt_newMap();
	this._events = [];
	for(let i=0,arr=$dataMap.events;i!==arr.length;++i){
		if(arr[i]) this._events[i] = objs.new_Game_Event(this._mapId, i);
	}
	this._commonEvents = this.parallelCommonEvents().map(f.forEach);
	this.refreshTileEvents();
}).forEach=commonEvent=>new Game_CommonEvent(commonEvent.id);
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
$pppp$.updateTemplateStrts=function(){
	return this._templateStrts=$dataMap && {
		ende:$dataMap.templateStrt_ende,
		item:$dataMap.templateStrt_item,
		move:$dataMap.templateStrt_move,
		tile:$dataMap.templateStrt_tile,
	};
};
($d$=$pppp$.loadDynamicEvents=function f(fromLoadFile,noUpdate){
	debug.log('Game_Map.prototype.loadDynamicEvents');
	debug.log($dataMap,objs.$gameMap&&objs.$gameMap._mapId);
	
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
						for(let i=0;i!==use.length;++i) objs.$gameMap.cpevt(Number(use[i])+$dataMap[key],evt.x,evt.y,1,1,true);
					}
				}
			}
		}
		//   
		let evts=objs.$gameParty.mapChanges[this._mapId].events;
		if(evts){
			let delList=[],gss=objs.$gameSelfSwitches;
			for(let i in evts){ //debug.log2(i);
				if(i==='0') continue;
				let evt=evts[i];
				if(evt._erased){
					f.relatedSelfSwitches(evt,1);
					for(let x=0,sss=gss.switches;x!==sss.length;++x) gss._setValue(this._mapId,i,sss[x],false);
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
				for(let x=0,sss=gss.switches;x!==sss.length;++x) gss._setValue(this._mapId,delList[x],sss[x],false);
				if(evts[delList[x]]) evts[delList[x]]._erased=true;
			}
		}
	}
	if(!noUpdate) objs.$gameSelfSwitches.onChange();
	for(let x=0,evts=this._events;x!==evts.length;++x) evts[x]&&f.trim(evts[x]);
}).trim=evt=>{ // - - event
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
$d$.relatedSelfSwitches=(evt,doRemove)=>{
	// evt.constructor === Game_Event
	
	// self switches
	if(evt._sameStatEvts){ const obj=objs.$gameSelfSwitches._data[objs.$gameMap._mapId];
		if(obj){ const sskeys=objs.$gameSelfSwitches.switches;
			for(let x=0,arr=evt._sameStatEvts;x!==arr.length;++x){ let evtid=arr[x];
				for(let z=0;z!==sskeys.length;++z){
					objs.$gameSelfSwitches.setValue_(obj,evtid,sskeys[z],!doRemove && obj[evt._eventId][sskeys[z]]);
				}
			}
		}
	}
	
	return evt;
};
($d$=$pppp$.adjEvtIds=function f(evts){
	const pre=objs.$gameMap._templateStrts;
	objs.$gameMap.updateTemplateStrts();
	if(!pre||!evts) return;
	const curr=objs.$gameMap._templateStrts,tss=[[0,0,0]];
	let hasDiff=false;
	for(let i in pre){
		if(pre[i]!==curr[i]) hasDiff=true;
		tss.push([pre[i],curr[i],$dataMap['templateStrt_'+i]]);
	}
	if(!hasDiff) return;
	tss.sort(f.cmp);
	tss.mappings=[];
	for(let x=0,xs=tss.mappings.length=tss.back[0],last=0;x!==xs;++x){
		if(x===tss[last+1][0]) ++last;
		tss.mappings[x]=tss[last];
	}
	const delList=[];
	if(evts.constructor!==Array){
		for(let i in evts) i!=='0' && delList.push(f.adj(evts[i],tss,evts));
		delList.forEach(f.del,evts);
	}else{
		for(let x=0,arr=evts,xs=arr.length;x!==xs;++x) delList.push(f.adj(arr[x],tss,arr));
		const newArr=evts.slice(0,Math.min(tss[1][0],tss[1][1]));
		newArr.length=$dataMap.events.length;
		for(let x=pre.ende,arr=evts;x!==arr.length;++x) newArr.push(arr[x]);
		delList.forEach(f.del,evts);
		evts.length=0; evts.concat_inplaceThis(newArr);
		evts.forEach(f.setIdx);
	}
}).cmp=(a,b)=>a[0]-b[0];
$d$.del=function(id){ if(id && !(id-0)){
	delete this[id];
} };
$d$.map=x=>x[0];
$d$.setIdx=(x,i,a)=>x && (a[x._eventId]=x);
($d$.adj=function f(evt,tss,evts){
	if(!evt) return;
	const oriId=evt._eventId;
	const newId=evt._eventId=f.newId(oriId,tss);
	if(evts&&evts.constructor!==Array) evts[newId]=evt;
	const arr=evt._sameStatEvts;
	if(arr) for(let x=0;x!==arr.length;++x) arr[x]=f.newId(arr[x],tss);
	if(newId!==oriId){
		$gameSelfSwitches.moveTo(evt._mapId,newId,oriId);
		return oriId;
	}
}).newId=(evtid,tss)=>{
	if(!evtid) return evtid;
	const id=evtid.toId();
	const m1=tss.mappings[id];
	const m2=m1||tss.back;
	const d=m2[0]-m2[1]; // str-d
	if(!d) return id;
	const subid=evtid.subId();
	return subid?(id-d)+'-'+subid:id-d;
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
	return $dataMap && this.isValid(x,y) ? (lv*this.height()+y)*this.width()+x : undefined;
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
($pppp$.layeredTiles=function f(x,y){ // rewrite for efficiency
	//let idx=this.width()*y+x;
	//let rtv=$dataMap.data3d[idx];
	//if(rtv.length!==4) DataManager.resetData3d(idx); // for future use: reduce mem usage
	//return rtv;
	return $dataMap.data3d[$dataMap.width*y+x]||f._dummy;
})._dummy=[];
$pppp$.hasTile_bak=function(x,y,tiles){
	// use tiles.contains, speedup yourself
	const sz=$dataMap.width*$dataMap.height;
	const idx=$dataMap.width*y+x;
	for(let z=0;z!==4;++z) if(tiles.contains($dataMap.data_bak[idx+sz*z])) return true;
	return false;
};
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
($pppp$[$k$]=function f(X,Y){
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
}).ori=$r$;
($pppp$.isChair=function f(x,y){
	if(parseInt(x)!==x||parseInt(y)!==y) return false;
	return $dataMap.isChair[y*$dataMap.width+x];
}).tbl=[];
$pppp$.update=function(sceneActive){
	this.refreshIfNeeded();
	this.updateEvents(); //
	if(sceneActive){
		this.updateInterpreter();
	}
	this.updateScroll();
	//this.updateEvents(); //
	this.updateVehicles();
	this.updateParallax();
};
$k$='displayName';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	//debug.log('Game_Map.prototype.displayName');
	const pt=$gameParty && $gameParty.mapChanges,id=$gameMap._mapId;
	const evalName = $dataMap.evalName===undefined ? ($dataMap.evalName=objs._getObj($dataMap.meta.evalName)) : $dataMap.evalName ;
	return pt && pt[id] && pt[id].name || evalName || f.ori.call(this);
}).ori=$r$;
$r$=$pppp$.data;
($d$=$pppp$.data=function f(idx){
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
}).ori=$r$;
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
	const marker=[]; if(!overwrite){
		marker.length=$gameMap.size;
		for(let i=0;i!==evts.length;++i){ let evt=evts[i];
			if(evt && evt._erased===false && evt._through===false){
				let evtd=evt.event();
				marker[evt.xy2idx()]=(!evtd.isChild||evtd.meta.isOnLand)&&evtd.note!=="tile-block";
			}
		}
	}
	const mapid=this._mapId;
	let ssobj=$gameSelfSwitches._data[mapid]; if(!ssobj) ssobj=$gameSelfSwitches._data[mapid]={};
	const strt=evts.length;
	//let tm=(Date.now()-tm2020strt).toHexInt().slice(-4); // int overflow
	const tm=((Date.now()-tm2020strt)%65536).toHexInt().slice(-4);
	for(let ys=y+h;y!==ys;++y){ for(let xs=x+w;x!==xs;++x){
		if((constraintFunc&&!constraintFunc(x,y))||marker[this.xy2idx(x,y)]) continue;
		let newid=evtid+'-'+tm+"_"+evts.length;
		while(newid in evts) newid+="_";
		let obj=objs.new_Game_Event(mapid,newid); // obj._mapId=mapid;
		obj._realX=obj._x=x; obj._realY=obj._y=y;
		evts.push(obj); evts[obj._eventId]=obj;
		for(let i=0;i!==ssStates.length;++i) $gameSelfSwitches.setValue_(ssobj,obj._eventId,ssStates[i],true);
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
	return $gameSelfSwitches._value(this._mapId,evtid,sname);
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
($pppp$.updateInterpreter=function f(){
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
}).tmp=[];
$k$='setupStartingEvent';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	//debug.log('Game_Map.prototype.setupStartingEvent'); // this is polling
	return f.ori.call(this);
}).ori=$r$;
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
($pppp$.autoplay=function f(){
	f.ori.call(this);
	if($dataMap.meta.rndmusic) AudioManager.playBgm(objs.rndmusic());
	else AudioManager.stopPitch_bgm();
}).ori=$r$;
$r$=$pppp$.refresh;
($pppp$.refresh=function f(){
	f.ori.call(this);
	let tm=SceneManager.getTilemap();
	if(tm && tm.constructor===ShaderTilemap){
		let sx=$gameMap._displayX_tw/$gameMap.tileWidth(),sy=$gameMap._displayY_th/$gameMap.tileHeight();
		tm._paintAllTiles(sx^0,sy^0);
	}
}).ori=$r$;
$r$=$pppp$.refresh;
($d$=$pppp$.refresh=function f(){ // reduce refresh calls
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
}).ori=$r$;
$d$.itvl=16; $d$.lastTime=0;
$k$='requestRefresh';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	//debug.log('Game_Map.prototype.requestRefresh');
	return f.ori.call(this);
}).ori=$r$;
$pppp$[$k$]=$r$; // not changed
$d$={};
// $d$.ori=$r$;
$aaaa$.e=Math.max($pppp$.tileWidth(),$pppp$.tileHeight());
$pppp$=$aaaa$=undef;

// - interpreter
$aaaa$=Game_Interpreter;
$pppp$=$aaaa$.prototype;
($aaaa$.EMPTY=deepcopy({code:0,indent:0,parameters:[],_anchor:null}))._anchor=()=>{};
$k$='initialize';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	this._strtMeta=this._chrParam=null;
	return f.ori.call(this,arguments[0]);
}).ori=$r$;
$r$=$pppp$.character;
($pppp$.character=function f(param){
	return f.ori.call(this,this._chrParam=param);
}).ori=$r$;
Object.defineProperty($pppp$,'_character',{
	get:function(){ return this.character(this._chrParam); },
	set:function(rhs){
		if(!rhs) this._chrParam=null;
		return rhs;
	},
});
$t$=($pppp$.makeLabelTbl=function f(){
	const arr=this._list,tbl=this._labelTbl={},indents=[],rl=this._rightLe||(this._rightLe=[]),lo=this._loop||(this._loop=[]);
	if(arr){ // reversed order
		const xs=arr.length,rr=[],lastLo=[],lbs=[]; // rightRepeat , lastLoop , lastBreak
		const kargs={
			tbl:tbl,
			rr:rr,
			lbs:lbs,
			lo:lo,
		};
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
			const func=f.tbl[c.code];
			if(func) func(x,c,kargs);
		}
	}
	if(indents.length){ indents.reverse();
		const t=this._segtree_indent={};
		t.max=new SegmentTree(Math.max,   -1,indents,true);
		t.min=new SegmentTree(Math.min,1<<21,indents,true);
	}else this._segtree_indent=undefined;
}).tbl=[]; for(let x=1e3;x--;) $t$[x]=undefined;
$t$[112]=(x,c,kargs)=>{
	if(kargs.rr[c.indent]>=0){
		const t=kargs.rr[c.indent]; kargs.lo[t]=x;
		if(kargs.lbs.length) for(let lb=kargs.lbs.pop();lb.length;) kargs.lo[lb.pop()]=t;
		kargs.rr[c.indent]=-1;
	}
};
$t$[113]=(x,c,kargs)=>{
	kargs.lbs.back.push(x);
};
$t$[413]=(x,c,kargs)=>{
	kargs.rr[c.indent]=x;
	kargs.lbs.push([]);
};
$t$[118]=(x,c,kargs)=>{
	kargs.tbl[c.parameters[0]]=x;
};
$t$=undef;
$r$=$pppp$.setup;
($pppp$.setup=function f(list,evtId,strtMeta){
	f.ori.call(this,list,evtId);
	this.makeLabelTbl();
	this._strtMeta=strtMeta;
	this._tmpData={};
}).ori=$r$;
$r$=$pppp$.clear;
($pppp$.clear=function f(){
	// flow: '.terminate' , '.clear'
	this._pageId=undefined;
	this._tmpData=undefined;
	this._strtMeta=undefined;
	this._saveSwitch=undefined;
	this._segtree_indent=undefined;
	if(this._rightLe) this._rightLe.length=0;
	else this._rightLe=[];
	if(this._loop) this._loop.length=0;
	else this._loop=[];
	return f.ori.call(this);
}).ori=$r$;
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
		$gameMessage._fadeEffect=this.fadeEffect; this.fadeEffect=undefined;
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
$t$=($d$=$pppp$.command111=function f(){ // cond branch
	let res;
	if(this._params[0]===12){
		if(this._params[1][0]===":"&&this._params[1][1]==="!") res=f.script.call(this,this._params[1].slice(2));
		else res=objs._getObj.call(this,this._params[1]);
	}else{
		const func=f.tbl[this._params[0]];
		if(func) res=func.call(this);
	}
	if(!(this._branch[this._indent]=!!res)) this.skipBranch();
	return true;
}).tbl=[
	function(){ // 0: switch
		return ($gameSwitches.value(this._params[1])===(this._params[2]===0));
	}, // 0: switch
	function f(){ // 1: var
		return f.tbl[this._params[4]](
			$gameVariables.value(this._params[1]),
			this._params[2]?$gameVariables.value(this._params[3]):this._params[3]
		);
	}, // 1: var
	function(){ // 2: ss
		return $gameSelfSwitches._value(this._mapId,this._eventId,this._params[1])===(!this._params[2]);
	}, // 2: ss
	function(){ // 3: timer
		return $gameTimer.isWorking() && ($gameTimer._frames>this._params[1]*60)===(!this._params[2]);
	}, // 3: timer
	function f(){ // 4: actor
		return f.tbl[this._params[2]].call(this,$gameActors.actor(this._params[1]),this._params[3]);
	}, // 4: actor
	function(){ // 5: Enemy
		const enemy=$gameTroop.members()[this._params[1]];
		return enemy&&(this._params[2]?enemy.isStateAffected(this._params[3]):enemy.isAlive());
	}, // 5: Enemy
	function(){ // 6: chr dir
		const chr=this.character(this._params[1]);
		return chr?(chr.direction()===this._params[2]):false;
	}, // 6: chr dir
	function f(){ // 7: Gold
		return f.tbl[this._params[2]]($gameParty.gold(),this._params[1]);
	}, // 7: Gold
	function(){ // 8: Item
		return $gameParty.hasItem($dataItems[this._params[1]]);
	}, // 8: Item
	function(){ // 9: Weapon
		return $gameParty.hasItem($dataWeapons[this._params[1]], this._params[2]);
	}, // 9: Weapon
	function(){ // 10: Armor
		return $gameParty.hasItem($dataArmors[this._params[1]], this._params[2]);
	}, // 10: Armor
	function(){ // 11: Button
		return Input.isPressed(this._params[1]);
	}, // 11: Button
	0, // 12: script
	function(){ // 13: Vehicle
		return $gamePlayer.vehicle()===$gameMap.vehicle(this._params[1]);
	}, // 13: Vehicle
];
($d$.script=function f(j){
	j=JSON.parse(j);
	let obj=false;
	if(j[0]==="func"){
		if(j[1] in rpgevts){
			let curr=rpgevts,argv;
			for(let x=1;x!==j.length&&curr;++x){ let next=j[x];
				if(next&&next.constructor===Array){ argv=next; break; }
				else curr=curr[next];
			}
			return curr(this.getEvt(),argv,this);
		}
		return;
	}else{
		const func=f.tbl[j[0]];
		if(func) obj=func.call(this);
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
}).tbl={
	itrp: function(){ return this; },
	this: function(){ return this; },
	pt: ()=>$gameParty,
	pl: ()=>$gamePlayer,
	mp: ()=>$gameMap,
	tmp: ()=>$gameTemp,
	evt: function(){ return this.getEvt(); },
	evtd: function(){ return this.getEvt().event(); },
	evts: ()=>$gameMap._events,
	dataMp: ()=>$dataMap,
	dataIt: ()=>$dataItems,
	dataAm: ()=>$dataArmors,
	dataSk: ()=>$dataSkills,
	dataWp: ()=>$dataWeapons,
};
$t$[1].tbl=[
	(v1,v2)=>v1===v2,
	(v1,v2)=>v1>= v2,
	(v1,v2)=>v1<= v2,
	(v1,v2)=>v1>  v2,
	(v1,v2)=>v1<  v2,
	(v1,v2)=>v1!==v2,
];
$t$[4].tbl=[
	actor=>$gameParty.members().contains(actor),
	(actor,n)=>actor.name()===n,
	(actor,n)=>actor.isClass($dataClasses[n]),
	(actor,n)=>actor.hasSkill(n),
	(actor,n)=>actor.hasWeapon($dataWeapons[n]),
	(actor,n)=>actor.hasArmor($dataArmors[n]),
	(actor,n)=>actor.isStateAffected(n),
];
$t$[7].tbl=[
	$t$[1].tbl[1],
	$t$[1].tbl[2],
	$t$[1].tbl[4],
];
$t$[12]=$d$.script;
$t$=undef;
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
		$gameSelfSwitches._setValue(this._mapId,this._eventId,this._params[0], this._params[1] === 0);
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
$pppp$.command352=function(){
	if(!$gameParty.inBattle()){
		const sm=SceneManager;
		sm.push(Scene_Save);
		const nsc=sm._nextScene;
		if(nsc){
			nsc._saveSwitch_interpreter = this;
			nsc._saveSwitch_id = this._saveSwitch;
			this._saveSwitch = undefined;
		}
	}
	return true;
};
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
Object.defineProperties($pppp$, {
	mtp: { get: function() { return this.maxTp(); }, configurable: false },
	stp: { get: function() { return this._stp; }, configurable: false },
	mstp: { get: function() { return this.maxStp(); }, configurable: false },
	lastPayMp:{ get: function() { return this.lastPay().mp||0; },configurable: false},
	lastPayHp:{ get: function() { return this.lastPay().hp||0; },configurable: false},
	lastPayTp:{ get: function() { return this.lastPay().tp||0; },configurable: false},
});
$k$='clearBuffs';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	// this._buffs must be Array so that any other members appear on it will not be saved to game saves
	this._buffs.set=new Set();
}).ori=$r$;
$pppp$.updateChase=function(o,n){ // if no args, update!
	if(SceneManager.isBattle()){
		const gbb=Game_BattlerBase;
		const k=gbb[arguments.length&&gbb.CHASES.kb];
		if(!k||(o&&o.tmapS.has(k))||(n&&n.tmapS.has(k))) BattleManager.updateChase(this);
	}
};
$pppp$.isMaxBuffAffected=none; // 2 ?
$pppp$.isMaxDebuffAffected=none; // this._buffs[paramId]===-2 ?
$d$=$pppp$.updateStateTurns=function f(){
	this._states.forEach(f.forEach, this._stateTurns);
};
$d$.forEach=function(stateId){
	this[stateId]>0 && --this[stateId];
};
$d$=$pppp$.clearStates=function f(ignoreBuff){
	this._states_delCache();
	this._stateTurns={};
	if(this._states){
		let newidx=0;
		for(let x=0,arr=this._states,cache=$gameSystem._database_getCache();x!==arr.length;++x){
			const meta=$dataStates[arr[x]].meta;
			if(meta.persist || ignoreBuff && meta.buff){
				arr[newidx++]=arr[x];
			}else{
				this._stateDmgVal_del($dataStates[arr[x]]);
				this._databaseDel_state($dataStates[arr[x]],cache);
			}
		}
		if(this._states.length!==newidx){
			this._states.length=newidx;
			this._overall_delCache();
			this.updateChase();
		}
	}else this._states=[];
};
$pppp$.eraseState=function(stateId){
	const index=this._states.indexOf(stateId);
	const rtv=index>=0;
	if(rtv){
		this._states.splice(index, 1);
		const data=$dataStates[stateId],stat=this._states_getCache();
		if(stat){
			stat.splice(index, 1);
			stat.a.delete(stateId);
			stat.s.byKey2_del_sum(data.tmapS);
			stat.m.byKey2_del_mul(data.tmapP);
		}
		this._overall_delCache();
		this.updateChase(data);
		this._stateDmgVal_del(data);
		this._databaseDel_state(data);
	}
	delete this._stateTurns[stateId];
	return rtv;
};
$pppp$.isStateExpired=function(stateId){
	return !this._stateTurns[stateId];
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
	const data=$dataStates[stateId] , stat=this._states_getCache();
	if(stat){
		stat.a.add(stateId);
		stat.push(data);
		stat.s.byKey2_sum(data.tmapS);
		stat.m.byKey2_mul(data.tmapP);
	}
	this._overall_delCache();
	this._databaseAdd_state(data);
	this._stateDmgVal_add(data);
	this.updateChase(data);
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
$pppp$._statesExtra=function f(){
	const rtv=new Map(),resists=this.stateResistSet(),src=this.getTraits_overall_s(Game_BattlerBase.TRAIT_AUTOSTATE);
	src.forEach((v,k)=>!resists.has(k)&&rtv.set(k,v));
	return rtv;
};
$pppp$.statesExtra=function(){
	const rtv=[],src=this._statesExtra();
	src.forEach((v,k)=>rtv.push($dataStates[k]));
	return rtv;
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
		const sa=$dataStates[a] , sb=$dataStates[b];
		return sb.priority-sa.priority||sa.ord-sb.ord||a-b;
	},
	(sa,sb)=>{
		return sb.priority-sa.priority||sa.ord-sb.ord||sa.id-sb.id;
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
$pppp$.eraseBuff=function(paramId){
	this._buffs[paramId] = this._buffTurns[paramId] = 0;
	this.buffCnt();
	this._buffs.set.delete(paramId);
};
$pppp$.buffCnt=function(){
	// count effected buff/debuff
	let s=this._buffs.set;
	if(!s){
		s=this._buffs.set=new Set();
		for(let x=0,arr=this._buffs;x!==arr.length;++x) if(arr[x]) s.add(x);
	}
	return s.size;
};
$pppp$.increaseBuff=function(paramId){
	if(this.isMaxBuffAffected(paramId)) return;
	this.buffCnt();
	const s=this._buffs.set;
	if(++this._buffs[paramId]) s.add(paramId);
	else s.delete(paramId);
};
$pppp$.decreaseBuff = function(paramId) {
	if(this.isMaxDebuffAffected(paramId)) return;
	this.buffCnt();
	const s=this._buffs.set;
	if(--this._buffs[paramId]) s.add(paramId);
	else s.delete(paramId);
};
$pppp$.isBuffOrDebuffAffected=function(paramId){
	return !!this._buffs[paramId];
};
$pppp$.isBuffExpired=function(paramId){
	return !this._buffTurns[paramId];
};
$pppp$.updateBuffTurns=function(){
	this.buffCnt();
	this._buffs.set.forEach(v=>this._buffTurns[v]&&(--this._buffTurns[v]));
};
$pppp$.stateIcons=function(rtv){
	const icons=rtv||[] , arr=this.states_noSlice();
	for(let x=0;x!==arr.length;++x) if(arr[x].iconIndex>0) icons.push(arr[x].iconIndex);
	this._statesExtra().forEach((v,k)=>{
		if($dataStates[k].iconIndex>0) icons.push($dataStates[k].iconIndex);
	});
	return icons;
};
$pppp$.buffIconIndex=function(buffLv, parId){
	return buffLv?
		(buffLv>0?
			Game_BattlerBase.ICON_BUFF_START + ((buffLv>3)<<3) :
			Game_BattlerBase.ICON_DEBUFF_START + ((-buffLv<3)<<3)
		)+parId:
		0;
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
$pppp$._getTraitsEx_autoStates_getAvailables=function(curr){
	const rtv=[] , gbb=Game_BattlerBase ;
	const src=this.getTraits_overall_s(gbb.TRAIT_AUTOSTATE,undefined,true);
	if(src){
		const kv=[] , omit=this.traitsSet(gbb.TRAIT_STATE_RESIST,undefined,true) , omit2=new Set() ;
		src.forEach((v,k)=>{ if( v>0 && $dataStates[k] && (!omit||!omit.has(k)) ){
			kv.push(k); // no TRAIT_SKILL_ADD (cause errors when loading in 'Scene_Boot.prototype.arrangeData.note2traits_postProc')
			const r=$dataStates[k].tmapS.get(gbb.TRAIT_STATE_RESIST);
			if(r) r.forEach((v,k)=>omit2.add(k));
		} });
		kv.forEach(k=> !omit2.has(k) && rtv.push(k) );
	}
	return rtv;
};
$pppp$.getTraitsEx_autoStates_s=function f(code,id){
	const arr=this._getTraitsEx_autoStates_getAvailables();
	let rtv;
	if(id===undefined){ rtv=new Map(); for(let x=0,xs=arr.length;x!==xs;++x){
		const tmp=$dataStates[arr[x]].tmapS.get(code);
		if(tmp) rtv.byKey_sum(tmp,true);
	} }else{ rtv=0; for(let x=0,xs=arr.length;x!==xs;++x){
		const tmp=$dataStates[arr[x]].tmapS.get(code);
		if(tmp&&(tmp=tmp.get(id))) rtv+=tmp;
	} }
	return rtv;
};
$pppp$.getTraitsEx_autoStates_m=function f(code,id){
	const arr=this._getTraitsEx_autoStates_getAvailables();
	let rtv;
	if(id===undefined){ rtv=new Map(); for(let x=0,xs=arr.length;x!==xs;++x){
		const tmp=$dataStates[arr[x]].tmapP.get(code);
		if(tmp) rtv.byKey_mul(tmp,true);
	} }else{ rtv=1; for(let x=0,xs=arr.length;x!==xs;++x){
		const tmp=$dataStates[arr[x]].tmapP.get(code);
		if(tmp&&(tmp=tmp.get(id))!==undefined) rtv*=tmp;
	} }
	return rtv;
};
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
$d$=$pppp$._overall_s_updateCache=function f(code,noEx){
	if(!code) return; // lazy to do overall and code===0 update
	let rtv,tmp=this._overall_s_getCache();
	if(!tmp) $gameTemp.updateCache(this,f.key,tmp=new Map());
	tmp.mapd=$dataMap;
	{ const c2=noEx?-code:code;
	if(rtv=tmp.get(c2)) rtv.clear();
	else tmp.set(c2,rtv=new Map());
	}
	
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
	
	if(!noEx){
		// autoState
		tmp=this.getTraitsEx_autoStates_s(code);
		if(tmp) rtv.byKey_sum(tmp,true);
	}
	
	return rtv;
};
$d$.key=$tttt$;
$tttt$=undef;
$pppp$._getTraits_ex_s=function(code,id){
	let rtv=0,tmp;
	
	if(code!==Game_BattlerBase.TRAIT_AUTOSTATE){
		// autoState
		tmp=this.getTraitsEx_autoStates_s(code,id);
		if(tmp) rtv+=tmp;
	}
	
	return rtv;
};
$pppp$.getTraits_overall_s=function(code,id,noEx){
	if(id===undefined) return this._overall_s_getCache(noEx?-code:code)||this._overall_s_updateCache(code,noEx);
	let rtv=0;
	{
		let tmp;
		tmp=this.getTraits_native_s(code,id);
		if(tmp) rtv+=tmp;
		tmp=this.getTraits_states_s(code,id);
		if(tmp) rtv+=tmp;
		tmp=this.getTraits_equips_s(code,id);
		if(tmp) rtv+=tmp;
		tmp=this.getTraits_custom_s(code,id);
		if(tmp) rtv+=tmp;
		
		// environment
		tmp=$dataMap&&$dataMap.tmapS&&$dataMap.tmapS.get(code);
		if(tmp&&(tmp=tmp.get(id))) rtv+=tmp;
		
		// ex: post process
		if(!noEx){
			rtv+=this._getTraits_ex_s(code,id);
		}
		
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
$d$=$pppp$._overall_m_updateCache=function f(code,noEx){
	if(!code) return; // lazy to do overall and code===0 update
	let rtv,tmp=this._overall_m_getCache();
	if(!tmp) $gameTemp.updateCache(this,f.key,tmp=new Map());
	tmp.mapd=$dataMap;
	{ const c2=noEx?-code:code;
	if(rtv=tmp.get(c2)) rtv.clear();
	else tmp.set(c2,rtv=new Map());
	}
	
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
	
	if(!noEx){
		// autoState
		tmp=this.getTraitsEx_autoStates_m(code);
		if(tmp) rtv.byKey_mul(tmp,true);
	}
	
	return rtv;
};
$d$.key=$tttt$;
$tttt$=undef;
$pppp$._getTraits_ex_m=function(code,id){
	let rtv=1,tmp;
	
	// autoState
	if(code!==Game_BattlerBase.TRAIT_AUTOSTATE){
		tmp=this.getTraitsEx_autoStates_m(code,id);
		if(tmp!==undefined) rtv*=tmp;
	}
	
	return rtv;
};
$pppp$.getTraits_overall_m=function(code,id,noEx){
	if(id===undefined) return this._overall_m_getCache(noEx?-code:code)||this._overall_m_updateCache(code,noEx);
	let rtv=1;
	{
		let tmp;
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
		
		// ex: post process
		if(!noEx){
			rtv*=this._getTraits_ex_m(code,id);
		}
	}
	return rtv;
};
$pppp$.traitsPi=function(code, id){
	return id===undefined?1:this.getTraits_overall_m(code,id);
};
$pppp$.traitsSum=function(code, id){
	return id===undefined?0:this.getTraits_overall_s(code,id);
};
$pppp$.traitsSumAll=function(code,noEx){
	return this.getTraits_overall_s(code,undefined,noEx).v||0;
};
$pppp$.traitsSet=function(code,noEx){
	return this.getTraits_overall_s(code,undefined,noEx);
};
$pppp$.traitsMaxId=function(code,min){
	const t=this.getTraits_overall_s(code);
	let rtv=min||0;
	if(t) t.forEach((v,k)=>rtv<k&&(rtv=k));
	return rtv;
};
$pppp$.paramPlus2=function(paramId){
	return 0;
};
$d$=$pppp$.paramMin=function f(paramId){
	switch(paramId){
	case 0: return 1;
	case 1: return 0;
	}
	return f.tbl;
};
$d$.tbl=-99999999;
$pppp$.paramMax=function(paramId){
	return paramId>1?999999:99999999;
};
$t$=()=>"";
($d$=$pppp$.param=function f(paramId){
	// Window_EquipStatus.prototype.drawNewParam use '-', so String(s) are casted to Number
	return (f.tbl[paramId]||f.tbl._)(this,paramId);
}).tbl=[
	(s,i)=>{
		let value = s.paramBase(i) + s.paramPlus(i);
		if(i>1 && s.stp===0) value/=10;
		value += s.paramPlus2(i);
		value *= s.paramRate(i) * s.paramBuffRate(i);
		{ let tmp=s.paramMin(i);
		if(!(value>=tmp)) value=tmp;
		else{
			tmp=s.paramMax(i);
			if(value>tmp) value=tmp;
		} }
		return ~~(value+(value<0?-0.5:0.5));
	},0,0,0,0,0,0,0, // 7,
	(s,i)=>s.xparam(i-8).toFixed(2), 0, // 9,
	s=>s.mev.toFixed(2),
	(s,i)=>s.xparam(i-9).toFixed(2), 0, // 12,
	s=>s.partyAbility(Game_Party.ABILITY_MUST_ESCAPE),
	s=>s.isAlwaysSubstitute(),
	(s,i)=>s.sparam(i-15).toExponential(2), 0, // 16,
	(s,i)=>s.sparam(i-11).toExponential(2), 0, // 18,
	(s,i)=>s.sparam(i-17).toExponential(2), 0, // 20,
	s=>s.hpCostRate().toExponential(2),
	s=>s.mcr.toExponential(2),
	(s,i)=>s.xparam(i-16).toFixed(2), 0,0, // 25,
	//
	s=>s.attackTimesAdd(),
	s=>s.attackTimesMul().toFixed(3),
	(s,i)=>{
		const id=i-28;
		return (s.paramRate(id)*s.paramBuffRate(id)).toExponential(2);
	}, 0,0,0,0,0,0,0, // 35,
	s=>s.reflectPRate().toFixed(2),
	s=>s.reflectMRate().toFixed(2),
	s=>s.counterPRate().toFixed(2),
	s=>s.counterMRate().toFixed(2),
	$t$, // 40,
	s=>s.hitRecHpR().toFixed(2),
	s=>s.hitRecHpV(),
	s=>s.hitRecMpR().toFixed(2),
	s=>s.hitRecMpV(),
	s=>s.decreaseDamageP(),
	s=>s.decreaseDamageM(),
	s=>s.MPSubstituteRate().toFixed(3),
	$t$, // 48,
	s=>s.TPRegenAtBattleEnd(),
	s=>s.tcr.toExponential(2),
	s=>s.regenHpV(),
	s=>s.regenMpV(),
	s=>s.regenTpV(),
	$t$, // 54,
];
for(let x=0,arr=$d$.tbl,last=$t$;x!==arr.length;++x) if(arr[x]) last=arr[x]; else arr[x]=last;
$t$=undef;
$d$.tbl[-1]=s=>s.makeActionTimes();
$d$.tbl[-2]=s=>s.sparam(9).toExponential(2);
$d$.tbl._=()=>0;
$pppp$.setHp=function(hp){
	if(this._hp === hp) return;
	this._hp = hp;
	this.refresh(true,1);
};
$pppp$.setMp=function(mp){
	if(this._mp === mp) return;
	this._mp = mp;
	this.refresh(true,2);
};
$pppp$.setTp=function(tp){
	if(this._tp === tp) return;
	this._tp = tp;
	this.refresh(true,3);
};
$pppp$.setStp=function(val){
	if(this._stp===val) return;
	this._stp=val;
	this.refresh(true,4);
};
$pppp$.maxStp=()=>1000;
$pppp$.refresh_hp=function(){
	if(!(this._hp>=0)) this._hp=0;
	else{
		const tmp=this.mhp;
		if(this._hp>tmp) this._hp=tmp;
	}
};
$pppp$.refresh_mp=function(){
	if(!(this._mp>=0)) this._mp=0;
	else{
		const tmp=this.mmp;
		if(this._mp>tmp) this._mp=tmp;
	}
};
$pppp$.refresh_tp=function(){
	if(!(this._tp>=0)) this._tp=0;
	else{
		const tmp=this.maxTp();
		if(this._tp>tmp) this._tp=tmp;
	}
};
$pppp$.refresh_stp=function(){
	if(this._stp!==undefined){
		if(!(this._stp>=0)) this._stp=0;
		else{
			const tmp=this.maxStp();
			if(this._stp>tmp) this._stp=tmp;
		}
	}
};
($d$=$pppp$.refresh=function f(_,only){
	const func=f.tbl[only];
	if(func) return func.call(this);
	
	this.stateResistSet().forEach(f.forEach, this);
	
	this.refresh_hp();
	this.refresh_mp();
	this.refresh_tp();
	this.refresh_stp();
}).tbl=[
	undefined,
	function(){ return this.refresh_hp (); },
	function(){ return this.refresh_mp (); },
	function(){ return this.refresh_tp (); },
	function(){ return this.refresh_stp(); },
];
$d$.tbl[undefined]=$d$.tbl[null]=$d$.tbl[false]=undefined;
$d$.forEach=function(_,stateId){
	this.eraseState(stateId);
};
$pppp$.recoverAll=function f(ignoreBuff){
	if(this.noRecoverAll()) return;
	this.clearStates(ignoreBuff);
	this._hp = this.mhp;
	this._mp = this.mmp;
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
	return ~~((~~( (skill.hpCostMR&&skill.hpCostMR*this.mhp) + this.hp*skill.hpCostCR + skill.hpCost + 0.5 ))*this.hcr);
};
$pppp$.skillMpCost=function(skill){
	return ~~((~~( (skill.mpCostMR&&skill.mpCostMR*this.mmp) + this.mp*skill.mpCostCR + skill.mpCost + 0.5 ))*this.mcr);
};
$pppp$.skillTpCost=function(skill){
	return ~~((~~( (skill.tpCostMR&&skill.tpCostMR*this.mtp) + this.tp*skill.tpCostCR + skill.tpCost + 0.5 )) );
};
$pppp$.canPaySkillCost=function(skill){
	const hpCost=skill.hpCostMin<=0?this.skillHpCost(skill):0;
	return  (this._tp >= skill.tpCostMin || this._tp >= this.skillTpCost(skill)) && 
		(this._mp >= skill.mpCostMin || this._mp >= this.skillMpCost(skill)) && 
		(hpCost<=0 || this._hp > skill.hpCostMin || this._hp > hpCost)
	;
};
($pppp$.paySkillCost=function f(skill){
	const payhp=this.skillHpCost(skill);
	const paymp=this.skillMpCost(skill);
	const paytp=this.skillTpCost(skill);
	$gameTemp.updateCache(this,f.key,{
		hp:this._hp<payhp?this._hp:payhp,
		mp:this._mp<paymp?this._mp:paymp,
		tp:this._tp<paytp?this._tp:paytp,
	});
	this._hp -= payhp;
	this._mp -= paymp;
	this._tp -= paytp;
}).key=$tttt$=Game_BattlerBase.CACHEKEY_LASTPAY;
($d$=$pppp$.lastPay=function f(){
	return $gameTemp.getCache(this,f.key)||f.tbl;
}).key=$tttt$;
$tttt$=undef;
$d$.tbl={};
$pppp$.isOccasionOk=function(item){
	return item.occasion === 0 || (!$gameParty.inBattle())+1 === item.occasion;
};
$pppp$.meetNeedStates=function(dataobj){
	const tbl=dataobj.needStates;
	if(!tbl) return true;
	for(let x=0;x!==tbl.length;++x){
		let rtv=1;
		for(let arr=tbl[x],z=0;z!==arr.length;++z){
			const affected=this.isStateAffected(arr[z]<0?-arr[z]:arr[z]);
			if(arr[z]<0?affected:!affected){
				rtv=0; break;
			}
		}
		if(rtv){
			// move it fronter
			if(x){
				const d=x===1?1:~~(Math.random()*2);
				const tmp=tbl[x-d]; tbl[x-d]=tbl[x]; tbl[x]=tmp;
			}
			return true;
		}
	}
	return false;
};
$pppp$.canUse=function(dataItem){
	const meta=dataItem && dataItem.meta; if(!meta) return false;
	{ const cond=dataItem.cond||(dataItem.cond=(meta.cond=meta.cond)&&objs._getObj(none,meta.cond));
	if(cond && !cond(this)) return false;
	}
	// when use an item via press 'ok' without release, 'meta' has chance to become 'undefined'
	if(SceneManager._scene.constructor===Scene_Item && meta && (meta.code||meta.func) && $gameParty.hasItem(dataItem)) return true;
	let rtv=false;
	switch(dataItem.itemType){
	default: break;
	case 's':
		rtv=this.meetsSkillConditions(dataItem);
	break;
	case 'i':
		rtv=this.meetsItemConditions(dataItem);
	break;
	}
	if(rtv) rtv=this.meetNeedStates(dataItem);
	return rtv;
};
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
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this._animations=new Queue();
}).ori=$r$;
$k$='initMembers';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){ // 'initMembers' then 'Sprite.setBattler(this)'
	f.ori.call(this);
	this._actions=new Queue(2);
	this._weapon2ImageId = 0;
}).ori=$r$;
$pppp$.refresh=function(_,only){
	Game_BattlerBase.prototype.refresh.call(this,0,only); // ensure hp non-neg.
	if(this.hp === 0) this.addState(this.deathStateId());
	else this.removeState(this.deathStateId());
};
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
	const q=this.reserveActResQ();
	let rtv;
	if(q){ q.push(rtv=actResRef.copy()); }
	return rtv;
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
$k$='isStateAddable';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(stateId){
	{
		const dataItem=$dataStates[stateId];
		const meta=dataItem && dataItem.meta; if(!meta) return false;
		//if(dataItem._base && this.isStateResist(dataItem._base)) return false; // in 'isStateResist'
		const cond=dataItem.cond||(dataItem.cond=(meta.cond=meta.cond)&&objs._getObj.call(none,meta.cond));
		if(cond && !cond(this)) return false;
	}
	return f.ori.call(this,stateId);
}).ori=$r$;
$d$=$pppp$.removeStatesAuto=function f(timing){
	f.tbl[0].length=0; f.tbl._=this; f.tbl.t=timing;
	this._states.forEach(f.tbl[1],f.tbl);
	f.tbl[0].forEach(f.tbl[2],f.tbl);
};
$d$.tbl=[
	[], // tmp
	function(stateId){
		const state=$dataStates[stateId];
		if(this._.isStateExpired(stateId) && state.autoRemovalTiming === this.t){
			this[0].push(stateId);
		}
	},
	function(stateId){ this._.removeState(stateId); },
];
$pppp$.removeAllBuffs=function(){
	this.buffCnt();
	this._buffs.set.forEach( paramId => this._buffs[paramId] = this._buffTurns[paramId] = 0 );
	this._buffs.set.clear();
};
$pppp$.removeBuffsAuto=function(){
	const tmp=[];
	this.buffCnt();
	this._buffs.set.forEach( v => this.isBuffExpired(v) && tmp.push(v) );
	for(let i=tmp.length;i--;) this.removeBuff(i);
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
$pppp$.makeActionTimes=function(){ // change logic: rnd each -> rnd remainder(<1)
	const rtv=this.traitsSum(Game_BattlerBase.TRAIT_ACTION_PLUS,0)||0; // id應該是0啦。原本的code用actionPlusSet每個算機率決定是否+1，未指定id
	//return (Math.random()<(rtv-~~rtv))+rtv+1;
	return rtv+1;
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
($pppp$[$k$]=function f(skillId, targetIndex){
	f.ori.call(this,skillId, targetIndex);
	if(BattleManager._isGuardWaiting && skillId===this.guardSkillId()){
		const n=BattleManager._isGuardWaiting.get(this)|0;
		BattleManager._isGuardWaiting.set(this,n+1);
	}
	
	if(BattleManager._isChanting && this._actions.back.isMagicSkill()){
		const n=BattleManager._isChanting.get(this)|0;
		BattleManager._isChanting.set(this,n+1);
	}
}).ori=$r$;
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
$pppp$.friendsUnit=none;
$pppp$.opponentsUnit=none;
$pppp$.regenerateHp=function() {
	const value = Math.max(this.regenHpV()+~~(this.mhp * this.hrg),-this.maxSlipDamage()) - this.stateDmgValHp();
	if(value) this.gainHp(value);
};
$pppp$.regenerateMp=function(){
    const value=this.regenMpV()+~~(this.mmp * this.mrg) - this.stateDmgValMp();
    if(value) this.gainMp(value);
};
$pppp$.regenerateTp=function(){
	this.gainSilentTp(this.regenTpV()+~~(this.mtp * this.trg) - this.stateDmgValTp() );
};
$pppp$.registChase=function(){
	BattleManager.updateChase(this);
};
$pppp$.onBattleStart=function(){
	this.setActionState('undecided');
	this.clearMotion();
	this.registChase();
};
$pppp$.onTurnEnd=function f(){
	this.noRefresh=true;
	
	//f.ori.call(this);
	this.clearResult();
	this.regenerateAll();
	if(!BattleManager.isForcedTurn()){
		this.updateStateTurns();
		this.updateBuffTurns();
		this.removeStatesAuto(2);
		this.removeBuffsAuto();
	}
	
	this.noRefresh=0;
	if(this._needRefresh){
		delete this._needRefresh;
		this.refresh(true);
	}
};
$pppp$.clearChase=function(){
	const M=BattleManager._chases;
	if(M) M.forEach(s=>s.delete(this));
};
$k$='onBattleEnd';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	let v=this.TPRegenAtBattleEnd();
	if(v) v*=this.tcr;
	this.gainSilentTp(~~v);
	this.clearChase();
}).ori=$r$;
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
$pppp$=$aaaa$=undef; // END Game_Battler

// - chrB
$aaaa$=Game_CharacterBase;
$pppp$=$aaaa$.prototype;
Object.defineProperties($pppp$,{
	// default
	_blendMode:{ get:function(){ return this._bm; },set:function(rhs){
		return this._bm=rhs;
	},configurable:false},
	_isObjectCharacter:{ get:function(){ return this._objChr; },set:function(rhs){
		return this._objChr=rhs?6:0;
	},configurable:false},
	_jumpPeak:{ get:function(){ return this._jp; },set:function(rhs){
		this._jp=rhs;
		this._jp2=rhs*rhs;
		return rhs;
	},configurable:false},
	_transparent:{ get:function(){ return this._trpt; },set:function(rhs){
		return this._trpt=rhs;
	},configurable:false},
	// ext
	_jumpPeak2:{ get:function(){ return this._jp2; },set:function(rhs){
		return this._jp2=rhs;
	},configurable:false},
});
$pppp$._deleteOldDataMemberByTbl=function(tbl){
	const tmp=[];
	for(let x=0;x!==tbl.length;++x){
		if(this[tbl[x][1]]===undefined){
			const k=tbl[x][0],t=this[k];
			delete this[k];
			tmp.push(x,t);
		}
	}
	for(let x=0;x!==tmp.length;x+=2) this[tbl[tmp[x]][0]]=tmp[x|1];
};
$d$=$pppp$._deleteOldDataMember=function f(){
	this._deleteOldDataMemberByTbl(f.tbl);
};
$d$.tbl=[
	['_blendMode','_bm'],
	['_isObjectCharacter','_objChr'],
	['_jumpPeak','_jp'],
];
$pppp$.shiftY=function(){
	return 6^this.isObjectCharacter();
};
$r$=$pppp$.jump;
($pppp$.jump=function f(dx,dy){
	f.ori.call(this,dx,dy);
	this._jumpPeak2=this._jumpPeak*this._jumpPeak;
}).ori=$r$;
$pppp$.jumpHeight=function(){
	const d=this._jumpCount - this._jumpPeak;
	return (this._jumpPeak2 - d*d)/2.0;
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
$pppp$.updatePattern=function(){
	if(!this.hasStepAnime() && this._stopCount > 0) this.resetPattern();
	else{
		++this._pattern;
		this._pattern&=3;
	}
};
$pppp$.maxPattern=()=>4;
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
($pppp$[$k$]=function f(dh,dv){
	f.ori.call(this,dh,dv);
	if(this.isMovementSucceeded()) this.moveSpeedBuff_ctr();
}).ori=$r$;
$k$='moveStraight';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(dir){
	f.ori.call(this,dir);
	if(this.isMovementSucceeded()) this.moveSpeedBuff_ctr();
}).ori=$r$;
($pppp$.d8to4=function f(d){ return f.tbl[d]|0; }).tbl=[0x00,0x24,0x20,0x26,0x04,0x00,0x06,0x84,0x80,0x86]; /* Y(8,2),X(4,6) numpad */
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
($pppp$.jump=function f(dx,dy){
	return f.ori.call(this,dx|0,dy|0);
}).ori=$r$;
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
($pppp$[$k$]=function f(id){
	if(!this._erased) f.ori.call(this,_global_conf.noAnimation?0:id);
	return this;
}).ori=$r$;
$pppp$=$aaaa$=undef;

// - chr
$aaaa$=Game_Character;
$pppp$=$aaaa$.prototype;
$aaaa$.currMaxEnum=45;
$aaaa$.addEnum=objs._addEnum; // moveroute
// - chr: getData
($d$=$pppp$.getData=function f(){
	return f.obj;
}).obj={};
Object.defineProperty($d$.obj,'meta',{get:none,set:none,configurable:false});
$pppp$.getActor=none;
$k$='initialize';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this._viewRadius1=0;
	this._viewRadius2=0;
	this._tmp=[];
}).ori=$r$;
($pppp$._deleteOldDataMember=function f(){
	Game_CharacterBase.prototype._deleteOldDataMember.call(this);
	this._deleteOldDataMemberByTbl(f.tbl);
}).tbl=[
	['_characterIndex','_chrIdx'],
	['_characterName','_chrName'],
	['_direction','_dir'],
	['_directionFix','_dirfx'],
	['_moveFrequency','_mvfreq'],
	['_moveRoute','_mvr'],
	['_moveRouteForcing','_mvrf'],
	['_moveRouteIndex','_mvridx'],
	['_moveSpeed','_mvsp'],
	['_originalMoveRoute','_omvr'],
	['_originalMoveRouteIndex','_omvridx'],
	['_stepAnime','_sa'],
	['_tileId','_tid'],
	['_walkAnime','_wa'],
	['_waitCount','_wc'],
];
Object.defineProperties($pppp$,{
	// simply shorten
	_moveFrequency:{ get:function(){ return this._mvfreq; },set:function(rhs){
		return this._mvfreq=rhs;
	},configurable:false},
	_moveSpeed:{ get:function(){ return this._mvsp; },set:function(rhs){
		return this._mvsp=rhs;
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
	_stepAnime:{ get:function(){ return this._sa; },set:function(rhs){
		return this._sa=rhs&&1||0;
	},configurable:false},
	_waitCount:{ get:function(){ return this._wc; },set:function(rhs){
		return this._wc=rhs;
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
	_viewRadius1:{ get:function(){return this._vr1;},set:function(rhs){
		return  this._vr1=rhs|0;
	},configurable:false},
	_viewRadius2:{ get:function(){return this._vr2;},set:function(rhs){
		return  this._vr2=rhs|0;
	},configurable:false},
});
$t$=($pppp$._getColorEdt=function f(){
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
}).toJson=x=>x&&JSON.stringify(x)||undefined;
($pppp$._getGrayEdt=function(){
	let rtv;
	{
		const meta=this.getData().meta;
		if(meta.grayscales){
			if(!meta.grayscales_lazyTbl) meta.grayscales_lazyTbl=JSON.parse(meta.grayscales).map(f.toJson);
			rtv=meta.grayscales_lazyTbl[this._pageIndex];
		}else rtv=meta.grayscale;
	}
	if(!rtv) rtv=this._grayscale;
	return rtv;
}).toJson=$t$;
($pppp$._getScaleEdt=function f(){
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
}).toJson=$t$;
$t$=undef;
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
($pppp$.frontPos=function f(){
	let delta=f.tbl[(this._direction>>1)];
	return {x:this._x+delta.x,y:this._y+delta.y};
}).tbl=[ {x:0,y:0},
	/*
		2,+y
	4,-x		6,+x
		8,-y
	*/
		{x:0,y:1},
	{x:-1,y:0},	{x:1,y:0},
		{x:0,y:-1},
];
Object.defineProperties($pppp$, {
	frontx: { get: function() { return this.frontPos().x; }, configurable: false },
	fronty: { get: function() { return this.frontPos().y; }, configurable: false },
	_dummy:{get:function(){return'';},configurable:false}
});
$pppp$.isInLoc=function(xL,yL,xH,yH){
	// L,H included
	return xL<=this.x&&this.x<=xH&&yL<=this.y&&this.y<=yH;
};
// movecmd
($d$=$pppp$.processMoveCommand=function f(command){
	//debug.log('Game_Character.prototype.processMoveCommand');
	let foo=f.tbl[command.code];
	return foo&&foo.call(this,command.parameters);
}).tbl=[];
{ $d$.tbl.length=46; const gc=$aaaa$;
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
($d$=$pppp$.playSheet=function f(arr){
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
}).EMPTY={code:0};
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
($d$=$pppp$.moveToChrs_bfs=function f(chrs,fullSearch,mvRndIfNotFound){
	let dir=this.findDirTo(chrs.map(f.map),undefined,{fullSearch:fullSearch});
	if(dir) this.moveDiagonally_d8(dir);
	else if(chrs.length){
		if(mvRndIfNotFound) this.moveRandom();
		else this.moveToChr(chrs[~~(Math.random()*chrs.length)]);
	}
}).map=chr=>[chr.x,chr.y];
if(0)$d$.map=chrs=>{
	let rtv=[];
	for(let x=0;x!==chrs.length;++x){
		let chr=chrs[x];
		if(chr.x>=0&&chr.y>=0) rtv.push([chr.x,chr.y]);
	}
	return rtv;
};
($pppp$.moveAwayChr_bfs=function f(chr,fullSearch,stop){
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
	else if(chr&&!stop) this.moveAwayFromCharacter(chr);
}).map=$pppp$.moveToChrs_bfs.map;
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
($pppp$.findDirTo=function f(goals,disables,kargs){
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
	
}).forEach=function f(v,k,m){ let a=f.c[v[2]]; v.pop(); if(a) a.push(v); };
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
($pppp$[$k$]=function f(goalx,goaly){
	//debug.log('Game_Character.prototype.findDirectionTo');
	//a; // debug - cracking
		// when called by $gamePlayer
			// Game_Player.prototype.update
				// Game_Player.prototype.moveByInput
	return this.findDirTo([[goalx,goaly]]);
}).ori=$r$;
//$k$='isCollidedWithCharacters';
//$r$=$pppp$[$k$];
//$d$=$pppp$[$k$]=function(){ // overwrite
//}; $d$.ori=$r$;
$pppp$.mvRefChr=function(chr){ this._x=chr._x; this._y=chr._y; };
$pppp$.mvRefChrR=function(chr){
	this.mvRefChr(chr);
	this._realX=chr._realX;
	this._realY=chr._realY;
};
$pppp$.mvAbs=function(x,y){ this._x=x; this._y=y; };
$pppp$.mvDiff=function(dx,dy){ this._x+=dx; this._y+=dy; };
$pppp$.moveRandom = function() {
	const d=((Math.random()*4)<<1)+2;
	if(this.canPass(this.x,this.y,d)) this.moveStraight(d);
};
$pppp$.setRndWait=function(n,b){
	this._waitCount=~~(~~(Math.random()*n)+b);
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
($pppp$.clear=function f(){
	f.ori.call(this);
	this._txt2=[];
	this._evtName=undef;
	this._nameField=undef;
	this._lastMsgType=undef;
	this._lastFinish=undef;
	this._lastGain=undef;
	this._fadeEffect=undef;
}).ori=$r$;
$pppp$.setFaceImage = function(faceName, faceIndex, faceColor) {
	this._faceName = faceName;
	this._faceIndex = faceIndex;
};
$r$=$pppp$.isBusy;
($pppp$.isBusy=function f(){
	return this._windowCnt||f.ori.call(this);
}).ori=$r$;
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
($pppp$.addGameoverMsg=(txt,kargs)=>{
	if(!$dataMap.gameoverMsgs) $dataMap.gameoverMsgs=[];
	kargs=kargs||{};
	if(!kargs.align) kargs.align='center';
	$dataMap.gameoverMsgs.push([txt,kargs]);
}).clear=()=>{if(!$dataMap.gameoverMsgs) $dataMap.gameoverMsgs=[];$dataMap.gameoverMsgs.length=0;};
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
($pppp$.getData=function f(){
	const actor=$gameParty.allMembers()[0];
	return actor?actor.getData():f.ori.call(this);
}).ori=$r$;
$pppp$.getActor=function(){
	return $gameParty.allMembers()[0];
};
($pppp$._deleteOldDataMember=function f(){
	Game_Character.prototype._deleteOldDataMember.call(this);
	this._deleteOldDataMemberByTbl(f.tbl);
}).tbl=[
	['_blendMode','_bm'],
	['_directionFix','_dirfx'],
	['_moveSpeed','_mvsp'],
	['_opacity','_opct'],
	['_stepAnime','_sa'],
	['_transparent','_trpt'],
	['_walkAnime','_wa'],
];
{ const dirs=[[0,1],[-1,0],[1,0],[0,-1]];
Object.defineProperties($pppp$,{
	dirs:{
		get: function(){ return dirs; },
	},
});
}
Object.defineProperties($pppp$, {
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
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this.maxSavefiles=DataManager.maxSavefiles();
	this._rndid=Date.now()+''+Math.random();
	if(this.canDiag===undefined) this.canDiag=true;
	this._viewRadius1=Game_Map.e<<1;
	this._viewRadius2=Game_Map.e*3;
	this.viewRadius=this._viewRadius2;
}).ori=$r$;
$k$='isTransparent';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	return f.ori.call(this) || $dataMap && $dataMap.meta.hidePlayer;
}).ori=$r$;
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
($pppp$.moveByInput=function f(){
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
}).tbl=[0];
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
	const sc=SceneManager._scene;
	if(sc.constructor===Scene_Map){
		if(Graphics.isWebGL()){
			let sx=$gameMap._displayX_tw/$gameMap.tileWidth(),sy=$gameMap._displayY_th/$gameMap.tileHeight();
			//sc._spriteset._tilemap._paintAllTiles(sx^0,sy^0); // drawing flow: addRect , sent vertices to webgl => remove rect or totally re-draw
			sc._spriteset._tilemap._needsRepaint=true;
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
($pppp$[$k$]=function f(viaJump=_global_conf["isGatherFollowersViaJump"]){
	return viaJump?this.jump():f.ori.call(this);
}).ori=$r$;
$k$='areFollowersGathering';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	return this.isJumping()||f.ori.call(this);
}).ori=$r$;
$k$='areFollowersGathered';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	return !this.isJumping()&&f.ori.call(this);
}).ori=$r$;
$k$='startMapEvent';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(x,y,trigger,normal){
	//debug.keydown('Game_Player.prototype.startMapEvent');
	// triggered when: move, pressOk @ Scene_Map
	return f.ori.call(this,x,y,trigger,normal);
}).ori=$r$;
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
($pppp$.updateNonmoving=function f(wasMoving) {
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
}).tbl=[1,2];
$k$='triggerAction';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	//debug.log('Game_Player.prototype.triggerAction'); // this is polling
	let rtv=$gameTemp._pl_customEvtStrt=false;
	// customEvtStrt
	// - do not use repeated: counts only last key
	if( !rtv && Input.isPressed('control') && Input.isPressed('ok') ) rtv=this.customEvtStrt(none);
	rtv=rtv||f.ori.call(this);
	$dataMap.lastPlayerDir=this._direction;
	$dataMap.triggerHere0touch=false;
	return rtv;
}).ori=$r$;
$k$='checkEventTriggerHere';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(triggers){ // discard so-long-call and '$gameMap._interpreter.isRunning()' check
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
}).ori=$r$;
$k$='checkEventTriggerThere';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	debug.log('Game_Player.prototype.checkEventTriggerThere');
	debug.log($gamePlayer.x,$gamePlayer.y);
	debug.log(arguments[0]);
	// triggered when: {press 'ok'} or {click on tile and chr move near it}
	//   triggered before step on the location when using click
	//if(this.customEvtStrt(none)) return;
	if($dataMap.lastPlayerDir===this._direction) f.ori.call(this,arguments[0]);
}).ori=$r$;
//$pppp$.checkEventTriggerThere=$r$; // currently no needed
$k$='reserveTransfer';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
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
	
}).ori=$r$;
($pppp$.adjDecRate=function f(what,rate,useMax){
	// what: HP,MP,TP
	const act=f.tbl[what]||"";
	if(act==="") return;
	if(useMax) what='m'+what;
	for(let x=0,arr=$gameParty.allMembers();x!==arr.length;++x){
		let actor=arr[x];
		let v=actor[what]*rate,vi=~~v;
		actor[act](-vi-(v!==vi));
	}
	
}).tbl={
	hp: "gainHp",
	mp: "gainMp",
	tp: "gainTp",
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
Object.defineProperties($pppp$, {
	_actors:{ get: function(){
			debug.warn("get actors");
			return this._acs;
		}, set: function(rhs){
			debug.warn("set actors");
			let tmp=$gameTemp; // for fast change data structure
			tmp._pt_battleMembers=tmp._pt_allMembers=false;
			this._acs=rhs;
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
($pppp$[$k$]=function f(){
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
}).ori=$r$;
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
	if($gameActors._data.length===0) return []; // due to '$gameActors.actor' will create new if not exist, cache will be invalid
	const tmp=$gameTemp;
	if(tmp._pt_allMembers) return tmp._pt_allMembers;
	tmp._pt_allMembers_idSet=new Set(this._acs);
	return tmp._pt_allMembers=this._acs.map(f.toDataActor);
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
$pppp$.addNew=function(addedActor){
	let tmp=$gameTemp,id=addedActor._actorId;
	this._acs.push(id);
	if(tmp._pt_battleMembers.length<this.maxBattleMembers()){
		tmp._pt_battleMembers_actor2idx.set(addedActor,tmp._pt_battleMembers.length);
		tmp._pt_battleMembers.push(addedActor);
		if(SceneManager.isBattle()) BattleManager.updateChase(addedActor);
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
		const sc=SceneManager._scene;
		const sps=sc&&sc._spriteset;
		if(sps && sc.constructor===Scene_Battle){
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
$pppp$.addActors=function(actorId,count){
	if(count>0) while(count--) this.addActor(actorId,true);
};
$pppp$.addActor=function(actorId,bool_genNewIfRepeated) { // neednotice
	//debug.log('Game_Party.prototype.addActor');
	let tmp=$gameTemp,addedActor;
	if(tmp._pt_allMembers_idSet.has(actorId)){
		if(bool_genNewIfRepeated) addedActor=$gameActors.genClone(actorId);
		else return;
	}else addedActor=$gameActors.actor(actorId);
	if(!addedActor) return; // repeated maxout or not found
	return this.addNew(addedActor);
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
			const sp=arr[x]._tmp._sprite;
			if(sp && sp.parent) sp.updateBitmap_forced();
		} }
		
		idx=tmp._pt_battleMembers_actor2idx?tmp._pt_battleMembers_actor2idx.get(obj):tmp._pt_battleMembers.indexOf(obj);
		if(idx>=0){
			if(SceneManager.isBattle()) BattleManager.updateChase(obj,true);
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
				if(sp && sp.parent) sp.remove();
			}
			flrs.popFollower();
		}
		
		$gamePlayer.refresh();
		if(idx===0) $gamePlayer.imgModded=true;
		if(idx>=0) for(let x=idx;x<last;++x) flrs._data[x].imgModded=true;
		$gameMap.requestRefresh();
	}
};
$pppp$.remove=function(actor,_searchFrom){
	return this.removeActor(actor&&actor._actorId,_searchFrom);
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
($d$=$pppp$.unionCnt=function f(o){
	const u=f.key;
	if(o.meta && Object.hasOwnProperty.call(o.meta,u)){
		if(!Object.hasOwnProperty.call(o,u)) o[u]=JSON.parse(o.meta[u]);
		if(!f.tbl) f.tbl={
			a: $dataArmors,
			i: $dataItems,
			w: $dataWeapons,
		};
		let cnt=0;
		for(let x=0,arr=o[u],c;x!==arr.length;++x){
			c=f.tbl[arr[x][0]];
			if(c) cnt+=this.numItems(c[arr[x][1]]);
		}
		return cnt;
	}else return this.numItems(o);
}).tbl=undefined;
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
($pppp$.items=function f(){
	let rtv;
	if( !(rtv=$gameTemp.getCache(this,f.key)) ){
		rtv=[];
		this._tbl_i().forEach((v,k)=>$dataItems[k]&&rtv.push($dataItems[k]));
		$gameTemp.updateCache(this,f.key,rtv);
	}
	return rtv.sort(DataManager.sortCmp);
}).key='item';
($pppp$.weapons=function f(includeEquip){
	let rtv;
	if( !(rtv=$gameTemp.getCache(this,f.key)) ){
		rtv=[];
		this._tbl_w().forEach((v,k)=>$dataWeapons[k]&&rtv.push($dataWeapons[k]));
		$gameTemp.updateCache(this,f.key,rtv);
	}
	if(includeEquip) rtv=Array.fastConcat(this.members().map(x=>x.weapons()).flat(),rtv);
	return rtv.sort(DataManager.sortCmp);
}).key='weapon';
($pppp$.armors=function f(includeEquip){
	let rtv;
	if( !(rtv=$gameTemp.getCache(this,f.key)) ){
		rtv=[];
		this._tbl_a().forEach((v,k)=>$dataArmors[k]&&rtv.push($dataArmors[k]));
		$gameTemp.updateCache(this,f.key,rtv);
	}
	if(includeEquip) rtv=Array.fastConcat(this.members().map(x=>x.armors()).flat(),rtv);
	return rtv.sort(DataManager.sortCmp);
}).key='armor';
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
($pppp$.changeMap=function f(type,data,mapid,noupdate){
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
}).forEach=v=>DataManager.resetData3d(v);
$pppp$.saveDynamicEvents=function(fromTransfer){
	const evts=$gameMap._events , mc=this.mapChanges[$gameMap._mapId]; // should be inited to {} when map loaded if it is undef
	mc.templateStrts=$gameMap._templateStrts;
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
			if(ss) delete ss[evtid];
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
($pppp$[$k$]=function f(item,forced){
	debug.log('Game_Party.prototype.consumeItem');
	$gameTemp.gainMsgConfigs_push();
	$gameTemp.gainMsgConfigs_mute();
	$gameTemp.____byConsume=true;
	if(item && forced){
		if(DataManager.isItem(item)) this.loseItem(item, 1);
	}else if(DataManager.isItem(item) && item.consumable) this.loseItem(item, 1);
	$gameTemp.____byConsume=false;
	$gameTemp.gainMsgConfigs_pop();
}).ori=$r$;
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
	let txt=head;
	{
		let omit=0,printed=item.name[0]==='\\';
		if(printed){ omit=2; switch(item.name[1]){
		case 'E':{
			txt+=item.name.slice(omit);
		}break;
		default: omit=1;
		case '-':
			printed=false;
		break;
		} }
		if(!printed) txt+=(omit?item.name.slice(omit):item.name).replace(/\\/g,"\\\\");
	}
	txt+="\\RGB["+color.default+"] * ";
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
($pppp$.getData=function f(){
	const actor=this.actor();
	return actor?actor.getData():f.ori.call(this);
}).ori=$r$;
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
($pppp$[$k$]=function f(idx){
	f.ori.call(this,idx);
	//if(!this._tmp) this._tmp=[]; // Game_Character
	// special settings:
	//this.resetWalkAni();
	//this.updateAppearance(); // done @setFollowers
	this._dir2=0; // propergate dir when dirfx
}).ori=$r$;
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
($pppp$.locate=function f(x,y){
	f.ori.call(this,x,y);
	if(this._tmp&&this._tmp._followers&&!$gamePlayer._newMapId) this._tmp._followers.updateTbl(this);
	return this;
}).ori=$r$;
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
Object.defineProperties($pppp$,{
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
$pppp$._value=function(m,e,k){
	const rtv=this._data[m];
	return !!(rtv&&rtv[e]&&rtv[e][k]);
};
$pppp$.value=function(k){
	return this._value.apply(this,k);
};
$pppp$.setValue_=function(t,eid,key,v,m){
	let u=t[eid]; if(!u) u=t[eid]={};
	if(v){
		u[key] = true;
		//$gameTemp._ssSets[m].set(k.join()); // 改天
	}else{
		delete u[key];
		//$gameTemp._ssSets[m].delete(k.join()); // 改天
	}
	const evt=$gameMap._events[eid];
	if(this._data[$gameMap._mapId]===t){ // the switch is @ current map
		if(evt&&evt._sameStatEvts){ for(let x=0,arr=evt._sameStatEvts;x!==arr.length;++x){ // let evtid=arr[x];
			this.setValue_(t,arr[x],key,v,$gameMap._mapId);
		} }
	}
	if(evt&&!evt.noUpdate) return this.onChange();
};
$pppp$._setValue=function(m,e,k,v){
	let t=this._data[m]; if(!t) t=this._data[m]={};
	return this.setValue_(t,e,k,v,m);
};
$pppp$._setValue_del=function(m,e,k){
	this._setValue(m,e,k,false);
};
$pppp$._setValue_set=function(m,e,k){
	this._setValue(m,e,k,true);
};
$pppp$.setValue=function(k,v){
	if(v) this._setValue_set.apply(this,k);
	else this._setValue_del.apply(this,k);
};
$pppp$.clear = function(mapid) {
	if(mapid>0) this._data[n]={};
	else this._data = [];
};
$pppp$.moveTo=function(mapTo,evtIdTo,evtIdFrom,mapFrom){
	if(evtIdTo===evtIdFrom) return;
	if(mapFrom===undefined) mapFrom=mapTo;
	// evtid can be a string
	if(!this._data[mapFrom]) this._data[mapFrom]={};
	const src=this._data[mapFrom][evtIdFrom];
	delete this._data[mapFrom][evtIdFrom];
	if(!this._data[mapTo]) this._data[mapTo]={};
	this._data[mapTo][evtIdTo]=src;
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
Object.defineProperties($pppp$,{
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
($pppp$[$k$]=function f(mapId,evtId){
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
	
	const rtv=f.ori.apply(this,arguments);
	
	const evtd=this.event();
	const meta=evtd.meta;
	
	// self switches
	//this._switches={}; // need to be saved after leaving a map so don't use this way
	
	// display
	this._skipRender=meta.skipRender;
	this._color=undefined;
	this._grayscale=undefined;
	this._scale=undefined;
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
	this._lightG=0;
	if(meta.lightG){
		const l=Number(meta.lightG);
		if(0<l) this._lightG=l*Game_Map.e; // no gradient if no lightG
	}
	this._light=0;
	if(meta.light){
		const l=Number(meta.light);
		if(0<l) this._light=l*Game_Map.e;
	}
	this._opacity=255;
	if(meta.opacity){
		let tmp=Number(meta.opacity);
		if(tmp>=0) this._opacity=tmp;
	}
	if(meta.seenless) this._opacity=0;
	if(meta.animationCount){
		let tmp=Number(meta.animationCount);
		if(0<tmp) this._animationCount=tmp; // is light src if > 0
	}
	this._refActor=meta.refActor;
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
}).ori=$r$;
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
($pppp$[$k$]=function f(posx,posy){
	if(this._asPlayer) return Game_Player.prototype.isCollidedWithEvents.call(this,posx,posy);
	let rtv=f.ori.call(this,posx,posy);
	if(rtv&&this._passSelf){
		const id=this._eventId.toId();
		rtv=$dataMap.coordTblNt[$gameMap.xy2idx(posx,posy)].some(evt=>evt._eventId.toId()!==id);
	}
	return rtv;
}).ori=$r$;
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
$d$=$pppp$._deleteOldDataMember=function f(){
	Game_Character.prototype._deleteOldDataMember.call(this);
	this._deleteOldDataMemberByTbl(f.tbl);
};
$d$.tbl=[
	['_eventId','_evtid'],
	['_moveType','_mvtp'],
	['_priorityType','_pri'],
	['_strtByAny','_sba'],
	['_through','_thru'],
	['_trigger','_trg'],
	['_x','__x'],
	['_y','__y'],
];
Object.defineProperties($pppp$,{
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
	_grayscale:{
		get:function(){ return this._gscl; },
		set:function(rhs){
			if(this._gscl===rhs) return rhs;
			this.imgModded=true;
			return this._gscl=rhs;
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
	_light:{
		get:function(){ return this._viewRadius1; },
		set:function(rhs){
			if(!isNaN(rhs) && this._viewRadius1!==rhs){
				this._viewRadius2=this._vrg+(this._viewRadius1=rhs);
			}
			return this._viewRadius1;
		},
	configurable:false},
	_lightG:{
		get:function(){ return this._vrg; },
		set:function(rhs){
			if(!isNaN(rhs) && this._vrg!==rhs){
				this._viewRadius2=this._viewRadius1+(this._vrg=rhs);
			}
			return this._vrg;
		},
	configurable:false},
	// simply shorten (default members)
	_moveType:{ get:function(){ return this._mvtp; },set:function(rhs){
		return this._mvtp=rhs;
	},configurable:false},
	_originalDirection:{ get:function(){ return this._odir||2; },set:function(rhs){
		return this._odir=rhs;
	},configurable:false},
	// simply shorten (custom members)
	//_switches:{ // need to be saved after leaving a map so don't use this way
	//	get:function(){ return this._ss; },
	//	set:function(rhs){ return this._ss=rhs; },
	//configurable:false},
	_skipRender:{
		get:function(){ return this._sr; },
		set:function(rhs){ return this._sr=rhs|0; },
	configurable:false},
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
	_refActor:{
		get:function(){ return this._ra; },
		set:function(rhs){ return this._ra=rhs; },
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
	_light2:{
		get:function(){ return this._viewRadius2; },
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
($pppp$[$k$]=function f(d){ // .strtByAny
	f.ori.call(this,d);
	if(!this.isMovementSucceeded()) return; // handled by this.checkEventTriggerTouch
	const idx=this.xy2idx();
	let strtMeta={startBy:this._eventId},strtByAny=$dataMap.coordTbl_strtByAny[idx];
	if(strtByAny) strtByAny.forEach(evt=>!evt._starting&&!evt.strtByAny_skips.has(this._eventId)&&evt.start(undefined,strtMeta)); // 'if' for preventing myself moving an evt out of the map
	if( this._triggerFollower && this._trigger === 2 && $gamePlayer.xy2idx()!==idx ){
		const flr=$gamePlayer._followers.getFlrAtTblIdx(idx)[0];
		if( flr && !this.isJumping() && this.isNormalPriority() ) return this.start(undefined,{btlr:flr.actor()._actorId,flrIdx:flr._memberIndex-1});
	}
}).ori=$r$;
$k$='checkEventTriggerTouch';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(x,y){ // .strtByAny
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
}).ori=$r$;
$r$=$pppp$.update;
($pppp$.update=function f(){
	//if(this._player>=0)
	{
		const a=this.getActor();
		let needUpdate=false,data,color,scale,cidx,cname;
		if(this._tmp){
		if(a&&(
			this._tmp._lastActor!==a ||
			this._tmp._lastActorDead!==this._dmg
		)){
			needUpdate=true;
			data=a.getData();
			color=a._getColorEdt();
			scale=a._getScaleEdt();
			cidx=a.characterIndex();
			cname=a.characterName();
		}else if(this._tmp._lastActorDead!==this._dmg && this._refActor){
			if(data=$dataActors[this._refActor]){
				needUpdate=true;
				color=data.meta.color;
				scale=data.meta.scale;
				cidx=data.characterIndex;
				cname=data.characterName;
			}
		}
		}
		if(needUpdate){
			this._tmp._lastActor=a;
			this._color=color;
			this._scale=scale;
			let dmgimg;
			if((this._tmp._lastActorDead=this._dmg) && (dmgimg=data.dmgimg)){
				if(this._dirfx_bak===undefined) this._dirfx_bak=this._dirfx;
				this._ref_chrIdx  =cidx ;
				this._ref_chrName =cname;
				this._characterName  =dmgimg[0];
				this._characterIndex =dmgimg[1];
				this._direction=(dmgimg[2]+1)<<1;
				this._dirfx=1;
			}else{
				this._characterName  =cname;
				this._characterIndex =cidx ;
				if(this._dirfx_bak!==undefined){
					this._dirfx=this._dirfx_bak;
					delete this._dirfx_bak;
				}
			}
		}
	}
	if(this.canUpdate()) return f.ori.call(this);
}).ori=$r$;
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
		if(!this._itrp2.isRunning()){
			this._itrp2.clear();
			this.unlock();
		}
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
($pppp$.start=function f(isFromPlayerCustom,strtMeta){ // fit $dataMap.strtEvts
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
}).ori=$r$;
$k$='clearStartingFlag';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){ // overwrite to fit $dataMap.strtEvts
	//debug.log2('Game_Event.prototype.clearStartingFlag'); // annoying
	//debug.log2('',this._eventId);
	//debug.log2('',this._trigger);
	//if(debug.islog2()) console.log('',deepcopy($dataMap.strtEvts));
	let strt=this._starting;
	f.ori.call(this);
	this._addedCnt_strtEvts-=0<this._addedCnt_strtEvts;
	delete this.strt;
}).ori=$r$;
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
($pppp$.erase=function f(by){
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
}).ori=$r$;
// <erasedBy:{"key":evtid}> ; when 'by' provided to 'Game_Event.erase(by)' exists in 'erasedBy', corresponding event will start
$pppp$.parent=function(){
	return (this.parentId)?$gameMap._events[this.parentId]:this;
};
$pppp$._constructChildren=function(tm,ssStates){
	//debug.log('Game_Event.prototype._constructChildren');
	let meta=this.event().meta;
	//debug.log('',meta.child && !this._sameStatEvts);
	if(meta.child && !this._sameStatEvts){ this._sameStatEvts=[];
		const self=this,ssobj=$gameSelfSwitches._data[this._mapId];
		tm=tm||Date.now();
		ssStates=ssStates||$gameSelfSwitches.switches.filter(x=>$gameSelfSwitches._value(this._mapId,this._eventId,x));
		let mapid=this._mapId,evts=$gameMap._events,obj=this,obj_ori=this,meta_ori=meta,dict={};
		while(meta.child){
			if(dict[meta.child]) break; else dict[meta.child]=1; // check cycle
			let x=obj.x,y=obj.y,dx=meta.dx?Number(meta.dx):0,dy=meta.dy?Number(meta.dy):0;
			obj=objs.new_Game_Event(mapid,meta.child+'-'+tm+"8"+evts.length.toString(8));
			obj._realX=obj._x=x+dx; obj._realY=obj._y=y+dy;
			obj.parentId=this._eventId;
			evts.push(obj); evts[obj._eventId]=obj;
			this._sameStatEvts.push(obj._eventId);
			for(let i=0;i!==ssStates.length;++i) $gameSelfSwitches.setValue_(ssobj,obj._eventId,ssStates[i],true);
			meta=obj.event().meta;
		}
	}
};
$pppp$.ssState=function(ssname){
	// 'ss' for "self switch"
	return {obj:$gameSelfSwitches._data[this._mapId],key:[this._eventId,ssname]};
};
$pppp$.ssStateInv=function(ssname){
	const v=!$gameSelfSwitches._value(this._mapId,this._eventId,ssname);
	$gameSelfSwitches._setValue(this._mapId,this._eventId,ssname,v);
	return v;
};
$pppp$.ssStateSet=function(ssname,toFalse){
	$gameSelfSwitches._setValue(this._mapId,this._eventId,ssname,toFalse=!toFalse);
	return toFalse;
};
$pppp$.findProperPageIndex=function f(){
	const pages=this.event().pages;
	for(let x=pages.length;x--;){
		const c=pages[x].conditions;
		if(
		 (!c.switch1Valid || $gameSwitches.value(c.switch1Id))
		 && (!c.switch2Valid || $gameSwitches.value(c.switch2Id))
		 && (!c.variableValid || $gameVariables.value(c.variableId)>=c.variableValue)
		 && (!c.selfSwitchValid || $gameSelfSwitches._value(this._mapId,this._eventId,c.selfSwitchCh) )
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
($pppp$[$k$]=function f(){
	this._light=undefined;
	this.imgModded=true;
	return f.ori.call(this);
}).ori=$r$;
$k$='setupPageSettings';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	let evtd=this.event();
	const sp=this.getSprite();
	sp && sp.setText(this.getText());
	if(evtd.meta.colors || evtd.meta.scales) this.imgModded=true;
	if(evtd.light && evtd.light.constructor===Array){
		this._light=evtd.light[this._pageIndex]^0;
	}
	return f.ori.call(this);
}).ori=$r$;
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
($d$=$pppp$.list=function f(){
	let olist=f.ori.call(this),rtv=[];
	for(let x=0,converted=new Set(),useOri;x!==olist.length;++x){
		const curr=olist[x];
		switch(!(useOri=converted.has(x)) && curr.code){
		default:{
			useOri=true;
		}break;
		case 102:{
			f.convertToAdvancedChoice(curr);
			useOri=true;
		}break;
		case 108:{
			if(curr.parameters[0]!=="<meta>"){ useOri=true; break; }
			// comments with starting line="<meta>" is not presented in list
			let c=x+1,cmt="";
			for(;c!==olist.length;++c){
				if(olist[c].code===408){
					cmt+="\n";
					cmt+=olist[c].parameters[0];
				}else break;
			}
			const indent=curr.indent;
			let tmp={note:cmt};
			DataManager.extractMetadata(tmp);
			tmp=tmp.meta;
			if(tmp.preEval) objs._doFlow.call(this,tmp.preEval);
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
					rtv.push({code:355,indent:indent,parameters:["this._wait_scrollTo_done=false;"]}); // script
					rtv.push({code:112,indent:indent,parameters:emptyArr}); // loop
					rtv.push({code:111,indent:indent+1,parameters:[12,"this._wait_scrollTo_done"]}); // if-script
					rtv.push({code:113,indent:indent+2,parameters:emptyArr}); // break
					//rtv.push({code:0,indent:indent+2,parameters:emptyArr}); // empty
					rtv.push({code:412,indent:indent+1,parameters:emptyArr}); // end-if
					rtv.push({code:355,indent:indent+1,parameters:["this._wait_scrollTo_done=$gameMap.scrollToT_gradually("+scrollx+","+scrolly+")"]}); // script
					rtv.push({code:230,indent:indent+1,parameters:[1]}); // wait
					//rtv.push({code:0,indent:indent+1,parameters:emptyArr}); // empty
					rtv.push({code:413,indent:indent,parameters:emptyArr}); // repeat above
					rtv.push({code:355,indent:indent,parameters:["delete this._wait_scrollTo_done;"]}); // script
				} }break;
			} }
			const enables=tmp.enables&&JSON.parse(tmp.enables);
			if(olist[c].code===102){
				// only worked if the next is choices (102)
				f.convertToAdvancedChoice(olist[c],enables);
				converted.add(c);
			}
			const rtvLen=rtv.length;
			if(tmp.cond!==undefined){
				//let cond=eval(tmp.cond);
				let cond=objs._getObj.call(this,tmp.cond);
				if(!cond && tmp.elseSkipN){
					//let skipN=eval(tmp.elseSkipN);
					const skipN=objs._getObj.call(this,tmp.elseSkipN);
					const isFunc=(skipN && skipN.constructor===Function);
					const line=isFunc?skipN(olist,c,rtv):skipN;
					if(isFunc) for(let x=rtvLen;x!==rtv.length;++x) if(rtv[x].code===102 && rtv[x].parameters[0][0].constructor!==Array) f.convertToAdvancedChoice(rtv[x],x===rtvLen&&enables);
					c+=line; if(c>=olist.length) c=olist.length;
				}
			}
			x=c-1; // for-loop: ++x
		}break;
		}
		if(useOri) rtv.push(curr);
	}
	rtv.push(Game_Interpreter.EMPTY);
	return rtv;
}).ori=$r$;
$d$.convertToAdvancedChoice=(cmd102,enables)=>{
	// enables[i] means i-th (0-based) of the original choices' enabled _getObj string. false-like is default: enabled
	const dst=cmd102.parameters[0],noBak=!cmd102.p0bak;
	if(noBak) cmd102.p0bak=deepcopy(dst);
	const src=cmd102.p0bak;
	let x=0;
	if(noBak){
		if(!enables) for(;x!==src.length;++x) dst[x]=[src[x]];
		else for(;x!==src.length;++x) dst[x]=[src[x],enables[x]];
	}else{
		if(!enables) for(;x!==src.length;++x) dst[x].length=1;
		else for(;x!==src.length;++x) dst[x][1]=enables[x];
	}
};
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
$pppp$.setFace=function(idx){
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
($pppp$.canEdited_auth=function f(parents){
	if(this.getData().meta.noAuth) return true;
	parents=new Set(parents||$gameMap.parents());
	return parents.has($gameParty.burnAuth) || parents.intersect(f.tbl).size!==0;
	//return !(parents.indexOf(13)===-1 && parents.indexOf(90)===-1 && parents.indexOf($gameParty.burnAuth)===-1);
}).tbl=new Set([13,157,159,173,55]); // 13:forest 157:sky 159:noob 173:zone1 176:拉起封鎖線-遊樂場
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
($pppp$.updateSelfMovement=function f(forced){
	const func=f.tbl[this._moveType];
	if(func && this.updateSelfMovement_cond(forced)) func.call(this);
}).tbl=[
	undefined,
	function(){ this.moveTypeRandom(); },
	function(){ this.moveTypeTowardPlayer(); },
	function(){ this.moveTypeCustom(); },
	undefined,
	undefined,
	undefined,
];
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
$pppp$.setValue=function f(id,val){
	let strt=$gameTemp.gameVarTrimStrt^=0;
	if(strt<id){
		for(;strt!==id;++strt) if(!this._data[strt] && this._data[strt]!=='') this._data[strt]^=0;
		$gameTemp.gameVarTrimStrt=id;
	}
	if(0<id){
		if((typeof val)==='number'){
			const abs=Math.abs(val);
			if(abs<=0x7FFFFFFF) val^=0;
			else if(abs===Infinity||isNaN(val)) val+='';
		}
		this._data[id]=val;
		this.onChange();
	}
};
$pppp$=$aaaa$=undef;

// - item
$aaaa$=Game_Item;
$pppp$=$aaaa$.prototype;
Object.defineProperties($pppp$,{
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
($pppp$.object=function f(){
	if(f.tbl) return (f.tbl[this._dataClass]||f.tbl._)[this._itemId];
	f.tbl={
		a:$dataArmors,
		armor:$dataArmors,
		i:$dataItems,
		item:$dataItems,
		s:$dataSkills,
		skill:$dataSkills,
		w:$dataWeapons,
		weapon:$dataWeapons,
	};
	f.tbl[undefined]=f.tbl['']=f.tbl._={};
	return f.call(this);
}).tbl=undefined;
($pppp$.setObject=function f(item){
	if(!item) this._itemId=0;
	else{
		//this._dataClass=f.tbl[item.itemType]||'';
		this._dataClass=item.itemType||'';
		this._itemId=item.id;
	}
}).tbl={a:'armor',i:'item',s:'skill',w:'weapon',};
$pppp$=$aaaa$=undef;

// - action
$aaaa$=Game_Action;
$pppp$=$aaaa$.prototype;
$aaaa$.currMaxEnum=50;
$aaaa$.addEnum=objs._addEnum;
$k$='initialize';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(subject,forcing){
	f.ori.call(this,subject,forcing);
	this._dmgRate=1;
	this.initMeta();
}).ori=$r$;
$pppp$.initMeta=function(){
	this.meta={
		preload:false, // preload btlr attrs for not evaluated again
		deadNotMatch:undefined, // used in testApply. true if failure reason is death/live state
		targets:undefined, // idxs of targets in opponent unit for enemy.ai @ Game_Enemy.prototype.selectAllActions
	};
};
$pppp$.clearPreloadFlag=function(){
	this.meta.preload=false;
};
$pppp$.setPreloadFlag=function(){
	this.meta.preload=true;
};
$pppp$.isUsePreload=function(){
	return this.meta.preload;
};
$t$=($pppp$.setPreload_t=function f(t){
	const meta=this.meta; if(!meta.t) meta.t={};
	for(let x=0,arr=f.tbl;x!==arr.length;++x) meta.t[arr[x]]=t[arr[x]];
}).tbl=[
	'eva','mev','cev','rec','pdr','mdr','decDmgP','decDmgM',
];
($pppp$.copyPreload_t=function f(){
	const rtv={};
	for(let x=0,src=this.meta.t,arr=f.tbl;x!==arr.length;++x) rtv[arr[x]]=src[arr[x]];
	return rtv;
}).tbl=$t$;
$t$=($pppp$.setPreload_s=function f(){
	const meta=this.meta , s=this.subject(); if(!meta.s) meta.s={};
	for(let x=0,arr=f.tbl;x!==arr.length;++x) meta.s[arr[x]]=s[arr[x]];
}).tbl=[
	'hit','cri','rec',
	'dmgRcvHpR','dmgRcvHpV','dmgRcvMpR','dmgRcvMpV',
];
($pppp$.copyPreload_s=function f(){
	const rtv={};
	for(let x=0,src=this.meta.s,arr=f.tbl;x!==arr.length;++x) rtv[arr[x]]=src[arr[x]];
	return rtv;
}).tbl=$t$;
$pppp$.refPreload_t=function(ref){
	this.meta.t=ref;
};
$pppp$.refPreload_s=function(ref){
	this.meta.s=ref;
};
$pppp$.getPreload_t=function(){
	return this.meta.t;
};
$pppp$.getPreload_s=function(){
	return this.meta.s;
};
$pppp$.usePreload=function f(t){
	this.setPreloadFlag();
	this.setPreload_s();
	if(t) this.setPreload_t(t);
};
$pppp$.setSubject=function(s){
	if(s.isActor()){
		this._subjectActorId = s.actorId();
		this._subjectEnemyIndex = -1;
	}else{
		if(!s._ukey) $gameTroop._addUKey(s);
		this._subjectEnemyIndex = s._ukey;
		this._subjectActorId = 0;
	}
};
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
$pppp$.isAttack=function(subject){
	return this.item() === $dataSkills[(subject||this.subject()).attackSkillId()];
};
$pppp$.isGuard=function(subject){
	return this.item() === $dataSkills[(subject||this.subject()).guardSkillId()];
};
$pppp$.isSpaceout=function(subject){
	return this.item() === $dataSkills[(subject||this.subject()).spaceoutSkillId()];
};
$t$={
	isForDeadFriend: function(){
		return this.friendsUnit().randomDeadTarget();
	},
	isForFriend: function(){
		return this.friendsUnit().randomTarget();
	},
	isForAllFriend: function(){
		return this.friendsUnit().members().rnd();
	},
};
($d$=$pppp$.decideRandomTarget=function f(){
	const func=f.tbl[this.item().scope];
	const target=func?func.call(this):this.opponentsUnit().randomTarget();
	if(target) this._targetIndex = target.index();
	else this.clear();
}).tbl={
	9: $t$.isForDeadFriend,
	10: $t$.isForDeadFriend,
	7: $t$.isForFriend,
	8: $t$.isForFriend,
	11: $t$.isForFriend,
	12: $t$.isForAllFriend,
	16: $t$.isForAllFriend,
}; for(let x=64,arr=$d$.tbl;x--;) if(!arr[x]) arr[x]=undefined;
$t$=undef;
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
$d$=$pppp$.isRecover=function f(item){
	return f.tbl[(item||this.item()).damage.type]|0;
};
$d$.tbl=[0,0,0,1,1,]; // 3,4
$pppp$.isKindOfAttack=function f(item){ // is a type of normal attack. show weapon animation
	// and add repeat times
	if(!item) item=this.item();
	return item&&item.isNormalAtk; // parsed in arrangeData
};
$pppp$.numRepeats=function f(forcedRepeats){
	const item=this.item(),subject=this.subject();
	let repeats=forcedRepeats===undefined?item.repeats:forcedRepeats;
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
$t$={
	isForOpponent: function(toWrongTarget){
		return toWrongTarget ? this.targetsForFriends(this.opponentsUnit()) : this.targetsForOpponents();
	},
	isForFriend: function(toWrongTarget){
		return toWrongTarget ? this.targetsForOpponents(this.friendsUnit()) : this.targetsForFriends();
	},
	isForBattler: function(toWrongTarget){
		return this.targetsForBattler();
	},
};
($d$=$pppp$.makeTargets=function f(dontTestConfused,toWrongTarget){
	let targets,s=this.item().scope;
	if(!dontTestConfused && !this._forcing && s!==1 && this.subject().isConfused()) targets = [this.confusionTarget()];
	else{
		const func=f.tbl[s];
		if(func) targets=func.call(this,toWrongTarget);
	}
	return this.repeatTargets(targets||[]);
}).tbl={
	1: $t$.isForOpponent,
	2: $t$.isForOpponent,
	3: $t$.isForOpponent,
	4: $t$.isForOpponent,
	5: $t$.isForOpponent,
	6: $t$.isForOpponent,
	7: $t$.isForFriend,
	8: $t$.isForFriend,
	9: $t$.isForFriend,
	10: $t$.isForFriend,
	11: $t$.isForFriend,
	12: $t$.isForFriend, // all, dead not matter
	13: $t$.isForBattler,
	14: $t$.isForBattler,
	15: $t$.isForBattler,
	16: $t$.isForFriend, // 1, dead not matter
}; for(let x=64,arr=$d$.tbl;x--;) if(!arr[x]) arr[x]=undefined;
$t$=undef;
$pppp$.confusionTarget=function(){
	switch (this.subject().confusionLevel()) {
	// case 1: return this.opponentsUnit().randomTarget(); // remain same , but not user input
	case 2: // opposite with chance 1/2
		return this.makeTargets(true,Math.random()<0.5);
	default: // 3: attack ally ; 4: cannot move
		return this.makeTargets(true,true);
	}
};
$t$={
	isForRandom: function(unit){
		return unit.randomTarget(this.numTargets(),this.meta.targets);
	},
};
($d$=$pppp$.targetsForOpponents=function f(U){ // scope: [1..6]
	const func=f.tbl[this.item().scope];
	if(func) return func.call(this,U||this.opponentsUnit());
	return [];
}).tbl={
	1: function(unit){
		let idx=this.meta.targets;
		if(!idx||!idx.length) idx=this._targetIndex;
		return [ idx<0 ? unit.randomTarget() : unit.smoothTarget(idx) ] ; // this.isForOne
	},
	2: unit=>unit.aliveMembers(),
	3: $t$.isForRandom,
	4: $t$.isForRandom,
	5: $t$.isForRandom,
	6: $t$.isForRandom,
}; for(let x=32,arr=$d$.tbl;x--;) if(!arr[x]) arr[x]=undefined;
$t$=undef;
($d$=$pppp$.targetsForFriends=function f(U){ // scope: [7..12,16]
	const func=f.tbl[this.item().scope];
	if(func) return func.call(this,U||this.friendsUnit(),this.meta.targets);
	return [];
}).tbl={
	7: function(unit,idx){
		if(!idx||!idx.length) idx=this._targetIndex;
		return [ idx<0 ? unit.randomTarget() : unit.smoothTarget(idx) ];
	}, // isForFriend (1)
	8: unit=>unit.aliveMembers(), // isForFriend (all)
	9: function(unit,idx){
		if(!idx||!idx.length) idx=this._targetIndex;
		return [unit.smoothDeadTarget(idx)];
	}, // this.isForDeadFriend (1)
	10: unit=>unit.deadMembers(), // this.isForDeadFriend (all)
	11: function(){ return [this.subject()]; }, // this.isForUser
	12: unit=>unit.members(), // this.isForAllFriends // all, dead not matter
	16: function(unit,idx){
		if(idx&&idx.length) idx=idx[0];
		else idx=this._targetIndex;
		return [ idx>=0 ? unit.members()[idx] : unit.randomTarget() ];
	}, // this.isForAllFriend // 1, dead not matter
}; for(let x=32,arr=$d$.tbl;x--;) if(!arr[x]) arr[x]=undefined;
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
$t$={
	isForOpponent: function(){
		return this.opponentsUnit().aliveMembers();
	},
	isForFriend: function(){
		return this.friendsUnit().aliveMembers();
	},
	isForDeadFriend: function(){
		return this.friendsUnit().deadMembers();
	},
	isForUser: function(){
		return [this.subject()];
	},
	isForAllFriend: function(){
		return this.friendsUnit().members();
	},
	isForBattler: function(){
		return this.targetsForBattler();
	},
};
($d$=$pppp$.itemTargetCandidates = function f(){
	if(!this.isValid()) return [];
	const func=f.tbl[this.item().scope];
	if(func) func.call(this);
	return [];
}).tbl={
	1: $t$.isForOpponent,
	2: $t$.isForOpponent,
	3: $t$.isForOpponent,
	4: $t$.isForOpponent,
	5: $t$.isForOpponent,
	6: $t$.isForOpponent,
	7: $t$.isForFriend,
	8: $t$.isForFriend,
	9: $t$.isForDeadFriend,
	10: $t$.isForDeadFriend,
	11: $t$.isForUser,
	12: $t$.isForAllFriend,
	13: $t$.isForBattler,
	14: $t$.isForBattler,
	15: $t$.isForBattler,
	16: $t$.isForAllFriend,
}; for(let x=32,arr=$d$.tbl;x--;) if(!arr[x]) arr[x]=undefined;
$t$=undef;
$pppp$.getItemFilter=function(item){
	item=item||this.item();
	if(!item) return false;
	const meta=item.meta;
	return item.filter||(item.filter=(meta.filter=meta.filter)&&objs._getObj(meta.filter));
};
$r$=$pppp$.testApply;
($pppp$.testApply=function f(target){
	this.meta.deadNotMatch=undefined;
	if(!target) return false;
	const item=this.item();
	if(!item) return false;
	const meta=item.meta;
	const filter=this.getItemFilter();
	if(filter) return filter(target,this.subject());
	return (
		!(this.meta.deadNotMatch=!( this.isDeadNotMatter() || this.isForDeadFriend() === target.isDead() )) &&
		(
			(meta.stomach && target.stp!==undefined && target.stp<target.mstp) || // inline stp cond.
			$gameParty.inBattle() || this.isForOpponent() ||
			(this.isHpRecover() && target.hp < target.mhp) ||
			(this.isMpRecover() && target.mp < target.mmp) ||
			this.hasItemAnyValidEffects(target)
		)
	);
}).ori=$r$;
($d$=$pppp$.testItemEffect=function f(target,effect){
	const func=f.tbl[effect.code];
	return !func||func.call(this,target,effect); // default true
}).tbl=[];
{ $d$.tbl.length=52; const act=$aaaa$;
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
$pppp$.itemAcnt=function(target){
	return this.item().counterable && target.canMove() ? target.counterARate() : 0;
};
$pppp$.itemPcnt=$pppp$.itemCnt=function(target) {
	return this.item().counterable && this.isPhysical() && target.canMove() ? target.counterPRate() : 0;
};
$pppp$.itemMcnt=function(target){
	return this.item().counterable && this.isMagical() && target.canMove() ? target.counterMRate() : 0;
};
$pppp$.itemArf=function(target){
	return this.item().reflectable ? target.reflectARate() : 0;
};
$pppp$.itemPrf=function(target){
	return this.item().reflectable && this.isPhysical() ? target.reflectPRate() : 0 ;
};
$pppp$.itemMrf=function(target){
	return this.item().reflectable && this.isMagical() ? target.reflectMRate() : 0 ;
};
$pppp$.itemHit=function(t,s){ // successRate only
	return this.item().successRate;
	/*
	const item=this.item();
	return item.surehit?1:(item.successRate*(
		this.isPhysical() ? 
			(
				this.isUsePreload()?this.getPreload_s():(s||this.subject())
			).hit : 
			1
	));
	*/
};
($pppp$.itemEva=function f(t,s){
	const item=this.item();
	if(item.surehit) return 0;
	else if(f.tbl) return (f.tbl[item.hitType]||f.tbl._).call(this,t,s);
	const tbl=f.tbl={},a=Game_Action;
	tbl._=tbl[a.HITTYPE_CERTAIN]=()=>0;
	tbl[a.HITTYPE_PHYSICAL]=function(t,s){
		return (this.isUsePreload()?this.getPreload_t():t).eva - (this.isUsePreload()?this.getPreload_s():(s||this.subject())).hit ;
	};
	tbl[a.HITTYPE_MAGICAL]=function(t,s){
		return (this.isUsePreload()?this.getPreload_t():t).mev ;
	};
	return f.apply(this,arguments);
}).tbl=undefined;
$pppp$.itemCri=function(t){
	const item=this.item();
	return item.damage.critical ? 
		(
			item.critF===undefined ? 
				item.critA + (this.isUsePreload()?this.getPreload_s():this.subject()).cri : 
				item.critF
		) * (1 - (this.isUsePreload()?this.getPreload_t():t).cev ) : 
		0 ;
};
($pppp$.getSelfItemObj=function f(obj){
	const item=arguments.length?obj:this.item();
	if(item){ const l=item.meta.self;
		if(l){
			const s=l.split(',');
			if(!f.tbl) f.tbl={
				_:{},
				i:$dataItems,
				s:$dataSkills,
			};
			return (f.tbl[s[0]]||f.tbl._)[s[1]];
		}
	}
	return false;
}).tbl=undefined;
$pppp$.canForSelf=obj=>!!obj;
$d$=$pppp$.apply=function f(target,dmgPopupFollowPrev){
	// return action used if used
	const result = target.result() , subject = this.subject();
	let tmp=this; if(!this._reflected && subject===target){
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
	if(subject!==target) subject.clearResult();
	result.clear();
	const used=result.used = act.testApply(target);
	if( !used ){
		if(this.meta.deadNotMatch){
			//act.applyItemUserEffect(target);
		}
		this.meta.deadNotMatch=undefined;
		//return;
	}
		this.meta.deadNotMatch=undefined;
	result.physical = act.isPhysical();
	result.drain = act.isDrain();
	if( result.missed = (used && Math.random() >= act.itemHit(target,subject)) ){
		result.merge=dmgPopupFollowPrev;
		f.toQ(result,target,subject); // if(result.isHit())
		return act;
	}
	if( result.evaded = (used && !result.missed && Math.random() < act.itemEva(target,subject)) ){
		result.merge=dmgPopupFollowPrev;
		f.toQ(result,target,subject); // if(result.isHit())
		return act;
	}
	const isBtl=SceneManager.isBattle();
	let hpd=0,mpd=0,stpd=0;
	const addDs=res=>{ hpd+=res.hpDamage; mpd+=res.mpDamage; stpd+=res.stpDamage; };
	// if(result.isHit())
	{
		const item=act.item();
		if(item.damage.type>0){
			result.critical = (Math.random() < act.itemCri(target));
			const value = act.makeDamageValue(target, result.critical);
			f.clearDs(result);
			act.executeDamage(target, value, used);
			addDs(result);
			result.recover=this.isRecover(item); // used when value===0
		}
		item.effects.forEach(eff=>{
			f.clearDs(result);
			act.applyItemEffect(target, eff);
			addDs(result);
		});
		result.hpDamage=hpd; result.mpDamage=mpd; result.stpDamage=stpd;
		act.applyItemUserEffect(target);
	}
	
	if(isBtl && used){
		result.merge=dmgPopupFollowPrev;
		f.toQ(result,target,subject); // at least this is not 'later'
		if(subject!==target){
			const q=subject.reserveActResQ() , res=subject.result();
			if(res.hpDamage!==0||res.mpDamage!==0||res.stpDamage!==0){
				res.merge=dmgPopupFollowPrev;
				q.push(res.copy());
			}
			//else if(!dmgPopupFollowPrev) q.push(undefined); // delimiter // handled by btlmgr.invokeAction
		}
	}
	return used && act;
};
$d$.toQ=(res,trgt,s)=>{
	if(!res.used) return;
	// prepare for displaying this info
	const res2=trgt.pushActResQ(res);
	// if(res2) BattleManager.logActRes(res2,s,trgt); // currently not needed
};
$d$.clearDs=res=>{ res.hpDamage=0; res.mpDamage=0; res.stpDamage=0; };
$pppp$.makeDamageValue=function(target,isCri){
	const item = this.item() , baseValue = this.evalDamageFormula(target);
	// calc. value based on target's ele. def. and what item's elements are
	const t=(this.isUsePreload()?this.getPreload_t():target);
	let value = baseValue * this.calcElementRate(target) , decDmg=0;
	switch(item.hitType){
	// default:
	// case Game_Action.HITTYPE_CERTAIN:
	// break;
	case Game_Action.HITTYPE_PHYSICAL: {
		value *=t.pdr;
		decDmg+=t.decDmgP;
	}break;
	case Game_Action.HITTYPE_MAGICAL: {
		value *=t.mdr;
		decDmg+=t.decDmgM;
	}break;
	}
	if(baseValue < 0){
		value *= t.rec;
	}
	if(isCri){
		value = this.applyCritical(value);
	}
	if(item.damage.variance) value = this.applyVariance(value, item.damage.variance);
	value = this.applyGuard(value, target);
	value-=decDmg;
	value*=this._dmgRate;
	return Math.abs(value)<=INT_MAX?~~value:Math.round(value);
};
($pppp$.evalDamageFormula=function f(target,allowNeg){
	const item=this.item(); if(!item || !item.damage.formula) return 0;
	
	try{
		//let a = this.subject() , b = target;
		if(!item.formula_func||item.formula_func.constructor!==Function){
			f.tbl[3]="return "+item.damage.formula;
			item.formula_func=Function.apply(null,f.tbl);
		}
	}catch(e){
		// only handling function creation failure
		if(objs.isDev) console.warn("item.formula_func creation failed",item.id,item);
		item.damage.formula=undefined;
		return 0;
	}
	
	let val=item.formula_func.call(none,undefined,this.subject(),target);
	val*=!!allowNeg||val>0;
	if(this.isRecover(item)) val=-val;
	return val||0; // prevent NaN , reserve fractions
}).tbl=['window','a','b',]; // def func args
($pppp$.calcElementRateAvg=function f(target){
	const item=this.item() , tmp={} , allEles=[];
	if(BattleManager._phase) this._lastAllEles=allEles;
	let rtv=0.0,m;
	if(item.damage.elementId<0) m=this.subject().attackElements();
	else{
		m=f.tbl;
		m.clear();
		m.add(item.damage.elementId);
	}
	m.forEach((v,k)=>{
		if(tmp[k]===undefined) tmp[k]=target.elementRate(k);
		rtv+=tmp[k];
		allEles.push(k);
	});
	let cnt=m.size;
	if(item.addEle){
		const arr=item.addEle;
		cnt+=arr.length;
		for(let x=0;x!==arr.length;++x){
			if(tmp[arr[x]]===undefined) tmp[arr[x]]=target.elementRate(arr[x]);
			rtv+=tmp[arr[x]];
			allEles.push(arr[x]);
		}
	}
	return cnt?rtv/cnt:1;
}).tbl=new Set();
$pppp$.calcElementRateMax=function(target){
	const item=this.item();
	if(item.damage.elementId<0) return this.elementsMaxRate(target, this.subject().attackElements(), item.addEleU);
	else{
		const arr_added=item.addEleU,tmp={};
		const rtv=tmp[item.damage.elementId]=target.elementRate(item.damage.elementId);
		return this._elementsMaxRate_ae(rtv,target,arr_added,tmp);
	}
};
$pppp$.calcElementRate=function f(target){
	return this.calcElementRateAvg(target);
};
$pppp$._elementsMaxRate_ae=function(rtv,target,arr_added,tbl){
	if(arr_added){ for(let x=0;x!==arr_added.length;++x) if(tbl[arr_added[x]]===undefined){
		const r=tbl[arr_added[x]]=target.elementRate(arr_added[x]);
		if(rtv<r) rtv=r;
	} }
	return rtv;
};
$pppp$.elementsMaxRate=function(target,map_ele,arr_added){
	let rtv=!map_ele.size,tmp={};
	if(map_ele.size){
		map_ele.forEach((v,k)=>{
			const r=tmp[k]=target.elementRate(k);
			if(rtv<r) rtv=r;
		});
	}
	return this._elementsMaxRate_ae(rtv,target,arr_added,tmp);
};
$pppp$._elementsAllRatePi_ae=function(rtv,target,arr_added,tbl){
	if(arr_added) for(let x=0;x!==arr_added.length;++x) rtv*=tbl[arr_added[x]]===undefined?(tbl[arr_added[x]]=target.elementRate(arr_added[x])):tbl[arr_added[x]];
	return rtv;
};
$pppp$.elementsAllRatePi=function(target,map_ele,arr_added){
	let rtv=1,tmp={};
	map_ele.forEach((v,k)=>rtv*=tmp[k]=target.elementRate(k));
	return this._elementsAllRatePi_ae(rtv,target,arr_added,tmp);
};
$pppp$.applyGuard=function(damage,target){
	const r=damage>0 && !this.item().defpenetrate && target.isGuard() && 2*target.grd;
	return r>1?damage/r:damage;
};
$k$='executeDamage';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(trgt,val,used){
	const s=!this.isRecover()&&this.subject();
	if(s){
		const ss=(this.isUsePreload()?this.getPreload_s():s);
		let gainHp = ss.dmgRcvHpR*val+ss.dmgRcvHpV , gainMp = ss.dmgRcvMpR*val+ss.dmgRcvMpV , rec;
		if((gainHp||gainMp) && (rec=ss.rec)){
			gainHp*=rec; gainHp=Math.abs(gainHp)<=INT_MAX?~~gainHp:Math.round(gainHp);
			gainMp*=rec; gainMp=Math.abs(gainMp)<=INT_MAX?~~gainMp:Math.round(gainMp);
			if(gainHp||gainMp){
				const orires=s&&s.result();
				const r2=s._result=new Game_ActionResult();
				r2.later=true;
				if(gainHp) s.gainHp(gainHp);
				if(gainMp) s.gainMp(gainMp);
				if(used && SceneManager.isBattle()) s.pushActResQ(r2); // not to be displayed in logs
				s._result=orires;
			}
		}
	}
	//f.ori.call(this,trgt,val,used);
	if(used){
		const hp=trgt.hp,mp=trgt.mp,tp=trgt.tp,bm=BattleManager;
		this._exeVal=0;
		if(this.isHpEffect()) this.executeHpDamage(trgt,val);
		if(this.isMpEffect()) this.executeMpDamage(trgt,val);
		if(bm._phase) bm.logActDmg({
			dhp:hp-trgt.hp,
			dmp:mp-trgt.mp,
			dtp:tp-trgt.tp,
			eles:this._lastAllEles,
		},s||this.subject(),trgt);
	}
}).ori=$r$;
$pppp$.executeHpDamage=function f(target,value){
	if(this.isDrain() && target.hp<value) value=target.hp;
	this.makeSuccess(target);
	const mpsubst=value>0 && target.MPSubstituteRate();
	if(mpsubst){
		let mpDmg=value*mpsubst;
		mpDmg=mpDmg<=INT_MAX?~~mpDmg:Math.round(mpDmg);
		if(!(mpDmg<=target.mp)) mpDmg=target.mp;
		target.gainHp(mpDmg-value); // gain<=0
		if(mpDmg) this.executeMpDamage(target,mpDmg);
	}else target.gainHp(-value);
	if(value > 0){
		target.onDamage(value); // removeStatesByDamage
	}
	this.gainDrainedHp(value);
	this._exeVal+=value;
};
$pppp$.executeMpDamage=function(target, value){
	if(!this.isMpRecover() && target.mp<value) value=target.mp;
	if(value) this.makeSuccess(target);
	target.gainMp(-value);
	this.gainDrainedMp(value);
	this._exeVal+=value;
};
$pppp$.gainDrainedHp=function(val){
	if(val && this.isDrain()){
		//if(this._reflectionTarget !== undefined) s=this._reflectionTarget;
		const s=this.subject();
		const orires=s&&s.result();
		const r2=s._result=new Game_ActionResult();
		r2.later=true;
		s.gainHp(val);
		if(SceneManager.isBattle()){
			// should be displayed in logs
			s.pushActResQ(r2);
		}
		s._result=orires;
	}
};
$pppp$.gainDrainedMp=function(val){
	if(val && this.isDrain()){
		//if(this._reflectionTarget !== undefined) s=this._reflectionTarget;
		const s=this.subject();
		const orires=s&&s.result();
		const r2=s._result=new Game_ActionResult();
		r2.later=true;
		s.gainMp(val);
		if(SceneManager.isBattle()){
			// should be displayed in logs
			s.pushActResQ(r2);
		}
		s._result=orires;
	}
};
($d$=$pppp$.applyItemEffect=function f(target,effect){
	const func=f.tbl[effect.code];
	if(func) func.call(this,target,effect);
}).tbl=[];
{ $d$.tbl.length=52; const act=$aaaa$;
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
$aaaa$.addEnum("CUSTOM_EFFECT_FUNC",$d$.tbl,function(target,effect){
	if(!effect.func_func) effect.func_func=objs._getObj.call(none,effect.func);
	effect.func_func(this,target) && this.makeSuccess(target);
});
$aaaa$.addEnum("CUSTOM_EFFECT_CODE",$d$.tbl,function(target,effect){
	objs._doFlow.call(target,effect.func);
	this.makeSuccess(target);
});
$aaaa$.addEnum("CUSTOM_EFFECT_REMOVE",$d$.tbl,function(target,effect){
	target.friendsUnit().remove(target);
	this.makeSuccess(target);
});
} // Game_Action.prototype.applyItemEffect.tbl
($pppp$._database_genState_dmgVal=function f(target,ref){
	const oriDmgVal1=ref.dmgVal[1];
	f.tbl[3]="return "+oriDmgVal1;
	ref.dmgVal[1]=Function.apply(null,f.tbl).call(none,undefined,this.subject(),target)+' ';
	const dataobj=$gameSystem._database_genNewByRef(7,target,ref);
	ref.dmgVal[1]=oriDmgVal1;
	return dataobj.id;
}).tbl=['window','a','b'];
($pppp$.itemEffectAddNormalState=function f(target, effect){
	let chance = effect.value1;
	if(!this.isCertainHit()){
		chance *= target.stateRate(effect.dataId);
		chance *= this.lukEffectRate(target);
	}
	if(Math.random() < chance){
		if(effect.isSwitch){
			if(!this.meta) this.initMeta();
			if(!this.meta._switchApplied){
				this.meta._switchApplied=true;
				if( target.isStateAffected(effect.dataId) ) target.removeState(effect.dataId);
				else target.addState(effect.dataId);
			}
		}else{
			let sid=effect.dataId;
			if($dataStates[sid].dmgVal && !$dataStates[sid]._base){
				sid=this._database_genState_dmgVal(target,$dataStates[sid]);
			}
			target.addState(sid);
			// dec. gen. 1
			if(sid!==effect.dataId) target._databaseDel_state($dataStates[sid]);
		}
		this.makeSuccess(target);
	}
}).tbl=['window','a',];
$k$='applyGlobal';
$r$=$pppp$[$k$];
($d$=$pppp$[$k$]=function f(){
	//debug.log('Game_Action.prototype.applyGlobal');
	const dataItem=this.item();
	const meta=dataItem&&dataItem.meta; if(!meta) return;
	
	if(dataItem.effects) dataItem.effects.forEach(ef=>ef.code===Game_Action.EFFECT_COMMON_EVENT&&$gameTemp.reserveCommonEvent(ef.dataId)); // f.ori.call(this);
	const item=this._item,id=item._itemId.toId();
	{ const func=f.tbl[dataItem.itemType];
	if(func) func.call(this,meta);
	}
	{
	//if(meta&&meta.func) eval(meta.func.replace(/\(|\)/g,''))(this);
	//if(meta&&meta.func) objs._getObj.call(none,meta.func.replace(/\(|\)/g,''))(this);
	const func=dataItem.func||( dataItem.func=meta&&(meta.func=meta.func) && objs._getObj.call(none,meta.func) );
	//const func=dataItem.func||( dataItem.func=meta&&(meta.func=meta.func) && eval('objs.'+meta.func.replace(/\(|\)/g,'')) );
	if(func) func(this);
	//if(meta&&meta.code) objs._doFlow.call(this,meta.code);
	const code=dataItem.code||( dataItem.code=meta&&(meta.code=meta.code) && objs._doFlow.call(this,meta.code) );
	if(code) code(this);
	}
}).ori=$r$;
$d$.tbl={
	item: function(meta){
		let qlist=rpgquests.list; //meta=$dataItems[id].meta;
		if(meta.quest&&qlist[meta.ref]) rpgquests.func.showBoard(qlist[meta.ref]);
	},
	skill: function(meta){
		const func=rpgskills.list[meta.ref];
		if(func) func(this);
	},
};
$d$.tbl.i=$d$.tbl.item;
$d$.tbl.s=$d$.tbl.skill;
$pppp$.itemEffectAddAttackState=function(target, effect){
	this.subject().attackStates().forEach((_,stateId)=>{
		let chance = effect.value1;
		chance *= target.stateRate(stateId);
		chance *= this.subject().attackStatesRate(stateId);
		chance *= this.lukEffectRate(target);
		if(Math.random() < chance){
			let sid=stateId;
			if($dataStates[stateId].dmgVal && !$dataStates[stateId]._base){
				sid=this._database_genState_dmgVal(target,$dataStates[stateId]);
			}
			target.addState(sid);
			// dec. gen. 1
			if(sid!==stateId) target._databaseDel_state($dataStates[sid]);
			this.makeSuccess(target);
		}
	});
};
$pppp$.subject=function(){
	if(this._subjectActorId.toId() > 0) return $gameActors.actor(this._subjectActorId);
	else return $gameTroop.getViaUKey(this._subjectEnemyIndex);
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
	this.success = false;
	this.physical = false;
	this.drain = false;
	this.recover = false;
	this.critical = false;
	this.hpAffected = false;
	this.stpDamage = this.tpDamage = this.mpDamage = this.hpDamage = 0;
	this.removedBuffs.length = this.addedDebuffs.length = this.addedBuffs.length = this.removedStates.length = this.addedStates.length = 0;
	this.merge=this.later=false;
};
($pppp$.copy=function f(){
	const rtv=new this.constructor();
	for(let x=0,arr=f.tbl.arr;x!==arr.length;++x) rtv[arr[x]] = this[arr[x]].slice();
	for(let x=0,arr=f.tbl.val;x!==arr.length;++x) rtv[arr[x]] = this[arr[x]];
	return rtv;
}).tbl={
	arr:['addedStates','removedStates','addedBuffs','addedDebuffs','removedBuffs',],
	val:[
		'used','missed','evaded','success',
		'physical','drain','recover','critical',
		'hpAffected',
		'hpDamage','mpDamage','tpDamage','stpDamage',
		'later','merge',
	],
};
Object.defineProperties($pppp$,{
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
	recover:{ get:function(){return this.rcv;},
		set:function(rhs){return this.rcv=rhs&&1||0;},
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
$pppp$._getGrayEdt=$r$._getGrayEdt;
$pppp$._getScaleEdt=$r$._getScaleEdt;
$pppp$._getAnchoryEdt=$r$._getAnchoryEdt;
Object.defineProperties($pppp$,{
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
			["_actionInputIndex",	"_actInIdx"],
			["_actionState",	"_actStat"],
			["_actions",	"_acts"],
			["_animations",	"_anis"],
			["_battlerName",	"_btlrN"],
			["_buffTurns",	"_bufTn"],
			["_characterIndex",	"_chrIdx"],
			["_characterName",	"_chrN"],
			["_classId",	"_cid"],
			["_damagePopup",	"_dmgPop"],
			["_effectType",	"_effT"],
			["_faceIndex",	"_faceIdx"],
			["_faceName",	"_faceN"],
			["_hidden",	"_hid"],
			["_lastBattleSkill",	"_lstBtlSk"],
			["_lastCommandSymbol",	"_lstCmdSym"],
			["_lastMenuSkill",	"_lstMnSk"],
			["_lastTargetIndex",	"_lstTrgIdx"],
			["_motionRefresh",	"_motRfr"],
			["_motionType",	"_motT"],
			["_nickname",	"_nick"],
			["_paramPlus",	"_pp"],
			["_result",	"_res"],
			["_stateSteps",	"_statSt"],
			["_stateTurns",	"_statTn"],
			["_weaponImageId",	"_wImgId"],
			["_weapon2ImageId",	"_w2ImgId"],
		].forEach(x=>{
			const tmp=this[x[0]];
			delete this[x[0]];
			this[x[0]]=tmp;
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
($pppp$[$k$]=function f(actorId){
	f.ori.call(this,actorId);
	this._plan=[];
	this._meta={};
	if(!this.getData().meta.noHunger&&objs.confs.useStp){
		this._stp=500;
	}
}).ori=$r$;
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
	this.refresh(true);
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
	if(SceneManager.isBattle()) for(let x=0;x!==newSkills.length;++x) this.updateChase($dataSkills[newSkills[x]]);
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
	this.updateChase($dataClasses[oldCid],$dataClasses[classId]);
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
$pppp$.isWeaponSlot=function(slotId){ // etype starts from 1 ; slotId starts from 0
	return slotId===1?this.isDualWield():!slotId;
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
	// done in cache_add/del
	//this._overall_delCache(); // clear cache for calling equipSlots
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
$pppp$.changeEquip=function(slotId,item,slotIdExt,noRefresh,noUpdateChase){
	//debug.log('Game_Actor.prototype.changeEquip');
	if(!(slotId>=0)) return null;
	let ori,ch=false;
	$gameTemp.____byChEqu=true;
	if(slotIdExt>=0){
		ori=this._equips[slotId][slotIdExt].object();
		if(ori!==item && this.tradeItemWithParty(item, ori) &&
			(!item || this.equipSlots()[slotId] === item.etypeId)
		){
			this._equipR_ch(slotId,slotIdExt,ori,item);
			if(!noRefresh) this.refresh();
			ch=true;
		}
	}else{
		ori=this._equips[slotId].object();
		if(ori!==item && this.tradeItemWithParty(item, ori) &&
			(!item || this.equipSlots()[slotId] === item.etypeId)
		){
			const c=this._equips_getCache(); if(c) c[slotId]=item;
			this._equips_editCache_del(ori);
			this._equips[slotId].setObject(item);
			this._equips_editCache_add(item);
			if(!noRefresh) this.refresh();
			ch=true;
		}
	}
	$gameTemp.____byChEqu=false;
	//this._equips_delCache();
	if(!noUpdateChase) this.updateChase(ori,item);
	return ori;
};
$pppp$.forceChangeEquip=function(slotId, item, slotIdExt){
	if(!(slotId>=0)) return;
	let ch=false,ori;
	if(slotIdExt>=0){
		const arr=this._equips[slotId];
		ori=arr[slotIdExt].object();
		if(ori!==item){
			this._equipR_ch(slotId,slotIdExt,ori,item);
			ch=true;
		}
	}else{
		const c=this._equips_getCache(); if(c) c[slotId]=item;
		ori=this._equips[slotId].object();
		if(ori!==item){
			this._equips_editCache_del(ori);
			this._equips[slotId].setObject(item);
			this._equips_editCache_add(item);
			ch=true;
		}
	}
	if(ch){
		//this._equips_delCache();
		this.releaseUnequippableItems(true);
		this.refresh(true);
		this.updateChase(ori,item);
	}
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
	let ch=false;
	if($dataSystem.equipTypes.meta.repeat[item.etypeId]){
		const slots=this.equipSlots();
		const slotId = slots.indexOf(item.etypeId);
		const slotIdExt=this.equips()[slotId].lastIndexOf(item);
		if(slotIdExt!==-1){
			const arr=this._equips[slotId];
			const ori=arr[slotIdExt].object(); // ===item
			this._equipR_ch(slotId,slotIdExt,ori,null);
			//this._equips_delCache();
			ch=true;
		}
	}else{
		const c=this.equips();
		const slotId = c.indexOf(item); // consider dual wield and more fleible methods (edit function 'equipSlots'), not using item.etypeId-1
		if(slotId!==-1){
			c[slotId]=null;
			const ori=this._equips[slotId].object(); /// item
			this._equips_editCache_del(ori);
			this._equips[slotId].setObject(null);
			ch=true;
		}
	}
	if(ch){
		this.updateChase(item);
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
$d$=$pppp$.clearEquipments=function f(kargs){
	kargs=kargs||f.tbl;
	const repeats=$dataSystem.equipTypes.meta.repeat;
	const slots=this.equipSlots();
	for(let i=slots.length;i--;){
		if(this.isEquipChangeOk(i)){
			if(repeats[slots[i]]){ if(kargs.preserveRepeats) continue;
				let arr=this._equips[i];
				while(arr.length>1) this.changeEquip(i, null, arr.length-2, true,true);
			}else this.changeEquip(i, null, undefined, true,true);
		}
	}
	this.refresh(true);
	this.updateChase();
};
$d$.tbl={preserveRepeats:false};
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
					this.changeEquip(i,top[0],x,true,true);
					if(--top[2]===0) h.pop();
				} }
				continue;
			}
			/*
			for(let x=0,xs=recnt[i];x!==xs;++x){ if(this.isEquipChangeOk(i,x)){
				//this.changeEquip(i, this.bestEquipItem(i),x);
				const top=h.top; if(top){
					this.changeEquip(i,top[0],x,true,true);
					if(--top[2]===0) h.pop();
				}
			} }
			*/
		}
	}
	this.refresh(true);
	this.updateChase();
};
$d$.cmp=(a,b)=>a[1]-b[1];
$d$.tbl={preserveRepeats:true};
($pppp$.fillEmptyEquipSlots=function f(){
	const slots=this.equipSlots();
	const maxSlotTypes = slots.length,repeats=$dataSystem.equipTypes.meta.repeat;
	const recnt=this._equips.map(x=>x&&x.constructor===Array&&x.length);
	for(let i=0;i!==maxSlotTypes;++i) if(!repeats[slots[i]]&&this.isEquipChangeOk(i)&&!this._equips[i]._itemId) this.changeEquip(i, this.bestEquipItem(i));
	for(let i=0,eall=$gameParty.equipItems();i!==maxSlotTypes;++i){
		if(!repeats[slots[i]]) continue;
		const etypeId=slots[i];
		const h=new Heap(f.cmp , eall.filter( item => item.etypeId === etypeId && this.canEquip(item) ).map(item=>[item,this.calcEquipItemPerformance(item),$gameParty.numItems(item)]) , true);
		const x=recnt[i]-1;
		if(this.isEquipChangeOk(i,x)){ const top=h.top; if(top){
			this.changeEquip(i,top[0],x,true,true);
			if(--top[2]===0) h.pop();
		} }
	}
	this.refresh(true);
	this.updateChase();
}).cmp=(a,b)=>a[1]-b[1];
$pppp$.refresh=function(noReleaseEquips,only){
	if(this.noRefresh) return this._needRefresh=true;
	if(!noReleaseEquips) this.releaseUnequippableItems(false);
	Game_Battler.prototype.refresh.call(this,0,only);
};
$pppp$.index=function(){
	const tmp=$gameTemp;
	if(!tmp._pt_allMembers_idSet.has(this._actorId)) return -1;
	const arrb=$gameParty.battleMembers(),arr=$gameParty.members();
	const idxb=tmp._pt_battleMembers_actor2idx.get(this);
	return arr.indexOf(this,idxb>=0?idxb:arrb.length);
};
$pppp$.isBattleMember=function(){
	const arr=$gameParty.battleMembers();
	return arr[$gameTemp._pt_battleMembers_actor2idx.get(this)]===this;
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
		const item=$dataSkills[skillId];
		if(arrangeLater){
			const c=this._skills_getCache();
			c.needArrange=true;
			c.add(skillId);
			c.s.byKey2_sum(item.tmapS);
			c.m.byKey2_mul(item.tmapP);
			if(!c.pendLearns) c.pendLearns=[];
			c.pendLearns.push(skillId);
			this._overall_delCache();
		}else{
			this._overall_delCache();
			this._skills_updateCache(); // maintain sorted
			this.updateChase(item);
		}
	}
};
$pppp$.forgetSkill=function(skillId){
	const index = this._skills.indexOf(skillId);
	if(index >= 0){
		this._skills.splice(index, 1);
		const item=$dataSkills[skillId],c=this._skills_getCache();
		if(c){
			c.delete(skillId);
			if(c.all && c.all[index] && c.all[index].id===skillId){ // this._skills first then added skills
				c.all.splice(index,1);
			}
			c.s.byKey2_del_sum(item.tmapS);
			c.m.byKey2_del_mul(item.tmapP);
			if(c.added && !c.added.has(skillId)){
				if(c.ts) c.ts.byKey2_del_sum(item.tmapS);
				if(c.tm) c.tm.byKey2_del_mul(item.tmapP);
			}
		}
		this._overall_delCache();
		this.updateChase(item);
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
$pppp$.clearStates=function(ignoreBuff){
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
		Game_Battler.prototype.clearStates.call(this,ignoreBuff);
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
$pppp$.paramPlus2=function(paramId){
	let rtv=0;
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
($d$=$pppp$.performAttack=function f(){
	const weapons = this.weapons();
	const attackMotion = weapons[0] && (weapons[0].weaponImg || $dataSystem.attackMotions[weapons[0].wtypeId]);
	const am2 = weapons[1] && (weapons[1].weaponImg || $dataSystem.attackMotions[weapons[1].wtypeId]);
	const m=attackMotion||am2;
	if(m){
		f.tbl[m.type] && this.requestMotion(f.tbl[m.type]);
		this.startWeaponAnimation(attackMotion?attackMotion.weaponImageId:0);
		this.startWeapon2Animation(am2?am2.weaponImageId:0);
	}
}).tbl=[ 'thrust' , 'swing' , 'missile' , ]; for(let x=64,arr=$d$.tbl;x--;) if(!arr[x]) arr[x]=undefined;
$pppp$.onPlayerWalk=function(){
	this.clearResult();
	this.checkFloorEffect();
	if($gamePlayer.isNormal()){
		this.turnEndOnMap();
		this.updateStatesSteps();
		this.showAddedStates();
		this.showRemovedStates();
	}
};
($pppp$.updateStatesSteps=function f(){
	for(let x=0,arr=this._states;x!==arr.length;++x) this.updateStateSteps(arr[x],f.tbl);
	for(let x=f.tbl.length;x--;) this.removeState(f.tbl[x]);
	f.tbl.length=0;
}).tbl=[];
$pppp$.updateStateSteps=function(stateId,laterStore){
	const s=$dataStates[stateId];
	if( (s.removeByWalking&&!(--this._stateSteps[stateId]>0)) || (s.autoRemovalTiming&&this.isStateExpired(stateId)) ){
		laterStore?laterStore.push(stateId):this.removeState(stateId);
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
($pppp$.getPlanObj=function f(idx){
	if(f.tbl){
		const tmp=this.getPlan(idx);
		return tmp&&(f.tbl[tmp[0]]||f.tbl._)[tmp[1]];
	}
	f.tbl={
		_:{},
		i: $dataItems,
		s: $dataSkills,
	};
	return f.apply(this,arguments);
}).tbl=undefined;
$pppp$.getPlanObjName=function(idx){
	const rtv=this.getPlanObj(idx);
	return rtv&&rtv.name;
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
		arr[sid]._databaseDel_state_all();
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
		const t=this._data[tid];
		if(t){
			t.clearCache();
			t._databaseDel_state_all();
		}
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
$pppp$._getGrayEdt=$r$._getGrayEdt;
$pppp$._getScaleEdt=$r$._getScaleEdt;
$pppp$._getAnchoryEdt=$r$._getAnchoryEdt;
Object.defineProperties($pppp$,{
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
($pppp$[$k$]=function f(eid,x,y){
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
				arr[x]=a.paramBase(x)+a.paramPlus(x)-this.paramBase(x);
			}
			this.recoverAll(true);
		}break;
		case undefined: break;
		}
		this._refActor=refActor;
	}
}).ori=$r$;
($pppp$._getTraits_native=function f(){
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
}).key=Game_BattlerBase.CACHEKEY_NATIVE;
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
($pppp$.makeDropItems=function f(){
	const rtv=[]; rtv.self=this;
	return this.enemy().dropItems.reduce(f.reduce,rtv);
}).reduce=(r,di)=>{ // TODO: merge same item, add amount info
	if (di.kind > 0 && Math.random() * di.denominator < r.self.dropItemRate()) {
		r.push(r.self.itemObject(di.kind, di.dataId));
	}
	return r;
};
($pppp$.itemObject = function f(kind, dataId){
	if(f.tbl) return (f.tbl[kind]||f.tbl._)[dataId];
	else f.tbl={
		1: $dataItems,
		2: $dataWeapons,
		3: $dataArmors,
		_:{},
	};
	return f.apply(this,arguments);
}).tbl=undefined;
$pppp$.performDamage=function(){
	Game_Battler.prototype.performDamage.call(this);
	SoundManager.playEnemyDamage();
	//this.requestEffect('blink');
};
$k$='selectAllActions';
$r$=$pppp$[$k$]; ($pppp$[$k$]=function f(actionList){
	if(this.getData().ai){
		const res=this.getData().ai.call(none,this,actionList);
		if(res){ for(let x=0,xs=this._actions.length;x!==xs;++x){
			this._actions.getnth(x).meta.targets=res[x];
		} }
	}else f.ori.call(this,actionList);
}).ori=$r$;
$pppp$=$aaaa$=undef;

// - Game_Troop
$aaaa$=Game_Troop;
$pppp$=$aaaa$.prototype;
$pppp$.getData=function(){
	return this.troop();
};
$pppp$.clear = function() {
	let tmp;
	this._interpreter.clear();
	this._itrpv=undefined;
	this._troopId = 0;
	if(tmp=this._eventFlags) tmp.length=0; else this._eventFlags=[];
	if(tmp=this._pendAlways){
		tmp.length=0;
		if(tmp.s) tmp.s.clear(); else tmp.s=new Set();
	}else (this._pendAlways=[]).s=new Set();
	if(tmp=this._enemies) tmp.length=0; else this._enemies=[]; 
	this._turnCount = 0;
	this._namesCount = {};
	this._trueEscape=false;
	this._escapeRatioFunc_txt=0;
	this._escapeRatioFunc=undefined;
	this._incKey=0;
	if($gameTemp._tp_key2e) $gameTemp._tp_key2e.clear(); else $gameTemp._tp_key2e=new Map(); 
};
$pppp$._setUKeys=function(){
	for(let x=0,arr=this._enemies;arr.length!==x;++x) $gameTemp._tp_key2e.set(arr[x]._ukey=arr[x]._ukey||++this._incKey,arr[x]);
};
$pppp$._addUKey=function(e){
	if(!$gameTemp._tp_key2e){ $gameTemp._tp_key2e=new Map(); this._setUKeys(); }
	$gameTemp._tp_key2e.set(e._ukey=e._ukey||++this._incKey,e);
};
$pppp$._rmUKey=function(e){
	const m=$gameTemp._tp_key2e;
	if(m) m.delete(e._ukey);
};
$pppp$.getViaUKey=function(key){
	if(!$gameTemp._tp_key2e){ $gameTemp._tp_key2e=new Map(); this._setUKeys(); }
	return $gameTemp._tp_key2e.get(key);
};
$r$=$pppp$.update;
($pppp$.update=function f(){
	return f.ori.apply(this,arguments);
}.ori=$r$);
$r$=$pppp$.setup;
($d$=$pppp$.setup=function f(id){
	f.ori.call(this,id);
	for(let x=0,xs=this.troop().pages.length;x!==xs;++x) this._eventFlags[x]=0;
	this._setUKeys();
	// meta // TODO
	const meta=this.getData().meta;
	this._trueEscape=!!meta.trueEscape;
}).ori=$r$;
$pppp$.addNew=function(e,dur,ox,oy){
	if(dur!==0) dur=dur||23;
	if(ox!==0) ox=ox||-64;
	if(oy!==0) oy=oy||Graphics._boxHeight>>1;
	const x=e._screenX,y=e._screenY;
	this._addUKey(e);
	this._enemies.push(e);
	const sc=SceneManager._scene;
	if(!sc||sc.constructor!==Scene_Battle) return;
	const sps=sc._spriteset,sp=new Sprite_Enemy(e);
	BattleManager.updateChase(e);
	sps._battleField.addChild(sp);
	sps._enemySprites.push(sp);
	sp.startMove(ox-x,oy-y,0);
	sp.startMove(0,0,dur);
	return e;
};
$pppp$.addEnemy=function(enemyId,x,y,dur,ox,oy){
	if(!$dataEnemies[enemyId]) return;
	x=x||0; y=y||0;
	return this.addNew(new Game_Enemy(enemyId,x,y),dur,ox,oy);
};
$pppp$.remove=function(e){
	{ const idx=this._enemies.indexOf(e);
	if(idx===-1) return;
	this._rmUKey(e);
	this._enemies.splice(idx,1);
	}
	const sc=SceneManager._scene;
	if(!sc||sc.constructor!==Scene_Battle) return;
	const sps=sc._spriteset;
	{ const idx=sps._enemySprites.findIndex(x=>e===x._battler);
	if(idx===-1) return;
	sps._battleField.removeChild(sps._enemySprites.splice(idx,1)[0]);
	}
	BattleManager.updateChase(e,true);
	e.clearCache();
};
($pppp$.updateParallel=function f(){
	if(!this._itrpv) this.troop().pages.forEach(f.forEach,this._itrpv=[]);
	for(let x=0,arr=this._itrpv,pgs=this.troop().pages;x!==arr.length;++x){
		const i=arr[x].tpgid;
		if(!arr[x].isRunning() && this.meetsConditions(pgs[i])){
			arr[x].setup(pgs[i].list);
			arr[x]._pageId=i;
		}
		arr[x].update();
	}
}).forEach=function(pg,i){
	if(!pg.parallel) return;
	const tmp=new Game_Interpreter;
	tmp.tpgid=i;
	this.push(tmp);
};
$k$='meetsConditions';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(page,c){
	if(BattleManager.isBattleEnd()) return (c||page.conditions).btlEnd;
	return f.ori.call(this,page,c);
}).ori=$r$;
($pppp$.setupBattleEvent=function f(){
	const itrp=this._interpreter;
	if(!itrp.isRunning()){
		if(itrp.setupReservedCommonEvent()) return;
		const pgs = this.troop().pages ;
		itrp._pageId=undefined;
		for(let p=0;p!==pgs.length;++p){
			if(!this._eventFlags[p] && this.meetsConditions(pgs[p])){
				itrp.setup(pgs[p].list);
				itrp._pageId=p;
				if(pgs[p].span <= 1) this._eventFlags[p]=true;
				break;
			}
		}
		const arr=this._pendAlways; if(!arr.s) arr.s=new Set(arr);
		if(itrp._pageId>=0){
			const beAlways = pgs[itrp._pageId] && pgs[itrp._pageId].always && itrp._pageId ;
			if(beAlways>=0){
				arr.s.add(beAlways);
				arr.push(beAlways);
			}
		}else{
			arr.s.clear();
			arr.forEach(f.forEach,this._eventFlags);
			arr.length=0;
		}
	}
}).forEach=function(i){ this[i]=false; };
$pppp$=$aaaa$=undef;

if(window.Scenen_Debug) window.Scenen_Debug=undefined;

// window

// - base
$aaaa$=Window_Base;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(x,y,w,h){
	// create obj key
	if(!this._actor) this._actor=undefined;
	this.fontSize=this.standardFontSize();
	
	const noRefreshArrows=this._noRefreshArrows||undefined;
	this._noRefreshArrows=true;
	
	this._updateCtr=0;
	
	f.ori.call(this,x,y,w,h);
	
	this._noRefreshArrows=noRefreshArrows;
	this._refreshArrows(); // reduce dup calls
	
	this.adjLrArrows=undefined;
	this._iconloop=undefined;
	this.clearFadeEffect();
}).ori=$r$;
$r$=$pppp$.update;
($d$=$pppp$.update=function f(){
	//this._rmAllIconSprite(); // TODO: use sprites to draw icons
	++this._updateCtr; this._updateCtr&=0x3FFFFFFF;
	if(this._iconloop){
		for(let x=0,arr=this._iconloop;x!==arr.length;++x){
			const info=arr[x]; if(this._index===info[5]) f.forEach.call(this,info,x);
		}
	}
	f.ori.call(this);
}).ori=$r$;
$d$.forEach=function(info,index){
	const icons=info[0];
	if(!(--info[4]>0)){
		++info[3];
		const idx=(info[3]%=icons.length);
		info[4]=icons[idx][1];
		this.drawLoopIcon(index);
	}
};
$k$='updateOpen';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	if(this._fadingIn){
		this.openness=256;
		if(!this._fadeEffect || !(( this.alpha=( this._fadeEffect_open+=this._fadeEffect_open<this._fadeEffect[0] )/this._fadeEffect[0]||0 )<1)){
			this._fadingIn=false;
			this.alpha=1;
		}
	}
	f.ori.call(this);
}).ori=$r$;
$k$='updateClose';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	if(this._fadingOut){
		this._closing=false;
		if(!this._fadeEffect || !((this.alpha=(this._fadeEffect[1] - (this._fadeEffect_close+=this._fadeEffect_close<this._fadeEffect[1]))/this._fadeEffect[1]||0)>0)){
			this._fadingOut=false;
			this.openness=0;
			this.alpha=1;
			this.clearFadeEffect();
		}
	}
	f.ori.call(this);
}).ori=$r$;
$r$=$pppp$.open;
($pppp$.open=function f(){
	f.ori.call(this);
	if(this._fadeEffect && this._fadeEffect_open<this._fadeEffect[0] && this._fadeEffect[0]>0){
		this._fadingIn=true;
		this._fadeEffect_open=this.isOpen()?~~(this.alpha*this._fadeEffect[0]+0.5||0):0;
	}else this.alpha=1;
	this._fadeEffect_close=(this._fadingOut=false)|0;
}).ori=$r$;
$r$=$pppp$.close;
($pppp$.close=function f(){
	f.ori.call(this);
	if(this._fadeEffect && this._fadeEffect_close<this._fadeEffect[1] && this._fadeEffect[1]>0){
		this._fadingOut=true;
		this._fadeEffect_close=~~((1-this.alpha)*this._fadeEffect[1]+0.5||0);
	}else this.alpha=1;
	this._fadeEffect_open=(this._fadingIn=false)|0;
}).ori=$r$;
$pppp$.clearFadeEffect=function(){
	this._fadeEffect=undefined;
	this._fadeEffect_close=this._fadeEffect_open=0;
	//this._fadingIn=this._fadingOut=false;
};
($pppp$.clearLoopIcon=function f(){
	const ws=this.subWindows();
	if(ws) ws.forEach(f.forEach);
	f.forEach(this);
}).forEach=w=>w._iconloop && (w._iconloop.length=0);
($d$=$pppp$.drawLoopIcon=function f(idx){
	if(this._iconloop && this._iconloop.length){
		if(idx===undefined) this._iconloop.forEach(f.forEach,this);
		else f.forEach.call(this,this._iconloop[idx]);
	}
}).forEach=function f(info){
	const icons=info[0] , idx=info[3];
	f.tbl.x=info[1];
	f.tbl.y=info[2];
	this.processDrawIcon(icons[idx][0],f.tbl);
};
$d$.forEach.tbl={x:0,y:0};
if(0)$pppp$.refresh=SceneManager._addRefresh; // not all things have: refresh_do
$pppp$.drawActorFace=function(actor, x, y, width, height){
	this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
	const iconw=Window_Base._iconHeight+1;
	x+=Window_Base._faceWidth;
	const _meta=actor._meta;
	if(_meta){
		const icon=$dataCustom.icon;
		if(_meta.leaveAtBattleEnd){
			x-=iconw;
			this.drawIcon(icon.leaveAtBattleEnd,x,y);
		}
		if(_meta.isClone){
			x-=iconw;
			this.drawIcon(icon.isClone,x,y);
		}
	}
};
$pppp$.drawActorIcons=function(actor, x, y, width){
	width = width || 144;
	const ty=y+2 , w_4=(Window_Base._iconWidth>>2) , w_4_3=(Window_Base._iconWidth>>1)+(Window_Base._iconWidth>>2) , fs=this.contents.fontSize ;
	const stats=actor.states_noSlice() , statExtra=actor._statesExtra();
	const fs2=(fs>>1)+(fs>>3)+(fs>>4) , iconsLen=stats.length+statExtra.size+actor.buffCnt() , rect=new Rectangle(x,ty,width,Window_Base._iconHeight) ;
	this.contents.clearRect(rect.x,rect.y,rect.width,rect.height);
	const iconsWidth=iconsLen*Window_Base._iconWidth;
	this.changeTextColor( this.iconStackTextColor() );
	let tx=x;
	{
		let m=this._needRedrawIconsMap; if(!m) m=this._needRedrawIconsMap=new Map();
		if(width<iconsWidth){
			const wait=120;
			const M=~~((wait<<1)+Window_Base._iconWidth-width+iconsWidth);
			let r=~~(this._updateCtr%M); // the empty one
			if(r+wait<M) r-=wait;
			else r=M-(wait<<1);
			if(r>0) tx-=r;
			m.set(actor,[x,y,width,]);
		}else m.delete(actor);
	}
	
	// states
	for(let i=0,sz=stats.length;i!==sz;++i){
		const stat=stats[i];
		if(this.drawIcon(stat.iconIndex,tx,ty,rect) && stat.autoRemovalTiming){
			this.setFontsize(fs2);
			this.drawText(actor._stateTurns[stat.id],tx+2,ty+(Window_Base._iconHeight-this.lineHeight()),Window_Base._iconWidth,undefined,rect);
			this.setFontsize(fs);
		}
		tx+=Window_Base._iconWidth;
	}
	
	// statesExtra
	statExtra.forEach((v,k)=>{
		const stat=$dataStates[k]; if(!(v>0)) return;
		if(this.drawIcon(stat.iconIndex,tx,ty,rect) && stat.autoRemovalTiming){
			//this.setFontsize(fs2);
			//this.drawText('x'+v,tx+w_4,ty-2,w_4_3,'right',rect);
			//this.setFontsize(fs);
		}
		tx+=Window_Base._iconWidth;
	});
	
	// buffs
	{
		const arr=actor._buffs;
		for(let i=0,ti=stats.length;i!==arr.length;++i){
			if(arr[i]){
				if(this.drawIcon(actor.buffIconIndex(arr[i],i),tx,ty,rect)){
					this.setFontsize(fs2);
					this.drawText('x'+(arr[i]<0?-arr[i]:arr[i]),tx+w_4,ty-2,w_4_3,'right',rect);
					this.drawText(actor._buffTurns[i],tx+2,ty+(Window_Base._iconHeight-this.lineHeight()),w_4_3,undefined,rect);
					this.setFontsize(fs);
				}
				tx+=Window_Base._iconWidth;
				++ti;
			}
		}
	}
	//rect.width+=Window_Base._iconWidth; // in case text blurred when scrolling
	this.drawIcon(-1,tx,ty,rect); // empty
	this.resetTextColor();
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
$pppp$.drawItemName=function(item, x, y, width){
	width = width || 312;
	if(item){
		const iconBoxWidth = Window_Base._iconWidth + 4;
		const clr = this._actor && item.condColor && item.condColor.call(none,this._actor,item);
		if(clr) this.changeTextColor(clr);
		else this.resetTextColor();
		this.drawIcon(item.iconIndex, x + 2, y + 2);
		
		let omit=0,printed=item.name[0]==='\\';
		if(printed){ omit=2; switch(item.name[1]){
		case 'E':{
			this.drawTextEx(item.name.slice(omit), x + iconBoxWidth, y, width - iconBoxWidth);
		}break;
		default: omit=1;
		case '-':
			printed=false;
		break;
		} }
		if(!printed) this.drawText(omit?item.name.slice(omit):item.name, x + iconBoxWidth, y, width - iconBoxWidth);
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
	text = text.replace(f.re_actor, f.f_actor);
	text = text.replace(f.re_enemy, f.f_enemy);
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
$d$.re_actor=/\x1bactor\[(\d+)\]/g;
$d$.f_actor=function(){ return "\x1bRGB["+$dataCustom.textcolor.actor+"]"+$dataActors[arguments[1]].name+"\x1bRGB["+$dataCustom.textcolor.default+"]"; };
$d$.re_enemy=/\x1benemy\[(\d+)\]/g;
$d$.f_enemy=function(){ return "\x1bRGB["+$dataCustom.textcolor.actor+"]"+$dataEnemies[arguments[1]].name+"\x1bRGB["+$dataCustom.textcolor.default+"]"; };
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
$t$=($d$=$pppp$.processEscapeCharacter=function f(code, textState){
	// upper case str
	const func=f.tbl.get(code);
	if(func) func.call(this,f,textState);
}).tbl=new Map([
	['E',none],
	['-',none],
	['MINOR', function(f,textState){
		if(this.constructor===Window_Message) this.printMinor=true;
	}],
	['ICONLOOP', function(f,textState){
		let res = f.re_iconloop.exec(textState.text.slice(textState.index));
		if(!res) return;
		textState.index += res[0].length;
		res=JSON.parse(res[1]+']');
		if(!res.length) return;
		if(res.length>1){
			if(!this._iconloop) this._iconloop=[];
			this._iconloop.push([res,textState.x,textState.y,0,res[0][1],this._drawingIdx]);
		}
		this.processDrawIcon(res[0][0], textState);
	}],
	['RGB', function(f,textState){
		let res = f.re.exec(textState.text.slice(textState.index));
		if(res){
			textState.index += res[0].length;
			res=res[0].slice(1,-1);
		}
		this.changeTextColor(res||$dataCustom.textcolor.default);
	}],
	['L', function(f,textState){ this.inaline=true; }],
	['R', function(f,textState){ this.inaline=false; }],
	['C', function(f,textState){
		this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
	}],
	['I', function(f,textState){
		this.processDrawIcon(this.obtainEscapeParam(textState), textState);
	}],
	['{', function(f,textState){
		this.makeFontBigger();
	}],
	['}', function(f,textState){
		this.makeFontSmaller();
	}],
]);
$t$.set('RGBA',$t$.get('RGB'));
$t$=undef;
$d$.re=/^\[((rgba\((\d+,){3}[01](\.\d+)?\))|(#[0-9A-Fa-f]{6}))\]/;
$d$.re_iconloop=/^(\[\[-?[0-9]+,[0-9]+\](,\[-?[0-9]+,[0-9]+\])*),?\]/;
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
($pppp$[$k$]=function f(x,y,w,h){
	f.ori.call(this,x,y,w,h);
	// create member
	if(this._maxCols===undefined) this._maxCols=undefined;
	if(this._drawingIdx===undefined) this._drawingIdx=undefined;
}).ori=$r$;
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
		if(this.rightArrowVisible || this.leftArrowVisible) this.processWheelH();
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
$pppp$.processWheel=function(){
	const threshold = 20;
	if(TouchInput.wheelY >= threshold){
		this.scrollDown();
	}
	else if(TouchInput.wheelY <= -threshold){
		this.scrollUp();
	}
};
$pppp$.processWheelH=function(){
	const threshold = 20;
	if(TouchInput.wheelX >= threshold){
		this.cursorRight();
	}
	else if(TouchInput.wheelX <= -threshold){
		this.cursorLeft();
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
($pppp$[$k$]=function f(){
	const maxItems=this.maxItems();
	if(this._lastScrollY===this._scrollY && this._lastLineHeight===this._lineHeight && this._lastMaxItems===maxItems) return;
	this._lastScrollY=this._scrollY;
	this._lastLineHeight=this._lineHeight; // ignore case: device changed during the game
	this._lastMaxItems=maxItems;
	f.ori.call(this);
}).ori=$r$;
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
($pppp$.onTouch=$pppp$._onTouch_iw=function f(triggered,iw){ // "interact window" is a selectable
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
}).ori=$r$;
$pppp$.processTouchOutsideFrame=none;
$pppp$.refresh_do=function(){
	if(this.clearContents()) this.drawAllItems();
};
$pppp$.refresh=SceneManager._addRefresh;
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
($pppp$.processOk=function f(){
	if(this._lastScrollYs) this._itemWindow._scrollY=this._lastScrollYs[this._index]^0;
	if(this._lastIdxs){
		this._itemWindow.trimSel(this._lastIdxs[this._index]^0);
		this._itemWindow.refresh();
	}
	f.ori.call(this);
}).ori=$r$;
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
($pppp$[$k$]=function f(noSound){
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
}).ori=$r$;
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
($pppp$.setCategory=function f(catKey){ // rewrite: return true if updated else false; use last scrollY;
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
}).tbl=new Set([Scene_Item]);
$k$='selectLast';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	if(this._index>=0) ; else f.ori.call(this);
}).ori=$r$;
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
		if(!objs.confs.hideLearnableSkills){ for(let x=0,arr=this._actor.currentClass().learnings;x!==arr.length;++x){
			// maybe not learn skills well, so still iterate all
			const id=arr[x].skillId;
			if(c.has(id)) continue;
			if(this.includes($dataSkills[id])) rtv.push(arr[x]);
		} }
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
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this._msg2=new Window_Message2();
	this._subWindows=[
		this._goldWindow, 
		this._choiceWindow, 
		this._numberWindow, 
		this._itemWindow, 
		this._msg2, 
	];
}).ori=$r$;
$k$='onEndOfText';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	this.inaline=false;
}).ori=$r$;
if(0){$k$='doesContinue';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	const rtv=f.ori.call(this);
	if(rtv){
		this._fadingOut=false;
	}
	return rtv;
}).ori=$r$;
}
$r$=$pppp$.newPage;
($pppp$.newPage=function f(txtstat){
	this.clearLoopIcon();
	f.ori.call(this,txtstat);
}).ori=$r$;
$r$=$pppp$.update;
($pppp$.update=function f(){
	let fr=this.faceRef;
	if(fr && this.faceRef_updateID!==fr.texture._updateID){
		if(fr._character) this._drawFaceFromData(fr._character._genFaceData(fr));
	}
	return f.ori.call(this);
}).ori=$r$;
$k$='startMessage';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
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
	if(this._fadingOut || !isNone($gameMessage._fadeEffect)){
		this._fadeEffect=$gameMessage._fadeEffect;
		$gameMessage._fadeEffect=undefined;
	}
	return f.ori.call(this);
}).ori=$r$;
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
($pppp$[$k$]=function f(){
	const op=this._opening;
	f.ori.call(this);
	if(this._opening===false && this._nameField && this._nameField.enabled){
		this._nameField.alpha=1; // must be run: when it is another person talking in the seq. of msg.
		if(op) this._moveTxtInput();
	}
	return this._opening;
}).ori=$r$;
$k$='updateClose';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	if(this._closing && this._nameField) this._nameField.alpha=0;
	f.ori.call(this);
	return this._closing;
}).ori=$r$;
$k$='terminateMessage';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	if(this._nameField!==undefined){
		//this.removeChild(this._nameField);
		//this._nameField.contents.clear();
		this._nameField.enabled=0;
	}
	return f.ori.call(this);
	//delete Input._currentState['ok'];
}).ori=$r$;
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
($pppp$[$k$]=function f(){
	if($gameMessage.faceIndex()==="data") return; // ensurance
	return f.ori.call(this);
}).ori=$r$;
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
($pppp$[$k$]=function f(){
	this._historyLines=[];
	this._lines=[];
	f.ori.call(this);
	this._methods=new Queue();
	this._historyNumLines=new Queue();
	this._fc=22;
	this._lastNumLines=undefined;
	this._maxLines=this.maxLines();
	this._mode=undefined;
}).ori=$r$;
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
($pppp$.update=function f(){
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
}).ori=$r$;
$pppp$.skipMeta=function(){
	//let rtv=0;
	for(let q=this._methods,c,n;q.length&&(n=(c=q.front).name)[0]==="-";q.shift()){
		if(n[1]==='s' && n[2]==='e' && n[3]==='t' && n[4]==='_'){ switch(n.slice(5)){
		case 'doMore':
			this._doMore=true;
		break;
		case 'doOne':
			this._doMore=false;
		break;
		case 'break':
			q.shift();
			return;
		break;
		} }
		//++rtv;
	}
	//return rtv;
};
$pppp$.callNextMethod=function(){
	this.skipMeta();
	do{
		if(this._methods.length){
			let method = this._methods.shift();
			if(method.name && this[method.name]){
				this[method.name].apply(this, method.params);
			}else throw new Error('Method not found: ' + method.name);
		}
		this.skipMeta();
	}while(this._doMore);
};
$pppp$.none=none;
$r$=$pppp$.addText;
($pppp$.addText=function f(txt){
	this._historyLines.push(txt);
	f.ori.call(this,txt);
}).ori=$r$;
$pppp$.popBaseLine=function(){
	const baseLine = this._baseLineStack.pop();
	if(this._lines.length>baseLine) this._lines.length=baseLine;
};
// Window_BattleLog.prototype.popupDamage
$k$='showAnimation';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(subject, targets, animationId, item){
	if(_global_conf.noAnimation) return;
	const p=Game_Action.prototype;
	const item2=p.getSelfItemObj(item);
	if(item2!==false){
		this._aniSubject=subject;
		this._aniSelfAniId = p.canForSelf(item2) ? item2.animationId : undefined;
	}else this._aniSubject=undefined;
	f.ori.call(this, subject, targets, animationId);
}).ori=$r$;
($pppp$.showNormalAnimation=function f(targets, animationId, mirror) {
	if($dataAnimations[animationId]){
		let delay = this.animationBaseDelay();
		let nextDelay = this.animationNextDelay();
		targets.forEach(target=>{
			if(this._aniSubject===target){
				if(this._aniSelfAniId<0){
					if(target.isActor()){ let aniId;
						f.tbl.forEach(k=>{ aniId=target[k](); if($dataAnimations[aniId]) target.startAnimation( aniId , mirror , delay ); });
					}else{ // TODO: when refActor
					}
				}else{
					if($dataAnimations[this._aniSelfAniId]) target.startAnimation( this._aniSelfAniId , mirror, delay);
				}
			}else target.startAnimation( animationId , mirror , delay);
			delay += nextDelay;
		});
	}
}).tbl=[1,2].map(v=>'attackAnimationId'+v);
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
	if(!this.visible) return;
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
$pppp$.refresh=SceneManager._addRefresh;
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
$pppp$.displayRegeneration=function(subject){
	const r=subject._result;
	if(r.hpDamage||r.mpDamage){
		subject.pushActResQ(r);
		r.mpDamage=r.hpDamage=0;
		this.push('popupDamage', subject);
	}
};
$pppp$.displayAction=function(subject, item) {
	const numMethods = this._methods.length;
	if(DataManager.isSkill(item)){
		const arg0=(item.message1||item.message2)&&"\\skill["+item.id+"]";
		if(item.message1) this.push('addText', subject.name() + item.message1.format(arg0));
		if(item.message2) this.push('addText', item.message2.format(arg0));
	}else this.push('addText', TextManager.useItem.format(subject.name(), "\\item["+item.id+"]"));
	if(this._methods.length === numMethods) this.push('wait');
};
$pppp$.displayCounter=function(s,t){
	this.push('performCounter', s);
	this.push('addText', TextManager.counterAttack.format(s.name(),t.name()));
};
$d$=$pppp$.displayActionResults=function f(subject,target,action,isInstShowMsg){
	if(target.result().used){
		this.push('-actResStrt');
		if(isInstShowMsg) this.push('-set_doMore');
		if(this.isRepeatedAnimationAction(action)) this.push('showAnimation', subject, [target], action.item().animationId);
		this.displayCritical(target);
		if(subject!==target) this.push('popupDamage', target);
		this.push('popupDamage', subject);
		this.displayDamage(target);
		this.displayAffectedStatus(target);
		this.displayFailure(target);
		if(isInstShowMsg) this.push('-set_doOne');
		this.push('-actResEnde');
		if(!isInstShowMsg&&_global_conf.chasePopAfterFrame) this.push('-set_break');
	}
};
($pppp$.displayActionChaseResults=function f(subject,target,action){
	if(target.result().used){
		this.push('-actChaseResStrt');
		this.push('-set_doMore');
		{ const item=action.item(),logs=$dataCustom.battle.logs;
		this.push('addText', (item.scope?logs.chaseAim:logs.chase).format(subject.name(),target.name(),f.tbl[item.itemType]+item.id+']') );
		}
		// lag
		//if(this.isRepeatedAnimationAction(action)) this.push('showAnimation', subject, [target], action.item().animationId);
		this.displayCritical(target);
		if(subject!==target) this.push('popupDamage', target);
		this.push('popupDamage', subject);
		this.displayDamage(target);
		this.displayAffectedStatus(target);
		this.displayFailure(target);
		this.push('-set_doOne');
		//this.push('none');
		this.push('-actChaseResEnde');
		if(_global_conf.chasePopAfterFrame) this.push('-set_break');
	}
}).tbl={
	//'a':"\\armor[",
	'i':"\\item[",
	's':"\\skill[",
	//'w':"\\weapon[",
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
$pppp$.displayDrained=function(subject,target){
	// // const res=target.result();
	//const v=res.hpDamage+res.mpDamage+res.tpDamage+res.stpDamage;
};
($pppp$.displayRemovedStates=function f(target){
	f.forEach.msg4=false;
	f.forEach._=this;
	f.forEach.n=target.name();
	target.result().removedStateObjects().forEach(f.forEach);
}).forEach=function f(stat){
	if(stat.message4){
		if(!f.msg4){
			f.msg4=true;
			f._.push('popBaseLine');
			f._.push('pushBaseLine');
		}
		f._.push('addText', f.n + stat.message4);
	}
};
$pppp$.makeHpDamageText=function(target){
	const res = target.result() , isActor = target.isActor();
	const v = res.hpDamage , k=TextManager.hp;
	if(v>0){
		if(res.drain) return (isActor ? TextManager.actorDrain : TextManager.enemyDrain) . format(target.name(), k, v);
		else return (isActor ? TextManager.actorDamage : TextManager.enemyDamage) . format(target.name(), v);
	}else if (v < 0 || v===0 && res.recover) return (isActor ? TextManager.actorRecovery : TextManager.enemyRecovery) . format(target.name(), k, -v);
	else return (isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage) . format(target.name());
};
$pppp$._makeNotHpDamageText=function(target,k){
	const res = target.result() , isActor = target.isActor();
	const v = res.mpDamage;
	if(v>0){
		if(res.drain) return (isActor ? TextManager.actorDrain : TextManager.enemyDrain) . format(target.name(), k, v);
		else return (isActor ? TextManager.actorLoss : TextManager.enemyLoss) . format(target.name(), k, v);
	}else if (v < 0 || v===0 && res.recover) return (isActor ? TextManager.actorRecovery : TextManager.enemyRecovery) . format(target.name(), k, -v);
	else return '';
};
$pppp$.makeMpDamageText=function(target){ return this._makeNotHpDamageText(target,TextManager.mp); };
$pppp$.makeTpDamageText=function(target){ return this._makeNotHpDamageText(target,TextManager.tp); };
$pppp$.makeStpDamageText=function(target){ return this._makeNotHpDamageText(target,$dataCustom.stp); };
$pppp$=$aaaa$=undef;

// - Window_PartyCommand;
$aaaa$=Window_PartyCommand;
$pppp$=$aaaa$.prototype;
$k$='makeCommandList';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	this.addCommand(TextManager.fight,	'fight');
	this.addCommand(TextManager.formation,	'swap');
	this.addCommand($dataCustom.plan.use,	'usePlan');
	this.addCommand($dataCustom.battle.allAtk,	'allAtk');
	this.addCommand($dataCustom.battle.allGuard,	'allGuard');
	this.addCommand($dataCustom.battle.allSpaceout,	'allSpaceout');
	this.addCommand($dataCustom.battle.viewLog,	'viewLog');
	this.addCommand(TextManager.escape,	'escape', BattleManager.canEscape());
}).ori=$r$;
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
$pppp$=$aaaa$=undef;

// - Window_BattleEnemy
$aaaa$=Window_BattleEnemy;
$pppp$=$aaaa$.prototype;
$pppp$.refresh=function(){
	this._enemies = $gameTroop.members();
	Window_Selectable.prototype.refresh.call(this);
};
$pppp$.isCurrentItemEnabled=function(idx){
	const i=idx===undefined?this._index:idx;
	// for skills affecting dead enemies in future 
	const trgt=this._enemies && this._enemies[i];
	{ const act=BattleManager.inputtingAction(); if(act){
		const filter=act.getItemFilter();
		if(filter) return filter(trgt,act.subject());
	} }
	return trgt && !trgt.isHidden() && !trgt.isDeathStateAffected();
};
$pppp$.drawItem=function(index){
	this.changePaintOpacity(this.isCurrentItemEnabled(index));
	const rect = this.itemRectForText(index);
	this.drawText(this._enemies[index].name(), rect.x, rect.y, rect.width);
};
$pppp$.show=function(idx){
	if(idx===undefined) idx=this._action && this._action.subject()._lastTargetIndex;
	this.refresh();
	this.select(idx|0);
	Window_Selectable.prototype.show.call(this);
};
$pppp$=$aaaa$=undef;

// - command
$aaaa$=Window_Command;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(x, y, kargs) {
	for(let i in kargs) this[i]=kargs[i];
	return f.ori.call(this,x,y);
}).ori=$r$;
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
	if(this._list[index] && this._list[index].once) this.contents.textColor=$dataCustom.textcolor.keyword; // egg
	else this.resetTextColor();
	this.changePaintOpacity(this.isCommandEnabled(index));
	const txt=this.commandName(index);
	let omit=0,printed=txt[0]==='\\';
	if(printed){ omit=2; switch(txt[1]){
	case 'E':{
		this.drawTextEx(txt.slice(omit), rect.x, rect.y);
	}break;
	default: omit=1;
	case '-':
		printed=false;
	break;
	} }
	if(!printed) this.drawText(omit?txt.slice(omit):txt, rect.x, rect.y, rect.width, align);
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
$k$='initialize';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(ln){
	f.ori.call(this,ln);
	// options
	this._shwait1=60; // >=0
	this._shwait2=120; // >=0
	this._shspeed=1; // >=0
	// gen property
	this._shM=0;
	this._shbfc=0;
	this._shwait2ed=false;
	this._forceRefresh=false;
}).ori=$r$;
$pppp$.setText=function(txt){
	if(this._text !== txt){
		this._text=txt;
		this.clearLoopIcon();
		this._shM=0;
		this._shbfc=0;
		this._shwait2ed=false;
		this._forceRefresh=true;
		this.refresh();
	}
};
$r$=$pppp$.update;
($pppp$.update=function f(){
	f.ori.call(this);
	if(this._shM>0){
		const fc=Graphics.frameCount;
		if(fc!==this._lastfc){
			this._shbfc=fc-this._strtfc-this._shwait1;
			if( this._shbfc>0 && (!this._shwait2ed || (this._shbfc-this._shwait2)*this._shspeed>=this._shM) ){
				this._forceRefresh=true;
				this.refresh();
			}
		}
	}
}).ori=$r$;
$pppp$.redrawtxt=function(){
	if(!this.contents) return;
	this.createContents();
	const fc=Graphics.frameCount;
	let reset=false;
	if(this._shM>0){
		let shx=this._shbfc;
		if(shx>0) shx*=this._shspeed;
		else shx=0;
		if(this._shM<shx){
			if(this._shwait2ed){
				if(this._shwait2*this._shspeed+this._shM<=shx){
					this._shwait2ed=false;
					reset=true;
				}
				shx=0;
			}else{
				this._shwait2ed=true;
				shx=this._shM+1;
			}
		}
		if(shx>0) this.drawTextEx(this._text, this.textPadding()-~~shx, 0);
	}else reset=true;
	if(reset){
		const pad=this.textPadding();
		this._measuredWidth=pad+~~this.drawTextEx(this._text, pad, 0);
		this._shM=this._measuredWidth-this.contentsWidth();
		this._strtfc=fc;
	}
	this._lastfc=fc;
};
$pppp$.refresh_do=function(){
	if(!this.visible || !this._forceRefresh) return;
	this._forceRefresh=false;
	this.redrawtxt();
};
$pppp$.refresh=SceneManager._addRefresh;
$pppp$=$aaaa$=undef;

// - Window_BattleStatus
$aaaa$=Window_BattleStatus;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.update;
($pppp$.update=function f(){
	f.ori.call(this);
	// redraw scrolling icons
	const m=this._needRedrawIconsMap;
	if(m && m.size){
		this._refreshIconsOnly=true;
		SceneManager._addRefresh.call(this);
	}
}).ori=$r$;
$d$=$pppp$.refresh_do=function f(){
	if(this.noRefresh || !this.visible) return;
	
	if(this._refreshAll){
		this._refreshAll=false;
		const m=this._needRedrawIconsMap;
		if(m) m.clear();
		if(BattleManager._phase===f.key){
			let idx=$gameTemp._pt_battleMembers_actor2idx.get(BattleManager._subject);
			if(idx!==undefined && this._index!==idx) this.select(idx);
		}
		if(this.clearContents()) this.drawAllItems();
		return;
	}
	if(this._refreshIconsOnly){
		this._refreshIconsOnly=false;
		const m=this._needRedrawIconsMap;
		if(m && m.size){
			const outOfViews=[];
			m.forEach((v,k)=>this.drawActorIcons(k,v[0],v[1],v[2]));
		}
	}
};
$d$.key="action";
$pppp$.refresh=function f(){
	this._refreshAll=true;
	SceneManager._addRefresh.call(this);
};
$k$='drawBasicArea';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(r,a){
	if(a.stp!==undefined){
		const w=r.width>>2;
		r.width-=w;
		this.drawActorStp(a, r.x+r.width, r.y, w);
	}
	f.ori.call(this,r,a);
}).ori=$r$;
$pppp$=$aaaa$=undef;

// - Window_BattleActor
$aaaa$=Window_BattleActor;
$pppp$=$aaaa$.prototype;
$pppp$.numVisibleRows=function(){
	return ~~((Graphics.boxHeight - (this.standardPadding()<<1)) / this.lineHeight());
};
$r$=$pppp$.drawItem;
($pppp$.drawItem=function f(idx){
	Window_MenuActor.prototype.drawItemBackground.call(this,idx);
	f.ori.call(this,idx);
}).ori=$r$;
$pppp$.isCurrentItemEnabled=function(){
	if(this._mode!=='s'){ const act=BattleManager.inputtingAction();
	if(act){
		const filter=act.getItemFilter();
		if(filter) return filter(this.actor(),act.subject());
	}
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
($pppp$[$k$]=function f(){ // overwrite for efficiency
	if ($dataSystem.menuCommands[5]) {
		let enabled = this.isSaveEnabled();
		this.addCommand(TextManager.save, 'save', enabled);
	//	this.addCommand($dataCustom.saveLocal,    'saveLocal', enabled);
		this.addCommand($dataCustom.optSave.name, 'saveOpts',  enabled);
	//	this.addCommand($dataCustom.saveOnline,   'saveOnline', enabled);
	}
}).ori=$r$;
$pppp$.addOnceCommand=function(){
	if(sha256(window['/tmp/']&&window['/tmp/'].V_I_M||'')==="0x321B146E4F257B81015ADF9BC4E84852334D134B27470E079838364188864AED"){
		this.addCommand('Visit It', 'gifts');
		this._list.back.once=1; // egg
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
$r$=$pppp$.update;
($pppp$.update=function f(){
	f.ori.call(this);
	const m=this._needRedrawIconsMap;
	if(m && m.size){
		this._refreshIconsOnly=true;
		SceneManager._addRefresh.call(this);
	}
}).ori=$r$;
$r$=$pppp$.refresh_do;
($pppp$.refresh_do=function f(){
	if(!this.visible) return;
	if(this._refreshAll){
		this._refreshAll=false;
		const m=this._needRedrawIconsMap;
		if(m) m.clear();
		return f.ori.call(this);
	}
	if(this._refreshIconsOnly){
		this._refreshIconsOnly=false;
		const m=this._needRedrawIconsMap;
		if(m && m.size){
			const outOfViews=[];
			m.forEach((v,k)=>this.drawActorIcons(k,v[0],v[1],v[2]));
		}
	}
}).ori=$r$;
$r$=$pppp$.refresh;
($pppp$.refresh=function f(){
	this._refreshAll=true;
	f.ori.call(this);
}).ori=$r$;
$r$=$pppp$.drawItem;
($pppp$.drawItem=function f(idx){ // Window_MenuStatus
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
}).ori=$r$;
$pppp$=$aaaa$=undef;

// - Window_SkillStatus
$aaaa$=Window_SkillStatus;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.update;
($pppp$.update=function f(){
	f.ori.call(this);
	const m=this._needRedrawIconsMap;
	if(m && m.size){
		this._refreshIconsOnly=true;
		SceneManager._addRefresh.call(this);
	}
}).ori=$r$;
$r$=$pppp$.refresh;
($pppp$.refresh_do=function f(){
	if(!this.visible) return;
	if(this._refreshAll){
		this._refreshAll=false;
		const m=this._needRedrawIconsMap;
		if(m) m.clear();
		return f.ori.call(this);
	}
	if(this._refreshIconsOnly){
		this._refreshIconsOnly=false;
		const m=this._needRedrawIconsMap;
		if(m && m.size) m.forEach((v,k)=>this.drawActorIcons(k,v[0],v[1],v[2]));
	}
}).ori=$r$;
($pppp$.refresh=function f(){
	this._refreshAll=true;
	f.ori.call(this);
}).ori=$r$;
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
($pppp$[$k$]=function f(actor,x,y,width){
	const cw=this.contentsWidth()-this.textPadding();
	width=width||cw>>1;
	{
		const w2=width>>1;
		f.ori.call(this,actor,x,y,width+w2);
		width=w2;
	}
	this.changeTextColor("rgba(234,234,234,0.5)");
	this.drawText(($gameParty._menuActorIdx||0)+1, cw-width, y-(this.textPadding()>>1), width, 'right');
}).ori=$r$;
$k$='initialize';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(x,y){
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
}).ori=$r$;
$r$=$pppp$.update;
($pppp$.update=function f(){
	f.ori.call(this);
	if(this._commandWindow.active) this._arrowsFloating();
}).ori=$r$;
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
	for(let i=strt,y=oy;i<sz;++i){
		y+=h;
		if(vals[i]!=="") this.drawText('\u2192', x3, y, 32, 'center');
	}
	
	const item=this._itemNew;
	if(item!==undefined && this._actor){
		const ori=this._itemOld;
		// queried above, must have cache
		this._actor._equips_editCache_del(ori);
		this._actor._equips_editCache_add(item);
		for(let i=strt,y=oy;i<sz;++i){
			if(vals[i]===""){ y+=h; continue; }
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
	if(this.visible && this.clearContents() && this._actor){
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
$pppp$.refresh=SceneManager._addRefresh;
$pppp$._cursorLeft=function(trig){
	const w=this._statusWindow;
	if(w){
		let ch=false;
		if(ch=w._page>0) --w._page;
		else if(ch=trig) w._page=w.pageTotal()-1;
		if(ch) SoundManager.playCursor();
		w.refresh(); // so that players can refresh themselves
	}
};
$pppp$._cursorRight=function(trig){
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
$pppp$=$aaaa$=undef;

// - Window_EquipCommand
$aaaa$=Window_EquipCommand;
$pppp$=$aaaa$.prototype;
makeDummyWindowProto($aaaa$,true,true);
{ $t$=Window_EquipStatus.prototype;
$k$='cursorLeft';
$pppp$[$k$]=$t$["_"+$k$];
$k$='cursorRight';
$pppp$[$k$]=$t$["_"+$k$];
}
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
{ $t$=Window_ItemCategory.prototype;
$k$='processTouch';
$pppp$[$k$]=$t$[$k$];
$k$='processTouchOutsideFrame';
$pppp$[$k$]=$t$[$k$];
$k$='processTouchOutsideFrame_ws';
$pppp$[$k$]=$t$[$k$];
}
{ $t$=Window_EquipStatus.prototype;
$k$='cursorLeft';
$pppp$[$k$]=$t$["_"+$k$];
$k$='cursorRight';
$pppp$[$k$]=$t$["_"+$k$];
}
$pppp$.onTouch=function(triggered){
	this.touchLfRhArrowsLfRh(triggered,this._statusWindow);
	const args=[];
	if(this._itemWindow) args.push(this._itemWindow);
	if(this._commandWindow) args.push(this._commandWindow);
	return this._onTouch_iw(triggered,args);
};
$k$='deactivate';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	if(this._scrollYM) this._scrollYM.set(this._actor,this._scrollY);
	f.ori.call(this);
}).ori=$r$;
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
Object.defineProperty($pppp$,'_index',{
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
{ $t$=Window_ItemCategory.prototype;
$k$='processTouch';
$pppp$[$k$]=$t$[$k$];
$k$='processTouchOutsideFrame';
$pppp$[$k$]=$t$[$k$];
$k$='processTouchOutsideFrame_ws';
$pppp$[$k$]=$t$[$k$];
}
{ $t$=Window_EquipStatus.prototype;
$k$='cursorLeft';
$pppp$[$k$]=$t$["_"+$k$];
$k$='cursorRight';
$pppp$[$k$]=$t$["_"+$k$];
}
$pppp$.onTouch=function(triggered){
	this.touchLfRhArrowsLfRh(triggered,this._statusWindow);
	const args=[];
	if(this._slotWindow) args.push(this._slotWindow);
	if(this._commandWindow) args.push(this._commandWindow);
	return this._onTouch_iw(triggered,args);
};
Object.defineProperty($pppp$,'_index',{
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
			const gbb=Game_BattlerBase; const m=arr.a.traitsSet(arr.a.isWeaponSlot(arr.s)?gbb.TRAIT_EQUIP_WTYPE:gbb.TRAIT_EQUIP_ETYPE);
			const oldItem=this.item(),newItem=this._newUnEquip; this._newUnEquip=null;
			if(newItem===oldItem) return; // result unchaged
			if(m&&m.equals(arr.m,true)){
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
			}else arr.m=new Map(m);
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
($pppp$.onTouch=function f(triggered){
	this.touchUpDnArrowsPgUpDn(triggered,this);
	return f.ori.call(this,triggered);
}).ori=$r$;
$k$='initialize';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
	if(this._arrows_actor = $gameParty.members().length>1){
		this.downArrowVisible = this.upArrowVisible = true;
		const y=this.textPadding(); //(this.lineHeight()>>1)+this.standardFontSize()*0.375+this.textPadding();
		this._downArrowSprite.x = this._upArrowSprite.x = this.width>>1;
		this._downArrowSprite.y = this.height - (this._upArrowSprite.y = y);
		this.addChild(this._downArrowSprite);
		this.addChild(this._upArrowSprite);
	}
}).ori=$r$;
$pppp$.updateArrows=function(){
	this.downArrowVisible = this.upArrowVisible =  this._arrows_actor;
};
$r$=$pppp$.update;
($pppp$.update=function f(){
	f.ori.call(this);
	this._arrowsFloating();
}).ori=$r$;
$k$='drawBlock1';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(y){
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
}).ori=$r$;
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
($d$=$pppp$[$k$]=function f(){
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
}).ori=$r$;
$d$.rad1=PI_64;
$k$='processTouch';
$r$=$pppp$[$k$];
($pppp$[$k$]=function f(){
	f.ori.call(this);
}).ori=$r$;
$r$=$pppp$.onTouch;
($pppp$.onTouch=function f(triggered){
	this._onTouch_ing=true;
	f.ori.call(this,triggered);
	this._onTouch_ing=undefined;
}).ori=$r$;
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
		const choiceWidth = this.textWidthEx(choices[i][0]) + this.textPadding() * 2;
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
($pppp$[$k$]=function f(){
	if(this._opening){
		f.ori.call(this); // return undefined
		let txtIn=this._moveTxtInput();
		if(this._opening===false && txtIn && txtIn.y>=0) txtIn.y=this.y-txtIn.height;
	}
}).ori=$r$;
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
($pppp$.start=function f(){
	let rtv=f.ori.call(this),nf=SceneManager._scene._messageWindow._nameField;
	if(nf&&nf.enabled){
		if((this.y-=nf.height)<0){
			this.height+=this.y;
			this.y=0;
		}
	}
	return rtv;
}).ori=$r$;
$pppp$.makeCommandList=function(){
	const choices=$gameMessage.choices();
	for(let i=0;i!==choices.length;++i){
		this.addCommand("\\E"+choices[i][0], 'choice', !choices[i][1]||objs._getObj.call(none,choices[i][1]));
	}
};
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
	if(!this.visible || !this.clearContents()) return;
	this.drawItemEffect(this._item);
};
$pppp$.refresh=SceneManager._addRefresh;
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
