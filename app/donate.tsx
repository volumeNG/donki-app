import React, { useContext } from "react";
import { TheDonkiContext } from "@/context/TheDonkiProvider";
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { ColorContext } from "@/context/DonkiColorProvider";

function Donate() {

  const colorContext = useContext(ColorContext);

  const colorScheme = colorContext?.colorScheme ?? "light";
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
        padding: 24,
      }}
    >
      <Text
        style={[
          styles.header,
          {
            color: Colors[colorScheme ?? "light"].text,
          },
        ]}
      >
        How to Donate to{" "}
        <Link href="https://thedonki.org/" style={styles.link}>
          theDonki.org
        </Link>
      </Text>
      <ScrollView>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          Our mission is to make biblical knowledge accessible to everyone,
          empowering you to explore the Scriptures and deepen your understanding
          through advanced AI technology.
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          This platform thrives solely through the generosity of individuals who
          share our vision. Your support is essential for maintaining the
          website and ensuring it remains available to those seeking to grow in
          their faith and understanding of God’s Word.
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          If you find{" "}
          <Link href="https://thedonki.org/" style={styles.link}>
            theDonki.org
          </Link>{" "}
          valuable in your studies or share our vision of spreading knowledge
          globally, we invite you to consider making a donation. Every
          contribution, no matter the size, is crucial in keeping this platform
          operational and expanding its features for all who seek to learn.
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          We trust in God’s provision and are genuinely grateful for your
          willingness to support this mission. Thank you for being part of our
          community as we strive to make the Word accessible to everyone,
          everywhere.
        </Text>
        <Text
          style={[
            styles.header,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          How to Donate
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          You can make a donation via email (please request our donation
          information) or through PayPal. Your support enables us to continue
          this important work!
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
            backgroundColor: "transparent",
            marginVertical: 10,
          }}
        >
          <Pressable
            onPress={() => Linking.openURL("mailto:we@donki.org")}
            style={styles.button}
          >
            <Text
              style={{
                color: Colors[colorScheme ?? "light"].text,
                fontWeight: "500",
              }}
            >
              Send Email
            </Text>
          </Pressable>
          <Pressable onPress={() => {}} style={styles.button}>
            <Text
              style={{
                color: Colors[colorScheme ?? "light"].text,
                fontWeight: "500",
              }}
            >
              Paystack
            </Text>
          </Pressable>
        </View>
        <View style={{ backgroundColor: "transparent" }}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

export default Donate;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 38,
    marginBottom: 5,
  },
  text: {
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 22,
  },
  link: {
    fontWeight: "500",
    color: "#1F75FE",
  },
  button: {
    backgroundColor: "#1F75FE",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    fontWeight: "500",
  },
});
