import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store"; // Import SecureStore for auth persistence

export default function RedirectToAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication
  const [isNewUser, setIsNewUser] = useState(false); // Track if it's a new user

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedCredential = await SecureStore.getItemAsync(
          "appleCredential"
        );
        let firstTimeUserFlag = await SecureStore.getItemAsync(
          "isFirstTimeUser"
        );

        if (storedCredential) {
          setIsAuthenticated(true);

          if (firstTimeUserFlag === null) {
            // If no flag exists, this is a first-time user
            setIsNewUser(true);
            await SecureStore.setItemAsync("isFirstTimeUser", "false"); // Mark as returning user
          } else {
            setIsNewUser(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/eye.png")}
          style={{ height: 100, width: 100, justifyContent: "center" }}
        />
        <Text style={{ fontSize: 60, textAlign: "center" }}>Loading...</Text>
      </View>
    );
  }

  // Ensure user must sign in after logging out
  if (!isAuthenticated) {
    return <Redirect href={"/welcome/welcome"} />;
  }

  // Redirect logic for authenticated users
  if (isAuthenticated) {
    if (isNewUser) {
      return <Redirect href={"/welcome/survey"} />;
    } else {
      return <Redirect href={"/(tabs)/home"} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
