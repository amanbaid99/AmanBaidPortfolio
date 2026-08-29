/* Progressive enhancement only — the site is fully readable with JS disabled. */
(function () {
  "use strict";

  // Turns on the reveal/entrance animations. Without JS they never apply.
  document.documentElement.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The hero entrance is pure CSS. Force its end state once its worst-case
  // duration (0.45s delay + 0.75s) has elapsed, so a dropped animation can
  // never leave the hero blank.
  window.setTimeout(function () {
    document.documentElement.classList.add("anim-settled");
  }, 1600);

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initCounters();
    initScrollSpy();
    initHeaderShadow();
    initFooterYear();
  });

  /* Fade/slide elements in as they enter the viewport. */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      show(targets);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    targets.forEach(function (el) {
      // Stagger siblings so a grid of cards lands in sequence, not all at once.
      var siblings = el.parentNode ? el.parentNode.children : [el];
      var i = Array.prototype.indexOf.call(siblings, el);
      el.style.transitionDelay = Math.min(i, 4) * 70 + "ms";
      observer.observe(el);
    });

    // Safety net: content must never stay hidden because a callback didn't fire.
    window.setTimeout(function () { show(targets); }, 2000);
  }

  function show(list) {
    Array.prototype.forEach.call(list, function (el) { el.classList.add("is-visible"); });
  }

  /* Count the hero metrics up when they first scroll into view. */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count-to]");
    if (!nums.length) return;

    if (reduced || !("IntersectionObserver" in window)) return;  // final value already in the HTML

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { observer.observe(el); });

    function run(el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10);
      var suffix = el.getAttribute("data-count-suffix") || "";
      if (isNaN(target)) return;

      var duration = 1100, start = null;
      function step(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);          // ease-out cubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }
  }

  /* Highlight the nav link for whichever section is currently in view. */
  function initScrollSpy() {
    var links = document.querySelectorAll('.nav__links a[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    var sections = [];
    Array.prototype.forEach.call(links, function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      map[id] = link;
      sections.push(section);
    });
    if (!sections.length) return;

    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      // Topmost section still on screen wins, so the marker never flickers
      // between two sections that overlap the viewport.
      var current = null;
      sections.forEach(function (s) { if (!current && visible[s.id]) current = s.id; });
      Array.prototype.forEach.call(links, function (l) { l.classList.remove("is-active"); });
      if (current && map[current]) map[current].classList.add("is-active");
    }, { rootMargin: "-45% 0px -45% 0px" });

    sections.forEach(function (s) { observer.observe(s); });
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
