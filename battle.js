
function StartTurn(battle, allies, enemies, deadAllies, deadEnemies, symbol = "E") {
	let msg = "";
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
			if (hasRune(C, "jade")) {
				AddEffect(C, "jade", 999);
			}
			if (hasRune(C, "static")) {
				for (let i = 0; i < 3; i++) {
					AddEffect(C, "static", 999);
				}
			}
			let invincible = hasEffect(C, "invincible");
			let shock = hasEffect(C, "static");
			if (shock) {
				msg += tag + "*CYAN*Static takes effect!\n";
				msg += DealDamage(new M_Attack(shock.stacks), allies, C, enemies, enemies[rand(enemies.length)])[0];
			}
			
			//Runic Effects
			if (hasRune(C, "cultivation") && C.HP < MaxHP(C)) {
				healing += 4;
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
					numPoisions += countEffect(enemies[i], "poison");
				}
				healing += Math.floor(numPoisons/3);
			}
			if (!invincible) {
				let poison = countEffect(C, "poison");
				C.HP = Math.max(1, C.HP - poison);
				if (hasEffect(C, "venom")) {
					C.HP = Math.max(1, C.HP - 5);
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
					C.HP -= 4;
				}
				if (hasEffect(C, "whipped")) {
					C.HP -= 4;
				}
			}
			if (C.TYPE == "player") {
				C.FLED = false;	
				C.CASTS = 0;
				C.ENDED = false;
				C.BRACING = false;
				for (let j = 0; j < C.INVENTORY.length; j++) {
					if (C.INVENTORY[j].type == "weapon") {
						C.INVENTORY[j].attacks[0] = C.INVENTORY[j].attacks[1];
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
			if (HPDiff != 0) {
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
			
			if (hasRune(C, "forthwith")) {
				AddEffect(C, "Forthwith", 0);
			}
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
					let text = enemyAttack(i, allies, enemies, deadAllies, deadEnemies);
					if (text != "") {
						if (C.TYPE == "boss" && i < allies.length - 1) {
							msg += "\n";
						}
						msg += tag + text + "\n";
					}
				}
			}
		}
		if (C.HP <= 0) {
			msg += Deliver(C);
			if (C.HP <= 0 && C.TYPE != "player") {
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
			if (battle.allies[i].CLASS == "noble") {
				let servant = summon("servant", battle.allies[i].ROW);
				if (battle.allies[i].SERVANT) {
					servant.NAME = battle.allies[i].SERVANT;
				}
				servant.MaxHP = 30 + 10 * battle.allies[i].LEVEL;
				servant.HP = servant.MaxHP;
				battle.allies.push(servant);
			}
		}
	}
	
	if (battle.level == 4) {
		msg += FinalBoss(battle);
	}
	else {
		lvl /= num;
		let rating = 45 * num * Math.pow(1.3, lvl);
		
		ran = rand(6);
		if (ran == 0) {
			let locationNames = ["Haunted Crypts", "Acrid Swamp", "Wilted Woods", "Stony Island"];
			msg += "*CYAN*You've enraged the " + locationNames[battle.zone] + "!\n\n";
			rating *= 1.5;
		}
		
		console.log("Combat Difficulty: " + rating);
		let quests = data["town"].quests;
		let validEnemies = [];
		let minRating = 0;
		if (rating > 300) {
			minRating = 50;
		}
		if (rating > 400) {
			minRating = 70;
		}
		for (const enemy of enemies) {
			if (validZone(enemy, battle.zone) && enemy.DIFFICULTY >= minRating && enemy.DIFFICULTY <= rating) {
				validEnemies.push(enemy);
			}
		}
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
		}
		if (rating > 200 && rand(100) <= 10) {
			if (battle.zone == 0 || battle.zone == 2) {
				validEnemies = [];
				for (const enemy of enemies) {
					if (enemy.NAME.toLowerCase().includes("hiveling") && enemy.DIFFICULTY <= rating) {
						if (enemy.NAME != "Hiveling Larva") {
							validEnemies.push(enemy);
						}
						if (enemy.NAME == "Hiveling Warrior") {
							let temp = COPY(enemy);
							temp.ID = temp.NAME + rating + rand(99999999999); 
							rating -= temp.DIFFICULTY;
							msg += "*RED*The " + temp.NAME + " approaches. . .*GREY*\n";
							battle.enemies.push(temp);
						}
					}
				}
			}
		}
		while (validEnemies.length > 0 && rating > 0) {
			let index = rand((validEnemies.length));
			let temp = COPY(validEnemies[index]);
			if (temp.NAME == "Ephemeral Warrior") {
				AddEffect(temp, "fading", 8);
			}
			if (temp.NAME == "Swamp Stalker") {
				temp.ROW = 0;
			}
			else if (rand(8) == 0) {
				temp.ROW = 3;
			}
			temp.ID = temp.NAME + rating + rand(99999999999); 
			battle.enemies.push(temp);
			msg += "*RED*The " + temp.NAME + " approaches. . .*GREY*\n";
			rating -= temp.DIFFICULTY;
			var newTeams = [];
			for (const enemy of validEnemies) {
				if (enemy.DIFFICULTY <= rating) {
					newTeams.push(enemy);
				}
			}
			validEnemies = newTeams;
		}
		for (let i = 0; i < battle.enemies.length; i++) {
			if (battle.enemies[i].NAME == "Hiveling Guard") {
				let tag = "*YELLOW*E" + (i + 1) + "*GREY* - ";
				let text = enemyAttack(i, battle.enemies, battle.allies, battle.deadEnemies, battle.deadAllies);
				if (text != "") {
					msg += tag + text + "\n";
				}
			}
		}
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

function WinBattle(battle) {
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
				data["town"].statues.push(report);
				C.RETIRED = true;
				data["town"].retired.push(C);
			}
		}
		battle.allies = [];
		SaveState();
		return "*CYAN*A statue is commissioned of you for your deeds, and you enter a permanent retirement in the hall of heroes!\n";
	}
	let msg = "";
	battle.started = false;
	msg += "*GREEN*The enemies are all slain!*GREY*\n";
	//HANDLE LOOT
	for (let a = battle.allies.length - 1; a >= 0; a--) {
		if (battle.allies[a].SUMMONED) {
			battle.allies.splice(a, 1);
		}
		else if (battle.allies[a].HP <= 0) {
			let INVENTORY = battle.allies[a].INVENTORY;
			for (let i = 0; i < INVENTORY.length; i++) {
				INVENTORY[i].equipped = false;
				let ran = rand(100);
				if (ran < 30) {
					battle.loot.push(INVENTORY[i]);
				}
			}
			battle.allies.splice(a, 1);
		}
	}
	for (const ally of battle.deadAllies) {
		if (ally.TYPE == "player") {
			let INVENTORY = ally.INVENTORY;
			for (let i = 0; i < INVENTORY.length; i++) {
				INVENTORY[i].equipped = false;
				let ran = rand(100);
				if (ran < 20) {
					battle.loot.push(INVENTORY[i]);
				}
			}
		}
	}
	let goldReward = 10;
	let expReward = 0;
	let numMimics = 0;
	for (const enemy of battle.deadEnemies) {
		msg += CheckQuest(enemy, battle.allies);
		let lootValue = 0;
		let mimicSpawned = false;
		if (!enemy.SUMMONED) {
			if (enemy.NAME == "Brigand") {
				goldReward += 15;
			}
			if (enemy.NAME == "Brigand Lord") {
				goldReward += 30;
			}
			if (enemy.NAME == "Treasure Chest") {
				goldReward += 40;
			}
			else {
				goldReward += (1 + Math.ceil(enemy.DIFFICULTY/10));
			}
			goldReward = Math.min(200, goldReward);
			expReward += enemy.DIFFICULTY;
			for (const drop of enemy.LOOT) {
				let ran = rand(100);
				if (lootValue <= enemy.DIFFICULTY/4) {
					if (ran <= drop.chance) {
						let index = findItem(items, drop.name);
						if (index > -1) {
							battle.loot.push(COPY(items[index]));
							lootValue += items[index].value;
						}
					}
				}
			}
		}
		if (rand(8) == 0 && (numMimics < battle.loot.length/4)) {
			numMimics++;
			let mimics = [
				new Item("Stanima Potion", 	"mimic", 0, "A potion, but something seems off about it . . ."),
				new Item("Heolth Potion", 	"mimic", 0, "A potion, but something seems off about it . . ."),
				new Item("Armor", 			"mimic", 0, "It looks like metal, but it's pulsing . . ."),
				new Item("Weapon", 			"mimic", 0, "It kind of looks like a sword, maybe an axe. . ."),
				new Item("Gold", 			"mimic", 0, "An amoprhous pile resembling coins.")
			]
			battle.loot.push(COPY(mimics[rand(mimics.length)]));
		}
	}
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
		msg += StartTurn(battle, battle.enemies, battle.allies, battle.deadEnemies, battle.deadAllies, "E");
		msg += CheckEnemies(battle, testing);
	}
	if (battle.started && !battle.allyTurn && TurnCompleted(battle.enemies)) {
		battle.allyTurn = true;
		msg += "*GREEN*It is now the players' turn!\n\n";
		msg += StartTurn(battle, battle.allies, battle.enemies, battle.deadAllies, battle.deadEnemies, "P");
		msg += CheckEnemies(battle, testing);
	}
	
	if (purgeBattle) {
		PurgeBattles();
	}
	return msg;
}


function AllyAttack(Battle, C, enemyIndex, weaponIndex, depth = 0) {
	let msg = "";
	let enemy = Battle.enemies[enemyIndex];
	let enemyHP = enemy.HP;
	let eName = enemy.NAME;
	let targetRow = enemy.ROW;
	let weapon = C.INVENTORY[weaponIndex];
	if (depth == 0) {
		weapon.attacks[0]--;
		C.AP -= weapon.AP;
	}
	RemoveEffect(C, "Coward's Haste");
	let dmg = weapon.min + rand(1 + ((weapon.max + C.STATS[WEP]) - weapon.min));
	if (hasWeaponRune(weapon, "decisive")) {
		if (weapon.attacks[0] == weapon.attacks[1] - 1) {
			dmg *= 1.25;
		}
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
	let weaponChance = weapon.chance;
	if (weaponChance > hitPercent(C, hand)) {
		weaponChance *= 1.25;
		console.log("RNG is being boosted because RNG of " + Math.floor(100 * hitPercent(C, hand))/100 + "% is lower than expected value of " + weapon.chance + "%");
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
	let result = DealDamage(new P_Attack(Math.round(dmg), weaponChance, weapon.pen), Battle.allies, C, Battle.enemies, enemy);
	msg += result[0];
	if (result[1] == -2) {
		if (depth == 0 && hasWeaponRune(weapon, "reprise")) {
			msg += "*CYAN*Reprise takes effect\n";
			msg += AllyAttack(Battle, C, enemyIndex, weaponIndex, 1);
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
		if (hasWeaponRune(weapon, "peel")) {
			msg += "You peel away the armor of the " + enemy.NAME + "!\n"
			enemy.ARMOR[0]--;
		}
		if (enemy.HP > 0) {
			if (hasWeaponRune(weapon, "affliction")) {
				let effects = ["poison", "venom", "bleed"];
				msg += AddEffect(enemy, effects[rand(3)], 3, C);
			}
			if (weapon.subclass == "whip") {
				let chance = rand(101);
				if (chance <= 50) {
					msg += AddEffect(enemy, "Whipped", 3, C);
				}
			}
		}
		else if (hasWeaponRune(weapon, "death mark")) {
			msg += "*GREEN*A zombie rises to your side!\n";
			Battle.allies.push(summon("zombie", enemy.ROW));
		}
	}
	
	let bossKill = (enemy.TYPE == "boss" && eName != enemy.NAME);
	if (!bossKill) {
		let sweepDmg = 0;
		if (weapon.subclass == "blunt") {
			sweepDmg += 2;
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
				if (i != enemyIndex && Battle.enemies[i].ROW == targetRow) {
					msg += DealDamage(new P_Attack(sweepDmg), Battle.allies, C, Battle.enemies, Battle.enemies[i])[0];
				}
			}
		}
		if (enemy.HP > 0) {
			msg += "The *RED*" + enemy.NAME + "*GREY* has *RED*" + enemy.HP + "*GREY* HP remaining.\n"
		}
		msg += "*GREEN*" + C.NAME + "*GREY* has " + C.AP + " *GREEN*AP*GREY* left this turn.\n";
		msg += "\n";
	}
	return msg;
}




