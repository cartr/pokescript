function executeCommand() {
	var cmd = document.getElementById('command').value;
	document.getElementById('command').value = "";
	document.getElementById('history').innerHTML += "&gt; "+cmd+"<br>";
	var result = eval(cmd);
	if (result !== undefined) {
		document.getElementById('history').innerHTML += repr(result)+"<br>";
	}
	document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
}