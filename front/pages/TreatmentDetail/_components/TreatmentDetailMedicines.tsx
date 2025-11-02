import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { deleteIntakeMutation, DosingSchedule } from "@cuidamed-api/client";
import { AssociatedMedicine } from "./AssociatedMedicine";
import { useRouter } from "expo-router";
<<<<<<< HEAD
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
=======
>>>>>>> 09a9774 ([#152] - Añadido handle de eliminar toma, falta implementar la llamada)

export interface TreatmentDetailMedicinesProps {
  medicines: DosingSchedule[];
}

export const TreatmentDetailMedicines = ({
  medicines,
}: TreatmentDetailMedicinesProps) => {
  const router = useRouter();
  const renderMedicine = ({ item }: { item: DosingSchedule }) => (
    <AssociatedMedicine
<<<<<<< HEAD
      name={item.medicineName}
      dose={item.doseAmount}
      unit={item.doseUnit}
      schedule={item.dosingTimes}
=======
      id={0}
      nombre={item.nombre}
      dosis={item.dosis}
      frecuencia={item.frecuencia}
      horarios={item.horarios}
>>>>>>> 09a9774 ([#152] - Añadido handle de eliminar toma, falta implementar la llamada)
      onPress={() => {
        handleEliminateMedicine(item.id);
      }}
    />
  );

<<<<<<< HEAD
  const mutation = useMutation({
    ...deleteIntakeMutation(),
    onSuccess: () => {
      console.log("✅ Tratamiento eliminado con éxito.");
    },
    onError: (error) => {
      console.error("❌ Error al eliminar tratamiento:", error);
      Alert.alert(t("error"), t("treatments.create.errorAlert"));
    },
  });

  function handleEliminateMedicine(id: number) {
    console.log("Eliminar medicamento con id: ", id);

    const treatmentId = 1;

    mutation.mutate({
      path: {
        treatmentId,
        intakeId: 1,
      },
    });
=======
  function handleEliminateMedicine(id: number) {
    console.log("Eliminar medicamento con id: ", id);

    // Lógica para eliminar el medicamento
>>>>>>> 09a9774 ([#152] - Añadido handle de eliminar toma, falta implementar la llamada)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Medicamentos asociados</Text>
        <TouchableOpacity
          style={styles.addMedicineButton}
          onPress={() => {
            router.push("/medicines/addMedicine");
          }}
          accessibilityLabel="Agregar medicamento"
        >
          <Text style={styles.addMedicineButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={medicines}
        renderItem={renderMedicine}
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
