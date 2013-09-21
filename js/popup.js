$('#page-sizer').click(function(e){
    console.log('this is page sizer');
    chrome.tabs.executeScript(null, {
        file: "js/main.js"
        });
    window.close();
    });
$('#page-rotater').click(function(e){
    console.log('this is page rotater');
    chrome.tabs.executeScript(null, {
        file: "js/css3d.js"
        });
    window.close();
    });
$('#page-rocker').click(function(e){
    console.log('this is page rocker');
    chrome.tabs.executeScript(null, {
        file: "js/harlem-shake-script.js"
        });
    window.close();
    });
