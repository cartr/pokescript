var tutorialEnabled = true;
var hasSeenError = false;
var hasPressedStart = false;
var hasSeenLoop = false;
var hasChangedName = false;

function log(s) {
	document.getElementById('history').innerHTML += (s+"\n").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function executeCommand() {
	gameboy.memory[0xD355] = 0; // Set text speed to INSTANT
	readPlayerPokemon();
	readOpponentPokemon();
	var cmd = document.getElementById('command').value;
	document.getElementById('command').value = "";
	log("&gt; "+cmd);
	if (["left","right","b","a","select","start","up","down"].indexOf(cmd.toLowerCase().trim()) !== -1) {
		log("To press "+cmd.toLowerCase().trim()+", type tapButton('"+cmd.toLowerCase().trim()+"')");
		return;
	}
	try {
		var result = eval(cmd);
		if (result !== undefined) {
			if (typeof result !== "function")
				log(result);
			else
				log("If you're trying to call a function, remember that you need to use the () parentheses.");
		}
	} catch (e) {
		log(e);
		if (tutorialEnabled && !hasSeenError) {
			hasSeenError = true;
			log("\nIt looks like you got an error; the computer's trying to tell you that it doesn't understand what you're trying to tell it to do. "+
			    "Usually, this means that you missed a piece of punctuation or spelled a word wrong.\n\nWhile they may seem annoying, error messages like "+
				"this are actually a good thing! (Sometimes, when computer programmers make mistakes, the computer just does the wrong thing. Problems like "+
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
				document.getElementById("command").value = "for (var i=0; i<75; i = i + 1) tapButton('a');";
				document.getElementById("command").disabled = true;
				log("\nNormally, in this part of the game we'd have to press the A button over and over again and listen to Professor Oak ramble on about how the "+
				"Pokemon world is filled with Pokemon and trainers and stuff, but we're programmers now!  We can make the A button press itself!");
				log("\nI've typed in a little command that does exactly that.  Basically, I told the computer to count to 75 and press the A button "+
					"every time it counts a new number, so it'll hit the A button a total of 75 times.")
			}
		},100)
	}
	else if (tutorialEnabled && !hasSeenLoop && document.getElementById("command").disabled) {
		log("Take THAT, Professor Oak!\n");
		log("While we wait for him to finish talking, I want to explain exactly how that piece of code I showed you works.  The first word, 'for', tells JavaScript"+
			" to run a for-loop.  A for-loop is one of the easiest ways to do something over and over again.  The next bit of the for loop, 'var i=0', is called the "+
			"initialization.  The initialization tells JavaScript how to get ready for the loop.  In this case, I've told it to create a VARiable (in other words, I've "+
			"asked it to remember a number), and set that variable to 0.\n")
		log("The next bit of the loop is called the condition.  The condition is what tells JavaScript how long to keep doing the loop.  'i<75' means 'if the number is less "
		+"than 75, keep going'.  Then, the 'i = i + 1' (the afterthought) tells it to count the next number each time.  So (var i=0; i<75; i++) means 'count to 75'.\n");
		log('Finally, the "tapButton(\'a\')" is the thing that the computer does each time through the loop.  The computer counts to 75, and for each number it counts, it presses A!\n');
		log("Let's take a look at how the A-presser is going... Well, maybe it wasn't the best idea to have the computer press A over and over.  I think it set our name to AAAAAAA! "+
		"Normally in Pokemon games you aren't allowed to change your name after the game starts.  Thankfully, we're programmers, so we don't need to play by the rules!  Type player.name='CARTER'; "+
		"to change your name to something else!");
		hasSeenLoop = true;
		document.getElementById("command").disabled = false;
	} else if (tutorialEnabled && hasSeenLoop && !hasChangedName && player.name != "AAAAAAA") {
		log("Great job!\n");
		if (player.name == "CARTER") {
			log("(By the way, your name doesn't have to be CARTER.  You can type player.name='SUSAN'; or player.name='THEBEST'; if you want)\n");
		}
		log("Your next task is a formidable challenge: escape your house.  You'll need to use commands like tapButton('up') to move your character around.\n")
		log("Tip: You don't need to type tapButton('right') eleventy billion times to get your character to walk.  Use loops!\n")
		hasChangedName = true;
		var escapeHouseTimer = setInterval(function() {
			if (player.mapNumber == 0) {
				clearInterval(escapeHouseTimer);
				log("Congratulations!  You left your house!  Next, you can head north to acquire your first Pokemon and continue on your adventure!\n");
				var getPokemonTimer = setInterval(function() {
					if (player.pokemon.length > 0) {
						clearInterval(getPokemonTimer);
						log("Now that you've got a Pokemon, you can use your programmer skills to find out more about it!  Try typing player.pokemon[0] (Computers normally count things starting from 0.) "+
							"If you want more details, you can do things like player.pokemon[0].hp or player.pokemon[0].stats.attack to see exactly what the numbers are.");
						var firstBattleTimer = setInterval(function() {
							if (inBattle()) {
								clearInterval(firstBattleTimer);
								log("By the way, magical JavaScript Pokemon analysis works on your opponent's Pokemon, too!  Try opponent.pokemon[0].hp !");
								var endOfBattleTimer = setInterval(function() {
									if (!inBattle()) {
										clearInterval(endOfBattleTimer);
										log("If we're going to keep walking around like this, we're going to need to define a few functions.  Functions are another "+
										"way to save us time. (As you may have noticed, programmers don't really like typing things over and over.)  You can define a function "+
										"like this: walk = function(direction,distance) {for (var i=0; i<distance; i++) tapButton(direction)}\n");
										log("The 'walk =' part is just like the 'var i=' part we saw earlier; we're telling JavaScript to remember something. "+
										"The word 'function' tells JavaScript that what we type next is a function, and the '(direction, distance)' bit tells JavaScript "+
										"the parameters of the function.  Parameters are things we can give a function to change what it does. In this case, we want to be "+
										"able to specify the direction to walk in and the distance to walk. Finally, the bit inside the { } (which are called curly braces, by the way) "+
									 	"is called the body of the function.  The body is the code that runs when we run the function.\n");
										log("The end result is that after you define the function with that code, you'll be able just to type walk('left',4); and JavaScript "+
									    "will do all the work for you.");
									}
								},100)
							}
						},100)
					}
				},100)
			}
		},100)
	}
	document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
}