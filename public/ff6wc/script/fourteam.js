(function(FF4) {
    var colors = [{
        text: "darkknight",
        value: "#09090c"
    },{
        text: "pally",
        value: "#36353a"
    },{
        text: "cid",
        value: "#002088"
    },{
        text: "edge",
        value: "#cd9878"
    },{
        text: "edward",
        value: "#930000"
    },{
        text: "fusoya",
        value: "#9a4500"
    },{
        text: "kain",
        value: "#311708"
    },{
        text: "palom",
        value: "#0e0440"
    },{
        text: "porom",
        value: "#a7327f"
    },{
        text: "rosa",
        value: "#17a5ad"
    },{
        text: "rydia",
        value: "#205033"
    },{
        text: "tellah",
        value: "#410e58"
    },{
        text: "yang",
        value: "#c49a0b"
    }];

	var updateLeftColor = function(image) {
		var block = document.getElementById("left-block");

		if (!block) {
			return;
		}

        var color = colors[0].value;

        colors.forEach(function(c) {
            if (image && image.indexOf(c.text) >= 0) {
                color = c.value;
            }
        })

		block.style.backgroundColor = color;
	};

	var updateRightColor = function(image) {
		var block = document.getElementById("right-block");

        if (!block) {
            return;
        }

        var color = colors[0].value;

        colors.forEach(function(c) {
            if (image && image.indexOf(c.text) >= 0) {
                color = c.value;
            }
        })

        block.style.backgroundColor = color;
	};

	FF4.init = function() {
		Tracker.onLayoutUpdate(updateLeftColor, "left-character");
		Tracker.onLayoutUpdate(updateRightColor, "right-character");
	};
})(window.FF4 = window.FF4 || {});

Tracker.loaded = function() {
    Tracker.init({
        playerCount: 4,
        freetext: [{
            label: "Left Character",
            property: "left-character",
            type: "select",
            options: [{
                text: "Dark Knight Cecil",
                value: "images/twinsday/cecil-darkknight-left.png"
            },{
                text: "Paladin Cecil",
                value: "images/twinsday/cecil-pally-left.png"
            },{
                text: "Cid",
                value: "images/twinsday/cid-left.png"
            },{
                text: "Edge",
                value: "images/twinsday/edge-left.png"
            },{
                text: "Edward",
                value: "images/twinsday/edward-left.png"
            },{
                text: "FuSoYa",
                value: "images/twinsday/fusoya-left.png"
            },{
                text: "Kain",
                value: "images/twinsday/kain-left.png"
            },{
                text: "Palom",
                value: "images/twinsday/palom-left.png"
            },{
                text: "Porom",
                value: "images/twinsday/porom-left.png"
            },{
                text: "Rosa",
                value: "images/twinsday/rosa-left.png"
            },{
                text: "Rydia",
                value: "images/twinsday/rydia-left.png"
            },{
                text: "Tellah",
                value: "images/twinsday/tellah-left.png"
            },{
                text: "Yang",
                value: "images/twinsday/yang-left.png"
            }]
        }, {
            label: "Right Character",
            property: "right-character",
            type: "select",
            options: [{
                text: "Dark Knight Cecil",
                value: "images/twinsday/cecil-darkknight.png"
            },{
                text: "Paladin Cecil",
                value: "images/twinsday/cecil-pally.png"
            },{
                text: "Cid",
                value: "images/twinsday/cid.png"
            },{
                text: "Edge",
                value: "images/twinsday/edge.png"
            },{
                text: "Edward",
                value: "images/twinsday/edward.png"
            },{
                text: "FuSoYa",
                value: "images/twinsday/fusoya.png"
            },{
                text: "Kain",
                value: "images/twinsday/kain.png"
            },{
                text: "Palom",
                value: "images/twinsday/palom.png"
            },{
                text: "Porom",
                value: "images/twinsday/porom.png"
            },{
                text: "Rosa",
                value: "images/twinsday/rosa.png"
            },{
                text: "Rydia",
                value: "images/twinsday/rydia.png"
            },{
                text: "Tellah",
                value: "images/twinsday/tellah.png"
            },{
                text: "Yang",
                value: "images/twinsday/yang.png"
            }]
        }, {
            label: "Flags",
            property: "flags",
            type: "textarea",
            onblur: true,
            rows: 4
        }],
        additionalLoads: [{
            path: "four_items.html",
            parentElementQuery: "#player_1_grid"
        }]
    }, FF4.init);
}