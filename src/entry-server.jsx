import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Root } from "src/Root.jsx";

export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <Root />
      </StaticRouter>
    </StrictMode>
  );
}
