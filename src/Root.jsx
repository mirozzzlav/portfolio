import { Global } from "@emotion/react";
import { App } from "./App.jsx";
import { I18nProvider } from "./i18n.jsx";
import { globalStyles } from "./styles/globalStyles.js";

export function Root() {
  return (
    <>
      <Global styles={globalStyles} />
      <I18nProvider>
        <App />
      </I18nProvider>
    </>
  );
}
