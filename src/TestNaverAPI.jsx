import React, { useState } from 'react';
import { naverSearchAPI, aiSearchAPI } from './api/backend.api';

export default function TestNaverAPI() {
  const [searchQuery, setSearchQuery] = useState('서산');
  const [naverResults, setNaverResults] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('naver');

  const handleNaverSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await naverSearchAPI.search(searchQuery, 'news', 5);
      console.log('네이버 검색 결과:', results);
      setNaverResults(results);
    } catch (err) {
      console.error('네이버 검색 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await aiSearchAPI.searchBrief(searchQuery);
      console.log('AI 검색 결과:', results);
      setAiResults(results);
    } catch (err) {
      console.error('AI 검색 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>API 테스트 페이지</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('naver')}
          style={{ marginRight: '10px', fontWeight: activeTab === 'naver' ? 'bold' : 'normal' }}
        >
          네이버 검색
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          style={{ fontWeight: activeTab === 'ai' ? 'bold' : 'normal' }}
        >
          AI 검색
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어 입력"
          style={{ padding: '5px', marginRight: '10px', width: '300px' }}
        />
        {activeTab === 'naver' ? (
          <button onClick={handleNaverSearch} disabled={loading}>
            {loading ? '검색중...' : '네이버 검색'}
          </button>
        ) : (
          <button onClick={handleAISearch} disabled={loading}>
            {loading ? '검색중...' : 'AI 검색'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          에러: {error}
        </div>
      )}

      {activeTab === 'naver' && naverResults && (
        <div>
          <h3>네이버 검색 결과:</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(naverResults, null, 2)}
          </pre>
        </div>
      )}

      {activeTab === 'ai' && aiResults && (
        <div>
          <h3>AI 검색 결과:</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(aiResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}