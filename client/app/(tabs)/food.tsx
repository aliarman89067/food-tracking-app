import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
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
const Food = () => {
  const { id, name } = useLocalSearchParams();
  const pathName = usePathname();
  const [foodsData, setFoodsData] = useState<
    null | { _id: string; imageUrl: string; name: string }[]
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedFoodIds, setSavedFoodIds] = useState<null | string[]>(null);

  useEffect(() => {
    if (!id) return;
    const loadFoods = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/foods/${id}`);
        setFoodsData(data.data.foods);
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
    <View style={styles.container}>
      {isLoading && !foodsData && (
        <View>
          <ActivityIndicator size={30} color={COLORS.orange} />
        </View>
      )}
      {!isLoading && foodsData && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => router.push("/foods")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingVertical: 10,
            }}
          >
            <AntDesign name="arrowleft" size={18} color={COLORS.black} />
            <Text
              style={{
                fontFamily: FONTFAMILY.Regular,
                fontSize: 16,
                color: COLORS.black,
              }}
            >
              {name}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={foodsData}
            numColumns={2}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ marginTop: 20, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            ListHeaderComponentStyle={{ marginBottom: 20 }}
            renderItem={({ item, index }) => (
              <FoodCard
                key={item._id}
                {...item}
                index={index}
                isFoodCard
                cuisineName={name as string}
                savedFoodIds={savedFoodIds}
                setSavedFoodIds={setSavedFoodIds}
              />
            )}
          />
        </View>
      )}
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
});

export default Food;
