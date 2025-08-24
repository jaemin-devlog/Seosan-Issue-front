import React, { useEffect, useMemo, useState } from "react";
import "./Weather.css";

import Sun from "../assets/sun.png";
import Cloud from "../assets/cloud.png";
import Rain from "../assets/rain.png";
import Snow from "../assets/snow.png";

const DEBUG = false;

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "/api"
    : "https://seosan-issue.shop/api/v1";

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

function formatKoDate(now = new Date()) {
  const m = now.getMonth() + 1;
  const day = now.getDate();
  const h24 = now.getHours();
  const ap = h24 >= 12 ? "오후" : "오전";
  const h12 = (h24 % 12) || 12;
  return `${m}월 ${day}일 ${ap} ${h12}시`;
}

/** /weather/cards?city=... 호출 */
async function fetchWeatherCards(city) {
  const params = new URLSearchParams({ city });
  const url = `${API_BASE}/weather/cards?${params.toString()}`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} | ${url} | ${text.slice(0, 200)}`);
  return { url, json: JSON.parse(text) };
}

function koConditionToType(t = "") {
  if (!t) return "sunny";
  if (t.includes("비") || t.includes("소나기")) return "rain";
  if (t.includes("눈")) return "snow";
  if (t.includes("흐림") || t.includes("구름")) return "cloudy";
  if (t.includes("맑")) return "sunny";
  return "sunny";
}

export default function Weather() {
  const [idx, setIdx] = useState(0); // 기본: 해미면
  const activeLoc = LOCATIONS[idx];

  const [loading, setLoading] = useState(true);
  const [wx, setWx] = useState(null);      // { temp, humidity, windSpeed, windDir, type }
  const [now, setNow] = useState(new Date());
  const [raw, setRaw] = useState(null);
  const [reqUrl, setReqUrl] = useState("");
  const [err, setErr] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const { url, json } = await fetchWeatherCards(activeLoc);
        setReqUrl(url);
        setRaw(json);

        // ✅ 응답이 { cards:[...] } 형태
        let card = null;
        if (json && Array.isArray(json.cards)) {
          card =
            json.cards.find((c) => c?.region === activeLoc) ||
            json.cards.find((c) => c?.region?.includes(activeLoc)) ||
            json.cards[0];
        } else if (Array.isArray(json)) {
          // 혹시 배열로 직접 올 때
          card =
            json.find((c) => c?.region === activeLoc) ||
            json.find((c) => c?.region?.includes(activeLoc)) ||
            json[0];
        } else {
          // 단일 객체일 때
          card = json;
        }

        if (!card) throw new Error("No weather card found in response");

        const temp = Math.round(Number(card.temperature ?? 32));
        const humidity = String(card.humidity ?? 53);
        const windSpeed = String(card.windSpeed ?? 2.2);
        const windDir = String(card.windDirection ?? "남서풍");
        const type = koConditionToType(String(card.condition ?? ""));

        setWx({
          temp: String(temp),
          humidity,
          windSpeed,
          windDir,
          type,
        });
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
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

  const info = WEATHER_INFO[wx.type] || WEATHER_INFO.sunny;

  return (
    <div className="wx-card" aria-label="현재 날씨" style={{ minHeight: 170, position: "relative" }}>
      {/* 좌/우 원형 버튼 */}
      <button
        type="button"
        className={`wx-nav wx-prev ${isFirst ? "disabled" : ""}`}
        onClick={goPrev}
        aria-label="이전 지역"
        disabled={isFirst}
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
        disabled={isLast}
      >
        <svg viewBox="0 0 24 24" className="wx-navIcon" aria-hidden="true">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="wx-content">
        {/* 왼쪽 */}
        <div className="wx-left">
          <div className="wx-temp">{wx.temp}°</div>
          <div className="wx-cond">{info.label}</div>

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
        <img src={info.icon} alt={info.label} className={`wx-hero wx-${wx.type}`} />
      </div>

      {DEBUG && (
        <div
          style={{
            position: "absolute",
            inset: "auto 10px 10px 10px",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: 10,
            borderRadius: 10,
            fontSize: 12,
            maxHeight: 180,
            overflow: "auto",
          }}
        >
          <div style={{ marginBottom: 6, fontWeight: 700 }}>DEBUG — Weather</div>
          {err && <div style={{ color: "#ff9a9a" }}>Error: {String(err)}</div>}
          <div style={{ opacity: 0.8, marginBottom: 4 }}>Request: {reqUrl || "(아직 없음)"}</div>
          <div>
            Raw:
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {typeof raw === "string" ? raw : JSON.stringify(raw, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
