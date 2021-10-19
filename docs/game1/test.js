"use strict";

// Set
{
	let s=new Set(),msg='Set malfunction';
	if(s.has(0)) throw new Error(msg);
	if(s.has(1)) throw new Error(msg);
	if(s.has(3)) throw new Error(msg);
	if(s.has(5)) throw new Error(msg);
	s.add(0); if(!s.has(0)) throw new Error(msg);
	s.add(1); if(!s.has(1)) throw new Error(msg);
	s.add(2); if(!s.has(2)) throw new Error(msg);
	s.add(2); if(!s.has(2)) throw new Error(msg);
	s.add(3); if(!s.has(3)) throw new Error(msg);
	s.delete(0); if(s.has(0)) throw new Error(msg);
	s.delete(2); if(s.has(2)) throw new Error(msg);
	s.add(5); if(!s.has(5)) throw new Error(msg);
	let a=0;
	s.forEach((v,k,_)=>{
		if(v!==k) throw new Error(msg);
		if(s!==_) throw new Error(msg);
		a+=v;
	});
	if(a!==9) throw new Error(msg);
}
// Map
{
	let m=new Map(),msg='Map malfunction';
	if(m.get(0)!==undefined) throw new Error(msg);
	m.set(0,0); if(m.get(0)!==0) throw new Error(msg);
	m.set(1,2); if(m.get(1)!==2) throw new Error(msg);
	m.set(0,1); if(m.get(0)!==1) throw new Error(msg);
	m.set(2,4); if(m.get(2)!==4) throw new Error(msg);
	m.set(3,8); if(m.get(3)!==8) throw new Error(msg);
	if(!m.get(0)) throw new Error(msg);
	let s=0;
	m.forEach((v,k,_)=>{
		if((1<<k)!==v) throw new Error(msg);
		if(m!==_) throw new Error(msg);
		s+=v;
	});
	if(s!==0xF) throw new Error(msg);
}
// 3rdCookie
if(typeof sha256!=='function' || sha256(location.origin)!=="0x50AF9A92FA2A9520CB5FB95B065927CAA07436E9597D982433D02EA528D3A575"){
	const h=location.host , o=location.origin;
	const isdev=h.match(/(^|\/\/)[0-9]+(\.[0-9]+){3}(:[0-9]+)?$/)||h.match(/pjs\.myrmmv:[0-9]+$/);
	let msgShown=0;
	const d=document , ce=t=>d.createElement(t) , ac=(p,c)=>{p.appendChild(c);return p;} , nb="margin:0px;border:0px solid black;padding:0px;" , genTester=h=>{
		const i=ce('iframe') , r="#"+Date.now();
		i.setAttribute("style","z-index:-1;position:absolute;width:0px;height:0px;opacity:0;"+nb);
		i.src=h+(isdev?"/pj2":"")+"/3rd.html?"+r;
		const f=evt=>{
			if(evt.origin!==h||evt.origin===o) return;
			window.removeEventListener("message",f);
			i.parentNode.removeChild(i);
			switch(evt.data){
			default:
			case 0: return;
			case 1: break;
			}
			if(msgShown) return;
			msgShown=1;
			const divs=[ce('div'),ce('div'),] , cn=d.body.childNodes , msgs=[
				"5pys6YGK5oiy5LiN6byT5Yu16ZaL5ZWf56ys5LiJ5pa5Y29va2ll",
				"VGhpcyBnYW1lIERPRVMgTk9UIGVuY291cmFnZSBwbGF5ZXIgdG8gdHVybiBvbiB0aGlyZC1wYXJ0eSBjb29raWUu",
			];
			const divP=ce('div'); divP.setAttribute("style","z-index:65535 !important;position:absolute;width:100%;height:100%;background-color:rgba(4,4,4,0.875);color:#DDDDDD;text-align:center;font-size:32px;"+nb);
			if(cn.length) d.body.insertBefore(divP,cn[0]);
			else ac(d.body.divP);
			for(let x=0;x!==divs.length;++x){
				ac(divP,ac(divs[x],d.createTextNode(
					(sha256.bytes2str||bytes2str)([...atob(msgs[x])].map(x=>x.charCodeAt()))
				)));
			}
			ac(d.body,ac(ce("style"),d.createTextNode("canvas{display:none !important;}")));
			if(window.jss) window.jss.length=0;
			if(window.SceneManager) window.SceneManager.run=()=>{};
			if(window.AudioManager) window.AudioManager.stopAll();
		}
		window.addEventListener("message",f);
		ac(d.body,i);
	};
	if(isdev) genTester(o.replace(/\/\/[0-9A-Za-z.]+(:[0-9]+)$/,"//pjs.wtf$1"));
	else genTester( location.protocol+"//"+h.replace(/^(.+)(\.[0-9A-Za-z]+){2}$/,"$1.herokuapp.com") );
}
