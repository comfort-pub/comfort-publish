# Future Page Routes

`index.html`은 현재 메인 페이지 전용 엔트리입니다.  
추가 페이지는 아래 디렉터리 기준으로 확장합니다.

## Planned Groups

- `comfort-intro/`: 컴포트 소개
- `tattoo-removal/`: 문신제거
- `comfort-anesthesia/`: 컴포트 마취
- `injection/`: 주사시술

## Page Map

- `메인`
  - `0-1)` 메인이미지
  - `0-2)` 사이트맵 / GNB
  - `0-3)` 브랜드 인트로
- `컴포트 소개`
  - `1-1)` 컴포트의 특별함
  - `1-2)` 전문 의료진
  - `1-3)` 첨단 의료장비
  - `1-4)` 오시는 길
  - `1-5)` 실시간예약확인
- `문신제거`
  - `2-1)` 컴포트 문신제거
  - `2-2)` 피코레이저
  - `2-3)` 수술적 문신제거
  - `2-4)` 문신제거 원리
- `컴포트 마취`
  - `3-1)` 컴포트 마취의 특별함
- `주사시술`
  - `4-1)` 리쥬란힐러
  - `4-2)` 스킨보톡스

실제 경로 계획은 [`js/data/site-map.js`](/js/data/site-map.js)에 함께 정리합니다.

## Image Guide

### 1. 수술적 문신제거 결과 카드 이미지 넣는 법

대상 마크업:
- [surgery.html](/pages/tattoo-removal/surgery.html)

기본 구조:
- `tattoo-result-card`
- `tattoo-result-slot`
- `media-placeholder media-placeholder--result`

현재는 비어 있는 상태라 `tattoo-surgery-result-empty` 클래스를 쓰고 있습니다.
사진을 넣을 때는 각 박스에 고유 클래스를 붙이고, CSS에서 `background`로 연결하면 됩니다.

예시 HTML:

```html
<div class="media-placeholder media-placeholder--result tattoo-surgery-result-1-before" aria-hidden="true"></div>
<div class="media-placeholder media-placeholder--result tattoo-surgery-result-1-after" aria-hidden="true"></div>
```

예시 CSS:
- [tattoo-surgery/index.css](/css/pages/tattoo-surgery/index.css)

```css
.page--tattoo-surgery .tattoo-surgery-result-1-before {
  background: url("../../../assets/images/sub_surgery/result-1-before.png") no-repeat center center / cover;
}

.page--tattoo-surgery .tattoo-surgery-result-1-after {
  background: url("../../../assets/images/sub_surgery/result-1-after.png") no-repeat center center / cover;
}
```

팁:
- 사이즈와 테두리, 배지(`BEFORE/AFTER`)는 이미 공통 스타일이 잡혀 있습니다.
- 이미지 파일만 추가하고, 클래스명만 분리해서 연결하면 됩니다.

### 2. 메인 `sec7-results-track` 결과 사진 넣는 법

대상 마크업:
- [index.html](/index.html)

실제 렌더링:
- [sec7-results.js](/js/pages/main/sec7-results.js)

기본 데이터:
- [main.js](/js/data/pages/main.js)
  - `sec7FallbackResults`

메인 `sec7-results-track`는 HTML에 카드를 직접 쓰는 방식이 아니라, JS가 데이터를 읽어 카드를 생성합니다.
따라서 이미지를 넣을 때는 `sec7FallbackResults`에 값을 채우면 됩니다.

예시:

```js
sec7FallbackResults: [
  {
    round: "[손가락] 5회차",
    caption: "시술 후 4개월 경과",
    beforeImageUrl: "./assets/images/main/result-finger-before.png",
    beforePosition: "center",
    afterImageUrl: "./assets/images/main/result-finger-after.png",
    afterPosition: "center"
  }
]
```

지원 필드:
- `round`: 카드 상단 회차/구분 문구
- `caption`: 카드 하단 설명 문구
- `beforeImageUrl`
- `beforePosition`
- `afterImageUrl`
- `afterPosition`

참고:
- `beforePosition`, `afterPosition`은 `center`, `50% 30%` 같은 CSS `background-position` 값을 그대로 넣으면 됩니다.
- 추후 API 연결 시에도 [sec7-results.js](js/pages/main/sec7-results.js) 기준으로 같은 필드명을 쓰면 바로 붙습니다.
