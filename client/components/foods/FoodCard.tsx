import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { heightPercentage } from "@/utils";
import { FONTFAMILY } from "@/constants/fontFamily";
import { COLORS } from "@/constants/Colors";
import { router } from "expo-router";
import { useAddStore } from "@/context/store";
import asyncStorage from "@react-native-async-storage/async-storage";

interface FoodCardProps {
  _id: string;
  name: string;
  imageUrl: string;
  foods?: string[];
  index: number;
  isFoodCard?: boolean;
  cuisineName?: string | undefined;
  savedFoodIds?: string[] | null;
  setSavedFoodIds?: Dispatch<SetStateAction<string[] | null>>;
}

const FoodCard = ({
  _id,
  name,
  imageUrl,
  foods,
  index,
  isFoodCard = false,
  cuisineName,
  savedFoodIds,
  setSavedFoodIds,
}: FoodCardProps) => {
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const { setIsAdd } = useAddStore();

  useEffect(() => {
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 500,
      delay: index * 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const cardOpacityInterpolate = cardOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleAdd = async () => {
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
          { _id, name, imageUrl, cuisineName },
          ...JSON.parse(prevData),
        ])
      );
    } else {
      await asyncStorage.setItem(
        "food-tracking-data",
        JSON.stringify([{ _id, name, imageUrl, cuisineName }])
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (!isFoodCard) {
          router.push({ params: { id: _id, name }, pathname: "/food" });
        }
      }}
      activeOpacity={isFoodCard ? 1 : 0.7}
      style={{
        width: "50%",
        height: "100%",
        paddingRight: index % 2 === 0 ? 5 : 0,
        paddingLeft: index % 2 !== 0 ? 5 : 0,
        opacity: cardOpacityInterpolate,
      }}
    >
      <View style={[styles.card]}>
        <Image
          style={[
            styles.image,
            { opacity: savedFoodIds?.includes(_id) ? 0.4 : 1 },
          ]}
          source={{ uri: imageUrl }}
          alt={`${name} cuisine image`}
          resizeMode="cover"
        />
        {savedFoodIds && savedFoodIds.includes(_id) && (
          <Text style={styles.alreadyText}>Added</Text>
        )}
        {isFoodCard ? (
          <TouchableOpacity
            onPress={handleAdd}
            disabled={savedFoodIds?.includes(_id)}
            style={[
              styles.addButtonBox,
              { opacity: savedFoodIds?.includes(_id) ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.addButtonText}>Add</Text>
            <Text
              style={[styles.addButtonText, { fontFamily: FONTFAMILY.Bold }]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.name}>{name}</Text>
            {foods && (
              <Text style={[styles.name, { fontSize: 12 }]}>
                {foods?.length} Foods
              </Text>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    width: "100%",
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
});

export default FoodCard;
