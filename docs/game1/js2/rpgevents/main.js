"use strict";

const rpgevts={func:{},list:{},item:{},shop:{}};

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

add("items");
add("shops");
// end
})();
