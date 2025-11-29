import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import React, { useState, useMemo } from "react";
import CustomIntakeCalendar, {
  TomasPorDia,
} from "@/components/CustomIntakeCalendar";
import { DateData } from "react-native-calendars/src/types";
import { navigate } from "expo-router/build/global-state/routing";

const logo = require("@/assets/images/logo.png");

const DATOS_TOMAS_USUARIO: TomasPorDia = {
  "2025-11-15": [
    ["paracetamol", "21:00"],
    ["ibuprofeno", "08:00"],
  ],
  "2025-11-17": [["morfina", "14:30"]],
  "2025-11-18": [
    ["paracetamol", "09:00"],
    ["morfina", "15:00"],
    ["ibuprofeno", "21:00"],
  ],
  "2025-11-19": [["paracetamol", "10:00"]],
};

const getTimeSlotColor = (time: string) => {
  const hour = parseInt(time.split(":")[0], 10);

  if (hour >= 6 && hour < 12) {
    return { bg: "#fef3c7", accent: "#f59e0b", label: "Mañana", icon: "🌅" };
  } else if (hour >= 12 && hour < 20) {
    return { bg: "#dbeafe", accent: "#3b82f6", label: "Tarde", icon: "☀️" };
  } else {
    return { bg: "#ede9fe", accent: "#8b5cf6", label: "Noche", icon: "🌙" };
  }
};

export default function CalendarScreen() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState("");

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const tomasDelDiaSeleccionado = useMemo(() => {
    if (!selectedDate) return [];
    const tomas = DATOS_TOMAS_USUARIO[selectedDate] || [];
    return tomas.sort((a, b) => a[1].localeCompare(b[1]));
  }, [selectedDate]);

  return (
    <View style={styles.gradient}>
      <SafeAreaProvider style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: "#1f2937" }]}>
                {t("tabs.calendar")}
              </Text>
            </View>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Image source={logo} style={styles.logo} />
              </View>
            </View>
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.glassCard}>
              <CustomIntakeCalendar
                tomasPorDia={DATOS_TOMAS_USUARIO}
                selectedDate={selectedDate}
                onDayPress={handleDayPress}
                current={Object.keys(DATOS_TOMAS_USUARIO)[0]}
              />
            </View>

            {selectedDate && (
              <View style={styles.glassCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeDay}>
                      {new Date(selectedDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={styles.dateBadgeMonth}>
                      {new Date(selectedDate)
                        .toLocaleDateString("es-ES", {
                          month: "short",
                        })
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.cardTitle}>Tomas</Text>
                    <Text style={styles.cardSubtitle}>
                      {new Date(selectedDate).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </Text>
                  </View>
                </View>

                {tomasDelDiaSeleccionado.length > 0 ? (
                  <View style={styles.medicationList}>
                    {tomasDelDiaSeleccionado.map((toma, index) => {
                      const timeSlot = getTimeSlotColor(toma[1]);
                      return (
                        <Pressable
                          key={index}
                          style={({ pressed }) => [
                            styles.medicationItem,
                            pressed && styles.medicationItemPressed,
                          ]}
                        >
                          <View
                            style={[
                              styles.medicationIndicator,
                              { backgroundColor: timeSlot.accent },
                            ]}
                          />
                          <View
                            style={[
                              styles.medicationIcon,
                              { backgroundColor: timeSlot.bg },
                            ]}
                          >
                            <Text style={styles.medicationIconText}>
                              {timeSlot.icon}
                            </Text>
                          </View>
                          <View style={styles.medicationInfo}>
                            <Text style={styles.medicationText}>
                              {toma[0].charAt(0).toUpperCase() +
                                toma[0].slice(1)}
                            </Text>
                            <View style={styles.medicationMeta}>
                              <View
                                style={[
                                  styles.doseBadge,
                                  { backgroundColor: timeSlot.bg },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.doseText,
                                    { color: timeSlot.accent },
                                  ]}
                                >
                                  {timeSlot.label}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.timeContainer}>
                            <Text style={styles.medicationTime}>{toma[1]}</Text>
                            {/* <View style={styles.statusIndicator}>
                              <View style={styles.statusDot} />
                              <Text style={styles.statusText}>Pendiente</Text>
                            </View> */}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.noMedicationText}>
                      Sin medicación programada
                    </Text>
                    <Text style={styles.noMedicationSubtext}>
                      No hay tomas registradas para esta fecha
                    </Text>
                    <Pressable
                      style={styles.addButton}
                      onPress={() => {
                        navigate("/treatments");
                      }}
                    >
                      <Text style={styles.addButtonText}>
                        Agregar Medicación
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}

            {!selectedDate && (
              <View style={styles.hintCard}>
                <Text style={styles.hintIcon}>👆</Text>
                <Text style={styles.hintText}>
                  Selecciona un día en el calendario para ver tus medicamentos
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    marginTop: 30,
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
    marginTop: 4,
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffff",
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    fontWeight: "500",
  },
  glassCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  dateBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dc2626",
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dateBadgeDay: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 30,
  },
  dateBadgeMonth: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1,
  },
  headerTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  medicationList: {
    gap: 14,
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  medicationItemPressed: {
    backgroundColor: "#f3f4f6",
    transform: [{ scale: 0.98 }],
  },
  medicationIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  medicationIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  medicationIconText: {
    fontSize: 22,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1f2937",
  },
  medicationMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  doseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  doseText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  medicationTime: {
    fontSize: 20,
    fontWeight: "800",
    color: "#dc2626",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fbbf24",
  },
  statusText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fee2e2",
  },
  emptyStateIcon: {
    fontSize: 40,
  },
  noMedicationText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
  },
  noMedicationSubtext: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  addButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#dc2626",
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  hintCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  hintIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  hintText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 22,
  },
});
