/* ============================================================
   Satria Wibawa Hadiwijaya - portfolio
   Progressive enhancement only: every behaviour below is
   optional. With JS off the page is fully readable and usable.
   Each function no-ops when its elements are absent.
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 1. Mobile menu ---------- */
  function menu() {
    var btn = $(".nav__toggle"), links = $("#nav-links");
    if (!btn || !links) return;
    function set(open) {
      btn.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
    }
    btn.addEventListener("click", function () {
      set(btn.getAttribute("aria-expanded") !== "true");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") set(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        set(false); btn.focus();
      }
    });
  }

  /* ---------- 2. Sticky header state ----------
     A sentinel above the header tells us when we have scrolled
     past the top, without ever binding a scroll listener.        */
  function stickyHeader() {
    var sentinel = $("[data-nav-sentinel]"), header = $(".nav");
    if (!sentinel || !header || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- 3. Reveal on scroll ---------- */
  function reveal() {
    if (!("IntersectionObserver" in window)) return;
    var targets = $$(".about__text, .about__portrait, .section > h2, .section__head, .timeline, .tl, .role, .card, .featured, .cluster, .contact__grid > li");
    if (reduced.matches) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    targets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. Timeline draw ---------- */
  function timeline() {
    var tl = $(".timeline");
    if (!tl || !("IntersectionObserver" in window)) return;
    if (reduced.matches) { tl.classList.add("is-drawn"); return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      tl.classList.add("is-drawn");
      io.disconnect();
    }, { threshold: 0.05 });
    io.observe(tl);
  }

  /* ---------- 5. Scroll-spy nav ---------- */
  function scrollSpy() {
    var links = $$("#nav-links a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    var sections = links.map(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) map[el.id] = a;
      return el;
    }).filter(Boolean);
    if (!sections.length) return;

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = sections.filter(function (s) { return visible[s.id]; })[0];
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      if (current && map[current.id]) map[current.id].setAttribute("aria-current", "true");
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- 6. Signal-chain filter ----------
     Turns the Sense / Process / Actuate / Verify strip from a
     description of the ordering into a working control.          */
  function chainFilter() {
    var buttons = $$(".chain__btn");
    var items = $$("[data-chain]");
    var status = $("[data-chain-status]");
    var countEl = $("[data-chain-count]");
    var resetBtn = $("[data-chain-reset]");
    if (!buttons.length || !items.length) return;

    var active = null;

    function apply(stage) {
      active = stage;
      var shown = 0;
      items.forEach(function (el) {
        var match = !stage || (" " + el.dataset.chain + " ").indexOf(" " + stage + " ") > -1;
        el.hidden = !match;
        el.classList.toggle("is-filtered-out", !match);
        if (match) {
          /* A card hidden before the reveal observer reached it would
             come back at opacity 0. Anything we show is shown fully. */
          el.classList.add("is-visible");
          shown++;
        }
      });
      buttons.forEach(function (b) {
        var on = b.dataset.filter === stage;
        b.setAttribute("aria-pressed", String(on));
        b.classList.toggle("is-active", on);
      });
      if (status && countEl) {
        if (stage) {
          var label = stage.charAt(0).toUpperCase() + stage.slice(1);
          countEl.textContent = "Showing " + shown + " of " + items.length +
            " projects that involve " + label + ".";
          status.hidden = false;
        } else {
          countEl.textContent = "";
          status.hidden = true;
        }
      }
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.dataset.filter === active ? null : b.dataset.filter);
      });
    });
    if (resetBtn) resetBtn.addEventListener("click", function () {
      apply(null);
      var first = buttons[0];
      if (first) first.focus();
    });
  }

  /* ---------- 7. Image lightbox ----------
     Uses a native <dialog> so Escape, focus trapping and the
     backdrop come from the platform rather than hand-rolled.     */
  function lightbox() {
    var zoomables = $$("img[data-zoom]");
    if (!zoomables.length || typeof HTMLDialogElement === "undefined") return;

    var dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close image">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
      '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      '</svg></button>' +
      '<figure class="lightbox__fig"><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(dlg);

    var img = $("img", dlg), cap = $("figcaption", dlg);

    zoomables.forEach(function (source) {
      source.classList.add("is-zoomable");
      source.addEventListener("click", function () {
        img.src = source.currentSrc || source.src;
        img.alt = source.alt || "";
        var figcap = source.closest("figure") && $("figcaption", source.closest("figure"));
        cap.textContent = figcap ? figcap.textContent : source.alt || "";
        cap.hidden = !cap.textContent;
        dlg.showModal();
      });
    });

    $(".lightbox__close", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { img.removeAttribute("src"); });
  }

  /* ---------- 8. Copy to clipboard ---------- */
  function copy() {
    $$("[data-copy]").forEach(function (btn) {
      if (!navigator.clipboard) { btn.hidden = true; return; }
      var original = btn.textContent;
      var timer;
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(btn.dataset.copy).then(function () {
          btn.textContent = "Copied";
          btn.classList.add("is-done");
          clearTimeout(timer);
          timer = setTimeout(function () {
            btn.textContent = original;
            btn.classList.remove("is-done");
          }, 2000);
        }).catch(function () {
          btn.textContent = "Press Ctrl+C";
        });
      });
    });
  }

  /* ---------- 9. Eased in-page scrolling ----------
     Native `scroll-behavior: smooth` cannot offset for the sticky
     header and gives no control over the curve. This runs its own
     eased animation, keeps focus correct for keyboard users, and
     bails out the moment the visitor takes over the scroll.        */
  /* Height of the collapsed bar. While the mobile menu is open (or
     mid-transition) the nav is temporarily much taller, and that
     inflated value would push every scroll target too far down, so
     we keep the last known collapsed height instead. */
  var lastNavH = 72;
  function navHeight() {
    var nav = $(".nav"), links = $("#nav-links");
    if (!nav) return lastNavH;
    var open = links && links.classList.contains("is-open");
    if (!open) lastNavH = Math.round(nav.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--nav-h", lastNavH + "px");
    return lastNavH;
  }

  function smoothScroll() {
    var html = document.documentElement;
    navHeight();
    window.addEventListener("resize", navHeight, { passive: true });

    /* Hand scrolling back to the browser; we drive it ourselves. */
    if (!reduced.matches) html.style.scrollBehavior = "auto";

    var animating = false;

    function ease(t) {                       // easeInOutCubic
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function stop() { animating = false; }
    ["wheel", "touchstart", "keydown"].forEach(function (evt) {
      window.addEventListener(evt, stop, { passive: true });
    });

    function glideTo(target, done) {
      var offset = navHeight() + 24;
      var start = window.scrollY;
      var end = Math.max(0, Math.min(
        target.getBoundingClientRect().top + start - offset,
        document.body.scrollHeight - window.innerHeight
      ));
      var dist = end - start;
      if (Math.abs(dist) < 2) { done(); return; }

      /* Longer trips take longer, but never drag on. */
      var duration = Math.min(1100, Math.max(450, Math.abs(dist) * 0.45));
      var t0 = null;
      animating = true;

      function step(ts) {
        if (!animating) { done(); return; }
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / duration);
        window.scrollTo(0, start + dist * ease(p));
        if (p < 1) requestAnimationFrame(step);
        else { animating = false; done(); }
      }
      requestAnimationFrame(step);
    }

    function arrive(target) {
      target.classList.remove("is-target");
      void target.offsetWidth;                       // restart the animation
      target.classList.add("is-target");
      setTimeout(function () { target.classList.remove("is-target"); }, 1400);

      /* Keyboard users must land inside the section, not back at the top. */
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }

    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href").slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      if (reduced.matches) {
        target.scrollIntoView();
        arrive(target);
      } else {
        glideTo(target, function () { arrive(target); });
      }
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    });
  }

  /* ---------- 10. Back to top ---------- */
  function toTop() {
    var btn = $("[data-to-top]"), sentinel = $("[data-nav-sentinel]");
    if (!btn || !sentinel || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      btn.hidden = entries[0].isIntersecting;
    }, { rootMargin: "600px 0px 0px 0px" }).observe(sentinel);
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced.matches ? "auto" : "smooth" });
      var mark = $(".nav__mark");
      if (mark) mark.focus({ preventScroll: true });
    });
  }

  [menu, stickyHeader, reveal, timeline, scrollSpy, chainFilter, lightbox, copy, smoothScroll, toTop]
    .forEach(function (fn) {
      try { fn(); } catch (err) {
        /* One broken behaviour must never take the rest of the page down. */
        if (window.console) console.warn("[main.js]", fn.name, err);
      }
    });
})();
