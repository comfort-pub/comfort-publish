(function (window) {
  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  site.modules.initHeaderMenu = function initHeaderMenu(options) {
    var $menuButton = options.menuButton;
    var $gnb = options.gnb;
    var $gnbItems = options.gnbItems;
    var $quickMenu = options.quickMenu;
    var navigationMenus = options.navigationMenus || {};

    function renderQuickMenu(menuKey) {
      var menuItems = navigationMenus[menuKey] || [];
      var html = "";

      $.each(menuItems, function (_, item) {
        var menuItem = $.isPlainObject(item) ? item : { label: item, href: "#" };
        var href = escapeHtml(menuItem.href || "#");
        var pageKey = escapeHtml(menuItem.pageKey || "");
        var label = escapeHtml(menuItem.label || "");

        html += '<a href="' + href + '" class="quick-menu-link" data-page-key="' + pageKey + '">' + label + "</a>";
      });

      $quickMenu.html(html);
    }

    if ($menuButton.length && $gnb.length) {
      $menuButton.on("click", function () {
        $gnb.toggleClass("is-open");
      });
    }

    if ($gnbItems.length && $quickMenu.length) {
      $gnbItems.on("mouseenter focusin", function () {
        var $currentItem = $(this);
        var menuKey = $currentItem.data("menu");

        $gnbItems.removeClass("is-active");
        $currentItem.addClass("is-active");
        renderQuickMenu(menuKey);
      });

      renderQuickMenu(options.defaultMenuKey || "intro");
    }
  };
})(window);
