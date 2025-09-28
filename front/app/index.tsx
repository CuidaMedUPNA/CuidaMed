import { getUsersOptions } from "@cuidamed-api/client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";

const queryClient = new QueryClient();

function Main() {
  const { data } = useQuery(getUsersOptions());
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{t("welcome")}</Text>
      <Text>Usuarios:</Text>
      {data?.map((user) => (
        <Text key={user.id}>
          {user.name} ({user.email})
        </Text>
      ))}
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
