# 서산에 뭐 issue? - 서산시민을 위한 종합 정보 플랫폼

서산 시민을 위한 실시간 지역 정보 플랫폼입니다.  
날씨, 미세먼지, 뉴스, 행사, 등 서산의 다양한 생활 정보를 한 곳에서 제공합니다.

---

## 프로젝트 주요 기능 및 구현 설명

### 1. **실시간 날씨 정보**
- **날씨, 미세먼지, 자외선 등 실시간 데이터 표시**
  - 기상청 API를 프록시 서버(Node.js Express)로 중계 후 React에서 데이터 fetch
  - 날씨 종류별 아이콘(맑음, 흐림, 비, 눈) 자동 매핑
  - 오늘/주간 예보, 미세먼지/초미세먼지, 자외선 지수 표시
- **관련 코드:**
  - `/src/api/Weather.api.js`, `/src/api/dust.api.js`
  - `/src/components/Weather/Weather.jsx`, 아이콘: `/src/assets/`
  - 프록시 서버: `/server/index.js`

### 2. **트렌딩 토픽**
- **서산 인기 검색어/이슈 실시간 노출**
  - 프론트엔드에서 실제 API 연동(향후 Open API 혹은 자체 데이터로 연동 예정)
  - 트렌딩 변화율, 실시간 토픽 UI 구현
- **관련 코드:**
  - `/src/Mainpage/Mainpage.jsx`
  - 추후 API 연동 시 `/src/services/trendingService.js`로 관리

### 3. **AI 검색 기능**
- **AI 기반 키워드, 지역, 이슈 등 검색**
  - 프론트엔드에서 사용자가 질문/키워드를 입력하면, AI 검색 결과를 받아서 결과 노출
  - 검색 결과 없음/있음에 따라 각각 다른 UI (예: 말풍선, 안내 메시지 등) 표시
- **관련 코드:**
  - `/src/AiSearch/AiSearch.jsx`
  - 스타일: `/src/AiSearch/AiSearch.module.css`
  - 실제 AI 연동 API 준비 중

### 4. **메인 페이지 및 레이아웃**
- **반응형 UI, 실시간 정보 업데이트**
  - 오늘의 서산(슬라이더), 인기 토픽, 추천 장소, 메인 카드형 UI 구현
  - 다양한 상태(검색 전/후, 로딩, 에러 등) 대응
- **관련 코드:**
  - `/src/Mainpage/Mainpage.jsx`
  - `/src/TodayCard/TodayCard/`

---

## 폴더 구조 및 역할

---

## 사용 기술 스택

- React 18
- React Router v6
- CSS Modules, 전역 CSS, CSS Variables
- 상태 관리: useState, useContext
- 빌드/런: Create React App
- Node.js Express(프록시 서버)
- (예정) AI 검색 API, 공공데이터 Open API

---

## 실행 방법

1. 의존성 설치
   ```bash
   npm install
2. 개발 서버 실행
    npm start
3. 빌드
    npm run build
4. 테스트
    npm test
## 기여/커밋 가이드
- 기능 단위로 브랜치 생성 (예: feature/AiSearch) 

## 커밋 메시지 규칙:

- feat: AI 검색 기능 구현

- fix: 날씨 데이터 오류 수정

- style: 메인 카드 UI 수정

- PR 요청 시 코드/설명 포함 권장