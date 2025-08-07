export interface AirQuality {
  pm10: number;
  pm10Level: string;
  pm25: number;
  pm25Level: string;
}

export interface Weather {
  temperature: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  uvLevel: string;
  airQuality: AirQuality;
  lastUpdated: Date;
}

export type AirQualityLevel = '좋음' | '보통' | '나쁨' | '매우나쁨';

export interface TrendingTopic {
  id: string;
  rank: number;
  label: string;
  isNew: boolean;
  change?: number;
  searchCount: number;
}

export interface TaskSummary {
  projects: number;
  assigned: number;
  completed: number;
  completionRate: number;
  changeRate: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface TeamOverview {
  members: TeamMember[];
  totalHours: number;
  weeklyProgress: number;
}

export interface Notice {
  id: string;
  type: 'announcement' | 'news';
  source: string;
  title: string;
  summary?: string;
  date: Date;
  url?: string;
}

export interface Article {
  id: string;
  category: ArticleCategory;
  title: string;
  summary: string;
  image: string;
  author: Author;
  publishedAt: Date;
  views?: number;
  likes?: number;
}

export type ArticleCategory = 
  | '생활&문화' 
  | '복지정보' 
  | '힐링&관광' 
  | '음식&카페' 
  | '건강' 
  | '서산행정' 
  | '이벤트/소식' 
  | '서산경제';

export interface Author {
  name: string;
  avatar: string;
  role?: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  category: string;
  image?: string;
  description: string;
  programs?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  location: string;
  priceRange: PriceRange;
  hours?: string;
  phone?: string;
}

export type PriceRange = '₩' | '₩₩' | '₩₩₩' | '₩₩₩₩';

export interface MapLocation {
  id: string;
  name: string;
  category: LocationCategory;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  description?: string;
}

export type LocationCategory = 
  | 'restaurant' 
  | 'cafe' 
  | 'attraction' 
  | 'shopping' 
  | 'hospital' 
  | 'public' 
  | 'parking';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface CityStats {
  dailyVisitors: number;
  visitorChange: number;
  airQualityIndex: number;
  airQualityStatus: string;
  serviceCompletionRate: number;
  serviceRateChange: number;
  dailyRequests: number;
  busRoutes: number;
  hospitalBookings: number;
  libraryVisitors: number;
  culturalEvents: number;
  announcements: number;
  citizenFeedback: number;
  completedProjects: number;
  lastUpdated: Date;
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: '정상' | '점검중' | '장애';
  message?: string;
  lastChecked: Date;
}