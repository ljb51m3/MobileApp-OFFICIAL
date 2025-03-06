import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LinkingScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Want to view your health records and test results?
      </Text>
      <TouchableOpacity
        onPress={() => router.push("https://www.mychart.org/")}
        style={[
          styles.button,
          { backgroundColor: "#ffc9c9", borderColor: "#ff6363" },
        ]}
      >
        <Text style={styles.buttonText}> Visit MyChart</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Already have the MyBILH app?</Text>
      <TouchableOpacity
        onPress={() =>
          router.push(
            "https://mychart.bilh.org/MyChart-BILH/Authentication/Login?"
          )
        }
        style={[
          styles.button,
          { backgroundColor: "#c4eaff", borderColor: "#4abfff" },
        ]}
      >
        <Text style={styles.buttonText}> Visit MyBILH</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold",
  },
  link: {
    fontSize: 16,
    color: "rgb(85, 0, 255)",
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    width: 250,
    height: 55,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
  },
});
