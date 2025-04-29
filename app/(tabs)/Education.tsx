import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import YouTube from "react-native-youtube-iframe";
import TotalPoints from "../../components/TotalPoints";

const Learn = () => {
  const videos = [
    {
      id: 1,
      title: "Understanding Diabetes",
      videoId: "Mko250V6PYI",
    },
    {
      id: 2,
      title: "What is Diabetic Retinopathy?",
      videoId: "Y7m4J09lEKA",
    },
  ];

  const articles = [
    {
      id: 1,
      title: "About Diabetic Retinopathy",
      url: "https://diabetes.org/health-wellness/eye-health/what-is-retinopathy",
    },
    {
      id: 2,
      title: "Am I at Risk?",
      url: "https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/diabetic-retinopathy",
    },
  ];

  const openArticle = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open article: ", err)
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TotalPoints />

        <Text style={styles.sectionTitle}>Educational Videos</Text>
        {videos.map((video) => (
          <View key={video.id} style={styles.videoContainer}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <YouTube
              videoId={video.videoId}
              height={200}
              play={false}
              webViewProps={{
                allowsFullscreenVideo: true,
              }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 150,
    backgroundColor: "#f8f9fa",
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
  articleContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
