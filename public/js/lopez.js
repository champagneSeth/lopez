
var recording   = false;
var reader      = new FileReader();

// Set event handler to ajax call that posts audio
reader.onloadend = function () {
    var contents = reader.result;

    // Post wav to server
    $.ajax({
        url         : '/audio'
    ,   method      : 'POST'
    ,   dataType    : 'json'
    ,   contentType : 'application/json'
    ,   data        : JSON.stringify({
            fileName    : 'lopez.wav'
        ,   language    : getLanguage()
        ,   file        : contents
        })

    }).done(function (res) {
        console.log(res.message);
        if (command) {
            $('#result').text(res.command);
        } else {
            $('#result').text('no command');
        }
    });
}

function postAudioToWesly(blob) {
    // Called in audio.js
    // Read audio as binary
    reader.readAsBinaryString(blob);
}

function postCommand(command) {
    // callBack of click event for robot control buttons
    return function () {
        $.ajax({
            url         : '/command'
        ,   method      : 'POST'
        ,   dataType    : 'json'
        ,   contentType : 'application/json'
        ,   data        : JSON.stringify({
                command    : command
            })

        }).done(function (res) {
            console.log(res.message);
            $('#result').text(res.command);
        });
    }
}

function getLanguage() {
    return $('#engl').is(':checked') ? 'engl' : 'span';
}

$('#record').on('click', function () {
    toggleRecording(this);
    recording = !recording;
    if (recording) {
        $(this).html('Stop');
    } else {
        $(this).html('Record');
    }
});

$('#forward').on('click', postCommand('forward'))
$('#backward').on('click', postCommand('backward'))
$('#right').on('click', postCommand('right'))
$('#left').on('click', postCommand('left'))
