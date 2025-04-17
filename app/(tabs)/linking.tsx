import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Tracker from "../Tracker";
import EyeSurvey from "../surveyphoto";

const CombinedScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Tracker");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Tracker" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Tracker")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Tracker" && styles.activeTabText,
            ]}
          >
            Daily Tracker
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Links" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Links")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Links" && styles.activeTabText,
            ]}
          >
            Health Links
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Eye Survey" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Eye Survey")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Eye Survey" && styles.activeTabText,
            ]}
          >
            Eye Survey
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "Tracker" ? (
        <>
          <Tracker />
          <TouchableOpacity
            style={styles.bookIcon}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="book" size={32} color="#095da7" />
          </TouchableOpacity>

          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Today's Log</Text>
                <Text>Sleep: </Text>
                <Text>Eating: </Text>
                <Text>Exercise: </Text>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      ) : selectedTab === "Links" ? (
        <>
          <Text style={styles.sectionTitle}>Health Records & Results</Text>

          <TouchableOpacity
            onPress={() => router.push("https://www.mychart.org/")}
            style={styles.linkButton}
          >
            <Ionicons name="link" size={24} color="#095da7" />
            <Text style={styles.linkButtonText}>Visit MyChart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push(
                "https://mychart.bilh.org/MyChart-BILH/Authentication/Login?"
              )
            }
            style={styles.linkButton}
          >
            <Ionicons name="link" size={24} color="#095da7" />
            <Text style={styles.linkButtonText}>Visit MyBILH</Text>
          </TouchableOpacity>
        </>
      ) : selectedTab === "Eye Survey" ? (
        <EyeSurvey />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#095da7",
    shadowColor: "#095da7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  linkButton: {
    padding: 18,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  linkButtonIcon: {
    width: 24,
    height: 24,
  },
  bookIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#095da7",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CombinedScreen;
