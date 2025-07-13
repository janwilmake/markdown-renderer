/// <reference types="chrome"/>

// Background script to modify request headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // Find existing Accept header or add new one
    let acceptHeaderFound = false;

    for (let i = 0; i < details.requestHeaders.length; i++) {
      if (details.requestHeaders[i].name.toLowerCase() === "accept") {
        // Prepend text/markdown to existing accept header
        details.requestHeaders[i].value =
          "text/markdown, " + details.requestHeaders[i].value;
        acceptHeaderFound = true;
        break;
      }
    }

    // If no Accept header exists, add one
    if (!acceptHeaderFound) {
      details.requestHeaders.push({
        name: "Accept",
        value:
          "text/markdown, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
      });
    }

    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);
