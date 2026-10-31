#!/bin/bash
# 새 세션에서 작업 환경 복원: bash setup.sh
set -e
R=https://raw.githubusercontent.com/bid-archive/bid-archive.github.io/main
mkdir -p /home/claude/busan/src /home/claude/seoul/src /home/claude/gyeonggi/src /home/claude/out /home/claude/busan/_tools/js
cd /home/claude/busan
for f in gen.py build.py page.html regions.json taken.json; do curl -fsS -o $f "$R/_tools/$f?x=$RANDOM"; done
curl -fsS -o rights.json "$R/_tools/rights_busan.json"; curl -fsS -o kapt.json "$R/_tools/kapt_busan.json"
for f in a1_lib.js molit.js gh_listener.js; do curl -fsS -o _tools/js/$f "$R/_tools/js/$f?x=$RANDOM"; done
for d in seoul gyeonggi; do [ -f /home/claude/$d/kapt.json ] || echo '{}' > /home/claude/$d/kapt.json; [ -f /home/claude/$d/rights.json ] || echo '{}' > /home/claude/$d/rights.json; done
pull(){ for f in cases.json trades.txt rent.txt by.json; do curl -fsS -o $2/$f "$R/$1/$f?x=$RANDOM"; done; }
pull _src /home/claude/busan/src; pull _src_seoul /home/claude/seoul/src; pull _src_gg /home/claude/gyeonggi/src
echo setup-ok
