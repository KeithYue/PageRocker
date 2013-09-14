//init the video head track

// init the dialog html strings
var trackDialog = $('<div id="track-dialog" title="Rock Your Page"></div>');
var videoContainer = $('<div id="video-container"></div>');
var inputCanvas = $('<canvas id="inputCanvas" width="320" height="240" style="display:none"></canvas>');
var inputVideo = $('<video id="inputVideo" autoplay loop width="320" height="240"></video>');
var overlay = $('<canvas id="overlay" width="320" height="240"></canvas>');
var debug = $('<canvas id="debug" width="320" height="240"></canvas>');
/*jshint multistr: true */
var controlPanelHtml = '\
<div id="control-panel">\
    <input type="checkbox" onclick="showProbabilityCanvas()" value="asdfasd"></input>Show probability-map</p>\
</div>\
';

// add the html elements to the tail of body
//
videoContainer.append(inputCanvas).append(inputVideo).append(overlay).append(debug);
trackDialog.append(videoContainer);
trackDialog.append($(controlPanelHtml));
$('body').append(trackDialog);

//set the dialog layout
//
var canvasOverlay = document.getElementById('overlay');
var debugOverlay = document.getElementById('debug');
var videoInput = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');
var topOffset = '4px';
console.log(inputVideo.offset());
videoInput.style.position = "absolute";
videoInput.style.top = topOffset;

canvasOverlay.style.position = "absolute";
canvasOverlay.style.top = topOffset;
canvasOverlay.style.zIndex = '100001';
canvasOverlay.style.display = 'block';

debugOverlay.style.position = "absolute";
debugOverlay.style.top = topOffset;
debugOverlay.style.zIndex = '100002';
debugOverlay.style.display = 'none';

// video and canvas tracking vars init
var overlayContext = canvasOverlay.getContext('2d');
var htracker = new headtrackr.Tracker({
    ui: false,
    calcAngles: true,
    debug: debugOverlay,
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

function headtrackrStatusHandler(event){
    console.log(event.status);
    }
function headtrackingEvent(event){
    }

//helper function
function showProbabilityCanvas() {
    var debugCanvas = document.getElementById('debug');
    if (debugCanvas.style.display == 'none') {
        debugCanvas.style.display = 'block';
    } else {
        debugCanvas.style.display = 'none';
    }
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
        htracker.init(videoInput, canvasInput);
        htracker.start();
        console.log(htracker);
        
        // dialog add head track listener
        document.addEventListener('headtrackrStatus', headtrackrStatusHandler);
        document.addEventListener('facetrackingEvent', facetrackingEventHandler);

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

//open the dialog in the right, top of the window
$('#track-dialog').parent().css({position:"fixed"}).end().dialog('open');

