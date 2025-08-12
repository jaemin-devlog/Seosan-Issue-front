const PROXY_URL = "http://localhost:4000/api/weather";

// 2024년 3월 1일 11시 기준 예시 (공식문서 기준)
// base_time: 1100 (11:00), tmef: 1200 (12:00)
const params = new URLSearchParams({
  tmfc: "202403011100",  // base_time
  tmef: "2024030112",    // 예보시각
  vars: "T1H",           // 온도
  nx: 68,                // 서산
  ny: 107
});
const url = `${PROXY_URL}?${params.toString()}`;

fetch(url).then(res => res.text()).then(console.log);
