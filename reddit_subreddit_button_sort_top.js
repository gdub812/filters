// ==UserScript==
// @name         Subreddit Buttons Sort Top
// @version      1.0
// @description  Adds quick sort buttons (Today, Week, Month, Year) to Reddit subreddit pages for easier top sorting
// @author       User
// @match        *://www.reddit.com/r/*/
// @run-at       document-body
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Extract the current subreddit name from the URL
     */
    function getCurrentSubreddit() {
        const match = window.location.pathname.match(/\/r\/([^\/]+)/);
        return match ? match[1] : null;
    }

    /**
     * Create the quick sort buttons container
     */
    function createQuickSortButtons(subreddit) {
        // Create the container div
        const container = document.createElement('div');
        container.id = 'quick-sort-buttons';
        container.style.cssText = 'display: flex;';

        // Button configurations
        const buttons = [
            { label: 'Today', timeParam: 'day' },
            { label: 'Week', timeParam: 'week' },
            { label: 'Month', timeParam: 'month' },
            { label: 'Year', timeParam: 'year' }
        ];

        // Create each button
        buttons.forEach(buttonConfig => {
            const link = document.createElement('a');
            link.href = `/r/${subreddit}/top/?t=${buttonConfig.timeParam}`;
            link.className = 'text-neutral-content-weak button-small pl-[var(--rem10)] pr-[var(--rem6)] button-plain items-center justify-center button inline-flex';
            link.style.cssText = 'text-decoration: none;';

            // Create button inner structure
            link.innerHTML = `
                <span class="flex items-center justify-center">
                    <span class="flex items-center gap-xs">${buttonConfig.label}</span>
                </span>
            `;

            container.appendChild(link);
        });

        return container;
    }

    /**
     * Add the quick sort buttons to the page
     */
    function addQuickSortButtons() {
        // Check if we're on a subreddit page
        const subreddit = getCurrentSubreddit();
        if (!subreddit) {
            console.log('Quick Sort Buttons: Not on a subreddit page');
            return;
        }

        // Check if buttons already exist
        if (document.getElementById('quick-sort-buttons')) {
            return;
        }

        // Find the target element (shreddit-async-loader)
        const targetElement = document.querySelector('shreddit-async-loader[bundlename="shreddit_sort_dropdown"]');
        if (!targetElement) {
            console.log('Quick Sort Buttons: Target element not found');
            return;
        }

        // Create and add the buttons
        const buttonsContainer = createQuickSortButtons(subreddit);

        // Find the flex container inside the target element
        const flexContainer = targetElement.querySelector('.flex.mr-md.ml-auto');
        if (flexContainer) {
            flexContainer.appendChild(buttonsContainer);
            console.log('Quick Sort Buttons: Successfully added buttons');
        } else {
            console.log('Quick Sort Buttons: Flex container not found');
        }
    }    /**
     * Continuously monitor and add buttons
     */
    function monitorAndAddButtons() {
        // Try to add buttons if they don't exist
        if (!document.getElementById('quick-sort-buttons')) {
            addQuickSortButtons();
        }
    }

    /**
     * Handle URL changes for single-page app navigation
     */
    let currentUrl = window.location.href;

    function handleUrlChange() {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            console.log('Quick Sort Buttons: URL changed to', currentUrl);
            // Remove existing buttons
            const existingButtons = document.getElementById('quick-sort-buttons');
            if (existingButtons) {
                existingButtons.remove();
            }
        }
    }

    // Listen for navigation changes
    window.addEventListener('popstate', handleUrlChange);

    // Override pushState and replaceState to catch programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(handleUrlChange, 100);
    };

    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(handleUrlChange, 100);
    };

    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            // Check if nodes were added or if the target element might have changed
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
        });

        if (shouldCheck) {
            // Debounce the check to avoid too many calls
            clearTimeout(observer.debounceTimer);
            observer.debounceTimer = setTimeout(monitorAndAddButtons, 100);
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Poll for URL changes and missing buttons as fallback
    setInterval(function() {
        handleUrlChange();
        monitorAndAddButtons();
    }, 1000);

    // Initialize
    monitorAndAddButtons();
})();
