import React from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

const ClaimPointsModal = ({
  visible,
  onClose,
  onClaimPoints,
  task,
  points,
}: {
  visible: boolean;
  onClose: () => void;
  onClaimPoints: () => void;
  task: string;
  points: number;
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>🎉 Task Completed! 🎉</Text>
          <View style={styles.divider} />
          <Text style={styles.modalText}>
            You completed: <Text style={styles.boldText}>{task}</Text>
          </Text>
          <Text style={styles.pointsText}>+{points} points!</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.claimButton]}
              onPress={onClaimPoints}
            >
              <Text style={styles.buttonText}>CLOSE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#095da7",
    marginBottom: 10,
    textAlign: "center",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
    color: "#095da7",
  },
  pointsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginVertical: 15,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    width: "100%",
  },
  claimButton: {
    backgroundColor: "#095da7",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ClaimPointsModal;
