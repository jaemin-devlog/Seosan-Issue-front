# 서산에 뭐 issue? - 서산시민을 위한 종합 정보 플랫폼

서산시민들을 위한 종합 정보 플랫폼으로, 날씨, 뉴스, 행사, 맛집 등 다양한 지역 정보를 한 곳에서 제공합니다.

## 주요 기능

### 1. 실시간 날씨 정보
- 현재 날씨 및 온도
- 미세먼지, 초미세먼지, 자외선 지수
- 주간 날씨 예보

### 2. 트렌딩 토픽
- 서산 지역 인기 검색어
- 실시간 트렌드 업데이트
- 변화율 표시

### 3. 시민 참여 현황
- 진행중인 사업 현황
- 민원 처리 상태
- 정시 처리율 통계

### 4. 지역 소식
- 최신 공지사항
- 서산 뉴스
- 카테고리별 기사 분류

### 5. 지도 기반 정보
- 서산 축제 위치 및 일정
- 관광지 정보
- 맛집 위치

## 기술 스택

- **Frontend**: React 18, TypeScript
- **상태관리**: Context API
- **스타일링**: CSS Modules, CSS Variables
- **아이콘**: Lucide React
- **빌드도구**: Create React App

## 프로젝트 구조

```
src/
├── components/        # UI 컴포넌트
├── contexts/         # Context API 상태 관리
├── data/            # 모킹 데이터
├── hooks/           # 커스텀 훅
├── services/        # API 서비스
├── styles/          # 전역 스타일
├── types/           # TypeScript 타입 정의
└── utils/           # 유틸리티 함수
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

### 빌드

```bash
npm build
```

### 테스트

```bash
npm test
```

## 주요 컴포넌트

- **Header**: 네비게이션 및 로고
- **MainContent**: 날씨, 트렌딩, 시민 참여 정보
- **MapSection**: 축제 및 관광지 지도
- **InfoSection**: 추천 정보 및 지역 소식
- **Footer**: 인기 카테고리 및 사이트 정보

## 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **접근성**: WCAG 2.1 AA 준수
- **다크모드**: 시스템 설정 연동
- **에러 처리**: ErrorBoundary 및 Toast 알림
- **성능 최적화**: 코드 스플리팅, 지연 로딩

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 라이선스

© 2025 서산시. All rights reserved.