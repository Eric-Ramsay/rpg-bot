/* 

Dialogue System overhaul - Improved relationship tracking and diversity + user input
 - Event system where each event has a custom trigger function (ie if relation > 50 and this event hasn't triggered and C recently defeated lich)
 - Then have custom function to process the event and user responses
  
*/

var events = [];

function Step(trigger, event){
	this.trigger = trigger; 	//String that tells what player response triggers this 
	this.event = event; 		//Code that runs when this step is triggered
	this.responses = [];		//Children of this step
}

function DialogueEvent(speaker, id) {
	this.id = id; 				//The name of the event
	this.speaker = speaker; 	//The speaker of the event
	this.index = ""; 			//What step are we on?
	this.condition = null;		//Condition function
	this.ignore = null;			//Code that runs when you ignore this event (ie leave)
	this.steps = [];			//A list of steps
	this.ended = false;			//Flag to prevent ignore code from running
}

var dialogues = [];

function initDialogue() {
	//Penelope Greeting
	let PenelopeGreeting = new DialogueEvent("Penelope", "PenelopeGreeting");
	
	var uglySty = new Step("It's an ugly sty, but it's not like there's other options.", function(C) {
		let msg = "";
		let ran = rand(4);
		if (ran == 0) {
			msg = "*GREY*Penelope laughs genuinely. *GREEN*Tell me what you really think why don't you. Enjoy your stay at this old sty.\n";
			C.DIALOGUE.RELATIONS["Penelope"] += 5;
		}
		else {
			C.DIALOGUE.RELATIONS["Asha"] -= 10;
			C.DIALOGUE.RELATIONS["Penelope"] -= 10;
			msg = "*GREY*Penelope scowls. Asha seems annoyed as well.*GREEN* It's always a pleasure to talk to customers.\n";
		}
		this.ended = true;
		return msg;
	});
	
	var alright = new Step("It's alright.", function(C) {
		this.ended = true;
		return "If you give it some time, I'm sure you'll learn to love it here.\n";
	});
	
	var veryNice = new Step("It's very nice. I'll probably be returning often.", function(C) {
		let msg = "That'd be wonderful. I look forward to talking to you more often.\n";
		C.DIALOGUE.RELATIONS["Penelope"] += 5;
		this.ended = true;
		return msg;
	});
	
	var acceptDrink = new Step("A drink sounds great, thanks.", function(C) {
		takeItem(C, COPY(findItem(items, "Penelope's Brew")));
		msg = "*GREY*Penelope hands you a drink with a slight smile.\n";
		this.ended = true;
		return msg;
	});
	
	var refuseDrink = new Step("Oh, no thank you.", function(C) {
		msg = "*GREY*Penelope seems slightly hurt.*GREEN*Oh, I guess you're busy. Another time, maybe?\n";
		C.DIALOGUE.RELATIONS["Penelope"]--;
		this.ended = true;
		return msg;
	});
	
	var lovely = new Step("It's as lovely as its keeper.", function(C) {
		let msg = "";
		let ran = rand(3);
		if (C.DIALOGUE.RELATIONS["Penelope"] >= 15) {
			ran = 0;
		}
		if (ran == 0) {
			C.DIALOGUE.RELATIONS["Penelope"] += 5;
			C.ROMANCE["Penelope"] = true;
			if (C.INVENTORY.length < 5 || (C.BACKPACK && C.INVENTORY.length < 15)) {
				msg = "*GREY*Penelope blushes . . .*GREEN*That's very kind of you. How about a drink? On the house, of course.\n";
				this.responses = [acceptDrink, refuseDrink];
			}
			else {
				msg = "*GREY*Penelope blushes . . .*GREEN*That's very kind of you. I'd offer you a drink, but I can see your hands are full.\n";
			}
		}
		else {
			C.DIALOGUE.RELATIONS["Penelope"] -= 5;
			msg = "*GREY*Penelope forces a smile and looks away. *GREEN*I'd better get back to cleaning the bar.\n";
			this.ended = true;
		}
		return msg;
	});
	
	var P_BasicGreeting = new Step("BasicGreeting", function(C) {
		let msg = "";
		let ran = rand(2);
		if (ran == 0) {
			msg = "*GREEN*Oh! It's a pleasure to meet you. I'm Penelope, the tavernkeeper. I hope you enjoy your stay in our village.\n";
		}
		if (ran == 1) {
			msg = "*GREEN*Greetings, stranger. I'm Penelope, the propietor of this tavern. Rooms are five gold a night.\n";
		}
		msg += "\nWhat do you think of the place?\n";
		this.responses = [uglySty, alright, veryNice, lovely];
		return msg;
	});
	
	var P_CharmedGreeting = new Step("CharmedGreeting", function(C) {
		C.DIALOGUE.RELATIONS["Penelope"] += 5;
		let msg = "";
		let ran = rand(2);
		if (ran == 0) {
			C.DIALOGUE.RELATIONS["Penelope"] += 10;
			msg = "It's so nice to finally meet you. I've heard so, so much about you.\n";
		}
		if (ran == 1) {
			msg = "Hey. I've seen you here before, I think. It's nice to finally make your acquaintance.\n";
		}
		msg += "\nSo, what are your thoughts on my tavern?\n";
		this.responses = [uglySty, alright, veryNice, lovely];
		return msg;
	});
	
	PenelopeGreeting.condition = function(C) {
		console.log("Evaluating condition . . .");
		console.log(C.DIALOGUE);
		let index = C.DIALOGUE.EVENTS.indexOf("PenelopeGreeting");
		console.log(index);
		if (C.DIALOGUE.EVENTS.indexOf("PenelopeGreeting") == -1) {
			return true;
		}
		return false;
	}
	
	PenelopeGreeting.init = function(C) {
		C.DIALOGUE.EVENTS.push("PenelopeGreeting");
		C.DIALOGUE.EVENT = this;
		if (C.LEVEL > 3) {
			C.DIALOGUE.STEP = P_CharmedGreeting;
		}
		else {
			C.DIALOGUE.STEP = P_BasicGreeting;
		}
		return C.DIALOGUE.STEP.event(C);
	}
	
	PenelopeGreeting.ignore = function(C) {
		let msg = "*RED*Penelope scoffs as you exit the tavern, clearly annoyed. . .\n";
		C.DIALOGUE.RELATIONS["Penelope"] -= 5;
		return msg;
	}
	
	dialogues.push(PenelopeGreeting);
}

initDialogue();