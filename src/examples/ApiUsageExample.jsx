import React, { useState, useEffect } from 'react';
import { 
  welfareAPI, 
  seosanAPI, 
  cultureAPI, 
  postsAPI,
  POST_CATEGORIES 
} from '../api/backend.api';

// API 사용 예제들
const ApiUsageExample = () => {
  const [data, setData] = useState(null);

  // 예제 1: 복지-어르신 데이터 가져오기
  const fetchElderlyWelfare = async () => {
    try {
      const result = await welfareAPI.getElderly('대산읍', 0, 5);
      console.log('복지-어르신 데이터:', result);
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 예제 2: 공지사항 가져오기
  const fetchNotices = async () => {
    try {
      const result = await seosanAPI.getNotices('대산읍', 0, 10);
      console.log('공지사항:', result);
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 예제 3: 문화소식 가져오기
  const fetchCultureNews = async () => {
    try {
      const result = await cultureAPI.getCultureNews('대산읍', 0, 5);
      console.log('문화소식:', result);
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 예제 4: 카테고리별 직접 호출
  const fetchByCategory = async (category) => {
    try {
      const result = await postsAPI.getByCategory(category, '대산읍', 0, 5);
      console.log(`${category} 데이터:`, result);
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 예제 5: 여러 카테고리 동시 호출
  const fetchMultipleCategories = async () => {
    try {
      const [elderly, disabled, health] = await Promise.all([
        welfareAPI.getElderly('대산읍', 0, 3),
        welfareAPI.getDisabled('대산읍', 0, 3),
        seosanAPI.getHealth('대산읍', 0, 3)
      ]);
      
      console.log('복지-어르신:', elderly);
      console.log('복지-장애인:', disabled);
      console.log('보건/건강:', health);
      
      setData({ elderly, disabled, health });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 예제 실행
    fetchElderlyWelfare();
  }, []);

  return (
    <div>
      <h2>API 사용 예제</h2>
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={fetchElderlyWelfare}>복지-어르신 조회</button>
        <button onClick={fetchNotices}>공지사항 조회</button>
        <button onClick={fetchCultureNews}>문화소식 조회</button>
        <button onClick={() => fetchByCategory(POST_CATEGORIES.WELFARE_YOUTH)}>청년 복지 조회</button>
        <button onClick={fetchMultipleCategories}>여러 카테고리 동시 조회</button>
      </div>

      <div>
        <h3>조회 결과:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9' }}>
        <h3>API 사용법:</h3>
        <pre style={{ background: '#fff', padding: '10px', border: '1px solid #ddd' }}>
{`// 1. Import API 함수들
import { welfareAPI, seosanAPI, cultureAPI } from '../api/backend.api';

// 2. 복지 관련 API 호출
const elderlyData = await welfareAPI.getElderly('대산읍', 0, 5);
const disabledData = await welfareAPI.getDisabled('대산읍', 0, 5);
const womenFamilyData = await welfareAPI.getWomenFamily('대산읍', 0, 5);
const childYouthData = await welfareAPI.getChildYouth('대산읍', 0, 5);
const youthData = await welfareAPI.getYouth('대산읍', 0, 5);

// 3. 서산시청 관련 API 호출
const healthData = await seosanAPI.getHealth('대산읍', 0, 5);
const noticesData = await seosanAPI.getNotices('대산읍', 0, 5);
const pressReleaseData = await seosanAPI.getPressRelease('대산읍', 0, 5);

// 4. 문화 관련 API 호출
const cultureNewsData = await cultureAPI.getCultureNews('대산읍', 0, 5);
const cityTourData = await cultureAPI.getCityTour('대산읍', 0, 5);
const tourGuideData = await cultureAPI.getTourGuide('대산읍', 0, 5);

// 5. 직접 카테고리 지정하여 호출
import { postsAPI, POST_CATEGORIES } from '../api/backend.api';
const data = await postsAPI.getByCategory(
  POST_CATEGORIES.WELFARE_SENIOR, // 카테고리
  '대산읍',                        // 지역
  0,                              // 페이지 (0부터 시작)
  5                               // 한 페이지당 개수
);`}
        </pre>
      </div>
    </div>
  );
};

export default ApiUsageExample;