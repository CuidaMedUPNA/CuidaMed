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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Encabezado con gradiente */}
        <View style={styles.headerContainer}>
          <View style={styles.headerGradient}>
            <View style={styles.decorationCircle1} />
            <View style={styles.decorationCircle2} />
          </View>
          
          <View style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              {userData?.profilePictureUrl ? (
                <Image
                  source={{ uri: userData.profilePictureUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <MaterialIcons name="account-circle" size={100} color="#fff" />
                </View>
              )}
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
              </View>
            </View>
            <Text style={styles.title}>
              {userData?.name || t("tabs.profile")}
            </Text>
            <Text style={styles.subtitle}>Perfil de Usuario</Text>
          </View>
        </View>

        {/* Información del perfil en tarjetas */}
        {userData && !isLoading && (
          <View style={styles.profileInfo}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.cardIconContainer}>
                <MaterialIcons name="email" size={24} color="#F23728" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Correo Electrónico</Text>
                <Text style={styles.cardValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.cardIconContainer}>
                <MaterialIcons name="cake" size={24} color="#F23728" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Fecha de Nacimiento</Text>
                <Text style={styles.cardValue}>{userData.birthdate}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.cardIconContainer}>
                <MaterialIcons name="wc" size={24} color="#F23728" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Género</Text>
                <Text style={styles.cardValue}>
                  {userData.gender === "male"
                    ? "Masculino"
                    : userData.gender === "female"
                    ? "Femenino"
                    : userData.gender}
                </Text>
              </View>
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
    backgroundColor: "#f5f5f5",
    paddingBottom: 100,
  },
  // Encabezado
  headerContainer: {
    position: "relative",
    paddingBottom: 40,
    overflow: "hidden",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: "#F23728",
  },
  decorationCircle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -30,
  },
  decorationCircle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    bottom: 20,
    left: -20,
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#F23728",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  // Información del perfil
  profileInfo: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    marginTop: 0,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(242, 55, 40, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  // Acciones
  actions: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
    marginBottom: 40,
  },
  editButton: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#F23728",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: "#F23728",
    fontSize: 16,
    fontWeight: "700",
  },
  settingsButton: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#F23728",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#F23728",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // Modal
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    minWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  modalMessage: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  modalCancelButtonText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },
  modalConfirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#F23728",
  },
  modalConfirmButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
