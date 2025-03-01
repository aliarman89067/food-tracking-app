import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import axios from "axios";
import { BASE_URL } from "@/constants/config";
import { COLORS } from "@/constants/Colors";
import FoodCard from "@/components/foods/FoodCard";
import { widthPercentage } from "@/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FONTFAMILY } from "@/constants/fontFamily";
import asyncStorage from "@react-native-async-storage/async-storage";
import DishCard from "@/components/foods/DishCard";

type FoodsDataType = {
  label: string;
  data: { _id: string; imageUrl: string; name: string; type: string }[];
}[];

const Food = () => {
  const { id, name } = useLocalSearchParams();
  const pathName = usePathname();
  const [foodsData, setFoodsData] = useState<null | FoodsDataType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedFoodIds, setSavedFoodIds] = useState<null | string[]>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setFoodsData(null);
    const loadFoods = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/foods/${id}`);
        if (data && data.data) {
          const types = ["Break Fast", "Dinner & Lunch", "Snacks"];
          const breakfastData = data.data.foods.filter(
            (item: any) => item.type === "Break Fast"
          );
          const lunchAndDinnerData = data.data.foods.filter(
            (item: any) => item.type === "Dinner & Lunch"
          );
          const snacksData = data.data.foods.filter(
            (item: any) => item.type === "Snacks"
          );
          setFoodsData([
            { data: breakfastData, label: "Break Fast" },
            { data: lunchAndDinnerData, label: "Dinner & Lunch" },
            { data: snacksData, label: "Snacks" },
          ]);
        } else {
          setFoodsData(null);
        }

        const foodData = await asyncStorage.getItem("food-tracking-data");
        if (foodData) {
          const parsedData = JSON.parse(foodData);
          const prevFoodsIds = parsedData.map((item: any) => item._id);
          setSavedFoodIds(prevFoodsIds);
        } else {
          setSavedFoodIds(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFoods();
  }, [id, pathName]);
  return (
    <View style={{ height: "100%", width: "100%" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {isLoading && !foodsData && (
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size={30} color={COLORS.orange} />
            </View>
          )}
          {!isLoading && foodsData && (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => router.push("/foods")}
                activeOpacity={0.7}
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginVertical: 20,
                  paddingBottom: 4,
                  borderBottomColor: COLORS.peach,
                  borderBottomWidth: 1,
                }}
              >
                <AntDesign name="arrowleft" size={18} color={COLORS.peach} />
                <Text
                  style={{
                    fontFamily: FONTFAMILY.Regular,
                    fontSize: 16,
                    color: COLORS.peach,
                  }}
                >
                  {name}
                </Text>
              </TouchableOpacity>
              <View style={styles.mapContainer}>
                {foodsData.map((item) => (
                  <DishCard
                    key={item.label}
                    {...item}
                    savedFoodIds={savedFoodIds}
                    setSavedFoodIds={setSavedFoodIds}
                    cuisineName={name as string}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: widthPercentage(5),
  },
  mapContainer: {
    gap: 20,
  },
});

export default Food;
