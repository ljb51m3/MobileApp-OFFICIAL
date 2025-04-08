// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from "react-native";
// import ClaimPointsModal from "../../components/ClaimPointsModal";

// const MascotPage = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [points, setPoints] = useState(0);
//   const [selectedTask, setSelectedTask] = useState(Object);

//   const tasks = [
//     { id: 1, text: "Eat a well-balanced meal", points: 10 },
//     { id: 2, text: "Exercise for 30 minutes", points: 15 },
//     { id: 3, text: "Take your medication", points: 5 },
//     { id: 4, text: "Check blood sugar levels", points: 5 },
//   ];

//   const handleTaskClick = (task: any) => {
//     setSelectedTask(task);
//     setModalVisible(true);
//   };

//   const claimPoints = () => {
//     if (selectedTask) {
//       setPoints(points + selectedTask.points);
//       setModalVisible(false);
//     }
//   };

//   return (
//     <>
//       <View style={styles.pointsContainer}>
//         <Text style={styles.pointsText}>Total Points: {points}</Text>
//       </View>
//       <>
//         <Image
//           source={require("../../assets/images/Eyeball.png")}
//           style={styles.petImage}
//         />
//         <ScrollView style={styles.container}>
//           <View style={styles.tasksContainer}>
//             {tasks.map((task) => (
//               <View key={task.id} style={styles.taskItem}>
//                 <Text style={styles.taskText}>{task.text}</Text>
//                 <TouchableOpacity
//                   style={styles.taskButton}
//                   onPress={() => handleTaskClick(task)}
//                 >
//                   <Text style={styles.buttonText}>Claim</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>

//           <ClaimPointsModal
//             visible={modalVisible}
//             onClose={() => setModalVisible(false)}
//             onClaimPoints={claimPoints}
//             task={selectedTask ? selectedTask.text : ""}
//             points={selectedTask ? selectedTask.points : 0}
//           />
//         </ScrollView>
//       </>
//     </>
//   );
// };

// const styles = StyleSheet.create({
// container: {
//   flex: 1,
//   padding: 20,
//   backgroundColor: "#f5f5f5",
// },
// pointsContainer: {
//   alignSelf: "center",
//   backgroundColor: "#96cbf9",
//   borderWidth: 2,
//   borderColor: "#fff",
//   borderRadius: 10,
//   padding: 15,
//   marginTop: 20,
//   elevation: 3,
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.1,
//   shadowRadius: 4,
// },
// pointsText: {
//   fontSize: 18,
//   fontWeight: "bold",
//   color: "#095da7",
// },
// tasksContainer: {
//   marginTop: 20,
// },
// taskItem: {
//   flexDirection: "row",
//   alignItems: "center",
//   justifyContent: "space-between",
//   marginBottom: 10,
//   padding: 10,
//   backgroundColor: "#fff",
//   borderRadius: 5,
//   elevation: 2,
// },
// taskText: {
//   fontSize: 16,
// },
// taskButton: {
//   backgroundColor: "#095da7",
//   padding: 10,
//   borderRadius: 5,
// },
// buttonText: {
//   color: "white",
//   fontWeight: "bold",
// },
// petImage: {
//   width: 280,
//   height: 200,
//   alignSelf: "center",
//   marginTop: 10,
// },
// });

// export default MascotPage;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClaimPointsModal from "../../components/ClaimPointsModal";

interface Task {
  id: number;
  text: string;
  points: number;
}

interface AppData {
  points: number;
  lastUpdated: string;
  completed: Record<number, boolean>;
  dailyTasks: Task[];
}

const ALL_TASKS: Task[] = [
  { id: 1, text: "Eat a well-balanced meal", points: 10 },
  { id: 2, text: "Exercise for 30 minutes", points: 15 },
  { id: 3, text: "Take your medication", points: 5 },
  { id: 4, text: "Check blood sugar levels", points: 5 },
  { id: 5, text: "Drink 8 glasses of water", points: 8 },
  { id: 6, text: "Meditate for 10 minutes", points: 7 },
  { id: 7, text: "Get 8 hours of sleep", points: 12 },
  { id: 8, text: "Take vitamins", points: 5 },
];

const MascotPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    const initializeTasks = async () => {
      try {
        const today = new Date().toDateString();
        const savedData = await AsyncStorage.getItem("@MascotAppData");
        const data: AppData = savedData
          ? JSON.parse(savedData)
          : { points: 0, lastUpdated: "", completed: {}, dailyTasks: [] };

        if (data.lastUpdated !== today) {
          const shuffled = [...ALL_TASKS].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 4);
          setDailyTasks(selected);

          await AsyncStorage.setItem(
            "@MascotAppData",
            JSON.stringify({
              points: data.points,
              lastUpdated: today,
              completed: {},
              dailyTasks: selected,
            } as AppData)
          );
        } else {
          setDailyTasks(data.dailyTasks || []);
          setCompletedTasks(data.completed || {});
        }

        setPoints(data.points || 0);
      } catch (error) {
        console.error("Failed to initialize tasks:", error);
      }
    };

    initializeTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    if (!completedTasks[task.id]) {
      setSelectedTask(task);
      setModalVisible(true);
    }
  };

  const claimPoints = async () => {
    if (selectedTask && !completedTasks[selectedTask.id]) {
      const newPoints = points + selectedTask.points;
      const newCompleted = { ...completedTasks, [selectedTask.id]: true };

      setPoints(newPoints);
      setCompletedTasks(newCompleted);
      setModalVisible(false);

      try {
        const today = new Date().toDateString();
        await AsyncStorage.setItem(
          "@MascotAppData",
          JSON.stringify({
            points: newPoints,
            lastUpdated: today,
            completed: newCompleted,
            dailyTasks,
          } as AppData)
        );
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };

  return (
    <>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>Total Points: {points}</Text>
      </View>

      <Image
        source={require("../../assets/images/Eyeball.png")}
        style={styles.petImage}
      />

      <ScrollView style={styles.container}>
        <View style={styles.tasksContainer}>
          {dailyTasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskItem,
                completedTasks[task.id] && styles.completedTask,
              ]}
            >
              <Text style={styles.taskText}>{task.text}</Text>
              <TouchableOpacity
                style={[
                  styles.taskButton,
                  completedTasks[task.id] && styles.disabledButton,
                ]}
                onPress={() => handleTaskClick(task)}
                disabled={completedTasks[task.id]}
              >
                <Text style={styles.buttonText}>
                  {completedTasks[task.id] ? "Completed" : "Claim"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <ClaimPointsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onClaimPoints={claimPoints}
          task={selectedTask?.text || ""}
          points={selectedTask?.points || 0}
        />
        {__DEV__ && (
          <TouchableOpacity
            style={styles.debugButton}
            onPress={async () => {
              await AsyncStorage.removeItem("@MascotAppData");
              alert(
                "Developer Mode: Daily tasks reset!\nReopen the app to see new tasks."
              );
            }}
          >
            <Text style={styles.debugButtonText}>DEV: Reset Day</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  debugButton: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 5 : 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    zIndex: 100,
  },
  debugButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
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
  completedTask: {
    opacity: 0.6,
    backgroundColor: "#e0e0e0",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
});

export default MascotPage;
