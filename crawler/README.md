# 금융사 이벤트 자동 수집기 (해피씨쀼 재테크 허브)

국내 은행·증권사 35곳의 "진행중 이벤트" 페이지를 매일 자동으로 확인합니다.
수집한 이벤트는 ISA / 연금저축 / IRP / CMA·파킹 / 예적금으로 분류해 홈페이지에 반영합니다.

## 홈페이지에서 달라지는 점
1. **탭마다 '📡 실시간 이벤트 레이더'가 생깁니다.** 금융사, 이벤트명, 기간, D-day, 링크를 보여 주고 증권사/은행/새 이벤트로 필터링할 수 있어요.
2. **ISA·연저펀·IRP 이벤트 카드가 자동으로 갱신됩니다.** `data.js`에 직접 적은 카드가 기간 만료(expiry가 지남)이거나 '준비중'이면 최신 수집 이벤트로 바꿔서 보여 줍니다.
   - 아직 기간이 남은 카드는 그대로 둡니다. 직접 정리한 내용이 항상 우선이에요.
   - `data.js`에 없는 금융사(토스·유안타·iM 등)라도 해당 이벤트가 있으면 카드가 추가됩니다.
   - `data.js` 파일은 건드리지 않고, 화면에 보여 줄 때만 덮어씁니다.

## 설치 (최초 1회)
저장소(happyc-finance-hub) 루트에 아래 파일을 그대로 복사하고 커밋/푸시하세요.
```
index.html                        ← <script> 두 줄만 추가됨 (data.js 바로 아래)
live-events.js                    ← 수집 결과 (자동 생성)
live-events-ui.js                 ← 레이더 화면 + 카드 자동 교체
crawler/                          ← 수집 프로그램
.github/workflows/update-events.yml ← 매일 자동 실행
```
그다음 GitHub 저장소에서 **Settings → Actions → General → Workflow permissions → "Read and write permissions"**를 체크하세요.
수집 결과를 커밋하려면 이 권한이 필요합니다.

## 자동 실행
- 매일 **오전 7시, 오후 6시(한국시간)**에 GitHub Actions가 돌아요. 수집이 끝나면 `live-events.js`를 커밋하고, GitHub Pages에 자동으로 반영됩니다.
- 바로 돌리고 싶으면 **Actions 탭 → "금융사 이벤트 자동 수집" → Run workflow**를 누르세요.
- 실패한 금융사는 Actions 실행 결과의 `debug-screenshots` 아티팩트에서 화면을 확인할 수 있어요.

## 내 PC에서 돌리기 (선택)
- 윈도우: `crawler/run_windows.bat` 더블클릭 (파이썬 3.10 이상 필요)
- 맥/리눅스:
  ```
  pip install -r crawler/requirements.txt && python -m playwright install chromium
  python crawler/crawl.py && python crawler/build_site_data.py
  ```
- 일부만 다시 수집: `python crawler/crawl.py 키움 삼성` (기존 결과에 합쳐짐)

## 금융사 추가/수정
`crawler/sources.json`에 한 줄을 추가하면 됩니다.
```json
{"name":"OO증권","type":"증권사","url":"진행중 이벤트 목록 주소"}
```
| 옵션 | 의미 |
|---|---|
| `"mobile": true` | 모바일 화면으로 열기 (m. 사이트) |
| `"mode": "notice"` | 이벤트 목록이 없어서 공지사항 중 '이벤트' 글만 뽑기 |
| `"loose": true` | 목록에 기간 표시가 없는 사이트 |
| `"disabled": true` | 수집 제외 |

## 한계 (꼭 알아두기)
- **자동으로 나오는 정보는 이벤트 이름, 기간, 링크, 금액 힌트뿐입니다.** '순입금 500만 원 → 상품권 2만 원' 같은 세부 조건은 이벤트 이미지 안에 있어서 읽지 못해요. 메인 추천·세부 조건은 지금처럼 직접 정리해야 합니다.
- **분류는 제목 키워드로만 합니다.** "절세계좌 이벤트"처럼 ISA/연금이 섞인 제목은 두 탭에 다 나올 수 있어요.
- **웹에 이벤트 목록이 없어 수집이 안 되거나 약한 곳이 있습니다.**
  - 카카오뱅크: 수집 불가 (앱 전용)
  - 토스증권·토스뱅크·케이뱅크·카카오페이증권·수협: 공지사항만 확인
  - LS증권: 봇 차단 때문에 가끔 실패
- 금융사가 홈페이지를 개편하면 URL이 바뀔 수 있어요. Actions 로그에 `!!`로 표시된 곳을 확인해서 `sources.json`의 주소를 고쳐 주세요.
