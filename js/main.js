//init the video head track
//
// background page test
// event handler
// console.log(chrome.extension.getBackgroundPage());
console.log(window.rock_state);

// the algorithm is face2radio * zoom value  = fixed_fz
var fixed_fz = 0;
// init the dialog html strings
var trackDialog = $('<div id="track-dialog" title="Rock Your Page"></div>');
var videoContainer = $('<div id="video-container" style="height: 250px"></div>');
var inputCanvas = $('<canvas class="ui-front" id="inputCanvas" width="320" height="240" style="display:block"></canvas>');
var inputVideo = $('<video class="ui-front"id="inputVideo" autoplay loop width="320" height="240"></video>');
var overlay = $('<canvas class="ui-front" id="overlay" width="320" height="240"></canvas>');
var debug = $('<canvas class="ui-front" id="debug" width="320" height="240"></canvas>');
var overlayContext,
    htracker,
    basicFontsize = parseInt($('html').css('font-size'),10), //the original webpage font-size 
    basicDialogFontSize,
    textString = 'p,a,h1,h2,h3,h4,h5,h6,code,span,img,pre'//tags that need to be zoom in or out
    ;
    
/*jshint multistr: true */
// <p><input id='reinit-button' type='button'  value='reinitiate facedetection'></input>\
var controlPanel = $("\
<div id='control-panel'>\
    <p id='gUMMessage'></p>\
    <p>Status : <span id='headtrackerMessage'></span></p>\
    <p><span id='calc-messages'></span></p>\
    <p><span id=''></span></p>\
    <a href='#' id='reinit-button'>Reinitiate Facedetection</a>\
    <br/><br/>\
    <input id='possibility-button' type='checkbox' />\
    <label for='possibility-button'>Show probability-map</label>\
    <br/><br/>\
    <input id='rotate-button' type='checkbox'>\
    <label for='rotate-button'>Rotate Page</label>\
    <p></p>\
</div>\
");

$('body').append(trackDialog);
// add the dialog to body
//$('body').append(trackDialog);
// add the html elements to the tail of body
//
function initDialogElement(){
    videoContainer.append(inputCanvas).append(inputVideo).append(overlay).append(debug);
    trackDialog.append(videoContainer);
    trackDialog.append(controlPanel);
    }
// console.log(controlPanel);

//set the dialog layout
function setDialogLayout(){
    // video tracking layout
    var canvasOverlay = document.getElementById('overlay');
    var debugOverlay = document.getElementById('debug');
    var videoInput = document.getElementById('inputVideo');
    var canvasInput = document.getElementById('inputCanvas');
    var topOffset = '4px';

    // video element layout 
    console.log(inputVideo.offset());
    videoInput.style.position = "absolute";
    videoInput.style.top = topOffset;

    canvasInput.style.position = "absolute";
    canvasInput.style.top = topOffset;
    // canvasInput.style.zIndex = '100000';
    canvasInput.style.display = 'block';



    canvasOverlay.style.position = "absolute";
    canvasOverlay.style.top = topOffset;
    // canvasOverlay.style.zIndex = '100001';
    canvasOverlay.style.display = 'block';

    debugOverlay.style.position = "absolute";
    debugOverlay.style.top = topOffset;
    // debugOverlay.style.zIndex = '100002';
    debugOverlay.style.display = 'none';

    //set style of widgets
    $('#reinit-button').button();
    // $('#possibility-button').button();

    // set the basic font size
    basicDialogFontSize = parseInt(trackDialog.css('font-size'),10);

    }
// control panel layout

// video and canvas tracking vars init
overlayContext = overlay.get(0).getContext('2d');
htracker = new headtrackr.Tracker({
    ui: false,
    calcAngles: true,
    debug: debug.get(0), // using normal DOM element
    headPosition: true
    });

//event handler
function facetrackingEventHandler(event){
    // clear canvas
    overlayContext.clearRect(0,0,320,240);
    // once we have stable tracking, draw rectangle
    if (event.detection == "CS") {
        // console.log('I am going to adjust the font size');
        overlayContext.translate(event.x, event.y);
        overlayContext.rotate(event.angle-(Math.PI/2));
        overlayContext.strokeStyle = "#00CCFF";
        overlayContext.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
        overlayContext.rotate((Math.PI/2)-event.angle);
        overlayContext.translate(-event.x, -event.y);

        // adjust the font size
        fontSize(event);

        }
    }

statusMessages = {
    "whitebalance" : "checking for stability of camera whitebalance",
    "detecting" : "Detecting face",
    "hints" : "Hmm. Detecting the face is taking a long time",
    "redetecting" : "Lost track of face, redetecting",
    "lost" : "Lost track of face",
    "found" : "Tracking face"
};

supportMessages = {
    "no getUserMedia" : "Unfortunately, <a href='http://dev.w3.org/2011/webrtc/editor/getusermedia.html'>getUserMedia</a> is not supported in your browser. Try <a href='http://www.opera.com/browser/'>downloading Opera 12</a> or <a href='http://caniuse.com/stream'>another browser that supports getUserMedia</a>. Now using fallback video for facedetection.",
    "no camera" : "No camera found. Using fallback video for facedetection."
};

function headtrackrStatusHandler(event){
    // console.log(event.status);
    var messagep;
    if (event.status in supportMessages) {
        messagep = document.getElementById('gUMMessage');
        messagep.innerHTML = supportMessages[event.status];
    } else if (event.status in statusMessages) {
        messagep = document.getElementById('headtrackerMessage');
        messagep.innerHTML = statusMessages[event.status];
    }
    }

function headtrackingEventHandler(event){
    console.log('I am head tracking handler');
    console.log('x: '+event.x+' y: '+event.y+' z: '+event.z);
    }

//helper function

function showProbabilityCanvas() {
    console.log('showing possibility');
    var debugCanvas = document.getElementById('debug');
    if (debugCanvas.style.display == 'none') {
        debugCanvas.style.display = 'block';
    } else {
        debugCanvas.style.display = 'none';
    }
}

//open the dialog in the right, top of the window
//
//add control panel event listener
function addControllPanelListener(){
    $('#possibility-button').click(function(){
        showProbabilityCanvas();
        });
    $('#reinit-button').click(function(){
        htracker.stop();
        htracker.start();
        });

    }

$('#track-dialog').dialog({
    autoOpen: false,
    resizable: false,
    position:{
        my: "right top",
        at: "right top",
        of: $(window)
        },
    show: {
        effect: "blind",
        duration: 1000
        },
    hide: {
        effect: "explode",
        duration: 1000
        },
    open: function(event, ui){
        // console.log($(this));
        // begin video tracking
        initDialogElement();
        setDialogLayout();

        htracker.init(inputVideo.get(0), inputCanvas.get(0));
        htracker.start();


        // console.log(htracker);
        
        // dialog add head track listener
        document.addEventListener('headtrackrStatus', headtrackrStatusHandler, true);
        document.addEventListener('facetrackingEvent', facetrackingEventHandler);
        document.addEventListener('headtrackingEvent',headtrackingEventHandler);

        // add controller panel listener
        addControllPanelListener();
        

        },
    beforeClose: function(event, ui){
        console.log('being closed');
        // remove the tracking dialog
        //
        document.removeEventListener('headtrackerStatus');
        document.removeEventListener('facetrackingEvent');

        htracker.stop();
        },
    close: function(event, ui){
        console.log('closed');
        // set the webpage layout to default style
        $(textString).css({
            zoom: 1
            });
        // remove the dialog from the DOM
        $(this).remove();
        },
    height: 600,
    width: 350
    });

//face to size helper functions
function fontSize(ev) {
    // console.log('Font Adjusting');
    // console.log(ev);
    var root    = document.getElementsByTagName('html')[0],
        rootSize,
        b       = document.getElementsByTagName('body')[0];
    
    var faceWidth   = ev.width,
        videoWidth  = inputVideo.width(),
        face2canvasRatio = faceWidth/videoWidth;

    if (fixed_fz === 0){
        //init the fixed value 
        fixed_fz = face2canvasRatio;
        }
     // console.log($('body').not('#track-dialog'));
     // set font size locally
     // console.log($('p a h1 h2 h3 h4 h5 h6'));
     $(textString).css({
        zoom: fixed_fz /( face2canvasRatio )
        });
    
}

// toggle the dialog
// set the dialog layout to fix on the right top of the window
// $('#track-dialog').dialog('open');
// if(trackDialog.dialog('isOpen')){
//     trackDialog.dialog('close');
//     }
// else{
//     $('body').append(trackDialog);
//     $('#track-dialog').parent().css({position:"fixed"}).end().dialog('open');
//     }
// init the dialog
// set fixed font-size for the dialog
$('#track-dialog').parent().css({position:"fixed", 'font-size':"16px"}).end().dialog('open');
