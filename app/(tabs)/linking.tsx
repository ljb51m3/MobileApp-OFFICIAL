import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CombinedScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Tracker");
  const [sleep, setSleep] = useState("");
  const [eating, setEating] = useState("");
  const [exercise, setExercise] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleTrackerSelection = (category: string, value: any) => {
    switch (category) {
      case "sleep":
        setSleep(value);
        break;
      case "eating":
        setEating(value);
        break;
      case "exercise":
        setExercise(value);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "Tracker" && styles.activeTab]}
          onPress={() => setSelectedTab("Tracker")}
        >
          <Text style={styles.tabText}>Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "Links" && styles.activeTab]}
          onPress={() => setSelectedTab("Links")}
        >
          <Text style={styles.tabText}>Health Links</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "Tracker" ? (
        <>
          <Text style={styles.sectionTitle}>Daily Tracker</Text>

          <View style={styles.trackerCategory}>
            <Text style={styles.trackerLabel}>Sleeping Patterns</Text>
            <View style={styles.buttonContainer}>
              {["4-6 hrs", "6-8 hrs", "8-10 hrs"].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.trackerButton,
                    sleep === option && styles.selectedButton,
                  ]}
                  onPress={() => handleTrackerSelection("sleep", option)}
                >
                  <Text style={styles.buttonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.trackerCategory}>
            <Text style={styles.trackerLabel}>Eating Habits</Text>
            <View style={styles.buttonContainer}>
              {["Healthy", "Moderate", "Unhealthy"].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.trackerButton,
                    eating === option && styles.selectedButton,
                  ]}
                  onPress={() => handleTrackerSelection("eating", option)}
                >
                  <Text style={styles.buttonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.trackerCategory}>
            <Text style={styles.trackerLabel}>Exercise</Text>
            <View style={styles.buttonContainer}>
              {["None", "30 mins", "1 hr", "1.5+ hrs"].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.trackerButton,
                    exercise === option && styles.selectedButton,
                  ]}
                  onPress={() => handleTrackerSelection("exercise", option)}
                >
                  <Text style={styles.buttonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.bookIcon} onPress={() => setModalVisible(true)}>
            <Ionicons name="book" size={32} color="#095da7" />
          </TouchableOpacity>

          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Today's Log</Text>
                <Text>Sleep: {sleep || "Not logged"}</Text>
                <Text>Eating: {eating || "Not logged"}</Text>
                <Text>Exercise: {exercise || "Not logged"}</Text>

                <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Health Records & Results</Text>
          <TouchableOpacity
            onPress={() => router.push("https://www.mychart.org/")}
            style={[styles.linkButton, { backgroundColor: "#ffc9c9" }]}
          >
            <Text style={styles.buttonText}>Visit MyChart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("https://mychart.bilh.org/MyChart-BILH/Authentication/Login?")}
            style={[styles.linkButton, { backgroundColor: "#c4eaff" }]}
          >
            <Text style={styles.buttonText}>Visit MyBILH</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    height: "100%",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    width: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: "#96cbf9",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  trackerCategory: {
    marginBottom: 15,
  },
  trackerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  trackerButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#96cbf9",
    borderColor: "#96cbf9",
  },
  bookIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#095da7",
    borderRadius: 5,
  },
  linkButton: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CombinedScreen;
