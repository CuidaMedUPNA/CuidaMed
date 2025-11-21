import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function CalendarScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("tabs.calendar")}</Text>
          <Text style={styles.subtitle}>
            Página de calendario en construcción...
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b6b6bff",
    textAlign: "center",
  },
});
