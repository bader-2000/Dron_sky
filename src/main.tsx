import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // مهم جدا إذا ستستخدم Tailwind لاحقاً

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
