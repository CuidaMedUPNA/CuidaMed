import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import React, { useState, useMemo } from "react";
import CustomIntakeCalendar, {
  TomasPorDia,
} from "@/components/CustomIntakeCalendar";

import { DateData } from "react-native-calendars/src/types";

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
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("tabs.calendar")}</Text>
        </View>

        <View style={styles.card}>
          <CustomIntakeCalendar
            tomasPorDia={DATOS_TOMAS_USUARIO}
            selectedDate={selectedDate}
            onDayPress={handleDayPress}
            current={Object.keys(DATOS_TOMAS_USUARIO)[0]}
          />
        </View>

        {selectedDate && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Tomas del{" "}
              {new Date(selectedDate).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
              })}
            </Text>
            {tomasDelDiaSeleccionado.length > 0 ? (
              tomasDelDiaSeleccionado.map((toma, index) => (
                <View key={index} style={styles.medicationItem}>
                  <Text style={styles.medicationText}>
                    {toma[0].charAt(0).toUpperCase() + toma[0].slice(1)}
                  </Text>
                  <Text style={styles.medicationTime}>{toma[1]}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noMedicationText}>
                No hay tomas registradas para este día.
              </Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16, marginTop: 16 },
  header: { alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 32, fontWeight: "bold", color: "#000000ff" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#343a40",
  },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  legendText: { fontSize: 16, color: "#495057" },
  medicationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e7f5ff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  medicationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0056b3",
  },
  medicationTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0056b3",
  },
  noMedicationText: {
    fontSize: 16,
    color: "#6c757d",
    fontStyle: "italic",
  },
});
