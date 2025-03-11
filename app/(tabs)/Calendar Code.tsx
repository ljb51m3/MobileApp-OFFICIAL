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
} from "react-native";
import { Calendar } from "react-native-calendars";
import * as ExpoCalendar from "expo-calendar";
import { SetStateAction, useEffect, useState } from "react";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

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

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true);
  const [selectedClassification, setSelectedClassification] = useState("personal");
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
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>(["15"]); // Array of selected times
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    {label: "Personal", value: "personal", selected: false},
    {label: "Eye Exam", value: "eye-exam", selected: false},
    {label: "Doctor Appointment", value: "doctor-appointment", selected: false},
    {label: "Other", value: "other", selected: false},
];

// Add this near the EventClassification definition
const eventTypeStyles = {
  'personal': {
    color: '#4A90E2',
    backgroundColor: '#EBF3FC',
    borderColor: '#4A90E2',
    emoji: '👤'
  },
  'eye-exam': {
    color: '#FF6B6B',
    backgroundColor: '#FFE6E6',
    borderColor: '#FF6B6B',
    emoji: '👁️'
  },
  'doctor-appointment': {
    color: '#50C878',
    backgroundColor: '#E6F5EC',
    borderColor: '#50C878',
    emoji: '👨‍⚕️'
  },
  'other': {
    color: '#9B59B6',
    backgroundColor: '#F4ECF7',
    borderColor: '#9B59B6',
    emoji: '��'
  }
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
      const eventDateString = eventDate.toISOString().split('T')[0];
      return eventDateString === date;
    });
  };

  const toggleAlert = (value: string) => {
    setSelectedAlerts(prev => {
      if (prev.includes(value)) {
        // Remove the value if it was already selected
        return prev.filter(v => v !== value);
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
      const alarms = selectedAlerts.map(alert => ({
        relativeOffset: -parseInt(alert),
        method: ExpoCalendar.AlarmMethod.ALERT,
      }));

      await ExpoCalendar.createEventAsync(writableCalendar.id, {
        title: newEvent.title || "New Event",
        startDate,
        endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        location: newEvent.location,
        notes: `[Classification: ${newEvent.classification}]\n${newEvent.notes || ''}`,
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
      console.error('Error refreshing events:', error);
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
    console.log('Event details:', {
      id: event.id,
      title: event.title,
      calendarId: event.calendarId,
    });
    
    // Check specifically for the app's calendar ID
    return event.calendarId === '1AD179B2-8C13-4B1E-B0CA-7AFC9843C804';
  };

  // Add this helper function near the top of the component
  const parseEventDetails = (event: ExpoCalendar.Event) => {
    const notes = event.notes || '';
    const classificationMatch = notes.match(/\[Classification: (.*?)\]\n?(.*)/s);
    
    if (classificationMatch) {
      return {
        classification: classificationMatch[1],
        notes: classificationMatch[2].trim()
      };
    }
    
    return {
      classification: 'other',
      notes: notes.trim()
    };
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Error Modal - Move it here, at the very top level */}
      {showErrorModal && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          elevation: 99999,
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#dc3545',
              marginBottom: 15,
              textAlign: 'center',
            }}>
              Error
            </Text>
            <Text style={{
              fontSize: 16,
              marginBottom: 20,
              textAlign: 'center',
              color: '#333',
            }}>
              {errorMessage}
            </Text>
            <TouchableOpacity
              onPress={() => setShowErrorModal(false)}
              style={{
                backgroundColor: '#dc3545',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                minWidth: 100,
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                textAlign: 'center',
                fontWeight: '500',
              }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 50,
            paddingHorizontal: 15,
            paddingBottom: 200,
          }}
        >
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
            <TouchableOpacity
              onPress={() => {
                if (selectedDate) {
                  setSelectedEventDate(selectedDate);
                }
                setShowEventModal(true);
              }}
              style={{
                backgroundColor: "#2E66E7",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Add Event</Text>
            </TouchableOpacity>
          </View>

          <Calendar
            onDayPress={(day: any) => {
              setSelectedDate(day.dateString);
            }}
            markedDates={Object.entries(
              events.reduce<{ [key: string]: { hasAppEvent: boolean; events: ExpoCalendar.Event[]; classification?: string } }>(
                (acc, event: ExpoCalendar.Event) => {
                  const eventDate = new Date(event.startDate);
                  const date = eventDate.toISOString().split('T')[0];
                  
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
                },
                {}
              )
            ).reduce<MarkedDates>((markings, [date, dateData]) => {
              const isSelected = date === selectedDate;
              const eventStyle = dateData.classification ? eventTypeStyles[dateData.classification as keyof typeof eventTypeStyles] : undefined;
              
              return {
                ...markings,
                [date]: {
                  marked: true,
                  selected: isSelected,
                  selectedColor: isSelected ? (eventStyle?.color || '#2E66E7') : (eventStyle?.backgroundColor || '#f0f0f0'),
                  selectedTextColor: '#FFFFFF',
                  dots: dateData.hasAppEvent ? [
                    { color: eventStyle?.color || '#666666', key: 'regular', size: 4 }
                  ] : [
                    { color: '#666666', key: 'regular', size: 4 }
                  ],
                  customStyles: dateData.hasAppEvent ? {
                    container: {
                      backgroundColor: isSelected ? (eventStyle?.color || '#2E66E7') : (eventStyle?.backgroundColor || '#f0f0f0'),
                      borderWidth: 1,
                      borderColor: eventStyle?.borderColor || '#ddd'
                    },
                    text: {
                      color: isSelected ? '#FFFFFF' : (eventStyle?.color || '#333'),
                      fontWeight: 'bold'
                    }
                  } : undefined
                }
              };
            }, {} as MarkedDates)}
            markingType={'custom'}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              selectedDayBackgroundColor: '#2E66E7',
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: '#2E66E7',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#666666',
              selectedDotColor: '#FFFFFF',
              arrowColor: '#2E66E7',
              monthTextColor: '#2d4150',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 16,
              textSectionTitleColor: '#2d4150',
              textDayFontWeight: '600',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600'
            }}
            style={{
              height: 370,
              borderWidth: 1,
              borderColor: '#E5E5E5',
            }}
          />

          {selectedDate && (
            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Events for{" "}
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                :
              </Text>
              {getEventsForDate(selectedDate).map((event: ExpoCalendar.Event, index: number) => {
                const isExpanded = expandedEventId === event.id;
                const isAppEvent = isAppCreatedEvent(event);
                const { classification, notes } = parseEventDetails(event);

                return (
                  <TouchableOpacity
                    key={event.id}
                    onPress={() => {
                      console.log("Pressed event:", event.id);
                      console.log("Current expandedEventId:", expandedEventId);
                      setExpandedEventId(isExpanded ? null : event.id);
                    }}
                    style={[
                      {
                        marginBottom: 10,
                        borderRadius: 8,
                        overflow: "hidden",
                        elevation: isAppEvent ? 4 : 2,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: isAppEvent ? 2 : 1 },
                        shadowOpacity: isAppEvent ? 0.3 : 0.22,
                        shadowRadius: isAppEvent ? 4 : 2.22,
                      },
                    ]}
                  >
                    <View
                      style={{
                        backgroundColor: isAppEvent 
                          ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.backgroundColor || '#f0f0f0')
                          : '#f0f0f0',
                        padding: 15,
                        borderRadius: 6,
                        borderWidth: isAppEvent ? 2 : 0,
                        borderColor: isAppEvent 
                          ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.borderColor || '#ddd')
                          : '#ddd',
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
                              ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.color || '#333')
                              : '#333',
                          }}
                        >
                          {isAppEvent ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.emoji || '🔷') : ""}{" "}
                          {event.title}
                        </Text>
                        <Text
                          style={{
                            color: isAppEvent 
                              ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.color || '#666')
                              : '#666',
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
                              ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.borderColor || '#ddd')
                              : '#ddd',
                            backgroundColor: isAppEvent ? '#FFFFFF' : undefined,
                            padding: isAppEvent ? 12 : 0,
                            borderRadius: isAppEvent ? 6 : 0,
                            borderWidth: isAppEvent ? 1 : 0,
                            borderColor: eventTypeStyles[classification as keyof typeof eventTypeStyles]?.borderColor || '#ddd',
                          }}
                        >
                          {isAppEvent && (
                            <Text
                              style={{
                                marginBottom: 8,
                                color: eventTypeStyles[classification as keyof typeof eventTypeStyles]?.color || '#333',
                                fontSize: 15,
                                fontWeight: "600",
                              }}
                            >
                              {eventTypeStyles[classification as keyof typeof eventTypeStyles]?.emoji || ''}
                              {" Type: "}{EventClassification.find(c => c.value === classification)?.label || classification}
                            </Text>
                          )}
                          
                          {notes && (
                            <Text
                              style={{
                                marginBottom: 8,
                                color: isAppEvent ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.color || '#333') : '#333',
                                fontSize: isAppEvent ? 16 : 14,
                                fontWeight: isAppEvent ? "600" : "normal",
                              }}
                            >
                              {notes}
                            </Text>
                          )}
                          
                          <Text
                            style={{
                              color: isAppEvent ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.color || '#333') : '#666',
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
                                color: isAppEvent ? (eventTypeStyles[classification as keyof typeof eventTypeStyles]?.color || '#333') : '#666',
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
                                backgroundColor: '#ff4444',
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
              })}
              {getEventsForDate(selectedDate).length === 0 && (
                <Text>No events for this date</Text>
              )}
            </View>
          )}
        </ScrollView>

        <Modal
          visible={showEventModal}
          animationType="slide"
          transparent={true}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            zIndex: 1000,
          }}>
            <View style={{
              backgroundColor: "white",
              margin: 20,
              padding: 20,
              borderRadius: 10,
              zIndex: 1001,
            }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
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
              />

              <View style={{ marginBottom: 10 }}>
                <Text style={{ marginBottom: 5 }}>Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePickerModal(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 15,
                    borderRadius: 5,
                  }}
                >
                  <Text>{formatDate(selectedEventDate)}</Text>
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
                      : `${selectedAlerts.length} reminder${selectedAlerts.length !== 1 ? 's' : ''} set`}
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
                    {EventClassification.find(c => c.value === newEvent.classification)?.label || "Select type"}
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
                  
                    setSelectedEventDate(new Date().toISOString().split("T")[0]);
                    
                    // Reset time states
                    setStartPeriod("AM");
                    setEndPeriod("AM");
                    
                    // Reset any error state
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
                    minHeight: 70,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#495057",
                        fontSize: 14,
                        fontWeight: "600",
                        textAlign: "center",
                        marginBottom: 4,
                      }}
                    >
                      Cancel Event
                    </Text>
                    <Text
                      style={{
                        color: "#6c757d",
                        fontSize: 11,
                        textAlign: "center",
                      }}
                    >
                      Discard changes
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={addEvent}
                  style={{
                    backgroundColor: "#2E66E7",
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
                    minHeight: 70,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: "600",
                        textAlign: "center",
                        marginBottom: 4,
                      }}
                    >
                      Save Event
                    </Text>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 11,
                        textAlign: "center",
                      }}
                    >
                      Add to calendar
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Date Picker Modal */}
              <Modal
                visible={showDatePickerModal}
                animationType="slide"
                transparent={true}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    zIndex: 2000,
                  }}
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
                      Select Date
                    </Text>

                    <Calendar
                      onDayPress={(day: {
                        dateString: SetStateAction<string>;
                      }) => {
                        setSelectedEventDate(day.dateString);
                      }}
                      markedDates={{
                        [selectedEventDate]: {
                          selected: true,
                          selectedColor: "#2E66E7",
                        },
                      }}
                      style={{
                        borderRadius: 10,
                        elevation: 4,
                        margin: 10,
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => setShowDatePickerModal(false)}
                      style={{
                        backgroundColor: "#2E66E7",
                        paddingVertical: 16,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        marginTop: 20,
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
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 14,
                            fontWeight: "600",
                            textAlign: "center",
                            marginBottom: 4,
                          }}
                        >
                          Confirm Date
                        </Text>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: 11,
                            textAlign: "center",
                          }}
                        >
                          Set selected date
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Time Picker Modal*/}
              <Modal
                visible={showTimePickerModal}
                animationType="slide"
                transparent={true}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                  }}
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
                            isStartTime ? newEvent.startTime : newEvent.endTime
                          }
                          onValueChange={(itemValue) =>
                            setNewEvent({
                              ...newEvent,
                              [isStartTime ? "startTime" : "endTime"]:
                                itemValue,
                            })
                          }
                          style={{ height: 150 }}
                        >
                          {timeOptions.map((time) => (
                            <Picker.Item key={time} label={time} value={time} />
                          ))}
                        </Picker>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Picker
                          selectedValue={isStartTime ? startPeriod : endPeriod}
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
                        backgroundColor: "#2E66E7",
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
                </View>
              </Modal>

              {/* Reminder Modal */}
              <Modal
                visible={showReminderModal}
                animationType="slide"
                transparent={true}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                  }}
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
                      Set Reminders
                    </Text>

                    {alertOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => toggleAlert(option.value)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 20,
                          borderBottomWidth: 1,
                          borderBottomColor: "#eee",
                          backgroundColor: selectedAlerts.includes(option.value) ? '#f0f8ff' : 'white',
                        }}
                      >
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            borderWidth: 2,
                            borderColor: "#2E66E7",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 15,
                          }}
                        >
                          {selectedAlerts.includes(option.value) && (
                            <View
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: 8,
                                backgroundColor: "#2E66E7",
                              }}
                            />
                          )}
                        </View>
                        <Text style={{ 
                          fontSize: 18,
                          color: selectedAlerts.includes(option.value) ? '#2E66E7' : '#333',
                        }}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                      onPress={() => setShowReminderModal(false)}
                      style={{
                        backgroundColor: "#2E66E7",
                        padding: 15,
                        borderRadius: 8,
                        marginTop: 20,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
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
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                  }}
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
                          setNewEvent({ ...newEvent, classification: option.value });
                          setSelectedClassification(option.value);
                          setShowClassificationModal(false);
                        }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 20,
                          borderBottomWidth: 1,
                          borderBottomColor: "#eee",
                          backgroundColor: newEvent.classification === option.value ? '#f0f8ff' : 'white',
                        }}
                      >
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            borderWidth: 2,
                            borderColor: "#2E66E7",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 15,
                          }}
                        >
                          {newEvent.classification === option.value && (
                            <View
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: 8,
                                backgroundColor: "#2E66E7",
                              }}
                            />
                          )}
                        </View>
                        <Text style={{ 
                          fontSize: 18,
                          color: newEvent.classification === option.value ? '#2E66E7' : '#333',
                        }}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                      onPress={() => setShowClassificationModal(false)}
                      style={{
                        backgroundColor: "#2E66E7",
                        padding: 15,
                        borderRadius: 8,
                        marginTop: 20,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  calendar: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 370
  },
});

