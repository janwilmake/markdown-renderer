/// <reference types="chrome"/>
// Use declarativeNetRequest for better reliability in Manifest V3

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1], // Remove any existing rule
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "Accept",
              operation: "set",
              value: "text/markdown, text/plain, text/*, */*",
            },
          ],
        },
        condition: {
          urlFilter: "*",
          resourceTypes: ["main_frame", "sub_frame"],
        },
      },
    ],
  });
});
