var register = require('../sonus/softCtrl.js').register

module.exports = {
    execute : function (command, callBack) {
        console.log('[ robot ] Robot do something: ' + command);

        callBack(true);
    },
    
    device : register({
        deviceName  : 'lopez'
    ,   commands    : {
            'right'     : 'right'
        ,   'left'      : 'left'
        ,   'forward'   : 'forward'
        ,   'backward'  : 'backward'
        }
    })
}