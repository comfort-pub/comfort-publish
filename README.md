# comfort-publish

컴포트성형외과 퍼블리싱 프로젝트입니다.  
현재 구현 범위는 메인 페이지(`index.html`)이며, 이후 상세 페이지가 붙을 수 있도록 구조를 멀티페이지 기준으로 분리해두었습니다.

## 실행 방법

프로젝트 루트에서 정적 서버를 실행합니다.

```bash
python3 -m http.server 8000
```

브라우저에서 아래 주소로 확인합니다.

```text
http://localhost:8000
```

## 현재 범위

- 현재 구현 완료: 메인 페이지
- 현재 엔트리 파일: `index.html`
- 향후 상세 페이지 위치: `pages/*`
- 공통 네비게이션/페이지 맵 데이터: `js/data/site-map.js`

## 디렉터리 구조

```text
.
├── index.html
├── css
│   ├── style.css
│   ├── common
│   │   └── base.css
│   └── pages
│       └── main
│           ├── index.css
│           ├── responsive.css
│           └── sections
│               ├── hero.css
│               ├── tattoo-overview.css
│               ├── feature-highlights.css
│               ├── doctor-profile.css
│               ├── laser-showcase.css
│               ├── aftercare.css
│               └── contact.css
├── js
│   ├── main.js
│   ├── common
│   │   └── header-menu.js
│   ├── data
│   │   ├── site-map.js
│   │   └── pages
│   │       └── main.js
│   └── pages
│       └── main
│           ├── sec2-tabs.js
│           ├── sec3-cards.js
│           └── sec7-results.js
├── pages
│   ├── README.md
│   ├── comfort-intro
│   ├── tattoo-removal
│   ├── comfort-anesthesia
│   └── injection
└── assets
    └── images
```

## 구조 원칙

- `css/common/*`: 사이트 공통 스타일
- `css/pages/<page>/*`: 페이지 단위 스타일
- `css/pages/<page>/sections/*`: 섹션 단위 스타일
- `js/common/*`: 공통 UI 동작
- `js/data/*`: 페이지 맵, 메뉴, 탭/결과 데이터 같은 콘텐츠성 데이터
- `js/pages/<page>/*`: 페이지 전용 인터랙션
- `pages/<group>/*`: 이후 추가될 상세 페이지 HTML 위치

## 페이지 맵 기준

향후 확장 대상은 아래 5개 묶음입니다.

- `메인`
- `컴포트 소개`
- `문신제거`
- `컴포트 마취`
- `주사시술`

## 상세 모바일 규칙

- `pages/tattoo-removal/overview.html` 모바일 기준은 현재 `css/pages/tattoo-overview/responsive.css`에서 관리합니다.
- 첫 번째 hero 섹션은 모바일에서 시안 고정 높이가 아니라 viewport 높이를 기본값으로 사용합니다.
- 구현 기준은 `100svh` 우선, `100vh` fallback 입니다.
- 공통 모바일 헤더는 높이 `60px` 고정, 로고와 메뉴 아이콘은 양끝 정렬로 두고 `210px` 이하 화면에서만 크기를 줄입니다.
- `overview`의 나머지 모바일 값은 현재 `800px` 시안 비율 축소 방식을 유지합니다.
- `pages/tattoo-removal/overview.html`의 header / `sec7 오시는 길` / footer summary 마크업을 현재 공통 기준으로 사용합니다.
- `sec7 오시는 길`과 footer는 모바일에서도 `overview`의 `800px` 시안 비율 축소 값을 공통 기준으로 사용합니다.
- 의도한 줄바꿈이 필요한 카피는 자연 줄바꿈 대신 마크업의 `<br />` 기준을 우선합니다.

상세 분류는 [`pages/README.md`](/Users/kang-gwanghun/IdeaProjects/comfort-publish/pages/README.md)와 [`js/data/site-map.js`](/Users/kang-gwanghun/IdeaProjects/comfort-publish/js/data/site-map.js)에 함께 정리합니다.

## 메인 페이지 데이터 분리

현재 메인 페이지의 콘텐츠성 데이터는 아래로 분리했습니다.

- 탭 콘텐츠 / 결과 fallback: `js/data/pages/main.js`
- 전체 페이지군 / 메뉴 구조: `js/data/site-map.js`

현재 메인 페이지의 기능 로직은 아래로 분리했습니다.

- 헤더 드롭다운 메뉴: `js/common/header-menu.js`
- `sec2` 탭 인터랙션: `js/pages/main/sec2-tabs.js`
- `sec3` 카드 활성 상태: `js/pages/main/sec3-cards.js`
- `sec7` 결과 캐러셀: `js/pages/main/sec7-results.js`

## sec7 결과 영역 백엔드 연동

`sec7` 결과 캐러셀은 API 연동 가능한 형태로 유지했습니다.

```html
<div class="sec7-results-carousel" id="sec7Carousel" data-api-url="">
  <div class="sec7-results-track" id="sec7Track"></div>
</div>
```

예시:

```html
<div class="sec7-results-carousel" id="sec7Carousel" data-api-url="/api/results">
```

지원 응답 형태:

- 배열 직접 반환
- 또는 `items`, `results`, `data` 내부 배열

API가 비어 있거나 실패하면 `js/data/pages/main.js`의 fallback 데이터를 사용합니다.
