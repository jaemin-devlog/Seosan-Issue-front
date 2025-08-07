import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import './InfoSection.css';

const InfoSection: React.FC = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState(new Set<number>());
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const recommendedCards = [
    {
      id: 1,
      tag: '축제',
      tagColor: 'festival',
      title: '제15회 서산 해미읍성\n역사문화축제',
      description: '조선시대 역사와 문화를 체험하는 대표 축제',
      date: '2025. 9. 15.(토) ~ 9. 17.(월)',
      link: '#festival-haemi'
    },
    {
      id: 2,
      tag: '수산물',
      tagColor: 'ocean',
      title: '서산 어리굴젓·새우젓\n축제',
      description: '서산의 특산물 어리굴젓과 새우젓을 만나는 축제',
      date: '2025. 10. 5.(토) ~ 10. 7.(월)',
      link: '#festival-seafood'
    },
    {
      id: 3,
      tag: '문화',
      tagColor: 'heritage',
      title: '서산 마애여래삼존상\n문화제',
      description: '백제의 미소를 간직한 국보 제84호 문화제',
      date: '2025. 5. 15.(목) ~ 5. 18.(일)',
      link: '#festival-buddha'
    },
    {
      id: 4,
      tag: '농산물',
      tagColor: 'harvest',
      title: '서산 6쪽마늘\n축제',
      description: '전국 최고의 품질을 자랑하는 서산 6쪽마늘 축제',
      date: '2025. 6. 20.(금) ~ 6. 22.(일)',
      link: '#festival-garlic'
    },
    {
      id: 5,
      tag: '야간',
      tagColor: 'night',
      title: '서산 빛축제\n루미나리에',
      description: '화려한 빛의 향연이 펼쳐지는 야간 축제',
      date: '2025. 12. 15.(일) ~ 2026. 1. 31.(금)',
      link: '#festival-light'
    }
  ];

  const localNews = useMemo(() => [
    {
      id: 1,
      category: '블로그',
      categoryColor: 'blog',
      title: '가까운 서산 맞춤 추천할게요 저물밑으로.여기는지퍼 짧았지…',
      date: '2025. 07. 31',
      source: '이번고치제고네용\n내용 최대 2줄',
      link: '#'
    },
    {
      id: 2,
      category: '블로그',
      categoryColor: 'blog',
      title: '가까운 서산 맞춤 추천할게요 저물밑으로.여기는지퍼 짧았지…',
      date: '2025. 07. 31',
      source: '이번고치제고네용\n내용 최대 2줄',
      link: '#'
    },
    {
      id: 3,
      category: '가까',
      categoryColor: 'nearby',
      title: '오늘 예전들 동남세!!!',
      date: '2025. 07. 31',
      source: '이번고치제고네용\n내용 최대 2줄',
      link: '#'
    },
    {
      id: 4,
      category: '가까',
      categoryColor: 'nearby',
      title: '오늘 예전들 동남세!!!',
      date: '2025. 07. 31',
      source: '이번고치제고네용\n내용 최대 2줄',
      link: '#'
    }
  ], []);

  // 스크롤 상태 체크 (디바운싱 적용)
  const checkScrollButtons = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    }, 100);
  }, []);

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.getAttribute('data-id') || '0');
            setVisibleCards((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = document.querySelectorAll('.recommended-card, .news-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [isLoading]);

  // 초기 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // 실제 환경에서는 API 호출
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      window.removeEventListener('resize', checkScrollButtons);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [checkScrollButtons]);

  const scrollCards = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 300; // 카드 너비 + gap
      const visibleCards = Math.floor(scrollContainerRef.current.clientWidth / cardWidth);
      const scrollAmount = cardWidth * visibleCards;
      
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  }, []);



  if (error) {
    return (
      <section className="info-section error-state">
        <div className="info-container">
          <div className="error-message">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M12 3L2 20H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              다시 시도
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="info-section" ref={sectionRef} aria-labelledby="info-section-title">
      <div className="info-container">
        {/* 이런 정보는 어떠세요? */}
        <div className="recommended-section">
          <h2 className="section-title" id="info-section-title">이런 정보는 어떠세요?</h2>
          <div className="cards-carousel" role="region" aria-label="추천 정보 슬라이드">
            <button 
              className={`scroll-button left ${canScrollLeft ? 'visible' : ''}`}
              onClick={() => scrollCards('left')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollCards('left'))}
              aria-label="이전 카드 보기"
              aria-disabled={!canScrollLeft}
              tabIndex={canScrollLeft ? 0 : -1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div 
              className="cards-wrapper"
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              role="list"
            >
              {isLoading ? (
                // 스켈레톤 로딩
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="recommended-card skeleton">
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-date"></div>
                  </div>
                ))
              ) : (
                recommendedCards.map((card) => (
                  <article 
                    key={card.id} 
                    className={`recommended-card ${visibleCards.has(card.id) ? 'visible' : ''}`}
                    data-id={card.id}
                    tabIndex={0} 
                    role="listitem"
                    aria-label={`${card.tag} 카테고리: ${card.title}`}
                  >
                    <div className={`card-tag tag-${card.tagColor}`}>
                      <span className="tag-text">{card.tag}</span>
                    </div>
                    
                    
                    <div className="card-content">
                      <h3 className="card-title">{card.title}</h3>
                      <p className="card-description">{card.description}</p>
                      
                      <div className="card-footer">
                        <div className="card-date">{card.date}</div>
                        <button 
                          className="card-arrow" 
                          aria-label={`${card.title} 자세히 보기`}
                          onClick={() => {
                            console.log('Navigate to:', card.link);
                            // 실제 환경에서는 router.push(card.link) 사용
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
            <button 
              className={`scroll-button right ${canScrollRight ? 'visible' : ''}`}
              onClick={() => scrollCards('right')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollCards('right'))}
              aria-label="다음 카드 보기"
              aria-disabled={!canScrollRight}
              tabIndex={canScrollRight ? 0 : -1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 우리동네 소식이 궁금하다면 */}
        <div className="local-news-section">
          <div className="section-header">
            <h2 className="section-title festival-news-title">
              <span className="title-emoji">📰</span>
              축제 소식·이벤트
            </h2>
            <button 
              className="search-button" 
              aria-label="소식 검색하기"
              onClick={() => console.log('Open search')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="news-grid" role="list">
            {isLoading ? (
              // 스켈레톤 로딩
              Array.from({ length: 4 }).map((_, index) => (
                <div key={`news-skeleton-${index}`} className="news-card skeleton">
                  <div className="skeleton-category"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-source"></div>
                </div>
              ))
            ) : (
              localNews.map((news) => (
                <article 
                  key={news.id} 
                  className={`news-card ${visibleCards.has(news.id + 100) ? 'visible' : ''}`}
                  data-id={news.id + 100}
                  tabIndex={0} 
                  role="listitem"
                  aria-label={`${news.category} 카테고리: ${news.title}`}
                >
                  <div className="news-header">
                    <span 
                      className={`news-category category-${news.categoryColor}`}
                    >
                      {news.category}
                    </span>
                  </div>
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-source">{news.source}</p>
                  {news.date && <time className="news-date" dateTime={news.date}>{news.date}</time>}
                  <button 
                    className="news-arrow" 
                    aria-label={`${news.title} 자세히 보기`}
                    onClick={() => {
                      console.log('Navigate to:', news.link);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 3L12 10L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </article>
              ))
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default memo(InfoSection);