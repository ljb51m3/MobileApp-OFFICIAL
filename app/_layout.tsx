// Theme imports.
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";

// Navigation Imports.
import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";

// File imports.
import SignUpScreen from "./auth/signup";
import LoginScreen from "./auth/login";
import TabLayout from "./(tabs)/_layout";
import { useState } from "react";

import { Redirect } from "expo-router";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
//const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // ********************************************************************************************
  // To create new pages, you must make a new .tsx file within the (tabs) folder.
  // Check directory to confirm if file is within (tabs).
  // Unless you need to define a new theme and style sheet, do not call individual pages here.
  // ********************************************************************************************

  return (
    <Stack>
      <Stack.Screen
        name="welcome"
        options={{ headerShown: false, title: "" }}
      />
      <Stack.Screen name="auth/login" options={{ title: "Login" }} />
      <Stack.Screen name="auth/signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

//<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//<Stack.Screen name="+not-found" />

//<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//<StatusBar style="auto" />
//</ThemeProvider>
//<Stack.Screen name="Login" component={LoginScreen} />

/*<Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Tabs" component={TabLayout} />
    </Stack.Navigator> */
