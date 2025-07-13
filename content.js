(function () {
  "use strict";

  // Check if the page content type is markdown or plain text
  function shouldRenderAsMarkdown() {
    const contentType = document.contentType || "";
    const url = window.location.href;

    // Check content type
    if (
      contentType.includes("text/markdown") ||
      contentType.includes("text/plain") ||
      contentType.includes("text/x-markdown")
    ) {
      return true;
    }

    // Check file extension
    if (url.match(/\.(md|markdown|txt)(\?.*)?$/i)) {
      return true;
    }

    // Check if it's a GitHub raw file or similar
    if (
      url.includes("raw.githubusercontent.com") ||
      url.includes("gist.githubusercontent.com")
    ) {
      return true;
    }

    return false;
  }

  // Check if content looks like markdown
  function looksLikeMarkdown(text) {
    const markdownPatterns = [
      /^#{1,6}\s+.+$/m, // Headers
      /^\*\s+.+$/m, // Unordered lists
      /^\d+\.\s+.+$/m, // Ordered lists
      /\[.+\]\(.+\)/, // Links
      /\*\*.+\*\*/, // Bold
      /\*.+\*/, // Italic
      /^```/m, // Code blocks
      /`[^`]+`/, // Inline code
      /^>/m, // Blockquotes
    ];

    return markdownPatterns.some((pattern) => pattern.test(text));
  }

  // Render markdown content
  function renderMarkdown() {
    if (!shouldRenderAsMarkdown()) {
      return;
    }

    // Get the raw text content
    const bodyText = document.body.textContent || document.body.innerText || "";

    // Skip if content is too short or doesn't look like markdown
    if (bodyText.length < 10 || !looksLikeMarkdown(bodyText)) {
      return;
    }

    try {
      // Configure marked (should be available now since it's loaded before this script)
      if (typeof marked !== "undefined") {
        marked.setOptions({
          gfm: true,
          breaks: true,
          sanitize: false,
          smartLists: true,
          smartypants: true,
          highlight: function (code, lang) {
            // Use highlight.js for syntax highlighting
            if (lang && typeof hljs !== "undefined") {
              try {
                return hljs.highlight(code, { language: lang }).value;
              } catch (e) {
                return code;
              }
            }
            return code;
          },
        });

        // Parse markdown
        const html = marked.parse(bodyText);

        // Create new document structure
        const newContent = `
          <div class="markdown-reader">
            <div class="markdown-content">
              ${html}
            </div>
          </div>
        `;

        // Replace page content
        document.body.innerHTML = newContent;
        document.body.classList.add("markdown-reader-body");

        // Add title if there's an h1
        const firstH1 = document.querySelector("h1");
        if (firstH1 && !document.title) {
          document.title = firstH1.textContent;
        }

        // Highlight all code blocks if highlight.js is available
        if (typeof hljs !== "undefined") {
          hljs.highlightAll();
        }
      }
    } catch (error) {
      console.error("Markdown rendering error:", error);
    }
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMarkdown);
  } else {
    renderMarkdown();
  }
})();
