/* =====================================================
   app.js - 툴팁 / 퀴즈 / 네비게이션 / 진행률 / 글로서리
   ===================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'dwarkesh_llm_progress_v1';

  // ---------- 진행 상태 (localStorage) ----------

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { quizAnswers: {}, modulesSeen: {} };
      return JSON.parse(raw);
    } catch (e) {
      return { quizAnswers: {}, modulesSeen: {} };
    }
  }
  function saveProgress(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  const progress = loadProgress();

  // =======================================================
  // 1) 툴팁 (Glossary terms)
  // =======================================================

  let tooltipEl = null;
  let activeTerm = null;

  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'tooltip';
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function showTooltip(termEl) {
    const key = termEl.dataset.term;
    const def = window.GLOSSARY[key];
    if (!def) return;
    const t = ensureTooltip();
    t.innerHTML =
      '<strong>' + escapeHtml(def.title) + '</strong><br>' +
      def.body +
      (def.more ? '<span class="more">' + escapeHtml(def.more) + '</span>' : '');
    positionTooltip(t, termEl);
    t.classList.add('show');
    activeTerm = termEl;
  }

  function positionTooltip(t, termEl) {
    const rect = termEl.getBoundingClientRect();
    t.style.left = '0px';
    t.style.top = '0px';
    t.style.maxWidth = Math.min(360, window.innerWidth - 32) + 'px';
    // 임시 표시로 사이즈 측정
    const prevDisplay = t.style.display;
    t.style.display = 'block';
    const tw = t.offsetWidth, th = t.offsetHeight;
    t.style.display = prevDisplay;

    let left = rect.left + rect.width / 2 - tw / 2;
    let top = rect.top - th - 10;
    if (top < 8) {
      top = rect.bottom + 10; // 위에 자리 없으면 아래로
    }
    if (left < 8) left = 8;
    if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
    t.style.left = left + 'px';
    t.style.top = top + 'px';
  }

  function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.classList.remove('show');
    activeTerm = null;
  }

  function bindTooltips() {
    document.body.addEventListener('mouseover', function (e) {
      const term = e.target.closest('.term');
      if (term && term !== activeTerm) showTooltip(term);
    });
    document.body.addEventListener('mouseout', function (e) {
      const term = e.target.closest('.term');
      if (term) {
        // 잠시 기다려서 다른 term으로 이동했는지 확인
        setTimeout(() => {
          if (activeTerm === term) hideTooltip();
        }, 50);
      }
    });
    // 모바일 / 키보드 접근성: 클릭으로도 토글
    document.body.addEventListener('click', function (e) {
      const term = e.target.closest('.term');
      if (term) {
        e.preventDefault();
        if (activeTerm === term) hideTooltip();
        else showTooltip(term);
      } else {
        hideTooltip();
      }
    });
    window.addEventListener('scroll', hideTooltip, { passive: true });
    window.addEventListener('resize', hideTooltip);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // =======================================================
  // 2) 퀴즈 렌더링 + 정답 처리
  // =======================================================

  function renderQuizzes() {
    document.querySelectorAll('.quiz').forEach(function (root) {
      const moduleId = root.dataset.module;
      const list = (window.QUIZZES && window.QUIZZES[moduleId]) || [];
      if (list.length === 0) return;

      let qIdx = 0; // 현재 보여주는 문항 index
      const state = { answers: progress.quizAnswers[moduleId] || {} };

      function render() {
        const q = list[qIdx];
        const answered = state.answers[qIdx];
        const total = list.length;

        let html = '';
        html += '<div class="quiz-header">';
        html += '<div class="quiz-icon">?</div>';
        html += '<div class="quiz-title">이해 점검</div>';
        html += '<div class="quiz-progress">' + (qIdx + 1) + ' / ' + total + '</div>';
        html += '</div>';
        html += '<div class="quiz-question">' + escapeHtml(q.q) + '</div>';
        html += '<div class="quiz-options">';
        q.options.forEach(function (opt, i) {
          let cls = 'quiz-option';
          let marker = String.fromCharCode(65 + i); // A, B, C, D
          if (answered != null) {
            cls += ' disabled';
            if (i === q.correct) cls += ' correct';
            else if (i === answered) cls += ' incorrect';
          }
          html += '<button class="' + cls + '" data-opt="' + i + '">';
          html += '<span class="marker">' + marker + '</span>';
          html += '<span>' + escapeHtml(opt) + '</span>';
          html += '</button>';
        });
        html += '</div>';

        if (answered != null) {
          const correct = answered === q.correct;
          html += '<div class="quiz-explanation show">';
          html += '<strong>' + (correct ? '맞아요. ' : '아쉬워요. ') + '</strong>';
          html += escapeHtml(q.why);
          html += '</div>';
          html += '<div class="quiz-actions">';
          if (qIdx + 1 < total) {
            html += '<button class="btn" data-action="next">다음 문제 →</button>';
          } else {
            html += '<span class="muted" style="align-self:center;font-size:14px;">이 모듈의 점검 완료 ✓</span>';
          }
          html += '<button class="quiz-restart" data-action="restart">다시 풀기</button>';
          html += '</div>';
        }

        root.innerHTML = html;
      }

      root.addEventListener('click', function (e) {
        const optBtn = e.target.closest('.quiz-option');
        const actBtn = e.target.closest('[data-action]');
        if (optBtn && state.answers[qIdx] == null) {
          const choice = parseInt(optBtn.dataset.opt, 10);
          state.answers[qIdx] = choice;
          progress.quizAnswers[moduleId] = state.answers;
          saveProgress(progress);
          render();
          updateModuleCompletion();
        } else if (actBtn) {
          const a = actBtn.dataset.action;
          if (a === 'next' && qIdx + 1 < list.length) {
            qIdx++;
            render();
          } else if (a === 'restart') {
            state.answers = {};
            qIdx = 0;
            progress.quizAnswers[moduleId] = state.answers;
            saveProgress(progress);
            render();
            updateModuleCompletion();
          }
        }
      });

      render();
    });
  }

  // =======================================================
  // 3) 네비게이션 (사이드바, 진행률, 활성화)
  // =======================================================

  function buildNav() {
    const nav = document.querySelector('.nav-list');
    if (!nav) return;
    const modules = Array.from(document.querySelectorAll('.module'));
    let html = '';
    modules.forEach(function (m, i) {
      const id = m.id;
      const titleEl = m.querySelector('h2');
      const tagEl = m.querySelector('.module-tag');
      const title = titleEl ? titleEl.textContent : ('Module ' + i);
      const tag = tagEl ? tagEl.textContent : '';
      html += '<li data-mid="' + id + '">';
      html += '<a href="#' + id + '">';
      html += '<span class="num">' + (tag || (i.toString().padStart(2, '0'))) + '</span>';
      html += '<span class="title">' + escapeHtml(title) + '</span>';
      html += '<span class="check">✓</span>';
      html += '</a>';
      html += '</li>';
    });
    nav.innerHTML = html;

    nav.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (a) closeNav();
    });
  }

  function openNav() {
    document.querySelector('.module-nav').classList.add('open');
    document.querySelector('.nav-backdrop').classList.add('show');
  }
  function closeNav() {
    document.querySelector('.module-nav').classList.remove('open');
    document.querySelector('.nav-backdrop').classList.remove('show');
  }

  function bindNavToggles() {
    document.querySelector('.nav-toggle').addEventListener('click', openNav);
    document.querySelector('.nav-close').addEventListener('click', closeNav);
    document.querySelector('.nav-backdrop').addEventListener('click', closeNav);
  }

  // =======================================================
  // 4) Scroll spy + progress bar + reveal
  // =======================================================

  function setupScrollSpy() {
    const modules = Array.from(document.querySelectorAll('.module'));
    const navLinks = Array.from(document.querySelectorAll('.nav-list a'));
    const progressBar = document.querySelector('.progress-bar');

    const seen = progress.modulesSeen || {};

    function update() {
      const fromTop = window.scrollY + window.innerHeight * 0.35;
      let activeIdx = -1;
      for (let i = 0; i < modules.length; i++) {
        if (modules[i].offsetTop <= fromTop) activeIdx = i;
      }
      navLinks.forEach((a, i) => a.classList.toggle('active', i === activeIdx));

      // 진행률: 본 모듈 중 가장 깊은 곳
      modules.forEach((m, i) => {
        if (m.getBoundingClientRect().top < window.innerHeight * 0.5) {
          seen[m.id] = true;
        }
      });
      progress.modulesSeen = seen;
      saveProgress(progress);

      const ratio = Math.max(0, activeIdx + 1) / modules.length;
      progressBar.style.width = (ratio * 100).toFixed(1) + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // 모듈 등장 애니메이션
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.05 });
    modules.forEach((m) => io.observe(m));
  }

  // 모듈 완료 표시 (해당 모듈의 모든 퀴즈가 정답)
  function updateModuleCompletion() {
    const modules = document.querySelectorAll('.module');
    modules.forEach(function (m) {
      const moduleId = m.id;
      const list = (window.QUIZZES && window.QUIZZES[moduleId]) || [];
      const answers = (progress.quizAnswers && progress.quizAnswers[moduleId]) || {};
      let allCorrect = list.length > 0;
      for (let i = 0; i < list.length; i++) {
        if (answers[i] !== list[i].correct) { allCorrect = false; break; }
      }
      const navLi = document.querySelector('.nav-list li[data-mid="' + moduleId + '"]');
      if (navLi) navLi.classList.toggle('completed', allCorrect);
    });
  }

  // =======================================================
  // 5) Glossary 모달
  // =======================================================

  function buildGlossaryModal() {
    const body = document.querySelector('.glossary-body');
    if (!body) return;
    const entries = Object.entries(window.GLOSSARY);
    let html = '';
    entries.forEach(function ([key, def]) {
      html += '<div class="glossary-entry" data-search="' +
        escapeHtml((key + ' ' + def.title + ' ' + (def.body || '')).toLowerCase()) +
        '">';
      html += '<div class="glossary-term">' + escapeHtml(def.title || key) + '</div>';
      html += '<div class="glossary-def">' + def.body + '</div>';
      html += '</div>';
    });
    body.innerHTML = html;

    const search = document.querySelector('.glossary-search input');
    search.addEventListener('input', function () {
      const q = search.value.trim().toLowerCase();
      body.querySelectorAll('.glossary-entry').forEach(function (el) {
        el.style.display = q === '' || el.dataset.search.includes(q) ? '' : 'none';
      });
    });

    document.querySelector('.fab').addEventListener('click', function () {
      document.querySelector('.glossary-modal').classList.add('open');
      search.value = '';
      search.focus();
      body.querySelectorAll('.glossary-entry').forEach(el => el.style.display = '');
    });
    document.querySelector('.glossary-close').addEventListener('click', closeGlossary);
    document.querySelector('.glossary-modal').addEventListener('click', function (e) {
      if (e.target === this) closeGlossary();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeGlossary();
    });
  }
  function closeGlossary() {
    document.querySelector('.glossary-modal').classList.remove('open');
  }

  // =======================================================
  // 부트
  // =======================================================

  document.addEventListener('DOMContentLoaded', function () {
    bindTooltips();
    buildNav();
    bindNavToggles();
    setupScrollSpy();
    renderQuizzes();
    updateModuleCompletion();
    buildGlossaryModal();
  });
})();
