import { useTranslation } from "react-i18next";
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Alert,
} from "react-native";
import { CustomDatePicker } from "./CustomDatePicker";
import React, { useState } from "react";
import { CheckBox } from "react-native-elements";
import { useMutation } from "@tanstack/react-query";
import { createTreatmentMutation } from "@cuidamed-api/client/src/generated/@tanstack/react-query.gen";

export interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ModalNewTreatment = ({ visible, onClose }: Props) => {
  const { t } = useTranslation();
  const userId = 1; // Simulated user ID
  const [isChecked, setIsChecked] = useState(false);
  const [treatmentName, setTreatmentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const mutation = useMutation(createTreatmentMutation());

  const handleAddTreatment = () => {
    if (
      !treatmentName ||
      !startDate ||
      (!isChecked && !endDate) ||
      startDate > endDate
    ) {
      Alert.alert(t("error"), t("treatments.datePicker.badFillFieldsAlert"));
      return;
    }

    const payload = {
      body: {
        name: treatmentName,
        userId,
        startDate,
        endDate: isChecked ? startDate : endDate,
      },
    };

    mutation.mutate(payload);
    mutation.mutate(payload, {
      onSuccess: (data) => {
        console.log("Treatment added:", data);
      },
      onError: (error) => {
        console.error("Error adding treatment:", error);
      },
    });
    // Reset form fields
    setTreatmentName("");
    setStartDate("");
    setEndDate("");
    setIsChecked(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(30,30,30,0.85)",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 28,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
            position: "relative",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#F23728",
              borderRadius: 16,
              width: 28,
              height: 28,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#F23728",
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            onPress={onClose}
            accessibilityLabel={t("treatments.closeButton")}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              X
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 22,
              marginBottom: 24,
              fontWeight: "700",
              color: "#222",
              letterSpacing: 0.5,
              marginTop: 8,
            }}
          >
            {t("treatments.addTreatment")}
          </Text>
          <TextInput
            placeholder={t("treatments.treatmentNamePlaceholder")}
            placeholderTextColor="#aaa"
            value={treatmentName}
            onChangeText={setTreatmentName}
            style={{
              borderColor: "#e0e0e0",
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              marginBottom: 20,
              width: "100%",
              fontSize: 16,
              backgroundColor: "#fafbfc",
            }}
          />
          <View
            style={{
              width: "100%",
              marginBottom: 24,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <CustomDatePicker
              dateInfo={t("treatments.startDate")}
              onDateChange={setStartDate}
            />
            <View style={{ zIndex: 0 }}>
              <View style={{ zIndex: 2 }}>
                {!isChecked && (
                  <CustomDatePicker
                    dateInfo={t("treatments.endDate")}
                    onDateChange={setEndDate}
                  />
                )}
              </View>
              <View>
                <CheckBox
                  title={t("treatments.datePicker.isPermanent")}
                  checked={isChecked}
                  onPress={() => setIsChecked(!isChecked)}
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                  }}
                  textStyle={{ fontSize: 16, color: "#222" }}
                  checkedColor="#f23728"
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: "100%",
              paddingVertical: 14,
              backgroundColor: "#1ab702",
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 8,
              shadowColor: "#1ab702",
              shadowOpacity: 0.15,
              shadowRadius: 4,
            }}
            onPress={() => {
              handleAddTreatment();
              onClose();
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              {t("treatments.addMedicationButton")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
