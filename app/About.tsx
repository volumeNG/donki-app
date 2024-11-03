import React, { useContext } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { TheDonkiContext } from "@/context/TheDonkiProvider";
import Colors from "@/constants/Colors";

function About() {
  const donkiContext = useContext(TheDonkiContext);
  const colorScheme = donkiContext?.colorScheme ?? "light";
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
        padding: 24,
      }}
    >
      <ScrollView>
        <Text
          style={[
            styles.header,
            {
              color: Colors[colorScheme ?? "light"].text,
              marginBottom: 10,
            },
          ]}
        >
          About Us
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          Inspired by the story of Balaam and his donkey in Numbers 22:21-35,
          <Link href="https://thedonki.org/" style={styles.link}>
            {" "}
            theDonki.org{" "}
          </Link>
          is dedicated to enhancing your Biblical study and understanding. Just
          as God used the humble donkey to reveal His divine message, we believe
          that technology, inspired by God, can serve as a tool to deepen our
          knowledge of His Word.
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          Our AI-powered platform helps you quickly find Bible passages, answer
          scriptural questions, and explore the original Greek and Hebrew texts
          and manuscripts. The goal of{" "}
          <Link href="https://thedonki.org/" style={styles.link}>
            theDonki.org{" "}
          </Link>{" "}
          is to complement—not replace—the Bible and ordained ministers. While
          technology offers valuable insights, it is important to seek guidance
          from ordained ministers of the truth, especially for deep spiritual
          questions, as AI may not always provide complete or accurate answers.
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          Developed by Volume Technologies International in Abuja, Nigeria,
          under the inspiration of Mattaniah Okodugha,
          <Link href="https://thedonki.org/" style={styles.link}>
            {" "}
            theDonki.org{" "}
          </Link>
          is fully supported by voluntary donations and contributions. These
          contributions ensure the continuous maintenance and growth of the
          site, allowing it to remain a useful resource for your Bible study.
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          As you use this platform, remember that all things, including
          technology, are inspired by God Almighty and should be used in ways
          that glorify Him, the Author of life. Let{" "}
          <Link href="https://thedonki.org/" style={styles.link}>
            theDonki.org
          </Link>{" "}
          be a tool that aids your journey of faith, while also encouraging you
          to seek deeper understanding through prayer and the guidance of Holy
          Spirit.
        </Text>
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

export default About;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 38,
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
});
