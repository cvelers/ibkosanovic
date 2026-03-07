/* ============================================================
   ibkosanovic – JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── Year in footer ──
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Theme Toggle (Dark Mode) ──
  var THEME_KEY = 'ibk-theme';

  function getPreferredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) { /* noop */ }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  applyTheme(getPreferredTheme());

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* noop */ }
    });
  });

  // ── Header scroll effect ──
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav toggle ──
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        toggle.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Hero Background Image Rotator ──
  var heroBg = document.querySelector('.hero-bg');
  var heroImages = [
    'images/foto1.webp',
    'images/foto2.webp',
    'images/foto3.webp',
    'images/foto4.webp',
    'images/foto5.webp'
  ];

  if (heroBg && heroImages.length > 0) {
    heroImages.forEach(function (src, i) {
      var slide = document.createElement('div');
      slide.className = 'hero-bg-slide' + (i === 0 ? ' is-active' : '');
      slide.style.backgroundImage = "url('" + src + "')";
      heroBg.appendChild(slide);
    });
  }

  // ── Hero Slider ──
  var slides = document.querySelectorAll('.hero-slide');
  var dotsContainer = document.querySelector('.hero-dots');
  var counterEl = document.querySelector('.hero-counter');
  var currentSlide = 0;
  var totalSlides = slides.length;
  var autoplayTimer = null;
  var AUTOPLAY_DELAY = 6000;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === currentSlide);
    });

    var bgSlides = document.querySelectorAll('.hero-bg-slide');
    bgSlides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === currentSlide);
    });

    var dots = document.querySelectorAll('.hero-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('is-active', i === currentSlide);
    });

    if (counterEl) {
      counterEl.textContent = (currentSlide + 1) + ' / ' + totalSlides;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (totalSlides > 1) {
      autoplayTimer = setInterval(function () {
        goToSlide(currentSlide + 1);
      }, AUTOPLAY_DELAY);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (dotsContainer && totalSlides > 1) {
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      (function (idx) {
        dot.addEventListener('click', function () {
          goToSlide(idx);
          startAutoplay();
        });
      })(i);
      dotsContainer.appendChild(dot);
    }
  }

  if (counterEl && totalSlides > 0) {
    counterEl.textContent = '1 / ' + totalSlides;
  }

  if (totalSlides > 1) startAutoplay();

  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }

  // ── Scroll Reveal ──
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Active nav link ──
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('is-active');
    }
  });

  // ── Cookie Banner ──
  var cookieBanner = document.getElementById('cookie-banner');
  var cookieAccept = document.querySelector('.cookie-accept');
  var cookieHide = document.querySelector('.cookie-hide');
  var COOKIE_KEY = 'ibk-cookie-consent';

  function hideCookieBanner(value) {
    if (value !== undefined) {
      try { localStorage.setItem(COOKIE_KEY, value); } catch (e) { /* noop */ }
    }
    if (cookieBanner) {
      cookieBanner.setAttribute('aria-hidden', 'true');
      cookieBanner.style.display = 'none';
    }
  }

  if (cookieBanner) {
    try {
      var saved = localStorage.getItem(COOKIE_KEY);
      if (saved) hideCookieBanner();
    } catch (e) { /* noop */ }
  }

  if (cookieAccept) cookieAccept.addEventListener('click', function () { hideCookieBanner('accept'); });
  if (cookieHide) cookieHide.addEventListener('click', function () { hideCookieBanner('hide'); });

  // ── Contact form (mailto fallback) ──
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(contactForm);
      var name = fd.get('name') || '';
      var email = fd.get('email') || '';
      var subject = fd.get('subject') || 'Kontaktanfrage';
      var message = fd.get('message') || '';

      var body = 'Name: ' + name + '\nE-Mail: ' + email + '\n\n' + message;
      window.location.href = 'mailto:veljko.kosanovic1990@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      var msgEl = contactForm.querySelector('.form-message');
      if (msgEl) {
        msgEl.className = 'form-message form-message--success';
        msgEl.textContent = contactForm.dataset.successMsg || 'Ihr E-Mail-Programm wird geöffnet.';
      }
    });
  }

})();
