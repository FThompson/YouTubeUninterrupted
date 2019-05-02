(() => {
    let currentURL = null;

    chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
        if (request.reload) {
            if (currentURL !== request.url) {
                log(request.url);
                observe();
                currentURL = request.url;
            }
        }
    });
    
    function observePause(mutationsList, observer) {
        for (let mutation of mutationsList) {
            // console.log(mutation);
            if (mutation.target.tagName === 'YT-FORMATTED-STRING' &&
                    mutation.target.parentNode.id === 'scrollable' &&
                    mutation.target.innerText === 'Video paused. Continue watching?') {
                log('Identified popup mutation...');
                unpauseVideo();
                return;
            }
        }
    };
    
    function unpauseVideo() {
        log('Unpausing video...');
        let button = document.querySelector('#confirm-button > a');
        button.click();
    }
    
    async function observe() {
        let popupContainer;
        while (!(popupContainer = getPopupNode())) {
            await new Promise(delay => setTimeout(delay, 200));
        }
        let observer = new MutationObserver(observePause);
        let config = { childList: true, subtree: true };
        observer.observe(popupContainer, config);
        log('Observing popup container for interruptions.');
    }
    
    function getPopupNode() {
        return document.querySelector('ytd-app > ytd-popup-container');
    }

    function log(message) {
        console.log('YOUTUBE-UNINTERRUPTED: ' + message.toString());
    }
})();