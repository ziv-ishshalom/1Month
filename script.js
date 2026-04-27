/**
 * 1Month Portfolio - Interactions & Animations
 */
(function () {
  'use strict';

  // ── Navbar scroll effect ─────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Mobile menu toggle ───────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });

  // ── Scroll reveal ────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Stats counter animation ──────────────────────────────
  const statNumbers = document.querySelectorAll('.hero-stat-number');

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const finalNum = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(finalNum)) return;

      const duration = 1200;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(finalNum * eased);

        el.textContent = current + (finalNum >= 20 ? '+' : '');

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      statsObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) {
    statsObserver.observe(el);
  });

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var offset = 80;
        var pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ── Active nav link highlight on scroll ──────────────────
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  var activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(function (section) {
    activeObserver.observe(section);
  });

  // ── App card tilt on hover (subtle) ──────────────────────
  var appCards = document.querySelectorAll('.app-card');

  appCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / centerY * -2;
      var rotateY = (x - centerX) / centerX * 2;

      card.style.transform = 'translateY(-4px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
  // ── Code Showcase — PIN lock + auto-close ─────────────────
  var codeLock = document.getElementById('code-lock');
  var codeContent = document.getElementById('code-content');
  var codePin = document.getElementById('code-pin');
  var codePinBtn = document.getElementById('code-pin-btn');
  var codePinError = document.getElementById('code-pin-error');
  var codeCountdown = document.getElementById('code-countdown');
  var codeTimerFill = document.getElementById('code-timer-fill');
  var codeTimer = null;
  var CODE_HASH = '2b20a53b75b0eb73f4e9fb9ec020e740e61c4e607b4aa6c1ea3eb233a5f74a82';
  var CODE_TIMEOUT = 60;

  function hashPin(pin) {
    var encoder = new TextEncoder();
    return crypto.subtle.digest('SHA-256', encoder.encode(pin)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  function lockCode() {
    if (codeTimer) clearInterval(codeTimer);
    codeContent.style.display = 'none';
    codeLock.style.display = 'flex';
    codePin.value = '';
    codePinError.textContent = '';
    if (codeTimerFill) codeTimerFill.style.width = '100%';
    if (codeCountdown) codeCountdown.textContent = CODE_TIMEOUT;
  }

  function unlockCode() {
    codeLock.style.display = 'none';
    codeContent.style.display = 'block';

    var remaining = CODE_TIMEOUT;
    codeCountdown.textContent = remaining;
    codeTimerFill.style.transition = 'none';
    codeTimerFill.style.width = '100%';

    // Force reflow then start animation
    void codeTimerFill.offsetWidth;
    codeTimerFill.style.transition = 'width 1s linear';

    codeTimer = setInterval(function () {
      remaining--;
      codeCountdown.textContent = remaining;
      codeTimerFill.style.width = ((remaining / CODE_TIMEOUT) * 100) + '%';

      if (remaining <= 0) {
        lockCode();
      }
    }, 1000);
  }

  function attemptUnlock() {
    hashPin(codePin.value).then(function (hash) {
      if (hash === CODE_HASH) {
        unlockCode();
      } else {
        codePinError.textContent = 'Incorrect code. Try again.';
        codePin.value = '';
        codePin.style.borderColor = '#ef4444';
        setTimeout(function () {
          codePin.style.borderColor = '';
        }, 1500);
      }
    });
  }

  if (codePinBtn) {
    codePinBtn.addEventListener('click', attemptUnlock);
  }
  if (codePin) {
    codePin.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attemptUnlock();
    });
  }

})();
