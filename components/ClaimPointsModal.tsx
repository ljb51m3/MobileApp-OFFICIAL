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
  onClose: any;
  onClaimPoints: any;
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
          <Text style={styles.modalText}>
            You completed: <Text style={styles.boldText}>{task}</Text>
          </Text>
          <Text style={styles.modalText}>Claim your {points} points!</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClaimPoints}
          >
            <Text style={styles.textStyle}>CLAIM</Text>
          </Pressable>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
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
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#095da7",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default ClaimPointsModal;
