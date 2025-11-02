import { View } from "react-native";
import { useRouter } from "expo-router";
import { TreatmentDetailHeader } from "./_components/TreatmentDetailHeader";
import { TreatmentDetailDates } from "./_components/TreatmentDetailDates";
import { TreatmentDetailMedicines } from "./_components/TreatmentDetailMedicines";
import { ModalEditTreatment } from "./_components/ModalEditTreatment";
import { useState } from "react";
import { getIntakesByTreatmentOptions } from "@cuidamed-api/client";
import { useQuery } from "@tanstack/react-query";

export const TreatmentDetailPage = ({
  treatmentId: treatmentId,
}: {
  treatmentId: number;
}) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const initialDate = new Date("2025-09-01");
  const endDate = new Date("2025-12-31");

  const { data: intakes } = useQuery(
    getIntakesByTreatmentOptions({
      path: {
        treatmentId,
      },
    })
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#e2e2e2ff",
        margin: 20,
        borderRadius: 24,
      }}
    >
      <TreatmentDetailHeader
        treatmentName={"Manolito"}
        router={router}
        handleEditTreatment={() => setModalVisible(true)}
      />
      <TreatmentDetailDates initialDate={initialDate} endDate={endDate} />
      <TreatmentDetailMedicines medicines={intakes ?? []} />
      <ModalEditTreatment
        visible={modalVisible}
        treatmentName={"Manolito"}
        treatmentId={1}
        treatmentInitialDate={initialDate}
        treatmentEndDate={endDate}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};
