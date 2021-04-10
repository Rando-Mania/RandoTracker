(function(FF6) {

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


    // document.addEventListener('DOMContentLoaded', function() {

    //     let dg = document.querySelector('[property="dragon-goal"] input');
    //     let ds = document.querySelectorAll('.icon-slot.dragons');

    //     function checkIfZero(){
    //         if (this.value == 0) {
    //             ds.forEach( function(item) {
    //                 item.classList.add('display-none')
    //             }) 
    //         }
    //         else {
    //             ds.forEach( function(item) {
    //                 item.classList.remove('display-none')
    //             })
    //         }
    //     }

    //     dg.addEventListener('change', checkIfZero);
    
    // });



    // document.addEventListener('DOMContentLoaded', function() {

        // setTimeout(function(){

            // let dg = document.querySelector('[property="dragon-goal"] input');
            // let ds = document.querySelectorAll('.icon-slot.dragons');

            // Tracker.getLayoutData(function(data) {
                
            //     if (data["dragon-goal"] == 0) {
            //         ds.forEach( function(item) {
            //             item.classList.add('display-none')
            //         }) 
            //     }
            //     else {
            //         ds.forEach( function(item) {
            //             item.classList.remove('display-none')
            //         })
            //     }
            // });

        // }, 3000);

    // });

    FF6.init = function() {
        Tracker.onUpdateLayout = function(data) {
            let ds = document.querySelectorAll('.icon-slot.dragons');

            if (data["dragon-goal"] == 0) {
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
    }

})(window.FF6 = window.FF6 || {});

FF6.init();