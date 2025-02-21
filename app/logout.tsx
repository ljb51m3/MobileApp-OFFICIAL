/* 

Login screen. Users that press a 'Login' button will be redirected to this page.

run npm install expo-linear-gradient --> added a gradient background

*/

import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AppleAuth from "./auth/appleauth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function LogOutScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/eye.png")}
        style={{ height: 100, width: 100, padding: 10, marginTop: 75 }}
      />
      <Text style={[styles.text, { marginBottom: 75 }]}>
        You’ll be logged out from your account. Do you want to continue?
      </Text>

      <AppleAuth />

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.button, { marginTop: -240 }]}
        >
          <Text style={styles.buttonText}>Cancel</Text>
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
    padding: 50,
  },
  button: {
    width: 300,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#1164d9",
  },
  buttonText: {
    color: "#1164d9",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  text: {
    color: "#131642",
    fontWeight: "bold",
    marginTop: 0,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 0,
  },
});
