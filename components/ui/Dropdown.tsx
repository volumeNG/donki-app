import Colors from "@/constants/Colors";
import { copyToClipboard } from "@/constants/utils";
import { TheDonkiContext } from "@/context/TheDonkiProvider";
import {
  Copy,
  PencilLine,
  RefreshCcw,
  ThumbsDown,
  Volume2,
} from "lucide-react-native";
import React, { useContext } from "react";
import { View } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import uuid from "react-native-uuid";
import * as Speech from "expo-speech";
import { QueryAndAnswer } from "@/constants/interface";

type TDropdownMenu = {
  colorScheme: "light" | "dark";
  dropdownItems?: {
    label: string;
    icon: JSX.Element;
    onClick: () => void;
  }[];
  isAiResponse?: boolean;
  item?: QueryAndAnswer;
};

function DropdownList({
  dropdownItems,
  colorScheme,
  isAiResponse = false,
}: TDropdownMenu) {
  const donkiContext = useContext(TheDonkiContext);
  const closeDropdownFunction = () => {
    donkiContext?.setTapVertices(null);
    donkiContext?.setIsAiDropdown(false);
    // donkiContext?.setTappedQueryAndAnswer(undefined);
  };

  const QueryDropdownItems = [
    {
      label: "Copy",
      icon: <Copy size={20} color={Colors[colorScheme].dropdownTextColor} />,
      onClick: () => {
        copyToClipboard(donkiContext!.tappedQueryAndAnswer?.query!);
        donkiContext?.setTapVertices(null);
        donkiContext?.setTappedQueryAndAnswer(undefined);
      },
    },
    {
      label: "Edit",
      icon: (
        <PencilLine size={20} color={Colors[colorScheme].dropdownTextColor} />
      ),
      onClick: () => {
        // donkiContext?.setDisplayDropdown(false);
        // setDisplayDropdown(false);
        if (donkiContext && donkiContext.listOfQueryAndAnswers) {
          const updatedList = donkiContext.listOfQueryAndAnswers.map((item) =>
            item.id === donkiContext.tappedQueryAndAnswer?.id
              ? { ...item, isEditable: true } // Update the `answer` or any other property as needed
              : { ...item, isEditable: false }
          );
          donkiContext.setListOfQueryAndAnswers(updatedList);
          donkiContext?.setTapVertices(null);
          console.log(donkiContext?.tappedQueryAndAnswer);
          donkiContext.setTappedQueryAndAnswer(undefined);
        }
      },
    },
  ];

  const AiDropdownItems = [
    {
      label: "Reseek",
      icon: (
        <RefreshCcw size={20} color={Colors[colorScheme].dropdownTextColor} />
      ),
      onClick: async () => {
        // const findPrevious = conversation[index - 1];
        // dispatch(deleteConversationMessages([index, index - 1]));
        // dispatch(
        //   addConversationMessage({
        //     content: findPrevious.content,
        //     role: "user",
        //   })
        // );
        // handleSearched({ query: findPrevious.content });
        // performs the query again
        closeDropdownFunction();
        await donkiContext?.updateQuery(donkiContext!.tappedQueryAndAnswer!);

        const newQueryAndAnswer = {
          ...donkiContext?.queryAndAnswer,
          id: uuid.v4().toString(),
          query: donkiContext!.tappedQueryAndAnswer?.query?.trim(),
          answer: "",
          isEditable: false,
        }; // Create a new object with the updated id

        // setIsEnableEdit(false);

        await donkiContext?.setQueryAndAnswer(newQueryAndAnswer);
        await donkiContext?.addTolistOfQueryAndAnswers(newQueryAndAnswer);
      },
    },
    {
      label: "Copy",
      icon: <Copy size={20} color={Colors[colorScheme].dropdownTextColor} />,
      onClick: () => {
        copyToClipboard(donkiContext!.tappedQueryAndAnswer?.answer!);
        closeDropdownFunction();
      },
    },
    {
      label: "Unfruitful",
      icon: (
        <ThumbsDown size={20} color={Colors[colorScheme].dropdownTextColor} />
      ),
      // onClick: handleSendUntruthful,
      onClick: () => {
        // readAloud(message);
        donkiContext?.increaseUntruthful();
        closeDropdownFunction();
      },
    },
    {
      label: "Proclaim",
      icon: <Volume2 size={20} color={Colors[colorScheme].dropdownTextColor} />,
      onClick: () => {
        Speech.stop();
        Speech.speak(donkiContext!.tappedQueryAndAnswer?.answer!);
        closeDropdownFunction();

        // readAloud(message);
      },
    },
  ];
  const listItem = donkiContext?.isAiDropdown
    ? AiDropdownItems
    : dropdownItems ?? QueryDropdownItems;
  return (
    <View
      style={[
        styles.dropdownContainer,
        {
          backgroundColor: Colors[colorScheme].dropdownBG,
          shadowColor: "#000",
        },
      ]}
    >
      {/* <View
        style={[
          isAiResponse ? styles.bottomTip : styles.topTip,
          { backgroundColor: Colors[colorScheme].dropdownBG },
        ]}
      ></View> */}
      <View style={{ overflow: "hidden" }}>
        {listItem.map((element, index) => {
          return (
            <Pressable onPress={element.onClick} key={index}>
              <View
                style={{
                  borderBottomColor: "#3D424F",
                  borderBottomWidth: index == listItem.length - 1 ? 0 : 0.5,
                }}
              >
                <View style={styles.action}>
                  <Text
                    style={{
                      fontFamily: "InterBlack",
                      fontWeight: "400",
                      color: Colors[colorScheme].dropdownTextColor,
                    }}
                  >
                    {element.label}
                  </Text>
                  {element.icon}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default DropdownList;

const styles = StyleSheet.create({
  dropdownContainer: {
    width: "50%",
    position: "absolute",
    top: 22,
    left: -10,
    zIndex: 100000,
    borderRadius: 20,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 5,
    // overflow: "hidden"
  },
  topTip: {
    width: 20,
    height: 20,
    borderRadius: 5,
    position: "absolute",
    zIndex: -400,
    left: "8%",
    top: -4,
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
  },
  bottomTip: {
    width: 20,
    height: 20,
    borderRadius: 5,
    position: "absolute",
    zIndex: -400,
    left: "8%",
    top: 100,
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
  },
  action: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
