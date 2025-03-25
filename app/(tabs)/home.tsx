//I have no idea if this will work on anything but the web version but it is here regardless
//The aesthetics will definitely need to be updated but the functionality seems to be working

// run npm install react-native-async-storage/async-storage, and expo-calendar if you don't already have it

// Lily update: it wasn't working on my end bc the eyemascot.jpg image was not in the assets folder
// i put a placeholder image in for the time being

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Switch,
  Animated,
} from "react-native";
import { Calendar as CalendarView } from "react-native-calendars";
import * as ExpoCalendar from "expo-calendar";
import { Event } from "expo-calendar";
import {getAppleFirstName} from "../auth/appleauth";
import {LinearGradient} from "expo-linear-gradient";

export default function HomeScreen() {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const diabetesFacts = [
    "Less than 50% of patients with diabetes regularly schedule eye exams",
    "Over 37 million Americans have diabetes, but about 1 in 5 don’t know they have it",
    "Approximately 90-95% of people with diabetes have Type 2 diabetes",
    "Managing blood sugar levels can significantly reduce the risk of diabetes-related complications",
    "Exercise helps regulate blood sugar by making your body more sensitive to insulin",
    "Eating fiber-rich foods like vegetables, beans, and whole grains can help manage blood sugar levels",
    "Poor sleep can lead to higher blood sugar levels and increased insulin resistance",
    "Drinking enough water helps your kidneys flush out excess blood sugar",
    "Stress can raise blood sugar levels due to increased cortisol and adrenaline production",
    "Short walks after meals can help lower post-meal blood sugar spikes",
    "Standing up every 30 minutes can help improve insulin sensitivity",
    "Mindfulness and meditation can help regulate blood sugar by reducing stress hormones",
  ];

  const [randomFact, setRandomFact] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);

  //Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Schedule eye exam", completed: false, fadeAnim: new Animated.Value(1), translateX: new Animated.Value(0) },
    { id: 2, task: "Check blood sugar levels", completed: false, fadeAnim: new Animated.Value(1), translateX: new Animated.Value(0) },
    { id: 3, task: "Take prescribed medication", completed: false, fadeAnim: new Animated.Value(1), translateX: new Animated.Value(0) },
    { id: 4, task: "Exercise for 30 minutes", completed: false, fadeAnim: new Animated.Value(1), translateX: new Animated.Value(0) },
    { id: 5, task: "Eat a healthy meal", completed: false, fadeAnim: new Animated.Value(1), translateX: new Animated.Value(0) },
  ]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  // Get Name from AppleID
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

  // Select random fact from array
  useEffect(() => {
    const fact =
      diabetesFacts[Math.floor(Math.random() * diabetesFacts.length)];
    setRandomFact(fact);
  }, []);

  // Get events from calendar
  useEffect(() => {
    (async () => {
      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await ExpoCalendar.getCalendarsAsync(
          ExpoCalendar.EntityTypes.EVENT
        );
        if (calendars.length > 0) {
          const calendarIds = calendars.map((calendar) => calendar.id);
          const events = await ExpoCalendar.getEventsAsync(
            calendarIds,
            new Date(),
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
          );
          setEvents(events);
        }
      }
    })();
  }, []);

  //Toggle Task Completion
  const toggleTaskCompletion = (id: number) => {
    setChecklist((prevChecklist) =>
      prevChecklist.map((item) =>
        item.id === id ? { ...item, completed: true } : item
      )
    );
  
    const itemToAnimate = checklist.find((item) => item.id === id);
    if (itemToAnimate) {
      Animated.parallel([
        Animated.timing(itemToAnimate.fadeAnim, {
          toValue: 0, // Fade out
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(itemToAnimate.translateX, {
          toValue: 100, // Slide right
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setChecklist((prevChecklist) => prevChecklist.filter((i) => i.id !== id));
      });
    }
  };
  

  // Add the isAppCreatedEvent function
  const isAppCreatedEvent = (event: ExpoCalendar.Event) => {
    // Debug logging
    console.log("Checking event:", {
      id: event.id,
      title: event.title,
      calendarId: event.calendarId,
    });

    return event.calendarId === "1AD179B2-8C13-4B1E-B0CA-7AFC9843C804";
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Fetching Apple ID...</Text>
        ) : name ? (
          <Text style={styles.nameText}>{name}</Text>
        ) : (
          <Text style={styles.nameText}>Guest</Text>
        )}

        {/* Welcome message */}
        <Text style={styles.welcomeMessage}>How's it going today?</Text>

        {/* Fun Fact Section */}
        <View style={styles.factContainer}>
          <Image source={require("../../assets/images/eye.png")} style={styles.image} />
          <LinearGradient colors={["#cce5ff", "#e6f2ff"]} style={styles.factBubble}>
            <Text style={styles.factTitle}>💡 Did you know?</Text>
            <Text style={styles.factText}>{randomFact}</Text>
          </LinearGradient>
        </View>

        {/*Checklist Section*/}
        <View style={styles.checklistContainer}>
          <Text style={styles.checklistTitle}>To Do List:</Text>
          {checklist.map((item) => (
            <Animated.View
              key={item.id}
              style={{
                opacity: item.fadeAnim,
                transform: [{ translateX: item.translateX }],
              }}
            >
              <View style={styles.checklistItem}>
                <Switch value={item.completed} onValueChange={() => toggleTaskCompletion(item.id)} />
                <Text style={styles.checklistText}>{item.task}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Calendar Section*/}
        <View style={styles.calendarContainer}>
          <CalendarView
            onDayPress={(day: any) => {
              setSelectedDate(day.dateString);
              
              const filteredEvents = events.filter((event) => {
                const eventDate = event.startDate.toString().split("T")[0];
                return eventDate === day.dateString;
              });

              setSelectedEvents(filteredEvents);
            }}

            markedDates={events.reduce((acc, event) => {
              const date = event.startDate.toString().split("T")[0];
              const isAppEvent = isAppCreatedEvent(event);
              console.log("Processing event:", {
                date,
                isAppEvent,
                calendarId: event.calendarId,
                title: event.title,
              });
              const existingMarking = acc[date] || {};
              // Check if this date already has an app event
              const hasExistingAppEvent =
                existingMarking.customStyles?.container?.backgroundColor ===
                "#FFE6E6";

              // If this is an app event or the date already has an app event, use app event styling
              const shouldUseAppStyling = isAppEvent || hasExistingAppEvent;

              return {
                ...acc,
                [date]: {
                  ...existingMarking,
                  dots: shouldUseAppStyling
                    ? [
                        { color: "#FF0000", key: "top", size: 10 },
                        { color: "#FF0000", key: "right", size: 10 },
                        { color: "#FF0000", key: "bottom", size: 10 },
                        { color: "#FF0000", key: "left", size: 10 },
                      ]
                    : [{ color: "#666666", key: "regular", size: 4 }],
                  marked: true,
                },
                customStyles: shouldUseAppStyling
                  ? {
                      container: {
                        backgroundColor: "#FFE6E6",
                        borderWidth: 2,
                        borderColor: "#FF0000",
                        borderRadius: 5,
                      },
                      text: {
                        color: "#FF0000",
                        fontWeight: "bold",
                      },
                    }
                  : undefined,
              };
            }, {} as Record<string, any>)}
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
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
            style={styles.calendar}
          />
        </View>
        
        {/*Event Section*/}
        <View style={styles.eventContainer}>
          {selectedDate && (
            <>
              <Text style={styles.eventTitle}>Events on {selectedDate}:</Text>
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, index) => (
                  <View key={index} style={styles.eventItem}>
                    <Text style={styles.eventName}>{event.title}</Text>
                    <Text style={styles.eventTime}>
                      {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noEvents}>No events scheduled.</Text>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 10,
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
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  factBubble: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: "#5e81c2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  factTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E66E7",
    marginBottom: 5,
  },
  factText: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
  },
  calendarContainer: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 25,
  },
  calendar: {
    width: 375,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  checklistContainer: {
    width: 335,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  checklistTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    backgroundColor: "#e0f7fa",
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  completedTask: {
    color: "#9E9E9E",
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  eventContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 40,
    padding: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventItem: {
    padding: 10,
    backgroundColor: "#e3f2fd",
    marginVertical: 5,
    borderRadius: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
  },
  noEvents: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
  },
});
