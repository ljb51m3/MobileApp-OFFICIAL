import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppleAuth from "./appleauth";
import { LinearGradient } from "expo-linear-gradient";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function LoginScreen() {
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
      <Text
        style={{
          color: "#ffffff",
          fontWeight: "bold",
          marginTop: 100,
          textAlign: "center",
        }}
      >
        Get started by signing in below with your Apple ID.
      </Text>
      <AppleAuth />
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

/*  type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
  };

  type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Login"
  >;

  const navigation = useNavigation<LoginScreenNavigationProp>(); */
