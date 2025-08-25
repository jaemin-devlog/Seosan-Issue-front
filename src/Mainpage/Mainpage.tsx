// src/Mainpage/Mainpage.tsx
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Mainpage.css";
import "./Mainpage-responsive.css";
// ✅ mainPageAPI 제거, seosanAPI만 유지
import { seosanAPI } from "../api/backend.api";
// ✅ 트렌딩 서비스 사용
import { getPopularTerms } from "../services/trending";

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
import History from "../assets/refresh_gray.gif";

// ===== Type 최소 정의 =====
type Period = "daily" | "weekly";
type TopicObj = { title: string; isNew?: boolean };
type TopicItem = string | TopicObj;
type TopicMap = Record<Period, TopicItem[]>;
interface Notice {
  id?: number | string;
  title: string;
  date?: string;
  category?: string;
}

// ✅ 화면 노출 개수 고정
const VISIBLE_LIMIT = 7;

const Mainpage = memo(() => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [period, setPeriod] = useState<Period>("daily"); // "daily" | "weekly"
  const [aiLoading] = useState(false);

  // ✅ { title, isNew } 형태로 받도록 초기값 유지
  const [trendingTopics, setTrendingTopics] = useState<TopicMap>({ daily: [], weekly: [] });
  const [notices, setNotices] = useState<Notice[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // ✅ 상위 7개만 잘라서 표시
  const topics = (trendingTopics[period] || []).slice(0, VISIBLE_LIMIT);

  // ▼ 추천 검색어 세트 (여러개) — History 아이콘 클릭 시 순환됩니다.
  const recommendedSets = useMemo<string[][]>(
    () => [
      ["맛집", "노인복지", "서산 교통", "해미"],
      ["서산 카페", "문화 혜택", "서산시 행사", "버스 시간표"],
      ["해미 읍성", "아이 돌봄", "날씨", "미세 먼지"],
    ],
    []
  );
  const [recIdx, setRecIdx] = useState(0);
  const currentTags = recommendedSets[recIdx % recommendedSets.length];
  const rotateDeg = recIdx * 180; // 아이콘 회전용

  // ExplorePremium으로 이동할 URL 헬퍼
  const exploreTo = useCallback(
    (tab: string) => `/explore?view=list&tab=${encodeURIComponent(tab)}&page=1`,
    []
  );

  // 추천 키워드 클릭 → ai-search 로 이동
  const handleKeywordClick = useCallback(
    (keyword: string) => {
      const q = String(keyword).trim();
      if (!q) return;
      navigate(`/ai-search?q=${encodeURIComponent(q)}`);
    },
    [navigate]
  );

  // 추천 세트 새로고침(순환)
  const handleRefreshTags = useCallback(() => {
    setRecIdx((v) => (v + 1) % recommendedSets.length);
  }, [recommendedSets.length]);

  // ✅ 트렌딩/공지 로드 (AbortController로 언마운트 안전)
  useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;

    const mapToTitleObjects = (arr: any[]): TopicObj[] =>
      (arr || [])
        .map((t: any) => {
          if (typeof t === "string") return { title: t, isNew: false };
          if (t && typeof t === "object") {
            const title = t.title ?? t.term ?? t.keyword ?? String(t?.[0] ?? "");
            if (!title) return null;
            return { title, isNew: !!t.isNew };
          }
          return null;
        })
        .filter(Boolean) as TopicObj[];

    const fetchTrendingKeywords = async () => {
      setTrendingLoading(true);
      try {
        // ✅ services/trending가 반환하는 형태에 모두 대응
        //  - 배열만 오는 경우(일간만) → daily/weekly 동일 세팅
        //  - { daily, weekly } 객체로 오는 경우 → 그대로 매핑
        const result: any = await getPopularTerms({ signal });

        let daily: TopicItem[] = [];
        let weekly: TopicItem[] = [];

        if (Array.isArray(result)) {
          daily = mapToTitleObjects(result);
          weekly = daily;
        } else if (result && (result.daily || result.weekly)) {
          daily = mapToTitleObjects(result.daily || []);
          weekly = mapToTitleObjects(result.weekly || result.daily || []);
        } else {
          daily = [];
          weekly = [];
        }

        setTrendingTopics({ daily, weekly });
      } catch (error: any) {
        // ⛳️ StrictMode 더블 이펙트로 인한 abort는 무시
        if ((signal as AbortSignal).aborted || (error && error.name === "AbortError")) return;
        if (process.env.NODE_ENV === "development") {
          console.error("트렌딩 키워드 로드 실패:", error);
        }
        setTrendingTopics({ daily: [], weekly: [] });
      } finally {
        setTrendingLoading(false);
      }
    };

    const fetchNotices = async () => {
      // 하드코딩된 공지사항 데이터만 사용 (API 호출 완전 제거)
      setNotices([
        {
          id: 1,
          title: "2025년 서산시 지역산업맞춤형 일자리창출지원사업 참여자 모집",
          date: "2025-01-25",
          category: "공지사항",
        },
        {
          id: 2,
          title: "서산시 청년창업 지원센터 입주기업 모집 공고",
          date: "2025-01-24",
          category: "공지사항",
        },
      ]);
    };

    fetchTrendingKeywords();
    fetchNotices();

    return () => ac.abort("Mainpage unmounted");
  }, []);

  // AI 검색 → 결과 페이지 이동
  const handleAiSearch = useCallback(async () => {
    const query = inputValue.trim();
    if (!query || aiLoading) return;
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

          {/* 날씨 섹션 */}
          <div className="weather-section">
            <h2 className="weather-title">날씨</h2>
            <Weather />
          </div>

          {/* ------- 트렌딩 토픽 ------- */}
          <div className="trending-card-wrap">
            <div className="trending-tab-img">
              <img src={topicTab} alt="트렌딩 탭" className="trending-tab-bg" />
              <span className="trending-tab-text">트렌딩 토픽</span>
            </div>

            <div className="trending-card" role="region" aria-label="트렌딩 토픽">
              <ul
                className="trending-list"
                aria-live="polite"
                aria-label={`${period === "daily" ? "일간" : "주간"} 트렌딩 토픽 목록`}
              >
                {trendingLoading ? (
                  <li
                    className="trending-row"
                    style={{ textAlign: "center", padding: "30px 20px", border: "none" }}
                  >
                    <span style={{ color: "#999", fontSize: "14px" }}>
                      트렌딩 데이터를 불러오는 중...
                    </span>
                  </li>
                ) : topics && topics.length > 0 ? (
                  topics.map((t, i) => (
                    <li
                      className="trending-row"
                      key={`${period}-${i}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${i + 1}위: ${
                        typeof t === "object" ? (t as any).title : (t as string)
                      }${typeof t === "object" && (t as any).isNew ? " (신규)" : ""}`}
                      onClick={() =>
                        handleKeywordClick(typeof t === "object" ? (t as any).title : (t as string))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleKeywordClick(
                            typeof t === "object" ? (t as any).title : (t as string)
                          );
                        }
                      }}
                    >
                      <span className="trending-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="trending-text">
                        {typeof t === "object" ? (t as any).title : (t as string)}
                      </span>
                      {typeof t === "object" && (t as any).isNew && (
                        <span className="trending-new" aria-label="신규">
                          new
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <li
                    className="trending-row"
                    style={{ textAlign: "center", padding: "30px 20px", border: "none" }}
                  >
                    <span style={{ color: "#999", fontSize: "14px" }}>
                      트렌딩 데이터가 없습니다.
                    </span>
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

                <span className="trending-mode">{period === "daily" ? "일간" : "주간"}</span>

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
              {/* 배경 이미지가 클릭을 가로채지 않도록 */}
              <img
                src={SearchBalloon}
                alt="검색 말풍선"
                className="balloonBg"
                style={{ pointerEvents: "none" }}
              />
              <div className="balloonContent">
                <input
                  className="balloonInput"
                  placeholder="키워드로 검색해주세요"
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
                  style={{
                    cursor: aiLoading ? "not-allowed" : "pointer",
                    opacity: aiLoading ? 0.7 : 1,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAiSearch();
                  }}
                >
                  <span className="aiSearchBold">
                    {aiLoading ? "검색 중..." : "AI 검색"}
                  </span>
                  <img src={SparkleIcon} alt="" className="sparkleIcon" aria-hidden="true" />
                </span>
              </div>
            </div>

            {/* ▼ 추천 태그 + 새로고침 순환 ▼ */}
            <div className="balloon-keywords" style={{ position: "relative", zIndex: 10 }}>
              <img
                src={History}
                alt="추천 검색 새로고침"
                className="History-Icon"
                title="다른 추천 보기"
                onClick={handleRefreshTags}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleRefreshTags()}
                style={{
                  transform: `rotate(${rotateDeg}deg)`,
                  transition: "transform .35s ease",
                }}
              />
              <span className="History-Bar">|</span>
              <span className="balloon-popular">추천 검색</span>

              <div className="balloon-tags">
                {currentTags.map((tag, i) => (
                  <span
                    key={`${recIdx}-${i}-${tag}`}
                    role="button"
                    tabIndex={0}
                    title={`${tag} 검색`}
                    onClick={() => handleKeywordClick(tag)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && handleKeywordClick(tag)
                    }
                  >
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            </div>
            {/* ▲ 추천 태그 끝 ▲ */}

            <div className="balloon-cards">
              <div className="balloon-card">
                <div className="balloon-icon-wrap">
                  <img src={newsIcon} alt="뉴스" />
                </div>
                <div>
                  <div className="balloon-card-title">뉴스</div>
                  <div className="balloon-card-desc">
                    서산의 최근 소식을 여기서,
                    <br />
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
                    전 연령대 복지 정책,
                    <br />
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
                  <span className="news-text">
                    2025 서산시 혁신 아이디어 공모 국민 선호도 조사 실시 안내
                  </span>
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

Mainpage.displayName = "Mainpage";
export default Mainpage;
