// components/PageTransition.jsx
import { useEffect, useState } from "react";
import "./PageTransition.css";

function PageTransition({ children }) {
  const [transitionClass, setTransitionClass] = useState("page-transition");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitionClass("page-transition show");
    }, 10); // wait a tick so the transition kicks in

    return () => clearTimeout(timer);
  }, []);

  return <div className={transitionClass}>{children}</div>;
}

export default PageTransition;
