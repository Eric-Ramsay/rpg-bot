//RPG GAME
const Discord = require('Discord.js');
const client = new Discord.Client();
const fs = require('fs');

eval(fs.readFileSync('models.js') + '');
eval(fs.readFileSync('init.js') + '');
eval(fs.readFileSync('helpers.js') + '');
eval(fs.readFileSync('commands.js') + '');
eval(fs.readFileSync('AI.js') + '');
eval(fs.readFileSync('battle.js') + '');
eval(fs.readFileSync('login.js') + '');

var data = require('./data.json');

const LEFT = 0;
const RIGHT = 1;

const VIT = 0;
const MAG = 1;
const END = 2;
const WEP = 3;
const DEX = 4;
const AVD = 5;

const PHYSICAL = 0;
const MAGICAL = 1;

var classes = ["peasant", "rogue", "noble", "mage", "warrior", "ranger"];
var stats = ["VIT", "MAG", "END", "WEP", "DEX", "AVD"];

var locations = [];
var battles = [];
var people = [];
var buildings = [];
var weapons = [];
var armor = [];
var spells = [];
var items = [];
var runes = [];
var weaponEffects = [];
var statuses = [];
var enemies = [];
var enemyLevels = [[], [], []];
var teams = [];

function COPY(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function SaveState() {
	//console.log("Saving");
	//console.log(JSON.stringify(data));
	fs.writeFile("./data.json", JSON.stringify(data), (err) => {
		if (err) {
			console.log(err)
		}
	});
}

function an(word) {
	switch (word[0].toLowerCase()) {
		case "a": case "e": case "i": case "o": case "u": return "an";
		default: return "a"
	}
}

function isEquipped(C, item) {
	for (let i = 0; i < C.INVENTORY.length; i++) {
		if (C.INVENTORY[i].equipped && C.INVENTORY[i].name.toLowerCase() == item.toLowerCase()) {
			return true;
		}
	}
	return false;
}
function Mitigate(target, dmg, pen = 0, type = 0) {
	if (target.TYPE == "player") {
		let dodgeChance = 10 * target.STATS[AVD];
		if (type == MAGICAL) {
			dodgeChance = 0;
		}
		if (hasRune(target, "reflex")) {
			dodgeChance += 20;
		}	
		dodgeChance = Math.min(95, dodgeChance);
		let ran = rand(100);
		if (ran < dodgeChance) {
			return 0;
		}
		if (isEquipped(target, "shield")) {
			ran = rand(100);
			if (ran <= 30) {
				return -1;
			}
		}
		if (isEquipped(target, "buckler")) {
			if (ran <= 20) {
				return -1;
			}
		}
		if (isEquipped(target, "spiked shield")) {
			if (ran <= 15) {
				return -1;
			}
		}
	}
	else if (type == 0 && (target.NAME == "Brigand Lord" || target.NAME == "Brigand")) {
		let ran = rand(100);
		if (ran < 50) {
			return 0;
		}
	}
	let armor = target.ARMOR[type];
	let damage = Math.max(Math.floor(dmg * pen/100), Math.round(dmg - armor));
	if (damage < 1) {
		return 1;
	}
	return damage;
}

function DealDamage(attack, attackers, attacker, targets, target) {
	let msg = "";
	if (target.HP <= 0) {
		target.HP = 0;
		return [msg, -2];
	}
	let damage = attack.damage;
	let isPlayer = (target.TYPE == "player");
	let aName = Name(attacker);
	let tName = Name(target);
	
	if (hasRune(attacker, "cascade")) {
		damage++;
	}
	
	//Redirect all Magical Damage to the Warded Totem
	if (attack.type == MAGICAL && target.NAME != "Warded Totem") {
		for (let i = 0; i < targets.length; i++) {
			if (targets[i].NAME == "Warded Totem") {
				return DealDamage(attack, attackers, attacker, targets, targets[i]);
			}
		}
	}
	
	if (attack.type == PHYSICAL) {
		if (hasEffect(attacker, "stronger")) {
			damage += 3;
		}
		if (hasEffect(attacker, "destructive synergy")) {
			for (let i = 0; i < attacker.EFFECTS.length; i++) {
				if (attacker.EFFECTS[i].type == "buff") {
					damage++;
				}
			}
		}
	}
	damage = Mitigate(target, damage, attack.pen, attack.type);

	let chance = rand(100);
	if (chance > attack.hitChance) {
		damage = -2;
		msg += "*RED*" + aName + " misses!\n";
	}
	
	if (hasEffect(attacker, "blinded")) {
		let chance = rand(101);
		if (chance < 50) {
			damage = -2;
			msg = "*RED*" + aName + " is blinded and misses!\n";
		}
	}
	
	if (damage > 0) {
		if (hasRune(target, "jade")) {
			damage--;
			if (damage > 10) {
				damage = 10;
			}
		}
		if (damage > 10 && hasRune(target, "jade")) {
			msg = "*GREEN*The damage to " + tName + " is reduced from " + damage + " to 10.\n";
			damage = 10;
		}
		target.HP -= damage;
		if (target.HP > 0 && target.NAME == "Ephemeral Warrior") {
			msg += "*RED*The Ephemeral Warrior grows stronger!\n";
			target.HP += damage * 2;
			if (target.HP > MaxHP(target)) {
				target.MaxHP = target.HP;
			}
		}
		//Evaluate Attacker's Staff Runes
		if (attack.type == 1) {
			if (hasRune(attacker, "cinnabar")) {
				target.ARMOR[1]--;
				if (target.ARMOR[1] < 0) {
					target.ARMOR[1] = 0;
				}
			}
			if (hasRune(attacker, "tar")) {
				AddOrRefreshEffect(target, new Effect("Slowed", "Movement costs are increased.", 1));
			}
			if (hasEffect(attacker, "forthwith")) {
				for (let i = attacker.EFFECTS.length - 1; i >= 0; i--) {
					if (attacker.EFFECTS[i].name.toLowerCase() == "forthwith") {
						endEffect(attackers, i);
					}
				}
			}
		}
		if (damage >= 5 && hasRune(target, "honeycomb")) {
			targets.push(summon("swarm of bees", target.ROW));
			msg += "*GREEN*Bees emerge from out of the honeycomb!\n";
		}
		if (hasRune(target, "amber")) {
			target.STAMINA += 6;
			target.HP = Math.min(target.HP + 2, MaxHP(target));
			msg = "*GREEN*" + tName + " gains 6 Stamina.\n";
		}
	}
	if (target.HP <= 0) {
		if (hasRune(attacker, "pearl")) {
			attacker.STAMINA = Math.min(MaxStamina(attacker), attacker.STAMINA + 15);
		}
		if (!isPlayer) {
			if (target.NAME == "Crazed Wolf") {
				msg += "The *RED*Crazed Wolf*GREY* whimpers and dies.";
			}
			if (target.NAME == "Swamp Ape") {
				msg += "The light fades from the *RED*Swamp Ape's*GREY* eyes.";
			}
			if (target.NAME == "Wild Bear") {
				msg += "The *RED*Wild Bear*GREY* falls dead to the ground.";
			}
			if (target.NAME == "Toxic Mushroom") {
				msg += "The *RED*Toxic Mushroom*Grey* bursts into a cloud of *RED*Living Spores*GREY*!";
				let num = 2 + rand(4);
				for (let i = 0; i < num; i++) {
					targets.push(summon("Living Spore", target.ROW));
				}
			}
			if (target.NAME == "Lost Mariner") {
				let ran = rand(3);
				if (ran == 0) {
					msg += "*GREEN*The Parasitic Barnacles fall away from the old mariner, and his sanity returns!\n";
					attackers.push(summon("Mariner", target.ROW));
				}
			}
			if (target.NAME == "Squelcher") {
				msg += "The *RED*Squelcher*GREY* lets out a pained snort as it dies.\n";
			}
			if (target.NAME == "Scoundrel") {
				msg += "The *RED*Scoundrel*GREY* cries out for mercy before it dies.\n";
			}
			if (target.NAME == "Deep Horror") {
				msg += "The *RED*Deep Horror*GREY* bursts into a blob of ruptured flesh as its pressure field collapses!\n";
			}
			if (target.NAME == "Slimelord") {
				msg += "The *RED*Slimelord*GREY* splits into several *RED*Living Slimes*GREY*!";
				let num = 3 + rand(4);
				for (let i = 0; i < num; i++) {
					let slime = summon("Living Slime", target.ROW);
					slime.ROW = target.ROW;
					targets.push(slime);
				}
			}
			if (target.NAME == "Egg Sac") {
				msg += "The *RED*Egg Sac *GREY*bursts open, and *RED*Baby Spiders*GREY* swarm out of it!";
				let num = 2 + rand(2);
				for (let i = 0; i < num; i++) {
					let slime = summon("Baby Spider", target.ROW);
					slime.ROW = target.ROW;
					targets.push(slime);
				}
			}
			if (target.NAME == "Fae Trickster") {
				let ran = 1 + rand(10);
				if (ran < 9) {
					target.HP = target.MaxHP;
					target.ROW = rand(5);
					msg += "The *RED*Fae Trickster*GREY* vanishes and re-appears!\n";
				}
				else {
					msg += "The *RED*Fae Trickster*GREY* dissipates into smoke. . .\n";
				}
			}
			else {
				msg += "*GREY*The *RED*" + target.NAME + "*GREY* has been slain!\n";
			}
			let crabbed = false;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].NAME == "Carcinos") {
					msg += "*RED*Carcinos transforms " + tName + " into a crab!\n";
					let ran = rand(4);
					let enemy = summon("Reef Crab", target.ROW);
					if (ran == 0) {
						enemy = summon("Stone Crab", target.ROW)
					}
					enemy.MaxHP = Math.min(enemy.MaxHP, target.MaxHP);
					enemy.HP = enemy.MaxHP;
					targets.push(enemy);
					crabbed = true;
					break;
				}
			}
			if (!crabbed) {
				for (let i = 0; i < attackers.length; i++) {
					if (attackers[i].NAME == "Carcinos") {
						msg += "*RED*Carcinos transforms " + tName + " into a crab!\n";
						let ran = rand(4);
						let enemy = summon("Reef Crab", target.ROW);
						if (ran == 0) {
							enemy = summon("Stone Crab", target.ROW)
						}
						enemy.MaxHP = Math.min(enemy.MaxHP, target.MaxHP);
						enemy.HP = enemy.MaxHP;
						attackers.push(enemy);
						break;
					}
				}
			}
			if (target.ZONES.indexOf(3) > 0) {
				let numWorms = 0;
				let ran = rand(6);
				if (ran == 0) {
					numWorms = 2 + rand(4);	
				}
				for (const effect of target.EFFECTS) {
					if (effect.name.toLowerCase() == "infested") {
						numWorms++;
					}
				}
				if (numWorms > 0) {
					msg += "*RED*Anchorite Worms*GREY* flee their dying host!\n";
					for (let i = 0; i < numWorms; i++) {
						targets.push(summon("Anchorite Worm", target.ROW));
					}
				}
			}
		}
		else {
			msg += "*RED*" + tName + " has been struck down. . .";
			if (hasRune(target, "revenge")) {
				attacker.HP = 0;
				msg += "*RED*" + aName + " is killed in Revenge!\n";
			}
		}
		msg += "\n";
	}
	else if (damage > 0) {
		msg += "*RED*" + tName + " takes " + damage + " damage!\n";
		let rDamage = -10;
		if (hasRune(target, "reflect")) {
			rDamage = Mitigate(attacker, 5, 0, 1);
		}
		if (target.NAME == "Briar Beast" || hasEffect(target, "minor reflect")) {
			rDamage = Mitigate(attacker, 3, 0, 1);
		}
		if (target.NAME == "Briar Monster" || hasEffect(target, "greater reflect")) {
			rDamage = Math.max(Mitigate(attacker, 5, 0, 1), Mitigate(attacker, Math.floor(damage/2), 0, 1));
		}
		if (target.NAME == "Fumous Fiend") {
			if (Math.abs(attacker.ROW - target.ROW) < 2) {
				msg += "*RED*Toxic fumes rush out of " + tName + "'s wound!\n";
				AddOrRefreshEffect(attacker, new Effect("Poison", "Take 1 dmg per turn.", 10));
			}
		}
		if (rDamage > -10) {
			msg += "*RED*" + tName + " reflects " + rDamage + " damage!\n";	
			attacker.HP -= rDamage;
			if (hasRune(attacker, "amber")) {
				attacker.HP = Math.min(MaxHP(attacker), attacker.HP + 2);
				attacker.STAMINA = Math.min(MaxStamina(attacker), attacker.STAMINA + 6);
			}
		}
		if (attacker.HP <= 0) {
			attacker.HP = 0;
			msg += "*RED*" + aName + " has wrought their own destruction!\n";
		}
	}
	else if (damage == 0) {
		if (target.CLASS == "rogue") {
			msg += DealDamage(new P_Attack(6), targets, target, attackers, attacker)[0];
		}
		if (hasRune(target, "amethyst")) {
			msg += DealDamage(new M_Attack(8), targets, target, attackers, attacker)[0];
		}
		msg += "*RED*" + tName + " dodges the damage!\n";		
	}
	else if (damage == -1) {
		msg += "*RED*" + tName + " blocks the damage!\n";	
	}
	return [msg, damage];
}

function PushTarget(C, target) {
	let msg = "";
	if (C.ROW >= target.ROW && target.ROW > 0) {
		msg += "*GREEN*The " + target.NAME + " is pushed back!\n";
		target.ROW--;
	}
	else if (C.ROW < target.ROW && target.ROW < 4) {
		msg += "*GREEN*The " + target.NAME + " is pushed back!\n";
		target.ROW++;
	}
	return msg;
}

function Cast(battle, C, spellName, target) {
	if (!battle.started) {
		return "*RED*The battle must be started before you can cast spells!\n";
	}
	let targets = battle.enemies;
	let allies = battle.allies;
	let msg = "";
	let spellIndex = findSpell(C.SPELLS, spellName);
	let spell = C.SPELLS[spellIndex];
	spellName = spell.name.toLowerCase();
	let bonusDmg = 0;
	let refundChance = 0;
	if (target == "self") {
		for (let i = 0; i < battle.allies.length; i++) {
			if (battle.allies[i].ID == C.ID) {
				target = "p" + (i+1);
			}
		}
	}
	let staffEquipped = false;
	for (const item of C.INVENTORY) {
		if (item.type == "staff" && item.equipped) {
			staffEquipped = true;
		}
	}
	if (isEquipped(C, "staff")) {
		bonusDmg++;
	}
	if (isEquipped(C, "scepter")) {
		bonusDmg++;
		refundChance += 10;
	}
	if (!staffEquipped) {
		return "*RED*You need to equip a Wand, Staff, or Scepter to cast spells!";
	}
	if (spellIndex == -1) {
		return "*RED*You don't know that spell!\n";
	}
	if (spell.AP > C.AP + APCost(C)) {
		return "*RED*You don't have enough AP to cast this spell!\n";
	}
	if (spell.HP >= C.HP) {
		return "*RED*You don't have enough HP to cast this spell!\n";
	}
	if (spell.gold > C.GOLD) {
		return "*RED*You don't have enough Gold to cast this spell!\n";
	}
	
	if (hasEffect(C, "ferocity")) {
		bonusDmg += 2;
	}
	if (hasRune(C, "ivory")) {
		refundChance += 10;
	}
	if (hasRune(C, "charcoal")) {
		bonusDmg++;
	}
	
	if (spell.school == "self-taught") {
		if (spellName == "arcane strike") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			let dmg = 6 + bonusDmg;
			msg += "*PINK*A pin of radiant light strikes your foe.\n"
			//attack, attackers, attacker, targets, target
			msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
		}
	}
	if (spell.school == "elemental") {
		if (spellName == "wall of fire") {
			if (target[0] == "r") {
				let row = (parseInt(target[1]) - 1);
				msg = "*YELLOW*A wall of shimmering flame ignites before you!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == row && targets[i].HP > 0) {
						//Deal Damage
						let dmg = 4 + rand(3) + bonusDmg;
						msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
					}
				}
			}
			else {
				return "*RED*Invalid row targetted!\n";
			}
		}
		else if (spellName == "stoneskin") {
			AddOrRefreshEffect(C, new Effect("Stoneskin", "+8 Physical Armor. +4 Magical Armor", 3, "buff"));
			C.ARMOR[0] += 8;
			C.ARMOR[1] += 4;
		}
		else if (spellName == "chain lightning") {
			//Deal 2-6 damage per target to 3 targets
			let args = target.split(",");
			if (args.length != 3) {
				return "*RED*You must select 3 targets.\n";
			}
			let indices = [];
			for (let i = 0; i < 3; i++) {
				if (args[i][0] == " ") {
					args[i] = args[i].substring(1);
				}
				if (args[i][targets.length - 1] == " ") {
					args[i] = args[i].substring(0, args[i].length - 1);
				}
				let eval = findTarget(targets, args[i], C.ROW);
				if (eval == -1) {
					return "*RED*Can't find target '" + args[i] + "'\n";
				}
				indices.push(eval);
			}
			msg += "*BLUE*Lightning arcs out from your outstretched hand to your foes!\n";
			for (let i = 0; i < 3; i++) {
				if (targets[indices[i]].HP > 0) {
					let dmg = 3 + rand(3) + bonusDmg;
					msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[indices[i]])[0];
				}
			}
		}
		else if (spellName == "gale") {
			if (target[0] == "r") {
				let row = (parseInt(target[1]) - 1);
				if (isNaN(row) || row <= 0 || row >= 6) {
					return "*RED*You can't target this row.\n";
				}
				msg = "*GREEN*The wind picks up and howls!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == row && targets[i].HP > 0) {
						msg += PushTarget(C, targets[i]);
					}
				}
			}
			else {
				return "*RED*Invalid row targeted!\n";
			}
		}
		else if (spellName == "entangle") {
			if (target[0] == "r") {
				let row = (parseInt(target[1]) - 1);
				msg = "*GREEN*Roots rise out of the ground to do your bidding!\n";
				for (let i = 0; i < targets.length; i++) {
					if (targets[i].ROW == row && targets[i].HP > 0) {
						let dmg = 2 + rand(3) + bonusDmg;
						msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
						let ran = rand(100);
						if (ran <= 50) {
							AddOrRefreshEffect(targets[i], new Effect("Rooted", "Unable to Move.", 1));
						}
					}
				}
			}
			else {
				return "*RED*Invalid row targetted!\n";
			}
		}
		else if (spellName == "earthen spear") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			if (Math.abs(targets[i].ROW - C.ROW) >= 1) {
				return "*RED*Target '" + target + "' is too far away to hit!\n";
			}
			let dmg = 8 + rand(5) + bonusDmg;
			msg += "*GREEN*A crude spear of jagged stone bursts out from the ground towards your foe.\n"
			msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
		}
		else if (spellName == "blizzard") {
			msg += "*BLUE*A frigid mist envelops your foes.\n"
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].HP > 0) {
					let dmg = 2 + rand(3) + bonusDmg;
					msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
					let chance = rand(100);
					if (chance <= 20) {
						msg += "*BLUE*The " + targets[i].NAME + " is frozen!\n";
						AddOrRefreshEffect(targets[i], new Effect("Stunned", "Lose your next turn.", 1));
					}
				}
			}
		}
		else if (spellName == "freeze") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			let dmg = 4 + rand(5) + bonusDmg;
			let chance = rand(100);
			msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
			if (chance <= 80) {
				msg += "*BLUE*The " + targets[i].NAME + " is encased in ice!\n"
				AddOrRefreshEffect(targets[i], new Effect("Stunned", "Lose your next turn.", 1));
			}
			else {
				msg += "*BLUE*The " + Name(targets[i]) + " isn't stunned. . .\n";
			}
		}
	}
	else if (spell.school == "imperial") {
		if (spellName == "frenzy") {
			msg += "*PINK*You feel frenzied!\n";
			AddOrRefreshEffect(C, new Effect("Frenzy", "Gain 3 AP for every 3rd spell you cast", 3, "buff"));
		}
		else if (spellName == "ferocity") {
			msg += "*PINK*You feel more ferocious!\n";
			AddOrRefreshEffect(C, new Effect("Ferocity", "Your spells deal +2 DMG", 3, "buff"));
		}
		else if (spellName == "meditation") {
			msg += "*PINK*You feel at peace and re-energized!\n";
			C.STAMINA = Math.min(MaxStamina(C), C.STAMINA + 10);
		}
		else if (spellName == "peel") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			msg += "*PINK*You peel away the defenses of the " + targets[i].NAME + "!\n";
			targets[i].ARMOR[0] = Math.max(0, targets[i].ARMOR[0] - 1);
			targets[i].ARMOR[1] = Math.max(0, targets[i].ARMOR[1] - 1);
		}
		else if (spellName == "blink") {
			if (target[0] == "r") {
				let row = (parseInt(target[1]) - 1);
				if (row == C.ROW) {
					return "*RED*You're already in that row!\n";
				}
				else {
					msg = "*PINK*You vanish and reappear!\n";
					C.ROW = row;
				}
			}
			else {
				return "*RED*Invalid row targetted!\n";
			}
		}
		else if (spellName == "teleport") {
			let row = 0;
			do {
				row = rand(5);
			} while (row == C.ROW);
			msg = "*PINK*You vanish and reappear in row " + (row+1) + "!\n";
			C.ROW = row;
		}
		else if (spellName == "siphon") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			msg += "*PINK*You siphon health away from your foe.\n"
			msg += DealDamage(new M_Attack(5, 100, 100), allies, C, targets, targets[i])
			C.HP = Math.min(MaxHP(C), C.HP + 5);
		}
		else if (spellName == "balance") {
			msg += "*PINK*You lash out at your foes.\n"
			let dmg = targets.length + bonusDmg;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].HP > 0) {
					msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
				}
			}
		}
	}
	else if (spell.school == "blood") {
		if (spellName == "balanced humors") {
			if (C.STAMINA > 4) {
				C.AP += 4;
				C.STAMINA -= 4;
			}
			else {
				return "*RED*You don't have enough Stamina to cast this!\n";
			}
			msg += "*RED*A slight coolness runs through you, and you feel refreshed.\n";
		}
		else if (spellName == "reap") {
			msg += "*RED*You harvest from the souls of your foes.\n"
			let dmg = targets.length + bonusDmg;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].HP > 0) {
					dmg = bonusDmg + 4 + rand(3);
					C.HP++;
					msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
				}
			}
			if (hasRune(C, "autumn")) {
				let ran = rand(allies.length);
				msg += "*GREEN*" + Name(allies[ran]) + " is healed 5 HP!\n";
				allies[ran].HP = Math.min(MaxHP(allies[ran]), allies[ran].HP + 5);
			}
			C.HP = Math.min(MaxHP(C) + 10, C.HP);
		}
		else if (spellName == "hemic strike") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			let dmg = 15 + bonusDmg;
			msg += "*RED*Beads of blood draw themselves from your palm, forming the sillhouette of your target.\n"
			msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
		}
		else if (spellName == "transfer life") {
			let i = findTarget(allies, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			allies[i].HP += 5;
			if (allies[i].HP > MaxHP(allies[i])) {
				allies[i].HP = MaxHP(allies[i].HP);
			}
			msg += "*GREEN*" + allies[i].NAME + " is healed for 5 HP!\n";
			msg += "*RED*Your flesh grows cold; they feel a rush of warmth beneath their ribs.\n";
			if (hasRune(C, "autumn")) {
				let ran = rand(allies.length);
				msg += "*GREEN*" + Name(allies[ran]) + " is healed 5 HP!\n";
				allies[ran].HP = Math.min(MaxHP(allies[ran]), allies[ran].HP + 5);
			}
		}
		else if (spellName == "restitution") {
			msg += "*RED*You and your allies gain 2 HP and 15 Stamina!\n";
			for (let i = 0; i < allies.length; i++) {
				allies[i].STAMINA = Math.min(allies[i].STAMINA + 15, MaxStamina(allies[i]));
				allies[i].HP = allies[i].HP = Math.min(MaxHP(allies[i]), allies[i].HP + 2);
			}
			if (hasRune(C, "autumn")) {
				let ran = rand(allies.length);
				msg += "*GREEN*" + Name(allies[ran]) + " is healed 5 HP!\n";
				allies[ran].HP = Math.min(MaxHP(allies[ran]), allies[ran].HP + 5);
			}
		}
		else if (spellName == "purify") {
			msg += "*RED*Your allies' afflictions are washed away in blood.\n";
			for (let i = 0; i < allies.length; i++) {
				for (let j = allies[i].EFFECTS.length - 1; j >= 0; j--) {
					if (allies[i].EFFECTS[j].type == "debuff") {
						endEffect(allies[i], j);
					}
				}
			}
		}
		else if (spellName == "conjure apparition") {
			msg += "*RED*You summon an Apparition!\n";
			allies.push(summon("apparition", C.ROW));
		}
		else if (spellName == "wild conjuration") {
			let animals = [];
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].TYPE == "animal") {
					animals.push(enemies[i]);
				}
			}
			let name = animals[rand(animals.length)].NAME;
			msg += "*RED*You summon " + an(name) + " " + name + "!";
			allies.push(summon(name, C.ROW));
		}
		else if (spellName == "conjure ghoul") {
			msg += "*RED*You summon a Hungry Ghoul!\n";
			allies.push(summon("hungry ghoul", C.ROW));
		}
	}
	else if (spell.school == "witchcraft") {
		if (spellName == "spread blight") {
			let numPoisoned = 0;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].TYPE != "evil" && targets[i].TYPE != "construction") {
					let foundPoison = false;
					numPoisoned++;
					AddOrRefreshEffect(targets[i], new Effect("Poison", "Take 1 damage a turn", 10));
				}
			}
			if (numPoisoned == 0) {
				return "*RED*There aren't any valid targets to poison!\n";
			}
			msg += "*GREEN*You poison *RED*" + targets.length + " targets*GREY*!\n";
		}
		else if (spellName == "bind") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			msg += "*GREEN*You bind the " + targets[i].NAME + " where they stand.\n";
			AddOrRefreshEffect(targets[i], new Effect("Rooted", "Unable to Move.", 3));
		}
		else if (spellName == "acrid burst") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			let dmg = 4 + rand(5) + bonusDmg;
			msg += "*GREEN*Foul energy bursts out at your foe!\n";
			msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
			if (hasEffect(targets[i], "poison")) {
				AddOrRefreshEffect(targets[i], new Effect("Stunned", "Lose your next turn.", 1));
				msg += "*GREEN*The " + targets[i].NAME + " is stunned!\n";
			}
		}
		else if (spellName == "acrid blast") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			msg += "*GREEN*Foul energy blasts towards your foe!\n";
			let dmg = 4 + rand(5) + bonusDmg;
			if (hasEffect(targets[i], "poison")) {
				dmg += 4;
			}
			msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
		}
		else if (spellName == "envenom") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			if (targets[i].TYPE == "evil" || targets[i].TYPE == "construction") {
				return "*RED*This enemy is immune to venom!\n";
			}
			AddOrRefreshEffect(targets[i], new Effect("Venom", "Take 4 dmg per turn.", 5));
			msg += "*GREEN*You envenom the *RED*" + targets[i].NAME + "*GREEN*!\n";
		}
		else if (spellName == "afflict") {
			let i = findTarget(targets, target, C.ROW);
				if (i == -1) {
					return "*RED*Can't find target '" + target + "'\n";
				}
				let foundPoison = false;
				for (let j = 0; j < targets[i].EFFECTS.length; j++) {
					if (targets[i].EFFECTS[j].name.toLowerCase() == "poison") {
						targets[i].EFFECTS[j].duration += 10;
						foundPoison = true;
						break;
					}
				}
				if (!foundPoison) {
					targets[i].EFFECTS.push(new Effect("Poison", "Take 1 damage a turn", 10));
					msg += "*GREEN*You afflict poison onto the *RED*" + targets[i].NAME + "\n";
				}
				else {
					msg += "*GREEN*You extend the duration of the poison on the *RED*" + targets[i].NAME + "\n";
				}
				
			}
		else if (spellName == "harvest blight") {
			let poisoned = false;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].HP > 0) {
					for (let j = targets[i].EFFECTS.length - 1; j >= 0; j--) {
						let dmg = 0;
						let name = targets[i].EFFECTS[j].name.toLowerCase();
						if (name == "poison") {
							dmg += Math.ceil(targets[i].EFFECTS[j].duration/2);
							targets[i].EFFECTS.splice(j, 1);
						}
						else if (name == "venom") {
							dmg += Math.round(targets[i].EFFECTS[j].duration/2 * 4);
							targets[i].EFFECTS.splice(j, 1);
						}
						if (dmg > 0) {
							msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
							poisoned = true;

						}
					}
					if (!poisoned) {
						return "*RED*There aren't any poisoned or envenomed targets!\n";
					}
				}
			}
		}
		else if (spellName == "polymorph") {
			let index = findTarget(allies, target, C.ROW);
			if (index == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			let animals = [];
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].TYPE == "animal") {
					animals.push(enemies[i]);
				}
			}
			let row = targets[index].ROW;
			let animal = animals[rand(animals.length)];
			let enemy = COPY(animal);
			enemy.SUMMONED = false;
			enemy.ROW = row;
			msg += "*GREEN*The " + targets[index].NAME + " is transformed into a " + enemy.NAME + "!\n";
			targets[index] = enemy;
		}
	}
	else if (spell.school == "divine") {
		if (spellName == "restoration") {
			let i = findTarget(allies, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			let heal = 4 + rand(5);
			allies[i].HP += heal;
			if (allies[i].HP > MaxHP(allies[i])) {
				allies[i].HP = MaxHP(allies[i].HP);
			}
			msg += "*GREEN*" + allies[i].NAME + " is healed for " + heal + " HP!\n";
			msg += "*YELLOW*Their wounds shine with a soft, golden light, and are mended.\n";
			if (hasRune(C, "autumn")) {
				let ran = rand(allies.length);
				msg += "*GREEN*" + Name(allies[ran]) + " is healed 5 HP!\n";
				allies[ran].HP = Math.min(MaxHP(allies[ran]), allies[ran].HP + 5);
			}
		}
		else if (spellName == "smite") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			let dmg = 5 + rand(6) + bonusDmg;
			if (targets[i].NAME == "Lich" || targets[i].NAME == "Skeletal Knight" || targets[i].NAME == "Skeletal Archer" || targets[i].NAME == "Houndlord") {
				dmg *= 2;
			}
			msg += "*YELLOW*There is a beam of intense light from above, and your foe's impurities are burned away.\n"
			msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
		}
		else if (spellName == "deliverance") {
			let i = findTarget(allies, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			msg += "*YELLOW*A slight aura of golden light surrounds " + allies[i].NAME + ".\n"
			AddOrRefreshEffect(allies[i], new Effect("Deliverance", "You can't be reduced below 1 HP.", 1));
		}
		else if (spellName == "holy light") {
			let rows = [[], [], [], [], []];
			for (let i = 0; i < targets.length; i++) {
				rows[targets[i].ROW].push(i);
			}
			msg += "*YELLOW*Scattered sunbeams shine down across the battlefield.\n";
			for (let i = 0; i < rows.length; i++) {
				if (rows[i].length > 0) {
					let dmg = 4 + rand(3) + bonusDmg;
					msg += DealDamage(new M_Attack(dmg), allies, C, targets, rows[i][rand(rows[i].length)])[0];
				}
			}
		}
		else if (spellName == "disperse") {
			let numTeleports = 0;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].ROW == C.ROW) {
					while (targets[i].ROW == C.ROW) {
						targets[i].ROW = rand(5);
					}
					numTeleports++;
					msg += "*YELLOW*The " + targets[i].NAME + " is teleported to Row " + (targets[i].ROW + 1) + "!\n";
				}
			}
			if (numTeleports == 0) {
				return "*RED*There are no enemies in your row!\n";
			}
		}
		else if (spellName == "banish") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			msg += "*YELLOW*The " + targets[i].NAME + " vanishes from the battle!\n";
			targets.splice(i, 1);
		}
		else if (spellName == "divine hand") {
			let i = findTarget(targets, target, C.ROW);
			if (i == -1) {
				return "*RED*Can't find target '" + target + "'\n";
			}
			if (Math.abs(targets[i].ROW - C.ROW) >= 1) {
				return "*RED*Target '" + target + "' is too far away to hit!\n";
			}
			let dmg = 16 + rand(9) + bonusDmg;
			msg += "*GREEN*You reach to your foe, and they shy away from your touch.\n"
			msg += DealDamage(new M_Attack(dmg), allies, C, targets, targets[i])[0];
		}
	}
	let ran = rand(100);
	if (ran >= refundChance) {
		C.AP -= (spell.AP + APCost(C));
	}
	else {
		msg += "*GREEN*The Spell costs no AP!\n";
	}
	C.HP -= spell.HP;
	C.GOLD -= spell.gold;
	if (hasRune(C, "spring")) {
		msg += "*GREEN*You heal 1 HP.\n";
		C.HP = Math.min(MaxHP(C), C.HP + 1);
	}
	if (++C.CASTS % 3 == 0) {
		if (hasEffect(C, "frenzy")) {
			msg += "*GREEN*You gain 3 AP.\n";
			C.AP += 3;
		}
	}
	msg += "*GREEN*" + C.NAME + "*GREY* has " + C.AP + " *GREEN*AP*GREY* left this turn.\n";
	msg += "\n";
	return msg;
}


function summon(name, row, summoned = true) {
	let index = 0;
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].NAME.toLowerCase() == name.toLowerCase()) {
			index = i;
		}
	}
	let copy = COPY(enemies[index]);
	copy.ROW = row;
	copy.SUMMONED = summoned;
	return copy;
}

function endEffect(C, index) {
	if (C.EFFECTS[index].name.toLowerCase() == "stoneskin") {
		C.ARMOR[0] -= 8;
		C.ARMOR[1] -= 4;
		if (C.ARMOR[0] < 0) { C.ARMOR[0] = 0; }
		if (C.ARMOR[1] < 0) { C.ARMOR[1] = 0; }
	}
	C.EFFECTS.splice(index, 1);
}

function APCost(C) {
	let cost = 0;
	if (hasEffect(C, "coated in honey")) {
		cost += 3;
	}
	return cost;
}

function Prettify(string) {
	let arr = string.split(" ");
	for (let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
	}
	let val = arr.join(" ");
	return val;
}

function shitSort(list) {
	let sorted = [];
	while (list.length > 0) {
		let max = 0;
		for (let i = 1; i < list.length; i++) {
			if (list[i].wins > list[max].wins) {
				max = i;
			}
		}
		sorted.push(list[max]);
		list.splice(max, 1);
	}
	return sorted;
}

function runBattle(teamOne, teamTwo, index, channel = null) {
	let results = [0, 0];
	let battle = new Battle("blah");
	for (const enemy of teamOne) {
		let en = summon(enemy, 4);
		en.ROW = 4;
		if (en.NAME == "Swamp Stalker") {
			en.ROW = 1;
		}
		battle.allies.push(en);
	}
	for (const enemy of teamTwo) {
		let en = summon(enemy, 4);
		en.ROW = 1;
		if (en.NAME == "Swamp Stalker") {
			en.ROW = 4;
		}
		battle.enemies.push(en);
	}
	let turns = 0;
	battle.started = true;
	if (index % 2 == 0) {
		battle.allyTurn = false;
	}
	let msg = "";
	while (battle.started && turns++ < 50 && (battle.allies.length + battle.enemies.length < 100)) {
		msg += HandleCombat(battle, false, true) + "\n";
		if (channel && battle.started && turns++ < 50 && (battle.allies.length + battle.enemies.length < 100)) {
			msg += DrawCombat("Testing", battle);
		}
	}
	if (channel) {
		PrintMessage(parseText(msg), channel);
	}
	if (battle.allies.length > 0) {
		results[0] = 1;
	}
	else if (battle.enemies.length > 0) {
		results[1] = 1;
	}
	return results;
}

function expected(A, B) {
	return (1 / (1 + Math.pow(10, (B - A)/400)));
}

function clearLastLine() {
  process.stdout.moveCursor(0, -1) // up one line
  process.stdout.clearLine(1) // from cursor to end
}

client.on('ready', () => {
	if (!data["town"]) {
		data["town"] = new Town();
		SaveState();
	}
	
	let header = "Weapon"
	let running = 10;
	for (let i = 0; i < 7; i++) {
		running += 10;
		header = StackStrings(header, (i*2), running, false);
	}
	
	header = StackStrings(header, "AP", running + 10, false);
	header = StackStrings(header, "Range", running + 15, false);
	//console.log(header);
	for (let i = 0; i < weapons.length; i++) {
		let printStr = weapons[i].name;
		let running = 10;
		for (let j = 0; j < 7; j++) {
			let dmg = (weapons[i].min + weapons[i].max)/2;
			dmg = Math.max(Math.round(dmg * weapons[i].pen/100), Math.round(dmg - (j*2)));
			if (dmg < 1) {
				dmg = 1;
			}
			dmg *= weapons[i].attacks[1] * weapons[i].chance/100 * 2/weapons[i].hands;
			dmgStr = dmg.toFixed(2);
			running += 10;
			printStr = StackStrings(printStr, dmgStr, running, false);
		}
		let APStr = "" + weapons[i].AP * weapons[i].attacks[1] * 2/weapons[i].hands;
		printStr = StackStrings(printStr, APStr, running + 10, false);
		printStr = StackStrings(printStr, weapons[i].range, running + 15, false);
		//console.log(printStr);
	}
	let wins = [];
	console.log("Connected as " + client.user.tag);
	client.user.setActivity("Terrain Gen 3");

	let TESTING = false;
	let numRounds = 3;
	if (TESTING) {
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
			wins.push({index: i, wins: 0, battles: 0, name: "", cost: 0, team: teamNames});
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
				clearLastLine();
			}
			console.log(i + "/" + wins.length);
			for (let j = i + 1; j < wins.length; j++) {
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
			let indivScore = Math.floor(Math.floor(150 * sorted[i].wins/max));
			let percent = Math.floor(1000 * sorted[i].wins/sorted[i].battles)/10;
			let strOne = StackStrings("*GREEN*"+sorted[i].cost, "*CYAN*" + Math.floor(100 * sorted[i].wins/sorted[i].cost)/100+"*GREY*", 5, false);
			let strTwo = StackStrings(strOne, "*YELLOW*" + percent+"*GREY*%", 13, false);
			msg += StackStrings(strTwo, "*RED*"+sorted[i].name, 25)+"*GREY*";
		}
		value /= sorted.length
		console.log(parseText(msg));
		console.log("Avg Score: " + Math.floor(100 * value)/100);
	}
});

function PrintMessage(msg, channel) {
	let message = msg;
	if (msg == "") {
		return;
	}
	if (message.length > 2000) {
		for (let i = 1000; i < message.length; i++) {
			if (message[i] == '\n') {
				let newMessage = "\`\`\`ansi\n" + message.substring(i);
				setTimeout(() => {PrintMessage(newMessage, channel);}, 10);
				message = message.substring(0, i) + "\`\`\`";
				break;
			}
		}
	}
	channel.send(message);
}

client.on('message', (rec) => {
	try {
		if (rec.author != client.user) {
			let id = rec.author.id;
			if (!data[id]) {
				data[id] = {
					CHARACTER: null
				}
			}
			if (rec.content.startsWith("!")) {
				let msg = Command(rec);
				if (msg != "") {
					PrintMessage(parseText(msg), rec.channel);
				}
			}
			SaveState();
		}
	}
	catch (error) {
		console.log(error);
	}
});

client.on('error', error => {
	console.error('The WebSocket encountered an error:', error);
});

function parseText(msg) {
	let text = msg.split("*GREY*").join("[2;0m");
	text = text.split("*BLACK*").join("[2;30m");
	text = text.split("*RED*").join("[2;31m");
	text = text.split("*GREEN*").join("[2;32m");
	text = text.split("*YELLOW*").join("[2;33m");
	text = text.split("*BLUE*").join("[2;34m");
	text = text.split("*PINK*").join("[2;35m");
	text = text.split("*CYAN*").join("[2;36m");
	text = text.split("*WHITE*").join("[2;37m");
	text = text.split("*END*").join("[2;0m");
	return "\`\`\`ansi\n" + text + "\`\`\`";
}

function ItemDescription(C, item) {
	let msg = "";
	let max = maxRunes(item);
	if (item.type == "weapon") {
		msg += "*RED*" + item.name + "*BLACK* | *CYAN*" + item.hands + "H*BLACK* | *PINK*" + item.chance + "%*BLACK* | *YELLOW*" + item.value + "G*GREY*\n";
		if (item.type == "weapon") {
			
		}
		msg += "Deals *RED*" + item.min + "-" + (item.max + C.STATS[WEP]) + " dmg*GREY* to targets within *GREEN*" + item.range + " range*GREY*, ignoring *CYAN*" + item.pen + "%*GREY* of their armor; can be used *PINK*" + item.attacks[1] + "*GREY* times per turn at a cost of *GREEN*" + item.AP + " AP*GREY* per attack.\n"
	}
	else if (item.type == "armor") {
		msg += "*RED*" + item.name + "*BLACK* | *CYAN*⛊*GREY*" + item.armor[0] + " *CYAN*✱*GREY*" + item.armor[1] + "*BLACK* | *YELLOW*" + item.value + "G*GREY*\n";
		msg += item.description+"\n";
		if (item.AP > 0) {
			msg += "*RED*Reduces*GREY* your *GREEN*AP*GREY* by *RED*" + item.AP + "*GREY* and your *GREEN*Stamina*GREY* by *RED*" + item.AP * 5 + "*GREY*!\n";
		}
	}
	else {
		msg += "*RED*" + item.name + "*BLACK* | ";
		if (item.type == "rune") {
			msg += " *CYAN*" + item.target + " rune*BLACK* | ";
		}
		msg += "*YELLOW*" + item.value + "G*GREY*\n";
		msg += item.description + "\n";
	}
	if (max > 0) {
		msg += "*CYAN*Runes *BLACK*" + item.runes.length + "/" + max + "*GREY*\n";
		for (const rune of item.runes) {
			msg += StackStrings("*RED*   " + rune.name, "*YELLOW*" + rune.value + "G*GREY* " + rune.description, 30);
		}
	}
	return msg;
}

function DrawBar(val, max, size, color) {
	let str = "[" + color;
	let threshold = Math.floor(size * val / max);
	for (let i = 0; i < size; i++) {
		if (i < threshold) {
			str += "■";
		}
		else if (i == threshold) {
			str += "*BLACK*-";
		}
		else {
			str += "-";
		}
	}
	str += "*GREY*] *BLACK*" + val + "\\" + max + "*GREY*";
	return str;
}

function writeStats(C) {
	let msg = "";
	for (let i = 0; i < 6; i++) {
		let color = "*BLACK*";
		if (C.STATS[i] > 0) {
			color = "*GREY*";
			if (C.STATS[i] > 4) {
				color = "*GREEN*";
				if (C.STATS[i] > 9) {
					color = "*YELLOW*";
				}
			}
		}
		let stat = "*CYAN*" + stats[i] + " - " + color + C.STATS[i];
		for (let j = 0; j < 20 - (C.STATS[i] / 10); j++) {
			stat += " ";
		}
		msg += stat;
		if ((i + 1) % 2 == 0) {
			msg += "\n";
		}
	}
	return msg;
}

function Inventory(C) {
	let msg = "";
	msg += "*YELLOW*INVENTORY *GREY*- *YELLOW*" + C.GOLD + " Gold\n";
	let strings = ["", "", ""];
	for (let i = 0; i < 15; i++) {
		if (i < 5 || C.BACKPACK) {
			let item = "---";
			let isItem = false;
			let isEquipped = false;
			if (i < C.INVENTORY.length) {
				isItem = true;
				isEquipped = C.INVENTORY[i].equipped;
				item = C.INVENTORY[i].name;
				if (C.INVENTORY[i].runes) {
					for (const rune of C.INVENTORY[i].runes) {
						item += "+";
					}
				}
				if (isEquipped && (C.INVENTORY[i].type == "weapon" || C.INVENTORY[i].type == "staff" || C.INVENTORY.type == "pole")) {
					let equipStr = "";
					if (C.LEFT == i) {
						equipStr = "L";
					}
					if (C.RIGHT == i) {
						equipStr += "R";
					}
					equipStr = "*GREY*[*RED*" + equipStr + "*GREY*] *BLUE*";
					item = equipStr + item;
				}
				if (measureText(item) > 30) {
					item = item.substring(0, 17);
					item += "...";
				}
			}
			if (isItem) {
				if (isEquipped) {
					item = "*BLUE*" + item + "*GREY*";
				}
				else {
					item = "*GREY*" + item + "*GREY*";
				}
				if (C.INVENTORY[i].type == "weapon") {
					let attacks = C.INVENTORY[i].attacks[0];
					if (BattleIndex(C.ID) == -1) { 
						attacks = C.INVENTORY[i].attacks[1];
					}
					item += " *YELLOW*" + attacks + "*BLACK* | *GREEN*" + C.INVENTORY[i].AP + "*GREY*";
				}
				else if (C.INVENTORY[i].type == "armor") {
					item += " *CYAN*" + C.INVENTORY[i].armor[0] + "*BLACK* | *CYAN*" + C.INVENTORY[i].armor[1];
					if (C.INVENTORY[i].AP > 0) {
						item += "*BLACK* | *RED*-" + C.INVENTORY[i].AP;
					}
					item += "*GREY*";
				}
			}
			strings[Math.floor(i / 5)] += "*PINK*" + (i + 1).toString().padStart(2, '0') + "*GREY*) " + item + "\n";
		}
	}
	strings[0] = StackStrings(strings[0], strings[1], 40);
	msg += StackStrings(strings[0], strings[2], 80);
	return msg;
}

function WriteEffects(C) {
	let msg = "*PINK*Effects*GREY*\n";
	for (const effect of C.EFFECTS) {
		if (effect.type == "buff") {
			msg += effect.name + " *BLACK*| *YELLOW*" + effect.duration + "*GREY* - " + effect.description + "\n";
		}
	}
	for (const effect of C.EFFECTS) {
		if (effect.type == "debuff") {
			msg += effect.name + " *BLACK*| *YELLOW*" + effect.duration + "*GREY* - " + effect.description + "\n";
		}
	}
	return msg;
}

function EnemyDescription(enemy, showEffects = true) {
	let msg = "";
	msg += "*RED*" + enemy.NAME + " *CYAN*⛊*GREY*" + enemy.ARMOR[0] + " *CYAN*✱*GREY*" + enemy.ARMOR[1] + " *GREY*";
	msg += DrawBar(enemy.HP, MaxHP(enemy), 30, "*RED*") + "\n";
	msg += enemy.DESCRIPTION + "\n\n";
	if (enemy.ZONES.length > 0) {
		let locationNames = ["Haunted Crypts", "Acrid Swamp", "Wilted Woods", "Stony Island"];
		msg += "This enemy is commonly found in ";
		for (let i = 0; i < enemy.ZONES.length; i++) {
			msg += "the *GREEN*" + locationNames[enemy.ZONES[i]] + "*GREY*";
			if (enemy.ZONES.length >= 2 && i <= enemy.ZONES.length - 2) {
				if (enemy.ZONES.length > 2) {
					msg += ",";
				}
				if (i == enemy.ZONES.length - 2) {
					msg += " and";
				}
				msg += " ";
			}
		}
		msg += ".";
	}
	if (showEffects) {
		msg += "\n\n";
		if (enemy.EFFECTS.length > 0) {
			msg += WriteEffects(enemy);
		}
		else {
			msg += "*BLACK*This creature has no active effects. . .\n";
		}
	}
	return msg;
}

function DrawGuildHall() {
	let msg = "";
	let retired = data["town"].retired;
	if (retired.length == 0) {
		msg += "*RED*No adventurers have taken up residence in the guild hall. . .\n";
	}
	else if (retired.length == 1) {
		msg += "*CYAN*Only a single resident currently resides here.\n\n";
	}
	else {
		msg += "*CYAN*Multiple residents currently reside here.\n\n";
	}
	for (const hero of retired) {
		msg += "*GREEN*" + hero.NAME + "*GREY* - *CYAN*" + Prettify(hero.CLASS) + " *YELLOW*Level " + hero.LEVEL + "\n"; 
	}
	return msg;
}

function DrawGraveyard() {
	let graves = data["town"].graves;
	let msg = "\nThere are " + graves.length + " graves in the graveyard.\n\n";
	let unmarked = 0;
	for (const death of graves) {
		if (death.LEVEL <= 1) {
			unmarked++;
		}
		else {
			msg += "*GREEN*" + death.NAME + "*GREY* the *BLUE*" + Prettify(death.CLASS) + "*GREY*, *YELLOW*Level " + death.LEVEL + "\n";
			if (death.DESCRIPTION) {
				msg += "*WHITE*    " + death.DESCRIPTION + "\n";
			}
		}
	}
	msg += "\n*GREY*";
	msg += unmarked + " of the graves are unmarked, having been left by adventurers who were too insignificant to be remembered. . .\n";
	return msg;
}

function RoomDescription(C) {
	if (!C) {
		return "*RED*You need to make a character.";
	}
	let msg = "";
	let index = BattleIndex(C.ID);
	let room;
	let NPCList = [];
	for (let i = 0; i < locations.length; i++) {
		if (locations[i].id.toLowerCase() == C.LOCATION.toLowerCase()) {
			room = locations[i];
		}
	}
	if (index > -1) {
		return DrawCombat(room.id, battles[index]);
	}
	if (C.TRADING) {
		return DrawTrade(C);
	}
	if (C.BUILDING != "") {
		let building = findBuilding(C.BUILDING);
		msg += "*RED*" + room.id + "*GREY* - *BLUE*" + building.id + "*GREY*" + "\n";
		msg += building.description + "\n\n"
		NPCList = building.people
	}
	else {
		msg += "*RED*" + room.id + "*GREY*\n";
		msg += "*GREY*" + room.description + "*GREY*\n\n";
		if (room.fish.length > 0) {
			msg += "*BLUE*You can fish here.*GREY*\n\n";
		}
		if (room.buildings.length > 0) {
			msg += "The ";
			for (let i = 0; i < room.buildings.length; i++) {
				if (i > 0 && i < room.buildings.length - 1) {
					msg += "the ";
				}
				let color = "*CYAN*";
				if (room.buildings[i].prosperity > data["town"].prosperity) {
					color = "*RED*";
				}
				msg += color + room.buildings[i].id + "*GREY*";
				if (room.buildings.length >= 2 && i <= room.buildings.length - 2) {
					if (room.buildings.length > 2) {
						msg += ",";
					}
					if (i == room.buildings.length - 2) {
						msg += " and";
					}
					msg += " ";
				}
			}
			if (room.buildings.length > 1) {
				msg += " are here.\n\n";
			}
			else {
				msg += " is here.\n\n";
			}
		}
		for (let i = 0; i < room.connections.length; i++) {
			msg += "*GREEN*" + Prettify(room.connections[i].direction) + "*GREY* - *RED*" + room.connections[i].id + "*GREY*\n";
		}
		if (room.dungeon) {
			msg += "*RED*Delve Deeper*GREY*\n";
		}
		NPCList = room.people;
	}
	if (NPCList.length > 0) {
		let i = 0;
		for (const NPC of NPCList) {
			let color = "*GREEN*";
			if (NPC.MERCHANT) {
				color = "*YELLOW*";
			}
			msg += color + NPC.NAME + "*GREY*";
			if (NPCList.length >= 2 && i <= NPCList.length - 2) {
				if (NPCList.length > 2) {
					msg += ", ";
				}
				if (i == NPCList.length - 2) {
					msg += " and ";
				}
			}
			i++;
		}
		if (NPCList.length > 1) {
			msg += " are here.\n";
		}
		else {
			msg += " is here.\n";
		}
	}
	msg += DrawPlayers(C);
	if (room.id.toLowerCase() == "the graveyard") {
		msg += DrawGraveyard();
	}
	if (C.BUILDING.toLowerCase() == "guild hall") {
		msg += DrawGuildHall();
	}
	return msg;
}

function CharacterDescription(C) {
	let index = C;
	let msg = "";
	if (C.TYPE == "player") {
		let levelStr = "*PINK*Level " + C.LEVEL;
		if (C.SP > 0) {
			levelStr += "*BLACK* | *WHITE*" + C.SP + " SP";
		}
		msg += "*GREEN*" + C.NAME + "*GREY* the *CYAN*" + Prettify(C.CLASS) + "*BLACK* | " + levelStr + "*BLACK* | *YELLOW*" + C.XP + "*GREY*/*GREEN*" + C.LEVEL * 100 + "*GREY* XP*BLACK* | *CYAN*⛊*GREY*" + C.ARMOR[0] + " *CYAN*✱*GREY*" + C.ARMOR[1] +"*GREY*\n";
		msg += DrawBar(C.HP, MaxHP(C), 30, "*RED*") + "\n";
		msg += DrawBar(C.STAMINA, MaxStamina(C), 30, "*GREEN*");
		if (BattleIndex(C.ID) > -1) {
			msg += "*GREY* - *GREEN* AP: " + C.AP;
		}
		else {
			msg += "*GREY* - *GREEN* AP: " + MaxAP(C);
		}
		msg += "\n";
		msg += writeStats(C);
		let index = BattleIndex(C.ID);
		if (index == -1) {
			msg += Inventory(C);
		}
		else {
			msg += WriteEffects(C);
		}
		if (C.DESCRIPTION != "") {
			msg += C.DESCRIPTION;
		}
	}
	else if (C.TYPE == "npc") {
		msg += C.DESCRIPTION;
		if (C.MERCHANT) {
			msg += "\n\n*GREEN*" + C.NAME + "*YELLOW* has goods to sell.";
		}
	}
	return msg;
}

function measureText(str) {
	let text = str;
	text = text.split("*GREY*").join("");
	text = text.split("*BLACK*").join("");
	text = text.split("*RED*").join("");
	text = text.split("*GREEN*").join("");
	text = text.split("*YELLOW*").join("");
	text = text.split("*BLUE*").join("");
	text = text.split("*PINK*").join("");
	text = text.split("*CYAN*").join("");
	text = text.split("*WHITE*").join("");
	text = text.split("*END*").join("");
	return text.length;
}

function StackStrings(left, right, spaces, newLines = true, separator = " ") {
	let leftRows = ("" + left).split("\n");
	let rightRows = ("" + right).split("\n");
	let msg = "";

	let len = Math.max(leftRows.length, rightRows.length);

	for (let i = 0; i < len; i++) {
		let num = 0;
		if (i < leftRows.length) {
			num = measureText(leftRows[i]);
			msg += leftRows[i];
		}
		if (i < rightRows.length) {
			for (let j = 0; j < spaces - num; j++) {
				msg += separator;
			}
			msg += rightRows[i];
		}
		if (newLines) {
			msg += "\n";
		}
	}
	return msg;
}

function DrawCombat(battleLocation, battle) {
	let msg = "";
	let battleStr = "";
	let defStr = "";
	let barStr = "";
	let turn = "";
	if (battle.allyTurn) {
		turn = "*CYAN*Players' Turn*GREY*";
	}
	else {
		turn = "*RED*Enemies' Turn*GREY*";
	}
	msg += "*RED*" + battleLocation + "*GREY* - *PINK*Level " + battle.level + "*GREY* - " + turn + "\n";
	for (let i = 0; i < 5; i++) {
		battleStr += "*GREY*R" + (i+1) + " - ";
		for (let j = 0; j < battle.enemies.length; j++) {
			if (battle.enemies[j].ROW == i) {
				let color = "*BLACK*";
				if (battle.enemies[j].HP > 0) {
					color = "*RED*";
				}
				battleStr += color + "E" + (j + 1) + " *GREY*";
			}
		}
		for (let j = 0; j < battle.allies.length; j++) {
			if (battle.allies[j].ROW == i) {
				let color = "*BLACK*";
				if (battle.allies[j].HP > 0) {
					color = "*GREEN*";
				}
				battleStr += color + "P" + (j + 1) + " *GREY*";
			}
		}
		battleStr += " \n";
	}
	let otherStr = "";
	otherStr = "Enemies\n";
	barStr += "\n";
	defStr += "\n";
	for (let i = 0; i < battle.enemies.length; i++) {
		let color = "*BLACK*";
		if (battle.enemies[i].HP > 0) {
			color = "*RED*";
		}
		let name = battle.enemies[i].NAME;
		for (const effect of battle.enemies[i].EFFECTS) {
			if (effect.type == "buff") {
				name += "+";
			}
		}
		for (const effect of battle.enemies[i].EFFECTS) {
			if (effect.type == "debuff") {
				name += "-";
			}
		}
		barStr += DrawBar(battle.enemies[i].HP, battle.enemies[i].MaxHP, 15, "*RED*") + "\n";
		defStr += " *CYAN*⛊*GREY*" + battle.enemies[i].ARMOR[0] + " *CYAN*✱*GREY*" + battle.enemies[i].ARMOR[1] + " *GREY*\n";
		otherStr += color + "E" + (i + 1) + " *GREY*" + name + "\n"; 
	}
	otherStr += "\n";
	otherStr += "Allies\n";
	barStr += "\n \n";
	defStr += "\n \n";
	for (let i = 0; i < battle.allies.length; i++) {
		let color = "*BLACK*";
		if (battle.allies[i].HP > 0) {
			color = "*GREEN*";
		}
		barStr += DrawBar(battle.allies[i].HP, MaxHP(battle.allies[i]), 15, "*RED*") + "\n";
		let name = "*GREY*";
		if (battle.allies[i].ENDED) {
			name = "*BLACK*";
		}
		name += battle.allies[i].NAME;
		for (const effect of battle.allies[i].EFFECTS) {
			if (effect.type == "buff") {
				name += "+";
			}
		}
		for (const effect of battle.allies[i].EFFECTS) {
			if (effect.type == "debuff") {
				name += "-";
			}
		}
		let AP = "*GREEN* AP " + battle.allies[i].AP;
		let atks = 0;
		if (battle.allies[i].TYPE == "player") {
			for (const item of battle.allies[i].INVENTORY) {
				if (item.type == "weapon") {
					if (item.equipped) {
						atks += item.attacks[0];
					}
				}
			}
			atks = "*RED*x" + atks;
		}
		else {
			AP = "";
			atks = "";
		}
		otherStr += color + "P" + (i + 1) + " " + name + AP + " " + atks + "\n";
		defStr += " *CYAN*⛊*GREY*" + battle.allies[i].ARMOR[0] + " *CYAN*✱*GREY*" + battle.allies[i].ARMOR[1] + " *GREY*\n";
	}
	otherStr = StackStrings(otherStr, defStr, 23);
	otherStr = StackStrings(otherStr, barStr, 31);
	if (battle.loot.length > 0) {
		let lootStr = "\n*GREY*Loot\n"
		let numStr = "\n \n";
		for (let i = 0; i < battle.loot.length; i++) {
			let name = battle.loot[i].name;
			if (battle.loot[i].type == "weapon" || battle.loot[i].type == "armor") {
				for (const rune of battle.loot[i].runes) {
					name += "+";
				}
			}
			if (name.length > 30) {
				name = name.substring(0, 17);
				name += "...";
			}
			lootStr += "*PINK*" + (i + 1).toString().padStart(2, '0') + "*GREY*) " + name + "\n";;
		}
		battleStr += lootStr+"\n";
	}
	
	msg += StackStrings(battleStr, otherStr, 30);
	return msg;
}

var fishing = [];

function Fish() {
	fishing.push(new FishEvent(C.ID, new Date()));
	setTimeout() 
}

function DrawTrade(C) {
	let msg = "";
	let NPC = null;
	for (let i = 0; i < people.length; i++) {
		if (people[i].NAME.toLowerCase() == C.TRADING.toLowerCase()) {
			NPC = people[i];
		}
	}
	if (!NPC) {
		C.TRADING = "";
		console.log("Error Trading in DrawTrade");
		return "";
	}
	let priceStr = "";
	let itemStr = "";
	let descStr = "";
	let max = 0;
	let maxName = 0;
	let maxRune = 0;
	if (NPC.INDEX >= NPC.CONVERSATIONS.length) {
		NPC.INDEX = 0;
	}
	msg += "*GREY*" + NPC.DESCRIPTION + "\n\n";
	msg += "*YELLOW*" + NPC.NAME + "*GREY*: ";
	msg += NPC.CONVERSATIONS[NPC.INDEX++] + "\n\n";
	for (let i = 0; i < NPC.ITEMS.length; i++) {
		let str = "";
		let num = (i + 1).toString().padStart(2, '0');
		str += "*PINK*" + num + ") *GREY*" + NPC.ITEMS[i].name;
		if (NPC.ITEMS[i].type == "weapon") {
			let attacks = NPC.ITEMS[i].attacks[1];
			str += " *YELLOW*" + attacks + " ATKs *GREEN*" + NPC.ITEMS[i].AP + " AP*GREY*";
			weaponOrArmorPresent = true;
		}
		else if (NPC.ITEMS[i].type == "armor") {
			str += " *CYAN*" + NPC.ITEMS[i].armor[0] + "*BLACK* | *CYAN*" + NPC.ITEMS[i].armor[1];
			if (NPC.ITEMS[i].AP > 0) {
				str += "*BLACK* | *RED*+" + NPC.ITEMS[i].AP;
			}
			str += "*GREY*";
		}
		else if (NPC.ITEMS[i].type == "rune") {
			descStr += " *CYAN*" + NPC.ITEMS[i].description;
			if (NPC.ITEMS[i].description.length > max) {
				max = NPC.ITEMS[i].description.length;
			}
			if (NPC.ITEMS[i].name.length > maxRune) {
				maxRune = NPC.ITEMS[i].name.length;
			}
		}
		if (measureText(str) > maxName) {
			maxName = measureText(str);
		}
		descStr += "\n";
		itemStr += str + "\n";
		priceStr += "*YELLOW*" + NPC.ITEMS[i].value + "\n";
	}
	max = Math.max(maxName, max + maxRune);
	let distance = max + 10;
	itemStr = StackStrings(itemStr, descStr, maxRune + 5);
	msg += StackStrings(itemStr, priceStr, distance);
	msg += "*GREY*Your Gold: *YELLOW*" + C.GOLD;
	return msg;
}



function DrawPlayers(C) {
	let msg = "";
	let playerList = [];
	for (var player in data) {
		if (data[player].CHARACTER && data[player].CHARACTER.ID != C.ID) {
			if (data[player].CHARACTER.LOCATION == C.LOCATION && data[player].CHARACTER.BUILDING == C.BUILDING) {
				playerList.push(data[player].CHARACTER.NAME);
			}
		}
	}
	if (playerList.length > 0) {
		for (let i = 0; i < playerList.length; i++) {
			msg += "*GREEN*" + playerList[i];
			msg += "*GREY*";
			if (playerList.length >= 2 && i <= playerList.length - 2) {
				if (playerList.length > 2) {
					msg += ",";
				}
				if (i == playerList.length - 2) {
					msg += " and";
				}
				msg += " ";
			}
		}
		if (playerList.length > 1) {
			msg += " are here.\n";
		}
		else {
			msg += " is here.\n";
		}
	}
	return msg;
}

function Command(message) {
	let words = message.content.substring(1).toLowerCase().split(" ");
	for (let i = 0; i < words.length; i++) {
		if (words[i].length == 0) {
			words.splice(i, 1);
		}
	}
	let keyword = words[0];
	let msg = "";
	let C = data[message.author.id].CHARACTER;
	let index = -1;
	let numRepeat = 1;
	
	let requireCharacter = ["heal", "cheat", "fish", "reel", "haircut", "inventory", "enchant", "level", "stop", "move", "discard", "delve", "equip", "dequip", "remove", "unequip", "here", "leave", "go", "travel", "enter", "leave", "move", "talk", "trade", "take", "suicide", "drink", "read", "buy", "sell", "spells"];
	let requireBattle = ["start", "end", "cast", "attack", "flee", "drop", "push"];
	
	for (let i = 0; i < requireBattle.length; i++) {
		requireCharacter.push(requireBattle[i]);
	}
	
	if (requireCharacter.indexOf(keyword) > -1 && words[words.length - 1][0] == "x" && words[words.length - 1].length == 2) {
		numRepeat = parseInt(words[words.length - 1][1]);
		if (isNaN(numRepeat) || numRepeat == 0) {
			numRepeat = 1;
		}
		words.splice(words.length - 1, 1);
	}
	for (let i = 0; i < numRepeat; i++) {
		if (C) {
			let xpRequired = C.LEVEL * 100;
			if (C.XP >= xpRequired) {
				msg += "*GREEN*" + C.NAME + " levels up!\n";
				C.XP -= xpRequired;
				C.LEVEL++;
				C.SP++;
			}
			if (C.TRADING == -1) {
				C.TRADING = "";
			}
			let location = findLocation(C.LOCATION);
			index = BattleIndex(C.ID);
			if (C.HP <= 0) {
				if (hasEffect(C, "deliverance")) {
					msg += "*YELLOW*" + C.NAME + " is delivered from harm!\n";
					C.HP = 1;
				}
				else {
					for (let i = 0; i < location.players; i++) {
						if (location.players[i].ID == C.ID) {
							location.players.splice(i, 1);
							break;
						}
					}
					data["town"].graves.push(new DeathReport(C.NAME, C.CLASS, C.LEVEL, C.DESCRIPTION));
					data[message.author.id].CHARACTER = null;
					C = null;
				}
			}
			else {
				if (index == -1) {
					C.STAMINA = MaxStamina(C);
					for (let i = 0; i < C.EFFECTS.length; i++) {
						endEffect(C, i);
					}
				}
				let found = false;
				for (let i = 0; i < location.players; i++) {
					if (location.players[i].ID == C.ID) {
						location.players.splice(i, 1);
						found = true;
						break;
					}
				}
				if (!found) {
					location.players.push(C);
				}
			}
		}
		
		if (C == null && requireCharacter.indexOf(keyword) > -1) {
			return "*RED*You need to make a character first with !character";
		}
		if (index == -1 && requireBattle.indexOf(keyword) > -1) {
			return "*RED*You must be in combat to do this action!";
		}
		if (keyword == "help") {
			return ListCommands(index);
		}
		else if (keyword == "test") {
			words.splice(0, 1);
			let sides = words.join(" ").split("vs");
			let teamOne = sides[0].split(",");
			let teamTwo = sides[1].split(",");
			for (let i = 0; i < teamOne.length; i++) {
				teamOne[i] = teamOne[i].trim();
			}
			for (let i = 0; i < teamTwo.length; i++) {
				teamTwo[i] = teamTwo[i].trim();
			}
			console.log(teamOne);
			console.log(teamTwo);
			runBattle(teamOne, teamTwo, rand(2), message.channel);
		}
		else if (keyword == "tutorial") {
			msg += "*GREEN*Welcome!\n";
			msg += "*BLUE*Please refer to the following commands to learn more about the game:\n";
			msg += "*CYAN*!help - Lists Available Commands\n";
			msg += "*BLUE*!classes - Provides a list of classes you can play as\n";
			msg += "*CYAN*!stats - Describes what a character's stats do\n";
			msg += "*BLUE*!weapons - Lists the different weapon classes and their strengths\n";
			msg += "*CYAN*!character - Creates a character to play as\n";
			msg += "*BLUE*!here - Gives a description of your character's surroundings.\n";
			msg += "*CYAN*!town - Provides a map of the town.\n";
			msg += "*BLUE*!quest - Gives information about the current active quest.\n";
		}
		else if (keyword == "weapons") {
			msg += "*GREEN*Weapon Classes\n";
			msg += "*BLUE*Blades - Bladed Weapons are varied and versatile, offering +1 Rune Slot.\n";
			msg += "*CYAN*Blunt - Blunt Weapons offer high penetration and damage. Each attack deals some damage to all enemies in a row.\n";
			msg += "*BLUE*Whips - Whips offer good damage and range, but have poor penetration. Hits have a 50% chance to cause enemies to bleed.\n";
			msg += "*CYAN*Axes - Axes offer decent damage and penetration, and have a 10% chance to land a wild hit that doubles damage.\n";
			msg += "*BLUE*Polearms - Polearms offer good damage and range, with decent penetration. They grant the user the ability to push enemies back.\n";
			msg += "*CYAN*Shields - Shields offer low damage with good penetration, and provide the user a chance to block incoming physical damage.\n";
			msg += "*BLUE*Ranged - Ranged weapons have good damage, low AP costs, and very high range, allowing the user to attack from safety.\n";
		}
		else if (keyword == "item" || keyword == "look") {
			msg += CommandDescribe(COPY(words), C, index);
		}
		else if (keyword == "stats") {
			msg += CommandStats(C);
		}
		else if (keyword == "delve") {
			if (index > -1) {
				battles[index].level++
				if (battles[index].level == 4) {
					battles[index].level = 1;
					msg += "You've ended up back where you started from.\n\n";
				}
				else {
					msg += "You delve even deeper, seeking stronger enemies. . .\n\n";
				}
				msg += RoomDescription(C);
			}
			else {
				msg += CommandDelve(C);
			}
		}
		else if (keyword == "start") {
			if (!battles[index].started) {
				battles[index].started = true;
				battles[index].allyTurn = true;
				msg += StartBattle(battles[index]);
				msg += StartTurn(battles[index].allies, battles[index].enemies, battles[index].deadAllies, battles[index].deadEnemies);
				for (let i = 0; i < battles[index].allies.length; i++) {
					if (battles[index].allies.TYPE == "player") {
						battles[index].allies.STAMINA = MaxStamina(battles[index].allies);
					}
				}
				msg += HandleCombat(battles[index]);
				msg += RoomDescription(C);
			}
		}
		else if (keyword == "end") {
			C.ENDED = true;
			msg += "*GREEN*" + C.NAME + "*GREY* ends their turn.\n";
			msg += HandleCombat(battles[index]);
			msg += RoomDescription(C);
		}
		else if (keyword == "prosperity") {
			msg += "*YELLOW*Town Prosperity: " + data["town"].prosperity;
			msg += "\n\n";
			msg += "*YELLOW*Prosperity*GREY* is accumulated over time as *YELLOW*gold *GREY*is spent in town; tavern drinks earn prosperity at 3x the normal rate. It can also be earned by completing quests. Earning prosperity unlocks new *BLUE*buildings *GREY*and *GREEN*areas*GREY*."
		}
		else if (keyword == "quest") {
			let quest = data["town"].quest;
			let index = findTarget(enemies, quest.enemy);
			
			if (index > -1 && index < enemies.length) {
				msg += EnemyDescription(enemies[index], false);
				msg += "\n\n";
				let num = quest.numRequired - quest.numKilled;
				msg += "Kill *RED*" + num + "*GREY* more of this enemy to collect the *YELLOW*" + quest.value + "g *GREY*reward!\n";
			}
		}
		else if (keyword == "equip" || keyword == "dequip" || keyword == "remove" || keyword == "unequip") {
			msg += CommandEquip(COPY(words), C);
		}
		else if (keyword == "cast") {
			msg += CommandCast(COPY(words), C, index);
			if (i == numRepeat - 1) {
				msg += RoomDescription(C);
			}
		}
		else if (keyword == "drop") {
			msg += CommandDrop(COPY(words), C, index);
		}
		else if (keyword == "enchant") {
			msg += CommandEnchant(COPY(words), C);
		}
		else if (keyword == "attack") {
			msg += CommandAttack(COPY(words), C, index, );
			if (i == numRepeat - 1) {
				msg += RoomDescription(C);
			}
		}
		else if (keyword == "push") {
			msg += CommandAttack(COPY(words), C, index, true);
			if (i == numRepeat - 1) {
				msg += RoomDescription(C);
			}
		}
		else if (keyword == "here") {
			msg += RoomDescription(C);
		}
		else if (keyword == "haircut") {
			msg += CommandHaircut(message.content.substring(1).split(" "), C);
		}
		else if (keyword == "leave") {
			msg += CommandLeave(C, index);
		}
		else if (keyword == "go" || keyword == "move" || keyword == "enter" || keyword == "travel" || keyword == "leave") {
			msg += CommandTravel(COPY(words), C, index);
			if (i == numRepeat - 1) {
				msg += RoomDescription(C);
			}
		}
		else if (keyword == "flee") {
			msg += CommandFlee(C, index);
		}
		else if (keyword == "trade") {
			msg += CommandTrade(COPY(words), C);
		}
		else if (keyword == "talk") {
			msg += CommandTalk(COPY(words), C);
		}
		else if (keyword == "accuracy") {
			let l_accuracy = Math.floor(100 * C.HITS[LEFT]/C.ATTEMPTS[LEFT])/100;
			let r_accuracy = Math.floor(100 * C.HITS[RIGHT]/C.ATTEMPTS[RIGHT])/100;
			msg += "*BLUE*Left Hand Accuracy: " + l_accuracy + "%\n";
			msg += "*BLUE*Right Hand Accuracy: " + r_accuracy + "%\n";
		}
		else if (keyword == "buy") {
			msg += CommandBuy(COPY(words), C);
		}
		else if (keyword == "sell") {
			msg += CommandSell(COPY(words), C);
		}
		else if (keyword == "take") {
			msg += CommandTake(COPY(words), C, index);
		}
		else if (keyword == "suicide") {
			C.HP = 0;
			C.ENDED = true;
			if (index > -1) {
				HandleCombat(battles[index]);
			}
			msg += "*RED*" + C.NAME + " is no more.";
			let location = findLocation(C.LOCAION);
			for (let i = 0; i < location.players; i++) {
				if (location.players[i].ID == C.ID) {
					location.players.splice(i, 1);
					break;
				}
			}
			data["town"].graves.push(new DeathReport(C.NAME, C.CLASS, C.LEVEL, C.DESCRIPTION));
			C = null;
		}
		else if (keyword == "inventory") {
			return Inventory(C);
		}
		else if (keyword == "character") {
			if (C) {
				return CharacterDescription(C);
			}
			else {
				C = new Character();
				msg += CommandCharacter(COPY(words), C, message.author.id);
			}
		}
		else if (keyword == "level") {
			if (C.SP <= 0) {
				return "*RED*You don't have any skill points!\n";
			}
			let index = stats.indexOf(words[1].toUpperCase());
			if (index == -1) {
				return "*RED*Stat not found '" + words[1] + "'\n";
			}
			C.STATS[index]++;
			C.SP--;
			if (index == VIT) {
				C.HP += 10;
			}
			if (index == END) {
				C.STAMINA += 15;
			}
			msg += "*GREEN*You level up your " + stats[index] + " stat to " + C.STATS[index] + "!\n";
		}
		else if (keyword == "read") {
			msg += CommandRead(COPY(words), C);
		}
		else if (keyword == "spells") {
			msg += CommandSpells(C);
		}
		else if (keyword == "drink") {
			msg += CommandDrink(COPY(words), C);
		}
		else if (keyword == "classes") {
			msg += "*PINK*Peasant*GREY* - *CYAN*+2 END +2 VIT*GREY*. Starts with a club but *RED*no gold*GREY*.\n\n";
			msg += "*BLUE*Mage*GREY* - *CYAN*+2 MAG*GREY*. Starts with a spellbook and a simple spell but *RED*no gold*GREY*.\n\n";
			msg += "*PINK*Noble*GREY* - Starts with *YELLOW*150 gold*GREY*, a stylish shirt, and a scimitar. A *GREEN*loyal servant*GREY* follows you into battle.\n\n";
			msg += "*BLUE*Rogue*GREY* - *CYAN*+2 AVD*GREY*. Starts with *YELLOW*40 gold*GREY*, a cloak, and two daggers. Whenever you dodge an attack, deal 6 damage to your attacker.\n\n";
			msg += "*PINK*Warrior*GREY* - *CYAN*+1 VIT +1 DEX +2 Armor*GREY*. Starts with *YELLOW*25 gold*GREY*, a Leather Cuirass, a Hatchet, and a Buckler.\n\n";
			msg += "*BLUE*Ranger*GREY* - *CYAN*+1 WEP +1 AVD*GREY*. Start with *YELLOW*25 gold*GREY* and a ranged weapon. Your attacks *CYAN*mark enemies*GREY*, increasing damage you deal to them.\n\n";
		}
		else if (keyword == "effects") {
			msg += WriteEffects(C);
		}
		else if (keyword == "stop") {
			C.TRADING = "";
			msg += RoomDescription(C);
		}
		else if (keyword == "play") {
			if (data["town"].prosperity > 2500) {
				if (C) {
					return "*RED*You already have a character! Retire or kill yourself first . . .\n";
				}
				if (words[1] == "as") {
					for (let i = 0; i < data["town"].retired.length; i++) {
						let hero = data["town"].retired[i];
						if (hero.NAME.toLowerCase() == words[2]) {
							C = hero;
							msg += "*GREEN*The mighty hero " + C.NAME + " returns from retirement. . .\n\n";
							data["town"].retired.splice(i, 1);
							break;
						}
					}
					if (!C) {
						return "*RED*Couldn't find hero '" + words[2] + "' in Guild Hall.\n";
					}
				}
				msg += CharacterDescription(C);
			}
			else { 
				return "*RED*The town needs more prosperity to access the guild hall . . .\n";
			}
		}
		else if (keyword == "retire") {
			if (C.LEVEL >= 3) {
				msg += "*YELLOW*You retire to live in the Guild Hall on the Stony Island. . .\n";
				data["town"].retired.push(C);
				C = null;
			}
			else {
				return "*RED*You haven't accomplished enough to retire! You need to be at least level 3.\n";
			}
		}
		else if (keyword == "sleep" || keyword == "rest" || keyword == "heal") {
			if (C.HP == MaxHP(C)) {
				return "*RED*You're already full HP."
			}
			if (C.BUILDING.toLowerCase() == "tavern") {
				if (C.GOLD >= 5) {
					msg += "*GREEN*You pay 5 gold to sleep at the tavern.";
					C.GOLD -= 5;
					data["town"].prosperity += 5;
					C.HP = MaxHP(C);
				}
				else {
					msg += "*RED*You can't afford to rent a room here!";
				}
			}
			else {
				return "*RED*You have to be at the tavern to sleep.";
			}
		}
		else if (keyword == "town") {
			let prosperity = data["town"].prosperity;
			msg += "*YELLOW*Town Prosperity: " + prosperity + "\n\n";
			msg += "*YELLOW*Town Locations\n";
			for (let k = 0; k < 2; k++) {
				for (let i = 0; i < locations.length; i++) {
					if ((k == 0 && !locations[i].dungeon) || (k == 1 && locations[i].dungeon)) {
						let color = "*BLUE*";
						if (k == 1) {
							color = "*RED*";
						}
						msg += color + locations[i].id;
						if (locations[i].prosperity > prosperity) {
							msg += "*GREY* - *RED*" + locations[i].prosperity;
						}
						msg += "\n";
						for (let j = 0; j < locations[i].buildings.length; j++) {
							msg += "*GREY* - *GREEN*" + locations[i].buildings[j].id;
							if (locations[i].buildings[j].prosperity > prosperity) {
								msg += "*GREY* - *RED*" + locations[i].buildings[j].prosperity;
							}
							msg += "\n";
						}
					}
				}
				if (k == 0) {
					msg += "\n*YELLOW*Dangerous Areas\n*RED*";
				}
			}
			msg += "\n";
		}
		else if (keyword == "cheat") {
			if (message.author.id == "462829989465948180") {
				if (words[1].toLowerCase() == "gold") {
					let amount = COPY(words).slice(2, COPY(words).length).join(" ");
					let value = parseInt(amount);
					C.GOLD = value;
					return "*GREEN*Gold set to " + amount + ".\n";
				}
				else {
					let item = COPY(words).slice(1, COPY(words).length).join(" ");
					for (let i = 0; i < items.length; i++) {
						if (items[i].name.toLowerCase() == item.toLowerCase()) {
							if (CanTake(C, items[i])) {
								takeItem(C, items[i]);
								return "*GREEN*You acquire " + an(items[i].name) + " " + items[i].name + "!\n";
							}
							else {
								return "*RED*No inventory space.\n";
							}
						}
					}
					return "*RED*Item not found " + item + "!\n";
				}
			}
			else {
				return "*RED*You wish.\n";
			}
		}
		else if (keyword == "fish") {
			msg += CommandFish(C, message);
		}
		else if (keyword == "reel") {
			msg += CommandReel(C, message);
		}
		else {
			return "*RED*Command '" + keyword + "' not found!";
		}
	}
	data[message.author.id].CHARACTER = C;
	return msg;
}

initRunes();
initItems();
initSpells();
initEnemies();
initLocations();
