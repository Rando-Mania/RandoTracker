(function(FF6) {

    var youtubeIframe = function(){
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
    }

    youtubeIframe();

    FF6.init = function() {
        document.addEventListener("tr-layout", function(e) {
            if (!e.detail) {
                return;
            }

            let data = e.detail;
 
            // update dragon goal
            var updateDragonGoal = function (){
                let ds = document.querySelectorAll('.icon-slot.dragons');

                var dragonGoal = data["dragon-goal"] || "0";

                if (dragonGoal == "0") {
                    ds.forEach( function(item) {
                        item.classList.add('display-none')
                    }) 
                }
                else {
                    ds.forEach( function(item) {
                        item.classList.remove('display-none')
                    })
                }
                return data;
            }

            updateDragonGoal();

            // update player 1 character count
            var characterCountOne = function (){

                var characterArrayP1 = [
                    data["__p1__character-terra"],
                    data["__p1__character-locke"],
                    data["__p1__character-cyan"],
                    data["__p1__character-shadow"],
                    data["__p1__character-edgar"],
                    data["__p1__character-sabin"],
                    data["__p1__character-celes"],
                    data["__p1__character-strago"],
                    data["__p1__character-relm"],
                    data["__p1__character-setzer"],
                    data["__p1__character-mog"],
                    data["__p1__character-gau"],
                    data["__p1__character-gogo"],
                    data["__p1__character-umaro"]
                ]

                var characterArrayP2 = [
                    data["__p2__character-terra"],
                    data["__p2__character-locke"],
                    data["__p2__character-cyan"],
                    data["__p2__character-shadow"],
                    data["__p2__character-edgar"],
                    data["__p2__character-sabin"],
                    data["__p2__character-celes"],
                    data["__p2__character-strago"],
                    data["__p2__character-relm"],
                    data["__p2__character-setzer"],
                    data["__p2__character-mog"],
                    data["__p2__character-gau"],
                    data["__p2__character-gogo"],
                    data["__p2__character-umaro"]
                ]

                function checkForTrue(char) {
                    return char == true;
                  }

                var characterArrayP1Filtered = characterArrayP1.filter(checkForTrue);
                var characterArrayP2Filtered = characterArrayP2.filter(checkForTrue);
                
                // Tracker.updateLayout(
                //     '__p1__player-count', characterArrayP1Filtered.length
                // );
                
                Tracker.updateLayoutMultiple([
                    {property: '__p1__player-count', value: characterArrayP1Filtered.length},
                    {property: '__p2__player-count', value: characterArrayP2Filtered.length}                    
                ]);

                console.log(characterArrayP1Filtered.length + ", " + characterArrayP2Filtered.length)
            
                return data;
            }
            
            characterCountOne();
        })
    }

})(window.FF6 = window.FF6 || {});

FF6.init();