import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  return (
    <View>
      <ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Settings</ThemedText>
        </ThemedView>
        <ThemedText>
          Visit the dropdown menus below to view your settings.
        </ThemedText>
        <Collapsible title="Profile">
          <ThemedText>profile</ThemedText>
        </Collapsible>
        <Collapsible title="Preferences">
          <ThemedText>Preferences</ThemedText>
        </Collapsible>
        <Collapsible title="Notifications">
          <ThemedText>notifications</ThemedText>
        </Collapsible>
        <Collapsible title="About">
          <ThemedText>about</ThemedText>
        </Collapsible>
        <Collapsible title="Logout">
          <ThemedText>logout</ThemedText>
          <TouchableOpacity
            onPress={() => router.push("/welcome")}
            style={{ backgroundColor: "#d4f3ff" }}
          >
            <ThemedText>Sign Out</ThemedText>
          </TouchableOpacity>
        </Collapsible>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
});
