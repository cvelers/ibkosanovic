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
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
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

  // ── Cookie Consent ──
  var cookieBanner = document.getElementById('cookie-banner');
  var cookieAccept = document.querySelector('.cookie-accept');
  var cookieHide = document.querySelector('.cookie-hide');
  var COOKIE_KEY = 'ibk-cookie-consent';

  function getConsent() {
    try { return localStorage.getItem(COOKIE_KEY); } catch (e) { return null; }
  }

  function hideCookieBanner(value) {
    if (value !== undefined) {
      try { localStorage.setItem(COOKIE_KEY, value); } catch (e) { /* noop */ }
    }
    if (cookieBanner) {
      cookieBanner.setAttribute('aria-hidden', 'true');
      cookieBanner.style.display = 'none';
    }
  }

  function loadConsentContent() {
    document.querySelectorAll('[data-consent-src]').forEach(function (el) {
      var iframe = document.createElement('iframe');
      iframe.src = el.getAttribute('data-consent-src');
      iframe.width = '100%';
      iframe.height = '350';
      iframe.style.cssText = 'border:0;display:block';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      iframe.setAttribute('title', el.getAttribute('data-consent-title') || '');
      el.parentNode.replaceChild(iframe, el);
    });
  }

  if (cookieBanner) {
    var saved = getConsent();
    if (saved) {
      hideCookieBanner();
      if (saved === 'accept') loadConsentContent();
    }
  }

  if (cookieAccept) cookieAccept.addEventListener('click', function () {
    hideCookieBanner('accept');
    loadConsentContent();
  });
  if (cookieHide) cookieHide.addEventListener('click', function () { hideCookieBanner('decline'); });

  // Map consent button (inline accept for map only)
  document.querySelectorAll('.map-consent-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      hideCookieBanner('accept');
      loadConsentContent();
    });
  });

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

  // ── Project Detail Modal ──
  var overlay = document.querySelector('.project-modal-overlay');
  var modal = overlay ? overlay.querySelector('.project-modal') : null;

  if (overlay && modal) {
    var heroImg = modal.querySelector('.project-modal-hero img');
    var titleEl = modal.querySelector('.project-modal-title');
    var metaEl = modal.querySelector('.project-modal-meta');
    var descEl = modal.querySelector('.project-modal-desc');
    var galleryEl = modal.querySelector('.project-modal-gallery');
    var galleryLabel = modal.querySelector('.project-modal-gallery-title');

    function openModal(card) {
      var d = card.dataset;
      heroImg.src = card.querySelector('.ref-card-img img').src;
      heroImg.alt = d.title || '';
      titleEl.textContent = d.title || '';

      metaEl.innerHTML = '';
      if (d.location) metaEl.innerHTML += '<span class="project-modal-tag"><strong>' + (d.labelLocation || 'Standort') + ':</strong> ' + d.location + '</span>';
      if (d.client) metaEl.innerHTML += '<span class="project-modal-tag"><strong>' + (d.labelClient || 'Bauherr') + ':</strong> ' + d.client + '</span>';
      if (d.period) metaEl.innerHTML += '<span class="project-modal-tag"><strong>' + (d.labelPeriod || 'Zeitraum') + ':</strong> ' + d.period + '</span>';
      if (d.area) metaEl.innerHTML += '<span class="project-modal-tag"><strong>' + (d.labelArea || 'Fläche') + ':</strong> ' + d.area + '</span>';

      descEl.textContent = d.desc || '';

      galleryEl.innerHTML = '';
      if (d.gallery) {
        var imgs = d.gallery.split(',');
        imgs.forEach(function (src) {
          var img = document.createElement('img');
          img.src = src.trim();
          img.alt = d.title || '';
          img.loading = 'lazy';
          img.addEventListener('click', function () { openLightbox(this.src); });
          galleryEl.appendChild(img);
        });
        galleryLabel.style.display = '';
      } else {
        galleryLabel.style.display = 'none';
      }

      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    modal.querySelector('.project-modal-close').addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    document.querySelectorAll('.ref-card[data-project]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        openModal(card);
      });
    });

    // Lightbox
    var lightbox = document.querySelector('.project-lightbox');
    var lightboxImg = lightbox ? lightbox.querySelector('img') : null;

    function openLightbox(src) {
      if (!lightbox) return;
      lightboxImg.src = src;
      lightbox.classList.add('is-open');
    }

    if (lightbox) {
      lightbox.addEventListener('click', function () {
        lightbox.classList.remove('is-open');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
          lightbox.classList.remove('is-open');
        }
      });
    }
  }

})();
