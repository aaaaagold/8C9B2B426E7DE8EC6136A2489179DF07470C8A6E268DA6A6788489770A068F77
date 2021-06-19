"use strict";

if(!window.objs) window.objs={};

const rpgevts=objs.rpgevts=window.rpgevts={func:{},list:{},achievement:{},auto:{},item:{},shop:{},interact:{}};

(()=>{ // strt
let arr=[1];
const add=(src)=>{
	let itvl=setInterval(()=>{
		if(window['$dataCustom'] && arr.back){
			addScript("js2/rpgevents/"+src+".js");
			clearInterval(itvl);
		}
	},100);
};

add("list");
add("achievement");
add("auto");
add("items");
add("shops");
add("interact");
// end
})();
