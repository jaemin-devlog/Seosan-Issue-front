import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Mainpage.css";
import logo1 from "../assets/로고1.png";
import mascot from "../assets/물음표로고 .png";
import healthIcon from "../assets/Health.png";
import noticeIcon from "../assets/공지사항.png";
import newsIcon from "../assets/뉴스.png";
import arrowIcon from "../assets/대각선오른쪽위.png";
import SparkleIcon from "../assets/sparkle.png";
import topicTab from "../assets/topicBG.png";
import SearchBalloon from "../assets/search (2).png";
import Weather from "../Weather/Weather";
import TodayCard from "../TodayCard/TodayCard"; 

const trendingTopics = [
  { title: "서산 맛집" },
  { title: "복지" },
  { title: "해미읍성" },
  { title: "시외버스" },
  { title: "축제", isNew: true },
  { title: "서산 카페" },
  { title: "문화시설", isNew: true }
];

export default function Mainpage() {
  const [inputValue, setInputValue] = useState("");

  const handleAiSearch = () => {
    if (!inputValue.trim()) return;
    alert(`AI 검색: ${inputValue}`);
    setInputValue(""); // 검색 후 비움(원하면 유지)
  };
  return (
    <div className="mainpage-bg">
      <div className="mainpage-container">
        <div className="mainpage-left">
          <img src={logo1} alt="오늘 서산에 무슨일 issue?" className="main-title-img" />
          <Weather/>
          {/* ------- 트렌딩 토픽 ------- */}
          <div className="trending-card-wrap">
            <div className="trending-tab-img">
              <img src={topicTab} alt="트렌딩 탭" className="trending-tab-bg" />
              <span className="trending-tab-text">트렌딩 토픽</span>
            </div>
            <div className="trending-card">
              <ul className="trending-list">
                {trendingTopics.map((t, i) => (
                  <li className="trending-row" key={t.title}>
                    <span className="trending-num">{i + 1}</span>
                    <span className="trending-text">{t.title}</span>
                    {t.isNew && <span className="trending-new">new</span>}
                  </li>
                ))}
              </ul>
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
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleAiSearch();
                  }}
                />
                <span
                  className="aiSearchRight"
                  onClick={handleAiSearch}
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                  onKeyDown={e => { if (e.key === "Enter") handleAiSearch(); }}
                >
                  <span className="aiSearchBold">AI 검색</span>
                  <img src={SparkleIcon} alt="AI 스파클" className="sparkleIcon" />
                </span>
              </div>
            </div>
            <div className="balloon-keywords">
              <span className="balloon-popular">인기 검색어</span>
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
                  <img src={noticeIcon} alt="뉴스" />
                </div>
                <div>
                  <div className="balloon-card-title">뉴스</div>
                  <div className="balloon-card-desc">
                    복잡한 서산시의 교통 노선,<br />바로 알아보세요
                  </div>
                </div>
                <Link to="/traffic" className="balloon-card-arrow">
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
                    복지혜택, 찾기 힘드신가요?<br />통합 정보를 확인하세요
                  </div>
                </div>
                <Link to="/welfare" className="balloon-card-arrow">
                  <img src={arrowIcon} alt="바로가기" />
                </Link>
              </div>
              <img src={mascot} className="balloon-mascot" alt="캐릭터" draggable="false" />
            </div>
          </div>
         <TodayCard/>
          {/* ----------- 뉴스 리스트 ----------- */}
          <div className="news-list">
            <div className="news-item">
              <img src={noticeIcon} alt="공지" />
              <div className="news-meta">
                <span className="news-label">최근 공지사항</span>
                <span className="news-org">서산시청</span>
              </div>
              <span className="news-text">2025 서산시 혁신 아이디어 공모 국민 선호도 조사 실시 안내</span>
            </div>
            <div className="news-item">
              <img src={newsIcon} alt="뉴스" />
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
