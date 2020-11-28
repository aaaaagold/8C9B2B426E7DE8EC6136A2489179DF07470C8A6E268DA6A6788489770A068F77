"use strict";

const rpgskills=window.rpgskills={func:{},list:{},handleRank:{
	easy:[0,5,5], // rankMin, rankMax, levelUp needed count
	normal:[6,10],
	hard:[11,30],
	crazy:[31,50],
	extreme:[51,inf],
}};

(()=>{ // strt
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
// end
})();
