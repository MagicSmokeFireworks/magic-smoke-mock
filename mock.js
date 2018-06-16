
var express = require('express');
var app = express();

var net = require('net');
var http = require('http');

var httpserver = require('http').Server(app);
var io = require('socket.io')(httpserver);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var fs = require('fs');
var contents = fs.readFileSync('boardinfo.json');
var boardinfo = JSON.parse(contents);

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.emit('fresh state', boardState);
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

app.set('view engine', 'pug');

app.use(express.static('static'));



var boardKey = process.argv[2];
var boardID = boardinfo[boardKey].id;
var boardName = boardinfo[boardKey].name;
var httpPort = process.argv[3];
var netPort = process.argv[4];

var sw_arm = '0';
var hw_arm = 'ARMED';
var command_count = 0;

var fc = [0,0,0,0,0,0,0,0];

var imp_no_match = 3000;
var imp_match = 1500;
var imp_low = 500;

var m = [imp_match,imp_match,imp_match,imp_match,imp_match,imp_match,imp_match,imp_match];


const server = net.createServer((c) => {

	console.log('client connected');

	// get commands out of the data field
	c.on('data', (buf) => {

		console.log('data: ' + buf);

		cmd = buf.toString('utf8');

		// ignore commands when powered off
		if (boardState.battery != 'connected') {
			return;
		}
		if (boardState.power_switch != 'on') {
			return;
		}
		if (boardState.uplink != 'good') {
			return;
		}

		if (cmd == 'identify') {
			console.log('identify: ' + boardName);
			command_count = command_count + 1;
		}
		else if (cmd == 'arm') {
			console.log('software ARM');
			command_count = command_count + 1;
			sw_arm = '1';
		}
		else if (cmd == 'disarm') {
			console.log('software DISARM');
			command_count = command_count + 1;
			sw_arm = '0';
		}
		else if (cmd.startsWith('fire')) {
			command_count = command_count + 1;
			if (sw_arm != '1') {
				console.log('SW DISARMED: will not respect fire command');
			}
			else {
				var chans = cmd.replace(/^fire/,'');
				for (var i = 0; i < chans.length; i++) {
					fire_channel(chans.charAt(i));
				}
			}
		}
		else {
			console.log('unknown command: ' + cmd);
		}
	});

	c.on('end', () => {
		console.log('client disconnected');
	});

	// repeat data back to client
	if ((boardState.battery == 'connected') && (boardState.power_switch == 'on') && (boardState.uplink == 'good')) {
		c.pipe(c);
	}
	else {
		c.destroy();
	}

});

server.on('error', (err) => {
	throw err;
});

var sync_imps = function(channel) {
	for (var i = 0; i < 8; i++) {
		if (boardState.channels[i].match_status == 'good') {
			m[i] = imp_match;
		}
		else if (boardState.channels[i].match_status == 'high') {
			m[i] = imp_no_match;
		}
		else if (boardState.channels[i].match_status == 'low') {
			m[i] = imp_low;
		}
		else {
			m[i] = imp_no_match;
		}
	}
};

var fire_channel = function(channel) {
	console.log('firing channel ' + channel);
	var ichan = parseInt(channel);
	fc[ichan] = fc[ichan] + 1;
	if (boardState.arm_switch == 'armed') {
		if (boardState.channels[ichan].match_fet == 'good') {
			if (boardState.channels[ichan].match_response == 'open') {
				boardState.channels[ichan].match_status = 'none';
				m[ichan] = imp_no_match;
			}
			else {
				boardState.channels[ichan].match_status = 'low';
				m[ichan] = imp_low;
			}
		}
	}
	io.emit('fresh state', boardState);
};

var boardState = {
	battery: 'connected',
	power_switch: 'on',
	arm_switch: 'armed',
	arm_sense: 'good',
	uplink: 'good',
	downlink: 'good',
	channels: [
		{
			match_status: 'good',
			match_response: 'open',
			match_sense: 'good',
			match_fet: 'good'
		},
		{
			match_status: 'good',
			match_response: 'open',
			match_sense: 'good',
			match_fet: 'good'
		},
		{
			match_status: 'good',
			match_response: 'open',
			match_sense: 'good',
			match_fet: 'good'
		},
		{
			match_status: 'good',
			match_response: 'open',
			match_sense: 'good',
			match_fet: 'good'
		},
		{
			match_status: 'good',
			match_response: 'open',
			match_sense: 'good',
			match_fet: 'good'
		},
		{
			match_status: 'good',
			match_response: 'open',
			match_sense: 'good',
			match_fet: 'good'
		},
		{
			match_status: 'good',
			match_response: 'open',
			match_sense: 'good',
			match_fet: 'good'
		},
		{
			match_status: 'good',
			match_response: 'open',
			match_sense: 'good',
			match_fet: 'good'
		}
	]
};

var reset_board = function() {
	sw_arm = '0';
	command_count = 0;
	fc[0] = 0;
	fc[1] = 0;
	fc[2] = 0;
	fc[3] = 0;
	fc[4] = 0;
	fc[5] = 0;
	fc[6] = 0;
	fc[7] = 0;
};

app.post('/resetBoard', function(req, res) {
	res.end();
	reset_board();
	io.emit('fresh state', boardState);
});

app.post('/battery', function(req, res) {
	var batterystate = req.query.state;
	if (batterystate == 'connected') {
		boardState.battery = 'connected';
	}
	else {
		boardState.battery = 'disconnected';
		reset_board();
	}
	res.end();
	io.emit('fresh state', boardState);
});

app.post('/power', function(req, res) {
	var powerstate = req.query.state;
	if (powerstate == 'on') {
		boardState.power_switch = 'on';
	}
	else {
		boardState.power_switch = 'off';
		reset_board();
	}
	res.end();
	io.emit('fresh state', boardState);
});

app.post('/hwarm', function(req, res) {
	var hwarmstate = req.query.state;
	if (hwarmstate == 'arm') {
		boardState.arm_switch = 'armed';
		hw_arm = 'ARMED';
	}
	else {
		boardState.arm_switch = 'disarmed';
		hw_arm = 'DISARMED';
	}
	res.end();
	io.emit('fresh state', boardState);
});

app.post('/armsense', function(req, res) {
	var armsensestate = req.query.state;
	if (armsensestate == 'good') {
		boardState.arm_sense = 'good';
	}
	else {
		boardState.arm_sense = 'bad';
	}
	res.end();
	io.emit('fresh state', boardState);
});

app.post('/uplink', function(req, res) {
	var upstate = req.query.state;
	if (upstate == 'good') {
		boardState.uplink = 'good';
	}
	else {
		boardState.uplink = 'bad';
	}
	res.end();
	io.emit('fresh state', boardState);
});

app.post('/downlink', function(req, res) {
	var downstate = req.query.state;
	if (downstate == 'good') {
		boardState.downlink = 'good';
	}
	else {
		boardState.downlink = 'bad';
	}
	res.end();
	io.emit('fresh state', boardState);
});

app.post('/match_status', function(req, res) {
	var matchstate = req.query.state;
	var channel = req.query.channel;
	boardState.channels[parseInt(channel)].match_status = matchstate;
	res.end();
	sync_imps();
	io.emit('fresh state', boardState);
});

app.post('/match_response', function(req, res) {
	var matchstate = req.query.state;
	var channel = req.query.channel;
	boardState.channels[parseInt(channel)].match_response = matchstate;
	res.end();
	io.emit('fresh state', boardState);
});

app.post('/match_sense', function(req, res) {
	var matchstate = req.query.state;
	var channel = req.query.channel;
	boardState.channels[parseInt(channel)].match_sense = matchstate;
	res.end();
	io.emit('fresh state', boardState);
});

app.post('/match_fet', function(req, res) {
	var matchstate = req.query.state;
	var channel = req.query.channel;
	boardState.channels[parseInt(channel)].match_fet = matchstate;
	res.end();
	io.emit('fresh state', boardState);
});

app.get('/', function(req, res) {
	console.log('home');
	res.render('home', {name: boardName, state: boardState});
});


var sendTelem = setInterval(function() {

	// do nothing if board not powered
	if (boardState.battery != 'connected') {
		return;
	}
	if (boardState.power_switch != 'on') {
		return;
	}
	if (boardState.downlink != 'good') {
		return;
	}

	var hw_arm_sense = hw_arm;
	if (boardState.arm_sense != 'good') {
		hw_arm_sense = 'DISARMED';
	}

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
			'port': netPort,
			'fver': 'MOCK',
			'sw_arm': sw_arm,
			'hw_arm': hw_arm_sense,
			'wifi_rssi': '0',
			'r0': m[0],
			'r1': m[1],
			'r2': m[2],
			'r3': m[3],
			'r4': m[4],
			'r5': m[5],
			'r6': m[6],
			'r7': m[7],
			'fc0': fc[0],
			'fc1': fc[1],
			'fc2': fc[2],
			'fc3': fc[3],
			'fc4': fc[4],
			'fc5': fc[5],
			'fc6': fc[6],
			'fc7': fc[7],
			'cc': command_count
		}
	};

	// set up the request
	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			console.log('Response: ' + chunk);
		});
	}).on('error', function(err) {
		console.log("Error with connection to server: " + err);
	});

	// post the data
	post_req.write("");
	post_req.end();

}, 2000);

httpserver.listen(httpPort, function() {
	console.log("HTTP server listening on *:"+httpPort);
});

server.listen(netPort, () => {
	console.log("Net server bound on *:" + netPort);
});

