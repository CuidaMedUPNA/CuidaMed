import { Medicamento } from "@/components/Medicamento";
import { useState } from "react";
import { View, TouchableOpacity, Modal, Text } from "react-native";
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
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
        >
          <View
            style={{
              height: "50%",
              width: "50%",
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>
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
