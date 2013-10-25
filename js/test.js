// play audio
// var player = AV.Player.fromURL(chrome.extension.getURL('songs/moves_like_jagger.mp3'));
// console.log(chrome.extension.getURL('songs/moves_like_jagger.mp3'));
// console.log('I am test page');

var songs = new Array();
songs[0] = 'songs/creazy_kids.m4a';
songs[1] = 'songs/moves_like_jagger.mp3';

console.log(window.rock_state);
var states = window.rock_state.rocker;

var file_path = chrome.extension.getURL(songs[states.song]);
var context = new webkitAudioContext(); //represents a set of AudioNode objects and their connections.
console.log(context);
var audioBuffer; // the music buffer begin loaded
var sourceNode; // source node of input buffer
// var textString = 'p,a,h1,h2,h3,h4,h5,h6,code,span,img,pre,li'; //tags that need to be zoom in or out
// the effect need to be added:
// zoom in, zoom out --> image
// show, hide --> text
// ratate --> -45--+45 deg
images = 'img';
text = 'p';
links = 'a';

// box_nodes = $(boxNodes);

images = $(images);
text = $(text);
links = $(links);
console.log(links);
// step = text_nodes / 256; // rock your page partially

setupAudioNodes();
loadSound(file_path);

function setupAudioNodes(){
    // setup javascript node
    javascriptNode = context.createJavaScriptNode(2048 ,1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // set up a analyer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize  = 512;

    analyser2 = context.createAnalyser();
    analyser2.smoothingTimeConstant = 0.3;
    analyser2.fftSize  = 1024;

    // real time handler
    javascriptNode.onaudioprocess = function(e){
        // console.log(e);
        // console.log('Javascript node is being called');
        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        // var average = getAverageVolume(array);
        rock_page(array);
        };


    sourceNode = context.createBufferSource();
    splitter = context.createChannelSplitter();

    sourceNode.connect(splitter);

    splitter.connect(analyser,0,0);
    splitter.connect(analyser2,1,0);

    // connect the source to the analyser
    sourceNode.connect(analyser);

    analyser.connect(javascriptNode);

    sourceNode.connect(context.destination);
    }

function loadSound(url){
    console.log('I am loading sound: '+ url);
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function(e){
        console.log('I am onload');
        context.decodeAudioData(request.response, function(buffer){
            playSound(buffer);
            }, onError);
        };

        request.send();
    }
function playSound(buffer){
    sourceNode.buffer = buffer;
    sourceNode.noteOn(0);
    // sourceNode.start();
    console.log(sourceNode);
    sourceNode.onended = onMusicEnd;
    }

function onMusicEnd(e){
    console.log('The music is finished');

    // restore the html page
    }
function onError(e){
    console.log(e);
    }
function getAverageVolume(array){
    var values = 0;
    var average;
    var length = array.length;

    for(var i = 0;i< length;i++){
        values += array[i];
        }
    average = values/length;
    return average;

    }

opacity = 1.0;
function rock_page(array){
    for(var i = 0; i < 256; i++){
        // console.log(array[i]);
        amp = array[i] / 255;
        if(images[i]){
            $(images[i]).transition({
                scale: 0.5 + amp,
                duration: 0
                });
            }
        if(text[i]){
            $(text[i]).transition({
                x: -10 + amp * 20,
                duration: 0
                });
            }
        if(links[i]){
            $(links[i]).transition({
                rotate: (-30 + amp * 60) + 'deg',
                duration: 0
                });
            }
        }
    }
