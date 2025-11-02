import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  AssociatedMedicine,
  AssociatedMedicineProps,
} from "./AssociatedMedicine";

export interface TreatmentDetailMedicinesProps {
  medicines: AssociatedMedicineProps[];
}

export const TreatmentDetailMedicines = ({
  medicines,
}: TreatmentDetailMedicinesProps) => {
  const renderMedicine = ({ item }: { item: AssociatedMedicineProps }) => (
    <AssociatedMedicine
      nombre={item.nombre}
      dosis={item.dosis}
      frecuencia={item.frecuencia}
      horarios={item.horarios}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Medicamentos asociados</Text>
        <TouchableOpacity
          style={styles.addMedicineButton}
          onPress={() => {
            // Lógica para agregar un nuevo medicamento
          }}
          accessibilityLabel="Agregar medicamento"
        >
          <Text style={styles.addMedicineButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={medicines}
        renderItem={renderMedicine}
        keyExtractor={(item, index) => `${item.nombre}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2e2e2",
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addMedicineButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f23728",
    justifyContent: "center",
    alignItems: "center",
  },
  addMedicineButtonText: {
    fontSize: 24,
    color: "#ffffffff",
    fontWeight: "600",
    textAlignVertical: "center",
    textAlign: "center",
    transform: [{ translateY: -2 }],
  },
});
