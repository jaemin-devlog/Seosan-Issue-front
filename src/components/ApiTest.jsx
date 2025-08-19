import React, { useState, useEffect } from 'react';
import { welfareAPI, seosanAPI, cultureAPI } from '../api/backend.api';
import { testAllAPIs } from '../api/test-all-apis';
import './ApiTest.css';

const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('WELFARE_SENIOR');
  const [region, setRegion] = useState('대산읍');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [testResults, setTestResults] = useState(null);

  const categoryOptions = [
    { value: 'WELFARE_SENIOR', label: '복지-어르신', api: () => welfareAPI.getElderly(region, page, size) },
    { value: 'WELFARE_DISABLED', label: '복지-장애인', api: () => welfareAPI.getDisabled(region, page, size) },
    { value: 'WELFARE_WOMEN_FAMILY', label: '복지-여성가족', api: () => welfareAPI.getWomenFamily(region, page, size) },
    { value: 'WELFARE_CHILD_YOUTH', label: '복지-아동청소년', api: () => welfareAPI.getChildYouth(region, page, size) },
    { value: 'WELFARE_YOUTH', label: '복지-청년', api: () => welfareAPI.getYouth(region, page, size) },
    { value: 'HEALTH_WELLNESS', label: '보건/건강', api: () => seosanAPI.getHealth(region, page, size) },
    { value: 'NOTICE', label: '공지사항', api: () => seosanAPI.getNotices(region, page, size) },
    { value: 'PRESS_RELEASE', label: '보도자료', api: () => seosanAPI.getPressRelease(region, page, size) },
    { value: 'CULTURE_NEWS', label: '문화소식', api: () => cultureAPI.getCultureNews(region, page, size) },
    { value: 'CITY_TOUR', label: '시티투어', api: () => cultureAPI.getCityTour(region, page, size) },
    { value: 'TOUR_GUIDE', label: '관광/안내', api: () => cultureAPI.getTourGuide(region, page, size) },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedOption = categoryOptions.find(opt => opt.value === selectedCategory);
      console.log('선택된 카테고리:', selectedCategory);
      console.log('선택된 옵션:', selectedOption);
      
      if (selectedOption) {
        const result = await selectedOption.api();
        console.log('API 응답 결과:', result);
        setData(result);
      }
    } catch (err) {
      setError(err.message);
      console.error('API 호출 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setError(null);
    setTestResults(null);
    
    try {
      const results = await testAllAPIs();
      setTestResults(results);
    } catch (err) {
      setError(err.message);
      console.error('전체 테스트 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, region, page, size]);

  return (
    <div className="api-test-container">
      <h2>API 테스트 페이지</h2>
      
      <div className="controls">
        <div className="control-group">
          <label>카테고리:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>지역:</label>
          <input 
            type="text" 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>페이지:</label>
          <input 
            type="number" 
            value={page} 
            onChange={(e) => setPage(Number(e.target.value))}
            min="0"
          />
        </div>

        <div className="control-group">
          <label>사이즈:</label>
          <input 
            type="number" 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
            min="1"
            max="20"
          />
        </div>

        <button onClick={fetchData} disabled={loading}>
          {loading ? '로딩중...' : '다시 조회'}
        </button>
        
        <button 
          onClick={runAllTests} 
          disabled={loading}
          style={{ 
            backgroundColor: '#ff6b6b',
            marginLeft: '10px'
          }}
        >
          {loading ? '테스트중...' : '🧪 전체 API 테스트'}
        </button>
      </div>

      <div className="api-url">
        <strong>API URL:</strong> 
        <code>
          http://34.64.60.156:8083/api/posts?category={selectedCategory}&region={region}&page={page}&size={size}
        </code>
      </div>

      {error && (
        <div className="error">
          <h3>오류 발생:</h3>
          <p>{error}</p>
        </div>
      )}

      {loading && <div className="loading">데이터 로딩중...</div>}

      {!loading && data && (
        <div className="result">
          <h3>조회 결과:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      
      {!loading && testResults && (
        <div className="test-results" style={{ marginTop: '20px' }}>
          <h3>🧪 전체 API 테스트 결과</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '10px',
            marginTop: '15px'
          }}>
            {testResults.map((result, index) => (
              <div 
                key={index}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: result.status === 'success' ? '#e8f5e9' : '#ffebee'
                }}
              >
                <span style={{ 
                  fontSize: '18px',
                  marginRight: '8px'
                }}>
                  {result.status === 'success' ? '✅' : '❌'}
                </span>
                <strong>{result.name}</strong>
                {result.status === 'failed' && (
                  <div style={{ 
                    fontSize: '12px',
                    color: '#d32f2f',
                    marginTop: '5px'
                  }}>
                    {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}>
            <strong>요약:</strong>
            <div>
              ✅ 성공: {testResults.filter(r => r.status === 'success').length}개 | 
              ❌ 실패: {testResults.filter(r => r.status === 'failed').length}개 | 
              📊 전체: {testResults.length}개
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTest;