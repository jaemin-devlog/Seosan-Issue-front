// 반환 타입(메인코드에서 이미 대응하고 있는 형태 그대로)
export type TopicObj = { title: string; isNew?: boolean };
export type PopularTermsResult =
  | string[]
  | TopicObj[]
  | { daily: (string | TopicObj)[]; weekly: (string | TopicObj)[] };

// 옵션 타입
interface GetPopularTermsOptions {
  signal?: AbortSignal;
}

/**
 * 트렌딩 키워드 가져오기
 * - 가능한 엔드포인트를 순차 시도하고, 실패하면 안전한 목업을 반환합니다.
 * - 메인 컴포넌트는 배열/객체 모두 처리하므로 그대로 맞춰줍니다.
 */
export async function getPopularTerms(
  { signal }: GetPopularTermsOptions = {}
): Promise<PopularTermsResult> {
  // ❶ 실제 API가 있다면 여기 순서대로 시도
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://seosan-issue.shop' 
    : '';
    
  const candidates = [
    `${baseUrl}/flask/crawl_popular_terms`,  // Flask API가 정상 작동 중
    `${baseUrl}/api/v1/trending`,            // 백엔드 500 에러 (백업용)
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { signal });
      if (res.ok) {
        const data = await res.json();
        return data as PopularTermsResult;
      }
    } catch (e: any) {
      if (e?.name === "AbortError") throw e;
      // 다음 후보로 진행
    }
  }

  // ❷ 전부 실패 시 안전 목업 반환
  return {
    daily: [
      { title: "서산 날씨", isNew: true },
      "해미읍성",
      "서산 버스",
      "서산시 행사",
      "노인복지",
      "서산 카페",
      "미세 먼지",
    ],
    weekly: [
      "서산 맛집",
      "문화 혜택",
      "아이 돌봄",
      "서산 뉴스",
      "대산읍 공지",
      "주간 일정",
      { title: "서산 축제", isNew: true },
    ],
  };
}
export {};