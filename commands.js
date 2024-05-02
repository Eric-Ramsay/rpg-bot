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
		msg += "*CYAN*!fish *GREY*- You must be at a location with fish, with a fishing pole equipped.\n";
		msg += "*GREEN*!retire *GREY*- Retire your character to the guild hall. They can be played later.\n";
		msg += "*CYAN*!play as NAME*GREY* - Play as any retired character.\n";
	}
	else {
		msg += "*GREEN*!cast SPELL on TARGET *GREY*- Casts a spell.\n";
		msg += "*CYAN*!attack TARGET with WEAPON *GREY*- Attacks an enemy.\n";
		msg += "*GREEN*!take ITEM *GREY*- Loots an item after combat.\n";
		msg += "*CYAN*!flee *GREY*- Flees from combat if you're on the bottom row. Costs 3 AP to attempt.\n";
		msg += "*GREEN*!start *GREY*- Start combat once you've entered a dungeon. No one will be able to join you after this.\n";
		msg += "*CYAN*!end *GREY*- Ends your turn.\n";
		msg += "*GREEN*!move LEFT/RIGHT *GREY*- Moves left or right a row. Costs 3 AP.\n";
		msg += "*CYAN*!drink POTION *GREY*- Drinks a potion.\n";
		msg += "*GREEN*!effects *GREY*- Lists effects on you.\n";
		msg += "*CYAN*!push TARGET*GREY*- Pushes an enemy back. You must have a polearm to use.\n";
	}

	return msg;
}

function CommandDescribe(words, C, battleIndex) {
	if (words[1] == "at") {
		words.splice(1, 1);
	}
	let args = words.slice(1, words.length).join(" ");
	let index = findItem(C.INVENTORY, args);
	if (index >= 0) {
		return ItemDescription(C, C.INVENTORY[index]);
	}
	else {
		let index = findItem(items, args);
		for (let i = 0; i < items.length; i++) {
			if (items[i].name.toLowerCase() == args) {
				return ItemDescription(C, items[i]);
			}
		}
		if (battleIndex > -1) {
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
	}
	return "*RED*Unable to look at '" + args + "'";
}

function CommandStats(C) {
	let msg = "";
	if (C) {
		msg += writeStats(C);
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
		battle.zone = zone;
		battle.allies.push(C);
		battles.push(battle);
	}
	C.AP = MaxAP(C);
	C.ROW = 0;
	C.ENDED = false;
	msg += RoomDescription(C);

	return msg;
}

function CommandEquip(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let invIndex = findItem(C.INVENTORY, args);
	if (!isNaN(invIndex) && invIndex < C.INVENTORY.length && invIndex >= 0) {
		if (words[0] == "equip") {
			msg = Equip(C, invIndex);
		}
		else {
			msg = Dequip(C, invIndex);
		}
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
	if (!staffEquipped) {
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


function CommandAttack(words, C, index, isPushing = false) {
	if (C.ENDED) {
		return "*RED*You can't act while your turn is ended!\n";
	}
	let msg = "";
	let weaponIndex = -1;
	let args = words.slice(1, words.length);
	let split = args.join(" ").split(" with ");
	let weapon = "";
	let target = "";
	let isDead = false;
	if (split.length > 0) {
		target = split[0];
		weapon = split[1];
	}
	else {
		target = args.slice(0, args.length - 1).join(" ");
	}
	let enemyIndex = -1;
	if (target.length == 2 && target[0] == "e") {
		enemyIndex = parseInt(target[1]) - 1;
	}
	else {
		for (let i = 0; i < battles[index].enemies.length; i++) {
			if (battles[index].enemies[i].NAME.toLowerCase() == target) {
				if (battles[index].enemies[i].HP > 0) {
					enemyIndex = i;
				}
				else {
					isDead = true;
				}
			}

		}
	}
	if (!isNaN(enemyIndex) && enemyIndex >= 0 && enemyIndex < battles[index].enemies.length) {
		let range = Math.abs(battles[index].enemies[enemyIndex].ROW - C.ROW);
		if (battles[index].enemies[enemyIndex].HP > 0) {
			//Manually Select Weapon
			if (C.LEFT > -1 && C.LEFT < C.INVENTORY.length && (weapon == C.INVENTORY[C.LEFT].name.toLowerCase() || weapon == "left" || weapon == "l")) {
				weaponIndex = C.LEFT;
			}
			if (C.RIGHT > -1 && C.LEFT < C.INVENTORY.length && (weapon == C.INVENTORY[C.RIGHT].name.toLowerCase() || weapon == "right" || weapon == "r")) {
				let ran = rand(2);
				if (ran == 0) {
					weaponIndex = C.RIGHT;
				}
			}
			if (isPushing) {
				weaponIndex = C.LEFT;
			}
			//Auto Select Weapon
			if (weaponIndex == -1) {
				if (C.LEFT > -1 && C.RIGHT == -1) {
					weaponIndex = C.LEFT;
				}
				if (C.RIGHT > -1 && C.LEFT == -1) {
					weaponIndex = C.RIGHT;
				}
				if (C.LEFT > -1 && C.RIGHT > -1) {
					if (CanUseWeapon(C, C.LEFT, range)) {
						weaponIndex = C.LEFT;
					}
					if (CanUseWeapon(C, C.RIGHT, range)) {
						let ran = rand(2);
						if (ran == 0 || weaponIndex == -1) {
							weaponIndex = C.RIGHT;
						}
					}
				}
			}
			if (weaponIndex == -1) {
				let atks = 0;
				for (const item of C.INVENTORY) {
					if (item.type == "weapon") {
						if (item.equipped) {
							atks += item.attacks[0];
						}
					}
				}
				if (atks == 0) {
					return "*RED*Your weapons don't have any attacks left!\n";
				}
				return "*RED*You don't have a valid weapon to attack with!\n";
			}
			if ((isPushing && C.AP < 3) || (!isPushing && C.AP < (C.INVENTORY[weaponIndex].AP + APCost(C)))) {
				return "*RED*You don't have enough AP to attack with this weapon.\n";
			}
			if (range > C.INVENTORY[weaponIndex].range) {
				return "*RED*The enemy is too far away to attack with this weapon.\n";
			}
			if (!isPushing && !CanUseWeapon(C, weaponIndex)) {
				if (C.INVENTORY[weaponIndex].attacks[0] == 0) {
					return "*RED*This weapon can't attack again this turn.\n";
				}
				return "*RED*You don't have enough ammunition to use this weapon.\n";
			}
			if (isPushing && C.INVENTORY[weaponIndex].subclass == "polearm") {
				msg = PushTarget(C, battles[index].enemies[enemyIndex]);
				C.AP -= 3;
			}
			else {
				msg = AllyAttack(battles[index], C, enemyIndex, weaponIndex);
				msg += HandleCombat(battles[index]);
			}
		}
		else {
			isDead = true;
		}
	}
	else {
		if (isDead) {
			return "*RED*This enemy is already dead.\n";
		}
		else {
			return "*RED*Unable to find enemy '" + target + "'\n";
		}
	}
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
		if (C.ENDED) {
			return "*RED*You can't act while your turn is ended!\n";
		}
		if (battles[index].started && hasEffect(C, "rooted")) {
			return "*RED*You're rooted and can't move!";
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
				let cost = Math.abs(direction) * (3 + APCost(C));
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
	let msg = "";
	let firstTurn = hasEffect(C, "coward's haste");
	if (!firstTurn) {
		if (C.ENDED) {
			return "*RED*Your turn has already ended!\n";
		}
		if (hasEffect(C, "rooted")) {
			return "*RED*You're rooted and can't move!";
		}
		if (C.ROW != 0) {
			return "*RED*You have to move to R1 before you can flee!\n";
		}
		if (C.AP < (3 + APCost(C))) {
			return "*RED*You don't have enough AP to attempt fleeing. (3 Required).\n";
		}
	}
	C.AP -= (3 + APCost(C));
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
	if (!classes.includes(C.CLASS)) {
		success = false;
		return "Error. Your class was invalid.\n";
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
			C.GOLD = 150;
			C.INVENTORY.push(startItem("scimitar"));
			C.INVENTORY.push(startItem("stylish shirt"));
			for (let i = 0; i < C.INVENTORY.length; i++) {
				Equip(C, i);
			}
		}
		if (C.CLASS == "ranger") {
			C.STATS[AVD] += 1;
			C.STATS[WEP] += 1;
			let ran = rand(3);
			if (ran == 0) {
				C.INVENTORY.push(startItem("sling"));
			}
			else if (ran == 1) {
				C.INVENTORY.push(startItem("crossbow"));
			}
			else {
				C.INVENTORY.push(startItem("hunting bow"));
			}
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
	if (C.ENDED) {
		return "*RED*You can't act while your turn is ended!\n";
	}
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let invIndex = findItem(C.INVENTORY, args);
	if (invIndex == -1) {
		return "*RED*Can't find item '" + args + "'";
	}
	if (C.INVENTORY[invIndex].type != "potion" && C.INVENTORY[invIndex].type != "drink") {
		return "*RED*You can't drink that.";
	}
	let name = C.INVENTORY[invIndex].name.toLowerCase();
	if (name == "health potion") {
		let amount = 30;
		if (hasRune(C, "vine")) {
			amount = 20;
		}
		msg += Heal(C, amount);
	}
	if (name == "Panacea") {
		for (let j = allies[i].EFFECTS.length - 1; j >= 0; j--) {
			if (allies[i].EFFECTS[j].type == "debuff") {
				allies[i].EFFECTS.splice(j, 1);				
			}
		}
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
	if (location.dungeon) {
		return "*RED*You must be in town to sell your items.\n";
	}
	let invIndex = findItem(C.INVENTORY, args, true);
	if (invIndex == -1 || invIndex > C.INVENTORY.length) {
		return "*RED*Can't find item '" + args + "'\n";
	}
	if (C.INVENTORY[invIndex].equipped) {
		return "*RED*Dequip this item before you sell it.\n";
	}

	let gold = C.INVENTORY[invIndex].value;
	if (C.INVENTORY[invIndex].type == "weapon" || C.INVENTORY[invIndex].type == "armor" || C.INVENTORY[invIndex].type == "staff") {
		for (let i = 0; i < C.INVENTORY[invIndex].runes.length; i++) {
			gold += C.INVENTORY[invIndex].runes[i].value;
		}
	}
	gold = Math.ceil(gold/2);
	C.GOLD += gold;
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
	if (C.CLASS != "mage") {
		return "*RED*Only mages can learn spells from spellbooks!\n";
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
			return "*GREEN*You learn the spell '*CYAN*" + spellList[i] + "*GREEN*'!\n";
		}
	}
	return "*RED*A spell named '" + args + "' wasn't in any spellbook in your possession!\n";
}

function CommandOrder(words, C) {
	let args = words.slice(1, words.length).join(" ");
	for (let i = 0; i < C.SPELLS.length; i++) {
		if (C.SPELLS[i].toLowerCase() == args) {
			C.SPELLS.push(C.SPELLS[i]);
			C.SPELLS.splice(i, 1);
			return DrawSpells(C, C.SPELLS);
		}
	}
	return "*RED*A spell named '" + args + "' wasn't in your known spells!\n";
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
		if (C.CLASS != "mage") {
			return "*RED*Only mages can read spellbooks!\n";
		}
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
			return "*GREEN*You learn the spell '*CYAN*" + spell + "*GREEN*'!\n";
		}
		C.SPELLS.push(Prettify(scrollName));
		C.INVENTORY.splice(invIndex, 1);
		return "*GREEN*You learn the spell '*CYAN*" + scrollName + "*GREEN*'!\n";
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
		if (rune.type != "rune" || rune.target != item.type) {
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
		if (rune.name.toLowerCase() == "reach") {
			if (C.INVENTORY[i].range >= 5) {
				return "*RED*This item's range can not be increased further!\n";
			}
			C.INVENTORY[i].range++;
		}
		if (rune.name.toLowerCase() == "precise") {
			C.INVENTORY[i].min += 2;
			C.INVENTORY[i].max += 2;
		}
		if (rune.name.toLowerCase() == "gamble") {
			C.INVENTORY[i].min--;
			C.INVENTORY[i].max += 4;
		}
		if (rune.name.toLowerCase() == "orisha") {
			C.INVENTORY[i].pen += 20;
		}
		if (rune.name.toLowerCase() == "tempered") {
			C.INVENTORY[i].armor[0] += 2;
			C.INVENTORY[i].armor[1] += 2;
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
	let event = data[message.author.id].CATCH;
	if (event) {
		if (event.valid) {
			return "*RED*You're already fishing!\n";
		}
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
		let threshold = 1.75 + .5 * rand(3);
		/*if (message.author.id == "388524907450990603") {
			threshold += .5;
		}*/
		if (seconds > 0 && seconds < threshold) {
			if (data[message.author.id].CATCH.caught) {
				data[message.author.id].CATCH.valid = false;
				let fish = event.fish;
				msg += "*GREEN*You caught a fish! *GREY*It's " + an(fish.name) + " *YELLOW*" + fish.name + "*GREY*!\n";
				if (fish.value > poleTier * 8) {
					if (8 - (2 * poleTier) > rand(14)) {
						return "*RED*Your line breaks! The " + fish.name + " gets away!\n";
					}
				}
				msg += ItemDescription(C, fish) + "\n";
				if (!CanTake(C, fish)) {
					return "*RED*You don't have room in your inventory for the fish! It gets away!\n";
				}
				C.INVENTORY.push(fish);
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