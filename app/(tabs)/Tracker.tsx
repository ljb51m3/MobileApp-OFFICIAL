import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../(tabs)/Firebase/Firebase";
import { format } from "date-fns";

interface Log {
  id: string;
  userId: string;
  sleep: string;
  eating: string;
  exercise: string;
  date?: Date;
  timestamp?: Date;
}

const Tracker: React.FC = () => {
  const [sleep, setSleep] = useState<string>("");
  const [eating, setEating] = useState<string>("");
  const [exercise, setExercise] = useState<string>("");
  const [todayLog, setTodayLog] = useState<Log | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleTrackerSelection = (category: string, value: string) => {
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

  const saveLog = async () => {
    try {
      if (!auth.currentUser) {
        alert("Please sign in to save your log.");
        return;
      }

      await addDoc(collection(db, "logs"), {
        userId: auth.currentUser.uid,
        sleep,
        eating,
        exercise,
        date: new Date().toISOString().split("T")[0],
        timestamp: new Date(),
      });

      alert("Log saved successfully!");
    } catch (error) {
      console.error("Error saving log:", error);
      alert("Failed to save log");
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const logsRef = collection(db, "logs");
    const q = query(
      logsRef,
      where("userId", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp?.toDate(),
      })) as Log[];
      setLogs(logsData);
    });

    return () => unsubscribe();
  }, []);

  const goToPreviousLog = () => {
    setCurrentLogIndex((prev) => (prev > 0 ? prev - 1 : logs.length - 1));
  };

  const goToNextLog = () => {
    setCurrentLogIndex((prev) => (prev < logs.length - 1 ? prev + 1 : 0));
  };

  const currentLog = logs[currentLogIndex] || {};

  const formatDate = (date?: Date) => {
    return date ? format(date, "MMMM do, yyyy") : "No date";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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

      <TouchableOpacity style={styles.saveButton} onPress={saveLog}>
        <Text style={styles.saveButtonText}>
          {todayLog ? "Update Log" : "Save Log"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookIcon}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="book" size={32} color="#095da7" />
        {logs.length > 0 && (
          <View style={styles.logCountBadge}>
            <Text style={styles.logCountText}>{logs.length}</Text>
          </View>
        )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.navigationContainer}>
              <TouchableOpacity onPress={goToPreviousLog}>
                <Ionicons name="chevron-back" size={28} color="#095da7" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                {formatDate(currentLog.date)}
              </Text>

              <TouchableOpacity onPress={goToNextLog}>
                <Ionicons name="chevron-forward" size={28} color="#095da7" />
              </TouchableOpacity>
            </View>

            <View style={styles.logContent}>
              <Text style={styles.logLabel}>Sleep:</Text>
              <Text style={styles.logValue}>
                {currentLog.sleep || "Not logged"}
              </Text>

              <Text style={styles.logLabel}>Eating:</Text>
              <Text style={styles.logValue}>
                {currentLog.eating || "Not logged"}
              </Text>

              <Text style={styles.logLabel}>Exercise:</Text>
              <Text style={styles.logValue}>
                {currentLog.exercise || "Not logged"}
              </Text>
            </View>

            <Text style={styles.logCounter}>
              {logs.length > 0
                ? `${currentLogIndex + 1} of ${logs.length}`
                : "No logs yet"}
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 140, // Add extra padding at bottom to account for tab bar
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
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
    alignSelf: 'flex-end',
    marginTop: 20,
    marginRight: 10,
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
  saveButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#095da7",
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  logContent: {
    width: "100%",
    marginBottom: 20,
  },
  logLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  logValue: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
    paddingLeft: 10,
  },
  logCounter: {
    fontSize: 14,
    color: "#888",
    marginVertical: 10,
    textAlign: "center",
  },
  logCountBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#ff4757",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Tracker;
