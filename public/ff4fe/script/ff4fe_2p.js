(function(FF4) {

    FF4.init = function() {
        document.addEventListener("tr-layout", function(e) {
            if (!e.detail) {
                return;
            }

            let data = e.detail;
 

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

                function checkForTrue(char) {
                    return char == true;
                  }

                var characterArrayP1Filtered = characterArrayP1.filter(checkForTrue);
                var characterArrayP2Filtered = characterArrayP2.filter(checkForTrue);

                var p1PlayerCountCurrent = data["__p1__player-count"];
                var p2PlayerCountCurrent = data["__p2__player-count"];
                var p1PlayerCount = characterArrayP1Filtered.length;
                var p2PlayerCount = characterArrayP2Filtered.length;
                
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
            }



            var objectiveContentArray = [
                data["objective-one-text"],
                data["objective-two-text"],
                data["objective-three-text"],
                data["objective-four-text"],
                data["objective-five-text"],
                data["objective-six-text"],
                data["objective-seven-text"]
            ]

            // how many have text?

        let goalCount = document.querySelectorAll('.objective-goal-count');

        goalCount.forEach( function(item) {
            item.textContent.
        }) 



            characterCounts();
            return data;
        })
    }

})(window.FF4 = window.FF4 || {});

FF4.init();