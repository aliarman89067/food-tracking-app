import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Image } from "react-native";
import cloudImage from "@/assets/app-images/messageCloud.png";
import LottieView from "lottie-react-native";
import avatarAnimation from "@/assets/animations/avatar.json";
import { heightPercentage } from "@/utils";
import { COLORS } from "@/constants/Colors";
import { FONTFAMILY } from "@/constants/fontFamily";
import { Animated } from "react-native";
import asyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

interface MessageCloudInterface {
  resetState: Dispatch<SetStateAction<boolean>>;
}

const MessageCloud = ({ resetState }: MessageCloudInterface) => {
  const navigation = useNavigation();
  const opacityAnime = useRef(new Animated.Value(0)).current;
  const [messageIndex, setMessageIndex] = useState(0);
  const [messages, setMessages] = useState([
    "Hello are you one of those who can't decide what to eat.",
    "Then this app is for you.",
    "Click on 'START JOURNEY' button and start your journey.",
  ]);
  useEffect(() => {
    Animated.timing(opacityAnime, {
      duration: 1000,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);
  const opacityInter = opacityAnime.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleIncreament = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex((prev) => prev + 1);
    }
  };
  const handleFinish = async () => {
    await asyncStorage.setItem("food-tracking-home-walkthrough", "true");
    navigation.setOptions({ tabBarStyle: { display: "block" } });
    resetState(true);
  };

  return (
    <Animated.View style={[styles.animationOverlay, { opacity: opacityInter }]}>
      <View style={styles.animationBox}>
        <View style={styles.contentContainer}>
          <View style={styles.textContentContainer}>
            <Text style={styles.messageText}>{messages[messageIndex]}</Text>
            {messageIndex < messages.length - 1 ? (
              <TouchableOpacity
                onPress={handleIncreament}
                activeOpacity={0.7}
                style={styles.nextButton}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleFinish}
                activeOpacity={0.7}
                style={styles.nextButton}
              >
                <Text style={styles.nextButtonText}>Finish</Text>
              </TouchableOpacity>
            )}
          </View>
          <Image
            source={cloudImage}
            alt="message cloud"
            style={styles.cloudImage}
          />
        </View>
        <View style={styles.animationAvatarBox}>
          <LottieView
            source={avatarAnimation}
            autoPlay
            loop
            style={styles.animationAvatar}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default MessageCloud;

const styles = StyleSheet.create({
  animationOverlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "100%",
    height: "100%",
    flexShrink: 0,
    flexGrow: 1,
    zIndex: 10,
  },
  animationBox: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    position: "relative",
    width: heightPercentage(50),
    height: heightPercentage(50),
    borderRadius: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  textContentContainer: {
    position: "absolute",
    alignItems: "center",
    width: "70%",
    justifyContent: "center",
    gap: 10,
    zIndex: 10,
  },
  messageText: {
    color: COLORS.black,
    fontFamily: FONTFAMILY.Bold,
    fontSize: 18,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: COLORS.peach,
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 100,
  },
  nextButtonText: {
    fontFamily: FONTFAMILY.Regular,
    color: COLORS.white,
    fontSize: 15,
  },
  cloudImage: {
    width: "120%",
    height: "120%",
    resizeMode: "contain",
  },
  animationAvatarBox: {
    width: heightPercentage(35),
    height: heightPercentage(35),
  },
  animationAvatar: {
    width: "100%",
    height: "100%",
  },
  skipButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  skipButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: FONTFAMILY.Regular,
  },
});
