import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

export interface AssociatedMedicineProps {
  nombre: string;
  dosis: string;
  frecuencia: string;
  horarios: string[];
}

export const AssociatedMedicine = ({
  nombre,
  dosis,
  frecuencia,
  horarios,
}: AssociatedMedicineProps) => {
  const momentos = [
    { key: "mañana" as const, label: "M", range: [6, 12] },
    { key: "tarde" as const, label: "T", range: [12, 18] },
    { key: "noche" as const, label: "N", range: [18, 24] },
  ];

  const getMomento = (hora: string): "mañana" | "tarde" | "noche" => {
    const [h] = hora.split(":").map(Number);
    if (h >= 6 && h < 12) return "mañana";
    if (h >= 12 && h < 18) return "tarde";
    if (h >= 18 || h < 6) return "noche";
    return "mañana";
  };

  const getActiveMomentos = (): ("mañana" | "tarde" | "noche")[] => {
    return horarios.map(getMomento);
  };

  const activeMomentos = getActiveMomentos();

  return (
    <View style={styles.container}>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{nombre}</Text>
        <Text style={styles.medicineDetails}>
          {dosis} • {frecuencia}
        </Text>
      </View>
      <View style={styles.horarios}>
        <View style={styles.horariosContainer}>
          {horarios.map((horario, index) => (
            <Text key={index} style={styles.horario}>
              {horario}
            </Text>
          ))}
        </View>
        <View style={styles.circlesContainer}>
          {momentos.map((momento) => (
            <View
              key={momento.key}
              style={[
                styles.circle,
                {
                  backgroundColor: activeMomentos.includes(momento.key)
                    ? "#F23728"
                    : "#bdbdbd",
                },
              ]}
            >
              <Text style={styles.circleText}>{momento.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <Icon name="chevron-right" type="entypo" />
      <View style={styles.papelera}>
        <Icon
          name="trash"
          type="font-awesome"
          color="#F23728"
          onPress={() => {
            console.log("Eliminar medicamento: ", nombre);
          }}
          className="papelera"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineInfo: {
    flex: 1,
    paddingRight: 16,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  medicineDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  horario: {
    fontSize: 12,
    color: "#888",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  horarios: {
    flexDirection: "row",
    gap: 16,
  },
  horariosContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 26,
    height: "100%",
  },
  circlesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F23728",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  circleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  papelera: {
    position: "absolute",

    top: 10,
    right: 10,
  },
});
