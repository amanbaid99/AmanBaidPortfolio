/* Progressive enhancement only — the site is fully readable with JS disabled. */
(function () {
  "use strict";

  // Marks that JS is running, which is what turns on the reveal animations.
  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initHeaderShadow();
    initFooterYear();
  });

  /* Fade/slide sections in as they enter the viewport. */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

    targets.forEach(function (el, i) {
      // Small stagger so grouped items don't all land at once.
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      observer.observe(el);
    });

    // Safety net: content must never stay hidden because an observer callback
    // didn't fire. Anything still unrevealed shortly after load gets shown.
    window.setTimeout(function () {
      targets.forEach(function (el) {
        if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
      });
    }, 1500);
  }

  /* Hairline under the sticky header, but only once the page has moved. */
  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function initFooterYear() {
    var el = document.querySelector("[data-current-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }
})();
