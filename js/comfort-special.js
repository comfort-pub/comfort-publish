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

  if (typeof modules.initScrollReveal === "function") {
    modules.initScrollReveal({
      root: document,
      selector: "[data-reveal]"
    });
  }
});
