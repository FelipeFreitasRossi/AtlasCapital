// frontend/src/components/ScrollToTop/ScrollToTop.tsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // opcional: animação suave
    });
  }, [pathname]);

  return null;
}