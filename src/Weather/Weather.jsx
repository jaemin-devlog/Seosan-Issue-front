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
        temp: obj.TMP || obj.T1H || "-",      // 예보(TMP) or 관측(T1H)
        humidity: obj.REH || "-",             // 습도
        wind: obj.WSD ? `${obj.WSD} m/s` : "-",
        dust: "-",        // 미세먼지(환경부 API 연동시 값)
        fineDust: "-",    // 초미세먼지
        uv: "-",          // 자외선
      });
      setWeatherType(wType);
      setLoading(false);
    }).catch(() => {
      setWeatherData(null);
      setLoading(false);
    });
  }, []);

  const { icon, label } = weatherTypeInfo[weatherType];

  if (loading) return <div className="card weather-card">로딩중...</div>;
  if (!weatherData) return <div className="card weather-card">날씨 데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="card weather-card">
      <div className="weather-title">날씨</div>
      <div className="weather-content">
        <div className="weather-texts">
          <div className="weather-temp">{weatherData.temp}°</div>
          <div className="weather-detail">
            <span>습도 {weatherData.humidity}%</span>
            <span className="divider">|</span>
            <span>{weatherData.wind}</span>
          </div>
          <div className="weather-status"><b>{label}</b></div>
          <div className="weather-index">
            <div>
              <span>미세먼지</span>
              <span className="weather-index-value blue">{weatherData.dust}</span>
            </div>
            <div>
              <span>초미세먼지</span>
              <span className="weather-index-value blue">{weatherData.fineDust}</span>
            </div>
            <div>
              <span>자외선</span>
              <span className="weather-index-value green">{weatherData.uv}</span>
            </div>
          </div>
        </div>
        <img src={icon} alt={label} className="weather-icon" />
      </div>
    </div>
  );
}
