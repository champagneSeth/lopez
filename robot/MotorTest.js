var Gpio = require('onoff').Gpio
,   rf1  = new Gpio(23, 'out')
,   rf2  = new Gpio(24, 'out')
,   rfe  = new Gpio(25, 'out')
;

console.log('start');

function check(err) {
    if (err) console.log(err);
    else console.log('woo');
}

rfe.write(1, check);
rf1.write(0, check);
rf2.write(1, check);

setTimeout(function () {
    rfe.unexport();
    rf1.unexport();
    rf2.unexport();

    console.log('we made it');
}, 3000);

