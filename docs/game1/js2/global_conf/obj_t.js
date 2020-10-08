"use strict";
// after rpg_*
let $aaaa$,$dddd$,$rrrr$;

// rewrite ugly lib
String.prototype.padZero=function(len){ return this.padStart(len,'0'); };
String.prototype.contains=function(s){ return this.indexOf(s)!==-1; };
Number.prototype.mod=function(n){ n|=0; let t=(this|0)%n; t+=(t<0)*n; return t; };

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
// - WindowLayer
$aaaa$=WindowLayer;
$rrrr$=$aaaa$.prototype.removeChild;
$dddd$=$aaaa$.prototype.removeChild=function f(c){
	if(c.destructor) c.destructor();
	return f.ori.call(this,c);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.destructor=function(){
	//debug.log(this.constructor.name+".prototype.destructor");
	let r=[];
	for(let x=0,arr=this.children;x!==arr.length;++x) if(arr[x]) r.push(arr[x]);
	for(let x=r.length;x--;) this.removeChildAt(x);
};
$rrrr$=$dddd$=$aaaa$=undef;
// - Window_Base
$aaaa$=Window_Base;
$rrrr$=$aaaa$.prototype.removeChild;
$dddd$=$aaaa$.prototype.removeChild=function f(c){
	if(c.destructor) c.destructor();
	return f.ori.call(this,c);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.destructor=function(){
	//debug.log(this.constructor.name+".prototype.destructor");
	let r=[];
	for(let x=0,arr=this.children;x!==arr.length;++x) if(arr[x]) r.push(arr[x]);
	for(let x=r.length;x--;) this.removeChildAt(x);
};
$aaaa$.prototype.drawCurrentAndMax = function(current, max, x, y, width, color1, color2) {
	let labelWidth = this.textWidth('HP');
	let valueWidth = this.textWidth('000');
	let slashWidth = this.textWidth('/')>>1;
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
$rrrr$=$dddd$=$aaaa$=undef;

// core

// - Point
$aaaa$=Point;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(x, y){
	// (int,int)
	return f.ori.call(this,~~x,~~y);
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - Rectangle
$aaaa$=Rectangle;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(x, y, width, height){
	// (int,int,int,int)
	return f.ori.call(this, ~~x, ~~y, ~~width, ~~height);
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

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

// - ResourceHandler
$aaaa$=ResourceHandler;
$rrrr$=$aaaa$.createLoader;
$dddd$=$aaaa$.createLoader=function(url, retryMethod, resignMethod, retryInterval) {
	retryInterval = retryInterval || this._defaultRetryInterval;
	let reloaders = this._reloaders;
	let retryCount = 0;
	return function(setCurrRetryCnt) {
		if(setCurrRetryCnt!==undefined) retryCount=setCurrRetryCnt;
		if (retryCount < retryInterval.length) {
			setTimeout(()=>retryMethod(url), retryInterval[retryCount]);
			retryCount++;
		} else {
			if (resignMethod) resignMethod();
			if (url) {
				if (reloaders.length === 0) {
					Graphics.printLoadingError(url);
					SceneManager.stop();
				}
				reloaders.push(function(giveUp) { retryCount=0; retryMethod(giveUp?blank_1x1:url); });
			}
		}
	};
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.retry;
$dddd$=$aaaa$.retry=function(giveUp) {
	if(0<this._reloaders.length){
		Graphics.eraseLoadingError();
		SceneManager.resume();
		this._reloaders.forEach(reloader=>reloader(giveUp));
		this._reloaders.length = 0;
	}
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - RequestQueue
RequestQueue.prototype.clear=function(){
	// '.length=0;' ?  https://stackoverflow.com/questions/1232040/
	this._queue.length=0;
};

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
Object.defineProperty($aaaa$.prototype, 'pitch', {
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
$aaaa$.prototype._load=function f(url){
	if(f.cache===undefined) f.cache=new CacheSystem(2);
	if (WebAudio._context) {
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
$rrrr$=$dddd$=$aaaa$=undef;

// - Graphics
$aaaa$=Graphics;
$rrrr$=$aaaa$.initialize;
$dddd$=$aaaa$.initialize=function f(w,h,type){
	f.ori.call(this,w,h,type);
	this._pad=Math.max(Game_Map.prototype.tileWidth(),Game_Map.prototype.tileHeight())<<1;
	this._boxWidth_pad3=(this._boxWidth_pad2=this._boxWidth+(this._pad<<1))+this._pad;
	this._boxHeight_pad3=(this._boxHeight_pad2=this._boxHeight+(this._pad<<1))+this._pad;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$._onKeyDown;
$dddd$=$aaaa$._onKeyDown=function f(){
	//debug.keydown('Graphics._onKeyDown');
	return f.ori.call(this,arguments[0]);
}; $dddd$.ori=$rrrr$;
$aaaa$._createRenderer=function(){
	PIXI.dontSayHello=true;
	let width=this._width;
	let height=this._height;
	let options={ view: this._canvas, transparent: true };
	try{
		switch(this._rendererType){
		case 'canvas':{
			this._renderer = new PIXI.CanvasRenderer(width, height, options);
		}break;
		case 'webgl':{
			this._renderer = new PIXI.WebGLRenderer(width, height, options);
		}break;
		default:{
			this._renderer = PIXI.autoDetectRenderer(width, height, options);
		}break;
		}

		if(this._renderer && this._renderer.textureGC) this._renderer.textureGC.maxIdle=1;

	}catch(e){
		this._renderer=null;
	}
};
$aaaa$._createGameFontLoader=none;
$rrrr$=$aaaa$.isFontLoaded=function(name){
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
$dddd$=$aaaa$.isFontLoaded=function f(name){
	let rtv=f.ori.call(this,name);
	if(!rtv){ debug.log("font issue"); debugger; }
	return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.render=function(stage){
	if(0<this._skipCount) this._skipCount^=0;
	else this._skipCount&=0;
	if(this._skipCount === 0){
		let t0 = Date.now();
		if(stage){
			this._renderer.render(stage);
			if (this._renderer.gl && this._renderer.gl.flush) this._renderer.gl.flush();
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
$rrrr$=$aaaa$._updateAllElements;
$dddd$=$aaaa$._updateAllElements=function f(){
	f.ori.call(this);
	// custom divs
	let target=this._canvas;
	if(target){
		let style=target.style,attrs=["width","height"];
		let arr=_global_conf["newDiv"].divs;
		for(let x=0;x!==arr.length;++x){
			let s=arr[x].style;
			for(let a=0;a!==attrs.length;++a) s[attrs[a]]=style[attrs[a]];
		}
	}
	this._preCalScreenTileCoord();
}; $dddd$.ori=$rrrr$;
$aaaa$._centerElement=function(element){
	//debug.log('Graphics._centerElement');
	let maxW=this._width*this._realScale; // sth like "111.11px"
	let maxH=this._height*this._realScale;
	let w=element.width*this._realScale;
	let h=element.height*this._realScale;
	let w2=(maxW-element.width)/2;
	let h2=(maxH-element.height)/2;
	element.style.position = 'absolute';
	element.style.margin = 'auto';
	element.style.top = h2+'px';
	element.style.left = w2+'px';
	element.style.right = w2+'px';
	element.style.bottom = h2+'px';
	element.style.width = w+'px';
	element.style.height = h+'px';
	return element;
};
$aaaa$._makeErrorHtml=(name, message)=>d.ce("div").sa("style","background-color:rgba(0,0,0,0.5);").ac(
	d.ce("font").sa("color","yellow").ac(
		d.ce("b").at(name)
	)
).ac(d.ce("br")).ac(
	d.ce("font").sa("color","white").at(message)
).ac(d.ce("br"));
$aaaa$.printError=function(name, message){
	this._errorShowed=true;
	if(this._errorPrinter) this._errorPrinter.rf(0).ac(this._makeErrorHtml(name, message));
	this._applyCanvasFilter();
	this._clearUpperCanvas();
};
$aaaa$.printLoadingError=function f(url){
	console.log("Graphics.printLoadingError");
	let rtv=this._errorPrinter;
	if (this._errorPrinter && !this._errorShowed) {
		// create error board
		this._errorPrinter.rf(0).ac(this._makeErrorHtml("Loading Error", "Failed to load: " + url));
		
		// retry?
		let button = document.createElement('button').at("Retry");
		button.onmousedown = button.ontouchstart = function(event) {
			ResourceHandler.retry();
			event.stopPropagation();
		};
		this._errorPrinter.appendChild(button);
		this._loadingCount = -Infinity;
		
		// using transparent image?
		let btn = d.ce('button');
		btn.ac(d.ce('div').at('Give up')).ac(d.ce('div').at('(use 1x1 transparent image)'));
		btn.onmousedown = btn.ontouchstart = function(event) {
			ResourceHandler.retry(1);
			event.stopPropagation();
		};
		this._errorPrinter.ac(d.ce('br')).ac(btn);
		this._loadingCount = -Infinity;
		
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
			++w;++h; // offset width/height are integer "measurements"
			for(let x=0;x!==arr.length;++x){
				arr[x].style.width =w+'px';
				arr[x].style.height=h+'px';
			}
		}
	}
	return rtv;
};
$rrrr$=$dddd$=$aaaa$=undef;

// - Bitmap
$aaaa$=Bitmap;
$rrrr$=$aaaa$.load;
$dddd$=$aaaa$.load=function f(url,key) {
	let rtv=f.ori.call(this,url);
	rtv._cacheKey=key;
	return rtv;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(w,h){
	f.ori.call(this,w,h);
	this.fontFace=_global_conf.useFont;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.measureTextWidth;
$dddd$=$aaaa$.prototype.measureTextWidth=function f(txt){
	//debug.log(txt,this.fontFace); // mostly are chr not string // debug
	//let ff=this.fontFace; this.fontFace="標楷體,"+this.fontFace;
	txt=txt.replace(/(\碧|\筵|\綰)/g,'一'); // bug: https://zh.wikipedia.org/zh-tw/%E5%BE%AE%E8%BB%9F%E6%AD%A3%E9%BB%91%E9%AB%94#%E5%B7%B2%E7%9F%A5%E5%95%8F%E9%A1%8C
	return f.ori.call(this,txt);
	// let rtv=f.ori.call(this,txt);
	// //this.fontFace=ff;
	// return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype._createCanvas=function(width, height){
	this.__canvas = this.__canvas || document.ce('canvas');
	this.__context = this.__canvas.getContext('2d');
	
	let min=Graphics.isWebGL()^0;
	// must >=1 else shadertilemap crash
	this.__canvas.width = width^0||min;
	this.__canvas.height = height^0||min;
	if(this._image){
		let w = this._image.width^0||min;
		let h = this._image.height^0||min;
		this.__canvas.width = w;
		this.__canvas.height = h;
		this._createBaseTexture(this._canvas);
		
		this.__context.drawImage(this._image, 0, 0);
	}
	this._setDirty();
};
// not sure
if(0&&0)$aaaa$.prototype.bltImage=function(source, sx, sy, sw, sh, dx, dy, dw, dh){ // rewrite: can use/draw on out-of-bound pixels
	dw = dw || sw;
	dh = dh || sh;
	if ( sw > 0 && sh > 0 && dw > 0 && dh > 0 ) {
		this._context.globalCompositeOperation = 'source-over';
		this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);
		this._setDirty();
	}
};
$rrrr$=$aaaa$.prototype.decode;
$dddd$=$aaaa$.prototype.decode=function f(){
	let flag=!this._loader && this._loadingState.slice(-4)==='ting'; // case 'requesting': case 'decrypting':
	f.ori.call(this);
	if(flag){
		this._image.removeEventListener('error', this._errorListener);
		this._image.addEventListener('error',this._errorListener=this._loader=ResourceHandler.createLoader( this._url,this._requestImage.bind(this),this._onError.bind(this) ));
	}
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype._requestImage;
$dddd$=$aaaa$.prototype._requestImage=function(url){
	if(Bitmap._reuseImages.length !== 0){
		this._image = Bitmap._reuseImages.pop();
	}else{
		this._image = new Image();
	}

	if (this._decodeAfterRequest && !this._loader) {
		this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this), this._onError.bind(this));
	}

		this._image = new Image();
		this._url = url;
	if(!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
		this._loadingState = 'decrypting';
		Decrypter.decryptImg(url, this);
	} else {
		this._loadingState = 'requesting';
			this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
		if(this._loader){
			this._loadListener = Bitmap.prototype._onLoad.bind(this);
			this._errorListener = this._loader;
			_global_conf['jurl'](url,"HEAD",undef,undef,'arraybuffer',undef,async (xhr)=>{
				if(xhr.readyState===4){
					let status=xhr.status.toString()[0];
					switch(status){
						default: // retry
							this._errorListener();
						break;
						case '2':{ // ok
							let img=this._image; img.addEventListener('error', function(){this.src="";this.src=url});
							img.onloadeddata=function(){this._done=1;console.log('onloadeddata');};
							img.onloadstart=function(){console.log('onloadstart');setTimeout(()=>(!this._done)&&this.abort(),8763);};
							img.src=url; break;
							// too slow
							let arr=new Uint8Array(xhr.response),s=''; for(let x=0;x!==arr.length;++x) s+=String.fromCharCode(arr[x]);
							this._image.src="data:image/png;base64," + btoa(s);
							if(this._cacheKey!==undefined && url===blank_1x1) delete ImageManager._imageCache._items[this._cacheKey]; // this is blank_1x1, coded in 'init.js'
						}break;
						case '4': // fail
							this._errorListener(inf);
						break;
					}
				}
			},8763);
		}else{
			this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
			this._image.src = url;
		}
	}
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - ScreenSprite
$aaaa$=ScreenSprite;
$aaaa$.prototype.setColor=function(r, g, b){
	//debug.log('ScreenSprite.prototype.setColor');
	if (this._red !== r || this._green !== g || this._blue !== b) {
		r = Math.round(r || 0).clamp(0, 255);
		g = Math.round(g || 0).clamp(0, 255);
		b = Math.round(b || 0).clamp(0, 255);
		this._red = r;
		this._green = g;
		this._blue = b;
		this._colorText = Utils.rgbToCssColor(r, g, b);

		let graphics = this._graphics;
		graphics.clear();
		let intColor = (r << 16) | (g << 8) | b;
		graphics.beginFill(intColor, 1);
		//whole screen with zoom. BWAHAHAHAHA
		graphics.drawRect(0,0, Graphics.width , Graphics.height );
	}
};
$rrrr$=$dddd$=$aaaa$=undef;

// - sprite
$aaaa$=Sprite;
// notify parent:Tilemap
Object.defineProperties($aaaa$.prototype,{ // ?!?!?!?!?
	y:{get:function(){
		return this.position.y;
	},set:function(rhs){ rhs^=0; // this.y=rhs;
		if(this._character===$gamePlayer||this.y!==rhs){
			if(this._lastKey){
				let p=this.parent,y=rhs+$gameMap._displayY_th;
				if(this._lastKey[1]!==y && p && (p instanceof Tilemap)){ // remove it from AVLTree, and then add it back to AVLTree with new key
					p.rmc_tree(this._lastKey);
					p.addc_tree([this.z^0,y,this.spriteId],this);
					//console.warn('y',this.spriteId,this.parent.children.indexOf(this),this._lastKey.join(),'->',key.join(),this);
				}
			}
			return this.transform.position.y=rhs;
		}else return rhs;
	},configurable:false},
	z:{get:function(){
		return this._z;
	},set:function(rhs){ rhs^=0; // this.z=rhs;
		if(this.z!==rhs){
			if(this._lastKey){
				let p=this.parent;
				if(this._lastKey[0]!==rhs && p && (p instanceof Tilemap)){ // remove it from AVLTree, add it back to AVLTree with new key
					p.rmc_tree(this._lastKey);
					p.addc_tree([rhs,(this.y^0)+$gameMap._displayY_th,this.spriteId],this);
					//console.warn('z',this.spriteId,this.parent.children.indexOf(this),this._lastKey.join(),'->',key.join(),this);
				}
			}
			return this._z=rhs;
		}else return rhs;
	},configurable:false}
});
$rrrr$=$aaaa$.prototype.update;
$dddd$=$aaaa$.prototype.update=function(){ // overwrite, forEach is slowwwwwwwwww
	for(let arr=this.children,x=arr.length;x--;){ let child=arr[x];
		child && child.update && child.update();
	}
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype._refresh=function(){
	//debug.log2("Sprite.prototype._refresh");
	let frameX = ~~this._frame.x;
	let frameY = ~~this._frame.y;
	let frameW = ~~this._frame.width;
	let frameH = ~~this._frame.height;
	let bitmapW = this._bitmap ? this._bitmap.width : 0;
	let bitmapH = this._bitmap ? this._bitmap.height : 0;
	let realX = frameX.clamp(0, bitmapW);
	let realY = frameY.clamp(0, bitmapH);
	let realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
	let realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);
	
	this._realFrame.x = realX;
	this._realFrame.y = realY;
	this._realFrame.width = realW;
	this._realFrame.height = realH;
	this.pivot.x = frameX - realX;
	this.pivot.y = frameY - realY;
	
	if(realW>0&&realH>0){
		if(this._needsTint()){
			this._createTinter(realW, realH);
			this._executeTint(realX, realY, realW, realH);
			this._tintTexture.update();
			this.texture.baseTexture = this._tintTexture;
			this.texture.frame = new Rectangle(0, 0, realW, realH);
		}else{
			if(this._bitmap) this.texture.baseTexture = this._bitmap.baseTexture;
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
$rrrr$=$dddd$=$aaaa$=undef;

// - Tilemap
$aaaa$=Tilemap;
$aaaa$.prototype.refresh=function(){
	if(this.parent){
		this.updateTransform(true);
		this._needsRepaint=true;
	}
	this._lastTiles.length=0;
};
$aaaa$.prototype.usetree=none; // prepare
$aaaa$.prototype.rmc_tree=function(key){ // prepare
};
$aaaa$.prototype.addc_tree=function(key,data){ // prepare
};
$rrrr$=$aaaa$.prototype.update;
$dddd$=$aaaa$.prototype.update=function f(){ // forEach is slowwwwwwwwww
	this.animationFrame = ~~(++this.animationCount / 30); // always >=0 , use parseInt is faster
	f.updateChildren.call(this); // difference here
	//this.children.forEach(c=>c&&c.update&&c.update());
	for (let x=0,arr=this.bitmaps;x!==arr.length;x++) if (arr[x]) arr[x].touch();
}; $dddd$.ori=$rrrr$;
$dddd$.updateChildren=Sprite.prototype.update;
$rrrr$=$aaaa$.prototype._compareChildOrder;
$dddd$=$aaaa$.prototype._compareChildOrder=function f(a,b){
	let ac=a._character,bc=b._character;

	let ae=!(ac&&ac._erased),be=!(bc&&bc._erased);
	let erasedCmp=ae-be;
	if(erasedCmp) return -erasedCmp; // erased last
	else if(ae+be===0){ // both erased
		let aniPlayCmp=ac._animationPlaying-bc._animationPlaying;
		if(aniPlayCmp) return -aniPlayCmp; // none play last
	}
	return f.ori.call(this,a,b);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype._sortChildren;
$dddd$=$aaaa$.prototype._sortChildren=function f(){
	//f.ori.call(this);
	this.children.sort(this._compareChildOrder);
	// Container.prototype.removeChildAt -> _utils.removeItems
	// -> module.exports = function removeItems(arr,strtIdx,cnt) // remove [strtIdx,strtIdx+cnt) // it's efficient as an array
	for(let bc=this.children.back._character;(bc&&bc._erased&&!bc._animationPlaying);bc=this.children.back._character) this.removeChildAt(this.children.length-1);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.update.updateChildren=function(){
	return this.children.forEach(c=>c&&c.update&&c.update());
};
$aaaa$.prototype._sortChildren=none;
$aaaa$.prototype.usetree=function(){ this.children=new AVLTree(); };
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(){
	//debug.log("Tilemap.prototype.initialize"); // also ShaderTilemap;
	PIXI.Container.call(this);
	this.usetree(); // tilemap refreshed at the end of 'initialize'
	
	this._margin = 0^0;
	this._width = Graphics.width+(this._margin<<1) ^ 0;
	this._height = Graphics.height+(this._margin<<1) ^ 0;
	this._tileWidth = 48^0;
	this._tileHeight = 48^0;
	this._tileWidth_=this._tileWidth>>1;
	this._tileHeight_=this._tileHeight>>1;
	this._mapWidth = 0;
	this._mapHeight = 0;
	this._mapData = null;
	this._layerWidth = 0;
	this._layerHeight = 0;
	this._lastTiles = [];
	
	/**
	 * The bitmaps used as a tileset.
	 *
	 * @property bitmaps
	 * @type Array
	 */
	this.bitmaps = [];
	
	/**
	 * The origin point of the tilemap for scrolling.
	 */
	this.origin = new Point();
	
	/**
	 * The tileset flags.
	 */
	this.flags = [];
	
	/**
	 * The animation count for autotiles.
	 */
	this.animationCount = 0^0;
	
	/**
	 * Whether the tilemap loops horizontal.
	 */
	this.horizontalWrap = false;
	
	/**
	 * Whether the tilemap loops vertical.
	 */
	this.verticalWrap = false;
	
	// pre-cal.
	// first '+' then '^'
	this._tileCols=0^Math.ceil(this._width/this._tileWidth)+1;
	this._tileRows=0^Math.ceil(this._height/this._tileHeight)+1;
	
	// fast search
	this._tileId2setNumber=[]; this._tileId2setNumber.length=4096;
	
	this._createLayers();
	this.refresh(); // ShaderTilemap access children
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.rmc_tree=function(key){
	return this.children.del(key);
};
$aaaa$.prototype.addc_tree=function(key,data){
	this.children.add(key,data);
	//console.log(key,data); this.children._goThrough_iter({quiet:1}); // debug
	data._lastKey=key;
	if(data._character) data._character._tilemapKey=key;
};
$rrrr$=$aaaa$.prototype.addChild;
$dddd$=$aaaa$.prototype.addChild=function f(c){
	if(c.parent && c.parent!==this) c.parent.removeChild(c);
	c.parent=this;
	
	c.transform._parentID=-1;
	
	let key=[c.z^0,c.y^0,c.spriteId^0];
	if(c.spriteId===undefined) key.push(this._boundsID);
	this.addc_tree(key,c);
	
	++this._boundsID;
	c.emit('added', this);
	return c;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.removeChild;
$dddd$=$aaaa$.prototype.removeChild=function f(c){
	let key=c._lastKey,res;
	if(!( this.children.keyOk(key)&&(res=this.rmc_tree(key)) )) return null;
	
	c.parent = null;
	c.transform._parentID = -1;
	c._lastKey=null;
	
	this._boundsID++;
	
	c.emit('removed', this);
	return c;
}; $dddd$.ori=$rrrr$;
$dddd$=$aaaa$.prototype.updateTransform_tail=function f(){
	this._boundsID++;
	
	this.transform.updateTransform(this.parent.transform);
	
	// TODO: check render flags, how to process stuff here
	this.worldAlpha = this.alpha * this.parent.worldAlpha;
	
	return this.children.forEach(f.forEach);
};
$dddd$.forEach=c=>c.visible&&c.updateTransform();
$aaaa$.prototype.updateTransform=function(forced){
	let startX = (this.origin.x - this._margin)/this._tileWidth  ^ 0;
	let startY = (this.origin.y - this._margin)/this._tileHeight ^ 0;
	this._updateLayerPositions(startX, startY);
	if (forced || this._needsRepaint || 
		this._lastAnimationFrame !== this.animationFrame ||
		this._lastStartX !== startX || 
		this._lastStartY !== startY) {
		this._frameUpdated = this._lastAnimationFrame !== this.animationFrame;
		this._lastAnimationFrame = this.animationFrame;
		this._lastStartX = startX;
		this._lastStartY = startY;
		this._paintAllTiles(startX, startY);
		this._needsRepaint = false;
	}
	//this._sortChildren();
	//PIXI.Container.prototype.updateTransform.call(this);
	return this.updateTransform_tail();
};
$aaaa$.prototype._paintAllTiles=function(startX, startY) {
	for(let y=0,ys=this._tileRows,xs=this._tileCols;y!==ys;++y){
		for(let x=0;x!==xs;++x){
			this._paintTiles(startX, startY, x, y);
		}
	}
};
$aaaa$.prototype._paintTiles=function(startX, startY, x, y) {
	//debug.log("Tilemap.prototype._paintTiles");
	let tableEdgeVirtualId = 1<<14;
	let mx = startX + x;
	let my = startY + y;
	let lx = mx.mod(this._tileCols)^0;
	let ly = my.mod(this._tileRows)^0;
	let dx = lx * this._tileWidth;
	let dy = ly * this._tileHeight;
	let tileId0 = this._readMapData(mx, my, 0);
	let tileId1 = this._readMapData(mx, my, 1);
	let tileId2 = this._readMapData(mx, my, 2);
	let tileId3 = this._readMapData(mx, my, 3);
	let shadowBits = this._readMapData(mx, my, 4);
	let upperTileId1 = this._readMapData(mx, my - 1, 1);
	let lowerTiles = [];
	let upperTiles = [];
	
	if(this._isHigherTile(tileId0)){
		upperTiles.push(tileId0);
	}else{
		lowerTiles.push(tileId0);
	}
	if(this._isHigherTile(tileId1)){
		upperTiles.push(tileId1);
	}else{
		lowerTiles.push(tileId1);
	}
	
	lowerTiles.push(-shadowBits);
	
	if(this._isTableTile(upperTileId1) && !this._isTableTile(tileId1) && !Tilemap.isShadowingTile(tileId0)){
		lowerTiles.push(tableEdgeVirtualId + upperTileId1);
	}
	
	if(this._isOverpassPosition(mx, my)){
		upperTiles.push(tileId2);
		upperTiles.push(tileId3);
	}else{
		if(this._isHigherTile(tileId2)) upperTiles.push(tileId2);
		else lowerTiles.push(tileId2);
		if(this._isHigherTile_id3(tileId0,tileId1,tileId2,tileId3)){ // edited: parts of roof
			upperTiles.push(tileId3);
		}else lowerTiles.push(tileId3);
	}
	
	let lastLowerTiles = this._readLastTiles(0, lx, ly);
	if(!lowerTiles.equals(lastLowerTiles) || (Tilemap.tileAn[tileId0]===1 && this._frameUpdated)){
		this._lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
		for(let i=0;i!==lowerTiles.length;++i){
			let lowerTileId = lowerTiles[i];
			if(lowerTileId<0) this._drawShadow(this._lowerBitmap, shadowBits, dx, dy);
			else if(lowerTileId>=tableEdgeVirtualId) this._drawTableEdge(this._lowerBitmap, upperTileId1, dx, dy);
			else this._drawTile(this._lowerBitmap, lowerTileId, dx, dy);
		}
		this._writeLastTiles(0, lx, ly, lowerTiles);
	}
	
	let lastUpperTiles = this._readLastTiles(1, lx, ly);
	if(!upperTiles.equals(lastUpperTiles)){
		this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
		for(let j=0;j!==upperTiles.length;++j) this._drawTile(this._upperBitmap, upperTiles[j], dx, dy);
		this._writeLastTiles(1, lx, ly, upperTiles);
	}
};
$aaaa$.prototype._isHigherTile_id3=function(tileId0,tileId1,tileId2,tileId3){
	return this._isHigherTile(tileId3)||tileId3===tileId0||(tileId2===0&&tileId3>=384&&tileId3<452);
};
$aaaa$.prototype._drawNormalTile=function(bitmap, tileId, dx, dy){
	//debug.log('Tilemap.prototype._drawNormalTile');
	let w = this._tileWidth;
	let h = this._tileHeight;
	//let sx = ( ((tileId>>4)&8)+(tileId&7) )*w;
	//let sy = ((tileId>>3)&15)*h;
	//let setNumber = Tilemap.tileAn[tileId]===5 ? 4 : (5+(tileId>>8));
	let source = this.bitmaps[ Tilemap.tileAn[tileId]===5 ? 4 : (5+(tileId>>8)) ];
	if(source) bitmap.bltImage(source, ( ((tileId>>4)&8)+(tileId&7) )*w, ((tileId>>3)&15)*h, w, h, dx, dy, w, h);
};
$dddd$=$aaaa$.prototype._drawAutotile=function f(bitmap, tileId, dx, dy){
	//debug.log('Tilemap.prototype._drawAutotile');
	
	// const
	const shape = Tilemap.getAutotileShape(tileId);
	f.kind = Tilemap.getAutotileKind(tileId);
	f.tx = f.kind&7;
	f.ty = f.kind>>3;
	f.tid=tileId;
	f.flags=this.flags;
	f.aniFrm=this.animationFrame;
	
	// will be edited
	f.autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
	f.bx = 0;
	f.by = 0;
	f.isTable = false;
	
	//let setNumber=this._tileId2setNumber[tileId];
	//if(setNumber===undefined) setNumber=this._tileId2setNumber[tileId]=f.toAn(tileId);
	let setNumber=Tilemap.tileAn[tileId]^0;
	f.an[setNumber]();
	setNumber-=setNumber!==0;
	
	let table = f.autotileTable[shape];
	let source = this.bitmaps[setNumber];
	
	if (table && source) {
		let w1 = this._tileWidth_;
		let h1 = this._tileHeight_;
		for (let i=0,bx2=f.bx<<1,by2=f.by<<1,h1_=h1>>1,isTable=f.isTable;i!==4;++i) {
			let qsx = table[i][0];
			let qsy = table[i][1];
			let sx1 = (bx2 + qsx) * w1;
			let sy1 = (by2 + qsy) * h1;
			let dx1 = dx + (i&1) * w1;
			let dy1 = dy + (i>>1) * h1;
			if(isTable && (qsy === 1 || qsy === 5)){
				let qsx2 = (qsy === 1)?(4-qsx)&3:qsx; // if qsy===1: qsx2 = [0, 3, 2, 1][qsx];
				let qsy2 = 3;
				let sx2 = (bx2 + qsx2) * w1;
				let sy2 = (by2 + qsy2) * h1;
				bitmap.bltImage(source, sx2, sy2, w1, h1,  dx1, dy1, w1, h1);
				dy1+=h1_;
				bitmap.bltImage(source, sx1, sy1, w1, h1_, dx1, dy1, w1, h1_);
			}else bitmap.bltImage(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
		}
	}
};
$dddd$.tbl=[0,1,2,1];
$dddd$.tiletbl=[Tilemap.TILE_ID_A1,Tilemap.TILE_ID_A2,Tilemap.TILE_ID_A3,Tilemap.TILE_ID_A4,Tilemap.TILE_ID_MAX,inf];
$dddd$.toAn=function(tileId){
	let rtv=0;
	for(let arr=this.tiletbl;rtv!==arr.length;++rtv) if(tileId<arr[rtv]) break;
	return rtv;
};
// Tilemap.tileAn=[];
{
	let arr=$aaaa$.tileAn=[]; arr.length=Tilemap.TILE_ID_MAX;
	for(let x=0;x!==Tilemap.TILE_ID_A5;++x) arr[x]=0;
	for(let x=Tilemap.TILE_ID_A5;x!==Tilemap.TILE_ID_A1;++x) arr[x]=5;
	for(let x=Tilemap.TILE_ID_A1;x!==arr.length;++x) arr[x]=$dddd$.toAn(x);
}
$dddd$.an=[ // functions here, 'this' === $dddd$
	none,
	function(){ // A1
		const kind=this.kind;
		let waterSurfaceIndex = this.tbl[this.aniFrm&3];
		if(kind>=0&&kind<4){
			let bit0=kind&1,bit1=kind&2;
			this.bx=(kind<2)?waterSurfaceIndex<<1:((bit1<<1)|bit1);
			this.by=(bit0<<1)|bit0;
		}else{
			this.bx=(this.tx>>2)<<3;
			this.by=((this.ty<<1) + ((this.tx>>1)&1) )*3;
			if((kind&1)===0) this.bx += waterSurfaceIndex<<1;
			else{
				this.bx += 6;
				this.autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
				this.by += this.aniFrm % 3;
			}
		}
	}.bind($dddd$),
	function(){ // A2
		this.bx = this.tx<<1;
		this.by = (this.ty - 2) * 3;
		this.isTable = this.flags[this.tid] & 0x80; // this._isTableTile(tileId);
	}.bind($dddd$),
	function(){ // A3
		this.bx = this.tx<<1;
		this.by = (this.ty - 6)<<1;
		this.autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	}.bind($dddd$),
	function(){ // A4
		this.bx = this.tx<<1;
		this.by = Math.floor((this.ty - 10) * 2.5 + ((this.ty&1) ? 0.5 : 0));
		if(this.ty&1) this.autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	}.bind($dddd$),
	none,
];
$aaaa$.prototype._drawTableEdge=function(bitmap, tileId, dx, dy){
	//debug.log('Tilemap.prototype._drawTableEdge');
	if (Tilemap.tileAn[tileId]===2) {
		let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
		let kind = Tilemap.getAutotileKind(tileId);
		let shape = Tilemap.getAutotileShape(tileId);
		let tx = kind&7;
		let ty = kind>>3;
		let setNumber = 1;
		let bx = tx<<1;
		let by = (ty - 2) * 3;
		let table = autotileTable[shape];
		
		if (table) {
			let source = this.bitmaps[setNumber];
			let w1 = this._tileWidth_;
			let h1 = this._tileHeight_;
			for (let i=0,bx2=bx<<1,by2=by<<1,h1_=h1>>1;i!==2;++i) {
				let qsx = table[2 + i][0];
				let qsy = table[2 + i][1];
				let sx1 = (bx2 + qsx) * w1;
				let sy1 = (by2 + qsy) * h1 + h1_;
				let dx1 = dx + (i&1) * w1;
				let dy1 = dy + (i>>1) * h1;
				bitmap.bltImage(source, sx1, sy1, w1, h1_, dx1, dy1, w1, h1_);
			}
		}
	}
};
$aaaa$.prototype._drawShadow=function(bitmap, shadowBits, dx, dy){
	//debug.log('Tilemap.prototype._drawShadow');
	if(shadowBits & 0xF){
		let w1 = this._tileWidth_;
		let h1 = this._tileHeight_;
		let color = 'rgba(0,0,0,0.5)';
		for(let i=0;i!==4;++i){
			if(shadowBits & (1 << i)) {
				let dx1 = dx + (i&1) * w1;
				let dy1 = dy + (i>>1) * h1;
				bitmap.fillRect(dx1, dy1, w1, h1, color);
			}
		}
	}
};
$dddd$=$aaaa$.prototype.renderCanvas=function f(renderer) {
	//debug.log('Tilemap.prototype.renderCanvas');
	// if not visible or the alpha is 0 then no need to render this
	if(!(this.visible && 0<this.worldAlpha && this.renderable)) return;
	//if(this._mask) renderer.maskManager.pushMask(this._mask);
	//if(this._mask) console.log("?");
	//this._renderCanvas(renderer); // empty function
	f.forEach.renderer=renderer;
	// do not render if a child is: 'Sprite_Character' and out of screen
	//this.children.forEach(f.forEach);
	this.children.forEach(f.forEach,true); // faster
	//if(this._mask) renderer.maskManager.popMask(renderer);
};
$dddd$.forEach=function f(c){
	if(c.constructor!==Sprite_Character || c.isInView()) return c.renderCanvas(f.renderer);
};
$rrrr$=$dddd$=$aaaa$=undef;

// - ShaderTilemap
$aaaa$=ShaderTilemap;
$dddd$=$aaaa$.prototype._hackRenderer=function f(renderer){
	renderer.plugins.tilemap.tileAnim[0] = f.tbl[this.animationFrame&3] * this._tileWidth;
	renderer.plugins.tilemap.tileAnim[1] = (this.animationFrame % 3) * this._tileHeight;
	return renderer;
};
$dddd$.tbl=[0,1,2,1];
$aaaa$.prototype.renderCanvas=function(renderer){
	this._hackRenderer(renderer);
	Tilemap.prototype.renderCanvas.call(this,renderer);
};
$dddd$=$aaaa$.prototype.renderWebGL=function f(renderer) {
	this._hackRenderer(renderer);
	//PIXI.Container.prototype.renderWebGL.call(this, renderer);
	// if the object is not visible or the alpha is 0 then no need to render this element
	if (!(this.visible && 0<this.worldAlpha && this.renderable)) return;
	// do a quick check to see if this element has a mask or a filter.
	if (this._mask || this._filters) this.renderAdvancedWebGL(renderer);
	else {
		this._renderWebGL(renderer);
		// simple render children!
		f.forEach.renderer=renderer;
		return this.children.forEach(f.forEach,true);
	}
};
$dddd$.forEach=function f(c){
	c.renderWebGL(f.renderer);
};
$aaaa$.prototype.updateTransform=function() {
	let startX = (this.origin.x - this._margin)/this._tileWidth  ^ 0;
	let startY = (this.origin.y - this._margin)/this._tileHeight ^ 0;
	this._updateLayerPositions(startX, startY);
	if (this._needsRepaint ||
		this._lastStartX !== startX || this._lastStartY !== startY) {
		this._lastStartX = startX;
		this._lastStartY = startY;
		this._paintAllTiles(startX, startY);
		this._needsRepaint = false;
	}
	//this._sortChildren();
	//PIXI.Container.prototype.updateTransform.call(this);
	return this.updateTransform_tail();
};
$aaaa$.prototype._paintAllTiles=function(startX, startY){
	this.lowerZLayer.clear();
	this.upperZLayer.clear();
	return Tilemap.prototype._paintAllTiles.call(this,startX,startY);
};
$aaaa$.prototype._paintTiles = function(startX, startY, x, y) {
	//debug.log('ShaderTilemap.prototype._paintTiles');
	let mx = startX + x;
	let my = startY + y;
	let dx = x * this._tileWidth, dy = y * this._tileHeight;
	let tileId0 = this._readMapData(mx, my, 0);
	let tileId1 = this._readMapData(mx, my, 1);
	let tileId2 = this._readMapData(mx, my, 2);
	let tileId3 = this._readMapData(mx, my, 3);
	let shadowBits = this._readMapData(mx, my, 4);
	let upperTileId1 = this._readMapData(mx, my - 1, 1);
	let lowerLayer = this.lowerLayer.children[0];
	let upperLayer = this.upperLayer.children[0];
	
	if (this._isHigherTile(tileId0)) {
		this._drawTile(upperLayer, tileId0, dx, dy);
	} else {
		this._drawTile(lowerLayer, tileId0, dx, dy);
	}
	if (this._isHigherTile(tileId1)) {
		this._drawTile(upperLayer, tileId1, dx, dy);
	} else {
		this._drawTile(lowerLayer, tileId1, dx, dy);
	}
	
	this._drawShadow(lowerLayer, shadowBits, dx, dy);
	if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
		if (!Tilemap.isShadowingTile(tileId0)) {
			this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
		}
	}
	
	if (this._isOverpassPosition(mx, my)) {
		this._drawTile(upperLayer, tileId2, dx, dy);
		this._drawTile(upperLayer, tileId3, dx, dy);
	} else {
		if (this._isHigherTile(tileId2)) {
			this._drawTile(upperLayer, tileId2, dx, dy);
		} else {
			this._drawTile(lowerLayer, tileId2, dx, dy);
		}
		if(this._isHigherTile_id3(tileId0,tileId1,tileId2,tileId3)){
			this._drawTile(upperLayer, tileId3, dx, dy);
		} else {
			this._drawTile(lowerLayer, tileId3, dx, dy);
		}
	}
};
$aaaa$.prototype._drawNormalTile=function(layer, tileId, dx, dy){
	//debug.log('ShaderTilemap.prototype._drawNormalTile');
	
	let w = this._tileWidth;
	let h = this._tileHeight;
	//let sx = ( ((tileId>>4)&8)+(tileId&7) )*w;
	//let sy = ((tileId>>3)&15)*h;
	//let setNumber=Tilemap.isTileA5(tileId)?4:( 5+(tileId>>8) );
	layer.addRect( Tilemap.tileAn[tileId]===5?4:( 5+(tileId>>8) ), 
		( ((tileId>>4)&8)+(tileId&7) )*w, ((tileId>>3)&15)*h, 
		dx, dy, w, h
	);
};
$aaaa$.prototype._drawAutotile = function(layer, tileId, dx, dy) {
	//debug.log('ShaderTilemap.prototype._drawAutotile');
	let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
	let kind = Tilemap.getAutotileKind(tileId);
	let shape = Tilemap.getAutotileShape(tileId);
	let tx = kind&7;
	let ty = kind>>3;
	let bx = 0;
	let by = 0;
	let setNumber = 0;
	let isTable = false;
	let animX = 0, animY = 0;
	
	if(Tilemap.isTileA1(tileId)){
		setNumber=0;
		if(kind>=0&&kind<4){
			animX=(kind<2)<<1;
			let bit0=kind&1,bit1=kind&2;
			bx=(bit1<<1)|bit1;
			by=(bit0<<1)|bit0;
		}else{
			bx=(tx>>2)<<3;
			by=((ty<<1)+((tx>>1)&1))*3;
			if((kind&1)===0) animX=2;
			else{
				bx+=6;
				autotileTable=Tilemap.WATERFALL_AUTOTILE_TABLE;
				animY=1;
			}
		}
	}else if(Tilemap.isTileA2(tileId)){
		setNumber = 1;
		bx = tx<<1;
		by = (ty - 2) * 3;
		isTable = this._isTableTile(tileId);
	}else if(Tilemap.isTileA3(tileId)){
		setNumber = 2;
		bx = tx<<1;
		by = (ty - 6)<<1;
		autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	}else if(Tilemap.isTileA4(tileId)){
		setNumber = 3;
		bx = tx<<1;
		by = Math.floor((ty - 10) * 2.5 + ((ty&1)? 0.5 : 0));
		if(ty&1) autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	}
	
	let table = autotileTable[shape];
	let w1 = this._tileWidth_; // 48>>1
	let h1 = this._tileHeight_; // 48>>1
	if(table){ for(let i=0,bx2=bx<<1,by2=by<<1,h1_=h1>>1;i!==4;++i){
		let qsx = table[i][0];
		let qsy = table[i][1];
		let sx1 = (bx2 + qsx) * w1;
		let sy1 = (by2 + qsy) * h1;
		let dx1 = dx + (i&1) * w1;
		let dy1 = dy + (i>>1) * h1;
		if(isTable && (qsy === 1 || qsy === 5)){
			let qsx2 = qsy===1?(4-qsx)&3:qsx; // if qsy===1: qsx2 = [0, 3, 2, 1][qsx];
			let qsy2 = 3;
			let sx2 = (bx2 + qsx2) * w1;
			let sy2 = (by2 + qsy2) * h1;
			layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1, animX, animY);
			layer.addRect(setNumber, sx1, sy1, dx1, dy1+h1_, w1, h1_, animX, animY);
		}else layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1, animX, animY);
	}}
};
$aaaa$.prototype._drawTableEdge=function(layer, tileId, dx, dy){
	//debug.log('ShaderTilemap.prototype._drawTableEdge');
	if (Tilemap.tileAn[tileId]===2) {
		let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
		let kind = Tilemap.getAutotileKind(tileId);
		let shape = Tilemap.getAutotileShape(tileId);
		let tx = kind&7;
		let ty = kind>>3;
		let setNumber = 1;
		let bx = tx<<1;
		let by = (ty - 2) * 3;
		let table = autotileTable[shape];
		let w1 = this._tileWidth_;
		let h1 = this._tileHeight_;
		for (let i=0,bx2=bx<<1,by2=by<<1,h1_=h1>>1; i!==2;++i) {
			let qsx = table[2 + i][0];
			let qsy = table[2 + i][1];
			let sx1 = (bx2 + qsx) * w1;
			let sy1 = (by2 + qsy) * h1 + h1_;
			let dx1 = dx + (i&1) * w1;
			let dy1 = dy + (i>>1) * h1;
			layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1_);
		}
	}
};
$aaaa$.prototype._drawShadow=function(layer, shadowBits, dx, dy){
	//debug.log('ShaderTilemap.prototype._drawShadow');
	if(shadowBits&0xF){
		let w1 = this._tileWidth_;
		let h1 = this._tileHeight_;
		for(let i=0;i!==4;++i){
			if(shadowBits & (1 << i)){
				let dx1 = dx + (i&1) * w1;
				let dy1 = dy + (i>>1) * h1;
				layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
			}
		}
	}
};
$rrrr$=$dddd$=$aaaa$=undef;

// - Input
Input.keyMapper[35]="end";
Input.keyMapper[36]="home";
Input.keyMapper[65]="left";
Input.keyMapper[68]="right";
Input.keyMapper[83]="down";
Input.keyMapper[87]="up";
$rrrr$=Input.clear;
$dddd$=Input.clear=function f(keyOnly){
	//debug.log('Input.clear');
	if(!keyOnly) TouchInput.clear();
	if(this.kstat){ this.kstat.length=0; this.kstat.length=256; }
	else this.kstat=[];
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
Input._onKeyDown=function(event) {
	this.kstat[event.keyCode]=true;
	if (this._shouldPreventDefault(event.keyCode)) {
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
$rrrr$=Input._onKeyUp;
$dddd$=Input._onKeyUp=function f(e){
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
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;
// - TouchInput
$aaaa$=TouchInput;
$rrrr$=$aaaa$._setupEventHandlers;
$dddd$=$aaaa$._setupEventHandlers=function f(){
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$aaaa$._onTouchStart = function(event) {
	let cancel=false,cx=0,cy=0;
	for (let i=0;i<event.changedTouches.length;++i) {
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
		let L=event.touches.length;
		cx/=L; cy/=L;
		this._onCancel(cx,cy);
		event.preventDefault();
	}
	if (window.cordova || window.navigator.standalone) {
		event.preventDefault();
	}
};
$rrrr$=$aaaa$._onTouchMove;
$dddd$=$aaaa$._onTouchMove=function(event) {
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
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$._onTouchEnd;
$dddd$=$aaaa$._onTouchEnd=function f(evt){
	f.ori.call(this,evt);
	this._lastAvgX=undef;
	this._lastAvgY=undef;
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;


// sprite
// - Sprite_Base
$aaaa$=Sprite_Base;
$aaaa$.prototype.updateAnimationSprites = function() {
	if(this._animationSprites.length) {
		let sprites = this._animationSprites; // 原版是在clone三小
		this._animationSprites = [];
		for (let i=0;i!==sprites.length;++i) {
			let sprite = sprites[i];
			if(sprite.isPlaying()) this._animationSprites.push(sprite);
			else sprite.remove();
		}
	}
};
$rrrr$=$dddd$=$aaaa$=undef;
// - Sprite_Character
$aaaa$=Sprite_Character;
$aaaa$.prototype.isInView=function(){
	return parseInt((this.x+Graphics._boxWidth_pad3)/Graphics._boxWidth_pad2)===1&&parseInt((this.y+Graphics._boxHeight_pad3)/Graphics._boxHeight_pad2)===1;
};
$rrrr$=$aaaa$.prototype.update;
$dddd$=$aaaa$.prototype.update=function f(forced){
	if(forced) return f.ori.call(this);
	let c=this._character;
	if(!c) return f.ori.call(this);
	let playing=(c.isAnimationPlaying()||c.isBalloonPlaying());
	if(!playing){
		if(c._erased){
			if(this.parent) this.parent.removeChild(this);
			return;
		}else if(this.isInView()===false){
			return this.updatePosition(); // give up update if too far
		}
	}
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.updateBitmap;
$dddd$=$aaaa$.prototype.updateBitmap=function f(){
	f.ori.call(this);
	this._character.imgModded=false;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.isImageChanged=function(){ // rewrite
	return this._character.imgModded || this._tilesetId !== $gameMap.tilesetId();
};
$aaaa$.prototype.updateTileFrame=function(){ // overwrite: ori use 'Math.floor' , '/' , '%'
	let pw = ~~this.patternWidth();
	let ph = this.patternHeight();
	let sx = ( ((this._tileId>>4)&8) + (this._tileId&7) ) * pw;
	let sy = ( (this._tileId>>3)&15 ) * ph;
	return this.setFrame(sx, sy, pw, ph);
};
$aaaa$.prototype.updateCharacterFrame_sit=function(){
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
$rrrr$=$aaaa$.prototype.updateCharacterFrame;
$dddd$=$aaaa$.prototype.updateCharacterFrame=function f(){ // add on chair facing up
	//debug.log('Sprite_Character.prototype.updateCharacterFrame');
	if(this._characterName){ // not tiles
		let c=this._character;
		if(c===$gamePlayer||c.page && c.page().image.hasFaceImg){ // has walking frames
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
					this._anchor.y=this._old_anchor_y;
					this._old_anchor_y=undef;
				}
			}
		} // else maybe it is a vehicle
	}
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.characterBlockX=function(){ // overwrite: ori use '/' , '%'
	return this._isBigCharacter?0:(this._character.characterIndex()&3)*3;
};
$aaaa$.prototype.characterBlockY=function(){ // overwrite: ori use '/' , '%'
	return this._isBigCharacter?0:((this._character.characterIndex()|3)^3);
};
$aaaa$.prototype.characterPatternY=function(){ // overwrite: ori use '/' , '%'
	return (this._character.direction()>>1)-1;
};
$aaaa$.prototype.patternHeight=function(){ // overwrite: ori use '/' , '%'
	// fast enough
	if(this._tileId>0) return $gameMap.tileHeight();
	else return this.bitmap.height>>(2+!this._isBigCharacter);
};
$aaaa$.prototype.tilesetBitmap=function(tileId) {
	return ImageManager.loadTileset($gameMap.tileset().tilesetNames[(tileId>>8)+5]);
};
$rrrr$=$dddd$=$aaaa$=undef;
// - Sprite_Animation
$aaaa$=Sprite_Animation;
$aaaa$.prototype.setupDuration=function() {
	this._durFloor=this._animation.frames.length * this._rate;
	this._duration=this._durFloor+1;
};
$aaaa$.prototype.updateMain=function(){
	if(this.isPlaying() && this.isReady()){
		if(0<this._delay) --this._delay;
		else{
			this.updatePosition();
			if(this._durFloor===--this._duration){ // 原版是在%三小
				this._durFloor-=this._rate;
				this.updateFrame();
			}
		}
	}
};
$aaaa$.prototype.updatePosition = function() {
	if (this._animation.position === 3) { // 原版是在/三小，我就不相信直接整數不行
		this.x = this.parent.width>>1;
		this.y = this.parent.height>>1;
	} else {
		let parent=this._target.parent;
		let grandparent=parent?parent.parent:null;
		let x = this._target.x^0;
		let y = this._target.y^0;
		if (this.parent === grandparent) {
			x += parent.x^0;
			y += parent.y^0;
		}
		if (this._animation.position === 0) {
			y -= this._target.height^0;
		} else if (this._animation.position === 1) {
			y -= this._target.height>>1;
		}
		this.x=x; this.y=y;
	}
};
$rrrr$=$dddd$=$aaaa$=undef;
// - Spriteset_Map
$aaaa$=Spriteset_Map;
$aaaa$.prototype.createCharacters=function(){
	if(this._characterSprites) this._characterSprites.length=0;
	else this._characterSprites = [];
	$gameMap.events().forEach(function(event){
		this._characterSprites.push(new Sprite_Character(event));
	}, this);
	$gameMap.vehicles().forEach(function(vehicle){
		this._characterSprites.push(new Sprite_Character(vehicle));
	}, this);
	if(0)$gamePlayer.followers().reverseEach(function(follower) {
		this._characterSprites.push(new Sprite_Character(follower));
	}, this);
	let cnt=$gameParty._actors.length-1; if(cnt===-1) cnt=0;
	$gamePlayer._followers._data.slice(0,cnt).forEach( flr=>this._characterSprites.push(new Sprite_Character(flr)) );
	this._characterSprites.push(new Sprite_Character($gamePlayer));
	for(let i=0;i!==this._characterSprites.length;++i){
		this._tilemap.addChild(this._characterSprites[i]);
	}
	//this._tilemap.player=this._characterSprites.back;
};
$aaaa$.prototype.updateTilemap = function() {
	this._tilemap.origin.x = $gameMap._displayX_tw;
	this._tilemap.origin.y = $gameMap._displayY_th;
};
$aaaa$.prototype.updateWeather = function() {
	this._weather.type = $gameScreen.weatherType();
	this._weather.power = $gameScreen.weatherPower();
	this._weather.origin.x = $gameMap._displayX_tw;
	this._weather.origin.y = $gameMap._displayY_th;
};
$rrrr$=$dddd$=$aaaa$=undef;

// manager

// - DataManager
$aaaa$=DataManager;
$aaaa$._globalId="agold404";
$dddd$=$aaaa$._databaseFiles;
$dddd$.reverse(); [
	{ name: '$dataCustom',       src: 'custom.json'       },
	{ name: '$dataTemplateEvtFromMap_overworld', src: 'Map077.json'   },
	{ name: '$dataTemplateEvtFromMap_outside', src: 'Map078.json'   },
	{ name: '$dataTemplateEvtFromMap_dungeon', src: 'Map117.json'   },
	{ name: '$dataTemplateEvt_move', src: 'Map089.json'   },
	{ name: '$dataTemplateEvt_item', src: 'Map114.json'   },
].reverse().forEach(x=>$dddd$.push(x)); $dddd$.reverse();
$aaaa$.isThisGameFile=function(savefileId){
	let globalInfo=this.loadGlobalInfo();
	if(globalInfo && globalInfo[savefileId]){
		if(StorageManager.isLocalMode()) return true;
		else{
			let savefile = globalInfo[savefileId];
			return true; // (savefile.globalId === this._globalId && savefile.title === $dataSystem.gameTitle);
		}
	}else return false;
};
$dddd$=$aaaa$.loadDataFile=function f(name, src ,changesCallback,changesKArgs) {
	//debug.log('DataManager.loadDataFile');
	let cache=f.cache.get(src);
	if(cache!==undefined){ f.set(name,cache ,changesCallback,changesKArgs); return; }
	let onSucc=(src,xhr,name,changesCallback,changesKArgs)=>{
		f.cache.add(src,xhr.responseText);
		f.set(name,xhr.responseText ,changesCallback,changesKArgs); // edit: set cache if conditions are matched
	};
	var xhr = new XMLHttpRequest();
	var url = 'data/' + src;
	xhr.open('GET', url);
	xhr.overrideMimeType('application/json');
	xhr.onload = function() {
		if (xhr.status < 400) {
			f.cache.add(src,xhr.responseText);
			f.set(name,xhr.responseText ,changesCallback,changesKArgs); // edit: set cache if conditions are matched
			return;
			window[name] = JSON.parse(xhr.responseText);
			DataManager.onLoad(window[name]);
		}
		else{
			
		}
	};
	xhr.onerror = this._mapLoader || function() {
		DataManager._errorUrl = DataManager._errorUrl || url;
	};
	window[name] = null;
	xhr.send();
};
$dddd$.cache=new CacheSystem(3);
$dddd$.set=function f(name,txt ,changesCallback,changesKArgs){
	window[name] = JSON.parse(txt);
	let prefix=name.slice(0,name.indexOf("_")+1);
	let tuner=f.tuning[prefix];
	if(tuner) tuner(name,prefix);
	DataManager.onLoad(window[name]);
	tuner=f.tuning[name];
	if(tuner) tuner(window[name]);
	if(changesCallback&&changesCallback.constructor===Function) changesCallback(changesKArgs);
};
$dddd$.set.tuning={
	'$dataTemplateEvtFromMap_':(name,prefix)=>{
		let tilesetId=window[name].tilesetId;
		window[name]=window[name].events;
		window[name].tilesetId=tilesetId;
		$dataTemplateEvtFromMaps[tilesetId]=window[name];
	},
	'$dataTemplateEvt_':(name,prefix)=>{
		if(!$dataTemplateEvtFromMaps.others) $dataTemplateEvtFromMaps.others={};
		window[name]=window[name].events;
		$dataTemplateEvtFromMaps.others[name.slice(prefix.length)]=window[name]; // sorted after first map-loading
	},
	'$dataTilesets':(arr)=>{
		if(!arr) return;
		for(let x=1;x!==arr.length;++x){
			let t=arr[x].meta;
			let s=t.chairThatCanSitUp;
			if(s){
				let arr=s.split(',').map(Number);
				t.chairThatCanSitUp=new Set(arr);
				if(!t.chair) t.chair=new Set(arr);
				else for(let x=0,s=t.chair;x!==arr.length;++x) s.add(arr[x]);
			}
		}
	},
};
$aaaa$.resetData3d=(idx)=>{ // - to 3d data [[x,y],3-z] // 0<=z<=3, z larger -> higher(or upper)
	//debug.log('DataManager.resetData3d');
	if(!$dataMap) return;
	if(idx!==undefined){ idx|=0;
		// supposed 'data3d' is inited before: '$dataMap.data3d[idx]' is an array
		let dst=$dataMap.data3d[idx],sz=$dataMap.width*$dataMap.height,data=$dataMap.data;
		dst.length=0;
		for(let lv=sz<<2;lv!==0;){
			lv-=sz;
			dst.push(data[idx+lv]);
		}
	}else{
		if(!$dataMap.data3d) $dataMap.data3d=[];
		for(let y=0,ys=$dataMap.height,xs=$dataMap.width,sz=$dataMap.height*$dataMap.width,data=$dataMap.data,data3d=$dataMap.data3d ;y!==ys;++y){ for(let x=0;x!==xs;++x){
			let idx=$dataMap.width*y+x;
			let dst=data3d[idx]=[];
			for(let lv=sz<<2;lv;){
				lv-=sz;
				dst.push(data[idx+lv]);
			}
		} }
	}
};
$aaaa$.loadMapData = function f(mapId) {
	debug.log('DataManager.loadMapData');
	if(f.playerChanges===undefined) f.playerChanges=(kargs)=>{ let tmp;
		//debug.log('DataManager.loadMapData -> playerChanges');
		//debug.log('$gameMap._mapId',$gameMap._mapId,'kargs.mapid',kargs.mapid);
		// test
		//if(debug.isdebug()){
		//	if(window['/tmp/'].tmpevt){
		//		$dataMap.events[999]=(window['/tmp/'].tmpevt);
		//	}
		//}
		// backup
		// - '.data'
		$dataMap.data_bak=$dataMap.data.slice(0);
		// defaults
		if($gamePlayer && $gamePlayer.canDiag===undefined) $gamePlayer.canDiag=1; // default can diag walk
		// preload
		// - preload face image according to events' character image
		let faceSet=new Set(),faces=[];
		for(let x=0,arr=$dataMap.events;x!==arr.length;++x){
			let evt=arr[x]; if(!evt) continue;
			for(let p=0,arr=evt.pages;p!==arr.length;++p){
				let img=arr[p].image;
				let cname=img.characterName;
				if(img.tileId===0&&cname!==''&&
					!ImageManager.isObjectCharacter(cname)&&
					!ImageManager.isBigCharacter(cname)&&
					cname.slice(-6)!=="Damage"&&
					cname.slice(0,6)!=="Damage"
				){
					faceSet.add(img.characterName);
					img.hasFaceImg=true;
				}
			}
		}
		faceSet.forEach(x=>faces.push(["face",x]));
		// - preload bgm,bgs
		let audios=[];
		{
			let dbgm = $dataMap.bgm && $dataMap.bgm.name;
			let dbgs = $dataMap.bgs && $dataMap.bgs.name;
			let abgm = AudioManager._currentBgm && AudioManager._currentBgm.name;
			let abgs = AudioManager._currentBgs && AudioManager._currentBgs.name;
			if(dbgm && dbgm!==abgm) audios.push(["bgm",dbgm]);
			if(dbgs && dbgs!==abgs) audios.push(["bgs",dbgs]);
		}
		// - actually request media
		SceneManager.preloadMedia.load({img:faces,audio:audios});
		// pre-cal isChair
		$dataMap.isChair=[];
		let chair=$dataTilesets[$dataMap.tilesetId].meta.chair;
		if(chair){ for(let y=0,ys=$dataMap.height,xs=$dataMap.width,sz=$dataMap.height*$dataMap.width,data=$dataMap.data ;y!==ys;++y){ for(let x=0;x!==xs;++x){
			let idx=$dataMap.width*y+x;
			for(let lv=sz<<2;lv;){
				lv-=sz;
				if(chair.has(data[idx+lv])){
					$dataMap.isChair[idx]=true;
					break;
				}
			}
		} } }
		// extended map data (including events)
		this.resetData3d();
		// - tileEvtTemplate
		$dataMap.templateStrt=$dataMap.events.length;
		if(tmp=$dataTemplateEvtFromMaps[$dataMap.tilesetId]){
			tmp=deepcopy(tmp); // need a copy for following use // 'tmp.tilesetId' is gone. it doesn't matter though
			let evts=$dataMap.events,strt=$dataMap.templateStrt_tile=evts.length;
			let childList=[];
			tmp.forEach((evt)=>{ evts.push(evt); if(!evt) return;
				let meta=evt.meta,c=meta.child,p=meta.parent;
				if(c && c.constructor!==Boolean && !isNaN(c)) childList.push(meta.child  = Number(c)+strt);
				if(p && p.constructor!==Boolean && !isNaN(p)) meta.parent = Number(p)+strt;
				evt.id=evts.length-1;
				evt.x=evt.y=-1; // loop map will x,y mod w,h
			});
			for(let x=0;x!==childList.length;++x) if(evts[childList[x]]) evts[childList[x]].isChild=1;
		}
		// - othersEvtTemplate
		if(!$dataTemplateEvtFromMaps.others_sorted){
			console.log('sorted @',mapId);
			$dataTemplateEvtFromMaps.others_sorted=true;
			let src=$dataTemplateEvtFromMaps.others,arr=[];
			for(let i in src) arr.push([i,src[i]]);
			arr.sort((a,b)=>{ return ((a[0]<b[0])<<1)-1; }); // no dup
			src=$dataTemplateEvtFromMaps.others={};
			for(let x=0;x!==arr.length;++x) src[arr[x][0]]=arr[x][1];
		}
		for(let i in $dataTemplateEvtFromMaps.others){
			tmp=deepcopy($dataTemplateEvtFromMaps.others[i]);
			let evts=$dataMap.events,strt=$dataMap['templateStrt_'+i]=evts.length;
			tmp.forEach((evt)=>{ evts.push(evt); if(!evt) return;
				evt.meta[i]=evt.meta.regen=true;
				evt.id=evts.length-1;
				evt.x=evt.y=-1; // loop map will x,y mod w,h
			});
		}
		// $gameParty
		if($gameParty){
			// init $gameParty.mapChanges
			if(!$gameParty.mapChanges) $gameParty.mapChanges=[''];
			let store=$gameParty.mapChanges;
			// init slot
			if(!store[kargs.mapid]) store[kargs.mapid]={};
			// init vars
			if(!store[kargs.mapid].vars) store[kargs.mapid].vars={};
			// put map name
			//if(store[kargs.mapid].name!==undefined) $dataMap.displayName=store[kargs.mapid].name; // change $gameMap.displayName() to achieve same result
			// put events to $gameMap
			// // Game_Map.prototype.setup @ obj_t.js
		}
		// init $gameSelfSwitches
		if($gameSelfSwitches){
			let target=$gameSelfSwitches._data;
			target[kargs.mapid]=target[kargs.mapid]||{};
		}
	};
	if (mapId > 0) {
		let filename = 'Map%1.json'.format(mapId.padZero(3));
		this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
		this.loadDataFile('$dataMap', filename ,f.playerChanges, {mapid:mapId});
	} else {
		this.makeEmptyMap();
	}
};
$aaaa$.isSkill=function(item){
	return item&&$dataSkills[item.id]===item;
};
$aaaa$.isItem=function(item){
	return item&&$dataItems[item.id]===item;
};
$aaaa$.isWeapon=function(item){
	return item&&$dataWeapons[item.id]===item;
};
$aaaa$.isArmor=function(item){
	return item&&$dataArmors[item.id]===item;
};
$aaaa$.titleAddName=function(info){
	return (info.name===undefined?"":(info.name+" @ ")) + info.title;
};
$dddd$=$aaaa$.class=function f(item){
	if(item&&item.constructor===Game_Item) return f.attr.indexOf(item._dataClass);
	let data=[$dataSkills,$dataItems,$dataWeapons,$dataArmors];
	for(let x=0;x!==data.length;++x) if(data[x][item.id]===item) return x;
	return -1;
};
$dddd$.attr=['skill','item','weapon','armor'];
$dddd$.text=["技能","道具","武器","防具"];
$aaaa$.classData=function(item){
	let data=[$dataSkills,$dataItems,$dataWeapons,$dataArmors];
	return data[this.class(item)];
};
$aaaa$.classAttr=function(item){ return this.class.attr[this.class(item)]; };
$aaaa$.classText=function(item){ return this.class.text[this.class(item)]; };
$aaaa$.saveGameWithoutRescue = function(savefileId) {
	let json = JsonEx.stringify(this.makeSaveContents());
	if (json.length >= 200000) console.warn('Save data too big!',savefileId,json.length);
	StorageManager.save(savefileId, json);
	this._lastAccessedId = savefileId;
	let globalInfo = this.loadGlobalInfo() || [];
	globalInfo[savefileId] = this.makeSavefileInfo();
	this.saveGlobalInfo(globalInfo);
	return true;
};
$aaaa$._delAttrs_dynamicEvt=["_moveSpeed","_moveFrequency","_opacity","_blendMode","_pattern","_priorityType","_tileId","_characterName","_characterIndex","_isObjectCharacter","_walkAnime","_stepAnime","_directionFix","_through","_transparent","_bushDepth","_animationId","_balloonId","_animationPlaying","_balloonPlaying","_animationCount","_stopCount","_jumpCount","_jumpPeak","_movementSuccess","_moveRouteForcing","_moveRoute","_moveRouteIndex","_originalMoveRoute","_originalMoveRouteIndex","_waitCount","_moveType","_trigger","_starting","_erased","_pageIndex","_originalPattern","_originalDirection","_prelockDirection","_locked","_mapId", "_addedCnt_strtEvts","_interpreter","imgModded",]; 
$rrrr$=$aaaa$.makeSaveContents;
$dddd$=$aaaa$.makeSaveContents=function f(){
	debug.log('DataManager.makeSaveContents');
	$gameParty.saveDynamicEvents();
	let rtv=f.ori.call(this);
	f.delAttrs_chr(rtv.player);
	for(let x=0,arr=rtv.map._events;x!==arr.length;++x){
		let evt=arr[x]; if(!evt) continue;
		f.delAttrs_chr(evt);
	}
	return rtv;
}; $dddd$.ori=$rrrr$;
$dddd$.delAttrs_chr=function f(chr){
	for(let x=0,arr=f.list;x!==arr.length;++x) delete chr[arr[x]];
};
$dddd$.delAttrs_chr.list=["_tilemapKey","_interpreter","imgModded"];
$rrrr$=$aaaa$.extractSaveContents;
$dddd$=$aaaa$.extractSaveContents=function f(){
	debug.log('DataManager.extractSaveContents');
	f.ori.call(this,arguments[0]);
	$gameMap.loadDynamicEvents(1);
}; $dddd$.ori=$rrrr$;
$aaaa$.maxSavefiles=function(){
	let rtv=_global_conf["default max savefiles"]||64;
	if(ConfigManager)
		if(ConfigManager.maxSavefiles===0) rtv=0;
		else rtv=ConfigManager.maxSavefiles||rtv;
	return rtv;
};
$rrrr$=$aaaa$.saveGame;
$dddd$=$aaaa$.saveGame=function f(sfid){
	debug.log('DataManager.saveGame');
	if(sfid==='online'){
		if(window.gasPropagate===undefined) return false;
		let data_raw=JsonEx.stringify(this.makeSaveContents());
		let data_compressed=LZString.compressToBase64(data_raw);
		debug.log('',"raw size",data_raw.length,"compressed",data_compressed.length);
		gasPropagate.parent.postMessage({cmd:"set",data:data_compressed,fname:"test from RPG"},"*");
		return true;
	}else return f.ori.call(this,sfid);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.loadGame;
$dddd$=$aaaa$.loadGame=function f(sfid,onlineId,data){
	if(f.cache===undefined) f.cache=new CacheSystem();
	if(sfid==='callback'){
		// set data
		this.createGameObjects();
		this.extractSaveContents(JsonEx.parse(LZString.decompressFromBase64(data)));
		this.onlineOk=true;
		//Scene_Load.prototype.reloadMapIfUpdated.call({});
		$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
		$gamePlayer.requestMapReload();
		SceneManager.goto(Scene_Map);
		return true;
	}else if(sfid==='online'){
		// check gas
		if(window.gasPropagate===undefined) return false;
		// reserve bgm
		$gameSystem.onBeforeSave();
		// display effects
		SceneManager._scene.fadeOutAll();
		// error handling. prevent extra inputs
		SceneManager.push(Scene_Black);
		// find cache
		let tmp;
		if((tmp=f.cache.get(onlineId))!==undefined){
			this.onlineOk=this.loadGame('callback',onlineId,tmp);
			if(this.onlineOk) return true;
			f.cache.del(onlineId);
		}
		// send
		this.onlineOk=false;
		gasPropagate.parent.postMessage({cmd:"get",fname:onlineId},"*");
		
		return this.onlineOk;
	}else return f.ori.call(this,sfid);
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - ConfigManager
$aaaa$=ConfigManager;
$aaaa$.maxSavefiles=DataManager.maxSavefiles();
$aaaa$.ConfigOptions=[
	["alwaysDash",$aaaa$.readFlag],
	["commandRemember",$aaaa$.readFlag],
	["bgmVolume",$aaaa$.readVolume],
	["bgsVolume",$aaaa$.readVolume],
	["meVolume",$aaaa$.readVolume],
	["seVolume",$aaaa$.readVolume],
	["_noGainMsg",$aaaa$.readFlag],
	["_noGainMsg",$aaaa$.readFlag],
	["_noGainHint",$aaaa$.readFlag],
	["_noGainSound",$aaaa$.readFlag],
	["_noLeaderHp",$aaaa$.readFlag],
	["_noLeaderMp",$aaaa$.readFlag],
	["maxSavefiles"],
	["_halfFps",$aaaa$.readFlag],
	["_useFont"],
];
$aaaa$.makeData=function() {
	let rtv={};
	for(let arr=this.ConfigOptions,x=0,xs=arr.length;x!==xs;++x){
		let t=arr[x];
		rtv[t[0]]=this[t[0]];
		if(t[1]===this.readFlag) rtv[t[0]]^=0;
	}
	return rtv;
};
$aaaa$.applyData=function(config) {
	for(let arr=this.ConfigOptions,x=0,xs=arr.length;x!==xs;++x)
		if(arr[x][1]) this[arr[x][0]]=arr[x][1].call(this,config,arr[x][0]);
		else if(arr[x][0] in config) this[arr[x][0]]=config[arr[x][0]];
};
$aaaa$.readVolume=function(config, name) {
	let value=config[name];
	if(value===undefined) return AudioManager._defaultVolume;
	else return Number(value).clamp(0, 100);
};
$rrrr$=$dddd$=$aaaa$=undef;

// - ImageManager
$aaaa$=ImageManager;
$dddd$=$aaaa$.loadNormalBitmap=function(path, hue) {
	let key = this._generateCacheKey(path, hue);
	let bitmap=this._imageCache.get(key);
	if (!bitmap) {
		bitmap=Bitmap.load(decodeURIComponent(path),key);
		bitmap.addLoadListener(()=>bitmap.rotateHue(hue));
		this._imageCache.add(key, bitmap);
	}else if(!bitmap.isReady()){
		bitmap.decode();
	}
	return bitmap;
};
$rrrr$=$dddd$=$aaaa$=undef;

// - AudioManager
$aaaa$=AudioManager;
$aaaa$._defaultVolume = _global_conf["default volume"];
$aaaa$._bgmVolume = $aaaa$._defaultVolume;
$aaaa$._bgsVolume = $aaaa$._defaultVolume;
$aaaa$. _meVolume = $aaaa$._defaultVolume;
$aaaa$. _seVolume = $aaaa$._defaultVolume;
$rrrr$=$dddd$=$aaaa$=undef;

// - TextManager
TextManager.custom=(id)=>$dataCustom[id]||'';

// - SceneManager
$aaaa$=SceneManager;
$aaaa$._defaultWidth  = _global_conf["default width"]; // @global_conf/obj_h.js
$aaaa$._defaultHeight = _global_conf["default height"]; // @global_conf/obj_h.js
$aaaa$._screenWidth  = SceneManager._defaultWidth; // refer by Graphics // set by plugin
$aaaa$._screenHeight = SceneManager._defaultHeight; // refer by Graphics // set by plugin
$aaaa$._boxWidth     = SceneManager._defaultWidth; // refer by Graphics // no use? // set by plugin
$aaaa$._boxHeight    = SceneManager._defaultHeight; // refer by Graphics // no use? // set by plugin
$dddd$=$aaaa$.preloadMedia=function f(sceneClass){
	f.load(f.list.any);
	f.load(f.list[sceneClass&&sceneClass.name]);
};
$dddd$.list={
	Scene_Map:{
		img:[ ["ani","Fire2"], ["ani","Slash"], ],
		audio:[ ["se","Fire2"], ["se","Slash1"], ],
	},
	Scene_Menu:{
		img:[],
		audio:[ ["se","Equip1"], ],
	},
	any:{
		img:[],
		audio:[ 
			["se","Load"], ["se","Save"], ["se","Item3"], 
			["se","Door1"], ["se","Jump1"], ["se","Fall"], ["se","Blow3"], 
		],
	},
};
$dddd$.load=function f(list){
	if(list){
		for(let _=2;_--;){
			for(let x=0,arr=list.img||[];x!==arr.length;++x){
				let ldr=ImageManager[f.tbl[arr[x][0]]];
				if(ldr) ldr.call(ImageManager,(arr[x][1]));
				else debug.warn("no such loader:",arr[x][0]);
			}
		}
		for(let _=2;_--;){
			for(let x=0,arr=list.audio||[];x!==arr.length;++x)
				AudioManager.createBuffer(arr[x][0],arr[x][1]);
		}
	}
};
$dddd$.load.tbl={
	ani:"loadAnimation",
	face:"loadFace",
};
$rrrr$=$aaaa$.resume;
$dddd$=$aaaa$.resume=function f(){
	if(this._resuming) return;
	this._resuming=true;
	if(this._pauseInfo&&this._pauseInfo.paused) this._pauseToResume();
	let rtv=f.ori.call(this);
	this._resuming=false;
	return rtv;
}; $dddd$.ori=$rrrr$;
$dddd$=$aaaa$.pause=function f(){
	let self=this;
	if(this._stopped) return;
	this._stopped=true;
	if(!this._pauseInfo) this._pauseInfo={};
	let info=this._pauseInfo;
	let bgm=info.bgm=AudioManager.saveBgm(),bgs=info.bgs=AudioManager.saveBgs();
	AudioManager.stopAll();
	let msg=(info.msg||(
		info.msg=d.ce("div")
			.ac(d.ce("div").at("Now paused."))
			.ac(d.ce("div").at("Click the button in the top-left corner of the screen to resume."))
	)).sa("class","msg");
	let btn=(info.btn||(
		info.btn=d.ce("button").ac(d.ce("div").at("resume"))
	)).sa("class",""),sty=btn.style;
	if(!btn.ref){
		btn.ref=this;
		sty.position="absolute";
		sty.zIndex=999;
		d.ge("UpperDiv").ac(msg);
		d.body.ac(btn);
	}
	btn.onclick=f.btnResume; // cleared (=null) after resumed
	
	info.paused=true; // done pausing
};
$dddd$.btnResume=function(){ this.ref.resume(); };
$aaaa$._pauseToResume=function(){
	if(!this._pauseInfo) return;
	let info=this._pauseInfo;
	info.btn.sa("class","none"); info.btn.onclick=null;
	info.msg.sa("class","none");
	AudioManager.replayBgm(info.bgm); info.bgm=undef;
	AudioManager.replayBgs(info.bgs); info.bgs=undef;
	info.paused=false;
};
$rrrr$=$aaaa$.update;
$dddd$=$aaaa$.update=function f(){
	//debug.log('SceneManager.update');
	if(!(_global_conf&&_global_conf.halfFps) || (this._half_do^=1)) return f.ori.call(this);
	else{
		++Graphics.frameCount;
		return this.requestUpdate();
	}
}; $dddd$.ori=$rrrr$;
$aaaa$.isMap=function(){return this._scene && this._scene.constructor===Scene_Map};
$aaaa$._alphas=[];
$aaaa$.pushAlpha=function(a){this._alphas.push(this._scene.alpha);this._scene.alpha=a;};
$aaaa$.popAlpha=function(){this._scene.alpha=this._alphas.pop();};
$rrrr$=$aaaa$.tickStart;
$dddd$=$aaaa$.tickStart=function f(){
	//debug.log2('SceneManager.tickStart');
	this.lastTickTime=Date.now();
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.tickEnd;
$dddd$=$aaaa$.tickEnd=function f(){
	f.ori.call(this);
	if($gameParty && $gameParty._items[78]){
		let color=$dataCustom.textcolor;
		if(this._scene.constructor===Scene_Gameover && !this._scene.popped){
			this._scene.popped=true;
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("那就乖乖看code",{t_remained:1.9e4+x,align:'center'}));
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("什麼?你說你已經學了?",{t_remained:1.6e4+x,align:'center'}));
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("乖乖去學javascript啦",{t_remained:1.3e4+x,align:'center'}));
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("死於\\RGB["+color.item+"]"+$dataItems[78].name+"\\RGB["+color.default+"]的詛咒",{t_remained:1e4+x,align:'center'}));
			for(let x=64;x-=8;) this._scene.addChild(new Window_CustomPopupMsg("再隨便\\RGB["+color.keyword+"]"+"呼叫\\RGB["+color.default+"]不明函式啊",{t_remained:1e3+x,align:'center'}));
			return;
		}
		else if(this.isMap()){
			$gamePlayer.adjDecRate('hp',0.0001,1);
			$gameMessage.popup("被\\item[78]詛咒了");
			return;
		}
	}
	if($dataMap && $dataMap.gameoverMsgs && this._scene.constructor===Scene_Gameover && !this._scene.popped){
		this._scene.popped=true;
		for(let x=0,arr=$dataMap.gameoverMsgs;x!==arr.length;++x) this._scene.addChild(new Window_CustomPopupMsg(arr[x][0],arr[x][1]));
		return;
	}
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.goto;
$dddd$=$aaaa$.goto=function f(sceneClass){
	debug.log('SceneManager.goto');
	this.preloadMedia(sceneClass);
	let sc=this._scene;
	//if(sc) debug.log(1,this._scene.constructor);
	if(!window['/tmp/'].clearedWhenNewScene || sc && sc.constructor!==sceneClass) window['/tmp/'].clearedWhenNewScene={};
	f.ori.call(this,sceneClass);
	if(0&& debug.isdebug() && screenShots && sc && sceneClass!==Scene_Base){
		if(sc) debug.log(2,this._scene.constructor);
		screenShots[sc.constructor.name]=d.ge("GameCanvas").toDataURL();
	}
	if(sceneClass===Scene_Gameover && sc.constructor===Scene_Map){
		// Scene_Map -> Scene_Gameover
		let p=$gamePlayer; $dataMap.data[$gameMap.xy2idx(p.x,p.y,3)]=599;
	}
	let foo=window['/tmp/'].nextSceneCallback;
	if(foo&&foo.constructor===Function) foo();
}; $dddd$.ori=$rrrr$;
if(!$aaaa$.refresh) $aaaa$.refresh=function(){
	this.push(Scene_Base); this.pop();
};
$aaaa$.addWindowB=function(w,noblocking,idx){
	if(this.isMap()) return $gameMessage.addWindow(w);
	// for Scene_Item , Scene_Skill , etc.
	let wl=this._scene._windowLayer;
	if(!noblocking){
		let arr=[],ws=[].concat(wl.children); arr.length=ws.length;
		let r=w.processHandling;
		w.processHandling=()=>{
			if(this.parent===null) return;
			if(arr[0]===undefined){
				for(let x=0;x!==arr.length;++x) arr[x]=ws[x].active;
				for(let x=0;x!==arr.length;++x) ws[x].active=false;
			}
			else delete w.processHandling;
			//r.apply(w,arguments);
		};
		w.setHandler('cancel',()=>{
			w.parent.removeChild(w);
			for(let x=0;x!==arr.length;++x) if(ws[x].parent) ws[x].active=arr[x];
		});
	}
	if(noblocking || idx) wl.addChildAt(w,idx);
	else wl.addChild(w);
};
$aaaa$.addTextInput=function(obj,key,txtdetail,clearDst){
	txtdetail=txtdetail||{};
	// txtdetail: {title:"",init:(o,k)=>{},apply:(input.value)=>{},valid:(input.value)=>{},final:(o,k)=>{}}
	// valid(input.value) && o[k]=apply(input.value) && final(o,k)
	let self=this;
	if(clearDst) delete obj[key];
// TODO: when pressing 'ok', message will not go next
	let w=new Window_CustomTextInput(obj,key,txtdetail);
	if(this.isMap()){
		let mw=this._scene._messageWindow,f=()=>{
			delete w.destructor;
			w.destructor();
			mw.updateInput();
		};
		w.destructor=function(){
			mw.pause=false;
			mw.terminateMessage();
			delete this.destructor;
			this.destructor();
		};
	}
	this.addWindowB(w);
};
$rrrr$=$aaaa$.onKeyDown;
$dddd$=$aaaa$.onKeyDown=function f(event){
	//debug.keydown('SceneManager.onKeyDown');
	//debug.keydown('',event.keyCode,Input._currentState);
	if(debug.iskeydown()){
		let p=$gamePlayer;
		console.log(p.x,p.y);
	}
	if(debug.isdepress() && SceneManager.isMap() && !$gameMessage.isBusy()){ switch(event.keyCode){
		default: break;
		case "Q".charCodeAt(): if($gamePlayer && $gameMap){
			let p=$gamePlayer;
			if(p._x===p._realX && p._y===p._realY ){
				p.moveDiagonally(0,0);
				let dd=p._direction-5,d2=dd*dd;
				p._x+=(d2===1)*dd;
				p._y+=(d2===9)*(1-((0<dd)<<1));
			}
		}break;
		case "R".charCodeAt(): if($gameMap){
			$gameMap.events().filter(x=>x.event().note==="init").forEach((evt)=>{
				evt.ssStateSet("A",1);
				evt.ssStateSet("B",1);
				evt.ssStateSet("C",1);
				evt.ssStateSet("D",1);
			});
			$gameMessage.popup("init events' switches cleared");
		}break;
		case "C".charCodeAt(): {
			let key='plantId-'+$gameMap._tilesetId,ch=0;
			let evt=$dataMap.events[ch+=$dataMap.templateStrt+($gamePlayer[key]^=0)];
			if(!evt||evt.isChild) break;
			//let lastDir=$gamePlayer._direction;
			//$gamePlayer._direction-=5; $gamePlayer._direction*=-1; $gamePlayer._direction+=5;
			let xy=$gamePlayer.frontPos(); xy={x:$gamePlayer.x,y:$gamePlayer.y};
			//$gamePlayer._direction=lastDir;
			switch($gamePlayer._direction){
			default: break;
			case 2:{
				let oy=Number($dataMap.events[ch].meta.occupiedy);
				if(!isNaN(oy)) xy.y-=oy;
			}break;
			case 4:{
				let ox=Number($dataMap.events[ch].meta.occupiedx);
				if(!isNaN(ox)) xy.x-=ox;
			}break;
			case 6: // bottom-left corner, thus no needs
			break;
			case 8: // bottom-left corner, thus no needs
			break;
			}
			$gameMessage.popup("+"+$gameMap.cpevt(ch,xy.x,xy.y,1,1,1,["B"])+"");
		}break;
		case "V".charCodeAt(): {
			let key='plantId-'+$gameMap._tilesetId;
			$gamePlayer[key]^=0;
			let ch=$dataMap.templateStrt+($gamePlayer[key]^0)+1,evtds=$dataMap.events,len=evtds.length;
			for(let x=len-$dataMap.templateStrt;x--;++ch){
				if(ch===len) ch=ch-len+$dataMap.templateStrt;
				let evt=evtds[ch];
				if(!evt||evt.isChild||evt.note==="init") continue;
				let tmp=ch-$dataMap.templateStrt;
				$gamePlayer[key]=tmp;
				$gameMessage.popup(tmp.toString());
				break;
			}
		}break;
		case "B".charCodeAt(): {
			$gameParty.burnAuth=$gameMap.parents().back;
			if($gameParty.burnLv<11) $gameParty.burnLv=11;
			if(!$gameParty._items[55]) $gameParty._items[55]=1;
			let tmparr=[];
			for(let x=0,arr=$gameMap._events;x!==arr.length;++x){ let evt=arr[x];
				if(evt&&evt._erased===false&&typeof evt._eventId==='string')
					tmparr.push([evt.dist2($gamePlayer),evt]);
			}
			let h=new Heap((b,a)=>a[0]-b[0],tmparr);
			while(h.length){
				h.top[1].start();
				h.pop();
			}
		}break;
		// print info
		case "T".charCodeAt(): if($gamePlayer && $gameMap){ // tiles
			let p=$gamePlayer,mp=$gameMap;
			let msgs=[];
			for(let lv=6;lv--;){
				let t=$dataMap.data[mp.xy2idx(p.x,p.y,lv)];
				msgs.push(t+" ("+t.toString(2).padZero(12)+")");
				//$gameMessage.popup(lv+": ");
			}
			let maxLen=msgs.map(x=>x.length).sort().back;
			msgs.forEach( (e,lv_)=>$gameMessage.popup(5-lv_+": "+e.padStart(maxLen)) );
		}break;
		case "I".charCodeAt(): { // player x,y
			let p=$gamePlayer;
			$gameMessage.popup($gameMap._mapId+" : "+"("+p.x+','+p.y+")");
		}break;
		case "E".charCodeAt(): if($gameMap){ // _events.length
			let mp=$gameMap;
			$gameMessage.popup("_events.length = "+mp._events.length);
			$gameMessage.popup("templateStrt = "+$dataMap.templateStrt);
			$gameMessage.popup("#stringIdEvts: "+mp._events.filter(x=>x&&typeof x._eventId==='string').length);
		}break;
	}}
	if(event.keyCode===80){ // "P"
		if(this._stopped) this.resume();
		else if(!window.inputting) this.pause();
	}
	return f.ori.call(this,event);
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// scene

// - base
$aaaa$=Scene_Base;
$aaaa$.prototype.updateChildren=Sprite.prototype.update;
$rrrr$=$aaaa$.prototype.detachReservation;
$dddd$=$aaaa$.prototype.detachReservation=function f(){
	debug.log('Scene_Base.prototype.detachReservation');
	return this._windowLayer?this._windowLayer.destructor():f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - boot
$aaaa$=Scene_Boot;
$aaaa$.prototype.isGameFontLoaded = function() {
	if(Graphics.isFontLoaded( _global_conf.useFont ) || Graphics.canUseCssFontLoading()) return true;
	else if(Date.now()-this._startDate>=20000) throw new Error('Failed to load font');
};

// - itemBase
$aaaa$=Scene_ItemBase;
$rrrr$=$aaaa$.prototype.applyItem;
$dddd$=$aaaa$.prototype.applyItem=function f(){
	debug.log('Scene_ItemBase.prototype.applyItem');
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;

// item
$aaaa$=Scene_Item;
$rrrr$=$aaaa$.prototype.create;
$dddd$=$aaaa$.prototype.create=function f(){
	debug.log('Scene_Item.prototype.create');
	return f.ori.call(this);
	//let help=this._helpWindow,actor=this._actorWindow;
	//let oriy=actor.y;
	//actor.y=help.y+help.height;
	//actor.height-=actor.y-oriy;
}; $dddd$.ori=$rrrr$;

// - title
$aaaa$=Scene_Title;
$rrrr$=$aaaa$.prototype.create;
$dddd$=$aaaa$.prototype.create=function f(){
	debug.log('Scene_Title.prototype.create');
	f.ori.call(this);
	$dataMap=null;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.createCommandWindow = function() {
	this._commandWindow = new Window_TitleCommand();
	this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
	this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
	this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
	if(this.addCustomCommands) this.addCustomCommands();
	this.addWindow(this._commandWindow);
};
$aaaa$.prototype.addCustomCommands=function(){
	if(debug&&debug.isdebug()) this._commandWindow.setHandler('customTitleCmd',  this.customTitleCommand.bind(this));
	this._commandWindow.setHandler('loadLocalSave',  ()=>{SceneManager.push(Scene_LoadLocal);});
	this._commandWindow.setHandler('loadOnlineSave',  ()=>{SceneManager.push(Scene_LoadOnline);});
	this._commandWindow.setHandler('usrSwitch_global', ()=>{SceneManager.push(Scene_UserSwitch);});
};
$aaaa$.prototype.customTitleCommand=function(){
	// do nothing
	deubug.log("Scene_Title.prototype.customTitleCommand");
	//debugger;
	this._commandWindow.close();
	return SceneManager.push(Scene_Title); // call stack not stacking . amazing !
};

// - menu
$aaaa$=Scene_Menu;
$aaaa$.prototype.create=function(){
	// reset device detection
	Utils._isAndroidChrome=undef;
	Utils._isMobileDevice=undef;
	Utils._isMobileSafari=undef;
	// main
	Scene_MenuBase.prototype.create.call(this);
	// - gold window before command window
	this.createGoldWindow();
	this.createCommandWindow();
	this.createStatusWindow();
};
$aaaa$.prototype.createCommandWindow=function(){
	this._commandWindow = new Window_MenuCommand(0, 0 ,{maxHeight:this._goldWindow.y});
	this._commandWindow.setHandler('item',   this.commandItem.bind(this));
	this._commandWindow.setHandler('skill',	 this.commandPersonal.bind(this));
	this._commandWindow.setHandler('equip',	 this.commandPersonal.bind(this));
	this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
	this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
	this._commandWindow.setHandler('options', this.commandOptions.bind(this));
	this._commandWindow.setHandler('save',	 this.commandSave.bind(this));
	this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
	this._commandWindow.setHandler('cancel', this.popScene.bind(this));
	if(this.addCustomCommands) this.addCustomCommands();
	this.addWindow(this._commandWindow);
};
$aaaa$.prototype.addCustomCommands=function f(){
	this._commandWindow.setHandler('debugMenu2', ()=>{SceneManager.push(Scene_DebugMenu2);} );
	if(this.addV_I_M) this.addV_I_M();
	this._commandWindow.setHandler('apps', ()=>{SceneManager.push(Scene_Apps);} );
		//this._commandWindow.setHandler('questMgr', ()=>{SceneManager.push(Scene_Quest);} );
		//this._commandWindow.setHandler('achievement', ()=>{SceneManager.push(Scene_Achievement);} );
	this._commandWindow.setHandler('usrSwitch', ()=>{SceneManager.push(Scene_UserSwitch);} );
	this._commandWindow.setHandler('saveLocal', ()=>{SceneManager.push(Scene_SaveLocal);} );
	return this._commandWindow.setHandler('saveOnline', ()=>{SceneManager.push(Scene_SaveOnline);} );
};
$aaaa$.prototype.addCustomCommands.setCancel=(w,f)=>{w.setHandler('cancel');return w;};
// - menu: V_I_M
$aaaa$.prototype.addV_I_M=function(){
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
$rrrr$=$dddd$=$aaaa$=undef;


// - map

$aaaa$=Scene_Map;
$rrrr$=$aaaa$.prototype.create;
$dddd$=$aaaa$.prototype.create=function f(){
	debug.log('Scene_Map.prototype.create');
	return f.ori.call(this);
	//let arr={}; for(let i in this) arr[i]=this[i];
	//debug.log(this.constructor.name,arr);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.onMapLoaded;
$dddd$=$aaaa$.prototype.onMapLoaded=function f(){
	debug.log('Scene_Map.prototype.onMapLoaded');
	debug.log('!$dataMap',!$dataMap);
	Sprite._counter&=0; // reset Sprite.spriteId counter // sprites will be in 'SceneManager._scene._spriteset._tilemap.children'
	// '$dataMap' is updated ; '$gameMap' will be updated after 'f.ori' if by '$gamePlayer.reserveTransfer'
	let lastMapId=$gameMap&&$gameMap._mapId;
	f.ori.call(this); // update '$gameMap' (and maybe others)
	Graphics._preCalScreenTileCoord(); // pre-cal. $gameMap.screenTileX(); $gameMap.screenTileY();
	// custom pannels
	if(!this._pannel){
		let idx=this._windowLayer.children.indexOf(this._messageWindow);
		this._pannel=new Window_CustomRealtimeMsgs();
		if(idx===-1) this._windowLayer.addChild(this._pannel);
		else this._windowLayer.addChildAt(this._pannel,idx);
	}
	if($gameParty.burnLv) $dataMap.burnlv_pannel=this._pannel.add($gameParty,'burnLv',{head:"燃燒等級",align:'center'});
	if(!$gamePlayer._noLeaderHp) this._pannel.add($gameParty,(pt)=>pt.leader().hp,{head:($gameParty._actors.length>1?"隊長":"")+"HP ",updateItvl:40,align:'left'});
	if(!$gamePlayer._noLeaderMp) this._pannel.add($gameParty,(pt)=>pt.leader().mp,{head:($gameParty._actors.length>1?"隊長":"")+"MP ",updateItvl:40,align:'left'});
	if($gamePlayer.speedup) this._pannel.add($gamePlayer,'speedup',{head:"疾風Lv",align:'center'});
	if($gameParty.canburn){
		this._pannel.add($gameParty,'canburn',{align:'center'});
		let last=this._pannel._windows.back;
		let x=last.x+last.width;
		if($gameParty.burnrange) this._pannel.add($gameParty,'burnrange',{head:"烈火Lv",align:'center',x:x,y:this._pannel._windows.back.y});
	}
	if($gameParty.canslash){
		this._pannel.add($gameParty,'canslash',{align:'center'});
		let last=this._pannel._windows.back;
		let x=last.x+last.width;
		if($gameParty.slashrange) this._pannel.add($gameParty,'slashrange',{head:"伐木Lv",align:'center',x:x,y:this._pannel._windows.back.y});
	}
	// fast search table
	// - $dataMap.coordTbl : (x,y)=>events
	if(!($dataMap.coordTbl&&$dataMap.coordTbl.mapid===$gameMap._mapId)){
		let tbl=$dataMap.coordTbl=[],w=$dataMap.width;
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue(); // .coordTbl
		for(let x=0,evts=$gameMap._events;x!==evts.length;++x){ let evt=evts[x];
			if(!evt || !$gameMap.isValid(evt.x,evt.y)) continue;
			tbl[evt.x+evt.y*w].push(evt);
		}
		tbl.mapid=$gameMap._mapId;
		
		// _Nt ( prevent creation of arrays )
		tbl=$dataMap.coordTblNt=[];
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue(); // .coordTblNt
		for(let x=0,evts=$gameMap._events;x!==evts.length;++x){ let evt=evts[x];
			if(!evt || !$gameMap.isValid(evt.x,evt.y) || evt.isThrough()) continue;
			tbl[evt.x+evt.y*w].push(evt);
		}
		
		// _NtP1 ( prevent creation of arrays )
		tbl=$dataMap.coordTblNtP1=[];
		tbl.length=$dataMap.height*w; for(let x=0;x!==tbl.length;++x) tbl[x]=new Queue(); // .coordTblNt
		for(let x=0,evts=$gameMap._events;x!==evts.length;++x){ let evt=evts[x];
			if(!evt || !$gameMap.isValid(evt.x,evt.y) || evt.isThrough() || evt._pri!==1) continue;
			tbl[evt.x+evt.y*w].push(evt);
		}
	}
	// - $dataMap.strtEvts : a list of starting events
	if(!($dataMap.strtEvts&&$dataMap.strtEvts.mapid===$gameMap._mapId)){
		let q=$dataMap.strtEvts=new Queue();
		q.mapid=$gameMap._mapId;
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
	debug.log('',lastMapId,'->',$gameMap._mapId);
		// from '$gamePlayer.reserveTransfer': different
		// from New Game: 0 -> init_map_id
		// from Continue: same
		// from scenePush and then scenePop (e.g. open menu then close it): same
	if(!$gameTemp.clearedWhenNewMap) $gameTemp.clearedWhenNewMap={};
	if(lastMapId!==$gameMap._mapId){ // map changed
		// clear temp:clearedWhenNewMap to '{}'
		$gameTemp.clearedWhenNewMap={};
		// active initialization events: turn on its switch "A"
		for(let x=0,arr=$dataMap.events;x!==arr.length;++x){ let evt=arr[x];
			if(evt&&evt.note==="init") $gameSelfSwitches.setValue([$gameMap._mapId,x,"A"],1);
		}
		// random map
		if($dataMap.meta.random){
			delete $gameParty.mch().randmaze; // clear before maze generation
			f.genRandMaze();
		}
	}
}; $dddd$.ori=$rrrr$;
$dddd$.genRandMaze=function f(){
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
	let tilepass  = meta.tilepass  .split(',').map(n=>Number(n));
	let tileblock = meta.tileblock .split(',').map(n=>Number(n));
	let tileentry = meta.tileentry .split(',').map(n=>Number(n));
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
			if(data[tiles[i][0]*sz+idx]===tiles[i][1]){
				mark[idx]=i; break;
			}
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
$rrrr$=$aaaa$.prototype.start;
$dddd$=$aaaa$.prototype.start=function f(){
	debug.log('Scene_Map.prototype.start');
	f.ori.call(this);
	return this._mapNameWindow.open();
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - gameover
$aaaa$=Scene_Gameover;
$rrrr$=$aaaa$.prototype.start;
$dddd$=$aaaa$.prototype.start=function f(){
	f.ori.call(this);
	let bs=this._backSprite;
	bs.x=(this.width -bs.width )>>1;
	bs.y=(this.height-bs.height)>>1;
}; $dddd$.ori=$rrrr$;

// objects

// - system
Game_System.prototype.onAfterLoad=function(){ // overwrite. wtf you forgot "pos"
	Graphics.frameCount = this._framesOnSave;
	AudioManager.playBgm(this._bgmOnSave,this._bgmOnSave.pos);
	AudioManager.playBgs(this._bgsOnSave,this._bgsOnSave.pos);
};

// - screen
$aaaa$=Game_Screen;
$aaaa$.prototype.eraseBattlePictures=function(){ // overwrite. wtf
	//this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
	// ? https://stackoverflow.com/questions/1232040/
	this._pictures.length=Math.min(this.maxPictures(),this._pictures.length);
};
$aaaa$.prototype.maxPictures=()=>3;

// - map

$aaaa$=Game_Map;
Object.defineProperties($aaaa$.prototype, {
	size: { get: function() { return $dataMap ? $gameMap.width()*$gameMap.height() : undefined; }, configurable: false },
	w: { get: function(){return this.width();}, configurable: false },
	h: { get: function(){return this.height();}, configurable: false },
	name: { get: function(){return this.displayName();}, configurable: false },
	_displayX: { get: function(){console.warn('lack of precision'); return this._displayX_tw/this.tileWidth();}, configurable: false },
	_displayY: { get: function(){console.warn('lack of precision'); return this._displayY_th/this.tileHeight();}, configurable: false },
	_dummy:{get:function(){return'';},configurable:false}
});
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(){
	this._displayX_tw^=0;
	this._displayY_th^=0;
	this._wtw^=0;
	this._hth^=0;
	f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.zaWarudo=function(){ return this._zaWarudo; };
$aaaa$.prototype.zaWarudo_waitToStart=function(evtid){
	if(!this._zaWarudo_waits) this._zaWarudo_waits=[];
	this._zaWarudo_waits.push(evtid);
};
$aaaa$.prototype.setZaWarudo=function(val){
	let arr=this._zaWarudo_waits;
	this._zaWarudo=val;
	if(arr&&!val){
		arr.forEach( (evtid)=>this._events[evtid].start() );
		delete this._zaWarudo_waits;
	}
};
$aaaa$.prototype.deltaX=function(x1, x2){
	let result=x1-x2,w;
	if(this.isLoopHorizontal() && (w=this.width())<(Math.abs(result)<<1)){
		if(result<0) result+=w;
		else result-=w;
	}
	return result;
};
$aaaa$.prototype.deltaY=function(y1, y2){
	let result=y1-y2,h;
	if (this.isLoopVertical() && (h=this.height())<(Math.abs(result)<<1)) {
		if(result<0) result+=h;
		else result-=h;
	}
	return result;
};
$aaaa$.prototype._screenTileX=0^0;
$aaaa$.prototype._screenTileY=0^0;
$aaaa$.prototype.isLoopHorizontal=function(){return $dataMap.scrollType&2;};
$aaaa$.prototype.isLoopVertical=function(){return $dataMap.scrollType&1;};
$aaaa$.prototype.adjustX_tw=function(x) {
	let rtv=x*this.tileWidth()-this._displayX_tw^0;
	rtv+=(this.isLoopHorizontal()&&this._wtw+rtv*2<Graphics.width)*this._wtw;
	return rtv;
};
$aaaa$.prototype.adjustX = function(x) {
	return this.adjustX_tw(x)/this.tileWidth();
};
$aaaa$.prototype.adjustY_th=function(y) {
	let rtv=y*this.tileHeight()-this._displayY_th^0;
	rtv+=(this.isLoopVertical()&&this._hth+rtv*2<Graphics.height)*this._hth;
	return rtv;
};
$aaaa$.prototype.adjustY=function(y) {
	return this.adjustY_th(y)/this.tileHeight();
};
$aaaa$.prototype.scrollDown_th=function(distance_th) {
	distance_th=~~(distance_th+0.5);
	let th=this.tileHeight(),gh=Graphics.height;
	if (this.isLoopVertical()) {
		this._displayY_th+=distance_th;
		this._displayY_th%=this._hth;
		//this._displayY=this._displayY_th/th; // use getter
		if (this._parallaxLoopY) {
			this._parallaxY += distance_th/th;
		}
	} else if (this._hth >= gh) {
		let lastY_th = this._displayY_th;
		this._displayY_th = Math.min(this._displayY_th + distance_th, this._hth - gh)^0;
		//this._displayY=this._displayY_th/th; // use getter
		this._parallaxY += (this._displayY_th - lastY_th)/th;
	}
	this._displayY_th^=0;
};
$aaaa$.prototype.scrollDown = function(distance) {
	console.warn(distance);
	return this.scrollDown_th(this.tileHeight()*distance);
};

$aaaa$.prototype.scrollLeft_tw=function(distance_tw) {
	distance_tw=~~(distance_tw+0.5);
	let tw=this.tileWidth(),gw=Graphics.width;
	if (this.isLoopHorizontal()) {
		this._displayX_tw+=this._wtw-distance_tw;
		this._displayX_tw%=this._wtw;
		//this._displayX=this._displayX_tw/tw; // use getter
		if (this._parallaxLoopX) this._parallaxX -= distance_tw/tw;
	} else if (this._wtw >= gw) {
		let lastX_tw = this._displayX_tw;
		this._displayX_tw=Math.max(this._displayX_tw - distance_tw, 0);
		//this._displayX=this._displayX_tw/tw; // use getter
		this._parallaxX+=(this._displayX_tw - lastX_tw)/tw;
	}
	this._displayX_tw^=0;
};
$aaaa$.prototype.scrollLeft = function(distance) {
	console.warn(distance);
	return this.scrollLeft_tw(this.tileWidth()*distance);
};
$aaaa$.prototype.scrollRight_tw=function(distance_tw) {
	distance_tw=~~(distance_tw+0.5);
	let tw=this.tileWidth(),gw=Graphics.width;
	if (this.isLoopHorizontal()) {
		this._displayX_tw+=distance_tw;
		this._displayX_tw%=this._wtw;
		//this._displayX=this._displayX_tw/tw; // use getter
		if (this._parallaxLoopX) this._parallaxX += distance_tw/tw;
	} else if (this._wtw >= gw) {
		let lastX_tw = this._displayX_tw;
		this._displayX_tw=Math.min(this._displayX_tw + distance_tw, this._wtw - gw)^0;
		//this._displayX=this._displayX_tw/tw; // use getter
		this._parallaxX+=(this._displayX_tw - lastX_tw)/tw;
	}
	this._displayX_tw^=0;
};
$aaaa$.prototype.scrollRight = function(distance) {
	console.warn(distance);
	return this.scrollRight_tw(this.tileWidth()*distance);
};
$aaaa$.prototype.scrollUp_th=function(distance_th) {
	distance_th=~~(distance_th+0.5);
	let th=this.tileHeight(),gh=Graphics.height;
	if (this.isLoopVertical()) {
		this._displayY_th+=this._hth-distance_th;
		this._displayY_th%=this._hth;
		//this._displayY=this._displayY_th/th; // use getter
		if (this._parallaxLoopY) {
			this._parallaxY -= distance_th/th;
		}
	} else if (this._hth >= gh) {
		let lastY_th=this._displayY_th;
		this._displayY_th=Math.max(this._displayY_th - distance_th, 0)^0;
		//this._displayY=this._displayY_th/th; // use getter
		this._parallaxY+=(this._displayY_th - lastY_th)/th;
	}
	this._displayY_th^=0;
};
$aaaa$.prototype.scrollUp = function(distance) {
	console.warn(distance);
	return this.scrollUp_th(this.tileHeight()*distance);
};
$aaaa$.prototype.screenTileX=function(){ return this._screenTileX^0; };
$aaaa$.prototype.screenTileY=function(){ return this._screenTileY^0; };
$aaaa$.prototype.setDisplayPos = function(x, y) {
	// called by Game_Player
{
	let tw=this.tileWidth();
	if (this.isLoopHorizontal()) {
		this._displayX_tw=(x*tw).mod(this._wtw)^0;
		//this._displayX=this._displayX_tw/tw; // use getter
		this._parallaxX=x;
	} else {
		let endX_tw=this._wtw - Graphics.width;
		this._displayX_tw=endX_tw<0?endX_tw>>1:(x*tw).clamp(0,endX_tw);
		//this._displayX=this._displayX_tw/tw; // use getter
		this._parallaxX=this._displayX;
	}
}
{
	let th=this.tileHeight();
	if (this.isLoopVertical()) {
		this._displayY_th=(y*th).mod(this._hth)^0;
		//this._displayY=this._displayY_th/th; // use getter
		this._parallaxY=y;
	} else {
		let endY_th=this._hth - Graphics.height;
		this._displayY_th=endY_th<0?endY_th>>1:(y*th).clamp(0, endY_th);
		//this._displayY=this._displayY_th/th; // use getter
		this._parallaxY=this._displayY;
	}
}
	this._displayX_tw^=0;
	this._displayY_th^=0;
};
$aaaa$.prototype.canvasToMapX=function(x) {
	//let tileWidth = this.tileWidth();
	//let originX = this._displayX_tw;
	let rtv=((this._displayX_tw + x) / this.tileWidth()^0);
	return this.roundX(rtv);
	//return this.roundX(mapX);
};
$aaaa$.prototype.canvasToMapY=function(y){
	//let tileHeight = this.tileHeight();
	//let originY = this._displayY_th;
	let rtv=((this._displayY_th + y) / this.tileHeight()^0);
	return this.roundY(rtv);
	//return this.roundY(mapY);
};
$rrrr$=$aaaa$.prototype.setup;
$dddd$=$aaaa$.prototype.setup=function f(){
	debug.log('Game_Map.prototype.setup');
	// $dataMap is updated
	this._wtw=this.width ()*this.tileWidth ();
	this._hth=this.height()*this.tileHeight();
	Graphics._preCalScreenTileCoord();
	//AudioManager.stopAll();
	AudioManager.stopMe();
	AudioManager.stopBgs();
	AudioManager.stopSe();
	f.ori.call(this,arguments[0]);
	this.loadDynamicEvents();
	// load 'meta.recordLoc' s
	this.load_recordLoc();
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.save_recordLoc=function(){
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
$aaaa$.prototype.load_recordLoc=function(){
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
$aaaa$.prototype.loadDynamicEvents=function f(fromLoadFile,noUpdate){
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
				let newevt=new Game_Event(this._mapId,i);
				for(let j in evt) newevt[j]=evt[j]; // attrs
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
};
$aaaa$.prototype.loadDynamicEvents.relatedSelfSwitches=(evt,doRemove)=>{
	// evt.constructor === Game_Event
	
	// self switches
	if(evt._sameStatEvts){
		let obj=$gameSelfSwitches._data[$gameMap._mapId];
		let svs=$gameSelfSwitches.switches.map((s)=>[ s , !doRemove && obj[([evt._eventId,s])] ]);
		for(let x=0,arr=evt._sameStatEvts;x!==arr.length;++x){ let evtid=arr[x];
			for(let z=0;z!==svs.length;++z){ let sv=svs[z];
				$gameSelfSwitches.setValue_(obj,[evtid,sv[0]],sv[1]);
			}
		}
	}
	
	return evt;
};
$aaaa$.prototype.forEachEvtByDist=function(cxy,evts,callback,is_far2near){
	// dist2
	// cxy = {x:Number(...),y:Number(...)};
	let C={_realX:cxy.x,_realY:cxy.y,dist2:1};
	evts=is_far2near?evts.map(x=>[x.dist2_r(C),x,]):evts.map(x=>[-x.dist2_r(C),x,]);
	let h=new Heap((a,b)=>{-(a[0]<b[0]);},evts,1);
	while(h.length){ callback(h.top[1]); h.pop(); }
};
$aaaa$.prototype.xy2idx=function(x,y,lv=0){
	return this.isValid(x,y) && $dataMap ? x+$gameMap.width()*y+lv*this.size : undefined;
};
$aaaa$.prototype.getAllTileByRef=function(r){
	return this.getAllTileByPos(r.x,r.y);
};
$aaaa$.prototype.getAllTileByPos=function(x,y){
	let i=this.xy2idx(x,y); if(i===undefined) return [];
	let rtv=[],arr=$gameMap.data();
	for(let mapsz=this.size;i<arr.length;i+=mapsz) rtv.push(arr[i]);
	return rtv;
};
$aaaa$.prototype.getAllTileFlagsByPos=function(x,y){
	let i=this.xy2idx(x,y); if(i===undefined) return [];
	let rtv=[],tileIds=$gameMap.data(),tileFlags=this.tilesetFlags();
	for(let mapsz=this.size;i<tileIds.length;i+=mapsz) rtv.push(tileFlags[ tileIds[i] ]);
	return rtv;
};
$aaaa$.prototype.tilesetFlags=function() {
	let tileset=this.tileset();
	return tileset?tileset.flags:[];
};
$aaaa$.prototype.checkPassage=function(x,y,bit){
	let flags=this.tilesetFlags();
	let tiles=this.allTiles(x, y);
	let i,flag;
	for(i=0;i!==tiles.length;++i){ if(tiles[i]>=8176){
		flag=tiles[i];
		if((flag & bit) === 0)   return true;  // [o] Passable
		if((flag & bit) === bit) return false; // [x] Impassable
	}}
	for(i=0;i!==tiles.length;++i){
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
$dddd$=$aaaa$.prototype.layeredTiles=function f(x,y){ // rewrite for efficiency
	//let idx=this.width()*y+x;
	//let rtv=$dataMap.data3d[idx];
	//if(rtv.length!==4) DataManager.resetData3d(idx); // for future use: reduce mem usage
	//return rtv;
	return $dataMap.data3d[$dataMap.width*y+x]||f._dummy;
};
$dddd$._dummy=[];
$aaaa$.prototype.allTiles=function(x,y){ // rewrite for efficiency
	//return this.tileEventsXy(x, y).map(evt=>evt.tileId()).concat(this.layeredTiles(x, y));
	// discard tileEvents // 'this.tileEvents' is mostly empty
	return this.layeredTiles(x, y);
};
$aaaa$.prototype.isPassable=function(x,y,d){
	return this.checkPassage(x,y,( 1<<((d>>1)-1) )&15 );
};
$rrrr$=$aaaa$.prototype.isDamageFloor;
$dddd$=$aaaa$.prototype.isDamageFloor=function f(X,Y){
	let rtv=f.ori.call(this,X,Y);
	if(rtv){
		if(!$dataMap.preventDamageFloor) $dataMap.preventDamageFloor=JSON.parse($dataMap.meta.preventDamageFloor||"[]");
		for(let x=0,arr=$dataMap.preventDamageFloor;x!==arr.length;++x){ switch(arr[x][0]){
			default: break;
			case 'i':{
				let items=$gameParty._items,t=arr[x][1];
				let cost=arr[x][2]===undefined?0:arr[x][2]^0;
				if(items[t]>=cost){
					if((items[t]-=cost)===0) delete items[t];
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
}; $dddd$.ori=$rrrr$;
$dddd$=$aaaa$.prototype.isChair=function f(x,y){
	if(parseInt(x)!==x||parseInt(y)!==y) return false;
	return $dataMap.isChair[y*$dataMap.width+x];
};
$dddd$.tbl=[];
$rrrr$=$aaaa$.prototype.displayName;
$dddd$=$aaaa$.prototype.displayName=function f(){
	debug.log('Game_Map.prototype.displayName');
	let pt=$gameParty && $gameParty.mapChanges,id=$gameMap._mapId;
	return pt && pt[id] && pt[id].name || f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.data;
$dddd$=$aaaa$.prototype.data=function f(idx){
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
		for(let it=idxset.values(),t;(t=it.next()).done===false;) DataManager.resetData3d(t.value);
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
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.toBroken=function(permanent){
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
$aaaa$.prototype.cpevt=function f(evtid,x,y,w,h,overwrite,ssStates,noUpdate){
	debug.log('Game_Map.prototype.cpevt');
	// copy an event filling a rectangle range on this map
	// return number of successful copied. no boundary check
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
		if(marker[this.xy2idx(x,y)]) continue;
		let newid=evtid+'-'+tm+"_"+evts.length;
		while(newid in evts) newid+="_";
		let obj=new Game_Event(mapid,newid); // obj._mapId=mapid;
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
$aaaa$.prototype.parents=function f(mapId){
	mapId=mapId||this._mapId;
	let rtv=[]; if(!mapId) return rtv;
	for(let id=$dataMapInfos[mapId].parentId;id;id=$dataMapInfos[id].parentId){
		rtv.push(id);
	}
	return rtv;
};
$aaaa$.prototype.getRoot=function(mapId){
	mapId=mapId||this._mapId;
	let tmp;
	while((tmp=$dataMapInfos[mapId])&&tmp.name.slice(-5)!=='-root') mapId=tmp.parentId;
	return mapId||undef;
};
$aaaa$.prototype.adjMtx=function(strtx,strty,canPassOnEvts){
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
			if(canPassOnEvts || $dataMap.coordTbl[this.xy2idx(newx,newy)].map(e=>{let evtd=e.event(); return !evtd.meta.passable&&(!evtd.isChild||evtd.meta.isOnLand)^0;}).sum()===0)
				q.push([newx,newy]);
		}
	}
	delete rtv[this.xy2idx($gamePlayer.x,$gamePlayer.y)];
	if($dataMap.eventsByMeta.passable){ for(let x=0,evts=this._events,arr=$dataMap.eventsByMeta.passable;x!==arr.length;++x){ let evt=evts[arr[x]];
		delete rtv[this.xy2idx(evt.x,evt.y)];
	}}
	return $dataMap._adjMtx=rtv;
};
$aaaa$.prototype.ss=function(evtid,sname){
	let res=this._events[evtid].ssState(sname);
	return res.obj[res.key];
};
$aaaa$.prototype.events=function(){ // overwrite
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
$aaaa$.prototype.eventsXy=function(posx,posy){ // overwrite. forEach is slowwwwwwwwww
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
$aaaa$.prototype.eventsXyNt=function(posx,posy){ // overwrite.
	if(!this.isValid(posx,posy)) return [];
	let mapd=$dataMap,tbl;
	if(tbl=mapd&&mapd.coordTblNt&&mapd.coordTblNt[mapd.width*posy+posx]) return tbl;
	return (mapd&&mapd.coordTbl&&mapd.coordTbl[mapd.width*posy+posx]||this._events).filter(evt=>evt&&evt.posNt(posx,posy));
};
$aaaa$.prototype.isAnyEventStarting=function(){ // overwrite. Array.some is slowwwwwwwwww
	//debug.log('Game_Map.prototype.isAnyEventStarting'); // this is polling
	if($dataMap.strtEvts) return $dataMap.strtEvts.length!==0;
	for(let x=0,arr=this._events;x!==arr.length;++x){ let evt=arr[x];
		if(evt && evt.isStarting()) return true;
	}
	return false;
};
$aaaa$.prototype.updateEvents=function(){ // overwrite. forEach is slowwwwwwwwww
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
$rrrr$=$aaaa$.prototype.setupStartingEvent;
$dddd$=$aaaa$.prototype.setupStartingEvent=function f(){
	//debug.log('Game_Map.prototype.setupStartingEvent'); // this is polling
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.setupStartingMapEvent;
$dddd$=$aaaa$.prototype.setupStartingMapEvent=function f(){ // overwrite. looking through everything is slowwwwwwwwww
	//debug.log('Game_Map.prototype.setupStartingMapEvent'); // this is polling
	// 'Game_Map.prototype.setupStartingEvent' is polling => 'Game_Map.prototype.setupStartingMapEvent' becomes polling
	//return f.ori.call(this); // debug
	let rtv=false,q=$dataMap.strtEvts;
	while(q.length){
		let evtStrt=q.front; q.pop();
		let evt=evtStrt[0],strtMeta=evtStrt[1];
		if(evt._starting){
			evt.clearStartingFlag();
			this._interpreter.setup(evt.page().list, evt._eventId,strtMeta);
			rtv=true;
			break;
		}
	}
	return rtv;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.refresh;
$dddd$=$aaaa$.prototype.refresh=function f(){ // reduce refresh calls
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
}; $dddd$.ori=$rrrr$;
$dddd$.itvl=16; $dddd$.lastTime=0;
$rrrr$=$aaaa$.prototype.requestRefresh;
$dddd$=$aaaa$.prototype.requestRefresh=function f(){
	//debug.log('Game_Map.prototype.requestRefresh');
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.requestRefresh=$rrrr$; // not changed
$dddd$={};
// $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - interpreter
$aaaa$=Game_Interpreter;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(){
	this._strtMeta=undef;
	return f.ori.call(this,arguments[0]);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.setup;
$dddd$=$aaaa$.prototype.setup=function f(list,evtId,strtMeta){
	this._strtMeta=strtMeta;
	return f.ori.call(this,list,evtId);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.clear;
$dddd$=$aaaa$.prototype.clear=function f(){
	// flow: '.terminate' , '.clear'
	this._strtMeta=undef;
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$dddd$=$aaaa$.prototype.command101=function f(){
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
					if(m){ evt=$gameMap._events[m[1]]; txt=txt.slice(m[1].length+2); }
					else evt=this.getEvt();
					evt.setFace(); $gameMessage._evtName=evt.event().meta.name; // only needed when its face is set.
					if($gameMap.ss(evt._eventId,"knowName")) $gameMessage._nameField=this._nameField||$gameMessage._evtName;
				} // evt face
				else if(txt[1]==="L"){
					txt=txt.slice(2); $gameParty.setFace();
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
$dddd$.re_faceExt=/^\[([0-9]+)\]/;
$aaaa$.prototype.ssKey=function(){ // not used ?
	return [this._mapId, this._eventId, this._params[1]];
};
$aaaa$.prototype.command111=function(){ // cond branch
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
		result=!!eval(this._params[1]);
	}break;
	case 13:{ // Vehicle
		result=($gamePlayer.vehicle()===$gameMap.vehicle(this._params[1]));
	}break;
	}
	if((this._branch[this._indent]=result)===false) this.skipBranch();
	return true;
};
$aaaa$.prototype.command123=function(){ // ctrl ss
	if(this._eventId.toId()>0){
		let key=[this._mapId,this._eventId,this._params[0]];
		$gameSelfSwitches.setValue(key, this._params[1] === 0);
	}
	return true;
};
$aaaa$.prototype.command214=function(){ // erase evt
	if(this.isOnCurrentMap()&&this._eventId.toId()>0) $gameMap.eraseEvent(this._eventId);
	return true;
};
if(0&&0)$aaaa$.prototype.command230=function(){ // wait
	// no need to rewrite
	// in script, 60 means 1 sec, no matter how much fps.
	this.wait(this._params[0]>>(_global_conf.halfFps^0));
	return true;
};
// - - expose info
$aaaa$.prototype.getEvt=function(){ return $gameMap._events[this._eventId] };
$rrrr$=$dddd$=$aaaa$=undef;

// - Game_BattlerBase
$aaaa$=Game_BattlerBase;
Object.defineProperties($aaaa$.prototype, {
	mtp: { get: function() { return this.maxTp(); }, configurable: false },
	_dummy:{get:function(){return'';},configurable:false}
});
$rrrr$=$aaaa$.prototype.canUse;
$dddd$=$aaaa$.prototype.canUse=function f(dataItem){
	let meta=dataItem&&dataItem.meta;
	if(SceneManager._scene.constructor===Scene_Item && (meta.code||meta.func)) return true;
	return f.ori.call(this,dataItem);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.paramMax=function(paramId){
	if(paramId===0){
		return 999999;  // MHP
	}else if(paramId===1){
		return 999999;	// MMP
	}else{
		return 999999;
	}
};
$dddd$=$aaaa$.prototype.states=function f(){
	return this._states.map(f.toDataState);
};
$dddd$.toDataState=id=>$dataStates[id];
$rrrr$=$dddd$=$aaaa$=undef;

// - chrB
$aaaa$=Game_CharacterBase;
$aaaa$.prototype.scrolledX_tw=function() {
	return $gameMap.adjustX_tw(this._realX);
};
$aaaa$.prototype.scrolledY_th=function() {
	return $gameMap.adjustY_th(this._realY);
};
$aaaa$.prototype.isNearTheScreen = function() {
	let gw = Graphics.width;
	let gh = Graphics.height;
	let px = this.scrolledX_tw() + ($gameMap.tileWidth()>>1) - (gw>>1);
	let py = this.scrolledY_th() + ($gameMap.tileHeight()>>1) - (gh>>1);
	return px >= -gw && px <= gw && py >= -gh && py <= gh;
};
$aaaa$.prototype.screenX=function() {
	return this.scrolledX_tw()+($gameMap.tileWidth()>>1);
};
$aaaa$.prototype.screenY=function() {
	return this.scrolledY_th()+$gameMap.tileHeight()-this.shiftY()-this.jumpHeight();
};
$aaaa$.prototype.screenZ=function(){
	return (this._priorityType<<1)|1;
};
$dddd$=$aaaa$.prototype.canPassDiagNumpad = function f(x,y,dir){
	return this.canPassDiagonally(x,y,f.h[dir],f.v[dir]);
};
//       [0,1,2,3,4,5,6,7,8,9];
$dddd$.h=[0,4,0,6,4,0,6,4,0,6];
$dddd$.v=[0,2,2,2,0,0,0,8,8,8];
$dddd$=$aaaa$.prototype.moveDiagonally=function f(horz, vert) {
	let isSucc=this.canPassDiagonally(this._x, this._y, horz, vert);
	if(isSucc){
		this.setMovementSuccess(isSucc);
		if(this.isMovementSucceeded()){
			this._x=$gameMap.roundXWithDirection(this._x, horz);
			this._y=$gameMap.roundYWithDirection(this._y, vert);
			this._realX=$gameMap.xWithDirection(this._x, this.reverseDir(horz));
			this._realY=$gameMap.yWithDirection(this._y, this.reverseDir(vert));
			this.increaseSteps();
		}
	}else{
		let canx=this.canPass(this._x,this._y,horz),cany=this.canPass(this._x,this._y,vert);
		isSucc=canx|cany;
		if(this._direction&4){
			if(canx) this.moveStraight(horz);
			else if(cany) this.moveStraight(vert);
		}else{
			if(cany) this.moveStraight(vert);
			else if(canx) this.moveStraight(horz);
		}
		if(isSucc) return ;
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
	}else this.setDirection(horz|vert);
};
//            [0,1,2,3,4,5,6,7,8,9];
$dddd$.dirbit=[0,0,1,0,2,0,1,0,2,0]; // none:0 +:1 -:2
$dddd$=$aaaa$.prototype.d8to4=function f(d){ return f.tbl[d]|0; };
$dddd$.tbl=[0x00,0x24,0x20,0x26,0x04,0x00,0x06,0x84,0x80,0x86]; /* Y(8,2),X(4,6) numpad */
$aaaa$.prototype.moveDiagonally_d8=function(d8) {
	let dirxy=this.d8to4(d8);
	let dirx=dirxy&0xF,diry=dirxy>>4;
	return ((dirx===0)|(diry===0))?this.moveStraight(dirx|diry):this.moveDiagonally(dirx,diry);
};
$rrrr$=$aaaa$.prototype.realMoveSpeed;
$dddd$=$aaaa$.prototype.realMoveSpeed=function f(){
	return (this.speedup^0)/2.0+f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.jump;
$dddd$=$aaaa$.prototype.jump=function f(dx,dy){
	return f.ori.call(this,dx|0,dy|0);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.isCollidedWithEvents=function(posx,posy){ // overwrite. wtf is making a new array and then search
	//debug.log('Game_CharacterBase.prototype.isCollidedWithEvents');
	if(!$gameMap.isValid(posx,posy)) return false;
	let mapd=$dataMap,tbl;
	if(tbl=mapd&&mapd.coordTblNtP1&&mapd.coordTblNtP1[mapd.width*posy+posx]) return tbl.length!==0;
	return (mapd&&mapd.coordTbl&&mapd.coordTbl[mapd.width*posy+posx]||this._events).some(evt=>evt&&evt.posNt(posx,posy)&&evt.isNormalPriority());
	// note: why normal?
};
$aaaa$.prototype.genBlood=function(permanent){ // tile
	if(permanent){
		let data={}; data[$gameMap.xy2idx(this.x,this.y,2)]=599;
		$gameParty.changeMap('tile',data);
	}
	else $dataMap.data[$gameMap.xy2idx(this.x,this.y,2)]=599;
};
$rrrr$=$aaaa$.prototype.requestAnimation;
$dddd$=$aaaa$.prototype.requestAnimation=function f(id){
	if(_global_conf.noAnimation) id=0;
	f.ori.call(this,id);
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - chr
$aaaa$=Game_Character;
// - chr: expose info
$aaaa$.prototype.dist1=function(chr,real){
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
$aaaa$.prototype.dist1_r=function(chr){ return this.dist1(chr,1); };
$aaaa$.prototype.dist2=function(chr,real){
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
$aaaa$.prototype.dist2_r=function(chr){ return this.dist2(chr,1); };
$aaaa$.prototype.xy2idx=function f(lv){ return $gameMap.xy2idx(this.x,this.y,lv); };
$aaaa$.prototype.frontPos=function f(){
	if(f.deltas===undefined) f.deltas=[ {x:0,y:0},
			/*
				2,+y
			4,-x		6,+x
				8,-y
			*/
				{x:0,y:1},
			{x:-1,y:0},	{x:1,y:0},
				{x:0,y:-1},
		];
	let delta=f.deltas[(this._direction>>1)];
	return {x:this._x+delta.x,y:this._y+delta.y};
};
Object.defineProperties($aaaa$.prototype, {
	frontx: { get: function() { return this.frontPos().x; }, configurable: false },
	fronty: { get: function() { return this.frontPos().y; }, configurable: false },
	_dummy:{get:function(){return'';},configurable:false}
});
$aaaa$.prototype.isInLoc=function(xL,yL,xH,yH){
	// L,H included
	return xL<=this.x&&this.x<=xH&&yL<=this.y&&this.y<=yH;
};
// - chr: move
$aaaa$.prototype.searchLimit=function(){ // steps
	return _global_conf['default searchLimit']||14;
};
$aaaa$.prototype.moveTowardCharacter=function(chr){
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
$aaaa$.prototype.moveAwayFromCharacter=function(chr){
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
$aaaa$.prototype.turnTowardCharacter=function(chr){
	let sx=this.deltaXFrom(chr.x);
	let sy=this.deltaYFrom(chr.y);
	if(Math.abs(sy)<Math.abs(sx)) this.setDirection(sx<0?6:4);
	else if(sy!==0) this.setDirection(sy<0?2:8);
};
$aaaa$.prototype.turnAwayFromCharacter=function(chr){
	let sx=this.deltaXFrom(chr.x);
	let sy=this.deltaYFrom(chr.y);
	if(Math.abs(sy)<Math.abs(sx)) this.setDirection(0<sx?6:4);
	else if(sy!==0) this.setDirection(0<sy?2:8);
};
$aaaa$.prototype.findDirectionTo=function f(goalx,goaly){
	//debug.log('Game_Character.prototype.findDirectionTo');
	//a; // debug - cracking
		// when called by $gamePlayer
			// Game_Player.prototype.update
				// Game_Player.prototype.moveByInput
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
	let mapWidth = $gameMap.width();
	let mapHeight = $gameMap.height();
	let cd=this.canDiag|0; // boolean
	let strtIdx=this._y*mapWidth+this._x;
	
	// reversed search: goal -> start
	// - bfs: mark costs
	let costs=[]; costs.length=mapWidth*mapHeight; for(let x=0;x!==costs.length;++x) costs[x]=costs.length;
	//debug.log(costs); // debug
	let queue=new Queue(); queue.push({x:goalx,y:goaly,c:0});
	// - - surroundings, prevent from 'clicking on events causes no effect'
	for(let dir=10;dir-=2;){
		let newx=$gameMap.roundXWithDirection(goalx,dir);
		let newy=$gameMap.roundYWithDirection(goaly,dir);
		if($gameMap.isValid(newx,newy)) queue.push({x:newx,y:newy,c:1});
	}
	while(queue.length){
		let curr=queue.front; queue.pop();
		let currIdx=curr.y*mapWidth+curr.x;
		if(curr.c>=costs[currIdx]) continue;
		costs[currIdx]=curr.c;	//console.log(curr); // debug
		if(currIdx===strtIdx) break;
		for(let dir=10;dir-=2;){
			let newx=$gameMap.roundXWithDirection(curr.x,dir);
			let newy=$gameMap.roundYWithDirection(curr.y,dir);
			if( !$gameMap.isValid(newx,newy) || // (newx<0 || newx>=mapWidth || newy<0 || newy>=mapHeight) ||
				!this.canPass(newx,newy,10-dir) ) // reversed search
				continue;
			let newNode={x:newx,y:newy,c:curr.c+1};
			if(newNode.c<costs[newy*mapWidth+newx]) queue.push(newNode);
		}
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
//$rrrr$=$aaaa$.prototype.isCollidedWithCharacters;
//$dddd$=$aaaa$.prototype.isCollidedWithCharacters=function(){ // overwrite
//}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.mvRefChr=function(chr){ this._x=chr._x; this._y=chr._y; };
$aaaa$.prototype.mvAbs=function(x,y){ this._x=x; this._y=y; };
$aaaa$.prototype.mvDiff=function(dx,dy){ this._x+=dx; this._y+=dy; };
$aaaa$.prototype.moveRandom = function() {
	let d=(Math.randomInt(4)+1)<<1;
	if(this.canPass(this.x,this.y,d)) this.moveStraight(d);
};
$rrrr$=$dddd$=$aaaa$=undef;

// - msg
$aaaa$=Game_Message;
$rrrr$=$aaaa$.prototype.clear;
$dddd$=$aaaa$.prototype.clear=function f(){
	this._evtName=undef;
	this._nameField=undef;
	this._lastFinish=undef;
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.isBusy;
$dddd$=$aaaa$.prototype.isBusy=function f(){
	return f.ori.call(this)||this._windowCnt;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.add;
$dddd$=$aaaa$.prototype.add=function f(txt){
	return f.ori.call(this,txt);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.add_finishQuest=function f(qname){
	if(f.prefix===undefined) f.prefix="\\RGB["+$dataCustom.textcolor.finish+"]完成 \\RGB["+$dataCustom.textcolor.quest+"]"; // must be set in runtime due to '$dataCustom'
	let txt=f.prefix+qname;
	if(qname!==undefined && qname!==null&&qname===this._lastFinish){
		//this._lastFinish_cnt^=0; // no need
		++this._lastFinish_cnt;
		this._texts.pop();
		txt+="\\RGB["+$dataCustom.textcolor.default+"] * "+this._lastFinish_cnt;
	}else{
		this._lastFinish=qname;
		this._lastFinish_cnt=1;
	}
	return this.add(txt);
};
$aaaa$.prototype.addWindow=function(w){
	this._windowCnt^=0; ++this._windowCnt;
	w.setHandler('cancel',()=>{ --this._windowCnt; w.parent.removeChild(w); });
	SceneManager._scene.addWindow(w);
};
$dddd$=$aaaa$.prototype.addGameoverMsg=(txt,kargs)=>{
	if(!$dataMap.gameoverMsgs) $dataMap.gameoverMsgs=[];
	kargs=kargs||{};
	if(!kargs.align) kargs.align='center';
	$dataMap.gameoverMsgs.push([txt,kargs]);
}; $dddd$.clear=()=>{if(!$dataMap.gameoverMsgs) $dataMap.gameoverMsgs=[];$dataMap.gameoverMsgs.length=0;};
$aaaa$.prototype.popup=function(txt,top,kargs){
	//debug.log('Game_Message.prototype.popup');
	let wl=SceneManager._scene._windowLayer;
	if(!wl) return;
	if(top){
		if(!wl._popupLayerTop) wl.addChild(wl._popupLayerTop=new Window_CustomPopups({alignV:'top'}));
		wl._popupLayerTop.add(txt,undef,{t_remained:kargs&&kargs['t_remained']||2000});
	}else{
		if(!wl._popupLayer) wl.addChildAt(wl._popupLayer=new Window_CustomPopups(),0);
		wl._popupLayer.add(txt,undef,{t_remained:kargs&&kargs['t_remained']||2000});
	}
};
$aaaa$.prototype._isBusy_cache=function(){
	if(this._isBusy_n) --this._isBusy_n;
	else this.isBusy=this.constructor.prototype.isBusy;
	return this._isBusy;
};
$aaaa$.prototype.isBusy_saved=function(useMoreNTimes){
	let rtv=this._isBusy=this.isBusy();
	this._isBusy_n=useMoreNTimes^0;
	this.isBusy=this._isBusy_cache;
	return rtv;
};
$aaaa$.prototype.setNameField=function(s){ this._nameField=s; };
$rrrr$=$dddd$=$aaaa$=undef;

// - player
$aaaa$=Game_Player;
Object.defineProperties($aaaa$.prototype, {
	ItemListMaxCol: { get: function(){
			return Window_ItemList.prototype.maxCols();
		}, set: function(rhs){
			return this._ItemListMaxCol=rhs;
	}, configurable: false },
	name: { get: function(){
			return this._name===undefined?this.savefilename:this._name;
		}, set: function(rhs){
			return this._name=rhs;
	}, configurable: false },
	dirs: { get: function(){
			return [[0,1],[-1,0],[1,0],[0,-1]];
	}, configurable: false },
	speedup: { get: function(){
			return this._sUp^0;
		}, set: function(rhs){ let n=Number(rhs); if(isNaN(n)) return rhs;
			if(this._sUp!==n) $gameMessage.popup("切換至"+$dataItems[64].name.slice(0,-1)+n,1);
			return this._sUp=n;
	}, configurable: false },
	_dummy:{get:function(){return'';},configurable:false}
});
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(){
	f.ori.call(this);
	this.maxSavefiles=DataManager.maxSavefiles();
	[
		"_noGainMsg","_noGainHint","_noGainSound",
		"_noLeaderHp","_noLeaderMp",
	].forEach(x=>ConfigManager[x]&&(this[x]=ConfigManager[x]));
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.refresh=function(){
	let actor=$gameParty.leader();
	let characterName=actor?actor.characterName():'';
	let characterIndex=actor?actor.characterIndex():0;
	this.setImage(characterName,characterIndex);
	this._followers.refresh();
};
$aaaa$.prototype.getInputDirection = function() {
	return this.canDiag?Input.dir8:Input.dir4;
};
$aaaa$.prototype.executeMove = function(direction) {
	return this.canDiag?this.moveDiagonally_d8(direction):this.moveStraight(direction);
};
$aaaa$.prototype.updateDashing=function(){
	if(this.isMoving()) return;
	if(!this.isInVehicle() && !$gameMap.isDashDisabled()){
		this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
	}else this._dashing=false;
};
$aaaa$.prototype.update = function(sceneActive) {
	let lastScrolledX_tw = this.scrolledX_tw();
	let lastScrolledY_th = this.scrolledY_th();
	let wasMoving = this.isMoving();
	this.updateDashing();
	if (sceneActive) {
		this.moveByInput();
	}
	Game_Character.prototype.update.call(this);
	this.updateScroll_t(lastScrolledX_tw, lastScrolledY_th);
	this.updateVehicle();
	if (!this.isMoving()) {
		this.updateNonmoving(wasMoving);
	}
	this._followers.update();
};
$aaaa$.prototype.updateScroll_t=function(lastScrolledX_tw, lastScrolledY_th) {
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
$aaaa$.prototype.centerX_tw = function() {
	return Graphics.width-$gameMap.tileWidth() >> 1;
};
$aaaa$.prototype.centerY_th=function(){
	return Graphics.height-$gameMap.tileHeight() >> 1;
};
$rrrr$=$aaaa$.prototype.gatherFollowers;
$dddd$=$aaaa$.prototype.gatherFollowers=function f(viaJump=_global_conf["isGatherFollowersViaJump"]){
	return viaJump?this.jump():f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.areFollowersGathering;
$dddd$=$aaaa$.prototype.areFollowersGathering=function f(){
	return this.isJumping()||f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.areFollowersGathered;
$dddd$=$aaaa$.prototype.areFollowersGathered=function f(){
	return !this.isJumping()&&f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.startMapEvent;
$dddd$=$aaaa$.prototype.startMapEvent=function f(x,y,trigger,normal){
	//debug.keydown('Game_Player.prototype.startMapEvent');
	// triggered when: move, pressOk @ Scene_Map
	return f.ori.call(this,x,y,trigger,normal);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.isRangedBurnSwitched=function(){
	return (Input.isPressed('control') || $dataMap && $dataMap.triggerHere0touch) && ($gameParty.burnrange===404||$gameParty.leader().mp>=$gameParty.burnmpcost);
};
$aaaa$.prototype.isRangedSlashSwitched=function(){
	return (Input.isPressed('control') || $dataMap && $dataMap.triggerHere0touch) && ($gameParty.slashrange===404||$gameParty.leader().hp>=$gameParty.slashhpcost);
};
$aaaa$.prototype.customEvtStrt=function(){
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
		//$gamePlayer._noGainMsg=true;
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
					if( evt && !evt._starting && !(itrp._list && itrp._eventId===evt._eventId) && evt.canBurned() ){
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
		//$gamePlayer._noGainMsg=true;
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
					if(evt && !evt._starting && evt.canSlashed()){
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
	if($gameParty.canplant){
		rtv=true;
		let items=$gameParty._items;
		if(items[$gameParty.canplant]){
			if($dataMap.templateStrt_tile){
				mp.cpevt($dataMap.templateStrt_tile+25,this.x,this.y,1,1,1,["B"]);
				if(items[$gameParty.canplant]===1) delete items[$gameParty.canplant];
				else --items[$gameParty.canplant];
			}else $gameMessage.popup("這張地圖不能種樹");
		}else{
			$gameMessage.popup("種子用光了，關閉種樹功能");
			$gameParty.canplant=$gameParty.canplant; // 關閉種樹功能
		}
	}
	// other customEvts...
	//   ...
	if(strtList.length){
		rtv=true;
		let h=new Heap((b,a)=>a[0]-b[0],strtList);
		while(h.length){
			let evt=h.top[1];
			if(evt.parentId){
				let strt=evt.strt; delete evt.strt;
				evt=$gameMap._events[evt.parentId];
				evt.strt=strt;
			}
			if(!evt._starting) evt.start(1);
			h.pop();
		}
	}
	// finally no triggered
	return rtv;
};
$rrrr$=$aaaa$.prototype.triggerAction;
$dddd$=$aaaa$.prototype.triggerAction=function f(){
	//debug.log('Game_Player.prototype.triggerAction'); // this is polling
	let rtv=false;
	// customEvtStrt
	if(!rtv && Input.isPressed('control') && Input.isPressed('ok')) rtv=this.customEvtStrt(none);
	rtv=rtv||f.ori.call(this);
	$dataMap.lastPlayerDir=this._direction;
	$dataMap.triggerHere0touch=false;
	return rtv;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.checkEventTriggerHere;
$dddd$=$aaaa$.prototype.checkEventTriggerHere=function f(){
	debug.log('Game_Player.prototype.checkEventTriggerHere');
	debug.log($gamePlayer.x,$gamePlayer.y);
	debug.log(arguments[0]);
	if(($dataMap.triggerHere0touch=TouchInput.isTriggered()&&arguments[0][0]===0)&&this.customEvtStrt()) return;
	return f.ori.call(this,arguments[0]);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.checkEventTriggerThere;
$dddd$=$aaaa$.prototype.checkEventTriggerThere=function f(){
	debug.log('Game_Player.prototype.checkEventTriggerThere');
	debug.log($gamePlayer.x,$gamePlayer.y);
	debug.log(arguments[0]);
	// triggered when: {press 'ok'} or {click on tile and chr move near it}
	//   triggered before step on the location when using click
	//if(this.customEvtStrt(none)) return;
	if($dataMap.lastPlayerDir===this._direction) f.ori.call(this,arguments[0]);
}; $dddd$.ori=$rrrr$;
//$aaaa$.prototype.checkEventTriggerThere=$rrrr$; // currently no needed
$aaaa$.prototype.jumpAbs=function(x,y){
	if(isNaN(x)||isNaN(y)) ; else{
		let dx=Number(x)-this.x,dy=Number(y)-this.y;
		this.jump(dx,dy);
	}
};
$rrrr$=$aaaa$.prototype.reserveTransfer;
$dddd$=$aaaa$.prototype.reserveTransfer=function f(){
	debug.log('Game_Player.prototype.reserveTransfer');
	$gameMap.setZaWarudo(0); // clear waits
	f.ori.apply(this,arguments); // it just do preparation for new map
	debug.log('',$gameMap&&$gameMap._mapId,this._newMapId);
	if($gameMap._mapId===0||this._newMapId===$gameMap._mapId) return;
	let mc=$gameParty.mch();
	// rand maze (current map, not new map)
	delete mc.randmaze;
	// dynamic evt
	$gameParty.saveDynamicEvents(1);
	// save 'meta.recordLoc' s
	$gameMap.save_recordLoc();
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.adjDecRate=function(what,rate,useMax){
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
	for(let x=0,arr=$gameParty._actors,actors=$gameActors._data;x!==arr.length;++x){
		let actor=actors[arr[x]];
		let v=actor[what]*rate,vi=~~v;
		actor[act](-vi-(v!==vi));
	}
	
};
$aaaa$.prototype.addOnlineSaveId=function(id){
	if(this._onlineSaveIds===undefined){
		this._onlineSaveIds=[];
		//$gameMessage.popup($dataCustom.gainApps.onlineSaveIdMgr,1,{t_remained:5000});
		//if(!$gameParty._apps) $gameParty._apps={};
		//$gameParty._apps.onlineSaves=1;
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
$rrrr$=$dddd$=$aaaa$=undef;

// - party
$aaaa$=Game_Party;
$aaaa$.prototype.maxItems=function f(){
	return _global_conf["default maxItems"]||1000;
};
$aaaa$.prototype.numItems_i=function(id){ // 'i' for 'item'
	let rtv=this._items[id]^0;
	// preserve for future treated-as-same items
	return rtv;
};
$aaaa$.prototype.gainAllItems=function(cnt){
	cnt=~~cnt||1; if(0<cnt);else cnt=1;
	$dataWeapons.filter(x=>x&&x.name).map(x=>$gameParty.gainItem(x,cnt));
	$dataArmors.filter(x=>x&&x.name).map(x=>$gameParty.gainItem(x,cnt));
	$dataItems.filter(x=>x&&x.name).map(x=>$gameParty.gainItem(x,cnt));
};
$rrrr$=$aaaa$.prototype.items;
$dddd$=$aaaa$.prototype.items=function f(){ // add:sort
	// supposed not too much items
	return f.ori.call(this).sort((a,b)=>{
		let cmp=0; 
		cmp<<=1; cmp+=(!a.meta.imitate)-(!b.meta.imitate); 
		cmp<<=2; cmp+=(((!a.meta.hp)<<1)|(!a.meta.mp))-(((!b.meta.hp)<<1)|(!b.meta.mp)); 
		cmp<<=1; cmp+=(!a.meta.switch)-(!b.meta.switch); 
		cmp<<=1; cmp+=(!a.meta.enhance)-(!b.meta.enhance); 
		cmp<<=1; cmp+=(!a.meta.licence)-(!b.meta.licence); 
		cmp<<=1; cmp+=(!a.meta.quest)-(!b.meta.quest); // will have apps.quest
		return cmp===0?a.id-b.id:cmp; // '.id' is unique
	});
}; $dddd$.ori=$rrrr$;
Object.defineProperties($aaaa$.prototype, {
	burnLv: { get: function(){
			return this._bLv^0;
		}, set: function(rhs){
			let sc=SceneManager._scene,lv_o=this._bLv;
			let rtv=this._bLv=rhs;
			if($dataMap){
				if($dataMap.burnlv_pannel) $dataMap.burnlv_pannel.redrawtxt();
				else if(!lv_o && sc && sc.constructor===Scene_Map && sc._pannel) $dataMap.burnlv_pannel=sc._pannel.add($gameParty,'burnLv',{head:"燃燒等級"});
			}
			return rtv;
	}, configurable: false },
	burnrange: { get: function(){
			return this._bRng^0;
		}, set: function(rhs){ let n=Number(rhs); if(!(n>=0)) return rhs;
			if(this._bRng!==n){
				this._bRng=n;
				$gameMessage.popup("切換至"+$dataItems[70].name.slice(0,-1)+n,1);
				$gameMessage.popup("請注意每次觸發將消耗MP:"+this.burnmpcost,1,{t_remained:3e3});
			}
			return this._bRng;
	}, configurable: false },
	burnmpcost: { get: function(){
			return (!this._items[77])*((this.burnrange^0)+1);
	}, configurable: false },
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
				$gameMessage.popup("請注意每次觸發將消耗HP:"+this.slashhpcost,1,{t_remained:3e3});
			}
			return this._sRng;
	}, configurable: false },
	slashhpcost: { get: function(){
			return (!this._items[76])*((this.slashrange^0)+1)*((this.canslash==="大斧")*9+1);
	}, configurable: false },
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
	canplant: { get: function(){
			return this._canP;
		}, set: function(rhs){
			if(this._canP===rhs){
				delete this._canP;
				$gameMessage.popup("切換成無法\\RGB["+$dataCustom.textcolor.keyword+"]種樹\\RGB["+$dataCustom.textcolor.default+"]",1);
			}else{
				this._canP=rhs;
				$gameMessage.popup("使用\\RGB["+$dataCustom.textcolor.item+"]"+$dataItems[rhs].name+"\\RGB["+$dataCustom.textcolor.default+"]種樹",1);
			}
			return this._canP;
	}, configurable: false },
	_dummy:{get:function(){return'';},configurable:false}
});
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(){
	debug.log('Game_Party.prototype.initialize');
	let rtv=f.ori.apply(this,arguments);
	this.mapChanges=[];
	//this.switches=[]; // use mapId as index // seems not used YET
	return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.menuActor = function() {
	let actor=$gameActors.actor(this._menuActorId);
	if(!this.members().contains(actor)) actor=this.members()[0];
	return actor;
};
$aaaa$.prototype.LName=function(n){
	return $gameActors._data[$gameParty._actors[n||0]].name();
};
$aaaa$.prototype.setFace=function(n){
	//debug.log('Game_Party.prototype.setFace');
	n=n||0;
	let chr=$gameActors._data[$gameParty._actors[n]];
	$gameMessage.setFaceImage(chr._faceName,chr._faceIndex);
	$gameMessage._nameField=chr.name();
};
$aaaa$.prototype.speak=function(txt,n,kargs){
	this.setFace(n);
	return $gameMessage.add(txt);
};
$aaaa$.prototype.mch=function(mapid){
	if(this.mapChanges===undefined) this.mapChanges={};
	let mchs=this.mapChanges;
	if(mapid===undefined) mapid=$gameMap._mapId;
	if(mchs[mapid]===undefined) mchs[mapid]={};
	return mchs[mapid];
};
$aaaa$.prototype.changeMap=function(type,data,mapid,noupdate){
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
			if(!noupdate){ $gameMap.data(); for(let it=idxset.values(),t;(t=it.next()).done===false;) DataManager.resetData3d(t.value);
				let sc=SceneManager._scene;
				if(sc.constructor===Scene_Map) sc._spriteset._tilemap.refresh();
			}
		}break;
	}
};
$aaaa$.prototype.saveDynamicEvents=function(fromTransfer){
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
			for(let s=0,sss=$gameSelfSwitches.switches;s!==sss.length;++s) delete ss[([evtid,sss[s]])];
			delete mc.events[evtid];
		}
	}
	mc.events=deepcopy(mc.events); // remain only json data
	let arr=DataManager._delAttrs_dynamicEvt;
	for(let i in mc.events){ // remove un-used||unchanged attrs
		let evt=mc.events[i];
		for(let x=0;x!==arr.length;++x) delete evt[arr[x]];
	}
};
$aaaa$.prototype.burnLvOutput=function(parents){
	parents=parents||$gameMap.parents();
	// 燃燒棒、木亥村莊專用燃燒棒
	if($gameParty._items[55] || ($gameParty._items[56]&&parents.indexOf(Number($dataItems[56].meta.map))!==-1)) return this.burnLv;
	return 0;
};
$aaaa$.prototype.gainAchievement=function(id){
	if(this._achievement===undefined) this._achievement=[''];
	if(this._achievement[id]) return;
	this._achievement[id]=1;
	let ac=$dataCustom.achievement[id],color=$dataCustom.textcolor;
	if(ac===undefined||ac.constructor!==Array) return;
	this.burnLv^=0; ++this.burnLv;
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
		for(let x=last+1;x!==id;++x) this._achievement[x]=''; // reduce save file size
		this._achievement_lastMaxId=id;
	}
};
$aaaa$.prototype.gain_amountHead=function(amount,noSound){
	let rtv="",color=$dataCustom.textcolor;
	if(amount<0){ amount*=-1;
		if(!$gamePlayer._noGainSound && !noSound) SoundManager.playMiss();
		if(rtv===""&&this.____byConsume) rtv+="\\RGB["+color.use+"]使用";
		if(rtv===""&&this.____byChEqu) rtv+="\\RGB["+color.use+"]穿上";
		if(rtv==="") rtv+="\\RGB["+color.lose+"]失去";
		
	}else{
		if(!$gamePlayer._noGainSound && !noSound) SoundManager.playUseItem();
		if(rtv===""&&this.____byChEqu) rtv+="\\RGB["+color.use+"]脫下";
		if(rtv==="") rtv+="\\RGB["+color.gain+"]獲得";
	}
	return rtv+" \\RGB["+color.default+"]";
};
$rrrr$=$aaaa$.prototype.gainGold;
$dddd$=$aaaa$.prototype.gainGold=function f(amount,noSound){
	if(this._gold){
		let h=sha256(this._gold+'/'+this._hashn_gold),g=0;
		while(h.slice(-3)!=="000") h=sha256(g+++'/'+this._hashn_gold);
		if(g) this._gold=g-1;
	}
	let prevg=this._gold;
	f.ori.call(this,arguments[0]);
	if(prevg!==this._gold){ for(let x=0;;++x){
		let h=sha256(this._gold+'/'+x);
		if(h.slice(-3)==="000"){
			this._hashn_gold=x;
			break;
		}
	}}
	let cnt=arguments[0]; if(!cnt) return;
	let head=this.gain_amountHead(cnt,noSound);
	let txt=head+Math.abs(cnt)+" \\G";
	if(!$gamePlayer._noGainMsg) $gameMessage.add(txt);
	if(!$gamePlayer._noGainHint) $gameMessage.popup(txt,1);
	return txt;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.consumeItem;
$dddd$=$aaaa$.prototype.consumeItem=function f(){
	debug.log('Game_Party.prototype.consumeItem');
	let snd=$gamePlayer._noGainSound,hnt=$gamePlayer._noGainHint,msg=$gamePlayer._noGainMsg;
	$gamePlayer._noGainSound=1;
	$gamePlayer._noGainHint=1;
	$gamePlayer._noGainMsg=1;
	this.____byConsume=1;
	f.ori.call(this,arguments[0]);
	delete this.____byConsume;
	$gamePlayer._noGainMsg=msg||0;
	$gamePlayer._noGainHint=hnt||0;
	$gamePlayer._noGainSound=snd||0;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.gainItem;
$dddd$=$aaaa$.prototype.gainItem=function f(item, amount, includeEquip, noSound){
	//debug.log('Game_Party.prototype.gainItem');
	if(!item) return '';
	f.ori.call(this, item, amount, includeEquip, noSound);
	let cnt=arguments[1]; if(!cnt) return '';
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
	let txt=head+(arguments[0].name.replace(/\\/g,"\\\\"))+"\\RGB["+color.default+"] * "+Math.abs(cnt);
	if(!$gamePlayer._noGainMsg) $gameMessage.add(txt);
	if(!$gamePlayer._noGainHint) $gameMessage.popup(txt,1);
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
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.loseItemAll=function(item, includeEquip, noSound){
	return this.gainItem(item,-this.numItems(item));
};
$aaaa$.prototype.upgradeItem=function f(itemFrom,itemTo, amount, includeEquip, noSound){
	let txt="升級道具：";
	if(!$gamePlayer._noGainMsg) $gameMessage.add(txt);
	if(!$gamePlayer._noGainHint) $gameMessage.popup(txt,1);
	this.gainItem(itemFrom,-amount,includeEquip, 1);
	this.gainItem(itemTo,amount,includeEquip, 1);
	txt="道具升級了。";
	if(!$gamePlayer._noGainMsg) $gameMessage.add(txt);
	if(!$gamePlayer._noGainHint) $gameMessage.popup(txt,1);
	if(!$gamePlayer._noGainSound&&!noSound) SoundManager.playUseItem();
};
$aaaa$.prototype.quests=function(rankMin,rankMax,reserveNan){
	rankMin=rankMin===0?0:(rankMin||-inf);
	rankMax=rankMax===0?0:(rankMax|| inf);
	let list=rpgquests.list;
	return this.items().filter(x=>{ return x.meta.quest && list[x.meta.ref]
		&& ( (rankMin<=list[x.meta.ref].rank && list[x.meta.ref].rank<=rankMax)
		|| (reserveNan && isNaN(list[x.meta.ref].rank)) );
	});
};
$aaaa$.prototype.questsNeeded=function(rank){
	return rank[2]-this.completedQuestsCnt(rank[0],rank[1]);
};
$aaaa$.prototype.questRemainedCnt=function(itemId){
	let list=rpgquests.list;
	let lim=rpgquests.list[$dataItems[itemId].meta.ref].limit;
	if(isNaN(lim)) return inf;
	return lim-(this._completedQuests[itemId]^0)-(this._items[itemId]^0);
};
$aaaa$.prototype.completedQuestsCnt=function(rankMin,rankMax,reserveNan){
	if(!this._completedQuests) this._completedQuests={};
	let obj=this._completedQuests,list=rpgquests.list,rtv=0;
	for(let i in obj){
		let rank=list[$dataItems[i].meta.ref].rank;
		rtv+=obj[i]*( (rankMin<=rank && rank<=rankMax) || (reserveNan && isNaN(rank))^0 );
	}
	return rtv;
};
$aaaa$.prototype.completeQuest=function(itemId,q){
	let self=this;
	if(!this._completedQuests) this._completedQuests={};
	let item=$dataItems[itemId];
	q=q||item.meta.ref&&rpgquests.list[item.meta.ref];
	if(!q||!q.isSat(this._completedQuests[itemId])) return -1;
	
	let noGainMsg=$gamePlayer._noGainMsg; $gamePlayer._noGainMsg=1;
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
	$gamePlayer._noGainMsg=noGainMsg;
};
$aaaa$.prototype.genQuestReportWindow=function(rankMin,rankMax,reserveNan){
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
				final:(obj,key)=>{ let tmp=$gamePlayer._noGainMsg; $gamePlayer._noGainMsg=1; $gameParty.gainItem($dataItems[x.id],-obj[key]); $gamePlayer._noGainMsg=tmp;
					obj[key]=''; if(!$gameParty._items[x.id]) w.processCancel();
				}
			};
			Object.defineProperty(giveupNext,'title',{get:()=>{return "要丟棄幾個? (0~"+$gameParty._items[x.id]+")";},configurable: false});
			return [
				["完成",";;func;call",((self._items[x.id])^0) && q.isSat(self._completedQuests&&self._completedQuests[x.id]),function(){
					if(self.completeQuest(x.id,q)<0){ SoundManager.playBuzzer(); this.parent.processCancel(1); return; }
					//let p=this.parent; p.processCancel.ori.call(p,1);
				}],
				["查看",";;func;call",($gameParty._items[x.id])^0,function(){this.parent.addWindow({},func.showBoard(q,1));}],
				["放棄(丟棄任務單)","this;"+x.id+";text;要丟棄幾個? (0~"+$gameParty._items[x.id]+")",($gameParty._items[x.id])^0,giveupNext],
			];
		}];
	};
	let quests=this.quests(rankMin,rankMax,reserveNan).map(map);
	if(quests.length===0) quests.push(["目前沒有接任務",";;func",0]);
	w=new Window_CustomMenu_main(0,0,quests);
	return w;
	//SceneManager.addWindowB(w);
};
$aaaa$.prototype.openQuestReportWindow=function(rankMin,rankMax,reserveNan){
	return SceneManager.addWindowB(this.genQuestReportWindow(rankMin,rankMax,reserveNan));
};
$aaaa$.prototype.logLoc_save=function(){
	if(!this._locLog) this._locLog=[];
	let p=$gamePlayer;
	this._locLog.push([$gameMap.name,$gameMap._mapId,p.x,p.y,p._direction]);
};
$aaaa$.prototype.logLoc_load=function(id){
	let t=this._locLog[id];
	if(!t) return -1;
	$gamePlayer.reserveTransfer(t[1],t[2],t[3],t[4],1);
};
$aaaa$.prototype.addActor = function(actorId) { // neednotice
	//debug.log('Game_Party.prototype.addActor');
	let tmp=_global_conf["id-cntTemplateToCustom"](actorId,this._actors);
	let cnt=tmp[0],id=tmp[1];
	if (cnt<_global_conf["default allowRepeatedMembers"]) {
		if(cnt===0) this._actors.push(actorId);
		else{
			//(_global_conf["get-customActors"]()[id]=new Game_Actor(actorId))._actorId=id;
			// actor profile not contructed yet
			// Game_Actor.prototype.actor() will find _global_conf["get-customActors"](), then $dataActors
			_global_conf["get-customActors"]()[id]=new Game_Actor(id);
			this._actors.push(id);
		}
		let flrs=$gamePlayer._followers._data,len=this._actors.length-1;
		if(len!==0&&flrs.length>=len){
			let sc=SceneManager._scene;
			let sps=sc&&sc._spriteset;
			let tm=sps&&sps._tilemap; //debug.log(tm);
			if(tm){
				let arr=sps._characterSprites;
				arr.push(new Sprite_Character( flrs[len-1] )); debug.log(arr.back);
				tm.addChild(arr.back);
			}
		}
		$gamePlayer.refresh();
		$gameMap.requestRefresh();
	}
};
$aaaa$.prototype.maxBattleMembers = function() {
	return _global_conf["default maxBattleMembers"]||4;
};
$dddd$=$aaaa$.prototype.allMembers=function f() {
	return this._actors.map(f.toDataActor);
};
$dddd$.toDataActor=(id)=>$gameActors.actor(id);
$rrrr$=$dddd$=$aaaa$=undef;

// - follower
$aaaa$=Game_Follower;
$dddd$=$aaaa$.prototype.chaseCharacter=function f(character){
	let sx=this.deltaXFrom(character.x); // int
	let sy=this.deltaYFrom(character.y); // int
	if(sx!==0) sx=sx<0?6:4;
	if(sy!==0) sy=sy<0?2:8;
	this.moveDiagonally(sx,sy);
	return this.setMoveSpeed($gamePlayer.realMoveSpeed());
};
$dddd$.h1=[6,0,4];
$dddd$.v1=[2,0,8];
$rrrr$=$dddd$=$aaaa$=undef;

// - selfswitches
$aaaa$=Game_SelfSwitches;
//$aaaa$.prototype.clear=function(){ this._data = []; };
$aaaa$.prototype.initialize = function() {
	this._data=[0];
};
$aaaa$.prototype.switches=["A","B","C","D"];
$aaaa$.prototype.value=function(k){
	let t=this._data[k.shift()];
	return !!(t&&t[k]);
};
$aaaa$.prototype.setValue_=function(t,k,v){
	if(v) t[k] = true;
	else delete t[k];
	let evt=$gameMap._events[k[0]];
	if(this._data[$gameMap._mapId]===t){ // the switch is @ current map
		let self=this;
		if(evt&&evt._sameStatEvts){ for(let x=0,arr=evt._sameStatEvts;x!==arr.length;++x){ // let evtid=arr[x];
			this.setValue_(t,[arr[x],k[1]],v);
		} }
	}
	if(evt&&!evt.noUpdate) return this.onChange();
};
$aaaa$.prototype.setValue=function(k,v){ let t=this._data[k.shift()]; return this.setValue_(t,k,v); };
$aaaa$.prototype.clear = function(mapid) {
	if(mapid>0) this._data[n]={};
	else this._data = [];
};
$rrrr$=$dddd$=$aaaa$=undef;

// - event

$aaaa$=Game_Event;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(mapId,evtId){
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
	}
	
	let rtv=f.ori.apply(this,arguments);
	
	let evtd=this.event();
	let meta=evtd.meta;
	this._preventZaWarudo=evtd.note==="init"||evtd.note==="achievement"||meta.preventZaWarudo||meta.init||meta.achievement||meta.block||meta.txt;
	
	let x=this._x,y=this._y; // will be used later
	// correcting old-format saved files
	if(0&&0) // not working on existing savefiles
	{
		delete this._y; delete this._x;
		this.__x=x; this.__y=y;
		
		let cidx=this._characterIndex,cname=this._characterName;
		delete this._characterIndex; delete this._characterName;
		this._chrIdx=cidx; this._chrName=cname;
		
		let tid=this._tileId;
		delete this._tileId;
		this._tid=tid;
		
		let thru=this._through;
		delete this._through;
		this._thru=thru;
	}
	
	// put coordTbl
	if($gameMap.isValid(x,y)){
		let idx=mapd.width*y+x;
		mapd.coordTbl[idx].push(this);
		if(!this._through){
			mapd.coordTblNt[idx].push(this);
			if(this._priorityType===1) mapd.coordTblNtP1[idx].push(this);
		}
	}
	// - $dataMap.strtEvts
	if(!mapd.strtEvts) mapd.strtEvts=new Queue();
	this._addedCnt_strtEvts=0;
	
	delete this.refresh;
	//debug.log2(this.refresh);
	this.refresh();
	
	return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype._rmFromCoordTbl=function(){
	if(this._rmFromCoordTbl_1()!==undefined){ // valid add
		if(!this._through){
			this._rmFromCoordTbl_1($dataMap.coordTblNt);
			if(this._priorityType===1) this._rmFromCoordTbl_1($dataMap.coordTblNtP1);
		}
	}
};
$aaaa$.prototype._rmFromCoordTbl_1=function(tbl){
	//debug.log2('Game_Event.prototype._rmFromCoordTbl');
	//if(debug.islog2()){
	//	console.log('',this.x,this.y);
	//	if($dataMap.coordTbl) console.log(deepcopy($dataMap.coordTbl));
	//}
	let mapd=$dataMap;
	// x,y may be out of bound
	if(tbl){ if(!(tbl=tbl[this.__x+this.__y*mapd.width])) return; }
	else if(!(tbl = $gameMap.isValid(this.x,this.y) && mapd && mapd.coordTbl && mapd.coordTbl[this.__x+this.__y*mapd.width])) return;
	let idx=tbl.indexOf(this); // .coordTbl
	//debug.log(idx);
	if(idx===-1) return;
	if((idx<<1)<tbl.length){
		tbl.setnth(idx,tbl.front);
		return tbl.pop_front();
	}else{
		tbl.setnth(idx,tbl.back);
		return tbl.pop_back();
	}
};
$aaaa$.prototype._addToCoordTbl=function(){
	if(this._addToCoordTbl_1()!==undefined){ // valid remove
		if(!this._through){
			this._addToCoordTbl_1($dataMap.coordTblNt);
			if(this._priorityType===1) this._addToCoordTbl_1($dataMap.coordTblNtP1);
		}
	}
};
$aaaa$.prototype._addToCoordTbl_1=function(tbl){
	//debug.log2('Game_Event.prototype._addToCoordTbl');
	if(this.refresh===none) return; // constructing
	//if(debug.islog2()){
	//	console.log('',this.x,this.y);
	//	if($dataMap.coordTbl) console.log(deepcopy($dataMap.coordTbl));
	//}
	let mapd=$dataMap;
	// x,y may be out of bound
	if(tbl){ if(!(tbl=tbl[this.__x+this.__y*mapd.width])) return; }
	else if(!(tbl = $gameMap.isValid(this.x,this.y) && mapd && mapd.coordTbl && mapd.coordTbl[this.__x+this.__y*mapd.width])) return;
	return 1+tbl.push(this);
};
Object.defineProperties($aaaa$.prototype,{
	_x:{ get:function(){return this.__x;},set:function(rhs){
		this._rmFromCoordTbl();
		this.__x=rhs;
		this._addToCoordTbl();
	},configurable:false},
	_y:{ get:function(){return this.__y;},set:function(rhs){
		this._rmFromCoordTbl();
		this.__y=rhs;
		this._addToCoordTbl();
	},configurable:false},
	_through:{ get:function(){return this._thru;},set:function(rhs){
		let tblNt=$dataMap.coordTblNt;
		if(tblNt && this._thru^rhs){
			if(rhs){
				if(this._rmFromCoordTbl_1(tblNt) && this._priorityType===1){
					this._rmFromCoordTbl_1($dataMap.coordTblNtP1);
				}
			}else{
				if(this._addToCoordTbl_1(tblNt) && this._priorityType===1){
					this._addToCoordTbl_1($dataMap.coordTblNtP1);
				}
			}
		}
		this._thru=rhs;
	},configurable:false},
	_priorityType:{ get:function(){return this._pri},set:function(rhs){
		let tblNtP1=$dataMap.coordTblNtP1;
		if(tblNtP1 && !this._through && this._pri!==rhs && (this._pri===1 || rhs===1)){
			if(rhs!==1) this._rmFromCoordTbl_1(tblNtP1);
			else this._addToCoordTbl_1(tblNtP1);
		}
		this._pri=rhs;
	},configurable:false},
	_characterIndex:{ get:function(){return this._chrIdx;},set:function(rhs){
		if(this._chrIdx!==rhs) this.imgModded=true;
		this._chrIdx=rhs;
	},configurable:false},
	_characterName:{ get:function(){return this._chrName;},set:function(rhs){
		if(this._chrName!==rhs) this.imgModded=true;
		this._chrName=rhs;
	},configurable:false},
	_tileId:{ get:function(){return this._tid;},set:function(rhs){
		if(this._tid!==rhs) this.imgModded=true;
		this._tid=rhs;
	},configurable:false},
});
$aaaa$.prototype.resetDir=function(alsoSetupPage){
	let p=this.findProperPageIndex();
	if(p<0) return;
	let img=this.event().pages[p].image;
	this._direction=img.direction;
	if(alsoSetupPage){
		this._pageIndex=p;
		this.setupPage();
	}
};
$rrrr$=$aaaa$.prototype.update;
$dddd$=$aaaa$.prototype.update=function f(){
	if(this.canUpdate()) return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$dddd$=$aaaa$.prototype.updateParallel=function f(){
	if(this._trigger===4){ // parallel
		if(!this._interpreter) this._interpreter=new Game_Interpreter();
		if(!this._interpreter.isRunning()) this._interpreter.setup(this.list(), this._eventId);
		this._interpreter.update();
	}
};
$aaaa$.prototype.canUpdate=function(){
	return !$gameMap.zaWarudo()||this.preventZaWarudo();
};
$aaaa$.prototype.preventZaWarudo=function(){
	return this._preventZaWarudo||this._trigger===1; // player touch
};
$aaaa$.prototype.setPreventZaWarudo=function(val){
	this._preventZaWarudo=val;
};
$aaaa$.prototype.event=function(){ return $dataMap.events[this._eventId.toId()]; };
$aaaa$.prototype.hasStrtType=function(key){
	// strtType will be clear when 'this.start'
	return this.strt && this.strt[key];
};
$aaaa$.prototype.addStrtType=function(key){
	// strtType will be clear when 'this.start'
	if(!this.strt) this.strt={};
	this.strt[key]=1;
};
$rrrr$=$aaaa$.prototype.start;
$dddd$=$aaaa$.prototype.start=function f(custom){ // fit $dataMap.strtEvts
	if($gameMap.zaWarudo()&&!this.preventZaWarudo()){
		$gameMap.zaWarudo_waitToStart(this._eventId);
		return;
	}
	// custom: started from 'customEvtStrt'
	//debug.log2('Game_Event.prototype.start');
	//debug.log2('',this._eventId);
	//debug.log2('',this._trigger);
	
	let strtType=this.strt||{}; delete this.strt;
	if(this._erased) return;
	
	let evtd=this.event(),meta=evtd.meta;
	if(this.parentId && meta.burnable){
		let evt=$gameMap._events[this.parentId];
		if(evt && !evt._starting){
			evt.strt=strtType;
			return evt.start(custom);
		}
		return;
	}
	let editable=this.canBurned()||this.canSlashed();
	if(custom){
		if(strtType.slash){
			if(strtType.burn){
				this.requestAnimation(8);
				$gameMessage.popup($dataCustom.toDust,1);
			}else{
				this.requestAnimation(6);
				let nw=Number(meta.wood);
				if(nw) $gameParty.gainItem($dataItems[61],nw);
				let items=(meta.items||"").split(',');
				for(let x=this._pageIndex-1;x<items.length;++x){
					let kv=items[x].split(":").map(e=>Number(e));
					if(kv[0]) $gameParty.gainItem($dataItems[kv[0]],kv[1]);
				}
			}
			let vars=$gameParty.mch().vars;
			if(vars){
				//if(vars.tree) vars.tree-=meta.dectree^0; // in 'this.erase'
				vars.burnPlanted^=0;
				vars.burnPlanted+=meta.burnPlanted^0;
				$gameParty.burned+=meta.dectree|meta.burnPlanted;
			}
			this.erase();
		}
		if(this._erased) return;
		if(!this._starting){
			let strt=this._starting;
			f.ori.call(this);
			if(this._starting && (!editable||!strt)){
				++this._addedCnt_strtEvts;
				return $dataMap.strtEvts.push([this,custom]);
			}
		}
		return;
	}
	
	let ok=true; // true: start this evt
	let burned=false,slashed=false;
	let burnFail=false,slashFail=false;
	
	// consume MP when player directly trigger it
	let pt=$gameParty,notStrt=!this._starting;
	let burn1=notStrt && !$gamePlayer.isRangedBurnSwitched() && this.canBurned();
	let slash1=notStrt && !$gamePlayer.isRangedSlashSwitched() && this.canSlashed();
	let noEdited=true;
	let canEdit=$gameParty.canburn||$gameParty.canslash;
	let normalMode=burn1&&slash1;
	if(burn1){
		if($gameParty.canburn){
			// burnable, not be started by rangedBurn
			let L=pt.leader();
			let brng=$gameParty._bRng; $gameParty._bRng=0;
			if(L.mp>=pt.burnmpcost){
				noEdited=false;
				burned=true;
				L.gainMp(-pt.burnmpcost);
				// notify 'burnAwarer'
				for(let x=0,arr=$dataMap.eventsByMeta.burnAwarer||[];x!==arr.length;++x) $gameMap._events[arr[x]].ssStateSet("B");
			}else{
				$gameMessage.popup("焚木所需MP不足");
				burnFail=true;
			}
			$gameParty._bRng=brng;
		}
	}
	if(slash1){
		if($gameParty.canslash){
			// burnable, not be started by rangedBurn
			let L=pt.leader();
			let srng=$gameParty._sRng; $gameParty._sRng=0;
			if(pt.slashhpcost<L.hp){
				noEdited=false;
				slashed=true;
				L.gainHp(-pt.slashhpcost);
				// notify 'burnAwarer'
				for(let x=0,arr=$dataMap.eventsByMeta.burnAwarer||[];x!==arr.length;++x) $gameMap._events[arr[x]].ssStateSet("B");
			}else{
				$gameMessage.popup("伐木所需HP不足");
				slashFail=true;
			}
			$gameParty._sRng=srng;
		}
	}
	
	if(editable){
		if(!noEdited){
			this.strt={burn:burned,slash:slashed};
			this.start(1);
			return;
		}else if(burnFail || slashFail || !canEdit) return;
	}
	let strt=this._starting;
	f.ori.call(this);
	if(this._starting && (!editable||!strt)){
		++this._addedCnt_strtEvts;
		return $dataMap.strtEvts.push([this]);
	}
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.clearStartingFlag;
$dddd$=$aaaa$.prototype.clearStartingFlag=function f(){ // overwrite to fit $dataMap.strtEvts
	//debug.log2('Game_Event.prototype.clearStartingFlag'); // annoying
	//debug.log2('',this._eventId);
	//debug.log2('',this._trigger);
	//if(debug.islog2()) console.log('',deepcopy($dataMap.strtEvts));
	let strt=this._starting;
	f.ori.call(this);
	this._addedCnt_strtEvts-=0<this._addedCnt_strtEvts;
	delete this.strt;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.checkEventTriggerTouch;
$dddd$=$aaaa$.prototype.checkEventTriggerTouch=function f(){
	debug.log('Game_Event.prototype.checkEventTriggerTouch');
	return f.ori.apply(this,arguments);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.checkEventTriggerTouch=$rrrr$; // not changed
$aaaa$.prototype.erase_inv=function(){
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
$rrrr$=$aaaa$.prototype.erase;
$dddd$=$aaaa$.prototype.erase=function f(by){
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
}; $dddd$.ori=$rrrr$;
// <erasedBy:{"key":evtid}> ; when 'by' provided to 'Game_Event.erase(by)' exists in 'erasedBy', corresponding event will start
$aaaa$.prototype.parent=function(){
	return (this.parentId)?$gameMap._events[this.parentId]:this;
};
$aaaa$.prototype._constructChildren=function(tm,ssStates){
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
			obj=new Game_Event(mapid,meta.child+'-'+tm+"8"+evts.length.toString(8));
			obj._realX=obj._x=x+dx; obj._realY=obj._y=y+dy;
			obj.parentId=this._eventId;
			evts.push(obj); evts[obj._eventId]=obj;
			this._sameStatEvts.push(obj._eventId);
			for(let i=0;i!==ssStates.length;++i) ssobj[([obj._eventId,ssStates[i]])]=true;
			meta=obj.event().meta;
		}
	}
};
$aaaa$.prototype.ssState=function(ssname){
	// 'ss' for "self switch"
	return {obj:$gameSelfSwitches._data[this._mapId],key:[this._eventId,ssname]};
};
$aaaa$.prototype.ssStateInv=function(ssname){
	let res=this.ssState(ssname);
	let v=!res.obj[res.key];
	$gameSelfSwitches.setValue_(res.obj,res.key,v);
	return v;
};
$aaaa$.prototype.ssStateSet=function(ssname,toFalse){
	let res=this.ssState(ssname);
	//if(!toFalse && !res.obj[res.key]) setTrue
	//if(toFalse && res.obj[res.key]) setFalse
	//if(toFalse^1^res.obj[res.key]) set
	toFalse^=1;
	if(toFalse^res.obj[res.key]) $gameSelfSwitches.setValue_(res.obj,res.key,toFalse);
	return toFalse;
};
$aaaa$.prototype.findProperPageIndex=function f(){
	let pages=this.event().pages;
	for(let x=pages.length;x--;){
		let c=pages[x].conditions,ss=$gameSelfSwitches._data[this._mapId];
		if(
		 (!c.switch1Valid || $gameSwitches.value(c.switch1Id))
		 && (!c.switch2Valid || $gameSwitches.value(c.switch2Id))
		 && (!c.variableValid || $gameVariables.value(c.variableId)<c.variableValue)
		 && (!c.selfSwitchValid || ( ss && ss[([this._eventId,c.selfSwitchCh])] ) )
		 && (!c.itemValid || 0<$gameParty.numItems_i(c.itemId)) // maybe neg? debt?
		 && (!c.actorValid || $gameParty._actors.indexOf(c.actorId)!==-1)
		)
			return x;
	}
	return -1;
};
$aaaa$.prototype.refresh=function(forced) {
	let newPageIndex=this._erased?-1:this.findProperPageIndex();
	if(forced || this._pageIndex!==newPageIndex){
		this._pageIndex=newPageIndex;
		this.setupPage();
	}
};
$aaaa$.prototype.setFace=function(idx){
	if(this._isObjectCharacter){
		// 0<this._tileId (i.e. 0<$dataEvent.page.image.tileId) or ImageManager.isObjectCharacter
		// Sprite_Character.prototype.patternWidth
		// Sprite_Character.prototype.patternHeight
		let c=SceneManager._scene._spriteset._tilemap.children.find(this._tilemapKey).data;
		let frm=c._realFrame; // c._isBigCharacter; this._isObjectCharacter;
		// let r=Math.min(Window_Base._faceWidth/frm.width,Window_Base._faceHeight/frm.height);
		let sz=frm.width*frm.height,r=Math.min(Window_Base._faceWidth*frm.height,Window_Base._faceHeight*frm.width);
		let w=~~(frm.width*r/sz),h=~~(frm.height*r/sz); // for precision
		$gameMessage.setFaceImage([
			c._bitmap,
			frm.x,frm.y,frm.width,frm.height,
			(Window_Base._faceWidth-w)>>1,(Window_Base._faceHeight-h)>>1,w,h,
		],"data");
	}else if(this._characterName){
		if(idx===undefined) idx=this._characterIndex;
		$gameMessage.setFaceImage(this._characterName,idx);
	}
};
$aaaa$.prototype.speak=function(txt,kargs){
	this.setFace();
	//$gameMap._interpreter.clear();
	return $gameMessage.add(txt);
};
$aaaa$.prototype.choices=function(txt,chTxtArr,defaultType,cancelType,chCallback,kargs){
	if(txt) this.speak(txt,kargs);
	$gameMessage.setChoiceCallback(chCallback);
	return $gameMessage.setChoices(chTxtArr,defaultType,cancelType);
};
$aaaa$.prototype.playerJumpToMy=function(dx,dy){
	dx+=this.x-$gamePlayer.x;
	dy+=this.y-$gamePlayer.y;
	return $gamePlayer.jump(dx,dy);
};
$aaaa$.prototype.canEdited_auth=function(parents){
	if(this.event().meta.noAuth) return true;
	parents=parents||$gameMap.parents();
	return !(parents.indexOf(13)===-1 && parents.indexOf(90)===-1 && parents.indexOf($gameParty.burnAuth)===-1);
	// 13:forest 90:sky
};
$aaaa$.prototype.canBurned_auth=function(parents){
	if($gameParty.burnrange===404) return true;
	return this.canEdited_auth(parents);
};
$aaaa$.prototype.canBurned=function(){
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
$aaaa$.prototype.canSlashed_auth=function(parents){
	if($gameParty.slashrange===404) return true;
	return this.canEdited_auth(parents);
};
$aaaa$.prototype.canSlashed=function(){
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
$rrrr$=$dddd$=$aaaa$=undef;

// - switches
$aaaa$=Game_Switches;
$aaaa$.prototype.setValue=function f(switchId,value,noUpdate){
	if(switchId>=0 && switchId<$dataSystem.switches.length){
		this._data[switchId]=(!value)^1;
		if(!noUpdate) this.onChange();
	}
};

// - vars
$aaaa$=Game_Variables;
$rrrr$=$aaaa$.prototype.setValue;
$dddd$=$aaaa$.prototype.setValue=function f(varId,val){
	let strt=window['/tmp/'].gameVarTrimStrt^=0;
	if(strt<varId){
		for(;strt!==varId;++strt) this._data[strt]^=0;
		window['/tmp/'].gameVarTrimStrt=varId;
	}
	return f.ori.call(this,varId,val);
}; $dddd$.ori=$rrrr$;

// - item
$aaaa$=Game_Item;
$rrrr$=$aaaa$.prototype.setObject;
$dddd$=$aaaa$.prototype.setObject=function f(item){
	debug.log('Game_Item.prototype.setObject');
	let rtv=f.ori.call(this,item);
	//debugger;
	return rtv;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.setObject=$rrrr$; // not changed
$rrrr$=$dddd$=$aaaa$=undef;

// - action
$aaaa$=Game_Action;
$aaaa$.prototype.speed=function(){
	//let agi=this.subject().agi;
	let speed=this.subject().agi; // + Math.randomInt(Math.floor(5 + agi / 4)); // edit: fixed speed
	if(this.item()){
		speed+=this.item().speed;
	}
	if(this.isAttack()){
		speed+=this.subject().attackSpeed();
	}
	return speed;
};
$rrrr$=$aaaa$.prototype.apply;
$dddd$=$aaaa$.prototype.apply=function f(){
	debug.log('Game_Action.prototype.apply');
	return f.ori.call(this,arguments[0]);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.apply=$rrrr$; // not changed
$rrrr$=$aaaa$.prototype.applyGlobal;
$dddd$=$aaaa$.prototype.applyGlobal=function f(){
	debug.log('Game_Action.prototype.applyGlobal');
	let dataItem=this.item();
	if(dataItem.effects) dataItem.effects.forEach(ef=>ef.code===Game_Action.EFFECT_COMMON_EVENT&&$gameTemp.reserveCommonEvent(ef.dataId)); // f.ori.call(this);
	let item=this._item,id=item._itemId.toId(),meta=dataItem.meta;
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
	if(meta&&meta.func) eval(meta.func.replace(/\(|\)/g,''))(this);
	if(meta&&meta.code) eval(meta.code);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.subject=function(){
	if(this._subjectActorId.toId() > 0) return $gameActors.actor(this._subjectActorId);
	else return $gameTroop.members()[this._subjectEnemyIndex];
};
$rrrr$=$dddd$=$aaaa$=undef;

// - actor
$aaaa$=Game_Actor;
$aaaa$.prototype.paramMax = function(paramId) {
	if (paramId === 0) {
		return 999999; // MHP
	}
	return Game_Battler.prototype.paramMax.call(this, paramId);
};
$aaaa$.prototype.stepsForTurn=function() {
	return 3;
};
$aaaa$.prototype.actor=function() { // neednotice
	return $dataActors[this._actorId.toId()];
	//return $dataActors[_global_conf["id-toTemplate"](this._actorId)];
	//return _global_conf["get-customActors"]()[this._actorId] || $dataActors[_global_conf["id-toTemplate"](this._actorId)];
};
$aaaa$.prototype.expForLevel=function(level){
	let c=this.currentClass();
	let basis=c.expParams[0];
	let extra=c.expParams[1];
	let acc_a=c.expParams[2];
	let acc_b=c.expParams[3];
	return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
		(level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
};
$aaaa$.prototype.initImages=function(){
	let actor=this.actor();
	this._characterName = actor.characterName;
	this._characterIndex = actor.characterIndex;
	this._faceName = actor.faceName;
	this._faceIndex = actor.faceIndex;
	this._battlerName = actor.battlerName;
};
$aaaa$.prototype.initEquips=function(equips){
	let slots=this.equipSlots();
	let maxSlots=slots.length;
	this._equips=[]; this._equips.length=maxSlots;
	for(let i=0;i!==maxSlots;++i){
		this._equips[i]=new Game_Item();
	}
	for(let j=0;j!==equips.length;++j){
		if(j<maxSlots){
			this._equips[j].setEquip(slots[j]===1,equips[j]);
		}
	}
	this.releaseUnequippableItems(true);
	this.refresh();
};
$aaaa$.prototype.setup=function(actorId){
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
$rrrr$=$aaaa$.prototype.changeEquip;
$dddd$=$aaaa$.prototype.changeEquip=function f(){
	debug.log('Game_Actor.prototype.changeEquip');
	$gameParty.____byChEqu=1;
	f.ori.apply(this,arguments);
	delete $gameParty.____byChEqu;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.traitObjects=function(){
	let objects=Game_Battler.prototype.traitObjects.call(this).concat([this.actor(), this.currentClass()]); // [].map().concat
	for(let x=0,arr=this.equips();x!==arr.length;++x){
		let item=arr[x];
		if(item) objects.push(item);
	}
	return objects;
};
$rrrr$=$dddd$=$aaaa$=undef;

// - actors
$aaaa$=Game_Actors;
$aaaa$.prototype.actor=function(actorId) {
	let tid=_global_conf["id-toTemplate"](actorId);
	if ($dataActors[tid]) {
		let dataSrc=(tid===actorId)?(this._data):(_global_conf["get-customActors"]());
		if (!dataSrc[actorId]) dataSrc[actorId] = new Game_Actor(tid);
		return dataSrc[actorId];
	}
	return null;
};
$rrrr$=$dddd$=$aaaa$=undef;

// window

// - base
$aaaa$=Window_Base;
$aaaa$.prototype.standardFontFace = function() {
	if($gameSystem.isKorean()) {
		return _global_conf.useFont+',Dotum, AppleGothic, sans-serif';
	} else {
		return _global_conf.useFont;
	}
};
$aaaa$.prototype.drawActorSimpleStatus=function(actor, x, y, width) {
	let lineHeight = this.lineHeight();
	let x2 = x + 180;
	let width2 = width - 180 - this.textPadding();
	this.drawActorName(actor, x, y);
	this.drawActorLevel(actor, x, y + lineHeight);
	this.drawActorIcons(actor, x, y + (lineHeight<<1) );
	this.drawActorClass(actor, x2, y);
	this.drawActorHp(actor, x2, y + lineHeight, width2);
	this.drawActorMp(actor, x2, y + (lineHeight<<1), width2);
};
$dddd$=$aaaa$.prototype.convertEscapeCharacters=function f(text) {
	//let self=this;
	text = text.replace(/\\/g, '\x1b');
	text = text.replace(/\x1b\x1b/g, '\\');
	text = text.replace(f.re_utf8, function() {
		return String.fromCharCode(arguments[1]);
	}.bind(this));
	text = text.replace(f.re_code, function() {
		return eval(arguments[1]);
	}.bind(this));
	text = text.replace(f.re_keyword, function(){
		return "\x1bRGB["+$dataCustom.textcolor.keyword+"]"+eval(arguments[1])+"\x1bRGB["+$dataCustom.textcolor.default+"]";
	}.bind(this));
	text = text.replace(f.re_item, function(){
		return "\x1bRGB["+$dataCustom.textcolor.item+"]"+$dataItems[arguments[1]].name+"\x1bRGB["+$dataCustom.textcolor.default+"]";
	}.bind(this));
	text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
		return $gameVariables.value(arguments[1]);
	}.bind(this));
	text = text.replace(/\x1bN\[([^\]]+)\]/gi, function() {
		let arg1=arguments[1],h="\x1bRGB["+$dataCustom.textcolor.keyword+"]",t="\x1bRGB["+$dataCustom.textcolor.default+"]";
		if(arg1==="my") return h+this._evtName+t;
		if(arg1.match(/evt-[0-9]+/g)) return h+$gameMap._events[parseInt(arg1.slice(4))].event().meta.name+t;
		let val=parseInt(arg1);
		if(!isNaN(val)) return this.actorName(val);
		return '';
	}.bind(this));
	text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
		return this.partyMemberName(parseInt(arguments[1]));
	}.bind(this));
	text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
	return text;
};
$dddd$.re_utf8=/\x1bUTF8\[([^\]]+)\]/g;
$dddd$.re_code=/\x1bCODE'([^']+)'/g;
$dddd$.re_item=/\x1bitem\[(\d+)\]/g;
$dddd$.re_keyword=/\x1bkey'([^']+)'/g;
$aaaa$.prototype.processNormalCharacter = function(textState) {
	let c = textState.text[textState.index++];
	let w = this.textWidth(c);
	if(!this.inaline && this.constructor===Window_Message && textState.x + w > this.contentsWidth()){
		--textState.index;
		this.processNewLine(textState);
	} // auto new line only when: this.constructor===Window_Message
	if(this.constructor===Window_Message && textState.y + textState.height > this.contentsHeight()){
		--textState.index;
		//this.newPage(textState);
		return;
	} // auto new page only when: this.constructor===Window_Message
	this.contents.drawText(c, textState.x, textState.y, w, textState.height);
	textState.x += w;
};
$dddd$=$aaaa$.prototype.processEscapeCharacter=function f(code, textState){
	// upper case str
	switch (code) {
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
$dddd$.re=/^\[((rgba\((\d+,){3}[01](\.\d+)?\))|(#[0-9A-Fa-f]{6}))\]/;
$rrrr$=$dddd$=$aaaa$=undef;

// - msg
$aaaa$=Window_Message;
$rrrr$=$aaaa$.prototype.onEndOfText;
$dddd$=$aaaa$.prototype.onEndOfText=function f(){
	f.ori.call(this);
	this.inaline=false;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.startMessage;
$dddd$=$aaaa$.prototype.startMessage=function f(){
	if($gameMessage._evtName!==undefined) this._evtName=$gameMessage._evtName;
	if($gameMessage._nameField!==undefined){
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
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype._moveTxtInput=function(){ // if 'this._nameField' is presented
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
$rrrr$=$aaaa$.prototype.updateOpen;
$dddd$=$aaaa$.prototype.updateOpen=function f(){
	let op=this._opening;
	f.ori.call(this);
	if(this._opening===false && this._nameField && this._nameField.enabled){
		this._nameField.alpha=1; // must be run: when it is another person talking in the seq. of msg.
		if(op) this._moveTxtInput();
	}
	return this._opening;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.updateClose;
$dddd$=$aaaa$.prototype.updateClose=function f(){
	if(this._closing && this._nameField) this._nameField.alpha=0;
	f.ori.call(this);
	return this._closing;
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.terminateMessage;
$dddd$=$aaaa$.prototype.terminateMessage=function f(){
	if(this._nameField!==undefined){
		//this.removeChild(this._nameField);
		//this._nameField.contents.clear();
		this._nameField.enabled=0;
	}
	return f.ori.call(this);
	//delete Input._currentState['ok'];
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.updateInput=function(){
	if (this.isAnySubWindowActive()) {
		return true;
	}
	if (this.pause) {
		if (this.isTriggered()) {
			Input.update();
			this.pause = false;
			if (!this._textState) {
				if($gameMessage._windowCnt) this.pause=true;
				else this.terminateMessage();
			}
		}
		return true;
	}
	return false;
};
$rrrr$=$aaaa$.prototype.loadMessageFace;
$dddd$=$aaaa$.prototype.loadMessageFace=function f(){
	if($gameMessage.faceIndex()==="data"){
		// all data provided, draw!
		let data=$gameMessage.faceName(),c=this.contents,tmp=d.ce('canvas');
		// cut others unrelated, prevents unknown smoothing colors
		tmp.width=data[3]; tmp.height=data[4];
		let ctx=tmp.getContext('2d');
		ctx.drawImage(
			data[0].constructor===HTMLCanvasElement?data[0]:data[0]._image,
			data[1],data[2],data[3],data[4],
			0,0,data[3],data[4]
		);
		// re-arrange data to fit the function
		data[0]=tmp._canvas=tmp; data[2]=data[1]=0;
		c.blt.apply(c,data);
	}else return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.drawMessageFace;
$dddd$=$aaaa$.prototype.drawMessageFace=function f(){
	if($gameMessage.faceIndex()==="data") return; // ensurance
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - selectable
$aaaa$=Window_Selectable;
$aaaa$.prototype.standardFontSize=()=>(Utils.isMobileDevice()<<2)+28;
$aaaa$.prototype.lineHeight=()=>(Utils.isMobileDevice()*6)+36;
$rrrr$=$aaaa$.prototype.processHandling;
$dddd$=$aaaa$.prototype.processHandling=function f(){
	if(SceneManager._nextScene===null) return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.processCursorMove=function(){ // overwrite for efficiency
	if (this.isCursorMovable()) {
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
		if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
			this.cursorPagedown();
			if(Input.isPressed('shift')) for(let x=10;--x;) this.cursorPagedown();
		}
		if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
			this.cursorPageup();
			if(Input.isPressed('shift')) for(let x=10;--x;) this.cursorPageup();
		}
		if (this.index() !== lastIndex) {
			SoundManager.playCursor();
		}
	}
};
$aaaa$.prototype.cursorPageup=function() { // overwrite because it's wrong
	if(0<this.topRow()) this.setTopRow(this.topRow() - this.maxPageRows());
	this.select(Math.max(this.index() - this.maxPageItems(), 0));
};
$aaaa$.prototype.cursorPagedown=function() { // overwrite because it's wrong
	let tmp=this.topRow() + this.maxPageRows();
	if(tmp < this.maxRows()) this.setTopRow(tmp);
	let idx=this.index(); idx*=idx>=0;
	this.select(Math.min(idx + this.maxPageItems(), this.maxItems() - 1));
};
$aaaa$.prototype.processCancel = function(noSound) {
	if(!noSound) SoundManager.playCancel();
	this.updateInputData();
	this.deactivate();
	this.callCancelHandler();
};
$rrrr$=$dddd$=$aaaa$=undef;

// - command
$aaaa$=Window_Command;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize=function f(x, y, kargs) {
	for(let i in kargs) this[i]=kargs[i];
	return f.ori.call(this,x,y);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.windowWidth = function() {
	let defaultVal=240;
	return Math.min(defaultVal,this.maxWidth||defaultVal);
};
$aaaa$.prototype.windowHeight = function() {
	let defaultVal=this.fittingHeight(this.numVisibleRows());
	return Math.min(defaultVal,this.maxHeight||defaultVal);
};
$aaaa$.prototype.drawItem=function(index) {
	let rect=this.itemRectForText(index);
	let align = this.itemTextAlign();
	if(this._list[index] && this._list[index].once) this.contents.textColor=$dataCustom.textcolor.keyword;
	else this.resetTextColor();
	this.changePaintOpacity(this.isCommandEnabled(index));
	this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

// - titleCommand
$aaaa$=Window_TitleCommand;
$aaaa$.prototype.makeCommandList = function() {
	this.addCommand(TextManager.newGame,   'newGame');
	this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
	this.addCommand(TextManager.options,   'options');
	if(this.addCustomCommands) this.addCustomCommands();
};
$aaaa$.prototype.addCustomCommands=function(){
	this.addCommand($dataCustom.usrSwitch,   'usrSwitch_global');
	this.addCommand($dataCustom.fromLocalSave,   'loadLocalSave');
	this.addCommand($dataCustom.fromOnlineSave,   'loadOnlineSave');
	//this.addCommand(TextManager.testObjKey+":D",   'customTitleCmd'); // reserve this line for deleting 'TextManager.testObjKey' in the '.json' file
};

// - menuCommand
$aaaa$=Window_MenuCommand;
delete $aaaa$.prototype.windowWidth; // use 'Window_Command.prototype.windowWidth'
$aaaa$.prototype.initialize = function(x, y ,kargs) {
	Window_Command.prototype.initialize.call(this, x, y ,kargs);
	this.selectLast();
};
$aaaa$.prototype.addCustomCommands=function(){
	this.addCommand("Apps",'apps');
};
$rrrr$=$aaaa$.prototype.addSaveCommand;
$dddd$=$aaaa$.prototype.addSaveCommand=function f(){ // overwrite for efficiency
	if ($dataSystem.menuCommands[5]) {
		let enabled = this.isSaveEnabled();
		this.addCommand(TextManager.save, 'save', enabled);
		this.addCommand($dataCustom.saveLocal, 'saveLocal', enabled);
		this.addCommand($dataCustom.saveOnline, 'saveOnline', enabled);
	}
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.addOnceCommand=function(){
	if(sha256(window['/tmp/']&&window['/tmp/'].V_I_M||'')==="0x321B146E4F257B81015ADF9BC4E84852334D134B27470E079838364188864AED"){
		this.addCommand('Visit It', 'gifts');
		this._list.back.once=1;
	}
};
$aaaa$.prototype.makeCommandList = function() {
	this.addOnceCommand();
	if(debug.isdepress()) this.addCommand("debug2",'debugMenu2');
	this.addMainCommands();
	this.addFormationCommand();
	this.addCustomCommands();
	this.addCommand("-".repeat(64),'',0);
	this.addOptionsCommand();
	this.addCommand($dataCustom.usrSwitch,'usrSwitch');
	this.addSaveCommand();
	this.addGameEndCommand();
};
$rrrr$=$dddd$=$aaaa$=undef;

// - options
$aaaa$=Window_Options;
$aaaa$.prototype._volumeOffset = _global_conf["default volume offset"] || 10 ;
$aaaa$.prototype.volumeOffset=function() {
	return this._volumeOffset;
};
$aaaa$.prototype.processOk = function() {
	let index = this.index();
	let symbol = this.commandSymbol(index);
	let value = this.getConfigValue(symbol);
	if (this.isVolumeSymbol(symbol)) {
		value -= this.volumeOffset();
		if (value < 0) value = 100;
		value = value.clamp(0, 100);
		this.changeValue(symbol, value);
	} else {
		this.changeValue(symbol, !value);
	}
};
$rrrr$=$dddd$=$aaaa$=undef;

// - itemlist
$aaaa$=Window_ItemList;
$aaaa$.prototype.maxCols=()=>$gamePlayer._ItemListMaxCol||2;
$aaaa$.prototype.drawItemNumber = function(item, x, y, width) {
	if (this.needsNumber()) {
		this.drawText(':', x, y, width - this.textWidth('000'), 'right');
		this.drawText($gameParty.numItems(item), x, y, width, 'right');
	}
};
$rrrr$=$dddd$=$aaaa$=undef;

// - choicelist
$aaaa$=Window_ChoiceList;
$aaaa$.prototype._minChoiceWidth = _global_conf["min choicebox width"];
$aaaa$.prototype.maxChoiceWidth = function() {
	let maxWidth = this._minChoiceWidth;
	let tmp=maxWidth.toString().toUpperCase();
	if(tmp==="MAX") return Graphics.boxWidth;
	if(!(maxWidth>=96)) maxWidth=96; // original setting
	let choices=$gameMessage.choices();
	for(let i=0;i!==choices.length;++i){
		let choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
		debug("Window_ChoiceList.prototype.maxChoiceWidth",i,choiceWidth);
		if(maxWidth<choiceWidth) maxWidth=choiceWidth;
	}
	return maxWidth;
};
$aaaa$.prototype._moveTxtInput=function(){
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
$rrrr$=$aaaa$.prototype.updateOpen;
$dddd$=$aaaa$.prototype.updateOpen=function f(){
	if(this._opening){
		f.ori.call(this); // return undefined
		let txtIn=this._moveTxtInput();
		if(this._opening===false && txtIn && txtIn.y>=0) txtIn.y=this.y-txtIn.height;
	}
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.updatePlacement = function() { // called in 'this.start' ; then no called
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
$rrrr$=$aaaa$.prototype.start;
$dddd$=$aaaa$.prototype.start=function f(){
	let rtv=f.ori.call(this),nf=SceneManager._scene._messageWindow._nameField;
	if(nf&&nf.enabled){
		if((this.y-=nf.height)<0){
			this.height+=this.y;
			this.y=0;
		}
	}
	return rtv;
}; $dddd$.ori=$rrrr$;
$rrrr$=$dddd$=$aaaa$=undef;

// - savefilelist
$aaaa$=Window_SavefileList;
$aaaa$.prototype.drawGameTitle = function(info, x, y, width) {
	if (info.title) {
		this.drawText(DataManager.titleAddName(info), x, y, width);
	}
};
$rrrr$=$dddd$=$aaaa$=undef;


// --- --- BEG debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---



$rrrr$=$dddd$=$aaaa$=undef;
// --- --- END debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

console.log("obj_t");
