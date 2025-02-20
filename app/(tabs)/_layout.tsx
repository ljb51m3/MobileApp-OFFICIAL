import { Tabs, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import handleSignOut from "../auth/appleauth";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true, // top navigation bar
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: 110,
        },
        headerTintColor: Colors[colorScheme ?? "light"].text,
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push("/logout")}>
            <View style={{ marginRight: 15, alignItems: "center" }}>
              <Feather name="log-out" size={28} color="grey" />
            </View>
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <View style={{ marginLeft: 15, alignItems: "center" }}>
              <Feather name="settings" size={28} color="grey" />
            </View>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Calendar Code"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar-check-o" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="linking"
        options={{
          title: "My Health",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="notes-medical" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "My Doctors",
          tabBarIcon: ({ color }) => (
            <Feather name="phone-call" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
