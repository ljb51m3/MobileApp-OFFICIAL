// //I have no idea if this will work on anything but the web version but it is here regardless
// //The aesthetics will definitely need to be updated but the functionality seems to be working

// // run npm install react-native-async-storage/async-storage, and expo-calendar if you don't already have it

// // Lily update: it wasn't working on my end bc the eyemascot.jpg image was not in the assets folder
// // i put a placeholder image in for the time being

// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   Button,
//   TextInput,
//   Image,
//   ScrollView,
//   Switch,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Calendar as CalendarView } from "react-native-calendars";
// import * as ExpoCalendar from "expo-calendar";
// import { Event } from "expo-calendar";
// import { useIsFocused } from "@react-navigation/native";

// // Add type definitions at the top
// type DayMarking = {
//   marked?: boolean;
//   selected?: boolean;
//   selectedColor?: string;
//   selectedTextColor?: string;
//   dots?: Array<{
//     color: string;
//     key: string;
//     size: number;
//   }>;
//   customStyles?: {
//     container?: {
//       backgroundColor?: string;
//       borderWidth?: number;
//       borderColor?: string;
//     };
//     text?: {
//       color?: string;
//       fontWeight?: string;
//     };
//   };
// };

// type MarkedDates = {
//   [date: string]: DayMarking;
// };

// // Add the event type styles configuration
// const eventTypeStyles = {
//   personal: {
//     color: "#4A90E2",
//     backgroundColor: "#EBF3FC",
//     borderColor: "#4A90E2",
//     emoji: "👤",
//   },
//   "eye-exam": {
//     color: "#FF6B6B",
//     backgroundColor: "#FFE6E6",
//     borderColor: "#FF6B6B",
//     emoji: "👁️",
//   },
//   "doctor-appointment": {
//     color: "#50C878",
//     backgroundColor: "#E6F5EC",
//     borderColor: "#50C878",
//     emoji: "👨‍⚕️",
//   },
//   other: {
//     color: "#9B59B6",
//     backgroundColor: "#F4ECF7",
//     borderColor: "#9B59B6",
//     emoji: "��",
//   },
// } as const;

// // Add the parseEventDetails function
// const parseEventDetails = (event: ExpoCalendar.Event) => {
//   const notes = event.notes || "";
//   const classificationMatch = notes.match(/\[Classification: (.*?)\]\n?(.*)/s);

//   if (classificationMatch) {
//     return {
//       classification: classificationMatch[1],
//       notes: classificationMatch[2].trim(),
//     };
//   }

//   return {
//     classification: "other",
//     notes: notes.trim(),
//   };
// };

// export default function HomeScreen() {
//   //const [currentTime, setCurrentTime] = useState<string>(
//   // new Date().toLocaleTimeString()
//   //);
//   const [name, setName] = useState<string>("");
//   const [isNameSet, setIsNameSet] = useState<boolean>(false);
//   const diabetesFacts = [
//     "Less than 50% of patients with diabetes regularly schedule eye exams.",
//     "Diabetes is the leading cause of kidney failure in the United States.",
//     "Over 30 million people in the U.S. have diabetes, but about 1 in 4 don't know they have it.",
//     "People with diabetes are at a higher risk for heart disease and stroke.",
//     "Diabetes can increase the risk of blindness, nerve damage, and amputations.",
//     "Approximately 90-95% of people with diabetes have Type 2 diabetes.",
//     "Managing blood sugar levels can significantly reduce the risk of diabetes-related complications.",
//     "Diabetes is the 7th leading cause of death in the United States.",
//   ];

//   const [randomFact, setRandomFact] = useState<string>("");
//   const [events, setEvents] = useState<ExpoCalendar.Event[]>([]);
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const isFocused = useIsFocused();

//   //Checklist
//   const [checklist, setChecklist] = useState([
//     { id: 1, task: "Schedule eye exam", completed: false },
//     { id: 2, task: "Check blood sugar levels", completed: false },
//     { id: 3, task: "Take prescribed medication", completed: false },
//     { id: 4, task: "Exercise for 30 minutes", completed: false },
//     { id: 5, task: "Eat a healthy meal", completed: false },
//   ]);

//   // Get Name from AsyncStorage
//   useEffect(() => {
//     const getStoredName = async () => {
//       try {
//         const storedName = await AsyncStorage.getItem("userName");
//         if (storedName) {
//           setName(storedName);
//           setIsNameSet(true);
//         }
//       } catch (error) {
//         console.error("Failed to load name", error);
//       }
//     };
//     getStoredName();
//   }, []);

//   const saveName = async () => {
//     try {
//       await AsyncStorage.setItem("userName", name);
//       setIsNameSet(true);
//     } catch (error) {
//       console.error("Failed to save name", error);
//     }
//   };

//   // Select random fact from array
//   useEffect(() => {
//     const fact =
//       diabetesFacts[Math.floor(Math.random() * diabetesFacts.length)];
//     setRandomFact(fact);
//   }, []);

//   // Function to fetch events
//   const fetchEvents = async () => {
//     try {
//       const calendars = await ExpoCalendar.getCalendarsAsync(
//         ExpoCalendar.EntityTypes.EVENT
//       );
//       const writableCalendars = calendars.filter(
//         (calendar) => calendar.allowsModifications
//       );
//       const calendarIds = writableCalendars.map((calendar) => calendar.id);

//       const fetchedEvents = await ExpoCalendar.getEventsAsync(
//         calendarIds,
//         new Date(),
//         new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
//       );
//       setEvents(fetchedEvents as any);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };

//   // Fetch events when the component mounts and when it comes into focus
//   useEffect(() => {
//     if (isFocused) {
//       fetchEvents();
//     }
//   }, [isFocused]);

//   //Toggle Task Completion
//   const toggleTaskCompletion = (id: number) => {
//     setChecklist((prevChecklist) =>
//       prevChecklist.map((item) =>
//         item.id === id ? { ...item, completed: !item.completed } : item
//       )
//     );
//   };

//   // Add the isAppCreatedEvent function
//   const isAppCreatedEvent = (event: ExpoCalendar.Event) => {
//     // Debug logging
//     console.log("Checking event:", {
//       id: event.id,
//       title: event.title,
//       calendarId: event.calendarId,
//     });

//     return event.calendarId === "1AD179B2-8C13-4B1E-B0CA-7AFC9843C804";
//   };

//   // Add this new function to get today's events
//   const getTodayEvents = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     return events.filter((event) => {
//       const eventDate = new Date(event.startDate);
//       return eventDate >= today && eventDate < tomorrow;
//     });
//   };

//   // Add this new function to get upcoming events (after getTodayEvents)
//   const getUpcomingEvents = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const nextWeek = new Date(today);
//     nextWeek.setDate(nextWeek.getDate() + 7);

//     return events
//       .filter((event) => {
//         const eventDate = new Date(event.startDate);
//         return (
//           eventDate > today && eventDate < nextWeek && isAppCreatedEvent(event)
//         );
//       })
//       .sort(
//         (a, b) =>
//           new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
//       );
//   };

//   // Add formatEventDate function to show the date nicely
//   const formatEventDate = (date: Date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) {
//       return "Today";
//     } else if (date.toDateString() === tomorrow.toDateString()) {
//       return "Tomorrow";
//     } else {
//       return date.toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       });
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.welcomeText}>Welcome!</Text>
//         {/* Name below Welcome! */}
//         {!isNameSet ? (
//           <>
//             <TextInput
//               style={styles.nameInput}
//               placeholder="Enter your name"
//               value={name}
//               onChangeText={setName}
//             />
//             <Button title="Save Name" onPress={saveName} />
//           </>
//         ) : (
//           <Text style={styles.nameText}>{name}</Text>
//         )}

//         {/* Welcome message */}
//         <Text style={styles.welcomeMessage}>How's it going today?</Text>

//         {/* Fun Fact Section */}
//         <View style={styles.factContainer}>
//           <Image
//             source={require("../../assets/images/eye.png")}
//             style={styles.image}
//           />
//           <View style={[styles.bubble, { marginLeft: 30 }]}>
//             <Text style={styles.bubbleText}>Did you know: {randomFact}</Text>
//           </View>
//         </View>

//         {/* Checklist Section */}
//         <View style={styles.checklistContainer}>
//           <Text style={styles.checklistTitle}>Your Tasks For Today</Text>
//           {checklist.map((item) => (
//             <View key={item.id} style={styles.checklistItem}>
//               <Switch
//                 value={item.completed}
//                 onValueChange={() => toggleTaskCompletion(item.id)}
//               />
//               <Text
//                 style={[
//                   styles.checklistText,
//                   item.completed && styles.completedTask,
//                 ]}
//               >
//                 {item.task}
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* Today's Events Section */}
//         <View style={styles.todayEventsContainer}>
//           <Text style={styles.todayEventsTitle}>Today's Events</Text>
//           {getTodayEvents().length > 0 ? (
//             getTodayEvents().map((event) => {
//               const isAppEvent = isAppCreatedEvent(event);
//               const { classification } = parseEventDetails(event);
//               const eventStyle =
//                 isAppEvent && classification
//                   ? eventTypeStyles[
//                       classification as keyof typeof eventTypeStyles
//                     ]
//                   : undefined;

//               return (
//                 <View
//                   key={event.id}
//                   style={[
//                     styles.eventItem,
//                     isAppEvent && {
//                       backgroundColor: eventStyle?.backgroundColor || "#f0f0f0",
//                       borderWidth: 1,
//                       borderColor: eventStyle?.borderColor || "#ddd",
//                       borderRadius: 8,
//                       padding: 10,
//                       marginVertical: 4,
//                     },
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.eventTime,
//                       isAppEvent && { color: eventStyle?.color || "#2E66E7" },
//                     ]}
//                   >
//                     {new Date(event.startDate).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </Text>
//                   <Text
//                     style={[
//                       styles.eventTitle,
//                       isAppEvent && {
//                         color: eventStyle?.color || "#333",
//                         fontWeight: "600",
//                       },
//                     ]}
//                   >
//                     {isAppEvent ? `${eventStyle?.emoji || "🔷"} ` : ""}
//                     {event.title}
//                   </Text>
//                 </View>
//               );
//             })
//           ) : (
//             <Text style={styles.noEventsText}>
//               No events scheduled for today
//             </Text>
//           )}
//         </View>

//         {/* Upcoming Events Section */}
//         <View style={styles.upcomingEventsContainer}>
//           <Text style={styles.upcomingEventsTitle}>Upcoming Events</Text>
//           {getUpcomingEvents().length > 0 ? (
//             getUpcomingEvents().map((event) => {
//               const { classification } = parseEventDetails(event);
//               const eventStyle =
//                 eventTypeStyles[classification as keyof typeof eventTypeStyles];

//               return (
//                 <View
//                   key={event.id}
//                   style={[
//                     styles.upcomingEventItem,
//                     {
//                       backgroundColor: eventStyle?.backgroundColor || "#f0f0f0",
//                       borderWidth: 1,
//                       borderColor: eventStyle?.borderColor || "#ddd",
//                     },
//                   ]}
//                 >
//                   <View style={styles.upcomingEventHeader}>
//                     <Text
//                       style={[
//                         styles.upcomingEventDate,
//                         { color: eventStyle?.color || "#2E66E7" },
//                       ]}
//                     >
//                       {formatEventDate(new Date(event.startDate))}
//                     </Text>
//                     <Text
//                       style={[
//                         styles.upcomingEventTime,
//                         { color: eventStyle?.color || "#2E66E7" },
//                       ]}
//                     >
//                       {new Date(event.startDate).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </Text>
//                   </View>
//                   <Text
//                     style={[
//                       styles.upcomingEventTitle,
//                       { color: eventStyle?.color || "#333" },
//                     ]}
//                   >
//                     {eventStyle?.emoji || "🔷"} {event.title}
//                   </Text>
//                 </View>
//               );
//             })
//           ) : (
//             <Text style={styles.noEventsText}>
//               No upcoming events this week
//             </Text>
//           )}
//         </View>

//         {/* Calendar Section */}
//         <View style={styles.calendarContainer}>
//           <CalendarView
//             onDayPress={(day: any) => {
//               console.log("selected day", day);
//             }}
//             markedDates={Object.entries(
//               events.reduce<{
//                 [key: string]: {
//                   hasAppEvent: boolean;
//                   events: ExpoCalendar.Event[];
//                   classification?: string;
//                 };
//               }>((acc, event: ExpoCalendar.Event) => {
//                 const eventDate = new Date(event.startDate);
//                 const date = eventDate.toISOString().split("T")[0];

//                 if (!acc[date]) {
//                   acc[date] = { hasAppEvent: false, events: [] };
//                 }

//                 const isAppEvent = isAppCreatedEvent(event);
//                 if (isAppEvent) {
//                   acc[date].hasAppEvent = true;
//                   const { classification } = parseEventDetails(event);
//                   acc[date].classification = classification;
//                 }

//                 acc[date].events.push(event);
//                 return acc;
//               }, {})
//             ).reduce<MarkedDates>((markings, [date, dateData]) => {
//               const isSelected = date === selectedDate;
//               const eventStyle = dateData.classification
//                 ? eventTypeStyles[
//                     dateData.classification as keyof typeof eventTypeStyles
//                   ]
//                 : undefined;

//               return {
//                 ...markings,
//                 [date]: {
//                   marked: true,
//                   selected: isSelected,
//                   selectedColor: isSelected
//                     ? eventStyle?.color || "#2E66E7"
//                     : eventStyle?.backgroundColor || "#f0f0f0",
//                   selectedTextColor: "#FFFFFF",
//                   dots: dateData.hasAppEvent
//                     ? [
//                         {
//                           color: eventStyle?.color || "#666666",
//                           key: "regular",
//                           size: 4,
//                         },
//                       ]
//                     : [{ color: "#666666", key: "regular", size: 4 }],
//                   customStyles: dateData.hasAppEvent
//                     ? {
//                         container: {
//                           backgroundColor: isSelected
//                             ? eventStyle?.color || "#2E66E7"
//                             : eventStyle?.backgroundColor || "#f0f0f0",
//                           borderWidth: 1,
//                           borderColor: eventStyle?.borderColor || "#ddd",
//                         },
//                         text: {
//                           color: isSelected
//                             ? "#FFFFFF"
//                             : eventStyle?.color || "#333",
//                           fontWeight: "bold",
//                         },
//                       }
//                     : undefined,
//                 },
//               };
//             }, {} as MarkedDates)}
//             markingType={"custom"}
//             theme={{
//               backgroundColor: "#ffffff",
//               calendarBackground: "#ffffff",
//               selectedDayBackgroundColor: "#2E66E7",
//               selectedDayTextColor: "#FFFFFF",
//               todayTextColor: "#2E66E7",
//               dayTextColor: "#2d4150",
//               textDisabledColor: "#d9e1e8",
//               dotColor: "#666666",
//               selectedDotColor: "#FFFFFF",
//               arrowColor: "#2E66E7",
//               monthTextColor: "#2d4150",
//               textDayFontSize: 16,
//               textMonthFontSize: 18,
//               textDayHeaderFontSize: 16,
//               textSectionTitleColor: "#2d4150",
//               textDayFontWeight: "600",
//               textMonthFontWeight: "bold",
//               textDayHeaderFontWeight: "600",
//             }}
//             style={styles.calendar}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//     paddingTop: 10,
//     paddingBottom: 60,
//     paddingLeft: 10,
//   },
//   /*
//   time: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "black",
//   },*/
//   welcomeText: {
//     fontSize: 30,
//     fontWeight: "bold",
//     marginTop: 20,
//     color: "black",
//     marginLeft: 20,
//   },
//   nameInput: {
//     fontSize: 20,
//     marginTop: 10,
//     color: "black",
//     marginLeft: 20,
//     borderBottomWidth: 1,
//     width: "80%",
//     padding: 5,
//   },
//   nameText: {
//     fontSize: 24,
//     marginTop: 2,
//     color: "black",
//     marginLeft: 20,
//     fontWeight: "bold",
//   },
//   welcomeMessage: {
//     fontSize: 15,
//     marginTop: 10,
//     color: "black",
//     marginLeft: 20,
//   },
//   image: {
//     marginTop: 5,
//     width: 100,
//     height: 100,
//     resizeMode: "contain",
//   },
//   factContainer: {
//     flexDirection: "row",
//     marginTop: 20,
//     alignItems: "flex-start",
//     marginLeft: 10,
//   },
//   bubble: {
//     padding: 10,
//     backgroundColor: "#f0f8ff",
//     borderRadius: 10,
//     maxWidth: "50%",
//     borderWidth: 2,
//     borderColor: "#5e81c2",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   bubbleText: {
//     fontSize: 15,
//     color: "#333",
//     fontStyle: "italic",
//   },
//   calendarContainer: {
//     marginTop: 20,
//     marginLeft: 10,
//     marginRight: 10,
//     marginBottom: 20,
//   },
//   calendar: {
//     width: 335,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   checklistContainer: {
//     width: 335,
//     marginTop: 20,
//     marginLeft: 10,
//     marginRight: 10,
//     marginBottom: 20,
//   },
//   checklistTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "black",
//   },
//   checklistItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 5,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     backgroundColor: "#e0f7fa",
//     width: "100%",
//   },
//   checklistText: {
//     fontSize: 16,
//     color: "black",
//     marginLeft: 10,
//   },
//   completedTask: {
//     color: "#a9a9a9",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 80,
//   },
//   todayEventsContainer: {
//     width: 335,
//     marginTop: 20,
//     marginLeft: 10,
//     marginRight: 10,
//     padding: 15,
//     backgroundColor: "#f8f9fa",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#dee2e6",
//   },
//   todayEventsTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: "#2d4150",
//   },
//   eventItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#dee2e6",
//   },
//   eventTime: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#2E66E7",
//     width: 80,
//   },
//   eventTitle: {
//     fontSize: 16,
//     color: "#333",
//     flex: 1,
//   },
//   noEventsText: {
//     fontSize: 14,
//     color: "#666",
//     fontStyle: "italic",
//     textAlign: "center",
//     paddingVertical: 10,
//   },
//   upcomingEventsContainer: {
//     width: 335,
//     marginTop: 20,
//     marginLeft: 10,
//     marginRight: 10,
//     padding: 15,
//     backgroundColor: "#f8f9fa",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#dee2e6",
//   },
//   upcomingEventsTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: "#2d4150",
//   },
//   upcomingEventItem: {
//     marginBottom: 10,
//     padding: 12,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   upcomingEventHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   upcomingEventDate: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   upcomingEventTime: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   upcomingEventTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginTop: 4,
//   },
// });

// /*

// return (time stuff)
// <Text style={styles.time}>{currentTime}</Text>

// */

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar as CalendarView } from "react-native-calendars";
import * as ExpoCalendar from "expo-calendar";
import { Event } from "expo-calendar";
import { useIsFocused } from "@react-navigation/native";
import ClaimPointsModal from "../../components/ClaimPointsModal";
import { usePoints } from "../../components/PointsSystem";

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

const eventTypeStyles = {
  personal: {
    color: "#4A90E2",
    backgroundColor: "#EBF3FC",
    borderColor: "#4A90E2",
    emoji: "👤",
  },
  "eye-exam": {
    color: "#FF6B6B",
    backgroundColor: "#FFE6E6",
    borderColor: "#FF6B6B",
    emoji: "👁️",
  },
  "doctor-appointment": {
    color: "#50C878",
    backgroundColor: "#E6F5EC",
    borderColor: "#50C878",
    emoji: "👨‍⚕️",
  },
  other: {
    color: "#9B59B6",
    backgroundColor: "#F4ECF7",
    borderColor: "#9B59B6",
    emoji: "🔷",
  },
} as const;

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
  { id: 1, text: "Schedule eye exam", points: 10 },
  { id: 2, text: "Check blood sugar levels", points: 5 },
  { id: 3, text: "Take prescribed medication", points: 5 },
  { id: 4, text: "Exercise for 30 minutes", points: 15 },
  { id: 5, text: "Eat a healthy meal", points: 10 },
  { id: 6, text: "Drink 8 glasses of water", points: 8 },
  { id: 7, text: "Meditate for 10 minutes", points: 7 },
  { id: 8, text: "Get 8 hours of sleep", points: 12 },
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
  const [name, setName] = useState<string>("");
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
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
  // const [points, setPoints] = useState<number>(0);
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
          const selected = shuffled.slice(0, 5);
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

        //   setPoints(data.points || 0);
      } catch (error) {
        console.error("Failed to initialize tasks:", error);
      }
    };

    initializeTasks();
  }, []);

  useEffect(() => {
    const getStoredName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setName(storedName);
          setIsNameSet(true);
        }
      } catch (error) {
        console.error("Failed to load name", error);
      }
    };
    getStoredName();
  }, []);

  const saveName = async () => {
    try {
      await AsyncStorage.setItem("userName", name);
      setIsNameSet(true);
    } catch (error) {
      console.error("Failed to save name", error);
    }
  };

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

  // const claimPoints = async () => {
  //   if (selectedTask && !completedTasks[selectedTask.id]) {
  //     const newPoints = points + selectedTask.points;
  //     const newCompleted = { ...completedTasks, [selectedTask.id]: true };

  //     setPoints(newPoints);
  //     setCompletedTasks(newCompleted);
  //     setModalVisible(false);

  //     try {
  //       const today = new Date().toDateString();
  //       await AsyncStorage.setItem(
  //         "@MascotAppData",
  //         JSON.stringify({
  //           points: newPoints,
  //           lastUpdated: today,
  //           completed: newCompleted,
  //           dailyTasks,
  //         } as AppData)
  //       );
  //     } catch (error) {
  //       console.error("Failed to save progress:", error);
  //     }
  //   }
  // };

  const { points, addPoints } = usePoints();

  const claimPoints = async () => {
    if (selectedTask && !completedTasks[selectedTask.id]) {
      addPoints(selectedTask.points);
      const newCompleted = { ...completedTasks, [selectedTask.id]: true };
      setCompletedTasks(newCompleted);
      setModalVisible(false);

      const today = new Date().toDateString();
      await AsyncStorage.setItem(
        "@MascotAppData",
        JSON.stringify({
          lastUpdated: today,
          completed: newCompleted,
          dailyTasks,
        })
      );
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        {!isNameSet ? (
          <>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <Button title="Save Name" onPress={saveName} />
          </>
        ) : (
          <Text style={styles.nameText}>{name}</Text>
        )}

        <Text style={styles.welcomeMessage}>How's it going today?</Text>

        <View style={styles.factContainer}>
          <Image
            source={require("../../assets/images/eye.png")}
            style={styles.image}
          />
          <View style={[styles.bubble, { marginLeft: 30 }]}>
            <Text style={styles.bubbleText}>Did you know: {randomFact}</Text>
          </View>
        </View>

        <View style={styles.checklistContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.checklistTitle}>Your Tasks For Today</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>💰 {points} pts</Text>
            </View>
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
              console.log("selected day", day);
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 660 : 10,
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
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 10,
    paddingBottom: 60,
    paddingLeft: 10,
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
    marginTop: 20,
    alignItems: "flex-start",
    marginLeft: 10,
  },
  bubble: {
    padding: 10,
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    maxWidth: "50%",
    borderWidth: 2,
    borderColor: "#5e81c2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bubbleText: {
    fontSize: 15,
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
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  calendar: {
    width: 335,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  checklistContainer: {
    width: 335,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
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
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    width: 335,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
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
    width: 335,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
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
});
