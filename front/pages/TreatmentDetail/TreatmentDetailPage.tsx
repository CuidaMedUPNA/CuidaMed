import { View } from "react-native";
import { useRouter } from "expo-router";
import { TreatmentDetailHeader } from "./_components/TreatmentDetailHeader";
import { TreatmentDetailDates } from "./_components/TreatmentDetailDates";

export const TreatmentDetailPage = ({
  treatmentName,
}: {
  treatmentName: string;
}) => {
  const router = useRouter();

  // Fechas de ejemplo
  const initialDate = new Date("2025-09-01");
  const endDate = new Date("2025-12-31");

  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#e2e2e2ff",
        margin: 20,
        borderRadius: 24,
      }}
    >
      <TreatmentDetailHeader treatmentName={treatmentName} router={router} />
      <TreatmentDetailDates initialDate={initialDate} endDate={endDate} />
    </View>
  );
};
