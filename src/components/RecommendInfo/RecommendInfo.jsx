import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendInfo.css';
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
  const scrollContainerRef = useRef(null);

  // 추천 정보 데이터
  const recommendations = [
    {
      id: 1,
      tag: '복지',
      title: '2025년 장기요양기관 종사자 역량강화 교육 지방보조금 지원계획',
      date: '접수기간: 2025. 2. 17.(월) - 3. 4.(화)',
      link: '/explore?tab=복지'
    },
    {
      id: 2,
      tag: '서산시청',
      title: '[주간] 홈케어, 이점으로 건강하기키기 기초반',
      date: '교육기간: 2025. 8. 21.(목) - 12. 11.(목)',
      link: '/explore?tab=시청'
    },
    {
      id: 3,
      tag: '뉴스',
      title: '계도 기간 종료, 7월 이후 풍천저수지 낚시 금지 어기 공원으로 조성 중',
      date: '현재 공사 진행중 - 통해 8월 준공 예정',
      link: '/explore?tab=뉴스'
    },
    {
      id: 4,
      tag: '문화소식',
      title: '지역아동센터 (공부방) 지역사회 저소득 아동의 보호·교육 종합적 서비스 제공',
      date: '방과후 돌봄을 필요로 하는 18세미만의 아동',
      link: '/explore?tab=문화'
    },
    {
      id: 5,
      tag: '블로그',
      title: '시설대관 어린이 도서관 [찾아가는 도서관]',
      date: '예약접수: 2025. 07. 14 온라인 예약 / 선착순',
      link: '/explore?tab=블로그'
    },
    {
      id: 6,
      tag: '카페',
      title: '서산 해미읍성 근처 분위기 좋은 카페 추천',
      date: '지역 주민들이 추천하는 핫플레이스',
      link: '/explore?tab=카페'
    },
    {
      id: 7,
      tag: '관광',
      title: '서산 해미읍성 축제 2025 안내',
      date: '축제기간: 2025. 6. 10 - 6. 12',
      link: '/explore?tab=문화'
    }
  ];

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
    navigate('/explore', { 
      state: { 
        selectedItem: {
          id: item.id,
          title: item.title,
          content: item.date,
          tag: item.tag,
          date: new Date().toISOString(),
          type: item.tag
        },
        tab: item.tag,
        view: 'detail'
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