var rock_state = {
    sizer:{},
    rotater:{
        controller_id: '2',
        scence_id: '1'
        },
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
        file: "js/test.js"
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
    // set the songs state
    rock_state.rocker.song = $(this).index("#songs-selector li");
    // show the song in the input box
    // console.log($(this).text());
    $("#selected-songs").text($(this).text());
    });
$("#rotater-form input[name=controller-radio]").click(function(e){
    // change the controller id
    rock_state.rotater.controller_id = $(this)[0].value;
    });

// set controler listener

// the status code needed to be passed to content js
function get_state_code(){
    var code = "";
    code += "window.rock_state=";
    code += JSON.stringify(rock_state);
    code += ";";
    return code;
    }
