function testMonsters() {
	let wins = [];
	let numRounds = 2;
	console.log(enemies.length);
	let zoneNames = ["Crypts", "Swamp", "Forest", "Island"];
	let zones = [[], [], [], []];
	let difficulties = [0, 0, 0, 0];
	for (const enemy of enemies) {
		for (const zone of enemy.ZONES) {
			zones[zone].push(enemy);
			difficulties[zone] += enemy.DIFFICULTY;
		}
	}
	for (let i = 0; i < zones.length; i++) {
		console.log(zoneNames[i] + " - #: " + zones[i].length + " | Avg Difficulty: " + Math.floor(10 * difficulties[i]/zones[i].length)/10);
	}
	let total = 0;
	let i = 0;
	for (const team of teams) {
		let teamNames = [];
		for (const enemy of team) {
			teamNames.push(enemy.NAME);
		}
		wins.push({index: i, wins: 0, battles: 0, name: "", cost: 0, team: teamNames, turns: 0});
		i++;
	}
	for (let i = 0; i < wins.length; i++ ){
		let teamName = "";
		let teamCost = 0;
		for (let j = 0; j < wins[i].team.length; j++) {
			let color = "";
			let enemy = summon(wins[i].team[j]);
			switch (enemy.ZONES[0]) {
				case 0: color = "*RED*"; break;
				case 1: color = "*YELLOW*"; break;
				case 2: color = "*GREEN*"; break;
				case 3: color = "*CYAN*"; break;
				default: color = "*GREY*"; break;
			}
			teamName += color + wins[i].team[j] + "*GREY*";
			if (j < wins[i].team.length - 1) {
				teamName += ", ";
			}
			teamCost += enemy.DIFFICULTY;
		}
		wins[i].name = teamName;
		wins[i].cost = teamCost;
	}
	for (let i = 0; i < wins.length; i++) {
		if (i > 0) {
			//clearLastLine();
		}
		//console.log(i + "/" + wins.length);
		console.log("Testing " + removeColors(wins[i].name) + " . . .");
		for (let j = i + 1; j < wins.length; j++) {
			console.log("    vs. " + removeColors(wins[j].name));
			let winsOne = 0;
			let winsTwo = 0;
			let enemyOne = "Flaming Wisp";
			let enemyTwo = "Toxic Mushroom";
			let hasDebugged = false;
			//console.log(wins[i].name + " vs " + wins[j].name);
			for (let k = 0; k < numRounds; k++) {
				let debug = false;
				if (!hasDebugged) {
					if (wins[i].name.includes(enemyOne) || wins[j].name.includes(enemyOne)) {
						if (wins[i].name.includes(enemyTwo) || wins[j].name.includes(enemyTwo)) {
							//console.log("Made it");
							//debug = true;
							//hasDebugged = true;
						}
					}
				}
				
				let results = runBattle(wins[i].team, wins[j].team, k);
				wins[i].battles++;
				wins[i].wins += results[0];
				wins[j].wins += results[1];
				wins[j].battles++;
				wins[i].turns += results[2];
				wins[j].turns += results[2];
				winsOne += results[0];
				winsTwo += results[1];
			}
			if (wins[i].name.includes(enemyOne)) {
				//console.log(wins[i].name + " won " + winsOne + "/"+numRounds+" vs. " + wins[j].name);
			}
			if (wins[j].name.includes(enemyOne)) {
				//console.log(wins[j].name + " won " + winsTwo + "/"+numRounds+" vs. " + wins[i].name);
			}
		}
	}
	let sorted = [];
	while (wins.length > 0) {
		let max = 0;
		for (let i = 1; i < wins.length; i++) {
			if (wins[i].wins > wins[max].wins) {
				max = i;
			}
		}
		sorted.push(wins[max]);
		wins.splice(max, 1);
	}
	let msg = "";
	let max = sorted[0].wins;
	let value = 0;
	for (let i = 0; i < sorted.length; i++) {
		value += Math.floor(100 * sorted[i].wins/sorted[i].cost)/100;
		let num = ("*PINK*" + (i+1)).padStart(2, '0') + "*GREY*)";
		let indivScore = Math.floor(Math.floor(150 * sorted[i].wins/max));
		let percent = Math.floor(1000 * sorted[i].wins/sorted[i].battles)/10;
		let strOne = StackStrings("*GREY*"+num, "*GREEN*"+sorted[i].cost, 5, false);
		let strTwo = StackStrings(strOne, "*CYAN*" + sorted[i].turns+"*GREY*", 10, false);
		let strThree = StackStrings(strTwo, "*YELLOW*" + percent+"*GREY*%", 18, false);
		msg += StackStrings(strThree, "*RED*"+sorted[i].name, 30)+"*GREY*" + "\n";
	}
	value /= sorted.length
	console.log(parseText(msg, false));
	console.log("Avg Score: " + Math.floor(100 * value)/100);
}

function runBattle(teamOne, teamTwo, index, channel = null) {
	let results = [0, 0, 0];
	let battle = new Battle("blah");
	for (const enemy of teamOne) {
		let en = summon(enemy, 4);
		en.ROW = 4;
		if (en.NAME == "Swamp Stalker") {
			en.ROW = 1;
		}
		if (en.NAME == "Ephemeral Warrior") {
			AddEffect(en, "fading", 8);
		}
		battle.allies.push(en);
	}
	for (const enemy of teamTwo) {
		let en = summon(enemy, 4);
		en.ROW = 1;
		if (en.NAME == "Swamp Stalker") {
			en.ROW = 4;
		}
		if (en.NAME == "Ephemeral Warrior") {
			AddEffect(en, "fading", 8);
		}
		battle.enemies.push(en);
	}
	let turns = 0;
	battle.started = true;
	if (index % 2 == 0) {
		battle.allyTurn = false;
	}
	let msg = "";
	while (battle.started && turns++ < 10000 && (battle.allies.length + battle.enemies.length < 100)) {
		msg += HandleCombat(battle, false, true) + "\n";
		if (channel && battle.started && (battle.allies.length + battle.enemies.length < 100)) {
			msg += DrawCombat(battle) + "\n";
		}
	}
	if (battle.allies.length > 0) {
		results[0] = 1;
	}
	if (battle.enemies.length > 0) {
		results[1] = 1;
	}
	if (results[0] + results[1] == 2) {
		let allyHP = 0;
		let enemyHP = 0;
		for (const ally of battle.allies) {
			allyHP += ally.HP;
		}
		for (const enemy of battle.enemies) {
			enemyHP += enemy.HP;
		}
		if (allyHP > enemyHP) {
			results[1] = 0;
		}
		else {
			results[0] = 0;
		}
	}
	results[2] = turns;
	if (channel) {
		PrintMessage(parseText(msg), channel);
	}
	return results;
}

function testSpells() {
	//Make a Test Player with very high stats and spells
	let C = new Character();
	let battle = new Battle();
	battle.started = true;
	C.CLASS = "mage";
	C.NAME = "test ape";
	for (let i = 0; i < C.STATS.length; i++) {
		C.STATS[i] = 1000;
	}
	
	for (let i = 0; i < enemies.length; i++) {
		battle.enemies.push(summon(enemies[i].NAME, rand(5)));
		battle.enemies.push(summon(enemies[i].NAME, rand(5), false));
		battle.allies.push(summon(enemies[i].NAME, rand(5)));
		battle.allies.push(summon(enemies[i].NAME, rand(5), false));
	}
	
	//Cast every spell, catching any errors
	let targets = [];
	let count = 0;
	for (const spell of spells) {
		C.HP = 99999999999999999;
		C.AP = 99999999999999999;
		C.STAMINA = 99999999999999999;
		if (count > 1) {
			clearLastLine();
		}
		console.log(++count + "/" + spells.length);
		let len = 1;
		if (spell.numEnemies > 0) {
			len = battle.enemies.length;
		}
		if (spell.numAllies > 0) {
			len = battle.allies.length;
		}
		if (spell.numRows > 0) {
			len = 5;
		}
		for (let i = 0; i < len; i++) {
			targets = [i];
			try {
				let msg = Cast(C, spell, battle.allies, battle.enemies, targets);
			}
			catch (error) {
				console.log("Error in spell '" + spell.name + "'!");
				console.log(error);
			}
		}
	}
	
	//End the turn & process the battle
	HandleCombat(battle);
}