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
import { LinearGradient } from "expo-linear-gradient";
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
      <LinearGradient
        colors={["#FF6B6B", "#FF8E53", "#FFA07A"]}
        style={styles.heroHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            {userData?.profilePictureUrl ? (
              <Image
                source={{ uri: userData.profilePictureUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <MaterialIcons name="account-circle" size={90} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.title}>
            {userData?.name || t("tabs.profile")}
          </Text>
          <View style={styles.subtitleContainer}>
            <MaterialIcons name="verified-user" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.subtitle}>Perfil de Usuario</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Información del perfil en tarjetas */}
        {userData && !isLoading && (
          <View style={styles.profileInfo}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            
            <View style={styles.infoCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={styles.cardIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="email" size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Correo Electrónico</Text>
                <Text style={styles.cardValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={styles.cardIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="cake" size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Fecha de Nacimiento</Text>
                <Text style={styles.cardValue}>{userData.birthdate}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={styles.cardIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="wc" size={24} color="#fff" />
              </LinearGradient>
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
  heroHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    marginTop: -20,
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  profileImageContainer: {
    marginBottom: 20,
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 64,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileImagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  // Información del perfil
  profileInfo: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 34,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
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
    backgroundColor: "#FF6B6B",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
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
    borderRadius: 12,
    backgroundColor: "#FF6B6B",
  },
  modalConfirmButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
