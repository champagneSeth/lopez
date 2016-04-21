var register    = require('../sonus/softCtrl.js').register
,   Gpio        = require('onoff')
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

module.exports = {
    execute : robotMove,
    device  : register(definition)    
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
    console.log('woo')
}


