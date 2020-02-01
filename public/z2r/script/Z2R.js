(function(Z2R) {
	Z2R.setupListeners = function() {
		Tracker.RoomReference.child("layout").on("value", function (data) {
			var value = data.val();

			if (typeof(value.crystals) === "undefined" || value.crystals === -1) {
				document.getElementById("crystal-display").classList.add("hidden");
			} else {
				document.getElementById("crystal-display").classList.remove("hidden");
			}
		});
	};

	Z2R.init = function(playerCount) {
		Tracker.init(playerCount, Z2R.setupListeners);
	};
})(window.Z2R = window.Z2R || {});