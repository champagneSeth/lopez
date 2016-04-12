
var recording = false;

function postAudioToWesly(blob) {
    var reader = new FileReader();

    reader.onloadend = function () {
        var contents = reader.result;

        // post wav to server
        $.ajax({
            url         : 'api/audio'
        ,   method      : 'POST'
        ,   dataType    : 'json'
        ,   contentType : 'application/json'
        ,   data        : JSON.stringify({
                fileName    : 'lopez.wav'
            ,   file        : contents
            })
        }).done(function (res) {
            console.log(res.message);
        });
    }

    reader.readAsBinaryString(blob);
}

$('#record').on('click', function() {
    toggleRecording(this);
    recording = !recording;
    if (recording) {
        $(this).html('Stop');
    } else {
        $(this).html('Record');
    }
});
