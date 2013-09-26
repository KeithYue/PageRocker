// alert('this is test page');
// generate white noise
var dev, osc, delay;
function audioCallback(buffer, channelCount){
    osc.append(buffer, channelCount);
    delay.append(buffer);
    }
dev = audioLib.AudioDevice(audioCallback /* callback for the buffer fills */, 2 /* channelCount */);
osc = audioLib.Oscillator(dev.sampleRate /* sampleRate */, 440 /* frequency */);
delay = audioLib.Delay.createBufferBased(2 /* channelCount */, dev.sampleRate, 400 /* delay time (in ms) */);

osc.waveShape = 'triangle';
