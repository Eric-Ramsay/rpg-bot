const { Client, GatewayIntentBits, ActivityType, Events, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: [
    Partials.Channel,
    Partials.Message
  ] });
const fs = require('fs');

eval(fs.readFileSync('models.js') + '');
eval(fs.readFileSync('init.js') + '');
eval(fs.readFileSync('helpers.js') + '');
eval(fs.readFileSync('dialogue.js') + '');
eval(fs.readFileSync('commands.js') + '');
eval(fs.readFileSync('AI.js') + '');
eval(fs.readFileSync('battle.js') + '');
eval(fs.readFileSync('tests.js') + '');
eval(fs.readFileSync('login.js') + '');

var data = require('./data.json');

var queue = [];
var processing = false;

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
const TRUE_DAMAGE = 2;

var classes = ["peasant", "rogue", "noble", "warrior", "ranger", "mage", "sorcerer", "witch", "monk", "duelist", "merchant"];
var stats = ["VIT", "MAG", "END", "WEP", "DEX", "AVD"];

var effects = [];
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

var zoneLoot = []
var genericLoot = [];

function COPY(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function SaveState() {
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
	if (C.TYPE != "player") {
		return false;
	}
	for (let i = 0; i < C.INVENTORY.length; i++) {
		if (C.INVENTORY[i].equipped && C.INVENTORY[i].name.toLowerCase() == item.toLowerCase()) {
			return true;
		}
	}
	return false;
}
function Mitigate(attacker, target, dmg, pen = 0, type = 0, canDodge = true) {
	if (target.TYPE == "player") {
		let dodgeChance = 5 * Math.min(10, target.STATS[AVD]);
		if (hasRune(target, "reflex")) {
			dodgeChance += 10;
		}
		if (type == 2) {
			dodgeChance = 0;
		}
		let ran = rand(100);
		if (hasEffect(target, "stunned")) {
			canDodge = false;
		}
		if (canDodge && ran < dodgeChance) {
			return 0;
		}
		if (isEquipped(target, "shield")) {
			ran = rand(100);
			if (ran <= 40) {
				return -1;
			}
		}
		else if (isEquipped(target, "eel shield")) {
			ran = rand(100);
			if (ran <= 20) {
				return -1;
			}
		}
		else if (isEquipped(target, "buckler")) {
			if (ran <= 20) {
				return -1;
			}
		}
		else if (isEquipped(target, "spiked shield")) {
			if (ran <= 20) {
				return -1;
			}
		}
	}
	else if (target.NAME == "Brigand Lord") {
		let ran = rand(100);
		if (ran < 50) {
			return 0;
		}
	}
	else if (target.NAME == "Brigand") {
		let ran = rand(100);
		if (ran < 35) {
			return 0;
		}
	}
	let armor = 0;
	if (type == PHYSICAL) {
		armor = P_Armor(target);
	}
	else if (type == MAGICAL) {
		armor = M_Armor(target);
	}
	else {
		armor = 0;
	}
	if (hasRune(target, "bold") && (type == PHYSICAL || type == MAGICAL)) {
		armor += 4;
	}
	let damage = Math.max(Math.floor(dmg * pen/100), Math.round(dmg - armor));
	if (damage < 1) {
		return 1;
	}
	return damage;
}

function TurnIntoCrab(C, allies, enemies) {
	let msg = "";
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].NAME == "Carcinos") {
			msg += "*CYAN*Carcinos transforms " + Name(C) + " into a crab!\n";
			let ran = rand(4);
			let crab = summon("Reef Crab", C.ROW);
			if (ran == 0) {
				crab = summon("Stone Crab", C.ROW)
			}
			crab.MaxHP = Math.min(crab.MaxHP, C.MaxHP);
			crab.HP = crab.MaxHP;
			allies.push(crab);
			return msg;
		}
	}
	return "";
}

function deathCry(C, allies, enemies) {
	let msg = "";
	if (C.HP <= 0) { //Death
		if (C.TYPE == "player") {
			msg += "*CYAN*" + C.NAME + " has been struck down. . .\n";
		}
		else if (C.NAME == "Crazed Wolf") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " whimpers and dies.\n";
		}
		else if (C.NAME == "Bronze Bellbeast") {
			msg += "*YELLOW*There's a terrible clatter as the Bronze Bellbeast falls to the ground!\n";
			for (let i = 0; i < enemies.length; i++) {
				msg += DealDamage(new T_Attack(8 + rand(8)), allies, C, enemies, enemies[i])[0];
			}
		}
		else if (C.NAME == "Swamp Ape") {
			msg += "*YELLOW*The light fades from " + Name(C) + "'s eyes.\n";
		}
		else if (C.NAME == "Water Elemental") {
			msg += "*YELLOW*The Water Elemental bursts into rising steam!\n";
		}
		else if (C.NAME == "Raging Boar") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " lets out one final, pained snort before it falls heavily to the dirt.\n";
		}
		else if (C.NAME == "Wild Bear") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " falls dead to the ground.\n";
		}
		else if (C.NAME == "Toxic Mushroom") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " bursts into a cloud of *YELLOW*Living Spores*GREY*!\n";
			let num = 2 + rand(4);
			for (let i = 0; i < num; i++) {
				allies.push(summon("Living Spore", C.ROW));
			}
		}
		else if (C.NAME == "Lost Mariner") {
			let ran = rand(3);
			if (ran == 0) {
				msg += "*GREEN*The Parasitic Barnacles fall away from the old mariner, and his sanity returns!\n";
				enemies.push(summon("Mariner", C.ROW));
			}
			else {
				msg += "*YELLOW*The lost mariner seems to smile as he dies.\n";
			}
		}
		else if (C.NAME == "Squelcher") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " lets out a shaky squeal as it dies.\n";
		}
		else if (C.NAME == "Scoundrel") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " cries out for mercy before they die.\n";
		}
		else if (C.NAME == "Deep Horror") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " bursts into a blob of ruptured flesh as its pressure field collapses!\n";
		}
		else if (C.NAME == "Slimelord") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " splits into several *YELLOW*Acidic Slimes!\n";
			let num = 3 + rand(4);
			for (let i = 0; i < num; i++) {
				let slime = summon("Acidic Slime", C.ROW);
				slime.ROW = C.ROW;
				allies.push(slime);
			}
		}
		else if (C.NAME == "Seated Figure") {
			msg += "\n*YELLOW*Time seems to stop, as all falls silent. Angered Briar Monsters writhe out of the ground. A slender figure rises from the throne, and stretches.\n\n*CYAN*Everything is paralyzed, as if asleep, by the sheer energy unleashed. . .\n";
			for (let i = 0; i < 5; i++) {
				allies.push(summon("Briar Monster", 4));
			}
			let numPlayers = 0;
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].TYPE == "player") {
					numPlayers++;
				}
				AddEffect(enemies[i], "stunned", 3);
				AddEffect(enemies[i], "cursed", 3);
			}
			for (let i = 0; i < allies.length; i++) {
				AddEffect(allies[i], "stunned", 3);
				AddEffect(allies[i], "cursed", 3);
			}
			C.NAME = "Beautiful Woman";
			C.PHASE = 0;
			C.HP = 500 + numPlayers * 75;
			C.MaxHP = 500 + numPlayers * 75;
			C.EFFECTS = [];
		}
		else if (C.NAME == "Beautiful Woman") {
			if (C.PHASE < 7) {
				msg += "\n*YELLOW*The Beautiful Woman's eyes widen in fear as she reforms her broken body!\n";
				for (let i = 0; i < enemies.length; i++) {
					AddEffect(enemies[i], "stunned", 1);
					AddEffect(enemies[i], "cursed", 1);
				}
				C.PHASE = 9;
				C.HP = MaxHP(C);
			}
			else {
				let numPlayers = 0;
				msg += "*YELLOW*Beautiful Woman: *GREY*What have you done to me. . . *RED*My beautiful flesh*GREY*. . .\n\n";
				msg += "*GREY*The woman’s hair and skin begin to sag, and then to melt away in fat bloody drops that hiss and burst into black mist in the dirt. She screams - shrill rasps of agony as she writhes on the ground, and all the while the dark steam spreads through the palace, until it’s as black as midnight around you.\n\nAt last there is silence, as the darkness swirls and thins. The sun hangs choked in the western sky, shining like pale moonlight on the terrible figure that stands facing  you. Its lidless eyes glow in the dim light, fixed above a toothless smile. . .\n";
				C.NAME = "Elder Succubus";
				for (let i = 0; i < enemies.length; i++) {
					if (enemies[i].TYPE == "player") {
						numPlayers++;
					}
					AddEffect(enemies[i], "stunned", 3);
					AddEffect(enemies[i], "cursed", 3);
				}
				C.HP = 250 + numPlayers * 25;
				C.MaxHP = 250 + numPlayers * 25;
				C.ARMOR = [500, 100];
				C.PHASE = 0;
				C.EFFECTS = [];
			}
		}
		else if (C.NAME == "Elder Sucubus") {
			msg += "*YELLOW*When the elder succubus dies she merely crumples and collapses to the ground, as if she was never for a moment aware that her long life was at its end. Her cursed flesh dissolves into a thick black goop that steams as it touches the dirt.\n\n*CYAN*At once, it's as if a fog has lifted from this land, though the woods still seem the same, you can hear birds beginning to sing in the distance.\n";
		}
		else if (C.NAME == "Egg Sac") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " bursts open, and Baby Spiders swarm out of it!\n";
			let num = 3 + rand(4);
			for (let i = 0; i < num; i++) {
				let slime = summon("Baby Spider", C.ROW);
				slime.ROW = C.ROW;
				allies.push(slime);
			}
		}
		else if (C.NAME == "Fae Trickster") {
			let ran = 1 + rand(10);
			if (ran < 9) {
				C.HP = C.MaxHP;
				C.ROW = rand(5);
				msg += "*CYAN*" + Prettify(Name(C)) + " vanishes and re-appears!\n";
			}
			else {
				msg += "*YELLOW*" + Prettify(Name(C)) + " dissipates into smoke. . .\n";
			}
		}
		else if (C.TYPE == "Familiar") {
			msg += "*BLUE*" + P(Name(C)) + " fades away to nothingness. . .\n";
		}
		else if (C.NAME == "Treasure Chest") {
			msg += "*YELLOW*The lock on the treasure chest breaks.\n";
		}
		else if (C.TYPE == "construction") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " has been destroyed!\n";
		}
		else {
			msg += "*YELLOW*" + Prettify(Name(C)) + " has been slain!\n";
		}
		if (C.TYPE == "player" || !(C.NAME.toLowerCase().includes("crab"))) {
			let crabbed = TurnIntoCrab(C, allies, enemies);
			if (crabbed == "") {
				crabbed = TurnIntoCrab(C, allies, allies);
			}
			msg += crabbed;
		}
		let numWorms = 0;
		if (C.TYPE != "player" && C.ZONES.indexOf(3) > 0 && C.TYPE != "construction") {
			numWorms = 2 * (Math.max(0, rand(15) - 11));
		}
		numWorms += countEffect(C, "infested")
		if (numWorms > 0) {
			msg += "*RED*Anchorite Worms*GREY* flee their dying host!\n";
			for (let i = 0; i < numWorms; i++) {
				allies.push(summon("Anchorite Worm", C.ROW));
			}
		}
		for (let i = 0; i < allies.length; i++) {
			if (hasEffect(allies[i], "compensation")) {
				msg += Heal(allies[i], 8);
			}				
		}
	}
	for (let i = 0; i < enemies.length; i++) {
		if (isEquipped(enemies[i], "rotten staff")) {
			for (let j = 0; j < allies.length; j++) {
				msg += DealDamage(new T_Attack(4), enemies, enemies[i], allies, allies[j])[0];
			}
		}
	}
	return msg + "\n";
}

function Deliver(target) {
	let msg = "";
	if (target.HP <= 0) {
		let deliverance = hasEffect(target, "deliverance");
		if (deliverance) {
			msg += "*YELLOW*" + Prettify(Name(target)) + " is delivered from harm!\n";
			target.HP = 1;
			RemoveEffect(target, "deliverance");
		}
	}
	return msg;
}

function DealDamage(attack, attackers, attacker, targets, target, canReflect = true) {
	let msg = "";
	if (target.HP <= 0) {
		target.HP = 0;
		return [msg, -2];
	}
	let damage = attack.damage;
	if (damage == 0 || hasEffect(target, "invincible")) {
		return ["*BLUE*" + Prettify(Name(target)) + " is unharmed!\n", -3];
	}
	let isPlayer = (target.TYPE == "player");
	let aName = Prettify(Name(attacker));
	let tName = Prettify(Name(target));
	
	//Redirect all Magical Damage to the Warded Totem
	if (attack.type == MAGICAL && target.NAME != "Warded Totem") {
		for (let i = 0; i < targets.length; i++) {
			if (targets[i].NAME == "Warded Totem") {
				return DealDamage(attack, attackers, attacker, targets, targets[i]);
			}
		}
	}
	if (target.TYPE == "construction" && target.NAME != "Warding Shield" && target.NAME != "Warded Totem") {
		for (let i = 0; i < targets.length; i++) {
			if (target.ROW == targets[i].ROW && targets[i].NAME == "Warding Shield") {
				return DealDamage(attack, attackers, attacker, targets, targets[i]);
			}
		}
	}
	for (let i = 0; i < targets.length; i++) {
		for (const effect of targets[i].EFFECTS) {
			if (effect.name.toLowerCase() == "guarding" && effect.target.ID == target.ID) {
				let result = DealDamage(attack, attackers, attacker, targets, targets[i]);
				result[0] = "*CYAN*" + Prettify(Name(target)) + " is guarded by " + Name(targets[i]) + "!\n" + result[0];
				return result;
			}
		}
	}
	
	if (attack.type == PHYSICAL) {
		if (hasEffect(attacker, "stronger")) {
			damage += 3;
		}
		if (hasEffect(attacker, "enraged")) {
			damage *= 1.5;
		}
		if (hasEffect(attacker, "destructive synergy")) {
			damage += numBuffs(attacker);
		}
	}
	if (isEquipped(attacker, "Drowned Armor")) {
		damage *= 1.25;
	}
	if (hasEffect(attacker, "weakened")) {
		damage *= .75;
	}
	if (hasEffect(attacker, "disorganized")) {
		damage *= .8;
	}
	if (hasEffect(target, "disorganized")) {
		damage *= 1.2;
	}
	if (hasEffect(target, "whipped")) {
		damage *= 1.15;
	}
	if (hasEffect(target, "vulnerable")) {
		damage *= 1.2;
	}
	if (hasEffect(target, "resilient")) {
		damage *= .5;
	}
	if (hasRune(attacker, "berserk")) {
		let num = 10 - Math.floor(10 * attacker.HP/MaxHP(attacker));
		damage *= 1 + (num/20);
	}
	
	damage = Mitigate(attacker, target, damage, attack.pen, attack.type, canReflect);
	
	let chance = rand(100);
	if (chance > attack.hitChance) {
		damage = -2;
		msg += "*RED*" + aName + " misses!\n";
	}
	
	if (canReflect && hasEffect(attacker, "blinded")) {
		let chance = rand(101);
		if (chance < 35) {
			damage = -2;
			msg = "*RED*" + aName + " is blinded and misses!\n";
		}
	}
	
	if (damage > 0 && target.BRACING && attack.type != TRUE_DAMAGE) {
		target.BRACING = false;
		let chance = rand(100);
		if (chance < 50) {
			damage = 0;
			msg = "*GREEN*" + tName + " jumps out of harm's way!\n";
		}
	}
	
	if (damage > 0) {
		if (isEquipped(target, "eel shield")) {
			msg += AddEffect(target, "static", 999, null, null, 3);
		}
		if (hasRune(attacker, "cascade")) {
			damage += 2;
		}
		if (hasRune(attacker, "pacifist")) {
			damage *= 2;
		}
		
		let shock = hasEffect(target, "static");
		if (shock) {
			RemoveEffect(target, "static");
			RemoveEffect(target, "static");
		}
		if (hasEffect(target, "jade")) {
			damage = Math.min(damage, Math.floor(MaxHP(target) * .15));
		}
		//Reporting
		attacker.REPORT.damage += damage;
		target.REPORT.taken += damage;
		target.REPORT.mitigated += (attack.damage - damage);
		let HP = target.HP;
		target.HP -= damage;
		if (target.HP > 0 && target.NAME == "Ephemeral Warrior") {
			msg += Heal(target, damage * 2, true);
		}
		if (damage > 0 && hasRune(target, "honeycomb")) {
			targets.push(summon("swarm of bees", target.ROW));
			msg += "*GREEN*Bees emerge from out of the honeycomb!\n";
		}
		if (hasRune(target, "amber")) {
			msg += Heal(target, 2);
		}
		if (damage > 0) {
			msg += "*RED*" + tName + " takes " + damage + " damage!\n";
		}
		if (canReflect) {
			let rDamage = 0;
			if (hasRune(target, "reflect")) {
				rDamage = 5;
			}
			if (target.NAME == "Briar Beast" || hasEffect(target, "minor reflect")) {
				rDamage = 3;
			}
			if (target.NAME == "Briar Monster" || hasEffect(target, "greater reflect")) {
				rDamage = Math.max(Math.floor(damage/2), 5);
			}
			if (target.NAME == "Fumous Fiend") {
				if (Math.abs(attacker.ROW - target.ROW) < 2) {
					msg += "*RED*Toxic fumes rush out of " + tName + "'s wound!\n";
					msg += AddEffect(attacker, "Poison", 3, target);
				}
			}
			rDamage = Math.min(rDamage, HP/2);
			if (rDamage > 0) {
				msg += "*BLUE*" + tName + " reflects damage!\n";	
				msg += DealDamage(new M_Attack(rDamage), targets, target, attackers, attacker, false)[0];
			}
		}
	}
	else if (damage == 0) {
		msg += "*CYAN*" + tName + " dodges the damage!\n";
		if (target.CLASS == "rogue") {
			msg += DealDamage(new P_Attack(6), targets, target, attackers, attacker)[0];
		}
		if (hasRune(target, "reflex")) {
			msg += DealDamage(new M_Attack(6), targets, target, attackers, attacker)[0];
		}
	}
	else if (damage == -1) {
		msg += "*RED*" + tName + " blocks the damage!\n";	
	}
	msg += Deliver(target);
	if (target.HP <= 0) { //Death
		msg += deathCry(target, targets, attackers);
		attacker.REPORT.kills++;
	}
	return [msg, damage];
}

function PushTarget(C, target) {
	let msg = "";
	if (target.TYPE == "boss") {
		return msg;
	}
	let tName = Name(target);
	if (C.ROW <= target.ROW && target.ROW < 4) {
		msg += "*GREEN*" + tName + " is pushed right!\n";
		target.ROW++;
	} else if (C.ROW >= target.ROW && target.ROW > 0) {
		msg += "*GREEN*" + tName + " is pushed left!\n";
		target.ROW--;
	}
	return msg;
}

function CastMessage(text, index) {
	if (index > 0) {
		return "";
	}
	if (text[0] == "*") {
		return text + "\n";
	}
	return "*PINK*" + text + "\n";
}

function SpellDamage(attack, allies, C, targets, target) {
	let damage = attack.damage;
	if (hasRune(C, "charcoal")) {
		damage++;
	}
	if (hasRune(C, "heavy")) {
		damage += 4;
	}
	if (isEquipped(C, "staff")) {
		damage++;
	}
	if (hasEffect(C, "ferocity")) {
		damage += 2;
	}
	if (hasRune(C, "focus")) {
		damage *= 2;
	}
	if (hasEffect(C, "forthwith")) {
		damage *= 1.75;
	}
	if (hasRune(C, "pacifist")) {
		damage = 0;
	}
	attack.damage = damage;
	let result = DealDamage(attack, allies, C, targets, target);
	
	if (result[1] > 0) {
		if (isEquipped(C, "coral staff")) {
			result[0] += AddEffect(target, "bleed", 0, C);
		}
		if (isEquipped(C, "driftwood staff")) {
			result[0] += AddEffect(target, "poison", 1, C);
		}
		if (hasRune(C, "tar")) {
			result[0] += AddEffect(target, "Weakened", 1, C);
		}
		if (hasRune(C, "cinnabar")) {
			target.ARMOR[1] = Math.max(0, target.ARMOR[1] - 1);
		}	
	}
	
	return result;
}

function Cast(C, spell, allies, enemyList, targets) {
	let msg = "";
	let spellName = spell.name.toLowerCase();
	let APCost = spellAPCost(C, spell);
	let HPCost = spellHPCost(C, spell);
	if (C.CLASS != "sorcerer" && APCost > C.AP) {
		return "*RED*You don't have enough AP to cast this spell!\n";
	}
	if (C.CLASS == "sorcerer" && APCost > C.STAMINA) {
		return "*RED*You don't have enough stamina to cast this spell!\n";
	}		
	if (HPCost >= C.HP) {
		return "*RED*You don't have enough HP to cast this spell!\n";
	}
	if (spellName == "holy flame" && C.AP == 0) {
		return "*RED*You don't have any AP!\n";
	}
	if (hasRune(C, "spring")) {
		msg += Heal(C, 2);
	}
	RemoveEffect(C, "Coward's Haste");
	
	C.CASTS++;
	let refundChance = 0;
	if (hasRune(C, "ivory")) {
		refundChance += 20;
	}
	if (isEquipped(C, "scepter")) {
		refundChance += 20;
	}
	
	let chance = rand(100);
	if (chance >= refundChance) {
		if (C.CLASS == "sorcerer") {
			C.STAMINA -= APCost;
		}
		else {
			C.AP -= APCost;
		}
	}
	else if (spellAPCost(C, spell) > 0){
		let stat = "AP";
		if (C.CLASS == "sorcerer") {
			stat = "stamina";
		}
		msg += "*CYAN*The spell costs no " + stat + "!\n";
	}
	C.HP -= HPCost;
	C.REPORT.taken += spellHPCost(C, spell);
	
	let damage = C.REPORT.damage;
	
	let numCasts = 1;
	
	if (hasRune(C, "pearl")) {
		numCasts = 2;
	}
	
	for (let n = 0; n < numCasts; n++) {
		if (spellName == "gamble") {
			if (C.GOLD < 3) {
				return "*RED*You don't have enough gold!\n";
			}
			C.GOLD -= 3;
		}
		for (let t = 0; t <= targets.length; t++) {
			let index = null;
			if (targets.length > 0) {
				if (t == targets.length) {
					break;
				}
				else {
					index = targets[t];
				}
			}
			if (spellName == "arcane strike") { // Deal 9 Damage to a target.
				msg += CastMessage("A pin of radiant light streaks towards your foe!", t + n);
				msg += SpellDamage(new M_Attack(8), allies, C, enemyList, enemyList[index])[0];
			}
			else if (spellName == "swamp strike") {
				msg += CastMessage("A toxic blast poisons your foe!", t + n);
				let dmg = 3 + rand(4);
				msg += SpellDamage(new M_Attack(dmg), allies, C, enemyList, enemyList[index])[0];
				AddEffect(enemyList[index], "Poison", 3, C, null, dmg);
			}
			else if (spellName == "spear") { // Deal 12-20 Damage to an enemy on your row.
				msg += CastMessage("A crude spear of jagged stone bursts out from the ground!", t + n);
				msg += SpellDamage(new M_Attack(10 + rand(7)), allies, C, enemyList, enemyList[index])[0];
			}
			else if (spellName == "siphon") { //Deal 4-8 Damage and Heal 4 HP
				msg += CastMessage("You siphon health away from your foe!", t + n);
				msg += SpellDamage(new M_Attack(4 + rand(5)), allies, C, enemyList, enemyList[index])[0];
				msg += SpellHeal(allies, C, C, 4);
			}
			else if (spellName == "pierce") { //Deal 4 True Damage to an enemy
				msg += CastMessage("A sharpened bolt of energy strikes through your foe.", t + n);
				msg += SpellDamage(new M_Attack(4, 100), allies, C, enemyList, enemyList[index])[0];
			}
			else if (spellName == "hemic strike") { //Lose 5 HP. Deal 14-18 Damage to an enemy
				msg += CastMessage("Beads of blood draw themselves from your palm, forming the sillhouette of your target", t + n);
				msg += SpellDamage(new M_Attack(12 + rand(7)), allies, C, enemyList, enemyList[index])[0];
			}
			else if (spellName == "lightning") { //Deal 2 damage. Gain 1 static
				msg += CastMessage("A crescent of thin, shimmering lightning arcs towards your foe!", t + n);
				msg += SpellDamage(new M_Attack(2), allies, C, enemyList, enemyList[index])[0];
				msg += AddEffect(C, "static", 999);
				//AddEffect(C, "Lightning", 0);
			}
			else if (spellName == "meditation") { //Gain 8 Stamina
				msg += CastMessage("You rest for a moment, and feel at peace.", t + n);
				C.STAMINA = Math.min(MaxStamina(C), C.STAMINA + 9);
			}
			else if (spellName == "blink") { //Teleport to a targetted row
				if (C.ROW == index) {
					return "*RED*You're already on that row.";
				}
				msg += CastMessage("You flicker, and in an instant you're standing in R" + (index + 1) + ".", t + n);
				C.ROW = index;
			}
			else if (spellName == "stoneskin") { //+8 Physical Armor +4 Magical Armor for 3 turns
				msg += CastMessage("Your skin numbs slightly as it becomes as sturdy as stone.", t + n);
				msg += AddEffect(C, "Stoneskin", 3);
			}
			else if (spellName == "preparation") { //Gain 4 AP a turn. Lasts 3 turns
				msg += CastMessage("A moment of sheer lucidity washes over you, and time seems to slow.", t + n);
				msg += AddEffect(C, "Preparation", 3);
			}
			else if (spellName == "ferocity") { //Your damaging spells do +2 DMG per instance this turn
				msg += CastMessage("Your thoughts are dulled by a lust for blood, and your senses seem to sharpen.", t + n);
				msg += AddEffect(C, "Ferocity", 0);
			}
			else if (spellName == "roots") { //Root yourself for 3 turns. Heal 5 HP per turn for 3 turns
				msg += CastMessage("Roots extend from your flesh into the ground, and precious life flows begins to flow into you.", t + n);
				msg += AddEffect(C, "Regenerative", 3);
				msg += AddEffect(C, "rooted", 3);
			}
			else if (spellName == "feed flame") { //Gain 1 embers buff. Deal damage equal to the amount of embers you have. embers reduces your HP by 1 per turn
				msg += CastMessage("*YELLOW*A warm ember begins to burns in your soul.", t + n);
				AddEffect(C, "Ember", 999);
				msg += SpellDamage(new M_Attack(countEffect(C, "ember")), allies, C, enemyList, enemyList[index])[0];
			}
			else if (spellName == "ignite") { //For each Ember buff you have, lose 2 HP and deal damage equal to half your total number of Ember buffs
				let embers = countEffect(C, "ember");
				if (embers == 0) {
					return "*RED*You need embers to ignite. . .\n";
				}
				if (C.HP <= embers) {
					return "*RED*You don't have enough HP to ignite your embers. . .\n";
				}
				msg += CastMessage("*YELLOW*You ignite the potential within your soul into a burst of pure power.", t + n);
				C.HP -= embers;
				C.REPORT.taken += embers;
				for (let i = 0; i < embers; i++) {
					if (enemyList[index].HP > 0) {
						msg += SpellDamage(new M_Attack(Math.floor(embers/2)), allies, C, enemyList, enemyList[index])[0];
					}
				}
				RemoveEffect(C, "ember", true);
			}
			else if (spellName == "summon beast") { //Lose 15 HP. Summon a random animal
				let animals = [];
				for (let i = 0; i < enemies.length; i++) {
					if (enemies[i].TYPE == "animal") {
						animals.push(enemies[i]);
					}
				}
				let animal = animals[rand(animals.length)];
				let name = animal.NAME;
				msg += CastMessage(Prettify(an(name) + " " + name) + " is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon(name, index, true, 4));
			}
			else if (spellName == "summon bees") {
				msg += CastMessage("A Swarm of Bees is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon("Swarm of Bees", index, true, 4));
			}
			else if (spellName == "endure") {
				msg += CastMessage("You calm yourself, and maintaining this state of being.", t + n);
				for (let i = 0; i < C.EFFECTS.length; i++) {
					if (C.EFFECTS[i].type == "buff") {
						C.EFFECTS[i].duration++;
					}
				}
			}
			else if (spellName == "maintain") {
				msg += CastMessage("You focus your energy into maintaining your creation.", t + n);
				if (hasEffect(allies[index], "fading")) {
					msg += AddEffect(allies[index], "Fading", 4);
				}
				else {
					return "*RED*You must select a target that is already Fading!\n";
				}
			}
			else if (spellName == "summon zombie") {
				msg += CastMessage("A Zombie is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon("Zombie", index, true, 4));
			}
			else if (spellName == "summon specter") {
				msg += CastMessage("An Apparition is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon("Apparition", index, true, 4));
			}
			else if (spellName == "summon spores") {
				let num = 3 + rand(3);
				msg += CastMessage(num + " Spores are summoned on R" + (index + 1) + "!", t + n);
				for (let i = 0; i < num; i++) {
					allies.push(summon("Living Spore", index, true, 4));
				}
			}
			else if (spellName == "summon anemone") {
				msg += CastMessage("A Giant Anemone is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon("Giant Anemone", index, true, 4));
			}
			else if (spellName == "summon coral") {
				msg += CastMessage("A Coral Shard is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon("Coral Shard", index, true, 4));
			}
			else if (spellName == "summon warrior") {
				let summons = ["Skeletal Swordsman", "Goblin Spearman", "Goblin Swordsman", "Fishman Tridentier", "Skeletal Spearman"];
				let ran = rand(summons.length);
				msg += CastMessage("A " + summons[ran] + " is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon(summons[ran], index, true, 4));
			}
			else if (spellName == "summon archer") {
				let summons = ["Skeletal Archer", "Goblin Archer", "Fishman Archer"];
				let ran = rand(summons.length);
				msg += CastMessage("A " + summons[ran] + " is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon(summons[ran], index, true, 4));
			}
			else if (spellName == "summon mushroom") {
				msg += CastMessage("A Toxic Mushroom is summoned on R" + (index + 1) + "!", t + n);
				allies.push(summon("Toxic Mushroom", index, true, 4));
			}
			else if (spellName == "empower") { //Your summoned creatures deal +3 Damage per attack for 3 turns
				msg += CastMessage("Your allies grow stronger!", t + n);
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].SUMMONED) {
						msg += AddEffect(allies[i], "Stronger", 3);
					}
				}
			}
			else if (spellName == "shepherd") { //Heal your summoned creatures 4-8 HP
				msg += CastMessage("Your allies are healed!", t + n);
				let autumn = true;
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].SUMMONED) {
						msg += SpellHeal(allies, C, allies[i], 4 + rand(5), autumn);
						autumn = false;
					}
				}
			}
			else if (spellName == "compensation") { //Heal 8 HP when an ally is killed. 999 Turns
				msg += CastMessage("A bond of blood forms between you and your allies.", t + n);
				msg += AddEffect(C, "Compensation", 999);
			}
			else if (spellName == "redirection") { //Transfer your debuffs to a target
				msg += CastMessage("You redirect your afflictions onto your foe!", t + n);
				let newEffects = [];
				if (hasEffect(allies[index], "cursed")) {
					return "*RED*Your curse is too powerful to be redirected!\n";
				}
				for (const effect of C.EFFECTS) {
					if (effect.type == "debuff") {
						msg += AddEffect(enemyList[index], effect.name, 3, C, effect.target, effect.stacks);
					}
					else {
						newEffects.push(effect);
					}
				}
				C.EFFECTS = newEffects;
			}
			else if (spellName == "peel") { //Reduce a target's Physical & Magical Armor by 1
				msg += CastMessage("You peel away the defenses of the " + enemyList[index].NAME + "!", t + n);
				enemyList[index].ARMOR[0] = Math.max(0, enemyList[index].ARMOR[0] - 1);
				enemyList[index].ARMOR[1] = Math.max(0, enemyList[index].ARMOR[1] - 1);
			}
			else if (spellName == "expose") { //Increase the damage taken by a target by 20% for 1 turn
				msg += CastMessage("Light shines upon your foe, revealing their inadequacies.", t + n);
				msg += AddEffect(enemyList[index], "Vulnerable", 1, C);
			}
			else if (spellName == "bind") { //Root a target for 3 turns
				msg += CastMessage("You bind " + Name(enemyList[index]) + " where they stand.", t + n);
				msg += AddEffect(enemyList[index], "Rooted", 3, C);
			}
			else if (spellName == "envenom") { //Inflict 4 turns of venom onto a target
				msg += CastMessage("You envenom the " + enemyList[index].NAME + "!", t + n);
				msg += AddEffect(enemyList[index], "Venom", 4, C);
			}
			else if (spellName == "gale") { //Push a row of enemyList back one row
				msg += CastMessage("The wind picks up and howls!", t + n);
				for (let i = 0; i < enemyList.length; i++) {
					if (enemyList[i].ROW == index) {
						msg += PushTarget(C, enemyList[i]);
					}
				}
			}
			else if (spellName == "disperse") { //Teleport every enemy on your row to a random row, at least 2 rows away from you
				msg += CastMessage("You disperse the foes around you!", t + n);
				for (let i = 0; i < enemyList.length; i++) {
					if (enemyList[i].ROW == C.ROW) {
						while (Math.abs(C.ROW - enemyList[i].ROW) < 2) {
							enemyList[i].ROW = rand(5);
						}
						msg += Prettify(Name(enemyList[i])) + " is teleported to R" + (enemyList[i].ROW+1) + "!\n";
					}
				}
			}
			else if (spellName == "freeze") { //Deal 2-4 damage to a target. Has an 80% chance to stun
				let chance = rand(100);
				msg += CastMessage("*BLUE*" + Prettify(Name(enemyList[index])) + " is encased in a layer of ice!", t + n);
				msg += SpellDamage(new M_Attack(2 + rand(3)), allies, C, enemyList, enemyList[index])[0];
				msg += AddEffect(enemyList[index], "Stunned", 1, C);
			}
			else if (spellName == "wall of fire") { //Deal 3-6 Damage to every enemy in a row and Burn them
				msg += CastMessage("*YELLOW*A wall of shimmering flame ignites before you!", t + n);
				for (let i = 0; i < enemyList.length; i++) {
					if (enemyList[i].ROW == index) {
						msg += SpellDamage(new M_Attack(3 + rand(4)), allies, C, enemyList, enemyList[i])[0];
					}
				}
			}
			else if (spellName == "radiance") { //Deal 6-10 Damage to all enemyList on your row
				msg += CastMessage("Shimmering heat burns the enemies around you.", t + n);
				for (let i = 0; i < enemyList.length; i++) {
					if (enemyList[i].ROW == C.ROW) {
						msg += SpellDamage(new M_Attack(6 + rand(5)), allies, C, enemyList, enemyList[i])[0];
					}
				}
			}
			else if (spellName == "reap") { //Lose 10 HP. Deal 4-6 Damage to all enemyList, healing 1 HP per target
				msg += CastMessage("You harvest the life force of your foes.", t + n);
				let heal = 0;
				for (let i = 0; i < enemyList.length; i++) {
					msg += SpellDamage(new M_Attack(4 + rand(3)), allies, C, enemyList, enemyList[i])[0];
					heal++;
				}
				msg += SpellHeal(allies, C, C, heal);
			}
			else if (spellName == "holy flame") {
				msg += CastMessage("*YELLOW*Your foes are washed in holy fire!\n", t + n);
				for (let i = 0; i < enemyList.length; i++) {
					msg += SpellDamage(new M_Attack(Math.floor(APCost/2)), allies, C, enemyList, enemyList[i])[0];
				}
			}
			else if (spellName == "blizzard") { //Deal 2-4 damage to every enemy and slow them
				msg += CastMessage("*BLUE*A frigid mist envelops your foes.", t + n);
				for (let i = 0; i < enemyList.length; i++) {
					msg += SpellDamage(new M_Attack(2 + rand(3)), allies, C, enemyList, enemyList[i])[0];
					msg += AddEffect(enemyList[i], "Slowed", 1, C);
				}
			}
			else if (spellName == "gamble") {
				let ran = rand(21);
				if (ran == 0) {
					let gold = 40 + rand(41);
					C.GOLD += gold;
					msg += "*YELLOW*Jackpot! You've won " + gold + " gold!\n";
					for (let i = 0; i < enemyList.length; i++) {
						msg += SpellDamage(new M_Attack(12 + rand(9)), allies, C, enemyList, enemyList[i])[0];
					}
				}
				else {
					msg += CastMessage("Your gold dissolves into a beam of energy!\n", t + n);
					msg += SpellDamage(new M_Attack(10), allies, C, enemyList, enemyList[index])[0];
				}
			}
			else if (spellName == "sunbeams") { //Deal 2-12 damage to a random enemy in each row
				msg += CastMessage("*YELLOW*Scattered sunbeams shine down across the battlefield.", t + n);
				let rows = [[], [], [], [], []];
				for (let i = 0; i < enemyList.length; i++) {
					rows[enemyList[i].ROW].push(i);
				}
				for (let i = 0; i < rows.length; i++) {
					if (rows[i].length > 0) {
						let enemyIndex = rows[i][rand(rows[i].length)];
						msg += SpellDamage(new M_Attack(2 + rand(15)), allies, C, enemyList, enemyList[enemyIndex])[0];
					}
				}
			}
			else if (spellName == "exploit") { //Deal damage to every enemy per debuff they have
				msg += CastMessage("You prey upon the weaknesses of your enemies.", t + n);
				for (let i = 0; i < enemyList.length; i++) {
					let debuffs = numDebuffs(enemyList[i]);
					msg += SpellDamage(new M_Attack(3 * debuffs), allies, C, enemyList, enemyList[i])[0];
				}
			}
			else if (spellName == "protection") { //+2 Physical Armor +2 Magical Armor for your allies 3 turns
				msg += CastMessage("An aura of defense extends out of you onto your allies", t + n);
				for (let i = 0; i < allies.length; i++) {
					msg += AddEffect(allies[i], "Protection", 3);
				}
			}
			else if (spellName == "heal") { //Heal an ally 4-8 HP
				msg += CastMessage("You mend the wounds of your ally!", t + n);
				msg += SpellHeal(allies, C, allies[index], 4 + rand(3));
			}
			else if (spellName == "rally") { //All allies gain 5 Stamina
				msg += CastMessage("You encourage and energize your comrades.", t + n);
				for (let i = 0; i < allies.length; i++) {
					if (allies[i].TYPE == "player") {
						allies[i].STAMINA = Math.min(allies[i].STAMINA + 6, MaxStamina(allies[i]));
					}
				}
			}
			else if (spellName == "guidance") { //Heal all allies 3 HP
				msg += CastMessage("You stand as a shining beacon of resilience on the battlefield.", t + n);
				let autumn = true;
				for (let i = 0; i < allies.length; i++) {
					msg += SpellHeal(allies, C, allies[i], 3, autumn);
					autumn = false;
				}
			}
			else if (spellName == "transfer life") { //Lose 5 HP. Heal a target for 8-12 HP
				msg += CastMessage("The flesh around your ribs grows cold.", t + n);
				msg += SpellHeal(allies, C, allies[index], 8 + rand(3));
			}
			else if (spellName == "purify") { //Remove all debuffs from an ally
				if (hasEffect(allies[index], "cursed")) {
					return "*RED*The curse is too powerful to be purified!\n";
				}
				removeDebuffs(allies[index]);
				msg += CastMessage(allies[index].NAME + "'s afflictions are washed away.", t + n);
			}
			else if (spellName == "deliverance") { //Target an ally, making them unable to die for 1 turn
				if (hasEffect(allies[index], "fading")) {
					C.AP += spellAPCost(C, spell);
					C.HP += spellHPCost(C, spell);
					C.REPORT.taken -= spell.HP;
					return "*RED*You can't deliver summoned creatures!\n";
				}
				msg += CastMessage("A slight aura of golden light surrounds " + Name(allies[index]) + "!", t + n);
				msg += AddEffect(allies[index], "Deliverance", 1);
			}
			else {
				throw new Error("Spell not matched");
			}
		}
	}
	
	if (C.REPORT.damage > damage) {
		RemoveEffect(C, "forthwith");
	}
	
	return msg;
}

function P (string) {
	return Prettify(string);
}

function Prettify(string) {
	let arr = string.split(" ");
	for (let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
	}
	let val = arr.join(" ");
	return val;
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
	if (data["town"].quests.length < 3) {
		while (data["town"].quests.length < 3) {
			data["town"].quests.push(createQuest());
		}
		SaveState();
	}
	console.log("Connected as " + client.user.tag);
	client.user.setPresence({
	  activities: [{ name: "Slaying a Lich", type: ActivityType.Custom}]
	});

	if (true) {
		testSpells();
		//testMonsters();
	}
});

function PrintMessage(msg, channel) {
	let message = msg;
	if (msg == "") {
		return;
	}
	if (message.length > 2000) {
		let index = 1950;
		for (let i = 1950; i > 0; i--) {
			if (message[i] == '\n') {
				index = i;
				break;
			}
		}
		queue.push({channel: channel, message: message.substring(0, index) + "\`\`\`"});
		let newMessage = "\`\`\`ansi\n" + message.substring(index);
		PrintMessage(newMessage, channel);
	}
	else {
		queue.push({channel: channel, message: message});
	}
	
	if (!processing) {
		PrintQueue();
	}
}

function PrintQueue() {
	processing = true;
	
	while (queue.length > 0) {
		queue[0].channel.send(queue[0].message);
		queue.shift();
	}
	
	processing = false;
}

client.on('messageCreate', (rec) => {
	try {
		if (rec.author != client.user) {
			let id = rec.author.id;
			if (!data[id]) {
				data[id] = {
					CHARACTER: null
				}
			}
			if (!data[id].BANK) {
				data[id].BANK = [];
			}
			if (data[id].CHARACTER) {
				if (!data[id].CHARACTER.DISCORD_ID) {
					data[id].CHARACTER.DISCORD_ID = id;
				}
				for (let i = 0; i < data[id].CHARACTER.INVENTORY.length; i++) {
					let item = data[id].CHARACTER.INVENTORY[i];
					if (item.runes) {
						for (let j = 0; j < item.runes.length; j++) {
							let rune = item.runes[j];
							if (rune.value) {
								item.value += rune.value;
								item.runes[j] = rune.name;
							}
						}
					}
				}
				if (!data[id].CHARACTER.DIALOGUE) {
					data[id].CHARACTER.DIALOGUE = initDialogueHandler()
				}
				if (!data[id].CHARACTER.FISH) {
					data[id].CHARACTER.FISH = [];
					data[id].CHARACTER.FISH_REWARDS = [];
					data[id].CHARACTER.REWARDED = false;
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

function parseText(msg, tabReplace = true) {
	/*let lastColor = "GREY";
	let nextColor = "";
	let readingColor = false;
	let colorIndex = 0;
	let index = 0;
	let numDeletions = 0;
	for (const c of msg) {
		if (c == '*') {
			readingColor = !readingColor;
			if (!readingColor) {
				if (lastColor == nextColor) {
					//Erase the color designator, it wasn't needed.
					numDeletions++;
					msg = msg.substring(0, colorIndex) + msg.substring(colorIndex + nextColor.length + 2);
					index -= (nextColor.length + 2)
				}
				lastColor = nextColor;
			}
			else {
				colorIndex = index;
			}
			nextColor = "";
		}
		else if (readingColor)
		{
			nextColor += c;
		}
		index++;
	}
	console.log("Deleted " + numDeletions + " colors.");
	*/
	let text = msg;
	if (text.includes("*REPEAT*")) {
		text = text.split("*REPEAT*").join("");
	}
	else {
		text = SimplifyMessage(msg);
	}
	text = text.split("*GREY*").join("[2;0m");
	text = text.split("*BLACK*").join("[2;30m");
	text = text.split("*RED*").join("[2;31m");
	text = text.split("*GREEN*").join("[2;32m");
	text = text.split("*YELLOW*").join("[2;33m");
	text = text.split("*BLUE*").join("[2;34m");
	text = text.split("*PINK*").join("[2;35m");
	text = text.split("*CYAN*").join("[2;36m");
	text = text.split("*WHITE*").join("[2;37m");
	text = text.split("*GREY*").join("[2;0m");
	if (tabReplace) {
		text = text.split("    ").join("\t");
	}
	return "\`\`\`ansi\n" + text + "\`\`\`";
}

function ItemDescription(C, item) {
	let msg = "";
	let max = maxRunes(item);
	if (item.type == "weapon") {
		let wepChance = w_chance(C, item);
		let approx = "";
		if (hasWeaponRune(item, "reprise")) {
			let chance = 1 - (wepChance/100);
			chance *= chance;
			approx = "~";
			wepChance = Math.floor(100 * (1 - chance));
		}
		msg += "*RED*" + item.name + "*BLACK* | *CYAN*" + item.hands + "H*BLACK* | *PINK*" + approx + wepChance + "%*BLACK* | *YELLOW*" + item.value + "G*GREY*\n";
		msg += item.description+"\n\n";
		let mult = 1 + (.05 * C.STATS[WEP]);
		if (hasWeaponRune(item, "powerful")) {
			mult *= 1.2;
		}
		if (isEquipped(C, "Drowned Armor")) {
			mult *= 1.25;
		}
		if (hasWeaponRune(item, "lethality")) {
			mult *= 1.15;
		}
		if (hasWeaponRune(item, "decisive")) {
			mult *= 1.25;
		}
		if (C.CLASS == "duelist") {
			mult *= 1.15;
		}
		let multStr = "*GREEN* (x " + mult.toFixed(2) + ")";
		if (mult == 1) {
			multStr = "";
		}
		msg += "Deals *RED*" + w_min(C, item) + "-" + w_max(C, item) + " Damage" + multStr + "*GREY* to targets within *GREEN*" + w_range(C, item) + " range*GREY*, with *CYAN*" + w_pen(C, item) + "%*GREY* penetration; can be used *PINK*" + w_attacks(C, item) + "*GREY* times per turn at a cost of *GREEN*" + w_AP(C, item) + " AP*GREY* per attack.\n"
	}
	else if (item.type == "armor") {
		msg += "*RED*" + item.name + "*BLACK* | *CYAN*⛊*GREY*" + a_physical(C, item) + " *CYAN*✱*GREY*" + a_magical(C, item) + "*BLACK* | *YELLOW*" + item.value + "G*GREY*\n";
		msg += item.description+"\n\n";
		if (item.AP > 0) {
			msg += "*RED*Reduces*GREY* your *GREEN*AP*GREY* by *RED*" + item.AP
			if (C.CLASS != "warrior") {
				msg += " *GREY*and your *GREEN*Stamina*GREY* by *RED*" + item.AP * 5;
			}
			msg += "*GREY*!\n";
		}
	}
	else {
		msg += "*RED*" + item.name + "*BLACK* | ";
		if (item.type == "rune") {
			msg += "*CYAN*" + Prettify(item.target) + " Rune*BLACK* | ";
		}
		msg += "*YELLOW*" + item.value + "G*GREY*\n";
		msg += item.description + "\n";
	}
	if (max > 0) {
		msg += "*CYAN*Runes *BLACK*" + item.runes.length + "/" + max + "*GREY*\n";
		for (const rune of item.runes) {
			let description = "";
			for (let i = 0; i < items.length; i++) {
				if (items[i].name == rune) {
					description = items[i].description;
				}
			}
			msg += StackStrings("*RED*   " + rune, "*GREY* " + description, 15) + "\n";
		}
	}
	return msg;
}

function DrawBar(val, max, size, color, drawNum = true, braceColor = "*GREY*") {
	let str = braceColor + "[" + color;
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
	str += braceColor+ "]";
	if (drawNum) {
		return str + "*BLACK* " + val + "/" + max;
	}
	return str;
}

function DrawStats(C) {
	let msg = "";
	let colors = ["*BLACK*", "*GREY*", "*GREEN*", "*YELLOW*", "*BLUE*"];
	
	for (let i = 0; i < 6; i++) {
		let color = colors[Math.min(4, Math.ceil(C.STATS[i]/4))];
		let stat = "*CYAN*" + stats[i] + " - " + color + C.STATS[i];
		for (let j = 0; j < 20 - (C.STATS[i].toString().length); j++) {
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
			let rare = false;
			if (i < C.INVENTORY.length) {
				isItem = true;
				isEquipped = C.INVENTORY[i].equipped;
				item = itemName(C.INVENTORY[i]);
				rare = C.INVENTORY[i].rare;
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
				let color = "*GREY*";
				if (isEquipped) {
					color = "*BLUE*";
				}
				else if (rare) {
					color = "*CYAN*";
				}
				item = color + item + "*GREY*";
				if (C.INVENTORY[i].type == "weapon") {
					let attacks = C.INVENTORY[i].attacks[0];
					if (BattleIndex(C.ID) == -1) { 
						attacks = w_attacks(C, C.INVENTORY[i]);
					}
					item += " *YELLOW*" + attacks + "*BLACK* | *GREEN*" + w_AP(C, C.INVENTORY[i]) + "*GREY*";
				}
				else if (C.INVENTORY[i].type == "armor") {
					item += " *CYAN*" + a_physical(C, C.INVENTORY[i]) + "*BLACK* | *CYAN*" + a_magical(C, C.INVENTORY[i]);
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
	if (C.EFFECTS.length == 0) {
		return "*PINK*No active effects. . .\n";
	}
	let msg = "";
	let maxLength = 0;
	let nameStr = "";
	let numbStr = "";
	let timeStr = "";
	let descStr = "";
	
	for (let i = 0; i < 2; i++) {
		for (const effect of C.EFFECTS) {
			if ((i == 0 && effect.type == "buff") || (i == 1 && effect.type == "debuff")) {
				let name = "*GREEN*" + effect.name;
				if (i == 1) {
					name = "*RED*" + effect.name;
				}
				if (effect.target) {
					name += " " + effect.target.NAME;
				}
				nameStr += name + "\n";
				numbStr += "*PINK*" + effect.stacks + "\n";
				timeStr += "*YELLOW*" + effect.duration + "\n";
				descStr += "*GREY*" + effect.description + "\n";
				let len = measureText(name);
				if (len > maxLength) {
					maxLength = len;
				}
			}
		}
	}
	
	maxLength += 4;
	
	let titleStr = "*CYAN*Effect";
	titleStr = StackStrings(titleStr, "*PINK*#", maxLength);
	titleStr = StackStrings(titleStr, "*YELLOW*⧗", maxLength + 4);
	titleStr = StackStrings(titleStr, "*WHITE*Description", maxLength + 8);
	titleStr += "\n";
	
	msg = StackStrings(nameStr, numbStr, maxLength);
	msg = StackStrings(msg, timeStr, maxLength + 4);
	msg = StackStrings(msg, descStr, maxLength + 8);
	
	return titleStr + msg;
}

function EnemyDescription(enemy, showEffects = true) {
	let msg = "";
	msg += "*RED*" + enemy.NAME + " *CYAN*⛊*GREY*" + P_Armor(enemy) + " *CYAN*✱*GREY*" + M_Armor(enemy) + " *GREY*";
	msg += DrawBar(enemy.HP, MaxHP(enemy), 30, "*RED*") + "\n";
	msg += "*GREY*" + enemy.DESCRIPTION + "\n\n";
	if (enemy.ZONES.length > 0) {
		let locationNames = ["the Haunted Crypts", "the Acrid Swamp", "the Wilted Woods", "the Stony Island"];
		msg += "*GREY*This enemy is commonly found at ";
		for (let i = 0; i < enemy.ZONES.length; i++) {
			msg += "*GREEN*" + locationNames[enemy.ZONES[i]] + "*GREY*";
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
		if (showEffects) {
			msg += "\n\n";
		}
	}
	if (showEffects) {
		msg += WriteEffects(enemy);
	}
	return msg;
}

function DrawGuildHall() {
	let msg = "";
	let retired = COPY(data["town"].retired);
	retired = shitSort(retired, "LEVEL");
	retired = shitSort(retired, "RETIRED");
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
		let color = "*GREEN*";
		if (hero.RETIRED) {
			color = "*BLUE*";
		}
		msg += color + hero.NAME + "*GREY* - *CYAN*" + Prettify(hero.CLASS) + " *YELLOW*Level " + hero.LEVEL + "\n"; 
	}
	return msg;
}

function DrawBank(C) {
	let bank = data[C.DISCORD_ID].BANK;
	let msg = "*WHITE*You're in your personal bank vault. You can *CYAN*!deposit*GREY* and *CYAN*!withdraw*GREY* items here. There's a *YELLOW*25 gold fee*GREY* to make withdraws.\n\n";
	msg += "*YELLOW*BANK VAULT\n";
	for (let i = 0; i < 5; i++) {
		msg += "*RED*0" + (i+1) + "*GREY*) ";
		if (i < bank.length) {
			msg += itemName(bank[i]) + "\n";
		}
		else {
			msg += "---\n";
		}
	}
	return msg;
}

function DrawGraveyard() {
	let graves = data["town"].graves;
	let msg = "\nThere are " + graves.length + " graves in the graveyard.\n\n";
	let worthy = [];
	for (const death of graves) {
		if (death.LEVEL > 2) {
			worthy.push(death);
		}
	}
	worthy = shitSort(worthy, "LEVEL");
	for (let i = 0; i < 30; i++) {
		let death = worthy[i];
		msg += "*GREEN*" + death.NAME + "*GREY* the *BLUE*" + Prettify(death.CLASS) + "*GREY*, *YELLOW*Level " + death.LEVEL + "\n";
		if (death.DESCRIPTION) {
			msg += "*GREY*" + death.DESCRIPTION + "\n";
		}
		msg += "\n";
	}
	return msg;
}

function RoomDescription(C) {
	if (!C) {
		return "*RED*You need to make a character.\n";
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
		return DrawCombat(battles[index]);
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
		
		if (C.LOCATION == "The Town Square") {
			let statues = data["town"].statues;
			msg += "*YELLOW*";
			for (const statue of statues) {
				msg += "Statue of " + statue.NAME + "\n";
			}
			if (statues.length > 0) {
				msg += "\n";
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
					if (NPCList.length == 2) {
						msg += " ";
					}
					msg += "and ";
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
	if (C.BUILDING.toLowerCase() == "bank") {
		msg += DrawBank(C);
		msg += "\n";
		msg += Inventory(C);
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
		let playerColor = "*GREEN*";
		if (C.COLOR && C.COLOR != "") {
			 playerColor = C.COLOR;
		}
		msg += playerColor + C.NAME + "*GREY* the *CYAN*" + Prettify(C.CLASS) + "*BLACK* | " + levelStr + "*BLACK* | *YELLOW*" + C.XP + "*GREY*/*GREEN*" + C.LEVEL * 100 + "*GREY* XP*BLACK* | *CYAN*⛊*GREY*" + P_Armor(C) + " *CYAN*✱*GREY*" + M_Armor(C) +"*GREY*\n";
		if (C.BRACING) {
			msg += DrawBar(C.HP, MaxHP(C), 30, "*RED*", true, "*YELLOW*") + "\n";
		}
		else {
			msg += DrawBar(C.HP, MaxHP(C), 30, "*RED*") + "\n";
		}
		msg += DrawBar(C.STAMINA, MaxStamina(C), 30, "*GREEN*");
		if (BattleIndex(C.ID) > -1) {
			msg += "*GREY* - *GREEN* AP: " + C.AP;
		}
		else {
			msg += "*GREY* - *GREEN* AP: " + MaxAP(C);
		}
		msg += "\n";
		msg += DrawStats(C);
		msg += Inventory(C);
		let index = BattleIndex(C.ID);
		if (index > -1 && battles[index].started) {
			msg += "\n" + WriteEffects(C);
		}
		if (C.DESCRIPTION != "") {
			msg += "\n" + C.DESCRIPTION;
		}
	}
	else if (C.TYPE == "npc") {
		msg += C.DESCRIPTION;
		if (C.MERCHANT) {
			msg += "\n\n*GREEN*" + C.NAME + "*YELLOW* has goods to sell.";
		}
	}
	else {
		return EnemyDescription(C);
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
	let bonus = 0;
	for (const letter of text) {
		if (letter == '⛊' || letter == '✱') {
			bonus += .5;
		}
	}
	return text.length + bonus;
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
		if (newLines && i < (len - 1)) {
			msg += "\n";
		}
	}
	return msg;
}

function DrawSideList(symbol, allies, otherStr, statStr) {
	for (let i = 0; i < allies.length; i++) {
		let name = "*GREY*";
		if (allies[i].COLOR && allies[i].COLOR != "") {
			name = allies[i].COLOR;
		}
		if (allies[i].ENDED) {
			name = "*BLACK*";
		}
		if (allies[i].TYPE == "boss") {
			name = "*YELLOW*";
		}
		name += allies[i].NAME;
		let buffs = 0;
		let debuffs = 0;
		name += "*GREEN*";
		let num = 0;
		for (const effect of allies[i].EFFECTS) {
			if (num < 3 && effect.type == "buff") {
				num++;
				name += "+";
			}
		}
		num = 0;
		name += "*RED*";
		for (const effect of allies[i].EFFECTS) {
			if (num < 3 && effect.type == "debuff") {
				name += "-";
				num++;
			}
		}
		if (allies[i].BRACING) {
			statStr += DrawBar(allies[i].HP, MaxHP(allies[i]), 10, "*RED*", false, "*CYAN*");
		}
		else {
			statStr += DrawBar(allies[i].HP, MaxHP(allies[i]), 10, "*RED*", false);
		}
		statStr += " *CYAN*⛊*GREY*" + P_Armor(allies[i]) + " *CYAN*✱*GREY*" + M_Armor(allies[i]);
		let type = symbol;
		if (allies[i].TYPE == "player") {
			statStr += "*BLACK* | *GREEN*" + allies[i].AP + " *BLACK*| *YELLOW*" + allies[i].STAMINA + " *BLACK*| ";
			let atks = 0;
			let staffEquipped = false;
			for (const item of allies[i].INVENTORY) {
				if (item.equipped) {
					if (item.type == "weapon") {
						atks = "*RED*" + item.attacks[0];
					}
					else if (item.type == "staff") {
						atks = "*BLUE*" + (MaxCasts(allies[i]) - allies[i].CASTS);
						staffEquipped = true;
					}
				}
			}
			statStr += atks;
			if (allies[i].CLASS == "sorcerer" && !staffEquipped) {
				statStr += " *BLACK*| " + "*BLUE*" + (MaxCasts(allies[i]) - allies[i].CASTS);
			}
		}
		statStr += "\n";
		let color = "*BLACK*";
		if (allies[i].HP > 0) {
			if (symbol == "P") {
				color = "*GREEN*";
				if (allies[i].SUMMONED) {
					color = "*BLUE*";
					for (const effect of allies[i].EFFECTS) {
						if (effect.name.toLowerCase() == "fading" && effect.duration == 0) {
							color = "*GREY*";
						}
					}
				}
			}
			else {
				color = "*RED*";
			}
		}
		let tempStr = color + type + (i + 1) + " ";
		if (i < 9) {
			tempStr += " ";
		}
		tempStr += name;
		let text = "*BLACK*" + allies[i].HP + "/" + MaxHP(allies[i]);
		otherStr += StackStrings(tempStr, text, 32 - measureText(text), false) + "\n";
	}
	return [otherStr, statStr];
}

function DrawCombat(battle) {
	let allyHP = 0;
	let enemyHP = 0;
	let levelText = "*GREY* - *PINK*Level " + battle.level + "*GREY*";
	if (battle.level == 4) {
		levelText = "*GREY* - *PINK*Final Boss*GREY*";
	}
	let msg = "*RED*" + battle.location + levelText + "\n\n";
	let battleStr = "*WHITE*R1 *BLACK*|*WHITE* R2 *BLACK*|*WHITE* R3 *BLACK*|*WHITE* R4 *BLACK*|*WHITE* R5\n";
	let rows = [[], [], [], [], []];
	let colors = [[], [], [], [], []];
	let max = 0;
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < battle.enemies.length; j++) {
			if (battle.enemies[j].ROW == i) {
				enemyHP += battle.enemies[j].HP;
				let color = "*BLACK*";
				if (battle.enemies[j].HP > 0) {
					color = "*RED*";
				}
				rows[i].push("E" + (j + 1));
				colors[i].push(color);
			}
		}
		for (let j = 0; j < battle.allies.length; j++) {
			if (battle.allies[j].ROW == i) {
				allyHP += battle.allies[j].HP;
				let color = "*BLACK*";
				if (battle.allies[j].HP > 0) {
					color = "*GREEN*";
					if (battle.allies[j].SUMMONED) {
						color = "*BLUE*";
						for (const effect of battle.allies[j].EFFECTS) {
							if (effect.name.toLowerCase() == "fading" && effect.duration == 0) {
								color = "*GREY*";
							}
						}
					}
				}
				rows[i].push("P" + (j + 1));
				colors[i].push(color);
			}
		}
		if (rows[i].length > rows[max].length) {
			max = i;
		}
	}
	let proportion = allyHP/(allyHP + enemyHP);
	let hasSwitched = false;
	battleStr += "*GREY*";
	for (let i = 0; i < 22; i++) {
		if (!hasSwitched && i > Math.round(proportion * 22)) {
			hasSwitched = true;
			battleStr += "*BLACK*";
		}
		battleStr += "=";
	}
	battleStr += "\n";
	//battleStr += "*BLACK*======================*GREY*\n";
	for (let i = 0; i < rows[max].length; i++) {
		for (let j = 0; j < 5; j++) {
			if (i < rows[j].length) {
				battleStr += colors[j][i] + rows[j][i] + "  ";
				if (rows[j][i].length < 3) {
					battleStr += " ";
				}
			}
			else {
				battleStr += "     ";
			}
		}
		battleStr += "\n";
	}
	battleStr += "\n";
	let otherStr = "*YELLOW*Allies" + "*GREY* - *RED*" + allyHP + " HP\n";
	let statStr = "\n";
	let strings = DrawSideList("P", battle.allies, otherStr, statStr);
	otherStr = strings[0];
	statStr = strings[1];
	
	otherStr += "\n*PINK*Enemies" + "*GREY* - *RED*" + enemyHP + " HP\n";
	statStr += "\n\n";
	strings = DrawSideList("E", battle.enemies, otherStr, statStr);
	otherStr = strings[0];
	statStr = strings[1];

	otherStr = StackStrings(otherStr, statStr, 33);
	if (battle.loot.length > 0) {
		let lootStr = "\n*GREY*Loot\n"
		for (let i = 0; i < battle.loot.length; i++) {
			let name = itemName(battle.loot[i]);
			let color = "*GREY*";
			if (battle.loot[i].rare) {
				color = "*CYAN*";
			}
			lootStr += "*PINK*" + (i + 1).toString().padStart(2, '0') + "*GREY*) " + color + name + "\n";;
		}
		battleStr += lootStr+"\n";
	}
	
	msg += StackStrings(battleStr, otherStr, 25);
	return msg;
}

function DrawSpells(C, spellList) {
	let rightStr = "*PINK*Description\n";
	let nameStr = "*GREEN*#    *CYAN*Spell Name\n";
	let APStr = "*YELLOW*Costs\n";
	let HPStr = "\n";
	for (let i = 0; i < spellList.length; i++) {
		if (!(typeof spellList[i] === 'string')) {
			spellList[i] = spellList[i].name;
		}
		let index = findItem(spells, spellList[i]);
		if (index > -1 && index < spells.length) {
			let spell = spells[index];
			let color = "*BLUE*";
			if (i % 2 == 0) {
				color = "*GREEN*";
			}
			nameStr += StackStrings("*GREY*" + (i + 1), color + spell.name, 5);
			let costColor = "*GREEN*";
			if (C.CLASS == "sorcerer") {
				costColor = "*YELLOW*";
			}
			APStr += costColor + spellAPCost(C, spell);
			color = "*RED*";
			if (spellHPCost(C, spell) == 0) {
				color = "*BLACK*";
			}
			HPStr += color + spellHPCost(C, spell);
			rightStr += "*GREY*" + spell.description;
			if (i < spellList.length - 1) {
				HPStr += "\n";
				rightStr += "\n";
				APStr += "\n";
				nameStr += "\n";
			}
		}
	}
	let str = StackStrings(nameStr, APStr, 25);
	str = StackStrings(str, HPStr, 28);
	return StackStrings(str, rightStr, 32);
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
	if (NPC.INDEX >= NPC.CONVERSATIONS.length) {
		NPC.INDEX = 0;
	}
	let strings = ["", "", "", ""];
	let lengths = [0, 0, 0, 0];
	msg += "*GREY*" + NPC.DESCRIPTION + "\n\n";
	msg += "*YELLOW*" + NPC.CONVERSATIONS[NPC.INDEX++] + "\n\n";
	let i = 0;
	NPC.ITEMS = shitSort(NPC.ITEMS, "type", false, "value");	
	for (const item of NPC.ITEMS) {
		let tempStrings = ["", "", "", ""];
		let num = (++i).toString().padStart(2, '0');
		tempStrings[0] = "*PINK*" + num + ") *GREY*" + item.name;
		if (item.type == "weapon") {
			let hands = "*PINK*" + item.hands + "H " + Prettify(item.subclass);
			let atks = "*YELLOW*" + item.attacks[1] + " ATKs";
			atks = atks + "*GREEN* " + item.AP + " AP";
			tempStrings[2] = StackStrings(hands, atks, 11);
		}
		else if (item.type == "armor") {
			let armor = "*CYAN*⛊*GREY*" + item.armor[0] + " *CYAN*✱*GREY*" + item.armor[1];
			let APStr = "";
			if (item.AP > 0) {
				APStr = "*RED*-" + item.AP + " AP";
			}
			tempStrings[2] = StackStrings(armor, APStr, 10);
		}
		else if (item.description) {
			let color = "*CYAN*";
			if (item.type == "staff") {
				color = "*RED*";
			}
			if (item.type == "scroll" || item.type == "spellbook") {
				color = "*PINK*";
			}
			tempStrings[2] = color + item.description;
		}
		tempStrings[3] = "*YELLOW*" + item.value;
		for (let i = 0; i < strings.length; i++) {
			lengths[i] = Math.max(lengths[i], measureText(tempStrings[i]));
			strings[i] += tempStrings[i] + "\n";
		}
	}
	let itemStr = strings[0];
	let len = lengths[0] + 1;
	/*for (let i = strings.length - 1; i >= 0; i--) {
		let hasText = false;
		for (const str of strings[i]) {
			if (str != "\n") {
				hasText = true;
			}
		}
		if (!hasText) {
			strings.splice(i, 1);
		}
	}*/
	for (let i = 1; i < strings.length; i++) {
		itemStr = StackStrings(itemStr, strings[i], len);
		len += (5 + lengths[i]);
	}
	msg += itemStr;
	msg += "\n*GREY*Your Gold: *YELLOW*" + C.GOLD + "\n";
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

function calcDmg(baseDmg, attacks, hands, chance) {
	return baseDmg * attacks * hands * chance;
}

function runeDamage(baseDmg, attacks, hands, chance, mult, mask = [false, false, false, false], depth = 0) {
	let m = COPY(mask);
	if (depth > 1) {
		return [calcDmg(baseDmg, attacks, hands, chance), hands * attacks];
	}
		
	let dmg = [0, 0, 0, 0];
	dmg[0] = calcDmg(baseDmg, attacks, hands, 1 - ((1 - chance) * (1 - chance)));
	dmg[1] = calcDmg(baseDmg + 2, attacks, hands, chance);
	dmg[2] = calcDmg(baseDmg * 1.2, attacks, hands, chance);
	dmg[3] = calcDmg(baseDmg * 1.2, attacks + 1, hands, chance);
	
	let maxIndex = 0;
	let max = 0;
	for (let i = 0; i < dmg.length; i++) {
		if (!mask[i]) {
			if (dmg[i] > max) {
				max = dmg[i];
				maxIndex = i;
			}
		}
	}
	m[maxIndex] = true;
	if (maxIndex == 0) {
		return runeDamage(baseDmg, attacks, hands, 1 - ((1 - chance) * (1 - chance)), mult, m, ++depth);
	}
	if (maxIndex == 1) {
		return runeDamage(baseDmg + 2, attacks, hands, chance, mult, m, ++depth);
	}
	if (maxIndex == 2) {
		return runeDamage(baseDmg * 1.2, attacks, hands, chance, mult, m, ++depth);
	}
	if (maxIndex == 3) {
		return runeDamage(baseDmg * 1.2, attacks + 1, hands, chance, mult,  m, ++depth);
	}
}

function SimplifyMessage(message) {
	let msg = "";
	let lines = message.split("\n");
	let dict = new Object({});
	for (const line of lines) {
		if (line.trim() != "") {
			if (dict[line] == null) {
				dict[line] = 1;
			}
			else {
				dict[line]++;
			}
		}
	}
	
	for (const line of lines) {
		if (lines.length > 30 && line.includes("moves") && (line.includes("left") || line.includes("right"))) {
			dict[line] = null;
		}
		else if (dict[line] == 1 || line.trim() == "") {
			msg += (line + "\n");
		}
		else if (dict[line]) {
			msg += line + " *WHITE*(x" + dict[line] + ")\n";
		}
		dict[line] = null;
	}
	
	msg = msg.split("\n\n\n").join("\n\n");
	msg = msg.split("\n\n\n").join("\n\n");
	msg = msg.split("\n\n\n").join("\n\n");
	
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
	
	let requireCharacter = ["brew", "deposit", "withdraw", "fishing", "row", "familiar", "debug", "servant", "report", "heal", "cheat", "fish", "reel", "haircut", "inventory", "disenchant", "enchant", "level", "stop", "move", "mvoe", "discard", "delve", "equip", "dequip", "remove", "unequip", "here", "leave", "go", "travel", "enter", "leave", "move", "talk", "trade", "take", "suicide", "drink", "eat", "read", "learn", "order", "buy", "sell", "spells"];
	let requireBattle = ["start", "end", "cast", "attack", "flee", "drop", "guard", "brace", "throw"];
	
	for (let i = 0; i < requireBattle.length; i++) {
		requireCharacter.push(requireBattle[i]);
	}
	if ((keyword == "normal" || keyword == "silly" || requireCharacter.indexOf(keyword) > -1) && words[words.length - 1][0] == "x" && words[words.length - 1].length <= 3) {
		numRepeat = parseInt(words[words.length - 1].substring(1));
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
			if (C.RETIRED) {
				data[message.author.id].CHARACTER = null;
				C = null;
			}
			else if (C.HP <= 0) {
				msg += Deliver(C);
				if (C.HP <= 0) {
					if (C.CLASS == "monk" && !C.DIED) {
						C.HP = 1;
						C.DIED = true;
						let location = findLocation("The Churchyard");
						Travel(C, location, BattleIndex(C.ID));
						C.BUILDING = "Church";
						return "*YELLOW*Miraculously, you were found by some travelers, who brought you to the Church for treatment. . .\n\n" + RoomDescription(C);
					}
					else {
						for (let i = 0; i < location.players; i++) {
							if (location.players[i].ID == C.ID) {
								location.players.splice(i, 1);
								break;
							}
						}
						if (!(C.CURSED)) {
							let name = C.NAME;
							if (C.COLOR && C.COLOR != "") {
								name = C.COLOR + name;
							}
							data["town"].graves.push(new DeathReport(name, C.CLASS, C.LEVEL, C.REPORT, C.DESCRIPTION));
						}
						data[message.author.id].CHARACTER = null;
						C = null;
					}
				}
			}
			else {
				if (!(C.REPORT)) {
					C.REPORT = new Report();
				}
				if (index == -1) {
					C.STAMINA = MaxStamina(C);
					C.EFFECTS = [];
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
			return msg + "*RED*You need to make a character first with !character";
		}
		if (index == -1 && requireBattle.indexOf(keyword) > -1) {
			return "*RED*You must be in combat to do this action!\n";
		}
		if (keyword == "help") {
			return ListCommands(C, index);
		}
		else if (keyword == "clearspells") {
			C.SPELLS = [];
		}
		else if (keyword == "forget") {
			let index = parseInt(words[1]);
			if (isNaN(index)) {
				let checkStr = "";
				let count = 0;
				do {
					words = words.slice(1, words.length);
					if (count > 0) {
						checkStr += " ";
					}
					checkStr += words[0];
					index = findThing(C.SPELLS, checkStr);
				} while (index == -1 && ++count < words.length);
			}
			else {
				index--;
			}
			if (index > -1) {
				C.SPELLS.splice(index, 1);
				msg = "*GREEN*It feels like a part of you has been lost . . .\n\n" + DrawSpells(C, C.SPELLS);
			}
			else {
				return "*RED*Couldn't find spell to forget!\n";
			}
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
			msg += "*BLUE*Welcome, Adventurer!*GREY*\n\n";
			
			msg += "Before getting started, you should take a look at *CYAN*!classes *GREY*and *CYAN*!stats*GREY*, and conceive of a concept for your new character. "
			msg += "Will you want to use *CYAN*!weapons*GREY* or magic? Will you want to avoid taking damage, or be tanky? If you're not quite sure, you can simply set your class as random.\n\n";
			
			msg += "Once your character is made, you'll have *YELLOW*4 Stat Points*GREY* (*YELLOW*SP*GREY*) to spend. You gain *YELLOW*1 SP*GREY* per level, and can use the *CYAN*!level*GREY* command to increase any stat of your choice. Be sure to spend all of your *YELLOW*SP*GREY*!\n\n";
			
			msg += "Next, you can use *CYAN*!here*GREY* and *CYAN*!go DIRECTION*GREY* to travel around the !town. You should *CYAN*!enter*GREY* buildings to *CYAN*!trade*GREY* and *CYAN*!talk*GREY* with the villagers. "
			msg += "*PINK*Runes*GREY* play a large part in how your character will develop over the course of the game, so you'll probably want to look at whatever *PINK*runes*GREY* match your equipment of choice, and begin thinking of builds you may want to go for later on.\n\n";
			
			msg += "After you're fairly familiar with the town, and your character has leveled their stats, you're ready for *RED*combat*GREY*. Travel to any *RED*dungeon*GREY* and *CYAN*!delve*GREY* in. You'll notice that *CYAN*!help*GREY* provides a list of combat-specific commands to use. If things go south, move back to the far left and *CYAN*!flee*GREY* for your life! You can also *CYAN*!rest*GREY* at the tavern to recover *RED*HP*GREY* between fights.\n\n";
			
			msg += "The *CYAN*!help *GREY*command will provide an extensive list of available commands both in and out of combat, and if you need any further help don't hesitate to ask.\n\n";
			
			msg += "*BLUE*Best of luck!\n";
		}
		else if (keyword == "weapons") {
			msg += "*GREEN*Weapon Classes\n";
			msg += "*BLUE*Blades - Close Range. +1 Rune Slot.\n";
			msg += "*CYAN*Blunt - Close Range. Each attack deals some damage to all enemies in a row.\n";
			msg += "*BLUE*Axes - Close Range. Have a 15% chance to hit for double damage.\n";
			msg += "*CYAN*Shields - Close Range. Shields have a chance to block any incoming damage. \n";
			msg += "*BLUE*Polearms - Medium Range. Polearms offer good damage and range. Enemies on the same row are pushed back when attacked.\n";
			msg += "*CYAN*Whips - Medium Range. Hits have a 50% chance to afflict '*WHITE*Whipped*GREY*'\n";
			msg += "*BLUE*Ranged - Very High Range.\n";
		}
		else if (keyword == "item" || keyword == "look") {
			msg += CommandDescribe(COPY(words), C, index);
		}
		else if (keyword == "stats") {
			msg += CommandStats(C);
		}
		else if (keyword == "delve") {
			msg += CommandDelve(C, index);
		}
		else if (keyword == "spawn") {
			if (index > -1) {
				let rating = 45 * Math.pow(1.21, C.LEVEL);
				for (let i = 0; i < 3; i++) {
					let enemyList = generateEnemies(rating, battles[index].zone);
					let j = 0;
					for (const enemy of enemyList) {
						msg += "*REPEAT**PINK*" + (++j).toString().padStart(2, '0') + "*GREY*) " + StackStrings(enemy.NAME, "*GREY*" + enemy.DIFFICULTY, 20) + "\n";
					}
					msg += "\n";
				}
			}
		}
		else if (keyword == "start") {
			msg += CommandStart(C, index);
		}
		else if (keyword == "delvestart") {
			CommandDelve(C, index);
			index = BattleIndex(C.ID);
			msg += CommandStart(C, index);
		}
		else if (keyword == "brace") {
			if (hasEffect(C, "stunned")) {
				return "*RED*You can't act while you're stunned!\n";
			}
			else if (C.BRACED) {
				msg = "*RED*You're already braced!\n";
			}
			else if (C.STAMINA >= 6) {
				C.STAMINA -= 6;
				C.BRACING = true;
				msg += "*YELLOW*" + C.NAME + " braces themselves!\n";
				msg += HandleCombat(battles[index]);
			}
			else {
				msg += "*RED*You don't have enough Stamina to brace.\n";
			}
		}
		else if (keyword == "debug") {
			words = words.slice(1, words.length);
			let word = words.join(" ");
			msg += JSON.stringify(C[word.toUpperCase()], null, 4);
		}
		else if (keyword == "end") {
			C.ENDED = true;
			msg += "*GREEN*" + C.NAME + "*GREY* ends their turn.\n";
			msg += HandleCombat(battles[index]);
			if (C.HP > 0) {
				//msg += RoomDescription(C);
			}
		}
		else if (keyword == "prosperity") {
			msg += "*YELLOW*Town Prosperity: " + data["town"].prosperity;
			msg += "\n\n";
			msg += "*YELLOW*Prosperity*GREY* is accumulated over time as *YELLOW*gold *GREY*is spent in town; tavern drinks earn prosperity at 3x the normal rate. It can also be earned by completing quests. Earning prosperity unlocks new *BLUE*buildings *GREY*and *GREEN*areas*GREY*."
		}
		else if (keyword == "quest" || keyword == "quests") {
			let quests = data["town"].quests;
			for (const quest of quests) {
				let index = findTarget(enemies, quest.enemy);
				let i = 1;
				if (index > -1 && index < enemies.length) {
					msg += "*YELLOW*Quest " + i++ + " - " + quest.value + "g\n";
					msg += EnemyDescription(enemies[index], false);
					msg += "\n\n";
					let num = quest.numRequired - quest.numKilled;
					msg += "*RED*Kill " + num + " more of this enemy to collect the reward!\n";
				}
				msg += "\n\n";
			}
		}
		else if (keyword == "equip" || keyword == "dequip" || keyword == "remove" || keyword == "unequip") {
			msg += CommandEquip(COPY(words), C);
		}
		else if (keyword == "cast") {
			msg += CommandCast(COPY(words), C, index);
			msg += HandleCombat(battles[index]);
			if (battles[index] && battles[index].started && i == numRepeat - 1) {
				msg += RoomDescription(C);
			}
		}
		else if (keyword == "drop") {
			msg += CommandDrop(COPY(words), C, index);
		}
		else if (keyword == "enchant") {
			msg += CommandEnchant(COPY(words), C);
		}
		else if (keyword == "disenchant") {
			msg += CommandDisenchant(COPY(words), C);
		}
		else if (keyword == "guard") {
			msg += CommandGuard(COPY(words), C, index);
		}
		else if (keyword == "attack") {
			msg += CommandAttack(COPY(words), C, index);
			if (battles[index] && battles[index].started && i == numRepeat - 1) {
				msg += RoomDescription(C);
			}
		}
		else if (keyword == "here") {
			msg += RoomDescription(C);
		}
		else if (keyword == "haircut") {
			msg += CommandHaircut(message.content.substring(1).split(" "), C);
		}
		else if (keyword == "parse") {
			msg = message.content.substring("!parse ".length) + "\n";
		}
		else if (keyword == "leave") {
			msg += CommandLeave(C, index);
		}
		else if (keyword == "go" || keyword == "mvoe" || keyword == "move" || keyword == "enter" || keyword == "travel" || keyword == "leave") {
			msg += CommandTravel(COPY(words), C, index);
			PurgeBattles();
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
		else if (keyword == "reply") {
			msg += CommandReply(COPY(words), C);
		}
		else if (keyword == "talk") {
			msg += CommandTalk(COPY(words), C);
		}
		else if (keyword == "clear") {
			C.DIALOGUE = initDialogueHandler();
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
		else if (keyword == "deposit") {
			msg += CommandDeposit(COPY(words), C);
		}
		else if (keyword == "withdraw") {
			msg += CommandWithdraw(COPY(words), C);
		}
		else if (keyword == "suicide") {
			C.HP = 0;
			C.ENDED = true;
			if (index > -1) {
				HandleCombat(battles[index]);
			}
			msg += "*RED*" + C.NAME + " is no more.\n";
			let location = findLocation(C.LOCAION);
			for (let i = 0; i < location.players; i++) {
				if (location.players[i].ID == C.ID) {
					location.players.splice(i, 1);
					break;
				}
			}
			if (!(C.CURSED) && C.LEVEL > 1) {
				data["town"].graves.push(new DeathReport(C.NAME, C.CLASS, C.LEVEL, C.REPORT, C.DESCRIPTION));
			}
			C = null;
			PurgeBattles();
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
			if (index == AVD && C.STATS[AVD] >= 10) {
				return "*RED*You can't increase this stat any further.\n";
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
		else if (keyword == "report") {
			msg += "*YELLOW*Gold Earned: " + C.REPORT.gold + "\n";
			msg += "*CYAN*Damage Taken: " + C.REPORT.taken + "\n";
			msg += "*GREEN*Damage Mitigated: " + C.REPORT.mitigated + "\n";
			msg += "*PINK*Damage Dealt: " + C.REPORT.damage + "\n";
			msg += "*RED*Kills: " + C.REPORT.kills + "\n";
		}
		else if (keyword == "read") {
			msg += CommandRead(COPY(words), C);
		}
		else if (keyword == "learn") {
			msg += CommandLearn(COPY(words), C);
		}
		else if (keyword == "order") {
			msg += CommandOrder(COPY(words), C);
			if (i == numRepeat - 1) {
				msg += Inventory(C);
			}
		}
		else if (keyword == "spells") {
			msg += CommandSpells(C);
		}
		else if (keyword == "drink" || keyword == "eat") {
			msg += CommandDrink(COPY(words), C);
		}
		else if (keyword == "brew") {
			msg += CommandBrew(COPY(words), C);
		}
		else if (keyword == "throw") {
			msg += CommandThrow(COPY(words), C, index);
		}
		else if (keyword == "classes") {
			msg += "*RED*Peasant*GREY* - *GREEN*+2 END +2 VIT*GREY*. Starts with a club but *RED*no gold*GREY*.\n\n";
			msg += "*CYAN*Noble*GREY* - Starts with *YELLOW*100 gold*GREY*, a stylish shirt, and a scimitar. A *GREEN*loyal servant*GREY* follows you into battle.\n\n";
			msg += "*RED*Rogue*GREY* - *GREEN*+2 AVD*GREY*. Starts with *YELLOW*40 gold*GREY*, a cloak, and two daggers. Whenever you dodge an attack, deal 6 damage to your attacker.\n\n";
			msg += "*CYAN*Warrior*GREY* - *GREEN*+1 VIT +1 DEX +2 Armor*GREY*. Starts with a Leather Cuirass, a Hatchet, and a Buckler. Armor doesn't reduce your Stamina.\n\n";
			msg += "*RED*Ranger*GREY* - *GREEN*+1 WEP +1 AVD*GREY*. Starts with a ranged weapon. Your attacks deal more damage on farther enemies (5% -> 25%)\n\n";
			msg += "*CYAN*Duelist*GREY* - *GREEN*+2 WEP +1 DEX. *GREY*Start with a Scimitar and a Buckler. Attacks have +10% hit chance and +15% damage, but you can only target one specific enemy per turn.\n\n";
			msg += "*RED*Monk*GREY* - *GREEN*+2 VIT. *GREY*Start with a quarterstaff and a Plain Cassock. Each turn, heal the lowest HP ally in your row 10% of your Max HP. You can rest at the church to recover HP. The first time you would die, instead wake up at the church with 1 HP.\n\n";
			msg += "*CYAN*Merchant*GREY* - *GREEN*1 END. 1 AVD. *GREY*Start with *YELLOW*50 gold*GREY* and a backpack, but no weapon. You can sell items for 75% of their value rather than 50%, however you're too greedy to ever drop any items.\n\n";
			msg += "*RED*Mage*GREY* - *GREEN*+2 MAG*GREY*. Starts with a wand and *BLUE*Arcane Strike*GREY*. Mages get +2 Max Spells and +1 Cast/Turn from each point of MAG.\n\n";
			msg += "*CYAN*Witch*GREY* - *GREEN*+2 MAG*GREY*. Starts with a wand and *BLUE*Envenom*GREY*. Witches are accompanied by a familiar and can cheaply !brew potions and tinctures in combat. Using any potion or tincture heals 5 HP. Fire Tinctures deal +3 damage per level.\n\n";
			msg += "*RED*Sorcerer*GREY* - *GREEN*+1 MAG +1 END*GREY*. Starts with a quarterstaff. Sorcerers can cast magic without staves or wands. Sorcerers' spells cost 2x Stamina instead of AP.\n\n";
		}
		else if (keyword == "effects") {
			msg += WriteEffects(C);
		}
		else if (keyword == "stop") {
			C.TRADING = "";
			msg += RoomDescription(C);
		}
		else if (keyword == "play") {
			words = words.slice(1, words.length);
			if (data["town"].prosperity > 2500) {
				if (C) {
					return "*RED*You already have a character! Retire or kill yourself first . . .\n";
				}
				if (words[0] == "as") {
					words = words.slice(1, words.length);
					let args = words.join(" ");
					for (let i = 0; i < data["town"].retired.length; i++) {
						let hero = data["town"].retired[i];
						if (hero.NAME.toLowerCase() == args) {
							if (hero.RETIRED) {
								return "*RED*This hero has permanently retired!\n";
							}
							C = hero;
							for (let i = 0; i < C.INVENTORY.length; i++) {
								let item = C.INVENTORY[i];
								if (item.runes) {
									for (let j = 0; j < item.runes.length; j++) {
										let rune = item.runes[j];
										if (rune.value) {
											item.value += rune.value;
											item.runes[j] = rune.name;
										}
									}
								}
							}
							msg += "*GREEN*The mighty hero " + C.NAME + " returns from retirement. . .\n\n";
							data["town"].retired.splice(i, 1);
							break;
						}
					}
					if (!C) {
						return "*RED*Couldn't find hero '" + args + "' in Guild Hall.\n";
					}
				}
				msg += CharacterDescription(C);
			}
			else { 
				return "*RED*The town needs more prosperity to access the guild hall . . .\n";
			}
		}
		else if (keyword == "familiar") {
			if (C.CLASS != "witch") {
				return "*RED*You must be a witch to name your familiar!\n";
			}
			words = words.slice(1, words.length);
			for (let i = 0; i < words.length; i++) {
				words[i] = Prettify(words[i]);
			}
			let args = words.join(" ");
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].NAME.toLowerCase() == args.toLowerCase()) {
					return "*RED*You can't name your familiar that!\n";
				}
			}
			C.FAMILIAR = args;
			msg += "*CYAN*Your Familiar will now be referred to as '*GREEN*" + args + "*CYAN*'\n";
		}
		else if (keyword == "servant") {
			if (C.CLASS != "noble") {
				return "*RED*You must be a noble to name your servant!\n";
			}
			words = words.slice(1, words.length);
			for (let i = 0; i < words.length; i++) {
				words[i] = Prettify(words[i]);
			}
			let args = words.join(" ");
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].NAME.toLowerCase() == args.toLowerCase()) {
					return "*RED*You can't name your servant that!\n";
				}
			}
			C.SERVANT = args;
			msg += "*CYAN*Your servant will now be referred to as '*GREEN*" + args + "*CYAN*'\n";
		}
		else if (keyword == "silly") {
			let colors = ["*RED*", "*BLUE*", "*PINK*", "*GREEN*", "*YELLOW*"];
			msg += colors[rand(colors.length)] + "" + genSillyName() + "\n";
		}
		else if (keyword == "normal") {
			let colors = ["*RED*", "*BLUE*", "*PINK*", "*GREEN*", "*YELLOW*"];
			msg += colors[rand(colors.length)] + "" + genName(rand(2)) + "\n";
		}
		else if (keyword == "row") {
			let num = parseInt(words[words.length - 1]);
			if (num && num > 0 && num < 6) {
				msg = "*CYAN*You'll start spawning in row " + (num) + ".\n";
				C.ROW_PREFERENCE = (num - 1);
			}
			else {
				return "*RED*Invalid row entered.\n";
			}
		}
		else if (keyword == "color") {
			let colors = ["GREEN", "CYAN", "RED", "YELLOW", "WHITE", "PINK", "BLUE", "GREY"];
			words = words.slice(1, words.length);
			let word = words.join(" ");
			msg = "*RED*Your color options are: \n";
			for (const color of colors) {
				msg += "*" + color + "*" + P(color.toLowerCase()) + "\n";
				if (color.toLowerCase() == word.toLowerCase()) {
					C.COLOR = "*" + color + "*";
					return "*GREY*Your new player color is " + C.COLOR + P(color.toLowerCase()) + "*GREY*.";
				}
			}
			return msg;
		}
		else if (keyword == "name") {
			words = words.slice(1, words.length);
			let word = words.join(" ");
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].NAME.toLowerCase() == C.NAME.toLowerCase()) {
					return "*RED*You can't name yourself that!\n";
				}
			}
			C.NAME = Prettify(word.substring(0, 18));
			if (C.NAME.toLowerCase() == "random") {
				C.NAME = genName(rand(2));
			}
			msg += "*CYAN*Your name is now '*GREEN*" + C.NAME + "*CYAN*'\n";
		}
		else if (keyword == "retire") {
			if (index > -1) {
				return "*RED*You can't retire while delving!\n";
			}
			if (C.LEVEL >= 4) {
				msg += "*YELLOW*You retire to live in the Guild Hall on the Stony Island. . .\n";
				data["town"].retired.push(C);
				C = null;
			}
			else {
				return "*RED*You haven't accomplished enough to retire! You need to be at least level 5.\n";
			}
		}
		else if (keyword == "weaponstats") {
			let nameStr = "*CYAN*Name\n";
			let costStr = "*YELLOW*Cost\n";
			let dmgStr = "*RED*Dmg\n";
			let penStr = "*PINK*Pen\n";
			let APStr = "*GREEN*AP\n";
			let EffStr = "*BLUE*Eff\n";
			let scaling = "*CYAN*Scaling\n";
			let reports = [];
			for (const weapon of weapons) {
				let result = runeDamage((w_min(C, weapon) + w_max(C, weapon))/2, w_attacks(C, weapon), 2/weapon.hands, w_chance(C, weapon)/100, w_AP(C, weapon), [false, false, false, false], 3);
				let dmg = result[0];
				//dmg = Math.max(Math.floor(dmg * weapon.pen/100), Math.round(dmg - 10));
				let mult = result[1];
				let AP = weapon.AP * mult;
				report = new WeaponReport(weapon.name, weapon.value, dmg, AP, w_pen(C, weapon), (dmg/AP), (dmg + (.5 * mult + dmg * .05))/dmg);	
				reports.push(report);
			}
			let sort = "cost";
			if (words.length > 1) {
				sort = words[1];
			}
			reports = shitSort(reports, sort.toLowerCase());
			for (const report of reports) {
				nameStr += "*CYAN*" + report.name + "\n";
				costStr += "*YELLOW*" + report.cost + "\n";
				dmgStr += "*RED*" + report.dmg.toFixed(2) + "\n";
				penStr += "*PINK*" + report.pen + "\n";
				APStr += "*GREEN*" + report.ap + "\n";
				EffStr += "*BLUE*" + report.eff.toFixed(2) + "\n";
				scaling += "*CYAN*" + report.scaling.toFixed(2) + "\n";
			}
			msg = StackStrings(nameStr, costStr, 30);
			msg = StackStrings(msg, dmgStr, 38);
			msg = StackStrings(msg, APStr, 46);
			msg = StackStrings(msg, EffStr, 54);
			msg = StackStrings(msg, penStr, 62);
			msg = StackStrings(msg, scaling, 70);
		}
		else if (keyword == "sleep" || keyword == "rest" || keyword == "heal") {
			if (C.HP >= MaxHP(C)) {
				return "*RED*You're already full HP."
			}
			if (C.CLASS == "monk" && C.BUILDING.toLowerCase() == "church") {
				C.HP = MaxHP(C);
				let dialogues = ["You feel refreshed.", "You spend some time in solemn prayer.", "You help with some chores as a show of gratitude.", "The novice's cot you sleep on is covered in dust."];
				msg += "*GREEN*You rest at the church. " + dialogues[rand(dialogues.length)] + "\n";
			}
			else if (C.BUILDING.toLowerCase() == "tavern") {
				if (C.GOLD >= 5) {
					if (C.CLASS == "monk") {
						msg += "*YELLOW*You pay five gold to sleep at the tavern, though you'd probably be more comfortable staying at the church. . .\n";
					}
					else {
						let dialogues = [
						"You gamble a little in common room, but come out even in the end.", 
						"You dream about giant slugs.",
						"Penelope brings you a mug of water as she shows you to your room, and sets it at your bedside.",
						"You wake up to the sound of laughter from the floor below you, and you feel refreshed.",
						"A dog is barking somewhere in the village.",
						"You stumble on your way up the stairs.",
						"The bed is soft and warm.",
						"You dream of swimming in a cold river on a hot summer day.",
						"The wind shakes the shutters to your room.",
						"You hear rain tapping on the roof above you."
						]
						msg += "*GREEN*You pay five gold to sleep at the tavern. *GREY*" + dialogues[rand(dialogues.length)] + "\n";
					}
					C.GOLD -= 5;
					data["town"].prosperity += 5;
					C.HP = MaxHP(C);
				}
				else {
					msg += "*RED*You can't afford to rent a room here!\n";
				}
			}
			else {
				return "*RED*You have to be at the tavern to sleep.\n";
			}
		}
		else if (keyword == "town" || keyword == "map") {
			let prosperity = data["town"].prosperity;
			msg += "*YELLOW*Town Prosperity: " + prosperity + "\n\n";
			msg += "*YELLOW*Town Locations\n";
			for (let k = 0; k < 2; k++) {
				for (let i = 0; i < locations.length; i++) {
					if (locations[i].id != "A Strange Clearing") {
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
				}
				if (k == 0) {
					msg += "\n*YELLOW*Dangerous Areas\n*RED*";
				}
			}
			msg += "\n";
		}
		else if (keyword == "cheat") {
			if (message.author.id == "462829989465948180") {
				console.log(words);
				if (!words[1] || words[1].toLowerCase() == "character") {
					C.SPELLS = [];
					for (let i = 0; i < spells.length; i++) {
						C.SPELLS.push(spells[i].name);
					}
					C.LEVEL = 10;
					C.CURSED = true;
					C.SP = 100;
					C.GOLD = 10000;
					return "*RED*Level set to 10. Gold set to 10,000. SP set to 100.\n";
				}
				else if (words[1].toLowerCase() == "level") {
					let amount = COPY(words).slice(2, COPY(words).length).join(" ");
					let value = parseInt(amount);
					C.LEVEL = value;
					return "*GREEN*Level set to " + amount + ".\n";
				}
				else if (words[1].toLowerCase() == "gold") {
					let amount = COPY(words).slice(2, COPY(words).length).join(" ");
					let value = parseInt(amount);
					C.GOLD = value;
					return "*GREEN*Gold set to " + amount + ".\n";
				}
				else if (words[1].toLowerCase() == "item") {
					let item = COPY(words).slice(2, COPY(words).length).join(" ");
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
					return "*RED*Item '" + item + "' not found!\n";
				}
			}
			else {
				return "*RED*You wish.\n";
			}
		}
		else if (keyword == "fish" || keyword == "reel") {
			msg += CommandFish(C, message);
		}
		else if (keyword == "fishing") {
			msg += "*CYAN*You've caught " + C.FISH.length + " types of fish so far.\n\n";
			msg += "*YELLOW*There are " + (numFish - C.FISH.length) + " types of fish left to be caught, at the following locations:*GREY*\n";
			for (const location of locations) {
				let hasFish = false;
				for (const fish of location.fish) {
					if (C.FISH.indexOf(fish.name) == -1) {
						hasFish = true;
					}
				}
				if (hasFish) {
					msg += location.id + "\n";
				}
			}
		}
		else {
			return "*RED*Command '" + keyword + "' not found!\n";
		}
	}
	data[message.author.id].CHARACTER = C;
	return msg;
}

initRunes();
initSpells();
initItems();
initEnemies();
initLocations();
initEffects();

let numFish = 0;
for (let i = 0; i < items.length; i++) {
	if (items[i].type == "fish") {
		numFish++;
	}
}
console.log("Number of Fish: " + numFish);