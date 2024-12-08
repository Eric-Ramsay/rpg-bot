function Name(target, color = "") {
	if (target.TYPE == "player" || target.NAME == "Carcinos" || target.TYPE == "servant" || (target.TYPE == "familiar" && target.NAME != "Familiar")) {
		return color + target.NAME;
	}
	return "the " + color + P(target.NAME);
}

function summon(name, row, summoned = true, fading = 0, zombie = false) {
	let index = 0;
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].NAME.toLowerCase() == name.toLowerCase()) {
			index = i;
		}
	}
	let copy = COPY(enemies[index]);
	if (fading > 0) {
		AddEffect(copy, "Fading", fading);
	}
	if (zombie) {
		copy.NAME = "Zombified " + copy.NAME;
		copy.HP = Math.floor(MaxHP(copy)/2);
	}
	copy.ID = copy.NAME + rand(99999999999);
	copy.ROW = row;
	copy.SUMMONED = summoned;
	return copy;
}

function findVictim(row, targets, range, type = "random", ignoreWeak = false) {
	if (rand(8) == 0) {
		type = "random";
	}
	let inRange = [];
	let strongest = -1;
	if (targets.length == 0) {
		return -1;
	}
	let numTargets = 0;
	for (let i = 0; i < targets.length; i++) {
		if (targets[i].HP > 0 && (targets[i].HP > 5 || !ignoreWeak)) {
			if (type == "strongest" && (strongest == -1 || MaxHP(targets[i]) > MaxHP(targets[strongest]))) {
				strongest = i;
			}
			if (Math.abs(targets[i].ROW - row) < range) {
				inRange.push(i);
				numTargets++;
			}
		}
	}
	if (type == "strongest") {
		if (inRange.indexOf(strongest) == -1) {
			return -1;
		}
		return strongest;
	}
	if (inRange.length > 0) {
		if (type == "random") {
			return inRange[rand(inRange.length)];
		}
		if (type == "weak") {
			let min = inRange[0];
			for (let i = 1; i < inRange.length; i++) {
				if (MaxHP(targets[[i]]) < MaxHP(targets[min])) {
					min = inRange[i];
				}
			}
			return min;
		}
		if (type == "strong") {
			let max = inRange[0];
			for (let i = 1; i < inRange.length; i++) {
				if (MaxHP(targets[inRange[i]]) > MaxHP(targets[max])) {
					max = inRange[i];
				}
			}
			return max;
		}
	}
	return -1;
}

function validZone(enemy, zone) {
	if (enemy.ZONES.indexOf(zone) == -1) {
		return false;
	}
	return true;
}

function CalcDifficulty(enemies) {
	let value = 0;
	for (let i = 0; i < enemies.length; i++) {
		value += enemies[i].DIFFICULTY;
	}
	return value;
}

function desiredRow(enemy, targets, range, type = "close", ignoreWeak = true) {
	let min = 999;
	let enemyFound = false;
	let minRow = enemy.ROW;
	let strongest = 0;
	if (targets.length == 0) {
		return enemy.ROW;
	}
	for (let r = 0; r < 5; r++) {
		let index = findVictim(r, targets, range, "random", ignoreWeak);
		if (index > -1) {
			enemyFound = true;
			let dist = Math.abs(r - enemy.ROW);
			if (type == "kite") {
				let numEnemies = 0;
				for (const target of targets) {
					if (target.ROW == r) {
						numEnemies++;
					}
				}
				if (numEnemies < min) {
					min = numEnemies;
					minRow = r;
				}
			}
			else if (dist < min) {
				min = dist;
				minRow = r;
			}
			if (MaxHP(targets[index]) > MaxHP(targets[strongest])) {
				strongest = index;
			}
		}
	}
	if (!enemyFound && ignoreWeak) {
		return desiredRow(enemy, targets, range, type, false);
	}
	if (type == "strongest") {
		return targets[strongest].ROW;
	}
	if (type == "kite") {
		if (findVictim(enemy.ROW, targets, range) == -1) {
			return desiredRow(enemy, targets, range, "close");
		}
	}
	return minRow;
}

function moveToRow(enemy, targetRow, force = false, printMoves = true) {
	let msg = "";
	let moves = 0;
	if (hasEffect(enemy, "rooted")) {
		return msg;
	}
	if (enemy.ROW == targetRow) {
		return msg;
	}
	let numMoves = enemy.MOVES;
	if (hasEffect(enemy, "slowed")) {
		numMoves = Math.max(Math.floor(numMoves/2), 1);
	}
	if (hasEffect(enemy, "charging")) {
		numMoves *= 2;
	}
	if (force || enemy.TYPE == "boss") {
		numMoves = 5;
	}
	for (let i = 0; i < numMoves; i++) {
		if (targetRow < enemy.ROW) {
			moves--;
			enemy.ROW--;
		}
		else if (targetRow > enemy.ROW) {
			moves++;
			enemy.ROW++;
		}
	}
	if (moves != 0) {
		msg += "*PINK*" + Prettify(Name(enemy)) + "*GREY* moves ";
		if (moves > 0) {
			msg += "right";
		}
		else {
			msg += "left";
		}
		moves = Math.abs(moves);
		if (moves > 1) {
			msg += " " + moves + " rows";
		}
		msg += ".\n";
	}
	return msg;
}

function moveInRange(enemy, targets, range, type = "close") {
	let msg = "";
	let targetRow = desiredRow(enemy, targets, range, type);
	msg += moveToRow(enemy, targetRow);
	return msg;
}

function moveAttack(enemies, enemy, targets, attack, type = "random") {
	let msg = "";
	let target = null;
	let index = findVictim(enemy.ROW, targets, attack.range, type);
	if (index > -1) {
		msg += "*PINK*" + Prettify(Name(enemy)) + " " + attack.verb + " " + Name(targets[index]) + "*PINK*!\n";
		for (let i = 0; i < attack.number; i++) {
			if (targets[index].HP > 0) {
				let result = DealDamage(attack, enemies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					target = targets[index];
				}
			}
		}
	}
	else {
		msg = moveInRange(enemy, targets, attack.range, type);
	}
	return [msg, target]
}

function enemyAttack(enemyIndex, allies, targets, deadAllies = [], deadTargets = []) {
	let enemy = allies[enemyIndex];
	//console.log("Attacking: " + Name(enemy));
	let msg = "";
	let max = 0;
	let min = enemy.ROW;
	let rows = [0, 0, 0, 0, 0];
	let values = [0, 0, 0, 0, 0];
	for (let i = 0; i < targets.length; i++) {
		rows[targets[i].ROW] += targets[i].HP;
	}
	let dists = [1, .25, .1, 0, 0];
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < values.length; j++) {
			let d = Math.abs(i - j);
			values[i] += dists[d] * rows[j];
		}
	}
	for (let i = 1; i < values.length; i++) {
		if (values[i] > values[max]) {
			max = i;
		}
		if (values[i] < values[min]) {
			min = i;
		}
	}
	let eName = enemy.NAME;
	let name = Prettify(Name(enemy));
	if (eName.substring(0, "Zombified".length) == "Zombified") {
		eName = eName.substring("Zombified ".length);
	}
	if (enemy.HP > 0) {
		//Deal with Goblins
		if (eName.toLowerCase().includes("goblin")) {
			let warlord = (findPerson(allies, "Goblin Warlord") > -1);
			if (warlord) {
				RemoveEffect(enemy, "disorganized");
			}
			else {
				msg += AddEffect(enemy, "disorganized", 999);
			}
		}
		if (enemy.TYPE != "boss" && hasEffect(enemy, "terrified") && enemy.MOVES > 0) {
			if (enemy.ROW == 4) {
				msg += "*PINK*" + name + " flees the battle!\n";
				allies.splice(enemyIndex, 1);
			}
			else {
				msg += "*PINK*" + name + " flees in terror!\n";
				msg += moveToRow(enemy, 4);
			}
		}
		else if (eName == "Swarm of Bats") {
			msg += moveAttack(allies, enemy, targets, new Attack("bites", 5 + rand(6), 90, 0, 4, 1), "strong")[0];
			let ran = rand(3);
			if (ran == 0) {
				msg += "The *PINK*Swarm of Bats*GREY* transforms into a *PINK*Vampire*GREY*!\n";
				enemy.NAME = "Vampire"
			}
		}
		else if (eName == "Vampire") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*" + name + " siphons health from " + Name(targets[index]) + "!\n";
				let result = DealDamage(new P_Attack(14 + rand(7), 90, 75), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += Heal(enemy, Math.floor(result[1]));
				}
			}
			let ran = rand(3);
			if (ran == 0) {
				msg += "The *PINK*Vampire *GREY*transforms into a *PINK*Swarm of Bats*GREY*!\n";
				enemy.NAME = "Swarm of Bats";
			}
		}
		else if (eName == "Scoundrel") {
			let ran = rand(2);
			let indexTwo = findVictim(enemy.ROW, targets, 2);
			let indexOne = findVictim(enemy.ROW, targets, 1);
			if (ran == 0 && indexTwo > -1) {
				msg += "*PINK*" + name + " throws dirt at " + Name(targets[indexTwo]) + "'s eyes!\n";
				let result = DealDamage(new P_Attack(1, 100), allies, enemy, targets, targets[indexTwo]);
				msg += result[0];
				if (result[1] > 0) {
					AddEffect(targets[indexTwo], "blinded", 1, enemy);
				}
				msg += moveToRow(enemy, targets[indexTwo].ROW);
			}
			indexOne = findVictim(enemy.ROW, targets, 1);
			if (indexOne > -1) {
				msg += "*PINK*" + name + " stabs " + Name(targets[indexOne]) + " with their poisoned blade!\n";
				for (let i = 0; i < 3; i++) {
					let result = DealDamage(new P_Attack(3 + rand(5), 90), allies, enemy, targets, targets[indexOne]);
					msg += result[0];
					if (result[1] > 0) {
						AddEffect(targets[indexOne], "poison", 3, enemy);
					}
				}
			}
			else if (ran == 1 && !(hasEffect(enemy, "stronger"))) {
				msg += "*PINK*" + name + " psyches themself up!\n";
				msg += AddEffect(enemy, "stronger", 3);
			}
			else {
				msg += moveInRange(enemy, targets, 1);
			}
		}
		else if (eName == "Zombie") {
			msg += moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				let ran = rand(2);
				if (ran == 0) {
					msg += "*PINK*" + name + " scratches " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(4 + rand(5), 75), allies, enemy, targets, targets[index])[0];
				}
				if (ran == 1) {
					msg += "*PINK*" + name + " bites " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(12 + rand(9), 75), allies, enemy, targets, targets[index])[0];
				}
				if (targets[index].HP <= 0 && MaxHP(targets[index]) > 5) {
					if (targets[index].TYPE != "plant" && targets[index].TYPE != "evil" && targets[index].TYPE != "construction") {
						msg += "*PINK*" + Prettify(Name(targets[index])) + " rises as a Zombie!\n";
						let zombie = summon("zombie", targets[index].ROW);
						zombie.HP = Math.ceil(MaxHP(targets[index])/2);
						allies.push(zombie);
					}
				}
			}
		}
		else if (eName == "Mechanical Gunman") {
			if (enemy.PHASE % 2 == 0) {
				let playerIndices = [];
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].TYPE == "player") {
						playerIndices.push(i);
					}
				}
				let index = 0;
				if (playerIndices.length > 0) {
					index = playerIndices[rand(playerIndices.length)];
				}
				else {
					index = findVictim(enemy.ROW, targets, 6, "strongest");
				}
				if (index > -1) {
					msg += "*PINK*The Mechanical Gunman aims and fires!\n";
					msg += DealDamage(new P_Attack(40 + rand(21), 75, 50), allies, enemy, targets, targets[index])[0];
				}
			}
			else {
				msg += "*PINK*The Mechanical Gunman reloads . . .\n";
			}
			enemy.PHASE++;
		}
		else if (eName == "Mechanical Guardsman") {
			let masterFound = false;
			let moved = false;
			AddEffect(enemy, "blocking", 1);
			if (enemy.PHASE == 0) {
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME == "Grand Architect") {
						masterFound = true;
						if (rows[allies[i].ROW] > 0) {
							msg += moveToRow(enemy, allies[i].ROW);
							moved = true;
						}
						break;
					}
				}
				if (!masterFound) {
					enemy.PHASE++;
				}
				if (!moved) {
					if (enemy.ROW != 4) {
						msg += moveToRow(enemy, 4);
					}
				}
				else {
				let indexOne = findVictim(enemy.ROW, targets, 1);
					if (indexOne > -1) {
						msg += "*PINK*The Mechanical Guardsman slams into " + Name(targets[indexOne]) + " with their shield!\n";
						let result = DealDamage(new P_Attack(14 + rand(7), 100, 50), allies, enemy, targets, targets[indexOne]);
						msg += result[0];
						if (result[1] > 0) {
							for (let i = 0; i < 3; i++) {
								msg += PushTarget(enemy, targets[indexOne]);
							}
						}
					}
				}
			}
			if (enemy.PHASE == 1) {
				msg += "*RED*The Mechanical Guardsman drops their shield, and draws a massive axe.\n";
				enemy.PHASE++;
			}
			if (enemy.PHASE == 2) {
				let indexOne = findVictim(enemy.ROW, targets, 1);
				let indexThree = findVictim(enemy.ROW, targets, 3);
				if (indexOne > -1) {
					msg += "*PINK*The Mechanical Guardsman unleashes a flurry of powerful slashes!\n";
					for (let i = 0; i < 3; i++) {
						msg += DealDamage(new P_Attack(17 + rand(6), 85, 30), allies, enemy, targets, targets[indexOne]);
					}
				}
				else if (indexOne > -1) {
					msg += "*PINK*The Mechanical Guardsman rushes forward!\n";
					msg += moveToRow(enemy, targets[indexThree].ROW);
					if (enemy.ROW == targets[indexThree.ROW]) {
						msg += "*PINK*The Mechanical Guardsman hacks brutally at " + Name(targets[indexThree]) + "!\n";
						let result = DealDamage(new P_Attack(17 + rand(6), 85, 30), allies, enemy, targets, targets[indexThree]);
						msg += result[0];
						if (result[1] > 0) {
							msg += AddEffect(targets[indexThree], "bleed");
						}
					}
				}
			}
		}
		else if (eName == "Warding Shield") {
			/*let allyConstructs = ["Mechanical Gunman", "Mechanical Guardsman", "Grand Architect", "Wandering Moon"]
			msg += "*CYAN*The Warding Shield guards the constructions sheltering behind it!\n";
			for (let i = 0; i < allies.length; i++) {
				if (allyConstructs.includes(allies[i].NAME)) {
					if (enemy.ROW == allies[i].ROW) {
						 AddEffect(enemy, "guarding", 999, null, allies[i]);
					}
				}
			}*/
		}
		else if (eName == "Grand Architect") {
			let wallRow = enemy.ROW;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME == "Warding Shield" && allies[i].ROW != enemy.ROW) {
					msg += moveToRow(enemy, allies[i].ROW);
				}
			}
			let ran = rand(5);
			let lines = [
				"*CYAN*Grand Architect*GREY*: Disgusting Flesh Creatures. Leave my sight and I might spare you.\n",
				"*CYAN*Grand Architect*GREY*: Go forth, my creations.\n",
				"*CYAN*Grand Architect*GREY*: Fools. I will integrate your designs.\n",
				"*CYAN*Grand Architect*GREY*: Cower you wretched things!\n",
			];
			if (enemy.PHASE % 2 == 0 && enemy.PHASE/2 < lines.length) {
				msg += lines[enemy.PHASE/2];
			}
			if (enemy.PHASE < 3) {
				msg += "*PINK*The Grand Architect constructs a Mechanical Gunman!\n";
				allies.push(summon("Mechanical Gunman", enemy.ROW));
			}
			else if (enemy.PHASE == 3) {
				msg += "*PINK*The Grand Architect deploys a swarm of Wandering Moons!\n";
				for (let i = 0; i < 4; i++) {
					allies.push(summon("Wandering Moon", 0));
				}
			}
			else {
				let numConstructs = 0;
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].TYPE == "construction") {
						numConstructs++;
					}
				}
				let ran = rand(3);
				if (numConstructs < 2) {
					ran = 1;
				}
				if (ran == 0) {
					msg += "*CYAN*The Grand Architect supercharges its constructs!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].TYPE == "construction" && allies[i].NAME != "Grand Architect") {
							Heal(allies[i], 50);
							if (allies[i].NAME == "Warding Shield") {
								Heal(allies[i], 100);
								AddEffect(allies[i], "resilient", 1);
							}
							else {
								AddEffect(allies[i], "enraged", 1);
							}
						}
					}
				}
				else {
					msg += "*RED*The Grand Architect unleashes a bolt of lightning from a cannon embedded in its palm!\n";
					let max = 0;
					let maxDmg = 0;
					for (let i = 0; i < targets.length; i++) {
						if (targets[i].REPORT.damage > maxDmg) {
							maxDmg = targets[i].REPORT.damage;
							max = i;
						}
					}
					msg += DealDamage(new M_Attack(40 + rand(21), 20), allies, enemy, targets, targets[max])[0];
				}
			}
			enemy.PHASE++;
		}
		else if (eName == "Hungry Ghoul") {
			let ran = 0;
			if (enemy.HP < enemy.MaxHP/2 && allies.length > 1) {
				ran = rand(2);
			}
			if (ran == 0) {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + name + " gnaws on " + Name(targets[index]) + "!\n";
					for (let i = 0; i < 3; i++) {
						msg += DealDamage(new P_Attack(6 + rand(7), 95), allies, enemy, targets, targets[index])[0];
					}
					if (targets[index].HP <= 0) {
						msg += "*PINK*The Hungry Ghoul consumes the flesh of " + Name(targets[index]) + "!\n";
						msg += Heal(enemy, MaxHP(targets[index]));
					}
				}
				else {
					ran = rand(2);
					if (enemy.PHASE % 2 == 1) {
						msg += moveInRange(enemy, targets, 1);
						index = findVictim(enemy.ROW, targets, 1, "strong");
						if (index > -1) {
							msg += "*PINK*The Hungry Ghoul tackles " + Name(targets[index]);
							let result = DealDamage(new P_Attack(20 + rand(7), 90, 50), allies, enemy, targets, targets[index]);
							let dmg = result[1];
							if (dmg > 0) {
								msg += " and tears into their flesh! They're pinned down by the Hungry Ghoul!\n";
								AddEffect(targets[index], "rooted", 1);
							}
							else {
								msg += ".\n";
							}
							msg += result[0];
						}
						enemy.PHASE++;
					}
					else if (ran == 0) {
						msg += "*PINK*The Hungry Ghoul howls terribly, preparing to rush forward!\n";
						msg += AddEffect(enemy, "Charging", 1);
						enemy.PHASE++;
					}
					else {
						msg += moveInRange(enemy, targets, 1);
					}
				}
			}
			else {
				msg += "*PINK*The Hungry Ghoul siphons health from its allies!\n";
				for (let i = 0; i < allies.length; i++) {
					if (i != enemyIndex && enemy.HP < enemy.MaxHP ) {
						let result = DealDamage(new M_Attack(8, 100), allies, enemy, allies, allies[i]);
						msg += result[0];
						let dmg = result[1];
						if (dmg > 0) {
							msg += Heal(enemy, dmg);
						}
					}
				}
			}
		}
		else if (eName == "Bronze Bellbeast") {
			msg += "*PINK*The Bronze Bellbeast tolls!\n";
			for (let i = 0; i < targets.length; i++) {
				msg += DealDamage(new M_Attack(12 + rand(6)), allies, enemy, targets, targets[i])[0];
			}
		}
		else if (eName == "Acidic Slime") {
			msg += "*PINK*Toxic fumes bubble off of the slime, choking those near it!\n";
			for (let i = 0; i < targets.length; i++) {
				if (Math.abs(targets[i].ROW - enemy.ROW) <= 1) {
					AddEffect(targets[i], "poison", 1, enemy);
				}
			}
			let result = moveAttack(allies, enemy, targets, new Attack("slimes", 6 + rand(5), 80, 0));
			msg += result[0];
			if (result[1] != null) {
				msg += AddEffect(result[1], "Slowed", 1, enemy);
			}
		}
		else if (eName == "Giant Amoeba") {
			let ran = rand(4);
			if (ran == 0) {
				msg += "*PINK*The Giant Amoeba splits in two!\n";
				let amoeba = summon("Giant Amoeba", enemy.ROW);
				amoeba.HP = enemy.HP;
				allies.push(amoeba);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("bumps into", 6 + rand(7), 100, 0))[0];
			}
		}
		else if (eName == "Flaming Wisp") {
			let ran = rand(3); 
			if (ran == 0 && enemy.MaxHP < 40) {
				msg += "*CYAN*" + name + " begins to burn brighter. . .\n"
				enemy.MaxHP += 5;
				Heal(enemy, 10);
				enemy.ARMOR[0] += 1;
				enemy.ARMOR[1] += 1;
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("burns", 6 + rand(7), 100, 1, 1, 2))[0];
			}
		}
		else if (eName == "Swamp Stalker") {
			let attack = false;
			let indexTwo = findVictim(enemy.ROW, targets, 2);
			let indexOne = findVictim(enemy.ROW, targets, 1);
			if (indexOne > -1) {
				if (hasEffect(targets[indexOne], "rooted")) {
					msg += "*PINK*" + name + " begins to eat " + Name(targets[indexOne]) + "*PINK*!\n";
					msg += DealDamage(new P_Attack(12 + rand(7), 100), allies, enemy, targets, targets[indexOne])[0];
					attack = true;
				}
			}
			else if (indexTwo > -1) {
				if (hasEffect(targets[indexTwo], "rooted")) {
					targets[indexTwo].ROW == enemy.ROW;
					msg += "*PINK*" + name + " drags " + Name(targets[indexTwo]) + " closer*PINK*!\n";
					msg += DealDamage(new P_Attack(4 + rand(3), 100, 100), allies, enemy, targets, targets[indexTwo])[0];
					attack = true;
				}
			}
			if (!attack) {
				let ran = rand(3);
				if (indexOne == -1 && indexTwo == -1 && ran == 0) {
					msg += "*PINK*The Swamp Stalker hisses. . .\n";
				}
				else {
				let result = moveAttack(allies, enemy, targets, new Attack("grabs", 14 + rand(7), 75, 1, 1, 2));
					msg += result[0];
					if (result[1] != null) {
						msg += AddEffect(result[1], "Rooted", 2, enemy);
						msg += AddEffect(result[1], "Venom", 3, enemy);
					}
				}
			}
		}
		else if (eName == "Ephemeral Warrior") {
			let index = findVictim(enemy.ROW, targets, 2, "strong"); 
			let ran = rand(2);
			if (ran == 0 || index == -1) {
				index = findVictim(enemy.ROW, targets, 6, "strongest");
			}
			if (index == -1) {
				console.log("Error in Ephemeral Warrior");
				return "";
			}
			if (Math.abs(targets[index].ROW - enemy.ROW) <= 1) {
				ran = rand(2);
				if (ran == 0) {
					msg += "*CYAN*" + name + " stabs " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(Math.floor(.1 * enemy.MaxHP) + 10 + rand(9), 90, 50), allies, enemy, targets, targets[index])[0];
				}
				else {
					msg += "*CYAN*" + name + " slashes " + Name(targets[index]) + "!\n";
					for (let i = 0; i < 2; i++) {
						msg += DealDamage(new P_Attack(Math.floor(.1 * enemy.MaxHP) + 4 + rand(7), 90, 30), allies, enemy, targets, targets[index])[0];
					}
				}
			}
			else {
				ran = rand(4);
				if (ran == 0) {
					let dialogue = [
						"The Ephemeral Warrior takes a defensive stance.",
						"The Ephemeral Warrior points their blade at " + Name(targets[index]) + ".",
						"The Ephemeral Warrior stares at " + Name(targets[index]) + "."
					];
					msg += "*CYAN*" + dialogue[rand(dialogue.length)] + "\n";
				}
				else {
					msg += moveToRow(enemy, targets[index].ROW);
				}
			}
		}
		else if (eName == "Wisp Knight") {
			let ran = rand(5); 
			if (ran == 0) {
				msg += "*CYAN*" + name + " begins to burn brighter. . .\n";
				enemy.MaxHP = Math.min(150, enemy.MaxHP + 10);
				msg += Heal(enemy, 20);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("burns", 10 + rand(11), 100, 1, 3))[0];
			}
		}
		else if (eName == "Slimelord") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*A smaller slime drips off of the Slimelord!\n";
				allies.push(summon("Acidic Slime", enemy.ROW));
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("slimes", 18 + rand(19), 80, 0))[0];
			}
		}
		else if (eName == "Apparition") {
			let index = findVictim(enemy.ROW, targets, 6);
			if (index > -1 && targets[index].ROW != enemy.ROW) {
				msg += "*PINK*" + name + " vanishes and reappears!\n";
				enemy.ROW = targets[index].ROW;
			}
			msg += moveAttack(allies, enemy, targets, new Attack("spooks", 4 + rand(5), 100, 1))[0];
		}
		else if (eName == "Raging Boar") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*" + name + " postures and huffs!\n";
				let row = rand(5);
				while (Math.abs(row - enemy.ROW) > 2) {
					row = rand(5);
				}
				msg += moveToRow(enemy, row);
			}
			else {
				let index = rand(targets.length);
				msg += "*PINK*" + name + " charges!\n";
				msg += moveToRow(enemy, targets[index].ROW);
				if (enemy.ROW == targets[index].ROW) {
					let result = DealDamage(new P_Attack(14 + rand(7), 100, 50), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						for (let i = 0; i < 5; i++) {
							msg += PushTarget(enemy, targets[index]);
						}
					}
				}
			}
		}
		else if (eName == "Lost Angel") {
			if (enemy.HP < enemy.MaxHP/3 && enemy.PHASE < 3) {
				if (enemy.PHASE < 2) {
					let dialogue = [
						"*YELLOW*The angel kneels, and whispered prayers pour as fire from its mouth.\n",
						"*YELLOW*The angel's flesh splits apart, and in its eyes shine the sun and the moon.\n"
					];
					msg = dialogue[enemy.PHASE];
					if (enemy.PHASE == 0) {
						msg += AddEffect(enemy, "resilient", 5);
					}
					removeDebuffs(enemy);
					msg += Heal(enemy, 77);
				}
				else {
					msg += "*PINK*" + name + " swings its blade, and the ground sinks beneath the unrighteous!\n";
					for (let i = 0; i < targets.length; i++) {
						let dmg = 12 + targets[i].HP/3;
						if (targets[i].TYPE == "evil") {
							dmg *= 3;
						}
						msg += DealDamage(new T_Attack(dmg), allies, enemy, targets, targets[i])[0];
					}
					removeDebuffs(enemy);
					msg += Heal(enemy, 77);
				}
				enemy.PHASE++;
				return msg;
			}
			if (rand(6) == 0) {
				let dialogue = [
					"*YELLOW*The angel seems hesitant. It looks at its sword with confusion. . .\n",
					"*YELLOW*The angel seems afraid. . .\n",
					"*YELLOW*A look of determination overcomes the angel.\n"
				];
				msg += dialogue[rand(dialogue.length)];
			}
			let index = findVictim(enemy.ROW, targets, 1);
			let ran = rand(3);
			if (index == -1 && ran != 0) {
				ran = rand(3);
			}
			if (ran == 0) {
				msg += "*PINK*Blinding spheres of flame rise above the angel; it sweeps its blade, and they're sent forth.\n";
				ran = 2 + rand(3) + Math.floor(targets.length/3);
				for (let i = 0; i < ran; i++) {
					let index = rand(targets.length);
					if (targets[index].HP > 0) {
						msg += DealDamage(new M_Attack(16 + rand(7), 50), allies, enemy, targets, targets[index])[0];
						msg += AddEffect(targets[index], "Blinded", 1, enemy);
					}
				}
			}
			else if (index == -1) {
				msg += moveInRange(enemy, targets, 1);
			}
			else if (ran == 1) {
				msg += "*PINK*" + name + " unleashes a sweeping blow!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == enemy.ROW) {
						msg += DealDamage(new P_Attack(20 + rand(7), 100, 25), allies, enemy, targets, targets[i])[0];
					}
				}
			}
			else if (ran == 2) {
				if (targets[index].TYPE == "evil") {
					msg += "*PINK*" + name + " cleanses the evil in its path!\n";
					msg += DealDamage(new T_Attack(150), allies, enemy, targets, targets[index])[0];
				}
				else {
					msg += "*PINK*" + name + " smites " + Name(targets[index]) + "*PINK*!\n";
					msg += DealDamage(new P_Attack(36 + rand(13), 100, 50), allies, enemy, targets, targets[index])[0];
				}
			}
		}
		else if (eName == "Giant Spider") {
			let ran = rand(3);
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				if (hasEffect(targets[index], "stunned")) {
					ran = 0;
				}
				if (ran < 2) {
					msg += "*PINK*" + name + " bites " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(8 + rand(9), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "venom", 3, enemy);
						msg += AddEffect(targets[index], "poison", 3, enemy);
					}
				}
				if (ran == 2) {
					msg += "*PINK*" + name + " wraps " + Name(targets[index]) + " in their web, stunning them!\n";
					AddEffect(targets[index], "stunned", 1, enemy);
				}
			}
			else {
				msg = moveInRange(enemy, targets, 1);
				let webFound = false;
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].ROW == enemy.ROW && allies[i].NAME == "Web") {
						webFound = true;
					}
				}
				if (!webFound)
				{
					msg += "*PINK*" + name + " spins a spiderweb across Row " + (enemy.ROW + 1) + "!\n";
					allies.push(summon("Web", enemy.ROW));
				}
			}
		}
		else if (eName == "Web") {
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == enemy.ROW) {
					let ran = rand(2);
					let effect = "slowed";
					if (ran == 0) {
						effect = "rooted";
					}
					msg += "*RED*" + Prettify(Name(targets[i])) + " is caught in the web and " + effect + "!\n";
					AddEffect(targets[i], effect, 1, enemy);
				}
			}
			enemy.HP--;
		}
		else if (eName == "Spider Queen") {
			let index = findVictim(enemy.ROW, targets, 1, "strong");
			if (index > -1) {
				msg += "*PINK*" + name + " bites " + Name(targets[index]) + ", injecting them with paralytic venom!\n";
				let result = DealDamage(new P_Attack(18 + rand(7), 85, 30), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += AddEffect(targets[index], "Venom", 3, enemy);
					msg += AddEffect(targets[index], "Stunned", 1, enemy);
				}
			}
			else {
				let ran = rand(2);
				index = findVictim(enemy.ROW, targets, 4);
				if (ran == 0 && index > -1) {
					msg += "*PINK*" + name + " spits a glob of burning venom at " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(10 + rand(5), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Venom", 6, enemy);
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
			ran = rand(4);
			if (ran == 0) {
				msg += "*PINK*" + name + " lays an egg sac!\n";
				allies.push(summon("Egg Sac", enemy.ROW));
			}
			let webFound = false;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].ROW == enemy.ROW && allies[i].NAME == "Web") {
					webFound = true;
				}
			}
			if (!webFound)
			{
				msg += "*PINK*" + name + " spins a spiderweb across Row " + (enemy.ROW + 1) + "!\n";
				allies.push(summon("Web", enemy.ROW));
			}
		}
		else if (eName == "Egg Sac") {
			let ran = rand(10);
			if (ran == 0) {
				msg += DealDamage(new P_Attack(25), allies, enemy, allies, enemy)[0];
			}
		}
		else if (eName == "Ogre") {
			let indexThree = findVictim(enemy.ROW, targets, 3);
			let indexOne = findVictim(enemy.ROW, targets, 1);
			if (indexOne > -1) {
				msg += "*PINK*The Ogre swings their club at " + Name(targets[indexOne]) + "!\n";
				let result = DealDamage(new P_Attack(12 + rand(15), 75, 50), allies, enemy, targets, targets[indexOne]);
				msg += result[0];
				if (result[1] > 0) {
					for (let i = 0; i < 2; i++) {
						msg += PushTarget(enemy, targets[indexOne]);
					}
				}
			}
			else {
				let ran = rand(3);
				if (indexThree > -1 && ran == 0) {
					msg += "*PINK*The ogre picks up a stone and hurls it!\n";
					msg += DealDamage(new P_Attack(6 + rand(5), 75, 50), allies, enemy, targets, targets[indexThree])[0];
				}
				else if (ran == 1) {
					msg += "*PINK*The ogre bellows and strikes the ground with their club, knocking everyone to the ground!\n";
					for (let i = 0; i < targets.length; i++) {
						msg += AddEffect(targets[i], "slowed", 1, enemy);
						msg += AddEffect(targets[i], "vulnerable", 1, enemy);
					}
				}
				else {
					msg += moveInRange(enemy, targets, 1);
				}	
			}
		}
		else if (eName == "Old Wolf") {
			if (enemy.HP <= 10) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites savagely at", 16 + rand(13), 85))[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 8 + rand(9), 65, 0, 2))[0];
			}
		}
		else if (eName == "Mushroom Mage") {
			let ran = rand(5);
			if (enemy.HP > .75 * enemy.MaxHP) {
				ran = rand(3);
			}
			if (ran == 0) {
				msg += "*PINK*" + name + " conjures a cloud of poisonous toxins!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(10 + rand(5)), allies, enemy, targets, targets[i])[0];
					AddEffect(targets[i], "Poison", 3, enemy);
				}
			}
			else if (ran == 1) {
				msg += "*PINK*" + name + " summons Living Spores!\n";
				ran = 1 + rand(4);
				for (let i = 0; i < ran; i++) {
					allies.push(summon("Living Spore", rand(5)));
				}
			}
			else if (ran == 2) {
				msg += "*PINK*" + name + " summons a Toxic Mushroom!\n";
				allies.push(summon("Toxic Mushroom", rand(5)));
			}
			else {
				msg += moveToRow(enemy, min);
				msg += "*PINK*" + name + " inhales spores and heals!\n";
				msg += Heal(enemy, 12 + rand(7));
			}
		}
		else if (eName == "Toxic Mushroom") {
			let ran = rand(3);
			if (enemy.HP <= 10) {
				msg += "*PINK*" + name + " regenerates. . .\n";
				msg += Heal(enemy, 2 + rand(5));
			}
			else if (ran == 0) {
				msg += "*PINK*" + name + " unleashes a cloud of poisonous toxins!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new P_Attack(2 + rand(3), 100), allies, enemy, targets, targets[i])[0];
					AddEffect(targets[i], "Poison", 3, enemy);
				}
			}
			else if (ran == 1) {
				msg += "*PINK*" + name + " belches a puff of Living Spores!\n"
				ran = 1 + rand(3);
				for (let i = 0; i < ran; i++) {
					allies.push(summon("Living Spore", enemy.ROW));
				}
			}
			else if (ran == 2) {
				msg += "*CYAN*" + name + " hardens!\n";
				enemy.ARMOR[0] += 2;
				enemy.ARMOR[1] += 1;
			}
		}
		else if (eName == "Living Spore") {
			let ran = rand(15);
			if (ran == 0) {
				msg += "*PINK*" + name + " sinks into the earth and sprouts into a Toxic Mushroom!\n";
				let mushroom = summon("Toxic Mushroom", enemy.ROW);
				enemy.NAME = "Toxic Mushroom";
				enemy.HP *= 3;
				enemy.MaxHP = 15;
				enemy.ARMOR = [2, 2];
			}
			else {
				msg = moveInRange(enemy, targets, 1);
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + name + " burrows into " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(2 + rand(5), 100), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Poison", 3, enemy);
					}
					enemy.HP = 0;
				}
			}
		}
		else if (eName == "Baby Spider") {
			msg = moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*" + name + " bites " + Name(targets[index]) + "!\n";
				let result = DealDamage(new P_Attack(2 + rand(3), 85), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += AddEffect(targets[index], "Poison", 3, enemy);
				}
			}
			let ran = rand(15);
			if (ran == 0) {
				msg += "*PINK*" + name + " grows into a Giant Spider!\n";
				enemy.NAME = "Giant Spider";
				let maxHP = 40;
				enemy.HP = Math.round((enemy.HP/enemy.MaxHP) * maxHP);
				enemy.MaxHP = maxHP;
				enemy.ARMOR = [4, 0];
			}
		}
		else if (eName == "Cave Spider") {
			let ran = rand(3);
			let index = findVictim(enemy.ROW, targets, 4);
			if (ran == 0) {
				if (index > -1) {
					msg += "*PINK*" + name + " spits venom at " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Venom", 3, enemy);
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + name + " bites " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(10 + rand(11), 75), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Venom", 3, enemy);
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
		}
		else if (eName == "Skeletal Swordsman") {
			msg += moveAttack(allies, enemy, targets, new P_Move(8 + rand(17), 90, 10, "hacks at"))[0];
		}
		else if (eName == "Skeletal Spearman") {
			msg += moveAttack(allies, enemy, targets, new P_Move(12 + rand(7), 75, 25, "stabs", 2))[0];
		}
		else if (eName == "Skeletal Archer") {
			let ran = rand(2);
			let aimAt = "strong";
			if (ran == 0) {
				aimAt = "weak";
			}
			msg += moveAttack(allies, enemy, targets, new P_Move(6 + rand(9), 80, 30, "looses an arrow at", 6), "strong")[0];
		}
		else if (eName == "Goblin Swordsman") {
			msg += moveAttack(allies, enemy, targets, new P_Move(18 + rand(9), 85, 10, "slashes", 1), "strong")[0];
		}
		else if (eName == "Goblin Spearman") {
			msg += moveAttack(allies, enemy, targets, new P_Move(14 + rand(9), 85, 20, "stabs", 2), "strong")[0];
		}
		else if (eName == "Goblin Archer") {
			let ran = rand(2);
			let aimAt = "strong";
			if (ran == 0) {
				aimAt = "weak";
			}
			msg += moveAttack(allies, enemy, targets, new P_Move(10 + rand(9), 90, 20, "looses an arrow at", 6), "strong")[0];
		}
		else if (eName == "Flesh Golem") {
			let ran = rand(3);
			if (ran == 0) {
				let dmg = 10 + rand(7);
				dmg += Math.floor((enemy.MaxHP - enemy.HP)/10);
				msg += moveAttack(allies, enemy, targets, new M_Move(dmg, 85, 0, "spits its cursed blood at", 2))[0];
			}
			else if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new P_Move(16 + rand(9), 70, 50, "crushes"))[0];
			}
			else if (ran == 2) {
				msg += moveAttack(allies, enemy, targets, new P_Move(5 + rand(5), 90, 20, "bites", 1, 3))[0];
			}
		}
		else if (eName == "Lich") {
			let numDead = 0;
			for (const character of deadAllies) {
				if (character.TYPE != "plant" && character.TYPE != "evil" && character.TYPE != "construction") {
					numDead++;
				}
			}
			for (const character of deadTargets) {
				if (character.TYPE != "plant" && character.TYPE != "evil" && character.TYPE != "construction") {
					numDead++;
				}
			}
			let indexOne = findVictim(enemy.ROW, targets, 1);
			if (indexOne > -1 && (enemy.HP <= 25 || rand(2) == 0)) {
				let dialogue = [
				"*CYAN*The lich laughs.\n",
				"*PINK*Lich*GREY*: *CYAN*You were a fool to approach me.\n",
				"*PINK*Lich*GREY*: *CYAN*Away with you, pest.\n",
				"*PINK*Lich*GREY*: *CYAN*Perish.\n"
				];
				msg += dialogue[rand(dialogue.length)];
				msg += "*PINK*The Lich touches the " + Name(targets[indexOne]) + " with a skeletal hand\n";
				msg += DealDamage(new M_Attack(Math.floor(targets[indexOne].HP/5) + 42 + rand(15), 30), allies, enemy, targets, targets[indexOne])[0];
			}
			else if (enemy.HP > 25) {
				let ran = rand(5);
				if (numDead < 3) {
					ran = rand(4);
				}
				let skeletons = ["Skeletal Swordsman", "Skeletal Archer", "Skeletal Spearman"];
				if (ran < 3) {
					enemy.HP -= 10;
					for (let i = 0; i < 2; i++) {
						msg += "*PINK*The Lich breaks a bone from its body, and forms it into a " + skeletons[ran] + "!\n";
						allies.push(summon(skeletons[ran], enemy.ROW));
					}
				}
				if (ran == 3) {
					msg += "*PINK*Black blood falls from the Lich to the dirt, and two Zombies rise!\n";
					enemy.HP -= 10;
					for (let i = 0; i < 2; i++) {
						allies.push(summon("zombie", enemy.ROW));
					}
				}
				if (ran == 4) {
					msg += "*PINK*The lich raises the dead!\n";
					let respawns = [];
					for (const character of deadAllies) {
						if (character.TYPE != "plant" && character.TYPE != "evil" && character.TYPE != "construction") {
							respawns.push(character);
						}
					}
					for (const character of deadTargets) {
						if (character.TYPE != "plant" && character.TYPE != "evil" && character.TYPE != "construction") {
							respawns.push(character);
						}	
					}
					for (const character of respawns) {
						character.TYPE = "evil";
						msg += "*CYAN*The corpse of " + Name(character) + " is zombified and raised again by the Lich!\n";
						let zombie = summon("zombie", character.ROW);
						zombie.MaxHP = character.MaxHP;
						zombie.HP = Math.ceil(MaxHP(zombie)/2);
						allies.push(zombie);
					}
				}
			}
		}
		else if (eName == "Imp") {
			let indexOne = findVictim(enemy.ROW, targets, 1);
			if (indexOne > -1) {
				msg += "*PINK*" + name + " gnaws on " + Name(targets[indexOne]) + "!\n";
				msg += DealDamage(new P_Attack(6 + rand(15), 95, 30), allies, enemy, targets, targets[indexOne])[0];
			}
			else {
				let ran = rand(2);
				if (ran == 0) {
					msg += "*PINK*The imp shrieks!\n";
				}
				else {
					msg += "*PINK*The imp runs around wildly!\n";
					moveToRow(enemy, rand(5));
				}
			}
		}
		else if (eName == "Crazed Wolf") {
			let indexTwo = findVictim(enemy.ROW, targets, 2);
			let indexOne = findVictim(enemy.ROW, targets, 1);
			let enraged = hasEffect(enemy, "enraged");
			if (!enraged && enemy.HP < MaxHP(enemy)/2) {
				msg += AddEffect(enemy, "enraged", 999);
			}
			if (indexOne == -1 && indexTwo > -1) {
				msg += moveToRow(enemy, targets[indexTwo].ROW);
				if (enemy.ROW == targets[indexTwo].ROW) {
					msg += "*PINK*" + name + " snaps at " + Name(targets[indexTwo]) + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 90), allies, enemy, targets, targets[indexTwo]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[indexTwo], "bleed", 1, enemy);
					}
				}
			}
			else if (indexOne > -1) {
				let result = DealDamage(new P_Attack(10 + rand(7), 90, 25), allies, enemy, targets, targets[indexOne]);
				if (enraged) {
					msg += "*PINK*" + name + " bites " + Name(targets[indexOne]) + " savagely!\n";
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[indexOne], "bleed", 3, enemy);
					}
				}
				else {
					msg += "*PINK*" + name + " bites " + Name(targets[indexOne]) + "!\n";
					msg += result[0];
				}
			}
			else {
				msg += moveInRange(enemy, targets, 1);
			}
		}
		else if (eName == "Swamp Ape") {
			let ran = rand(4);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 16 + rand(9), 90))[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("punches", 10 + rand(15), 75))[0];
			}
		}
		else if (eName == "Wild Bear") {
			AddEffect(enemy, "blocking", 999);
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 16 + rand(13), 90))[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("swipes their claws at", 10 + rand(11), 75, 0, 2))[0];
			}
		}
		else if (eName == "Swarm of Bees") {
			msg = moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*The swarm stings " + Name(targets[index]) + ".\n";
				result = DealDamage(new T_Attack(1), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += "*PINK*" + Name(targets[index]) + " is poisoned!\n";
					AddEffect(targets[index], "Poison", 3, enemy);
				}
			}
		}
		else if (eName == "Giant Frog") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index == -1) {
				let ran = rand(2);
				index = findVictim(enemy.ROW, targets, 4);
				if (ran == 0 && index > -1) {
					msg += "*PINK*The Giant Frog flicks its tongue at " + Name(targets[index]) + ".\n";
					result = DealDamage(new P_Attack(6 + rand(7), 100), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += "*PINK*" + Name(targets[index]) + " is pulled towards the Giant Frog!\n";
						targets[index].ROW = enemy.ROW;
					}
				}
				else {
					index = findVictim(enemy.ROW, targets, 6);
					if (index > -1 && index != enemy.ROW) {
						msg += "The *PINK*Giant Frog *GREY*hops!\n";
						enemy.ROW = index;
					}
					else {
						msg += moveAttack(allies, enemy, targets, new Attack("chomps", 10 + rand(11), 90))[0];
					}
				}
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("chomps", 10 + rand(11), 90))[0];
			}
		}
		else if (eName == "Brigand Lord") {
			let ran = rand(6);
			if (ran == 0) {
				msg += "*PINK*" + name + " steals from his foes and grows stronger!\n";
				let HPSteal = 0;
				for (let i = 0; i < targets.length; i++) {
					HPSteal += Math.min(targets[i].HP, 5);
					if (targets[i].TYPE == "player") {
						targets[i].GOLD -= 5;
						enemy.PHASE += 5;
						if (targets[i].GOLD < 0) {
							targets[i].GOLD = 0;
						}
					}
				}
				HPSteal = Math.min(HPSteal, 30);
				enemy.MaxHP = Math.min(125, enemy.MaxHP + HPSteal);
				msg += Heal(enemy, HPSteal);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new P_Move(12 + rand(9), 90, 10, "stabs", 1, 3), "strong")[0];
			}
		}
		else if (eName == "Mossy Statue") {
			if (enemy.PHASE < 3) {
				let options = [
					"*YELLOW*The statue seems to hum. . .\n",
					"*YELLOW*The statue seems alive. . .\n",
					"*YELLOW*The weathered face of the statue seems to be looking at you. . .\n"
				]
				msg = options[enemy.PHASE];
			}
			else if (enemy.PHASE < 6) {
				msg = "*PINK*The hum is beginning to grow painfully shrill. . .\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(enemy.PHASE), allies, enemy, targets, targets[i])[0];
				}
			}
			else {
				msg = "*PINK*The statue shrieks, as if crying in pain!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(enemy.PHASE), allies, enemy, targets, targets[i])[0];
				}
				enemy.PHASE += rand(3);
			}
			enemy.PHASE++;
		}
		else if (eName == "Impling Druid") {
			let ran = rand(3);
			if (allies.length == 1) {
				ran = 2;
			}
			if (ran == 0) {
				msg += "*PINK*The Impling Druid casts a spell to buff its ally!\n";
				//Buff an ally
				let index = rand(allies.length);
				while (index == enemyIndex)
				{
					index = rand(allies.length);
				}
				let buffs = ["regenerative", "enraged", "invincible", "stoneskin", "deliverance", "greater reflect", "stronger"];
				msg += AddEffect(allies[index], buffs[rand(buffs.length)], 1, enemy);
			}
			else if (ran == 1) {
				//Debuff an enemy
				let index = rand(targets.length);
				msg += "*PINK*The Impling Druid raises its staff menacingly at " + Name(targets[index]) + "!\n";
				let debuffs = ["stunned", "wilting", "disorganized", "bleed", "blinded", "slowed", "weakened", "vulnerable", "poison", "rooted", "venom", "winded"];
				msg += AddEffect(targets[index], debuffs[rand(debuffs.length)], 1, enemy);
			}
			else {
				//Damage an enemy
				let index = findVictim(enemy.ROW, targets, 5);
				msg += "*PINK*The Impling Druid conjures a ball of fire, and launches it at " + Name(targets[index]) + "!\n";
				msg += DealDamage(new M_Attack(8 + rand(5)), allies, enemy, targets, targets[index])[0];
			}
		}
		else if (eName == "Water Elemental") {
			let dialogues = [
				"*BLUE*The Water Elemental spins happily.\n",
				"*BLUE*The Water Elemental dances.\n",
				"*BLUE*The Water Elemental sings a low, splashing song.\n",
				"*BLUE*The Water Elemental splashes around.\n",
			];
			msg += dialogues[rand(dialogues.length)];
			let victims = [];
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == enemy.ROW) {
					victims.push(i);
				}
			}
			if (victims.length > 0) {
				enemy.PHASE++;
				msg += "*RED*All of those near the Water Elemental are scalded by cursed water!\n";
				for (const victim of victims) {
					msg += DealDamage(new T_Attack((6 * enemy.PHASE) + 12 + rand(11)), allies, enemy, targets, targets[victim])[0];
				}
			}
		}
		else if (eName == "Swamp Demon") {
			let ran = rand(5);
			let enemyIndex = -1;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].TYPE == "player" || targets[i].TYPE == "servant" && targets[i].ROW == enemy.ROW) {
					enemyIndex = i;
					break;
				}
			}
			if (enemyIndex == -1 && ran > 1) {
				ran = rand(2);
			}
			if (ran == 0) {
				msg += "*BLUE*The Swamp Demon floods Row " + (max + 1) + " with cursed water!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == max) {
						msg += DealDamage(new T_Attack(8 + rand(9)), allies, enemy, targets, targets[i])[0];
					}
				}
				msg += "*BLUE*Two Water Elementals form from the Cursed Water!\n";
				allies.push(summon("Water Elemental", max));
			}
			else if (ran == 1) { 
				msg += "*PINK*The Swamp Demon's flesh contorts into a mass of grasping tentacles, that burst out to grab its foes!\n";
				for (let i = 0; i < targets.length; i++) {
					let result = DealDamage(new P_Attack(12 + rand(11), 80, 30), allies, enemy, targets, targets[i]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[i], "rooted", 1, enemy);
					}
				}
			}
			else {
				msg += "*RED*A gnarled hand writhes from the Swamp Demon's flesh, shimmering with demonic energy, and reaches to touch " + Name(targets[enemyIndex]) + ".\n";
				msg += DealDamage(new M_Attack(18 + rand(11)), allies, enemy, targets, targets[enemyIndex])[0];
			}
			msg += moveInRange(enemy, targets, 1);
			if (ran == 0 && rows[max] > 0) {
				msg = "*PINK*The Swamp Demon floods Row " + (max + 1) + " with cursed water!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == max) {
						msg += DealDamage(new M_Attack(8 + rand(9)), allies, enemy, targets, targets[i])[0];
					}
				}
			}
			else if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new Attack("touches", 4 + rand(25), 85, 1))[0];
			}
			else if (ran == 2) {
				msg += "*PINK*The Swamp Demon summons a Living Vine!\n";
				allies.push(summon("living vine", enemy.ROW));
			}
		}
		else if (eName == "Mimic") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				if (hasEffect(targets[index], "rooted")) {
					msg += "*PINK*" + name + " bites " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(Math.floor(enemy.MaxHP/10) + 10 + rand(7), 100, 50), allies, enemy, targets, targets[index])[0];
				}
				else {
					msg += "*PINK*" + name + " grabs " + Name(targets[index]) + " with their tongue!\n";
					msg += AddEffect(targets[index], "rooted", 3, enemy);
				}
			}
			else {
				msg += moveInRange(enemy, targets, 1);
			}
		}
		else if (eName == "Forest Demon") {
			let ran = rand(5);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("touches", 4 + rand(25), 85, 1))[0];
			}
			else if (ran < 4) {
				msg += moveAttack(allies, enemy, targets, new Attack("spits fire at", 10 + rand(9), 85, 0, 4))[0];
			}
			else {
				msg += "*PINK*The Forest Demon summons a Briar Beast!\n";
				allies.push(summon("briar beast", enemy.ROW));
			}
		}
		else if (eName == "Cultist") {
			msg += moveAttack(allies, enemy, targets, new Attack("shanks", 4 + rand(5), 85, 0, 4))[0];
		}
		else if (eName == "Warded Totem") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*" + name + " emits a static burst!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(4 + rand(5), 50), allies, enemy, targets, targets[i])[0]; 
				}
			}
			else if (ran == 1) {
				msg += "*PINK*The runes on " + name + " glow as it saps energy from its foes!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].TYPE == "player") {
						targets[i].STAMINA -= 20;
						if (targets[i].STAMINA < 0) {
							targets[i].STAMINA = 0;
						}
					}
				}
			}
			else if (ran == 2) {
				let index = findVictim(enemy.ROW, targets, 5);
				msg += "*PINK*The warded totem shocks " + Name(targets[index]) + "\n";
				msg += DealDamage(new M_Attack(8 + rand(5)), allies, enemy, targets, targets[index])[0];
			}
		}
		else if (eName == "Cult Leader") {
			let index = findVictim(enemy.ROW, targets, 1, "strong");
			let numCultists = 0;
			let empowered = false;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME == "Cultist") {
					numCultists++;
					if (hasEffect(allies[i], "stronger")) {
						empowered = true;
					}
				}
			}
			let ran = rand(5);
			if (numCultists == 0 || ran <= 1) {
				msg += "*PINK*" + name + " calls forth Cultists!\n";
				allies.push(summon("Cultist", enemy.ROW));
				allies.push(summon("Cultist", enemy.ROW));
			}
			else if (ran != 4 && numCultists < 5) {
				if (index > -1) {
					msg += "*PINK*The Cult Leader stabs " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(22 + 4 * enemy.PHASE + rand(7), 90, 30), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Bleed", 3, enemy);
					}
				}
				else {
					msg += moveInRange(enemy, targets, 1);
				}
			}
			else {
				ran = rand(2);
				if (ran == 1 && !empowered) {
					msg += "*PINK*" + name + " inspires his Cult!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].NAME == "Cultist") {
							AddEffect(allies[i], "Stronger", 2, enemy);
						}
					}
				}
				else {
					msg += "*PINK*" + name + " sacrifices his Cult to grow more powerful!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].NAME == "Cultist") {
							allies[i].HP = 0;
							msg += Heal(enemy, 20, true);
							enemy.PHASE++;
						}
					}
				}
			}
		}
		else if (eName == "Fumous Fiend") {
			let ran = rand(3);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("hits", 12 + rand(13), 85))[0];
			}
			else {
				msg = "*PINK*" + name + " enshrouds the battlefield in toxic fumes!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new T_Attack(2 + rand(5)), allies, enemy, targets, targets[i])[0]; 
					AddEffect(targets[i], "Venom", 3, enemy);
					AddEffect(targets[i], "Poison", 3, enemy);
				}
			}
		}
		else if (eName == "Scaled Drake") {
			let ran = rand(3);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 14 + rand(15), 75), "strong")[0];
			}
			else {
				msg = "*PINK*" + name + " breathes fire across ";
				let rowNames = [];
				for (let i = 0; i < 5; i++) {
					if (max > enemy.ROW && i >= enemy.ROW) {
						rowNames.push(i);
					}
					else if (max < enemy.ROW && i <= enemy.ROW) {
						rowNames.push(i);
					}
					else {
						if (i <= enemy.ROW && enemy.ROW > 2) {
							rowNames.push(i);
						}
						else if (i >= enemy.ROW && enemy.ROW < 3) {
							rowNames.push(i);
						}
					}
				}
				for (let i = 0; i < rowNames.length; i++) {
					msg += "R" + (rowNames[i] + 1);
					if (rowNames.length >= 2 && i <= rowNames.length - 2) {
						if (rowNames.length > 2) {
							msg += ",";
						}
						if (i == rowNames.length - 2) {
							msg += " and";
						}
						msg += " ";
					}
				}
				msg += "!\n";
				for (let i = 0; i < targets.length; i++) {
					if (rowNames.indexOf(targets[i].ROW) > -1) {
						msg += DealDamage(new M_Attack(6 + rand(7), 50), allies, enemy, targets, targets[i])[0];
					}
				}
			}
		}
		else if (eName == "Beekeeper") {
			let indexThree = findVictim(enemy.ROW, targets, 3, "strong");
			let numBees = 0;
			let ran = rand(2);
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME == "Swarm of Bees") {
					numBees++;
				}
			}
			if (indexThree > -1 && ran == 0) {
				msg += "*PINK*The Beekeeper throws a jar of honey at " + Name(targets[indexThree]) + "!\n";
				let result = DealDamage(new P_Attack(12 + rand(11), 90), allies, enemy, targets, targets[indexThree]);
				msg += result[0];
				if (result[1] > 0) {
					msg += AddEffect(targets[indexThree], "coated in honey", 1, enemy);
					msg += AddEffect(targets[indexThree], "slowed", 1, enemy);
					msg += AddEffect(targets[indexThree], "weakened", 1, enemy);
				}
			}
			else {
				ran = rand(4);
				if (numBees <= 4 || ran == 0) {
					let n = 3 + rand(3);
					msg += "*PINK*The Beekeeper summons swarms of bees!\n";
					for (let i = 0; i < n; i++) {
						allies.push(summon("Swarm of Bees", rand(5)));
					}
				}
				else if (ran == 1) {
					msg += "*PINK*The Beekeeper strengthens his swarm!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].NAME == "Swarm of Bees") {
							allies[i].MaxHP += 2;
							allies[i].HP += 2;
							msg += Heal(allies[i], 4);
							AddEffect(allies[i], "Stronger", 2, enemy);
						}
					}
				}
				else if (ran == 2) {
					msg += "*PINK*" + name + " collects honey from his swarm!\n";
					msg += Heal(enemy, 5 * numBees);
				}
				else {
					msg += moveInRange(enemy, targets, 3, "kite");
				}
			}
		}
		else if (eName == "Houndlord") {
			let numHounds = 0;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].HP > 0 && allies[i].NAME == "Crazed Wolf") {
					numHounds++;
				}
			}
			if (numHounds < 4) {
				msg += "*PINK*The Houndlord summons crazed wolves!\n";
				allies.push(summon("Crazed Wolf", enemy.ROW));
				allies.push(summon("Crazed Wolf", enemy.ROW));
			}
			else {
				let ran = rand(2);
				if (ran == 0) {
				msg += "*PINK*The Houndlord buffs his hounds!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].HP > 0 && allies[i].NAME == "Crazed Wolf") {
							msg += Heal(allies[i], 10, true);
							AddEffect(allies[i], "Stronger", 2, enemy);
						}
					}
				}
				else {
					msg += moveAttack(allies, enemy, targets, new Attack("cuts", 10 + rand(9), 90, 0, 2))[0];
				}
			}
		}
		else if (eName == "Swamp Mage") {
			let ran = rand(2);
			let indexThree = findVictim(enemy.ROW, targets, 3);
			if (indexThree > -1 && ran == 0) {
				msg += "*PINK*" + name + " casts Swamp Strike on " + Name(targets[indexThree]) + ", poisoning them!\n";
				let result = DealDamage(new M_Attack(8 + rand(5)), allies, enemy, targets, targets[indexThree]);
				msg += result[0];
				if (result[1] > 0) {
					for (let i = 0; i < 3; i++) {
						AddEffect(targets[indexThree], "Poison", 4, enemy);
					}
				}
			}
			else {
				ran = rand(3);
				if (ran == 0) {
					let numWounded = 0;
					for (const ally of allies) {
						if (ally.HP < MaxHP(ally)) {
							numWounded++;
						}
						else {
							for (const effect of ally.EFFECTS) {
								if (effect.type == "debuff") {
									numWounded++;
									break;
								}
							}
						}
					}
					if (numWounded < 2) {
						ran = 1;
					}
					else {
						msg += "*PINK*" + name + " heals her allies, cleansing their debuffs!\n";
						for (let i = 0; i < allies.length; i++) {
							if (allies[i].HP > 0) {
								msg += Heal(allies[i], 5);
								removeDebuffs(allies[i]);
							}
						}
					}
				}
				if (ran == 1) {
					ran = rand(3);
					let summons = ["Giant Frog", "Living Vine", "Swamp Stalker"];
					msg += "*PINK*" + name + " summons a " + summons[ran] + "!\n";
					allies.push(summon(summons[ran], rand(5), true, 3));
				}
				if (ran == 2) {
					msg += moveInRange(enemy, targets, min);
				}
			}
		}
		else if (eName == "Living Vine") {
			let ran = rand(2);
			let index = findVictim(enemy.ROW, targets, 3);
			if (index > -1) {
				msg += "*PINK*" + name + " tangles " + Name(targets[index]) + "!\n";
				let result = DealDamage(new P_Attack(8 + rand(9)), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] && ran == 0) {
					msg += AddEffect(targets[index], "rooted", 1, enemy);
				}
			}
			else {
				msg = moveInRange(enemy, targets, 3, "kite");
			}
		}
		else if (eName == "Witch") {
			let indexThree = findVictim(enemy.ROW, targets, 3);
			let indexOne = findVictim(enemy.ROW, targets, 1);
			let ran = rand(3);
			if (indexOne > -1 && ran < 2) {
				msg += "*PINK*The Witch hexes " + Name(targets[indexOne]) + "!\n";
				msg += DealDamage(new M_Attack(14 + rand(7)), allies, enemy, targets, targets[indexOne])[0];
			}
			else if (indexThree > -1 && ran < 2) {
				ran = rand(2);
				if (false && ran == 0) {
					msg += "*PINK*The Witch pulls a potion from her belt and throws it at " + Name(targets[indexThree]) + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 85), allies, enemy, targets, targets[indexThree]);
					msg += result[0];
					if (result[1] > 0) {
						let potionEffects = ["stunned", "weakened", "vulnerable", "slowed"];
						let potion = rand(potionEffects.length);
						let duration = 3;
						if (potion == 0) {
							duration = 1;
						}
						msg += AddEffect(targets[indexThree], potionEffects[potion], duration, enemy);
					}
				}
				else {
					msg += "*PINK*The Witch curses " + Name(targets[indexThree]) + ", poisoning them!\n";
					msg += DealDamage(new M_Attack(4 + rand(7)), allies, enemy, targets, targets[indexThree])[0];
					for (let i = 0; i < 5; i++) {
						AddEffect(targets[indexThree], "poison", 3, enemy);
					}
				}
			}
			else if (ran == 2) {
				let poisonStacks = 0;
				for (let i = 0; i < targets.length; i++) {
					poisonStacks += countEffect(targets[i], "poison");
				}
				if (poisonStacks >= targets.length * 4) {
					msg += "*PINK*The Witch harvests poison from the blood of her foes!\n";
					let numHeal = poisonStacks;
					for (let i = 0; i < targets.length; i++) {
						let poison = hasEffect(targets[i], "poison");
						if (poison) {
							msg += DealDamage(new M_Attack(3 * poison.stacks), allies, enemy, targets, targets[i])[0];
							RemoveEffect(targets[i], "poison", true);
						}
					}
					msg += Heal(enemy, poisonStacks);
				}
				else {
					let ran = rand(3);
					if (indexThree == -1 && ran == 0) {
						msg += moveInRange(enemy, targets, 3, "kite");
					}
					else {
						msg += "*PINK*The Witch curses all of her foes, poisoning them!\n";
						for (let i = 0; i < targets.length; i++) {
							AddEffect(targets[i], "poison", 3, enemy, null, 5);
						}
					}
				}
			}
			else {
				if (enemy.ROW == min) {
					msg += "*PINK*The Witch tends to her wounds!\n";
					msg += Heal(enemy, 8);
				}
				else {
					msg += moveToRow(enemy, min);
				}
			}
		}
		else if (eName == "Goblin Warlord") {
			let ran = rand(5);
			let index = -1;
			let numGoblins = 0;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME.substring(0, "Goblin".length) == "Goblin") {
					numGoblins++;
				}
			}
			if (numGoblins <= 2) {
				ran = 2 + rand(3);
			}
			else if (numGoblins > 4) {
				ran = rand(2);
			}
			if (numGoblins > 2) {
				index = findVictim(enemy.ROW, targets, 2);
			}
			if ((ran == 0 && numGoblins > 4) || index > -1) {
				msg += moveAttack(allies, enemy, targets, new Attack("hammers", 8 + rand(11), 90, 0, 3, 2, 50), "strong")[0];
			}
			else if (ran == 1) {
				msg += "*PINK*The Goblin Warlord rallies his Horde, healing and strengthening them!\n";
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME.substring(0, "Goblin".length) == "Goblin") {
						AddEffect(allies[i], "Stronger", 2, enemy);
						Heal(allies[i], 5);
					}
				}
			}
			else if (ran == 2) {
				msg += "*CYAN*The Goblin Warlord blows his horn, and Swordsmen ambush from behind!\n";	
				for (let i = 0; i < 2; i++) {
					allies.push(summon("Goblin Swordsman", max, false));
				}
			}
			else if (ran == 3) {
				msg += "*CYAN*The Goblin Warlord blows his horn, and Spearmen march forth!\n";
				for (let i = 0; i < 2; i++) {
					allies.push(summon("Goblin Spearman", enemy.ROW, false));
				}
			}
			else {
				msg += "*CYAN*The Goblin Warlord blows his horn, and Archers emerge from hiding!\n";
				for (let i = 0; i < 2; i++) {
					allies.push(summon("Goblin Archer", min, false));
				}
			}
		}
		else if (eName == "Briar Beast") {
			if (hasEffect(enemy, "buried")) {
				return "";
			}
			if (enemy.HP < MaxHP(enemy)/3) {
				msg += "*PINK*" + name + " buries its body in the ground!\n";
				msg += AddEffect(enemy, "Buried", 3);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("wallops", 8 + rand(5), 80, 0, 1, 1, 40))[0];
			}
		}
		else if (eName == "Briar Monster") {
			if (hasEffect(enemy, "buried")) {
				return "";
			}
			if (enemy.HP < MaxHP(enemy)/4) {
				msg += "*PINK*" + name + " buries its body in the ground!\n";
				msg += AddEffect(enemy, "Buried", 3);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("wallops", 16 + rand(9), 80, 0, 1, 1, 50))[0];
			}
		}
		else if (eName == "Fae Trickster") {
			let index = findVictim(enemy.ROW, targets, 6);
			if (index > -1 && targets[index].ROW != enemy.ROW) {
				msg += "The *PINK*Fae Trickster *GREY*teleports!\n";
				enemy.ROW = targets[index].ROW;
			}
			let numPlayers = 0;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].TYPE == "player") {
					numPlayers++;
				}
			}
			let ran = rand(4);
			if (numPlayers == 0) {
				ran = rand(2);
			}
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("zaps", 8 + rand(7), 100, 1))[0];
			}
			else if (ran == 1 || ran == 2) {
				let debuffs = [];
				for (const effect of effects) {
					if (effect.type == "debuff") {
						debuffs.push(effect.name);
					}
				}
				msg += "*PINK*The Fae Trickster pranks all of its foes!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += AddEffect(targets[i], debuffs[rand(debuffs.length)], 1, enemy);
				}
			}
			else {
				let verbs = ["snickers", "chortles", "chuckles", "laughs", "cackles", "giggles", "guffaws"];
				msg += "*PINK*The Fae Trickster " + verbs[rand(verbs.length)] + "!\n";
			}
		}
		else if (eName == "Caustic Snail") {
			if (hasEffect(enemy, "healing in shell")) {
				return "";
			}
			let ran = rand(2);
			if (ran == 0 && enemy.HP < enemy.MaxHP/2.5) {
				msg += AddEffect(enemy, "Healing in Shell", 3);
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + name + " chomps at " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(16 + rand(9), 50), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Venom", 3, enemy);
					}
				}
				msg += moveInRange(enemy, targets, 1);
			}
		}
		else if (eName == "Wandering Moon") {
			if (enemy.HP <= 15) {
				let ran = rand(4);
				if (ran == 0) {
					msg += "The light of the *PINK*Wandering Moon*GREY* dims. . .\n";
				}
				else if (ran == 1) {
					msg += "A muffled scraping can be heard within the *PINK*Wandering Moon*GREY*. . .\n";
				}
				else if (ran == 2) {
					msg += "The glow of the *PINK*Wandering Moon*GREY* flickers. . .\n";
				}
				else if (ran == 3) {
					msg += "Pieces of the *PINK*Wandering Moon's*GREY* exterior click in place as it reconstitutes itself.\n";
					msg += Heal(enemy, 10);
				}
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index == -1) {
					msg += moveAttack(allies, enemy, targets, new Attack("shines a focused beam at", 14 + rand(11), 100, MAGICAL, 1, 3), "strong")[0];
				}
				else {
					let ran = rand(2);
					if (ran == 0) {
						msg += moveAttack(allies, enemy, targets, new Attack("rams into", 12 + rand(11), 75, PHYSICAL, 1, 1, 50))[0];
					}
					else {
						msg += moveAttack(allies, enemy, targets, new Attack("shines a focused beam at", 8 + rand(9), 100, MAGICAL, 1, 3), "strong")[0];
					}
				}
			}
		}
		else if (eName == "Brigand") {
			let ran = rand(4);
			if (enemy.HP < 10) {
				if (enemy.ROW == 4) {
					msg += "The brigand flees!\n";
					allies.splice(enemyIndex, 1);
				}
				else {
					msg += "The brigand is trying to flee!\n";
					msg += moveToRow(enemy, 4);
				}
			}
			else {
				let indexOne = findVictim(enemy.ROW, targets, 1);
				let ran = rand(3);
				if (indexOne == -1 && ran == 0) {
					msg += "*PINK*The brigand steals 5 gold from each member of the party!\n";
					for (let i = 0; i < targets.length; i++) {
						if (targets[i].TYPE == "player") {
							targets[i].GOLD -= 5;
							enemy.PHASE += 5;
							if (targets[i].GOLD < 0) {
								targets[i].GOLD = 0;
							}
						}
					}
				}
				else {
					msg += moveAttack(allies, enemy, targets, new Attack("strikes", 8 + rand(7), 90, 0, 2, 1, 20))[0];
				}
			}
		}
		else if (eName == "Slugbeast") {
			msg += moveAttack(allies, enemy, targets, new Attack("chomps", 22 + rand(11), 33, 1), "strong")[0];
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == enemy.ROW) {
					msg += "*PINK*" + Prettify(Name(targets[i])) + " is slowed by the Slugbeasts's slime!\n";
					AddEffect(targets[i], "Slowed", 1, enemy);
				}
			}
		}
		else if (eName == "Foul Sluglord") {
			let index = findVictim(enemy.ROW, targets, 1);
			let ran = rand(3);
			if (index > -1) {
				if (ran > 0) {
					msg += moveAttack(allies, enemy, targets, new Attack("chomps", 42 + rand(17), 20, 1), "strong")[0];
				}
				else {
					msg += "*PINK*" + name + " writhes onto " + Name(targets[index]) + ", pressing them against the ground!\n";
					let result = DealDamage(new P_Attack(12 + rand(9), 100, 30), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						ran = rand(2);
						if (ran == 0) {
							msg += AddEffect(targets[index], "rooted", 1, enemy);
						}
						else {
							msg += AddEffect(targets[index], "stunned", 1, enemy);
						}
					}
				}
			}
			else {
				msg = moveInRange(enemy, targets, 1);
			}
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == enemy.ROW) {
					msg += "*PINK*" + Prettify(Name(targets[i])) + " is slowed by the Foul Sluglord's slime!\n";
					AddEffect(targets[i], "Slowed", 1, enemy);
				}
			}
		}
		else if (eName == "Anchorite Worm") {
			msg = moveInRange(enemy, targets, 1);
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*" + name + " wriggles into " + Name(targets[index]) + "!\n";
				AddEffect(targets[index], "Infested", 999, enemy);
				enemy.HP = 0;
			}
		}
		else if (eName == "Tube Snail") {
			msg = moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*The Tube Snail's spine stabs into " + Name(targets[index]) + "!\n";
				let worm = false;
				for (let i = 0; i < 3; i++) {
					msg += DealDamage(new P_Attack(2 + rand(5), 90, 50), allies, enemy, targets, targets[index])[0];
					if (rand(3) == 0) {
						worm = true;
						AddEffect(targets[index], "Infested", 999, enemy);
					}
				}
				if (worm) {
					msg += "*PINK*" + Name(targets[index]) + " feels unwell. . .\n";
				}
			}
		}
		else if (eName == "Swarmer Shark") {
			let hasAttacked = false;
			for (let i = 0; i < targets.length; i++) {
				if (hasEffect(targets[i], "bleed")) {
					msg += "*PINK*" + name + " is frenzied by the smell of blood!\n";
					if (enemy.ROW == targets[i].ROW) {
						hasAttacked = true;
						msg += "*PINK*" + name + " tears into " + Name(targets[i]) + "!\n";
						let result = DealDamage(new P_Attack(12 + rand(9), 75, 30), allies, enemy, targets, targets[i]);
						msg += result[0];
						if (result[1] > 0) {
							msg += AddEffect(targets[i], "Bleed", 1, enemy);
						}
					}
					else {
						msg += moveToRow(enemy, targets[i].ROW);
					}
					break;
				}
			}
			if (!hasAttacked) {
				let result = moveAttack(allies, enemy, targets, new Attack("bites", 8 + rand(7), 85));
				msg += result[0];
				if (result[1]) {
					msg += AddEffect(result[1], "Bleed", 1, enemy);
				}
			}
		}
		else if (eName == "Coral Shard") {
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == enemy.ROW) {
					if (rand(4) == 0) {
						msg += "*PINK*" + Name(targets[i]) + " cuts themself on the sharp Coral Shard!\n";
						let result = DealDamage(new P_Attack(4 + rand(3)), allies, enemy, targets, targets[i]);
						msg += result[0];
						if (result[1] > 0) {
							msg += AddEffect(targets[i], "Bleed", 1, enemy);
						}
					}
				}
			}
		}
		else if (eName == "Giant Anemone") {
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == enemy.ROW) {
					msg += "*PINK*" + Name(targets[i]) + " is shocked by the Giant Anemone!\n";
					msg += DealDamage(new P_Attack(4 + rand(3)), allies, enemy, targets, targets[i])[0];
					if (rand(4) == 0) {
						msg += AddEffect(targets[i], "Stunned", 1, enemy);
					}
				}
			}
		}
		else if (eName == "Sea Sorceror") {
			let ran = rand(3);
			let indexThree = findVictim(enemy.ROW, targets, 3, "strong");
			if (indexThree == -1) {
				ran = 1 + rand(2);
			}
			if (allies.length < 3) {
				ran = 1;
			}
			if (ran == 0) {
				msg += "*PINK*" + name + " casts Water Bubble Blast!\n";
				msg += DealDamage(new M_Attack(6 + rand(7)), allies, enemy, targets, targets[indexThree])[0];
			}
			if (ran == 1) {
				let options = ["Coral Shard", "Giant Anemone"];
				for (let i = 0; i < 2; i++) {
					let en = options[rand(2)];
					msg += "*PINK*" + name + " summons a " + en + "!\n";
					allies.push(summon(en, rand(5)));
				}
			}
			if (ran == 2) {
				msg += "*PINK*" + name + " empowers the nearby sea life!\n";
				for (let i = 0; i < allies.length; i++) {
					AddEffect(allies[i], "Stronger", 1, enemy);
				}
			}
		}
		else if (eName == "Tidliwincus") {
			let foundPlayer = false;
			let isEnamoured = false;
			for (const effect of enemy.EFFECTS) {
				if (effect.name.toLowerCase().includes("enamoured")) {
					isEnamoured = true;
					for (let i = 0; i < targets.length; i++) {
						if (effect.target.ID == targets[i].ID) {
							foundPlayer = true;
							if (targets[i].ROW != enemy.ROW) {
								moveToRow(enemy, targets[i].ROW);
							}
							else {
								let ran = rand(3);
								let row = rand(5);
								if (row == enemy.ROW || ran == 0) {
									msg += "*PINK*" + name + " lovingly pecks " + Name(targets[i]) + "!\n";
									msg += DealDamage(new P_Attack(8 + rand(9), 90, 50), allies, enemy, targets, targets[i])[0];
								}
								else {
									msg += "*PINK*" + name + " drags " + Name(targets[i]) + ", stunning them!\n";
									AddEffect(targets[i], "Stunned", 1, enemy);
									msg += DealDamage(new P_Attack(2, + rand(3)), allies, enemy, targets, targets[i])[0];
									msg += moveToRow(enemy, row);
									targets[i].ROW = enemy.ROW;
								}
							}
						}
					}
				}
			}
			if (!foundPlayer) {
				if (isEnamoured) {
					msg += "*PINK*" + name + " sulks . . .\n";
				}
				else {
					let target = targets[rand(targets.length)];
					msg += "*PINK*" + name + " has become enamoured with " + Name(target) + "!\n";
					AddEffect(enemy, "Enamoured with", 999, null, target);
				}
			}
		}
		else if (eName == "Living Tide") {
			let hpCutOff = 25 + rand(12);
			if (enemy.HP < hpCutOff) {
				let num = 10 + rand(10);
				if (enemy.ROW != min) {
					num = Math.floor(num/2);
					msg += moveToRow(enemy, min);
				}
				msg += "*PINK*Water flows into the body of " + name + "!\n";
				msg += Heal(enemy, num);
			}
			else {
				let ran = rand(2);
				let indexThree = findVictim(enemy.ROW, targets, 3, "strong");
				let indexOne = findVictim(enemy.ROW, targets, 1, "strong");
				if (indexOne > -1) {
					ran = 3 + rand(2);
				}
				else if (indexThree > -1) {
					ran = rand(3);
				}
				if (ran == 0) { // Global Range
					msg += "*PINK*Water flows out of the Living Tide and innundates its foes, slowing them!\n"
					for (let i = 0; i < targets.length; i++) {
						msg += DealDamage(new M_Attack(4 + rand(5)), allies, enemy, targets, targets[i])[0];
						AddEffect(targets[i], "Slowed", 1, enemy);
					}
				}
				if (ran == 1) { // Global Range
					msg += "*PINK*Water flows out of the Living Tide and a mighty wave washes over the battlefield!\n";
					for (let i = 0; i < targets.length; i++) {
						if (targets[i].ROW < 4) {
							targets[i].ROW++;
							msg += Prettify(Name(targets[i])) + " is pushed back!\n";
						}
						msg += DealDamage(new M_Attack(6 + rand(7)), allies, enemy, targets, targets[i])[0];
					}
				}
				if (ran == 2) { // 3 Range
					msg += "*PINK*Water flows out of the Living Tide and whips " + Name(targets[indexThree]) + "!\n";
					msg += DealDamage(new M_Attack(8 + rand(6)), allies, enemy, targets, targets[indexThree])[0];
				}
				if (ran == 3) { // 1 Range
					msg += "*PINK*Water flows out of the Living Tide and strikes " + Name(targets[indexOne]) + " in a powerful jet!\n";
					msg += DealDamage(new M_Attack(14 + rand(9)), allies, enemy, targets, targets[indexOne])[0];
					for (let i = 0; i < 2; i++) {
						msg += PushTarget(enemy, targets[indexOne]);
					}
				}
				if (ran == 4) { // 1 Range
					msg += "*PINK*Water flows out of the Living Tide and crashes onto " + Name(targets[indexOne]) + ", drowning them and reducing their Stamina!\n";
					targets[indexOne].STAMINA = Math.max(0, targets[indexOne].STAMINA - 15);
					for (let i = 0; i < 4; i++) {
						msg += DealDamage(new M_Attack(2 + rand(5)), allies, enemy, targets, targets[indexOne])[0];
					}
				}
				enemy.HP -= (5 + rand(6));
			}
		}
		else if (eName == "Squallbird") {
			let ran = rand(3);
			msg += "*PINK*" + name + " dives fiendishly at its foe!\n";
			if (ran == 0) {
				msg += moveInRange(enemy, targets, 1);
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + name + " pecks " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(12 + rand(9), 90, 25), allies, enemy, targets, targets[index])[0];
				}
			}
			else if (min != enemy.ROW && ran == 1) {
				msg += "*PINK*" + name + " flies away from the commotion!\n";
				msg += moveToRow(enemy, min);
			}
			else {
				msg += "*PINK*" + name + " squawks loudly!\n";
			}
		}
		else if (eName == "Reef Crab") {
			msg += moveAttack(allies, enemy, targets, new Attack("pinches", 8 + rand(7), 85))[0];
		}
		else if (eName == "Squelcher") {
			let index = findVictim(enemy.ROW, targets, 3);
			if (index > -1) {
				msg += "*PINK*" + name + " sprays a strong jet of water at " + Name(targets[index]) + "!\n";
				msg += DealDamage(new P_Attack(8 + rand(9), 90), allies,enemy, targets, targets[index])[0];
			}
			else {
				msg += moveInRange(enemy, targets, 3, "kite");
			}
			let ran = rand(3);
			if (ran == 0) {
				let dialogue = ["*PINK*The squelcher squeals. . .\n", "*PINK*The squelcher makes a gargling sound. . .\n", "*PINK*The squelcher makes a clicking noise. . .\n"];
				msg += dialogue[rand(dialogue.length)];
			}
			else {
				msg += moveInRange(enemy, targets, 3, "kite");
			}
		}
		else if (eName == "Sunfish") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*" + name + " emits a burst of blinding light!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(2 + rand(5)), allies,enemy, targets, targets[i])[0];
					msg += Prettify(Name(targets[i])) + " is blinded!\n";
					AddEffect(targets[i], "Blinded", 1, enemy);
				}
			}
			msg += "*PINK*" + name + " hurries away towards safety!\n";
			msg += moveToRow(enemy, min);
		}
		else if (eName == "Coral Crawler") {
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME == "Anchorite Worm") {
					msg += "*PINK*" + name + " eats the Anchorite Worm!\n";
					allies[i].HP = 0;
					break;
				}
			}
			if (enemy.HP < enemy.MaxHP || rand(10) == 0) {
				let result = moveAttack(allies, enemy, targets, new Attack("stings", 2 + rand(7), 85));
				msg += result[0];
				if (result[1]) {
					msg += AddEffect(result[1], "Venom", 1, enemy);	
				}
			}
			else {
				ran = rand(2);
				if (enemy.ROW == 4 || (ran == 0 && enemy.ROW > 0)) {
					enemy.ROW--;
					msg += "*PINK*" + name + " skitters gently back.\n";
				}
				else {
					enemy.ROW++;
					msg += "*PINK*" + name + " skitters gently forward.\n";
				}	
			}
		}
		else if (eName == "Mariner") {
			let ran = rand(6);
			if (ran == 0) {
				msg += "*GREEN*The mariner seems grateful to be free.\n";
			}
			else if (ran == 1) {
				msg += "*GREEN*The mariner sobs. . .\n";
			}
			msg += moveAttack(allies, enemy, targets, new Attack("punches", 6 + rand(9), 75, 0, 1, 1, 20))[0];
		}
		else if (eName == "Lost Mariner") {
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("scratches", 8 + rand(7), 75))[0];
			}
			if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 12 + rand(9), 95))[0];
			}
			ran = rand(5);
			if (ran == 0) {
				msg += "*PINK*The Lost Mariner lets out an agonized moan.\n";
			}
		}
		else if (eName == "Fishman Archer") {
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 4 + rand(8), 90, 0, 2, 6, 20), "strong")[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 4 + rand(8), 90, 0, 2, 6, 20), "weak")[0];
			}
		}
		else if (eName == "Fishman Tridentier") {
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 10 + rand(7), 75, 0, 2, 2, 25))[0];
		}
		else if (eName == "Sea Priest" || eName == "Sea Priestess") {
			let ran = rand(4);
			let numAllies = 0;
			let numWoundedOrDebuffed = 0;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].HP > 0) {
					numAllies++;
					if (allies[i].HP < allies[i].MaxHP) {
						numWoundedOrDebuffed++;
					}
					else {
						for (const effect of allies[i].EFFECTS) {
							if (effect.type == "debuff") {
								numWoundedOrDebuffed++;
								break;
							}
						}
					}
				}
			}
			if (numAllies > 6) {
				
			}
			ran = 1 + rand(3);
			if (numWoundedOrDebuffed / numAllies < .5) {
				ran = rand(3);
			}
			if (ran == 0) {
				let enemies = ["reef crab", "coral crawler", "sunfish", "squallbird", "squelcher"];
				let index = rand(enemies.length);
				msg += "" + name + " forms a " + Prettify(enemies[index]) + " out of the sea foam!\n";
				allies.push(summon(enemies[index], enemy.ROW));
			}
			else if (ran == 1) {
				let words = ["I shall wash ye in the waters of the earth.", "Prepare to be baptised."];
				msg += "\n*PINK*" + Name(enemy) + ": *GREY*" + words[rand(2)] + "\n\n";
				msg += "*PINK*They point their Driftwood Staff and a mighty wave washes over the battlefield!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW < 4) {
						targets[i].ROW++;
						msg += Prettify(Name(targets[i])) + " is pushed back!\n";
					}
					msg += DealDamage(new M_Attack(6 + rand(7)), allies, enemy, targets, targets[i])[0];
				}
			}
			else if (ran == 2) {
				let index = rand(targets.length);
				msg += "*PINK*" + name + " raises their Driftwood Staff and freezes " + Name(targets[index]) + "!\n";
				AddEffect(targets[index], "Stunned", 1, enemy);
			}
			else if (ran == 3) {
				let words = ["Let the waters clean you, my children.", "Be cleansed, my children."];
				msg += "\n*PINK*" + Name(enemy) + ": *GREY*" + words[rand(2)] + "\n\n";
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].HP > 0) {
						msg += Heal(allies[i], 5);
						removeDebuffs(allies[i]);
					}
				}
			}
		}
		else if (eName == "Stone Crab") {
			msg += moveAttack(allies, enemy, targets, new Attack("pinches", 12 + rand(11), 85))[0];
		}
		else if (eName == "Reefwalker") {
			let ran = rand(2);
			if (ran == 0) {
				let crab = false
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME.toLowerCase().includes("crab") & allies[i].HP > 0) {
						msg += "*PINK*" + name + " swings its strong beak at " + Name(allies[i]) + "!\n";
						msg += DealDamage(new P_Attack(12 + rand(11), 90, 100), allies, enemy, targets, allies[i])[0];
						crab = true;
						break;
					}
				}
				if (!crab) {
					ran = 1;
				}
			}
			if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new Attack("swings its strong beak at", 12 + rand(11), 90, 0, 1, 2, 90))[0];
			}
		}
		else if (eName == "Risen Whale") {
			let ran = rand(3);
			let indexThree = findVictim(enemy.ROW, targets, 3, "strong");
			if (indexThree == -1) {
				ran = rand(2);
			}
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 14 + rand(14), 90, 0, 1, 1, 20))[0];
			}
			if (ran == 1) {
				let dmg = Math.floor(enemy.MaxHP - enemy.HP)/10;
				if (dmg < 8) {
					msg += "*PINK*A foul smell taints the air, though the worst of it remains trapped in bloated pockets of the Risen Whale's rotten flesh.\n"
				}
				else if (dmg < 15) {
					msg += "*PINK*The stench of the risen whale spreads over the battlefield, of rotten flesh, seeping out of the Risen Whale's many wounds.\n"
				}
				else {
					msg += "*PINK*The air is putrid, tainted by the terrible decay of the Risen Whale!\n";
				}
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(1 + dmg), allies, enemy, targets, targets[i])[0];
				}
			}
			if (ran == 2) {
				msg += "*PINK*The Risen Whale emits an ear-splitting barrage of clicks, stunning " + Name(targets[indexThree]) + "!\n";
				msg += DealDamage(new M_Attack(8 + rand(7)), allies, enemy, targets, targets[indexThree])[0];
				AddEffect(targets[indexThree], "Stunned", 1, enemy);
				for (let i = 0; i < targets.length; i++) {
					if (i != indexThree) {
						msg += DealDamage(new M_Attack(3 + rand(4)), allies, enemy, targets, targets[i])[0];
					}
				}
			}
		}
		else if (eName == "Deep Horror") {
			for (let i = 0; i < targets.length; i++) {
				if (Math.abs(targets[i].ROW - enemy.ROW) < 2) {
					msg += "*PINK*" + Prettify(Name(targets[i])) + " is sucked into the Pressure Field!\n";
					msg += DealDamage(new M_Attack(8), allies, enemy, targets, targets[i])[0];
					targets[i].ROW = enemy.ROW;
				}
			}
			let ran = rand(3);
			if (ran == 0) {
				let possible = [];
				for (let i = 0; i < targets.length; i++) {
					if (Math.abs(targets[i].ROW - enemy.ROW) > 2) {
						possible.push(i);
					}
				}
				if (possible.length > 0) {
					let index = rand(possible.length);
					msg += "*PINK*" + name + " augments its pressure field to pull " + Name(targets[index]) + " closer!\n";
					msg += DealDamage(new M_Attack(8), allies, enemy, targets, targets[index])[0];
					targets[index].ROW = enemy.ROW;
				}
				else {
					ran = 1;
				}
			}
			if (ran != 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("crushes", 10 + rand(7), 100, 1))[0];
			}
		}
		else if (eName == "Kurita") {
			let numAllies = 0;
			let closest = -1;
			for (let i = 0; i < allies.length; i++) {
				if (i != enemyIndex && allies[i].HP > 0) {
					if (closest == -1 || Math.abs(allies[i].ROW - enemy.ROW) < Math.abs(allies[closest].ROW - enemy.ROW)) {
						closest = i;
					}
					numAllies++;
				}
			}
			let ran = rand(3);
			if (numAllies == 0) {
				ran = 1;
			}
			if (ran == 0) {
				if (allies[closest].ROW == enemy.ROW) {
					for (let i = 0; i < 4; i++) {
						if (allies[closest].HP > 0) {
							msg += "*PINK*" + name + " bites " + Name(allies[closest]) + "!\n";
							msg += DealDamage(new P_Attack(8 + rand(9), 90, 20), allies, enemy, allies, allies[closest])[0];
						}
						else {
							allies[closest].HP = 0;
						}
					}
				}
				else {
					msg += moveToRow(enemy, allies[closest].ROW);
				}
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 8 + rand(9), 90, 0, 4, 1, 20))[0];
			}
		}
		else if (eName == "Carcinos") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += moveAttack(allies, enemy, targets, new Attack("pinches", 14 + rand(9), 85, 50))[0];
			}
			else {
				let ran = rand(2);
				let foundCrab = false;
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME.toLowerCase().includes("crab")) {
						foundCrab = true;
						if (allies[i].ROW != enemy.ROW) {
							msg += moveToRow(enemy, allies[i].ROW);
						}
						if (allies[i].ROW == enemy.ROW) {
							msg += "*PINK*Carcinos seems to be inspecting the crab on R" + (enemy.ROW + 1) + ".\n";
						}
					}
				}
				if (ran == 0) {
					let options = ["Carcinos speaks in a chittering, clicky language. . .", "Carcinos seems annoyed. . .", "Carcinos doesn't seem interested in fighting.", "Carcinos seems to only be focused on its work."];
					msg += "*PINK*" + options[rand(3)];
				}
				else if (!foundCrab) {
					msg += "*PINK*Carcinos paces. . .\n";
					msg += moveToRow(enemy, rand(5));
				}
			}
		}
		else if (eName == "Siren") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*A beautifully alluring pitch emits from " + name + " drawing its foes closer!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == enemy.ROW) {
						msg += "*PINK*" + Prettify(Name(targets[i])) + " is entranced by the pitch and is stunned!\n";
						AddEffect(targets[i], "Stunned", 1, enemy);
					}
					else {
						msg += "*PINK*" + Prettify(Name(targets[i])) + " is entranced by the pitch and moves towards " + name + "!\n" 
						if (targets[i].ROW > enemy.ROW) {
							targets[i].ROW--;
						}
						else {
							targets[i].ROW++;
						}
					}
				}
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + name + " chomps down on " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(16 + rand(13), 90, 50), allies, enemy, targets, targets[index])[0];
				}
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("chomps", 16 + rand(11), 90, 0, 1, 1, 50))[0];
			}
			
		}
		else if (eName == "Dirge") {
			let buffs = numBuffs(enemy);
			let abilities = ["Stronger", "Aura", "Regenerative", "Minor Reflect", "Greater Reflect", "Destructive Synergy", "Restorative Synergy"];
			for (let i = 0; i < abilities.length; i++) {
				if (!hasEffect(enemy, abilities[i])) {
					AddEffect(enemy, abilities[i], 7);
					msg += "*PINK*The Dirge's skin shifts and shimmers, and lines like a rune's appear. It gains the effect '" + abilities[i] + "'!\n";
					break;
				}
			}
			
			if (buffs < 6) {
				let index = findVictim(enemy.ROW, targets, 2);
				if (index > -1) {
					msg += moveAttack(allies, enemy, targets, new Attack("stings", 4 + rand(5), 90, 0, 3, 2, 10))[0];
				}
				msg += moveToRow(enemy, min);
				msg += "*PINK*The Dirge seems hesitant to fight. . .\n";
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("stings", 4 + rand(5), 90, 0, 3, 2, 10))[0];
			}
		}
		else if (eName == "Wadrin's Lizard") {
			let ran = rand(3);
			if (ran == 0) {
				let result = moveAttack(allies, enemy, targets, new Attack("tears into", 4 + rand(7), 80, 0, 3));
				msg += result[0];
				if (result[1]) {
					msg += AddEffect(result[1], "Bleed", 3, enemy);
				}
			}
			if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new Attack("savagely bites", 12 + rand(11), 90, 0, 1, 1, 30))[0];
			}
			else {
				let result = moveAttack(allies, enemy, targets, new Attack("swipes their massive tail at", 10 + rand(9), 90, 0, 1, 2, 50));
				msg += result[0];
				if (result[1]) {
					if (result[1].TYPE == "player") {
						msg += AddEffect(result[1], "winded", 3, enemy);
						result[1].STAMINA = Math.max(0, result[1].STAMINA - 20);
					}
				}
			}
		}
		else if (eName == "Hiveling Healer") {
			if (rand(3) ==  0) {
				msg += "*PINK*" + name + " chitters!\n";
			}
			let ran = rand(3);
			if (ran == 0) {
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME.toLowerCase().includes("hiveling")) {
						msg += Heal(allies[i], 4);
					}
				}
			}
			else if (ran == 1) {
				let max = -1;
				let maxVal = 0;
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME.toLowerCase().includes("hiveling")) {
						let current = MaxHP(allies[i]) - allies[i].HP;
						if (current > maxVal) {
							max = i;
							maxVal = current;
						}
					}
				}
				if (max > -1) {
					msg += Heal(allies[max], 12);
				}
			}
			else {
				msg += moveToRow(enemy, min);
			}
		}
		else if (eName == "Hiveling Warrior") {
			if (rand(3) ==  0) {
				msg += "*PINK*" + name + " chitters!\n";
			}
			msg += moveInRange(enemy, targets, 1);
			//let indexThree = findVictim(enemy.ROW, targets, 3);
			let indexOne = findVictim(enemy.ROW, targets, 1);
			let ran = rand(3);
			if (indexOne > -1) {
				msg += "*PINK*" + name + " bites " + Name(targets[indexOne]) + "!\n";
				msg += DealDamage(new P_Attack(16 + rand(11), 80, 35), allies, enemy, targets, targets[indexOne])[0];
			}
			//else if (indexThree > -1 && ran != 0) {
			//	msg += "*PINK*" + name + " spits acid at " + Name(targets[indexThree]) + "!\n";
			//	msg += DealDamage(new P_Attack(9 + rand(7), 75, 100), allies, enemy, targets, targets[indexThree])[0];
			//}
		}
		else if (eName == "Hiveling Spitter") {
			let indexThree = findVictim(enemy.ROW, targets, 3);
			if (indexThree > -1) {
				msg += "*PINK*" + name + " spits acid at " + Name(targets[indexThree]) + "!\n";
				msg += DealDamage(new P_Attack(14 + rand(9), 85, 70), allies, enemy, targets, targets[indexThree])[0];
			}
			else {
				msg += moveInRange(enemy, targets, 3);
			}
			if (indexThree > -1) {
				msg += moveToRow(enemy, min);
			}
		}
		else if (eName == "Hiveling Larva") {
			let ran = rand(10);
			if (ran < 4) {
				msg += "*PINK*The Hiveling Larva scurries!\n";
				msg += moveToRow(enemy, min);
			}
			else if (ran < 8) {
				msg += moveToRow(enemy, rand(6));
			}
			else {
				ran = rand(100);
				let hiveling = "";
				if (rand(100) == 0) {
					hiveling = "Hiveling Queen";
				}
				else {
					let hivelings = ["Hiveling Warrior", "Hiveling Spitter", "Hiveling Guard", "Hiveling Healer"];
					hiveling = hivelings[rand(hivelings.length)];
				}
				hiveling = summon(hiveling, enemy.ROW, false);
				msg += "*PINK*" + name + " grows into a " + hiveling.NAME + "!\n";
				enemy.NAME = hiveling.NAME;
				enemy.HP = Math.round(enemy.HP/enemy.MaxHP * hiveling.MaxHP);
				enemy.MaxHP = hiveling.MaxHP;
				enemy.ARMOR = hiveling.ARMOR;
			}
		}
		else if (eName == "Hiveling Queen") {
			if (rand(3) ==  0) {
				msg += "*PINK*" + name + " chitters!\n";
			}
			let indexThree = findVictim(enemy.ROW, targets, 3);
			let ran = rand(12);
			if (ran == 0) {
				msg += "*PINK*" + name + " gives birth to a brood of Hiveling Larva!\n";
				let ran = 4 + rand(7);
				for (let i = 0; i < ran; i++) {
					allies.push(summon("Hiveling Larva", enemy.ROW));
				}
			}
			else if (indexThree > -1 && ran < 4) {
				msg += "*PINK*" + name + " spits acid at " + Name(targets[indexThree]) + "!\n";
				msg += DealDamage(new P_Attack(8 + rand(7), 85, 100), allies, enemy, targets, targets[indexThree])[0];
			}
			else {
				msg += moveToRow(enemy, min);
			}
		}
		else if (eName == "Hiveling Guard") {
			if (rand(3) == 0) {
				msg += "*PINK*" + name + " chitters!\n";
			}
			let guarding = hasEffect(enemy, "guarding");
			if (guarding) {
				return msg;
			}
			//Queens, Healers, Larva, Warriors
			let unguarded = [[], [], [], []];
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME.toLowerCase().includes("hiveling")) {
					let found = false;
					for (let j = 0; j < allies.length; j++) {
						let guarding = hasEffect(allies[j], "guarding");
						if (guarding && guarding.target.ID == allies[i].ID) {
							found = true;
							break;
						}
					}
					if (!found) {
						if (allies[i].NAME == "Hiveling Queen" || allies[i].TYPE == "player") {
							unguarded[0].push(i);
						}
						if (allies[i].NAME == "Hiveling Healer") {
							unguarded[1].push(i);
						}
						if (allies[i].NAME == "Hiveling Larva") {
							unguarded[2].push(i);
						}
						if (allies[i].NAME == "Hiveling Spitter") {
							unguarded[3].push(i);
						}
						if (allies[i].NAME == "Hiveling Warrior") {
							unguarded[3].push(i);
						}
					}
				}
			}
			if (unguarded[0].length + unguarded[1].length + unguarded[2].length + unguarded[3].length == 0) {
				let indexOne = findVictim(enemy.ROW, targets, 1);
				if (indexOne > -1) {
					msg += "*PINK*" + name + " bites " + Name(targets[indexOne]) + "!\n";
					msg += DealDamage(new P_Attack(6 + rand(5), 75, 25), allies, enemy, targets, targets[indexOne])[0];
				}
				else {
					msg += moveInRange(enemy, targets, 1);
				}
			}
			else {
				for (let i = 0; i < unguarded.length; i++) {
					if (unguarded[i].length > 0) {
						let target = unguarded[i][rand(unguarded[i].length)];
						if (allies[target].ROW != enemy.ROW) {
							msg += moveToRow(enemy, allies[target].ROW);
						}
						if (allies[target].ROW == enemy.ROW) {
							msg += AddEffect(enemy, "guarding", 999, null, allies[target]);
						}
						return msg;
					}
				}
			}
		}
		else if (eName == "Elder Succubus") {
			console.log(enemy.NAME + " phase " + enemy.PHASE);
			let prefix = "*YELLOW*Elder Succubus: *GREY*";
			if (enemy.PHASE == 0) {
				msg = prefix + "Ah, you've shown me such a good time. I hate to end it now, but tell me first. . . am I still pretty?\n\n";
				msg += AddEffect(enemy, "deliverance", 999, null, null, 25);
				enemy.PHASE++;
			}
			else if (enemy.PHASE == 1) { //8
				msg = "*CYAN*The Elder Succubus stretches, her soft bones creak and pop. Then, she raises her hands, and a strange feeling comes over you. . .\n\n";
				for (let i = 0; i < targets.length; i++) {
					let dmg = 20 + rand(11);
					if (targets[i].TYPE != "player") {
						dmg *= 3;
					}
					else {
						enemy.HP += 40;
						enemy.MaxHP += 40;
					}
					msg += DealDamage(new T_Attack(dmg), allies, enemy, targets, targets[i])[0];
					msg += AddEffect(targets[i], "fading", 8, enemy);
					enemy.MaxHP += 10;
					enemy.HP += 10;
				}
				enemy.PHASE++;
			}
			else if (enemy.PHASE == 2) { //7
				msg += prefix + "I'm truly impressed by your endurance. I can't believe you're still ready to go. Alas, if I was a thousand years younger. . .\n\n";
				msg += moveToRow(enemy, 2) + "\n\n";
				for (let i = 0; i < targets.length; i++) {
					msg += AddEffect(targets[i], "bleed", 6);
					msg += AddEffect(targets[i], "venom", 6);
					msg += AddEffect(targets[i], "poison", 6);
				}
				enemy.PHASE++;
			}
			else if (enemy.PHASE == 3) { //6
				msg += prefix + "Our time together is almost up. . .\n\n";
				msg += Heal(enemy, 100);
				msg += AddEffect(enemy, "jade", 3);
				msg += "\n*CYAN*A ring of black flames begins expanding out of Row 3!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == 2) {
						msg += DealDamage(new T_Attack(15), allies, enemy, targets, targets[i])[0];
					}
				}
				enemy.PHASE++;
			}
			else if (enemy.PHASE == 4) { //5
				msg += prefix + "Once you're dead, I'm going to wear your skin.\n\n";
				msg += "\n*CYAN*The ring of black fire expands to Row 2 and Row 4!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == 1 || targets[i].ROW == 3) {
						msg += DealDamage(new T_Attack(20), allies, enemy, targets, targets[i])[0];
					}
				}
				enemy.PHASE++;
			}
			else if (enemy.PHASE == 5) { //4
				msg += prefix + "I think you can do without those buffs of yours. In fact, I think I'll take them!\n\n";
				for (let i = 0; i < targets.length; i++) {
					for (let j = targets[i].EFFECTS.length - 1; j >= 0; j--) {
						let effect = targets[i].EFFECTS[j];
						if (effect.type == "buff" && effect.name != "Ember" && effect.name != "Fading" && effect.target == null) {
							msg += AddEffect(enemy, effect.name, effect.duration, null, effect.target, effect.stacks);
							RemoveEffect(targets[i], effect.name, true);
						}
					}
				}
				msg += "\n*CYAN*The ring of black fire expands to Row 1 and Row 5!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == 0 || targets[i].ROW == 4) {
						msg += DealDamage(new T_Attack(25), allies, enemy, targets, targets[i])[0];
					}
				}
				msg += "\n";	
				enemy.PHASE++;
			}
			else if (enemy.PHASE == 6) {
				let max = 0;
				for (let i = 0; i < targets.length; i++) {
					if (targets[max].REPORT.damage > targets[i].REPORT.damage) {
						max = i;
					}
				}
				msg += moveToRow(enemy, targets[max].ROW);
				
				msg += "*CYAN*The Elder Succubus stabs her fingers into " + Name(targets[max]) + "!\n\n";
				let result = DealDamage(new P_Attack(15 + rand(11), 100, 30), allies, enemy, targets, targets[max]);
				msg += result[0];
				if (result[1] < 0) {
					msg += prefix + "There's no escaping me!\n\n";
					msg += DealDamage(new M_Attack(5 + rand(6), 30), allies, enemy, targets, targets[max]);
				}
				enemy.PHASE++;
			}
			else if (enemy.PHASE == 7) { //3
				msg += "*CYAN*Her bloody sinews twist and stretch and a wretched force bursts from her outstretched hands!\n\n";
				let nums = [0, 0, 0, 0, 0];
				for (let i = 0; i < targets.length; i++) {
					for (let j = 0; j < 5; j++) {
						msg += PushTarget(enemy, targets[i]);
					}
					nums[targets[i].ROW]++;
					msg += DealDamage(new M_Attack(10 + rand(11), 30), allies, enemy, targets, targets[i])[0]; 
				}
				let max = 0;
				for (let i = 1; i < 5; i++) {
					if (nums[i] > nums[max]) {
						max = i;
					}
				}
				msg += "*CYAN*Black flames ignite on row " + (max + 1) + "!\n\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == max) {
						msg += DealDamage(new M_Attack(Math.floor(targets[i].HP/2)), allies, enemy, targets, targets[i])[0];
					}
				}
				enemy.PHASE++;
			}
			else if (enemy.PHASE >= 8) { //2
				if (enemy.PHASE == 10) {
					msg += prefix + "You're still alive?! What devilry is this?\n";
				}
				if (enemy.PHASE % 2 == 1) { //2
					msg += moveToRow(enemy, rand(5));
					msg += "*CYAN*The Elder Succubus swipes her hand out, and a wave of energy distorts the air as it travels!\n\n";
					for (let i = 0; i < targets.length; i++) {
						let dmg = 20 + rand(11);
						if (targets[i].TYPE != "player") {
							dmg *= 3;
						}
						msg += DealDamage(new M_Attack(20 + rand(11)), allies, enemy, targets, targets[i])[0]; 
					}
				}
				else { //1
					let index = findVictim(enemy.ROW, targets, 3, "strong");
					if (index == -1) {
						index = rand(targets.length);
					}
					msg += moveToRow(enemy, targets[index].ROW);
					msg += "*CYAN*The Elder Succubus sucks the life from " + Name(targets[index]) + "!\n";
					msg += DealDamage(new M_Attack(25 + rand(11)), allies, enemy, targets, targets[index])[0]
					msg += Heal(enemy, 15);
					msg += AddEffect(targets[index], "wilting", 3, enemy);
				}
				enemy.PHASE++;
			}
		}
		else if (eName == "Beautiful Woman") {
			console.log(enemy.NAME + " phase " + enemy.PHASE);
			let prefix = "*YELLOW*Beautiful Woman: *GREY*";
			let playerIndices = [];
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].TYPE == "player") {
					playerIndices.push(i);
				}
			}
			if (enemy.PHASE < 7 && enemy.HP > MaxHP(enemy) - 100) {
				if (enemy.PHASE > 5) {
					for (let i = 0; i < targets.length; i++) {
						msg += DealDamage(new T_Attack(30), allies, enemy, targets, targets[i])[0];
					}
				}
				else {
					let dialogue = [
						"*CYAN*The Beautiful Woman holds up her arms, examining the back of her hands with delight. She laughs pleasantly.",
						prefix + "It's been four hundred years since I've felt the sun and the wind. . .",
						prefix + "I'll be forever in your debt for freeing me. . . Please, accept this meager blessing.",
						prefix + "As recompense, I'll grant you the honor of serving me.",
						"*CYAN*The Beautiful Woman closes her eyes and smiles. The woods beyond the walls creak as they wilt, and their leaves rain pale to the ground.",
						prefix + "Don't be afraid. Your souls shall live within my own; for thousands of years you will dwell there, lending me strength."
					];
					msg += dialogue[enemy.PHASE] + "\n\n";
					if (enemy.PHASE == 1) {
						let killed = false;
						for (let i = 0; i < allies.length; i++) {
							if (allies[i].TYPE != "construction" && allies[i].TYPE != "boss") {
								killed = true;
								allies[i].HP = 0;
							}
						}
						if (killed) {
							msg += prefix + ": *GREY*Don't worry. I won't let anyone else hurt you.\n";
							msg += "\n*RED*With a sweep of her hand, all of the plants in the palace wither and die.\n";
						}
					}
					if (enemy.PHASE == 2) {
						for (let i = 0; i < targets.length; i++) {
							if (targets[i].TYPE == "player") {
								msg += "*GREEN*" + Name(targets[i]) + " gains 3 SP!\n"; 
								targets[i].SP += 3;
							}
							targets[i].HP = MaxHP(targets[i]);
						}
					}
					enemy.PHASE++;
				}
			}
			else {
				if (enemy.PHASE > 10 && enemy.PHASE < 18 && enemy.HP < MaxHP(enemy)/2) {
					msg += "*CYAN*The Beautiful Woman retreats to her throne and kneels. Blood runs from her brow, and she is silent. She raises both hands, blasting her foes away.\n"
					enemy.ROW = 4;
					for (let i = 0; i < targets.length; i++) {
						let dmg = 0;
						for (let j = 0; j < 5; j++) {
							if (PushTarget(enemy, targets[i]) != "") {
								dmg += 6;
							}
						}
						msg += DealDamage(new P_Attack(dmg), allies, enemy, targets, targets[i])[0];
					}
					enemy.PHASE = 18;
				}
				let heal = playerIndices.length * 10;
				if (enemy.PHASE == 19) {
					heal *= 2;
				}
				msg += Heal(enemy, heal);
				if (enemy.PHASE < 10) {
					enemy.PHASE = 10;
					msg += prefix + "Fine. If you don't want to serve me, then perish.\n\n";
					enemy.EFFECTS = [];
					msg += AddEffect(enemy, "static", 999, null, 60);
					msg += AddEffect(enemy, "Greater Reflect", 10);
					msg += AddEffect(enemy, "Jade", 10);
					msg += Heal(enemy, 2 * MaxHP(enemy));
				}
				else if (enemy.PHASE == 10) {
					let max = 0;
					for (let i = 0; i < targets.length; i++) {
						if (targets[i].REPORT.damage > targets[max].REPORT.damage) {
							max = i;
						}
					}
					msg += "*CYAN*The Beautiful Woman beckons " + Name(targets[max]) + " closer, as everyone else is stunned!\n\n";
					msg += moveToRow(targets[max], enemy.ROW, true) + "\n";
					for (let i = 0; i < targets.length; i++) {
						if (i != max) {
							AddEffect(targets[i], "stunned", 1, enemy);
						}
					}
					targets[max].ROW = enemy.ROW;
					msg += prefix + "You're strong. I like that, but I'm going to take that from you.\n\n";
					msg += AddEffect(targets[max], "cursed", 3, enemy); 
					msg += AddEffect(targets[max], "weakened", 6, enemy); 
					msg += AddEffect(targets[max], "vulnerable", 6, enemy); 
					msg += AddEffect(targets[max], "disorganized", 6, enemy);
					msg += AddEffect(targets[max], "blinded", 6, enemy);
					enemy.PHASE++;
				}
				else if (enemy.PHASE == 11) {
					msg += prefix + "Pathetic. It took all eleven Lords of the Forest to seal me, and I can sense that their like no longer exists in this world.\n\n";
					for (let i = 0; i < targets.length; i++) {
						msg += DealDamage(new M_Attack(30), allies, enemy, targets, targets[i])[0];
						msg += AddEffect(targets[i], "Wilting", 1, enemy);
						msg += AddEffect(targets[i], "Parched", 1, enemy);
					}
					enemy.PHASE++;
				}
				else if (enemy.PHASE == 12) {
					let index = -1;
					for (let i = 0; i < targets.length; i++) {
						if (hasEffect(targets[i], "cursed")) {
							index = i;
						}
					}
					if (index == -1) {
						msg += prefix + "Oh? Did I kill my plaything already? Oh well.\n\n";
						index = rand(targets.length);
						if (playerIndices.length > 0) {
							index = playerIndices[rand(playerIndices.length)];
						}
						else {
							index = rand(targets.length);
						}
					}
					else {
						msg += prefix + "Did you think I was done with you, pet? I'm going to kill you first!\n\n";
					}
					msg += "*CYAN*The Beautiful Woman rushes towards " + Name(targets[index]) + " and punches them!\n";
					msg += moveToRow(enemy, targets[index].ROW);
					msg += DealDamage(new T_Attack(20 + rand(11), 100, 50), allies, enemy, targets, targets[index])[0];
					msg += "\n*CYAN*The Beautiful Woman throws " + Name(targets[index]) + "!\n\n";
					for (let i = 0; i < 5; i++) {
						msg += PushTarget(enemy, targets[index]);
					}
					msg += DealDamage(new T_Attack(30, 100, 50), allies, enemy, targets, targets[index])[0];
					enemy.PHASE++;
				}
				else if (enemy.PHASE >= 13 && enemy.PHASE < 16) {
					if (targets.length > playerIndices.length) {
						let dialogue = [
							prefix + "My my, there are a lot of you. I'm going to suck the life out of you all.\n\n",
							prefix + "Give it up. You're only making me stronger.\n\n",
							"*CYAN*The Beautiful Woman smiles and laughs!\n\n"
						];
						msg += dialogue[enemy.PHASE - 13];
						for (let i = 0; i < targets.length; i++) {
							let dmg = 25;
							if (targets[i].TYPE != "player") {
								dmg = 50 + 25 * (enemy.PHASE - 13);
							}
							msg += DealDamage(new M_Attack(dmg, 25), allies, enemy, targets, targets[i])[0];
						}
						msg += Heal(enemy, targets.length * 10 + 5 * (enemy.PHASE - 13));
						enemy.PHASE++;
					}
					else {
						msg += prefix + "Prepare to endure incurable pestilence, of a kind that has not plagued the world in centuries.\n";
						for (const i of playerIndices) {
							msg += AddEffect(targets[i], "poison", 3, enemy, null, 18);
							msg += AddEffect(targets[i], "cursed", 2, enemy);
							for (let j = 0; j < targets[i].INVENTORY.length; j++) {
								if (rand(2) == 0 && targets[i].INVENTORY[j].type == "drink") {
									targets[i].INVENTORY[j].name = "Bottle of Ash";
									targets[i].INVENTORY[j].value = 0;
								}
							}
						}
						enemy.PHASE = 16;
					}
				}
				else if (enemy.PHASE == 16) {
					msg += prefix + "I'm impressed you've survived so far; you would have served me well. Here's a blessing, and a curse.\n\n";
					for (let i = 0; i < targets.length; i++) {
						if (targets[i].TYPE == "player") {
							msg += "*GREEN*" + Name(targets[i]) + " gains 3 SP!\n\n"; 
							targets[i].SP += 3;
							targets[i].STAMINA = 0;
							msg += AddEffect(targets[i], "wilting", 3, enemy);
							msg += AddEffect(targets[i], "parched", 3, enemy);
							msg += AddEffect(targets[i], "winded", 3, enemy);
						}
					}
					enemy.PHASE = 17;
				}
				else if (enemy.PHASE == 17) {
					let index = rand(targets.length);
					if (playerIndices.length > 0) {
						index = playerIndices[rand(playerIndices.length)];
					}
					let verb = ["smacks", "chokes", "kicks"];
					msg += "\n*CYAN*The Beautiful Woman rushes towards " + Name(targets[index]) + " and " + verb[rand(3)] + " them!\n";
					msg += moveToRow(enemy, targets[index].ROW);
					let result = DealDamage(new P_Attack(20 + rand(11), 100, 50), allies, enemy, targets, targets[index]);
					msg += result[0];
					msg += "\n";
					if (result[1] > 0) {
						if (rand(2) == 0) {
							msg += AddEffect(targets[index], "weakened", 3, enemy);
						}
						if (rand(2) == 0) {
							msg += AddEffect(targets[index], "weakened",  3, enemy);
						}
						if (rand(2) == 0) {
							msg += AddEffect(targets[index], "vulnerable",  3, enemy);
						}
						if (rand(2) == 0) {
							msg += AddEffect(targets[index], "disorganized",  3, enemy);
						}
					}
				}
				else if (enemy.PHASE == 18) {
					msg += "*CYAN*The Beautiful Woman sits on the wilted grass, as if meditating. She looks up at you, exhaustion in her eyes.\n\n";
					msg += prefix + "Go forth my thralls. These would have been your brothers.\n\n";
					for (let i = 0; i < 2; i++) {
						for (let j = 0; j < 5; j++) {
							allies.push(summon("thrall", j));
						}
					}
					msg += AddEffect(enemy, "Invincible", 999);
					enemy.PHASE++;
				}
				else if (enemy.PHASE == 19) {
					let numThralls = 0;
					for (const ally of allies) {
						if (ally.NAME.toLowerCase() == "thrall") {
							numThralls++;
						}
					}
					if (numThralls == 0) {
						enemy.EFFECTS = [];
						msg += prefix + "I'm still thankful that you freed me. I'm sorry it has to end like this.\n\n";
						msg += "*CYAN*The dirt glows beneath the Beautiful Woman's hand, and an ancient weapon materializes from the earth. It is a strange whip, with the head of a mace, flanged by axe blades. It seems familiar to her.\n\n";
						msg += AddEffect(enemy, "deliverance", 999, null, null, 25);
						msg += Heal(enemy, 75);
						enemy.PHASE++;
					}
				}
				if (enemy.PHASE == 20) {
					msg += "*CYAN*The Beautiful Woman cracks her whip, and the crystal windows burst from the shockwave!\n\n";
					for (let i = 0; i < targets.length; i++) {
						msg += DealDamage(new M_Attack(15 + rand(11)), allies, enemy, targets, targets[i])[0];
						msg += AddEffect(targets[i], "vulnerable", 3, enemy);
						msg += "\n"
					}
					msg += moveToRow(enemy, 2);
					enemy.PHASE++;
				}
				else if (enemy.PHASE >= 21) {
					let dialogue = [
						"",
						prefix + "Die!\n\n",
						"",
						prefix + "I pity you.\n\n",
						"",
						prefix + "This is your end!\n\n"
					];
					if (enemy.PHASE - 21 < dialogue.length) {
						msg += dialogue[enemy.PHASE - 21];
					}
					let indexThree = findVictim(enemy.ROW, targets, 3, "strong");
					if (indexThree == -1) {
						msg += moveToRow(enemy, 2);
					}
					else {
						let ran = rand(4);
						if (ran == 0) {
							msg += "*CYAN*The Beautiful Woman scrapes the blades of her whip across the ground, producing a terrible screech and blinding sparks!\n";
							for (let i = 0; i < targets.length; i++) {
								msg += DealDamage(new M_Attack(10 + rand(11) + 3 * (enemy.PHASE - 21)), allies, enemy, targets, targets[i])[0];
								AddEffect(targets[i], "blinded", 3, enemy);
							}
						}
						else {
							let dmg = 30 + (10 * (enemy.PHASE - 21));
							let swipe = Math.floor(.4 * dmg);
							if (targets[indexThree].TYPE != "player") {
								dmg *= 3;
							}
							msg += "*CYAN*The Beautiful Woman cracks her whip, creating a bone-shattering shockwave!\n";
							let result = DealDamage(new P_Attack(dmg, 100, 25), allies, enemy, targets, targets[indexThree]);
							msg += result[0];
							if (result[1] > 0) {
								AddEffect(targets[indexThree], "whipped", 3, enemy);
								AddEffect(targets[indexThree], "bleed", 3, enemy);
							}
							if (result[1] == 0) {
								msg += prefix + "You're quicker than I expected, I wasn't even close!\n\n";
							}
							if (result[1] < 0) {
								msg += prefix + "Hiding behind a shield? Am I too much for you to handle?\n\n";
							}
							if (result[1] <= 0) {
								msg += "*CYAN*The Beautiful Woman sweeps " + Name(targets[indexThree]) + "'s legs!\n";
								msg += DealDamage(new T_Attack(12 + rand(9)), allies, enemy, targets, targets[indexThree])[0];
							}
							for (let i = 0; i < targets.length; i++) {
								if (i != indexThree && targets[i].ROW == targets[indexThree].ROW) {
									msg += DealDamage(new P_Attack(swipe), allies, enemy, targets, targets[i])[0];
								}
							}
						}
					}
					enemy.PHASE++;
				}
			}
		}
		else if (eName == "Seated Figure") {
			if (++enemy.PHASE % 2 == 0) {
				msg += "*PINK*An Ancient Living Vine detaches itself from the throne!\n";
				let temp = summon("living vine", enemy.ROW);
				temp.HP = 400;
				temp.MaxHP = 400;
				temp.ARMOR = [48, 24];
				allies.push(temp);
			}
		}
		else if (eName == "Thrall") {
			msg += moveAttack(allies, enemy, targets, new Attack("claws at", 14 + rand(7), 80, 0, 1, 1, 25))[0];
		}
		else if (eName == "Treasure Chest") {
			return "";
		}
		else if (enemy.TYPE == "familiar") {
			console.log("Familiar Phase: " + enemy.PHASE);
			let witchIndex = -1;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].CLASS == "witch") {
					witchIndex = i;
					break;
				}
			}
			if (witchIndex == -1) {
				enemy.PHASE = 0;
			}
			else if ((allies[witchIndex].HP < MaxHP(allies[witchIndex])/2 && enemy.HP > MaxHP(enemy)/4) || allies[witchIndex].HP < MaxHP(allies[witchIndex])/4) {
				enemy.PHASE = 1;
			}
			else if (enemy.HP < MaxHP(enemy)/3) {
				enemy.PHASE = 2;
			}
			if (enemy.PHASE == 0) {
				msg += moveInRange(enemy, targets, 1);
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*YELLOW*The familiar scratches " + Name(targets[index]) + " with its talons!\n";
					let result = DealDamage(new P_Attack(Math.floor(MaxHP(enemy)/10) + 3 + rand(5), 90, 50), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "bleed", 3, enemy);
					}
				}
			}
			if (enemy.PHASE == 1) {
				msg += moveToRow(enemy, allies[witchIndex].ROW);
				if (enemy.ROW == allies[witchIndex].ROW) {
					msg += "*YELLOW*The Familiar transfers its life to its master!\n";
					msg += Heal(allies[witchIndex], Math.min(20, enemy.HP * 2));
					enemy.HP -= 10;
				}
			}
			if (enemy.PHASE == 2) {
				let targetRow = min;
				if (witchIndex > -1) {
					targetRow = allies[witchIndex].ROW;
				}
				msg += moveToRow(enemy, targetRow);
				msg += "*YELLOW*The Familiar focuses on its restoration. . .\n";
				msg += Heal(enemy, 10);
				if (enemy.HP > MaxHP(enemy)/2) {
					enemy.PHASE = 0;
				}
			}
			if (enemy.PHASE == 5) {
				let moved = false;
				if (allies[witchIndex].ROW != enemy.ROW) {
					msg += moveToRow(enemy, allies[witchIndex].ROW);
					moved = true;
				}
				if (allies[witchIndex].ROW == enemy.ROW) {
					msg += AddEffect(enemy, "guarding", 999, null, allies[witchIndex]);
				}
				if (!moved) {
					msg += "*CYAN*The Familiar flaps its shadowy wings, sending a gust of wind towards its foes!\n";
					let pushed = false;
					for (let i = 0; i < targets.length; i++) {
						if (targets[i].ROW == 0) {
							msg += PushTarget(enemy, targets[i]);
							pushed = true;
						}
					}
					if (!pushed) {
						msg += PushTarget(enemy, targets[rand(targets.length)]);
					}
				}
			}
		}
		else if (enemy.TYPE == "servant") {
			let bonusDmg = Math.floor(enemy.MaxHP/10);
			msg += moveAttack(allies, enemy, targets, new Attack("strikes", 5 + bonusDmg + rand(4 + bonusDmg), 100, 0, 1, 1, 25))[0];
		}
	}
	return msg;
}

