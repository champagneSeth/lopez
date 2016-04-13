var spawn       = require('child_process').spawn
,   sickascii   = require('./sickascii.js')
;

var rawAudio = __dirname + '/sonus.raw';
var engl = spawn(__dirname + '/sonus.o', ['engl', rawAudio]);
var span = spawn(__dirname + '/sonus.o', ['span', rawAudio]);

engl.on('close', function (code) { 
    console.log('[ voconomo ] English recognizer sonus.o ended : ' + code);
}).stdout.setEncoding('utf8');
span.on('close', function (code) { 
    console.log('[ voconomo ] Español recognizer sonus.o ended : ' + code);
}).stdout.setEncoding('utf8');

module.exports = {
    english     : english
,   spanish     : spanish
,   shutdown    : shutdown
}

function english(wavFile, callBack) {
    sickascii.sonus();
    console.log('[ voconomo ] English');
    console.log('[ voconomo ] Recognizing file : ' + wavFile);
    downSample(wavFile, function () {
        recognize(engl, callBack);
    });
}

function spanish(wavFile, callBack) {
    sickascii.sonus();
    console.log('[ voconomo ] Español');
    console.log('[ voconomo ] Recognizing file : ' + wavFile);
    downSample(wavFile, function () {
        recognize(span, callBack);
    });
}

function downSample(wavFile, callBack) {
    ps = spawn('sox', [
        wavFile
    ,   '-r', '16k'
    ,   '-t', 'raw'
    ,   rawAudio
    ]);

    ps.on('close', function (code) {
        console.log('[ voconomo ] Finished sox down sample with process ' + code);
        callBack()
    });
}

function recognize(child, callBack) {
    console.log('[ voconomo ] Signaling recognizer');

    child.stdout.removeAllListeners().on('data', function (data) {
        var result = /\|([\w\s]*)\|/g.exec(data);
        console.log('[ voconomo ] Received response')

        if (result && result.length) {
            console.log('[ voconomo ] Result : ' + result[0]);
            callBack(result[1]);
        } else callBack('');
    });

    // Write '1' to recognize raw audio
    child.stdin.write('1\n');
}

function shutdown() {
    console.log('[ voconomo ] Shutdown');
    // Write '0' for exit
    engl.stdin.write('0\n');
    // span.stdin.write('0\n');
}
