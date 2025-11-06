import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Cerrar sesión",
        onPress: async () => {
          await logout();
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="account-circle" size={80} color="#F23728" />
          <Text style={styles.title}>{t("tabs.profile")}</Text>
          <Text style={styles.subtitle}>
            Página de perfil en construcción...
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b6b6bff",
    textAlign: "center",
  },
  actions: {
    gap: 12,
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
});
