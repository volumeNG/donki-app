import Colors from "@/constants/Colors";
import { ColorContext } from "@/context/DonkiColorProvider";
import { MessageCircleWarningIcon } from "lucide-react-native";
import React, { useContext } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
function Toast() {
  const colorContext = useContext(ColorContext);

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        top: 50,
        backgroundColor:
          Colors[colorContext?.colorScheme ?? "light"].background,
        width: "90%",
        position: "absolute",
        alignSelf: "center",
        borderRadius: 5,
        padding: 15,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        shadowColor: "#003049",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
        zIndex: 100000000,
      }}
    >
      <MessageCircleWarningIcon
        size={20}
        color={Colors[colorContext?.colorScheme ?? "light"].dropdownTextColor}
      />
      <View>
        <Text
          style={{
            color: Colors[colorContext?.colorScheme ?? "light"].text,
            fontWeight: "500",
            marginLeft: 10,
            fontSize: 14,
          }}
        >
          We received your feedback. Thank you for helping us improve!
        </Text>
      </View>
    </Animated.View>
  );
}

export default Toast;
