import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Calendar, ExternalLink } from 'lucide-react';
import './ExplorePage.css';

interface Region {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  region: string;
  category: string;
}

type MainCategory = '뉴스' | '복지' | '문화소식' | '서산시청' | '카페' | '블로그';

const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const regionFromUrl = searchParams.get('region');
  
  const [selectedRegion, setSelectedRegion] = useState<string>(regionFromUrl || '대산읍');
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>('뉴스');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('교육');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<MainCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const regions: Region[] = [
    { id: '1', name: '대산읍' },
    { id: '2', name: '지곡면' },
    { id: '3', name: '팔봉면' },
    { id: '4', name: '성연면' },
    { id: '5', name: '음암면' },
    { id: '6', name: '운산면' },
    { id: '7', name: '부춘동' },
    { id: '8', name: '동문1동' },
    { id: '9', name: '동문2동' },
    { id: '10', name: '수석동' },
    { id: '11', name: '인지면' },
    { id: '12', name: '석남동' },
    { id: '13', name: '부석면' },
    { id: '14', name: '고북면' },
  ];

  const categorySubItems: Record<MainCategory, SubCategory[]> = {
    '뉴스': [
      { id: '1', name: '정치 / 지방자치' },
      { id: '2', name: '교육' },
      { id: '3', name: '사회' },
      { id: '4', name: '민원안내' },
      { id: '5', name: '행정서비스' },
    ],
    '복지': [
      { id: '1', name: '노인복지' },
      { id: '2', name: '장애인복지' },
      { id: '3', name: '아동복지' },
      { id: '4', name: '가족지원' },
    ],
    '문화소식': [
      { id: '1', name: '공연/전시' },
      { id: '2', name: '축제' },
      { id: '3', name: '문화강좌' },
      { id: '4', name: '체육행사' },
    ],
    '서산시청': [
      { id: '1', name: '공지사항' },
      { id: '2', name: '보도자료' },
      { id: '3', name: '입찰정보' },
      { id: '4', name: '채용정보' },
    ],
    '카페': [
      { id: '1', name: '맛집' },
      { id: '2', name: '카페' },
      { id: '3', name: '모임' },
    ],
    '블로그': [
      { id: '1', name: '일상' },
      { id: '2', name: '여행' },
      { id: '3', name: '맛집탐방' },
    ]
  };

  const mainCategories: MainCategory[] = ['뉴스', '복지', '문화소식', '서산시청', '카페', '블로그'];
  
  // 더미 뉴스 데이터
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: '아동 청소년을 위한 청소년 수련관 운영',
      excerpt: '청소년활동진흥법의 규정에 따라 청소년활동을 직극적으로 진흥하기 위해 다양한 수련거리를 실시할 수 있도록 청소년수련관을 운영하고자 ㅇㅇ에 위치한 ...',
      date: '2일 전',
      region: '대산읍',
      category: '교육'
    },
    {
      id: '2',
      title: '2024년 상반기 초등돌봄교실 운영 안내',
      excerpt: '맞벌이 가정 자녀의 안전한 돌봄을 위해 초등학교 돌봄교실을 운영합니다. 신청기간은 2월 1일부터 2월 15일까지이며 ...',
      date: '3일 전',
      region: '대산읍',
      category: '교육'
    },
    {
      id: '3',
      title: '아동 청소년을 위한 청소년 수련관 운영',
      excerpt: '청소년활동진흥법의 규정에 따라 청소년활동을 직극적으로 진흥하기 위해 다양한 수련거리를 실시할 수 있도록 청소년수련관을 운영하고자 ㅇㅇ에 위치한 ...',
      date: '5일 전',
      region: '대산읍',
      category: '교육'
    },
    {
      id: '4',
      title: '지역 도서관 디지털 교육 프로그램 개설',
      excerpt: '4차 산업혁명 시대에 맞춰 지역 주민들의 디지털 역량 강화를 위한 교육 프로그램을 개설합니다. 코딩, AI, 빅데이터 등 ...',
      date: '1주일 전',
      region: '대산읍',
      category: '교육'
    }
  ];

  // URL 파라미터 변경 감지 및 스크롤 최상단 이동
  useEffect(() => {
    const regionFromUrl = searchParams.get('region');
    if (regionFromUrl && regionFromUrl !== selectedRegion) {
      setSelectedRegion(regionFromUrl);
      // 페이지 상단으로 부드럽게 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams, selectedRegion]);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category: MainCategory) => {
    if (['뉴스', '복지', '문화소식'].includes(category)) {
      if (categoryDropdownOpen === category) {
        setCategoryDropdownOpen(null);
      } else {
        setCategoryDropdownOpen(category);
        setSelectedCategory(category);
        setSelectedSubCategory(categorySubItems[category][0].name);
      }
    } else {
      setSelectedCategory(category);
      setCategoryDropdownOpen(null);
    }
  };

  const handleSubCategorySelect = (category: MainCategory, subCategory: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(subCategory);
    setCategoryDropdownOpen(null);
  };

  return (
    <div className="explore-page">
      {/* 카테고리 바 */}
      <div className="category-bar-container">
        <nav className="category-bar" ref={dropdownRef}>
        {mainCategories.map(category => (
          <div key={category} className="category-item-wrapper">
            <button
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
              {['뉴스', '복지', '문화소식'].includes(category) && (
                <ChevronDown 
                  className={`category-icon ${categoryDropdownOpen === category ? 'rotate' : ''}`}
                />
              )}
            </button>
            
            {/* 드롭다운 메뉴 */}
            {categoryDropdownOpen === category && (
              <div className="category-dropdown">
                {categorySubItems[category].map(subItem => (
                  <button
                    key={subItem.id}
                    className={`dropdown-item ${selectedSubCategory === subItem.name ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubCategorySelect(category, subItem.name);
                    }}
                  >
                    {subItem.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        </nav>
      </div>

      <div className="explore-content">
        {/* 지역 사이드바 */}
        <aside className="explore-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-logo">지역</h2>
          </div>

          {/* 선택된 지역 표시 */}
          <div className="selected-region-container">
            <button className="selected-region-btn">
              <span className="region-label">{selectedRegion}</span>
            </button>
          </div>

          {/* 지역 목록 */}
          <nav className="region-nav">
            <ul className="region-list">
              {regions.map(region => (
                <li key={region.id}>
                  <button
                    className={`region-item ${selectedRegion === region.name ? 'active' : ''}`}
                    onClick={() => setSelectedRegion(region.name)}
                  >
                    {region.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="explore-main">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <span className="breadcrumb-item">{selectedCategory}</span>
            <ChevronRight className="breadcrumb-divider" size={16} />
            <span className="breadcrumb-item active">{selectedSubCategory}</span>
          </nav>

          {/* 뉴스 결과 수 */}
          <div className="result-count">
            <span className="count-text">결과 {newsItems.length}개</span>
          </div>

          {/* 뉴스 리스트 */}
          <div className="news-list">
            {newsItems.map(item => (
              <article key={item.id} className="news-card">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-excerpt">{item.excerpt}</p>
                <div className="news-footer">
                  <div className="news-meta">
                    <Calendar size={14} className="meta-icon" />
                    <span className="news-date">{item.date}</span>
                  </div>
                  <a href="#" className="news-link">
                    자세히보기
                    <ExternalLink size={14} className="link-icon" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExplorePage;