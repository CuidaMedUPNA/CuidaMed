import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export const TreatmentDetailHeader = ({
  treatmentName,
  router,
  handleEditTreatment,
}: {
  treatmentName: string;
  router: ReturnType<typeof useRouter>;
  handleEditTreatment: () => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        gap: 24,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/treatments")}>
          <AntDesign name="arrow-left" size={24} color="#6b6b6bff" />
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {treatmentName}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleEditTreatment}>
        <AntDesign name="edit" size={24} />
      </TouchableOpacity>
    </View>
  );
};
