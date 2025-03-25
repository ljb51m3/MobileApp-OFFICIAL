/*

Apple authetication code - sign in and sign out. This creates a button that will fetch email
and password for apple ID.

run npm install expo-apple-authentication

see terminal output (console.log) for verification of sign in

*/
import * as AppleAuthentication from "expo-apple-authentication";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

/*
import * as AppleAuthentication from "expo-apple-authentication";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export default function AppleAuth() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            console.log("Apple auth success", credential);

            router.replace("/(tabs)/home");
            // signed in
          } catch (e) {
            if (e instanceof Error) {
              if (e.message === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
                console.log("canceled sign in flow ");
              } else {
                // handle other errors
                console.log("other cancel sign in error ");
              }
            }
          }
        }}
      />
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
    width: 200,
    height: 44,
  },
});
*/

// import * as AppleAuthentication from "expo-apple-authentication";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";
// import React, { useState, useEffect } from "react";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { auth, db } from "../(tabs)/Firebase/Firebase.js"; // Adjust path as needed
// import {
//   signInWithCredential,
//   OAuthProvider,
//   User,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// export default function AppleAuth() {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [appleCredential, setAppleCredential] =
//     useState<AppleAuthentication.AppleAuthenticationCredential | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });

//     const checkStoredCredential = async () => {
//       const storedCredential = await SecureStore.getItemAsync(
//         "appleCredential"
//       );
//       if (storedCredential) {
//         setAppleCredential(JSON.parse(storedCredential));
//       }
//     };
//     checkStoredCredential();

//     return () => unsubscribe();
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

//       // Save Apple credential to secure storage
//       await SecureStore.setItemAsync(
//         "appleCredential",
//         JSON.stringify(credential)
//       );
//       setAppleCredential(credential);

//       // Create Firebase credential
//       const provider = new OAuthProvider("apple.com");
//       const firebaseCredential = provider.credential({
//         idToken: credential.identityToken!,
//         rawNonce: credential.nonce,
//       });

//       // Sign in to Firebase
//       const userCredential = await signInWithCredential(
//         auth,
//         firebaseCredential
//       );
//       const firebaseUser = userCredential.user;

//       // Check if user exists in Firestore
//       const userDocRef = doc(db, "users", firebaseUser.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (!userDoc.exists()) {
//         // Create new user profile
//         await setDoc(userDocRef, {
//           uid: firebaseUser.uid,
//           email: credential.email || null,
//           fullName: credential.fullName
//             ? `${credential.fullName.givenName} ${credential.fullName.familyName}`
//             : null,
//           provider: "apple",
//           createdAt: new Date().toISOString(),
//           lastLogin: new Date().toISOString(),
//         });
//         console.log("New user profile created in Firestore");
//       } else {
//         // Update last login time for existing user
//         await setDoc(
//           userDocRef,
//           {
//             lastLogin: new Date().toISOString(),
//           },
//           { merge: true }
//         );
//         console.log("Existing user profile updated");
//       }

//       const isFirstTime = await AsyncStorage.getItem("hasSignedInBefore");

//       if (!isFirstTime) {
//         console.log("First-time user → Survey");
//         router.replace("/welcome/survey");
//         await AsyncStorage.setItem("hasSignedInBefore", "true");
//       } else {
//         console.log("Returning user → Home");
//         router.replace("/(tabs)/home");
//       }
//     } catch (e) {
//       if (e instanceof Error) {
//         if (e.message === "ERR_REQUEST_CANCELED") {
//           console.log("User canceled Apple sign in");
//         } else {
//           console.error("Apple authentication error:", e);
//         }
//       }
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await auth.signOut();
//       await SecureStore.deleteItemAsync("appleCredential");
//       setUser(null);
//       setAppleCredential(null);
//       console.log("Signed out successfully");
//       router.push("/welcome/welcome");
//     } catch (error) {
//       console.error("Sign out error:", error);
//     }
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
