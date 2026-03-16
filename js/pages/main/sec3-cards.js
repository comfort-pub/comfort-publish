(function (window) {
  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  site.modules.initMainSec3Cards = function initMainSec3Cards(options) {
    var $cards = options.cards;

    function setActiveCard($card) {
      if (!$card.length) {
        return;
      }

      $cards.removeClass("is-active");
      $card.addClass("is-active");
    }

    if (!$cards.length) {
      return;
    }

    $cards.on("click focusin", function () {
      setActiveCard($(this));
    });
  };
})(window);
