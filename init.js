function initRunes() {
	runes.push(new Rune("Revenge", 60, "armor", "If you are killed, kill the enemy that killed you."));
	runes.push(new Rune("Cultivation", 75, "armor", "If you are below 50% HP, Regen 5 HP per turn."));
	runes.push(new Rune("Reflect", 125, "armor", "Whenever you are hit, reflect 5 damage to your attacker."));
	runes.push(new Rune("Reflex", 70, "armor", "Gain +20% Dodge Chance against physical and magical attacks."));
	runes.push(new Rune("Sunset", 70, "armor", "Each turn deal 2 true damage to all enemies."));
	runes.push(new Rune("Longevity", 100, "armor", "Gain +20 Max HP."));
	runes.push(new Rune("Endurant", 60, "armor", "Gain +30 Max Stamina."));
	runes.push(new Rune("Dextrous", 75, "armor", "+4 AP Per Turn."));
	runes.push(new Rune("Honeycomb", 125, "armor", "Whenever you take 5 or more damage, summon a swarm of bees."));
	runes.push(new Rune("Amber", 70, "armor", "Whenever damage is dealt to you from an attack or an effect, heal 2 HP and restore 6 Stamina."));
	runes.push(new Rune("Jade", 125, "armor", "You can't take more than 12 damage from a single attack."));
	runes.push(new Rune("Amethyst", 70, "armor", "Whenever you dodge an attack, deal 8 magic damage to your attacker."));
	runes.push(new Rune("Tempered", 115, "armor", "Gain +2 Physical and Magical Armor"));

	runes.push(new Rune("Orisha", 90, "weapon", "+20% Pen"));
	runes.push(new Rune("Leeching", 75, "weapon", "Heal +2 HP per attack."));
	runes.push(new Rune("Siphoning", 75, "weapon", "Gain +4 Stamina per attack."));
	runes.push(new Rune("Death Mark", 125, "weapon", "Slain enemies are raised as allied zombies."));
	runes.push(new Rune("Maladious", 80, "weapon", "If a target is debuffed, gain +1 Damage as well as +1 Damage per Debuff."));
	runes.push(new Rune("Poisoned", 40, "weapon", "Afflict Poison on the target."));
	runes.push(new Rune("Envenomed", 60, "weapon", "50% Chance to afflict venom on the target."));
	runes.push(new Rune("Jagged", 70, "weapon", "50% Chance to cause the target to bleed."));
	runes.push(new Rune("Accurate", 70, "weapon", "Re-Roll missed attacks."));
	runes.push(new Rune("Gamble", 70, "weapon", "-1 Damage. +4 Max Damage."));
	runes.push(new Rune("Powerful", 70, "weapon", "+20% Weapon Base Damage on Attacks"));
	runes.push(new Rune("Precise", 70, "weapon", "+2 Damage per Attack"));
	runes.push(new Rune("Pacifist", 70, "weapon", "If you miss an attack, deal 2 Magical Damage to all enemies."));
	runes.push(new Rune("Icy", 60, "weapon", "Gain +20% Chance to Stun the target."));
	runes.push(new Rune("Envining", 70, "weapon", "Enemies hit by your attacks are rooted."));
	
	runes.push(new Rune("Tar", 85, "staff", "Enemies damaged by your spells are slowed, limiting their movement to 1 tile per turn."));
	runes.push(new Rune("Pearl", 95, "staff", "Killing an enemy with a spell restores 15 Stamina."));
	runes.push(new Rune("Charcoal", 100, "staff", "Your spells gain +1 Bonus DMG."));
	runes.push(new Rune("Ivory", 100, "staff", "Each spell has a 10% Chance to have no AP cost."));
	runes.push(new Rune("Autumn", 125, "staff", "When you cast a spell with healing, heal a random ally 5 HP."));
	runes.push(new Rune("Forthwith", 125, "staff", "Each turn, your first damaging instance from a spell deals +5 Damage."));
	runes.push(new Rune("Spring", 125, "staff", "Heal 1 HP whenever you cast a spell."));
	runes.push(new Rune("Cinnabar", 150, "staff", "Whenever you damage a target with a spell, reduce its magic armor by 1."));
	
	for (let i = 0; i < runes.length; i++) {
		items.push(runes[i]);
	}
}

function initLocations() {
	//Init People First
	let Minsiki = new NPC("Minsiki", true, "*GREEN*Minsiki*GREY* is middle-aged, with a thick black beard and kind eyes. No one knows where Minsiki came from before he came to the village years ago and opened his shop; they still think of him as an exotic stranger. Minsiki prefers it that way, he likes to keep to himself.");
	let Gout = new NPC("Gout", true, "*GREEN*Gout*GREY* is an older man, short and grey but broad all the same. He hobbles across the pier and his muscles flex beneath his wrinkled skin as he casts his fishing line out into the sea. His is a soldier's body, its scars etched immutably as if in marble. It has not forgotten the many campaigns and battles, and though *GREEN*Gout*GREY* never speaks of his past, his eyes would say he has not forgotten either.");
	let Tobin = new NPC("Tobin", true, "*GREEN*Father Tobin*GREY* is a thin man, taller than most and pale. From time to time one can see sadness in his eyes, as he looks across the graves he tends, but it is only ever there for a moment and then he smiles. In his humility he has found unwavering joy.");
	let Kobos = new NPC("Kobos", true, "*GREEN*Kobos*GREY* has been swinging hammer for forty years now, nearly as long as he's been alive. When he works his craft the singing of his anvil can be heard as far away as the harbor. Princes have offered to buy out his services, but he has no interest in their gold, only in his iron.");
	let Clyde = new NPC("Clyde", true, "*GREEN*Clyde*GREY* is a huntsman. He spends more time far afield than anyone else in the town. When some people hear his frightful tails they roll their eyes; sometimes he sounds like a coward. He pleads with anyone who will listen to avoid the woods at night.");
	let Terat = new NPC("Terat", true, "*GREEN*Terat*GREY* is the estranged brother of *GREEN*Sarkana*GREY*. He's quite timid, and perhaps a bit anxious. He can be rather friendly and generous, but for the most part focuses on his work. He always seems to be engraving new golden runes into their cold steel plates.");
	
	let Qarana = new NPC("Qarana", true, "Some say *GREEN*Qarana*GREY* was a swamp witch once, who grew bored of her solitary lifestyle. When she hears such rumors, Qarana only smiles. She has a thousand stories to tell of her travels, though the stories are never quite the same between tellings.");
	let Asha = new NPC("Asha", false, "*GREEN*Asha*GREY* is young, with dark hair and dark eyes. She lives at the tavern and never works, she only spends her days drinking, often alone. It's whispered that she was a promising mage once, and an aristocrat, but no one knows much about her.");
	let Penelope = new NPC("Penelope", true, "*GREEN*Penelope*GREY* has been running the tavern for years now. Business is slow these days, with travel being as dangerous as it is. She insists that she's doing well, but behind her warm eyes is an ever-present weariness.");
	let Nestra = new NPC("Nestra", false, "*GREEN*Nestra*GREY* married an old merchant who spends all his time at sea. She took some of the money he sends back to her and opened her *BLUE*Barbershop*GREY*. She's not that good at cutting hair, but she tries her best, and she is getting better.");
	let Janice = new NPC("Janice", false, "*GREEN*Janice*GREY* has lived in the town for nearly all of her long life, save for a few foreign adventures that she still remembers fondly. She seems like a simple old woman, preferring to keep quiet on most matters, but from time to time it becomes apparent that she has seen more than most people can even imagine.");
	let Florence = new NPC("Florence", true, "*GREEN*Florence*GREY* is grey-haired, yet her stern face, criss-crossed with scars, maintains a youthful glow. She insists she's but a simple tailor, but she never goes out without a dagger in her belt, and she seems to know how to cut more than just cloth.");
	let Sarkana = new NPC("Sarkana", true, "*GREEN*Sarkana*GREY* is the estranged sister of Terat. When the day is done she packs away her runes and travels far to the east. She has always been a bit spiteful, and prefers not to talk to anyone, except to speak ill of her brother.");
	
	Gout.CONVERSATIONS.push("*GREEN*I'd say good day but if it was a good day I'd be fishing Ha!");
	Gout.CONVERSATIONS.push("*GREEN*What can I do for you?");
	Gout.CONVERSATIONS.push("*GREEN*It's a great day for fishing.");
	Gout.CONVERSATIONS.push("*GREEN*I'm thinking of getting out on the water myself.");
	Gout.CONVERSATIONS.push("*GREEN*I went fishing in the Acrid Swamp once, hooked a huge feller what looked like a slug.");
	Gout.CONVERSATIONS.push("*GREEN*I mostly fish off the pier these days, what with the monsters out around the island.");
	Gout.CONVERSATIONS.push("Gout slaps his gut.");
	Gout.CONVERSATIONS.push("*GREEN*They say Asha is a mage, but the only thing I've seen her cast is a line. Ha!");
	Gout.CONVERSATIONS.push("Gout chuckles.");
	Gout.CONVERSATIONS.push("*GREEN*It's dangerous out here on the island but the fishing is well worth it.");
	
	Nestra.CONVERSATIONS.push("*GREEN*Hello.");
	Nestra.CONVERSATIONS.push("*GREEN*Welcome to my barbershop.");
	Nestra.CONVERSATIONS.push("*GREEN*You know, it'd be nice to have more refined visitors to our town.");
	Nestra.CONVERSATIONS.push("*GREEN*Qarana, Minsiki, those rune sellers. Our town has become rather . . . cosmopolitan.");
	Nestra.CONVERSATIONS.push("*GREEN*You certainly look like you could use a haircut.");
	
	Janice.CONVERSATIONS.push("*GREEN*Hello dear.");
	Janice.CONVERSATIONS.push("*GREEN*Are you here to visit someone?.");
	Janice.CONVERSATIONS.push("*GREEN*I bring flowers to the unknown graves.");
	Janice.CONVERSATIONS.push("*GREEN*I hope their souls are all at peace.");
	Janice.CONVERSATIONS.push("Janice places a single white flower onto the surface of a fresh grave.");
	
	Asha.CONVERSATIONS.push("Asha doesn't seem to notice you. . .");
	Asha.CONVERSATIONS.push("Asha looks at you blankly. . .");
	Asha.CONVERSATIONS.push("*GREEN*Did you know Goblins have green blood?");
	Asha.CONVERSATIONS.push("*GREEN*Once Minsiki came in here, and he was drinking with me right? Anyways he gets really drunk, and he starts laughing like crazy, and he starts telling me about this time he cut some guy's ear off with a scimitar. It was insane.");
	Asha.CONVERSATIONS.push("*GREEN*Penelope is nice, and pretty too. Free drinks and a free room, no one else does anything like that for me.");
	Asha.CONVERSATIONS.push("*GREEN*I found a rusty sword once, and chucked it into the sea. That's a stupid story.");
	Asha.CONVERSATIONS.push("*GREEN*I went to the church once, expecting a service. What a headache I had . . . Anyways, no one was there; Father Tobin looked so beaten down.");
	Asha.CONVERSATIONS.push("*GREEN*Terat came in here the other day, sat over there in the corner. Way back there alone. After about an hour and a half I felt bad, and went to talk to him. He just mumbled something and left. What an ass.");
	Asha.CONVERSATIONS.push("*GREEN*I've got nothing to say about Sarkana, except that I can't stand her.");
	Asha.CONVERSATIONS.push("*GREEN*Have you ever met Clyde? He's alright. He's like a little puppy sometimes.");
	Asha.CONVERSATIONS.push("*GREEN*Qarana is so full of herself. I guess in a place like this that makes sense. She could do so much more than brew potions, though.");
	Asha.CONVERSATIONS.push("*GREEN*I hate spiders. Big ones and small ones. Bugs in general. I used to love honey, now I even hate bees. Mead is alright.");
	Asha.CONVERSATIONS.push("*GREEN*Do you like my shirt? I bought it from Florence. I think it's quite stylish.");
	Asha.CONVERSATIONS.push("*GREEN*I should have been an enchanter. You can make a lot of money from runes, and you don't have to get ripped apart doing it.");
	Asha.CONVERSATIONS.push("*GREEN*This drink tastes like ass water. Like sweat or something, it's gross.");
	Asha.CONVERSATIONS.push("*GREEN*The best sight in all of the village can be seen from right here at he bar. Er, my drink I mean. . .");
	
	Minsiki.CONVERSATIONS.push("Minsiki mumbles something.");
	Minsiki.CONVERSATIONS.push("Minsiki mumbles something that sounds like a joke.");
	Minsiki.CONVERSATIONS.push("*GREEN*Good wares eh?");
	Minsiki.CONVERSATIONS.push("*GREEN*Hm?");
	Minsiki.CONVERSATIONS.push("Minsiki wipes some blood off the scimitar on display, then clears his throat.");
	Minsiki.CONVERSATIONS.push("*GREEN*This came from a long way away, just like me, huh? *GREY*He laughs.");
	
	Terat.CONVERSATIONS.push("*GREEN*If you're expecting a fight, you can't go wrong with some protective runes.");
	Terat.CONVERSATIONS.push("*GREEN*I make all of my runes myself.");
	Terat.CONVERSATIONS.push("*GREEN*You won't find better runes than these anywhere in town.");
	Terat.CONVERSATIONS.push("*GREEN*Hm?");
	Terat.CONVERSATIONS.push("*GREEN*Hmm. . .");
	
	Sarkana.CONVERSATIONS.push("*GREEN*Yes?");
	Sarkana.CONVERSATIONS.push("*GREEN*What?");
	Sarkana.CONVERSATIONS.push("*GREEN*Are you going to buy a rune?");
	Sarkana.CONVERSATIONS.push("*GREEN*Don't bother with that tripe my brother sells. It's a waste of your money.");
	Sarkana.CONVERSATIONS.push("*GREEN*I don't know why I stay here.");
	Sarkana.CONVERSATIONS.push("*GREEN*The sky is always an ugly grey around here.");
	
	Penelope.CONVERSATIONS.push("Penelope seems busy, washing the bar. . .");
	Penelope.CONVERSATIONS.push("*GREEN*Would you like a drink?");
	Penelope.CONVERSATIONS.push("*GREEN*Asha came in here over a year ago, and handed me a chunk of gold for a room and some drink. Solid gold. I don't think she remembers doing it.");
	Penelope.CONVERSATIONS.push("*GREEN*I know I charge a lot for rooms, but I'd go out of business if I didn't.");
	Penelope.CONVERSATIONS.push("*GREEN*Rooms are 5 gold.");
	Penelope.CONVERSATIONS.push("*GREEN*All kinds of folks come here. Brigands, Witches. Honestly, so long as they don't cause trouble I let them stay.");
	Penelope.CONVERSATIONS.push("*GREEN*When I first took over the tavern, the road was still bad, but not so bad as this. We used to get more ships in too.");
	Penelope.CONVERSATIONS.push("*GREEN*I brew most of this alcohol myself. Most of the time it turns out really well actually. Sometimes not so much.");
	Penelope.CONVERSATIONS.push("*GREEN*I know the road's pretty bad these days, but I think Clyde exaggerates. Plenty of people go out and come back again. Like him, for example.");
	
	Qarana.CONVERSATIONS.push("*GREEN*Have you been to the swamp? It's beautiful isn't it?");
	Qarana.CONVERSATIONS.push("*GREEN*One time I saw a slug, a vast thing. It was moving slowly through the mist, algae had grown across it, even a few trees had risen up on its mighty back.");
	Qarana.CONVERSATIONS.push("*GREEN*Would you like to buy a potion?");
	Qarana.CONVERSATIONS.push("*GREEN*I put a lot of effort into the flavor of these things, you know. I guarantee they'll go down easy.");
	Qarana.CONVERSATIONS.push("*GREEN*You know one of these things could save your life.");
	Qarana.CONVERSATIONS.push("*GREEN*How can I help you today?");
	
	Kobos.CONVERSATIONS.push("*GREEN*Good day.");
	Kobos.CONVERSATIONS.push("*GREEN*What are you looking to buy?");
	Kobos.CONVERSATIONS.push("*GREEN*Weapons or Armor - you can find the highest quality here.");
	Kobos.CONVERSATIONS.push("*GREEN*I used to be a fighter, you know. I actually used that War Hammer behind the counter; split a Lich's skull open and let its soul drain away.");
	Kobos.CONVERSATIONS.push("*GREEN*I crafted a helmet for some Duke once. He came back to me complaining that his neck was sore after an Ogre had struck him in the back of the head. The fool.");
	Kobos.CONVERSATIONS.push("*GREEN*If you're looking for ranged weapons, try talking to Clyde. For runes, you can talk to Sarkana and Terat. They're quite good at their respective crafts.");
	Kobos.CONVERSATIONS.push("*GREEN*I lived my whole life here; there's a real beauty here, and I'd sooner die than give it up.");
	Kobos.CONVERSATIONS.push("*GREEN*Father Tobin keeps a fine collection of tomes, but I think the graves and the crypts scare people away from the church. It's a shame.");
	
	Florence.CONVERSATIONS.push("*GREEN*Hello dear!");
	Florence.CONVERSATIONS.push("*GREEN*What are you looking to buy? Something for pleasure, or for business, so to speak?");
	Florence.CONVERSATIONS.push("*GREEN*That's real Giant Spider silk. Strong and beautiful.");
	Florence.CONVERSATIONS.push("*GREEN*I don't know how much you get out of town, but have you seen what Goblins wear? It's disgraceful.");
	Florence.CONVERSATIONS.push("*GREEN*You can always tell how long someone's been in town, just by how ugly their clothing is.");
	Florence.CONVERSATIONS.push("*GREEN*We're a very well-dressed town, thanks to me.");
	Florence.CONVERSATIONS.push("*GREEN*I really would recommend you buy something, from myself or Kobos. You can never be too safe.");
	
	Clyde.CONVERSATIONS.push("*GREEN*Hello.");
	Clyde.CONVERSATIONS.push("*GREEN*Be careful if you head out; I beg of you.");
	Clyde.CONVERSATIONS.push("*GREEN*The Woods are bad enough, but I would avoid the Swamp. The Crypts? Oh . . .*GREY*He shudders.");
	Clyde.CONVERSATIONS.push("*GREEN*I was lost. Evening turned to night and suddenly I was surrouned by eyes glowing green in my torchlight. Chitinous legs were clicking in the darkness. I thought I was doomed. And then, I swear, they burst into a mist of ichor, and I was alone.");
	Clyde.CONVERSATIONS.push("*GREEN*Most people think goblins are pretty dumb, but I'd disagree. I saw a contingent of knights get ambushed and torn to shreds by a group of them; it was a real clever, wretched thing.");
	Clyde.CONVERSATIONS.push("*GREEN*It really would be better if you were to just stay in town. I'm too old to change my ways, but it's not too late for you.");
	
	Tobin.CONVERSATIONS.push("*GREEN*Hello.");
	Tobin.CONVERSATIONS.push("*GREEN*Blessings, my Child.");
	Tobin.CONVERSATIONS.push("*GREEN*I pray the Gods will deliver us from this evil.");
	Tobin.CONVERSATIONS.push("*GREEN*Hmm. . . I feel we will meet again soon.");
	Tobin.CONVERSATIONS.push("*GREEN*It's bitter work digging so many graves, but I've grown use to it.");
	
	people = [Gout, Nestra, Minsiki, Tobin, Kobos, Clyde, Qarana, Asha, Penelope, Florence, Sarkana, Terat];
	
	Gout.ITEMS = ["stick and string", "old fishing pole", "fishing pole", "masterwork pole"];
	Minsiki.ITEMS = ["backpack", "scale armor", "jade armor", "Rondel Dagger", "buckler", "quarterstaff", "whip", "scourge", "cat o nine", "scimitar"];
	Florence.ITEMS = ["Plain Cassock", "Acolyte Robes", "Warded Cloak", "Stylish Shirt", "Plain Cloak", "Leather Cuirass", "Quilted Gambeson", "Silk Armor", "Amethyst Tunic"];
	Kobos.ITEMS = ["Short Sword", "Mace", "War Hammer", "Spiked Shield", "Shield", "Morningstar", "Spear", "Halberd", "Maul", "War Axe", "Great Axe", "Longsword", "Chainmail", "Plate Armor"];
	Clyde.ITEMS = ["Dagger", "Club", "Hatchet", "Hunting Bow", "Longbow", "Sling", "Staff Sling", "Crossbow", "Repeating Crossbow"];
	Qarana.ITEMS = ["Health Potion", "Stamina Potion", "Antidote", "Skill Potion"];
	Penelope.ITEMS = ["Penelope's Brew", "Mead", "Imperial Wine", "Northern Wine"]
	Tobin.ITEMS = ["Divine Spellbook", "Witchcraft Spellbook", "Elemental Spellbook", "Blood Spellbook", "Imperial Spellbook", "Wand", "Staff", "Scepter"];
	
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
	let Church = new Building("Church", "The *BLUE*Church*GREY* is an ancient building, and by far the nicest in town. Its walls are built of an odd assortment of mismatched tan and grey stones, all carefully and sturdily laid together by long-dead craftsmen. The windows are clear *CYAN*quartz*GREY*, and the pews are fine mahogany, though scarcely do they see use these days. *GREEN*Father Tobin*GREY* tends to the grounds by himself, praying he might one day find a successor.");
	let Tavern = new Building("Tavern", "The *BLUE*Tavern*GREY* is four stories, and boasts no fewer than twenty-five rooms for rent, though these days only a few are ever rented out at a time. More than a few townspeople come to the *RED*firelit*GREY* common room for dinner or drinks at its bar, which is enough for *YELLOW*Penelope*GREY* to maintain the establishment. It's said that *GREEN*Asha*GREY*, sitting perpetually at the bar and living in a rented room accounts for half of the tavern's total revenue.");
	let Barber = new Building("Barbershop", "The *BLUE*Barbershop*GREY* is a single, plainly furnished room at the front of *GREEN*Nestra*GREY*'s estate, in what used to be an antechamber. The shop's greatest feature is its window to the estate's atrium garden with its exquisite *WHITE*fountain*GREY*, *WHITE*statues*GREY*, and *WHITE*pillars*GREY*. Haircuts are *YELLOW*15 Gold*GREY*, type *CYAN*!haircut [description]*GREY* to give yourself a description.");
	Barber.prosperity = 750;
	let Tailor = new Building("The Tailor", "The *BLUE*Tailor Shop*GREY* is well stocked with all the latest gowns and garments, intricately crafted by *YELLOW*Florence*GREY* herself. Painted a dark brown in its interior to accent the colorful fabrics within, it's one of the newest additions to *RED*Merchant's Lane*GREY*. Behind several fashionable displays, hidden in a back corner, is a mannequin adorned in old *CYAN*highland chainmail*GREY*. When asked about it, *YELLOW*Florence*GREY* only looks away with a sly, fading laugh.");
	let Apothecary = new Building("Apothecary", "The *BLUE*Apothecary*GREY* is little more than a tiny room and a counter, even smaller than *YELLOW*Gout*GREY*'s *BLUE*bait shop*GREY*. There is a door behind the counter which none but *YELLOW*Qarana*GREY* have seen the other side of. On each wall are shelves of glass potion bottles that rattle as the shop door opens and closes. Within the shop a slight metallic, almost *RED*bloody*GREY* smell lingers, mixing with a *GREEN*sour*GREY*, smoky scent. If ever it's mentioned, *YELLOW*Qarana*GREY* insists it's coming from the *YELLOW*Kobos*GREY*'s stall next door.");
	let Smithy = new Building("Smithy", "The *BLUE*Smithy*GREY* is more of a pavillion rather than a shop, always shimmering in the *RED*fiery*GREY* radiance of the ingot furnace. Most of *YELLOW*Kobos*GREY*'s work consists of mundane orders for the town, nails, fish hooks, anchors, and the like, though many adventurers seek him out for his legendary weapons and armor. Many of his finest masterpieces hang behind his counter. *YELLOW*Kobos*GREY* doesn't worry about theft, though - he knows no one would dare to *RED*steal*GREY* from him again.");
	let GuildHall = new Building("Guild Hall", "The *BLUE*Guild Hall*GREY* is a large wooden building, well-furnished and well-kept, but with an air of antiquity in its adornments. Revered adventurers come here to seek peace after their journeys, here on the *RED*Stony Island*GREY* where none would dare bother them.");
	GuildHall.prosperity = 3500;
	
	Bait.people = [Gout];
	Curio.people = [Minsiki];
	Church.people = [Tobin];
	Tavern.people = [Penelope, Asha, Clyde];
	Barber.people = [Nestra];
	Tailor.people = [Florence];
	Apothecary.people = [Qarana];
	Smithy.people = [Kobos];
	
	buildings = [Apothecary, Bait, Barber, Smithy, Church, Curio, Tailor, Tavern, GuildHall];
	
	let Harbor = new Location();
	Harbor.id = "The Town Harbor";
	Harbor.description = "The harbor on the north side of town. The coast seems endless to the east and west, and a cool southbound wind blows in from the grey sea. A few small ships are out fishing, just shy of the horizon. A large ferry is docked at the end of the pier.";
	Harbor.buildings = [Curio];
	Harbor.connections = [new Connection("Merchant's Lane", "south")];
	
	let Churchyard = new Location();
	Churchyard.id = "The Churchyard";
	Churchyard.description = "A stony, two-story church dominates this side of town. It's dead quiet here. Beyond the church is a graveyard. It seems like new graves are always being dug.";
	Churchyard.buildings = [Church];
	Churchyard.connections = [new Connection("The Town Square", "west"), new Connection("The Haunted Crypts", "east")];
	
	let Merchants = new Location();
	Merchants.id = "Merchant's Lane";
	Merchants.description = "A wide dusty road flanked by various wooden shops and market stalls. The air is filled with the clamor of townspeople going about their business. Dark pines loom in the west, far beyond the comforts of the town.";
	Merchants.buildings = [Tavern, Tailor, Barber];
	Merchants.connections = [new Connection("The Town Harbor", "north"), new Connection("The Town Square", "south"), new Connection("The Wilted Woods", "west")];
	
	let Square = new Location();
	Square.id = "The Town Square";
	Square.description = "A sprawling, largely empty plaza. There used to be festivals here, but these days they're little more than a distant memory. A few tiny insects flit about the open air, and the smell of mud rises from the southern swamp.";
	Square.buildings = [Apothecary, Smithy];
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
	Ferry.description = "The ferry is a flat wooden ship creaking as it rocks gently with the waves. On the northern horizon, veiled in atmospheric blue, one can just barely see a forested island. Passage there costs *YELLOW*5 gold*GREY*.";
	Ferry.connections = [new Connection("The Stony Island", "north"), new Connection("The Town Harbor", "south")];
	Ferry.prosperity = 3500;
	
	let Island = new Location();
	Island.id = "The Stony Island";
	Island.dungeon = true;
	Island.description = "The island has been abandoned for some time now, though some mossy cabins still stand in the forest. No fisherman would dare sail over the vibrant reef of the north shore, for terrible creatures dwell there. . .";
	Island.prosperity = 3500;
	Island.buildings = [GuildHall, Bait]
	Island.connections = [new Connection("Island Ferry", "south")];
	
	let Reef = new Location();
	Reef.id = "Coral Reef";
	Reef.prosperity = 3500;
	Reef.dungeon = true;
	Reef.description = "A vibrant reef on the north shore of the stony island. The water is clear and warm, but scattered along the seafloor are pits and ditches of unfathomable depth, and below the water's shimmering surface dark creatures are lurking."; 
	Reef.connections = [new Connection("Stony Island", "south")];
	
	Swamp.fish = ["Minnow", "Crawdad", "Crappie", "Carp", "Trout", "Perch", "Grindle", "Salmon", "Bluegill", "Shad", "Catfish", "Bass", "Freshwater Eel", "Freshwater Sunfish", "Pike", "Gar", "Sturgeon"];
	Ferry.fish = ["Shrimp", "Sardine", "Grunion", "Jack", "Porgy", "Common Snook", "Squid", "Mackerel", "Hake", "Flying Fish", "Snapper", "Pufferfish", "Cod", "Sunfish", "Grouper", "Tuna", "Ray"];
	Harbor.fish = ["Shrimp", "Sardine", "Grunion", "Crab", "Jack", "Porgy", "Common Snook", "Squid", "Mackerel", "Hake", "Flying Fish", "Snapper", "Pufferfish", "Cod", "Sunfish", "Grouper"];
	Island.fish = ["Shrimp", "Sardine", "Grunion", "Crab", "Jack", "Porgy", "Common Snook", "Squid", "Mackerel", "Hake", "Flying Fish", "Snapper", "Pufferfish", "Cod", "Sunfish", "Grouper", "Jellyfish", "Ray", "Stonefish", "Eel", "octopus", "Tuna", "Wahoo", "Swordfish"];
	Reef.fish = ["Sardine", "Grunion", "Crab", "Jack", "Porgy", "Common Snook", "Squid", "Mackerel", "Hake", "Flying Fish", "Snapper", "Pufferfish", "Cod", "Sunfish", "Grouper", "Jellyfish", "Ray", "Stonefish", "Eel", "octopus", "Tuna", "Wahoo", "Swordfish"];
	
	locations = [Island, Ferry, Harbor, Merchants, Churchyard, Square, Graveyard, Crypts, Woods, Swamp, Reef];
	
	Merchants.people = [Terat];
	Square.people = [Sarkana];
	Graveyard.people = [Janice];
	
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

function initItems() {
	//WEAPON NAME	  			Name	 					Class, 		Hands	#Atks	Value 	Chance 	MinDmg 	MaxDmg 	Pen% 	AP 		Range	
	//Blades
	weapons.push(new Weapon("Dagger", 						"blade",	1, 		3,		15, 	70, 	1, 		3,	 	0, 		1, 		1));
	weapons.push(new Weapon("Rondel Dagger", 				"blade",	1, 		2,		25, 	75, 	2, 		5, 		50, 	2, 		1));
	weapons.push(new Weapon("Vampire Fang", 				"blade",	1, 		3,		45, 	70, 	1, 		3,	 	0, 		1, 		1, 	false));
	weapons.push(new Weapon("Short Sword", 					"blade",	1, 		2,		40, 	85,		2,		6,		20,		4,		1));
	weapons.push(new Weapon("Scimitar", 					"blade",	1, 		1,		40, 	90,		8,		14,		10,		6,		1));
	weapons.push(new Weapon("Longsword", 					"blade",	2, 		2,		60, 	90,		10,		14,		20,		10,		1));
	
	//Blunt Weapons
	weapons.push(new Weapon("Club", 						"blunt",	2, 		1,		15, 	60, 	12, 	18, 	60, 	6, 		1));
	weapons.push(new Weapon("Mace", 						"blunt",	1, 		1,		25, 	70,		6,		12,		75,		7,		1));
	weapons.push(new Weapon("War Hammer", 					"blunt",	1, 		1,		35, 	50, 	10, 	16,		80, 	8, 		1));
	weapons.push(new Weapon("Morningstar", 					"blunt",	1, 		3,		50, 	70, 	5, 		10, 	75, 	5,		1));
	weapons.push(new Weapon("Maul", 						"blunt",	2, 		1,		70, 	50, 	18, 	28, 	80, 	14, 	1));
	
	//Whips
	weapons.push(new Weapon("Whip", 						"whip",		1, 		1,		25, 	75,		4,		14,		0,		5,		2));
	weapons.push(new Weapon("Scourge", 						"whip",		1, 		2,		40, 	70,		4,		8,		0,		5,		2));
	weapons.push(new Weapon("Cat o Nine", 					"whip",		1, 		4,		60, 	80,		2,		6,		0,		4,		2));
	
	//Axes
	weapons.push(new Weapon("Hatchet", 						"axe",		1, 		1,		20, 	80, 	4, 		10, 	25, 	6, 		1));
	weapons.push(new Weapon("War Axe", 						"axe",		2, 		1,		50, 	70, 	10, 	26, 	10, 	10,		1));
	weapons.push(new Weapon("Great Axe", 					"axe",		2, 		1,		70, 	60, 	4, 		52, 	40, 	12,		1));
	
	//Polearms
	weapons.push(new Weapon("Quarterstaff", 				"polearm",	2, 		2,		30, 	75,		4,		10,		40,		4,		2));
	weapons.push(new Weapon("Spear", 						"polearm",	2, 		1,		40, 	70,		12,		20,		20,		10,		2));
	weapons.push(new Weapon("Halberd",						"polearm",	2, 		2,		60, 	70,		8,		14,		30,		8,		2));
	
	//Shields
	weapons.push(new Weapon("Buckler", 						"shield",	1, 		1,		20, 	90, 	4, 		6, 		50, 	4,		1));
	weapons.push(new Weapon("Spiked Shield", 				"shield",	1, 		1,		30, 	90, 	6, 		10, 	40, 	6,		1));
	weapons.push(new Weapon("Shield", 						"shield",	1, 		1,		50, 	90, 	4, 		8, 		50, 	6,		1));
	
	//Ranged
	weapons.push(new Weapon("Sling", 						"ranged",	2, 		3,		25, 	80,		2,		4,		30,		3,		5));
	weapons.push(new Weapon("Hunting Bow", 					"ranged",	2, 		2,		25, 	75,		4,		6,		30,		4,		5));
	weapons.push(new Weapon("Crossbow", 					"ranged",	2, 		1,		25, 	80,		8,		14,		40,		5,		5));
	weapons.push(new Weapon("Staff Sling", 					"ranged",	2, 		1,		50, 	75,		12,		18,		40,		6,		5));
	weapons.push(new Weapon("Longbow", 						"ranged",	2, 		2,		50, 	75,		4,		10,		40,		6,		5));
	weapons.push(new Weapon("Repeating Crossbow", 			"ranged",	2, 		3,		50, 	65,		2,		8,		10,		3,		5));
	
	
	
	//Item(				name, 					type, 		value, stack = 1)
	items.push(new Item("Health Potion", 		"potion", 	15, 	"Restores ~25 HP"));
	items.push(new Item("Stamina Potion", 		"potion", 	10, 	"Restores ~50 Stamina"));
	items.push(new Item("Haste Potion", 		"potion", 	10, 	"Restores 6 AP"));
	items.push(new Item("Antidote", 			"potion", 	5, 		"Ends any poisoned or venom effects"));
	items.push(new Item("Skill Potion", 		"potion", 	200, 	"Provides +1 Stat Point"));
	items.push(new Item("Penelope's Brew", 		"drink", 	1, 		"A proprietary brew of Penelope. May or may not be any good."));
	items.push(new Item("Mead", 				"drink", 	3, 		"The taste of honey is especially strong."));
	items.push(new Item("Imperial Wine", 		"drink", 	5, 		"A mediocre vintage that has aged well. There's dust on the bottle."));
	items.push(new Item("Northern Wine", 		"drink", 	10, 	"A fine violet wine from the far north."));
	items.push(new Item("Blood Spellbook",		"spellbook",50,		"Used to learn powerful spells which cost HP to use."));
	items.push(new Item("Elemental Spellbook",	"spellbook",50,		"Used to learn strong elemental spells."));
	items.push(new Item("Witchcraft Spellbook", "spellbook",50,		"Used to learn spells related to witchcraft."));
	items.push(new Item("Divine Spellbook", 	"spellbook",50,		"Used to learn strong spells which cost Gold to use."));
	items.push(new Item("Imperial Spellbook", 	"spellbook",50,		"Used to learn spells that buff your other spells."));
	items.push(new Item("Backpack", 			"backpack",	60,		"Increases your carry capacity by 10."));
	items.push(new Item("Wand",					"staff",	30,		"Used to cast spells."));
	items.push(new Item("Staff",				"staff",	75,		"Used to cast spells. Adds +1 Damage to your spells."));
	items.push(new Item("Scepter",				"staff",	125,	"Used to cast spells. Adds +1 Damage to your spells. Spells have a 10% Chance to not use AP."));
	
	items.push(new Item("Stick and String",		"pole",		20,		"A length of twine wrapped around an old stick with a nail as a hook. It's a little unreliable."));
	items.push(new Item("Old Fishing Pole",		"pole",		40,		"One of Gout's handmade fishing poles which have seen better days. The handle is cracked, but it still works."));
	items.push(new Item("Fishing Pole",			"pole",		60,		"A strong fishing pole, hand-crafted by Gout. It's sleek and reliable, and capable of catching most fish."));
	items.push(new Item("Masterwork Pole",		"pole",		80,		"A fishing pole wrought of dark wood as solid as steel. Its unbreakable line shimmers like gold in the sun."));
	
	items.push(new Item("Minnow",				"fish",		1,		"A tiny, silvery-green fish about the size of your pinky finger. It's more like bait than a catch."));
	items.push(new Item("Crawdad",				"fish",		2,		"A small brown crustacean, long of body like a shrunken lobster."));
	items.push(new Item("Crappie",				"fish",		4,		"A short, fat fish; dark green with translucent fins and a sour expression."));
	items.push(new Item("Carp",					"fish",		5,		"A dull, largely unremarkable fish of middling size."));
	items.push(new Item("Trout",				"fish",		8,		"A plump, speckled green fish with vibrant orange fins and a soft white underbelly."));
	items.push(new Item("Perch",				"fish",		6,		"A black-striped yellow fish with thick, spiny fins."));
	items.push(new Item("Grindle",				"fish",		8,		"A green sharp-toothed fish fringed in long spotted fins."));
	items.push(new Item("Salmon",				"fish",		8,		"A long, bright red fish with a green head; prized for the taste of its flesh."));
	items.push(new Item("Bluegill",				"fish",		8,		"A small blue-green fish with an orange underbelly and striking red eyes."));
	items.push(new Item("Shad",					"fish",		10,		"A fair-sized fish wreathed faintly colorful scales that shimmer in the light."));
	items.push(new Item("Catfish",				"fish",		10,		"A flat, fat fish with small wideset eyes and long flowing whiskers."));
	items.push(new Item("Bass",					"fish",		15,		"A strong, medium-sized black-striped with dark green fins and a pale underbelly."));
	items.push(new Item("Freshwater Eel",		"fish",		15,		"A black, oily serpentine creature that dwells in rivers and streams."));
	items.push(new Item("Freshwater Sunfish",	"fish",		15,		"A small, bright fish, yellow and gold like the sunset from which its name is derived."));
	items.push(new Item("Pike",					"fish",		20,		"A heavy fish, dark with pale spots. Its long face boasts a blissful ignorance."));
	items.push(new Item("Gar",					"fish",		25,		"A large slender fish with vibrant splotches and a long, toothy snout."));
	items.push(new Item("Sturgeon",				"fish",		25,		"A large lethargic fish covered in heavy grey plated scales."));

	items.push(new Item("Shrimp",				"fish",		1,		"A pink critter with many legs and long attennae that flow behind its body."));
	items.push(new Item("Sardine",				"fish",		2,		"A miniscule silvery blue fish that travels in large schools."));
	items.push(new Item("Grunion",				"fish",		4,		"A small, thin fish that buries itself in the sand."));
	items.push(new Item("Crab",					"fish",		5,		"A pale red crustacean with a solid shell and two large pincers."));
	items.push(new Item("Jack",					"fish",		5,		"A pale fish with a large mouth and an awkward body, and bright yellow fins."));
	items.push(new Item("Porgy",				"fish",		5,		"A short, large-eyed fish with spiny fins and dull coloration."));
	items.push(new Item("Common Snook",			"fish",		5,		"A drab yellow fish with a single black stripe along its sides."));
	items.push(new Item("Squid",				"fish",		8,		"A small tentacled creature, with a long head and a curious look in its black eyes."));
	items.push(new Item("Mackerel",				"fish",		10,		"A medium-sized fish with a white underbelly and a green and blue back that shimmers iridescently in the light."));
	items.push(new Item("Hake",					"fish",		10,		"A drab fish with long fins along its back and stomach, that give it an almost eel-like appearance."));
	items.push(new Item("Flying Fish",			"fish",		12,		"A small fish with colorful wings, known to hop out of the water and glide."));
	items.push(new Item("Snapper",				"fish",		15,		"A heavy pink fish with red highlights on its fins."));
	items.push(new Item("Pufferfish",			"fish",		15,		"A spiny, wide-eyed fish, colorful and capable of inflating itself into a ball."));
	items.push(new Item("Catshark",				"fish",		15,		"A small, dark-bodied shark speckled with black and white spots."));
	items.push(new Item("Cod",					"fish",		15,		"A plump-bellied fish, yellow and red with a white stripe along its side."));
	items.push(new Item("Sunfish",				"fish",		20,		"A large and largely thoughtless fish. Its body is flat, balanced by two prominent vertical fins."));
	items.push(new Item("Grouper",				"fish",		25,		"A huge fish, brown and wrinkled with a sour expression."));
	
	
	items.push(new Item("Jellyfish",			"fish",		15,		"A colorful flow of dangerous tentacles that drift behind the creatures domed head."));
	items.push(new Item("Ray",					"fish",		15,		"A flat grey creature with a long tail that glides elegantly through the water."));
	items.push(new Item("Stonefish",			"fish",		15,		"A spiny and lethargic creature, colorful, but bearing a stupid expression."));
	items.push(new Item("Eel",					"fish",		20,		"A sleek, sharp-toothed creature, cautious, but capable of moving with great speed."));
	items.push(new Item("Octopus",				"fish",		20,		"A tentacled creature, colorful and dextrous with intelligent eyes."));
	items.push(new Item("Tuna",					"fish",		20,		"A large symmetrical fish, deep blue with a crescent tailfin and thornlike spikes along its body."));
	items.push(new Item("Wahoo",				"fish",		25,		"A large fish with a pointed mouth and vertical cyan stripes along its sides."));
	items.push(new Item("Swordfish",			"fish",		30,		"A large slender fish with long flowing fins and a sharp, needlelike protrusion on its snout."));

	
	//Purely Physical
	armor.push(new Armor("Plain Cloak", 			2,		0,		0,  20, "A plain cloak to keep off the elements."));
	armor.push(new Armor("Leather Cuirass", 		4, 		0, 		2, 	40, "A plain leather cuirass, well-worn and scuffed."));
	armor.push(new Armor("Scale Armor", 			6, 		0, 		5, 	50, "A simple armor made of the overlapping scales of some beast."));
	armor.push(new Armor("Chainmail", 				8, 		0, 		6, 	75, "A sturdy armor made of simple overlapping links of metal."));
	armor.push(new Armor("Plate Armor", 			10, 	0, 		7, 	100, "A strong armor wrought of solid plates of steel."));
	//Both
	armor.push(new Armor("Stylish Shirt", 			1,		1,		0,	15, "A rather stylish shirt."));
	armor.push(new Armor("Quilted Gambeson", 		2, 		2, 		2, 	40, "A thickly padded armor that covers from head to toe."));
	armor.push(new Armor("Silk Armor", 				3, 		3, 		1, 	75, "An exquisite piece of incredibly light armor."));
	armor.push(new Armor("Jade Armor", 				6, 		4, 		7, 	100, "An ancient armor wrought of shimmering Jade stone."));
	//Purely Magical
	armor.push(new Armor("Plain Cassock", 			0,		2,		0,	15, "A monk's robes. They offer some protection against evil."));
	armor.push(new Armor("Acolyte Robes", 			0, 		4, 		1, 	30, "The robes of a novice mage. They're simple and servicable."));
	armor.push(new Armor("Warded Cloak",			1,		6,		2,	60, "This was left at the tavern by a travelling mage. He never returned for it."));
	armor.push(new Armor("Amethyst Tunic",			2,		8,		3,	90, "An brilliant piece of apparel made of shining, fibrous amethyst."));
	armor.push(new Armor("Drakeskin Cloak",			3,		10,		4,  100, "A cloak made of the processed hide of a drake.", false));
	
	for (let i = 0; i < weapons.length; i++) {
		items.push(weapons[i]);
	}
	for (let j = 0; j < armor.length; j++) {
		items.push(armor[j]);
	}
}

function initSpells() {
	//--- Schools of Magic ---
	//Blood
	//Divine Magic
	//Elemental Magic
	
	spells.push(new Spell("self-taught", "Arcane Strike", "Deal 6 Damage to a Target", 4));
	
	//School, Range, Name, Desccription, AP Cost, HP Cost, Gold Cost
	spells.push(new Spell("elemental", "Wall of Fire", "Deal 3-6 damage to every enemy in a selected row.", 6));
	spells.push(new Spell("elemental", "Stoneskin", "+8 Physical Armor +4 Magical Armor for 3 turns.", 6));
	spells.push(new Spell("elemental", "Chain Lightning", "Deal 2-6 damage per target to 3 targets.", 7));
	spells.push(new Spell("elemental", "Gale", "Push a row of enemies back one row.", 5)); 
	spells.push(new Spell("elemental", "Entangle", "Summon vines to a row, dealing 2-4 damage and having a chance to root enemies in place.", 6)); 
	spells.push(new Spell("elemental", "Earthen Spear", "Deal 8-12 damage to an adjacent target.", 7));
	spells.push(new Spell("elemental", "Blizzard", "Deal 2-4 damage to all enemies. Has a small chance to stun them.", 8));
	spells.push(new Spell("elemental", "Freeze", "Deal 2-6 damage to a target. Has a 75% chance to freeze, stunning them for a turn.", 8));
	
	spells.push(new Spell("imperial", "Frenzy", "Gain +3 AP per every 3rd spell you cast each turn. Lasts 3 Turns.", 3));
	spells.push(new Spell("imperial", "Ferocity", "Your damaging spells do +2 DMG per target this turn.", 5));
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
	spells.push(new Spell("divine", "Divine Hand", "Deal 16-24 damage to an adjacent target.", 8, 0, 5));
	
}

function initEnemies() {
	//0 - The Haunted Crypts
	//						Name, 				HP, 	Phys, 	Magic, 	Diff	Zones		Gold	MOVES	TYPE
	enemies.push(new Enemy("Imp",				15,		0,		0,		5,		[0, 1],		3,		2,		"evil", "A miniscule, grey-skinned creature. Its long, spindly limbs support a fat torso that's little more than a ravenous mouth and a single eye"));
	enemies.push(new Enemy("Zombie",			25,		0,		3,		15,		[0], 		3,		2,		"evil", "A shambling heap of cold, rotting flesh. It's grey-eyed, and lacking any intellect.")); //Phys
	enemies.push(new Enemy("Apparition",		10,		50,		50,		20,		[0], 		5,		0, 		"evil", "A pale, transient figure bearing closer resemblance to a shimmering fog than to the human it once was.")); //Magic
	enemies.push(new Enemy("Cultist",			50,		0,		0,		30,		[0, 2], 	8,		2,		"", "Dressed in dark robes. They seem elated when they cut into flesh. What honeyed words have led them here, beyond reason?")); //Phys
	enemies.push(new Enemy("Cave Spider",		45,		5,		0,		35,		[0], 		10,		3,		"animal", "A frail-seeming thing, pale in color and long of leg and body. Clear venom drips from its fangs.")); //Phys
	enemies.push(new Enemy("Skeletal Swordsman",20,		16,		12,		40,		[0], 		12,		1,		"evil", "Bleached white bones, devoid of all flesh, held together by dark magic and rusted armor. It wields an ancient Longsword.")); //Phys
	enemies.push(new Enemy("Skeletal Spearman",	20,		16,		12,		40,		[0], 		12,		1,		"evil", "Bleached white bones, devoid of all flesh, held together by dark magic and rusted armor. It wields an ancient Spear.")); //Phys
	enemies.push(new Enemy("Skeletal Archer",	15,		16,		12,		40,		[0], 		12,		1,		"evil", "Bleached white bones, devoid of all flesh, held together by dark magic. It wields a Longbow.")); //Phys
	enemies.push(new Enemy("Goblin Swordsman",	70,		3,		1,		40,		[0, 1], 	15,		2,		"", "A fanged, snarling goblin. Its blade is crudely wrought of iron, and chipped by many battles.")); //Phys
	enemies.push(new Enemy("Goblin Spearman",	70,		3,		1,		40,		[0, 1], 	15,		2,		"", "A fanged, snarling goblin. It wears a leather cuirass and wields a spear.")); //Phys
	enemies.push(new Enemy("Goblin Archer",		50,		2,		1,		40,		[0, 1], 	15,		2,		"", "A fanged, snarling goblin. It's lightly armored and carrying a longbow with a quiver of stone arrows.")); //Phys
	enemies.push(new Enemy("Hungry Ghoul",		60,		0,		3,		50,		[0], 		20,		2, 		"evil", "A ravenous humanoid creature, crawling on all fours. Its mouth hangs open; blood and flesh sticks to its grey teeth.")); //Magic
	enemies.push(new Enemy("Wandering Moon", 	40,		14,		8,		60,		[0, 1, 2],	20,		2,		"construction", "A rough sphere of glowing marble that floats ominously above travellers, eclipsing the true moon as to remain undetected."));
	enemies.push(new Enemy("Bronze Bellbeast", 	40, 	8,		8,		70, 	[0], 		25,		1,		"construction", "An ancient church bell, floating ominously above the ground. It still hums from the resonation of its last tolling.")); //Magic
	enemies.push(new Enemy("Flesh Golem",		150,	0,		0,		75,		[0], 		25,		2,		"", "A hulking assembly of flesh, crudely sewn and heaped together and imbued with life.")); //Phys
	enemies.push(new Enemy("Swarm of Bats", 	90,		6,		6,		100,	[0],		40,		4,		"animal", "A swarm of dark vampire bats. They move in unison, as though they were of mind.")); //phys
	enemies.push(new Enemy("Vampire", 			90,		6,		6,		100,	[0],		40,		4,		"evil", "A slim pale-skinned figure, dressed in old yet sturdy attire. There is an animal hunger behind their intelligent eyes.")); //magic
	enemies.push(new Enemy("Cult Leader", 		100, 	3,		10,		115, 	[0, 2], 	40,		2,		"", "A towering, muscular figure. He's decked out in ornate robes and gem-encrusted rings, and carrying a jagged onyx blade.")); //Phys
	enemies.push(new Enemy("Lost Angel", 		60, 	10,		25,		100, 	[0], 		40,		3,		"", "It is a creature of sublime beauty, surrounded by a glowing white aura, but behind its pretty eyes is a twitchy, animal intent. It seems to have gone mad down here.")); //Magic
	enemies.push(new Enemy("Lich", 				100, 	8,		8,		150, 	[0], 		60,		1,		"evil", "The Harbringer of Death. Its face is hidden beneath a dark mask from which all eyes turn. The dead obeys.")); //Magic
	enemies.push(new Enemy("Goblin Warlord", 	125, 	6,		6,		150, 	[0, 1, 2], 	60,		1,		"", "A tall, muscular creature with fangs that portrude as tusks. There is a wicked intelligence clear upon its face. It seems proud in its work.")); //Phys
	
	//1 - The Acrid Swamp
	//						Name, 				HP, 	Phys, 	Magic, 	Diff	Zones	Gold	MOVES
	enemies.push(new Enemy("Living Slime",		55,		0,		0,		15,		[1, 0], 5,		1,		"animal", "A slow-moving heap of acidic slime, that steams as it moves across living matter.")); //Phys
	enemies.push(new Enemy("Toxic Mushroom",	15,		2,		2,		20,		[1, 2], 5,		0,		"plant",  "A giant black mushroom, crusted in flesh as solid as wood and covered with deadly spores."));
	enemies.push(new Enemy("Giant Amoeba",		45,		0,		0,		20,		[1], 	5, 		1,		"animal", "A dim creature, slow, yet strong. It makes its way cautiously about the world.")); //Phys
	enemies.push(new Enemy("Slugbeast",			100,	0,		0,		20,		[1, 2],	8, 		1,		"animal", "A giant muscled mass of dark brown-grey flesh. Its bulk is covered in a layer of slime.")); //Phys
	enemies.push(new Enemy("Living Vine",		50,		0,		0,		25,		[1, 2], 10, 	2,		"plant",  "A heap of vines that coil and strike, likely animated by some wanton witch or mage.")); //Phys
	enemies.push(new Enemy("Swamp Ape",			60,		1,		1,		30,		[1],  	15, 	2,		"animal", "A shaggy ape covered in damp, white fur. It stretches its sinewy arms and screeches, revealing its sturdy fangs.")); //Phys
	enemies.push(new Enemy("Witch",				45,		0,		4,		35,		[1], 	15, 	2,		"", 	  "A cunning being, well-learned in the brewing of potions and the casting of hexes. She wanders the swamp in search of rare alchemical ingredients.")); //Magic
	enemies.push(new Enemy("Flaming Wisp",		20,		8,		8,		40,		[1, 0], 20, 	3,		"", 	  "A glowing blue flame that hovers above the swamp waters. It has no reflection.")); //Magic
	enemies.push(new Enemy("Caustic Snail",		50,		6,		0,		50,		[1, 2], 20, 	1,		"animal", "A giant snail. Algae grows upon its strong shell. Its ooze has incredible toxic and restorative properties.")); //Phys
	enemies.push(new Enemy("Giant Frog",		70,		0,		0,		50,		[1], 	20,		3,		"animal", "A giant frog that sits nearly submerged in the water, silently waiting to rise up, and with a flick of its tongue devour its prey.")); //Phys
	enemies.push(new Enemy("Mushroom Mage", 	60,		0,		2,		70,		[1, 2],	20,		1,		"",		  "A myopic fellow, perpetually high off of spores. His magic may not be the most powerful, but many an adventurer has died underestimating the toxic spores."));
	enemies.push(new Enemy("Swamp Stalker", 	30,		0,		0,		70,		[1, 2],	25,		1,		"animal", "An ambush predator with an elongated body like a salamander's and long barbed tentacles. Only its protruding eyes are visible through the thick lichens growing on its flesh. *YELLOW*Added by Morgan"));
	enemies.push(new Enemy("Fumous Fiend",		100,	0,		0,		60,		[1], 	25,		1,		"evil",   "A hulking bipedal demon with gaseous blood. It inhales, and bloats at once to twice its regular size. On a whim its pores expand, and out pours a toxic mist.")); //Phys
	enemies.push(new Enemy("Swamp Mage",		45,		0,		4,		70,		[1], 	25, 	2,		"",       "A native of the swamp. She is attuned to the toxins and creatures of her environment, she views such incursions as these with the utmost contempt.")); //Magic
	enemies.push(new Enemy("Foul Sluglord", 	250, 	0,		0,		75, 	[1, 2],	30,		1,		"animal", "A heaping musculature, vast almost beyond fathoming. Its slow movements cause the ground about it to rumble, and it packs a fiercome bite.")); //Phys
	enemies.push(new Enemy("Wisp Knight", 		75, 	8,		8,		100, 	[1, 0],	50,		2,		"", 	  "A suit of chivalric plate armor, imbued with life by a blue flame within.")); //Magic
	enemies.push(new Enemy("Slimelord", 		100, 	0,		0,		110, 	[1, 0],	55,		2,		"animal", "A tumultuous mass, oozing, shifting, steaming. It has grown beyond its ability to maintain cohesion.")); //Phys
	enemies.push(new Enemy("Swamp Demon", 		100, 	4,		8,		100, 	[1],	60,		3,		"", 	  "An evil creature. It moves frantically and for all its power it seems to be quite a wretched thing.")); //Magic
	
	//2 - The Wilted Woods
	//						Name, 				HP, 	Phys, 	Magic, 	Diff	Zones	Gold	MOVES
	enemies.push(new Enemy("Scoundrel", 		25,		0,		0,		15,		[2],	5,		2,		"", "A round and gnarlish figure, who swipes his knife upward at you from his slumped position. *YELLOW*Added By Christopher"));
	enemies.push(new Enemy("Crazed Wolf", 		35, 	0,		0,		20, 	[2], 	5,		3,		"animal", "A mangy wolf, foaming at its mouth and snapping viciously.")); //Phys
	enemies.push(new Enemy("Briar Beast", 		50, 	0,		0,		20, 	[2, 1], 10,		1,		"", "A squat, rotund creature with thorny wood-like skin and a shaggy coat of bright green leaves.")); //Phys + Magic Reflect
	enemies.push(new Enemy("Fae Trickster",		8,		0,		0,		30,		[2], 	15,		0,		"plant", "A small, humanoid figure flittering on thin wings, dressed in vibrant green. Its face is more like an animal's than a man's, and is permanently curled into a mischievous sneer.")); //Magic
	enemies.push(new Enemy("Brigand",			50,		3,		1,		40,		[2], 	25,		2,		"", "A human dressed in mismatched armor, carrying a pair of duel blades that seem to have seen their fair share of battles.")); //Phys
	enemies.push(new Enemy("Giant Spider",		40,		4,		0,		40,		[2, 0], 20,		3,		"animal", "A vast, fat-bodied insect roughly the size of a bull. Its body is covered in long thin hairs, and its eyes afix onto its prey.")); //Phys	
	enemies.push(new Enemy("Mossy Statue",		100,	12,		16,		50,		[2], 	40,		0,		"construction", "A Jade Statue of a beautiful woman, weathered by countless years in the forest. Its limbs and head have fallen into the dirt about its base. It hums quietly.")); //Magic
	enemies.push(new Enemy("Wild Bear",			50,		6,		2,		55,		[2, 0], 25,		2,		"animal", "A towering one-eyed bear with claws as long and sharp as daggers. Its hide is greying, and criss-crossed with the scars of its many triumphs.")); //Phys
	enemies.push(new Enemy("Ogre",				75,		6,		2,		60,		[2, 1], 25,		1,		"", "A giant naked creature, twice as tall as any man and dragging a great club at its side. Flies cling to the blood that stains its cheeks and chin.")); //Phys
	enemies.push(new Enemy("Scaled Drake",		60,		5,		20,		70,		[2, 1], 30,		2,		"animal", "A wide-eyed quadraped, famed for its thick, pinecone-like hide. It has a wide body and short tail, and is highly resistant to magic.")); //Phys
	enemies.push(new Enemy("Beekeeper", 		75, 	3,		3,		90, 	[2], 	30,		1,		"", "A figure of medium height, dressed in clean white robes. Its face is hidden by a dome of tan wicker, and on its back is a wicker hive.")); //Phys
	enemies.push(new Enemy("Briar Monster", 	100, 	2,		2,		100, 	[2, 1], 35,		1,		"", "A Briar Beast grown to monstrous proportions. Its four limbs are as thick as tree trunks, and the thorns on its hide have grown so long they twist into loops.")); //Phys + Magic Reflect
	enemies.push(new Enemy("Forest Demon", 		100, 	4,		8,		100, 	[2],	40,		2,		"", "An evil creature. It blends itself into its surroundings, changing its skin to match the foliage, waiting to ambush travellers and beast alike.")); //Magic
	enemies.push(new Enemy("Spider Queen", 		125, 	5,		0,		100, 	[2],	45,		2,		"animal", "A monstrously large spider, with legs as long as pikes, and fangs as crushing as any war hammer.")); //Phys
	enemies.push(new Enemy("Brigand Lord",		75,		6,		2,		115,	[2], 	80,		3,		"", "A princely figure, adorned in silver plate mail and decked in gold jewelry, pilfered from passing aristocrats. He has done his share in turning travellers away from the roads, and now he is king of the desolation.")); //Phys
	enemies.push(new Enemy("Houndlord", 		75, 	5,		5,		125, 	[2], 	50,		2,		"", "It stands upright, cloaked in red, its face a shadow which light does not pierce. In each hand it holds a wide blade, and all around its knees wolves run to and fro. It knows no allegiance nor fear.")); //Phys
	
	//3 - The Stony Island
	//						Name, 					HP, 	Phys, 	Magic, 	Diff	Zones	Gold	MOVES	TYPE		DESCRIPTION
	enemies.push(new Enemy("Anchorite Worm", 		5,		0,		0,		5,		[3],	3,		2,		"animal", 	"A disgusting parasite that spends its life cycle without ever emerging from its host. An old sailor’s tale warns of an adult anchorite worm crawling from a whale’s corpse into a sleeping crewman’s anus. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Squallbird", 			25,		0,		0,		15,		[3],	5,		3,		"animal", 	"With the disposition of a seagull and the wingspan of an albatross, a squallbird is a sailor’s nightmare. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Reef Crab", 			20,		16,		6,		20,		[3],	5,		1,		"animal", 	"A crab the size of a large dog. This island hardly seems lush enough to support a population of such creatures. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Sunfish", 				25,		0,		0,		20,		[3],	5,		3,		"animal", 	"A translucent filter feeder that stuns predators with a flash of bioluminescence as bright as its namesake. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Coral Crawler", 		30,		6,		4,		20,		[3],	5,		1,		"animal", 	"It’s as if the seafloor itself is moving toward you. These creatures are docile unless provoked; their diet mostly consists of worms. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Lost Mariner", 			30,		6,		2,		30,		[3],	10,		2,		"", 		"An old sailor who has lost his mind to parasitic barnacles that cling to his flesh like armor. Is anything left of the man he once was? *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Squelcher",				40,		0,		0,		40,		[3],	12,		3,		"animal",	"A hideous, jet-black beast like a manta ray with an elephant’s trunk. Squelchers often follow fishing vessels to steal their catch, and are typically heard before they’re seen.*YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Fishman Archer", 		35,		0,		0,		40,		[3],	12,		2,		"", 		"A gilled humanoid of some intelligence, wielding a coral bow. No one knows whether the fishmen are a naturally occurring species or abominations born of the sea cult’s rituals.*YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Fishman Tridentier", 	50,		0,		0,		50,		[3],	15,		2,		"", 		"A gilled humanoid of some intelligence, armed with a sharp fishing trident wrought of repurposed harpoons. No one knows whether the fishmen are a naturally occurring species or abominations born of the sea cult’s rituals. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Stone Crab", 			25,		60,		60,		60,		[3],	20,		1,		"animal", 	"A horse-sized crustacean with a mineralized shell that hardens continously as the creature ages. Its succulent meat could feed a ship’s crew for a week. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Reefwalker", 			75,		0,		0,		60,		[3],	20,		2,		"animal", 	"Reefwalkers stride along the coast on long, spindly legs, lowering their beaked maws into the water to catch unlucky crabs. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Sea Priest", 			50,		0,		0,		70,		[3],	25,		2,		"", 		"The devotee of a cult that seeks salvation in the depths instead of the heavens. His clothes and hair are caked with salt.*YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Sea Priestess", 		50,		0,		0,		70,		[3],	25,		2,		"", 		"The devotee of a cult that seeks salvation in the depths instead of the heavens. Her clothes and long hair are caked with salt.*YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Living Tide", 			40,		0,		0,		70,		[3],	20,		1,		"animal", 	"Frothing waves whipped into a vaguely humanoid form. A keen eye might spot the small cephalopod at its center. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Wadrin's Lizard", 		80,		2,		0,		70,		[3],	30,		1,		"animal", 	"A semiaquatic reptile so large, it seems a relic of aeons past. Often seen peacefully sunbathing on warm rocks. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Carcinos", 				90,		10,		10,		95,		[3],	35,		1,		"", 		"Its unremarkable crablike exterior belies a sinister intelligence. It spends the many years of its existence turning creatures into crabs, not out of malice, but out of a sense of duty. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Risen Whale", 			250,	0,		0,		95,		[3],	35,		1,		"", 		"A decomposing whale carcass reanimated by a cult’s foul magics. What was fallen will rise again. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Deep Horror", 			75,		2,		8,		95,		[3],	35,		2,		"", 		"A magical creature from the darkest depths of the sea; never meant to see the light of the surface. To avoid explosive decompression, it maintains a crushing pressure field around itself. *YELLOW*Added By Morgan"));
	enemies.push(new Enemy("Kurita", 				100,	8,		4,		100,	[3],	40,		4,		"animal", 	"A blind, lethargic creature of the deep sea that walks along the sea floor on its short limbs. Its jaws unhinge and its gills flitter and sacs in its throat swell, pushing gas through the bubbling pores on its back. The resultant pitch is so hypnotic that it need only wait for its prey to swim into its mouth. *YELLOW*Added by Andrew"));
	enemies.push(new Enemy("Siren", 				60,		4,		1,		110,	[3],	45,		1,		"animal", 	"A reclusive, semi-aquatic creature with coated in incredibly thick fur that insulates its long, millipedic body from the icy depths. Jutting from its sides are dozens of twitching legs, that propel it to tremendous speeds. It knows only contempt for all other creatures. *YELLOW*Added By Andrew"));
	enemies.push(new Enemy("Dirge", 				70,		4,		6,		120,	[3],	50,		4,		"animal", 	"Its sleek form ripples with prismatic light. Those who have seen a dirge from a great distance speak of it gliding along the horizon, where the stars drown in the sea. Those who have seen one up close no longer speak. *YELLOW*Added By Morgan"));
	
	
	//General enemies
	//						Name, 				HP, 	Phys, 	Magic, 	Diff	Zones		Gold	MOVES	TYPE
	enemies.push(new Enemy("Warded Totem", 		30,		4,		10,		25,		[0, 1, 2],  10,		0,		"construction", "A towering pillar of ancient grey wood, intricately decorated with dimly glowing runes. An aura of shimmering energy emits from it."));
	enemies.push(new Enemy("Ephemeral Warrior",	30,		0,		0,		70,		[0, 1, 2],	25,		2,		"", "The fading spirit of an ancient hero, animated solely by a lust for vengeance. Over several centuries their mind has been lost to hatred, and they have now become what they once sought to vanquish."));
	
	//Other
	//						Name, 				HP, 	Phys, 	Magic, 	Diff	Zones	Gold	MOVES
	enemies.push(new Enemy("Swarm of Bees", 	2, 		100,	100,	5, 		[], 	0,		4,		"animal", "A pesky swarm of enlarged, stinging insects")); //Phys
	enemies.push(new Enemy("Egg Sac", 			5,		0,		0,		25,		[],		0,		0,		"", "A vast bundle of silk. Something is crawling around within it."));
	enemies.push(new Enemy("Baby Spider", 		10,		0,		0,		5,		[],		0,		3,		"animal", "A squat spider, about the size of a house cat. It scuttles about frantically."));
	enemies.push(new Enemy("Living Spore",		5,		0,		0,		1,		[],		0,		2,		"plant",  "A tiny spore that glows in the dim light. It sways on the breeze, seeking to nestle into a rotten patch to sprout."));
	enemies.push(new Enemy("Servant",			40,		1,		1,		20,		[],		0,		2,		"", "A well-kept and well-dressed servant, carrying a dark mahogany baton. They're undyingly loyal to the noble they serve."));
	enemies.push(new Enemy("Mariner",			20,		0,		0,		20,		[],		0,		2,		"",			"An old sailor."));
	
	
	teams.push(["Imp", "Imp", "Imp", "Imp", "Imp", "Imp", "Imp", "Imp"]);
	teams.push(["Zombie", "Zombie", "Zombie", "Zombie"]);
	teams.push(["Apparition", "Apparition", "Hungry Ghoul"]);
	teams.push(["Cave Spider", "Cave Spider", "Cave Spider", "Giant Spider"]);
	teams.push(["Skeletal Swordsman", "Skeletal Spearman", "Skeletal Archer"]);
	teams.push(["Goblin Swordsman", "Goblin Spearman", "Goblin Archer"]);
	teams.push(["Goblin Spearman", "Goblin Archer", "Goblin Archer", "Warded Totem"]);
	teams.push(["Bronze Bellbeast", "Bronze Bellbeast"]);
	teams.push(["Flesh Golem", "Hungry Ghoul", "Hungry Ghoul"]);
	teams.push(["Crazed Wolf", "Crazed Wolf", "Wild Bear"]);
	teams.push(["Briar Beast", "Briar Beast", "Living Vine", "Living Vine"]);
	teams.push(["Giant Frog", "Giant Frog", "Giant Frog"]);
	teams.push(["Briar Monster", "Briar Beast"]);
	teams.push(["Briar Monster", "Living Vine", "Living Vine"]);
	teams.push(["Fae Trickster", "Fae Trickster", "Mossy Statue"]);
	teams.push(["Ogre", "Ogre"])
	teams.push(["Brigand", "Brigand", "Brigand"]);
	teams.push(["Foul Sluglord", "Slugbeast", "Slugbeast"]);
	teams.push(["Fumous Fiend", "Fumous Fiend"]);
	teams.push(["Giant Amoeba", "Giant Amoeba", "Living Slime", "Living Slime"]);
	teams.push(["Caustic Snail", "Caustic Snail", "Slugbeast", "Slugbeast"]);
	teams.push(["Swamp Ape", "Swamp Ape", "Swamp Ape"]);
	teams.push(["Flaming Wisp", "Flaming Wisp", "Flaming Wisp", "Flaming Wisp"]);
	teams.push(["Wisp Knight", "Flaming Wisp"]);
	teams.push(["Witch", "Giant Frog", "Giant Frog"]);
	teams.push(["Witch", "Swamp Mage"]);
	teams.push(["Baby Spider", "Baby Spider", "Egg Sac", "Egg Sac"]);
	teams.push(["Spider Queen", "Baby Spider", "Egg Sac", "Giant Spider"]);
	teams.push(["Goblin Warlord", "Warded Totem"]);
	teams.push(["Swamp Stalker", "Swamp Stalker"]);
	
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].ZONES.length > 0) {
			teams.push([enemies[i].NAME]);
		}
	}
	
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].DIFFICULTY >= 50) {
			enemies[i].LOOT.push(new Drop("Divine Spellbook", 2));
			enemies[i].LOOT.push(new Drop("Imperial Spellbook", 2));
			enemies[i].LOOT.push(new Drop("Blood Spellbook", 2));
			enemies[i].LOOT.push(new Drop("Witchcraft Spellbook", 2));
			enemies[i].LOOT.push(new Drop("Elemental Spellbook", 2));
			enemies[i].LOOT.push(new Drop("Wand", 5));
		}
		if (enemies[i].DIFFICULTY >= 75) {
			enemies[i].LOOT.push(new Drop("Staff", 2));
			enemies[i].LOOT.push(new Drop("Scepter", 1));
		}
		if (enemies[i].DIFFICULTY >= 30) {
			enemies[i].LOOT.push(new Drop("Health Potion", 25));
			enemies[i].LOOT.push(new Drop("Stamina Potion", 35));
		}
		if (enemies[i].NAME == "Witch") {
			enemies[i].LOOT.push(new Drop("Witchcraft Spellbook", 50));
			enemies[i].LOOT.push(new Drop("Health Potion", 100));
			enemies[i].LOOT.push(new Drop("Stamina Potion", 100));
			enemies[i].LOOT.push(new Drop("Wand", 25));
			enemies[i].LOOT.push(new Drop("Staff", 25));
			enemies[i].LOOT.push(new Drop("Scepter", 10));
		}
		if (enemies[i].NAME == "Swamp Mage" || enemies[i].NAME == "Mushroom Mage") {
			enemies[i].LOOT.push(new Drop("Witchcraft Spellbook", 50));
			enemies[i].LOOT.push(new Drop("Elemental Spellbook", 50));
			enemies[i].LOOT.push(new Drop("Imperial Spellbook", 50));
			enemies[i].LOOT.push(new Drop("Wand", 25));
			enemies[i].LOOT.push(new Drop("Staff", 50));
			enemies[i].LOOT.push(new Drop("Scepter", 15));
		}
		if (enemies[i].NAME == "Vampire" || enemies[i].NAME == "Swarm of Bats") {
			enemies[i].LOOT.push(new Drop("Vampire Fang", 25));
		}
		if (enemies[i].NAME == "Briar Beast") {
			enemies[i].LOOT.push(new Drop("Elemental Spellbook", 5));
			enemies[i].LOOT.push(new Drop("Reflect", 5));
		}
		if (enemies[i].NAME == "Mossy Statue") {
			enemies[i].LOOT.push(new Drop("Jade", 25));
		}
		if (enemies[i].NAME == "Scaled Drake") {
			enemies[i].LOOT.push(new Drop("Drakeskin Cloak", 30));
		}
		if (enemies[i].NAME == "Beekeeper") {
			enemies[i].LOOT.push(new Drop("Honeycomb", 25));
			enemies[i].LOOT.push(new Drop("Mead", 100));
			enemies[i].LOOT.push(new Drop("Mead", 100));
			enemies[i].LOOT.push(new Drop("Mead", 100));
		}
		if (enemies[i].NAME == "Fae Trickster") {
			enemies[i].LOOT.push(new Drop("Divine Spellbook", 25));
			enemies[i].LOOT.push(new Drop("Imperial Spellbook", 25));
			enemies[i].LOOT.push(new Drop("Blood Spellbook", 25));
			enemies[i].LOOT.push(new Drop("Witchcraft Spellbook", 25));
			enemies[i].LOOT.push(new Drop("Elemental Spellbook", 25));
			enemies[i].LOOT.push(new Drop("Wand", 25));
			enemies[i].LOOT.push(new Drop("Staff", 5));
		}
		if (enemies[i].NAME == "Briar Beast") {
			enemies[i].LOOT.push(new Drop("Elemental Spellbook", 10));
		}
		if (enemies[i].NAME == "Living Vine") {
			enemies[i].LOOT.push(new Drop("Elemental Spellbook", 10));
		}
		if (enemies[i].NAME == "Briar Monster") {
			enemies[i].LOOT.push(new Drop("Elemental Spellbook", 50));
			enemies[i].LOOT.push(new Drop("Reflect", 25));
		}
		if (enemies[i].NAME == "Lich") {
			enemies[i].LOOT.push(new Drop("Divine Spellbook", 50));
			enemies[i].LOOT.push(new Drop("Imperial Spellbook", 50));
			enemies[i].LOOT.push(new Drop("Blood Spellbook", 50));
			enemies[i].LOOT.push(new Drop("Death Mark", 25));
			enemies[i].LOOT.push(new Drop("Staff", 30));
			enemies[i].LOOT.push(new Drop("Scepter", 30));
		}
		if (enemies[i].NAME == "Skeletal Spearman" || enemies[i].NAME == "Goblin Spearman") {
			enemies[i].LOOT.push(new Drop("Spear", 60));
		}
		if (enemies[i].NAME == "Skeletal Swordsman" || enemies[i].NAME == "Goblin Swordsman") {
			enemies[i].LOOT.push(new Drop("Longsword", 60));
		}
		if (enemies[i].NAME == "Skeletal Archer" || enemies[i].NAME == "Goblin Archer") {
			enemies[i].LOOT.push(new Drop("Longbow", 60));
		}
		for (let j = 0; j < armor.length; j++) {
			if (armor[j].canDrop && armor[j].value > enemies[i].DIFFICULTY/3 && armor[j].value <= enemies[i].DIFFICULTY) {
				enemies[i].LOOT.push(new Drop(armor[j].name, 2));
			}
		}
		for (let j = 0; j < weapons.length; j++) {
			if (weapons[j].canDrop && weapons[j].value > enemies[i].DIFFICULTY/3 && weapons[j].value <= enemies[i].DIFFICULTY) {
				enemies[i].LOOT.push(new Drop(weapons[j].name, 2));
			}
		}
	}
	
	for (let i = 0; i < teams.length; i++) {
		for (let j = teams[i].length - 1; j >= 0 ; j--) {
			teams[i][j] = summon(teams[i][j], 0, false);
		}
	}
	
	//Sort Teams by Difficulty//
	let newList = [];
	while (teams.length > 0) {
		let minIndex = 0;
		let min = CalcDifficulty(teams[0]);
		for (let i = 0; i < teams.length; i++) {
			let diff = CalcDifficulty(teams[i]);
			if (diff < min) {
				min = diff;
				minIndex = i;
			}
		}
		newList.push(teams[minIndex]);
		teams.splice(minIndex, 1);
	}
	teams = newList;
	
	for (let i = 0; i < teams.length; i++) {
		let score = CalcDifficulty(teams[i]);
		if (score <= 70) {
			enemyLevels[0].push(teams[i]);
		}
		if (score >= 50 && score <= 120) {
			enemyLevels[1].push(teams[i]);
		}
		if (score >= 70) {
			enemyLevels[2].push(teams[i]);
		}
		if (teams[0].NAME == "Warded Totem") {
			enemyLevels[0].push(teams[i]);
			enemyLevels[1].push(teams[i]);
			enemyLevels[2].push(teams[i]);
		}
	}
	console.log("Level 1 Enemies: " + enemyLevels[0].length);
	console.log("Level 2 Enemies: " + enemyLevels[1].length);
	console.log("Level 3 Enemies: " + enemyLevels[2].length);
}



