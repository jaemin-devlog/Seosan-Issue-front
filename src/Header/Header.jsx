import "./Header.css";

import Logo from '../assets/logo.png';
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const menuList = [
    { name: "메인", path: "/" },
    { name: "탐색", path: "/explore" },
    { name: "AI 검색", path: "/ai-search" },
  ];

  return (
    <header className="custom-header">
      <Link to="/" className="header-logo-link">
        <img src={Logo} alt="서산에 뭐 issue?" className="header-logo" />
      </Link>

      <nav className="header-nav">
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
    </header>
  );
}
