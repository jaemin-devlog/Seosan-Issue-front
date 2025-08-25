import React, { useState, useEffect, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Mainpage.css";
import { mainPageAPI, seosanAPI } from "../api/backend.api";
import logo1 from "../assets/로고1.png";
import mascot from "../assets/물음표로고 .png";
import healthIcon from "../assets/Health.png";
import noticeIcon from "../assets/공지사항.png";
import newsIcon from "../assets/뉴스.png";
import news1Icon from "../assets/pin.png";
import arrowIcon from "../assets/대각선오른쪽위.png";
import SparkleIcon from "../assets/sparkle.png";
import topicTab from "../assets/topicBG.png";
import SearchBalloon from "../assets/search (2).png";
import Weather from "../Weather/Weather";
import TodayCard from "../TodayCard/TodayCard";
import History from "../assets/History.png";

const Mainpage = memo(() => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [period, setPeriod] = useState("daily"); // "daily" | "weekly"
  const [aiLoading] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState({ daily: [], weekly: [] });
  const [notices, setNotices] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  
  const topics = trendingTopics[period] || [];

  // ★ ExplorePremium으로 이동할 URL 헬퍼
  const exploreTo = useCallback((tab) =>
    `/explore?view=list&tab=${encodeURIComponent(tab)}&page=1`, []);

  // API 데이터 로드
  useEffect(() => {
    fetchTrendingKeywords();
    fetchNotices();
  }, []);

  const fetchTrendingKeywords = async () => {
    setTrendingLoading(true);
    try {
      const data = await mainPageAPI.getTrendingKeywords();
      
      if (data && typeof data === 'object') {
        if (data.daily && data.weekly) {
          // 5개로 제한하고 포맷팅
          const formattedDaily = Array.isArray(data.daily) 
            ? data.daily.slice(0, 5).map((title, index) => ({ 
                title: String(title), 
                isNew: index >= 3  // 3번째부터 new 표시
              })) 
            : [];
          const formattedWeekly = Array.isArray(data.weekly) 
            ? data.weekly.slice(0, 5).map(title => ({ 
                title: String(title) 
              })) 
            : [];
          
          setTrendingTopics({
            daily: formattedDaily,
            weekly: formattedWeekly
          });
        } else {
          setTrendingTopics({ daily: [], weekly: [] });
        }
      } else {
        setTrendingTopics({ daily: [], weekly: [] });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('트렌딩 키워드 로드 실패:', error);
      }
      setTrendingTopics({ daily: [], weekly: [] });
    } finally {
      setTrendingLoading(false);
    }
  };

  const fetchNotices = async () => {
    // 하드코딩된 공지사항 데이터만 사용 (API 호출 제거)
    setNotices([
      {
        id: 1,
        title: "2025년 서산시 지역산업맞춤형 일자리창출지원사업 참여자 모집",
        date: "2025-01-25",
        category: "공지사항"
      },
      {
        id: 2,
        title: "서산시 청년창업 지원센터 입주기업 모집 공고",
        date: "2025-01-24",
        category: "공지사항"
      }
    ]);
  };

  // ★ AI 검색 → 백엔드 연동 + 빈 결과 알람 + 결과 페이지 이동
  const handleAiSearch = useCallback(async () => {
    const query = inputValue.trim();
    if (!query || aiLoading) return;

    // AI 검색 페이지로 이동하면서 검색어 전달
    navigate(`/ai-search?q=${encodeURIComponent(query)}`);
    setInputValue("");
  }, [inputValue, aiLoading, navigate]);

  const toDaily = useCallback(() => setPeriod("daily"), []);
  const toWeekly = useCallback(() => setPeriod("weekly"), []);

  return (
    <div className="mainpage-bg">
      <div className="mainpage-container">
        <div className="mainpage-left">
          <img src={logo1} alt="오늘 서산에 무슨일 issue?" className="main-title-img" />
          <Weather />

          {/* ------- 트렌딩 토픽 ------- */}
          <div className="trending-card-wrap">
            <div className="trending-tab-img">
              <img src={topicTab} alt="트렌딩 탭" className="trending-tab-bg" />
              <span className="trending-tab-text">트렌딩 토픽</span>
            </div>

            <div className="trending-card" role="region" aria-label="트렌딩 토픽">
              <ul className="trending-list" aria-live="polite" aria-label={`${period === 'daily' ? '일간' : '주간'} 트렌딩 토픽 목록`}>
                {trendingLoading ? (
                  <li className="trending-row" style={{ textAlign: 'center', padding: '30px 20px', border: 'none' }}>
                    <span style={{ color: '#999', fontSize: '14px' }}>트렌딩 데이터를 불러오는 중...</span>
                  </li>
                ) : topics && topics.length > 0 ? (
                  topics.map((t, i) => (
                    <li 
                      className="trending-row" 
                      key={`${period}-${i}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${i + 1}위: ${typeof t === 'object' ? t.title : t}${typeof t === 'object' && t.isNew ? ' (신규)' : ''}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // 클릭 이벤트와 동일한 동작
                        }
                      }}
                    >
                      <span className="trending-num" aria-hidden="true">{i + 1}</span>
                      <span className="trending-text">{typeof t === 'object' ? t.title : t}</span>
                      {typeof t === 'object' && t.isNew && <span className="trending-new" aria-label="신규">new</span>}
                    </li>
                  ))
                ) : (
                  <li className="trending-row" style={{ textAlign: 'center', padding: '30px 20px', border: 'none' }}>
                    <span style={{ color: '#999', fontSize: '14px' }}>트렌딩 데이터가 없습니다.</span>
                  </li>
                )}
              </ul>

              {/* 하단 토글: 일간/주간 + 좌우 화살표 */}
              <div className="trending-switch">
                <button
                  type="button"
                  className={`trending-chev ${period === "daily" ? "is-disabled" : ""}`}
                  onClick={toDaily}
                  aria-label="일간 트렌딩 보기"
                  aria-pressed={period === "daily"}
                  disabled={period === "daily"}
                >
                  ‹
                </button>

                <span className="trending-mode">
                  {period === "daily" ? "일간" : "주간"}
                </span>

                <button
                  type="button"
                  className={`trending-chev ${period === "weekly" ? "is-disabled" : ""}`}
                  onClick={toWeekly}
                  aria-label="주간 트렌딩 보기"
                  aria-pressed={period === "weekly"}
                  disabled={period === "weekly"}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 부분 */}
        <div className="mainpage-right">
          <div className="bgBox">
            <div className="aiSearchBalloonBox">
              <img src={SearchBalloon} alt="검색 말풍선" className="balloonBg" />
              <div className="balloonContent">
                <input
                  className="balloonInput"
                  placeholder="찾으시는 소식이 있나요?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAiSearch();
                  }}
                  aria-busy={aiLoading ? "true" : "false"}
                />
                <span
                  className="aiSearchRight"
                  onClick={handleAiSearch}
                  tabIndex={0}
                  role="button"
                  aria-label="AI 검색 실행"
                  aria-disabled={aiLoading ? "true" : "false"}
                  style={{ cursor: aiLoading ? "not-allowed" : "pointer", opacity: aiLoading ? 0.7 : 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAiSearch();
                  }}
                >
                  <span className="aiSearchBold">{aiLoading ? "검색 중..." : "AI 검색"}</span>
                  <img src={SparkleIcon} alt="" className="sparkleIcon" aria-hidden="true" />
                </span>
              </div>
            </div>

            <div className="balloon-keywords">
              <img src={History} alt="" className="History-Icon"/>
              <span className ="History-Bar">|</span>
              <span className="balloon-popular">최근 검색</span>
              <div className="balloon-tags">
                <span>#맛집</span>
                <span>#노인복지</span>
                <span>#서산교통</span>
                <span>#해미</span>
              </div>
            </div>

            <div className="balloon-cards">
              <div className="balloon-card">
                <div className="balloon-icon-wrap">
                  <img src={newsIcon} alt="뉴스" />
                </div>
                <div>
                  <div className="balloon-card-title">뉴스</div>
                  <div className="balloon-card-desc">
                    서산의 최근 소식을 여기서,<br />
                    바로 알아보세요
                  </div>
                </div>
                <Link
                  to={exploreTo("뉴스")}
                  className="balloon-card-arrow"
                  aria-label="뉴스 더보기"
                >
                  <img src={arrowIcon} alt="" />
                </Link>
              </div>
              <div className="balloon-card">
                <div className="balloon-icon-wrap">
                  <img src={healthIcon} alt="복지" />
                </div>
                <div>
                  <div className="balloon-card-title">복지</div>
                  <div className="balloon-card-desc">
                    전 연령대 복지 정책,<br />
                    한눈에 확인하세요
                  </div>
                </div>
                <Link
                  to={exploreTo("보건/건강")}
                  className="balloon-card-arrow"
                  aria-label="복지 더보기"
                >
                  <img src={arrowIcon} alt="" />
                </Link>
              </div>
            </div>
            <img src={mascot} alt="" className="balloon-mascot" />
          </div>

          <TodayCard />

          <div className="news-list">
            {notices && notices.length > 0 ? (
              notices.map((notice, idx) => (
                <div key={idx} className="news-item notice-item">
                  <img src={noticeIcon} alt="공지" />
                  <div className="news-meta">
                    <span className="news-label">최근 공지사항</span>
                    <span className="news-org">서산시청</span>
                  </div>
                  <span className="news-text">{notice.title}</span>
                </div>
              ))
            ) : (
              <>
                <div className="news-item notice-item">
                  <img src={noticeIcon} alt="공지" />
                  <div className="news-meta">
                    <span className="news-label">최근 공지사항</span>
                    <span className="news-org">서산시청</span>
                  </div>
                  <span className="news-text">2025 서산시 혁신 아이디어 공모 국민 선호도 조사 실시 안내</span>
                </div>
                <div className="news-item">
                  <img src={news1Icon} alt="뉴스" />
                  <div className="news-meta">
                    <span className="news-label">최근 서산뉴스</span>
                    <span className="news-org">서산신문</span>
                  </div>
                  <span className="news-text">서산시의회, 수해 시민 위해 쌀 100포 기탁</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Mainpage.displayName = 'Mainpage';

export default Mainpage;