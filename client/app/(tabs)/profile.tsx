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

const Profile = () => {
  const [data, setData] = useState<
    | null
    | { _id: string; name: string; imageUrl: string; cuisineName: string }[]
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const pathName = usePathname();

  useEffect(() => {
    console.log("Profile page mounts");
    const getData = async () => {
      try {
        const foodData = await asyncStorage.getItem("food-tracking-data");
        if (foodData) {
          const parsedData = JSON.parse(foodData);
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

  // useEffect(() => {
  //   const removeData = async () => {
  //     await asyncStorage.removeItem("food-tracking-data");
  //   };
  //   removeData();
  // }, []);
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
          <Text
            style={{
              fontFamily: FONTFAMILY.Regular,
              fontSize: 18,
              color: COLORS.black,
              marginBottom: 10,
            }}
          >
            {data.length} {data.length === 1 ? "Item" : "Items"} Added
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ gap: 15 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ProfileRow
                key={item._id}
                index={index}
                {...item}
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
