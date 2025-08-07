import React, { useState, useEffect, useCallback, memo } from 'react';
import './MainContent.css';
import { useApi } from '../hooks';
import { weatherAPI, trendingAPI, taskAPI, teamAPI, noticeAPI } from '../services/api';
import { Weather, TrendingTopic, TaskSummary, TeamOverview, Notice } from '../types';
import { formatPercentage, formatDate } from '../utils/formatters';
import { LoadingStates } from './LoadingStates';

const MainContent: React.FC = memo(() => {
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);
  const [clickedStat, setClickedStat] = useState<string | null>(null);
  const [weatherAnimated, setWeatherAnimated] = useState(false);
  
  // API 호출
  const { data: weather, loading: weatherLoading } = useApi<Weather>(() => weatherAPI.getCurrent());
  const { data: trending, loading: trendingLoading } = useApi<TrendingTopic[]>(() => trendingAPI.getTopics());
  const { data: taskSummary, loading: taskLoading } = useApi<TaskSummary>(() => taskAPI.getSummary());
  const { data: teamOverview, loading: teamLoading } = useApi<TeamOverview>(() => teamAPI.getOverview());
  const { data: notices, loading: noticesLoading } = useApi<Notice[]>(() => noticeAPI.getRecent(2));

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
          <div className="weather-card">
            <h2 className="section-title">날씨</h2>
            {weatherLoading ? (
              <LoadingStates type="weather" />
            ) : weather && (
              <>
                <div className={`weather-display ${weatherAnimated ? 'animated' : ''}`}>
                  <div className="weather-main">
                    <div className="temperature">
                      <span className="temp-value">{weather.temperature}</span>
                      <span className="temp-unit">°</span>
                    </div>
                    <div className="weather-details">
                      <span className="detail-item">
                        <span className="detail-icon">💧</span>
                        <span>습도 {weather.humidity}%</span>
                      </span>
                      <span className="separator">|</span>
                      <span className="detail-item">
                        <span className="detail-icon">🍃</span>
                        <span>{weather.windDirection}풍 {weather.windSpeed} m/s</span>
                      </span>
                    </div>
                  </div>
                  <div className="weather-visual">
                    <div className="weather-glow" />
                    <div className="weather-emoji">{getWeatherIcon(weather.condition)}</div>
                  </div>
                </div>
                <div className="weather-condition">{weather.condition}</div>
                <div className="weather-status">
                  <div className="status-item">
                    <span className="label">미세먼지</span>
                    <span className="value" style={{ color: getAirQualityColor(weather.airQuality.pm10Level) }}>
                      {weather.airQuality.pm10Level}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="label">초미세먼지</span>
                    <span className="value" style={{ color: getAirQualityColor(weather.airQuality.pm25Level) }}>
                      {weather.airQuality.pm25Level}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="label">자외선</span>
                    <span className="value">
                      {weather.uvLevel}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          
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
          <h2 className="section-title">오늘의 서산</h2>
          <div className="task-container">
            <div className="task-header">
              <h3 className="task-title">시민 참여 현황</h3>
              <p className="task-subtitle">서산시민들의 활발한 참여로 만들어가는 더 나은 서산</p>
            </div>

            {taskLoading ? (
              <LoadingStates type="card" />
            ) : taskSummary && (
              <>
                <div className="stats-grid">
                  <div 
                    className={`stat-card dark ${clickedStat === 'projects' ? 'clicked' : ''}`}
                    onClick={() => setClickedStat('projects')}
                    onAnimationEnd={() => setClickedStat(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`프로젝트: ${taskSummary.projects}개`}
                  >
                    <div className="stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM19 19H5V5H7V7H17V5H19V19Z" fill="currentColor" opacity="0.8"/>
                        <path d="M7 10H17V12H7V10ZM7 14H17V16H7V14Z" fill="currentColor" opacity="0.8"/>
                      </svg>
                    </div>
                    <div className="stat-label">진행중인 사업</div>
                    <div className="stat-value counter">{taskSummary.projects}</div>
                  </div>
                  <div 
                    className={`stat-card blue ${clickedStat === 'assigned' ? 'clicked' : ''}`}
                    onClick={() => setClickedStat('assigned')}
                    onAnimationEnd={() => setClickedStat(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`민원 처리중: ${taskSummary.assigned}건`}
                  >
                    <div className="stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" opacity="0.9"/>
                      </svg>
                    </div>
                    <div className="stat-label">민원 처리중</div>
                    <div className="stat-value counter">{taskSummary.assigned}</div>
                  </div>
                  <div 
                    className={`stat-card light ${clickedStat === 'completed' ? 'clicked' : ''}`}
                    onClick={() => setClickedStat('completed')}
                    onAnimationEnd={() => setClickedStat(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`완료됨: ${taskSummary.completed}건`}
                  >
                    <div className="stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#00BFA5"/>
                      </svg>
                    </div>
                    <div className="stat-label">완료됨</div>
                    <div className="stat-value counter">{taskSummary.completed}</div>
                  </div>
                </div>

                <div className="completion-rate">
                  <span className="rate-label">정시 처리율:</span>
                  <div className="rate-info">
                    <span className="rate-value">{formatPercentage(taskSummary.completionRate)}</span>
                    <span className={`rate-change ${taskSummary.changeRate > 0 ? 'positive' : 'negative'}`}>
                      {taskSummary.changeRate > 0 ? '+' : ''}{formatPercentage(taskSummary.changeRate)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {teamLoading ? (
              <LoadingStates type="card" />
            ) : teamOverview && (
              <div className="team-section">
                <div className="team-overview-header">
                  <h3 className="team-title">시민 참여단</h3>
                  <p className="team-subtitle">함께 만들어가는 서산의 미래</p>
                </div>
                <div className="team-stats">
                  <div className="team-stat">
                    <span className="team-stat-label">참여 시민</span>
                    <span className="team-stat-value">{teamOverview.members.length}명</span>
                  </div>
                  <div className="team-stat">
                    <span className="team-stat-label">활동 시간</span>
                    <span className="team-stat-value">{teamOverview.totalHours}시간</span>
                  </div>
                  <div className="team-stat">
                    <span className="team-stat-label">주간 진행률</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${teamOverview.weeklyProgress}%` }} />
                    </div>
                    <span className="team-stat-value">{teamOverview.weeklyProgress}%</span>
                  </div>
                </div>
              </div>
            )}

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
                      <span className="notice-text">{notice.title}</span>
                      <span className="notice-date">{formatDate(notice.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MainContent.displayName = 'MainContent';

export default MainContent;