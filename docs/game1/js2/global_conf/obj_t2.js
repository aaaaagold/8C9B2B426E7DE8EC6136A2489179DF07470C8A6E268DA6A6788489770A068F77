"use strict";

// head

addScript("js2/agold404/main.js");
if(!window.objs) window.objs={};


// trim obj_t

ImageManager._imageCache   = new ImageCache();
ImageManager._requestQueue = new RequestQueue();


// objs.*

objs.new_Game_Event_max=2047;
objs.new_Game_Event=(mapid,evtid)=>{
	let tmp;
	if(!(tmp=$gameTemp.get('pool-evt'))) $gameTemp.set('pool-evt',tmp=new Queue());
	const q=tmp,currmapid=$gameMap&&$gameMap._mapId;
	// '$gameTemp._mapSerial' is set by 'Game_Map.prototype.setupEvents'
	if(q.front===$gameTemp._mapSerial) tmp=new Game_Event(mapid,evtid);
	else{
		tmp=0;
		while(tmp.constructor!==Game_Event&&q.length){
			tmp=q.front;
			if(tmp===$gameTemp._mapSerial) break;
			else q.pop();
		}
		if(tmp.constructor===Game_Event) tmp.initialize(mapid,evtid);
		else tmp=new Game_Event(mapid,evtid);
	}
		q.push(tmp);
		if(q.length>=objs.new_Game_Event_max){
			const tmp=q.front;
			q.pop();
			if(tmp.constructor===Number&&q.front.constructor!==Number) q.front=tmp;
		}
		return tmp;
};

objs.new_Game_Interpreter=()=>{ // not cleared, DIY!
	let tmp;
	if(!(tmp=$gameTemp.get('pool-itrp'))) $gameTemp.set('pool-itrp',tmp=[]);
	tmp=tmp.length?tmp.pop():new Game_Interpreter();
	return tmp;
};
objs.delete_Game_Interpreter=itrp=>{ // cleared
	let tmp;
	if(!(tmp=$gameTemp.get('pool-itrp'))) $gameTemp.set('pool-itrp',tmp=[]);
	if(itrp && itrp.constructor===Game_Interpreter){
		itrp.clear();
		tmp.push(itrp);
	}
};

objs.rndmusic=(cnt)=>{
	cnt=cnt||1e3;
	let arr=[(~~(Math.random()*13))-9,''],rcnt=0,rarr=[]; for(let x=cnt;x--;){
		if(arr.length>=8 && Math.random()<0.5){
			let S,L;
			if(rarr.length>2 && Math.random()<0.125){
				const info=rarr.slice(0,-2).rnd();
				S=info[0]-info[1]; L=info[1];
			}else S = arr.length>=16&&Math.random()<0.5?-16:-8;
			const tmp=arr.slice(S,L);
			rcnt+=tmp.length>>3;
			arr=arr.concat(tmp);
			if(Math.random()<0.25) arr[arr.length-2]='';
			else if(Math.random()<0.5){
				if(arr[arr.length-2]==='') arr[arr.length-2]=Math.random()<0.5?(arr[arr.length-2-8]===0?0:(arr[arr.length-2-8]||'')):((~~(Math.random()*21))-13);
				else arr[arr.length-2]+=(~~(Math.random()*7))-3;
			}
		}else{
			if(rcnt>2) rarr.push([arr.length,rcnt<<3]);
			rcnt=0;
			if(Math.random()<0.25&&arr[arr.length-2]!=='') arr.push(arr[arr.length-2]+(~~(Math.random()*7))-3);
			else arr.push(~~(Math.random()*21)-13);
			arr.push('');
		}
	}
	return arr;
};

objs._mods=new Set();
objs.addExtModuleViaUrl=(url,forced,callback_onloaded)=>{
	const f=callback_onloaded;
	if(!forced && objs._mods.has(url)){ f(); return true; }
	if(url.indexOf("#")===-1) url+="#";
	const scr=d.ce('script');
	scr.onload=()=>{
		scr.onload=null;
		objs._mods.add(url);
		if(f && f.constructor===Function) f();
	};
	if(objs.addScriptViaSrc) objs.addScriptViaSrc(scr,url);
	else d.body.ac(scr.sa('src',url));
};
objs.addExtModuleViaTxt=objs._doFlow;

// --- --- BEG debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

$rrrr$=$r$=$dddd$=$d$=$kkkk$=$k$=$pppp$=$aaaa$=$tttt$=$t$=undef; // t
// --- --- END debugging --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
