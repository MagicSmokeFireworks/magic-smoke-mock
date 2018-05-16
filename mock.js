
var express = require('express');
var app = express();

var net = require('net');

var httpx = require('http').Server(app);
var io = require('socket.io')(httpx);
var http = require('http');

var bodyParser = require('body-parser');

var fs = require('fs');
var contents = fs.readFileSync('boardinfo.json');
var boardinfo = JSON.parse(contents);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

app.set('view engine', 'pug');

app.use(express.static('static'));

var boardKey = process.argv[2];
var boardID = 0
for (key in boardinfo) {
	if (key === boardKey) {
		boardID = boardinfo[key].id;
	}
}
var port = process.argv[3];

var sw_arm = '0';
var command_count = 0;
var fc0 = 0;
var fc1 = 0;
var fc2 = 0;
var fc3 = 0;
var fc4 = 0;
var fc5 = 0;
var fc6 = 0;
var fc7 = 0;

var fire_channel = function(channel) {
	console.log('firing channel ' + channel);
	if (channel == '0') {
		fc0 = fc0 + 1;
	}
	else if (channel == '1') {
		fc1 = fc1 + 1;
	}
	else if (channel == '2') {
		fc2 = fc2 + 1;
	}
	else if (channel == '3') {
		fc3 = fc3 + 1;
	}
	else if (channel == '4') {
		fc4 = fc4 + 1;
	}
	else if (channel == '5') {
		fc5 = fc5 + 1;
	}
	else if (channel == '6') {
		fc6 = fc6 + 1;
	}
	else if (channel == '7') {
		fc7 = fc7 + 1;
	}
};

app.post('/identify', function(req, res) {
	console.log('identify');
	command_count = command_count + 1;
	res.end();
});

app.post('/arm', function(req, res) {
	console.log('arm');
	sw_arm = '1';
	command_count = command_count + 1;
	res.end();
});

app.post('/disarm', function(req, res) {
	console.log('disarm');
	sw_arm = '0';
	command_count = command_count + 1;
	res.end();
});

app.post('/fire*', function(req, res) {
	console.log(req.originalUrl);
	var chans = req.originalUrl.replace(/^\/fire/,'');
	for (var i = 0; i < chans.length; i++) {
		fire_channel(chans.charAt(i));
	}
	command_count = command_count + 1;
	res.end();
});

app.get('/', function(req, res) {
	console.log('home');
	res.render('home', {});
})


var sendTelem = setInterval(function() {

	// object of options for the post
	var post_options = {
		host: 'localhost',
		port: '8080',
		path: '/status',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': 0,
			'ID': boardID,
			'port': port,
			'fver': 'MOCK',
			'sw_arm': sw_arm,
			'hw_arm': 'ARMED',
			'wifi_rssi': '0',
			'r0': '0',
			'r1': '0',
			'r2': '0',
			'r3': '0',
			'r4': '0',
			'r5': '0',
			'r6': '0',
			'r7': '0',
			'fc0': fc0,
			'fc1': fc1,
			'fc2': fc2,
			'fc3': fc3,
			'fc4': fc4,
			'fc5': fc5,
			'fc6': fc6,
			'fc7': fc7,
			'cc': command_count
		}
	};

	// set up the request
	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			console.log('Response: ' + chunk);
		});
	});

	// post the data
	post_req.write("");
	post_req.end();

}, 2000);


httpx.listen(port, function() {
	console.log("Listening on *:"+port);
});
