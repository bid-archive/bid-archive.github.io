import sys,json,os
REG=sys.argv[1] if len(sys.argv)>1 else 'busan'
CFG=json.load(open('/home/claude/busan/regions.json'))[REG]
s=open(CFG['out']).read()
head='<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="color-scheme" content="light only">\n<meta name="description" content="이 아파트, 얼마에 낙찰될까? '+CFG['name']+' 아파트 경매 예상낙찰가를 매각 전에 공개합니다.">\n<meta property="og:title" content="bid.archive · 이 아파트, 얼마에 낙찰될까?">\n<meta property="og:description" content="예상낙찰가를 먼저 공개하고 결과로 증명합니다. 사건번호 DM @bid.archive">\n<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=e6e72570d5cf875f65a1e5e3c51b3eaa&libraries=services,clusterer&autoload=false"></script>\n'
i=s.index('</style>')+len('</style>'); out=head+s[:i]+'\n<style>:root{color-scheme:light}html,body{margin:0}img{max-width:100%}</style>\n</head>\n<body>\n'+s[i:]+'\n</body>\n</html>\n'
os.makedirs('/home/claude/busan/ghsite/'+REG,exist_ok=True);open('/home/claude/busan/ghsite/'+REG+'/index.html','w').write(out)
