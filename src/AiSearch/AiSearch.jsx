import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

/* ===== 추천 검색 키워드 목업 ===== */
const recentSearchPool = [
  ["맛집", "노인복지", "서산교통"],
  ["해미읍성", "복지 혜택", "서산 카페"],
  ["서산 명소", "전통시장", "문화행사"],
  ["체육시설", "서산시청", "교통정보"],
  ["관광지", "서산 맛집", "주차장"],
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
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [recentSearches, setRecentSearches] = useState(recentSearchPool[0]);

  // 'idle' | 'loading' | 'empty' | 'ok'
  const [searchState, setSearchState] = useState("idle");
  const [activeTab, setActiveTab] = useState("answer"); // 'answer' | 'sources'
  const [result, setResult] = useState({ answerHtml: "", sources: [] });
  const [useDetailSearch, setUseDetailSearch] = useState(true); // 상세 검색 사용 여부 (true로 설정하여 상세 검색 사용)

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
      // 실제 백엔드 AI 검색 API 호출 - 상세 검색 사용
      console.log(`AI 검색 시작: "${q}"`);
      const data = useDetailSearch 
        ? await aiSearchAPI.searchDetail(q) 
        : await aiSearchAPI.searchBrief(q);
      console.log(useDetailSearch ? "AI 상세 검색 결과:" : "AI 간략 검색 결과:", data);
      console.log("응답 데이터 타입:", typeof data);
      console.log("응답 키:", data ? Object.keys(data) : "null");
      
      // 응답 데이터 형식 확인 및 처리
      if (!data) {
        console.log("데이터가 null 또는 undefined");
        setResult({ answerHtml: "죄송합니다. 검색 결과를 찾을 수 없습니다.", sources: [] });
        setSearchState("empty");
      } else if (data.error) {
        console.log("API 에러 응답:", data.error);
        setResult({ answerHtml: data.error || "검색 중 오류가 발생했습니다.", sources: [] });
        setSearchState("empty");
      } else if (data.tldr && data.items) {
        // 상세 검색 API 응답 형식 처리
        console.log("상세 검색 응답 처리:", data);
        
        // items의 내용을 스크린샷 형태로 표시
        let answerHtml = '';
        
        if (data.items && data.items.length > 0) {
          data.items.forEach((item, idx) => {
            answerHtml += `
              <div style="margin: 20px 0; background: #f5f5f5; border-radius: 12px; padding: 20px;">
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="width: 40px; height: 40px; background: #2d2d2d; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; flex-shrink: 0;">
                    ${idx + 1}
                  </div>
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <h3 style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                        ${item.title || '제목 없음'}
                      </h3>
                      <a href="${item.url}" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #26d0ce; border-radius: 50%; text-decoration: none;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    </div>
                    <div style="width: 100%; height: 1px; background: #e5e5e5; margin-bottom: 12px;"></div>
                    <p style="margin: 0; color: #5a5a5a; font-size: 14px; line-height: 1.6;">
                      ${item.summary || item.content?.substring(0, 300) || '내용 없음'}
                    </p>
                  </div>
                </div>
              </div>
            `;
          });
        } else if (data.tldr) {
          // items가 없으면 tldr만 표시
          answerHtml = `<p style="padding: 20px; background: #f8f9fa; border-radius: 8px; line-height: 1.6;">${data.tldr}</p>`;
        }
        
        // sources 처리 (URL 배열 또는 items에서 추출)
        const sources = data.sources || data.items?.map(item => ({
          title: item.title || '참고 자료',
          link: item.url,
          provider: item.url ? new URL(item.url).hostname : '출처 없음'
        })) || [];
        
        const formattedSources = sources.map((source, idx) => {
          if (typeof source === 'string') {
            return {
              title: `참고 자료 ${idx + 1}`,
              link: source,
              provider: source.includes('http') ? new URL(source).hostname : '서산시'
            };
          }
          return source;
        });
        
        setResult({ answerHtml, sources: formattedSources });
        setSearchState("ok");
      } else if (data.summary || data.answer || data.content || data.response || data.detailed_answer || data.result) {
        // 간략 검색 API 응답 형식 처리
        const summaryText = data.result || data.detailed_answer || data.summary || data.answer || data.content || data.response || "답변을 생성중입니다...";
        const sources = data.sources || data.references || data.related_links || data.links || [];
        
        console.log("추출된 답변:", summaryText);
        console.log("추출된 소스:", sources);
        
        // 간략 검색도 동일한 형태로 표시
        let answerHtml = `
          <div style="margin: 20px 0; background: #f5f5f5; border-radius: 12px; padding: 20px;">
            <div style="display: flex; align-items: flex-start; gap: 15px;">
              <div style="width: 40px; height: 40px; background: #2d2d2d; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; flex-shrink: 0;">
                1
              </div>
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <h3 style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                    서산시 관련 정보 검색 결과
                  </h3>
                </div>
                <div style="width: 100%; height: 1px; background: #e5e5e5; margin-bottom: 12px;"></div>
                <p style="margin: 0; color: #5a5a5a; font-size: 14px; line-height: 1.6;">
                  ${summaryText}
                </p>
              </div>
            </div>
          </div>
        `;
        
        // sources가 있으면 추가 항목으로 표시
        if (sources && sources.length > 0) {
          sources.forEach((source, idx) => {
            const sourceTitle = typeof source === 'string' 
              ? `참고 자료 ${idx + 1}` 
              : (source.title || source.name || `참고 자료 ${idx + 1}`);
            const sourceLink = typeof source === 'string' 
              ? source 
              : (source.link || source.url || '#');
            
            answerHtml += `
              <div style="margin: 20px 0; background: #f5f5f5; border-radius: 12px; padding: 20px;">
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="width: 40px; height: 40px; background: #2d2d2d; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; flex-shrink: 0;">
                    ${idx + 2}
                  </div>
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <h3 style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                        ${sourceTitle}
                      </h3>
                      <a href="${sourceLink}" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #26d0ce; border-radius: 50%; text-decoration: none;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    </div>
                    <div style="width: 100%; height: 1px; background: #e5e5e5; margin-bottom: 12px;"></div>
                    <p style="margin: 0; color: #5a5a5a; font-size: 14px; line-height: 1.6;">
                      ${sourceLink}
                    </p>
                  </div>
                </div>
              </div>
            `;
          });
        }
        
        // sources가 URL 문자열 배열인 경우 객체 형태로 변환
        const formattedSources = sources.map((source, idx) => {
          if (typeof source === 'string') {
            return {
              title: `참고 자료 ${idx + 1}`,
              link: source,
              provider: source.includes('http') ? new URL(source).hostname : '서산시'
            };
          }
          return {
            title: source.title || source.name || `참고 자료 ${idx + 1}`,
            link: source.link || source.url || '#',
            provider: source.provider || source.source || '서산시'
          };
        });
        
        setResult({ answerHtml, sources: formattedSources });
        setSearchState("ok");
      } else if (data.answerHtml || data.sources) {
        // 기존 형식 지원
        console.log("기존 형식 응답 처리");
        setResult({
          answerHtml: data.answerHtml || "",
          sources: data.sources || []
        });
        setSearchState(data.answerHtml || (data.sources && data.sources.length > 0) ? "ok" : "empty");
      } else if (typeof data === 'string') {
        // 문자열로 직접 응답이 온 경우
        console.log("문자열 응답 처리:", data);
        setResult({ 
          answerHtml: data, 
          sources: [] 
        });
        setSearchState("ok");
      } else {
        // 알 수 없는 형식 - 객체의 모든 내용을 표시
        console.log("예상치 못한 응답 형식:", data);
        let responseText = "";
        if (data.message) responseText = data.message;
        else if (data.text) responseText = data.text;
        else if (data.data) responseText = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);
        else responseText = JSON.stringify(data, null, 2);
        
        setResult({ 
          answerHtml: responseText, 
          sources: [] 
        });
        setSearchState(responseText ? "ok" : "empty");
      }
    } catch (error) {
      console.error("AI 검색 오류:", error);
      console.error("에러 상세:", error.message, error.stack);
      setResult({ 
        answerHtml: `검색 중 오류가 발생했습니다: ${error.message || '네트워크 오류'}`, 
        sources: [] 
      });
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
              title="추천 검색 새로고침"
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
              추천 검색
            </div>
            

            {recentSearches.map((item, idx) => (
              <button 
                key={item + idx} 
                className={styles.pillBtn}
                onClick={() => {
                  setInputValue(item);
                  handleAiSearchWithQuery(item);
                }}
              >
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
                ? "AI가 정보를 수집하고 있어요 🔍"
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
            {searchState === "loading" ? (
              <div className={styles.loadingContainer}>
                {/* 로딩 스피너 */}
                <div className={styles.loadingSpinner}></div>
                
                {/* 로딩 메시지 */}
                <h3 className={styles.loadingTitle}>
                  AI가 열심히 답변을 준비하고 있어요
                </h3>
                
                {/* 부가 설명 */}
                <p className={styles.loadingDescription}>
                  서산시의 다양한 정보를 종합하여<br/>
                  가장 정확한 답변을 찾고 있습니다.<br/>
                  잠시만 기다려주세요! (약 15-20초)
                </p>
                
                {/* 움직이는 도트 애니메이션 */}
                <div className={styles.loadingDots}>
                  <span className={styles.loadingDot}>•</span>
                  <span className={styles.loadingDot}>•</span>
                  <span className={styles.loadingDot}>•</span>
                </div>
              </div>
            ) : searchState === "empty" ? (
              <div className={styles.noResultBox}>이런, 결과가 없습니다. 다시 시도해보세요.</div>
            ) : activeTab === "answer" ? (
              // 개별 섹션으로 표시 (외부 wrapper 없이)
              <div
                dangerouslySetInnerHTML={{ 
                  __html: result.answerHtml.includes('<') 
                    ? result.answerHtml  // 이미 HTML이면 그대로 사용
                    : result.answerHtml
                        .replace(/\n/g, '<br/>')  // 줄바꿈 처리
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // 굵은 글씨
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')  // 기울임
                }}
              />
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
              인기 키워드
            </div>
            <div className={styles.grid}>
              {[
                { tag: "민원", text: "민원 신청" },
                { tag: "복지", text: "노인복지" },
                { tag: "행사", text: "서산 행사" },
                { tag: "관광", text: "해미읍성" },
              ].map((q, i) => (
                <div 
                  key={i} 
                  className={styles.card}
                  onClick={() => {
                    setInputValue(q.text);
                    handleAiSearchWithQuery(q.text);
                  }}
                  style={{ cursor: 'pointer' }}
                >
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
              <div 
                className={styles.catCard}
                onClick={() => navigate('/explore', { state: { tab: '뉴스' } })}
                style={{ cursor: 'pointer' }}
              >
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
              <div 
                className={styles.catCard}
                onClick={() => navigate('/explore', { state: { tab: '복지' } })}
                style={{ cursor: 'pointer' }}
              >
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

