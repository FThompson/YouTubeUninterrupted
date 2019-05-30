const TIME_BETWEEN_RESETS = 10 * 60 * 1000; // ten minutes
const RESET_ACTIVITY = 'window.location = "javascript:window.yt.util.activity.setTimestamp(Date.now());";';

let timers = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    let url = new URL(tab.url);
    if (url.hostname.endsWith('youtube.com') && url.pathname.startsWith('/watch')) {
        if (tab.status === 'complete' && changeInfo.status === 'complete') {
            startKeepActive(tabId);
        }
    } else {
        endKeepActive(tabId);
    }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => endKeepActive(tabId));

function startKeepActive(tabId) {
    log('Attached to tab ' + tabId);
    timers[tabId] = setInterval(() => {
        chrome.tabs.executeScript(tabId, { code: RESET_ACTIVITY }, () => {
            log('Reset time since active on tab ' + tabId);
        });
    }, TIME_BETWEEN_RESETS);
}

function endKeepActive(tabId) {
    log('Detached from tab ' + tabId);
    if (tabId in timers) {
        clearInterval(timers[tabId]);
    }
}

function log(message) {
    let timestamp = new Date().toLocaleTimeString();
    console.log('[' + timestamp + '] YOUTUBE-UNINTERRUPTED: ' + message.toString());
}