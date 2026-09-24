/* ============================================================
 *  해피씨쀼 재테크 허브 - 실시간 이벤트 연동
 *  - live-events.js (크롤러가 매일 자동 생성) 의 데이터를 사용
 *  1) data.js 의 ISA / 연금저축 / IRP 이벤트 카드 중
 *     기간이 끝났거나 '준비중'인 카드를 최신 수집 이벤트로 자동 교체
 *  2) 각 탭 아래에 '실시간 이벤트 레이더' 목록 추가
 *  index.html 에서 data.js 바로 다음, 메인 <script> 전에 불러와야 함
 * ============================================================ */
(function () {
  const LIVE = window.LIVE_EVENTS;
  if (!LIVE || typeof ISA_DATA === 'undefined') return;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : '#');
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const TODAY = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
  const norm = (s) => String(s || '').replace(/\s|\(.*?\)|주식회사|㈜/g, '');

  const COLORS = {
    '미래에셋증권': '#e87722', '한국투자증권': '#f0431e', 'NH투자증권': '#00a651', '삼성증권': '#1428a0', 'KB증권': '#ffb81c',
    '하나증권': '#009b77', '키움증권': '#e8001c', '신한투자증권': '#0046ff', '메리츠증권': '#e8282a', '대신증권': '#003087',
    '토스증권': '#3182f6', '카카오페이증권': '#ffcd00', '유안타증권': '#f37021', '교보증권': '#004c97', '한화투자증권': '#f37321',
    'iM증권': '#e6007e', '유진투자증권': '#00539f', 'IBK투자증권': '#0f4c9a', 'SK증권': '#ea002c', 'LS증권': '#0a2d6e', 'DB증권': '#00854a',
    'KB국민은행': '#ffbc00', '신한은행': '#0046ff', '우리은행': '#0067ac', '하나은행': '#009b77', 'NH농협은행': '#00a651',
    'IBK기업은행': '#0f4c9a', 'SC제일은행': '#0072aa', 'iM뱅크': '#e6007e', 'BNK부산은행': '#e60012', 'BNK경남은행': '#e60012',
    '광주은행': '#0c4da2', '전북은행': '#0c4da2', '토스뱅크': '#3182f6', '케이뱅크': '#5b2be0', 'Sh수협은행': '#0070c0',
  };

  const isExpired = (exp) => {
    const m = String(exp || '').match(/(20\d{2})[.\-/](\d{1,2})[.\-/](\d{1,2})/g);
    if (!m) return false;
    const last = m[m.length - 1].replace(/[-/]/g, '.').split('.');
    return `${last[0]}.${pad(last[1])}.${pad(last[2])}` < TODAY;
  };
  const dday = (end) => {
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(end || '')) return '';
    const [y, m, d] = end.split('.').map(Number);
    const diff = Math.round((new Date(y, m - 1, d) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
    return diff < 0 ? '종료' : diff === 0 ? 'D-DAY' : `D-${diff}`;
  };
  // 처음 수집한 날 이후에 새로 발견된 이벤트만 NEW (첫 수집분은 전부 NEW 가 되는 것 방지)
  const FIRST_RUN = LIVE.events.reduce((m, e) => (e.firstSeen && e.firstSeen < m ? e.firstSeen : m), '9999-12-31');
  const isNew = (e) => {
    if (!e.firstSeen || e.firstSeen <= FIRST_RUN) return false;
    return (now - new Date(e.firstSeen)) / 86400000 <= 7;
  };
  const liveFor = (cat, name) => LIVE.events.filter((e) => e.categories.includes(cat) && (!name || norm(e.institution) === norm(name)));
  const score = (e) => (/신규|웰컴|welcome|순입금|이전|개설/i.test(e.title) ? 2 : 0) + (e.benefitHints && e.benefitHints.length ? 1 : 0);

  function toCard(list) {
    const sorted = [...list].sort((a, b) => score(b) - score(a));
    const best = sorted[0];
    const conds = sorted.slice(0, 4).map((e) => ({
      type: e === best ? '기간' : '함께 진행',
      amount: esc(e === best ? `${e.start || ''} ~ ${e.end || ''}` : e.title),
      reward: esc(e === best ? (e.desc || '').slice(0, 40) : (e.end ? `~${e.end}` : '')),
    }));
    return {
      data: {
        status: 'active',
        eventName: esc(best.title),
        expiry: best.end || '공식 페이지 확인',
        maxBenefit: esc((best.benefitHints || [])[0] ? '최대 ' + best.benefitHints[0].replace(/^최대\s*/, '') : '혜택은 공식 페이지에서 확인'),
        conditions: conds,
        transfer: null,
        tags: ['자동수집', ...(isNew(best) ? ['NEW'] : [])],
        _live: true,
      },
      url: safeUrl(best.url),
    };
  }

  // ── 1) ISA / 연금저축 / IRP 카드 자동 교체 ─────────────────────
  ['isa', 'pension', 'irp'].forEach((cat) => {
    const tab = ISA_DATA[cat];
    if (!tab || !Array.isArray(tab.events)) return;
    const names = new Set();
    tab.events.forEach((ev) => {
      names.add(norm(ev.name));
      const nc = ev.newCustomer;
      const stale = !nc || nc.status === 'check' || isExpired(nc.expiry);
      const live = liveFor(cat, ev.name);
      if (stale) {
        if (live.length) {
          const c = toCard(live);
          ev.newCustomer = c.data;
          if (c.url !== '#') ev.eventPageUrl = c.url;
        } else if (nc) {
          ev.newCustomer = { status: 'check', eventName: '이벤트 준비중', expiry: '', maxBenefit: '', conditions: [], transfer: null, tags: [] };
        }
      }
      if (ev.existingCustomer && isExpired(ev.existingCustomer.expiry)) ev.existingCustomer = null;
    });
    // data.js 에 없는 금융사의 이벤트도 카드로 추가
    const extra = {};
    liveFor(cat).forEach((e) => {
      if (!names.has(norm(e.institution))) (extra[e.institution] = extra[e.institution] || []).push(e);
    });
    Object.entries(extra).forEach(([name, list]) => {
      const c = toCard(list);
      tab.events.push({ name, app: list[0].type, logo: '', color: COLORS[name] || '#6B7280', eventPageUrl: c.url, newCustomer: c.data, existingCustomer: null });
    });
  });

  // ── 2) 탭별 '실시간 이벤트 레이더' 섹션 ─────────────────────────
  const TAB_CATS = { isa: ['isa'], pension: ['pension'], irp: ['irp'], cma: ['cma'], savings: ['savings'] };
  const TAB_TITLE = { isa: '중개형 ISA', pension: '연금저축', irp: 'IRP·퇴직연금', cma: 'CMA·파킹통장', savings: '예적금' };

  const css = `
  .lr-wrap{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius,14px);padding:6px 22px 18px;}
  .lr-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:14px 0 12px;}
  .lr-meta{font-size:12px;color:var(--sub);display:flex;align-items:center;gap:8px;}
  .lr-live{display:inline-flex;align-items:center;gap:6px;font-weight:800;color:var(--accent-ink);}
  .lr-live::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--accent);}
  @media (prefers-reduced-motion:no-preference){.lr-live::before{animation:lrPulse 2.4s ease-in-out infinite;}}
  @keyframes lrPulse{50%{opacity:.35}}
  .lr-filters{display:flex;gap:6px;flex-wrap:wrap;}
  .lr-fbtn{border:1px solid var(--line-strong);background:transparent;border-radius:999px;padding:5px 13px;font:inherit;font-size:13px;font-weight:600;color:var(--sub);cursor:pointer;}
  .lr-fbtn:hover{color:var(--text);}
  .lr-fbtn.on{background:var(--text);border-color:var(--text);color:var(--bg);}
  .lr-list{list-style:none;display:flex;flex-direction:column;}
  .lr-item a{display:grid;grid-template-columns:112px 1fr auto;gap:14px;align-items:baseline;padding:14px 0;border-top:1px solid var(--line);text-decoration:none;color:inherit;}
  .lr-item a:hover .lr-title{color:var(--accent-ink);}
  .lr-badge{font-size:13px;font-weight:700;color:var(--sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .lr-title{font-size:15px;font-weight:700;line-height:1.45;transition:color .15s;}
  .lr-sub{font-size:12px;color:var(--sub);margin-top:3px;font-variant-numeric:tabular-nums;}
  .lr-new{display:inline-block;color:var(--accent-ink);font-size:11px;font-weight:800;margin-right:6px;}
  .lr-dday{font-size:13px;font-weight:800;color:var(--sub);white-space:nowrap;font-variant-numeric:tabular-nums;}
  .lr-dday.soon{color:var(--accent-ink);}
  .lr-empty{font-size:14px;color:var(--sub);text-align:center;padding:28px 0;border-top:1px solid var(--line);}
  .lr-more{display:block;margin:6px auto 0;border:1px solid var(--line-strong);background:transparent;border-radius:999px;padding:8px 18px;font:inherit;font-size:13px;font-weight:700;color:var(--text);cursor:pointer;}
  .lr-note{font-size:12px;color:var(--faint);margin-top:12px;line-height:1.6;}
  @media (max-width:767px){.lr-wrap{padding:4px 16px 16px;}.lr-item a{grid-template-columns:1fr auto;gap:2px 12px;}.lr-badge{grid-column:1/-1;font-size:12px;}.lr-title{font-size:14px;}}
  `;

  function buildSection(tabId) {
    const cats = TAB_CATS[tabId];
    const list = LIVE.events
      .filter((e) => e.categories.some((c) => cats.includes(c)))
      .sort((a, b) => (isNew(b) - isNew(a)) || String(a.end || '9999').localeCompare(String(b.end || '9999')));
    const sec = document.createElement('section');
    sec.className = 'section live-radar';
    sec.id = tabId + '-radar';
    sec.innerHTML = `<div class="container">
      <div class="section-title">${TAB_TITLE[tabId]} 실시간 이벤트 레이더</div>
      <div class="section-sub">국내 은행·증권사 이벤트 페이지를 매일 자동으로 확인해 모았어요</div>
      <div class="lr-wrap">
        <div class="lr-head">
          <div class="lr-meta"><span class="lr-live">LIVE</span><span>${esc(LIVE.crawledAt)} 수집, 진행중 ${list.length}건</span></div>
          <div class="lr-filters">
            <button class="lr-fbtn on" data-f="all">전체</button>
            <button class="lr-fbtn" data-f="증권사">증권사</button>
            <button class="lr-fbtn" data-f="은행">은행</button>
            <button class="lr-fbtn" data-f="new">새 이벤트</button>
          </div>
        </div>
        <ul class="lr-list"></ul>
        <button class="lr-more hidden">더보기</button>
        <div class="lr-note">※ 자동 수집 결과라 세부 조건·혜택은 반드시 각 금융사 공식 페이지에서 확인해주세요.</div>
      </div></div>`;
    const ul = sec.querySelector('.lr-list');
    const more = sec.querySelector('.lr-more');
    let filter = 'all', limit = 8;
    const render = () => {
      const rows = list.filter((e) => filter === 'all' || (filter === 'new' ? isNew(e) : e.type === filter));
      ul.innerHTML = rows.length ? rows.slice(0, limit).map((e) => {
        const dd = dday(e.end);
        const soon = /^D-(\d+)$/.test(dd) && +dd.slice(2) <= 7;
        return `<li class="lr-item"><a href="${esc(safeUrl(e.url))}" target="_blank" rel="noopener">
          <span class="lr-badge">${esc(e.institution)}</span>
          <span><div class="lr-title">${isNew(e) ? '<span class="lr-new">NEW</span>' : ''}${esc(e.title)}</div>
          <div class="lr-sub">${e.start || e.end ? esc(`${e.start || ''} ~ ${e.end || ''}`) : '기간은 공식 페이지 확인'}${e.benefitHints && e.benefitHints.length ? ' · ' + esc(e.benefitHints.slice(0, 2).join(', ')) : ''}</div></span>
          <span class="lr-dday${soon ? ' soon' : ''}">${dd}</span></a></li>`;
      }).join('') : '<li class="lr-empty">지금은 진행중인 이벤트가 없어요</li>';
      more.classList.toggle('hidden', rows.length <= limit);
      more.textContent = `더보기 (${rows.length - limit}건)`;
    };
    sec.querySelectorAll('.lr-fbtn').forEach((b) => b.addEventListener('click', () => {
      sec.querySelectorAll('.lr-fbtn').forEach((x) => x.classList.remove('on'));
      b.classList.add('on'); filter = b.dataset.f; limit = 8; render();
    }));
    more.addEventListener('click', () => { limit += 20; render(); });
    render();
    return sec;
  }

  function mount() {
    const st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    Object.keys(TAB_CATS).forEach((tabId) => {
      const tab = document.getElementById('tab-' + tabId);
      if (!tab) return;
      const sec = buildSection(tabId);
      const track = tab.querySelector('[id$="CarTrack"]');
      const anchor = track && track.closest('section');
      if (anchor) anchor.after(sec);
      else {
        const secs = tab.querySelectorAll(':scope > section.section');
        secs.length ? secs[secs.length - 1].after(sec) : tab.appendChild(sec);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
