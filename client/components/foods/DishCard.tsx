import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { heightPercentage } from "@/utils";
import { FONTFAMILY } from "@/constants/fontFamily";
import { COLORS } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import DishCardItem from "./DishCardItem";

interface DishCardProps {
  label: string;
  data: { _id: string; name: string; imageUrl: string; type: string }[];
  savedFoodIds?: string[] | null;
  setSavedFoodIds?: Dispatch<SetStateAction<string[] | null>>;
  cuisineName?: string | undefined;
}

const DishCard = ({
  label,
  data,
  setSavedFoodIds,
  savedFoodIds,
  cuisineName,
}: DishCardProps) => {
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
            ({data.length}) {label}
          </Text>
          {show ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 1 }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 14,
                  fontFamily: FONTFAMILY.Regular,
                }}
              >
                Show Less
              </Text>
              <Entypo name="chevron-small-up" size={24} color={COLORS.white} />
            </View>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 1 }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 14,
                  fontFamily: FONTFAMILY.Regular,
                }}
              >
                Show All
              </Text>
              <Entypo
                name="chevron-small-down"
                size={24}
                color={COLORS.white}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
      {show ? (
        <View style={styles.mapContainer}>
          {data.map((item) => (
            <DishCardItem
              key={item._id}
              label={label}
              item={item}
              cuisineName={cuisineName}
              savedFoodIds={savedFoodIds}
              setSavedFoodIds={setSavedFoodIds}
            />
          ))}
        </View>
      ) : (
        <View style={styles.mapContainer}>
          {data.slice(0, 2).map((item) => (
            <DishCardItem
              key={item._id}
              label={label}
              item={item}
              cuisineName={cuisineName}
              savedFoodIds={savedFoodIds}
              setSavedFoodIds={setSavedFoodIds}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
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
  },
  animationBox: {
    width: 120,
    height: 120,
    position: "absolute",
    top: "7%",
  },
});

export default DishCard;
