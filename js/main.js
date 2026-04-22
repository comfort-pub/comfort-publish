$(function () {
  var site = window.ComfortSite || {};
  var modules = site.modules || {};
  var siteMap = site.siteMap || {};
  var mainPage = site.pages && site.pages.main ? site.pages.main : {};

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

  if (typeof modules.initMainSec2Tabs === "function") {
    modules.initMainSec2Tabs({
      tabs: $("#sec2Tabs"),
      image: $("#sec2 .sec2-treatment-image"),
      marquee: $("#sec2MainTitleMarquee"),
      mainTitle: $("#sec2MainTitle"),
      mainTitleClone: $("#sec2MainTitleClone"),
      serviceTitle: $("#sec2ServiceTitle"),
      serviceDesc: $("#sec2ServiceDesc"),
      detailBtn: $("#sec2 .sec2-detail-btn"),
      tabsData: mainPage.sec2Tabs,
      defaultTabKey: "pico"
    });
  }

  if (typeof modules.initMainSec7Results === "function") {
    modules.initMainSec7Results({
      carousel: $("#sec7Carousel"),
      track: $("#sec7Track"),
      prevButton: $("#sec7Prev"),
      nextButton: $("#sec7Next"),
      fallbackResults: mainPage.sec7FallbackResults
    });
  }

  var $body = $("body");
  var $quickToggle = $(".floating-quick-toggle");
  var $quickActions = $(".floating-quick-menu .floating-quick-action");
  var $tattooFloatingActions = $(".tattoo-floating-actions");

  $tattooFloatingActions.each(function () {
    var $menu = $(this).find(".tattoo-floating-menu");

    if ($menu.length && !$menu.children(".tattoo-floating-toggle").length) {
      $menu.prepend('<button type="button" class="tattoo-floating-toggle" aria-label="빠른 메뉴 열기" aria-expanded="false"></button>');
    }
  });

  var $tattooQuickToggle = $(".tattoo-floating-toggle");
  var $tattooQuickActions = $(".tattoo-floating-menu .tattoo-floating-action");

  function isMobileQuickMenu() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  function isDesktopQuickMenu() {
    return window.matchMedia("(min-width: 801px)").matches;
  }

  function setQuickMenuOpen($targetBody, $targetToggle, isOpen) {
    $targetBody.toggleClass("quick-menu-open", isOpen);
    $targetToggle.attr("aria-expanded", isOpen ? "true" : "false");
    $targetToggle.attr("aria-label", isOpen ? "빠른 메뉴 닫기" : "빠른 메뉴 열기");

    if (isMobileQuickMenu()) {
      $("html, body").css("overflow", $("body.quick-menu-open").length ? "hidden" : "");
    }
  }

  $quickToggle.on("click", function () {
    setQuickMenuOpen($body, $quickToggle, !$body.hasClass("quick-menu-open"));
  });

  $quickActions.on("click", function () {
    setQuickMenuOpen($body, $quickToggle, false);
  });

  $(document).on("click", function (event) {
    if (!isDesktopQuickMenu() || !$body.hasClass("quick-menu-open")) {
      return;
    }

    if ($(event.target).closest(".floating-quick-actions").length) {
      return;
    }

    setQuickMenuOpen($body, $quickToggle, false);
  });

  $tattooQuickToggle.on("click", function () {
    var $currentToggle = $(this);
    var $currentBody = $currentToggle.closest("body");

    setQuickMenuOpen($currentBody, $currentToggle, !$currentBody.hasClass("quick-menu-open"));
  });

  $tattooQuickActions.on("click", function () {
    var $currentBody = $(this).closest("body");
    var $currentToggle = $currentBody.find(".tattoo-floating-toggle");

    setQuickMenuOpen($currentBody, $currentToggle, false);
  });

  $(window).on("resize", function () {
    if (!isMobileQuickMenu()) {
      if ($quickToggle.length) {
        setQuickMenuOpen($body, $quickToggle, false);
      }

      if ($tattooQuickToggle.length) {
        $tattooQuickToggle.each(function () {
          var $currentToggle = $(this);
          setQuickMenuOpen($currentToggle.closest("body"), $currentToggle, false);
        });
      }
    }
  });

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      $body.addClass("main-hero-intro-ready");
    });
  });

  (function initSec5Highlight() {
    var sec5 = document.getElementById("sec5");

    if (!sec5) {
      return;
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (typeof window.IntersectionObserver !== "function") {
      sec5.classList.add("is-highlight-active");
      return;
    }

    var observer = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        sec5.classList.toggle("is-highlight-active", entry.isIntersecting);
      });
    }, {
      threshold: 0.28
    });

    observer.observe(sec5);
  })();

  $("[data-scroll-top]").on("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  if (typeof modules.initScrollReveal === "function") {
    modules.initScrollReveal({
      root: document,
      selector: "[data-reveal]"
    });
  }
});
