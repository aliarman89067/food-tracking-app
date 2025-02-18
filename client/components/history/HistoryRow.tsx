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

interface HistoryRowProps {
  index: number;
  _id: string;
  name: string;
  imageUrl: string;
  cuisineName: string;
  removeHistory: () => void;
  now: number;
}

const HistoryRow = ({
  index,
  _id,
  name,
  imageUrl,
  cuisineName,
  removeHistory,
  now,
}: HistoryRowProps) => {
  const formatUnixTime = (unixTime: number) => {
    const date = new Date(unixTime);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={[styles.container]}>
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
          <Text>{formatUnixTime(now)}</Text>
        </View>
      </View>
    </View>
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
    shadowRadius: 10,
    elevation: 5,
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

export default HistoryRow;
