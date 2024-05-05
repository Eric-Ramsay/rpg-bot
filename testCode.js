else if (keyword == "testfish") {
	msg += "\n";
	for (let poleTier = 1; poleTier < 5; poleTier++) {
		let seconds = 0;
		let goldEarned = 0;
		let location = findLocation(C.LOCATION);
		for (let j = 0; j < 100; j++) {
			seconds += ((10 - poleTier) + rand(5) + rand((8 - poleTier) * 2));
			let fish = location.fish[rand(location.fish.length)];
			let caught = false;
			while (!caught) {
				seconds += 3 + rand(10 - poleTier)
				let ran = rand(1 + Math.max(0, Math.floor((fish.value - 3 * poleTier)/8)));
				if (ran == 0) {
					caught = true;
					seconds += 3 + rand(10 - poleTier)
				}
			}
			if (8 - (2 * poleTier) <= rand(14)) {
				goldEarned += Math.ceil(fish.value/2);
			}
		}
		msg += "Pole Level " + poleTier + " earned " + goldEarned + " gold in " + seconds + " seconds. (" + Math.floor(100*(goldEarned/(seconds/60)))/100 + " gold/minute)\n";
	}
}

	//School, Range, Name, Desccription, AP Cost, HP Cost, Gold Cost
	/*spells.push(new Spell("elemental", "Wall of Fire", "Deal 3-6 damage to every enemy in a selected row.", 6));
	spells.push(new Spell("elemental", "Stoneskin", "+8 Physical Armor +4 Magical Armor for 3 turns.", 6));
	spells.push(new Spell("elemental", "Chain Lightning", "Deal 2-6 damage per target to 3 targets.", 7));
	spells.push(new Spell("elemental", "Gale", "Push a row of enemies back one row.", 5)); 
	spells.push(new Spell("elemental", "Entangle", "Summon vines to a row, dealing 2-4 damage and having a chance to root enemies in place.", 6)); 
	spells.push(new Spell("elemental", "Earthen Spear", "Deal 8-12 damage to an adjacent target.", 7));
	spells.push(new Spell("elemental", "Blizzard", "Deal 2-4 damage to all enemies. Has a 20% chance to stun them.", 8));
	spells.push(new Spell("elemental", "Freeze", "Deal 4-8 damage to a target. Has an 80% chance to freeze, stunning them for a turn.", 8));
	
	spells.push(new Spell("imperial", "Frenzy", "Gain +3 AP per every 3rd spell you cast each turn. Lasts 3 Turns.", 3));
	spells.push(new Spell("imperial", "Ferocity", "Your damaging spells do +2 DMG per target for 3 turns.", 6));
	spells.push(new Spell("imperial", "Meditation", "Gain 10 Stamina.", 5));
	spells.push(new Spell("imperial", "Peel", "Permanently reduce a target's physical & magical armor by 1.", 6));
	spells.push(new Spell("imperial", "Blink", "Teleport instantly to a targetted row.", 5));
	spells.push(new Spell("imperial", "Teleport", "Teleport to a random row.", 3));
	spells.push(new Spell("imperial", "Siphon", "Deal 5 True Damage to an enemy. Gain 5 Health.", 10));
	spells.push(new Spell("imperial", "Balance", "Deal damage to each enemy equal to the number of enemies on the battlefield.", 10));
	
	spells.push(new Spell("blood", "Balanced Humors", "Gain 4 AP. Lose 4 Stamina.", 0, 6));
	spells.push(new Spell("blood", "Reap", "Deal 4-6 damage to all enemies. Heal 1 HP per enemy hit.", 5, 10));
	spells.push(new Spell("blood", "Hemic Strike", "Deal 15 damage to a target.", 4, 5));
	spells.push(new Spell("blood", "Transfer Life", "Heal a target for 5 HP.", 4, 5));
	spells.push(new Spell("blood", "Restitution", "All allies are restored 2 HP and 15 Stamina.", 5, 8));
	spells.push(new Spell("blood", "Purify", "Remove all debuffs from your team.", 5, 8));
	spells.push(new Spell("blood", "Conjure Apparition", "Summon an Apparition.", 8, 6));
	spells.push(new Spell("blood", "Wild Conjuration", "Summon a Random Animal.", 8, 10));
	spells.push(new Spell("blood", "Conjure Ghoul", "Summon a Hungry Ghoul.", 8, 15));
	
	spells.push(new Spell("witchcraft", "Spread Blight", "All enemies are poisoned for 10 turns.", 8));
	spells.push(new Spell("witchcraft", "Bind", "Root an enenmy in place for 3 turns.", 8));
	spells.push(new Spell("witchcraft", "Acrid Burst", "Deal 4-8 damage to a target. Stuns poisoned enemies. Poisons.", 6));
	spells.push(new Spell("witchcraft", "Acrid Blast", "Deal 4-8 damage to a target. Deals +4 against poisoned enemies. Poisons.", 5));
	spells.push(new Spell("witchcraft", "Envenom", "Envenom a target for 5 turns", 5));
	spells.push(new Spell("witchcraft", "Afflict", "Apply Poison, or extend its duration by 10 turns.", 3));
	spells.push(new Spell("witchcraft", "Harvest Blight", "Consume all enemy poison & venom debuffs, dealing half their remaining damage this turn.", 8));
	spells.push(new Spell("witchcraft", "Polymorph", "Transform a target into a random animal.", 10));
	
	spells.push(new Spell("divine", "Restoration", "Heal a target for 4-8 HP.", 5, 0, 2));
	spells.push(new Spell("divine", "Deliverance", "Target an ally, making them unable to die for 1 turn.", 7, 0, 5));
	spells.push(new Spell("divine", "Holy Light", "Deal 4-6 damage to 1 random enemy in each row.", 6, 0, 3));
	spells.push(new Spell("divine", "Disperse", "Move every adjacent enemy to a random row.", 4, 0, 1));
	spells.push(new Spell("divine", "Banish", "Remove an enemy from the battle. You don't get any loot or EXP for them.", 9, 0, 5));
	spells.push(new Spell("divine", "Smite", "Deal 5-10 damage to a target, doubled against evil targets.", 5, 0, 3));
	spells.push(new Spell("divine", "Divine Hand", "Deal 16-24 damage to an adjacent target.", 8, 0, 5));*/

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
		return "*RED*You need to equip a Wand, Staff, or Scepter to cast spells!\n";
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
			msg += AddOrRefreshEffect(C, new Effect("Stoneskin", "+8 Physical Armor. +4 Magical Armor", 3, "buff"));
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
			msg += "*RED*Your flesh grows cold; they feel a rush of warmth beneath their ribs.\n";
			msg += "*GREEN*" + SpellHeal(allies, C, allies[i], 5);
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
						allies[i].EFFECTS.splice(j, 1);
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
			msg += "*RED*You summon " + an(name) + "!\n";
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
					AddOrRefreshEffect(targets[i], new Effect("Poison", "Take 1 dmg per turn. All healing is reduced by half.", 3));
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
					targets[i].EFFECTS.push(new Effect("Poison", "Take 1 dmg per turn. All healing is reduced by half.", 10));
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
