// play audio
// var player = AV.Player.fromURL(chrome.extension.getURL('songs/moves_like_jagger.mp3'));
// console.log(chrome.extension.getURL('songs/moves_like_jagger.mp3'));
// console.log('I am test page');

/*jshint multistr: true */
var songs = [];
songs[0] = 'songs/creazy_kids.m4a';
songs[1] = 'songs/moves_like_jagger.mp3';
songs[2] = 'songs/What_Makes_You_Beautiful.mp3';

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
images = 'img'; // image is used to zoom in and zoom out
text = 'p'; // p is to change position(x or y direction)
links = 'a'; // a is used to rotate the element
titles = 'h1,h2,h3,h4,h5,h6';// title is used to skew
allRockNodes = [];

// box_nodes = $(boxNodes);

images = $(images).each(function(){
    this.rock = function(amp){
       $(this).transition({
            scale: 0.5 + amp,
            duration: 0
            });
        };
    allRockNodes.push(this);
    });
text = $(text).each(function(){
    this.rock = function(amp){
        $(this).transition({
            x: -10 + amp * 20,
            duration: 0
            });
        };
    allRockNodes.push(this);
    });
links = $(links).each(function(){
    this.rock = function(amp){
        $(this).transition({
            rotate: (-30 + amp * 60) + 'deg',
            duration: 0
            });
        };
    allRockNodes.push(this);
    });
titles = $(titles).each(function(){
    this.rock = function(amp){
        $(this).transition({
            duration: 0,
            skewX: (-30 + amp * 60) + 'deg'
            });
        };
    allRockNodes.push(this);
    });



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
// console.log(allRockNodes);
function rock_page(array){
    for(var i = 0; i < 256; i++){
        // console.log(array[i]);
        amp = array[i] / 255;
        if(allRockNodes[i]){
            allRockNodes[i].rock(amp);
            }
        }
    }
    
function selectSongs(){
    var modal_html =  '\
    <div id="songs-dialog" title="Select one song which would rock your page">\
        <h4>You can either select one of defaults songs or local music</h4>\
        <form action="">\
            <fieldset>\
                <legend>Select a song locally or online</legend>\
                <label style="display:block;" for="songsInput">Local Music file</label>\
                <br />\
                <input type="file" id="songsInput" style="display:block;" />\
            <p>Or you can select one song below</p>\
                <select id="defaultSongs" name="dsongs">\
                    <option value="0">Crazy Kids</option>\
                    <option value="1">Moves Like a Jagger</option>\
                    <option value="2">What Makes You Beautiful</option>\
                </select>\
            </fieldset>\
            <fieldset id="ampSliders">\
                <legend>Input how dynamiclly you want</legend>\
                <p>\
                    <label for="rockAmplication">The amp of rocking:</label>\
                    <input value="30" type="text" id="rockAmplication"/>\
                </p>\
                <div id="ampSlider"></div>\
                <div style="display:inline-block; width:60px; margin:1em;">\
                    <p>\
                        <label for="imageAmp">Image</label>\
                        <input value="30" type="text" id="imageAmp" style="border: 0; color: #f6931f; font-weight: bold; width:50px"/>\
                    </p>\
                    <div class="detailedAmp" style="height:200px;"></div>\
                </div>\
                <div style="display:inline-block; width:60px; margin:1em;">\
                    <p>\
                        <label for="textAmp">Text</label>\
                        <input value="30" type="text" id="textAmp" style="border: 0; color: #f6931f; font-weight: bold; width:50px"/>\
                    </p>\
                    <div class="detailedAmp" style="height:200px;"></div>\
                </div>\
                <div style="display:inline-block; width:60px; margin:1em;">\
                    <p>\
                        <label for="linksAmp">Links</label>\
                        <input value="30" type="text" id="linksAmp" style="border: 0; color: #f6931f; font-weight: bold; width:50px"/>\
                    </p>\
                    <div class="detailedAmp" style="height:200px;"></div>\
                </div>\
                <div style="display:inline-block; width:60px; margin:1em;">\
                    <p>\
                        <label for="titleAmp">Titles</label>\
                        <input value="30" type="text" id="titleAmp" style="border: 0; color: #f6931f; font-weight: bold; width:50px"/>\
                    </p>\
                    <div class="detailedAmp" style="height:200px;"></div>\
                </div>\
            </fieldset>\
        </form>\
    </div>\
    ';
    $('body').append($(modal_html));

    // slide the amp selector
    $('#ampSlider').slider({
        min: 0,
        max: 100,
        value: $('rockAmplication').val(),
        step:1,
        slide: function(event, ui){
            console.log(ui.value);
            // set input text value
            $('#rockAmplication').val(ui.value);
            }
        });
    //
    // all the detailed selector
    $('#ampSliders .detailedAmp').each(function(){
        console.log('setting up sliders');
        $(this).empty().slider({
            value: $(this).parent().find('input[type=text]').first().val(),
            min:0,
            max:100,
            range: "min",
            animate: true,
            orientation: "vertical",
            slide: function(event, ui){
                // console.log(ui.value);
                // console.log($($(this).parent().first()[0]).find('input[type=text]')[0]);
                $(this).parent().find('input[type=text]').first().val(ui.value);
                }
            });
        });

    // add file input listen
    if (window.webkitURL) window.URL = window.webkitURL;
    var fileInput = $('#songsInput')[0];
    $(fileInput).change(function(){
        var files = fileInput.files;
        var song = files[files.length - 1];
        console.log(song);

        // create object url
        var objectURL = window.URL.createObjectURL(song);
        console.log(objectURL);
        file_path = objectURL;
        });
    // configuration
    //
    // add defaults songs selection listener
    $('#defaultSongs').change(function(event){
        console.log($(this).val());
        file_path = chrome.extension.getURL(songs[parseInt($(this).val())]);
        });

    $('#songs-dialog').dialog({
        modal: true,
        width: 500,
        close: function(event, ui){
            // start playing the music
            },
        buttons:[
        {
            text:'Rock Your Page',
            click:function(){
                setupAudioNodes();
                loadSound(file_path);
                $(this).dialog('close');
                }
            },
            {
                text:'Cancel',
                click:function(){
                $(this).dialog('close');
                    }
                }]
        });
    // open in the webpage
    $('songs-dialog').dialog("open");
    }

selectSongs();
