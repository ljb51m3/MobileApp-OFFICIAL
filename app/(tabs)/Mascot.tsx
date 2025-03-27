import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import ClaimPointsModal from "../../components/ClaimPointsModal";

const MascotPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [points, setPoints] = useState(0);
  const [selectedTask, setSelectedTask] = useState(Object);

  const tasks = [
    { id: 1, text: "Eat a well-balanced meal", points: 10 },
    { id: 2, text: "Exercise for 30 minutes", points: 15 },
    { id: 3, text: "Take your medication", points: 5 },
    { id: 4, text: "Check blood sugar levels", points: 5 },
  ];

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const claimPoints = () => {
    if (selectedTask) {
      setPoints(points + selectedTask.points);
      setModalVisible(false);
    }
  };

  return (
    <>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>Total Points: {points}</Text>
      </View>
      <>
        <Image
          source={require("../../assets/images/Eyeball.png")}
          style={styles.petImage}
        />
        <ScrollView style={styles.container}>
          <View style={styles.tasksContainer}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskText}>{task.text}</Text>
                <TouchableOpacity
                  style={styles.taskButton}
                  onPress={() => handleTaskClick(task)}
                >
                  <Text style={styles.buttonText}>Claim</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <ClaimPointsModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onClaimPoints={claimPoints}
            task={selectedTask ? selectedTask.text : ""}
            points={selectedTask ? selectedTask.points : 0}
          />
        </ScrollView>
      </>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  pointsContainer: {
    alignSelf: "center",
    backgroundColor: "#96cbf9",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#095da7",
  },
  tasksContainer: {
    marginTop: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
  },
  taskButton: {
    backgroundColor: "#095da7",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  petImage: {
    width: 280,
    height: 200,
    alignSelf: "center",
    marginTop: 10,
  },
});

export default MascotPage;
