
var socket = io();

socket.on('fresh state', function(boardState) {

	var battery_connection = document.getElementById("battery_connection");
	if (battery_connection != null) {
		battery_connection.innerHTML = boardState.battery;
		if (boardState.battery == 'connected') {
			battery_connection.className = 'good_status';
		}
		else {
			battery_connection.className = 'error_status';
		}
	}

	var power_switch = document.getElementById("power_switch");
	if (power_switch != null) {
		power_switch.innerHTML = boardState.power_switch;
		if (boardState.power_switch == 'on') {
			power_switch.className = 'good_status';
		}
		else {
			power_switch.className = 'error_status';
		}
	}

	var arm_switch = document.getElementById("arm_switch");
	if (arm_switch != null) {
		arm_switch.innerHTML = boardState.arm_switch;
		if (boardState.arm_switch == 'armed') {
			arm_switch.className = 'good_status';
		}
		else {
			arm_switch.className = 'warning_status';
		}
	}

	var arm_sense = document.getElementById("arm_sense");
	if (arm_sense != null) {
		arm_sense.innerHTML = boardState.arm_sense;
		if (boardState.arm_sense == 'good') {
			arm_sense.className = 'good_status';
		}
		else {
			arm_sense.className = 'error_status';
		}
	}

	var uplink = document.getElementById("uplink");
	if (uplink != null) {
		uplink.innerHTML = boardState.uplink;
		if (boardState.uplink == 'good') {
			uplink.className = 'good_status';
		}
		else {
			uplink.className = 'error_status';
		}
	}

	var downlink = document.getElementById("downlink");
	if (downlink != null) {
		downlink.innerHTML = boardState.downlink;
		if (boardState.downlink == 'good') {
			downlink.className = 'good_status';
		}
		else {
			downlink.className = 'error_status';
		}
	}

	for (var i = 0; i < 8; i++) {

		var match_status = document.getElementById("match_status_"+i);
		if (match_status != null) {
			match_status.innerHTML = boardState.channels[i].match_status;
			if (boardState.channels[i].match_status == 'good') {
				match_status.className = 'good_status';
			}
			else if (boardState.channels[i].match_status == 'none') {
				match_status.className = 'warning_status';
			}
			else {
				match_status.className = 'error_status';
			}
		}

		var match_response = document.getElementById("match_response_"+i);
		if (match_response != null) {
			match_response.innerHTML = boardState.channels[i].match_response;
			if (boardState.channels[i].match_response == 'open') {
				match_response.className = 'good_status';
			}
			else {
				match_response.className = 'warning_status';
			}
		}

		var match_sense = document.getElementById("match_sense_"+i);
		if (match_sense != null) {
			match_sense.innerHTML = boardState.channels[i].match_sense;
			if (boardState.channels[i].match_sense == 'good') {
				match_sense.className = 'good_status';
			}
			else {
				match_sense.className = 'error_status';
			}
		}

		var match_fet = document.getElementById("match_fet_"+i);
		if (match_fet != null) {
			match_fet.innerHTML = boardState.channels[i].match_fet;
			if (boardState.channels[i].match_fet == 'good') {
				match_fet.className = 'good_status';
			}
			else {
				match_fet.className = 'error_status';
			}
		}
	}

});

