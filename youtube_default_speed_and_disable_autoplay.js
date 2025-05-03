// ==UserScript==
// @name         YouTube default speed and disable autoplay
// @version      1.0
// @match        https://m.youtube.com/*
// @grant        none
// @author       gdub812
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_SPEED = 1.5;
    const SPEED_STORAGE_KEY = 'yt-custom-speed-setting';
    let lastAttemptTime = 0;
    const RETRY_INTERVAL = 500;
    const MAX_ATTEMPTS = 10;
    let attempts = 0;

    function getDesiredSpeed() {
        const savedSpeed = localStorage.getItem(SPEED_STORAGE_KEY);
        return savedSpeed ? parseFloat(savedSpeed) : DEFAULT_SPEED;
    }

    function setVideoSpeed() {
        const video = document.querySelector('video');
        const currentTime = Date.now();

        if (currentTime - lastAttemptTime < RETRY_INTERVAL) return;
        lastAttemptTime = currentTime;

        if (video) {
            attempts = 0;
            const desiredSpeed = getDesiredSpeed();

            if (video.playbackRate !== desiredSpeed) {
                video.playbackRate = desiredSpeed;
                //console.log('[Speed Setter] Set speed to:', desiredSpeed);
            }

            if (!video.hasSpeedListener) {
                video.addEventListener('ratechange', () => {
                    const newSpeed = video.playbackRate;
                    localStorage.setItem(SPEED_STORAGE_KEY, newSpeed.toString());
                    //console.log('[Speed Setter] Saved new speed:', newSpeed);
                });
                video.hasSpeedListener = true;
            }
        } else if (attempts < MAX_ATTEMPTS) {
            attempts++;
            setTimeout(setVideoSpeed, RETRY_INTERVAL);
        }
    }

    // Autoplay disable observer code
    const autoplayObserver = new MutationObserver(() => {
        const autoplayToggle = document.querySelector('button.ytm-autonav-toggle-button-container[aria-pressed="true"]');
        if (autoplayToggle) {
            autoplayToggle.click();
            //console.log('[Autoplay] Disabled autoplay');
        }
    });

    const speedObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length && document.querySelector('video')) {
                setVideoSpeed();
                break;
            }
        }
    });

    function initialize() {
        setVideoSpeed();

        autoplayObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        speedObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initialize();
})();
