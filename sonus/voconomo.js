var spawn       = require('child_process').spawn
,   sickascii   = require('./sickascii.js')
;

module.exports = function (wavFile, callBack) {
    var downSampled = __dirname + '/sonus.raw';

    ps = spawn('sox', [
        wavFile
    ,   '-r', '16k'
    ,   '-t', 'raw'
    ,   downSampled
    ]);

    ps.on('close', function (code) {
        console.log('\nFinished sox down sample with process ' + code + '\n\n');
        sickascii.sonus();
        recognize();
    });

    function recognize() {
        var child = spawn(__dirname + '/sonus.o', [downSampled]);

        console.log('Recognizing file : ' + wavFile);
        child.stdout.on('data', function (data) {
            var result = /\|([\w\s]+)\|/g.exec(data.toString());

            if (result && result.length) {
                console.log('Result : ' + result[0]);
                callBack(result[1]);
            } else callBack('');
        });

        child.on('close', function (code) { 
            console.log('\nFinished sonus.o with process ' + code);
        });
    }
}
