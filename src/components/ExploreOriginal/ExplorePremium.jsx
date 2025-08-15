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

/* ===== 이미지(무조건 import로 사용) ===== */
import newslogo from "../../assets/newslogo.png";
import chainIcon from "../../assets/chain.png";
import rightHere from "../../assets/RightHere.png";
import noteIcon from "../../assets/Note.png";
import listMagnifier from "../../assets/ListMagnifyingGlass.png";
/* 추가: 달력 아이콘 */
import calendarIcon from "../../assets/calendar.png";

/* 추가 아이콘 */
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

/* 한 페이지에 보여줄 카드 개수 */
const PAGE_SIZE = 5;

/* ===== 상세 화면 ===== */
function DetailView({ item, categoryLabel = "뉴스", onPrev, onNext }) {
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  }, []);
  const dateToShow = item?.date || todayStr;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // 뉴스 탭일 때만 카드형 뉴스 레이아웃
  const isNews = /^뉴스/.test(categoryLabel || "");

  const newsBullets = useMemo(
    () =>
      String(item?.body || "-")
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [item?.body]
  );

  return (
    <>
      {/* 상단 카테고리(좌정렬) */}
      <div className={styles.breadcrumb}>{categoryLabel}</div>

      {/* 제목(좌정렬, 크게) */}
      <h1 className={styles.detailTitle}>{item?.title || "제목 없음"}</h1>

      {/* 날짜: 달력 아이콘 + yyyy.mm.dd */}
      <div className={styles.detailMeta}>
        <img src={calendarIcon} alt="" className={styles.calIcon} />
        <time dateTime={dateToShow.replace(/\./g, "-")} className={styles.calDate}>
          {dateToShow}
        </time>
      </div>

      {/* ===== 본문 레이아웃 ===== */}
      {isNews ? (
        /* ------------ 뉴스:큰 마스코트 + 흰 요약카드 위로 배지 겹치기 ------------ */
        <section className={styles.newsWrap}>
          {/* 좌측 큰 마스코트 */}
          <img src={newslogo} alt="" aria-hidden="true" className={styles.newsMascot} />

          {/* 요약 카드(배지 오버레이) */}
          <div
            className={styles.newsSummary}
            style={{ position: "relative" }}
          >
            {/* 검은 배지: 카드에 살짝 겹치도록 고정 */}
            <div
              className={styles.newsBadge}
              style={{
                position: "absolute",
                left: "-14px",
                top: "-22px",
              }}
            >
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
        /* ------------ 뉴스 외: 기존 표 ------------ */
        <section className={styles.noticeWrap}>
          <div className={styles.infoPanel}>
            <div className={styles.panelBanner}>
              <img src={sparkleIcon} alt="" className={styles.bannerSparkle} />
              <span className={styles.bannerText}>
                산후조리원 내 호흡기세포융합바이러스(RSV) 집단발생 증가에 따라 감염병
                예방수칙을 배포하오니 업무에 참고하시기 바랍니다.
              </span>
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

      {/* 링크 안내 바 + 우측 새 */}
      <div className={styles.linkBar}>
        <div className={styles.linkBtn}>
          <img src={chainIcon} alt="" />
          <span>자세한 사항 및 파일첨부 등은 링크에서 확인하세요!</span>
        </div>
        <img className={styles.rightBird} src={rightHere} alt="" />
      </div>

      {/* 이전/다음 글 */}
      <nav className={styles.pnWrap}>
        <button type="button" className={styles.pnItem} onClick={onPrev}>
          <span className={styles.pnLeft}>
            <img src={chevronUp} alt="" className={styles.pnIconUP} />
            <span className={styles.pnLabel}>이전 글</span>
          </span>
          <span className={styles.pnTitle}>청소년상담복지센터운영</span>
        </button>
        <button type="button" className={styles.pnItem} onClick={onNext}>
          <span className={styles.pnLeft}>
            <span className={styles.pnLabel}>다음 글</span>
            <img src={chevronDown} alt="" className={styles.pnIconDown} />
          </span>
          <span className={styles.pnTitle}>
            서산시의회 한서혁 의원, 지역 최초 시의원 후원회 출범
          </span>
        </button>
      </nav>
    </>
  );
}

/* ===== 메인(목록 + 상세 전환) ===== */
export default function ExplorePremium() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터 복원
  const regionFromUrl = searchParams.get("region");
  const viewFromUrl = searchParams.get("view");
  const idFromUrl = Number(searchParams.get("id"));
  const pageFromUrl = Number(searchParams.get("page") || "1");
  const tabFromUrl = searchParams.get("tab");
  const subFromUrl = searchParams.get("sub");

  // 상태
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

  /* 페이징 상태 */
  const [page, setPage] = useState(!isNaN(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);
  const totalPages = Math.max(1, Math.ceil(MOCK.length / PAGE_SIZE));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return MOCK.slice(start, start + PAGE_SIZE);
  }, [page]);

  /* 현재 페이지 주변 번호(최대 5개) */
  const pageNumbers = useMemo(() => {
    const win = 5;
    let start = Math.max(1, page - Math.floor(win / 2));
    let end = Math.min(totalPages, start + win - 1);
    start = Math.max(1, end - win + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const tabBarRef = useRef(null);

  // URL 변경 시 상태 동기화
  useEffect(() => {
    if (regionFromUrl && REGIONS.includes(regionFromUrl)) setActiveRegion(regionFromUrl);
    if (tabFromUrl && TABS.some((t) => t.label === tabFromUrl)) setActiveTab(tabFromUrl);
    setActiveSub(subFromUrl || "");
    setMode(viewFromUrl === "detail" ? "detail" : "list");
    if (idFromUrl) setSelectedId(idFromUrl);
  }, [regionFromUrl, tabFromUrl, subFromUrl, viewFromUrl, idFromUrl]);

  /* URL의 page 동기화 */
  useEffect(() => {
    const p = Number(searchParams.get("page") || "1");
    if (!isNaN(p) && p > 0) setPage(p);
  }, [searchParams]);

  /* 페이지 수 보정 */
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* 바깥 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    const close = (e) => {
      if (tabBarRef.current && !tabBarRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* 지역 변경 */
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

  /* 탭 클릭 */
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

  /* 드롭다운 옵션 선택 */
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

  /* 페이징 이동 */
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

  /* 상세 열기 */
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
      next.set("page", String(page)); // 현재 페이지 유지
      setSearchParams(next);
      window.scrollTo(0, 0);
    },
    [activeRegion, activeTab, activeSub, page, searchParams, setSearchParams]
  );

  /* 이전/다음 */
  const goPrev = useCallback(() => {
    const idx = MOCK.findIndex((m) => m.id === selectedId);
    const prev = MOCK[(idx - 1 + MOCK.length) % MOCK.length];
    openDetail(prev.id);
  }, [selectedId, openDetail]);

  const goNext = useCallback(() => {
    const idx = MOCK.findIndex((m) => m.id === selectedId);
    const next = MOCK[(idx + 1) % MOCK.length];
    openDetail(next.id);
  }, [selectedId, openDetail]);

  const selectedItem = useMemo(
    () => MOCK.find((m) => m.id === selectedId) || MOCK[0],
    [selectedId]
  );

  const countText = useMemo(
    () => `글 전체 결과 ${MOCK.length.toLocaleString()}개`,
    []
  );

  return (
    <div className={styles.page}>
      {/* ==== 탭 + 드롭다운 : 리스트/디테일 공통 노출 ==== */}
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

      {mode === "list" && (
        <div className={styles.frame}>
          {/* 왼쪽 사이드바 */}
          <aside className={styles.side}>
            <div className={styles.sideTitle}>지역</div>
            <ul className={styles.sideList}>
              {REGIONS.map((r, i) => (
                <li
                  key={r}
                  className={`${styles.sideItem} ${
                    r === activeRegion ? styles.sideItemActive : ""
                  }`}
                  onClick={() => handleRegionClick(r)}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </aside>

          {/* 오른쪽: 목록 */}
          <main className={styles.main}>
            {/* 결과 카운트 바 */}
            <div className={styles.countBar}>
              <span className={styles.countIconWrap}>
                <img src={listMagnifier} alt="" />
              </span>
              {countText}
              {activeSub ? (
                <span className={styles.countSub}> · 필터: {activeTab} &gt; {activeSub}</span>
              ) : null}
            </div>

            {/* 카드 리스트 */}
            <section
              className={`${styles.list} ${isTransitioning ? styles.transitioning : ""}`}
            >
              {pagedItems.map((item, index) => (
                <article
                  key={item.id}
                  className={styles.card}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.divider} />
                  <p className={styles.cardBody}>{item.body}</p>
                  <div className={styles.cardFooter}>
                    <button
                      type="button"
                      className={styles.viewLink}
                      onClick={() => openDetail(item.id)}
                    >
                      보기
                    </button>
                    <button
                      type="button"
                      className={styles.circleIcon}
                      aria-label="상세 보기"
                      onClick={() => openDetail(item.id)}
                    >
                      <img className={styles.noticeIcon} src={noteIcon} alt="" />
                    </button>
                  </div>
                </article>
              ))}
            </section>

            {/* 숫자 페이징 */}
            <nav className={styles.paginationWrap} aria-label="페이지네이션">
              <button
                type="button"
                className={styles.pageArrow}
                disabled={page === 1}
                onClick={() => goToPage(1)}
                aria-label="첫 페이지"
                title="첫 페이지"
              >
                «
              </button>
              <button
                type="button"
                className={styles.pageArrow}
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                aria-label="이전 페이지"
                title="이전 페이지"
              >
                ‹
              </button>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`}
                  onClick={() => goToPage(n)}
                  aria-current={n === page ? "page" : undefined}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                className={styles.pageArrow}
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                aria-label="다음 페이지"
                title="다음 페이지"
              >
                ›
              </button>
              <button
                type="button"
                className={styles.pageArrow}
                disabled={page === totalPages}
                onClick={() => goToPage(totalPages)}
                aria-label="마지막 페이지"
                title="마지막 페이지"
              >
                »
              </button>
            </nav>
          </main>
        </div>
      )}

      {mode === "detail" && (
        <div className={styles.frame}>
          {/* 왼쪽 사이드바(디테일에도 표시) */}
          <aside className={styles.side}>
            <div className={styles.sideTitle}>지역</div>
            <ul className={styles.sideList}>
              {REGIONS.map((r, i) => (
                <li
                  key={r}
                  className={`${styles.sideItem} ${
                    r === activeRegion ? styles.sideItemActive : ""
                  }`}
                  onClick={() => handleRegionClick(r)}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </aside>

          {/* 오른쪽: 디테일 본문 */}
          <main className={styles.main}>
            <DetailView
              item={selectedItem}
              categoryLabel={activeTab}
              onPrev={goPrev}
              onNext={goNext}
            />
          </main>
        </div>
      )}
    </div>
  );
}
