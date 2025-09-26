import React from "react";
import { View,Text, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform, } from "react-native";
import { useRouter } from "expo-router";

const myImage = require("../../assets/images/logo.png");

export default function LoginScreen() {
  const router = useRouter();

  return (
    // Se usa para que al escribir en los textsFields no se tape el contenido
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
            placeholder="Usuario"
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
            placeholder="Contraseña"
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
          <Text>¿Olvidaste tu contraseña?</Text>
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
          onPress={() => router.push("/")} // Sin más para ir a la pantalla principal, falta por implementar el login
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
            }}
          >
            Iniciar sesión
          </Text>
        </Pressable>

        <View style={{ marginTop: 20 }}>
          <Text>¿No tienes una cuenta? Regístrate</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
