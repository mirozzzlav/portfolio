import { Global } from "@emotion/react";
import { App } from "./App.jsx";
import { globalStyles } from "./styles/globalStyles.js";

export function Root() {
  return (
    <>
      <Global styles={globalStyles} />
      <App />
    </>
  );
}
