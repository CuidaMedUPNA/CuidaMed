import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";

const queryClient = new QueryClient();

function Main() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{t("welcome")}</Text>
      <Text>Usuarios:</Text>
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}
