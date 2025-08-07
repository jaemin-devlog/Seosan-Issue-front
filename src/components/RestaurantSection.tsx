import React, { useState } from 'react';
import './RestaurantSection.css';
import { useApi } from '../hooks';
import { restaurantAPI } from '../services/api';
import { Restaurant } from '../types';
import { formatNumber } from '../utils/formatters';
import { LoadingStates } from './LoadingStates';

const RestaurantSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const { data: restaurants, loading } = useApi<Restaurant[]>(() => restaurantAPI.getPopular(12));

  const categories = ['전체', '한식', '중식', '일식', '양식', '카페', '해산물', '분식'];

  const filteredRestaurants = selectedCategory === '전체' 
    ? restaurants 
    : restaurants?.filter(r => r.category === selectedCategory);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="star filled">★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="star half">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="star empty">★</span>
        );
      }
    }
    return stars;
  };

  const getPriceColor = (priceRange: string) => {
    const length = priceRange.length;
    if (length <= 1) return 'price-low';
    if (length <= 2) return 'price-medium';
    return 'price-high';
  };

  return (
    <section className="restaurant-section" aria-labelledby="restaurant-section-title">
      <div className="restaurant-container">
        <div className="restaurant-header">
          <h2 id="restaurant-section-title" className="restaurant-title">
            🍴 서산 맛집 탐방
          </h2>
          <p className="restaurant-subtitle">
            서산의 숨은 맛집들을 소개합니다
          </p>
        </div>

        <div className="category-filter" role="tablist">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              role="tab"
              aria-selected={selectedCategory === category}
              aria-label={`${category} 카테고리 선택`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="restaurant-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingStates key={i} type="card" />
            ))}
          </div>
        ) : filteredRestaurants && filteredRestaurants.length > 0 ? (
          <div className="restaurant-grid">
            {filteredRestaurants.map((restaurant) => (
              <article key={restaurant.id} className="restaurant-card" tabIndex={0}>
                <div className="restaurant-image">
                  <div className="restaurant-category-badge">{restaurant.category}</div>
                  <div className="restaurant-rating-badge" aria-label={`평점 ${restaurant.rating}점`}>
                    <span className="rating-star" aria-hidden="true">★</span>
                    <span className="rating-value">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="restaurant-content">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <div className="restaurant-info">
                    <div className="restaurant-rating" aria-label={`평점 ${restaurant.rating}점, 리뷰 ${formatNumber(restaurant.reviews)}개`}>
                      <div className="stars" aria-hidden="true">{renderStars(restaurant.rating)}</div>
                      <span className="review-count">({formatNumber(restaurant.reviews)})</span>
                    </div>
                    <div className="restaurant-meta">
                      <span className={`price-range ${getPriceColor(restaurant.priceRange)}`}>
                        {restaurant.priceRange}
                      </span>
                      <span className="location">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1C4.23858 1 2 3.23858 2 6C2 8.76142 7 13 7 13C7 13 12 8.76142 12 6C12 3.23858 9.76142 1 7 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="7" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {restaurant.location}
                      </span>
                    </div>
                    {restaurant.hours && (
                      <div className="hours">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M7 3V7L9.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {restaurant.hours}
                      </div>
                    )}
                  </div>
                  <div className="restaurant-actions">
                    <button className="action-btn primary">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.5 6C13.5 10 8 14 8 14C8 14 2.5 10 2.5 6C2.5 3.51472 4.51472 1.5 7 1.5C7.74252 1.5 8.42632 1.73532 8.98861 2.13012C9.09696 2.20819 9.19928 2.29307 9.29479 2.38396C9.4636 2.54154 9.60992 2.71924 9.73042 2.91239C10.0339 3.3835 10.2155 3.9316 10.2497 4.51498C10.2548 4.60274 10.2574 4.69127 10.2574 4.78044C10.2574 4.85206 10.2558 4.92334 10.2525 4.9942C10.2473 5.10108 10.2393 5.20745 10.2286 5.31315C10.1568 5.99575 9.87689 6.61875 9.44914 7.11496C9.35462 7.22472 9.25294 7.32879 9.14492 7.42645C8.72742 7.79842 8.19206 8.02941 7.61194 8.06984C7.57173 8.07251 7.53128 8.07387 7.49068 8.07387C7.16056 8.07387 6.84589 7.99831 6.56486 7.86162" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      전화하기
                    </button>
                    <button className="action-btn secondary">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 10V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V10M11 7L8 11M8 11L5 7M8 11V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      저장
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="restaurant-empty">
            <p>해당 카테고리의 맛집이 없습니다.</p>
          </div>
        )}

        <div className="restaurant-footer">
          <button className="view-all-btn">
            더 많은 맛집 보기
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;