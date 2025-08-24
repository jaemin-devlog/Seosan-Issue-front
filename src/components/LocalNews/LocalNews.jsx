import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocalNews.css';
import { naverSearchAPI } from '../../api/backend.api';

// 이미지 파일들
let TitleImage, ArrowImage;
try {
  TitleImage = require('../../assets/우리동네소식이궁금하다면.png');
} catch (e) {
  TitleImage = null;
}
try {
  ArrowImage = require('../../assets/우리동네소식화살표.png');
} catch (e) {
  ArrowImage = null;
}

const LocalNews = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  // 실제 카페/블로그 데이터 가져오기
  useEffect(() => {
    const fetchLocalNews = async () => {
      setLoading(true);
      const cafeItems = [];
      const blogItems = [];
      
      try {
        // 카페 데이터 가져오기 (3개)
        try {
          const cafeResult = await naverSearchAPI.search('서산시', 'cafearticle', 3);
          if (cafeResult && Array.isArray(cafeResult)) {
            cafeResult.forEach((item, idx) => {
              const description = item.description
                ?.replace(/<[^>]*>/g, '')
                ?.replace(/&quot;/g, '"')
                ?.replace(/&amp;/g, '&')
                ?.replace(/&lt;/g, '<')
                ?.replace(/&gt;/g, '>')
                ?.replace(/&#39;/g, "'") || '';
              
              cafeItems.push({
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
                source: description.substring(0, 50) + (description.length > 50 ? '...' : ''),
                footer: item.cafename ? `카페: ${item.cafename}` : '',
                link: item.link,
                originalData: item
              });
            });
          }
        } catch (e) {
          console.error('카페 데이터 가져오기 실패:', e);
        }

        // 블로그 데이터 가져오기 (3개)
        try {
          const blogResult = await naverSearchAPI.search('서산시', 'blog', 3);
          if (blogResult && Array.isArray(blogResult)) {
            blogResult.forEach((item, idx) => {
              const description = item.description
                ?.replace(/<[^>]*>/g, '')
                ?.replace(/&quot;/g, '"')
                ?.replace(/&amp;/g, '&')
                ?.replace(/&lt;/g, '<')
                ?.replace(/&gt;/g, '>')
                ?.replace(/&#39;/g, "'") || '';
              
              blogItems.push({
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
                source: description.substring(0, 50) + (description.length > 50 ? '...' : ''),
                footer: item.bloggername ? `블로거: ${item.bloggername}` : '',
                link: item.link,
                originalData: item
              });
            });
          }
        } catch (e) {
          console.error('블로그 데이터 가져오기 실패:', e);
        }

        // 카페와 블로그 데이터를 번갈아가며 배치
        const alternatingItems = [];
        const maxLength = Math.max(cafeItems.length, blogItems.length);
        
        for (let i = 0; i < maxLength; i++) {
          if (i < cafeItems.length) {
            alternatingItems.push(cafeItems[i]);
          }
          if (i < blogItems.length) {
            alternatingItems.push(blogItems[i]);
          }
        }
        
        if (alternatingItems.length > 0) {
          setNewsItems(alternatingItems);
        } else {
          // 기본 데이터
          setNewsItems([
            {
              id: 'default-1',
              tag: '카페',
              title: '서산시 소식을 검색해보세요',
              date: new Date().toLocaleDateString('ko-KR'),
              source: '카페와 블로그에서',
              footer: '우리동네 소식을 확인해보세요'
            }
          ]);
        }
      } catch (error) {
        console.error('로컬 뉴스 데이터 가져오기 실패:', error);
        // 에러 시 기본 데이터
        setNewsItems([
          {
            id: 'default-1',
            tag: '카페',
            title: '서산시 소식을 검색해보세요',
            date: new Date().toLocaleDateString('ko-KR'),
            source: '카페와 블로그에서',
            footer: '우리동네 소식을 확인해보세요'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalNews();
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  const handleCardClick = (item) => {
    // 링크가 있는 경우 직접 이동
    if (item.link && item.link !== '#') {
      window.open(item.link, '_blank');
    } else {
      // Explore 페이지로 이동하면서 상세보기 모드로 설정
      navigate('/explore', { 
        state: { 
          selectedItem: {
            id: item.id,
            title: item.title,
            content: `${item.source}\n${item.footer}`,
            body: `${item.source}\n${item.footer}`,
            tag: item.tag,
            date: item.date,
            type: item.tag,
            link: item.link,
            originalData: item.originalData
          },
          tab: item.tag,
          view: 'detail',
          scrollToTop: true
        }
      });
    }
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
      </div>

      <div className="local-news-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#666' }}>
            우리동네 카페/블로그 소식을 불러오는 중...
          </div>
        ) : (
          displayedItems.map((item) => (
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
          ))
        )}
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

    </div>
  );
};

export default LocalNews;