# bid.archive 매일 수집 런북 (예약 작업용)

전제: 대성님 PC 켜짐 + 크롬(Claude in Chrome) 연결 + 옥션원 로그인 상태. 비밀번호 입력 금지(로그아웃이면 중단·알림).
규칙: 옥션원 요청 간 10초 이상. 옥션원 화면·문구·사진은 공개 페이지에 옮기지 않음(우리 판정만).
국토부 키: claude.ai 프로젝트 문서 `auction-insta/_molit_key.txt` (출력·노출 금지).

## 0. 환경 복원 (컨테이너)
curl -fsS https://raw.githubusercontent.com/bid-archive/bid-archive.github.io/main/_tools/setup.sh | bash

## 1. 지역별 반복: busan → seoul → gyeonggi → daejeon
옥션원 탭(https://www.auction1.co.kr/auction/ca_list.php)에서 javascript_tool로:
1) `_tools/js/a1_lib.js` 내용 실행 → `await A1.loadPrev('<region>')` → `A1.collect('<region>')` 실행(비동기, window.LOG로 진행 확인; 끝나면 LCASES 길이 반환)
   - 호출이 45초 넘으면 끊기므로 `A1.collect(r).then(n=>window.CN=n)`처럼 백그라운드로 걸고 폴링
2) `A1.details(true).then(()=>{})` → 신규(이전 판정 없는) 물건만 상세 확인, `DLOG.length`/`DDONE` 폴링. `LOGGED_OUT`이면 중단·알림
3) 신규 물건 국토부: 옥션원 탭에 버튼 만들어 클릭(사용자 제스처) → `window.APIW=window.open('https://apis.data.go.kr/1613000/AptListService4/getSigunguAptList4','apisw')`
   - 새 탭에서: message 리스너(`e.data.L`→window.LCASES) 설치, 옥션원 탭에서 `APIW.postMessage({L:A1.newForMolit()},'https://apis.data.go.kr')`
   - 새 탭에서 `window.K='<키>'` 설정 후 `_tools/js/molit.js` 실행 → MDONE 폴링 → 옥션원 탭에서 `window.addEventListener('message',e=>{if(e.data&&e.data.MOUT)window.MOUT_NEW=e.data.MOUT})`를 미리 걸어두면 자동 수신
   - 신규 0건이면 생략(window.MOUT_NEW 비워둠)
4) 업로드: 옥션원 탭 버튼 클릭 → `window.GHW=window.open('https://github.com/bid-archive/bid-archive.github.io/upload/main/<src폴더>','ghw')`
   - GitHub 탭에서 `gh_listener.js` 실행 → 옥션원 탭에서 `GHW.postMessage({files:A1.mkFiles()},'https://github.com')` → GitHub 탭 'Commit changes' 클릭
   - src폴더: busan=_src, seoul=_src_seoul, gyeonggi=_src_gg, daejeon=_src_dj
5) `A1.summary()`로 집계 기록

## 2. 빌드·게시 (컨테이너)
setup.sh 다시 실행(새 src 받기) → `cd /home/claude/busan && for r in busan seoul gyeonggi daejeon; do python3 gen.py $r; python3 build.py $r; done`
→ GitHub upload/main/<region> 에 `/home/claude/busan/ghsite/<region>/index.html` 업로드·커밋(파일 입력에 file_upload) → 1~2분 뒤 bid-archive.github.io/<region>/ 반영 확인

## 3. 보고 (SendUserMessage, 개조식)
지역별: 전체 / 신규 / 빠진 물건 / 판정 집계 / 🔥 추천 변동(gen.py 출력) / 인수 위험 신건 / 실패·미확인
