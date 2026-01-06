import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

// const firebaseConfig = {
//   databaseURL: '',
//   apiKey: '',
//   authDomain: '',
//   projectId: '',
//   storageBucket: '',
//   messagingSenderId: '',
//   appId: '',
//   measurementId: ''
// };
const firebaseConfigString = import.meta.env.REACT_APP_FIREBASE_CONFIG;
const firebaseConfig = firebaseConfigString ? JSON.parse(firebaseConfigString) : null;

if (!firebaseConfig) {
  console.error('Please set up your firebase config in .env file');
}

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage, firebase as default };
