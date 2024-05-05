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
const TRUE_DAMAGE = 2;

var classes = ["peasant", "rogue", "noble", "mage", "warrior", "ranger"];
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
	else if (type == PHYSICAL && (target.NAME == "Brigand Lord" || target.NAME == "Brigand")) {
		let ran = rand(100);
		if (ran < 50) {
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
		else if (C.NAME == "Swamp Ape") {
			msg += "*YELLOW*The light fades from " + Name(C) + "'s eyes.\n";
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
		}
		else if (C.NAME == "Squelcher") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " lets out a pained snort as it dies.\n";
		}
		else if (C.NAME == "Scoundrel") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " cries out for mercy before it dies.\n";
		}
		else if (C.NAME == "Deep Horror") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " bursts into a blob of ruptuYELLOW flesh as its pressure field collapses!\n";
		}
		else if (C.NAME == "Slimelord") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " splits into several *YELLOW*Living Slimes!\n";
			let num = 3 + rand(4);
			for (let i = 0; i < num; i++) {
				let slime = summon("Living Slime", C.ROW);
				slime.ROW = C.ROW;
				allies.push(slime);
			}
		}
		else if (C.NAME == "Egg Sac") {
			msg += "*YELLOW*" + Prettify(Name(C)) + " bursts open, and Baby Spiders swarm out of it!\n";
			let num = 2 + rand(2);
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
		else if (C.NAME == "Treasure Chest") {
			msg += "*YELLOW*The lock on the treasure chest breaks.\n";
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
	return msg + "\n";
}

function DealDamage(attack, attackers, attacker, targets, target, canReflect = true) {
	let msg = "";
	if (target.HP <= 0) {
		target.HP = 0;
		return [msg, -2];
	}
	let damage = attack.damage;
	let isPlayer = (target.TYPE == "player");
	let aName = Prettify(Name(attacker));
	let tName = Prettify(Name(target));
	
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
			damage += numBuffs(attacker);
		}
	}
	else if (attack.type == MAGICAL) {
		if (hasRune(attacker, "focus")) {
			damage *= 1.75;
		}
		if (hasEffect(attacker, "forthwith")) {
			damage *= 2;
			removeEffect(attacker, "forthwith");
		}
	}
	
	if (hasEffect(attacker, "weakened")) {
		damage *= .75;
	}
	
	if (hasEffect(target, "exposed")) {
		damage *= 1.2;
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
		//Reporting
		attacker.REPORT.damage += damage;
		target.REPORT.taken += damage;
		target.REPORT.mitigated += (attack.damage - damage);
		
		target.HP -= damage;
		if (target.HP > 0 && target.NAME == "Ephemeral Warrior") {
			msg += "*RED*The Ephemeral Warrior grows stronger!\n";
			Heal(target, damage * 2, true);
		}
		//Evaluate Attacker's Staff Runes
		if (attack.type == 1) {
			if (hasRune(attacker, "cinnabar")) {
				target.ARMOR[1] = Math.max(0, target.ARMOR[1] - 1);
			}
			if (hasRune(attacker, "tar")) {
				msg += AddEffect(target, "Weakened", 1);
			}
		}
		if (damage >= 5 && hasRune(target, "honeycomb")) {
			targets.push(summon("swarm of bees", target.ROW));
			msg += "*GREEN*Bees emerge from out of the honeycomb!\n";
		}
		if (hasRune(target, "amber")) {
			target.STAMINA += 6;
			target.HP = Math.min(target.HP + 1, MaxHP(target));
			msg = "*GREY*" + tName + " gains *GREEN*6 Stamina*GREY* and heals for *RED*1 HP*GREY*.\n";
		}
		msg += "*RED*" + tName + " takes " + damage + " damage!\n";
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
					msg += AddEffect(target, "Poison", 3);
				}
			}
			if (rDamage > 0) {
				msg += "*BLUE*" + tName + " reflects damage!\n";	
				msg += DealDamage(new M_Attack(rDamage), targets, target, attackers, attacker, false)[0];
			}
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
	if (hasEffect(target, "deliverance") && target.HP <= 0) {
		msg += "*YELLOW*" + tName + " is delivered from harm!\n";
		target.HP = 1;
	}
	if (target.HP <= 0) { //Death
		if (hasRune(attacker, "pearl")) {
			attacker.STAMINA = Math.min(MaxStamina(attacker), attacker.STAMINA + 20);
		}
		msg += deathCry(target, targets, attackers);
		attacker.REPORT.kills++;
	}
	return [msg, damage];
}

function PushTarget(C, target) {
	let msg = "";
	if (C.ROW >= target.ROW && target.ROW > 0) {
		msg += "*GREEN*The " + target.NAME + " is pushed back!\n";
		target.ROW--;
	}
	else if (C.ROW <= target.ROW && target.ROW < 4) {
		msg += "*GREEN*The " + target.NAME + " is pushed back!\n";
		target.ROW++;
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

function Cast(C, spell, allies, enemyList, targets) {
	let msg = "";
	if (spellAPCost(C, spell) > C.AP) {
		return "*RED*You don't have enough AP to cast this spell!\n";
	}
	if (spell.HP >= C.HP) {
		return "*RED*You don't have enough HP to cast this spell!\n";
	}
	let bonusDmg = 0;
	if (hasRune(C, "charcoal")) {
		bonusDmg++;
	}
	if (hasRune(C, "heavy")) {
		bonusDmg += 4;
	}
	if (isEquipped(C, "staff")) {
		bonusDmg++;
	}
	if (hasEffect(C, "ferocity")) {
		bonusDmg += 2;
	}
	
	if (hasRune(C, "spring")) {
		msg += Heal(C, 2);
	}
	
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
		C.AP -= spellAPCost(C, spell);
	}
	else {
		msg += "*CYAN*The spell costs no AP!\n";
	}
	C.HP -= spell.HP;
	C.REPORT.taken += spell.HP;
	
	
	let spellName = spell.name.toLowerCase();
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
			msg += CastMessage("A pin of radiant light streaks towards your foe!", t);
			msg += DealDamage(new M_Attack(9 + bonusDmg), allies, C, enemyList, enemyList[index])[0];
		}
		if (spellName == "swamp strike") {
			msg += CastMessage("A toxic blast assaults your foe!", t);
			msg += DealDamage(new M_Attack(4 + bonusDmg + rand(5)), allies, C, enemyList, enemyList[index])[0];
			msg += AddEffect(enemyList[index], "Poison", 3);
		}
		if (spellName == "spear") { // Deal 12-20 Damage to an enemy on your row.
			msg += CastMessage("A crude spear of jagged stone bursts out from the ground!", t);
			msg += DealDamage(new M_Attack(10 + rand(9) + bonusDmg), allies, C, enemyList, enemyList[index])[0];
		}
		if (spellName == "siphon") { //Deal 4-8 Damage and Heal 4 HP
			msg += CastMessage("You siphon health away from your foe!", t);
			msg += DealDamage(new M_Attack(4 + rand(5) + bonusDmg), allies, C, enemyList, enemyList[index])[0];
			msg += SpellHeal(allies, C, C, 4);
		}
		if (spellName == "pierce") { //Deal 4 True Damage to an enemy
			msg += CastMessage("A sharpened bolt of energy strikes through your foe.", t);
			msg += DealDamage(new M_Attack(4 + bonusDmg, 100), allies, C, enemyList, enemyList[index])[0];
		}
		if (spellName == "hemic strike") { //Lose 5 HP. Deal 14-18 Damage to an enemy
			msg += CastMessage("Beads of blood draw themselves from your palm, forming the sillhouette of your target", t);
			msg += DealDamage(new M_Attack(14 + rand(5) + bonusDmg), allies, C, enemyList, enemyList[index])[0];
		}
		if (spellName == "lightning") { //Deal 4 damage to a target. Deals +1 damage this turn
			msg += CastMessage("A shifting bolt of lightning arcs out from your hand towards your foe!", t);
			bonusDmg += countEffect(C, "lightning");
			msg += DealDamage(new M_Attack(4 + bonusDmg), allies, C, enemyList, enemyList[index])[0];
			AddEffect(C, "Lightning", 0);
		}
		if (spellName == "meditation") { //Gain 8 Stamina
			msg += CastMessage("You rest for a moment, and feel at peace.", t);
			C.STAMINA = Math.min(MaxStamina(C), C.STAMINA + 8);
		}
		if (spellName == "blink") { //Teleport to a targetted row
			if (C.ROW == index) {
				return "*RED*You're already on that row.";
			}
			msg += CastMessage("You flicker, and in an instant you're standing in R" + (index + 1) + ".", t);
			C.ROW = index;
		}
		if (spellName == "stoneskin") { //+8 Physical Armor +4 Magical Armor for 3 turns
			msg += CastMessage("Your skin numbs slightly as it becomes as sturdy as stone.", t);
			msg += AddEffect(C, "Stoneskin", 3);
		}
		if (spellName == "preparation") { //Gain 4 AP a turn. Lasts 3 turns
			msg += CastMessage("A moment of sheer lucidity washes over you, and time seems to slow.", t);
			msg += AddEffect(C, "Preparation", 3);
		}
		if (spellName == "ferocity") { //Your damaging spells do +2 DMG per instance this turn
			msg += CastMessage("Your thoughts are dulled by a lust for blood, and your senses seem to sharpen.", t);
			msg += AddEffect(C, "Ferocity", 3);
		}
		if (spellName == "roots") { //Root yourself for 3 turns. Heal 5 HP per turn for 3 turns
			msg += CastMessage("Roots extend from your flesh into the ground, and precious life flows begins to flow into you.", t);
			msg += AddEffect(C, "Regenerative", 3);
			msg += AddEffect(C, "Rooted", 3);
		}
		if (spellName == "feed flame") { //Gain 1 embers buff. Deal damage equal to the amount of embers you have. embers reduces your HP by 1 per turn
			msg += CastMessage("*YELLOW*A warm ember begins to burns in your soul.", t);
			AddEffect(C, "Ember", 999);
			bonusDmg += countEffect(C, "ember");
			msg += DealDamage(new M_Attack(bonusDmg), allies, C, enemyList, enemyList[index])[0];
		}
		if (spellName == "ignite") { //For each Ember buff you have, lose 2 HP and deal damage equal to half your total number of Ember buffs
			let embers = countEffect(C, "ember");
			if (embers == 0) {
				return "*RED*You need embers to ignite. . .\n";
			}
			if (C.HP <= embers * 2) {
				return "*RED*You don't have enough HP to ignite your embers. . .\n";
			}
			msg += CastMessage("*YELLOW*You ignite the potential within your soul into a burst of pure power.", t);
			C.HP -= embers * 2;
			C.REPORT.taken += embers * 2;
			for (let i = 0; i < embers; i++) {
				if (enemyList[index].HP > 0) {
					msg += DealDamage(new M_Attack(bonusDmg + Math.floor(embers/2)), allies, C, enemyList, enemyList[index])[0];
				}
			}
			removeEffect(C, "ember");
		}
		if (spellName == "summon beast") { //Lose 15 HP. Summon a random animal
			let animals = [];
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].TYPE == "animal") {
					animals.push(enemies[i]);
				}
			}
			let animal = animals[rand(animals.length)];
			let name = animal.NAME;
			msg += CastMessage(Prettify(an(name) + " " + name) + " is summoned on R" + (index + 1) + "!", t);
			allies.push(summon(name, index, true, true));
		}
		else if (spellName == "summon bees") {
			msg += CastMessage("A Swarm of Bees is summoned on R" + (index + 1) + "!", t);
			allies.push(summon("Swarm of Bees", index, true, true));
		}
		else if (spellName == "maintain") {
			msg += CastMessage("You focus your energy into maintaining your creation.", t);
			if (allies[index].SUMMONED) {
				msg += AddEffect(allies[index], "Fading", 4);
			}
			else {
				return "*RED*You must select a target that has been summoned!\n";
			}
		}
		else if (spellName == "summon zombie") {
			msg += CastMessage("A Zombie is summoned on R" + (index + 1) + "!", t);
			allies.push(summon("Zombie", index, true, true));
		}
		else if (spellName == "summon specter") {
			msg += CastMessage("An Apparition is summoned on R" + (index + 1) + "!", t);
			allies.push(summon("Apparition", index, true, true));
		}
		else if (spellName == "summon spores") {
			let num = 3 + rand(3);
			msg += CastMessage(num + " Spores are summoned on R" + (index + 1) + "!", t);
			for (let i = 0; i < num; i++) {
				allies.push(summon("Living Spore", index, true, true));
			}
		}
		else if (spellName == "summon anemone") {
			msg += CastMessage("A Giant Anemone is summoned on R" + (index + 1) + "!", t);
			allies.push(summon("Giant Anemone", index, true, true));
		}
		else if (spellName == "summon coral") {
			msg += CastMessage("A Coral Shard is summoned on R" + (index + 1) + "!", t);
			allies.push(summon("Coral Shard", index, true, true));
		}
		else if (spellName == "summon skeleton") {
			let skeletons = ["Skeletal Swordsman", "Skeletal Archer", "Skeletal Spearman"];
			let ran = rand(skeletons.length);
			msg += CastMessage("A " + skeletons[ran] + " is summoned on R" + (index + 1) + "!", t);
			allies.push(summon(skeletons[ran], index, true, true));
		}
		else if (spellName == "summon mushroom") {
			msg += CastMessage("A Toxic Mushroom is summoned on R" + (index + 1) + "!", t);
			allies.push(summon("Toxic Mushroom", index, true, true));
		}
		if (spellName == "empower") { //Your summoned creatures deal +3 Damage per attack for 3 turns
			msg += CastMessage("Your allies grow stronger!", t);
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].SUMMONED) {
					msg += AddEffect(allies[i], "Stronger", 3);
				}
			}
		}
		if (spellName == "shepherd") { //Heal your summoned creatures 4-8 HP
			msg += CastMessage("Your allies are healed!", t);
			let autumn = true;
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].SUMMONED) {
					msg += SpellHeal(allies, C, allies[i], 4 + rand(5), autumn);
					autumn = false;
				}
			}
		}
		if (spellName == "compensation") { //Heal 8 HP when an ally is killed. 999 Turns
			msg += CastMessage("A bond of blood forms between you and your allies.", t);
			msg += AddEffect(allies[i], "Compensation", 999);
		}
		if (spellName == "redirection") { //Transfer your debuffs to a target
			msg += CastMessage("You redirect your afflictions onto your foe!", t);
			let newEffects = [];
			for (const effect of C.EFFECTS) {
				if (effect.type == "debuff") {
					msg += AddEffect(enemyList[index], effect.name, 3, effect.target);
				}
				else {
					newEffects.push(effect);
				}
			}
			C.EFFECTS = newEffects;
		}
		if (spellName == "peel") { //Reduce a target's Physical & Magical Armor by 1
			msg += CastMessage("You peel away the defenses of the " + enemyList[index].NAME + "!", t);
			enemyList[index].ARMOR[0] = Math.max(0, enemyList[index].ARMOR[0] - 1);
			enemyList[index].ARMOR[1] = Math.max(0, enemyList[index].ARMOR[1] - 1);
		}
		if (spellName == "expose") { //Increase the damage taken by a target by 20% for 1 turn
			msg += CastMessage("Light shines upon your foe, revealing their inadequacies.", t);
			msg += AddEffect(enemyList[index], "Exposed", 1);
		}
		if (spellName == "bind") { //Root a target for 3 turns
			msg += CastMessage("You bind " + Name(enemyList[index]) + " where they stand.", t);
			msg += AddEffect(enemyList[index], "Rooted", 3);
		}
		if (spellName == "envenom") { //Inflict 3 turns of venom onto a target
			msg += CastMessage("You envenom the " + enemyList[index].NAME + "!", t);
			msg += AddEffect(enemyList[index], "Venom", 3);
		}
		if (spellName == "gale") { //Push a row of enemyList back one row
			msg += CastMessage("The wind picks up and howls!", t);
			for (let i = 0; i < enemyList.length; i++) {
				if (enemyList[i].ROW == index) {
					msg += PushTarget(C, enemyList[i]);
				}
			}
		}
		if (spellName == "disperse") { //Teleport every enemy on your row to a random row, at least 2 rows away from you
			msg += CastMessage("You disperse the foes around you!", t);
			for (let i = 0; i < enemyList.length; i++) {
				if (enemyList[i].ROW == C.ROW) {
					while (Math.abs(C.ROW - enemyList[i].ROW) < 2) {
						enemyList[i].ROW = rand(5);
					}
					msg += Prettify(Name(enemyList[i])) + " is teleported to R" + (enemyList[i].ROW+1) + "!\n";
				}
			}
		}
		if (spellName == "freeze") { //Deal 2-4 damage to a target. Has an 80% chance to stun
			let chance = rand(100);
			msg += CastMessage("*BLUE*" + Prettify(Name(enemyList[index])) + " is encased in a layer of ice!", t);
			msg += DealDamage(new M_Attack(2 + rand(3) + bonusDmg), allies, C, enemyList, enemyList[index])[0];
			msg += AddEffect(enemyList[index], "Stunned", 1);
		}
		if (spellName == "wall of fire") { //Deal 3-6 Damage to every enemy in a row and Burn them
			msg += CastMessage("*YELLOW*A wall of shimmering flame ignites before you!", t);
			for (let i = 0; i < enemyList.length; i++) {
				if (enemyList[i].ROW == index) {
					msg += DealDamage(new M_Attack(3 + rand(4) + bonusDmg), allies, C, enemyList, enemyList[i])[0];
				}
			}
		}
		if (spellName == "radiance") { //Deal 6-10 Damage to all enemyList on your row
			msg += CastMessage("Shimmering heat burns the enemies around you.", t);
			for (let i = 0; i < enemyList.length; i++) {
				if (enemyList[i].ROW == C.ROW) {
					msg += DealDamage(new M_Attack(6 + rand(5) + bonusDmg), allies, C, enemyList, enemyList[i])[0];
				}
			}
		}
		if (spellName == "reap") { //Lose 10 HP. Deal 4-6 Damage to all enemyList, healing 1 HP per target
			msg += CastMessage("You harvest the life force of your foes.", t);
			let heal = 0;
			for (let i = 0; i < enemyList.length; i++) {
				msg += DealDamage(new M_Attack(4 + rand(3) + bonusDmg), allies, C, enemyList, enemyList[i])[0];
				heal++;
			}
			msg += SpellHeal(allies, C, C, heal);
		}
		if (spellName == "blizzard") { //Deal 2-4 damage to every enemy and slow them
			msg += CastMessage("*BLUE*A frigid mist envelops your foes.", t);
			for (let i = 0; i < enemyList.length; i++) {
				msg += DealDamage(new M_Attack(2 + rand(3) + bonusDmg), allies, C, enemyList, enemyList[i])[0];
				msg += AddEffect(enemyList[i], "Slowed", 1);
			}
		}
		if (spellName == "gamble") { //Deal 2-12 damage to a random enemy in each row
			msg += CastMessage("*YELLOW*Scattered sunbeams shine down across the battlefield.", t);
			let rows = [[], [], [], [], []];
			for (let i = 0; i < enemyList.length; i++) {
				rows[enemyList[i].ROW].push(i);
			}
			for (let i = 0; i < rows.length; i++) {
				if (rows[i].length > 0) {
					let enemyIndex = rows[i][rand(rows[i].length)];
					msg += DealDamage(new M_Attack(2 + rand(15) + bonusDmg), allies, C, enemyList, enemyList[enemyIndex])[0];
				}
			}
		}
		if (spellName == "exploit") { //Deal 2 damage to every enemy per debuff they have
			msg += CastMessage("You prey upon the weaknesses of your enemies.", t);
			for (let i = 0; i < enemyList.length; i++) {
				let debuffs = numDebuffs(enemyList[i]);
				msg += DealDamage(new M_Attack(2 * numDebuffs + bonusDmg), allies, C, enemyList, enemyList[i])[0];
			}
		}
		if (spellName == "protection") { //+2 Physical Armor +2 Magical Armor for your allies 3 turns
			msg += CastMessage("An aura of defense extends out of you onto your allies", t);
			for (let i = 0; i < allies.length; i++) {
				msg += AddEffect(allies[i], "Protection", 3);
			}
		}
		if (spellName == "heal") { //Heal an ally 4-8 HP
			msg += CastMessage("You mend the wounds of your ally!", t);
			msg += SpellHeal(allies, C, allies[index], 4 + rand(5));
		}
		if (spellName == "rally") { //All allies gain 5 Stamina
			msg += CastMessage("You encourage and energize your comrades.", t);
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].TYPE == "player") {
					allies[i].STAMINA = Math.min(allies[i].STAMINA + 5, MaxStamina(allies[i]));
				}
			}
		}
		if (spellName == "guidance") { //Heal all allies 3 HP
			msg += CastMessage("You stand as a shining beacon of resilience on the battlefield.", t);
			let autumn = true;
			for (let i = 0; i < allies.length; i++) {
				msg += SpellHeal(allies, C, allies[i], 3, autumn);
				autumn = false;
			}
		}
		if (spellName == "transfer life") { //Lose 5 HP. Heal a target for 8-12 HP
			msg += CastMessage("The flesh around your ribs grows cold.", t);
			msg += SpellHeal(allies, C, allies[index], 8 + rand(5));
		}
		if (spellName == "purify") { //Remove all debuffs from an ally
			removeDebuffs(allies[index]);
			msg += CastMessage(allies[index].NAME + "'s afflictions are washed away.", t);
		}
		if (spellName == "deliverance") { //Target an ally, making them unable to die for 1 turn
			if (C.ID == allies[index].ID) {
				msg += "*RED*You can't cast deliverance on yourself!\n";
			}
			msg += CastMessage("A slight aura of golden light surrounds " + Name(allies[index]) + "!", t);
			msg += AddEffect(allies[index], "Deliverance", 1);
		}
	}
	return msg;
}

function summon(name, row, summoned = true, fading = false) {
	let index = 0;
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].NAME.toLowerCase() == name.toLowerCase()) {
			index = i;
		}
	}
	let copy = COPY(enemies[index]);
	if (fading) {
		AddEffect(copy, "Fading", 4);
	}
	copy.ROW = row;
	copy.SUMMONED = summoned;
	return copy;
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

function shitSort(list, property) {
	let sorted = [];
	while (list.length > 0) {
		let max = 0;
		for (let i = 1; i < list.length; i++) {
			if (list[i][property] > list[max][property]) {
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
			msg += DrawCombat("Testing", battle) + "\n";
		}
	}
	if (battle.allies.length > 0) {
		results[0] = 1;
	}
	else if (battle.enemies.length > 0) {
		results[1] = 1;
	}
	if (channel) {
		PrintMessage(parseText(msg), channel);
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
	if (data["town"].quests.length < 3) {
		while (data["town"].quests.length < 3) {
			data["town"].quests.push(createQuest());
		}
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
			msg += StackStrings(strTwo, "*RED*"+sorted[i].name, 25)+"*GREY*" + "\n";
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
				setTimeout(() => {PrintMessage(newMessage, channel);}, 200);
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
			msg += " *CYAN*" + item.target + " rune*BLACK* | ";
		}
		msg += "*YELLOW*" + item.value + "G*GREY*\n";
		msg += item.description + "\n";
	}
	if (max > 0) {
		msg += "*CYAN*Runes *BLACK*" + item.runes.length + "/" + max + "*GREY*\n";
		for (const rune of item.runes) {
			msg += StackStrings("*RED*   " + rune.name, "*YELLOW*" + rune.value + "G*GREY* " + rune.description, 30) + "\n";
		}
	}
	return msg;
}

function DrawBar(val, max, size, color, drawNum = true) {
	let str = "*GREY*[" + color;
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
	str += "*GREY*]";
	if (drawNum) {
		return str + "*BLACK* " + val + "/" + max;
	}
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
				if (effect.target != "") {
					name += " " + effect.target;
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
	}
	if (showEffects) {
		msg += "\n\n";
		msg += WriteEffects(enemy);
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
	let worthy = [];
	for (const death of graves) {
		if (death.LEVEL <= 2) {
			unmarked++;
		}
		else {
			worthy.push(death);
		}
	}
	worthy = shitSort(worthy, "LEVEL");
	for (const death of worthy) {
		msg += "*GREEN*" + death.NAME + "*GREY* the *BLUE*" + Prettify(death.CLASS) + "*GREY*, *YELLOW*Level " + death.LEVEL + "\n";
		if (death.DESCRIPTION) {
			msg += "*GREY*" + death.DESCRIPTION + "\n";
		}
		msg += "\n";
	}
	msg += "\n*GREY*";
	msg += unmarked + " of the graves are unmarked, having been left by adventurers who were too insignificant to be remembered. . .\n";
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
		msg += "*GREEN*" + C.NAME + "*GREY* the *CYAN*" + Prettify(C.CLASS) + "*BLACK* | " + levelStr + "*BLACK* | *YELLOW*" + C.XP + "*GREY*/*GREEN*" + C.LEVEL * 100 + "*GREY* XP*BLACK* | *CYAN*⛊*GREY*" + P_Armor(C) + " *CYAN*✱*GREY*" + M_Armor(C) +"*GREY*\n";
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
		if (newLines && i < (len - 1)) {
			msg += "\n";
		}
	}
	return msg;
}

function DrawSideList(symbol, allies, otherStr, statStr) {
	for (let i = 0; i < allies.length; i++) {
		let name = "*GREY*";
		if (allies[i].ENDED) {
			name = "*BLACK*";
		}
		name += allies[i].NAME;
		let buffs = 0;
		let debuffs = 0;
		name += "*GREEN*";
		for (const effect of allies[i].EFFECTS) {
			if (effect.type == "buff") {
				name += "+";
			}
		}
		name += "*RED*";
		for (const effect of allies[i].EFFECTS) {
			if (effect.type == "debuff") {
				name += "-";
			}
		}
		statStr += DrawBar(allies[i].HP, MaxHP(allies[i]), 15, "*RED*", false);
		statStr += " *CYAN*⛊*GREY*" + P_Armor(allies[i]) + " *CYAN*✱*GREY*" + M_Armor(allies[i]);
		if (allies[i].TYPE == "player") {
			statStr += "*BLACK* | *GREEN*" + allies[i].AP + " *BLACK*| *YELLOW*" + allies[i].STAMINA + " *BLACK*| ";
			let atks = 0;
			let word = " Attacks";
			for (const item of allies[i].INVENTORY) {
				if (item.equipped) {
					if (item.type == "weapon") {
						atks += item.attacks[0];
					}
					else if (item.type == "staff") {
						atks += MaxCasts(allies[i]) - allies[i].CASTS;
						word = " Casts"
					}
				}
			}
			statStr += "*RED*x" + atks;
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
		let tempStr = color + symbol + (i + 1) + " ";
		if (i < 9) {
			tempStr += " ";
		}
		tempStr += name;
		let text = "*BLACK*" + allies[i].HP + "/" + MaxHP(allies[i]);
		otherStr += StackStrings(tempStr, text, 34 - measureText(text), false) + "\n";
	}
	return [otherStr, statStr];
}

function DrawCombat(battleLocation, battle) {
	let allyHP = 0;
	let enemyHP = 0;
	let msg = "*RED*" + battleLocation + "*GREY* - *PINK*Level " + battle.level + "*GREY*\n\n";
	let battleStr = "*GREY*R1 *BLACK*|*GREY* R2 *BLACK*|*GREY* R3 *BLACK*|*GREY* R4 *BLACK*|*GREY* R5\n";
	battleStr += "*BLACK*======================*GREY*\n";
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

	otherStr = StackStrings(otherStr, statStr, 35);
	if (battle.loot.length > 0) {
		let lootStr = "\n*GREY*Loot\n"
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
	
	msg += StackStrings(battleStr, otherStr, 27);
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
			nameStr += "*GREY*" + (i + 1).toString().padStart(2, '0') + " - " + color + spell.name + "\n";
			APStr += "*GREEN*" + spellAPCost(C, spell) + "\n";
			color = "*RED*";
			if (spell.HP == 0) {
				color = "*BLACK*";
			}
			HPStr += color + spell.HP + "\n";
			rightStr += "*GREY*" + spell.description + "\n";
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
	msg += "*YELLOW*" + NPC.CONVERSATIONS[NPC.INDEX++] + "\n\n";
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
		else if (NPC.ITEMS[i].type == "rune" || NPC.ITEMS[i].type == "staff" || NPC.ITEMS[i].type == "scroll" || NPC.ITEMS[i].type == "spellbook") {
			let color = " *CYAN*";
			if (NPC.ITEMS[i].type == "staff") {
				color = " *RED*";
			}
			if (NPC.ITEMS[i].type == "scroll" || NPC.ITEMS[i].type == "spellbook") {
				color = " *PINK*";
			}
			descStr += color + NPC.ITEMS[i].description;
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
	msg += "\n*GREY*Your Gold: *YELLOW*" + C.GOLD;
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
	
	let requireCharacter = ["report", "heal", "cheat", "fish", "reel", "haircut", "inventory", "enchant", "level", "stop", "move", "discard", "delve", "equip", "dequip", "remove", "unequip", "here", "leave", "go", "travel", "enter", "leave", "move", "talk", "trade", "take", "suicide", "drink", "read", "learn", "order", "buy", "sell", "spells"];
	let requireBattle = ["start", "end", "cast", "attack", "flee", "drop"];
	
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
					data["town"].graves.push(new DeathReport(C.NAME, C.CLASS, C.LEVEL, C.REPORT, C.DESCRIPTION));
					data[message.author.id].CHARACTER = null;
					C = null;
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
			return ListCommands(index);
		}
		else if (keyword == "cheat") {
			C.SPELLS = [];
			for (let i = 0; i < spells.length; i++) {
				C.SPELLS.push(spells[i].name);
			}
			C.SP = 100;
			C.GOLD = 1000;
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
			msg += "*BLUE*Polearms - Polearms offer good damage and range. Enemies on the same row are pushed back when attacked.\n";
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
			if (C.HP > 0) {
				msg += RoomDescription(C);
			}
		}
		else if (keyword == "prosperity") {
			msg += "*YELLOW*Town Prosperity: " + data["town"].prosperity;
			msg += "\n\n";
			msg += "*YELLOW*Prosperity*GREY* is accumulated over time as *YELLOW*gold *GREY*is spent in town; tavern drinks earn prosperity at 3x the normal rate. It can also be earned by completing quests. Earning prosperity unlocks new *BLUE*buildings *GREY*and *GREEN*areas*GREY*."
		}
		else if (keyword == "quest" || keyword == "quests") {
			let quests = data["town"].quests;
			let i = 1;
			for (const quest of quests) {
				let index = findTarget(enemies, quest.enemy);
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
			msg += CommandAttack(COPY(words), C, index);
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
			msg += "*RED*" + C.NAME + " is no more.\n";
			let location = findLocation(C.LOCAION);
			for (let i = 0; i < location.players; i++) {
				if (location.players[i].ID == C.ID) {
					location.players.splice(i, 1);
					break;
				}
			}
			data["town"].graves.push(new DeathReport(C.NAME, C.CLASS, C.LEVEL, C.REPORT, C.DESCRIPTION));
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
		}
		else if (keyword == "spells") {
			msg += CommandSpells(C);
		}
		else if (keyword == "drink") {
			msg += CommandDrink(COPY(words), C);
		}
		else if (keyword == "classes") {
			msg += "*PINK*Peasant*GREY* - *CYAN*+2 END +2 VIT*GREY*. Starts with a club but *RED*no gold*GREY*.\n\n";
			msg += "*BLUE*Mage*GREY* - *CYAN*+2 MAG*GREY*. Starts with a wand and a simple spell. Mages are able to read spellbooks to choose powerful spells to unlock.\n\n";
			msg += "*PINK*Noble*GREY* - Starts with *YELLOW*150 gold*GREY*, a stylish shirt, and a scimitar. A *GREEN*loyal servant*GREY* follows you into battle.\n\n";
			msg += "*BLUE*Rogue*GREY* - *CYAN*+2 AVD*GREY*. Starts with *YELLOW*40 gold*GREY*, a cloak, and two daggers. Whenever you dodge an attack, deal 6 damage to your attacker.\n\n";
			msg += "*PINK*Warrior*GREY* - *CYAN*+1 VIT +1 DEX +2 Armor*GREY*. Starts with *YELLOW*25 gold*GREY*, a Leather Cuirass, a Hatchet, and a Buckler. Armor doesn't reduce your Stamina.\n\n";
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
							C = hero;
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
		else if (keyword == "retire") {
			if (index > -1) {
				return "*RED*You can't retire while delving!\n";
			}
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
					msg += "*GREEN*You pay 5 gold to sleep at the tavern.\n";
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