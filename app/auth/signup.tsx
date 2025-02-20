import * as React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import AppleAuth from "./appleauth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
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
      <AppleAuth />
      <Text style={{ color: "#ffffff", flex: 2 }}>
        Already have an account? Login{" "}
        <Text style={styles.link} onPress={() => router.push("/auth/login")}>
          here.
        </Text>{" "}
      </Text>
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
  title: {
    flex: 1,
    color: "#ffffff",
    textAlign: "center",
    fontSize: 60,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  subtitle: {
    flex: 2,
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
    bottom: 0,
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
