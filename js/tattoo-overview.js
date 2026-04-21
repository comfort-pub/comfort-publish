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
      defaultMenuKey: "tattoo"
    });
  }

  var $body = $("body");
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

  function setQuickMenuOpen(isOpen) {
    $body.toggleClass("quick-menu-open", isOpen);
    $tattooQuickToggle.attr("aria-expanded", isOpen ? "true" : "false");
    $tattooQuickToggle.attr("aria-label", isOpen ? "빠른 메뉴 닫기" : "빠른 메뉴 열기");
    $("html, body").css("overflow", isMobileQuickMenu() && isOpen ? "hidden" : "");
  }

  $tattooQuickToggle.on("click", function () {
    setQuickMenuOpen(!$body.hasClass("quick-menu-open"));
  });

  $tattooQuickActions.on("click", function () {
    setQuickMenuOpen(false);
  });

  $(document).on("click", function (event) {
    if (!isDesktopQuickMenu() || !$body.hasClass("quick-menu-open")) {
      return;
    }

    if ($(event.target).closest(".tattoo-floating-actions").length) {
      return;
    }

    setQuickMenuOpen(false);
  });

  $(window).on("resize", function () {
    if (!isMobileQuickMenu()) {
      setQuickMenuOpen(false);
    }
  });

  if (typeof modules.initTattooOverview === "function") {
    modules.initTattooOverview({
      faqItems: $(".tattoo-faq-item"),
      scrollTopButton: $("[data-scroll-top]"),
      resultCarousel: $("[data-result-carousel]"),
      resultDots: $("[data-result-dot]"),
      aftercareCards: $("[data-aftercare-card]")
    });
  }

  if (typeof modules.initScrollReveal === "function") {
    modules.initScrollReveal({
      root: document,
      selector: "[data-reveal]"
    });
  }
});
