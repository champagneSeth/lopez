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

router.get('/lopez', function (req, res) {
    console.log('GET Success! status code 200');
    res.status(200).sendfile('lopez.html');
});

//NOTE: This is the endpoint for passing data for the WAV/audio files
router.post('/api/audio', function (req, res) {
    var apiKey      = req.body.apiKey       || req.headers.apikey
    ,   fileName    = req.body.fileName     || req.headers.filename
    ,   contents    = req.body.file         || req.body
    ;

    Command.findOne({apiKey: apiKey}, function (err, apiUser) {
        if (err) {
            throw err;
        } else if (!apiUser) {
            res.status(309).json({
                success : false
            ,   message : 'User does not have any commands registered'
            });               
        } else {
            var userCommands = apiUser.commands;

            fileName = __dirname + '/sonus/wav/' + fileName;
            devices = softCtrl.register(JSON.parse(userCommands));

            fs.writeFile(fileName, contents, 'binary', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Audio received');
                    softCtrl.getCommand(fileName, devices[0], function (command) {
                        res.status(201).json({
                            success : true
                        ,   message : command ? 'Audio recieved' : 'No command recognized'
                        ,   command : command
                        }); 
                    });
                }
            });
        }
    });
});

router.post('/api/command', function (req, res) {
    User.findOne({apiKey : req.body.apiKey}, function (err, user) {
        if (err) {
            throw err;        
        } else if (!user) {
            res.status(309).json({
                success : false
            ,   message : 'Your api key did not match any records in our database'
            ,   apiKey  : req.body.apiKey
            });   
        } else {
            Command.findOne({apiKey : req.body.apiKey}, function (err, apiUser) {
                if(err) {
                    res.status(309).json({
                        success : false
                    ,   message : 'Error connecting to db'
                    });
                    throw err;            
                } else if  (!apiUser) {
                    delete apiUser;
                    var apiUser = new Command({
                        apiKey: req.body.apiKey
                    ,   commands: req.body.object
                    });
                    apiUser.save(function(err) {
                        if (err) throw err;
                        console.log('Command created!');
                    });
                    res.status(201).json({success: true, message: 'New commands were added for user'});
                } else {
                    Command.update({apiKey: req.body.apiKey}, {commands: req.body.object}, function (err, affected) {
                        if (err) {
                            res.status(401).json({
                                success : false
                            ,   message : 'Was not able to update commands'
                            });
                            throw err;
                        } else {
                            res.status(201).json({
                                success         : true
                            ,   message         : 'Commands were updated!'
                            ,   rowsAffected    : affected
                            });            
                        }
                    });
                }
            });  
        }
    });   
});

router.get('/api/command', function (req, res) {
    var apiKey = req.get('apiKey');
    Command.findOne({apiKey: apiKey}, function (err, apiUser) {
        if (err) {
            throw err;
        } else if (!apiUser) {
            res.status(309).json({
                success : false
            ,   message : 'User does not have any commands registered'
            });               
        } else {
            res.status(200).json({
                success     : true
            ,   message     : 'Commands have been returned'
            ,   Commands    : apiUser.commands
            });
        }
    });
});

app.use('/', router);

// START THE SERVER
// =============================================================================
var server = http.createServer(app);

server.listen(port);
sickascii.wesely();

console.log('Magic happens on port ' + port);

