// $ clang++ -O3 a.cpp -DTOWASM --target=wasm32 --no-standard-libraries -Wl,--export=conv -Wl,--export=build -Wl,--export=strt -Wl,--export=strt1 -Wl,--export=strt_act -Wl,--export=strt_before -Wl,--export=strt_step -Wl,--export=ende -Wl,--no-entry -o a.wasm

// #define WASM_EXPORT __attribute__((visibility("default")))

// __attribute__((visibility("default")))

// #include <vector>

/*
extern "C" int aaaa(int a,int b){
	return a&b;
}

extern "C" int sum(int *arr,int sz){
	int rtv=0;
	for(int x=0;x!=sz;++x) rtv+=arr[x];
	return rtv;
}
*/

/*

Eight-Puzzle solver - DynamicPrograming version
input format:

1 2 3
4 5 6
7 8 9

an int:
123456789

where 9 is the empty block

*/

// #include <stdio.h>
#ifndef TOWASM
	#ifdef ECHOMAXSTEPSTATES
		#include <vector>
	#endif
	#include <queue>
	using namespace std;
#endif
#define dsiz 100000000
// #define finalstate 123456789
#define uppp 'u'
#define down 'd'
#define left 'l'
#define righ 'r'

#ifndef TOWASM
unsigned i,maxqsize;
#endif
int facto[10]={1};
int used[10]={0};

int cnt(int n)
{
	used[n]=1;
	int x;
	int cnt;
	for(cnt=0,x=1;x<n;x++)
	{
		if(used[x]) continue;
		cnt++;
	}
	return cnt;
}
int convert(int data) //order
{
	int digi=dsiz;
	int num,x;
	for(x=dsiz;x;x/=10){
		if((data/x)%10==9){
			data-=x*9;
			data+=111111111;
			break;
		}
	}
	for(num=0;num<10;num++) used[num]=0;
	for(num=0,x=8;digi;x--)
	{
		num+=cnt((data/digi)%10)*facto[x];
		digi/=10;
	}
	return num;
}
class state
{
public:
	int act,before,step;
	state(){act=0;before=-1;step=0;}
};
state sss[362880];
//int rtv[362880];
#ifdef TOWASM
const int minqsz=(1<<15);
const int minqmsk=minqsz-1;
class minq{
public:
	int arr[minqsz];
	unsigned s,e;
	minq():s(0),e(0){}
	void push(int n){
		arr[e++]=n;
		e&=minqmsk;
	}
	int pop(){
		const int &rtv=arr[s++];
		s&=minqmsk;
		return rtv;
	}
	unsigned size()const{ return minqsz*(e<s)+e-s; }
	int front()const{ return arr[s]; }
};
minq q;
#else
queue <int> q;
#endif

int findnine(int n)
{
	int digi=dsiz;
	while(digi)
	{
		if((n/digi)%10==9) break;
		digi/=10;
	}
	return digi;
}
void makedp()
{
#ifndef TOWASM
#ifdef ECHOMAXQSIZE
	if(maxqsize<q.size()) maxqsize=q.size();
#endif
#endif
	int v=q.front(),order;
	q.pop();
	int ori=v,convori=convert(v);
	int nine=findnine(v),tmp;
	if(nine!=100&&nine!=100000&&nine!=100000000) // right
	{
		tmp=(v/(nine*10))%10;
		v-=nine*9;
		v+=nine*tmp;
		v-=(nine*10)*tmp;
		v+=(nine*10)*9;
		order=convert(v);
		if(!sss[order].act)
		{
			sss[order].act=righ;
			sss[order].before=convori;
			sss[order].step=sss[convori].step+1;
			q.push(v);
		}
		v=ori;
	}
	if(nine<1000000) // down
	{
		tmp=(v/(nine*1000))%10;
		v-=nine*9;
		v+=nine*tmp;
		v-=(nine*1000)*tmp;
		v+=(nine*1000)*9;
		order=convert(v);
		if(!sss[order].act)
		{
			sss[order].act=down;
			sss[order].before=convori;
			sss[order].step=sss[convori].step+1;
			q.push(v);
		}
		v=ori;
	}
	if(nine>100) // up
	{
		tmp=(v/(nine/1000))%10;
		v-=nine*9;
		v+=nine*tmp;
		v-=(nine/1000)*tmp;
		v+=(nine/1000)*9;
		order=convert(v);
		if(!sss[order].act)
		{
			sss[order].act=uppp;
			sss[order].before=convori;
			sss[order].step=sss[convori].step+1;
			q.push(v);
		}
		v=ori;
	}
	if(nine!=1&&nine!=1000&&nine!=1000000) // left
	{
		tmp=(v/(nine/10))%10;
		v-=nine*9;
		v+=nine*tmp;
		v-=(nine/10)*tmp;
		v+=(nine/10)*9;
		order=convert(v);
		if(!sss[order].act)
		{
			sss[order].act=left;
			sss[order].before=convori;
			sss[order].step=sss[convori].step+1;
			q.push(v);
		}
		v=ori;
	}
}
extern "C" void build(int finalstate)
{
	for(int x=0;x<9;x++) facto[x+1]=facto[x]*(x+1);
	if(finalstate==0) finalstate=123456789;
	for(int x=0;x<362880;++x) sss[x].act=0;
	int fkey=convert(finalstate);
	sss[fkey].act=-1;
	q.push(finalstate);
	while(q.size()) makedp();
	sss[fkey].act=0;
	//for(int x=0;x<362880;++x) rtv[x]=sss[x].act;
}
extern "C" void *strt(){
	return &sss[0];
}
extern "C" void *strt1(){
	return &sss[1];
}
extern "C" void *strt_act(){
	return &sss[0].act;
}
extern "C" void *strt_before(){
	return &sss[0].before;
}
extern "C" void *strt_step(){
	return &sss[0].step;
}
extern "C" void *ende(){
	return &sss[362880];
}
extern "C" int conv(int data){
	return convert(data);
}
