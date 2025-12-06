import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import React, { useState, useMemo } from "react";
import CustomIntakeCalendar, {
  TomasPorDia,
} from "@/components/CustomIntakeCalendar";
import { DateData } from "react-native-calendars/src/types";
import { navigate } from "expo-router/build/global-state/routing";
import { getIntakesByUser } from "@cuidamed-api/client";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const getTimeSlotColor = (time: string, t: (key: string) => string) => {
  const hour = parseInt(time.split(":")[0], 10);

  if (hour >= 6 && hour < 12) {
    return {
      bg: "#FFF8E1",
      accent: "#FF8E53",
      label: t("calendar.morning"),
      icon: "wb-sunny",
    };
  } else if (hour >= 12 && hour < 20) {
    return {
      bg: "#E3F2FD",
      accent: "#42A5F5",
      label: t("calendar.afternoon"),
      icon: "wb-cloudy",
    };
  } else {
    return {
      bg: "#EDE7F6",
      accent: "#7E57C2",
      label: t("calendar.night"),
      icon: "nightlight-round",
    };
  }
};

// Tipo para las tomas con información adicional
type TomaConDosis = [string, string, string, string]; // [medicineName, scheduledTime, doseAmount, doseUnit]

export default function CalendarScreen() {
  const {
    data: intakes,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["intakes"],
    queryFn: () => getIntakesByUser(),
  });

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState("");

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // Transformar los datos de intakes al formato TomasPorDia
  const tomasPorDia: TomasPorDia = useMemo(() => {
    if (!intakes?.data) return {};

    const result: TomasPorDia = {};

    intakes.data.forEach((intake) => {
      const startDate = new Date(intake.startDate);
      const endDate = intake.endDate ? new Date(intake.endDate) : null;
      const today = new Date();
      const finalDate =
        endDate ||
        new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());

      // Generar fechas desde startDate hasta endDate (o 3 meses si no hay endDate)
      const currentDate = new Date(startDate);
      while (currentDate <= finalDate) {
        const dateString = currentDate.toISOString().split("T")[0];

        if (!result[dateString]) {
          result[dateString] = [];
        }

        // Agregar cada hora de dosificación para este día
        intake.dosingTimes?.forEach((dosingTime) => {
          result[dateString].push([
            intake.medicineName,
            dosingTime.scheduledTime,
          ]);
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return result;
  }, [intakes]);

  // Mapa de dosis por medicamento para mostrar en las tarjetas
  const dosisPorMedicamento = useMemo(() => {
    if (!intakes?.data) return {};
    const result: Record<string, { amount: number; unit: string }> = {};
    intakes.data.forEach((intake) => {
      result[intake.medicineName] = {
        amount: intake.doseAmount,
        unit: intake.doseUnit,
      };
    });
    return result;
  }, [intakes]);

  const tomasDelDiaSeleccionado = useMemo(() => {
    if (!selectedDate) return [];
    const tomas = tomasPorDia[selectedDate] || [];
    return tomas.sort((a, b) => a[1].localeCompare(b[1]));
  }, [selectedDate, tomasPorDia]);

  const totalTomasHoy = tomasDelDiaSeleccionado.length;
  const todayString = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === todayString;

  const handleGoToToday = () => {
    setSelectedDate(todayString);
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#FF6B6B", "#FF8E53", "#FFA07A"]}
        style={[styles.heroHeader, { paddingTop: insets.top + 16 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{t("tabs.calendar")}</Text>
            {selectedDate && (
              <View style={styles.subtitleContainer}>
                <View style={styles.subtitleBadge}>
                  <Text style={styles.subtitleBadgeText}>{totalTomasHoy}</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                  {totalTomasHoy === 1
                    ? t("calendar.intake")
                    : t("calendar.intakes")}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerButtons}>
            {!isToday && (
              <TouchableOpacity
                style={styles.todayButton}
                onPress={handleGoToToday}
                activeOpacity={0.8}
              >
                <MaterialIcons name="today" size={20} color="#FFF" />
                <Text style={styles.todayButtonText}>
                  {t("calendar.today")}
                </Text>
              </TouchableOpacity>
            )}
            <View style={styles.headerIconContainer}>
              <View style={styles.headerIconBg}>
                <MaterialIcons
                  name="calendar-month"
                  size={28}
                  color="#FF6B6B"
                />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#FF6B6B"]}
            tintColor="#FF6B6B"
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.calendarCard}>
            <CustomIntakeCalendar
              tomasPorDia={tomasPorDia}
              selectedDate={selectedDate}
              onDayPress={handleDayPress}
              current={
                Object.keys(tomasPorDia)[0] ||
                new Date().toISOString().split("T")[0]
              }
            />
          </View>

          {selectedDate && (
            <View style={styles.tomasSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {t("calendar.intakesOfDay")}
                </Text>
                <View style={styles.dateChip}>
                  <MaterialIcons name="event" size={16} color="#FF6B6B" />
                  <Text style={styles.dateChipText}>
                    {new Date(selectedDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>
              </View>

              {tomasDelDiaSeleccionado.length > 0 ? (
                <View style={styles.medicationList}>
                  {tomasDelDiaSeleccionado.map((toma, index) => {
                    const timeSlot = getTimeSlotColor(toma[1], t);
                    const dosis = dosisPorMedicamento[toma[0]];
                    return (
                      <View key={index} style={styles.medicationCard}>
                        <LinearGradient
                          colors={["#FFFFFF", "#FAFAFA"]}
                          style={styles.medicationGradient}
                        >
                          <View
                            style={[
                              styles.medicationIconContainer,
                              { backgroundColor: timeSlot.bg },
                            ]}
                          >
                            <MaterialIcons
                              name={timeSlot.icon as any}
                              size={24}
                              color={timeSlot.accent}
                            />
                          </View>
                          <View style={styles.medicationInfo}>
                            <Text style={styles.medicationName}>
                              {toma[0].charAt(0).toUpperCase() +
                                toma[0].slice(1)}
                            </Text>
                            <View style={styles.medicationMeta}>
                              {dosis && (
                                <View style={styles.doseBadge}>
                                  <MaterialIcons
                                    name="medication"
                                    size={12}
                                    color="#666"
                                  />
                                  <Text style={styles.doseText}>
                                    {dosis.amount} {dosis.unit}
                                  </Text>
                                </View>
                              )}
                              <View
                                style={[
                                  styles.timeBadge,
                                  { backgroundColor: timeSlot.bg },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.timeBadgeText,
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
                          </View>
                        </LinearGradient>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <LinearGradient
                    colors={["#fff0f0", "#fee0e0"]}
                    style={styles.emptyIconBg}
                  >
                    <MaterialIcons
                      name="event-available"
                      size={56}
                      color="#FF6B6B"
                    />
                  </LinearGradient>
                  <Text style={styles.emptyTitle}>
                    {t("calendar.noMedication")}
                  </Text>
                  <Text style={styles.emptyText}>
                    {t("calendar.noIntakesForDate")}
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      navigate("/treatments");
                    }}
                  >
                    <MaterialIcons
                      name="add-circle-outline"
                      size={20}
                      color="#FFF"
                    />
                    <Text style={styles.addButtonText}>
                      {t("calendar.addTreatment")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {!selectedDate && (
            <View style={styles.hintCard}>
              {Object.keys(tomasPorDia).length > 0 ? (
                <>
                  <LinearGradient
                    colors={["#E3F2FD", "#BBDEFB"]}
                    style={styles.hintIconBg}
                  >
                    <MaterialIcons name="touch-app" size={40} color="#42A5F5" />
                  </LinearGradient>
                  <Text style={styles.hintTitle}>
                    {t("calendar.selectDay")}
                  </Text>
                  <Text style={styles.hintText}>
                    {t("calendar.selectDayHint")}
                  </Text>
                  <TouchableOpacity
                    style={styles.todayButtonAlt}
                    onPress={handleGoToToday}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="today" size={18} color="#FFF" />
                    <Text style={styles.todayButtonAltText}>
                      {t("calendar.viewToday")}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <LinearGradient
                    colors={["#E8F5E9", "#C8E6C9"]}
                    style={styles.hintIconBg}
                  >
                    <MaterialIcons
                      name="medication"
                      size={40}
                      color="#4CAF50"
                    />
                  </LinearGradient>
                  <Text style={styles.hintTitle}>
                    {t("calendar.startTreatment")}
                  </Text>
                  <Text style={styles.hintText}>
                    {t("calendar.noMedicationsHint")}
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigate("/treatments")}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="add-circle-outline"
                      size={20}
                      color="#FFF"
                    />
                    <Text style={styles.addButtonText}>
                      {t("calendar.addTreatment")}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  heroHeader: {
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  todayButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
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
  headerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIconBg: {
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
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  calendarCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  tomasSection: {
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
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  medicationList: {
    gap: 12,
  },
  medicationCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  medicationGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  medicationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  medicationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  doseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  doseText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  timeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  medicationTime: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FF6B6B",
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  hintCard: {
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
  hintIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  hintTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  todayButtonAlt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
    backgroundColor: "#42A5F5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  todayButtonAltText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
