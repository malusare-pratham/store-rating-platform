import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#e2e8f0",
            border: "1px solid #334155",
            borderRadius: "12px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
          },
          success: { iconTheme: { primary: "#34d399", secondary: "#064e3b" } },
          error: { iconTheme: { primary: "#fb7185", secondary: "#4c0519" } },
          duration: 3500,
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
