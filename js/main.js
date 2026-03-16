$(function () {
  var site = window.ComfortSite || {};
  var modules = site.modules || {};
  var siteMap = site.siteMap || {};
  var mainPage = site.pages && site.pages.main ? site.pages.main : {};

  if (typeof modules.initHeaderMenu === "function") {
    modules.initHeaderMenu({
      menuButton: $(".btn-menu"),
      gnb: $(".gnb"),
      gnbItems: $(".gnb-item"),
      quickMenu: $("#headerQuickMenu"),
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
      tabsData: mainPage.sec2Tabs,
      defaultTabKey: "pico"
    });
  }

  if (typeof modules.initMainSec3Cards === "function") {
    modules.initMainSec3Cards({
      cards: $("#sec3 .sec3-card")
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
});
