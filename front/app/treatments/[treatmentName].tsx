import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TreatmentDetail() {
  const { treatmentName } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {treatmentName}
        </Text>
        <Text>Pantalla de detalle del tratamiento</Text>
      </View>
    </SafeAreaProvider>
  );
}
