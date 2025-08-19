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
  "대산읍","지곡면","팔봉면","성연면","음암면","운산면","부춘동",
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

/* ===== 상세 화면 ===== */
function DetailView({
  item,
  categoryLabel = "뉴스",
  onPrev,
  onNext,
  prevTitle,
  nextTitle,
  hasPrev = true,
  hasNext = true,
}) {
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  }, []);
  const dateToShow = item?.date || todayStr;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const isNews = /^뉴스/.test(categoryLabel || "");
  const newsBullets = useMemo(
    () =>
      String(item?.body || "-")
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [item?.body]
  );

  /* ✅ 배너 문구 동적 생성 */
  const bannerText = useMemo(() => {
    const title = (item?.title || "").replace(/\s+/g, " ").trim();
    const firstLine = (item?.body || "")
      .split(/\n+/)[0]
      .replace(/\s+/g, " ")
      .trim();
    const src = title || firstLine || "상세 내용을 확인하세요.";
    return src.length > 160 ? src.slice(0, 160) + "…" : src;
  }, [item?.title, item?.body]);

  return (
    <>
      <div className={styles.breadcrumb}>{categoryLabel}</div>
      <h1 className={styles.detailTitle}>{item?.title || "제목 없음"}</h1>

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
              <span>AI 요약 완료</span>
            </div>
            <p className={styles.newsLead}>
              {(item?.title || "해당 뉴스") + "에 대한 주요 내용은 다음과 같아요."}
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
            {/* ✅ 배너 문구가 선택된 글에 따라 바뀜 */}
            <div className={styles.panelBanner}>
              <img src={sparkleIcon} alt="" className={styles.bannerSparkle} />
              <span className={styles.bannerText}>{bannerText}</span>
            </div>

            <div className={styles.tableWrap} style={{ position: "relative", zIndex: 1, overflow: "visible" }}>
              <img
                className={styles.panelMascot}
                src={newslogo}
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 70,
                  top: -50,
                  width: 92,
                  height: "auto",
                  zIndex: 1,
                  pointerEvents: "none",
                  filter: "drop-shadow(0 6px 12px rgba(0,0,0,.08))",
                }}
              />
              <table className={styles.detailTable}>
                <tbody>
                  <tr>
                    <th className={styles.thCol}>카테고리</th>
                    <td className={styles.tdCol}>{item?.categoryPath || categoryLabel}</td>
                  </tr>
                  <tr>
                    <th className={styles.thCol}>등록일</th>
                    <td className={styles.tdCol}>{dateToShow}</td>
                  </tr>
                  <tr>
                    <th className={styles.thCol}>제목</th>
                    <td className={styles.tdCol}>{item?.title || "-"}</td>
                  </tr>
                  <tr>
                    <th className={styles.thCol}>내용</th>
                    <td className={styles.tdCol}>
                      {String(item?.body || "-")
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

      {/* 원본 링크 표시 - 뉴스/카페/블로그에서만 표시 */}
      {item?.link && (item?.link !== '#') && (
        <div className={styles.linkBar}>
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.linkBtn}
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img src={chainIcon} alt="" className="chain-img"/>
            <span>원본 기사 보기 - 클릭하여 이동</span>
          </a>
          <img className={styles.rightBird} src={rightHere} alt="" />
          <div className={styles.underbar} aria-hidden="true" />
        </div>
      )}
      
      {/* 원본 링크가 없는 경우 기존 안내 문구 */}
      {(!item?.link || item?.link === '#') && (
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
    regionFromUrl && REGIONS.includes(regionFromUrl) ? regionFromUrl : "대산읍"
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

  const [page, setPage] = useState(!isNaN(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);
  
  // apiData가 있으면 사용, 없으면 MOCK 데이터 사용
  const dataToUse = apiData.length > 0 ? apiData : MOCK;
  const totalPages = Math.max(1, Math.ceil(dataToUse.length / PAGE_SIZE));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return dataToUse.slice(start, start + PAGE_SIZE);
  }, [page, dataToUse]);

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
        
        // 탭에 따라 다른 API 호출
        switch (activeTab) {
          case "뉴스":
            // 네이버 뉴스 검색 API
            try {
              const searchQuery = `서산시 ${activeRegion}`;
              const newsResult = await naverSearchAPI.search(searchQuery, 'news', 20);
              
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
            
          case "복지":
            // 복지 API - 서브 카테고리에 따라 다른 API 호출
            if (activeSub === "어르신") {
              data = await welfareAPI.getElderly();
            } else if (activeSub === "장애인") {
              data = await welfareAPI.getDisabled();
            } else if (activeSub === "여성 / 가족") {
              data = await welfareAPI.getWomenFamily();
            } else if (activeSub === "아동 / 청소년") {
              data = await welfareAPI.getChildYouth();
            } else if (activeSub === "청년") {
              data = await welfareAPI.getYouth();
            } else {
              // 서브 카테고리가 없으면 어르신 데이터를 기본으로
              data = await welfareAPI.getElderly();
            }
            // 복지 데이터 형식 변환
            if (data && Array.isArray(data)) {
              data = data.map((item, idx) => ({
                id: item.id || idx + 1,
                title: item.title || item.name || '제목 없음',
                body: item.description || item.content || item.pubDate || '내용 없음',
                date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                categoryPath: `복지 > ${activeSub || '전체'}`
              }));
            }
            break;
            
          case "서산시청":
            // 서산시청 API
            if (activeSub === "공지사항") {
              data = await seosanAPI.getNotices();
            } else if (activeSub === "보도자료") {
              data = await seosanAPI.getPressRelease();
            } else if (activeSub === "보건/건강") {
              data = await seosanAPI.getHealth();
            } else {
              // 기본값으로 공지사항
              data = await seosanAPI.getNotices();
            }
            // 서산시청 데이터 형식 변환
            if (data && Array.isArray(data)) {
              data = data.map((item, idx) => ({
                id: item.id || idx + 1,
                title: item.title || '제목 없음',
                body: item.content || item.description || item.pubDate || '내용 없음',
                date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                categoryPath: `서산시청 > ${activeSub || '전체'}`
              }));
            }
            break;
            
          case "문화관광":
            // 문화 API
            if (activeSub === "문화소식") {
              data = await cultureAPI.getCultureNews();
            } else if (activeSub === "시티투어") {
              data = await cultureAPI.getCityTour();
            } else if (activeSub === "관광 / 안내") {
              data = await cultureAPI.getTourGuide();
            } else {
              // 기본값으로 문화소식
              data = await cultureAPI.getCultureNews();
            }
            // 문화 데이터 형식 변환
            if (data && Array.isArray(data)) {
              data = data.map((item, idx) => ({
                id: item.id || idx + 1,
                title: item.title || '제목 없음',
                body: item.content || item.description || item.pubDate || '내용 없음',
                date: item.pubDate || item.date || new Date().toLocaleDateString('ko-KR'),
                categoryPath: `문화관광 > ${activeSub || '전체'}`
              }));
            }
            break;
            
          case "카페":
          case "블로그":
            // 네이버 카페/블로그 검색 API
            try {
              const searchQuery = `서산시 ${activeRegion}`;
              const searchType = activeTab === "카페" ? 'cafearticle' : 'blog';
              const searchResult = await naverSearchAPI.search(searchQuery, searchType, 20);
              
              // API가 배열을 직접 반환
              if (searchResult && Array.isArray(searchResult) && searchResult.length > 0) {
                data = searchResult.map((item, idx) => ({
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
                  date: item.date || item.postdate || new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, ''),
                  categoryPath: `${activeTab} > ${activeRegion}`,
                  link: item.link || '#',
                  cafename: item.cafename || '',
                  bloggername: item.bloggername || ''
                }));
              } else {
                // 검색 결과가 없을 경우
                data = [{
                  id: 1,
                  title: '검색 결과가 없습니다',
                  body: `"${searchQuery}"에 대한 ${activeTab} 글이 없습니다.`,
                  date: new Date().toLocaleDateString('ko-KR'),
                  categoryPath: activeTab
                }];
              }
            } catch (error) {
              console.error(`네이버 ${activeTab} API 에러:`, error);
              // 에러 발생 시 기본 데이터
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
            // 기본값으로 MOCK 데이터 사용
            data = MOCK;
        }
        
        setApiData(data || []);
      } catch (err) {
        setError(err.message);
        // 뉴스/카페/블로그는 에러가 발생해도 mock 데이터를 사용
        if (activeTab === "뉴스" || activeTab === "카페" || activeTab === "블로그") {
          // 여기서는 빈 배열로 설정하여 상위의 MOCK 데이터가 사용되도록 함
          setApiData([]);
        } else {
          setApiData([]); // 다른 탭은 에러 시 빈 배열
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, activeSub, activeRegion]);

  useEffect(() => {
    if (regionFromUrl && REGIONS.includes(regionFromUrl)) setActiveRegion(regionFromUrl);
    if (tabFromUrl && TABS.some((t) => t.label === tabFromUrl)) setActiveTab(tabFromUrl);
    setActiveSub(subFromUrl || "");
    setMode(viewFromUrl === "detail" ? "detail" : "list");
    if (idFromUrl) setSelectedId(Number(idFromUrl));
    // URL 파라미터가 변경되면 상단으로 스크롤
    window.scrollTo(0, 0);
  }, [regionFromUrl, tabFromUrl, subFromUrl, viewFromUrl, idFromUrl]);

  useEffect(() => {
    const p = Number(searchParams.get("page") || "1");
    if (!isNaN(p) && p > 0) setPage(p);
  }, [searchParams]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // 페이지 로드 시 상단으로 스크롤
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);
  
  // 지역이나 탭이 변경될 때마다 상단으로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeRegion, activeTab]);
  
  // location state에서 scrollToTop이 true면 상단으로 스크롤
  useEffect(() => {
    if (location.state?.scrollToTop) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [location]);

  // location.state에서 전달된 selectedItem 처리
  useEffect(() => {
    if (location.state?.selectedItem) {
      const item = location.state.selectedItem;
      const tab = location.state.tab || item.tag;
      const view = location.state.view || 'detail';
      
      // 탭 설정
      if (tab && TABS.some(t => t.label === tab)) {
        setActiveTab(tab);
      }
      
      // 상세보기 모드로 전환
      if (view === 'detail') {
        setMode('detail');
        
        // 전달받은 item을 적절한 형태로 변환
        const itemWithBody = {
          ...item,
          id: Number(item.id), // id를 숫자로 통일
          body: item.content || item.description || item.date || '상세 내용이 없습니다.',
          categoryPath: item.categoryPath || `${tab} > ${item.tag || '일반'}`
        };
        
        // 기존 apiData가 있으면 유지하고, 없으면 새로 설정
        const existingData = apiData.length > 0 ? apiData : MOCK;
        
        // 전달받은 item이 기존 데이터에 없으면 추가
        const itemExists = existingData.some(d => Number(d.id) === Number(item.id));
        if (!itemExists) {
          setApiData([itemWithBody, ...existingData]);
        } else {
          // 이미 있으면 해당 item 업데이트
          setApiData(existingData.map(d => 
            Number(d.id) === Number(item.id) ? itemWithBody : d
          ));
        }
        
        setSelectedId(Number(item.id));
      }
      
      // URL 파라미터 업데이트
      const newParams = new URLSearchParams(searchParams);
      newParams.set('view', 'detail');
      newParams.set('tab', tab);
      newParams.set('id', String(item.id));
      setSearchParams(newParams, { replace: true });
      
      // 상단으로 스크롤
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
          // 지역 변경 시 상단으로 스크롤
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

  const countText = useMemo(() => `결과 ${dataToUse.length.toLocaleString()}개`, [dataToUse]);

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
                    <p className={styles.cardBody}>{item.body}</p>
                    <div className={styles.cardFooter}>
                      <button type="button" className={styles.viewLink} onClick={() => openDetail(item.id)}>
                        보기
                      </button>
                      <button type="button" className={styles.circleIcon} aria-label="상세 보기" onClick={() => openDetail(item.id)}>
                        <img className={styles.noticeIcon} src={noteIcon} alt="" />
                      </button>
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
              categoryLabel={activeTab}
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
