import { View, Text, StyleSheet } from "react-native";

interface Props {
  name: string;
  startDate: string;
  endDate: string;
}

export const Tratamiento = ({ name, startDate, endDate }: Props) => {
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
});
