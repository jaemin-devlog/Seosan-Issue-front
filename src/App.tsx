import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
// @ts-ignore
import Header from './Header/Header.jsx';
import { LoadingSpinner } from './components/LoadingStates';

// Lazy loading으로 초기 번들 크기 감소
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const AiSearchPage = lazy(() => import('./pages/AiSearchPage'));
const Footer = lazy(() => import('./components/Footer'));
// @ts-ignore
const TestNaverAPI = lazy(() => import('./TestNaverAPI'));
// @ts-ignore
const ApiTest = lazy(() => import('./components/ApiTest'));
// @ts-ignore
const ApiStatusCheck = lazy(() => import('./components/ApiStatusCheck'));

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="App">
            <Header />
            <Suspense fallback={<LoadingSpinner size="large" message="페이지를 불러오고 있습니다..." />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/ai-search" element={<AiSearchPage />} />
                <Route path="/test-naver" element={<TestNaverAPI />} />
                <Route path="/api-test" element={<ApiTest />} />
                <Route path="/api-status" element={<ApiStatusCheck />} />
              </Routes>
              <Footer />
            </Suspense>
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;