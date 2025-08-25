import React, { useState, useEffect, useCallback, memo } from 'react';
import './MainContent.css';
import { useApi } from '../hooks';
import { weatherAPI, trendingAPI, taskAPI, teamAPI } from '../services/api';
import { Weather as WeatherType, TrendingTopic, TaskSummary, TeamOverview, Notice } from '../types';
import { formatPercentage, formatDate } from '../utils/formatters';
import { LoadingStates } from './LoadingStates';
import Weather from '../Weather/Weather';
import TodayCard from '../TodayCard/TodayCard';

const MainContent: React.FC = memo(() => {
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);
  const [clickedStat, setClickedStat] = useState<string | null>(null);
  const [weatherAnimated, setWeatherAnimated] = useState(false);
  
  // API 호출
  const { data: weather, loading: weatherLoading } = useApi<WeatherType>(() => weatherAPI.getCurrent());
  const { data: trending, loading: trendingLoading } = useApi<TrendingTopic[]>(() => trendingAPI.getTopics());
  const { data: taskSummary, loading: taskLoading } = useApi<TaskSummary>(() => taskAPI.getSummary());
  const { data: teamOverview, loading: teamLoading } = useApi<TeamOverview>(() => teamAPI.getOverview());
  
  // 하드코딩된 공지사항 데이터 (API 사용 안함)
  const notices: Notice[] = [
    {
      id: 'hardcoded-1',
      title: '2025년 서산시 지역산업맞춤형 일자리창출지원사업 참여자 모집',
      type: 'announcement',
      source: '서산시청',
      date: new Date(),
      url: '#'
    },
    {
      id: 'hardcoded-2',
      title: '서산시 청년창업 지원센터 입주기업 모집 공고',
      type: 'announcement',
      source: '서산시청',
      date: new Date(),
      url: '#'
    }
  ];
  const noticesLoading = false;
  
  // 디버깅용 로그
  console.log('하드코딩된 공지사항:', notices);

  useEffect(() => {
    const timer = setTimeout(() => setWeatherAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 컴포넌트 외부로 이동할 수 있는 함수들
  const getWeatherIcon = useCallback((condition: string) => {
    const iconMap: Record<string, string> = {
      '맑음': '☀️',
      '구름조금': '🌤️',
      '구름많음': '☁️',
      '흐림': '☁️',
      '비': '🌧️',
      '눈': '❄️',
      '안개': '🌫️'
    };
    return iconMap[condition] || '☀️';
  }, []);

  const getAirQualityColor = useCallback((level: string) => {
    const colorMap: Record<string, string> = {
      '좋음': '#00BFA5',
      '보통': '#FFA726',
      '나쁨': '#EF5350',
      '매우나쁨': '#B71C1C'
    };
    return colorMap[level] || '#00BFA5';
  }, []);


  return (
    <div className="main-content">
      <div className="content-section">
        <div className="left-section">
          <Weather />
          
          <div className="trending-card">
            <h3 className="trending-header">트렌딩 토픽</h3>
            {trendingLoading ? (
              <LoadingStates type="list" />
            ) : (
              <div className="trending-list">
                {trending?.map((topic) => (
                  <div 
                    key={topic.id} 
                    className={`trending-item ${hoveredTopic === topic.rank ? 'hovered' : ''}`}
                    tabIndex={0} 
                    role="button" 
                    aria-label={`트렌딩 ${topic.rank}위: ${topic.label}`}
                    onMouseEnter={() => setHoveredTopic(topic.rank)}
                    onMouseLeave={() => setHoveredTopic(null)}
                    onClick={() => console.log('Navigate to:', topic.label)}
                  >
                    <span className="rank">{topic.rank}</span>
                    <span className="label">{topic.label}</span>
                    {topic.isNew && <span className="new-badge">NEW</span>}
                    {topic.change && (
                      <span className={`change-rate ${topic.change > 0 ? 'up' : 'down'}`}>
                        {topic.change > 0 ? '↑' : '↓'} {Math.abs(topic.change)}
                      </span>
                    )}
                    <span className="trend-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="task-info">
          <TodayCard />
        </div>

        {noticesLoading ? (
          <LoadingStates type="list" />
        ) : notices && notices.length > 0 && (
          <div className="notice-cards-section">
            {notices.map((notice) => (
              <div key={notice.id} className="notice-card-box" tabIndex={0} role="article" aria-label={notice.title}>
                <div className="notice-header">
                  <div className="notice-icon">
                    {notice.type === 'announcement' ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M18 2H6C5.45 2 5 2.45 5 3V16C5 16.55 5.45 17 6 17H18C18.55 17 19 16.55 19 16V3C19 2.45 18.55 2 18 2ZM18 16H6V3H18V16ZM3 6H1V18C1 19.1 1.9 20 3 20H15V18H3V6Z" fill="#00BFA5"/>
                        <path d="M8 5H16V7H8V5ZM8 9H16V11H8V9ZM8 13H13V15H8V13Z" fill="#00BFA5"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" fill="#00BFA5"/>
                        <path d="M10 6C9.45 6 9 6.45 9 7V11C9 11.55 9.45 12 10 12C10.55 12 11 11.55 11 11V7C11 6.45 10.55 6 10 6Z" fill="#00BFA5"/>
                        <circle cx="10" cy="14" r="1" fill="#00BFA5"/>
                      </svg>
                    )}
                  </div>
                  <span className="notice-title">
                    {notice.type === 'announcement' ? '최근 공지사항' : '최근 서산뉴스'}
                  </span>
                </div>
                <div className="notice-content">
                  <span className="notice-tag">{notice.source}</span>
                  <span className="notice-text-wrapper">
                    <span className="notice-text">{notice.title}</span>
                    <a href="#" className="notice-link">바로가기</a>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

MainContent.displayName = 'MainContent';

export default MainContent;