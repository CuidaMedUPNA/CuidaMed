import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PageTitle = ({ title }: { title: string }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
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
          marginTop: insets.top + 30,
          marginBottom: 20,
          color: "#e03535ff",
        }}
      >
        {t(title)}
      </Text>
    </View>
  );
};
