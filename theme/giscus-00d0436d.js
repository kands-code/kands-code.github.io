"use strict";

const getStoredTheme = () => {
  const mbt = localStorage.getItem("mdbook-theme");
  if (
    mbt === null &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark_tritanopia";
  }
  return ["coal", "navy", "ayu"].includes(mbt)
    ? "dark_tritanopia"
    : "light_tritanopia";
};

const setGiscusTheme = () => {
  const sendMessage = (message) => {
    const igiscus = document.querySelector("iframe.giscus-frame");
    if (igiscus) {
      igiscus.contentWindow.postMessage(
        { giscus: message },
        "https://giscus.app"
      );
    }
  };
  sendMessage({ setConfig: { theme: getStoredTheme() } });
};

const testUrl = /^(?:\/(?!\/)(?:[^\/]+\/)*index\.html|\/[^\/]+|\/)$/;
if (!testUrl.test(window.location.pathname)) {
  document.addEventListener("DOMContentLoaded", () => {
    const giscusAttributes = {
      src: "https://giscus.app/client.js",
      "data-repo": "kands-code/kands-code.github.io",
      "data-repo-id": "MDEwOlJlcG9zaXRvcnkzNzM0MzE3OTY=",
      "data-category": "General",
      "data-category-id": "DIC_kwDOFkId9M4CWPr2",
      "data-mapping": "pathname",
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": getStoredTheme(),
      "data-lang": "zh-CN",
      "data-loading": "lazy",
      crossorigin: "anonymous",
      async: "",
    };
    const giscusScript = document.createElement("script");
    Object.entries(giscusAttributes).forEach(([key, value]) =>
      giscusScript.setAttribute(key, value)
    );
    document.querySelector(".giscus-comment").appendChild(giscusScript);
  });
}
