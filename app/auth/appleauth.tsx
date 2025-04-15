// /*

// Apple authetication code - sign in and sign out. This creates a button that will fetch email
// and password for apple ID.

// run npm install expo-apple-authentication

// see terminal output (console.log) for verification of sign in

// */
// import { auth } from "../Firebase/Firebase.js";
// import { doc, setDoc, getFirestore } from "firebase/firestore";
// import * as AppleAuthentication from "expo-apple-authentication";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";
// import React, { useState, useEffect } from "react";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { OAuthProvider, signInWithCredential } from "firebase/auth";

// export default function AppleAuth() {
//   const router = useRouter();
//   const [user, setUser] =
//     useState<AppleAuthentication.AppleAuthenticationCredential | null>(null);
//   const db = getFirestore();

//   useEffect(() => {
//     const checkStoredCredential = async () => {
//       const storedCredential = await SecureStore.getItemAsync(
//         "appleCredential"
//       );
//       if (storedCredential) {
//         setUser(JSON.parse(storedCredential));
//       }
//     };
//     checkStoredCredential();
//   }, []);

//   const resetFirstTimeFlag = async () => {
//     await AsyncStorage.removeItem("hasSignedInBefore");
//     console.log("Reset first-time flag");
//   };

//   const handleSignIn = async () => {
//     try {
//       const credential = await AppleAuthentication.signInAsync({
//         requestedScopes: [
//           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//           AppleAuthentication.AppleAuthenticationScope.EMAIL,
//         ],
//       });
//       console.log("Apple auth success", credential);

//       const provider = new OAuthProvider("apple.com");
//       provider.setCustomParameters({
//         client_id: "host.exp.Exponent",
//       });

//       const authCredential = provider.credential({
//         idToken: credential.identityToken!,
//         rawNonce: credential.nonce,
//       });

//       const userCredential = await signInWithCredential(auth, authCredential);
//       // const firebaseUserId = userCredential.user.uid;
//       // const isFirstTime = await AsyncStorage.getItem("hasSignedInBefore");

//       //Trying smn
//       // const appleUserID = credential.user;
//       // console.log("Apple User ID:", appleUserID);

//       await SecureStore.setItemAsync(
//         "appleCredential",
//         JSON.stringify(credential)
//       );
//       setUser(credential);

//       const appleUserID = credential.user;
//       await setDoc(doc(db, "users", appleUserID), {
//         appleUserID,
//         email: credential.email || null,
//         fullName: credential.fullName
//           ? "${credential.fullName.givenName} ${credential.fullName.familyName}"
//           : null,
//         createdAt: new Date().toISOString(),
//         lastLogin: new Date().toISOString(),
//       });

//       const isFirstTime = await AsyncStorage.getItem("hasSignedInBefore");
//       if (!isFirstTime) {
//         await AsyncStorage.setItem("hasSignedInBefore", "true");
//         console.log("not signed in before");
//         router.replace("/welcome/survey"); // First-time user → Survey
//         // await AsyncStorage.setItem("hasSignedInBefore", "true");
//       } else {
//         console.log("hasSignedInBefore");
//         router.replace("/(tabs)/home"); // Returning user → Home
//       }
//     } catch (e) {
//       console.error("Full error object:", e); // Log entire error

//       // if (e.code === "ERR_REQUEST_CANCELED") {
//       //   console.log("User canceled sign-in");
//       // } else {
//       //   console.error("Sign-in error:", {
//       //     message: e.message,
//       //     code: e.code,
//       //     stack: e.stack,
//       //   });

//       // Add temporary error display for debugging
//       alert(`Sign-in failed: ${e.message}`);
//     }
//   };

//   //   } catch (e) {
//   //     if (e instanceof Error) {
//   //       if (e.message === "ERR_REQUEST_CANCELED") {
//   //         console.log("canceled sign in flow ");
//   //       } else {
//   //         console.log("other cancel sign in error ");
//   //       }
//   //     }
//   //   }
//   // };

//   const handleSignOut = async () => {
//     await SecureStore.deleteItemAsync("appleCredential");
//     setUser(null);
//     console.log("Signed out successfully");

//     router.push("/welcome/welcome");
//   };

//   return (
//     <View style={styles.container}>
//       {!user ? (
//         <AppleAuthentication.AppleAuthenticationButton
//           buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
//           buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
//           cornerRadius={5}
//           style={styles.button}
//           onPress={handleSignIn}
//         />
//       ) : (
//         <>
//           <TouchableOpacity
//             onPress={handleSignOut}
//             style={styles.signOutButton}
//           >
//             <Text style={styles.text}>Sign Out</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={resetFirstTimeFlag}>
//             <Text
//               style={{
//                 fontSize: 20,
//                 color: "blue",
//                 margin: 20,
//                 textAlign: "center",
//               }}
//             >
//               Reset First-Time User (Dev only)
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   button: {
//     width: 300,
//     height: 55,
//   },
//   signOutButton: {
//     width: 300,
//     height: 55,
//     backgroundColor: "#ff293e",
//     justifyContent: "center",

//     paddingHorizontal: 40,
//     borderRadius: 5,
//     borderWidth: 2,
//     borderColor: "#ff293e",
//   },
//   text: {
//     color: "#ffffff",
//     textAlign: "center",
//     fontWeight: "bold",
//     fontSize: 20,
//   },
// });

// /*
// import * as AppleAuthentication from "expo-apple-authentication";
// import { View, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import React, { useState, useEffect } from "react";
// import * as SecureStore from "expo-secure-store";

// export default function AppleAuth() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <AppleAuthentication.AppleAuthenticationButton
//         buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
//         buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
//         cornerRadius={5}
//         style={styles.button}
//         onPress={async () => {
//           try {
//             const credential = await AppleAuthentication.signInAsync({
//               requestedScopes: [
//                 AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//                 AppleAuthentication.AppleAuthenticationScope.EMAIL,
//               ],
//             });
//             console.log("Apple auth success", credential);

//             router.replace("/(tabs)/home");
//             // signed in
//           } catch (e) {
//             if (e instanceof Error) {
//               if (e.message === "ERR_REQUEST_CANCELED") {
//                 // handle that the user canceled the sign-in flow
//                 console.log("canceled sign in flow ");
//               } else {
//                 // handle other errors
//                 console.log("other cancel sign in error ");
//               }
//             }
//           }
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   button: {
//     width: 200,
//     height: 44,
//   },
// });
// */

// import * as AppleAuthentication from "expo-apple-authentication";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";
// import React, { useState, useEffect } from "react";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { auth, db } from "../Firebase/Firebase.js";
// import {
//   OAuthProvider,
//   signInWithCredential,
//   onAuthStateChanged,
//   signOut,
//   User as FirebaseUser,
// } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// interface UserProfile {
//   uid: string;
//   email: string | null;
//   fullName: string | null;
//   provider: string;
//   createdAt: string;
//   lastLogin: string;
// }

// export default function AppleAuth() {
//   const router = useRouter();
//   const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
//   const [appleCredential, setAppleCredential] =
//     useState<AppleAuthentication.AppleAuthenticationCredential | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setFirebaseUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSignIn = async () => {
//     try {
//       const credential = await AppleAuthentication.signInAsync({
//         requestedScopes: [
//           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//           AppleAuthentication.AppleAuthenticationScope.EMAIL,
//         ],
//       });

//       const provider = new OAuthProvider("apple.com");
//       const firebaseCredential = provider.credential({
//         idToken: credential.identityToken!,
//         rawNonce: credential.nonce,
//       });

//       const userCredential = await signInWithCredential(
//         auth,
//         firebaseCredential
//       );

//       const userProfile: Partial<UserProfile> = {
//         uid: userCredential.user.uid,
//         email: credential.email || null,
//         fullName: credential.fullName
//           ? `${credential.fullName.givenName} ${credential.fullName.familyName}`
//           : null,
//         provider: "apple",
//         lastLogin: new Date().toISOString(),
//       };

//       const userRef = doc(db, "users", userCredential.user.uid);
//       const userDoc = await getDoc(userRef);

//       if (!userDoc.exists()) {
//         await setDoc(userRef, {
//           ...userProfile,
//           createdAt: new Date().toISOString(),
//         } as UserProfile);
//         console.log("New user created in Firestore");
//       } else {
//         await setDoc(userRef, userProfile, { merge: true });
//         console.log("User profile updated");
//       }

//       const isFirstTime = await AsyncStorage.getItem("hasSignedInBefore");
//       if (!isFirstTime) {
//         router.replace("/welcome/survey");
//         await AsyncStorage.setItem("hasSignedInBefore", "true");
//       } else {
//         router.replace("/(tabs)/home");
//       }
//     } catch (error) {
//       console.error("Authentication error:", error);
//       if (error instanceof Error && error.message === "ERR_REQUEST_CANCELED") {
//         console.log("User canceled Apple sign in");
//       }
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       await SecureStore.deleteItemAsync("appleCredential");
//       setFirebaseUser(null);
//       setAppleCredential(null);
//       console.log("Signed out successfully");
//       router.push("/welcome/welcome");
//     } catch (error) {
//       console.error("Sign out error:", error);
//     }
//   };

//   const resetFirstTimeFlag = async () => {
//     await AsyncStorage.removeItem("hasSignedInBefore");
//     console.log("Reset first-time flag");
//   };

//   return (
//     <View style={styles.container}>
//       {!firebaseUser ? (
//         <AppleAuthentication.AppleAuthenticationButton
//           buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
//           buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
//           cornerRadius={5}
//           style={styles.button}
//           onPress={handleSignIn}
//         />
//       ) : (
//         <>
//           <TouchableOpacity
//             onPress={handleSignOut}
//             style={styles.signOutButton}
//           >
//             <Text style={styles.text}>Sign Out</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={resetFirstTimeFlag}>
//             <Text style={styles.devButtonText}>
//               Reset First-Time User (Dev only)
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   button: {
//     width: 300,
//     height: 55,
//   },
//   signOutButton: {
//     width: 300,
//     height: 55,
//     backgroundColor: "#ff293e",
//     justifyContent: "center",
//     paddingHorizontal: 40,
//     borderRadius: 5,
//     borderWidth: 2,
//     borderColor: "#ff293e",
//   },
//   text: {
//     color: "#ffffff",
//     textAlign: "center",
//     fontWeight: "bold",
//     fontSize: 20,
//   },
//   devButtonText: {
//     fontSize: 20,
//     color: "blue",
//     margin: 20,
//     textAlign: "center",
//   },
// });

import * as AppleAuthentication from "expo-apple-authentication";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAppleFirstName = async () => {
  try {
    const storedName = await SecureStore.getItemAsync("appleFirstName");
    return storedName || "";
  } catch (error) {
    console.error("Error retrieving Apple name:", error);
  }
};

export default function AppleAuth() {
  const router = useRouter();
  const [user, setUser] =
    useState<AppleAuthentication.AppleAuthenticationCredential | null>(null);

  useEffect(() => {
    const checkStoredCredential = async () => {
      const storedCredential = await SecureStore.getItemAsync(
        "appleCredential"
      );
      if (storedCredential) {
        setUser(JSON.parse(storedCredential));
      }
    };
    checkStoredCredential();
  }, []);

  const resetFirstTimeFlag = async () => {
    await AsyncStorage.removeItem("hasSignedInBefore");
    console.log("Reset first-time flag");
  };

  const handleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log("Apple auth success", credential);
      await SecureStore.setItemAsync(
        "appleCredential",
        JSON.stringify(credential)
      );
      setUser(credential);
      const isFirstTime = await AsyncStorage.getItem("hasSignedInBefore");

      if (!isFirstTime) {
        console.log("not signed in before");
        router.replace("/welcome/survey"); // First-time user → Survey
        await AsyncStorage.setItem("hasSignedInBefore", "true");
      } else {
        console.log("hasSignedInBefore");
        router.replace("/(tabs)/home"); // Returning user → Home
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "ERR_REQUEST_CANCELED") {
          console.log("canceled sign in flow ");
        } else {
          console.log("other cancel sign in error ");
        }
      }
    }
  };

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync("appleCredential");
    setUser(null);
    console.log("Signed out successfully");

    router.push("/welcome/welcome");
  };

  return (
    <View style={styles.container}>
      {!user ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={styles.button}
          onPress={handleSignIn}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.text}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetFirstTimeFlag}>
            <Text
              style={{
                fontSize: 20,
                color: "blue",
                margin: 20,
                textAlign: "center",
              }}
            >
              Reset First-Time User (Dev only)
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 300,
    height: 55,
  },
  signOutButton: {
    width: 300,
    height: 55,
    backgroundColor: "#ff293e",
    justifyContent: "center",

    paddingHorizontal: 40,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ff293e",
  },
  text: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
});
