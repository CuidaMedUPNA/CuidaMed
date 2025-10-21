import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";

export default function Perfil() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ alignItems: "center", display: "flex", flexDirection: "row", gap: 8, justifyContent: "center", marginBottom: 40 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>PacienteX</Text>
                <Image
                    source={{ uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                />
            </View>
            <View>
                <Text style={{ fontSize: 18 }}>Correo:</Text>
                <TextInput className="email-input"
                    placeholder="pacienteX@gmail.com"
                    style={{
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        backgroundColor: "#d9d9d9",
                        borderRadius: 8,
                        padding: 8,
                        width: 250,
                        marginTop: 8
                    }}
                />
                <TouchableOpacity style={{ marginTop: 16, backgroundColor: "#00b32a", padding: 10, borderRadius: 8, width: "25%", position: "relative", left: "75%" }}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>Editar</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, marginTop: 16 }}>Contraseña:</Text>
                <TextInput className="password-input"
                    placeholder="********"
                    secureTextEntry
                    style={{
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        backgroundColor: "#d9d9d9",
                        borderRadius: 8,
                        padding: 8,
                        width: 250,
                        marginTop: 8
                    }}
                />
                <TouchableOpacity style={{ marginTop: 16, backgroundColor: "#00b32a", padding: 10, borderRadius: 8, width: "25%", position: "relative", left: "75%" }}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>Editar</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ marginTop: 40, backgroundColor: "#f23728", padding: 10, borderRadius: 8 }}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>Eliminar Cuenta</Text>
                </TouchableOpacity>
        </View>
    );
}
