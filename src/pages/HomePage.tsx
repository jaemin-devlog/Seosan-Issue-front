import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/LoadingStates';

// Lazy loading으로 초기 번들 크기 감소
const HeroSection = lazy(() => import('../components/HeroSection'));
const MainContent = lazy(() => import('../components/MainContent'));
const MapSection = lazy(() => import('../components/MapSection'));
const InfoSection = lazy(() => import('../components/InfoSection'));

const HomePage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner size="large" message="페이지를 불러오고 있습니다..." />}>
      <HeroSection />
      <main id="main-content" role="main">
        <MainContent />
        <MapSection />
        <InfoSection />
      </main>
    </Suspense>
  );
};

export default HomePage;