import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { EntriesProvider } from "./context/EntriesContext";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EntriesProvider>
          <App />
        </EntriesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);