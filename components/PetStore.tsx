// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
// } from "react-native";
// import { usePoints } from "./PointsSystem";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Link } from "expo-router";

// interface PetStoreProps {
//   visible: boolean;
//   onClose: () => void;
// }

// export interface PetAccessory {
//   id: string;
//   name: string;
//   price: number;
//   // image: any;
//   equipped?: boolean;
// }

// const ACCESSORIES: PetAccessory[] = [
//   {
//     id: "1",
//     name: "Cool Hat",
//     price: 50,
//   },
//   {
//     id: "2",
//     name: "Fancy Glasses",
//     price: 75,
//   },
//   {
//     id: "3",
//     name: "Bow Tie",
//     price: 30,
//   },
// ];

// const PetStore = () => {
//   const { points, deductPoints } = usePoints();
//   const [inventory, setInventory] = useState<PetAccessory[]>([]);

//   useEffect(() => {
//     const loadInventory = async () => {
//       try {
//         const savedData = await AsyncStorage.getItem("@MascotAppData");
//         if (savedData) {
//           const data = JSON.parse(savedData);
//           setInventory(data.inventory || []);
//         }
//       } catch (error) {
//         console.error("Failed to load inventory", error);
//       }
//     };
//     loadInventory();
//   }, []);

//   const saveInventory = async (newInventory: PetAccessory[]) => {
//     try {
//       const savedData = await AsyncStorage.getItem("@MascotAppData");
//       const data = savedData ? JSON.parse(savedData) : {};
//       await AsyncStorage.setItem(
//         "@MascotAppData",
//         JSON.stringify({
//           ...data,
//           inventory: newInventory,
//         })
//       );
//     } catch (error) {
//       console.error("Failed to save inventory", error);
//     }
//   };

//   const buyItem = async (item: PetAccessory) => {
//     if (points < item.price) {
//       Alert.alert(
//         "Not enough points",
//         `You need ${item.price} points to buy this item.`
//       );
//       return;
//     }

//     if (inventory.some((i) => i.id === item.id)) {
//       Alert.alert(
//         "Already owned",
//         "You already have this item in your inventory!"
//       );
//       return;
//     }

//     try {
//       const newInventory = [...inventory, item];
//       setInventory(newInventory);
//       await saveInventory(newInventory);
//       deductPoints(item.price);
//       Alert.alert("Purchase successful", `You bought a ${item.name}!`);
//     } catch (error) {
//       console.error("Failed to complete purchase", error);
//       Alert.alert("Error", "Failed to complete purchase");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Pet Store</Text>
//       <Text style={styles.points}>Your Points: {points}</Text>

//       <FlatList
//         data={ACCESSORIES}
//         numColumns={2}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.itemContainer}
//             onPress={() => buyItem(item)}
//           >
//             {/* <Image source={item.image} style={styles.itemImage} /> */}
//             <Text style={styles.itemName}>{item.name}</Text>
//             <Text style={styles.itemPrice}>{item.price} pts</Text>
//           </TouchableOpacity>
//         )}
//       />
//       <Link href="../../MascotHomepage" asChild>
//         <Text style={styles.backButton}>Back to Mascot</Text>
//       </Link>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   points: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   itemContainer: {
//     flex: 1,
//     margin: 10,
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 10,
//   },
//   itemImage: {
//     width: 80,
//     height: 80,
//     marginBottom: 10,
//   },
//   itemName: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   itemPrice: {
//     color: "#4CAF50",
//   },
//   backButton: {
//     marginTop: 20,
//     color: "blue",
//   },
// });

// export default PetStore;

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { usePoints } from "./PointsSystem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface PetStoreProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: (item: PetAccessory) => void;
}

export interface PetAccessory {
  id: string;
  name: string;
  price: number;
  image: number;
  equipped?: boolean;
}

const ACCESSORIES: PetAccessory[] = [
  {
    id: "1",
    name: "Top Hat",
    price: 20,
    image: require("../assets/images/TopHat2.png"),
  },
  {
    id: "2",
    name: "Monocle",
    price: 15,
    image: require("../assets/images/Monocle.png"),
  },
  {
    id: "3",
    name: "Bow Tie",
    price: 10,
    image: require("../assets/images/BowTie.png"),
  },
  {
    id: "4",
    name: "Bedhead",
    price: 30,
    image: require("../assets/images/BlackHair.png"),
  },
  {
    id: "5",
    name: "Business Man",
    price: 35,
    image: require("../assets/images/BlondeHair.png"),
  },
  {
    id: "6",
    name: "Cowboy",
    price: 40,
    image: require("../assets/images/CowboyHat.png"),
  },
];

const PetStore = ({ visible, onClose, onPurchase }: PetStoreProps) => {
  const { points, deductPoints } = usePoints();
  const [inventory, setInventory] = useState<PetAccessory[]>([]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const savedData = await AsyncStorage.getItem("@MascotAppData");
        if (savedData) {
          const data = JSON.parse(savedData);
          setInventory(data.inventory || []);
        }
      } catch (error) {
        console.error("Failed to load inventory", error);
      }
    };
    loadInventory();
  }, []);

  const saveInventory = async (newInventory: PetAccessory[]) => {
    try {
      const savedData = await AsyncStorage.getItem("@MascotAppData");
      const data = savedData ? JSON.parse(savedData) : {};
      await AsyncStorage.setItem(
        "@MascotAppData",
        JSON.stringify({
          ...data,
          inventory: newInventory,
        })
      );
    } catch (error) {
      console.error("Failed to save inventory", error);
    }
  };

  const buyItem = async (item: PetAccessory) => {
    if (points < item.price) {
      Alert.alert(
        "Not enough points",
        `You need ${item.price} points to buy this item.`
      );
      return;
    }

    if (inventory.some((i) => i.id === item.id)) {
      Alert.alert(
        "Already owned",
        "You already have this item in your inventory!"
      );
      return;
    }

    try {
      const newItem = {
        ...item,
        equipped: false,
      };
      const newInventory = [...inventory, newItem];
      setInventory(newInventory);
      await saveInventory(newInventory);
      deductPoints(item.price);
      onPurchase(newItem);
      Alert.alert("Purchase successful", `You bought '${item.name}!'`);
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert("Error", "Failed to complete purchase");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <LinearGradient colors={["#eee", "#eee"]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>🛍️ Pet Store 🛍️</Text>
              <View style={styles.pointsContainer}>
                <Text style={styles.points}>💰 Your Points: {points}</Text>
              </View>
            </View>

            <FlatList
              data={ACCESSORIES}
              numColumns={2}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              style={styles.itemsGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.itemContainer,
                    inventory.some((i) => i.id === item.id) && styles.ownedItem,
                  ]}
                  onPress={() => buyItem(item)}
                  disabled={inventory.some((i) => i.id === item.id)}
                >
                  <Image
                    source={item.image}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {inventory.some((i) => i.id === item.id)
                      ? "Owned"
                      : `${item.price} pts`}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>← Back to Mascot</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
  },
  itemsGrid: {
    flex: 1,
    marginVertical: 10,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  pointsContainer: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#095da7",
  },
  itemContainer: {
    width: width * 0.42,
    margin: 8,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  ownedItem: {
    backgroundColor: "rgb(202, 202, 202)",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    maxWidth: "100%",
  },
  itemPrice: {
    color: "#095da7",
    fontWeight: "bold",
  },
  itemImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  closeButton: {
    padding: 15,
    backgroundColor: "#095da7",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PetStore;
