/**
 * Tech Review Pages - Sidebar TOC scroll-spy & interactions
 */
(function () {
  'use strict';

  // ── TOC Scroll-Spy ──────────────────────────────────────
  var tocLinks = document.querySelectorAll('.tr-toc-link');
  var sections = document.querySelectorAll('.tr-section');

  if (tocLinks.length === 0 || sections.length === 0) return;

  var tocObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        tocLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '-100px 0px -60% 0px'
  });

  sections.forEach(function (section) {
    tocObserver.observe(section);
  });

  // ── Smooth scroll for TOC links ──────────────────────────
  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        var offset = 100;
        var pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll reveal for tr-sections ────────────────────────
  var trCards = document.querySelectorAll('.tr-card');
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('tr-card--visible');
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  });

  trCards.forEach(function (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    cardObserver.observe(card);
  });

  // Add visible style
  var style = document.createElement('style');
  style.textContent = '.tr-card--visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

})();
