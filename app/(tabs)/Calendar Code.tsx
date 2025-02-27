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
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    notes: "",
    startTime: "12:00",
    endTime: "1:00",
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
        notes: newEvent.notes,
        alarms: alarms,
      });

      // Reset all form fields including alerts
      setNewEvent({
        title: "",
        location: "",
        notes: "",
        startTime: "12:00",
        endTime: "1:00",
      });
      setSelectedAlerts(["15"]); // Reset to default state
      setShowEventModal(false);
      Alert.alert("Success", "Event added successfully!");

      // Refresh events from ALL calendars
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
      setErrorMessage("Failed to add event");
      setShowErrorModal(true);
    }
  };

  const openTimePicker = (isStart: boolean) => {
    setIsStartTime(isStart);
    setShowTimePickerModal(true);
  };

  // Add function to delete event
  const deleteEvent = async (eventId: string) => {
    try {
      await ExpoCalendar.deleteEventAsync(eventId);

      // Refresh events list after deletion
      const calendars = await ExpoCalendar.getCalendarsAsync(
        ExpoCalendar.EntityTypes.EVENT
      );
      const writableCalendars = calendars.filter(
        (calendar) => calendar.allowsModifications
      );
      const calendarIds = writableCalendars.map((calendar) => calendar.id);

      const updatedEvents = await ExpoCalendar.getEventsAsync(
        calendarIds,
        new Date(),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      );
      setEvents(updatedEvents as any);
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
              events.reduce<{ [key: string]: { hasAppEvent: boolean; events: ExpoCalendar.Event[] } }>(
                (acc, event: ExpoCalendar.Event) => {
                  const eventDate = new Date(event.startDate);
                  const date = eventDate.toISOString().split('T')[0];
                  
                  if (!acc[date]) {
                    acc[date] = { hasAppEvent: false, events: [] };
                  }
                  
                  // Check if this is an app event
                  const isAppEvent = isAppCreatedEvent(event);
                  if (isAppEvent) {
                    acc[date].hasAppEvent = true;
                  }
                  
                  acc[date].events.push(event);
                  return acc;
                },
                {}
              )
            ).reduce<MarkedDates>((markings, [date, dateData]) => {
              const isSelected = date === selectedDate;
              
              return {
                ...markings,
                [date]: {
                  marked: true,
                  selected: isSelected,
                  selectedColor: '#2E66E7',
                  selectedTextColor: '#FFFFFF',
                  dots: dateData.hasAppEvent ? [
                    { color: '#FF0000', key: 'top', size: 10 },
                    { color: '#FF0000', key: 'right', size: 10 },
                    { color: '#FF0000', key: 'bottom', size: 10 },
                    { color: '#FF0000', key: 'left', size: 10 }
                  ] : [
                    { color: '#666666', key: 'regular', size: 4 }
                  ],
                  customStyles: dateData.hasAppEvent ? {
                    container: {
                      backgroundColor: '#FFE6E6',
                    },
                    text: {
                      color: isSelected ? '#FFFFFF' : '#FF0000',
                      fontWeight: 'bold'
                    }
                  } : undefined
                }
              };
            }, {
              [selectedDate]: events.some((event: ExpoCalendar.Event) => {
                const eventDate = new Date(event.startDate);
                return eventDate.toISOString().split('T')[0] === selectedDate;
              }) ? undefined : {
                selected: true,
                selectedColor: '#2E66E7',
                selectedTextColor: '#FFFFFF'
              }
            } as MarkedDates)}
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
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16
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
                        backgroundColor: isAppEvent ? '#FFE6E6' : '#f0f0f0',
                        padding: 15,
                        borderRadius: 6,
                        borderWidth: isAppEvent ? 2 : 0,
                        borderColor: '#FF0000',
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
                            color: isAppEvent ? '#FF0000' : '#000000',
                          }}
                        >
                          {isAppEvent ? "🔷 " : ""}{event.title}
                        </Text>
                        <Text
                          style={{
                            color: isAppEvent ? '#FF0000' : '#666',
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
                            borderTopColor: isAppEvent ? '#FFB3B3' : '#ddd',
                            backgroundColor: isAppEvent ? '#FFFFFF' : undefined,
                            padding: isAppEvent ? 12 : 0,
                            borderRadius: isAppEvent ? 6 : 0,
                            borderWidth: isAppEvent ? 1 : 0,
                            borderColor: '#FFB3B3',
                          }}
                        >
                          <Text
                            style={{
                              marginBottom: 8,
                              color: isAppEvent ? '#FF0000' : '#333',
                              fontSize: isAppEvent ? 16 : 14,
                              fontWeight: isAppEvent ? "600" : "normal",
                            }}
                          >
                            {event.notes || "No notes"}
                          </Text>
                          <Text
                            style={{
                              color: isAppEvent ? '#FF0000' : '#666',
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
                                color: isAppEvent ? '#FF0000' : '#666',
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

