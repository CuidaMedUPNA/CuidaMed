import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

const SAMPLE_MEDICINES = [
  { id: "1", name: "Paracetamol", presentation: "Tabletas 500 mg" },
  { id: "2", name: "Ibuprofeno", presentation: "Tabletas 400 mg" },
  { id: "3", name: "Amoxicilina", presentation: "Cápsulas 500 mg" },
  { id: "4", name: "Omeprazol", presentation: "Cápsulas 20 mg" },
  { id: "5", name: "Aspirina", presentation: "Tabletas 100 mg" },
];

export const AddMedicinePage = () => {
  const renderItem = ({
    item,
  }: {
    item: { id: string; name: string; presentation: string };
  }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        // por ahora solo registro la selección en consola
        console.log("Medicamento seleccionado:", item);
      }}
      accessibilityRole="button"
    >
      <View style={styles.itemText}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.presentation}>{item.presentation}</Text>
      </View>
      <View style={styles.addCircle}>
        <Text style={styles.addCircleText}>+</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona un medicamento</Text>
      <FlatList
        data={SAMPLE_MEDICINES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9e9ef",
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 24,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  itemText: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  presentation: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  addCircle: {
    width: 34,
    height: 34,
    borderRadius: 16,
    backgroundColor: "#f23728",
    alignItems: "center",
    justifyContent: "center",
  },
  addCircleText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "center",
    transform: [{ translateY: -2 }],
  },
});
