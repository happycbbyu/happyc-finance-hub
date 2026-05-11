// ============================================================
//  해피씨쀼 재테크 허브 데이터
//  매달 캡처 → Claude에게 전달 → 자동 업데이트
//  탭: CMA·파킹통장 / 예적금 / 중개형ISA / 연금저축펀드 / IRP
//  ※ 금리/이벤트는 수시 변경되니 공식 사이트에서 최종 확인
// ============================================================

const ISA_DATA = {
  lastUpdated: "2026년 5월",

  cta: {
    community: { url:"https://open.kakao.com/o/g93hXh1g", pw:"happy486" },
    study:     { url:"https://open.kakao.com/o/gDed7qci" },
    coaching:  { url:"https://exciting-bull-fff.notion.site/1on1coach?source=copy_link" },
    master:    { url:"https://cafe.naver.com/happybox55/2200?tc=shared_link" },
  },

  // 탭별 스터디클럽 CTA 문구
  studyCopy: {
    cma:     "아직 투자를 한번도 해보지 않았다면?",
    savings: "예적금만으로 1억 모으기 어려워요. 탈출방법이 알고 싶다면?",
    isa:     "ISA에서 뭘 사야할지 모르겠다면?",
    pension: "연저펀에서 뭘 사야할지 모르겠다면?",
    irp:     "노후준비 지금부터 해야하나요?",
  },

  // ══════════════════════════════════════════════════════════
  //  TAB 1 : CMA · 파킹통장  (2026.05 기준)
  // ══════════════════════════════════════════════════════════
  cma: {
    ready: true,
    lastUpdated: "2026년 5월",
    sourceUrl: "https://www.finuts.co.kr/html/bank/product.php",

    parking: [
      { name:"토스뱅크",          product:"토스뱅크 통장",           emoji:"🟦", basicRate:"2.30%", maxRate:"2.30%", maxCondition:"조건 없음",             limit:"한도 없음",   payMethod:"매일",   protect:true,  url:"https://www.tossbank.com" },
      { name:"케이뱅크",          product:"플러스박스",               emoji:"🟣", basicRate:"2.30%", maxRate:"2.30%", maxCondition:"조건 없음",             limit:"한도 없음",   payMethod:"매일",   protect:true,  url:"https://www.kbank.co.kr" },
      { name:"카카오뱅크",        product:"세이프박스",               emoji:"🟡", basicRate:"2.00%", maxRate:"2.00%", maxCondition:"조건 없음",             limit:"1억원",       payMethod:"매일",   protect:true,  url:"https://www.kakaobank.com" },
      { name:"SC제일은행",        product:"My입출금 통장",            emoji:"🔵", basicRate:"1.50%", maxRate:"3.00%", maxCondition:"신규 3개월 한정",       limit:"5천만원",     payMethod:"월말",   protect:true,  url:"https://www.standardchartered.co.kr" },
      { name:"KB국민은행",        product:"KB마이핏통장",             emoji:"🟡", basicRate:"1.00%", maxRate:"2.00%", maxCondition:"급여이체 조건",         limit:"3천만원",     payMethod:"월말",   protect:true,  url:"https://www.kbstar.com" },
      { name:"신한은행",          product:"신한 쏠편한 입출금",        emoji:"🔵", basicRate:"1.00%", maxRate:"1.80%", maxCondition:"자동이체 등록",         limit:"3천만원",     payMethod:"월말",   protect:true,  url:"https://www.shinhan.com" },
      { name:"우리은행",          product:"WON파킹통장",              emoji:"🔵", basicRate:"1.50%", maxRate:"1.50%", maxCondition:"조건 없음",             limit:"5천만원",     payMethod:"매일",   protect:true,  url:"https://www.wooribank.com" },
      { name:"하나은행",          product:"하나 머니Box",             emoji:"🟢", basicRate:"1.50%", maxRate:"2.00%", maxCondition:"청약·적금 연결 시",     limit:"1억원",       payMethod:"매일",   protect:true,  url:"https://www.kebhana.com" },
    ],

    cmaList: [
      { name:"한국투자증권",   app:"BanKIS",   emoji:"🔴", rate:"3.40%", type:"RP형",   payMethod:"매일",   protect:false, note:"가장 높은 수준",  url:"https://www.truefriend.com" },
      { name:"삼성증권",       app:"mPOP",     emoji:"🔵", rate:"3.35%", type:"RP형",   payMethod:"매일",   protect:false, note:"",               url:"https://www.samsungpop.com" },
      { name:"미래에셋증권",   app:"M-Stock",  emoji:"🟠", rate:"3.25%", type:"MMW형",  payMethod:"매일",   protect:false, note:"ETF형 선택 가능", url:"https://securities.miraeasset.com" },
      { name:"NH투자증권",     app:"나무",     emoji:"🟢", rate:"3.20%", type:"RP형",   payMethod:"매일",   protect:false, note:"",               url:"https://www.mynamuh.com" },
      { name:"KB증권",         app:"Mable",    emoji:"🟡", rate:"3.20%", type:"RP형",   payMethod:"매일",   protect:false, note:"",               url:"https://www.kbsec.com" },
      { name:"키움증권",       app:"영웅문S#", emoji:"🔴", rate:"3.15%", type:"RP형",   payMethod:"매일",   protect:false, note:"",               url:"https://www.kiwoom.com" },
    ],

    recommendations: {
      top1: { name:"한국투자증권 CMA-RP", emoji:"🔴", rate:"3.40%", reason:"증권사 CMA 중 최고 금리, 매일 이자 지급", tag:"고수익 원하는 분" },
      top2: { name:"토스뱅크 통장",       emoji:"🟦", rate:"2.30%", reason:"예금자보호 + 조건 없이 매일 이자, 입출금 자유", tag:"안전하게 파킹하고 싶은 분" },
      top3: { name:"케이뱅크 플러스박스", emoji:"🟣", rate:"2.30%", reason:"한도 없이 2.3%, 앱 편의성 우수", tag:"한도 없이 넣고 싶은 분" },
    },
  },

  // ══════════════════════════════════════════════════════════
  //  TAB 2 : 예적금  (2026.05 기준)
  // ══════════════════════════════════════════════════════════
  savings: {
    ready: true,
    lastUpdated: "2026년 5월",
    sourceUrl: "https://portal.kfb.or.kr/compare/receiving_deposit_3.php",

    deposits: [
      { bank:"토스뱅크",        product:"토스뱅크 정기예금",    emoji:"🟦", rate_6m:"3.50%", rate_12m:"3.60%", rate_24m:"3.40%", maxRate:"3.60%", maxCondition:"-",           limit:"없음",   url:"https://www.tossbank.com",   note:"비대면 가입" },
      { bank:"카카오뱅크",      product:"카카오뱅크 정기예금",  emoji:"🟡", rate_6m:"3.40%", rate_12m:"3.50%", rate_24m:"3.30%", maxRate:"3.50%", maxCondition:"-",           limit:"없음",   url:"https://www.kakaobank.com",  note:"" },
      { bank:"케이뱅크",        product:"코드K 정기예금",       emoji:"🟣", rate_6m:"3.30%", rate_12m:"3.45%", rate_24m:"3.25%", maxRate:"3.45%", maxCondition:"-",           limit:"없음",   url:"https://www.kbank.co.kr",    note:"" },
      { bank:"신한은행",        product:"쏠편한 정기예금",       emoji:"🔵", rate_6m:"2.90%", rate_12m:"3.10%", rate_24m:"3.00%", maxRate:"3.30%", maxCondition:"우대금리 조건", limit:"없음",   url:"https://www.shinhan.com",    note:"" },
      { bank:"KB국민은행",      product:"KB Star 정기예금",     emoji:"🟡", rate_6m:"2.85%", rate_12m:"3.05%", rate_24m:"2.95%", maxRate:"3.20%", maxCondition:"급여이체 등",   limit:"없음",   url:"https://www.kbstar.com",     note:"" },
      { bank:"하나은행",        product:"하나의 정기예금",       emoji:"🟢", rate_6m:"2.90%", rate_12m:"3.10%", rate_24m:"3.00%", maxRate:"3.25%", maxCondition:"우대조건 충족", limit:"없음",   url:"https://www.kebhana.com",    note:"" },
      { bank:"우리은행",        product:"WON플러스예금",         emoji:"🔵", rate_6m:"2.85%", rate_12m:"3.05%", rate_24m:"2.95%", maxRate:"3.15%", maxCondition:"-",           limit:"없음",   url:"https://www.wooribank.com",  note:"" },
      { bank:"NH농협은행",      product:"NH왈츠회전예금II",     emoji:"🟢", rate_6m:"2.80%", rate_12m:"3.00%", rate_24m:"2.90%", maxRate:"3.10%", maxCondition:"-",           limit:"없음",   url:"https://banking.nonghyup.com", note:"" },
      { bank:"SBI저축은행",     product:"사이다뱅크 정기예금",  emoji:"🟠", rate_6m:"3.80%", rate_12m:"4.10%", rate_24m:"3.90%", maxRate:"4.10%", maxCondition:"-",           limit:"5천만원", url:"https://www.sbisavingsbank.com", note:"예금자보호 5천만원" },
      { bank:"OK저축은행",      product:"OK정기예금",           emoji:"🔴", rate_6m:"3.75%", rate_12m:"4.00%", rate_24m:"3.80%", maxRate:"4.00%", maxCondition:"-",           limit:"5천만원", url:"https://www.oksavingsbank.com",  note:"예금자보호 5천만원" },
    ],

    installments: [
      { bank:"카카오뱅크",   product:"26주 적금",           emoji:"🟡", basicRate:"3.50%", maxRate:"5.00%", maxCondition:"26주 완납 시",         period:"26주",   monthlyLimit:"30만원",   url:"https://www.kakaobank.com",  note:"소액 목돈 만들기 최적" },
      { bank:"토스뱅크",     product:"키워봐요 적금",         emoji:"🟦", basicRate:"4.00%", maxRate:"4.00%", maxCondition:"조건 없음",            period:"12개월", monthlyLimit:"30만원",   url:"https://www.tossbank.com",   note:"" },
      { bank:"케이뱅크",     product:"코드K 자유적금",        emoji:"🟣", basicRate:"3.50%", maxRate:"4.50%", maxCondition:"자동이체 우대",        period:"12개월", monthlyLimit:"50만원",   url:"https://www.kbank.co.kr",    note:"" },
      { bank:"KB국민은행",   product:"KB 스타적금",           emoji:"🟡", basicRate:"3.20%", maxRate:"4.00%", maxCondition:"자동이체+급여",        period:"12개월", monthlyLimit:"50만원",   url:"https://www.kbstar.com",     note:"" },
      { bank:"신한은행",     product:"쏠편한 정기적금",        emoji:"🔵", basicRate:"3.10%", maxRate:"3.80%", maxCondition:"자동이체 등록",        period:"12개월", monthlyLimit:"50만원",   url:"https://www.shinhan.com",    note:"" },
      { bank:"하나은행",     product:"하나 주거래 적금",      emoji:"🟢", basicRate:"3.20%", maxRate:"3.90%", maxCondition:"하나머니Box 연결",     period:"12개월", monthlyLimit:"50만원",   url:"https://www.kebhana.com",    note:"" },
      { bank:"SBI저축은행",  product:"사이다 적금",           emoji:"🟠", basicRate:"4.20%", maxRate:"4.50%", maxCondition:"자동이체",             period:"12개월", monthlyLimit:"30만원",   url:"https://www.sbisavingsbank.com", note:"고금리 특판 수시 출시" },
      { bank:"청년도약계좌", product:"청년도약계좌 (정책)",   emoji:"🏆", basicRate:"연 최대 6%", maxRate:"연 최대 6% + 정부기여금", maxCondition:"만 19~34세, 소득요건", period:"60개월", monthlyLimit:"70만원", url:"https://ylaccount.kinfa.or.kr", note:"정부기여금 월 최대 2.4만원 추가" },
    ],

    recommendations: {
      top1: { name:"토스뱅크 정기예금",  emoji:"🟦", rate:"3.60%", reason:"12개월 기준 인터넷뱅크 최고금리, 조건 없음", tag:"목돈 안전하게 맡길 분" },
      top2: { name:"카카오뱅크 26주 적금", emoji:"🟡", rate:"최고 5.00%", reason:"소액(월 30만)으로 26주 완납 시 5% 도달", tag:"소액으로 재테크 습관 만들 분" },
      top3: { name:"SBI저축은행 사이다뱅크", emoji:"🟠", rate:"4.10%", reason:"1금융권 대비 1%p+ 높은 금리, 예금자보호 5천만", tag:"5천만원 이내에서 고금리 원하는 분" },
    },
  },

  // ══════════════════════════════════════════════════════════
  //  TAB 3 : 중개형 ISA  (실 데이터)
  // ══════════════════════════════════════════════════════════
  isa: {
    ready: true,
    lastUpdated: "2026년 5월",
    capital: [
      { rank:1,  name:"한국투자증권", app:"BanKIS",    capital2025:"11조 1,622억", capital2024:"9조 3,168억",  change:"+20" },
      { rank:2,  name:"미래에셋증권", app:"M-Stock",   capital2025:"10조 4,139억", capital2024:"9조 9,124억",  change:"+5"  },
      { rank:3,  name:"NH투자증권",   app:"나무",       capital2025:"8조 6,128억",  capital2024:"7조 3,921억",  change:"+17" },
      { rank:4,  name:"삼성증권",     app:"mPOP",      capital2025:"7조 6,445억",  capital2024:"6조 9,305억",  change:"+10" },
      { rank:5,  name:"메리츠증권",   app:"메리츠ON",   capital2025:"7조 5,352억",  capital2024:"6조 2,977억",  change:"+20" },
      { rank:6,  name:"KB증권",       app:"Mable",     capital2025:"6조 6,927억",  capital2024:"6조 6,796억",  change:"+0.2"},
      { rank:7,  name:"하나증권",     app:"하나원큐",   capital2025:"6조 1,014억",  capital2024:"5조 9,610억",  change:"+2"  },
      { rank:8,  name:"키움증권",     app:"영웅문S#",   capital2025:"6조 821억",    capital2024:"4조 9,716억",  change:"+22" },
      { rank:9,  name:"신한투자증권", app:"SOL",        capital2025:"5조 6,823억",  capital2024:"5조 3,897억",  change:"+5"  },
      { rank:10, name:"대신증권",     app:"크레온",     capital2025:"4조 1,315억",  capital2024:"3조 1,128억",  change:"+33" },
    ],
    fees: [
      { name:"미래에셋증권", app:"M-Stock",   logo:"images/03_mirae_logo.png",   fee:"0.003640%", period:"평생",            note:"ETF도 동일 우대율 (유일)", status:"active" },
      { name:"한국투자증권", app:"BanKIS",    logo:"images/03_hanto__logo.png",   fee:"0.004209%", period:"평생",            note:"",                         status:"active" },
      { name:"삼성증권",     app:"mPOP",      logo:"images/03_samsung_logo.png",  fee:"0.004209%", period:"평생",            note:"",                         status:"active" },
      { name:"신한투자증권", app:"SOL",        logo:"images/03_sinhan_logo.png",  fee:"0.004209%", period:"평생",            note:"",                         status:"active" },
      { name:"NH투자증권",   app:"나무",       logo:"images/03_nh_logo.png",       fee:"0.004901%", period:"개설 후 12개월", note:"기간 종료 후 0.01%",       status:"active" },
      { name:"KB증권",       app:"Mable",     logo:"images/03_KB_logo.png",       fee:"0.005048%", period:"평생*",          note:"개설 후 3개월 내 신청",    status:"active" },
      { name:"키움증권",     app:"영웅문S#",   logo:"images/03_kiwoon_logo.png",   fee:"0.01500%",  period:"우대 없음",      note:"수수료 우대 이벤트 없음",  status:"check"  },
      { name:"하나증권",     app:"하나원큐",   logo:"images/03_hana_logo.png",     fee:"확인 필요", period:"확인 필요",       note:"",                         status:"check"  },
      { name:"메리츠증권",   app:"메리츠ON",   logo:"images/03_meritz_logo.jpg",   fee:"확인 필요", period:"확인 필요",       note:"",                         status:"check"  },
      { name:"대신증권",     app:"크레온",     logo:"images/03_daesin_logo.png",   fee:"확인 필요", period:"평생 우대",       note:"수수료 평생우대 진행중",   status:"check"  },
    ],
    events: [
      { name:"미래에셋증권", app:"M-Stock",    logo:"images/03_mirae_logo.png",  color:"#e87722", eventPageUrl:"https://securities.miraeasset.com/hki/hki7000/r05.do",
        newCustomer:{ status:"active", eventName:"ISA Welcome & 우대금리 이벤트", expiry:"2026.06.30", maxBenefit:"최대 약 20만원+",
          conditions:[{ type:"웰컴",    amount:"개설 후 15일 내 신청",      reward:"투자지원금 2만원 (전원)" },{ type:"우대금리", amount:"신규개설 후 3개월 내 입금", reward:"90일 우대금리 지원" },{ type:"순입금",  amount:"수익금 500만원 이상 실현", reward:"최대 25만원 (전원)" }],
          transfer:"이전금액 2배 인정", tags:["웰컴이벤트","순입금이벤트","계좌이전"] }, existingCustomer:null },
      { name:"한국투자증권", app:"BanKIS",     logo:"images/03_hanto__logo.png", color:"#f0431e", eventPageUrl:"https://www.truefriend.com/main/customer/notice/Event.jsp?gubun=i",
        newCustomer:{ status:"active", eventName:"뱅키스 ISA 신규개설 & ETF 이벤트", expiry:"2026.06.30", maxBenefit:"최대 50만원",
          conditions:[{ type:"신규개설", amount:"100만원 이상 입금", reward:"월배당 ETF 1주 (전원)" },{ type:"순입금", amount:"500만원~", reward:"신세계 상품권 2만~30만원" },{ type:"공모주", amount:"연간 1,000만원 이상", reward:"공모주 청약 한도 200% 우대" }],
          transfer:"이전금액 2배 인정", tags:["신규개설이벤트","순입금이벤트","계좌이전"] }, existingCustomer:{ status:"active", eventName:"뱅키스 ISA ETF 이벤트", expiry:"2026.06.30", maxBenefit:"최대 50만원", conditions:[{ type:"순입금", amount:"신규/기존 동일 조건", reward:"최대 50만원" }], tags:["순입금이벤트"] } },
      { name:"NH투자증권",   app:"나무",        logo:"images/03_nh_logo.png",     color:"#00a651", eventPageUrl:"https://m.mynamuh.com/customer/event/eventList",
        newCustomer:{ status:"active", eventName:"나무랄 데 없는 중개형ISA 시즌4", expiry:"2026.12.31", maxBenefit:"최대 30만원",
          conditions:[{ type:"순입금", amount:"이마트 상품권", reward:"1만원 (개설 시)" },{ type:"순입금", amount:"구간별 순입금", reward:"최대 30만원" }],
          transfer:"1천만원 이상 이전 시 2배 인정", tags:["순입금이벤트","계좌이전"] }, existingCustomer:null },
      { name:"삼성증권",     app:"mPOP",        logo:"images/03_samsung_logo.png",color:"#1428a0", eventPageUrl:"https://www.samsungpop.com/",
        newCustomer:{ status:"active", eventName:"삼성증권 ISA 절세응원 이벤트", expiry:"공식 페이지 확인", maxBenefit:"최대 30만원+",
          conditions:[{ type:"신규개설", amount:"신규 개설", reward:"상품권 5,000원 (전원)" },{ type:"순입금", amount:"100만원 이상", reward:"상품권 1만원" },{ type:"순입금", amount:"1,000만원 이상", reward:"상품권 3만원~" }],
          transfer:"이전금액 2배 인정", tags:["신규개설이벤트","순입금이벤트"] },
        existingCustomer:{ status:"active", eventName:"Re-Start 이벤트", expiry:"공식 페이지 확인", maxBenefit:"최대 30만원+", conditions:[{ type:"순입금", amount:"기존고객 동일 조건", reward:"최대 30만원~" }], tags:["순입금이벤트"] } },
      { name:"KB증권",       app:"Mable",       logo:"images/03_KB_logo.png",     color:"#ffb81c", eventPageUrl:"https://www.kbsec.com/go.able?linkcd=m06090002",
        newCustomer:{ status:"active", eventName:"2026 중개형ISA 신규 이벤트", expiry:"2026.12.31", maxBenefit:"공식 페이지 확인",
          conditions:[{ type:"신규개설", amount:"신계약 이벤트", reward:"2026.03~05 진행" },{ type:"순입금", amount:"상반기 신규", reward:"연중 진행" }],
          transfer:"이전금액 2배 인정", tags:["신규개설이벤트","순입금이벤트"] }, existingCustomer:null },
      { name:"하나증권",     app:"하나원큐",    logo:"images/03_hana_logo.png",   color:"#009b77", eventPageUrl:"https://www.hanaw.com/corebbs5/eventNIng/list/list.cmd",
        newCustomer:{ status:"check", eventName:"이벤트 준비중", expiry:"", maxBenefit:"", conditions:[], transfer:null, tags:[] }, existingCustomer:null },
      { name:"키움증권",     app:"영웅문S#",    logo:"images/03_kiwoon_logo.png", color:"#e8001c", eventPageUrl:"https://www3.kiwoom.com/h/customer/event/VIngEventView?dummyVal=0",
        newCustomer:{ status:"active", eventName:"중개형ISA 신규개설 이벤트", expiry:"2026.06.30", maxBenefit:"최대 14만원 기프티콘",
          conditions:[{ type:"신규개설", amount:"신규/이전 개설", reward:"미국 주식 1~5주 (추첨)" },{ type:"순매수", amount:"특정 운용사 ETF 거래", reward:"기프티콘 최대 14만원" }],
          transfer:null, tags:["신규개설이벤트","순매수이벤트"] }, existingCustomer:null },
      { name:"신한투자증권", app:"SOL",         logo:"images/03_sinhan_logo.png", color:"#0046ff", eventPageUrl:"https://m.shinhansec.com/mweb/anev/evnt/aevnt0001?tab=1",
        newCustomer:{ status:"active", eventName:"ISA 상반기 이벤트", expiry:"2026.06.30", maxBenefit:"공식 페이지 확인",
          conditions:[{ type:"순입금", amount:"비대면 신규개설 후 순입금", reward:"구간별 혜택" }],
          transfer:"1천만원 이상 이전 시 2배 인정", tags:["순입금이벤트","계좌이전"] }, existingCustomer:null },
      { name:"메리츠증권",   app:"메리츠ON",    logo:"images/03_meritz_logo.jpg", color:"#e8282a", eventPageUrl:"https://home.imeritz.com/cust/ntcevnt/PrgsEvnt.do",
        newCustomer:{ status:"check", eventName:"이벤트 준비중", expiry:"", maxBenefit:"", conditions:[], transfer:null, tags:[] }, existingCustomer:null },
      { name:"대신증권",     app:"크레온",      logo:"images/03_daesin_logo.png", color:"#003087", eventPageUrl:"https://www.daishin.com/g.ds?m=1109&p=12931&v=12831",
        newCustomer:{ status:"active", eventName:"중개형ISA 개설 & 수수료 이벤트", expiry:"2026.05.29 / 2026.12.31", maxBenefit:"최대 8.5만원 + 특판RP 7.0%",
          conditions:[{ type:"신규개설", amount:"프로모션 (4.1~5.29)", reward:"최대 8.5만원" },{ type:"수수료", amount:"수수료 평생우대", reward:"연중 진행" },{ type:"특판RP", amount:"중개형ISA 특판 RP", reward:"연 7.0% 이율" }],
          transfer:null, tags:["신규개설이벤트","수수료우대","특판이벤트"] }, existingCustomer:null },
    ],
    recommendations: {
      month:"2026년 5월",
      top1:{ name:"미래에셋증권", app:"M-Stock", logo:"images/03_mirae_logo.png", color:"#e87722", eventPageUrl:"https://securities.miraeasset.com/hki/hki7000/r05.do",
        badge:"📌 신규가입자라면?", label:"수수료 최저 + 이벤트 + 장기 유리 — 종합 1위",
        points:["ETF 수수료 0.003640% 평생 우대 — 10개사 중 단독 최저","ETF·국내주식·리츠 모두 동일 수수료 (다른 곳은 구분됨)","웰컴 2만원 + 우대금리 90일 + 수익금 달성 최대 25만원","타사이전 2배 인정 / 이벤트 기간 ~6월 30일"],
        tag:"이런 분께: 장기 보유 + 수수료·이벤트 둘 다 챙기고 싶은 신혼부부" },
      top2to5:[
        { rank:2, name:"한국투자증권", app:"BanKIS",    logo:"images/03_hanto__logo.png",  color:"#f0431e", eventPageUrl:"https://www.truefriend.com/main/customer/notice/Event.jsp?gubun=i", criteria:"이벤트 다양 + 공모주 우대", points:["100만원 입금 시 월배당 ETF 1주 무료 (전원)","순입금 구간별 신세계 상품권 최대 50만원","공모주 청약 한도 200% 우대","수수료 0.004209% 평생"], tag:"이런 분께: 공모주·ETF 현물 혜택 원하는 분" },
        { rank:3, name:"삼성증권",     app:"mPOP",      logo:"images/03_samsung_logo.png", color:"#1428a0", eventPageUrl:"https://www.samsungpop.com/",                                       criteria:"신규개설 즉시 혜택",     points:["신규개설 즉시 상품권 5,000원 (조건 없이 전원)","100만원 이상 입금 시 추가 1만원","기존고객도 동일 조건 참여 가능","타사이전 2배 / 수수료 0.004209% 평생"],              tag:"이런 분께: 즉시 소액 혜택 원하는 분" },
        { rank:4, name:"NH투자증권",   app:"나무",       logo:"images/03_nh_logo.png",       color:"#00a651", eventPageUrl:"https://m.mynamuh.com/customer/event/eventList",                   criteria:"이벤트 기간 가장 길다",  points:["나무랄 데 없는 ISA 시즌4 — 2026.12.31까지 (최장)","이마트 상품권 구간별 최대 30만원","타사이전 1천만원 이상 시 2배 인정","수수료 0.004901% (12개월 주의)"],           tag:"이런 분께: 천천히 입금할 분" },
        { rank:5, name:"대신증권",     app:"크레온",     logo:"images/03_daesin_logo.png",   color:"#003087", eventPageUrl:"https://www.daishin.com/g.ds?m=1109&p=12931&v=12831",             criteria:"특판 RP 7.0% — 안정형",  points:["ISA 안에서 특판 RP 연 7.0% 이율 (연중)","수수료 평생 우대 이벤트 연중 진행","⚠️ 프로모션 5.29 종료 임박","ETF 변동성 싫고 이자 선호하는 분께"],                    tag:"이런 분께: 안정적 이자 원하는 분" },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════
  //  TAB 4 : 연금저축펀드  (2026.05 기준)
  // ══════════════════════════════════════════════════════════
  pension: {
    ready: true,
    lastUpdated: "2026년 5월",
    info: {
      maxDeductible: "연 600만원",
      deductionRate_low: "16.5% (총급여 5,500만원 이하)",
      deductionRate_high: "13.2% (총급여 5,500만원 초과)",
      maxBenefit: "최대 99만원 세금 환급",
      tip: "IRP와 합산 최대 900만원까지 공제 가능",
    },
    fees: [
      { name:"미래에셋증권", app:"M-Stock",   logo:"images/03_mirae_logo.png",   fee:"0.003640%", period:"평생",            note:"ISA와 동일 최저수수료",    status:"active" },
      { name:"한국투자증권", app:"BanKIS",    logo:"images/03_hanto__logo.png",   fee:"0.004209%", period:"평생",            note:"",                         status:"active" },
      { name:"삼성증권",     app:"mPOP",      logo:"images/03_samsung_logo.png",  fee:"0.004209%", period:"평생",            note:"",                         status:"active" },
      { name:"신한투자증권", app:"SOL",        logo:"images/03_sinhan_logo.png",  fee:"0.004209%", period:"평생",            note:"",                         status:"active" },
      { name:"NH투자증권",   app:"나무",       logo:"images/03_nh_logo.png",       fee:"0.004901%", period:"개설 후 12개월", note:"기간 종료 후 일반 수수료", status:"active" },
      { name:"KB증권",       app:"Mable",     logo:"images/03_KB_logo.png",       fee:"0.005048%", period:"평생*",          note:"개설 후 3개월 내 신청",    status:"active" },
      { name:"키움증권",     app:"영웅문S#",   logo:"images/03_kiwoon_logo.png",   fee:"0.01500%",  period:"우대 없음",      note:"",                         status:"check"  },
      { name:"하나증권",     app:"하나원큐",   logo:"images/03_hana_logo.png",     fee:"확인 필요", period:"확인 필요",       note:"",                         status:"check"  },
      { name:"메리츠증권",   app:"메리츠ON",   logo:"images/03_meritz_logo.jpg",   fee:"확인 필요", period:"확인 필요",       note:"",                         status:"check"  },
    ],
    events: [
      { name:"미래에셋증권", app:"M-Stock",    logo:"images/03_mirae_logo.png",  color:"#e87722", eventPageUrl:"https://securities.miraeasset.com/hki/hki7000/r05.do",
        newCustomer:{ status:"active", eventName:"연금저축 신규개설 이벤트", expiry:"2026.06.30", maxBenefit:"공식 페이지 확인",
          conditions:[{ type:"신규개설", amount:"신규 개설 시", reward:"웰컴 혜택 지급" },{ type:"순입금", amount:"구간별 납입", reward:"투자지원금/상품권" }], transfer:"이전금액 2배 인정", tags:["신규개설이벤트","계좌이전"] }, existingCustomer:null },
      { name:"한국투자증권", app:"BanKIS",     logo:"images/03_hanto__logo.png", color:"#f0431e", eventPageUrl:"https://www.truefriend.com/main/customer/notice/Event.jsp?gubun=i",
        newCustomer:{ status:"active", eventName:"연금저축 신규개설 & 이전 이벤트", expiry:"2026.06.30", maxBenefit:"공식 페이지 확인",
          conditions:[{ type:"신규개설", amount:"신규 개설 시", reward:"ETF/상품권 지급" },{ type:"계좌이전", amount:"타사 이전 시", reward:"이전금액 2배 인정" }], transfer:"이전금액 2배 인정", tags:["신규개설이벤트","계좌이전"] }, existingCustomer:null },
      { name:"삼성증권",     app:"mPOP",        logo:"images/03_samsung_logo.png",color:"#1428a0", eventPageUrl:"https://www.samsungpop.com/",
        newCustomer:{ status:"active", eventName:"연금저축 이벤트", expiry:"공식 페이지 확인", maxBenefit:"공식 페이지 확인",
          conditions:[{ type:"신규개설", amount:"신규 개설 시", reward:"상품권 지급" }], transfer:"이전금액 2배 인정", tags:["신규개설이벤트"] }, existingCustomer:null },
      { name:"NH투자증권",   app:"나무",        logo:"images/03_nh_logo.png",     color:"#00a651", eventPageUrl:"https://m.mynamuh.com/customer/event/eventList",
        newCustomer:{ status:"check", eventName:"이벤트 준비중 (공식 페이지 확인)", expiry:"", maxBenefit:"", conditions:[], transfer:null, tags:[] }, existingCustomer:null },
      { name:"KB증권",       app:"Mable",       logo:"images/03_KB_logo.png",     color:"#ffb81c", eventPageUrl:"https://www.kbsec.com/go.able?linkcd=m06090002",
        newCustomer:{ status:"check", eventName:"이벤트 준비중 (공식 페이지 확인)", expiry:"", maxBenefit:"", conditions:[], transfer:null, tags:[] }, existingCustomer:null },
      { name:"키움증권",     app:"영웅문S#",    logo:"images/03_kiwoon_logo.png", color:"#e8001c", eventPageUrl:"https://www3.kiwoom.com/h/customer/event/VIngEventView?dummyVal=0",
        newCustomer:{ status:"check", eventName:"이벤트 준비중 (공식 페이지 확인)", expiry:"", maxBenefit:"", conditions:[], transfer:null, tags:[] }, existingCustomer:null },
    ],
    recommendations: {
      top1:{ name:"미래에셋증권", app:"M-Stock", logo:"images/03_mirae_logo.png", color:"#e87722", eventPageUrl:"https://securities.miraeasset.com/hki/hki7000/r05.do",
        badge:"📌 연저펀 신규라면?", label:"수수료 최저 + 글로벌 ETF 라인업 최다",
        points:["ETF 수수료 0.003640% 평생 — 30년 복리 효과 극대화","해외 ETF 종류 가장 많아 글로벌 분산투자 유리","연금저축 이벤트 웰컴 혜택 + 이전 2배 인정"],
        tag:"이런 분께: 글로벌 ETF로 장기 적립 원하는 신혼부부" },
      top2to5:[
        { rank:2, name:"삼성증권",     app:"mPOP",  logo:"images/03_samsung_logo.png", color:"#1428a0", eventPageUrl:"https://www.samsungpop.com/",                       criteria:"국내 ETF 선택 폭 넓다",  points:["KODEX 계열 ETF 전 종류 매매 가능","0.004209% 평생 수수료","신규 이벤트 상품권 지급","mPOP 앱 편의성 우수"],          tag:"이런 분께: 국내 ETF 중심으로 투자할 분" },
        { rank:3, name:"한국투자증권", app:"BanKIS", logo:"images/03_hanto__logo.png",  color:"#f0431e", eventPageUrl:"https://www.truefriend.com/main/customer/notice/Event.jsp?gubun=i", criteria:"이벤트 + 수수료 균형", points:["0.004209% 평생 수수료","이전 이벤트 ETF 현물 지급","공모주 연계 혜택 가능","BanKIS 앱 안정적"],              tag:"이런 분께: 이벤트+수수료 둘 다 챙기고 싶은 분" },
        { rank:4, name:"NH투자증권",   app:"나무",   logo:"images/03_nh_logo.png",       color:"#00a651", eventPageUrl:"https://m.mynamuh.com/customer/event/eventList",     criteria:"나무 앱 사용 편의성",   points:["나무 앱 UI/UX 우수","0.004901% (12개월 주의)","ETF/펀드 동시 매매 가능"],                                              tag:"이런 분께: 편한 앱 UX 선호하는 분" },
        { rank:5, name:"KB증권",       app:"Mable",  logo:"images/03_KB_logo.png",       color:"#ffb81c", eventPageUrl:"https://www.kbsec.com/go.able?linkcd=m06090002",     criteria:"KB 주거래 고객 유리",   points:["KB 은행·증권 통합 관리 편리","0.005048% 평생* (3개월 내 신청 필수)","Mable 앱 연동"],                                    tag:"이런 분께: KB 주거래 고객" },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════
  //  TAB 5 : IRP (개인형퇴직연금)  (2026.05 기준)
  // ══════════════════════════════════════════════════════════
  irp: {
    ready: true,
    lastUpdated: "2026년 5월",
    info: {
      maxDeductible: "연 900만원 (연금저축+IRP 합산)",
      deductionRate_low: "16.5% (총급여 5,500만원 이하)",
      deductionRate_high: "13.2% (총급여 5,500만원 초과)",
      maxBenefit: "최대 148.5만원 세금 환급",
      tip: "퇴직금 수령 계좌 + 개인 납입 모두 가능",
    },
    fees: [
      // 증권사 (ETF 매매 수수료 기준)
      { name:"미래에셋증권", app:"M-Stock",   logo:"images/03_mirae_logo.png",   fee:"0.003640%", period:"평생",      note:"ETF 수수료 / 계좌수수료 0%↑ (이벤트)", status:"active", type:"증권사" },
      { name:"한국투자증권", app:"BanKIS",    logo:"images/03_hanto__logo.png",   fee:"0.004209%", period:"평생",      note:"계좌수수료 0% (이벤트 기간)",          status:"active", type:"증권사" },
      { name:"삼성증권",     app:"mPOP",      logo:"images/03_samsung_logo.png",  fee:"0.004209%", period:"평생",      note:"계좌수수료 0% (이벤트 기간)",          status:"active", type:"증권사" },
      { name:"신한투자증권", app:"SOL",        logo:"images/03_sinhan_logo.png",  fee:"0.004209%", period:"평생",      note:"",                                     status:"active", type:"증권사" },
      { name:"NH투자증권",   app:"나무",       logo:"images/03_nh_logo.png",       fee:"0.004901%", period:"12개월",   note:"기간 종료 후 일반 수수료",             status:"active", type:"증권사" },
      { name:"키움증권",     app:"영웅문S#",   logo:"images/03_kiwoon_logo.png",   fee:"0.01500%",  period:"우대 없음", note:"운용+자산관리 수수료 별도",            status:"check",  type:"증권사" },
      // 은행 (운용+자산관리 수수료 / ETF 직접투자 제한)
      { name:"KB국민은행",   app:"KB스타뱅킹",logo:"images/03_KB_logo.png",       fee:"약 0.30%/년", period:"연간",   note:"운용+자산관리수수료 합산 / ETF 제한", status:"check",  type:"은행" },
      { name:"신한은행",     app:"신한 SOL",   logo:"images/03_sinhan_logo.png",   fee:"약 0.28%/년", period:"연간",   note:"운용+자산관리수수료 합산",            status:"check",  type:"은행" },
      { name:"하나은행",     app:"하나원큐",   logo:"images/03_hana_logo.png",     fee:"약 0.25%/년", period:"연간",   note:"운용+자산관리수수료 합산",            status:"check",  type:"은행" },
    ],
    events: [
      { name:"미래에셋증권", app:"M-Stock",    logo:"images/03_mirae_logo.png",  color:"#e87722", eventPageUrl:"https://securities.miraeasset.com/hki/hki7000/r05.do",
        newCustomer:{ status:"active", eventName:"IRP 신규개설 이벤트", expiry:"2026.06.30", maxBenefit:"공식 페이지 확인",
          conditions:[{ type:"신규개설", amount:"신규 개설 시", reward:"웰컴 혜택" },{ type:"계좌이전", amount:"퇴직금 이전 시", reward:"이벤트 혜택" }], transfer:"이전금액 혜택", tags:["신규개설이벤트","계좌이전"] }, existingCustomer:null },
      { name:"한국투자증권", app:"BanKIS",     logo:"images/03_hanto__logo.png", color:"#f0431e", eventPageUrl:"https://www.truefriend.com/main/customer/notice/Event.jsp?gubun=i",
        newCustomer:{ status:"active", eventName:"IRP 신규개설 이벤트", expiry:"2026.06.30", maxBenefit:"공식 페이지 확인",
          conditions:[{ type:"신규개설", amount:"신규 개설 시", reward:"ETF/상품권 지급" }], transfer:null, tags:["신규개설이벤트"] }, existingCustomer:null },
      { name:"삼성증권",     app:"mPOP",        logo:"images/03_samsung_logo.png",color:"#1428a0", eventPageUrl:"https://www.samsungpop.com/",
        newCustomer:{ status:"check", eventName:"이벤트 준비중 (공식 페이지 확인)", expiry:"", maxBenefit:"", conditions:[], transfer:null, tags:[] }, existingCustomer:null },
      { name:"NH투자증권",   app:"나무",        logo:"images/03_nh_logo.png",     color:"#00a651", eventPageUrl:"https://m.mynamuh.com/customer/event/eventList",
        newCustomer:{ status:"check", eventName:"이벤트 준비중 (공식 페이지 확인)", expiry:"", maxBenefit:"", conditions:[], transfer:null, tags:[] }, existingCustomer:null },
    ],
    recommendations: {
      top1:{ name:"미래에셋증권", app:"M-Stock", logo:"images/03_mirae_logo.png", color:"#e87722", eventPageUrl:"https://securities.miraeasset.com/hki/hki7000/r05.do",
        badge:"📌 IRP 첫 개설이라면?", label:"최저 수수료 + 글로벌 ETF 직접투자 가능",
        points:["ETF 수수료 0.003640% 최저, 계좌수수료 0% (이벤트)","TDF·해외ETF·국내ETF 직접 선택 가능","퇴직금 수령 후 이전 이벤트 혜택 별도","30년 운용 시 수수료 차이 수백만원"],
        tag:"이런 분께: ETF 직접 운용으로 노후준비 원하는 분" },
      top2to5:[
        { rank:2, name:"한국투자증권", app:"BanKIS", logo:"images/03_hanto__logo.png",  color:"#f0431e", eventPageUrl:"https://www.truefriend.com/main/customer/notice/Event.jsp?gubun=i", criteria:"이벤트 + ETF 직접운용", points:["ETF 직접 매매 가능 (0.004209%)","신규 이벤트 ETF 현물 지급","계좌수수료 0% 이벤트 진행"],           tag:"이런 분께: ETF 현물 혜택 받고 싶은 분" },
        { rank:3, name:"삼성증권",     app:"mPOP",   logo:"images/03_samsung_logo.png", color:"#1428a0", eventPageUrl:"https://www.samsungpop.com/",                                        criteria:"KODEX ETF 직접운용",   points:["삼성 KODEX 전 종목 매매 가능","0.004209% 평생 수수료","mPOP 앱 연금 전용 UI"],                              tag:"이런 분께: 삼성 ETF 선호하는 분" },
        { rank:4, name:"하나은행 IRP", app:"하나원큐",logo:"images/03_hana_logo.png",    color:"#009b77", eventPageUrl:"https://www.kebhana.com",                                            criteria:"은행 IRP (안정형)",     points:["예금자보호 적용 (원리금 보장 상품)","은행 창구 상담 가능","ETF 직접투자 어려움 (TDF 위주)","수수료 약 0.25%/년"], tag:"이런 분께: 투자 경험 없고 안정을 원하는 분" },
        { rank:5, name:"NH투자증권",   app:"나무",    logo:"images/03_nh_logo.png",       color:"#00a651", eventPageUrl:"https://m.mynamuh.com/customer/event/eventList",                    criteria:"나무 앱 편의성",        points:["나무 앱에서 IRP+연금저축 통합관리","ETF 직접 매매 가능","0.004901% 수수료 (12개월 주의)"],                      tag:"이런 분께: 나무 앱으로 통합관리 원하는 분" },
      ],
    },
  },
};
