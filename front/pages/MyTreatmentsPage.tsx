import { Divider } from "@/components/Divider";
import { ModalNewTreatment } from "@/components/ModalNewTreatment";
import { PageTitle } from "@/components/PageTitle";
import { Tratamiento } from "@/components/Tratamiento";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";

export const MyTreatmentsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <ModalNewTreatment
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
          <PageTitle title="treatmentsTitle" />
          <TreatmentsList />
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

const TreatmentsList = () => {
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
        <Tratamiento />
        <Divider
          color="#000000ff"
          thickness={2}
          style={{ marginHorizontal: 12 }}
        />
        <Tratamiento />
        <Divider
          color="#000000ff"
          thickness={2}
          style={{ marginHorizontal: 12 }}
        />
        <Tratamiento />
      </View>
    </View>
  );
};
