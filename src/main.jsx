import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Global } from "@emotion/react";
import { App } from "./App.jsx";
import { globalStyles } from "./styles/globalStyles.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Global styles={globalStyles} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
