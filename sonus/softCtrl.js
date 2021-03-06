var voconomo = require('./voconomo.js');

module.exports = {
    register    : register
,   recognize   : recognize
,   shutdown    : voconomo.shutdown
}

//parse the JSON object
function register(device) {
    var name        = device.deviceName
    ,   phrases     = Object.keys(device.commands)
    ,   project     = device.commands
    ,   commands    = []
    ;

    console.log('[ soft ] Registering device: ' + device.deviceName);

    phrases.forEach(function (phrase) {
        commands.push(project[phrase]);
    })

    return {
        name        : name
    ,   phrases     : phrases
    ,   commands    : commands 
    }
}

function registerDevices(devices) {
    var response = [];
    devices.forEach(function (device, i) {
        response[i] = register(device);
    });
    return response;
}

// Run VoCoNoMo to recognize and return command
function recognize(fileName, device, language, callBack) {
    var success = false;
    
    var checkResult = function (result) {
        device.phrases.forEach(function (phrase, i) {
            if (!success && result.search(phrase) != -1) {
                success = true;
                console.log('[ soft ] ' + phrase + ' : ' + device.commands[i]);
                callBack(device.commands[i]);
            }
        });

        if (!success) callBack();
    }

    console.log('[ soft ] ' + device.name);

    if (language == 'engl') {
        voconomo.english(fileName, checkResult);
    } else if (language == 'span') {
        voconomo.spanish(fileName, checkResult);
    } else {
        console.log('[ soft ] language not supported: ' + language);
    }
} 

