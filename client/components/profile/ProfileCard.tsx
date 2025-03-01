import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FONTFAMILY } from "@/constants/fontFamily";
import { COLORS } from "@/constants/Colors";
import { heightPercentage } from "@/utils";
import Entypo from "@expo/vector-icons/Entypo";
import ProfileRow from "./ProfileRow";
import { DataType } from "@/app/(tabs)/profile";

interface ProfileCardProps {
  cuisineName: string;
  items: {
    _id: string;
    name: string;
    imageUrl: string;
    cuisineName: string;
    cuisineType: string;
  }[];
  data: DataType | undefined;
  setData: Dispatch<SetStateAction<DataType | undefined>>;
}

export default function ProfileCard({
  cuisineName,
  items,
  data,
  setData,
}: ProfileCardProps) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShow(!show)}
        activeOpacity={0.7}
        style={{
          width: "100%",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 200,
          backgroundColor: COLORS.peach,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Text style={styles.labelText}>
            ({items.length}) {cuisineName}
          </Text>
          {show ? (
            <Entypo name="chevron-small-up" size={24} color={COLORS.white} />
          ) : (
            <Entypo name="chevron-small-down" size={24} color={COLORS.white} />
          )}
        </View>
      </TouchableOpacity>
      {show && (
        <View style={styles.mapContainer}>
          {items.map((item) => (
            <ProfileRow key={item._id} setData={setData} {...item} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 20,
    width: "100%",
  },
  labelText: {
    fontFamily: FONTFAMILY.Regular,
    color: COLORS.white,
    fontSize: 16,
  },
  card: {
    position: "relative",
    width: "48%",
    marginBottom: 16,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: heightPercentage(22),
    borderRadius: 10,
  },
  name: {
    fontFamily: FONTFAMILY.Regular,
    fontSize: 14,
    color: COLORS.black,
    marginTop: 5,
  },
  addButtonBox: {
    width: "100%",
    height: 55,
    borderRadius: 6,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 3,
  },
  addButtonText: {
    color: COLORS.white,
    fontFamily: FONTFAMILY.Regular,
    fontSize: 12,
  },
  alreadyText: {
    position: "absolute",
    top: "36%",
    fontFamily: FONTFAMILY.Black,
    fontSize: 30,
    color: COLORS.black,
    transform: [{ rotate: "-45deg" }],
  },
  mapContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    overflow: "hidden",
    gap: 15,
  },
  animationBox: {
    width: 120,
    height: 120,
    position: "absolute",
    top: "7%",
  },
});
