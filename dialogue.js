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

function ProcessDialogue(C) {
	let speaker = C.DIALOGUE.STEP.speaker;
	let msg = "*PINK*Conversation with " + speaker + "\n\n";
	let relations = COPY(C.DIALOGUE.RELATIONS);
	msg += C.DIALOGUE.STEP.event(C);
	
	let relationChange = false;
	
	for (const key of Object.keys(relations)) {
		if (C.DIALOGUE.RELATIONS[key] > relations[key]) {
			msg += "\n*GREY*Your relation with " + key + " has improved.";
			relationChange = true;
		}
		else if (C.DIALOGUE.RELATIONS[key] < relations[key]) {
			msg += "\n*GREY*Your relation with " + key + " has worsened.";
			relationChange = true;
		}
	}
	
	if (relationChange) {
		msg += "\n";
	}
	
	if (C.DIALOGUE.STEP == null) {
		msg += "\n*BLACK*You end your conversation with " + speaker + ". . .\n"; 
	}
	
	return msg;
}

function Tag(step, textColor = "GREEN") {
	return "*GREY*" + step.speaker + ": *" + textColor + "*"
}

function initEvents() {
	events.push(new Event("Penelope", "PenelopeGreeting", 
	function(C) {
		if (C.DIALOGUE.EVENTS["PenelopeGreeting"]) {
			return false;
		}
		return true;
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

initEvents();
