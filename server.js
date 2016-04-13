var fs          = require('fs')
,   http        = require('http')
,   express     = require('express')
,   bodyParser  = require('body-parser')
,   softCtrl    = require('./sonus/softCtrl.js')
,   robotCtrl   = require('./robot/robotCtrl.js')
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
    console.log('[ server ] Control web page requested');
    res.status(200).sendfile('public/index.html');
});

//NOTE: This is the endpoint for passing data for the WAV/audio files
router.post('/audio', function (req, res) {
    var fileName    = req.body.fileName
    ,   contents    = req.body.file
    ,   language    = req.body.language
    ;

    fileName = __dirname + '/sonus/wav/' + fileName;

    fs.writeFile(fileName, contents, 'binary', function (err) {
        if (err) {
            console.log('[ server ] ' + err);
            res.status(400).send('Audio not received')  
        } else {
            console.log('[ server ] Audio received');
            softCtrl.recognize(fileName, robotCtrl.device, language, function (command) {
                if (!command) {
                    res.status(201).json({
                        status  : true
                    ,   message : 'Command not recognized'
                    });
                } else {
                    robotCtrl.execute(command, function (status) {
                        res.status(201).json({
                            status  : status
                        ,   message : status ? 'Robot works' : 'Something broke'
                        }); 
                    });
                }
            });
        }
    });
});

router.post('/command', function (req, res) {
    // left, right, forward, or backward
    var command = req.body.command;
    console.log('[ server ] Command received: ' + command);
    
    robotCtrl.execute(command, function (status) {
        res.status(201).json({
            status  : status
        ,   message : status ? 'Robot works' : 'Something broke'
        }); 
    });
});

app.use('/', router);

// START THE SERVER
// =============================================================================
var server = http.createServer(app);

server.listen(port);
sickascii.wesely();

console.log('Magic happens on port ' + port);

