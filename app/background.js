chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    let url = new URL(tab.url);
    if (url.hostname.endsWith('youtube.com')) {
        if (tab.status === 'complete' && changeInfo.status === 'complete') {
            let isWatch = url.pathname.startsWith('/watch');
            chrome.tabs.sendMessage(tabId, { message: 'reload', url, isWatch });
        }
    }
});