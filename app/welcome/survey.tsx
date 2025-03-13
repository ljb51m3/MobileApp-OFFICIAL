import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Touchable,
} from "react-native";
import { ProgressBar, MD3Colors } from "react-native-paper";

export default function SurveyScreen() {
  const router = useRouter();
  const questions = [
    { id: 1, text: "How would you rate your overall health?" },
    { id: 2, text: "How would you rate your overall eye health?" },
    { id: 3, text: "How would you rate your vision clarity?" },
    {
      id: 4,
      text: "How would you rate your overall management of your health?",
    },
    {
      id: 5,
      text: "How often do you seek help or support for managing your health?",
    },
  ];

  const emojiOptions = ["😃", "🙂", "😐", "😔", "😢"];

  type Answer = {
    questionID: number;
    emoji: string;
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [surveyStarted, setSurveyStarted] = useState(false); // Track whether the survey has started
  const [showButton, setShowButton] = useState(false); // Track when to show the button

  const handleAnswer = (emoji: string) => {
    const updatedAnswers = [
      ...answers,
      { questionID: questions[currentQuestion].id, emoji },
    ];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log("Survey complete!", updatedAnswers);
      setSurveyComplete(true);
      // Handle completion (navigate away, save data, etc.)
      setTimeout(() => {
        router.push("/(tabs)/home");
      }, 1500);
    }
  };

  // Automatically start the survey after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSurveyStarted(true); // Set survey as started after 2 seconds
      setShowButton(true); // Show the button after the intro is shown
    }, 2000); // 2 seconds delay before starting the survey

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, []);

  const progress = (currentQuestion + 1) / questions.length;

  return (
    <View style={styles.container}>
      {/* If survey has not started, show the intro page */}
      {!surveyStarted ? (
        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            Help us get to know you better...
          </Text>
        </View>
      ) : (
        <>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={progress}
              color="#4ade80"
              style={styles.progressBar}
            />
          </View>

          {/* If survey is complete, show Thank You message */}
          {surveyComplete ? (
            <Text style={styles.thankYouText}>
              Thank you for completing the survey!
            </Text>
          ) : (
            <>
              {/* Question */}
              <Text style={styles.questionText}>
                {questions[currentQuestion].text}
              </Text>

              {/* Emoji Buttons */}
              <View style={styles.emojiContainer}>
                {emojiOptions.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAnswer(emoji)}
                    style={styles.emojiButton}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.progressText}>
                {currentQuestion + 1} / {questions.length}
              </Text>
            </>
          )}
        </>
      )}

      {/* Only show button after survey intro */}
      {showButton && (
        <View style={styles.endContainer}>
          <Text style={{ color: "grey", fontSize: 15, textAlign: "center" }}>
            Don't want to answer these questions? No worries! Click on the
            button below to see your home page.
          </Text>
          <TouchableOpacity
            style={styles.regularButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={{ color: "white", fontSize: 10 }}>Go Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 75,
  },
  introContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  introText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  progressBar: {
    height: 10,
    width: 300,
    borderRadius: 5,
    marginBottom: 200,
    marginTop: 20,
  },
  questionText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
    padding: 10,
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  emojiButton: {
    padding: 10,
  },
  emoji: {
    fontSize: 32,
  },
  progressText: {
    textAlign: "center",
    color: "#aaa",
  },
  thankYouText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    color: "green",
  },
  regularButton: {
    backgroundColor: "green",
    height: 25,
    width: 100,
    alignItems: "center",
    margin: 10,
    justifyContent: "center",
  },
  endContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60,
  },
});
