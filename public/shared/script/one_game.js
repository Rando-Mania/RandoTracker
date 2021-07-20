function playerDummyText() {
    Tracker.updateLayoutMultiple([
        {property: '__p1__player-name', value: 'Yoda'},
        {property: '__p1__player-pronoun', value: 'they/them'},
        {property: '__p1__player-number', value: 21},
        {property: '__p1__player-final', value: '1:23:45'},
        {property: '__p1__toggle-winner', value: 1},
        {property: '__p1__toggle-speaker', value: 1},
        {property: 'game-name', value: 'Star Wars'},
        {property: 'game-category', value: 'Sci-fi'},
        {property: 'game-system', value: 'Movie'},
        {property: 'game-length', value: '2:00:00'},
        {property: 'up-next', value: 'next game'},
        {property: 'free-text', value: 'free text'},
    ]);
}
function staffDummyText() {
    Tracker.updateLayoutMultiple([
        {property: 'commentators', value: 'Chewbacca (he/him)\nJar Jar Binks (mee-sa/you-sa)'},
        {property: 'restreamers', value: 'R2D2'},
        {property: 'trackers', value: 'C3PO, BB-8'}
    ]);
}