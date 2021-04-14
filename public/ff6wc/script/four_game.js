if ('paintWorklet' in CSS) {
    CSS.paintWorklet.addModule('../shared/images/generic-fallback-worklet.js');
}

function playerDummyText() {
    Tracker.updateLayoutMultiple([
        {property: '__p1__player-name', value: 'AnakinSkywalker'},
        {property: '__p1__player-pronoun', value: 'he/him'},
        {property: '__p1__toggle-winner', value: 1},
        
        {property: '__p2__player-name', value: 'Yoda'},
        {property: '__p2__player-pronoun', value: 'they/them'},
        {property: '__p2__player-final', value: '1:23:45'},
        {property: '__p2__toggle-winner', value: 1},
        {property: '__p2__toggle-speaker', value: 1},
        
        {property: '__p3__player-name', value: 'AlbusPercivalWulfricBrianDumbledor'},
        {property: '__p3__player-pronoun', value: 'she/her'},
        {property: '__p3__player-final', value: '1:23:45'},
        {property: '__p3__toggle-speaker', value: 1},
        
        {property: '__p4__player-name', value: 'SeverusSnape'},
        {property: '__p4__player-pronoun', value: 'he/him'},
        {property: '__p4__toggle-winner', value: 1},
        {property: '__p4__toggle-speaker', value: 1}
    ]);
}
function staffDummyText() {
    Tracker.updateLayoutMultiple([
        {property: 'commentators', value: 'Chewbacca (he/him)\nJar Jar Binks (messa)'},
        {property: 'restreamers', value: 'R2D2 (he/him)'},
        {property: 'trackers', value: 'C3PO (he/they)\nBB-8 (he/him)'}
    ]);
}

function subheadingDummyText() {
    Tracker.updateLayoutMultiple([
        {property: 'subheading', value: 'Weekly Community Race'},
    ]);
}