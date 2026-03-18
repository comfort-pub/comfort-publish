(function (window) {
  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  site.modules.initTattooOverview = function initTattooOverview(options) {
    var $faqItems = options.faqItems || $();
    var $scrollTopButton = options.scrollTopButton || $();

    function setFaqItemState($item, isOpen) {
      var $trigger = $item.find(".tattoo-faq-trigger");
      var $panel = $item.find(".tattoo-faq-panel");

      $item.toggleClass("is-open", isOpen);
      $trigger.attr("aria-expanded", isOpen ? "true" : "false");
      $panel.prop("hidden", !isOpen);
    }

    if ($faqItems.length) {
      $faqItems.each(function (index) {
        var $item = $(this);
        var isOpen = $item.hasClass("is-open") || index === 0;
        setFaqItemState($item, isOpen);
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
  };
})(window);
