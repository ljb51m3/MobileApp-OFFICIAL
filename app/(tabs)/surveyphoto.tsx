import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const SurveyPhoto = () => {
  const surveyQuestions = [
    "Are you experiencing blurred vision?",
    "Do you have any new floaters in your vision?",
  ];

  const choices = ["Yes", "No"];
  const eyeChoices = ["One", "Both"];
  const viewShotRef = useRef();
  const [answers, setAnswers] = useState({});
  const [followUps, setFollowUps] = useState({});
  const [fillIns, setFillIns] = useState({});
  const [hasPermission, requestPermission] = MediaLibrary.usePermissions();

  const handleSelect = (question, choice) => {
    setAnswers((prev) => ({ ...prev, [question]: choice }));

    if (question === surveyQuestions[0] && choice !== "Yes") {
      setFollowUps({});
      setFillIns((prev) => ({ ...prev, [question]: "" }));
    }
  };

  const handleFollowUp = (choice) => {
    setFollowUps({ eyeSide: choice });
  };

  const handleFillInChange = (question, text) => {
    setFillIns((prev) => ({ ...prev, [question]: text }));
  };

  const handleCaptureAndSave = async () => {
    if (!hasPermission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permission required",
          "We need access to your media library to save the image."
        );
        return;
      }
    }

    try {
      const uri = await viewShotRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Survey Results", asset, false);
      Alert.alert("Success", "Your survey has been saved to Photos!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save the image.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
          <View style={styles.surveyBox}>
            <Text style={styles.title}>Diabetes Eye Health Screening</Text>
            <Text style={[styles.text, { color: "#1517C2" }]}>
              To gain a better understanding of how we can assist you, we kindly
              request your participation in a brief questionnaire regarding your
              vision.{" "}
              <Text style={{ fontWeight: "bold" }}>
                Please feel free to answer the questions below
              </Text>{" "}
              and save your answers to your photo library.{" "}
              <Text style={{ fontWeight: "bold" }}>
                You may share your responses with your provider.
              </Text>
            </Text>

            {surveyQuestions.map((question, index) => (
              <View key={index} style={styles.questionBox}>
                <Text style={styles.question}>{question}</Text>
                <View style={styles.choices}>
                  {choices.map((choice) => (
                    <TouchableOpacity
                      key={choice}
                      style={[
                        styles.choiceButton,
                        answers[question] === choice && styles.selectedChoice,
                      ]}
                      onPress={() => handleSelect(question, choice)}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          answers[question] === choice && styles.selectedText,
                        ]}
                      >
                        {choice}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {index === 0 && answers[question] === "Yes" && (
                  <>
                    <Text style={styles.subQuestion}>
                      Is the blurred vision in one or both eyes?
                    </Text>
                    <View style={styles.choices}>
                      {eyeChoices.map((choice) => (
                        <TouchableOpacity
                          key={choice}
                          style={[
                            styles.choiceButton,
                            followUps.eyeSide === choice &&
                              styles.selectedChoice,
                          ]}
                          onPress={() => handleFollowUp(choice)}
                        >
                          <Text
                            style={[
                              styles.choiceText,
                              followUps.eyeSide === choice &&
                                styles.selectedText,
                            ]}
                          >
                            {choice}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TextInput
                      placeholder="Please describe your blurred vision..."
                      value={fillIns[question] || ""}
                      onChangeText={(text) =>
                        handleFillInChange(question, text)
                      }
                      style={styles.textInput}
                      multiline
                      numberOfLines={4}
                      blurOnSubmit={true}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </>
                )}
              </View>
            ))}
          </View>
        </ViewShot>

        <View style={styles.buttonContainer}>
          <Button
            title="Save Survey to Photos"
            onPress={handleCaptureAndSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingBottom: 100,
  },
  surveyBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
    width: 350,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  questionBox: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    marginBottom: 8,
  },
  choices: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
  },
  choiceButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  selectedChoice: {
    backgroundColor: "#007bff",
  },
  choiceText: {
    fontSize: 14,
    color: "#333",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    fontSize: 14,
  },
  subQuestion: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 20,
  },
});

export default SurveyPhoto;
