function Name(target, color = "") {
	if (target.TYPE == "player" || target.NAME == "Carcinos") {
		return color + target.NAME;
	}
	return "the " + color + target.NAME;
}	

function findVictim(row, targets, range, type = "random") {
	if (rand(8) == 0) {
		type = "random";
	}
	let inRange = [];
	let strongest = 0;
	if (targets.length == 0) {
		return -1;
	}
	for (let i = 0; i < targets.length; i++) {
		if (targets[i].HP > 0) {
			if (MaxHP(targets[i].HP) > MaxHP(targets[strongest])) {
				strongest = i;
			}
			if (Math.abs(targets[i].ROW - row) < range) {
				inRange.push(i);
			}
		}
	}
	if (type == "strongest") {
		if (inRange.indexOf(strongest) == -1) {
			return -1;
		}
		return inRange[inRange.indexOf(strongest)];
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

function validZone(enemies, zone) {
	for (const enemy of enemies) {
		if (enemy.ZONES.indexOf(zone) == -1) {
			return false;
		}
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

function desiredRow(enemy, targets, range, type = "close") {
	let min = 999;
	let minRow = enemy.ROW;
	let strongest = 0;
	if (targets.length == 0) {
		return enemy.ROW;
	}
	for (let r = 0; r < 5; r++) {
		let index = findVictim(r, targets, range);
		if (index > -1) {
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

function moveToRow(enemy, targetRow) {
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
		numMoves = Math.min(numMoves, 1);
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

function enemyAttack(enemyIndex, allies, targets, deadAllies, deadTargets) {
	let enemy = allies[enemyIndex];
	//console.log("Attacking: " + Name(enemy));
	let msg = "";
	let max = 0;
	let min = enemy.ROW;
	let rows = [0, 0, 0, 0, 0];
	for (let i = 0; i < targets.length; i++) {
		rows[targets[i].ROW] += targets[i].HP;
	}
	for (let i = 1; i < rows.length; i++) {
		if (rows[i] > rows[max]) {
			max = i;
		}
		if (rows[i] < rows[min]) {
			min = i;
		}
	}
	if (enemy.HP > 0) {
		if (enemy.NAME == "Swarm of Bats") {
			msg += moveAttack(allies, enemy, targets, new Attack("bites", 5 + rand(6), 90, 0, 4, 1), "strong")[0];
			let ran = rand(2);
			if (ran == 0) {
				msg += "The *PINK*Swarm of Bats*GREY* transforms into a *PINK*Vampire*GREY*!\n";
				enemy.NAME = "Vampire"
			}
		}
		else if (enemy.NAME == "Vampire") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " sucks blood from " + Name(targets[index]) + "!\n";
				let result = DealDamage(new P_Attack(6 + rand(11), 90, 50), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += Heal(enemy, Math.floor(result[1]/2));
				}
			}
			let ran = rand(5);
			if (index == -1 || ran == 0) {
				msg += "The *PINK*Vampire *GREY*transforms into a *PINK*Swarm of Bats*GREY*!\n";
				enemy.NAME = "Swarm of Bats";
			}
		}
		else if (enemy.NAME == "Scoundrel") {
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 2 + rand(3), 90, 0, 4, 1))[0];
		}
		else if (enemy.NAME == "Zombie" || enemy.NAME.substring(0, "Zombified".length).toLowerCase() == "zombified") {
			msg += moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				let ran = rand(2);
				if (ran == 0) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " scratches " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(4 + rand(5), 75), allies, enemy, targets, targets[index])[0];
				}
				if (ran == 1) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " bites " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(12 + rand(9), 75), allies, enemy, targets, targets[index])[0];
				}
				if (targets[index].HP <= 0 && MaxHP(targets[index]) > 5) {
					msg += "*PINK*" + Prettify(Name(targets[index])) + " rises as a Zombie!\n";
					let zombie = new Enemy("Zombified " + Name(targets[index]), MaxHP(targets[index]), 0, 0, 20, [0], 5); 
					zombie.SUMMONED = true;
					allies.push(enemy);
				}
			}
		}
		else if (enemy.NAME == "Hungry Ghoul") {
			let ran = 0;
			if (enemy.HP < enemy.MaxHP/2 && allies.length > 1) {
				ran = rand(2);
			}
			msg += moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			if (ran == 0) {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " gnaws on " + Name(targets[index]) + "!\n";
					for (let i = 0; i < 3; i++) {
						msg += DealDamage(new P_Attack(6 + rand(7), 95), allies, enemy, targets, targets[index])[0];
					}
					if (targets[index].HP <= 0) {
						msg += "*PINK*The hungry ghoul consumes the flesh of " + Name(targets[index]) + "!\n";
						msg += Heal(enemy, MaxHP(targets[index]));
					}
				}
			}
			else {
				msg += "*PINK*The hungry ghoul siphons health from its allies!\n";
				for (let i = 0; i < allies.length; i++) {
					if (i != enemyIndex && enemy.HP < enemy.MaxHP ) {
						let result = DealDamage(new M_Attack(5, 100), allies, enemy, allies, allies[i]);
						msg += result[0];
						let dmg = result[1];
						if (dmg > 0) {
							msg += Heal(enemy, dmg);
						}
					}
				}
			}
		}
		else if (enemy.NAME == "Bronze Bellbeast") {
			msg += "*PINK*The Bronze Bellbeast tolls!\n";
			for (let i = 0; i < targets.length; i++) {
				msg += DealDamage(new M_Attack(8 + rand(8)), allies, enemy, targets, targets[i])[0];
			}
		}
		else if (enemy.NAME == "Living Slime") {
			let result = moveAttack(allies, enemy, targets, new Attack("slimes", 4 + rand(5), 80, 0));
			msg += result[0];
			if (result[1] != null) {
				msg += AddEffect(result[1], "Slowed", 1);
			}
		}
		else if (enemy.NAME == "Giant Amoeba") {
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
		else if (enemy.NAME == "Flaming Wisp") {
			let ran = rand(3); 
			if (ran == 0 && enemy.MaxHP < 40) {
				msg += "*CYAN*" + Prettify(Name(enemy)) + " begins to burn brighter. . .\n"
				enemy.MaxHP += 5;
				Heal(enemy, 10);
				enemy.ARMOR[0] += 1;
				enemy.ARMOR[1] += 1;
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("burns", 6 + rand(7), 100, 1, 1, 2))[0];
			}
		}
		else if (enemy.NAME == "Swamp Stalker") {
			let result = moveAttack(allies, enemy, targets, new Attack("grabs", 14 + rand(7), 75, 1, 1, 2));
			msg += result[0];
			if (result[1] != null) {
				msg += "*PINK*" + result[1].NAME + " is rooted in place by " + Prettify(Name(enemy)) + "'s stinging tentacles and is envenomed!\n";
				AddEffect(result[1], "Rooted", 1);
				AddEffect(result[1], "Venom", 3);
			}
			if (rand(3) == 0) {
				msg += "*PINK*The Swamp Stalker hisses. . .\n";
			}
		}
		else if (enemy.NAME == "Ephemeral Warrior") {
			msg += moveAttack(allies, enemy, targets, new Attack("slashes", enemy.MaxHP/10 + rand(9), 85, 0, Math.floor(enemy.MaxHP/10), 2, 100), "strongest")[0];
			msg += "*CYAN*" + Prettify(Name(enemy)) + " begins to fade. . .\n";
			enemy.HP = Math.max(0, enemy.HP - 5);
		}
		else if (enemy.NAME == "Wisp Knight") {
			let ran = rand(5); 
			if (ran == 0) {
				msg += "*CYAN*" + Prettify(Name(enemy)) + " begins to burn brighter. . .\n"
				enemy.MaxHP = Math.min(150, enemy.MaxHP + 10);
				msg += Heal(enemy, 20);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("burns", 10 + rand(11), 100, 1, 3))[0];
			}
		}
		else if (enemy.NAME == "Slimelord") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*A smaller slime drips off of the Slimelord!\n";
				allies.push(summon("Living Slime", enemy.ROW));
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("slimes", 18 + rand(19), 80, 0))[0];
			}
		}
		else if (enemy.NAME == "Apparition") {
			let index = findVictim(enemy.ROW, targets, 6);
			if (index > -1 && targets[index].ROW != enemy.ROW) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " vanishes and reappears!\n";
				enemy.ROW = targets[index].ROW;
			}
			msg += moveAttack(allies, enemy, targets, new Attack("spooks", 4 + rand(5), 100, 1))[0];
		}
		else if (enemy.NAME == "Raging Boar") {
			let ran = rand(2);
			if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " postures and huffs!\n";
				let row = rand(5);
				while (Math.abs(row - enemy.ROW) > 2) {
					row = rand(5);
				}
				msg += moveToRow(enemy, row);
			}
			if (ran == 1) {
				let index = rand(targets.length);
				msg += "*PINK*" + Prettify(Name(enemy)) + " charges!\n";
				let startRow = enemy.ROW;
				msg += moveToRow(enemy, targets[index].ROW);
				if (enemy.ROW == targets[index].ROW) {
					let result = DealDamage(new P_Attack(14 + rand(7), 100, 50), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						let tempRow = enemy.ROW;
						enemy.ROW = startRow;
						for (let i = 0; i < 5; i++) {
							msg += PushTarget(enemy, targets[index]);
						}
						enemy.ROW = tempRow;
					}
				}
			}
		}
		else if (enemy.NAME == "Lost Angel") {
			let ran = 1 + rand(3);
			if (rand(6) == 0) {
				ran = 0;
			}
			if (ran == 0) {
				ran = rand(3);
				if (enemy.HP < enemy.MaxHP) {
					ran = rand(2);
				}
				let dialogue = [
					"*YELLOW*The angel seems hesitant. It looks at its sword with confusion. . .\n",
					"*YELLOW*The angel seems afraid. . .\n",
					"*YELLOW*A look of determination overcomes the angel.\n"
				];
				msg += dialogue[ran];
			}
			if (ran == 1) {
				msg += "*PINK*Blinding spheres of flame rise above the angel; it sweeps its blade, and they're sent forth.\n";
				ran = 2 + rand(3) + Math.floor(targets.length/3);
				for (let i = 0; i < ran; i++) {
					let index = rand(targets.length);
					if (targets[index].HP > 0) {
						msg += DealDamage(new M_Attack(8 + rand(9), 50), allies, enemy, targets, targets[index])[0];
						msg += AddEffect(targets[index], "Blinded", 1);
					}
				}
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (ran > 1 && index == -1) {
				msg += moveInRange(enemy, targets, 1);
			}
			else {
				if (ran == 2) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " unleashes a sweeping blow!\n";
					for (let i = 0; i < targets.length; i++) {
						if (targets[i].ROW == enemy.ROW) {
							msg += DealDamage(new P_Attack(8 + rand(9), 100, 25), allies, enemy, targets, targets[i])[0];
						}
					}
				}
				if (ran == 3) {
					if (targets[index].TYPE == "evil") {
						msg += "*PINK*" + Prettify(Name(enemy)) + " cleanses the evil in its path!\n";
						msg += DealDamage(new P_Attack(100, 100, 100), allies, enemy, targets, targets[index])[0];
					}
					else {
						msg += "*PINK*" + Prettify(Name(enemy)) + " smites " + Name(targets[index]) + "*PINK*!\n";
						msg += DealDamage(new P_Attack(12 + rand(13), 100, 50), allies, enemy, targets, targets[index])[0];
					}
				}
			}
		}
		else if (enemy.NAME == "Giant Spider") {
			let ran = rand(3);
			msg = moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				if (ran < 2) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " bites " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(12 + rand(11), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						AddEffect(targets[index], "Venom", 3);
					}
				}
				if (ran == 2) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " wraps " + Name(targets[index]) + " in their web, stunning them!\n";
					AddEffect(targets[index], "Stunned", 1);
				}
			}
		}
		else if (enemy.NAME == "Spider Queen") {
			let ran = rand(4);
			let index = findVictim(enemy.ROW, targets, 4);
			if (ran == 0) {
				if (index > -1) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " spits venom at " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Venom", 3);
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
			else if (ran == 1 && allies.length < 20) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " lays an egg sac!\n";
				allies.push(summon("Egg Sac", enemy.ROW));
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					if (ran == 2) {
						msg += "*PINK*" + Prettify(Name(enemy)) + " bites " + Name(targets[index]) + "!\n";
						let result = DealDamage(new P_Attack(12 + rand(11), 85), allies, enemy, targets, targets[index]);
						msg += result[0];
						if (result[1] > 0) {
							msg += AddEffect(targets[index], "Venom", 3);
						}
					}
					else if (ran == 3) {
						msg += "*PINK*" + Prettify(Name(enemy)) + " wraps " + Name(targets[index]) + " in their web, stunning them!\n";
						AddEffect(targets[index], "Stunned", 1);
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
		}
		else if (enemy.NAME == "Egg Sac") {
			let ran = rand(10);
			if (ran == 0) {
				msg += DealDamage(new P_Attack(25), allies, enemy, allies, enemy)[0];
			}
		}
		else if (enemy.NAME == "Ogre") {
			msg += moveAttack(allies, enemy, targets, new Attack("bonks", 12 + rand(15), 75, 0, 1, 1, 50))[0];
		}
		else if (enemy.NAME == "Mushroom Mage") {
			let ran = rand(5);
			if (enemy.HP == enemy.MaxHP) {
				ran = rand(3);
			}
			if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " conjures a cloud of toxins!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(4 + rand(7)), allies, enemy, targets, targets[i])[0];
					AddEffect(targets[i], "Poison", 3);
				}
			}
			else if (ran == 1) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " summons Living Spores!\n";
				ran = 1 + rand(4);
				for (let i = 0; i < ran; i++) {
					allies.push(summon("Living Spore", rand(5)));
				}
			}
			else if (ran == 2) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " summons a Toxic Mushroom!\n";
				allies.push(summon("Toxic Mushroom", rand(5)));
			}
			else {
				msg += "*PINK*" + Prettify(Name(enemy)) + " inahles spores and heals!\n";
				msg += Heal(enemy, 6 + rand(7));
			}
		}
		else if (enemy.NAME == "Toxic Mushroom") {
			let ran = rand(3);
			if (enemy.HP <= 10) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " regenerates. . .\n";
				msg += Heal(enemy, 2 + rand(5));
			}
			else if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " unleashes a cloud of toxins!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new P_Attack(2 + rand(3), 100), allies, enemy, targets, targets[i])[0];
					AddEffect(targets[i], "Poison", 3);
				}
			}
			else if (ran == 1) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " belches a puff of Living Spores!\n"
				ran = 1 + rand(3);
				for (let i = 0; i < ran; i++) {
					allies.push(summon("Living Spore", enemy.ROW));
				}
			}
			else if (ran == 2) {
				msg += "*CYAN*" + Prettify(Name(enemy)) + " hardens!\n";
				enemy.ARMOR[0] += 2;
				enemy.ARMOR[1] += 1;
			}
		}
		else if (enemy.NAME == "Living Spore") {
			let ran = rand(15);
			if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " sinks into the earth and sprouts into a Toxic Mushroom!\n";
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
					msg += "*PINK*" + Prettify(Name(enemy)) + " burrows into " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(2 + rand(5), 100), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Poison", 3);
					}
					enemy.HP = 0;
				}
			}
		}
		else if (enemy.NAME == "Baby Spider") {
			msg = moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " bites " + Name(targets[index]) + "!\n";
				let result = DealDamage(new P_Attack(2 + rand(3), 85), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += AddEffect(targets[index], "Poison", 3);
				}
			}
			let ran = rand(15);
			if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " grows into a Giant Spider!\n";
				enemy.NAME = "Giant Spider";
				enemy.MaxHP = 40;
				enemy.ARMOR = [4, 0];
				enemy.HP = Math.round((enemy.HP/10) * enemy.MaxHP);
			}
		}
		else if (enemy.NAME == "Cave Spider") {
			let ran = rand(3);
			let index = findVictim(enemy.ROW, targets, 4);
			if (ran == 0) {
				if (index > -1) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " spits venom at " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Venom", 3);
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " bites " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(10 + rand(11), 75), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Venom", 3);
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
		}
		else if (enemy.NAME == "Skeletal Swordsman") {
			msg += moveAttack(allies, enemy, targets, new Attack("hacks", 8 + rand(5), 65, 0, 2, 2, 10))[0];
		}
		else if (enemy.NAME == "Skeletal Spearman") {
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 12 + rand(7), 75, 0, 1, 2, 25))[0];
		}
		else if (enemy.NAME == "Skeletal Archer") {
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 6 + rand(9), 80, 0, 1, 6, 30), "strong")[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 6 + rand(9), 80, 0, 1, 6, 30), "weak")[0];
			}
		}
		else if (enemy.NAME == "Goblin Swordsman") {
			msg += moveAttack(allies, enemy, targets, new Attack("slashes", 8 + rand(9), 75, 0, 2, 1, 10), "strong")[0];
		}
		else if (enemy.NAME == "Goblin Spearman") {
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 10 + rand(7), 85, 0, 1, 2, 10), "strong")[0];
		}
		else if (enemy.NAME == "Goblin Archer") {
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 6 + rand(9), 90, 0, 1, 6, 20), "strong")[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 6 + rand(9), 90, 0, 1, 6, 20), "weak")[0];
			}
		}
		else if (enemy.NAME == "Flesh Golem") {
			let ran = rand(3);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("spits cursed blood at", 8 + rand(11), 75, 1))[0];
			}
			else if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new Attack("crushes", 16 + rand(17), 50))[0];
			}
			else if (ran == 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 6 + rand(5), 75, 1, 2))[0];
			}
		}
		else if (enemy.NAME == "Lich") {
			for (let i = 0; i < 2; i++) {
				let numDead = deadAllies.length;
				let ran = rand(7);
				if (numDead == 0) {
					ran = rand(6);
				}
				if (ran == 6) {
					ran = rand(6);
				}
				if (ran < 3) {
					msg += moveAttack(allies, enemy, targets, new Attack("touches", 16 + rand(17), 100, 1))[0];
				}
				if (ran == 3) {
					msg += "*PINK*The lich summons a Skeletal Swordsman!\n";
					allies.push(summon("Skeletal Swordsman", enemy.ROW));
				}
				if (ran == 4) {
					msg += "*PINK*The lich summons a Skeletal Archer!\n";
					allies.push(summon("Skeletal Archer", enemy.ROW));
				}
				if (ran == 5) {
					msg += "*PINK*The lich summons a Skeletal Spearman!\n";
					allies.push(summon("Skeletal Spearman", enemy.ROW));
				}
				if (ran == 6) {
					msg += "*PINK*The lich raises the dead!\n";
					for (let i = deadAllies.length - 1; i >= 0; i--) {
						if (deadAllies[i].HP == 0) {
							let raised = COPY(deadAllies[i]);
							raised.HP = Math.ceil(MaxHP(deadAllies[i])/2);
							if (deadAllies[i].TYPE == "player") {
								raised = new Enemy("Zombified " + raised.NAME, MaxHP(raised), 0, 0, 20, [0], 5); 
								raised.SUMMONED = true;
							}
							allies.push(raised);
							deadAllies.splice(i, 1);
						}
					}
					for (let i = deadTargets.length - 1; i >= 0; i--) {
						if (deadTargets[i].HP == 0) {
							let raised = COPY(deadTargets[i]);
							raised.HP = Math.ceil(MaxHP(deadTargets[i])/2);
							if (deadTargets[i].TYPE == "player") {
								raised = new Enemy("Zombified " + raised.NAME, MaxHP(raised), 0, 0, 20, [0], 5); 
								raised.SUMMONED = true;
							}
							allies.push(raised);
							deadTargets.splice(i, 1);
						}
					}
				}
			}
		}
		else if (enemy.NAME == "Imp") {
			let ran = rand(6);
			if (ran >= 3) {
				msg += moveAttack(allies, enemy, targets, new Attack("gnaws at", 4 + rand(5), 80, PHYSICAL, 2))[0];
			}
			else if (ran == 0) {
				msg += "*PINK*The imp shrieks!\n";
			}
			else if (ran == 1) {
				msg += "*PINK*The imp runs around wildly!\n";
				ran = rand(2);
				for (let i = 0; i < 2; i++) {
					if (enemy.ROW == 4 || (ran == 0 && enemy.ROW > 0)) {
						enemy.ROW--;
						//msg += "*PINK*The imp runs back!\n";
					}
					else {
						enemy.ROW++;
						//msg += "*PINK*The imp runs forward!\n";
					}
				}
			}
		}
		else if (enemy.NAME == "Warrior") {
			msg += moveAttack(allies, enemy, targets, new Attack("hacks", 4 + rand(9), 80, 0, 2, 1, 25))[0];
		}
		else if (enemy.NAME == "Ranger") {
			msg += moveAttack(allies, enemy, targets, new Attack("hacks", 4 + rand(6), 80, 0, 2, 6, 30))[0];
		}
		else if (enemy.NAME == "Crazed Wolf") {
			if (enemy.HP <= 10) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites savagely at", 16 + rand(13), 85))[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 8 + rand(9), 65, 0, 2))[0];
			}
		}
		else if (enemy.NAME == "Swamp Ape") {
			let ran = rand(4);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 16 + rand(9), 90))[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("punches", 10 + rand(15), 75))[0];
			}
		}
		else if (enemy.NAME == "Wild Bear") {
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 16 + rand(13), 90))[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("swipes", 10 + rand(11), 75, 0, 2))[0];
			}
		}
		else if (enemy.NAME == "Swarm of Bees") {
			msg = moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*The swarm stings " + Name(targets[index]) + ".\n";
				result = DealDamage(new P_Attack(1, 100), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += "*PINK*" + Name(targets[index]) + " is poisoned!\n";
					AddEffect(targets[index], "Poison", 3);
				}
			}
		}
		else if (enemy.NAME == "Giant Frog") {
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
		else if (enemy.NAME == "Brigand Lord") {
			let ran = rand(6);
			if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " steals from his foes and grows stronger!\n";
				let HPSteal = 0;
				for (let i = 0; i < targets.length; i++) {
					HPSteal += Math.min(targets[i].HP, 5);
					if (targets[i].TYPE == "player") {
						targets[i].GOLD -= 5;
						if (targets[i].GOLD < 0) {
							targets[i].GOLD = 0;
						}
					}
				}
				HPSteal = Math.min(HPSteal, 30);
				enemy.MaxHP = Math.min(125, enemy.MaxHP + HPSteal/2);
				msg += Heal(enemy, HPSteal);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("strikes", 8 + rand(9), 90, 0, 3, 1, 30), "strong")[0];
			}
		}
		else if (enemy.NAME == "Mossy Statue") {
			if (enemy.HP <= 15) {
				let ran = rand(3);
				if (enemy.HP < 4) {
					ran = 0;
				}
				if (ran == 0) {
					msg = "*PINK*A high pitched shriek emits from the statue!\n";
					for (let i = 0; i < targets.length; i++) {
						msg += DealDamage(new M_Attack(16 + rand(17)), allies, enemy, targets, targets[i])[0];
					}
				}
			}
			else {
				let ran = rand(3);
				if (ran == 0) {
					msg = "*YELLOW*The statue seems to hum. . .\n";
				}
			}
		}
		else if (enemy.NAME == "Swamp Demon") {
			let ran = rand(3);
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
		else if (enemy.NAME == "Mimic") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				if (hasEffect(targets[index], "rooted")) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " bites " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(8 + rand(11), 100, 50), allies, enemy, targets, targets[index])[0];
				}
				else {
					msg += "*PINK*" + Prettify(Name(enemy)) + " grabs " + Name(targets[index]) + " with their tongue!\n";
					msg += AddEffect(targets[index], "Rooted", 3);
				}
			}
			else {
				msg += moveInRange(enemy, targets, 1);
			}
		}
		else if (enemy.NAME == "Forest Demon") {
			let ran = rand(5);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("touches", 4 + rand(25), 85, 1))[0];
			}
			else if (ran < 4) {
				msg += moveAttack(allies, enemy, targets, new Attack("spits fire", 10 + rand(9), 85, 0, 4))[0];
			}
			else {
				msg += "*PINK*The Forest Demon summons a Briar Beast!\n";
				allies.push(summon("briar beast", enemy.ROW));
			}
		}
		else if (enemy.NAME == "Cultist") {
			msg += moveAttack(allies, enemy, targets, new Attack("shanks", 4 + rand(5), 85, 0, 4))[0];
		}
		else if (enemy.NAME == "Servant") {
			let bonusDmg = Math.floor(enemy.MaxHP/10);
			msg += moveAttack(allies, enemy, targets, new Attack("strikes", 5 + bonusDmg + rand(4 + bonusDmg), 100))[0];
		}
		else if (enemy.NAME == "Warded Totem") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " emits a static burst!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(2 + rand(5), 50), allies, enemy, targets, targets[i])[0]; 
				}
			}
			else if (ran == 1) {
				msg += "*PINK*The runes on " + Prettify(Name(enemy)) + " glow as it saps energy from its foes!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].TYPE == "player") {
						targets[i].STAMINA -= 20;
						if (targets[i].STAMINA < 0) {
							targets[i].STAMINA = 0;
						}
					}
				}
			}
			//1/3 chance do nothing
		}
		else if (enemy.NAME == "Cult Leader") {
			let numCultists = 0;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME == "Cultist") {
					numCultists++;
				}
			}
			if (numCultists == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " calls forth Cultists!\n";
				allies.push(summon("Cultist", enemy.ROW));
				allies.push(summon("Cultist", enemy.ROW));
			}
			else {
				let ran = rand(3);
				if (numCultists == 0) {
					ran = rand(2);
				}
				if (ran == 0 || numCultists == 0) {
					msg += moveAttack(allies, enemy, targets, new Attack("stabs", 12 + rand(11), 85, 0, 2))[0];
				}
				else if (ran == 1) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " inspires his Cult!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].NAME == "Cultist") {
							AddEffect(allies[i], "Stronger", 2);
						}
					}
				}
				else if (ran == 2) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " sacrifices his Cult to grow stronger!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].NAME == "Cultist") {
							allies[i].HP = 0;
							msg += Heal(enemy, 10, true);
						}
					}
				}
			}
			msg += moveAttack(allies, enemy, targets, new Attack("shanks", 4 + rand(5), 85, 0, 4))[0];
		}
		else if (enemy.NAME == "Fumous Fiend") {
			let ran = rand(3);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("hits", 12 + rand(13), 85))[0];
			}
			else {
				msg = "*PINK*" + Prettify(Name(enemy)) + " enshrouds the battlefield in toxic fumes!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new T_Attack(2 + rand(5)), allies, enemy, targets, targets[i])[0]; 
					AddEffect(targets[i], "Venom", 3);
					AddEffect(targets[i], "Poison", 3);
				}
			}
		}
		else if (enemy.NAME == "Scaled Drake") {
			let ran = rand(3);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 14 + rand(15), 75), "strong")[0];
			}
			else {
				msg = "*PINK*" + Prettify(Name(enemy)) + " breathes fire across ";
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
		else if (enemy.NAME == "Beekeeper") {
			let ran = rand(6);
			let index = findVictim(enemy.ROW, targets, 3, "strong");
			let numBees = 0;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME == "Swarm of Bees") {
					numBees++;
				}
			}
			ran = rand(4);
			if (numBees > 12) {
				ran = rand(2);
			}
			if (numBees <= 4) {
				ran = 2;
			}
			if (ran == 0) {
				msg += "*PINK*The Beekeeper strengthens his swarm!\n";
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME == "Swarm of Bees" && allies[i].MaxHP < 6) {
						allies[i].MaxHP++;
						msg += Heal(allies[i], 4);
						AddEffect(allies[i], "Stronger", 2);
					}
				}
			}
			else if (ran == 1) {
				msg += "*PINK*The Beekeeper harvests honey from his swarm!\n";
				msg += Heal(enemy, 2 * numBees);
			}
			else if (ran == 2) {
				let n = 3 + rand(3);
				for (let i = 0; i < n; i++) {
					msg += "*PINK*The Beekeeper summons a swarm of bees!\n";
					allies.push(summon("Swarm of Bees", rand(5)));
				}
			}
			else if (index > -1) {
				msg += "*PINK*The Beekeeper throws a jar of honey at " + Name(targets[index]) + "!\n";
				let result = DealDamage(new P_Attack(12 + rand(11), 90), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += "*PINK*" + Name(targets[index]) + " is coated in honey, increasing their AP costs by 3!\n";
					AddEffect(targets[index], "Coated in Honey", 3);
				}
			}
			else {
				msg += moveInRange(enemy, targets, 3, "kite");
			}
		}
		else if (enemy.NAME == "Houndlord") {
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
							AddEffect(allies[i], "Stronger", 2);
						}
					}
				}
				else {
					msg += moveAttack(allies, enemy, targets, new Attack("cuts", 10 + rand(9), 90, 0, 2))[0];
				}
			}
		}
		else if (enemy.NAME == "Swamp Mage") {
			let ran = rand(7);
			let index = findVictim(enemy.ROW, targets, 3);
			if (ran > 3 && index > -1) {
				msg += "The *PINK*Swamp Mage*GREY* casts *GREEN*Swamp Strike*PINK* at " + Name(targets[index]) + "!\n";
				let result = DealDamage(new M_Attack(6 + rand(15)), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] > 0) {
					msg += AddEffect(targets[index], "Poison", 3);
				}
			}
			else {
				ran = rand(4);
				let numWounded = 0;
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].HP > 0) {
						if (allies[i].HP < allies[i].MaxHP) {
							numWounded++;
						}
					}
				}
				if (numWounded == 0) {
					ran = 1 + rand(3);
				}
			}
			if (ran == 0) {
				msg += "The *PINK*Swamp Mage*GREY* heals her allies, cleansing their debuffs!\n";
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].HP > 0) {
						msg += Heal(allies[i], 5);
						msg += removeDebuffs(allies[i]);
					}
				}
			}
			else if (ran == 1) {
				msg += "The *PINK*Swamp Mage*GREY* summons a Living Vine!\n";
				allies.push(summon("Living Vine", enemy.ROW));
			}
			else if (ran == 2) {
				msg += "The *PINK*Swamp Mage*GREY* summons a Living Slime!\n";
				allies.push(summon("Living Slime", enemy.ROW));
			}
			else if (ran == 3) {
				msg += "The *PINK*Swamp Mage*GREY* summons a Giant Amoeba!\n";
				allies.push(summon("Giant Amoeba", enemy.ROW));
			}
		}
		else if (enemy.NAME == "Living Vine") {
			let ran = rand(2);
			let index = findVictim(enemy.ROW, targets, 3);
			if (index > -1) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " tangles " + Name(targets[index]) + "!\n";
				let result = DealDamage(new P_Attack(8 + rand(9)), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] && ran == 0) {
					msg += "*PINK*" + Name(targets[index]) + " is tangled in the vines and can't move!\n";
					AddEffect(targets[index], "Rooted", 1);
				}
			}
			else {
				msg = moveInRange(enemy, targets, 3, "kite");
			}
		}
		else if (enemy.NAME == "Witch") {
			let ran = rand(3);
			let index = findVictim(enemy.ROW, targets, 3);
			if (ran == 0) {
				if (index > -1) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " throws a potion at " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += "*PINK*" + Name(targets[index]) + " is stunned!\n";
						AddEffect(targets[index], "Stunned", 1);
					}
				}
				else {
					msg = moveInRange(enemy, targets, 3, "kite");
				}
			}
			else {
				index = findVictim(enemy.ROW, targets, 3);
				ran = rand(2);
				
				if (ran == 0) {
					if (index > -1) {
						msg += "The *PINK*" + Name(enemy) + "*GREY* hexes " + Name(targets[index]) + "!\n";
						msg += DealDamage(new M_Attack(12 + rand(11)), allies, enemy, targets, targets[index])[0];
					}
					else {
						msg = moveInRange(enemy, targets, 3, "kite");
					}
				}
				else {
					msg += "The *PINK*" + Name(enemy) + "*GREY* curses all of her foes!\n";
					for (let i = 0; i < targets.length; i++) {
						msg += DealDamage(new M_Attack(4 + rand(3)), allies, enemy, targets, targets[i])[0]; 
						AddEffect(targets[i], "Poison", 3);
					}
				}
			}
		}
		else if (enemy.NAME == "Goblin Warlord") {
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
			if (numGoblins > 2) {
				index = findVictim(enemy.ROW, targets, 2);
			}
			if ((ran == 0 && numGoblins > 4) || index > -1) {
				msg += moveAttack(allies, enemy, targets, new Attack("hammers", 8 + rand(11), 90, 0, 3, 2, 50), "strong")[0];
			}
			else if (ran == 1 && numGoblins > 2) {
				msg += "*PINK*The Goblin Warlord rallies his Horde, healing and strengthening them!\n";
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME.substring(0, "Goblin".length) == "Goblin") {
						AddEffect(allies[i], "Stronger", 2);
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
		else if (enemy.NAME == "Briar Beast") {
			msg += moveAttack(allies, enemy, targets, new Attack("wallops", 4 + rand(9), 80, 0, 1, 1, 30))[0];
		}
		else if (enemy.NAME == "Briar Monster") {
			msg += moveAttack(allies, enemy, targets, new Attack("wallops", 12 + rand(15), 80, 0, 1, 1, 30))[0];
		}
		else if (enemy.NAME == "Fae Trickster") {
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
			let ran = rand(3);
			if (numPlayers == 0) {
				ran = rand(2);
			}
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("pranks", 6 + rand(5), 100, 1))[0];
			}
			else if (ran == 1) {
				msg += "*PINK*The Fae Trickster pranks all of its foes!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(4 + rand(5)), allies, enemy, targets, targets[i])[0]; 
				}
			}
			else {
				msg += "*PINK*The Fae Trickster exhausts its foes!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].TYPE == "player") {
						targets[i].STAMINA -= 15;
						if (targets[i].STAMINA < 0) {
							targets[i].STAMINA = 0;
						}
					}
				}
			}
		}
		else if (enemy.NAME == "Caustic Snail") {
			let ran = rand(2);
			if (ran == 0 && enemy.HP < enemy.MaxHP/2) {	
				msg += "*PINK*" + Prettify(Name(enemy)) + " heals in its shell. . .\n";
				msg += Heal(enemy, 8 + rand(16));
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " chomps at " + Name(targets[index]) + "!\n";
					let result = DealDamage(new P_Attack(16 + rand(13), 60), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1] > 0) {
						msg += AddEffect(targets[index], "Venom", 3);
					}
				}
				msg += moveInRange(enemy, targets, 1);
			}
		}
		else if (enemy.NAME == "Wandering Moon") {
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
		else if (enemy.NAME == "Brigand") {
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
			else if (ran == 0) {
				msg += "*PINK*The brigand steals 10 gold from each member of the party!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].TYPE == "player") {
						targets[i].GOLD -= 10;
						if (targets[i].GOLD < 0) {
							targets[i].GOLD = 0;
						}
					}
				}
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("strikes", 6 + rand(7), 90, 0, 2, 1, 20))[0];
			}
		}
		else if (enemy.NAME == "Slugbeast") {
			msg += moveAttack(allies, enemy, targets, new Attack("chomps", 36 + rand(21), 6, 1))[0];
		}
		else if (enemy.NAME == "Foul Sluglord") {
			msg += moveAttack(allies, enemy, targets, new Attack("chomps", 88 + rand(41), 6, 1), "strongest")[0];
		}
		else if (enemy.NAME == "Anchorite Worm") {
			msg = moveInRange(enemy, targets, 1);
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " wriggles into " + Name(targets[index]) + "!\n";
				AddEffect(targets[index], "Infested", 999);
				enemy.HP = 0;
			}
		}
		else if (enemy.NAME == "Tube Snail") {
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
						AddEffect(targets[index], "Infested", 999);
					}
				}
				if (worm) {
					msg += "*PINK*" + Name(targets[index]) + " feels unwell. . .\n";
				}
			}
		}
		else if (enemy.NAME == "Swarmer Shark") {
			let hasAttacked = false;
			for (let i = 0; i < targets.length; i++) {
				if (hasEffect(targets[i], "bleed")) {
					msg += "*PINK*" + Prettify(Name(enemy)) + " is frenzied by the smell of blood!\n";
					if (enemy.ROW == targets[i].ROW) {
						hasAttacked = true;
						msg += "*PINK*" + Prettify(Name(enemy)) + " tears into " + Name(targets[i]) + "!\n";
						let result = DealDamage(new P_Attack(12 + rand(9), 75, 30), allies, enemy, targets, targets[i]);
						msg += result[0];
						if (result[1] > 0) {
							msg += AddEffect(targets[i], "Bleed", 1);
							
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
					msg += AddEffect(result[1], "Bleed", 1);
				}
			}
		}
		else if (enemy.NAME == "Coral Shard") {
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == enemy.ROW) {
					if (rand(4) == 0) {
						msg += "*PINK*" + Name(targets[i]) + " cuts themself on the sharp Coral Shard!\n";
						let result = DealDamage(new P_Attack(4 + rand(3)), allies, enemy, targets, targets[i]);
						msg += result[0];
						if (result[1] > 0) {
							msg += AddEffect(targets[i], "Bleed", 1);
						}
					}
				}
			}
		}
		else if (enemy.NAME == "Giant Anemone") {
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == enemy.ROW) {
					msg += "*PINK*" + Name(targets[i]) + " is shocked by the Giant Anemone!\n";
					msg += DealDamage(new P_Attack(4 + rand(3)), allies, enemy, targets, targets[i])[0];
					if (rand(4) == 0) {
						msg += AddEffect(targets[i], "Stunned", 1);
					}
				}
			}
		}
		else if (enemy.NAME == "Sea Sorceror") {
			let ran = rand(3);
			let indexThree = findVictim(enemy.ROW, targets, 3, "strong");
			if (indexThree == -1) {
				ran = 1 + rand(2);
			}
			if (allies.length < 3) {
				ran = 1;
			}
			if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " casts Water Bubble Blast!\n";
				msg += DealDamage(new M_Attack(6 + rand(7)), allies, enemy, targets, targets[indexThree])[0];
			}
			if (ran == 1) {
				let options = ["Coral Shard", "Giant Anemone"];
				for (let i = 0; i < 2; i++) {
					let en = options[rand(2)];
					msg += "*PINK*" + Prettify(Name(enemy)) + " summons a " + en + "!\n";
					allies.push(summon(en, rand(5)));
				}
			}
			if (ran == 2) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " empowers the nearby sea life!\n";
				for (let i = 0; i < allies.length; i++) {
					AddEffect(allies[i], "Stronger", 1);
				}
			}
		}
		else if (enemy.NAME == "Tidliwincus") {
			let foundPlayer = false;
			let isEnamoured = false;
			for (const effect of enemy.EFFECTS) {
				let name = effect.name.toLowerCase();
				if (name.includes("enamoured")) {
					isEnamoured = true;
					for (let i = 0; i < targets.length; i++) {
						if (effect.target.toLowerCase() == targets[i].NAME.toLowerCase()) {
							foundPlayer = true;
							if (targets[i].ROW != enemy.ROW) {
								moveToRow(enemy, targets[i].ROW);
							}
							else {
								let ran = rand(3);
								let row = rand(5);
								if (row == enemy.ROW || ran == 0) {
									msg += "*PINK*" + Prettify(Name(enemy)) + " lovingly pecks " + Name(targets[i]) + "!\n";
									msg += DealDamage(new P_Attack(8 + rand(9), 90, 50), allies, enemy, targets, targets[i])[0];
								}
								else {
									msg += "*PINK*" + Prettify(Name(enemy)) + " drags " + Name(targets[i]) + ", stunning them!\n";
									AddEffect(targets[i], "Stunned", 1);
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
					msg += "*PINK*" + Prettify(Name(enemy)) + " sulks . . .\n";
				}
				else {
					let target = targets[rand(targets.length)];
					msg += "*PINK*" + Prettify(Name(enemy)) + " has become enamoured with " + Name(target) + "!\n";
					AddEffect(enemy, "Enamoured with", 999, target.NAME);
				}
			}
		}
		else if (enemy.NAME == "Living Tide") {
			let hpCutOff = 25 + rand(12);
			if (enemy.HP < hpCutOff) {
				let num = 10 + rand(10);
				if (enemy.ROW != min) {
					num = Math.floor(num/2);
					msg += moveToRow(enemy, min);
				}
				msg += "*PINK*Water flows into the body of " + Prettify(Name(enemy)) + "!\n";
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
						msg += DealDamage(new M_Attack(2 + rand(5)), allies, enemy, targets, targets[i])[0];
						AddEffect(targets[i], "Slowed", 1);
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
					msg += DealDamage(new M_Attack(10 + rand(10)), allies, enemy, targets, targets[indexOne])[0];
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
		else if (enemy.NAME == "Squallbird") {
			msg += "*PINK*" + Prettify(Name(enemy)) + " dives fiendishly at its foe!\n";
			msg += moveInRange(enemy, targets, 1);
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " pecks " + Name(targets[index]) + "!\n";
				for (let i = 0; i < 4; i++) {
					msg += DealDamage(new P_Attack(2 + rand(5), 90, 50), allies, enemy, targets, targets[index])[0];
				}
			}
			if (min != enemy.ROW && rand(2) == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " flies away from the commotion!\n";
				msg += moveToRow(enemy, min);
			}
		}
		else if (enemy.NAME == "Reef Crab") {
			msg += moveAttack(allies, enemy, targets, new Attack("pinches", 8 + rand(7), 85))[0];
		}
		else if (enemy.NAME == "Squelcher") {
			let index = findVictim(enemy.ROW, targets, 3);
			if (index > -1) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " sprays a strong jet of water at " + Name(targets[index]) + "!\n";
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
		else if (enemy.NAME == "Sunfish") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*" + Prettify(Name(enemy)) + " emits a burst of blinding light!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(2 + rand(5)), allies,enemy, targets, targets[i])[0];
					msg += Prettify(Name(targets[i])) + " is blinded!\n";
					AddEffect(targets[i], "Blinded", 1);
				}
			}
			msg += "*PINK*" + Prettify(Name(enemy)) + " hurries away towards safety!\n";
			msg += moveToRow(enemy, min);
		}
		else if (enemy.NAME == "Coral Crawler") {
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME == "Anchorite Worm") {
					msg += "*PINK*" + Prettify(Name(enemy)) + " eats the Anchorite Worm!\n";
					allies[i].HP = 0;
					break;
				}
			}
			if (enemy.HP < enemy.MaxHP) {
				let result = moveAttack(allies, enemy, targets, new Attack("stings", 2 + rand(7), 85));
				msg += result[0];
				if (result[1]) {
					msg += AddEffect(result[1], "Venom", 1);	
				}
			}
			else {
				ran = rand(2);
				if (enemy.ROW == 4 || (ran == 0 && enemy.ROW > 0)) {
					enemy.ROW--;
					msg += "*PINK*" + Prettify(Name(enemy)) + " skitters gently back.\n";
				}
				else {
					enemy.ROW++;
					msg += "*PINK*" + Prettify(Name(enemy)) + " skitters gently forward.\n";
				}	
			}
		}
		else if (enemy.NAME == "Mariner") {
			let ran = rand(6);
			if (ran == 0) {
				msg += "*GREEN*The mariner seems grateful to be free.\n";
			}
			else if (ran == 1) {
				msg += "*GREEN*The mariner sobs. . .\n";
			}
			msg += moveAttack(allies, enemy, targets, new Attack("punches", 6 + rand(9), 75, 0, 1, 1, 20))[0];
		}
		else if (enemy.NAME == "Lost Mariner") {
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
		else if (enemy.NAME == "Fishman Archer") {
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 4 + rand(8), 90, 0, 2, 6, 20), "strong")[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 4 + rand(8), 90, 0, 2, 6, 20), "weak")[0];
			}
		}
		else if (enemy.NAME == "Fishman Tridentier") {
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 10 + rand(7), 75, 0, 2, 2, 25))[0];
		}
		else if (enemy.NAME == "Sea Priest" || enemy.NAME == "Sea Priestess") {
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
				ran = 1 + rand(3);
			}
			if (numWoundedOrDebuffed / numAllies < .5) {
				ran = rand(3);
			}
			if (ran == 0) {
				let enemies = ["reef crab", "coral crawler", "sunfish", "squallbird", "squelcher"];
				let index = rand(enemies.length);
				msg += "" + Prettify(Name(enemy)) + " forms a " + Prettify(enemies[index]) + " out of the sea foam!\n";
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
				msg += "*PINK*" + Prettify(Name(enemy)) + " raises their Driftwood Staff and freezes " + Name(targets[index]) + "!\n";
				AddEffect(targets[index], "Stunned", 1);
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
		else if (enemy.NAME == "Stone Crab") {
			msg += moveAttack(allies, enemy, targets, new Attack("pinches", 12 + rand(11), 85))[0];
		}
		else if (enemy.NAME == "Reefwalker") {
			let ran = rand(2);
			if (ran == 0) {
				let crab = false
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME.toLowerCase().includes("crab") & allies[i].HP > 0) {
						msg += "*PINK*" + Prettify(Name(enemy)) + " swings its strong beak at " + Name(allies[i]) + "!\n";
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
		else if (enemy.NAME == "Risen Whale") {
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
					msg += "*PINK*A foul smell taints the air, though the worst of it remains trapped in bloated pockets of the Risen Whale's rotten flesh."
				}
				else if (dmg < 15) {
					msg += "*PINK*The stench of the risen whale spreads over the battlefield, of rotten flesh, seeping out of the Risen Whale's many wounds."
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
				AddEffect(targets[indexThree], "Stunned", 1);
				for (let i = 0; i < targets.length; i++) {
					if (i != indexThree) {
						msg += DealDamage(new M_Attack(3 + rand(4)), allies, enemy, targets, targets[i])[0];
					}
				}
			}
		}
		else if (enemy.NAME == "Deep Horror") {
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
					msg += "*PINK*" + Prettify(Name(enemy)) + " augments its pressure field to pull " + Name(targets[index]) + " closer!\n";
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
		else if (enemy.NAME == "Kurita") {
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
							msg += "*PINK*" + Prettify(Name(enemy)) + " bites " + Name(allies[closest]) + "!\n";
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
		else if (enemy.NAME == "Carcinos") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += moveAttack(allies, enemy, targets, new Attack("pinches", 14 + rand(13), 85))[0];
			}
			else {
				let ran = rand(2);
				if (ran == 0) {
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].NAME.toLowerCase().includes("crab")) {
							if (allies[i].ROW != enemy.ROW) {
								msg += moveToRow(enemy, allies[i].ROW);
							}
							if (allies[i].ROW == enemy.ROW) {
								msg += "*PINK*Carcinos seems to be inspecting the crab on R" + (enemy.ROW + 1) + ".\n";
							}
						}
					}
				}
				else {
					let options = ["Carcinos speaks in a chittering, clicky language. . .", "Carcinos seems annoyed. . .", "Carcinos doesn't seem interested in fighting.", "Carcinos seems to only be focused on its work."];
					msg += "*PINK*" + options[rand(3)];
				}
			}
		}
		else if (enemy.NAME == "Siren") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*PINK*A beautifully alluring pitch emits from " + Prettify(Name(enemy)) + " drawing its foes closer!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == enemy.ROW) {
						msg += "*PINK*" + Prettify(Name(targets[i])) + " is entranced by the pitch and is stunned!\n";
						AddEffect(targets[i], "Stunned", 1);
					}
					else {
						msg += "*PINK*" + Prettify(Name(targets[i])) + " is entranced by the pitch and moves towards " + Prettify(Name(enemy)) + "!\n" 
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
					msg += "*PINK*" + Prettify(Name(enemy)) + " chomps down on " + Name(targets[index]) + "!\n";
					msg += DealDamage(new P_Attack(16 + rand(13), 90, 50), allies, enemy, targets, targets[index])[0];
				}
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("chomps", 16 + rand(11), 90, 0, 1, 1, 50))[0];
			}
			
		}
		else if (enemy.NAME == "Dirge") {
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
		else if (enemy.NAME == "Wadrin's Lizard") {
			let ran = rand(3);
			if (ran == 0) {
				let result = moveAttack(allies, enemy, targets, new Attack("tears into", 4 + rand(7), 80, 0, 3));
				msg += result[0];
				if (result[1]) {
					msg += "*PINK*" + Prettify(Name(result[1])) + " begins to bleed!\n";
					AddEffect(result[1], "Bleed", 3);
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
						msg += "*PINK*" + Prettify(Name(result[1])) + " is winded by the blow!\n";
						result[1].STAMINA = Math.max(0, result[1].STAMINA - 20);
					}
				}
			}
		}
		else {
		}
	}
	return msg;
}

