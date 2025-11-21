import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { getProfileOptions } from "@cuidamed-api/client";
import { useQuery } from "@tanstack/react-query";

export function ProfilePage() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: userData, isLoading } = useQuery(getProfileOptions({}));

  console.log("User Data:", userData);

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      setShowConfirmModal(true);
    } else {
      Alert.alert(
        "Cerrar sesión",
        "¿Estás seguro de que deseas cerrar sesión?",
        [
          { text: "Cancelar", onPress: () => {} },
          {
            text: "Cerrar sesión",
            onPress: async () => {
              await logout();
            },
            style: "destructive",
          },
        ]
      );
    }
  };

  const handleConfirmLogout = async () => {
    setShowConfirmModal(false);
    await logout();
  };

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          {userData?.profilePictureUrl ? (
            <Image
              source={{ uri: userData.profilePictureUrl }}
              style={styles.profileImage}
            />
          ) : (
            <MaterialIcons name="account-circle" size={80} color="#F23728" />
          )}
          <Text style={styles.title}>
            {userData?.name || t("tabs.profile")}
          </Text>
        </View>

        {/* Información del perfil */}
        {userData && !isLoading && (
          <View style={styles.profileInfo}>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{userData.email}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Fecha de Nacimiento</Text>
              <Text style={styles.value}>{userData.birthdate}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Género</Text>
              <Text style={styles.value}>
                {userData.gender === "male"
                  ? "Masculino"
                  : userData.gender === "female"
                  ? "Femenino"
                  : userData.gender}
              </Text>
            </View>
          </View>
        )}

        {/* Acciones */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de confirmación para web */}
        {showConfirmModal && Platform.OS === "web" && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cerrar sesión</Text>
              <Text style={styles.modalMessage}>
                ¿Estás seguro de que deseas cerrar sesión?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmLogout}
                >
                  <Text style={styles.modalConfirmButtonText}>
                    Cerrar sesión
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },
  profileInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  actions: {
    gap: 12,
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#F23728",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    minWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  modalCancelButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  modalConfirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F23728",
  },
  modalConfirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
