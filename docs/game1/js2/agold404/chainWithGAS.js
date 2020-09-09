"use strict";

if(location.protocol==="https:"){
	let i=d.ce('iframe').sa('class',"outofscreen tiny");
	i.onload=function(e){
		window.gasStat='ok';
		debug.log('onload',e);
	};
	i.onerror=function(e){
		window.gasStat='fail';
		debug.log('onerror',e);
	};
	d.body.ac(i.sa('src',"https://script.google.com/macros/s/AKfycbxHFtKAoVr8gqbHOzkAzeB025NII1XERngjCh6C2KspL94Wx5I/exec"));
}
window.addEventListener("message",function f(evt){
	debug.log('window.event:message');
	debug.log('',evt);
	if(f.orig!==undefined&&f.orig!==evt.origin) return;
	let ed=evt.data; if(ed===undefined||ed===null) ed={};
	switch(ed.cmd){
		default: if(debug&&debug.log&&debug.log.constructor===Function) debug.log(evt); break;
		case 'echo': {
			evt.source.postMessage({cmd:"echoBack",data:ed.data},evt.origin);
		}break;
		case 'resultFileContent': {
			if(ed.err){ SceneManager.goto(Scene_OnlineLoadFail);
				if(0)SceneManager.addWindowB(new Window_CustomMenu_main(0,0,[
					["讀取失敗",";;func;call",1,()=>{SceneManager.pop();}],
				]),undef,0);
			}else{
				DataManager.loadGame.cache.add(ed.key,ed.data);
				DataManager.loadGame('callback',ed.key,ed.data);
			}
		}break;
		case 'resultFileId': {
			debug.log(ed.data);
			if(ed.err) $gameMessage.popup("儲存失敗");
			else{
				$gameMessage.popup("儲存成功");
				$gamePlayer.addOnlineSaveId(ed.data);
			}
		}break;
		case 'queryHost': {
			let t=evt.source.parent.parent;
			if(t.window!==window && t.parent.window===window) f.orig=evt.origin;
			evt.source.postMessage({cmd:"setIframe",data:location.pathname},evt.origin);
		}break;
	}
	debug.log(f.orig);
});
