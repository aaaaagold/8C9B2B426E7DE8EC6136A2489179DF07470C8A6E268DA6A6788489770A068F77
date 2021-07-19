﻿"use strict";

// after rpg_*, before obj-t
// Tilemap , ShaderTilemap

if(!window.objs) window.objs={};
objs.test_tilemap=true; // tilemap.children is an array if true
if(objs.isDev) objs.test_webglTilemapAlpha=true; // not using alpha=0.25 re-drawn bitmaps if false

// pixi
{const tm=PIXI.tilemap,kp='prototype';
// - RectTileShader
{ const k='RectTileShader',a=function RectTileShader2(gl,maxTextures){
	const g=tm.shaderGenerator;
	const _this = tm.TilemapShader.call(this, gl, maxTextures, a.rectShaderVert, g.generateFragmentSrc(maxTextures, a.rectShaderFrag)) || this;
	_this.vertSize = 11;
	_this.vertPerQuad = 4;
	_this.stride = _this.vertSize * 4;
	g.fillSamplers(_this, _this.maxTextures);
	return _this;
};
const p=a[kp]=Object.create(tm[k][kp]);
p.constructor=tm[k]=a;
a.rectShaderVert="\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aFrame;\nattribute vec2 aAnim;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform vec2 animationFrame;\n\nvarying vec2 vTextureCoord;\nvarying float vTextureId;\nvarying vec4 vFrame;\n\nvoid main(void){\n\tgl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\tvec2 anim = aAnim * animationFrame;\n\tvTextureCoord = aTextureCoord + anim;\n\tvFrame = aFrame + vec4(anim, anim);\n\tvTextureId = aTextureId;\n}\n";
a.rectShaderFrag="varying vec2 vTextureCoord;\nvarying vec4 vFrame;\nvarying float vTextureId;\nuniform vec4 shadowColor;\nuniform sampler2D uSamplers[%count%];\nuniform vec2 uSamplerSize[%count%];\nuniform float tp;\n\nvoid main(void){\n\tvec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);\n\tfloat textureId = floor(vTextureId + 0.5);\n\t\n\tvec4 color;\n\t%forloop%\n\tif(tp>0.0 && tp<=1.0 && vTextureId>=0.0) color*=1.0-tp;\n\tgl_FragColor = color;\n\t\n}";
}
// - TileRenderer
{ const TileRenderer=$aaaa$=tm.TileRenderer;
const p=$aaaa$[kp];
$d$=p.bindTextures = function f(renderer, shader, textures) {
	const bounds = this.boundSprites , glts = this.glTextures , len = textures.length , maxTextures = this.maxTextures;
	if (len > 4 * maxTextures) return;
	let doClear = TileRenderer.DO_CLEAR;
	if (doClear && !this._clearBuffer) this._clearBuffer = f._clearBuffer;
	let i;
	for(i=0;i!==len;++i){
		let texture = textures[i];
		if (!texture || !textures[i].valid) continue;
		let bs = bounds[i >> 2][i & 3];
		if (!bs.texture || bs.texture.baseTexture !== texture.baseTexture) {
			bs.texture = texture;
			let glt = glts[i >> 2];
			renderer.bindTexture(glt, 0, true);
			if (doClear) {
				f._hackSubImage(glt.baseTexture._glTextures[renderer.CONTEXT_UID], bs, this._clearBuffer, 1024, 1024);
			}
			else {
				f._hackSubImage(glt.baseTexture._glTextures[renderer.CONTEXT_UID], bs);
			}
		}
	}
	this.texLoc.length = 0;
	for(i=0;i!==maxTextures;++i){
		this.texLoc.push(renderer.bindTexture(glts[i], i, true));
	}
	shader.uniforms.uSamplers = this.texLoc;
};
$d$._clearBuffer=null; // new Uint8Array(1024 * 1024 * 4); // if 'null', fill zero, matching the size
$d$._hackSubImage=function _hackSubImage(tex, sprite, clearBuffer, clearWidth, clearHeight) {
	let gl = tex.gl;
	let baseTex = sprite.texture.baseTexture;
	if (clearBuffer && clearWidth > 0 && clearHeight > 0) {
		gl.texSubImage2D(gl.TEXTURE_2D, 0, sprite.position.x, sprite.position.y, clearWidth, clearHeight, tex.format, tex.type, clearBuffer);
	}
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
	gl.texSubImage2D(gl.TEXTURE_2D, 0, sprite.position.x, sprite.position.y, tex.format, tex.type, baseTex.source);
};
p.checkLeaks=function(){
	const now = Date.now() , old = now - 255 , t = this.lastTimeCheck;
	if(t < old || t > now){
		this.lastTimeCheck = now;
		let vbs = this.vbs;
		for(let key in vbs) if(vbs[key].lastTimeAccess < old) this.removeVb(key);
	}
};
p.getVb=function(id){
	// 雷ㄛ 變數名稱寫錯是在衝三小
	this.checkLeaks();
	let vb=this.vbs[id];
	if(vb){
		vb.lastTimeAccess=Date.now();
		return vb;
	}
	return null;
};
}
// - CompositeRectTileLayer
{ const a=tm.CompositeRectTileLayer;
const p=a[kp];
$k$='initialize';
$r$=p[$k$];
(p[$k$]=function f(z, bitmaps, useSqr, texPerChild){
	texPerChild=texPerChild||16; // cannot >16 ?_? // webGL guarentee at least 8 textures ; implementation ususally 16 textures
	return f.ori.call(this,z,bitmaps,useSqr,texPerChild);
}).ori=$r$;
}
// - RectTileLayer
{ const a=tm.RectTileLayer;
const p=a[kp];
$d$=p.renderWebGL = function f(renderer, useSquare){
	if(useSquare === void 0) useSquare = false;
	let points = this.pointsBuf;
	if(points.length === 0) return;
	let rectsCount = ~~(points.length / 9);
	let tile = renderer.plugins.tilemap;
	let gl = renderer.gl;
	if(!useSquare) tile.checkIndexBuffer(rectsCount);
	let shader = tile.getShader(useSquare);
	let textures = this.textures;
	if(textures.length === 0) return;
	let len = textures.length;
	if(this._tempTexSize < shader.maxTextures){
		this._tempTexSize = shader.maxTextures;
		this._tempSize = new Float32Array(2 * shader.maxTextures);
	}
	for(let i=0;i!==len;++i){
		if (!textures[i] || !textures[i].valid) return;
		let texture = textures[i].baseTexture;
	}
	tile.bindTextures(renderer, shader, textures);
	let vb = tile.getVb(this.vbId);
	if(!vb){
		vb = tile.createVb(useSquare);
		this.vbId = vb.id;
		//this.vbBuffer = null;
		this.modificationMarker = 0;
	}
	let vao = vb.vao;
	renderer.bindVao(vao);
	let vertexBuf = vb.vb;
	vertexBuf.bind();
	let vertices = rectsCount * shader.vertPerQuad;
	if(vertices === 0) return;
	if(this.modificationMarker !== vertices){
		this.modificationMarker = vertices;
		let vs = shader.stride * vertices;
		if(!this.vbBuffer || this.vbBuffer.byteLength < vs){
			let bk = shader.stride;
			while (bk < vs) bk<<=1;
			if(f.buf.byteLength<bk){
				if(objs.isDev) console.log(bk);
				f.buf=new ArrayBuffer(bk);
			}
			this.vbBuffer = f.buf;
			//if(!this.vbBuffer||this.vbBuffer.byteLength<bk)
			//	this.vbBuffer = new ArrayBuffer(bk);
			//}
			this.vbArray = new Float32Array(this.vbBuffer);
			this.vbInts = new Uint32Array(this.vbBuffer);
			//vertexBuf.upload(this.vbBuffer, 0, true);
		}
		let arr = this.vbArray, ints = this.vbInts;
		let sz = 0;
		let textureId, shiftU, shiftV;
		if(useSquare){
			for(let i=0;i<points.length;i+=9){
				textureId = (points[i + 8] >> 2);
				shiftU = (points[i + 8] & 1)<<10;
				shiftV = ((points[i + 8] >> 1) & 1)<<10;
				arr[sz++] = points[i + 2];
				arr[sz++] = points[i + 3];
				arr[sz++] = points[i + 0] + shiftU;
				arr[sz++] = points[i + 1] + shiftV;
				arr[sz++] = points[i + 4];
				arr[sz++] = points[i + 6];
				arr[sz++] = points[i + 7];
				arr[sz++] = textureId;
			}
		}else{
			let tint = -1;
			for(let i=0;i<points.length;i+=9){
				let eps = 0.5;
				textureId = (points[i + 8] >> 2);
				shiftU = (points[i + 8] & 1)<<10;
				shiftV = ((points[i + 8] >> 1) & 1)<<10;
				let x = points[i + 2], y = points[i + 3];
				let w = points[i + 4], h = points[i + 5];
				let u = points[i] + shiftU, v = points[i + 1] + shiftV;
				let animX = points[i + 6], animY = points[i + 7];
				arr[sz++] = x;
				arr[sz++] = y;
				arr[sz++] = u;
				arr[sz++] = v;
				arr[sz++] = u + eps;
				arr[sz++] = v + eps;
				arr[sz++] = u + w - eps;
				arr[sz++] = v + h - eps;
				arr[sz++] = animX;
				arr[sz++] = animY;
				arr[sz++] = textureId;
				arr[sz++] = x + w;
				arr[sz++] = y;
				arr[sz++] = u + w;
				arr[sz++] = v;
				arr[sz++] = u + eps;
				arr[sz++] = v + eps;
				arr[sz++] = u + w - eps;
				arr[sz++] = v + h - eps;
				arr[sz++] = animX;
				arr[sz++] = animY;
				arr[sz++] = textureId;
				arr[sz++] = x + w;
				arr[sz++] = y + h;
				arr[sz++] = u + w;
				arr[sz++] = v + h;
				arr[sz++] = u + eps;
				arr[sz++] = v + eps;
				arr[sz++] = u + w - eps;
				arr[sz++] = v + h - eps;
				arr[sz++] = animX;
				arr[sz++] = animY;
				arr[sz++] = textureId;
				arr[sz++] = x;
				arr[sz++] = y + h;
				arr[sz++] = u;
				arr[sz++] = v + h;
				arr[sz++] = u + eps;
				arr[sz++] = v + eps;
				arr[sz++] = u + w - eps;
				arr[sz++] = v + h - eps;
				arr[sz++] = animX;
				arr[sz++] = animY;
				arr[sz++] = textureId;
			}
		}
		vertexBuf.upload(arr, 0, true);
	}
	
	let drawn=false;
	if(objs.test_webglTilemapAlpha) // cannot be accomplished: when alpha=0, the image is white out
	{
		const loc_tp = gl.getUniformLocation(shader.program, "tp");
		if(loc_tp!==null){
			const tp=1-this.alpha*this.parent.alpha,oldTp=gl.getUniform(shader.program, loc_tp);
			gl.uniform1f(loc_tp, tp );
			if(useSquare) gl.drawArrays(gl.POINTS, 0, vertices);
			else gl.drawElements(gl.TRIANGLES, rectsCount * 6, gl.UNSIGNED_SHORT, 0);
			gl.uniform1f(loc_tp, oldTp); // restore
			drawn=true;
		}
	}
	if(!drawn){
		if(useSquare) gl.drawArrays(gl.POINTS, 0, vertices);
		else gl.drawElements(gl.TRIANGLES, rectsCount * 6, gl.UNSIGNED_SHORT, 0);
	}
};
$d$.buf=new ArrayBuffer(0);
}
}
$pppp$=$aaaa$=undef;

// core

// - Tilemap
$aaaa$=Tilemap;
$pppp$=$aaaa$.prototype;
$aaaa$.revealTp=0.3125; // tp:transparent
$aaaa$.isVisibleTile=function(tid){ // take advantage of "Tilemap.TILE_ID_MAX is pow(2)", reserve original function for future editing
	return (tid>>13)===0;
};
$aaaa$._getProperAutoile_A5=(mapd,dstx,dsty,lv,tileIdAsBase,borderIsNotEnd)=>{
	// TODO
};
$aaaa$._getProperAutoile=(mapd,dstx,dsty,lv,tileIdAsBase,borderIsNotEnd)=>{
	if(!mapd||!mapd.data||typeof Tilemap==='undefined'||Tilemap.isAutotile===undefined||!Tilemap.isAutotile(tileIdAsBase)) return;
	const w=mapd.width,h=mapd.height,sz=w*h;
	const toBase=t=>(48*~~((t-2048)/48))+2048,getTile=(x,y,lv)=>mapd.data[lv*sz+y*w+x],isEnd=(x,y)=>{
		// TODO
	};
	const rx=x=>mapd.scrollType&2?(x+w)%w:x;
	const ry=y=>mapd.scrollType&1?(y+h)%h:y;
	const validX=x=>0<=x&&x<w;
	const validY=y=>0<=y&&y<h;
	let tmp;
	lv|=0;
	tileIdAsBase=toBase(tileIdAsBase);
	// 以河道來思考
	let cnt_end=0,bitmsk_end=0; // 數下右上左(8421)是岸的數量
	
	bitmsk_end<<=1;
	tmp=validY(tmp=ry(dsty+1)) ? toBase(getTile(dstx,tmp,lv))!==tileIdAsBase : borderIsNotEnd;
	cnt_end+=tmp;
	bitmsk_end|=tmp;
	
	bitmsk_end<<=1;
	tmp=validX(tmp=rx(dstx+1)) ? toBase(getTile(tmp,dsty,lv))!==tileIdAsBase : borderIsNotEnd;
	cnt_end+=tmp;
	bitmsk_end|=tmp;
	
	bitmsk_end<<=1;
	tmp=validY(tmp=ry(dsty-1)) ? toBase(getTile(dstx,tmp,lv))!==tileIdAsBase : borderIsNotEnd;
	cnt_end+=tmp;
	bitmsk_end|=tmp;
	
	bitmsk_end<<=1;
	tmp=validX(tmp=rx(dstx-1)) ? toBase(getTile(tmp,dsty,lv))!==tileIdAsBase : borderIsNotEnd;
	cnt_end+=tmp;
	bitmsk_end|=tmp;
	
	switch(cnt_end){
	case 0:{ // 0..15
		let bitmsk=0,tmpx,tmpy;
		
		bitmsk<<=1;
		tmpx=rx(dstx-1); tmpy=ry(dsty+1);
		bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
		
		bitmsk<<=1;
		tmpx=rx(dstx+1); tmpy=ry(dsty+1);
		bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
		
		bitmsk<<=1;
		tmpx=rx(dstx+1); tmpy=ry(dsty-1);
		bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
		
		bitmsk<<=1;
		tmpx=rx(dstx-1); tmpy=ry(dsty-1);
		bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
		
		return tileIdAsBase|bitmsk;
	}break;
	case 1:{ // 16..31
		let bitAt=4,bitmsk=0,tmpx,tmpy;
		while( bitAt && (bitmsk_end&(1<<--bitAt))===0 )
			;
		switch(bitAt){
		case 0: // 左岸
			bitmsk<<=1;
			tmpx=rx(dstx+1); tmpy=ry(dsty+1);
			bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
			
			bitmsk<<=1;
			tmpx=rx(dstx+1); tmpy=ry(dsty-1);
			bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
		break;
		case 1: // 上岸
			bitmsk<<=1;
			tmpx=rx(dstx-1); tmpy=ry(dsty+1);
			bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
			
			bitmsk<<=1;
			tmpx=rx(dstx+1); tmpy=ry(dsty+1);
			bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
		break;
		case 2: // 右岸
			bitmsk<<=1;
			tmpx=rx(dstx-1); tmpy=ry(dsty-1);
			bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
			
			bitmsk<<=1;
			tmpx=rx(dstx-1); tmpy=ry(dsty+1);
			bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
		break;
		case 3: // 下岸
			bitmsk<<=1;
			tmpx=rx(dstx+1); tmpy=ry(dsty-1);
			bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
			
			bitmsk<<=1;
			tmpx=rx(dstx-1); tmpy=ry(dsty-1);
			bitmsk|=validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd;
		break;
		}
		tileIdAsBase|=bitAt<<2;
		tileIdAsBase|=bitmsk;
		tileIdAsBase+=16; // (%48) don't use "|"
	}break;
	default:{ // 32..47
		let offset=0,tmpx,tmpy;
		switch(bitmsk_end){
		case 0x0:
		case 0x1:
		case 0x2:
		case 0x4:
		case 0x8: break;
		case 0x3: { // 左上
			offset=2;
			tmpx=rx(dstx+1); tmpy=ry(dsty+1);
			offset|=(validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd);
		}break;
		case 0x5: { // 左右
			offset=0;
		}break;
		case 0x6: { // 上右
			offset=4;
			tmpx=rx(dstx-1); tmpy=ry(dsty+1);
			offset|=(validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd);
		}break;
		case 0x7: { // 左上右
			offset=10;
		}break;
		case 0x9: { // 左下
			offset=8;
			tmpx=rx(dstx+1); tmpy=ry(dsty-1);
			offset|=(validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd);
		}break;
		case 0xA: { // 上下
			offset=1;
		}break;
		case 0xB: { // 左上下
			offset=11;
		}break;
		case 0xC: { // 右下
			offset=6;
			tmpx=rx(dstx-1); tmpy=ry(dsty-1);
			offset|=(validX(tmpx)&&validY(tmpy) ? toBase(getTile(tmpx,tmpy,lv))!==tileIdAsBase : borderIsNotEnd);
		}break;
		case 0xD: { // 左右下
			offset=12;
		}break;
		case 0xE: { // 上右下
			offset=13;
		}break;
		case 0xF: { // 左上右下
			offset=15;
		}break;
		}
		tileIdAsBase|=offset;
		tileIdAsBase+=32; // (%48) don't use "|"
	}break;
	}
	return tileIdAsBase;
};

$pppp$.refresh=function(){
	if(this.parent){
		this.updateTransform(true);
		this._needsRepaint=true;
	}
	this._lastTiles.length=0;
};
$pppp$.usetree=none; // prepare
$pppp$.rmc_tree=function(key){}; // prepare
$pppp$.addc_tree=function(key,data){}; // prepare
Object.defineProperties(Tilemap.prototype,{
	frameCount_2:{ get:function(){return this._fc_2;}, set:function(rhs){
		let fc_2=Number(rhs)^0;
		if(0<fc_2){
			this._fc_2=fc_2;
			this._fc_2_msk=(1<<(fc_2+4))-1;
		}
		return rhs;
	},configurable:false},
});
$rrrr$=$pppp$.setData;
$dddd$=$pppp$.setData=function f(w,h,d){
	if($dataMap){
		let tmp=$dataMap.meta.frameCount_2;
		if(tmp) this.frameCount_2=(Number(tmp)||5)^0;
	}
	return f.ori.call(this,w,h,d);
}; $dddd$.ori=$rrrr$;
$rrrr$=$pppp$.update;
$dddd$=$pppp$.update=function f(){ // forEach is slowwwwwwwwww
	if(_global_conf.noAutotile) this.animationFrame=0^0;
	else{
		++this.animationCount;
		this.animationFrame = ~~((this.animationCount&=this._fc_2_msk)>>this._fc_2); // always >=0
	}
	this.updateChildren();
	for (let x=0,arr=this.bitmaps;x!==arr.length;x++) if (arr[x]) arr[x].touch();
}; $dddd$.ori=$rrrr$;
$dddd$=$pppp$.updateChildren=function f(){
	f.forEach.t=this;
	this.children.forEach(f.forEach); // Sprite_Character.updatePosition is here
	++this._updateLater_cnt;
	return this.doWaitRemove();
};
$dddd$.forEach=function f(c){
	if(c.constructor===Sprite_Character){
		if(!f.t._updateLater_chrSet.has(c)){
			f.t._updateLater_chrSet.add(c);
			f.t._updateLater_chrArr.push(c);
			c.setupAnimation();
			c.setupBalloon();
		}
	}else c.update&&c.update();
};
$pppp$.doUpdateLater=function(){
	if(!this._updateLater_cnt) return;
	const chr=this._updateLater_chrArr;
	if(this._updateLater_cnt>1){
		for(let x=0;x!==chr.length;++x){
			chr[x].update(false,true);
			chr[x].update();
		}
	}else{
		
		for(let x=0;x!==chr.length;++x){
			chr[x].update();
		}
	}
	this._updateLater_chrArr.length=0;
	this._updateLater_chrSet.clear();
	this._updateLater_cnt=0;
	return this.doWaitRemove();
};
$dddd$=$pppp$._sortChildren=function f(){
	f.cmp.r=this;
	this.children.sort(f.cmp);
};
$dddd$.cmp=function f(a,b){
	return a.z-b.z||(a.oy===undefined?a.y:(a.oy-f.r._lastOy))-(b.oy===undefined?b.y:(b.oy-f.r._lastOy))||a.z2-b.z2||a.spriteId-b.spriteId;
};
$pppp$.usetree=function(){ this.children=new AVLTree(true); };
$rrrr$=$pppp$.initialize;
$dddd$=$pppp$.initialize=function f(){
	//debug.log("Tilemap.prototype.initialize"); // also ShaderTilemap;
	PIXI.Container.call(this);
	if(!objs.test_tilemap) this.usetree(); // tilemap refreshed at the end of 'initialize'
	this._waitRemoves=new Set();
	
	this._margin = 0^0;
	this._width = Graphics.width+(this._margin<<1) >>0;
	this._height = Graphics.height+(this._margin<<1) >>0;
	this._tileWidth = Game_Map.prototype.tileWidth()>>0;
	this._tileHeight = Game_Map.prototype.tileHeight()>>0;
	this._tileEdge=Math.max(this._tileWidth,this._tileHeight)>>0;
	this._tileEdge4=this._tileEdge*4;
	this._tileEdge4p2=this._tileEdge4*this._tileEdge4;
	this._tileWidth_=this._tileWidth>>1;
	this._tileHeight_=this._tileHeight>>1;
	this._mapWidth = 0;
	this._mapHeight = 0;
	this._mapData = null;
	this._layerWidth = 0;
	this._layerHeight = 0;
	this._lastTiles = [];
	
	this.bitmaps = []; // as a tileset
	
	this.origin = new Point(); // The origin point of the tilemap for scrolling.
	this._lastOx=0;
	this._lastOy=0;
	
	this.flags = []; // The tileset flags.
	
	this.animationCount  =  0^0; // The animation count for autotiles.
	this.frameCount_2=5^0; // number of counting bits
	
	this.horizontalWrap = false; // Whether the tilemap loops horizontal.
	this.verticalWrap = false; // Whether the tilemap loops vertical.
	
	// pre-cal.
	//  op order: '+' , '^'
	this._tileCols=0^Math.ceil(this._width/this._tileWidth)+1;
	this._tileRows=0^Math.ceil(this._height/this._tileHeight)+1;
	
	// reorder tasks
	// - update right before sorting children
	this._updateLater_chrSet=new Set();
	this._updateLater_chrArr=[];
	this._updateLater_cnt=0;
	
	// fast search
	
	this._createLayers();
	this.refresh(); // ShaderTilemap access children
}; $dddd$.ori=$rrrr$;
$pppp$.rmc_tree=function(key){
	// return true if successfully delete else false-like
	//if(objs.testing) console.log(this.children.length,this.children.forEach().length);
	return this.children._del(key);
	//if(objs.testing&&this.children.length!==this.children.forEach().length) debugger;
};
$pppp$.addc_tree=function(key,data){
	//if(objs.testing) console.log(this.children.length,this.children.forEach().length);
	this.children._add(key,data);
	//if(objs.testing&&this.children.length!==this.children.forEach().length) debugger;
	//console.log(key,data); this.children._goThrough_iter({quiet:1}); // debug
	data._lastKey=key;
	if(data._character) data._character._tilemapKey=key;
};
$pppp$.parseKey=function(key){
	// z,y,z2
	let tmp=key[0];
	return [tmp>>20,((tmp>>4)-this._tileHeight)&0xFFFF,tmp&0xF];
};
$pppp$.genKeyFromChild=function(c){
	if(!c.z2) c.z2=0;
	let z=c.z; z*=z>=0;
	let y=(c.oy===undefined)?c.y:c.oy;
	y+=this._tileHeight; y*=y>=0;
	let z2=c.z2; z2*=z2>=0;
	let key=[(((z<<16)|y)<<4)|z2,c.spriteId^0];
	if(c.spriteId===undefined) key.push(this._boundsID);
	return key;
};
$rrrr$=$pppp$.addChild;
$dddd$=$pppp$.addChild=function f(c){
	if(c.parent && c.parent!==this) c.parent.removeChild(c);
	c.parent=this;
	
	c.transform._parentID=-1;
	
	this.addc_tree(this.genKeyFromChild(c),c);
	
	++this._boundsID;
	c.emit('added', this);
	return c;
}; $dddd$.ori=$rrrr$;
if(objs.test_tilemap)$pppp$.addChild=$rrrr$;
$rrrr$=$pppp$.removeChild;
$dddd$=$pppp$.removeChild=function f(c){
	let key=c._lastKey,res;
	if(!( this.children.keyOk(key)&&(res=this.rmc_tree(key)) )) return null;
	
	c.parent = null;
	c.transform._parentID = -1;
	c._lastKey=null;
	
	this._boundsID++;
	
	c.emit('removed', this);
	return c;
}; $dddd$.ori=$rrrr$;
if(objs.test_tilemap)$pppp$.removeChild=$rrrr$;
$pppp$.waitRemove=function(c){
	if(c&&c.parent===this) this._waitRemoves.add(c);
};
$pppp$.doWaitRemove=function(){
	this._waitRemoves.forEach(c=>c.parent===this&&this.removeChild(c));
	return this._waitRemoves.clear();
};
if(objs.test_tilemap){
$pppp$.updateTransform_tail=function(){
	this.doUpdateLater();
	this._sortChildren();
	PIXI.Container.prototype.updateTransform.call(this);
};
}else{
$dddd$=$pppp$.updateTransform_tail=function f(){
	this.doUpdateLater();
	this._boundsID++;
	this.transform.updateTransform(this.parent.transform);
	this.worldAlpha = this.alpha * this.parent.worldAlpha;
	return this.children.forEach(f.forEach,true);
};
$dddd$.forEach=c=>c.visible&&c.updateTransform();
}
$pppp$.updateTransform=function(forced){
	const startX = (this.origin.x - this._margin)/this._tileWidth  ^ 0;
	const startY = (this.origin.y - this._margin)/this._tileHeight ^ 0;
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
	this.updateTransform_tail();
};
$dddd$=$pppp$._createLayers=function f(){ // re-write: psuedo layer
	let width = this._width;
	let height = this._height;
	let margin = this._margin;
	//let tileCols = Math.ceil(width / this._tileWidth) + 1;
	//let tileRows = Math.ceil(height / this._tileHeight) + 1;
	let layerWidth = this._tileCols * this._tileWidth;
	let layerHeight = this._tileRows * this._tileHeight;
	this._layerWidth = layerWidth;
	this._layerHeight = layerHeight;
	let dup=4;

	/*
	 * Z coordinate:
	 *
	 * 0 : Lower tiles
	 * 1 : Lower characters
	 ** 3 : _z2Layers: psuedo tiles with different sprite.y
	 * 3 : Normal characters
	 * 4 : Upper tiles
	 * 5 : Upper characters
	 * 6 : Airship shadow
	 * 7 : Balloon
	 * 8 : Animation
	 * 9 : Destination
	 */
	
	this._lowerLayer = new Sprite();
	this._lowerLayer.move(-margin, -margin, width, height);
	this._lowerLayer.z = 0;
	this._lowerBitmap = new Bitmap(layerWidth, layerHeight);
	for(let _=dup;_--;) this._lowerLayer.addChild(new Sprite(this._lowerBitmap));
	
if(1){
	this._z2Layers={};
	this._z2Layers_ys=[];
	this._z2Layers_bitmaps={};
	let addUpper_str=$dataMap.meta.addUpper;
	if(addUpper_str!==true && addUpper_str){
		let addUppers=JSON.parse(addUpper_str);
		let ys=this._z2Layers_ys,lvs=this._z2Layers;
		for(let x=0,arr=addUppers,tmpSet=new Set([undefined]);x!==arr.length;++x){
			let y=arr[x].y;
			if(tmpSet.has(y)) continue;
			tmpSet.add(y);
			ys.push(y);
		}
		ys.sortn();
		for(let j=0,th=Game_Map.prototype.tileHeight();j!==ys.length;++j){
			let y=ys[j];
			if(lvs[y]) continue;
			let lv=lvs[y] = new Sprite();
			lv.oy=y*th+((th>>1)|1);
			lv.z2=4; // same as 'this._upperLayer'
			lv.move(-margin, -margin, width, height);
			lv.z=3;
			let bitmap=new Bitmap(layerWidth, layerHeight);
			this._z2Layers_bitmaps[y]=bitmap;
			for(let _=dup;_--;) lv.addChild(new Sprite(bitmap));
		}
	}
}
	
	this._upperLayer = new Sprite();
	this._upperLayer.move(-margin, -margin, width, height);
	this._upperLayer.z = 4;
	this._upperBitmap = new Bitmap(layerWidth, layerHeight);
	for(let _=dup;_--;) this._upperLayer.addChild(new Sprite(this._upperBitmap));
	
	this.addChild(this._lowerLayer);
	if(this._z2Layers){ for(let x=0,idx=this._z2Layers_ys,arr=this._z2Layers;x!==idx.length;++x){
		this.addChild(arr[idx[x]]);
	} }
	this.addChild(this._upperLayer);
};
$pppp$._updateLayerPositions=function(){
	let m = this._margin;
	let ox = Math.floor(this.origin.x);
	let oy = Math.floor(this.origin.y);
	let x2 = (ox - m).mod(this._layerWidth);
	let y2 = (oy - m).mod(this._layerHeight);
	let w1 = this._layerWidth - x2;
	let h1 = this._layerHeight - y2;
	let w2 = this._width - w1;
	let h2 = this._height - h1;
	
	let childrens=[this._lowerLayer.children];
	if(this._z2Layers){ for(let x=0,idx=this._z2Layers_ys,arr=this._z2Layers;x!==idx.length;++x){
		childrens.push(arr[idx[x]].children);
	} }
	childrens.push(this._upperLayer.children);
	for (let i = 0; i!==childrens.length; ++i) {
		let children = childrens[i];
		children[0].move(0, 0, w1, h1);
		children[0].setFrame(x2, y2, w1, h1);
		children[1].move(w1, 0, w2, h1);
		children[1].setFrame(0, y2, w2, h1);
		children[2].move(0, h1, w1, h2);
		children[2].setFrame(x2, 0, w1, h2);
		children[3].move(w1, h1, w2, h2);
		children[3].setFrame(0, 0, w2, h2);
	}
};
$pppp$._paintAllTiles=function(startX, startY){
	for(let y=0,ys=this._tileRows,xs=this._tileCols;y!==ys;++y){
		for(let x=0;x!==xs;++x){
			this._paintTiles(startX, startY, x, y);
		}
	}
	{
		const o=this.origin;
		this._lastOx=o.x;
		this._lastOy=o.y;
	}
};
$pppp$._paintTiles=function f(startX, startY, x, y){
	// starting from top-left
	//debug.log("Tilemap.prototype._paintTiles");
	let w=this._mapWidth,h=this._mapHeight;
	let tableEdgeVirtualId = 1<<14;
	let mx = startX + (this.horizontalWrap&&this._tileCols<w?x.mod(w):x);
	let my = startY + (this.  verticalWrap&&this._tileRows<h?y.mod(h):y);
	let mmx=this.horizontalWrap?mx.mod(w):mx;
	let mmy=this.  verticalWrap?my.mod(h):my;
	let lx = mx.mod(this._tileCols);
	let ly = my.mod(this._tileRows);
	let dx = lx * this._tileWidth;
	let dy = ly * this._tileHeight;
	let shadowBits = 0;
	let upperTileId1 = 0;
	let idx,data3d1=none;
	if($gameMap.isValid(mmx,mmy)){
		idx^=0;
		data3d1=$dataMap.data3d[idx+=w*mmy+mmx];
		// replace 'this._readMapData'
		let data=this._mapData;
		if(data){
			shadowBits |= data[(4*h+mmy)*w+mmx];
			upperTileId1 |= data[(1*h+(mmy===0&&this.verticalWrap?h:mmy)-1)*w+mmx];
		}
	}
	let lowerTiles = [];
	let upperTiles = [];
	if(this._readLastTiles(0,lx,ly)===data3d1){
		let container=this._readLastTiles(1,lx,ly);
		lowerTiles=container[0]; lowerTiles.length=container.lowerEnd;
		upperTiles=container[1];
		if(container.upperTileId1!==upperTileId1){
			container.upperTileId1=upperTileId1;
			if(this._isTableTile(upperTileId1) && !this._isTableTile(data3d1[2]^0) && !Tilemap.isShadowingTile(data3d1[3]^0)){
				lowerTiles[container.tableEdgeAt]=upperTileId1;
			}else lowerTiles[container.tableEdgeAt]=0;
		}
	}else{
		this._writeLastTiles(0,lx,ly,data3d1);
		let container=[lowerTiles,upperTiles];
		let tileId0 = data3d1[3]^0;
		let tileId1 = data3d1[2]^0;
		let tileId2 = data3d1[1]^0;
		let tileId3 = data3d1[0]^0;
		
		if(this._isHigherTile(tileId0)) upperTiles.push(tileId0);
		else lowerTiles.push(tileId0);
		if(this._isHigherTile(tileId1)) upperTiles.push(tileId1);
		else lowerTiles.push(tileId1);
		
		// shadow
		lowerTiles.push(-shadowBits);
		
		// table edge (upperTileId1)
		container.tableEdgeAt=lowerTiles.length;
		container.upperTileId1=upperTileId1;
		if(this._isTableTile(upperTileId1) && !this._isTableTile(tileId1) && !Tilemap.isShadowingTile(tileId0)){
			lowerTiles.push(tableEdgeVirtualId + upperTileId1);
		}else lowerTiles.push(0);
		
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
		
		container.lowerEnd=lowerTiles.length;
		this._writeLastTiles(1,lx,ly,container);
	}
	
	if(idx!==undefined) for(let x=0,arr=$dataMap.addLower[idx]||[];x!==arr.length;++x) if(!arr[x][3]||arr[x][3]()) lowerTiles.push(arr[x][0]);
	let lastLowerTiles = this._readLastTiles(2, lx, ly);
	if( ( ($dataMap.hasA1[idx]||$dataMap.hasA1_lower[idx]) && this._frameUpdated ) 
		|| !(lastLowerTiles===lowerTiles||lowerTiles.equals(lastLowerTiles)) 
	){
		this._lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
		for(let i=0;i!==lowerTiles.length;++i){
			let lowerTileId = lowerTiles[i];
			if(lowerTileId<0) this._drawShadow(this._lowerBitmap, shadowBits, dx, dy);
			else if(lowerTileId>=tableEdgeVirtualId) this._drawTableEdge(this._lowerBitmap, upperTileId1, dx, dy);
			else this._drawTile(this._lowerBitmap, lowerTileId, dx, dy);
		}
		this._writeLastTiles(2, lx, ly, lowerTiles);
	}
	
	let addUpper=(idx===undefined)?f._dummy_arr:$dataMap.addUpper[idx];
	
	if(this._z2Layers){
		let last=this._readLastTiles(3,lx,ly);
		if((addUpper.length!==0 && this._frameUpdated) || !last.equals(addUpper)){
			for(let x=0,idx=this._z2Layers_ys,arr=this._z2Layers_bitmaps;x!==idx.length;++x)
				arr[idx[x]].clearRect(dx, dy, this._tileWidth, this._tileHeight);
			for(let x=0,arr=addUpper;x!==arr.length;++x){
				let curr=arr[x];
				if(curr[3] && !curr[3]()) continue;
				let y=curr[2]; if(y===undefined) continue;
				this._drawTile(this._z2Layers_bitmaps[y], curr[0], dx, dy , curr[1]);
			}
			this._writeLastTiles(3, lx, ly, addUpper);
		}
	}
	
	let flag_drawAddUpper=($dataMap.hasA1_upper[idx] && this._frameUpdated) || !this._readLastTiles(5, lx, ly).equals(addUpper);
	let lastUpperTiles = this._readLastTiles(4, lx, ly);
	let lastPlayerNearby=upperTiles.playerNearby; upperTiles.playerNearby=$gamePlayer.dist2({x:mmx,y:mmy,dist2:true})===0;
	if( flag_drawAddUpper || lastPlayerNearby!==upperTiles.playerNearby 
		|| !(lastUpperTiles===upperTiles||upperTiles.equals(lastUpperTiles)) 
	){
		flag_drawAddUpper=true;
		this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
		for(let j=0,revealTp=upperTiles.playerNearby?Tilemap.revealTp:undefined;j!==upperTiles.length;++j) this._drawTile(this._upperBitmap, upperTiles[j], dx, dy , revealTp);
		this._writeLastTiles(4, lx, ly, upperTiles);
	}
	if(flag_drawAddUpper){
		this._writeLastTiles(5, lx, ly, addUpper);
		for(let x=0,arr=addUpper;x!==arr.length;++x){
			let curr=arr[x];
			if( curr[2]===undefined && (!curr[3]||curr[3]()) ) this._drawTile(this._upperBitmap, curr[0], dx, dy , curr[1]);
		}
	}
};
$pppp$._isHigherTile_id3=function(tileId0,tileId1,tileId2,tileId3){
	return this._isHigherTile(tileId3)||tileId3===tileId0||(tileId2===0&&tileId3>=384&&tileId3<452);
};
$pppp$._readLastTiles=function f(i, x, y){ // rewrite: prevent creating new array
	let array1 = this._lastTiles[i];
	if (array1) {
		let array2 = array1[y];
		if (array2) {
			let tiles = array2[x];
			if (tiles) {
				return tiles;
			}
		}
	}
	return f._dummy_arr;
};
$pppp$._drawTile=function(bitmap, tileId, dx, dy , tp){ // polling very slow (sparse)
	// debug code to find out tiles drawn counts:
	// rrrr=Tilemap.prototype._drawTile; dddd=Tilemap.prototype._drawTile=function f(b,t,x,y,p){if(!window['/tmp/'].cnt)window['/tmp/'].cnt={};cnt=window['/tmp/'].cnt; cnt[t]^=0;++cnt[t]; return f.ori.call(this,b,t,x,y,p);}; dddd.ori=rrrr;
	if(Tilemap.isVisibleTile(tileId)){
		if(tp!==undefined){ // transparent
			let ga=bitmap._context.globalAlpha;
			bitmap._context.globalAlpha=1-tp;
			if(Tilemap.isAutotile(tileId)) this._drawAutotile(bitmap, tileId, dx, dy);
			else this._drawNormalTile(bitmap, tileId, dx, dy);
			bitmap._context.globalAlpha=ga;
		}else{
			if(Tilemap.isAutotile(tileId)) this._drawAutotile(bitmap, tileId, dx, dy);
			else this._drawNormalTile(bitmap, tileId, dx, dy);
		}
	}
};
$pppp$._drawNormalTile=function(bitmap, tileId, dx, dy){
	//debug.log('Tilemap.prototype._drawNormalTile');
	//let w = this._tileWidth;
	//let h = this._tileHeight;
	//let sx = ( ((tileId>>4)&8)+(tileId&7) )*w;
	//let sy = ((tileId>>3)&15)*h;
	//let setNumber = Tilemap.tileAn[tileId]===5 ? 4 : (5+(tileId>>8));
	let source = this.bitmaps[ Tilemap.tileAn[tileId]===5 ? 4 : (5+(tileId>>8)) ];
	if(source){
		let w = this._tileWidth;
		let h = this._tileHeight;
		bitmap.blt(source, ( ((tileId>>4)&8)+(tileId&7) )*w, ((tileId>>3)&15)*h, w, h, dx, dy, w, h);
	}
};
$dddd$=$pppp$._drawAutotile=function f(bitmap, tileId, dx, dy){
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
	
	let setNumber=Tilemap.tileAn[tileId]^0;
	f.an[setNumber]();
	setNumber-=setNumber!==0;
	
	let table = f.autotileTable[shape];
	let source = this.bitmaps[setNumber];
	
	if(table && source){
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
				bitmap.blt(source, sx2, sy2, w1, h1,  dx1, dy1, w1, h1);
				dy1+=h1_;
				bitmap.blt(source, sx1, sy1, w1, h1_, dx1, dy1, w1, h1_);
			}else bitmap.blt(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
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
$aaaa$.tid2bid_normal=tileId=>Tilemap.tileAn[tileId]===5?4:(5+(tileId>>8));
$dddd$.an_ori=[
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
	},
	function(){ // A2
		this.bx = this.tx<<1;
		this.by = (this.ty - 2) * 3;
		this.isTable = this.flags[this.tid] & 0x80; // this._isTableTile(tileId);
	},
	function(){ // A3
		this.bx = this.tx<<1;
		this.by = (this.ty - 6)<<1;
		this.autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	},
	function(){ // A4
		this.bx = this.tx<<1;
		this.by = Math.floor((this.ty - 10) * 2.5 + ((this.ty&1) ? 0.5 : 0));
		if(this.ty&1) this.autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	},
	none,
];
$dddd$.an=$dddd$.an_ori.map(x=>x.bind($dddd$)); // let 'this' === $dddd$
$pppp$._drawTableEdge=function(bitmap, tileId, dx, dy){
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
$pppp$._drawShadow=function(bitmap, shadowBits, dx, dy){
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
$dddd$=$pppp$.renderCanvas=function f(renderer) {
	//debug.log('Tilemap.prototype.renderCanvas');
	// if not visible or the alpha is 0 then no need to render this
	if(!(this.visible && 0<this.worldAlpha && this.renderable)) return;
	//if(this._mask){ renderer.maskManager.pushMask(this._mask); console.log("?"); }
	//this._renderCanvas(renderer); // empty function
	if($gameScreen.limitedView){
		const ctx=renderer.context,p=this.player;
		ctx.save();
		ctx.fillStyle = '#000000';
		ctx.globalCompositeOperation='source-in';
		ctx.beginPath();
		ctx.arc(p.x,p.y,Game_Map.e*3,0,PI2);
		ctx.fill();
		ctx.globalCompositeOperation='source-atop';
		
		f.forEach.renderer=renderer;
		// do not render if a child is: 'Sprite_Character' and out of screen
		this.children.forEach(f.forEach,true); // faster // AVLTree.prototype.forEach
		
		ctx.restore();
	}else{
		f.forEach.renderer=renderer;
		// do not render if a child is: 'Sprite_Character' and out of screen
		this.children.forEach(f.forEach,true); // faster // AVLTree.prototype.forEach
	}
	//if(this._mask) renderer.maskManager.popMask(renderer);
};
$dddd$.forEach=function f(c){
	if(c.constructor===Sprite_Character){
		if(c._character._light){
			let ctx=f.renderer.context;
			let gco=ctx.globalCompositeOperation;
			ctx.globalCompositeOperation='source-over';
			c.renderCanvas(f.renderer);
			ctx.globalCompositeOperation=gco;
			return;
		}else if(c.isInView()) return c.renderCanvas(f.renderer);
	}else return c.renderCanvas(f.renderer);
	//if(c.constructor!==Sprite_Character || c.isInView()) return c.renderCanvas(f.renderer);
};
$rrrr$=$dddd$=$pppp$=$aaaa$=undef;

// - ShaderTilemap
$aaaa$=ShaderTilemap;
$pppp$=$aaaa$.prototype;
if(0){ // debugging an array usage
Object.defineProperties($aaaa$.prototype,{
	bitmaps:{ get:function(){debugger;return this._bms;},
		set:function(_rhs){
			debugger;
			this._bms={_data:_rhs};
			for(let x=0,arr=Object.getOwnPropertyNames(Array.prototype);x!==arr.length;++x){
				let p=arr[x],tmp={}; tmp[p]={
					get:function(){return this._data[p];},
					set:function(rhs){debugger;return this._data[p]=rhs;},
				};
				Object.defineProperties(this._bms,tmp);
			}
			for(let x=21;x--;){
				let i=x;
				let tmp={}; tmp[i]={
					get:function(){return this._data[i];},
					set:function(rhs){debugger;return this._data[i]=rhs;},
				};
				Object.defineProperties(this._bms,tmp);
			}
			debugger;
			return this._bms;
		},
	}
});
}
$dddd$=$pppp$._hackRenderer=function f(renderer){
	renderer.plugins.tilemap.tileAnim[0] = f.tbl[this.animationFrame&3] * this._tileWidth;
	renderer.plugins.tilemap.tileAnim[1] = (this.animationFrame % 3) * this._tileHeight;
	return renderer;
};
$dddd$.tbl=[0,1,2,1];
$pppp$.renderCanvas=function(renderer){
	this._hackRenderer(renderer);
	Tilemap.prototype.renderCanvas.call(this,renderer);
};
$dddd$=$pppp$.renderWebGL=function f(renderer) {
	this._hackRenderer(renderer);
	//PIXI.Container.prototype.renderWebGL.call(this, renderer);
	// if the object is not visible or the alpha is 0 then no need to render this element
	if (!(this.visible && 0<this.worldAlpha && this.renderable)) return;
	// do a quick check to see if this element has a mask or a filter.
	if (this._mask || this._filters) this.renderAdvancedWebGL(renderer); // not executed
	else {
		this._renderWebGL(renderer); // is empty func.
		
		// simple render children!
		f.forEach.renderer=renderer;
		this.children.forEach(f.forEach,true);
		
		if($gameScreen.limitedView) this._limitedView(renderer);
	}
};
$dddd$.forEach=function f(c){
	//if(!c._skipRender) c.renderWebGL(f.renderer); return;
	if(c.constructor===Sprite_Character){
		if(0&&c._character._light){
			let ctx=f.renderer.context;
			let gco=ctx.globalCompositeOperation;
			ctx.globalCompositeOperation='source-over';
			c.renderWebGL(f.renderer);
			ctx.globalCompositeOperation=gco;
			return;
		}else if(c.isInView()) return c.renderWebGL(f.renderer);
	}else return c.renderWebGL(f.renderer);
};
$dddd$=$pppp$._limitedView=function f(renderer){
	const gl=renderer.gl; if(!gl) return;
	const p=this.player;
	const old_ab=gl.getParameter(gl.ARRAY_BUFFER_BINDING);
	const old_abi=gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
	const old_prog=gl.getParameter(gl.CURRENT_PROGRAM);
	const old_attr=gl.getActiveAttrib(old_prog,0);
	const old_attr_idx=gl.getAttribLocation(old_prog,old_attr.name);
	const old_attr_size=gl.getVertexAttrib(old_attr_idx,gl.VERTEX_ATTRIB_ARRAY_SIZE);
	const old_attr_type=gl.getVertexAttrib(old_attr_idx,gl.VERTEX_ATTRIB_ARRAY_TYPE);
	const old_attr_isNorm=gl.getVertexAttrib(old_attr_idx,gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
	const old_attr_stride=gl.getVertexAttrib(old_attr_idx,gl.VERTEX_ATTRIB_ARRAY_STRIDE);
	const old_attr_offset=gl.getVertexAttribOffset(old_attr_idx,gl.VERTEX_ATTRIB_ARRAY_POINTER);
	
	if(!f.tbl.prog){
		const shaderV=f.tbl.shaderV||(f.tbl.shaderV=gl.createShader(gl.VERTEX_SHADER));
		const shaderF=f.tbl.shaderF||(f.tbl.shaderF=gl.createShader(gl.FRAGMENT_SHADER));

		gl.shaderSource(shaderV, f.tbl.shaderSrcV);
		gl.shaderSource(shaderF, f.tbl.shaderSrcF);

		gl.compileShader(shaderV);
		gl.compileShader(shaderF);

		const prog=f.tbl.prog=gl.createProgram();
		gl.attachShader(prog, shaderV); 
		gl.attachShader(prog, shaderF);
		gl.linkProgram(prog);

		gl.deleteShader(shaderV);
		gl.deleteShader(shaderF);

		if(f.tbl.glbuf){
		}else{
			f.tbl.glbuf_i =gl.createBuffer();
			f.tbl.glbuf   =gl.createBuffer();
		}
	}
	const prog=f.tbl.prog;
	gl.useProgram(prog);
	
	const ATTRIBUTES = 2 , data = [];
	const canvas=gl.canvas;
	{ let j = 0;
	data[j++] = 0;
	data[j++] = 0;
	
	data[j++] = canvas.width;
	data[j++] = 0;
	
	data[j++] = 0;
	data[j++] = canvas.height;
	
	data[j++] = canvas.width;
	data[j++] = canvas.height;
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, f.tbl.glbuf_i);
	gl.bindBuffer(gl.ARRAY_BUFFER, f.tbl.glbuf);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(f.tbl.idxv), gl.STATIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	const loc_reso = gl.getUniformLocation(prog, "u_resolution");
	const loc_cent = gl.getUniformLocation(prog, "u_center");
	const loc_radi = gl.getUniformLocation(prog, "u_radius");
	gl.uniform2f(loc_reso, canvas.width, canvas.height);
	gl.uniform2f(loc_cent, p.x, p.y);
	gl.uniform1f(loc_radi, p._character.viewRadius||0);
	
	const loc_posi = gl.getAttribLocation(prog, "a_position");
	if(!f.tbl.enabled){
		f.tbl.enabled=true;
		gl.enableVertexAttribArray(loc_posi);
	}
	gl.vertexAttribPointer(loc_posi, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
	
	gl.drawElements(gl.TRIANGLES, f.tbl.idxv.length, gl.UNSIGNED_SHORT, 0);
	if(objs.isDev && !f.tbl.firstErrPrinted) console.log(gl.getError())||(f.tbl.firstErrPrinted=1);
	
	// restore
	gl.useProgram(old_prog);
	//gl.disableVertexAttribArray(loc_posi);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, old_abi, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, old_ab, gl.STATIC_DRAW);
	//gl.vertexAttribPointer( gl.getAttribLocation(old_prog, old_attr.name) , old_attr.size , old_attr.type , false , 0 , 0);
	gl.vertexAttribPointer(old_attr_idx,old_attr_size,old_attr_type,old_attr_isNorm,old_attr_stride,old_attr_offset);
};
$dddd$.tbl={
	shaderSrcV:"uniform vec2 u_resolution;\nuniform vec2 u_center;\nuniform float u_radius;\n\nattribute vec2 a_position;\n\nvarying vec2 center;\nvarying vec2 resolution;\nvarying float radius;\n\nvoid main() {\n\tvec2 clipspace = a_position / u_resolution * 2.0 - 1.0;\n\tgl_Position = vec4(clipspace * vec2(1, -1), -1, 1);\n\t\n\tradius = u_radius;\n\tcenter = u_center;\n\tresolution = u_resolution;\n}",
	shaderSrcF:"precision mediump float;\n\nvarying vec2 center;\nvarying vec2 resolution;\nvarying float radius;\n\nvoid main() {\n\t\n\tfloat x = gl_FragCoord.x;\n\tfloat y = gl_FragCoord.y;\n\t\n\tfloat dx = center[0] - x;\n\tfloat dy = center[1] - y;\n\tfloat distance2 = dx*dx + dy*dy;\n\tfloat r2=radius*radius;\n\t\n\tif ( distance2 >= r2 ) gl_FragColor = vec4(0.0, 0.0, 0.0, "+(objs.isDev?"0.5":"1.0")+");\n\telse gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n\t\n}",
	shaderV:undefined,
	shaderF:undefined,
	idxv:[ 0,1,2, 1,2,3, ],
	glbuf:undefined,
	glbuf_i:undefined,
	ab:undefined,
	ab_i:undefined,
	prog:undefined,
	firstErrPrinted:false,
	enabled:false,
};
$dddd$=$pppp$.refreshTileset=function f(){
	let bitmaps=this.bitmaps.map(f.toPIXI);
	this.lowerLayer.setBitmaps(bitmaps);
	for(let x=0,idx=this.z2Layers_ys,arr=this.z2Layers;x!==idx.length;++x)
		for(let lv=0,lvs=arr[idx[x]].children;lv!==lvs.length;++lv)
			lvs[lv].setBitmaps(bitmaps);
	this.upperLayer.setBitmaps(bitmaps);
	for(let x=0,arr=this.upperLayer_a025s;x!==arr.length;++x) arr[x].setBitmaps(bitmaps);
};
$dddd$.toPIXI=bitmap=>bitmap._baseTexture?new PIXI.Texture(bitmap._baseTexture):bitmap;
$pppp$.updateTransform=function() {
	const startX = (this.origin.x - this._margin)/this._tileWidth  ^ 0;
	const startY = (this.origin.y - this._margin)/this._tileHeight ^ 0;
	this._updateLayerPositions(startX, startY);
	if (this._needsRepaint ||
		this._lastStartX !== startX || this._lastStartY !== startY) {
		this._lastStartX = startX;
		this._lastStartY = startY;
		this._paintAllTiles(startX, startY);
		this._needsRepaint = false;
	}
	this.updateTransform_tail();
};
$dddd$=$pppp$._createLayers=function f(){
	let width = this._width;
	let height = this._height;
	let margin = this._margin;
	//let tileCols = Math.ceil(width / this._tileWidth) + 1;
	//let tileRows = Math.ceil(height / this._tileHeight) + 1;
	let layerWidth = this._layerWidth = this._tileCols * this._tileWidth;
	let layerHeight = this._layerHeight = this._tileRows * this._tileHeight;
	this._needsRepaint = true;

	if (!this.lowerZLayer) {
		//@hackerham: create layers only in initialization. Doesn't depend on width/height
		let parameters = PluginManager.parameters('ShaderTilemap');
		let useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters['squareShader'] : 0);
		
		this.addChild(this.lowerZLayer = new PIXI.tilemap.ZLayer(this, 0));
		this.lowerZLayer.addChild(this.lowerLayer = new PIXI.tilemap.CompositeRectTileLayer(0, [], useSquareShader));
		this.lowerLayer.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
		
		this.z2Layers={};
		this.z2Layers_ys=[];
		let alphaDupCnt=5,addUpper_str=$dataMap.meta.addUpper;
		if(addUpper_str!==true && addUpper_str){
			// a025 when .z===3
			let addUppers=JSON.parse(addUpper_str);
			// this.z2Layers[y]
			const ys=this.z2Layers_ys,lvs=this.z2Layers,ySet=new Set();
			for(let x=0,arr=addUppers;x!==arr.length;++x){
				const y=arr[x].y;
				if(y===undefined || ySet.has(y)) continue;
				ySet.add(y);
				ys.push(y);
			}
			ys.sortn();
			for(let j=0,th=Game_Map.prototype.tileHeight();j!==ys.length;++j){
				const y=ys[j];
				if(lvs[y]) continue;
				const lv=lvs[y]=new PIXI.tilemap.ZLayer(this, 3);
				lv.oy=y*th+((th>>1)|1);
				lv.z2=4; // same as 'this.upperZLayer'
				this.addChild(lv);
				for(let x=0,t;x!==alphaDupCnt;++x){
					lv.addChild( t = new PIXI.tilemap.CompositeRectTileLayer(4+x, [], useSquareShader) );
					t.alpha=0.25;
				}
				lv.addChild( lv.children.a1 = new PIXI.tilemap.CompositeRectTileLayer(4, [], useSquareShader) );
			}
		}
		
		this.addChild(this.upperZLayer = new PIXI.tilemap.ZLayer(this, 4));
		this.upperZLayer.addChild(this.upperLayer = new PIXI.tilemap.CompositeRectTileLayer(4, [], useSquareShader));
		// upZ a025
		const arr=this.upperLayer_a025s=[];
		for(let x=0;x!==alphaDupCnt;++x){
			this.upperZLayer.addChild(arr[x] = new PIXI.tilemap.CompositeRectTileLayer(5+x, [], useSquareShader));
			arr[x].alpha=0.25;
		}
		arr.a1=this.upperLayer;
	}
};
$rrrr$=$pppp$._updateLayerPositions;
$dddd$=$pppp$._updateLayerPositions=function f(){
	// f(startX, startY)
	f.ori.apply(this,arguments);
	for(let x=0,pos=this.lowerZLayer.position,idx=this.z2Layers_ys,arr=this.z2Layers;x!==idx.length;++x){
		let curr=arr[idx[x]];
		curr.position.x=pos.x;
		curr.position.y=pos.y;
	}
}; $dddd$.ori=$rrrr$;
$pppp$._paintAllTiles=function(startX, startY){
	this.lowerZLayer.clear(); // z=0 // this.lowerZLayer.children[0]===this.lowerLayer
	for(let x=0,idx=this.z2Layers_ys,arr=this.z2Layers;x!==idx.length;++x)
		arr[idx[x]].clear(); // z=3
	this.upperZLayer.clear(); // z=4
	return Tilemap.prototype._paintAllTiles.call(this,startX,startY); // ShaderTilemap has no 'this._z2Layers'
	//for(let y=0,ys=this._tileRows,xs=this._tileCols;y!==ys;++y) for(let x=0;x!==xs;++x) this._paintTiles(startX, startY, x, y);
};
$d$=$pppp$._paintTiles=function f(startX, startY, x, y){
	//debug.log('ShaderTilemap.prototype._paintTiles');
	// startX = $gameMap._displayX_tw/$gameMap.tileWidth()^0
	// startY = $gameMap._displayY_th/$gameMap.tileHeight()^0
	let mx = startX + x;
	let my = startY + y;
	let dx = x * this._tileWidth, dy = y * this._tileHeight;
	let idx,data3d1=none;
	{
		let x=this.horizontalWrap?mx%this._mapWidth:mx;
		let y=this.verticalWrap?my%this._mapHeight:my;
		if($gameMap.isValid(x,y)){
			idx^=0;
			data3d1=$dataMap.data3d[idx+=this._mapWidth*y+x];
		}
	}
	let tileId0 = data3d1[3]^0;
	let tileId1 = data3d1[2]^0;
	let tileId2 = data3d1[1]^0;
	let tileId3 = data3d1[0]^0;
	let shadowBits = this._readMapData(mx, my, 4);
	let upperTileId1 = this._readMapData(mx, my - 1, 1);
	let lowerLayer = this.lowerLayer.children[0];
	let upperLayer = this.upperLayer.children[0];
	let layers=this.upperLayer_a025s,revealTransparency=Tilemap.revealTp;
	let isNearPlayer=$gamePlayer.dist2({x:mx,y:my,dist2:true})===0;
	
	if (this._isHigherTile(tileId0)) {
		if(isNearPlayer) this._drawTile_byTp(layers, tileId0, dx, dy, revealTransparency);
		else this._drawTile(upperLayer, tileId0, dx, dy);
	} else {
		this._drawTile(lowerLayer, tileId0, dx, dy);
	}
	if (this._isHigherTile(tileId1)) {
		if(isNearPlayer) this._drawTile_byTp(layers, tileId1, dx, dy, revealTransparency);
		else this._drawTile(upperLayer, tileId1, dx, dy);
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
		if(isNearPlayer){
			this._drawTile_byTp(layers, tileId2, dx, dy, revealTransparency);
			this._drawTile_byTp(layers, tileId3, dx, dy, revealTransparency);
		}else{
			this._drawTile(upperLayer, tileId2, dx, dy);
			this._drawTile(upperLayer, tileId3, dx, dy);
		}
	} else {
		if (this._isHigherTile(tileId2)) {
			if(isNearPlayer) this._drawTile_byTp(layers, tileId2, dx, dy, revealTransparency);
			else this._drawTile(upperLayer, tileId2, dx, dy);
		} else {
			this._drawTile(lowerLayer, tileId2, dx, dy);
		}
		if(this._isHigherTile_id3(tileId0,tileId1,tileId2,tileId3)){
			if(isNearPlayer) this._drawTile_byTp(layers, tileId3, dx, dy, revealTransparency);
			else this._drawTile(upperLayer, tileId3, dx, dy);
		} else {
			this._drawTile(lowerLayer, tileId3, dx, dy);
		}
	}
	// from meta
	if(idx!==undefined){
		for(let x=0,arr=$dataMap.addLower[idx];x!==arr.length;++x){
			const curr=arr[x]; if(!curr[3]||curr[3]()) this._drawTile(lowerLayer, curr[0], dx, dy);
		}
		for(let x=0,arr=$dataMap.addUpper[idx];x!==arr.length;++x){
			const curr=arr[x];
			if( curr[3] && !curr[3]()) continue;
			const lvs=(curr[2]===undefined)?layers:(this.z2Layers[curr[2]]||f.tmp).children;
			if(lvs) this._drawTile_byTp(lvs, curr[0], dx, dy , curr[1]);
		}
	}
};
$d$.tmp={children:undefined};
$pppp$._drawTile_byTp=function(layers,tid,dx,dy,tp){
	if(!tid) return;
	tp*=64; tp|=0;
	//tp=window['/tmp/'].pad^0; // debug
	if(0>=tp) return this._drawTile(layers.a1||layers[0].children[0],tid,dx,dy);
	else if(tp>=64) return;
	tp/=64.0;
	let baseLen=$gameMap.tileset().tilesetNames.length||9,drawCnt=0,mul=1,lastDist=1-tp; lastDist*=lastDist;
	for(let x=this.upperLayer_a025s.length;x--;){
		mul*=1-0.25;
		let dist=mul-tp; dist*=dist;
		if(dist<lastDist) lastDist=dist;
		else break;
		++drawCnt;
	}
	drawCnt+=drawCnt===0;
	if(objs.test_webglTilemapAlpha) for(let x=0;x!==drawCnt;++x) this._drawTile(layers[x].children[0],tid,dx,dy);
	else for(let x=0;x!==drawCnt;++x) this._drawTile(layers[x].children[0],tid,dx,dy,baseLen);
};
$rrrr$=$pppp$._drawTile;
$dddd$=$pppp$._drawTile=function f(layer, tileId, dx, dy , altShift){ // polling very fast (frequent)
	//debug.log('ShaderTilemap.prototype._drawTile');
	if (Tilemap.isVisibleTile(tileId)) {
		if (Tilemap.isAutotile(tileId)) {
			this._drawAutotile(layer, tileId, dx, dy , altShift);
		} else {
			this._drawNormalTile(layer, tileId, dx, dy , altShift);
		}
	}
}; $dddd$.ori=$rrrr$;
$pppp$._drawNormalTile=function(layer, tileId, dx, dy , altShift){
	//debug.log('ShaderTilemap.prototype._drawNormalTile');
	
	let w = this._tileWidth;
	let h = this._tileHeight;
	//let sx = ( ((tileId>>4)&8)+(tileId&7) )*w;
	//let sy = ((tileId>>3)&15)*h;
	let setNumber=Tilemap.tileAn[tileId]===5?4:( 5+(tileId>>8) );
	altShift^=0;
	layer.addRect( setNumber+altShift, 
		( ((tileId>>4)&8)+(tileId&7) )*w, ((tileId>>3)&15)*h, 
		dx, dy, w, h
	);
};
$pppp$._drawAutotile = function(layer, tileId, dx, dy , altShift) {
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
	
	switch(Tilemap.tileAn[tileId]){
	default: break;
	case 1:
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
	break;
	case 2:
		setNumber = 1;
		bx = tx<<1;
		by = (ty - 2) * 3;
		isTable = this._isTableTile(tileId);
	break;
	case 3:
		setNumber = 2;
		bx = tx<<1;
		by = (ty - 6)<<1;
		autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	break;
	case 4:
		setNumber = 3;
		bx = tx<<1;
		by = Math.floor((ty - 10) * 2.5 + ((ty&1)? 0.5 : 0));
		if(ty&1) autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	break;
	}
	
	let table = autotileTable[shape];
	let w1 = this._tileWidth_; // 48>>1
	let h1 = this._tileHeight_; // 48>>1
	altShift^=0;
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
			layer.addRect(setNumber+altShift, sx2, sy2, dx1, dy1,     w1, h1,  animX, animY);
			layer.addRect(setNumber+altShift, sx1, sy1, dx1, dy1+h1_, w1, h1_, animX, animY);
		}else layer.addRect(setNumber+altShift, sx1, sy1, dx1, dy1, w1, h1, animX, animY);
	}}
};
$pppp$._drawTableEdge=function(layer, tileId, dx, dy){
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
$pppp$._drawShadow=function(layer, shadowBits, dx, dy){
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
$rrrr$=$dddd$=$pppp$=$aaaa$=undef;


// --- --- BEG debugging --- --- 



$rrrr$=$dddd$=$pppp$=$aaaa$=undef;
// --- --- END debugging --- --- 

if(objs.isDev) console.log("obj_t0-tilemap");
