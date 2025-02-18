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
import { router, usePathname } from "expo-router";
import asyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/constants/Colors";
import { FONTFAMILY } from "@/constants/fontFamily";
import { widthPercentage } from "@/utils";
import { emptyHistory } from "@/constants/Images";
import { LinearGradient } from "expo-linear-gradient";
import HistoryRow from "@/components/history/HistoryRow";

const History = () => {
  const pathName = usePathname();

  const [data, setData] = useState<
    | null
    | {
        _id: string;
        name: string;
        imageUrl: string;
        cuisineName: string;
        now: number;
      }[]
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

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

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await asyncStorage.setItem(
        "food-tracking-selected-foods",
        JSON.stringify([])
      );
      setData([]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsRemoving(false);
    }
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
            source={emptyHistory}
            alt="Empty Cart Image"
            resizeMode="contain"
            style={styles.emptyImage}
          />
          <TouchableOpacity
            style={{ width: "100%" }}
            activeOpacity={0.7}
            onPress={() => router.push("/")}
          >
            <LinearGradient
              colors={[COLORS.peach, COLORS.orange, COLORS.peach]}
              style={styles.emptyCtaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.emptyCtaText}>Try Now</Text>
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
              {data.length} {data.length === 1 ? "Item" : "Items"} Found
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
            keyExtractor={({ now }) => now.toString()}
            contentContainerStyle={{ gap: 15 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <HistoryRow
                key={index}
                index={index}
                {...item}
                removeHistory={() => setData(null)}
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

export default History;
