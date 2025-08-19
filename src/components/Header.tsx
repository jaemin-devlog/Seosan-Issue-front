import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import Logo from '../assets/로고.png';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: '메인' },
    { path: '/explore', label: '탐색' },
    { path: '/ai-search', label: 'AI 검색' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <a href="#main-content" className="skip-link">본문으로 바로가기</a>
      <div className="header-container">
        <Link 
          to="/"
          className="logo"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          onFocus={() => setIsLogoHovered(true)}
          onBlur={() => setIsLogoHovered(false)}
          aria-label="오늘 홈페이지로 이동"
        >
          <img 
            src={Logo} 
            alt="오늘 - 서산시민을 위한 종합 정보 플랫폼" 
            className={`logo-image ${isLogoHovered ? 'hovered' : ''}`}
            loading="eager"
            width="112"
            height="28"
          />
          <div className="logo-glow" />
        </Link>
        <nav className="nav" role="navigation" aria-label="메인 네비게이션">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              <span className="nav-text">{item.label}</span>
              <span className="nav-indicator" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;