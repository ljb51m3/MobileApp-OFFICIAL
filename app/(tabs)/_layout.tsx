import { Tabs, useRouter } from "expo-router";
import React from "react";
import { View, Platform, TouchableOpacity } from "react-native";

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
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '700',
          flex: 1,
          textAlign: 'center',
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            height: 120, // Increased for more space
            paddingTop: 10,
          },
          default: {
            height: 120, // Increased for more space
            paddingTop: 10,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginTop: 12, // Increased space between icon and text
          paddingBottom: 25, // Increased bottom padding for text
        },
        tabBarIconStyle: {
          marginTop: 15, // Move icons up more
          height: 32, // Explicit height for icon container
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: 110,
        },
        headerLeftContainerStyle: {
          paddingLeft: 15,
        },
        headerRightContainerStyle: {
          paddingRight: 15,
        },
        headerTitleContainerStyle: {
          maxWidth: '60%',
          paddingBottom: 15, // Add padding to lower the title
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
            <IconSymbol size={32} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Calendar Code"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar-check-o" size={32} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="linking"
        options={{
          title: "MyHealth",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="notes-medical" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "My Doctors",
          tabBarIcon: ({ color }) => (
            <Feather name="phone-call" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Mascot"
        options={{
          title: "Mascot",
          tabBarIcon: ({ color }) => (
            <Feather name="eye" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Tracker"
        options={{
          title: "Track Your Health",
          tabBarIcon: ({ color }) => (
            <Feather name="edit" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Education"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => (
            <Feather name="book" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
