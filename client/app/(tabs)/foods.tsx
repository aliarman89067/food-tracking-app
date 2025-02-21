import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { heightPercentage, widthPercentage } from "@/utils";
import GreetingHeader from "@/components/foods/GreetingHeader";
import axios from "axios";
import { COLORS } from "@/constants/Colors";
import { BASE_URL } from "@/constants/config";
import FoodCard from "@/components/foods/FoodCard";
import { usePathname } from "expo-router";

const Foods = () => {
  const [cuisinesData, setCuisinesData] = useState<
    null | { _id: string; foods: string[]; imageUrl: string; name: string }[]
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const pathName = usePathname();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/cuisines`);
        setCuisinesData(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && !cuisinesData && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={30} color={COLORS.orange} />
        </View>
      )}
      {!isLoading && cuisinesData && (
        <FlatList
          data={cuisinesData}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ marginTop: 20, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={() => <GreetingHeader />}
          ListHeaderComponentStyle={{ marginBottom: 20 }}
          renderItem={({ item, index }) => (
            <FoodCard key={item._id} {...item} index={index} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: widthPercentage(5),
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "90%",
  },
});

export default Foods;
