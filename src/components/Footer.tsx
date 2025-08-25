import React from 'react';
import './Footer.css';
import Logo from '../assets/로고.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer-minimal">
      <div className="logo-with-line">
      <div className="footer-logo-centered">
        <img
          src={Logo}
          alt="오늘 - 서산시민을 위한 종합 정보 플랫폼"
          className="footer-logo-large"
          loading="lazy"
          decoding="async"
        />
      </div>
      </div>
    </footer>
  );
};

export default Footer;
