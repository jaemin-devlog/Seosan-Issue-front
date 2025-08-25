# API 요약 기능 이슈 리포트

## 엔드포인트
`POST https://seosan-issue.shop/api/v1/explore/summary`

## 요청 형식
```json
{
  "url": "https://..."
}
```

## 테스트 결과

### ✅ 정상 작동
- 네이버 블로그 URL
  - 예: `https://blog.naver.com/jqradewmqf06397/223974437462`
  - 응답: 200 OK + 요약 데이터

### ❌ 문제 발생
- 네이버 뉴스 URL (일부)
  - 예: `https://n.news.naver.com/mnews/article/421/0008446395?sid=102`
  - 응답: 204 No Content 또는 400 Bad Request

## 예상 원인
1. 네이버 뉴스의 특정 형식 파싱 실패
2. 뉴스 사이트의 크롤링 방지 정책
3. URL 파라미터(`?sid=102` 등) 처리 문제

## 개선 요청사항
1. 네이버 뉴스 URL 파싱 로직 개선
2. 에러 발생 시 명확한 에러 메시지 반환 (현재는 빈 응답)
3. 다양한 뉴스 사이트 지원 확대

## 프론트엔드 임시 대응
- API 실패 시 본문 첫 200자를 요약으로 표시
- 사용자 경험 유지를 위한 폴백 처리 구현 완료