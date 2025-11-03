import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const AddMedicinePage = () => {
  return (
    <View style={styles.container}>
      <Text>Pantalla para añadir medicamento</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
