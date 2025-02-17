import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/constants/Colors";
import IntroStep from "@/components/intro/IntroStep";
import { widthPercentage } from "@/utils";
import { FONTFAMILY } from "@/constants/fontFamily";
import asyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Intro = () => {
  const [nameInput, setNameInput] = useState("");

  const handleIntroComplete = async () => {
    if (!nameInput) return;
    try {
      await asyncStorage.setItem("food-tracking-username", nameInput);
      await asyncStorage.setItem("is-intro-seen", "true");
      router.replace("/(tabs)");
      setNameInput("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: COLORS.peach }]}>
        <IntroStep nameInput={nameInput} setNameInput={setNameInput} />
        <View
          style={{ paddingHorizontal: widthPercentage(10), marginBottom: 20 }}
        >
          <TouchableOpacity
            onPress={handleIntroComplete}
            disabled={!nameInput}
            style={[styles.buttonContainer, { opacity: nameInput ? 1 : 0.6 }]}
          >
            <Text style={styles.buttonText}>Let&apos;s Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FONTFAMILY.Medium,
    color: COLORS.black,
    fontSize: 16,
  },
});

export default Intro;
