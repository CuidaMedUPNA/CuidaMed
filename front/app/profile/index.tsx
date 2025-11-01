import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>{t("tabs.profile")}</Text>
        <Text style={styles.subtitle}>Página de perfil en construcción...</Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b6b6bff",
    textAlign: "center",
  },
});
