(function(Tracker) {
	const regex = /^(.*?)[\_\.]/g;

	var rootPath = regex.exec(location.pathname)[1];
	var databaseGameName = "games" + rootPath;
	var databaseRoomName = "";
	var tempURLCode = "";

	{
		var queryString = window.location.search.substring(1);
		var params = queryString.split("&");

		for (var i = 0; i < params.length; i++) {
			var val = params[i].split("=");

			if (val[0] === "room") {
				databaseRoomName = val[1];
			} else if (val[0] === "passcode") {
				tempURLCode = val[1];
			}
		}
	}

	var referenceName = databaseGameName + "/" + databaseRoomName;
	var authAttempted = false;
	var roomIsInitialized = false;
	var lastElapsedTimer = 0;
	var lastServerTimeTimer = 0;
	var isTimerRunning = false;
	var timerElapsed = 0;
	var timerLastUpdate = 0;
	var timerListeners = [];

	var freetextFields = [];

	// Used for dialog tracking
	var iconToUpdate = null;
	var playerToUpdate = null;
	var shownDialog = null;

	Tracker.RoomReference = null;
	Tracker.uID = null;
	Tracker.PlayerCount = 0;

	var updateLayoutIcon = function(element, value, key) {
		// Doesn't appear to need unique logic (yet)
		updatePlayerIcon(element, value, key);
	};

	var updatePlayerIcon = function(element, value, key) {
		if (element.parentNode.classList.contains("dialog")) {
			// Dialog element, so ignore
			return;
		}

		// Try to set child if they exist (img src)
		var el = element.firstElementChild;

		if (el === null || element.tagName === "SELECT") {
			el = element;
		}

		// It's a timestamp, so display the time it represents
		if (key && key.indexOf("__elapsed__") >= 0) {
			value = Tracker.buildTimerNoFormat(value);
		}

		if (typeof(value) === "boolean") {
			if (element.dataset.value === value) {
				return;
			}

			if (value) {
				if (typeof(element.dataset.onImage) !== "undefined") {
					el.src = element.dataset.onImage;
				} else if (typeof(element.dataset.classToggle) !== "undefined") {
					el.classList.add(element.dataset.classToggle);
				}
			} else {
				if (typeof(element.dataset.offImage) !== "undefined") {
					el.src = element.dataset.offImage;
				} else if (typeof(element.dataset.classToggle) !== "undefined") {
					el.classList.remove(element.dataset.classToggle);
				}
			}
		} else {
			if (el.tagName === "IMG") {
				el.src = value;
			} else if (el.tagName === "SELECT") {
				el.value = value;
			} else if (el.tagName === "INPUT") {
				el.value = value;
			} else if (el.tagName === "TEXTAREA") {
				el.textContent = value;
			} else {
				el.textContent = value;

				var hide = !value && !el.dataset.alwaysVisible;

				if (hide) {
					el.classList.add("hidden");
				} else {
					el.classList.remove("hidden");
				}
			}
		}

		element.dataset.value = value;
	};

	var updatePlayerLabel = function(element, value) {
		var label = element.querySelector(".label");

		if (label !== null) {
			if (label.parentNode.classList.contains("dialog-icon")) {
				// Dialog element, so ignore
				return;
			}

			label.textContent = value;
		}
	};

	var updateLayout = function(snapshot) {
		if (snapshot === null) {
			return;
		}

		Object.keys(snapshot).forEach(function(key, index) {
			var query = document.querySelectorAll("[data-property='" + key + "']");

			if (query.length === 0) {
				return;
			}

			query.forEach(function(el) {
				updateLayoutIcon(el, snapshot[key], key);
			});
		});
	};

	var updatePlayer = function(playerID, snapshot) {
		var updateName = function(playerID, value) {
			var elPlayer = document.getElementById("settings_player_" + playerID + "_name");

			if (elPlayer !== null) {
				if (typeof(value) === "undefined") {
					elPlayer.value = "";
				} else {
					elPlayer.value = value;
				}
			}

			elPlayer = document.querySelectorAll("#player_name_" + playerID);

			elPlayer.forEach(function(el) {
				if (typeof(value) === "undefined") {
					el.textContent = "";
				} else {
					el.textContent = value;
				}
			});
		};

		var updateSpeaker = function(playerID, value) {
			var elSpeaker = document.getElementById("settings_speaker_" + playerID);

			if (elSpeaker !== null) {
				elSpeaker.checked = value ? true : false;
			}

			elSpeaker = document.getElementById("player_speaker_" + playerID);

			if (elSpeaker !== null) {
				if (value === false) {
					elSpeaker.classList.add("hidden");
				} else {
					elSpeaker.classList.remove("hidden");
				}
			}
		};

		var updateFinal = function(playerID, value) {
			var elFinal = document.getElementById("settings_final_" + playerID);

			if (elFinal !== null) {
				if (typeof(value) === "undefined") {
					elFinal.value = "";
				} else {
					elFinal.value = value;
				}
			}

			elFinal = document.getElementById("player_final_" + playerID);

			if (elFinal !== null) {
				if (typeof(value) === "undefined" || value === "") {
					elFinal.textContent = "";
					elFinal.classList.add("hidden");

					if (elFinal.parentNode.dataset.finalHide) {
						elFinal.parentNode.classList.add("hidden");
					}
				} else {
					elFinal.textContent = value;
					elFinal.classList.remove("hidden");

					if (elFinal.parentNode.dataset.finalHide) {
						elFinal.parentNode.classList.remove("hidden");
					}
				}
			}
		};

		var player = snapshot.val();

		if (player === null) {
			var elements = document.querySelectorAll("[data-toggle][data-player='" + playerID + "']");

			if (elements !== null) {
				elements.forEach(function(currentValue, currentIndex, listObj) {
					updatePlayerIcon(currentValue, false, "");
				});
			}

			updateName(playerID, "");
			updateSpeaker(playerID, false);
			updateFinal(playerID, "");
			return;
		}

		Object.keys(player).forEach(function(key, index) {
			if (key === "name") {
				updateName(playerID, player.name);
			} else if (key === "speaker") {
				updateSpeaker(playerID, player.speaker);
			} else if (key === "final") {
				updateFinal(playerID, player.final);
			} else if (key.startsWith("__label__")) {
				var actualKey = key.substring(9);
				var query = document.querySelectorAll("[data-player='" + playerID + "'][data-property='" + actualKey + "']");

				if (query.length === 0) {
					return;
				}

				query.forEach(function(el) {
					updatePlayerLabel(el, player[key]);
				});
			} else {
				var query = document.querySelectorAll("[data-player='" + playerID + "'][data-property='" + key + "']");

				if (query.length === 0) {
					return;
				}

				query.forEach(function(el) {
					updatePlayerIcon(el, player[key], key);
				});
			}
		});
	};

	var updateTimer = function() {
		if (isTimerRunning === false) {
			return;
		}

		var update = new Date();
		timerElapsed += update - timerLastUpdate;
		timerLastUpdate = update;
		displayTimer(timerElapsed);
	};

	var displayTimer = function(elapsed) {
		timerListeners.forEach(function(currentValue, currentIndex, listObj) {
			currentValue(elapsed);
		});

		var elTimers = document.querySelectorAll("#timer");

		elTimers.forEach(function(el) {
			if (el.tagName === "INPUT") {
				el.value = Tracker.buildTimerNoFormat(elapsed);
			} else {
				el.innerHTML = Tracker.buildTimer(elapsed);
			}
		});
	};

	var updateTimerSettingsUI = function() {
		if (isTimerRunning) {
			document.getElementById("settings-timer-stop").classList.remove("hidden");
			document.getElementById("settings-timer-start").classList.add("hidden");
		} else {
			document.getElementById("settings-timer-stop").classList.add("hidden");
			document.getElementById("settings-timer-start").classList.remove("hidden");
		}
	};

	var setupListeners = function() {
		for (var i = 1; i <= Tracker.PlayerCount; i++) {
			Tracker.RoomReference.child("players").child(i).on("value", function(pID) {
				return function(snapshot) {
					updatePlayer(pID, snapshot);
				}
			}(i));
		}

		Tracker.RoomReference.child("owner").on("value", function (data) {
			roomIsInitialized = !!data.val();
		});

		Tracker.RoomReference.child("layout").on("value", function (data) {
			var value = data.val();

			updateLayout(value);
		});

		Tracker.RoomReference.child("layout").child("commentators").on("value", function (data) {
			var value = data.val();
			var elCommentators = document.getElementById("settings_commentators");

			elCommentators.value = value;

			elCommentators = document.getElementById("commentators");

			if (elCommentators !== null) {

				if (value === null) {
					elCommentators.innerText = "";
				} else {
					elCommentators.innerText = value;
				}
			}
		});

		Tracker.RoomReference.child("layout").child("restreamer").on("value", function (data) {
			var value = data.val();
			var elRestreamer = document.getElementById("settings_restreamer");

			elRestreamer.value = value;
			elRestreamer = document.getElementById("restreamer");

			if (elRestreamer !== null) {
				if (value === null) {
					elRestreamer.innerText = "";
				} else {
					elRestreamer.innerText = value;
				}
			}
		});

		Tracker.RoomReference.child("layout").child("trackers").on("value", function (data) {
			var value = data.val();
			var elTracker = document.getElementById("settings_tracker");

			elTracker.value = value;
			elTracker = document.getElementById("trackers");

			if (elTracker !== null) {
				if (value === null) {
					elTracker.innerText = "";
				} else {
					elTracker.innerText = value;
				}
			}
		});

		Tracker.RoomReference.child("layout").child("timer").on("value", function (data) {
			var elTimer = document.getElementById("settings_timer");
			var val = data.val();

			if (val === null) {
				lastElapsedTimer = 0;
				lastServerTimeTimer = 0;
				elTimer.disabled = false;
				isTimerRunning = false;
				displayTimer(0);
			} else {
				lastElapsedTimer = val.elapsed;
				lastServerTimeTimer = val.serverTime;
				elTimer.disabled = val.serverTime != 0;

				if (isTimerRunning === false && val.isRunning) {
					Tracker.getServerTime().then(function(data) {
						timerElapsed = val.elapsed + (data.val() - val.serverTime);
						timerLastUpdate = new Date();
						isTimerRunning = true;
						displayTimer(timerElapsed);
						updateTimerSettingsUI();
					});
				} else if (val.isRunning === false) {
					isTimerRunning = false;
					timerElapsed = val.elapsed;
					displayTimer(timerElapsed);
				}
			}

			updateTimerSettingsUI();
		});
	};

	var createRoom = function() {
		Tracker.RoomReference.once("value", function(data) {
			if (data.val() !== null) {
				// Room already exists.
				return;
			}

			var players = {};

			for (var i = 1; i <= Tracker.PlayerCount; i++) {
				players[i] = {
					name: "",
					speaker: false,
					final: ""
				};
			}

			var auth_keys = {}
			auth_keys[tempURLCode] = Tracker.uID;

			var data = {
				owner: Tracker.uID,
				players: players,
				layout: {
					commentators: "",
					timer: {
						elapsed: 0,
						serverTime: 0,
						isRunning: false
					}
				},
				auth_keys: auth_keys
			};

			if (typeof(Tracker.createRoomLayout) !== "undefined") {
				Tracker.createRoomLayout(data);
			}

			Tracker.RoomReference.set(data);
		});
	};

	var generateCopyFromElements = function() {
		var elements = document.querySelectorAll("[data-copy-from]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			var destination = currentValue;
			var source = document.querySelector(destination.dataset.copyFrom);

			if (source === null) {
				console.log("Unable to copy-from " + destination.dataset.copyFrom);
				return;
			};

			Array.from(source.children).forEach(function(child) {
				destination.appendChild(child.cloneNode(true));
			});
		});
	};

	var generateRepeatElements = function() {
		var elements = document.querySelectorAll("[data-repeat]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			var source = currentValue;
			var offset = 0;

			if (typeof(currentValue.dataset.index) !== "undefined") {
				offset = Number(currentValue.dataset.index);
			} else {
				source.dataset.index = 0;
			}

			for (var i = 1; i < currentValue.dataset.repeat; i++) {
				var clone = currentValue.cloneNode(true);

				clone.dataset.index = i + offset;
				source.insertAdjacentElement("afterend", clone);
				source = clone;
			}
		});
	};

	var generateIconImages = function() {
		var elements = document.querySelectorAll("[data-image]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			var img = document.createElement("img");

			img.src = currentValue.dataset.image;
			currentValue.appendChild(img);
		});
	};

	var generateIconLabels = function() {
		var elements = document.querySelectorAll("[data-label-top]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			var span = document.createElement("span");

			span.classList.add("label-top");
			span.classList.add("label");

			if (typeof(currentValue.dataset.label) !== "undefined") {
				span.textContent = currentValue.dataset.label;
			}

			currentValue.appendChild(span);
		});

		elements = document.querySelectorAll("[data-label-bottom]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			var span = document.createElement("span");

			span.classList.add("label-bottom");
			span.classList.add("label");

			if (typeof(currentValue.dataset.label) !== "undefined") {
				span.textContent = currentValue.dataset.label;
			}

			currentValue.appendChild(span);
		});
	};

	var propogateChildPlayer = function() {
		var elements = document.querySelectorAll("[data-child-player]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			var player = currentValue.dataset.childPlayer;

			Array.from(currentValue.children).forEach(function(child) {
				child.dataset.player = player;
			});
		});
	};

	var loadAdditionalFiles = function(files, callback) {
		var responseCount = files.length;

		for (var i = 0; i < files.length; i++) {
			var file = files[i];

			var request = new XMLHttpRequest();

			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {
					var parser = new DOMParser();
					var parsedElements = parser.parseFromString(request.responseText, "text/html");

					while (parsedElements.body.children.length > 0) {
						if (!file.parentElementQuery) {
							document.body.appendChild(parsedElements.body.children[0]);
						} else {
							document.querySelector(file.parentElementQuery).appendChild(parsedElements.body.children[0]);
						}
					}

					if (file.callback) {
						file.callback();
					}

					responseCount--;

					if (responseCount === 0) {
						callback();
					}
				}
			};

			request.open("GET", file.path, true);
			request.send();
		}

		if (responseCount === 0) {
			callback();
		}
	};

	var addToggleListeners = function() {
		var elements = document.querySelectorAll("[data-toggle]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			currentValue.addEventListener("click", function(event) {
				if (this.dataset.player) {
					Tracker.togglePlayerIcon(this);
				} else {
					Tracker.toggleLayoutIcon(this);
				}
			});
		});
	};

	var addSetPropListeners = function() {
		var elements = document.querySelectorAll("[data-set-prop]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			if (currentValue.tagName === "SELECT") {
				currentValue.addEventListener("change", function(event) {
					if (this.dataset.player) {
						Tracker.setPlayerIcon(this, this.value);
					} else {
						Tracker.setLayoutIcon(this, this.value);
					}
				});
			} else if (currentValue.tagName === "INPUT") {
				currentValue.addEventListener("input", function(event) {
					if (this.dataset.player) {
						Tracker.setPlayerIcon(this, this.value);
					} else {
						Tracker.setLayoutIcon(this, this.value);
					}
				});
			} else {
				currentValue.addEventListener("click", function(event) {
					if (this.dataset.player) {
						Tracker.setPlayerIcon(this);
					} else {
						Tracker.setLayoutIcon(this);
					}
				});
			}
		});
	};

	var addOpenDialogListeners = function() {
		var elements = document.querySelectorAll("[data-open-dialog]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			currentValue.addEventListener("click", function(event) {
				if (this.dataset.player) {
					Tracker.openPlayerDialog(this);
				} else {
					Tracker.openLayoutDialog(this);
				}
			});
		});
	};

	var addResizeListeners = function() {
		var elements = document.querySelectorAll("[data-scale-to-fit]");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			var mutationObserver = new MutationObserver(function(mutationList) {
				mutationList.forEach(function(mutation) {
					var target = mutation.target;

					if (target.nodeName === "#text") {
						target = target.parentNode;
					}

					var finalTransform = target.style.transform;

					if (finalTransform.indexOf("scaleX") !== -1) {
						finalTransform = finalTransform.replace(/scaleX\(.*?\) */g, "");
					}

					if (target.scrollWidth > target.offsetWidth) {
						var scaleAmount = target.offsetWidth / target.scrollWidth;
						var marginAmount = scaleAmount * ((target.offsetWidth - target.scrollWidth) / 2);

						finalTransform += " scaleX(" + scaleAmount + ") ";
						target.style.marginLeft = marginAmount + "px";
					} else {
						finalTransform += " scaleX(1) ";
						target.style.marginLeft = 0;
					}

					target.style.transform = finalTransform;
				});
			});

			mutationObserver.observe(currentValue, {
				childList: true,
				characterData: true,
				subtree: true
			});
		});
	};

	Tracker.buildTimerWithPadding = function(elapsed) {
		var time = Tracker.timeToTimer(elapsed);
		var value = "";

		var spanWrap = function(text) {
			return "<span>" + text.split("").join("</span><span>") + "</span>";
		}

		value = spanWrap(time.hours) + "<span class='colon'>:</span>" + spanWrap(("00" + time.minutes).slice(-2)) + "<span class='colon'>:</span>" + spanWrap(("00" + time.seconds).slice(-2)) + "<span class='dot'>.</span>";

		return value + "<span class='ms'>" + time.ms.substring(0, 1) + "</span>";
	};

	Tracker.buildTimer = function(elapsed) {
		var time = Tracker.timeToTimer(elapsed);
		var value = "";

		var spanWrap = function(text) {
			return "<span>" + text.split("").join("</span><span>") + "</span>";
		}

		if (time.hours >= 1) {
			value = spanWrap(time.hours) + "<span class='colon'>:</span>" + spanWrap(time.minutes) + "<span class='colon'>:</span>" + spanWrap(time.seconds) + "<span class='dot'>.</span>";
		} else if (time.minutes >= 1) {
			value = spanWrap(time.minutes) + "<span class='colon'>:</span>" + spanWrap(time.seconds) + "<span class='dot'>.</span>";
		} else {
			value = "<span class='colon'>:</span>" + spanWrap(time.seconds) + "<span class='dot'>.</span>";
		}

		return value + "<span class='ms'>" + time.ms.substring(0, 1) + "</span>";
	};

	Tracker.buildTimerNoFormat = function(elapsed) {
		var span = document.createElement("span");

		span.innerHTML = Tracker.buildTimer(elapsed);
		return span.textContent || span.innerText;
	};

	Tracker.timeToTimer = function(ms) {
		if (ms === null || ms === "") {
			ms = 0;
		}

		var x = ms / 1000;
	    ms = ('000' + ms % 1000).slice(-3);
	    var seconds = ('00' + Math.floor(x % 60)).slice(-2);
	    x /= 60;
	    var minutes = ('00' + Math.floor(x % 60)).slice(-2);
	    x /= 60;
	    var hours = ('0' + Math.floor(x % 24)).slice(-1);

	    if (hours <= 0 && minutes < 10) {
	    	minutes = minutes.slice(-1);
	    }

	    return {hours: hours, minutes: minutes, seconds: seconds, ms: ms};
	};

	Tracker.timerToTimeValue = function(timer) {
		var ms = 0;

		if (timer === null || timer === "") {
			timer = "0:00:00";
		}

		if (timer.indexOf(".") !== -1) {
			var result = timer.split(".");

			timer = result[0];
			ms = Number((result[1] + "000").substring(0,3));
		}

		timer = "Jan 1, 1970 " + timer;

		var date = new Date(timer);
		return (date.getHours()*3600000) +
			   (date.getMinutes()*60000) +
			   (date.getSeconds()*1000) +
			   ms;
	};

	Tracker.attemptToBeSuper = function(passcode, callback) {
		firebase.database().ref("/admin/authorized").child(Tracker.uID).set(passcode, function(error) {
			console.log(error);
			callback(!error);
		});
	};

	Tracker.isUserSuper = function(callback) {
		if (Tracker.uID === null) {
			console.log("Unable to check if user is super.  No uID assigned.");
			callback(false);
			return;
		}

		firebase.database().ref("/admin/authorized").child(Tracker.uID).once("value", function(data) {
			callback(data.val() != null);
		}).catch(function(error) {
			callback(false);
		});
	};

	Tracker.init = function(options, callback) {
		if (databaseRoomName === "") {
			alert("Please enter a valid room.");
			window.location = window.location.origin;
			return;
		}

		var enableComsLayout = false;
		var additionalLoads = []

		if (typeof(options) === "number") {
			Tracker.PlayerCount = options;
		} else {
			Tracker.PlayerCount = options.playerCount;

			if (options.enableComsLayout) {
				enableComsLayout = true;
			}

			if (options.freetext) {
				freetextFields = options.freetext;
			}

			if (options.additionalLoads) {
				additionalLoads = options.additionalLoads;
			}
		}

		loadAdditionalFiles(additionalLoads, function() {
			generateCopyFromElements();

			generateRepeatElements();

			generateIconImages();

			generateIconLabels();

			propogateChildPlayer();

			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					var setup = function(user) {
						Tracker.uID = user.uid;
						Tracker.RoomReference = firebase.database().ref(referenceName);
						createRoom();
						setupListeners();
						addToggleListeners();
						addSetPropListeners();
						addOpenDialogListeners();
						addResizeListeners();
						
						if (typeof(callback) !== "undefined") {
							callback();
						}
					};
					var checkForTemp = function(user, callback) {
						if (tempURLCode === "") {
							alert("Not authorized.");
							location.href = location.protocol.concat("//").concat(window.location.host);
							return;
						}

						firebase.database().ref(referenceName).child("auth_keys").once("value", function (keysData) {
							var keys = keysData.val();

							if (typeof(keys[tempURLCode]) !== "undefined") {
								callback(user);
							} else {
								alert("Invalid temporary URL.");
								location.href = location.protocol.concat("//").concat(window.location.host);
							}
						});
					};

					if (user.isAnonymous || typeof(user.email) === "undefined" || user.email === null) {
						checkForTemp(user, setup);
						return;
					}

					firebase.database().ref("/users").child(user.email.replace(new RegExp("\\.", "g"), "_")).once("value", function (data) {
						var dbData = data.val();
						var allowed = dbData.isApproved || dbData.isAdmin;

						if (!allowed) {
							checkForTemp(user, setup);
							return;
						}

						setup(user);
					}).catch(function (error) {
						alert("Login not authorized.");
						location.href = location.protocol.concat("//").concat(window.location.host);
					});
				} else {
					if (authAttempted) {
						return;
					}

					authAttempted = true;
					firebase.auth().signInAnonymously().catch(function(error) {
						console.log(error);
					});
				}
			});

			var request = new XMLHttpRequest();

			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {
					var parser = new DOMParser();
					var parsedElement = parser.parseFromString(request.responseText, "text/html");

					document.body.appendChild(parsedElement.body);

					for (var i = Tracker.PlayerCount+1; i <= 4; i++) {
						// Hide unused player fields in settings
						document.getElementById("settings-player-" + i).style.display = "none";
					}

					if (enableComsLayout) {
						document.getElementById("settings-coms-layout").classList.remove("hidden");
					}

					if (freetextFields.length > 0) {
						var freetextContainer = document.getElementById("settings-freetext");

						freetextContainer.classList.remove("hidden");

						freetextFields.forEach(function(el) {
							var input;
							var p = document.createElement("p");
							p.textContent = el.label;

							if (el.type === "checkbox") {
								console.log("checkbox freetext not supported.  yet!");
							} else if (el.type === "select") {
								input = document.createElement("select");

								el.options.forEach(function(opt) {
									var option = document.createElement("option");
									option.value = opt.value;
									option.textContent = opt.text;
									input.appendChild(option);
								});

								input.onchange = function() {
									Tracker.updateLayout(el.property, this.value);
								};
							} else if (el.type === "button") {
								input = document.createElement("button");

								input.textContent = el.text;
								input.onclick = el.event;
							} else {
								if (el.type === "textarea") {
									input = document.createElement("textarea");

									if (!el.rows) {
										input.rows = 2;
									} else {
										input.rows = el.rows;
									}
								} else {
									input = document.createElement("input");
									input.type = "text";
								}

								if (el.onblur) {
									input.onblur = function() {
										Tracker.updateLayout(el.property, this.value);
									};
								} else {
									input.oninput = function() {
										Tracker.updateLayout(el.property, this.value);
									};
								}
							}

							input.dataset.property = el.property;
							p.appendChild(input);
							freetextContainer.appendChild(p);
						});
					}
				}
			};
			request.open("GET", "../settings.html", true);
			request.send();
			setInterval(updateTimer, 50);
		});
	}

	Tracker.closeRoom = function() {
		if (window.confirm("Are you sure to want to close/delete the room?") === false) {
			return;
		}

		Tracker.RoomReference.set({});
		roomIsInitialized = false;
	};

	Tracker.showSettings = function(button) {
		var elSettings = document.getElementById("settings");

		if (elSettings === null) {
			return;
		}

		if (!elSettings.style.display || elSettings.style.display === "none") {
			elSettings.style.display = "initial";
			button.classList.add("active");
		} else {
			elSettings.style.display = "none";
			button.classList.remove("active");
		}
	};

	Tracker.playerNameUpdated = function(playerID) {
		var elPlayer = document.getElementById("settings_player_" + playerID + "_name");

		Tracker.RoomReference.child("players").child(playerID).child("name").set(elPlayer.value);
	};

	Tracker.playerFinalUpdated = function(playerID) {
		var elFinal = document.getElementById("settings_final_" + playerID);

		Tracker.RoomReference.child("players").child(playerID).child("final").set(elFinal.value);
	};

	Tracker.speakerChanged = function(playerID) {
		var elSpeaker = document.getElementById("settings_speaker_" + playerID);
		var value = elSpeaker.checked ? true : false;
		var updates = {};

		for (var i = 1; i <= Tracker.PlayerCount; i++) {
			var name = i + "/speaker";

			updates[i + "/speaker"] = i == playerID ? value : false;
		}

		Tracker.RoomReference.child("players").update(updates);
	};

	Tracker.resetRoom = function() {
		if (window.confirm("Are you sure you want to reset the room?") === false) {
			return;
		}

		if (typeof(Tracker.resetRoomLayout) !== "undefined") {
			Tracker.resetRoomLayout();
		}

		alert("Not yet implemented.");
	};

	Tracker.commentatorsUpdate = function() {
		var elCommentators = document.getElementById("settings_commentators");
		var commentators = elCommentators.value;

		Tracker.RoomReference.child("layout").child("commentators").set(commentators);
	};

	Tracker.restreamerUpdate = function() {
		var elRestreamer = document.getElementById("settings_restreamer");
		var restreamer = elRestreamer.value;

		Tracker.RoomReference.child("layout").child("restreamer").set(restreamer);
	};

	Tracker.trackerUpdate = function() {
		var elTracker = document.getElementById("settings_tracker");
		var tracker = elTracker.value;

		Tracker.RoomReference.child("layout").child("trackers").set(tracker);
	};

	Tracker.resetTimer = function(skipPrompt) {
		if (!skipPrompt) {
			var result = window.confirm("Are you sure you want to reset the timer?");

			if (!result) {
				return;
			}
		}

		Tracker.RoomReference.child("layout").child("timer").set({
			elapsed: 0,
			serverTime: 0,
			isRunning: false
		});
		var elTimer = document.getElementById("settings_timer");

		elTimer.enabled = true;
	};

	Tracker.startTimer = function() {
		if (isTimerRunning) {
			return;
		}

		var elTimer = document.getElementById("settings_timer");
		var elapsed = Tracker.timerToTimeValue(elTimer.value);

		Tracker.RoomReference.child("layout").child("timer").update({
			elapsed: elapsed + lastElapsedTimer,
			isRunning: true,
			serverTime: firebase.database.ServerValue.TIMESTAMP
		});
		elTimer.value = "";
	};

	Tracker.stopTimer = function() {
		if (isTimerRunning === false) {
			return;
		}

		Tracker.getServerTime().then(function (data) {
			Tracker.RoomReference.child("layout").child("timer").update({
				isRunning: false,
				elapsed: lastElapsedTimer + (data.val() - lastServerTimeTimer),
				serverTime: firebase.database.ServerValue.TIMESTAMP
			})
		});
	};

	Tracker.getServerTime = async function() {
		Tracker.RoomReference.child("now").set(firebase.database.ServerValue.TIMESTAMP);

		return Tracker.RoomReference.child("now").once("value", function (data) {
			return data;
		});
	};

	Tracker.onPlayerUpdate = function(callback, child) {
		if (Tracker.RoomReference === null) {
			console.log("Not initialized, unable to register onPlayerUpdate.");
			return;
		}

		for (var i = 1; i <= Tracker.PlayerCount; i++) {
			var ref = Tracker.RoomReference.child("players").child(i);

			if (typeof(child) !== "undefined") {
				ref = ref.child(child);
			}

			ref.on("value", function(pID) {
				return function(snapshot) {
					callback(pID, snapshot.val());
				}
			}(i));
		}
	};

	Tracker.updateLayout = function(property, value, label) {
		var updates = {};

		updates[property] = value;

		if (typeof(label) !== "undefined") {
			updates["__label__" + property] = label;
		}

		updates["__elapsed__" + property] = timerElapsed;
		Tracker.RoomReference.child("layout").update(updates);
	};

	Tracker.updatePlayer = function(pID, property, value, label) {
		var updates = {};

		updates[property] = value;

		if (typeof(label) !== "undefined") {
			updates["__label__" + property] = label;
		}

		updates["__elapsed__" + property] = timerElapsed;
		Tracker.RoomReference.child("players").child(pID).update(updates);
	};

	Tracker.onLayoutUpdate = function(callback, child) {
		if (Tracker.RoomReference === null) {
			console.log("Not initialized, unable to register onLayoutUpdate.");
			return;
		}

		var ref = Tracker.RoomReference.child("layout");

		if (typeof(child) !== "undefined") {
			ref = ref.child(child);
		}

		ref.on("value", function(data) {
			callback(data.val());
		});
	};

	Tracker.loadRestreamLayout = function() {
		var newPath = location.protocol + "//" + location.host + rootPath + ".html" + location.search;

		if (newPath !== location.href) {
			location.href = newPath;
		}
	};

	Tracker.loadTrackerLayout = function() {
		var newPath = location.protocol + "//" + location.host + rootPath + "_tracker.html" + location.search;

		if (newPath !== location.href) {
			location.href = newPath;
		}
	};

	Tracker.loadComsLayout = function() {
		var newPath = location.protocol + "//" + location.host + rootPath + "_coms.html" + location.search;

		if (newPath !== location.href) {
			location.href = newPath;
		}
	};

	Tracker.togglePlayerIcon = function(element) {
		Tracker.updatePlayer(element.dataset.player, element.dataset.property, !(element.dataset.value === "true"));
	};

	Tracker.toggleLayoutIcon = function(element) {
		Tracker.updateLayout(element.dataset.property, !(element.dataset.value === "true"));
	};

	Tracker.setPlayerIcon = function(element, value) {
		Tracker.updatePlayer(element.dataset.player, element.dataset.property, value || element.dataset.value, element.dataset.label);
	};

	Tracker.setLayoutIcon = function(element, value) {
		Tracker.updateLayout(element.dataset.property,  value || element.dataset.value, element.dataset.label);
	};

	Tracker.closeDialog = function() {
		if (shownDialog === null) {
			return;
		}

		shownDialog.style.display = "none";
		shownDialog = null;
		document.removeEventListener("click", Tracker.closeDialog);
	}

	Tracker.openPlayerDialog = function(element) {
		if (shownDialog !== null) {
			return;
		}

		iconToUpdate = null;
		playerToUpdate = element.dataset.player;
		shownDialog = document.querySelector(element.dataset.openDialog);

		// Propogate player value to child elements so the listener know who to update
		shownDialog.childNodes.forEach(function(e) {
			if (typeof(e.dataset) === "undefined") {
				return;
			}

			e.dataset.player = playerToUpdate;
		});

		var elementPosition = element.getBoundingClientRect();

		shownDialog.style.left = (elementPosition.left + document.documentElement.scrollLeft) + "px";
		shownDialog.style.top = (elementPosition.top + document.documentElement.scrollTop) + "px";
		shownDialog.style.display = "block";
		
		if (shownDialog.getBoundingClientRect().bottom > window.innerHeight) {
			shownDialog.style.top = ((elementPosition.top + document.documentElement.scrollTop) - (shownDialog.getBoundingClientRect().bottom - window.innerHeight)) + "px";
		}

		setTimeout(function() {
			document.addEventListener("click", Tracker.closeDialog)
		}, 1);
	};

	Tracker.openLayoutDialog = function(element) {
		if (shownDialog !== null) {
			return;
		}

		playerToUpdate = null;
		iconToUpdate = element.dataset.property;
		shownDialog = document.querySelector(element.dataset.openDialog);

		// Propogate property value to child elements so the listener know who to update
		shownDialog.childNodes.forEach(function(e) {
			if (typeof(e.dataset) === "undefined") {
				return;
			}

			e.dataset.property = iconToUpdate;
		});

		var elementPosition = element.getBoundingClientRect();

		shownDialog.style.left = (elementPosition.left + document.documentElement.scrollLeft) + "px";
		shownDialog.style.top = (elementPosition.top + document.documentElement.scrollTop) + "px";
		shownDialog.style.display = "block";
		
		if (shownDialog.getBoundingClientRect().bottom > window.innerHeight) {
			shownDialog.style.top = ((elementPosition.top + document.documentElement.scrollTop) - (shownDialog.getBoundingClientRect().bottom - window.innerHeight)) + "px";
		}

		setTimeout(function() {
			document.addEventListener("click", Tracker.closeDialog)
		}, 1);
	};

	Tracker.addTimerListener = function(callback) {
		timerListeners.push(callback);
	};
})(window.Tracker = window.Tracker || {});

document.addEventListener("DOMContentLoaded", function(event) {
	if (typeof(Tracker.loaded) !== "undefined") {
		Tracker.loaded();
	}
});