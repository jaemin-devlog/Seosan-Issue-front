import React, { useState, useEffect, useCallback } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    // ESC 키로 Toast 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toast.duration, handleDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 10L14.1421 5.85786M10 10L5.85786 14.1421M10 10L14.1421 14.1421M10 10L5.85786 5.85786" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 7V11M10 13H10.01M8.86808 3.5L1.13592 16C0.926813 16.3579 0.818848 16.7656 0.822679 17.1803C0.82651 17.595 0.942009 18.0007 1.15742 18.3551C1.37283 18.7094 1.68073 18.9995 2.04874 19.1946C2.41675 19.3897 2.83184 19.4825 3.25192 19.4643H16.7481C17.1682 19.4825 17.5832 19.3897 17.9513 19.1946C18.3193 18.9995 18.6272 18.7094 18.8426 18.3551C19.058 18.0007 19.1735 17.595 19.1773 17.1803C19.1812 16.7656 19.0732 16.3579 18.8641 16L11.1319 3.5C10.9159 3.15609 10.612 2.87488 10.2502 2.68507C9.88846 2.49527 9.48143 2.40332 9.06912 2.41884C8.65681 2.43436 8.25376 2.55685 7.90254 2.77432C7.55133 2.99179 7.26438 3.29643 7.07 3.65609L8.86808 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 10V14M10 6H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`toast toast-${toast.type} ${isExiting ? 'toast-exit' : ''}`}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <h4 className="toast-title">{toast.title}</h4>
        {toast.message && <p className="toast-message">{toast.message}</p>}
      </div>
      <button 
        className="toast-close"
        onClick={handleDismiss}
        aria-label="닫기"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div 
      className="toast-container" 
      role="region" 
      aria-label="알림"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// Toast 관리를 위한 훅
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, type, title, message, duration };
    setToasts((prev) => {
      // 최대 5개의 Toast만 표시
      const newToasts = [...prev, newToast];
      if (newToasts.length > 5) {
        return newToasts.slice(-5);
      }
      return newToasts;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    showToast('success', title, message);
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast('error', title, message);
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast('warning', title, message);
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast('info', title, message);
  }, [showToast]);

  return {
    toasts,
    showToast,
    dismissToast,
    success,
    error,
    warning,
    info
  };
};

export default Toast;