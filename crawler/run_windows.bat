@echo off
chcp 65001 > nul
REM 해피씨쀼 이벤트 수집기 - 내 PC(윈도우)에서 직접 돌릴 때
cd /d %~dp0
if not exist .venv (
  python -m venv .venv
  .venv\Scripts\pip install -r requirements.txt
  .venv\Scripts\python -m playwright install chromium
)
.venv\Scripts\python crawl.py
.venv\Scripts\python build_site_data.py
echo.
echo 완료! 저장소 루트의 live-events.js 가 갱신됐어요. GitHub Desktop 에서 커밋/푸시하세요.
pause
