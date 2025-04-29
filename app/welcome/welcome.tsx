/* 

This is the first page users will be directed to when they open the app AND if they are not already authenticated.

If the user is already authenticated, they will not see this screen.

*/

import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function WelcomeScreen() {
  const router = useRouter();
  const [isNew, setIsNew] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsNew = async () => {
      try {
        // await AsyncStorage.removeItem("hasVisited"); // for debugging purposes
        const hasVisited = await AsyncStorage.getItem("hasVisited");
        //console.log("has visited?", hasVisited);
        //console.log("isNew?", isNew);
        if (hasVisited === null) {
          await AsyncStorage.setItem("hasVisited", "true");
          setIsNew(true);
        } else {
          //console.log("hasVisited != null");
          setIsNew(false);
        }
      } catch (e) {
        console.error("error checking isNew", e);
      }
    };

    // Ensure the check is only done once on mount
    checkIsNew();
  }, []); // Empty array ensures this only runs once

  useEffect(() => {
    if (isNew === true) {
      console.log("pushed to survey");
      router.push("/welcome/survey");
    }
  }, [isNew, router]);

  if (isNew === null) {
    console.log("loading");
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "rgba(0, 86, 224, 0.86)",
          "rgba(1, 107, 255, 0.8)",
          "rgba(0, 179, 255, 0.93)",
          "rgba(85, 210, 255, 0.93)",
        ]}
        style={styles.background}
      />

      <Text style={styles.title}>REMIN-DR</Text>
      <Text style={styles.subtitle}>
        BILH's Personal App for Diabetic Retinopathy
      </Text>

      <View style={styles.buttonContainer}>
        <Image
          source={require("../../assets/images/MainEye.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text
          style={{
            fontSize: 40,
            color: "#0f3180",
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Hi There!
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/welcome/login")}
          style={styles.button}
        >
          <Text style={{ fontSize: 16, color: "#0f3180", fontWeight: "bold" }}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Text style={{ fontSize: 16, color: "#fff", fontWeight: "bold" }}>
            dev only
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 75,
  },
  buttonContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    color: "#ffffff",
    textAlign: "center",
    fontSize: 60,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
    marginTop: 20,
  },
  subtitle: {
    flex: 1.5,
    color: "#ffffff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 425,
  },
  button: {
    width: 250,
    backgroundColor: "#d6f3ff",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#a6e6ff",
  },
});
