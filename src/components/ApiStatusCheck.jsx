import React, { useState, useEffect } from 'react';
import { 
  postsAPI, 
  weatherAPI, 
  naverSearchAPI, 
  statsAPI, 
  regionAPI,
  seosanAPI,
  welfareAPI
} from '../api/backend.api';
import './ApiStatusCheck.css';

const ApiStatusCheck = () => {
  const [apiStatus, setApiStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const checkApis = async () => {
    setLoading(true);
    const results = {};

    // 1. GET 게시글 목록 조회
    try {
      await postsAPI.getList(1);
      results.postsList = { status: '✅', message: 'GET 게시글 목록 조회' };
    } catch (error) {
      results.postsList = { status: '❌', message: 'GET 게시글 목록 조회', error: error.message };
    }

    // 2. GET 특정 지역 날씨 조회
    try {
      await weatherAPI.getByLocation('해미면');
      results.weather = { status: '✅', message: 'GET 특정 지역 날씨 조회' };
    } catch (error) {
      results.weather = { status: '❌', message: 'GET 특정 지역 날씨 조회', error: error.message };
    }

    // 3. POST 네이버 데일리 검색 (현재 GET으로 구현)
    try {
      await naverSearchAPI.getDailyTrend();
      results.naverDaily = { status: '⚠️', message: 'POST 네이버 데일리 검색 (GET으로 구현됨)' };
    } catch (error) {
      results.naverDaily = { status: '❌', message: 'POST 네이버 데일리 검색', error: error.message };
    }

    // 4. GET 게시글 목록 조회(필터링 가능)
    try {
      await postsAPI.getByCategory('NOTICE', '대산읍', 0, 5);
      results.postsFiltered = { status: '✅', message: 'GET 게시글 목록 조회(필터링 가능)' };
    } catch (error) {
      results.postsFiltered = { status: '❌', message: 'GET 게시글 목록 조회(필터링 가능)', error: error.message };
    }

    // 5. GET 게시글 상세 조회
    try {
      await postsAPI.getDetail(1);
      results.postDetail = { status: '✅', message: 'GET 게시글 상세 조회' };
    } catch (error) {
      results.postDetail = { status: '❌', message: 'GET 게시글 상세 조회', error: error.message };
    }

    // 6. GET 콘텐츠 통계
    try {
      await statsAPI.getContentStats();
      results.stats = { status: '✅', message: 'GET 콘텐츠 통계' };
    } catch (error) {
      results.stats = { status: '❌', message: 'GET 콘텐츠 통계', error: error.message };
    }

    // 7. GET 지역별로 조회(페이징)
    try {
      await regionAPI.getByRegion('대산읍', 1, 10);
      results.region = { status: '✅', message: 'GET 지역별로 조회(페이징)' };
    } catch (error) {
      results.region = { status: '❌', message: 'GET 지역별로 조회(페이징)', error: error.message };
    }

    // 추가 API 체크
    try {
      await seosanAPI.getNotices('대산읍', 0, 2);
      results.notices = { status: '✅', message: 'GET 공지사항 (서산시청)' };
    } catch (error) {
      results.notices = { status: '❌', message: 'GET 공지사항 (서산시청)', error: error.message };
    }

    try {
      await welfareAPI.getElderly('대산읍', 0, 5);
      results.welfare = { status: '✅', message: 'GET 복지-어르신' };
    } catch (error) {
      results.welfare = { status: '❌', message: 'GET 복지-어르신', error: error.message };
    }

    setApiStatus(results);
    setLoading(false);
  };

  useEffect(() => {
    checkApis();
  }, []);

  return (
    <div className="api-status-container">
      <h2>🔍 API 연동 상태 확인</h2>
      
      {loading ? (
        <div className="loading">API 상태 확인 중...</div>
      ) : (
        <div className="api-list">
          {Object.entries(apiStatus).map(([key, result]) => (
            <div key={key} className={`api-item ${result.status === '✅' ? 'success' : result.status === '⚠️' ? 'warning' : 'error'}`}>
              <span className="status-icon">{result.status}</span>
              <span className="api-name">{result.message}</span>
              {result.error && (
                <span className="error-message">{result.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
      
      <button onClick={checkApis} className="refresh-btn">
        🔄 다시 확인
      </button>
    </div>
  );
};

export default ApiStatusCheck;