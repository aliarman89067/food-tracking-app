import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import asyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/constants/Colors";
import { FONTFAMILY } from "@/constants/fontFamily";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import axios from "axios";
import { WEATHER_API } from "@/constants/config";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

const GreetingHeader = () => {
  const [name, setName] = useState<null | string>("");
  const [waetherInfo, setWeatherInfo] = useState<null | {
    type: string;
    iconCode: string;
  }>(null);
  useEffect(() => {
    const getName = async () => {
      const ownerName = await asyncStorage.getItem("food-tracking-username");
      setName(ownerName);
    };
    getName();

    const getWeather = async (lat: number, lon: number) => {
      const req = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API}`
      );
      const res = await req.json();
      setWeatherInfo({
        type: res.weather[0].main,
        iconCode: res.weather[0].icon,
      });
    };

    const getLongLat = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      getWeather(location.coords.latitude, location.coords.longitude);
    };
    getLongLat();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return (
        <>
          <Text style={styles.greetingText}>Good Morning</Text>
          <Feather name="sun" size={16} color={COLORS.white} />
        </>
      );
    } else if (hour >= 12 && hour < 18) {
      return (
        <>
          <Text style={styles.greetingText}>Good Afternoon</Text>
          <Entypo name="cloud" size={16} color={COLORS.white} />
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.greetingText}>Good Night</Text>
          <Ionicons name="moon" size={16} color={COLORS.white} />
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          {getGreeting()}
        </View>
        <Text style={styles.nameText}>{name?.split(" ")[0]}</Text>
      </View>
      <View>
        <Text style={styles.weatherTypeText}>{waetherInfo?.type}</Text>
        <Image
          style={styles.weatherIconImage}
          source={{
            uri: `http://openweathermap.org/img/w/${waetherInfo?.iconCode}.png`,
          }}
          alt="Weather Icon"
          tintColor="#fff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.peach,
  },
  textContainer: {
    gap: 4,
  },
  greetingText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTFAMILY.Bold,
  },
  nameText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTFAMILY.Medium,
  },
  weatherTypeText: {
    fontFamily: FONTFAMILY.Medium,
    fontSize: 13,
    color: COLORS.white,
  },
  weatherIconImage: {
    width: 30,
    height: 30,
  },
});

export default GreetingHeader;
