import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { COLORS } from "@/constants/Colors";
import { widthPercentage } from "@/utils";
import { FONTFAMILY } from "@/constants/fontFamily";
import AntDesign from "@expo/vector-icons/AntDesign";
import asyncStorage from "@react-native-async-storage/async-storage";
import { DataType } from "@/app/(tabs)/profile";

interface ProfileRowProps {
  index: number;
  _id: string;
  name: string;
  imageUrl: string;
  cuisineName: string;
  setData: Dispatch<SetStateAction<DataType | undefined>>;
}

const ProfileRow = ({
  index,
  _id,
  name,
  imageUrl,
  cuisineName,
  setData,
}: ProfileRowProps) => {
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const transformXAnimation = useRef(new Animated.Value(0)).current;

  const handleRemove = async () => {
    Animated.parallel([
      Animated.timing(opacityAnimation, {
        duration: 700,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(transformXAnimation, {
        duration: 600,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    const getData = await asyncStorage.getItem("food-tracking-data");
    const parsedData = JSON.parse(getData!) as {
      _id: string;
      name: string;
      imageUrl: string;
    }[];
    const filteredData = parsedData.filter((item) => item._id !== _id);
    await asyncStorage.setItem(
      "food-tracking-data",
      JSON.stringify(filteredData)
    );
    setTimeout(() => {
      setData((prevData) => prevData?.filter((item) => item._id !== _id) || []);
    }, 500);
  };
  const opacityInterpolate = opacityAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const transformInterpolate = transformXAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityInterpolate,
          transform: [{ translateX: transformInterpolate }],
        },
      ]}
    >
      <View style={styles.detailBox}>
        <Image
          style={styles.image}
          source={{ uri: imageUrl }}
          alt={`${name} image`}
          resizeMode="cover"
        />
        <View style={styles.contentBox}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.cuisineBox}>
            <Text style={styles.cuisineName}>{cuisineName}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={handleRemove} style={styles.deleteButton}>
        <AntDesign name="close" size={17} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 3,
    shadowOpacity: 0.4,
  },
  detailBox: {
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: widthPercentage(28),
    height: widthPercentage(26),
    maxWidth: 200,
    maxHeight: 200,
    borderRadius: 10,
  },
  contentBox: {
    gap: 6,
  },
  name: {
    fontFamily: FONTFAMILY.Regular,
    fontSize: 15,
    color: COLORS.black,
  },
  cuisineBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
  },
  cuisineName: {
    fontFamily: FONTFAMILY.Regular,
    fontSize: 13,
    color: COLORS.white,
  },
  deleteButton: {
    backgroundColor: "#fb6376",
    borderRadius: 15,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: "auto",
  },
});

export default ProfileRow;
