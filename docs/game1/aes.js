"use strict";




{
const hexDigits=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F',];
Number.prototype.rot_r=function(n){
	let bitlen=32;
	// n%=bitlen; n+=bitlen; n%=bitlen;
	n&=bitlen-1;
	let v=this.valueOf();
	return (((0xFFFFFFFF<<(bitlen-n))^(~0))&(v>>n)) | (v<<(bitlen-n));
};
Number.prototype.toHexInt=function(unsigned_){
	let rtv="",i=this.valueOf(),arr=[];
	if(i===0) return "0";
	if(!unsigned_ && i<0){ rtv+='-'; i=-parseInt(i); }
	while(i){ arr.push(hexDigits[i&0xF]); i>>=4; i&=0x0FFFFFFF; }
	while(arr.length!==0) rtv+=arr.pop();
	return rtv;
};
}


window.sha256=function w(input_str_orOthersTreatedAsArrayOfBytes,encode){
	// https://en.wikipedia.org/wiki/UTF-8#Encoding
	w.bytes2str=function bytes2str(bytes){ // UTF-8
		let rtv='';
		for(let x=0;x!==bytes.length;++x){
			let b=bytes[x];
			if(b&0x80){
				if((b>>5)>=6){ // 110xxxxx
					if((b>>4)>=14){ // 1110xxxx
						if((b>>3)>=30){ // 11110xxx
							let code=b&7;
							code<<=6; code|=bytes[++x]&63;
							code<<=6; code|=bytes[++x]&63;
							code<<=6; code|=bytes[++x]&63;
							rtv+=String.fromCharCode(code);
						}else{
							let code=b&0xF;
							code<<=6; code|=bytes[++x]&63;
							code<<=6; code|=bytes[++x]&63;
							rtv+=String.fromCharCode(code);
						}
					}else rtv+=String.fromCharCode( ((b&0x1F)<<6)|(bytes[++x]&63) );
				}else throw new Error("not a utf8 string");
			}else rtv+=String.fromCharCode(b);
		}
		return rtv;
	};
	w.str2bytes=function str2bytes(input_str){ // UTF-8
		input_str=input_str||"";
		let arr=[];
		// to byte string
		for(let mask=0x7FFFFFFF,x=0;x!==input_str.length;++x){
			let c=input_str.charCodeAt(x)&mask; // make sure to be unsigned
			if(c>0x7F){ // 2 bytes or more
				let rev_arr=[c&0x3F|0x80],r=(c>>6);
				if(c>0x7FF){ // 3 bytes or more
					rev_arr.push(r&0x3F|0x80); r>>=6;
					if(c>0xFFFF){ // 4 bytes
						rev_arr.push(r&0x3F|0x80); r>>=6;
						if(c>0x10FFFF){ // wtf
							rev_arr.push(r&0x3F); r>>=6;
							rev_arr.push(r|0xF8); // &0x3
						}else rev_arr.push(r|0xF); // &0x7
					}else rev_arr.push(r|0xE0); // &0xF
				}else rev_arr.push(r|0xC0); // &0x1F
				for(let z=rev_arr.length;z--;) arr.push(rev_arr[z]);
			}else arr.push(c);
		}
		return arr;
	};
	w.bytes2words=function bytes2words(bytesarr){
		let rtv=[];
		for(let x=0;x<bytesarr.length;x+=4){
			let tmp=0;
			for(let z=0;z!==4;++z){ tmp<<=8; tmp|=bytesarr[x|z]&0xFF; } // will use undefined to do bitwise operation
			rtv.push(tmp);
		}
		return rtv;
	};
	
	w.sha256=function sha256(input_str_orOthersTreatedAsArrayOfBytes,encode){
		// https://en.wikipedia.org/wiki/SHA-2#Pseudocode
		let h0 = 0x6a09e667;
		let h1 = 0xbb67ae85;
		let h2 = 0x3c6ef372;
		let h3 = 0xa54ff53a;
		let h4 = 0x510e527f;
		let h5 = 0x9b05688c;
		let h6 = 0x1f83d9ab;
		let h7 = 0x5be0cd19;
		let input_str=input_str_orOthersTreatedAsArrayOfBytes;
		input_str=input_str||"";
		let arr=[];
		if(typeof input_str==='string') arr=w.str2bytes(input_str);
		else for(let x=0;x!==input_str.length;++x) arr.push(input_str[x]&0xFF);
		let trueStrLen=arr.length;
		// padding K
		let K=(512-((arr.length*8)+1+64)%512)%512; // L +1 +64
		// L +1 +K +64 ===     0 (mod 512)
		//      +K     === -L-65 (mod 512)
		if((K&7)!==7) throw new Error("char is not 8bits?");
		K-=7;arr.push(0x80);
		while(K){K-=8;arr.push(0x0);}
		// padding L 64-bit big-endian
		let L64big=(trueStrLen*8).toString(16); L64big=("0".repeat(16-L64big.length)+L64big).slice(-16);
		for(let x=0;x!==L64big.length;x+=2) arr.push(Number("0x"+L64big.slice(x,x+2)));
		if(arr.length%64) throw new Error("I did it wrong");
		for(let base=0;base!==arr.length;base+=64){
			let w=[]; for(let x=0;x!==64;++x) w[x]=0;
			let words=[]; for(let x=0;x!==64;x+=4) words.push((arr[base+x]<<24)|(arr[base+x+1]<<16)|(arr[base+x+2]<<8)|arr[base+x+3]);
			for(let x=0;x!==16;++x) w[x]=words[x];
			for(let i=16;i!==64;++i){
				let s0=w[i-15].rot_r(7)^w[i-15].rot_r(18)^(w[i-15]>>>3);
				let s1=w[i-2].rot_r(17)^w[i- 2].rot_r(19)^(w[i-2]>>>10);
				w[i]=(w[i-16]+s0+w[i-7]+s1)|0;
			}
			let a = h0;
			let b = h1;
			let c = h2;
			let d = h3;
			let e = h4;
			let f = h5;
			let g = h6;
			let h = h7;
			for(let i=0;i!==64;++i){
				let S1=e.rot_r(6)^e.rot_r(11)^e.rot_r(25);
				let ch=(e&f)^((~e)&g);
				let temp1=(h+S1+ch+sha256.k[i]+w[i])|0;
				let S0=a.rot_r(2)^a.rot_r(13)^a.rot_r(22);
				let maj=(a&b)^(a&c)^(b&c);
				let temp2=(S0+maj)|0;
				h = g;
				g = f;
				f = e;
				e = (d + temp1)|0;
				d = c;
				c = b;
				b = a;
				a = (temp1 + temp2)|0;
			}
			h0 = (h0 + a)|0;
			h1 = (h1 + b)|0;
			h2 = (h2 + c)|0;
			h3 = (h3 + d)|0;
			h4 = (h4 + e)|0;
			h5 = (h5 + f)|0;
			h6 = (h6 + g)|0;
			h7 = (h7 + h)|0;
		}
		let rtvtmp=[h0,h1,h2,h3,h4,h5,h6,h7];
		let rtv="";
		if(encode){
			for(let x=0;x!==rtvtmp.length;++x){
				for(let h=rtvtmp[x],sh=32;sh;){
					sh-=8;
					rtv+=String.fromCharCode((h>>>sh)&0xFF);
				}
			}
		}else{
			rtv+="0x";
			for(let x=0;x!==rtvtmp.length;++x){
				for(let h=rtvtmp[x],sh=32;sh;){
					sh-=8;
					let tmp=((h>>>sh)&0xFF).toHexInt();
					if(tmp.length===2) rtv+=tmp;
					else rtv+="0"+tmp;
				}
			}
		}
		return rtv;
	};
	w.sha256.k=[
0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
		];
	
	return w.sha256(input_str_orOthersTreatedAsArrayOfBytes,encode);
};


window.aes=function f(data,key,enc0dec1){
	if(!f.init){
		f.init=true;
		// https://en.wikipedia.org/wiki/UTF-8#Encoding
		f.bytes2str=function bytes2str(bytes){ // UTF-8
			let rtv='';
			for(let x=0;x!==bytes.length;++x){
				let b=bytes[x];
				if(b&0x80){
					if((b>>5)>=6){ // 110xxxxx
						if((b>>4)>=14){ // 1110xxxx
							if((b>>3)>=30){ // 11110xxx
								let code=b&7;
								code<<=6; code|=bytes[++x]&63;
								code<<=6; code|=bytes[++x]&63;
								code<<=6; code|=bytes[++x]&63;
								rtv+=String.fromCharCode(code);
							}else{
								let code=b&0xF;
								code<<=6; code|=bytes[++x]&63;
								code<<=6; code|=bytes[++x]&63;
								rtv+=String.fromCharCode(code);
							}
						}else rtv+=String.fromCharCode( ((b&0x1F)<<6)|(bytes[++x]&63) );
					}else throw new Error("not a utf8 string");
				}else rtv+=String.fromCharCode(b);
			}
			return rtv;
		};
		f.str2bytes=function str2bytes(input_str){ // UTF-8
			input_str=input_str||"";
			let arr=[];
			// to byte string
			for(let mask=0x7FFFFFFF,x=0;x!==input_str.length;++x){
				let c=input_str.charCodeAt(x)&mask; // make sure to be unsigned
				if(c>0x7F){ // 2 bytes or more
					let rev_arr=[c&0x3F|0x80],r=(c>>6);
					if(c>0x7FF){ // 3 bytes or more
						rev_arr.push(r&0x3F|0x80); r>>=6;
						if(c>0xFFFF){ // 4 bytes
							rev_arr.push(r&0x3F|0x80); r>>=6;
							if(c>0x10FFFF){ // wtf
								rev_arr.push(r&0x3F); r>>=6;
								rev_arr.push(r|0xF8); // &0x3
							}else rev_arr.push(r|0xF); // &0x7
						}else rev_arr.push(r|0xE0); // &0xF
					}else rev_arr.push(r|0xC0); // &0x1F
					for(let z=rev_arr.length;z--;) arr.push(rev_arr[z]);
				}else arr.push(c);
			}
			return arr;
		};
		f.bytes2words=function bytes2words(bytesarr){
			let rtv=[];
			for(let x=0;x<bytesarr.length;x+=4){
				let tmp=0;
				for(let z=0;z!==4;++z){ tmp<<=8; tmp|=bytesarr[x|z]&0xFF; } // will use undefined to do bitwise operation
				rtv.push(tmp);
			}
			return rtv;
		};
		f.rcon=function rcon(itr){
			let arr=[0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1B,0x36];
			//if(itr>=arr.length) console.log("?");
			return arr[itr]<<24;
		}
		f.sbox=function sbox(b8,inv){
			// https://en.wikipedia.org/wiki/Rijndael_S-box
			if(!sbox.tbl){
				let tbl=sbox.tbl=[];
				function initialize_aes_sbox(sbox) {
					var p = 1, q = 1 , xformed;
					/* loop invariant: p * q == 1 in the Galois field */
					do {
						/* multiply p by 3 */
						p = p ^ (p << 1) ^ (p & 0x80 ? 0x1B : 0);
						/* divide q by 3 (equals multiplication by 0xf6) */
						q ^= q << 1;
						q ^= q << 2;
						q ^= q << 4;
						q ^= q & 0x80 ? 0x09 : 0;
						q&=0xFF;
						/* compute the affine transformation */
						xformed=(q<<8)|q;
						xformed=xformed^(xformed<<1)^(xformed<<2)^(xformed<<3)^(xformed<<4);
						xformed>>=8;
						sbox[p&=0xFF] = (xformed ^ 0x63)&0xFF;
					} while (p != 1);
					/* 0 is a special case since it has no inverse */
					sbox[0] = 0x63;
				}
				initialize_aes_sbox(tbl);
				let i=sbox.inv=[];
				for(let x=0;x!==tbl.length;++x) i[sbox.tbl[x]]=x;
			}
			return inv?sbox.inv[b8&0xFF]:sbox.tbl[b8&0xFF];
			b8&=0xff;
			b8|=(b8<<8);
			let rtv=0x6300^b8;
			for(let x=5;--x;) rtv^=b8<<x;
			return (rtv>>8)&0xFF;
		}
		f.subWord=function subWord(w,inv){
			let rtv=f.sbox(w,inv);
			for(let x=32;x-=8;) rtv|=f.sbox(w>>x,inv)<<x;
			return rtv;
		}
		f.rotWord=function rotWord(w){ return w.rot_r(24); }
		f.keyExp=function keyExp(arr_int){
			// https://en.wikipedia.org/wiki/AES_key_schedule
			let N=arr_int.length;
			let tmp=(N-6); if(tmp&1 || tmp*tmp>4) throw new Error("key length error");
			let R=(N+7)<<2;
			let W=[],rtv=[]; tmp=[];
			for(let i=0,i_rcon=0;i!==R;++i){
				if(i<N) W.push(arr_int[i]);
				else{
					let i_N=i%N;
					if(i_N==0) W.push( W[i-N]^f.subWord(f.rotWord(W[i-1]))^f.rcon(++i_rcon) );
					else if(i_N==4&&6<N) W.push( W[i-N]^f.subWord(W[i-1]) );
					else W.push( W[i-N]^W[i-1] );
				}
				tmp.push(W[W.length-1]);
				if(tmp.length===4){ rtv.push(tmp); tmp=[]; }
			}
			return rtv;
		}
		
		f.addRoundKey=function addRoundKey(state,keys,round_n){
			//
			// state: arr_int
			let key=keys[round_n],rtv=[];
			//for(let x=0;x!==4;++x) rtv.push(state[x]^((key[x]<<24)|(key[x+4]<<16)|(key[x+8]<<8)|key[x+12]));
			for(let x=0;x!==4;++x) rtv.push(state[x]^key[x]);
			return rtv;
		}
		
		f.shiftRow=function shiftRow(state){
			let masks=[0xFF000000,0x00FF0000,0x0000FF00,0x00000FF];
			return [
				(state[0]&masks[0])|(state[1]&masks[1])|(state[2]&masks[2])|(state[3]&masks[3]),
				(state[1]&masks[0])|(state[2]&masks[1])|(state[3]&masks[2])|(state[0]&masks[3]),
				(state[2]&masks[0])|(state[3]&masks[1])|(state[0]&masks[2])|(state[1]&masks[3]),
				(state[3]&masks[0])|(state[0]&masks[1])|(state[1]&masks[2])|(state[2]&masks[3]),
			];
		}
		f.shiftRow_inv=function shiftRow_inv(state){
			let masks=[0xFF000000,0x00FF0000,0x0000FF00,0x00000FF];
			return [
				(state[0]&masks[0])|(state[3]&masks[1])|(state[2]&masks[2])|(state[1]&masks[3]),
				(state[1]&masks[0])|(state[0]&masks[1])|(state[3]&masks[2])|(state[2]&masks[3]),
				(state[2]&masks[0])|(state[1]&masks[1])|(state[0]&masks[2])|(state[3]&masks[3]),
				(state[3]&masks[0])|(state[2]&masks[1])|(state[1]&masks[2])|(state[0]&masks[3]),
			];
		}
		
		f.mixCol=function mixCol(state){
			// https://en.wikipedia.org/wiki/Rijndael_MixColumns
			let rtv=[],a=[],b=[];
			for(let x=0,h,c,w;x!==4;++x){ // 4 cols
				w=state[x];
				for(c=0;c!==4;++c){ // 4 bytes per int
					let sh=24-(c<<3);
					let byte=(w>>sh)&0xFF; // r[c]
					a[c]=byte;
					h=(byte<<24>>31)&0xFF; /* h is 0xff if the high bit of r[c] is set, 0 otherwise */
					b[c]=byte<<1;
					b[c]&=0xFF;
					b[c]^=h&0x1B; // x**8 + x**4 + x**3 + x**1 + x**0
					b[c]<<=sh;
				}
				let aa=a[0]^a[1]^a[2]^a[3],A=w,B=b[0]|b[1]|b[2]|b[3];
				let AA=(aa<<24)|(aa<<16)|(aa<<8)|aa;
				rtv[x]=B.rot_r(24)^B^AA^A;
			}
			return rtv;
		}
		f.mixCol_inv=function mixCol_inv(state){
			// https://en.wikipedia.org/wiki/Rijndael_MixColumns
			/*	
				14	11	13	9	
				9	14	11	13	
				13	9	14	11	
				11	13	9	14	

				 9 = 8+1
				11 = 8+2+1
				13 = 8+4+1
				14 = 8+4+2

				x^8 + x^4 + x^3 + x + 1
			*/	
			if(mixCol_inv.tbl===undefined){ // lookup table
				let tbl=[]; // tbl[ n = 0..3 , meaning 2**n ][byte] -> byte*(2**n) in GF // x**8 + x**4 + x**3 + x**1 + x**0
				for(let sh=4;sh--;){
					for(let byte=256,arr=tbl[sh]=[],_msk=0x11b<<sh,_msb=0x100<<sh;byte--;){
						let r=byte<<sh,msk=_msk,msb=_msb;
						for(;0xFF<r;msk>>=1,msb>>=1) if(r&msb) r^=msk;
						arr[byte]=r;
					}
				}	// -> 1,2,4,8 #
				for(let byte=0;byte!==256;++byte){
					tbl[0][byte]^=tbl[3][byte];
					// -> 9,2,4,8 #
					tbl[3][byte]^=tbl[2][byte];
					// -> 9,2,4,12 #
					tbl[2][byte]^=tbl[0][byte];
					// -> 9,2,13,12 #
					tbl[3][byte]^=tbl[1][byte];
					// -> 9,2,13,14 #
					tbl[1][byte]^=tbl[0][byte];
					// -> 9,11,13,14 #
				}
				mixCol_inv.tbl=tbl;
			}
			let rtv=[],tbl=mixCol_inv.tbl;
			for(let x=0,m9,m11,m13,m14,c,byte;x!==4;++x){ // 4 cols
				m14=m13=m11=m9=0;
				for(c=0;c!==4;++c){ // 4 bytes per int
					byte=(state[x]>> (24-(c<<3)) )&0xFF; // r[c]
					m9 <<=8; m9 |=tbl[0][byte];
					m11<<=8; m11|=tbl[1][byte];
					m13<<=8; m13|=tbl[2][byte];
					m14<<=8; m14|=tbl[3][byte];
				}
				rtv[x]=m14^m9.rot_r(8)^m13.rot_r(16)^m11.rot_r(24);
			}
			return rtv;
		}
		
		f.aesblk=function aesblk(stat,keys){
			stat=f.addRoundKey(stat,keys,0);
			for(let r=1,rs=keys.length-2;r<=rs;++r){
				stat=stat.map(x=>f.subWord(x)); // SubBytes
				stat=f.shiftRow(stat);
				stat=f.mixCol(stat);
				stat=f.addRoundKey(stat,keys,r);
			}
			stat=stat.map(x=>f.subWord(x)); // SubBytes
			stat=f.shiftRow(stat);
			stat=f.addRoundKey(stat,keys,keys.length-1);
			return stat;
		}
		
		f.aesblk_dec=function aesblk_dec(stat,keys){
			stat=f.addRoundKey(stat,keys,keys.length-1);
			stat=f.shiftRow_inv(stat);
			stat=stat.map(x=>f.subWord(x,1)); // SubBytes
			for(let r=keys.length-1;--r;){
				stat=f.addRoundKey(stat,keys,r);
				stat=f.mixCol_inv(stat);
				stat=f.shiftRow_inv(stat);
				stat=stat.map(x=>f.subWord(x,1)); // SubBytes
			}
			stat=f.addRoundKey(stat,keys,0);
			return stat;
		}
		
		f.formatBlk=function formatBlk(stat){
			let stat2=stat.map(x=>(Math.pow(2,35)+x).toString(16).slice(1).toUpperCase()).join('').replace(/([0-9A-F][0-9A-F])/g,'0x$1,');
			let s=''; Function('"use strict";return (' + "["+stat2+"]" + ')').forEach(x=>{s+=String.fromCharCode(x);});
			return [btoa(s),stat2,stat.map(x=>x.toHexInt(1)).join()]; // debug
		}
		
		f.str2blks=function str2blks(s){
			let rtv=[],tmp=String.fromCharCode(0);
			while(s.length&3) s+=tmp;
			for(let x=4;--x;) tmp+=String.fromCharCode(0);
			while(s.length<16) s+=tmp;
			while(s.length&15) s+=tmp;
			for(let x=0;x!==s.length;x+=16){
				let blk=[];
				for(let a=0;a!==16;a+=4){
					let tmp=0;
					for(let z=0;z!==4;++z){
						let c=s.charCodeAt(x|a|z);
						if(c>255) throw new Error("not yet support utf-8 as key");
						tmp<<=8;
						tmp|=c;
					}
					blk.push(tmp);
				}
				rtv.push(blk);
			}
			return rtv;
		}
		
		f.parseKey=function parseKey(key){
			if(key===undefined) throw new Error("no key provided");
			if(!key) key='';
			let key_words,kt=(typeof key); // 1 word = 4 byte
			if(kt==="string"){
				key_words=f.bytes2words(f.str2bytes(key));
			}else if(key.constructor===Array && typeof key[0]==="number"){
				key_words=key;
			}else throw new Error("unsupported key type");
			
			if(8<key_words.length) throw new Error("key too long");
			else if(key_words.length>=4 && (key_words.length&1)===0) ;
			else if(key_words.length<4) while(key_words.length<4) key_words.push(0);
			else if(key_words.length<6) while(key_words.length<6) key_words.push(0);
			else while(key_words.length<8) key_words.push(0);
			
			return key_words;
		}
		
		f.aes=function aes(data,key){
			let keys=f.keyExp(f.parseKey(key));
			
			if(!data) data='';
			let blks,dt=(typeof data);
			if(dt==="string") blks=f.str2blks(data);
			else if(data.constructor===Array){ // array of blk
				if(data[0]&&data[0].constructor!==Array){
					blks=[];
					for(let x=0;x<data.length;x+=4){
						let tmp=[];
						for(let z=0;z!==4;++z) tmp.push(data[x|z]);
						blks.push(tmp);
					}
				}else blks=data;
			}else throw new Error("unsupported data type")+Error(JSON.stringify(data));
			
			return blks.map(x=>f.aesblk(x,keys));
		}
		f.aes_dec=function aes_dec(data,key){
			let keys=f.keyExp(f.parseKey(key)); //console.log('e','keys',keys.map(x=>x.map(x=>x.toHexInt(1))));
			
			if(!data) data='';
			let blks,dt=(typeof data);
			if(dt==="string") blks=f.str2blks(data);
			else if(data.constructor===Array){ // array of blk
				if(data[0]&&data[0].constructor!==Array){
					blks=[];
					for(let x=0;x<data.length;x+=4){
						let tmp=[];
						for(let z=0;z!==4;++z) tmp.push(data[x|z]);
						blks.push(tmp);
					}
				}else blks=data;
			}else throw new Error("unsupported data type")+Error(JSON.stringify(data));
			
			//console.log(blks);
			return blks.map(x=>f.aesblk_dec(x,keys));
		}
	}
	
	let z=Math.pow(2,35),r=/([0-9A-F][0-9A-F]?)/g;
	if(enc0dec1){
		let blks=f.aes_dec(f.bytes2words(data),key); // data is bytes
		let arr=[];
		for(let bid=0;bid!==blks.length;++bid){
			for(let blk=blks[bid],wid=0;wid!==blk.length;++wid){
				for(let word=blk[wid],x=32;x;){
					let byte=(word>>(x-=8))&0xFF;
					if(byte===0) return f.bytes2str(arr);
					arr.push(byte);
				}
			}
		}
		return f.bytes2str(arr);
	}else{
		let blks=f.aes(data,key);
		return blks.map(blk=>blk.map(w=>(w+z).toString(16).toUpperCase().slice(1).replace(r,' $1')).join('').slice(1)).join(' ');
	}
};

delete window.objs;