import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Package, Calendar, FileText } from 'lucide-react';
import './ContentStats.css';

const ContentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://34.64.60.156:8083/flask/content_stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching content stats:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
    // 5분마다 업데이트
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="content-stats-container">
        <div className="stats-loading">
          <div className="loading-spinner"></div>
          <span>통계 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-stats-container">
        <div className="stats-error">
          <span>통계를 불러올 수 없습니다</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const isPositiveGrowth = stats.percentage_increase_from_yesterday > 0;
  const growthIcon = isPositiveGrowth ? TrendingUp : TrendingDown;
  const GrowthIcon = growthIcon;

  return (
    <div className="content-stats-container">
      <div className="stats-header">
        <BarChart3 className="header-icon" size={24} />
        <h2 className="stats-title">서산 콘텐츠 통계</h2>
      </div>
      
      <div className="stats-grid">
        {/* 총 콘텐츠 수 */}
        <div className="stat-card total">
          <div className="stat-icon-wrapper">
            <Package className="stat-icon" size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">전체 콘텐츠</div>
            <div className="stat-value">{stats.total_content_count.toLocaleString()}</div>
            <div className="stat-unit">개</div>
          </div>
        </div>

        {/* 오늘 수집된 콘텐츠 */}
        <div className="stat-card today">
          <div className="stat-icon-wrapper">
            <Calendar className="stat-icon" size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">오늘 수집</div>
            <div className="stat-value">{stats.today_collected_count.toLocaleString()}</div>
            <div className="stat-unit">개</div>
          </div>
        </div>

        {/* 어제 수집된 콘텐츠 */}
        <div className="stat-card yesterday">
          <div className="stat-icon-wrapper">
            <FileText className="stat-icon" size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">어제 수집</div>
            <div className="stat-value">{stats.yesterday_collected_count.toLocaleString()}</div>
            <div className="stat-unit">개</div>
          </div>
        </div>

        {/* 증감률 */}
        <div className={`stat-card growth ${isPositiveGrowth ? 'positive' : 'negative'}`}>
          <div className="stat-icon-wrapper">
            <GrowthIcon className="stat-icon" size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">전일 대비</div>
            <div className="stat-value">
              {Math.abs(stats.percentage_increase_from_yesterday).toFixed(1)}%
            </div>
            <div className="stat-trend">
              {isPositiveGrowth ? '증가' : '감소'}
            </div>
          </div>
        </div>
      </div>

      <div className="stats-footer">
        <span className="update-text">5분마다 자동 업데이트</span>
      </div>
    </div>
  );
};

export default ContentStats;