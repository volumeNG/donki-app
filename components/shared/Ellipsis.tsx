import { Ellipsis } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface EllipsisProps {
  colorScheme: "light" | "dark";
  onPress?: (e?: any) => void;
  style?: StyleProp<ViewStyle>;
}

function EllipsisComponent({ colorScheme, onPress, style }: EllipsisProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.searchIcon,
          {
            height: 35,
            width: 35,
            marginRight: 8,
            backgroundColor: colorScheme == "light" ? "#F6F7F9" : "#363944",
            borderWidth: 1,
            borderColor: colorScheme == "light" ? "#EDEDF1" : "#3D424F",
          },
          style,
        ]}
      >
        <Ellipsis
          size={20}
          color={colorScheme == "light" ? "#363944" : "#FFFFFF"}
        />
      </View>
    </Pressable>
  );
}

export default EllipsisComponent;

const styles = StyleSheet.create({
  searchIcon: {
    borderRadius: 42,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 25,
    height: 25,
    tintColor: "#1F75FE",
    objectFit: "contain",
  },
});
