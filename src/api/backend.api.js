// CORS 프록시 URL (임시 해결책)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// API 기본 URL 설정
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api'  // 개발 환경: 프록시가 /api를 /api/v1로 변환
  : `${CORS_PROXY}https://seosan-issue.shop/api/v1`;

const FLASK_BASE_URL = process.env.NODE_ENV === 'development'
  ? '/flask'  // 개발 환경: 프록시 사용
  : `${CORS_PROXY}https://seosan-issue.shop/flask`;

// 카테고리 상수 정의
export const POST_CATEGORIES = {
  // 복지
  WELFARE_SENIOR: 'WELFARE_SENIOR',           // 복지-어르신
  WELFARE_DISABLED: 'WELFARE_DISABLED',       // 복지-장애인
  WELFARE_WOMEN_FAMILY: 'WELFARE_WOMEN_FAMILY', // 복지-여성가족
  WELFARE_CHILD_YOUTH: 'WELFARE_CHILD_YOUTH',  // 복지-아동청소년
  WELFARE_YOUTH: 'WELFARE_YOUTH',             // 복지-청년
  // 서산시청
  HEALTH_WELLNESS: 'HEALTH_WELLNESS',         // 보건/건강
  NOTICE: 'NOTICE',                           // 공지사항
  PRESS_RELEASE: 'PRESS_RELEASE',             // 보도자료
  // 문화
  CULTURE_NEWS: 'CULTURE_NEWS',               // 문화소식
  CITY_TOUR: 'CITY_TOUR',                     // 시티투어
  TOUR_GUIDE: 'TOUR_GUIDE'                    // 관광/안내
};

// 공통 fetch 함수
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API 호출 실패 (${endpoint}):`, error);
    throw error;
  }
}

// 네이버 검색 API
export const naverSearchAPI = {
  search: async (query, types = 'news', display = 5) => {
    const params = new URLSearchParams({
      q: query,
      types,
      display: display.toString()
    });
    return fetchAPI(`/explore/naver?${params}`);
  },
  
  // 네이버 데일리 트렌드
  getDailyTrend: async (startDate = '2023-01-01', endDate = '2025-08-11') => {
    return fetchAPI(`/naver-search/daily-trend?startDate=${startDate}&endDate=${endDate}`);
  }
};

// AI 검색 API
export const aiSearchAPI = {
  // AI 검색 간략 - 수정된 엔드포인트
  searchBrief: async (query) => {
    return fetchAPI('/ai-search', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  },
  
  // AI 검색 상세 - 수정된 엔드포인트
  searchDetail: async (query) => {
    return fetchAPI('/ai-search/detail', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  },
  
  // 요약 AI - Flask 엔드포인트 사용 (프록시 경유)
  summarize: async (content) => {
    const url = `${FLASK_BASE_URL}/summarize`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      });
      return await response.json();
    } catch (error) {
      console.error('요약 AI 호출 실패:', error);
      throw error;
    }
  }
};

// 게시글 API
export const postsAPI = {
  // 게시글 목록 조회
  getList: async (page = 1) => {
    // 실제 API는 /api/posts/{page} 형식
    const url = process.env.NODE_ENV === 'development'
      ? `/api/posts/${page}`
      : `https://seosan-issue.shop/api/posts/${page}`;
    
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      throw error;
    }
  },
  
  // 게시글 상세 조회
  getDetail: async (postId) => {
    const url = `https://seosan-issue.shop/api/posts/${postId}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      throw error;
    }
  },
  
  // 게시물 목록 조회 (필터링)
  getFilteredList: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    return fetchAPI(`/posts/filtered?${queryParams}`);
  },
  
  // 카테고리별 게시물 조회 (새로운 API)
  getByCategory: async (category, region = '대산읍', page = 0, size = 5) => {
    // 직접 전체 URL 사용
    const params = new URLSearchParams({
      category,
      region: region, // URLSearchParams가 자동으로 인코딩 처리
      page: page.toString(),
      size: size.toString()
    });
    
    const fullUrl = `https://seosan-issue.shop/api/posts?${params.toString()}`;
    
    console.log('API 호출 URL:', fullUrl);
    
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      console.log('API 원본 응답:', data);
      
      // 전체 응답 객체 반환 (content, totalPages, totalElements 포함)
      return data;
    } catch (error) {
      console.error(`카테고리별 게시물 조회 실패 (${category}):`, error);
      throw error;
    }
  }
};

// 날씨 API
export const weatherAPI = {
  // 특정 지역 날씨 조회 - 실제 API에 맞게 수정
  getByLocation: async (city = '서산시') => {
    return fetchAPI(`/weather/cards?city=${city}`);
  }
};

// 콘텐츠 통계 API
export const statsAPI = {
  // 콘텐츠 통계 조회 - Flask 엔드포인트 (프록시 경유)
  getContentStats: async () => {
    const url = `${FLASK_BASE_URL}/content_stats`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      return await response.json();
    } catch (error) {
      console.error('콘텐츠 통계 로드 실패:', error);
      return null;
    }
  }
};

// 지역 정보 API
export const regionAPI = {
  // 지역별로 조회 (페이징)
  getByRegion: async (region, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return fetchAPI(`/regions/${region}?${params}`);
  }
};

// 메인페이지 API
export const mainPageAPI = {
  // 일간/주간 검색어 - Flask 엔드포인트 사용 (프록시 경유)
  getTrendingKeywords: async (period = 'daily') => {
    const url = `${FLASK_BASE_URL}/crawl_popular_terms`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // 타임아웃 설정 추가
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('트렌딩 키워드 로드 실패:', error);
      
      // 백엔드 문제 시 하드코딩된 데이터 반환 (임시 조치)
      return {
        daily: ["임용식", "한우", "신규", "폐기물", "영화", "봉사활동", "급식왕", "사회복지시설", "분리배출", "인구"],
        weekly: ["채용공고", "채용", "폐기물", "취업자격증", "강우량", "조직도", "인사발령", "전기차", "관아문", "공고"]
      };
    }
  }
};

// 크롤링 API
export const crawlingAPI = {
  getCrawledData: async (source) => {
    return fetchAPI(`/crawl/${source}`);
  }
};

// 복지 정보 API (새로운 엔드포인트 사용)
export const welfareAPI = {
  // 복지-어르신
  getElderly: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.WELFARE_SENIOR, region, page, size);
  },
  
  // 복지-장애인
  getDisabled: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.WELFARE_DISABLED, region, page, size);
  },
  
  // 복지-여성가족
  getWomenFamily: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.WELFARE_WOMEN_FAMILY, region, page, size);
  },
  
  // 복지-아동청소년
  getChildYouth: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.WELFARE_CHILD_YOUTH, region, page, size);
  },
  
  // 복지-청년
  getYouth: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.WELFARE_YOUTH, region, page, size);
  }
};

// 서산시청 정보 API (새로운 엔드포인트 사용)
export const seosanAPI = {
  // 보건/건강
  getHealth: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.HEALTH_WELLNESS, region, page, size);
  },
  
  // 공지사항
  getNotices: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.NOTICE, region, page, size);
  },
  
  // 보도자료
  getPressRelease: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.PRESS_RELEASE, region, page, size);
  }
};

// 문화 정보 API (새로운 추가)
export const cultureAPI = {
  // 문화소식
  getCultureNews: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.CULTURE_NEWS, region, page, size);
  },
  
  // 시티투어
  getCityTour: async (region = '대산읍', page = 0, size = 5) => {
    return postsAPI.getByCategory(POST_CATEGORIES.CITY_TOUR, region, page, size);
  },
  
  // 관광/안내  
  getTourGuide: async (region = '대산읍', page = 0, size = 5) => {
    // 사용자가 제공한 URL에 따르면 관광/안내도 CITY_TOUR를 사용
    return postsAPI.getByCategory(POST_CATEGORIES.CITY_TOUR, region, page, size);
  }
};

export default {
  naverSearchAPI,
  aiSearchAPI,
  postsAPI,
  weatherAPI,
  statsAPI,
  regionAPI,
  mainPageAPI,
  crawlingAPI,
  welfareAPI,
  seosanAPI,
  cultureAPI,
  POST_CATEGORIES
};