if ('paintWorklet' in CSS) {
    CSS.paintWorklet.addModule('../shared/images/generic-fallback-worklet.js');
}

function playerDummyText() {
    Tracker.updateLayoutMultiple([
        {property: '__p1__player-name', value: 'AnakinSkywalker'},
        {property: '__p1__player-pronoun', value: 'they/them'},
        {property: '__p1__player-number', value: 1},
        {property: '__p1__player-final', value: '1:23:45'},
        {property: '__p1__toggle-speaker', value: 1},
        {property: '__p1__toggle-winner', value: 1},
        {property: '__p1__toggle-winner', value: 1},
        
        {property: '__p2__player-name', value: 'Yoda'},
        {property: '__p2__player-pronoun', value: ''},
        {property: '__p2__player-number', value: ''},
        {property: '__p2__player-final', value: ''},
        {property: '__p2__toggle-winner', value: 0},
        {property: '__p2__toggle-speaker', value: 1},
        
        {property: '__p3__player-name', value: 'The_GreenLeaf_Effect'},
        {property: '__p3__player-pronoun', value: 'he/him'},
        {property: '__p3__player-number', value: ''},
        {property: '__p3__player-final', value: '1:23:45'},
        {property: '__p3__toggle-winner', value: 0},
        {property: '__p3__toggle-speaker', value: 1},
    ]);
}
function staffDummyText() {
    Tracker.updateLayoutMultiple([
        {property: 'commentators', value: 'Chewbacca\nJar Jar Binks'},
        {property: 'restreamers', value: 'R2D2'},
        {property: 'trackers', value: 'C3PO, BB-8'}
    ]);
}