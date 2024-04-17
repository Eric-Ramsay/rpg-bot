function Name(target, color = "") {
	if (target.TYPE == "player") {
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

function desiredRow(targets, row, type = "") {
	let minDist = 7;
	let minRow = row;
	let strongest = 0;
	if (targets.length == 0) {
		return row;
	}
	for (let i = 0; i < targets.length; i++) {
		if (targets[i].HP > 0) {
			if (Math.abs(targets[i].ROW - row) < minDist) {
				minDist = Math.abs(targets[i].ROW - row);
				minRow = targets[i].ROW;
			}
			if (MaxHP(targets[i]) > MaxHP(targets[strongest])) {
				strongest = i;
			}
		}
	}
	if (type == "strongest") {
		minRow = targets[strongest].ROW;
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
		msg += "The *RED*" + enemy.NAME + "*GREY* moves ";
		if (moves > 0) {
			msg += "down";
		}
		else {
			msg += "up";
		}
		moves = Math.abs(moves);
		if (moves > 1) {
			msg += " " + moves + " rows";
		}
		msg += ".\n";
	}
	return msg;
}

function moveInRange(enemy, targets, range, type = "") {
	let msg = "";
	let targetRow = desiredRow(targets, enemy.ROW, type);
	msg += moveToRow(enemy, targetRow);
	return msg;
}

function moveAttack(enemies, enemy, targets, attack, type = "random") {
	let msg = "";
	let target = null;
	let index = findVictim(enemy.ROW, targets, attack.range, type);
	if (index > -1) {
		for (let i = 0; i < attack.number; i++) {
			if (index > -1) {
				target = targets[index];
				let tName = "*GREEN*" + target.NAME;
				if (target.TYPE != "player") {
					tName = "the " + tName;
				}
				msg += "The *RED*" + enemy.NAME + "*GREY* " + attack.verb + " " + tName + "*GREY*!\n";
				msg += DealDamage(attack, enemies, enemy, targets, targets[index])[0];
				index = findVictim(enemy.ROW, targets, attack.range, type);
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
	//console.log("Attacking: " + enemy.NAME);
	let msg = "";
	let max = 0;
	let min = 0;
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
				msg += "The *RED*Swarm of Bats*GREY* transforms into a *RED*Vampire*GREY!";
				enemy.NAME = "Vampire"
			}
		}
		else if (enemy.NAME == "Vampire") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*RED*The " + enemy.NAME + " sucks blood from " + targets[index].NAME + "!\n";
				let result = DealDamage(new P_Attack(6 + rand(11), 90, 50), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1]) {
					msg += "*RED*The " + enemy.NAME + " heals for " + Math.floor(result[1]/2) + " HP!\n";
					enemy.HP = Math.min(enemy.MaxHP, enemy.HP + Math.floor(result[1]/2));
				}
			}
			let ran = rand(5);
			if (index == -1 || ran == 0) {
				msg += "The *RED*Vampire *GREY*transforms into a *RED*Swarm of Bats*GREY!";
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
					msg += "*RED*The " + enemy.NAME + " scratches " + targets[index].NAME + "!\n";
					msg += DealDamage(new P_Attack(4 + rand(5), 75), allies, enemy, targets, targets[index])[0];
				}
				if (ran == 1) {
					msg += "*RED*The " + enemy.NAME + " bites " + targets[index].NAME + "!\n";
					msg += DealDamage(new P_Attack(12 + rand(9), 75), allies, enemy, targets, targets[index])[0];
				}
				if (targets[index].HP <= 0 && MaxHP(targets[index]) > 5) {
					msg += "*RED*" + targets[index].NAME + " rises as a Zombie!\n";
					let zombie = new Enemy("Zombified " + targets[index].NAME, MaxHP(targets[index]), 0, 0, 20, [0], 5); 
					zombie.SUMMONED = true;
					allies.push(enemy);
				}
			}
		}
		else if (enemy.NAME == "Hungry Ghoul") {
			let ran = 0;
			if (enemy.HP < enemy.MaxHP/2 && allies.length > 0) {
				ran = rand(2);
			}
			msg += moveInRange(enemy, targets, 1);
			if (msg != "") {
				return msg;
			}
			if (ran == 0) {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*RED*The " + enemy.NAME + " gnaws on " + targets[index].NAME + "!\n";
					for (let i = 0; i < 3; i++) {
						msg += DealDamage(new P_Attack(6 + rand(7), 95), allies, enemy, targets, targets[index])[0];
					}
					if (targets[index].HP <= 0) {
						msg += "*RED*The hungry ghoul consumes the flesh of " + targets[index].NAME + "!\n";
						enemy.HP = Math.min(enemy.MaxHP, enemy.HP + MaxHP(targets[index]));
					}
				}
			}
			else {
				msg += "*RED*The hungry ghoul siphons health from its allies!\n";
				for (let i = 0; i < allies.length; i++) {
					if (i != enemyIndex && enemy.HP < enemy.MaxHP ) {
						let result = DealDamage(new M_Attack(5, 100, 100), allies, enemy, allies, allies[i]);
						msg += result[0];
						let dmg = result[1];
						if (dmg > 0) {
							enemy.HP = Math.min(enemy.MaxHP, enemy.HP + dmg);
						}
					}
				}
			}
		}
		else if (enemy.NAME == "Bronze Bellbeast") {
			msg += "*RED*The Bronze Bellbeast tolls!\n";
			for (let i = 0; i < targets.length; i++) {
				msg += DealDamage(new M_Attack(8 + rand(8)), allies, enemy, targets, targets[i])[0];
			}
		}
		else if (enemy.NAME == "Living Slime") {
			let result = moveAttack(allies, enemy, targets, new Attack("slimes", 4 + rand(5), 80, 0));
			msg += result[0];
			if (result[1] != null) {
				AddOrRefreshEffect(result[1], new Effect("Slowed", "Movement costs are increased.", 1));
				msg += "*RED*" + enemy.NAME + " slimes " + result[1].NAME + ", slowing them!";
			}
		}
		else if (enemy.NAME == "Giant Amoeba") {
			msg += moveAttack(allies, enemy, targets, new Attack("bumps into", 6 + rand(7), 100, 0))[0];
		}
		else if (enemy.NAME == "Flaming Wisp") {
			let ran = rand(3); 
			if (ran == 0 && enemy.MaxHP < 40) {
				msg += "*RED*The " + enemy.NAME + " begins to burn brighter. . .\n"
				enemy.HP += 10;
				enemy.MaxHP += 5;
				if (enemy.HP > enemy.MaxHP) {
					enemy.HP = enemy.MaxHP;
				}
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("burns", 6 + rand(7), 100, 1))[0];
			}
		}
		else if (enemy.NAME == "Swamp Stalker") {
			let result = moveAttack(allies, enemy, targets, new Attack("grabs", 14 + rand(7), 85, 1, 1, 2));
			msg += result[0];
			if (result[1] != null) {
				msg += "*RED*" + result[1].NAME + " is wrapped by the " + enemy.NAME + "'s stinging tentacles and can't move! They're envenomed!\n";
				AddOrRefreshEffect(result[1], new Effect("Rooted", "Unable to Move.", 1));
				AddOrRefreshEffect(result[1], new Effect("Venom", "Take 4 dmg per turn.", 3));
			}
			if (rand(3) == 0) {
				msg += "*RED*The Swamp Stalker hisses. . .";
			}
		}
		else if (enemy.NAME == "Ephemeral Warrior") {
			msg += moveAttack(allies, enemy, targets, new Attack("slashes", enemy.MaxHP/10 + rand(9), 85, 0, Math.floor(enemy.MaxHP/10), 1, 100), "strongest")[0];
			msg += "*RED*The " + enemy.NAME + " begins to fade. . .\n";
			enemy.HP = Math.max(0, enemy.HP - 5);
		}
		else if (enemy.NAME == "Wisp Knight") {
			let ran = rand(5); 
			if (ran == 0) {
				msg += "*RED*The " + enemy.NAME + " begins to burn brighter. . .\n"
				enemy.MaxHP = Math.min(150, enemy.MaxHP + 10);
				enemy.HP = Math.min(enemy.MaxHP, enemy.HP + 20);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("burns", 10 + rand(11), 100, 1, 3))[0];
			}
		}
		else if (enemy.NAME == "Slimelord") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*RED*A smaller slime drips off of the Slimelord!\n";
				allies.push(summon("Living Slime", enemy.ROW));
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("slimes", 18 + rand(19), 80, 0))[0];
			}
		}
		else if (enemy.NAME == "Apparition") {
			let index = findVictim(enemy.ROW, targets, 6);
			if (index > -1 && targets[index].ROW != enemy.ROW) {
				msg += "*RED*The " + enemy.NAME + " vanishes and reappears!\n";
				enemy.ROW = targets[index].ROW;
			}
			msg += moveAttack(allies, enemy, targets, new Attack("spooks", 4 + rand(5), 100, 1))[0];
		}
		else if (enemy.NAME == "Lost Angel") {
			msg += moveAttack(allies, enemy, targets, new Attack("smites", 1 + rand(41), 100, 1, 1, 100))[0];
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
					msg += "*RED*" + enemy.NAME + " bites " + targets[index].NAME + "!\n";
					let result = DealDamage(new P_Attack(12 + rand(11), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1]) {
						msg += "*RED*" + targets[index].NAME + " is envenomed!\n";
						AddOrRefreshEffect(targets[index], new Effect("Venom", "Take 4 dmg per turn.", 3));
					}
				}
				if (ran == 2) {
					msg += "*RED*The " + enemy.NAME + " wraps " + targets[index].NAME + " in their web, stunning them!\n";
					AddOrRefreshEffect(targets[index], new Effect("Stunned", "Lose your next turn.", 1));
				}
			}
		}
		else if (enemy.NAME == "Spider Queen") {
			let ran = rand(4);
			let index = findVictim(enemy.ROW, targets, 4);
			if (ran == 0) {
				if (index > -1) {
					msg += "*RED*The " + enemy.NAME + " spits venom at " + targets[index].NAME + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1]) {
						msg += "*RED*" + targets[index].NAME + " is envenomed!\n";
						AddOrRefreshEffect(targets[index], new Effect("Venom", "Take 4 dmg per turn.", 3));
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
			else if (ran == 1 && allies.length < 20) {
				msg += "*RED*The " + enemy.NAME + " lays an egg sac!\n";
				allies.push(summon("Egg Sac", enemy.ROW));
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					if (ran == 2) {
						msg += "*RED*" + enemy.NAME + " bites " + targets[index].NAME + "!\n";
						let result = DealDamage(new P_Attack(12 + rand(11), 85), allies, enemy, targets, targets[index]);
						msg += result[0];
						if (result[1]) {
							msg += "*RED*" + targets[index].NAME + " is envenomed!\n";
							AddOrRefreshEffect(targets[index], new Effect("Venom", "Take 4 dmg per turn.", 3));
						}
					}
					else if (ran == 3) {
						msg += "*RED*The " + enemy.NAME + " wraps " + targets[index].NAME + " in their web, stunning them!\n";
						AddOrRefreshEffect(targets[index], new Effect("Stunned", "Lose your next turn.", 2));
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
				msg += "*RED*The " + enemy.NAME + " conjures a cloud of toxins!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(4 + rand(7)), allies, enemy, targets, targets[i])[0];
					AddOrRefreshEffect(targets[i], new Effect("Poison", "Take 1 dmg per turn.", 5));
				}
			}
			else if (ran == 1) {
				msg += "*RED*The " + enemy.NAME + " summons Living Sfpores!\n";
				ran = 1 + rand(4);
				for (let i = 0; i < ran; i++) {
					allies.push(summon("Living Spore", rand(5)));
				}
			}
			else if (ran == 2) {
				msg += "*RED*The " + enemy.NAME + " summons a Toxic Mushroom!\n";
				allies.push(summon("Toxic Mushroom", rand(5)));
			}
			else {
				msg += "*RED*The " + enemy.NAME + " inahles spores and heals!\n";
				enemy.HP = Math.min(enemy.MaxHP, enemy.HP + 6);
			}
		}
		else if (enemy.NAME == "Toxic Mushroom") {
			let ran = rand(3);
			if (enemy.HP <= 10) {
				msg += "*RED*The " + enemy.NAME + " regenerates. . .\n";
				enemy.HP = Math.min(enemy.HP + (1 + rand(4)), enemy.MaxHP);
			}
			else if (ran == 0) {
				msg += "*RED*The " + enemy.NAME + " unleashes a cloud of toxins!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new P_Attack(2 + rand(3), 100, 100), allies, enemy, targets, targets[i])[0];
					AddOrRefreshEffect(targets[i], new Effect("Poison", "Take 1 dmg per turn.", 5));
				}
			}
			else if (ran == 1) {
				msg += "*RED*The " + enemy.NAME + " belches a puff of Living Spores!\n"
				ran = 1 + rand(3);
				for (let i = 0; i < ran; i++) {
					allies.push(summon("Living Spore", enemy.ROW));
				}
			}
			else if (ran == 2) {
				msg += "*RED*The " + enemy.NAME + " hardens!\n";
				enemy.ARMOR[0] += 2;
				enemy.ARMOR[1] += 1;
			}
		}
		else if (enemy.NAME == "Living Spore") {
			let ran = rand(15);
			if (ran == 0) {
				msg += "*RED*The " + enemy.NAME + " sinks into the earth and sprouts into a Toxic Mushroom!\n";
				enemy = summon("Toxic Mushroom", enemy.ROW);
			}
			else {
				msg = moveInRange(enemy, targets, 1);
				if (msg != "") {
					return msg;
				}
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*RED*The " + enemy.NAME + " burrows into " + targets[index].NAME + "!\n";
					let result = DealDamage(new P_Attack(2 + rand(7), 100, 100), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1]) {
						msg += "*RED*" + targets[index].NAME + " is poisoned!\n";
						AddOrRefreshEffect(targets[index], new Effect("Poison", "Take 1 dmg per turn.", 5));
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
				msg += "*RED*The " + enemy.NAME + " bites " + targets[index].NAME + "!\n";
				let result = DealDamage(new P_Attack(2 + rand(3), 85), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1]) {
					msg += "*RED*" + targets[index].NAME + " is poisoned!\n";
					AddOrRefreshEffect(targets[index], new Effect("Poison", "Take 1 dmg per turn.", 5));
				}
			}
			let ran = rand(15);
			if (ran == 0) {
				msg += "*RED*The " + enemy.NAME + " grows into a Giant Spider!\n";
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
					msg += "*RED*The " + enemy.NAME + " spits venom at " + targets[index].NAME + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1]) {
						msg += "*RED*" + targets[index].NAME + " is envenomed!\n";
						AddOrRefreshEffect(targets[index], new Effect("Venom", "Take 4 dmg per turn.", 3));
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*RED*" + enemy.NAME + " bites " + targets[index].NAME + "!\n";
					let result = DealDamage(new P_Attack(10 + rand(11), 75), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1]) {
						msg += "*RED*" + targets[index].NAME + " is envenomed!\n";
						AddOrRefreshEffect(targets[index], new Effect("Venom", "Take 4 dmg per turn.", 3));
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
			msg += moveAttack(allies, enemy, targets, new Attack("slashes", 14 + rand(9), 75, 0, 1, 2, 10), "strong")[0];
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
					msg += "*RED*The lich summons a Skeletal Swordsman!\n";
					allies.push(summon("Skeletal Swordsman", enemy.ROW));
				}
				if (ran == 4) {
					msg += "*RED*The lich summons a Skeletal Archer!\n";
					allies.push(summon("Skeletal Archer", enemy.ROW));
				}
				if (ran == 5) {
					msg += "*RED*The lich summons a Skeletal Spearman!\n";
					allies.push(summon("Skeletal Spearman", enemy.ROW));
				}
				if (ran == 6) {
					msg += "*RED*The lich raises the dead!\n";
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
				msg += "*RED*The imp shrieks!\n";
			}
			else if (ran == 1) {
				msg += "*RED*The imp runs around wildly!\n";
				ran = rand(2);
				for (let i = 0; i < 2; i++) {
					if (enemy.ROW == 4 || (ran == 0 && enemy.ROW > 0)) {
						enemy.ROW--;
						msg += "*RED*The imp runs back!\n";
					}
					else {
						enemy.ROW++;
						msg += "*RED*The imp runs forward!\n";
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
				msg += "*RED*The swarm stings " + targets[index].NAME + ".\n";
				result = DealDamage(new P_Attack(1, 100, 100), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1]) {
					msg += "*RED*" + targets[index].NAME + " is poisoned!\n";
					AddOrRefreshEffect(targets[index], new Effect("Poison", "Take 1 dmg per turn.", 3));
				}
			}
		}
		else if (enemy.NAME == "Giant Frog") {
			let index = findVictim(enemy.ROW, targets, 1);
			if (index == -1) {
				let ran = rand(2);
				index = findVictim(enemy.ROW, targets, 4);
				if (ran == 0 && index > -1) {
					msg += "*RED*The Giant Frog flicks its tongue at " + targets[index].NAME + ".\n";
					result = DealDamage(new P_Attack(4 + rand(5), 90), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1]) {
						msg += "*RED*" + targets[index].NAME + " is pulled towards the Giant Frog!\n";
						targets[index].ROW = enemy.ROW;
					}
				}
				else {
					index = findVictim(enemy.ROW, targets, 6);
					if (index > -1 && index != enemy.ROW) {
						msg += "The *RED*Giant Frog *GREY*hops!\n";
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
				msg += "*RED*The " + enemy.NAME + " steals from his foes and grows stronger!\n";
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
				enemy.HP += HPSteal;
				enemy.MaxHP = Math.min(125, enemy.MaxHP + HPSteal/2);
				if (enemy.HP > enemy.MaxHP) {
					enemy.HP = enemy.MaxHP;
				}
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
					msg = "*RED*A high pitched shriek emits from the statue!\n";
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
				msg = "*RED*The Swamp Demon floods Row " + (max + 1) + " with cursed water!\n";
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
				msg += "*RED*The Swamp Demon summons a Living Vine!\n";
				allies.push(summon("living vine", enemy.ROW));
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
				msg += "*RED*The Forest Demon summons a Briar Beast!\n";
				allies.push(summon("briar beast", enemy.ROW));
			}
		}
		else if (enemy.NAME == "Cultist") {
			msg += moveAttack(allies, enemy, targets, new Attack("shanks", 4 + rand(5), 85, 0, 4))[0];
		}
		else if (enemy.NAME == "Servant") {
			msg += moveAttack(allies, enemy, targets, new Attack("strikes", 8 + rand(7), 100))[0];
		}
		else if (enemy.NAME == "Warded Totem") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*RED*The " + enemy.NAME + " emits a static burst!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(2 + rand(5), 100, 50), allies, enemy, targets, targets[i])[0]; 
				}
			}
			else if (ran == 1) {
				msg += "*RED*The runes on the " + enemy.NAME + " glow as it saps energy from its foes!\n";
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
				msg += "*RED*The " + enemy.NAME + " calls forth Cultists!\n";
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
					msg += "*RED*The " + enemy.NAME + " inspires his Cult!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].NAME == "Cultist") {
							AddOrRefreshEffect(allies[i], new Effect("Stronger", "Deal +3 Damage per Attack", 2, "buff"));
						}
					}
				}
				else if (ran == 2) {
					msg += "*RED*The " + enemy.NAME + " sacrifices his Cult to grow stronger!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].NAME == "Cultist") {
							allies[i].HP = 0;
							enemy.HP = Math.min(enemy.MaxHP, enemy.HP + 10);
							enemy.MaxHP += 5;
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
				msg = "*RED*The " + enemy.NAME + " enshrouds the battlefield in toxic fumes!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new P_Attack(4 + rand(5), 100, 100), allies, enemy, targets, targets[i])[0]; 
					AddOrRefreshEffect(targets[i], new Effect("Venom", "Take 4 dmg per turn.", 3));
				}
			}
		}
		else if (enemy.NAME == "Scaled Drake") {
			let ran = rand(3);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 14 + rand(15), 75), "strong")[0];
			}
			else {
				msg = "*RED*The " + enemy.NAME + " breathes fire across ";
				let rowNames = [];
				for (let i = 0; i < 5; i++) {
					if (max > enemy.ROW && i >= enemy.ROW) {
						rowNames.push(i);
					}
					else if (max < enemy.ROW && i <= enemy.ROW) {
						rowNames.push(i);
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
						msg += DealDamage(new M_Attack(6 + rand(7), 100, 50), allies, enemy, targets, targets[i])[0];
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
				msg += "*RED*The Beekeeper strengthens his swarm!\n";
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME == "Swarm of Bees" && allies[i].MaxHP < 6) {
						allies[i].MaxHP++;
						allies[i].HP = Math.min(allies[i].HP + 4, allies[i].MaxHP);
						AddOrRefreshEffect(allies[i], new Effect("Stronger", "Deal +3 Damage per Attack", 2, "buff"));
					}
				}
			}
			else if (ran == 1) {
				msg += "*RED*The Beekeeper harvests honey from his swarm!";
				enemy.HP = Math.min(enemy.HP + 2 * numBees, enemy.MaxHP);
			}
			else if (ran == 2) {
				let n = 3 + rand(3);
				for (let i = 0; i < n; i++) {
					msg += "*RED*The Beekeeper summons a swarm of bees!\n";
					allies.push(summon("Swarm of Bees", rand(5)));
				}
			}
			else if (index > -1) {
				msg += "*RED*The Beekeeper throws a jar of honey at " + targets[index].NAME + "!\n";
				let result = DealDamage(new P_Attack(12 + rand(11), 90), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1]) {
					msg += "*RED*" + targets[index].NAME + " is coated in honey, increasing their AP costs by 3!\n";
					AddOrRefreshEffect(targets[index], new Effect("Coated in Honey", "All AP Costs increased by 3.", 3));
				}
			}
			else {
				msg += moveInRange(enemy, targets, 3);
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
				msg += "*RED*The Houndlord summons crazed wolves!\n";
				allies.push(summon("Crazed Wolf", enemy.ROW));
				allies.push(summon("Crazed Wolf", enemy.ROW));
			}
			else {
				let ran = rand(2);
				if (ran == 0) {
				msg += "*RED*The Houndlord buffs his hounds!\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].HP > 0 && allies[i].NAME == "Crazed Wolf") {
							allies[i].HP += 5;
							allies[i].MaxHP += 5;
							AddOrRefreshEffect(allies[i], new Effect("Stronger", "Deal +3 Damage per Attack", 2, "buff"));
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
				msg += "The *RED*Swamp Mage*GREY* casts *GREEN*Swamp Strike*RED* at " + targets[index].NAME + "!\n";
				msg += DealDamage(new M_Attack(8 + rand(17), 90), allies, enemy, targets, targets[index])[0];
			}
			else {
				ran = rand(4);
				if (allies.length == 0) {
					ran = 1 + rand(3);
				}
			}
			if (ran == 0) {
				msg += "The *RED*Swamp Mage*GREY* heals her allies, cleansing their debuffs!\n";
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].HP > 0) {
						allies[i].HP = Math.min(allies[i].HP + 5, MaxHP(allies[i]));
						for (let j = allies[i].EFFECTS.length - 1; j >= 0; j--) {
							if (allies[i].EFFECTS[j].type == "debuff") {
								endEffect(allies[i], j);
							}
						}
					}
				}
			}
			else if (ran == 1) {
				msg += "The *RED*Swamp Mage*GREY* summons a Living Vine!\n";
				allies.push(summon("Living Vine", enemy.ROW));
			}
			else if (ran == 2) {
				msg += "The *RED*Swamp Mage*GREY* summons a Living Slime!\n";
				allies.push(summon("Living Slime", enemy.ROW));
			}
			else if (ran == 3) {
				msg += "The *RED*Swamp Mage*GREY* summons a Giant Amoeba!\n";
				allies.push(summon("Giant Amoeba", enemy.ROW));
			}
		}
		else if (enemy.NAME == "Living Vine") {
			let ran = rand(2);
			let index = findVictim(enemy.ROW, targets, 3);
			if (index > -1) {
				msg += "*RED*The " + enemy.NAME + " tangles " + targets[index].NAME + "!\n";
				let result = DealDamage(new P_Attack(8 + rand(9)), allies, enemy, targets, targets[index]);
				msg += result[0];
				if (result[1] && ran == 0) {
					msg += "*RED*" + targets[index].NAME + " is tangled in the vines and can't move!\n";
					AddOrRefreshEffect(targets[index], new Effect("Rooted", "Unable to Move.", 1));
				}
			}
			else {
				msg = moveInRange(enemy, targets, 3);
			}
		}
		else if (enemy.NAME == "Witch") {
			let ran = rand(3);
			let index = findVictim(enemy.ROW, targets, 3);
			if (ran == 0) {
				if (index > -1) {
					msg += "*RED*The " + enemy.NAME + " throws a potion at " + targets[index].NAME + "!\n";
					let result = DealDamage(new P_Attack(4 + rand(5), 85), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1]) {
						msg += "*RED*" + targets[index].NAME + " is stunned!\n";
						AddOrRefreshEffect(targets[index], new Effect("Stunned", "Lose your next turn.", 1));
					}
				}
				else {
					msg = moveInRange(enemy, targets, 3);
				}
			}
			else {
				index = findVictim(enemy.ROW, targets, 3);
				ran = rand(2);
				
				if (ran == 0) {
					if (index > -1) {
						msg += msg += "The *RED*" + enemy.NAME + "*GREY* hexes " + targets[index].NAME + "!\n";
						msg += DealDamage(new M_Attack(12 + rand(11)), allies, enemy, targets, targets[index])[0];
					}
					else {
						msg = moveInRange(enemy, targets, 3);
					}
				}
				else {
					msg += msg += "The *RED*" + enemy.NAME + "*GREY* curses all of her foes!\n";
					for (let i = 0; i < targets.length; i++) {
						msg += DealDamage(new M_Attack(4 + rand(3)), allies, enemy, targets, targets[i])[0]; 
						AddOrRefreshEffect(targets[i], new Effect("Poison", "Take 1 dmg per turn.", 10));
					}
				}
			}
		}
		else if (enemy.NAME == "Goblin Warlord") {
			let ran = rand(5);
			index = findVictim(enemy.ROW, targets, 2);
			let numGoblins = 0;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME.substring(0, "Goblin".length) == "Goblin") {
					numGoblins++;
				}
			}
			if (index > -1) {
				let chance = rand(2);
				if (chance == 0) {
					ran = 0;
				}
			}
			if ((ran == 0 && numGoblins > 1) || index > -1) {
				msg += moveAttack(allies, enemy, targets, new Attack("hammers", 8 + rand(11), 90, 0, 3, 2, 50), "strong");
			}
			else if (ran == 1 && numGoblins > 2) {
				msg += "*RED*The Goblin Warlord rallies his Horde!\n";
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].NAME.substring(0, "Goblin".length) == "Goblin") {
						AddOrRefreshEffect(allies[i], new Effect("Stronger", "Deal +3 Damage per Attack", 2, "buff"));
						allies[i].HP = Math.min(allies[i].HP + 5, MaxHP(allies[i]));
					}
				}
			}
			else if (ran == 2) {
				msg += "*RED*The Goblin Warlord blows his horn, and Swordsmen ambush from behind!\n";	
				for (let i = 0; i < 2; i++) {
					allies.push(summon("Goblin Swordsman", max, false));
				}
			}
			else if (ran == 3) {
				msg += "*RED*The Goblin Warlord blows his horn, and Spearmen march forth!\n";
				for (let i = 0; i < 2; i++) {
					allies.push(summon("Goblin Spearman", enemy.ROW, false));
				}
			}
			else {
				msg += "*RED*The Goblin Warlord blows his horn, and Archers emerge from hiding!\n";
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
				msg += "The *RED*Fae Trickster *GREY*teleports!\n";
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
				msg += "*RED*The Fae Trickster pranks all of its foes!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(4 + rand(5)), allies, enemy, targets, targets[i])[0]; 
				}
			}
			else {
				msg += "*RED*The Fae Trickster exhausts its foes!\n";
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
				msg += "*RED*The " + enemy.NAME + " heals in its shell. . .\n";
				enemy.HP += 8 + rand(16);
			}
			else {
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					msg += "*RED*The " + enemy.NAME + " chomps at " + targets[index].NAME + "!\n";
					let result = DealDamage(new P_Attack(16 + rand(13), 60), allies, enemy, targets, targets[index]);
					msg += result[0];
					if (result[1]) {
						AddOrRefreshEffect(targets[index], new Effect("Venom", "Take 4 dmg per turn.", 5));
					}
				}
				msg += moveInRange(enemy, targets, 1);
			}
		}
		else if (enemy.NAME == "Wandering Moon") {
			if (enemy.HP <= 15) {
				let ran = rand(4);
				if (ran == 0) {
					msg += "The light of the *RED*Wandering Moon*GREY* dims. . .\n";
				}
				else if (ran == 1) {
					msg += "A muffled scraping can be heard within the *RED*Wandering Moon*GREY*. . .\n";
				}
				else if (ran == 2) {
					msg += "The glow of the *RED*Wandering Moon*GREY* flickers. . .\n";
				}
				else if (ran == 3) {
					msg += "Pieces of the *RED*Wandering Moon's*GREY* exterior click in place as it reconstitutes itself.";
					enemy.HP = Math.min(enemy.MaxHP, enemy.HP + 10);
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
				for (let i = 0; i < 2; i++) {
					msg += "The brigand moves up, fleeing!\n";
					if (enemy.ROW == 0) {
						msg += "The brigand flees!\n";
						allies.splice(enemyIndex, 1);
					}
				}
			}
			else if (ran == 0) {
				msg += "*RED*The brigand steals 10 gold from each member of the party!\n";
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
			if (msg != "") {
				return msg;
			}
			let index = findVictim(enemy.ROW, targets, 1);
			if (index > -1) {
				msg += "*RED*The " + enemy.NAME + " wriggles into " + Name(targets[index]) + "!\n";
				msg += "*RED*" + targets[index].NAME + " feels unwell. . .\n";
				targets[index].EFFECTS.push(new Effect("Infested", "Lose 3 Stamina Per Turn.", 999));
				enemy.HP = 0;
			}
		}
		else if (enemy.NAME == "Squallbird") {
			let ran = rand(2);
			if (ran == 0) {
				if (min == enemy.ROW) {
					ran = 1;
				}
				else {
					msg += "*RED*The " + enemy.NAME + " away from the commotion!\n";
					msg += moveToRow(enemy, min);
				}
			}
			if (ran == 1) {
				msg += "*RED*The " + enemy.NAME + " dives fiendishly at its foe!\n";
				msg += moveInRange(enemy, targets, 1);
				let index = findVictim(enemy.ROW, targets, 1);
				if (index > -1) {
					for (let i = 0; i < 4; i++) {
						msg += "*RED*The " + enemy.NAME + " pecks " + Name(targets[index]) + "!\n";
						msg += DealDamage(new P_Attack(2 + rand(5), 90, 50), allies, enemy, targets, targets[index])[0];
					}
				}
			}
		}
		else if (enemy.NAME == "Reef Crab") {
			msg += moveAttack(allies, enemy, targets, new Attack("pinches", 8 + rand(7), 85))[0];
		}
		else if (enemy.NAME == "Squelcher") {
			let index = findVictim(enemy.ROW, targets, 3);
			if (index > -1) {
				msg += "*RED*The " + enemy.NAME + " sprays a strong jet of water at " + Name(targets[index]) + "!\n";
				msg += DealDamage(new P_Attack(8 + rand(9), 90), allies,enemy, targets, targets[index])[0];
			}
			let targetRow = rand(5);
			msg += moveToRow(enemy, targetRow);
		}
		else if (enemy.NAME == "Sunfish") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*RED*The " + enemy.NAME + " emits a burst of blinding light!\n";
				for (let i = 0; i < targets.length; i++) {
					msg += DealDamage(new M_Attack(2 + rand(5)), allies,enemy, targets, targets[i])[0];
					msg += Prettify(Name(targets[i])) + " is blinded!\n";
					AddOrRefreshEffect(targets[i], new Effect("Blinded", "50% Chance to Miss", 1));
				}
			}
			msg += "*RED*The " + enemy.NAME + " hurries away towards safety!\n";
			msg += moveToRow(enemy, min);
		}
		else if (enemy.NAME == "Coral Crawler") {
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].NAME == "Anchorite Worm") {
					msg += "*RED*The " + enemy.NAME + " eats the Anchorite Worm!\n";
					allies[i].HP = 0;
				}
			}
			if (enemy.HP < enemy.MaxHP) {
				let result = moveAttack(allies, enemy, targets, new Attack("stings", 2 + rand(7), 85));
				msg += result[0];
				if (result[1]) {
					msg += "*RED*The " + enemy.NAME + " injects " + result[1].NAME + " with a weak venom!\n";
					AddOrRefreshEffect(result[1], new Effect("Venom", "Take 4 dmg per turn.", 1));	
				}
			}
			else {
				ran = rand(2);
				if (enemy.ROW == 4 || (ran == 0 && enemy.ROW > 0)) {
					enemy.ROW--;
					msg += "*RED*The " + enemy.NAME + " skitters gently back.\n";
				}
				else {
					enemy.ROW++;
					msg += "*RED*The " + enemy.NAME + " skitters gently forward.\n";
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
				msg += "*RED*The Lost Mariner lets out an agonized moan.\n";
			}
		}
		else if (enemy.NAME == "Fishman Archer") {
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 4 + rand(7), 90, 0, 2, 6, 20), "strong")[0];
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 4 + rand(7), 90, 0, 2, 6, 20), "weak")[0];
			}
		}
		else if (enemy.NAME == "Fishman Tridentier") {
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 10 + rand(7), 75, 0, 2, 2, 25))[0];
		}
		else if (enemy.NAME == "Sea Priest" || enemy.NAME == "Sea Priestess") {
			let ran = rand(4);
			let numAllies = 0;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].HP > 0) {
					numAllies++;
				}
			}
			if (numAllies.length > 10) {
				ran = 1 + rand(3);
			}
			if (numAllies < 3) {
				ran = 1 + rand(2);
			}
			if (ran == 0) {
				for (let i = 0; i < 2; i++) {
					let enemies = ["reef crab", "coral crawler", "sunfish", "squallbird", "squelcher"];
					let index = rand(enemies.length);
					msg += "The " + enemy.NAME + " forms a " + Prettify(enemies[index]) + " out of the sea foam!\n";
					allies.push(summon(enemies[index]), enemy.ROW);
				}
			}
			else if (ran == 1) {
				let words = ["I shall wash ye in the waters of the earth.", "Prepare to be baptised."];
				msg += "\n*RED*" + enemy.NAME + ": *GREY*" + words[rand(2)] + "\n\n";
				msg += "*RED*They point their Driftwood Staff and a mighty wave washes over the battlefield!\n";
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
				msg += "*RED*The " + enemy.NAME + " raises their Driftwood Staff and freezes " + Name(targets[index]) + "!\n";
				AddOrRefreshEffect(targets[index], new Effect("Stunned", "Lose your next turn.", 1));
			}
			else if (ran == 3) {
				for (let i = 0; i < allies.length; i++) {
					let words = ["Let the waters clean you, my children.", "Be cleansed, my children."];
					msg += "\n*RED*" + enemy.NAME + ": *GREY*" + words[rand(2)] + "\n\n";
					for (let i = 0; i < allies.length; i++) {
						if (allies[i].HP > 0) {
							allies[i].HP = Math.min(allies[i].HP + 5, MaxHP(allies[i]));
							for (let j = allies[i].EFFECTS.length - 1; j >= 0; j--) {
								if (allies[i].EFFECTS[j].type == "debuff" && allies[i].EFFECTS[j].name != "Infested") {
									endEffect(allies[i], j);
								}
							}
						}
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
						msg += moveAttack(targets, enemy, allies, new Attack("swings its strong beak at", 12 + rand(11), 90, 0, 1, 2, 90))[0];
						msg += DealDamage(new P_Attack(12 + rand(11), 90, 100), allies, enemy, targets, targets[index])[0];
						crab = true;
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
			
		}
		else if (enemy.NAME == "Deep Horror") {
			for (let i = 0; i < targets.length; i++) {
				if (Math.abs(targets[i].ROW - enemy.ROW) < 2) {
					msg += "*RED*" + Prettify(Name(targets[i])) + " is sucked into the Pressure Field!\n";
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
					msg += "*RED*The " + enemy.NAME + " augments its pressure field to pull " + Name(targets[index]) + " closer!\n";
					msg += DealDamage(new M_Attack(8), allies, enemy, targets, targets[index])[0];
					targets[index].ROW = enemy.ROW;
				}
				else {
					ran = 1;
				}
			}
			if (ran != 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("crushes", 10 + rand(7), 100, 1));
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
							msg += "*RED*The " + enemy.NAME + " bites " + Name(targets[index]) + "!\n";
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
			let ran = rand(2);
			if (ran == 0) {
				let options = ["Carcinos seems annoyed. . .", "Carcinos doesn't seem interested in fighting.", "Carcinos seems to only be focused on its work."];
				msg += "*RED*" + options[rand(3)];
			}
			msg += moveAttack(allies, enemy, targets, new Attack("pinches", 14 + rand(13), 85))[0];
		}
		else if (enemy.NAME == "Siren") {
			let index = findVictim(enemy.ROW, targets, 1);
			let ran = rand(3);
			if (ran == 0) {
				msg += "*RED*A beautifully alluring pitch emits from the " + enemy.NAME + " drawing its foes closer!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == enemy.ROW) {
						msg += "*RED*" + Prettify(Name(targets[i])) + " is entranced by the pitch and is stunned!" 
						AddOrRefreshEffect(targets[i], new Effect("Stunned", "Lose your next turn.", 1));
					}
					else {
						msg += "*RED*" + Prettify(Name(targets[i])) + " is entranced by the pitch and moves towards the " + enemy.NAME + "!\n" 
						if (targets[i].ROW > enemy.ROW) {
							targets[i].ROW--;
						}
						else {
							targets[i].ROW++;
						}
					}
				}
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("chomps", 16 + rand(11), 90, 0, 1, 1, 50))[0];
			}
			if (index > -1) {
				msg += "*RED*The " + enemy.NAME + " chomps down on " + targets[index].NAME + "!\n";
				msg += DealDamage(new P_Attack(16 + rand(11), 90, 50), allies, enemy, targets, targets[index])[0];
			}
		}
		else if (enemy.NAME == "Dirge") {
			
		}
		else if (enemy.NAME == "Living Tide") {
			
		}
		else if (enemy.NAME == "Wadrin's Lizard") {
			let ran = rand(3);
			if (ran == 0) {
				let result = moveAttack(allies, enemy, targets, new Attack("tears into", 4 + rand(7), 80, 0, 3));
				msg += result[0];
				if (result[1]) {
					msg += "*RED*" + Prettify(Name(result[1])) + " begins to bleed!\n";
					AddOrRefreshEffect(result[1], new Effect("Bleed", "Take 4 dmg per turn.", 3));
				}
			}
			if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new Attack("savagely bites", 12 + rand(11), 90, 0, 1, 1, 30))[0];
			}
			else {
				let result = moveAttack(allies, enemy, targets, new Attack("swipes their massive tail at", 10 + rand(9), 90, 0, 1, 2, 50));
				if (result[1]) {
					if (result[1].TYPE == "player") {
						msg += "*RED*" + Prettify(Name(result[1])) + " is winded by the blow!\n";
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

