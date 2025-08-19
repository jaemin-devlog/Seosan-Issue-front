import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocalNews.css';

// 이미지 파일들
let TitleImage, ArrowImage;
try {
  TitleImage = require('../../assets/우리동네소식이궁금하다면.png');
  ArrowImage = require('../../assets/우리동네화살표.png');
} catch (e) {
  TitleImage = null;
  ArrowImage = null;
}

const LocalNews = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollContainerRef = useRef(null);

  const newsItems = [
    {
      id: 1,
      tag: '카페',
      title: '가까운 서산 맛집 추천할게요 처돌믿으세요..여기는진짜 찐맛집...',
      date: '2025. 07. 31',
      source: '어쩌고저쩌고내용',
      footer: '내용 최대 2줄',
      link: '/explore?tab=카페'
    },
    {
      id: 2,
      tag: '블로그',
      title: '가까운 서산 맛집 추천할게요 처돌믿으세요..여기는진짜 찐맛집...',
      date: '2025. 07. 31',
      source: '어쩌고저쩌고내용',
      footer: '내용 최대 2줄',
      link: '/explore?tab=블로그'
    },
    {
      id: 3,
      tag: '카페',
      title: '오늘 예천동 뜸냄새!!!!',
      date: '2025. 07. 31',
      source: '어쩌고저쩌고내용',
      footer: '내용 최대 2줄',
      link: '/explore?tab=카페'
    },
    {
      id: 4,
      tag: '블로그',
      title: '오늘 예천동 뜸냄새!!!!',
      date: '2025. 07. 31',
      source: '어쩌고저쩌고내용',
      footer: '내용 최대 2줄',
      link: '/explore?tab=블로그'
    },
    {
      id: 5,
      tag: '카페',
      title: '서산 해미읍성 축제 후기',
      date: '2025. 07. 30',
      source: '어쩌고저쩌고내용',
      footer: '내용 최대 2줄',
      link: '/explore?tab=카페'
    },
    {
      id: 6,
      tag: '블로그',
      title: '서산 맛집 투어 일주일 도전',
      date: '2025. 07. 30',
      source: '어쩌고저쩌고내용',
      footer: '내용 최대 2줄',
      link: '/explore?tab=블로그'
    }
  ];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  const handleCardClick = (item) => {
    // Explore 페이지로 이동하면서 상세보기 모드로 설정
    navigate('/explore', { 
      state: { 
        selectedItem: {
          id: item.id,
          title: item.title,
          content: `${item.source}\n${item.footer}`,
          tag: item.tag,
          date: item.date,
          type: item.tag
        },
        tab: item.tag,
        view: 'detail'
      }
    });
  };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const displayedItems = newsItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="local-news-container">
      <div className="local-news-header">
        {TitleImage ? (
          <img src={TitleImage} alt="우리동네 소식이 궁금하다면?" className="local-news-title-img" />
        ) : (
          <h2 className="local-news-title">우리동네 소식이 궁금하다면?</h2>
        )}
        <button className="local-news-search" aria-label="검색">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#2ad0c9" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#2ad0c9" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="local-news-grid">
        {displayedItems.map((item) => (
          <div 
            key={item.id}
            className="local-news-card"
            onClick={() => handleCardClick(item)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(item);
              }
            }}
          >
            <div className={`local-news-tag ${item.tag === '카페' ? 'tag-cafe' : 'tag-blog'}`}>
              {item.tag}
            </div>
            
            <h3 className="local-news-card-title">
              {item.title}
            </h3>
            
            <p className="local-news-date">{item.date}</p>
            
            <div className="local-news-content">
              <p className="local-news-source">{item.source}</p>
              <p className="local-news-footer">{item.footer}</p>
            </div>

            <div className="local-news-arrow">
              {ArrowImage ? (
                <img src={ArrowImage} alt="더보기" className="local-arrow-img" />
              ) : (
                <span className="local-arrow-icon">→</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="local-news-pagination">
        <button 
          className="page-nav-btn"
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 0}
          aria-label="이전 페이지"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>

        <div className="page-indicator">
          <div className="page-bar">
            <div 
              className="page-bar-fill" 
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            />
          </div>
        </div>

        <button 
          className="page-nav-btn"
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages - 1}
          aria-label="다음 페이지"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
      </div>

      {/* 우측 텍스트 */}
      <div className="local-news-sidebar">
        <p>링크, 카페url 빼고 다 추가</p>
      </div>
    </div>
  );
};

export default LocalNews;