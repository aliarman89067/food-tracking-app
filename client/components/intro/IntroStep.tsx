import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Keyboard,
} from "react-native";
import LottieView from "lottie-react-native";
import { heightPercentage, widthPercentage } from "@/utils";
import { inputBg } from "@/constants/Images";
import { COLORS } from "@/constants/Colors";
import { FONTFAMILY } from "@/constants/fontFamily";

interface IntroStepProps {
  nameInput: string;
  setNameInput: Dispatch<SetStateAction<string>>;
}

const IntroStep = ({ nameInput, setNameInput }: IntroStepProps) => {
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    const handleKeyboardHide = () => {
      inputRef?.current?.blur();
    };

    Keyboard.addListener("keyboardDidHide", handleKeyboardHide);
    return () => {
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.animationBox}>
        <LottieView
          source={require("@/assets/animations/burger.json")}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
      <ImageBackground
        source={inputBg}
        style={styles.inputBackground}
        imageStyle={{ opacity: 0.6 }}
        resizeMode="contain"
      >
        <View style={styles.inputBox}>
          <Text style={styles.inputTitle}>Enter your name</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={nameInput}
            onChangeText={setNameInput}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  animationBox: {
    width: widthPercentage(80),
    height: heightPercentage(35),
    display: "flex",
    justifyContent: "center",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  inputBackground: {
    width: "100%",
    height: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    width: "100%",
    paddingHorizontal: widthPercentage(10),
  },
  inputTitle: {
    color: COLORS.white,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 7,
    fontFamily: FONTFAMILY.Black,
  },
  input: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    borderColor: COLORS.white,
    borderStyle: "solid",
    borderWidth: 2,
    fontFamily: FONTFAMILY.Medium,
    color: COLORS.white,
    paddingHorizontal: 16,
  },
});

export default IntroStep;
