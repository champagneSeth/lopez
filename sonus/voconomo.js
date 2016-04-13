var spawn       = require('child_process').spawn
,   sickascii   = require('./sickascii.js')
;

module.exports = {
    english : english
,   spanish : spanish
}

function english(wavFile, callBack) {
    console.log('[ voconomo ] English');
    downSample(wavFile, callBack);
}

function spanish(wavFile, callBack) {
    console.log('[ voconomo ] Spanish');
    // body...
}

function downSample(wavFile, callBack) {
    var downSampled = __dirname + '/sonus.raw';

    ps = spawn('sox', [
        wavFile
    ,   '-r', '16k'
    ,   '-t', 'raw'
    ,   downSampled
    ]);

    ps.on('close', function (code) {
        console.log('\n[ voconomo ] Finished sox down sample with process ' + code + '\n\n');
        sickascii.sonus();
        recognize();
    });
}

function recognize() {
    var child = spawn(__dirname + '/sonus.o', [downSampled]);

    console.log('[ voconomo ] Recognizing file : ' + wavFile);
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
