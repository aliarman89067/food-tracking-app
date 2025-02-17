import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { heightPercentage, widthPercentage } from "@/utils";
import { wheel } from "@/constants/Images";
import { COLORS } from "@/constants/Colors";
import { FONTFAMILY } from "@/constants/fontFamily";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import burgerAnimation from "@/assets/animations/burger.json";
import asyncStorage from "@react-native-async-storage/async-storage";

interface WheelProps {
  data: Array<{
    _id: string;
    name: string;
    imageUrl: string;
    cuisineName: string;
  }> | null;
}

const Wheel = ({ data }: WheelProps) => {
  const [selectedDish, setSelectedDish] = useState<null | {
    _id: string;
    name: string;
    imageUrl: string;
    cuisineName: string;
  }>(null);
  const [showSelectedDish, setShowSelectedDish] = useState(false);
  const [finalDish, setFinalDish] = useState<null | {
    _id: string;
    name: string;
    imageUrl: string;
    cuisineName: string;
  }>(null);

  const [isRetry, setIsRetry] = useState(false);

  const [isFinalDish, setIsFinalDish] = useState(false);

  const floatingAnimes = useRef(
    [0, 1, 2, 3].map(() => new Animated.Value(0))
  ).current;
  const floatingOpacities = useRef(
    [0, 1, 2, 3].map(() => new Animated.Value(0))
  ).current;
  const startingButtonOpacity = useRef(new Animated.Value(0)).current;
  const wheelXTranslate = useRef(new Animated.Value(0)).current;
  const wheelRotate = useRef(new Animated.Value(0)).current;
  const wheelOpacity = useRef(new Animated.Value(0)).current;
  const dishContainerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = floatingAnimes.map((anime, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anime, {
            toValue: 1,
            duration: 1000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anime, {
            toValue: 0,
            duration: 1000 + index * 500,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.parallel(animations).start();
  }, [floatingAnimes]);

  const handleStart = () => {
    if (!data) return;
    const randomDishNumber = Math.ceil(Math.random() * data.length - 1);
    const randomDish = data[randomDishNumber];
    setSelectedDish(randomDish);
    Animated.parallel([
      ...floatingOpacities.map((opacity, index) =>
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300 + index * 150,
          useNativeDriver: true,
        })
      ),
      Animated.timing(startingButtonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(wheelXTranslate, {
        duration: 600,
        toValue: 1,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(wheelRotate, {
          duration: 5000,
          toValue: 1,
          delay: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(wheelOpacity, {
            duration: 600,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dishContainerOpacity, {
            duration: 600,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(() => setShowSelectedDish(true));
  };

  const floatingInters = floatingAnimes.map((anime, index) =>
    anime.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15 - index * 5],
    })
  );

  const floatingOpacityInters = floatingOpacities.map((opacity) =>
    opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    })
  );

  const startingButtonInter = startingButtonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const wheelXTranslateInter = wheelXTranslate.interpolate({
    inputRange: [0, 1],
    outputRange: [0, heightPercentage(50) - widthPercentage(60)],
  });

  const wheelXRotateInter = wheelRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "1080deg"],
  });
  const wheelOpacityInter = wheelOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const dishContainerOpacityInter = dishContainerOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleTryAgain = () => {
    setIsRetry(true);
    wheelRotate.setValue(0);
    Animated.parallel([
      Animated.timing(wheelOpacity, {
        duration: 600,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(dishContainerOpacity, {
        duration: 600,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(wheelRotate, {
          duration: 5000,
          toValue: 1,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(wheelOpacity, {
            duration: 600,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dishContainerOpacity, {
            duration: 600,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(() => setIsRetry(false));
    setTimeout(() => {
      reSelectDish();
    }, 600);
  };

  const reSelectDish = () => {
    if (!data) return;
    const randomDishNumber = Math.ceil(Math.random() * data.length - 1);
    const randomDish = data[randomDishNumber];
    if (randomDish._id === selectedDish?._id && data.length > 1) {
      return reSelectDish();
    }
    setSelectedDish(randomDish);
  };

  const handleLike = async () => {
    const prevSelectedFoods = await asyncStorage.getItem(
      "food-tracking-selected-foods"
    );
    if (prevSelectedFoods) {
      const parsedPrevData = JSON.parse(prevSelectedFoods);
      await asyncStorage.setItem(
        "food-tracking-selected-foods",
        JSON.stringify([selectedDish, ...parsedPrevData])
      );
    } else {
      await asyncStorage.setItem(
        "food-tracking-selected-foods",
        JSON.stringify([selectedDish])
      );
    }
    setFinalDish(selectedDish);
    setIsRetry(true);
    Animated.parallel([
      Animated.timing(dishContainerOpacity, {
        duration: 600,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedDish(null);
      setIsRetry(false);
      setIsFinalDish(true);
    });
  };

  return (
    <View style={styles.container}>
      {isFinalDish && finalDish && (
        <View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LottieView
            source={burgerAnimation}
            autoPlay
            loop
            style={{ width: widthPercentage(50), height: widthPercentage(50) }}
          />
          <View
            style={{
              alignItems: "center",
              marginTop: 20,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: FONTFAMILY.Black,
                color: COLORS.black,
                fontSize: 30,
              }}
            >
              Great
            </Text>
            <Text
              style={{
                fontFamily: FONTFAMILY.Regular,
                color: COLORS.black,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Enjoy Your Meal!
            </Text>
            <Text
              style={{
                fontFamily: FONTFAMILY.Medium,
                color: COLORS.orange,
                fontSize: 25,
                textAlign: "center",
              }}
            >
              {finalDish.name}
            </Text>
          </View>
        </View>
      )}
      {selectedDish && showSelectedDish && (
        <Animated.View
          style={[styles.dishContainer, { opacity: dishContainerOpacityInter }]}
        >
          <View style={[styles.dishImageContainer]}>
            <Image
              source={{ uri: selectedDish.imageUrl }}
              alt={`${selectedDish.name} image`}
              resizeMode="cover"
              style={styles.dishImage}
            />
            <View style={styles.dishContentContainer}>
              <Text style={styles.dishName}>{selectedDish.name}</Text>
              <View style={styles.cuisineNameBox}>
                <Text style={styles.cuisineName}>
                  {selectedDish.cuisineName}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: widthPercentage(85),
              gap: 5,
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              disabled={isRetry}
              onPress={handleLike}
              activeOpacity={0.7}
              style={{ width: "100%" }}
            >
              <LinearGradient
                style={styles.ctaGradient}
                colors={[COLORS.peach, COLORS.orange, COLORS.peach]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>Yes I Like It</Text>
                <MaterialIcons name="done" size={20} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isRetry}
              onPress={handleTryAgain}
              activeOpacity={0.7}
              style={{ width: "100%" }}
            >
              <LinearGradient
                style={styles.ctaGradient}
                colors={[COLORS.peach, COLORS.orange, COLORS.peach]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>
                  I Don&apos;t Like It. Try Again!
                </Text>
                <Ionicons name="close" size={20} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      <View
        style={[
          styles.wheelContainer,
          { pointerEvents: !!selectedDish ? "none" : "auto" },
        ]}
      >
        <Animated.Image
          source={wheel}
          alt="Wheel Image"
          resizeMode="contain"
          style={[
            styles.wheelImage,
            {
              transform: [
                { translateY: wheelXTranslateInter },
                { rotate: wheelXRotateInter },
              ],
              opacity: wheelOpacityInter,
            },
          ]}
        />
        {data && data[0] && (
          <Animated.View
            style={[
              styles.floatingBox,
              {
                top: 10,
                left: 10,
                transform: [{ translateY: floatingInters[0] }],
                opacity: floatingOpacityInters[0],
              },
            ]}
          >
            <Image
              style={styles.floatingImage}
              source={{ uri: data[0].imageUrl }}
              alt={`${data[0].name} Image`}
              resizeMode="cover"
            />
          </Animated.View>
        )}
        {data && data[1] && (
          <Animated.View
            style={[
              styles.floatingBox,
              {
                bottom: 10,
                right: 10,
                transform: [{ translateY: floatingInters[1] }],
                opacity: floatingOpacityInters[1],
              },
            ]}
          >
            <Image
              style={styles.floatingImage}
              source={{ uri: data[1].imageUrl }}
              alt={`${data[1].name} Image`}
              resizeMode="cover"
            />
          </Animated.View>
        )}
        {data && data[2] && (
          <Animated.View
            style={[
              styles.floatingBox,
              {
                left: 10,
                bottom: 20,
                transform: [{ translateY: floatingInters[2] }],
                opacity: floatingOpacityInters[2],
              },
            ]}
          >
            <Image
              style={styles.floatingImage}
              source={{ uri: data[2].imageUrl }}
              alt={`${data[2].name} Image`}
              resizeMode="cover"
            />
          </Animated.View>
        )}
        {data && data[3] && (
          <Animated.View
            style={[
              styles.floatingBox,
              {
                right: 10,
                top: 20,
                transform: [{ translateY: floatingInters[3] }],
                opacity: floatingOpacityInters[3],
              },
            ]}
          >
            <Image
              style={styles.floatingImage}
              source={{ uri: data[3].imageUrl }}
              alt={`${data[3].name} Image`}
              resizeMode="cover"
            />
          </Animated.View>
        )}
      </View>
      <Animated.View
        style={{
          width: "100%",
          opacity: startingButtonInter,
          pointerEvents: !!selectedDish ? "none" : "auto",
        }}
      >
        <TouchableOpacity
          disabled={!!selectedDish}
          onPress={handleStart}
          activeOpacity={0.7}
          style={{ width: "100%" }}
        >
          <LinearGradient
            colors={[COLORS.peach, COLORS.orange, COLORS.peach]}
            style={styles.emptyCtaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.emptyCtaText}>Tell me what to eat!</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: widthPercentage(10),
    paddingVertical: 20,
    alignItems: "center",
    position: "relative",
  },
  wheelContainer: {
    position: "relative",
    width: widthPercentage(90),
    height: widthPercentage(90),
    alignItems: "center",
    justifyContent: "center",
  },
  wheelImage: {
    width: "90%",
    height: "90%",
  },
  floatingBox: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 7,
    padding: 5,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingImage: {
    width: "100%",
    height: "100%",
    borderRadius: 7,
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
  ctaText: {
    color: COLORS.white,
    fontFamily: FONTFAMILY.Medium,
    fontSize: 15,
  },
  dishContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingHorizontal: widthPercentage(15),
  },
  dishImageContainer: {
    width: widthPercentage(85),
    height: widthPercentage(80),
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    elevation: 10,
    marginTop: 20,
  },
  dishImage: {
    width: "100%",
    height: "75%",
    borderRadius: 20,
  },
  dishContentContainer: {
    width: "100%",
    alignItems: "center",
    gap: 2,
    marginTop: 6,
  },
  dishName: {
    fontFamily: FONTFAMILY.Bold,
    color: COLORS.black,
    fontSize: 20,
  },
  cuisineNameBox: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: COLORS.orange,
  },
  cuisineName: {
    fontFamily: FONTFAMILY.Regular,
    color: COLORS.white,
    fontSize: 14,
  },
  ctaGradient: {
    width: "100%",
    height: 50,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
});

export default Wheel;
