import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Video } from "expo-av";
import TotalPoints from "../../components/TotalPoints";

const Learn = () => {
  const videos = [
    {
      id: 1,
      title: "Understanding Diabetes",
      source: require("../../assets/images/DRVideo.mp4"),
    },
    {
      id: 2,
      title: "What is Diabetic Retinopathy?",
      source: require("../../assets/images/DRVideo.mp4"),
    },
  ];

  const articles = [
    {
      id: 1,
      title: "10 Tips for Managing Diabetes",
      url: "https://example.com/diabetes-tips",
    },
    {
      id: 2,
      title: "Preventing Diabetic Retinopathy",
      url: "https://example.com/prevent-retinopathy",
    },
    {
      id: 3,
      title: "Healthy Eating for Diabetics",
      url: "https://example.com/healthy-eating",
    },
  ];

  const openArticle = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open article: ", err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TotalPoints />
      <Text style={styles.sectionTitle}>Educational Videos</Text>
      {videos.map((video) => (
        <View key={video.id} style={styles.videoContainer}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Video
            source={video.source}
            style={styles.video}
            useNativeControls
            isLooping
          />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Educational Articles</Text>
      {articles.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={styles.articleContainer}
          onPress={() => openArticle(article.url)}
        >
          <Text style={styles.articleTitle}>{article.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f8ff",
    height: 900,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  videoContainer: {
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#444",
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  articleContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  articleTitle: {
    fontSize: 16,
    color: "#095da7",
    fontWeight: "500",
  },
});

export default Learn;
