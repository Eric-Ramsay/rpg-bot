function ListCommands(index) {
	let msg = "";
	msg += "--- Available Queries ---\n";
	if (index == -1) {
		msg += "*CYAN*!tutorial - Provides a list of commands to use when getting started.\n";
		msg += "*RED*!character NAME CLASS *GREY*- Creates a new Character. Name is optional. Class can be Random.\n";
		msg += "*CYAN*!stats *GREY*- Describes what character stats do.\n";
		msg += "*RED*!equip ITEM *GREY*- Equips armor or a weapon.\n";
		msg += "*CYAN*!here *GREY*- Provides a description of where you are.\n";
		msg += "*RED*!leave *GREY*- Leaves a dungeon or building.\n";
		msg += "*CYAN*!go DIRECTION *GREY*- Travels in a direction. Can be used in combat to change rows.\n";
		msg += "*RED*!enter BUILDING *GREY*- Enters a building.\n";
		msg += "*CYAN*!trade *GREY*- Starts trading with a merchant.\n";
		msg += "*RED*!stop *GREY*- Stops Trading.\n";
		msg += "*CYAN*!buy ITEM *GREY*- Buys an item, provided you're trading.\n";
		msg += "*RED*!sell ITEM *GREY*- Sells an item, can be done from anywhere in town.\n";
		msg += "*CYAN*!delve *GREY*- Enter into a dungeon.\n";
		msg += "*RED*!spells *GREY*- Lists spells that you know.\n";
		msg += "*CYAN*!read BOOK *GREY*- Reads a spellbook and learns a spell from that school.\n";
		msg += "*RED*!rest *GREY*- You must be at the tavern. Spend 5 gold and restore all of your health.\n";
		msg += "*CYAN*!level STAT *GREY*- Increases the stat specified by 1. You must have SP to use.\n";
		msg += "*RED*!suicide *GREY*- Kills you.\n";
		msg += "*CYAN*!classes *GREY*- Lists the available classes.\n";
		msg += "*RED*!haircut DESCRIPTION *GREY*- You must be in the barbershop, allows you to set a description.\n";
		msg += "*CYAN*!fish *GREY*- You must be at a location with fish, with a fishing pole equipped.\n";
	}
	else {
		msg += "*RED*!cast SPELL on TARGET *GREY*- Casts a spell.\n";
		msg += "*CYAN*!attack TARGET with WEAPON *GREY*- Attacks an enemy.\n";
		msg += "*RED*!take ITEM *GREY*- Loots an item after combat.\n";
		msg += "*CYAN*!flee *GREY*- Flees from combat if you're on the bottom row. Costs 3 AP to attempt.\n";
		msg += "*RED*!start *GREY*- Start combat once you've entered a dungeon. No one will be able to join you after this.\n";
		msg += "*CYAN*!end *GREY*- Ends your turn.\n";
		msg += "*RED*!move UP/DOWN *GREY*- Moves up or down a row. Costs 3 AP.\n";
		msg += "*CYAN*!drink POTION *GREY*- Drinks a potion.\n";
		msg += "*RED*!effects *GREY*- Lists effects on you.\n";
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
		return ItemDescription(C.INVENTORY[index]);
	}
	else {
		for (let i = 0; i < items.length; i++) {
			if (items[i].name.toLowerCase() == args) {
				return ItemDescription(items[i]);
			}
		}
		if (battleIndex > -1) {
			let battle = battles[battleIndex];
			//Perhaps it's not an item they're trying to look at, but a person or enemy.
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
	msg += "*BLUE*MAG *GREY*- Magic. Every point lets you learn +2 spellS.\n";
	msg += "*RED*WEP *GREY*- Weapons Handling. Every point provides +1 Max Weapon Damage & +10% Base Weapon Damage.\n";
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
	let zone = 2;
	if (location.id == "The Acrid Swamp") {
		zone = 1;
	}
	else if (location.id == "The Haunted Crypts") {
		zone = 0;
	}
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
	C.ROW = 4;
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

function CommandCast(words, C, index) {
	let msg = "";
	let args = words.slice(1, words.length);
	let split = args.join(" ").split(" on ");
	if (split.length == 1) {
		split = args.join(" ").split(" at ");
	}
	if (split.length == 1) {
		split = args.join(" ").split(" to ");
	}
	if (split.length == 1) {
		msg = Cast(battles[index], C, split[0], "self");
		msg += HandleCombat(battles[index]);
		msg += RoomDescription(C);
	}
	else if (split.length == 2) {
		msg = Cast(battles[index], C, split[0], split[1]);
		msg += HandleCombat(battles[index]);
		msg += RoomDescription(C);
	}
	else {
		return "*RED*Invalid spell formatting!";
	}
	return msg;
}

function CommandAttack(words, C, index, isPushing = false) {
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
					return "*RED*Your weapons don't have any attacks left!";
				}
				return "*RED*You don't have a valid weapon to attack with!";
			}
			if ((isPushing && C.AP < 3) || (!isPushing && C.AP < (C.INVENTORY[weaponIndex].AP + APCost(C)))) {
				return "*RED*You don't have enough AP to attack with this weapon.";
			}
			if (range > C.INVENTORY[weaponIndex].range) {
				return "*RED*The enemy is too far away to attack with this weapon.";
			}
			if (!isPushing && !CanUseWeapon(C, weaponIndex)) {
				if (C.INVENTORY[weaponIndex].attacks[0] == 0) {
					return "*RED*This weapon can't attack again this turn.";
				}
				return "*RED*You don't have enough ammunition to use this weapon.";
			}
			if (isPushing && C.INVENTORY[weaponIndex].subclass == "polearm") {
				msg = PushTarget(C, battles[index].enemies[enemyIndex]);
				C.AP -= 3;
			}
			else {
				msg = AllyAttack(battles[index], C, enemyIndex, weaponIndex);
			}
			msg += HandleCombat(battles[index]);
			msg += RoomDescription(C);
		}
		else {
			isDead = true;
		}
	}
	else {
		if (isDead) {
			return "*RED*This enemy is already dead.";
		}
		else {
			return "*RED*Unable to find enemy '" + target + "'";
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
	let msg = "";
	let oldRoom;
	let newRoom;
	C.TRADING = "";
	if (index > -1) {
		if (hasEffect(C, "rooted")) {
			return "*RED*You're rooted and can't move!";
		}
		let direction = 1;
		if (words[0] == "up") {
			direction = -1;
		}
		else if (words[0] == "down") {
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
				return "*RED*Try !move to R#\n";
			}
		}
		else {
			return "*RED*In combat, you can only move *GREEN*UP*RED* or *GREEN*DOWN";
		}
		if (C.ROW + direction >= 0 && C.ROW + direction <= 4) {
			let cost = direction * (3 + APCost(C));
			if (hasEffect(C, "slowed")) {
				cost += direction * 3;
			}
			if (C.AP >= cost || !battles[index].started) {
				if (battles[index].started) {
					C.AP -= cost;
				}
				C.ROW += direction;
				for (let i = 0; i < Math.abs(direction); i++) {
					msg += C.NAME + " moves ";
					if (direction > 0) {
						msg += "*GREEN*down*GREY*.\n";
					}
					else {
						msg += "*GREEN*up*GREY*.\n";
					}
				}
				msg += RoomDescription(C);
			}
			else {
				return "*RED*You don't have the AP to move any farther.";
			}
		}
		else {
			return "*RED*You can't go any farther that way.";
		}
	}
	else {
		if (C.BUILDING != "") {
			C.BUILDING = "";
		}
		if (words.length == 0) {
			return RoomDescription(C);
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
								Travel(C, locations[j]);
								return RoomDescription(C);
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
				Travel(C, locations[i]);
				msg = "*GREEN*You travel to *BLUE*" + locations[i].id + "\n";
				msg += RoomDescription(C);
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
						Travel(C, locations[i]);	
						msg = "*GREEN*You travel to *BLUE*" + locations[i].id + " and enter the *GREEN*" + name + ".\n";
					}
					C.BUILDING = name;
					msg += RoomDescription(C);
					return msg;
				}
			}
		}
		return "*RED*You can't go that way.";
	}
	return msg;
}

function CommandFlee(C, index) {
	let msg = "";
	if (C.ENDED) {
		return "*RED*Your turn has already ended!";
	}
	if (C.ROW != 4) {
		return "*RED*You have to move down to the edge of the battle before you can flee!";
	}
	if (C.AP < (3 + APCost(C))) {
		return "*RED*You don't have enough AP to attempt fleeing. (3 Required).";
	}
	C.ENDED = true;
	C.AP -= (3 + APCost(C));
	let ran = rand(10);
	if (ran >= 5 + C.STATS[AVD]) {
		return "*RED*You fail to flee!";
	}
	let battle = battles[index];
	for (let a = battle.allies.length - 1; a >= 0; a--) {
		if (battle.allies[a].ID == C.ID) {
			battle.allies.splice(a, 1);
			break;
		}
	}
	msg = "*YELLOW*" + C.NAME + " flees from the battle!";
	return msg;
}

function CommandTake(words, C, index) {
	let msg = "";
	//Two Parts Expected: Item Index and # to take
	let args = words.slice(1, words.length).join(" ");
	let num = 1;
	//console.log(words[words.length - 1]);
	if (words[words.length - 1][0] == "x") {
		num = parseInt(words[words.length-1].slice(1, words[words.length - 1].length));
		args = words.slice(1, words.length - 1).join(" ");
	}
	let invIndex = findItem(battles[index].loot, args);
	if (invIndex == -1) {
		return "*RED*Couldn't find item '" + words + "'\n";
	}
	if (invIndex >= battles[index].loot.length) {
		return "*RED*There aren't that many items here!\n";
	}
	msg += LootItem(C, battles[index].loot, invIndex, num);
	return msg;	
}

function CommandCharacter(words, C, authorId) {
	let msg = "";
	if (words.length >= 2) {
		let name = words[1];
		C.NAME = name.substring(0, 20);
		C.NAME = C.NAME.charAt(0).toUpperCase() + C.NAME.slice(1);
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].NAME.toLowerCase() == C.NAME) {
				C.NAME = genName(rand(2));
			}
		}
		if (C.NAME.toLowerCase() == "random") {
			C.NAME = genName(rand(2));
		}
		//console.log(C.NAME);
	}
	else {
		C.NAME = genName(rand(2));
	}
	if (words.length >= 3) {
		C.CLASS = words[2].toLowerCase();
		if (C.CLASS == "random") {
			C.CLASS = classes[rand(classes.length)];
		}
	}
	else {
		C.CLASS = classes[rand(classes.length)];
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
			C.INVENTORY.push(startItem("leather cuirass"));
			C.INVENTORY.push(startItem("buckler"));
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
			C.INVENTORY.push(startItem("stylish shirt"));
			C.INVENTORY.push(startItem("rondel dagger"));
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
			C.GOLD = 0;
			C.STATS[MAG] += 2;
			C.INVENTORY.push(startItem("wand"));
			for (let i = 0; i < C.INVENTORY.length; i++) {
				Equip(C, i);
			}
			C.SPELLS.push(new Spell("self-taught", "Arcane Strike", "Deal 6 Damage to a Target", 5));
			let books = ["elemental", "blood", "witchcraft", "divine"];
			C.INVENTORY.push(startItem(books[rand(books.length)] + " spellbook"));
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
	if (C.INVENTORY[invIndex].type != "potion" && C.INVENTORY[invIndex].type != "drink") {
		return "*RED*You can't drink that.";
	}
	let name = C.INVENTORY[invIndex].name.toLowerCase();
	if (name == "health potion") {
		let HP = Math.min(C.STATS[VIT] * 3 + 20 + rand(11), MaxHP(C) - C.HP);
		msg = "*GREY*You drink the potion and gain *RED*" + HP + " health*GREY*!\n";
		C.HP += HP;
	}
	if (name == "antidote") {
		for (let i = 0; i < C.EFFECTS.length; i++) {
			if (C.EFFECTS.name.toLowerCase() == "poison" || C.EFFECTS.name.toLowerCase() == "venom") {
				C.EFFECTS.duration = 0;
			}
		}
	}
	if (name == "skill potion") {
		C.SP++;
	}
	if (name == "haste potion") {
		C.AP += 6;
	}
	if (name == "stamina potion") {
		let stamina = Math.min(C.STATS[END] * 5 + 40 + rand(21), MaxStamina(C) - C.STAMINA);
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
		C.HP += MaxHP(C);
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
		return "*RED*Can't find '" + args + "'";
	}
	let color = "*GREEN*";
	if (NPC.MERCHANT) {
		color = "*YELLOW*";
	}
	if (NPC.INDEX >= NPC.CONVERSATIONS.length) {
		NPC.INDEX = 0;
	}
	msg += color + NPC.NAME + "*GREY*: ";
	msg += NPC.CONVERSATIONS[NPC.INDEX++];
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
		return "*RED*Can't find merchant '" + args + "'";
	}
	msg += RoomDescription(C);
	return msg;
}

function CommandDrop(words, C, index) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let invIndex = findItem(C.INVENTORY, args);
	if (invIndex == -1) {
		return "*RED*Can't find item '" + args + "'";
	}
	battles[index].loot.push(C.INVENTORY[invIndex]);
	msg = "*YELLOW*You drop your " + C.INVENTORY[invIndex].name + "!";
	RemoveItem(C, invIndex);
	return msg;	
}

function CommandSell(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let location = findLocation(C.LOCATION);
	if (location.dungeon) {
		return "*RED*You must be in town to sell your items.";
	}
	let invIndex = findItem(C.INVENTORY, args);
	if (invIndex == -1) {
		return "*RED*Can't find item '" + args + "'";
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
	return "*GREEN*You sell the " + itemName + " for *YELLOW*" + gold + " gold*GREEN*. You have *YELLOW*" + C.GOLD + " gold*GREEN*.";
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
		return "*RED*Can't find item '" + args + "'";
	}
	if (C.GOLD < NPC.ITEMS[invIndex].value) {
		return "*RED*You don't have enough gold to buy that.";
	}
	if (C.BACKPACK && NPC.ITEMS[invIndex].name.toLowerCase() == "backpack") {
		return "*RED*You already have a backpack.";
	}
	//Try to buy item
	if (CanTake(C, NPC.ITEMS[invIndex])) {
		takeItem(C, NPC.ITEMS[invIndex]);
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
		return "*GREEN*You buy the *RED*" + name + "*GREEN* for *YELLOW*" + NPC.ITEMS[invIndex].value + " gold*GREEN*. You have *YELLOW*" + C.GOLD + " gold*GREEN* left.";
	}
	else {
		return "*RED*You can't buy that!\n";
	}
	return msg;
}

function CommandRead(words, C) {
	let msg = "";
	let args = words.slice(1, words.length).join(" ");
	let invIndex = findItem(C.INVENTORY, args);
	if (invIndex == -1) {
		return "*RED*Can't find spellbook '" + args + "'";
	}
	if (C.INVENTORY[invIndex].type != "spellbook") {
		return "*RED*You can't read that.";
	}
	if (C.SPELLS.length > 2 * C.STATS[MAG]) {
		return "*RED*You don't have enough spell slots!";
	}
	let school = C.INVENTORY[invIndex].name.toLowerCase().split(" ")[0];
	let spellList = [];
	for (let i = 0; i < spells.length; i++) {
		if (spells[i].school == school) {
			let found = false;
			for (let j = 0; j < C.SPELLS.length; j++) {
				if (C.SPELLS[j].name == spells[i].name) {
					found = true;
					break;
				}
			}
			if (!found) {
				spellList.push(spells[i]);
			}
		}
	}
	if (spellList.length == 0) {
		return "*RED*You already know all the secrets this book has to offer.";
	}
	let spell = spellList[rand(spellList.length)];
	msg = "*GREEN*You learn the spell '" + spell.name + "'!";
	C.SPELLS.push(spell);
	return msg;
}

function CommandSpells(C) {
	let msg = "*GREEN*AP  *RED*HP  *YELLOW*$  *BLUE* Spell Name*PINK*\n";
	let rightStr = "Description\n";
	for (let i = 0; i < C.SPELLS.length; i++) {
		//leftStr += "*BLUE*"+C.SPELLS[i].name+"\n";
		msg += "*GREEN*" + C.SPELLS[i].AP + "*BLACK* | *RED*" + C.SPELLS[i].HP + "*BLACK* | *YELLOW*" + C.SPELLS[i].gold + "*BLACK* | *GREY*" + (i+1) + " - *BLUE*" + C.SPELLS[i].name;
		rightStr += "*GREY*"+C.SPELLS[i].description;
		if (i < C.SPELLS.length - 1) {
			msg += "\n";
			rightStr += "\n";
		}
	}
	return StackStrings(msg, rightStr, 40);
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
			return "*RED*This item already has its max enchantments.";
		}
		if (item.type != "armor" && item.type != "weapon" && item.type != "staff") {
			return "*RED*This item can not be enchanted!";
		}
		for (const usedRune of item.runes) {
			if (usedRune.name.toLowerCase() == rune.name.toLowerCase()) {
				return "*RED*This item has already been enchanted with that rune.";
			}
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
			if (C.INVENTORY[i].equipped) {
				C.ARMOR[0] += 2;
				C.ARMOR[1] += 2;
			}
		}
		C.INVENTORY[i].runes.push(rune);
		RemoveItem(C, r);
		msg = "*GREEN*You enchant the " + item.name + " with the Rune: " + rune.name + "!\n";
	}
	else {
		return "*RED*Invalid Enchantment.\n";
	}
	return msg;
}