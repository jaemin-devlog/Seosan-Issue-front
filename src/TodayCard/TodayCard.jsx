import React, { useState, useEffect } from "react";
import styles from "./TodayCard.module.css";
import Event from "../assets/event.png";
import ClockIcon from "../assets/clock.png";
import TrendUpIcon from "../assets/trending-up.png";
import CardBG from "../assets/TodayCardBG.png";
import ChainIcon from "../assets/chain.png"; // 링크 아이콘

export default function TodayCard() {
  // API에서 가져올 통계 데이터
  const [stats, setStats] = useState({
    totalCount: 503,
    todayCollected: 0,
    yesterdayCollected: 2,
    percentageIncrease: -100.0
  });
  const [loading, setLoading] = useState(true);
  
  // 이벤트 데이터 (하드코딩)
  const events = [
    { date: "9월26일(금)", time: "19 : 00", title: "서산해미읍성축제" },
    { date: "10월 중",      time: "미정",     title: "서산어리굴젓 축제" },
    { date: "11월 중",      time: "미정",     title: "서산국화축제" },
  ];
  
  // API 호출
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // backend.api.js의 statsAPI 사용
        const { statsAPI } = await import('../api/backend.api');
        const data = await statsAPI.getContentStats();
        if (data) {
          setStats({
            totalCount: data.total_content_count || 503,
            todayCollected: data.today_collected_count || 0,
            yesterdayCollected: data.yesterday_collected_count || 2,
            percentageIncrease: data.percentage_increase_from_yesterday || 0
          });
        }
      } catch (error) {
        // 에러 발생 시 기본값 유지
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    // 5분마다 업데이트
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  // 제목 → 공식 페이지 링크 매핑
  const linkByTitle = {
    "서산해미읍성축제": "https://www.seosan.go.kr/tour/contents.do?key=6105",
    "서산어리굴젓 축제": "https://www.seosan.go.kr/tour/contents.do?key=6141",
    "서산국화축제":"https://www.seosan.go.kr/tour/contents.do?key=6138",
  };

  return (
    <section className={styles.wrap}>
      {/* 왼쪽: 오늘의 서산 */}
      <div className={styles.leftCol}>
        <h2 className={styles.sectionTitle}>오늘의 서산</h2>

        <div className={styles.panel}>
          <div className={styles.statsGrid}>
            {/* 전체 콘텐츠 */}
            <div className={styles.metricCard} style={{ backgroundImage: `url(${CardBG})` }}>
              <div className={styles.metricCircle}>
                <div className={styles.metricLabel}>전체 콘텐츠</div>
                <div className={styles.metricNumber}>
                  {loading ? "..." : stats.totalCount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 오늘의 수집 */}
            <div className={styles.metricCard} style={{ backgroundImage: `url(${CardBG})` }}>
              <div className={styles.metricCircle}>
                <div className={styles.metricLabel}>오늘의 수집</div>
                <div className={styles.metricNumber}>
                  {loading ? "..." : stats.todayCollected.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Live 업데이트 표시 */}
          <div className={styles.liveUpdate}>
            <span className={styles.liveText}>실시간 업데이트</span>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span>
              <span className={styles.liveLabel}>LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 다가오는 이벤트 */}
      <div className={styles.rightCol}>
        <h2 className={styles.sectionTitle}>
          다가오는 이벤트 <span className={styles.party}><img src={Event} alt=""/></span>
        </h2>

        <div className={styles.panel}>
          <ul className={styles.eventList}>
            {events.map((e, idx) => {
              // 1순위 e.url, 2순위 제목 매핑, 3순위 네이버 검색
              const fallbackSearch = `https://search.naver.com/search.naver?query=${encodeURIComponent(e.title)}`;
              const link = e.url ?? linkByTitle[e.title] ?? fallbackSearch;

              return (
                <li key={idx} className={styles.eventItem}>
                  <div className={styles.eventTop}>
                    <img src={ClockIcon} alt="" className={styles.clock} />
                    <strong className={styles.eventDate}>{e.date}</strong>
                    <span className={styles.eventTime}>{e.time}</span>
                  </div>

                  <div className={styles.eventDivider} />

                  {/* 제목 + 아이콘 */}
                  <div className={styles.eventTitleRow}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.eventTitle}
                      aria-label={`${e.title} 링크 열기`}
                    >
                      {e.title}
                    </a>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.eventLink}
                      aria-label={`${e.title} 링크 열기`}
                    >
                      <img src={ChainIcon} alt="" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
