// src/components/ExploreOriginal/ExplorePremium.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams } from 'react-router-dom';
import styles from "./ExplorePremium.module.css";

/* === 상수들 (원본 그대로) === */
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

const MOCK = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  title: i === 1 ? "제목" : "아동 청소년을 위한 청소년 수련관 운영",
  body:
    i === 1
      ? "2줄"
      : "청소년활동진흥법의 규정에 따라 청소년활동을 적극적으로 진흥하기 위해 다양한 수련거리를 실시할 수 있도록 청소년수련관을 운영하고자 ○○에 위치한 …",
}));

export default function ExplorePremium() {
  const [searchParams] = useSearchParams();
  const regionFromUrl = searchParams.get('region');
  
  const [activeRegion, setActiveRegion] = useState(regionFromUrl || "대산읍");
  const [activeTab, setActiveTab] = useState("뉴스");
  const [openMenu, setOpenMenu] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tabBarRef = useRef(null);

  // URL 파라미터 변경 감지 및 스크롤 상단 이동
  useEffect(() => {
    if (regionFromUrl && REGIONS.includes(regionFromUrl)) {
      setActiveRegion(regionFromUrl);
    }
    // 페이지 로드 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [regionFromUrl]);

  // 컴포넌트 마운트 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 바깥 클릭 시 닫힘
  useEffect(() => {
    const close = (e) => {
      if (tabBarRef.current && !tabBarRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // 최적화된 핸들러
  const handleRegionClick = useCallback((region) => {
    if (region !== activeRegion) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveRegion(region);
        setIsTransitioning(false);
      }, 150);
    }
  }, [activeRegion]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab.label);
    if (tab.dropdown) {
      setOpenMenu((prev) => (prev === tab.label ? null : tab.label));
    } else {
      setOpenMenu(null);
    }
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        {/* 왼쪽 사이드바 */}
        <aside className={styles.side}>
          <div className={styles.sideTitle}>지역</div>
          <ul className={styles.sideList}>
            {REGIONS.map((r, index) => (
              <li
                key={r}
                className={`${styles.sideItem} ${r === activeRegion ? styles.sideItemActive : ""}`}
                onClick={() => handleRegionClick(r)}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {r}
              </li>
            ))}
          </ul>
        </aside>

        {/* 오른쪽 컨텐츠 */}
        <main className={styles.main}>
          {/* 상단 탭 + 드롭다운 */}
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
                            className={styles.ddItem}
                            style={{ animationDelay: `${idx * 50}ms` }}
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

          {/* 결과 카운트 바 */}
          <div className={styles.countBar}>
            <span className={styles.countIconWrap}>
              <img src="/images/ListMagnifyingGlass.png" alt="" />
            </span>
            글 전체 결과 3,435개
          </div>

          {/* 리스트 */}
          <section className={`${styles.list} ${isTransitioning ? styles.transitioning : ''}`}>
            {MOCK.map((item, index) => (
              <article 
                key={item.id} 
                className={styles.card}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.divider} />
                <p className={styles.cardBody}>{item.body}</p>
                <div className={styles.cardFooter}>
                  <a className={styles.viewLink} href="#!">보기</a>
                  <span className={styles.circleIcon} aria-hidden="true">
                    <img className={styles.noticeIcon} src="/images/Note.png" alt="" />
                  </span>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}