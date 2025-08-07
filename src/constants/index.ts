// ========== APPLICATION CONSTANTS ========== //

// API Endpoints
export const API_ENDPOINTS = {
  WEATHER: '/api/weather',
  TRENDING: '/api/trending',
  TASKS: '/api/tasks',
  TEAM: '/api/team',
  NOTICES: '/api/notices',
  NEWS: '/api/news',
  RESTAURANTS: '/api/restaurants',
} as const;

// 색상 팔레트
export const COLORS = {
  PRIMARY: '#00BFA5',
  PRIMARY_DARK: '#00A896',
  PRIMARY_LIGHT: 'rgba(0, 191, 165, 0.1)',
  BACKGROUND: '#F8FFFE',
  TEXT_PRIMARY: 'rgba(0, 0, 0, 0.88)',
  TEXT_SECONDARY: 'rgba(0, 0, 0, 0.72)',
  TEXT_TERTIARY: 'rgba(0, 0, 0, 0.60)',
  WHITE: '#FFFFFF',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  SUCCESS: '#10B981',
} as const;

// 애니메이션 타이밍
export const ANIMATION = {
  FAST: '150ms',
  BASE: '300ms',
  SLOW: '500ms',
  VERY_SLOW: '800ms',
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// 브레이크포인트
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
} as const;

// 터치 타겟 크기
export const TOUCH_TARGET = {
  MIN_SIZE: 44, // 최소 44x44px (WCAG 권장)
  COMFORTABLE: 48,
  LARGE: 56,
} as const;

// 로딩/에러 메시지
export const MESSAGES = {
  LOADING: {
    DEFAULT: '로딩 중...',
    MAP: '지도를 불러오는 중...',
    DATA: '데이터를 가져오는 중...',
    IMAGE: '이미지를 로드하는 중...',
  },
  ERROR: {
    DEFAULT: '문제가 발생했습니다. 다시 시도해주세요.',
    NETWORK: '네트워크 연결에 문제가 있습니다.',
    NOT_FOUND: '요청하신 정보를 찾을 수 없습니다.',
    SERVER: '서버에 문제가 발생했습니다.',
    TIMEOUT: '요청 시간이 초과되었습니다.',
  },
  EMPTY: {
    DEFAULT: '표시할 데이터가 없습니다.',
    SEARCH: '검색 결과가 없습니다.',
    LIST: '목록이 비어있습니다.',
  },
} as const;

// z-index 레이어
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

// 성능 최적화 설정
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  IMAGE_LAZY_OFFSET: '100px',
  MAX_CONCURRENT_REQUESTS: 6,
} as const;

// 접근성 설정
export const ACCESSIBILITY = {
  SKIP_LINK_ID: 'main-content',
  LIVE_REGION_TIMEOUT: 100,
  FOCUS_VISIBLE_OUTLINE: '2px solid #00BFA5',
  MIN_CONTRAST_RATIO: 4.5, // WCAG AA
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  MAP_STATE: 'seosan-map-state',
  USER_PREFERENCES: 'seosan-user-prefs',
  THEME: 'seosan-theme',
  LAST_VISIT: 'seosan-last-visit',
} as const;

// 날씨 아이콘 매핑
export const WEATHER_ICONS = {
  맑음: '☀️',
  구름조금: '🌤️',
  구름많음: '☁️',
  흐림: '☁️',
  비: '🌧️',
  눈: '❄️',
  안개: '🌫️',
} as const;

// 공기질 색상 매핑
export const AIR_QUALITY_COLORS = {
  좋음: '#00BFA5',
  보통: '#FFA726',
  나쁨: '#EF5350',
  매우나쁨: '#B71C1C',
} as const;