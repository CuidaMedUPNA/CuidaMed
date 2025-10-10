import { titleStyle } from "@/app/styles/styles";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PageTitle = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
          ...titleStyle,
          fontWeight: "bold",
          marginTop: insets.top + 20,
        }}
      >
        {t(title)}
      </Text>
    </View>
  );
};
