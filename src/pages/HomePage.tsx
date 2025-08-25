import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/LoadingStates';

// Lazy loading으로 초기 번들 크기 감소
// @ts-ignore
const Mainpage = lazy(() => import('../Mainpage/Mainpage.tsx'));
const MapSection = lazy(() => import('../components/MapSection'));
// @ts-ignore
const RecommendInfo = lazy(() => import('../components/RecommendInfo/RecommendInfo.jsx'));
// @ts-ignore
const LocalNews = lazy(() => import('../components/LocalNews/LocalNews.jsx'));

const HomePage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner size="large" message="페이지를 불러오고 있습니다..." />}>
      <main id="main-content" role="main">
        <Mainpage />
        <MapSection />
        <RecommendInfo />
        <LocalNews />
      </main>
    </Suspense>
  );
};

export default HomePage;