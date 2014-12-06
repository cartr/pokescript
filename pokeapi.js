/*
User-callable commands for PokeAPI-js
*/

function pushButton(key) {
	GameBoyKeyDown(key);
	setTimeout(function() {GameBoyKeyUp(key)},200);
}