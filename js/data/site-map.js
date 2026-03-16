window.ComfortSite = window.ComfortSite || {};

window.ComfortSite.siteMap = {
  groups: [
    {
      key: "main",
      label: "메인",
      items: [
        { key: "main-hero", label: "메인이미지", plannedPath: "index.html#mv" },
        { key: "main-navigation", label: "사이트맵 / GNB", plannedPath: "index.html#wrap" },
        { key: "main-brand-intro", label: "브랜드 인트로", plannedPath: "index.html#mv" }
      ]
    },
    {
      key: "comfort-intro",
      label: "컴포트 소개",
      items: [
        { key: "comfort-special", label: "컴포트의 특별함", plannedPath: "pages/comfort-intro/special.html" },
        { key: "comfort-doctors", label: "전문 의료진", plannedPath: "pages/comfort-intro/doctors.html" },
        { key: "comfort-equipment", label: "첨단 의료장비", plannedPath: "pages/comfort-intro/equipment.html" },
        { key: "comfort-route", label: "오시는 길", plannedPath: "pages/comfort-intro/route.html" },
        { key: "comfort-reservation", label: "실시간예약확인", plannedPath: "pages/comfort-intro/reservation.html" }
      ]
    },
    {
      key: "tattoo-removal",
      label: "문신제거",
      items: [
        { key: "tattoo-overview", label: "컴포트 문신제거", plannedPath: "pages/tattoo-removal/overview.html" },
        { key: "tattoo-pico", label: "피코레이저(+프락셀)", plannedPath: "pages/tattoo-removal/pico-laser.html" },
        { key: "tattoo-surgery", label: "수술적 문신제거", plannedPath: "pages/tattoo-removal/surgery.html" },
        { key: "tattoo-principle", label: "문신제거 원리", plannedPath: "pages/tattoo-removal/principle.html" },
        { key: "tattoo-pain", label: "문신제거와 통증", plannedPath: "pages/tattoo-removal/pain.html" }
      ]
    },
    {
      key: "comfort-anesthesia",
      label: "컴포트 마취",
      items: [
        { key: "anesthesia-special", label: "컴포트 마취의 특별함", plannedPath: "pages/comfort-anesthesia/special.html" }
      ]
    },
    {
      key: "injection",
      label: "주사시술",
      items: [
        { key: "injection-rejuran", label: "리쥬란힐러", plannedPath: "pages/injection/rejuran-healer.html" },
        { key: "injection-skin-botox", label: "스킨보톡스", plannedPath: "pages/injection/skin-botox.html" }
      ]
    }
  ],
  navigationMenus: {
    intro: [
      { label: "컴포트의 특별함", href: "#", pageKey: "comfort-special" },
      { label: "전문 의료진", href: "#", pageKey: "comfort-doctors" },
      { label: "첨단 의료장비", href: "#", pageKey: "comfort-equipment" },
      { label: "오시는 길", href: "#", pageKey: "comfort-route" },
      { label: "실시간예약확인", href: "#", pageKey: "comfort-reservation" }
    ],
    tattoo: [
      { label: "컴포트 문신제거", href: "#", pageKey: "tattoo-overview" },
      { label: "피코레이저 (+프락셀)", href: "#", pageKey: "tattoo-pico" },
      { label: "수술적 문신제거", href: "#", pageKey: "tattoo-surgery" },
      { label: "문신제거 원리", href: "#", pageKey: "tattoo-principle" },
      { label: "문신제거와 통증", href: "#", pageKey: "tattoo-pain" }
    ],
    anesthesia: [
      { label: "컴포트 마취의 특별함", href: "#", pageKey: "anesthesia-special" }
    ],
    injection: [
      { label: "리쥬란 힐러", href: "#", pageKey: "injection-rejuran" },
      { label: "스킨보톡스", href: "#", pageKey: "injection-skin-botox" }
    ]
  }
};
