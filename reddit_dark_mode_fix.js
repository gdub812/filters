// ==UserScript==
// @name         Reddit Dark Mode Fix
// @version      2.0
// @description  Force Reddit to detect dark mode preference and ensure theme-dark class
// @author       gdub812
// @match        *://*.reddit.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. Override matchMedia to always return dark mode for prefers-color-scheme
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

    // 2. Function to apply color-scheme and theme-dark class
    function applyDarkMode() {
        document.documentElement.style.setProperty('color-scheme', 'dark', 'important');
        if (!document.documentElement.classList.contains('theme-dark')) {
            document.documentElement.classList.add('theme-dark');
        }
    }

    // 3. Check every 500ms for up to 10 seconds
    function ensureDarkModeFor10Seconds() {
        const start = Date.now();
        const interval = setInterval(() => {
            applyDarkMode();
            if (Date.now() - start > 10000) {
                clearInterval(interval);
            }
        }, 500);
    }

    if (document.documentElement) {
        applyDarkMode();
        ensureDarkModeFor10Seconds();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            applyDarkMode();
            ensureDarkModeFor10Seconds();
        });
    }
})();
