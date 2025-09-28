import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  BookOpen,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  mainNavLinks,
  authNavLinks,
  dashboardNavLinks,
  guestDashboardLinks,
} from "../data/navLinks";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  const isDashboardPage =
    location.pathname.startsWith("/mood") ||
    location.pathname.startsWith("/entries") ||
    location.pathname.startsWith("/insights");

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  let navLinks;
  if (isAuthPage) {
    navLinks = authNavLinks;
  } else if (isDashboardPage && user) {
    navLinks = dashboardNavLinks;
  } else if (isDashboardPage && !user) {
    navLinks = guestDashboardLinks; // Guests see limited dashboard
  } else {
    navLinks = mainNavLinks;
  }
  // let navLinks = mainNavLinks;
  // if (isAuthPage) {
  //   navLinks = authNavLinks; // just show logo
  // } else if (isDashboardPage && user) {
  //   navLinks = dashboardNavLinks;
  // }

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Dashboard navigation items with icons
  const dashboardItems = [
    { to: "/mood", label: "Mood", icon: Sun },
    { to: "/entries", label: "Entries", icon: BookOpen },
    { to: "/insights", label: "Insights", icon: BarChart3 },
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      {/* Logo */}
      <Link to="/" className="logo">
        ThryveSpace
      </Link>

      {/* Desktop Navigation */}
      {user && isDashboardPage ? (
        // Logged-in dashboard navigation
        <div className="nav-content">
          <div className="dashboard-nav">
            {dashboardItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`dashboard-pill ${isActive ? "active" : ""}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-section" ref={dropdownRef}>
            <button
              className="profile-button"
              onClick={toggleProfileDropdown}
              aria-expanded={isProfileDropdownOpen}
              aria-haspopup="true"
            >
              <User size={20} />
              <span className="profile-name">
                {user.firstName || "Profile"}
              </span>
            </button>

            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <User size={18} />
                  Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <Settings size={18} />
                  Settings
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Guest navigation or auth pages
        navLinks.length > 0 && (
          <ul className="nav-links desktop-only">
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
        )
      )}

      {/* Mobile Menu Button */}
      {(user || navLinks.length > 0) && (
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {user && isDashboardPage ? (
            // Mobile dashboard menu
            <div className="mobile-dashboard-menu">
              {dashboardItems.map((item) => {
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`mobile-nav-item ${isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="mobile-divider"></div>

              {/* Profile + nested logout */}
              <div className="mobile-nav-group">
                <Link to="/profile" className="mobile-nav-item">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="mobile-nav-item logout"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // Mobile guest menu
            <div className="mobile-guest-menu">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.type === "internal" ? (
                    <Link to={link.to} className="mobile-nav-item">
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-nav-item"
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
