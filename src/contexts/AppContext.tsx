import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Weather, TrendingTopic, TaskSummary, TeamOverview, Notice, Article, Event, Restaurant } from '../types';

interface AppState {
  // 날씨 정보
  weather: Weather | null;
  
  // 트렌딩 토픽
  trendingTopics: TrendingTopic[];
  
  // 작업 요약
  taskSummary: TaskSummary | null;
  
  // 팀 개요
  teamOverview: TeamOverview | null;
  
  // 공지사항
  notices: Notice[];
  
  // 기사
  articles: Article[];
  
  // 이벤트
  events: Event[];
  
  // 맛집
  restaurants: Restaurant[];
  
  // 로딩 상태
  isLoading: boolean;
  
  // 에러 상태
  error: string | null;
  
  // 사용자 설정
  userPreferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ko' | 'en';
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
}

interface AppContextType extends AppState {
  // 상태 업데이트 함수들
  updateWeather: (weather: Weather) => void;
  updateTrendingTopics: (topics: TrendingTopic[]) => void;
  updateTaskSummary: (summary: TaskSummary) => void;
  updateTeamOverview: (overview: TeamOverview) => void;
  updateNotices: (notices: Notice[]) => void;
  updateArticles: (articles: Article[]) => void;
  updateEvents: (events: Event[]) => void;
  updateRestaurants: (restaurants: Restaurant[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserPreferences: (preferences: Partial<AppState['userPreferences']>) => void;
  resetState: () => void;
}

// 초기 상태
const initialState: AppState = {
  weather: null,
  trendingTopics: [],
  taskSummary: null,
  teamOverview: null,
  notices: [],
  articles: [],
  events: [],
  restaurants: [],
  isLoading: false,
  error: null,
  userPreferences: {
    theme: 'light',
    language: 'ko',
    fontSize: 'medium',
    reducedMotion: false
  }
};

// Context 생성
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 컴포넌트
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // localStorage에서 사용자 설정 불러오기
    const savedPreferences = localStorage.getItem('seosan-user-preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        return {
          ...initialState,
          userPreferences: {
            ...initialState.userPreferences,
            ...preferences
          }
        };
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    }
    return initialState;
  });

  // 날씨 업데이트
  const updateWeather = useCallback((weather: Weather) => {
    setState(prev => ({ ...prev, weather }));
  }, []);

  // 트렌딩 토픽 업데이트
  const updateTrendingTopics = useCallback((trendingTopics: TrendingTopic[]) => {
    setState(prev => ({ ...prev, trendingTopics }));
  }, []);

  // 작업 요약 업데이트
  const updateTaskSummary = useCallback((taskSummary: TaskSummary) => {
    setState(prev => ({ ...prev, taskSummary }));
  }, []);

  // 팀 개요 업데이트
  const updateTeamOverview = useCallback((teamOverview: TeamOverview) => {
    setState(prev => ({ ...prev, teamOverview }));
  }, []);

  // 공지사항 업데이트
  const updateNotices = useCallback((notices: Notice[]) => {
    setState(prev => ({ ...prev, notices }));
  }, []);

  // 기사 업데이트
  const updateArticles = useCallback((articles: Article[]) => {
    setState(prev => ({ ...prev, articles }));
  }, []);

  // 이벤트 업데이트
  const updateEvents = useCallback((events: Event[]) => {
    setState(prev => ({ ...prev, events }));
  }, []);

  // 맛집 업데이트
  const updateRestaurants = useCallback((restaurants: Restaurant[]) => {
    setState(prev => ({ ...prev, restaurants }));
  }, []);

  // 로딩 상태 설정
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  // 에러 상태 설정
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // 사용자 설정 업데이트
  const updateUserPreferences = useCallback((preferences: Partial<AppState['userPreferences']>) => {
    setState(prev => {
      const newPreferences = {
        ...prev.userPreferences,
        ...preferences
      };
      
      // localStorage에 저장
      localStorage.setItem('seosan-user-preferences', JSON.stringify(newPreferences));
      
      // 테마 적용
      if (preferences.theme) {
        document.documentElement.setAttribute('data-theme', preferences.theme);
      }
      
      // 폰트 크기 적용
      if (preferences.fontSize) {
        document.documentElement.setAttribute('data-font-size', preferences.fontSize);
      }
      
      // 모션 감소 적용
      if (preferences.reducedMotion !== undefined) {
        document.documentElement.setAttribute('data-reduced-motion', String(preferences.reducedMotion));
      }
      
      return {
        ...prev,
        userPreferences: newPreferences
      };
    });
  }, []);

  // 상태 초기화
  const resetState = useCallback(() => {
    setState(initialState);
    localStorage.removeItem('seosan-user-preferences');
  }, []);

  const value: AppContextType = {
    ...state,
    updateWeather,
    updateTrendingTopics,
    updateTaskSummary,
    updateTeamOverview,
    updateNotices,
    updateArticles,
    updateEvents,
    updateRestaurants,
    setLoading,
    setError,
    updateUserPreferences,
    resetState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// useAppContext 훅
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// 선택적 컨텍스트 훅들
export const useWeather = () => {
  const { weather } = useAppContext();
  return weather;
};

export const useTrendingTopics = () => {
  const { trendingTopics } = useAppContext();
  return trendingTopics;
};

export const useUserPreferences = () => {
  const { userPreferences, updateUserPreferences } = useAppContext();
  return { preferences: userPreferences, updatePreferences: updateUserPreferences };
};