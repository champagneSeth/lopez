var register    = require('../sonus/softCtrl.js').register
,   Gpio        = require('onoff').Gpio
;

var definition = {
    deviceName  : 'lopez',
    commands    : {
        'right'     : 'right',
        'left'      : 'left',
        'forward'   : 'forward',
        'backward'  : 'backward'
    }
}

var rf1 = new Gpio (20, 'out');
var rf2 = new Gpio (16, 'out');
var rfe = new Gpio (26, 'out');

var rb1 = new Gpio (24, 'out');
var rb2 = new Gpio (23, 'out');
var rbe = new Gpio (25, 'out');

var lf1 = new Gpio (10, 'out');
var lf2 = new Gpio (9, 'out');
var lfe = new Gpio (11, 'out');

var lb1 = new Gpio (19, 'out');
var lb2 = new Gpio (13, 'out');
var lbe = new Gpio (21, 'out');

rfe.write(1, check);
rbe.write(1, check);
lfe.write(1, check);
lbe.write(1, check);


module.exports = {
    execute : robotMove,
    device  : register(definition),
    shutdown : unexport   
}

function check(error) {
    if (error) {
        console.log(error)
    }
}

function robotMove(command, callBack) {
    console.log('[ robot ] Robot do something: ' + command);
   
    if (command == 'right'){
        girarDerecha();
    } else if (command == 'left'){
        girarIzquierda();
    } else if (command == 'forward'){
        irAdelante();
    } else if (command == 'backward'){
        irAtras();
    } else {
        callBack(false);
    }

    callBack(true);
}

function girarDerecha() {
    rf1.write(1, check);
    lf2.write(1, check);
    rb1.write(1, check);
    lb2.write(1, check);
    setTimeout(function () {
        rf1.write(0, check);
        lf2.write(0, check);
        rb1.write(0, check);
        lb2.write(0, check);
    }, 2000);
}

function girarIzquierda() {
    rf2.write(1, check);
    lf1.write(1, check);
    rb2.write(1, check);
    lb1.write(1, check);
    setTimeout(function () {
        rf2.write(0, check);
        lf1.write(0, check);
        rb2.write(0, check);
        lb1.write(0, check);
    }, 2000);
}

function irAdelante() {
    rf1.write(1, check);
    lf1.write(1, check);
    rb1.write(1, check);
    lb1.write(1, check);
    setTimeout(function () {
        rf1.write(0, check);
        lf1.write(0, check);
        rb1.write(0, check);
        lb1.write(0, check);
    }, 2000);
}

function irAtras() {
    rf2.write(1, check);
    lf2.write(1, check);
    rb2.write(1, check);
    lb2.write(1, check);
    setTimeout(function () {
        rf2.write(0, check);
        lf2.write(0, check);
        rb2.write(0, check);
        lb2.write(0, check);
    }, 2000);
}

function unexport() {
    rf1.unexport();
    rf2.unexport();
    rfe.unexport();

    rb1.unexport();
    rb2.unexport();
    rbe.unexport();

    lf1.unexport();
    lf2.unexport();
    lfe.unexport();

    lb1.unexport();
    lb2.unexport();
    lbe.unexport();
}

