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
				document.getElementById("command").value = "for (var i=0; i<200; i = i + 1) tapButton('a');";
				document.getElementById("command").disabled = true;
				log("\nNormally, in this part of the game we'd have to press the A button over and over again and listen to Professor Oak ramble on about how the "+
				"Pokemon world is filled with Pokemon and trainers and stuff, but we're programmers now!  We can make the A button press itself!");
				log("\nI've typed in a little command that does exactly that.  Basically, I told the computer to count to 200 and press the A button "+
					"every time it counts a new number, so it'll hit the A button a total of 200 times.")
			}
		},100)
	}
	if (tutorialEnabled && !hasSeenLoop && document.getElementById("command").disabled) {
		log("Take THAT, Professor Oak!\n");
		log("While we wait for him to finish talking, I want to explain exactly how that piece of code I showed you works.  The first word, 'for', tells JavaScript"+
			+" to run a for-loop.  A for-loop is one of the easiest ways to do something over and over again.  The next bit of the for loop, 'var i=0', is called the "+
			"initialization.  The initialization tells JavaScript how to get ready for the loop.  In this case, I've told it to create a VARiable (in other words, I've "+
			"asked it to remember a number), and set that variable to 0.\n")
		log("The next bit of the loop is called the condition.  The condition is what tells JavaScript how long to keep doing the loop.  'i<200' means 'if the number is less "
		+"than 200, keep going'.  Then, the 'i = i + 1' (the afterthought) tells it to count the next number each time.  So (var i=0; i<200; i++) means 'count to 200'.\n");
		log('Finally, the "tapButton(\'a\')" is the thing that the computer does each time through the loop.  The computer counts to 200, and for each number it counts, it presses A!\n');
		log("Let's take a look at how the A-presser is going... Well, maybe it wasn't the best idea to have the computer press A over and over.  I think it set our name to AAAAAAA! "+
		"Normally in Pokemon games you aren't allowed to change your name after the game starts.  Thankfully, we're programmers, so we don't need to play by the rules!");
		hasSeenLoop = true;
		document.getElementById("command").disabled = false;
	}
	document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
}