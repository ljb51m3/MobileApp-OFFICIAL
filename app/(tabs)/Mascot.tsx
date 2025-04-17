import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { usePoints } from "../../components/PointsSystem";
import PetInventory from "../../components/Inventory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PetStore from "../../components/PetStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type AccessoryPosition =
  | "topHatPosition"
  | "monoclePosition"
  | "bowTiePosition"
  | "bedheadPosition"
  | "businessManPosition"
  | "cowboyHatPosition";

export interface PetAccessory {
  id: string;
  name: string;
  price: number;
  image: any;
  equipped?: boolean;
}

const Mascot = () => {
  const { points } = usePoints();
  const [inventory, setInventory] = useState<PetAccessory[]>([]);
  const [equippedItems, setEquippedItems] = useState<PetAccessory[]>([]);
  const [storeVisible, setStoreVisible] = useState(false);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const savedData = await AsyncStorage.getItem("@MascotAppData");
        if (savedData) {
          const data = JSON.parse(savedData);
          setInventory(data.inventory || []);
          setEquippedItems(data.equippedItems || []);
        }
      } catch (error) {
        console.error("Failed to load inventory", error);
      }
    };
    loadInventory();
  }, []);

  const saveEquippedItems = async (items: PetAccessory[]) => {
    try {
      const savedData = await AsyncStorage.getItem("@MascotAppData");
      const data = savedData ? JSON.parse(savedData) : {};
      await AsyncStorage.setItem(
        "@MascotAppData",
        JSON.stringify({
          ...data,
          equippedItems: items,
        })
      );
    } catch (error) {
      console.error("Failed to save equipped items", error);
    }
  };

  const handleEquip = async (item: PetAccessory) => {
    if (equippedItems.some((i) => i.id === item.id)) {
      const newEquippedItems = equippedItems.filter((i) => i.id !== item.id);
      setEquippedItems(newEquippedItems);
      await saveEquippedItems(newEquippedItems);
      return;
    }

    const newEquippedItems = [item];
    setEquippedItems(newEquippedItems);
    await saveEquippedItems(newEquippedItems);
  };

  const saveInventory = async (newInventory: PetAccessory[]) => {
    try {
      const data = {
        inventory: newInventory,
        equippedItems: equippedItems,
      };
      await AsyncStorage.setItem("@MascotAppData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save inventory", error);
    }
  };

  return (
    <LinearGradient colors={["#eee", "#eee"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.pointsContainer}>
            <Text style={styles.points}>💰 {points} pts</Text>
          </View>

          <View style={styles.petDisplayContainer}>
            <View style={styles.petContainer}>
              <Image
                source={require("../../assets/images/Eyeball.png")}
                style={styles.petImage}
              />
              {equippedItems.map((item) => {
                const accessoryType = item.name
                  .toLowerCase()
                  .replace(/\s+/g, "");
                return (
                  <View
                    key={item.id}
                    style={
                      styles[`${accessoryType}Position` as AccessoryPosition]
                    }
                  >
                    <Image
                      source={item.image}
                      style={styles.accessoryImage}
                      resizeMode="contain"
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setStoreVisible(true)}
            style={styles.storeButton}
          >
            <Text style={styles.storeButtonText}>🛒 Visit Store</Text>
          </TouchableOpacity>

          <View style={styles.inventoryContainer}>
            <Text style={styles.sectionTitle}>Your Inventory</Text>
            <PetInventory
              inventory={inventory}
              equippedItems={equippedItems}
              onEquip={handleEquip}
            />
          </View>
        </ScrollView>

        <PetStore
          visible={storeVisible}
          onClose={() => setStoreVisible(false)}
          onPurchase={async (newItem) => {
            const newInventory = [...inventory, newItem];
            setInventory(newInventory);
            await saveInventory(newInventory);
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 50,
    height: 500,
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  equipStatus: {
    color: "#2196f3",
    fontSize: 12,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  pointsContainer: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#095da7",
  },
  petDisplayContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    position: "relative",
  },
  petImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  accessoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  topHatPosition: {
    position: "absolute",
    width: 80,
    height: 60,
    top: -30,
    left: width / 2 - 40,
    zIndex: 10,
  },
  monoclePosition: {
    position: "absolute",
    width: 85,
    height: 85,
    top: 80,
    left: width / 2 - 75,
    zIndex: 5,
  },
  bowTiePosition: {
    position: "absolute",
    width: 50,
    height: 30,
    top: 120,
    left: width / 2 - 25,
    zIndex: 5,
  },
  bedheadPosition: {
    position: "absolute",
    width: 100,
    height: 90,
    top: 40,
    left: width / 2 - 80,
    zIndex: 5,
  },
  businessManPosition: {
    position: "absolute",
    width: 100,
    height: 90,
    top: 40,
    left: width / 2 - 45,
    zIndex: 5,
  },
  cowboyHatPosition: {
    position: "absolute",
    width: 100,
    height: 90,
    top: 40,
    left: width / 2 - 45,
    zIndex: 5,
  },
  storeButton: {
    backgroundColor: "#095da7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  storeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  inventoryContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 200,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
});

export default Mascot;
