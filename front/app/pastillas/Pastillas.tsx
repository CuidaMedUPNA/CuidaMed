import { View, Text, TouchableOpacity } from "react-native";
import Medicamento from "../../components/Medicamento";

const tomas = [
  { id: 1, nombre: "Paracetamol", hora: "08:00" },
  { id: 2, nombre: "Ibuprofeno", hora: "12:00" },
  { id: 3, nombre: "Omeprazol", hora: "18:00" },
  { id: 4, nombre: "Aspirina", hora: "22:00" },
];

export default function Pastillas() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: "#D9D9D9",
          height: "90%",
          width: "90%",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Mis Medicamentos
        </Text>
        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
          }}
        >
          {tomas.map((toma) => (
            <Medicamento key={toma.id} nombre={toma.nombre} hora={toma.hora} />
          ))}
        </View>
        <View style={{ width: "100%", alignItems: "center", margin: 20 }}>
          <TouchableOpacity
            style={{
              padding: 15,
              borderRadius: 30,
              margin: 20,
              backgroundColor: "#F23728",
            }}
            onPress={() => {
              // Navegar a la pantalla de añadir medicamento
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Añadir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
