// frontend/src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CalendarProvider } from "./context/CalendarContext";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CalendarProvider>
          <App />
        </CalendarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);