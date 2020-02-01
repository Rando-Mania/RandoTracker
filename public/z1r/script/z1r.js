(function(Z1R) {
	var mapItemSetting = null;
	var shownDialog = null;

	var onMapUpdate = function(data) {
		var elMapItem = document.querySelectorAll("#map .map_item[data-index]");

		elMapItem.forEach(function(currentValue, currentIndex, listObj) {
			if (data === null || typeof(data[currentValue.dataset.index]) === "undefined") {
				currentValue.firstElementChild.src = "images/map/s_icon_ow_0.png";
			} else {
				currentValue.firstElementChild.src = "images/map/s_icon_ow_" + data[currentValue.dataset.index] + ".png";
			}
		});
	};

	var trackerInitialized = function() {
		Tracker.onLayoutUpdate(onMapUpdate, "map");
	};

	var resetRoom = function() {

	};

	Z1R.closeMapDialog = function() {
		if (shownDialog === null) {
			return;
		}

		shownDialog.style.display = "none";
		shownDialog = null;
		document.removeEventListener("click", Z1R.closeMapDialog);
	};

	Z1R.showMapDialog = function(mapItem) {
		if (shownDialog !== null) {
			return;
		}

		mapItemSetting = mapItem;
		shownDialog = document.getElementById("dialog_map");

		var elementPosition = mapItem.getBoundingClientRect();

		shownDialog.style.left = elementPosition.left + "px";
		shownDialog.style.top = elementPosition.top + "px";
		shownDialog.style.display = "grid";
		setTimeout(function() {
			document.addEventListener("click", Z1R.closeMapDialog)
		}, 1);
	};

	Z1R.setMap = function(mapItem) {
		Tracker.RoomReference.child("layout").child("map").child(mapItemSetting.dataset.index).set(mapItem.dataset.index);
		mapItemSetting = null;
	};

	Z1R.setTriforce = function(pID, triforce) {
		var elTriforce = document.querySelector("[data-player='" + pID + "'][data-property='triforce_" + triforce + "']");

		Tracker.togglePlayerIcon(elTriforce);
	};

	Z1R.init = function(playerCount) {
		Tracker.resetRoomLayout = resetRoom;
		Tracker.init(playerCount, trackerInitialized);

		// Fix map images
		var mapItems = document.querySelectorAll("#dialog_map .map_item");

		mapItems.forEach(function(currentValue, currentIndex, listObj) {
			currentValue.firstElementChild.src = "images/map/s_icon_ow_" + currentIndex + ".png";
		});
	};
})(window.Z1R = window.Z1R || {});