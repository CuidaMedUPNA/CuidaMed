import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";

interface ProgressBarProps {
  progress: number;
  duration?: number;
  style?: ViewStyle;
}

export const ProgressBar = ({
  progress,
  duration = 600,
  style,
}: ProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percent = Math.round(clampedProgress * 100);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percent,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [percent, duration, animatedValue]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[styles.track, style]}
      accessibilityLabel={`Progreso ${percent} por ciento`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
    >
      <Animated.View style={[styles.fill, { width: widthInterpolated }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#ff0000ff",
    borderRadius: 8,
  },
});
