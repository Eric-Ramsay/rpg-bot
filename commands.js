function ListCommands(index) {
	let msg = "";
	msg += "--- Available Queries ---\n";
	if (index == -1) {
		msg += "*CYAN*!tutorial - Provides a list of commands to use when getting started.\n";
		msg += "*GREEN*!character CLASS NAME *GREY*- Creates a new Character. Name and Class are optional, or can be set as RANDOM.\n";
		msg += "*CYAN*!stats *GREY*- Describes what character stats do.\n";
		msg += "*GREEN*!equip ITEM *GREY*- Equips armor or a weapon.\n";
		msg += "*CYAN*!here *GREY*- Provides a description of where you are.\n";
		msg += "*GREEN*!leave *GREY*- Leaves a dungeon or building.\n";
		msg += "*CYAN*!go DIRECTION *GREY*- Travels in a direction. Can be used in combat to change rows.\n";
		msg += "*GREEN*!enter BUILDING *GREY*- Enters a building.\n";
		msg += "*CYAN*!trade *GREY*- Starts trading with a merchant.\n";
		msg += "*GREEN*!stop *GREY*- Stops Trading.\n";
		msg += "*CYAN*!buy ITEM *GREY*- Buys an item, provided you're trading.\n";
		msg += "*GREEN*!sell ITEM *GREY*- Sells an item, can be done from anywhere in town.\n";
		msg += "*CYAN*!delve *GREY*- Enter into a dungeon.\n";
		msg += "*GREEN*!spells *GREY*- Lists spells that you know.\n";
		msg += "*CYAN*!read SCROLL *GREY*- Reads a scroll and learns the spell it contains.\n";
		msg += "*GREEN*!rest *GREY*- You must be at the tavern. Spend 5 gold and restore all of your health.\n";
		msg += "*CYAN*!level STAT *GREY*- Increases the stat specified by 1. You must have SP to use.\n";
		msg += "*GREEN*!suicide *GREY*- Kills you.\n";
		msg += "*CYAN*!classes *GREY*- Lists the available classes.\n";
		msg += "*GREEN*!haircut DESCRIPTION *GREY*- You must be in the barbershop, allows you to set a description.\n";
		msg += "*CYAN*!fish *GREY*- You must be at a location with fish, with a fishing pole equipped. Fish can be eaten.\n";
		msg += "*GREEN*!retire *GREY*- Retire your character to the guild hall. They can be played later.\n";
		msg += "*CYAN*!play as NAME*GREY* - Play as any retired character.\n";
		msg += "*GREEN*!order [Item Name or Index] *GREY*- Moves an item to the bottom of your inventory.\n";
		msg += "*CYAN*!forget [Spell name or Index] *GREY*- Removes a spell from your list of known spells.\n";
		msg += "*GREEN*!name [Name] *GREY*- Renames your character.\n";
	}
	else {
		msg += "*GREEN*!cast SPELL on TARGET *GREY*- Casts a spell.\n\n";
		msg += "*CYAN*!attack TARGET with WEAPON *GREY*- Attacks an enemy.\n\n";
		msg += "*GREEN*!take ITEM *GREY*- Loots an item after combat.\n\n";
		msg += "*CYAN*!flee *GREY*- Flees from combat if you're on the bottom row. Costs 3 AP to attempt.\n\n";
		msg += "*GREEN*!start *GREY*- Start combat once you've entered a dungeon. No one will be able to join you after this.\n\n";
		msg += "*CYAN*!end *GREY*- Ends your turn.\n\n";
		msg += "*GREEN*!move LEFT/RIGHT *GREY*- Moves left or right a row. Costs 3 AP.\n\n";
		msg += "*CYAN*!drink POTION *GREY*- Drinks a potion.\n\n";
		msg += "*GREEN*!eat POTION *GREY*- Eats a fish.\n\n";
		msg += "*CYAN*!effects *GREY*- Lists effects on you.\n\n";
		msg += "*GREEN*!guard TARGET *GREY*- Costs 6 AP per turn. Guard a target on your row; redirecting damage they would taket to yourself.\n\n";
		msg += "*CYAN*!brace *GREY*- Costs 3 AP. You brace yourself, giving yourself a 50% chance to dodge the next damage that comes your way.\n\n";
	}

	return msg;
}

function CommandDescribe(words, C, battleIndex) {
	if (words[1] == "at") {
		words.splice(1, 1);
	}
	let index = -1;
	words = words.slice(1, words.length);
	let args = words.join(" ");
	if (words.length >= 3 && words[0] == "statue" && words[1] == "of") {
		args = words.slice(2, words.length).join(" ");
		let statues = data["town"].statues;
		for (const statue of statues) {
			if (statue.NAME.toLowerCase() == args) {
				let msg = "*GREEN*" + statue.NAME + "*GREY* the *BLUE*" + Prettify(statue.CLASS) + "\n*GREY*";
				if (statue.DESCRIPTION != "") {
					msg += statue.DESCRIPTION + "\n";
				}
				msg += "\n";
				msg += "*YELLOW*Gold Earned: " + statue.REPORT.gold + "\n";
				msg += "*CYAN*Damage Taken: " + statue.REPORT.taken + "\n";
				msg += "*GREEN*Damage Mitigated: " + statue.REPORT.mitigated + "\n";
				msg += "*PINK*Damage Dealt: " + statue.REPORT.damage + "\n";
				msg += "*RED*Kills: " + statue.REPORT.kills + "\n";
				msg += "\n*GREY*This statue was erected in honor of the slaying of the *RED*" + statue.DEATH;
				return msg;
			}
		}
		return "*RED*Couldn't find that statue.\n";
	}
	if (battleIndex > -1) {
		index = findItem(battles[battleIndex].loot, args);
		if (index > -1) {
			return ItemDescription(C, battles[battleIndex].loot[index]);
		}
	}
	index = findItem(C.INVENTORY, args);
	if (index >= 0) {
		return ItemDescription(C, C.INVENTORY[index]);
	}
	if (battleIndex > -1) {
		if (C.TRADING != "") {
			let NPC = null;
			for (let i = 0; i < people.length; i++) {
				if (people[i].NAME.toLowerCase() == C.TRADING.toLowerCase()) {
					NPC = people[i];
				}
			}
			if (NPC) {
				index = findItem(NPC.ITEMS, args);
				if (index > -1) {
					return ItemDescription(C, NPC.ITEMS[index]);
				}
			}
		}
		let battle = battles[battleIndex];
		let index = -1;
		if (args[0] == "e" || args[0] == "p") {
			index = parseInt(args.substring(1));
		}
		if (isNaN(index) || index <= 0 || index > Math.max(battle.allies.length, battle.enemies.length)) {
			index = findTarget(battle.enemies, args);
			if (index > -1 && index < battle.enemies.length) {
				return EnemyDescription(battle.enemies[index]);
			}
			index = findTarget(battle.allies, args);
			if (index > -1 && index < battle.allies.length) {
				return CharacterDescription(battle.allies[index]);
			}
		}
		else {
			if (args[0] == "p") {
				return CharacterDescription(battle.allies[index-1]);
			}
			if (args[0] == "e") {
				return EnemyDescription(battle.enemies[index-1]);
			}
		}
	}
	else {
		index = findItem(items, args, false, false);
		if (index >= 0) {
			return ItemDescription(C, items[index]);
		}
		let NPCList = [];
		let room;
		for (let i = 0; i < locations.length; i++) {
			if (locations[i].id.toLowerCase() == C.LOCATION.toLowerCase()) {
				room = locations[i];
				NPCList = room.people
			}
		}
		if (C.BUILDING != "") {
			let building = findBuilding(C.BUILDING);
			NPCList = building.people;
		}
		index = findPerson(NPCList, args);
		if (index > -1) {
			return CharacterDescription(NPCList[index]);
		}
		else {
			let player = findPlayer(args);
			if (player != null) {
				if (player.LOCATION == C.LOCATION && player.BUILDING == C.BUILDING) {
					return CharacterDescription(player);
				}
			}
		}
	}
	return "*RED*Unable to look at '" + args + "'";
}

function CommandStats(C) {
	let msg = "";
	if (C) {
		msg += DrawStats(C);
	}
	msg += "\n";
	msg += "*RED*VIT *GREY*- Vitality. Every point provides +10 Max HP.\n";
	msg += "*BLUE*END *GREY*- Endurance. Every point provides +15 Max Stamina.\n";
	msg += "*RED*DEX *GREY*- Dexterity. Every point provides +3 AP per turn.\n";
	msg += "*BLUE*MAG *GREY*- Magic. Every point lets you learn +2 spells and cast +1 spell.\n";
	msg += "*RED*WEP *GREY*- Weapons Handling. Every point provides +1 Max Weapon Damage & +5% Base Weapon Damage.\n";
	msg += "*BLUE*AVD *GREY*- Avoidance. Every point gives +10% chance to flee and +10% chance to dodge.\n";
	return msg;
}

function CommandDelve(C) {
	let msg = "";
	let location = findLocation(C.LOCATION);
	if (!location.dungeon) {
		return "*RED*You can't delve here!";
	}
	msg += C.NAME + " is *RED*delving*GREY* into *RED*" + location.id + "\n\n";
	let locationNames = ["The Haunted Crypts", "The Acrid Swamp", "The Wilted Woods", "The Stony Island"];
	console.log(location.id);
	let zone = locationNames.indexOf(location.id);
	let found = false;
	for (let i = 0; i < battles.length; i++) {
		if (battles[i].parent == location.id && !battles[i].started) {
			battles[i].allies.push(C);
			found = true;
		}
	}
	if (!found) {
		let battle = new Battle(location.id);
		battle.location = location.id;
		battle.zone = zone;
		battle.allies.push(C);
		battles.push(battle);
	}
	C.AP = MaxAP(C);
	C.ROW = 0;
	if (C.ROW_PREFERENCE) {
		C.ROW = C.ROW_PREFERENCE;
	}
	C.ENDED = false;
	msg += RoomDescription(C);

	return msg;
}

function CommandEquip(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let invIndex = findItem(C.INVENTORY, args, true);
	if (!isNaN(invIndex) && invIndex < C.INVENTORY.length && invIndex >= 0) {
		if (words[0] == "equip") {
			msg = Equip(C, invIndex);
		}
		else {
			msg = Dequip(C, invIndex);
		}
		msg += Inventory(C);
	}
	else {
		return "*RED*Unable to find item in inventory to equip.";
	}
	return msg;
}

function partialNameMatch(words, targets) {
	let word = "";
	for (let j = words.length - 1; j >= 0; j--) {
		if (word != "") {
			word = " " + word;
		}
		word = words[j] + word;
		for (let k = 0; k < targets.length; k++) {
			if (targets[k].NAME.toLowerCase() == word.toLowerCase()) {
				return [words.splice(0, j), k];
			}
		}
	}
	return [words, -1];
}

function CommandCast(words, C, index) {
	if (hasEffect(C, "stunned")) {
		return "*RED*You can't act while you're stunned!\n";
	}
	if (C.ENDED) {
		return "*RED*You can't act while your turn is ended!\n";
	}
	if (words.length == 1) {
		return "*RED*You must specify a spell name to cast.\n";
	}
	let battle = battles[index];
	if (!battle.started) {
		return "*RED*The battle must be started before you can cast spells!\n";
	}
	let staffEquipped = false;
	for (let i = 0; i < C.INVENTORY.length; i++) {
		if (C.INVENTORY[i].equipped) {
			if (C.INVENTORY[i].type == "staff") {
				staffEquipped = true;
				break;
			}
		}
	}
	if (!staffEquipped && C.CLASS != "sorcerer") {
		return "*RED*You must equip a wand, staff, or scepter to be able to cast magic.\n";
	}
	
	if (C.CASTS >= MaxCasts(C)) {
		return "*RED*You've already cast your maximum number of spells this turn.\n";
	}
	
	//Spell will be in the format [spellName] {{on/at/nothing}} [target]
	words = words.slice(1, words.length);
	let spellName = "";
	let checkStr = "";
	let count = 0;
	let spellIndex = findThing(C.SPELLS, words.join(" "));
	if (spellIndex == -1) {
		while (spellName == "" && count < words.length) {
			if (count > 0) {
				checkStr += " ";
			}
			checkStr += words[count];
			for (let i = 0; i < C.SPELLS.length; i++) {
				if (!(typeof C.SPELLS[i] === 'string')) {
					C.SPELLS[i] = C.SPELLS[i].name;
				}
				if (C.SPELLS[i].toLowerCase() == checkStr) {
					spellName = checkStr;
					break;
				}
			}
			count++;
		}
	}
	else {
		count = 1;
		spellName = C.SPELLS[spellIndex];
	}
	if (spellName == "") {
		return "*RED*You don't seem to know that spell. . .\n";
	}
	
	spellIndex = findSpell(spells, spellName);
	if (spellIndex == -1) {
		return "*RED*That spell is no longer in the game. . .\n";
	}
	spell = spells[spellIndex];
	
	words = words.slice(count, words.length);
	if (words[0] == "on" || words[0] == "at" || words[0] == "to" || words[0] == "in" || words[0] == "against") {
		words = words.slice(1, words.length);
	}
	
	let targets = [];
	let numTargets = spell.numAllies + spell.numEnemies + spell.numRows;
	
	if (numTargets > 0) {
		let i = words.length - 1;
		while (words.length > 0) {
			let num = parseInt(words[i].slice(1, words[i].length));
			if (isNaN(num)) {
				if (spell.numRows > 0) {
					return "*RED*Invalid target '" + words[i] + "'!\n";
				}
				let result;
				if (spell.numAllies > 0) {
					result = partialNameMatch(words, battle.allies);
				}
				else {
					result = partialNameMatch(words, battle.enemies);
				}
				if (result[1] == -1) {
					return "*RED*Target '" + words.join(" ") + "' not found in list of targets!\n";
				}
				words = result[0];
				i = words.length - 1;
				targets.push(result[1]);
			}
			else {
				let type = words[i][0];
				if (num < 1) {
					return "*RED*Invalid target '" + words[i] + "'!\n";
				}
				else if (type == "r" && spell.numRows > 0 && num < 6) {
					targets.push(num - 1);
				}
				else if (type == "p" && spell.numAllies > 0 && num <= battle.allies.length) {
					targets.push(num - 1);
				}
				else if (type == "e" && spell.numEnemies > 0 && num <= battle.enemies.length) {
					targets.push(num - 1);
				}
				else {
					return "*RED*Invalid target '" + words[i] + "'!\n";
				}
				words = words.slice(0, i--);
			}
		}
		if (numTargets < targets.length) {
			return "*RED*Too many targets selected!\n";
		}
	}

	if (numTargets > targets.length) {
		return "*RED*You need to specify " + numTargets + " target(s) to cast this spell.\n";
	}
	
	for (const target of targets) {
		if (spell.numAllies > 0) {
			if (Math.abs(battle.allies[target].ROW - C.ROW) >= spell.range) {
				return "*RED*" + Prettify(Name(battle.allies[target])) + " is too far away to target!\n";
			}
		}
		else if (spell.numEnemies > 0) {
			if (Math.abs(battle.enemies[target].ROW - C.ROW) >= spell.range) {
				return "*RED*" + Prettify(Name(battle.enemies[target])) + " is too far away to target!\n";
			}
		}
		else if (spell.numRows > 0) {
			if (Math.abs(target - C.ROW) >= spell.range) {
				return "*RED*R" + (target + 1) + " is too far away to target!\n";
			}
		}
	}
	
	return Cast(C, spell, battle.allies, battle.enemies, targets);
}

function CommandGuard(words, C, battleIndex) {
	let msg = "";
	let battle = battles[battleIndex];
	if (hasEffect(C, "stunned")) {
		return "*RED*You can't act while you're stunned!\n";
	}
	if (C.ENDED) {
		return "*RED*You can't act while your turn is ended!\n";
	}
	if (words.length == 1) {
		return "*RED*You must specify an ally to guard!\n";
	}
	if (!battle.started) {
		return "*RED*The battle must be started before you can guard an ally!\n";
	}
	let index = parseInt(words[1].slice(1, words[1].length));
	if (isNaN(index)) {
		let checkStr = "";
		let count = 0;
		do {
			words = words.slice(1, words.length);
			if (count > 0) {
				checkStr += " ";
			}
			checkStr += words[0];
			index = findTarget(battle.allies, checkStr);
		} while (index == -1 && ++count < words.length);
	}
	else {
		index--;
		words = words.slice(2, words.length);
	}
	if (index <= -1 || index >= battle.allies.length) {
		return "*RED*Couldn't find that ally!\n";
	}
	if (battle.allies[index].ROW != C.ROW) {
		return "*RED*You can only guard allies in the same row as you!\n";
	}
	if (battle.allies[index].ID == C.ID) {
		return "*RED*You can't guard yourself!\n";
	}
	let guard = hasEffect(C, "guarding");
	if (guard) {
		RemoveEffect(C, "guarding");
		msg += "*CYAN*You stop guarding " + Name(battle.allies[index]) + ".\n";
		if (guard.target.ID == battle.allies[index].ID) {
			return msg;
		}
	}
	AddEffect(C, "guarding", 999, null, battle.allies[index]);
	msg += "*CYAN*You guard your ally, " + Name(battle.allies[index]) + ".\n";
	return msg;
}

function CommandAttack(words, C, battleIndex) {
	let battle = battles[battleIndex];
	let msg = "";
	if (hasEffect(C, "stunned")) {
		return "*RED*You can't act while you're stunned!\n";
	}
	if (C.ENDED) {
		return "*RED*You can't act while your turn is ended!\n";
	}
	if (words.length == 1) {
		return "*RED*You must specify an enemy to attack.\n";
	}
	if (!battle.started) {
		return "*RED*The battle must be started before you can attack!\n";
	}
	let weapons = [null, null];
	let indices = [C.LEFT, C.RIGHT];
	console.log(indices);
	if (C.LEFT > -1 && C.LEFT < C.INVENTORY.length) {
		weapons[0] = C.INVENTORY[C.LEFT];
	}
	if (C.RIGHT > -1 && C.RIGHT < C.INVENTORY.length) {
		weapons[1] = C.INVENTORY[C.RIGHT];
	}
	if (weapons[0] == null && weapons[1] == null) {
		return "*RED*You must equip a weapon to be able to attack!\n";
	}
	if (C.AP < weapons[0].AP && C.AP < weapons[1].AP) {
		return "*RED*You don't have enough AP to attack with this weapon!\n";
	}
	
	//Find Target
	let index = parseInt(words[1].slice(1, words[1].length));
	if (isNaN(index)) {
		let checkStr = "";
		let count = 0;
		do {
			words = words.slice(1, words.length);
			if (count > 0) {
				checkStr += " ";
			}
			checkStr += words[0];
			index = findTarget(battle.enemies, checkStr);
		} while (index == -1 && ++count < words.length);
	}
	else {
		index--;
		words = words.slice(2, words.length);
	}
	if (index <= -1 || index >= battle.enemies.length) {
		return "*RED*Couldn't find that enemy!\n";
	}
	
	
	if (words[0] == "with" || words[0] == "using") {
		words = words.slice(1, words.length);
	}
	
	let weapon = 0;
	if (!(weapons[0])) {
		weapon = 1;
	}
	//Weapon is specified
	if (words.length > 0) {
		let weaponName = words.join(" ");
		if (weapons[0]) {
			if (weaponName == "left" || weaponName == "l" || weapons[0].name.toLowerCase() == weaponName) {
				weapon = 0;
			}
		}
		if (weapons[1]) {
			if (weaponName == "right" || weaponName == "r" || weapons[1].name.toLowerCase() == weaponName) {
				weapon = 1;
			}
		}
	}
	let range = Math.abs(battle.enemies[index].ROW - C.ROW);
	if (C.AP < weapons[weapon].AP || weapons[weapon].attacks[0] <= 0 || range >= weapons[weapon].range) {
		weapon = 1 - weapon;
	}
	if (C.AP < weapons[weapon].AP) {
		return "*RED*You don't have enough AP to use your weapon.\n";
	}
	if (weapons[weapon].attacks[0] <= 0) {
		return "*RED*Your weapon is out of attacks.\n";
	}
	if (range >= weapons[weapon].range) {
		return "*RED*That enemy is too far away to attack.\n";
	}
	
	msg = AllyAttack(battle, C, index, indices[weapon]);
	msg += HandleCombat(battle);
	
	return msg;
}

function CommandLeave(C, index) {
	let msg = "";
	if (C.BUILDING != "") {
		//msg += "You leave the *BLUE*" +Prettify(C.BUILDING)+"*GREY*.\n\n";
		C.BUILDING = "";
		C.TRADING = "";
		msg += RoomDescription(C);
	}
	else if (index > -1) {
		if (!battles[index].started) {
			let battle = battles[index];
			for (let a = battle.allies.length - 1; a >= 0; a--) {
				if (battle.allies[a].ID == C.ID) {
					battle.allies.splice(a, 1);
					break;
				}
			}
			msg += "You are no longer delving deeper. . .\n";
			msg += RoomDescription(C);
		}
	}
	else if (C.TRADING != "") {
		C.TRADING = "";
		msg += RoomDescription(C);
	}
	else {
		return "*RED*You're not in a building.*GREY*";
	}
	return msg;
}

function CommandHaircut(words, C) {
	words.splice(0, 1);
	let args = words.join(" ");
	if (args.length == 0) {
		return "*RED* Try !haircut [Description]";
	}
	if (args.length > 400) {
		return "*RED*Description was too long. (400 Character Limit)";
	}
	if (C.BUILDING.toLowerCase() != "barbershop") {
		return "*RED*You have to be at the barbershop to get a haircut.";
	}
	else if (C.GOLD < 15) {
		return "*RED*You don't have enough gold to get a haircut.";
	}
	C.DESCRIPTION = args;
	C.GOLD -= 15;
	return CharacterDescription(C);
}

function CommandTravel(words, C, index) {
	words.splice(0, 1);
	let combatMsg = "";
	let msg = "";
	let tryGo = false;
	if (index == -1) {
		tryGo = true;
	}
	let oldRoom;
	let newRoom;
	C.TRADING = "";
	if (index > -1) {
		if (hasEffect(C, "stunned")) {
			return "*RED*You can't act while you're stunned!\n";
		}
		if (battles[index].started && C.ENDED) {
			return "*RED*You can't act while your turn is ended!\n";
		}
		if (battles[index].started && hasEffect(C, "rooted")) {
			return "*RED*You're rooted and can't move!\n";
		}
		let direction = 1;
		if (words[0] == "left") {
			direction = -1;
		}
		else if (words[0] == "right") {
			direction = 1;
		}
		else if (words[0] == "to") {
			if (words[1][0].toLowerCase() == "r" && words[1].length == 2) {
				let num = parseInt(words[1][1]) - 1;
				if (num < 0 || num > 4) {
					return "*RED*You can't go to that row.\n";
				}
				direction = num - C.ROW;
				if (direction == 0) {
					return "*RED*You're already on that row.\n";
				}
			}
			else {
				tryGo = true;
			}
		}
		else {
			tryGo = true;
		}
		if (!tryGo) {
			if (C.ROW + direction >= 0 && C.ROW + direction <= 4) {
				let cost = Math.abs(direction) * 3;
				if (hasEffect(C, "slowed")) {
					cost += Math.abs(direction) * 3;
				}
				if (C.AP >= cost || !battles[index].started) {
					if (battles[index].started) {
						C.AP -= cost;
					}
					C.ROW += direction;
					for (let i = 0; i < Math.abs(direction); i++) {
						msg += C.NAME + " moves ";
						if (direction > 0) {
							msg += "*GREEN*right*GREY*.\n";
						}
						else {
							msg += "*GREEN*left*GREY*.\n";
						}
					}
				}
				else {
					return "*RED*You don't have the AP to move any farther.\n";
				}
			}
			else {
				return "*RED*You can't go any farther that way.\n";
			}
		}
	}
	if (tryGo && (index == -1 || !(battles[index].started))) {
		msg = "";
		if (C.BUILDING != "") {
			C.BUILDING = "";
		}
		if (words.length == 0) {
			return "";
		}
		
		if (words[0] == "to") {
			words.splice(0, 1);
			if (words[0] == "the") {
				words.splice(0, 1);
			}
		}
		let args = words.join(" ").toLowerCase();
		let altArgs = "the " + args;
		
		if (words[0].length <= 2) {
			words[0] = words[0].replace("s", "south");
			words[0] = words[0].replace("e", "east");
			words[0] = words[0].replace("n", "north");
			words[0] = words[0].replace("w", "west");
		}
		
		let room;
		let prosperity = data["town"].prosperity;
		for (let i = 0; i < locations.length; i++) {
			if (locations[i].id.toLowerCase() == C.LOCATION.toLowerCase()) {
				for (const connection of locations[i].connections) {
					if (words[0] == connection.direction) {
						for (let j = 0; j < locations.length; j++) {
							if (locations[j].id == connection.id) {
								if (prosperity < locations[j].prosperity) {
									return "*RED*The town isn't prosperous enough yet to travel to this location.";
								}
								if (locations[j].cost > C.GOLD) {
									return "*RED*You don't have enough gold to travel there.";
								}
								if (locations[j].cost > 0) {
									C.GOLD -= locations[j].cost;
									msg += "*GREY*You pay *YELLOW*" + locations[j].cost + " Gold*GREY*.\n";
								}
								Travel(C, locations[j], index);
								return "";
							}
						} 
					}
				}
			}
		}
		
		for (let i = 0; i < locations.length; i++) {
			let location = locations[i].id.toLowerCase();
			if (location == args || location == altArgs) {
				if (!locations[i].canTravelHere) {
					return "*RED*You can't go that way.\n";
				}
				if (prosperity < locations[i].prosperity) {
					return "*RED*The town isn't prosperous enough yet to travel to this location.";
				}
				if (locations[i].cost > C.GOLD) {
					return "*RED*You don't have enough gold to travel there.";
				}
				if (locations[i].cost > 0) {
					C.GOLD -= locations[i].cost;
					msg += "*GREY*You pay *YELLOW*" + locations[i].cost + " Gold*GREY*.\n";
				}
				Travel(C, locations[i], index);
				msg = "*GREEN*You travel to *BLUE*" + locations[i].id + "\n";
				return msg;
			}
			for (const building of locations[i].buildings) {
				let name = building.id.toLowerCase();	
				if (name == args || name == altArgs) {
					if (prosperity < locations[i].prosperity || prosperity < building.prosperity) {
						return "*RED*The town isn't prosperous enough yet to travel to this location.";
					}
					if (location != C.LOCATION.toLowerCase()) {
						if (locations[i].cost > C.GOLD) {
							return "*RED*You don't have enough gold to travel there.";
						}
						if (locations[i].cost > 0) {
							C.GOLD -= locations[i].cost;
							msg += "*GREY*You pay *YELLOW*" + locations[i].cost + " Gold*GREY*.\n";
						}
						Travel(C, locations[i], index);	
						msg = "*GREEN*You travel to *BLUE*" + locations[i].id + "*GREY* and enter the *GREEN*" + Prettify(name) + ".\n";
					}
					C.BUILDING = name;
					return msg;
				}
			}
		}
		return "*RED*You can't go that way.\n";
	}
	return msg;
}

function CommandFlee(C, index) {
	if (hasEffect(C, "stunned")) {
		return "*RED*You can't act while you're stunned!\n";
	}
	if (C.FLED) {
		return "*RED*You can only attempt to flee once per turn!\n";
	}
	let msg = "";
	let firstTurn = hasEffect(C, "coward's haste");
	let huntsman = hasRune(C, "huntsman");
	if (!firstTurn) {
		if (battles[index].level == 4) {
			return "*RED*You've delved too deep to flee. . .\n";
		}
		if (C.ENDED) {
			return "*RED*Your turn has already ended!\n";
		}
		if (hasEffect(C, "rooted")) {
			return "*RED*You're rooted and can't move!";
		}
		if (C.ROW != 0 && !huntsman) {
			return "*RED*You have to move to R1 before you can flee!\n";
		}
		if (C.AP < 3 && !huntsman) {
			return "*RED*You don't have enough AP to attempt fleeing. (3 Required).\n";
		}
	}
	if (!huntsman) {
		C.AP -= 3;
	}
	C.FLED = true;
	let ran = rand(10);
	if (!firstTurn && ran >= 5 + C.STATS[AVD]) {
		return "*RED*You fail to flee!\n";
	}
	let battle = battles[index];
	for (let a = battle.allies.length - 1; a >= 0; a--) {
		if (battle.allies[a].ID == C.ID) {
			battle.allies.splice(a, 1);
			break;
		}
	}
	msg = "*YELLOW*" + C.NAME + " flees from the battle!\n";
	return msg;
}

function CommandTake(words, C, index) {
	let msg = "";
	//Two Parts Expected: Item Index and # to take
	let args = words.slice(1, words.length).join(" ");
	let num = 1;
	if (words[words.length - 1][0] == "x") {
		num = parseInt(words[words.length-1].slice(1, words[words.length - 1].length));
		args = words.slice(1, words.length - 1).join(" ");
	}
	let invIndex = findItem(battles[index].loot, args);
	if (invIndex == -1) {
		return "*RED*Couldn't find item '" + args + "'\n";
	}
	if (invIndex >= battles[index].loot.length) {
		return "*RED*There aren't that many items here!\n";
	}
	msg += LootItem(C, battles[index], invIndex, num);
	return msg;	
}

function validName(str) {
	for (const c of str) {
		if (c != " " && c != "'" && c.toUpperCase() == c.toLowerCase()) {
			return false;
		}
	}
	return true;
}

function CommandCharacter(words, C, authorId) {
	let msg = "";
	if (words.length >= 2) {
		C.CLASS = words[1].toLowerCase();
		if (C.CLASS == "random") {
			C.CLASS = classes[rand(classes.length)];
		}
	}
	else {
		C.CLASS = classes[rand(classes.length)];
	}
	if (words.length >= 3) {
		words = words.slice(2, words.length);
		let word = words.join(" ");
		C.NAME = Prettify(word.substring(0, 18));
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].NAME.toLowerCase() == C.NAME.toLowerCase()) {
				C.NAME = genName(rand(2));
			}
		}
		if (C.NAME.toLowerCase() == "random") {
			C.NAME = genName(rand(2));
		}
	}
	else {
		C.NAME = genName(rand(2));
	}
	if (!validName(C.NAME)) {
		return "*RED*You can't name yourself that.\n";
	}
	if (!classes.includes(C.CLASS)) {
		success = false;
		return "*RED*Your class '" + C.CLASS + "' was invalid.\n";
	}
	else {
		C.GOLD = 25;
		if (C.CLASS == "rogue") {
			C.GOLD = 40;
			C.STATS[AVD] += 2;
			C.INVENTORY.push(startItem("dagger"));
			C.INVENTORY.push(startItem("dagger"));
			C.INVENTORY.push(startItem("plain cloak"));
			for (let i = 0; i < C.INVENTORY.length; i++) {
				let msg = Equip(C, i);
				//console.log(msg);
			}
		}
		if (C.CLASS == "warrior") {
			C.STATS[VIT]++;
			C.STATS[DEX]++
			C.INVENTORY.push(startItem("hatchet"));
			C.INVENTORY.push(startItem("buckler"));
			C.INVENTORY.push(startItem("leather cuirass"));
			
			for (let i = 0; i < C.INVENTORY.length; i++) {
				Equip(C, i);
			}
		}
		if (C.CLASS == "peasant") {
			C.STATS[END] += 2;
			C.STATS[VIT] += 2;
			C.GOLD = 0;
			C.INVENTORY.push(startItem("club"));
			for (let i = 0; i < C.INVENTORY.length; i++) {
				Equip(C, i);
			}
		}
		if (C.CLASS == "noble") {
			C.GOLD = 100;
			C.INVENTORY.push(startItem("scimitar"));
			C.INVENTORY.push(startItem("stylish shirt"));
			for (let i = 0; i < C.INVENTORY.length; i++) {
				Equip(C, i);
			}
		}
		if (C.CLASS == "ranger") {
			C.GOLD = 10;
			C.STATS[AVD] += 1;
			C.STATS[WEP] += 1;
			let ran = rand(4);
			if (ran == 0) {
				C.INVENTORY.push(startItem("staff sling"));
			}
			else if (ran == 1) {
				C.INVENTORY.push(startItem("crossbow"));
			}
			else if (ran == 2) {
				C.INVENTORY.push(startItem("longbow"));
			}
			else {
				C.INVENTORY.push(startItem("repeating crossbow"));
			}
			for (let i = 0; i < C.INVENTORY.length; i++) {
				Equip(C, i);
			}
		}
		if (C.CLASS == "sorcerer") {
			C.GOLD = 15;
			C.STATS[MAG] += 1;
			C.INVENTORY.push(startItem("quarterstaff"));
			C.INVENTORY.push(startItem("plain cloak"));
			for (let i = 0; i < C.INVENTORY.length; i++) {
				Equip(C, i);
			}
		}
		if (C.CLASS == "mage") {
			C.GOLD = 30;
			C.STATS[MAG] += 2;
			C.SPELLS.push("Arcane Strike");
			C.INVENTORY.push(startItem("wand"));
			for (let i = 0; i < C.INVENTORY.length; i++) {
				Equip(C, i);
			}
		}
		C.SP = 4;
		C.LEVEL = 1;
		C.HP = MaxHP(C);
		C.STAMINA = MaxStamina(C);
		C.LOCATION = "The Town Harbor";
		C.ID = authorId + C.NAME + C.CLASS + rand(100000);
		msg += CharacterDescription(C);
	}
	//console.log(C.NAME);
	return msg;
}

function CommandDrink(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let invIndex = findItem(C.INVENTORY, args);
	if (invIndex == -1) {
		return "*RED*Can't find item '" + args + "'";
	}
	if (hasEffect(C, "parched")) {
		return "*RED*You can't eat drink anything!\n";
	}
	if (C.INVENTORY[invIndex].type != "fish" && C.INVENTORY[invIndex].type != "potion" && C.INVENTORY[invIndex].type != "drink") {
		return "*RED*You can't eat or drink that.";
	}
	let name = C.INVENTORY[invIndex].name.toLowerCase();
	if (name == "health potion") {
		let amount = 10;
		msg += Heal(C, amount);
		msg += AddEffect(C, "health potion", 2);
	}
	if (name == "tears of a god") {
		msg += AddEffect(C, "invincible", 1);
	}
	if (name == "potion of wrath") {
		msg += AddEffect(C, "enraged", 2);
		msg += AddEffect(C, "vulnerable", 2);
	}
	if (C.INVENTORY[invIndex].type == "fish") {
		let ran = rand(40);
		if (ran == 0) {
			msg = "*RED*Disgusting! You feel something writhing in your mouth and see the fish was full of worms!\n";
			msg += AddEffect(targets[index], "Infested", 999, null, 3);
		}
		else {
			let dialogue = ["Delicious!", "Delectable!", "Scrumptious!", "Sumptuous!", "Delightful!"];
			msg += dialogue[rand(dialogue.length)] + " ";
			msg += Heal(C, C.INVENTORY[invIndex].value);
		}
	}
	if (name == "warp potion") {
		let spot = rand(locations.length);
		C.LOCATION = locations[spot].id;
		let index = BattleIndex(C.ID);
		if (index > -1) {
			if (battles[index].level == 4) {
				msg = "*RED*You drink the potion, but it has no effect!\n";
			}
			let battle = battles[index];
			for (let a = battle.allies.length - 1; a >= 0; a--) {
				if (battle.allies[a].ID == C.ID) {
					battle.allies.splice(a, 1);
					break;
				}
			}
		}
		msg = "*GREEN*You drink the bottle and in an instant you've returned to the town!\n\n";
		msg += RoomDescription(C);
		return msg;
	}
	if (name == "panacea") {
		if (hasEffect(C, "cursed")) {
			return "*RED*The panacea can't cleanse cursed effects!\n";
		}
		let debuffs = numDebuffs(C);
		if (debuffs == 0) {
			return "*RED*You don't have any debuffs!\n";
		}
		removeDebuffs(C);
		msg = "*GREEN*You're cleansed of your afflictions.\n";
	}
	if (name == "skill potion") {
		C.SP++;
		msg = "*GREEN*You feel as if your potential has increased . . .\n";
	}
	if (name == "haste potion") {
		C.AP += 6;
		msg = "*GREEN*You feel a rush of energy . . .\n";
	}
	if (name == "stamina potion") {
		let stamina = Math.min(50, MaxStamina(C) - C.STAMINA);
		msg = "*GREY*You drink the potion and gain *GREEN*" + stamina + " stamina*GREY*!\n"; 
		C.STAMINA += stamina;
	}
	if (name == "penelope's brew") {
		let ran = rand(4);
		if (ran == 0) {
			msg = "*RED*Nasty! It tastes like donkey piss!\n";
		}
		if (ran == 1) {
			msg = "*GREEN*It's not half bad. . .\n";
		}
		if (ran == 2) {
			msg = "*GREEN*It's quite an exceptional brew, especially for the price.\n";
		}
		if (ran == 3) {
			msg = "*GREEN*It is a truly remarkable brew, your respect for Penelope's brewing abilities has increased markedly.\n";
		}
	}
	if (name == "bottle of ash") {
		msg = "*RED*It's disgusting, and you choke on its contents!\n";
	}
	RemoveItem(C, invIndex);
	if (name == "mead") {
		return "*GREEN*It's quite good. It's sweet, but not sugary.\n";
	}
	if (name == "imperial wine") {
		return "*GREEN*The imperial wine takes you back to better days. It has you feeling sentimental.\n";
	}
	if (name == "northern wine") {
		C.HP = MaxHP(C);
		return "*GREEN*From a mountain vinyard across the sea, it passes your lips and from the first sip you feel as if you're floating. It is unparalleled. What bliss!\n";
	}
	return msg;
}

function CommandTalk(words, C) {
	let msg = "";
	let args = words.slice(1, words.length);
	if (args[0] == "to") {
		args = args.slice(1, args.length);
	}
	args = args.join(" ");
	let NPC = null;
	let building = findBuilding(C.BUILDING);
	if (building == null) {
		let location = findLocation(C.LOCATION);
		for (const person of location.people) {
			if (person.NAME.toLowerCase() == args.toLowerCase()) {
				NPC = person;
			}
		}
	}
	else {
		for (const person of building.people) {
			if (person.NAME.toLowerCase() == args.toLowerCase()) {
				NPC = person;
			}
		}
	}
	if (!NPC) {
		return "*RED*Can't find '" + args + "'\n";
	}
	console.log(dialogues);
	for (const dialogue of dialogues) {
		console.log("Checking Dialogue");
		console.log(dialogue);
		console.log(NPC.NAME);
		if (dialogue.speaker == NPC.NAME) {
			if (dialogue.condition(C)) {
				let msg = dialogue.init(C);
				let i = 1;
				for (const response of C.DIALOGUE.STEP.responses) {
					msg += "\n*BLACK*" + i++ + ") *YELLOW*" + response.trigger;
				}
				msg += "\n";
				return msg;
			}
		}
	}
	let color = "*GREEN*";
	if (NPC.MERCHANT) {
		color = "*YELLOW*";
	}
	if (NPC.INDEX >= NPC.CONVERSATIONS.length) {
		NPC.INDEX = 0;
	}
	msg += color + NPC.CONVERSATIONS[NPC.INDEX++];
	return msg;
}

function CommandTrade(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	C.TRADING = "";
	if (C.BUILDING == "") {
		for (let j = 0; j < locations.length; j++) {
			if (locations[j].id.toLowerCase() == C.LOCATION.toLowerCase()) {
				for (const NPC of locations[j].people) {
					if (NPC.MERCHANT && NPC.NAME.toLowerCase() == args) {
						C.TRADING = NPC.NAME;
					}
				}
			}
		}
	}
	else {
		let building;
		for (let j = 0; j < buildings.length; j++) {
			if (buildings[j].id.toLowerCase() == C.BUILDING.toLowerCase()) {
				building = buildings[j];
			}
		}
		for (let i = 0; i < building.people.length; i++) {
			if (building.people[i].MERCHANT && building.people[i].NAME.toLowerCase() == args) {
				C.TRADING = building.people[i].NAME;
			}
		}
	}
	if (C.TRADING == "") {
		return "*RED*Can't find merchant '" + args + "'\n";
	}
	msg += RoomDescription(C);
	return msg;
}

function CommandDrop(words, C, index) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let invIndex = findItem(C.INVENTORY, args, true);
	if (invIndex == -1 || invIndex > C.INVENTORY.length) {
		return "*RED*Can't find item '" + args + "'\n";
	}
	if (C.INVENTORY[invIndex].equipped) {
		return "*RED*Dequip this item before you drop it.\n";
	}
	battles[index].loot.push(C.INVENTORY[invIndex]);
	msg = "*YELLOW*You drop your " + C.INVENTORY[invIndex].name + "!\n";
	RemoveItem(C, invIndex);
	return msg;	
}

function CommandSell(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let location = findLocation(C.LOCATION);
	/*if (location.dungeon) {
		return "*RED*You must be in town to sell your items.\n";
	}*/
	let invIndex = findItem(C.INVENTORY, args, true);
	if (invIndex == -1 || invIndex > C.INVENTORY.length) {
		return "*RED*Can't find item '" + args + "'\n";
	}
	if (C.INVENTORY[invIndex].equipped) {
		return "*RED*Dequip this item before you sell it.\n";
	}

	let gold = C.INVENTORY[invIndex].value;
	if (C.INVENTORY[invIndex].type == "fish") {
		gold = 0;
	}
	if (C.INVENTORY[invIndex].type == "weapon" || C.INVENTORY[invIndex].type == "armor" || C.INVENTORY[invIndex].type == "staff") {
		for (let i = 0; i < C.INVENTORY[invIndex].runes.length; i++) {
			gold += C.INVENTORY[invIndex].runes[i].value;
		}
	}
	gold = Math.ceil(gold/2);
	C.GOLD += gold;
	C.REPORT.gold += gold;
	let itemName = C.INVENTORY[invIndex].name;
	RemoveItem(C, invIndex);
	return "*GREEN*You sell the " + itemName + " for *YELLOW*" + gold + " gold*GREEN*. You have *YELLOW*" + C.GOLD + " gold*GREEN*.\n";
}

function CommandBuy(words, C) {
	let msg = "";
	if (C.TRADING == "") {
		return "*RED*You must trade with a merchant first.";
	}
	let args = words.slice(1, words.length).join(" ");
	let NPC = null;
	for (let i = 0; i < people.length; i++) {
		if (people[i].NAME.toLowerCase() == C.TRADING.toLowerCase()) {
			NPC = people[i];
		}
	}
	if (NPC == null) {
		C.TRADING = "";
		return "*RED*Couldn't find merchant idk.\n";
	}
	let invIndex = findItem(NPC.ITEMS, args);
	if (invIndex == -1) {
		return "*RED*Can't find item '" + args + "'\n";
	}
	if (C.GOLD < NPC.ITEMS[invIndex].value) {
		return "*RED*You don't have enough gold to buy that.\n";
	}
	if (C.BACKPACK && NPC.ITEMS[invIndex].name.toLowerCase() == "backpack") {
		return "*RED*You already have a backpack.\n";
	}
	//Try to buy item
	if (CanTake(C, NPC.ITEMS[invIndex])) {
		takeItem(C, COPY(NPC.ITEMS[invIndex]));
		C.GOLD -= NPC.ITEMS[invIndex].value;
		
		data["town"].prosperity += NPC.ITEMS[invIndex].value;
		if (NPC.ITEMS[invIndex].type == "drink") {
			data["town"].prosperity += 2 * NPC.ITEMS[invIndex].value;
		}
		SaveState();
		
		let name = NPC.ITEMS[invIndex].name;
		if (NPC.ITEMS[invIndex].type == "rune") {
			name += " Rune";
		}
		return "*GREEN*You buy the *RED*" + name + "*GREEN* for *YELLOW*" + NPC.ITEMS[invIndex].value + " gold*GREEN*. You have *YELLOW*" + C.GOLD + " gold*GREEN* left.\n";
	}
	else {
		return "*RED*You don't have room in your inventory to buy that!\n";
	}
	return msg;
}

function hasSpell(C, spellName) {
	for (let j = 0; j < C.SPELLS.length; j++) {
		if (C.SPELLS[j].toLowerCase() == spellName.toLowerCase()) {
			return true;
		}
	}
	return false;
}

function CommandLearn(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	if (C.SPELLS.length >= 2 * C.STATS[MAG]) {
		return "*RED*You don't have enough spell slots!\n";
	}
	let spellList = [];
	for (const item of C.INVENTORY) {
		if (item.type == "spellbook") {
			let bookWords = item.name.toLowerCase().split(" ");
			let school = bookWords[bookWords.length - 1];
			for (let i = 0; i < spells.length; i++) {
				if (spells[i].school == school.toLowerCase()) {
					if (!hasSpell(C, spells[i].name)) {
						spellList.push(spells[i].name);
					}
				}
			}
		}
	}
	console.log(spellList);
	for (let i = 0; i < spellList.length; i++) {
		if (spellList[i].toLowerCase() == args) {
			C.SPELLS.push(spellList[i]);
			return "*GREEN*You learn the spell '*CYAN*" + Prettify(spellList[i]) + "*GREEN*'!\n";
		}
	}
	return "*RED*A spell named '" + args + "' wasn't in any spellbook in your possession!\n";
}

function CommandOrder(words, C) {
	let args = words.slice(1, words.length).join(" ");
	/*for (let i = 0; i < C.SPELLS.length; i++) {
		if (C.SPELLS[i].toLowerCase() == args) {
			C.SPELLS.push(C.SPELLS[i]);
			C.SPELLS.splice(i, 1);
			return DrawSpells(C, C.SPELLS);
		}
	}*/
	let index = findItem(C.INVENTORY, args);
	if (index > -1) {
		C.INVENTORY.push(C.INVENTORY[index]);
		C.INVENTORY.splice(index, 1);
		if (C.LEFT > index) {
			C.LEFT--;
		}
		else if (C.LEFT == index) {
			C.LEFT = C.INVENTORY.length - 1;
		}
		if (C.RIGHT > index) {
			C.RIGHT--;
		}
		else if (C.RIGHT == index) {
			C.RIGHT = C.INVENTORY.length - 1;
		}
		return "";
	}
	return "*RED*Couldn't find item '" + args + "'!\n";
}

function CommandRead(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let invIndex = findItem(C.INVENTORY, args);
	if (invIndex == -1) {
		return "*RED*Can't find scroll or book '" + args + "'\n";
	}
	if (C.INVENTORY[invIndex].type != "scroll" && C.INVENTORY[invIndex].type != "spellbook") {
		return "*RED*You can't read that.\n";
	}
	
	if (C.INVENTORY[invIndex].type == "spellbook") {
		let spellList = [];
		let bookWords = C.INVENTORY[invIndex].name.split(" ");
		let school = bookWords[bookWords.length - 1].toLowerCase();
		for (let i = 0; i < spells.length; i++) {
			if (spells[i].school == school) {
				if (!hasSpell(C, spells[i].name)) {
					spellList.push(spells[i].name);
				}
			}
		}
		if (spellList.length == 0) {
			return "*RED*You already know every spell this book has to offer.\n";
		}
		msg += "To learn one of these spells, type *PINK*!learn *BLACK*[*CYAN*Spell's Name*BLACK*]\n";
		msg += DrawSpells(C, spellList);
		return msg;
	}
	else {
		if (C.SPELLS.length >= 2 * C.STATS[MAG]) {
			return "*RED*You don't have enough spell slots!\n";
		}
		let scrollName = C.INVENTORY[invIndex].name.toLowerCase().split(" ");
		scrollName = scrollName.splice(1, scrollName.length).join(" ");
		let spellList = [];
		if (hasSpell(C, scrollName)) {
			return "*RED*You already know this spell.\n";
		}
		if (scrollName == "random") {
			let spellList = [];
			for (let i = 0; i < spells.length; i++) {
				if (!hasSpell(C, spells[i].name)) {
					spellList.push(spells[i].name);
				}
			}
			if (spellList.length == 0) {
				return "*RED*You already know every spell in the game! *GREEN*Go touch grass!\n";
			}
			let spell = spellList[rand(spellList.length)];
			C.SPELLS.push(spell);
			C.INVENTORY.splice(invIndex, 1);
			return "*GREEN*You learn the spell '*CYAN*" + Prettify(spell) + "*GREEN*'!\n";
		}
		C.SPELLS.push(Prettify(scrollName));
		C.INVENTORY.splice(invIndex, 1);
		return "*GREEN*You learn the spell '*CYAN*" + Prettify(scrollName) + "*GREEN*'!\n";
	}
}

function CommandSpells(C) {
	let msg = "*GREEN*" + C.NAME + "'s Known Spells *BLACK*| *PINK*" + C.SPELLS.length + "*GREY*/*PINK*" + 2*C.STATS[MAG] + "\n\n";	
	return msg + DrawSpells(C, C.SPELLS);
}

function CommandEnchant(words, C) {
	let msg = "";
	let args = words.slice(1, words.length);
	let split = args.join(" ").split(" with ");
	if (split.length == 1) {
		split = args.join(" ").split(" to ");
	}
	if (split.length == 2) {
		let i = findItem(C.INVENTORY, split[0])
		let r = findItem(C.INVENTORY, split[1]);
		if (i == -1 || i >= C.INVENTORY.length) {
			return "*RED*Can't find item '" + split[0] + "'";
		}
		if (r == -1 || r >= C.INVENTORY.length) {
			return "*RED*Can't find rune '" + split[1] + "'";
		}
		let rune = C.INVENTORY[r];
		let item = C.INVENTORY[i];
		if (rune.type != "rune" || (rune.target != item.type && rune.target != "any")) {
			return "*RED*Invalid Enchantment.\n";
		}
		if (item.runes.length >= maxRunes(item)) {
			return "*RED*This item already has its max enchantments.\n";
		}
		if (item.type != "armor" && item.type != "weapon" && item.type != "staff") {
			return "*RED*This item can not be enchanted!";
		}
		for (const usedRune of item.runes) {
			if (usedRune.name.toLowerCase() == rune.name.toLowerCase()) {
				return "*RED*This item has already been enchanted with that rune.\n";
			}
		}
		if (rune.name.toLowerCase() == "invigorant") {
			C.INVENTORY[i].attacks[1]++;
		}
		if (rune.name.toLowerCase() == "orisha") {
			C.INVENTORY[i].pen = Math.min(100, C.INVENTORY[i].pen + 30);
		}
		if (rune.name.toLowerCase() == "reach") {
			if (C.INVENTORY[i].range >= 5) {
				return "*RED*This item's range can not be increased further!\n";
			}
			C.INVENTORY[i].range += 2;
		}
		if (rune.name.toLowerCase() == "density") {
			C.INVENTORY[i].min += 8;
			C.INVENTORY[i].max += 8;
			C.INVENTORY[i].AP += 3;
		}
		if (rune.name.toLowerCase() == "precise") {
			C.INVENTORY[i].min += 3;
			C.INVENTORY[i].max += 3;
		}
		if (rune.name.toLowerCase() == "accurate") {
			C.INVENTORY[i].chance = Math.min(100, C.INVENTORY[i].chance+15);
			C.INVENTORY[i].min += C.INVENTORY[i].hands;
			C.INVENTORY[i].max += C.INVENTORY[i].hands;
		}
		if (rune.name.toLowerCase() == "impervious") {
			C.INVENTORY[i].armor[0] += 3;
			C.INVENTORY[i].armor[1] += 3;
		}
		C.INVENTORY[i].runes.push(rune);
		RemoveItem(C, r);
		msg = "*GREEN*You enchant the " + item.name + " with the Rune: *BLUE*" + rune.name + "*GREEN*!\n";
	}
	else {
		return "*RED*Invalid Enchantment.\n";
	}
	return msg;
}

function CommandFish(C, message) {
	let msg = "";
	if (C.INVENTORY.length >= 5 && !(C.BACKPACK || C.INVENTORY.LENGTH >= 15)) {
		return "*RED*You need to clear up some inventory space to be able to fish.\n";
	}
	let event = data[message.author.id].CATCH;
	if (C.FISH.length >= numFish && C.FISH_REWARDS.indexOf("Tackle Box") == -1) {
		C.FISH_REWARDS.push("Tackle Box");
		C.INVENTORY.push(new Rune("Tackle Box", 200, "any", "Gain +3 Rune Slots. You can enchant any item with this."));
		data[message.author.id].CATCH.valid = false;
		return "*CYAN*Congratulations! You've caught every fish! A runic reward has been added into your inventory. . .\n\n";
	}
	if (event && event.valid) {
		return "*RED*You're already fishing!\n";
	}
	let location = findLocation(C.LOCATION);
	let poleTier = GetPoleTier(C);
	if (poleTier == 0) {
		return "*RED*You need to equip a fishing pole to be able to fish!\n";
	}
	if (location.fish.length == 0) {
		return "*RED*You can't fish here!";
	}
	msg += "*GREEN*You cast your line far out into the water, hoping that something will bite. . .\n";
	let delay = ((10 - poleTier) + rand(5) + rand((8 - poleTier) * 2));
	let date = new Date();
	date.setSeconds(date.getSeconds() + delay);
	data[message.author.id].CATCH = new FishEvent(location.fish[rand(location.fish.length)], date, C.LOCATION);
	if (delay > 12) {
		let ran = rand(4);
		let idle = "*YELLOW*The water seems still. . .";
		if (ran == 0) {
			idle = "*YELLOW*A cool breeze passes over the water, dipping ripples into its mirrored surface. . .";
		}
		if (ran == 1) {
			idle = "*YELLOW*You start to zone out. . .";
		}
		if (ran == 2) {
			idle = "*YELLOW*You feel at peace. . .";
		}
		if (ran == 3) {
			idle = "*YELLOW*Was that a bite? Nevermind, it was nothing. . .";
		}
		setTimeout(() => {
			if (data[message.author.id].CATCH.valid) {
				if (C.LOCATION == data[message.author.id].CATCH.location && C.BUILDING == "") {
					PrintMessage(parseText(idle), message.channel);
				}
				else {
					data[message.author.id].CATCH.valid = false;
				}
			}
		}, 8000 + (rand(5) * 1000));
	}
	setTimeout(() => {
		if (data[message.author.id].CATCH.valid) {
			let startDate = new Date(data[message.author.id].CATCH.date);
			let date = new Date();
			let seconds = (date.getTime() - startDate.getTime()) / 1000;
			if (seconds >= 0) {
				if (C.LOCATION == data[message.author.id].CATCH.location && C.BUILDING == "") {
					PrintMessage(parseText("*GREEN*You feel a bite! *CYAN*Reel!"), message.channel);
				}
				else {
					data[message.author.id].CATCH.valid = false;
				}
			}
		}
	}, delay * 1000);
	return msg;
}

function CommandReel(C, message) {
	let msg = "";
	let location = findLocation(C.LOCATION);
	let poleTier = GetPoleTier(C);
	if (poleTier == 0) {
		return "*RED*You need to equip a fishing pole to be able to reel!\n";
	}
	if (location.fish.length == 0) {
		return "*RED*You can't fish here!";
	}
	if (!data[message.author.id].CATCH) {
		return "*RED*Try !fish";
	}
	let event = data[message.author.id].CATCH;
	if (event && event.valid && C.BUILDING == "" && C.LOCATION == event.location) {
		let startDate = new Date(data[message.author.id].CATCH.date);
		let delay = 3 + rand(10 - poleTier);
		let date = new Date();
		let seconds = (date.getTime() - startDate.getTime()) / 1000;
		let threshold = 2 + .5 * rand(3);
		if (seconds > 0 && seconds < threshold) {
			if (data[message.author.id].CATCH.caught) {
				data[message.author.id].CATCH.valid = false;
				let fish = event.fish;
				msg += "*GREEN*You caught a fish! *GREY*It's " + an(fish.name) + " *YELLOW*" + fish.name + "*GREY*!\n";
				if (fish.value * 4 > poleTier * 8) {
					if (8 - (2 * poleTier) > rand(14)) {
						return "*RED*Your line breaks! The " + fish.name + " gets away!\n";
					}
				}
				msg += ItemDescription(C, fish) + "\n";
				if (!CanTake(C, fish)) {
					return "*RED*You don't have room in your inventory for the fish! It gets away!\n";
				}
				let fishing_drops = ["Coral Axe", "Swordfish Spear", "Eel Shield", "Fishnet Stockings", "Haunted Hookscale", "Drowned Armor", "Anchor Armor", "Coral Staff"];
				let newDrops = [];
				for (let i = 0; i < fishing_drops.length; i++) {
					if (C.FISH_REWARDS.indexOf(fishing_drops[i]) == -1) {
						newDrops.push(fishing_drops[i]);
					}
				}
				fishing_drops = newDrops;
				console.log(fishing_drops);
				let ranDrop = rand(15);
				console.log(fishing_drops.length);
				console.log(ranDrop);
				if (!C.FISH.includes(fish.name)) {
					C.FISH.push(fish.name);
					msg += "*CYAN*You've never caught this type of fish before! There are " + (numFish - C.FISH.length) + " more types of fish to catch!\n";
				}
				if (fishing_drops.length > 0 && ranDrop == 0) {
					let reward = startItem(fishing_drops[rand(fishing_drops.length)]);
					console.log(reward);
					msg += "*YELLOW*Wait, there's something else on the line. . . The fish gets away, but you found " + reward.name + "!\n";
					C.FISH_REWARDS.push(reward.name);
					C.INVENTORY.push(reward);
				}
				else {
					C.INVENTORY.push(fish);
				}
			}
			else {
				msg += "*GREEN*You reel your line in a little. Wait for the next bite!\n";
				date.setSeconds(date.getSeconds() + delay);
				let ran = rand(1 + Math.max(0, Math.floor((event.fish.value - 3 * poleTier)/8)));
				if (ran == 0) {
					data[message.author.id].CATCH = new FishEvent(event.fish, date, C.LOCATION, true);
					setTimeout(() => {
						if (data[message.author.id].CATCH.valid) {
							PrintMessage(parseText("*GREEN*You've hooked the fish! *CYAN*Reel!"), message.channel);
						}
					}, delay * 1000);	
				}
				else {
					data[message.author.id].CATCH = new FishEvent(event.fish, date, C.LOCATION);
					setTimeout(() => {
						if (data[message.author.id].CATCH.valid) {
							PrintMessage(parseText("*GREEN*You feel a bite! *CYAN*Reel!"), message.channel);
						}
					}, delay * 1000);	
				}
			}
		}
		else if (seconds < 0) {
			data[message.author.id].CATCH.valid = false;
			return "*RED*Your empty hook rises out of the water, you've reeled your line all the way in.";
		}
		else {
			data[message.author.id].CATCH.valid = false;
			return "*RED*You were too slow; The fish got away. . .";
		}
	}
	else {
		data[message.author.id].CATCH.valid = false;
		return "*RED*Try !fish";
	}
	return msg;
}