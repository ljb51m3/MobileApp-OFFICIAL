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

const Tracker = () => {
  const [sleep, setSleep] = useState("");
  const [eating, setEating] = useState("");
  const [exercise, setExercise] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

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

      <TouchableOpacity
        style={styles.bookIcon}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="book" size={32} color="#095da7" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Today's Log</Text>
            <Text>Sleep: {sleep || "Not logged"}</Text>
            <Text></Text>
            <Text>Eating: {eating || "Not logged"}</Text>
            <Text></Text>
            <Text>Exercise: {exercise || "Not logged"}</Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 630,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
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
  buttonText: {
    fontSize: 14,
    color: "#333",
  },
  bookIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#095da7",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Tracker;
