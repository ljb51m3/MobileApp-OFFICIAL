import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PointsSystem {
  points: number;
  addPoints: (amount: number) => void;
  deductPoints: (amount: number) => void;
  resetPoints: () => void;
  loadPoints: () => Promise<void>;
}

const PointsSystem = createContext<PointsSystem>({
  points: 0,
  addPoints: () => {},
  deductPoints: () => {},
  resetPoints: () => {},
  loadPoints: async () => {},
});

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [points, setPoints] = useState(0);

  const loadPoints = async () => {
    try {
      const savedData = await AsyncStorage.getItem("@MascotAppData");
      if (savedData) {
        const data = JSON.parse(savedData);
        setPoints(data.points || 0);
      }
    } catch (error) {
      console.error("Failed to load points", error);
    }
  };

  const addPoints = async (amount: number) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    try {
      const savedData = await AsyncStorage.getItem("@MascotAppData");
      const data = savedData ? JSON.parse(savedData) : {};
      await AsyncStorage.setItem(
        "@MascotAppData",
        JSON.stringify({
          ...data,
          points: newPoints,
        })
      );
    } catch (error) {
      console.error("Failed to save points", error);
    }
  };

  const deductPoints = async (amount: number) => {
    const newPoints = Math.max(0, points - amount);
    setPoints(newPoints);
    try {
      const savedData = await AsyncStorage.getItem("@MascotAppData");
      const data = savedData ? JSON.parse(savedData) : {};
      await AsyncStorage.setItem(
        "@MascotAppData",
        JSON.stringify({
          ...data,
          points: newPoints,
        })
      );
    } catch (error) {
      console.error("Failed to deduct points", error);
    }
  };

  const resetPoints = async () => {
    setPoints(0);
    try {
      const savedData = await AsyncStorage.getItem("@MascotAppData");
      const data = savedData ? JSON.parse(savedData) : {};
      await AsyncStorage.setItem(
        "@MascotAppData",
        JSON.stringify({
          ...data,
          points: 0,
        })
      );
    } catch (error) {
      console.error("Failed to reset points", error);
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  return (
    <PointsSystem.Provider
      value={{ points, addPoints, deductPoints, resetPoints, loadPoints }}
    >
      {children}
    </PointsSystem.Provider>
  );
};

export const usePoints = () => useContext(PointsSystem);
