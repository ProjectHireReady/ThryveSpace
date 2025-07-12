import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { EntriesProvider } from "./context/EntriesContext";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import FeaturesPage from './FeaturesPage.JSX';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <EntriesProvider>
        <App />
      </EntriesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
