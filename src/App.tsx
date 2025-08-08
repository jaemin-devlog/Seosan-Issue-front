import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import { LoadingSpinner } from './components/LoadingStates';

// Lazy loading으로 초기 번들 크기 감소
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const Footer = lazy(() => import('./components/Footer'));

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