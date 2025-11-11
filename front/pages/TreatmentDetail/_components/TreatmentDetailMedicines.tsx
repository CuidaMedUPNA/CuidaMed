import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AssociatedMedicine } from "./AssociatedMedicine";
import { useRouter } from "expo-router";
import {
  DosingSchedule,
  deleteIntakeMutation,
  getIntakesByTreatmentOptions,
} from "@cuidamed-api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

export interface TreatmentDetailMedicinesProps {
  medicines: DosingSchedule[];
  treatmentId: number;
}

export const TreatmentDetailMedicines = ({
  medicines,
  treatmentId,
}: TreatmentDetailMedicinesProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const renderMedicine = ({ item }: { item: DosingSchedule }) => (
    <AssociatedMedicine
      name={item.medicineName}
      dose={item.doseAmount}
      unit={item.doseUnit}
      schedule={item.dosingTimes}
      onPress={() => handleDeleteIntake(item.id, item.treatmentId)}
    />
  );

  const mutation = useMutation({
    ...deleteIntakeMutation(),
    onSuccess: () => {
      console.log("✅ Tratamiento eliminado con éxito.");
      queryClient.invalidateQueries({
        queryKey: getIntakesByTreatmentOptions({
          path: {
            treatmentId,
          },
        }).queryKey,
      });
    },
    onError: (error) => {
      console.error("❌ Error al eliminar tratamiento:", error);
      Alert.alert(t("error"), t("treatments.create.errorAlert"));
    },
  });

  const handleDeleteIntake = (intakeId: number, treatmentId: number) => {
    Alert.alert(t("warning"), t("treatments.delete.confirmTitle"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          console.log("Eliminar medicamento asociado con ID:", intakeId);
          mutation.mutate({
            path: {
              treatmentId,
              intakeId: intakeId,
            },
          });
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Medicamentos asociados</Text>
        <TouchableOpacity
          style={styles.addMedicineButton}
          onPress={() => {
            router.push({
              pathname: "/treatments/[treatmentId]/addMedicine",
              params: { treatmentId: treatmentId as number },
            });
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
