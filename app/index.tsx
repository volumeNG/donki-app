import React from "react";
import { useRef, useEffect } from "react";
import { Button, StyleSheet, useColorScheme, View } from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

function SplashScreen() {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/homepage");
    }, 7000);
    return () => clearTimeout(timer); 
  }, []);

  return (
    <View
      style={[
        styles.animationContainer,
        { backgroundColor: Colors["light"].background },
      ]}
    >
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 500,
          height: 500,
          backgroundColor: "transparent",
        }}
        source={require("../assets/lottie/data1.json")}
      />
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
