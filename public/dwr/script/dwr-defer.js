// youtube iframe

var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('existing-iframe-example', {
		events: {
		'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange,
		}
	});
}

function onPlayerReady(event) {
	player.setLoop(true);
	setTimeout( function() {
		event.target.setShuffle(true);
		player.playVideoAt(0);
		player.stopVideo();
	}, 3000);
}

function onPlayerStateChange(event) {
	if (event.data == 0) { // video ended
		player.setShuffle({'shufflePlaylist' : 1});
	}
}

var dwrlist = [
	"Teaching Dragonlord 2 Hurtmore...",
	"Teaching Drollgonlord 2 <span style='color:red;'>&#10084;</span>...",
	"Resetting COD counter...",
	"Reticulating Slimes...",
	"Pixelating the Dragons...",
	"Shining the Goldmen...",
	"Brushing Drakee's Teeth...",
	"Setting up arrow manipulations...",
	"Counting Bonks...",
	"Splitting the continents...",
	"Sparkover-ing the bridges...",
	"Emptyeye-ing the levels...",
	"Only fools hold <span class='ctrl-button'>B</span>...",
	"An Axe Ghost appears...",
	"Command?<br> Command?<br> Command?",
	"Finding the Red...",
	"Launching the GPS...",
	"Dost thou love me, d?",
	"But thou must."];
  var counter = 0;
  var elem = document.getElementById("changeText");
  var inst = null;

  if (elem !== null) {
  	inst = setInterval(changeText, 10000);
  }

  function changeText() {
	elem.innerHTML = dwrlist[counter];
	counter++;
	if (counter >= dwrlist.length) {
	  counter = 0;
	}
  }