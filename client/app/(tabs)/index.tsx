import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import asyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import { COLORS } from "@/constants/Colors";
import EmptyGreeting from "@/components/intro/EmptyGreeting";
import Wheel from "@/components/home/Wheel";
import { useNavigation } from "expo-router";
import { heightPercentage, widthPercentage } from "@/utils";
import { FONTFAMILY } from "@/constants/fontFamily";
import { messageCloud } from "@/constants/Images";
import MessageCloud from "@/components/messageCloud";

const Index = () => {
  const navigation = useNavigation();
  const pathName = usePathname();
  const [isAnimationSeen, setIsAnimationSeen] = useState(true);
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
  //     await asyncStorage.removeItem("food-tracking-home-walkthrough");
  //   };
  //   deleteData();
  // }, []);

  useEffect(() => {
    const getData = async () => {
      setName(null);
      setData(null);
      setIsLoading(true);
      try {
        const isAnimeSeen = await asyncStorage.getItem(
          "food-tracking-home-walkthrough"
        );
        if (isAnimeSeen !== "true") {
          navigation.setOptions({ tabBarStyle: { opacity: 0 } });
          setIsAnimationSeen(false);
        } else {
          navigation.setOptions({ tabBarStyle: { opacity: 1 } });
          setIsAnimationSeen(true);
        }

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
  console.log(isAnimationSeen);
  return (
    <>
      {!isLoading && !isAnimationSeen && name && (
        <View style={styles.animationContainer}>
          <MessageCloud resetState={setIsAnimationSeen} />
          <EmptyGreeting name={name} />
        </View>
      )}
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
      {!isLoading &&
        name &&
        (!data || (data && data.length < 1)) &&
        isAnimationSeen && <EmptyGreeting name={name} />}
      {!isLoading && data && data.length > 0 && isAnimationSeen && (
        <Wheel data={data} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
  },
});

export default Index;
