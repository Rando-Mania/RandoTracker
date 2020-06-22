(function(RM) {
	var updateLayout = function(layout) {
		var layoutID = "players-4";

		if (typeof(layout["__layout__"]) !== "undefined") {
			layoutID = layout["__layout__"];
		}

		var container = document.querySelector(".contain");

		container.id = layoutID;
	};

	RM.init = function() {
		Tracker.onLayoutUpdate(updateLayout);
	};

	RM.setLayout = function(id) {
		Tracker.updateLayout("__layout__", id);
	};

	RM.scheduleCallback = function(data) {
		var listings = data.schedule.items;
		var select = document.getElementById("schedule_preloads");

		select.appendChild(document.createElement("option"));

		listings.forEach(function(listing) {
			var option = document.createElement("option");

			option.textContent = listing.data[0];
			option.data = listing;
			select.appendChild(option);
		});

		select.onchange = function() {
			var option = select.options[select.selectedIndex];
			var listing = option.data;

			if (!listing) {
				return;
			}

			var updates = [
				{
					property: "game-name",
					value: listing.data[0]
				},
				{
					property: "game-system",
					value: listing.data[3]
				},
				{
					property: "game-length",
					value: new Date(1000 * listing.length_t).toISOString().substr(11, 8)
				},
				{
					property: "game-category",
					value: listing.data[2]
				}
			];

			if (select.selectedIndex < select.options.length - 1) {
				updates.push({
					property: "up-next",
					value: select.options[select.selectedIndex+1].data.data[0]
				});
			} else {
				updates.push({
					property: "up-next",
					value: ""
				})
			}

			var players = listing.data[1].split(", ");

			for (var pID = 1; pID <= 4; pID++) {
				if (players.length < pID) {
					updates.push({
						property: "__p" + pID + "__player-name",
						value: ""
					});
				} else {
					updates.push({
						property: "__p" + pID + "__player-name",
						value: players[pID-1]
					});
				}
			}

			Tracker.updateLayoutMultiple(updates);
		}
	}

	document.addEventListener("DOMContentLoaded", function(event) {
		setTimeout(function(){
			let script = document.createElement("script");

			script.type = "text/javascript";
			script.src = "https://horaro.org/randomania2020/superweek.json?named=true&callback=RM.scheduleCallback";
			document.body.appendChild(script);
		}, 8000)
	});
})(window.RM = window.RM || {});