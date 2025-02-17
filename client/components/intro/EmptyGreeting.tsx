import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import smileyAnimation from "@/assets/animations/smiley.json";
import { COLORS } from "@/constants/Colors";
import { FONTFAMILY } from "@/constants/fontFamily";
import { widthPercentage } from "@/utils";

const EmptyGreeting = ({ name }: { name: string }) => {
  return (
    <View style={styles.emptyContainer}>
      <LinearGradient
        style={styles.emptyGradientContainer}
        colors={["#fff", "#efd3d7", "#fff"]}
      >
        <View style={styles.emptyTextContainer}>
          <Text style={styles.emptyText1}>Welcome</Text>
          <Text style={styles.emptyText2}>{name}</Text>
        </View>
        <View style={styles.emptyAnimationBox}>
          <LottieView
            source={smileyAnimation}
            autoPlay
            loop
            style={styles.emptyAnimation}
          />
        </View>
        <TouchableOpacity
          onPress={() => router.push("/foods")}
          activeOpacity={0.7}
          style={styles.emptyCtaContainer}
        >
          <LinearGradient
            colors={[COLORS.peach, COLORS.orange, COLORS.peach]}
            style={styles.emptyCtaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.emptyCtaText}>Start Journey</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyGradientContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    paddingVertical: 20,
  },
  emptyTextContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emptyText1: {
    fontFamily: FONTFAMILY.Medium,
    fontSize: 20,
    color: COLORS.black,
  },
  emptyText2: {
    fontFamily: FONTFAMILY.light,
    fontSize: 35,
    color: COLORS.black,
  },
  emptyAnimationBox: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  emptyAnimation: {
    width: widthPercentage(50),
    height: widthPercentage(50),
  },
  emptyCtaContainer: {
    paddingHorizontal: widthPercentage(10),
  },
  emptyCtaGradient: {
    marginTop: 40,
    width: "100%",
    height: 60,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCtaText: {
    color: COLORS.white,
    fontFamily: FONTFAMILY.Medium,
    fontSize: 18,
  },
});

export default EmptyGreeting;
