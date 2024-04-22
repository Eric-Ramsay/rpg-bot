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