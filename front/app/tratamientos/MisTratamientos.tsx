import { Medicamento } from "@/components/Medicamento";
import { useState } from "react";
import { View, TouchableOpacity, Modal, Text, TextInput } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const tomas = [
  { id: 1, nombre: "Paracetamol", hora: "08:00" },
  { id: 2, nombre: "Ibuprofeno", hora: "12:00" },
  { id: 3, nombre: "Omeprazol", hora: "18:00" },
  { id: 4, nombre: "Aspirina", hora: "22:00" },
];

export default function MisTratamientos() {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
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
                top: 16,
                right: 16,
                zIndex: 2,
                backgroundColor: "#F23728",
                borderRadius: 16,
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#F23728",
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
              onPress={() => setModalVisible(false)}
              accessibilityLabel="Cerrar"
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
              }}
            >
              {t("addTreatment")}
            </Text>
            <TextInput
              placeholder="Nombre del tratamiento"
              placeholderTextColor="#aaa"
              style={{
                height: 48,
                borderColor: "#e0e0e0",
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 16,
                marginBottom: 24,
                width: "100%",
                fontSize: 16,
                backgroundColor: "#fafbfc",
              }}
            />
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
                // Lógica para añadir el tratamiento
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                {t("treatments.addMedicationButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#D9D9D9",
            height: "90%",
            width: "90%",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 20,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            {t("treatmentsTitle")}
          </Text>
          <View
            style={{
              width: "100%",
              flex: 1,
              alignItems: "center",
            }}
          >
            {tomas.map((toma) => (
              <Medicamento
                key={toma.id}
                nombre={toma.nombre}
                hora={toma.hora}
              />
            ))}
          </View>
          <View style={{ width: "100%", alignItems: "center", margin: 20 }}>
            <TouchableOpacity
              style={{
                padding: 15,
                borderRadius: 30,
                margin: 20,
                backgroundColor: "#F23728",
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {t("treatments.addMedicationButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
