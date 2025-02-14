function initRunes() {
	//Armor Runes
	runes.push(new Rune("Equality",		90,		"armor",	"Each turn, spread any debuffs on yourself to every enemy in your row."));
	runes.push(new Rune("Bold", 		90, 	"armor", 	"Gain +4 Armor against enemies in your row."));
	runes.push(new Rune("Huntsman", 	90, 	"armor", 	"Fleeing costs no AP and can be done from any row. When you win a battle, heal to full HP."));
	runes.push(new Rune("Sunset", 		90, 	"armor", 	"Each turn deal 3 true damage to all enemies"));
	runes.push(new Rune("Static", 		100, 	"armor", 	"Each turn, gain a stack of Static for each level you have. Lose 2 stacks when you take damage."));
	runes.push(new Rune("Preservation", 100, 	"armor", 	"At the start of your turn gain HP equal to half your AP left over from the previous turn"));
	runes.push(new Rune("Amber", 		100, 	"armor", 	"Whenever you take damage from an enemy attack, heal 2 HP"));
	runes.push(new Rune("Stout", 		100, 	"armor", 	"Gain +15 Max HP and +25 Stamina"));
	runes.push(new Rune("Fortified", 	100,	"armor", 	"Your Max HP is increased by 3 per point of VIT you have"));
	runes.push(new Rune("Cultivation", 	100, 	"armor", 	"Gain +3 AP and +4 HP each turn"));
	runes.push(new Rune("Impervious", 	100, 	"armor", 	"Gain +3 Physical and +3 Magical Armor"));
	runes.push(new Rune("Cascade", 		100,	"armor", 	"After mitigation, all of your damage is increased by 2."));
	runes.push(new Rune("Reflex", 		100, 	"armor", 	"Gain +10% Dodge Chance. When you dodge an attack, deal 6 damage to your attacker"));
	runes.push(new Rune("Berserk", 		100, 	"armor", 	"For every 10% missing HP, gain 5% damage dealt"));
	runes.push(new Rune("Vine", 		110, 	"armor", 	"When you're below 50% Max HP, healing you receive is increased by 50%"));
	runes.push(new Rune("Pacifist", 	110, 	"armor", 	"Your damage dealt is increased by 100%. Your spell and attack damage is reduced to nothing."));
	runes.push(new Rune("Shell", 		110, 	"armor", 	"Incoming damage is reduced by 15%."));
	
	
	//Wild Armor Runes										
	runes.push(new Rune("Jade", 		125, 	"armor", 	"Incoming damage can't be more than 25% of your Max HP.", true));
	runes.push(new Rune("Honeycomb", 	125, 	"armor", 	"Whenever you are attacked, summon a swarm of bees.", true));
	runes.push(new Rune("Reflect", 		125, 	"armor", 	"Whenever you are hit, reflect 5 magical damage to your attacker.", true));
	runes.push(new Rune("Tackle Box", 	200, 	"any", 		"Gain +3 Rune Slots. You can enchant any item with this."));

	//Weapon Runes
	runes.push(new Rune("Peel", 		70, 	"weapon", 	"When you hit an enemy, reduce their physical protections by 1"));
	runes.push(new Rune("Terror", 		70, 	"weapon", 	"High damage attacks have a chance to cause enemies to flee the battle"));
	runes.push(new Rune("Affliction", 	70, 	"weapon", 	"Randomly inflict Venom, Bleed, or Poison onto your target"));
	runes.push(new Rune("Infection", 	90, 	"weapon", 	"Enemies can't immune your debuffs. Your debuffs deal +2% Current HP/Turn, doubled for 2H."));
	runes.push(new Rune("Decisive", 	90, 	"weapon", 	"+25% Base Damage on your first attack each turn."));
	runes.push(new Rune("Lethality", 	90, 	"weapon", 	"Gain a 15% chance per attack to double your weapon's total damage."));
	runes.push(new Rune("Maladious", 	90, 	"weapon", 	"Your weapon gains +10% damage if a target is debuffed, as well as +1 damage per debuff"));
	runes.push(new Rune("Reach", 		90, 	"weapon", 	"Your weapon gains +2 range"));
	runes.push(new Rune("Orisha", 		90, 	"weapon", 	"Gain +30% Penetration"));
	runes.push(new Rune("Density",		100,	"weapon",	"Attacks cost +3 AP, but gain +8 Damage"));	
	runes.push(new Rune("Leeching", 	100, 	"weapon", 	"Restore +3 HP and +3 Stamina per Attack"));
	runes.push(new Rune("Invigorant", 	100, 	"weapon", 	"Your weapon is able to attack +1 time"));
	runes.push(new Rune("Accurate", 	100, 	"weapon", 	"Your weapon gains +10% hit chance. 1H Weapons gain +1 Damage. 2H Weapons gain +2 Damage"));
	runes.push(new Rune("Reprise", 		100, 	"weapon", 	"Any attacks that miss their target are re-tried one time"));
	runes.push(new Rune("Powerful", 	100, 	"weapon", 	"+20% Weapon Base Damage on Attacks"));
	runes.push(new Rune("Precise", 		100, 	"weapon", 	"+3 Damage per Attack"));
	runes.push(new Rune("Sweeping", 	120, 	"weapon", 	"When you hit an enemy, deal 20% of the damage to other enemies in the row"));
	

	//Wild Weapon Runes
	runes.push(new Rune("Death Mark", 	125, 	"weapon", 	"Slain enemies are raised as allied zombies", true));
	
	//Staff Runes
	runes.push(new Rune("Tar", 			65, 	"staff", 	"Enemies damaged by your spells are weakened, reducing their damage by 25%"));
	runes.push(new Rune("Legion", 		70, 	"staff", 	"Enemies you summon take -50% damage for this turn and their first turn."));
	runes.push(new Rune("Light", 		80, 	"staff", 	"You can cast +2 spells per turn"));
	runes.push(new Rune("Focus", 		90, 	"staff", 	"You can't cast more than one spell a turn. Your spell damage is increased by 100%"));
	runes.push(new Rune("Heavy", 		90, 	"staff", 	"Your spells cost +2 AP but deal +4 Damage per target"));
	runes.push(new Rune("Pearl", 		90, 	"staff", 	"Your spells' HP cost is increased by the AP cost of the spell, but your spells cast twice."));
	runes.push(new Rune("Autumn", 		95, 	"staff", 	"When you cast a spell with healing, perform another 3 HP heal on a random ally"));
	runes.push(new Rune("Arcana", 		100, 	"staff", 	"Every 2 points of MAG grants you +3 AP"));
	runes.push(new Rune("Thundrous", 	100, 	"staff", 	"Your spells have a 20% chance to deal double damage."));
	runes.push(new Rune("Ivory", 		110, 	"staff", 	"Each cast has a 15% Chance to have no AP/HP/Cast cost, allowing you to cast another spell."));
	runes.push(new Rune("Sanguine", 	110,	"staff", 	"Your spells have no AP cost. Your spells' HP cost is increased by the AP cost of the spell + 3"));
	runes.push(new Rune("Forthwith", 	115, 	"staff", 	"Each turn, the first damaging spell you cast gains +75% damage."));
	runes.push(new Rune("Spring", 		115, 	"staff", 	"Heal 2 HP whenever you cast a spell"));
	runes.push(new Rune("Charcoal", 	125, 	"staff", 	"Your spells gain +25% Damage"));
	runes.push(new Rune("Hollow", 		125, 	"staff", 	"Your spells have their AP costs reduced by 1"));
	runes.push(new Rune("Cinnabar", 	125, 	"staff", 	"Whenever you damage a target with a spell, reduce their magic armor by 1"));

	
	for (let i = 0; i < runes.length; i++) {
		items.push(runes[i]);
	}
}

function initLocations() {
	//Init People First
	let Merchant = new NPC("Wandering Merchant", true, "A *YELLOW*wandering merchant*GREY* who travels around the *RED*wilderness*GREY*, selling *CYAN*peculiar*GREY* items to any adventurers who happen upon them. They're tall, a being formed of *BLACK*shadow*GREY*, adourned in *PINK*dapper attire*GREY*. They have very little to say, but their intentions are clear.");
	
	let Minsiki = new NPC("Minsiki", true, "*GREEN*Minsiki*GREY* is middle-aged, with a thick black beard and kind eyes. No one knows where Minsiki came from before he came to the village years ago and opened his shop; they still think of him as an exotic stranger. Minsiki prefers it that way, he likes to keep to himself.");
	let Gout = new NPC("Gout", true, "*GREEN*Gout*GREY* is an older man, short and grey but broad all the same. He hobbles across the pier and his muscles flex beneath his wrinkled skin as he casts his fishing line out into the sea. His is a soldier's body, its scars etched immutably as if in marble. It has not forgotten the many campaigns and battles, and though *GREEN*Gout*GREY* never speaks of his past, his eyes would say he has not forgotten either.");
	let Tobin = new NPC("Tobin", true, "*GREEN*Father Tobin*GREY* is a thin man, taller than most and pale. From time to time one can see sadness in his eyes, as he looks across the graves he tends, but it is only ever there for a moment and then he smiles. In his humility he has found unwavering joy.");
	let Kobos = new NPC("Kobos", true, "*GREEN*Kobos*GREY* has been swinging hammer for forty years now, nearly as long as he's been alive. When he works his craft the singing of his anvil can be heard as far away as the harbor. Princes have offered to buy out his services, but he has no interest in their gold, only in his iron.");
	let Clyde = new NPC("Clyde", true, "*GREEN*Clyde*GREY* is a huntsman. He spends more time far afield than anyone else in the town. When some people hear his frightful tails they roll their eyes; sometimes he sounds like a coward. He pleads with anyone who will listen to avoid the woods at night.");
	let Terat = new NPC("Terat", true, "*GREEN*Terat*GREY* is the estranged brother of *GREEN*Sarkana*GREY*. He's quite timid, and perhaps a bit anxious. He can be rather friendly and generous, but for the most part focuses on his work. He always seems to be engraving new golden runes into their cold steel plates.");
	let Elias = new NPC("Elias", true,	"*GREEN*Elias*GREY* is a young man, slender, with a mess of dusty brown hair and grey-blue eyes that gleam from behind a pair of bronze-rimmed quartz spectacles. He spends most of his time reading by lamplight, or tending to the many old tomes in his care. He tends to only leave the library at night, rendering him somewhat of a mystery among the less scholarly townsfolk."); 
	
	let Qarana = new NPC("Qarana", true, "Some say *GREEN*Qarana*GREY* was a swamp witch once, who grew bored of her solitary lifestyle. When she hears such rumors, Qarana only smiles. She has a thousand stories to tell of her travels, though the stories are never quite the same between tellings.");
	let Asha = new NPC("Asha", false, "*GREEN*Asha*GREY* is young, with dark hair and dark eyes. She lives at the tavern and never works, she only spends her days drinking, often alone. It's whispered that she was a promising mage once, and an aristocrat, but no one knows much about her.");
	let Penelope = new NPC("Penelope", true, "*GREEN*Penelope*GREY* has been running the tavern for years now. Business is slow these days, with travel being as dangerous as it is. She insists that she's doing well, but behind her warm eyes is an ever-present weariness.");
	let Nestra = new NPC("Nestra", false, "*GREEN*Nestra*GREY* married an old merchant who spends all his time at sea. She took some of the money he sends back to her and opened her *BLUE*Barbershop*GREY*. She's not that good at cutting hair, but she tries her best, and she is getting better.");
	let Janice = new NPC("Janice", false, "*GREEN*Janice*GREY* has lived in the town for nearly all of her long life, save for a few foreign adventures that she still remembers fondly. She seems like a simple old woman, preferring to keep quiet on most matters, but from time to time it becomes apparent that she has seen more than most people can even imagine.");
	let Florence = new NPC("Florence", true, "*GREEN*Florence*GREY* is grey-haired, yet her stern face, criss-crossed with scars, maintains a youthful glow. She insists she's but a simple tailor, but she never goes out without a dagger in her belt, and she seems to know how to cut more than just cloth.");
	let Sarkana = new NPC("Sarkana", true, "*GREEN*Sarkana*GREY* is the estranged sister of Terat. When the day is done she packs away her runes and travels far to the east. She has always been a bit spiteful, and prefers not to talk to anyone, except to speak ill of her brother.");
	
	Elias.CONVERSATIONS.push("Elias*GREY*: Salutations.\n");
	Elias.CONVERSATIONS.push("Elias*GREY*: Does anything here interest you?\n");
	Elias.CONVERSATIONS.push("Elias*GREY*: The other day, I was engrossed in a most interesting tome . . .\n");
	Elias.CONVERSATIONS.push("Elias wipes his glasses with a square cloth.\n");
	
	Gout.CONVERSATIONS.push("Gout*GREY*: I'd say good day but if it was a good day I'd be fishing Ha!");
	Gout.CONVERSATIONS.push("Gout*GREY*: What can I do for you?");
	Gout.CONVERSATIONS.push("Gout*GREY*: It's a great day for fishing.");
	Gout.CONVERSATIONS.push("Gout*GREY*: I'm thinking of getting out on the water myself.");
	Gout.CONVERSATIONS.push("Gout*GREY*: I went fishing in the Acrid Swamp once, hooked a huge feller what looked like a slug.");
	Gout.CONVERSATIONS.push("Gout*GREY*: I mostly fish off the pier these days, what with the monsters out around the island.");
	Gout.CONVERSATIONS.push("Gout slaps his gut.");
	Gout.CONVERSATIONS.push("Gout*GREY*: They say Asha is a mage, but the only thing I've seen her cast is a line. Ha!");
	Gout.CONVERSATIONS.push("Gout chuckles.");
	Gout.CONVERSATIONS.push("Gout*GREY*: It's dangerous out here on the island but the fishing is well worth it.");
	
	Nestra.CONVERSATIONS.push("Nestra*GREY*: Hello.");
	Nestra.CONVERSATIONS.push("Nestra*GREY*: Welcome to my barbershop.");
	Nestra.CONVERSATIONS.push("Nestra*GREY*: You know, it'd be nice to have more refined visitors to our town.");
	Nestra.CONVERSATIONS.push("Nestra*GREY*: Qarana, Minsiki, those rune sellers. Our town has become rather . . . cosmopolitan.");
	Nestra.CONVERSATIONS.push("Nestra*GREY*: You certainly look like you could use a haircut.");
	
	Janice.CONVERSATIONS.push("Janice*GREY*: Hello dear.");
	Janice.CONVERSATIONS.push("Janice*GREY*: Are you here to visit someone?.");
	Janice.CONVERSATIONS.push("Janice*GREY*: I bring flowers to the unknown graves.");
	Janice.CONVERSATIONS.push("Janice*GREY*: I hope their souls are all at peace.");
	Janice.CONVERSATIONS.push("Janice places a single white flower onto the surface of a fresh grave.");
	
	Asha.CONVERSATIONS.push("Asha doesn't seem to notice you. . .");
	Asha.CONVERSATIONS.push("Asha looks at you blankly. . .");
	Asha.CONVERSATIONS.push("Asha*GREY*: Did you know Goblins have green blood?");
	Asha.CONVERSATIONS.push("Asha*GREY*: Once Minsiki came in here, and he was drinking with me right? Anyways he gets really drunk, and he starts laughing like crazy, and he starts telling me about this time he cut some guy's ear off with a scimitar. It was insane.");
	Asha.CONVERSATIONS.push("Asha*GREY*: Penelope is nice, and pretty too. Free drinks and a free room, no one else does anything like that for me.");
	Asha.CONVERSATIONS.push("Asha*GREY*: I found a rusty sword once, and chucked it into the sea. That's a stupid story.");
	Asha.CONVERSATIONS.push("Asha*GREY*: I went to the church once, expecting a service. What a headache I had . . . Anyways, no one was there; Father Tobin looked so beaten down.");
	Asha.CONVERSATIONS.push("Asha*GREY*: Terat came in here the other day, sat over there in the corner. Way back there alone. After about an hour and a half I felt bad, and went to talk to him. He just mumbled something and left. What an ass.");
	Asha.CONVERSATIONS.push("Asha*GREY*: I've got nothing to say about Sarkana, except that I can't stand her.");
	Asha.CONVERSATIONS.push("Asha*GREY*: Have you ever met Clyde? He's alright. He's like a little puppy sometimes.");
	Asha.CONVERSATIONS.push("Asha*GREY*: Qarana is so full of herself. I guess in a place like this that makes sense. She could do so much more than brew potions, though.");
	Asha.CONVERSATIONS.push("Asha*GREY*: I hate spiders. Big ones and small ones. Bugs in general. I used to love honey, now I even hate bees. Mead is alright.");
	Asha.CONVERSATIONS.push("Asha*GREY*: Do you like my shirt? I bought it from Florence. I think it's quite stylish.");
	Asha.CONVERSATIONS.push("Asha*GREY*: I should have been an enchanter. You can make a lot of money from runes, and you don't have to get ripped apart doing it.");
	Asha.CONVERSATIONS.push("Asha*GREY*: This drink tastes like ass water. Like sweat or something, it's gross.");
	Asha.CONVERSATIONS.push("Asha*GREY*: The best sight in all of the village can be seen from right here at the bar. Er, my drink I mean. . .");
	
	Minsiki.CONVERSATIONS.push("Minsiki mumbles something.");
	Minsiki.CONVERSATIONS.push("Minsiki mumbles something that sounds like a joke.");
	Minsiki.CONVERSATIONS.push("Minsiki*GREY*: Good wares eh?");
	Minsiki.CONVERSATIONS.push("Minsiki*GREY*: Hm?");
	Minsiki.CONVERSATIONS.push("Minsiki wipes some blood off the scimitar on display, then clears his throat.");
	Minsiki.CONVERSATIONS.push("Minsiki*GREY*: This came from a long way away, just like me, huh? *GREY*He laughs.");
	
	Terat.CONVERSATIONS.push("Terat*GREY*: If you're expecting a fight, you can't go wrong with some protective runes.");
	Terat.CONVERSATIONS.push("Terat*GREY*: I make all of my runes myself.");
	Terat.CONVERSATIONS.push("Terat*GREY*: You won't find better runes than these anywhere in town.");
	Terat.CONVERSATIONS.push("Terat*GREY*: Hm?");
	Terat.CONVERSATIONS.push("Terat*GREY*: Hmm. . .");
	
	Sarkana.CONVERSATIONS.push("Sarkana*GREY*: Yes?");
	Sarkana.CONVERSATIONS.push("Sarkana*GREY*: What?");
	Sarkana.CONVERSATIONS.push("Sarkana*GREY*: Are you going to buy a rune?");
	Sarkana.CONVERSATIONS.push("Sarkana*GREY*: Don't bother with that tripe my brother sells. It's a waste of your money.");
	Sarkana.CONVERSATIONS.push("Sarkana*GREY*: I don't know why I stay here.");
	Sarkana.CONVERSATIONS.push("Sarkana*GREY*: The sky is always an ugly grey around here.");
	
	Penelope.CONVERSATIONS.push("Penelope seems busy, washing the bar. . .");
	Penelope.CONVERSATIONS.push("Penelope*GREY*: Would you like a drink?");
	Penelope.CONVERSATIONS.push("Penelope*GREY*: Asha came in here over a year ago, and handed me a chunk of gold for a room and some drink. Solid gold. I don't think she remembers doing it.");
	Penelope.CONVERSATIONS.push("Penelope*GREY*: I know I charge a lot for rooms, but I'd go out of business if I didn't.");
	Penelope.CONVERSATIONS.push("Penelope*GREY*: Rooms are 5 gold.");
	Penelope.CONVERSATIONS.push("Penelope*GREY*: All kinds of strange folks come here. Brigands, Witches. Honestly, so long as they don't cause trouble I let them stay.");
	Penelope.CONVERSATIONS.push("Penelope*GREY*: When I first took over the tavern, the road was still bad, but not so bad as this. We used to get more ships in too.");
	Penelope.CONVERSATIONS.push("Penelope*GREY*: I brew most of this alcohol myself. Most of the time it turns out really well actually. Sometimes not so much.");
	Penelope.CONVERSATIONS.push("Penelope*GREY*: I know the road's pretty bad these days, but I think Clyde exaggerates. Plenty of people go out and come back again. Like him, for example.");
	
	Qarana.CONVERSATIONS.push("Qarana*GREY*: Have you been to the swamp? It's beautiful isn't it?");
	Qarana.CONVERSATIONS.push("Qarana*GREY*: One time I saw a slug, a vast thing. It was moving slowly through the mist, algae had grown across it, even a few trees had risen up on its mighty back.");
	Qarana.CONVERSATIONS.push("Qarana*GREY*: Would you like to buy a potion?");
	Qarana.CONVERSATIONS.push("Qarana*GREY*: I put a lot of effort into the flavor of these things, you know. I guarantee they'll go down easy.");
	Qarana.CONVERSATIONS.push("Qarana*GREY*: You know one of these things could save your life.");
	Qarana.CONVERSATIONS.push("Qarana*GREY*: How can I help you today?");
	
	Kobos.CONVERSATIONS.push("Kobos*GREY*: Good day.");
	Kobos.CONVERSATIONS.push("Kobos*GREY*: What are you looking to buy?");
	Kobos.CONVERSATIONS.push("Kobos*GREY*: Weapons or Armor - you can find the highest quality here.");
	Kobos.CONVERSATIONS.push("Kobos*GREY*: I used to be a fighter, you know. I split a Lich's skull with that War Hammer behind the counter, and watched as its soul spilled away.");
	Kobos.CONVERSATIONS.push("Kobos*GREY*: I crafted a helmet for some Duke once. He came back to me complaining that his neck was sore after an Ogre had struck him in the back of the head. The fool.");
	Kobos.CONVERSATIONS.push("Kobos*GREY*: If you're looking for ranged weapons, try talking to Clyde. For runes, you can talk to Sarkana and Terat. They're quite good at their respective crafts.");
	Kobos.CONVERSATIONS.push("Kobos*GREY*: I lived my whole life here; there's a real beauty here, and I'd sooner die than give it up.");
	Kobos.CONVERSATIONS.push("Kobos*GREY*: Father Tobin keeps a fine collection of tomes, but I think the graves and the crypts scare people away from the church. It's a shame.");
	
	Florence.CONVERSATIONS.push("Florence*GREY*: Hello dear!");
	Florence.CONVERSATIONS.push("Florence*GREY*: What are you looking to buy? Something for pleasure, or for business, so to speak?");
	Florence.CONVERSATIONS.push("Florence*GREY*: That's real Giant Spider silk. Strong and beautiful.");
	Florence.CONVERSATIONS.push("Florence*GREY*: I don't know how much you get out of town, but have you seen what Goblins wear? It's disgraceful.");
	Florence.CONVERSATIONS.push("Florence*GREY*: You can always tell how long someone's been in town, just by how ugly their clothing is.");
	Florence.CONVERSATIONS.push("Florence*GREY*: We're a very well-dressed town, thanks to me.");
	Florence.CONVERSATIONS.push("Florence*GREY*: I really would recommend you buy something, from myself or Kobos. You can never be too safe.");
	
	Clyde.CONVERSATIONS.push("Clyde*GREY*: Hello.");
	Clyde.CONVERSATIONS.push("Clyde*GREY*: Be careful if you head out; I beg of you.");
	Clyde.CONVERSATIONS.push("Clyde*GREY*: The Woods are bad enough, but I would avoid the Swamp. The Crypts? Hm . . . *GREEN*He shudders.");
	Clyde.CONVERSATIONS.push("Clyde*GREY*: I was lost. Evening turned to night and suddenly I was surrouned by eyes glowing green in my torchlight. Chitinous legs were clicking in the darkness. I thought I was doomed. And then, I swear, they burst into a mist of ichor, and I was alone.");
	Clyde.CONVERSATIONS.push("Clyde*GREY*: Most people think goblins are pretty dumb, but I'd disagree. I saw a contingent of knights get ambushed and torn to shreds by a group of them; it was a real clever, wretched thing.");
	Clyde.CONVERSATIONS.push("Clyde*GREY*: It really would be better if you were to just stay in town. I'm too old to change my ways, but it's not too late for you.");
	
	Tobin.CONVERSATIONS.push("Tobin*GREY*: Hello.");
	Tobin.CONVERSATIONS.push("Tobin*GREY*: Blessings, my Child.");
	Tobin.CONVERSATIONS.push("Tobin*GREY*: I pray the Gods will deliver us from this evil.");
	Tobin.CONVERSATIONS.push("Tobin*GREY*: Hmm. . . I feel we will meet again soon.");
	Tobin.CONVERSATIONS.push("Tobin*GREY*: It's bitter work digging so many graves, but I've grown use to it.");
	
	Merchant.CONVERSATIONS.push("*GREY*A glowing smile shines from beneath the brim of the merchant's cap.");
	Merchant.CONVERSATIONS.push("*GREY*The merchant hisses.");
	Merchant.CONVERSATIONS.push("*BLACK*. . .");
	Merchant.CONVERSATIONS.push("*GREY*The merchant makes a clicking sound.");
			//M		F		M		 M		M		M		F		F		F		F		F		F	     M		NB		   M
	people = [Gout, Nestra, Minsiki, Tobin, Kobos, Clyde, Qarana, Asha, Penelope, Florence, Janice, Sarkana, Terat, Merchant, Elias];
	
	Gout.ITEMS = ["Fishing Pole", "Masterwork Pole", "Divine Pole"];
	Minsiki.ITEMS = ["backpack", "jade armor", "rondel dagger", "spiked shield", "quarterstaff", "whip", "scourge", "urumi", "scimitar", "Hand Cannon"];
	Florence.ITEMS = ["Plain Cassock", "Acolyte Robes", "Warded Cloak", "Stylish Shirt", "Plain Cloak", "Leather Cuirass", "Quilted Gambeson", "Silk Armor", "Amethyst Tunic"];
	Kobos.ITEMS = ["Spear", "Halberd", "Longsword", "Claymore", "Morningstar", "War Hammer", "Mace", "Maul", "Flail", "Bearded Axe", "War Axe", "Great Axe", "Shield", "Scale Armor", "Chainmail", "Plate Armor"];
	Clyde.ITEMS = ["Dagger", "Club", "Hatchet", "Buckler", "Throwing Axe", "Staff Sling", "Longbow", "Crossbow", "Repeating Crossbow"];
	Qarana.ITEMS = ["Health Potion", "Haste Potion", "Stamina Potion", "Panacea", "Skill Potion", "Scroll: Envenom", "Fire Tincture", "Peel Tincture", "Necrosis Tincture", "Confusion Tincture"];
	Penelope.ITEMS = ["Penelope's Brew", "Mead", "Imperial Wine", "Northern Wine"]
	Tobin.ITEMS = ["Wand", "Staff", "Scepter", "Crook"];
	Elias.ITEMS = ["Tome of the Duelist", "Tome of Strength", "Tome of Summoning", "Tome of Affliction", "Tome of Destruction", "Tome of the Guardian", "Scroll: Random"];
	
	Merchant.ITEMS = ["Warp Potion", "Rage Potion", "Polymorph Tincture", "Scroll: Gamble", "Scroll: Ignite", "Scroll: Feed Flame", "Swordfish Spear", "Eel Shield"];
	
	for (let i = 0; i < people.length; i++) {
		for (let j = 0; j < people[i].ITEMS.length; j++) {
			for (let k = 0; k < items.length; k++) {
				if (items[k].name.toLowerCase() == people[i].ITEMS[j].toLowerCase()) {
					people[i].ITEMS[j] = items[k];
					break;
				}
			}
		}
	}
	
	for (let i = 0; i < runes.length; i++) {
		if (runes[i].value < 125) {
			if (runes[i].target == "weapon") {
				Sarkana.ITEMS.push(runes[i]);
			}
			else if (runes[i].target == "armor") {
				Terat.ITEMS.push(runes[i]);
			}
		}
		if (runes[i].target == "staff") {
			Tobin.ITEMS.push(runes[i]);
		}
	}
	
	let Bait = new Building("Bait Shop", "The *BLUE*Bait Shop*GREY* is a small building, only a single room divided by a counter behind which *YELLOW*Gout*GREY* is standing, whittling. There's a sign outside on the door which simply reads '*WHITE*Open*GREY*' on one side and '*WHITE*Gone Fishing*GREY*' on the other. The wooden walls and fixtures are *GREEN*musty*GREY*, worn away by the salty sea air. Poorly taxidermied fish adorn the walls, no doubt some of *YELLOW*Gout*GREY*'s greatest catches.");
	Bait.prosperity = 3500;
	let Curio = new Building("Curio Shop", "The *BLUE*Curio Shop*GREY* is a maze of narrow hallways and tiny rooms, formed by hanging carpets and shelves that rise from the floor to the low ceiling. Every imaginable sort of thing can be found cluttered onto a shelf somewhere in the shop, from ancient artifacts to tarnished copper toys. *YELLOW*Minsiki*GREY* scours every merchant ship that pulls into the harbor, looking for more *PINK*strange wares*GREY* for his shop.");
	let Bank = new Building("Bank", "The *BLUE*Bank*GREY* is a low, unassuming building of *BLACK*old grey stone*GREY*. It has a single circular window on its front face, but is otherwise lit by *YELLOW*dim lamps*GREY*. Despite its modest appearance the building has been reinforced by *PINK*ancient runes*GREY* that completely protect any and all *CYAN*deposits*GREY*.");
	let Church = new Building("Church", "The *BLUE*Church*GREY* is an ancient building, and by far the nicest in town. Its walls are built of an odd assortment of mismatched tan and grey stones, all carefully and sturdily laid together by long-dead craftsmen. The windows are clear *CYAN*quartz*GREY*, and the pews are fine mahogany, though scarcely do they see use these days. *GREEN*Father Tobin*GREY* tends to the grounds by himself, praying he might one day find a successor.");
	let Library = new Building("Library", "The *BLUE*Library*GREY* is an old building, discreetly tucked into a corner of the *YELLOW*plaza*GREY*. The books are all held in a single spacious room, partitioned by a *CYAN*labyrinth*GREY* of tall bookshelves, some of which are subdivided by a wooden platform that acts as a partial second floor. The air is stale and dusty, and if you wander past the *GREEN*books*GREY* you'll come upon a bedroom and office where *PINK*Elias*GREY* lives and works.");
	let Tavern = new Building("Tavern", "The *BLUE*Tavern*GREY* is four stories, and boasts no fewer than twenty-five rooms for rent, though these days only a few are ever rented out at a time. More than a few townspeople come to the *RED*firelit*GREY* common room for dinner or drinks at its bar, which is enough for *YELLOW*Penelope*GREY* to maintain the establishment. It's said that *GREEN*Asha*GREY*, sitting perpetually at the bar and living in a rented room accounts for half of the tavern's total revenue.");
	let Barber = new Building("Barbershop", "The *BLUE*Barbershop*GREY* is a single, plainly furnished room at the front of *GREEN*Nestra*GREY*'s estate, in what used to be an antechamber. The shop's greatest feature is its window to the estate's atrium garden with its exquisite *WHITE*fountain*GREY*, *WHITE*statues*GREY*, and *WHITE*pillars*GREY*. Haircuts are *YELLOW*15 Gold*GREY*, type *CYAN*!haircut [description]*GREY* to give yourself a description. You can use *CYAN*!parse [description]*GREY* to preview your haircut");
	Barber.prosperity = 750;
	let Tailor = new Building("The Tailor Shop", "The *BLUE*Tailor Shop*GREY* is well stocked with all the latest gowns and garments, intricately crafted by *YELLOW*Florence*GREY* herself. Painted a dark brown in its interior to accent the colorful fabrics within, it's one of the newest additions to *RED*Merchant's Lane*GREY*. Behind several fashionable displays, hidden in a back corner, is a mannequin adorned in old *CYAN*highland chainmail*GREY*. When asked about it, *YELLOW*Florence*GREY* only looks away with a sly, fading laugh.");
	let Apothecary = new Building("Apothecary", "The *BLUE*Apothecary*GREY* is little more than a tiny room and a counter, even smaller than *YELLOW*Gout*GREY*'s *BLUE*bait shop*GREY*. There is a door behind the counter which none but *YELLOW*Qarana*GREY* have seen the other side of. On each wall are shelves of glass potion bottles that rattle as the shop door opens and closes. Within the shop a slight metallic, almost *RED*bloody*GREY* smell lingers, mixing with a *GREEN*sour*GREY*, smoky scent. If ever it's mentioned, *YELLOW*Qarana*GREY* insists it's coming from the *YELLOW*Kobos*GREY*'s stall next door.");
	let Smithy = new Building("Smithy", "The *BLUE*Smithy*GREY* is more of a pavillion rather than a shop, always shimmering in the *RED*fiery*GREY* radiance of the ingot furnace. Most of *YELLOW*Kobos*GREY*'s work consists of mundane orders for the town, nails, fish hooks, anchors, and the like, though many adventurers seek him out for his legendary weapons and armor. Many of his finest masterpieces hang behind his counter. *YELLOW*Kobos*GREY* doesn't worry about theft, though - he knows no one would dare to *RED*steal*GREY* from him again.");
	let GuildHall = new Building("Guild Hall", "The *BLUE*Guild Hall*GREY* is a large wooden building, well-furnished and well-kept, but with an air of antiquity in its adornments. Revered adventurers come here to seek peace after their journeys, here on the *RED*Stony Island*GREY* where none would dare bother them.");
	GuildHall.prosperity = 3500;
	
	let RuneShop = new Building("The Rune Shop", "The *BLUE*Rune Shop*GREY* is a dusty wooden building, jointly owned by Sarkana and Terat in spite of their animosity. They've hung a sheet from the ceiling to divide the space behind the counter in half. *GREEN*Sarkana*GREY* and *GREEN*Terat*GREY* watch eagerly to see whose runes you intend to buy.");
	
	RuneShop.people = [Sarkana, Terat];
	Bait.people = [Gout];
	Curio.people = [Minsiki];
	Church.people = [Tobin];
	Tavern.people = [Penelope, Asha, Clyde];
	Barber.people = [Nestra];
	Tailor.people = [Florence];
	Apothecary.people = [Qarana];
	Smithy.people = [Kobos];
	Library.people = [Elias];
	
	buildings = [Apothecary, Bait, Barber, Smithy, Church, Bank, Curio, Tailor, Tavern, GuildHall, RuneShop, Library];
	
	let Clearing = new Location();
	Clearing.id = "A Strange Clearing";
	Clearing.description = "You've come to a strange clearing amidst the wilderness; an aura of mercy surrounds you. A veil of shadow rises overhead like a dome, and nearby a mysterious figure is sitting, as if they were expecting you to arrive.";
	Clearing.canTravelHere = false;
	
	let Harbor = new Location();
	Harbor.id = "The Town Harbor";
	Harbor.description = "The harbor on the north side of town. The coast seems endless to the east and west, and a cool southbound wind blows in from the grey sea. A few small ships are out fishing, just shy of the horizon. A large ferry is docked at the end of the pier.";
	Harbor.buildings = [Curio, RuneShop];
	Harbor.connections = [new Connection("Merchant's Lane", "south")];
	
	let Churchyard = new Location();
	Churchyard.id = "The Churchyard";
	Churchyard.description = "A stony, two-story church dominates this side of town. It's dead quiet here. Beyond the church is a graveyard. It seems like new graves are always being dug.";
	Churchyard.buildings = [Church, Bank];
	Churchyard.connections = [new Connection("The Town Square", "west"), new Connection("The Haunted Crypts", "east")];
	
	let Merchants = new Location();
	Merchants.id = "Merchant's Lane";
	Merchants.description = "A wide dusty road flanked by various wooden shops and market stalls. The air is filled with the clamor of townspeople going about their business. Dark pines loom in the west, far beyond the comforts of the town.";
	Merchants.buildings = [Tavern, Tailor, Barber];
	Merchants.connections = [new Connection("The Town Harbor", "north"), new Connection("The Town Square", "south"), new Connection("The Wilted Woods", "west")];
	
	let Square = new Location();
	Square.id = "The Town Square";
	Square.description = "A sprawling, largely empty plaza. There used to be festivals here, but these days they're little more than a distant memory. A few tiny insects flit about the open air, and the smell of mud rises from the southern swamp.";
	Square.buildings = [Apothecary, Smithy, Library];
	Square.connections = [new Connection("Merchant's Lane", "north"), new Connection("The Churchyard", "east"), new Connection("The Acrid Swamp", "south")];
	
	let Crypts = new Location();
	Crypts.id = "The Haunted Crypts";
	Crypts.dungeon = true;
	Crypts.description = "Beyond the barrows and beneath the earth. . . a sprawling labrynth of ancient stone tunnels. For both living and dead, no peace is to be found in this accursed place.";
	Crypts.connections = [new Connection("The Churchyard", "west")];
	
	let Woods = new Location();
	Woods.id = "The Wilted Woods";
	Woods.dungeon = true;
	Woods.description = "An old network of roads winds through this forest, overgrown and travelled only by the most desperate. No birds dare sing here, there is naught but the creaking of the dead trees.";
	Woods.connections = [new Connection("Merchant's Lane", "east")];
	
	let Swamp = new Location();
	Swamp.id = "The Acrid Swamp";
	Swamp.dungeon = true;
	Swamp.description = "Muddy water rises to your knees, pond scum spread across its surface hiding that which lurks below. A thick damp mist hangs in the air, obscuring the trunks and vines at the edge of your perception into frightful figures.";
	Swamp.connections = [new Connection("The Town Square", "north")];
	
	let Graveyard = new Location();
	Graveyard.id = "The Graveyard";
	Graveyard.description = "The graveyard is a vast field, long fallen into disrepair. The graves of ancient warriors are now little more than chunks of weathered stone. Lately, burying the dead alone has been more than the town can manage.";
	Graveyard.connections = [new Connection("The Churchyard", "south")];
	Graveyard.prosperity = 1500;
	
	let Ferry = new Location();
	Ferry.id = "Island Ferry";
	Ferry.description = "The ferry is a flat wooden ship creaking as it rocks gently with the waves. On the northern horizon, veiled in atmospheric blue, one can just barely see a forested island.";
	Ferry.connections = [new Connection("The Stony Island", "north"), new Connection("The Town Harbor", "south")];
	Ferry.prosperity = 3500;
	
	let Island = new Location();
	Island.id = "The Stony Island";
	Island.dungeon = true;
	Island.description = "The island has been abandoned for some time now, though some mossy cabins still stand in the forest. No fisherman would dare sail over the vibrant reef of the north shore, for terrible creatures dwell there. . .";
	Island.prosperity = 3500;
	Island.buildings = [GuildHall, Bait]
	Island.connections = [new Connection("Island Ferry", "south")];
	
	Swamp.fish = ["Minnow", "Crawdad", "Crappie", "Carp", "Trout", "Perch", "Salmon", "Bluegill", "Shad", "Catfish", "Bass", "Freshwater Eel", "Pike", "Gar", "Sturgeon"];
	Ferry.fish = ["Shrimp", "Sardine", "Common Snook", "Squid", "Mackerel", "Hake", "Snapper", "Cod", "Grouper", "Tuna", "Ray", "Tuna", "Wahoo", "Swordfish"];
	Harbor.fish = ["Shrimp", "Sardine", "Common Snook", "Squid", "Mackerel", "Hake", "Snapper", "Cod", "Grouper", "Tuna", "Ray", "Tuna", "Wahoo", "Swordfish"];
	Island.fish = ["Shrimp", "Crab", "Common Snook", "Squid", "Flying Fish", "Snapper", "Pufferfish", "Cod", "Sunfish", "Grouper", "Jellyfish", "Ray", "Stonefish", "Eel", "octopus"];
	
	locations = [Island, Ferry, Harbor, Merchants, Churchyard, Square, Graveyard, Crypts, Woods, Swamp, Clearing];
	
	Graveyard.people = [Janice];
	Clearing.people = [Merchant];
	
	for (let i = 0; i < locations.length; i++) {
		for (let j = 0; j < locations[i].fish.length; j++) {
			for (let k = 0; k < items.length; k++) {
				if (items[k].name.toLowerCase() == locations[i].fish[j].toLowerCase()) {
					locations[i].fish[j] = items[k];
					break;
				}
			}
		}
	}
}

function OneH(name, weaponType, description, attacks, value, chance, min, max, pen, AP, range, rare = false) {
	return new Weapon(name, weaponType, description, 1, attacks, value, chance, min, max, pen, AP, range, rare);
}
function TwoH(name, weaponType, description, attacks, value, chance, min, max, pen, AP, range, rare = false) {
	return new Weapon(name, weaponType, description, 2, attacks, value, chance, min, max, pen, AP, range, rare);
}

function initItems() {
	//WEAPON NAME	  			Name	 		Class, 			Description 																						#Atks	Value 	Chance 	MinDmg 	MaxDmg 	Pen% 	AP 		Range	Rare?
	//Blades
	weapons.push(new OneH("Dagger", 			"blade",	"A simple dagger, lightweight and easy to use.",														3,		25, 	70, 	2, 		4,	 	0, 		1, 		1));
	weapons.push(new OneH("Rondel Dagger", 		"blade", 	"A short, thick-bladed dagger design to puncture armor.", 												2,		25, 	75, 	2, 		6, 		50, 	1, 		1));
	weapons.push(new OneH("Scimitar", 			"blade", 	"A curious blade that curves and widens, to give more power to its swings.",  							1,		25, 	90,		8,		14,		10,		6,		1));
	weapons.push(new TwoH("Longsword", 			"blade", 	"A well-balanced and versatile sword.",  																2,		50, 	90,		12,		18,		10,		9,		1));
	weapons.push(new TwoH("Claymore", 			"blade", 	"A long, heavy blade with a sturdy hilt.",  															1,		50, 	90,		20,		28,		20,		12,		1));
	weapons.push(new OneH("Vampire Fang", 		"blade",	"A long, crooked fang pulled from the mouth of a dead vampire. Heal for half of your damage dealt.", 	3,		60, 	70, 	1, 		3,	 	0, 		1, 		1, 		true));
	weapons.push(new TwoH("Ephemeral Blade", 	"blade", 	"A ghastly, translucent blade that hardly has any weight to it.",  										4,		150, 	100,	4,		8,		30,		1,		1,  	true));
	weapons.push(new TwoH("Sweeping Sword", 	"blade", 	"A sacred sword, taken from the hands of a dead angel. Each attack damages every enemy in your row.",  	1,		150, 	90,		10,		16,		30,		12,		1,  	true));
	//Blunt Weapons
	weapons.push(new TwoH("Club", 				"blunt", 	"A brutish club made of heavy, gnarled wood.",  														1,		10, 	60, 	12, 	22, 	70, 	6, 		1));
	weapons.push(new OneH("Morningstar", 		"blunt", 	"A short-handed mace with a spiked head.",  															3,		25, 	70, 	6, 		8, 		50, 	3,		1));
	weapons.push(new OneH("War Hammer", 		"blunt", 	"A wooden haft with a metal head featuring a hammer on one side, and a spike on the other.",  			1,		25, 	70, 	10, 	16,		70, 	6, 		1));
	weapons.push(new TwoH("Mace", 				"blunt", 	"A long, metal pole with a spherical head on its end.",  												2,		50, 	70,		10,		16,		80,		6,		1));
	weapons.push(new TwoH("Maul", 				"blunt", 	"A massive, two-handed war hammer that packs a serious punch.",  										1,		50, 	70, 	26, 	32, 	70, 	12, 	1));
	weapons.push(new TwoH("Ogre Club",			"blunt", 	"A massive club that only the strongest heroes can wield.",  											1,		125,	60,		32,		48,		60,		18,		2, 		true));
	//Whips
	weapons.push(new OneH("Whip", 				"whip", 	"A leather whip, tipped with a sharp metal point. It has quite a long reach.",  						1,		25, 	90,		8,		12,		0,		6,		3));
	weapons.push(new OneH("Scourge", 			"whip", 	"A short-handled whip with several strips of metal-tipped leather at its head.",  						4,		25, 	70,		4,		8,		0,		3,		2));
	weapons.push(new OneH("Urumi", 				"whip", 	"A cross between a sword and a whip, this weapon requires some skill to properly utilize.",  			1,		25, 	80,		6,		12,		0,		3,		2));
	weapons.push(new TwoH("Flail", 				"whip", 	"A short handle that ends with three spiked heads, connected to the haft by iron chains.",  			1,		50, 	80,		10,		20,		70,		6,		1));
	//Axes
	weapons.push(new OneH("Hatchet", 			"axe", 		"A short, simple axe that splits wood and skulls alike.",  												3,		25, 	80, 	2, 		6, 		20, 	2, 		1));
	weapons.push(new OneH("Throwing Axe", 		"axe", 		"A small, short-handled axe designed to be thrown.",  													3,		25, 	80, 	4, 		6, 		20, 	3, 		3));
	weapons.push(new OneH("Bearded Axe", 		"axe", 		"A one handed axe whose blade has been extended to provide a longer cutting edge.",  					1,		25, 	80, 	10, 	14, 	20, 	6, 		1));
	weapons.push(new TwoH("War Axe", 			"axe", 		"A one-sided steel axehead fixed onto a long pole.",  													2,		50, 	80, 	12, 	24, 	20, 	9,		1));
	weapons.push(new TwoH("Great Axe", 			"axe", 		"A massive axe-blade fixed onto a relatively short handle.",  											1,		50, 	70, 	8, 		52, 	20, 	12,		1));
	weapons.push(new TwoH("Coral Axe", 			"axe", 		"Made from a hunk of violet coral. Afflicts bleed. Deals +25% damage against bleeding enemies.",  		2,		125, 	80, 	8, 		16, 	20, 	6,		1,		true));
	//Polearms
	weapons.push(new OneH("Short Spear", 		"polearm", 	"A small spear designed for use with annother weapon or shield.",  										3,		25, 	80,		6,		10,		30,		4,		2));
	weapons.push(new TwoH("Quarterstaff", 		"polearm", 	"A long pole with weighted sections on its ends.",  													1,		50, 	75,		8,		16,		70,		6,		2));
	weapons.push(new TwoH("Spear", 				"polearm", 	"A long spear, that provides decent damage and puncturing power.",  									1,		50, 	90,		14,		20,		30,		9,		2));
	weapons.push(new TwoH("Halberd",			"polearm", 	"A long-handled weapon that features a hammer, axe-blade, and spear tip on its head.",  				2,		50, 	75,		10,		20,		30,		6,		2));
	weapons.push(new TwoH("Swordfish Spear",	"polearm", 	"A giant spear made from the nose of a monstrous swordfish.",											1,		100,	80,		16,		24,		50,		9,		3,		true));
	
	//Shields
	weapons.push(new OneH("Buckler", 			"shield", 	"A simple wooden shield. Provides 20% Block Chance.", 													1,		25, 	90, 	4, 		6, 		50, 	3,		1));
	weapons.push(new OneH("Spiked Shield", 		"shield", 	"A shield with weighty metal spikes that give it extra puncturing power. Gives 20% Block Chance.",   	1,		25, 	90, 	6, 		12, 	70, 	6,		1)); 	
	weapons.push(new OneH("Shield", 			"shield", 	"A tall shield that offers greater protection to its user. Gives 40% Block Chance.",   		 			1,		50, 	90, 	4, 		8, 		50, 	6,		1));
	weapons.push(new OneH("Eel Shield", 		"shield", 	"Made from the hide of an electric eel. Gain 2 Static stacks when attacked. Gives 20% Block Chance.",   1,		75, 	90, 	4, 		8, 		50, 	6,		1, 		true));
	//Ranged
	weapons.push(new TwoH("Staff Sling", 		"ranged", 	"A long pole with a sling on its end.",   		 		 		 		 		 		 		 		2,		50, 	70,		8,		12,		80,		3,		3));
	weapons.push(new TwoH("Longbow", 			"ranged", 	"A powerful bow thats almost as tall as its user.",   		 		 		 		 		 		 	2,		50, 	80,		8,		14,		20,		6,		5));
	weapons.push(new TwoH("Crossbow", 			"ranged", 	"A slow-loading crossbow that offers good damage and penetration.",   		 		 		 		 	1,		50, 	90,		12,		16,		30,		6,		5));
	weapons.push(new TwoH("Repeating Crossbow", "ranged", 	"A variant of the crossbow that can quickly load its bolts, at the cost of power.",  		 		 	4,		50, 	70,		4,		8,		0,		3,		5));
	weapons.push(new TwoH("Hand Cannon", 		"ranged", 	"A heavy weapon from far east. Its shots pass through enemies, but carrying it slows you down.",  		1,		100, 	45,		26,		32,		50,		12,		3));
	
	//Potions and Tinctures			
	items.push(new Item("Gold", 				"mimic", 	0, 		""));
	items.push(new Item("Health Potion", 		"potion", 	15, 	"Restores 30 HP over time."));
	items.push(new Item("Stamina Potion", 		"potion", 	10, 	"Restores 50 Stamina"));
	items.push(new Item("Haste Potion", 		"potion", 	10, 	"Restores 6 AP"));
	items.push(new Item("Panacea", 				"potion", 	10, 	"A thick green potion that cleanses all of your debuffs."));
	items.push(new Item("Bottle of Ash", 		"potion", 	0, 		"A bottle of oily black ash."));
	items.push(new Item("Warp Potion", 			"potion",   25,     "A potion to take you home. It's sold in a tan bottle."));
	items.push(new Item("Rage Potion", 			"potion",   25,     "A potion that fills you with rage, granting you +50% damage dealt."));
	//items.push(new Item("Tears of a God", 		"potion",   40,     "A potion that will render you invincible for a short time."));
	items.push(new Item("Skill Potion", 		"potion", 	250, 	"Provides +1 Stat Point"));
	items.push(new Item("Penelope's Brew", 		"drink", 	1, 		"A proprietary brew of Penelope. May or may not be any good."));
	items.push(new Item("Mead", 				"drink", 	3, 		"The taste of honey is especially strong."));
	items.push(new Item("Imperial Wine", 		"drink", 	5, 		"A mediocre vintage that has aged well. There's dust on the bottle."));
	items.push(new Item("Northern Wine", 		"drink", 	10, 	"A fine violet wine from the far north."));
	items.push(new Item("Fire Tincture",		"tincture",	10,		"Deal 30 Magical damage to an enemy."));
	items.push(new Item("Peel Tincture", 		"tincture", 15,		"Reduce a target's armor to 0 for 3 turns."));
	items.push(new Item("Necrosis Tincture", 	"tincture", 15,		"Reduce a target's healing by 100% for 3 turns."));
	items.push(new Item("Confusion Tincture",	"tincture",	20,		"Cause an enemy to attack other enemies for 1 turn."));
	items.push(new Item("Polymorph Tincture",	"tincture",	20,		"A potion to transform a foe into a wretched beast."));
	
	items.push(new Item("Diamond",				"treasure",	300,	"A white diamond that shimmers as the light shines through it."));
	items.push(new Item("Ruby",					"treasure",	300,	"A brilliant red gemstone, cold to the touch."));
	items.push(new Item("Golden Idol",			"treasure",	300,	"A heavy, solid gold statuette of a fat figure."));
	items.push(new Item("Pearl Necklace",		"treasure",	300,	"A string of fat, spherical pearls on a silver thread. They shine like moonlight."));
	items.push(new Item("Ancient Coins",		"treasure",	300,	"A hefty trove of ancient coins, minted in gold and electrum."));
	
	for (let i = 0; i < spells.length; i++) {
		let spell = spells[i];
		let scroll = new Item("Scroll: " + spell.name, "scroll", 15, "");
		if (spell.school == "wild") {
			scroll.value = 30;
			scroll.rare = true;
		}
		scroll.description += "*YELLOW*" + spell.AP + " AP ";
		if (spell.AP < 10) {
			scroll.description += " ";
		}
		scroll.description += "*RED*" + spell.HP + " HP ";
		if (spell.HP < 10) {
			scroll.description += " ";
		}
		scroll.description += "*PINK*"+spell.description;
		items.push(scroll);
	}
	
	items.push(new Item("Scroll: Random",		"scroll",	5,		"A scroll that contains a random spell."));
	items.push(new Item("Tome of the Duelist",	"spellbook",60,		"A book about spells relating to single-target damage."));
	items.push(new Item("Tome of Strength",		"spellbook",60,		"A book about spells relating to buffs that affect the caster."));
	items.push(new Item("Tome of Summoning",	"spellbook",60,		"A book about spells relating to the summoning of creatures."));
	items.push(new Item("Tome of Affliction",	"spellbook",60,		"A book about spells relating to debuffing enemies."));
	items.push(new Item("Tome of Destruction",	"spellbook",60,		"A book about spells relating to damaging groups of enemies."));
	items.push(new Item("Tome of the Guardian",	"spellbook",60,		"A book about spells relating to healing and buffing allies."));
	items.push(new Item("Backpack", 			"backpack",	50,		"Increases your carry capacity to 15 Item Slots."));
	items.push(new Item("Wand",					"staff",	40,		"Used to cast spells."));
	items.push(new Item("Crook", 				"staff",	100,	"Your healing spells heal +2 HP. Heals you receive are increased by +1 HP"));
	items.push(new Item("Coral Staff", 			"staff",	100,	"A colorful staff, sturdy and well-formed. Your damaging spells afflict bleeding. +4 Physical & +4 Magical Armor", true));
	items.push(new Item("Blood Staff", 			"staff",	100,	"A staff wrought of bone and inset with crystals of angelic blood. Heal +6 HP per turn. You're immune to Poison.", true));
	items.push(new Item("Driftwood Staff",		"staff",	100,	"Your damaging spells afflict poison. For every 3 Poison Stacks on your enemies, heal +1 HP.", true));
	items.push(new Item("Rotten Staff",			"staff",	100,	"Mushrooms sprout from this ancient staff. When an enemy dies, deal 4 true damage to all enemies.", true));
	items.push(new Item("Staff",				"staff",	100,	"+1 Casts/Turn. Adds +1 Damage to your spells."));
	items.push(new Item("Scepter",				"staff",	100,	"Spells have a 20% Chance to not cost AP/HP."));
	
	items.push(new Item("Fishing Pole",			"pole",		50,		"A strong fishing pole, hand-crafted by Gout. It's capable of catching just about anything."));
	items.push(new Item("Masterwork Pole",		"pole",		100,	"A fishing pole wrought of dark wood as solid as steel. Its unbreakable line shimmers like gold in the sun."));
	items.push(new Item("Divine Pole",			"pole",		250,	"From the merry halls of an ancient god there fell to the earth a fishing pole, that shone like silver."));
	
	//Freshwater Fish										HP Restore
	items.push(new Item("Minnow",				"fish",		1,		"A tiny, silvery-green fish about the size of your pinky finger. It's more like bait than a catch."));
	items.push(new Item("Crawdad",				"fish",		1,		"A small brown crustacean, long of body like a shrunken lobster."));
	items.push(new Item("Crappie",				"fish",		5,		"A short, fat fish; dark green with translucent fins and a sour expression."));
	items.push(new Item("Carp",					"fish",		5,		"A dull, largely unremarkable fish of middling size."));
	items.push(new Item("Trout",				"fish",		5,		"A plump, speckled green fish with vibrant orange fins and a soft white underbelly."));
	items.push(new Item("Perch",				"fish",		5,		"A black-striped yellow fish with thick, spiny fins."));
	items.push(new Item("Salmon",				"fish",		5,		"A long, bright red fish with a green head; prized for the taste of its flesh."));
	items.push(new Item("Bluegill",				"fish",		4,		"A small blue-green fish with an orange underbelly and striking red eyes."));
	items.push(new Item("Shad",					"fish",		6,		"A fair-sized fish wreathed faintly colorful scales that shimmer in the light."));
	items.push(new Item("Catfish",				"fish",		6,		"A flat, fat fish with small wideset eyes and long flowing whiskers."));
	items.push(new Item("Bass",					"fish",		6,		"A strong, medium-sized black-striped with dark green fins and a pale underbelly."));
	items.push(new Item("Freshwater Eel",		"fish",		8,		"A black, oily serpentine creature that dwells in rivers and streams."));
	items.push(new Item("Pike",					"fish",		8,		"A heavy fish, dark with pale spots. Its long face boasts a blissful ignorance."));
	items.push(new Item("Gar",					"fish",		8,		"A large slender fish with vibrant splotches and a long, toothy snout."));
	items.push(new Item("Sturgeon",				"fish",		8,		"A large lethargic fish covered in heavy grey plated scales."));
	//Ocean Fish
	items.push(new Item("Shrimp",				"fish",		1,		"A pink critter with many legs and long attennae that flow behind its body."));
	items.push(new Item("Sardine",				"fish",		1,		"A miniscule silvery blue fish that travels in large schools."));
	items.push(new Item("Crab",					"fish",		2,		"A pale red crustacean with a solid shell and two large pincers."));
	items.push(new Item("Common Snook",			"fish",		3,		"A drab yellow fish with a single black stripe along its sides."));
	items.push(new Item("Squid",				"fish",		4,		"A small tentacled creature, with a long head and a curious look in its black eyes."));
	items.push(new Item("Mackerel",				"fish",		4,		"A medium-sized fish with a white underbelly and a green and blue back that shimmers iridescently in the light."));
	items.push(new Item("Hake",					"fish",		5,		"A drab fish with long fins along its back and stomach, that give it an almost eel-like appearance."));
	items.push(new Item("Flying Fish",			"fish",		6,		"A small fish with colorful wings, known to hop out of the water and glide."));
	items.push(new Item("Snapper",				"fish",		6,		"A heavy pink fish with red highlights on its fins."));
	items.push(new Item("Pufferfish",			"fish",		7,		"A spiny, wide-eyed fish, colorful and capable of inflating itself into a ball."));
	items.push(new Item("Cod",					"fish",		8,		"A plump-bellied fish, yellow and red with a white stripe along its side."));
	items.push(new Item("Sunfish",				"fish",		8,		"A large and largely thoughtless fish. Its body is flat, balanced by two prominent vertical fins."));
	items.push(new Item("Grouper",				"fish",		8,		"A huge fish, brown and wrinkled with a sour expression."));
	//Rare Ocean Fish
	items.push(new Item("Jellyfish",			"fish",		2,		"A colorful flow of dangerous tentacles that drift behind the creatures domed head."));
	items.push(new Item("Ray",					"fish",		4,		"A flat grey creature with a long tail that glides elegantly through the water."));
	items.push(new Item("Stonefish",			"fish",		4,		"A spiny and lethargic creature, colorful, but bearing a stupid expression."));
	items.push(new Item("Eel",					"fish",		5,		"A sleek, sharp-toothed creature, cautious, but capable of moving with great speed."));
	items.push(new Item("Octopus",				"fish",		5,		"A tentacled creature, colorful and dextrous with intelligent eyes."));
	items.push(new Item("Tuna",					"fish",		6,		"A large symmetrical fish, deep blue with a crescent tailfin and thornlike spikes along its body."));
	items.push(new Item("Wahoo",				"fish",		8,		"A large fish with a pointed mouth and vertical cyan stripes along its sides."));
	items.push(new Item("Swordfish",			"fish",		10,		"A large slender fish with long flowing fins and a sharp, needlelike protrusion on its snout."));

	
	//Phys										//  P       M       AP
	armor.push(new Armor("Plain Cloak", 			2,		0,		0,  20, "A plain cloak to keep off the elements."));
	armor.push(new Armor("Leather Cuirass", 		4, 		1, 		2, 	40, "A plain leather cuirass, well-worn and scuffed."));
	armor.push(new Armor("Scale Armor", 			5, 		2, 		3, 	50, "A tough armor made of overlapping scales of metal."));
	armor.push(new Armor("Chainmail", 				6, 		3, 		4, 	75, "A sturdy armor made of simple overlapping links of metal."));
	armor.push(new Armor("Plate Armor", 			8, 		4, 		6, 	100, "A strong armor wrought of solid plates of steel."));
	//Both
	armor.push(new Armor("Stylish Shirt", 			1,		1,		0,	15, "A rather stylish shirt."));
	armor.push(new Armor("Quilted Gambeson", 		2, 		2, 		1, 	40, "A thickly padded armor that covers from head to toe."));
	armor.push(new Armor("Silk Armor", 				4, 		4, 		3, 	75, "An exquisite piece of incredibly light armor."));
	armor.push(new Armor("Jade Armor", 				6, 		6, 		6, 	100, "An ancient armor wrought of shimmering Jade stone."));
	//Magical
	armor.push(new Armor("Plain Cassock", 			0,		2,		0,	15, "A monk's robes. They offer some protection against evil."));
	armor.push(new Armor("Acolyte Robes", 			0, 		4, 		1, 	30, "The robes of a novice mage. They're simple and servicable."));
	armor.push(new Armor("Warded Cloak",			1,		6,		2,	60, "This was left at the tavern by a travelling mage. He never returned for it."));
	armor.push(new Armor("Amethyst Tunic",			2,		8,		3,	90, "An brilliant piece of apparel made of shining, fibrous amethyst."));
	armor.push(new Armor("Drakeskin Cloak",			2,		10,		4,  100, "A cloak made of the processed hide of a drake.", true));
	
	armor.push(new Armor("Drowned Armor",			5,		4,		3,  100, "Black armor that reeks of rust and salt. -25 Max HP. +25% Damage Dealt.", true));
	armor.push(new Armor("Anchor Armor",			16,		10,		12, 100, "Immense armor forged from the anchors of sunken ships.", true));
	armor.push(new Armor("Fishnet Stockings",		0,		0,		0,  100, "They don't offer much protection, but damn do your legs look good.", true));
	armor.push(new Armor("Haunted Hookscale",		3,		3,		0,  100, "The hooks hunger. Each turn, take 6 damage and deal 8 damage to all enemies.", true));
	
	for (let i = 0; i < weapons.length; i++) {
		items.push(weapons[i]);
	}
	for (let j = 0; j < armor.length; j++) {
		items.push(armor[j]);
	}
}

//Normal Spell that Targets Enemies (or has no targets)
function addSpell(name, school, description, number, AP, HP = 0, Range = 6) {
	spells.push(new Spell(name, school, description, AP, HP, Range, number, 0, 0));
}

//Spell that targets rows
function rowSpell(name, school, description, number, AP, HP = 0, Range = 6) {
	//Spell(name, description, AP, HP = 0, range = 6, numEnemies = 0, numRows = 0, numAllies = 0) {
	spells.push(new Spell(name, school, description, AP, HP, Range, 0, number, 0));
}

//Spell that targets allies
function allSpell(name, school, description, number, AP, HP = 0, Range = 6) {
	spells.push(new Spell(name, school, description, AP, HP, Range, 0, 0, number));
}

function initSpells() {
	// - Single-Target // Tome of the Duelist
	//		 Name				School			Description																								#, AP, HP, Range
	addSpell("Arcane Strike",	"duelist",		"Deal 8 Damage to an enemy.",																			1, 6);
	addSpell("Spear", 			"duelist",		"Deal 10-16 Damage to an enemy on your row.", 															1, 6, 0, 1);
	addSpell("Siphon", 			"duelist",		"Deal 4-8 Damage and Heal 4 HP.", 																		1, 6);
	addSpell("Pierce", 			"duelist",		"Deal 4 True Damage to an enemy.", 																		1, 4);
	addSpell("Hemic Strike",	"duelist",		"Lose 5 HP. Deal 12-18 Damage to an enemy.",															1, 9, 5);
	addSpell("Lightning",		"duelist",		"Deal 2 damage to an enemy. Gain a stack of static.",													1, 2);
	addSpell("Swamp Strike",	"wild",			"Deal 3-6 damage to a target and afflict as many stacks of poison.",									1, 6);
	
	// - Self-Buffs // Tome of Strength
	//		 Name				School			Description																								#, AP, HP, Range
	addSpell("Meditation",		"strength",		"Gain 9 Stamina.",																						0, 3);
	rowSpell("Blink",			"strength",		"Teleport to a targeted row",																			1, 4);
	addSpell("Stoneskin",		"strength",		"+8 Physical Armor +4 Magical Armor for 3 turns.",														0, 6);
	addSpell("Preparation",		"strength",		"Gain 4 AP a turn. Lasts 3 turns.",																		0, 6);
	addSpell("Ferocity", 		"strength",		"Your damaging spells do +2 DMG per instance this turn.", 												0, 3);
	addSpell("Endure", 			"strength",		"Increase the duration of your buffs by 1 turn.", 														0, 12);
	addSpell("Roots", 			"wild",			"Root yourself for 3 turns. Heal 6 HP per turn for 3 turns.", 											0, 6);
	addSpell("Feed Flame", 		"wild",			"Gain 1 Ember. Deal damage equal to the amount of Embers you have. Each turn, take +1 damage.", 		1, 4);
	addSpell("Ignite", 			"wild",			"For each Ember you have, lose 1 HP & deal damage equal to half your total number of Embers.",			1, 9);
	
	// - Summoner // Tome of Summoning
	//		 Name				School			Description																								#, AP, HP, Range
	rowSpell("Summon Bees",		"wild",			"Lose 2 HP. Summon a Swarm of Bees.",																	1, 6, 2);
	rowSpell("Summon Zombie",	"summoning",	"Lose 6 HP. Summon a Zombie.",																			1, 6, 6);
	rowSpell("Summon Specter",	"wild",			"Lose 6 HP. Summon an Apparition.",																		1, 9, 6);
	rowSpell("Summon Spores",	"wild",			"Lose 6 HP. Summon 3-5 Living Spores.",																	1, 9, 6);
	rowSpell("Summon Mushroom",	"wild",			"Lose 6 HP. Summon a Toxic Mushroom.",																	1, 9, 6);
	rowSpell("Summon Anemone",	"wild",			"Lose 3 HP. Summon a Giant Anemone.",																	1, 6, 3);
	rowSpell("Summon Coral",	"wild",			"Lose 3 HP. Summon a Coral Shard.",																		1, 6, 3);
	rowSpell("Summon Archer",	"summoning",	"Lose 8 HP. Summon an archer.",																			1, 9, 8);
	rowSpell("Summon Warrior",	"summoning",	"Lose 10 HP. Summon a warrior.",																		1, 12, 10);
	rowSpell("Summon Beast",	"summoning",	"Lose 20 HP. Summon a random animal.",																	1, 12, 20);
	allSpell("Maintain",		"wild",			"Refresh the Fading effect of a creature, keeping them around for 3 more turns.",						1, 6);
	addSpell("Empower",			"summoning",	"Your currently summoned creatures deal +3 Damage per attack for 3 turns.",								0, 6);
	addSpell("Shepherd", 		"summoning",	"Heal your summoned creatures 4-8 HP.",																	0, 6);
	addSpell("Compensation", 	"summoning",	"Heal 8 HP when an ally is struck down. Lasts until the end of combat",									0, 6);
	
	// - Debuffs // Tome of Affliction
	//		 Name				School			Description																								#, AP, HP, Range
	addSpell("Redirection",		"affliction",	"Transfer your debuffs to an enemy.",																	1, 9);
	addSpell("Peel",			"affliction",	"Reduce an enemy's Physical & Magical Armor by 1.",														1, 3);
	addSpell("Expose",			"affliction",	"Increase the damage an enemy takes by 20% this turn.",													1, 6);
	addSpell("Bind",			"wild",			"Root an enemy for 3 turns.",																			1, 6);
	addSpell("Envenom",			"wild",			"Afflict an enemy with venom for 4 turns.", 															1, 4);
	rowSpell("Gale",			"affliction",	"Push a row of enemies back one row.",																	1, 5);
	rowSpell("Disperse",		"affliction",	"Teleport every enemy on your row to a random row, at least 2 rows away from you.",						0, 4, 0, 1);
	addSpell("Freeze",			"affliction",	"Deal 2-4 damage to an enemy and stun them.",															1, 6);
	
	// - AoE Damage // Tome of Destruction
	//		 Name				School			Description																								#, AP, HP, Range
	rowSpell("Wall of Fire",	"destruction",	"Deal 3-6 Damage to every enemy in a row.", 															1, 9);
	rowSpell("Radiance", 		"destruction",	"Deal 6-10 Damage to all enemies on your row.", 														0, 9, 0, 1);
	addSpell("Reap",			"destruction",	"Lose 10 HP. Deal 4-6 Damage to all enemies, healing 1 HP per target.",									0, 9, 10);
	addSpell("Blizzard",		"destruction",	"Deal 2-4 damage to every enemy and slow them.",														0, 6);
	addSpell("Sunbeams",		"destruction",	"Deal 2-16 damage to a random enemy in each row.",														0, 6);
	addSpell("Exploit",			"destruction",	"Deal 3 damage to every enemy per debuff they have.",													0, 9);
	addSpell("Holy Flame",		"destruction",	"Deal 1 damage per 2 AP you have to each enemy, costs all of your AP.",									0, 0);
	
	// - Healing & Buffs // Tome of the Guardian
	//		 Name				School			Description																								#, AP, HP, Range
	addSpell("Protection",		"guardian",		"+2 Physical Armor +2 Magical Armor for your allies 3 turns.",											0, 9);
	allSpell("Heal",			"guardian",		"Heal an ally 4-6 HP.",																					1, 4);
	addSpell("Rally",			"guardian",		"All allies gain 6 Stamina.",																			0, 4);
	addSpell("Guidance",		"wild",			"Heal all allies 3 HP.",																				0, 5);
	allSpell("Transfer Life",	"guardian",		"Lose 5 HP. Heal an ally for 8-10 HP.",																	1, 6, 5);
	allSpell("Purify",			"guardian",		"Remove all debuffs from an ally.",																		1, 5);
	allSpell("Deliverance",		"guardian",		"Lose 2 HP. Give an ally a stack of deliverance, which will save them from death one time.",			1, 4, 2);
	
	//Special Spells
	//		 Name				School			Description																								#, AP, HP, Range
	addSpell("Gamble",			"wild",			"Spend 3 gold. Deal 10 damage to a target. There's a small chance to hit a Jackpot!",					1, 6);
	
}

function initEnemies() {
	//0 - The Haunted Crypts
	//						Name, 					HP, 	Phys, 	Magic, 	Diff	Zones		MOVES	TYPE			DESCRIPTION
	enemies.push(new Enemy("Imp",					35,		0,		0,		30,		[0, 1],		2,		"evil", 		"A miniscule, grey-skinned creature. Its long, spindly limbs support a fat torso that's little more than a ravenous mouth and a single eye"));
	enemies.push(new Enemy("Zombie",				50,		0,		0,		30,		[0], 		2,		"evil", 		"A shambling heap of cold, rotting flesh. It's grey-eyed, and lacking any intellect.")); //Phys
	enemies.push(new Enemy("Apparition",			20,		50,		50,		30,		[0], 		0, 		"evil", 		"A pale, transient figure bearing closer resemblance to a shimmering fog than to the human it once was.")); //Magic
	enemies.push(new Enemy("Cultist",				50,		2,		2,		50,		[0, 2], 	2,		"", 			"Dressed in dark robes. They seem elated when they cut into flesh. What honeyed words have led them here, beyond reason?")); //Phys
	enemies.push(new Enemy("Cave Spider",			80,		1,		0,		50,		[0], 		3,		"animal", 		"A frail-seeming thing, pale in color and long of leg and body. Clear venom drips from its fangs.")); //Phys
	enemies.push(new Enemy("Skeletal Swordsman",	40,		16,		12,		50,		[0], 		1,		"evil", 		"Bleached white bones, devoid of all flesh, held together by dark magic and rusted armor. It wields an ancient Longsword.")); //Phys
	enemies.push(new Enemy("Skeletal Spearman",		40,		16,		12,		50,		[0], 		1,		"evil", 		"Bleached white bones, devoid of all flesh, held together by dark magic and rusted armor. It wields an ancient Spear.")); //Phys
	enemies.push(new Enemy("Skeletal Archer",		30,		16,		12,		50,		[0], 		1,		"evil", 		"Bleached white bones, devoid of all flesh, held together by dark magic. It wields a Longbow.")); //Phys
	enemies.push(new Enemy("Goblin Swordsman",		85,		3,		1,		60,		[0, 1], 	2,		"", 			"A fanged, snarling goblin. Its blade is crudely wrought of iron, and chipped by many battles.")); //Phys
	enemies.push(new Enemy("Goblin Spearman",		85,		3,		1,		60,		[0, 1], 	2,		"", 			"A fanged, snarling goblin. It wears a leather cuirass and wields a spear.")); //Phys
	enemies.push(new Enemy("Goblin Archer",			70,		2,		1,		60,		[0, 1], 	2,		"", 			"A fanged, snarling goblin. It's lightly armored and carrying a longbow with a quiver of stone arrows.")); //Phys
	enemies.push(new Enemy("Hungry Ghoul",			90,		0,		3,		70,		[0], 		2, 		"evil", 		"A ravenous humanoid creature, crawling on all fours. Its mouth hangs open; blood and flesh sticks to its grey teeth.")); //Magic
	enemies.push(new Enemy("Wandering Moon", 		50,		16,		8,		70,		[0, 1, 2],	2,		"construction", "A rough sphere of glowing marble that floats ominously above travellers, eclipsing the true moon as to remain undetected."));
	enemies.push(new Enemy("Bronze Bellbeast", 		60, 	8,		8,		75, 	[0], 		1,		"construction", "An ancient church bell, floating ominously above the ground. It still hums from the resonation of its last tolling.")); //Magic
	enemies.push(new Enemy("Flesh Golem",			150,	0,		0,		100,	[0], 		2,		"", 			"A hulking assembly of flesh, crudely sewn and heaped together and imbued with life.")); //Phys
	enemies.push(new Enemy("Swarm of Bats", 		200,	6,		6,		200,	[0],		4,		"animal", 		"A swarm of dark vampire bats. They move in unison, as though they were of mind.")); //phys
	enemies.push(new Enemy("Vampire", 				200,	6,		6,		200,	[0],		4,		"evil", 		"A slim pale-skinned figure, dressed in old yet sturdy attire. There is an animal hunger behind their intelligent eyes.")); //magic
	enemies.push(new Enemy("Cult Leader", 			400, 	4,		8,		300, 	[0, 1, 2], 	2,		"", 			"A towering, muscular figure. He's decked out in ornate robes and gem-encrusted rings, and carrying a jagged onyx blade.")); //Phys
	enemies.push(new Enemy("Lost Angel", 			777, 	7,		7,		777, 	[0], 		3,		"", 			"It is a creature of sublime beauty, surrounded by a glowing white aura, but behind its pretty eyes is a twitchy, animal intent. It seems to have gone mad down here.")); //Magic
	enemies.push(new Enemy("Lich", 					600, 	16,		12,		700, 	[0], 		1,		"evil", 		"The Harbringer of Death. Its face is hidden beneath a dark mask from which all eyes turn. The dead obeys.")); //Magic
	enemies.push(new Enemy("Goblin Warlord", 		600, 	6,		6,		500, 	[0, 1, 2], 	1,		"", 			"A tall, muscular creature with fangs that portrude as tusks. There is a wicked intelligence clear upon its face. It seems proud in its work.")); //Phys
	enemies.push(new Enemy("Grand Architect", 		300,	30,		12,		1200,	[0, 1, 2],	2,		"construction",	"A short patchwork of wrinkled flesh stretched between shining brass and steel. Its limbs twitch with the turning of gears as its deft hands tend to the constructions it has wrought."));
	enemies.push(new Enemy("Warding Shield",		800,	12,		6,		1202,	[],			0,		"construction",	"A pillar of metal, inlaid with gold and silver runes. It whirs and spins and static electricity sweeps the ground around it. It emits a spherical field of energy that deflects any assault that comes from a distance."));
	enemies.push(new Enemy("Mechanical Gunman",		100,	0,		0,		1199,	[],			0,		"construction",	"A spindly machine with a tall drafted a vaguely impish form. Its arms are as long as long as its body is tall, and inset into its cylindrical head is a bright gemstone that acts as an eye. It wields its hand cannon with grace."));
	enemies.push(new Enemy("Mechanical Guardsman",	400,	18,		12,		1201,	[],			3,		"construction",	"A squat, sturdy machine which wields broad tower shield. It patrols to and fro, guarding its creator."));
	//1 - The Acrid Swamp
	//						Name, 					HP, 	Phys, 	Magic, 	Diff	Zones		MOVES	TYPE		DESCRIPTION
	enemies.push(new Enemy("Acidic Slime",			60,		0,		0,		40,		[1, 0], 	1,		"animal", 	"A large, slow-moving heap of thick caustic goop, that steams as it moves over living matter.")); //Phys
	enemies.push(new Enemy("Toxic Mushroom",		20,		2,		2,		20,		[1, 2], 	0,		"plant",  	"A giant black mushroom, crusted in flesh as solid as wood and covered with deadly spores."));
	enemies.push(new Enemy("Giant Amoeba",			50,		0,		0,		30,		[1], 		1,		"animal", 	"A dim creature, slow, yet strong. It makes its way cautiously about the world.")); //Phys
	enemies.push(new Enemy("Slugbeast",				100,	0,		0,		40,		[1, 2],		1,		"animal", 	"A giant muscled mass of dark brown-grey flesh. Its bulk is covered in a layer of slime.")); //Phys
	enemies.push(new Enemy("Living Vine",			50,		0,		0,		40,		[1, 2], 	2,		"plant",  	"A heap of vines that coil and strike, likely animated by some wanton witch or mage.")); //Phys
	enemies.push(new Enemy("Swamp Ape",				75,		1,		1,		40,		[1],  		2,		"animal", 	"A shaggy ape covered in damp, white fur. It stretches its sinewy arms and screeches, revealing its sturdy fangs.")); //Phys
	enemies.push(new Enemy("Witch",					60,		0,		4,		70,		[1], 		2,		"", 	  	"A cunning being, well-learned in the brewing of potions and the casting of hexes. She wanders the swamp in search of rare alchemical ingredients.")); //Magic
	enemies.push(new Enemy("Flaming Wisp",			25,		5,		5,		40,		[1], 		3,		"", 	  	"A glowing blue flame that hovers above the swamp waters. It has no reflection.")); //Magic
	enemies.push(new Enemy("Caustic Snail",			40,		22,		10,		70,		[1, 2], 	1,		"animal", 	"A giant snail. Algae grows upon its strong shell. Its ooze has incredible toxic and restorative properties.")); //Phys
	enemies.push(new Enemy("Giant Frog",			80,		0,		0,		50,		[1, 2],		3,		"animal", 	"A giant frog that sits nearly submerged in the water, silently waiting to rise up, and with a flick of its tongue devour its prey.")); //Phys
	enemies.push(new Enemy("Mushroom Mage", 		75,		0,		2,		90,		[1, 2],		1,		"",		  	"A myopic fellow, perpetually high off of spores. His magic may not be the most powerful, but many an adventurer has died underestimating the toxic spores."));
	enemies.push(new Enemy("Swamp Stalker", 		45,		0,		0,		70,		[1, 2],		1,		"animal", 	"An ambush predator with an elongated body like a salamander's and long barbed tentacles. Only its protruding eyes are visible through the thick lichens growing on its flesh. *YELLOW*Added by Morgan"));
	enemies.push(new Enemy("Fumous Fiend",			100,	0,		0,		60,		[1], 		1,		"evil",   	"A hulking bipedal demon with gaseous blood. It inhales, and bloats at once to twice its regular size. On a whim its pores expand, and out pours a toxic mist.")); //Phys
	enemies.push(new Enemy("Swamp Mage",			60,		0,		4,		75,		[1], 		2,		"",       	"A native of the swamp. She is attuned to the toxins and creatures of her environment, she views such incursions as these with the utmost contempt.")); //Magic
	enemies.push(new Enemy("Foul Sluglord", 		300, 	0,		0,		150, 	[1, 2],		1,		"animal", 	"A heaping musculature, vast almost beyond fathoming. Its slow movements cause the ground about it to rumble, and it packs a fiercome bite.")); //Phys
	enemies.push(new Enemy("Wisp Knight", 			100, 	8,		8,		150, 	[1, 0],		2,		"", 	  	"A suit of chivalric plate armor, imbued with life by a blue flame within.")); //Magic
	enemies.push(new Enemy("Slimelord", 			200, 	0,		0,		175, 	[1, 0],		2,		"animal", 	"A tumultuous mass, oozing, shifting, steaming. It has grown beyond its ability to maintain cohesion.")); //Phys
	enemies.push(new Enemy("Swamp Demon", 			250, 	4,		8,		600, 	[1],		3,		"evil",   	"A wretched thing, brimming with terrible power. The swamp water parts before the frantic, writing mass of its flesh; a collage of arms and faces clinging to one another.")); //Magic
	
	//2 - The Wilted Woods
	//						Name, 					HP, 	Phys, 	Magic, 	Diff	Zones		MOVES	TYPE			DESCRIPTION
	enemies.push(new Enemy("Impling Druid",			30,		0,		0,		20,		[0,1,2],	2,		"",				"A grey, spindly creature that has dressed itself in leaves, wielding a staff whittled from a decaying twig. It single eye glances around nervously."));
	enemies.push(new Enemy("Scoundrel", 			40,		0,		0,		40,		[2],		2,		"", 			"A round and gnarlish figure, who swipes his knife upward at you from his slumped position. *YELLOW*Added By Christopher"));
	enemies.push(new Enemy("Crazed Wolf", 			40, 	2,		0,		40, 	[2], 		3,		"animal", 		"A mangy wolf, foaming at its mouth and snapping viciously.")); //Phys
	enemies.push(new Enemy("Briar Beast", 			60, 	4,		2,		40, 	[2, 1], 	1,		"animal", 		"A squat, rotund creature with thorny wood-like skin and a shaggy coat of bright green leaves.")); //Phys + Magic Reflect
	enemies.push(new Enemy("Fae Trickster",			10,		0,		0,		30,		[2], 		0,		"", 			"A small, humanoid figure flittering on thin wings, dressed in vibrant green. Its face is more like an animal's than a man's, and is permanently curled into a mischievous sneer.")); //Magic
	enemies.push(new Enemy("Brigand",				50,		4,		2,		40,		[2], 		2,		"", 			"A human dressed in mismatched armor, carrying a pair of duel blades that seem to have seen their fair share of battles.")); //Phys
	enemies.push(new Enemy("Giant Spider",			75,		4,		0,		40,		[2, 0], 	3,		"animal", 		"A vast, fat-bodied insect roughly the size of a bull. Its body is covered in long thin hairs, and its eyes afix onto its prey.")); //Phys	
	enemies.push(new Enemy("Mossy Statue",			60,		14,		8,		55,		[0,1,2],	0,		"construction", "A Jade Statue of a beautiful woman, weathered by countless years in the forest. Its limbs and head have fallen into the dirt about its base. It hums quietly.")); //Magic
	enemies.push(new Enemy("Ogre",					75,		6,		2,		70,		[2, 1], 	1,		"", 			"A giant naked creature, twice as tall as any man and dragging a great club at its side. Flies cling to the blood that stains its cheeks and chin.")); //Phys
	enemies.push(new Enemy("Scaled Drake",			70,		5,		30,		75,		[2, 1], 	2,		"animal", 		"A wide-eyed quadruped, famed for its thick, pinecone-like hide. It has a wide body and short tail, and is highly resistant to magic.")); //Phys
	enemies.push(new Enemy("Wild Bear",				100,	6,		2,		80,		[2, 0], 	2,		"animal", 		"A towering one-eyed bear with claws as long and sharp as daggers. Its hide is greying, and criss-crossed with the scars of its many triumphs.")); //Phys
	enemies.push(new Enemy("Raging Boar",			100,	0,		0,		80,		[2, 1],		5,		"animal",		"A towering mass of muscle covered in dark, matted fur. Four yellow tusks protrude from its snout as long as daggers. Despite its massive size, it still moves with incredible speed."));
	enemies.push(new Enemy("Beekeeper", 			200, 	3,		3,		200, 	[2], 		1,		"", 			"A figure of medium height, dressed in clean white robes. Its face is hidden by a dome of tan wicker, and on its back is a wicker hive.")); //Phys
	enemies.push(new Enemy("Briar Monster", 		125, 	8,		4,		150, 	[2, 1], 	1,		"animal", 		"A Briar Beast grown to monstrous proportions. Its four limbs are as thick as tree trunks, and the thorns on its hide have grown so long they twist into loops.")); //Phys + Magic Reflect
	enemies.push(new Enemy("Forest Demon", 			150, 	4,		8,		125, 	[2],		2,		"evil", 		"An evil creature. It blends itself into its surroundings, changing its skin to match the foliage, waiting to ambush travellers and beast alike.")); //Magic
	enemies.push(new Enemy("Spider Queen", 			275, 	6,		2,		300, 	[2],		2,		"animal", 		"A monstrously large spider, with legs as long as pikes, and fangs as crushing as any war hammer.")); //Phys
	enemies.push(new Enemy("Brigand Lord",			150,	6,		2,		300,	[2], 		3,		"", 			"A princely figure, adorned in silver plate mail and decked in gold jewelry, pilfered from passing aristocrats. He has done his share in turning travellers away from the roads, and now he is king of the desolation.")); //Phys
	enemies.push(new Enemy("Houndlord", 			250, 	5,		5,		300, 	[2], 		2,		"", 			"It stands upright, cloaked in red, its face a shadow which light does not pierce. In each hand it holds a wide blade, and all around its knees wolves run to and fro. It knows no allegiance nor fear.")); //Phys
	
	//Hivelings
	//						Name, 					HP, 	Phys, 	Magic, 	Diff	Zones		MOVES	TYPE			DESCRIPTION
	enemies.push(new Enemy("Hiveling Larva",		30,		0,		0,		5,		[], 		2,		"animal",		"A small, damp creature with a soft, translucent body. Its legs blur and click as it scurries, shying away from the light of day."));
	enemies.push(new Enemy("Hiveling Healer",		100,	2,		2,		90,		[], 		2,		"animal",		"A weak insectoid creature, with a tall, flat head, bent inwards slightly as to be parabolic. Its eyes are black and wide-set. Of all the beasts of the world it is perhaps the most attuned with magic."));
	enemies.push(new Enemy("Hiveling Guard",		250,	12,		10,		110,	[], 		3,		"animal",		"A muscular insectoid creature, with flat chitinous armor plates layered over its body. When threatened it spreads its limbs and seems to double in size; its armor plates lock together and form a shield as solid as steel."));
	enemies.push(new Enemy("Hiveling Warrior",		175,	4,		4,		110,	[], 		2,		"animal",		"A long-limbed insectoid creature with huge spiked mandibles. When threatened, it can charge towards its foes with incredible haste."));
	enemies.push(new Enemy("Hiveling Spitter",		125,	4,		4,		110,	[], 		2,		"animal",		"A long-limbed insectoid creature with shortened mandibles and a tubular mouth that drips with acidic spit."));
	enemies.push(new Enemy("Hiveling Queen",		500,	4,		4,		500,	[], 		2,		"animal",		"A towering, large-eyed insectoid with a huge, sagging abdomen. Through her translucent chitin innumerable gestating larva can be seen."));
	
	
	//3 - The Stony Island
	//						Name, 					HP, 	Phys, 	Magic, 	Diff	Zones	MOVES	TYPE		DESCRIPTION
	enemies.push(new Enemy("Squallbird", 			40,		0,		0,		25,		[3],	5,		"animal", 	"With the disposition of a seagull and the wingspan of an albatross, a squallbird is a sailor’s nightmare. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Reef Crab", 			30,		16,		6,		25,		[3],	1,		"animal", 	"A crab the size of a large dog. The island hardly seems lush enough to support a population of such creatures. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Sunfish", 				45,		0,		0,		30,		[3],	3,		"animal", 	"A translucent filter feeder that stuns predators with a flash of bioluminescence as bright as its namesake. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Coral Crawler", 		35,		8,		6,		30,		[3],	1,		"animal", 	"It’s as if the seafloor itself is moving toward you. These creatures are docile unless provoked; their diet mostly consists of worms. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Swarmer Shark",			40,		0,		0,		30,		[3],	3,		"animal",	"A small with two black pinpoint eyes and antennae. It relies on its sense of smell and its coordination with the swarm to survive."));
	enemies.push(new Enemy("Lost Mariner", 			40,		4,		2,		35,		[3],	2,		"", 		"An old sailor who has lost his mind to parasitic barnacles that cling to his flesh like armor. Is anything left of the man he once was? *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Fishman Archer", 		50,		0,		0,		40,		[3],	2,		"", 		"A gilled humanoid of some intelligence, wielding a coral bow. No one knows whether the fishmen are a naturally occurring species or abominations born of the sea cult’s rituals. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Fishman Tridentier", 	75,		0,		0,		50,		[3],	2,		"", 		"A gilled humanoid of some intelligence, armed with a sharp fishing trident wrought of repurposed harpoons. No one knows whether the fishmen are a naturally occurring species or abominations born of the sea cult’s rituals. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Sea Sorceror",			75,		0,		6,		70,		[3],	2,		"",			"A masked humanoid, their body is clothed in vibrantly colored coral and anemones that have grown onto their scaled flesh. They wield a coral scepter."));
	enemies.push(new Enemy("Tidliwincus",			100,	0,		0,		70,		[3],	3,		"animal",	"A long-necked bird with a large beak and short wings, island living has caused it to grow inordinately large. Its tongue is forked into four thick tentacles, capable of dragging grown men away. . . *YELLOW*Added by Chase"));
	enemies.push(new Enemy("Stone Crab", 			40,		60,		60,		60,		[3],	1,		"animal", 	"A horse-sized crustacean with a mineralized shell that hardens continously as the creature ages. Its succulent meat could feed a ship’s crew for a week. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Squelcher",				75,		0,		0,		70,		[3],	3,		"animal",	"A hideous, jet-black beast like a manta ray with an elephant’s trunk. Squelchers often follow fishing vessels to steal their catch, and are typically heard before they’re seen. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Reefwalker", 			85,		0,		0,		70,		[3],	2,		"animal", 	"Reefwalkers stride along the coast on long, spindly legs, lowering their beaked maws into the water to catch unlucky crabs. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Sea Priest", 			60,		0,		0,		70,		[3],	2,		"", 		"The devotee of a cult that seeks salvation in the depths instead of the heavens. His clothes and hair are caked with salt. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Sea Priestess", 		60,		0,		0,		70,		[3],	2,		"", 		"The devotee of a cult that seeks salvation in the depths instead of the heavens. Her clothes and long hair are caked with salt. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Tube Snail", 			70,		6,		2,		70,		[3],	2,		"animal",	"A shelled sea snail, bristling with spines. It is unusually susceptible to Anchorite Worm infestation during an early stage of its lifecycle. As a result it has developed a strange relationship with the worms whereby it unloads the parasites onto other hosts.")); 
	enemies.push(new Enemy("Living Tide", 			100,	4,		4,		90,		[3],	1,		"animal", 	"Frothing waves whipped into a vaguely humanoid form. A keen eye might spot the small cephalopod at its center. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Wadrin's Lizard", 		125,	2,		0,		85,		[3],	1,		"animal", 	"A semiaquatic reptile so large, it seems a relic of aeons past. Often seen peacefully sunbathing on warm rocks. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Carcinos", 				100,	10,		10,		95,		[3],	1,		"", 		"Its unremarkable crablike exterior belies a sinister intelligence. It spends the many years of its existence turning creatures into crabs, not out of malice, but out of a sense of duty. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Kurita", 				100,	8,		4,		100,	[3],	4,		"animal", 	"A reclusive, semi-aquatic creature with coated in incredibly thick fur that insulates its long, millipedic body from the icy depths. Jutting from its sides are dozens of twitching legs, that propel it to tremendous speeds. It knows only contempt for all other creatures. *YELLOW*Added By Andrew"));
	enemies.push(new Enemy("Siren", 				175,	4,		1,		175,	[3],	1,		"animal", 	"A blind, lethargic creature of the deep sea that walks along the sea floor on its short limbs. Its jaws unhinge and its gills flitter and sacs in its throat swell, pushing gas through the bubbling pores on its back. The resultant pitch is so hypnotic that it need only wait for its prey to swim into its mouth. *YELLOW*Added by Andrew"));
	enemies.push(new Enemy("Risen Whale", 			250,	0,		0,		150,	[3],	1,		"evil", 	"A decomposing whale carcass reanimated by a cult’s foul magics. What was fallen will rise again. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Dirge", 				100,	4,		6,		125,	[3],	4,		"animal", 	"Its sleek form ripples with prismatic light and a long, sharp tail flows in its wake. Those who have seen a Dirge from a great distance speak of it gliding along the horizon, where the stars drown in the sea. Those who have seen one up close no longer speak. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Deep Horror", 			400,	2,		8,		900,	[3],	1,		"evil", 	"A magical being from the darkest depths of the sea; never meant to see the light of the surface. To avoid explosive decompression, it maintains a crushing pressure field around itself. *YELLOW*Added By Morgan"));
	
	//General enemies
	//						Name, 					HP,		Phys, 	Magic, 	Diff	Zones		MOVES	TYPE
	enemies.push(new Enemy("Warded Totem", 			75,		4,		24,		75,		[0,1,2,3],  0,		"construction", "A towering pillar of ancient grey wood, intricately decorated with dimly glowing runes. An aura of shimmering energy emits from it."));
	enemies.push(new Enemy("Ephemeral Warrior",		50,		0,		0,		70,		[0,1,2],	2,		"", "The fading spirit of an ancient hero, animated solely by a lust for vengeance. Over several centuries their mind has been lost to hatred, and they have now become what they once sought to vanquish."));

	//Other
	//						Name, 				HP, 	Phys, 	Magic, 	Diff	Zones	MOVES
	enemies.push(new Enemy("Swarm of Bees", 	10, 	100,	100,	5, 		[], 	4,		"animal", 		"A pesky swarm of enlarged, stinging insects")); //Phys
	enemies.push(new Enemy("Egg Sac", 			5,		0,		0,		25,		[],		0,		"", 			"A vast bundle of silk. Something is crawling around within it."));
	enemies.push(new Enemy("Web", 				8,		10,		10,		0,		[],		0,		"construction", "A hastily strewn web of sturdy white spider silk that traps creatures that pass through it."));
	enemies.push(new Enemy("Baby Spider", 		30,		0,		0,		5,		[],		3,		"animal", 		"A squat spider, about the size of a house cat. It scuttles about frantically."));
	enemies.push(new Enemy("Living Spore",		5,		0,		0,		1,		[],		2,		"plant",  		"A tiny spore that glows in the dim light. It sways on the breeze, seeking to nestle into a rotten patch to sprout."));
	enemies.push(new Enemy("Servant",			30,		1,		1,		20,		[],		2,		"servant", 		"A well-kept and well-dressed servant, carrying a dark mahogany baton. They're undyingly loyal to the noble they serve."));
	enemies.push(new Enemy("Familiar",			35,		0,		0,		0,		[],		3,		"familiar",		"A living shadow twisted into the form of a crow. It serves its master unto its very death."));
	enemies.push(new Enemy("Mariner",			40,		0,		0,		20,		[],		2,		"",				"An old sailor."));
	enemies.push(new Enemy("Anchorite Worm", 	5,		0,		0,		3,		[],		2,		"animal", 		"A disgusting parasite that spends its life cycle without ever emerging from its host. An old sailor’s tale warns of an adult anchorite worm crawling from a whale’s corpse into a sleeping crewman’s anus. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Giant Anemone",		15,		1,		1,		5,		[],		0,		"plant",		"A colorful invertebrate, bristling with static shock."));
	enemies.push(new Enemy("Coral Shard",		15,		3,		2,		5,		[],		0,		"plant",		"A jagged shard of vibrant coral, jutting strangely out of the ground."));
	enemies.push(new Enemy("Water Elemental", 	100, 	16,		12,		0, 		[],		0,		"evil",   		"An elegant figure, formed of ever-flowing water animated by a demon's curse. It seems playful, naively unaware of its hideous nature.")); 
	enemies.push(new Enemy("Mimic", 			40, 	4, 		4, 		50, 	[], 	1, 		"animal", 		"A slow-moving creature born of early attempts at alchemical conjuration, now thriving in the wild. They submerge themselves underground, while a specialized organ resembling a commonplace object acts as a lure for careless adventurers."));
	
	//Bosses
	enemies.push(new Enemy("Seated Figure",		250,	12,		12,		2000,	[],		0,		"boss",			"Gnarled vines wrap tightly around the throne, rising and falling slightly with the breath of the figure bound underneath. An aura of serene power surrounds them - an ancient might as old as the forest itself."));
	enemies.push(new Enemy("Beautiful Woman",   750,	0,		0,		2000,	[],		1,		"boss",			"A young woman clad in silk, wearing a circlet of thorns. Scarlet hair falls upon her freckled shoulders, framing a sly face. Behind her bright eyes a tremendous intellect is stirring."));
	enemies.push(new Enemy("Elder Succubus",	275,	500,	100,	2000,	[],		5,		"boss",			"A wrinkled, balding hag whose eyes are as white as fogged glass. An aura of ancient power swirls around her as she stands with a toothless, gummy smile."));
	enemies.push(new Enemy("Thrall",			100,	4,		4,		50,		[],		2,		"",				"A dark, faceless being bound to serve a Succubus. Their bodies and souls have been weathered away by their long centuries of service like a hard candy smoothed and eroded by spit. Little is left of what they once were."));
	
	let HP = 0;
	let Diff = 0;
	for (let i = 0; i < enemies.length; i++) {
		Diff += enemies[i].DIFFICULTY;
		HP += enemies[i].MaxHP;
	}
	console.log("HP: " + HP + " Average: " + (HP/enemies.length).toFixed(2));
	console.log("Difficulty: " + Diff + " Average: " + (Diff/enemies.length).toFixed(2));
	
	//Generic Loot
	for (const item of items) {
		if (!item.rare) {
			if (item.type == "weapon" || item.type == "armor" || item.type == "staff" || item.type == "scroll" || item.type == "tincture" || item.type == "treasure") {
				genericLoot.push(COPY(item));
			}
		}
	}
	genericLoot.push(startItem("scroll: maintain"));
	genericLoot.push(startItem("backpack"));
	for (let i = 0; i < 3; i++) {
		genericLoot.push(startItem("health potion"));
		genericLoot.push(startItem("stamina potion"));
	}
	genericLoot = shitSort(genericLoot, "value", true);
	
	zoneLoot[0] = [
	new Drop("Blood Staff", 1),
	new Drop("Death Mark", 1),
	new Drop("Vampire Fang", 1),
	new Drop("Scroll: Siphon", 2),
	new Drop("Sweeping Sword", 1),
	new Drop("Scroll: Summon Specter", 2)];
	
	zoneLoot[1] = [
	new Drop("Driftwood Staff", 1),
	new Drop("Ogre Club", 1),
	new Drop("Scroll: Summon Mushroom", 3),
	new Drop("Scroll: Envenom", 3),
	new Drop("Scroll: Swamp Strike", 3),
	new Drop("Scroll: Summon Spores", 3),
	new Drop("Scroll: Ignite", 3),
	new Drop("Scroll: Feed Flame", 3)];
	
	zoneLoot[2] = [
	new Drop("Rotten Staff", 1),
	new Drop("Jade", 1),
	new Drop("Reflect", 1),
	new Drop("Ephemeral Blade", 1),
	new Drop("Scroll: Bind", 3),
	new Drop("Scroll: Roots", 3)];
	
	zoneLoot[3] = [
	new Drop("Coral Staff", 1),
	new Drop("Scroll: Summon Anemone", 3),
	new Drop("Scroll: Summon Coral", 3),
	new Drop("Scroll: Guidance", 3),
	new Drop("Coral Axe", 1)];
	
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].NAME.includes("Mage") || enemies[i].NAME.includes("Priest") || enemies[i].NAME == "Witch" ||  enemies[i].NAME.includes("Sorceror")) {
			enemies[i].LOOT.push(new Drop("Wand", 8));
			enemies[i].LOOT.push(new Drop("Staff", 4));
			enemies[i].LOOT.push(new Drop("Crook", 4));
			enemies[i].LOOT.push(new Drop("Scepter", 4));
		}
		if (enemies[i].NAME == "Witch") {
			enemies[i].LOOT.push(new Drop("Scroll: Swamp Strike", 25));
			enemies[i].LOOT.push(new Drop("Scroll: Envenom", 25));
			enemies[i].LOOT.push(new Drop("Health Potion", 100));
			enemies[i].LOOT.push(new Drop("Stamina Potion", 100));
		}
		if (enemies[i].NAME == "Mushroom Mage") {
			enemies[i].LOOT.push(new Drop("Scroll: Summon Mushroom", 25));
			enemies[i].LOOT.push(new Drop("Scroll: Summon Spores", 25));
			enemies[i].LOOT.push(new Drop("Scroll: Swamp Strike", 25));
		}
		if (enemies[i].NAME == "Sea Priest" || enemies[i].NAME == "Sea Priestess" || enemies[i].NAME == "Sea Sorceror") {
			enemies[i].LOOT.push(new Drop("Scroll: Summon Anemone", 20));
			enemies[i].LOOT.push(new Drop("Scroll: Summon Coral", 20));
			enemies[i].LOOT.push(new Drop("Scroll: Guidance", 20));
			enemies[i].LOOT.push(new Drop("Coral Staff", 10));
		}
		if (enemies[i].NAME == "Swamp Mage") {
			enemies[i].LOOT.push(new Drop("Scroll: Guidance", 25));
			enemies[i].LOOT.push(new Drop("Scroll: Rally", 25));
			enemies[i].LOOT.push(new Drop("Scroll: Swamp Strike", 25));
		}
		if (enemies[i].NAME == "Vampire" || enemies[i].NAME == "Swarm of Bats") {
			enemies[i].LOOT.push(new Drop("Vampire Fang", 25));
			enemies[i].LOOT.push(new Drop("Scroll: Siphon", 25));
		}
		if (enemies[i].NAME == "Flaming Wisp" || enemies[i].NAME == "Wisp Knight") {
			enemies[i].LOOT.push(new Drop("Scroll: Ignite", 25));
			enemies[i].LOOT.push(new Drop("Scroll: Feed Flame", 25));
		}
		if (enemies[i].NAME == "Ogre") {
			enemies[i].LOOT.push(new Drop("Ogre Club", 10));
		}
		if (enemies[i].NAME == "Ephemeral Warrior") {
			enemies[i].LOOT.push(new Drop("Ephemeral blade", 10));
		}
		if (enemies[i].NAME == "Living Vine") {
			enemies[i].LOOT.push(new Drop("Scroll: Bind", 40));
		}
		if (enemies[i].NAME == "Briar Beast" || enemies[i].NAME == "Living Vine" || enemies[i].NAME == "Briar Monster" || enemies[i].NAME == "Toxic Mushroom") {
			enemies[i].LOOT.push(new Drop("Scroll: Roots", 25));
		}
		if (enemies[i].NAME == "Briar Beast") {
			enemies[i].LOOT.push(new Drop("Reflect", 5));
		}
		if (enemies[i].NAME == "Mossy Statue") {
			enemies[i].LOOT.push(new Drop("Jade", 5));
		}
		if (enemies[i].NAME == "Scaled Drake") {
			enemies[i].LOOT.push(new Drop("Drakeskin Cloak", 20));
		}
		if (enemies[i].NAME == "Beekeeper") {
			enemies[i].LOOT.push(new Drop("Honeycomb", 25));
			enemies[i].LOOT.push(new Drop("Mead", 100));
			enemies[i].LOOT.push(new Drop("Mead", 100));
			enemies[i].LOOT.push(new Drop("Mead", 100));
		}
		if (enemies[i].NAME == "Fae Trickster") {
			enemies[i].LOOT.push(new Drop("Wand", 15));
			enemies[i].LOOT.push(new Drop("Scroll: Blink", 25));
			enemies[i].LOOT.push(new Drop("Warp Potion", 25));
		}
		if (enemies[i].NAME == "Briar Monster") {
			enemies[i].LOOT.push(new Drop("Reflect", 25));
		}
		if (enemies[i].NAME == "Zombie") {
			enemies[i].LOOT.push(new Drop("Death Mark", 2));
		}
		if (enemies[i].NAME == "Lost Angel") {
			enemies[i].LOOT.push(new Drop("Sweeping Sword", 20));
		}
		if (enemies[i].NAME == "Lich") {
			enemies[i].LOOT.push(new Drop("Blood Staff", 30));
			enemies[i].LOOT.push(new Drop("Death Mark", 30));
			enemies[i].LOOT.push(new Drop("Staff", 5));
			enemies[i].LOOT.push(new Drop("Crook", 5));
			enemies[i].LOOT.push(new Drop("Scepter", 5));
		}
		if (enemies[i].NAME == "Apparition" || enemies[i].NAME == "Hungry Ghoul") {
			enemies[i].LOOT.push(new Drop("Scroll: Summon Specter", 25));
		}
		if (enemies[i].NAME == "Skeletal Spearman" || enemies[i].NAME == "Goblin Spearman") {
			enemies[i].LOOT.push(new Drop("Spear", 10));
		}
		if (enemies[i].NAME == "Skeletal Swordsman" || enemies[i].NAME == "Goblin Swordsman") {
			enemies[i].LOOT.push(new Drop("Longsword", 10));
		}
		if (enemies[i].NAME == "Skeletal Archer" || enemies[i].NAME == "Goblin Archer" || enemies[i].NAME == "Fishman Archer") {
			enemies[i].LOOT.push(new Drop("Longbow", 10));
		}
	}
	
	for (const enemy of enemies) {
		for (const drop of enemy.LOOT) {
			let found = false;
			for (const item of items) {
				if (item.name.toLowerCase() == drop.name.toLowerCase()) {
					found = true;
					break;
				}
			}
		}
	}
}

function initEffects() {
	effects = [
		//----------Name                     Type        Description                                                    Stacks
		new Effect("Weakened",				"debuff",	"Your damage dealt is reduced by 25%.",							false),
		new Effect("Poison", 				"debuff",	"Can't kill. Take 1 dmg per turn. All healing is reduced by half.",			true),
		new Effect("Rooted", 				"debuff",	"Unable to Move.",												false),
		new Effect("Vulnerable", 			"debuff",	"Damage taken is increased by 20%",								false),
		new Effect("Venom", 				"debuff",	"Take 5 dmg per turn.",											false),
		new Effect("Stunned", 				"debuff",	"Lose your next turn.",											false),
		new Effect("Slowed", 				"debuff",	"Movement costs are doubled.",									false),
		new Effect("Coated in Honey", 		"debuff",	"Your AP is halved.",											false),
		new Effect("Infested", 				"debuff",	"Lose 3 Stamina Per Turn.",										true),
		new Effect("Blinded", 				"debuff",	"50% Chance to Miss",											false),
		new Effect("Bleed", 				"debuff",	"Take 2 + 1 per 25 current HP damage per turn.",				false),
		new Effect("Whipped", 				"debuff",	"Take 4 dmg per turn. +15% Damage taken.",						false),
		new Effect("Winded", 				"debuff",	"Your Stamina doesn't regenerate naturally.",					false),
		new Effect("Parched", 				"debuff",	"You can't drink potions.",										false),
		new Effect("Cursed", 				"debuff",	"Your debuffs can't end in any way.",							false),
		new Effect("Disorganized", 			"debuff",	"+20% Damage taken. -20% Damage dealt.",						false),
		new Effect("Terrified", 			"debuff",	"This creature is fleeing for their life!",						false),
		new Effect("Wilting", 				"debuff",	"Lose 4 HP per turn. Lose 12 Stamina per turn.",				false),
		new Effect("Coated in Honey", 		"debuff",	"You're slowed by viscous honey. Your AP/turn is halved.",		false),
		new Effect("Necrosis", 				"debuff",	"Incoming healing is reduced by 100%",							false),
		new Effect("Confused", 				"debuff",	"You'll attack your allies, or even yourself.",					false),
		new Effect("Peeled", 				"debuff",	"Armor is reduced to 0.",										false),
		new Effect("Blocking", 				"buff",		"Enemies are unable to move past you.",							false),
		new Effect("Enraged", 				"buff",		"Deal +50% Damage",												false),
		new Effect("Invincible", 			"buff",		"You can't take any damage",									false),
		new Effect("Aura", 					"buff",		"Deal 2 Damage to All Enemies",									false),
		new Effect("Minor Reflect", 		"buff",		"When you're attacked, reflect 3 damage.",						false),
		new Effect("Greater Reflect", 		"buff",		"When you're attacked, reflect half the damage back.",			false),
		new Effect("Destructive Synergy",	"buff",		"Deal +1 damage for each active buff.",							false),
		new Effect("Restorative Synergy",	"buff",		"Heal 1 HP for each active buff.",								false),
		new Effect("Coward's Haste", 		"buff",		"100% Flee Chance this turn. Ends if you attack or cast.",		false),
		new Effect("Deliverance", 			"buff",		"You can't be reduced below 1 HP.",								true),
		new Effect("Ember", 				"buff",		"Lose 1 HP per turn.",											true),
		new Effect("Fading", 				"buff",		"This creature will vanish.",									false),
		new Effect("Stronger", 				"buff",		"Deal +3 Damage per Attack",									false),
		new Effect("Compensation", 			"buff",		"Heal 8 HP when an ally is killed.",							false),
		new Effect("Charging", 				"buff",		"Movement is doubled.",											false),
		//new Effect("Lightning", 			"buff",		"Lightning gains +1 Damage this turn.",							true),
		new Effect("Stoneskin", 			"buff",		"+8 Physical Armor. +4 Magical Armor",							false),
		new Effect("Preparation", 			"buff",		"+4 AP per turn.",												false),
		new Effect("Ferocity", 				"buff",		"Your spells deal +2 DMG",										false),
		new Effect("Regenerative", 			"buff",		"Regenerate 6 HP per turn.",									false),
		new Effect("Healing in Shell", 		"buff",		"Heal 6-10 HP per turn. Gain +12 +6 Armor.",					false),
		new Effect("Enamoured with", 		"buff",		"This creature has eyes only for one. . .",						false),
		new Effect("Guarding", 				"buff",		"-6 AP per turn. Defend a nearby ally from attacks.",			false),
		new Effect("Health Potion", 		"buff",		"Heal 10 HP per turn.",											true),
		new Effect("Static",				"buff",		"Deal magic damage equal to your stacks to a random enemy. When you take damage, lose 2 stacks.", true),
		new Effect("Protection",			"buff",		"+2 Physical Armor. +2 Magical Armor",							false),
		new Effect("Buried",				"buff",		"+4 Physical Armor. +4 Magical Armor",							false),
		new Effect("Jade",					"buff",		"Incoming damage can't be more than 25% of your Max HP.",		false),
		new Effect("Resilient",				"buff",		"The damage you take is halved.",								false),
	]
}
