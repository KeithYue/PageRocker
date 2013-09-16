
// set up video and canvas elements needed

var videoInput = document.getElementById('vid');
var canvasInput = document.getElementById('compare');
var canvasOverlay = document.getElementById('overlay')
var debugOverlay = document.getElementById('debug');
var overlayContext = canvasOverlay.getContext('2d');

    canvasOverlay.style.position = "absolute";
    canvasOverlay.style.top = '0px';
    canvasOverlay.style.zIndex = '100001';
    canvasOverlay.style.display = 'block';
    
    debugOverlay.style.position = "absolute";
    debugOverlay.style.top = '0px';
    debugOverlay.style.zIndex = '100002';
    debugOverlay.style.display = 'none';

// add some custom messaging

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

document.addEventListener("headtrackrStatus", function(event) {
	if (event.status in supportMessages) {
		var messagep = document.getElementById('support-message');
		messagep.innerHTML = supportMessages[event.status];
	} else if (event.status in statusMessages) {
		var messagep = document.getElementById('headtracker-message');
		messagep.innerHTML = statusMessages[event.status];
	}
}, true);


// the face tracking setup

var htracker = new headtrackr.Tracker({altVideo : {ogv : "./media/capture5.ogv", mp4 : "./media/capture5.mp4"}, calcAngles : true, ui : false, headPosition : false, debug : debugOverlay});
    htracker.init(videoInput, canvasInput);
    htracker.start();


function faceTrackRectangle(ev) {

	overlayContext.clearRect(0,0,320,240);
	
	if (ev.detection == "CS") {
		overlayContext.translate(ev.x, ev.y)
		overlayContext.rotate(ev.angle-(Math.PI/2));
		overlayContext.strokeStyle = "#00CC00";
		overlayContext.strokeRect((-(ev.width/2)) >> 0, (-(ev.height/2)) >> 0, ev.width, ev.height);
		overlayContext.rotate((Math.PI/2)-event.angle);
		overlayContext.translate(-ev.x, -ev.y);
	}
	
}


function showProbabilityCanvas() {
	var debugCanvas = document.getElementById('debug');
	if (debugCanvas.style.display == 'none') {
		debugCanvas.style.display = 'block';
	} else {
		debugCanvas.style.display = 'none';
	}
}


function fontSize(ev) {
    
    var root    = document.getElementsByTagName('html')[0],
        rootSize,
        b       = document.getElementsByTagName('body')[0];
    
    var faceWidth   = ev.width,
        videoWidth  = videoInput.width,
        face2canvasRatio = videoWidth/faceWidth;

    rootSize = Math.round(face2canvasRatio*10)/10 - 1.5 + 10 + 'px';  
    root.style.fontSize = rootSize;
    
	document.getElementById('calc-messages').innerHTML = 'Width: ' + faceWidth + '<br /> ratio: ' + face2canvasRatio + '<br /> Root size: ' + rootSize;
	document.getElementById('font-size').innerHTML = document.defaultView.getComputedStyle(document.getElementById('first-paragraph'),null).getPropertyValue('font-size');
    
}


function breakPointClass(ev) {
    
    var b = document.getElementsByTagName('body')[0];
    
    var faceWidth   = ev.width,
        videoWidth  = videoInput.width,
        face2canvasRatio = videoWidth/faceWidth; 
    
	if (face2canvasRatio > 3.2) {
        b.className = 'far';
    }
                    
    if (face2canvasRatio < 2.2) {
        b.className = 'close';
    }
    
    if (face2canvasRatio >= 2.2 && face2canvasRatio <= 3.2) {
        b.className = '';
    } 
    
    document.getElementById('calc-messages').innerHTML = ev.width;
    
}






