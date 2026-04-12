(function (window) {
  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  site.modules.initMainSec7Results = function initMainSec7Results(options) {
    var $carousel = options.carousel;
    var $track = options.track;
    var $prev = options.prevButton;
    var $next = options.nextButton;
    var fallbackResults = options.fallbackResults || [];
    var $cards = $();
    var carouselIndex = 0;

    function escapeHtml(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function readImageField(item, key) {
      if (item[key]) {
        return item[key];
      }

      if (item[key === "beforeImageUrl" ? "beforeImage" : "afterImage"]) {
        return item[key === "beforeImageUrl" ? "beforeImage" : "afterImage"];
      }

      if (key === "beforeImageUrl" && item.before && item.before.imageUrl) {
        return item.before.imageUrl;
      }

      if (key === "afterImageUrl" && item.after && item.after.imageUrl) {
        return item.after.imageUrl;
      }

      return "";
    }

    function readPositionField(item, key, fallback) {
      if (item[key]) {
        return item[key];
      }

      if (key === "beforePosition" && item.before && item.before.position) {
        return item.before.position;
      }

      if (key === "afterPosition" && item.after && item.after.position) {
        return item.after.position;
      }

      return fallback;
    }

    function normalizeResults(payload) {
      var items = payload;

      if ($.isPlainObject(payload)) {
        items = payload.items || payload.results || payload.data || [];
      }

      if (!$.isArray(items)) {
        return [];
      }

      return $.map(items, function (item) {
        return {
          round: item.round || item.roundLabel || item.title || "",
          caption: item.caption || item.elapsedText || item.description || "",
          beforeImageUrl: readImageField(item, "beforeImageUrl"),
          beforePosition: readPositionField(item, "beforePosition", "center"),
          afterImageUrl: readImageField(item, "afterImageUrl"),
          afterPosition: readPositionField(item, "afterPosition", "center")
        };
      });
    }

    function getPerView() {
      if (window.matchMedia("(max-width: 800px)").matches) {
        return 1;
      }

      return 2;
    }

    function renderCarousel() {
      var perView;
      var maxIndex;
      var cardWidth;
      var translateX;
      var carouselWidth;
      var maxScrollLeft;
      var targetScrollLeft;
      var $targetCard;
      var targetLeft;
      var isMobile;

      if (!$track.length) {
        return;
      }

      if (!$cards.length) {
        $track.css("transform", "translateX(0)");
        $prev.prop("disabled", true);
        $next.prop("disabled", true);
        return;
      }

      perView = getPerView();
      maxIndex = Math.max($cards.length - perView, 0);
      carouselIndex = Math.min(carouselIndex, maxIndex);
      isMobile = window.matchMedia("(max-width: 800px)").matches;
      cardWidth = $cards.first().outerWidth(true);
      translateX = -(carouselIndex * cardWidth);

      if (isMobile) {
        $targetCard = $cards.eq(carouselIndex);
        carouselWidth = $carousel.innerWidth();
        maxScrollLeft = $carousel[0].scrollWidth - $carousel.innerWidth();

        $track.css("transform", "translateX(0)");

        if ($targetCard.length && carouselWidth) {
          targetLeft = $targetCard[0].offsetLeft;
          targetScrollLeft = targetLeft - ((carouselWidth - $targetCard.outerWidth()) / 2);
          targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, Math.max(maxScrollLeft, 0)));
          $carousel[0].scrollTo({
            left: targetScrollLeft,
            behavior: "smooth"
          });
        }
      } else {
        $carousel.scrollLeft(0);
        $track.css("transform", "translateX(" + translateX + "px)");
      }

      $prev.prop("disabled", maxIndex === 0);
      $next.prop("disabled", maxIndex === 0);
    }

    function renderResults(results) {
      var html = "";

      $.each(results, function (_, item) {
        var round = escapeHtml(item.round);
        var caption = escapeHtml(item.caption);
        var beforeImageUrl = escapeHtml(item.beforeImageUrl);
        var beforePosition = escapeHtml(item.beforePosition || "center");
        var afterImageUrl = escapeHtml(item.afterImageUrl);
        var afterPosition = escapeHtml(item.afterPosition || "center");
        var beforeStyle = beforeImageUrl ? ' style="background-image:url(\'' + beforeImageUrl + '\'); background-position:' + beforePosition + ';"' : "";
        var afterStyle = afterImageUrl ? ' style="background-image:url(\'' + afterImageUrl + '\'); background-position:' + afterPosition + ';"' : "";

        html += '<article class="sec7-result-card">';
        html += '<strong class="sec7-result-round">' + round + "</strong>";
        html += '<div class="sec7-result-images">';
        html += '<div class="sec7-result-photo sec7-result-photo--before"' + beforeStyle + ">";
        html += '<span class="sec7-result-badge">BEFORE</span>';
        html += "</div>";
        html += '<div class="sec7-result-photo sec7-result-photo--after"' + afterStyle + ">";
        html += '<span class="sec7-result-badge">AFTER</span>';
        html += "</div>";
        html += "</div>";
        html += '<p class="sec7-result-caption">' + caption + "</p>";
        html += "</article>";
      });

      if (!html) {
        html = '<article class="sec7-result-card sec7-result-card--empty"><p class="sec7-result-empty">등록된 시술 결과가 없습니다.</p></article>';
      }

      $track.html(html);
      $cards = $track.find(".sec7-result-card").not(".sec7-result-card--empty");
      carouselIndex = 0;
      renderCarousel();
    }

    function loadResults() {
      var apiUrl = $.trim(String($carousel.data("apiUrl") || ""));

      if (!apiUrl) {
        renderResults(fallbackResults);
        return;
      }

      $.getJSON(apiUrl)
        .done(function (payload) {
          var results = normalizeResults(payload);

          if (!results.length) {
            renderResults(fallbackResults);
            return;
          }

          renderResults(results);
        })
        .fail(function () {
          renderResults(fallbackResults);
        });
    }

    if (!$carousel.length || !$track.length) {
      return;
    }

    $prev.on("click", function () {
      var maxIndex = Math.max($cards.length - getPerView(), 0);

      if (!maxIndex) {
        return;
      }

      if (carouselIndex === 0) {
        carouselIndex = maxIndex;
      } else {
        carouselIndex -= 1;
      }

      renderCarousel();
    });

    $next.on("click", function () {
      var maxIndex = Math.max($cards.length - getPerView(), 0);

      if (!maxIndex) {
        return;
      }

      if (carouselIndex >= maxIndex) {
        carouselIndex = 0;
      } else {
        carouselIndex += 1;
      }

      renderCarousel();
    });

    $(window).on("resize", renderCarousel);

    loadResults();
  };
})(window);
