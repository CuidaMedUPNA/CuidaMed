import { FC } from "react";
import { Modal, View, TouchableOpacity, TextInput, Text } from "react-native";

export interface ModalState {
  visible: boolean;
  onClose: () => void;
}

export const ModalNewTreatment: FC<ModalState> = ({ visible, onClose }) => {
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
            onPress={() => onClose()}
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
            Añadir nuevo tratamiento
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
              Añadir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
