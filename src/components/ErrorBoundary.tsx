import React, { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 에러 로깅 서비스에 전송 (예: Sentry)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: {
    //       react: {
    //         componentStack: errorInfo.componentStack
    //       }
    //     }
    //   });
    // }
    
    // 로컬 스토리지에 에러 정보 저장 (개발 환경용)
    if (process.env.NODE_ENV === 'development') {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastError', JSON.stringify(errorData));
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <div className="error-container">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 9V11M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="error-title">앗! 문제가 발생했습니다</h1>
            <p className="error-message">
              {this.state.error?.message === 'Network Error' 
                ? '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.'
                : this.state.error?.message === 'ChunkLoadError'
                ? '페이지를 불러오는 중 문제가 발생했습니다. 페이지를 새로고침해주세요.'
                : '예기치 않은 오류가 발생했습니다. 불편을 드려 죄송합니다.'}
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>오류 상세 정보</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="error-actions">
              <button 
                onClick={this.handleReset}
                className="btn btn-primary"
                aria-label="다시 시도하기"
                autoFocus
              >
                다시 시도하기
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn btn-secondary"
                aria-label="홈으로 돌아가기"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;