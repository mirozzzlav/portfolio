import { Global } from "@emotion/react";
import { App } from "src/App.jsx";
import { I18nProvider } from "src/i18n.jsx";
import { globalStyles } from "src/styles/globalStyles.js";

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
