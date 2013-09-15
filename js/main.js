//init the video head track

// init the dialog html strings
var trackDialog = $('<div id="track-dialog" title="Rock Your Page"></div>');
var videoContainer = $('<div id="video-container" style="height: 250px"></div>');
var inputCanvas = $('<canvas class="ui-front" id="inputCanvas" width="320" height="240" style="display:block"></canvas>');
var inputVideo = $('<video class="ui-front"id="inputVideo" autoplay loop width="320" height="240"></video>');
var overlay = $('<canvas class="ui-front" id="overlay" width="320" height="240"></canvas>');
var debug = $('<canvas class="ui-front" id="debug" width="320" height="240"></canvas>');
var overlayContext,
    htracker;
    
/*jshint multistr: true */
// <p><input id='reinit-button' type='button'  value='reinitiate facedetection'></input>\
var controlPanel = $("\
<div id='control-panel'>\
    <p id='gUMMessage'></p>\
    <p>Status : <span id='headtrackerMessage'></span></p>\
    <a href='#' id='reinit-button'>Reinitiate Facedetection</a>\
    <br/><br/>\
    <input id='possibility-button' type='checkbox' />\
    <label for='possibility-button'>Show probability-map</label>\
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
    $('#possibility-button').button();
    

    }
// control panel layout

// video and canvas tracking vars init
overlayContext = overlay.get(0).getContext('2d');
htracker = new headtrackr.Tracker({
    ui: false,
    calcAngles: true,
    debug: debug.get(0), // using normal DOM element
    headPosition: false
    });

//event handler
function facetrackingEventHandler(event){
    // clear canvas
    overlayContext.clearRect(0,0,320,240);
    // once we have stable tracking, draw rectangle
    if (event.detection == "CS") {
        overlayContext.translate(event.x, event.y);
        overlayContext.rotate(event.angle-(Math.PI/2));
        overlayContext.strokeStyle = "#00CC00";
        overlayContext.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
        overlayContext.rotate((Math.PI/2)-event.angle);
        overlayContext.translate(-event.x, -event.y);
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

function headtrackingEvent(event){
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
        document.addEventListener('headtrackrStatus', headtrackrStatusHandler);
        document.addEventListener('facetrackingEvent', facetrackingEventHandler);

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
        // remove the dialog from the DOM
        $(this).remove();
        },
    height: 600,
    width: 350
    });


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
$('#track-dialog').parent().css({position:"fixed"}).end().dialog('open');
