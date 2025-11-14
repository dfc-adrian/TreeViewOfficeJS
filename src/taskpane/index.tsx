import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

/* global document, Office, module, require, HTMLElement */

const title = "Contoso Task Pane Add-in";

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

/* Render application after Office initializes */
Office.onReady(() => {
  root?.render(
    <FluentProvider theme={webLightTheme}>
      <App title={title} />
    </FluentProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root?.render(NextApp);
  });
}
Office.actions.associate("ShowTaskpane", () => {
  return Office.addin
    .showAsTaskpane()
    .then(() => {
      return;
    })
    .catch((error) => {
      return error.code;
    });
});

Office.actions.associate("HideTaskpane", () => {
  return Office.addin
    .hide()
    .then(() => {
      return;
    })
    .catch((error) => {
      return error.code;
    });
});
