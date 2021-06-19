"use strict";

if(!window.objs) window.objs={};

(()=>{ // strt
const rpgskills=window.rpgskills=objs.rpgskills={func:{},list:{},filter:{}};

let arr=[1];
const add=(src)=>{
	let itvl=setInterval(()=>{
		if(window['$dataCustom'] && arr.back){
			addScript("js2/rpgskills/"+src+".js");
			clearInterval(itvl);
		}
	},100);
};

add("agold404");
add("more");
add("tester");
add("filter");
add("reflect");
// end
})();
