/* 

Login screen. Users that press a 'Login' button will be redirected to this page.

run npm install expo-linear-gradient --> added a gradient background

*/

import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AppleAuth from "../auth/appleauth";
import { LinearGradient } from "expo-linear-gradient";

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
      <Image
        source={require("../../assets/images/eye.png")}
        style={{ height: 100, width: 100, marginBottom: -50, marginTop: 50 }}
      />
      <Text style={styles.text}>
        Get started by signing in with your Apple ID.
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

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  text: {
    color: "#ffffff",
    fontWeight: "bold",
    marginTop: 100,
    marginBottom: -100,
    textAlign: "center",
    fontSize: 25,
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
