let timerId = null;
let currentURL = null;
const TIME_BETWEEN_RESETS = 10 * 60 * 1000; // ten minutes

chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
    if (request.message === 'reload') {
        if (currentURL !== request.url) {
            if (request.isWatch) {
                startTimer();
            } else {
                stopTimer();
            }
            currentURL = request.url;
        }
    }
});

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(resetActivityTime, TIME_BETWEEN_RESETS);
        log('Attached activity timer.');
    }
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        log('Detached activity timer.');
    }
}

function resetActivityTime() {
    window.location = 'javascript:window.yt.util.activity.setTimestamp(Date.now());';
}

function log(message) {
    let timestamp = new Date().toLocaleTimeString();
    console.log('[' + timestamp + '] ' + 'YOUTUBE-UNINTERRUPTED: ' + message.toString());
}