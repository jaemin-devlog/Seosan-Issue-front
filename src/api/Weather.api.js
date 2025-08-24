// 백엔드 날씨 API 엔드포인트 - 프록시 사용
const WEATHER_API_URL = process.env.NODE_ENV === 'development' 
  ? "/api/weather/cards"  // 프록시 경로 (/api/v1/weather/cards로 변환됨)
  : "https://seosan-issue.shop/api/v1/weather/cards";


// 기상청 단기/초단기예보에 맞는 base_date, base_time 생성 함수
// eslint-disable-next-line no-unused-vars
function getBaseDateTime() {
  const now = new Date();
  // 기상청 예보 발표 시간 (3시간 간격, 02시 ~ 23시)
  const forecastTimes = [2, 5, 8, 11, 14, 17, 20, 23];
  let hour = now.getHours();

  // 가장 가까운 이전 발표시각 찾기
  let baseHour = forecastTimes[0];
  for (let i = 0; i < forecastTimes.length; i++) {
    if (hour >= forecastTimes[i]) baseHour = forecastTimes[i];
  }

  // 예를 들어 01:30~01:59 요청 시, baseHour가 23이 되어야 하므로 날짜도 하루 전날로 보정 필요
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, "");
  if (hour < forecastTimes[0]) {
    // 자정~01:59까지는 전날 23시 예보를 받아야 함
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, "");
    baseHour = 23;
  }
  const baseTime = String(baseHour).padStart(2, "0") + "00";

  return { baseDate, baseTime };
}


// 실제 API 요청 함수

// 지역명으로 날씨 데이터 요청 (백엔드 API에 맞게 수정)
export async function fetchWeatherData(region = "서산시") {
  // API는 항상 "서산시"로만 호출하면 모든 지역 데이터를 반환함
  const params = new URLSearchParams({
    city: "서산시"  // 항상 서산시로 호출
  });

  const url = `${WEATHER_API_URL}?${params.toString()}`;
  
  console.log('날씨 API 호출:', url, '요청 지역:', region);

  try {
    const res = await fetch(url);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
      console.log('날씨 API 응답:', data);
      
      // API가 에러를 반환한 경우
      if (data.status && data.status >= 400) {
        console.error('날씨 API 에러 응답:', data);
        throw new Error(`날씨 API 에러: ${data.message || 'Unknown error'}`);
      }
      
      // cards 배열이 없거나 비어있는 경우
      if (!data.cards || !Array.isArray(data.cards) || data.cards.length === 0) {
        console.error('날씨 API 응답에 cards 데이터가 없음:', data);
        throw new Error("날씨 데이터를 찾을 수 없습니다.");
      }
    } catch (jsonError) {
      console.error("날씨 API JSON 파싱 에러:", text);
      throw new Error("날씨 API 응답을 파싱할 수 없습니다.");
    }

    return data;
  } catch (err) {
    console.error('날씨 API 에러:', err);
    throw err;
  }
}
