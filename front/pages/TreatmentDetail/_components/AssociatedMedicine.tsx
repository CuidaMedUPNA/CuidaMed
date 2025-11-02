import { DosingTime } from "@cuidamed-api/client";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import { mapScheduleToHorarios } from "../_helpers/scheduleMapper";

export interface AssociatedMedicineProps {
  name: string;
  dose: number;
  unit: string;
  schedule: DosingTime[];
  onPress: () => void;
}

const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"];
const { width } = Dimensions.get("window");

export const AssociatedMedicine = ({
  name,
  dose,
  unit,
  schedule,
  onPress,
}: AssociatedMedicineProps) => {
  const { horariosPorDia, isDiario } = mapScheduleToHorarios(schedule);

  return (
    <View style={styles.container}>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{name}</Text>
        <Text style={styles.medicineDetails}>
          {dose} {unit}
        </Text>
      </View>
      <View style={styles.horarios}>
        <View style={[styles.diasContainer, { maxWidth: width * 0.4 }]}>
          {isDiario ? (
            <View style={styles.diaCompleto}>
              <Text style={styles.diaLabel}>Diario</Text>
              <View style={styles.horariosDelDia}>
                {horariosPorDia[0].map((horario, idx) => (
                  <Text key={idx} style={styles.horario}>
                    {horario}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            diasSemana.map((dia, dayNum) => {
              const dayKey = dayNum + 1;
              const horariosDelDia = horariosPorDia[dayKey];
              if (!horariosDelDia) return null;

              return (
                <View key={dayNum} style={styles.dia}>
                  <Text style={styles.diaLabel}>{dia}</Text>
                  <View style={styles.horariosDelDia}>
                    {horariosDelDia.map((horario, idx) => (
                      <Text key={idx} style={styles.horario}>
                        {horario}
                      </Text>
                    ))}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
      <View style={styles.acciones}>
        <Icon name="chevron-right" type="entypo" size={20} />
        <TouchableOpacity
          onPress={() => {
            console.log("Eliminar medicamento: ", name);
            onPress();
          }}
          accessibilityRole="button"
        >
          <Icon name="trash" type="font-awesome" color="#F23728" size={18} />
        </TouchableOpacity>
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
    paddingHorizontal: 16,
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
    minWidth: 80,
  },
  medicineName: {
    fontSize: width < 375 ? 16 : 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  medicineDetails: {
    fontSize: width < 375 ? 12 : 14,
    color: "#666",
    marginBottom: 8,
  },
  horario: {
    fontSize: 11,
    color: "#888",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  horarios: {
    flex: 2,
    justifyContent: "center",
  },
  diasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  dia: {
    alignItems: "center",
    minWidth: width < 375 ? 35 : 45,
  },
  diaCompleto: {
    alignItems: "center",
  },
  diaLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  horariosDelDia: {
    alignItems: "center",
    gap: 2,
  },
  acciones: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingLeft: 8,
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
