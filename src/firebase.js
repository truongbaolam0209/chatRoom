
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';



let firebaseConfig = {
    apiKey: "AIzaSyCRkoZuzREoPeY01DJu_SI1fMHJsx1EfHc",
    authDomain: "ci-36-tbl.firebaseapp.com",
    databaseURL: "https://ci-36-tbl.firebaseio.com",
    projectId: "ci-36-tbl",
    storageBucket: "ci-36-tbl.appspot.com",
    messagingSenderId: "922216491843",
    appId: "1:922216491843:web:20dfdf0f2ecf130d9eddf6"
};

firebase.initializeApp(firebaseConfig);



export default firebase;