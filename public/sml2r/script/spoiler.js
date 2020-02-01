const levelOffsets = {
		"lv00": {offset: 0x3C218, divID: "mushHouse"},
		"lv01": {offset: 0x3C23B, divID: "tree1"},
		"lv02": {offset: 0x3C23A, divID: "tree2"},
		"lv03": {offset: 0x3C239, divID: "tree3"},
		"lv04": {offset: 0x3C23C, divID: "tree4"},
		"lv05": {offset: 0x3C238, divID: "tree5"},
		"lv06": {offset: 0x3C240, divID: "pump1"},
		"lv07": {offset: 0x3C241, divID: "pump2"},
		"lv08": {offset: 0x3C242, divID: "pump3"},
		"lv09": {offset: 0x3C243, divID: "pump4"},
		"lv0A": {offset: 0x3C268, divID: "mario1"},
		"lv0B": {offset: 0x3C269, divID: "mario2"},
		"lv0C": {offset: 0x3C26A, divID: "mario3"},
		"lv0D": {offset: 0x3C26B, divID: "mario4"},
		"lv0E": {offset: 0x3C25E, divID: "turt1"},
		"lv0F": {offset: 0x3C260, divID: "turt2"},
		"lv10": {offset: 0x3C261, divID: "turt3"},
		"lv11": {offset: 0x3C21D, divID: "hippo"},
		"lv12": {offset: 0x3C254, divID: "space1"},
		"lv13": {offset: 0x3C255, divID: "space2"},
		"lv14": {offset: 0x3C24A, divID: "macro1"},
		"lv15": {offset: 0x3C24B, divID: "macro2"},
		"lv16": {offset: 0x3C24C, divID: "macro3"},
		"lv17": {offset: 0x3C24D, divID: "macro4"},
		"lv18": {offset: 0x57F5, divID: "castle"}, //level number in header since it never moves
		"lv19": {offset: 0x3C21C, divID: "misc"},
		"lv1A": {offset: 0x3C27E, divID: "turtS"},
		"lv1B": {offset: 0x3C290, divID: "pumpS1"},
		"lv1C": {offset: 0x3C25C, divID: "spaceS"},
		"lv1D": {offset: 0x3C23E, divID: "treeS"},
		"lv1E": {offset: 0x3C282, divID: "macroS"},
		"lv1F": {offset: 0x3C292, divID: "pumpS2"}
}

const levelNames = {
	"lookup": [
		{byte: 0x00, name: "house"},
		{byte: 0x01, name: "tree1"},
		{byte: 0x02, name: "tree2"},
		{byte: 0x03, name: "tree3"},
		{byte: 0x04, name: "tree4"},
		{byte: 0x05, name: "tree5"},
		{byte: 0x06, name: "pump1"},
		{byte: 0x07, name: "pump2"},
		{byte: 0x08, name: "pump3"},
		{byte: 0x09, name: "pump4"},
		{byte: 0x0A, name: "mario1"},
		{byte: 0x0B, name: "mario2"},
		{byte: 0x0C, name: "mario3"},
		{byte: 0x0D, name: "mario4"},
		{byte: 0x0E, name: "turt1"},
		{byte: 0x0F, name: "turt2"},
		{byte: 0x10, name: "turt3"},
		{byte: 0x11, name: "hippo"},
		{byte: 0x12, name: "space1"},
		{byte: 0x13, name: "space2"},
		{byte: 0x14, name: "macro1"},
		{byte: 0x15, name: "macro2"},
		{byte: 0x16, name: "macro3"},
		{byte: 0x17, name: "macro4"},
		{byte: 0x18, name: "castle"},
		{byte: 0x19, name: "misc"},
		{byte: 0x1A, name: "turt("},
		{byte: 0x1B, name: "pump(1"},
		{byte: 0x1C, name: "space("},
		{byte: 0x1D, name: "tree("},
		{byte: 0x1E, name: "macro("},
		{byte: 0x1F, name: "pump(2"}
	]
}

const levelPhysics = {//TODO
	"lookup": [
		{byte: 0x00, color: "rgb(255,255,255)"},
		{byte: 0x01, color: "rgb(0,255,255)"},
		{byte: 0x08, color: "rgb(255,255,0)"}
	]
}

const dualExitLevels = {
	"lookup": [
		{byte: 0x02, offset: 0x2A385},
		{byte: 0x07, offset: 0x49215},
		{byte: 0x08, offset: 0x49F61},
		{byte: 0x0F, offset: 0x51D99},
		{byte: 0x11, offset: 0x4C8EB},
		{byte: 0x12, offset: 0x4DA53},
		{byte: 0x14, offset: 0x54ACE}
	]
}

const bossNames = {
	"lookup": [
		{byte: 0x05, offset: 0x8E03, name: "-bird"},
		{byte: 0x09, offset: 0x8E08, name: "-witch"},
		{byte: 0x0D, offset: 0x8E0D, name: "-pigs"},
		{byte: 0x10, offset: 0x8E12, name: "-octopus"},
		{byte: 0x13, offset: 0x8E17, name: "-tatanga"},
		{byte: 0x17, offset: 0x8E1C , name: "-rat"}
	]
}

document.getElementById("fileupload").onchange = function(){
	var file = document.getElementById("fileupload").files[0];
	var reader = new FileReader();
	reader.onloadend = function(e) {
		if (romCheck(reader.result)) {
			document.getElementById("reveal").disabled = false;
		} else {
			alert("Not a ROM of Super Mario Land 2");
		}
	}
	reader.readAsArrayBuffer(file);
}

function romCheck(buffer) {
	var rom = new Uint8Array(buffer);
	var origRom = [0x4D, 0x41, 0x52, 0x49, 0x4F, 0x4C, 0x41, 0x4E, 0x44, 0x32];
	var romVerify = 10;
  for (var i = 0; i < origRom.length; i++) {
    if (rom[0x134 + i] == origRom[i]) {
        romVerify--;
    }
  }
	return romVerify == 0;
}

//use <button onclick="function()">Text</button>
function buttonPress() {
	var file = document.getElementById("fileupload").files[0];
	var reader = new FileReader();
	reader.onloadend = function(e) {
		reveal(reader.result)
	};
	reader.readAsArrayBuffer(file);
}

function reveal(buffer) {
	var rom = new Uint8Array(buffer);
	var version = rom[0x14C] == 0x02 ? 0x3 : 0x0;
	for (x in levelOffsets) {
		var element = document.getElementById(levelOffsets[x].divID);
		element.classList.remove("hidden");
		var levelByte = rom[levelOffsets[x].offset];
		const levelNameObj = levelNames.lookup.find(level => level.byte == levelByte);
		element.innerHTML = levelNameObj.name;
		const dualExitObj = dualExitLevels.lookup.find(level => level.byte == levelByte);
		if (dualExitObj !== undefined && rom[dualExitObj.offset] == 0x4B) {
			element.classList.add("swapped-exit");
		}
		const bossOffsetObj = bossNames.lookup.find(level => level.byte == levelByte);
		if (bossOffsetObj !== undefined) {
			for (var i = 0; i < bossNames.lookup.length; i++) {
				if (rom[bossNames.lookup[i].offset] == levelByte) {
					const bossNameObj = bossNames.lookup[i];
					element.innerHTML += bossNameObj.name;
					break;
				}
			}
		}
		var physicsByte = rom[0x1F91 + levelByte + version];
		const physicsObj = levelPhysics.lookup.find(physics => physics.byte == physicsByte);
		if (physicsObj !== undefined) {
			element.style.backgroundColor = physicsObj.color;
		}
		if (rom[0x1F71 + levelByte + version] == 0x01) {
			element.classList.add("scrolling");
		}
	}
}
