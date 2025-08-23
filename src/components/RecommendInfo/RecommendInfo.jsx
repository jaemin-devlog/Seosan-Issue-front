import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendInfo.css';
import { seosanAPI, welfareAPI, cultureAPI, naverSearchAPI } from '../../api/backend.api';

// 이미지 파일들 - 없을 경우 대체 처리
let BalloonImage, ArrowImage, LeftArrowImage, RightArrowImage;
try {
  BalloonImage = require('../../assets/이런정보 말풍선.png');
  ArrowImage = require('../../assets/이런정보화살표.png');
  LeftArrowImage = require('../../assets/이런정보왼쪽화살.png');
  RightArrowImage = require('../../assets/이런정보오른쪽화살.png');
} catch (e) {
  // 이미지가 없으면 null 사용
  BalloonImage = null;
  ArrowImage = null;
  LeftArrowImage = null;
  RightArrowImage = null;
}

const RecommendInfo = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  // 실제 탐색 페이지의 데이터를 가져오는 함수
  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      const allData = [];
      
      try {
        // 1. 뉴스 데이터 가져오기 (최신 2개)
        try {
          const newsResult = await naverSearchAPI.search('서산시', 'news', 2);
          if (newsResult && Array.isArray(newsResult)) {
            newsResult.slice(0, 2).forEach((item, idx) => {
              allData.push({
                id: `news-${idx}`,
                tag: '뉴스',
                title: item.title
                  ?.replace(/<[^>]*>/g, '')
                  ?.replace(/&quot;/g, '"')
                  ?.replace(/&amp;/g, '&')
                  ?.replace(/&lt;/g, '<')
                  ?.replace(/&gt;/g, '>')
                  ?.replace(/&#39;/g, "'") || '제목 없음',
                date: item.date || item.pubDate || new Date().toLocaleDateString('ko-KR'),
                description: item.description
                  ?.replace(/<[^>]*>/g, '')
                  ?.replace(/&quot;/g, '"')
                  ?.replace(/&amp;/g, '&')
                  ?.substring(0, 100) || '',
                link: item.link,
                originalData: item
              });
            });
          }
        } catch (e) {
          console.error('뉴스 데이터 가져오기 실패:', e);
        }

        // 2. 복지 데이터 가져오기 (최신 2개)
        try {
          const welfareData = await welfareAPI.getElderly(null, 0, 2);
          if (welfareData && Array.isArray(welfareData)) {
            welfareData.slice(0, 2).forEach((item, idx) => {
              allData.push({
                id: item.id || `welfare-${idx}`,
                tag: '복지',
                title: item.title || '제목 없음',
                date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                description: item.description || '',
                originalData: item
              });
            });
          }
        } catch (e) {
          console.error('복지 데이터 가져오기 실패:', e);
        }

        // 3. 서산시청 공지사항 가져오기 (최신 2개)
        try {
          const noticeData = await seosanAPI.getNotices(null, 0, 2);
          if (noticeData && Array.isArray(noticeData)) {
            noticeData.slice(0, 2).forEach((item, idx) => {
              allData.push({
                id: item.id || `notice-${idx}`,
                tag: '서산시청',
                title: item.title || '제목 없음',
                date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                description: item.description || '',
                originalData: item
              });
            });
          }
        } catch (e) {
          console.error('서산시청 데이터 가져오기 실패:', e);
        }

        // 4. 문화관광 데이터 가져오기 (최신 2개)
        try {
          const cultureData = await cultureAPI.getCultureNews(null, 0, 2);
          if (cultureData && Array.isArray(cultureData)) {
            cultureData.slice(0, 2).forEach((item, idx) => {
              allData.push({
                id: item.id || `culture-${idx}`,
                tag: '문화관광',
                title: item.title || '제목 없음',
                date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                description: item.description || '',
                originalData: item
              });
            });
          }
        } catch (e) {
          console.error('문화관광 데이터 가져오기 실패:', e);
        }

        // 5. 카페 데이터 가져오기 (최신 1개)
        try {
          const cafeResult = await naverSearchAPI.search('서산시', 'cafearticle', 1);
          if (cafeResult && Array.isArray(cafeResult)) {
            cafeResult.slice(0, 1).forEach((item, idx) => {
              allData.push({
                id: `cafe-${idx}`,
                tag: '카페',
                title: item.title
                  ?.replace(/<[^>]*>/g, '')
                  ?.replace(/&quot;/g, '"')
                  ?.replace(/&amp;/g, '&')
                  ?.replace(/&lt;/g, '<')
                  ?.replace(/&gt;/g, '>')
                  ?.replace(/&#39;/g, "'") || '제목 없음',
                date: item.date || item.postdate || new Date().toLocaleDateString('ko-KR'),
                description: item.description
                  ?.replace(/<[^>]*>/g, '')
                  ?.replace(/&quot;/g, '"')
                  ?.replace(/&amp;/g, '&')
                  ?.substring(0, 100) || '',
                link: item.link,
                cafename: item.cafename,
                originalData: item
              });
            });
          }
        } catch (e) {
          console.error('카페 데이터 가져오기 실패:', e);
        }

        // 6. 블로그 데이터 가져오기 (최신 1개)
        try {
          const blogResult = await naverSearchAPI.search('서산시', 'blog', 1);
          if (blogResult && Array.isArray(blogResult)) {
            blogResult.slice(0, 1).forEach((item, idx) => {
              allData.push({
                id: `blog-${idx}`,
                tag: '블로그',
                title: item.title
                  ?.replace(/<[^>]*>/g, '')
                  ?.replace(/&quot;/g, '"')
                  ?.replace(/&amp;/g, '&')
                  ?.replace(/&lt;/g, '<')
                  ?.replace(/&gt;/g, '>')
                  ?.replace(/&#39;/g, "'") || '제목 없음',
                date: item.date || item.postdate || new Date().toLocaleDateString('ko-KR'),
                description: item.description
                  ?.replace(/<[^>]*>/g, '')
                  ?.replace(/&quot;/g, '"')
                  ?.replace(/&amp;/g, '&')
                  ?.substring(0, 100) || '',
                link: item.link,
                bloggername: item.bloggername,
                originalData: item
              });
            });
          }
        } catch (e) {
          console.error('블로그 데이터 가져오기 실패:', e);
        }

        // 데이터가 있으면 설정, 없으면 기본 데이터 사용
        if (allData.length > 0) {
          // 최대 10개만 표시
          setRecommendations(allData.slice(0, 10));
        } else {
          // 기본 데이터
          setRecommendations([
            {
              id: 'default-1',
              tag: '복지',
              title: '2025년 장기요양기관 종사자 역량강화 교육 지방보조금 지원계획',
              date: '접수기간: 2025. 2. 17.(월) - 3. 4.(화)'
            },
            {
              id: 'default-2',
              tag: '서산시청',
              title: '[주간] 홈케어, 이점으로 건강하기키기 기초반',
              date: '교육기간: 2025. 8. 21.(목) - 12. 11.(목)'
            },
            {
              id: 'default-3',
              tag: '뉴스',
              title: '계도 기간 종료, 7월 이후 풍천저수지 낚시 금지 어기 공원으로 조성 중',
              date: '현재 공사 진행중 - 통해 8월 준공 예정'
            }
          ]);
        }
      } catch (error) {
        console.error('데이터 가져오기 전체 실패:', error);
        // 에러 시 기본 데이터 사용
        setRecommendations([
          {
            id: 'default-1',
            tag: '복지',
            title: '2025년 장기요양기관 종사자 역량강화 교육 지방보조금 지원계획',
            date: '접수기간: 2025. 2. 17.(월) - 3. 4.(화)'
          },
          {
            id: 'default-2',
            tag: '서산시청',
            title: '[주간] 홈케어, 이점으로 건강하기키기 기초반',
            date: '교육기간: 2025. 8. 21.(목) - 12. 11.(목)'
          },
          {
            id: 'default-3',
            tag: '뉴스',
            title: '계도 기간 종료, 7월 이후 풍천저수지 낚시 금지 어기 공원으로 조성 중',
            date: '현재 공사 진행중 - 통해 8월 준공 예정'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = 300; // 카드 너비 + gap
    const scrollAmount = cardWidth * 3; // 3개씩 스크롤
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setCurrentIndex(Math.max(0, currentIndex - 3));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setCurrentIndex(Math.min(recommendations.length - 1, currentIndex + 3));
    }
  };

  const handleCardClick = (item) => {
    // Explore 페이지로 이동하면서 상세보기 모드로 설정
    const tabMapping = {
      '뉴스': '뉴스',
      '복지': '복지',
      '서산시청': '서산시청',
      '문화관광': '문화관광',
      '카페': '카페',
      '블로그': '블로그'
    };
    
    const tab = tabMapping[item.tag] || item.tag;
    
    navigate('/explore', { 
      state: { 
        selectedItem: {
          id: item.id,
          title: item.title,
          content: item.description || item.date,
          body: item.description || item.date,
          tag: item.tag,
          date: item.date || new Date().toISOString(),
          type: item.tag,
          link: item.link,
          originalData: item.originalData
        },
        tab: tab,
        view: 'detail',
        scrollToTop: true
      }
    });
  };

  return (
    <div className="recommend-info-container" role="region" aria-label="추천 정보 섹션">
      <div className="recommend-header">
        <h2 className="recommend-title">이런 정보는 어떠세요?</h2>
      </div>

      <div className="recommend-content-wrapper">
        <button 
          className="scroll-button scroll-left"
          onClick={() => handleScroll('left')}
          disabled={currentIndex === 0}
          aria-label="이전 추천 정보 보기"
        >
          {LeftArrowImage ? (
            <img src={LeftArrowImage} alt="이전" className="scroll-arrow-img" />
          ) : (
            <span className="scroll-arrow">‹</span>
          )}
        </button>

        <div className="recommend-cards-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              우리동네 소식을 불러오는 중...
            </div>
          ) : (
            <div 
              className="recommend-cards-scroll" 
              ref={scrollContainerRef}
            >
              {recommendations.map((item) => (
              <div 
                key={item.id} 
                className="recommend-card"
                onClick={() => handleCardClick(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(item);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${item.tag}: ${item.title}`}
              >
                {BalloonImage ? (
                  <div className="recommend-tag-wrapper">
                    <img src={BalloonImage} alt="" className="balloon-bg" />
                    <span className="tag-text">#{item.tag}</span>
                  </div>
                ) : (
                  <div className="recommend-tag">
                    #{item.tag}
                  </div>
                )}
                
                <h3 className="recommend-card-title">
                  {item.title}
                </h3>
                
                <p className="recommend-card-date">
                  {item.date}
                </p>
                
                <div className="recommend-card-footer">
                  {ArrowImage ? (
                    <img src={ArrowImage} alt="더보기" className="card-arrow-img" />
                  ) : (
                    <span className="card-arrow">→</span>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        <button 
          className="scroll-button scroll-right"
          onClick={() => handleScroll('right')}
          disabled={currentIndex >= recommendations.length - 3}
          aria-label="다음 추천 정보 보기"
        >
          {RightArrowImage ? (
            <img src={RightArrowImage} alt="다음" className="scroll-arrow-img" />
          ) : (
            <span className="scroll-arrow">›</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecommendInfo;