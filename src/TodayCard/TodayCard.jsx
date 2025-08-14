import React from "react";
import styles from "./TodayCard.module.css";
import Event from "../assets/event.png";
import ClockIcon from "../assets/clock.png";
import TrendUpIcon from "../assets/trending-up.png";
import CardBG from "../assets/TodayCardBG.png";

export default function TodayCard({
  totalCount = 1432,
  todayCollected = 18,
  totalDelta = 12,
  todayDelta = 7,
  events = [
    { date: "9월26일(금) ~ 28(일) ", time: "19 : 00", title: "서산해미읍성축제" },
    { date: "8월 7일", time: "17 : 00", title: "일자리창출지원사업 참여자 모집" },
    { date: "8월 7일", time: "17 : 00", title: "일자리창출지원사업 참여자 모집" },
  ],
}) {
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
                <div className={styles.metricNumber}>{totalCount.toLocaleString()}</div>
              </div>
              <div className={styles.metricFooter}>
                <span className={styles.metricSub}>전일 대비 증가</span>
                <span className={styles.deltaBadge} aria-label={`전일 대비 ${totalDelta}% 증가`}>
                  <img src={TrendUpIcon} alt="" className={styles.deltaIcon} />
                  <span>+ {totalDelta}%</span>
                </span>
              </div>
            </div>

            {/* 오늘의 수집 */}
            <div className={styles.metricCard} style={{ backgroundImage: `url(${CardBG})` }}>
              <div className={styles.metricCircle}>
                <div className={styles.metricLabel}>오늘의 수집</div>
                <div className={styles.metricNumber}>{todayCollected.toLocaleString()}</div>
              </div>
              <div className={styles.metricFooter}>
                <span className={styles.metricSub}>전일 대비 증가</span>
                <span className={styles.deltaBadge} aria-label={`전일 대비 ${todayDelta}% 증가`}>
                  <img src={TrendUpIcon} alt="" className={styles.deltaIcon} />
                  <span>+ {todayDelta}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 다가오는 이벤트 */}
      <div className={styles.rightCol}>
        <h2 className={styles.sectionTitle}>
          다가오는 이벤트 <span className={styles.party}><img src={Event} alt =""/></span>
        </h2>

        <div className={styles.panel}>
          <ul className={styles.eventList}>
            {events.map((e, idx) => (
              <li key={idx} className={styles.eventItem}>
                <div className={styles.eventTop}>
                  <img src={ClockIcon} alt="" className={styles.clock} />
                  <strong className={styles.eventDate}>{e.date}</strong>
                  <span className={styles.eventTime}>{e.time}</span>
                </div>
                <div className={styles.eventDivider} />
                <div className={styles.eventTitle}>{e.title}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
