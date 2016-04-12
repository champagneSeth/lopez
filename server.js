var fs          = require('fs')
,   http        = require('http')
,   express     = require('express')
,   bodyParser  = require('body-parser')
,   softCtrl    = require('./sonus/softCtrl.js')
,   sickascii   = require('./sonus/sickascii.js')
;

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({
    limit       : '50mb'
,   urlencoded  : true
}));

app.use(bodyParser.raw({
    type    : 'audio/wav'
,   limit   : '50mb'
}));

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 9000;


// REGISTER OUR ROUTES
// =============================================================================
var router = express.Router();

router.get('/', function (req, res) {
    console.log('GET Success! status code 200');
    res.status(200).sendfile('public/index.html');
});

//NOTE: This is the endpoint for passing data for the WAV/audio files
router.post('/api/audio', function (req, res) {
    var fileName    = req.body.fileName     || req.headers.filename
    ,   contents    = req.body.file         || req.body
    ;

    // fileName = __dirname + '/sonus/wav/' + fileName;
    // devices = softCtrl.register(JSON.parse(userCommands));

    // fs.writeFile(fileName, contents, 'binary', function(err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('Audio received');
    //         softCtrl.getCommand(fileName, devices[0], function (command) {
    //             res.status(201).json({
    //                 success : true
    //             ,   message : command ? 'Audio recieved' : 'No command recognized'
    //             ,   command : command
    //             }); 
    //         });
    //     }
    // });
});

app.use('/', router);

// START THE SERVER
// =============================================================================
var server = http.createServer(app);

server.listen(port);
sickascii.wesely();

console.log('Magic happens on port ' + port);

