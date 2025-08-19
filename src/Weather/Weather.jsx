import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "../api/Weather.api.js";

import "./Weather.css";
import "./Weather-responsive.css";
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
// eslint-disable-next-line no-unused-vars
function parseWeatherType(obj) {
  // PTY: 0없음 1비 2비/눈 3눈 4소나기
  // SKY: 1맑음 3구름많음 4흐림
  if (obj.PTY === "1" || obj.PTY === "4") return "rain";
  if (obj.PTY === "2" || obj.PTY === "3") return "snow";
  if (obj.SKY === "1") return "sunny";
  if (obj.SKY === "3" || obj.SKY === "4") return "cloudy";
  return "sunny";
}

const Weather = React.memo(() => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherType, setWeatherType] = useState("sunny");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // 실제 API 호출
    fetchWeatherData("해미면")
      .then((rawData) => {
        if (!isMounted) return;
        
        if (rawData && rawData.temperature) {
          // API 응답 형식: {"temperature":"32.2","humidity":"55","sky":"1","pty":"0","windSpeed":"1.2"}
          
          // 날씨 상태 판단
          let wType = "sunny";
          if (rawData.pty === "1" || rawData.pty === "4") wType = "rain";
          else if (rawData.pty === "2" || rawData.pty === "3") wType = "snow";
          else if (rawData.sky === "3" || rawData.sky === "4") wType = "cloudy";
          else wType = "sunny"; // sky가 "1"이면 맑음
          
          // 온도를 정수로 변환
          const tempValue = parseFloat(rawData.temperature);
          const roundedTemp = Math.round(tempValue);
          
          setWeatherData({
            temp: roundedTemp.toString(),
            humidity: rawData.humidity || "65",
            wind: rawData.windSpeed ? `${rawData.windSpeed} m/s` : "2.5 m/s",
            dust: "보통",      // API에 없어서 기본값
            fineDust: "좋음",   // API에 없어서 기본값
            uv: "보통",        // API에 없어서 기본값
          });
          setWeatherType(wType);
        } else {
          // 데이터가 없을 때 기본값
          setWeatherData({
            temp: "20",
            humidity: "65",
            wind: "2.5 m/s",
            dust: "보통",
            fineDust: "좋음",
            uv: "보통",
          });
          setWeatherType("sunny");
        }
        setLoading(false);
      })
      .catch((error) => {
        if (!isMounted) return;
        
        // 에러 시 기본값 사용
        setWeatherData({
          temp: "20",
          humidity: "65",
          wind: "2.5 m/s",
          dust: "보통",
          fineDust: "좋음",
          uv: "보통",
        });
        setWeatherType("sunny");
        setLoading(false);
      });
    
    return () => {
      isMounted = false;
    };
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
});

Weather.displayName = 'Weather';

export default Weather;
