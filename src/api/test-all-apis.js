// 모든 API 엔드포인트 테스트 스크립트
import { 
  welfareAPI, 
  seosanAPI, 
  cultureAPI, 
  weatherAPI,
  naverSearchAPI,
  aiSearchAPI,
  mainPageAPI,
  statsAPI
} from './backend.api.js';

const testResults = [];

async function testAPI(name, testFunc) {
  try {
    console.log(`Testing ${name}...`);
    const result = await testFunc();
    console.log(`✅ ${name} - Success`, result);
    testResults.push({ name, status: 'success', data: result });
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ ${name} - Failed:`, error.message);
    testResults.push({ name, status: 'failed', error: error.message });
    return { success: false, error: error.message };
  }
}

export async function testAllAPIs() {
  console.log('=== API 연동 테스트 시작 ===\n');
  
  // 1. 복지 API 테스트
  console.log('📦 복지 API 테스트');
  await testAPI('복지-어르신', () => welfareAPI.getElderly('대산읍', 0, 2));
  await testAPI('복지-장애인', () => welfareAPI.getDisabled('대산읍', 0, 2));
  await testAPI('복지-여성가족', () => welfareAPI.getWomenFamily('대산읍', 0, 2));
  await testAPI('복지-아동청소년', () => welfareAPI.getChildYouth('대산읍', 0, 2));
  await testAPI('복지-청년', () => welfareAPI.getYouth('대산읍', 0, 2));
  
  // 2. 서산시청 API 테스트
  console.log('\n🏛️ 서산시청 API 테스트');
  await testAPI('보건/건강', () => seosanAPI.getHealth('대산읍', 0, 2));
  await testAPI('공지사항', () => seosanAPI.getNotices('대산읍', 0, 2));
  await testAPI('보도자료', () => seosanAPI.getPressRelease('대산읍', 0, 2));
  
  // 3. 문화 API 테스트
  console.log('\n🎭 문화 API 테스트');
  await testAPI('문화소식', () => cultureAPI.getCultureNews('대산읍', 0, 2));
  await testAPI('시티투어', () => cultureAPI.getCityTour('대산읍', 0, 2));
  await testAPI('관광/안내', () => cultureAPI.getTourGuide('대산읍', 0, 2));
  
  // 4. 날씨 API 테스트
  console.log('\n☀️ 날씨 API 테스트');
  await testAPI('날씨 정보', () => weatherAPI.getByLocation('해미면'));
  
  // 5. 네이버 검색 API 테스트
  console.log('\n🔍 네이버 검색 API 테스트');
  await testAPI('네이버 뉴스 검색', () => naverSearchAPI.search('서산시', 'news', 3));
  
  // 6. AI 검색 API 테스트 (주의: 실제 AI 서버가 필요)
  console.log('\n🤖 AI 검색 API 테스트');
  await testAPI('AI 검색 간략', () => aiSearchAPI.searchBrief('서산시 날씨'));
  await testAPI('AI 검색 상세', () => aiSearchAPI.searchDetail('서산시 복지 정책'));
  
  // 7. 메인페이지 API 테스트
  console.log('\n📊 메인페이지 API 테스트');
  await testAPI('인기 검색어', () => mainPageAPI.getTrendingKeywords());
  
  // 8. 통계 API 테스트
  console.log('\n📈 통계 API 테스트');
  await testAPI('콘텐츠 통계', () => statsAPI.getContentStats());
  
  // 결과 요약
  console.log('\n=== 테스트 결과 요약 ===');
  const successCount = testResults.filter(r => r.status === 'success').length;
  const failCount = testResults.filter(r => r.status === 'failed').length;
  
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  console.log(`📊 전체: ${testResults.length}개`);
  
  // 실패한 API 목록
  if (failCount > 0) {
    console.log('\n실패한 API 목록:');
    testResults
      .filter(r => r.status === 'failed')
      .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }
  
  return testResults;
}

// 브라우저 콘솔에서 실행할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
  window.testAllAPIs = testAllAPIs;
  console.log('💡 브라우저 콘솔에서 testAllAPIs()를 실행하여 모든 API를 테스트할 수 있습니다.');
}