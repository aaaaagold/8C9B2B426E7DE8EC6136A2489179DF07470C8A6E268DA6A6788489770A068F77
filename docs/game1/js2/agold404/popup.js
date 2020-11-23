"use strict";

// - - Window_CustomPopups

function Window_CustomPopups(){
	this.initialize.apply(this, arguments);
}
$aaaa$=Window_CustomPopups;
window[$aaaa$.name]=$aaaa$;
$aaaa$.prototype = Object.create(Window_Selectable.prototype);
$aaaa$.prototype.constructor = $aaaa$;
$rrrr$=$aaaa$.prototype.destructor;
$dddd$=$aaaa$.prototype.destructor=function f(){
	debug.log('Window_CustomPopups.prototype.destructor');
	let h;
	h=this.max_heap; while(h.length) this.removeChild(h._data.pop());
	h=this.min_heap; while(h.length) this.removeChild(h._data.pop());
	return f.ori.call(this);
}; $dddd$.ori=$rrrr$;
$rrrr$=$aaaa$.prototype.initialize;
$dddd$=$aaaa$.prototype.initialize = function f(kargs) {
	f.ori.call(this,0,0,0,0);
	kargs=kargs||{};
	this.alpha=0.875;
	this._alignH=kargs['alignH']||'right';
	this._alignV=kargs['alignV']||'bottom';
	let lt=(a,b)=>a.y-b.y;
	let gt=(a,b)=>(b.y+b.height)-(a.y+a.height);
	this.max_heap=new Heap(lt); // biggest one may out-of-view
	this.min_heap=new Heap(gt); // smallest one may out-of-view
	return;
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.update=function(){
	let arr=(this._alignV==='top'?this.max_heap:this.min_heap)._data;
	for(let x=arr.length;--x;) arr[x].byeIfBye();
	for(let x=1,ct=Date.now();x!==arr.length;++x) arr[x]._update(ct);
	for(let x=arr.length;--x;) arr[x].byeIfBye(); // reduce mem. use
};
$rrrr$=$aaaa$.prototype.removeChild;
$dddd$=$aaaa$.prototype.removeChild=function f(c){
	let h=(this._alignV==='top')?this.max_heap:this.min_heap;
	h.remove(c);
	//	if(0&&0){
	//let hidx=h._data.indexOf(c);
	//if(hidx>0){
	//	h._data[hidx]=h._data.back;
	//	h._data.pop();
	//	h._sink(hidx);
	//}
	//}
	return f.ori.apply(this,arguments);
}; $dddd$.ori=$rrrr$;
$aaaa$.prototype.add=function(txt,align,kargs){
	let w=new Window_CustomPopupMsg(txt,kargs);
	switch(this._alignH){
		case 'left':
			w.x=0;
		break;
		case 'center':
			w.x>>=1;
		break;
		default: 
		case 'right':
		break;
	}
	switch(this._alignV){
		default: break;
		case 'bottom': {
			// not using max_hexp
			for(let x=1,arr=this.max_heap._data;x!==arr.length;++x) this.removeChild.ori.call(this,arr[x]);
			this.max_heap.clear();
			// max_heap as out-view (not used)
			// min_heap as in-view
			for(let x=1,arr=this.min_heap._data;x!==arr.length;++x){
				// everyone -= w.height results same order
				arr[x].y-=w.height;
			}
			while(this.min_heap.length){
				let T=this.min_heap.top;
				if(!T.parent||0>=T.y+T.height){
					T.bye();
					//this.min_heap.pop();
				}else break;
			}
			this.min_heap.push(w);
		}break;
		case 'center':
			w.y>>=1;
		break;
		case 'top':
			// not using min_hexp
			for(let x=1,arr=this.min_heap._data;x!==arr.length;++x) this.removeChild.ori.call(this,arr[x]);
			this.min_heap.clear();
			// max_heap as in-view
			// min_heap as out-view (not used)
			for(let x=1,arr=this.max_heap._data;x!==arr.length;++x){
				// everyone += w.height results same order
				arr[x].y+=w.height;
			}
			while(this.max_heap.length){
				let T=this.max_heap.top;
				if(!T.parent||T.y>=Graphics.boxHeight){
					T.bye();
					//this.max_heap.pop();
				}else break;
			}
			w.y=0;
			this.max_heap.push(w);
		break;
	}
	this.addChild(w);
	w.redrawtxt(this._alignH);
};
$dddd$=$rrrr$=$aaaa$=undef; // END Window_CustomPopups

