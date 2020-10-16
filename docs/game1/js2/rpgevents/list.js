rpgevts.map4_8_4=()=>{
	console.log("map4_8_4");
	let d=$gamePlayer.direction();
	if(d!==2 && d!==8) return;
	dialog(["you are facing ...",d===2?"down":"up",":)"]);
};