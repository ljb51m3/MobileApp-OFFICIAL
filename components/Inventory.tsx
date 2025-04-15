import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

export interface PetAccessory {
  id: string;
  name: string;
  price: number;
  image: any;
  equipped?: boolean;
}

interface InventoryProps {
  inventory: PetAccessory[];
  equippedItems: PetAccessory[];
  onEquip: (item: PetAccessory) => void;
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.28;

const Inventory = ({ inventory, equippedItems, onEquip }: InventoryProps) => {
  return (
    <View style={styles.container}>
      {inventory.length === 0 ? (
        <Text style={styles.emptyText}>No items in inventory</Text>
      ) : (
        <FlatList
          data={inventory}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.itemContainer,
                equippedItems.some((i) => i.id === item.id) &&
                  styles.equippedItem,
              ]}
              onPress={() => onEquip(item)}
            >
              <Image
                source={item.image}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.equipStatus}>
                {equippedItems.some((i) => i.id === item.id)
                  ? "✓ Equipped"
                  : "Tap to equip"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    margin: 8,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 4,
  },
  equippedItem: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
    borderWidth: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  equipStatus: {
    color: "#2196f3",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default Inventory;
