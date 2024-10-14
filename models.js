function Report() {
	this.kills = 0;
	this.gold = 0;
	this.damage = 0;
	this.taken = 0;
	this.mitigated = 0;
}

function Dialogue() {
	this.NPC = "";
	this.haircut = null;
	this.talks = 0;
	this.relation = 0;
}

function Character() {
	this.TYPE = "player";
	this.DESCRIPTION = "";
	//HELMET, GLOVES, CHEST, LEGS, BOOTS
	this.LEFT = -1;
	this.RIGHT = -1;
	this.INVENTORY = [];
	this.SKILLS = [];
	this.ABILITIES = [];
	this.SPELLS = [];
	//Stats
	this.NAME = "";
	this.ID = "";
	this.CLASS = "";
	//Vitality, Endurance, Magic, Strength, Dexterity, Stealth
	this.STATS = [0, 0, 0, 0, 0, 0];
	//Temporary Stats
	this.SP = 0;
	this.HP = 0;
	this.MANA = 0;
	this.GOLD = 0;
	this.STAMINA = 0;
	this.AP = 0;
	this.ENDED = false;
	this.LEVEL = 0;
	this.XP = 0;
	this.ARMOR = [0, 0];
	this.LOCATION = "";
	this.BUILDING = "";
	this.BACKPACK = false;
	this.EFFECTS = [];
	this.ROW = 3;
	this.ATTACKS = 0;
	this.CASTS = 0;
	this.TRADING = "";
	
	this.FLED = false;
	this.REPORT = new Report();
	
	this.HITS = [1, 1];
	this.ATTEMPTS = [1, 1];
	this.CURSED = false;
	
	this.RETIRED = false;
	this.DIALOGUE = [];
}

function Effect(name, type, description, stackable = false) {
	this.name = name;
	this.type = type;
	this.description = description;
	this.stackable = stackable;
	this.target = null;
	this.duration = 1;
	this.stacks = 1;
}

function Battle(parent) {
	this.location = "";
	this.level = 1;
	this.zone = 0;
	this.difficulty = 0;
	this.allies = [];
	this.enemies = [];
	this.deadEnemies = [];
	this.deadAllies = [];
	this.loot = [];
	this.started = false;
	this.allyTurn = false;
	this.ended = false;
	this.parent = parent;
}

function Item(name, type, value, description) {
	this.name = name;
	this.type = type;
	this.value = value;
	this.equipped = false;
	this.runes = [];
	this.description = description;
}

function NPC(name, merch, desc) {
	this.TYPE = "npc"
	this.NAME = name;
	this.DESCRIPTION = desc;
	this.MERCHANT = merch;
	this.ITEMS = [];
	this.CONVERSATIONS = [];
	this.INDEX = 0;
}

function Location() {
	this.id = "";
	this.description = "";
	this.connections = [];
	this.buildings = [];
	this.people = [];
	this.players = [];
	this.fish = [];
	this.dungeon = false;
	this.prosperity = 0;
	this.cost = 0;
}

function Building(id, description) {
	this.id = id;
	this.description = description;
	this.people = [];
	this.prosperity = 0;
}

function Weapon(name, weaponType, hands, attacks, value, chance, min, max, pen, AP, range, canDrop = true) {
	this.type = "weapon";
	this.subclass = weaponType;
	this.description = "";
	this.effect = "";
	this.runes = [];
	this.name = name;
	this.hands = hands;	
	this.value = value;
	this.attacks = [attacks, attacks];
	this.chance = chance;
	this.min = min;
	this.max = max;
	this.pen = pen;
	this.AP = AP;
	this.range = range;
	this.equipped = false;
	this.canDrop = canDrop;
}

function createQuest(){
	let quest = new Quest();
	let ran = 0;
	do {
		ran = rand(enemies.length);
	} while (enemies[ran].ZONES.length == 0);
	
	let difficulty = enemies[ran].DIFFICULTY;
	quest.value = difficulty;
	let num = 1;
	let max = 2 + rand(3);
	while (difficulty < max * 100) {
		num++;
		difficulty += enemies[ran].DIFFICULTY;
	}
	
	quest.value = (1 + Math.ceil(difficulty/4));
	quest.numRequired = num;
	quest.enemy = enemies[ran].NAME;
	
	return quest;
}

function Quest() {
	//this.description = "";
	this.enemy = "";
	this.numRequired = 0;
	this.numKilled = 0;
	this.value = 0;
}

function DeathReport(name, cl, lvl, report, desc = "", death = "") {
	this.NAME = name;
	this.DESCRIPTION = desc;
	this.CLASS = cl;
	this.LEVEL = lvl;
	this.DEATH = death
	this.REPORT = report;
}

function Town() {
	this.prosperity = 0;
	this.quests = [];
	this.graves = [];
	this.statues = [];
	this.retired = [];
}

function P_Attack(damage, hitChance, pen) {
	this.type = 0;
	this.number = 1;
	this.damage = damage;
	this.pen = pen;
	this.hitChance = hitChance;
}

function WeaponReport(name, cost, dmg, AP, pen, efficiency, scaling) {
	this.name = name;
	this.cost = cost;
	this.dmg = dmg;
	this.ap = AP;
	this.pen = pen;
	this.eff = efficiency;
	this.scaling = scaling;
}

function T_Attack(damage) {
	this.type = 2;
	this.number = 1;
	this.damage = damage;
	this.pen = 100;
	this.hitChance = 100;
}

function M_Attack(damage, pen = 0, hitChance = 100) {
	this.type = 1;
	this.number = 1;
	this.damage = damage;
	this.pen = pen;
	this.hitChance = hitChance;
}

function Attack(verb, damage, hitChance, type = 0, number = 1, range = 1, pen = 0) {
	this.verb = verb;
	this.number = number;
	this.damage = damage;
	this.range = range;
	this.type = type;
	this.hitChance = hitChance;
	this.pen = pen;
}

function Armor(name, physical, magical, AP, value, description, canDrop = true) {
	this.type = "armor";
	this.effect = "";
	this.name = name;
	this.armor = [physical, magical];
	this.AP = AP;
	this.value = value;
	this.runes = [];
	this.equipped = false;
	this.description = description;
	this.canDrop = canDrop;
}

function FishEvent(fish, date, location, caught = false) {
	this.fish = fish;
	this.date = date;
	this.caught = caught;
	this.valid = true;
	this.location = location;
}

function Rune(name, value, target, description) {
	this.value = value;
	this.type = "rune";
	this.target = target;
	this.name = name;
	this.description = description;
	this.equipped = false;
}

function Spell(name, school, description, AP, HP = 0, range = 6, numEnemies = 0, numRows = 0, numAllies = 0) {
	this.school = school;
	this.type = "spell";
	this.range = range;
	this.name = name;
	this.description = description;
	this.AP = AP;
	this.HP = HP;
	this.numEnemies = numEnemies;
	this.numRows = numRows;
	this.numAllies = numAllies;
}

function Enemy(Name, HP, physical, magical, Difficulty, Zones, Moves, type, description = "The resurrected corpse of a fallen adventurer.") {
	this.TYPE = type;
	this.NAME = Name;
	this.HP = HP;
	this.MaxHP = HP;
	this.ARMOR = [physical, magical];
	this.SUMMONED = false;
	this.EFFECTS = [];
	this.DIFFICULTY = Difficulty;
	this.ZONES = Zones;
	this.LOOT = [];
	this.ROW = 4;
	this.MOVES = Moves;
	this.DESCRIPTION = description;
	this.REPORT = new Report();
	this.PHASE = 0;
}

function Connection(id, direction) {
	this.id = id;
	this.direction = direction;
}

function Drop(item, chance) {
	this.name = item;
	this.chance = chance;
}
