import React, { useState } from "react";
import { View, StyleSheet, Text, Button, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

export interface Props {
  dateInfo: string;
  onDateChange?: (date: string) => void;
}

export const CustomDatePicker = ({ dateInfo, onDateChange }: Props) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      setSelectedDate(date);

      const formatted = date.toISOString().split("T")[0];
      if (onDateChange) onDateChange(formatted);
    }
    if (Platform.OS !== "ios") {
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{dateInfo}</Text>

      <Button
        title={t("treatments.datePicker.placeholder")}
        onPress={() => setShowPicker(true)}
        color="#f23728"
      />

      <Text style={styles.selectedDate}>
        {selectedDate.toLocaleDateString()}
      </Text>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          locale={t("treatments.datePicker.locale") || "es-ES"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#f23728",
  },
  selectedDate: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
});
