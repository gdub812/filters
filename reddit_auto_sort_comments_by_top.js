// ==UserScript==
// @name         Reddit Auto Sort Comments by Top
// @version      1.0
// @description  Automatically sorts Reddit comments by top replies by updating the URL and modifying comment links on new Reddit layout
// @author       gdub812
// @match        *://www.reddit.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Updates the current URL to include ?sort=top if it's a comment page.
     * This ensures that comments are sorted by top replies when visiting directly.
     */
    function updateUrl() {
        // Check if the current URL is a Reddit comment page and doesn't already include ?sort=top or &sort=top
        if (window.location.href.match(/\/comments\/[a-z0-9]+/i) && !window.location.href.includes('?sort=top') && !window.location.href.includes('&sort=top')) {
            // Update the URL to include ?sort=top or &sort=top
            const newUrl = window.location.href.includes('?') ? window.location.href + '&sort=top' : window.location.href + '?sort=top';
            window.location.replace(newUrl);
        }
    }

    /**
     * Updates all links to Reddit comment pages on the current page to include ?sort=top.
     * This ensures that comments are sorted by top replies when navigating within Reddit.
     */
    function updateCommentLinks() {
        // Select all links that lead to Reddit comment pages
        const links = document.querySelectorAll('a[href*="/comments/"]');
        links.forEach(link => {
            // If the link doesn't already include ?sort=top or &sort=top, update the href attribute
            if (!link.href.includes('?sort=top') && !link.href.includes('&sort=top')) {
                link.href += link.href.includes('?') ? '&sort=top' : '?sort=top';
            }
        });
    }

    /**
     * Observes the DOM for changes and updates new comment links to include ?sort=top.
     * This ensures that dynamically loaded content is also handled.
     */
    function observeLinks() {
        const observer = new MutationObserver(() => {
            updateCommentLinks();  // Call updateCommentLinks whenever the DOM changes
        });

        // Start observing the document body for changes in the child elements and subtree
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize the script: update the URL and comment links, and start observing for changes
    window.addEventListener('load', () => {
        updateUrl();  // Update the URL on page load
        updateCommentLinks();  // Update all comment links on page load
        observeLinks();  // Start observing the DOM for new comment links
    });
})();
