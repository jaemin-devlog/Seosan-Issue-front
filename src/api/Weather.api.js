const PROXY_URL = "http://localhost:4000/api/weather"; // 프록시 서버 주소


// 기상청 단기/초단기예보에 맞는 base_date, base_time 생성 함수
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

export async function fetchWeatherData(nx = 68, ny = 107) {
  const { baseDate, baseTime } = getBaseDateTime();

  const params = new URLSearchParams({
    base_date: baseDate,  // YYYYMMDD
    base_time: baseTime,  // HHMM
    nx: nx.toString(),    // 격자 X
    ny: ny.toString(),    // 격자 Y
    // 필요시 추가 파라미터 입력 (API 엔드포인트에 따라)
  });

  const url = `${PROXY_URL}?${params.toString()}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      // 대부분 인증키, 파라미터 에러면 여기서 걸림
      console.error("JSON 파싱 에러, 원본 응답:", text);
      throw new Error("날씨 API 응답이 JSON이 아닙니다. (에러 메시지: " + text + ")");
    }

    console.log("프론트에서 받은 응답:", data);
    return data;
  } catch (err) {
    console.error("날씨 정보 요청 실패:", err);
    throw err;
  }
}
