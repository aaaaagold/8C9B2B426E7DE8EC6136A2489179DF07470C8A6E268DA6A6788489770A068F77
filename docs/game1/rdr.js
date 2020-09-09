"use strict";
{
	const m=location.href.match(/\/([0-9A-Za-z_% ]+)\.html(\?[^?#]*)?(#[^#]*)?$/);
	if(m){
		let s=m[1]; if(!s) s="";
		localStorage.setItem("title",s);
		s=localStorage.getItem("title");
		localStorage.setItem("title",s);
		if(localStorage.getItem("title")!==s) alert("WARNING: Cannot set localStorage properly.\nThis may cause problems including saving game states.\nThe author is lazy so you must enable this to play the game properly.");
		localStorage.setItem("ref",document.referrer);
		location.href="./" + location.search + location.hash;
	}
}
