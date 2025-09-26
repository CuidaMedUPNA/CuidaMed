import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Medicamento from "../../components/medicamento";
import { LinearGradient } from 'expo-linear-gradient';

const tomas = [
    { id: 1, nombre: "Paracetamol", hora: "08:00" },
    { id: 2, nombre: "Ibuprofeno", hora: "12:00" },
    { id: 3, nombre: "Omeprazol", hora: "18:00" },
    { id: 4, nombre: "Aspirina", hora: "22:00" },
];

export default function Pastillas() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ backgroundColor: "#D9D9D9", height: "90%", width: "90%", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Mis Medicamentos</Text>
                <View style={{ width: "100%", flex: 1, alignItems: "center", overflowY: "scroll" }}>
                    {tomas.map((toma) => (
                        <Medicamento key={toma.id} nombre={toma.nombre} hora={toma.hora} />
                    ))}
                </View>
                <TouchableOpacity
                    style={{
                        padding: 15,
                        borderRadius: 30,
                        margin: 20
                    }}
                    onPress={() => {
                        // Navegar a la pantalla de añadir medicamento
                    }}
                >
                    <View style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}>
                        
                        <LinearGradient
                            colors={['#43ea7c', '#2ecc40']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={{ flex: 1, borderRadius: 30 }}
                        />
                       
                    </View>
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Añadir</Text>
                </TouchableOpacity>
            </View>            
        </View>
    );
}