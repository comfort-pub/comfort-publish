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

  function resolveSiteHref(href) {
    var value = String(href || "#");
    var pathname = window.location.pathname || "/";
    var basePath = pathname;

    if (!value || value === "#" || /^(?:[a-z]+:|\/\/|#|\/)/i.test(value)) {
      return value;
    }

    if (/\/pages\//.test(pathname)) {
      basePath = pathname.replace(/\/pages\/.*$/, "/");
    } else {
      basePath = pathname.replace(/\/[^/]*$/, "/");
    }

    return basePath + value.replace(/^\.\//, "");
  }

  site.modules.initHeaderMenu = function initHeaderMenu(options) {
    var $headerArea = options.headerArea;
    var $menuButton = options.menuButton;
    var $mobileHome = options.mobileHome;
    var $gnbItems = options.gnbItems;
    var $quickMenu = options.quickMenu;
    var $mobileMenuBackdrop = options.mobileMenuBackdrop;
    var $mobileMenuPanel = options.mobileMenuPanel;
    var $mobileMenuGroups = options.mobileMenuGroups;
    var navigationMenus = options.navigationMenus || {};
    var defaultMenuKey = options.defaultMenuKey || "intro";
    var mobileQuery = window.matchMedia ? window.matchMedia("(max-width: 1024px)") : null;
    var desktopHeaderBreakpoint = 800;
    var lastOpenMenuKey = defaultMenuKey;
    var lockedScrollTop = 0;
    var defaultHeaderLogoMenuGap = 432;
    var defaultHeaderMenuGap = 167;
    var safeAreaRefreshTimerId = 0;

    function isMobileViewport() {
      return mobileQuery ? mobileQuery.matches : window.innerWidth <= 1024;
    }

    function isDesktopHeaderViewport() {
      return (window.innerWidth || document.documentElement.clientWidth || 0) > desktopHeaderBreakpoint;
    }

    function forceMobileSafeAreaRefresh() {
      if (!isMobileViewport() || $headerArea.hasClass("is-mobile-menu-open")) {
        return;
      }

      var currentScrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;

      document.body.style.setProperty("--mobile-scroll-lock-offset", (-currentScrollTop) + "px");
      $("body").addClass("is-mobile-safe-area-refresh");
      document.body.offsetHeight;

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          $("body").removeClass("is-mobile-safe-area-refresh");
          document.body.style.removeProperty("--mobile-scroll-lock-offset");
          window.scrollTo(0, currentScrollTop);
        });
      });
    }

    function scheduleMobileSafeAreaRefresh() {
      if (safeAreaRefreshTimerId) {
        window.clearTimeout(safeAreaRefreshTimerId);
      }

      if (!isMobileViewport()) {
        return;
      }

      safeAreaRefreshTimerId = window.setTimeout(function () {
        safeAreaRefreshTimerId = 0;
        forceMobileSafeAreaRefresh();
      }, 80);
    }

    function syncDesktopHeaderLayout() {
      var $headerInner = $headerArea.find(".header .inner");
      var $logo = $headerInner.find(".logo").first();
      var $desktopGnb = $headerInner.find(".gnb").first();
      var $desktopMenuItems = $desktopGnb.find(".gnb-list > .gnb-item");

      if (
        !$headerInner.length ||
        !$logo.length ||
        !$desktopGnb.length ||
        !$desktopMenuItems.length ||
        !isDesktopHeaderViewport()
      ) {
        $headerInner.css({
          "--header-logo-menu-gap": "",
          "--header-menu-gap": ""
        });
        return;
      }

      var headerInnerNode = $headerInner.get(0);
      var logoWidth = $logo.outerWidth() || 0;
      var menuItemWidthTotal = 0;
      var gapCount = Math.max($desktopMenuItems.length - 1, 0);

      $desktopMenuItems.each(function () {
        menuItemWidthTotal += $(this).outerWidth() || 0;
      });

      var availableGapSpace = headerInnerNode.clientWidth - logoWidth - menuItemWidthTotal;
      var defaultGapSpace = defaultHeaderLogoMenuGap + (defaultHeaderMenuGap * gapCount);
      var shrinkRatio = defaultGapSpace > 0 ? Math.min(1, Math.max(0, availableGapSpace / defaultGapSpace)) : 1;
      var resolvedLogoMenuGap = Math.max(0, defaultHeaderLogoMenuGap * shrinkRatio);
      var resolvedMenuGap = Math.max(0, defaultHeaderMenuGap * shrinkRatio);

      $headerInner.css({
        "--header-logo-menu-gap": resolvedLogoMenuGap.toFixed(2) + "px",
        "--header-menu-gap": resolvedMenuGap.toFixed(2) + "px"
      });
    }

    function getTopLevelMenus() {
      var menus = [];

      $gnbItems.each(function () {
        var $item = $(this);
        var menuKey = String($item.data("menu") || "");

        if (!menuKey) {
          return;
        }

        menus.push({
          key: menuKey,
          label: $.trim($item.text())
        });
      });

      return menus;
    }

    function getMenuItems(menuKey) {
      return $.isArray(navigationMenus[menuKey]) ? navigationMenus[menuKey] : [];
    }

    function renderQuickMenu(menuKey) {
      var menuItems = getMenuItems(menuKey);
      var html = "";

      $.each(menuItems, function (_, item) {
        var menuItem = $.isPlainObject(item) ? item : { label: item, href: "#" };
        var href = escapeHtml(resolveSiteHref(menuItem.href || "#"));
        var pageKey = escapeHtml(menuItem.pageKey || "");
        var label = escapeHtml(menuItem.label || "");

        html += '<a href="' + href + '" class="quick-menu-link" data-page-key="' + pageKey + '">' + label + "</a>";
      });

      $quickMenu.html(html);
    }

    function clearSubmenuTransition($submenu) {
      var submenuNode = $submenu.get(0);

      if (!submenuNode || !submenuNode._submenuTransitionHandler) {
        return;
      }

      submenuNode.removeEventListener("transitionend", submenuNode._submenuTransitionHandler);
      submenuNode._submenuTransitionHandler = null;
    }

    function setSubmenuFocusability($submenu, isOpen) {
      $submenu.attr("aria-hidden", isOpen ? "false" : "true");
      $submenu.find(".mobile-menu-link").attr("tabindex", isOpen ? "0" : "-1");
    }

    function openSubmenu($submenu, immediate) {
      var submenuNode = $submenu.get(0);

      if (!submenuNode) {
        return;
      }

      clearSubmenuTransition($submenu);
      $submenu.prop("hidden", false).addClass("is-open");
      setSubmenuFocusability($submenu, true);

      if (immediate) {
        submenuNode.style.height = "auto";
        submenuNode.style.opacity = "1";
        return;
      }

      submenuNode.style.height = "0px";
      submenuNode.style.opacity = "0";
      submenuNode.offsetHeight;
      submenuNode.style.height = submenuNode.scrollHeight + "px";
      submenuNode.style.opacity = "1";

      submenuNode._submenuTransitionHandler = function (event) {
        if (event.target !== submenuNode || event.propertyName !== "height") {
          return;
        }

        clearSubmenuTransition($submenu);

        if ($submenu.hasClass("is-open")) {
          submenuNode.style.height = "auto";
        }
      };

      submenuNode.addEventListener("transitionend", submenuNode._submenuTransitionHandler);
    }

    function closeSubmenu($submenu, immediate) {
      var submenuNode = $submenu.get(0);

      if (!submenuNode) {
        return;
      }

      clearSubmenuTransition($submenu);
      $submenu.removeClass("is-open");

      if (immediate) {
        submenuNode.style.height = "0px";
        submenuNode.style.opacity = "0";
        $submenu.prop("hidden", true);
        setSubmenuFocusability($submenu, false);
        return;
      }

      submenuNode.style.height = submenuNode.scrollHeight + "px";
      submenuNode.style.opacity = "1";
      submenuNode.offsetHeight;
      submenuNode.style.height = "0px";
      submenuNode.style.opacity = "0";

      submenuNode._submenuTransitionHandler = function (event) {
        if (event.target !== submenuNode || event.propertyName !== "height") {
          return;
        }

        clearSubmenuTransition($submenu);

        if (!$submenu.hasClass("is-open")) {
          $submenu.prop("hidden", true);
          setSubmenuFocusability($submenu, false);
        }
      };

      submenuNode.addEventListener("transitionend", submenuNode._submenuTransitionHandler);
    }

    function setMobileGroupState($group, isOpen, immediate) {
      var $submenu = $group.find(".mobile-menu-submenu");

      $group.toggleClass("is-open", isOpen);
      $group.find(".mobile-menu-toggle").attr("aria-expanded", isOpen ? "true" : "false");

      if (isOpen) {
        openSubmenu($submenu, immediate);
      } else {
        closeSubmenu($submenu, immediate);
      }
    }

    function setActiveDesktopMenu(menuKey) {
      if (!$gnbItems.length) {
        return;
      }

      $gnbItems.removeClass("is-active");
      $gnbItems.filter('[data-menu="' + menuKey + '"]').addClass("is-active");

      if ($quickMenu.length) {
        renderQuickMenu(menuKey);
      }
    }

    function renderMobileMenu() {
      if (!$mobileMenuGroups.length) {
        return;
      }

      var html = "";
      var menus = getTopLevelMenus();

      $.each(menus, function (_, menu) {
        var menuItems = getMenuItems(menu.key);
        var isOpen = menu.key === lastOpenMenuKey;

        html += '<section class="mobile-menu-group' + (isOpen ? " is-open" : "") + '" data-menu="' + escapeHtml(menu.key) + '">';
        html += '<button type="button" class="mobile-menu-toggle" aria-expanded="' + (isOpen ? "true" : "false") + '">';
        html += '<span class="mobile-menu-toggle-label">' + escapeHtml(menu.label) + "</span>";
        html += '<span class="mobile-menu-toggle-icon" aria-hidden="true"></span>';
        html += "</button>";
        html += '<div class="mobile-menu-submenu" aria-hidden="' + (isOpen ? "false" : "true") + '"' + (isOpen ? "" : " hidden") + ">";

        $.each(menuItems, function (_, item) {
          var menuItem = $.isPlainObject(item) ? item : { label: item, href: "#" };
          var href = escapeHtml(resolveSiteHref(menuItem.href || "#"));
          var pageKey = escapeHtml(menuItem.pageKey || "");
          var label = escapeHtml(menuItem.label || "");

          html += '<a href="' + href + '" class="mobile-menu-link" data-page-key="' + pageKey + '" tabindex="' + (isOpen ? "0" : "-1") + '">' + label + "</a>";
        });

        html += "</div>";
        html += "</section>";
      });

      $mobileMenuGroups.html(html);
    }

    function setOpenMobileGroup(menuKey, immediate) {
      if (!$mobileMenuGroups.length) {
        return;
      }

      lastOpenMenuKey = menuKey || defaultMenuKey;

      $mobileMenuGroups.find(".mobile-menu-group").each(function () {
        var $group = $(this);
        var isTarget = String($group.data("menu")) === lastOpenMenuKey;

        setMobileGroupState($group, isTarget, immediate);
      });

      setActiveDesktopMenu(lastOpenMenuKey);
    }

    function closeMobileGroups(immediate) {
      if (!$mobileMenuGroups.length) {
        return;
      }

      $mobileMenuGroups.find(".mobile-menu-group").each(function () {
        setMobileGroupState($(this), false, immediate);
      });
    }

    function openMobileMenu() {
      if (!isMobileViewport() || !$mobileMenuPanel.length) {
        return;
      }

      if (!$mobileMenuGroups.children().length) {
        renderMobileMenu();
      }

      setOpenMobileGroup(lastOpenMenuKey, true);
      $headerArea.addClass("is-mobile-menu-open");
      lockedScrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.setProperty("--mobile-scroll-lock-offset", (-lockedScrollTop) + "px");
      $("body").addClass("is-mobile-menu-open");
      $mobileMenuPanel.prop("hidden", false);
      $mobileMenuBackdrop.prop("hidden", false);
      $menuButton.attr({
        "aria-expanded": "true",
        "aria-label": "메뉴 닫기"
      });
    }

    function closeMobileMenu() {
      if (!$mobileMenuPanel.length) {
        return;
      }

      var wasOpen = $headerArea.hasClass("is-mobile-menu-open");

      $headerArea.removeClass("is-mobile-menu-open");
      $("body").removeClass("is-mobile-menu-open");
      document.body.style.removeProperty("--mobile-scroll-lock-offset");
      $mobileMenuPanel.prop("hidden", true);
      $mobileMenuBackdrop.prop("hidden", true);
      $menuButton.attr({
        "aria-expanded": "false",
        "aria-label": "메뉴 열기"
      });

      if (wasOpen) {
        window.scrollTo(0, lockedScrollTop);
      }
    }

    function handleBreakpointChange() {
      if (!isMobileViewport()) {
        closeMobileMenu();
      }

      syncDesktopHeaderLayout();
    }

    if ($menuButton.length) {
      $menuButton.on("click", function () {
        if (!isMobileViewport()) {
          return;
        }

        if ($headerArea.hasClass("is-mobile-menu-open")) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if ($gnbItems.length && $quickMenu.length) {
      $gnbItems.on("mouseenter focusin", function () {
        setActiveDesktopMenu(String($(this).data("menu") || defaultMenuKey));
      });

      setActiveDesktopMenu(defaultMenuKey);
    }

    if ($mobileMenuGroups.length) {
      renderMobileMenu();
      setOpenMobileGroup(defaultMenuKey, true);

      $mobileMenuGroups.on("click", ".mobile-menu-toggle", function () {
        var $group = $(this).closest(".mobile-menu-group");
        var menuKey = String($group.data("menu") || defaultMenuKey);
        var isOpen = $group.hasClass("is-open");

        if (isOpen) {
          closeMobileGroups(false);
        } else {
          setOpenMobileGroup(menuKey, false);
        }
      });

      $mobileMenuGroups.on("click", ".mobile-menu-link", function () {
        if (isMobileViewport()) {
          closeMobileMenu();
        }
      });
    }

    if ($mobileMenuBackdrop.length) {
      $mobileMenuBackdrop.on("click", closeMobileMenu);
    }

    if ($mobileHome.length) {
      $mobileHome.on("click", function () {
        closeMobileMenu();
      });
    }

    $(document).on("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    if (mobileQuery) {
      if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", handleBreakpointChange);
      } else if (typeof mobileQuery.addListener === "function") {
        mobileQuery.addListener(handleBreakpointChange);
      }
    } else {
      $(window).on("resize", handleBreakpointChange);
    }

    $(window).on("resize", syncDesktopHeaderLayout);
    syncDesktopHeaderLayout();

    if (document.readyState === "complete") {
      scheduleMobileSafeAreaRefresh();
    } else {
      $(window).on("load", scheduleMobileSafeAreaRefresh);
    }
  };
})(window);
