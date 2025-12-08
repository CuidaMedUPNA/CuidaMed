import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { IntakeCard } from "./_components/IntakeCard";
import { HeaderMainPage } from "./_components/HeaderMainPage";
import { useRouter } from "expo-router";
import { getTodayIntakes } from "@cuidamed-api/client";

interface Toma {
  id: string;
  medicamento: string;
  dosis: string;
  hora: string;
  tomada: boolean;
}

async function fetchTomasDeHoy(): Promise<Toma[]> {
  try {
    const response = await getTodayIntakes();
    
    const intakes = response.data || [];
    
    return intakes.flatMap((intake: any) =>
      intake.dosingTimes.map((dosing: any) => ({
        id: `${intake.id}-${dosing.id}`,
        medicamento: intake.medicineName,
        dosis: `${intake.doseAmount} ${intake.doseUnit}`,
        hora: dosing.scheduledTime,
        tomada: false,
      }))
    );
  } catch (error) {
    console.error("Error fetching today's intakes:", error);
    throw error;
  }
}

export const MainPage = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    data: tomas,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tomasHoy"],
    queryFn: fetchTomasDeHoy,
  });

  const router = useRouter();
  // TODO: Implementar funcionalidad de tomas completadas
  // const tomasPendientes = tomas?.filter((t) => !t.tomada).length ?? 0;
  // const tomasCompletadas = tomas?.filter((t) => t.tomada).length ?? 0;
  // const totalTomas = (tomas?.length ?? 0) || 1;
  // const progreso = (tomasCompletadas / totalTomas) * 100;
  const progreso = 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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
        <HeaderMainPage todayDate={todayDate} progreso={progreso} />
      </LinearGradient>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B6B"]}
            tintColor="#FF6B6B"
          />
        }
      >
        <View style={styles.content}>
          {/* TODO: Implementar funcionalidad de tomas completadas */}
          {/* {tomas && tomas.length !== 0 && (
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
          )} */}

          <View style={styles.tomasSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tomas de hoy</Text>
              <TouchableOpacity
                style={styles.verTodoBtn}
                onPress={() => {
                  router.push("/(tabs)/calendar");
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
                    refetch();
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
                    router.push("/treatments");
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
              <IntakeCard key={toma.id} toma={toma} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  heroHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
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
