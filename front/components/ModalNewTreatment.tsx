import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { t } from "i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Icon from "react-native-vector-icons/Ionicons";

import {
  createTreatmentMutation,
  getTreatmentsQueryKey,
} from "@cuidamed-api/client";

import { CustomDatePicker } from "./CustomDatePicker";

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
  onClose: () => void;
}

export const ModalNewTreatment = ({ visible, onClose }: Props) => {
  const userId = 1;

  const queryClient = useQueryClient();

  const [treatmentName, setTreatmentName] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isPermanent, setIsPermanent] = useState(false);

  const mutation = useMutation({
    ...createTreatmentMutation(),
    onSuccess: () => {
      console.log("✅ Tratamiento creado con éxito.");
      queryClient.invalidateQueries({
        queryKey: getTreatmentsQueryKey({ query: { userId } }),
      });
      onClose();
    },
    onError: (error) => {
      console.error("❌ Error al crear tratamiento:", error);
      Alert.alert(t("error"), t("treatments.create.errorAlert"));
    },
  });

  useEffect(() => {
    if (!visible) {
      setTreatmentName("");
      setStartDate(null);
      setEndDate(null);
      setIsPermanent(false);
      mutation.reset();
    }
  }, [visible, mutation.reset]);

  const handleAddTreatment = () => {
    const isEndDateInvalid =
      !isPermanent &&
      (!endDate || (startDate && new Date(startDate) > new Date(endDate)));

    if (!treatmentName || !startDate || isEndDateInvalid) {
      Alert.alert(t("error"), t("treatments.datePicker.badFillFieldsAlert"));
      return;
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toISOString().split("T")[0];
    };

    const finalEndDate = isPermanent ? startDate! : endDate!;

    const treatmentData = {
      name: treatmentName,
      userId: userId,
      startDate: formatDate(startDate!),
      endDate: formatDate(finalEndDate),
    };

    mutation.mutate({ body: treatmentData });
  };

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
            <Text style={styles.title}>{t("treatments.addTreatment")}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TextInput
              placeholder={t("treatments.treatmentNamePlaceholder")}
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              value={treatmentName}
              onChangeText={setTreatmentName}
            />
            <CustomDatePicker
              label={t("treatments.startDate")}
              value={startDate}
              onDateChange={setStartDate}
            />
            {!isPermanent && (
              <CustomDatePicker
                label={t("treatments.endDate")}
                value={endDate}
                onDateChange={setEndDate}
              />
            )}
            <Pressable
              style={[styles.chip, isPermanent && styles.chipSelected]}
              onPress={() => setIsPermanent(!isPermanent)}
            >
              <Icon
                name={isPermanent ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={isPermanent ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.chipText,
                  isPermanent && styles.chipTextSelected,
                ]}
              >
                {t("treatments.datePicker.isPermanent")}
              </Text>
            </Pressable>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                mutation.isPending && styles.addButtonDisabled,
                pressed && !mutation.isPending && styles.addButtonPressed,
              ]}
              onPress={handleAddTreatment}
              disabled={mutation.isPending}
            >
              <Text style={styles.addButtonText}>
                {mutation.isPending
                  ? t("saving")
                  : t("treatments.addMedicationButton", "Añadir Tratamiento")}
              </Text>
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
  addButton: {
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
  addButtonPressed: {
    transform: [{ translateY: 2 }],
    shadowOpacity: 0.15,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
