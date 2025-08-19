import React, { useState, useEffect, useRef } from 'react';
import './HeroSection.css';
import Logo1 from '../assets/로고1.png';
import MainLogo from '../assets/MainLogo.png';

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className={`hero-section ${isVisible ? 'visible' : ''}`} ref={heroRef} aria-label="메인 배너">
      <div className="hero-background-pattern" 
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
        }}
      />
      <div className="hero-container">
        <div className="hero-content">
          <img 
            src={Logo1} 
            alt="오늘 - 서산시민을 위한 종합 정보 플랫폼 로고" 
            className="hero-logo"
            style={{
              transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`
            }}
          />
          <p className="hero-description">서산시민을 위한 종합 정보 플랫폼</p>
        </div>
        
        <div className="ai-search-section">
          <img 
            src={MainLogo} 
            alt="AI 기반 서산 정보 검색 서비스 - 무엇이든 물어보세요" 
            className="ai-search-banner"
            style={{
              transform: `scale(1.02) translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
            }}
          />
        </div>
      </div>
      <div className="hero-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 C150,80 350,0 600,50 C850,100 1050,30 1200,60 L1200,120 L0,120 Z" fill="currentColor"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;