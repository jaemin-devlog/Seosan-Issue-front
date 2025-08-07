import React from 'react';
import './LoadingStates.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = '로딩 중...' 
}) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className="loading-spinner-wrapper">
        <div className="spinner-circle">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = '문제가 발생했습니다', 
  onRetry 
}) => {
  return (
    <div className="error-state-container">
      <div className="error-content">
        <div className="error-icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 9V11M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="error-title">오류가 발생했습니다</h3>
        <p className="error-message">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="retry-btn"
            aria-label="다시 시도하기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 3.51 15M3.51 9A9 9 0 0 0 20.49 15" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            다시 시도하기
          </button>
        )}
      </div>
    </div>
  );
};

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px', 
  variant = 'rect',
  className = ''
}) => {
  return (
    <div 
      className={`skeleton ${variant} ${className}`}
      style={{ width, height }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card-skeleton">
      <Skeleton width="80px" height="28px" className="mb-16" />
      <Skeleton height="48px" className="mb-12" />
      <Skeleton width="70%" height="20px" />
    </div>
  );
};

export const LoadingDots: React.FC = () => {
  return (
    <div className="loading-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
};

interface LoadingStatesProps {
  type?: 'weather' | 'list' | 'card' | 'article' | 'map';
  message?: string;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({ type = 'card', message }) => {
  const renderLoadingContent = () => {
    switch (type) {
      case 'weather':
        return (
          <div className="loading-weather">
            <Skeleton width="120px" height="60px" className="mb-12" />
            <Skeleton width="180px" height="24px" className="mb-8" />
            <div className="loading-weather-status">
              <Skeleton width="80px" height="20px" />
              <Skeleton width="80px" height="20px" />
              <Skeleton width="80px" height="20px" />
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="loading-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height="48px" className="mb-8" />
            ))}
          </div>
        );
      
      case 'card':
        return <CardSkeleton />;
      
      case 'article':
        return (
          <div className="loading-article">
            <Skeleton width="100%" height="200px" className="mb-12" />
            <Skeleton width="80%" height="24px" className="mb-8" />
            <Skeleton width="100%" height="16px" className="mb-4" />
            <Skeleton width="60%" height="16px" />
          </div>
        );
      
      case 'map':
        return <Skeleton width="100%" height="400px" />;
      
      default:
        return <Skeleton width="100%" height="100px" />;
    }
  };

  return (
    <div className={`loading-states loading-${type}`}>
      {renderLoadingContent()}
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};