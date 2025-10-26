import { View, Text } from "react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface TreatmentDetailDatesProps {
  initialDate: Date;
  endDate: Date;
}

export const TreatmentDetailDates = ({
  initialDate,
  endDate,
}: TreatmentDetailDatesProps) => {
  const { t } = useTranslation();

  const { progressPercentage, daysRemaining } = useMemo(() => {
    const now = new Date();
    const totalMs = endDate.getTime() - initialDate.getTime();
    const elapsedMs = now.getTime() - initialDate.getTime();

    const totalDaysValue = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
    const daysRemainingValue = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    const progressPercent =
      totalDaysValue > 0
        ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100))
        : 0;

    return {
      progressPercentage: progressPercent,
      daysRemaining: daysRemainingValue,
    };
  }, [initialDate, endDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <View style={{ gap: 8 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, color: "#666", fontWeight: "500" }}>
            {t("treatments.detail.initialDate")}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "600" }}>
            {formatDate(initialDate)}
          </Text>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, color: "#666", fontWeight: "500" }}>
            {t("treatments.detail.endDate")}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "600" }}>
            {formatDate(endDate)}
          </Text>
        </View>
      </View>

      <View style={{ gap: 8, marginTop: 8 }}>
        <View
          style={{
            height: 6,
            backgroundColor: "#c4c3c3ff",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progressPercentage}%`,
              backgroundColor: "#F23728",
              borderRadius: 3,
            }}
          />
        </View>
        <Text style={{ fontSize: 12, color: "#666", textAlign: "center" }}>
          {daysRemaining} {t("treatments.detail.daysRemaining")}
        </Text>
      </View>
    </View>
  );
};
