// src/components/ExploreOriginal/ExplorePremium.jsx
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import styles from "./ExplorePremium.module.css";
import { seosanAPI, welfareAPI, cultureAPI, naverSearchAPI } from "../../api/backend.api";

/* ===== 이미지 ===== */
import newslogo from "../../assets/newslogo.png";
import chainIcon from "../../assets/chain.png";
import rightHere from "../../assets/RightHere.png";
import noteIcon from "../../assets/Note.png";
import listMagnifier from "../../assets/ListMagnifyingGlass.png";
import calendarIcon from "../../assets/calendar.png";
import chevronUp from "../../assets/위.png";
import chevronDown from "../../assets/아래.png";
import sparkleIcon from "../../assets/sparkle.png";

/* ===== 상수 ===== */
const REGIONS = [
  "전체","대산읍","지곡면","팔봉면","성연면","음암면","운산면","부춘동",
  "동문1동","동문2동","수석동","인지면","석남동","부석면","고북면","해미면",
];

const TABS = [
  { label: "뉴스", dropdown: true },
  { label: "복지", dropdown: true },
  { label: "문화관광", dropdown: true },
  { label: "서산시청", dropdown: true },
  { label: "카페", dropdown: false },
  { label: "블로그", dropdown: false },
];

const DROPDOWN = {
  뉴스: ["읍면동 소식", "정치 / 지방자치", "교육", "사회", "민원안내", "행정서비스"],
  복지: ["어르신", "장애인", "여성 / 가족", "아동 / 청소년", "청년"],
  문화관광: ["문화소식", "시티투어", "관광 / 안내"],
  서산시청: [ "보건/건강", "공지사항", "보도자료" ],
};

/* ===== 데모 데이터 ===== */
const MOCK = Array.from({ length: 15 }).map((_, i) => {
  const isRSV = i === 0;
  return {
    id: i + 1,
    title: isRSV
      ? "호흡기세포융합바이러스(RSV) 감염증 예방수칙(산후조리원용) 배포"
      : i % 3 === 1
      ? "제목"
      : "아동 청소년을 위한 청소년 수련관 운영",
    body: isRSV
      ? "급성호흡기감염병 유행과 관련하여 호흡기세포융합바이러스(RSV) 감염증 산후조리원의 집단발생이 증가함에 따라, 해당 감염병의 예방수칙을 배포하오니 업무에 참고하시기 바랍니다.\n\n붙임 1. 호흡기감염병 5대 예방수칙 1부.\n2. 호흡기세포융합바이러스 감염증 예방수칙_산후조리원용 포스터 1부. 끝."
      : i % 3 === 1
      ? "2줄"
      : "청소년활동진흥법의 규정에 따라 청소년활동을 적극적으로 진흥하기 위해 다양한 수련거리를 실시할 수 있도록 청소년수련관을 운영하고자 ○○에 위치한 …",
    date: isRSV ? "2025.07.31" : "2025.08.15",
    categoryPath: isRSV
      ? "서산 안내> 서산의자랑> 농특산물 품질인증마크"
      : undefined,
  };
});

const PAGE_SIZE = 5;

/* 불릿 변환(요약 문자열 → 줄 배열) */
function toBullets(s) {
  if (!s) return [];
  return s
    .split(/\n+|•|▪|●|▲|-\s+/g)
    .map((t) => t.replace(/^[•▪●▲-]\s*/, "").trim())
    .filter(Boolean);
}

/* ===== 상세 화면 ===== */
function DetailView({
  item,
  itemId,
  categoryLabel = "뉴스",
  activeRegion,
  onPrev,
  onNext,
  prevTitle,
  nextTitle,
  hasPrev = true,
  hasNext = true,
}) {
  const [detailData, setDetailData] = useState(item);
  const [loading, setLoading] = useState(false);

  // (비뉴스) AI 요약 버튼 상태
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // (뉴스 전용) 자동 요약 상태
  const [newsSummary, setNewsSummary] = useState("");
  const [newsSummaryLoading, setNewsSummaryLoading] = useState(false);
  const [newsSummaryError, setNewsSummaryError] = useState("");

  // (비뉴스) AI 요약 API 호출 버튼
  const handleSummarize = async () => {
    setSummaryLoading(true);
    try {
      const content = detailData?.body || detailData?.content || '';
      if (!content) {
        setSummary('요약할 내용이 없습니다.');
        setSummaryLoading(false);
        return;
      }

      const url = process.env.NODE_ENV === 'development'
        ? '/flask/summarize'
        : 'https://seosan-issue.shop/flask/summarize';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content })
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary || data.result || data.text || '요약 결과가 없습니다.');
      } else {
        setSummary('요약 서비스가 일시적으로 이용 불가능합니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      setSummary('요약 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setSummaryLoading(false);
    }
  };

  // 게시글 상세 조회 API 호출
  useEffect(() => {
    const fetchDetail = async () => {
      const skipCategories = ["뉴스", "카페", "블로그"];
      if (!itemId || skipCategories.includes(categoryLabel)) {
        setDetailData(item);
        return;
      }
      const backendCategories = ["복지", "서산시청", "문화관광"];
      if (!backendCategories.includes(categoryLabel)) {
        setDetailData(item);
        return;
      }

      setLoading(true);
      try {
        const { postsAPI } = await import('../../api/backend.api');
        const data = await postsAPI.getDetail(itemId);
        if (data) {
          const updatedData = {
            ...item,
            ...data,
            title: data.title || item.title || '제목 없음',
            body: data.content || data.description || data.body || item.body || '내용 없음',
            date: data.pubDate || data.date || item.date || new Date().toLocaleDateString('ko-KR'),
            link: data.link || item.link,
            categoryPath: item.categoryPath || `${categoryLabel} > ${activeRegion || '전체'}`
          };
          setDetailData(updatedData);
        }
      } catch (error) {
        setDetailData(item);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [itemId, item, categoryLabel, activeRegion]);

  // 날짜
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  }, []);
  const dateToShow = detailData?.date || todayStr;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const isNews = /^뉴스/.test(categoryLabel || "");

  // (뉴스 전용) 자동 요약: 제목+본문을 합쳐 요청
  useEffect(() => {
    if (!isNews) return;

    const title = detailData?.title || "";
    const body = detailData?.body || "";
    const content = `${title}\n\n${body}`.trim();
    if (!content) {
      setNewsSummary("");
      setNewsSummaryError("");
      setNewsSummaryLoading(false);
      return;
    }

    let aborted = false;
    (async () => {
      try {
        setNewsSummaryLoading(true);
        setNewsSummaryError("");

        const url = process.env.NODE_ENV === 'development'
          ? '/flask/summarize'
          : 'https://seosan-issue.shop/flask/summarize';

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `다음 뉴스의 핵심만 한국어로 3~5개의 불릿으로 요약해줘.
장소/기간/주체/수치가 있으면 포함해.\n\n${content}`
          }),
        });

        if (!res.ok) {
          const t = await res.text().catch(()=>"");
          throw new Error(`HTTP ${res.status} ${t.slice(0,120)}`);
        }
        const j = await res.json().catch(()=> ({}));
        const s = j.summary || j.result || j.text || "";
        if (!aborted) setNewsSummary(s);
      } catch (e) {
        if (!aborted) {
          setNewsSummary("");
          setNewsSummaryError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!aborted) setNewsSummaryLoading(false);
      }
    })();

    return () => { aborted = true; };
  }, [isNews, detailData?.title, detailData?.body]);

  // 폴백: 본문을 줄 단위로
  const fallbackNewsLines = useMemo(
    () =>
      String(detailData?.body || "-")
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5),
    [detailData?.body]
  );

  /* ✅ 배너 문구 동적 생성 */
  const bannerText = useMemo(() => {
    const title = (detailData?.title || "").replace(/\s+/g, " ").trim();
    const firstLine = (detailData?.body || "")
      .split(/\n+/)[0]
      .replace(/\s+/g, " ")
      .trim();
    const src = title || firstLine || "상세 내용을 확인하세요.";
    return src.length > 160 ? src.slice(0, 160) + "…" : src;
  }, [detailData?.title, detailData?.body]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        상세 내용을 불러오는 중...
      </div>
    );
  }

  // 뉴스 요약 불릿
  const newsBullets = newsSummary ? toBullets(newsSummary) : fallbackNewsLines;

  return (
    <>
      <div className={styles.breadcrumb}>{categoryLabel}</div>
      <h1 className={styles.detailTitle}>{detailData?.title || "제목 없음"}</h1>

      <div className={styles.detailMeta}>
        <img src={calendarIcon} alt="" className={styles.calIcon} />
        <time dateTime={dateToShow.replace(/\./g, "-")} className={styles.calDate}>
          {dateToShow}
        </time>
      </div>

      {isNews ? (
        <section className={styles.newsWrap}>
          <img src={newslogo} alt="" aria-hidden="true" className={styles.newsMascot} />
          <div className={styles.newsSummary}>
            <div className={styles.newsBadge}>
              <img src={sparkleIcon} alt="" />
              <span>
                {newsSummaryLoading ? "AI 요약 중…" : newsSummary ? "AI 요약 완료" : (newsSummaryError ? "요약 실패(원문 요약 표시)" : "AI 요약")}
              </span>
            </div>
            <p className={styles.newsLead}>
              {(detailData?.title || "해당 뉴스") + "의 핵심 요약입니다."}
            </p>
            <ul className={styles.newsList}>
              {newsBullets.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className={styles.noticeWrap}>
          <div className={styles.infoPanel}>
            {/* ✅ 모든 카테고리에서 AI 요약 버튼과 캐릭터 표시 (뉴스 제외) */}
            <div className={styles.aiSummaryContainer}>
              <img
                className={styles.aiCharacterBottom}
                src={newslogo}
                alt=""
                aria-hidden="true"
              />
              <div 
                className={`${styles.aiBubbleButton} ${summary ? styles.aiBubbleExpanded : ''}`} 
                onClick={!summary ? handleSummarize : undefined}
                style={{ cursor: !summary ? 'pointer' : 'default' }}
              >
                <div className={styles.aiBubbleHeader}>
                  <img src={sparkleIcon} alt="" className={styles.aiSparkle} />
                  <span className={styles.aiBubbleText}>
                    {summaryLoading ? "AI가 요약 중입니다..." : 
                     summary ? "AI 요약" : 
                     "AI 요약하기"}
                  </span>
                </div>
                {summary && (
                  <div className={styles.aiBubbleContent}>
                    {summary}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.tableWrap} style={{ position: "relative", zIndex: 1, overflow: "visible" }}>
              <table className={styles.detailTable}>
                <tbody>
                  <tr>
                    <th className={styles.thCol}>카테고리</th>
                    <td className={styles.tdCol}>{detailData?.categoryPath || categoryLabel}</td>
                  </tr>
                  <tr>
                    <th className={styles.thCol}>등록일</th>
                    <td className={styles.tdCol}>{dateToShow}</td>
                  </tr>
                  <tr>
                    <th className={styles.thCol}>제목</th>
                    <td className={styles.tdCol}>{detailData?.title || "-"}</td>
                  </tr>
                  <tr>
                    <th className={styles.thCol}>내용</th>
                    <td className={styles.tdCol}>
                      {String(detailData?.body || "-")
                        .split("\n")
                        .map((line, i) => (
                          <p key={i} style={{ margin: i ? "6px 0 0" : 0 }}>
                            {line}
                          </p>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th className={styles.thCol}>파일</th>
                    <td className={styles.tdCol}>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 원본 링크 표시 */}
      {detailData?.link && detailData.link !== '#' ? (
        <div className={styles.linkBar}>
          <a 
            href={detailData.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.linkBtn}
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img src={chainIcon} alt="" className="chain-img"/>
            <span>
              {categoryLabel === "뉴스" ? "원본 기사 보기 - 클릭하여 이동" : 
               categoryLabel === "카페" || categoryLabel === "블로그" ? "원본 글 보기 - 클릭하여 이동" :
               "원본 페이지 보기 - 클릭하여 이동"}
            </span>
          </a>
          <img className={styles.rightBird} src={rightHere} alt="" />
          <div className={styles.underbar} aria-hidden="true" />
        </div>
      ) : (
        <div className={styles.linkBar}>
          <div className={styles.linkBtn}>
            <img src={chainIcon} alt="" className="chain-img"/>
            <span>자세한 사항 및 파일첨부 등은 링크에서 확인하세요!</span>
          </div>
          <img className={styles.rightBird} src={rightHere} alt="" />
          <div className={styles.underbar} aria-hidden="true" />
        </div>
      )}

      {/* 이전/다음 글 */}
      <nav className={styles.pnWrap}>
        <button
          type="button"
          className={styles.pnItem}
          onClick={hasPrev ? onPrev : undefined}
          disabled={!hasPrev}
          aria-disabled={!hasPrev}
        >
          <span className={styles.pnLeft}>
            <img src={chevronUp} alt="" className={styles.pnIcon} />
            <span className={styles.pnLabel}>이전 글</span>
          </span>
          <span className={styles.pnTitle}>
            {prevTitle || "이전 글이 없습니다"}
          </span>
        </button>

        <button
          type="button"
          className={styles.pnItem}
          onClick={hasNext ? onNext : undefined}
          disabled={!hasNext}
          aria-disabled={!hasNext}
        >
          <span className={styles.pnLeft}>
            <span className={styles.pnLabel}>다음 글</span>
            <img src={chevronDown} alt="" className={styles.pnIcon} />
          </span>
          <span className={styles.pnTitle}>
            {nextTitle || "다음 글이 없습니다"}
          </span>
        </button>
      </nav>
    </>
  );
}

/* ===== 메인(목록 + 상세 전환) ===== */
export default function ExplorePremium() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const regionFromUrl = searchParams.get("region");
  const viewFromUrl = searchParams.get("view");
  const idFromUrl = Number(searchParams.get("id"));
  const pageFromUrl = Number(searchParams.get("page") || "1");
  const tabFromUrl = searchParams.get("tab");
  const subFromUrl = searchParams.get("sub");

  const [activeRegion, setActiveRegion] = useState(
    regionFromUrl && REGIONS.includes(regionFromUrl) ? regionFromUrl : "전체"
  );
  const [activeTab, setActiveTab] = useState(
    tabFromUrl && TABS.some((t) => t.label === tabFromUrl) ? tabFromUrl : "뉴스"
  );
  const [activeSub, setActiveSub] = useState(subFromUrl || "");
  const [openMenu, setOpenMenu] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [mode, setMode] = useState(viewFromUrl === "detail" ? "detail" : "list");
  const [selectedId, setSelectedId] = useState(idFromUrl ? Number(idFromUrl) : null);
  
  // API 데이터 상태 추가
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);  // 전체 데이터 개수

  const [page, setPage] = useState(!isNaN(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);
  
  // apiData가 있으면 사용, 없으면 MOCK 데이터 사용
  const dataToUse = apiData.length > 0 ? apiData : MOCK;
  // 네이버 API는 클라이언트 사이드 페이징, 나머지는 서버 사이드 페이징
  const isClientSidePaging = activeTab === "뉴스" || activeTab === "카페" || activeTab === "블로그";
  const totalPages = isClientSidePaging 
    ? Math.max(1, Math.ceil(dataToUse.length / PAGE_SIZE))
    : Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pagedItems = useMemo(() => {
    if (isClientSidePaging) {
      const start = (page - 1) * PAGE_SIZE;
      return dataToUse.slice(start, start + PAGE_SIZE);
    }
    return dataToUse;  // 서버 사이드 페이징은 이미 페이징된 데이터
  }, [page, PAGE_SIZE, dataToUse, isClientSidePaging]);

  const pageNumbers = useMemo(() => {
    const win = 5;
    let start = Math.max(1, page - Math.floor(win / 2));
    let end = Math.min(totalPages, start + win - 1);
    start = Math.max(1, end - win + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const tabBarRef = useRef(null);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data = [];
        
        // API import
        const { postsAPI } = await import('../../api/backend.api');
        
        // 탭에 따라 다른 API 호출
        switch (activeTab) {
          case "뉴스":
            // 네이버 뉴스 검색 API
            try {
              const searchQuery = activeRegion === "전체" ? "서산시" : `서산시 ${activeRegion}`;
              const newsResult = await naverSearchAPI.search(searchQuery, 'news', 20);  // 클라이언트 사이드 페이징을 위해 더 많이 가져옴
              
              // API가 배열을 직접 반환
              if (newsResult && Array.isArray(newsResult) && newsResult.length > 0) {
                data = newsResult.map((item, idx) => ({
                  id: idx + 1,
                  title: item.title
                    ? item.title
                        .replace(/<[^>]*>/g, '')  // HTML 태그 제거
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&#39;/g, "'")
                    : '제목 없음',
                  body: item.description
                    ? item.description
                        .replace(/<[^>]*>/g, '')
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&#39;/g, "'")
                    : '내용 없음',
                  date: item.date || item.pubDate || new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, ''),
                  categoryPath: `뉴스 > ${activeSub || '전체'}`,
                  link: item.link || '#'
                }));
              } else {
                // 검색 결과가 없을 경우 기본 메시지
                data = [{
                  id: 1,
                  title: '검색 결과가 없습니다',
                  body: `"${searchQuery}"에 대한 뉴스가 없습니다.`,
                  date: new Date().toLocaleDateString('ko-KR'),
                  categoryPath: '뉴스'
                }];
                setTotalCount(0);
              }
            } catch (newsError) {
              console.error('네이버 뉴스 API 에러:', newsError);
              // 에러 발생 시 기본 데이터
              data = [{
                id: 1,
                title: 'API 연결 오류',
                body: '뉴스를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                date: new Date().toLocaleDateString('ko-KR'),
                categoryPath: '뉴스'
              }];
            }
            break;
            
          case "복지": {
            // 복지 API - 서브 카테고리에 따라 다른 API 호출
            const currentPage = page - 1;  // API는 0부터 시작
            if (activeSub === "어르신") {
              data = await welfareAPI.getElderly(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else if (activeSub === "장애인") {
              data = await welfareAPI.getDisabled(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else if (activeSub === "여성 / 가족") {
              data = await welfareAPI.getWomenFamily(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else if (activeSub === "아동 / 청소년") {
              data = await welfareAPI.getChildYouth(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else if (activeSub === "청년") {
              data = await welfareAPI.getYouth(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else {
              // 서브 카테고리가 없으면 어르신 데이터를 기본으로
              data = await welfareAPI.getElderly(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            }
            // 서버 응답에서 전체 개수 정보 가져오기
            if (data && data.totalCount !== undefined) {
              setTotalCount(data.totalCount);
            } else if (Array.isArray(data)) {
              // 배열만 반환되는 경우 임시로 데이터 길이 * 10 으로 추정
              setTotalCount(data.length * 10);
            }
            // 복지 데이터 형식 변환 및 상세 내용 가져오기
            if (data && Array.isArray(data)) {
              const detailPromises = data.map(async (item) => {
                try {
                  const detailData = await postsAPI.getDetail(item.id);
                  return {
                    id: item.id || 0,
                    title: item.title || '제목 없음',
                    body: detailData?.content || item.title || '내용을 불러오는 중 오류가 발생했습니다.',
                    date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                    categoryPath: `복지 > ${activeSub || '전체'}`,
                    link: detailData?.link || item.link
                  };
                } catch (error) {
                  return {
                    id: item.id || 0,
                    title: item.title || '제목 없음',
                    body: '내용을 불러올 수 없습니다. 클릭하여 상세 내용을 확인하세요.',
                    date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                    categoryPath: `복지 > ${activeSub || '전체'}`,
                    link: item.link
                  };
                }
              });
              data = await Promise.all(detailPromises);
            }
            break;
          }
            
          case "서산시청": {
            const currentPage = page - 1;
            if (activeSub === "공지사항") {
              data = await seosanAPI.getNotices(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else if (activeSub === "보도자료") {
              data = await seosanAPI.getPressRelease(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else if (activeSub === "보건/건강") {
              data = await seosanAPI.getHealth(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else {
              data = await seosanAPI.getNotices(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            }
            if (data && data.totalCount !== undefined) {
              setTotalCount(data.totalCount);
            } else if (Array.isArray(data)) {
              setTotalCount(data.length * 10);
            }
            if (data && Array.isArray(data)) {
              const detailPromises = data.map(async (item) => {
                try {
                  const detailData = await postsAPI.getDetail(item.id);
                  return {
                    id: item.id || 0,
                    title: item.title || '제목 없음',
                    body: detailData?.content || item.title || '내용을 불러오는 중 오류가 발생했습니다.',
                    date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                    categoryPath: `서산시청 > ${activeSub || '전체'}`,
                    link: detailData?.link || item.link
                  };
                } catch (error) {
                  return {
                    id: item.id || 0,
                    title: item.title || '제목 없음',
                    body: '내용을 불러올 수 없습니다. 클릭하여 상세 내용을 확인하세요.',
                    date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                    categoryPath: `서산시청 > ${activeSub || '전체'}`,
                    link: item.link
                  };
                }
              });
              data = await Promise.all(detailPromises);
            }
            break;
          }
            
          case "문화관광": {
            const currentPage = page - 1;
            if (activeSub === "문화소식") {
              data = await cultureAPI.getCultureNews(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else if (activeSub === "시티투어") {
              data = await cultureAPI.getCityTour(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else if (activeSub === "관광 / 안내") {
              data = await cultureAPI.getTourGuide(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            } else {
              data = await cultureAPI.getCultureNews(activeRegion === "전체" ? null : activeRegion, currentPage, PAGE_SIZE);
            }
            if (data && data.totalCount !== undefined) {
              setTotalCount(data.totalCount);
            } else if (Array.isArray(data)) {
              setTotalCount(data.length * 10);
            }
            if (data && Array.isArray(data)) {
              const detailPromises = data.map(async (item) => {
                try {
                  const detailData = await postsAPI.getDetail(item.id);
                  return {
                    id: item.id || 0,
                    title: item.title || '제목 없음',
                    body: detailData?.content || item.title || '내용을 불러오는 중 오류가 발생했습니다.',
                    date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                    categoryPath: `문화관광 > ${activeSub || '전체'}`,
                    link: detailData?.link || item.link
                  };
                } catch (error) {
                  return {
                    id: item.id || 0,
                    title: item.title || '제목 없음',
                    body: '내용을 불러올 수 없습니다. 클릭하여 상세 내용을 확인하세요.',
                    date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                    categoryPath: `문화관광 > ${activeSub || '전체'}`,
                    link: item.link
                  };
                }
              });
              data = await Promise.all(detailPromises);
            }
            break;
          }
            
          case "카페":
          case "블로그":
            try {
              const searchQuery = activeRegion === "전체" ? "서산시" : `서산시 ${activeRegion}`;
              const searchType = activeTab === "카페" ? 'cafearticle' : 'blog';
              const searchResult = await naverSearchAPI.search(searchQuery, searchType, 20);
              if (searchResult && Array.isArray(searchResult) && searchResult.length > 0) {
                data = searchResult.map((item, idx) => ({
                  id: idx + 1,
                  title: item.title
                    ? item.title
                        .replace(/<[^>]*>/g, '')
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&#39;/g, "'")
                    : '제목 없음',
                  body: item.description
                    ? item.description
                        .replace(/<[^>]*>/g, '')
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&#39;/g, "'")
                    : '내용 없음',
                  date: item.date || item.postdate || new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, ''),
                  categoryPath: `${activeTab} > ${activeRegion}`,
                  link: item.link || '#',
                  cafename: item.cafename || '',
                  bloggername: item.bloggername || ''
                }));
              } else {
                data = [{
                  id: 1,
                  title: '검색 결과가 없습니다',
                  body: `"${searchQuery}"에 대한 ${activeTab} 글이 없습니다.`,
                  date: new Date().toLocaleDateString('ko-KR'),
                  categoryPath: activeTab
                }];
                setTotalCount(0);
              }
            } catch (error) {
              data = [{
                id: 1,
                title: 'API 연결 오류',
                body: `${activeTab} 글을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`,
                date: new Date().toLocaleDateString('ko-KR'),
                categoryPath: activeTab
              }];
            }
            break;
            
          default:
            data = MOCK;
        }
        
        setApiData(data || []);
      } catch (err) {
        setError(err.message);
        if (activeTab === "뉴스" || activeTab === "카페" || activeTab === "블로그") {
          setApiData([]);
        } else {
          setApiData([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, activeSub, activeRegion, page]);

  useEffect(() => {
    if (regionFromUrl && REGIONS.includes(regionFromUrl)) setActiveRegion(regionFromUrl);
    if (tabFromUrl && TABS.some((t) => t.label === tabFromUrl)) setActiveTab(tabFromUrl);
    setActiveSub(subFromUrl || "");
    setMode(viewFromUrl === "detail" ? "detail" : "list");
    if (idFromUrl) setSelectedId(Number(idFromUrl));
    window.scrollTo(0, 0);
  }, [regionFromUrl, tabFromUrl, subFromUrl, viewFromUrl, idFromUrl]);

  useEffect(() => {
    const p = Number(searchParams.get("page") || "1");
    if (!isNaN(p) && p > 0) setPage(p);
  }, [searchParams]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeRegion, activeTab]);
  
  useEffect(() => {
    if (location.state?.scrollToTop) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.tab) {
      const tab = location.state.tab;
      if (tab && TABS.some(t => t.label === tab)) {
        setActiveTab(tab);
      }
    }
    
    if (location.state?.selectedItem) {
      const item = location.state.selectedItem;
      const tab = location.state.tab || item.tag;
      const view = location.state.view || 'detail';
      
      if (tab && TABS.some(t => t.label === tab)) {
        setActiveTab(tab);
      }
      if (view === 'detail') {
        setMode('detail');
        const itemWithBody = {
          ...item,
          id: Number(item.id),
          body: item.content || item.description || item.date || '상세 내용이 없습니다.',
          categoryPath: item.categoryPath || `${tab} > ${item.tag || '일반'}`
        };
        const existingData = apiData.length > 0 ? apiData : MOCK;
        const itemExists = existingData.some(d => Number(d.id) === Number(item.id));
        if (!itemExists) {
          setApiData([itemWithBody, ...existingData]);
        } else {
          setApiData(existingData.map(d => 
            Number(d.id) === Number(item.id) ? itemWithBody : d
          ));
        }
        setSelectedId(Number(item.id));
      }
      const newParams = new URLSearchParams(searchParams);
      newParams.set('view', 'detail');
      newParams.set('tab', tab);
      newParams.set('id', String(item.id));
      setSearchParams(newParams, { replace: true });
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    const close = (e) => {
      if (tabBarRef.current && !tabBarRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleRegionClick = useCallback(
    (region) => {
      if (region !== activeRegion) {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveRegion(region);
          setPage(1);
          const next = new URLSearchParams(searchParams);
          next.set("region", region);
          next.set("view", "list");
          next.set("page", "1");
          next.set("tab", activeTab);
          if (activeSub) next.set("sub", activeSub);
          else next.delete("sub");
          next.delete("id");
          setSearchParams(next);
          setIsTransitioning(false);
          window.scrollTo(0, 0);
        }, 150);
      }
    },
    [activeRegion, activeTab, activeSub, searchParams, setSearchParams]
  );

  const handleTabClick = useCallback(
    (tab) => {
      const nextActive = tab.label;
      setActiveTab(nextActive);
      setPage(1);

      const next = new URLSearchParams(searchParams);
      next.set("view", "list");
      next.set("page", "1");
      next.set("region", activeRegion);
      next.set("tab", nextActive);
      next.delete("id");
      next.delete("sub");
      setActiveSub("");
      setSearchParams(next);

      if (tab.dropdown) setOpenMenu((prev) => (prev === nextActive ? null : nextActive));
      else setOpenMenu(null);
    },
    [activeRegion, searchParams, setSearchParams]
  );

  const handleSubSelect = useCallback(
    (opt) => {
      setActiveSub(opt);
      setOpenMenu(null);
      setPage(1);
      const next = new URLSearchParams(searchParams);
      next.set("region", activeRegion);
      next.set("tab", activeTab);
      next.set("sub", opt);
      next.set("view", "list");
      next.set("page", "1");
      next.delete("id");
      setSearchParams(next);
    },
    [activeRegion, activeTab, searchParams, setSearchParams]
  );

  const goToPage = useCallback(
    (p) => {
      const n = Math.min(Math.max(1, p), totalPages);
      setPage(n);
      const next = new URLSearchParams(searchParams);
      next.set("region", activeRegion);
      next.set("tab", activeTab);
      if (activeSub) next.set("sub", activeSub);
      else next.delete("sub");
      next.set("view", "list");
      next.set("page", String(n));
      next.delete("id");
      setSearchParams(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages, searchParams, setSearchParams, activeRegion, activeTab, activeSub]
  );

  const openDetail = useCallback(
    (id) => {
      setSelectedId(Number(id));
      setMode("detail");
      setOpenMenu(null);
      const next = new URLSearchParams(searchParams);
      next.set("region", activeRegion);
      next.set("tab", activeTab);
      if (activeSub) next.set("sub", activeSub);
      else next.delete("sub");
      next.set("view", "detail");
      next.set("id", String(id));
      next.set("page", String(page));
      setSearchParams(next);
      window.scrollTo(0, 0);
    },
    [activeRegion, activeTab, activeSub, page, searchParams, setSearchParams]
  );

  /* ====== 이전/다음 계산 & 이동 ====== */
  const selectedItem = useMemo(
    () => dataToUse.find((m) => Number(m.id) === Number(selectedId)) || dataToUse[0],
    [selectedId, dataToUse]
  );
  const currentIndex = useMemo(
    () => dataToUse.findIndex((m) => Number(m.id) === Number(selectedItem.id)),
    [selectedItem, dataToUse]
  );
  const prevItem = currentIndex > 0 ? dataToUse[currentIndex - 1] : null;
  const nextItem = currentIndex < dataToUse.length - 1 ? dataToUse[currentIndex + 1] : null;

  const goPrev = useCallback(() => {
    if (currentIndex > 0) openDetail(dataToUse[currentIndex - 1].id);
  }, [currentIndex, openDetail, dataToUse]);

  const goNext = useCallback(() => {
    if (currentIndex < dataToUse.length - 1) openDetail(dataToUse[currentIndex + 1].id);
  }, [currentIndex, openDetail, dataToUse]);

  const countText = useMemo(() => {
    const total = isClientSidePaging ? dataToUse.length : totalCount;
    return `결과 ${total.toLocaleString()}개`;
  }, [dataToUse.length, totalCount, isClientSidePaging]);

  return (
    <div className={styles.page}>
      <div className={styles.tabPill} ref={tabBarRef}>
        {TABS.map((t) => {
          const active = t.label === activeTab;
          const opened = openMenu === t.label;
          return (
            <div key={t.label} className={styles.tabItem}>
              <button
                type="button"
                className={`${styles.tabBtn} ${active ? styles.tabBtnActive : ""}`}
                onClick={() => handleTabClick(t)}
              >
                <span>{t.label}</span>
                {t.dropdown && (
                  <span className={`${styles.caret} ${opened ? styles.caretUp : ""}`}>▾</span>
                )}
              </button>

              {t.dropdown && opened && (
                <div className={styles.ddMenu}>
                  <ul className={styles.ddList}>
                    {DROPDOWN[t.label].map((opt, idx) => (
                      <li
                        key={opt}
                        className={`${styles.ddItem} ${
                          activeSub === opt ? styles.ddItemActive : ""
                        }`}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        onClick={() => handleSubSelect(opt)}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 목록 */}
      {mode === "list" && (
        <div className={styles.frame}>
          <aside className={styles.side}>
            <div className={styles.sideTitle}>지역</div>
            <ul className={styles.sideList}>
              {REGIONS.map((r, i) => (
                <li
                  key={r}
                  className={`${styles.sideItem} ${r === activeRegion ? styles.sideItemActive : ""}`}
                  onClick={() => handleRegionClick(r)}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </aside>

          <main className={styles.main}>
            <div className={styles.listContainer}>
              {/* 브레드크럼 */}
              {activeSub ? (
                <div className={styles.filterCrumb}>
                  <span>{activeTab}</span>
                  <span className={styles.crumbSep}>›</span>
                  <span>{activeSub}</span>
                </div>
              ) : null}

              {/* 결과 바 */}
              <div className={styles.countBar}>
                <span className={styles.countIconWrap}>
                  <img src={listMagnifier} alt="" />
                </span>
                <span>{countText}</span>
              </div>

              <section className={`${styles.list} ${isTransitioning ? styles.transitioning : ""}`}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  데이터를 불러오는 중...
                </div>
              ) : error ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  데이터를 불러올 수 없습니다. (임시 데이터 표시 중)
                </div>
              ) : pagedItems.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  검색 결과가 없습니다.
                </div>
              ) : (
                pagedItems.map((item, index) => (
                  <article key={item.id} className={styles.card} style={{ animationDelay: `${index * 80}ms` }}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <div className={styles.divider} />
                    <p className={styles.cardBody}>
                      {item.body}
                    </p>
                    {activeTab === "카페" && (
                      <p className={styles.cafeNotice}>※ 카페 가입이 필요할 수 있습니다</p>
                    )}
                    <div className={styles.cardFooter}>
                      {activeTab === "카페" && item.link && item.link !== '#' ? (
                        <>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                            바로가기
                          </a>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.circleIcon} aria-label="카페로 이동">
                            <img className={styles.noticeIcon} src={chainIcon} alt="" />
                          </a>
                        </>
                      ) : (
                        <>
                          <button type="button" className={styles.viewLink} onClick={() => openDetail(item.id)}>
                            보기
                          </button>
                          <button type="button" className={styles.circleIcon} aria-label="상세 보기" onClick={() => openDetail(item.id)}>
                            <img className={styles.noticeIcon} src={noteIcon} alt="" />
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))
              )}
            </section>

            <nav className={styles.paginationWrap} aria-label="페이지네이션">
              <button type="button" className={styles.pageArrow} disabled={page === 1} onClick={() => goToPage(1)} aria-label="첫 페이지">«</button>
              <button type="button" className={styles.pageArrow} disabled={page === 1} onClick={() => goToPage(page - 1)} aria-label="이전 페이지">‹</button>
              {pageNumbers.map((n) => (
                <button key={n} type="button" className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`} onClick={() => goToPage(n)} aria-current={n === page ? "page" : undefined}>
                  {n}
                </button>
              ))}
              <button type="button" className={styles.pageArrow} disabled={page === totalPages} onClick={() => goToPage(page + 1)} aria-label="다음 페이지">›</button>
              <button type="button" className={styles.pageArrow} disabled={page === totalPages} onClick={() => goToPage(totalPages)} aria-label="마지막 페이지">»</button>
            </nav>
            </div>
          </main>
        </div>
      )}

      {/* 상세 */}
      {mode === "detail" && (
        <div className={styles.frame}>
          <aside className={styles.side}>
            <div className={styles.sideTitle}>지역</div>
            <ul className={styles.sideList}>
              {REGIONS.map((r, i) => (
                <li
                  key={r}
                  className={`${styles.sideItem} ${r === activeRegion ? styles.sideItemActive : ""}`}
                  onClick={() => handleRegionClick(r)}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </aside>

          <main className={styles.main}>
            <DetailView
              item={selectedItem}
              itemId={selectedItem?.id}
              categoryLabel={activeTab}
              activeRegion={activeRegion}
              onPrev={goPrev}
              onNext={goNext}
              prevTitle={prevItem?.title}
              nextTitle={nextItem?.title}
              hasPrev={!!prevItem}
              hasNext={!!nextItem}
            />
          </main>
        </div>
      )}
    </div>
  );
}
