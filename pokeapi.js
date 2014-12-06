var keyQueue = [];
setInterval( function() {
	var keyFunc = keyQueue.shift();
	if (keyFunc !== undefined)
		keyFunc[0](keyFunc[1])
},100);
/*
User-callable commands for PokeAPI-js
*/
function tapButton(key,done) {
	keyQueue.push([GameBoyKeyDown,key]);
	keyQueue.push([function(key) {
		GameBoyKeyUp(key); 
		if (done !== undefined)
			done()
	}, key]);
}