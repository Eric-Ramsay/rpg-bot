
function StartTurn(battle, symbol = "E") {
	let msg = "";
	let allies = [];
	let enemies = [];
	let deadAllies = [];
	let deadEnemies = [];
	if (symbol == "E") {
		allies = battle.enemies;
		enemies = battle.allies;
		deadAllies = battle.deadEnemies;
		deadEnemies = battle.deadAllies;
	}
	else {
		allies = battle.allies;
		enemies = battle.enemies;
		deadAllies = battle.deadAllies;
		deadEnemies = battle.deadEnemies;
	}
	for (let i = allies.length - 1; i >= 0; i--) {
		let color = "*YELLOW*";
		if (symbol == "P") {
			color = "*GREEN*";
			if (allies[i].SUMMONED) {
				color = "*BLUE*";
			}
		}
		let tag = color + symbol + (i + 1) + "*GREY* - ";
		let C = allies[i];
		if (C.HP > 0) {
			let startHP = C.HP;
			let aName = Prettify(Name(C));
			let healing = 0;
			if (isEquipped(C, "Hand Cannon")) {
				msg += AddEffect(C, "Slowed", 1);
			}
			if (hasRune(C, "jade")) {
				AddEffect(C, "jade");
			}
			if (hasRune(C, "static")) {
				StackEffect(C, C.LEVEL, "static");
			}
			let invincible = hasEffect(C, "invincible");
			let shock = hasEffect(C, "static");
			if (shock) {
				msg += tag + "*CYAN*Static takes effect!\n";
				msg += DealDamage(new M_Attack(shock.stacks), allies, C, enemies, enemies[rand(enemies.length)])[0];
			}
			
			if (isEquipped(C, "blood staff") && C.HP < MaxHP(C)) {
				healing += 6;
			}
			
			for (const effect of C.EFFECTS) {
				if (effect.type == "debuff" && effect.causedBy != C.ID) {
					let causer = null
					for (const enemy of enemies) {
						if (enemy.ID == effect.causedBy) {
							causer = enemy;
							break;
						}
					}
					if (causer != null && causer.TYPE == "player") {
						let infectDmg = 0;
						for (const item of causer.INVENTORY) {
							if (item.equipped && item.type == "weapon") {
								for (const rune of item.runes) {
									if (rune.toLowerCase() == "infection") {
										infectDmg += Math.max(1, Math.floor(C.HP * .02 * item.hands));
									}
								}
							}
						}
						C.HP -= infectDmg;
					}
				}
			}
			
			//Runic Effects
			if (hasRune(C, "cultivation") && C.HP < MaxHP(C)) {
				healing += 4;
			}
			if (isEquipped(C, "Haunted Hookscale")) {
				C.HP -= 6;
				msg += tag + "*RED*Hooks burst out from your armor, looking for flesh to dig into!\n";
				for (let j = 0; j < enemies.length; j++) {
					msg += DealDamage(new P_Attack(8, 100), allies, C, enemies, enemies[j])[0] + "\n";
				}
			}
			if (hasRune(C, "sunset")) {
				msg += tag + "*YELLOW*Your enemies are burned by Sunset!\n";
				let string = "";
				for (let j = 0; j < enemies.length; j++) {
					string += DealDamage(new T_Attack(3), allies, C, enemies, enemies[j])[0];
				}
				let arr = string.split("\n");
				for (const line of arr) {
					if (line.includes("*YELLOW*")) {
						msg += line + "\n";
					}
				}
			}
			if (hasRune(C, "preservation")) {
				healing += Math.floor(C.AP/2)
			}
			
			if (hasRune(C, "equality")) {
				let numDebuffs = 0;
				for (const effect of C.EFFECTS) {
					if (effect.type == "debuff") {
						for (const enemy of enemies) {
							if (enemy.ROW == C.ROW) {
								numDebuffs++;
								StackEffect(enemy, effect.stacks, effect.name, effect.duration, C);
							}
						}
					}
				}
				if (numDebuffs > 0) {
					msg += "*PINK*Equality spreads your debuffs to your foes!\n";
				}
			}
			
			//Normal Effects
			if (hasEffect(C, "aura")) {
				for (let j = 0; j < enemies.length; j++) {
					msg += DealDamage(new T_Attack(2), allies, C, enemies, enemies[j])[0];
				}
			}
			if (hasEffect(C, "healing in shell")) {
				healing += 6 + rand(5);
			}
			if (hasEffect(C, "buried")) {
				healing += 4 + rand(3);
			}
			if (hasEffect(C, "regenerative")) {
				healing += 6
			}
			if (hasEffect(C, "health potion")) {
				healing += 10
			}
			if (hasEffect(C, "restorative synergy")) {
				healing += numBuffs(C);
			}
			if (isEquipped(C, "Driftwood Staff")) {
				let numPoisons = 0;
				for (let i = 0; i < enemies.length; i++) {
					numPoisons += countEffect(enemies[i], "poison");
				}
				healing += Math.floor(numPoisons/3);
			}
			if (!invincible) {
				let poison = countEffect(C, "poison");
				C.HP = Math.max(1, C.HP - poison);
				if (hasEffect(C, "venom")) {
					C.HP -= 5;
				}
				if (hasEffect(C, "wilting")) {
					C.HP = Math.max(1, C.HP - 4);
					if (C.TYPE == "player") {
						C.STAMINA = Math.max(0, C.STAMINA - 12);
					}
				}
				let embers = countEffect(C, "ember");
				let worms = countEffect(C, "infested");
				if (worms > 0 && C.TYPE == "player") {
					C.STAMINA = Math.max(C.STAMINA - worms * 3, 0);
				}
				C.HP -= (worms + embers);
				if (hasEffect(C, "bleed")) {
					let bleedDmg = 2 + (Math.floor(C.HP/25));
					C.HP -= bleedDmg;
				}
				if (hasEffect(C, "whipped")) {
					C.HP -= 4;
				}
			}
			
			if (C.CLASS == "monk") {
				let minHP = C.HP;
				let mindex = i;
				for (let j = 0; j < allies.length; j++) {
					if (allies[j].HP > 0 && allies[j].ROW == allies[i].ROW && allies[j].HP < minHP) {
						mindex = j;
						minHP = allies[j].HP;
					}
				}
				if (allies[mindex].HP < MaxHP(allies[mindex])) {
					let monkHeal = Math.floor(MaxHP(allies[i])/10);
					if (mindex == i) {
						healing += monkHeal;
					}
					else {
						msg += Heal(allies[mindex], monkHeal);
					}
				}
			}
			
			if (C.TYPE == "player") {
				C.TARGET_ID = "";
				C.FLED = false;	
				C.CASTS = 0;
				C.ENDED = false;
				C.BRACING = false;
				RemoveEffect(C, "guarding")
				for (let j = 0; j < C.INVENTORY.length; j++) {
					if (C.INVENTORY[j].type == "weapon") {
						C.INVENTORY[j].attacks[0] = w_attacks(C, C.INVENTORY[j]);
					}
				}
				C.STAMINA = Math.min(C.STAMINA + 2 * (1 + C.STATS[END]), MaxStamina(C));
				let diff = Math.min(C.STAMINA, MaxAP(C) - C.AP);
				C.AP += diff;
				C.STAMINA -= diff;
				
				if (hasEffect(C, "preparation")) {
					C.AP += 4;
				}
				if (hasRune(C, "cultivation")) {
					C.AP += 3;
				}
			}
			//Print Results of starting the turn
			let HPDiff = Math.min(startHP, startHP - C.HP);
			if (HPDiff > 0) {
				C.REPORT.taken += HPDiff;
				msg += tag + "*PINK*" + aName + " takes " + HPDiff + " damage from their active effects!\n";
			}
			if (C.HP > 0 && healing > 0) {
				msg += tag + Heal(C, healing);
			}
			
			let newEffects = [];
			for (const effect of C.EFFECTS) {
				effect.duration--;
				if (effect.duration < 0) {
					if (effect.name.toLowerCase() == "fading") {
						msg += "*PINK*" + Prettify(Name(C)) + " fades away. . .\n";
						C.HP = 0;
					}
				}
				else {
					newEffects.push(effect);
				}
			}
			C.EFFECTS = newEffects;
			let stunned = hasEffect(C, "stunned");
			
			if (stunned) {
				msg += "*CYAN*" + aName + " is stunned!\n";
				if (C.TYPE == "player") {
					C.ENDED = true;
				}
			}
			else if (C.TYPE != "player") {
				if (C.HP <= 0) {
					msg += Deliver(C);
				}
				if (C.HP > 0) {
					let text = "";
					if (hasEffect(C, "confused")) {
						enemies.push(C);
						text = enemyAttack(enemies.length - 1, enemies, allies, deadAllies, deadEnemies);
						for (let n = 0; n < enemies.length; n++) {
							if (enemies[n].ID == C.ID) {
								enemies.splice(n, 1);
							}
						}
					}
					else {
						text = enemyAttack(i, allies, enemies, deadAllies, deadEnemies);
					}
					if (text != "") {
						if (C.TYPE == "boss" && i < allies.length - 1) {
							msg += "\n";
						}
						msg += tag + text + "\n";
					}
				}
			}
			else if (hasEffect(C, "terrified")) {
				msg += enemyAttack(i, allies, enemies, deadAllies, deadEnemies);
			}
		}
		if (C.HP <= 0) {
			msg += Deliver(C);
			if (C.HP <= 0) {
				msg += tag + deathCry(C, allies, enemies);
				if (C.HP <= 0) {
					deadAllies.push(COPY(C));
					allies.splice(i, 1);
				}
			}
		}
	}
	for (let i = allies.length - 1; i >= 0; i--) {
		let guarding = hasEffect(allies[i], "guarding");
		if (guarding) {
			let found = false;
			for (let j = 0; j < allies.length; j++) {
				if (allies[j].ID == guarding.target.ID) {
					found = true;
					if (allies[j].ROW != allies[i].ROW) {
						msg += "*CYAN*" + Prettify(Name(allies[i])) + " is no longer guarding " + Name(guarding.target) + ".\n";
						RemoveEffect(allies[i], "guarding");
					}
				}
			}
			if (!found) {
				msg += "*CYAN*" + Prettify(Name(allies[i])) + " is no longer guarding " + Name(guarding.target) + ".\n";
				RemoveEffect(allies[i], "guarding");
			}
		}
		if (allies[i].TYPE == "player" && hasEffect(allies[i], "guarding")) {
			allies[i].AP = Math.max(0, allies[i].AP - 6);
		}
		if (hasEffect(allies[i], "coated in honey")) {
			allies[i].AP = Math.floor(allies[i].AP/2);
		}
	}
	for (let i = enemies.length - 1; i >= 0; i--) {
		if (enemies[i].HP <= 0) {
			deadEnemies.push(COPY(enemies[i]));
			enemies.splice(i, 1);
		}
	}
	if (battle.allyTurn) {
		msg += DrawCombat(battle) + "\n";
	}
	return msg;
}

function FinalBoss(battle) {
	let msg = "";
	if (battle.zone == 2) {
		msg += "Deep in the woods you discover the remnants of an ancient hall now fallen to ruin and decay. The forest has claimed it, moss and lichen cling to the marble walls and crystal windows, and the floor, if ever there was one, has long since decayed into dirt and grass.\n\nAt the far end of the hall, pass the lines of broken marble statues is a throne, barely distinguishable beneath the gnarled mess of thorny vines that have buried it. On closer inspection you can see that runes are etched into the bark of the vines, and that they are rising and falling slowly. Something is sitting in the throne, breathing softly; sealed beneath the vines.\n\nSuddenly, Briar Monsters erupt from the dirt around you.\n\n";
		for (let i = 0; i < 4; i++) {
			battle.enemies.push(summon("mossy statue", i));
		}
		battle.enemies.push(summon("briar monster", 4));
		battle.enemies.push(summon("briar monster", 4));
		battle.enemies.push(summon("briar monster", 4));
		battle.enemies.push(summon("seated figure", 4));
	}
	return msg;
}

function configureEnemies(enemyList, targets, resilient = false) {
	let msg = "";
	for (let i = enemyList.length - 1; i >= 0; i--) {
		if (enemyList[i].NAME == "Swamp Stalker") {
			enemyList[i].ROW = 1;
		}
		if (enemyList[i].NAME == "Wild Bear") {
			AddEffect(enemyList[i], "blocking", 999);
		}
		if (enemyList[i].NAME == "Mechanical Guardsman") {
			AddEffect(enemyList[i], "blocking", 999);
		}
		if (enemyList[i].NAME == "Ephemeral Warrior") {
			AddEffect(enemyList[i], "fading", 8);
		}
		if (enemyList[i].NAME == "Grand Architect") {
			msg += "*YELLOW*The Grand Architect deploys their defenses!\n";
			enemyList.push(summon("Warding Shield", enemyList[i].ROW));
			enemyList.push(summon("Mechanical Guardsman", enemyList[i].ROW));
			enemyList.push(summon("Mechanical Guardsman", enemyList[i].ROW));
			enemyList.push(summon("Mechanical Gunman", enemyList[i].ROW));
			enemyList.push(summon("Mechanical Gunman", enemyList[i].ROW));	
		}
	}
	for (let i = 0; i < enemyList.length; i++) {
		if (enemyList[i].NAME == "Hiveling Guard") {
			let tag = "*YELLOW*E" + (i + 1) + "*GREY* - ";
			let text = enemyAttack(i, enemyList, targets);
			if (text != "") {
				msg += tag + text + "\n";
			}
		}
		if (resilient) {
			AddEffect(enemyList[i], "resilient", 0);
		}
	}
	return msg;
}

function generateEnemies(r, zone) {
	let enemyList = [];
	let validEnemies = [];
	let rating = Math.floor(r);
	for (const enemy of enemies) {
		if (validZone(enemy, zone) && enemy.DIFFICULTY <= rating) {
			validEnemies.push(enemy);
		}
	}
	
	//Spawn Hivelings instead of normal enemies
	if (rating > 200 && rand(100) <= 5) {
		if (zone == 0 || zone == 2) {
			validEnemies = [];
			for (const enemy of enemies) {
				if (enemy.NAME.toLowerCase().includes("hiveling") && enemy.DIFFICULTY <= rating) {
					if (enemy.NAME != "Hiveling Larva") {
						validEnemies.push(enemy);
					}
					if (enemy.NAME == "Hiveling Warrior") {
						enemyList.push(summon(enemy.NAME, 4, false));
					}
				}
			}
		}
	}
	
	validEnemies = shitSort(validEnemies, "DIFFICULTY");
	let baseDifficulty = 0;
	if (rating > 300) {
		baseDifficulty = Math.min(70, Math.min(validEnemies[0].DIFFICULTY, rating/5));
	}
	let loops = 0;
	while (validEnemies.length > 0 && rating > 0) {
		if (validEnemies.length == 0 || validEnemies[0].DIFFICULTY < baseDifficulty) {
			console.log("Bailing out with " + rating + " left over. Oh well.");
			break;
		}
		let limit = validEnemies.length;
		let minDifficulty = Math.floor(rating/3);
		let forcedDiversity = 4;
		if (validEnemies.length > forcedDiversity) {
			if (validEnemies[forcedDiversity].DIFFICULTY < minDifficulty) {
				minDifficulty = validEnemies[forcedDiversity].DIFFICULTY;
			}
		}
		for (let i = 0; i < validEnemies.length; i++) {
			if (validEnemies[i].DIFFICULTY < minDifficulty) {
				limit = Math.max(0, (i - 1));
				break;
			}
		}
		limit = Math.max(limit, Math.min(forcedDiversity, validEnemies.length));
		//for (let j = 0; j < limit; j++) {
		//	console.log((1+j).toString().padStart(2, '0') + ") " + StackStrings(validEnemies[j].NAME, validEnemies[j].DIFFICULTY, 20));
		//}
		let index = rand(limit);
		let row = 4;
		if (rand(8) == 0) {
			row = 3;
		}
		enemyList.push(summon(validEnemies[index].NAME, row, false));
		rating -= validEnemies[index].DIFFICULTY;
		var newTeams = [];
		for (const enemy of validEnemies) {
			if (enemy.DIFFICULTY <= rating) {
				newTeams.push(enemy);
			}
		}
		validEnemies = newTeams;
	}
	return enemyList;
}

function ConfigureAllies(battle) {
	for (let i = 0; i < battle.allies.length; i++) {
		if (battle.allies[i].CLASS == "noble") {
			let servant = summon("servant", battle.allies[i].ROW);
			if (battle.allies[i].SERVANT) {
				servant.NAME = battle.allies[i].SERVANT;
			}
			servant.MaxHP = 30 + 10 * battle.allies[i].LEVEL;
			servant.HP = servant.MaxHP;
			battle.allies.push(servant);
		}
		if (battle.allies[i].CLASS == "witch") {
			let familiar = summon("familiar", battle.allies[i].ROW);
			if (battle.allies[i].FAMILIAR) {
				familiar.NAME = battle.allies[i].FAMILIAR;
			}
			familiar.MASTER = battle.allies[i].ID;
			familiar.MaxHP = 35 + 5 * battle.allies[i].LEVEL;
			familiar.HP = familiar.MaxHP;
			battle.allies.push(familiar);
		}
	}
}

function StartBattle(battle) {
	let msg = "";
	let lvl = 0;
	let num = 0;
	for (let i = 0; i < battle.allies.length; i++) {
		if (battle.allies[i].TYPE == "player") {
			num++;
			AddEffect(battle.allies[i], "Coward's Haste", 1);
			lvl += battle.allies[i].LEVEL;
			battle.allies[i].STAMINA = MaxStamina(battle.allies[i]);
		}
	}
	ConfigureAllies(battle);
	if (battle.level == 4) {
		msg += FinalBoss(battle);
	}
	else {
		lvl /= num;
		let rating = 45 * num * Math.pow(1.22, lvl) + (15 * (lvl - 1) * num);
		
		ran = rand(10);
		if (ran == 0) {
			data["town"].zones[battle.zone].enraged = true;
		}
		if (data["town"].zones[battle.zone].enraged) {
			msg += "*CYAN*You've enraged the " + zoneName(battle.zone) + "!\n\n";
			rating *= 1.5;
			for (let i = 0; i < battle.allies.length; i++) {
				RemoveEffect(battle.allies[i], "Coward's Haste");
			}
		}
		rating = Math.floor(rating);
		
		console.log("Combat Difficulty: " + rating);
		/*
		let quests = data["town"].quests;
		for (const quest of quests) {
			for (const enemy of enemies) {
				if (enemy.NAME.toLowerCase() == quest.enemy.toLowerCase()) {
					if (validZone(enemy, battle.zone) && enemy.DIFFICULTY <= rating) {
						validEnemies.push(enemy);
						validEnemies.push(enemy);
					}
					break;
				}
			}
		}*/
		battle.enemies = battle.enemies.concat(generateEnemies(rating, battle.zone));
		msg += configureEnemies(battle.enemies, battle.allies, true);
	}
	battle.enemies = shitSort(battle.enemies, "DIFFICULTY");
	return msg;
}

function PurgeBattles() {
	for (let i = battles.length - 1; i >= 0; i--) {
		let hasPlayers = false;
		for (let j = 0; j < battles[i].allies.length; j++) {
			if (battles[i].allies[j].TYPE == "player" && battles[i].allies[j].HP > 0) {
				hasPlayers = true;
			}
		}
		if (!hasPlayers) {
			battles.splice(i, 1);
		}
	}
}

function generateLoot(enemyList, zone) {
	let loot = [];
	let lootValue = 0;	
	let difficulty = 0;
	
	//Zone Loot
	let dropList = zoneLoot[zone];
	
	//Enemy Loot
	for (const enemy of enemyList) {
		if (!enemy.SUMMONED) {
			difficulty += enemy.DIFFICULTY;
			dropList.concat(enemy.LOOT);
		}
	}
	
	//Handle Zone + Enemy Drops
	for (const drop of dropList) {
		let ran = rand(100);
		if (ran <= drop.chance) {
			let item = startItem(drop.name);
			lootValue += item.value;
			loot.push(item);
		}
	}
	
	//Generic Loot
	dropList = shitSort(COPY(genericLoot), "value", true);
	let lootMax = Math.max(20, difficulty/3);
	console.log("Rewarding " + lootMax + "G worth of loot.");
	let maxIndex = genericLoot.length;
	while (lootMax > 0) {
		let lootMin = Math.min(100, lootMax/15);
		let minIndex = 0;
		for (let i = 0; i < genericLoot.length; i++) {
			if (minIndex == 0 && genericLoot[i].value >= lootMin) {
				minIndex = i;
			}
			if (genericLoot[i].value > lootMax) {
				maxIndex = i;
				break;
			}
		}
		let index = minIndex + rand(maxIndex - minIndex);
		let item = COPY(genericLoot[index]);
		loot.push(item);
		lootMax -= item.value;
	}
	
	if (rand(5) == 0) {
		let mimics = [
			new Item("Stanima Potion", 	"mimic", 0, "A potion, but something seems off about it . . ."),
			new Item("Heolth Potion", 	"mimic", 0, "A potion, but something seems off about it . . ."),
			new Item("Armor", 			"mimic", 0, "It looks like metal, but it's pulsing . . ."),
			new Item("Weapon", 			"mimic", 0, "It kind of looks like a sword, or maybe an axe. . ."),
			new Item("Gold", 			"mimic", 0, "An amoprhous pile resembling coins."),
			new Item("Potion", 			"mimic", 0, "A translucent bottle-shaped lump filled with what looks like blood."),
			new Item("Gemstome", 		"mimic", 0, "A damp lump that almost resembles a ruby."),
		];
		let min = 100000;
		let max = 0;
		for (const item of loot) {
			if (item.value < min) {
				min = item.value;
			}
			if (item.value > max) {
				max = item.value;
			}
		}
		min = Math.floor(min/5);
		max = Math.floor(max/5);
		let mimic = COPY(mimics[rand(mimics.length)]);
		mimic.value = (min + rand(max - min)) * 5;
		loot.push(mimic);
	}
	return loot;
}

function WinBattle(battle) {
	let numPlayers = 0;
	if (battle.level >= 4) {
		for (let i = 0; i < battle.allies.length; i++) {
			if (battle.allies[i].TYPE == "player") {
				let C = battle.allies[i];
				let report = new DeathReport(C.NAME, C.CLASS, C.LEVEL, C.REPORT, C.DESCRIPTION);
				if (C.SERVANT && C.SERVANT != "") {
					report.NAME = C.SERVANT + " *GREY*and*GREEN* " + C.NAME;
				}
				if (battle.zone == 2) {
					report.DEATH = "Elder Succubus";
				}
				data["town"].zones[battle.zone].statues.push(report);
				C.RETIRED = true;
				data["town"].retired.push(C);
			}
		}
		battle.allies = [];
		SaveState();
		return "*CYAN*A statue is commissioned of you for your deeds, and you enter a permanent retirement in the hall of heroes!\n";
	}
	let msg = "";
	if (data["town"].zones[battle.zone].enraged) {
		data["town"].zones[battle.zone].enraged = false;
		msg += "*CYAN*" + P(zoneName(battle.zone)) + " has been pacified. . .\n"; 
	}
	else {
		msg += "*GREEN*The enemies are all slain!*GREY*\n";
	}
	battle.started = false;
	//Handle Player despawning/deaths & drop items they're carrying
	for (let a = battle.allies.length - 1; a >= 0; a--) {
		if (battle.allies[a].MASTER) {
			for (const ally of battle.allies) {
				if (ally.ID == battle.allies[a].MASTER) {
					ally.REPORT.damage += battle.allies[a].REPORT.damage;
					ally.REPORT.kills += battle.allies[a].REPORT.kills;
				}
			}
		}
		if (battle.allies[a].SUMMONED) {
			battle.allies.splice(a, 1);
		}
		else if (battle.allies[a].HP <= 0) {
			battle.deadAllies.push(battle.allies[a]);
			battle.allies.splice(a, 1);
		}
		else {
			numPlayers++;
		}
	}
	for (const ally of battle.deadAllies) {
		if (ally.TYPE == "player") {
			let INVENTORY = ally.INVENTORY;
			for (let i = 0; i < INVENTORY.length; i++) {
				INVENTORY[i].equipped = false;
				let ran = rand(100);
				let dropChance = 25;
				if (INVENTORY[i].runes && INVENTORY[i].runes.length > 3) {
					dropChance *= 2;
				}
				if (ran < dropChance) {
					battle.loot.push(INVENTORY[i]);
				}
			}
		}
		if (ally.MASTER) {
			for (const otherAlly of battle.allies) {
				if (otherAlly.ID == ally.MASTER) {
					otherAlly.REPORT.damage += ally.REPORT.damage;
					otherAlly.REPORT.kills += ally.REPORT.kills;
				}
			}
		}
	}
	let goldReward = 10;
	let expReward = 0;
	for (const enemy of battle.deadEnemies) {
		//msg += CheckQuest(enemy, battle.allies);
		if (!enemy.SUMMONED) {
			if (enemy.NAME == "Brigand" || enemy.NAME == "Brigand Lord") {
				goldReward += Math.floor(enemy.PHASE/numPlayers);
			}
			else if (enemy.NAME == "Treasure Chest") {
				goldReward += 40;
			}
			else {
				goldReward += (1 + Math.ceil(enemy.DIFFICULTY/20));
			}
			goldReward = Math.min(200, goldReward);
			expReward += enemy.DIFFICULTY;
		}
	}
	battle.loot = battle.loot.concat(generateLoot(battle.deadEnemies, battle.zone));
	battle.loot = shitSort(battle.loot, "value");
	msg += "*GREEN*Each player gains " + goldReward + " gold and " + expReward + " experience!\n";
	for (const player of battle.allies) {
		player.EFFECTS = [];
		player.GOLD += goldReward;
		player.REPORT.gold += goldReward;
		player.XP += expReward;
		let xpRequired = player.LEVEL * 100;
		if (player.XP >= xpRequired) {
			msg += "*GREEN*" + player.NAME + " levels up!\n";
			player.XP -= xpRequired;
			player.LEVEL++;
			player.SP++;
		}
		if (hasRune(player, "huntsman")) {
			player.HP = MaxHP(player);
		}
	}
	battle.enemies = [];
	battle.deadEnemies = [];
	battle.deadAllies = [];
	msg += DrawCombat(battle) + "\n";
	return msg;
}

function CheckQuest(enemy, allies) {
	let msg = "";
	var quests = data["town"].quests;
	for (let i = 0; i < quests.length; i++) {
		let quest = quests[i];
		if (enemy.NAME == quest.enemy) {
			quest.numKilled++;
			if (quest.numRequired <= quest.numKilled) {
				msg += "*YELLOW*Quest Completed! Town gains " + quest.value * 3 + " prosperity! Players gain " + quest.value + " gold!\n";
				data["town"].prosperity += 3 * quest.value;
				for (const player of allies) {
					console.log(player.NAME);
					if (player.GOLD) {
						player.REPORT.gold += quest.value;
						player.GOLD += quest.value;
					}
				}
				quest = createQuest();
			}
			data["town"].quests[i] = quest;
		}
	}
	if (msg != "") {
		SaveState();
	}
	return msg;
}

function TurnCompleted(team) {
	for (let i = 0; i < team.length; i++) {
		if (team[i].TYPE == "player" && !(team[i].ENDED) && team[i].HP > 0) {
			return false;
		}
	}
	return true;
}

function CheckEnemies(battle, testing = false) {
	let msg = "";
	if (!battle.started) {
		return "";
	}
	for (let i = battle.enemies.length - 1; i >= 0; i--) {
		if (battle.enemies[i].HP <= 0) {
			battle.deadEnemies.push(COPY(battle.enemies[i]));
			battle.enemies.splice(i, 1);
		}
	}
	for (let i = battle.allies.length - 1; i >= 0; i--) {
		if (battle.allies[i].HP <= 0) {
			battle.deadAllies.push(COPY(battle.allies[i]));
			battle.allies.splice(i, 1);
		}
	}
	battle.started = battle.started && (battle.allies.length > 0 && battle.enemies.length > 0);
	if (!battle.started && battle.allies.length > 0 && !testing) {
		let ran = rand(20);
		if (ran == 0) {
			battle.started = true;
			msg += "*YELLOW*You come upon an old treasure chest. . .\n";
			battle.enemies.push(new Enemy("Treasure Chest",	20,	0, 0, 0, [], 0, "construction", "An old wooden chest with a heavy iron lock."));
		}
		else {
			msg += WinBattle(battle);
		}
	}
	return msg;
}

function HandleCombat(battle, purgeBattle = true, testing = false) {
	let msg = "";
	if (battle == null || !(battle.started)) {
		return "";
	}
	msg += CheckEnemies(battle, testing);
	if (battle.started && battle.allyTurn && TurnCompleted(battle.allies)) {
		battle.allyTurn = false;
		msg += "*RED*It is now the enemies' turn!\n\n";
		msg += StartTurn(battle, "E");
		msg += CheckEnemies(battle, testing);
	}
	if (battle.started && !battle.allyTurn && TurnCompleted(battle.enemies)) {
		battle.allyTurn = true;
		msg += "*GREEN*It is now the players' turn!\n\n";
		msg += StartTurn(battle, "P");
		msg += CheckEnemies(battle, testing);
	}
	
	if (purgeBattle) {
		PurgeBattles();
	}
	return msg;
}


function AllyAttack(Battle, C, enemyIndex, weaponIndex, reprise = false, gunPierce = false) {
	let msg = "";
	let enemy = Battle.enemies[enemyIndex];
	let id = enemy.ID;
	let enemyHP = enemy.HP;
	let eName = enemy.NAME;
	let targetRow = enemy.ROW;
	let weapon = C.INVENTORY[weaponIndex];
	if (!reprise && !gunPierce) {
		weapon.attacks[0]--;
		C.AP -= w_AP(C, weapon);
	}
	RemoveEffect(C, "Coward's Haste");
	
	let minDmg = w_min(C, weapon);
	let maxDmg = w_max(C, weapon);
	
	let dmg = minDmg + rand(1 + maxDmg - minDmg);
	//console.log("Damage Roll: " + dmg);
	if (hasWeaponRune(weapon, "decisive")) {
		if (weapon.attacks[0] == w_attacks(C, weapon) - 1) {
			dmg *= 1.25;
		}
	}
	if (weapon.name == "Coral Axe" && hasEffect(enemy, "bleed")) {
		dmg *= 1.25;
	}
	if (hasWeaponRune(weapon, "powerful")) {
		dmg *= 1.20;
	}
	if (hasWeaponRune(weapon, "maladious")) {
		let debuffs = numDebuffs(enemy);
		if (debuffs > 0) {
			dmg *= 1.1;
			dmg += debuffs;
		}
	}
	if (C.CLASS == "ranger") {
		let mult = 1 + (1 + Math.abs(C.ROW - enemy.ROW)) * .05;
		dmg *= mult;
	}
	if (C.CLASS == "duelist") {
		dmg *= 1.15;
	}
	dmg = Math.floor(dmg * (1 + .05 * C.STATS[WEP]));
	if (hasEffect(C, "cascade")) {
		dmg += 2;
	}
	msg = "*GREEN*" + C.NAME + "*GREY*" + " attacks the *RED*" + enemy.NAME + "*GREY* with their " + weapon.name + ".\n";
	if (hasWeaponRune(weapon, "lethality")) {
		if (rand(101) <= 15) {
			dmg *= 2;
			msg += "*PINK*It's a lethal blow!\n";
		}
	}
	if (weapon.subclass == "axe") {
		if (rand(101) <= 15) {
			dmg *= 2;
			msg += "*GREEN*It's a wild blow!\n";
		}
	}
	
	//RNG BALANCING -----------------
	let hand = LEFT;
	let weaponChance = w_chance(C, weapon);
	if (weaponChance > hitPercent(C, hand)) {
		weaponChance *= 1.25;
	}
	if (C.LEFT == weaponIndex) {
		C.ATTEMPTS[LEFT]++;
		
	}
	if (C.RIGHT == weaponIndex) {
		C.ATTEMPTS[RIGHT]++;
		hand = RIGHT;
	}
	//-------------------------------
	if (hasRune(C, "pacifist")) {
		dmg = 0;
	}
	let result = DealDamage(new P_Attack(Math.round(dmg), weaponChance, w_pen(C, weapon)), Battle.allies, C, Battle.enemies, enemy);
	msg += result[0];
	if (result[1] == -2) {
		if (!reprise && hasWeaponRune(weapon, "reprise")) {
			msg += "*CYAN*Reprise takes effect\n";
			msg += AllyAttack(Battle, C, enemyIndex, weaponIndex, true, true);
		}
	}
	else {
		if (C.LEFT == weaponIndex) {
			C.HITS[LEFT]++;
		}
		if (C.RIGHT == weaponIndex) {
			C.HITS[RIGHT]++;
		}
	}
	
	if (weapon.name == "Hand Cannon" && !gunPierce) {
		let firingRight = true;
		if (enemy.ROW < C.ROW) {
			firingRight = false;
		}
		let rows = [[], [], [], [], []];
		for (let i = 0; i < Battle.enemies.length; i++) {
			rows[Battle.enemies[i].ROW] += i;
		}
		if (firingRight) {
			for (let i = C.ROW; i < 5; i++) {
				if (i != enemy.ROW && rows[i].length > 0) {
					let enemyIndex = rows[i][rand(rows[i].length)];
					msg += AllyAttack(Battle, C, enemyIndex, weaponIndex, reprise, true);
				}
			}
		}
		else {
			for (let i = C.ROW; i >= 0; i--) {
				if (i != enemy.ROW && rows[i].length > 0) {
					let enemyIndex = rows[i][rand(rows[i].length)];
					msg += AllyAttack(Battle, C, enemyIndex, weaponIndex, reprise, true);
				}
			}
		}
	}
	
	//PROC ON HIT EFFECTS -------------------------
	if (result[1] > 0) {
		if (weapon.subclass == "polearm") {
			if (enemy.ROW == C.ROW) {
				msg += PushTarget(C, enemy);
			}
		}
		if (hasWeaponRune(weapon, "leeching")) {
			msg += Heal(C, 3);
			C.STAMINA = Math.min(C.STAMINA + 3, MaxStamina(C));
		}
		if (weapon.name == "Vampire Fang") {
			msg += Heal(C, Math.ceil(result[1]/2));
		}
		if (weapon.name == "Coral Axe") {
			msg += AddEffect(enemy, "bleed");
		}
		if (hasWeaponRune(weapon, "peel")) {
			msg += "You peel away the armor of the " + enemy.NAME + "!\n"
			enemy.ARMOR[0] = Math.max(0, enemy.ARMOR[0] - 1);
		}
		if (enemy.HP > 0) {
			if (hasWeaponRune(weapon, "affliction")) {
				let effects = ["poison", "venom", "bleed"];
				if (!(hasEffect(enemy, "bleed"))) {
					msg += AddEffect(enemy, "bleed", 3, C);
				}
				else if (!(hasEffect(enemy, "venom"))) {
					msg += AddEffect(enemy, "venom", 3, C);
				}
				else {
					msg += AddEffect(enemy, "poison", 3, C);
				}
			}
			if (weapon.subclass == "whip") {
				let chance = rand(101);
				if (chance <= 50) {
					msg += AddEffect(enemy, "Whipped", 3, C);
				}
			}
		}
	}
	
	let bossKill = (enemy.TYPE == "boss" && eName != enemy.NAME);
	if (!bossKill) {
		let sweepDmg = 0;
		if (weapon.subclass == "blunt") {
			sweepDmg += 2 + Math.floor(dmg/10);
		}
		if (weapon.name == "Sweeping Sword") {
			sweepDmg += Math.max(1, Math.floor(dmg/2));
		}
		if (hasWeaponRune(weapon, "sweeping") && result[1] > 0) {
			sweepDmg += Math.max(1, Math.round(dmg * .2));
		}
		if (hasWeaponRune(weapon, "terror") && result[1] > 0) {
			for (let i = 0; i < Battle.enemies.length; i++) {
				if (Battle.enemies[i].ROW == enemy.ROW && dmg > Battle.enemies[i].DIFFICULTY) {
					let ran = rand(100);
					if (ran < 50) {
						msg += AddEffect(Battle.enemies[i], "terrified", 1, C);
					}
				}
			}
		}
		if (sweepDmg > 0 && !bossKill) {
			for (let i = 0; i < Battle.enemies.length; i++) {
				if (Battle.enemies[i].ID != id && Battle.enemies[i].ROW == targetRow) {
					msg += DealDamage(new P_Attack(sweepDmg, 100, w_pen(C, weapon)), Battle.allies, C, Battle.enemies, Battle.enemies[i])[0];
				}
			}
		}
		if (enemy.HP > 0) {
			//msg += "The *RED*" + enemy.NAME + "*GREY* has *RED*" + enemy.HP + "*GREY* HP remaining.\n"
		}
		msg += "*GREEN*" + C.NAME + "*GREY* has " + C.AP + " *GREEN*AP*GREY* left this turn.\n";
		msg += "\n";
	}
	if (enemy.HP <= 0) {
		if (hasWeaponRune(weapon, "death mark")) {
			msg += "*GREEN*A zombie rises to your side!\n";
			let newEnemy = summon(enemy.NAME, enemy.ROW, true, 0, true);
			newEnemy.HP = Math.floor(MaxHP(newEnemy)/2);
			Battle.allies.push(newEnemy);
		}
	}
	return msg;
}




