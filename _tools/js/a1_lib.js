// bid.archive 옥션원 수집 라이브러리 — 옥션원 탭(로그인 상태)에서 실행. 대량 조회 금지: 요청 간 10초.
window.A1={};
A1.REG={
 busan:{src:'_src',courts:{2110:'부산',2111:'부산동부',2112:'부산서부'},sido:'부산광역시',
  SG:{"중구":["26110"],"서구":["26140"],"동구":["26170"],"영도구":["26200"],"부산진구":["26230"],"동래구":["26260"],"남구":["26290"],"북구":["26320"],"해운대구":["26350"],"사하구":["26380"],"금정구":["26410"],"강서구":["26440"],"연제구":["26470"],"수영구":["26500"],"사상구":["26530"],"기장군":["26710"]}},
 seoul:{src:'_src_seoul',courts:{1010:'서울중앙',1110:'서울동부',1210:'서울서부',1310:'서울남부',1410:'서울북부'},sido:'서울특별시',
  SG:{"종로구":["11110"],"중구":["11140"],"용산구":["11170"],"성동구":["11200"],"광진구":["11215"],"동대문구":["11230"],"중랑구":["11260"],"성북구":["11290"],"강북구":["11305"],"도봉구":["11320"],"노원구":["11350"],"은평구":["11380"],"서대문구":["11410"],"마포구":["11440"],"양천구":["11470"],"강서구":["11500"],"구로구":["11530"],"금천구":["11545"],"영등포구":["11560"],"동작구":["11590"],"관악구":["11620"],"서초구":["11650"],"강남구":["11680"],"송파구":["11710"],"강동구":["11740"]}},
 gyeonggi:{src:'_src_gg',courts:{1510:'의정부',1511:'고양',1512:'남양주',1610:'인천',1611:'부천',1710:'수원',1711:'성남',1712:'여주',1713:'평택',1714:'안산',1715:'안양'},sido:null,
  SG:{"인천 중구":["28125","28155"],"인천 동구":["28125"],"인천 미추홀구":["28177"],"인천 남구":["28177"],"인천 연수구":["28185"],"인천 남동구":["28200"],"인천 부평구":["28237"],"인천 계양구":["28245"],"인천 서구":["28275","28290"],"인천 검단구":["28290"],"인천 영종구":["28155"],"인천 제물포구":["28125"],"인천 강화군":["28710"],"인천 옹진군":["28720"],
  "수원시 장안구":["41111"],"수원시 권선구":["41113"],"수원시 팔달구":["41115"],"수원시 영통구":["41117"],"성남시 수정구":["41131"],"성남시 중원구":["41133"],"성남시 분당구":["41135"],"의정부시":["41150"],"안양시 만안구":["41171"],"안양시 동안구":["41173"],
  "부천시":["41192","41194","41196"],"부천시 원미구":["41192"],"부천시 소사구":["41194"],"부천시 오정구":["41196"],"광명시":["41210"],"평택시":["41220"],"동두천시":["41250"],"안산시 상록구":["41271"],"안산시 단원구":["41273"],"고양시 덕양구":["41281"],"고양시 일산동구":["41285"],"고양시 일산서구":["41287"],"과천시":["41290"],"구리시":["41310"],"남양주시":["41360"],"오산시":["41370"],"시흥시":["41390"],"군포시":["41410"],"의왕시":["41430"],"하남시":["41450"],"용인시 처인구":["41461"],"용인시 기흥구":["41463"],"용인시 수지구":["41465"],"파주시":["41480"],"이천시":["41500"],"안성시":["41550"],"김포시":["41570"],
  "화성시":["41591","41593","41595","41597"],"화성시 만세구":["41591"],"화성시 효행구":["41593"],"화성시 병점구":["41595"],"화성시 동탄구":["41597"],"광주시":["41610"],"양주시":["41630"],"포천시":["41650"],"여주시":["41670"],"연천군":["41800"],"가평군":["41820"],"양평군":["41830"]}}
};
A1.wk=new Worker(URL.createObjectURL(new Blob(["onmessage=e=>setTimeout(()=>postMessage(e.data[0]),e.data[1])"])));A1._sid=0;A1._res={};A1.wk.onmessage=e=>{const f=A1._res[e.data];delete A1._res[e.data];f&&f()};
A1.sl=ms=>new Promise(r=>{const i=++A1._sid;A1._res[i]=r;A1.wk.postMessage([i,ms])});
A1.dec=async u=>new TextDecoder('euc-kr').decode(await (await fetch(u)).arrayBuffer());
A1.cl=s=>s.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<br\s*\/?>/gi,' / ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
A1.parseList=h=>{const d=new DOMParser().parseFromString(h,'text/html');const css=[...d.querySelectorAll('style')].map(s=>s.textContent).join('\n');const hid=new Set();for(const m of css.matchAll(/\.([\w-]+)\s*\{([^}]*)\}/g)){if(/display\s*:\s*none|visibility\s*:\s*hidden/.test(m[2]))hid.add(m[1])}
 d.querySelectorAll('[style*="display:none"],[style*="display: none"]').forEach(e=>e.remove());hid.forEach(c=>d.querySelectorAll('.'+c).forEach(e=>e.remove()));
 const out=[];const seen=new Set();d.querySelectorAll('[onclick]').forEach(e=>{const m=(e.getAttribute('onclick')||'').match(/\w+\((\d{6,}),(\d+),(\d)\)/);if(!m||seen.has(m[1]))return;const tr=e.closest('tr');if(!tr)return;seen.add(m[1]);out.push([m[1],tr.textContent.replace(/\s+/g,' ').trim()])});
 const tm=h.match(/물건수\s*:\s*([\d,]+)/);return {rows:out,total:tm?+tm[1].replace(/,/g,''):null}};
A1.parseRow=(reg,pid,t,law)=>{const R=A1.REG[reg];const o={pid,court:R.courts[law]};let m=t.match(/^(\d{2})-(\d+)(?:\s*\((\d+)\))?\s*(\S+)/);if(!m)return {pid,err:'case'};o.case='20'+m[1]+'타경'+m[2];o.item=m[3]?+m[3]:null;
 let rest;if(reg==='gyeonggi'){m=t.match(/인천광역시\s+(\S+[구군])\s+(.*?)\s+(산?\d+(?:-\d+)?)(?:\s*외\s*\d+필지)?\s*,\s*(.*?)\[/);if(m){o.sido='인천';o.gu='인천 '+m[1];o.dong=m[2];o.lot=m[3];rest=m[4]}else{m=t.match(/경기도\s+(\S+[시군])\s+(?:(\S+구)\s+)?(.*?)\s+(산?\d+(?:-\d+)?)(?:\s*외\s*\d+필지)?\s*,\s*(.*?)\[/);if(m){o.sido='경기';o.gu=m[1]+(m[2]?' '+m[2]:'');o.dong=m[3];o.lot=m[4];rest=m[5]}}}
 else{m=t.match(new RegExp(R.sido+'\\s+(\\S+[구군])\\s+(.*?)\\s+(산?\\d+(?:-\\d+)?)(?:\\s*외\\s*\\d+필지)?\\s*,\\s*(.*?)\\['));if(m){o.gu=m[1];o.dong=m[2];o.lot=m[3];rest=m[4]}}
 if(rest==null)return {pid,err:'addr'};rest=rest.trim();const k=rest.match(/^(.*?)\s*((?:\S+동\s*)?(?:지하)?\d+층.*)$/);if(k){o.name=k[1].trim();o.ho=k[2].replace(/(\d+층)\s*/,'$1 ').replace(/\s+/g,' ').trim()}else{o.name=rest;o.ho=''}
 m=t.match(/건물\s*([\d.]+)㎡/);o.m2=m?+m[1]:null;const tags=[...t.matchAll(/\[([^\]]*)\]/g)].map(x=>x[1]);o.tags=(tags[1]||'').replace(/\s*\/?\s*공시가격[^\/]*$/,'').trim();
 m=t.match(/\]\s*(\d{1,3}(?:,\d{3})+)(\d{1,3}(?:,\d{3})+)\s*평당/);if(m){o.appr=+m[1].replace(/,/g,'');o.min=+m[2].replace(/,/g,'')}
 m=t.match(/유찰\s*(\d+)회/);o.fail=m?+m[1]:(/신건/.test(t)?0:null);m=t.match(/(\d{4})\.(\d\d)\.(\d\d)\(/);o.date=m?m[1]+'-'+m[2]+'-'+m[3]:null;
 const cs=R.SG[o.gu]||R.SG[(o.gu||'').split(' ')[0]]||null;o.sgs=cs;o.sg=cs?cs[0]:null;if(!o.min||!o.date||!o.sg)o.err=o.err||'field';return o};
// 1) 목록 수집: A1.collect('busan') → window.LCASES
A1.collect=async(reg)=>{const f=document.forms.fm_aulist;f.lawsup.value=Object.keys(A1.REG[reg].courts)[0];f.s_class.value='1';f.state.value='1,2,17,18';
 const h0=new TextDecoder('euc-kr').decode(await (await fetch('/auction/ca_list.php',{method:'POST',body:new URLSearchParams(new FormData(f))})).arrayBuffer());
 const m=h0.match(/href='(\/auction\/ca_list\.php[^']*start=20)'/);const base=m[1].replace(/&amp;/g,'&').replace(/total_record=\d+&/,'').replace(/ck_photo=1/,'ck_photo=0');
 window.ROWS={};window.LOG=[];for(const law of Object.keys(A1.REG[reg].courts)){await A1.sl(10000);const u=base.replace(/lawsup=[^&]*&/,'lawsup='+law+'&');const have=new Map();let start=0,total=1;
  while(have.size<total&&start<3000){const r=A1.parseList(await A1.dec(u.replace(/start=\d+/,'start='+start)));if(r.total!=null)total=r.total;r.rows.forEach(x=>have.set(x[0],x));LOG.push(law+'@'+start+':'+have.size+'/'+total);if(have.size>=total||!r.rows.length)break;start=have.size;await A1.sl(10000)}
  ROWS[law]=[...have.values()]}
 const L=[];const seen=new Set();for(const law in ROWS)for(const [pid,t] of ROWS[law]){if(seen.has(pid))continue;seen.add(pid);const o=A1.parseRow(reg,pid,t,law);if(o.err)continue;L.push(Object.assign(o,{raw:t}))}
 L.sort((a,b)=>a.date.localeCompare(b.date));window.LCASES=L;window.REGION=reg;return L.length};
// 2) 이전 데이터 불러오기 (GitHub raw, CORS 허용)
A1.loadPrev=async(reg)=>{const b='https://raw.githubusercontent.com/bid-archive/bid-archive.github.io/main/'+A1.REG[reg].src+'/';const g=async f=>(await fetch(b+f+'?x='+Date.now(),{cache:'no-store'})).text();
 window.PREV={cases:JSON.parse(await g('cases.json')),trades:await g('trades.txt'),rent:await g('rent.txt'),by:JSON.parse(await g('by.json'))};window.PREVP=Object.fromEntries(PREV.cases.map(c=>[c.pid,c]));return PREV.cases.length};
// 3) 신규 물건 상세(권리) 수집: 이전 판정 없는 pid만
A1.classify=(c,r)=>{const ten=r.ten||'',note=(r.note||'').replace(/주의사항/,''),tags=c.tags||'';const all=ten+' '+note;const o={hh:r.hh?+r.hh.replace(/,/g,''):null,use:r.use?+r.use:null,dongs:r.dongs?+r.dongs:null,wr:!!r.wr};
 const deps=[...ten.matchAll(/보\s*([\d,]+)원(?:\s*\/\s*월\s*[\d,]+원)?\s*(있음|없음|미상)/g)].map(m=>({d:+m[1].replace(/,/g,''),h:m[2]}));const waive=/대항력(은|을)?\s*포기|대항력을 포기/.test(all);
 const acc=/매수인에게 대항할 수 있는 임차인 있으며|매수인에게 대항할 수 있는[^.]{0,40}(임차권|전세권|임차인)/.test(all);const risk=/인수여지 있어 주의요함/.test(all);const other=[];
 if(/유치권/.test(note))other.push('유치권 신고');if(/법정지상권/.test(note))other.push('법정지상권');if(/가처분/.test(note)&&/소멸되지/.test(note))other.push('선순위 가처분');if(/가등기/.test(note)&&/소멸되지/.test(note))other.push('선순위 가등기');
 if(/지분/.test(tags))other.push('지분 매각');if(/대지권미등기/.test(tags))other.push('대지권 미등기');if(/위반건축/.test(tags))other.push('위반건축물');if((/토지별도등기인수/.test(tags)||/별도등기[^.]{0,40}인수/.test(note))&&!/구분지상권/.test(note))other.push('토지 별도등기 인수 조건');
 const noTen=/임차인이 없으며|조사된 임차내역 없음/.test(ten);const own=/소유자[^.]{0,20}(점유|전입)/.test(ten);const eok=n=>{const e=n/1e8;return e>=1?(Math.round(e*100)/100)+'억':Math.round(n/1e4).toLocaleString()+'만'};
 if(waive){o.status='인수없음';o.why='선순위 임차권 있으나 HUG가 대항력 포기 확약 → 인수 없음'}
 else if(acc){const a=Math.max(0,...deps.filter(x=>x.h==='있음').map(x=>x.d));const nm=note.match(/보증금\s*([\d,]+)원/);const amt=a||(nm?+nm[1].replace(/,/g,''):0);o.status='인수있음';o.burden=amt||null;o.why=amt?`대항력 임차인 보증금 ${eok(amt)}, 배당 부족분 낙찰자 인수 → 총부담 약 ${eok(amt)} 이상`:'대항력 임차인 있음(보증금 확인 필요), 배당 부족분 낙찰자 인수'}
 else if(risk||other.length){o.status='확인필요';o.why=(risk?['말소기준보다 먼저 전입한 세대(보증금·권리신고 불명) → 임차인이면 인수 가능']:[]).concat(other).join(' · ')}
 else{o.status='인수없음';o.why=noTen?(own?'소유자 점유·임차인 없음':'임차인 없음'):(deps.length||/전입일자/.test(ten)?'임차인 있으나 대항력 없음 → 명도 필요':'임차인 없음')}
 if(/구분지상권/.test(note))o.why+=' · 토지 구분지상권 인수(금전 부담 없음)';return o};
A1.details=async(onlyNew=true)=>{window.DT=window.DT||{};window.DLOG=[];const seg=(v,a,bs,max)=>{const i=v.indexOf(a);if(i<0)return '';let j=v.length;for(const b of bs){const k=v.indexOf(b,i+a.length);if(k>0&&k<j)j=k}return A1.cl(v.slice(i,Math.min(j,i+60000))).slice(0,max)};
 for(const c of LCASES){if(onlyNew&&window.PREVP&&PREVP[c.pid]&&PREVP[c.pid].rc)continue;if(DT[c.pid]&&!DT[c.pid].err)continue;try{const v=await A1.dec('/auction/ca_view.php?product_id='+c.pid+'&line_num=1&line_tnum=1&person_hide=0');
  if(/login_box/.test(v.slice(0,5000))){window.LOGGED_OUT=true;break}const flat=v.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');const g=re=>{const m=flat.match(re);return m?m[1]:null};
  const r={hh:g(/총세대수\s*([\d,]+)\s*세대/),use:g(/사용승인\s*(\d{4})년/),dongs:g(/총동수\s*(\d+)개동/)};const reg=seg(v,'등기부현황',['전문가멘트','관리비 등 체납','현장조사 보고서'],4000);const ni=reg.indexOf('주의사항');
  r.ten=seg(v,'임차인현황',['등기부현황'],1500);r.note=ni>=0?reg.slice(ni,ni+700).split('하루 보지 않기')[0]:'';r.cred=g(/채 권 자\s*(.{0,40}?)\s*구분/);r.wr=/우리은행|우리금융|우리에프앤아이|우리카드|우리캐피탈|더블유에스비|우리[가-힣]*유동화/.test(reg+' '+(r.cred||''));DT[c.pid]=r}catch(e){DT[c.pid]={err:String(e)}}
  DLOG.push(c.pid);await A1.sl(10000)}window.DDONE=true};
// 4) 업로드 파일 만들기: 이전 판정·실거래 재사용 + 신규 병합 (MOUT_NEW는 molit.js 결과)
A1.mkFiles=()=>{const out=LCASES.map(c=>{const o={pid:c.pid,court:c.court,case:c.case,item:c.item,name:c.name,sido:c.sido,gu:c.gu,dong:c.dong,lot:c.lot,ho:c.ho,m2:c.m2,appr:c.appr,min:c.min,fail:c.fail,date:c.date,sg:c.sg};
  const fl=[];if(/지분/.test(c.tags))fl.push('지분');if(/재매각/.test(c.tags))fl.push('재매각');if(/위반건축/.test(c.tags))fl.push('위반건축');if(/대지권미등기/.test(c.tags))fl.push('대지권미등기');o.flag=fl.join(',');
  const r=window.DT&&DT[c.pid];const p=window.PREVP&&PREVP[c.pid];if(r&&!r.err){const k=A1.classify(c,r);Object.assign(o,{rc:k.status,why:k.why,burden:k.burden||null,hh:k.hh,use:k.use,dongs:k.dongs})}else if(p){for(const f of ['rc','why','burden','hh','use','dongs'])o[f]=p[f]}return o});
 const keep=new Set(LCASES.map(c=>c.pid));const merge=(prev,neu)=>{const m=new Map();(prev||'').split('\n').filter(Boolean).forEach(l=>{const k=l.split('#')[0];if(keep.has(k))m.set(k,l)});(neu||'').split('\n').filter(Boolean).forEach(l=>m.set(l.split('#')[0],l));return [...m.values()].join('\n')};
 const N=window.MOUT_NEW||{trades:'',rent:'',by:'{}'};const by=Object.assign({},PREV?PREV.by:{},JSON.parse(N.by||'{}'));
 return [{name:'cases.json',text:JSON.stringify(out)},{name:'trades.txt',text:merge(PREV&&PREV.trades,N.trades)},{name:'rent.txt',text:merge(PREV&&PREV.rent,N.rent)},{name:'by.json',text:JSON.stringify(by)}]};
A1.newForMolit=()=>LCASES.filter(c=>!(window.PREVP&&PREVP[c.pid])).map(c=>({pid:c.pid,sg:c.sg,sgs:c.sgs,dong:c.dong,lot:c.lot,m2:c.m2}));
A1.summary=()=>{const fs=A1.mkFiles();const cs=JSON.parse(fs[0].text);const cnt={};cs.forEach(c=>cnt[c.rc||'미확인']=(cnt[c.rc||'미확인']||0)+1);const nw=LCASES.filter(c=>!(window.PREVP&&PREVP[c.pid])).length;
 const wr=LCASES.filter(c=>DT&&DT[c.pid]&&/우리/.test(DT[c.pid].cred||'')).map(c=>c.court+' '+c.case+' '+c.name);return {total:cs.length,new:nw,gone:window.PREV?PREV.cases.filter(c=>!LCASES.find(x=>x.pid===c.pid)).length:null,rc:cnt,companyRelated:wr}};
'A1 loaded'
