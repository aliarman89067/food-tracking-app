import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import asyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import { COLORS } from "@/constants/Colors";
import EmptyGreeting from "@/components/intro/EmptyGreeting";
import Wheel from "@/components/home/Wheel";

const Index = () => {
  const pathName = usePathname();
  const [name, setName] = useState<string | null>("");
  const [data, setData] = useState<
    | null
    | {
        _id: string;
        name: string;
        imageUrl: string;
        cuisineName: string;
        type: string;
      }[]
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  //
  type FoodsDataType =
    | {
        _id: string;
        name: string;
        imageUrl: string;
        cuisineName: string;
        type: string;
      }[];

  // useEffect(() => {
  //   const deleteData = async () => {
  //     console.log("Delete Data");
  //     await asyncStorage.removeItem("food-tracking-username");
  //     await asyncStorage.removeItem("food-tracking-data");
  //     await asyncStorage.removeItem("is-intro-seen");
  //     await asyncStorage.removeItem("food-tracking-selected-foods");
  //   };
  //   deleteData();
  // }, []);

  useEffect(() => {
    const getData = async () => {
      setName(null);
      setData(null);
      setIsLoading(true);
      try {
        const ownerName = await asyncStorage.getItem("food-tracking-username");
        setName(ownerName);

        const foodsData = await asyncStorage.getItem("food-tracking-data");
        if (foodsData) {
          const parsedData: FoodsDataType = JSON.parse(foodsData);
          setData(parsedData);
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
    <>
      {isLoading && (
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
      {!isLoading && name && (!data || (data && data.length < 1)) && (
        <EmptyGreeting name={name} />
      )}
      {!isLoading && data && data.length > 0 && <Wheel data={data} />}
    </>
  );
};

export default Index;
