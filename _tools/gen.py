import json, re, statistics, pathlib, sys, os
REG=sys.argv[1] if len(sys.argv)>1 else 'busan'
CFG=json.load(open('/home/claude/busan/regions.json'))[REG]
os.chdir(CFG['dir'])
TODAY="2026-10-31"; CUT="25.10.31"
T={}
for l in open('src/trades.txt'):
    c,s=l.rstrip('\n').split('#')
    rows=[x.split(',') for x in s.split(' ') if x]
    T[c]=[(d[:2]+'.'+d[2:4]+'.'+d[4:],int(f),int(a)*100000,int(z[3]) if len(z)>3 and z[3].isdigit() else None,1 if 'D' in z[3:] else 0) for z in rows for d,f,a in [z[:3]]]
R={}
for l in open('src/rent.txt'):
    c,j,w=l.rstrip('\n').split('#')
    fd=lambda d:d[:2]+'.'+d[2:4]+'.'+d[4:]
    J=[[fd(a),int(f),int(dep)*10000,t] for a,f,dep,t in (z.split(',') for z in j.split(' ') if z)]
    W=[[fd(a),int(f),int(dep)*10000,int(r),t] for a,f,dep,r,t in (z.split(',') for z in w.split(' ') if z)]
    R[c]=(J,W)
def enrich(x):
    case=x['case']; fl=x.get('fl')
    tra=T.get(case,[])
    tr=[t for t in tra if not t[4]]
    if case in R: x['jr'],x['wr']=R[case]
    sizes={t[3] for t in tr if t[3]}
    mixed=bool(sizes) and max(sizes)-min(sizes)>3
    x['tr']=[[t[0],t[1],t[2],t[3]]+([1] if t[4] else []) if (t[3] or t[4]) else [t[0],t[1],t[2]] for t in tra]; x['mixed']=mixed; x['mktN']=len(tr); x['dirN']=len(tra)-len(tr)
    if tr and not mixed:
        y1=[t for t in tr if t[0]>=CUT]
        x['last']=[tr[0][0],tr[0][1],tr[0][2]]
        if fl:
            sim=[t for t in tr if abs(t[1]-fl)<=3]
            if sim and sim[0]!=tr[0]: x['sim']=[sim[0][0],sim[0][1],sim[0][2]]
            x['simN']=len([t for t in y1 if abs(t[1]-fl)<=3])
        if y1:
            a=[t[2] for t in y1]
            x['y1']=dict(n=len(a),avg=int(sum(a)/len(a)),lo=min(a),hi=max(a))
            x['mkt']=int(sum(a)/len(a)); x['conf']=len(a)>=3; x['basis']='1년 평균'
        else:
            x['mkt']=tr[0][2]; x['basis']='최근 거래'

BY=json.load(open('src/by.json'))
KA=json.load(open('kapt.json'))
SRC=json.load(open('src/cases.json'))
TK=json.load(open('/home/claude/busan/taken.json'))
TAKEN=set(TK['cases'])
RJ=json.load(open('rights.json'))
PICK={"2025타경5437":dict(rec=True,pred=350000000,note="같은 단지 5월 낙찰 18명 입찰"),"2025타경102229":dict(rec=True,pred=145000000),"2025타경101933":dict(rec=True,pred=None)}
D=[]
cnt={}
for c in SRC: cnt[c['case']]=cnt.get(c['case'],0)+1
for c in SRC:
    ho=c.get('ho') or ''
    nm=c['name']
    if not ho:
        mm=re.match(r'^(.*?)\s+((?:\S+동\s+)?\S*\d+호.*)$',nm)
        if mm: nm,ho=mm.group(1),mm.group(2)
    fl=re.search(r'(\d+)층',ho); fl=int(fl.group(1)) if fl and '지하' not in ho else (0 if '지하' in ho else None)
    case=c['case']+(f"({c['item']})" if c.get('item') and cnt[c['case']]>1 else '')
    x=dict(court=c['court'],case=case,pid=c['pid'],name=nm,gu=c['gu'],dong=c['dong'],ho=ho,m2=round(c['m2'],1) if c.get('m2') else None,
           fl=fl,date=c['date'],appr=c['appr'],min=c['min'],fail=c['fail'],flag=c.get('flag') or '',
           addr=f"{c.get('sido') or CFG['name']} {c['gu']} {c['dong']} {c['lot']}",mkt=None,mktN=0,conf=False,tr=[],rec=False,pred=None)
    x['by']=BY.get(c['sg']+':'+c['dong']+'|'+c['lot']) or (str(c['use']) if c.get('use') else None)
    T.setdefault(case,T.pop(c['pid'],[]));
    if c['pid'] in R: R[case]=R.pop(c['pid'])
    enrich(x)
    x['tr']=x['tr'][:40]
    if x.get('jr'): x['jr']=x['jr'][:30]
    if x.get('wr'): x['wr']=x['wr'][:30]
    k=KA.get(c['case'])
    if k: x['hh']=int(k[1]); x['dongs']=int(k[2]); x['park']=k[4]
    elif c.get('hh'): x['hh']=c['hh']; x['dongs']=c.get('dongs'); x['park']=None
    r=RJ.get(c['case']) if cnt[c['case']]==1 else None
    if r:
        x['rc']=r['status']; x['rwhy']=r['why'].replace(' · 채권자 우리은행(회사 관련)','')
        if r.get('burden'): x['burden']=r['burden']
        if r.get('flag') and not x['flag']: x['flag']=r['flag']
    elif c.get('rc'):
        x['rc']=c['rc']; x['rwhy']=c.get('why','')
        if c.get('burden'): x['burden']=c['burden']
    if c['case'] in PICK and cnt[c['case']]==1: x.update(PICK[c['case']]); x['rights']=True
    x['taken']=c['case'] in TAKEN
    D.append(x)
for x in D:
    d = 1-x['min']/x['mkt'] if x['mkt'] else None
    x['cand'] = bool(x['conf'] and (x.get('y1') or {}).get('n',0)>=(max(5,min(10,-(-x['hh']*2//100))) if x.get('hh') else 10) and d is not None and d>=CFG.get('disc',.2) and (x['fail'] or 0)>=1 and not x['flag'] and x['m2'] and 40<=x['m2']<=135 and (x['fl'] or 0)>=2 and (x.get('hh') is None or x['hh']>=300)) and not x['rec'] and x.get('rc')=='인수없음'
TABS='<div class="regions" role="tablist" aria-label="지역">'+''.join((f'<a class="rg on" href="/{k}/" aria-current="page">{v["name"]}</a>' if k==REG else f'<a class="rg" href="/{k}/">{v["name"]}</a>') for k,v in json.load(open('/home/claude/busan/regions.json')).items())+'</div>'
html=pathlib.Path('/home/claude/busan/page.html').read_text().replace('__TABS__',TABS).replace('__REQ__',(f'<div class="reqchip">누적 의뢰 <b>{TK["total"]:,}</b>건 · 사건당 1명</div>' if TK['total']>=TK.get('show_from',30) else '')).replace('__REGION__',CFG['name']).replace('__DRAFT__',CFG['draft']).replace('__COURTN__',json.dumps(CFG['courtn'],ensure_ascii=False)).replace('__CENTER__',CFG['center']).replace('__DISC__',str(round(CFG.get('disc',.2)*100))).replace('__DATA__',json.dumps(D,ensure_ascii=False)).replace('__N__',str(len(D)))
pathlib.Path(CFG['out']).write_text(html)
print(len(D), sum(x['cand'] for x in D), [x['name'] for x in D if x['cand']])
