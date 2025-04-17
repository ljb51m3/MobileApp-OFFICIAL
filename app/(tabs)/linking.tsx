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
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Tracker" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Tracker")}
        >
          <Text style={styles.tabText}>Daily Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Links" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Links")}
        >
          <Text style={styles.tabText}>Health Links</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Eye Survey" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Eye Survey")}
        >
          <Text style={styles.tabText}>Eye Survey</Text>
        </TouchableOpacity>
      </View>
      {selectedTab === "Tracker" ? (
        <>
          {/* Render the Tracker component */}
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
                {/* Add the dynamic log information */}
                <Text>Sleep: {/* Add dynamic sleep log here */}</Text>
                <Text>Eating: {/* Add dynamic eating log here */}</Text>
                <Text>Exercise: {/* Add dynamic exercise log here */}</Text>

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
            style={[styles.linkButton, { backgroundColor: "#ffc9c9" }]}
          >
            <Text style={styles.buttonText}>Visit MyChart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push(
                "https://mychart.bilh.org/MyChart-BILH/Authentication/Login?"
              )
            }
            style={[styles.linkButton, { backgroundColor: "#c4eaff" }]}
          >
            <Text style={styles.buttonText}>Visit MyBILH</Text>
          </TouchableOpacity>
        </>
      ) : selectedTab === "Eye Survey" ? (
        <EyeSurvey />
      ) : null}
      ;
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    height: "100%",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: "#96cbf9",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
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
  linkButton: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
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
