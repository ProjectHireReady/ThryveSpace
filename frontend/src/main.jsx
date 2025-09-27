import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
// import { MoodProvider } from "./context/MoodContext";
import { EntriesProvider } from "./context/EntriesContext";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        {/* <MoodProvider> */}
          <EntriesProvider>
            <App />
          </EntriesProvider>
        {/* </MoodProvider> */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
