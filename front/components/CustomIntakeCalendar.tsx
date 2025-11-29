import React, { useMemo, FC } from "react";
import { Calendar } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { DateData } from "react-native-calendars/src/types";

export const TRAMOS_HORARIOS_CONFIG = {
  manana: { key: "manana", color: "#f59e0b" },
  tarde: { key: "tarde", color: "#3b82f6" },
  noche: { key: "noche", color: "#8b5cf6" },
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
        selectedColor: "#e63946",
        disableTouchEvent: true,
      };
    }

    return marks;
  }, [tomasPorDia, selectedDate]);

  const calendarTheme = {
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    textSectionTitleColor: "#e63946",
    textSectionTitleDisabledColor: "#ffcdd2",
    selectedDayBackgroundColor: "#e63946",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#e63946",
    dayTextColor: "#2d3436",
    textDisabledColor: "#ffcdd2",
    dotColor: "#e63946",
    selectedDotColor: "#ffffff",
    arrowColor: "#e63946",
    disabledArrowColor: "#ffcdd2",
    monthTextColor: "#e63946",
    indicatorColor: "#e63946",
    weekVerticalMargin: 5,
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
