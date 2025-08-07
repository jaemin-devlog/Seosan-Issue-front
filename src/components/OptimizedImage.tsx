import React, { useState, useEffect, useRef } from 'react';
import { LoadingStates } from './LoadingStates';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes,
  srcSet,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect width="1" height="1" fill="%23f0f0f0"/%3E%3C/svg%3E',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer로 뷰포트 진입 감지
  useEffect(() => {
    if (loading !== 'lazy' || !imgRef.current) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // 100px 전에 미리 로드 시작
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.(new Error(`Failed to load image: ${src}`));
  };

  // 실제 이미지 소스
  const imageSrc = isIntersecting ? src : placeholder;

  return (
    <div 
      className={`optimized-image-wrapper ${className}`}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
    >
      {/* 로딩 상태 */}
      {!isLoaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(240, 240, 240, 0.8)',
          }}
        >
          <LoadingStates type="card" />
        </div>
      )}

      {/* 에러 상태 */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(240, 240, 240, 0.8)',
            color: '#666',
            fontSize: '14px',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 10px' }}>
              <path 
                d="M12 9V11M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <p>이미지를 불러올 수 없습니다</p>
          </div>
        </div>
      )}

      {/* 실제 이미지 */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        srcSet={srcSet}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
};

export default OptimizedImage;