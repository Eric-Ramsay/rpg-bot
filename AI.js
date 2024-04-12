function findVictim(row, targets, range, type = "random") {
	if (rand(8) == 0) {
		type = "random";
	}
	let inRange = [];
	for (let i = 0; i < targets.length; i++) {
		if (targets[i].HP > 0) {
			if (Math.abs(targets[i].ROW - row) < range) {
				inRange.push(i);
			}
		}
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

function moveInRange(enemy, targets, range) {
	let msg = "";
	let moves = 0;
	if (hasEffect(enemy, "rooted")) {
		return msg;
	}
	let numMoves = enemy.MOVES;
	if (hasEffect(enemy, "slowed")) {
		numMoves = Math.min(numMoves, 1);
	}
	for (let i = 0; i < numMoves; i++) {
		let index = findVictim(enemy.ROW, targets, range);
		if (index == -1) {
			let targetRow = desiredRow(targets, enemy.ROW);
			if (targetRow < enemy.ROW) {
				moves--;
				enemy.ROW--;
			}
			else {
				moves++;
				enemy.ROW++;
			}
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

function moveAttack(enemies, enemy, targets, attack, type = "random") {
	let msg = "";
	let index = findVictim(enemy.ROW, targets, attack.range, type);
	if (index > -1) {
		for (let i = 0; i < attack.number; i++) {
			index = findVictim(enemy.ROW, targets, attack.range, type);
			if (index > -1) {
				let target = targets[index];
				msg += "The *RED*" + enemy.NAME + "*GREY* " + attack.verb + " *GREEN*" + target.NAME + "*GREY*!\n";
				msg += DealDamage(attack, enemies, enemy, targets, targets[index])[0];
			}
		}
	}
	else {
		msg = moveInRange(enemy, targets, attack.range);
		return msg;
	}
	return msg;
}

const PHYSICAL = 0;
const MAGICAL = 1;

function enemyAttack(enemyIndex, allies, targets, deadAllies, deadTargets) {
	let enemy = allies[enemyIndex];
	//console.log("Attacking: " + enemy.NAME);
	let msg = "";
	if (enemy.HP > 0) {
		if (enemy.NAME == "Swarm of Bats") {
			msg += moveAttack(allies, enemy, targets, new Attack("bites", 5 + rand(6), 90, 0, 4, 1), "strong");
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
				if (result[1] > 0) {
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
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 2 + rand(3), 90, 0, 4, 1));
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
					if (enemy.HP < enemy.MaxHP) {
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
			msg += moveAttack(allies, enemy, targets, new Attack("slimes", 4 + rand(5), 80, 0));
		}
		else if (enemy.NAME == "Giant Amoeba") {
			msg += moveAttack(allies, enemy, targets, new Attack("bumps into", 6 + rand(7), 100, 0));
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
				msg += moveAttack(allies, enemy, targets, new Attack("burns", 6 + rand(7), 100, 1));
			}
		}
		else if (enemy.NAME == "Wisp Knight") {
			let ran = rand(5); 
			if (ran == 0) {
				msg += "*RED*The " + enemy.NAME + " begins to burn brighter. . .\n"
				enemy.MaxHP = Math.min(150, enemy.MaxHP + 10);
				enemy.HP = Math.min(enemy.MaxHP, enemy.HP + 20);
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("burns", 10 + rand(11), 100, 1, 3));
			}
		}
		else if (enemy.NAME == "Slimelord") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*RED*A smaller slime drips off of the Slimelord!\n";
				allies.push(summon("Living Slime", enemy.ROW));
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("slimes", 18 + rand(19), 80, 0));
			}
		}
		else if (enemy.NAME == "Apparition") {
			let index = findVictim(enemy.ROW, targets, 6);
			if (index > -1 && targets[index].ROW != enemy.ROW) {
				msg += "*RED*The " + enemy.NAME + " vanishes and reappears!\n";
				enemy.ROW = targets[index].ROW;
			}
			msg += moveAttack(allies, enemy, targets, new Attack("spooks", 4 + rand(5), 100, 1));
		}
		else if (enemy.NAME == "Lost Angel") {
			msg += moveAttack(allies, enemy, targets, new Attack("smites", 1 + rand(41), 100, 1, 1, 100));
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
					if (result[1] > 0) {
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
					if (result[1] > 0) {
						msg += "*RED*" + targets[index].NAME + " is envenomed!\n";
						AddOrRefreshEffect(targets[index], new Effect("Venom", "Take 4 dmg per turn.", 3));
					}
				}
				else {
					msg = moveInRange(enemy, targets, 1);
				}
			}
			else if (ran == 1) {
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
						if (result[1] > 0) {
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
			msg += moveAttack(allies, enemy, targets, new Attack("bonks", 12 + rand(15), 75, 0, 1, 1, 50));
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
				msg += "*RED*The " + enemy.NAME + " summons living spores!\n";
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
				msg += "*RED*The " + enemy.NAME + " belches a puff of living spores!\n"
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
					if (result[1] > 0) {
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
				if (result[1] > 0) {
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
					if (result[1] > 0) {
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
					if (result[1] > 0) {
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
			msg += moveAttack(allies, enemy, targets, new Attack("hacks", 8 + rand(5), 65, 0, 2, 2, 10));
		}
		else if (enemy.NAME == "Skeletal Spearman") {
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 12 + rand(7), 75, 0, 1, 2, 25));
		}
		else if (enemy.NAME == "Skeletal Archer") {
			msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 6 + rand(9), 80, 0, 1, 6, 30));
		}
		else if (enemy.NAME == "Goblin Swordsman") {
			msg += moveAttack(allies, enemy, targets, new Attack("slashes", 14 + rand(9), 75, 0, 1, 2, 10), "strong");
		}
		else if (enemy.NAME == "Goblin Spearman") {
			msg += moveAttack(allies, enemy, targets, new Attack("stabs", 10 + rand(7), 85, 0, 1, 2, 10), "strong");
		}
		else if (enemy.NAME == "Goblin Archer") {
			msg += moveAttack(allies, enemy, targets, new Attack("looses an arrow at", 6 + rand(9), 90, 0, 1, 6, 20), "weak");
		}
		else if (enemy.NAME == "Flesh Golem") {
			let ran = rand(3);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("spits cursed blood at", 8 + rand(11), 75, 1));
			}
			else if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new Attack("crushes", 16 + rand(17), 50));
			}
			else if (ran == 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 6 + rand(5), 75, 1, 2));
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
					msg += moveAttack(allies, enemy, targets, new Attack("touches", 16 + rand(17), 100, 1));
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
				msg += moveAttack(allies, enemy, targets, new Attack("gnaws at", 4 + rand(5), 80, PHYSICAL, 2));
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
			msg += moveAttack(allies, enemy, targets, new Attack("hacks", 4 + rand(9), 80, 0, 2, 1, 25));
		}
		else if (enemy.NAME == "Ranger") {
			msg += moveAttack(allies, enemy, targets, new Attack("hacks", 4 + rand(6), 80, 0, 2, 6, 30));
		}
		else if (enemy.NAME == "Crazed Wolf") {
			if (enemy.HP <= 10) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites savagely at", 16 + rand(13), 85));
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 8 + rand(9), 65, 0, 2));
			}
		}
		else if (enemy.NAME == "Swamp Ape") {
			let ran = rand(4);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 16 + rand(9), 90));
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("punches", 10 + rand(15), 75));
			}
		}
		else if (enemy.NAME == "Wild Bear") {
			let ran = rand(2);
			if (ran == 0) {
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 16 + rand(13), 90));
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("swipes", 10 + rand(11), 75, 0, 2));
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
				if (result[1] > 0) {
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
					if (result[1] > 0) {
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
						msg += moveAttack(allies, enemy, targets, new Attack("chomps", 10 + rand(11), 90));
					}
				}
			}
			else {
				msg += moveAttack(allies, enemy, targets, new Attack("chomps", 10 + rand(11), 90));
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
				msg += moveAttack(allies, enemy, targets, new Attack("strikes", 8 + rand(9), 90, 0, 3, 1, 30), "strong");
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
			let rows = [0, 0, 0, 0, 0];
			for (let i = 0; i < targets.length; i++) {
				rows[targets[i].ROW] += targets[i].HP;
			}
			let max = 0;
			for (let i = 0; i < rows.length; i++) {
				if (rows[i] > rows[max]) {
					max = i;
				}
			}
			if (ran == 0 && rows[max] > 0) {
				msg = "*RED*The Swamp Demon floods Row " + (max + 1) + " with cursed water!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == max) {
						msg += DealDamage(new M_Attack(8 + rand(9)), allies, enemy, targets, targets[i])[0];
					}
				}
			}
			else if (ran == 1) {
				msg += moveAttack(allies, enemy, targets, new Attack("touches", 4 + rand(25), 85, 1));
			}
			else if (ran == 2) {
				msg += "*RED*The Swamp Demon summons a Living Vine!\n";
				allies.push(summon("living vine", enemy.ROW));
			}
		}
		else if (enemy.NAME == "Forest Demon") {
			let ran = rand(5);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("touches", 4 + rand(25), 85, 1));
			}
			else if (ran < 4) {
				msg += moveAttack(allies, enemy, targets, new Attack("spits fire", 10 + rand(9), 85, 0, 4));
			}
			else {
				msg += "*RED*The Forest Demon summons a Briar Beast!\n";
				allies.push(summon("briar beast", enemy.ROW));
			}
		}
		else if (enemy.NAME == "Cultist") {
			msg += moveAttack(allies, enemy, targets, new Attack("shanks", 4 + rand(5), 85, 0, 4));
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
					msg += moveAttack(allies, enemy, targets, new Attack("stabs", 12 + rand(11), 85, 0, 2));
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
			msg += moveAttack(allies, enemy, targets, new Attack("shanks", 4 + rand(5), 85, 0, 4));
		}
		else if (enemy.NAME == "Fumous Fiend") {
			let ran = rand(3);
			if (ran < 2) {
				msg += moveAttack(allies, enemy, targets, new Attack("hits", 12 + rand(13), 85));
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
				msg += moveAttack(allies, enemy, targets, new Attack("bites", 14 + rand(15), 75), "strong");
			}
			else {
				msg = "*RED*The " + enemy.NAME + " breathes fire across ";
				let rows = [];
				let direction = 0;
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW >= enemy.ROW) {
						direction++;
					}
					if (targets[i].ROW <= enemy.ROW) {
						direction--;
					}
				}
				if (direction == 0) {
					direction += (-1 + (2 * rand(1)));
				}
				for (let i = 0; i < 5; i++) {
					if (i <= enemy.ROW && direction < 0) {
						rows.push(i);
					}
					if (i >= enemy.ROW && direction > 0) {
						rows.push(i);
					}
				}
				for (let i = 0; i < rows.length; i++) {
					msg += "R" + (rows[i] + 1);
					if (rows.length >= 2 && i <= rows.length - 2) {
						if (rows.length > 2) {
							msg += ",";
						}
						if (i == rows.length - 2) {
							msg += " and";
						}
						msg += " ";
					}
				}
				msg += "!\n";
				for (let i = 0; i < targets.length; i++) {
					if ((direction > 0 && targets[i].ROW >= enemy.ROW) || (direction < 0 && targets[i].ROW <= enemy.ROW)) {
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
				if (result[1] > 0) {
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
					msg += msg += moveAttack(allies, enemy, targets, new Attack("cuts", 10 + rand(9), 90, 0, 2));
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
							if (allies[i].EFFECTS.type == "debuff") {
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
				if (result[1] > 0 && ran == 0) {
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
					if (result[1] > 0) {
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
				let rows = [0, 0, 0, 0, 0];
				for (let i = 0; i < targets.length; i++) {
					rows[targets[i].ROW] += targets[i].HP;
				}
				let max = 0;
				for (let i = 0; i < rows.length; i++) {
					if (rows[i] > rows[max]) {
						max = i;
					}
				}
				for (let i = 0; i < 2; i++) {
					allies.push(summon("Goblin Swordsman", max, false));
				}
			}
			else if (ran == 3) {
				msg += "*RED*The Goblin Warlord blows his horn, and Archers emerge from hiding!\n";
				let rows = [0, 0, 0, 0, 0];
				for (let i = 0; i < targets.length; i++) {
					rows[targets[i].ROW] += targets[i].HP;
				}
				let scores = [0, 0, 0, 0, 0];
				let min = 0;
				for (let i = 0; i < rows.length; i++) {
					let val = rows[i];
					if (i > 0) {
						val += rows[i - 1];
					}
					if (i < rows.length - 1) {
						val += rows[i + 1];
					}
					scores[i] = val;
					if (scores[i] < scores[min]) {
						min = i;
					}
				}
				for (let i = 0; i < 2; i++) {
					allies.push(summon("Goblin Archer", min, false));
				}
			}
			else if (ran == 4) {
				msg += "*RED*The Goblin Warlord blows his horn, and Spearmen march forth!\n";
				for (let i = 0; i < 2; i++) {
					allies.push(summon("Goblin Spearman", enemy.ROW, false));
				}
			}
		}
		else if (enemy.NAME == "Briar Beast") {
			msg += moveAttack(allies, enemy, targets, new Attack("wallops", 4 + rand(9), 80, 0, 1, 1, 30));
		}
		else if (enemy.NAME == "Briar Monster") {
			msg += moveAttack(allies, enemy, targets, new Attack("wallops", 12 + rand(15), 80, 0, 1, 1, 30));
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
				msg += moveAttack(allies, enemy, targets, new Attack("pranks", 6 + rand(5), 100, 1));
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
						targets[i].STAMINA -= 20;
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
					if (result[1] > 0) {
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
					msg += moveAttack(allies, enemy, targets, new Attack("shines a focused beam at", 14 + rand(11), 100, MAGICAL, 1, 3), "strong");
				}
				else {
					let ran = rand(2);
					if (ran == 0) {
						msg += moveAttack(allies, enemy, targets, new Attack("rams into", 12 + rand(11), 75, PHYSICAL, 1, 1, 50));
					}
					else {
						msg += moveAttack(allies, enemy, targets, new Attack("shines a focused beam at", 8 + rand(9), 100, MAGICAL, 1, 3), "strong");
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
			if (ran == 0) {
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
				msg += moveAttack(allies, enemy, targets, new Attack("strikes", 6 + rand(7), 90, 0, 2, 1, 20));
			}
		}
		else if (enemy.NAME == "Slugbeast") {
			msg += moveAttack(allies, enemy, targets, new Attack("chomps", 36 + rand(21), 6, 1));
		}
		else if (enemy.NAME == "Foul Sluglord") {
			msg += moveAttack(allies, enemy, targets, new Attack("chomps", 88 + rand(41), 6, 1));
		}
		else {
		}
	}
	return msg;
}

