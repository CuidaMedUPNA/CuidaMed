import { ModalEditTreatment } from "@/pages/TreatmentDetail/_components/ModalEditTreatment";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const TreatmentDetailHeader = ({
  treatmentName,
  router,
}: {
  treatmentName: string;
  router: ReturnType<typeof useRouter>;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
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
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <AntDesign name="edit" size={24} />
      </TouchableOpacity>
      <ModalEditTreatment
        visible={modalVisible}
        treatmentName={treatmentName}
        treatmentId={1}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};
