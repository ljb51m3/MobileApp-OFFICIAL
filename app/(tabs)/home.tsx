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
  Button,
  TextInput,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar as CalendarView } from "react-native-calendars";
import * as ExpoCalendar from "expo-calendar";
import { Event } from "expo-calendar";

export default function HomeScreen() {
  //const [currentTime, setCurrentTime] = useState<string>(
  // new Date().toLocaleTimeString()
  //);
  const [name, setName] = useState<string>("");
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const diabetesFacts = [
    "Less than 50% of patients with diabetes regularly schedule eye exams.",
    "Diabetes is the leading cause of kidney failure in the United States.",
    "Over 30 million people in the U.S. have diabetes, but about 1 in 4 don’t know they have it.",
    "People with diabetes are at a higher risk for heart disease and stroke.",
    "Diabetes can increase the risk of blindness, nerve damage, and amputations.",
    "Approximately 90-95% of people with diabetes have Type 2 diabetes.",
    "Managing blood sugar levels can significantly reduce the risk of diabetes-related complications.",
    "Diabetes is the 7th leading cause of death in the United States.",
  ];

  const [randomFact, setRandomFact] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);

  //Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Schedule eye exam", completed: false },
    { id: 2, task: "Check blood sugar levels", completed: false },
    { id: 3, task: "Take prescribed medication", completed: false },
    { id: 4, task: "Exercise for 30 minutes", completed: false },
    { id: 5, task: "Eat a healthy meal", completed: false },
  ]);

  // Get Name from AsyncStorage
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

  // Get Time
  /*
  useEffect(() => {
    const intervalId = setInterval(() => {
      const time = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      setCurrentTime(time);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  */
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
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
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
        {/* Name below Welcome! */}
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

        {/* Welcome message */}
        <Text style={styles.welcomeMessage}>How's it going today?</Text>

        {/* Fun Fact Section */}
        <View style={styles.factContainer}>
          <Image
            source={require("../../assets/images/eye.png")}
            style={styles.image}
          />
          <View style={[styles.bubble, { marginLeft: 30 }]}>
            <Text style={styles.bubbleText}>Did you know: {randomFact}</Text>
          </View>
        </View>

        {/*Checklist Section*/}
        <View style={styles.checklistContainer}>
          <Text style={styles.checklistTitle}>Your Tasks For Today</Text>
          {checklist.map((item) => (
            <View key={item.id} style={styles.checklistItem}>
              <Switch
                value={item.completed}
                onValueChange={() => toggleTaskCompletion(item.id)}
              />
              <Text
                style={[
                  styles.checklistText,
                  item.completed && styles.completedTask,
                ]}
              >
                {item.task}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Section*/}
        <View style={styles.calendarContainer}>
          <CalendarView
            onDayPress={(day: any) => {
              console.log("selected day", day);
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
    paddingBottom: 60,
    paddingLeft: 10,
  },
  /*
  time: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },*/
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
    paddingVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#e0f7fa",
    width: "100%",
  },
  checklistText: {
    fontSize: 16,
    color: "black",
    marginLeft: 10,
  },
  completedTask: {
    color: "#a9a9a9",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});

/*

return (time stuff)
<Text style={styles.time}>{currentTime}</Text>



*/
