import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar as CalendarView } from "react-native-calendars";
import * as ExpoCalendar from "expo-calendar";
import { Event } from "expo-calendar";
import { useIsFocused } from "@react-navigation/native";
import ClaimPointsModal from "../../components/ClaimPointsModal";
import { getAppleFirstName } from "../auth/appleauth";
import { LinearGradient } from "expo-linear-gradient";
import { eventTypeStyles } from "../styles/eventStyles";
import TotalPoints from "../../components/TotalPoints";

type DayMarking = {
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
  dots?: Array<{
    color: string;
    key: string;
    size: number;
  }>;
  customStyles?: {
    container?: {
      backgroundColor?: string;
      borderWidth?: number;
      borderColor?: string;
    };
    text?: {
      color?: string;
      fontWeight?: string;
    };
  };
};

type MarkedDates = {
  [date: string]: DayMarking;
};

interface Task {
  id: number;
  text: string;
  points: number;
  isCustom?: boolean;
  repeatFrequency?: "none" | "daily" | "weekly" | "monthly";
  lastCompleted?: string | null;
}

interface AppData {
  points: number;
  lastUpdated: string;
  completed: Record<number, boolean>;
  dailyTasks: Task[];
}

interface RepeatOption {
  label: string;
  value: string;
}

const ALL_TASKS: Task[] = [
  {
    id: 1,
    text: "Schedule eye exam",
    points: 10,
    repeatFrequency: "none",
    lastCompleted: null,
  },
  {
    id: 2,
    text: "Check blood sugar levels",
    points: 5,
    repeatFrequency: "none",
    lastCompleted: null,
  },
  {
    id: 3,
    text: "Take prescribed medication",
    points: 5,
    repeatFrequency: "none",
    lastCompleted: null,
  },
  {
    id: 4,
    text: "Exercise for 30 minutes",
    points: 15,
    repeatFrequency: "none",
    lastCompleted: null,
  },
  {
    id: 5,
    text: "Eat a healthy meal",
    points: 10,
    repeatFrequency: "none",
    lastCompleted: null,
  },
  {
    id: 6,
    text: "Drink 8 glasses of water",
    points: 8,
    repeatFrequency: "none",
    lastCompleted: null,
  },
  {
    id: 7,
    text: "Meditate for 10 minutes",
    points: 7,
    repeatFrequency: "none",
    lastCompleted: null,
  },
  {
    id: 8,
    text: "Get 8 hours of sleep",
    points: 12,
    repeatFrequency: "none",
    lastCompleted: null,
  },
];

const parseEventDetails = (event: ExpoCalendar.Event) => {
  const notes = event.notes || "";
  const classificationMatch = notes.match(/\[Classification: (.*?)\]\n?(.*)/s);

  if (classificationMatch) {
    return {
      classification: classificationMatch[1],
      notes: classificationMatch[2].trim(),
    };
  }

  return {
    classification: "other",
    notes: notes.trim(),
  };
};

export default function HomeScreen() {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const diabetesFacts = [
    "Less than 50% of patients with diabetes regularly schedule eye exams.",
    "Diabetes is the leading cause of kidney failure in the United States.",
    "Over 30 million people in the U.S. have diabetes, but about 1 in 4 don't know they have it.",
    "People with diabetes are at a higher risk for heart disease and stroke.",
    "Diabetes can increase the risk of blindness, nerve damage, and amputations.",
    "Approximately 90-95% of people with diabetes have Type 2 diabetes.",
    "Managing blood sugar levels can significantly reduce the risk of diabetes-related complications.",
    "Diabetes is the 7th leading cause of death in the United States.",
  ];

  const [randomFact, setRandomFact] = useState<string>("");
  const [events, setEvents] = useState<ExpoCalendar.Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(
    {}
  );
  const [selectedDateEvents, setSelectedDateEvents] = useState<
    ExpoCalendar.Event[]
  >([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPoints, setNewTaskPoints] = useState("5");
  const [shouldRepeat, setShouldRepeat] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("none");

  const REPEAT_OPTIONS: RepeatOption[] = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Never", value: "none" },
  ];

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
          const selected = shuffled.slice(0, 5);

          // Filter and add repeating tasks
          const repeatingTasks = data.dailyTasks.filter(
            (task) =>
              task.isCustom &&
              task.repeatFrequency !== "none" &&
              shouldShowRepeatingTask(task, today)
          );

          setDailyTasks([...selected, ...repeatingTasks]);

          await AsyncStorage.setItem(
            "@MascotAppData",
            JSON.stringify({
              points: data.points,
              lastUpdated: today,
              completed: {},
              dailyTasks: [...selected, ...repeatingTasks],
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

    const shouldShowRepeatingTask = (task: Task, today: string) => {
      if (!task.lastCompleted) return true;

      const lastCompleted = new Date(task.lastCompleted);
      const currentDate = new Date(today);

      switch (task.repeatFrequency) {
        case "daily":
          return lastCompleted.getDate() !== currentDate.getDate();
        case "weekly":
          const weekDiff = Math.floor(
            (currentDate.getTime() - lastCompleted.getTime()) /
              (1000 * 60 * 60 * 24 * 7)
          );
          return weekDiff >= 1;
        case "monthly":
          return lastCompleted.getMonth() !== currentDate.getMonth();
        default:
          return false;
      }
    };

    initializeTasks();
  }, []);

  useEffect(() => {
    const fetchAppleUserName = async () => {
      setIsLoading(true);
      try {
        const retrievedName = await getAppleFirstName();
        setName(retrievedName ?? null);
      } catch (error) {
        console.error("Error fetching Apple ID name:", error);
        setName(null);
      }
      setIsLoading(false);
    };

    fetchAppleUserName();
  }, []);

  useEffect(() => {
    const fact =
      diabetesFacts[Math.floor(Math.random() * diabetesFacts.length)];
    setRandomFact(fact);
  }, []);

  const fetchEvents = async () => {
    try {
      const calendars = await ExpoCalendar.getCalendarsAsync(
        ExpoCalendar.EntityTypes.EVENT
      );
      const writableCalendars = calendars.filter(
        (calendar) => calendar.allowsModifications
      );
      const calendarIds = writableCalendars.map((calendar) => calendar.id);

      const fetchedEvents = await ExpoCalendar.getEventsAsync(
        calendarIds,
        new Date(),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      );
      setEvents(fetchedEvents as any);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchEvents();
    }
  }, [isFocused]);

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

  const isAppCreatedEvent = (event: ExpoCalendar.Event) => {
    return event.calendarId === "1AD179B2-8C13-4B1E-B0CA-7AFC9843C804";
  };

  const getTodayEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate >= today && eventDate < tomorrow;
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return (
          eventDate > today && eventDate < nextWeek && isAppCreatedEvent(event)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  };

  const formatEventDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  const addCustomTask = async () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText.trim(),
        points: parseInt(newTaskPoints) || 5,
        isCustom: true,
        repeatFrequency: shouldRepeat ? repeatFrequency : "none",
        lastCompleted: null,
      };

      const updatedTasks = [...dailyTasks, newTask];
      setDailyTasks(updatedTasks);

      try {
        const today = new Date().toDateString();
        await AsyncStorage.setItem(
          "@MascotAppData",
          JSON.stringify({
            points,
            lastUpdated: today,
            completed: completedTasks,
            dailyTasks: updatedTasks,
          })
        );
      } catch (error) {
        console.error("Failed to save custom task:", error);
      }

      // Reset form
      setNewTaskText("");
      setNewTaskPoints("5");
      setShouldRepeat(false);
      setRepeatFrequency("none");
      setShowAddTaskModal(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TotalPoints />
        <Text style={styles.welcomeText}>Welcome!</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Fetching Apple ID...</Text>
        ) : name ? (
          <Text style={styles.nameText}>{name}</Text>
        ) : (
          <Text style={styles.nameText}>Guest</Text>
        )}

        {/* Welcome Message */}
        <Text style={styles.welcomeMessage}>How's it going today?</Text>

        {/* Fun Fact Section */}
        <View style={styles.factContainer}>
          <Image
            source={require("../../assets/images/eyemascot.png")}
            style={styles.image}
          />
          <LinearGradient
            colors={["#cce5ff", "#e6f2ff"]}
            style={styles.factBubble}
          >
            <Text style={styles.factTitle}>💡 Did you know?</Text>
            <Text style={styles.factText}>{randomFact}</Text>
          </LinearGradient>
        </View>

        <View style={styles.checklistContainer}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>Your Tasks For Today</Text>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => setShowAddTaskModal(true)}
            >
              <Text style={styles.addTaskButtonText}>+ Add Task</Text>
            </TouchableOpacity>
          </View>
          {dailyTasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskItem,
                completedTasks[task.id] && styles.completedTask,
              ]}
            >
              <Text style={styles.taskText}>
                {task.text + "\n"}
                <Text style={styles.pointsLabel}>
                  (+{task.points} pts)
                </Text>{" "}
              </Text>
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

        <View style={styles.todayEventsContainer}>
          <Text style={styles.todayEventsTitle}>Today's Events</Text>
          {getTodayEvents().length > 0 ? (
            getTodayEvents().map((event) => {
              const isAppEvent = isAppCreatedEvent(event);
              const { classification } = parseEventDetails(event);
              const eventStyle =
                isAppEvent && classification
                  ? eventTypeStyles[
                      classification as keyof typeof eventTypeStyles
                    ]
                  : undefined;

              return (
                <View
                  key={event.id}
                  style={[
                    styles.eventItem,
                    isAppEvent && {
                      backgroundColor: eventStyle?.backgroundColor || "#f0f0f0",
                      borderWidth: 1,
                      borderColor: eventStyle?.borderColor || "#ddd",
                      borderRadius: 8,
                      padding: 10,
                      marginVertical: 4,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.eventTime,
                      isAppEvent && { color: eventStyle?.color || "#2E66E7" },
                    ]}
                  >
                    {new Date(event.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text
                    style={[
                      styles.eventTitle,
                      isAppEvent && {
                        color: eventStyle?.color || "#333",
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {isAppEvent ? `${eventStyle?.emoji || "🔷"} ` : ""}
                    {event.title}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.noEventsText}>
              No events scheduled for today
            </Text>
          )}
        </View>

        <View style={styles.upcomingEventsContainer}>
          <Text style={styles.upcomingEventsTitle}>Upcoming Events</Text>
          {getUpcomingEvents().length > 0 ? (
            getUpcomingEvents().map((event) => {
              const { classification } = parseEventDetails(event);
              const eventStyle =
                eventTypeStyles[classification as keyof typeof eventTypeStyles];

              return (
                <View
                  key={event.id}
                  style={[
                    styles.upcomingEventItem,
                    {
                      backgroundColor: eventStyle?.backgroundColor || "#f0f0f0",
                      borderWidth: 1,
                      borderColor: eventStyle?.borderColor || "#ddd",
                    },
                  ]}
                >
                  <View style={styles.upcomingEventHeader}>
                    <Text
                      style={[
                        styles.upcomingEventDate,
                        { color: eventStyle?.color || "#2E66E7" },
                      ]}
                    >
                      {formatEventDate(new Date(event.startDate))}
                    </Text>
                    <Text
                      style={[
                        styles.upcomingEventTime,
                        { color: eventStyle?.color || "#2E66E7" },
                      ]}
                    >
                      {new Date(event.startDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.upcomingEventTitle,
                      { color: eventStyle?.color || "#333" },
                    ]}
                  >
                    {eventStyle?.emoji || "🔷"} {event.title}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.noEventsText}>
              No upcoming events this week
            </Text>
          )}
        </View>

        <View style={styles.calendarContainer}>
          <CalendarView
            onDayPress={(day: any) => {
              const selectedEvents = events.filter((event) => {
                const eventDate = new Date(event.startDate);
                return eventDate.toISOString().split("T")[0] === day.dateString;
              });
              setSelectedDateEvents(selectedEvents);
              setSelectedDate(day.dateString);
              setShowEventModal(true);
            }}
            markedDates={Object.entries(
              events.reduce<{
                [key: string]: {
                  hasAppEvent: boolean;
                  events: ExpoCalendar.Event[];
                  classification?: string;
                };
              }>((acc, event: ExpoCalendar.Event) => {
                const eventDate = new Date(event.startDate);
                const date = eventDate.toISOString().split("T")[0];

                if (!acc[date]) {
                  acc[date] = { hasAppEvent: false, events: [] };
                }

                const isAppEvent = isAppCreatedEvent(event);
                if (isAppEvent) {
                  acc[date].hasAppEvent = true;
                  const { classification } = parseEventDetails(event);
                  acc[date].classification = classification;
                }

                acc[date].events.push(event);
                return acc;
              }, {})
            ).reduce<MarkedDates>((markings, [date, dateData]) => {
              const isSelected = date === selectedDate;
              const eventStyle = dateData.classification
                ? eventTypeStyles[
                    dateData.classification as keyof typeof eventTypeStyles
                  ]
                : undefined;

              return {
                ...markings,
                [date]: {
                  marked: true,
                  selected: isSelected,
                  selectedColor: isSelected
                    ? eventStyle?.color || "#2E66E7"
                    : eventStyle?.backgroundColor || "#f0f0f0",
                  selectedTextColor: "#FFFFFF",
                  dots: dateData.hasAppEvent
                    ? [
                        {
                          color: eventStyle?.color || "#666666",
                          key: "regular",
                          size: 4,
                        },
                      ]
                    : [{ color: "#666666", key: "regular", size: 4 }],
                  customStyles: dateData.hasAppEvent
                    ? {
                        container: {
                          backgroundColor: isSelected
                            ? eventStyle?.color || "#2E66E7"
                            : eventStyle?.backgroundColor || "#f0f0f0",
                          borderWidth: 1,
                          borderColor: eventStyle?.borderColor || "#ddd",
                        },
                        text: {
                          color: isSelected
                            ? "#FFFFFF"
                            : eventStyle?.color || "#333",
                          fontWeight: "bold",
                        },
                      }
                    : undefined,
                },
              };
            }, {} as MarkedDates)}
            markingType={"custom"}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              selectedDayBackgroundColor: "#2E66E7",
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: "#2E66E7",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#666666",
              selectedDotColor: "#FFFFFF",
              arrowColor: "#2E66E7",
              monthTextColor: "#2d4150",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 16,
              textSectionTitleColor: "#2d4150",
              textDayFontWeight: "600",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
            }}
            style={styles.calendar}
          />
        </View>
      </View>

      <Modal
        visible={showEventModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEventModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEventModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowEventModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              Events for{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>

            <ScrollView style={styles.modalScrollView}>
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => {
                  const isAppEvent = isAppCreatedEvent(event);
                  const { classification } = parseEventDetails(event);
                  const eventStyle =
                    isAppEvent && classification
                      ? eventTypeStyles[
                          classification as keyof typeof eventTypeStyles
                        ]
                      : undefined;

                  return (
                    <View
                      key={event.id}
                      style={[
                        styles.modalEventItem,
                        isAppEvent && {
                          backgroundColor:
                            eventStyle?.backgroundColor || "#f0f0f0",
                          borderColor: eventStyle?.borderColor || "#ddd",
                        },
                      ]}
                    >
                      <View style={styles.modalEventHeader}>
                        <Text
                          style={[
                            styles.modalEventTime,
                            isAppEvent && {
                              color: eventStyle?.color || "#2E66E7",
                            },
                          ]}
                        >
                          {new Date(event.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                        {event.location && (
                          <Text style={styles.modalEventLocation}>
                            📍 {event.location}
                          </Text>
                        )}
                      </View>

                      <Text
                        style={[
                          styles.modalEventTitle,
                          isAppEvent && { color: eventStyle?.color || "#333" },
                        ]}
                      >
                        {isAppEvent ? `${eventStyle?.emoji || "🔷"} ` : ""}
                        {event.title}
                      </Text>

                      {event.notes && (
                        <Text style={styles.modalEventNotes}>
                          {parseEventDetails(event).notes}
                        </Text>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noEventsText}>
                  No events scheduled for this day
                </Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showAddTaskModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddTaskModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddTaskModal(false)}
        >
          <View style={styles.addTaskModalContent}>
            <Text style={styles.addTaskModalTitle}>Add New Task</Text>

            <TextInput
              style={styles.addTaskInput}
              placeholder="Enter task description"
              value={newTaskText}
              onChangeText={setNewTaskText}
              multiline={true}
              maxLength={100}
            />

            <View style={styles.pointsInputContainer}>
              <Text style={styles.pointsInputLabel}>Points:</Text>
              <TextInput
                style={styles.pointsInput}
                placeholder="5"
                value={newTaskPoints}
                onChangeText={setNewTaskPoints}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={styles.repeatContainer}>
              <Text style={styles.repeatLabel}>Repeat Task?</Text>
              <Switch
                value={shouldRepeat}
                onValueChange={(value) => {
                  setShouldRepeat(value);
                  if (!value) setRepeatFrequency("none");
                }}
                trackColor={{ false: "#767577", true: "#095da7" }}
                thumbColor={shouldRepeat ? "#fff" : "#f4f3f4"}
              />
            </View>

            {shouldRepeat && (
              <View style={styles.repeatOptionsContainer}>
                {REPEAT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.repeatOption,
                      repeatFrequency === option.value &&
                        styles.repeatOptionSelected,
                    ]}
                    onPress={() => setRepeatFrequency(option.value)}
                  >
                    <Text
                      style={[
                        styles.repeatOptionText,
                        repeatFrequency === option.value &&
                          styles.repeatOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.addTaskModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddTaskModal(false);
                  setShouldRepeat(false);
                  setRepeatFrequency("none");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addCustomTask}
              >
                <Text style={styles.addButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 665 : 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    zIndex: 100,
    marginLeft: 10,
  },
  debugButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    color: "black",
    marginLeft: 20,
  },
  nameInput: {
    fontSize: 20,
    marginTop: 10,
    color: "black",
    marginLeft: 20,
    borderBottomWidth: 1,
    width: "80%",
    padding: 5,
  },
  nameText: {
    fontSize: 24,
    marginTop: 2,
    color: "black",
    marginLeft: 20,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: "gray",
    marginLeft: 20,
  },
  welcomeMessage: {
    fontSize: 15,
    marginTop: 10,
    color: "black",
    marginLeft: 20,
  },
  image: {
    marginTop: 5,
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  factContainer: {
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  factBubble: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: "5e81c2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  factTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#095da7",
    marginBottom: 5,
  },
  factText: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  calendarContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
  calendar: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  checklistContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  checklistTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  taskButton: {
    backgroundColor: "#095da7",
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  completedTask: {
    opacity: 0.6,
    backgroundColor: "#e0e0e0",
  },
  pointsContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#095da7",
  },
  pointsLabel: {
    fontSize: 14,
    color: "#095da7",
    marginTop: 4,
    fontWeight: "bold",
    includeFontPadding: false,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  todayEventsContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  todayEventsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2d4150",
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E66E7",
    width: 80,
  },
  eventTitle: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  noEventsText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 10,
  },
  upcomingEventsContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  upcomingEventsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2d4150",
  },
  upcomingEventItem: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  upcomingEventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  upcomingEventDate: {
    fontSize: 14,
    fontWeight: "600",
  },
  upcomingEventTime: {
    fontSize: 14,
    fontWeight: "600",
  },
  upcomingEventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2d4150",
    textAlign: "center",
  },
  modalScrollView: {
    maxHeight: "90%",
  },
  modalEventItem: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#f8f9fa",
    borderColor: "#dee2e6",
  },
  modalEventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  modalEventTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E66E7",
  },
  modalEventLocation: {
    fontSize: 14,
    color: "#666",
  },
  modalEventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  modalEventNotes: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  modalCloseButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 8,
  },
  modalCloseButtonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "600",
  },
  addTaskButton: {
    backgroundColor: "#095da7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addTaskButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  addTaskModalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addTaskModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2d4150",
    textAlign: "center",
  },
  addTaskInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  pointsInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pointsInputLabel: {
    fontSize: 16,
    marginRight: 10,
    color: "#2d4150",
  },
  pointsInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: 60,
    fontSize: 16,
    textAlign: "center",
  },
  addTaskModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  addButton: {
    backgroundColor: "#095da7",
  },
  cancelButtonText: {
    color: "#495057",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  repeatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  repeatLabel: {
    fontSize: 16,
    color: "#2d4150",
    fontWeight: "600",
  },
  repeatOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  repeatOption: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
    width: "48%",
    alignItems: "center",
  },
  repeatOptionSelected: {
    backgroundColor: "#095da7",
    borderColor: "#095da7",
  },
  repeatOptionText: {
    fontSize: 14,
    color: "#2d4150",
    fontWeight: "500",
  },
  repeatOptionTextSelected: {
    color: "#fff",
  },
});
