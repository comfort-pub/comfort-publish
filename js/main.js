$(function () {
  var $menuButton = $(".btn-menu");
  var $gnb = $(".gnb");
  var $gnbItems = $(".gnb-item");
  var $hoverQuickMenu = $("#hoverQuickMenu");
  var $sec2Tabs = $("#sec2Tabs");
  var $sec2Image = $("#sec2 .dul-2371");
  var $sec2MainTitle = $("#sec2MainTitle");
  var $sec2ServiceTitle = $("#sec2ServiceTitle");
  var $sec2ServiceDesc = $("#sec2ServiceDesc");
  var $sec7Track = $("#sec7Track");
  var $sec7Cards = $sec7Track.find(".sec7-result-card");
  var $sec7Prev = $("#sec7Prev");
  var $sec7Next = $("#sec7Next");
  var sec7CarouselIndex = 0;
  var sec2TabData = {
    pico: {
      image: "./assets/images/main/sec2-dul-2371.png",
      mainTitle: "통증은 줄이고 효과는 높인 문신제거",
      serviceTitle: "피코 문신제거",
      serviceDesc: "피코레이저로 문신에 맞춰 효과적이고 세밀한 시술이 가능합니다."
    },
    semi: {
      image: "./assets/images/main/sec2-dul-2371.png",
      mainTitle: "잔흔은 줄이고 자연스러움은 높인 문신제거",
      serviceTitle: "반영구 문신제거",
      serviceDesc: "예민한 부위인 만큼 섬세한 조사로 부작용을 줄이며 효과를 높입니다."
    },
    scalp: {
      image: "./assets/images/main/sec2-dul-2371.png",
      mainTitle: "두피 상태에 맞춰 안전하게 진행하는 문신제거",
      serviceTitle: "두피 문신제거",
      serviceDesc: "잘못되었거나 번진 두피 문신도 두피와 머리카락의 손상을 최소화하여 시술합니다."
    },
    surgical: {
      image: "./assets/images/main/sec2-dul-2371.png",
      mainTitle: "부위 특성에 맞춘 수술적 문신제거",
      serviceTitle: "수술적 문신제거",
      serviceDesc: "면접이나 결혼 등으로 빠른 시일 내 제거를 해야 하는 분들께 추천드립니다."
    }
  };
  var quickMenuData = {
    intro: [
      "컴포트의 특별함",
      "전문 의료진",
      "첨단 의료장비",
      "오시는 길",
      "실시간 예약확인"
    ],
    tattoo: [
      "컴포트 문신제거",
      "피코레이저 (+프락셀)",
      "수술적 문신제거",
      "문신제거 원리",
      "문신제거와 통증"
    ],
    anesthesia: [
      "컴포트 마취의 특별함"
    ],
    injection: [
      "리쥬란 힐러",
      "스킨보톡스"
    ]
  };

  function renderQuickMenu(menuKey) {
    var menuItems = quickMenuData[menuKey] || [];
    var html = "";

    $.each(menuItems, function (index, label) {
      html += '<a href="#" class="rectangle-40">' + label + "</a>";
    });

    $hoverQuickMenu.html(html);
  }

  function renderSec2Tab(tabKey) {
    var tabData = sec2TabData[tabKey];

    if (!tabData) {
      return;
    }

    $sec2MainTitle.text(tabData.mainTitle);
    $sec2ServiceTitle.text(tabData.serviceTitle);
    $sec2ServiceDesc.text(tabData.serviceDesc);
    $sec2Image.css("background-image", 'url("' + tabData.image + '")');

    $sec2Tabs.find("li").removeClass("is-active");
    $sec2Tabs.find('button[data-tab="' + tabKey + '"]').closest("li").addClass("is-active");
  }

  function getSec7PerView() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      return 1;
    }

    return 2;
  }

  function renderSec7Carousel() {
    var perView;
    var maxIndex;
    var cardWidth;

    if (!$sec7Track.length || !$sec7Cards.length) {
      return;
    }

    perView = getSec7PerView();
    maxIndex = Math.max($sec7Cards.length - perView, 0);
    sec7CarouselIndex = Math.min(sec7CarouselIndex, maxIndex);
    cardWidth = $sec7Cards.first().outerWidth(true);

    $sec7Track.css("transform", "translateX(" + -(sec7CarouselIndex * cardWidth) + "px)");
    $sec7Prev.prop("disabled", maxIndex === 0);
    $sec7Next.prop("disabled", maxIndex === 0);
  }

  $menuButton.on("click", function () {
    $gnb.toggleClass("is-open");
  });

  $gnbItems.on("mouseenter focusin", function () {
    var $currentItem = $(this);
    var menuKey = $currentItem.data("menu");

    $gnbItems.removeClass("is-active");
    $currentItem.addClass("is-active");
    renderQuickMenu(menuKey);
  });

  renderQuickMenu("intro");

  $sec2Tabs.on("click", "button", function () {
    var tabKey = $(this).data("tab");
    renderSec2Tab(tabKey);
  });

  $sec7Prev.on("click", function () {
    var maxIndex = Math.max($sec7Cards.length - getSec7PerView(), 0);

    if (!maxIndex) {
      return;
    }

    if (sec7CarouselIndex === 0) {
      sec7CarouselIndex = maxIndex;
    } else {
      sec7CarouselIndex -= 1;
    }

    renderSec7Carousel();
  });

  $sec7Next.on("click", function () {
    var maxIndex = Math.max($sec7Cards.length - getSec7PerView(), 0);

    if (!maxIndex) {
      return;
    }

    if (sec7CarouselIndex >= maxIndex) {
      sec7CarouselIndex = 0;
    } else {
      sec7CarouselIndex += 1;
    }

    renderSec7Carousel();
  });

  $(window).on("resize", renderSec7Carousel);

  renderSec2Tab("pico");
  renderSec7Carousel();
});
