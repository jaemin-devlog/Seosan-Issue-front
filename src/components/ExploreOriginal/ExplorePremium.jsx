// src/components/ExploreOriginal/ExplorePremium.jsx
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ExplorePremium.module.css";
import { welfareAPI, seosanAPI, cultureAPI, naverSearchAPI } from "../../api/backend.api.js";

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

      <div className={styles.linkBar}>
        <div className={styles.linkBtn}>
          <img src={chainIcon} alt="" className="chain-img"/>
          <span>자세한 사항 및 파일첨부 등은 링크에서 확인하세요!</span>
        </div>
        <img className={styles.rightBird} src={rightHere} alt="" />
        <div className={styles.underbar} aria-hidden="true" />
      </div>

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
  const [selectedId, setSelectedId] = useState(idFromUrl || null);

  const [page, setPage] = useState(!isNaN(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  const pagedItems = useMemo(() => {
    // 모든 탭에서 API 데이터 사용
    return apiData;
  }, [apiData]);

  const pageNumbers = useMemo(() => {
    const win = 5;
    let start = Math.max(1, page - Math.floor(win / 2));
    let end = Math.min(totalPages, start + win - 1);
    start = Math.max(1, end - win + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const tabBarRef = useRef(null);

  useEffect(() => {
    if (regionFromUrl && REGIONS.includes(regionFromUrl)) setActiveRegion(regionFromUrl);
    if (tabFromUrl && TABS.some((t) => t.label === tabFromUrl)) setActiveTab(tabFromUrl);
    setActiveSub(subFromUrl || "");
    setMode(viewFromUrl === "detail" ? "detail" : "list");
    if (idFromUrl) setSelectedId(idFromUrl);
  }, [regionFromUrl, tabFromUrl, subFromUrl, viewFromUrl, idFromUrl]);

  useEffect(() => {
    const p = Number(searchParams.get("page") || "1");
    if (!isNaN(p) && p > 0) setPage(p);
  }, [searchParams]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  // API 호출 함수
  const fetchData = useCallback(async () => {
    console.log('fetchData 호출됨:', { activeTab, activeSub, activeRegion, page });
    
    console.log('API 호출 시작:', { activeTab, activeSub, activeRegion, page });
    
    setIsLoading(true);
    try {
      let response = null;
      const pageParam = page - 1; // API는 0부터 시작
      
      // 뉴스, 카페, 블로그 - 네이버 API 사용
      if (activeTab === "뉴스") {
        const searchResult = await naverSearchAPI.search(activeRegion, 'news', 20);
        console.log('뉴스 API 응답:', searchResult);
        response = {
          content: searchResult.map((item, idx) => ({
            id: `news-${idx}`,
            title: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
            description: item.description?.replace(/<[^>]*>/g, '') || '',
            link: item.link,
            pubDate: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '')
          })),
          totalPages: 1,
          totalElements: searchResult.length
        };
      }
      else if (activeTab === "카페") {
        const searchResult = await naverSearchAPI.search(activeRegion, 'cafearticle', 20);
        console.log('카페 API 응답:', searchResult);
        response = {
          content: searchResult.map((item, idx) => ({
            id: `cafe-${idx}`,
            title: item.title.replace(/<[^>]*>/g, ''),
            description: item.description?.replace(/<[^>]*>/g, '') || '',
            link: item.link,
            pubDate: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '')
          })),
          totalPages: 1,
          totalElements: searchResult.length
        };
      }
      else if (activeTab === "블로그") {
        const searchResult = await naverSearchAPI.search(activeRegion, 'blog', 20);
        console.log('블로그 API 응답:', searchResult);
        response = {
          content: searchResult.map((item, idx) => ({
            id: `blog-${idx}`,
            title: item.title.replace(/<[^>]*>/g, ''),
            description: item.description?.replace(/<[^>]*>/g, '') || '',
            link: item.link,
            pubDate: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '')
          })),
          totalPages: 1,
          totalElements: searchResult.length
        };
      }
      // 복지 카테고리
      else if (activeTab === "복지") {
        switch (activeSub) {
          case "어르신":
            response = await welfareAPI.getElderly(activeRegion, pageParam, PAGE_SIZE);
            break;
          case "장애인":
            response = await welfareAPI.getDisabled(activeRegion, pageParam, PAGE_SIZE);
            break;
          case "여성 / 가족":
            response = await welfareAPI.getWomenFamily(activeRegion, pageParam, PAGE_SIZE);
            break;
          case "아동 / 청소년":
            response = await welfareAPI.getChildYouth(activeRegion, pageParam, PAGE_SIZE);
            break;
          case "청년":
            response = await welfareAPI.getYouth(activeRegion, pageParam, PAGE_SIZE);
            break;
          default:
            response = await welfareAPI.getElderly(activeRegion, pageParam, PAGE_SIZE);
            break;
        }
      }
      // 문화관광 카테고리
      else if (activeTab === "문화관광") {
        switch (activeSub) {
          case "문화소식":
            response = await cultureAPI.getCultureNews(activeRegion, pageParam, PAGE_SIZE);
            break;
          case "시티투어":
            response = await cultureAPI.getCityTour(activeRegion, pageParam, PAGE_SIZE);
            break;
          case "관광 / 안내":
            response = await cultureAPI.getTourGuide(activeRegion, pageParam, PAGE_SIZE);
            break;
          default:
            response = await cultureAPI.getCultureNews(activeRegion, pageParam, PAGE_SIZE);
            break;
        }
      }
      // 서산시청 카테고리
      else if (activeTab === "서산시청") {
        switch (activeSub) {
          case "보건/건강":
            response = await seosanAPI.getHealth(activeRegion, pageParam, PAGE_SIZE);
            break;
          case "공지사항":
            response = await seosanAPI.getNotices(activeRegion, pageParam, PAGE_SIZE);
            break;
          case "보도자료":
            response = await seosanAPI.getPressRelease(activeRegion, pageParam, PAGE_SIZE);
            break;
          default:
            response = await seosanAPI.getNotices(activeRegion, pageParam, PAGE_SIZE);
            break;
        }
      }
      
      console.log('API 응답:', response);
      
      if (response && response.content) {
        let transformedData;
        
        // 뉴스, 카페, 블로그는 네이버 API 데이터 사용
        if (activeTab === "뉴스" || activeTab === "카페" || activeTab === "블로그") {
          transformedData = response.content.map((item) => ({
            id: item.id,
            title: item.title,
            body: item.description || `${item.title}에 대한 내용입니다.`,
            date: item.pubDate,
            categoryPath: `${activeTab} > ${activeRegion}`,
            link: item.link
          }));
        } else {
          // 복지, 문화관광, 서산시청은 기존 방식대로 상세 정보 가져오기
          const detailPromises = response.content.map(item => 
            fetch(`/api/posts/${item.id}`)
              .then(res => res.json())
              .catch(err => {
                console.error(`상세 정보 가져오기 실패 (ID: ${item.id}):`, err);
                return item; // 실패 시 기본 정보 사용
              })
          );
          
          const detailedItems = await Promise.all(detailPromises);
          console.log('상세 데이터:', detailedItems);
          
          transformedData = detailedItems.map((item) => ({
            id: item.id,
            title: item.title,
            body: item.content || `${item.title}에 대한 상세 내용입니다. (지역: ${item.region})`,
            date: item.pubDate,
            categoryPath: `${activeTab} > ${activeSub || '전체'}`
          }));
        }
        
        console.log('변환된 데이터:', transformedData);
        
        setApiData(transformedData);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || 0);
      } else {
        console.log('응답에 content가 없음');
        setApiData([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('API 호출 실패:', error, error.stack);
      setApiData([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, activeSub, activeRegion, page]);
  
  // 탭, 서브카테고리, 지역, 페이지가 변경될 때마다 데이터 다시 가져오기
  useEffect(() => {
    console.log('useEffect 트리거 - fetchData 호출 예정');
    fetchData();
  }, [fetchData]);

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

      // 복지, 문화관광, 서산시청 탭은 자동으로 첫 번째 서브카테고리 선택
      let defaultSub = "";
      if (nextActive === "복지") {
        defaultSub = "어르신";
      } else if (nextActive === "문화관광") {
        defaultSub = "문화소식";
      } else if (nextActive === "서산시청") {
        defaultSub = "보건/건강";
      }

      const next = new URLSearchParams(searchParams);
      next.set("view", "list");
      next.set("page", "1");
      next.set("region", activeRegion);
      next.set("tab", nextActive);
      next.delete("id");
      
      if (defaultSub) {
        next.set("sub", defaultSub);
        setActiveSub(defaultSub);
      } else {
        next.delete("sub");
        setActiveSub("");
      }
      
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
      setSelectedId(id);
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
    () => MOCK.find((m) => m.id === selectedId) || MOCK[0],
    [selectedId]
  );
  const currentIndex = useMemo(
    () => MOCK.findIndex((m) => m.id === selectedItem.id),
    [selectedItem]
  );
  const prevItem = currentIndex > 0 ? MOCK[currentIndex - 1] : null;
  const nextItem = currentIndex < MOCK.length - 1 ? MOCK[currentIndex + 1] : null;

  const goPrev = useCallback(() => {
    if (currentIndex > 0) openDetail(MOCK[currentIndex - 1].id);
  }, [currentIndex, openDetail]);

  const goNext = useCallback(() => {
    if (currentIndex < MOCK.length - 1) openDetail(MOCK[currentIndex + 1].id);
  }, [currentIndex, openDetail]);

  const countText = useMemo(() => {
    return `결과 ${totalElements.toLocaleString()}개`;
  }, [totalElements]);

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
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  데이터를 불러오는 중입니다...
                </div>
              ) : pagedItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  해당 카테고리에 데이터가 없습니다.
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
