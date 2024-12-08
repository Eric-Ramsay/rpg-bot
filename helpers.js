function Dequip(C, invIndex) {
	if (C.INVENTORY[invIndex].equipped) {
		C.INVENTORY[invIndex].equipped = false;
		if (C.LEFT == invIndex) {
			C.LEFT = -1;
		}
		if (C.RIGHT == invIndex) {
			C.RIGHT = -1;
		}
		return "You unequip the *BLUE*" + C.INVENTORY[invIndex].name + "\n";
	}
	return "*RED*That item is not equipped!\n";
}

function removeColors(msg)
{
	let newMsg = "";
	let readingColor = false;
	for (const c of msg) {
		if (c == '*') {
			readingColor = !readingColor;
		}
		else if (!readingColor)
		{
			newMsg += c;
		}
	}
	return newMsg;
}

function Equip(C, invIndex) {
	if (C.INVENTORY[invIndex].equipped) {
		return "*RED*This item is already equipped!\n";
	}
	if (C.INVENTORY[invIndex].name == "Drowned Armor" && C.HP <= 20) {
		return "*RED*You don't have enough HP to equip this.\n";
	}
	if (C.INVENTORY[invIndex].type == "weapon" || C.INVENTORY[invIndex].type == "armor" || C.INVENTORY[invIndex].type == "staff" || C.INVENTORY[invIndex].type == "pole") {
		let index = BattleIndex(C.ID);
		if (C.INVENTORY[invIndex].type == "armor") {
			for (let i = 0; i < C.INVENTORY.length; i++) {
				if (C.INVENTORY[i].type == "armor" && C.INVENTORY[i].equipped) {
					C.INVENTORY[i].equipped = false;
				}
			}
		}
		else {
			if (C.INVENTORY[invIndex].type == "pole" || C.INVENTORY[invIndex].type == "staff" || C.INVENTORY[invIndex].hands == 2) {
				if (C.LEFT > -1 && C.LEFT < C.INVENTORY.length) {
					C.INVENTORY[C.LEFT].equipped = false;
				}
				if (C.RIGHT > -1 && C.RIGHT < C.INVENTORY.length) {
					C.INVENTORY[C.RIGHT].equipped = false;
				}
				C.LEFT = invIndex;
				C.RIGHT = invIndex;
				resetPercent(C, LEFT);
				resetPercent(C, RIGHT);
			}
			else {
				if (C.LEFT == -1) {
					C.LEFT = invIndex;
					resetPercent(C, LEFT);
				}
				else if (C.RIGHT == -1) {
					C.RIGHT = invIndex;
					resetPercent(C, RIGHT);
				}
				else if (C.LEFT == C.RIGHT) {
					C.INVENTORY[C.LEFT].equipped = false;
					C.LEFT = -1;
					C.RIGHT = -1;
				}
				if (C.LEFT != invIndex && C.RIGHT != invIndex) {
					let ran = rand(2);
					if (ran == 0) {
						C.LEFT = invIndex;
						resetPercent(C, LEFT);
					}
					else {
						C.RIGHT = invIndex;
						resetPercent(C, RIGHT);
					}
				}
			}
		}
		if (index > -1 && battles[index].started) {
			if (C.INVENTORY[invIndex].type == "weapon" || C.INVENTORY[invIndex].type == "staff") {
				C.ENDED = true;
			}
		}
		C.INVENTORY[invIndex].equipped = true;
		return "You equip the *BLUE*" + C.INVENTORY[invIndex].name + "*GREY*.\n";
	}
	else {
		return "*RED*You can't equip that.\n";
	}
}

function CanTake(C, item) {
	return (C.INVENTORY.length < 5 || (C.BACKPACK && C.INVENTORY.length < 15) || C.INVENTORY.length == 5 && item.name.toLowerCase() == "backpack");
	return false;
}

function itemName(item) {
	let name = item.name;
	if (item.runes) {
		for (const rune of item.runes) {
			name += "+";
		}
	}
	return name;
}	

function LootItem(C, battle, index) {
	let item = COPY(battle.loot[index]);
	let name = itemName(item);
	if (!CanTake(C, item)) {
		return "*RED*You don't have room in your inventory to take that.\n";
	}
	battle.loot.splice(index, 1);
	if (item.type == "mimic") {
		let msg = "*RED*It's a mimic!\n";
		for (const ally of battle.allies) {
			ally.ENDED = true;
		}
		battle.started = true;
		battle.allyTurn = true;	
		let enemy = summon("Mimic", C.ROW, false);
		enemy.MaxHP += 15 * C.LEVEL;
		enemy.HP = enemy.MaxHP;
		enemy.DIFFICULTY += 6 * C.LEVEL;
		AddEffect(enemy, "resilient", 1);
		battle.enemies.push(enemy);
		msg += HandleCombat(battle);
		return msg;
	}
	else {
		C.INVENTORY.push(item);
		return "*GREEN*You take the *BLUE*" + name + "\n";
	}
}

function removeDebuffs(C) {
	let newEffects = [];
	for (const effect of C.EFFECTS) {
		if (effect.name.toLowerCase() == "stunned") {
			C.ENDED = false;
		}
		if (effect.type == "buff") {
			newEffects.push(effect);
		}
	}
	C.EFFECTS = newEffects;
}

function numDebuffs(C) {
	let num = 0;
	for (const effect of C.EFFECTS) {
		if (effect.type == "debuff") {
			num++;
		}
	}
	return num;
}

function numBuffs(C) {
	let num = 0;
	for (const effect of C.EFFECTS) {
		if (effect.type == "buff") {
			num++;
		}
	}
	return num;
}

function RemoveEffect(C, name, clear = false) {
	let cursed = hasEffect(C, "cursed");
	for (let i = C.EFFECTS.length - 1; i >= 0; i--) {
		if (C.EFFECTS[i].name.toLowerCase() == name.toLowerCase()) {
			if (!cursed || C.EFFECTS[i].name == "Cursed" || C.EFFECTS[i].type == "buff") {
				if (clear) {
					C.EFFECTS[i].stacks = 0;
				}
				if (--C.EFFECTS[i].stacks <= 0) {
					C.EFFECTS.splice(i, 1);
				}
			}
		}
	}
}

function countEffect(C, name) {
	let effect = hasEffect(C, name);
	if (effect) {
		return effect.stacks;
	}
	return 0;
}

function hasEffect(C, name) {
	for (let i = 0; i < C.EFFECTS.length; i++) {
		let effect = C.EFFECTS[i];
		if (effect.name.toLowerCase() == name.toLowerCase()) {
			return effect;
		}
	}
	return null;
}

function hasWeaponRune(weapon, name) {
	if (weapon == null || weapon.type != "weapon") {
		return false;
	}
	for (const rune of weapon.runes) {
		if (rune.toLowerCase() == name.toLowerCase()) {
			return true;
		}
	}
	return false;
}

function hasRune(C, name) {
	if (C.TYPE != "player") {
		return false;
	}
	for (const item of C.INVENTORY) {
		if (item.equipped) {
			for (const rune of item.runes) {
				if (rune.toLowerCase() == name.toLowerCase()) {
					return true;
				}
			}
		}
	}
	return false;
}

function hitPercent(C, hand) {
	if (C.ATTEMPTS[hand] > 0) {
		return 100 * (C.HITS[hand]/C.ATTEMPTS[hand]);
	}
	return 100;
}

function resetPercent(C, hand) {
	C.HITS[hand] = 1;
	C.ATTEMPTS[hand] = 1;
}

function AddEffect(C, eName, duration, attacker = null, target = null, stacks = 1) {
	let msg = "";
	let name = Prettify(Name(C));
	let effect = null
	eName = eName.toLowerCase();
	for (let i = 0; i < effects.length; i++) {
		if (effects[i].name.toLowerCase() == eName) {
			effect = COPY(effects[i]);
			break;
		}
	}
	
	if (attacker != null && effect.type == "debuff" && hasRune(C, "equality")) {
		msg += AddEffect(attacker, eName, duration, null, target, stacks) + "\n";
	}
	
	let immune = false;
	if (C.TYPE == "boss") {
		if (eName == "stunned") {
			immune = true;
		}
	}
	if (eName == "poison" && isEquipped(C, "blood staff")) {
		immune = true;
	}
	if (C.TYPE == "construction") {
		if (eName == "terrified" || eName == "whipped" || eName == "bleed" || eName == "venom" || eName == "poison" || eName == "blinded") {
			immune = true;
		}
	}
	if (C.TYPE == "evil") {
		if (eName == "whipped" || eName == "bleed") {
			immune = true;
		}
	}
	if (C.TYPE == "plant" && eName == "blinded") {
		immune = true;
	}
	if (immune) {
		return "*RED*" + name + " is immune to the effect '" + effect.name + "'!\n";
	}
	
	effect.target = target;
	let printName = effect.name;
	if (effect.target) {
		printName += " " + effect.target.NAME;
	}
	for (let i = 0; i < C.EFFECTS.length; i++) {
		if (C.EFFECTS[i].name.toLowerCase() == eName) {
			if (eName == "stunned") {
				return "*RED*" + name + " is immune to the effect '" + printName + "'!\n";
			}
			if ((!C.EFFECTS[i].target && !target) || C.EFFECTS[i].target.ID == target.ID) {
				C.EFFECTS[i].duration = Math.max(C.EFFECTS[i].duration, duration);
				if (effect.stackable) {
					C.EFFECTS[i].stacks += stacks;
					if (effect.type == "buff") {
						msg = "*CYAN*" + name + " gains the effect '*GREY*" + printName + "*CYAN*'!\n";
					}
					else {
						msg = "*CYAN*" + name + " is afflicted with the effect '*GREY*" + printName + "*CYAN*'!\n";
					}
				}
				return msg;
			}
		}
	}
	if (effect.type == "buff") {
		msg = "*CYAN*" + name + " is buffed with the effect '*GREY*" + effect.name + "*CYAN*'!\n";
	}
	else {
		msg = "*CYAN*" + name + " is afflicted with the effect '*GREY*" + effect.name + "*CYAN*'!\n";
	}
	effect.stacks = stacks;
	effect.duration = duration;
	C.EFFECTS.push(effect);
	return msg;
}

function findStep(speaker, id) {
	for (const step of steps) {
		if (step.speaker.toLowerCase() == speaker.toLowerCase() && step.id.toLowerCase() == id.toLowerCase()) {
			return step;
		}
	}
	console.log("Couldn't find step with speaker '" + speaker + "' and id '" + id + "'!");
	return steps[0];
}

function findThing(list, target) {
	let index = -1;
	index = parseInt(target) - 1;
	if (isNaN(index) || index == -1) {
		index = -1;
		for (let i = 0; i < list.length; i++) {
			if (list[i].toLowerCase() == target.toLowerCase()) {
				return i;
			}
		}
	}
	return index;
}

function findSpell(list, target) {
	let index = -1;
	index = parseInt(target) - 1;
	if (isNaN(index) || index == -1) {
		for (let i = 0; i < list.length; i++) {
			if (list[i].name.toLowerCase() == target.toLowerCase()) {
				return i;
			}
		}
	}
	return index;
}

function maxRunes(item) {
	let max = 0;
	if (item.type == "weapon") {
		max = 1 + (2*item.hands);
		if (item.subclass == "blade") {
			max++;
		}
	}
	else if (item.type == "armor") {
		max = 5;
	}
	else if (item.type == "staff") {
		max = 4;
		if (item.name.toLowerCase() == "wand") {
			max = 1;
		}
	}
	if (item.name == "Fishnet Stockings") {
		max += 2;
	}
	if (item.runes) {
		for (const rune of item.runes) {
			if (rune.toLowerCase() == "tackle box") {
				max += 3;
			}
		}
	}
	return max;
}

function spellHPCost(C, spell) {
	let cost = 0;
	
	if (hasRune(C, "pearl")) {
		cost += spellAPCost(C, spell, true);
	}
	if (hasRune(C, "sanguine")) {
		cost += 3 + spellAPCost(C, spell, true);
	}
	return cost + spell.HP;
}

function spellAPCost(C, spell, checking = false) {
	let cost = spell.AP;
	if (hasRune(C, "hollow")) {
		cost--;
	}
	if (hasRune(C, "heavy")) {
		cost += 2;
	}
	if (spell.name == "Holy Flame") {
		cost = C.AP;
	}
	if (!checking && hasRune(C, "sanguine")) {
		cost = 0
	}
	if (C.CLASS == "sorcerer") {
		cost *= 2;
	}
	return cost;
}

function SpellHeal(allies, healer, target, amount, autumn = true) {
	let msg = "";
	let bonus = 0;
	if (isEquipped(healer, "crook")) {
		bonus += 2;
	}
	msg = Heal(target, amount + bonus);
	if (autumn) {
		if (hasRune(healer, "autumn")) {
			let weak = [];
			for (let i = 0; i < allies.length; i++) {
				if (allies[i].HP < MaxHP(allies[i])) {
					weak.push(i);
				}
			}
			if (weak.length > 0) {
				let ran = weak[rand(weak.length)];
				msg += "*GREEN*" + Heal(allies[ran], 3 + bonus);
			}
			
		}
	}
	return msg;
}

function MaxSpells(C) {
	let numSpells = C.STATS[MAG];
	if (C.CLASS == "mage") {
		numSpells *= 2;
	}
	return numSpells;
}

function MaxCasts(C) {
	let numCasts = 1 + Math.floor(C.STATS[MAG]/2);
	if (C.CLASS == "mage") {
		numCasts = C.STATS[MAG];
	}
	if (hasRune(C, "light")) {
		numCasts += 2;
	}
	if (hasRune(C, "focus")) {
		return 1;
	}
	return numCasts;
}

function Heal(C, health, overheal = false) {
	let startHP = C.HP;
	let amount = health;
	let multiplier = 1;
	if (hasRune(C, "vine") && C.HP < MaxHP(C)/2) {
		multiplier *= 1.5;
	}
	if (hasEffect(C, "poison")) {
		multiplier *= .5;
	}
	if (hasEffect(C, "necrosis")) {
		multiplier = 0;
	}
	//Beware of floating point fuckery
	if (multiplier != 1) {
		amount = Math.round(amount * multiplier);
	}
	if (isEquipped(C, "crook")) {
		amount++;
	}
	C.HP += amount;
	if (C.HP > MaxHP(C)) {
		if (overheal) {
			C.MaxHP = C.HP;
		}
		else {
			C.HP = MaxHP(C);
		}
	}
	if ((C.HP - startHP) <= 0) {
		return "";
	}
	return "*PINK*" + Prettify(Name(C)) + " is healed for " + (C.HP - startHP) + " HP!\n";
}

function shitSort(list, property, flip = false, secondary = "") {
	let sorted = [];
	while (list.length > 0) {
		let max = 0;
		for (let i = 1; i < list.length; i++) {
			if (list[i][property] > list[max][property]) {
				max = i;
			}
			else if (list[i][property] == list[max][property]) {
				if (secondary != "") {
					if (list[i][secondary] && list[max][secondary] && list[i][secondary] < list[max][secondary]) {
						max = i;
					}
				}
				else if (list[i].NAME && list[max].NAME) {
					if (list[i].NAME < list[max].NAME) {
						max = i;
					}
				}
				else if (list[i].name && list[max].name) {
					if (list[i].name < list[max].name) {
						max = i;
					}
				}
			}
		}
		sorted.push(list[max]);
		list.splice(max, 1);
	}
	if (flip) {
		return sorted.reverse();
	}
	return sorted;
}

function prepMerchant() {
	let rareItems = [];
	let inventory = ["Warp Potion", "Rage Potion", "Tears of a God", "Scroll: Gamble"]
	for (let i = 0; i < items.length; i++) {
		if (items[i].rare) {
			rareItems.push(items[i].name);
		}
	}
	for (let i = 0; i < 3; i++) {
		let ran = rand(rareItems.length);
		inventory.push(rareItems[ran]);
		rareItems.splice(ran, 1);
	}
	for (let i = 0; i < inventory.length; i++) {
		inventory[i] = startItem(inventory[i]);
	}
	
	inventory = shitSort(inventory, "type");
	
	for (let i = 0; i < locations.length; i++) {
		if (locations[i].id == "A Strange Clearing") {
			for (let j = 0; j < locations[i].people.length; j++) {
				if (locations[i].people[j].NAME == "Wandering Merchant") {
					locations[i].people[j].ITEMS = inventory;
				}
			}
		}
	}
}

function RemoveItem(C, index) {
	if (index == C.LEFT) {
		C.LEFT = -1;
	}
	else if (index < C.LEFT) {
		C.LEFT--;
	}
	if (index == C.RIGHT) {
		C.RIGHT = -1;
	}
	else if (index < C.RIGHT) {
		C.RIGHT--;
	}
	C.INVENTORY[index].equipped = false;
	C.INVENTORY.splice(index, 1);
}

function startItem(item) {
	for (let i = 0; i < items.length; i++) {
		if (items[i].name.toLowerCase() == item.toLowerCase()) {
			return COPY(items[i])
		}
	}
	return items[0];
}

function findTarget(list, target) {
	let index = -1;
	if (target[0] == "e" || target[0] == "p") {
		index = parseInt(target.substring(1));
	}
	if (isNaN(index) || index <= 0 || index > list.length) {
		let closest = -1;
		for (let i = 0; i < list.length; i++) {
			if (list[i].HP > 0 && list[i].NAME.toLowerCase() == target.toLowerCase()) {
				if (closest == -1 || list[closest].ROW > list[i].ROW) {
					closest = i;
				}
			}
		}
		return closest;
	}
	else {
		return index - 1;
	}
	return -1;
}

function GetPoleTier(C) {
	if (isEquipped(C, "fishing pole")) {
		return 1;
	}
	if (isEquipped(C, "masterwork pole")) {
		return 2;
	}
	if (isEquipped(C, "divine pole")) {
		return 3;
	}
	return 0;
}

function findPlayer(name) {
	for (var player in data) {
		if (data[player].CHARACTER && data[player].CHARACTER.NAME.toLowerCase() == name.toLowerCase()) {
			return data[player].CHARACTER;
		}
	}
	return null;
}

function findPerson(people, target) {
	for (let i = 0; i < people.length; i++) {
		if (people[i].NAME.toLowerCase() == target.toLowerCase()) {
			return i;
		}
	}
	return -1;
}

function searchInList(words, list) {
	if (words.length == 0) {
		return [words, -1];
	}
	let index = parseInt(words[0]);
	if (isNaN(index)) {
		index = parseInt(words[0].slice(1, words[0].length));
	}
	if (!isNaN(index)) {
		index--;
		words = words.slice(1, words.length);
	}
	else {
		index = -1;
		let checkStr = "";
		let count = 0;
		do {
			if (count > 0) {
				checkStr += " ";
			}
			checkStr += words[0];
			words = words.slice(1, words.length);
			for (let i = 0; i < list.length; i++) {
				if (list[i].name && list[i].name.toLowerCase() == checkStr.toLowerCase()) {
					index = i;
				}
				if (list[i].NAME && list[i].NAME.toLowerCase() == checkStr.toLowerCase()) {
					index = i;
				}
				if (typeof list[i] === 'string' && list[i].toLowerCase() == checkStr.toLowerCase()) {
					index = i;
				}
				if (index != -1) {
					break;
				}
			}
		} while (index == -1 && count++ < words.length);
	}
	if (index < 0 || index >= list.length) {
		index = -1;
	}
	return [words, index]
}

function findItem(itemList, target, hesitate = false, useNumber = true) {
	let invIndex = -1;
	if (useNumber) {
		invIndex = parseInt(target);
	}
	let potential = -1;
	if (isNaN(invIndex) || invIndex == -1) {
		for (let i = 0; i < itemList.length; i++) {
			if (itemList[i].name.toLowerCase() == target.toLowerCase()) {
				if (hesitate && itemList[i].equipped) {
					potential = i;
				}
				else {
					return i;
				}
			}
		}
		if (potential > -1) {
			return potential;
		}
	}
	else if (invIndex <= itemList.length){
		return invIndex - 1;
	}
	return -1;
}

function findBuilding(name) {
	for (let j = 0; j < buildings.length; j++) {
		if (buildings[j].id.toLowerCase() == name.toLowerCase()) {
			return buildings[j];
		}
	}
	return null;
}

function takeItem(C, item) {
	if (C.INVENTORY.length < 5 || (C.BACKPACK && C.INVENTORY.length < 15) || (!C.BACKPACK && item.name.toLowerCase() == "backpack")) {
		if (item.name.toLowerCase() == "backpack" && !C.BACKPACK) {
			C.BACKPACK = true;
		}
		else {
			item.equipped = false;
			C.INVENTORY.push(item);
		}
	}
}

function rand(num) {
	return Math.floor(Math.random() * num);
}

function w_attacks(C, weapon) {
	let base = weapon.attacks[1];
	
	for (const rune of weapon.runes) {
		if (rune.toLowerCase() == "invigorant") {
			base++;
		}
	}
	
	return base;
}

function a_physical(C, armor) {
	let base = armor.armor[0];
	
	for (const rune of armor.runes) {
		if (rune.toLowerCase() == "impervious") {
			base += 3;
		}
	}
	
	return base;
}

function a_magical(C, armor) {
	let base = armor.armor[1];
	
	for (const rune of armor.runes) {
		if (rune.toLowerCase() == "impervious") {
			base += 3;
		}
	}
	
	return base;
}


function w_AP(C, weapon) {
	let base = weapon.AP;
	
	for (const rune of weapon.runes) {
		if (rune.toLowerCase() == "density") {
			base += 3;
		}
	}
	
	return base;
}

function w_pen(C, weapon) {
	let base = weapon.pen;
	
	for (const rune of weapon.runes) {
		if (rune.toLowerCase() == "orisha") {
			base += 30;
		}
	}
	
	return Math.min(100, base);
}

function w_min(C, weapon) {
	let base = weapon.min;
	
	for (const rune of weapon.runes) {
		if (rune.toLowerCase() == "accurate") {
			base += weapon.hands;
		}
		if (rune.toLowerCase() == "precise") {
			base += 3;
		}
		if (rune.toLowerCase() == "density") {
			base += 8;
		}
	}
	
	return base;
}

function w_max(C, weapon) {
	let base = weapon.max;
	
	for (const rune of weapon.runes) {
		if (rune.toLowerCase() == "accurate") {
			base += weapon.hands;
		}
		if (rune.toLowerCase() == "precise") {
			base += 3;
		}
		if (rune.toLowerCase() == "density") {
			base += 8;
		}
	}
	
	base += C.STATS[WEP];
	
	return base;
}

function w_range(C, weapon) {
	let base = weapon.range;
	
	for (const rune of weapon.runes) {
		if (rune.toLowerCase() == "reach") {
			base += 2;
		}
	}
	
	return base;
}

function w_chance(C, weapon) {
	let base = weapon.chance;
	
	for (const rune of weapon.runes) {
		if (rune.toLowerCase() == "accurate") {
			base += 10;
		}
	}
	if (C.CLASS == "duelist") {
		base += 10;
	}
	
	return Math.min(100, base);
}

function P_Armor(C) {
	let armor = C.ARMOR[0];
	if (C.TYPE == "player") {
		if (C.CLASS == "warrior") {
			armor += 2;
		}
		for (const item of C.INVENTORY) {
			if (item.type == "armor" && item.equipped) {
				armor += a_physical(C, item);
				break;
			}
		}
	}
	if (isEquipped(C, "coral staff")) {
		armor += 4;
	}
	if (hasEffect(C, "buried")) {
		armor += 4;
	}
	if (hasEffect(C, "healing in shell")) {
		armor += 12;
	}
	if (hasEffect(C, "stoneskin")) {
		armor += 8;
	}
	if (hasEffect(C, "protection")) {
		armor += 2;
	}
	if (hasEffect(C, "peeled")) {
		armor = 0;
	}
	return armor;
}
function M_Armor(C) {
	let armor = C.ARMOR[1];
	if (C.TYPE == "player") {
		if (C.CLASS == "warrior") {
			armor += 2;
		}
		for (const item of C.INVENTORY) {
			if (item.type == "armor" && item.equipped) {
				armor += a_magical(C, item);
				break;
			}
		}
	}
	if (isEquipped(C, "coral staff")) {
		armor += 4;
	}
	if (hasEffect(C, "buried")) {
		armor += 4;
	}
	if (hasEffect(C, "healing in shell")) {
		armor += 6;
	}
	if (hasEffect(C, "stoneskin")) {
		armor += 4;
	}
	if (hasEffect(C, "protection")) {
		armor += 2;
	}
	if (hasEffect(C, "peeled")) {
		armor = 0;
	}
	return armor;
}

function MaxHP(C) {
	if (C.TYPE != "player") {
		return C.MaxHP;
	}
	let bonus = 0;
	if (hasRune(C, "stout")) {
		bonus += 15;
	}
	if (isEquipped(C, "Drowned Armor")) {
		bonus -= 25;
	}
	if (hasRune(C, "fortified")) {
		bonus += 3 * C.STATS[VIT];
	}
	return bonus + 30 + C.STATS[VIT] * 10;
}

function MaxAP(C) {
	let bonus = 0;
	if (C.TYPE == "player") {
		for (let i = 0; i < C.INVENTORY.length; i++) {
			if (C.INVENTORY[i].type == "armor" && C.INVENTORY[i].equipped) {
				bonus -= C.INVENTORY[i].AP;
			}
		}
	}
	return bonus + 6 + C.STATS[DEX] * 3 + C.STATS[AVD];
	
}

function MaxStamina(C) {
	let bonus = 0;
	if (hasRune(C, "stout")) {
		bonus = 25;
	}
	if (C.TYPE == "player" && C.CLASS != "warrior") {
		for (let i = 0; i < C.INVENTORY.length; i++) {
			if (C.INVENTORY[i].type == "armor" && C.INVENTORY[i].equipped) {
				bonus -= C.INVENTORY[i].AP * 5;
			}
		}
	}
	return Math.max(0, bonus + 30 + C.STATS[END] * 15);
}

function Travel(C, newLocation, index = -1) {
	if (index > -1) {
		if (!battles[index].started) {
			let battle = battles[index];
			for (let a = battle.allies.length - 1; a >= 0; a--) {
				if (battle.allies[a].ID == C.ID) {
					battle.allies.splice(a, 1);
					break;
				}
			}
		}
	}
	for (let i = 0; i < locations.length; i++) {
		if (locations[i].id.toLowerCase() == C.LOCATION.toLowerCase()) {
			for (let i = 0; i < locations[i].players; i++) {
				if (locations[i].players[i].ID == C.ID) {
					locations[i].players.splice(i, 1);
					break;
				}
			}
		}
	}
	
	C.LOCATION = newLocation.id;
	newLocation.players.push(C);
}

function BattleIndex(ID) {
	let index = 0;
	for (const battle of battles) {
		if (!battle.ended) {
			for (const ally of battle.allies) {
				if (ally.ID == ID) {
					return index;
				}
			}
			index++;
		}
	}
	return -1;
}

function findLocation(location) {
	for (let i = 0; i < locations.length; i++) {
		if (locations[i].id == location) {
			return locations[i];
		}
	}
	return locations[0];
}

function CanUseWeapon(C, index, range = 0) {
	if (C.INVENTORY[index].type != "weapon") {
		return false;
	}
	if (C.INVENTORY[index].AP > C.AP) {
		return false;
	}
	if (C.INVENTORY[index].range <= range) {
		return false;
	}
	if (C.INVENTORY[index].attacks[0] <= 0) {
		return false;
	}
	return true;
}


function genSillyName() {
	var beg = ["Zin", "Koin", "Ur", "Guan", "Bob", "Sh", "Shl", "Shr", "Ch", "B", "R", "Bl", "Pl", "J", "H", "Shr", "D", "Qu", "Bal", "Br", "Dr", "Chl", "G", "Gr", "Beet", "Helm", "Far", "Bor", "Cab", "D"];
	var mid = ["om", "omb", "air", "im", "imb", "int", "ul", "ur", "unt", "eb", "imp", "umb", "on", "eeb", "org", "alm", "ail", "oil", "oin", "oim", "adink", "erd", "ek", "eep", "eev", "oiler"];
	var end = ["ave", "ad", "at", "do", "o", "ly", "ison", "abob", "ius", "adeer", "by", "erson", "ey", "ert", "erd", "org", "us", "eus", "erg", "adoo", "a", "erp", "amo", "amus", "ador", "s", "stein", "lus", "adub", "adoil", "ong", "ang"];
	let name = mid[rand(mid.length)];
	let start = beg[rand(beg.length)]
	let hold = true;
	while (hold || rand(2 == 0)) {
		hold = false;
		let marked = false;
		if (rand(2) == 0) {
			name += mid[rand(mid.length)];
			marked = true;
		}
		if (rand(3) == 0) {
			name += end[rand(end.length)];
			marked = true;
		}
	}
	if (name.length > 3 && rand(4) == 0) {
		return Prettify(name);
	}
	return start + "" + name;
}

function genName(male) {
	var name = "";
	var mBegs = ["Le", "Ke", "Je", "Be", "Me", "Ko", "Ye", "E", "Cy", "Ce", "Ci", "A"];
	var mMids = ["k", "r", "ke", "re", "vin", "t", "s", "d", "v", "b"];
	var mEnds = ["os", "ih", "o", "it", "en", "in", "de", "des", "re", "ro", "ov", "us", "on", "ic", "am", "es", "ev"];

	var fBegs = [["Su", "A", "E", "O", "Ke", "Ti", "Di", "De", "Li", "Ki", "Ve", "Ma", "Ni", "Ari", "So", "Ky"], ["Al", "Ev", "Ky", "Em", "An"]];
	var fMids = [["or", "ex", "an", "et", "el"], ["k", "r", "n", "c", "s", "r", "ret", "ken", "y"]];
	var fEnds = ["a", "i", "ei", "is", "ia", "a", "iev", "ana", "in"];
	if (male) {
		return "" + mBegs[Math.floor(Math.random() * mBegs.length)] + "" + mMids[Math.floor(Math.random() * mMids.length)] + "" + mEnds[Math.floor(Math.random() * mEnds.length)];
	}
	else {
		var lon = Math.random();
		if (lon > fBegs[0].length / (fBegs[0].length + fBegs[1].length)) { lon = 1; } else { lon = 0; }
		name += fBegs[lon][Math.floor(Math.random() * fBegs[lon].length)];
		lon = (lon + 1) % 2;
		name += fMids[lon][Math.floor(Math.random() * fMids[lon].length)];
		lon = 0;
		name += fEnds[lon][Math.floor(Math.random() * fEnds[lon].length)];
		return name;
	}
}