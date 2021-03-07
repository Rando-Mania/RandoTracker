(function(DWR) {
	var cache = null;

	var updatePlayers = function(data) {
		if (!cache || !cache.rom) {
			return;
		}

		var getDataOrCachedAttribute = function(prop, pID) {
			var propName = Tracker.getPropertyAttribute(null, prop, pID);
			var value = null;

			data.forEach(function(p) {
				if (p.property == propName) {
					value = p.value;
				}
			});

			return value || cache[propName];
		}

		for (var pID = 1; pID <= 4; pID++) {
			// Update player stats for this ID
			var level = getDataOrCachedAttribute("level", pID) || 1;
			var build = getDataOrCachedAttribute("build", pID) || 0;
			var weapon = getDataOrCachedAttribute("weapon", pID) || 0;
			var armor = getDataOrCachedAttribute("armor", pID) || 0;
			var shield = getDataOrCachedAttribute("shield", pID) || 0;
			var ring = getDataOrCachedAttribute("ring", pID) || 0;
			var necklace = getDataOrCachedAttribute("necklace", pID) || 0;
			var scale = getDataOrCachedAttribute("scale", pID) || 0;
			var character_name = getDataOrCachedAttribute("character_name", pID) || 0;

			if (level == cache[Tracker.getPropertyAttribute(null, "level", pID)] &&
				build == cache[Tracker.getPropertyAttribute(null, "build", pID)] &&
				weapon == (cache[Tracker.getPropertyAttribute(null, "weapon", pID)] || 0) &&
				armor == (cache[Tracker.getPropertyAttribute(null, "armor", pID)] || 0) &&
				shield == (cache[Tracker.getPropertyAttribute(null, "shield", pID)] || 0) &&
				ring == (cache[Tracker.getPropertyAttribute(null, "ring", pID)] || 0) &&
				necklace == (cache[Tracker.getPropertyAttribute(null, "necklace", pID)] || 0) &&
				scale == (cache[Tracker.getPropertyAttribute(null, "scale", pID)] || 0) &&
				character_name == (cache[Tracker.getPropertyAttribute(null, "character_name", pID)] || 0)) {
				// No player change
				continue;
			}

			if (ring == 0) {
				ring = "ring-no";
			}

			if (necklace == 0) {
				necklace = "necklace-no";
			}

			if (scale == 0) {
				scale == "scale-no";
			}

			// Convert character name to build type
			var name_mod_count = 0;
			var char_mapping_mods = ["gwM'kAQoEU,csIY!","hxNlBRpFV-dtJZ","iyOmCSaqGWeuK)","jzPnDTbrHX?fvL("]
			var characters = Math.min(character_name.length, 4);
			for (var nameindex = 0; nameindex < characters; nameindex++) {
				for (var mod = 0; mod < 4; mod++) {
					if (char_mapping_mods[mod].includes(character_name[nameindex])) {
						name_mod_count += mod;
					}
				}
			}

			// in-game build calc is hp/mp 0, str/hp 1, agl/mp 2, str/agl 3
			// dwr enum is str/hp 0, str/ag 1, hp/mp 2, agl/mp 3
			var buildmap = [2, 0, 3, 1];
			build = buildmap[name_mod_count % 4];

			var updates = {
				build: build,
				level: level,
				hp: cache.rom.hp[level-1],
				mp: cache.rom.mp[level-1],
				str: cache.rom.str[level-1],
				agi: cache.rom.agi[level-1],
				ap: cache.rom.str[level-1]
			};

			// Build modifications
			if (build == 2 || build == 3) {
				updates.str = Math.floor(updates.str * 0.9) + 3;
			}

			if (build == 0 || build == 2) {
				updates.agi = Math.floor(updates.agi * 0.9) + 3;
			}

			if (build == 1 || build == 3) {
				updates.hp = Math.floor(updates.hp * 0.9) + 3;
			}

			if (build == 0 || build == 1) {
				if (updates.mp != 0) {
					updates.mp = Math.floor(updates.mp * 0.9) + 3;
				}
			}

			updates.dp = Math.floor(updates.agi / 2);
			updates.ap = updates.str;

			// Weapons
			if (weapon == 1) {
				updates.ap += 2;
			} else if (weapon == 2) {
				updates.ap += 4;
			} else if (weapon == 3) {
				updates.ap += 10;
			} else if (weapon == 4) {
				updates.ap += 15;
			} else if (weapon == 5) {
				updates.ap += 20;
			} else if (weapon == 6) {
				updates.ap += 28;
			} else if (weapon == 7) {
				updates.ap += 40;
			}

			if (armor == 1) {
				updates.dp += 2;
			} else if (armor == 2) {
				updates.dp += 4;
			} else if (armor == 3) {
				updates.dp += 10;
			} else if (armor == 4) {
				updates.dp += 16;
			} else if (armor == 5) {
				updates.dp += 24;
			} else if (armor == 6) {
				updates.dp += 24;
			} else if (armor == 7) {
				updates.dp += 28;
			}

			if (shield == 1) {
				updates.dp += 4;
			} else if (shield == 2) {
				updates.dp += 10;
			} else if (shield == 3) {
				updates.dp += 20;
			}

			if (ring == 2) {
				updates.ap += 2;
			}

			if (necklace == 2) {
				updates.ap += 10;
				updates.hp = Math.ceil(updates.hp * 0.75);
			}

			if (scale == 2) {
				updates.dp += 2;
			}

			// Spells
			var spellFlags = cache.rom.spells[level-1];

			updates["heal"] = (spellFlags & (0x1 << 0)) !== 0;
			updates["hurt"] = (spellFlags & (0x1 << 1)) !== 0;
			updates["sleep"] = (spellFlags & (0x1 << 2)) !== 0;
			updates["radiant"] = (spellFlags & (0x1 << 3)) !== 0;
			updates["stop"] = (spellFlags & (0x1 << 4)) !== 0;
			updates["outside"] = (spellFlags & (0x1 << 5)) !== 0;
			updates["return"] = (spellFlags & (0x1 << 6)) !== 0;
			updates["repel"] = (spellFlags & (0x1 << 7)) !== 0;
			updates["heal+"] = (spellFlags & (0x1 << 8)) !== 0;
			updates["hurt+"] = (spellFlags & (0x1 << 9)) !== 0;
			updates.mp += "";

			Object.keys(updates).forEach(function(stat, index) {
				data.push({
					property: Tracker.getPropertyAttribute(null, stat, pID),
					value: updates[stat]
				});
			});
		}

		return data;
	};

	var setupPlayerStatListeners = function() {
		var stats = {
			str: {
				bottom: 4,
				low: 10,
				caution: 82,
				high: 90
			},
			agi: {
				bottom: 4,
				low: 10,
				caution: 60,
				high: 72
			},
			hp: {
				bottom: 10,
				low: 24,
				caution: 93,
				high: 101
			},
			mp: {
				bottom: 0,
				low: 8,
				caution: 64,
				high: 104
			},
			ap: {
				bottom: 4,
				low: 10,
				caution: 124,
				high: 132
			},
			dp: {
				bottom: 2,
				low: 5,
				caution: 70,
				high: 86
			}
		};

		Object.keys(stats).forEach(function(stat, index) {
			var elements = document.querySelectorAll("tr-text[property='" + stat + "']");

			elements.forEach(function(currentValue, currentIndex, listObj) {
				var mutationObserver = new MutationObserver(function(mutationList) {
					mutationList.forEach(function(mutation) {
						var target = mutation.target;

						if (target.nodeName === "#text") {
							target = target.parentNode;
						}

						target.classList.remove("stat-bottom","stat-low", "stat-caution", "stat-gg");
						target.parentElement.previousElementSibling.classList.remove("stat-bottom","stat-low", "stat-caution", "stat-gg");

						var value = Number(target.innerHTML);

						if (value === stats[stat].bottom) {
							target.classList.add("stat-bottom");
							target.parentElement.previousElementSibling.classList.add("stat-bottom");
						} else if (value < stats[stat].low) {
							target.classList.add("stat-low");
							target.parentElement.previousElementSibling.classList.add("stat-low");
						} else if (value >= stats[stat].caution && value < stats[stat].high) {
							target.classList.add("stat-caution");
							target.parentElement.previousElementSibling.classList.add("stat-caution");
						} else if (value >= stats[stat].high) {
							target.classList.add("stat-gg");
							target.parentElement.previousElementSibling.classList.add("stat-gg");
						}
					})
				})

				mutationObserver.observe(currentValue, {
					childList: true,
					characterData: true,
					subtree: true
				});
			});
		});
	}

	DWR.attemptAuth = function() {
		var passcode = prompt("Please provide the password");

		Tracker.attemptToBeSuper(passcode, function(result) {
			if (result) {
				DWR.checkIfAuthorized();
			} else {
				alert("Authentication failed");
			}
		});
	};

	DWR.checkIfAuthorized = function() {
		Tracker.isUserSuper(function(result) {
			if (document.getElementById("rom_upload_wrapper") === null) {
				return;
			}

			if (result) {
				document.getElementById("rom_upload_wrapper").style.display = "block";
				document.getElementById("auth_wrapper").style.display = "none";
			} else {
				document.getElementById("rom_upload_wrapper").style.display = "none";
				document.getElementById("auth_wrapper").style.display = "block";
			}
		});
	};

	DWR.init = function(options) {
		if (options) {
			showStatsByDefault = options.showStatsByDefault || false;
		}

		var initialLoad = false;

		document.addEventListener("tr-layout", function(e) {
			if (!e.detail) {
				return;
			}

			cache = e.detail;

			for (var pID = 1; pID <= 4; pID++) {
				var statLabels = document.querySelectorAll("tr-player[player='" + pID + "'] *[property='str'],tr-player[player='" + pID + "'] *[property='agi'],tr-player[player='" + pID + "'] *[property='hp'],tr-player[player='" + pID + "'] *[property='mp']")

				statLabels.forEach(function(currentValue, currentIndex, listObj) {
					currentValue.parentElement.previousElementSibling.classList.remove("build");
				});

				var addBuildTag = function(nodeList) {
					nodeList.forEach(function(currentValue, currentIndex, listObj) {
						currentValue.parentElement.previousElementSibling.classList.add("build");
					});
				}

				var build = cache[Tracker.getPropertyAttribute(null, "build", pID)];

				if (build == 2 || build == 3) {
					//updates.str = Math.floor(updates.str * 0.9) + 3;
				} else {
					addBuildTag(document.querySelectorAll("tr-player[player='" + pID + "'] *[property='str']"));
				}

				if (build == 0 || build == 2) {
					//updates.agi = Math.floor(updates.agi * 0.9) + 3;
				} else {
					addBuildTag(document.querySelectorAll("tr-player[player='" + pID + "'] *[property='agi']"));
				}

				if (build == 1 || build == 3) {
					//updates.hp = Math.floor(updates.hp * 0.9) + 3;
				} else {
					addBuildTag(document.querySelectorAll("tr-player[player='" + pID + "'] *[property='hp']"));
				}

				if (build == 0 || build == 1) {
					//updates.mp = Math.floor(updates.mp * 0.9) + 3;
				} else {
					addBuildTag(document.querySelectorAll("tr-player[player='" + pID + "'] *[property='mp']"));
				}
			}

			if (!initialLoad) {
				initialLoad = true;
				DWR.checkIfAuthorized();
				setupPlayerStatListeners();
				setupAutoPlayControls();
				return;
			}
		});

		Tracker.onUpdateLayout = function(data) {
			data = updatePlayers(data) || data;
			data = updateMonsterStats(data) || data;
			return data;
		};
	};

	var updateMonsterStats = function(data) {
		if (!cache || !cache.rom) {
			return;
		}

		// Monster ID hasn't changed, ignore
		var monster = null;

		data.forEach(function(p) {
			if (p.property == "monster") {
				monster = p.value;
			}
		});

		if (monster == null) {
			return;
		}

		var monsterID = parseInt(monster, 10);
		var monster = cache.rom.monsters[monsterID];
		var updates = {
			monster_hp: monster.hp.toString(),
			monster_agi: monster.agi.toString(),
			monster_ap: monster.ap.toString(),
			monster_dp: monster.dp.toString(),
			monster_dodge: monster.dodge.toString(),
			monster_hurt: monster.hurt.toString(),
			monster_sleep: monster.sleep.toString(),
			monster_stop: monster.stop.toString(),
			monster_exp: monster.experience.toString(),
			monster_gold: monster.gold.toString(),
			monster_name: monster.name.toString(),
			monster_image: "images/monsters/" + monster.image
		};

		var calcChance = function(chance, move) {
			if (chance == 0) {
				return "Fight";
			}

			var temp = "75%";

			if (chance == 1) {
				temp = "25%"
			} else if (chance == 2) {
				temp = "50%";
			}

			temp += " ";

			if (move == 0) {
				temp += "SLEEP";
			} else if (move == 1) {
				temp += "STOPSPELL";
			} else if (move == 2) {
				temp += "HEAL";
			} else if (move == 3) {
				temp += "HEALMORE";
			} else if (move == 4) {
				temp += "HURT";
			} else if (move == 5) {
				temp += "HURTMORE";
			} else if (move == 6) {
				temp += "FIRE";
			} else {
				temp += "DL2 FIRE";
			}

			return temp;
		};

		updates.monster_ai = calcChance(monster.move1Chance, monster.move1) + ", " + calcChance(monster.move2Chance, monster.move2 + 4);

		Object.keys(updates).forEach(function(stat, index) {
			data.push({
				property: stat,
				value: updates[stat]
			});
		});

		return data;
	};

	var loadROM = function(rom) {
		var str = [];
		var agi = [];
		var hp = [];
		var mp = [];
		var spells = [];
		var monsters = [];

		for (var level = 0; level < 30; level++) {
			str[level] = rom[0x60dd + (level * 6)];
			agi[level] = rom[0x60dd + (level * 6) + 1];
			hp[level] = rom[0x60dd + (level * 6) + 2];
			mp[level] = rom[0x60dd + (level * 6) + 3];
			spells[level] = (256 * rom[0x60dd + (level * 6) + 4]) + rom[0x60dd + (level * 6) + 5];
		}

		for (var i = 0; i < 40; i++) {
			var monster = {};
			var startByte = 0x5e5b + (16 * i);

			monster.ap = rom[startByte + 0];
			monster.agi = rom[startByte + 1];
			monster.dp = Math.floor(monster.agi / 2);
			monster.hp = rom[startByte + 2];
			monster.stop = rom[startByte + 4] % 16;
			monster.sleep = Math.floor((rom[startByte + 4] - monster.stop) / 16);
			monster.dodge = rom[startByte + 5] % 16;
			monster.hurt = Math.floor((rom[startByte + 5] - monster.dodge) / 16);
			monster.move2 = Math.floor((rom[startByte + 3] % 16) / 4);
			monster.move2Chance = rom[startByte + 3] % 4;
			monster.move1 = Math.floor(((rom[startByte + 3] - monster.move2) / 16) / 4);
			monster.move1Chance = Math.floor((rom[startByte + 3] - monster.move2) / 16) % 4;
			monster.experience = rom[startByte + 6];
			monster.gold = rom[startByte + 7];
			monsters[i] = monster;
		}

		monsters[0].name = "Slime";
		monsters[1].name = "Red Slime";
		monsters[2].name = "Drakee";
		monsters[3].name = "Ghost";
		monsters[4].name = "Magician";
		monsters[5].name = "Magidrakee";
		monsters[6].name = "Scorpion";
		monsters[7].name = "Druin";
		monsters[8].name = "Poltergeist";
		monsters[9].name = "Droll";
		monsters[10].name = "Drakeema";
		monsters[11].name = "Skeleton";
		monsters[12].name = "Warlock";
		monsters[13].name = "Metal Scorpion";
		monsters[14].name = "Wolf";
		monsters[15].name = "Wraith";
		monsters[16].name = "Metal Slime";
		monsters[17].name = "Specter";
		monsters[18].name = "Wolflord";
		monsters[19].name = "Druinlord";
		monsters[20].name = "Drollmagi";
		monsters[21].name = "Wyvern";
		monsters[22].name = "Rogue Scorpion";
		monsters[23].name = "Wraith Knight";
		monsters[24].name = "Golem";
		monsters[25].name = "Goldman";
		monsters[26].name = "Knight";
		monsters[27].name = "Magiwyvern";
		monsters[28].name = "Demon Knight";
		monsters[29].name = "Werewolf";
		monsters[30].name = "Green Dragon";
		monsters[31].name = "Starwyvern";
		monsters[32].name = "Wizard";
		monsters[33].name = "Axe Knight";
		monsters[34].name = "Blue Dragon";
		monsters[35].name = "Stoneman";
		monsters[36].name = "Armored Knight";
		monsters[37].name = "Red Dragon";
		monsters[38].name = "Dragonlord 1";
		monsters[39].name = "Dragonlord 2";

		monsters[0].image = "slime.png";
		monsters[1].image = "redslime.png";
		monsters[2].image = "drakee.png";
		monsters[3].image = "ghost.png";
		monsters[4].image = "magician.png";
		monsters[5].image = "magic-drakee.png";
		monsters[6].image = "scorpion.png";
		monsters[7].image = "druin.png";
		monsters[8].image = "poltergeist.png";
		monsters[9].image = "droll.png";
		monsters[10].image = "drakeema.png";
		monsters[11].image = "skeleton.png";
		monsters[12].image = "warlock.png";
		monsters[13].image = "metal-scorpion.png";
		monsters[14].image = "wolf.png";
		monsters[15].image = "wraith.png";
		monsters[16].image = "metal-slime.png";
		monsters[17].image = "specter.png";
		monsters[18].image = "wolflord.png";
		monsters[19].image = "druinlord.png";
		monsters[20].image = "drollmagi.png";
		monsters[21].image = "wyvern.png";
		monsters[22].image = "rogue-scorpion.png";
		monsters[23].image = "wraith-knight.png";
		monsters[24].image = "golem.png";
		monsters[25].image = "goldman.png";
		monsters[26].image = "knight.png";
		monsters[27].image = "magi-wyvern.png";
		monsters[28].image = "demon-knight.png";
		monsters[29].image = "werewolf.png";
		monsters[30].image = "green-dragon.png";
		monsters[31].image = "star-wyvern.png";
		monsters[32].image = "wizard.png";
		monsters[33].image = "axe-knight.png";
		monsters[34].image = "blue-dragon.png";
		monsters[35].image = "stoneman.png";
		monsters[36].image = "armored-knight.png";
		monsters[37].image = "red-dragon.png";
		monsters[38].image = "human-dragonlord.png";
		monsters[39].image = "true-dragonlord.png";

		var rom = {
			str: str,
			agi: agi,
			hp: hp,
			mp: mp,
			spells: spells,
			monsters: monsters
		};

		Tracker.updateLayout("rom", rom);
		return true;
	};

	DWR.onROMUpload = function(files) {
		if (files.length === 0) {
			return;
		}

		var file = files[0];
		var reader = new FileReader();

		reader.onloadend = function(event) {
			if (loadROM(new Uint8Array(reader.result))) {
				// Do stuff!
			} else {
				alert("This is not a Dragon Warrior ROM");
			}
		};
		reader.readAsArrayBuffer(file);
	};
})(window.DWR = window.DWR || {});

DWR.init();

// youtube iframe

  var tag = document.createElement('script');
  tag.id = 'iframe-demo';
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  var player;
  function onYouTubeIframeAPIReady() {
	  player = new YT.Player('existing-iframe-example', {
		  events: {
		  'onReady': onPlayerReady,
		  'onStateChange': onPlayerStateChange,
		  }
	  });
  }

  function onPlayerReady(event) {
	  player.setLoop(true);
	  setTimeout( function() {
		  event.target.setShuffle(true);
		  player.playVideoAt(0);
		  player.stopVideo();
	  }, 3000);
  }
  
  function onPlayerStateChange(event) {
	  if (event.data == 0) { // video ended
		  player.setShuffle({'shufflePlaylist' : 1});
	  }
  }

if ('paintWorklet' in CSS) {
	CSS.paintWorklet.addModule('images/paint-worklets.js');
	
	window.CSS.registerProperty({
		name: '--border-color',
		syntax: '<color>',
		inherits: false,
		initialValue: '#fc9838',
	});
}

var dwrlist = [
	"Teaching Dragonlord 2 Hurtmore...",
	"Teaching Drollgonlord 2 <span style='color:red;'>&#10084;</span>...",
	"Resetting COD counter...",
	"Reticulating Slimes...",
	"Pixelating the Dragons...",
	"Shining the Goldmen...",
	"Brushing Drakee's Teeth...",
	"Setting up arrow manipulations...",
	"Counting Bonks...",
	"Splitting the continents...",
	"Sparkover-ing the bridges...",
	"Emptyeye-ing the levels...",
	"Only fools hold <span class='ctrl-button'>B</span>...",
	"An Axe Ghost appears...",
	"Command?<br> Command?<br> Command?",
	"Finding the Red...",
	"Launching the GPS...",
	"Dost thou love me, d?",
	"But thou must."];
  var counter = 0;
  var elem = document.getElementById("changeText");
  var inst = null;

  if (elem !== null) {
  	inst = setInterval(changeText, 10000);
  }

  function changeText() {
	elem.innerHTML = dwrlist[counter];
	counter++;
	if (counter >= dwrlist.length) {
	  counter = 0;
	}
  }

function playerDummyText() {
	Tracker.updateLayoutMultiple([
		{property: '__p1__player-rank', value: '1'},
		{property: '__p1__player-name', value: 'AnakinSkywalker'},
		{property: '__p1__player-pronoun', value: 'he/him'},		
		{property: '__p1__player-record', value: '2-3'},
		{property: '__p1__player-cod', value: 15},
		{property: '__p1__toggle-speaker', value: 1},
		{property: '__p1__player-final', value: '1:23:45'},
		{property: '__p1__toggle-winner', value: 1},
		
		{property: '__p2__player-rank', value: '4'},
		{property: '__p2__player-name', value: 'Yoda'},
		{property: '__p2__player-pronoun', value: 'they/them'},		
		{property: '__p2__player-record', value: '1-4'},
		{property: '__p2__player-cod', value: 66},
		{property: '__p2__toggle-speaker', value: 1},
		{property: '__p2__player-final', value: '1:23:45'},
		{property: '__p2__toggle-winner', value: 1},
		
		{property: '__p3__player-rank', value: '2'},
		{property: '__p3__player-name', value: 'AlbusPercivalWulfricBrianDumbledor'},
		{property: '__p3__player-pronoun', value: 'she/her'},		
		{property: '__p3__player-record', value: '2-3'},
		{property: '__p3__player-cod', value: 5},
		{property: '__p3__toggle-speaker', value: 1},
		{property: '__p3__player-final', value: '1:23:45'},
		{property: '__p3__toggle-winner', value: 1},
		
		{property: '__p4__player-rank', value: 6},
		{property: '__p4__player-name', value: 'SeverusSnape'},
		{property: '__p4__player-pronoun', value: 'she/her'},		
		{property: '__p4__player-record', value: '2-3'},
		{property: '__p4__player-cod', value: 5},
		{property: '__p4__toggle-speaker', value: 1},
		{property: '__p4__player-final', value: '1:23:45'},
		{property: '__p4__toggle-winner', value: 1},
	]);
}
function staffDummyText() {
	Tracker.updateLayoutMultiple([
		{property: 'commentators', value: 'Chewbacca\nJar Jar Binks'},
		{property: 'restreamers', value: 'R2D2'},
		{property: 'trackers', value: 'C3PO, BB-8'}
	]);
}

var setupAutoPlayControls = function(){

	var panelsPlayButton = document.getElementById("start_auto_play_panels");
	var panelsStopButton = document.getElementById("stop_auto_play_panels");

	var statsButton = document.querySelector("[for='stats']");
	var itemsButton = document.querySelector("[for='items']");
		
	var autoPanelsInterval;

	function autoPlayPanels() {
		Tracker.getLayoutData(function(data) {
			if (data["player-panels"] == "items") {
				Tracker.updateLayout("player-panels", "stats");
				statsButton.classList.add("panel-playing");
				itemsButton.classList.remove("panel-playing");
			} else {
				Tracker.updateLayout("player-panels", "items");
				statsButton.classList.remove("panel-playing");
				itemsButton.classList.add("panel-playing");
			}
		});
	}

	var autoPanelsInterval = 0;

	function setAutoPanelsInterval(){
		// 30 seconds? (should be easy to change) per panel
		// use timer to sync across instances???
		autoPanelsInterval = setInterval(autoPlayPanels, 30 * 1000);
	}

	function clearAutoPanelsInterval() {
		clearInterval(autoPanelsInterval);
	}

	panelsPlayButton.addEventListener("click", function (){
		setAutoPanelsInterval();
		autoPlayPanels();
		this.style.display = "none";
		panelsStopButton.style.display = "flex";
	});

	panelsStopButton.addEventListener("click", function(){
		clearAutoPanelsInterval();
		removePlayingClass();
		this.style.display = "none";
		panelsPlayButton.style.display = "flex";
	});

	function removePlayingClass(){
		statsButton.classList.remove("panel-playing");
		itemsButton.classList.remove("panel-playing");
	}

	statsButton.addEventListener("click", function(){
		clearInterval(autoPanelsInterval);
		removePlayingClass();
		panelsStopButton.style.display = "none";
		panelsPlayButton.style.display = "flex";
	});

	itemsButton.addEventListener("click", function(){
		clearInterval(autoPanelsInterval);
		removePlayingClass();
		panelsStopButton.style.display = "none";
		panelsPlayButton.style.display = "flex";
	});
}

var playerInfo = [
	{
		displayName: "AliGerbrap",
		twitchName: "AliGerBrap",
		pronoun: "he/him/il"
	},
	{
		displayName: "Angel_FM",
		twitchName: "Angel_FM",
		pronoun: ""
	},
]

/* <datalist id="name_options">
    <option twitch="apexcorvid" pronoun="">apexcorvid</option>
    <option twitch="ArchfieldMonk" pronoun="he/him">ArchfieldMonk</option>
    <option twitch="" pronoun="">AsmadiGames</option>
    <option twitch="betastrep" pronoun="he/him">betastrep</option>
    <option twitch="big__slammu" pronoun="">Big_Slammu</option>
    <option twitch="Bobski021" pronoun="He/Him/His">Bobski</option>
    <option twitch="" pronoun="">Braxous_Muse</option>
    <option twitch="brianwilliams42" pronoun="He/Him">brianwilliams42</option>
    <option twitch="" pronoun="">CaptainGreen7</option>
    <option twitch="" pronoun="">cdinprov</option>
    <option twitch="Centroid41" pronoun="he/him">Centroid41</option>
    <option twitch="" pronoun="">Couch_23</option>
    <option twitch="" pronoun="">CrimsonAvix</option>
    <option twitch="" pronoun="">CubegodHS</option>
    <option twitch="Cyberdark86" pronoun="he/him">Cyberdark86</option>
    <option twitch="DiabeetusThe2nd" pronoun="">DiabeetusThe2nd</option>
    <option twitch="dk9146" pronoun="">dk9146</option>
    <option twitch="mk_punisheredge" pronoun="He/him">Edge</option>
    <option twitch="" pronoun="">Edgestream</option>
    <option twitch="ElmoreStJames" pronoun="he/him">Elmore</option>
    <option twitch="" pronoun="">fcoughlin</option>
    <option twitch="FearonBurgundy" pronoun="He/him/they/them">FearonBurgundy</option>
    <option twitch="" pronoun="">fryteeth</option>
    <option twitch="gameboyf9" pronoun="he/him">gameboyf9</option>
    <option twitch="" pronoun="">garionoldwolf</option>
    <option twitch="Guelph35" pronoun="he/him">Guelph35</option>
    <option twitch="" pronoun="">HighRofellos</option>
    <option twitch="Highspirits" pronoun="he/him">Highspirits</option>
    <option twitch="IB_Karma" pronoun="He/him">IBKarma</option>
    <option twitch="Idonthaveananvil" pronoun="">Idonthaveananvil</option>
    <option twitch="" pronoun="">Jackimus</option>
    <option twitch="JanusZeal6" pronoun="they/them">JanusZeal</option>
    <option twitch="" pronoun="">jjschmidt77</option>	
    <option twitch="jkoper" pronoun="he">jkoper</option>
    <option twitch="" pronoun="">Jman</option>
    <option twitch="" pronoun="">kaiten619</option>
    <option twitch="" pronoun="">KamionRenokai</option>
    <option twitch="Kigalas" pronoun="he/him">Kigalas</option>
    <option twitch="Kitsanth" pronoun="">Kitsanth</option>
    <option twitch="LordoftheSynth" pronoun="">LordoftheSynth</option>
    <option twitch="" pronoun="">LoZCardsfan</option>
    <option twitch="Marashu_Online" pronoun="He/Him/His">Marashu</option>
    <option twitch="" pronoun="">Math_Girl718</option>
    <option twitch="" pronoun="">mcgrew</option>
    <option twitch="" pronoun="">MeleeWizard</option>
    <option twitch="MisterHomes" pronouns="He/Him">MisterHomes</option>
    <option twitch="MonsieurSlime" pronoun="he/him">MonsieurSlime</option>
    <option twitch="" pronoun="">NESCardinality</option>
    <option twitch="" pronoun="">Niamek</option>
    <option twitch="Nimanva" pronoun="">Nimanva</option>
    <option twitch="Juyzal" pronoun="">nycguy (juyzal)</option>
    <option twitch="" pronoun="">onefineday</option>
    <option twitch="" pronoun="">OPTLawyer</option>
    <option twitch="" pronoun="">Pelador</option>
    <option twitch="ryguy3745">ryguy3745</option>
    <option twitch="SassageLink83" pronoun="He/him">SassageLink</option>
    <option twitch="shatty" pronoun="he/him">shatty</option>
    <option twitch="" pronoun="">ShneekeyTheLost</option>
    <option twitch="Shoobinator" pronoun="him">Shoobinator</option>
    <option twitch="" pronoun="">sigmafan</option>
    <option twitch="Smashy" pronoun="he">Smashy</option>
    <option twitch="" pronoun="">Sparkover</option>
    <option twitch="Stags28" pronoun="he/him/his">Stags28</option>
    <option twitch="" pronoun="">The_Greenleaf_Effect</option>
    <option twitch="" pronoun="">theamusedminiature</option>
    <option twitch="" pronoun="">thehangrycanuck</option>
    <option twitch="theseawolf1" pronoun="He/Him">theseawolf1</option>
    <option twitch="Thilotilo" pronoun="he/him">Thilotilo</option>
    <option twitch="TristalMTG" pronoun="he/him">TristalMTG</option>
    <option twitch="" pronoun="">up2ng</option>
    <option twitch="Ursinedasyure" pronoun="she/her">Ursinedasyure</option>
    <option twitch="VaeluV" pronoun="He/Him/His">VaeluV</option>
    <option twitch="" pronoun="">Vriaeliss</option>
    <option twitch="Xarnax42" pronoun="he/him">Xarnax42</option>
    <option twitch="YakkoWakko20" pronoun="He/Him">YakkoWakko20</option>
    <option twitch="Zman050778" pronoun="He/him">Z</option>
</datalist> */