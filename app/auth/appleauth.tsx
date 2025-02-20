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
      router.replace("/(tabs)/home");
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
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
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
