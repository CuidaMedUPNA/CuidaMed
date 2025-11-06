import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const queryClient = new QueryClient();

function Main() {
  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.welcomeTitle}>👋 Bienvenido</Text>
            <Text style={styles.appName}>CuidaMed</Text>
          </View>

          <View style={styles.cardsContainer}>
            <View style={[styles.card, styles.cardPrimary]}>
              <MaterialIcons name="medication" size={40} color="#F23728" />
              <Text style={styles.cardTitle}>Mis Tratamientos</Text>
              <Text style={styles.cardDescription}>
                Gestiona tus medicamentos y horarios
              </Text>
            </View>

            <View style={styles.card}>
              <MaterialIcons
                name="notifications-active"
                size={40}
                color="#F23728"
              />
              <Text style={styles.cardTitle}>Recordatorios</Text>
              <Text style={styles.cardDescription}>
                Nunca te pierdas una dosis
              </Text>
            </View>

            <View style={styles.card}>
              <MaterialIcons name="history" size={40} color="#F23728" />
              <Text style={styles.cardTitle}>Historial</Text>
              <Text style={styles.cardDescription}>Revisa tu progreso</Text>
            </View>

            <View style={styles.card}>
              <MaterialIcons name="person" size={40} color="#F23728" />
              <Text style={styles.cardTitle}>Perfil</Text>
              <Text style={styles.cardDescription}>Configura tu cuenta</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>💊 Tu salud, bajo control</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F23728",
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPrimary: {
    backgroundColor: "#fff5f5",
    borderWidth: 2,
    borderColor: "#F23728",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b6b6bff",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 16,
    color: "#6b6b6bff",
    fontWeight: "500",
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}
