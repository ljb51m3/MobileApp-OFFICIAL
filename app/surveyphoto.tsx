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
  const [currentPage, setCurrentPage] = useState(1);
  const [surveyStarted, setSurveyStarted] = useState(false);

  const choices = ["Yes", "No"];
  const choice1_vfq = ["Excellent", "Very Good", "Good", "Fair", "Poor"];
  const choice2_vfq = [
    "Excellent",
    "Good",
    "Fair",
    "Poor",
    "Very Poor",
    "Completely Blind",
  ];
  const choice3_vfq = [
    "None of the time",
    "A little of the time",
    "Some of the time",
    "Most of the time",
    "All of the time",
  ];
  const choice4_vfq = ["None", "Mild", "Moderate", "Severe", "Very Severe"];
  const choice5to14_vfq = [
    "No difficulty at all",
    "A little difficulty",
    "Moderate difficulty",
    "Extreme difficulty",
    "Stopped doing this because of your eyesight",
    "Stopped doing this for other reasons or not interested in doing this",
  ];
  const choice15c_vfq = [
    "No difficulty at all",
    "A little difficulty",
    "Moderate difficulty",
    "Extreme difficulty",
  ];
  const choice15b_vfq = [
    "Mainly eyesight",
    "Main other reasons",
    "Both eyesight and other reasons",
  ];
  const choice15a_vfq = ["Never drove", "Gave up"];
  const eyeChoices = ["One", "Both"];
  const choice17to19_vfq = [
    "All of the time",
    "Most of the time",
    "Some of the time",
    "A little of the time",
    "None of the time",
  ];
  const choice20to25_vfq = [
    "Definitely True",
    "Mostly True",
    "Not Sure",
    "Mostly False",
    "Definitely False",
  ];

  const surveyPages = {
    1: [
      {
        text: "Are you experiencing blurred vision?",
        choices: choices,
        followUp: {
          condition: "Yes",
          question: "Is the blurred vision in one or both eyes?",
          choices: eyeChoices,
        },
      },
      { text: "Do you have any new floaters in your vision?", choices },
    ],
    2: [
      {
        text: "In general, would you say your overall health is:",
        choices: choice1_vfq,
      },
      {
        text: "At the present time, would you say your eyesight using both eyes (with glasses or contact lenses, if you wear them) is:",
        choices: choice2_vfq,
      },
      {
        text: "How much of the time do you worry about your eyesight?",
        choices: choice3_vfq,
      },
      {
        text: "How much pain or discomfort have you had in and around your eyes (for example, burning, itching, or aching)? Would you say it is:",
        choices: choice4_vfq,
      },
      {
        text: "How much difficulty do you have reading ordinary print in newspapers? Would you say you have:",
        choices: choice5to14_vfq,
      },
      {
        text: "How much difficulty do you have doing work or hobbies that require you to see well up close, such as cooking, sewing, fixing things around the house, or using hand tools? Would you say:",
        choices: choice5to14_vfq,
      },
      {
        text: "Because of you eyesight, how much difficulty do you have finding something on a crowded shelf?",
        choices: choice5to14_vfq,
      },
      {
        text: "How much difficulty do you have finding something on a crowded shelf?",
        choices: choice5to14_vfq,
      },
      {
        text: "How much difficulty to you have reading street signs or the names of stores?",
        choices: choice5to14_vfq,
      },
      {
        text: "Because of your eyesight, how much difficulty do you have going down steps, stairs, or cubs in dim light or at night?",
        choices: choice5to14_vfq,
      },
      {
        text: "Becuase of your eyesight, how much difficulty do you have noticing objects off to the side while you are walking along?",
        choices: choice5to14_vfq,
      },
      {
        text: "Because of your eyesight, how much difficulty do you have seeing how people react to things you say?",
        choices: choice5to14_vfq,
      },
      {
        text: "Because of your eyesight, how much difficulty do you have picking out and matching your own clothes?",
        choices: choice5to14_vfq,
      },
      {
        text: "Because of your eyesight, how much difficulty do you have visiting with people in their homes, at parties, or in restaurants?",
        choices: choice5to14_vfq,
      },
      {
        text: "Because of your eyesight, how much difficulty do you have going out to see movies, plays, or sports events?",
        choices: choice5to14_vfq,
      },
      {
        text: "Are you currently driving, at least once in a while?",
        choices: choices,
        followUp: [
          {
            condition: "Yes",
            question:
              "How much difficulty do you have driving during the daytime in familiar places? Would you say you have:",
            choices: choice15c_vfq,
          },
          {
            condition: "No",
            question:
              "Have you never driven a car or have you given up driving?",
            choices: choice15a_vfq,
            followUp: [
              {
                condition: "Gave up",
                question:
                  "Was that mainly because of your eyesight, mainly for some other reason, or because of both your eyesight and other reasons?",
                choices: choice15b_vfq,
              },
            ],
          },
        ],
      },

      {
        text: "How much difficulty do you have driving at night? Would you say you have:",
        choices: choice5to14_vfq,
      },
      {
        text: "How much difficulty do you have driving in difficult conditions, such as in bad weathre, during rush hour, on the freeway, or in city traffice? Would you say you have:",
        choices: choice5to14_vfq,
      },
      {
        text: "Do you accomplish less than you would like because of your vision?",
        choices: choice17to19_vfq,
      },
      {
        text: "Are you limited in how long you can work or do other activities because of your vision?",
        choices: choice17to19_vfq,
      },
      {
        text: "How much pain or discomfort in or around your eyes, for example, burning, itching, or aching, keep you from doing what you'd like to be doing? Would you say:",
        choices: choice17to19_vfq,
      },
      {
        text: "I stay home most of the time because of my eyesight.",
        choices: choice20to25_vfq,
      },
      {
        text: "I feel frustrated a lot of the time because of my eyesight.",
        choices: choice20to25_vfq,
      },
      {
        text: "I have much less control over what I do, because of my eyesight.",
        choices: choice20to25_vfq,
      },
      {
        text: "Because of my eyesight, I have to rely too much on what other people tell me.",
        choices: choice20to25_vfq,
      },
      {
        text: "I need a lot of help from others because of my eyesight.",
        choices: choice20to25_vfq,
      },
      {
        text: "I worry about doing things that will embarrass myself or others, because of my eyesight.",
        choices: choice20to25_vfq,
      },
    ],
  };

  const viewShotRef = useRef();
  const [answers, setAnswers] = useState({});
  const [followUps, setFollowUps] = useState({});
  const [fillIns, setFillIns] = useState({});
  const [hasPermission, requestPermission] = MediaLibrary.usePermissions();

  const handleSelect = (question, choice) => {
    setAnswers((prev) => ({ ...prev, [question]: choice }));

    if (question.includes("blurred vision") && choice !== "Yes") {
      setFollowUps({});
      setFillIns((prev) => ({ ...prev, [question]: "" }));
    }
  };

  const handleFollowUp = (question, choice) => {
    setFollowUps((prev) => ({
      ...prev,
      [question]: choice,
    }));
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
        <View style={styles.pageButtons}>
          <TouchableOpacity
            onPress={() => setCurrentPage(1)}
            style={[
              styles.pageButton,
              currentPage === 1 && styles.activePageButton,
            ]}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === 1 && styles.activePageButtonText,
              ]}
            >
              Short Survey
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentPage(2)}
            style={[
              styles.pageButton,
              currentPage === 2 && styles.activePageButton,
            ]}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === 2 && styles.activePageButtonText,
              ]}
            >
              Comprehensive Survey
            </Text>
          </TouchableOpacity>
        </View>

        {currentPage === 1 ? (
          <Text
            style={[
              styles.text,
              {
                color: "#000",
                borderRadius: 8,
                borderWidth: 2,
                borderColor: "#095da7",
                padding: 10,
              },
            ]}
          >
            To gain a better understanding of your eye health, we kindly request
            your participation in a brief questionnaire.{" "}
            <Text style={{ fontWeight: "bold" }}>
              Please feel free to answer the questions below
            </Text>{" "}
            and save your answers to your photo library.{" "}
            <Text style={{ fontWeight: "bold" }}>
              You may share your responses with your provider by downloading
              your responses to your Photo Library.
            </Text>
          </Text>
        ) : (
          <Text
            style={[
              styles.text,
              {
                color: "#000",
                borderRadius: 8,
                borderWidth: 2,
                borderColor: "#095da7",
                padding: 10,
              },
            ]}
          >
            For a comprehensive understanding of your eye health, we kindly
            request your participantion in this survey. This survey is validated
            by the National Institutes of Health and is used to gain a better
            understanding of your visual function.{" "}
            <Text style={{ fontWeight: "bold" }}>
              Please continue with the remaining questions below and save your
              responses to your Photo Library. You may share them with your
              provider later.
            </Text>
          </Text>
        )}

        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
          <View style={styles.surveyBox}>
            {surveyPages[currentPage].map((questionObj, index) => (
              <View key={index} style={styles.questionBox}>
                <Text style={styles.question}>{questionObj.text}</Text>
                <View style={styles.choices}>
                  {questionObj.choices.map((choice) => (
                    <TouchableOpacity
                      key={choice}
                      style={[
                        styles.choiceButton,
                        answers[questionObj.text] === choice &&
                          styles.selectedChoice,
                      ]}
                      onPress={() => handleSelect(questionObj.text, choice)}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          answers[questionObj.text] === choice &&
                            styles.selectedText,
                        ]}
                      >
                        {choice}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Handle Multiple Follow-Ups Based on Other Questions */}
                {questionObj.followUp &&
                  // Ensure `followUp` is an array, even if it's a single object
                  (Array.isArray(questionObj.followUp)
                    ? questionObj.followUp
                    : [questionObj.followUp]
                  ).map((followUp, followUpIndex) => {
                    // Check if the condition is met
                    if (answers[questionObj.text] === followUp.condition) {
                      return (
                        <View key={followUpIndex}>
                          <Text style={styles.subQuestion}>
                            {followUp.question}
                          </Text>
                          <View style={styles.choices}>
                            {followUp.choices.map((choice) => (
                              <TouchableOpacity
                                key={choice}
                                style={[
                                  styles.choiceButton,
                                  followUps[followUp.question] === choice &&
                                    styles.selectedChoice,
                                ]}
                                onPress={() =>
                                  handleFollowUp(followUp.question, choice)
                                } // Correctly pass the question and choice to handleFollowUp
                              >
                                <Text
                                  style={[
                                    styles.choiceText,
                                    followUps[followUp.question] === choice &&
                                      styles.selectedText,
                                  ]}
                                >
                                  {choice}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          {questionObj.text.includes("blurred vision") &&
                            answers[questionObj.text] === "Yes" &&
                            currentPage === 1 &&
                            index === 0 && (
                              <>
                                <TextInput
                                  placeholder="Please describe your blurred vision..."
                                  value={fillIns[questionObj.text] || ""}
                                  onChangeText={(text) =>
                                    handleFillInChange(questionObj.text, text)
                                  }
                                  style={styles.textInput}
                                  multiline
                                  numberOfLines={4}
                                  blurOnSubmit={true}
                                  onSubmitEditing={Keyboard.dismiss}
                                />
                              </>
                            )}

                          {/* Handle additional follow-up logic */}
                          {followUp.followUp &&
                            // Ensure that `followUp.followUp` is an array
                            (Array.isArray(followUp.followUp)
                              ? followUp.followUp
                              : [followUp.followUp]
                            ).map((secondFollowUp, secondFollowUpIndex) => {
                              // Check if the condition is met for the second follow-up
                              if (
                                followUps[followUp.question] ===
                                secondFollowUp.condition
                              ) {
                                return (
                                  <View key={secondFollowUpIndex}>
                                    <Text style={styles.subQuestion}>
                                      {secondFollowUp.question}
                                    </Text>
                                    <View style={styles.choices}>
                                      {secondFollowUp.choices.map((choice) => (
                                        <TouchableOpacity
                                          key={choice}
                                          style={[
                                            styles.choiceButton,
                                            followUps[
                                              secondFollowUp.question
                                            ] === choice &&
                                              styles.selectedChoice,
                                          ]}
                                          onPress={
                                            () =>
                                              handleFollowUp(
                                                secondFollowUp.question,
                                                choice
                                              ) // Correctly pass the question and choice to handleFollowUp
                                          }
                                        >
                                          <Text
                                            style={[
                                              styles.choiceText,
                                              followUps[
                                                secondFollowUp.question
                                              ] === choice &&
                                                styles.selectedText,
                                            ]}
                                          >
                                            {choice}
                                          </Text>
                                        </TouchableOpacity>
                                      ))}
                                    </View>
                                  </View>
                                );
                              }
                              return null; // Don't render if the condition isn't met
                            })}
                        </View>
                      );
                    }
                    return null; // Don't render if the condition isn't met
                  })}
              </View>
            ))}
          </View>
        </ViewShot>

        <View style={styles.buttonContainer}>
          <Button
            title="Save Survey to Photo Library"
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
    paddingBottom: 150,
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
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 12,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  questionBox: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subQuestion: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "500",
    marginVertical: 10,
    textAlign: "center",
  },
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  choiceButton: {
    borderWidth: 1,
    borderColor: "#095da7",
    borderRadius: 5,
    width: 275,
    paddingVertical: 6,
    margin: 5,
    backgroundColor: "#fff",
  },
  selectedChoice: {
    backgroundColor: "#095da7",
  },
  choiceText: {
    color: "#095da7",
    fontSize: 14,
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 20,
  },
  pageButtons: {
    flexDirection: "row",
    marginBottom: 20,
  },
  pageButton: {
    padding: 10,
    backgroundColor: "#dedede",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activePageButton: {
    backgroundColor: "#095da7",
  },
  pageButtonText: {
    color: "#095da7",
    fontWeight: "bold",
  },
  activePageButtonText: {
    color: "#fff",
  },
});

export default SurveyPhoto;
