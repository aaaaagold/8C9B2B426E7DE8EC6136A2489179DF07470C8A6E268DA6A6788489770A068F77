"use strict";

// after rpg_*, before obj-t
// rewrites or pre-defined functions

if(!window.objs) window.objs={};
if(!objs.confs) objs.confs={};
if(!objs.funcs) objs.funcs={};

// 寫RMMV的javascript遊戲引擎的人是在?原來我買的是美術包
// 還好我剛好是資工系，不然我一定要求退費。

//* objs funcs
{ const funcs=objs.funcs;
// - game setting
funcs.sysSetting={_:function f(settingKey){
	if(!f.ori){
		f.ori=deepcopy($dataSystem);
		f.tbl={};
	}
	const settingOnly=settingKey!==undefined;
	let tmp=settingOnly?[undefined,settingKey]:location.pathname.match(/\/([A-Za-z0-9]+)\.html$/);
	const info=tmp&&tmp[1];
	
	const cursorDiv_id='cursorDiv';
	const cursorDiv=d.ge(cursorDiv_id);
	let cursorCss;
	let mouseMvEvtFunc;
	
	let useDefault=false;
	$dataCustom.apps=$dataCustom.apps_ori;
	$dataSystem.currencyUnit=$dataSystem.currencyUnit_ori;
	$dataSystem.titleBgm=deepcopy($dataSystem.titleBgm_ori);
	objs.confs={
		hideLearnableSkills:false,
		noRestoreHpMp:false,
		settingKey:info,
		useStp:false,
	};
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
		
		if(!settingOnly){
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
		}
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
},};
// - more funcs
}
// END objs funcs

//* LIB-RELATED

// rewrite ugly lib
String.prototype.padZero=function(len){ return this.padStart(len,'0'); };
String.prototype.contains=function(s){ return this.indexOf(s)!==-1; };
String.prototype.format=function(){
	return this.replace(/%([0-9]+)/g, (s, n)=>{
		return arguments[Number(n) - 1];
	});
};
Number.prototype.mod=function(n){ n|=0; let t=(this|0)%n; t+=(t<0)*n; return t^0; };
Number.prototype.padZero=function(n){ return (this+'').padStart(n,'0'); };
Math.randomInt=max=>~~(Math.random()*max);
{ let t, n, r = {}, i = {}, s = "", o = "", u = "", a = 2, f = 3, l = 2, c = "", h = 0, p = 0, d, v = LZString._f;
const r_hasnt_o=()=>{
	if(Object.prototype.hasOwnProperty.call(i, u)){
		if(u.charCodeAt(0) < 256){
			for(t=l;t--;){
				h<<=1;
				if(p === 15){
					p = 0;
					c += v(h);
					h = 0
				}else ++p;
			}
			n = u.charCodeAt(0);
			for(t=8;t--;){
				h = h << 1 | n & 1;
				if(p === 15){
					p = 0;
					c += v(h);
					h = 0;
				}else ++p;
				n>>=1;
			}
		}else{
			n = 1;
			for(t=l;t--;){
				h = h << 1 | n;
				if(p === 15){
					p = 0;
					c += v(h);
					h = 0;
				}else ++p;
				n = 0;
			}
			n = u.charCodeAt(0);
			for(t=16;t--;){
				h = h << 1 | n & 1;
				if(p === 15){
					p = 0;
					c += v(h);
					h = 0;
				}else ++p;
				n>>=1;
			}
		}
		//if(!--a) a=(l<31)?1<<l++:Math.pow(2, l++);
		if(!--a) a=1<<l++;
		delete i[u];
	}else{
		n = r[u];
		for(t=l;t--;){
			h = h << 1 | n & 1;
			if(p === 15){
				p = 0;
				c += v(h);
				h = 0;
			}else ++p;
			n>>=1;
		}
	}
	//if(!--a) a=(l<31)?1<<l++:Math.pow(2, l++);
	if(!--a) a=1<<l++;
};
LZString.compress=input=>{
	if(!input) return "";
	const e=input;
	r = {}, i = {}, s = "", o = "", u = "", a = 2, f = 3, l = 2, c = "", h = 0, p = 0, v = LZString._f;
	for(d=0;d!==e.length;++d){
		s = e[d];
		if(!Object.prototype.hasOwnProperty.call(r, s)){
			r[s] = f++;
			i[s] = true;
		}
		o = u + s;
		if(Object.prototype.hasOwnProperty.call(r, o)) u = o;
		else{
			r_hasnt_o();
			r[o] = f++;
			u = String(s);
		}
	}
	if(u) r_hasnt_o();
	n = 2;
	for(t=l;t--;){
		h = h << 1 | n & 1;
		if(p === 15){
			p = 0;
			c += v(h);
			h = 0;
		}else ++p;
		n>>=1;
	}
	while(true){
		h<<=1;
		if(p === 15){
			c += v(h);
			break;
		}else ++p;
	}
	return c;
};
}
LZString.compressToBase64=input=>{
	if(!input) return "";
	let n,r,i,s,o,u,a, f=0 , t="";
	const e = LZString.compress(input);
	for(const ende=e.length<<1;f<ende;){
		if(f&1){
			n = e.charCodeAt((f-1)>>1) & 255;
			const f2=(f+1)>>1;
			if(f2 < e.length){
				const c=e.charCodeAt(f2);
				r = c >> 8;
				i = c & 255;
			}else r=i=NaN;
		}else{
			let f2=f>>1;
			const c=e.charCodeAt(f2);
			n = c >> 8;
			r = c & 255;
			if(++f2 < e.length) i=e.charCodeAt(f2)>>8;
			else i=NaN;
		}
		f += 3;
		s = n >> 2;
		o = (n & 3) << 4 | r >> 4;
		u = (r & 15) << 2 | i >> 6;
		if(isNaN(r)) u=a=64;
		else if(isNaN(i)) a=64;
		else a=i&63;
		t+=LZString._keyStr.charAt(s);
		t+=LZString._keyStr.charAt(o);
		t+=LZString._keyStr.charAt(u);
		t+=LZString._keyStr.charAt(a);
	}
	return t;
};
LZString._decompress_calL=(m,shMax)=>{
	let rtv=0^0;
	shMax^=0;
	for(let p=0^0;p!==shMax;++p){
		let c = m.val & m.position;
		m.position >>= 1;
		if(m.position === 0){
			m.position = 1<<15;
			m.val=(m.arr[m.index]<<8)|(m.arr[m.index|1]);
			m.index+=2;
		}
		rtv |= (c!==0) << p;
	}
	return rtv;
};
LZString.decompressFromUint8Array=function(e){ // reduce mem. use and prevent 'Maximum call stack size exceeded'
	if(!e) return;
	let t = [], r = 4, i = 4, s = 3, o = "", u = "", f, d, v = LZString._f , q=LZString._decompress_calL, m = {
		arr: e,
		val: (e[0]<<8)|e[1],
		position: 32768,
		index: 2,
	};
	for(let a=0;a!==3;++a) t[a] = a;
	switch (q(m,2)) {
	case 0:
		d = v(q(m,8));
		break;
	case 1:
		d = v(q(m,16));
		break;
	case 2: return "";
	}
	t[3] = d;
	f = u = d;
	while(true){
		if(m.arr.length<m.index) return "";
		switch (d=q(m,s)) {
		case 0:
			t[d=i++] = v(q(m,8));
			r--;
			break;
		case 1:
			t[d=i++] = v(q(m,16));
			r--;
			break;
		case 2: return u;
		}
		if(r === 0) r = 1<<s++;
		if(t[d]) o = t[d];
		else if(d === i) o = f + f.charAt(0);
		else return null;
		u += o;
		t[i++] = f + o.charAt(0);
		r--;
		f = o;
		if(r === 0) r = 1<<s++;
	}
};
// additional func: see lib-h

// PIXI structs - small pieces
PIXI.ObservablePoint.prototype.pos=function(x,y){
	if(this._x !== x || this._y!==y){
		this._x = x;
		this._y = y;
		this.cb.call(this.scope);
	}
};

// fit 'when children is AVLTree'
PIXI.accessibility.AccessibilityManager.prototype.updateAccessibleObjects=function updateAccessibleObjects(displayObject) {
	if(!displayObject.visible) return;
	if(displayObject.accessible && displayObject.interactive){
		if(!displayObject._accessibleActive) this.addChild(displayObject);
		displayObject.renderId = this.renderId;
	}
	let children=displayObject.children;
	if(children.constructor===AVLTree) children.forEach_r((c)=>this.updateAccessibleObjects(c));
	else for(let i=children.length;i--;) this.updateAccessibleObjects(children[i]);
};

// .removeChild && .destructor , most using PIXI.Container.prototype.removeChild
// - PIXI.Container
$aaaa$=PIXI.Container;
$pppp$=$aaaa$.prototype;
$d$=$pppp$.destructor=function f(){ // TODO
	const r=this.children.slice();
	for(let x=r.length;x--;) this.removeChildAt(x); // also done by destroy, remove first for efficiency
	for(let x=0;x!==r.length;++x) if(r[x].destructor) r[x].destructor();
	//$gameTemp.clearCache(this); // not $game* objs
	//const bitmap=this.bitmap;
	this.destroy( f.tbl ); // del children , sprites' textures
};
$d$.tbl={chilren:true,texture:true};
$pppp$.addChildBefore=function(child,before){
	const index=this.children.indexOf(before);
	if(index>=0) this.addChildAt(child,index);
	else this.addChild(child);
	return this;
};
$pppp$.removeChildren = function removeChildren(){ // ori: wrong range exception condition
	const arr=this.children;
	const strt = Number(arguments[0])||0;
	const ende = Number(arguments[1])||arr.length;
	if(arr.length<ende || strt<0 || ende<strt) throw new RangeError('removeChildren: numeric values are outside the acceptable range.');
	const rtv=this.children.splice(strt, ende-strt);
	for(let i=rtv.length;i--;){
		rtv[i].parent = null;
		if(rtv[i].transform){
			rtv[i].transform._parentID = -1;
		}
	}
	this._boundsID++;
	this.onChildrenChange(strt);
	for(let i=rtv.length;i--;){
		rtv[i].emit('removed', this);
	}
	return rtv;
};

//* COMMON USED FUNCs // assign these functions as methods

SceneManager._addRefresh=function(){
	//SceneManager.delRefresh(this);
	SceneManager.addRefresh(this);
};

//* BASE OBJECTs

// - WindowLayer
$aaaa$=WindowLayer;
$pppp$=$aaaa$.prototype;
$d$=$pppp$.update=function f(){
	this.children.forEach(f.forEach);
};
$d$.forEach=c=>c.update&&c.update();
$pppp$=$aaaa$=undef;
// - Window
$aaaa$=Window;
$pppp$=$aaaa$.prototype;
$pppp$._refreshCursor = function() { // rewrite: original create bitmap EVERY TIME
	let pad = this._padding;
	let x = this._cursorRect.x + pad - this.origin.x;
	let y = this._cursorRect.y + pad - this.origin.y;
	let w = this._cursorRect.width;
	let h = this._cursorRect.height;
	let m = 4;
	let x2 = Math.max(x, pad);
	let y2 = Math.max(y, pad);
	let ox = x - x2;
	let oy = y - y2;
	let w2 = Math.min(w, this._width - pad - x2);
	let h2 = Math.min(h, this._height - pad - y2);
	
	// reuse bitmap object
	let wcs=this._windowCursorSprite,last=wcs.bitmap;
	if(!wcs.bitmap) wcs.bitmap = new Bitmap(w2, h2);
	else wcs.bitmap.initialize(w2,h2);
	let bitmap=wcs.bitmap;
	bitmap.clearRect(0,0,w2,h2);
	
	wcs.setFrame(0, 0, w2, h2);
	wcs.move(x2, y2);
	
	if (w > 0 && h > 0 && this._windowskin) {
		let skin = this._windowskin;
		let p = 96;
		let q = 48;
		bitmap.blt(skin, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2);
		bitmap.blt(skin, p+m, p+0, q-m*2, m, ox+m, oy+0, w-m*2, m);
		bitmap.blt(skin, p+m, p+q-m, q-m*2, m, ox+m, oy+h-m, w-m*2, m);
		bitmap.blt(skin, p+0, p+m, m, q-m*2, ox+0, oy+m, m, h-m*2);
		bitmap.blt(skin, p+q-m, p+m, m, q-m*2, ox+w-m, oy+m, m, h-m*2);
		bitmap.blt(skin, p+0, p+0, m, m, ox+0, oy+0, m, m);
		bitmap.blt(skin, p+q-m, p+0, m, m, ox+w-m, oy+0, m, m);
		bitmap.blt(skin, p+0, p+q-m, m, m, ox+0, oy+h-m, m, m);
		bitmap.blt(skin, p+q-m, p+q-m, m, m, ox+w-m, oy+h-m, m, m);
	}
};
$pppp$._updatePauseSign = function() {
	const sprite = this._windowPauseSignSprite;
	if(!sprite) return;
	const x = (this._animationCount>>4)&1 , y = (this._animationCount>>5)&1;
	const sx = 144 , sy = 96 , p = 24;
	if(!this.pause){
		sprite.alpha = 0;
	}else if(sprite.alpha < 1){
		sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
	}
	sprite.setFrame(sx+x*p, sy+y*p, p, p);
	sprite.visible = this.isOpen();
};
// - Window_Base
$aaaa$=Window_Base;
$pppp$=$aaaa$.prototype;
$r$=$pppp$._refreshArrows;
$d$=$pppp$._refreshArrows=function f(){
	if(this._noRefreshArrows) return;
	f.ori.call(this);
	if(!this._leftArrowSprite){
		let la,ra,uaf;
		this.addChild(la=this._leftArrowSprite=new Sprite());
		this.addChild(ra=this._rightArrowSprite=new Sprite());
		{ const ua=this._upArrowSprite;
		ra.bitmap=la.bitmap=ua.bitmap;
		uaf=ua._frame;
		}
		ra.anchor.y=ra.anchor.x=la.anchor.y=la.anchor.x=0.5;
		const sx=uaf.x-uaf.height,sy=uaf.y,p=uaf.width,q=uaf.height;
		la.setFrame(sx,sy+q,q,p);
		ra.setFrame(sx+p+q,sy+q,q,p);
	}
	if(this.adjLrArrows && (this.leftArrowVisible||this.rightArrowVisible)){
		const la=this._leftArrowSprite,ra=this._rightArrowSprite;
		const p=ra._frame.width,y=this.height>>1;
		la.move(p,y);
		ra.move(this.width-p,y);
	}
}; $d$.ori=$r$;
$r$=$pppp$._updateArrows;
$d$=$pppp$._updateArrows=function f(){
	f.ori.call(this);
	this._leftArrowSprite.visible = this.leftArrowVisible;
	this._rightArrowSprite.visible = this.rightArrowVisible;
}; $d$.ori=$r$;
$d$=$pppp$._arrowsFloating=function f(){
	if(this.upArrowVisible | this.leftArrowVisible){
		this.ctr_arrows^=0; ++this.ctr_arrows;
		const s=Math.sin(this.ctr_arrows*f.rad1)/2,s0=0.5-s,s1=0.5+s;
		this.   _upArrowSprite.anchor.y=s0;
		this. _downArrowSprite.anchor.y=s1;
		this. _leftArrowSprite.anchor.x=s0;
		this._rightArrowSprite.anchor.x=s1;
	}
};
$d$.rad1=PI_64;
Object.defineProperties($pppp$,{
	fontSize:{
		get:function(){return this._fontSize;},
		set:function(rhs){
			this._fontSize=rhs;
			this._lineHeight=(rhs>>2)+(rhs!==0)+rhs;
			return rhs;
		},
	configurable:true},
});
$pppp$.lineHeight=function(){
	return this.fontSize&&this._lineHeight||36;
};
$pppp$.standardFontSize=function(){
	return this.fontSize||28;
};
$pppp$.setFontsize=function(sz){
	this.fontSize=sz;
	if(this.contents) this.contents.fontSize=sz;
};
$pppp$.standardFontFace=function(){
	if($gameSystem.isKorean()) return _global_conf.useFont+',Dotum, AppleGothic, sans-serif';
	else return _global_conf.useFont;
};
$pppp$.contentsWidth = function() {
	return this.width - (this.standardPadding()<<1);
};
$pppp$.contentsHeight = function() {
	return this.height - (this.standardPadding()<<1);
};
$pppp$.createContents=function(){
	const w=this.contentsWidth() , h=this.contentsHeight();
	// TODO: BUG: [webgl] sprite.bitmap.reCreate dismatch sprite.texture size // 'w._windowContentsSprite.texture._updateUvs();' AFTER first render can fix it
	if(Graphics.isWebGL()){
		if(this._lstw!==w || this._lsth!==h){
			this._lstw=w;
			this._lsth=h;
			this.contents = new Bitmap(w,h);
		}else this.clearContents();
	}else if(!this.clearContents()) this.contents = new Bitmap(w,h);
	this.resetFontSettings();
};
$pppp$.hpCostColor=function(){
	return this.hpGaugeColor2();
};
$pppp$.stpColor = function(actor) {
	if(actor.isStarving()) return this.deathColor();
	else if(actor.isHungry()) return this.crisisColor();
	else return this.normalColor();
};
$pppp$.expGaugeColor1=function(){
	return '#80e040';
};
$pppp$.expGaugeColor2=function(){
	return '#c0f040';
};
$pppp$.stpGaugeColor1=function(){
	return '#8040e0';
};
$pppp$.stpGaugeColor2=function(){
	return '#c040f0';
};
$d$=$pppp$.iconStackTextColor=function f(idx){
	return f.tbl[idx|0]||'#ffffff';
};
$d$.tbl=['#c0f040','#40c0f0'];
$pppp$.touchUpDnArrowsPgUpDn=function(triggered,targetWindow){
	if(triggered && (targetWindow.upArrowVisible||targetWindow.downArrowVisible)){
		const ua=targetWindow.  _upArrowSprite;
		const da=targetWindow._downArrowSprite;
		const uah=ua.height,uaw=ua.width;
		const dah=da.height,daw=da.width;
		const uap=ua.getGlobalPosition();
		const dap=da.getGlobalPosition();
		const uar=new Rectangle(uap.x-(uaw>>1),uap.y-uah,uaw,uah<<1);
		const dar=new Rectangle(dap.x-(daw>>1),dap.y-dah,daw,dah<<1);
		const x=TouchInput.x,y=TouchInput.y;
		if(uar.contain(x,y)){ this.processPageup(); return true; }
		else if(dar.contain(x,y)){ this.processPagedown(); return true; }
	}
};
$pppp$.touchLfRhArrowsLfRh=function(triggered,targetWindow){
	if(triggered && (targetWindow.leftArrowVisible||targetWindow.rightArrowVisible)){
		const la=targetWindow. _leftArrowSprite;
		const ra=targetWindow._rightArrowSprite;
		const lah=la.height,law=la.width;
		const rah=ra.height,raw=ra.width;
		const lap=la.getGlobalPosition();
		const rap=ra.getGlobalPosition();
		const lar=new Rectangle(lap.x-law,lap.y-(lah>>1),law<<1,lah);
		const rar=new Rectangle(rap.x-raw,rap.y-(rah>>1),raw<<1,rah);
		const x=TouchInput.x,y=TouchInput.y;
		if(lar.contain(x,y)){ this.cursorLeft(true); return true; }
		else if(rar.contain(x,y)){ this.cursorRight(true); return true; }
	}
};
$d$=$pppp$.textColor=function f(n){
	let rtv=f.tbl.get(n);
	if(rtv===undefined){
		let px = 96 + (n&7) * 12 + 6;
		let py = 144 + ~~(n>>3) * 12 + 6;
		f.tbl.set(n,rtv=this.windowskin.getPixel(px, py));
	}
	return rtv;
};
$d$.tbl=new Map();
$pppp$.drawText=function(text,x,y,maxWidth,align,rect){
	this.contents.drawText(text,x,y,maxWidth,this.lineHeight(),align,rect);
};
$pppp$._rmAllIconSprite=function(){
	// TODO: use sprites to draw icons
	// for WebGL
	// put this at the begin of update
	if(!this._iconPool_free) this._iconPool_free=[];
	if(!this._iconPool_used) this._iconPool_used=[];
	for(const dx=-this.getGlobalPosition().x,arr=this._iconPool_used,arr2=this._iconPool_free;arr.length;){
		const sp=arr.pop();
		sp.x=dx-sp.width;
		arr2.push(sp);
	}
};
$pppp$._newIconSprite=function(){
	// TODO: use sprites to draw icons
	// for WebGL
	if(!this._iconPool_free) this._iconPool_free=[];
	if(!this._iconPool_used) this._iconPool_used=[];
	if(this._iconPool_free.length){
		const rtv=this._iconPool_free.pop();
		this._iconPool_used.push(rtv);
		return rtv;
	}
	const rtv=new Sprite();
	rtv.bitmap=ImageManager.loadSystem('IconSet');
	rtv.width =Window_Base._iconWidth ;
	rtv.height=Window_Base._iconHeight;
	let iss=this._iconSprites; if(!iss) this.addChild(iss=this._iconSprites=new PIXI.Container());
	iss.addChild(rtv);
	this._iconPool_used.push(rtv);
	return rtv;
};
$pppp$.drawIcon=function(iconIndex,x,y,inRect){
	const test=0; // TODO: use sprites to draw icons
	// return true if drawn
	let pw = Window_Base._iconWidth ;
	let ph = Window_Base._iconHeight;
	let dx=0,dy=0;
	if(inRect){
		let rx=inRect.x , ry=inRect.y ;
		if(x<rx){
			pw-=dx=rx-x;
			x=rx;
		}
		if(y<ry){
			ph-=dy=ry-y;
			y=ry;
		}
		rx+=inRect.width ; if(x+pw>rx) pw=rx-x;
		ry+=inRect.height; if(y+ph>ry) ph=ry-y;
		if(pw<=0||ph<=0) return;
	}
	if(iconIndex>=0){
		const sx = (iconIndex&15) * Window_Base._iconWidth ;
		const sy = (iconIndex>>4) * Window_Base._iconHeight;
		if(test&&Graphics.isWebGL()){
			const sp=this._newIconSprite();
			sp.x=x;
			sp.y=y;
			sp.setFrame(sx+dx,sy+dy,pw,ph);
		}else{
			const bitmap = ImageManager.loadSystem('IconSet');
			this.contents.blt(bitmap, sx+dx, sy+dy, pw, ph, x, y);
		}
		return true;
	}else if(!test||!Graphics.isWebGL()) this.contents.clearRect(x,y,pw,ph);
};
$pppp$.loadFace=function(fn){
	return ImageManager.loadFace(fn);
};
$r$=$pppp$.drawFace;
$d$=$pppp$.drawFace=function f(fn, fi, x, y, w, h){
	x|=0; y|=0;
	w = w || Window_Base._faceWidth;
	h = h || Window_Base._faceHeight;
	let bitmap,sx,sy,sw,sh,dx,dy,dw,dh;
	if(fi>=0){
		const pw = Window_Base._faceWidth , ph = Window_Base._faceHeight;
		bitmap=this.loadFace(fn);
		if(w<pw){ sw=w; dx=x; }
		else{ sw=pw; dx=x+((w-pw)>>1); }
		if(h<ph){ sh=h; dy=y; }
		else{ sh=ph; dy=y+((h-ph)>>1); }
		sx=(fi  &3)*pw+((pw-sw)>>1);
		sy=(fi >>2)*ph+((ph-sh)>>1);
	}else{
		bitmap=fi[0];
		sx=fi[1]; sy=fi[2]; sw=fi[3]; sh=fi[4];
		const r=Math.min(~~(w/sw),~~(h/sh));
		if(!r) return; // image is empty
		dw=r*sw; dh=r*sh;
		dx=(w-dw)>>1; dy=(h-dh)>>1;
	}
	this.contents.blt(bitmap, 
		sx,sy,sw,sh,
		dx,dy,dw,dh
	);
	return;
}; $d$.ori=$r$;
$pppp$.drawCurrentAndMax = function(current, max, x, y, width, color1, color2, valWidth) {
	const labelWidth = this.textWidth('HP');
	const valueWidth = valWidth||this.textWidth('000');
	const slashWidth = this.textWidth('/')>>1;
	let x1 = x + width - valueWidth;
	let x2 = x1 - slashWidth;
	let x3 = x2 - valueWidth;
	//debug.log(x1,x2,x3);
	if (x3 >= x + labelWidth) {
		this.changeTextColor(color1);
		this.drawText(current, x3, y, valueWidth, 'right');
		this.changeTextColor(color2);
		this.drawText('/', x2, y, slashWidth, 'right');
		this.drawText(max, x1, y, valueWidth, 'right');
	} else {
		this.changeTextColor(color1);
		this.drawText(current, x1, y, valueWidth, 'right');
	}
};
$pppp$.cursorShown=function(){
	const cr=this._cursorRect;
	return cr && cr.width && cr.height;
};
$pppp$.subWindows=none;
$pppp$=$aaaa$=undef;
// - Texture
$aaaa$=PIXI.Texture;
$pppp$=$aaaa$.prototype;
$r$=Object.getOwnPropertyDescriptor($pppp$,'frame').get;
$d$=function set(frame){ // rewrite: much useful debug info
	this._frame = frame;
	this.noFrame = false;
	if (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height) {
		if(objs.isDev){ console.warn(this); debugger; }
		throw new Error('Texture Error: frame does not fit inside the base Texture dimensions: ' + ('X: ' + frame.x + ' + ' + frame.width + ' = ' + (frame.x + frame.width) + ' > ' + this.baseTexture.width + ' ') + ('Y: ' + frame.y + ' + ' + frame.height + ' = ' + (frame.y + frame.height) + ' > ' + this.baseTexture.height));
	}
	// this.valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;
	this.valid = frame && frame.width && frame.height && this.baseTexture.hasLoaded;
	if (!this.trim && !this.rotate) {
		this.orig = frame;
	}
	if (this.valid) {
		this._updateUvs();
	}
};
Object.defineProperty($pppp$,'frame',{get:$r$,set:$d$});
$pppp$=$aaaa$=undef;

$tttt$={};
if(isDev&&!window._objs){ // dev , will eventually becomes non-dev
}else{
}
{
	$tttt$.doFlow=function f(txt,blockVars,replaceWith){
		objs._vars_strArg.length=objs._vars.length;
		if(blockVars && blockVars.length){
			const set=new Set(blockVars);
			const argStrs=[];
			const argObjs=[];
			for(let x=0,arr=objs._vars_strArg;x!==arr.length;++x){
				if(set.has(arr[x])) continue;
				argStrs.push(arr[x]);
				argObjs.push(objs._vars_objArg[x]);
			}
			const dummy={};
			for(let x=0;x!==blockVars.length;++x){
				argStrs.push(blockVars[x]);
				argObjs.push(replaceWith&&(x in replaceWith)?replaceWith[x]:dummy);
			}
			argStrs.push(f.ua+txt);
			return Function.apply(null,argStrs).apply(this,argObjs);
		}else{
			objs._vars_strArg[objs._vars.length]=f.ua+txt;
			return Function.apply(null,objs._vars_strArg).apply(this,objs._vars_objArg);
		}
	};
	$tttt$.getObj=function f(txt,blockVars,replaceWith){
		objs._vars_strArg.length=objs._vars.length;
		if(blockVars && blockVars.length){
			const set=new Set(blockVars);
			const argStrs=[];
			const argObjs=[];
			for(let x=0,arr=objs._vars_strArg;x!==arr.length;++x){
				if(set.has(arr[x])) continue;
				argStrs.push(arr[x]);
				argObjs.push(objs._vars_objArg[x]);
			}
			const dummy={};
			for(let x=0;x!==blockVars.length;++x){
				argStrs.push(blockVars[x]);
				argObjs.push(replaceWith&&(x in replaceWith)?replaceWith[x]:dummy);
			}
			argStrs.push(f.ua+'return ('+txt+')');
			return Function.apply(null,argStrs).apply(this,argObjs);
		}else{
			objs._vars_strArg[objs._vars.length]=f.ua+'return ('+txt+')';
			return Function.apply(null,objs._vars_strArg).apply(this,objs._vars_objArg);
		}
	};
	let tmp='"use strict";\n';
	for(let i in $tttt$){
		let curr=objs["_"+i]=$tttt$[i];
		if(curr&&curr.constructor===Function) curr.ua=tmp;
	}
}
$tttt$=undefined;


// core

// - Point
$aaaa$=Point;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize=function f(x, y){
	// (int,int)
	return f.ori.call(this,~~x,~~y);
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - Rectangle
$aaaa$=Rectangle;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.initialize;
$d$=$pppp$.initialize=function f(x, y, width, height){
	// (int,int,int,int)
	return f.ori.call(this, ~~x, ~~y, ~~width, ~~height);
}; $d$.ori=$r$;
$pppp$.contain=function(x,y){
	return x>=this.x && x<this.x+this.width && y>=this.y && y<this.y+this.height;
};
$pppp$=$aaaa$=undef;

// - Utils
Utils.isAndroidChrome=function() {
	if(this._isAndroidChrome!==undefined) return this._isAndroidChrome;
	let agent = navigator.userAgent;
	return this._isAndroidChrome=!!(agent.indexOf('Android') && agent.indexOf('Chrome'));
};
Utils.isMobileDevice=function(){
	if(this._isMobileDevice!==undefined) this._isMobileDevice;
	let r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
	return this._isMobileDevice=!!navigator.userAgent.match(r);
};
Utils.isMobileSafari=function(){
	if(this._isMobileSafari!==undefined) return this._isMobileSafari;
	let agent = navigator.userAgent;
	return this._isMobileSafari=( !!(agent.match(/iPhone|iPad|iPod/) && agent.indexOf('AppleWebKit') && !agent.indexOf('CriOS')) );
};
$d$=Utils.rgbToCssColor=function f(r,g,b){
	return "#"+f.toHex(r)+f.toHex(g)+f.toHex(b);
};
$d$.toHex=function f(n){
	return f.tbltxt[255<n?255:f.tblclamp[n]|0];
};
$d$.toHex.tblclamp=[]; for(let x=0;x!==256;++x) $d$.toHex.tblclamp[x]=x;
$d$.toHex.tbltxt=[]; for(let x=0;x!==256;++x) $d$.toHex.tbltxt[x]=x.toString(16).padZero(2);
$pppp$=$aaaa$=undef;

// - ResourceHandler
$aaaa$=ResourceHandler;
$pppp$=$aaaa$.prototype;
$r$=$aaaa$.createLoader;
$d$=$aaaa$.createLoader=function(type,url, retryMethod, resignMethod, retryInterval) {
	//debug.log('ResourceHandler.createLoader');
	retryInterval = retryInterval || this._defaultRetryInterval;
	let reloaders = this._reloaders;
	let retryCount = 0;
	return function(setCurrRetryCnt) {
		if(setCurrRetryCnt!==undefined) retryCount=setCurrRetryCnt;
		if (retryCount < retryInterval.length) {
			setTimeout( ()=>retryMethod(url) ,retryInterval[retryCount]);
			retryCount++;
		} else {
			if (resignMethod) resignMethod();
			if (url) {
				if (reloaders.length === 0) {
					Graphics.printLoadingError(type,url);
					SceneManager.stop();
				}
				let foo=none;
				switch(type){
				default:
					foo=()=>{ retryCount=0; retryMethod(url); }
					break;
				case 'img':
					foo=giveUp=>{ retryCount=0; retryMethod(giveUp?blank_1x1:url); }
					break;
				case 'audio':
					foo=giveUp=>{ retryCount=0; retryMethod(giveUp?blank_audio:url); }
					break;
				}
				reloaders.push(foo);
			}
		}
	};
}; $d$.ori=$r$;
$r$=$aaaa$.retry;
$d$=$aaaa$.retry=function(giveUp) {
	if(0<this._reloaders.length){
		Graphics.eraseLoadingError();
		SceneManager.resume();
		this._reloaders.forEach(reloader=>reloader(giveUp));
		this._reloaders.length = 0;
	}
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - ImageCache
$aaaa$=ImageCache;
$pppp$=$aaaa$.prototype;
$tttt$=1<<27; if($tttt$<$aaaa$.limit) $tttt$=$aaaa$.limit;
delete $aaaa$.limit;
Object.defineProperties($aaaa$,{
	limit:{ get:function(){ return this._limit; },
		set:function(rhs){ if(!(this._limit>=rhs)) this._limit=rhs; return rhs; },
	},
});
$aaaa$.limit=1<<27;
$pppp$.initialize=function(){
	this._items  = new Map();
	this._tmparr = []; // used when a function need an array , will do '.length=0'
};
$pppp$.clear=function(){
	this._items.clear();
};
$pppp$.add=function(key, value){
	this._items.set(key,{
		bitmap: value,
		touch: Date.now(),
		key: key,
	});
	this._truncateCache();
};
$pppp$.get=function(key){
	const tmp = this._items.get(key);
	if(tmp){
		tmp.touch = Date.now();
		return tmp.bitmap;
	}
	return null;
};
$pppp$.reserve=function(key, value, reservationId){
	let tmp=this._items.get(key);
	if(!tmp){
		this._items.set(key,tmp={
			bitmap: value,
			touch: Date.now(),
			key: key
		});
	}
	tmp.reservationId = reservationId;
};
$pppp$.releaseReservation=function(reservationId){
	const items = this._items , arr = this._tmparr;
	arr.length=0;
	items.forEach(v=>arr.push(v));
	//arr.forEach(item=>item.reservationId===reservationId && items.delete(item.key));
	arr.forEach(item=>item.reservationId===reservationId && (item.reservationId=undefined));
};
$pppp$._itemSize=item=>{
	let bm=item.bitmap;
	return ((bm._image_ori && bm._image_ori!==bm._image)?0:(bm.width * bm.height)) + 0xFF;
};
$d$=$pppp$._truncateCache=function f(){
	const items = this._items , arr = this._tmparr;
	arr.length=0;
	items.forEach(v=>arr.push(v));
	let sizeLeft = ImageCache.limit;
	arr.sort(f.cmp).forEach(item=>{
		if(sizeLeft > 0 || this._mustBeHeld(item)) sizeLeft -= this._itemSize(item);
		else items.delete(item.key);
	});
};
$d$.cmp=(a,b)=>b.touch-a.touch;
$r$=$pppp$._mustBeHeld;
$d$=$pppp$._mustBeHeld=function f(item){
	{
		let bm=item.bitmap;
		if(bm._image_ori&&bm._image_ori!==bm._image) return false;
	}
	return f.ori.call(this,item);
}; $d$.ori=$r$;
$pppp$.isReady=function(){
	let rtv=true;
	this._items.forEach(v=>rtv=rtv&&( (!v.bitmap._decodeAfterRequest) || v.bitmap.isReady() ));
	return rtv;
};
$pppp$.getErrorBitmap=function(){
	const rtv=false;
	this._items.forEach(v=>rtv=rtv||( v.bitmap.isError() && v.bitmap ));
	return rtv||null;
};
$pppp$=$aaaa$=undef;

// - RequestQueue
$aaaa$=RequestQueue;
$pppp$=$aaaa$.prototype;
$pppp$.initialize=function(){
	this._queue = new Queue();
	this._tmpQ  = new Queue();
};
$pppp$.raisePriority=function(key){
	this._tmpQ.clear((this._queue.length<<1)|1);
	this._queue.forEach(item=>item.key===key?this._tmpQ.push_front(item):this._tmpQ.push_back(item));
	{ const tmp=this._tmpQ; this._tmpQ=this._queue; this._queue=tmp; }
};
$pppp$.clear=function(){
	// when it is an array, use '.length=0;' ?  https://stackoverflow.com/questions/1232040/
	this._queue.clear();
	this._tmpQ .clear();
};
$pppp$=$aaaa$=undef;

// - Decrypter
Decrypter.extToEncryptExt = function(url) {
	let sp=url.split('.'); if(sp.length===1) return url;
	let ext=sp.pop();
	let encryptedExt=ext;
	
	if(ext === "ogg") encryptedExt = "rpgmvo";
	else if(ext === "m4a") encryptedExt = "rpgmvm";
	else if(ext === "png") encryptedExt = "rpgmvp";
	
	return url.slice(0, url.lastIndexOf(ext)) + encryptedExt;
};

// - WebAudio
$aaaa$=WebAudio;
$pppp$=$aaaa$.prototype;
Object.defineProperty($pppp$, 'pitch', {
	get: function() {
		return this._pitch;
	},
	set: function(value) {
		if (this._pitch !== value) {
			let lastPitch=this._pitch;
			this._pitch = value;
			if (this.isPlaying()) {
				let srcNode=this._sourceNode,strtT=this._startTime; // suppose play from offset 0
				let currOffset=(srcNode.context.currentTime-strtT)*lastPitch;
				//if(debug.isdebug()) console.log(new Date(),new Date().getTime()/1000,currOffset);
				this.play(this._sourceNode.loop, currOffset);
			}
		}
	},
	configurable: true
});
$r$=$pppp$.clear;
$d$=$pppp$.clear=function f(){
	f.ori.call(this);
	this._loadListeners=new Queue();
}; $d$.ori=$r$;
$pppp$.initialize=function(url){
	if (!WebAudio._initialized) {
		WebAudio.initialize();
	}
	this.clear();
	
	this._loader=undefined;
	if(!WebAudio._standAlone){
		this._loader = ResourceHandler.createLoader('audio',url, this._load.bind(this, url), function(){ this._hasError=true; }.bind(this) );
	}
	this._load(url);
	this._url = url;
};
$pppp$.fadeOut = function(duration) {
	if(this._gainNode){
		const gain = this._gainNode.gain , currentTime = WebAudio._context.currentTime;
		gain.setValueAtTime(this._volume, currentTime);
		//gain.linearRampToValueAtTime(0, currentTime + duration);
		//gain.exponentialRampToValueAtTime(0.03125, currentTime + duration);
		gain.exponentialRampToValueAtTime(0.0009765625, currentTime + duration);
	}
	this._autoPlay = false;
};
$pppp$.seek=function() {
	if(WebAudio._context){
		let pos = (WebAudio._context.currentTime - this._startTime) * this._pitch;
		if (this._loopLength > 0){
			pos-=this._loopStart;
			pos%=this._loopLength;
			pos+=this._loopStart;
		}
		return pos;
	}else return 0;
};
$pppp$._load=function f(url){
	if(f.cache===undefined) f.cache=new CacheSystem(2);
	if(WebAudio._context){
		let self=this,url_ori=url;
		let cache=f.cache.get(url_ori);
		if(cache!==undefined){
			// if not creating a new ArrayBuffer, the following error will happen: 'Cannot perform Construct on a neutered ArrayBuffer'
			return this._onXhrLoad({response:cache.slice(0)}); // .slice(0) : https://stackoverflow.com/questions/10100798/#10101213
		}
		let useCache=()=>{
			// if not creating a new ArrayBuffer, the following error will happen: 'Cannot perform Construct on a neutered ArrayBuffer'
			return self._onXhrLoad({response:f.cache.get(url_ori).slice(0)}); // .slice(0) : https://stackoverflow.com/questions/10100798/#10101213
		};
		let xhr = new XMLHttpRequest();
		let callbacks={send:()=>{xhr.open('GET', url);xhr.send();},useCache:useCache};
		if(Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function() {
			if (xhr.status < 400) {
				if(f.cache.add(url_ori,0)===1) f.cache.set(url_ori,xhr.response.slice(0)); // reduce copy times
				this._onXhrLoad(xhr);
				return f.cache.xhrq_succ(url_ori,callbacks);
			}else return f.cache.xhrq_fail(url_ori,callbacks);
		}.bind(this);
		xhr.onerror = this._loader || function(){this._hasError = true;}.bind(this);
		xhr.open('GET', url);
		return f.cache.xhrq_regist(url_ori,callbacks); // xhr.send();
	}
};
$pppp$._startPlaying=function(loop, offset){
	if(this._loopLength>0){
		offset-=this._loopStart;
		offset%=this._loopLength;
		offset+=this._loopStart;
	}
	this._removeEndTimer();
	this._removeNodes();
	this._createNodes();
	this._connectNodes();
	this._sourceNode.loop = loop;
	this._sourceNode.start(0, offset);
	this._startTime = WebAudio._context.currentTime - offset / this._pitch;
	this._createEndTimer();
};
$pppp$=$aaaa$=undef;
// - Html5Audio
$aaaa$=Html5Audio;
$pppp$=$aaaa$.prototype;
$r$=$aaaa$.clear;
$d$=$aaaa$.clear=function f(){
	f.ori.call(this);
	this._loadListeners=new Queue();
}; $d$.ori=$r$;
$pppp$=$aaaa$=undef;

// - Graphics
$aaaa$=Graphics;
$pppp$=$aaaa$.prototype;
$r$=$aaaa$.initialize;
($aaaa$.initialize=function f(w,h,type){
	f.ori.call(this,w,h,type);
	this.setPad(Game_Map.e*3);
	this._captureThisFrame=false;
	this._lastCapturedFrame=undefined;
}).ori=$r$;
$aaaa$.setPad=function(pad){
	this._pad=pad||Game_Map.e*3;
	const p2=this._pad<<1;
	this._boxWidth_pad4=(this._boxWidth_pad3=(this._boxWidth_pad2=this._boxWidth+p2)+this._pad)+this._pad;
	this._boxHeight_pad4=(this._boxHeight_pad3=(this._boxHeight_pad2=this._boxHeight+p2)+this._pad)+this._pad;
	this._boxWidth_pad6=this._boxWidth_pad4+p2;
	this._boxHeight_pad6=(this._boxHeight_pad5=this._boxHeight_pad4+this._pad)+this._pad;
	this._boxWidth_2  =this._boxWidth  >>1;
	this._boxHeight_2 =this._boxHeight >>1;
	this._radius=Math.sqrt(this._boxWidth_2*this._boxWidth_2 + this._boxHeight_2*this._boxHeight_2 );
	this._radius2=Math.ceil(this._radius*this._radius)|0;
	this._radius=Math.ceil(this._radius)|0;
};
$aaaa$.screenDist2=function(spChr){
	const dx=spChr.x-this._boxWidth_2,dy=spChr.y-this._boxHeight_2;
	return dx*dx+dy*dy;
};
$r$=$aaaa$._onKeyDown;
$d$=$aaaa$._onKeyDown=function f(){
	//debug.keydown('Graphics._onKeyDown');
	return f.ori.call(this,arguments[0]);
}; $d$.ori=$r$;
$r$=$aaaa$._testCanvasBlendModes;
$d$=$aaaa$._testCanvasBlendModes=function f(){
	f.ori.call(this);
	let canvas = document.createElement('canvas');
	canvas.width = 1;
	canvas.height = 1;
	let context = canvas.getContext('2d');
	context.globalCompositeOperation = 'source-over';
	context.fillStyle = 'black';
	context.fillRect(0, 0, 1, 1);
	context.globalCompositeOperation = 'multiply';
	context.fillStyle = 'white';
	context.fillRect(0, 0, 1, 1);
	this._canUseMultiplyBlend = context.getImageData(0, 0, 1, 1).data[0]===0;
}; $d$.ori=$r$;
$aaaa$._createRenderer=function(){
	PIXI.dontSayHello=true;
	const width=this._width , height=this._height;
	const options={ view: this._canvas, transparent: true, forceCanvas: this._forceCanvas };
	try{
		switch(this._rendererType){
		case 'canvas':{
			this._renderer = new PIXI.CanvasRenderer(width, height, options);
		}break;
		case 'webgl':{
			this._renderer = new PIXI.WebGLRenderer(width, height, options);
		}break;
		default:{
			this._renderer = PIXI.autoDetectRenderer(width, height, options, this._forceCanvas);
		}break;
		}

		if(this._renderer && this._renderer.textureGC) this._renderer.textureGC.maxIdle=1;

	}catch(e){
		this._renderer=null;
	}
};
$aaaa$._createGameFontLoader=none;
$r$=$aaaa$.isFontLoaded=function(name){
	if(this._cssFontLoading){
		if(this._fontLoaded) return this._fontLoaded.check('10px '+name);
		return false;
	}else{
		if(!this._hiddenCanvas) this._hiddenCanvas = document.createElement('canvas');
		let context = this._hiddenCanvas.getContext('2d');
		let text = 'abcdefghijklmnopqrstuvwxyz';
		context.font = '40px ' + name + ', sans-serif';
		let width1 = context.measureText(text).width;
		context.font = '40px sans-serif';
		let width2 = context.measureText(text).width;
		return width1 !== width2;
	}
};
$d$=$aaaa$.isFontLoaded=function f(name){
	let rtv=f.ori.call(this,name);
	if(!rtv){ debug.log("font issue"); if(objs.isDev) debugger; }
	return rtv;
}; $d$.ori=$r$;
$aaaa$.playVideo=function(src) {
	this._videoLoader = ResourceHandler.createLoader('video',null, this._playVideo.bind(this, src), this._onVideoError.bind(this));
	this._playVideo(src);
};
$d$=$aaaa$.blurBorder=function f(stage){
	// light weight: 1/4 width , 1/4 height. and that's the limit
	const c=this._canvas;//,ctx=c.getContext('2d');
	const w=c.width>>2,h=c.height>>2;
	let crnw=w>>3,crnh=h>>3;
	const crn=Math.min(crnw,crnh);
	crnw=crnh=crn;
	
	let gc2=f.gc2||d.ge('gc2');
	if(!gc2){
		d.body.ac(gc2=f.gc2=d.ce('canvas').sa('id','gc2').sa('style',c.ga('style')));
		gc2.width=w;
		gc2.height=h;
		gc2.style.filter="blur("+((crn>>1)-1)+"px)";
	}
	if(!stage.isBlurBorder()) return gc2.style.display="none";
	if(gc2.style.width!==c.style.width) gc2.style.width=c.style.width;
	if(gc2.style.height!==c.style.height) gc2.style.height=c.style.height;
	
	const t=f.template;
	if(t.width!==w||t.height!==h){
		if(t.width!==w)   gc2.width=t.width=w;
		if(t.height!==h) gc2.height=t.height=h;
		gc2.style.filter="blur("+((crn>>1)-1)+"px)";
		const ctx=t.getContext('2d');
		ctx.fillStyle="#000000";
		ctx.fillRect( 0 , 0 , w-crnw , crnh );
		ctx.fillRect( w-crnw , 0 , crnw , h-crnh );
		ctx.fillRect( crnw , h-crnh , w-crnw , crnh );
		ctx.fillRect( 0 , crnh , crnw , h-crnh );
	}
	
	const ctx2=gc2.getContext('2d');
	ctx2.globalCompositeOperation="source-over";
	ctx2.drawImage(f.template,0,0);
	ctx2.globalCompositeOperation="source-atop";
	ctx2.drawImage(c,0,0,w,h);
	
	if(gc2.style.display==="none") gc2.style.display="";
};
$d$.template=d.ce('canvas');
$d$.gc2=undefined;
$aaaa$.setCaptureThisFrame=function(scale){
	this._captureThisFrame=scale;
};
$aaaa$.getLastCapturedFrame=function(){
	const rtv=this._lastCapturedFrame;
	this._lastCapturedFrame=undefined;
	return rtv;
};
$aaaa$.render=function f(stage){
	if(0<this._skipCount) this._skipCount^=0;
	else this._skipCount&=0;
	if(this._skipCount === 0){
		const t0 = Date.now();
		if(stage){
			this._renderer.render(stage);
			if (this._renderer.gl && this._renderer.gl.flush) this._renderer.gl.flush();
			this.blurBorder(stage);
// test
if(0){
}
// END test
			const ctf=this._captureThisFrame;
			if(ctf>0) this._lastCapturedFrame=d.ge('GameCanvas').scale(ctf).toDataURL();
			this._captureThisFrame=0;
		}
		this._skipCount = Math.min((Date.now()-t0)>>4, this._maxSkip);
		this._rendered = true;
	} else {
		--this._skipCount;
		this._rendered = false;
	}
	++this.frameCount;
};
$aaaa$._preCalScreenTileCoord=function(){
	// pre-cal. _screenTileX,_screenTileY
	Game_Map.prototype._screenTileX=this._width/Game_Map.prototype.tileWidth();
	Game_Map.prototype._screenTileY=this._height/Game_Map.prototype.tileHeight();
};
$r$=$aaaa$._updateAllElements;
$d$=$aaaa$._updateAllElements=function f(){
	f.ori.call(this);
	// custom divs
	const target=this._canvas;
	if(target){
		const style=target.style , attrs=f.tbl , arr=_global_conf["newDiv"].divs;
		for(let x=0;x!==arr.length;++x){
			let s=arr[x].style;
			for(let a=0;a!==attrs.length;++a) s[attrs[a]]=style[attrs[a]];
		}
	}
	this._preCalScreenTileCoord();
}; $d$.ori=$r$;
$d$.tbl=["left","top","right","bottom","width","height",];
$aaaa$._updateRealScale = function() {
	if (this._stretchEnabled) {
		let h = document.body.clientWidth; //window.innerWidth;
		let v = document.body.clientHeight; //window.innerHeight;
		h /= this._width;
		v /= this._height;
		if (h >= 1 && h - 0.01 <= 1) h = 1;
		if (v >= 1 && v - 0.01 <= 1) v = 1;
		this._realScale = Math.min(h, v);
	} else {
		this._realScale = this._scale;
	}
};
$aaaa$._centerElement=function(ele){
	//debug.log('Graphics._centerElement');
	const p=d.body===ele?undefined:ele.parentNode;
	const maxW=this._width*this._realScale , maxH=this._height*this._realScale ; // sth like "111.11px"
	const w=ele.width*this._realScale , h=ele.height*this._realScale ;
	const w2=(maxW-(p?p.clientWidth:w))/2 , h2=(maxH-(p?p.cilentHeight:h))/2 ;
	const css=ele.style;
	css.position = 'absolute';
	css.margin = 'auto';
	css.top = h2+'px';
	css.left = w2+'px';
	css.right = w2+'px';
	css.bottom = h2+'px';
	css.width = w+'px';
	css.height = h+'px';
	return ele;
};
$aaaa$._makeErrorHtml=(name, message)=>d.ce("div").sa("style","background-color:rgba(0,0,0,0.5);").ac(
	d.ce("font").sa("color","yellow").ac(
		d.ce("b").at(name)
	)
).ac(d.ce("br")).ac(
	d.ce("font").sa("color","white").at(message)
).ac(d.ce("br"));
$d$=$aaaa$.printError=function f(name, message){
	this._errorShowed=true;
	const div999=d.ge('div999');
	if(div999) div999.sa('class','none');
	const ep=this._errorPrinter;
	if(ep){
		let btn=d.ce('button').at('Restart the game');
		btn.onclick=f.restart;
		ep.rf(0).ac(this._makeErrorHtml(name, message)).ac(btn);
		if(name==="UnknownError"){
			if(objs.isDev) console.log(message.stack);
		}
	}
	this._applyCanvasFilter();
	this._clearUpperCanvas();
};
$d$.restart=function f(){
	// revert Graphics._applyCanvasFilter
	let g=Graphics;
	let s=g._canvas.style;
        s.webkitFilter = '';
        s.filter = '';
        s.opacity = 1;
	
	g._errorPrinter.rf(0);
	try{
		g._renderer.clear();
	}catch(e){
		;
	}
	window['/tmp/']._laterScenes.push(Scene_Title); // prepare next-2 scene
	let sm=SceneManager;
	if(sm._scene) if(sm._scene._mapNameWindow) sm._scene.stop(); else sm._scene._active=false;
	try{
		sm.goto(Scene_Black); // block current scene
		sm.changeScene(true);
	}catch(e){ // probably fail on '_scene.stop'
		sm._scene=null;
		sm.changeScene(true);
	}
	sm.resume();
	TouchInput.clear();
	const div999=d.ge('div999');
	if(div999) div999.sa('class','');
};
$d$=$aaaa$.printLoadingError=function f(type,url){
	//console.log("Graphics.printLoadingError");
	let rtv=this._errorPrinter;
	if (this._errorPrinter && !this._errorShowed) {
		// create error board
		this._errorPrinter.rf(0).ac(this._makeErrorHtml("Loading Error", "Failed to load: " + url));
		this._errorPrinter.style.zIndex=999;
		
		// retry?
		let btn = d.ce('button').at("Retry");
		btn.onmousedown = btn.ontouchstart = function(event) {
			ResourceHandler.retry();
			event.stopPropagation();
			rtv.style.zIndex=99;
		};
		this._errorPrinter.ac(btn);
		this._loadingCount = -Infinity;
		
		let alt=f.alts[type];
		if(alt) alt(this);
		
		let arr=this._errorPrinter.querySelectorAll("button"); //let arr=d.querySelectorAll('#ErrorPrinter>button');
		// clear btn.style.backgroundColor so they can use style sheet
		//for(let x=0;x!==arr.length;++x) if(arr[x].style) arr[x].style.backgroundColor='';
		// adjust width,height to the same
		let w=0,h=0;
		for(let x=0;x!==arr.length;++x){
			if(w<arr[x].offsetWidth ) w=arr[x].offsetWidth ;
			if(h<arr[x].offsetHeight) h=arr[x].offsetHeight;
		}
		if(w&&h){ // both none zero
			++w;++h; // offset width/height are integer "measurement"s
			for(let x=0;x!==arr.length;++x){
				arr[x].style.width =w+'px';
				arr[x].style.height=h+'px';
			}
		}
	}
	return rtv;
};
$d$.alts={
	'img':self=>{
		// using transparent image?
		let btn = d.ce('button');
		btn.ac(d.ce('div').at('Give up')).ac(d.ce('div').at('(use 1x1 transparent image)'));
		btn.onmousedown = btn.ontouchstart = function(evt) {
			ResourceHandler.retry(1);
			evt.stopPropagation();
			self._errorPrinter.style.zIndex=99;
		};
		self._errorPrinter.ac(d.ce('br')).ac(btn);
		self._loadingCount = -Infinity;
	},
	'audio':self=>{
		// using transparent image?
		let btn = d.ce('button');
		btn.ac(d.ce('div').at('Give up')).ac(d.ce('div').at('(use empty audio)'));
		btn.onmousedown = btn.ontouchstart = function(evt) {
			ResourceHandler.retry(1);
			evt.stopPropagation();
		};
		self._errorPrinter.ac(d.ce('br')).ac(btn);
		self._loadingCount = -Infinity;
	},
	//'video':self=>{},
	//'map':self=>{},
};
$aaaa$.eraseLoadingError=function(){
	if(this._errorPrinter && !this._errorShowed){
		this._errorPrinter.rf(0); // prevent from using '.innerHTML'
		this.startLoading();
	}
};
$d$=$aaaa$._switchPauseBtn=function f(){
	const btn=f.tbl[1];
	if(!btn){
		d.body.ac(f.tbl[1]=d.ce('button').ac(
			d.ce('div').at("pause")
		).sa('style',"position:absolute;right:0px;margin:11px;z-index:1022;"));
		f.tbl[1].onmspointerdown=f.tbl[1].onpointerdown=f.tbl[1].onclick=f.tbl[0];
	}else if(btn.ga('class')==="none") btn.sa('class','');
	else btn.sa('class',"none");
};
$d$.tbl=[e=>{
	e.stopImmediatePropagation();
	e.preventDefault();
	SceneManager.pause();
	Input.clear();
	Input.update();
	TouchInput.update();
},undefined];
$pppp$=$aaaa$=undef;

// - Bitmap
$aaaa$=Bitmap;
$pppp$=$aaaa$.prototype;
$pppp$._reCreateTextureIfNeeded=function(w,h){
	if(this.__canvas){
		const c=this.__canvas;
		if(Graphics.isWebGL() && w*h===0) h=w=1;
		const r=c.width<w||c.height<h;
		c.width=w;
		c.height=h;
		if(r){
			this._createBaseTexture(c);
			return true;
		}
	}
};
$r$=$pppp$.initialize;
$d$=$pppp$.initialize=function f(w,h){
	this._reCreateTextureIfNeeded(w,h);
	f.ori.call(this,w,h);
	this.clearRect(0,0,1,1); // cleared 'CanvasRenderingContext2D' drawn faster
	this._loadListeners=new Queue();
	this.fontFace=_global_conf.useFont;
}; $d$.ori=$r$;
$aaaa$.load=function f(url,key,type){
	if(url==="data:,") return ImageManager.loadEmptyBitmap();
	//let sharp=url.indexOf("#");
	let idx=url.indexOf("?"),args;
	//if(sharp===-1) sharp=url.length;
	//else if(sharp<idx) idx=-1;
	if(idx!==-1){
		const arr=url.slice(idx+1).split("&");
		//const arr=url.slice(idx+1,sharp).split("&");
		args={};
		for(let x=0;x!==arr.length;++x){
			const s=arr[x]; if(s.length===0) continue;
			const tmp=s.split('=');
			args[decodeURIComponent(tmp[0])]=tmp[1]===undefined?true:decodeURIComponent(tmp[1]);
		}
	}
	
	// ori: Bitmap.load
	let rtv = Object.create(Bitmap.prototype);
	rtv._defer = true;
	rtv._args=args; // added
	for(let i in type) rtv[i]=type[i];
	rtv.initialize();
	rtv._decodeAfterRequest = true;
	rtv._requestImage(url);
	//return rtv;
	
	rtv._cacheKey=key;
	return rtv;
};
Object.defineProperty(Bitmap.prototype, 'paintOpacity',{
	get: function(){ return this._paintOpacity; },
	set: function(value){
		this._paintOpacity = value;
		this._context.globalAlpha = this._paintOpacity / 255;
	},
	configurable: true,
});
$d$=$pppp$.drawText=function f(text,x,y,maxWidth,lineHeight,align,rect){
	// rewrite: actual line height is about 1.25x fontsize. draw @ y = 1x fontsize.
	// Note: Firefox has a bug with textBaseline: Bug 737852
	//	   So we use 'alphabetic' here.
	if (text !== undefined) {
		if(rect&&rect.constructor!==Rectangle) rect=undefined;
		
		let tx = x;
		// let ty = y + lineHeight - ( lineHeight - this.fontSize * 1.25 )/2 - this.fontSize * 0.25;
		const ty = y + (lineHeight>>1) + this.fontSize * 0.375;
		maxWidth = maxWidth || 0x7fffffff;
		if(align === 'center') tx += maxWidth>>1;
		if(align === 'right') tx += maxWidth;
		const ctx = this._context;
		let context=ctx,dx=0,dy=0;
		const alpha = context.globalAlpha;
		
		if(rect){
			f.tbl.width =rect.width ;
			f.tbl.height=rect.height;
			context=this.__context=f.tbl.getContext('2d');
			dx=-rect.x;
			dy=-rect.y;
		}else context.save();
		
		context.font = this._makeFontNameText();
		context.textAlign = align;
		context.textBaseline = 'alphabetic';
		context.globalAlpha = 1;
		this._drawTextOutline(text, tx+dx, ty+dy, maxWidth);
		context.globalAlpha = alpha;
		this._drawTextBody(text, tx+dx, ty+dy, maxWidth);
		
		if(rect){
			const c=f.tbl,w=c.width,h=c.height;
			(this.__context=ctx).drawImage(c,rect.x,rect.y);
		}else context.restore();
		
		this._setDirty();
		return ty;
	}
};
$d$.tbl=d.ce('canvas');
$r$=$pppp$.measureTextWidth;
$d$=$pppp$.measureTextWidth=function f(txt){
	//debug.log(txt,this.fontFace); // mostly are chr not string // debug
	if(!txt) return 0;
	txt=txt.replace(/(\碧|\筵|\綰)/g,'一'); // bug: https://zh.wikipedia.org/zh-tw/%E5%BE%AE%E8%BB%9F%E6%AD%A3%E9%BB%91%E9%AB%94#%E5%B7%B2%E7%9F%A5%E5%95%8F%E9%A1%8C
	return f.ori.call(this,txt);
}; $d$.ori=$r$;
if(0&&0){
$pppp$._addNoteRefresh=function(sprite){
	if(!(Graphics.isWebGL()&&this._args)) return; // no need
	if(!this._noteRefresh) this._noteRefresh=new Set();
	if(sprite&&sprite._refresh) this._noteRefresh.add(sprite);
};
$d$=$pppp$._doNoteRefresh=function f(){
	if(!this._noteRefresh) return;
	if(Graphics.isWebGL()&&this._args) this._noteRefresh.forEach(f.forEach);
	this._noteRefresh.clear();
	console.log(this._url);
};
$d$.forEach=c=>c._refresh();
}
$pppp$._editAccordingToArgs_chr2sv=function(src){
	const chridx=Number(this._args.chr2sv);
	if(isNaN(chridx)) return src;
	if(!this._dones) this._dones={};
	const reflect_h=this._args.reflect_h && !this._dones.reflect_h;
	this._chridx=chridx;
	this._chr2svChanged=true;
	const c=d.ce('canvas'); c.width=9<<6; c.height=6<<6;
	let c2=d.ce('canvas'),c3=d.ce('canvas'); c3.height=c3.width=c2.height=c2.width=1<<6;
	// suppose not bigChr // because I'm lazy
	let sx,sy;
	if(true){
		let pw=src.width/3,ph=src.height>>2;
		if(!this._isBigChr){
			pw>>=2;
			ph>>=1;
		}
		sx=( (chridx&3)*3 +1)*pw;
		sy=(((chridx|3)^3)+1)*ph;
		const dstw=c2.width,dsth=c2.height;
		{
			const ctx=c2.getContext('2d');
			if(reflect_h){
				ctx.scale(-1,1);
				ctx.translate(-dstw,0);
			}
			//ctx.clearRect(0,0,dstw,dsth);
			ctx.globalCompositeOperation='copy';
			ctx.drawImage(src,sx,sy,pw,ph,0,0,dstw,dsth);
		}
		{
			const ctx=c3.getContext('2d');
			ctx.rotate(Math.PI/2); // rotate canvas according to origin (default=(0,0))
			ctx.translate(0,-dsth); // move origin to delta ((0,0)=unchanged)
			ctx.globalCompositeOperation='copy';
			ctx.drawImage(c2,0,0);
			ctx.globalCompositeOperation = 'source-atop';
			ctx.fillStyle = 'rgba(0,0,0,0.5)';
			ctx.fillRect(0, 0, dstw, dsth);
		}
		const ctx=c.getContext('2d');
		for(let y=0;y!=6;++y){ for(let x=0;x!==9;++x){
			if(y*9+x===51) c2=c3;
			ctx.drawImage(c2,x*dstw,y*dsth,dstw,dsth);
		} }
	}
	if(reflect_h) this._dones.reflect_h=true;
	return c;
};
$d$=$pppp$._editAccordingToArgs_scale=function f(src){
	let scale=Number(this._args.scale);
	if(isNaN(scale)) return src;
	this._scale=scale;
	this._scaleChanged=true;
	let c=d.ce('canvas');
	if(this._isTile){
		// prevent edge blur: draw seperately
		const pw=$gameMap.tileWidth()|0,ph=$gameMap.tileHeight()|0;
		const pwS=~~(pw*scale),phS=~~(ph*scale);
		this._pw=pwS; this._ph=phS; 
		let xs=~~(src.width/pw),ys=~~(src.height/ph);
		f.f(c,src,xs,ys,pw,ph,pwS,phS);
	}else{
		if(this._url.match(/(^|\/)img\/(sv_)?enemies/)){
			c.width=src.width*scale; c.height=src.height*scale;
			const ctx=c.getContext('2d');
			ctx.globalCompositeOperation='copy';
			ctx.drawImage(src,0,0,c.width,c.height);
		}else{
			let pw=src.width/3,ph=src.height>>2;
			if(!this._isBigChr){
				pw>>=2;
				ph>>=1;
			}
			const pwS=~~(pw*scale),phS=~~(ph*scale);
			this._pw=pwS; this._ph=phS; 
			const xs=~~(src.width/pw),ys=~~(src.height/ph);
			f.f(c,src,xs,ys,pw,ph,pwS,phS);
		}
	}
	this._reCreateTextureIfNeeded(c.width,c.height);
	return c;
};
{ const tmpCanvas=document.createElement('canvas');
$d$.f=(dst,src,xs,ys,pw,ph,pwS,phS)=>{
	dst.width=pwS*xs; dst.height=phS*ys;
	const ctx=dst.getContext('2d');
	const tmpc=tmpCanvas; tmpc.width=pw; tmpc.height=ph;
	const tmpctx=tmpc.getContext('2d');
	//ctx.globalCompositeOperation='copy';
	tmpctx.globalCompositeOperation='copy';
	for(let y=0;y!==ys;++y){ for(let x=0;x!==xs;++x){
		//tmpctx.clearRect(0,0,pw,ph);
		tmpctx.drawImage(src, x*pw,y*ph,pw,ph, 0,0,pw,ph);
		ctx.drawImage(tmpc, x*pwS,y*phS,pwS,phS);
	} }
};
}
$pppp$._editAccordingToArgs=function(){
	// this function cannot exec twice if scaling happens
	// * reserve this behavior for debugging
	if(!this._image_ori) this._image_ori=this._image;
	let src=this._image_ori;
	let commonFlags = src.width*src.height>=2;
	if(!commonFlags || !this._args) return;
	if(!this._dones) this._dones={};
	// chr2sv
	if( !this._chr2svChanged && commonFlags && this._args.chr2sv!==undefined ){
		src=this._editAccordingToArgs_chr2sv(src);
	}
	// change color
	if( !this._colorChanged && commonFlags && this._args.color!==undefined ){
		this._colorChanged=true;
		const color=JSON.parse(this._args.color);
		const invert=!!color[3],w=[];
		for(let c=0;c!==3;++c){ // color.length===3 // rgb
			w[c]=0;
			for(let x=0,arr=color[c];x!==3;++x) // color[c].length===3
				w[c]+=arr[x];
			if(color[c][3]) w[c]+=color[c][3]; // degrade color
			if(w[c]===0) w[c]=1; // ensurance
		}
		const c=d.ce('canvas'); c.width=src.width; c.height=src.height;
		const ctx=c.getContext('2d');
		ctx.globalCompositeOperation='copy';
		ctx.drawImage(src,0,0);
		const tmp=ctx.getImageData(0,0,c.width,c.height);
		for(let x=0,xs=(c.width*c.height)<<2;x!==xs;x+=4){
			let curr=[];
			for(let c=0;c!==3;++c) curr[c]=tmp.data[x+c]; // rgb
			for(let c=0;c!==3;++c){ // rgb
				let sum=0;
				for(let cc=0;cc!==3;++cc) sum+=color[c][cc]*curr[cc];
				tmp.data[x+c]=invert?0xFF&~(sum/w[c]):~~(sum/w[c]);
			}
		}
		ctx.putImageData(tmp,0,0);
		src=c;
	}
	// change grayscale
	if( !this._grayscaled && commonFlags && this._args.grayscale!==undefined ){
		this._grayscaled=true;
		const grayscale=JSON.parse('['+this._args.grayscale+']');
		const grayRate=grayscale[0], toColor=grayscale[1] , toColorRate=grayscale[2];
		const c=d.ce('canvas'); c.width=src.width; c.height=src.height;
		const ctx=c.getContext('2d');
		ctx.globalCompositeOperation='copy';
		ctx.drawImage(src,0,0);
		const xs=c.width*c.height<<2,tmp=ctx.getImageData(0,0,c.width,c.height);
		for(let x=0,gsc=1-grayRate;x!==xs;x+=4){
			let sum=0;
			for(let c=0;c!==3;++c) sum+=tmp.data[x+c];
			for(let c=0,v=grayRate*~~(sum/3);c!==3;++c) tmp.data[x+c]=tmp.data[x+c]*gsc+v;
		}
		if(!isNaN(toColorRate)){
			for(let x=0,tcrc=1-toColorRate;x!==xs;x+=4){
				for(let c=0;c!==3;++c) tmp.data[x+c]=tmp.data[x+c]*tcrc+toColorRate*toColor[c];
			}
		}
		ctx.putImageData(tmp,0,0);
		src=c;
	}
	if( !this._dones.reflect_h && commonFlags && this._args.reflect_h!==undefined ){
		this._dones.reflect_h=true;
		ImageManager._putPatternSize(this,this._image_ori);
		const c=d.ce('canvas');       c.width=src.width;    c.height=src.height;
		const ctx=c.getContext('2d');
		const tmpc=d.ce('canvas'); tmpc.width=this._pw;  tmpc.height=this._ph;
		const tmpctx=tmpc.getContext('2d');
		tmpctx.scale(-1,1); tmpctx.translate(-tmpc.width,0);
		//ctx.globalCompositeOperation='copy';
		tmpctx.globalCompositeOperation='copy';
		for(let y=0;y<c.height;y+=tmpc.height){ for(let x=0;x<c.width;x+=tmpc.width){
			// WARNING: suppose no precision errors
			tmpctx.drawImage(src,x,y,tmpc.width,tmpc.height,0,0,tmpc.width,tmpc.height);
			ctx.drawImage(tmpc,x,y,tmpc.width,tmpc.height);
		} }
		src=c;
	}
	// scale
	if( !this._scaleChanged && commonFlags && this._args.scale!==undefined ){
		src=this._editAccordingToArgs_scale(src);
	}
	this._image=src;
	return true;
};
$pppp$._createCanvas=function(width, height){
	this.__canvas = this.__canvas || document.ce('canvas');
	this.__context = this.__canvas.getContext('2d');
	
	let min=Graphics.isWebGL()>>0; // !! using >>> cause lag
//	// must >=1 else shadertilemap crash
//	let min=1; // much slower than 0 when canvas mode
	if(this._image){
		this.__canvas.width = this._image.width>>0||min;
		this.__canvas.height = this._image.height>>0||min;
		
		min&=this._editAccordingToArgs();
		this._createBaseTexture(this._canvas); // 'this._canvas': img->canvas
		
		this.__context.drawImage(this._image, 0, 0);
	}else{
		this.__canvas.width = width>>0||min;
		this.__canvas.height = height>>0||min;
	}
	this._setDirty();
};
$r$=$pppp$._createBaseTexture;
$d$=$pppp$._createBaseTexture=function f(srcObj){
	f.ori.call(this,srcObj);
	this._canvas; // if(this._image): cause __baseTexture.source from 'img' become 'canvas'. this increases drawing speed
}; $d$.ori=$r$;
// not sure
$pppp$.bltImage=function(source, sx, sy, sw, sh, dx, dy, dw, dh){ // rewrite: can use/draw on out-of-bound pixels
	dw = dw || sw;
	dh = dh || sh;
	if ( sw > 0 && sh > 0 && dw > 0 && dh > 0 && dw+dh !== 2 ) {
		this._context.globalCompositeOperation = 'source-over';
		this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);
		this._setDirty();
	}
};
$r$=$pppp$.decode=function(){
	switch(this._loadingState){
		case 'requestCompleted': case 'decryptCompleted':
			this._loadingState = 'loaded';

			if(!this.__canvas) this._createBaseTexture(this._image);
			this._setDirty();
			this._callLoadListeners();
			break;

		case 'requesting': case 'decrypting':
			this._decodeAfterRequest = true;
			if (!this._loader) {
				this._loader = ResourceHandler.createLoader('img',this._url, this._requestImage.bind(this, this._url), this._onError.bind(this));
				this._image.removeEventListener('error', this._errorListener);
				this._image.addEventListener('error', this._errorListener = this._loader);
			}
			break;

		case 'pending': case 'purged': case 'error':
			this._decodeAfterRequest = true;
			this._requestImage(this._url);
			break;
	}
};
$d$=$pppp$.decode=function f(){
	let flag=!this._loader && this._loadingState.slice(-4)==='ting'; // case 'requesting': case 'decrypting':
	f.ori.call(this);
	if(flag){
		this._image.removeEventListener('error', this._errorListener);
		this._image.addEventListener('error',this._errorListener=this._loader = ResourceHandler.createLoader('img',this._url,this._requestImage.bind(this),this._onError.bind(this) ));
	}
}; $d$.ori=$r$;
$d$=$pppp$._requestImage=function f(url){
	if(Bitmap._reuseImages.length !== 0){
		this._image = Bitmap._reuseImages.pop();
	}else{
		this._image = new Image();
	}
	
	if (this._decodeAfterRequest && !this._loader) {
		this._loader = ResourceHandler.createLoader('img',url, this._requestImage.bind(this), this._onError.bind(this));
	}
	
		//this._image = new Image();
		this._url = url;
	if(!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
		this._loadingState = 'decrypting';
		Decrypter.decryptImg(url, this);
	} else {
		this._loadingState = 'requesting';
		this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
		{ // cache?
			let im=ImageManager;
			let urlWithoutArgs=im._trimMetaArgs(url);
			if(urlWithoutArgs!==url){
				const newOnload=(bm)=>{
					this._image=bm._image_ori||bm._image;
					this._loadListener();
				},c=im._imageCache.get(urlWithoutArgs+":0");
				if(c) c.addLoadListener(newOnload);
				else im.loadNormalBitmap(urlWithoutArgs,0).addLoadListener(newOnload);
				return;
			}
		}
		if( this._loader && url.slice(0,5)!=="blob:" && !_global_conf.isDataURI(url) ){
			this._loadListener = Bitmap.prototype._onLoad.bind(this);
			this._errorListener = this._loader;
			_global_conf['jurl'](url,"HEAD",undef,undef,'arraybuffer',undef,xhr=>{
				if(xhr.readyState===4){
					let status=xhr.status.toString()[0];
					switch(status){
						default: // retry
							this._errorListener();
						break;
						case '2':{ // ok
							let img=this._image;
							//if(img.constructor!==HTMLImageElement) this._image=
							img.onerror=f.onerr; let timeout=Number(localStorage.getItem('_errCnt'))^0; timeout*=timeout>0; localStorage.setItem('_errCnt',timeout);
							img.setLoadSrcWithTimeout(url,(1024<<(Math.min(timeout,19)+1))+f.baseTimeout);
							break;
						}break;
						case '4': // fail
							this._errorListener(inf);
						break;
					}
				}
			},f.baseTimeout);
		}else{
			this._image.ae('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
			//this._image.src=url;
			this._image.setLoadSrcWithTimeout(url,f.baseTimeout);
		}
	}
};
$d$.baseTimeout=location.protocol==="https:"?8763:487;
$d$.onerr=function f(){ this.onerror=null;
	let src=this.src; this.src='';
	debug.warn("err:","loading",src);
	if(!(this._errCnt>=0)) this._errCnt=0;
	if(21<++this._errCnt){ this._errCnt=21; localStorage.setItem('_errCnt',21); }
	if((Number(localStorage.getItem('_errCnt'))^0)>=this._errCnt) ;
	else localStorage.setItem('_errCnt',this._errCnt);
	setTimeout(()=>{ this.onerror=f; this.setLoadSrcWithTimeout(src,0xC8763<<(this._errCnt)); },111);
};
$pppp$=$aaaa$=undef;

// - ScreenSprite
$aaaa$=ScreenSprite;
$pppp$=$aaaa$.prototype;
$pppp$.setColor=function(r, g, b){
	//debug.log('ScreenSprite.prototype.setColor');
		r &= 0xFF;
		g &= 0xFF;
		b &= 0xFF;
	if (this._red !== r || this._green !== g || this._blue !== b) {
		this._red = r;
		this._green = g;
		this._blue = b;
		this._colorText = Utils.rgbToCssColor(r, g, b);

		let graphics = this._graphics;
		graphics.clear();
		let intColor = (r << 16) | (g << 8) | b;
		graphics.beginFill(intColor, 1);
		graphics.drawRect(0,0, Graphics.width , Graphics.height );
	}
};
$pppp$=$aaaa$=undef;

// - ToneSprite
$aaaa$=ToneSprite;
$pppp$=$aaaa$.prototype;
$d$=$pppp$._renderCanvas = function f(renderer) { // rewrite: wtf the original one draws 3 times when negtive color values only
	// lazy update , suppose effects are uniformly applied to each pixel
	if (this.visible) {
		const ctx = renderer.context , width = ctx.canvas.width , height = ctx.canvas.height;
		ctx.save();
// test
if(0){
}
// END test
		{
			const t = this.worldTransform , r = renderer.resolution;
			ctx.setTransform(t.a, t.b, t.c, t.d, t.tx * r, t.ty * r);
		}
		if(Graphics._canUseSaturationBlend && 0<this._gray){
			ctx.globalCompositeOperation = f.saturation;
			ctx.globalAlpha = (this._gray+1) / 256;
			ctx.fillStyle = f.black;
			ctx.fillRect(0, 0, width, height);
			ctx.globalAlpha = 1;
		}
		{
			let r1 = Math.max(0, this._red)>>>0;
			let g1 = Math.max(0, this._green)>>>0;
			let b1 = Math.max(0, this._blue)>>>0;
			if (r1 || g1 || b1) {
				ctx.globalCompositeOperation = f.lighter;
				ctx.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
				ctx.fillRect(0, 0, width, height);
			}
		}
		if(Graphics._canUseMultiplyBlend){
			let r2 = Math.max(0, -this._red)>>>0;
			let g2 = Math.max(0, -this._green)>>>0;
			let b2 = Math.max(0, -this._blue)>>>0;
			if (r2 || g2 || b2) {
				if($gameScreen.limitedView){
					ctx.fillStyle = f.black;
					ctx.globalCompositeOperation = 'destination-atop';
					ctx.fillRect(0,0,width,height);
				}
				ctx.globalCompositeOperation = f.multiply;
				// canvas color clamp to [0,255]
				ctx.fillStyle = Utils.rgbToCssColor(255-r2, 255-g2, 255-b2);
				ctx.fillRect(0, 0, width, height);
			}
		}else if (Graphics._canUseDifferenceBlend) {
			let r2 = Math.max(0, -this._red)>>>0;
			let g2 = Math.max(0, -this._green)>>>0;
			let b2 = Math.max(0, -this._blue)>>>0;
			if (r2 || g2 || b2) {
				ctx.globalCompositeOperation = f.difference;
				ctx.fillStyle = f.white;
				ctx.fillRect(0, 0, width, height);
				ctx.globalCompositeOperation = f.lighter;
				ctx.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
				ctx.fillRect(0, 0, width, height);
				ctx.globalCompositeOperation = f.difference;
				ctx.fillStyle = f.white;
				ctx.fillRect(0, 0, width, height);
			}
		}
		ctx.restore();
	}
};
$d$.black='#000000';
$d$.difference='difference';
$d$.gc=undefined;
$d$.lighter='lighter';
$d$.multiply='multiply';
$d$.saturation='saturation';
$d$.white='#FFFFFF';
$pppp$=$aaaa$=undef;

// - sprite
$aaaa$=Sprite;
$pppp$=$aaaa$.prototype;
$k$='initialize';
$r$=$pppp$[$k$]; ($pppp$[$k$]=function f(){
	f.ori.apply(this,arguments);
	this.oy=undefined;
	this._z2=0;
}).ori=$r$;
// notify parent:Tilemap
//
$pppp$.remove=function(){
	if(this.parent)
		if(this.parent.waitRemove){
			this.visible=false;
			return this.parent.waitRemove(this);
		}else this.parent.removeChild(this);
};
if(0) Object.defineProperties($pppp$,{ // ?!?!?!?!?
	y:{get:function(){
		return this.position.y;
	},set:function(rhs){ rhs^=0; // this.y=rhs;
		if(this._character===$gamePlayer || this.oy===undefined && this.y!==rhs){
			const lk=this._lastKey; if(lk){
				const p=this.parent;
				let y=rhs+$gameMap._displayY_th,c=this._character; if(c) y+=c.screenY_deltaToParent()*$gameMap.tileHeight(); // so that player won't "split" multi-event events
				if((p instanceof Tilemap)){
					const oldy=lk[0]&0xFFFF0;
					y+=p._tileHeight; y*=y>=0; y&=0xFFFF; y<<=4;
					if(oldy!==y){
						p.rmc_tree(lk); lk[0]+=y-oldy;
						p.addc_tree(lk,this);
					}
				}
			}
			return this.transform.position.y=rhs;
		}else return rhs;
	},configurable:false},
	z:{get:function(){
		return this._z;
	},set:function(rhs){ rhs^=0; // this.z=rhs;
		if(this.z!==rhs){
			const lk=this._lastKey; if(lk){
				const p=this.parent;
				if((p instanceof Tilemap)){
					const oldz=lk[0]&0xF00000;
					let z=rhs; z*=z>=0;  z<<=20;
					if(oldz!==z){
						p.rmc_tree(lk); lk[0]+=z-oldz;
						p.addc_tree(lk,this);
					}
				}
			}
			return this._z=rhs;
		}else return rhs;
	},configurable:false},
	z2:{get:function(){
		return this._z2;
	},set:function(rhs){ rhs^=0; // this.z2=rhs;
		if(this.z2!==rhs){
			const lk=this._lastKey; if(lk){
				const p=this.parent;
				if((p instanceof Tilemap)){
					const oldz2=lk[0]&0xF;
					let z2=rhs; z2*=z2>=0; z2&=0xF;
					if(oldz2!==z2){
						p.rmc_tree(lk); lk[0]+=z2-oldz2;
						p.addc_tree(lk,this);
					}
				}
			}
			return this._z2=rhs;
		}else return rhs;
	},configurable:false},
});
else Object.defineProperties($pppp$,{
	y:{get:function(){
		return this.position.y;
	},set:function(rhs){ rhs|=0; // this.y=rhs;
		if(this._character===$gamePlayer || this.oy===undefined && this.y!==rhs) return this.transform.position.y=rhs;
		else return rhs;
	},configurable:false},
	z:{
		get:function(){return this._z;},
		set:function(rhs){return this._z=rhs|0;},
	},
	z2:{
		get:function(){return this._z2;},
		set:function(rhs){return this._z2=rhs|0;},
	},
});
Object.defineProperty($pppp$, 'opacity', {
	get:function(){ const rtv=this.alpha; return rtv?rtv*256+1:0; },
	set:function(val){ this.alpha = (val>0?val+1:0) / 256; },
	configurable:true,
});
$pppp$.update=function f(){ // overwrite, forEach is slowwwwwwwwww
	for(let arr=this.children,x=arr.length;x--;){ let child=arr[x];
		child && child.update && child.update();
	}
};
$pppp$.move=function(x,y){
	if(this._character===$gamePlayer || this.oy===undefined){
		this.transform.position.pos(x,y);
	}
};
$pppp$.setFrameB=function(x,y,xe,ye){
	// set by bound;
	this.setFrame(x,y,(x<xe)*(xe-x),(y<ye)*(ye-y));
};
$pppp$._refresh=function(){
	//debug.log2("Sprite.prototype._refresh");
	let tmp;
	const frameX = ~~this._frame.x;
	const frameY = ~~this._frame.y;
	const bitmapW = this._bitmap ? this._bitmap.width : 0;
	const bitmapH = this._bitmap ? this._bitmap.height : 0;
	const realX = frameX<bitmapW?frameX<0?0:frameX:bitmapW;
	const realY = frameY<bitmapH?frameY<0?0:frameY:bitmapH;
	let realW = (~~this._frame.width ) - realX + frameX;
	if(realW<0) realW=0; else{ tmp = bitmapW - realX; if(realW>tmp) realW=tmp; }
	let realH = (~~this._frame.height) - realY + frameY;
	if(realH<0) realH=0; else{ tmp = bitmapH - realY; if(realH>tmp) realH=tmp; }
	
	this._realFrame.x = realX;
	this._realFrame.y = realY;
	this._realFrame.width = realW;
	this._realFrame.height = realH;
	this.pivot.x = frameX - realX;
	this.pivot.y = frameY - realY;
	
	if(0<realW && 0<realH){
		if(this._needsTint()){
			this._createTinter(realW, realH);
			this._executeTint(realX, realY, realW, realH);
			this._tintTexture.update();
			this.texture.baseTexture = this._tintTexture;
			this.texture.frame = new Rectangle(0, 0, realW, realH);
		}else{
			if(this._bitmap) this.texture.baseTexture = this._bitmap.baseTexture;
			/* / // seems should not happen
			// TODO?:WA
			let w= this._frame.x + this._frame.width;
			let h= this._frame.y + this._frame.height;
			let tex=this.texture.baseTexture;
			if(tex.width<w) tex.width=w;
			if(tex.height<h) tex.height=h;
			// */
			this.texture.frame = this._realFrame;
		}
	}else if(this._bitmap) this.texture.frame = Rectangle.emptyRectangle;
	else{
		this.texture.baseTexture.width = Math.max(this.texture.baseTexture.width, this._frame.x + this._frame.width);
		this.texture.baseTexture.height = Math.max(this.texture.baseTexture.height, this._frame.y + this._frame.height);
		this.texture.frame = this._frame;
	}
	this.texture._updateID++;
};
$pppp$._executeTint=function(x, y, w, h){
	// 雷ㄛ 在ToneSprite.prototype._renderCanvas知道要略過無效的特效,在這邊就不知道了
	const context = this._context;
	const tone = this._colorTone;
	const color = this._blendColor;
	
	context.globalCompositeOperation = 'copy';
	context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
	
	if(Graphics.canUseSaturationBlend() && tone[3]>0){
		context.globalCompositeOperation = 'saturation';
		context.fillStyle = 'rgba(255,255,255,' + Math.max(0, tone[3]+1) / 256 + ')';
		context.fillRect(0, 0, w, h);
	}
	
	if(tone[0]>0||tone[1]>0||tone[2]>0){
		context.globalCompositeOperation = 'lighter';
		context.fillStyle = Utils.rgbToCssColor(
			Math.max(0, tone[0])>>>0,
			Math.max(0, tone[1])>>>0,
			Math.max(0, tone[2])>>>0
		);
		context.fillRect(0, 0, w, h);
	}
	
	if(Graphics._canUseMultiplyBlend){ if(tone[0]<0||tone[1]<0||tone[2]<0){
		const r2 = Math.max(0, -tone[0])>>>0;
		const g2 = Math.max(0, -tone[1])>>>0;
		const b2 = Math.max(0, -tone[2])>>>0;
		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = Utils.rgbToCssColor(255-r2, 255-g2, 255-b2);
		ctx.fillRect(0, 0, w,h);
	} }else if(Graphics.canUseDifferenceBlend()&&(tone[0]<0||tone[1]<0||tone[2]<0)){
		context.globalCompositeOperation = 'difference';
		context.fillStyle = 'white';
		context.fillRect(0, 0, w, h);
		
		context.globalCompositeOperation = 'lighter';
		context.fillStyle = Utils.rgbToCssColor(
			Math.max(0, -tone[0])>>>0,
			Math.max(0, -tone[1])>>>0,
			Math.max(0, -tone[2])>>>0
		);
		context.fillRect(0, 0, w, h);
		
		context.globalCompositeOperation = 'difference';
		context.fillStyle = 'white';
		context.fillRect(0, 0, w, h);
	}
	
	if(color[3]>0){
		context.globalCompositeOperation = 'source-atop';
		context.fillStyle = Utils.rgbToCssColor(
			Math.max(0, color[0])>>>0,
			Math.max(0, color[1])>>>0,
			Math.max(0, color[2])>>>0
		);
		context.globalAlpha = Math.max(0, color[3]+1) / 256;
		context.fillRect(0, 0, w, h);
	}

	context.globalCompositeOperation = 'destination-in';
	context.globalAlpha = 1;
	context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
};
$pppp$.getRef=none;
$pppp$._setBitmap_args=function(){
	let hasSth=false,rtv={}; // args
	let r=this.getRef(),meta;
	if(!r) return;
	let data=r.getData();
	if(data.meta){
		if(data.anchory!==undefined) this.anchor.y=Number(data.anchory);
		let tmp;
		if(tmp=r._getColorEdt()){ rtv.color=tmp; hasSth=true; }
		if(tmp=r._getGrayEdt()){ rtv.grayscale=tmp; hasSth=true; }
		tmp=r._getScaleEdt();
		// rtv.scale=tmp; hasSth=true;
		tmp=this.scale.x=this.scale.y=Number(tmp)||1;
		if(this._txtSprite){
			const s=this._txtSprite.scale;
			s.x=s.y=1/tmp;
		}
	}
	return hasSth&&rtv;
};
$pppp$.viewRadius2=$pppp$.viewRadius1=undefined;
$pppp$=$aaaa$=undef; // END sprite

// - Spriteset_BattleFieldDamages
$aaaa$=function Spriteset_BattleFieldDamages(){
	this.initialize.apply(this, arguments);
};
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype=Object.create(Sprite.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.destructor = function(){
	const r=[]; this.children.forEach(v=>r.push(v));
	for(let x=r.length;x--;) this.removeChild(r[x]);
	for(let x=0;x!==r.length;++x) if(r[x].destructor) r[x].destructor();
	this.destroy( PIXI.Container.prototype.destructor.tbl ); // del children , sprites' textures
};
$r$=$pppp$.initialize;
$d$=$pppp$.initialize=function f(){
	f.ori.call(this);
	this.children=new Set();
}; $d$.ori=$r$;
$pppp$.removeChild=function(c){
	if(!this.children.has(c)) return;
	
	c.parent=null;
	c.transform._parentID = -1;
	this.children.delete(c);
	this._boundsID++;
	//this.onChildrenChange(0); // empty function
	c.emit('removed', this);
	
	c.destructor();
	//{ const r=c.children.slice(); for(let i=r.length;i--;) c.removeChildAt(i); }
	
	return c;
};
$pppp$.removeChildAt=function(){
	throw new Error('you should not use this function');
};
$pppp$.removeChildren=function(){
	const r=[]; this.children.forEach(v=>r.push(v));
	this.children.clear();
	for(let i=r.length;i--;){ const c=r[i];
		c.parent = null;
		if(c.transform) c.transform._parentID = -1;
		c.destructor();
	}
	this._boundsID++;
	this.onChildrenChange(0);
	for(let i=r.length;i--;) r[i].emit('removed', this);
	return r.reverse();
};
$pppp$.update=none;
$d$=$pppp$.updateTransform=function f(){
	this._boundsID++;
	
	this.transform.updateTransform(this.parent.transform);
	
	// TODO: check render flags, how to process stuff here
	this.worldAlpha = this.alpha * this.parent.worldAlpha;
	
	this.children.forEach(f.forEach);
};
$d$.forEach=c=>c.visible&&c.updateTransform();
$pppp$.renderCanvas=function(renderer){
	if(!this.visible || this.worldAlpha <= 0 || !this.renderable) return;
	if(this._mask) renderer.maskManager.pushMask(this._mask);
	
	this.children.forEach(c=>c.renderCanvas(renderer));
	
	if(this._mask) renderer.maskManager.popMask(renderer);
};
$pppp$.renderWebGL=function(renderer){
	if(!this.visible || this.worldAlpha <= 0 || !this.renderable) return;

	// do a quick check to see if this element has a mask or a filter.
	if(this._mask || this._filters) this.renderAdvancedWebGL(renderer);
	else{
		//this._renderWebGL(renderer); // this obj should be nothing but a container
		this.children.forEach(c=>c.renderWebGL(renderer));
	}
};
$pppp$.renderAdvancedWebGL=function(renderer){
	renderer.flush();
	const filters = this._filters , mask = this._mask;
	// push filter first as we need to ensure the stencil buffer is correct for any masking
	if(filters){
		if(!this._enabledFilters) this._enabledFilters = [];
		this._enabledFilters.length = 0;
		for(let i=0;i!==filters.length;++i) if(filters[i].enabled) this._enabledFilters.push(filters[i]);
		if(this._enabledFilters.length) renderer.filterManager.pushFilter(this, this._enabledFilters);
	}
	if(mask) renderer.maskManager.pushMask(this, this._mask);
	this._renderWebGL(renderer);
	
	//this._renderWebGL(renderer); // this obj should be nothing but a container
	this.children.forEach(c=>c.renderWebGL(renderer));
	
	renderer.flush();
	if(mask) renderer.maskManager.popMask(this, this._mask);
	if(filters && this._enabledFilters && this._enabledFilters.length) renderer.filterManager.popFilter();
};

// - Sprite_DamageChild
$aaaa$=function Sprite_DamageChild(){
	this.initialize.apply(this, arguments);
};
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype=Object.create(Sprite.prototype);
$pppp$.constructor = $aaaa$;
$pppp$.clearMember=function(bm){
	this._bitmap = null;
	this._frame = new Rectangle();
	this._realFrame = new Rectangle();
	this._blendColor = [0, 0, 0, 0];
	this._colorTone = [0, 0, 0, 0];
	this._canvas = null;
	this._context = null;
	this._tintTexture = null;
	
	this._isPicture = false;

	this.spriteId = Sprite._counter++;
	this.opaque = false;

	this.bitmap = bm;
};
($pppp$.refresh_do=function f(){
	if(this._needUpdateY){
		this._needUpdateY=false;
		this.updateY();
	}
	if(this._needRefreshAll){
		this._needRefreshAll=false;
		return f.ori.call(this);
	}
}).ori=$pppp$._refresh;
$pppp$._refresh=function(){
	this._needRefreshAll=true;
	SceneManager._addRefresh.call(this);
};
$pppp$.getUpdateCtr=function(){
	return 0|((this.parent && this.parent._updateCtr)-this._updateStrt);
};
$pppp$.refreshY=function(){
	this._needUpdateY=true;
	SceneManager._addRefresh.call(this);
};
$t$=($pppp$.updateY=function f(){
	if(this._idx===undefined) return;
	let arr=f.tbl[this._idx]; if(!arr) arr=f.tbl[this._idx]=[];
	const ctr=this.getUpdateCtr(); if(!ctr) return;
	if(!arr[0]){
		arr[0]=[this._getY(),-this._idx];
		arr._lst=0;
	}
	for(let i=arr._lst;i<ctr;++i){
		let ry=arr[i][0],dy=arr[i][1];
		ry+=(dy+=0.5);
		if(ry>=0){
			ry=0;
			dy*=-0.6; // -0.59375;
		}
		arr[i+1]=[ry,dy];
	} 
	arr._lst=ctr;
	{ const newy=~~arr[ctr][0];
	if(this.y!==newy) this.y=newy;
	}
}).tbl=[]; // [ idx -> [ t -> [ry,dy] ] ]
($pppp$._getY=function f(idx,t){
	idx|=0; t|=0;
	if(!idx||!t) return -40;
	return ~~f.tbl[idx][t][0];
}).tbl=$t$;

$pppp$=$aaaa$=undef;

Sprite_Damage.prototype.createChildSprite=function f(){
	const sp = new Sprite_DamageChild();
	sp.bitmap = this._damageBitmap;
	sp.anchor.x = 0.5;
	sp.anchor.y = 1;
	sp.ry = sp.y = sp._getY();
	this.addChild(sp);
	return sp;
};

// manager

// - StorageManager
$aaaa$=StorageManager;
$pppp$=$aaaa$.prototype;
$aaaa$.backup=function(savefileId){
	if(this.exists(savefileId)){
		if(this.isLocalMode()){
			const fs = require('fs');
			const dirPath = this.localFileDirectoryPath();
			const filePath = this.localFilePath(savefileId);
			//this.loadFromLocalFile(savefileId);
			const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, { encoding: 'utf8' }) : "";
			if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
			fs.writeFileSync(filePath+".bak", data);
		}else{
			const key = this.webStorageKey(savefileId);
			//this.loadFromWebStorage(savefileId);
			const item = localStorage.getItem(key);
			localStorage.setItem(key+"bak", item);
		}
	}
};
$aaaa$.webStorageKey=function(savefileId){
	if(savefileId < 0){
		return 'RPG Config';
	}else{
		const t=DataManager.getTitle();
		if(savefileId === 0) return 'RPG ' + t + ' Global';
		else return 'RPG ' + t + ' File%1'.format(savefileId);
	}
};

// - TextManager
TextManager.custom=(id)=>$dataCustom[id]||'';


// scene

// - Scene_MenuBase
$aaaa$=Scene_MenuBase;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.createHelpWindow;
$d$=$pppp$.createHelpWindow=function f(){
	f.ori.call(this);
	const w=this._helpWindow;
	w.fontSize=0;
	const fsz=w.standardFontSize();
	w.setFontsize((fsz>>1) + (fsz>>3));
	w.height=w.fittingHeight(3);
}; $d$.ori=$r$;
$pppp$.nextActor=function(){
	const rtv=$gameParty.makeMenuActorNext();
	this.updateActor();
	this.onActorChange();
	return this._actorIdx=rtv;
};
$pppp$.previousActor=function(){
	const rtv=$gameParty.makeMenuActorPrevious();
	this.updateActor();
	this.onActorChange();
	return this._actorIdx=rtv;
};

// - gameover
$aaaa$=Scene_Gameover;
$pppp$=$aaaa$.prototype;
$r$=$pppp$.start;
$d$=$pppp$.start=function f(){
	f.ori.call(this);
	let bs=this._backSprite;
	bs.x=(this.width -bs.width )>>1;
	bs.y=(this.height-bs.height)>>1;
}; $d$.ori=$r$;


// object

// - system
$aaaa$=Game_System;
$pppp$=$aaaa$.prototype;
$aaaa$.currMaxEnum=1;
$aaaa$.addEnum=objs._addEnum;
$aaaa$.addEnum("CACHEKEY_DATABASE").
	addEnum("CACHEKEY_DATABASE_OBJTOMETA").
	addEnum("__DUMMY");
$r$=$pppp$.initialize;
$d$=$pppp$.initialize=function f(){
	f.ori.call(this);
	this._settingKey=objs.confs.settingKey;
	this._usr=new Game_System.Usr;
	ConfigManager.ConfigOptionsWithSystem.forEach(x=>{
		if(!(x[0] in ConfigManager)) return;
		this._usr[x[0]]=x[1]===ConfigManager.readFlag?ConfigManager[x[0]]|0:ConfigManager[x[0]];
	});
	this._addedDataobj=[];
}; $d$.ori=$r$;
$d$=$aaaa$.Usr=function(){};
$d$.prototype.contructor=$d$;
Object.defineProperties($d$.prototype,{
	_noLeaderHp: { get: function(){ return this._noHpL; }, set: function(rhs){
			if(this._noHpL===rhs) return rhs;
			const p=SceneManager.isMap()&&SceneManager._scene._pannel;
			if(p&&p.hpl) p.hpl.visible=!rhs;
			return this._noHpL=0|!!rhs;
	}, configurable: false },
	_noLeaderMp: { get: function(){ return this._noMpL; }, set: function(rhs){
			if(this._noMpL===rhs) return rhs;
			const p=SceneManager.isMap()&&SceneManager._scene._pannel;
			if(p&&p.mpl) p.mpl.visible=!rhs;
			return this._noMpL=0|!!rhs;
	}, configurable: false },
});
$pppp$.onAfterLoad=function(){ // overwrite. wtf you forgot "pos"
	Graphics.frameCount = this._framesOnSave;
	if(this._bgmOnSave) AudioManager.playBgm(this._bgmOnSave,this._bgmOnSave.pos); else AudioManager.fadeOutBgm(1);
	if(this._bgsOnSave) AudioManager.playBgs(this._bgsOnSave,this._bgsOnSave.pos); else AudioManager.fadeOutBgs(1);
};
$pppp$.playtimeText=function(){
	let fc=Graphics.frameCount; if(fc>872654640) fc=872654640;
	let sec  =~~(fc/60);
	let min  =~~(sec/60); sec%=60;
	let hour =~~(min/60); min%=60;
	return (hour+'').padZero(2) + ':' + (min+'').padZero(2) + ':' + (sec+'').padZero(2);
};
$pppp$.sysSetting=function(){
	objs.funcs.sysSetting._.call(none,this._settingKey);
};
($pppp$.database_typeToArr=function f(type){
	// 1-indexed ; the order is according to MV editor
	if(f.tbl) return f.tbl[type];
	f.tbl={
		0: undefined,
		1: $dataActors,
		2: $dataSkills,
		3: $dataItems,
		4: $dataWeapons,
		5: $dataArmors,
		6: $dataTroops,
		7: $dataStates,
		8: $dataAnimations,
		9: $dataTilesets,
		null:undefined,
		undefined:undefined,
	};
	return f.apply(this,arguments);
}).tbl=undefined;
$pppp$._database_resetLen=function(){
	for(let t=1;t!==10;++t){
		const $data=this.database_typeToArr(t);
		if($data.baselen>=0) $data.length=$data.arrangeStart=$data.baselen;
	}
};
$pppp$._database_setCache_usedBy=function(dataobj,objinfo,type,cache){
	// objinfo={usedBy:[[usedById,1]],data:};
	cache=cache||this._database_getCache();
	cache.set(objinfo,type);
	cache.set(dataobj,objinfo);
	const arr=objinfo.usedBy;
	const m=arr.m=new Map();
	for(let x=0;x!==arr.length;++x) m.set(arr[x][0],x);
};
$pppp$._database_putAll=function(){
	// used when loadgame
	this._database_resetLen();
	const arrs=this._addedDataobj,cache=this._database_getCache();
	if(arrs){ let something=false; for(let t=0;t!==arrs.length;++t){
		const info=arrs[t],$data=this.database_typeToArr(t);
		if($data && info){
			// put data && set cache
			const arr=info.pushed;
			arr.m=new Map();
			for(let x=0;x!==arr.length;++x){
				arr.m.set(arr[x],x);
				const obj=$data[arr[x].data.id]=deepcopy(arr[x].data);
				obj.virtual=true;
				this._database_setCache_usedBy(obj,arr[x],t,cache);
				something=true;
			}
		}
	} if(something) Scene_Boot.prototype.arrangeData(); }else this._addedDataobj=[];
};
($pppp$._database_getCache=function f(){
	// $gameTemp is created each newgame/loadgame and will not be overwritten
	let rtv=$gameTemp.getCache(this,f.key);
	if(!rtv) $gameTemp.updateCache(this,f.key,rtv=new Map());
	// keys:
	// - dataobj (actual in $data*)
	// - objinfo = {usedBy:[],data:__template__}
	return rtv;
}).key=$aaaa$.CACHEKEY_DATABASE_OBJTOMETA;
$pppp$._database_encodeUsedBy=function(usedBy){
	// usedBy: actor , enemy , false-like for party
	// return (encoded as) actorId , -1 , 0
	return usedBy?(usedBy._actorId||-1):0;
};
$pppp$._database_trimToSave=function(dataobj){
	// must create new object
	// TODO
	let rtv;
	if(dataobj._arr){
		const dataArr=dataobj._arr;
		dataobj._arr=undefined;
		rtv=deepcopy(dataobj);
		dataobj._arr=dataArr;
	}else rtv=deepcopy(dataobj);
	return rtv;
};
$pppp$._database_addUsedBy=function(usedBy,dataobj,cache){
	cache=cache||this._database_getCache();
	const objinfo=cache.get(dataobj);
	const ub=objinfo&&objinfo.usedBy;
	if(!ub) return -1;
	const usedById=this._database_encodeUsedBy(usedBy);
	const idx=ub.m.get(usedById);
	if(idx>=0){
		++ub[idx][1];
		return idx;
	}else{
		const rtv=ub.length;
		ub.m.set(usedById,rtv);
		ub.push([usedById,1]);
		return rtv;
	}
};
$pppp$._database_strtIdx=function(arr){
	return (arr.baselen||arr.length)<<1;
};
$pppp$._database_delUsedBy=function(usedBy,dataobj,cache){
	cache=cache||this._database_getCache();
	const objinfo=cache.get(dataobj);
	const ub=objinfo&&objinfo.usedBy;
	if(!ub) return -1;
	const usedById=this._database_encodeUsedBy(usedBy);
	const idx=ub.m.get(usedById);
	if(idx>=0){
		if(--ub[idx][1]<=0){
			if(ub.length===1){
				cache.delete(dataobj);
				const type=cache.get(objinfo);
				cache.delete(objinfo);
				const sys=this._addedDataobj[type];
				if(sys){
					const arr=sys.pushed;
					const idx=arr.m.get(objinfo);
					if(idx>=0){
						arr.m.delete(objinfo);
						if(idx+1!==arr.length) arr.m.set(arr[idx]=arr.back,idx);
						arr.pop();
						const hole=objinfo.data.id;
						if(this._database_strtIdx(this.database_typeToArr(type))<hole) sys.holes.push(hole);
					}
				}
			}else{
				ub.m.delete(usedById);
				if(idx+1!==ub.length) ub.m.set((ub[idx]=ub.back)[0],idx);
				ub.pop();
			}
			return -1;
		}else return idx;
	}
};
$pppp$._database_getAddedDataobj=function(type){
	let arr=this._addedDataobj; if(!arr) arr=this._addedDataobj=[];
	if(!arguments.length) return arr;
	let rtv=arr[type];
	if(!rtv) rtv=this._addedDataobj[type]={pushed:[],holes:[],maxid:this._database_strtIdx( this.database_typeToArr(type) )};
	return rtv;
};
$pppp$._database_genNewByData=function f(type,usedBy,dataobj){
	// type: type of $data* array. see this.database_typeToArr
	// usedBy: see ._database_encodeUsedBy
	// dataobj: obj to be pushed to $data* array
	const arr=this.database_typeToArr(type); if(!arr) return;
	const usedById=this._database_encodeUsedBy(usedBy);
	const sys=this._database_getAddedDataobj(type);
	arr[dataobj.id=(sys.holes.length)?sys.holes.pop():++sys.maxid]=dataobj;
	const objinfo={usedBy:[[usedById,1]],data:this._database_trimToSave(dataobj)};
	// usedBy: [ [id,count], ... ]
	{ const m=sys.pushed.m; if(!m) sys.pushed.m=new Map(); }
	sys.pushed.m.set(objinfo,sys.pushed.length);
	sys.pushed.push(objinfo);
	dataobj.virtual=true;
	this._database_setCache_usedBy(dataobj,objinfo,type);
	return dataobj;
};
$pppp$._database_setNonJsonables=function(dst,src){
	for(let x=0,keys=Object.getOwnPropertyNames(src);x!==keys.length;++x){
		const k=keys[x];
		if( !Object.hasOwnKey.call(dst,k) || (dst[k] && dst[k].constructor)!==(src[k] && src[k].constructor) ){
			dst[k]=src[k];
		}
	}
};
$pppp$._database_genNewByRefId=function(type,usedBy,refId){
	const arr=this.database_typeToArr(type);
	const ref=arr&&arr[refId];
	if(!ref) return;
	const newobj=this._database_trimToSave(ref); newobj._base=refId;
	const rtv=this._database_genNewByData(type,usedBy,newobj);
	this._database_setNonJsonables(rtv,ref);
	rtv.tmapP=ref.tmapP;
	rtv.tmapS=ref.tmapS;
	rtv._base=refId;
	return rtv;
};
$pppp$._database_genNewByRef=function(type,usedBy,ref){
	return ref && this._database_genNewByRefId(type,usedBy,ref.id);
};

// - timer
$aaaa$=Game_Timer;
$pppp$=$aaaa$.prototype;
$pppp$.clear=function(){
	this._working=false;
	this._paused=false;
	this._frames=0;
	this._scale=2;
	this._alignX="R";
	this._alignY="T";
};
$pppp$.initialize = function() {
	this.clear();
};
$r$=$pppp$.update;
($pppp$.update=function f(sa){
	this._paused||f.ori.call(this,sa);
}).ori=$r$;
$pppp$.onExpire=function(){
	BattleManager.abort();
	this.clear();
};
$pppp$.pause=function(){ this._paused=true; };
$pppp$.resume=function(){ this._paused=false; };

// - screen
$aaaa$=Game_Screen;
$pppp$=$aaaa$.prototype;
$pppp$.eraseBattlePictures=function(){ // overwrite. wtf
	//this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
	// ? https://stackoverflow.com/questions/1232040/
	this._pictures.length=Math.min(this.maxPictures(),this._pictures.length);
};
$pppp$.maxPictures=()=>3;

// - action
$aaaa$=Game_Action;
$pppp$=$aaaa$.prototype;
$aaaa$.TARGET_ENUM_MAX=12;
$aaaa$.TARGET_ENUM_forAllFriends=12; // item,skill: meta.forAllFriends
$aaaa$.TARGET_ENUM_forAliveBattler=++$aaaa$.TARGET_ENUM_MAX; // 13
$aaaa$.TARGET_ENUM_forDeadBattler=++$aaaa$.TARGET_ENUM_MAX; // 14
$aaaa$.TARGET_ENUM_forAllBattler=++$aaaa$.TARGET_ENUM_MAX; // 15
$aaaa$.TARGET_ENUM_forAllFriend=++$aaaa$.TARGET_ENUM_MAX; // 16 // item,skill: meta.forAllFriends
$d$=$pppp$.isForOpponent=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([1, 2, 3, 4, 5, 6]);
$d$=$pppp$.isForAllFriend=function f(){
	return this.item().scope===f.tbl;
};
$d$.tbl=$aaaa$.TARGET_ENUM_forAllFriend;
$d$=$pppp$.isForAllFriends=function f(){
	return this.item().scope===f.tbl;
};
$d$.tbl=$aaaa$.TARGET_ENUM_forAllFriends;
$d$=$pppp$.isForBattler=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([
	$aaaa$.TARGET_ENUM_forAliveBattler, 
	$aaaa$.TARGET_ENUM_forDeadBattler, 
	$aaaa$.TARGET_ENUM_forAllBattler, 
]);
$d$=$pppp$.isDeadNotMatter=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([
	$aaaa$.TARGET_ENUM_forAllFriends, 
	$aaaa$.TARGET_ENUM_forAllBattler, 
	$aaaa$.TARGET_ENUM_forAllFriend, 
]);
$d$=$pppp$.isForFriend=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([7, 8, 9, 10, 11,
	$aaaa$.TARGET_ENUM_forAllFriends, 
	$aaaa$.TARGET_ENUM_forAllFriend, 
]).union_inplaceThis($pppp$.isForBattler.tbl);
$d$=$pppp$.isForDeadFriend=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([9, 10]);
$d$=$pppp$.isForUser=function f(){
	return this.item().scope===f.tbl;
};
$d$.tbl=11;
$d$=$pppp$.isForOne=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([1, 3, 7, 9, 11, 
	$aaaa$.TARGET_ENUM_forAllFriend, 
]);
$d$=$pppp$.isForRandom=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([3, 4, 5, 6]);
$d$=$pppp$.isForAll=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([2, 8, 10, 
	$aaaa$.TARGET_ENUM_forAllFriends, 
]).union_inplaceThis($pppp$.isForBattler.tbl);
$d$=$pppp$.needsSelection=function f(){
	return this.checkItemScope(f.tbl);
};
$d$.tbl=new Set([1,7,9,
	$aaaa$.TARGET_ENUM_forAllFriend,
]);
$d$=$pppp$.isHpEffect=function f(){
	return this.checkDamageType(f.tbl);
};
$d$.tbl=new Set([1, 3, 5]);
$d$=$pppp$.isMpEffect=function f(){
	return this.checkDamageType(f.tbl);
};
$d$.tbl=new Set([2, 4, 6]);
$d$=$pppp$.isDamage=function f(){
	return this.checkDamageType(f.tbl);
};
$d$.tbl=new Set([1, 2]);
$d$=$pppp$.isRecover=function f(){
	return this.checkDamageType(f.tbl);
};
$d$.tbl=new Set([3, 4]);
$d$=$pppp$.isDrain=function f(){
	return this.checkDamageType(f.tbl);
};
$d$.tbl=new Set([5, 6]);
$d$=$pppp$.isHpRecover=function f(){
	return this.checkDamageType(f.tbl);
};
$d$.tbl=new Set([3]);
$d$=$pppp$.isMpRecover=function f(){
	return this.checkDamageType(f.tbl);
};
$d$.tbl=new Set([4]);

// - btlr
$aaaa$=Game_BattlerBase;
$pppp$=$aaaa$.prototype;
$k$='isStateResist';
$r$=$pppp$[$k$]; ($pppp$[$k$]=function f(stateId){
	return f.ori.call(this,$dataStates[stateId]&&$dataStates[stateId]._base||stateId);
}).ori=$r$;
$pppp$._databaseAdd_state=function(dataobj,cache){
	if(!dataobj._base) return;
	cache=cache||$gameSystem._database_getCache();
	$gameSystem._database_addUsedBy(this,dataobj,cache);
};
$pppp$._databaseAdd_state_all=function(){
	for(let x=0,arr=this._states,cache=$gameSystem._database_getCache();x!==arr.length;++x){
		this._databaseAdd_state($dataStates[arr[x]],cache);
	}
};
$pppp$._databaseDel_state=function(dataobj,cache){
	if(!dataobj._base) return;
	cache=cache||$gameSystem._database_getCache();
	$gameSystem._database_delUsedBy(this,dataobj,cache);
};
$pppp$._databaseDel_state_all=function(){
	for(let x=0,arr=this._states,cache=$gameSystem._database_getCache();x!==arr.length;++x){
		this._databaseDel_state($dataStates[arr[x]],cache);
	}
};

// - unit
$aaaa$=Game_Unit;
$pppp$=$aaaa$.prototype;
$aaaa$.isAlive=m=>m.isAlive();
$aaaa$.isDead=m=>m.isDead();
$d$=$pppp$.aliveMembers=function f(){
    return this.members().filter(f.forEach);
};
$d$.forEach=$aaaa$.isAlive;
$d$=$pppp$.deadMembers=function f(){
    return this.members().filter(f.forEach);
};
$d$.forEach=$aaaa$.isDead;
$d$=$pppp$.randomTarget=function f(n,candi){
	const tgrvp=[],actrv=[];
	for(let x=0,arr=this.members(),s=0;x!==arr.length;++x){
		if(!f.forEach(arr[x])) continue;
		actrv.push(arr[x]);
		tgrvp.push(s+=arr[x].tgr);
	}
	if(n===undefined){
		return actrv.length?(candi&&candi.length?actrv[candi[0]]:actrv[tgrvp.lower_bound( Math.random()*tgrvp.back )]):null;
	}else{
		n|=0;
		const rtv=[];
		if(candi&&candi.length){
			for(let x=0;n--;){
				rtv.push(candi[x]);
				if(++x===candi.length) x=0;
			}
		}else if(actrv.length) while(n--) rtv.push(actrv[tgrvp.lower_bound( Math.random()*tgrvp.back )]);
		return rtv;
	}
};
$d$.forEach=$aaaa$.isAlive;
$pppp$._smoothTarget=function(idx,filter){
	if(idx&&idx.length){
		for(let x=0,ms=this.members(),m;x!==idx.length;++x){
			m=ms[idx[x]];
			if(filter(m)) return m;
		}
		return this.smoothTarget(idx[0]);
	}else{
		if(!(idx>=0)) idx=0;
		const ms=this.members();
		let m=ms[idx];
		if(filter(m)) return m;
		else{ for(let i=m-1,j=m+1,x=0;!(filter(m)) && (i>=0||j<ms.length);x^=1){
			if(i<0) while(j<ms.length){ m=ms[j++]; if(filter(m)) return m; }
			if(j>=ms.length) while(i>=0){ m=ms[i--]; if(filter(m)) return m; }
			if(x) m=ms[i--];
			else m=ms[j++];
		} }
		return m;
	}
};
($pppp$.smoothTarget=function f(idx){
	return this._smoothTarget(idx,f.forEach);
}).forEach=m=>m&&m.isAlive();
($pppp$.smoothDeadTarget=function f(idx){
	this._smoothTarget(idx,f.forEach);
}).forEach=m=>m&&m.isDead();
$d$=$pppp$.isAllDead=function f(){
	return !this.members().some(f.forEach);
};
$d$.forEach=$aaaa$.isAlive;
$pppp$.alwaysSubstitute=function(){
	const members = this.members();
	for(let i=0;i!==members.length;++i)
		if(members[i].isAlwaysSubstitute())
			return members[i];
};
$pppp$.remove=function(member){
	return true; // prototype
};
$pppp$.addNew=function(member){
	return member; // prototype
};


// window

// - Window_MapName
$aaaa$=Window_MapName;
$pppp$=$aaaa$.prototype;
makeDummyWindowProto($aaaa$,true);

// - Window_Gold
$aaaa$=Window_Gold;
$pppp$=$aaaa$.prototype;
makeDummyWindowProto($aaaa$,true);

// - Window_ShopCommand
$aaaa$=Window_ShopCommand;
$pppp$=$aaaa$.prototype;
makeDummyWindowProto($aaaa$,true,true);
$pppp$.updateArrows=none;

// - Window_DummyWithText
$aaaa$=function Window_DummyWithText(){
	this.initialize.apply(this, arguments);
};
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype=Object.create(Window_Base.prototype);
$pppp$.constructor = $aaaa$;
makeDummyWindowProto($aaaa$,true);

// - Window_Dummy
$aaaa$=function Window_Dummy(){
	this.initialize.apply(this, arguments);
};
window[$aaaa$.name]=$aaaa$;
$pppp$=$aaaa$.prototype=Object.create(Window_DummyWithText.prototype);
$pppp$._refreshContents=none;
$pppp$._updateContents=none;


$pppp$=$aaaa$=undef;
// --- --- BEG debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

objs.debug=(objs.isDev)?()=>{
	objs._doFlow.call(null,"debugger");
}:none;

$r$=$d$=$pppp$=$aaaa$=$t$=undef;
// --- --- END debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

if(objs.isDev) console.log("obj_t0");
