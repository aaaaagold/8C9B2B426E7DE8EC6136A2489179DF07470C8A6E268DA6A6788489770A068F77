"use strict";

(()=>{
//let f=LZString.compressToBase64.bind(LZString);
let f=function(txt){return this.compressToBase64(sha256(txt+this.toString()+txt,1));};
let e=eval,r=Math.random.bind(Math),fstr=f.toString(),i=parseInt,p=fstr.replace.bind(fstr),sp=fstr[20];
let setting={},t=Window_ShopStatus; t=t.name;
setting[t[8]+t[13]+t[16]+t[8]]={get:function(){
	let spsH=""; for(let x=0,xs=i((11+r()*3)*r());x!==xs;++x) spsH+=sp;
	let spsT=""; for(let x=0,xs=i((11+r()*3)*r());x!==xs;++x) spsT+=sp;
	let sps1=""; for(let x=0,xs=i((11+r()*3)*r());x!==xs;++x) sps1+=sp;
	let sps2=""; for(let x=0,xs=i((11+r()*3)*r());x!==xs;++x) sps2+=sp;
	let sps3=""; for(let x=0,xs=i((11+r()*3)*r());x!==xs;++x) sps3+=sp;
	let sps4=""; for(let x=0,xs=i((11+r()*3)*r());x!==xs;++x) sps4+=sp;
	return e(spsH+"("+sps1+p(
		/([^$0-9A-Z_a-z])/g,
		sps2+"$1"+sps3
	)+sps4+").bind(LZString)"+spsT);
},configurable: false};	
t=window.d||{};
Object.defineProperties(t,setting);
})();
