import { ModalNewTreatment } from "@/components/ModalNewTreatment";
import { Tratamiento } from "@/components/Treatment";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { getTreatmentsOptions, Treatment } from "@cuidamed-api/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { t } from "i18next";
import { LinearGradient } from "expo-linear-gradient";

export const MyTreatmentsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const { data: treatments, isLoading } = useQuery(
    getTreatmentsOptions({
      query: { userId: 1 },
    })
  );

  const handleTreatmentPress = (treatmentName: string) => {
    router.push({
      pathname: "/treatments/[treatmentName]",
      params: { treatmentName },
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
      <View style={styles.container}>
        <LinearGradient
          colors={["#FF3B30", "#FF6B6B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View>
            <Text style={styles.headerTitle}>
              {t("treatments.treatmentsTitle")}
            </Text>
            <Text style={styles.headerSubtitle}>
              {treatments?.length || 0}{" "}
              {t("treatments.active", { defaultValue: "activos" })}
            </Text>
          </View>
        </LinearGradient>

        <TreatmentsList
          treatments={treatments ?? []}
          onTreatmentPress={handleTreatmentPress}
          isLoading={isLoading}
        />

        {/* FAB con glow effect */}
        <View style={styles.fabContainer}>
          <View style={styles.fabGlow} />
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#FF3B30", "#FF6B6B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabGradient}
            >
              <AntDesign name="plus" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const TreatmentsList = ({
  treatments,
  onTreatmentPress,
  isLoading,
}: {
  treatments: Treatment[];
  onTreatmentPress: (treatmentName: string) => void;
  isLoading?: boolean;
}) => {
  return (
    <View style={styles.listContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.emptyContainer}>
            <View style={styles.loadingSpinner}>
              <MaterialCommunityIcons
                name="loading"
                size={48}
                color="#FF3B30"
              />
            </View>
            <Text style={styles.loadingText}>
              {t("common.loading", {
                defaultValue: "Cargando tratamientos...",
              })}
            </Text>
          </View>
        ) : treatments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <LinearGradient
                colors={["#FFE5E5", "#FFF5F5"]}
                style={styles.emptyIconGradient}
              >
                <MaterialCommunityIcons name="pill" size={72} color="#FF3B30" />
              </LinearGradient>
            </View>
            <Text style={styles.emptyTitle}>
              {t("treatments.noTreatments")}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t("treatments.noTreatmentsDescription")}
            </Text>
            <View style={styles.emptyHintContainer}>
              <Text style={styles.emptyHint}>
                {t("treatments.tapPlusToAdd", {
                  defaultValue: "Toca el botón + para comenzar",
                })}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            {treatments.map((treatment, index) => (
              <View key={treatment.name} style={styles.treatmentWrapper}>
                <TouchableOpacity
                  style={styles.treatmentCard}
                  onPress={() => onTreatmentPress(treatment.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.treatmentContent}>
                    <Tratamiento
                      name={treatment.name}
                      startDate={treatment.startDate}
                      endDate={treatment.endDate ?? "hasta morir"}
                      onPress={() => onTreatmentPress(treatment.name)}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  listContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  treatmentWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  treatmentCard: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  treatmentContent: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  emptyIconContainer: {
    marginBottom: 28,
  },
  emptyIconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 12,
  },
  emptyHintContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
  },
  emptyHint: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
    marginLeft: 8,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  fabGlow: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FF3B30",
    opacity: 0.3,
    top: -3,
    left: -3,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});
