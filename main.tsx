import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; 

console.log("main.tsx loaded");

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find #root element in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
