(function(PMD) {
	var timerLastUpdate = 0;
	var pokemon = [
		{name: "Bulbasaur", id: 1, hp: 32, att: 9, spatt: 12, def: 10, spdef: 11},
		{name: "Ivysaur", id: 2, hp: 32, att: 9, spatt: 12, def: 10, spdef: 11},
		{name: "Venusaur", id: 3, hp: 32, att: 9, spatt: 12, def: 10, spdef: 11},
		{name: "Charmander", id: 4, hp: 34, att: 11, spatt: 12, def: 11, spdef: 10},
		{name: "Charmeleon", id: 5, hp: 34, att: 11, spatt: 12, def: 11, spdef: 10},
		{name: "Charizard", id: 6, hp: 34, att: 11, spatt: 12, def: 11, spdef: 10},
		{name: "Squirtle", id: 7, hp: 40, att: 9, spatt: 9, def: 11, spdef: 11},
		{name: "Wartortle", id: 8, hp: 40, att: 9, spatt: 9, def: 11, spdef: 11},
		{name: "Blastoise", id: 9, hp: 40, att: 9, spatt: 9, def: 11, spdef: 11},
		{name: "Caterpie", id: 10, hp: 24, att: 15, spatt: 15, def: 7, spdef: 6},
		{name: "Metapod", id: 11, hp: 17, att: 17, spatt: 17, def: 16, spdef: 16},
		{name: "Butterfree", id: 12, hp: 34, att: 15, spatt: 15, def: 6, spdef: 6},
		{name: "Weedle", id: 13, hp: 29, att: 16, spatt: 16, def: 9, spdef: 9},
		{name: "Kakuna", id: 14, hp: 29, att: 16, spatt: 16, def: 9, spdef: 9},
		{name: "Beedrill", id: 15, hp: 24, att: 13, spatt: 13, def: 7, spdef: 6},
		{name: "Pidgey", id: 16, hp: 18, att: 12, spatt: 11, def: 6, spdef: 7},
		{name: "Pidgeotto", id: 17, hp: 28, att: 23, spatt: 26, def: 11, spdef: 13},
		{name: "Pidgeot", id: 18, hp: 38, att: 28, spatt: 31, def: 15, spdef: 15},
		{name: "Rattata", id: 19, hp: 31, att: 18, spatt: 12, def: 13, spdef: 6},
		{name: "Raticate", id: 20, hp: 36, att: 23, spatt: 17, def: 18, spdef: 11},
		{name: "Spearow", id: 21, hp: 35, att: 17, spatt: 19, def: 9, spdef: 9},
		{name: "Fearow", id: 22, hp: 32, att: 16, spatt: 18, def: 13, spdef: 12},
		{name: "Ekans", id: 23, hp: 38, att: 14, spatt: 14, def: 11, spdef: 12},
		{name: "Arbok", id: 24, hp: 38, att: 14, spatt: 14, def: 10, spdef: 9},
		{name: "Pikachu", id: 25, hp: 32, att: 11, spatt: 11, def: 11, spdef: 11},
		{name: "Raichu", id: 26, hp: 32, att: 11, spatt: 11, def: 11, spdef: 11},
		{name: "Sandshrew", id: 27, hp: 35, att: 22, spatt: 17, def: 16, spdef: 9},
		{name: "Sandslash", id: 28, hp: 28, att: 20, spatt: 12, def: 14, spdef: 9},
		{name: "Nidoran F", id: 29, hp: 33, att: 15, spatt: 15, def: 9, spdef: 10},
		{name: "Nidorina", id: 30, hp: 32, att: 13, spatt: 13, def: 8, spdef: 8},
		{name: "Nidoqueen", id: 31, hp: 31, att: 14, spatt: 20, def: 12, spdef: 11},
		{name: "Nidoran M", id: 32, hp: 45, att: 19, spatt: 20, def: 15, spdef: 15},
		{name: "Nidorino", id: 33, hp: 39, att: 18, spatt: 19, def: 14, spdef: 14},
		{name: "Nidoking", id: 34, hp: 34, att: 18, spatt: 26, def: 23, spdef: 23},
		{name: "Clefairy", id: 35, hp: 20, att: 13, spatt: 13, def: 11, spdef: 11},
		{name: "Clefable", id: 36, hp: 24, att: 17, spatt: 18, def: 16, spdef: 15},
		{name: "Vulpix", id: 37, hp: 34, att: 10, spatt: 10, def: 8, spdef: 8},
		{name: "Ninetales", id: 38, hp: 34, att: 10, spatt: 10, def: 8, spdef: 8},
		{name: "Jigglypuff", id: 39, hp: 12, att: 5, spatt: 4, def: 5, spdef: 4},
		{name: "Wigglytuff", id: 40, hp: 24, att: 19, spatt: 19, def: 8, spdef: 7},
		{name: "Zubat", id: 41, hp: 38, att: 28, spatt: 27, def: 16, spdef: 16},
		{name: "Golbat", id: 42, hp: 37, att: 23, spatt: 18, def: 16, spdef: 16},
		{name: "Oddish", id: 43, hp: 31, att: 17, spatt: 17, def: 9, spdef: 9},
		{name: "Gloom", id: 44, hp: 29, att: 15, spatt: 15, def: 8, spdef: 8},
		{name: "Vileplume", id: 45, hp: 35, att: 19, spatt: 16, def: 10, spdef: 10},
		{name: "Paras", id: 46, hp: 29, att: 16, spatt: 16, def: 9, spdef: 9},
		{name: "Parasect", id: 47, hp: 27, att: 15, spatt: 15, def: 8, spdef: 8},
		{name: "Venonat", id: 48, hp: 43, att: 19, spatt: 19, def: 15, spdef: 16},
		{name: "Venomoth", id: 49, hp: 27, att: 18, spatt: 18, def: 8, spdef: 8},
		{name: "Diglett", id: 50, hp: 12, att: 9, spatt: 8, def: 9, spdef: 9},
		{name: "Dugtrio", id: 51, hp: 25, att: 17, spatt: 16, def: 16, spdef: 16},
		{name: "Meowth", id: 52, hp: 36, att: 10, spatt: 12, def: 12, spdef: 12},
		{name: "Persian", id: 53, hp: 36, att: 10, spatt: 12, def: 12, spdef: 12},
		{name: "Psyduck", id: 54, hp: 21, att: 14, spatt: 15, def: 7, spdef: 6},
		{name: "Golduck", id: 55, hp: 24, att: 14, spatt: 13, def: 12, spdef: 12},
		{name: "Mankey", id: 56, hp: 37, att: 14, spatt: 13, def: 13, spdef: 13},
		{name: "Primeape", id: 57, hp: 37, att: 14, spatt: 13, def: 15, spdef: 15},
		{name: "Growlithe", id: 58, hp: 44, att: 26, spatt: 22, def: 13, spdef: 13},
		{name: "Arcanine", id: 59, hp: 43, att: 26, spatt: 22, def: 12, spdef: 12},
		{name: "Poliwag", id: 60, hp: 20, att: 7, spatt: 8, def: 5, spdef: 5},
		{name: "Poliwhirl", id: 61, hp: 24, att: 11, spatt: 13, def: 9, spdef: 9},
		{name: "Poliwrath", id: 62, hp: 26, att: 11, spatt: 16, def: 11, spdef: 11},
		{name: "Abra", id: 63, hp: 53, att: 7, spatt: 18, def: 14, spdef: 12},
		{name: "Kadabra", id: 64, hp: 51, att: 7, spatt: 16, def: 14, spdef: 12},
		{name: "Alakazam", id: 65, hp: 46, att: 8, spatt: 14, def: 14, spdef: 12},
		{name: "Machop", id: 66, hp: 21, att: 12, spatt: 10, def: 7, spdef: 7},
		{name: "Machoke", id: 67, hp: 24, att: 12, spatt: 10, def: 7, spdef: 7},
		{name: "Machamp", id: 68, hp: 29, att: 14, spatt: 14, def: 15, spdef: 15},
		{name: "Bellsprout", id: 69, hp: 13, att: 7, spatt: 7, def: 8, spdef: 8},
		{name: "Weepinbell", id: 70, hp: 18, att: 10, spatt: 12, def: 8, spdef: 8},
		{name: "Victreebel", id: 71, hp: 23, att: 17, spatt: 17, def: 12, spdef: 11},
		{name: "Tentacool", id: 72, hp: 46, att: 13, spatt: 13, def: 12, spdef: 13},
		{name: "Tentacruel", id: 73, hp: 51, att: 18, spatt: 18, def: 11, spdef: 11},
		{name: "Geodude", id: 74, hp: 32, att: 15, spatt: 17, def: 7, spdef: 7},
		{name: "Graveler", id: 75, hp: 36, att: 16, spatt: 15, def: 5, spdef: 4},
		{name: "Golem", id: 76, hp: 36, att: 18, spatt: 18, def: 6, spdef: 6},
		{name: "Ponyta", id: 77, hp: 40, att: 18, spatt: 18, def: 18, spdef: 18},
		{name: "Rapidash", id: 78, hp: 44, att: 22, spatt: 22, def: 19, spdef: 19},
		{name: "Slowpoke", id: 79, hp: 42, att: 12, spatt: 16, def: 14, spdef: 14},
		{name: "Slowbro", id: 80, hp: 48, att: 11, spatt: 16, def: 13, spdef: 15},
		{name: "Magnemite", id: 81, hp: 47, att: 15, spatt: 19, def: 13, spdef: 14},
		{name: "Magneton", id: 82, hp: 53, att: 15, spatt: 19, def: 14, spdef: 14},
		{name: "Farfetch'd", id: 83, hp: 31, att: 12, spatt: 13, def: 4, spdef: 4},
		{name: "Doduo", id: 84, hp: 26, att: 20, spatt: 12, def: 8, spdef: 9},
		{name: "Dodrio", id: 85, hp: 26, att: 18, spatt: 4, def: 5, spdef: 6},
		{name: "Seel", id: 86, hp: 41, att: 12, spatt: 12, def: 13, spdef: 13},
		{name: "Dewgong", id: 87, hp: 38, att: 12, spatt: 12, def: 13, spdef: 13},
		{name: "Grimer", id: 88, hp: 14, att: 8, spatt: 7, def: 5, spdef: 3},
		{name: "Muk", id: 89, hp: 17, att: 10, spatt: 9, def: 4, spdef: 3},
		{name: "Shellder", id: 90, hp: 18, att: 12, spatt: 11, def: 6, spdef: 7},
		{name: "Cloyster", id: 91, hp: 18, att: 12, spatt: 11, def: 6, spdef: 7},
		{name: "Gastly", id: 92, hp: 44, att: 12, spatt: 11, def: 11, spdef: 8},
		{name: "Haunter", id: 93, hp: 44, att: 12, spatt: 11, def: 11, spdef: 8},
		{name: "Gengar", id: 94, hp: 44, att: 12, spatt: 11, def: 11, spdef: 8},
		{name: "Onix", id: 95, hp: 25, att: 17, spatt: 17, def: 10, spdef: 10},
		{name: "Drowzee", id: 96, hp: 46, att: 17, spatt: 17, def: 12, spdef: 12},
		{name: "Hypno", id: 97, hp: 48, att: 18, spatt: 18, def: 13, spdef: 13},
		{name: "Krabby", id: 98, hp: 29, att: 17, spatt: 17, def: 11, spdef: 11},
		{name: "Kingler", id: 99, hp: 44, att: 23, spatt: 24, def: 18, spdef: 18},
		{name: "Voltorb", id: 100, hp: 26, att: 15, spatt: 17, def: 9, spdef: 8},
		{name: "Electrode", id: 101, hp: 30, att: 19, spatt: 21, def: 12, spdef: 11},
		{name: "Exeggcute", id: 102, hp: 14, att: 8, spatt: 8, def: 7, spdef: 5},
		{name: "Exeggutor", id: 103, hp: 30, att: 16, spatt: 20, def: 10, spdef: 8},
		{name: "Cubone", id: 104, hp: 49, att: 17, spatt: 17, def: 14, spdef: 14},
		{name: "Marowak", id: 105, hp: 44, att: 15, spatt: 15, def: 14, spdef: 14},
		{name: "Hitmonlee", id: 106, hp: 51, att: 19, spatt: 10, def: 18, spdef: 16},
		{name: "Hitmonchan", id: 107, hp: 50, att: 20, spatt: 9, def: 16, spdef: 18},
		{name: "Lickitung", id: 108, hp: 57, att: 24, spatt: 22, def: 21, spdef: 20},
		{name: "Koffing", id: 109, hp: 50, att: 24, spatt: 24, def: 7, spdef: 7},
		{name: "Weezing", id: 110, hp: 60, att: 25, spatt: 26, def: 12, spdef: 12},
		{name: "Rhyhorn", id: 111, hp: 24, att: 24, spatt: 21, def: 9, spdef: 9},
		{name: "Rhydon", id: 112, hp: 29, att: 24, spatt: 21, def: 12, spdef: 13},
		{name: "Chansey", id: 113, hp: 58, att: 5, spatt: 1, def: 2, spdef: 2},
		{name: "Tangela", id: 114, hp: 19, att: 11, spatt: 18, def: 9, spdef: 12},
		{name: "Kangaskhan", id: 115, hp: 52, att: 24, spatt: 21, def: 17, spdef: 17},
		{name: "Horsea", id: 116, hp: 42, att: 15, spatt: 18, def: 11, spdef: 16},
		{name: "Seadra", id: 117, hp: 41, att: 18, spatt: 20, def: 16, spdef: 19},
		{name: "Goldeen", id: 118, hp: 29, att: 11, spatt: 9, def: 10, spdef: 9},
		{name: "Seaking", id: 119, hp: 34, att: 15, spatt: 13, def: 14, spdef: 13},
		{name: "Staryu", id: 120, hp: 22, att: 8, spatt: 10, def: 8, spdef: 7},
		{name: "Starmie", id: 121, hp: 20, att: 8, spatt: 10, def: 8, spdef: 7},
		{name: "Mr. Mime", id: 122, hp: 37, att: 15, spatt: 16, def: 8, spdef: 8},
		{name: "Scyther", id: 123, hp: 32, att: 19, spatt: 15, def: 10, spdef: 9},
		{name: "Jynx", id: 124, hp: 55, att: 15, spatt: 17, def: 14, spdef: 13},
		{name: "Electabuzz", id: 125, hp: 16, att: 14, spatt: 14, def: 2, spdef: 3},
		{name: "Magmar", id: 126, hp: 48, att: 19, spatt: 23, def: 6, spdef: 9},
		{name: "Pinsir", id: 127, hp: 26, att: 22, spatt: 18, def: 7, spdef: 9},
		{name: "Tauros", id: 128, hp: 44, att: 21, spatt: 16, def: 5, spdef: 3},
		{name: "Magikarp", id: 129, hp: 30, att: 5, spatt: 8, def: 9, spdef: 8},
		{name: "Gyarados", id: 130, hp: 33, att: 17, spatt: 14, def: 14, spdef: 14},
		{name: "Lapras", id: 131, hp: 37, att: 17, spatt: 19, def: 12, spdef: 10},
		{name: "Ditto", id: 132, hp: 40, att: 13, spatt: 13, def: 6, spdef: 6},
		{name: "Eevee", id: 133, hp: 36, att: 7, spatt: 6, def: 8, spdef: 8},
		{name: "Vaporeon", id: 134, hp: 37, att: 12, spatt: 11, def: 13, spdef: 13},
		{name: "Jolteon", id: 135, hp: 37, att: 12, spatt: 11, def: 13, spdef: 13},
		{name: "Flareon", id: 136, hp: 37, att: 12, spatt: 11, def: 13, spdef: 13},
		{name: "Porygon", id: 137, hp: 63, att: 29, spatt: 25, def: 21, spdef: 17},
		{name: "Omanyte", id: 138, hp: 50, att: 16, spatt: 20, def: 13, spdef: 14},
		{name: "Omastar", id: 139, hp: 58, att: 14, spatt: 16, def: 10, spdef: 10},
		{name: "Kabuto", id: 140, hp: 32, att: 16, spatt: 14, def: 13, spdef: 12},
		{name: "Kabutops", id: 141, hp: 37, att: 14, spatt: 9, def: 12, spdef: 9},
		{name: "Aerodactyl", id: 142, hp: 24, att: 17, spatt: 13, def: 5, spdef: 5},
		{name: "Snorlax", id: 143, hp: 42, att: 11, spatt: 11, def: 11, spdef: 11},
		{name: "Articuno", id: 144, hp: 48, att: 32, spatt: 32, def: 19, spdef: 19},
		{name: "Zapdos", id: 145, hp: 55, att: 23, spatt: 23, def: 12, spdef: 12},
		{name: "Moltres", id: 146, hp: 58, att: 30, spatt: 30, def: 17, spdef: 17},
		{name: "Dratini", id: 147, hp: 23, att: 14, spatt: 14, def: 7, spdef: 7},
		{name: "Dragonair", id: 148, hp: 27, att: 13, spatt: 13, def: 7, spdef: 5},
		{name: "Dragonite", id: 149, hp: 39, att: 13, spatt: 12, def: 14, spdef: 12},
		{name: "Mewtwo", id: 150, hp: 66, att: 26, spatt: 27, def: 16, spdef: 16},
		{name: "Mew", id: 151, hp: 62, att: 22, spatt: 22, def: 21, spdef: 21},
		{name: "Chikorita", id: 152, hp: 37, att: 10, spatt: 10, def: 11, spdef: 11},
		{name: "Bayleef", id: 153, hp: 37, att: 10, spatt: 10, def: 11, spdef: 11},
		{name: "Meganium", id: 154, hp: 37, att: 10, spatt: 10, def: 11, spdef: 11},
		{name: "Cyndaquil", id: 155, hp: 36, att: 12, spatt: 12, def: 10, spdef: 10},
		{name: "Quilava", id: 156, hp: 36, att: 12, spatt: 12, def: 10, spdef: 10},
		{name: "Typhlosion", id: 157, hp: 36, att: 12, spatt: 12, def: 10, spdef: 10},
		{name: "Totodile", id: 158, hp: 41, att: 14, spatt: 14, def: 11, spdef: 11},
		{name: "Croconaw", id: 159, hp: 41, att: 14, spatt: 14, def: 11, spdef: 11},
		{name: "Feraligatr", id: 160, hp: 41, att: 14, spatt: 14, def: 11, spdef: 11},
		{name: "Sentret", id: 161, hp: 34, att: 19, spatt: 20, def: 9, spdef: 9},
		{name: "Furret", id: 162, hp: 34, att: 20, spatt: 21, def: 7, spdef: 12},
		{name: "Hoothoot", id: 163, hp: 27, att: 15, spatt: 15, def: 8, spdef: 8},
		{name: "Noctowl", id: 164, hp: 41, att: 21, spatt: 21, def: 15, spdef: 15},
		{name: "Ledyba", id: 165, hp: 33, att: 19, spatt: 19, def: 11, spdef: 11},
		{name: "Ledian", id: 166, hp: 29, att: 13, spatt: 13, def: 7, spdef: 7},
		{name: "Spinarak", id: 167, hp: 27, att: 18, spatt: 18, def: 11, spdef: 11},
		{name: "Ariados", id: 168, hp: 12, att: 13, spatt: 11, def: 6, spdef: 8},
		{name: "Crobat", id: 169, hp: 19, att: 8, spatt: 8, def: 6, spdef: 6},
		{name: "Chinchou", id: 170, hp: 45, att: 14, spatt: 14, def: 12, spdef: 10},
		{name: "Lanturn", id: 171, hp: 45, att: 13, spatt: 13, def: 11, spdef: 10},
		{name: "Pichu", id: 172, hp: 32, att: 9, spatt: 9, def: 9, spdef: 9},
		{name: "Cleffa", id: 173, hp: 13, att: 5, spatt: 3, def: 4, spdef: 3},
		{name: "Igglybuff", id: 174, hp: 27, att: 12, spatt: 9, def: 11, spdef: 9},
		{name: "Togepi", id: 175, hp: 20, att: 12, spatt: 10, def: 9, spdef: 8},
		{name: "Togetic", id: 176, hp: 37, att: 17, spatt: 16, def: 12, spdef: 11},
		{name: "Natu", id: 177, hp: 24, att: 15, spatt: 15, def: 5, spdef: 5},
		{name: "Xatu", id: 178, hp: 24, att: 14, spatt: 14, def: 5, spdef: 5},
		{name: "Mareep", id: 179, hp: 37, att: 18, spatt: 19, def: 7, spdef: 7},
		{name: "Flaaffy", id: 180, hp: 31, att: 20, spatt: 19, def: 5, spdef: 5},
		{name: "Ampharos", id: 181, hp: 29, att: 21, spatt: 20, def: 5, spdef: 5},
		{name: "Bellossom", id: 182, hp: 31, att: 11, spatt: 12, def: 4, spdef: 5},
		{name: "Marill", id: 183, hp: 26, att: 8, spatt: 7, def: 8, spdef: 7},
		{name: "Azumarill", id: 184, hp: 26, att: 9, spatt: 8, def: 9, spdef: 8},
		{name: "Sudowoodo", id: 185, hp: 33, att: 19, spatt: 19, def: 12, spdef: 12},
		{name: "Politoed", id: 186, hp: 40, att: 19, spatt: 15, def: 14, spdef: 16},
		{name: "Hoppip", id: 187, hp: 24, att: 12, spatt: 12, def: 8, spdef: 7},
		{name: "Skiploom", id: 188, hp: 33, att: 19, spatt: 18, def: 14, spdef: 14},
		{name: "Jumpluff", id: 189, hp: 48, att: 13, spatt: 13, def: 1, spdef: 8},
		{name: "Aipom", id: 190, hp: 45, att: 19, spatt: 19, def: 17, spdef: 17},
		{name: "Sunkern", id: 191, hp: 25, att: 12, spatt: 14, def: 12, spdef: 12},
		{name: "Sunflora", id: 192, hp: 23, att: 12, spatt: 14, def: 12, spdef: 12},
		{name: "Yanma", id: 193, hp: 42, att: 15, spatt: 16, def: 12, spdef: 12},
		{name: "Wooper", id: 194, hp: 27, att: 20, spatt: 20, def: 9, spdef: 9},
		{name: "Quagsire", id: 195, hp: 29, att: 18, spatt: 18, def: 6, spdef: 6},
		{name: "Espeon", id: 196, hp: 37, att: 12, spatt: 11, def: 13, spdef: 13},
		{name: "Umbreon", id: 197, hp: 37, att: 12, spatt: 11, def: 13, spdef: 13},
		{name: "Murkrow", id: 198, hp: 39, att: 27, spatt: 27, def: 12, spdef: 12},
		{name: "Slowking", id: 199, hp: 44, att: 13, spatt: 13, def: 9, spdef: 8},
		{name: "Misdreavus", id: 200, hp: 58, att: 19, spatt: 21, def: 17, spdef: 17},
		{name: "Unown", id: 201, hp: 39, att: 20, spatt: 20, def: 11, spdef: 12},
		{name: "Wobbuffet", id: 202, hp: 50, att: 10, spatt: 10, def: 14, spdef: 13},
		{name: "Girafarig", id: 203, hp: 43, att: 18, spatt: 18, def: 10, spdef: 10},
		{name: "Pineco", id: 204, hp: 34, att: 15, spatt: 15, def: 8, spdef: 7},
		{name: "Forretress", id: 205, hp: 34, att: 14, spatt: 14, def: 8, spdef: 8},
		{name: "Dunsparce", id: 206, hp: 27, att: 15, spatt: 15, def: 12, spdef: 12},
		{name: "Gligar", id: 207, hp: 52, att: 29, spatt: 23, def: 13, spdef: 17},
		{name: "Steelix", id: 208, hp: 43, att: 21, spatt: 9, def: 27, spdef: 14},
		{name: "Snubbull", id: 209, hp: 41, att: 19, spatt: 20, def: 12, spdef: 13},
		{name: "Granbull", id: 210, hp: 41, att: 24, spatt: 21, def: 13, spdef: 13},
		{name: "Qwilfish", id: 211, hp: 47, att: 15, spatt: 15, def: 15, spdef: 14},
		{name: "Scizor", id: 212, hp: 42, att: 18, spatt: 22, def: 13, spdef: 14},
		{name: "Shuckle", id: 213, hp: 14, att: 9, spatt: 9, def: 22, spdef: 22},
		{name: "Heracross", id: 214, hp: 29, att: 14, spatt: 18, def: 6, spdef: 6},
		{name: "Sneasel", id: 215, hp: 40, att: 22, spatt: 18, def: 15, spdef: 15},
		{name: "Teddiursa", id: 216, hp: 31, att: 21, spatt: 17, def: 13, spdef: 13},
		{name: "Ursaring", id: 217, hp: 35, att: 19, spatt: 15, def: 12, spdef: 12},
		{name: "Slugma", id: 218, hp: 39, att: 20, spatt: 20, def: 10, spdef: 10},
		{name: "Magcargo", id: 219, hp: 33, att: 15, spatt: 15, def: 9, spdef: 9},
		{name: "Swinub", id: 220, hp: 24, att: 21, spatt: 20, def: 9, spdef: 9},
		{name: "Piloswine", id: 221, hp: 19, att: 20, spatt: 18, def: 10, spdef: 10},
		{name: "Corsola", id: 222, hp: 15, att: 7, spatt: 7, def: 5, spdef: 5},
		{name: "Remoraid", id: 223, hp: 40, att: 19, spatt: 23, def: 11, spdef: 11},
		{name: "Octillery", id: 224, hp: 39, att: 19, spatt: 23, def: 11, spdef: 11},
		{name: "Delibird", id: 225, hp: 52, att: 16, spatt: 16, def: 20, spdef: 16},
		{name: "Mantine", id: 226, hp: 53, att: 20, spatt: 19, def: 20, spdef: 32},
		{name: "Skarmory", id: 227, hp: 25, att: 18, spatt: 18, def: 12, spdef: 6},
		{name: "Houndour", id: 228, hp: 34, att: 16, spatt: 19, def: 11, spdef: 11},
		{name: "Houndoom", id: 229, hp: 34, att: 15, spatt: 14, def: 14, spdef: 13},
		{name: "Kingdra", id: 230, hp: 29, att: 14, spatt: 19, def: 10, spdef: 13},
		{name: "Phanpy", id: 231, hp: 34, att: 10, spatt: 11, def: 14, spdef: 15},
		{name: "Donphan", id: 232, hp: 34, att: 10, spatt: 11, def: 14, spdef: 15},
		{name: "Porygon2", id: 233, hp: 52, att: 25, spatt: 26, def: 14, spdef: 15},
		{name: "Stantler", id: 234, hp: 27, att: 8, spatt: 10, def: 5, spdef: 5},
		{name: "Smeargle", id: 235, hp: 26, att: 8, spatt: 10, def: 4, spdef: 5},
		{name: "Tyrogue", id: 236, hp: 50, att: 20, spatt: 20, def: 19, spdef: 19},
		{name: "Hitmontop", id: 237, hp: 48, att: 19, spatt: 9, def: 18, spdef: 18},
		{name: "Smoochum", id: 238, hp: 42, att: 20, spatt: 18, def: 20, spdef: 18},
		{name: "Elekid", id: 239, hp: 33, att: 18, spatt: 18, def: 6, spdef: 6},
		{name: "Magby", id: 240, hp: 40, att: 19, spatt: 20, def: 8, spdef: 11},
		{name: "Miltank", id: 241, hp: 37, att: 15, spatt: 18, def: 19, spdef: 19},
		{name: "Blissey", id: 242, hp: 48, att: 10, spatt: 9, def: 12, spdef: 14},
		{name: "Raikou", id: 243, hp: 44, att: 9, spatt: 14, def: 7, spdef: 14},
		{name: "Entei", id: 244, hp: 46, att: 12, spatt: 12, def: 12, spdef: 12},
		{name: "Suicune", id: 245, hp: 54, att: 11, spatt: 11, def: 6, spdef: 6},
		{name: "Larvitar", id: 246, hp: 42, att: 26, spatt: 21, def: 12, spdef: 11},
		{name: "Pupitar", id: 247, hp: 45, att: 15, spatt: 11, def: 7, spdef: 6},
		{name: "Tyranitar", id: 248, hp: 50, att: 21, spatt: 11, def: 10, spdef: 10},
		{name: "Lugia", id: 249, hp: 61, att: 29, spatt: 28, def: 20, spdef: 20},
		{name: "Ho-Oh", id: 250, hp: 67, att: 15, spatt: 16, def: 11, spdef: 8},
		{name: "Celebi", id: 251, hp: 52, att: 12, spatt: 14, def: 9, spdef: 9},
		{name: "Treecko", id: 252, hp: 35, att: 11, spatt: 12, def: 11, spdef: 11},
		{name: "Grovyle", id: 253, hp: 35, att: 11, spatt: 12, def: 11, spdef: 11},
		{name: "Sceptile", id: 254, hp: 35, att: 11, spatt: 12, def: 11, spdef: 11},
		{name: "Torchic", id: 255, hp: 37, att: 12, spatt: 12, def: 11, spdef: 11},
		{name: "Combusken", id: 256, hp: 37, att: 12, spatt: 12, def: 11, spdef: 11},
		{name: "Blaziken", id: 257, hp: 37, att: 12, spatt: 12, def: 11, spdef: 11},
		{name: "Mudkip", id: 258, hp: 38, att: 10, spatt: 10, def: 9, spdef: 9},
		{name: "Marshtomp", id: 259, hp: 38, att: 10, spatt: 10, def: 9, spdef: 9},
		{name: "Swampert", id: 260, hp: 38, att: 10, spatt: 10, def: 9, spdef: 9},
		{name: "Poochyena", id: 261, hp: 32, att: 13, spatt: 15, def: 10, spdef: 10},
		{name: "Mightyena", id: 262, hp: 28, att: 18, spatt: 25, def: 8, spdef: 7},
		{name: "Zigzagoon", id: 263, hp: 26, att: 8, spatt: 10, def: 4, spdef: 5},
		{name: "Linoone", id: 264, hp: 24, att: 8, spatt: 10, def: 4, spdef: 5},
		{name: "Wurmple", id: 265, hp: 12, att: 8, spatt: 9, def: 7, spdef: 7},
		{name: "Silcoon", id: 266, hp: 32, att: 18, spatt: 20, def: 8, spdef: 8},
		{name: "Beautifly", id: 267, hp: 36, att: 13, spatt: 12, def: 10, spdef: 10},
		{name: "Cascoon", id: 268, hp: 30, att: 21, spatt: 19, def: 8, spdef: 8},
		{name: "Dustox", id: 269, hp: 35, att: 16, spatt: 15, def: 8, spdef: 8},
		{name: "Lotad", id: 270, hp: 35, att: 14, spatt: 14, def: 7, spdef: 7},
		{name: "Lombre", id: 271, hp: 32, att: 8, spatt: 9, def: 9, spdef: 10},
		{name: "Ludicolo", id: 272, hp: 39, att: 19, spatt: 19, def: 15, spdef: 14},
		{name: "Seedot", id: 273, hp: 32, att: 20, spatt: 20, def: 17, spdef: 17},
		{name: "Nuzleaf", id: 274, hp: 31, att: 23, spatt: 23, def: 17, spdef: 17},
		{name: "Shiftry", id: 275, hp: 30, att: 23, spatt: 22, def: 13, spdef: 15},
		{name: "Taillow", id: 276, hp: 27, att: 24, spatt: 17, def: 19, spdef: 18},
		{name: "Swellow", id: 277, hp: 27, att: 19, spatt: 14, def: 24, spdef: 23},
		{name: "Wingull", id: 278, hp: 21, att: 12, spatt: 12, def: 7, spdef: 3},
		{name: "Pelipper", id: 279, hp: 24, att: 10, spatt: 9, def: 10, spdef: 8},
		{name: "Ralts", id: 280, hp: 44, att: 16, spatt: 20, def: 15, spdef: 15},
		{name: "Kirlia", id: 281, hp: 43, att: 15, spatt: 19, def: 15, spdef: 15},
		{name: "Gardevoir", id: 282, hp: 42, att: 14, spatt: 18, def: 15, spdef: 15},
		{name: "Surskit", id: 283, hp: 35, att: 17, spatt: 17, def: 10, spdef: 10},
		{name: "Masquerain", id: 284, hp: 33, att: 16, spatt: 16, def: 10, spdef: 10},
		{name: "Shroomish", id: 285, hp: 34, att: 19, spatt: 16, def: 9, spdef: 8},
		{name: "Breloom", id: 286, hp: 39, att: 19, spatt: 16, def: 14, spdef: 13},
		{name: "Slakoth", id: 287, hp: 48, att: 28, spatt: 23, def: 17, spdef: 17},
		{name: "Vigoroth", id: 288, hp: 48, att: 27, spatt: 23, def: 17, spdef: 19},
		{name: "Slaking", id: 289, hp: 45, att: 26, spatt: 23, def: 18, spdef: 16},
		{name: "Nincada", id: 290, hp: 26, att: 17, spatt: 17, def: 10, spdef: 10},
		{name: "Ninjask", id: 291, hp: 26, att: 17, spatt: 16, def: 10, spdef: 9},
		{name: "Shedinja", id: 292, hp: 2, att: 28, spatt: 27, def: 9, spdef: 7},
		{name: "Whismur", id: 293, hp: 27, att: 17, spatt: 15, def: 18, spdef: 13},
		{name: "Loudred", id: 294, hp: 27, att: 20, spatt: 10, def: 17, spdef: 11},
		{name: "Exploud", id: 295, hp: 27, att: 20, spatt: 13, def: 16, spdef: 12},
		{name: "Makuhita", id: 296, hp: 49, att: 29, spatt: 14, def: 14, spdef: 18},
		{name: "Hariyama", id: 297, hp: 44, att: 27, spatt: 12, def: 12, spdef: 18},
		{name: "Azurill", id: 298, hp: 26, att: 13, spatt: 13, def: 14, spdef: 19},
		{name: "Nosepass", id: 299, hp: 54, att: 21, spatt: 17, def: 20, spdef: 22},
		{name: "Skitty", id: 300, hp: 41, att: 12, spatt: 12, def: 11, spdef: 11},
		{name: "Delcatty", id: 301, hp: 41, att: 12, spatt: 12, def: 11, spdef: 11},
		{name: "Sableye", id: 302, hp: 32, att: 13, spatt: 13, def: 14, spdef: 12},
		{name: "Mawile", id: 303, hp: 49, att: 23, spatt: 21, def: 13, spdef: 13},
		{name: "Aron", id: 304, hp: 40, att: 17, spatt: 16, def: 19, spdef: 16},
		{name: "Lairon", id: 305, hp: 43, att: 17, spatt: 16, def: 17, spdef: 15},
		{name: "Aggron", id: 306, hp: 32, att: 11, spatt: 10, def: 12, spdef: 12},
		{name: "Meditite", id: 307, hp: 37, att: 17, spatt: 19, def: 12, spdef: 12},
		{name: "Medicham", id: 308, hp: 37, att: 17, spatt: 19, def: 12, spdef: 12},
		{name: "Electrike", id: 309, hp: 34, att: 18, spatt: 20, def: 9, spdef: 9},
		{name: "Manectric", id: 310, hp: 36, att: 18, spatt: 23, def: 12, spdef: 12},
		{name: "Plusle", id: 311, hp: 46, att: 14, spatt: 15, def: 15, spdef: 15},
		{name: "Minun", id: 312, hp: 34, att: 27, spatt: 26, def: 16, spdef: 16},
		{name: "Volbeat", id: 313, hp: 40, att: 15, spatt: 16, def: 10, spdef: 11},
		{name: "Illumise", id: 314, hp: 36, att: 21, spatt: 13, def: 4, spdef: 9},
		{name: "Roselia", id: 315, hp: 49, att: 15, spatt: 15, def: 18, spdef: 18},
		{name: "Gulpin", id: 316, hp: 48, att: 13, spatt: 13, def: 13, spdef: 13},
		{name: "Swalot", id: 317, hp: 43, att: 17, spatt: 17, def: 17, spdef: 16},
		{name: "Carvanha", id: 318, hp: 48, att: 24, spatt: 21, def: 17, spdef: 17},
		{name: "Sharpedo", id: 319, hp: 53, att: 24, spatt: 21, def: 16, spdef: 16},
		{name: "Wailmer", id: 320, hp: 62, att: 12, spatt: 11, def: 12, spdef: 11},
		{name: "Wailord", id: 321, hp: 52, att: 17, spatt: 17, def: 15, spdef: 14},
		{name: "Numel", id: 322, hp: 38, att: 29, spatt: 27, def: 15, spdef: 14},
		{name: "Camerupt", id: 323, hp: 36, att: 27, spatt: 26, def: 14, spdef: 13},
		{name: "Torkoal", id: 324, hp: 45, att: 17, spatt: 16, def: 20, spdef: 20},
		{name: "Spoink", id: 325, hp: 43, att: 18, spatt: 18, def: 14, spdef: 14},
		{name: "Grumpig", id: 326, hp: 46, att: 20, spatt: 20, def: 13, spdef: 12},
		{name: "Spinda", id: 327, hp: 39, att: 13, spatt: 13, def: 13, spdef: 14},
		{name: "Trapinch", id: 328, hp: 42, att: 18, spatt: 18, def: 9, spdef: 9},
		{name: "Vibrava", id: 329, hp: 39, att: 19, spatt: 19, def: 12, spdef: 12},
		{name: "Flygon", id: 330, hp: 38, att: 13, spatt: 10, def: 4, spdef: 4},
		{name: "Cacnea", id: 331, hp: 29, att: 16, spatt: 16, def: 8, spdef: 8},
		{name: "Cacturne", id: 332, hp: 29, att: 15, spatt: 16, def: 7, spdef: 7},
		{name: "Swablu", id: 333, hp: 50, att: 18, spatt: 20, def: 14, spdef: 15},
		{name: "Altaria", id: 334, hp: 52, att: 18, spatt: 20, def: 14, spdef: 15},
		{name: "Zangoose", id: 335, hp: 54, att: 18, spatt: 18, def: 12, spdef: 14},
		{name: "Seviper", id: 336, hp: 43, att: 17, spatt: 14, def: 7, spdef: 7},
		{name: "Lunatone", id: 337, hp: 40, att: 14, spatt: 14, def: 12, spdef: 14},
		{name: "Solrock", id: 338, hp: 66, att: 16, spatt: 35, def: 27, spdef: 30},
		{name: "Barboach", id: 339, hp: 29, att: 14, spatt: 17, def: 4, spdef: 6},
		{name: "Whiscash", id: 340, hp: 24, att: 12, spatt: 14, def: 4, spdef: 5},
		{name: "Corphish", id: 341, hp: 47, att: 24, spatt: 28, def: 17, spdef: 17},
		{name: "Crawdaunt", id: 342, hp: 52, att: 29, spatt: 28, def: 19, spdef: 18},
		{name: "Baltoy", id: 343, hp: 31, att: 16, spatt: 18, def: 10, spdef: 10},
		{name: "Claydol", id: 344, hp: 35, att: 14, spatt: 14, def: 9, spdef: 10},
		{name: "Lileep", id: 345, hp: 17, att: 12, spatt: 11, def: 7, spdef: 6},
		{name: "Cradily", id: 346, hp: 17, att: 7, spatt: 9, def: 5, spdef: 6},
		{name: "Anorith", id: 347, hp: 17, att: 13, spatt: 14, def: 7, spdef: 8},
		{name: "Armaldo", id: 348, hp: 14, att: 13, spatt: 13, def: 7, spdef: 8},
		{name: "Feebas", id: 349, hp: 38, att: 14, spatt: 14, def: 14, spdef: 14},
		{name: "Milotic", id: 350, hp: 38, att: 14, spatt: 14, def: 14, spdef: 14},
		{name: "Castform", id: 351, hp: 44, att: 13, spatt: 13, def: 6, spdef: 6},
		{name: "Kecleon", id: 352, hp: 5, att: 1, spatt: 1, def: 1, spdef: 1},
		{name: "Shuppet", id: 353, hp: 54, att: 18, spatt: 18, def: 17, spdef: 17},
		{name: "Banette", id: 354, hp: 37, att: 11, spatt: 11, def: 11, spdef: 11},
		{name: "Duskull", id: 355, hp: 44, att: 12, spatt: 11, def: 11, spdef: 8},
		{name: "Dusclops", id: 356, hp: 44, att: 12, spatt: 11, def: 11, spdef: 8},
		{name: "Tropius", id: 357, hp: 46, att: 18, spatt: 7, def: 15, spdef: 14},
		{name: "Chimecho", id: 358, hp: 25, att: 15, spatt: 13, def: 8, spdef: 8},
		{name: "Absol", id: 359, hp: 47, att: 27, spatt: 23, def: 12, spdef: 14},
		{name: "Wynaut", id: 360, hp: 48, att: 10, spatt: 10, def: 21, spdef: 20},
		{name: "Snorunt", id: 361, hp: 40, att: 7, spatt: 7, def: 15, spdef: 15},
		{name: "Glalie", id: 362, hp: 49, att: 12, spatt: 13, def: 14, spdef: 13},
		{name: "Spheal", id: 363, hp: 29, att: 15, spatt: 15, def: 10, spdef: 10},
		{name: "Sealeo", id: 364, hp: 29, att: 15, spatt: 15, def: 8, spdef: 8},
		{name: "Walrein", id: 365, hp: 29, att: 8, spatt: 8, def: 12, spdef: 12},
		{name: "Clamperl", id: 366, hp: 39, att: 10, spatt: 13, def: 15, spdef: 14},
		{name: "Huntail", id: 367, hp: 34, att: 12, spatt: 11, def: 14, spdef: 13},
		{name: "Gorebyss", id: 368, hp: 33, att: 19, spatt: 21, def: 18, spdef: 16},
		{name: "Relicanth", id: 369, hp: 38, att: 11, spatt: 11, def: 12, spdef: 11},
		{name: "Luvdisc", id: 370, hp: 48, att: 10, spatt: 10, def: 10, spdef: 10},
		{name: "Bagon", id: 371, hp: 41, att: 15, spatt: 14, def: 11, spdef: 7},
		{name: "Shelgon", id: 372, hp: 53, att: 16, spatt: 16, def: 12, spdef: 18},
		{name: "Salamence", id: 373, hp: 52, att: 16, spatt: 18, def: 6, spdef: 23},
		{name: "Beldum", id: 374, hp: 50, att: 21, spatt: 18, def: 18, spdef: 18},
		{name: "Metang", id: 375, hp: 46, att: 21, spatt: 17, def: 17, spdef: 16},
		{name: "Metagross", id: 376, hp: 44, att: 21, spatt: 17, def: 17, spdef: 16},
		{name: "Regirock", id: 377, hp: 38, att: 15, spatt: 15, def: 24, spdef: 15},
		{name: "Regice", id: 378, hp: 34, att: 14, spatt: 22, def: 14, spdef: 22},
		{name: "Registeel", id: 379, hp: 34, att: 14, spatt: 14, def: 22, spdef: 22},
		{name: "Latias", id: 380, hp: 54, att: 22, spatt: 30, def: 22, spdef: 22},
		{name: "Latios", id: 381, hp: 54, att: 27, spatt: 31, def: 22, spdef: 22},
		{name: "Kyogre", id: 382, hp: 58, att: 17, spatt: 33, def: 14, spdef: 17},
		{name: "Groudon", id: 383, hp: 59, att: 31, spatt: 20, def: 14, spdef: 16},
		{name: "Rayquaza", id: 384, hp: 58, att: 29, spatt: 29, def: 17, spdef: 17},
		{name: "Jirachi", id: 385, hp: 38, att: 14, spatt: 19, def: 14, spdef: 14},
		{name: "Deoxys Base", id: 386, hp: 53, att: 29, spatt: 26, def: 22, spdef: 22},
		{name: "Deoxys Attack", id: 386, hp: 53, att: 29, spatt: 26, def: 14, spdef: 14},
		{name: "Deoxys Defense", id: 386, hp: 53, att: 25, spatt: 26, def: 29, spdef: 25},
		{name: "Deoxys Speed", id: 386, hp: 53, att: 29, spatt: 26, def: 22, spdef: 22},
		{name: "Turtwig", id: 387, hp: 30, att: 13, spatt: 13, def: 11, spdef: 11},
		{name: "Grotle", id: 388, hp: 30, att: 13, spatt: 13, def: 11, spdef: 11},
		{name: "Torterra", id: 389, hp: 30, att: 13, spatt: 13, def: 11, spdef: 11},
		{name: "Chimchar", id: 390, hp: 34, att: 12, spatt: 12, def: 11, spdef: 13},
		{name: "Monferno", id: 391, hp: 34, att: 12, spatt: 12, def: 11, spdef: 13},
		{name: "Infernape", id: 392, hp: 34, att: 12, spatt: 12, def: 11, spdef: 13},
		{name: "Piplup", id: 393, hp: 35, att: 11, spatt: 12, def: 13, spdef: 12},
		{name: "Prinplup", id: 394, hp: 35, att: 11, spatt: 12, def: 13, spdef: 12},
		{name: "Empoleon", id: 395, hp: 35, att: 11, spatt: 12, def: 13, spdef: 12},
		{name: "Starly", id: 396, hp: 27, att: 18, spatt: 18, def: 8, spdef: 7},
		{name: "Staravia", id: 397, hp: 24, att: 17, spatt: 17, def: 7, spdef: 6},
		{name: "Staraptor", id: 398, hp: 24, att: 16, spatt: 16, def: 6, spdef: 5},
		{name: "Bidoof", id: 399, hp: 38, att: 12, spatt: 12, def: 12, spdef: 12},
		{name: "Bibarel", id: 400, hp: 48, att: 12, spatt: 12, def: 12, spdef: 12},
		{name: "Kricketot", id: 401, hp: 22, att: 16, spatt: 17, def: 7, spdef: 7},
		{name: "Kricketune", id: 402, hp: 24, att: 14, spatt: 15, def: 11, spdef: 11},
		{name: "Shinx", id: 403, hp: 33, att: 10, spatt: 10, def: 10, spdef: 10},
		{name: "Luxio", id: 404, hp: 33, att: 10, spatt: 10, def: 10, spdef: 10},
		{name: "Luxray", id: 405, hp: 33, att: 10, spatt: 10, def: 10, spdef: 10},
		{name: "Budew", id: 406, hp: 29, att: 15, spatt: 15, def: 9, spdef: 9},
		{name: "Roserade", id: 407, hp: 44, att: 19, spatt: 24, def: 17, spdef: 17},
		{name: "Cranidos", id: 408, hp: 45, att: 15, spatt: 21, def: 11, spdef: 11},
		{name: "Rampardos", id: 409, hp: 37, att: 6, spatt: 19, def: 10, spdef: 10},
		{name: "Shieldon", id: 410, hp: 32, att: 15, spatt: 15, def: 11, spdef: 11},
		{name: "Bastiodon", id: 411, hp: 33, att: 13, spatt: 12, def: 18, spdef: 18},
		{name: "Burmy", id: 412, hp: 23, att: 14, spatt: 14, def: 7, spdef: 7},
		{name: "Wormadam", id: 413, hp: 28, att: 19, spatt: 17, def: 5, spdef: 7},
		{name: "Mothim", id: 414, hp: 41, att: 22, spatt: 22, def: 9, spdef: 9},
		{name: "Combee", id: 415, hp: 29, att: 16, spatt: 16, def: 9, spdef: 9},
		{name: "Vespiquen", id: 416, hp: 24, att: 15, spatt: 14, def: 2, spdef: 4},
		{name: "Pachirisu", id: 417, hp: 23, att: 11, spatt: 11, def: 7, spdef: 9},
		{name: "Buizel", id: 418, hp: 37, att: 22, spatt: 20, def: 13, spdef: 14},
		{name: "Floatzel", id: 419, hp: 30, att: 21, spatt: 20, def: 12, spdef: 10},
		{name: "Cherubi", id: 420, hp: 27, att: 13, spatt: 16, def: 8, spdef: 10},
		{name: "Cherrim", id: 421, hp: 25, att: 10, spatt: 15, def: 5, spdef: 6},
		{name: "Shellos", id: 422, hp: 13, att: 7, spatt: 8, def: 6, spdef: 6},
		{name: "Gastrodon", id: 423, hp: 29, att: 17, spatt: 17, def: 9, spdef: 9},
		{name: "Ambipom", id: 424, hp: 52, att: 16, spatt: 16, def: 14, spdef: 14},
		{name: "Drifloon", id: 425, hp: 42, att: 20, spatt: 17, def: 14, spdef: 13},
		{name: "Drifblim", id: 426, hp: 38, att: 21, spatt: 18, def: 13, spdef: 12},
		{name: "Buneary", id: 427, hp: 28, att: 18, spatt: 21, def: 7, spdef: 7},
		{name: "Lopunny", id: 428, hp: 24, att: 16, spatt: 19, def: 7, spdef: 7},
		{name: "Mismagius", id: 429, hp: 50, att: 17, spatt: 18, def: 10, spdef: 9},
		{name: "Honchkrow", id: 430, hp: 49, att: 27, spatt: 24, def: 23, spdef: 22},
		{name: "Glameow", id: 431, hp: 41, att: 16, spatt: 15, def: 8, spdef: 4},
		{name: "Purugly", id: 432, hp: 41, att: 14, spatt: 18, def: 11, spdef: 12},
		{name: "Chingling", id: 433, hp: 27, att: 15, spatt: 13, def: 8, spdef: 8},
		{name: "Stunky", id: 434, hp: 44, att: 23, spatt: 21, def: 20, spdef: 24},
		{name: "Skuntank", id: 435, hp: 35, att: 17, spatt: 11, def: 14, spdef: 15},
		{name: "Bronzor", id: 436, hp: 59, att: 14, spatt: 15, def: 13, spdef: 11},
		{name: "Bronzong", id: 437, hp: 54, att: 12, spatt: 13, def: 13, spdef: 11},
		{name: "Bonsly", id: 438, hp: 27, att: 14, spatt: 15, def: 6, spdef: 6},
		{name: "Mime Jr.", id: 439, hp: 46, att: 17, spatt: 16, def: 12, spdef: 12},
		{name: "Happiny", id: 440, hp: 43, att: 15, spatt: 13, def: 13, spdef: 12},
		{name: "Chatot", id: 441, hp: 40, att: 20, spatt: 21, def: 22, spdef: 23},
		{name: "Spiritomb", id: 442, hp: 53, att: 42, spatt: 41, def: 37, spdef: 37},
		{name: "Gible", id: 443, hp: 52, att: 16, spatt: 16, def: 14, spdef: 15},
		{name: "Gabite", id: 444, hp: 61, att: 20, spatt: 20, def: 31, spdef: 32},
		{name: "Garchomp", id: 445, hp: 61, att: 22, spatt: 19, def: 31, spdef: 32},
		{name: "Munchlax", id: 446, hp: 42, att: 11, spatt: 11, def: 11, spdef: 11},
		{name: "Riolu", id: 447, hp: 32, att: 11, spatt: 12, def: 10, spdef: 10},
		{name: "Lucario", id: 448, hp: 32, att: 11, spatt: 12, def: 10, spdef: 10},
		{name: "Hippopotas", id: 449, hp: 44, att: 18, spatt: 17, def: 14, spdef: 14},
		{name: "Hippowdon", id: 450, hp: 39, att: 21, spatt: 20, def: 17, spdef: 17},
		{name: "Skorupi", id: 451, hp: 42, att: 17, spatt: 14, def: 7, spdef: 7},
		{name: "Drapion", id: 452, hp: 51, att: 26, spatt: 21, def: 20, spdef: 21},
		{name: "Croagunk", id: 453, hp: 43, att: 21, spatt: 14, def: 14, spdef: 12},
		{name: "Toxicroak", id: 454, hp: 41, att: 20, spatt: 11, def: 12, spdef: 12},
		{name: "Carnivine", id: 455, hp: 39, att: 18, spatt: 20, def: 9, spdef: 9},
		{name: "Finneon", id: 456, hp: 37, att: 12, spatt: 10, def: 10, spdef: 11},
		{name: "Lumineon", id: 457, hp: 37, att: 11, spatt: 9, def: 10, spdef: 12},
		{name: "Mantyke", id: 458, hp: 38, att: 17, spatt: 21, def: 14, spdef: 20},
		{name: "Snover", id: 459, hp: 40, att: 20, spatt: 20, def: 13, spdef: 15},
		{name: "Abomasnow", id: 460, hp: 45, att: 18, spatt: 18, def: 14, spdef: 14},
		{name: "Weavile", id: 461, hp: 32, att: 21, spatt: 17, def: 12, spdef: 14},
		{name: "Magnezone", id: 462, hp: 48, att: 17, spatt: 23, def: 16, spdef: 16},
		{name: "Lickilicky", id: 463, hp: 57, att: 17, spatt: 16, def: 13, spdef: 14},
		{name: "Rhyperior", id: 464, hp: 24, att: 22, spatt: 13, def: 17, spdef: 17},
		{name: "Tangrowth", id: 465, hp: 37, att: 7, spatt: 15, def: 3, spdef: 2},
		{name: "Electivire", id: 466, hp: 43, att: 19, spatt: 16, def: 15, spdef: 16},
		{name: "Magmortar", id: 467, hp: 47, att: 16, spatt: 19, def: 15, spdef: 20},
		{name: "Togekiss", id: 468, hp: 52, att: 24, spatt: 26, def: 14, spdef: 15},
		{name: "Yanmega", id: 469, hp: 44, att: 22, spatt: 21, def: 13, spdef: 11},
		{name: "Leafeon", id: 470, hp: 37, att: 12, spatt: 11, def: 13, spdef: 13},
		{name: "Glaceon", id: 471, hp: 37, att: 12, spatt: 11, def: 13, spdef: 13},
		{name: "Gliscor", id: 472, hp: 35, att: 10, spatt: 14, def: 15, spdef: 9},
		{name: "Mamoswine", id: 473, hp: 34, att: 21, spatt: 16, def: 15, spdef: 17},
		{name: "Porygon-Z", id: 474, hp: 56, att: 16, spatt: 19, def: 13, spdef: 15},
		{name: "Gallade", id: 475, hp: 48, att: 21, spatt: 15, def: 12, spdef: 12},
		{name: "Probopass", id: 476, hp: 56, att: 24, spatt: 20, def: 22, spdef: 22},
		{name: "Dusknoir", id: 477, hp: 34, att: 18, spatt: 13, def: 12, spdef: 17},
		{name: "Froslass", id: 478, hp: 48, att: 19, spatt: 19, def: 19, spdef: 17},
		{name: "Rotom", id: 479, hp: 52, att: 17, spatt: 20, def: 13, spdef: 15},
		{name: "Uxie", id: 480, hp: 44, att: 15, spatt: 14, def: 18, spdef: 17},
		{name: "Mesprit", id: 481, hp: 44, att: 18, spatt: 17, def: 18, spdef: 13},
		{name: "Azelf", id: 482, hp: 44, att: 18, spatt: 17, def: 18, spdef: 13},
		{name: "Dialga", id: 483, hp: 54, att: 26, spatt: 29, def: 24, spdef: 24},
		{name: "Palkia", id: 484, hp: 59, att: 26, spatt: 29, def: 24, spdef: 24},
		{name: "Heatran", id: 485, hp: 39, att: 26, spatt: 29, def: 24, spdef: 24},
		{name: "Regigigas", id: 486, hp: 48, att: 29, spatt: 19, def: 19, spdef: 19},
		{name: "Giratina", id: 487, hp: 54, att: 17, spatt: 29, def: 19, spdef: 17},
		{name: "Cresselia", id: 488, hp: 54, att: 23, spatt: 21, def: 9, spdef: 25},
		{name: "Phione", id: 489, hp: 29, att: 9, spatt: 9, def: 14, spdef: 9},
		{name: "Manaphy", id: 490, hp: 34, att: 14, spatt: 9, def: 9, spdef: 14},
		{name: "Darkrai", id: 491, hp: 54, att: 14, spatt: 29, def: 15, spdef: 14},
		{name: "Shaymin", id: 492, hp: 34, att: 14, spatt: 14, def: 14, spdef: 14}];
	var tmpPokemonStats = null;

	pokemon.sort(function(a, b) {
		var nameA = a.name.toUpperCase(); // ignore upper and lowercase
		var nameB = b.name.toUpperCase(); // ignore upper and lowercase

		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}

		// names must be equal
		return 0;
	});

	var timerUpdate = function(elapsed) {
		timerLastUpdate = elapsed;
	};

	var updatePlayer = function(pID, player) {
		var player_stats = document.getElementById("player_" + pID + "_stats");

		if (!player_stats || !player) {
			return;
		}

		var index = player["pokemon_index"] || -1;
		var stats = pokemon[index];

		if (!stats) {
			player_stats.innerHTML = "";
			return;
		}

		player_stats.innerHTML = tmpPokemonStats(stats);
	};

	var blankTime = function(t) {
		return typeof(t) === "undefined" || t === "";
	};

	var updateLayout = function (layout) {
		if (!layout) {
			return;
		}

		var timerElements = document.querySelectorAll(".col-time, .track_timer");

		timerElements.forEach(function(element, index) {
			if (layout[element.dataset.property]) {
				element.id = "";

				if (element.tagName === "INPUT") {
					element.value = layout[element.dataset.property];
				} else {
					element.innerHTML = layout[element.dataset.property];
				}
			}
		});

		var data = ["1_1", "1_2", "2_1", "2_2", "3_1", "3_2"];

		for (var i = 0; i < data.length; i++) {
			if (layout["round"+data[i]] && blankTime(layout["time"+data[i]])) {
				Tracker.updateLayout("time"+data[i], Tracker.buildTimerNoFormat(layout["__elapsed__round"+data[i]]));
			}
		}
	};

	var updateLayoutRound = function(round) {
		var timerElements = document.querySelectorAll(".col-time, .track_timer");

		timerElements.forEach(function(element, index) {
			element.id = "";
		});

		if (!round) {
			return;
		}

		var timerElements = document.querySelectorAll("[data-property='time"+round+"_1'], [data-property='time"+round+"_2']");

		timerElements.forEach(function(element, index) {
			element.id = "timer";
		});
	};

	var updateLayoutBestOf = function(bestof) {
		var bo3 = document.getElementById("bestof3");
		var bo5 = document.getElementById("bestof5");

		if (!bo3 || !bo5) {
			return;
		}

		if (bestof == 5) {
			bo5.classList.remove("hidden");
			bo3.classList.add("hidden");
		} else {
			bo5.classList.add("hidden");
			bo3.classList.remove("hidden");
		}
	};

	var updateLayoutTimer = function(timer) {
		if (!timer) {
			return;
		}

		if (timer.isRunning) {
			Tracker.RoomReference.child("layout").once("value", function(data) {
				var layout = data.val();
				var round = 1;

				if (layout !== null) {
					while (blankTime(layout["time"+round+"_1"]) == false && blankTime(layout["time"+round+"_2"]) == false) {
						round += 1;
					}
				}

				Tracker.updateLayout("round", round);
			});
		} else {
			Tracker.RoomReference.child("layout").once("value", function(data) {
				var layout = data.val();

				if (!layout["round"]) {
					return;
				}

				var timerElements = document.querySelectorAll(".col-time, .track_timer");

				timerElements.forEach(function(element, index) {
					element.id = "";

					if (element.tagName === "INPUT") {
						element.value = "";
					} else {
						element.innerHTML = "";
					}
				});

				Tracker.updateLayout("round", null);

				if (blankTime(layout["time"+layout.round+"_1"])) {
					Tracker.updateLayout("time"+layout.round+"_1", Tracker.buildTimerNoFormat(timerLastUpdate));
				}
				
				if (blankTime(layout["time"+layout.round+"_2"])) {
					Tracker.updateLayout("time"+layout.round+"_2", Tracker.buildTimerNoFormat(timerLastUpdate));
				}

				Tracker.resetTimer(true);
			});
		}
	};

	PMD.init = function() {
		var selects = document.querySelectorAll("select[data-property='pokemon_index']");

		selects.forEach(function(select) {
			pokemon.forEach(function(element, index) {
				var option = document.createElement("option");

				option.value = index;
				option.innerHTML = element.name;
				select.appendChild(option);
			});
		})

		tmpPokemonStats = _.template(document.getElementById("tmpPokemonStats").innerHTML);
		Tracker.onPlayerUpdate(updatePlayer);
		Tracker.onLayoutUpdate(updateLayoutTimer, "timer");
		Tracker.onLayoutUpdate(updateLayoutRound, "round");
		Tracker.onLayoutUpdate(updateLayoutBestOf, "bestof");
		Tracker.onLayoutUpdate(updateLayout)
		Tracker.addTimerListener(timerUpdate);
	}
})(window.PMD = window.PMD || {});

Tracker.loaded = function() {
    Tracker.init({
        playerCount: 2,
        additionalLoads: [{
            path: "stat_template.html"
        }],
        freetext: [{
            label: "Best of",
            property: "bestof",
            type: "select",
            options: [{
                text: "3",
                value: 3
            }, {
                text: "5",
                value: 5
            }]
        }]
    }, function() {
        PMD.init();
    });
}