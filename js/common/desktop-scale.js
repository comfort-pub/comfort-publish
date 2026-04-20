(function () {
  var MOBILE_BREAKPOINT = 800;
  var DESKTOP_FULL_WIDTH = 1920;
  var DESKTOP_MIN_WIDTH = 1440;
  var DESKTOP_MIN_SCALE = DESKTOP_MIN_WIDTH / DESKTOP_FULL_WIDTH;

  function getDesktopScale(viewportWidth) {
    if (viewportWidth <= MOBILE_BREAKPOINT) {
      return 1;
    }

    if (viewportWidth >= DESKTOP_FULL_WIDTH) {
      return 1;
    }

    if (viewportWidth <= DESKTOP_MIN_WIDTH) {
      return DESKTOP_MIN_SCALE;
    }

    return viewportWidth / DESKTOP_FULL_WIDTH;
  }

  function applyDesktopScale() {
    if (!document.body) {
      return;
    }

    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || DESKTOP_FULL_WIDTH;
    var scale = getDesktopScale(viewportWidth);
    var scaleValue = String(scale);

    document.documentElement.style.setProperty("--desktop-page-scale", scaleValue);
    document.body.style.zoom = scaleValue;
  }

  window.addEventListener("resize", applyDesktopScale);
  window.addEventListener("pageshow", applyDesktopScale);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyDesktopScale);
  } else {
    applyDesktopScale();
  }
})();
