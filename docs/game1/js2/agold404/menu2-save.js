"use strict";
// CustomMenu2-SaveOpts

(()=>{

const scname="Scene_AltSave";
const ENUM_SCTYPE_EDITLABEL=0;
const ENUM_SCTYPE_DELETE=1;
const ENUM_SCTYPE_SAVELOCAL_BASE64=2;
const ENUM_SCTYPE_SAVELOCAL_BINARY=3;
const optKey='key-edtSaveName';
//const optLoadLocal='key-loadLocal';
const optSaveLocal='key-saveLocal';
const optDelete='key-delete';
let sctype=0;

// - Scene_SaveOpts
function Scene_SaveOpts(){
	this.initialize.apply(this, arguments);
};
$aaaa$=Scene_SaveOpts;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Scene_CustomMenu2.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$dddd$=$aaaa$.prototype.createOptionsWindow=function f(){
	//debug.log('Scene_OnlineSaves.prototype.createOptionsWindow');
	const notLM=!StorageManager.isLocalMode();
	const d=$dataCustom.optSave;
	const list=(f.tbl===notLM&&f.list)||(f.list=[
		[d.saveCurr,";;func;call",0,()=>SceneManager.push(Scene_Save)],
		[d.editLabel,";;func;call",1,()=>{
			SoundManager.playOk();
			sctype=ENUM_SCTYPE_EDITLABEL;
			SceneManager.push(window[scname]);
		}],
		[d.dl_b64,";;func;call",notLM,()=>{
			SoundManager.playOk();
			sctype=ENUM_SCTYPE_SAVELOCAL_BASE64;
			SceneManager.push(window[scname]);
		}],
		[d.dl_bin,";;func;call",notLM,()=>{
			SoundManager.playOk();
			sctype=ENUM_SCTYPE_SAVELOCAL_BINARY;
			SceneManager.push(window[scname]);
		}],
//		["下載存檔 (現在狀態)",";;func;call",notLM,()=>{}],
		[d.delSave,";;func;call",notLM,()=>{
			SoundManager.playOk();
			sctype=ENUM_SCTYPE_DELETE;
			SceneManager.push(window[scname]);
		}],
	]);
	f.tbl=notLM;
	list[0][2]=!!$gamePlayer;
	this._window = new Window_CustomMenu_main(0,0,list,{statusWidth:()=>360});
	this.logSel(this._window);
	this._window.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._window);
};
$dddd$.tbl=undefined;
$dddd$=$rrrr$=$aaaa$=undef; // END Scene_ChatOnline

// - Scene_AltSave

let skip=0;
const clearInputs=()=>{
	Input.clear();
	Input.update();
	TouchInput.update();
},clear=e=>{
	if(e){
		//e.stopImmediatePropagation(); // though it's better, e is changed when calling 'click()' from keydown
		e.preventDefault();
	}
	clearInputs();
	Input.skip(skip);
};

// window[scname]
{
const a=window[scname]=function(){
	this.initialize.apply(this,arguments);
};
const p=a.prototype=Object.create(Scene_File.prototype);
p.constructor=a;
{ const k='create';
const r=p[k];
p[k]=function(){
	r.apply(this,arguments);
	this._gi=JSON.parse(StorageManager.load(0)||"[]");
	const d=$dataCustom.optSave;
	let txt;
	switch(sctype){
	case ENUM_SCTYPE_EDITLABEL:
		txt=d.editLabel;
	break;
	case ENUM_SCTYPE_DELETE:
		txt=d.delSave;
	break;
	case ENUM_SCTYPE_SAVELOCAL_BASE64:
		txt=d.dl_b64;
	break;
	case ENUM_SCTYPE_SAVELOCAL_BINARY:
		txt=d.dl_bin;
	break;
	}
	if(txt) this._helpWindow.setText(txt);
};
}
{ const k='onSavefileOk';
p[k]=function f(){
	const id=this.savefileId();
	let succ=1;
	const obj=this._gi[id];
	if(obj){
		const gc=d.ge('GameCanvas');
		if(gc){
			const self=this;
			const stl=gc.ga('style');
			let div,css;
			{ const id='editSaveName';
			div=d.ge(id);
			if(div) (css=div.rf(0).style).display="block";
			else{
				gc.parentNode.ac(div=d.ce('div').sa('style',stl).sa('id',id));
				css=div.style;
				css.backgroundColor="rgba(255,255,255,0.75)";
				css.fontSize="32px";
				css.padding="16px";
				css.zIndex=1<<12;
			}
			}
			const input=d.ce('input').sa('tabindex',1).sa('style',"position:relative;display:block;left:0px;right:0px;font-size:32px;");
			const btn=d.ce('button').at('confirm').sa('tabindex',3).sa('style','font-size:32px;');
			btn.useDefault=true;
			const cancel=d.ce('button').at('cancel').sa('tabindex',2).sa('style','font-size:32px;');
			const backToLastWindow=cancel.onclick=e=>{
				btn.onclick=null;
				css.display="none";
				clear(e);
				self.activateListWindow();
				$gameTemp._inputting=false;
			};
			let infostring;
			switch(sctype){
			default: infostring='ERROR. please click "confirm"';
				btn.onclick=backToLastWindow;
			break;
			case ENUM_SCTYPE_EDITLABEL:
				infostring="input save name for save "+id;
				input.value=obj.label||'';
				btn.onclick=function(e){
					obj.label=input.value;
					setTimeout(()=>StorageManager.save(0,JSON.stringify(self._gi)),1);
					backToLastWindow(e);
					self._listWindow.refresh();
				};
			break;
			case ENUM_SCTYPE_DELETE:
				infostring="ARE YOU SURE TO DELETE save "+id+" ?";
				input.style.display="none";
				btn.onclick=function(e){
					self._gi[id]=null;
					setTimeout(()=>{
						StorageManager.save(id);
						StorageManager.save(0,JSON.stringify(self._gi))
					},1);
					backToLastWindow(e);
					self._listWindow.refresh();
				};
				div.onkeydown=e=>{ if(e.keyCode===27){ skip=1; backToLastWindow(e); }; };
			break;
			case ENUM_SCTYPE_SAVELOCAL_BASE64:
				infostring='input a file name for download';
				input.value="save-"+id+".rpgsave";
				btn.onclick=function(e){
					d.ce('a').sa('download',input.value).sa('href',"data:application/plain,"+LZString.compressToBase64(StorageManager.load(id))).sa('target','_blank').click();
					$gameMessage.popup("正在下載 "+input.value+" ...",1);
					backToLastWindow(e);
					self._listWindow.refresh();
				};
			break;
			case ENUM_SCTYPE_SAVELOCAL_BINARY:
				infostring='input a file name for download';
				input.value="save-"+id;
				btn.onclick=function(e){
					SoundManager.playOk();
					d.ce('a').sa('download',input.value).sa('href', "data:application/oct-stream;base64,"+localStorage.getItem(StorageManager.webStorageKey(id)) ).sa('target','_blank').click();
					$gameMessage.popup("正在下載 "+input.value+" ...",1);
					backToLastWindow(e);
					self._listWindow.refresh();
				};
			break;
			}
			if(!f.pads) for(let x=2,arr=f.pads=[];x--;) arr.push(d.ce('div').sa('style',"display:inline-block;width:16px;"));
			div.ac(d.ce('div').ac(d.ce('div').at(infostring)).ac(input).ac(cancel).ac(f.pads[1]).ac(btn));
			{ const btns=[btn,cancel],w=Math.max.apply(null,btns.map(x=>x.clientWidth))+1;
			btns.forEach(x=>x.style.width=w+'px');
			};
			input.onkeydown=e=>{ switch(e.keyCode){
			case 13:
				skip=1;
				btn.click(e);
			break;
			case 27:
				skip=1;
				backToLastWindow(e);
			break;
			} };
			$gameTemp._inputting=input.useDefault=true;
			skip=0;
			if(input.style.display==="none") cancel.focus();
			else input.focus();
		}else succ=0;
	}else succ=0;
	if(succ) return SoundManager.playOk();
	SoundManager.playBuzzer();
	this.activateListWindow();
};
}
} // END window[scname]

$dddd$=$rrrr$=$aaaa$=undef; // END Scene_AltSave

})();
