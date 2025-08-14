// src/components/ExploreOriginal/ExplorePremium.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ExplorePremium.module.css";

const REGIONS = [
  "대산읍","지곡면","팔봉면","성연면","음암면","운산면","부춘동",
  "동문1동","동문2동","수석동","인지면","석남동","부석면","고북면","해미면"
];

const TABS = [
  { label: "뉴스", dropdown: true },
  { label: "복지", dropdown: true },
  { label: "문화소식", dropdown: true },
  { label: "서산시청", dropdown: false },
  { label: "카페", dropdown: false },
  { label: "블로그", dropdown: false },
];

const DROPDOWN = {
  뉴스: ["읍면동 소식", "정치 / 지방자치", "교육", "사회", "민원안내", "행정서비스"],
  복지: ["어르신", "장애인", "여성 / 가족", "아동 / 청소년", "청년"],
  문화소식: ["관광 / 안내", "시티투어", "체험", "축제", "문화소식"],
};

/** 데모 데이터(목록) */
const MOCK = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  title: i === 1 ? "제목" : "아동 청소년을 위한 청소년 수련관 운영",
  body:
    i === 1
      ? "2줄"
      : "청소년활동진흥법의 규정에 따라 청소년활동을 적극적으로 진흥하기 위해 다양한 수련거리를 실시할 수 있도록 청소년수련관을 운영하고자 ○○에 위치한 …",
  // 필요하면 date, link 등도 붙일 수 있음
}));

/* ===================== 상세 화면 ===================== */
function DetailView({ item, onPrev, onNext }) {
  // 본문을 불릿으로 변환 (줄바꿈/구두점/중점 기준 분리)
  const bullets = useMemo(() => {
    if (!item?.body) return [];
    return item.body
      .split(/\r?\n|•|·|-\s|—\s|–\s|(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 3); // 너무 길면 3개까지만
  }, [item]);

  // 임시 날짜(데모) – 실제 API에 date가 있으면 그 값 사용
  const dateText = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}. ${m}. ${day}`;
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className={styles.detailPageOnly}>
      <div className={styles.detailWrap}>
        {/* 상단: 카테고리/제목/날짜 */}
        <div className={styles.detailHead}>
          <div className={styles.breadcrumb}>뉴스</div>
          <h1 className={styles.detailTitle}>{item?.title || "제목 없음"}</h1>
          <div className={styles.detailMeta}>
            <span className={styles.dot} />
            <span>{dateText}</span>
          </div>
        </div>

        {/* AI 요약 배지 라인 */}
        <div className={styles.aiRow}>
          <img className={styles.aiMascot} src="/images/newslogo.png" alt="" />
          <span className={styles.aiBadge}>
            <img className={styles.sparkle} src="/images/sparkle.png" alt="" />
            AI 요약 완료
          </span>
        </div>

        {/* 요약 카드: 클릭한 카드의 내용으로 구성 */}
        <section className={styles.aiCard}>
          <p className={styles.aiIntro}>
            선택한 글의 핵심 내용을 간단히 정리했어요.
          </p>
          <ul className={styles.bulletList}>
            {bullets.length > 0 ? (
              bullets.map((b, i) => <li key={i}>{b}</li>)
            ) : (
              <li>{item?.body || "요약할 내용이 없습니다."}</li>
            )}
          </ul>
        </section>

        {/* 링크/안내 바 */}
        <div className={styles.linkBar}>
          <div className={styles.linkBtn}>
            <img src="/images/chain.png" alt="" />
            <span>자세한 사항 및 파일첨부 등은 링크에서 확인하세요!</span>
          </div>
          <img className={styles.rightBird} src="/images/RightHere.png" alt="" />
        </div>

        {/* 이전/다음 글 */}
        <nav className={styles.pnWrap}>
          <button type="button" className={styles.pnItem} onClick={onPrev}>
            <span className={styles.pnLabel}>이전 글</span>
            <span className={styles.pnTitle}>청소년상담복지센터운영</span>
          </button>
          <button type="button" className={styles.pnItem} onClick={onNext}>
            <span className={styles.pnLabel}>다음 글</span>
            <span className={styles.pnTitle}>서산시의회 한서혁 의원, 지역 최초 시의원 후원회 출범</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

/* ===================== 메인 ===================== */
export default function ExplorePremium() {
  const [searchParams, setSearchParams] = useSearchParams();
  const regionFromUrl = searchParams.get("region");
  const viewFromUrl = searchParams.get("view");
  const idFromUrl = Number(searchParams.get("id"));

  const [activeRegion, setActiveRegion] = useState(regionFromUrl || "대산읍");
  const [activeTab, setActiveTab] = useState("뉴스");
  const [openMenu, setOpenMenu] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [mode, setMode] = useState(viewFromUrl === "detail" ? "detail" : "list");
  const [selectedId, setSelectedId] = useState(idFromUrl || null);

  const tabBarRef = useRef(null);

  useEffect(() => {
    if (regionFromUrl && REGIONS.includes(regionFromUrl)) setActiveRegion(regionFromUrl);
    setMode(viewFromUrl === "detail" ? "detail" : "list");
    if (idFromUrl) setSelectedId(idFromUrl);
  }, [regionFromUrl, viewFromUrl, idFromUrl]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const close = (e) => {
      if (tabBarRef.current && !tabBarRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleRegionClick = useCallback((region) => {
    if (region !== activeRegion) {
      setIsTransitioning(true);
      setTimeout(() => { setActiveRegion(region); setIsTransitioning(false); }, 150);
    }
  }, [activeRegion]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab.label);
    if (tab.dropdown) setOpenMenu((prev) => (prev === tab.label ? null : tab.label));
    else setOpenMenu(null);
  }, []);

  /** 상세 열기 + URL 동기화 */
  const openDetail = useCallback((id) => {
    setSelectedId(id);
    setMode("detail");
    setOpenMenu(null);
    const next = new URLSearchParams(searchParams);
    next.set("region", activeRegion);
    next.set("view", "detail");
    next.set("id", String(id));
    setSearchParams(next);
    window.scrollTo(0, 0);
  }, [activeRegion, searchParams, setSearchParams]);

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

  return (
    <div className={styles.page}>
      {mode === "list" && (
        <div className={styles.frame}>
          {/* 왼쪽 사이드바 */}
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

          {/* 목록/탭 */}
          <main className={styles.main}>
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
                            <li key={opt} className={styles.ddItem} style={{ animationDelay: `${idx * 50}ms` }}>
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

            <div className={styles.countBar}>
              <span className={styles.countIconWrap}>
                <img src="/images/ListMagnifyingGlass.png" alt="" />
              </span>
              글 전체 결과 3,435개
            </div>

            <section className={`${styles.list} ${isTransitioning ? styles.transitioning : ""}`}>
              {MOCK.map((item, index) => (
                <article key={item.id} className={styles.card} style={{ animationDelay: `${index * 80}ms` }}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.divider} />
                  <p className={styles.cardBody}>{item.body}</p>
                  <div className={styles.cardFooter}>
                    <button type="button" className={styles.viewLink} onClick={() => openDetail(item.id)}>
                      보기
                    </button>
                    <button
                      type="button"
                      className={styles.circleIcon}
                      aria-label="상세 보기"
                      onClick={() => openDetail(item.id)}
                    >
                      <img className={styles.noticeIcon} src="/images/Note.png" alt="" />
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </main>
        </div>
      )}

      {mode === "detail" && (
        <DetailView
          item={selectedItem}   
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}
