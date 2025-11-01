import { View } from "react-native";
import { useRouter } from "expo-router";
import { TreatmentDetailHeader } from "./_components/TreatmentDetailHeader";
import { TreatmentDetailDates } from "./_components/TreatmentDetailDates";
import { TreatmentDetailMedicines } from "./_components/TreatmentDetailMedicines";
import { AssociatedMedicineProps } from "./_components/AssociatedMedicine";
import { ModalEditTreatment } from "./_components/ModalEditTreatment";
import { useState } from "react";

export const TreatmentDetailPage = ({
  treatmentName,
}: {
  treatmentName: string;
}) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const initialDate = new Date("2025-09-01");
  const endDate = new Date("2025-12-31");

  const medicinesData: AssociatedMedicineProps[] = [
    {
      nombre: "Ibuprofeno",
      dosis: "400mg",
      frecuencia: "Cada 8 horas",
      horarios: ["08:00", "16:00", "00:00"],
    },
    {
      nombre: "Paracetamol",
      dosis: "500mg",
      frecuencia: "Cada 6 horas",
      horarios: ["06:00", "12:00", "18:00"],
    },
    {
      nombre: "Omeprazol",
      dosis: "20mg",
      frecuencia: "Una vez al día",
      horarios: ["08:00", "", ""],
    },
    {
      nombre: "Vitamina D",
      dosis: "1000 UI",
      frecuencia: "Una vez al día",
      horarios: ["09:00", "", ""],
    },
    {
      nombre: "Atorvastatina",
      dosis: "20mg",
      frecuencia: "Una vez al día por la noche",
      horarios: ["", "", "22:00"],
    },
  ];

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
        treatmentName={treatmentName}
        router={router}
        handleEditTreatment={() => setModalVisible(true)}
      />
      <TreatmentDetailDates initialDate={initialDate} endDate={endDate} />
      <TreatmentDetailMedicines medicines={medicinesData} />
      <ModalEditTreatment
        visible={modalVisible}
        treatmentName={treatmentName}
        treatmentId={1}
        treatmentInitialDate={initialDate}
        treatmentEndDate={endDate}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};
