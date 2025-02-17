import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { COLORS } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";

const FoodInput = () => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const handleInputBlur = () => {
      inputRef?.current?.blur();
    };
    Keyboard.addListener("keyboardDidHide", handleInputBlur);
    return () => {
      Keyboard.removeAllListeners;
    };
  }, []);
  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Search by name"
      />
      <TouchableOpacity style={styles.button} activeOpacity={0.7}>
        <Feather name="search" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: 5,
    flexDirection: "row",
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: COLORS.black,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: COLORS.black,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FoodInput;
