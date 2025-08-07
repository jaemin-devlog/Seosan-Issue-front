import React, { useState } from 'react';
import './NoticeSection.css';
import { useApi } from '../hooks';
import { noticeAPI } from '../services/api';
import { Notice } from '../types';
import { formatDate } from '../utils/formatters';
import { LoadingStates } from './LoadingStates';

const NoticeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'announcement' | 'news'>('announcement');
  const { data: notices, loading } = useApi<Notice[]>(() => noticeAPI.getRecent(10));

  const filteredNotices = notices?.filter(notice => notice.type === activeTab) || [];

  return (
    <section className="notice-section" aria-labelledby="notice-section-title">
      <div className="notice-container">
        <h2 id="notice-section-title" className="notice-title">
          서산시 공지사항 & 뉴스
        </h2>
        
        <div className="notice-tabs" role="tablist">
          <button
            className={`notice-tab ${activeTab === 'announcement' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcement')}
            role="tab"
            aria-selected={activeTab === 'announcement'}
            aria-controls="announcement-panel"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 2H6C5.45 2 5 2.45 5 3V16C5 16.55 5.45 17 6 17H18C18.55 17 19 16.55 19 16V3C19 2.45 18.55 2 18 2ZM18 16H6V3H18V16ZM3 6H1V18C1 19.1 1.9 20 3 20H15V18H3V6Z" fill="currentColor"/>
              <path d="M8 5H16V7H8V5ZM8 9H16V11H8V9ZM8 13H13V15H8V13Z" fill="currentColor"/>
            </svg>
            공지사항
          </button>
          <button
            className={`notice-tab ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
            role="tab"
            aria-selected={activeTab === 'news'}
            aria-controls="news-panel"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 3H18C18.55 3 19 3.45 19 4V16C19 16.55 18.55 17 18 17H2C1.45 17 1 16.55 1 16V4C1 3.45 1.45 3 2 3ZM2 5V15H18V5H2Z" fill="currentColor"/>
              <path d="M4 7H10V12H4V7ZM12 7H16V8H12V7ZM12 10H16V11H12V10Z" fill="currentColor"/>
            </svg>
            서산뉴스
          </button>
        </div>

        <div 
          id={`${activeTab}-panel`}
          role="tabpanel"
          className="notice-content"
        >
          {loading ? (
            <LoadingStates type="list" />
          ) : filteredNotices.length > 0 ? (
            <div className="notice-list">
              {filteredNotices.map((notice) => (
                <article key={notice.id} className="notice-item" tabIndex={0}>
                  <div className="notice-header">
                    <span className="notice-source">{notice.source}</span>
                    <time className="notice-date" dateTime={notice.date.toString()}>
                      {formatDate(notice.date)}
                    </time>
                  </div>
                  <h3 className="notice-headline">
                    <a href={notice.url || '#'} className="notice-link">
                      {notice.title}
                    </a>
                  </h3>
                  {notice.summary && (
                    <p className="notice-summary">{notice.summary}</p>
                  )}
                  <div className="notice-actions">
                    <button className="notice-action-btn" aria-label="공유하기">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 5.33333C13.1046 5.33333 14 4.43791 14 3.33333C14 2.22876 13.1046 1.33333 12 1.33333C10.8954 1.33333 10 2.22876 10 3.33333C10 3.53333 10.0267 3.72 10.0667 3.90667L5.64 6.55333C5.26667 6.22 4.76 6 4.2 6C3.09543 6 2.2 6.89543 2.2 8C2.2 9.10457 3.09543 10 4.2 10C4.76 10 5.26667 9.78 5.64 9.44667L10.0667 12.0933C10.0267 12.28 10 12.4667 10 12.6667C10 13.7712 10.8954 14.6667 12 14.6667C13.1046 14.6667 14 13.7712 14 12.6667C14 11.5621 13.1046 10.6667 12 10.6667C11.44 10.6667 10.9333 10.8867 10.56 11.22L6.13333 8.57333C6.17333 8.38667 6.2 8.2 6.2 8C6.2 7.8 6.17333 7.61333 6.13333 7.42667L10.56 4.78C10.9333 5.11333 11.44 5.33333 12 5.33333Z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button className="notice-action-btn" aria-label="즐겨찾기">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2L9.79611 6.52786L14.6085 6.90983L11.0806 9.97214L12.0922 14.5902L8 12.08L3.90776 14.5902L4.91943 9.97214L1.39155 6.90983L6.20389 6.52786L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="notice-empty">
              <p>등록된 {activeTab === 'announcement' ? '공지사항이' : '뉴스가'} 없습니다.</p>
            </div>
          )}
        </div>

        <div className="notice-footer">
          <button className="notice-more-btn">
            전체 {activeTab === 'announcement' ? '공지사항' : '뉴스'} 보기
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection;