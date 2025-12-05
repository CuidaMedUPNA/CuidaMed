import { ModalNewTreatment } from "@/components/ModalNewTreatment";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import {
  getTreatmentsOptions,
  Treatment,
  deleteTreatmentMutation,
  getTreatmentsQueryKey,
} from "@cuidamed-api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { t } from "i18next";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const MyTreatmentsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: treatments, isLoading } = useQuery(getTreatmentsOptions());

  const activeTreatments = treatments?.length ?? 0;

  const handleTreatmentPress = (treatmentId: number) => {
    router.push({
      pathname: "/treatments/[treatmentId]",
      params: { treatmentId },
    });
  };

  return (
    <>
      <ModalNewTreatment
        initialStartDate={new Date()}
        initialEndDate={undefined}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <LinearGradient
        colors={["#FF6B6B", "#FF8E53", "#FFA07A"]}
        style={[styles.heroHeader, { paddingTop: insets.top + 16 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {t("treatments.treatmentsTitle")}
            </Text>
            <View style={styles.subtitleContainer}>
              <View style={styles.subtitleBadge}>
                <Text style={styles.subtitleBadgeText}>{activeTreatments}</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                {t("treatments.active", { defaultValue: "activos" })}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.addButtonInner}>
              <MaterialIcons name="add" size={28} color="#FF6B6B" />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <TreatmentsList
            treatments={treatments ?? []}
            onTreatmentPress={handleTreatmentPress}
            isLoading={isLoading}
            onAddPress={() => setModalVisible(true)}
          />
        </View>
      </ScrollView>
    </>
  );
};

const TreatmentsList = ({
  treatments,
  onTreatmentPress,
  isLoading,
  onAddPress,
}: {
  treatments: Treatment[];
  onTreatmentPress: (treatmentId: number, treatmentName: string) => void;
  isLoading?: boolean;
  onAddPress: () => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...deleteTreatmentMutation(),
    onSuccess: () => {
      console.log("✅ Tratamiento eliminado con éxito.");
      queryClient.invalidateQueries({
        queryKey: getTreatmentsQueryKey(),
      });
    },
    onError: (error) => {
      console.error("❌ Error al eliminar tratamiento:", error);
      Alert.alert(t("error"), t("treatments.delete.errorAlert"));
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner}>
          <MaterialIcons name="hourglass-empty" size={40} color="#FF6B6B" />
        </View>
        <Text style={styles.loadingText}>
          {t("common.loading", {
            defaultValue: "Cargando tratamientos...",
          })}
        </Text>
      </View>
    );
  }

  if (treatments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={["#fff0f0", "#fee0e0"]}
          style={styles.emptyIconBg}
        >
          <MaterialCommunityIcons name="pill" size={56} color="#FF6B6B" />
        </LinearGradient>
        <Text style={styles.emptyTitle}>{t("treatments.noTreatments")}</Text>
        <Text style={styles.emptyText}>
          {t("treatments.noTreatmentsDescription")}
        </Text>
        <TouchableOpacity style={styles.emptyAddButton} onPress={onAddPress}>
          <MaterialIcons name="add-circle-outline" size={20} color="#FFF" />
          <Text style={styles.emptyAddButtonText}>
            {t("treatments.tapPlusToAdd", {
              defaultValue: "Añadir tratamiento",
            })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.treatmentsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t("treatments.myTreatments", { defaultValue: "Mis tratamientos" })}
        </Text>
      </View>

      {treatments.map((treatment) => (
        <View key={treatment.id} style={styles.treatmentWrapper}>
          <TouchableOpacity
            style={styles.treatmentCard}
            onPress={() => onTreatmentPress(treatment.id, treatment.name)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#FFFFFF", "#FAFAFA"]}
              style={styles.treatmentGradient}
            >
              <View style={styles.treatmentIconContainer}>
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E53"]}
                  style={styles.treatmentIconBg}
                >
                  <MaterialCommunityIcons name="pill" size={24} color="#FFF" />
                </LinearGradient>
              </View>

              <View style={styles.treatmentInfo}>
                <Text style={styles.treatmentName}>{treatment.name}</Text>
                <View style={styles.treatmentDates}>
                  <MaterialIcons
                    name="calendar-today"
                    size={14}
                    color="#8E8E93"
                  />
                  <Text style={styles.treatmentDateText}>
                    {treatment.startDate} -{" "}
                    {treatment.endDate ?? t("treatments.indefinite", { defaultValue: "Indefinido" })}
                  </Text>
                </View>
              </View>

              <View style={styles.treatmentActions}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      t("treatments.delete.title", { defaultValue: "Eliminar tratamiento" }),
                      t("treatments.delete.message", { defaultValue: "¿Estás seguro de que deseas eliminar este tratamiento?" }),
                      [
                        {
                          text: t("common.cancel", { defaultValue: "Cancelar" }),
                          style: "cancel",
                        },
                        {
                          text: t("common.delete", { defaultValue: "Eliminar" }),
                          style: "destructive",
                          onPress: () => {
                            mutation.mutate({ path: { treatmentId: treatment.id } });
                          },
                        },
                      ]
                    );
                  }}
                  style={styles.deleteButton}
                  accessibilityRole="button"
                >
                  <MaterialIcons name="delete-outline" size={22} color="#FF6B6B" />
                </TouchableOpacity>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color="#C7C7CC"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  heroHeader: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subtitleBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subtitleBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    padding: 50,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A2E",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
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
  treatmentsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  treatmentWrapper: {
    marginBottom: 12,
  },
  treatmentCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  treatmentGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  treatmentIconContainer: {
    marginRight: 14,
  },
  treatmentIconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  treatmentDates: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  treatmentDateText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  treatmentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
});
