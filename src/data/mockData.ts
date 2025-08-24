import { 
  Weather, 
  TrendingTopic, 
  TaskSummary, 
  TeamOverview, 
  Notice, 
  Article, 
  Event, 
  Restaurant, 
  MapLocation,
  TeamMember,
  CityStats,
  ServiceStatus
} from '../types';

export const mockWeather: Weather = {
  temperature: 22,
  feelsLike: 24,
  minTemp: 18,
  maxTemp: 26,
  humidity: 65,
  windSpeed: 2.2,
  windDirection: 'SW',
  condition: '맑음',
  uvLevel: '보통',
  airQuality: {
    pm10: 35,
    pm10Level: '좋음',
    pm25: 18,
    pm25Level: '보통'
  },
  lastUpdated: new Date()
};

export const mockTrendingTopics: TrendingTopic[] = [
  { id: '1', rank: 1, label: '서산 해미읍성 축제', isNew: true, change: 3, searchCount: 1523 },
  { id: '2', rank: 2, label: '서산 육쪽마늘', isNew: false, change: -1, searchCount: 1342 },
  { id: '3', rank: 3, label: '해미순교성지', isNew: false, change: 2, searchCount: 1205 },
  { id: '4', rank: 4, label: '서산 어리굴젓', isNew: false, change: 0, searchCount: 987 },
  { id: '5', rank: 5, label: '서산버드랜드', isNew: true, change: 5, searchCount: 856 },
  { id: '6', rank: 6, label: '서산시청 채용공고', isNew: false, change: -2, searchCount: 743 },
  { id: '7', rank: 7, label: '개심사', isNew: true, change: 4, searchCount: 612 }
];

export const mockTaskSummary: TaskSummary = {
  projects: 15,
  assigned: 48,
  completed: 35,
  completionRate: 94,
  changeRate: 2.3
};

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: '김서산', avatar: '/images/avatar1.png', role: '프로젝트 매니저' },
  { id: '2', name: '이해미', avatar: '/images/avatar2.png', role: '개발자' },
  { id: '3', name: '박천수', avatar: '/images/avatar3.png', role: '디자이너' },
  { id: '4', name: '최대호', avatar: '/images/avatar4.png', role: '기획자' },
  { id: '5', name: '정만호', avatar: '/images/avatar5.png', role: '개발자' }
];

export const mockTeamOverview: TeamOverview = {
  members: mockTeamMembers,
  totalHours: 82,
  weeklyProgress: 73
};

export const mockNotices: Notice[] = [
  {
    id: '1',
    type: 'announcement',
    source: '서산시청',
    title: '2025년 서산시시설관리공단 하반기 직원 공개채용 서류전형 합격자 및 필기시험 계획 공고',
    summary: '서산시시설관리공단 하반기 직원 채용 서류전형 합격자 발표 및 필기시험 계획을 공고합니다.',
    date: new Date('2024-08-04'),
    url: 'https://seosan.go.kr/notice/1'
  },
  {
    id: '2',
    type: 'announcement',
    source: '서산시청',
    title: '2025년 서산시 지역산업맞춤형 일자리창출지원사업 참여자 모집',
    summary: '지역 산업 발전과 일자리 창출을 위한 참여자를 모집합니다.',
    date: new Date('2024-08-03'),
    url: 'https://seosan.go.kr/notice/2'
  }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    category: '음식&카페',
    title: '서산 육쪽마늘로 만든 특별한 요리 베스트 5',
    summary: '서산의 명물 육쪽마늘을 활용한 맛있고 건강한 요리 레시피를 소개합니다.',
    image: '/images/article1.jpg',
    author: {
      name: '김미식',
      avatar: '/images/author1.png',
      role: '푸드 블로거'
    },
    publishedAt: new Date('2024-08-03'),
    views: 1523,
    likes: 234
  },
  {
    id: '2',
    category: '복지정보',
    title: '서산시 청년 주거지원 프로그램 신청 안내',
    summary: '만 19-39세 청년을 대상으로 한 주거지원 프로그램이 시작됩니다.',
    image: '/images/article2.jpg',
    author: {
      name: '서산시청',
      avatar: '/images/seosan-logo.png',
      role: '공식'
    },
    publishedAt: new Date('2024-08-02'),
    views: 892,
    likes: 156
  },
  {
    id: '3',
    category: '힐링&관광',
    title: '서산 버드랜드에서 만나는 철새들의 향연',
    summary: '겨울 철새 도래지로 유명한 서산 버드랜드의 아름다운 풍경을 담았습니다.',
    image: '/images/article3.jpg',
    author: {
      name: '박자연',
      avatar: '/images/author3.png',
      role: '여행 작가'
    },
    publishedAt: new Date('2024-08-01'),
    views: 2103,
    likes: 412
  },
  {
    id: '4',
    category: '생활&문화',
    title: '서산 해미읍성 야간 개장 특별 이벤트',
    summary: '여름밤을 아름답게 수놓을 해미읍성의 특별한 야간 프로그램을 소개합니다.',
    image: '/images/article4.jpg',
    author: {
      name: '이문화',
      avatar: '/images/author4.png',
      role: '문화 리포터'
    },
    publishedAt: new Date('2024-07-31'),
    views: 1678,
    likes: 298
  },
  {
    id: '5',
    category: '건강',
    title: '서산시 보건소 무료 건강검진 프로그램 안내',
    summary: '시민 건강증진을 위한 무료 건강검진 프로그램이 확대 운영됩니다.',
    image: '/images/article5.jpg',
    author: {
      name: '서산보건소',
      avatar: '/images/health-logo.png',
      role: '공식'
    },
    publishedAt: new Date('2024-07-30'),
    views: 734,
    likes: 89
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: '제15회 서산 해미읍성 문화축제',
    date: new Date('2024-09-15'),
    location: '해미읍성 일원',
    category: '문화/축제',
    image: '/images/event1.jpg',
    description: '조선시대 역사와 문화를 체험할 수 있는 대표 축제',
    programs: ['전통 무예 시연', '한복 체험', '전통 음식 체험', '야간 성곽 투어']
  },
  {
    id: '2',
    title: '서산 육쪽마늘 축제',
    date: new Date('2024-10-20'),
    location: '서산시 농업기술센터',
    category: '농업/특산물',
    image: '/images/event2.jpg',
    description: '서산의 명물 육쪽마늘을 주제로 한 특산물 축제',
    programs: ['마늘 수확 체험', '마늘 요리 경연', '특산물 직거래 장터']
  }
];

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '해미읍성 한정식',
    category: '한식',
    rating: 4.5,
    reviews: 234,
    image: '/images/restaurant1.jpg',
    location: '서산시 해미면 읍내리',
    priceRange: '₩₩₩',
    hours: '11:00 - 21:00',
    phone: '041-688-1234'
  },
  {
    id: '2',
    name: '서산 어리굴젓 전문점',
    category: '해산물',
    rating: 4.8,
    reviews: 567,
    image: '/images/restaurant2.jpg',
    location: '서산시 부석면',
    priceRange: '₩₩',
    hours: '10:00 - 22:00',
    phone: '041-664-5678'
  },
  {
    id: '3',
    name: '육쪽마늘 보쌈',
    category: '한식',
    rating: 4.6,
    reviews: 389,
    image: '/images/restaurant3.jpg',
    location: '서산시 동문동',
    priceRange: '₩₩',
    hours: '11:30 - 23:00',
    phone: '041-665-9012'
  }
];

export const mockMapLocations: MapLocation[] = [
  {
    id: '1',
    name: '해미읍성',
    category: 'attraction',
    coordinates: { lat: 36.7116, lng: 126.5518 },
    address: '충청남도 서산시 해미면 남문2로 143',
    description: '조선시대 대표적인 읍성'
  },
  {
    id: '2',
    name: '서산버드랜드',
    category: 'attraction',
    coordinates: { lat: 36.8834, lng: 126.4184 },
    address: '충청남도 서산시 부석면 천수만로 655-73',
    description: '철새 도래지 및 생태 관광지'
  },
  {
    id: '3',
    name: '서산시청',
    category: 'public',
    coordinates: { lat: 36.7845, lng: 126.4503 },
    address: '충청남도 서산시 관아문길 1',
    description: '서산시 행정 중심지'
  }
];

export const mockCityStats: CityStats = {
  dailyVisitors: 15234,
  visitorChange: 3.5,
  airQualityIndex: 45,
  airQualityStatus: '좋음',
  serviceCompletionRate: 94,
  serviceRateChange: 2.1,
  dailyRequests: 326,
  busRoutes: 48,
  hospitalBookings: 189,
  libraryVisitors: 523,
  culturalEvents: 12,
  announcements: 8,
  citizenFeedback: 42,
  completedProjects: 7,
  lastUpdated: new Date()
};

export const mockServiceStatus: ServiceStatus[] = [
  {
    id: '1',
    name: '시청 홈페이지',
    status: '정상',
    lastChecked: new Date()
  },
  {
    id: '2',
    name: '민원24 서비스',
    status: '정상',
    lastChecked: new Date()
  },
  {
    id: '3',
    name: '버스정보 시스템',
    status: '점검중',
    message: '시스템 업그레이드 중 (오후 2시 완료 예정)',
    lastChecked: new Date()
  },
  {
    id: '4',
    name: '도서관 예약 시스템',
    status: '정상',
    lastChecked: new Date()
  },
  {
    id: '5',
    name: '재활용 수거 신청',
    status: '정상',
    lastChecked: new Date()
  }
];