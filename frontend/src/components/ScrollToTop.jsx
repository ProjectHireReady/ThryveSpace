// ScrollToTop.jsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Use "instant" for now (fallback to auto if unsupported)
    try {
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      // fallback
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
