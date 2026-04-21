(function (window, document) {
  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  function applyRevealStyles(node) {
    var delay = node.getAttribute("data-reveal-delay");
    var distance = node.getAttribute("data-reveal-distance");
    var scale = node.getAttribute("data-reveal-scale");

    node.classList.add("scroll-reveal");

    if (delay) {
      node.style.setProperty("--reveal-delay", delay);
    }

    if (distance) {
      node.style.setProperty("--reveal-distance", distance);
    }

    if (scale) {
      node.style.setProperty("--reveal-scale", scale);
    }
  }

  site.modules.initScrollReveal = function initScrollReveal(options) {
    var settings = options || {};
    var root = settings.root || document;
    var selector = settings.selector || "[data-reveal]";
    var nodes = Array.prototype.slice.call(root.querySelectorAll(selector));
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!nodes.length) {
      return;
    }

    nodes.forEach(applyRevealStyles);

    if (reduceMotion || typeof window.IntersectionObserver !== "function") {
      nodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    var observer = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: settings.threshold || 0.16,
      rootMargin: settings.rootMargin || "0px 0px -20% 0px"
    });

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  };
})(window, document);
