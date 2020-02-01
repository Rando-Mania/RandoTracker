(function(DualSplit) {
	var timerLastUpdate = 0;
	var splitAdjusts = [];
	var splitCount = 0;

	var updatePlayer = function(pID, snapshot) {
		var player = snapshot.val();

		if (typeof player["__splitadjust__"] === "undefined") {
			splitAdjusts[pID] = 0;
		} else {
			splitAdjusts[pID] = player["__splitadjust__"];
		}

		if (typeof player["__splits__"] === "undefined") {
			return;
		}

		var elements = document.querySelectorAll("[data-split][data-player='" + pID + "']");

		elements.forEach(function(currentValue, currentIndex, listObj) {
			if (currentValue.tagName === "INPUT") {
				currentValue.value = "";
			} else {
				currentValue.innerHTML = "";
			}
		});

		player["__splits__"].forEach(function(currentValue, currentIndex, listObj) {
			// Update split value display
			var elements = document.querySelectorAll("[data-split='" + currentIndex + "'][data-player='" + pID + "']");

			elements.forEach(function(cv, ci, lo) {
				var value = Tracker.buildTimerWithPadding(currentValue);

				if (cv.tagName === "INPUT") {
					var temp = document.createElement("div");

					temp.innerHTML = value;
					cv.value = temp.textContent || temp.innerText || "";
				} else {
					cv.innerHTML = value;
				}
			});
		});
	};

	var updateSplits = function() {
		Tracker.RoomReference.child("players").once("value", function(data) {
			var players = data.val();

			for (var p = 1; p <= Tracker.PlayerCount; p += 2) {
				var pID1 = p;
				var pID2 = p+1;

				var p1Splits = players[pID1]["__splits__"];
				var p2Splits = players[pID2]["__splits__"];

				if (!p1Splits || !p2Splits) {
					continue;
				}

				for (var i = 0; i < splitCount; i++) {
					var p1El = document.querySelector("[data-split-diff='" + i + "'][data-player='" + pID1 + "']");
					var p2El = document.querySelector("[data-split-diff='" + i + "'][data-player='" + pID2 + "']");

					p1El.classList.remove("ahead");
					p1El.classList.remove("behind");
					p2El.classList.remove("ahead");
					p2El.classList.remove("behind");

					if (p1Splits.length <= i || p2Splits.length <= i) {
						p1El.innerHTML = "";
						p2El.innerHTML = "";
						continue;
					}

					var diff = p1Splits[i] - p2Splits[i];

					p1El.innerHTML = Tracker.buildTimerWithPadding(Math.abs(diff));
					p2El.innerHTML = Tracker.buildTimerWithPadding(Math.abs(diff));

					if (diff > 0) {
						p1El.classList.add("behind");
						p2El.classList.add("ahead");
					} else {
						p1El.classList.add("ahead");
						p2El.classList.add("behind");
					}
				}
			}
		});
	};

	var timerUpdate = function(elapsed) {
		timerLastUpdate = elapsed;
	};

	DualSplit.init = function(splits) {
		splitCount = splits;

		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				var parser = new DOMParser();
				var parsedElement = parser.parseFromString(request.responseText, "text/html");

				document.body.appendChild(parsedElement.body);

				for (var i = Tracker.PlayerCount+1; i <= 4; i++) {
					// Hide unused player fields in settings
					document.getElementById("dualsplit-player-" + i).style.display = "none";

					splitAdjusts.push(0);
				}
			}
		};
		request.open("GET", "../dualsplit.html", true);
		request.send();

		for (var i = 1; i <= Tracker.PlayerCount; i++) {
			Tracker.RoomReference.child("players").child(i).on("value", function(pID) {
				return function(snapshot) {
					updatePlayer(pID, snapshot);
					updateSplits();
				}
			}(i));
		}

		Tracker.addTimerListener(timerUpdate);
	};

	DualSplit.showSettings = function(button) {
		var elDisplay = document.getElementById("dualsplit");

		if (elDisplay === null) {
			return;
		}

		if (!elDisplay.style.display || elDisplay.style.display === "none") {
			elDisplay.style.display = "initial";
			button.classList.add("active");
		} else {
			elDisplay.style.display = "none";
			button.classList.remove("active");
		}
	};

	DualSplit.clockAdjust = function(pID, amount) {
		Tracker.RoomReference.child("players").child(pID).child("__splitadjust__").set(splitAdjusts[pID] + (amount * 1000));
	};

	DualSplit.splitAdjust = function(pID, amount) {
		Tracker.RoomReference.child("players").child(pID).child("__splits__").once("value", function (data) {
			var splits = data.val();

			if (!splits) {
				return;
			}

			splits.push((amount * 1000) + splits.pop());
			Tracker.RoomReference.child("players").child(pID).child("__splits__").set(splits);
		});
	};

	DualSplit.split = function(pID) {
		Tracker.RoomReference.child("players").child(pID).once("value", function (data) {
			var player = data.val();
			var splits = player["__splits__"];

			if (!splits) {
				splits = [];
			}

			if (splits.length === splitCount) {
				return;
			}

			splits.push(timerLastUpdate + splitAdjusts[pID]);
			Tracker.RoomReference.child("players").child(pID).child("__splits__").set(splits);
		});
	};

	DualSplit.reverse = function(pID) {
		Tracker.RoomReference.child("players").child(pID).child("__splits__").once("value", function (data) {
			var splits = data.val();

			if (!splits) {
				return;
			}

			splits.pop();
			Tracker.RoomReference.child("players").child(pID).child("__splits__").set(splits);
		});
	};

	DualSplit.parseAndUpdateSplit = function(element) {
		var pID = element.dataset.player;
		var split = element.dataset.split;
		var value = element.value;
		var splitTime = Tracker.timerToTimeValue(value);

		if (splitTime === 0) {
			// Invalid input, don't save
			return;
		}

		Tracker.RoomReference.child("players").child(pID).child("__splits__").once("value", function (data) {
			var splits = data.val();

			if (!splits) {
				return;
			}

			splits[split] = splitTime;
			Tracker.RoomReference.child("players").child(pID).child("__splits__").set(splits);
		});
	};
})(window.DualSplit = window.DualSplit || {});

