import React, { useEffect, useMemo, useState } from "react";
import { fetchWeatherData } from "../api/Weather.api.js";
import "./Weather.css";

import Sun from "../assets/sun.png";
import Cloud from "../assets/cloud.png";
import Rain from "../assets/rain.png";
import Snow from "../assets/snow.png";

/** 고정 지역 순서 */
const LOCATIONS = [
  "해미면","지곡면","팔봉면","성연면","음암면","운산면","부춘동",
  "동문1동","동문2동","수석동","인지면","석남동","부석면","고북면","대산읍",
];

const WEATHER_INFO = {
  sunny:  { icon: Sun,   label: "맑음" },
  cloudy: { icon: Cloud, label: "흐림" },
  rain:   { icon: Rain,  label: "비"   },
  snow:   { icon: Snow,  label: "눈"   },
};

/** 예보/실황 모두 대응: 항목 정규화 */
function normalizeItems(raw) {
  const items =
    Array.isArray(raw?.response?.body?.items?.item) ? raw.response.body.items.item :
    Array.isArray(raw?.response?.body?.items)       ? raw.response.body.items :
    Array.isArray(raw?.items)                        ? raw.items : [];
  const obj = {};
  for (const it of items) {
    const k = it?.category;
    const v = it?.fcstValue ?? it?.obsrValue ?? it?.value ?? it?.obsValue;
    if (k && v !== undefined && v !== null) obj[k] = String(v);
  }
  return obj;
}

function parseWeatherType(o = {}) {
  // PTY: 0없음 1비 2비/눈 3눈 4소나기 / SKY: 1맑음 3구름많음 4흐림
  if (o.PTY === "1" || o.PTY === "4") return "rain";
  if (o.PTY === "2" || o.PTY === "3") return "snow";
  if (o.SKY === "1") return "sunny";
  if (o.SKY === "3" || o.SKY === "4") return "cloudy";
  return "sunny";
}

function windDirectionLabel(deg) {
  const d = ["북풍","북북동","북동","동북동","동","동남동","남동","남남동","남","남남서","남서","서남서","서","서북서","북서","북북서"];
  const i = Math.round((Number(deg) || 0) / 22.5) % 16;
  return d[i] || "남서풍";
}

function formatKoDate(now = new Date()) {
  const m = now.getMonth() + 1;
  const day = now.getDate();
  const h24 = now.getHours();
  const ap = h24 >= 12 ? "오후" : "오전";
  const h12 = (h24 % 12) || 12;
  return `${m}월 ${day}일 ${ap} ${h12}시`;
}

export default function Weather() {
  const [idx, setIdx] = useState(LOCATIONS.length - 1); // 기본: 해미면
  const activeLoc = LOCATIONS[idx];

  const [loading, setLoading] = useState(true);
  const [wx, setWx] = useState(null); // { temp, humidity, windSpeed, windDir, type }
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const raw = await fetchWeatherData(activeLoc);
        const o = normalizeItems(raw);

        const temp = o.TMP ?? o.T1H ?? "32";
        const humidity = o.REH ?? "53";
        const wsd = o.WSD ?? "2.2";
        const vec = o.VEC;

        setWx({
          temp: String(temp),
          humidity: String(humidity),
          windSpeed: Number(wsd).toFixed(1),
          windDir: vec !== undefined ? windDirectionLabel(vec) : "남서풍",
          type: parseWeatherType(o),
        });
      } catch {
        // 폴백(네트워크 실패 등)
        setWx({ temp: "32", humidity: "53", windSpeed: "2.2", windDir: "남서풍", type: "sunny" });
      } finally {
        setLoading(false);
      }
    })();
  }, [activeLoc]);

  const dateText = useMemo(() => formatKoDate(now), [now]);

  const isFirst = idx === 0;
  const isLast  = idx === LOCATIONS.length - 1;
  const goPrev = () => !isFirst && setIdx(i => i - 1);
  const goNext = () => !isLast  && setIdx(i => i + 1);

  if (loading || !wx) {
    return <div className="wx-card"><div className="wx-loading">로딩중…</div></div>;
  }

  const { icon, label } = WEATHER_INFO[wx.type];

  return (
    <div className="wx-card" aria-label="현재 날씨">
      {/* 좌/우 원형 버튼 */}
      <button
        type="button"
        className={`wx-nav wx-prev ${isFirst ? "disabled" : ""}`}
        onClick={goPrev}
        aria-label="이전 지역"
      >
        <svg viewBox="0 0 24 24" className="wx-navIcon" aria-hidden="true">
          <path d="M15 19L8 12l7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        type="button"
        className={`wx-nav wx-next ${isLast ? "disabled" : ""}`}
        onClick={goNext}
        aria-label="다음 지역"
      >
        <svg viewBox="0 0 24 24" className="wx-navIcon" aria-hidden="true">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="wx-content">
        {/* 왼쪽 */}
        <div className="wx-left">
          <div className="wx-temp">{wx.temp}°</div>
          <div className="wx-cond">{label}</div>

          <div className="wx-meta">
            <div>습도 {wx.humidity}%</div>
            <div>{wx.windDir} {wx.windSpeed} m/s</div>
          </div>
        </div>

        {/* 오른쪽 상단 */}
        <div className="wx-right">
          <div className="wx-loc">{activeLoc}</div>
          <div className="wx-time">{dateText}</div>
        </div>

        {/* 우하단 아이콘 */}
        <img src={icon} alt={label} className={`wx-hero wx-${wx.type}`} />
      </div>
    </div>
  );
}
