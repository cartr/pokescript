function log(s) {
	document.getElementById('history').innerHTML += s+"\n";
}

function executeCommand() {
	var cmd = document.getElementById('command').value;
	document.getElementById('command').value = "";
	log("&gt; "+cmd);
	try {
		var result = eval(cmd);
		if (result !== undefined) {
			if (typeof result == "number") {
				log(result);
			} else {
				log(repr(result));
			}
		}
	} catch (e) {
		log(e);
	}
	document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
}