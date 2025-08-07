// ========== ERROR HANDLING SYSTEM ========== //

import { MESSAGES } from '../constants';

// 에러 타입 정의
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTH = 'AUTH',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

// 에러 심각도
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// 확장된 에러 클래스
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly code?: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    code?: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.code = code;
    this.timestamp = new Date();
    this.context = context;

    // TypeScript의 Error 프로토타입 체인 유지
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// 에러 분류 함수
export function classifyError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // 네트워크 에러
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new AppError(
        MESSAGES.ERROR.NETWORK,
        ErrorType.NETWORK,
        ErrorSeverity.HIGH
      );
    }

    // 타임아웃 에러
    if (error.message.includes('timeout')) {
      return new AppError(
        MESSAGES.ERROR.TIMEOUT,
        ErrorType.NETWORK,
        ErrorSeverity.MEDIUM
      );
    }

    // 404 에러
    if (error.message.includes('404') || error.message.includes('not found')) {
      return new AppError(
        MESSAGES.ERROR.NOT_FOUND,
        ErrorType.CLIENT,
        ErrorSeverity.LOW
      );
    }

    // 서버 에러 (5xx)
    if (error.message.includes('500') || error.message.includes('server')) {
      return new AppError(
        MESSAGES.ERROR.SERVER,
        ErrorType.SERVER,
        ErrorSeverity.HIGH
      );
    }
  }

  // 알 수 없는 에러
  return new AppError(
    MESSAGES.ERROR.DEFAULT,
    ErrorType.UNKNOWN,
    ErrorSeverity.MEDIUM
  );
}

// 에러 로깅 함수
export function logError(error: AppError): void {
  const errorLog = {
    timestamp: error.timestamp,
    type: error.type,
    severity: error.severity,
    message: error.message,
    code: error.code,
    context: error.context,
    stack: error.stack,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', errorLog);
  }

  // 프로덕션 환경에서는 에러 추적 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket 등의 서비스에 전송
    // window.Sentry?.captureException(error, { extra: errorLog });
  }

  // 심각한 에러는 로컬 스토리지에 저장
  if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
    try {
      const errors = JSON.parse(localStorage.getItem('app-errors') || '[]');
      errors.push(errorLog);
      // 최대 10개의 에러만 저장
      if (errors.length > 10) {
        errors.shift();
      }
      localStorage.setItem('app-errors', JSON.stringify(errors));
    } catch (e) {
      // 로컬 스토리지 에러는 무시
    }
  }
}

// 에러 복구 전략
export function getRecoveryStrategy(error: AppError): {
  canRetry: boolean;
  retryDelay?: number;
  fallbackAction?: () => void;
} {
  switch (error.type) {
    case ErrorType.NETWORK:
      return {
        canRetry: true,
        retryDelay: 3000,
        fallbackAction: () => {
          // 오프라인 모드 활성화 또는 캐시된 데이터 사용
        },
      };

    case ErrorType.AUTH:
      return {
        canRetry: false,
        fallbackAction: () => {
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        },
      };

    case ErrorType.SERVER:
      return {
        canRetry: true,
        retryDelay: 5000,
      };

    default:
      return {
        canRetry: false,
      };
  }
}

// 전역 에러 핸들러
export function setupGlobalErrorHandler(): void {
  // 처리되지 않은 Promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    const error = classifyError(event.reason);
    logError(error);
    event.preventDefault();
  });

  // 일반적인 JavaScript 에러
  window.addEventListener('error', (event) => {
    const error = classifyError(event.error);
    logError(error);
  });
}