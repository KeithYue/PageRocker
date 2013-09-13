//init the video head track
console.log('I am the main js');

// init the dialog html strings
var trackDialog = $('<div id="track-dialog" title="Rock Your Page">Wang Yue</div>');
var inputCanvas = $('<canvas id="inputCanvas" width="320" height="240" style="display:none"></canvas>');
var inputVideo = $('<video id="inputVideo" autoplay loop></video>');

$('body').append(trackDialog);
trackDialog.append(inputCanvas);
trackDialog.append(inputVideo);

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
        }
    });

//open the dialog in the right, top of the window
$('#track-dialog').parent().css({position:"fixed"}).end().dialog('open');

//begin video tracking
var videoInput = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');
var htracker = new headtrackr.Tracker();
htracker.init(videoInput, canvasInput);
htracker.start();
