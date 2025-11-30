import { MaterialIcons } from "@expo/vector-icons";
import { navigate } from "expo-router/build/global-state/routing";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

const logo = require("@/assets/images/logo.png");

export const HeaderMainPage = ({
  todayDate,
  progreso,
}: {
  todayDate: string;
  progreso: number;
}) => {
  return (
    <View>
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
          <MaterialIcons name="event" size={18} color="rgba(255,255,255,0.9)" />
          <Text style={styles.fecha}>{todayDate}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso del día</Text>
          <Text style={styles.progressPercentage}>{Math.round(progreso)}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progreso}%` }]} />
        </View>
      </View>
    </View>
  );
};

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
});
