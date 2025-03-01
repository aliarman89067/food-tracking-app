import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import LottieView from "lottie-react-native";
import { COLORS } from "@/constants/Colors";
import { FONTFAMILY } from "@/constants/fontFamily";
import { heightPercentage } from "@/utils";
import asyncStorage from "@react-native-async-storage/async-storage";
import bucketAnimation from "@/assets/animations/bucket.json";
import { useAddStore } from "@/context/store";

interface DishCardProps {
  label: string;
  savedFoodIds?: string[] | null;
  setSavedFoodIds?: Dispatch<SetStateAction<string[] | null>>;
  cuisineName?: string | undefined;
  item: {
    _id: string;
    imageUrl: string;
    name: string;
    type: string;
  };
}

export default function DishCardItem({
  label,
  savedFoodIds,
  setSavedFoodIds,
  cuisineName,
  item,
}: DishCardProps) {
  const [currentFoodId, setCurrentFoodId] = useState("");
  const { setIsAdd } = useAddStore();
  const handleAdd = async ({
    _id,
    name,
    imageUrl,
    cuisineName,
    cuisineType,
  }: {
    _id: string;
    name: string;
    imageUrl: string;
    cuisineName: string;
    cuisineType: string;
  }) => {
    setCurrentFoodId(_id);
    setIsAdd(false);
    setTimeout(() => {
      setIsAdd(true);
    }, 5);
    if (setSavedFoodIds) {
      setSavedFoodIds([...(savedFoodIds || []), _id]);
    }
    const prevData = await asyncStorage.getItem("food-tracking-data");
    if (prevData) {
      await asyncStorage.setItem(
        "food-tracking-data",
        JSON.stringify([
          { _id, name, imageUrl, cuisineName, type: label, cuisineType },
          ...JSON.parse(prevData),
        ])
      );
    } else {
      await asyncStorage.setItem(
        "food-tracking-data",
        JSON.stringify([{ _id, name, imageUrl, cuisineName, type: label }])
      );
    }
  };

  return (
    <View key={item._id} style={styles.card}>
      <Image
        style={[
          styles.image,
          { opacity: savedFoodIds?.includes(item._id) ? 0.4 : 1 },
        ]}
        source={{ uri: item.imageUrl }}
        alt={`${item.name} cuisine image`}
        resizeMode="cover"
      />
      {!currentFoodId && savedFoodIds && savedFoodIds.includes(item._id) && (
        <Text style={styles.alreadyText}>Added</Text>
      )}
      {item._id === currentFoodId && (
        <View style={styles.animationBox}>
          <LottieView
            source={bucketAnimation}
            autoPlay
            loop={false}
            style={{ width: "100%", height: "100%" }}
            onAnimationFinish={() => setCurrentFoodId("")}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={() =>
          handleAdd({
            _id: item._id,
            name: item.name,
            imageUrl: item.imageUrl,
            cuisineName: cuisineName!,
            cuisineType: item.type,
          })
        }
        disabled={savedFoodIds?.includes(item._id)}
        style={[
          styles.addButtonBox,
          { opacity: savedFoodIds?.includes(item._id) ? 0.7 : 1 },
        ]}
      >
        <Text style={styles.addButtonText}>Add</Text>
        <Text style={[styles.addButtonText, { fontFamily: FONTFAMILY.Bold }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
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
    color: COLORS.black,
    fontSize: 18,
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
    textAlign: "center",
  },
  alreadyText: {
    position: "absolute",
    top: "28%",
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
