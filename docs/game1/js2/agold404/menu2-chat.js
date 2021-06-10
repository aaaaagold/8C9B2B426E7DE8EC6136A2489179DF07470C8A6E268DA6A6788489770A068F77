"use strict";
// CustomMenu2-store

// - Scene_ChatOnline
function Scene_ChatOnline(){
	this.initialize.apply(this, arguments);
};
$aaaa$=Scene_ChatOnline;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create( ((typeof Scene_CustomMenu2==='undefined')?(function(){}):Scene_CustomMenu2) .prototype);
$aaaa$.prototype.constructor = $aaaa$;
$aaaa$.prototype.terminate=()=>{
	Input.clear();
	Input.update();
};
$aaaa$.prototype.createOptionsWindow=function f(){
	debug.log('Scene_ChatOnline.prototype.createOptionsWindow');
	const self=this,fb=objs&&objs.firebase||firebase;
	let list=[];
	try{
		if(this!==window) this._window = new Window_CustomMenu_main(0,0,list);
	}catch(e){
		this._window=undefined;
	}
	//this.logSel(this._window);
	const _bgc='background-color:rgba(234,234,234,';
	const bgc=_bgc+'0.25);';
	const bgcB=_bgc+'0.5);';
	const mx='abs nobound toedge';
	const bound=d.ce('div').sa('class',mx).sa('style','z-index:64;padding:11px;color:#000000;'+bgc);
	const root=d.ce('div').sa('class',mx).sa('style','z-index:64;margin:11px;padding:0px;color:#000000;'+bgc);
	root.canScroll=true;
	d.ge('UpperDiv').ac(bound.ac(root));
	const theTop=bound;
	let inputNewName;
	const exitAlt="Add your nickname";
	const edtName=()=>{
		if(!inputNewName){
			const btn=d.ce('button').sa('class','maxH CC').at("confirm");
			const btn_cancel=d.ce('button').sa('class','maxH CC').at("cancel");
			const btn_current=d.ce('button').sa('class','maxH CC').at("current");
			const txtin=d.ce('input').sa('placeholder','add your nickname');
			bound.ac(inputNewName=d.ce('div').sa('class','abs nobound CC').sa('style',"z-index:65;height:36px;left:0px;right:0px;"+_bgc+"0.875);").ac(
				d.ce('div').sa('class','maxW CC').ac(txtin).ac(btn).ac(btn_cancel).ac(btn_current)
			));
			inputNewName.in=txtin;
			const hide=()=>{
				inputNewName.style.display="none";
				typing.focus();
			}
			btn.onclick=()=>{
				chatName=txtin.value;
				exit.rf(0).at(exitAlt+" (current: "+chatName+")");
				hide();
			};
			btn_cancel.onclick=hide;
			btn_current.onclick=()=>{
				inputNewName.in.value=chatName||"";
				inputNewName.in.focus();
			}
			txtin.onkeydown=e=>{
				switch(e.keyCode){
				case 13:{
					btn.click();
					e.preventDefault();
				}break;
				case 27: return hide();
				}
			};
		}
		inputNewName.style.display="block";
		inputNewName.in.focus();
	};
	const bye=()=>{
		d.ge('div999').style.display="";
		theTop.parentNode.removeChild(theTop);
		fb.dconn();
		if(this._window){
			this.popScene();
			SceneManager._resuming=false;
			SceneManager.resume();
		}
	};
	const head=d.ce('div').sa('class','abs nobound CC maxW').sa('style','height:36px;font-size:24px;');
	const isFromGame=(typeof $dataCustom!=='undefined');
	const exit=d.ce('button').sa('class','maxH CC').at(isFromGame?$dataCustom.useEscOrClickHereToExit:exitAlt);
	head.ac(exit);
	exit.canScroll=true;
	exit.alwaysPause=true;
	exit.onclick=function(){
		if(!isFromGame) return edtName();
		this.onclick=null;
		bye();
	};
	const body=d.ce('div').sa('class','abs nobound maxW').sa('style','user-select:text;overflow:scroll;top:36px;bottom:64px;font-size:24px;'+bgcB);
	body.tabIndex=404;
	body.canScroll=true;
	body.alwaysPause=true;
	const LOADING=d.ce('div').ac(d.ce('div').at('Connecting...')).sa('class','CC');
	body.ac(LOADING);
	const loaded=new Map();
	const addNewMsg=o=>{
		const v=o&&o.val(); if(!v||!(v.t>=fb.joinTime)) return;
		const k=o&&o.key; if(loaded.get(k)===v.t) return;
		const div=d.ce('div');
		const border='border-bottom:1px solid rgba(0,0,0,0.5);';
		if(!isNone(v.n)) div.ac(
			d.ce('pre').sa('class','nobound').sa('style',border).at(v.n)
		);
		div.ac(
			d.ce('pre').sa('class','nobound').sa('style',border).at(v.d)
		).ac(
			d.ce('pre').sa('class','nobound').sa('style','text-align:right;').at(new Date(v.t).toFormat())
		).sa('style','border:2px solid rgba(0,0,0,0.5);');
		loaded.set(div.key=k,v.t);
		const arr=body.childNodes;
		if(arr.length){
			const child=arr[Array.prototype.lower_bound.call(arr,k,x=>x.key)];
			if(child) body.insertBefore(div,child);
			else body.ac(div);
		}else body.ac(div);
		body.scrollBy(undefined,1<<30);
	};
	const LOADING_done=()=>{
		let tmp=LOADING.parentNode;
		if(tmp) tmp.removeChild(LOADING);
		fb.init({onadded:addNewMsg,oninited:0});
	};
	fb.conn();
	if(fb.isconn()) LOADING_done();
	else fb.init({oninited:LOADING_done});
	const foot=d.ce('div').sa('class','childInline abs nobound maxW').sa('style','bottom:0px;height:64px;font-size:24px;');
	const sendBtn=d.ce('button').sa('class','nobound CC abs maxH').sa('style','border:2px solid white;padding:4px;left:0px;top:0px;width:123px;').at('send');
	sendBtn.canScroll=true;
	sendBtn.alwaysPause=true;
	const typing=d.ce('textarea').sa('class','abs nobound toedge maxH maxW txtin').sa('style','overflow:scroll;');
	typing.useDefault=true;
	typing.alwaysPause=true;
	let chatName=(typeof $gameSystem!=='undefined')&&$gameSystem._usr._chatName||null;
	sendBtn.onclick=()=>{
		if(typing.value){
			if(LOADING.parentNode){ LOADING.ac(d.ce('div').at("Not connected yet")); return; }
			fb.postMsg(0,typing.value,chatName);
			typing.value='';
		}
		typing.focus();
	};
	const keyStat=[];
	typing.onkeyup=e=>keyStat[e.keyCode]=0;
	typing.onkeydown=e=>{
		if(e.keyCode===13 && !keyStat[16]){
			sendBtn.click();
			e.preventDefault();
		}
		keyStat[e.keyCode]=1;
	};
	foot.ac(sendBtn).ac(d.ce('div').ac(typing).sa('class','abs nobound toedge maxH').sa('style','left:135px;'));
	root.ac(head).ac(body).ac(foot).onkeydown=function(e){
		if(e.keyCode===27){
			if(!isFromGame) return 0&&edtName();
			this.onkeydown=null;
			e.preventDefault();
			bye();
		}
	};
	//this._window.setHandler('cancel',this.popScene.bind(this));
	//this._window.statusWidth=()=>{return 240;};
	if(this && this._window){
		this._window.alpha=0;
		if(this.addWindow) this.addWindow(this._window);
		SceneManager.stop();
		SceneManager._resuming=true;
		d.ge('div999').style.display="none";
	}
	typing.focus();
};
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_ChatOnline

