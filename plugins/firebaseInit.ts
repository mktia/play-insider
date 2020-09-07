import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCWNTBAjyXJvA409uGDUczYeC_1zda1lPQ',
  authDomain: 'play-insider.firebaseapp.com',
  databaseURL: 'https://play-insider.firebaseio.com',
  projectId: 'play-insider',
  storageBucket: 'play-insider.appspot.com',
  messagingSenderId: '753424729000',
  appId: '1:753424729000:web:8fd36487dac58f0275539d',
  measurementId: 'G-HE4Z3EDHGS'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
