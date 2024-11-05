import { View, Text } from "@/components/Themed";
import React, {
  PureComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Moon,
  Sun,
  Paperclip,
  MessageCircleWarning,
  HandHeart,
  CircleX,
} from "lucide-react-native";
import {
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  TextInput,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Switch } from "react-native-paper";
import OpenAiAnswerBox from "@/components/ui/OpenAiAnswerBox";
import * as DocumentPicker from "expo-document-picker";
import UserQueryBox from "@/components/ui/UserQueryBox";
import Colors from "@/constants/Colors";
import { TheDonkiContext } from "@/context/TheDonkiProvider";
import uuid from "react-native-uuid";
import DropdownList from "@/components/ui/Dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { DisplayQueryAndAnswerProps } from "@/constants/interface";
import { prompts } from "@/constants/data";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ColorContext } from "@/context/DonkiColorProvider";
import Toast from "@/components/shared/Toast";

const SCREEN_WIDTH = Dimensions.get("window").width;

/**Using a pure component reduces re-rendering except a change has actually been made,
 * this decision was made after I was facing a bug. */

class DisplayQueryAndAnswer extends PureComponent<DisplayQueryAndAnswerProps> {
  render() {
    const { colorScheme, item } = this.props;
    return (
      <View
        style={{
          display: "flex",
          gap: 20,
          marginVertical: 10,
          overflow: "visible",
          backgroundColor: "transparent",
        }}
      >
        <UserQueryBox
          colorScheme={colorScheme}
          // isEditable={false}
          userRequest={item}
        />
        <OpenAiAnswerBox item={item} />
      </View>
    );
  }
}

function HomePage() {
  const donkiContext = useContext(TheDonkiContext);
  const colorContext = useContext(ColorContext);
  const [displayDropdown, setDisplayDropdown] = useState<boolean>(false);
  const flatList = useRef<FlatList<any>>(null);
  const [question, setQuestion] = useState<string>("");
  const colorScheme = colorContext?.colorScheme ?? "light";
  const [isEnabled, setIsEnabled] = useState(
    colorContext!.colorScheme == "dark"
  );
  let listOfQueryAndAnswers = donkiContext?.listOfQueryAndAnswers;
  useEffect(() => {
    setIsEnabled(colorContext!.colorScheme == "dark");
  }, [colorContext!.colorScheme]);

  /** Switches between theme of the application*/
  const toggleTheme = () => {
    setIsEnabled((previousState) => !previousState);
    if (isEnabled) {
      colorContext?.setColorScheme("light");
    } else {
      colorContext?.setColorScheme("dark");
    }
  };

  //This bannerSource is the donki logo that displays above the text box on initial render
  //checks the theme of the app and makes changes to the source as needed
  const bannerSource =
    colorScheme === "light"
      ? require("../assets/images/light_mode_banner.png")
      : require("../assets/images/dark_mode_banner.png");

  //This does the same as above except for the stop button source
  const stopButtonSource =
    colorScheme === "light"
      ? require("../assets/images/stop_light.png")
      : require("../assets/images/stop_dark.png");

  /**This function helps select the user file selection  */
  const selectPdfFile = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (document) {
        const fileData = {
          mimeType: document.assets![0].mimeType,
          name: document.assets![0].name.split(".")[0],
          size: document.assets![0].size,
          uri: document.assets![0].uri,
          type: "application/pdf",
        };
        donkiContext?.setUserFileResponse(fileData);
      } else {
        console.log("No document selected.");
      }
    } catch (error) {
      console.log("Error selecting document:", error);
    }
  };

  // useEffect(() => {
  //   if (listOfQueryAndAnswers!.length > previousLength.current) {
  //     // Only scroll if new items are added
  //     flatList.current?.scrollToEnd();
  //   }
  //   previousLength.current = listOfQueryAndAnswers!.length;
  // }, [listOfQueryAndAnswers]);

  const sendQueryToAi = (question: string) => {
    if (question.trim().length > 0) {
      donkiContext?.setStopButton(true);
      const newQueryAndAnswer = {
        ...donkiContext?.queryAndAnswer,
        id: uuid.v4().toString(),
        query: question.trim(),
        answer: "",
        isEditable: false,
      }; // Create a new object with the updated id
      donkiContext?.setQueryAndAnswer(newQueryAndAnswer);
      donkiContext?.addTolistOfQueryAndAnswers(newQueryAndAnswer);
      setQuestion("");
      Keyboard.dismiss();
    } else {
      return;
    }
  };

  //Start of animation section
  const opacity = useSharedValue(0);
  const imageYAxis = useSharedValue(40);
  const OFFSET = 0;
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: imageYAxis.value }],
  }));

  const duration = 1500;
  useEffect(() => {
    if (listOfQueryAndAnswers?.length! == 0) {
      opacity.value = withTiming(1, { duration });
      imageYAxis.value = withTiming(OFFSET, { duration });
    } else {
      opacity.value = withTiming(0, { duration });
    }
  }, [listOfQueryAndAnswers]);
  //End of animation section

  const BottomQuestions = () => {
    return (
      <Animated.FlatList
        horizontal
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        legacyImplementation={false}
        data={prompts}
        renderItem={({ item }) => (
          <Pressable onPress={() => sendQueryToAi(item.prompt)}>
            <Animated.View
              style={[
                styles.itemContainer,
                imageStyle,
                {
                  borderColor: Colors[colorScheme].textBorderColor,
                  opacity,
                },
              ]}
            >
              <Text
                style={[
                  styles.promptText,
                  {
                    color: Colors[colorScheme].prompts,
                  },
                ]}
                numberOfLines={3}
              >
                {item.prompt}
              </Text>
            </Animated.View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
        style={[styles.flatListStyle]}
      />
    );
  };

  const DonkiDropdown = () => {
    const dropdownItems = [
      {
        icon: (
          <MessageCircleWarning
            size={20}
            color={Colors[colorScheme].dropdownTextColor}
          />
        ),
        label: "About Us",
        path: "/about",
      },
      {
        icon: (
          <HandHeart size={20} color={Colors[colorScheme].dropdownTextColor} />
        ),
        label: "Donate",
        path: "/donate",
      },
    ];
    return (
      <View
        style={[
          style.settings,
          {
            backgroundColor: Colors[colorScheme].dropdownBG,
            shadowColor: "#000",
          },
        ]}
      >
        <View style={{ backgroundColor: "transparent" }}>
          <Link href="/About">
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
                gap: 10,
                padding: 10,
                backgroundColor: "transparent",
              }}
            >
              {dropdownItems[0].icon}
              <Text
                style={{
                  color: Colors[colorScheme].dropdownTextColor,
                }}
              >
                {dropdownItems[0].label}
              </Text>
            </View>
          </Link>
          <Link href="/donate">
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
                gap: 10,
                padding: 10,
                backgroundColor: "transparent",
              }}
            >
              {dropdownItems[1].icon}
              <Text
                style={{
                  color: Colors[colorScheme].dropdownTextColor,
                }}
              >
                {dropdownItems[1].label}
              </Text>
            </View>
          </Link>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Sun
            size={25}
            color={Colors[colorScheme].dropdownTextColor}
            style={{ marginRight: 10 }}
          />
          <Switch
            trackColor={{ false: "transparent", true: "transparent" }}
            thumbColor={isEnabled ? "#ffffffab" : "#ffff0094"}
            ios_backgroundColor="transparent"
            onValueChange={toggleTheme}
            value={isEnabled}
            style={{
              transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }],
              position: "absolute",
              zIndex: 10000,
            }}
          />

          <Moon size={25} color={Colors[colorScheme].dropdownTextColor} />
        </View>
      </View>
    );
  };

  const getInfoFromBackend = async () => {
    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/info/1`;
    const response = await fetch(url);
    if(response){

    }
  };
  useEffect(() => {
    if (colorContext?.displayToast) {
      setTimeout(() => {
        colorContext.setToastDisplay(false);
      }, 3000);
    }
  }, [colorContext?.displayToast]);

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   // keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 100}
    //   style={{ flex: 1 }}
    // >
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: Colors[colorScheme ?? "light"].background,
          position: "relative",
        },
      ]}
    >
      <View
        style={[
          style.container,
          {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            position: "relative",
          },
        ]}
      >
        {colorContext?.displayToast && <Toast />}
        {displayDropdown && <DonkiDropdown />}
        {displayDropdown && (
          <TouchableOpacity
            onPress={() => setDisplayDropdown(false)}
            style={{
              position: "absolute",
              zIndex: 9999,
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 9999,
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
              }}
            ></View>
          </TouchableOpacity>
        )}

        <View style={[style.topBar, { zIndex: 10000 }]}>
          <View style={style.searchIcon}>
            <Pressable
              onPress={() => {
                setDisplayDropdown(false);
                donkiContext?.setListOfQueryAndAnswers([]);
                donkiContext?.setStopButton(false);
                donkiContext?.stopResponseFunc();
              }}
              style={style.seekRow}
            >
              <Image
                source={require("../assets/images/search.png")}
                style={style.image}
              />
            </Pressable>
          </View>
          <View style={{ backgroundColor: "transparent" }}>
            <Pressable
              onPress={() => {
                // setDisplayDropdown(!displayDropdown);
                setDisplayDropdown(!displayDropdown);
              }}
              style={style.seekRow}
            >
              <View style={[style.searchIcon]}>
                <Image
                  source={require("../assets/images/donkiLogo.png")}
                  style={style.image}
                />
              </View>
              <Image
                source={require("../assets/images/down.png")}
                style={[
                  style.arrow,
                  {
                    transform: [
                      {
                        rotate: displayDropdown ? "180deg" : "0deg",
                      },
                    ],
                    tintColor: Colors[colorScheme].dropdownTextColor,
                  },
                ]}
              />
            </Pressable>
          </View>
        </View>

        {listOfQueryAndAnswers?.length != 0 && (
          <FlatList
            data={listOfQueryAndAnswers}
            keyExtractor={(item) => item.id!}
            ref={flatList}
            // onContentSizeChange={() => {
            //   flatList.current?.scrollToEnd();
            // }}
            style={{
              flex: 2,
              backgroundColor: "transparent",
              minHeight: donkiContext?.listOfQueryAndAnswers.some(
                (item) => item.isEditable
              )
                ? Math.round(Dimensions.get("window").height - 200)
                : 100,
            }}
            renderItem={({ item }) => (
              <DisplayQueryAndAnswer
                colorScheme={colorScheme}
                item={item}
                key={item.id}
              />
            )}
            // keyboardShouldPersistTaps="always"
            initialNumToRender={5} // Number of items to render initially
            // maxToRenderPerBatch={5} // Limits the items rendered per frame
          />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled={false}

          // keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 100}
          // style={{ flex: 1 }}
        >
          <View
            style={{ gap: 30, display: "flex", backgroundColor: "transparent" }}
          >
            {listOfQueryAndAnswers?.length == 0 && (
              <Animated.Image
                source={bannerSource}
                style={[
                  imageStyle,
                  {
                    objectFit: "contain",
                    width: 260,
                    alignContent: "center",
                    alignSelf: "center",
                    opacity,
                    position: "relative",
                  },
                ]}
              />
            )}

            <View style={style.inputContainer}>
              <View
                style={[
                  style.inputContainerInputBox,
                  {
                    borderColor: colorScheme == "light" ? "#EDEDF1" : "#363944",
                    padding: 5,
                  },
                ]}
              >
                <Pressable onPress={() => selectPdfFile()}>
                  <Paperclip size={24} color="#1F75FE" />
                </Pressable>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "transparent",
                    // paddingVertical: 5,
                  }}
                >
                  {donkiContext?.userFile != null && (
                    <View
                      style={[
                        style.pdfDisplay,
                        {
                          backgroundColor:
                            Colors[colorScheme ?? "light"].pdfColor,
                          maxWidth: "70%",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          style.input,
                          {
                            color: Colors[colorScheme ?? "light"].text,
                            width: "90%",
                          },
                        ]}
                      >
                        {donkiContext?.userFile!["name"]!}
                      </Text>
                      <Pressable
                        onPress={() => donkiContext.setUserFileResponse(null)}
                      >
                        <CircleX
                          size={20}
                          color={Colors[colorScheme].dropdownTextColor}
                        />
                      </Pressable>
                    </View>
                  )}

                  <TextInput
                    value={question}
                    onChangeText={setQuestion}
                    style={[
                      style.input,
                      { color: Colors[colorScheme ?? "light"].text },
                    ]}
                    multiline={true}
                  />
                </View>
              </View>

              <Pressable
                onPress={() =>
                  donkiContext?.stopButton
                    ? donkiContext.stopResponseFunc()
                    : sendQueryToAi(question)
                }
              >
                <Image
                  source={
                    donkiContext?.stopButton
                      ? stopButtonSource
                      : require("../assets/images/donki_search_log.png")
                  }
                  style={style.donkiLogImage}
                />
              </Pressable>
            </View>
            {listOfQueryAndAnswers?.length == 0 && (
              <View
                style={{
                  backgroundColor: "transparent",
                  alignContent: "center",
                }}
              >
                <Text
                  style={{
                    color: Colors[colorScheme].info,
                    alignSelf: "center",
                    fontSize: 12,
                  }}
                >
                  This platform is supported by voluntary donations.
                </Text>
                <Link
                  href="/donate"
                  style={{
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#1F75FE",
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    Please support our work.
                  </Text>
                </Link>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>

        {/* This is the body of the dropdown */}
        {donkiContext?.tapVertices != null && (
          <View
            style={{
              width: "100%",
              position: "absolute",
              zIndex: 10000,
              left: donkiContext.isAiDropdown
                ? donkiContext.tapVertices["x"]
                : donkiContext.tapVertices["x"] - 20,
              top: donkiContext.isAiDropdown
                ? donkiContext.tapVertices["y"] - 100
                : donkiContext.tapVertices["y"] - 60,
            }}
          >
            <DropdownList colorScheme={colorScheme} />
          </View>
        )}
        {donkiContext?.tapVertices != null && (
          <TouchableOpacity
            onPress={() => {
              donkiContext?.setTapVertices(null);
              donkiContext.setIsAiDropdown(false);
              donkiContext.setTappedQueryAndAnswer(undefined);
            }}
            style={{
              position: "absolute",
              zIndex: 9999,
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 9999,
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
              }}
            ></View>
          </TouchableOpacity>
        )}
        {/* End of dropdown */}

        {/* This is the flatlist for the bottom questions/promps */}
        {listOfQueryAndAnswers?.length == 0 && <BottomQuestions />}
      </View>
    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
}

export default React.memo(HomePage);

export const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    display: "flex",
    justifyContent: "space-between",
  },

  topBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "visible",
    backgroundColor: "transparent",
  },

  searchIcon: {
    height: 32,
    width: 32,
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
    width: 20,
    height: 20,
    tintColor: "blue",
    marginLeft: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  settings: {
    position: "absolute",
    top: 40,
    zIndex: 10000,
    right: 10,
    width: 150,
    padding: 20,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginVertical: 5,
  },
  inputContainerInputBox: {
    backgroundColor: "transparent",
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 6,
    flex: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    alignItems: "center",
    borderRadius: 30,
    overflow: "hidden",
  },

  input: {
    // padding: 5,
    backgroundColor: "transparent",
    // flex: 2,
    fontSize: 14,
  },

  donkiLogImage: {
    // width: 32,
    // height: 32,
    width: 45,
    height: 45,
  },
  pdfDisplay: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: "space-between",
  },
});

const styles = StyleSheet.create({
  flatListStyle: {
    maxHeight: 130,
    marginTop: 20,
  },
  flatListContainer: {
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 25,
  },

  itemContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: SCREEN_WIDTH - 150, // Screen width with padding for a centered look
    maxHeight: 100, // Set an appropriate maxHeight based on text content
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  promptText: {
    fontSize: 12, // Adjust font size as needed
    fontWeight: "400",
    lineHeight: 18,
  },
});

////TODO -   the last item in the array doen'st allow me eidt it, Pop up when the admin makes a change in the backend, info/1,
//change the view backgroudnf rothe t
