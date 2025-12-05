import React, { useMemo, FC } from "react";
import { Calendar } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { DateData } from "react-native-calendars/src/types";

export const TRAMOS_HORARIOS_CONFIG = {
  manana: { key: "manana", color: "#FF8E53" },
  tarde: { key: "tarde", color: "#42A5F5" },
  noche: { key: "noche", color: "#7E57C2" },
};
type TramoKey = keyof typeof TRAMOS_HORARIOS_CONFIG;

const getTramoDelDia = (horaString: string): TramoKey => {
  const hora = parseInt(horaString.split(":")[0], 10);

  if (hora >= 5 && hora < 12) {
    return "manana";
  }
  if (hora >= 12 && hora < 20) {
    return "tarde";
  }
  return "noche";
};

export type TomasPorDia = {
  [date: string]: [string, string][];
};
type MarkedDatesType = {
  [date: string]: MarkingProps;
};
interface CustomIntakeCalendarProps {
  tomasPorDia: TomasPorDia;
  selectedDate: string;
  onDayPress: (day: DateData) => void;
  current?: string;
}

const CustomIntakeCalendar: FC<CustomIntakeCalendarProps> = ({
  tomasPorDia,
  selectedDate,
  onDayPress,
  current,
}) => {
  const markedDates: MarkedDatesType = useMemo(() => {
    const marks: MarkedDatesType = {};

    for (const date in tomasPorDia) {
      const tomas = tomasPorDia[date];

      const tramosEnEsteDia = new Set<TramoKey>();

      tomas.forEach((toma) => {
        const horaString = toma[1];
        const tramo = getTramoDelDia(horaString);
        tramosEnEsteDia.add(tramo);
      });

      const dots = Array.from(tramosEnEsteDia).map((tramoKey) => {
        return TRAMOS_HORARIOS_CONFIG[tramoKey];
      });

      marks[date] = { dots: dots };
    }

    if (selectedDate) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: "#FF6B6B",
      };
    }

    return marks;
  }, [tomasPorDia, selectedDate]);

  const calendarTheme = {
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    textSectionTitleColor: "#FF6B6B",
    textSectionTitleDisabledColor: "#FFCDD2",
    selectedDayBackgroundColor: "#FF6B6B",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#FF6B6B",
    dayTextColor: "#1A1A2E",
    textDisabledColor: "#C7C7CC",
    dotColor: "#FF6B6B",
    selectedDotColor: "#ffffff",
    arrowColor: "#FF6B6B",
    disabledArrowColor: "#FFCDD2",
    monthTextColor: "#1A1A2E",
    indicatorColor: "#FF6B6B",
    weekVerticalMargin: 5,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 13,
  };

  return (
    <Calendar
      markingType={"multi-dot"}
      onDayPress={onDayPress}
      markedDates={markedDates}
      current={current}
      theme={calendarTheme}
    />
  );
};

export default CustomIntakeCalendar;
