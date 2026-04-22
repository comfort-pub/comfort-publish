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
  var picoComfortMarqueeResizeTimerId = null;

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

  function initPicoComfortMarquee() {
    var $marquee = $(".pico-comfort-marquee");
    var $track = $marquee.find(".pico-comfort-marquee-track");
    var $source = $track.find(".pico-comfort-marquee-text").first();
    var sourceText;

    if (!$marquee.length || !$track.length || !$source.length) {
      return;
    }

    sourceText = $.trim($source.text());

    function renderMarquee() {
      var marqueeNode = $marquee.get(0);
      var sourceNode = $track.find(".pico-comfort-marquee-text").first().get(0);
      var marqueeWidth;
      var sourceWidth;
      var repeatCount;
      var items = [];
      var textHtml;
      var i;

      if (!marqueeNode || !sourceNode) {
        return;
      }

      marqueeWidth = marqueeNode.clientWidth || window.innerWidth || 0;
      sourceWidth = sourceNode.getBoundingClientRect().width || sourceNode.scrollWidth || 1;
      repeatCount = Math.max(4, Math.ceil((marqueeWidth * 1.35) / Math.max(sourceWidth, 1)));
      textHtml = $("<div>").text(sourceText).html();

      for (i = 0; i < repeatCount; i += 1) {
        items.push('<span class="pico-comfort-marquee-text">' + textHtml + "</span>");
      }

      $track.html(items.join("") + items.join(""));
    }

    renderMarquee();

    $(window).on("resize", function () {
      if (picoComfortMarqueeResizeTimerId) {
        window.clearTimeout(picoComfortMarqueeResizeTimerId);
      }

      picoComfortMarqueeResizeTimerId = window.setTimeout(renderMarquee, 120);
    });
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

  $("[data-scroll-top]").on("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  if (typeof modules.initTattooOverview === "function") {
    modules.initTattooOverview({
      resultCarousel: $("[data-result-carousel]"),
      resultDots: $("[data-result-dot]")
    });
  }

  if (typeof modules.initScrollReveal === "function") {
    modules.initScrollReveal({
      root: document,
      selector: "[data-reveal]"
    });
  }

  initPicoComfortMarquee();
});
