import {
    View,
    Text,
    StyleSheet, TouchableOpacity,
    FlatList,
    Alert
} from "react-native";
import { useRouter } from "expo-router";
import { ModalEditTreatment } from "./_components/ModalEditTreatment";
import { AssociatedMedicine } from "./_components/AssociatedMedicine";
import { useState, useMemo } from "react";
import {
    getIntakesByTreatmentOptions,
    getTreatmentsOptions,
    deleteIntakeMutation,
    DosingSchedule,
} from "@cuidamed-api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t } from "i18next";

export const TreatmentDetailPage = ({
  treatmentId,
}: {
  treatmentId: number;
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: treatments } = useQuery(getTreatmentsOptions());
  const treatment = treatments?.find((t) => t.id === treatmentId);

  const initialDate = treatment ? new Date(treatment.startDate) : new Date();
  const endDate = treatment?.endDate ? new Date(treatment.endDate) : undefined;

  const { data: intakes } = useQuery(
    getIntakesByTreatmentOptions({
      path: { treatmentId },
    })
  );

  const mutation = useMutation({
    ...deleteIntakeMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getIntakesByTreatmentOptions({
          path: { treatmentId },
        }).queryKey,
      });
    },
    onError: (error) => {
      console.error("❌ Error al eliminar medicamento:", error);
      Alert.alert(t("error"), t("treatments.delete.errorAlert"));
    },
  });

  const handleDeleteIntake = (intakeId: number, treatmentId: number) => {
    Alert.alert(
      t("treatments.delete.title", { defaultValue: "Eliminar medicamento" }),
      t("treatments.delete.confirmMedicine", { defaultValue: "¿Estás seguro de que deseas eliminar este medicamento del tratamiento?" }),
      [
        { text: t("common.cancel", { defaultValue: "Cancelar" }), style: "cancel" },
        {
          text: t("common.delete", { defaultValue: "Eliminar" }),
          style: "destructive",
          onPress: () => {
            mutation.mutate({
              path: { treatmentId, intakeId },
            });
          },
        },
      ]
    );
  };

  const { progressPercentage, daysRemaining } = useMemo(() => {
    if (!endDate) {
      return { progressPercentage: 0, daysRemaining: null };
    }
    const now = new Date();
    const totalMs = endDate.getTime() - initialDate.getTime();
    const elapsedMs = now.getTime() - initialDate.getTime();

    const daysRemainingValue = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    const progressPercent =
      totalMs > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100)) : 0;

    return {
      progressPercentage: progressPercent,
      daysRemaining: daysRemainingValue,
    };
  }, [initialDate, endDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const renderMedicine = ({ item }: { item: DosingSchedule }) => (
    <AssociatedMedicine
      name={item.medicineName}
      dose={item.doseAmount}
      unit={item.doseUnit}
      schedule={item.dosingTimes}
      onPress={() => handleDeleteIntake(item.id, item.treatmentId)}
    />
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF6B6B", "#FF8E53", "#FFA07A"]}
        style={[styles.heroHeader, { paddingTop: insets.top + 12 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="edit" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.treatmentName}>{treatment?.name ?? ""}</Text>

        <View style={styles.datesContainer}>
          <View style={styles.dateCard}>
            <View style={styles.dateIconWrapper}>
              <MaterialIcons name="play-arrow" size={18} color="#FFF" />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>{t("treatments.detail.startDate", { defaultValue: "Inicio" })}</Text>
              <Text style={styles.dateValue}>{formatDate(initialDate)}</Text>
            </View>
          </View>

          <View style={styles.dateDivider} />

          <View style={styles.dateCard}>
            <View style={styles.dateIconWrapper}>
              <MaterialIcons name="flag" size={18} color="#FFF" />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>{t("treatments.detail.endDate", { defaultValue: "Fin" })}</Text>
              <Text style={styles.dateValue}>
                {endDate ? formatDate(endDate) : t("treatments.indefinite", { defaultValue: "Indefinido" })}
              </Text>
            </View>
          </View>
        </View>

        {endDate && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {daysRemaining} {t("treatments.detail.daysRemaining", { defaultValue: "días restantes" })}
            </Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.contentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t("treatments.detail.medicines", { defaultValue: "Medicamentos" })}
          </Text>
          <View style={styles.badgeContainer}>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{intakes?.length ?? 0}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.addMedicineButton}
            onPress={() => {
              router.push({
                pathname: "/treatments/[treatmentId]/addMedicine",
                params: { treatmentId },
              });
            }}
          >
            <LinearGradient
              colors={["#FF6B6B", "#FF8E53"]}
              style={styles.addMedicineGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="add" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {intakes && intakes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={["#fff0f0", "#fee0e0"]}
              style={styles.emptyIconBg}
            >
              <MaterialCommunityIcons name="pill-off" size={48} color="#FF6B6B" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>
              {t("treatments.detail.noMedicines", { defaultValue: "Sin medicamentos" })}
            </Text>
            <Text style={styles.emptyText}>
              {t("treatments.detail.noMedicinesDescription", { defaultValue: "Añade medicamentos a este tratamiento" })}
            </Text>
            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={() => {
                router.push({
                  pathname: "/treatments/[treatmentId]/addMedicine",
                  params: { treatmentId },
                });
              }}
            >
              <MaterialIcons name="add-circle-outline" size={20} color="#FFF" />
              <Text style={styles.emptyAddButtonText}>
                {t("treatments.detail.addMedicine", { defaultValue: "Añadir medicamento" })}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={intakes}
            renderItem={renderMedicine}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            style={styles.list}
          />
        )}
      </View>

      <ModalEditTreatment
        visible={modalVisible}
        treatmentName={treatment?.name ?? ""}
        treatmentId={treatmentId}
        treatmentInitialDate={initialDate}
        treatmentEndDate={endDate ?? new Date()}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  heroHeader: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  treatmentName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 16,
  },
  datesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
  },
  dateCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 17,
    color: "#FFF",
    fontWeight: "700",
  },
  dateDivider: {
    width: 1,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 14,
  },
  progressContainer: {
    width: "100%",
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 14,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  badgeContainer: {
    marginLeft: 10,
  },
  countBadge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
  },
  addMedicineButton: {
    borderRadius: 18,
    overflow: "hidden",
  },
  addMedicineGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 40,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A2E",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyAddButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
  },
});
