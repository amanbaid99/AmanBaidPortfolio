/* SIP calculator + planned-vs-unplanned comparison.
   No dependencies. Everything degrades to the static markup without JS. */
(function () {
  "use strict";

  var root = document.querySelector("[data-calc]");
  if (!root) return;

  /* ---------- money ---------------------------------------------------- */

  function inr(n) {
    n = Math.round(n);
    if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
    if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
    return "₹" + n.toLocaleString("en-IN");
  }
  function inrFull(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }

  /* ---------- projection ------------------------------------------------
     Monthly compounding, contribution at the start of each month.
     stepUp raises the monthly amount once every 12 months.
     A pause skips contributions for a stretch while the balance still runs. */

  function project(opts) {
    var months = opts.years * 12,
        i = (opts.annualRate / 100) / 12,
        monthly = opts.monthly,
        stepUp = (opts.stepUp || 0) / 100,
        pauseFrom = opts.pauseFrom || 0,
        pauseLen = opts.pauseMonths || 0,
        balance = 0, invested = 0,
        series = [{ m: 0, invested: 0, value: 0 }];

    for (var m = 1; m <= months; m++) {
      var paused = pauseLen > 0 && m > pauseFrom && m <= pauseFrom + pauseLen;
      if (!paused) { balance += monthly; invested += monthly; }
      balance *= (1 + i);
      if (m % 12 === 0) monthly *= (1 + stepUp);
      series.push({ m: m, invested: invested, value: balance });
    }
    return { series: series, invested: invested, value: balance };
  }

  /* ---------- chart ------------------------------------------------------
     Inline SVG, two series, direct end-labels + legend + a table view.
     The palette WARNs on colour-blind separation, so identity never rests on
     hue alone: the second series is dashed and both are labelled. */

  var PAL = { a: "#2a8560", b: "#b4552f" };

  function chart(host, series, labels, opts) {
    opts = opts || {};
    var W = 720, H = 300, L = 58, R = 96, T = 18, B = 34;
    var all = series.reduce(function (a, s) { return a.concat(s); }, []);
    var maxY = Math.max.apply(null, all.map(function (p) { return p.y; })) || 1;
    var maxX = Math.max.apply(null, all.map(function (p) { return p.x; })) || 1;

    // round the axis top to something readable
    var pow = Math.pow(10, Math.floor(Math.log10(maxY)));
    var top = Math.ceil(maxY / (pow / 2)) * (pow / 2);

    var x = function (v) { return L + (v / maxX) * (W - L - R); };
    var y = function (v) { return T + (1 - v / top) * (H - T - B); };

    var ticks = [0, 0.25, 0.5, 0.75, 1].map(function (f) { return top * f; });
    var svg = [];
    svg.push('<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' +
             opts.alt + '" preserveAspectRatio="none" class="chart__svg">');

    ticks.forEach(function (t) {
      svg.push('<line class="chart__grid" x1="' + L + '" x2="' + (W - R) +
               '" y1="' + y(t) + '" y2="' + y(t) + '"/>');
      svg.push('<text class="chart__tick" x="' + (L - 10) + '" y="' + (y(t) + 4) +
               '" text-anchor="end">' + inr(t) + '</text>');
    });

    var yearStep = maxX > 20 ? 5 : (maxX > 10 ? 2 : 1);
    for (var yr = 0; yr <= maxX; yr += yearStep) {
      svg.push('<text class="chart__tick" x="' + x(yr) + '" y="' + (H - 12) +
               '" text-anchor="middle">' + yr + (yr === maxX ? "y" : "") + "</text>");
    }

    series.forEach(function (s, idx) {
      var d = s.map(function (p, k) { return (k ? "L" : "M") + x(p.x) + " " + y(p.y); }).join(" ");
      var col = idx === 0 ? PAL.a : PAL.b;
      if (idx === 0) {
        svg.push('<path class="chart__area" d="' + d + " L" + x(maxX) + " " + y(0) +
                 " L" + x(0) + " " + y(0) + ' Z" fill="' + col + '"/>');
      }
      svg.push('<path class="chart__line" d="' + d + '" stroke="' + col +
               '"' + (idx ? ' stroke-dasharray="6 4"' : "") + "/>");
      var last = s[s.length - 1];
      svg.push('<text class="chart__endlabel" x="' + (x(last.x) + 8) + '" y="' +
               (y(last.y) + 4) + '" fill="' + col + '">' + inr(last.y) + "</text>");
    });

    svg.push('<line class="chart__cursor" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '" style="display:none"/>');
    svg.push("</svg>");

    var legend = '<ul class="chart__legend">' + labels.map(function (l, idx) {
      return '<li><span class="chart__key" style="background:' + (idx ? PAL.b : PAL.a) +
             (idx ? ";--dash:1" : "") + '"></span>' + l + "</li>";
    }).join("") + "</ul>";

    host.innerHTML = legend +
      '<div class="chart__plot">' + svg.join("") +
      '<div class="chart__tip" hidden></div></div>' + tableView(series, labels);

    wireHover(host, series, labels, { x: x, y: y, W: W, maxX: maxX });
  }

  function tableView(series, labels) {
    var rows = "", n = series[0].length;
    for (var k = 0; k < n; k++) {
      if (k % 12 !== 0) continue;
      rows += "<tr><th scope=\"row\">" + (series[0][k].x).toFixed(0) + "</th>" +
        series.map(function (s) { return "<td>" + inrFull(s[k].y) + "</td>"; }).join("") + "</tr>";
    }
    return '<details class="chart__table"><summary>View as a table</summary>' +
      '<div class="chart__tablewrap"><table><thead><tr><th scope="col">Year</th>' +
      labels.map(function (l) { return '<th scope="col">' + l + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows + "</tbody></table></div></details>";
  }

  function wireHover(host, series, labels, g) {
    var plot = host.querySelector(".chart__plot"),
        svg = host.querySelector(".chart__svg"),
        cursor = host.querySelector(".chart__cursor"),
        tip = host.querySelector(".chart__tip");
    if (!plot) return;

    function move(ev) {
      var box = plot.getBoundingClientRect();
      var px = ((ev.touches ? ev.touches[0].clientX : ev.clientX) - box.left) / box.width * g.W;
      var frac = Math.min(Math.max((px - g.x(0)) / (g.x(g.maxX) - g.x(0)), 0), 1);
      var idx = Math.round(frac * (series[0].length - 1));
      var pt = series[0][idx];
      cursor.setAttribute("x1", g.x(pt.x)); cursor.setAttribute("x2", g.x(pt.x));
      cursor.style.display = "";
      tip.hidden = false;
      tip.innerHTML = "<strong>Year " + pt.x.toFixed(1).replace(/\.0$/, "") + "</strong>" +
        series.map(function (s, i) {
          return '<span><i style="background:' + (i ? PAL.b : PAL.a) + '"></i>' +
                 labels[i] + " " + inrFull(s[idx].y) + "</span>";
        }).join("");
      var leftPct = (g.x(pt.x) / g.W) * 100;
      tip.style.left = Math.min(Math.max(leftPct, 12), 88) + "%";
    }
    function leave() { cursor.style.display = "none"; tip.hidden = true; }

    plot.addEventListener("mousemove", move);
    plot.addEventListener("mouseleave", leave);
    plot.addEventListener("touchmove", move, { passive: true });
    plot.addEventListener("touchend", leave);
  }

  /* ---------- fields ----------------------------------------------------- */

  function bind(name, fn) {
    var range = root.querySelector('[data-range="' + name + '"]');
    var num = root.querySelector('[data-num="' + name + '"]');
    if (!range || !num) return function () { return 0; };
    function sync(src) {
      var v = Math.min(Math.max(Number(src.value) || 0, Number(range.min)), Number(range.max));
      range.value = v; num.value = v; fn();
    }
    range.addEventListener("input", function () { sync(range); });
    num.addEventListener("input", function () { sync(num); });
    num.addEventListener("blur", function () { sync(num); });
    return function () { return Number(range.value); };
  }

  function setText(sel, txt) {
    var el = root.querySelector(sel);
    if (el) el.textContent = txt;
  }

  /* ---------- tab 1: plain SIP ------------------------------------------- */

  var sipAmount, sipYears, sipRate;
  function renderSip() {
    var r = project({ monthly: sipAmount(), years: sipYears(), annualRate: sipRate() });
    setText("[data-out=sip-invested]", inr(r.invested));
    setText("[data-out=sip-returns]", inr(r.value - r.invested));
    setText("[data-out=sip-total]", inr(r.value));
    setText("[data-out=sip-total-full]", inrFull(r.value));

    var val = r.series.map(function (p) { return { x: p.m / 12, y: p.value }; });
    var inv = r.series.map(function (p) { return { x: p.m / 12, y: p.invested }; });
    chart(root.querySelector("[data-chart=sip]"), [val, inv],
          ["Projected value", "You invested"],
          { alt: "Projected SIP value against the amount invested, over " + sipYears() + " years" });
  }

  /* ---------- tab 2: planned vs unplanned -------------------------------- */

  var cmpAmount, cmpYears, cmpRate, cmpStep, cmpPause, cmpDrag;
  function renderCompare() {
    var years = cmpYears(), months = years * 12, base = cmpAmount(), rate = cmpRate();

    /* The head-to-head holds contributions identical, so the gap is behaviour
       and not one side simply paying in more. Stepping up IS a real benefit of
       planning, but it works by investing more money — folding it in here would
       put most of the "difference" down to extra contributions. It is reported
       separately, with its own paid-in figure. */
    var planned = project({ monthly: base, years: years, annualRate: rate });
    var unplanned = project({
      monthly: base, years: years,
      annualRate: Math.max(rate - cmpDrag(), 0),
      pauseFrom: Math.round(months * 0.4), pauseMonths: cmpPause()
    });
    var stepped = project({ monthly: base, years: years, annualRate: rate, stepUp: cmpStep() });

    setText("[data-out=cmp-unplanned]", inr(unplanned.value));
    setText("[data-out=cmp-unplanned-inv]", inr(unplanned.invested) + " paid in");
    setText("[data-out=cmp-planned]", inr(planned.value));
    setText("[data-out=cmp-planned-inv]", inr(planned.invested) + " paid in");
    setText("[data-out=cmp-gap]", inr(planned.value - unplanned.value));

    var extra = planned.invested - unplanned.invested;
    setText("[data-out=cmp-gap-sub]", extra > 0
      ? "on " + inr(extra) + " more paid in — the rest is behaviour"
      : "on the same amount paid in");

    setText("[data-out=cmp-step-pct]", cmpStep() + "%");
    setText("[data-out=cmp-step]", inr(stepped.value));
    setText("[data-out=cmp-step-inv]", inr(stepped.invested));

    var a = planned.series.map(function (p) { return { x: p.m / 12, y: p.value }; });
    var b = unplanned.series.map(function (p) { return { x: p.m / 12, y: p.value }; });
    chart(root.querySelector("[data-chart=compare]"), [a, b],
          ["With a plan", "Without one"],
          { alt: "Two projections over " + years + " years on the same monthly amount: " +
                 "a SIP left running against one paused and switched" });
  }

  /* ---------- tabs -------------------------------------------------------- */

  var tabs = Array.prototype.slice.call(root.querySelectorAll("[role=tab]"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.classList.toggle("is-active", on);
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (tab.getAttribute("aria-controls") === "panel-compare") renderCompare();
      else renderSip();
    });
  });

  sipAmount = bind("sip-amount", renderSip);
  sipYears  = bind("sip-years", renderSip);
  sipRate   = bind("sip-rate", renderSip);

  cmpAmount = bind("cmp-amount", renderCompare);
  cmpYears  = bind("cmp-years", renderCompare);
  cmpRate   = bind("cmp-rate", renderCompare);
  cmpStep   = bind("cmp-step", renderCompare);
  cmpPause  = bind("cmp-pause", renderCompare);
  cmpDrag   = bind("cmp-drag", renderCompare);

  root.classList.add("is-live");
  renderSip();
  renderCompare();
})();
