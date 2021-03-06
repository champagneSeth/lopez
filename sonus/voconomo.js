var spawn       = require('child_process').spawn
,   sickascii   = require('./sickascii.js')
,   rawAudio    = __dirname + '/sonus.raw'
,   engl        = spawn(__dirname + '/sonus.o', ['engl', rawAudio])
,   span        = spawn(__dirname + '/sonus.o', ['span', rawAudio])
;

module.exports = {
    english     : setRecognizer('English', engl)
,   spanish     : setRecognizer('Español', span)
,   shutdown    : shutdown
}

engl.on('close', function (code) { 
    console.log('[ voconomo ] English recognizer sonus.o ended : ' + code);
}).stdout.setEncoding('utf8');
span.on('close', function (code) { 
    console.log('[ voconomo ] Español recognizer sonus.o ended : ' + code);
}).stdout.setEncoding('utf8');

function setRecognizer(language, recognizer) {
    return function (wavFile, callBack) {
        sickascii.sonus();
        console.log('[ voconomo ] ' + language);
        console.log('[ voconomo ] Recognizing file : ' + wavFile);
        downSample(wavFile, function () {
            recognize(recognizer, callBack);
        });
    }
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

    child.stdout.removeAllListeners().on('readable', function () {
        var data    = child.stdout.read().toLowerCase()
        ,   result  = /\|([\w\s]*)\|/g.exec(data)
        ;

        if (result && result.length) {
            console.log('[ voconomo ] Result : ' + result[0]);
            callBack(result[1]);
        } else {
            console.log('[ voconomo ] No Command recognized');
            callBack('');
        }
    });

    // Write '1' to recognize raw audio
    child.stdin.write('1\n');
}

function shutdown() {
    console.log('[ voconomo ] Shutdown');
    // Write '0' for exit
    engl.stdin.write('0\n');
    span.stdin.write('0\n');
}
