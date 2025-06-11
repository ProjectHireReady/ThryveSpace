import { Link, useLocation } from "react-router-dom";
import {
  mainNavLinks,
  authNavLinks,
  dashboardNavLinks,
} from "../data/navLinks";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();

  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  const isDashboardPage =
    location.pathname.startsWith("/mood") ||
    location.pathname.startsWith("/entries") ||
    location.pathname.startsWith("/insights");

  let navLinks = mainNavLinks;
  if (isAuthPage) {
    navLinks = authNavLinks; // just show logo
  } else if (isDashboardPage) {
    navLinks = dashboardNavLinks;
  }

  return (
    <nav className="navbar" aria-label="Main Navigation">
      {/* Show logo */}
      <Link to="/" className="logo">
        ThryveSpace
      </Link>

      {/* Show nav links only if there are some to show */}
      {navLinks.length > 0 && (
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.type === "internal" ? (
                <Link to={link.to}>{link.label}</Link>
              ) : (
                <a href={link.to} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default NavBar;
