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
  ApiResponse,
  CityStats,
  ServiceStatus
} from '../types';
import * as mockData from '../data/mockData';

// API 기본 URL (실제 배포시 환경변수로 관리)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// 공통 API 호출 함수
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      data: data,
      status: response.status,
      message: 'Success'
    };
  } catch (error) {
    // 개발 환경에서는 mock 데이터 반환
    if (process.env.NODE_ENV === 'development') {
      return getMockData<T>(endpoint);
    }
    throw error;
  }
}

// Mock 데이터 반환 함수
function getMockData<T>(endpoint: string): ApiResponse<T> {
  const mockResponses: Record<string, any> = {
    '/weather/current': mockData.mockWeather,
    '/trending/topics': mockData.mockTrendingTopics,
    '/tasks/summary': mockData.mockTaskSummary,
    '/team/overview': mockData.mockTeamOverview,
    '/notices/recent': mockData.mockNotices,
    '/articles/recent': mockData.mockArticles,
    '/events/upcoming': mockData.mockEvents,
    '/restaurants/popular': mockData.mockRestaurants,
    '/map/locations': mockData.mockMapLocations,
    '/city/stats': mockData.mockCityStats,
    '/city/services/status': mockData.mockServiceStatus,
  };

  // Handle query parameters
  const baseEndpoint = endpoint.split('?')[0];
  return {
    data: mockResponses[baseEndpoint] || null,
    status: 200,
    message: 'Mock data'
  };
}

// Task API
export const taskAPI = {
  getSummary: () => fetchAPI<TaskSummary>('/tasks/summary'),
  getTasks: () => fetchAPI<any[]>('/tasks'),
  updateTask: (id: string, data: any) => 
    fetchAPI<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Team API
export const teamAPI = {
  getOverview: () => fetchAPI<TeamOverview>('/team/overview'),
  getMembers: () => fetchAPI<any[]>('/team/members'),
};

// Notice API
export const noticeAPI = {
  getRecent: (limit: number = 10) => fetchAPI<Notice[]>(`/notices/recent?limit=${limit}`),
  getNotice: (id: string) => fetchAPI<Notice>(`/notices/${id}`),
  getByType: (type: 'announcement' | 'news') => fetchAPI<Notice[]>(`/notices?type=${type}`),
};

// Article API
export const articleAPI = {
  getRecent: (limit: number = 10) => fetchAPI<Article[]>(`/articles/recent?limit=${limit}`),
  getByCategory: (category: string) => fetchAPI<Article[]>(`/articles?category=${category}`),
  getArticle: (id: string) => fetchAPI<Article>(`/articles/${id}`),
  searchArticles: (query: string) => fetchAPI<Article[]>(`/articles/search?q=${query}`),
};

// Event API
export const eventAPI = {
  getUpcoming: () => fetchAPI<Event[]>('/events/upcoming'),
  getEvent: (id: string) => fetchAPI<Event>(`/events/${id}`),
  getByMonth: (year: number, month: number) => 
    fetchAPI<Event[]>(`/events?year=${year}&month=${month}`),
};

// Restaurant API
export const restaurantAPI = {
  getPopular: (limit: number = 10) => fetchAPI<Restaurant[]>(`/restaurants/popular?limit=${limit}`),
  getByCategory: (category: string) => fetchAPI<Restaurant[]>(`/restaurants?category=${category}`),
  getRestaurant: (id: string) => fetchAPI<Restaurant>(`/restaurants/${id}`),
  searchRestaurants: (query: string) => fetchAPI<Restaurant[]>(`/restaurants/search?q=${query}`),
};

// Map API
export const mapAPI = {
  getLocations: (category?: string) => 
    fetchAPI<MapLocation[]>(`/map/locations${category ? `?category=${category}` : ''}`),
  getNearby: (lat: number, lng: number, radius: number = 1000) => 
    fetchAPI<MapLocation[]>(`/map/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Search API
export const searchAPI = {
  globalSearch: (query: string) => 
    fetchAPI<{
      articles: Article[];
      events: Event[];
      restaurants: Restaurant[];
      notices: Notice[];
    }>(`/search?q=${query}`),
};

// Weather API
export const weatherAPI = {
  getCurrent: () => fetchAPI<Weather>('/weather/current'),
  getForecast: (days: number = 7) => fetchAPI<Weather[]>(`/weather/forecast?days=${days}`),
  getHistorical: (date: string) => fetchAPI<Weather>(`/weather/historical?date=${date}`),
};

// Trending API
export const trendingAPI = {
  getTopics: (limit: number = 10) => fetchAPI<TrendingTopic[]>(`/trending/topics?limit=${limit}`),
  getByCategory: (category: string) => fetchAPI<TrendingTopic[]>(`/trending?category=${category}`),
  updateTopic: (id: string, data: Partial<TrendingTopic>) => 
    fetchAPI<TrendingTopic>(`/trending/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// City Stats API
export const cityAPI = {
  getStats: () => fetchAPI<CityStats>('/city/stats'),
  getServiceStatus: () => fetchAPI<ServiceStatus[]>('/city/services/status'),
  getDailyReport: (date?: string) => 
    fetchAPI<CityStats>(`/city/report${date ? `?date=${date}` : ''}`),
};