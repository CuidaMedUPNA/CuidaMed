import React, { useMemo, FC } from "react";
import { Calendar } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { DateData } from "react-native-calendars/src/types";

export const TRAMOS_HORARIOS_CONFIG = {
  manana: { key: "manana", color: "#ffa200ff" },
  tarde: { key: "tarde", color: "#18fc03ff" },
  noche: { key: "noche", color: "#038cfcff" },
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
        selectedColor: "#61adf9ff",
        disableTouchEvent: true,
      };
    }

    return marks;
  }, [tomasPorDia, selectedDate]);

  const calendarTheme = {
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: "#61adf9ff",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#61adf9ff",
    dayTextColor: "#2d3436",
    textDisabledColor: "#d9e1e8",
    dotColor: "#61adf9ff",
    selectedDotColor: "#ffffff",
    arrowColor: "#61adf9ff",
    disabledArrowColor: "#d9e1e8",
    monthTextColor: "#2d3436",
    indicatorColor: "#61adf9ff",
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
