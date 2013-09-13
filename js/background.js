//turn the page to red
chrome.browserAction.onClicked.addListener(function(tab){
    // alert(chrome.extension.getURL('css/'));
    chrome.tabs.executeScript(null, {
        file: "js/main.js"
        });
    });
