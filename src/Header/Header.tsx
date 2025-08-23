// src/Header/Header.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import Logo from "../assets/logo.png";

type MenuItem = {
  readonly name: string;
  readonly path: string;
};

const MENU_LIST: ReadonlyArray<MenuItem> = [
  { name: "메인", path: "/" },
  { name: "탐색", path: "/explore" },
  { name: "AI 검색", path: "/ai-search" },
] as const;

export default function Header(): JSX.Element {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="custom-header">
      <Link to="/" className="header-logo-link" aria-label="홈으로 이동">
        <img src={Logo} alt="서산에 뭐 issue?" className="header-logo" />
      </Link>

      <nav className="header-nav" aria-label="주 메뉴">
        {MENU_LIST.map((menu) => {
          const active = isActive(menu.path);
          return (
            <div className="header-menu-wrap" key={menu.path}>
              <Link
                to={menu.path}
                className="header-nav-link"
                aria-current={active ? "page" : undefined}
                data-active={active ? "true" : "false"}
              >
                {menu.name}
              </Link>
              {active && <div className="header-underline" />}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
