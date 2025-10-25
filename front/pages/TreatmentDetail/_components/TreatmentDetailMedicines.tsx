import { View, Text, FlatList, StyleSheet } from "react-native";
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
      <Text style={styles.title}>Medicamentos asociados</Text>
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
});
