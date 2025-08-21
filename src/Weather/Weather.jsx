import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "../api/Weather.api.js";

import "./Weather.css";
import Sun from "../assets/sun.png";
import Cloud from "../assets/cloud.png";
import Rain from "../assets/rain.png";
import Snow from "../assets/snow.png";

// 날씨 종류에 따라 아이콘과 라벨 매핑
const weatherTypeInfo = {
  sunny: { icon: Sun, label: "맑음" },
  cloudy: { icon: Cloud, label: "흐림" },
  rain: { icon: Rain, label: "비" },
  snow: { icon: Snow, label: "눈" }
};

// 기상청 예보값(category) → weatherType 변환 함수 (예보/관측 모두 대응)
function parseWeatherType(obj) {
  // PTY: 0없음 1비 2비/눈 3눈 4소나기
  // SKY: 1맑음 3구름많음 4흐림
  if (obj.PTY === "1" || obj.PTY === "4") return "rain";
  if (obj.PTY === "2" || obj.PTY === "3") return "snow";
  if (obj.SKY === "1") return "sunny";
  if (obj.SKY === "3" || obj.SKY === "4") return "cloudy";
  return "sunny";
}

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherType, setWeatherType] = useState("sunny");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData().then((rawData) => {
      // 1. 기상청 단기예보 items 배열 추출
      const items = rawData?.response?.body?.items?.item || [];

      // 2. category별 객체로 변환
      const obj = {};
      items.forEach(item => {
        obj[item.category] = item.fcstValue;
      });

      // 3. 날씨 상태(맑음/비/눈/흐림) 계산
      const wType = parseWeatherType(obj);

      setWeatherData({
        temp: obj.TMP || obj.T1H || "32",      // 예보(TMP) or 관측(T1H)
        humidity: obj.REH || "53",             // 습도
        wind: obj.WSD ? `${obj.WSD}` : "2.2",
      });
      setWeatherType(wType);
      setLoading(false);
    }).catch(() => {
      setWeatherData({
        temp: "32",
        humidity: "53",
        wind: "2.2",
      });
      setWeatherType("sunny");
      setLoading(false);
    });
  }, []);

  const { icon, label } = weatherTypeInfo[weatherType];

  if (loading) return <div className="card weather-card">로딩중...</div>;
  if (!weatherData) return <div className="card weather-card">날씨 데이터를 불러올 수 없습니다.</div>;

  // 현재 날짜와 시간 가져오기
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const period = hours >= 12 ? "오후" : "오전";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const dateTimeText = `${month}월 ${day}일 ${period} ${displayHours}시`;

  return (
    <div className="card weather-card">
      <div className="weather-header">날씨</div>

      <div className="weather-main">
        <div className="weather-left">
          <div className="weather-temp">{weatherData.temp}°</div>
          <div className="weather-condition">{label}</div>
        </div>

        <div className="weather-right">
          <div className="weather-location">해미면</div>
          <div className="weather-datetime">{dateTimeText}</div>
        </div>

        <img src={icon} alt={label} className="weather-icon" />

        <button className="weather-nav-arrow weather-nav-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="weather-nav-arrow weather-nav-right">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="weather-bottom">
        <div className="weather-info-item">습도 {weatherData.humidity}%</div>
        <div className="weather-info-item">남서풍 {weatherData.wind} m/s</div>
      </div>
    </div>
  );
}
