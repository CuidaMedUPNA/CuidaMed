import { ViewStyle, View } from "react-native";

interface Props {
  orientation?: "horizontal" | "vertical";
  color?: string;
  thickness?: number;
  margin?: number;
  style?: object;
}

export const Divider = ({
  orientation = "horizontal",
  color = "#e0e0e0",
  thickness = 1,
  margin = 16,
  style = {},
}: Props) => {
  const dividerStyle: ViewStyle = {
    backgroundColor: color,
    ...(orientation === "horizontal"
      ? {
          width: "100%",
          height: thickness,
          marginVertical: margin,
        }
      : {
          width: thickness,
          height: "100%",
          marginHorizontal: margin,
        }),
    ...style,
  };

  return <View style={dividerStyle} />;
};
