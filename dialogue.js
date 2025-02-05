/* 

Dialogue System overhaul - Improved relationship tracking and diversity + user input
 - Event system where each event has a custom trigger function (ie if relation > 50 and this event hasn't triggered and C recently defeated lich)
 - Then have custom function to process the event and user responses
  
*/

var events = [];
var steps = [];

function Step(speaker, id, text, event){
	this.speaker = speaker;
	this.id = id; 				//String that tells what player response triggers this 
	this.text = text;
	this.event = event; 		//Code that runs when this step is triggered
	this.responses = [];		//Children of this step
}

function Event(speaker, id, condition, init) {
	this.speaker = speaker; 	//The speaker of the event
	this.id = id; 				//The name of the event
	this.condition = condition;	//Condition function
	this.init = init;			//Initialization Function
}

function BluffThirty(C) {
	this.deck = [];
	this.lost = [false, false];
	this.held = [false, false];
	this.hits = [false, false];
	this.match = 0;
	this.hands = [[], []];
	this.dealerHolds = false;
	this.pot = 6;
	this.init = function() {
		for (let i = 1; i <= 10; i++) {
			this.deck.push(i);
			this.deck.push(i);
			this.deck.push(i);
		}
		this.hit(0);
		this.hit(0);
		this.hit(1);
		this.hit(1);
	}
	this.hit = function(index) {
		this.pot += 1;
		this.hands[index].push(this.deck.splice(rand(this.deck.length), 1)[0]);
		if (this.sumShown(index) > 30) {
			this.lost[index] = true;
		}
	}
	
	this.sumHidden = function(index) {
		return this.hands[index][0] + this.hands[index][1];
	}
	
	this.sumShown = function(index) {
		let sum = 0;
		for (let i = 2; i < this.hands[index].length; i++) {
			sum += this.hands[index][i];
		}
		return sum;
	}
	
	this.sum = function(index) {
		return this.sumShown(index) + this.sumHidden(index);
	}
	
	this.think = function() {
		let lastHeld = this.held[0];
		this.hits[0] = false;
		this.held[0] = false;
		let sumHidden = this.sumHidden(0);
		let sumShown = this.sumShown(0);
		let sum = sumHidden + sumShown;
		if (sum > 22 + rand(6) && sum <= 30) {
			console.log("I'm Holding");
			this.held[0] = true;
		}
		else if (sum > 30) {
			let bluffChance = Math.max(1, (this.sumShown(1) - 20));
			if (lastHeld || bluffChance > rand(8)) {
				//We're bluffing this bitch
				if (sumShown < sumHidden) {
					console.log("I'm Hitting");
					this.hits[0] = true;
					this.hit(0);
				}
				else {
					this.held[0] = true;
				}
			}
			else {
				console.log("I'm Folding");
				this.lost[0] = true;
			}
		}
		else {
			console.log("I'm Hitting");
			this.hits[0] = false;
			this.hit(0);
		}
	}
	
	this.bet = function(C) {
		let sum = this.sum(0);
		let shown = this.sumShown(0);
		let gold = 1 + rand(3);
		console.log(gold);
		if (sum > 30) {
			if (shown > 15 && shown < 25) {
				gold += 2;
			}
		}
		else {
			gold += 4 - rand(30 - sum);
		}
		console.log(gold);	
		gold = Math.min(C.GOLD, Math.max(5, Math.min(25, 5 * gold)));
		this.match = gold;
		return gold;
	}
	
	this.fold = function(C, amount) {
		if (this.sum(0) == 30 || this.sum(0) == 29) {
			return false;
		}
		let bet = this.bet(C);
		let myConfidence = bet/2 + rand(bet);
		let oppConfidence = amount/3 + rand(amount);
		console.log("My Confidence: " + myConfidence);
		console.log("Opponent's Confidence: " + oppConfidence);
		if (myConfidence > oppConfidence) {
			return false;
		}
		return true;
	}
}

function ProcessDialogue(C) {
	let speaker = C.DIALOGUE.STEP.speaker;
	let id = (speaker + C.DIALOGUE.STEP.id);
	console.log("Processing ID: " + id);
	let msg = "*PINK*Conversation with " + speaker + "\n\n";
	let relations = COPY(C.DIALOGUE.RELATIONS);
	let inventory = COPY(C.INVENTORY);
	let gold = COPY(C.GOLD);
	msg += C.DIALOGUE.STEP.event(C);
	
	let relationChange = false;
	let inventoryChange = false;
	
	for (const key of Object.keys(relations)) {
		let degree = "";
		let diff = Math.abs(C.DIALOGUE.RELATIONS[key] - relations[key]);
		if (diff <= 2) {
			degree = " very slightly";
		}
		else if (diff <= 4) {
			degree = " slightly";
		}
		else if (degree >= 9) {
			degree = " significantly";
		}
		if (C.DIALOGUE.RELATIONS[key] > relations[key]) {
			msg += "\n*GREY*Your relation with " + key + " has *GREEN*improved*GREY*" + degree + ".";
			relationChange = true;
		}
		else if (C.DIALOGUE.RELATIONS[key] < relations[key]) {
			msg += "\n*GREY*Your relation with " + key + " has *RED*worsened*GREY*" + degree + ".";
			relationChange = true;
		}
	}
	if (relationChange) {
		msg += "\n";
	}
	
	let itemChange = false;
	for (const item of inventory) {
		let hasItem = false;
		let invIndex = findItem(C.INVENTORY, item.name);
		if (invIndex == -1) {
			msg += "\n*RED*You lost " + itemName(item) + "\n";
		}
	}
	for (const item of C.INVENTORY) {
		let hasItem = false;
		let invIndex = findItem(inventory, item.name);
		if (invIndex == -1) {
			msg += "\n*GREEN*You gained " + itemName(item) + "\n";
		}
	}
	if (relationChange) {
		msg += "\n";
	}
	
	if (C.GOLD > gold) {
		msg += "\n*GREEN*You gained " + (C.GOLD - gold) + " gold\n";
	}
	if (C.GOLD < gold) {
		msg += "\n*RED*You lost " + (gold - C.GOLD) + " gold\n";
	}
	if (C.GOLD != gold) {
		msg += "\n";
	}
	
	if (C.DIALOGUE.STEP && id != (C.DIALOGUE.STEP.speaker + C.DIALOGUE.STEP.id)) {
		console.log("Processing a second time");
		msg += ProcessDialogue(C);
	}
	else if (C.DIALOGUE.STEP == null) {
		msg += "\n*BLACK*You end your conversation with " + speaker + ". . .\n"; 
	}
	else {
		let i = 1;
		for (const response of C.DIALOGUE.STEP.responses) {
			let step = findStep(C.DIALOGUE.STEP.speaker, response);
			msg += "\n*WHITE*" + i++ + " *BLACK*- *YELLOW*" + step.text;
		}
	}
	msg += "\n";
	
	return msg;
}

function Tag(step, textColor = "GREEN") {
	return "*GREY*" + step.speaker + ": *" + textColor + "*"
}

function initGout() {
	
}

function initNestra() {
	
}

function initMinsiki() {
	
}

function initTobin() {
	
}

function initKobos() {
	
}

function initClyde() {
	events.push(new Event("Clyde", "ClydeGeneral",
	function(C) {
		return true;
	},
	function(C) {
		C.DIALOGUE.STEP = findStep("Clyde", "ClydeGeneral");
	}));
	
	steps.push(new Step("Clyde", "ClydeGeneral", "", function(C) {
		this.responses = ["StartGame"];
		return "*GREEN*What can I do for you, " + C.CLASS + "?\n\n";
	}));
	
	steps.push(new Step("Clyde", "StartGame", "Let's play cards", function(C) {
		let msg = "*GREEN*Sure, we can play some cards.\n\n";
		if (C.GOLD < 10) {
			C.DIALOGUE.STEP = null;
			return "*GREEN*Sorry, but you're looking a little short on gold there, maybe some other time. . .\n";
		}
		if (!C.DIALOGUE.EVENTS["CardRules"]) {
			C.DIALOGUE.EVENTS["CardRules"] = true;
			msg += "Let me explain the rules, they're not too complicated. . .\n\n";
			msg += "The game's called *CYAN*Bluff Thirty*GREEN* and you play with a deck of thirty cards, one through ten, and your goal is to get cards that add as close to thirty, without going over.\n\n";
			msg += "Each player puts *YELLOW*five gold*GREEN* into the pot, and gets two cards that only they can see. Then, you can choose to either buy a card for *YELLOW*one gold*GREEN* or hold.\n\n";
			msg += "When we both hold our cards, whoever has more cards will set the bet, and the other player either has to match it or fold.\n\n";
			msg += "If both players match the bet you reveal your cards, whoever's closest to thirty without going over wins.\n\n";
		}
		C.GOLD -= 5;
		C.DIALOGUE.STEP = findStep("Clyde", "BluffThirty");
		C.DIALOGUE.DATA = new BluffThirty();
		C.DIALOGUE.DATA.init();
		return msg;
	}));
	
	steps.push(new Step("Clyde", "BluffThirty", "", function(C) {
		this.responses = [];
		let msg = "";
		let game = C.DIALOGUE.DATA;
		game.think();
		let hands = game.hands;
		if (game.lost[0]) {
			if (game.sumShown(0) > 30) {
				msg += "*GREEN*Clyde shows over thirty, you win!\n";
			}
			else {
				msg += "*GREEN*Clyde folds, you win!\n";
			}
			C.GOLD += game.pot;
			C.DIALOGUE.STEP = null;
		}
		else if (game.lost[1]) {
			msg += "*RED*You showed over thirty, you lose!\n";
			C.DIALOGUE.STEP = null;
		}
		else {
			if (game.held[0]) {
				msg += "*GREY*Clyde holds.\n\n";
			}
			if (game.hits[0]) {
				msg += "*GREY*Clyde draws another card.\n\n";
			}
			msg += "\n\n" + StackStrings("*GREY*Pot: *YELLOW*" + game.pot, "*GREY*Your Gold: *YELLOW*" + C.GOLD, 30);
			msg += "\n\n*RED*Clyde*GREY*: X X ";
			for (let i = 2; i < hands[0].length; i++) {
				msg += hands[0][i] + " ";
			}
			let color = "*GREY*";
			let sum = game.sum(1);
			if (color > 20) {
				color = "*CYAN*";
			}
			if (sum > 24) {
				color = "*YELLOW*";
			}
			if (sum > 27) {
				color = "*PINK*";
			}
			if (sum > 30) {
				color = "*RED*";
			}
			msg += "\n\n*GREEN*" + C.NAME + "*GREY*: " + color;
			for (let i = 0; i < hands[1].length; i++) {
				msg += hands[1][i] + " ";
			}
			msg += "*GREY*(*YELLOW*" + sum + "*GREY*)\n\n";
			
			if (game.held[0] && game.held[1]) {
				msg = "*GREY*Both players have held!\n\n";
				let better = rand(2);
				if (game.hands[1].length > game.hands[0].length) {
					better = 1;
				}
				if (game.hands[1].length < game.hands[0].length) {
					better = 0;
				}
				if (better == 0) {
					let bet = game.bet(C);
					msg = "*GREY*Clyde bets *YELLOW*" + bet + " gold*GREY*!\n\n";
					msg += "*GREY*What will you do?";
					this.responses.push("Match");
					this.responses.push("Fold");
				}
				else if (better == 1) {
					msg += "*CYAN*How much gold will you bet?";
					this.responses.push("Five");
					if (C.GOLD >= 10) {
						this.responses.push("Ten");
					}
					if (C.GOLD >= 15) {
						this.responses.push("Fifteen");
					}
					if (C.GOLD >= 20) {
						this.responses.push("Twenty");
					}
					if (C.GOLD >= 25) {
						this.responses.push("TwentyFive");
					}
				}
			}
			else {
				msg += "\n\n*CYAN*What will you do?";
				if (C.GOLD >= 1) {
					this.responses.push("BuyCard");
				}
				this.responses.push("Hold");
				this.responses.push("Fold");
			}
		}
		return msg;
	}));
	
	function finalBet(C, game, amount) {
		let msg = "";
		let sumOne = 0;
		let sumTwo = 0;
		
		if (game.match == 0 && game.fold(C, amount)) {
			C.DIALOGUE.STEP = null;
			C.GOLD += game.pot;
			return "*GREEN*Clyde folds!\n";
		}
		else {
			game.pot += 2 * amount;
			C.GOLD -= amount;
		}
			
		msg += "\n\n*YELLOW*Pot*GREY*: *YELLOW*" + game.pot;
		msg += "\n*YELLOW*Your Gold*GREY*: *YELLOW*" + C.GOLD;
		msg += "\n\n*RED*Clyde*GREY*: ";
		for (let i = 0; i < game.hands[0].length; i++) {
			msg += game.hands[0][i] + " ";
			sumOne += game.hands[0][i];
		}
		msg += "*YELLOW*  " + sumOne;
		msg += "\n\n*GREEN*" + C.NAME + "*GREY*: ";
		for (let i = 0; i < game.hands[1].length; i++) {
			msg += game.hands[1][i] + " ";
			sumTwo += game.hands[1][i];
		}
		msg += "*YELLOW*  " + sumTwo;
		msg += "\n\n";
		let tie = (sumOne == sumTwo);
		if (tie || sumOne > 30 && sumTwo > 30) {
			msg += "*YELLOW*It's a tie!\n";
			C.GOLD += Math.floor(game.pot/2);
		}
		else {
			let winner = 0;
			if ((sumTwo > sumOne && sumTwo < 30) || sumOne > 30) {
				winner = 1;
			}
			if (winner == 0) {
				msg += "*RED*Clyde takes the pot! You lose!\n";
			}
			else {
				msg += "*GREEN*You take the pot!\n";
				C.GOLD += game.pot;
			}
		}
		C.DIALOGUE.STEP = null;
		return msg;
	}
	
	steps.push(new Step("Clyde", "Match", "Match the bet", function(C) {
		return finalBet(C, C.DIALOGUE.DATA, C.DIALOGUE.DATA.match);
	}));
	
	steps.push(new Step("Clyde", "Five", "Five Gold", function(C) {
		return finalBet(C, C.DIALOGUE.DATA, 5);
	}));
	steps.push(new Step("Clyde", "Ten", "Ten Gold", function(C) {
		return finalBet(C, C.DIALOGUE.DATA, 10);
	}));
	steps.push(new Step("Clyde", "Fifteen", "Fifteen Gold", function(C) {
		return finalBet(C, C.DIALOGUE.DATA, 15);
	}));
	steps.push(new Step("Clyde", "Twenty", "Twenty Gold", function(C) {
		return finalBet(C, C.DIALOGUE.DATA, 20);
	}));
	steps.push(new Step("Clyde", "TwentyFive", "Twenty-Five Gold", function(C) {
		return finalBet(C, C.DIALOGUE.DATA, 25);
	}));
	
	steps.push(new Step("Clyde", "BuyCard", "Buy a card", function(C) {
		let game = C.DIALOGUE.DATA;
		game.hit(1);
		C.GOLD -= 1;
		C.DIALOGUE.STEP = findStep("Clyde", "BluffThirty");
		C.DIALOGUE.DATA = game;
		return "*YELLOW*You draw a card. . .\n";
	}));
	
	steps.push(new Step("Clyde", "Hold", "Hold", function(C) {
		let game = C.DIALOGUE.DATA;
		game.held[1] = true;
		C.DIALOGUE.STEP = findStep("Clyde", "BluffThirty");
		C.DIALOGUE.DATA = game;
		return "*YELLOW*You hold your cards. . .\n";
	}));
	
	steps.push(new Step("Clyde", "Fold", "Fold", function(C) {
		C.DIALOGUE.STEP = null;
		return "*RED*You give up . . .\n";
	}));
}

function initQarana() {
	
}

function initAsha() {
	//Greeting
	events.push(new Event("Asha", "AshaGreeting",
	function(C) {
		return !(C.DIALOGUE.EVENTS["AshaGreeting"]);
	},
	function(C) {
		C.DIALOGUE.EVENTS["AshaGreeting"] = true;
		let options = [
			"DisinterestedGreeting",
			"BasicGreeting",
			"BasicGreeting",
		];
		C.DIALOGUE.STEP = findStep("Asha", options[rand(options.length)]);
	}));
	
	//Encounter if she doesn't like you
	events.push(new Event("Asha", "RudeEncounter",
	function(C) {
		return (rand() % 5 == 0 && C.DIALOGUE.RELATIONS["Asha"] < 0);
	},
	function (C) {
		let options = [
		"*GREY*Asha's drinking, and looks at you as if she's annoyed, and ignores you.\n",
		"*GREY*Asha's drinking, and looks at you contemptuously, then tosses her drink at you with a laugh. Fortunately for you, most of the alcohol falls short of its mark. Penelope apologizes on Asha's behalf, and hands you a small towel.\n",
		];
		let ran = rand(options.length);
		if (ran == 1) {
			C.DIALOGUE.RELATIONS["Asha"] -= 2;
			C.DIALOGUE.RELATIONS["Penelope"] += 1;
		}
		C.DIALOGUE.RELATIONS["Asha"] -= 1;
		C.DIALOGUE.STEP = null;
		return options[ran];
	}));
	
	//Disinterested Greeting
	steps.push(new Step("Asha", "DisinterestedGreeting", "", function(C) {
		C.DIALOGUE.RELATIONS["Asha"] -= 2;
		C.DIALOGUE.STEP = null;
		return "*GREY*Asha seems tired, perhaps a bit sick. She barely acknowledges your greeting.\n\n";
	}));
	
	//Spider Story
	events.push(new Event("Asha", "SpiderStory",
	function(C) {
		if (C.DIALOGUE.EVENTS["AshaGreeting"] && !C.DIALOGUE.EVENTS["AshaSpiderStory"]) {
			if (rand(3) == 0 && C.DIALOGUE.RELATIONS["Asha"] >= 0) {
				return true;
			}
		}
		return false;
	},
	function(C) {
		let msg = "*GREY*Asha's slumped over a half-empty flagon and glass on the bar, and reels her head back joyously on hearing your voice, her face flushed.\n\n";
		let name = C.NAME.toLowerCase();
		name = name.split("s").join("sh");
		name = name.split("b").join("bl");
		name = name.split("t").join("th");
		name = name.split("ch").join("tr");
		name = name.split("d").join("j");
		msg += "*GREEN*" + P(name) + "! What a pretty name! Do you want to hear a story about a spider?\n";
		C.DIALOGUE.RELATIONS["Asha"] += 1;
		this.responses = ["spiderStoryOne", "spiderStoryTwo", "spiderStoryThree"];
	}));
	
	steps.push(new Step("Asha", "spiderStoryOne", "Sure", function(C) {
		let msg = "";
		msg += "*GREEN*Alright, I was walking in the woods the other day, just a little tipsy, *BLUE*the Wilted Woods*GREEN*, I mean, and suddenly my foot was caught in a giant web, and I fell.\n\n";
		msg += "*GREY*She taps her fingers rythmically on the bar, crawling her hand toward you like a spider.\n\n";
		msg += "*GREEN*A horrible skittering, and there it loomed, as big as a cow, glossy-eyed with venom dripping off its fangs. Did you know, that ichor will boil a bit before chitin will melt? Its back split open, erupting in beautiful black steam.\n\n";
		msg += "*GREY*She laughs, and turns her attention back to her drink.\n"
		C.DIALOGUE.RELATIONS["Asha"] += 1;
		C.DIALOGUE.STEP = null;
		return msg;
	}));
	
	steps.push(new Step("Asha", "spiderStoryTwo", "A spider?", function(C) {
		let msg = "*GREY*She laughs.\n\n*GREEN*Yeah a spider - a really, really big one.\n";
		this.responses = ["spiderStoryOne", "spiderStoryThree"];
		return msg;
	}));
	
	steps.push(new Step("Asha", "spiderStoryThree", "Not really", function(C) {
		let msg = "*GREEN*Alright. Your loss! It was a really good story, though.\n";
		C.DIALOGUE.RELATIONS["Asha"] -= 1;
		C.DIALOGUE.STEP = null;
		return msg;
	}));
	
	//Basic Greeting
	steps.push(new Step("Asha", "BasicGreeting", "", function(C) {
		let msg = "";
		if (C.LEVEL > 1) {
			let prefices = [
			"*GREEN*I was wondering when you were going to deign to speak to me, ",
			"*GREEN*I've seen you around before, "
			];
			msg += prefices[rand(prefices.length)] + Prettify(C.CLASS) + "*GREEN*.\n\n*GREY*She takes a swig from a bottle of hard cider.\n\n*GREEN*It's a pleasure.\n";
			this.responses = ["Likewise", "WhatDrink"];
		}
		else {
			msg += C.COLOR + C.NAME + "*GREEN*, huh? If you're still alive once I'm sober, buy me a drink, and we can have a chat. You'll probably have to tell me your name again, though.\n";
			C.DIALOGUE.RELATIONS["Asha"] += 1;
			C.DIALOGUE.STEP = null;
		}
		return msg;
	}));
	
	steps.push(new Step("Asha", "Likewise", "Likewise", function(C) {
		return "*GREY*Asha smiles politely and takes another drink.\n\n";
		C.DIALOGUE.STEP = null;
	}));
	
	steps.push(new Step("Asha", "WhatDrink", "What are you drinking?", function(C) {
		let msg = "";
		let brew = startItem("Penelope's Brew");
		let options = [
			"*GREEN*Water. What else would I be drinking?\n\n*GREY*She laughs.",
			"*GREEN*Milk. I want to grow up big and strong.\n\n*GREY*She laughs.",
			"*GREEN*Penelope's homemade brew. Do you want a taste? Here.\n\n*GREY*She slides you the bottle."
		];
		let ran = rand(3);
		if (!CanTake(C, brew)) {
			ran = rand(2);
		}
		if (ran == 2) {
			C.INVENTORY.push(brew);
			C.DIALOGUE.RELATIONS["Asha"] += 2;
		}
		C.DIALOGUE.RELATIONS["Asha"] += 1;
		C.DIALOGUE.STEP = null;
		return options[ran];
	}));
}

function initPenelope() {
	//Greeting
	events.push(new Event("Penelope", "PenelopeGreeting", 
	function(C) {
		return !(C.DIALOGUE.EVENTS["PenelopeGreeting"]);
	},
	function(C) {
		C.DIALOGUE.EVENTS["PenelopeGreeting"] = true;
		C.DIALOGUE.STEP = findStep("Penelope", "BasicGreeting");
	}));
	steps.push(new Step("Penelope", "BasicGreeting", "", function(C) {
		let msg = "";
		let dialogue = [
		"Oh! It's a pleasure to meet you. I'm Penelope, the keeper of this tavern. I hope you enjoy your stay in our village.\n",
		"Greetings, stranger. I'm Penelope, the propietor of this tavern. Rooms are five gold a night.\n"
		];
		msg = "*GREEN*" + dialogue[rand(dialogue.length)];
		msg += "\n*GREY*She gestures broadly to the tavern. *GREEN*What do you think of the place?\n";
		this.responses = ["Sty", "Alright", "Nice"];
		return msg;
	}));
	steps.push(new Step("Penelope", "Sty", "It's an ugly sty, but it's not like there's other options.", function(C) {
		let msg = "";
		let ran = rand(3);
		if (ran == 0) {
			msg += "*GREY*Penelope laughs genuinely.\n";
			msg += "*GREEN*Tell me what you really think. Enjoy your stay at this old sty.\n";
			C.DIALOGUE.RELATIONS["Penelope"] += 3;
		}
		else {
			C.DIALOGUE.RELATIONS["Asha"] -= 5;
			C.DIALOGUE.RELATIONS["Penelope"] -= 5;
			msg = "*GREY*Penelope scowls. Asha, who's sitting at the bar, seems annoyed as well.\n\n";
			msg += "*GREEN*It's always a pleasure to talk to customers.\n";
		}
		C.DIALOGUE.STEP = null;
		return msg;
	}));
	steps.push(new Step("Penelope", "Alright", "It's alright.", function(C) {
		C.DIALOGUE.STEP = null;
		return "*GREEN*If you give it some time, I'm sure you'll learn to love it here.\n";
	}));
	steps.push(new Step("Penelope", "Nice", "It's very nice. I'll probably be returning often.", function(C) {
		C.DIALOGUE.RELATIONS["Penelope"] += 3;
		C.DIALOGUE.STEP = null;
		return "*GREEN*That'd be wonderful! I look forward to talking to you more often.\n";;
	}));
}

function initFlorence() {
	
}

function initJanice() {
	
}

function initSarkana() {
	
}

function initTerat() {
	
}

function initElias() {
	
}

function initEvents() {
	//[Gout, Nestra, Minsiki, Tobin, Kobos, Clyde, Qarana, Asha, Penelope, Florence, Janice, Sarkana, Terat, Merchant, Elias];
	initGout();
	initNestra();
	initMinsiki();
	initTobin();
	initKobos();
	initClyde();
	initQarana();
	initAsha();
	initPenelope();
	initFlorence();
	initJanice();
	initSarkana();
	initTerat();
	initElias();
}

initEvents();
