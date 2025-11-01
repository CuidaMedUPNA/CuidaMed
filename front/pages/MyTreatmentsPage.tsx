import { Divider } from "@/components/Divider";
import { ModalNewTreatment } from "@/components/ModalNewTreatment";
import { PageTitle } from "@/components/PageTitle";
import { Tratamiento } from "@/components/Treatment";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { getTreatmentsOptions, Treatment } from "@cuidamed-api/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { t } from "i18next";
import { subtitleStyle, titleStyle } from "@/app/styles/styles";

export const MyTreatmentsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const { data: treatments } = useQuery(
    getTreatmentsOptions({
      query: { userId: 1 },
    })
  );

  const handleTreatmentPress = (treatmentName: string) => {
    router.push({
      pathname: "/treatments/[treatmentName]",
      params: { treatmentName },
    });
  };

  return (
    <>
      <ModalNewTreatment
        initialStartDate={new Date()}
        initialEndDate={undefined}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 100,
          }}
        >
          <PageTitle title={t("treatments.treatmentsTitle")} />
          <TreatmentsList
            treatments={treatments ?? []}
            onTreatmentPress={handleTreatmentPress}
          />
        </ScrollView>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#F23728",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const TreatmentsList = ({
  treatments,
  onTreatmentPress,
}: {
  treatments: Treatment[];
  onTreatmentPress: (treatmentName: string) => void;
}) => {
  return (
    <View
      style={{
        backgroundColor: "#D9D9D9",
        height: "80%",
        width: "95%",
        borderRadius: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          padding: "5%",
        }}
      >
        {treatments.length === 0 ? (
          <View>
            <Text
              style={{ ...titleStyle, fontWeight: "bold", textAlign: "center" }}
            >
              {t("treatments.noTreatments")}
            </Text>
            <Text style={{ ...subtitleStyle }}>
              {t("treatments.noTreatmentsDescription")}
            </Text>
          </View>
        ) : (
          treatments.map((treatment, index) => (
            <View key={treatment.name} style={{ width: "100%" }}>
              <Tratamiento
                name={treatment.name}
                startDate={treatment.startDate}
                endDate={treatment.endDate}
                onPress={() => onTreatmentPress(treatment.name)}
              />
              {index < treatments.length - 1 && <Divider />}
            </View>
          ))
        )}
      </View>
    </View>
  );
};
