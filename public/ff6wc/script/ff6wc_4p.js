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
 
            // var updateDragonGoal = function (){
            //     let ds = document.querySelectorAll('.icon-slot.dragons');

            //     var dragonGoal = data["dragon-goal"] || "0";

            //     if (dragonGoal == "0") {
            //         ds.forEach( function(item) {
            //             item.classList.add('display-none')
            //         }) 
            //     }
            //     else {
            //         ds.forEach( function(item) {
            //             item.classList.remove('display-none')
            //         })
            //     }
            // }

            var characterCounts = function (){

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
                
                var characterArrayP3 = [
                    data["__p3__character-terra"],
                    data["__p3__character-locke"],
                    data["__p3__character-cyan"],
                    data["__p3__character-shadow"],
                    data["__p3__character-edgar"],
                    data["__p3__character-sabin"],
                    data["__p3__character-celes"],
                    data["__p3__character-strago"],
                    data["__p3__character-relm"],
                    data["__p3__character-setzer"],
                    data["__p3__character-mog"],
                    data["__p3__character-gau"],
                    data["__p3__character-gogo"],
                    data["__p3__character-umaro"]
                ]

                var characterArrayP4 = [
                    data["__p4__character-terra"],
                    data["__p4__character-locke"],
                    data["__p4__character-cyan"],
                    data["__p4__character-shadow"],
                    data["__p4__character-edgar"],
                    data["__p4__character-sabin"],
                    data["__p4__character-celes"],
                    data["__p4__character-strago"],
                    data["__p4__character-relm"],
                    data["__p4__character-setzer"],
                    data["__p4__character-mog"],
                    data["__p4__character-gau"],
                    data["__p4__character-gogo"],
                    data["__p4__character-umaro"]
                ]

                function checkForTrue(char) {
                    return char == true;
                  }

                var characterArrayP1Filtered = characterArrayP1.filter(checkForTrue);
                var characterArrayP2Filtered = characterArrayP2.filter(checkForTrue);
                var characterArrayP3Filtered = characterArrayP3.filter(checkForTrue);
                var characterArrayP4Filtered = characterArrayP4.filter(checkForTrue);

                var p1PlayerCountCurrent = data["__p1__player-count"];
                var p2PlayerCountCurrent = data["__p2__player-count"];
                var p3PlayerCountCurrent = data["__p3__player-count"];
                var p4PlayerCountCurrent = data["__p4__player-count"];
                var p1PlayerCount = characterArrayP1Filtered.length;
                var p2PlayerCount = characterArrayP2Filtered.length;
                var p3PlayerCount = characterArrayP3Filtered.length;
                var p4PlayerCount = characterArrayP4Filtered.length;
                
                if (p1PlayerCount != p1PlayerCountCurrent && p1PlayerCount > 0)
                {
                    Tracker.updateLayout(
                        '__p1__player-count', characterArrayP1Filtered.length
                    );
                }
                if (p2PlayerCount != p2PlayerCountCurrent && p2PlayerCount > 0)
                {
                    Tracker.updateLayout(
                        '__p2__player-count', characterArrayP2Filtered.length
                    );
                }
                if (p3PlayerCount != p3PlayerCountCurrent && p3PlayerCount > 0)
                {
                    Tracker.updateLayout(
                        '__p3__player-count', characterArrayP3Filtered.length
                    );
                }
                if (p4PlayerCount != p4PlayerCountCurrent && p4PlayerCount > 0)
                {
                    Tracker.updateLayout(
                        '__p4__player-count', characterArrayP4Filtered.length
                    );
                }
            }
            
            // updateDragonGoal();
            characterCounts();
            return data;
        })
    }

})(window.FF6 = window.FF6 || {});

FF6.init();