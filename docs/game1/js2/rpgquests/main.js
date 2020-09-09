"use strict";
const rpgquests=window.rpgquests={func:{},list:{},handleRank:{
	easy:[0,4,5], // rankMin, rankMax, levelUp needed count
	normal:[5,9], // rankMin, rankMax, quest.isSat()
	hard:[11,30],
	crazy:[31,50],
	extreme:[51,inf],
}};
rpgquests.func.reward=(quest)=>{
	if(!quest.reward) return;
	let r=quest.reward||{};
	let items=r.items||[];
	let weapons=r.weapons||[];
	let armors=r.armors||[];
	let codes=r.codes||[];
	let msgTxt="",itemGain=(x,data)=>{
		msgTxt+=$gameParty.gainItem(data[x.id],x.amount,undef,1)+"\n";
	};
	items.forEach(x=>{itemGain(x,$dataItems)});
	weapons.forEach(x=>{itemGain(x,$dataWeapons)});
	armors.forEach(x=>{itemGain(x,$dataArmors)});
	msgTxt+=r.gold?$gameParty.gainGold(r.gold,1)+"\n":"";
	codes.forEach((x)=>{eval(x[0]);msgTxt+=x[1]+"\n";});
};
rpgquests.func.showBoard=(quest,returnWindow)=>{
	let txt=[];
	if(quest){
		if(quest.title!==undef){
			let s=" #### ";
			txt.push({txt:s+quest.title+s,sizeRate:1.5,align:'center'});
			txt.push("\n");
		}
		if(quest.titleMinor!==undef){
			txt.push({txt:quest.titleMinor,sizeRate:0.5,align:'center',color:"_[rgba(234,234,234,0.25)]"});
			txt.push("\n");
		}
		if(txt.length) txt.push("\n");
		txt=txt.concat(quest.txt);
	}
	let w=new Window_CustomTextBoard(txt);
	if(returnWindow) return w;
	SceneManager.addWindowB(w);
};
rpgquests.func.addLimitObj=(quest,item)=>{
	let L=quest.limit;
	if(Number(L)<=0) return;
	let color=quest.__dummy;
	let id=item.id;
	quest.txt.push("\n\n\n");
	quest.txt.push({sizeRate:0.75});
	let header=color.default+"剩餘可完成次數";
	Object.defineProperties(quest.txt.back,{ txt:{ get:(()=>{
		let rtv=header+" : ",p=$gameParty,c=(p&&p._completedQuests&&p._completedQuests[id])^0;
		if(isNaN(L)) rtv+=color.gain+"沒有限制";
		else{ let r=L-c; rtv+=r===0?color.lose+0:r; rtv+=color.default+" / "+L; }
		return rtv;
	}), configurable: false }});
};
rpgquests.func.addStateObj=(quest)=>{
	let sep="\n\n";
	let color=quest.__dummy;
	quest.isSat=none;
	switch(quest.info.type){
		default: break;
		case "evaltrue": { quest.txt.push(sep);
			quest.txt.push("\n"); quest.txt.push({txt:"========達成下列條件========",color:color.code}); 
			quest.info.codes.forEach((x)=>{ quest.txt.push("\n"); quest.txt.push({color:color.default});
				Object.defineProperties(quest.txt.back,{ txt: { get:(()=>{
					let rtv=x[1]&&x[1]+"："||"(不明) : "; rtv+=(eval(x[0])?color.finish:"未")+"完成";
					return rtv;
				}), configurable: false } });
				if(x[2]&&x[2].constructor===Function){ quest.txt.push("\n"); quest.txt.push({txt:"    "});
					quest.txt.push({color:color.default,sizeRate:0.75});
					Object.defineProperties(quest.txt.back,{ txt: { get:x[2], configurable: false } });
				}
			});
			quest.isSat=(function(cCnt){
				return (cCnt||0)<(this.limit||inf)&&this.info.codes.map(x=>!eval(x[0])).sum()===0;
			}).bind(quest);
			quest.finish=none;
		}break;
		case "collectItems": { quest.txt.push(sep);
			quest.txt.push("\n"); quest.txt.push({txt:"========蒐集道具========",color:color.item});
			quest.info.items.forEach((x)=>{ quest.txt.push("\n"); quest.txt.push({color:color.default});
				Object.defineProperties(quest.txt.back,{ txt:{ get:(()=>{
					let rtv=$dataItems[x.id].name; rtv+=$gameParty._items[x.id]>=x.amount?color.finish+" ":" ";
					rtv+=$gameParty._items[x.id]||0;
					rtv+=" / "+x.amount;
					return rtv;
				}), configurable: false }});
			});
			quest.isSat=(function(){
				return this.info.items.map(x=>{return !($gameParty._items[x.id]>=x.amount);}).sum()===0;
			}).bind(quest);
			quest.finish=(function(){ if(!this.isSat()) return 0;
				this.info.items.forEach((x)=>{ $gameParty.gainItem($dataItems[x.id],-x.amount,undef,1); });
				return 1;
			}).bind(quest);
		}break;
	}
};
rpgquests.func.addRewardObj=(quest)=>{
	let sep="\n\n";
	let color=quest.__dummy;
	
	let r=quest.reward||{};
	let items=r.items||[];
	let weapons=r.weapons||[];
	let armors=r.armors||[];
	let codes=r.codes||[];
	if(r.gold||items.length||weapons.length||armors.length||codes.length) ; else return;
	
	quest.txt.push(sep);
	quest.txt.push("\n"); quest.txt.push({txt:"========獎勵========",color:color.gain});
	
	if(items.length){ quest.txt.push("\n"); quest.txt.push({txt:color.item+"道具",color:color.default}); }
	items.forEach(x=>{ quest.txt.push("\n"); quest.txt.push({
		txt:$dataItems[x.id].name+" * "+x.amount
	,color:color.default}); });
	
	if(armors.length){ quest.txt.push("\n"); quest.txt.push({txt:color.armor+"防具",color:color.default}); }
	armors.forEach(x=>{ quest.txt.push("\n"); quest.txt.push({
		txt:$dataArmors[x.id].name+" * "+x.amount
	,color:color.default}); });
	
	if(weapons.length){ quest.txt.push("\n"); quest.txt.push({txt:color.weapon+"武器",color:color.default}); }
	weapons.forEach(x=>{ quest.txt.push("\n"); quest.txt.push({
		txt:$dataWeapons[x.id].name+" * "+x.amount
	,color:color.default}); });
	
	if(r.gold){ quest.txt.push("\n"); quest.txt.push({txt:r.gold+"G",color:color.default}); }
	
	if(codes.length){ quest.txt.push("\n"); quest.txt.push({txt:"其他",color:color.code}); }
	codes.forEach(x=>{ quest.txt.push("\n");
		quest.txt.push({txt:x[1]||"(不明)",color:color.default});
		if(x[2]&&x[2].constructor===Function){ quest.txt.push("\n"); quest.txt.push({txt:"    "});
			quest.txt.push({sizeRate:0.75});
			Object.defineProperties(quest.txt.back,{ txt:{ get:x[2], configurable: false }});
		}
	});
};

(()=>{ // strt
let arr=[1];
const add=(src)=>{
	let itvl=setInterval(()=>{
		if(window['$dataCustom'] && window['$dataItems'] && window['$dataWeapons'] && window['$dataArmors'] && arr.back){
			addScript("js2/rpgquests/"+src+".js");
			clearInterval(itvl);
		}
	},100);
};

add("storymain");
add("core");
add("ko-main");
add("rf-main");
// end
})();
