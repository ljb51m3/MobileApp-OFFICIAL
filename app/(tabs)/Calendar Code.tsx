/*Incase any of this stuff (god forbid) gets lost
 
 Make sure that if you are going to run this you have installed react-native-calendars, expo-calendar, 'react-native-gesture-handler', and 'react-native-picker/picker'
 
 Its still a work in progress... but...y'know */

import {
  View,
  Alert,
  Text,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import * as ExpoCalendar from "expo-calendar";
import { SetStateAction, useEffect, useState } from "react";
import React from "react";
import { TouchableOpacity as GHTouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import TotalPoints from "../../components/TotalPoints";

type Dot = {
  color: string;
  key: string;
  size: number;
};

type DayMarking = {
  dots?: Dot[];
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
  customStyles?: {
    container?: {
      backgroundColor?: string;
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

interface ReminderOption {
  label: string;
  value: number;
  unit: "days" | "weeks" | "months" | "years";
  description: string;
}

const reminderOptions: ReminderOption[] = [
  {
    label: "One Week",
    value: 1,
    unit: "weeks",
    description: "Set a reminder for next week",
  },
  {
    label: "One Month",
    value: 1,
    unit: "months",
    description: "Set a reminder for next month",
  },
  {
    label: "Six Months",
    value: 6,
    unit: "months",
    description: "Set a reminder for six months from now",
  },
  {
    label: "One Year",
    value: 1,
    unit: "years",
    description: "Set a reminder for next year",
  },
];

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true);
  const [selectedClassification, setSelectedClassification] =
    useState("personal");
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    notes: "",
    startTime: "12:00",
    endTime: "1:00",
    classification: "personal",
  });
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endPeriod, setEndPeriod] = useState("AM");
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>(["15"]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFollowUpScheduling, setIsFollowUpScheduling] = useState(false);
  const [reminderInterval, setReminderInterval] = useState<ReminderOption>(
    reminderOptions[0]
  );
  const [showReminderOptionsModal, setShowReminderOptionsModal] =
    useState(false);

  // Add useEffect to log state changes
  useEffect(() => {
    console.log("Modal visibility changed:", {
      showDatePickerModal,
      isFollowUpScheduling,
      modalShouldShow: showDatePickerModal && isFollowUpScheduling,
    });
  }, [showDatePickerModal, isFollowUpScheduling]);

  type AlertOption = {
    label: string;
    value: string;
    selected: boolean;
  };

  const alertOptions: AlertOption[] = [
    { label: "15 minutes before", value: "15", selected: true },
    { label: "30 minutes before", value: "30", selected: false },
    { label: "1 hour before", value: "60", selected: false },
    { label: "2 hours before", value: "120", selected: false },
    { label: "1 day before", value: "1440", selected: false },
    { label: "1 week before", value: "10080", selected: false },
    { label: "2 weeks before", value: "20160", selected: false },
  ];

  type EventClassification = {
    label: string;
    value: string;
    selected: boolean;
  };

  const EventClassification: EventClassification[] = [
    { label: "Personal", value: "personal", selected: false },
    { label: "Eye Exam", value: "eye-exam", selected: false },
    {
      label: "Doctor Appointment",
      value: "doctor-appointment",
      selected: false,
    },
    { label: "Other", value: "other", selected: false },
  ];

  // Add this near the EventClassification definition
  const eventTypeStyles = {
    personal: {
      color: "#000000", // Black text
      backgroundColor: "#B3D9FF", // Light blue background
      borderColor: "#0052CC", // Dark blue border
      emoji: "��",
    },
    "eye-exam": {
      color: "#000000", // Black text
      backgroundColor: "#FFB3B3", // Light red background
      borderColor: "#CC0000", // Dark red border
      emoji: "👁️",
    },
    "doctor-appointment": {
      color: "#000000", // Black text
      backgroundColor: "#B3FFB3", // Light green background
      borderColor: "#006600", // Dark green border
      emoji: "👨‍⚕️",
    },
    other: {
      color: "#000000", // Black text
      backgroundColor: "#E6B3FF", // Light purple background
      borderColor: "#660099", // Dark purple border
      emoji: "📝",
    },
  } as const;

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 1; i <= 12; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i;
        const minute = j.toString().padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const formatTo24Hour = (time: string, period: string) => {
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  const formatTo12Hour = (time: string) => {
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);
    let period = "AM";

    if (hour >= 12) {
      period = "PM";
      if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12;

    return {
      time: `${hour}:${minutes}`,
      period,
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatEventTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  };

  useEffect(() => {
    (async () => {
      // Request both calendar and reminders permissions with write access
      const calendarPermission =
        await ExpoCalendar.requestCalendarPermissionsAsync();
      const reminderPermission =
        await ExpoCalendar.requestRemindersPermissionsAsync();

      if (
        calendarPermission.status === "granted" &&
        reminderPermission.status === "granted"
      ) {
        const calendars = await ExpoCalendar.getCalendarsAsync(
          ExpoCalendar.EntityTypes.EVENT
        );
        // Filter to get only writable calendars
        const writableCalendars = calendars.filter(
          (calendar) => calendar.allowsModifications
        );
        const calendarIds = writableCalendars.map((calendar) => calendar.id);
        const events = await ExpoCalendar.getEventsAsync(
          calendarIds,
          new Date(),
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        );
        setEvents(events as any);
      } else {
        Alert.alert(
          "Permissions Required",
          "Calendar and reminders permissions are required to use this feature"
        );
      }
    })();
  }, []);

  const getEventsForDate = (date: string) => {
    return events.filter((event: ExpoCalendar.Event) => {
      // Convert event date to local timezone and strip time
      const eventDate = new Date(event.startDate);
      const eventDateString = eventDate.toISOString().split("T")[0];
      return eventDateString === date;
    });
  };

  const toggleAlert = (value: string) => {
    setSelectedAlerts((prev) => {
      if (prev.includes(value)) {
        // Remove the value if it was already selected
        return prev.filter((v) => v !== value);
      } else {
        // Add the new value
        return [...prev, value];
      }
    });
  };

  const addEvent = async () => {
    try {
      // Convert times for comparison
      const startTime = formatTo24Hour(newEvent.startTime, startPeriod);
      const endTime = formatTo24Hour(newEvent.endTime, endPeriod);

      // Check times without closing the event modal
      if (startTime >= endTime) {
        setErrorMessage("End time must be after start time");
        setShowErrorModal(true);
        return; // Return early but don't close the event modal
      }

      // Rest of the event creation logic
      const calendars = await ExpoCalendar.getCalendarsAsync();
      const writableCalendar = calendars.find(
        (calendar) => calendar.allowsModifications
      );

      if (!writableCalendar) {
        setErrorMessage("No writable calendar found");
        setShowErrorModal(true);
        return;
      }

      const eventDate = new Date(selectedEventDate + "T12:00:00");

      // Convert times to 24-hour format for storage
      const start24 = formatTo24Hour(newEvent.startTime, startPeriod);
      const end24 = formatTo24Hour(newEvent.endTime, endPeriod);

      // Parse start time
      const [startHours, startMinutes] = start24.split(":");
      eventDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
      const startDate = new Date(eventDate);

      // Parse end time
      const endDate = new Date(eventDate);
      const [endHours, endMinutes] = end24.split(":");
      endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      // Create the alarm object based on selected alerts
      const alarms = selectedAlerts.map((alert) => ({
        relativeOffset: -parseInt(alert),
        method: ExpoCalendar.AlarmMethod.ALERT,
      }));

      await ExpoCalendar.createEventAsync(writableCalendar.id, {
        title: newEvent.title || "New Event",
        startDate,
        endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        location: newEvent.location,
        notes: `[Classification: ${newEvent.classification}]\n${
          newEvent.notes || ""
        }`,
        alarms: alarms,
      });

      // Reset all form fields including alerts
      setNewEvent({
        title: "",
        location: "",
        notes: "",
        startTime: "12:00",
        endTime: "1:00",
        classification: "personal",
      });
      setSelectedAlerts(["15"]); // Reset to default state
      setSelectedClassification("personal");
      setShowEventModal(false);
      Alert.alert("Success", "Event added successfully!");

      // Refresh events immediately
      await refreshEvents();
    } catch (error) {
      setErrorMessage("Failed to add event");
      setShowErrorModal(true);
    }
  };

  // Add a function to refresh events
  const refreshEvents = async () => {
    try {
      const allCalendars = await ExpoCalendar.getCalendarsAsync(
        ExpoCalendar.EntityTypes.EVENT
      );
      const writableCalendars = allCalendars.filter(
        (calendar) => calendar.allowsModifications
      );
      const calendarIds = writableCalendars.map((calendar) => calendar.id);

      const updatedEvents = await ExpoCalendar.getEventsAsync(
        calendarIds,
        new Date(),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      );
      setEvents(updatedEvents as any);
    } catch (error) {
      console.error("Error refreshing events:", error);
    }
  };

  const openTimePicker = (isStart: boolean) => {
    setIsStartTime(isStart);
    setShowTimePickerModal(true);
  };

  // Update the deleteEvent function to use refreshEvents
  const deleteEvent = async (eventId: string) => {
    try {
      await ExpoCalendar.deleteEventAsync(eventId);
      await refreshEvents(); // Refresh events after deletion
      Alert.alert("Success", "Event deleted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete event");
      console.error(error);
    }
  };

  // Update the isAppCreatedEvent function
  const isAppCreatedEvent = (event: ExpoCalendar.Event) => {
    // Log event details for debugging
    console.log("Event details:", {
      id: event.id,
      title: event.title,
      calendarId: event.calendarId,
    });

    // Check specifically for the app's calendar ID
    return event.calendarId === "1AD179B2-8C13-4B1E-B0CA-7AFC9843C804";
  };

  // Add this helper function near the top of the component
  const parseEventDetails = (event: ExpoCalendar.Event) => {
    const notes = event.notes || "";
    const classificationMatch = notes.match(
      /\[Classification: (.*?)\]\n?(.*)/s
    );

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

  const handleDateSelection = async (dateString: string) => {
    setSelectedEventDate(dateString);

    if (isFollowUpScheduling) {
      try {
        const calendars = await ExpoCalendar.getCalendarsAsync();
        const writableCalendar = calendars.find(
          (calendar) => calendar.allowsModifications
        );

        if (!writableCalendar) {
          setErrorMessage("No writable calendar found");
          setShowErrorModal(true);
          return;
        }

        // Calculate the reminder date string
        const reminderDateString = calculateReminderDate(
          dateString,
          reminderInterval
        );

        // Create the reminder date at 10 AM on the calculated date
        const reminderDate = new Date(reminderDateString);
        reminderDate.setHours(10, 0, 0, 0);

        // Create the event
        await ExpoCalendar.createEventAsync(writableCalendar.id, {
          title: `Reminder: Scheduled ${reminderInterval.label} Follow-up`,
          startDate: reminderDate,
          endDate: new Date(reminderDate.getTime() + 60 * 60 * 1000), // 1 hour duration
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notes: "[Classification: other]\nScheduled follow-up reminder",
          alarms: [
            {
              relativeOffset: -1440, // 1 day before
              method: ExpoCalendar.AlarmMethod.ALERT,
            },
            {
              relativeOffset: -60, // 1 hour before
              method: ExpoCalendar.AlarmMethod.ALERT,
            },
          ],
        });

        setIsFollowUpScheduling(false);
        setShowReminderOptionsModal(false);
        await refreshEvents();

        Alert.alert(
          "Reminder Scheduled",
          `Your reminder has been scheduled for ${formatDate(
            reminderDateString
          )}`,
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error("Error scheduling reminder:", error);
        setErrorMessage("Failed to schedule reminder");
        setShowErrorModal(true);
      }
    }

    setShowDatePickerModal(false);
  };

  const calculateReminderDate = (
    initialDate: string,
    option: ReminderOption
  ) => {
    // Create a date at the start of the day in local timezone
    const date = new Date(initialDate);
    date.setHours(0, 0, 0, 0);

    switch (option.unit) {
      case "days":
        date.setDate(date.getDate() + option.value);
        break;
      case "weeks":
        date.setDate(date.getDate() + option.value * 7);
        break;
      case "months":
        date.setMonth(date.getMonth() + option.value);
        break;
      case "years":
        date.setFullYear(date.getFullYear() + option.value);
        break;
    }

    return date.toISOString().split("T")[0];
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Error Modal - Move it here, at the very top level */}
      {showErrorModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            elevation: 99999,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#dc3545",
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              Error
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 20,
                textAlign: "center",
                color: "#333",
              }}
            >
              {errorMessage}
            </Text>
            <TouchableOpacity
              onPress={() => setShowErrorModal(false)}
              style={{
                backgroundColor: "#dc3545",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                minWidth: 100,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: "#f8f9fa" }}
          contentContainerStyle={{
            paddingTop: 50,
            paddingHorizontal: 15,
            paddingBottom: 200,
          }}
        >
          <TotalPoints />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              My Calendar
            </Text>
          </View>

          {/* Add Event Button */}
          <TouchableOpacity
            onPress={() => {
              if (selectedDate) {
                setSelectedEventDate(selectedDate);
              }
              setShowEventModal(true);
            }}
            style={{
              backgroundColor: "#095da7",
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              width: "100%",
              borderWidth: 1,
              borderColor: "#095da7",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Add New Event
            </Text>
            <Text style={{ fontSize: 24, color: "#095da7" }}>📅</Text>
          </TouchableOpacity>

          {/* Reminder Scheduler Button */}
          <TouchableOpacity
            onPress={() => setShowReminderOptionsModal(true)}
            style={{
              backgroundColor: "#095da7",
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              width: "100%",
              borderWidth: 1,
              borderColor: "#095da7",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Schedule Future Reminders
            </Text>
            <Text style={{ fontSize: 24, color: "#095da7" }}>⏰</Text>
          </TouchableOpacity>

          <Calendar
            onDayPress={(day: { dateString: string }) => {
              setSelectedDate(day.dateString);
            }}
            markedDates={{
              ...Object.fromEntries(
                Object.entries(
                  events.reduce(
                    (
                      acc: { [key: string]: ExpoCalendar.Event[] },
                      event: ExpoCalendar.Event
                    ) => {
                      const eventDate = new Date(event.startDate);
                      const date = eventDate.toISOString().split("T")[0];
                      if (!acc[date]) {
                        acc[date] = [];
                      }
                      acc[date].push(event);
                      return acc;
                    },
                    {}
                  )
                ).map(([date, dateEvents]) => {
                  const isSelected = date === selectedDate;

                  // Check if there's an app-created event for this date
                  const appEvent = dateEvents.find((event) =>
                    isAppCreatedEvent(event)
                  );

                  if (appEvent) {
                    // If there's an app event, use its styling
                    const { classification } = parseEventDetails(appEvent);
                    const eventStyle =
                      eventTypeStyles[
                        classification as keyof typeof eventTypeStyles
                      ];

                    return [
                      date,
                      {
                        marked: true,
                        selected: isSelected,
                        dots: [
                          {
                            color: eventStyle?.borderColor || "#095da7",
                            key: "dot",
                            size: 4,
                          },
                        ],
                        customStyles: {
                          container: {
                            backgroundColor: isSelected
                              ? eventStyle?.borderColor || "#095da7"
                              : eventStyle?.backgroundColor || "transparent",
                            borderWidth: 2,
                            borderColor: eventStyle?.borderColor || "#095da7",
                            borderRadius: 20,
                          },
                          text: {
                            color: isSelected
                              ? "#FFFFFF"
                              : eventStyle?.color || "#095da7",
                            fontWeight: "bold",
                          },
                        },
                      },
                    ];
                  } else {
                    // If no app event, use regular styling
                    return [
                      date,
                      {
                        marked: true,
                        selected: isSelected,
                        selectedColor: "#095da7",
                        dotColor: "#666666",
                      },
                    ];
                  }
                })
              ),
              ...(selectedDate &&
              !events.some((event: ExpoCalendar.Event) => {
                const eventDate = new Date(event.startDate);
                return eventDate.toISOString().split("T")[0] === selectedDate;
              })
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: "#095da7",
                    },
                  }
                : {}),
            }}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#2d4150",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#095da7",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              arrowColor: "#095da7",
              monthTextColor: "#2d4150",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 16,
              textDayFontWeight: "600",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
            }}
            style={{
              height: 370,
              borderWidth: 1,
              borderColor: "#E5E5E5",
            }}
            markingType="custom"
          />

          {selectedDate && (
            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Events for{" "}
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
                :
              </Text>
              {getEventsForDate(selectedDate).map(
                (event: ExpoCalendar.Event, index: number) => {
                  const isExpanded = expandedEventId === event.id;
                  const isAppEvent = isAppCreatedEvent(event);
                  const { classification, notes } = parseEventDetails(event);

                  return (
                    <TouchableOpacity
                      key={event.id}
                      onPress={() => {
                        console.log("Pressed event:", event.id);
                        console.log(
                          "Current expandedEventId:",
                          expandedEventId
                        );
                        setExpandedEventId(isExpanded ? null : event.id);
                      }}
                      style={[
                        {
                          marginBottom: 10,
                          borderRadius: 8,
                          overflow: "hidden",
                          elevation: isAppEvent ? 4 : 2,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: isAppEvent ? 2 : 1,
                          },
                          shadowOpacity: isAppEvent ? 0.3 : 0.22,
                          shadowRadius: isAppEvent ? 4 : 2.22,
                        },
                      ]}
                    >
                      <View
                        style={{
                          backgroundColor: isAppEvent
                            ? eventTypeStyles[
                                classification as keyof typeof eventTypeStyles
                              ]?.backgroundColor || "#f0f0f0"
                            : "#f0f0f0",
                          padding: 15,
                          borderRadius: 6,
                          borderWidth: isAppEvent ? 2 : 0,
                          borderColor: isAppEvent
                            ? eventTypeStyles[
                                classification as keyof typeof eventTypeStyles
                              ]?.borderColor || "#ddd"
                            : "#ddd",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: isAppEvent ? "800" : "bold",
                              flex: 1,
                              fontSize: isAppEvent ? 18 : 16,
                              color: isAppEvent
                                ? eventTypeStyles[
                                    classification as keyof typeof eventTypeStyles
                                  ]?.color || "#333"
                                : "#333",
                            }}
                          >
                            {isAppEvent
                              ? eventTypeStyles[
                                  classification as keyof typeof eventTypeStyles
                                ]?.emoji || "🔷"
                              : ""}{" "}
                            {event.title}
                          </Text>
                          <Text
                            style={{
                              color: isAppEvent
                                ? eventTypeStyles[
                                    classification as keyof typeof eventTypeStyles
                                  ]?.color || "#666"
                                : "#666",
                              fontSize: 14,
                              fontWeight: isAppEvent ? "600" : "normal",
                            }}
                          >
                            {formatEventTime(new Date(event.startDate))}
                          </Text>
                        </View>

                        {isExpanded && (
                          <View
                            style={{
                              marginTop: 10,
                              paddingTop: 10,
                              borderTopWidth: 1,
                              borderTopColor: isAppEvent
                                ? eventTypeStyles[
                                    classification as keyof typeof eventTypeStyles
                                  ]?.borderColor || "#ddd"
                                : "#ddd",
                              backgroundColor: isAppEvent
                                ? "#FFFFFF"
                                : undefined,
                              padding: isAppEvent ? 12 : 0,
                              borderRadius: isAppEvent ? 6 : 0,
                              borderWidth: isAppEvent ? 1 : 0,
                              borderColor:
                                eventTypeStyles[
                                  classification as keyof typeof eventTypeStyles
                                ]?.borderColor || "#ddd",
                            }}
                          >
                            {isAppEvent && (
                              <Text
                                style={{
                                  marginBottom: 8,
                                  color:
                                    eventTypeStyles[
                                      classification as keyof typeof eventTypeStyles
                                    ]?.color || "#333",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                {eventTypeStyles[
                                  classification as keyof typeof eventTypeStyles
                                ]?.emoji || ""}
                                {" Type: "}
                                {EventClassification.find(
                                  (c) => c.value === classification
                                )?.label || classification}
                              </Text>
                            )}

                            {notes && (
                              <Text
                                style={{
                                  marginBottom: 8,
                                  color: isAppEvent
                                    ? eventTypeStyles[
                                        classification as keyof typeof eventTypeStyles
                                      ]?.color || "#333"
                                    : "#333",
                                  fontSize: isAppEvent ? 16 : 14,
                                  fontWeight: isAppEvent ? "600" : "normal",
                                }}
                              >
                                {notes}
                              </Text>
                            )}

                            <Text
                              style={{
                                color: isAppEvent
                                  ? eventTypeStyles[
                                      classification as keyof typeof eventTypeStyles
                                    ]?.color || "#333"
                                  : "#666",
                                fontSize: isAppEvent ? 15 : 14,
                                fontWeight: isAppEvent ? "600" : "normal",
                                marginTop: isAppEvent ? 8 : 0,
                              }}
                            >
                              ⏰ {formatEventTime(new Date(event.startDate))} -{" "}
                              {formatEventTime(new Date(event.endDate))}
                            </Text>
                            {event.location && (
                              <Text
                                style={{
                                  marginTop: 8,
                                  color: isAppEvent
                                    ? eventTypeStyles[
                                        classification as keyof typeof eventTypeStyles
                                      ]?.color || "#333"
                                    : "#666",
                                  fontSize: isAppEvent ? 15 : 14,
                                  fontWeight: isAppEvent ? "600" : "normal",
                                }}
                              >
                                📍 {event.location}
                              </Text>
                            )}

                            {isAppEvent && (
                              <TouchableOpacity
                                onPress={() => {
                                  Alert.alert(
                                    "Delete Event",
                                    "Are you sure you want to delete this event?",
                                    [
                                      {
                                        text: "Cancel",
                                        style: "cancel",
                                      },
                                      {
                                        text: "Delete",
                                        onPress: () => deleteEvent(event.id),
                                        style: "destructive",
                                      },
                                    ]
                                  );
                                }}
                                style={{
                                  backgroundColor: "#ff4444",
                                  padding: 10,
                                  borderRadius: 6,
                                  marginTop: 12,
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: 14,
                                  }}
                                >
                                  Delete Event
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }
              )}
              {getEventsForDate(selectedDate).length === 0 && (
                <Text>No events for this date</Text>
              )}
            </View>
          )}
        </ScrollView>

        {/* Follow-up Reminder Date Picker Modal */}
        <Modal
          visible={showDatePickerModal && isFollowUpScheduling}
          animationType="none"
          transparent={true}
          onShow={() => console.log("Modal onShow triggered")}
          statusBarTranslucent={true}
        >
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              // Close modal when clicking outside
              setShowDatePickerModal(false);
              setIsFollowUpScheduling(false);
            }}
          >
            <Pressable
              style={{
                backgroundColor: "white",
                width: "90%",
                padding: 20,
                borderRadius: 10,
                maxHeight: "90%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
              onPress={(e) => {
                // Prevent closing when clicking inside the modal
                e.stopPropagation();
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 10,
                  textAlign: "center",
                  color: "#095da7",
                }}
              >
                Schedule {reminderInterval.label} Reminder
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "#666",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Select the initial date to schedule your{" "}
                {reminderInterval.label.toLowerCase()} reminder
              </Text>

              <Calendar
                current={selectedEventDate}
                onDayPress={(day: { dateString: string }) => {
                  setSelectedEventDate(day.dateString);
                }}
                markedDates={{
                  [selectedEventDate]: {
                    selected: true,
                    selectedColor: "#095da7",
                  },
                }}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#E5E5E5",
                  marginBottom: 20,
                }}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  selectedDayBackgroundColor: "#095da7",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#095da7",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e1e8",
                  dotColor: "#095da7",
                  selectedDotColor: "#ffffff",
                  arrowColor: "#095da7",
                  monthTextColor: "#2d4150",
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
              />

              <View
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: 15,
                  borderRadius: 8,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: "#dee2e6",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#2d4150",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  Initial Appointment: {formatDate(selectedEventDate)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  Follow-up Reminder:{" "}
                  {formatDate(
                    calculateReminderDate(selectedEventDate, reminderInterval)
                  )}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowDatePickerModal(false);
                    setIsFollowUpScheduling(false);
                  }}
                  style={{
                    backgroundColor: "#f8f9fa",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    flex: 1,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: "#dee2e6",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#495057",
                      fontSize: 16,
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDateSelection(selectedEventDate)}
                  style={{
                    backgroundColor: "#095da7",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    flex: 1,
                    marginLeft: 10,
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Schedule Reminder
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal
          visible={showEventModal}
          animationType="slide"
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={(e) => e.stopPropagation()}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        padding: 20,
                        borderRadius: 10,
                        zIndex: 1001,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          marginBottom: 20,
                        }}
                      >
                        Add New Event
                      </Text>

                      <TextInput
                        placeholder="Event Title"
                        value={newEvent.title}
                        onChangeText={(text) =>
                          setNewEvent({ ...newEvent, title: text })
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: "#ddd",
                          padding: 10,
                          marginBottom: 10,
                          borderRadius: 5,
                        }}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />

                      <TextInput
                        placeholder="Location"
                        value={newEvent.location}
                        onChangeText={(text) =>
                          setNewEvent({ ...newEvent, location: text })
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: "#ddd",
                          padding: 10,
                          marginBottom: 10,
                          borderRadius: 5,
                        }}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />

                      <TextInput
                        placeholder="Notes"
                        value={newEvent.notes}
                        onChangeText={(text) =>
                          setNewEvent({ ...newEvent, notes: text })
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: "#ddd",
                          padding: 10,
                          marginBottom: 10,
                          borderRadius: 5,
                        }}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                      <View style={{ marginBottom: 10 }}>
                        <Text style={{ marginBottom: 5 }}>Date</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePickerModal(true);
                            setIsFollowUpScheduling(false); // Ensure we're not in follow-up mode
                          }}
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            padding: 15,
                            borderRadius: 5,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <Text style={{ color: "#2d4150", fontSize: 16 }}>
                            📅 {formatDate(selectedEventDate)}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginBottom: 10 }}>
                        <Text style={{ marginBottom: 5 }}>Start Time</Text>
                        <TouchableOpacity
                          onPress={() => openTimePicker(true)}
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            padding: 15,
                            borderRadius: 5,
                          }}
                        >
                          <Text>
                            {newEvent.startTime} {startPeriod}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 5 }}>End Time</Text>
                        <TouchableOpacity
                          onPress={() => openTimePicker(false)}
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            padding: 15,
                            borderRadius: 5,
                          }}
                        >
                          <Text>
                            {newEvent.endTime} {endPeriod}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 5 }}>Reminders</Text>
                        <TouchableOpacity
                          onPress={() => setShowReminderModal(true)}
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            padding: 15,
                            borderRadius: 5,
                          }}
                        >
                          <Text>
                            {selectedAlerts.length === 0
                              ? "No reminders set"
                              : `${selectedAlerts.length} reminder${
                                  selectedAlerts.length !== 1 ? "s" : ""
                                } set`}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 5 }}>Event Type</Text>
                        <TouchableOpacity
                          onPress={() => setShowClassificationModal(true)}
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            padding: 15,
                            borderRadius: 5,
                          }}
                        >
                          <Text>
                            {EventClassification.find(
                              (c) => c.value === newEvent.classification
                            )?.label || "Select type"}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            // Reset all modal states
                            setShowEventModal(false);
                            setShowTimePickerModal(false);
                            setShowDatePickerModal(false);
                            setShowReminderModal(false);
                            setShowErrorModal(false);

                            // Reset form states
                            setNewEvent({
                              title: "",
                              location: "",
                              notes: "",
                              startTime: "12:00",
                              endTime: "1:00",
                              classification: "personal",
                            });
                            setSelectedAlerts(["15"]);
                            setSelectedEventDate(
                              new Date().toISOString().split("T")[0]
                            );
                            setStartPeriod("AM");
                            setEndPeriod("AM");
                            setErrorMessage("");
                          }}
                          style={{
                            backgroundColor: "#f8f9fa",
                            paddingVertical: 16,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            flex: 1,
                            marginRight: 10,
                            borderWidth: 1,
                            borderColor: "#dee2e6",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 60,
                          }}
                        >
                          <Text
                            style={{
                              color: "#495057",
                              fontSize: 18,
                              fontWeight: "600",
                              textAlign: "center",
                            }}
                          >
                            Cancel Event
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={addEvent}
                          style={{
                            backgroundColor: "#095da7",
                            paddingVertical: 16,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            flex: 1,
                            marginLeft: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            minHeight: 60,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 18,
                              fontWeight: "600",
                              textAlign: "center",
                            }}
                          >
                            Save Event
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Time Picker Modal*/}
                      <Modal
                        visible={showTimePickerModal}
                        animationType="slide"
                        transparent={true}
                      >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              justifyContent: "center",
                            }}
                          >
                            <TouchableWithoutFeedback
                              onPress={Keyboard.dismiss}
                            >
                              <View
                                style={{
                                  backgroundColor: "white",
                                  margin: 20,
                                  padding: 20,
                                  borderRadius: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    marginBottom: 15,
                                    textAlign: "center",
                                  }}
                                >
                                  Select {isStartTime ? "Start" : "End"} Time
                                </Text>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    marginBottom: 20,
                                  }}
                                >
                                  <View style={{ flex: 2 }}>
                                    <Picker
                                      selectedValue={
                                        isStartTime
                                          ? newEvent.startTime
                                          : newEvent.endTime
                                      }
                                      onValueChange={(itemValue) =>
                                        setNewEvent({
                                          ...newEvent,
                                          [isStartTime
                                            ? "startTime"
                                            : "endTime"]: itemValue,
                                        })
                                      }
                                      style={{ height: 150 }}
                                    >
                                      {timeOptions.map((time) => (
                                        <Picker.Item
                                          key={time}
                                          label={time}
                                          value={time}
                                        />
                                      ))}
                                    </Picker>
                                  </View>
                                  <View style={{ flex: 1 }}>
                                    <Picker
                                      selectedValue={
                                        isStartTime ? startPeriod : endPeriod
                                      }
                                      onValueChange={(value) =>
                                        isStartTime
                                          ? setStartPeriod(value)
                                          : setEndPeriod(value)
                                      }
                                      style={{ height: 150 }}
                                    >
                                      <Picker.Item label="AM" value="AM" />
                                      <Picker.Item label="PM" value="PM" />
                                    </Picker>
                                  </View>
                                </View>

                                <TouchableOpacity
                                  onPress={() => setShowTimePickerModal(false)}
                                  style={{
                                    backgroundColor: "#095da7",
                                    paddingVertical: 15,
                                    paddingHorizontal: 25,
                                    borderRadius: 8,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                      width: 0,
                                      height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "white",
                                      textAlign: "center",
                                      fontSize: 16,
                                      fontWeight: "600",
                                    }}
                                  >
                                    Confirm Time
                                  </Text>
                                  <Text
                                    style={{
                                      color: "rgba(255,255,255,0.8)",
                                      textAlign: "center",
                                      fontSize: 12,
                                      marginTop: 4,
                                    }}
                                  >
                                    Set selected time
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>

                      {/* Reminder Modal */}
                      <Modal
                        visible={showReminderModal}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setShowReminderModal(false)}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "white",
                              width: "90%",
                              padding: 20,
                              borderRadius: 10,
                              maxHeight: "80%",
                              elevation: 5,
                              shadowColor: "#000",
                              shadowOffset: {
                                width: 0,
                                height: 2,
                              },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                marginBottom: 20,
                                textAlign: "center",
                                color: "#2d4150",
                              }}
                            >
                              Set Event Reminders
                            </Text>

                            <Text
                              style={{
                                fontSize: 16,
                                marginBottom: 15,
                                color: "#666",
                                textAlign: "center",
                                lineHeight: 24,
                              }}
                            >
                              Select when you would like to be reminded about
                              this event
                            </Text>

                            <ScrollView style={{ maxHeight: 300 }}>
                              {alertOptions.map((option) => (
                                <TouchableOpacity
                                  key={option.value}
                                  onPress={() => toggleAlert(option.value)}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: 15,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#eee",
                                    backgroundColor: selectedAlerts.includes(
                                      option.value
                                    )
                                      ? "#f0f8ff"
                                      : "white",
                                  }}
                                >
                                  <View
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 12,
                                      borderWidth: 2,
                                      borderColor: "#095da7",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      marginRight: 15,
                                    }}
                                  >
                                    {selectedAlerts.includes(option.value) && (
                                      <View
                                        style={{
                                          width: 12,
                                          height: 12,
                                          borderRadius: 6,
                                          backgroundColor: "#095da7",
                                        }}
                                      />
                                    )}
                                  </View>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      color: selectedAlerts.includes(
                                        option.value
                                      )
                                        ? "#095da7"
                                        : "#333",
                                    }}
                                  >
                                    {option.label}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>

                            <TouchableOpacity
                              onPress={() => setShowReminderModal(false)}
                              style={{
                                backgroundColor: "#095da7",
                                padding: 15,
                                borderRadius: 8,
                                marginTop: 20,
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 16,
                                  fontWeight: "600",
                                }}
                              >
                                Confirm Reminders
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>

                      {/* Classification Modal */}
                      <Modal
                        visible={showClassificationModal}
                        animationType="slide"
                        transparent={true}
                      >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              justifyContent: "center",
                            }}
                          >
                            <TouchableWithoutFeedback
                              onPress={Keyboard.dismiss}
                            >
                              <View
                                style={{
                                  backgroundColor: "white",
                                  margin: 20,
                                  padding: 20,
                                  borderRadius: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    marginBottom: 15,
                                    textAlign: "center",
                                  }}
                                >
                                  Select Event Type
                                </Text>

                                {EventClassification.map((option) => (
                                  <TouchableOpacity
                                    key={option.value}
                                    onPress={() => {
                                      setNewEvent({
                                        ...newEvent,
                                        classification: option.value,
                                      });
                                      setSelectedClassification(option.value);
                                      setShowClassificationModal(false);
                                    }}
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      padding: 20,
                                      borderBottomWidth: 1,
                                      borderBottomColor: "#eee",
                                      backgroundColor:
                                        newEvent.classification === option.value
                                          ? "#f0f8ff"
                                          : "white",
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        borderWidth: 2,
                                        borderColor: "#095da7",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: 15,
                                      }}
                                    >
                                      {newEvent.classification ===
                                        option.value && (
                                        <View
                                          style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 8,
                                            backgroundColor: "#095da7",
                                          }}
                                        />
                                      )}
                                    </View>
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        color:
                                          newEvent.classification ===
                                          option.value
                                            ? "#095da7"
                                            : "#333",
                                      }}
                                    >
                                      {option.label}
                                    </Text>
                                  </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                  onPress={() =>
                                    setShowClassificationModal(false)
                                  }
                                  style={{
                                    backgroundColor: "#095da7",
                                    padding: 15,
                                    borderRadius: 8,
                                    marginTop: 20,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "white",
                                      fontSize: 16,
                                      fontWeight: "600",
                                    }}
                                  >
                                    Cancel
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>

                      {/* Date Picker Modal for New Event */}
                      <Modal
                        visible={showDatePickerModal && !isFollowUpScheduling}
                        animationType="none"
                        transparent={true}
                        statusBarTranslucent={true}
                      >
                        <Pressable
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => setShowDatePickerModal(false)}
                        >
                          <Pressable
                            style={{
                              backgroundColor: "white",
                              width: "90%",
                              padding: 20,
                              borderRadius: 10,
                              maxHeight: "90%",
                              shadowColor: "#000",
                              shadowOffset: {
                                width: 0,
                                height: 2,
                              },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                            }}
                            onPress={(e) => e.stopPropagation()}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                marginBottom: 10,
                                textAlign: "center",
                                color: "#095da7",
                              }}
                            >
                              Select Event Date
                            </Text>

                            <Calendar
                              current={selectedEventDate}
                              onDayPress={(day: { dateString: string }) => {
                                setSelectedEventDate(day.dateString);
                                setShowDatePickerModal(false);
                              }}
                              markedDates={{
                                [selectedEventDate]: {
                                  selected: true,
                                  selectedColor: "#095da7",
                                },
                              }}
                              style={{
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "#E5E5E5",
                                marginBottom: 20,
                              }}
                              theme={{
                                backgroundColor: "#ffffff",
                                calendarBackground: "#ffffff",
                                selectedDayBackgroundColor: "#095da7",
                                selectedDayTextColor: "#ffffff",
                                todayTextColor: "#095da7",
                                dayTextColor: "#2d4150",
                                textDisabledColor: "#d9e1e8",
                                dotColor: "#095da7",
                                selectedDotColor: "#ffffff",
                                arrowColor: "#095da7",
                                monthTextColor: "#2d4150",
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14,
                              }}
                            />
                          </Pressable>
                        </Pressable>
                      </Modal>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Reminder Options Modal */}
        <Modal
          visible={showReminderOptionsModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowReminderOptionsModal(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setShowReminderOptionsModal(false)}
          >
            <Pressable
              style={{
                backgroundColor: "white",
                width: "90%",
                padding: 20,
                borderRadius: 15,
                maxHeight: "80%",
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
              onPress={(e) => e.stopPropagation()}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 15,
                  color: "#2d4150",
                  textAlign: "center",
                }}
              >
                Schedule Future Reminders
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: "#666",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Choose when you'd like to be reminded
              </Text>

              {reminderOptions.map((option) => (
                <TouchableOpacity
                  key={`${option.value}-${option.unit}`}
                  onPress={() => {
                    const today = new Date().toISOString().split("T")[0];
                    setSelectedEventDate(today);
                    setReminderInterval(option);
                    setIsFollowUpScheduling(true);
                    setShowDatePickerModal(true);
                    setShowReminderOptionsModal(false);
                  }}
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 15,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#095da7",
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#095da7",
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 4,
                      }}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={{
                        color: "#666",
                        fontSize: 12,
                      }}
                    >
                      {option.description}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 20, color: "#095da7" }}>→</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setShowReminderOptionsModal(false)}
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: 15,
                  borderRadius: 8,
                  marginTop: 10,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#dee2e6",
                }}
              >
                <Text
                  style={{
                    color: "#495057",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  calendar: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    height: 370,
  },
});
