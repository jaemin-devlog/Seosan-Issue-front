import React, { useState } from "react";
import styles from "./AiSearch.module.css";

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
import chainIcon from "../assets/chain.png";
import Pencil from "../assets/Pencil.png"; // 연필 아이콘(본문 bullet 전용)

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
  const [activeTab, setActiveTab] = useState("answer");
  const [result, setResult] = useState({ items: [] });

  const handleAiSearch = async () => {
    const q = inputValue.trim();
    if (!q) return;
    setSearchState("loading");

    try {
      const data = await mockSearch(q);
      if (!data || (data.items?.length ?? 0) === 0) {
        setResult({ items: [] });
        setSearchState("empty");
        setActiveTab("answer");
      } else {
        setResult(data);
        setSearchState("ok");
        setActiveTab("answer");
      }
    } catch {
      setResult({ items: [] });
      setSearchState("empty");
      setActiveTab("answer");
    }
  };

  const handleRefresh = () => setRecentSearches((prev) => getRandomList(prev));

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
                placeholder="키워드로 입력하세요"
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
            <div
              className={styles.searchHistoryTitle}
              role="button"
              tabIndex={0}
              title="최근 검색 새로고침"
              onClick={handleRefresh}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleRefresh()}
            >
              <img src={History} alt="새로고침" className={styles.historyIcon} draggable="false" />
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

      {/* ===== 결과 ===== */}
      {searchState !== "idle" && (
        <div className={styles.aiResultWrap}>
          {/* 토스트 */}
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

          {/* (결과 없을 때만 탭 노출) */}
          {searchState !== "ok" && (
            <div className={styles.tabsBar}>
              <button
                type="button"
                onClick={() => setActiveTab("answer")}
                className={`${styles.tabBtn} ${activeTab === "answer" ? styles.tabActive : ""}`}
              >
                답변
              </button>

            </div>
          )}

          {/* 본문 */}
          <div className={styles.resultBody}>
            {searchState === "loading" ? null : searchState === "empty" ? (
              <div className={styles.noResultBox}>이런, 결과가 없습니다. 다시 시도해보세요.</div>
            ) : (
              <section className={styles.ansSection}>
                <div className={styles.ansHeader}>답변</div>

                <ul className={styles.ansList}>
                  {result.items.map((it, idx) => (
                    <li key={idx} className={styles.ansItem}>
                      <div className={styles.ansNum}>{idx + 1}</div>

                      <div className={styles.ansCard}>
                        {/* 제목 + 링크 (제목엔 어떤 아이콘도 넣지 않음) */}
                        <div className={styles.ansTop}>
                          <h3 className={styles.ansTitle}>{it.title}</h3>
                          {it.link && (
                            <a
                              className={styles.ansLink}
                              href={it.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="원문 보기"
                            >
                              <img src={chainIcon} alt="링크" />
                            </a>
                          )}
                        </div>

                        <hr className={styles.ansHr} />

                        {/* 본문 bullets — 각 줄 앞에 연필 아이콘만 표기 */}
                        <ul className={styles.ansBullets} style={{ marginTop: 6 }}>
                          {it.bullets?.map((b, bi) => (
                            <li key={bi} className={styles.ansBullet}>
                              <img
                                src={Pencil}
                                alt=""
                                aria-hidden="true"
                                style={{
                                  width: 18,
                                  height: 18,
                                  verticalAlign: "middle",
                                  marginRight: 10,
                                }}
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      )}

      {/* ===== 초기 랜딩 ===== */}
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

/* ===== 목업 검색 함수 ===== */
function mockSearch(q) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (/(없어|노결과|no|zero)/i.test(q)) {
        resolve({ items: [] });
        return;
      }
      resolve({
        items: [
          {
            title: "서산시, 고령 운전자 ‘페달 오조작 방지 장치’ 설치 기원",
            bullets: [
              "충남 서산시가 고령 운전자의 교통사고 예방을 위해 페달 오조작 방지 장치 설치를 지원한다고 19일 밝혔으며, 이는 서산경찰서의 추천을 받아 선정되었다.",
            ],
            link: "#",
          },
          {
            title: "서산시 ‘시민 참여형 홍보단’ 11기 SNS 서포터스 모집",
            bullets: [
              "충남 서산시가 시민이 참여하고 소통하는 공감행정 실현을 위해 ‘제 11기 SNS 서포터스’를 모집한다고 18일 밝혔으며 서산에 대한 애정이 있는 사회 관계망 서비스 계정 운영자라면 누구나, 지역·성별, 관계없이 서포터스가 될 수 있다.",
            ],
            link: "#",
          },
        ],
      });
    }, 400);
  });
}
