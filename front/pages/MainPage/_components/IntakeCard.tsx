import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface Toma {
  id: string;
  medicamento: string;
  dosis: string;
  hora: string;
  tomada: boolean;
}

export const IntakeCard = ({ toma }: { toma: Toma }) => {
  return (
    <TouchableOpacity
      style={[styles.intakeCard, toma.tomada && styles.intakeCardTomada]}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={
          toma.tomada ? ["#F0FDF4", "#DCFCE7"] : ["#fffafaff", "#ffe0e0ff"]
        }
        style={styles.intakeCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <LinearGradient
          colors={toma.tomada ? ["#22C55E", "#16A34A"] : ["#FF6B6B", "#EF4444"]}
          style={styles.intakeIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons
            name={toma.tomada ? "check-circle" : "schedule"}
            size={26}
            color="#FFF"
          />
        </LinearGradient>

        <View style={styles.intakeInfo}>
          <Text
            style={[
              styles.intakeMedicamento,
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
              style={[styles.intakeDosis, toma.tomada && { color: "#10B981" }]}
            >
              {toma.dosis}
            </Text>
          </View>
        </View>

        <View style={styles.intakeHourContainer}>
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
                styles.intakeState,
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
                styles.intakeHour,
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
};

const styles = StyleSheet.create({
  intakeCard: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  intakeCardTomada: {
    opacity: 0.85,
  },
  intakeCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  intakeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  intakeInfo: {
    flex: 1,
  },
  intakeMedicamento: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  intakeDosis: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  intakeHourContainer: {
    alignItems: "flex-end",
  },
  intakeHour: {
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
  intakeState: {
    fontSize: 11,
    fontWeight: "700",
  },
});
