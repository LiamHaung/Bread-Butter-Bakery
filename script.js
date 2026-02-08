// 礁溪奶油麵包｜品牌提案頁 — 區塊進場動畫 + 視差
(function () {
  'use strict';

  // ----- 區塊由左至右進場：進入視窗時加入 .is-visible -----
  function initSectionReveal() {
    var sections = document.querySelectorAll('.section');
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.1
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ----- 視差（可選，Hero 背景慢速移動） -----
  var heroBg = document.querySelector('.hero-bg');
  var ticking = false;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function updateParallax() {
    if (prefersReducedMotion() || !heroBg) return;
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var scrollY = window.scrollY;
    var h = hero.offsetHeight;
    if (scrollY <= h) {
      heroBg.style.transform = 'translate3d(0, ' + scrollY * 0.4 + 'px, 0)';
    } else {
      heroBg.style.transform = 'translate3d(0, ' + h * 0.4 + 'px, 0)';
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);

  // ----- 入口頁：九宮格依序點亮約 1.8s，停頓 1.5s 後進入主頁 -----
  var LIGHT_DURATION_MS = 1800;
  var PAUSE_AFTER_LIT_MS = 1500;
  var FADE_OUT_MS = 600;

  function initEntrance() {
    var entrance = document.getElementById('entrance');
    if (!entrance) {
      initHeroReveal();
      return;
    }
    document.body.classList.add('entrance-visible');
    var cells = [].slice.call(entrance.querySelectorAll('.entrance-cell')).sort(function (a, b) {
      return parseInt(a.getAttribute('data-index'), 10) - parseInt(b.getAttribute('data-index'), 10);
    });
    var reduceMotion = prefersReducedMotion();
    if (reduceMotion) {
      cells.forEach(function (c) { c.classList.add('is-lit'); });
    }
    var stepMs = reduceMotion ? 0 : LIGHT_DURATION_MS / (cells.length || 1);
    var i = 0;
    function lightNext() {
      if (i < cells.length) {
        cells[i].classList.add('is-lit');
        i += 1;
        if (i < cells.length) {
          setTimeout(lightNext, stepMs);
        }
      }
    }
    setTimeout(lightNext, 0);
    var delayBeforeLeave = reduceMotion ? PAUSE_AFTER_LIT_MS : LIGHT_DURATION_MS + PAUSE_AFTER_LIT_MS;
    setTimeout(function () {
      entrance.classList.add('entrance--done');
      document.body.classList.remove('entrance-visible');
      setTimeout(function () {
        entrance.setAttribute('aria-hidden', 'true');
        initHeroReveal();
      }, FADE_OUT_MS);
    }, delayBeforeLeave);
  }

  // ----- Hero 進場動態：載入後觸發由左至右動畫 -----
  function initHeroReveal() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    requestAnimationFrame(function () {
      hero.classList.add('is-visible');
    });
  }

  // ----- Logo 輪播（三張）：點擊圓點切換，可選自動播放 -----
  function initLogoCarousel() {
    var carousel = document.querySelector('.logo-carousel');
    if (!carousel) return;
    var track = carousel.querySelector('.logo-carousel-track');
    var dots = carousel.querySelectorAll('.logo-carousel-dot');
    var total = dots.length;
    var current = 0;
    var autoplayMs = 5000;
    var autoplayTimer = null;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-selected', i === current);
      });
    }

    function next() {
      goTo(current + 1);
    }
    function prev() {
      goTo(current - 1);
    }

    var prevBtn = carousel.querySelector('.carousel-btn--prev');
    var nextBtn = carousel.querySelector('.carousel-btn--next');
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAutoplay(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        resetAutoplay();
      });
    });

    function startAutoplay() {
      autoplayTimer = setInterval(next, autoplayMs);
    }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
      startAutoplay();
    }
    startAutoplay();
  }

  // ----- 伴手禮地圖輪播（五張）：點擊圓點切換，自動播放 -----
  function initMapCarousel() {
    var carousel = document.querySelector('.map-carousel');
    if (!carousel) return;
    var track = carousel.querySelector('.map-carousel-track');
    var dots = carousel.querySelectorAll('.map-carousel-dot');
    var total = dots.length;
    var current = 0;
    var autoplayMs = 5000;
    var autoplayTimer = null;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-selected', i === current);
      });
    }

    function next() {
      goTo(current + 1);
    }
    function prev() {
      goTo(current - 1);
    }

    var prevBtn = carousel.querySelector('.carousel-btn--prev');
    var nextBtn = carousel.querySelector('.carousel-btn--next');
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAutoplay(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        resetAutoplay();
      });
    });

    function startAutoplay() {
      autoplayTimer = setInterval(next, autoplayMs);
    }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
      startAutoplay();
    }
    startAutoplay();
  }

  // ----- 互動小卡：點擊／觸控翻面（手機觸碰翻面，再次觸碰翻回） -----
  function initCardFlip() {
    document.querySelectorAll('.interactive-card-img-wrap').forEach(function (wrap) {
      wrap.addEventListener('click', function () {
        this.classList.toggle('is-flipped');
      });
      wrap.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.classList.toggle('is-flipped');
        }
      });
    });
  }

  // ----- 啟動 -----
  document.addEventListener('DOMContentLoaded', function () {
    initEntrance();
    initSectionReveal();
    initLogoCarousel();
    initMapCarousel();
    initCardFlip();
    updateParallax();

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });

  window.addEventListener('load', updateParallax);
})();
