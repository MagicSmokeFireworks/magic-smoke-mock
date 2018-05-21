
var resetBoard = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/resetBoard", true);
	xhttp.send();
};

var connectBattery = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/battery?state=connected", true);
	xhttp.send();
};

var disconnectBattery = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/battery?state=disconnected", true);
	xhttp.send();
};

var powerOn = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/power?state=on", true);
	xhttp.send();
};

var powerOff = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/power?state=off", true);
	xhttp.send();
};

var hardwareArm = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/hwarm?state=arm", true);
	xhttp.send();
};

var hardwareDisarm = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/hwarm?state=disarm", true);
	xhttp.send();
};

var armSenseGood = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/armsense?state=good", true);
	xhttp.send();
};

var armSenseBad = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/armsense?state=bad", true);
	xhttp.send();
};

var uplinkGood = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/uplink?state=good", true);
	xhttp.send();
};

var uplinkBad = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/uplink?state=bad", true);
	xhttp.send();
};

var downlinkGood = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/downlink?state=good", true);
	xhttp.send();
};

var downlinkBad = function() {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/downlink?state=bad", true);
	xhttp.send();
};

var matchNone = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_status?state=none&channel="+channel, true);
	xhttp.send();
};

var matchLow = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_status?state=low&channel="+channel, true);
	xhttp.send();
};

var matchHigh = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_status?state=high&channel="+channel, true);
	xhttp.send();
};

var matchGood = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_status?state=good&channel="+channel, true);
	xhttp.send();
};

var matchRespondOpen = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_response?state=open&channel="+channel, true);
	xhttp.send();
};

var matchRespondLow = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_response?state=low&channel="+channel, true);
	xhttp.send();
};

var matchSenseGood = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_sense?state=good&channel="+channel, true);
	xhttp.send();
};

var matchSenseBad = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_sense?state=bad&channel="+channel, true);
	xhttp.send();
};

var matchFETGood = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_fet?state=good&channel="+channel, true);
	xhttp.send();
};

var matchFETBad = function(channel) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/match_fet?state=bad&channel="+channel, true);
	xhttp.send();
};

