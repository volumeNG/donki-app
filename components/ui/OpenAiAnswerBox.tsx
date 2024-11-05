import { View, Text } from "@/components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Copy, RefreshCcw, ThumbsDown, Volume2 } from "lucide-react-native";
import DropdownList from "./Dropdown";
import * as Speech from "expo-speech";
import {
  StyleSheet,
  Image,
  GestureResponderEvent,
  Dimensions,
} from "react-native";
import Markdown from "react-native-markdown-display";
import Colors from "@/constants/Colors";
import EllipsisComponent from "../shared/Ellipsis";
import { TheDonkiContext } from "@/context/TheDonkiProvider";
import { copyToClipboard } from "@/constants/utils";
import { QueryAndAnswer } from "@/constants/interface";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { ColorContext } from "@/context/DonkiColorProvider";

interface OpenAiAnswerBoxProps {
  // message: string;
  // isLoading: boolean;
  item: QueryAndAnswer;
}

const screenHeight = Dimensions.get("window").height;

function OpenAiAnswerBox({  item }: OpenAiAnswerBoxProps) {
  //Start of animation section
  const tintColor = useSharedValue("#1F75FE");

  const duration = 1000;
  useEffect(() => {
    if (item.answer?.length == 0) {
      tintColor.value = withRepeat(
        withTiming("#EDEDF1", { duration }),
        Infinity,
        true
      );
    } else {
      tintColor.value = "#1F75FE";
    }
  }, [item]);
  //End of animation section

  const donkiContext = useContext(TheDonkiContext);
  const colorContext = useContext(ColorContext);
  const colorScheme = colorContext?.colorScheme ?? "light";
  // const donkiContext = useContext(TheDonkiContext);
  return (
    <View
      style={{
        overflow: "visible",
        position: "relative",
        zIndex: 90,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View
          style={[
            styles.searchIcon,
            // { height: 45, width: 45, marginRight: 10 },
            { height: 32, width: 32, marginRight: 10 },
          ]}
        >
          <Animated.Image
            source={require("./../../assets/images/donkiLogo.png")}
            style={[styles.image, { tintColor }]}
          />
        </View>
        <View
          style={{
            backgroundColor: "transparent",
            flex: 1,
          }}
        >
          <Markdown style={markdownstyles(Colors[colorScheme ?? "light"].text)}>
            {item.answer!}
          </Markdown>
        </View>
      </View>
      <EllipsisComponent
        colorScheme={colorScheme ?? "light"}
        style={{ marginTop: 8, marginRight: 0,}}
        onPress={(e: GestureResponderEvent) => {
          const yPosition = e.nativeEvent.pageY;
          const isNearBottom = yPosition > screenHeight - 200;
          donkiContext?.setTapVertices({
            x: e.nativeEvent.pageX,
            y: isNearBottom ? yPosition - 150 : yPosition,
          });
          donkiContext?.setTappedQueryAndAnswer(item);
          donkiContext?.setIsAiDropdown(true);

          // donkiContext?.setDisplayDropdown(!donkiContext.displayDropdown);
          // setDisplayDropdown(!displayDropdown);
        }}
      />

      {/* {displayDropdown && (
        <View
          style={{
            width: "100%",
            position: "absolute",
            zIndex: 100000,
            backgroundColor: "red",
          }}
        >
          <DropdownList
            dropdownItems={repliedDropdownItems}
            colorScheme={colorScheme}
            isAiResponse={true}
          />
        </View>
      )} */}
    </View>
  );
}

export default React.memo(OpenAiAnswerBox);

const markdownstyles = (color: string) =>
  StyleSheet.create({
    body: {
      fontFamily: "InterBlack",
      fontWeight: "400",
      fontSize: 14,
      lineHeight: 22,
      color: color, // Use dynamic color based on the theme
    },
    strong: {
      fontFamily: "InterBlack",
      fontWeight: "700",
      fontSize: 16,
      lineHeight: 22,
      color: color, // Use dynamic color for bold text as well
    },
    paragraph: {
      fontFamily: "InterBlack",
      fontWeight: "400",
      fontSize: 14,
      lineHeight: 22,
      color: color,
      marginVertical: 5,
    },
    heading1: {
      fontFamily: "InterBlack",
      fontWeight: "700",
      fontSize: 22,
      marginBottom: 10,
      color: color,
    },
    heading2: {
      fontFamily: "InterBlack",
      fontWeight: "700",
      fontSize: 20,
      marginBottom: 8,
      color: color,
    },
    bullet_list: {
      fontFamily: "InterBlack",
      fontWeight: "400",
      fontSize: 14,
      lineHeight: 22,
      color: color,
      marginBottom: 5,
      paddingLeft: 3,
    },
    ordered_list: {
      fontFamily: "InterBlack",
      fontWeight: "400",
      fontSize: 14,
      lineHeight: 22,
      color: color,
      marginBottom: 5,
      paddingLeft: 3,
    },
    blockquote: {
      fontFamily: "InterBlack",
      fontWeight: "400",
      fontStyle: "italic",
      color: "#6a737d",
    },
    code_inline: {
      fontFamily: "InterBlack",
      fontWeight: "400",
      backgroundColor: "#f6f8fa",
      padding: 4,
      borderRadius: 4,
      color: color,
    },
    a: {
      color: "#1F75FE", // Links will be blue
    },
  });

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "red",
  },
  topBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "visible",
    backgroundColor: "transparent",
  },

  searchIcon: {
    backgroundColor: "#EDEDF1",
    borderRadius: 42,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  seekRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 20,
    height: 20,
    tintColor: "#1F75FE",
    objectFit: "contain",
  },
  arrow: {
    width: 18,
    height: 18,
    tintColor: "blue",
    marginLeft: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  settings: {
    position: "absolute",
    bottom: -18,
    zIndex: 100,
    backgroundColor: "green",
  },
});
