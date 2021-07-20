if ('paintWorklet' in CSS) {
    CSS.paintWorklet.addModule('../shared/images/generic-fallback-worklet.js');
}

function playerDummyText() {
    Tracker.updateLayoutMultiple([
        {property: '__p1__player-name', value: 'AnakinSkywalker'},
        {property: '__p1__player-final', value: '1:23:45'},
        {property: '__p1__toggle-speaker', value: 1},
        {property: '__p1__toggle-winner', value: 1},
        {property: '__p1__player-pronoun', value: 'he/him'},
        {property: '__p1__player-record', value: '1-2'},

        {property: '__p2__player-name', value: 'Yoda'},
        {property: '__p2__player-final', value: '1:23:45'},
        {property: '__p2__toggle-winner', value: 1},
        {property: '__p2__toggle-speaker', value: 1},
        {property: '__p2__player-pronoun', value: 'he/him'},
        {property: '__p2__player-record', value: '1-2'},
    ]);
}
function staffDummyText() {
    Tracker.updateLayoutMultiple([
        {property: 'commentators', value: 'Chewbacca (he/him)\nJar Jar Binks (meesa/yousa)'},
        {property: 'restreamers', value: 'R2D2'},
        {property: 'trackers', value: 'C3PO, BB-8'}
    ]);
}
// tracker.init(){
//     Tracker.getLayoutData(function(data) {
//         if (data["11"] || data["12"] || data["13"] || data["14"] || data["15"] || data["16"]) {
//             Tracker.updateLayout('objective-one-text','Have Kokkol forge Legend Sword with Adamant')
//         } else {
//             Tracker.updateLayout('objective-one-text','')
//         }
//     });
// }