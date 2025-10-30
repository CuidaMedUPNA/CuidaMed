import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { t } from "i18next";
import Icon from "react-native-vector-icons/Ionicons";

const COLORS = {
  primary: "#f23728",
  primaryLight: "#ffe0e0ff",
  background: "#F7FAFC",
  text: "#2D3748",
  textSecondary: "#718096",
  white: "#FFFFFF",
  danger: "#E53E3E",
  success: "#38A169",
  disabled: "#E2E8F0",
};

export interface Props {
  visible: boolean;
  treatmentName: string;
  treatmentId: number;
  onClose: () => void;
}

export const ModalEditTreatment = ({
  visible,
  onClose,
  treatmentName,
  treatmentId,
}: Props) => {
  const userId = treatmentId;

  const [newTreatmentName, setNewTreatmentName] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("treatments.editTreatment")}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.normalText}>
              {t("treatments.treatmentName")}
            </Text>
            <TextInput
              placeholder={treatmentName}
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              onChangeText={setNewTreatmentName}
            />

            {/* <CustomDatePicker
              label={t("treatments.startDate")}
              value={startDate}
              onDateChange={setStartDate}
            />
            <CustomDatePicker
              label={t("treatments.endDate")}
              value={endDate}
              onDateChange={setEndDate}
            /> */}
          </View>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [styles.editButton]}
              onPress={() => console.log("newTreatmentName:", newTreatmentName)}
            >
              <Text style={styles.editButtonText}>{t("edit")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    height: "75%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 99,
    backgroundColor: COLORS.disabled,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  normalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#f23728",
  },
  infoContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.disabled,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 99,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.disabled,
    width: "100%",
  },
  chipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderColor: COLORS.disabled,
  },
  editButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.75,
  },
});
