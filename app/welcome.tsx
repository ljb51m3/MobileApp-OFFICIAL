import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Redirect, useRouter } from "expo-router";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen() {
  const router = useRouter();

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

      <Text style={styles.title}>LENS</Text>
      <Text style={styles.subtitle}>
        Lahey Engagement for Navigating Screenings
      </Text>

      <View style={styles.buttonContainer}>
        <Image
          source={require("../assets/images/eye.png")}
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
          onPress={() => router.push("/auth/login")}
          style={styles.button}
        >
          <Text style={{ fontSize: 16, color: "#0f3180", fontWeight: "bold" }}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/signup")}
          style={styles.button}
        >
          <Text style={{ fontSize: 16, color: "#0f3180", fontWeight: "bold" }}>
            Register
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          style={styles.button}
        >
          <Text style={{ fontSize: 16, color: "#ff00bf", fontWeight: "bold" }}>
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
  link: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 400,
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
