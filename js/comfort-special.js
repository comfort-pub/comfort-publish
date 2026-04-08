$(function () {
  var site = window.ComfortSite || {};
  var modules = site.modules || {};
  var siteMap = site.siteMap || {};

  if (typeof modules.initHeaderMenu === "function") {
    modules.initHeaderMenu({
      headerArea: $(".header-area"),
      menuButton: $(".btn-menu"),
      mobileHome: $(".header-mobile-home"),
      gnbItems: $(".gnb-item"),
      quickMenu: $("#headerQuickMenu"),
      mobileMenuBackdrop: $("#mobileMenuBackdrop"),
      mobileMenuPanel: $("#mobileMenuPanel"),
      mobileMenuGroups: $("#mobileMenuGroups"),
      navigationMenus: siteMap.navigationMenus,
      defaultMenuKey: "intro"
    });
  }

  $("[data-scroll-top]").on("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  function formatCount(value) {
    return value.toLocaleString("en-US");
  }

  function animateCount(node) {
    var target = parseInt(node.getAttribute("data-count"), 10);

    if (!target || node.getAttribute("data-counted") === "true") {
      return;
    }

    var duration = 1400;
    var startTime = null;
    node.setAttribute("data-counted", "true");

    function step(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      node.textContent = formatCount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  var animatedTargets = [
    document.querySelector(".comfort-proof-stats"),
    document.querySelector(".comfort-story-grid"),
    document.querySelector(".comfort-cta-grid")
  ].filter(Boolean);

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!animatedTargets.length) {
    return;
  }

  if (reduceMotion || typeof window.IntersectionObserver !== "function") {
    animatedTargets.forEach(function (node) {
      node.classList.add("is-visible");
    });

    $(".comfort-proof-stat-number").each(function () {
      animateCount(this);
    });

    return;
  }

  var observer = new window.IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("comfort-proof-stats")) {
        entry.target.querySelectorAll(".comfort-proof-stat-number").forEach(function (node) {
          animateCount(node);
        });
      }

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px"
  });

  animatedTargets.forEach(function (node) {
    observer.observe(node);
  });
});
