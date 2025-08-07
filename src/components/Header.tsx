import React, { useState, useEffect, useCallback } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('main');
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveLink(id);
    
    // Smooth scroll to section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const navItems = [
    { id: 'main', label: '메인' },
    { id: 'explore', label: '탐색' },
    { id: 'ai-search', label: 'AI 검색' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <a href="#main-content" className="skip-link">본문으로 바로가기</a>
      <div className="header-container">
        <a 
          href="/"
          className="logo"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          onFocus={() => setIsLogoHovered(true)}
          onBlur={() => setIsLogoHovered(false)}
          aria-label="오늘 홈페이지로 이동"
        >
          <img 
            src="/images/로고.png" 
            alt="오늘 - 서산시민을 위한 종합 정보 플랫폼" 
            className={`logo-image ${isLogoHovered ? 'hovered' : ''}`}
            loading="eager"
            width="112"
            height="28"
          />
          <div className="logo-glow" />
        </a>
        <nav className="nav" role="navigation" aria-label="메인 네비게이션">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${activeLink === item.id ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, item.id)}
              aria-current={activeLink === item.id ? 'page' : undefined}
            >
              <span className="nav-text">{item.label}</span>
              <span className="nav-indicator" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;