import "./Header.css";
import Bell from '../assets/bell.png';
import Search from '../assets/search.png';
import User from '../assets/user-round.png';
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
      <img src={Logo} alt="서산에 뭐 issue?" className="header-logo" />

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

      <div className="header-icons">
        <img src={Bell} alt="알림" className="header-icon" />
        <img src={Search} alt="검색" className="header-icon" />
        <img src={User} alt="유저" className="header-icon" />
      </div>
    </header>
  );
}
