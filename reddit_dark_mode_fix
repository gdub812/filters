// ==UserScript==
// @name         Reddit Dark Mode Fix
// @version      1.0
// @description  Force Reddit to detect dark mode preference
// @author       gdub812
// @match        *://*.reddit.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Override matchMedia to always return dark mode for prefers-color-scheme
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = function(query) {
        if (query === '(prefers-color-scheme: dark)') {
            return {
                matches: true,
                media: query,
                onchange: null,
                addListener: function() {},
                removeListener: function() {},
                addEventListener: function() {},
                removeEventListener: function() {},
                dispatchEvent: function() { return true; }
            };
        }
        return originalMatchMedia.call(this, query);
    };

    // Force color-scheme on document
    if (document.documentElement) {
        document.documentElement.style.setProperty('color-scheme', 'dark', 'important');
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.documentElement.style.setProperty('color-scheme', 'dark', 'important');
        });
    }
})();
