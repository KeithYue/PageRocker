// play audio
// var player = AV.Player.fromURL(chrome.extension.getURL('songs/moves_like_jagger.mp3'));
// console.log(chrome.extension.getURL('songs/moves_like_jagger.mp3'));
// console.log('I am test page');
console.log('I am test page!!!');

var file_path = chrome.extension.getURL('songs/moves_like_jagger.mp3');
var context = new webkitAudioContext();
console.log(context);
var audioBuffer;
var sourceNode;
var textString = 'p,a,h1,h2,h3,h4,h5,h6,code,span,img,pre,li'; //tags that need to be zoom in or out

text_nodes = $(textString);
step = text_nodes / 256; // rock your page partially

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
    javascriptNode.onaudioprocess = function(){
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
function rock_page(array){
    // rock your page fully
    // for(var i = 0;i< text_nodes.length;i++){
    //     $(text_nodes[i]).css({
    //         zoom: array[i % 256]/150 + 0.5
    //         });
    //     }
    for(var i= 0; i< 256;i++){
        if(text_nodes[i]){
            $(text_nodes[i]).css({
                zoom: 1.2*array[i]/150 + 0.1
                });
            }
        }
    }
