import { View, Text } from "@/components/Themed";
import React, { useContext, useEffect, useState } from "react";
import uuid from "react-native-uuid";
import {
  TextInput,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import EllipsisComponent from "../shared/Ellipsis";
import { TheDonkiContext } from "@/context/TheDonkiProvider";
import { QueryAndAnswer } from "@/constants/interface";

interface UserQueryProps {
  // isEditable: boolean;
  colorScheme: "light" | "dark";
  userRequest: QueryAndAnswer;
}

const screenWidth = Dimensions.get("window").width;

function UserQueryBox({ colorScheme, userRequest }: UserQueryProps) {
  const donkiContext = useContext(TheDonkiContext);
  const [newQuery, setNewQuery] = useState<string>(userRequest.query!);

  useEffect(() => {
    setNewQuery(userRequest.query ?? "");
  }, [userRequest.query]);

  return (
    <View
      style={{
        zIndex: 100,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "93%",
        alignSelf: "flex-end",
        backgroundColor: Colors[colorScheme ?? "light"].background,
        overflow: "visible",
      }}
    >
      <EllipsisComponent
        colorScheme={colorScheme}
        onPress={(e: GestureResponderEvent) => {
          const xPosition = e.nativeEvent.pageX;
          const isNearBottom = xPosition > screenWidth - 200;
          donkiContext?.setTapVertices({
            x: isNearBottom ? xPosition - 100 : xPosition,
            y: e.nativeEvent.pageY,
          });
          donkiContext?.setTappedQueryAndAnswer(userRequest);
        }}
        style={{ width: 36, height: 36 }}
      />

      <View
        style={{
          // backgroundColor: "transparent",
          backgroundColor: userRequest.isEditable
            ? "transparent"
            : Colors[colorScheme ?? "light"].boxColor,
          borderColor: colorScheme == "light" ? "#EDEDF1" : "#3D424F",
          borderWidth: 1,
          borderRadius: 20,
          overflow: "hidden",
          alignSelf: "flex-end",
          maxWidth: "90%",
          // flex: 2,
        }}
      >
        {userRequest.isEditable ? (
          <View style={styles.editQuery}>
            <TextInput
              multiline={true}
              value={newQuery}
              onChangeText={setNewQuery}
              style={[
                styles.textBox,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
              selectionColor={Colors[colorScheme ?? "light"].selectionColor}
              autoFocus={userRequest.isEditable}
            />
            <View style={styles.buttons}>
              <Pressable
                onPress={() => {
                  if (donkiContext && donkiContext.listOfQueryAndAnswers) {
                    const updatedList = donkiContext.listOfQueryAndAnswers.map(
                      (item) => ({
                        ...item,
                        isEditable: false,
                      })
                    );
                    donkiContext.setListOfQueryAndAnswers(updatedList);
                    donkiContext?.setTapVertices(null);
                    donkiContext.setTappedQueryAndAnswer(undefined);
                  }
                  setNewQuery(userRequest.query!);
                }}
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: Colors[colorScheme ?? "light"].boxColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.textBox,
                    { color: Colors[colorScheme ?? "light"].text },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  await donkiContext?.updateQuery(userRequest);
                  // setIsEnableEdit(false);
                  const newQueryAndAnswer = {
                    ...donkiContext?.queryAndAnswer,
                    id: uuid.v4().toString(),
                    query: newQuery.trim(),
                    answer: "",
                    isEditable: false,
                  };
                  await donkiContext?.setQueryAndAnswer(newQueryAndAnswer);
                  await donkiContext?.addTolistOfQueryAndAnswers(
                    newQueryAndAnswer
                  );
                }}
                style={[styles.cancelButton, { backgroundColor: "#1F75FE" }]}
              >
                <Text
                  style={[
                    styles.textBox,
                    { color: "white", fontWeight: "600" },
                  ]}
                >
                  Send
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.queryText}>
            <Text
              style={{
                fontFamily: "InterBlack",
                fontWeight: "400",
                fontSize: 14,
                color: Colors[colorScheme ?? "light"].text,
              }}
            >
              {userRequest.query!}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default React.memo(UserQueryBox);

//

const styles = StyleSheet.create({
  editQuery: {
    backgroundColor: "transparent",
    padding: 10,
  },

  textBox: {
    // color:
    // color:"red"
    fontFamily: "InterBlack",
    fontWeight: "400",
    fontSize: 14,
  },
  queryText: {
    padding: 10,
    // fontFamily: "InterBlack",
    // fontWeight: "400",
    // fontSize: 14,
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    // alignSelf: "center",
  },
  buttons: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: "red",
  },
});
