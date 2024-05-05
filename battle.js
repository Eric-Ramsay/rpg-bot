
function StartTurn(allies, enemies, deadAllies, deadEnemies) {
	let msg = "";
	for (let i = allies.length - 1; i >= 0; i--) {
		let C = allies[i];
		if (C.HP > 0) {
			let startHP = C.HP;
			let aName = Prettify(Name(C));
			let healing = 0;
			//Runic Effects
			if (hasRune(C, "cultivation") && C.HP < MaxHP(C)) {
				healing += 4;
			}
			if (hasRune(C, "sunset")) {
				for (let j = 0; j < enemies.length; j++) {
					msg += DealDamage(new T_Attack(2), allies, C, enemies, enemies[j])[0];
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
			if (hasEffect(C, "regenerative")) {
				healing += 5
			}
			if (hasEffect(C, "health potion")) {
				healing += 10
			}
			if (hasEffect(C, "restorative synergy")) {
				healing += numBuffs(C);
			}
			if (hasEffect(C, "poison")) {
				C.HP = Math.max(1, C.HP - 1);
			}
			if (hasEffect(C, "venom")) {
				C.HP = Math.max(1, C.HP - 5);
			}
			let embers = countEffect(C, "ember");
			let worms = countEffect(C, "infested");
			if (worms > 0 && C.TYPE == "player") {
				C.STAMINA = Math.max(C.STAMINA - worms * 3, 0);
				msg += "*GREEN*" + aName + "'s Stamina is drained by Anchorite Worms!\n";
			}
			C.HP -= (worms + embers);
			if (hasEffect(C, "bleed")) {
				C.HP -= 4;
			}
			if (hasEffect(C, "whipped")) {
				C.HP -= 4;
			}
			if (C.TYPE == "player") {
				C.CASTS = 0;
				C.ENDED = false;
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
				if (hasRune(C, "dextrous")) {
					C.AP += 4;
				}
			}
			//Print Results of starting the turn
			let HPDiff = Math.min(startHP, startHP - C.HP);
			if (HPDiff != 0) {
				C.REPORT.taken += HPDiff;
				msg += "*PINK*" + aName + " takes " + HPDiff + " damage from their active effects!\n";
			}
			if (C.HP > 0 && healing > 0) {
				msg += Heal(C, healing);
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
			else if (C.TYPE != "player" && C.HP > 0) {
				msg += "*GREY*" + enemyAttack(i, allies, enemies, deadAllies, deadEnemies) + "\n";
			}
		}
		if (C.HP <= 0) {
			msg += deathCry(C, allies, enemies);
			deadAllies.push(COPY(C));
			allies.splice(i, 1);
		}
	}
	return msg;
}

function StartBattle(battle) {
	let msg = "";
	let avgLevel = 0;
	let numPlayers = 0;
	for (let i = 0; i < battle.allies.length; i++) {
		numPlayers++;
		if (battle.allies[i].TYPE == "player") {
			AddEffect(battle.allies[i], "Coward's Haste", 1);
			avgLevel += battle.allies[i].LEVEL;
			battle.allies[i].STAMINA = MaxStamina(battle.allies[i]);
			if (battle.allies[i].CLASS == "noble") {
				let servant = summon("servant", battle.allies[i].ROW);
				servant.MaxHP = 30 + 10 * battle.allies[i].LEVEL;
				servant.HP = servant.MaxHP;
				battle.allies.push(servant);
			}
		}
	}
	avgLevel /= numPlayers;
	
	let rating = 40 * (battle.allies.length);
	rating = Math.pow(rating, 1 + (battle.allies.length/100));
	rating *= (1 + .1 * (battle.level - 1));
	rating *= Math.pow((1 + .25 * (avgLevel - 1)), 1.5);
	if (avgLevel > 3) {
		rating = Math.pow(rating, 1 + (avgLevel/100));
	}
	
	rating = Math.max(rating, 30 + 20 * battle.level - 1);
	
	ran = rand(6);
	if (ran == 0) {
		let locationNames = ["Haunted Crypts", "Acrid Swamp", "Wilted Woods", "Stony Island"];
		msg += "*CYAN*You've enraged the " + locationNames[battle.zone] + "!\n\n";
		rating *= 1.5;
	}
	
	console.log("Combat Difficulty: " + rating);
	let quests = data["town"].quests;
	let validTeams = [];
	for (const team of enemyLevels[battle.level - 1]) {
		if (validZone(team, battle.zone) && CalcDifficulty(team) <= rating) {
			validTeams.push(team);
		}
	}
	for (const quest of quests) {
		for (const enemy of enemies) {
			if (enemy.NAME.toLowerCase() == quest.enemy.toLowerCase()) {
				let team = [enemy];
				if (validZone(team, battle.zone) && CalcDifficulty(team) <= rating) {
					validTeams.push(team);
					validTeams.push(team);
				}
				break;
			}
		}
	}
	while (validTeams.length > 0 && rating > 0) {
		let method = rand(2);
		let min = 0;
		if (method == 0) {
			min = rand(validTeams.length);
		}
		let index = min + rand((validTeams.length - min));
		for (const enemy of validTeams[index]) {
			let temp = COPY(enemy);
			if (temp.NAME == "Swamp Stalker") {
				temp.ROW = 0;
			}
			else if (rand(8) == 0) {
				temp.ROW = 3;
			}
			battle.enemies.push(temp);
			msg += "*RED*The " + enemy.NAME + " approaches. . .*GREY*\n";
			rating -= enemy.DIFFICULTY;
		}
		var newTeams = [];
		for (let i = 0; i < validTeams.length; i++) {
			if (CalcDifficulty(validTeams[i]) <= rating) {
				newTeams.push(validTeams[i]);
			}
		}
		validTeams = newTeams;
	}
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
				if (ran < 20) {
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
	let goldReward = 0;
	let expReward = 0;
	for (const enemy of battle.deadEnemies) {
		let lootValue = 0;
		let mimicSpawned = false;
		if (!enemy.SUMMONED) {
			if (enemy.NAME == "Treasure Chest") {
				goldReward += 50;
			}
			else {
				goldReward += (1 + Math.ceil(enemy.DIFFICULTY/4));
			}
			expReward += enemy.DIFFICULTY;
			for (const drop of enemy.LOOT) {
				let ran = rand(100);
				if (lootValue < enemy.DIFFICULTY) {
					if (ran <= drop.chance) {
						let index = findItem(items, drop.name);
						if (index > -1) {
							battle.loot.push(COPY(items[index]));
							lootValue += items[index].value;
							if (!mimicSpawned && rand(16) == 0) {
								mimicSpawned = true;
								let mimics = [
									new Item("Stanima Potion", 	"mimic", 0, "A potion, but something seems off about it . . ."),
									new Item("Heolth Potion", 	"mimic", 0, "A potion, but something seems off about it . . ."),
									new Item("Armor", 			"mimic", 0, "It looks like metal, but it's pulsing . . ."),
									new Item("Weapon", 			"mimic", 0, "It kind of looks like a sword, maybe an axe. . .")
								]
								battle.loot.push(COPY(mimics[rand(mimics.length)]));
							}
						}
					}
				}
			}
		}
	}
	for (const player of battle.allies) {
		msg += "*GREEN*Each player gains " + goldReward + " gold and " + expReward + " experience!\n";
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
	}
	battle.enemies = [];
	battle.deadEnemies = [];
	battle.deadAllies = [];
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
			if (!testing) {
				msg += CheckQuest(battle.enemies[i], battle.allies);
			}
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
		let ran = rand(10);
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
		msg += StartTurn(battle.enemies, battle.allies, battle.deadEnemies, battle.deadAllies);
		msg += CheckEnemies(battle, testing);
	}
	if (battle.started && !battle.allyTurn && TurnCompleted(battle.enemies)) {
		battle.allyTurn = true;
		msg += "*GREEN*It is now the players' turn!\n\n";
		msg += StartTurn(battle.allies, battle.enemies, battle.deadAllies, battle.deadEnemies);
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
	let targetRow = enemy.ROW;
	let weapon = C.INVENTORY[weaponIndex];
	if (depth == 0) {
		weapon.attacks[0]--;
		C.AP -= (weapon.AP + APCost(C));
	}
	let dmg = weapon.min + rand(1 + ((weapon.max + C.STATS[WEP]) - weapon.min));
	if (hasWeaponRune(weapon, "powerful")) {
		dmg *= 1.2;
	}
	dmg = Math.floor(dmg * (1 + .05 * C.STATS[WEP]));
	if (hasEffect(C, "cascade")) {
		dmg += 2;
	}
	msg = "*GREEN*" + C.NAME + "*GREY*" + " attacks the *RED*" + enemy.NAME + "*GREY* with their " + weapon.name + ". ";	
	if (hasWeaponRune(weapon, "maladious")) {
		let debuffs = numDebuffs(enemy);
		if (debuffs > 0) {
			dmg += 1;
			dmg += debuffs;
		}
	}
	if (weapon.subclass == "axe") {
		if (rand(101) <= 15) {
			dmg *= 2;
			msg += "*GREEN*It's a wild blow!\n";
		}
	}
	if (C.CLASS == "ranger" && hasEffect(enemy, "hunter's mark")) {
		dmg *= 1.2;
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
	
	let result = DealDamage(new P_Attack(Math.round(dmg), weaponChance, weapon.pen), Battle.allies, C, Battle.enemies, enemy);
	msg += result[0];
	if (result[1] == -2) {
		if (hasWeaponRune(weapon, "pacifist")) {
			msg += "*CYAN*The Pacifist Rune takes effect!\n";
			for (let i = 0; i < Battle.enemies.length; i++) {
				msg += DealDamage(new T_Attack(2), Battle.allies, C, Battle.enemies, Battle.enemies[i])[0];
			}
		}
		if (depth == 0 && hasWeaponRune(weapon, "accurate")) {
			msg += "*CYAN*The Accurate Rune takes effect!\n";
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
		if (C.CLASS == "ranger") {
			msg += "*GREEN*You mark your target!\n";
			AddEffect(enemy, "Hunter's Mark", 1);
		}
		if (hasWeaponRune(weapon, "leeching", true)) {
			msg += "*GREEN*You gain 2 HP.\n";
			C.HP = Math.min(C.HP + 2, MaxHP(C));
		}
		if (weapon.name == "Vampire Fang") {
			msg += "*GREEN*You gain 2 HP.\n";
			C.HP = Math.min(C.HP + 2, MaxHP(C));
		}
		if (hasWeaponRune(weapon, "siphoning")) {
			msg += "*GREEN*You gain 4 Stamina.\n";
			C.STAMINA = Math.min(C.STAMINA + 4, MaxStamina(C));
		}
		if (enemy.HP > 0) {
			if (hasWeaponRune(weapon, "poisoned")) {
				msg += AddEffect(enemy, "Poison", 3);
			}
			if (hasWeaponRune(weapon, "envenomed")) {
				let chance = rand(101);
				if (chance <= 50) {
					msg += AddEffect(enemy, "Venom", 3);
				}
			}
			if (hasWeaponRune(weapon, "jagged")) {
				let chance = rand(101);
				if (chance <= 50) {
					msg += AddEffect(enemy, "Bleed", 3);
				}
			}
			if (weapon.subclass == "whip") {
				let chance = rand(101);
				if (chance <= 50) {
					msg += AddEffect(enemy, "Whipped", 3);
				}
			}
		}
		else if (hasWeaponRune(weapon, "death mark")) {
			msg += "*GREEN*A zombie rises to your side!\n";
			Battle.allies.push(summon("zombie", enemy.ROW));
		}
	}
	//---------------------------------------------
	
	if (weapon.subclass == "blunt") {
		for (let i = 0; i < Battle.enemies.length; i++) {
			if (i != enemyIndex && Battle.enemies[i].ROW == targetRow) {
				msg += DealDamage(new P_Attack(2), Battle.allies, C, Battle.enemies, Battle.enemies[i])[0];
			}
		}
	}
	if (enemy.HP > 0) {
		msg += "The *RED*" + enemy.NAME + "*GREY* has *RED*" + enemy.HP + "*GREY* HP remaining.\n"
	}
	msg += "*GREEN*" + C.NAME + "*GREY* has " + C.AP + " *GREEN*AP*GREY* left this turn.\n";
	msg += "\n";
	return msg;
}




