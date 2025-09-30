import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

const myImage = require("../../assets/images/logo.png");

export default function LoginScreen() {
  const router = useRouter();

  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          CuidaMed
        </Text>

        <Image source={myImage} style={{ width: 300, height: 300 }} />

        <View
          style={{
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <TextInput
            placeholder={t("login.usuarioPlaceholder")}
            style={{
              backgroundColor: "lightgray",
              borderRadius: 9,
              width: 250,
              height: 40,
              paddingHorizontal: 10,
            }}
          />
        </View>

        <View
          style={{
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder={t("login.passwordPlaceholder")}
            secureTextEntry
            style={{
              backgroundColor: "lightgray",
              borderRadius: 9,
              width: 250,
              height: 40,
              paddingHorizontal: 10,
            }}
          />
        </View>

        <View
          style={{
            marginTop: 10,
            alignSelf: "flex-end",
            marginRight: 70,
          }}
        >
          <Text>{t("login.forgotPassword")}</Text>
        </View>

        <Pressable
          style={{
            marginTop: 20,
            backgroundColor: "#F23728",
            borderRadius: 9,
            width: 250,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => router.push("/")}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
            }}
          >
            {t("login.loginButton")}
          </Text>
        </Pressable>

        <View style={{ marginTop: 20 }}>
          <Text>{t("login.noAccount")}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
