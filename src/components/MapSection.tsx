import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import './MapSection.css';
import { MapPin, Calendar, Users, Mountain, Waves, TreePalm, Sparkles, Trees, ChevronLeft, ChevronRight } from 'lucide-react';

interface Festival {
  readonly month: string;
  readonly name: string;
  readonly description: string;
  readonly details: ReadonlyArray<{
    readonly icon: React.ElementType;
    readonly text: string;
  }>;
  readonly location: {
    readonly x: string;
    readonly y: string;
  };
}


interface Experience {
  readonly icon: React.ElementType;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly position: {
    readonly x: string;
    readonly y: string;
  };
}

interface MapSectionProps {
  readonly className?: string;
}


const FESTIVALS: ReadonlyArray<Festival> = [
  {
    month: '4월',
    name: '해미벚꽃축제',
    description: '해미천을 따라 흐드러진 벚꽃과 다리가 어우러진 풍경으로 오작교를 떠올리게 하는 낭만을 자아냅니다.',
    details: [
      { icon: Calendar, text: '매년 4월경' },
      { icon: MapPin, text: '서산시 해미면 해미천 일원' },
      { icon: Users, text: '찾아가는 거리음악회, 농특산물 판매, 야간공연 등' }
    ],
    location: { x: '65%', y: '55%' }
  },
  {
    month: '6월',
    name: '서산해미읍성축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '매년 6월경' },
      { icon: MapPin, text: '서산시 해미읍성 일원' },
      { icon: Users, text: '전통 무예 시연, 역사 체험, 먹거리 장터' }
    ],
    location: { x: '68%', y: '52%' }
  },
  {
    month: '10월',
    name: '서산국화축제',
    description: '가을의 정취를 만끽할 수 있는 서산국화축제는 다양한 국화 전시와 함께 문화공연이 펼쳐집니다.',
    details: [
      { icon: Calendar, text: '매년 10월경' },
      { icon: MapPin, text: '서산시 음암면 탑곡리' },
      { icon: Sparkles, text: '국화 전시, 문화공연, 체험 프로그램' }
    ],
    location: { x: '45%', y: '40%' }
  }
] as const;

const EXPERIENCES: ReadonlyArray<Experience> = [
  {
    icon: Mountain,
    title: '용현리 마애여래삼존상',
    description: '백제의 미소를 간직한 국보 제84호',
    location: '용현리',
    position: { x: '35%', y: '65%' }
  },
  {
    icon: Waves,
    title: '가로림만 갯벌 체험',
    description: '서해안 최대의 내만 갯벌 생태 체험',
    location: '가로림만',
    position: { x: '25%', y: '35%' }
  },
  {
    icon: TreePalm,
    title: '팜카밀레 허브농원',
    description: '200여 종의 허브와 함께하는 힐링',
    location: '팔봉면',
    position: { x: '75%', y: '70%' }
  }
] as const;

const MapSection: React.FC<MapSectionProps> = memo(({ className }) => {
  const [activeTab, setActiveTab] = useState<'festival' | 'experience'>('festival');
  const [currentFestivalIndex, setCurrentFestivalIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [focusedMarkerId, setFocusedMarkerId] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoized computations
  const currentFestival = useMemo(() => FESTIVALS[currentFestivalIndex], [currentFestivalIndex]);
  
  // Optimized callbacks with advanced UX patterns
  const handleTabChange = useCallback((tab: 'festival' | 'experience') => {
    if (tab !== activeTab) {
      // Clear any hover states when switching tabs for clean transition
      setHoveredMarkerId(null);
      setFocusedMarkerId(null);
      
      // Add micro-delay for smooth visual transition
      const tabElement = document.querySelector(`.final-tab[aria-pressed="false"]`);
      if (tabElement) {
        tabElement.classList.add('switching');
        setTimeout(() => {
          tabElement.classList.remove('switching');
        }, 300);
      }
      
      setActiveTab(tab);
    }
  }, [activeTab]);

  const handlePrevFestival = useCallback(() => {
    // Add smooth transition effect
    const currentMarker = document.querySelector('.final-marker.active');
    if (currentMarker) {
      currentMarker.classList.add('transitioning-out');
      setTimeout(() => {
        currentMarker?.classList.remove('transitioning-out');
      }, 200);
    }
    
    setCurrentFestivalIndex((prev: number) => prev > 0 ? prev - 1 : FESTIVALS.length - 1);
  }, []);

  const handleNextFestival = useCallback(() => {
    // Add smooth transition effect
    const currentMarker = document.querySelector('.final-marker.active');
    if (currentMarker) {
      currentMarker.classList.add('transitioning-out');
      setTimeout(() => {
        currentMarker?.classList.remove('transitioning-out');
      }, 200);
    }
    
    setCurrentFestivalIndex((prev: number) => (prev + 1) % FESTIVALS.length);
  }, []);


  const handleFestivalDotClick = useCallback((index: number) => {
    if (index !== currentFestivalIndex) {
      setCurrentFestivalIndex(index);
    }
  }, [currentFestivalIndex]);

  const handleMapLoad = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setLoadingState('loaded');
    setIsMapLoaded(true);
    setRetryCount(0);
  }, []);

  const handleMapError = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    if (retryCount < 3) {
      console.warn(`Map image failed to load, retrying... (${retryCount + 1}/3)`);
      setRetryCount(prev => prev + 1);
      setLoadingState('loading');
      
      // Retry after a delay
      setTimeout(() => {
        const img = document.querySelector('.map-image-final') as HTMLImageElement;
        if (img) {
          img.src = img.src + '?retry=' + (retryCount + 1);
        }
      }, 1000 * (retryCount + 1));
    } else {
      console.error('Map image failed to load after 3 retries');
      setLoadingState('error');
      setIsMapLoaded(true); // Still show interface
    }
  }, [retryCount]);

  const handleRetryLoad = useCallback(() => {
    setLoadingState('loading');
    setRetryCount(0);
    const img = document.querySelector('.map-image-final') as HTMLImageElement;
    if (img) {
      img.src = img.src.split('?')[0] + '?retry=' + Date.now();
    }
  }, []);

  // Marker interaction handlers
  const handleMarkerMouseEnter = useCallback((markerId: string) => {
    setHoveredMarkerId(markerId);
  }, []);

  const handleMarkerMouseLeave = useCallback(() => {
    setHoveredMarkerId(null);
  }, []);

  const handleMarkerFocus = useCallback((markerId: string) => {
    setFocusedMarkerId(markerId);
  }, []);

  const handleMarkerBlur = useCallback(() => {
    setFocusedMarkerId(null);
  }, []);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-slide with proper cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFestivalIndex((prev: number) => (prev + 1) % FESTIVALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Optimized parallax effect with debouncing
  useEffect(() => {
    let animationFrameId: number;
    let isProcessing = false;

    const handleMouseMove = (e: Event) => {
      if (isProcessing) return;
      
      const mouseEvent = e as MouseEvent;
      const mapContainer = document.querySelector('.final-map-container');
      if (!mapContainer) return;

      isProcessing = true;
      animationFrameId = requestAnimationFrame(() => {
        try {
          const rect = mapContainer.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const deltaX = (mouseEvent.clientX - centerX) / rect.width;
          const deltaY = (mouseEvent.clientY - centerY) / rect.height;
          
          const parallaxElements = mapContainer.querySelectorAll('.final-marker, .final-exp-marker, .tree-icon, .mountain-icon');
          
          parallaxElements.forEach((element, index) => {
            const intensity = (index % 3 + 1) * 1.5; // Reduced intensity for smoother movement
            const translateX = deltaX * intensity;
            const translateY = deltaY * intensity;
            
            const htmlElement = element as HTMLElement;
            const currentTransform = htmlElement.style.transform.replace(/translate\([^)]*\)/g, '');
            htmlElement.style.transform = `${currentTransform} translate(${translateX}px, ${translateY}px)`;
          });
        } catch (error) {
          console.warn('Parallax effect error:', error);
        } finally {
          isProcessing = false;
        }
      });
    };

    const handleMouseLeave = () => {
      const mapContainer = document.querySelector('.final-map-container');
      if (!mapContainer) return;

      const parallaxElements = mapContainer.querySelectorAll('.final-marker, .final-exp-marker, .tree-icon, .mountain-icon');
      parallaxElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.transform = htmlElement.style.transform.replace(/translate\([^)]*\)/g, '');
      });
    };

    const mapContainer = document.querySelector('.final-map-container');
    if (mapContainer) {
      mapContainer.addEventListener('mousemove', handleMouseMove, { passive: true });
      mapContainer.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mapContainer) {
        mapContainer.removeEventListener('mousemove', handleMouseMove);
        mapContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // State persistence
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('seosan-map-state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.activeTab && ['festival', 'experience'].includes(parsedState.activeTab)) {
          setActiveTab(parsedState.activeTab);
        }
        if (typeof parsedState.currentFestivalIndex === 'number' && 
            parsedState.currentFestivalIndex >= 0 && 
            parsedState.currentFestivalIndex < FESTIVALS.length) {
          setCurrentFestivalIndex(parsedState.currentFestivalIndex);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved map state:', error);
    }
  }, []);

  // Save state changes
  useEffect(() => {
    if (isInitialized) {
      try {
        const stateToSave = {
          activeTab,
          currentFestivalIndex,
          timestamp: Date.now()
        };
        localStorage.setItem('seosan-map-state', JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Failed to save map state:', error);
      }
    }
  }, [activeTab, currentFestivalIndex, isInitialized]);

  // Advanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events when section is visible
      if (!isVisible) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (activeTab === 'festival') {
            e.preventDefault();
            handlePrevFestival();
          }
          break;
        case 'ArrowRight':
          if (activeTab === 'festival') {
            e.preventDefault();
            handleNextFestival();
          }
          break;
        case 'Tab':
          if (e.shiftKey) {
            handleTabChange('festival');
          } else {
            handleTabChange('experience');
          }
          break;
        case '1':
        case '2':
        case '3':
          if (activeTab === 'festival') {
            const index = parseInt(e.key) - 1;
            if (index >= 0 && index < FESTIVALS.length) {
              e.preventDefault();
              handleFestivalDotClick(index);
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, activeTab, handlePrevFestival, handleNextFestival, handleTabChange, handleFestivalDotClick]);

  // Component initialization with advanced loading
  useEffect(() => {
    setLoadingState('loading');
    
    // Set a timeout for loading state
    loadingTimeoutRef.current = setTimeout(() => {
      setLoadingState('error');
      console.warn('Map loading timeout');
    }, 10000); // 10 second timeout
    
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []); // Remove loadingState dependency to avoid infinite loop

  // Performance monitoring and memory management
  useEffect(() => {
    let startTime = performance.now();
    
    const measurePerformance = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) { // Log if render takes more than 100ms
        console.warn(`MapSection render took ${renderTime.toFixed(2)}ms`);
      }
    };

    // Measure performance after initial render
    const measureTimer = setTimeout(measurePerformance, 0);
    
    return () => {
      clearTimeout(measureTimer);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Cleanup any remaining event listeners or intervals
      setHoveredMarkerId(null);
      setFocusedMarkerId(null);
    };
  }, []);

  return (
    <section className={`map-section-final ${isVisible ? 'visible' : ''}`} ref={sectionRef} aria-label="서산 축제 및 체험 지도">
      {/* Wave Background */}
      <div className="final-background">
        <div className="wave-background" />
        <div className="wave-layer-1" />
        <div className="wave-layer-2" />
      </div>

      {/* Main Container */}
      <div className="final-container">
        {/* Tab Navigation - Top Left */}
        <div className="final-tabs">
          <button 
            className={`final-tab ${activeTab === 'festival' ? 'active' : ''}`}
            onClick={() => handleTabChange('festival')}
            aria-pressed={activeTab === 'festival'}
            aria-label="서산 축제 탭"
          >
            <span className="tab-label">서산 축제</span>
          </button>
          <button 
            className={`final-tab ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => handleTabChange('experience')}
            aria-pressed={activeTab === 'experience'}
            aria-label="서산 체험 탭"
          >
            <span className="tab-label">서산 체험</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="final-content">
          {/* Left Info Panel */}
          <div className="left-panel">
            <div className="final-info-panel">
              {activeTab === 'festival' && (
                <div className="festival-panel-content">
                  {/* Festival Image */}
                  <div className="festival-image-container">
                    <img src="/images/벚꽃.png" alt="해미벚꽃축제 풍경" className="festival-main-image" />
                  </div>
                  
                  <div className="festival-badge-container">
                    <span className="festival-title-badge">{currentFestival.month} {currentFestival.name}</span>
                  </div>
                  
                  <p className="festival-description-final">
                    {currentFestival.description}
                  </p>
                  
                  <div className="festival-details-final">
                    {currentFestival.details.map((detail, index) => {
                      const IconComponent = detail.icon;
                      return (
                        <div key={index} className="detail-row-final">
                          <div className="detail-icon-container">
                            <IconComponent className="detail-icon-final" size={20} />
                          </div>
                          <div className="detail-content-final">
                            <span className="detail-label-final">
                              {index === 0 ? '개최일' : index === 1 ? '장소' : '주요'}
                            </span>
                            <span className="detail-value-final">{detail.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="festival-nav-final">
                    <div className="nav-controls">
                      <button className="nav-arrow prev" onClick={handlePrevFestival} aria-label="이전 축제 보기">
                        <ChevronLeft size={20} />
                      </button>
                      <div className="nav-counter">
                        <span className="current">{currentFestivalIndex + 1}</span>
                        <span className="divider">/</span>
                        <span className="total">{FESTIVALS.length}</span>
                      </div>
                      <button className="nav-arrow next" onClick={handleNextFestival} aria-label="다음 축제 보기">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Floating Petals */}
                  <div className="panel-petals">
                    <div className="floating-petal" style={{ top: '0', left: '0' }} />
                    <div className="floating-petal" style={{ top: '20px', right: '10px', animationDelay: '2s' }} />
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="experience-panel-content">
                  <h2 className="experience-title-final">
                    자연과 함께하는
                    <span className="title-highlight"> 특별한 여행</span>
                  </h2>
                  
                  <div className="experience-cards-final">
                    {EXPERIENCES.map((exp, index) => {
                      const Icon = exp.icon;
                      return (
                        <div key={`exp-card-${index}`} className="exp-card-final">
                          <div className="exp-icon-final">
                            <Icon size={24} aria-hidden="true" />
                          </div>
                          <div className="exp-content-final">
                            <h3>{exp.title}</h3>
                            <p>{exp.description}</p>
                            <span className="exp-location-tag">{exp.location}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Map */}
          <div className="center-map">
            <div className="final-map-container">
              <div className="map-frame">
{loadingState === 'loading' && (
                  <div className="map-loading-overlay">
                    <div className="loading-spinner">
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                    </div>
                    <p className="loading-text">
                      {retryCount > 0 ? `재시도 중... (${retryCount}/3)` : '지도를 불러오는 중...'}
                    </p>
                  </div>
                )}
                
                {loadingState === 'error' && (
                  <div className="map-error-overlay">
                    <div className="error-icon">⚠️</div>
                    <p className="error-text">지도를 불러올 수 없습니다</p>
                    <button 
                      className="retry-button"
                      onClick={handleRetryLoad}
                      aria-label="지도 다시 불러오기"
                    >
                      다시 시도
                    </button>
                  </div>
                )}
                <img 
                  src="/images/지도.png" 
                  alt="서산시 전체 지도. 축제 및 체험 장소가 표시되어 있습니다" 
                  className={`map-image-final ${isMapLoaded ? 'loaded' : 'loading'}`}
                  onLoad={handleMapLoad}
                  onError={handleMapError}
                />
                
                {/* Map Highlight Overlay */}
                <div className="map-highlight-overlay">
                  {activeTab === 'festival' && FESTIVALS.map((festival, index) => (
                    <div
                      key={`highlight-${index}`}
                      className={`region-highlight ${index === currentFestivalIndex ? 'active' : ''}`}
                      style={{
                        left: festival.location.x,
                        top: festival.location.y,
                        width: '120px',
                        height: '120px'
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                
                
                {/* Map Decorations */}
                <div className="map-tree-icons">
                  <Trees className="tree-icon" style={{ top: '20%', left: '30%' }} />
                  <Mountain className="mountain-icon" style={{ top: '15%', right: '25%' }} />
                  <Trees className="tree-icon" style={{ bottom: '30%', left: '15%' }} />
                  <Mountain className="mountain-icon" style={{ bottom: '40%', right: '35%' }} />
                  <Trees className="tree-icon" style={{ top: '60%', right: '20%' }} />
                </div>
                
                {/* Festival Markers */}
                {activeTab === 'festival' && FESTIVALS.map((festival, index) => {
                  const markerId = `festival-${index}`;
                  const isActive = index === currentFestivalIndex;
                  const isHovered = hoveredMarkerId === markerId;
                  const isFocused = focusedMarkerId === markerId;
                  const shouldShowLabel = isActive || isHovered || isFocused;
                  
                  return (
                    <button 
                      key={markerId}
                      className={`final-marker ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''} ${isFocused ? 'focused' : ''}`}
                      style={{ 
                        left: festival.location.x, 
                        top: festival.location.y,
                        zIndex: isActive ? 100 : (isHovered || isFocused) ? 50 : 10
                      }}
                      onClick={() => handleFestivalDotClick(index)}
                      onMouseEnter={() => handleMarkerMouseEnter(markerId)}
                      onMouseLeave={handleMarkerMouseLeave}
                      onFocus={() => handleMarkerFocus(markerId)}
                      onBlur={handleMarkerBlur}
                      aria-label={`${festival.name} (${festival.month}) 마커`}
                      aria-pressed={isActive}
                    >
                      <div className="marker-pin">
                        <div className="pin-head" />
                        <div className="pin-center" />
                      </div>
                      <div className={`marker-label-final ${shouldShowLabel ? 'visible' : 'hidden'}`}>
                        <div className="festival-name">{festival.name}</div>
                        <div className="festival-month">{festival.month}</div>
                      </div>
                    </button>
                  );
                })}

                {/* Experience Markers */}
                {activeTab === 'experience' && EXPERIENCES.map((exp, index) => {
                  const Icon = exp.icon;
                  const markerId = `experience-${index}`;
                  const isHovered = hoveredMarkerId === markerId;
                  const isFocused = focusedMarkerId === markerId;
                  const shouldShowLabel = isHovered || isFocused;
                  
                  return (
                    <button 
                      key={markerId}
                      className={`final-exp-marker ${isHovered ? 'hovered' : ''} ${isFocused ? 'focused' : ''}`}
                      style={{ 
                        left: exp.position.x, 
                        top: exp.position.y,
                        zIndex: (isHovered || isFocused) ? 30 : 15
                      }}
                      onMouseEnter={() => handleMarkerMouseEnter(markerId)}
                      onMouseLeave={handleMarkerMouseLeave}
                      onFocus={() => handleMarkerFocus(markerId)}
                      onBlur={handleMarkerBlur}
                      aria-label={`${exp.title} - ${exp.location}`}
                    >
                      <div className="exp-marker-icon">
                        <Icon size={16} aria-hidden="true" />
                      </div>
                      <span className={`exp-marker-name ${shouldShowLabel ? 'visible' : 'hidden'}`}>
                        {exp.location}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Area - Title and Character */}
          <div className="right-area">
            <div className="final-header">
              <img 
                src="/images/Group 341.png" 
                alt="마을 구석구석, 서산 정복하기! 타이틀" 
                className="final-title-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

MapSection.displayName = 'MapSection';

// Error Boundary Component
class MapSectionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MapSection Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="map-section-error" role="alert" aria-live="polite">
          <div className="error-container">
            <h2>지도를 불러오는 중 오류가 발생했습니다</h2>
            <p>페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
            <button 
              onClick={() => window.location.reload()}
              className="error-reload-btn"
            >
              새로고침
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

// Wrapped component with error boundary
const MapSectionWithErrorBoundary: React.FC<MapSectionProps> = (props) => (
  <MapSectionErrorBoundary>
    <MapSection {...props} />
  </MapSectionErrorBoundary>
);

export default MapSectionWithErrorBoundary;