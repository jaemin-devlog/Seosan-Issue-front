import React, { useEffect, useState } from 'react';
import './WeatherSection.css';
import { useApi } from '../hooks';
import { weatherAPI, trendingAPI } from '../services/api';
import { Weather, TrendingTopic, AirQuality } from '../types';
import { LoadingStates } from './LoadingStates';

const WeatherSection: React.FC = () => {
  const { data: weatherData, loading: weatherLoading, error: weatherError } = useApi<Weather>(
    () => weatherAPI.getCurrent()
  );
  
  const { data: trendingData, loading: trendingLoading } = useApi<TrendingTopic[]>(
    () => trendingAPI.getTopics()
  );

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes} 기준`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string): string => {
    const iconMap: Record<string, string> = {
      '맑음': '☀️',
      '구름많음': '⛅',
      '흐림': '☁️',
      '비': '🌧️',
      '눈': '❄️',
      '천둥번개': '⛈️',
      '안개': '🌫️'
    };
    return iconMap[condition] || '🌤️';
  };

  const getAirQualityColor = (level: string): string => {
    const colorMap: Record<string, string> = {
      '좋음': '#4CAF50',
      '보통': '#FF9800',
      '나쁨': '#F44336',
      '매우나쁨': '#880E4F'
    };
    return colorMap[level] || '#757575';
  };

  const getWindDirection = (direction: string): string => {
    const directionMap: Record<string, string> = {
      'N': '북',
      'NE': '북동',
      'E': '동',
      'SE': '남동',
      'S': '남',
      'SW': '남서',
      'W': '서',
      'NW': '북서'
    };
    return directionMap[direction] || direction;
  };

  if (weatherError) {
    return (
      <section className="weather-section">
        <h2 className="weather-section-title">날씨</h2>
        <div className="weather-card">
          <div className="weather-error">
            <span className="error-icon">⚠️</span>
            <p>날씨 정보를 불러올 수 없습니다.</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              다시 시도
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="weather-section" aria-label="날씨 및 트렌딩 정보">
      <h2 className="weather-section-title">날씨</h2>
      
      {weatherLoading ? (
        <LoadingStates type="card" />
      ) : weatherData ? (
        <div className="weather-card" role="region" aria-label="현재 날씨">
          <div className="weather-content">
            <div className="weather-main">
              <div className="temperature" aria-label={`현재 기온 ${weatherData.temperature}도`}>
                {weatherData.temperature}°
              </div>
              <div className="weather-time" aria-label="날씨 상세 정보">
                습도 {weatherData.humidity}% | {getWindDirection(weatherData.windDirection)}풍 {weatherData.windSpeed} m/s
              </div>
              {currentTime && (
                <div className="update-time">{currentTime}</div>
              )}
            </div>
            <div className="weather-icon-container" aria-hidden="true">
              <span className="weather-emoji">{getWeatherIcon(weatherData.condition)}</span>
            </div>
          </div>
          <div className="weather-info">
            <div className="weather-stat">
              <span>{weatherData.condition}</span>
            </div>
            <div className="weather-detail-stats">
              <div className="detail-stat">
                <span className="label">미세먼지</span>
                <span 
                  className="value" 
                  style={{ color: getAirQualityColor(weatherData.airQuality.pm10Level) }}
                >
                  {weatherData.airQuality.pm10Level}
                </span>
              </div>
              <div className="detail-stat">
                <span className="label">초미세먼지</span>
                <span 
                  className="value"
                  style={{ color: getAirQualityColor(weatherData.airQuality.pm25Level) }}
                >
                  {weatherData.airQuality.pm25Level}
                </span>
              </div>
              <div className="detail-stat">
                <span className="label">자외선</span>
                <span className="value">{weatherData.uvLevel}</span>
              </div>
              <div className="detail-stat">
                <span className="label">체감온도</span>
                <span className="value">{weatherData.feelsLike}°</span>
              </div>
            </div>
          </div>
          <div className="weather-forecast">
            <div className="forecast-item">
              <span className="forecast-label">최고</span>
              <span className="forecast-value">{weatherData.maxTemp}°</span>
            </div>
            <div className="forecast-divider" aria-hidden="true">/</div>
            <div className="forecast-item">
              <span className="forecast-label">최저</span>
              <span className="forecast-value">{weatherData.minTemp}°</span>
            </div>
          </div>
        </div>
      ) : null}
      
      <div className="trending-card" role="region" aria-label="트렌딩 토픽">
        <h3 className="trending-title">🔥 실시간 트렌딩</h3>
        {trendingLoading ? (
          <LoadingStates type="list" />
        ) : trendingData && trendingData.length > 0 ? (
          <div className="trending-list">
            {trendingData.slice(0, 7).map((topic) => (
              <button
                key={topic.id}
                className="trending-item"
                onClick={() => console.log(`Clicked: ${topic.label}`)}
                aria-label={`${topic.rank}위 ${topic.label} ${topic.isNew ? '신규' : ''}`}
              >
                <span className="trending-rank">{topic.rank}</span>
                <span className="trending-label">{topic.label}</span>
                {topic.isNew && <span className="trending-new">new</span>}
                {topic.change && (
                  <span className={`trending-change ${topic.change > 0 ? 'up' : 'down'}`}>
                    {topic.change > 0 ? '▲' : '▼'} {Math.abs(topic.change)}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="trending-empty">
            <p>트렌딩 데이터가 없습니다.</p>
          </div>
        )}
        <button className="trending-more-btn" aria-label="더 많은 트렌딩 보기">
          더보기 →
        </button>
      </div>
    </section>
  );
};

export default WeatherSection;