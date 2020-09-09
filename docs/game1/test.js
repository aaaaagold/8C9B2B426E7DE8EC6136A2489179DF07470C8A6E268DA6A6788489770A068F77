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
