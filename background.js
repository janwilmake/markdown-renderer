/// <reference types="chrome"/>

// Background script to modify request headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // Find existing Accept header or add new one
    let acceptHeaderFound = false;

    for (let i = 0; i < details.requestHeaders.length; i++) {
      if (details.requestHeaders[i].name.toLowerCase() === "accept") {
        // Set to only text/markdown
        details.requestHeaders[i].value = "text/markdown";
        acceptHeaderFound = true;
        break;
      }
    }

    // If no Accept header exists, add one with only text/markdown
    if (!acceptHeaderFound) {
      details.requestHeaders.push({
        name: "Accept",
        value: "text/markdown",
      });
    }

    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);
