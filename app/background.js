chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && tab.status === 'complete' && changeInfo.status === 'complete') {
        let url = new URL(tab.url);
        if (url.hostname.endsWith('youtube.com') && url.pathname.startsWith('/watch')) {
            chrome.tabs.sendMessage(tabId, { reload: true, url });
        }
    }
});