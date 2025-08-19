import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./AiSearch.module.css";
import { aiSearchAPI } from "../api/backend.api";
import LightningIcon from "../assets/Lightning.png";
import QuestionLogo from "../assets/물음표로고 .png";
import ChatCircleDots from "../assets/ChatCircleDots.png";
import BlackCircle from "../assets/blackcircle.png";
import HealthIcon from "../assets/Health2.png";
import LightbulbIcon from "../assets/Lightbulb.png";
import History from "../assets/History.png";
import SearchBalloon from "../assets/searchBalloon.png";
import SparkleIcon from "../assets/sparkle.png";
import sadLogo from "../assets/sadLogo.png";
import happyLogo from "../assets/HappyLogo.png";
import NewsIcon from "../assets/뉴스.png";

/* ===== 최근 검색 목업 ===== */
const recentSearchPool = [
  ["문화혜택", "서산 맛집 추천", "복지 혜택 신청"],
  ["교통정보", "서산시 행사", "서산 카페"],
  ["서산 명소", "전통시장", "주말 이벤트"],
  ["공원 위치", "체육시설", "노인복지관"],
  ["가족 여행지", "아이와 갈만한 곳", "주차장 위치"],
];
function getRandomList(prevList) {
  const candidates = recentSearchPool.filter(
    (arr) => arr.join("|") !== prevList.join("|")
  );
  if (candidates.length === 0) return prevList;
  const i = Math.floor(Math.random() * candidates.length);
  return candidates[i];
}

export default function AiSearch() {
  const location = useLocation();
  const [inputValue, setInputValue] = useState("");
  const [recentSearches, setRecentSearches] = useState(recentSearchPool[0]);

  // 'idle' | 'loading' | 'empty' | 'ok'
  const [searchState, setSearchState] = useState("idle");
  const [activeTab, setActiveTab] = useState("answer"); // 'answer' | 'sources'
  const [result, setResult] = useState({ answerHtml: "", sources: [] });

  // URL 파라미터에서 검색어 가져와서 자동 검색
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setInputValue(query);
      handleAiSearchWithQuery(query);
    }
  }, [location.search]);

  // 검색 실행 (공통 함수)
  const handleAiSearchWithQuery = async (query) => {
    const q = query.trim();
    if (!q) return;

    setSearchState("loading");
    
    try {
      // 실제 백엔드 AI 검색 API 호출
      const data = await aiSearchAPI.searchBrief(q);
      console.log("AI 검색 결과:", data);
      
      // 응답 데이터 형식 확인 및 처리
      if (!data) {
        setResult({ answerHtml: "", sources: [] });
        setSearchState("empty");
      } else if (data.summary || data.answer || data.content || data.response) {
        // 백엔드 응답 형식에 맞게 조정 (summary 필드 추가)
        const answerHtml = data.summary || data.answer || data.content || data.response || "답변을 생성중입니다...";
        const sources = data.sources || data.references || [];
        
        // sources가 URL 문자열 배열인 경우 객체 형태로 변환
        const formattedSources = sources.map((source, idx) => {
          if (typeof source === 'string') {
            return {
              title: `참고 자료 ${idx + 1}`,
              link: source,
              provider: new URL(source).hostname
            };
          }
          return source;
        });
        
        setResult({ answerHtml, sources: formattedSources });
        setSearchState("ok");
      } else if (data.answerHtml || data.sources) {
        // 기존 형식 지원
        setResult({
          answerHtml: data.answerHtml || "",
          sources: data.sources || []
        });
        setSearchState(data.answerHtml || (data.sources && data.sources.length > 0) ? "ok" : "empty");
      } else {
        // 알 수 없는 형식
        console.log("예상치 못한 응답 형식:", data);
        setResult({ 
          answerHtml: JSON.stringify(data, null, 2), 
          sources: [] 
        });
        setSearchState("ok");
      }
    } catch (error) {
      console.error("AI 검색 오류:", error);
      setResult({ answerHtml: "", sources: [] });
      setSearchState("empty");
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleAiSearch = () => {
    handleAiSearchWithQuery(inputValue);
  };

  // 최근 검색 새로고침
  const handleRefresh = () => {
    setRecentSearches((prevList) => getRandomList(prevList));
  };

  return (
    <div className={styles.bg}>
      {/* ===== 상단 검색바 ===== */}
      <div className={styles.topSection}>
        <div className={styles.bgBox}>
          <div className={styles.aiSearchBalloonBox}>
            <img src={SearchBalloon} alt="검색 말풍선" className={styles.balloonBg} />
            <div className={styles.balloonContent}>
              <input
                className={styles.balloonInput}
                placeholder="찾으시는 소식이 있나요?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
              />
              <button className={styles.aiSearchRight} onClick={handleAiSearch} type="button">
                <span className={styles.aiSearchBold}>AI 검색</span>
                <img src={SparkleIcon} alt="" className={styles.sparkleIcon} />
              </button>
            </div>
          </div>

          <div
            className={styles.buttonGroup}
          >
            {/* ★ 변경: 타이틀 전체를 버튼처럼 동작하게(마우스/키보드) */}
            <div
              className={styles.searchHistoryTitle}
              role="button"
              tabIndex={0}
              title="최근 검색 새로고침"
              onClick={handleRefresh}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleRefresh();
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={History}
                alt="새로고침"
                className={styles.historyIcon}
                draggable="false"
                style={{ cursor: "pointer" }}
              />
              최근 검색
            </div>

            {recentSearches.map((item, idx) => (
              <button key={item + idx} className={styles.pillBtn}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <img src={QuestionLogo} alt="logo" className={styles.questionLogo} draggable="false" />
      </div>

      {/* ===== 검색 결과 영역 (검색이 일어나면 초기 화면 숨김) ===== */}
      {searchState !== "idle" && (
        <div className={styles.aiResultWrap}>
          {/* 1) 토스트 */}
          <div className={styles.toastRow}>
            <img
              src={searchState === "empty" ? sadLogo : happyLogo}
              alt="상태 아이콘"
              className={styles.resultLogo}
            />
            <span className={styles.toastBubble}>
              {searchState === "loading"
                ? "검색 중입니다…"
                : searchState === "empty"
                ? "AI 답변이 불가능합니다 ✨"
                : "AI 답변이 완료되었습니다 ✨"}
            </span>
          </div>

          {/* 2) 탭 */}
          <div className={styles.tabsBar}>
            <button
              type="button"
              onClick={() => setActiveTab("answer")}
              className={`${styles.tabBtn} ${activeTab === "answer" ? styles.tabActive : ""}`}
            >
              답변
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sources")}
              className={`${styles.tabBtn} ${activeTab === "sources" ? styles.tabActive : ""}`}
            >
              출처
            </button>
          </div>

          {/* 3) 본문 */}
          <div className={styles.resultBody}>
            {searchState === "loading" ? null : searchState === "empty" ? (
              <div className={styles.noResultBox}>이런, 결과가 없습니다. 다시 시도해보세요.</div>
            ) : activeTab === "answer" ? (
              // ====== 여기! 흰 카드로 답변 표시 (오른쪽 스샷) ======
              <section className={styles.answerCard}>
                <div
                  className={styles.answerBody}
                  dangerouslySetInnerHTML={{ __html: result.answerHtml }}
                />
              </section>
            ) : (
              <div className={styles.resultCardList}>
                {result.sources.map((item, idx) => (
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
            )}
          </div>
        </div>
      )}

      {/* ===== 초기 랜딩(검색 전) ===== */}
      {searchState === "idle" && (
        <div className={styles.contentsWrap}>
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

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <img src={LightningIcon} alt="" className={styles.titleIcon} />
              인기 카테고리
            </div>
            <div className={styles.gridCat}>
              <div className={styles.catCard}>
                <div>
                  <div className={styles.catTitle}>뉴스</div>
                  <div className={styles.catDesc}>
                    서산의 최근소식을 여기서,<br />
                    바로 알아보세요
                  </div>
                </div>
                <img src={NewsIcon} alt="뉴스" className={styles.catImg} />
                <img src={BlackCircle} alt="arrow" className={styles.arrowIcon} />
              </div>
              <div className={styles.catCard}>
                <div>
                  <div className={styles.catTitle}>복지</div>
                  <div className={styles.catDesc}>
                    복지혜택, 찾기 힘드신가요?
                    <br />
                    통합 정보를 확인하세요
                  </div>
                </div>
                <img src={HealthIcon} alt="복지" className={styles.catImg} />
                <img src={BlackCircle} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

