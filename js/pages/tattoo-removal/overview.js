(function (window) {
  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  site.modules.initTattooOverview = function initTattooOverview(options) {
    var $faqItems = options.faqItems || $();
    var $scrollTopButton = options.scrollTopButton || $();
    var $resultCarousel = options.resultCarousel || $();
    var $resultDots = options.resultDots || $();
    var $aftercareCards = options.aftercareCards || $();
    var resultTimerId = null;
    var currentResultIndex = 0;
    var resultScrollSyncTimerId = null;
    var differenceMarqueeResizeTimerId = null;

    function getResultCardOffsetLeft(card) {
      return card ? card.offsetLeft : 0;
    }

    function syncResultCardWidths($carousel, $cards) {
      var carousel = $carousel.get(0);
      var carouselWidth;

      if (!carousel || !$cards.length) {
        return;
      }

      carouselWidth = carousel.clientWidth;

      if (!carouselWidth) {
        return;
      }

      carousel.style.setProperty("--tattoo-result-card-width", carouselWidth + "px");
    }

    function setActiveResultDot(index) {
      $resultDots.removeClass("is-active");
      $resultDots.eq(index).addClass("is-active");
    }

    function scrollResultTo($carousel, $cards, index, behavior) {
      var card = $cards.get(index);
      var targetLeft;

      if (!card) {
        return;
      }

      targetLeft = getResultCardOffsetLeft(card);

      $carousel.get(0).scrollTo({
        left: targetLeft,
        behavior: behavior || "smooth"
      });
      currentResultIndex = index;
      setActiveResultDot(index);
    }

    function syncResultIndexFromScroll($carousel, $cards) {
      var scrollLeft = $carousel.scrollLeft();
      var nearestIndex = 0;
      var smallestDistance = Infinity;

      $cards.each(function (index) {
        var distance = Math.abs(scrollLeft - getResultCardOffsetLeft(this));

        if (distance < smallestDistance) {
          smallestDistance = distance;
          nearestIndex = index;
        }
      });

      nearestIndex = Math.max(0, Math.min(nearestIndex, $cards.length - 1));

      currentResultIndex = nearestIndex;
      setActiveResultDot(nearestIndex);
    }

    function startResultAutoplay($carousel, $cards) {
      if (!$carousel.length || $cards.length < 2) {
        return;
      }

      if (resultTimerId) {
        window.clearInterval(resultTimerId);
      }

      resultTimerId = window.setInterval(function () {
        var nextIndex = (currentResultIndex + 1) % $cards.length;

        scrollResultTo($carousel, $cards, nextIndex, "smooth");
      }, 2000);
    }

    function setFaqItemState($item, isOpen, skipAnimation) {
      var $trigger = $item.find(".tattoo-faq-trigger");
      var $panel = $item.find(".tattoo-faq-panel");
      var panel = $panel.get(0);

      $item.toggleClass("is-open", isOpen);
      $trigger.attr("aria-expanded", isOpen ? "true" : "false");

      if (!panel) {
        return;
      }

      panel.removeEventListener("transitionend", panel._faqTransitionEndHandler);

      if (skipAnimation) {
        $panel.prop("hidden", !isOpen);
        if (isOpen) {
          panel.style.removeProperty("padding-top");
          panel.style.removeProperty("padding-bottom");
        } else {
          panel.style.paddingTop = "0px";
          panel.style.paddingBottom = "0px";
        }
        panel.style.height = isOpen ? "auto" : "0px";
        panel.style.opacity = isOpen ? "1" : "0";
        return;
      }

      if (isOpen) {
        $panel.prop("hidden", false);
        panel.style.removeProperty("padding-top");
        panel.style.removeProperty("padding-bottom");
        panel.style.height = "0px";
        panel.style.opacity = "0";
        panel.offsetHeight;
        panel.style.height = panel.scrollHeight + "px";
        panel.style.opacity = "1";
        panel._faqTransitionEndHandler = function (event) {
          if (event.propertyName !== "height") {
            return;
          }
          panel.style.height = "auto";
        };
        panel.addEventListener("transitionend", panel._faqTransitionEndHandler, { once: true });
      } else {
        panel.style.height = panel.scrollHeight + "px";
        panel.style.opacity = "1";
        panel.offsetHeight;
        panel.style.height = "0px";
        panel.style.opacity = "0";
        panel.style.paddingTop = "0px";
        panel.style.paddingBottom = "0px";
        panel._faqTransitionEndHandler = function (event) {
          if (event.propertyName !== "height") {
            return;
          }
          panel.style.height = "0px";
          panel.style.opacity = "0";
          $panel.prop("hidden", true);
        };
        panel.addEventListener("transitionend", panel._faqTransitionEndHandler, { once: true });
      }
    }

    function initDifferenceMarquee() {
      var $marquee = $(".tattoo-difference-marquee");
      var $track = $marquee.find(".tattoo-difference-marquee-track");
      var $source = $track.find(".tattoo-difference-marquee-text").first();
      var sourceText;

      if (!$marquee.length || !$track.length || !$source.length) {
        return;
      }

      sourceText = $.trim($source.text());

      function renderDifferenceMarquee() {
        var marqueeWidth = ($marquee.get(0) && $marquee.get(0).clientWidth) || window.innerWidth || 0;
        var textNode = $track.find(".tattoo-difference-marquee-text").first().get(0);
        var textWidth = textNode ? textNode.getBoundingClientRect().width || textNode.scrollWidth || 1 : 1;
        var repeatCount = Math.max(2, Math.ceil((marqueeWidth * 1.25) / Math.max(textWidth, 1)));
        var items = [];
        var i;

        for (i = 0; i < repeatCount; i += 1) {
          items.push('<span class="tattoo-difference-marquee-text">' + sourceText + "</span>");
        }

        $track.html(items.join("") + items.join(""));
        $track.get(0).style.setProperty("--tattoo-marquee-duration", (repeatCount * 18) + "s");
      }

      renderDifferenceMarquee();

      $(window).on("resize", function () {
        if (differenceMarqueeResizeTimerId) {
          window.clearTimeout(differenceMarqueeResizeTimerId);
        }

        differenceMarqueeResizeTimerId = window.setTimeout(renderDifferenceMarquee, 120);
      });
    }

    if ($faqItems.length) {
      $faqItems.each(function (index) {
        var $item = $(this);
        var isOpen = $item.hasClass("is-open");
        setFaqItemState($item, isOpen, true);
      });

      $faqItems.on("click", ".tattoo-faq-trigger", function () {
        var $currentItem = $(this).closest(".tattoo-faq-item");
        var willOpen = !$currentItem.hasClass("is-open");

        $faqItems.each(function () {
          setFaqItemState($(this), false);
        });

        if (willOpen) {
          setFaqItemState($currentItem, true);
        }
      });
    }

    if ($scrollTopButton.length) {
      $scrollTopButton.on("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }

    initDifferenceMarquee();

    if ($aftercareCards.length) {
      var $aftercareGrid = $(".tattoo-aftercare-grid");
      var $aftercareDefaultCard = $aftercareCards.filter(".is-active").first();

      if (!$aftercareDefaultCard.length) {
        $aftercareDefaultCard = $aftercareCards.first();
      }

      function setAftercareActive($card) {
        if (!$card || !$card.length) {
          return;
        }

        $aftercareCards.removeClass("is-active");
        $card.addClass("is-active");
      }

      $aftercareCards.on("mouseenter focusin", function () {
        setAftercareActive($(this));
      });

      $aftercareGrid.on("mouseleave focusout", function () {
        window.setTimeout(function () {
          if ($aftercareGrid.find(":focus").length) {
            return;
          }

          setAftercareActive($aftercareDefaultCard);
        }, 0);
      });
    }

    if ($resultCarousel.length) {
      var $resultCards = $resultCarousel.find(".tattoo-result-card");

      syncResultCardWidths($resultCarousel, $resultCards);

      scrollResultTo($resultCarousel, $resultCards, 0, "auto");
      setActiveResultDot(0);
      startResultAutoplay($resultCarousel, $resultCards);

      $(window).on("resize", function () {
        syncResultCardWidths($resultCarousel, $resultCards);
        scrollResultTo($resultCarousel, $resultCards, currentResultIndex, "auto");
      });

      $resultDots.on("click", function () {
        var index = Number($(this).data("resultDot"));

        scrollResultTo($resultCarousel, $resultCards, index, "smooth");
        startResultAutoplay($resultCarousel, $resultCards);
      });

      $resultCarousel.on("scroll", function () {
        if (resultScrollSyncTimerId) {
          window.clearTimeout(resultScrollSyncTimerId);
        }

        resultScrollSyncTimerId = window.setTimeout(function () {
          syncResultIndexFromScroll($resultCarousel, $resultCards);
        }, 120);
      });

      $resultCarousel.on("pointerdown wheel touchstart", function () {
        if (resultTimerId) {
          window.clearInterval(resultTimerId);
          resultTimerId = null;
        }
      });

      $resultCarousel.on("pointerup touchend mouseleave", function () {
        startResultAutoplay($resultCarousel, $resultCards);
      });
    }
  };
})(window);
