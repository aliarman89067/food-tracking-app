import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { usePathname } from "expo-router";
import asyncStorage from "@react-native-async-storage/async-storage";

const History = () => {
  const pathName = usePathname();

  const [data, setData] = useState<
    | null
    | { _id: string; name: string; imageUrl: string; cuisineName: string }[]
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const historyData = await asyncStorage.getItem(
          "food-tracking-selected-foods"
        );
        if (historyData) {
          const parsedData = JSON.parse(historyData);
          setData(parsedData);
        } else {
          setData(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [pathName]);
  return (
    <View>
      <Text>{data && data[0].cuisineName}</Text>
    </View>
  );
};

export default History;
