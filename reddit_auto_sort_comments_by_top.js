// ==UserScript==
// @name         Reddit Auto Sort By Top
// @version      1.2
// @description  Automatically sorts Reddit comments by top replies and subreddits by top posts by updating URLs
// @author       gdub812
// @match        *://www.reddit.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';    /**
     * Updates the current URL to include ?sort=top if it's a comment page with no sort parameter.
     * This ensures that comments are sorted by top replies when visiting directly.
     */
    function updateCommentUrl() {
        // Check if the current URL is a Reddit comment page and doesn't already include any sort parameter
        if (window.location.href.match(/\/comments\/[a-z0-9]+/i) && !window.location.href.includes('sort=')) {
            // Update the URL to include ?sort=top or &sort=top
            const newUrl = window.location.href.includes('?') ? window.location.href + '&sort=top' : window.location.href + '?sort=top';
            window.location.replace(newUrl);
        }
    }

    /**
     * Updates the current URL to include /top/ if it's a subreddit page with no sort parameter.
     * This ensures that subreddit posts are sorted by top when visiting directly.
     */
    function updateSubredditUrl() {
        // Check if the current URL is a base subreddit page (ends with /r/subreddit_name/)
        if (window.location.href.match(/\/r\/[a-zA-Z0-9_]+\/$/)) {
            // Append 'top/' to the URL
            const newUrl = window.location.href + 'top/';
            window.location.replace(newUrl);
        }
    }

    /**
     * Main function to update URLs for both comments and subreddits
     */
    function updateUrl() {
        updateCommentUrl();
        updateSubredditUrl();
    }

    // Store the current URL to detect changes
    let currentUrl = window.location.href;

    /**
     * Check for URL changes and update if needed
     */
    function checkUrlChange() {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            updateUrl();
        }
    }

    // Execute URL update immediately for faster response on slow connections
    updateUrl();

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', updateUrl);

    // Override pushState and replaceState to catch programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(updateUrl, 0); // Use setTimeout to ensure URL has updated
    };

    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(updateUrl, 0);
    };

    // Fallback: Poll for URL changes every 500ms
    setInterval(checkUrlChange, 500);
})();
