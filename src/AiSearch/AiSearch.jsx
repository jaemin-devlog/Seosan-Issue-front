import React, { useState } from "react";
import styles from "./AiSearch.module.css";
import BusIcon from "../assets/Bus2.png";
import LightningIcon from "../assets/Lightning.png";
import QuestionLogo from "../assets/물음표로고 .png";
import ChatCircleDots from "../assets/ChatCircleDots.png";
import BlackCircle from "../assets/blackcircle.png";
import HealthIcon from "../assets/Health2.png";
import LightbulbIcon from "../assets/Lightbulb.png";
import History from "../assets/History.png";
import SearchBalloon from "../assets/searchBalloon.png";
import SparkleIcon from "../assets/sparkle.png";import sadLogo from "../assets/sadLogo.png";
import happyLogo from "../assets/HappyLogo.png";
import answerBubble from "../assets/Answer.png";
import denyBubble from "../assets/deny.png";

const recentSearchPool = [
  ["문화혜택", "서산 맛집 추천", "복지 혜택 신청"],
  ["교통정보", "서산시 행사", "서산 카페"],
  ["서산 명소", "전통시장", "주말 이벤트"],
  ["공원 위치", "체육시설", "노인복지관"],
  ["가족 여행지", "아이와 갈만한 곳", "주차장 위치"]
];

function getRandomList(prevList) {
  const candidates = recentSearchPool.filter(
    arr => arr.join("|") !== prevList.join("|")
  );
  if (candidates.length === 0) return prevList;
  const i = Math.floor(Math.random() * candidates.length);
  return candidates[i];
}

export default function AiSearch() {
  const [inputValue, setInputValue] = useState("");
  const [recentSearches, setRecentSearches] = useState(recentSearchPool[0]);
  const [searchResult, setSearchResult] = useState(null);

  // 검색 시 호출
  const handleAiSearch = () => {
    if (!inputValue.trim()) return;

    // 예시: 결과 없는 경우
    // setSearchResult(false);

    // 예시: 결과 있는 경우
    setSearchResult({
      sources: [
        {
          title: "충청남도 서산시_재가노인 복지시설",
          link: "#",
          provider: "충청남도 데이터포털 올담",
        },
        {
          title: "충청남도 서산시_노인의료복지시설",
          link: "#",
          provider: "충청남도 데이터포털 올담",
        }
      ]
    });

    setInputValue("");
  };

  // 최근 검색 새로고침
  const handleRefresh = () => {
    setRecentSearches(prevList => getRandomList(prevList));
  };


  return (
    <div className={styles.bg}>
      {/* 상단 검색바 + 배경 */}
      <div className={styles.topSection}>
        <div className={styles.bgBox}>
          <div className={styles.aiSearchBalloonBox}>
            <img src={SearchBalloon} alt="검색 말풍선" className={styles.balloonBg} />
            <div className={styles.balloonContent}>
              <input
                className={styles.balloonInput}
                placeholder="찾으시는 소식이 있나요?"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") handleAiSearch();
                }}
              />
              <span
                className={styles.aiSearchRight}
                onClick={handleAiSearch}
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onKeyDown={e => { if (e.key === "Enter") handleAiSearch(); }}
              >
                <span className={styles.aiSearchBold}>AI 검색</span>
                <img src={SparkleIcon} alt="" className={styles.sparkleIcon} />
              </span>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <div className={styles.searchHistoryTitle}>
  <img
    src={History}
    alt="새로고침"
    className={styles.historyIcon}
    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
    onClick={handleRefresh}
    tabIndex={0}
    onKeyDown={e => {
      if (e.key === "Enter" || e.key === " ") handleRefresh();
    }}
    aria-label="새로고침"
  />
  최근 검색
</div>
            {recentSearches.map((item, idx) => (
              <button key={item + idx} className={styles.pillBtn}>{item}</button>
            ))}
          </div>
        </div>
        <img src={QuestionLogo} alt="logo" className={styles.questionLogo} draggable="false" />
      </div>
  {/* --- AI 검색 결과 영역 --- */}
      {searchResult && (
        <div className={styles.aiResultWrap}>
          <div className={styles.resultRow}>
            <img src={happyLogo} alt="캐릭터" className={styles.resultLogo} />
            <div className={styles.resultBubbleWrap}>
              <img src={answerBubble} alt="답변 말풍선" className={styles.resultBubbleImg} />
              <span className={styles.resultBubbleText}>
                {searchResult.answer}
              </span>
            </div>
          </div>
          <div className={styles.resultCardList}>
            {searchResult.sources.map((item, idx) => (
              <div className={styles.resultCard} key={idx}>
                <div className={styles.resultCardTitle}>{item.title}</div>
                <div className={styles.resultCardProvider}>{item.provider}</div>
                <a
                  className={styles.resultCardLink}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  바로가기
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* --- END --- */}
      {/* 중앙 내용 */}
      <div className={styles.contentsWrap}>
        {/* 인기질문 */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <img src={LightbulbIcon} alt="" className={styles.titleIcon} />
            인기 질문
          </div>
          <div className={styles.grid}>
            {[
              { tag: "민원", text: "서산시청 민원 어떻게 넣어요?" },
              { tag: "민원", text: "서산시청 민원 어떻게 넣어요?" },
              { tag: "행사", text: "오늘 서산에 열리는 행사 뭐 있어?" },
              { tag: "행사", text: "오늘 서산에 열리는 행사 뭐 있어?" },
            ].map((q, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.tag}>{q.tag}</span>
                  <img src={ChatCircleDots} alt="" className={styles.cardIcon} />
                </div>
                <div className={styles.cardText}>{q.text}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 인기카테고리 */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <img src={LightningIcon} alt="" className={styles.titleIcon} />
            인기 카테고리
          </div>
          <div className={styles.gridCat}>
            <div className={styles.catCard}>
              <div>
                <div className={styles.catTitle}>교통</div>
                <div className={styles.catDesc}>
                  복잡한 서산시의 교통 노선,<br />바로 알아보세요
                </div>
              </div>
              <img src={BusIcon} alt="교통" className={styles.catImg} />
              <img src={BlackCircle} alt="arrow" className={styles.arrowIcon} />
            </div>
            <div className={styles.catCard}>
              <div>
                <div className={styles.catTitle}>복지</div>
                <div className={styles.catDesc}>
                  복지혜택, 찾기 힘드신가요?<br />통합 정보를 확인하세요
                </div>
              </div>
              <img src={HealthIcon} alt="복지" className={styles.catImg} />
              <img src={BlackCircle} alt="arrow" className={styles.arrowIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

