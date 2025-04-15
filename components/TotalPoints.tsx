import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { usePoints } from "../components/PointsSystem";

const TotalPoints: React.FC = () => {
  const { points } = usePoints();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>💰 {points} pts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#095da7",
  },
});

export default TotalPoints;
