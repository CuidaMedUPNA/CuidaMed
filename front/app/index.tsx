import { getUsersOptions } from "@cuidamed-api/client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { View, Text } from "react-native";

const queryClient = new QueryClient();

function Main() {
  const { data } = useQuery(getUsersOptions());

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🚀 Bienvenido a la app</Text>
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
