function executeCommand() {
	var cmd = document.getElementById('command').value;
	document.getElementById('command').value = "";
	document.getElementById('history').innerHTML += "&gt; "+cmd+"<br>";
	try {
		var result = eval(cmd);
		if (result !== undefined) {
			if (typeof result == "number") {
				document.getElementById('history').innerHTML += result+"<br>";
			} else {
				document.getElementById('history').innerHTML += repr(result)+"<br>";
			}
		}
	} catch (e) {
		document.getElementById('history').innerHTML += e+"<br>";
	}
	document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
}