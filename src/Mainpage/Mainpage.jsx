import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Mainpage.css";
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

/** 트렌딩 토픽 데이터: 일간 / 주간 */
const trendingDaily = [
  { title: "서산 맛집" },
  { title: "복지" },
  { title: "해미읍성" },
  { title: "시외버스" },
  { title: "축제", isNew: true },
  { title: "서산 카페", isNew: true },
];

const trendingWeekly = [
  { title: "서산 카페" },
  { title: "복지 신청" },
  { title: "서산 축제 일정" },
  { title: "전통시장" },
  { title: "해미읍성" },
  { title: "서산 맛집" },
];

// 환경변수 기반 API 베이스 URL (없으면 로컬 기본값)
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8083/api/v1";

// 결과가 비었는지 유연하게 판별
const hasResults = (data) => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === "object") {
    if (typeof data.total === "number") return data.total > 0;
    if (typeof data.count === "number") return data.count > 0;
    for (const k of ["items", "results", "data", "list"]) {
      if (Array.isArray(data[k])) return data[k].length > 0;
    }
  }
  // 구조를 모르면 '있다'로 간주(오탐 경고 방지)
  return true;
};

export default function Mainpage() {
  const [inputValue, setInputValue] = useState("");
  const [period, setPeriod] = useState("daily"); // "daily" | "weekly"
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  const topics = period === "daily" ? trendingDaily : trendingWeekly;

  // ★ ExplorePremium으로 이동할 URL 헬퍼
  const exploreTo = (tab) =>
    `/explore?view=list&tab=${encodeURIComponent(tab)}&page=1`;

  // ★ AI 검색 → 백엔드 연동 + 빈 결과 알람 + 결과 페이지 이동
  const handleAiSearch = async () => {
    const query = inputValue.trim();
    if (!query || aiLoading) return;

    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`AI search HTTP ${res.status}`);
      const data = await res.json();

      const empty = !hasResults(data);
      if (empty) {
        alert("검색 결과가 없습니다.");
      }

      // 성공/빈결과 모두 Explore로 이동(빈결과 플래그 전달)
      navigate(
        `/explore?view=list&tab=${encodeURIComponent("뉴스")}&q=${encodeURIComponent(
          query
        )}&page=1`,
        {
          state: {
            aiSearch: {
              query,
              response: data,
              empty, // Explore에서 필요시 사용
            },
          },
        }
      );
    } catch (err) {
      console.error(err);
      alert("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      // 오류 시에도 최소한 검색 페이지로 이동
      navigate(
        `/explore?view=list&tab=${encodeURIComponent("뉴스")}&q=${encodeURIComponent(
          query
        )}&page=1`
      );
    } finally {
      setAiLoading(false);
      setInputValue("");
    }
  };

  const toDaily = () => setPeriod("daily");
  const toWeekly = () => setPeriod("weekly");
  const togglePeriod = () => setPeriod((p) => (p === "daily" ? "weekly" : "daily"));

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

            <div className="trending-card">
              <ul className="trending-list" aria-live="polite">
                {topics.map((t, i) => (
                  <li className="trending-row" key={`${period}-${t.title}`}>
                    <span className="trending-num">{i + 1}</span>
                    <span className="trending-text">{t.title}</span>
                    {t.isNew && <span className="trending-new">new</span>}
                  </li>
                ))}
              </ul>

              {/* 하단 토글: 일간/주간 + 좌우 화살표 */}
              <div className="trending-switch">
                <button
                  type="button"
                  className={`trending-chev ${period === "daily" ? "is-disabled" : ""}`}
                  onClick={toDaily}
                  aria-label="일간 보기"
                  disabled={period === "daily"}
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="trending-mode"
                  onClick={togglePeriod}
                  aria-label="기간 전환"
                  title="클릭해서 일간/주간 전환"
                >
                  {period === "daily" ? "일간" : "주간"}
                </button>

                <button
                  type="button"
                  className={`trending-chev ${period === "weekly" ? "is-disabled" : ""}`}
                  onClick={toWeekly}
                  aria-label="주간 보기"
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
              <img src={History} alr="" className="History-Icon" />
              <span className="History-Bar">|</span>
              <span className="balloon-popular">최근 검색</span>
              <div className="balloon-tags">
                <span>문화 혜택</span>
                <span>서산 맛집 추천</span>
                <span>복지 혜택 신청</span>
                <span>서산 교통편</span>
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
                  aria-label="탐색 - 뉴스로 이동"
                  title="탐색: 뉴스"
                >
                  <img src={arrowIcon} alt="바로가기" />
                </Link>
              </div>

              <div className="balloon-card">
                <div className="balloon-icon-wrap">
                  <img src={healthIcon} alt="복지" />
                </div>
                <div>
                  <div className="balloon-card-title">복지</div>
                  <div className="balloon-card-desc">
                    복지혜택, 찾기 힘드신가요?<br />
                    통합 정보를 확인하세요
                  </div>
                </div>
                {/* ★ 복지 → Explore의 복지 탭으로 */}
                <Link
                  to={exploreTo("복지")}
                  className="balloon-card-arrow"
                  aria-label="탐색 - 복지로 이동"
                  title="탐색: 복지"
                >
                  <img src={arrowIcon} alt="바로가기" />
                </Link>
              </div>

              <img src={mascot} className="balloon-mascot" alt="캐릭터" draggable="false" />
            </div>
          </div>

          <TodayCard />

          {/* ----------- 뉴스 리스트 ----------- */}
          <div className="news-list">
            <div className="news-item">
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
          </div>
        </div>
      </div>
    </div>
  );
}