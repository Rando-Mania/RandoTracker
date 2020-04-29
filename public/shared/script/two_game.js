if ('paintWorklet' in CSS) {
    CSS.paintWorklet.addModule('../shared/images/generic-fallback-worklet.js');
}

function playerDummyText() {
    Tracker.updateLayoutMultiple([

        {property: 'game-name', value: 'Star Wars'},
        {property: 'game-category', value: 'Sci-fi'},
        {property: 'game-system', value: 'Movie'},
        {property: 'game-length', value: '2:00:00'},
        {property: 'up-next', value: 'next game'},
        {property: 'free-text', value: 'free text'},
        
        {property: '__p1__player-name', value: 'Yoda'},
        {property: '__p1__player-pronoun', value: 'they/them'},
        {property: '__p1__player-number', value: 21},
        {property: '__p1__player-final', value: '1:23:45'},
        {property: '__p1__toggle-winner', value: 1},
        {property: '__p1__toggle-speaker', value: 1},
        
        {property: '__p2__player-name', value: 'AlbusPercivalWulfricBrianDumbledor'},
        {property: '__p2__player-pronoun', value: 'she/her'},
        {property: '__p2__player-number', value: 3},
        {property: '__p2__player-final', value: '1:23:45'},
        {property: '__p2__toggle-winner', value: 1},
        {property: '__p2__toggle-speaker', value: 1},
    ]);
}
function staffDummyText() {
    Tracker.updateLayoutMultiple([
        {property: 'commentators', value: 'Chewbacca\nJar Jar Binks'},
        {property: 'restreamers', value: 'R2D2'},
        {property: 'trackers', value: 'C3PO, BB-8'}
    ]);
}