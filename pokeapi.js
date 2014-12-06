var keyQueue = [];
setInterval( function() {
	var keyFunc = keyQueue.shift();
	if (keyFunc !== undefined)
		keyFunc[0](keyFunc[1])
},200);

var textTranslationTable = ["","","","","","ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ","ド","","","","","","バ","ビ","ブ","ボ","","","","","","","","","","が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","","","","","","ば","び","ぶ","べ","ぼ","","パ","ピ","プ","ポ","ぱ","ぴ","ぷ","ぺ","ぽ","","","","","","","","@","","","","#","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","№","…","","","","┌","─","┐","│","└","┘"," ","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","(",")",":",";","[","]","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","é","'d","'l","'s","'t","'v","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん","っ","'","ゅ","ょ","-","'r","'m","?","!",".","","","","","▶","","♂","¥","×","","/",",","♀","0","1","2","3","4","5","6","7","8","9"];

function translateText(text,len) { result = ""; for (var i=text; i<text+len; i++) { result += textTranslationTable[gameboy.memory[i]]; } return result; }
function translateVarLenText(text, maxlen) {result = ""; var i=text; while(gameboy.memory[i] !== 0x50 && result.length < maxlen) { result += textTranslationTable[gameboy.memory[i]]; i++ } return result; }
function setVarLenText(addr,maxlen,text){
	var addrToWrite = addr;
	var textIndex = 0;
	while (addrToWrite < maxlen+addr && textIndex<text.length) {
		gameboy.memory[addrToWrite] = textTranslationTable.indexOf(text[textIndex]);
		addrToWrite++;
		textIndex++;
	}
	while (addrToWrite < maxlen+addr) {
		gameboy.memory[addrToWrite] = 0x50;
		addrToWrite++;
	}
}
function write16bit(num,addr) {
	gameboy.memory[addr] = num >> 8;
	gameboy.memory[addr+1] = num & 0xFF;
}
function read16bit(addr) {
	return (gameboy.memory[addr] << 16) + gameboy.memory[addr+1];
}


function tapButton(key,done) {
	var validButtons = ["start","select","a","b","up","down","left","right"];
	if (validButtons.indexOf(key) === -1) {
		throw new ReferenceError("invalid button name");
	}
	keyQueue.push([GameBoyKeyDown,key]);
	keyQueue.push([function(key) {
		GameBoyKeyUp(key); 
		if (done !== undefined)
			done()
	}, key]);
}

function textOnScreen() { return (translateText(50361,18).trim()+"\n"+translateText(50401,18).trim()).trim(); }

function Player() {}
var player = new Player();
player.pokemon=[];
Object.defineProperty(player,"name", {
	get: function() { return translateVarLenText(0xD158,7)},
	set: function(name) { setVarLenText(0xD158,7,name) }
});
Object.defineProperty(player,"x", {
	get: function() { return gameboy.memory[0xD362]}
});
Object.defineProperty(player,"y", {
	get: function() { return gameboy.memory[0xD361]}
});
Object.defineProperty(player,"mapNumber", {
	get: function() { return gameboy.memory[0xD35E]}
});
Object.defineProperty(player,"money", {
	get: function() {
		var total = 0;
		for (var i=0xD347; i<=0xD349; i++) {
			total *= 100;
			total +=((gameboy.memory[i] >> 4) & 15)*10 + (gameboy.memory[i] & 15);
		}
		return total
	},
	set: function(v) {
		for (var i=0; i<3; i++) {
			var digits = (v/Math.pow(100,2-i)) % 100;
			gameboy.memory[0xD347+i] = ((digits/10) << 4) + (digits % 10);
		}
	}
});
Object.defineProperty(player,"trainerid", {
	get: function() {
		return gameboy.memory[0xD359]*256 + gameboy.memory[0xD35A];
	},
	set: function(v) {
		gameboy.memory[0xD35A] = v & 0xFF;
		gameboy.memory[0xD359] = v >> 8;
	}
})

function Move(moveid) {
	this.moveid=moveid;
	this.pp=0;
}

function Pokemon(species,name) {
	this.species=species;
	this.name=name;
	this.hp=5;
	this.level=1;
	this.status=0;
	this.type1=0;
	this.type2=0;
	this.moves=[];
	this.trainerid=player.trainerid;
	this.exp=0;
	this.EVs = {hp:0,attack:0,defense:0,speed:0,special:0};
	this.atkdefiv=0;
	this.speedspecialiv=0;
	this.stats = {hp:1,attack:1,defense:1,speed:1,special:1};
}
Pokemon.prototype.toString = function() {
	return this.name+", level "+this.level;
}
Pokemon.prototype.serialize = function(address) {
	gameboy.memory[address] = this.species;
	write16bit(this.hp,address+1);
	gameboy.memory[address+3] = this.level;
	gameboy.memory[address+4] = this.status;
	gameboy.memory[address+5] = this.type1;
	gameboy.memory[address+6] = this.type2;
	for (var i=0; i<4; i++) {
		if (i<this.moves.length)
			gameboy.memory[address+8+i]=this.moves[i].moveid;
		else
			gameboy.memory[address+8+i]=0;
	}
	write16bit(this.trainerid,address+12);
	gameboy.memory[address+14] = this.exp>>14;
	write16bit(this.exp&0xFFFF,address+15);
	write16bit(this.EVs.hp,address+17);
	write16bit(this.EVs.attack,address+19);
	write16bit(this.EVs.defense,address+21);
	write16bit(this.EVs.speed,address+23);
	write16bit(this.EVs.special,address+25);
	gameboy.memory[address+27] = this.atkdefiv;
	gameboy.memory[address+28] = this.speedspecialiv;
	for (var i=0; i<4; i++) {
		if (i<this.moves.length)
			gameboy.memory[address+29+i]=this.moves[i].pp;
		else
			gameboy.memory[address+29+i]=0;
	}
	gameboy.memory[address+33]=this.level;
	write16bit(this.stats.hp,address+34);
	write16bit(this.stats.attack,address+36);
	write16bit(this.stats.defense,address+38);
	write16bit(this.stats.speed,address+40);
	write16bit(this.stats.special,address+42);
}
Pokemon.prototype.deserialize = function(address) {
	this.species = gameboy.memory[address];
	this.hp = read16bit(address+1);
	this.level = gameboy.memory[address+3];
	this.status = gameboy.memory[address+4];
	this.type1 = gameboy.memory[address+5];
	this.type2 = gameboy.memory[address+6];
	this.moves=[];
	for (var i=0; i<4; i++) {
		if (gameboy.memory[address+8+i] != 0)
			this.moves[i]=new Move(gameboy.memory[address+8+i]);
	}
	this.trainerid = read16bit(address+12);
	this.exp = gameboy.memory[address+14] << 14;
	this.exp += read16bit(address+15);
	this.EVs.hp = read16bit(address+17);
	this.EVs.attack = read16bit(address+19);
	this.EVs.defense = read16bit(address+21);
	this.EVs.speed = read16bit(address+23);
	this.EVs.special = read16bit(address+25);
	this.atkdefiv = gameboy.memory[address+27];
	this.speedspecialiv = gameboy.memory[address+28];
	for (var i=0; i<this.moves.length; i++) {
			this.moves[i].pp=gameboy.memory[address+29+i];
	}
	this.level=gameboy.memory[address+33];
	this.stats.hp=read16bit(address+34);
	this.stats.attack=read16bit(address+36);
	this.stats.defense=read16bit(address+38);
	this.stats.speed=read16bit(address+40);
	this.stats.special=read16bit(address+42);
}
function readPlayerPokemon() {
	player.pokemon = [];
	for (var i=0; i<gameboy.memory[0xD163]; i++) {
		player.pokemon[i]=new Pokemon(gameboy.memory[0xD164+i],translateVarLenText(0xD2B5+11*i,10));
		player.pokemon[i].deserialize(0xD16B+44*i);
	}
}
function writePlayerPokemon() {
	//TODO: hangs the game for some reason
	gameboy.memory[0xD163] = player.pokemon.length;
	for (var i=0; i<player.pokemon.length; i++) {
		gameboy.memory[0xD164+i] = player.pokemon[i].species;
		setVarLenText(0xD2B5+11*i,10,player.pokemon[i].name);
		player.pokemon[i].serialize(0xD16B+44*i);
	}
}

function inBattle() {
	return gameboy.memory[0xD057] !== 0;
}

var opponent = {pokemon:[]};
function readOpponentPokemon() {
	opponent.pokemon = [];
	for (var i=0; i<gameboy.memory[0xD89C]; i++) {
		opponent.pokemon[i]=new Pokemon(gameboy.memory[0xD89D+i],translateVarLenText(0xD9EE+11*i,10));
		opponent.pokemon[i].deserialize(0xD8A4+44*i);
	}
}