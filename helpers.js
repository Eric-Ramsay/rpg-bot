function Dequip(C, invIndex) {
	if (C.INVENTORY[invIndex].type == "weapon" || C.INVENTORY[invIndex].type == "armor") {
		C.INVENTORY[invIndex].equipped = false;
		if (C.INVENTORY[invIndex].type == "armor") {
			C.ARMOR[0] -= C.INVENTORY[invIndex].armor[0];
			C.ARMOR[1] -= C.INVENTORY[invIndex].armor[1];
		}
		if (C.LEFT == invIndex) {
			C.LEFT = -1;
		}
		if (C.RIGHT == invIndex) {
			C.RIGHT = -1;
		}
		return "You unequip the *BLUE*" + C.INVENTORY[invIndex].name;
	}
}

function Equip(C, invIndex) {
	if (C.INVENTORY[invIndex].type == "weapon" || C.INVENTORY[invIndex].type == "armor" || C.INVENTORY[invIndex].type == "staff" || C.INVENTORY[invIndex].type == "pole") {
		let index = BattleIndex(C.ID);
		if (index > -1 && battles[index].started) {
			let cost = 3 + APCost(C);
			if (C.AP < cost) {
				return "*RED*You don't have enough AP to equip anything.";
			}
			C.AP -= cost;
		}
		if (C.INVENTORY[invIndex].type == "armor") {
			for (let i = 0; i < C.INVENTORY.length; i++) {
				if (C.INVENTORY[i].type == "armor" && C.INVENTORY[i].equipped) {
					C.INVENTORY[i].equipped = false;
					C.ARMOR[0] -= C.INVENTORY[i].armor[0];
					C.ARMOR[1] -= C.INVENTORY[i].armor[1];
				}
			}
			C.ARMOR[0] += C.INVENTORY[invIndex].armor[0];
			C.ARMOR[1] += C.INVENTORY[invIndex].armor[1];
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
	if (item.type == "weapon" || item.type == "armor") {
		for (const rune of item.runes) {
			item += "+";
		}
	}
	return name;
}

function LootItem(C, loot, index) {
	let name = itemName(loot[index]);
	if (!CanTake(C, loot[index])) {
		return "*RED*You don't have room in your inventory to take that.\n";
	}
	C.INVENTORY.push(loot[index]);
	loot.splice(index, 1);
	return "*GREEN*You take the *BLUE*" + name + "\n";
}


function hasEffect(C, name) {
	for (let i = 0; i < C.EFFECTS.length; i++) {
		if (C.EFFECTS[i].name.toLowerCase() == name.toLowerCase()) {
			return true;
		}
	}
	return false;
}

function hasWeaponRune(weapon, name) {
	if (weapon.type != "weapon") {
		console.log("ERROR! Wrong type passed to hasWeaponRune!");
		return false;
	}
	for (const rune of weapon.runes) {
		if (rune.name.toLowerCase() == name.toLowerCase()) {
			return true;
		}
	}
}

function hasRune(C, name) {
	if (C.TYPE != "player") {
		return false;
	}
	for (const item of C.INVENTORY) {
		if (item.equipped) {
			for (const rune of item.runes) {
				if (rune.name.toLowerCase() == name.toLowerCase()) {
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

function AddOrRefreshEffect(C, effect) {
	let found = false;
	let name = effect.name.toLowerCase();
	for (let i = 0; i < C.EFFECTS.length; i++) {
		let eName = C.EFFECTS[i].name.toLowerCase();
		if (eName == name) {
			if (C.EFFECTS[i].duration < effect.duration) {
				C.EFFECTS[i].duration = effect.duration;
			}
			found = true;
		}
	}
	if (!found) {
		if (name == "poison" || name == "venom") {
			if (C.TYPE == "evil" || C.TYPE == "construction") {
				return;
			}
		}
		if (name == "bleed") {
			if (C.TYPE == "construction") {
				return;
			}
		}
		C.EFFECTS.push(effect);
	}
}

function findSpell(list, target) {
	let index = -1;
	if (target[0] == "s") {
		index = parseInt(target.substring(1)) - 1;
	}
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
		max = 2*item.hands;
		if (item.subclass == "blade") {
			max++;
		}
	}
	else if (item.type == "armor") {
		max = 3;
	}
	else if (item.type == "staff") {
		max = 2;
	}
	return max;
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
	if ((C.INVENTORY[index].type == "armor" || C.INVENTORY[index].type == "weapon") && C.INVENTORY[index].equipped) {
		if (C.INVENTORY[index].type == "armor") {
			C.ARMOR[0] -= C.INVENTORY[index].armor[0];
			C.ARMOR[1] -= C.INVENTORY[index].armor[1];
		}
		C.INVENTORY[index].equipped = false;
	}
	C.INVENTORY.splice(index, 1);
}

function startItem(item) {
	for (let i = 0; i < items.length; i++) {
		if (items[i].name.toLowerCase() == item.toLowerCase()) {
			let item = COPY(items[i])
			return item;
		}
	}
}

function findTarget(list, target, row = 0) {
	let index = -1;
	if (target[0] == "e" || target[0] == "p") {
		index = parseInt(target.substring(1));
	}
	if (index <= 0 || isNaN(index)) {
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
	if (isEquipped(C, "stick and string")) {
		return 1;
	}
	if (isEquipped(C, "old fishing pole")) {
		return 2;
	}
	if (isEquipped(C, "fishing pole")) {
		return 3;
	}
	if (isEquipped(C, "masterwork pole")) {
		return 4;
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

function findItem(itemList, target) {
	let invIndex = parseInt(target);
	if (isNaN(invIndex)) {
		for (let i = 0; i < itemList.length; i++) {
			if (itemList[i].name.toLowerCase() == target.toLowerCase()) {
				return i;
			}
		}
	}
	else {
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
			C.INVENTORY.push(item);
		}
	}
}

function rand(num) {
	return Math.floor(Math.random() * num);
}

function MaxHP(C) {
	if (C.TYPE != "player") {
		return C.MaxHP;
	}
	let bonus = 0;
	if (hasRune(C, "longevity")) {
		bonus = 20;
	}
	return bonus + 20 + C.STATS[VIT] * 10;
}

function MaxAP(C) {
	let bonus = 0;
	if (hasRune(C, "dextrous")) {
		bonus = 4;
	}
	if (C.TYPE == "player") {
		for (let i = 0; i < C.INVENTORY.length; i++) {
			if (C.INVENTORY[i].type == "armor" && C.INVENTORY[i].equipped) {
				bonus -= C.INVENTORY[i].AP;
			}
		}
	}
	return bonus + 6 + C.STATS[DEX] * 3;
	
}

function MaxStamina(C) {
	let bonus = 0;
	if (hasRune(C, "endurant")) {
		bonus = 30;
	}
	if (C.TYPE == "player") {
		for (let i = 0; i < C.INVENTORY.length; i++) {
			if (C.INVENTORY[i].type == "armor" && C.INVENTORY[i].equipped) {
				bonus -= C.INVENTORY[i].AP * 5;
			}
		}
	}
	return Math.max(0, bonus + 30 + C.STATS[END] * 15);
}

function Travel(C, newLocation) {
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
	//console.log(battles);
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

function genName(male) {
	var name = "";
	var mBegs = ["Le", "Ke", "Je", "Be", "Me", "Ko", "Ye", "E", "Cy", "Ce", "Ci", "A"];
	var mMids = ["k", "r", "ke", "re", "vin", "t", "s", "d", "v"];
	var mEnds = ["os", "ih", "o", "it", "en", "in", "de", "des", "re", "ro", "ov", "us", "on", "ic", "am"];

	var fBegs = [["Su", "A", "E", "O", "Ke", "Ti", "Di", "De", "Li", "Ki", "Ve", "Ma", "Ni", "Ari", "So", "Ky"], ["Al", "Ev", "Ky"]];
	var fMids = [["or", "ex", "an"], ["k", "r", "n", "c", "s", "r", "ret", "ken", "y"]];
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