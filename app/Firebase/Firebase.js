// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBgDn4FqswujEIzHuANMUb-YpX12sE1M7g",
//   authDomain: "dr-mobile-app.firebaseapp.com",
//   projectId: "dr-mobile-app",
//   storageBucket: "dr-mobile-app.appspot.com",
//   messagingSenderId: "298967418445",
//   appId: "1:298967418445:android:c8473c547a7d5053087e04",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// export { db, auth };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgDn4FqswujEIzHuANMUb-YpX12sE1M7g",
  authDomain: "dr-mobile-app.firebaseapp.com",
  projectId: "dr-mobile-app",
  storageBucket: "dr-mobile-app.appspot.com",
  messagingSenderId: "298967418445",
  appId: "1:298967418445:android:c8473c547a7d5053087e04",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export default function FirebaseConfig() {
  return null;
}

export { db, auth };
