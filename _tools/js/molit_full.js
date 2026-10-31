// 전체 실거래 재수집(직거래 표시 포함): data.go.kr 탭에서 window.K 설정 후 실행. REGION_LIST 순서대로 cases.json을 GitHub raw에서 읽어 전체 물건 대상 수집 → window.FULL[region]={trades,rent,by}
window.FULL=window.FULL||{};window.FDONE=false;(async()=>{const lib=await (await fetch('https://raw.githubusercontent.com/bid-archive/bid-archive.github.io/main/_tools/js/a1_lib.js?x='+Date.now())).text();(0,eval)(lib);
const molitSrc=await (await fetch('https://raw.githubusercontent.com/bid-archive/bid-archive.github.io/main/_tools/js/molit.js?x='+Date.now())).text();
for(const reg of (window.REGION_LIST||['busan','seoul','gyeonggi'])){if(window.FULL[reg])continue;const cs=await (await fetch('https://raw.githubusercontent.com/bid-archive/bid-archive.github.io/main/'+A1.REG[reg].src+'/cases.json?x='+Date.now())).json();
 window.LCASES=cs.map(c=>{const S=A1.REG[reg].SG;const sgs=S[c.gu]||S[(c.gu||'').split(' ')[0]]||[c.sg];return {pid:c.pid,sg:c.sg,sgs,dong:c.dong,lot:c.lot,m2:c.m2}});window.MDONE=false;(0,eval)(molitSrc);
 while(!window.MDONE)await new Promise(r=>setTimeout(r,3000));window.FULL[reg]=window.MOUT;window.FLOG=(window.FLOG||'')+reg+' ';}window.FDONE=true})();'full refresh started'
