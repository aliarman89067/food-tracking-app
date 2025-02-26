import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import asyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/constants/Colors";
import { heightPercentage, widthPercentage } from "@/utils";
import { emptyCart } from "@/constants/Images";
import { FONTFAMILY } from "@/constants/fontFamily";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import ProfileRow from "@/components/profile/ProfileRow";
import ProfileCard from "@/components/profile/ProfileCard";

export type DataType =
  | {
      cuisineName: string;
      items: {
        _id: string;
        name: string;
        imageUrl: string;
        cuisineName: string;
      }[];
    }[]
  | null;
const Profile = () => {
  const [data, setData] = useState<DataType>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  const pathName = usePathname();

  useEffect(() => {
    const getData = async () => {
      try {
        const foodData = await asyncStorage.getItem("food-tracking-data");
        if (foodData) {
          const parsedData = JSON.parse(foodData) as
            | {
                _id: string;
                name: string;
                imageUrl: string;
                cuisineName: string;
              }[]
            | null;
          const groupData: Record<
            string,
            { cuisineName: string; items: any[] }
          > | null = {};

          parsedData?.forEach((foodItem) => {
            if (!groupData[foodItem.cuisineName]) {
              groupData[foodItem.cuisineName] = {
                cuisineName: foodItem.cuisineName,
                items: [],
              };
            }
            groupData[foodItem.cuisineName].items.push({
              _id: foodItem._id,
              name: foodItem.name,
              imageUrl: foodItem.imageUrl,
              cuisineName: foodItem.cuisineName,
            });
          });
          const result = Object.values(groupData) as DataType;
          setData(result);
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

  // useEffect(() => {
  //   const removeData = async () => {
  //     await asyncStorage.removeItem("food-tracking-data");
  //   };
  //   removeData();
  // }, []);

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await asyncStorage.setItem("food-tracking-data", JSON.stringify([]));
      setData([]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsRemoving(false);
    }
  };

  const calculateItems = () => {
    let length: number = 0;
    data?.forEach((item) => {
      length += item.items.length;
    });
    return length;
  };

  return (
    <View style={styles.container}>
      {isLoading && !data && (
        <View style={styles.container}>
          <ActivityIndicator size={30} color={COLORS.orange} />
        </View>
      )}
      {!isLoading && ((data && data?.length < 1) || !data) && (
        <View style={styles.emptyContainer}>
          <Image
            source={emptyCart}
            alt="Empty Cart Image"
            resizeMode="contain"
            style={styles.emptyImage}
          />
          <TouchableOpacity
            style={{ width: "100%" }}
            activeOpacity={0.7}
            onPress={() => router.push("/foods")}
          >
            <LinearGradient
              colors={[COLORS.peach, COLORS.orange, COLORS.peach]}
              style={styles.emptyCtaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.emptyCtaText}>Start Journey</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      {!isLoading && data && data.length > 0 && (
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontFamily: FONTFAMILY.Regular,
                fontSize: 18,
                color: COLORS.black,
                marginBottom: 10,
              }}
            >
              {calculateItems()} {calculateItems() > 1 ? "Items" : "Item"} Added
            </Text>
            <TouchableOpacity
              onPress={handleRemove}
              activeOpacity={0.7}
              disabled={isRemoving}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 5,
                backgroundColor: "#fb6376",
              }}
            >
              <Text
                style={{
                  fontFamily: FONTFAMILY.Regular,
                  color: COLORS.white,
                  fontSize: 13,
                }}
              >
                Remove All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.cuisineName}
            contentContainerStyle={{ gap: 15 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ProfileCard
                key={index}
                cuisineName={item.cuisineName}
                items={item.items}
                data={data}
                setData={setData}
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
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: widthPercentage(7),
    paddingVertical: 20,
  },
  emptyContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    textAlign: "center",
    paddingHorizontal: widthPercentage(10),
  },
  emptyImage: {
    width: widthPercentage(60),
    height: widthPercentage(60),
  },
  emptyText: {
    fontFamily: FONTFAMILY.Bold,
    fontSize: 20,
    color: COLORS.black,
  },
  emptyCtaGradient: {
    marginTop: 40,
    width: "100%",
    height: 60,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCtaText: {
    color: COLORS.white,
    fontFamily: FONTFAMILY.Medium,
    fontSize: 18,
  },
});

export default Profile;
