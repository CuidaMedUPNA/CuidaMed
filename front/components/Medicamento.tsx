import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";

export interface MedicamentoProps {
  nombre: string;
  hora: string;
}

export const Medicamento: FC<MedicamentoProps> = ({ nombre, hora }) => {
  const momentos = [
    { key: "mañana", label: "M" },
    { key: "tarde", label: "T" },
    { key: "noche", label: "N" },
  ];

  const getMomento = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    const totalMinutes = h * 60 + m;
    if (totalMinutes >= 360 && totalMinutes < 720) return "mañana";
    if (totalMinutes >= 720 && totalMinutes < 1080) return "tarde";
    if (totalMinutes >= 1080 && totalMinutes < 1440) return "noche";
  };

  const momentoActual = getMomento(hora);

  return (
    <View style={styles.container}>
      <Text>{nombre}</Text>
      <View style={styles.circlesContainer}>
        {momentos.map((momento) => (
          <View
            key={momento.key}
            style={[
              styles.circle,
              {
                backgroundColor:
                  momentoActual === momento.key ? "#F23728" : "#bdbdbd",
              },
            ]}
          >
            <Text style={styles.circleText}>{momento.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginVertical: 12,
    marginHorizontal: "5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  circlesContainer: {
    flexDirection: "row",
    gap: 16,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bdbdbd",
    shadowColor: "#F23728",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  circleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
