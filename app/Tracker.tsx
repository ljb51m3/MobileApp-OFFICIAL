import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { toZonedTime, format as tzFormat } from "date-fns-tz";
import { usePoints } from "../components/PointsSystem";
import TotalPoints from "../components/TotalPoints";
import ClaimPointsModal from "../components/ClaimPointsModal";
import { Calendar } from "react-native-calendars";

interface Log {
  id: string;
  sleep: string;
  eating: string;
  exercise: string;
  date: string;
  timestamp: number;
  viewed?: boolean;
}

const STORAGE_KEY = "userLogs";

const TODAY_SELECTIONS_KEY = "todaySelections";
const LAST_SAVED_DATE_KEY = "lastSavedDate";

interface DailySelections {
  sleep: string;
  eating: string;
  exercise: string;
}

const Tracker: React.FC = () => {
  const [sleep, setSleep] = useState<string>("");
  const [eating, setEating] = useState<string>("");
  const [exercise, setExercise] = useState<string>("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showBadge, setShowBadge] = useState<boolean>(true);
  const [claimPointsModalVisible, setClaimPointsModalVisible] =
    useState<boolean>(false);
  const { points, addPoints } = usePoints();
  const [unviewedLogCount, setUnviewedLogCount] = useState<number>(0);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [sortedLogs, setSortedLogs] = useState<Log[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const savedLogs = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLogs) {
          const parsedLogs: Log[] = JSON.parse(savedLogs);
          setLogs(parsedLogs);

          const marked: {
            [key: string]: { marked: boolean; dotColor: string };
          } = {};
          parsedLogs.forEach((log) => {
            marked[log.date] = {
              marked: true,
              dotColor: log.viewed ? "#999" : "#ff4757",
            };
          });
          setMarkedDates(marked);

          const unviewed = parsedLogs.filter((log) => !log.viewed);
          setUnviewedLogCount(unviewed.length);
        }
      } catch (error) {
        console.error("Failed to load logs", error);
      }
    };
    loadLogs();
  }, []);

  useEffect(() => {
    const saveLogs = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        const unviewed = logs.filter((log) => !log.viewed);
        setUnviewedLogCount(unviewed.length);
      } catch (error) {
        console.error("Failed to save logs", error);
        Alert.alert("Error", "Failed to save logs to storage");
      }
    };

    if (logs.length > 0) {
      saveLogs();
    }
  }, [logs]);

  useEffect(() => {
    const loadAndResetSelections = async () => {
      try {
        const today = getTodayDateString();
        const lastSavedDate = await AsyncStorage.getItem(LAST_SAVED_DATE_KEY);

        if (lastSavedDate !== today) {
          await AsyncStorage.multiRemove([
            TODAY_SELECTIONS_KEY,
            LAST_SAVED_DATE_KEY,
          ]);
          await AsyncStorage.setItem(LAST_SAVED_DATE_KEY, today);
          setSleep("");
          setEating("");
          setExercise("");
          return;
        }

        const savedSelections = await AsyncStorage.getItem(
          TODAY_SELECTIONS_KEY
        );
        if (savedSelections) {
          const parsedSelections: DailySelections = JSON.parse(savedSelections);
          setSleep(parsedSelections.sleep);
          setEating(parsedSelections.eating);
          setExercise(parsedSelections.exercise);
        }
      } catch (error) {
        console.error("Error loading/resetting selections:", error);
      }
    };

    loadAndResetSelections();
  }, []);

  const handleTrackerSelection = async (
    category: keyof DailySelections,
    value: string
  ) => {
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
        const exhaustiveCheck: never = category;
        return exhaustiveCheck;
    }

    try {
      const selections: DailySelections = {
        sleep: category === "sleep" ? value : sleep,
        eating: category === "eating" ? value : eating,
        exercise: category === "exercise" ? value : exercise,
      };
      await AsyncStorage.setItem(
        TODAY_SELECTIONS_KEY,
        JSON.stringify(selections)
      );
    } catch (error) {
      console.error("Error saving selection:", error);
      // Revert UI if save fails
      switch (category) {
        case "sleep":
          setSleep("");
          break;
        case "eating":
          setEating("");
          break;
        case "exercise":
          setExercise("");
          break;
      }
    }
  };

  const saveLog = async () => {
    if (!sleep || !eating || !exercise) {
      Alert.alert("Incomplete Log", "Please select options for all categories");
      return;
    }

    const today = getTodayDateString();
    const now = Date.now();

    try {
      const updatedLogs = [...logs];
      const existingLogIndex = updatedLogs.findIndex(
        (log) => log.date === today
      );

      const logEntry: Log = {
        id: now.toString(),
        sleep,
        eating,
        exercise,
        date: today,
        timestamp: now,
        viewed: false,
      };

      if (existingLogIndex !== -1) {
        updatedLogs[existingLogIndex] = logEntry;
        Alert.alert("Success", "Today's log updated successfully!");
      } else {
        updatedLogs.unshift(logEntry);
        setUnviewedLogCount((prev) => prev + 1);
        setClaimPointsModalVisible(true);
        setShowBadge(true);
      }

      setLogs(updatedLogs);

      await AsyncStorage.removeItem(TODAY_SELECTIONS_KEY);
    } catch (error) {
      console.error("Error saving log:", error);
      Alert.alert("Error", "Failed to save log");
    }
  };

  const handleBookIconPress = async () => {
    const updatedLogs = logs.map((log) => ({
      ...log,
      viewed: true,
    }));

    setLogs(updatedLogs);
    setModalVisible(true);
  };

  const goToPreviousLog = () => {
    if (logs.length === 0) return;

    setCurrentLogIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : logs.length - 1;
      markLogAsViewed(newIndex);
      return newIndex;
    });
    setShowCalendar(false);
  };

  const goToNextLog = () => {
    if (logs.length === 0) return;

    setCurrentLogIndex((prev) => {
      const newIndex = prev < logs.length - 1 ? prev + 1 : 0;
      markLogAsViewed(newIndex);
      return newIndex;
    });
    setShowCalendar(false);
  };

  const markLogAsViewed = (index: number) => {
    const updatedLogs = [...logs];
    if (!updatedLogs[index].viewed) {
      updatedLogs[index].viewed = true;
      setLogs(updatedLogs);
      const updatedMarkedDates: Record<string, { dotColor: string }> = {
        ...markedDates,
      };
      updatedMarkedDates[updatedLogs[index].date] = {
        ...updatedMarkedDates[updatedLogs[index].date],
        dotColor: "#999",
      };
      setMarkedDates(updatedMarkedDates);

      setUnviewedLogCount((prev) => prev - 1);
    }
  };

  const currentLog = logs[currentLogIndex] || {};

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date available";
    return formatDisplayDate(dateString);
  };

  const handleClaimPoints = () => {
    addPoints(10);
    setClaimPointsModalVisible(false);
  };

  const TIMEZONE = "America/New_York";

  const getTodayDateString = () => {
    const now = new Date();
    return tzFormat(now, "yyyy-MM-dd", { timeZone: TIMEZONE });
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(`${dateString}T00:00:00`);
      const zonedDate = toZonedTime(date, TIMEZONE);
      return format(zonedDate, "MMMM do, yyyy");
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TotalPoints />
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
            {logs.some((log) => log.date === getTodayDateString())
              ? "Update Log"
              : "Save Log"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bookIcon} onPress={handleBookIconPress}>
          <Ionicons name="book" size={32} color="#095da7" />
          {unviewedLogCount > 0 && (
            <View style={styles.logCountBadge}>
              <Text style={styles.logCountText}>{unviewedLogCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setShowCalendar(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={goToPreviousLog}>
                  <Ionicons name="chevron-back" size={28} color="#095da7" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowCalendar(!showCalendar)}
                  style={styles.dateSelector}
                >
                  <Text style={styles.modalTitle}>
                    {currentLog?.date
                      ? formatDate(currentLog.date)
                      : "Select a date"}
                  </Text>
                  <View style={styles.chevronContainer}>
                    <Ionicons
                      name={showCalendar ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#095da7"
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={goToNextLog}>
                  <Ionicons name="chevron-forward" size={28} color="#095da7" />
                </TouchableOpacity>
              </View>

              {showCalendar && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    markedDates={markedDates}
                    onDayPress={(day: any) => {
                      const logIndex = logs.findIndex(
                        (log) => log.date === day.dateString
                      );
                      if (logIndex !== -1) {
                        setCurrentLogIndex(logIndex);
                        markLogAsViewed(logIndex);
                      }
                      setShowCalendar(false);
                    }}
                    theme={{
                      backgroundColor: "#fff",
                      calendarBackground: "#fff",
                      selectedDayBackgroundColor: "#095da7",
                      selectedDayTextColor: "#fff",
                      todayTextColor: "#ff6b6b",
                      dayTextColor: "#2d4150",
                      textDisabledColor: "#d9e1e8",
                      dotColor: "#ff4757",
                      selectedDotColor: "#fff",
                      arrowColor: "#095da7",
                      monthTextColor: "#095da7",
                      indicatorColor: "#095da7",
                      textDayFontFamily: "System",
                      textMonthFontFamily: "System",
                      textDayHeaderFontFamily: "System",
                      textDayFontWeight: "500",
                      textMonthFontWeight: "bold",
                      textDayHeaderFontWeight: "500",
                      textDayFontSize: 15,
                      textMonthFontSize: 18,
                      textDayHeaderFontSize: 14,
                      "stylesheet.calendar.header": {
                        header: {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingLeft: 10,
                          paddingRight: 10,
                          marginTop: 6,
                          alignItems: "center",
                        },
                      },
                    }}
                  />
                </View>
              )}

              <View style={styles.logContent}>
                <Text style={styles.logLabel}>Sleep:</Text>
                <Text style={styles.logValue}>
                  {currentLog?.sleep || "Not logged"}
                </Text>

                <Text style={styles.logLabel}>Eating:</Text>
                <Text style={styles.logValue}>
                  {currentLog?.eating || "Not logged"}
                </Text>

                <Text style={styles.logLabel}>Exercise:</Text>
                <Text style={styles.logValue}>
                  {currentLog?.exercise || "Not logged"}
                </Text>
              </View>

              <Text style={styles.logCounter}>
                {logs.length > 0
                  ? `${currentLogIndex + 1} of ${logs.length}`
                  : "No logs yet"}
              </Text>

              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setShowCalendar(false);
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <ClaimPointsModal
          visible={claimPointsModalVisible}
          onClose={() => setClaimPointsModalVisible(false)}
          onClaimPoints={handleClaimPoints}
          task="Daily Tracker Log"
          points={10}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 530,
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
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#095da7",
    textAlign: "center",
    marginHorizontal: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#095da7",
    borderRadius: 8,
    shadowColor: "#095da7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 15,
    paddingHorizontal: 5,
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
  logsDropdown: {
    maxHeight: 150,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedDropdownItem: {
    backgroundColor: "#f0f8ff",
  },
  dropdownDateText: {
    fontSize: 14,
    color: "#333",
  },
  unviewedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4757",
  },
  emptyDropdownText: {
    padding: 15,
    textAlign: "center",
    color: "#888",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginHorizontal: 10,
    minWidth: 200,
    justifyContent: "center",
  },
  calendarContainer: {
    width: "100%",
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: "white",
  },
  chevronContainer: {
    marginLeft: 8,
  },
});

export default Tracker;
