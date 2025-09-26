import React from "react";
import { View, Text, Image } from "react-native";

export default function Perfil() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Image
                source={{ uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>Javier Merino Pinedo</Text>
        </View>
    );
}
