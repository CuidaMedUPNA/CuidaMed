import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Modal,
  Button,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

export interface CustomDatePickerProps {
  label: string;
  value: Date;
  date: Date;
  onDateChange: (date: Date) => void;
}

export const CustomDatePicker = ({
  label,
  value,
  date,
  onDateChange,
}: CustomDatePickerProps) => {
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);

  const currentDate = value ? new Date(value) : new Date();

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "set" && selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const displayValue = value
    ? new Date(value).toLocaleDateString(
        t("treatments.datePicker.locale") || "es-ES"
      )
    : t("treatments.datePicker.placeholder");

  const renderIOSPicker = () => (
    <Modal
      transparent={true}
      animationType="slide"
      visible={showPicker}
      onRequestClose={() => setShowPicker(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <DateTimePicker
            value={currentDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            locale={t("treatments.datePicker.locale") || "es-ES"}
          />
          <Button
            title={t("common.done")}
            onPress={() => setShowPicker(false)}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Text
          style={value ? styles.dateButtonText : styles.dateButtonPlaceholder}
        >
          {displayValue}
        </Text>
      </Pressable>

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {Platform.OS === "ios" && renderIOSPicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#f23728",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fafbfc",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dateButtonPlaceholder: {
    fontSize: 16,
    color: "#aaa",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
