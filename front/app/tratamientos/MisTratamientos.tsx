import { ModalNewTreatment } from "@/components/ModalNewTreatment";
import React, { useState } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Tratamiento } from "@/components/Tratamiento";
import { Divider } from "@/components/Divider";
import { AntDesign } from "@expo/vector-icons";

export default function MisTratamientos() {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <ModalNewTreatment
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 100, // Espacio para el botón flotante
          }}
        >
          <View
            style={{
              marginBottom: 20,
              justifyContent: "flex-start",
              width: "100%",
              marginLeft: "5%",
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                marginTop: insets.top,
                marginBottom: 20,
                color: "#e03535ff",
              }}
            >
              {t("treatmentsTitle")}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#D9D9D9",
              height: "80%",
              width: "95%",
              borderRadius: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                margin: 20,
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
              <Divider
                color="#000000ff"
                thickness={2}
                style={{ marginHorizontal: 12 }}
              />
            </View>
          </View>
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
    </SafeAreaProvider>
  );
}
