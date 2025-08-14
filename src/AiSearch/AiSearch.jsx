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
import SparkleIcon from "../assets/sparkle.png";
import sadLogo from "../assets/sadLogo.png";
import happyLogo from "../assets/HappyLogo.png";


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
  const [inputValue, setInputValue] = useState("");
  const [recentSearches, setRecentSearches] = useState(recentSearchPool[0]);

  // 'idle' | 'loading' | 'empty' | 'ok'
  const [searchState, setSearchState] = useState("idle");
  const [activeTab, setActiveTab] = useState("answer"); // 'answer' | 'sources'
  const [result, setResult] = useState({ answerHtml: "", sources: [] });

  // 검색 실행
  const handleAiSearch = async () => {
    const q = inputValue.trim();
    if (!q) return;

    try {
      const data = await mockSearch(q); // ← 실제 API로 교체
      if (
        !data ||
        (!data.answerHtml && (!data.sources || data.sources.length === 0))
      ) {
        setResult({ answerHtml: "", sources: [] });
        setSearchState("empty");
      } else {
        setResult(data);
        setSearchState("ok");
      }
    } catch {
      setResult({ answerHtml: "", sources: [] });
      setSearchState("empty");
    }
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

          <div className={styles.buttonGroup}>
            <div className={styles.searchHistoryTitle}>
              <img
                src={History}
                alt="새로고침"
                className={styles.historyIcon}
                onClick={handleRefresh}
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
                  <div className={styles.catTitle}>교통</div>
                  <div className={styles.catDesc}>
                    복잡한 서산시의 교통 노선,<br />
                    바로 알아보세요
                  </div>
                </div>
                <img src={BusIcon} alt="교통" className={styles.catImg} />
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

/* ===== 목업 검색 함수 (나중에 실제 API로 교체) ===== */
function mockSearch(q) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (/(없어|노결과|no|zero)/i.test(q)) {
        resolve({ answerHtml: "", sources: [] });
        return;
      }
      const answerHtml = `
        <h2 class="${styles.answerTitle}">서산시의 노인 복지에 대한 주요 내용은 다음과 같아요.</h2>
        <hr class="${styles.answerHr}" />
        <h3 class="${styles.answerH3}">• 주요 복지 정책 및 사업</h3>
        <p class="${styles.answerP}">
          <b>노인여가복지시설 지원:</b> 서산시는 경로당, 마을회관 등 관내 440개소의 노인여가복지시설을 대상으로 난방비와 각종 물품을 지원하고 있습니다.
          또한, 어르신들의 안전을 위해 시설에 대한 종합 보험 가입을 지원하고, 주기적인 소독을 실시하여 전염병을 예방하고 있습니다.
        </p>
        <p class="${styles.answerP}">
          <b>노인 일자리 사업:</b> 어르신들의 경제적 안정과 사회 참여를 돕기 위해 노인 일자리를 제공하고 있습니다.
        </p>
        <hr class="${styles.answerHr}" />
        <h3 class="${styles.answerH3}">• 주요 복지 시설</h3>
        <p class="${styles.answerP}">
          <b>서산노인복지센터:</b> 지곡면에 위치한 시설로, 노인 장기요양보험 관련 서비스를 제공합니다.
        </p>
        <p class="${styles.answerP}">
          <b>서산한노인복지센터:</b> 음암면에 위치한 요양시설입니다.
        </p>
        <p class="${styles.answerP}">
          <b>우리들주야간노인복지센터:</b> 수석동에 위치하며 방문목욕, 방문요양, 주·야간 보호 등 다양한 재가노인복지 서비스를 제공합니다.
        </p>
      `;
      resolve({
        answerHtml,
        sources: [
          { title: "충청남도 서산시_재가노인 복지시설", link: "#", provider: "충청남도 데이터포털 올담" },
          { title: "충청남도 서산시_노인의료복지시설", link: "#", provider: "충청남도 데이터포털 올담" },
        ],
      });
    }, 400);
  });
}
