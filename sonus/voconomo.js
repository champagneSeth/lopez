var spawn       = require('child_process').spawn
,   sickascii   = require('./sickascii.js')
;

var rawAudio = __dirname + '/sonus.raw';

module.exports = {
    english : english
,   spanish : spanish
}

function english(wavFile, callBack) {
    sickascii.sonus();
    console.log('[ voconomo ] English');
    console.log('[ voconomo ] Recognizing file : ' + wavFile);
    downSample(wavFile, function () {
        recognize(callBack);
    });
}

function spanish(wavFile, callBack) {
    console.log('[ voconomo ] Spanish');
    callBack();
}

function downSample(wavFile, callBack) {
    ps = spawn('sox', [
        wavFile
    ,   '-r', '16k'
    ,   '-t', 'raw'
    ,   rawAudio
    ]);

    ps.on('close', function (code) {
        console.log('\n[ voconomo ] Finished sox down sample with process ' + code + '\n\n');
        callBack()
    });
}

function recognize(callBack) {
    var child = spawn(__dirname + '/sonus.o', [rawAudio]);

    child.stdout.on('data', function (data) {
        var result = /\|([\w\s]+)\|/g.exec(data.toString());

        if (result && result.length) {
            console.log('[ voconomo ] Result : ' + result[0]);
            callBack(result[1]);
        } else callBack('');
    });

    child.on('close', function (code) { 
        console.log('\n[ voconomo ] Finished sonus.o with process ' + code);
    });
}
