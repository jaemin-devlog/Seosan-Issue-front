const DUST_PROXY_URL = process.env.REACT_APP_DUST_API_URL || "http://localhost:4000/api/dust"; // 미세먼지 프록시 서버 주소

// 실제 미세먼지 API 요청 함수
export async function fetchDustData(sidoName = "충남") {
  const params = new URLSearchParams({
    sidoName,
    returnType: "json" // 이 줄 없어도 서버에서 기본 json으로 반환!
  });

  const url = `${DUST_PROXY_URL}?${params.toString()}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      // 파싱 에러나면 원본 응답 출력
      console.error("미세먼지 JSON 파싱 에러, 원본 응답:", text);
      throw new Error("미세먼지 API 응답이 JSON이 아닙니다. (에러 메시지: " + text + ")");
    }

    // 콘솔에 실제 데이터 찍어보기 (개발용)
    console.log("프론트에서 받은 미세먼지 응답:", data);
    return data;
  } catch (err) {
    console.error("미세먼지 정보 요청 실패:", err);
    throw err;
  }
}
