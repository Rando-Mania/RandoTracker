(function(Tracker) {
	/////////////////////////////////////////////
	// Setup
	/////////////////////////////////////////////
	const regex = /^(.*?)[\_\.]/g;

	var rootPath = regex.exec(location.pathname)[1];
	var databaseGameName = "games" + rootPath;
	var databaseRoomName = "";
	var passcode = "";
	var authAttempted = false;
	var activeTimerProperty = null;
	var timerProperties = {};

	{
		var queryString = window.location.search.substring(1);
		var params = queryString.split("&");

		for (var i = 0; i < params.length; i++) {
			var val = params[i].split("=");

			if (val[0] === "room") {
				databaseRoomName = val[1];
			} else if (val[0] === "passcode") {
				passcode = val[1];
			}
		}
	}

	var referenceName = databaseGameName + "/" + databaseRoomName;

	// Setup our DOM listener for init
	document.addEventListener("DOMContentLoaded", function(event) {
		init();
	});

	// User can override this as a callback to modify the soon to be updated data
	Tracker.onUpdateLayout = function(data) {
		return data;
	};

	/////////////////////////////////////////////
	// Public Methods
	/////////////////////////////////////////////
	Tracker.getLayoutData = function(callback) {
		Tracker.RoomReference.once("value", function(data) {
			callback(data.val().layout);
		});
	};

	Tracker.updateLayout = function(property, value) {
		Tracker.updateLayoutMultiple([{
			property: property,
			value: value
		}]);
	};

	Tracker.updateLayoutMultiple = function(updates) {
		var data = {};

		updates = Tracker.onUpdateLayout(updates);
		updates.forEach(function(update) {
			data[update.property] = update.value;
		});

		data["__now__"] = firebase.database.ServerValue.TIMESTAMP;

		queueLayoutUpdate(data);
		updateTimerOnUpdates(data);
	};

	Tracker.getPropertyAttribute = function(node, propertyOverride, playerOverride) {
		var playerParent, playerValue;

		if (playerOverride) {
			playerValue = playerOverride;
		} else if (node) {
			playerParent = node.closest("tr-player");
			playerValue = node.getAttribute("player");
		}

		var returnValue = propertyOverride || node.getAttribute("property");

		if (playerValue) {
			return "__p" + playerValue + "__" + returnValue;
		} else if (playerParent) {
			return "__p" + playerParent.getAttribute("player") + "__" + returnValue;
		} else {
			return returnValue;
		}
	};

	Tracker.getLabelPropertyName = function(property) {
		return "__label__" + property;
	};

	Tracker.getTimestampPropertyName = function(property) {
		return "__timestamp__" + property;
	};

	Tracker.parseMS = function(ms) {
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

	Tracker.dateToText = function(time, includePadding) {
		var span = document.createElement("span");

		span.innerHTML = Tracker.dateToTags(time, includePadding);
		return span.textContent || span.innerText;
	};

	Tracker.dateToTags = function(time, includePadding) {
		var value = "";
		var spanWrap = function(text) {
			return "<span>" + text.split("").join("</span><span>") + "</span>";
		};

		if (includePadding) {
			value = spanWrap(time.hours) + "<span class='colon'>:</span>" + spanWrap(("00" + time.minutes).slice(-2)) + "<span class='colon'>:</span>" + spanWrap(("00" + time.seconds).slice(-2)) + "<span class='dot'>.</span>";
		} else {
			if (time.hours >= 1) {
				value = spanWrap(time.hours) + "<span class='colon'>:</span>" + spanWrap(time.minutes) + "<span class='colon'>:</span>" + spanWrap(time.seconds) + "<span class='dot'>.</span>";
			} else if (time.minutes >= 1) {
				value = spanWrap(time.minutes) + "<span class='colon'>:</span>" + spanWrap(time.seconds) + "<span class='dot'>.</span>";
			} else {
				value = "<span class='colon'>:</span>" + spanWrap(time.seconds) + "<span class='dot'>.</span>";
			}
		}
		
		return value + "<span class='ms'>" + time.ms.substring(0, 1) + "</span>";
	};

	Tracker.getServerTime = async function() {
		Tracker.RoomReference.child("now").set(firebase.database.ServerValue.TIMESTAMP);

		return Tracker.RoomReference.child("now").once("value", function (data) {
			return data;
		});
	};

	Tracker.timerToTimeValue = function(timer) {
		var ms = 0;

		if (timer === null || timer === "") {
			timer = "0:00:00";
		}

		while ((timer.match(/:/g) || []).length < 2) {
			if (timer.substring(0,1) === ":") {
				timer = "00" + timer;
			}

			timer = "00:" + timer;
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

	Tracker.resetRoom = function(trackingOnly) {
		Tracker.getLayoutData(function(data) {
			const resetLayout = new CustomEvent("tr-reset", {
				bubbles: false
			});

			document.dispatchEvent(resetLayout);

			var resetData = {reset: true};

			if (trackingOnly) {
				Object.keys(data).forEach(function(key, index) {
					if (key.indexOf("name") !== -1 ||
						key.indexOf("comm") !== -1 ||
						key.indexOf("restream") !== -1 ||
						key.indexOf("tracker") !== -1 ||
						key.indexOf("best") !== -1 ||
						key.indexOf("speaker") !== -1 ||
						key.indexOf("pronoun") !== -1 ||
						key.indexOf("record") !== -1 ||
						key.indexOf("rank") !== -1 ||
						key.indexOf("number") !== -1 ||
						key.indexOf("week") !== -1){
						resetData[key] = data[key];
					}
				});
			}

			Tracker.RoomReference.child("layout").set(resetData, initializeRoomDatabase);
		});
	};

	Tracker.openView = function(view) {
		var file = ".html";

		if (view) {
			file = "_" + view + ".html"
		}

		var newPath = location.protocol + "//" + location.host + rootPath + file + location.search;

		if (newPath !== location.href) {
			location.href = newPath;
		}
	};

	Tracker.getCurrentView = function() {
		var url = window.location.pathname;
		var filename = url.substring(url.lastIndexOf('/')+1);
		var underscore = filename.indexOf("_");

		if (underscore === -1) {
			return "";
		}

		return filename.substring(underscore+1, filename.indexOf("."));
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

	Tracker.setActiveTimer = function(property) {
		queueLayoutUpdate({
			activeTimer: property
		});
	};

	/////////////////////////////////////////////
	// Private Methods
	/////////////////////////////////////////////
	var layoutDataToSend = null;

	var queueLayoutUpdate = function(data) {
		if (layoutDataToSend === null) {
			layoutDataToSend = data;
		} else {
			layoutDataToSend = Object.assign(layoutDataToSend, data);
		}
	};

	setInterval(function() {
		if (layoutDataToSend !== null) {
			Tracker.RoomReference.child("layout").update(layoutDataToSend);
			layoutDataToSend = null;
		}
	}, 100);

	var updateTimerOnUpdates = function(updates) {
		if (activeTimerProperty) {
			Tracker.getServerTime().then(function(data) {
				var timeStamp = Tracker.dateToText(Tracker.parseMS(timerProperties.elapsed + (data.val() - timerProperties.serverTime)), false);
				var timeStampUpdates = {};

				for (const prop in updates) {
					timeStampUpdates["__timestamp__" + prop] = timeStamp;
				}

				queueLayoutUpdate(timeStampUpdates);
			});
		}
	};

	var onLayoutValue = function(snapshot) {
		const eventLayout = new CustomEvent("tr-layout", {
			bubbles: false,
			detail: snapshot.val()
		});

		document.dispatchEvent(eventLayout);

		if (eventLayout.detail && eventLayout.detail.activeTimer) {
			activeTimerProperty = eventLayout.detail.activeTimer;
		}

		if (activeTimerProperty && eventLayout.detail[activeTimerProperty]) {
			Object.assign(timerProperties, eventLayout.detail[activeTimerProperty]);
		}
	};

	var initializeRoomDatabase = function() {
		Tracker.RoomReference.once("value", function(data) {
			Tracker.RoomReference.child("layout").on("value", function(snapshot) {
				onLayoutValue(snapshot);
			});

			var newData;

			if (data.val() !== null) {
				// Room already exists.  Check for reset
				if (!data.val().reset) {
					// Not a reset, ignore
					queueLayoutUpdate({
						"__now__": firebase.database.ServerValue.TIMESTAMP
					});
					return;
				}

				newData = data.val();
			} else {
				newData = {
					owner: Tracker.uID,
					passcode: passcode
				};
			}

			newData.layout = {
				"__now__": firebase.database.ServerValue.TIMESTAMP
			};

			Tracker.RoomReference.set(newData);
		});
	};

	var init = function() {
		if (databaseRoomName === "") {
			alert("Invalid Room ID");
			window.location = window.location.origin;
			return;
		}

		var doSetup = function(user) {
			Tracker.uID = user.uid;
			Tracker.RoomReference = firebase.database().ref(referenceName);
			
			initializeRoomDatabase();
		};

		var verifyPasscode = function(user, callback) {
			if (passcode === "") {
				alert("Not authorized.");
				location.href = location.protocol.concat("//").concat(window.location.host);
				return;
			}

			firebase.database().ref(referenceName).child("passcode").once("value", function (data) {
				var code = data.val();

				if (code === null || code === passcode) {
					callback(user);
				} else {
					alert("Invalid passcode.");
					location.href = location.protocol.concat("//").concat(window.location.host);
				}
			});
		};

		firebase.auth().onAuthStateChanged(function(user) {
			if (!user) {
				if (!authAttempted) {
					authAttempted = true;
				}

				firebase.auth().signInAnonymously().catch(function(error) {
					alert("Error authenticating to the server.");
					console.log(error);
				});

				return;
			}

			if (user.isAnonymous || typeof(user.email) === "undefined" || user.email === null) {
				verifyPasscode(user, doSetup);
				return;
			}

			firebase.database().ref("/users").child(user.email.replace(new RegExp("\\.", "g"), "_")).once("value", function (data) {
				var dbData = data.val();
				var allowed = dbData.isApproved || dbData.isAdmin;

				if (!allowed) {
					verifyPasscode(user, doSetup);
					return;
				}

				doSetup(user);
			}).catch(function (error) {
				alert("Login not authorized.");
				location.href = location.protocol.concat("//").concat(window.location.host);
			});
		});
	};
})(window.Tracker = window.Tracker || {});