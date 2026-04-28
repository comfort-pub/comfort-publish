(function (window, $) {
  if (!$) {
    return;
  }

  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  var modalId = "reservationModal";
  var initialized = false;
  var closeTimer = null;
  var lastTrigger = null;
  var lastPolicyTrigger = null;

  function resolveAssetPath(fileName) {
    var pathname = window.location.pathname || "";

    if (/\/pages\//.test(pathname)) {
      return "../../assets/images/common/" + fileName;
    }

    return "./assets/images/common/" + fileName;
  }

  function buildModalHtml() {
    var logoSrc = resolveAssetPath("logo-comfort.png");
    var qLogoSrc = resolveAssetPath("q_logo.png");
    var callIconSrc = resolveAssetPath("call_icon.png");
    var closeIconSrc = resolveAssetPath("xx.png");

    return [
      '<div class="reservation-modal" id="' + modalId + '" aria-hidden="true" hidden>',
      '  <div class="reservation-modal__backdrop" data-reservation-close></div>',
      '  <div class="reservation-modal__panel" role="dialog" aria-modal="true" aria-labelledby="reservationModalTitle">',
      '    <div class="reservation-modal__dialog">',
      '      <section class="reservation-modal__sheet reservation-modal__sheet--form is-active" aria-hidden="false">',
      '        <h2 id="reservationModalTitle" class="sr-only">상담예약창</h2>',
      '        <div class="reservation-modal__inner">',
      '          <div class="reservation-modal__logo">',
      '            <img src="' + logoSrc + '" alt="COMFORT PLASTIC SURGERY" class="reservation-modal__logo-image" />',
      '          </div>',
      '          <form class="reservation-modal__form" novalidate>',
      '            <label class="sr-only" for="reservationName">이름</label>',
      '            <input id="reservationName" type="text" class="reservation-modal__field" placeholder="이름을 입력해 주세요." autocomplete="name" />',
      '            <label class="sr-only" for="reservationPhone">연락처</label>',
      '            <input id="reservationPhone" type="tel" class="reservation-modal__field" placeholder="연락처 : - 제외 숫자만 입력" inputmode="numeric" autocomplete="tel" />',
      '            <label class="sr-only" for="reservationInquiry">문의사항</label>',
      '            <input id="reservationInquiry" type="text" class="reservation-modal__field" placeholder="문의사항 (ex.문신제거, 눈성형)" autocomplete="off" />',
      '            <div class="reservation-modal__agreement">',
      '              <label class="reservation-modal__agree">',
      '                <input type="checkbox" class="reservation-modal__agree-input" />',
      '                <span>개인정보 수집 및 이용동의(필수)</span>',
      '              </label>',
      '              <button type="button" class="reservation-modal__policy" data-reservation-policy-open aria-controls="reservationModalPrivacy" aria-expanded="false">내용보기</button>',
      '            </div>',
      '            <button type="button" class="reservation-modal__submit">상담신청</button>',
      '            <a href="tel:025570775" class="reservation-modal__call">',
      '              <img src="' + callIconSrc + '" alt="" class="reservation-modal__call-icon" />',
      '              <span class="reservation-modal__call-number">02.557.0775</span>',
      '            </a>',
      '          </form>',
      '        </div>',
      '      </section>',
      '    </div>',
      '    <section id="reservationModalPrivacy" class="reservation-modal__sheet reservation-modal__sheet--policy" aria-hidden="true">',
      '        <button type="button" class="reservation-modal__policy-close" aria-label="개인정보 안내 닫기" data-reservation-policy-close>',
      '          <img src="' + closeIconSrc + '" alt="" class="reservation-modal__policy-close-icon" />',
      '        </button>',
      '        <div class="reservation-modal__policy-inner">',
      '          <img src="' + qLogoSrc + '" alt="COMFORT PLASTIC SURGERY" class="reservation-modal__policy-logo" />',
      '          <h3 class="reservation-modal__policy-title">개인정보 수집 및 이용에 대한 방침</h3>',
      '          <p class="reservation-modal__policy-copy">컴포트성형외과는 정보주체의 자유와 권리 보호를 위해<br />[개인정보 보호법] 및 관계 법령이 정한 바를 준수하여,<br />적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.</p>',
      '          <table class="reservation-modal__policy-table">',
      '            <colgroup>',
      '              <col class="reservation-modal__policy-col reservation-modal__policy-col--purpose" />',
      '              <col class="reservation-modal__policy-col reservation-modal__policy-col--item" />',
      '              <col class="reservation-modal__policy-col reservation-modal__policy-col--period" />',
      '            </colgroup>',
      '            <caption class="sr-only">개인정보 수집 및 이용 안내 표</caption>',
      '            <thead>',
      '              <tr>',
      '                <th scope="col">목적</th>',
      '                <th scope="col">항목</th>',
      '                <th scope="col">보유기간</th>',
      '              </tr>',
      '            </thead>',
      '            <tbody>',
      '              <tr>',
      '                <td>이용자 식별 및 본인여부 확인</td>',
      '                <td>이름, 휴대폰 번호</td>',
      '                <td>목적 달성시까지</td>',
      '              </tr>',
      '              <tr>',
      '                <td>고객서비스 이용에 관한 통지 및 CS대응을 위한 이용자 식별</td>',
      '                <td>이름, 휴대폰 번호</td>',
      '                <td>목적 달성시까지</td>',
      '              </tr>',
      '            </tbody>',
      '          </table>',
      '        </div>',
      '      </section>',
      '  </div>',
      '</div>'
    ].join("");
  }

  function ensureModal() {
    var $modal = $("#" + modalId);

    if ($modal.length) {
      return $modal;
    }

    $modal = $(buildModalHtml());
    $("body").append($modal);
    return $modal;
  }

  function closeQuickMenus() {
    $("body").removeClass("quick-menu-open");
    $(".floating-quick-toggle, .tattoo-floating-toggle")
      .attr("aria-expanded", "false")
      .attr("aria-label", "빠른 메뉴 열기");
    $("html, body").css("overflow", "");
  }

  function closeMobileHeaderMenu() {
    var $headerArea = $(".header-area");
    var wasOpen = $headerArea.hasClass("is-mobile-menu-open");
    var lockedOffset = parseInt(document.body.style.getPropertyValue("--mobile-scroll-lock-offset"), 10) || 0;

    if (!wasOpen) {
      return;
    }

    $headerArea.removeClass("is-mobile-menu-open");
    $("body").removeClass("is-mobile-menu-open");
    document.body.style.removeProperty("--mobile-scroll-lock-offset");
    $(".mobile-menu-panel").prop("hidden", true);
    $(".mobile-menu-backdrop").prop("hidden", true);
    $(".btn-menu").attr({
      "aria-expanded": "false",
      "aria-label": "메뉴 열기"
    });

    if (lockedOffset) {
      window.scrollTo(0, Math.abs(lockedOffset));
    }
  }

  function getReturnFocusTarget(trigger) {
    var $trigger = trigger && trigger.length ? trigger : $(trigger || []);
    var $floatingActions;
    var $floatingToggle;

    if (!$trigger.length) {
      return null;
    }

    $floatingActions = $trigger.closest(".floating-quick-actions, .tattoo-floating-actions");

    if ($floatingActions.length) {
      $floatingToggle = $floatingActions.find(".floating-quick-toggle, .tattoo-floating-toggle").first();

      if ($floatingToggle.length) {
        return $floatingToggle.get(0);
      }
    }

    return $trigger.get(0);
  }

  function focusFirstField($modal) {
    var $focusTarget = $modal.find(".reservation-modal__field").first();

    if ($focusTarget.length) {
      $focusTarget.trigger("focus");
    }
  }

  function resetReservationForm($modal) {
    var form = $modal.find(".reservation-modal__form").get(0);

    if (form && typeof form.reset === "function") {
      form.reset();
    }
  }

  function setReservationView($modal, view) {
    var isPolicyView = view === "policy";
    var $formSheet = $modal.find(".reservation-modal__sheet--form");
    var $policySheet = $modal.find(".reservation-modal__sheet--policy");
    var $policyButton = $modal.find("[data-reservation-policy-open]").first();

    $modal.toggleClass("is-policy-view", isPolicyView);

    $formSheet
      .toggleClass("is-active", !isPolicyView)
      .attr("aria-hidden", isPolicyView ? "true" : "false");

    $policySheet
      .toggleClass("is-active", isPolicyView)
      .attr("aria-hidden", isPolicyView ? "false" : "true");

    if ($policyButton.length) {
      $policyButton.attr("aria-expanded", isPolicyView ? "true" : "false");
    }
  }

  function focusPolicyClose($modal) {
    var $focusTarget = $modal.find("[data-reservation-policy-close]").first();

    if ($focusTarget.length) {
      $focusTarget.trigger("focus");
    }
  }

  function focusPolicyOpen($modal) {
    var $focusTarget = $modal.find("[data-reservation-policy-open]").first();

    if ($focusTarget.length) {
      $focusTarget.trigger("focus");
      return;
    }

    focusFirstField($modal);
  }

  function openModal(trigger) {
    var $modal = ensureModal();

    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }

    lastTrigger = getReturnFocusTarget(trigger);
    lastPolicyTrigger = null;
    closeQuickMenus();
    closeMobileHeaderMenu();
    resetReservationForm($modal);
    setReservationView($modal, "form");
    $modal.prop("hidden", false).attr("aria-hidden", "false");
    $("body").addClass("reservation-modal-open");

    window.requestAnimationFrame(function () {
      $modal.addClass("is-open");

      window.requestAnimationFrame(function () {
        focusFirstField($modal);
      });
    });
  }

  function openPolicy(trigger) {
    var $modal = ensureModal();

    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }

    lastPolicyTrigger = trigger && trigger.length ? trigger.get(0) : trigger || null;

    if ($modal.prop("hidden")) {
      $modal.prop("hidden", false).attr("aria-hidden", "false");
      $("body").addClass("reservation-modal-open");
      $modal.addClass("is-open");
    }

    setReservationView($modal, "policy");

    window.requestAnimationFrame(function () {
      focusPolicyClose($modal);
    });
  }

  function closePolicy() {
    var $modal = ensureModal();

    if (!$modal.hasClass("is-policy-view")) {
      return;
    }

    setReservationView($modal, "form");

    window.requestAnimationFrame(function () {
      if (lastPolicyTrigger && typeof lastPolicyTrigger.focus === "function") {
        lastPolicyTrigger.focus();
      } else {
        focusPolicyOpen($modal);
      }
    });

    lastPolicyTrigger = null;
  }

  function closeModal() {
    var $modal = ensureModal();

    if (!$modal.hasClass("is-open")) {
      return;
    }

    setReservationView($modal, "form");
    $modal.removeClass("is-open").attr("aria-hidden", "true");
    $("body").removeClass("reservation-modal-open");
    $("html, body").css("overflow", "");
    lastPolicyTrigger = null;

    closeTimer = window.setTimeout(function () {
      $modal.prop("hidden", true);
      closeTimer = null;

      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus();
      }
    }, 260);
  }

  function bindEvents() {
    $(document).on("click", ".floating-quick-action--calendar, .tattoo-floating-action--calendar", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openModal(this);
    });

    $(document).on("click", 'a[data-page-key="comfort-reservation"]', function (event) {
      event.preventDefault();
      event.stopPropagation();
      openModal(this);
    });

    $(document).on("click", "[" + "data-reservation-policy-open" + "]", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openPolicy(this);
    });

    $(document).on("click", "[" + "data-reservation-policy-close" + "]", function (event) {
      event.preventDefault();
      event.stopPropagation();
      closePolicy();
    });

    $(document).on("click", "[" + "data-reservation-close" + "]", function () {
      closeModal();
    });

    $(document).on("keydown", function (event) {
      if (event.key === "Escape") {
        if ($(".reservation-modal.is-open").hasClass("is-policy-view")) {
          closePolicy();
          return;
        }

        closeModal();
      }
    });

    $(document).on("click", ".reservation-modal__dialog", function (event) {
      event.stopPropagation();
    });

    $(document).on("click", ".reservation-modal", function (event) {
      if ($(event.target).is(".reservation-modal__backdrop")) {
        closeModal();
      }
    });
  }

  function initReservationModal() {
    if (initialized) {
      return;
    }

    initialized = true;
    ensureModal();
    bindEvents();
  }

  site.modules.initReservationModal = initReservationModal;

  $(initReservationModal);
})(window, window.jQuery);
