var rock_state = {
    sizer:{},
    rotater:{},
    rocker:{
        song: 0
        }
    };

console.log(JSON.stringify(rock_state));

$('#page-sizer').click(function(e){
    console.log('this is page sizer');
    // pass parameters
    chrome.tabs.executeScript(null, {
        code: get_state_code()
        });
    chrome.tabs.executeScript(null, {
        file: "js/main.js"
        });
    window.close();
    });
$('#page-rotater').click(function(e){
    console.log('this is page rotater');
    chrome.tabs.executeScript(null, {
        code: get_state_code()
        });
    chrome.tabs.executeScript(null, {
        file: "js/css3d.js"
        });
    window.close();
    });
$('#page-rocker').click(function(e){
    console.log('this is page rocker');
    chrome.tabs.executeScript(null, {
        code: get_state_code()
        });
    chrome.tabs.executeScript(null, {
        file: "js/harlem-shake-script.js"
        });
    window.close();
    });
$('#page-tester').click(function(e){
    console.log('this is page tester');
    chrome.tabs.executeScript(null, {
        code: get_state_code()
        });
    chrome.tabs.executeScript(null, {
        file: "js/test.js"
        });
    window.close();
});

// state event listener
$("#songs-selector li").click(function(e){
    console.log($(this).index("#songs-selector li"));
    rock_state.rocker.song = $(this).index("#songs-selector li");
    });

function get_state_code(){
    var code = "";
    code += "window.rock_state=";
    code += JSON.stringify(rock_state);
    code += ";";
    return code;
    }
