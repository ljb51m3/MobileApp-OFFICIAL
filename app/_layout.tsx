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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

  return (
    <Stack>
      <Stack.Screen
        name="welcome/welcome"
        options={{ headerShown: false, title: "" }}
      />
      <Stack.Screen name="welcome/login" options={{ title: "Sign In" }} />
      <Stack.Screen name="welcome/signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="logout" options={{ headerShown: false, title: "" }} />
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
