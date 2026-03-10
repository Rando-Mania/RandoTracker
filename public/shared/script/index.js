const firebaseApp = firebase.initializeApp({ 
   apiKey: "AIzaSyC4NvceVKeICqLGiU3ttXamyxXwge6kpsg",
   authDomain: "rando-tracker.firebaseapp.com",
   databaseURL: "https://rando-tracker.firebaseio.com",
   projectId: "rando-tracker",
   storageBucket: "rando-tracker.appspot.com",
   messagingSenderId: "702318798371",
   appId: "1:702318798371:web:2cc16ec64401f48854f396"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();