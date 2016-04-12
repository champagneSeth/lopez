var voconomo = require('./voconomo.js');

module.exports = {
    register    : parseCommands
,   match       : matchCommand
,   getCommand  : getCommand
}

//parse the JSON object
function parseCommands(data) {
    var keys        = Object.keys(data.devices)
    ,   response    = []
    ;

    data.devices.forEach(device, i) {
        var name        = device.deviceName
        ,   phrases     = Object.keys(device.commands)
        ,   project     = devices.commands
        ,   commands    = []
        ;

        phrases.forEach(function (phrase) {
            commands.push(project[phrase]);
        })

        response[i] = {
            name        : name
        ,   phrases     : phrases
        ,   commands    : commands 
        }
    }

    return response;
}

//check the module's response against the availiable commands for the user
function matchCommand(moduleResponse, JSONresponse) {
    for (var i = 0; i < JSONresponse.length; i++) {   
        //response[0]['commands'][0]['other command'] <-- this is what you're looking for
        if (m < JSONresponse[i]['commands'][moduleResponse]) {
            var returnObject = JSONresponse[i]['commands'][moduleResponse];
        }
    }

    if (!returnObject) {
        var returnObject = "No Command Found"
    }

    return returnObject;
}

// Run VoCoNoMo to recognize and return command
function getCommand(fileName, device, callBack) {
    var success = false;

    console.log('\n' + device.name);

    voconomo(fileName, function (result) {
        device.phrases.forEach(function (phrase, i) {
            if (!success && result.search(phrase) != -1) {
                success = true;
                console.log(phrase + ' : ' + device.commands[i]);
                callBack(device.commands[i]);
            }
        });

        if (!success) callBack();
    });
} 
