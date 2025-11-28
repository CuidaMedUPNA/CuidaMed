import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { navigate } from "expo-router/build/global-state/routing";

const queryClient = new QueryClient();
const logo = require("@/assets/images/logo.png");

interface Toma {
  id: string;
  medicamento: string;
  dosis: string;
  hora: string;
  tomada: boolean;
}

async function fetchTomasDeHoy(): Promise<Toma[]> {
  return [
    {
      id: "1",
      medicamento: "Paracetamol",
      dosis: "500mg",
      hora: "08:00 AM",
      tomada: true,
    },
    {
      id: "2",
      medicamento: "Ibuprofeno",
      dosis: "200mg",
      hora: "12:00 PM",
      tomada: false,
    },
    {
      id: "3",
      medicamento: "Ibuprofeno",
      dosis: "200mg",
      hora: "12:00 PM",
      tomada: false,
    },
    {
      id: "4",
      medicamento: "Ibuprofeno",
      dosis: "200mg",
      hora: "12:00 PM",
      tomada: false,
    },
    {
      id: "5",
      medicamento: "Ibuprofeno",
      dosis: "200mg",
      hora: "12:00 PM",
      tomada: false,
    },
  ];
}

function TomaCard({ toma }: { toma: Toma }) {
  return (
    <TouchableOpacity
      style={[styles.tomaCard, toma.tomada && styles.tomaCardTomada]}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={
          toma.tomada ? ["#F0FDF4", "#DCFCE7"] : ["#fffafaff", "#ffe0e0ff"]
        }
        style={styles.tomaCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <LinearGradient
          colors={toma.tomada ? ["#22C55E", "#16A34A"] : ["#FF6B6B", "#EF4444"]}
          style={styles.tomaIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons
            name={toma.tomada ? "check-circle" : "schedule"}
            size={26}
            color="#FFF"
          />
        </LinearGradient>

        <View style={styles.tomaInfo}>
          <Text
            style={[
              styles.tomaMedicamento,
              toma.tomada && { color: "#059669" },
            ]}
          >
            {toma.medicamento}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            <MaterialIcons
              name="medication"
              size={14}
              color={toma.tomada ? "#10B981" : "#94A3B8"}
            />
            <Text
              style={[styles.tomaDosis, toma.tomada && { color: "#10B981" }]}
            >
              {toma.dosis}
            </Text>
          </View>
        </View>

        <View style={styles.tomaHoraContainer}>
          <View
            style={[
              styles.estadoBadge,
              {
                backgroundColor: toma.tomada
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(239, 68, 68, 0.1)",
                borderWidth: 1,
                borderColor: toma.tomada
                  ? "rgba(34, 197, 94, 0.3)"
                  : "rgba(239, 68, 68, 0.2)",
              },
            ]}
          >
            <Text
              style={[
                styles.tomaEstado,
                { color: toma.tomada ? "#15803D" : "#DC2626" },
              ]}
            >
              {toma.tomada ? "✓ Tomada" : "Pendiente"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 8,
            }}
          >
            <MaterialIcons
              name="access-time"
              size={16}
              color={toma.tomada ? "#22C55E" : "#FF6B6B"}
            />
            <Text
              style={[
                styles.tomaHora,
                { color: toma.tomada ? "#22C55E" : "#FF6B6B" },
              ]}
            >
              {toma.hora}
            </Text>
          </View>
        </View>

        {!toma.tomada && (
          <View
            style={{
              marginLeft: 8,
              backgroundColor: "#FF6B6B",
              borderRadius: 12,
              padding: 8,
            }}
          >
            <MaterialIcons name="chevron-right" size={20} color="#FFF" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

function Main() {
  const {
    data: tomas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tomasHoy"],
    queryFn: fetchTomasDeHoy,
  });

  const tomasPendientes = tomas?.filter((t) => !t.tomada).length ?? 0;
  const tomasCompletadas = tomas?.filter((t) => t.tomada).length ?? 0;
  const totalTomas = (tomas?.length ?? 0) || 1;
  const progreso = (tomasCompletadas / totalTomas) * 100;

  const todayDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#FF6B6B", "#FF8E53", "#FFA07A"]}
        style={styles.heroHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={styles.appName}>¡Hola! Javier</Text>
            <Image source={logo} style={styles.logo} />
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              navigate("/(tabs)/profile");
            }}
          >
            <MaterialIcons name="person" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateBox}>
            <MaterialIcons
              name="event"
              size={18}
              color="rgba(255,255,255,0.9)"
            />
            <Text style={styles.fecha}>{todayDate}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso del día</Text>
            <Text style={styles.progressPercentage}>
              {Math.round(progreso)}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progreso}%` }]} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {tomas && tomas.length !== 0 && (
            <View style={styles.resumenContainer}>
              <View style={styles.resumenCard}>
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E53"]}
                  style={styles.resumenGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.resumenIconBg}>
                    <MaterialIcons
                      name="pending-actions"
                      size={28}
                      color="#FFF"
                    />
                  </View>
                  <Text style={styles.resumenNumero}>{tomasPendientes}</Text>
                  <Text style={styles.resumenTexto}>Pendientes</Text>
                </LinearGradient>
              </View>

              <View style={styles.resumenCard}>
                <LinearGradient
                  colors={["#4CAF50", "#66BB6A"]}
                  style={styles.resumenGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.resumenIconBg}>
                    <MaterialIcons name="check-circle" size={28} color="#FFF" />
                  </View>
                  <Text style={styles.resumenNumero}>{tomasCompletadas}</Text>
                  <Text style={styles.resumenTexto}>Completadas</Text>
                </LinearGradient>
              </View>
            </View>
          )}

          <View style={styles.tomasSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tomas de hoy</Text>
              <TouchableOpacity
                style={styles.verTodoBtn}
                onPress={() => {
                  navigate("/(tabs)/calendar");
                }}
              >
                <Text style={styles.verTodoText}>Ver todo</Text>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={14}
                  color="#FF6B6B"
                />
              </TouchableOpacity>
            </View>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner}>
                  <MaterialIcons
                    name="hourglass-empty"
                    size={40}
                    color="#FF6B6B"
                  />
                </View>
                <Text style={styles.loadingText}>Cargando tomas...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <View style={styles.errorIconBg}>
                  <MaterialIcons
                    name="error-outline"
                    size={50}
                    color="#FF6B6B"
                  />
                </View>
                <Text style={styles.errorTitle}>¡Ups!</Text>
                <Text style={styles.errorText}>Error al cargar las tomas</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => {
                    window.location.reload();
                  }}
                >
                  <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}

            {tomas && tomas.length === 0 && (
              <View style={styles.emptyContainer}>
                <LinearGradient
                  colors={["#fff0f0ff", "#fee0e0ff"]}
                  style={styles.emptyIconBg}
                >
                  <MaterialIcons
                    name="event-available"
                    size={56}
                    color="#e90e0eff"
                  />
                </LinearGradient>
                <Text style={styles.emptyTitle}>Sin tomas programadas</Text>
                <Text style={styles.emptyText}>
                  No hay medicamentos registrados para el día de hoy
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    navigate("/treatments");
                  }}
                >
                  <MaterialIcons
                    name="add-circle-outline"
                    size={20}
                    color="#FFF"
                  />
                  <Text style={styles.addButtonText}>Añadir tratamiento</Text>
                </TouchableOpacity>
              </View>
            )}

            {tomas?.map((toma) => (
              <TomaCard key={toma.id} toma={toma} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  heroHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  dateTimeContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 16,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fecha: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFF",
    borderRadius: 4,
  },
  content: {
    paddingTop: 34,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  resumenContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  resumenCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  resumenGradient: {
    padding: 20,
    alignItems: "center",
  },
  resumenIconBg: {
    width: 46,
    height: 46,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  resumenNumero: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFF",
  },
  resumenTexto: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    marginTop: 4,
  },
  tomasSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  verTodoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  verTodoText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  tomaCard: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tomaCardTomada: {
    opacity: 0.85,
  },
  tomaCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  tomaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  tomaInfo: {
    flex: 1,
  },
  tomaMedicamento: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  tomaDosis: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  tomaHoraContainer: {
    alignItems: "flex-end",
  },
  tomaHora: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  tomaEstado: {
    fontSize: 11,
    fontWeight: "700",
  },
  loadingContainer: {
    padding: 50,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
  },
  errorIconBg: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: "#666",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000ff",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}
