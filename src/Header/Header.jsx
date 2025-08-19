import "./Header.css";
import { useState, useEffect } from "react";
import Logo from '../assets/logo.png';
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuList = [
    { name: "메인", path: "/" },
    { name: "탐색", path: "/explore" },
    { name: "AI 검색", path: "/ai-search" },
  ];

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // 모바일 메뉴 열렸을 때 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="custom-header">
        <Link to="/" className="header-logo-link">
          <img src={Logo} alt="서산에 뭐 issue?" className="header-logo" />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="header-nav desktop-nav">
          {menuList.map(menu => (
            <div className="header-menu-wrap" key={menu.path}>
              <Link
                to={menu.path}
                className="header-nav-link"
              >
                {menu.name}
              </Link>
              {location.pathname === menu.path && (
                <div className="header-underline"></div>
              )}
            </div>
          ))}
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* 모바일 슬라이드 메뉴 */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <img src={Logo} alt="서산에 뭐 issue?" className="mobile-nav-logo" />
          <button 
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>
        <div className="mobile-nav-items">
          {menuList.map(menu => (
            <Link
              key={menu.path}
              to={menu.path}
              className={`mobile-nav-link ${location.pathname === menu.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
