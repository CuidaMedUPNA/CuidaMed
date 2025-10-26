import React, { useMemo } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { ProgressBar } from "./ProgressBar";
import { Icon } from "react-native-elements";

interface Props {
  name: string;
  startDate: string;
  endDate: string;
  onPress?: () => void;
}

export const Tratamiento = ({ name, startDate, endDate, onPress }: Props) => {
  const parse = (s: string) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const start = useMemo(() => parse(startDate), [startDate]);
  const end = useMemo(() => parse(endDate), [endDate]);

  const progress = useMemo(() => {
    const total = end.getTime() - start.getTime();
    if (total <= 0) return 1;
    const elapsed = Date.now() - start.getTime();
    return elapsed / total;
  }, [start, end]);

  const percent = Math.round(Math.max(0, Math.min(1, progress)) * 100);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.percent}>{percent}%</Text>
        <Icon name="chevron-right" type="entypo" />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.date}>{fmtDate(start)}</Text>
        <Text style={styles.separator}>—</Text>
        <Text style={styles.date}>{fmtDate(end)}</Text>
      </View>

      <ProgressBar progress={progress} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  percent: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065f46",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
  separator: {
    fontSize: 12,
    color: "#9ca3af",
    marginHorizontal: 8,
  },
});
