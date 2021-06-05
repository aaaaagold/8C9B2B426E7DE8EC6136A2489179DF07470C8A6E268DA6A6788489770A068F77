// $ set path = (/usr/local/llvm__/bin $path)
// $ clang++ -O3 a.cpp -DTOWASM --target=wasm32 --no-standard-libraries -Wl,--export=conv -Wl,--export=build -Wl,--export=strt -Wl,--export=strt1 -Wl,--export=strt_act -Wl,--export=strt_before -Wl,--export=strt_step -Wl,--export=ende -Wl,--no-entry -o a.wasm

// #define WASM_EXPORT __attribute__((visibility("default")))

// __attribute__((visibility("default")))

// #include <vector>

extern "C" bool isInView(int ox,int oy,int x,int y,int w,int h,float r,float ax,float ay,float sx,float sy){
	const float ws=w*sx,hs=h*sy;
	const int L=-ws*ax-r+x;
	const int U=-hs*ay-r+y;
	const int R=(ws+r)+L;
	const int D=(hs+r)+U;
	return L<=ox&&ox<=R&&U<=oy&&oy<=D;
}

