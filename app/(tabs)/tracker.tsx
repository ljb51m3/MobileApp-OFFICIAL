import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabThreeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#ff2146", dark: "#570e1a" }}
      headerImage={
        <IconSymbol
          size={250}
          color="#ffcfd7"
          name="figure.taichi"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Linking</ThemedText>
      </ThemedView>
      <ThemedText>
        This is an example page for linking MyChart and MyBILH.
      </ThemedText>
      <Collapsible title="MyChart">
        <ThemedText>test test test test</ThemedText>
        <ExternalLink href="https://www.mychart.org/">
          <ThemedText type="link">Go to MyChart Website Now</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="MyBILH">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <ThemedText type="defaultSemiBold">w</ThemedText>{" "}
          in the terminal running this project.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
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
    flexDirection: "row",
    gap: 8,
  },
});
