/* 

Settings page

*/

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Switch,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";

import AppleAuth from "./auth/appleauth";

export default function SettingsScreen() {
  const router = useRouter();

  const [checklist, setChecklist] = useState([
    { id: 1, task: "Reminders", completed: false },
    { id: 2, task: "Announcements", completed: false },
    { id: 3, task: "Sound", completed: false },
    { id: 4, task: "Block Notifications", completed: false },
  ]);

  const toggleTaskCompletion = (id: number) => {
    setChecklist((prevChecklist) =>
      prevChecklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Settings</Text>
        </View>
        <Text style={[styles.text, { marginBottom: 15 }]}>
          Visit the dropdown menus below to view your settings.
        </Text>
        <Collapsible title="Profile">
          <Text style={styles.text}>profile</Text>
        </Collapsible>
        <Collapsible title="Preferences">
          <Text style={styles.text}>Preferences</Text>
        </Collapsible>
        <Collapsible title="Notifications">
          <View style={styles.checklistContainer}>
            {checklist.map((item) => (
              <View key={item.id} style={styles.checklistItem}>
                <Switch
                  value={item.completed}
                  onValueChange={() => toggleTaskCompletion(item.id)}
                />
                <Text
                  style={[
                    styles.checklistText,
                    item.completed && styles.completedTask,
                  ]}
                >
                  {item.task}
                </Text>
              </View>
            ))}
          </View>
        </Collapsible>
        <Collapsible title="About">
          <Text style={styles.text}>
            LENS: Lahey Engagement and Navigation Screening
          </Text>
          <Text style={styles.text}>Version: Alpha Prototype</Text>
          <Text style={styles.text}>
            App created by: University of Massachusetts Amherst, Department of
            Biomedical Engineering; Lahey Health and Medical Center
          </Text>
          <Text style={styles.text}>
            Developers: Lily Bigelow, Natalia Annibal, Jack Polcari, Elizabeth
            Curran
          </Text>
        </Collapsible>
        <Collapsible title="Logout">
          <View style={{ justifyContent: "center" }}>
            <AppleAuth />
          </View>
        </Collapsible>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  titleText: {
    fontSize: 30,
    color: "#000000",
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
    color: "white",
  },
  checklistContainer: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  checklistTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgb(181, 181, 181)",
    borderRadius: 5,
    width: "95%",
    marginVertical: 1,
  },
  checklistText: {
    fontSize: 16,
    color: "#a9a9a9",
    marginLeft: 10,
    fontWeight: "bold",
  },
  completedTask: {
    color: "black",
  },
});
