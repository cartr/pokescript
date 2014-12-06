var tutorialEnabled = true;
var hasSeenError = false;
var hasPressedStart = false;
var hasSeenLoop = false;

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
		if (tutorialEnabled && !hasSeenError) {
			hasSeenError = true;
			log("\nIt looks like you got an error; the computer's trying to tell you that it doesn't understand what you're trying to tell it to do. "+
			    "Usually, this means that you missed a piece of punctuation or spelled a word wrong.\n\nWhile they may seem annoying, error messages like"+
				"this are actually a good thing! (Sometimes, when computer programmers make mistakes, the computer just does the wrong thing. Problems like"+
				"that are usually a lot harder to track down and fix than error messages.)")
		}
	}
	if (tutorialEnabled && !hasPressedStart && keyQueue.length > 0 && keyQueue[0][1] == "start") {
		hasPressedStart = true;
		log("\nCongratulations! You are now a programmer!  Start isn't the only button you can tap, by the way.  You can do things like "+
			"tapButton('select') and tapButton('left') if you want, too.");
		log("\nGo ahead and tapButton('a') to start a new game once you're on the menu screen.");
		var oakTimer = setInterval(function() {
			if (textOnScreen().indexOf("Hello") > -1) {
				clearInterval(oakTimer);
				document.getElementById("command").value = "for (var i=0; i<200; i++) tapButton('a');";
				document.getElementById("command").disabled = true;
				log("\nNormally, in this part of the game we'd have to press the A button over and over again and listen to Professor Oak ramble on about how the"+
				"Pokemon world is filled with Pokemon and trainers and stuff, but we're programmers now!  We can make the A button press itself!");
				log("\nI've typed in a little command that does exactly that.  Basically, I told the computer to count to 200 and press the A button "+
					"every time it counts a new number.  In other words, the computer is going to press the A button 200 times.")
			}
		},100)
	}
	document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
}