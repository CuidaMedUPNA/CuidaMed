import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NewMedicine } from "./_types/NewMedicine";
import { useMutation } from "@tanstack/react-query";
import { createIntakeMutation } from "@cuidamed-api/client";

const SAMPLE_MEDICINES = [
  { id: "1", name: "Paracetamol", presentation: "Tabletas 500 mg" },
  { id: "2", name: "Ibuprofeno", presentation: "Tabletas 400 mg" },
  { id: "3", name: "Amoxicilina", presentation: "Cápsulas 500 mg" },
  { id: "4", name: "Omeprazol", presentation: "Cápsulas 20 mg" },
  { id: "5", name: "Aspirina", presentation: "Tabletas 100 mg" },
];

export const AddMedicinePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleAddMedicineClick = (newMedicine: NewMedicine) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMutation(
      createIntakeMutation({
        body: {
          doseAmount: newMedicine.doseAmount,
          doseUnit: newMedicine.doseUnit,
          dosingTimes: newMedicine.dosingTimes,
          startDate: newMedicine.startDate,
          endDate: newMedicine.endDate,
          treatmentId: newMedicine.treatmentId,
          medicineId: newMedicine.id,
        },
      })
    );
  };

  const filteredMedicines = useMemo(() => {
    return SAMPLE_MEDICINES.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderItem = ({
    item,
  }: {
    item: { id: string; name: string; presentation: string };
  }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setOpenModal(true);
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
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            isSearchFocused && styles.searchInputContainerFocused,
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color="#f23728"
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              // remove web focus outline via inline style (cast to any to satisfy TS)
              Platform.OS === "web"
                ? ({ outlineWidth: 0, outlineColor: "transparent" } as any)
                : {},
            ]}
            placeholder="Buscar medicamento..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#666"
            selectionColor="#f23728"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </View>
      </View>
      <FlatList
        data={filteredMedicines}
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 22,
  },
  searchInputContainerFocused: {
    backgroundColor: "transparent",
  },
  searchIcon: {
    marginLeft: 20,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 16,
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
