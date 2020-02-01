(function(Z3R) {
	var updateKeysanity = function(keysanity) {
		var elements = document.querySelectorAll("*[keysanity]");

		elements.forEach(function(el) {
			if (el.tagName === "INPUT") {
				el.checked = !(!keysanity)
			} else {
				if (keysanity) {
					el.classList.add("keysanity");
				} else {
					el.classList.remove("keysanity");
				}
			}
		});
	};

	Z3R.init = function() {
		Tracker.onLayoutUpdate(updateKeysanity, "keysanity");
	};
})(window.Z3R = window.Z3R || {});