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
					value: listing.data[0].name
				},
				{
					property: "game-system",
					value: listing.data[0].console
				},
				{
					property: "game-length",
					value: new Date(1000 * listing.data[0].run_time).toISOString().substr(11, 8)
				},
				{
					property: "game-category",
					value: listing.data[0].category
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

	const fetchDonationData = async () => {
		const donationCounterEl = document.getElementById("donation_counter");
	
		const apiInit = {
			method: 'GET',
			headers: {
				'Host': 'donations.randomania.net',
				'Accept': 'application/json',
			},
		};
		const apiUrl = 'https://donations.randomania.net/tracker/api/v2/runs/?format=json';
		const response = await fetch(apiUrl, apiInit);
		const data = await response.json();

		console.log(data);
		console.log(data[0].name)
		console.log(data[0].console)
		console.log(data[0].category)
		console.log(data[0].runners[0].name)
		console.log(data[0].runners[0].pronouns)
		console.log(data[0].runners[1].name)
		console.log(data[0].runners[1].pronouns)
		// console.log(data[0].runners[2].name)
		// console.log(data[0].runners[2].pronouns)
		// console.log(data[0].runners[3].name)
		// console.log(data[0].runners[3].pronouns)
		console.log(data[0].run_time)
		console.log(data[1].name) // next game title
		console.log(data[0].commentators)
	}

		document.addEventListener("DOMContentLoaded", function(event) {
			setTimeout(
				function(){
					fetchDonationData();
				}, 1000
				)
			});

})(window.RM = window.RM || {});