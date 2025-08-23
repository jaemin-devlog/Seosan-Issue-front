import React from 'react';
import './Footer.css';
import Logo from '../assets/로고.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-labelledby="footer-heading">
      

      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo-section">
            <img
              src={Logo}
              alt="오늘 - 서산시민을 위한 종합 정보 플랫폼"
              className="footer-logo"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="footer-info-grid">
            <section className="footer-info-item">
              <h3 className="footer-title">서산시청</h3>
              <address className="footer-text">
                충청남도 서산시 관아문길 1 (읍내동)<br />
                대표전화: <a href="tel:041-660-2114">041-660-2114</a><br />
                팩스: 041-660-2209
              </address>
            </section>

            <section className="footer-info-item">
              <h3 className="footer-title">이용안내</h3>
              <p className="footer-text">
                평일: 09:00 - 18:00<br />
                점심시간: 12:00 - 13:00<br />
                토요일, 일요일, 공휴일 휴무
              </p>
            </section>

            <nav className="footer-info-item" aria-label="바로가기">
              <h3 className="footer-title">바로가기</h3>
              <ul className="footer-links">
                <li><a href="/terms">이용약관</a></li>
                <li><a href="/privacy">개인정보처리방침</a></li>
                <li><a href="/accessibility">접근성 안내</a></li>
                <li><a href="/sitemap">사이트맵</a></li>
              </ul>
            </nav>

            <section className="footer-info-item">
              <h3 className="footer-title">SNS</h3>
              <div className="footer-social">
                <a href="https://www.facebook.com/seosancity" aria-label="페이스북 (새 창)" className="social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/seosancity" aria-label="인스타그램 (새 창)" className="social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 15.551a3.551 3.551 0 110-7.102 3.551 3.551 0 010 7.102zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/seosancity" aria-label="유튜브 (새 창)" className="social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </section>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} 서산시. All rights reserved. |
            본 사이트는 서산시민을 위한 공식 정보 플랫폼입니다.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
