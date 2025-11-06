import { View } from "react-native";
import { useRouter } from "expo-router";
import { TreatmentDetailHeader } from "./_components/TreatmentDetailHeader";
import { TreatmentDetailDates } from "./_components/TreatmentDetailDates";
import { TreatmentDetailMedicines } from "./_components/TreatmentDetailMedicines";
import { ModalEditTreatment } from "./_components/ModalEditTreatment";
import { useState } from "react";
import {
  getIntakesByTreatmentOptions,
  getTreatmentsOptions,
} from "@cuidamed-api/client";
import { useQuery } from "@tanstack/react-query";

export const TreatmentDetailPage = ({
  treatmentId: treatmentId,
}: {
  treatmentId: number;
}) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: treatments } = useQuery(
    getTreatmentsOptions({
      query: { userId: 1 },
    })
  );

  const treatment = treatments?.find((t) => t.id === treatmentId);

  const initialDate = treatment ? new Date(treatment.startDate) : new Date();
  const endDate = treatment?.endDate ? new Date(treatment.endDate) : undefined;

  const { data: intakes, isLoading } = useQuery(
    // 👇 ¡Usar la función que termina en "Options"!
    getIntakesByTreatmentOptions({
      path: {
        treatmentId,
      },
    })
  );

  console.log("Intakes:", intakes);

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
        treatmentName={treatment?.name ?? ""}
        router={router}
        handleEditTreatment={() => setModalVisible(true)}
      />
      <TreatmentDetailDates
        initialDate={initialDate}
        endDate={endDate ?? new Date()}
      />
      <TreatmentDetailMedicines medicines={intakes ?? []} />
      <ModalEditTreatment
        visible={modalVisible}
        treatmentName={"Manolito"}
        treatmentId={1}
        treatmentInitialDate={initialDate}
        treatmentEndDate={endDate ?? new Date()}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};
