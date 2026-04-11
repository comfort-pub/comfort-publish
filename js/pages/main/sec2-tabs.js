(function (window) {
  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  site.modules.initMainSec2Tabs = function initMainSec2Tabs(options) {
    var $tabs = options.tabs;
    var $image = options.image;
    var $marquee = options.marquee;
    var $mainTitle = options.mainTitle;
    var $mainTitleClone = options.mainTitleClone;
    var $serviceTitle = options.serviceTitle;
    var $serviceDesc = options.serviceDesc;
    var tabsData = options.tabsData || {};
    var mobileImage = "./assets/images/main/remove_mo.png";

    function getTabImage(currentTab) {
      if (window.matchMedia("(max-width: 800px)").matches) {
        return mobileImage;
      }

      return currentTab.image;
    }

    function renderServiceDesc(currentTab) {
      if (currentTab.serviceDescHtml) {
        $serviceDesc.html(currentTab.serviceDescHtml);
        return;
      }

      $serviceDesc.text(currentTab.serviceDesc);
    }

    function renderMainTitle(parts) {
      var html = "";

      $.each(parts || [], function (_, label) {
        html += '<span class="sec2-title-main-piece">' + label + "</span>";
      });

      return html;
    }

    function renderTab(tabKey) {
      var currentTab = tabsData[tabKey];

      if (!currentTab) {
        return;
      }

      $tabs.closest("#sec2").toggleClass("is-scallp-desc", tabKey === "scalp");

      $mainTitle.html(renderMainTitle(currentTab.mainTitleParts));
      $mainTitleClone.html(renderMainTitle(currentTab.mainTitleParts));
      $serviceTitle.text(currentTab.serviceTitle);
      renderServiceDesc(currentTab);
      $image.css("background-image", 'url("' + getTabImage(currentTab) + '")');
      $marquee.css("animation", "none");

      if ($marquee[0]) {
        $marquee[0].offsetHeight;
      }

      $marquee.css("animation", "");

      $tabs.find("li").removeClass("is-active");
      $tabs.find('button[data-tab="' + tabKey + '"]').closest("li").addClass("is-active");
    }

    if (!$tabs.length) {
      return;
    }

    $tabs.on("click", "button", function () {
      renderTab($(this).data("tab"));
    });

    renderTab(options.defaultTabKey || "pico");
  };
})(window);
