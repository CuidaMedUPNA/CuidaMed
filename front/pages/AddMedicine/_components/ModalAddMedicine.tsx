import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { CustomDatePicker } from "@/components/CustomDatePicker";

interface NewDosingTime {
  scheduledTime: string;
  dayOfWeek: number; // 0 para todos los días, 1-7 para días específicos
}

interface FormData {
  medicineId: number | null;
  startDate: string;
  endDate: string | null;
  doseAmount: number | null;
  doseUnit: string;
  dosingTimes: NewDosingTime[];
}

interface ModalAddMedicineProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  treatmentId: number;
  medicineId: number;
}

export const ModalAddMedicine = ({
  visible,
  onClose,
  onSubmit,
  treatmentId,
  medicineId,
}: ModalAddMedicineProps) => {
  const [formData, setFormData] = useState<FormData>({
    medicineId: medicineId || null,
    startDate: new Date().toISOString().split("T")[0],
    endDate: null,
    doseAmount: null,
    doseUnit: "",
    dosingTimes: [],
  });

  const [dosingTimeInput, setDosingTimeInput] = useState<NewDosingTime>({
    scheduledTime: "",
    dayOfWeek: 0,
  });

  const [isDailyDosing, setIsDailyDosing] = useState(true);

  const handleAddDosingTime = () => {
    if (!dosingTimeInput.scheduledTime) {
      Alert.alert("Error", "Por favor ingresa la hora de la toma");
      return;
    }

    if (!isDailyDosing && dosingTimeInput.dayOfWeek < 1) {
      Alert.alert("Error", "Por favor selecciona un día válido (1-7)");
      return;
    }

    const newDosingTime: NewDosingTime = {
      scheduledTime: dosingTimeInput.scheduledTime,
      dayOfWeek: isDailyDosing ? 0 : dosingTimeInput.dayOfWeek,
    };

    setFormData((prev) => ({
      ...prev,
      dosingTimes: [...prev.dosingTimes, newDosingTime],
    }));

    setDosingTimeInput({
      scheduledTime: "",
      dayOfWeek: 0,
    });
  };

  const handleRemoveDosingTime = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dosingTimes: prev.dosingTimes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.startDate ||
      !formData.doseAmount ||
      !formData.doseUnit ||
      formData.dosingTimes.length === 0
    ) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
      console.log("Form data incomplete:", formData);
      return;
    }

    onSubmit(formData);
    setFormData({
      medicineId: medicineId || null,
      startDate: new Date().toISOString().split("T")[0],
      endDate: null,
      doseAmount: null,
      doseUnit: "",
      dosingTimes: [],
    });
    setDosingTimeInput({
      scheduledTime: "",
      dayOfWeek: 0,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Añadir Nueva Toma</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Fecha de Inicio */}
            <View style={styles.formGroup}>
              <CustomDatePicker
                label="Fecha de Inicio"
                value={new Date(formData.startDate)}
                date={new Date(formData.startDate)}
                onDateChange={(date: Date) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date.toISOString().split("T")[0],
                  }))
                }
              />
            </View>

            {/* Fecha de Fin */}
            <View style={styles.formGroup}>
              <CustomDatePicker
                label="Fecha de Fin (Opcional)"
                value={
                  formData.endDate ? new Date(formData.endDate) : undefined
                }
                date={formData.endDate ? new Date(formData.endDate) : undefined}
                onDateChange={(date: Date) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: date.toISOString().split("T")[0],
                  }))
                }
              />
            </View>

            {/* Cantidad de Dosis */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cantidad de Dosis *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 500, 1.5, etc"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={
                  formData.doseAmount !== null
                    ? formData.doseAmount.toString()
                    : ""
                }
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    doseAmount: text ? parseFloat(text) : null,
                  }))
                }
              />
            </View>

            {/* Unidad de Dosis */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Unidad de Dosis *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: comprimidos, ml, gotas"
                placeholderTextColor="#999"
                value={formData.doseUnit}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, doseUnit: text }))
                }
              />
            </View>

            {/* Horarios de Toma */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Horarios de Toma *</Text>

              <View style={styles.dosingToggle}>
                <Text style={styles.toggleLabel}>
                  {isDailyDosing ? "Toma Diaria" : "Toma por Día Específico"}
                </Text>
                <Switch
                  value={isDailyDosing}
                  onValueChange={setIsDailyDosing}
                />
              </View>

              <View style={styles.dosingTimeInput}>
                <View style={styles.dosingTimeInputRow}>
                  <TextInput
                    style={[styles.input, styles.timeInput]}
                    placeholder="HH:mm"
                    placeholderTextColor="#999"
                    value={dosingTimeInput.scheduledTime}
                    onChangeText={(text) =>
                      setDosingTimeInput((prev) => ({
                        ...prev,
                        scheduledTime: text,
                      }))
                    }
                  />

                  {!isDailyDosing && (
                    <TextInput
                      style={[styles.input, styles.dayInput]}
                      placeholder="Día (1-7)"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={
                        dosingTimeInput.dayOfWeek > 0
                          ? String(dosingTimeInput.dayOfWeek)
                          : ""
                      }
                      onChangeText={(text) =>
                        setDosingTimeInput((prev) => ({
                          ...prev,
                          dayOfWeek: text ? parseInt(text, 10) : 0,
                        }))
                      }
                    />
                  )}

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddDosingTime}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Lista de Horarios Agregados */}
              <View style={styles.dosingTimesList}>
                {formData.dosingTimes.map((time, index) => (
                  <View key={index} style={styles.dosingTimeItem}>
                    <Text style={styles.dosingTimeText}>
                      {time.scheduledTime}
                      {time.dayOfWeek && ` - Día ${time.dayOfWeek}`}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveDosingTime(index)}
                    >
                      <Text style={styles.removeButton}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Botones de Acción */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Añadir Toma</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    maxHeight: "95%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#999",
    fontWeight: "bold",
  },
  form: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  dosingToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 13,
    color: "#666",
  },
  dosingTimeInput: {
    marginBottom: 12,
  },
  dosingTimeInputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  timeInput: {
    flex: 1,
    minWidth: 80,
  },
  dayInput: {
    flex: 0.6,
    minWidth: 60,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  addButtonText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  dosingTimesList: {
    marginTop: 12,
  },
  dosingTimeItem: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dosingTimeText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  removeButton: {
    fontSize: 18,
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
