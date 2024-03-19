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
        const listings = data.results;
        var select = document.getElementById("schedule_preloads");

        console.log(data.results);

        select.appendChild(document.createElement("option"));


        for (let listing of listings) {
            var option = document.createElement("option");

            option.textContent = listing.name;
            option.data = listing;
            select.appendChild(option);
        }

        // listings.forEach(function(listing) {
        //     var option = document.createElement("option");

        //     option.textContent = listing.name;
        //     option.data = listing;
        //     select.appendChild(option);
        // });

        select.onchange = function() {
            var option = select.options[select.selectedIndex];
            var listing = option.data;

            if (!listing) {
                return;
            }

            

            var updates = [
                {
                    property: "game-name",
                    value: listing.name
                },
                {
                    property: "game-system",
                    value: listing.console
                },
                {
                    property: "game-length",
                    value: listing.run_time
                },
                {
                    property: "game-category",
                    value: listing.category.substring(2)
                },
				{
                    property: "commentators",
                    value: listing.commentators[0].name
                },
                {
                    property: "host",
                    value: listing.hosts[0].name
                }
            ];

            if (select.selectedIndex < select.options.length - 1) {
                updates.push({
                    property: "up-next",
                    value: select.options[select.selectedIndex+1].data.name
                });
            } else {
                updates.push({
                    property: "up-next",
                    value: ""
                })
            }

            var players = listing.runners;

            for (var pID = 1; pID <= 4; pID++) {
                if (players.length < pID) {
                    updates.push(
						{
                        property: "__p" + pID + "__player-name",
                        value: ""
                    	},
						{
						property: "__p" + pID + "__player-pronoun",
						value: ""
						}
					);
                } else {
                    updates.push({
                        property: "__p" + pID + "__player-name",
                        value: players[pID-1].name
                    },
					{
						property: "__p" + pID + "__player-pronoun",
						value: players[pID-1].pronouns
					});
                }
            }

            let comList = ""
            let hostList = ""
         
            if (listing.commentators != "") {
                for (coms of listing.commentators) { 
                    if (comList === "") {
                        comList += coms.name
                        if (coms.pronouns != "") {comList += " (" + coms.pronouns + ")"} 
                    } else {
                        comList += ", " + coms.name
                        if (coms.pronouns != "") {comList += " (" + coms.pronouns + ")"} 
                    }
                }
                updates.push({
                    property: "commentators",
                    value: comList
                })
            }
            
            if (listing.hosts != "") {
                for (host of listing.hosts) { 
                    if (hostList === "") {
                        hostList += host.name
                        if (host.pronouns != "") {hostList += " (" + host.pronouns + ")"} 
                    } else {
                        hostList += ", " + host.name
                        if (host.pronouns != "") {hostList += " (" + host.pronouns + ")"} 
                    }
                }
                updates.push({
                    property: "hosts",
                    value: hostList
                })
            }

            Tracker.updateLayoutMultiple(updates);
        }
	}

	const fetchRunData = async () => {	
		const apiInit = {
			method: 'GET',
			headers: {
				'Host': 'donations.randomania.net',
				'Accept': 'application/json',
			},
		};
        const apiUrl = 'https://donations.randomania.net/tracker/api/v2/events/2/runs/';
		const response = await fetch(apiUrl, apiInit);
		const data = await response.json();
		RM.scheduleCallback(data);
	}

		document.addEventListener("DOMContentLoaded", function(event) {
			setTimeout(
				function(){
					fetchRunData();
				}, 1000
				)
			});

})(window.RM = window.RM || {});